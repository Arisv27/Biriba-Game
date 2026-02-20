const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static('.'));

// Game room management
class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.seats = {
      1: null, // null = available, socketId = occupied
      2: null,
      3: null,
      4: null
    };
    this.playerNames = {
      1: null, // null = default name, string = custom name
      2: null,
      3: null,
      4: null
    };
    this.host = null; // First player to join becomes host
    this.spectators = new Set(); // socketIds of spectators
  }

  // Request a seat
  requestSeat(socketId, seatNumber, playerName = null) {
    console.log(`Socket ${socketId} requesting seat ${seatNumber} with name: ${playerName || 'default'}`);
    
    // Validate seat number
    if (![1, 2, 3, 4].includes(seatNumber)) {
      return { success: false, error: 'Invalid seat number' };
    }

    // Check if seat is available
    if (this.seats[seatNumber] !== null) {
      return { success: false, error: 'Seat is already taken' };
    }

    // Check if player already has a seat
    const currentSeat = this.getPlayerSeat(socketId);
    if (currentSeat !== null) {
      // Leave current seat first
      this.leaveSeat(socketId);
    }

    // Assign seat
    this.seats[seatNumber] = socketId;
    
    // Store player name (use default if not provided)
    this.playerNames[seatNumber] = playerName || `Player ${seatNumber}`;
    
    // Set host if this is the first player
    if (this.host === null) {
      this.host = socketId;
      console.log(`Socket ${socketId} is now the host`);
    }

    console.log(`Seat ${seatNumber} assigned to ${socketId} with name: ${this.playerNames[seatNumber]}`);
    return { success: true, seat: seatNumber, isHost: this.host === socketId, playerName: this.playerNames[seatNumber] };
  }

  // Leave seat
  leaveSeat(socketId) {
    console.log(`Socket ${socketId} leaving seat`);
    
    const seatNumber = this.getPlayerSeat(socketId);
    if (seatNumber !== null) {
      this.seats[seatNumber] = null;
      this.playerNames[seatNumber] = null; // Clear player name
      console.log(`Seat ${seatNumber} is now available`);
      
      // If host left, assign new host
      if (this.host === socketId) {
        this.host = this.findNewHost();
        console.log(`New host: ${this.host}`);
      }
      
      return { success: true, seat: seatNumber };
    }
    
    return { success: false, error: 'Player not in any seat' };
  }

  // Get player's current seat number
  getPlayerSeat(socketId) {
    for (let seat = 1; seat <= 4; seat++) {
      if (this.seats[seat] === socketId) {
        return seat;
      }
    }
    return null;
  }

  // Find new host from remaining players
  findNewHost() {
    for (let seat = 1; seat <= 4; seat++) {
      if (this.seats[seat] !== null) {
        return this.seats[seat];
      }
    }
    return null;
  }

  // Get seat status for broadcasting
  getSeatStatus() {
    const seatStatus = {};
    for (let seat = 1; seat <= 4; seat++) {
      seatStatus[seat] = {
        occupied: this.seats[seat] !== null,
        isHost: this.seats[seat] === this.host,
        playerName: this.playerNames[seat] || `Player ${seat}`
      };
    }
    return seatStatus;
  }

  getSpectatorCount() {
    return this.spectators.size;
  }

  // Check if room is empty
  isEmpty() {
    return Object.values(this.seats).every(seat => seat === null);
  }
}

// Global room management
const rooms = new Map();
const DEFAULT_ROOM = 'game-room'; // For now, everyone joins the same room

