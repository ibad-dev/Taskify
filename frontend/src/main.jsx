import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
     <BrowserRouter>
      <AuthProvider>
        <App />
         <ToastContainer
          position="top-right"
          autoClose={2000}
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
