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
    "playlist-read-private playlist-modify-private playlist-modify-public user-read-private user-read-email";
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
    res.send(`
      <script>
        const data = ${JSON.stringify({
          type: "spotify-auth",
        })};
        window.opener.postMessage(data, 'http://localhost:5173');
      window.close();
      </script>
    `);
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
    res.send(`
      <script>
        const data = ${JSON.stringify({
          type: "youtube-auth",
        })};
        window.opener.postMessage(data, 'http://localhost:5173');
      window.close();
      </script>
    `);
  } catch (err) {
    console.error(
      "Error while connecting to Youtube",
      err.response ? err.response.data : err.message
    );
    res.status(500).send("Fail in Google authentication.");
  }
});

// Transfer to Youtube
app.post("/transfer/youtube/:id", async (req, res) => {
  if (!req.session.spotify_access_token) {
    res
      .status(401)
      .json({
        message: "Authentication with Spotify is required.",
      })
      .redirect("http://localhost:5173");
    return;
  }

  if (!req.session.youtube_access_token) {
    res
      .status(401)
      .json({
        message: "Authentication with Youtube is required.",
      })
      .redirect("http://localhost:5173");
    return;
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

const getSpotifyISRCs = (items) => {
  let isrcArray = [];

  for (const item of items) {
    isrcArray.push(item.track.external_ids.isrc);
  }

  return isrcArray;
};

const createYoutubePlaylist = async (playlistName) => {
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
    return "Error creating YouTube playlist";
  }
};

const addTracksToYoutubePlaylist = async (isrcArray, youtubePlaylistId) => {
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
};

const isConnected = (req) => {
  return req.session.spotify_access_token && req.session.youtube_access_token;
};

const cleanTrackData = (title, artist) => {
  // Remove "- Topic"
  artist = artist.replace(/\s*-\s*Topic$/i, "");

  // Remove apóstrofos ex: "don't" -> "dont"
  title = title.replace(/'/g, "");

  // Remove coisas entre parênteses ex: (UK Edit), (slowed & reverb), (feat. X)
  title = title.replace(/\([^)]*\)/g, "").trim();

  // Remove múltiplos espaços
  title = title.replace(/\s+/g, " ");
  artist = artist.replace(/\s+/g, " ");

  // Normaliza para lowercase
  title = title.toLowerCase();
  artist = artist.toLowerCase();

  return { title, artist };
};

// Transfer to Spotify
app.post("/transfer/spotify/:id", async (req, res) => {
  if (!isConnected(req))
    return res.status(400).send({ message: "User not connected." });

  oauth2Client.setCredentials({
    access_token: req.session.youtube_access_token,
    refresh_token: req.session.youtube_refresh_token,
  });

  const playlistId = req.params.id;

  let spotifyUserId = null;
  let playlistName = null;
  let trackTitles = null;
  let newPlaylistId = null;
  let newPlaylistUrl = null;

  // Recupera o id do usuario no Spotify (necessario para criar a pl)
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${req.session.spotify_access_token}` },
    });
    spotifyUserId = response.data.id;
  } catch (err) {
    console.error(
      "Error fetching Spotify user id from Spotify API:",
      err.response ? err.response.data : err.message
    );
  }

  // Recupera titulo da playlist original no Youtube
  try {
    const response = await youtube.playlists.list({
      part: ["snippet,contentDetails"],
      id: playlistId,
    });
    playlistName = response.data.items[0].snippet.title;
  } catch (err) {
    console.error("Error getting playlist title:", err);
    res.status(500).send("Error getting playlist title");
  }

  // Recupera os titulos das faixas da playlist no Youtube
  try {
    const response = await youtube.playlistItems.list({
      part: ["snippet,contentDetails"],
      playlistId: playlistId,
      maxResults: 10,
    });
    const items = response.data.items;
    trackTitles = getYoutubeTitles(items);
  } catch (err) {
    console.error("Error while transfering to Youtube:", err);
    res.status(500).send("Error while transfering to Youtube");
  }

  // Criar playlist no Spotify
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
      {
        name: playlistName,
        description: "Playlist transferred by PlaylistPort.",
        public: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.session.spotify_access_token}`,
        },
      }
    );
    newPlaylistId = response.data.id;
    newPlaylistUrl = response.data.external_urls.spotify;
  } catch (err) {
    console.error(
      "Erro ao criar playlist no spotify:",
      err.response ? err.response.data : err.message
    );
  }

  // Recuperar URIs das faixas no spotify
  let uriArray = [];
  for (const track of trackTitles) {
    const cleanData = cleanTrackData(track.title, track.artist);

    const cleanTitle = cleanData.title;
    const cleanArtist = cleanData.artist;

    console.log(`titulo: ${cleanTitle}, artista: ${cleanArtist}`);

    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        params: {
          q: `track:${cleanTitle} ${cleanArtist}`,
          type: "track",
          limit: 1,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.session.spotify_access_token}`,
        },
      });

      const trackUri = response.data.tracks.items[0]?.uri;
      if (trackUri) {
        console.log("Track Name: ", response.data.tracks.items[0].name);
        console.log("Track Album: ", response.data.tracks.items[0].album.name);
        uriArray.push(trackUri);
      }
    } catch (err) {
      console.error(
        "Error getting track URI:",
        track,
        err.response?.data || err.message
      );
    }
  }

  // Adicionar faixas na nova playlist
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
      {
        uris: uriArray,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.session.spotify_access_token}`,
        },
      }
    );
    if (response.data.snapshot_id) {
      console.log("New playlist URL:", newPlaylistUrl);
      res.status(200).send({ new_playlist_url: newPlaylistUrl });
    }
  } catch (error) {
    console.error("Erro ao adicionar faixas a playlist:", error);
    res.status(400).send({ message: "Erro ao adicionar faixas a playlist" });
  }
});

const getYoutubeTitles = (items) => {
  let titlesArray = [];
  for (const item of items)
    titlesArray.push({
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle,
    });
  return titlesArray;
};

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
