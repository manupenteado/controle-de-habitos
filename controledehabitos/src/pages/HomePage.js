import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="intro">
        <h1>Bem-vindo ao Controle de Hábitos!</h1>
        <p>Gerencie seus hábitos diários de forma simples e eficiente.</p>
      </div>
      <div className="register-section">
        <RegisterPage />
        <button
          className="login-btn"
          onClick={() => navigate('/login')}
        >
          Fazer login
        </button>
      </div>
    </div>
  );
}

export default HomePage;