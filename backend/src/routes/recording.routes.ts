import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.middleware';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// ─── Get All Recordings ─────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', agentId, callLogId } = req.query;

    const where: any = {};
    if (agentId) where.agentId = agentId as string;
    if (callLogId) where.callLogId = callLogId as string;

    // Agents can only see their own recordings
    if (req.user!.role === 'AGENT') {
      where.agentId = req.user!.id;
    }

    const [recordings, total] = await Promise.all([
      prisma.recording.findMany({
        where,
        include: {
          callLog: {
            select: {
              id: true,
              fromNumber: true,
              toNumber: true,
              startTime: true,
              duration: true,
              customer: { select: { firstName: true, lastName: true } },
            },
          },
          agent: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.recording.count({ where }),
    ]);

    res.json({ recordings, total });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Stream Recording ───────────────────────────────────────
router.get('/:id/stream', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recording = await prisma.recording.findUnique({
      where: { id: req.params.id },
    });

    if (!recording) {
      res.status(404).json({ error: 'Recording not found' });
      return;
    }

    const filePath = path.resolve(recording.filePath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Recording file not found' });
      return;
    }

    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/wav',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'audio/wav',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Delete Recording ───────────────────────────────────────
router.delete('/:id', authorize('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recording = await prisma.recording.findUnique({
      where: { id: req.params.id },
    });

    if (!recording) {
      res.status(404).json({ error: 'Recording not found' });
      return;
    }

    // Delete file
    const filePath = path.resolve(recording.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.recording.delete({ where: { id: req.params.id } });
    res.json({ message: 'Recording deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
