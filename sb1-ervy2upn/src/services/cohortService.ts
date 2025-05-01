import { supabase } from '../lib/supabase';
import { SavedCohort } from '../types/savedCohort';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await wait(delay);
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

export async function saveCohort(cohort: Omit<SavedCohort, 'id'>) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await retryOperation(() =>
      supabase
        .from('saved_cohorts')
        .insert({
          user_id: userData.user!.id,
          name: cohort.name,
          description: cohort.description,
          date_created: cohort.dateCreated.toISOString(),
          filters: cohort.filters,
          stats: cohort.stats,
        })
        .select()
        .single()
    );

    if (error) {
      console.error('Error saving cohort:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save cohort:', error);
    throw new Error('Failed to save cohort. Please try again later.');
  }
}

export async function getSavedCohorts() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return [];
    }

    const { data, error } = await retryOperation(() =>
      supabase
        .from('saved_cohorts')
        .select('*')
        .eq('user_id', userData.user!.id)
        .order('created_at', { ascending: false })
    );

    if (error) {
      console.error('Error retrieving saved cohorts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to retrieve saved cohorts:', error);
    return []; // Return empty array instead of throwing to prevent UI disruption
  }
}

export async function deleteCohort(id: string) {
  try {
    const { error } = await retryOperation(() =>
      supabase
        .from('saved_cohorts')
        .delete()
        .eq('id', id)
    );

    if (error) {
      console.error('Error deleting cohort:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete cohort:', error);
    throw new Error('Failed to delete cohort. Please try again later.');
  }
}