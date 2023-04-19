import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {apiKey} from './env';
import './styles/Poster.css';
import './styles/LoadingIndicator.css'
import './styles/MediaSearch.css'

const MediaSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showTVShowForm, setShowTVShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const searchMovies = async (e) => {
    e.preventDefault();
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    try {
      setLoading(true);
      const {data: searchResults} = await axios.get(`${searchUrl}&page=1`);
      const totalPages = searchResults.total_pages;
      const movieDetails = [];
      for (let page = 1; page <= totalPages; page++) {
        const {data: pageResults} = await axios.get(`${searchUrl}&page=${page}`);
        const pageMovieIds = pageResults.results.map((movie) => movie.id);
        const pageMovieDetailsPromises = pageMovieIds.map((id) => {
          const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
          return axios.get(movieUrl).catch(() => {
            return {data: {id, title: "Unknown", poster_path: null}};
          });
        });
        const pageMovieDetailsResponses = await Promise.all(pageMovieDetailsPromises);
        const pageMovieDetails = pageMovieDetailsResponses.map((response) => response.data);
        movieDetails.push(...pageMovieDetails);
      }
      setMovies(movieDetails);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('An Error Occurred While Searching For Movies. Please Try Again Later.');
    }
  };

  const searchTVShows = async (e) => {
    e.preventDefault();
    const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}`;
    try {
      setLoading(true);
      const {data: searchResults} = await axios.get(`${searchUrl}&page=1`);
      const totalPages = searchResults.total_pages;
      const tvShowDetails = [];
      for (let page = 1; page <= totalPages; page++) {
        const {data: pageResults} = await axios.get(`${searchUrl}&page=${page}`);
        const pageTVShowIds = pageResults.results.map((tvShow) => tvShow.id);
        const pageTVShowDetailsPromises = pageTVShowIds.map((id) => {
          const tvShowUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`;
          return axios.get(tvShowUrl).catch(() => {
            return {data: {id, name: "Unknown", poster_path: null}};
          });
        });
        const pageTVShowDetailsResponses = await Promise.all(pageTVShowDetailsPromises);
        const pageTVShowDetails = pageTVShowDetailsResponses.map((response) => response.data);
        tvShowDetails.push(...pageTVShowDetails);
      }
      setTVShows(tvShowDetails);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('An Error Occurred While Searching For TV Shows. Please Try Again Later.');
    }
  };

  const addMovieToWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Login To Add Movies To Watchlist');
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
    } catch (error) {
      console.error(error);
      alert('An Error Occurred While Adding The Movie To Your Watchlist. Please Try Again Later.');
    }
  };

  const addTVShowToWatchlist = async (tvShow) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Login To Add TV Shows To Watchlist');
      return;
    }
    try {
      const firstAirDate = tvShow.first_air_date;
      const lastAirDate = tvShow.last_air_date;
      const airDates = firstAirDate + '/' + lastAirDate;
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
      alert('TV Show added to watchlist!');
    } catch (error) {
      console.error(error);
      alert('An Error Occurred While Adding The TV Show To Your Watchlist. Please Try Again Later.');
    }
  };

  const renderMovies = () => {
    const moviesPerPage = 18;
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const currentMovies = movies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
    return (
      <div>
        <h2>Search Results</h2>
        {currentMovies.map((movie) => (
          <div className="poster" key={movie.id}>
            <span>
              <h2>{movie.title}</h2>&nbsp;&nbsp;
              <button onClick={() => addMovieToWatchlist(movie)}>Add to Watchlist</button>
              <br/>
              {movie.poster_path ? (<img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width="300px" alt={movie.title} />
              ) : (<img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={movie.title}/>
              )}
              <br/>
              <p>Release Date: {movie.release_date}</p>
              <p>Runtime: {movie.runtime}mins</p>
              <p>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</p>
              <p>{movie.overview}</p>
              <Link to={`/movies/${movie.id}`}>View Trailers</Link>
            </span>
          </div>
        ))}
        {totalPages > 1 && <div className="pagination">
            {Array.from({length: totalPages}).map((_, index) => (
              <button key={index} onClick={() => handlePageClick(index + 1)}>{index + 1}</button>
            ))}
          </div>
        }
        </div>
      );
  };
  const renderTVShows = () => {
    const tvShowsPerPage = 18;
    const startIndex = (currentPage - 1) * tvShowsPerPage;
    const endIndex = startIndex + tvShowsPerPage;
    const currentTVShows = tvShows.slice(startIndex, endIndex);
    const totalPages = Math.ceil(tvShows.length / tvShowsPerPage);
    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
    return (
      <div className="media-search">
        <h2>Search Results</h2>
        {currentTVShows.map((tvShow) => (
          <div className="poster" key={tvShow.id}>
            <span>
              <h2>{tvShow.name}</h2>&nbsp;&nbsp;
              <button onClick={() => addTVShowToWatchlist(tvShow)}>Add to Watchlist</button>
              <br />
              {tvShow.poster_path ? (<img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} width="300px" alt={tvShow.name} />
              ) : (<img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={tvShow.name}/>
              )}
              <br/>
              <p>First & Last Air Date: {tvShow.first_air_date} / {tvShow.last_air_date}</p>
              <p>Runtime: {tvShow.episode_run_time[0]}mins</p>
              <p>Genres: {tvShow.genres.map((genre) => genre.name).join(', ')}</p>
              <p>{tvShow.overview}</p>
              <Link to={`/tv-shows/${tvShow.id}`}>View Trailers</Link>
            </span>
          </div>
        ))}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({length: totalPages}).map((_, index) => (
              <button key={index} onClick={() => handlePageClick(index + 1)}>{index + 1}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleMovieForm = () => {
    setShowMovieForm(!showMovieForm);
    setShowTVShowForm(false);
  };

  const toggleTVShowForm = () => {
    setShowTVShowForm(!showTVShowForm);
    setShowMovieForm(false);
  };

  return (
    <div>
      <button onClick={toggleMovieForm}>Movie Search</button>
      <button onClick={toggleTVShowForm}>TV Show Search</button>
      {showMovieForm && (
        <form onSubmit={searchMovies}>
            <input type="text" id="query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type A Movie Title"/>
            <button type="submit">Search</button>
            {loading ? <div className="lds-ripple"><div></div><div></div></div> : renderMovies()}
        </form>
      )}
      {showTVShowForm && (
        <form onSubmit={searchTVShows}>
            <input type="text" id="query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type A TV Show Name"/>
            <button>Search</button>
            {loading ? <div className="lds-ripple"><div></div><div></div></div> : renderTVShows()}
        </form>
      )}
    </div>
  );
};

export default MediaSearch;