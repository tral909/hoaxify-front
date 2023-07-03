import React from 'react'
import logo from '../assets/hoaxify-logo.png'
import { Link } from 'react-router-dom'

class TopBar extends React.Component {
    render() {
        return (
            <div className='bg-white shadow-sm mb-2'>
                <nav className='navbar navbar-light navbar-expand'>
                    <div className='container'>
                        <Link to='/' className='navbar-brand'>
                            <img src={logo} width='60' alt='Hoaxify' /> Hoaxify
                        </Link>
                        <ul className='nav navbar-nav ml-auto'>
                            <li className='nav-item'>
                                <Link to='/signup' className='nav-link'>
                                    Sign Up
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link to='/login' className='nav-link'>
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default TopBar