const express = require('express');
const axios = require('axios');
const middlewareRouter = require('../middlewares/router');
const {apiKey} = require('../src/env');

const router = express.Router();
// Middleware used to define global middleware functions that are applied to all routes in the router
router.use(middlewareRouter);

// Route for searching for movies or tv shows
router.get('/media-search', async (req, res) => {
  const {query, mediaType} = req.query;
  try {
    let response;
    let media;
    // Search for movie if mediaType is 'movie'
    if (mediaType === 'movie') {
      response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: apiKey,
          query
        }
      });
      // Search for TV shows if mediaType is 'tv'
      media = response.data.results.map(({id, title, poster_path, runtime, release_date, overview}) => ({
        mediaID: id,
        title,
        poster: `https://image.tmdb.org/t/p/original/${poster_path}`,
        runtime,
        releaseDate: release_date,
        overview
      }));
       // Search for tv shows if mediaType is 'tv'
    } else if (mediaType === 'tv') {
      response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
        params: {
          api_key: apiKey,
          query
        }
      });
      // Search for TV shows if mediaType is 'tv'
      media = response.data.results.map(({id, name, poster_path, episode_run_time, last_air_date, first_air_date, overview}) => ({
        mediaID: id,
        name,
        poster: `https://image.tmdb.org/t/p/original/${poster_path}`,
        runtime: episode_run_time[0],
        airDates: `${last_air_date} - ${first_air_date}`,
        overview
      }));
      // Throw an error if mediaType is not 'movie' or 'tv'
    } else {
      throw new Error('Invalid media type');
    }
    // Send response with search results
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error searching for media'});
  }
});

module.exports = router;