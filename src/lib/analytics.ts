import { supabase } from './supabase';

export async function trackButtonClick(buttonName: string): Promise<void> {
  try {
    await supabase.from('analytics_events').insert({
      button_name: buttonName,
      page: window.location.pathname,
      clicked_at: new Date().toISOString(),
    });
  } catch (_e) {
    // silent fail — never block UX
  }
}
