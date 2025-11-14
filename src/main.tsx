import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SankhyaProvider } from "@/contexts/sankhya-context.tsx";
import App from "@/app/app.tsx";
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";

import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <SankhyaProvider>
      <App />
    </SankhyaProvider>
  </StrictMode>
);
