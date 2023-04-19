import React, {useState, useEffect} from 'react';
import {apiKey} from './env';
import axios from 'axios';
import {useParams} from 'react-router-dom';

function MovieTrailers() {
  const {id} = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTrailers = async (page) => {
      const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&page=${page}`;
      try {
        const {data} = await axios.get(url);
        setTrailers(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrailers(currentPage);
  }, [id, currentPage]);


  const totalPages = Math.ceil(trailers.length / 10);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderTrailers = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;

    return trailers.slice(startIndex, endIndex).map((trailer) => trailer.key && (
      <div key={trailer.id}>
        <h3>{trailer.name}</h3>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name}
          allowFullScreen
        ></iframe>
      </div>
    ));
  };

  return (
    <div>
      <h1>Movie Trailers</h1>
      {renderTrailers()}
      <div>
        {Array.from({length: totalPages}).map((_, index) => (
          <button key={index} onClick={() => handlePageClick(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MovieTrailers;