// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ used to wait for profile

  const login = async (formData) => {
    const res = await axios.post(
      "http://localhost:8000/api/v1/users/login-user",
      formData,
      { withCredentials: true }
    );
    setUser(res.data.data);
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:8000/api/v1/users/logout-user",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/get-user-profile",
        { withCredentials: true }
      );
      console.log("USER PROFILE", res.data);
      setUser(res.data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("HELLLOOO");
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
