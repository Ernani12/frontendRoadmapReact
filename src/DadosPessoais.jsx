    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    import './index.css';

    const DadosPessoais = () => {
    const [cargos, setCargos] = useState([]);
    const [nome, setNome] = useState('');
    const [cargoAtual, setCargoAtual] = useState('');
    const [cargoDesejado, setCargoDesejado] = useState('Não deseja mudar');
    const [nivelCargo, setNivelCargo] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCargos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/cargos/all');
            setCargos(response.data);
        } catch (error) {
            console.error('Erro ao buscar cargos:', error);
        }
        };

        fetchCargos();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const dadosPessoais = {
        nome,
        cargoAtual,
        cargoDesejado,
        nivelCargo,
        };
        console.log('Dados Pessoais:', dadosPessoais);

        // Armazenar os dados pessoais e navegar para a página Questionario
        navigate('/questionario', { state: { dadosPessoais } });
    };

    return (
        <div className="questionario-form">
        <h2>Dados Pessoais</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
            />
            </div>
            <div className="form-group">
            <label htmlFor="cargoAtual">Cargo Atual:</label>
            <select
                id="cargoAtual"
                value={cargoAtual}
                onChange={(e) => setCargoAtual(e.target.value)}
                required
            >
                <option value="">Selecione um cargo</option>
                {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.nome}>
                    {cargo.nome}
                </option>
                ))}
            </select>
            </div>
            <div className="form-group">
            <label htmlFor="cargoDesejado">Cargo que deseja recolocação:</label>
            <select
                id="cargoDesejado"
                value={cargoDesejado}
                onChange={(e) => setCargoDesejado(e.target.value)}
                required
            >
                <option value="Não deseja mudar">Não deseja mudar</option>
                {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.nome}>
                    {cargo.nome}
                </option>
                ))}
            </select>
            </div>
            <div className="form-group">
            <label htmlFor="nivelCargo">Nível do Cargo:</label>
            <select
                id="nivelCargo"
                value={nivelCargo}
                onChange={(e) => setNivelCargo(e.target.value)}
                required
            >
                <option value="">Selecione o nível</option>
                <option value="Junior">Junior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Senior</option>
            </select>
            </div>
            <div className="button-container">
            <button type="submit" className="submit-button">Enviar</button>
            </div>
        </form>
        <div className="link-container">
            <button onClick={() => navigate('/questionario')}>Ir para Questionário</button>
        </div>
        </div>
    );
    };

    export default DadosPessoais;
