import "./App.css";
import React, { useEffect } from 'react';
import Explore_Page from "./pages/explore-page/explore_page";
import MAIN_PAGE from "./pages/main-page/main_page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Initial_Explore_Page from "./pages/initial-explore-page/initial_explore_page";
import SignInPage from "./pages/signin-page/signin_page";
import SignUpPage from "./pages/signup-page/signup_page";
import WISHLIST_PAGE from "./pages/wishlist-page/wishlist_page";
import View_Page from "./pages/view_page/view_page";

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
          <Route exact path="/signin" element={<SignInPage />} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/wish-list" element={<WISHLIST_PAGE />} />
          <Route exact path="/view" element={<View_Page />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
