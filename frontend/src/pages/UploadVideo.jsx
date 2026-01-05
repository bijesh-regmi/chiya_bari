import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './UploadVideo.css'

function UploadVideo() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
    return (bytes / 1024).toFixed(2) + ' KB'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!videoFile || !thumbnail) {
      setError('Please select both video and thumbnail files')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('videoFile', videoFile)
      formData.append('thumbnail', thumbnail)

      const response = await api.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        navigate(`/video/${response.data.data._id}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="container upload-container">
        <div className="upload-header">
          <h1>Upload Video</h1>
          <p>Share your content with the world</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          {/* Files Section */}
          <div className="upload-section">
            <h3>Video Files</h3>
            <div className="file-uploads-grid">
              <div className="video-upload-area">
                <label>Video File *</label>
                <div className={`file-upload ${videoFile ? 'has-file' : ''}`}>
                  <div className="file-upload-icon">🎥</div>
                  <div className="file-upload-text">
                    {videoFile ? 'Click to change video' : 'Click or drag to upload video'}
                  </div>
                  <div className="file-upload-hint">MP4, WebM, MOV up to 500MB</div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                </div>
                {videoFile && (
                  <div className="file-upload-status">
                    <span className="file-icon">📹</span>
                    <div className="file-details">
                      <div className="file-name">{videoFile.name}</div>
                      <div className="file-size">{formatFileSize(videoFile.size)}</div>
                    </div>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {videoPreview && (
                  <div className="video-preview">
                    <video src={videoPreview} controls />
                  </div>
                )}
              </div>

              <div className="thumbnail-upload-area">
                <label>Thumbnail *</label>
                <div className={`file-upload ${thumbnail ? 'has-file' : ''}`}>
                  <div className="file-upload-icon">🖼️</div>
                  <div className="file-upload-text">
                    {thumbnail ? 'Click to change' : 'Upload thumbnail'}
                  </div>
                  <div className="file-upload-hint">JPG, PNG (16:9 ratio)</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </div>
                {thumbnailPreview && (
                  <div className="thumbnail-preview">
                    <img src={thumbnailPreview} alt="Thumbnail preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="upload-section">
            <h3>Video Details</h3>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                placeholder="Enter a descriptive title for your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <div className="char-count">{title.length}/100</div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Tell viewers about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                maxLength={5000}
              />
              <div className="char-count">{description.length}/5000</div>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="upload-actions">
            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={loading || !videoFile || !thumbnail || !title.trim()}
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="upload-progress">
            <div className="upload-progress-card">
              <div className="spinner"></div>
              <h3>Uploading your video...</h3>
              <p>This may take a few minutes depending on file size</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadVideo

