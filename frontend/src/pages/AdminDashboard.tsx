import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { agentsAPI, callsAPI, customersAPI } from '../services/api';
import {
  LayoutDashboard, Users, Phone, Headphones, BarChart3,
  Settings, LogOut, Bell, Search, Menu, X,
  TrendingUp, TrendingDown, Clock, PhoneIncoming,
  PhoneOutgoing, PhoneMissed, ChevronDown, Activity
} from 'lucide-react';

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agents', label: 'Agents', icon: Headphones },
  { id: 'calls', label: 'Call History', icon: Phone },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [callStats, setCallStats] = useState<any>(null);
  const [calls, setCalls] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, agentsRes, callStatsRes, callsRes, custRes] = await Promise.allSettled([
        agentsAPI.getDashboard(),
        agentsAPI.getAll(),
        callsAPI.getStats(),
        callsAPI.getAll({ limit: 10 }),
        customersAPI.getAll({ limit: 10 }),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (agentsRes.status === 'fulfilled') setAgents(agentsRes.value.data);
      if (callStatsRes.status === 'fulfilled') setCallStats(callStatsRes.value.data);
      if (callsRes.status === 'fulfilled') setCalls(callsRes.value.data.calls || []);
      if (custRes.status === 'fulfilled') setCustomers(custRes.value.data.customers || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">CallCenter</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-200">
          <div className={`flex items-center gap-3 px-3 py-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={logout} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Sign out">
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900 capitalize">
              {sidebarItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab stats={stats} callStats={callStats} agents={agents} calls={calls} />}
          {activeTab === 'agents' && <AgentsTab agents={agents} />}
          {activeTab === 'calls' && <CallsTab calls={calls} />}
          {activeTab === 'customers' && <CustomersTab customers={customers} />}
          {activeTab === 'analytics' && <AnalyticsTab callStats={callStats} />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────
function OverviewTab({ stats, callStats, agents, calls }: any) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Agents"
          value={stats?.totalAgents || 0}
          change="+2 this month"
          trend="up"
          icon={Headphones}
          color="blue"
        />
        <StatsCard
          title="Available Now"
          value={stats?.availableAgents || 0}
          change="Ready to take calls"
          trend="up"
          icon={Phone}
          color="green"
        />
        <StatsCard
          title="Active Calls"
          value={stats?.activeCalls || 0}
          change="In progress"
          trend="neutral"
          icon={Activity}
          color="yellow"
        />
        <StatsCard
          title="In Queue"
          value={stats?.queueCount || 0}
          change="Waiting for agent"
          trend="neutral"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Calls"
          value={callStats?.totalCalls || 0}
          change={`${callStats?.answerRate || 0}% answer rate`}
          trend="up"
          icon={PhoneIncoming}
          color="indigo"
        />
        <StatsCard
          title="Answered"
          value={callStats?.answeredCalls || 0}
          change="Successfully handled"
          trend="up"
          icon={PhoneOutgoing}
          color="green"
        />
        <StatsCard
          title="Missed"
          value={callStats?.missedCalls || 0}
          change="Need follow up"
          trend="down"
          icon={PhoneMissed}
          color="red"
        />
        <StatsCard
          title="Avg Duration"
          value={`${Math.floor((callStats?.avgDuration || 0) / 60)}m`}
          change="Per call"
          trend="neutral"
          icon={Clock}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Activity */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Team Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              color="green"
              title="Campaign launched"
              desc="Marketing team published the new offer"
              time="4 min ago"
            />
            <ActivityItem
              color="blue"
              title="Calls batch processed"
              desc={`${callStats?.totalCalls || 0} calls logged today`}
              time="30 min ago"
            />
            <ActivityItem
              color="yellow"
              title="Queue rising"
              desc="Average wait time is 2 minutes"
              time="1 hour ago"
            />
          </div>
        </div>

        {/* Agents Status */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Agent Status</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Extension</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Calls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agents.slice(0, 5).map((agent: any) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{agent.firstName?.[0]}{agent.lastName?.[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{agent.firstName} {agent.lastName}</p>
                          <p className="text-xs text-gray-500">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{agent.sipExtension}</td>
                    <td className="py-3">
                      <StatusBadge status={agent.status} />
                    </td>
                    <td className="py-3 text-sm text-gray-600">{agent._count?.callLogs || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Recent Calls</h3>
        </div>
        {calls.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No calls yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">From</th>
                  <th className="pb-3">To</th>
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calls.slice(0, 5).map((call: any) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm text-gray-600">{new Date(call.startTime).toLocaleString()}</td>
                    <td className="py-3 text-sm font-medium text-gray-900">{call.fromNumber}</td>
                    <td className="py-3 text-sm text-gray-600">{call.toNumber}</td>
                    <td className="py-3 text-sm text-gray-600">{call.agent ? `${call.agent.firstName}` : '-'}</td>
                    <td className="py-3 text-sm text-gray-600">{call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '-'}</td>
                    <td className="py-3"><StatusBadge status={call.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Agents Tab ──────────────────────────────────────────────
function AgentsTab({ agents }: { agents: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">All Agents</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
              <th className="px-6 py-3">Agent</th>
              <th className="px-6 py-3">Extension</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Calls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{agent.firstName?.[0]}{agent.lastName?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{agent.firstName} {agent.lastName}</p>
                      <p className="text-xs text-gray-500">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{agent.sipExtension}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{agent.role}</td>
                <td className="px-6 py-4"><StatusBadge status={agent.status} /></td>
                <td className="px-6 py-4 text-sm text-gray-600">{agent._count?.callLogs || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Calls Tab ───────────────────────────────────────────────
function CallsTab({ calls }: { calls: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Call History</h3>
      </div>
      {calls.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No calls recorded yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Direction</th>
                <th className="px-6 py-3">From</th>
                <th className="px-6 py-3">To</th>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(call.startTime).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      call.direction === 'INBOUND' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {call.direction === 'INBOUND' ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                      {call.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{call.fromNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{call.toNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{call.customer ? `${call.customer.firstName || ''} ${call.customer.lastName || ''}`.trim() || 'Unknown' : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '-'}</td>
                  <td className="px-6 py-4"><StatusBadge status={call.status} /></td>
                  <td className="px-6 py-4">
                    {call.rating ? (
                      <span className="text-yellow-500">{'★'.repeat(call.rating)}</span>
                    ) : '-'}
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

// ─── Customers Tab ───────────────────────────────────────────
function CustomersTab({ customers }: { customers: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Customers</h3>
      </div>
      {customers.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No customers yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">{cust.firstName?.[0] || '?'}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{cust.firstName || ''} {cust.lastName || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cust.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cust.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cust.address || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(cust.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ───────────────────────────────────────────
function AnalyticsTab({ callStats }: { callStats: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <p className="text-4xl font-bold text-blue-600">{callStats?.totalCalls || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Total Calls Today</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <p className="text-4xl font-bold text-green-600">{callStats?.answerRate || 0}%</p>
            <p className="text-sm text-gray-600 mt-2">Answer Rate</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <p className="text-4xl font-bold text-purple-600">{Math.floor((callStats?.avgDuration || 0) / 60)}m</p>
            <p className="text-sm text-gray-600 mt-2">Avg Call Duration</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────
function SettingsTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-6">Settings</h3>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" defaultValue="My Call Center" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
          <input type="email" defaultValue="support@callcenter.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Queue Size</label>
          <input type="number" defaultValue="50" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────
function StatsCard({ title, value, change, trend, icon: Icon, color }: any) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    red: 'bg-red-50 text-red-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
            <span className={`text-xs ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-700',
    BUSY: 'bg-red-100 text-red-700',
    ON_BREAK: 'bg-yellow-100 text-yellow-700',
    OFFLINE: 'bg-gray-100 text-gray-500',
    COMPLETED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    MISSED: 'bg-red-100 text-red-700',
    QUEUED: 'bg-yellow-100 text-yellow-700',
    RINGING: 'bg-purple-100 text-purple-700',
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
  };
  const label: Record<string, string> = {
    AVAILABLE: 'Active',
    ON_BREAK: 'On Break',
    OFFLINE: 'Offline',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {label[status] || status?.replace('_', ' ')}
    </span>
  );
}

function ActivityItem({ color, title, desc, time }: { color: string; title: string; desc: string; time: string }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  return (
    <div className="flex gap-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${colorMap[color]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
