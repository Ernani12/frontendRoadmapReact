import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Importe o arquivo de estilo
import { useNavigate } from 'react-router-dom'; // Certifique-se de importar useNavigate


const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate(); // Hook para acessar a navegação


  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/skills/all'); // Supondo que você tenha essa rota configurada no backend
        setSkills(response.data);
      } catch (error) {
        console.error('Erro ao buscar habilidades:', error);
      }
    };

    fetchSkills();
  }, []);

    // Função para redirecionar para o formulário
    const handleBackToForm = () => {
      navigate('/');
    };

    return (
      <div className="skill-page">
        <h2>Todas as Skills Cadastradas</h2>
        <ul className="skills-group">
          {skills.map((skill) => (
            <li key={skill.id} className="skill-item">
              {skill.nome}
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleBackToForm}>Voltar ao Formulario</button>

      </div>
    );
  };



export default SkillsPage;
