import {useState} from 'react';
import axios from 'axios';
import {apiKey} from './env';
import './styles/Poster.css';
import './styles/Titles.css'

function MediaReviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [reviews, setReviews] = useState({});
  const [activeId, setActiveId] = useState(null);

  const searchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchMedia = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSearching
        ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`
        : `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(endpoint);
      setSearchResults(response.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async (id) => {
    try {
      if (activeId === id) {
        setActiveId(null);
      } else {
        const endpoint = isSearching
          ? `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`
          : `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`;
        const response = await axios.get(endpoint);
        setReviews({ ...reviews, [id]: response.data.results });
        setActiveId(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleIsSearching = () => {
    setIsSearching(!isSearching);
    setSearchResults([]);
    setSearchTerm('');
    setReviews({});
    setActiveId(null);
  };

  return (
    <div className="reviews">
      <div>
        <button onClick={toggleIsSearching}>
          {isSearching ? "Search For TV Shows Reviews" : "Search For Movies Reviews"}
        </button>
      <h2>Read Reviews</h2>
      </div>
      <div>
        <form onSubmit={searchMedia}>
          <input type="text" value={searchTerm} onChange={searchChange} placeholder={isSearching ? "Enter A Movie Title" : "Enter A TV Show Name"}/>
          <button type="submit">Search</button>
        </form>
        {searchResults.map((media) => (
          <div key={media.id}>
            <div className="poster-review">
              <div>
                <img src={`https://image.tmdb.org/t/p/original${media.poster_path}`} width='300px' alt={`Poster for ${media.title || media.name}`}/>
                <h3>{media.title || media.name}</h3>
                <p>{media.release_date || media.first_air_date}</p>
                <button onClick={() => fetchReviews(media.id)}>{activeId === media.id ? "Hide Reviews" : "Show Reviews"}</button>
                {activeId === media.id &&
                  reviews[media.id] &&
                  reviews[media.id].length > 0 ? (
                  reviews[media.id].map((review, index) => (
                    <div key={`review-${index}`}>
                      <h4>Author: <span style={{color: 'slateblue'}}>{review.author}</span></h4>
                      <p>{review.content}</p>
                    </div>
                  ))) : (activeId === media.id && (<p>No reviews for {media.title || media.name} yet</p>)
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaReviews;