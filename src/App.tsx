import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./Component/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        {" "}
        <Route path="/login" element={<Login />} />{" "}
      </Routes>
    </div>
  );
}

export default App;
