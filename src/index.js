import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import store from './redux/store'
import './assets/css/styles.css'
import './i18n/config'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  //

  if (
    token &&
    !config.url.endsWith('/admin') &&
    !config.url.includes('/createOrder')
  ) {
    config.headers['Authorization'] = 'Bearer ' + token
  }

  return config
})

let persistor = persistStore(store)

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)
