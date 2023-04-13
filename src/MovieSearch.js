import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {apiKey} from './config';
import './styles/Poster.css';
import './styles/LoadingIndicator.css'

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
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

  const handleAddToWatchlist = async (movie) => {
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
      <form onSubmit={searchMovies}>
        <label htmlFor="query">Movie Title:</label>
        <input type="text" id="query" value={query} onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
      ) : (
        <div>
          <h2>Search Results</h2>
          {currentMovies.map((movie) => (
            <div className='poster' key={movie.id}>
              <span>
                <h2>{movie.title}</h2>&nbsp;&nbsp;
                <br/>
                {movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width='300px' alt={movie.title}/>) : (<img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={movie.title}/>
                )}
                <br/>
                <button onClick={() => handleAddToWatchlist(movie)}>Add to Watchlist</button>
                <p>Release Date: {movie.release_date}</p>
                <p>Runtime: {movie.runtime}mins</p>
                <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
                <p>{movie.overview}</p>
                <Link to={`/movies/${movie.id}`}>View Trailers</Link>
              </span>
            </div>
          ))}
           {totalPages > 1 && (
            <div>
              {Array.from({length: totalPages}).map((_, index) => (
                <button key={index} onClick={() => handlePageClick(index + 1)}>
                  {index + 1}
                </button>
              ))}
            </div>
           )}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;