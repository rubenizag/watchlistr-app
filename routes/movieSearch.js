const express = require('express');
const axios = require('axios');
const router = express.Router();
const middlewareRouter = require('../middlewares/router');

const apiKey = 'dcb2c2cd84f25d6719b0ec7a9c488876';

router.use(middlewareRouter);

router.get('/movie-search', async (req, res) => {
  try {
    const {query} = req.query;
    const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const movies = res.data.results.map(movie => ({
      movieID: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
      runtime: movie.runtime,
      releaseDate: movie.release_date,
      overview: movie.overview,
    }));
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error searching for movies'});
  }
});

module.exports = router;