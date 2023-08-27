import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Register } from './components/Register/Register';
import { Login } from "./components/Login/Login";
import { AuthProvider, useAuth } from "./context/authContext";
import { Form } from "./components/Form/Form";
import { Profile } from "./components/Profile/Profile";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/form"
          element={
            <PrivateRoute>
              <Form />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <Register />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/" replace />;
}

export default App;