import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import Watchlist from './Watchlist'
import MediaSearch from './MediaSearch';
import PopularMedia from './PopularMedia';
import TopRatedMedia from './TopRatedMedia';
import MovieTrailers from './MovieTrailer';
import TVShowTrailers from './TVShowTrailer';
import Reviews from './Reviews';
import './styles/App.css'
import UpcomingMovies from './UpcomingMovies';
import AiringToday from './AiringToday';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedUserId = sessionStorage.getItem('userId');
    console.log('storedUserId:', storedUserId);
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (userId) => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
      localStorage.setItem('loggedIn', 'true');
      setUserId(userId);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setLoggedIn(false);
    setUserId(null);
  };

  console.log('userId:', userId);

  return (
     <div className="App">
      <Router>
        <Navbar userId={userId} loggedIn={loggedIn} onLogin={handleLogin} handleLogout={handleLogout}/>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin}/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/media-search" element={<MediaSearch/>}/>
          <Route path="/movies/:id" element={<MovieTrailers/>}/>
          <Route path="/tv-shows/:id" element={<TVShowTrailers/>}/>
          <Route path="/top-rated-media" element={<TopRatedMedia/>}/>
          <Route path="/popular-media" element={<PopularMedia/>}/>
          <Route path="/airing-today" element={<AiringToday/>}/>
          <Route path="/upcoming-movies" element={<UpcomingMovies/>}/>
          <Route path="/media-reviews" element={<Reviews/>}/>
          <Route path="/watchlist" element={<Watchlist userId={userId} onLogin={handleLogin}/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;