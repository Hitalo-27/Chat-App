import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
export const AuthContext = createContext();
import { decodeToken } from "react-jwt";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [messages, setMessages] = useState([]);
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
        'http://192.168.15.8:8080/user/login',
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

      user.token = response.data.message.token;
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
        'http://192.168.15.8:8080/user/create',
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
      
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const getMessages = async (user, params) => {
    try {
      let response = [];
      if (!params.idConversation) {
        response = await axios.get(
          `http://192.168.15.8:8080/chat/messages/user/${params.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer Authorization ${user.token}`
            },
          }
        );

        params.idConversation = response.data.message.conversationId;
      }

      if(params.idLastMessage){
        if(parseInt(params.senderIdLastMessage) !== parseInt(user.id)){
          await axios.put(
            `http://192.168.15.8:8080/chat/visualize/${params.idLastMessage}`,
            null,
            {
              headers: {
                'Authorization': `Bearer Authorization ${user.token}`
              }
            }
          );
        }
      }
      
      response = await axios.get(
        `http://192.168.15.8:8080/chat/messages/${params.idConversation}`,
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
      setMessages([]);
      return [];
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, register, getMessages, messages, setMessages }}>
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