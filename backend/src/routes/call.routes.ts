import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// ─── Get All Call Logs ──────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', status, agentId, dateFrom, dateTo } = req.query;

    const where: any = {};
    if (status) where.status = status as string;
    if (agentId) where.agentId = agentId as string;
    if (dateFrom || dateTo) {
      where.startTime = {};
      if (dateFrom) where.startTime.gte = new Date(dateFrom as string);
      if (dateTo) where.startTime.lte = new Date(dateTo as string);
    }

    // Agents can only see their own calls
    if (req.user!.role === 'AGENT') {
      where.agentId = req.user!.id;
    }

    const [calls, total] = await Promise.all([
      prisma.callLog.findMany({
        where,
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } },
          agent: { select: { id: true, firstName: true, lastName: true } },
          recordings: { select: { id: true, filePath: true, duration: true } },
        },
        orderBy: { startTime: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.callLog.count({ where }),
    ]);

    res.json({ calls, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Get Live Calls ─────────────────────────────────────────
router.get('/live', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const liveCalls = await prisma.callLog.findMany({
      where: {
        status: { in: ['RINGING', 'QUEUED', 'IN_PROGRESS'] },
      },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } },
        agent: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    res.json(liveCalls);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Get Single Call ────────────────────────────────────────
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const call = await prisma.callLog.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        agent: { select: { id: true, firstName: true, lastName: true, email: true } },
        recordings: true,
      },
    });

    if (!call) {
      res.status(404).json({ error: 'Call not found' });
      return;
    }

    res.json(call);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Update Call Notes ──────────────────────────────────────
router.patch('/:id/notes', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notes } = req.body;
    const call = await prisma.callLog.update({
      where: { id: req.params.id },
      data: { notes },
    });

    res.json(call);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Rate Call ──────────────────────────────────────────────
router.patch('/:id/rate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be 1-5' });
      return;
    }

    const call = await prisma.callLog.update({
      where: { id: req.params.id },
      data: { rating },
    });

    res.json(call);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Call Statistics ────────────────────────────────────────
router.get('/stats/summary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCalls, answeredCalls, missedCalls, avgDuration] = await Promise.all([
      prisma.callLog.count({ where: { startTime: { gte: today } } }),
      prisma.callLog.count({ where: { startTime: { gte: today }, status: 'COMPLETED' } }),
      prisma.callLog.count({ where: { startTime: { gte: today }, status: 'MISSED' } }),
      prisma.callLog.aggregate({
        where: { startTime: { gte: today }, duration: { not: null } },
        _avg: { duration: true },
      }),
    ]);

    res.json({
      totalCalls,
      answeredCalls,
      missedCalls,
      answerRate: totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : '0',
      avgDuration: Math.round(avgDuration._avg.duration || 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
