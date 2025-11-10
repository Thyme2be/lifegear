"use client";

import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastMount() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      theme="colored"
      transition={Bounce}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      draggable
    />
  );
}
