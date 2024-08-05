
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginDto = { username, password };
        const response = await axios.post('/api/users/login', loginDto);
        localStorage.setItem('token', response.data);
        alert('Login successful!');
    };

    return (

        <div>
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
        </form>

        
        </div>

        
    );
};

export default Login;
