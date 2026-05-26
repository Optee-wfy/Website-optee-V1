import { useEffect, useState, useCallback } from 'react';
import { X, Phone, Mail, Loader2, CheckCircle, Circle, RefreshCw } from 'lucide-react';
import { getSupabaseAdminClient } from '../../lib/supabase';

interface Contact {
  id: string;
  firstname: string | null;
  lastname: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  created_at: string;
  read: boolean;
}

type FilterType = 'all' | 'unread';

export default function ContactsSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [markingRead, setMarkingRead] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const admin = getSupabaseAdminClient();
      let query = admin
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('read', false);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setContacts((data as Contact[]) ?? []);
    } catch (e) {
      setError('Erreur lors du chargement des contacts.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function markAsRead(id: string) {
    setMarkingRead(true);
    try {
      const admin = getSupabaseAdminClient();
      const { error: err } = await admin
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', id);
      if (err) throw err;
      // Update local state
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: true } : c))
      );
      if (selectedContact?.id === id) {
        setSelectedContact((prev) => prev ? { ...prev, read: true } : null);
      }
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour.');
    } finally {
      setMarkingRead(false);
    }
  }

  const unreadCount = contacts.filter((c) => !c.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm flex items-center justify-between">
        <span>{error}</span>
        <button onClick={fetchContacts} className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header + filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Contacts</h2>
          <p className="text-sm text-gray-500">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            {filter === 'all' && unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                {unreadCount} non lu{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Non lus
          </button>
          <button
            onClick={fetchContacts}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            {filter === 'unread' ? 'Aucun message non lu.' : 'Aucun contact pour l\'instant.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-6"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${!contact.read ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="px-4 py-3">
                    {contact.read ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-blue-500" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className={`${!contact.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {[contact.firstname, contact.lastname].filter(Boolean).join(' ') || '—'}
                    </p>
                    {contact.company && (
                      <p className="text-xs text-gray-400">{contact.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{contact.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    <span className="line-clamp-1 max-w-[200px] block">
                      {contact.message || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap hidden sm:table-cell">
                    {new Date(contact.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      contact.read
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {contact.read ? 'Lu' : 'Nouveau'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {[selectedContact.firstname, selectedContact.lastname].filter(Boolean).join(' ') || 'Contact sans nom'}
                </h2>
                {selectedContact.company && (
                  <p className="text-sm text-gray-500 mt-0.5">{selectedContact.company}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoField label="Prénom" value={selectedContact.firstname} />
                <InfoField label="Nom" value={selectedContact.lastname} />
                <InfoField label="Entreprise" value={selectedContact.company} />
                <InfoField label="Email" value={selectedContact.email} />
                <InfoField label="Téléphone" value={selectedContact.phone} />
                <InfoField label="Sujet" value={selectedContact.subject} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message || '(Aucun message)'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Date de contact
                </label>
                <p className="text-gray-700 text-sm">
                  {new Date(selectedContact.created_at).toLocaleString('fr-FR', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-wrap">
              {selectedContact.phone && (
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Appeler
                </a>
              )}
              <a
                href={`mailto:${selectedContact.email}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Envoyer un email
              </a>
              {!selectedContact.read && (
                <button
                  onClick={() => markAsRead(selectedContact.id)}
                  disabled={markingRead}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors ml-auto"
                >
                  {markingRead ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Marquer comme lu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <p className="text-gray-800 text-sm">{value || '—'}</p>
    </div>
  );
}
