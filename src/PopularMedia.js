import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {apiKey} from './env';
import axios from 'axios';
import './styles/LoadingIndicator.css';
import './styles/Titles.css'

const PopularMedia = () => {
  const [popMovies, setPopMovies] = useState([]);
  const [popTvShows, setPopTvShows] = useState([]);
  const [showMedia, setShowMedia] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [popMoviesRes, popTvShowsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=1`),
          axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`),
        ]);

        const popMovies = popMoviesRes.data.results;
        const popTvShows = popTvShowsRes.data.results;

        for (let i = 2; i <= 10; i++) {
          const [moviesRes, tvShowsRes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=${i}`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${i}`),
          ]);

          popMovies.push(...moviesRes.data.results);
          popTvShows.push(...tvShowsRes.data.results);
        }

        const movieDetailsPromises = popMovies.map((movie) => {
          const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
          return axios.get(movieUrl);
        });

        const tvShowDetailsPromises = popTvShows.map((tvShow) => {
          const tvShowUrl = `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}`;
          return axios.get(tvShowUrl);
        });

        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const tvShowDetailsResponses = await Promise.all(tvShowDetailsPromises);

        const movieDetails = movieDetailsResponses.map((res) => res.data);
        const tvShowDetails = tvShowDetailsResponses.map((res) => res.data);

        setPopMovies(movieDetails);
        setPopTvShows(tvShowDetails);

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('An Error Occurred While Fetching Popular Movies and TV Shows. Please Try Again Later.');
      }
    };

    fetchData();
  }, []);

  const addMovieToWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Login To Add Movies To Your Watchlist');
      return;
    }
    try {
      await axios.post('http://localhost:6227/user-watchlist-movie', {
        movieId: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        runtime: movie.runtime,
        posterPath: movie.poster_path,
        overview: movie.overview,
        userId: userId
      });
      console.log(movie)
      alert('Movie Added To Watchlist!');
    } catch (err) {
      console.error(err);
      alert('An Error Occurred While Adding The Movie To Your Watchlist. Please Try Again Later.');
    }
  };

  const addTVShowToWatchlist = async (tvShow) => {
    const userId = sessionStorage.getItem('userId');
    const firstAirDate = tvShow.first_air_date;
    const lastAirDate = tvShow.last_air_date;
    const airDates = firstAirDate + '/' + lastAirDate;
    if (!userId) {
      alert('Login To Add TV Shows To Your Watchlist');
      return;
    }
    try {
      await axios.post('http://localhost:6227/user-watchlist-tv-show', {
        tvShowId: tvShow.id,
        name: tvShow.name,
        airDates: airDates,
        runtime: tvShow.episode_run_time[0],
        posterPath: tvShow.poster_path,
        overview: tvShow.overview,
        userId: userId
      });
      console.log(tvShow)
      alert('TV Show Added To Watchlist!');
    } catch (err) {
      console.error(err);
      alert('An Error Occurred While Adding The Movie To Your Watchlist. Please Try Again Later.');
    }
  };

  const toggleMedia = () => {
    setShowMedia(!showMedia);
  };

  return (
    <div>
      <button onClick={toggleMedia}>
        {showMedia ? 'Popular TV Shows' : 'Popular Movies'}
      </button>
      {showMedia && (
          <div>
        {loading ? (
          <div className="lds-ripple"><div></div><div></div></div>
        ) : (
          <section className='pop-movies'>
            <h2>Popular Movies</h2>
            {popMovies.map((movie, index) => (
              <div className='poster' key={index}>
                <span>
                  <h3>{movie.title}</h3>&nbsp;&nbsp;
                  <button onClick={() => addMovieToWatchlist(movie)}>Add to Watchlist</button>
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width='300px' alt={movie.title}/>
                    ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={movie.title}/>
                  )}
                  <br/>
                  <p>{movie.overview}</p>
                  <Link to={`/movies/${movie.id}`}>View Trailers</Link>
                </span>
              </div>
            ))}
          </section>
        )}
        </div>
      )}
      {!showMedia && (
        <div>
          {loading ? (
            <div className="lds-ripple"><div></div><div></div></div>
          ) : (
            <section className='pop-tvshows'>
              <h2>Popular TV Shows</h2>
              {popTvShows.map((tvShow, index) => (
                <div className='poster' key={index}>
                  <span>
                    <h3>{tvShow.name}</h3>&nbsp;&nbsp;
                    <button onClick={() => addTVShowToWatchlist(tvShow)}>Add to Watchlist</button>
                    {tvShow.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} width='300px' alt={tvShow.name}/>
                      ) : (
                      <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={tvShow.name}/>
                    )}
                    <br/>
                    <p>{tvShow.overview}</p>
                    <Link to={`/tv-shows/${tvShow.id}`}>View Trailers</Link>
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default PopularMedia;