import React, {useState} from 'react';
import axios from 'axios';
import {NavLink, useNavigate} from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = ({loggedIn, handleLogout, userId}) => {
  const navi = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const deleteAccount = async () => {
    console.log(userId)
    try {
      await axios.delete(`http://localhost:6227/users/${userId}`);
      handleLogout();
    } catch (err) {
      console.error(err);
      alert('Error deleting account');
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
        <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
          <button className="dropbtn">Account</button>
          {showDropdown && (
            <div className="dropdown-content">
              <button onClick={() => deleteAccount(userId)} style={{color: 'crimson'}}>Delete Account</button>
              <button onClick={logoutOnly} style={{color: 'crimson'}}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={navToLogin} style={{color: 'dodgerblue'}}>Login</button>
        )}
      {loggedIn && <NavLink to={'/watchlist'}>Watchlist</NavLink>}
      {loggedIn && <NavLink to={'/top-media'}>Top Rated Media</NavLink>}
      {loggedIn && <NavLink to={'/movie-search'}>Search Movie</NavLink>}
      {loggedIn && <NavLink to={'/tv-show-search'}>Search TV Show</NavLink>}
      {!loggedIn && (
        <button onClick={navToSignup} style={{color: 'forestgreen'}}>Signup</button>
      )}
    </nav>
  );
};

export default Navbar;
