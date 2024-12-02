/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";



interface User {
  email?: string;
  name?: string;
  password?: string;
  type?: string;
}

interface UserContextType {
  user: User | null ;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  orderPopup: boolean;
  setOrderPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleOrderPopup: () => void;
  darkMode: boolean;
  handleThemeSwitch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orderPopup, setOrderPopup] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });



  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);



  const handleThemeSwitch = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const handleOrderPopup = () => {
    setOrderPopup((prev) => !prev);
  };



  

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        orderPopup,
        setOrderPopup,
        handleOrderPopup,
        darkMode,
        handleThemeSwitch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using UserContext
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return {...context};
};
