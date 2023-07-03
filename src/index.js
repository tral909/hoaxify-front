import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HashRouter } from 'react-router-dom/cjs/react-router-dom'
import reportWebVitals from './reportWebVitals'
import App from './containers/App'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import authReducer from './redux/authReducer'

const loggedInState = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile.png',
    password: 'P4ssword',
    isLoggedIn: true
}

const store = createStore(authReducer, loggedInState)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
