import React, { useState, useEffect } from "react";
import { Nav } from "../Nav/Nav";
import "./Profile.css";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

export function Profile() {
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [photoURL, setPhotoURL] = useState("https://www.citypng.com/public/uploads/preview/png-profile-user-round-gray-icon-symbol-11639594342slkdqxcgi6.png");
  const [users, setUsers] = useState([]);
  const { user } = useAuth(); 
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState("");

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  async function handleClick() {
    if (!photo) {
      return;
    }

    // uploadPH function logic

    setLoading2(true);

    try {
      // Logic for uploading photo
    } catch (error) {
      console.error('Error al subir la foto:', error);
      setLoading2(false);
    }
  }

  useEffect(() => {
    // Logic for setting photo URL
  }, []);


  const handleChangePassword = async (e) => {
    e.preventDefault(); 
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    if (!newPassword.trim()) {
      setError("La nueva contraseña no puede estar vacía");
      return;
    }
  
    const userDataJSON = sessionStorage.getItem("loggedInUser");
    try {
      if (!userDataJSON) {
        setError("No se pudo obtener los datos de usuario");
        return;
      }
    
      const userData = JSON.parse(userDataJSON);
      if (!userData || !userData.id) {
        setError("No se pudo obtener el ID de usuario");
        return;
      }
    
      const userId = userData.id;
      
      const updatedUserData = {
        id: userId,
        password: newPassword
      };
  
      const response = await fetch(
        "https://giulianomuratore.com/384group/insertarusuarios.php",
        {
          method: "PUT",
          mode: 'cors',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedUserData)
        }
      );
  
      if (response.status === 200) {
        setSuccessMessage("Contraseña actualizada exitosamente");
        setNewPassword(""); 
        setConfirmPassword("");
      window.location.reload();
        // Manejar más acciones si es necesario
      } else {
        setError("No se pudo actualizar la contraseña");
        setNewPassword(""); // Reinicia el campo de nueva contraseña
        setConfirmPassword("");
        console.log("Error al actualizar contraseña:", await response.json());

      }
    } catch (error) {
      setError("No se pudo actualizar la contraseña");
      setNewPassword(""); // Reinicia el campo de nueva contraseña
      setConfirmPassword("");
      console.log("Error al actualizar contraseña:", error);

    }
  };
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://giulianomuratore.com/384group/insertarusuarios.php', {
          method: 'GET',
          mode: 'cors',
        });

        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          console.error('Error al obtener usuarios:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <Nav></Nav>
      <form className="formPass">
        <h2>Cambiar Contraseña</h2>
        <div>
          <p>Nombre de usuario: {user.email}</p>       
        </div>
        {error && <p>{error}</p>}
        {success && <p>Contraseña cambiada exitosamente</p>}
        <label>
          Nueva contraseña:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label> 
          Confirmar contraseña:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button onClick={handleChangePassword}>Cambiar contraseña</button>
      </form>
      <br/>
      <div className="profile-container">
        <form>
          <div className="rows"></div>
          <div>
            <h2>Perfil de usuario</h2>
            <div>
              <img src={photoURL} alt="Avatar" className="avatar"/>
            </div>
            <div className="text-profile">
              {/* Resto de tu código para mostrar datos de usuario */}
            </div>
            <div class="wrapper">
              <div class="divider div-transparent"></div>
            </div>
            <div className="imageUploader">
              <p>Elegí una imágen para subir!</p>
              <input type="file" onChange={handleChange}></input>
              <button disabled={loading2 || !photo} onClick={handleClick}>Cargar Imagen</button> 
            </div>
            <div className="text-profile"></div>
          </div>
        </form>
      </div>
    </div>
  );
}
