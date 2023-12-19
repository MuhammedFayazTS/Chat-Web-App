// DialogContext.js
import React, { createContext, useState } from 'react';

export const loaderContext = createContext();

export const LoaderContextProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  // You can provide any other values or functions you need within the context here

  return (
    <loaderContext.Provider value={{ loaded,setLoaded}}>
      {children}
    </loaderContext.Provider>
  );
};