import React, {useState} from 'react';
import axios from 'axios';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = ({loggedIn, handleLogout, userId}) => {
  const navi = useNavigate();
  const loco = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const username = sessionStorage.getItem('username');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const deleteAccount = async () => {
    console.log(userId)
    try {
      await axios.delete(`http://localhost:6227/users/${userId}`);
      handleLogout();
      navi('/');
    } catch (err) {
      console.error(err);
      alert('Error Deleting Account');
    }
  };
  const logoutOnly = () => {
    handleLogout();
    navi('/');
  };
  const navToSignup = () => {
    navi('/signup');
  };
  const navToLogin = () => {
    navi('/');
  };

  return (
    <nav className='navbar'>
      {loggedIn ? (
        <>
          <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <button className="dropbtn">
              Welcome, <span> {username}</span>
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={logoutOnly} style={{color: 'crimson'}}>Logout</button> <br/>
                <button onClick={() => deleteAccount(userId)} style={{color: 'crimson'}}>Delete Account</button>
              </div>
            )}
          </div>
        </>
      ) : (
        loco.pathname !== '/signup' && (
          <button onClick={navToSignup} style={{color: 'limegreen', border: 'none'}}>Signup</button>
        )
      )}
      {loggedIn && (
        <>
          <NavLink to={'/media-search'}>Search</NavLink>
          <NavLink to={'/popular-media'}>Popular</NavLink>
          <NavLink to={'/upcoming-movies'}>Upcoming</NavLink>
          <NavLink to={'/airing-today'}>Airing Today</NavLink>
          <NavLink to={'/top-rated-media'}>Top Rated</NavLink>
          <NavLink to={'/watchlist'}>Watchlist</NavLink>
          <NavLink to={'/media-reviews'}>Reviews</NavLink>
        </>
      )}
      {!loggedIn && (
        loco.pathname !== '/' && (
          <button onClick={navToLogin} style={{border: 'none'}}>Login</button>
        )
      )}
    </nav>
  );
};

export default Navbar;