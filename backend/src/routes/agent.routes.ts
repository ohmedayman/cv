import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// ─── Get All Agents ─────────────────────────────────────────
router.get('/', authorize('ADMIN', 'SUPERVISOR'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agents = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        sipExtension: true,
        status: true,
        avatarUrl: true,
        _count: {
          select: {
            callLogs: { where: { status: 'IN_PROGRESS' } },
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Get Agent Stats ────────────────────────────────────────
router.get('/:id/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agentId = req.params.id;

    // Agents can only see their own stats
    if (req.user!.role === 'AGENT' && req.user!.id !== agentId) {
      res.status(403).json({ error: 'Cannot view other agents stats' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayStats, weeklyStats, totalStats] = await Promise.all([
      prisma.agentStat.findUnique({
        where: { agentId_date: { agentId, date: today } },
      }),
      prisma.agentStat.findMany({
        where: {
          agentId,
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.callLog.aggregate({
        where: { agentId },
        _count: true,
        _avg: { duration: true },
      }),
    ]);

    res.json({ today: todayStats, weekly: weeklyStats, total: totalStats });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Update Agent Status ────────────────────────────────────
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const agentId = req.params.id;

    if (req.user!.role === 'AGENT' && req.user!.id !== agentId) {
      res.status(403).json({ error: 'Cannot change other agents status' });
      return;
    }

    const agent = await prisma.user.update({
      where: { id: agentId },
      data: { status: status as string },
      select: { id: true, status: true },
    });

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Dashboard Stats ────────────────────────────────────────
router.get('/dashboard/summary', authorize('ADMIN', 'SUPERVISOR'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAgents,
      availableAgents,
      busyAgents,
      totalCallsToday,
      activeCalls,
      queueCount,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'AGENT' } }),
      prisma.user.count({ where: { role: 'AGENT', status: 'AVAILABLE' } }),
      prisma.user.count({ where: { role: 'AGENT', status: 'BUSY' } }),
      prisma.callLog.count({ where: { startTime: { gte: today } } }),
      prisma.callLog.count({
        where: { status: { in: ['RINGING', 'QUEUED', 'IN_PROGRESS'] } },
      }),
      prisma.callLog.count({ where: { status: 'QUEUED' } }),
    ]);

    res.json({
      totalAgents,
      availableAgents,
      busyAgents,
      offlineAgents: totalAgents - availableAgents - busyAgents,
      totalCallsToday,
      activeCalls,
      queueCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
