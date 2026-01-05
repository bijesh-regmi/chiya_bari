import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import './Subscriptions.css'

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      // This would need a backend endpoint for getting user subscriptions
      // For now, we'll show an empty state
      setSubscriptions([])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="subscriptions-page">
        <div className="container">
          <div className="subscriptions-header">
            <h1>Subscriptions</h1>
          </div>
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="subscriptions-page">
      <div className="container">
        <div className="subscriptions-header">
          <h1>Subscriptions</h1>
          <p>Channels you've subscribed to</p>
        </div>

        {error && <div className="error">{error}</div>}

        {subscriptions.length > 0 ? (
          <div className="channels-grid">
            {subscriptions.map((channel) => (
              <Link
                key={channel._id}
                to={`/channel/${channel.username}`}
                className="channel-card"
              >
                {channel.avatar ? (
                  <img src={channel.avatar} alt={channel.username} className="avatar" />
                ) : (
                  <div className="avatar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-tertiary)',
                    fontSize: '1.5rem'
                  }}>
                    👤
                  </div>
                )}
                <div className="info">
                  <div className="name">{channel.fullName}</div>
                  <div className="handle">@{channel.username}</div>
                  <div className="subs">{channel.subscribersCount || 0} subscribers</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="subscriptions-empty">
            <div className="subscriptions-empty-icon">📺</div>
            <h2>No subscriptions yet</h2>
            <p>Subscribe to channels to see their latest videos here</p>
            <Link to="/">
              <button className="primary">Discover Channels</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscriptions

