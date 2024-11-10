
import { useContext, useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";

export const authContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    setAdmin(!!accessToken); 
    setLoading(false); 
  }, []);

  return (
    <authContext.Provider value={{ admin, setAdmin, loading }}>
      {loading ? <div>Loading...</div> : children}
    </authContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(authContext);
};
