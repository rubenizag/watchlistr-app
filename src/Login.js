import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './styles/Login.css'

const Login = ({onLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navi = useNavigate();

  const usernameChange = (e) => {
    setUsername(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:6227/login', {username, password});
      onLogin(res.data.userId);
      sessionStorage.setItem('userId', res.data.userId);
      sessionStorage.setItem('username', res.data.username);
      navi('/popular-media')
    } catch (error) {
      console.error(error);
      alert('Invalid Username/Password');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Welcome to the Watchlistr App</h1>
        <h3>Please, Login Below</h3>
        <label>Username:<input type="text" value={username} onChange={usernameChange}/></label> <br/>
        <label>Password:<input type="password" value={password} onChange={passwordChange}/></label> <br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;