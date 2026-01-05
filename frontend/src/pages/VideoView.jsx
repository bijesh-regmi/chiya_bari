import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import './VideoView.css'

function VideoView() {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    fetchVideo()
  }, [videoId])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/videos/${videoId}`)
      if (response.data.success) {
        setVideo(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load video')
    } finally {
      setLoading(false)
    }
  }

  const formatViews = (views) => {
    if (!views) return '0 views'
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
    return `${views} views`
  }

  const formatDuration = (duration) => {
    if (!duration) return ''
    const seconds = parseFloat(duration)
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="video-page">
        <div className="container">
          <div className="video-loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="video-page">
        <div className="container">
          <div className="error" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <h2 style={{ marginBottom: 16 }}>😕 {error || 'Video not found'}</h2>
            <Link to="/">
              <button className="primary">Go Back Home</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="video-page">
      <div className="container">
        <div className="video-layout">
          <div className="video-main">
            {/* Video Player */}
            <div className="video-player-wrapper">
              <video
                controls
                src={video.videoFile}
                poster={video.thumbnail}
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="video-info-card">
              <h1 className="video-title">{video.title}</h1>

              <div className="video-stats-row">
                <div className="video-stats">
                  <span>👁️ {formatViews(video.views)}</span>
                  {video.duration && <span>⏱️ {formatDuration(video.duration)}</span>}
                </div>
                <div className="video-actions">
                  <button>
                    👍 Like
                  </button>
                  <button>
                    📤 Share
                  </button>
                  <button>
                    💾 Save
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="channel-row">
                {video.owner?.avatar ? (
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="channel-avatar"
                  />
                ) : (
                  <div className="channel-avatar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    👤
                  </div>
                )}
                <div className="channel-info">
                  <Link
                    to={`/channel/${video.owner?.username}`}
                    className="channel-name"
                  >
                    {video.owner?.fullName || video.owner?.username || 'Unknown'}
                  </Link>
                  <div className="channel-subs">@{video.owner?.username}</div>
                </div>
                <button className="subscribe-btn">
                  Subscribe
                </button>
              </div>

              {/* Description */}
              {video.description && (
                <div className={`video-description ${showFullDescription ? '' : 'collapsed'}`}>
                  <p className="video-description-text">{video.description}</p>
                  {video.description.length > 200 && (
                    <button
                      className="show-more-btn"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - placeholder for related videos */}
          <div className="video-sidebar">
            <div className="sidebar-header">Related Videos</div>
            <div style={{
              textAlign: 'center',
              padding: '40px 16px',
              color: 'var(--text-muted)'
            }}>
              <p>Related videos coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoView

