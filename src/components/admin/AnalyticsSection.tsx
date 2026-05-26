import { useEffect, useState, useCallback } from 'react';
import { Loader2, MousePointerClick, TrendingUp, Activity, Clock } from 'lucide-react';
import { getSupabaseAdminClient } from '../../lib/supabase';

type Period = 'today' | 'week' | 'month' | 'year';

interface AnalyticsEvent {
  id: string;
  button_name: string;
  page: string | null;
  clicked_at: string;
}

interface GroupedStat {
  button_name: string;
  count: number;
}

const PERIOD_LABELS: Record<Period, string> = {
  today: "Aujourd'hui",
  week: 'Cette semaine',
  month: 'Ce mois',
  year: 'Cette année',
};

function getPeriodStart(period: Period): Date {
  const now = new Date();
  switch (period) {
    case 'today': {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'week': {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'month': {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    case 'year': {
      return new Date(now.getFullYear(), 0, 1);
    }
  }
}

export default function AnalyticsSection() {
  const [period, setPeriod] = useState<Period>('today');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [grouped, setGrouped] = useState<GroupedStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const admin = getSupabaseAdminClient();
      const since = getPeriodStart(period).toISOString();

      const { data, error: err } = await admin
        .from('analytics_events')
        .select('id,button_name,page,clicked_at')
        .gte('clicked_at', since)
        .order('clicked_at', { ascending: false });

      if (err) throw err;

      const evts = (data as AnalyticsEvent[]) ?? [];
      setEvents(evts);

      // Group by button_name
      const map = new Map<string, number>();
      for (const e of evts) {
        map.set(e.button_name, (map.get(e.button_name) ?? 0) + 1);
      }
      const sorted = Array.from(map.entries())
        .map(([button_name, count]) => ({ button_name, count }))
        .sort((a, b) => b.count - a.count);
      setGrouped(sorted);
    } catch (e) {
      setError('Erreur lors du chargement des analytics.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalClicks = events.length;
  const clicksOptee = events.filter((e) => e.button_name === 'Essayer Optee').length;
  const clicksPisteur = events.filter((e) => e.button_name === 'Pisteur - Barre annonce').length;
  const clicksOthers = totalClicks - clicksOptee - clicksPisteur;

  const maxCount = grouped[0]?.count ?? 1;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              period === p
                ? 'bg-green-500 text-white shadow-sm shadow-green-500/25'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
          {error}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Activity className="w-5 h-5" />}
              label="Total clics"
              value={totalClicks}
              color="bg-gray-50 text-gray-600"
            />
            <StatCard
              icon={<MousePointerClick className="w-5 h-5" />}
              label="Essayer Optee"
              value={clicksOptee}
              color="bg-green-50 text-green-600"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Pisteur annonce"
              value={clicksPisteur}
              color="bg-orange-50 text-orange-600"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Autres boutons"
              value={clicksOthers}
              color="bg-purple-50 text-purple-600"
            />
          </div>

          {/* Grouped stats */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Clics par bouton</h3>
              <p className="text-xs text-gray-400 mt-0.5">{PERIOD_LABELS[period]}</p>
            </div>
            {grouped.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">
                Aucun clic enregistré pour cette période.
              </p>
            ) : (
              <div className="p-5 space-y-3">
                {grouped.map((g) => (
                  <div key={g.button_name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">{g.button_name}</span>
                      <span className="font-bold text-gray-700 ml-4">{g.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${(g.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent events */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Derniers événements</h3>
            </div>
            {events.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">
                Aucun événement pour cette période.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Bouton</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Page</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.slice(0, 50).map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(e.clicked_at).toLocaleString('fr-FR', {
                            day: '2-digit', month: 'short',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-900">{e.button_name}</td>
                        <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{e.page ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {events.length > 50 && (
                  <p className="text-xs text-gray-400 text-center py-3 border-t border-gray-100">
                    Affichage limité à 50 événements les plus récents.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
