import React from 'react';
import { render } from 'react-dom';
import App from '../components/App';

const mountApp = () => {
  const AppContainer = document.createElement('div');
  AppContainer.id = 'app-container';
  document.body.appendChild(AppContainer);

  render(<App />, window.document.getElementById('app-container'));
};

export default mountApp;
