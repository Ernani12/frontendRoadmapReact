import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; 
import { useNavigate, useLocation } from 'react-router-dom';

const Formulario = () => {
  const [linguagens, setLinguagens] = useState([]);
  const [selectedId, setSelectedId] = useState(null); 
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate(); 
  const location = useLocation();
  
  // Retrieve state passed from previous page
  const { dadosPessoais } = location.state || {};
  
  useEffect(() => {
    const fetchLinguagens = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/cargos/all');
        setLinguagens(response.data);
        // Set the selectedId based on the cargoAtual from dadosPessoais
        if (dadosPessoais && dadosPessoais.cargoAtual) {
          const cargoAtual = response.data.find(cargo => cargo.nome === dadosPessoais.cargoAtual);
          if (cargoAtual) {
            setSelectedId(cargoAtual.id);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar linguagens:', error);
      }
    };

    fetchLinguagens();
  }, [dadosPessoais]);

  useEffect(() => {
    const fetchSkills = async () => {
      if (selectedId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/cargos/${selectedId}/skills`);
          console.log('Habilidades recebidas:', response.data);
          setSkills(response.data);
        } catch (error) {
          console.error('Erro ao buscar habilidades:', error);
        }
      } else {
        setSkills([]);
      }
    };

    fetchSkills();
  }, [selectedId]);

  const handleSelectChange = (event) => {
    setSelectedId(event.target.value);
  };

  const handleViewSkills = () => {
    navigate('/skills');
  };

  const handleViewCargos = () => {
    navigate('/cargos');
  };

  const handleSkillChange = (event) => {
    const { name, checked } = event.target;
    setSkills(skills.map(skill =>
      skill.nome === name
        ? { ...skill, selected: checked, disabled: checked }
        : skill
    ));
  };

  const handleSkillLevelChange = (event, skillName) => {
    const { value } = event.target;
    setSkills(skills.map(skill =>
      skill.nome === skillName ? { ...skill, level: value } : skill
    ));
  };

  const getColorByLevel = (level) => {
    switch (level) {
      case 'pouco':
        return 'red';
      case 'basico':
        return 'yellow';
      case 'muito':
        return 'blue';
      case 'experiente':
        return 'green';
      default:
        return 'black';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const unselectedSkills = skills.filter(skill => !skill.selected);

    try {
      await axios.post('http://localhost:8080/api/cargos/selected', {
        id: selectedId,
        skills: skills.filter(skill => skill.selected).map(skill => ({
          nome: skill.nome,
          level: skill.level,
          color: getColorByLevel(skill.level),
        })),
      });
      alert('Habilidades enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar habilidades:', error);
    }
  };

  const getUnselectedSkills = () => {
    return skills.filter(skill => !skill.selected);
  };

  const navigateToMindMap = () => {
    const unselectedSkills = getUnselectedSkills();
    navigate('/mindmap', { state: { unselectedSkills } });
  };

  return (
    <div className="questionario-form">
      <h2>Questionário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>1- Escolha um Cargo: </h3>
          <select
            id="linguagem"
            value={selectedId || ''}
            onChange={handleSelectChange}
          >
            <option value="">Selecione uma opção</option>
            {linguagens.map((linguagem) => (
              <option key={linguagem.id} value={linguagem.id}>
                {linguagem.nome}
              </option>
            ))}
          </select>
        </div>
        {skills.length > 0 && (
          <div className="skills-group">
            <h3>2- Selecione as Habilidades de acordo com nível de seu conhecimento:</h3>
            <h3> Se eu </h3>

            <table className="skills-table">
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.nome} className="skill-item">
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          name={skill.nome}
                          checked={skill.selected || false}
                          onChange={handleSkillChange}
                        />
                        {skill.nome}
                      </label>
                    </td>
                    <td>
                      {!skill.disabled && (
                        <div className="skill-level-options">
                          <label>
                            <input
                              type="radio"
                              name={`level-${skill.nome}`}
                              value="pouco"
                              checked={skill.level === 'pouco'}
                              onChange={(e) => handleSkillLevelChange(e, skill.nome)}
                              disabled={skill.disabled || false}
                            />
                            Pouco
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`level-${skill.nome}`}
                              value="basico"
                              checked={skill.level === 'basico'}
                              onChange={(e) => handleSkillLevelChange(e, skill.nome)}
                              disabled={skill.disabled || false}
                            />
                            Básico
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`level-${skill.nome}`}
                              value="muito"
                              checked={skill.level === 'muito'}
                              onChange={(e) => handleSkillLevelChange(e, skill.nome)}
                              disabled={skill.disabled || false}
                            />
                            Muito
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`level-${skill.nome}`}
                              value="experiente"
                              checked={skill.level === 'experiente'}
                              onChange={(e) => handleSkillLevelChange(e, skill.nome)}
                              disabled={skill.disabled || false}
                            />
                            Experiente
                          </label>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="button-container">
          <button className="submit-button" type="submit" onClick={navigateToMindMap}>Criar mapa</button>
        </div>
      </form>
      <div>
        <button type="button" onClick={handleViewSkills}>Ver Todas as Habilidades</button>
        <button type="button" onClick={handleViewCargos}>Ver Todos os Cargos</button>
      </div>
    </div>
  );
};

export default Formulario;
