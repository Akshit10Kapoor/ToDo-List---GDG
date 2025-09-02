import React from "react";
import { Provider } from "react-redux";
import { store } from "./ReduxStore/Store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./Pages/MainPage";
import LandingPage from "./Pages/LandingPage";


const App = () => {
  return (
    <Provider store={store}>
        <Routes>
          <Route path="/todo" element={<MainPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>

    </Provider>
  );
};

export default App;
