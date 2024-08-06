import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Importe o arquivo de estilo
import { useNavigate } from 'react-router-dom'; // Certifique-se de importar useNavigate


const Formulario = () => {
  const [linguagens, setLinguagens] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // Altere para armazenar o ID
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate(); // Hook para acessar a navegação

  
  // Função para buscar as linguagens do backend
  useEffect(() => {
    const fetchLinguagens = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/linguagens/all');
        setLinguagens(response.data);
      } catch (error) {
        console.error('Erro ao buscar linguagens:', error);
      }
    };

    fetchLinguagens();
  }, []);

  // Função para buscar as habilidades da linguagem selecionada
  useEffect(() => {
    const fetchSkills = async () => {
      if (selectedId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/linguagens/${selectedId}/skills`);
          console.log('Habilidades recebidas:', response.data);
          setSkills(response.data);
        } catch (error) {
          console.error('Erro ao buscar habilidades:', error);
        }
      } else {
        setSkills([]); // Limpar habilidades se nenhuma linguagem estiver selecionada
      }
    };

    fetchSkills();
  }, [selectedId]);

  // Função para lidar com a mudança na seleção
  const handleSelectChange = (event) => {
    setSelectedId(event.target.value); // Altere para armazenar o ID
  };

  // Função para redirecionar para a página de habilidades
  const handleViewSkills = () => {
    navigate('/skills');
  };
   
  // Função para lidar com a mudança nos checkboxes de habilidades
  const handleSkillChange = (event) => {
    const { name, checked } = event.target;
    setSkills(skills.map(skill =>
      skill.nome === name ? { ...skill, selected: checked } : skill
    ));
  };

  // Função para enviar o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Enviar a seleção de habilidades para o backend
      await axios.post('http://localhost:8080/api/linguagens/selected', {
        id: selectedId, // Altere para enviar o ID
        skills: skills.filter(skill => skill.selected).map(skill => skill.nome),
      });
      alert('Habilidades enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar habilidades:', error);
    }
  };

  return (
    <div className="questionario-form">
      <h2>Questionário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="linguagem">Escolha um Cargo:</label>
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
            <h3>Habilidades:</h3>
            {skills.map((skill) => (
              <div key={skill.nome} className="skill-item">
                <label>
                  <input
                    type="checkbox"
                    name={skill.nome}
                    checked={skill.selected || false}
                    onChange={handleSkillChange}
                  />
                  {skill.nome}
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="button-container">
          <button className="submit-button" type="submit">Enviar</button>
        </div>
      </form>
          <div>
          <button type="button" onClick={handleViewSkills}>Ver Todas as Habilidades</button>

          </div>
    </div>
    
  );
};

export default Formulario;
