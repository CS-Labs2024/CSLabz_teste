import { useState, useEffect } from 'react';
import { SavedCohort } from '../types/savedCohort';
import * as cohortService from '../services/cohortService';
import { supabase } from '../lib/supabase';

export function useSavedCohorts() {
  const [cohorts, setCohorts] = useState<SavedCohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Load initial data
    const loadCohorts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (mounted) {
            setCohorts([]);
          }
          return;
        }

        const data = await cohortService.getSavedCohorts();
        if (mounted) {
          setCohorts(data.map(cohort => ({
            ...cohort,
            dateCreated: new Date(cohort.date_created)
          })));
        }
      } catch (err) {
        console.error('Error loading cohorts:', err);
        if (mounted) {
          setError('Unable to load saved cohorts. Please try again later.');
          setCohorts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCohorts();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        loadCohorts();
      } else if (event === 'SIGNED_OUT') {
        setCohorts([]);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const saveCohort = async (cohort: Omit<SavedCohort, 'id'>) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const savedCohort = await cohortService.saveCohort(cohort);
      if (savedCohort) {
        setCohorts(prev => [{
          ...cohort,
          id: savedCohort.id,
          dateCreated: new Date(cohort.dateCreated)
        }, ...prev]);
        return savedCohort;
      }
      throw new Error('Failed to save cohort');
    } catch (err) {
      setError('Failed to save cohort. Please try again later.');
      throw err;
    }
  };

  const deleteCohort = async (id: string) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      await cohortService.deleteCohort(id);
      setCohorts(prev => prev.filter(cohort => cohort.id !== id));
    } catch (err) {
      setError('Failed to delete cohort. Please try again later.');
      throw err;
    }
  };

  return {
    cohorts,
    loading,
    error,
    saveCohort,
    deleteCohort,
    refresh: async () => {
      setLoading(true);
      try {
        const data = await cohortService.getSavedCohorts();
        setCohorts(data.map(cohort => ({
          ...cohort,
          dateCreated: new Date(cohort.date_created)
        })));
        setError(null);
      } catch (err) {
        setError('Failed to refresh cohorts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };
}