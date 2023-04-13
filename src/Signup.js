import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navi = useNavigate();
  const usernameChange = (e) => {
    setUsername(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const confirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const res = await axios.post('http://localhost:6227/signup', {username, password});
        if (res.data.err) {
          alert(res.data.err);
        } else {
          console.log(res.data);
          alert(res.data.message);
          navi('/');
        }
      } catch (err) {
        console.error(err);
        alert('Error While Signing Up, Please Try Again Later.');
      }
    } else {
      alert("Password Don't Match!");
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <h1>Sign Up</h1>
      <label>Username:<input type="text" value={username} onChange={usernameChange}/></label> <br/>
      <label>Password:<input type="password" value={password} onChange={passwordChange}/></label> <br/>
      <label>Confirm Password:<input type="password" value={confirmPassword} onChange={confirmPasswordChange}/></label> <br/>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default Signup;