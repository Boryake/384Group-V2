import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import './Login.css';

export function Login() {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(userCredentials.email, userCredentials.password); 
      navigate("/home"); 
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return (
    <div className="container">
      <div className="login">
        <div className="logo">
          <div>
            <span>384</span>
          </div>
          <div>
            <h1>GROUP</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo"
            value={userCredentials.email}
            onChange={handleChange}
          />
          <label htmlFor="password" className="pass">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="pass"
            placeholder="Contraseña"
            value={userCredentials.password}
            onChange={handleChange}
          />
          <button>Login</button>
          {error && <p className="errorLog">{error}</p>}
        </form>
      </div>
      <div className="company-image"></div>
    </div>
  );
}
