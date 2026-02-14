// Import React context hooks for global state management
import { createContext, useContext, useState } from "react";


// Create authentication context
// This will hold user data and authentication functions globally
const AuthContext = createContext();


// Provider component to wrap entire app
// Makes authentication data accessible to all child components
export const AuthProvider = ({ children }) => {

  // State to store logged-in user information
  const [user, setUser] = useState(null);

  /*
    LOGIN FUNCTION
    - Stores user data in React state
    - Also saves data in localStorage for persistence
    - Useful when refreshing page (user stays logged in)
  */
  const loginUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    // Provide user state and login function globally
    <AuthContext.Provider value={{ user, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/*
  CUSTOM HOOK: useAuth
  - Simplifies accessing authentication context
  - Instead of:
        useContext(AuthContext)
    Developers can simply use:
        useAuth()
*/
export const useAuth = () => useContext(AuthContext);