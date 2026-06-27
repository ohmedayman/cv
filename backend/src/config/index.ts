import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: 'file:./dev.db',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expiresIn: 86400, // 24 hours in seconds
  },

  asterisk: {
    host: process.env.ASTERISK_HOST || '127.0.0.1',
    port: parseInt(process.env.ASTERISK_PORT || '8088', 10),
    username: process.env.ASTERISK_USER || 'admin',
    password: process.env.ASTERISK_PASSWORD || 'admin',
    wsHost: process.env.ASTERISK_WS_HOST || 'wss://localhost:8089/ws',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  recordingPath: path.resolve(__dirname, '../../recordings'),

  sip: {
    domain: process.env.SIP_DOMAIN || '192.168.1.100',
    wsServer: process.env.SIP_WS_SERVER || 'wss://192.168.1.100:8089/ws',
    stunServer: process.env.STUN_SERVER || 'stun:stun.l.google.com:19302',
  },
};
