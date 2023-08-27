import React, { createContext, useContext, useEffect, useState } from "react";
import { navigate } from "@reach/router";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch(`https://giulianomuratore.com/384group/insertarusuarios.php?email=${email}`);
      if (response.ok) {
        const userData = await response.json();

        if (userData.length > 0 && userData[0].password === password) {
          const userToStore = {
            id: userData[0].id,
            birthDate: userData[0].birthDate,
            dni: userData[0].dni,
            email: userData[0].email,
            firstName: userData[0].firstName,
            lastName: userData[0].lastName,
            rol: userData[0].rol,
          };

          sessionStorage.setItem('loggedInUser', JSON.stringify(userToStore));
          setUser(userToStore);
          navigate("/home");
        } else {
          setError('Usuario no encontrado o contraseña incorrecta');
        }
      } else {
        setError('Error al obtener datos de usuario');
      }
    } catch (error) {
      setError('Error de red');
    }
  };

  const logout = () => {
    sessionStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // You can add logic here to check if the user is authenticated in the session and set it in 'user'
    setLoading(false);
  }, []);

  return (
    <authContext.Provider value={{ login, logout, user, loading, error }}>
      {children}
    </authContext.Provider>
  );
}
