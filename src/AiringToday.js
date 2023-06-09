import {useEffect, useState} from 'react';
import axios from 'axios';
import {apiKey} from './env';
import './styles/LoadingIndicator.css';
import './styles/Titles.css'

function AiringToday() {
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allTVShows = [];
        let page = 1;
        let totalPages = 1;
        while (page <= totalPages) {
          const res = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}&language=en-US&page=${page}`);
          const filteredShows = res.data.results.filter((tvShow) => tvShow.original_language === 'en' && tvShow.origin_country.includes('US'));
          const showDetailsPromises = filteredShows.map((tvShow) => {
            const showUrl = `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}`;
            return axios.get(showUrl);
          });
          const showDetailsResponses = await Promise.all(showDetailsPromises);
          const showDetails = showDetailsResponses.map((res) => res.data);
          allTVShows.push(...showDetails);
          page++;
          totalPages = res.data.total_pages;
        }
        setTVShows(allTVShows);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div className="airing-today">
      <h2>Airing Today</h2>
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
      ) : (
        <div className="poster-container">
          {tvShows.map((tvShow) => (
            <div className="poster" key={tvShow.id}>
              <span>
                <h3>{tvShow.name}</h3>
                <button onClick={() => addTVShowToWatchlist(tvShow)}>Add to Watchlist</button>
                {tvShow.poster_path ? (<img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} width="300px" alt={tvShow.name}/>
                ) : (<img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={tvShow.name}/>
                )}
                <p>First & Last Air Date: <br/> {tvShow.first_air_date} / {tvShow.last_air_date}</p>
                <p>Runtime: {tvShow.episode_run_time}mins</p>
                <p>{tvShow.overview}</p>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiringToday;