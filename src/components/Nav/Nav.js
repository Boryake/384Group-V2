import React from 'react';
import './Nav.css';
import { useAuth } from '../../context/authContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserEdit, FaUserPlus, FaRegFileAlt } from 'react-icons/fa';
import { SlLogout } from 'react-icons/sl';

export const Nav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleOut = async () => {
    await logout();
    sessionStorage.removeItem('loggedInUser'); // Limpiar la información del usuario de la sesión
    navigate('/login'); // Redirigir a la página de inicio de sesión
  };

  return (
    <nav>
      <ul className="nav">
        <li>
          <NavLink className="home" to="/home" activeClassName="active">
            384 GROUP
          </NavLink>
        </li>
        <li>
          <NavLink to="/form" activeClassName="active">
            <FaRegFileAlt /> Referir Agente
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeClassName="active">
            <FaUserEdit /> Mi Perfil
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" activeClassName="active">
            <FaUserPlus /> Cargar Usuario
          </NavLink>
        </li>
        <li>
          <a onClick={handleOut} className="logOut" href="/">
            <SlLogout /> Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};
