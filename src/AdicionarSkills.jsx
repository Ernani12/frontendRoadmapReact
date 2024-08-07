import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const AdicionarSkillsPage = () => {
  const { cargoId } = useParams();
  const location = useLocation();
  const cargo = location.state?.cargo || {};
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/skills/all');
        setSkills(response.data);
      } catch (error) {
        console.error('Erro ao buscar habilidades:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSkills((prevSelectedSkills) => [...prevSelectedSkills, value]);
    } else {
      setSelectedSkills((prevSelectedSkills) => prevSelectedSkills.filter((skill) => skill !== value));
    }
  };

  const handleBackToForm = () => {
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      for (let skillName of selectedSkills) {
        await axios.post(`http://localhost:8080/api/cargos/add/${cargoId}/skills`, skillName, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      alert('Habilidades adicionadas com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao adicionar habilidades:', error);
    }
  };

  return (
    <div className="cargos-page">
      <h2>Adicionar Habilidades ao Cargo:</h2>
      <h3>{cargo.nome}</h3>
      <form onSubmit={handleSubmit}>
        <div className="skills-group">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-item">
              <label>
                <input
                  type="checkbox"
                  value={skill.nome}
                  onChange={handleSkillChange}
                />
                {skill.nome}
              </label>
            </div>
          ))}
        </div>
        <button style={{ width: '150px', marginTop: '30px' }} type="submit">Adicionar Habilidades</button>
        <button type="button" style={{ width: '150px' }} onClick={handleBackToForm}>Voltar ao Formulário</button>
      </form>
    </div>
  );
};

export default AdicionarSkillsPage;
