import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    if(user){
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async () => {
    try{
      setUser(true);
    } catch (error) {

    }
  }

  const logout = async () => {
    try{
      setUser(false);
    } catch (error) {

    }
  }

  const register = async () => {
    try{
      setUser(true);
    } catch (error) {

    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = ()=>{
  const value = useContext(AuthContext);

  if(!value){
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }
  return value;
}