import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Importe o arquivo de estilo se necessário

const CargosPage = () => {
  const [cargos, setCargos] = useState([]);

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

  return (
    <div className="cargos-page">
      <h2>Todos os Cargos</h2>
      <ul className="cargos-list">
        {cargos.map((cargo) => (
          <li key={cargo.id} className="cargo-item">
            {cargo.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CargosPage;
