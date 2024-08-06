import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Importe o arquivo de estilo se necessário

const CargosPage = () => {
  const [cargos, setCargos] = useState([]);
  const [novoCargo, setNovoCargo] = useState(''); // Estado para o novo cargo
  const [editCargoId, setEditCargoId] = useState(null); // ID do cargo sendo editado
  const [editCargoNome, setEditCargoNome] = useState(''); // Nome do cargo sendo editado

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
      const response = await axios.post('http://localhost:8080/api/cargos', { nome: novoCargo });
      setCargos([...cargos, response.data]);
      setNovoCargo(''); // Limpar o campo de entrada após adicionar
    } catch (error) {
      console.error('Erro ao adicionar cargo:', error);
    }
  };

  const handleDeleteCargo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/cargos/remover/${id}`);
      setCargos(cargos.filter(cargo => cargo.id !== id));
    } catch (error) {
      console.error('Erro ao remover cargo:', error);
    }
  };

  const handleEditCargo = (cargo) => {
    setEditCargoId(cargo.id);
    setEditCargoNome(cargo.nome);
  };

  const handleSaveEdit = async () => {
    if (!editCargoNome) {
      alert('Por favor, insira um nome de cargo.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/cargos/edit/${editCargoId}`, { nome: editCargoNome });
      setCargos(cargos.map(cargo => cargo.id === editCargoId ? response.data : cargo));
      setEditCargoId(null);
      setEditCargoNome(''); // Limpar campo de edição após salvar
    } catch (error) {
      console.error('Erro ao editar cargo:', error);
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cargos.map((cargo) => (
            <tr key={cargo.id} className="cargo-item">
              <td>{cargo.id}</td>
              <td>
                {editCargoId === cargo.id ? (
                  <input
                    type="text"
                    value={editCargoNome}
                    onChange={(e) => setEditCargoNome(e.target.value)}
                  />
                ) : (
                  cargo.nome
                )}
              </td>
              <td>
                {editCargoId === cargo.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Salvar</button>
                    <button onClick={() => { setEditCargoId(null); setEditCargoNome(''); }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditCargo(cargo)}>Editar</button>
                    <button onClick={() => handleDeleteCargo(cargo.id)}>Remover</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CargosPage;
