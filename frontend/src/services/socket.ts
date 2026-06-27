import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    this.socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // ─── Emit Events ──────────────────────────────────────────
  updateStatus(status: string): void {
    this.socket?.emit('update_status', { status });
  }

  joinQueue(queueId: string): void {
    this.socket?.emit('join_queue', { queueId });
  }

  leaveQueue(queueId: string): void {
    this.socket?.emit('leave_queue', { queueId });
  }

  monitorCall(callId: string): void {
    this.socket?.emit('monitor_call', { callId });
  }

  broadcastMessage(message: string): void {
    this.socket?.emit('broadcast_message', { message });
  }

  // ─── Listen Events ────────────────────────────────────────
  onIncomingCall(callback: (data: any) => void): void {
    this.socket?.on('incoming_call', callback);
  }

  onCallAnswered(callback: (data: any) => void): void {
    this.socket?.on('call_answered', callback);
  }

  onCallEnded(callback: (data: any) => void): void {
    this.socket?.on('call_ended', callback);
  }

  onAgentStatusChanged(callback: (data: any) => void): void {
    this.socket?.on('agent_status_changed', callback);
  }

  onAdminMessage(callback: (data: any) => void): void {
    this.socket?.on('admin_message', callback);
  }

  offAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();
