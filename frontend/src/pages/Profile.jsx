import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Profile.css'

function Profile() {
  const { user, checkAuth } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await api.patch('/users/update-account', { fullName, email })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      checkAuth()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await api.post('/users/change-password', {
        oldPassword,
        newPassword,
        confirmPassword
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="container profile-container">
        {/* Header */}
        <div className="profile-header">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="profile-avatar" />
          ) : (
            <div className="profile-avatar" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-tertiary)',
              fontSize: '3rem'
            }}>
              👤
            </div>
          )}
          <div className="profile-info">
            <h1>{user?.fullName}</h1>
            <p className="username">@{user?.username}</p>
            <p className="email">{user?.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={message.type === 'error' ? 'error' : 'success'}>
            {message.text}
          </div>
        )}

        {/* Update Profile */}
        <div className="profile-section">
          <h2>Profile Information</h2>
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="profile-section">
          <h2>Change Password</h2>
          <form className="password-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

