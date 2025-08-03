import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active games and their rooms
const activeGames = new Map<string, Set<string>>();

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a game room
  socket.on('joinGame', (roomCode: string) => {
    socket.join(roomCode);
    
    if (!activeGames.has(roomCode)) {
      activeGames.set(roomCode, new Set());
    }
    activeGames.get(roomCode)?.add(socket.id);
    
    console.log(`User ${socket.id} joined game ${roomCode}`);
    
    // Notify other players in the room
    socket.to(roomCode).emit('playerJoined', { socketId: socket.id });
  });

  // Leave a game room
  socket.on('leaveGame', (roomCode: string) => {
    socket.leave(roomCode);
    activeGames.get(roomCode)?.delete(socket.id);
    
    if (activeGames.get(roomCode)?.size === 0) {
      activeGames.delete(roomCode);
    }
    
    console.log(`User ${socket.id} left game ${roomCode}`);
    
    // Notify other players in the room
    socket.to(roomCode).emit('playerLeft', { socketId: socket.id });
  });

  // Game state updates
  socket.on('updateGameState', (data: { roomCode: string; gameState: any }) => {
    socket.to(data.roomCode).emit('gameStateUpdated', data.gameState);
  });

  // Player actions
  socket.on('playerAction', (data: { roomCode: string; action: any }) => {
    socket.to(data.roomCode).emit('playerActionReceived', data.action);
  });

  // Night phase actions
  socket.on('nightAction', (data: { roomCode: string; playerId: string; action: any }) => {
    socket.to(data.roomCode).emit('nightActionReceived', {
      playerId: data.playerId,
      action: data.action
    });
  });

  // Voting actions
  socket.on('vote', (data: { roomCode: string; voterId: string; targetId: string }) => {
    socket.to(data.roomCode).emit('voteReceived', {
      voterId: data.voterId,
      targetId: data.targetId
    });
  });

  // Game phase changes
  socket.on('phaseChange', (data: { roomCode: string; phase: string }) => {
    socket.to(data.roomCode).emit('phaseChanged', { phase: data.phase });
  });

  // Player elimination
  socket.on('eliminatePlayer', (data: { roomCode: string; playerId: string }) => {
    socket.to(data.roomCode).emit('playerEliminated', { playerId: data.playerId });
  });

  // Role reveal
  socket.on('revealRole', (data: { roomCode: string; playerId: string; role: string }) => {
    socket.to(data.roomCode).emit('roleRevealed', {
      playerId: data.playerId,
      role: data.role
    });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from all active games
    for (const [roomCode, players] of activeGames.entries()) {
      if (players.has(socket.id)) {
        players.delete(socket.id);
        socket.to(roomCode).emit('playerLeft', { socketId: socket.id });
        
        if (players.size === 0) {
          activeGames.delete(roomCode);
        }
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeGames: activeGames.size });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
}); 