import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './config';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import callRoutes from './routes/call.routes';
import customerRoutes from './routes/customer.routes';
import agentRoutes from './routes/agent.routes';
import recordingRoutes from './routes/recording.routes';
import queueRoutes from './routes/queue.routes';
import { setupSocketHandlers } from './services/socket.service';
import logger from './config/logger';

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);

// ─── Socket.IO ──────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: config.cors,
  transports: ['websocket', 'polling'],
});

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(config.cors));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/queues', queueRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Socket.IO Handlers ─────────────────────────────────────
setupSocketHandlers(io);

// ─── Start Server ───────────────────────────────────────────
async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    httpServer.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

export { app, io, prisma };
