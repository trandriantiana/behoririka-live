import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')
  const [messages, setMessages] = useState([])
  const [gifts, setGifts] = useState([])
  const [viewers, setViewers] = useState(0)
  const [topViewers, setTopViewers] = useState([])
  const wsRef = useRef(null)

  const connectToLive = async () => {
    if (!username.trim()) {
      alert('Veuillez entrer un nom d\'utilisateur TikTok')
      return
    }

    try {
      setConnectionStatus('Connecting...')
      
      // Create WebSocket connection to our server
      const ws = new WebSocket('ws://localhost:8081')
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected to server')
        // Send connect request
        ws.send(JSON.stringify({
          type: 'connect',
          username: username.trim()
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'connected':
              console.log('Connected to TikTok live:', data.data.roomId)
              setIsConnected(true)
              setConnectionStatus(`Connected to ${username}'s live`)
              setViewers(data.data.viewerCount || 0)
              break
              
            case 'disconnected':
              console.log('Disconnected from TikTok live')
              setIsConnected(false)
              setConnectionStatus('Disconnected')
              break
              
            case 'error':
              console.error('TikTok connection error:', data.error)
              setConnectionStatus(`Error: ${data.error}`)
              setIsConnected(false)
              break
              
            case 'chat':
              const newMessage = {
                id: Date.now() + Math.random(),
                user: data.data.user,
                message: data.data.message,
                timestamp: new Date(data.data.timestamp).toLocaleTimeString()
              }
              setMessages(prev => [newMessage, ...prev.slice(0, 49)])
              break
              
            case 'gift':
              const newGift = {
                id: Date.now() + Math.random(),
                user: data.data.user,
                giftName: data.data.giftName,
                count: data.data.count,
                timestamp: new Date(data.data.timestamp).toLocaleTimeString()
              }
              setGifts(prev => [newGift, ...prev.slice(0, 19)])
              break
              
            case 'like':
              console.log(`${data.data.user} liked the stream!`)
              break
              
            case 'member':
              console.log(`${data.data.user} joined the live!`)
              break
              
            case 'roomUser':
              console.log('Room stats updated:', data.data.viewerCount, 'viewers')
              setViewers(data.data.viewerCount)
              setTopViewers(data.data.topViewers || [])
              break
              
            default:
              console.log('Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('WebSocket connection error')
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log('WebSocket connection closed')
        setIsConnected(false)
        setConnectionStatus('Disconnected')
      }
      
    } catch (error) {
      console.error('Failed to connect:', error)
      setConnectionStatus(`Failed to connect: ${error.message}`)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'disconnect' }))
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setConnectionStatus('Disconnected')
    setMessages([])
    setGifts([])
    setViewers(0)
    setTopViewers([])
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎥 TikTok Live Connector</h1>
        <p>Connectez-vous à un live TikTok pour voir les messages et cadeaux en temps réel</p>
      </header>

      <div className="connection-panel">
        <div className="input-group">
          <input
            type="text"
            placeholder="Nom d'utilisateur TikTok (ex: officialgeilegisela)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConnected}
            onKeyPress={(e) => e.key === 'Enter' && !isConnected && connectToLive()}
          />
          <button 
            onClick={isConnected ? disconnect : connectToLive}
            className={isConnected ? 'disconnect-btn' : 'connect-btn'}
          >
            {isConnected ? 'Déconnecter' : 'Se connecter'}
          </button>
        </div>
        <div className="status">
          Status: <span className={isConnected ? 'connected' : 'disconnected'}>
            {connectionStatus}
          </span>
          {isConnected && viewers > 0 && (
            <span className="viewers"> • {viewers} viewers</span>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="live-data">
          <div className="messages-section">
            <h3>💬 Messages ({messages.length})</h3>
            <div className="messages-list">
              {messages.length === 0 ? (
                <p className="no-data">Aucun message pour le moment...</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="message-item">
                    <span className="timestamp">{msg.timestamp}</span>
                    <span className="username">@{msg.user}:</span>
                    <span className="message">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="gifts-section">
            <h3>🎁 Cadeaux ({gifts.length})</h3>
            <div className="gifts-list">
              {gifts.length === 0 ? (
                <p className="no-data">Aucun cadeau pour le moment...</p>
              ) : (
                gifts.map(gift => (
                  <div key={gift.id} className="gift-item">
                    <span className="timestamp">{gift.timestamp}</span>
                    <span className="username">@{gift.user}</span>
                    <span className="gift-name">{gift.giftName}</span>
                    {gift.count > 1 && <span className="gift-count">x{gift.count}</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="viewers-section">
            <h3>👥 Top Viewers ({topViewers.length})</h3>
            <div className="viewers-list">
              {topViewers.length === 0 ? (
                <p className="no-data">Aucun viewer pour le moment...</p>
              ) : (
                topViewers.map(viewer => (
                  <div key={viewer.userId} className="viewer-item">
                    <div className="viewer-avatar">
                      <img 
                        src={viewer.profilePictureUrl} 
                        alt={viewer.nickname}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcgMTYuMzMgNyAxOVYyMEg3VjIwSDE3VjIwVjE5QzE3IDE2LjMzIDE0LjY3IDEzLjk5IDEyIDE0WiIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4KPC9zdmc+'
                        }}
                      />
                    </div>
                    <div className="viewer-info">
                      <div className="viewer-name">
                        <span className="nickname">{viewer.nickname}</span>
                        <span className="unique-id">@{viewer.uniqueId}</span>
                      </div>
                      <div className="viewer-stats">
                        {viewer.followerCount > 0 && (
                          <span className="followers">{viewer.followerCount} followers</span>
                        )}
                        {viewer.coinCount > 0 && (
                          <span className="coins">{viewer.coinCount} coins</span>
                        )}
                        {viewer.isModerator && (
                          <span className="badge moderator">MOD</span>
                        )}
                        {viewer.isSubscriber && (
                          <span className="badge subscriber">SUB</span>
                        )}
                        {viewer.followRole === 1 && (
                          <span className="badge follower">FOLLOWER</span>
                        )}
                        {viewer.followRole === 2 && (
                          <span className="badge friend">FRIEND</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
