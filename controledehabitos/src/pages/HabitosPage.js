import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HabitosPage.css';

const diasSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

function HabitosPage() {
  const [habitos, setHabitos] = useState([]);
  const [novoHabito, setNovoHabito] = useState('');
  const [frequencia, setFrequencia] = useState('daily');
  const [description, setDescription] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchHabitos() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}habits`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHabitos(response.data.data);
      } catch (err) {
        setHabitos([]);
      }
    }
    fetchHabitos();
  }, [token]);

  async function criarHabito() {
    try {
      const body = {
        name: novoHabito,
        frequency: [frequencia],
      };
      if (description) body.description = description;
      if (frequencia === 'specific_days' && daysOfWeek.length > 0) body.daysOfWeek = daysOfWeek;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}habits`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabitos([...habitos, response.data.data]);
      setNovoHabito('');
      setDescription('');
      setFrequencia('daily');
      setDaysOfWeek([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar hábito');
    }
  }

  async function deletarHabito(id) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}habits/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabitos(habitos.filter(h => h._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao deletar hábito');
    }
  }

  function iniciarEdicao(habito) {
    setEditandoId(habito._id);
    setEditForm({
      name: habito.name,
      description: habito.description || '',
      frequency: habito.frequency[0] || 'daily',
      daysOfWeek: habito.daysOfWeek || [],
    });
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === 'daysOfWeek') {
      setEditForm(prev => ({
        ...prev,
        daysOfWeek: checked
          ? [...prev.daysOfWeek, value]
          : prev.daysOfWeek.filter(d => d !== value),
      }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  }

  async function salvarEdicao(id) {
    try {
      const body = {
        name: editForm.name,
        frequency: [editForm.frequency],
        description: editForm.description,
      };
      if (editForm.frequency === 'specific_days') {
        body.daysOfWeek = editForm.daysOfWeek;
      }
      await axios.put(
        `${process.env.REACT_APP_API_URL}habits/${id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditandoId(null);
      // Atualiza lista
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}habits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabitos(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao editar hábito');
    }
  }

  return (
    <div className="habitos-container">
      <h2>Seus Hábitos</h2>
      <ul className="habitos-lista">
        {habitos.map(h => (
          <li className="habito-item" key={h._id}>
            {editandoId === h._id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Nome"
                />
                <input
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Descrição"
                />
                <select
                  name="frequency"
                  value={editForm.frequency}
                  onChange={handleEditChange}
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="specific_days">Dias específicos</option>
                </select>
                {editForm.frequency === 'specific_days' && (
                  <div className="dias-checkbox">
                    {diasSemana.map(dia => (
                      <label key={dia}>
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={dia}
                          checked={editForm.daysOfWeek.includes(dia)}
                          onChange={handleEditChange}
                        />
                        {dia}
                      </label>
                    ))}
                  </div>
                )}
                <div className="botoes-habito">
                  <button onClick={() => salvarEdicao(h._id)}>Salvar</button>
                  <button onClick={() => setEditandoId(null)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="botoes-habito">
                  <button onClick={() => iniciarEdicao(h)}>Editar</button>
                  <button onClick={() => deletarHabito(h._id)}>Deletar</button>
                </div>
                <div>
                  <strong>{h.name}</strong> ({h.frequency.join(', ')})
                  {h.description && <> - {h.description}</>}
                  {h.frequency.includes('specific_days') && h.daysOfWeek && (
                    <> [{h.daysOfWeek.join(', ')}]</>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="novo-habito-section">
        <form
          className="novo-habito-form"
          onSubmit={e => {
            e.preventDefault();
            criarHabito();
          }}
        >
          <input
            type="text"
            value={novoHabito}
            onChange={e => setNovoHabito(e.target.value)}
            placeholder="Novo hábito"
            required
          />
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
          />
          <select
            value={frequencia}
            onChange={e => setFrequencia(e.target.value)}
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="specific_days">Dias específicos</option>
          </select>
          {frequencia === 'specific_days' && (
            <div className="dias-checkbox">
              {diasSemana.map(dia => (
                <label key={dia}>
                  <input
                    type="checkbox"
                    value={dia}
                    checked={daysOfWeek.includes(dia)}
                    onChange={e => {
                      if (e.target.checked) {
                        setDaysOfWeek([...daysOfWeek, dia]);
                      } else {
                        setDaysOfWeek(daysOfWeek.filter(d => d !== dia));
                      }
                    }}
                  />
                  {dia}
                </label>
              ))}
            </div>
          )}
          <button className="novo-habito-btn" type="submit">
            Adicionar Hábito
          </button>
        </form>
      </div>
    </div>
  );
}

export default HabitosPage;