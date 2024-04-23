import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://c288-2804-7f0-b902-fd18-d0bc-41a1-27e1-b8d.ngrok-free.app/user/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setUser(true);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const logout = async () => {
    try {
      setUser(false);
    } catch (error) {

    }
  }

  const register = async (email, name, password) => {
    try {
      const response = await axios.post(
        'https://c288-2804-7f0-b902-fd18-d0bc-41a1-27e1-b8d.ngrok-free.app/user/create',
        {
          email: email,
          name: name,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setUser(true);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }
  return value;
}