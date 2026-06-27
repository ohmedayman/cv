import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

const prisma = new PrismaClient();

interface AsteriskEvent {
  type: string;
  channel: string;
  channel_state: string;
  caller_id_num: string;
  caller_id_name: string;
  connected_line_num: string;
  connected_line_name: string;
  dialplan_app: string;
  dialplan_app_data: string;
  unique_id: string;
  linked_id: string;
  timestamp: string;
}

export class AsteriskService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  async connect(): Promise<void> {
    logger.info('Asterisk ARI service initialized');
  }

  async handleIncomingCall(event: AsteriskEvent): Promise<void> {
    const fromNumber = event.caller_id_num;
    const toNumber = event.connected_line_num;

    let customer = await prisma.customer.findUnique({
      where: { phoneNumber: fromNumber },
      include: { orders: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { phoneNumber: fromNumber },
        include: { orders: { orderBy: { createdAt: 'desc' }, take: 5 } },
      });
    }

    const callLog = await prisma.callLog.create({
      data: {
        callId: event.unique_id,
        customerId: customer.id,
        direction: 'INBOUND',
        fromNumber,
        toNumber,
        startTime: new Date(event.timestamp),
        status: 'RINGING',
      },
    });

    this.io.to('agents').emit('incoming_call', {
      callId: callLog.id,
      customer: {
        id: customer.id,
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown',
        phone: customer.phoneNumber,
        email: customer.email,
        address: customer.address,
        orders: customer.orders,
      },
      from: fromNumber,
      timestamp: event.timestamp,
    });

    logger.info(`Incoming call from ${fromNumber} to ${toNumber}`);
  }

  async handleCallAnswered(event: AsteriskEvent, agentId: string): Promise<void> {
    await prisma.callLog.updateMany({
      where: { callId: event.unique_id },
      data: {
        agentId,
        status: 'IN_PROGRESS',
      },
    });

    await prisma.user.update({
      where: { id: agentId },
      data: { status: 'BUSY' },
    });

    this.io.to('agents').emit('call_answered', {
      callId: event.unique_id,
      agentId,
    });
  }

  async handleCallEnded(event: AsteriskEvent): Promise<void> {
    const calls = await prisma.callLog.findMany({
      where: { callId: event.unique_id },
    });

    await prisma.callLog.updateMany({
      where: { callId: event.unique_id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
        duration: this.calculateDuration(event.timestamp),
        hangupCause: event.channel_state,
      },
    });

    if (calls.length > 0 && calls[0].agentId) {
      await prisma.user.update({
        where: { id: calls[0].agentId },
        data: { status: 'AVAILABLE' },
      });
    }

    this.io.to('agents').emit('call_ended', {
      callId: event.unique_id,
    });
  }

  async originateCall(extension: string, destination: string, agentId: string): Promise<void> {
    logger.info(`Originate call from ext ${extension} to ${destination}`);
  }

  private calculateDuration(startTime: string): number {
    const start = new Date(startTime);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / 1000);
  }
}
