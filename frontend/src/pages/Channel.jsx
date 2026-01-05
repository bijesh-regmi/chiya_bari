import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Channel.css'
import './Home.css'

function Channel() {
  const { username } = useParams()
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('videos')

  useEffect(() => {
    fetchChannel()
  }, [username])

  const fetchChannel = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/users/channel/${username}`)
      if (response.data.success) {
        setChannel(response.data.data)
        // Fetch channel videos if we have the user ID
        // For now, we'll show a placeholder
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Channel not found')
    } finally {
      setLoading(false)
    }
  }

  const formatCount = (count) => {
    if (!count) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  if (loading) {
    return (
      <div className="channel-page">
        <div className="channel-cover skeleton"></div>
        <div className="container" style={{ paddingTop: 100 }}>
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !channel) {
    return (
      <div className="channel-page">
        <div className="container" style={{ paddingTop: 120 }}>
          <div className="error" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <h2 style={{ marginBottom: 16 }}>😕 {error || 'Channel not found'}</h2>
            <Link to="/">
              <button className="primary">Go Back Home</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOwnChannel = user?.username === channel.username

  return (
    <div className="channel-page">
      {/* Cover */}
      <div className="channel-cover">
        {channel.coverImage && (
          <img src={channel.coverImage} alt="Channel cover" />
        )}
      </div>

      {/* Header */}
      <div className="channel-header">
        {channel.avatar ? (
          <img src={channel.avatar} alt={channel.username} className="channel-avatar-large" />
        ) : (
          <div className="channel-avatar-large" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            background: 'var(--bg-tertiary)'
          }}>
            👤
          </div>
        )}
        <div className="channel-info">
          <h1 className="channel-name">{channel.fullName}</h1>
          <p className="channel-handle">@{channel.username}</p>
          <div className="channel-stats">
            <span>
              <strong>{formatCount(channel.subscribersCount)}</strong> subscribers
            </span>
            <span>
              <strong>{formatCount(channel.channelsSubscribedTo)}</strong> subscriptions
            </span>
          </div>
        </div>
        <div className="channel-actions">
          {isOwnChannel ? (
            <Link to="/profile">
              <button>Edit Profile</button>
            </Link>
          ) : (
            <button className={`subscribe-btn ${channel.isSubscribed ? 'subscribed' : ''}`}>
              {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="channel-tabs">
        <button
          className={activeTab === 'videos' ? 'active' : ''}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      {/* Content */}
      <div className="channel-content">
        {activeTab === 'videos' && (
          <div>
            {videos.length > 0 ? (
              <div className="video-grid">
                {videos.map((video) => (
                  <Link key={video._id} to={`/video/${video._id}`} className="video-card">
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                    </div>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      <div className="video-meta-text">
                        <div className="video-stats">{video.views} views</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="home-empty">
                <div className="home-empty-icon">🎬</div>
                <h2>No videos yet</h2>
                <p>This channel hasn't uploaded any videos</p>
                {isOwnChannel && (
                  <Link to="/upload">
                    <button className="primary" style={{ marginTop: 16 }}>
                      Upload Your First Video
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="card" style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 16 }}>About {channel.fullName}</h3>
            <p style={{ marginBottom: 16 }}>@{channel.username}</p>
            <p style={{ color: 'var(--text-muted)' }}>
              Email: {channel.email}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Channel
