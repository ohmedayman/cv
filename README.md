# Cloud Call Center Platform

> Web-based cloud call center platform for retail store management.

## Quick Start (Windows - No Docker Required)

### One-Click Start
Double-click `start.bat` to launch both servers automatically.

### Manual Start

**Terminal 1 - Backend:**
```powershell
cd "E:\call center\cloud-callcenter\backend"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "E:\call center\cloud-callcenter\frontend"
npm run dev
```

### Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

### Login Credentials
| Role       | Email                      | Password    |
|------------|----------------------------|-------------|
| Admin      | admin@callcenter.com       | password123 |
| Agent 1    | agent1@callcenter.com      | password123 |
| Agent 2    | agent2@callcenter.com      | password123 |
| Supervisor | supervisor@callcenter.com  | password123 |

## Tech Stack

| Component     | Technology                    |
|---------------|-------------------------------|
| Frontend      | React 18 + TypeScript + Vite  |
| UI            | Tailwind CSS + Lucide Icons   |
| WebRTC        | SIP.js 0.20+                  |
| Backend       | Node.js 20 + Express          |
| ORM           | Prisma                        |
| Database      | SQLite (no server needed)     |
| Real-time     | Socket.IO                     |
| VoIP Server   | Asterisk/FreePBX (optional)   |

## Features

### Agent Dashboard
- WebRTC softphone (calls from browser)
- Incoming call pop-up with customer info
- Dial pad for outgoing calls
- Agent status control
- Live call queue view

### Admin Dashboard
- Real-time agent monitoring
- Call statistics and analytics
- Call history and recordings
- Customer CRM

## Project Structure

```
cloud-callcenter/
├── backend/                 # Node.js API (SQLite)
│   ├── prisma/schema.prisma
│   ├── prisma/dev.db       # SQLite database (auto-created)
│   └── src/
├── frontend/                # React SPA
│   └── src/
├── start.bat               # Double-click to start!
└── README.md
```

## API Endpoints

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| POST   | /api/auth/login          | Login                 |
| GET    | /api/auth/profile        | Get profile           |
| GET    | /api/calls               | Call history          |
| GET    | /api/calls/live          | Live calls            |
| GET    | /api/customers           | Customer list         |
| GET    | /api/agents              | Agent list            |
| GET    | /api/recordings          | Recording list        |

## Notes

- **No Docker required** - uses SQLite database
- **No external services** needed for basic operation
- WebRTC/SIP requires Asterisk/FreePBX for actual phone calls
- Without Asterisk, the UI works but calls won't connect
