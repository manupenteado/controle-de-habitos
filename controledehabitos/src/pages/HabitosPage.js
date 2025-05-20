import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HabitosPage() {
  const [habitos, setHabitos] = useState([]);
  const [novoHabito, setNovoHabito] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchHabitos() {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/habitos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabitos(response.data);
    }
    fetchHabitos();
  }, [token]);

  async function criarHabito() {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/habitos`,
      { nome: novoHabito },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setHabitos([...habitos, response.data]);
    setNovoHabito('');
  }

  async function deletarHabito(id) {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/habitos/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setHabitos(habitos.filter(h => h._id !== id));
  }

  // Para editar, você pode criar um input para cada hábito e um botão de salvar

  return (
    <div>
      <h2>Seus Hábitos</h2>
      <ul>
        {habitos.map(h => (
          <li key={h._id}>
            {h.nome}
            <button onClick={() => deletarHabito(h._id)}>Deletar</button>
            {/* Adicione aqui botão/inputs para editar */}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={novoHabito}
        onChange={e => setNovoHabito(e.target.value)}
        placeholder="Novo hábito"
      />
      <button onClick={criarHabito}>Adicionar Hábito</button>
    </div>
  );
}

export default HabitosPage;