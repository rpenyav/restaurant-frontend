import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { UserProvider } from "./context/UserContext";
import i18n from "./i18n/i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <UserProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </UserProvider>
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
