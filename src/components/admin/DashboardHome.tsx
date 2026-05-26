import { useEffect, useState } from 'react';
import { FileText, Users, MousePointerClick, TrendingUp, Loader2 } from 'lucide-react';
import { getSupabaseAdminClient } from '../../lib/supabase';

interface StatsData {
  totalArticles: number;
  contactsToday: number;
  clicksOpteeToday: number;
  clicksPisteurToday: number;
}

interface RecentContact {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  created_at: string;
}

interface RecentEvent {
  id: string;
  button_name: string;
  page: string | null;
  clicked_at: string;
}

function todayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function DashboardHome() {
  const [stats, setStats] = useState<StatsData>({
    totalArticles: 0,
    contactsToday: 0,
    clicksOpteeToday: 0,
    clicksPisteurToday: 0,
  });
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const admin = getSupabaseAdminClient();
        const today = todayIso();

        const [
          articlesRes,
          contactsTodayRes,
          clicksOpteeRes,
          clicksPisteurRes,
          contactsRes,
          eventsRes,
        ] = await Promise.all([
          admin.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
          admin.from('contact_submissions').select('id', { count: 'exact', head: true }).gte('created_at', today),
          admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('button_name', 'Essayer Optee').gte('clicked_at', today),
          admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('button_name', 'Pisteur - Barre annonce').gte('clicked_at', today),
          admin.from('contact_submissions').select('id,firstname,lastname,email,created_at').order('created_at', { ascending: false }).limit(5),
          admin.from('analytics_events').select('id,button_name,page,clicked_at').order('clicked_at', { ascending: false }).limit(10),
        ]);

        setStats({
          totalArticles: articlesRes.count ?? 0,
          contactsToday: contactsTodayRes.count ?? 0,
          clicksOpteeToday: clicksOpteeRes.count ?? 0,
          clicksPisteurToday: clicksPisteurRes.count ?? 0,
        });
        setRecentContacts((contactsRes.data as RecentContact[]) ?? []);
        setRecentEvents((eventsRes.data as RecentEvent[]) ?? []);
      } catch (e) {
        setError('Erreur lors du chargement des données.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Articles publiés',
      value: stats.totalArticles,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Contacts aujourd\'hui',
      value: stats.contactsToday,
      icon: Users,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Clics "Essayer Optee" aujourd\'hui',
      value: stats.clicksOpteeToday,
      icon: MousePointerClick,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Clics "Pisteur" aujourd\'hui',
      value: stats.clicksPisteurToday,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Derniers contacts</h3>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Aucun contact pour l&apos;instant.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3 text-left">Nom</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {[c.firstname, c.lastname].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 truncate max-w-[140px]">{c.email}</td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Derniers clics</h3>
          </div>
          {recentEvents.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Aucun événement pour l&apos;instant.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3 text-left">Bouton</th>
                  <th className="px-5 py-3 text-left">Page</th>
                  <th className="px-5 py-3 text-left">Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900 truncate max-w-[160px]">
                      {e.button_name}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 truncate max-w-[100px]">
                      {e.page ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(e.clicked_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
