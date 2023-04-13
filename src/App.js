import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import Watchlist from './Watchlist'
import MovieSearch from './MovieSearch';
import MovieTrailers from './MovieTrailer';
import TVShowSearch from './TVShowSearch';
import TVShowTrailers from './TVShowTrailer';
import TopRatedMedia from './TopRatedMedia';
import PopularMedia from './PopularMedia';
import './styles/App.css'

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
     <div className="App" style={{minHeight: '100vh', backgroundColor: '#000000'}}>
      <Router>
        <Navbar userId={userId} loggedIn={loggedIn} onLogin={handleLogin} handleLogout={handleLogout}/>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin}/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/movie-search" element={<MovieSearch/>}/>
          <Route path="/movies/:id" element={<MovieTrailers/>}/>
          <Route path="/tv-show-search" element={<TVShowSearch/>}/>
          <Route path="/tv-shows/:id" element={<TVShowTrailers/>}/>
          <Route path="/top-rated-media" element={<TopRatedMedia/>}/>
          <Route path="/popular-media" element={<PopularMedia/>}/>
          <Route path="/watchlist" element={<Watchlist userId={userId} onLogin={handleLogin}/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;