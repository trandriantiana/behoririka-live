import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';
import WebSocket from 'ws';
import http from 'http';

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections
const connections = new Map();

console.log('🚀 TikTok Live Connector Server starting...');

wss.on('connection', (ws) => {
    console.log('📱 New client connected');
    
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'connect') {
                const { username } = data;
                console.log(`🔗 Connecting to ${username}'s live...`);
                
                // Disconnect existing connection if any
                if (connections.has(ws)) {
                    const existingConnection = connections.get(ws);
                    existingConnection.disconnect();
                    connections.delete(ws);
                }
                
                try {
                    // Create new TikTok connection
                    const tiktokConnection = new TikTokLiveConnection(username);
                    connections.set(ws, tiktokConnection);
                    
                    // Connection events
                    tiktokConnection.on('connected', (state) => {
                        console.log(`✅ Connected to ${username}'s room:`, state.roomId);
                        ws.send(JSON.stringify({
                            type: 'connected',
                            data: {
                                roomId: state.roomId,
                                username: username,
                                viewerCount: state.roomInfo?.stats?.viewerCount || 0
                            }
                        }));
                    });
                    
                    tiktokConnection.on('disconnected', () => {
                        console.log(`❌ Disconnected from ${username}'s live`);
                        ws.send(JSON.stringify({
                            type: 'disconnected'
                        }));
                        connections.delete(ws);
                    });
                    
                    tiktokConnection.on('error', (err) => {
                        console.error('❌ Connection error:', err.message);
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: err.message
                        }));
                    });
                    
                    // Chat messages
                    tiktokConnection.on(WebcastEvent.CHAT, (data) => {
                        ws.send(JSON.stringify({
                            type: 'chat',
                            data: {
                                user: data.user.uniqueId,
                                message: data.comment,
                                timestamp: new Date().toISOString()
                            }
                        }));
                    });
                    
                    // Gifts
                    tiktokConnection.on(WebcastEvent.GIFT, (data) => {
                        ws.send(JSON.stringify({
                            type: 'gift',
                            data: {
                                user: data.user.uniqueId,
                                giftName: data.giftName || `Gift ID: ${data.giftId}`,
                                giftId: data.giftId,
                                count: data.repeatCount || 1,
                                timestamp: new Date().toISOString()
                            }
                        }));
                    });
                    
                    // Likes
                    tiktokConnection.on(WebcastEvent.LIKE, (data) => {
                        ws.send(JSON.stringify({
                            type: 'like',
                            data: {
                                user: data.user.uniqueId,
                                count: data.likeCount || 1,
                                timestamp: new Date().toISOString()
                            }
                        }));
                    });
                    
                    // Member join
                    tiktokConnection.on(WebcastEvent.MEMBER, (data) => {
                        ws.send(JSON.stringify({
                            type: 'member',
                            data: {
                                user: data.user.uniqueId,
                                timestamp: new Date().toISOString()
                            }
                        }));
                    });
                    
                    // Room users (viewer list and stats)
                    tiktokConnection.on('roomUser', (data) => {
                        ws.send(JSON.stringify({
                            type: 'roomUser',
                            data: {
                                viewerCount: data.viewerCount,
                                topViewers: data.topViewers ? data.topViewers.map(viewer => ({
                                    userId: viewer.user.userId,
                                    uniqueId: viewer.user.uniqueId,
                                    nickname: viewer.user.nickname,
                                    profilePictureUrl: viewer.user.profilePictureUrl,
                                    followRole: viewer.user.followRole,
                                    coinCount: viewer.coinCount,
                                    isModerator: viewer.user.isModerator,
                                    isSubscriber: viewer.user.isSubscriber,
                                    followerCount: viewer.user.followInfo?.followerCount || 0
                                })) : [],
                                timestamp: new Date().toISOString()
                            }
                        }));
                    });
                    
                    // Connect to TikTok
                    await tiktokConnection.connect();
                    
                } catch (error) {
                    console.error('❌ Failed to connect:', error.message);
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: error.message
                    }));
                }
            }
            
            if (data.type === 'disconnect') {
                console.log('🔌 Client requested disconnect');
                if (connections.has(ws)) {
                    const connection = connections.get(ws);
                    connection.disconnect();
                    connections.delete(ws);
                }
            }
            
        } catch (error) {
            console.error('❌ Message parsing error:', error.message);
            ws.send(JSON.stringify({
                type: 'error',
                error: 'Invalid message format'
            }));
        }
    });
    
    ws.on('close', () => {
        console.log('📱 Client disconnected');
        if (connections.has(ws)) {
            const connection = connections.get(ws);
            connection.disconnect();
            connections.delete(ws);
        }
    });
    
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
        if (connections.has(ws)) {
            const connection = connections.get(ws);
            connection.disconnect();
            connections.delete(ws);
        }
    });
});

// Start server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
    console.log(`🌐 TikTok Live Connector Server running on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
    console.log('🎯 Ready to receive connections!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    
    // Disconnect all TikTok connections
    connections.forEach((connection) => {
        connection.disconnect();
    });
    
    // Close WebSocket server
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        process.exit(0);
    });
});
