// addModalContext.js
import React, { createContext, useState } from 'react';

export const addModalContext = createContext();

export const AddModalContextProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  

  // You can provide any other values or functions you need within the context here

  return (
    <addModalContext.Provider value={{ openModal,setOpenModal }}>
      {children}
    </addModalContext.Provider>
  );
};