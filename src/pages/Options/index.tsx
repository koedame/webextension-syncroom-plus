import React from 'react';
import { render } from 'react-dom';

import App from '../../components/App';
import '../../assets/styles/tailwind.css';

render(<App />, window.document.querySelector('#app-container'));

if (module) {
  (module as any).hot?.accept();
}
