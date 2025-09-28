const { google } = require("googleapis");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const axios = require("axios");
const querystring = require("querystring");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: crypto.randomBytes(16).toString("hex"),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Spotify credentials and Authorization flow
const S_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const S_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const S_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

app.get("/login/spotify", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const scope =
    "playlist-read-private playlist-modify-private playlist-modify-public";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: S_CLIENT_ID,
      scope: scope,
      redirect_uri: S_REDIRECT_URI,
      state: state,
    }).toString();
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    return res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  }

  if (!code) return res.status(400).send("Authorization code is missing.");

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", S_REDIRECT_URI);

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(S_CLIENT_ID + ":" + S_CLIENT_SECRET).toString("base64"),
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    req.session.spotify_access_token = access_token;
    req.session.spotify_refresh_token = refresh_token;
    res.redirect("http://localhost:5173");
  } catch (err) {
    console.error(
      "Error while getting Spotify access_token:",
      err.response ? err.response.data : err.message
    );
    res.status(500).send("Error while trying to authenticate with Spotify.");
  }
});

// Youtube credentials and Authorization flow
const Y_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const Y_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const Y_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  Y_CLIENT_ID,
  Y_CLIENT_SECRET,
  Y_REDIRECT_URI
);

app.get("/login/youtube", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/youtube"];

  const state = crypto.randomBytes(32).toString("hex");
  req.session.youtube_state = state;

  const authorizationUrl = oauth2Client.generateAuthUrl({
    client_id: Y_CLIENT_ID,
    redirect_uri: Y_REDIRECT_URI,
    response_type: "code",
    scope: scopes,
    access_type: "offline",
    state: state,
    include_granted_scopes: true,
  });

  res.redirect(authorizationUrl);
});

app.get("/callback/youtube", async (req, res) => {
  const { code, state } = req.query;

  const storedState = req.session.youtube_state;

  if (!state || state !== storedState)
    return res.status(400).send("State mismatch.");

  req.session.youtube_state = null;

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code: code,
          client_id: Y_CLIENT_ID,
          client_secret: Y_CLIENT_SECRET,
          redirect_uri: Y_REDIRECT_URI,
          grant_type: "authorization_code",
        },
      }
    );

    req.session.youtube_access_token = tokenResponse.data.access_token;
    req.session.youtube_refresh_token = tokenResponse.data.refresh_token;
    return res.redirect("http://localhost:5173");
  } catch (err) {
    console.error(
      "Error while connecting to Youtube",
      err.response ? err.response.data : err.message
    );
    res.status(500).send("Fail in Google authentication.");
  }
});

// Transfer to Youtube
app.post("/transferToYoutube/:id", async (req, res) => {
  if (!req.session.spotify_access_token) {
    let authUrl = generateSpotifyAuthUrl();
    return res.status(401).json({
      message: "Authentication with Spotify is required.",
      redirectUrl: authUrl,
    });
  }

  if (!req.session.youtube_access_token) {
    let authUrl = generateYoutubeAuthUrl();
    return res.status(401).json({
      message: "Authentication with Youtube is required.",
      redirectUrl: authUrl,
    });
  }

  const playlistId = req.params.id;

  let trackIds; // The ISRC code of each track in the playlist
  let playlistName;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${req.session.spotify_access_token}`,
        },
      }
    );

    const result = response.data;
    const items = result.tracks.items;

    playlistName = result.name;
    trackIds = getSpotifyISRCs(items);
  } catch (err) {
    console.error("Error while transfering to Youtube:", err);
    res.status(500).send(`Error while transfering to Youtube: ${err}`);
  }

  oauth2Client.setCredentials({
    access_token: req.session.youtube_access_token,
    refresh_token: req.session.youtube_refresh_token,
  });

  const youtubePlaylistId = await createYoutubePlaylist(playlistName);
  const addTracks = await addTracksToYoutubePlaylist(
    trackIds,
    youtubePlaylistId
  );

  if (!addTracks.youtubePlaylistId) {
    res.status(500).send("Could not transfer.");
    return "Could not transfer.";
  }

  const status = 200;

  res.status(status).json({
    url: `https://www.youtube.com/playlist?list=${addTracks.youtubePlaylistId}`,
    ...addTracks,
  });
});

const youtube = google.youtube({ version: "v3", auth: oauth2Client });

function getSpotifyISRCs(items) {
  let isrcArray = [];

  for (const item of items) {
    isrcArray.push(item.track.external_ids.isrc);
  }

  return isrcArray;
}

async function createYoutubePlaylist(playlistName) {
  try {
    const playlistResponse = await youtube.playlists.insert({
      part: "snippet",
      requestBody: {
        snippet: { title: playlistName },
      },
    });
    return playlistResponse.data.id;
  } catch (err) {
    console.error("Error creating YouTube playlist:", err);
    return res.status(500).send("Error creating YouTube playlist");
  }
}

async function addTracksToYoutubePlaylist(isrcArray, youtubePlaylistId) {
  let addedTracks = [];
  for (const isrc of isrcArray) {
    try {
      const searchResponse = await youtube.search.list({
        part: "snippet",
        q: isrc,
        maxResults: 1,
        type: "video",
      });

      const items = searchResponse.data.items;
      if (items && items.length > 0) {
        const videoId = items[0].id.videoId;

        // Adiciona vídeo à playlist
        await youtube.playlistItems.insert({
          part: "snippet",
          requestBody: {
            snippet: {
              playlistId: youtubePlaylistId,
              resourceId: {
                kind: "youtube#video",
                videoId: videoId,
              },
            },
          },
        });

        addedTracks.push({ isrc, videoId });
        console.log(`Added video ${videoId} for ISRC ${isrc}`);
      } else {
        console.log(`No video found for ISRC ${isrc}`);
      }
    } catch (err) {
      console.error(`Error adding ISRC ${isrc} to playlist:`, err);
    }
  }

  const result = {
    youtubePlaylistId,
    addedTracks,
    message: "Transfer completed",
  };

  return result;
}

// Transfer to Spotify
app.get("/transferToSpotify", async (req, res) => {});

// Checking connections
app.get("/status/spotify", (req, res) => {
  if (req.session.spotify_access_token)
    res.status(200).send({ message: "Connected to Spotify." });
  else res.status(400).send({ message: "Not connected to Spotify." });
});

app.get("/status/youtube", (req, res) => {
  if (req.session.youtube_access_token)
    res.status(200).send({ message: "Connected to Youtube." });
  else res.status(400).send({ message: "Not connected to Youtube." });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
