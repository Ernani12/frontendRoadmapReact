import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Importe o arquivo de estilo se necessário

const CargosPage = () => {
  const [cargos, setCargos] = useState([]);
  const [novoCargo, setNovoCargo] = useState(''); // Estado para o novo cargo

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/cargos/all'); // Altere a URL conforme necessário
        setCargos(response.data);
      } catch (error) {
        console.error('Erro ao buscar cargos:', error);
      }
    };

    fetchCargos();
  }, []);

  const handleAddCargo = async () => {
    if (!novoCargo) {
      alert('Por favor, insira um nome de cargo.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/cargos/addc', { nome: novoCargo });
      setCargos([...cargos, response.data]);
      setNovoCargo(''); // Limpar o campo de entrada após adicionar
    } catch (error) {
      console.error('Erro ao adicionar cargo:', error);
    }
  };

  return (
    <div className="cargos-page">
      <h2>Todos os Cargos</h2>
      <div className="add-cargo-form">
        <input
          type="text"
          value={novoCargo}
          onChange={(e) => setNovoCargo(e.target.value)}
          placeholder="Nome do Cargo"
        />
        <button onClick={handleAddCargo}>Adicionar Cargo</button>
      </div>
      <table className="cargos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {cargos.map((cargo) => (
            <tr key={cargo.id} className="cargo-item">
              <td>{cargo.id}</td>
              <td>{cargo.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CargosPage;
