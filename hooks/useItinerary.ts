import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { GenerateRequest, RebuildRequest, SavedItinerary, TravelPlan } from '../types/travel';

export function useItinerary() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(
    async (request: GenerateRequest): Promise<SavedItinerary> => {
      if (!user) throw new Error('Must be signed in to generate a plan');
      setGenerating(true);
      setError(null);

      try {
        const { data: fnData, error: fnError } = await supabase.functions.invoke(
          'generate-travel',
          { body: request }
        );
        if (fnError) throw fnError;

        const plan: TravelPlan = fnData;

        const { data: saved, error: dbError } = await supabase
          .from('saved_itineraries')
          .insert({
            user_id: user.id,
            destination: request.destination,
            travel_dates: request.travel_dates,
            preferences: request.preferences,
            itinerary_data: plan,
          })
          .select()
          .single();

        if (dbError) throw dbError;
        return saved as SavedItinerary;
      } catch (err: any) {
        const msg = err?.message ?? 'Failed to generate plan';
        setError(msg);
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    [user]
  );

  const rebuildPlan = useCallback(
    async (request: RebuildRequest): Promise<TravelPlan> => {
      setGenerating(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          'rebuild-itinerary',
          { body: request }
        );
        if (fnError) throw fnError;

        await supabase
          .from('saved_itineraries')
          .update({ itinerary_data: data, updated_at: new Date().toISOString() })
          .eq('id', request.itinerary_id);

        return data as TravelPlan;
      } catch (err: any) {
        setError(err?.message ?? 'Failed to rebuild plan');
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  const fetchSaved = useCallback(async (): Promise<SavedItinerary[]> => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('saved_itineraries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as SavedItinerary[];
  }, [user]);

  const fetchById = useCallback(async (id: string): Promise<SavedItinerary | null> => {
    const { data, error } = await supabase
      .from('saved_itineraries')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as SavedItinerary;
  }, []);

  const fetchByToken = useCallback(async (token: string): Promise<SavedItinerary | null> => {
    const { data, error } = await supabase
      .from('saved_itineraries')
      .select('*')
      .eq('public_token', token)
      .single();
    if (error) return null;
    return data as SavedItinerary;
  }, []);

  const deleteItinerary = useCallback(async (id: string) => {
    const { error } = await supabase.from('saved_itineraries').delete().eq('id', id);
    if (error) throw error;
  }, []);

  const shareItinerary = useCallback(async (itinerary: SavedItinerary) => {
    const url = `travell://plan/share/${itinerary.public_token}`;
    const title = `${itinerary.travel_dates.duration_days} Days in ${itinerary.destination}`;
    await Share.share({ title, message: `Check out my trip: ${title}\n${url}`, url });
  }, []);

  return {
    generating,
    error,
    generatePlan,
    rebuildPlan,
    fetchSaved,
    fetchById,
    fetchByToken,
    deleteItinerary,
    shareItinerary,
  };
}
