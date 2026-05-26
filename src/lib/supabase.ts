import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

// ─── Env validation ───────────────────────────────────────────────────────────

const supabaseEnv = {
  url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

const envKeyNames: Record<keyof typeof supabaseEnv, string> = {
  url: 'VITE_SUPABASE_URL',
  anonKey: 'VITE_SUPABASE_ANON_KEY',
};

function getSupabaseConfig(): SupabaseConfig {
  const missing = Object.entries(supabaseEnv)
    .filter(([, v]) => !v)
    .map(([k]) => envKeyNames[k as keyof typeof supabaseEnv]);

  if (missing.length > 0) {
    throw new Error(
      `[Supabase] Variables d'environnement manquantes : ${missing.join(', ')}`
    );
  }

  return supabaseEnv as SupabaseConfig;
}

// ─── Singleton client (anon) ──────────────────────────────────────────────────
//  Utilisé côté client pour toutes les opérations soumises aux règles RLS.

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const { url, anonKey } = getSupabaseConfig();
  _client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return _client;
}

/** Alias pratique : `import { supabase } from '@/lib/supabase'` */
export const supabase = getSupabaseClient();

// ─── Admin client (service role) ──────────────────────────────────────────────
//  ⚠️  Ne jamais exposer la service key côté client en production.
//      Ce client est fourni pour les edge functions / scripts serveur uniquement.

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const { url } = getSupabaseConfig();
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY as string | undefined;

  if (!serviceKey) {
    throw new Error('[Supabase] VITE_SUPABASE_SERVICE_KEY est manquant.');
  }

  _adminClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _adminClient;
}