// Get or create room
function getRoom(roomId = DEFAULT_ROOM) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new GameRoom(roomId));
    console.log(`Created new room: ${roomId}`);
  }
  return rooms.get(roomId);
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Join default room
  const room = getRoom();
  socket.join(DEFAULT_ROOM);
  
  // Send current seat status to new client
  socket.emit('seatUpdate', { seats: room.getSeatStatus(), spectators: room.getSpectatorCount() });

  // Handle seat requests
  socket.on('requestSeat', (data) => {
    console.log(`Received requestSeat from ${socket.id}:`, data);
    
    const { seat, playerName } = data;
    const result = room.requestSeat(socket.id, seat, playerName);
    
    if (result.success) {
      // Grant seat
      socket.emit('seatGranted', { 
        seat: result.seat, 
        isHost: result.isHost,
        playerName: result.playerName
      });
      
      // Broadcast seat update to all clients in room
      io.to(DEFAULT_ROOM).emit('seatUpdate', { 
        seats: room.getSeatStatus(),
        spectators: room.getSpectatorCount()
      });
    } else {
      // Deny seat
      socket.emit('seatDenied', { 
        error: result.error 
      });
    }
  });

  // Handle leave seat
  socket.on('leaveSeat', () => {
    console.log(`Received leaveSeat from ${socket.id}`);
    
    const result = room.leaveSeat(socket.id);
    
    if (result.success) {
      // Broadcast seat update to all clients in room
      io.to(DEFAULT_ROOM).emit('seatUpdate', { 
        seats: room.getSeatStatus(),
        spectators: room.getSpectatorCount()
      });
    }
  });

  // Spectator join/leave
  socket.on('spectateJoin', () => {
    room.spectators.add(socket.id);
    io.to(DEFAULT_ROOM).emit('spectatorsUpdate', { spectators: room.getSpectatorCount() });
    // Send initial seat status as well
    socket.emit('seatUpdate', { seats: room.getSeatStatus(), spectators: room.getSpectatorCount() });
  });

  socket.on('spectateLeave', () => {
    room.spectators.delete(socket.id);
    io.to(DEFAULT_ROOM).emit('spectatorsUpdate', { spectators: room.getSpectatorCount() });
  });

  // Handle host-controlled game start
  socket.on('startGame', (data) => {
    console.log(`Received startGame from ${socket.id}:`, data);
    
    // Verify that the requesting socket is the host
    if (room.host !== socket.id) {
      socket.emit('startGameDenied', { 
        error: 'Only the host can start the game' 
      });
      return;
    }
    
    // Validate that fullState is provided
    if (!data || !data.fullState) {
      socket.emit('startGameDenied', { 
        error: 'Invalid game state provided' 
      });
      return;
    }
    
    console.log('Host is starting game with fullState:', data.fullState);
    
    // Broadcast the fullState to all clients in the room
    io.to(DEFAULT_ROOM).emit('gameStarted', { 
      fullState: data.fullState 
    });
    
    console.log('Game started and fullState broadcasted to all clients');
  });

  // Handle game actions (Phase 6: Enhanced Actions with Meld Support)
  socket.on('action', (data) => {
    console.log(`Received action from ${socket.id}:`, data);
    
    // Validate action data
    if (!data || !data.type) {
      console.log('Invalid action - missing type');
      return;
    }
    
    // Get player's seat number
    const playerSeat = room.getPlayerSeat(socket.id);
    if (playerSeat === null) {
      console.log('Action rejected - player not in any seat');
      return;
    }
    
    console.log(`Player ${playerSeat} performing action: ${data.type}`);
    
    // Create the remote action payload with all necessary data
    const remoteActionPayload = {
      type: data.type,
      playerSeat: playerSeat
    };
    
    // Add action-specific data based on type
    switch (data.type) {
      case 'meldCreate':
        remoteActionPayload.kind = data.kind;
        remoteActionPayload.cards = data.cards;
        console.log(`Meld creation: ${data.kind} with cards:`, data.cards);
        break;
      case 'meldExtend':
        remoteActionPayload.meldId = data.meldId;
        remoteActionPayload.cards = data.cards;
        console.log(`Meld extension: meld ${data.meldId} with cards:`, data.cards);
        break;
      case 'discard':
        remoteActionPayload.cardId = data.cardId;
        console.log(`Discard: ${data.cardId}`);
        break;
      case 'biribakiGiven':
        remoteActionPayload.team = data.team;
        console.log(`Biribaki given to team: ${data.team}`);
        break;
      case 'devSevenCardRun':
        remoteActionPayload.newHand = data.newHand;
        console.log(`Dev seven card run with new hand:`, data.newHand);
        break;
      case 'biribakiPreview':
        remoteActionPayload.playerId = data.playerId;
        remoteActionPayload.team = data.team;
        console.log(`Biribaki preview for player ${data.playerId}, team ${data.team}`);
        break;
      case 'devToolsOpened':
        remoteActionPayload.playerId = data.playerId;
        console.log(`Dev tools opened by player ${data.playerId}`);
        break;
      case 'skipTurn':
        remoteActionPayload.playerId = data.playerId;
        console.log(`Skip turn by player ${data.playerId}`);
        break;
      default:
        // For other actions like drawStock, pickDiscard, gameEnd
        console.log(`Standard action: ${data.type}`);
        break;
    }
    
    // Broadcast the action to all other players in the room
    socket.to(DEFAULT_ROOM).emit('remoteAction', remoteActionPayload);
    
    console.log(`Action ${data.type} broadcasted to other players with payload:`, remoteActionPayload);
  });

  // Host periodically broadcasts checksum; server relays to room
  socket.on('stateChecksum', (data) => {
    // data: { checksum: string, ts?: number }
    io.to(DEFAULT_ROOM).emit('stateChecksum', {
      checksum: data && data.checksum,
      ts: (data && data.ts) || Date.now()
    });
  });

  // Any client can request a fullState; server forwards request to host
  socket.on('requestFullState', () => {
    if (!room.host) return;
    io.to(room.host).emit('requestFullState', { requester: socket.id });
  });

  // Host sends a fullState update targeted to a requester
  socket.on('fullStateUpdate', (data) => {
    // data: { to: socketId, fullState, checksum?: string }
    if (!data || !data.fullState) return;
    if (data.to) {
      io.to(data.to).emit('fullStateUpdate', {
        fullState: data.fullState,
        checksum: data.checksum,
        fromHost: true
      });
    } else {
      // No target provided: broadcast to room
      io.to(DEFAULT_ROOM).emit('fullStateUpdate', {
        fullState: data.fullState,
        checksum: data.checksum,
        fromHost: true
      });
    }
  });

  // Chat handlers
  socket.on('chat', (data) => {
    console.log(`Chat message from Player ${data.playerId}: ${data.message}`);
    // Broadcast message to all other players
    socket.to(DEFAULT_ROOM).emit('chatMessage', data);
  });

  socket.on('typing', (data) => {
    console.log(`Typing indicator from Player ${data.playerId}: ${data.isTyping}`);
    // Broadcast typing indicator to all other players
    socket.to(DEFAULT_ROOM).emit('typing', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Remove from seat if they had one
    room.leaveSeat(socket.id);
    
    // Remove from spectators if present
    room.spectators.delete(socket.id);
    // Broadcast seat/spectator update
    io.to(DEFAULT_ROOM).emit('seatUpdate', { 
      seats: room.getSeatStatus(),
      spectators: room.getSpectatorCount()
    });
    
    // Clean up empty rooms
    if (room.isEmpty()) {
      rooms.delete(DEFAULT_ROOM);
      console.log(`Removed empty room: ${DEFAULT_ROOM}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎴 Biriba server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to test seat management`);
  try {
    const nets = os.networkInterfaces();
    const lanIPs = [];
    Object.keys(nets).forEach((name) => {
      nets[name].forEach((net) => {
        if (net && net.family === 'IPv4' && !net.internal) {
          lanIPs.push(net.address);
        }
      });
    });
    if (lanIPs.length) {
      console.log('LAN links (same Wi‑Fi):');
      lanIPs.forEach(ip => console.log(`  → http://${ip}:${PORT}`));
    } else {
      console.log('No LAN IPv4 detected. Ensure your network interface is active.');
    }
  } catch (e) {
    console.log('Failed to enumerate LAN interfaces:', e.message);
  }
});
