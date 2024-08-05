import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import Questionnaire from './Questionario';
import Roadmap from './Roadmap';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/Questionario" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Questionario" element={<Questionnaire />} />
                <Route path="/roadmap/:level" element={<Roadmap />} />
            </Routes>
        </Router>
    );
}

export default App
