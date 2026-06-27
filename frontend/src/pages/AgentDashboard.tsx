import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Clock, User } from 'lucide-react';
import { callsAPI, customersAPI } from '../services/api';

export default function AgentDashboard() {
  const [dialNumber, setDialNumber] = useState('');
  const [agentStatus, setAgentStatus] = useState('AVAILABLE');
  const [liveCalls, setLiveCalls] = useState<any[]>([]);
  const [currentCall, setCurrentCall] = useState<any>(null);

  useEffect(() => {
    fetchLiveCalls();
    const interval = setInterval(fetchLiveCalls, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveCalls = async () => {
    try {
      const res = await callsAPI.getLive();
      setLiveCalls(res.data);
    } catch (error) {
      // silently fail
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Agent Dashboard</h1>
          <div className="flex items-center gap-4">
            <select
              value={agentStatus}
              onChange={(e) => setAgentStatus(e.target.value)}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_BREAK">On Break</option>
              <option value="BUSY">Busy</option>
            </select>
            <div className={`w-3 h-3 rounded-full ${agentStatus === 'AVAILABLE' ? 'bg-green-500' : agentStatus === 'BUSY' ? 'bg-red-500' : 'bg-gray-400'}`} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Make a Call</h2>
          <div className="flex gap-3">
            <input
              type="tel"
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              placeholder="Enter phone number..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Live Calls
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{liveCalls.length}</span>
          </h2>
          {liveCalls.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active calls</p>
          ) : (
            <div className="space-y-3">
              {liveCalls.map((call) => (
                <div key={call.id} className="p-3 rounded-lg border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{call.fromNumber}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-200 text-green-800">{call.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
