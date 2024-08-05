import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Roadmap = () => {
    const { level } = useParams();
    const [roadmap, setRoadmap] = useState([]);

    useEffect(() => {
        const fetchRoadmap = async () => {
            const response = await axios.get(`/api/questionario/roadmap/${level}`);
            setRoadmap(response.data);
        };
        fetchRoadmap();
    }, [level]);

    return (
        <div className="roadmap">
            <h2>Roadmap para {level.charAt(0).toUpperCase() + level.slice(1)}</h2>
            <ul>
                {roadmap.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default Roadmap;
