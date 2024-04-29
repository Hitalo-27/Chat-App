import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
export const AuthContext = createContext();
import JWT from 'expo-jwt';
import { decodeToken } from "react-jwt";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const JWT_SECRET = "OpI3TaszkA8h6xJkNokRXHFpM7s5TdDzmGWg1YVJPz57lWWLvpmMhmsF9rmIm5U8PM8tr4Xk6E9Bm0ed8H592wJX9bqolPdiACni6sccm1f7o6ejyud8Xid0pGtLIF4Z13qsec7vtuK9zpmspCBMzPlk4nabJuwUfyPykZlSsFPdym5XE3KuxGR3KJW7PgKYFqewgzh7";

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
        'https://c601-2804-7f0-b902-fd18-5896-d97b-244b-da3e.ngrok-free.app/user/login',
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

      const user = decodeToken(response.data.message.token);

      // const myDecodedToken = JWT.decode(response.data.message.token, JWT_SECRET);

      setUser(user);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const logout = async () => {
    try {
      setUser(null);
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