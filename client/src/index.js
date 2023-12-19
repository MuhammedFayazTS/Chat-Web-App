import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { IsAdminContextProvider } from "./Context/DialogContext";
import { AddModalContextProvider } from "./Context/addModalContext";
import { LoaderContextProvider } from "./Context/loaderContext";
import { MyContextProvider } from "./Context/myContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <MyContextProvider>
        <LoaderContextProvider>
          <AddModalContextProvider>
            <IsAdminContextProvider>
              <App />
            </IsAdminContextProvider>
          </AddModalContextProvider>
        </LoaderContextProvider>
        </MyContextProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
