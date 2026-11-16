import { supabase } from './lib/supabase.js';

export const listEntries = async () => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, body, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export const addEntry = async (body) => {
  const { data: session } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('journal_entries')
    .insert({ body, user_id: session.user.id });

  if (error) throw error;
};
