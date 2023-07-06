import "./App.css";
import React, { useEffect } from 'react';
import Explore_Page from "./pages/explore-page/explore_page";
import MAIN_PAGE from "./pages/main-page/main_page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Initial_Explore_Page from "./pages/initial-explore-page/initial_explore_page";
import LoginPage from "./pages/login-page/Login_page";

function App() {
  useEffect(() => {
    document.title = 'Travel Companion'; // Set the new title here
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<MAIN_PAGE />} />
          <Route exact path="/explore/:id/:days" element={<Explore_Page />} />
          <Route exact path="/initial_explore/:id/:days/:destination" element={<Initial_Explore_Page />} />
          <Route exact path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
