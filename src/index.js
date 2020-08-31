import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import { AuthenticationProvider } from './services/AuthenticationService';

import InitialApp from './InitialApp';

ReactDOM.render(
  <AuthenticationProvider>
    <InitialApp />
  </AuthenticationProvider>,
  document.getElementById('root')
);
