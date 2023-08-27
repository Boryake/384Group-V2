import React, { useState, useEffect } from "react";
import { Nav } from "../Nav/Nav";
import Notification from "../Notification/Notification";
import { isValid, parse } from "date-fns";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import "./Register.css";

export function Register() {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    dni: "",
    birthDate: "",
    password: "384Group",
    rol: "",
  });

  const [privileges, setPrivileges] = useState("");
  const [successNotification, setSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorNotification, setErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState("");
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Realizar la solicitud GET para obtener los usuarios
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://giulianomuratore.com/384group/insertarusuarios.php?baja=0', {
          method: 'GET',
          mode: 'cors',
        });

        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData); // Actualizar la lista de usuarios en el estado
        } else {
          console.error('Error al obtener usuarios:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);
  const handleDateChange = (moment) => {
    setUser({
      ...user,
      birthDate: moment.isValid() ? moment.format("DD/MM/YYYY") : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePrivilegesChange = (e) => {
    setPrivileges(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación de campos
    if (!user.email || !user.firstName || !user.lastName || !user.dni || !user.birthDate || !privileges) {
      setErrorNotification(true);
      setErrorMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setErrorNotification(true);
      setErrorMessage("El correo electrónico no es válido.");
      return;
    }

    // Validación de formato de fecha de nacimiento
    const birthDateParsed = parse(user.birthDate, "dd/MM/yyyy", new Date());
    if (!isValid(birthDateParsed)) {
      setErrorNotification(true);
      setErrorMessage("La fecha de nacimiento no es válida.");
      return;
    }

    // Enviar datos del nuevo usuario a la API
    try {
      const datosToSend = {
        ...user,
        rol: privileges, // Agregar el valor de "privileges" al objeto "datos"
      };
  
      const response = await fetch('https://giulianomuratore.com/384group/insertarusuarios.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosToSend), // Enviar los datos actualizados
      });
  
      const data = await response.text();
      setSuccessNotification(data); // Puedes mostrar la respuesta en la consola
  
      // Limpia el formulario después de la inserción exitosa
      setUser({
        birthDate: '',
        dni: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        rol: null,
      });
      setPrivileges('');
      window.location.reload();

    } catch (error) {
      setErrorMessage('Error al enviar datos:', error);
    }
  };

  const handleSuccessNotificationClose = () => {
    setSuccessNotification(false);
    setSuccessMessage("");
  };

  const handleErrorNotificationClose = () => {
    setErrorNotification(false);
  };

  const handleDelete = async (email) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    
    if (confirmDelete) {
      try {
        // Obtener el usuario que deseas eliminar
        const userToDelete = users.find(user => user.email === email);
        
        // Realizar el PUT para marcar el usuario como dado de baja
        const updatedUserData = {
          id: userToDelete.id,
          baja: 1
        };
  
        const response = await fetch('https://giulianomuratore.com/384group/insertarusuarios.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUserData)
        });
  
        if (response.status === 200) {
          console.log("Usuario dado de baja exitosamente");
          
          // Recargar la página para reflejar los cambios
          window.location.reload();
        } else {
          console.error("Error al dar de baja al usuario:", response.statusText);
        }
      } catch (error) {
        console.error("Error al dar de baja al usuario:", error);
      }
    }
  };
  
  
  return (
    <div className="register-container">
      <div className="register-form-container">
        <Nav />
        {successNotification && showRegistrationSuccess &&(
      <Notification
    message={successMessage}
    type="success"
    onClose={handleSuccessNotificationClose}
    />

    )}
            {errorNotification && (
        <Notification
          message={errorMessage}
          type="error"
          onClose={handleErrorNotificationClose}
        />
      )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">Nombre</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Nombre"
            onChange={handleChange}
            value={user.firstName}
          />
          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Apellido"
            onChange={handleChange}
            value={user.lastName}
          />
          <label htmlFor="dni">Documento</label>
          <input
            type="text"
            name="dni"
            id="dni"
            placeholder="Ej: 35123102"
            onChange={handleChange}
            value={user.dni}
          />
          <label htmlFor="birthDate">Fecha de Nacimiento</label>

         <Datetime
  name="birthDate"
  dateFormat="DD/MM/YYYY"
  timeFormat={false}
  inputProps={{ readOnly: true }}
  value={user.birthDate}
  onChange={handleDateChange}
  renderInput={(props) => (
    <input
      {...props}
      placeholder="dd/mm/yyyy"
      className="custom-datetime-input"
    />
  )}
/>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="ejemplo@gmail.com"
            onChange={handleChange}
            value={user.email}
          />
          <label htmlFor="privileges">Rol</label>
          <select
          type="text"
            name="privileges"
            id="privileges"
            onChange={handlePrivilegesChange}
            value={privileges}
          >
            <option value="">Seleccionar privilegios</option>
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
            <option value="mesaChica">Mesa Chica</option>
          </select>
          <button type="submit" className="register">
            Registrarse
          </button>
        </form>
      </div>
      <div className="register-users-table">
        {error && <div className="errorLog">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI-ID</th>
              <th>Fecha de Nacimiento</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.dni}</td>
                <td>{user.birthDate}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                  {showRegistrationSuccess && (
           <div></div>
          )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
