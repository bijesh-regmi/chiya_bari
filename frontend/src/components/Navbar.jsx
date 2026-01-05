import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">ChiyaBari</Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/subscriptions">Subscriptions</Link>
              <Link to={`/channel/${user.username}`}>My Channel</Link>
              <Link to="/upload" className="upload-btn">Upload</Link>
              <div className="nav-user">
                <Link to="/profile" className="user-info">
                  {user.avatar && (
                    <img src={user.avatar} alt={user.username} className="user-avatar" />
                  )}
                  <span className="user-name">{user.fullName || user.username}</span>
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="upload-btn" style={{ background: 'var(--accent-gradient)' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

