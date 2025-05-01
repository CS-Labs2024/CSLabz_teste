import { SavedCohort } from '../types/savedCohort';
import { supabase } from './supabase';

export async function saveCohortAnalysis(cohort: Omit<SavedCohort, 'id'>) {
  const { data, error } = await supabase
    .from('saved_analyses')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      name: cohort.name,
      description: cohort.description,
      date_created: cohort.dateCreated,
      filters: cohort.filters,
      stats: cohort.stats
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadSavedAnalyses(): Promise<SavedCohort[]> {
  const { data, error } = await supabase
    .from('saved_analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    dateCreated: new Date(item.date_created),
    filters: item.filters,
    stats: item.stats
  }));
}

export async function deleteSavedAnalysis(id: string) {
  const { error } = await supabase
    .from('saved_analyses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}