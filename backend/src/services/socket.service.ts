import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export function setupSocketHandlers(io: SocketIOServer): void {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token as string, config.jwt.secret) as any;
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);

      // Join role-based room
      const user = await prisma.user.findUnique({
        where: { id: socket.userId },
        select: { role: true },
      });

      if (user) {
        socket.userRole = user.role;
        socket.join('agents'); // All users can receive call events
        if (user.role === 'ADMIN' || user.role === 'SUPERVISOR') {
          socket.join('admins');
        }
      }
    }

    // ─── Agent Status Updates ────────────────────────────────
    socket.on('update_status', async (data: { status: string }) => {
      if (!socket.userId) return;

      await prisma.user.update({
        where: { id: socket.userId },
        data: { status: data.status },
      });

      io.to('admins').emit('agent_status_changed', {
        agentId: socket.userId,
        status: data.status,
      });
    });

    // ─── Join/Leave Queue ────────────────────────────────────
    socket.on('join_queue', (data: { queueId: string }) => {
      socket.join(`queue:${data.queueId}`);
    });

    socket.on('leave_queue', (data: { queueId: string }) => {
      socket.leave(`queue:${data.queueId}`);
    });

    // ─── Live Call Monitoring ────────────────────────────────
    socket.on('monitor_call', (data: { callId: string }) => {
      if (socket.userRole === 'ADMIN' || socket.userRole === 'SUPERVISOR') {
        socket.join(`call:${data.callId}`);
      }
    });

    // ─── Broadcast to all agents ────────────────────────────
    socket.on('broadcast_message', (data: { message: string }) => {
      if (socket.userRole === 'ADMIN') {
        io.to('agents').emit('admin_message', data);
      }
    });

    // ─── Disconnect ─────────────────────────────────────────
    socket.on('disconnect', async () => {
      if (socket.userId) {
        await prisma.user.update({
          where: { id: socket.userId },
          data: { status: 'OFFLINE' },
        });

        io.to('admins').emit('agent_status_changed', {
          agentId: socket.userId,
          status: 'OFFLINE',
        });
      }
    });
  });
}
