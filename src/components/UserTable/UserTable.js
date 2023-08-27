import { useEffect, useState } from "react";
import { db } from "../../context/authContext";

export function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollection = db.collection("usuarios");
        const querySnapshot = await usersCollection.get();
        const userList = querySnapshot.docs.map((doc) => doc.data());
        setUsers(userList);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    getUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      const usersCollection = db.collection("usuarios");
      const querySnapshot = await usersCollection.where("email", "==", email).get();
      const userDoc = querySnapshot.docs[0];
      
      if (userDoc) {
        await userDoc.ref.delete();
        const updatedUsers = users.filter((user) => user.email !== email);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Password</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <td>{user.email}</td>
            <td>{user.password}</td>
            <td>
              <button onClick={() => handleDelete(user.email)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
