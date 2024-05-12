import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
export const AuthContext = createContext();
import JWT from 'expo-jwt';
import { decodeToken } from "react-jwt";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [conversationUser, setConversationUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const JWT_SECRET = "OpI3TaszkA8h6xJkNokRXHFpM7s5TdDzmGWg1YVJPz57lWWLvpmMhmsF9rmIm5U8PM8tr4Xk6E9Bm0ed8H592wJX9bqolPdiACni6sccm1f7o6ejyud8Xid0pGtLIF4Z13qsec7vtuK9zpmspCBMzPlk4nabJuwUfyPykZlSsFPdym5XE3KuxGR3KJW7PgKYFqewgzh7";

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [conversationUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://192.168.15.5:8080/user/login',
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

      user.token = response.data.message.token;
      setUser(user);

      await conversation(user);

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const logout = async () => {
    try {
      setUser(null);
      setConversationUser([]);
    } catch (error) {

    }
  }

  const register = async (email, name, password) => {
    try {
      const response = await axios.post(
        'http://192.168.15.5:8080/user/create',
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

      const user = decodeToken(response.data.message.token);
      user.token = response.data.message.token;
      setUser(user);
      
      await conversation(user);

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const conversation = async (user) => {
    try {
      const response = await axios.get(
        'http://192.168.15.5:8080/chat/conversation/by-user',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer Authorization ${user.token}`
          },
        }
      );
      setConversationUser(response.data.message);
      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  const getMessages = async (user, idConversation) => {
    try {
      const response = await axios.get(
        `http://192.168.15.5:8080/chat/messages/${idConversation}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer Authorization ${user.token}`
          },
        }
      );

      setMessages(response.data.message);
      return response.data.message;
    } catch (error) {
      return [];
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, conversationUser, getMessages, messages }}>
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