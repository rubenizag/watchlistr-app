import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {apiKey} from './config';
import './styles/Poster.css';
import './styles/LoadingIndicator.css'

const TVShowSearch = () => {
  const [query, setQuery] = useState('');
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleAddToWatchlist = async (tvShow) => {
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

  const tvShowsPerPage = 18;
  const startIndex = (currentPage - 1) * tvShowsPerPage;
  const endIndex = startIndex + tvShowsPerPage;
  const currentTVShows = tvShows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tvShows.length / tvShowsPerPage);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <form onSubmit={searchTVShows}>
        <label htmlFor="query">TV Show Name:</label>
        <input type="text" id="query" value={query} onChange={(e) => setQuery(e.target.value)}/>
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
      ) : (
        <div>
          <h2>Search Results</h2>
          {currentTVShows.map((tvShow) => (
            <div className='poster' key={tvShow.id}>
              <span>
                <h2>{tvShow.name}</h2>&nbsp;&nbsp;
                <br/>
                {tvShow.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} width='300px' alt={tvShow.name}/>) : (<img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={tvShow.name}/>
                )}
                <br/>
                <button onClick={() => handleAddToWatchlist(tvShow)}>Add to Watchlist</button>
                <p>First & Last Air Date: <br/> {tvShow.first_air_date} / {tvShow.last_air_date}</p>
                <p>Runtime: {tvShow.episode_run_time[0]}mins</p>
                <p>Genres: {tvShow.genres.map(genre => genre.name).join(', ')}</p>
                <p>{tvShow.overview}</p>
                <Link to={`/tv-shows/${tvShow.id}`}>View Trailers</Link>
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
};

export default TVShowSearch;