import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = new FormData()
      data.append('username', formData.username)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('fullName', formData.fullName)
      if (avatar) data.append('avatar', avatar)
      if (coverImage) data.append('coverImage', coverImage)

      await register(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <div className="logo">ChiyaBari</div>
          <h1>Create Account</h1>
          <p>Join our community and start sharing videos</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="avatar-upload-section">
            <div className="avatar-upload">
              <label>Profile Picture *</label>
              <div className="file-upload">
                <div className="file-upload-icon">📷</div>
                <div className="file-upload-text">Upload Avatar</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  required
                />
              </div>
              {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />}
            </div>

            <div className="avatar-upload">
              <label>Cover Image</label>
              <div className="file-upload">
                <div className="file-upload-icon">🖼️</div>
                <div className="file-upload-text">Upload Cover</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </div>
              {coverPreview && <img src={coverPreview} alt="Cover preview" className="cover-preview" />}
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register

