# Cloud Call Center Platform - System Architecture

## Overview
Web-based cloud call center platform for retail store management.
Manages calls, customers, and agents entirely through the browser.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Agent Dashboard│  │Admin Dashboard│  │   SIP.js (WebRTC)    │  │
│  │   (React)     │  │   (React)     │  │   Audio Engine        │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                  │                      │              │
│         └──────────────────┼──────────────────────┘              │
│                            │ HTTPS / WSS                        │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                     API GATEWAY (Nginx)                         │
│              SSL Termination + Reverse Proxy                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Auth API │  │ Call API  │  │ CRM API  │  │ WebSocket     │   │
│  │ (JWT)    │  │ (REST)   │  │ (REST)   │  │ (Real-time)   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬───────┘   │
│       │              │              │                │           │
│  ┌────┴──────────────┴──────────────┴────────────────┴───────┐   │
│  │              SERVICE LAYER                                │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐     │   │
│  │  │ CallService│ │ CRMService │ │ NotificationService│     │   │
│  │  └──────┬─────┘ └──────┬─────┘ └──────────┬─────────┘     │   │
│  └─────────┼──────────────┼──────────────────┼───────────────┘   │
│            │              │                  │                   │
│  ┌─────────┼──────────────┼──────────────────┼───────────────┐   │
│  │         │    DATABASE LAYER               │               │   │
│  │  ┌──────┴─────┐  ┌─────┴──────┐  ┌───────┴──────────┐    │   │
│  │  │ PostgreSQL │  │   Redis    │  │  File Storage    │    │   │
│  │  │ (Primary)  │  │  (Cache)   │  │ (Recordings)     │    │   │
│  │  └────────────┘  └────────────┘  └──────────────────┘    │   │
│  └───────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│              VoIP GATEWAY (Asterisk/FreePBX)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  SIP Server  │  │  Media Stack │  │   ARI (REST API)     │   │
│  │  (PJSIP)     │  │  (RTP/RTCP) │  │   for Node.js        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FreePBX Web GUI (Admin Panel - :8088)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | React 18 + TypeScript + Vite        |
| UI Library     | Tailwind CSS + Heroicons            |
| State Mgmt     | React Context + Zustand             |
| WebRTC/SIP     | SIP.js 0.20+ (WebRTC native)       |
| Backend        | Node.js 20 + Express + TypeScript   |
| Database       | PostgreSQL 16 + Prisma ORM          |
| Cache          | Redis 7 (queues, sessions)          |
| Auth           | JWT + bcrypt                        |
| Real-time      | Socket.IO (WebSocket)               |
| VoIP Server    | Asterisk 20 + FreePBX 16           |
| SIP Transport  | WSS (WebSocket Secure) via nginx    |
| Reverse Proxy  | Nginx (SSL termination)             |
| Container      | Docker + Docker Compose             |
| Recording      | Asterisk native + ffmpeg            |
| OS             | Ubuntu 22.04 LTS                    |

## SIP/WebRTC Flow

```
Browser (SIP.js)                    Asterisk/FreePBX
     │                                    │
     │──── SIP REGISTER (WSS) ──────────>│
     │<─── 200 OK ───────────────────────│
     │                                    │
     │──── INVITE (SDP) ────────────────>│
     │<─── 100 Trying ───────────────────│
     │<─── 180 Ringing ──────────────────│
     │<─── 200 OK (SDP) ────────────────│
     │──── ACK ─────────────────────────>│
     │                                    │
     │<═══════ RTP Media Stream ═════════>│
     │                                    │
     │──── BYE ─────────────────────────>│
     │<─── 200 OK ───────────────────────│
```

## Security Layers

1. HTTPS everywhere (Let's Encrypt / self-signed for dev)
2. WSS for SIP signaling (no plain WS in production)
3. JWT tokens for API authentication
4. CORS restricted to known origins
5. Rate limiting on API endpoints
6. Input validation (Zod schemas)
7. Encrypted database connections
8. Recordings stored with restricted access
