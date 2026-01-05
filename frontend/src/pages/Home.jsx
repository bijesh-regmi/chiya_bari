import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Home.css'

function Home() {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?._id) {
      fetchVideos()
    }
  }, [user])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await api.get('/videos', {
        params: {
          userId: user._id,
          page: 1,
          limit: 20
        }
      })
      if (response.data.success) {
        setVideos(response.data.data)
      }
    } catch (err) {
      // No videos found is not really an error for the user
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load videos')
      }
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (duration) => {
    if (!duration) return ''
    const seconds = parseFloat(duration)
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (!views) return '0 views'
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
    return `${views} views`
  }

  if (loading) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="home-header">
            <h1>Discover Videos</h1>
          </div>
          <div className="video-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-thumbnail"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="home-header">
          <h1>Discover Videos</h1>
        </div>

        {error && <div className="error">{error}</div>}

        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((video) => (
              <Link key={video._id} to={`/video/${video._id}`} className="video-card">
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  {video.duration && (
                    <span className="duration">{formatDuration(video.duration)}</span>
                  )}
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <div className="video-meta">
                    {video.owner?.avatar && (
                      <img src={video.owner.avatar} alt="" className="channel-avatar" />
                    )}
                    <div className="video-meta-text">
                      <div className="channel-name">
                        {video.owner?.fullName || video.owner?.username || 'Unknown'}
                      </div>
                      <div className="video-stats">
                        {formatViews(video.views)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="home-empty">
            <div className="home-empty-icon">🎬</div>
            <h2>No videos yet</h2>
            <p>Be the first to share something amazing!</p>
            <Link to="/upload">
              <button className="primary">Upload Your First Video</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

