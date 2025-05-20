import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import HabitosPage from './pages/HabitosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/habitos"
          element={
            localStorage.getItem('token') ? <HabitosPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
