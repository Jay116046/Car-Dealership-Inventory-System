import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const container = document.getElementById('root');
const root = createRoot(container);

const initialOptions = {
    "client-id": "test",
    currency: "USD",
    intent: "capture",
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={initialOptions}>
        <App />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
