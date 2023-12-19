// DialogContext.js
import React, { createContext, useState } from 'react';

export const myContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(true);
  const [notifications,setNotifications] = useState([])

  // You can provide any other values or functions you need within the context here

  return (
    <myContext.Provider value={{ refresh,setRefresh,notifications,setNotifications}}>
      {children}
    </myContext.Provider>
  );
};