import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./loading-spinner.css";

export const LoadingSpinner = ({ message }) => {
  return (
    <div className="loading-spinner">
      <FaSpinner className="spinner-icon" />
      <p>{message}</p>
    </div>
  );
};
