import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {apiKey} from './env';
import './styles/LoadingIndicator.css';
import './styles/Titles.css'

function UpcomingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const upcomingMoviesPromises = [];
        for (let i = 1; i <= 10; i++) {
          upcomingMoviesPromises.push(axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${i}&region=US`));
        }
        const upcomingMoviesResponses = await Promise.all(upcomingMoviesPromises);
        const upcomingMovies = upcomingMoviesResponses.flatMap(res => res.data.results);
        const movieDetailsPromises = upcomingMovies.map((movie) => {
          const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
          return axios.get(movieUrl);
        });
        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const movieDetails = movieDetailsResponses.map((res) => res.data);
        setMovies(movieDetails);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('An Error Occurred While Fetching Upcoming Movies. Please Try Again Later.');
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

  return (
    <div>
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
      ) : (
        <div className="upcoming">
          <h2>Upcoming Movies</h2>
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <div className="poster" key={movie.id}>
                <span>
                  <h3>{movie.title}</h3>&nbsp;&nbsp;
                  <button onClick={() => addMovieToWatchlist(movie)}>Add to Watchlist</button>
                  <br/>
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width="300px" alt={movie.title} />
                  ) : (
                    <img
                      src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg"
                      width="300px"
                      alt={movie.title}
                    />
                  )}
                  <br/>
                  <p>Release Date: {movie.release_date}</p>
                  <p>Runtime: {movie.runtime}mins</p>
                  {movie.genres ? (
                    <p>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</p>
                  ) : (
                    <p>Genres: Unknown</p>
                  )}
                  <p>{movie.overview}</p>
                  <Link to={`/movies/${movie.id}`}>View Trailers</Link>
                </span>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UpcomingMovies;