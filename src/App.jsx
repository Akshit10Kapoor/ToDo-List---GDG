import React from 'react'
import { Provider } from 'react-redux';
import { store } from './ReduxStore/Store';
import MainPage from './Pages/MainPage';


const App = () => {
  return (
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
}

export default App