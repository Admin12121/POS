import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import './index.css'
import App from "./App.jsx";
import { store } from "./Fetch_Api/store.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);