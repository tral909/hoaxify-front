import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HashRouter } from 'react-router-dom/cjs/react-router-dom'
import reportWebVitals from './reportWebVitals'
import App from './containers/App'
import * as apiCalls from './api/apiCalls'

const actions = {
    postLogin: apiCalls.login
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <HashRouter>
        <App />
    </HashRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
