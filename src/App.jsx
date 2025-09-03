import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./ReduxStore/Store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./ReduxStore/Reducers";
import AuthService from "./services/authServices";

import MainPage from "./Pages/MainPage";
import LandingPage from "./Pages/LandingPage";

// Component to handle auth initialization
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = AuthService.getToken();
    const user = AuthService.getCurrentUserFromStorage();

    if (token && user) {
      dispatch(setUser({ user, token }));
    }
  }, [dispatch]);

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      
          <AuthInitializer>
            <Routes>
              <Route path="/todo" element={<MainPage />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
          </AuthInitializer>
        
      </PersistGate>
    </Provider>
  );
};

export default App;
