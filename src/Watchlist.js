import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './styles/Poster.css';
import './styles/Titles.css'

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [showMovies, setShowMovies] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    axios.get(`http://localhost:6227/watchlist/movies/${userId}`).then(res => {
      setMovies(res.data);
    }).catch(err => {
      console.error(err);
    });
    axios.get(`http://localhost:6227/watchlist/tvshows/${userId}`).then(res => {
      setTVShows(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  const removeFromMovies = (movieId) => {
    setMovies(movies.filter(movie => movie.movie_id !== movieId));
  };

  const removeFromTVShows = (tvShowId) => {
    setTVShows(tvShows.filter(tvShow => tvShow.tv_show_id !== tvShowId));
  };

  const removeMovieFromWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('userId');
    console.log('Removing media', movie.movie_id, 'for user', userId);
    await deleteMovieFromWatchlist(userId, movie.id);
    if (showMovies) {
      removeFromMovies(movie.movie_id);
    }
  };
  const removeTVShowFromWatchlist = async (tvShow) => {
    const userId = sessionStorage.getItem('userId');
    console.log('Removing media', tvShow.tv_show_id, 'for user', userId);
    await deleteTVShowFromWatchlist(userId, tvShow.id);
    if (!showMovies) {
      removeFromTVShows(tvShow.tv_show_id);
    }
  };

  const deleteMovieFromWatchlist = async (userId, movieInternalId) => {
    try {
      await axios.delete(`http://localhost:6227/watchlist/movie/${userId}/${movieInternalId}`);
      console.log('Media Removed From Watchlist', movieInternalId);
    } catch (err) {
      console.error(err);
      console.log('Error Removing Media From Watchlist');
    }
  };

  const deleteTVShowFromWatchlist = async (userId, tvShowInternalId) => {
    try {
      await axios.delete(`http://localhost:6227/watchlist/tvshow/${userId}/${tvShowInternalId}`);
      console.log('Media Removed From Watchlist', tvShowInternalId);
    } catch (err) {
      console.error(err);
      console.log('Error Removing Media From Watchlist');
    }
  };

  const toggleShowMovies = () => {
    setShowMovies(!showMovies);
  };

  return (
    <div className="watchlist">
      <h2>My Watchlist</h2>
      <button onClick={toggleShowMovies}>
        {showMovies ? 'Show TV Shows' : 'Show Movies'}
      </button>
      {showMovies ? (
        <div>
          {movies.length === 0 ? (
            <p>No movies in watchlist yet!</p>
          ) : (
            movies.map((movie, index) => (
              <div key={`movie-${index}`} className="poster">
                <p>{console.log(movie)}</p>
                <span>
                  <h3>{movie.title}</h3>
                  <button onClick={() => removeMovieFromWatchlist(movie)}>Remove</button>
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width='300px' key={movie.title} alt={movie.title}/>
                  ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={movie.title}/>
                  )} <br/>
                  <p>Release Date: {movie.release_date}</p>
                  <p>Runtime: {movie.runtime}mins</p>
                  <p>{movie.overview}</p>
                  <Link to={`/movies/${movie.movie_id}`}>View Trailers</Link>
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {tvShows.length === 0 ? (
            <p>No tv shows in your watchlist yet!</p>
          ) : (
            tvShows.map((tvShow, index) => (
              <div key={`tv-show-${index}`} className="poster">
                <p>{console.log(tvShow)}</p>
                <span>
                  <h2>{tvShow.name}</h2>
                  <button onClick={() => removeTVShowFromWatchlist(tvShow)}>Remove</button>
                  {tvShow.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} width='300px' key={tvShow.name} alt={tvShow.name}/>
                  ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={tvShow.title}/>
                  )} <br/>
                  <p>First & Last Air Dates: <br/> {tvShow.air_dates}</p>
                  <p>Runtime: {tvShow.runtime}mins</p>
                  <p>{tvShow.overview}</p>
                  <Link to={`/tv-shows/${tvShow.movie_id}`}>View Trailers</Link>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;