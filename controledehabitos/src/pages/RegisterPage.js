// src/pages/RegisterPage.js
import { useState } from 'react';
import axios from 'axios'; // ou use fetch
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}users/register`,
        formData
      );
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Mostra mensagem específica do backend, se existir
      setError(err.response?.data?.message || 'Erro no cadastro');
      setSuccess(false);
    }
  };

  console.log('API_URL:', process.env.REACT_APP_API_URL);

  return (
    <div className="register-form">
      <h2>Cadastre-se</h2>
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Cadastro realizado! Redirecionando...
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;