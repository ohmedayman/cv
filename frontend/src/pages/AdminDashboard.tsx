import { useState, useEffect, useRef } from 'react';
import { Phone, Users, Clock, TrendingUp, Activity } from 'lucide-react';
import { agentsAPI, callsAPI, recordingsAPI } from '../services/api';

function getStatusColor(status: string) {
  switch (status) {
    case 'AVAILABLE': return 'bg-green-500';
    case 'BUSY': return 'bg-red-500';
    case 'ON_BREAK': return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [callStats, setCallStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, agentsRes, callStatsRes] = await Promise.all([
        agentsAPI.getDashboard(),
        agentsAPI.getAll(),
        callsAPI.getStats(),
      ]);
      setStats(statsRes.data);
      setAgents(agentsRes.data);
      setCallStats(callStatsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          {['overview', 'agents', 'calls', 'recordings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && <OverviewTab stats={stats} callStats={callStats} agents={agents} />}
        {activeTab === 'agents' && <AgentsTab agents={agents} />}
        {activeTab === 'calls' && <CallsTab />}
        {activeTab === 'recordings' && <RecordingsTab />}
      </main>
    </div>
  );
}

function OverviewTab({ stats, callStats, agents }: any) {
  if (!stats) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6" />} label="Available Agents" value={stats.availableAgents} color="green" />
        <StatCard icon={<Phone className="w-6 h-6" />} label="Active Calls" value={stats.activeCalls} color="blue" />
        <StatCard icon={<Clock className="w-6 h-6" />} label="In Queue" value={stats.queueCount} color="yellow" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Today's Calls" value={stats.totalCallsToday} color="purple" />
      </div>

      {callStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{callStats.totalCalls}</p>
              <p className="text-sm text-gray-500">Total Calls</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{callStats.answeredCalls}</p>
              <p className="text-sm text-gray-500">Answered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{callStats.missedCalls}</p>
              <p className="text-sm text-gray-500">Missed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{callStats.answerRate}%</p>
              <p className="text-sm text-gray-500">Answer Rate</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {agents.map((agent: any) => (
            <div key={agent.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
              <span className="text-sm">{agent.firstName} {agent.lastName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function AgentsTab({ agents }: { agents: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">All Agents</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extension</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Calls</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{agent.firstName} {agent.lastName}</td>
                <td className="px-4 py-3 text-gray-500">{agent.sipExtension}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className="capitalize">{(agent.status || 'offline').toLowerCase().replace('_', ' ')}</span>
                  </span>
                </td>
                <td className="px-4 py-3">{agent._count?.callLogs || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CallsTab() {
  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    callsAPI.getAll({ limit: 20 }).then((res) => setCalls(res.data.calls || [])).catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Call History</h3>
      </div>
      {calls.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No calls yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(call.startTime).toLocaleString()}</td>
                  <td className="px-4 py-3">{call.fromNumber}</td>
                  <td className="px-4 py-3">{call.toNumber}</td>
                  <td className="px-4 py-3">{call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : '-'}</td>
                  <td className="px-4 py-3">{call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      call.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      call.status === 'MISSED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{call.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RecordingsTab() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    recordingsAPI.getAll({ limit: 20 }).then((res) => setRecordings(res.data.recordings || [])).catch(console.error);
    audioRef.current = new Audio();
  }, []);

  const playRecording = (id: string) => {
    if (!audioRef.current) return;
    if (playing === id) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      audioRef.current.src = recordingsAPI.getStreamUrl(id);
      audioRef.current.play().catch(() => {});
      setPlaying(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Call Recordings</h3>
      </div>
      {recordings.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No recordings yet</p>
      ) : (
        <div className="divide-y">
          {recordings.map((rec) => (
            <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium">{rec.callLog?.fromNumber || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{new Date(rec.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => playRecording(rec.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  playing === rec.id ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                {playing === rec.id ? 'Stop' : 'Play'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
