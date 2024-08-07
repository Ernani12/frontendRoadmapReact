import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const AdicionarSkillsPage = () => {
  const { cargoId } = useParams();
  const location = useLocation();
  const cargo = location.state?.cargo || {};
  const [skills, setSkills] = useState([]);
  const [currentSkills, setCurrentSkills] = useState([]);
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

    const fetchCurrentSkills = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cargos/${cargoId}/skills`);
        setCurrentSkills(response.data);
      } catch (error) {
        console.error('Erro ao buscar habilidades do cargo:', error);
      }
    };

    fetchSkills();
    fetchCurrentSkills();
  }, [cargoId]);

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
        await axios.post(`http://localhost:8080/api/cargos/add/${cargoId}/skills`, JSON.stringify(skillName), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      alert('Habilidades adicionadas com sucesso!');
      // Recarregar habilidades após a adição
      const updatedSkillsResponse = await axios.get(`http://localhost:8080/api/cargos/${cargoId}/skills`);
      setCurrentSkills(updatedSkillsResponse.data);
      setSelectedSkills([]); // Limpar seleção após envio
    } catch (error) {
      console.error('Erro ao adicionar habilidades:', error);
    }
  };

  return (
    <div className="cargos-page">
      <h2>Adicionar Habilidades ao Cargo:</h2>
      <h3>{cargo.nome}</h3>
      <div className="form-container">
        <div className="add-skills-form">
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
   
      </div>
      <div className="current-skills">
          <h3>Habilidades Atuais:</h3>
          <table>
            <thead>
              <tr>
                <th>Nome da Habilidade</th>
              </tr>
            </thead>
            <tbody>
              {currentSkills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
    
  );
};

export default AdicionarSkillsPage;
