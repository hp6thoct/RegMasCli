import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Header from "./Components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "./Context/UserContext";
import 'antd/dist/reset.css';
import Timetable from "./Pages/Timetable";
import Home from "./Pages/Home";



function App() {
  return (
    <UserProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
        
      </div>
    </UserProvider>
  );
}

export default App;
