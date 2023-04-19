const express = require('express');
const axios = require('axios');
const router = express.Router();
const middlewareRouter = require('../middlewares/router');
const {apiKey} = require('../src/env');


router.use(middlewareRouter);

router.get('/tv-show-search', async (req, res) => {
  try {
    const {query} = req.query;
    const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}`);
    const tvShows = response.data.results.map(tvShow => ({
      tvShowID: tvShow.id,
      name: tvShow.name,
      poster: `https://image.tmdb.org/t/p/original/${tvShow.poster_path}`,
      runtime: tvShow.episode_run_time[0],
      airDates: `${tvShow.last_air_date} - ${tvShow.first_air_date}`,
      overview: tvShow.overview,
    }));
    res.json(tvShows);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error searching for tv shows'});
  }
});

module.exports = router;