import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
export const AuthContext = createContext();
import { decodeToken } from "react-jwt";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [removeUserGroup, setRemoveUserGroup] = useState(false);
  const JWT_SECRET = "OpI3TaszkA8h6xJkNokRXHFpM7s5TdDzmGWg1YVJPz57lWWLvpmMhmsF9rmIm5U8PM8tr4Xk6E9Bm0ed8H592wJX9bqolPdiACni6sccm1f7o6ejyud8Xid0pGtLIF4Z13qsec7vtuK9zpmspCBMzPlk4nabJuwUfyPykZlSsFPdym5XE3KuxGR3KJW7PgKYFqewgzh7";

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const removeUserGroupFunc = async () => {
    try {
      setRemoveUserGroup(!removeUserGroup);
    }
    catch (error) {
      console.log(error.response);
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://aps-redes-service.onrender.com/user/login',
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
        'https://aps-redes-service.onrender.com/user/create',
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

  // Função assíncrona para verificar se a mensagem foi visualizada
  async function checkMessages(response) {
    for (const message of response.data.message) {
      if (parseInt(message.senderId) !== parseInt(user.id)) {
        if (!message.visualize) {
          try {
            await axios.put(
              `https://aps-redes-service.onrender.com/chat/visualize/${message.id}`,
              null,
              {
                headers: {
                  'Authorization': `Bearer Authorization ${user.token}`
                }
              }
            );

            message.visualize = true;
          } catch (error) {
            console.error('Erro ao atualizar a visualização da mensagem:', error.response.data);
            
          }
        }
      }
    }

    return response;
  }

  const getMessages = async (user, params) => {
    try {
      let response = [];
      if (!params.idConversation) {
        response = await axios.get(
          `https://aps-redes-service.onrender.com/chat/messages/user/${params.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer Authorization ${user.token}`
            },
          }
        );

        params.idConversation = response.data.message.conversationId;
      }

      if (params.idLastMessage) {
        if (parseInt(params.senderIdLastMessage) !== parseInt(user.id)) {
          await axios.put(
            `https://aps-redes-service.onrender.com/chat/visualize/${params.idLastMessage}`,
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
        `https://aps-redes-service.onrender.com/chat/messages/${params.idConversation}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer Authorization ${user.token}`
          },
        }
      );

      let messagesAtualizadas = await checkMessages(response);

      setMessages(messagesAtualizadas.data.message);

      return messagesAtualizadas;
    } catch (error) {
      setMessages([]);
      return [];
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, register, getMessages, messages, setMessages, selectedUsers, setSelectedUsers, removeUserGroup, setRemoveUserGroup, removeUserGroupFunc }}>
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