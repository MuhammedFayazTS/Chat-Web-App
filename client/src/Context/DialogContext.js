// DialogContext.js
import React, { createContext, useState } from 'react';

export const isAdminContext = createContext();

export const IsAdminContextProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  // You can provide any other values or functions you need within the context here

  return (
    <isAdminContext.Provider value={{ isAdmin,setIsAdmin }}>
      {children}
    </isAdminContext.Provider>
  );
};
