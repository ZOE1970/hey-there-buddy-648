import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Submission {
  id: string;
  vendor_name: string;
  vendor_email: string;
  service_name: string;
  status: string;
  risk_level: string;
  created_at: string;
  reviewed_at: string | null;
  reviewer_id: string | null;
  review_decision: string | null;
  review_comments: string | null;
  form_data: any;
  certificate_number: string | null;
  serial_number: number;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('compliance_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubmissions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateSubmission = async (
    id: string, 
    updates: {
      status: string;
      risk_level: string;
      review_decision: string;
      review_comments: string;
      reviewer_id: string;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('compliance_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh submissions after update
      await fetchSubmissions();
      return { success: true };
    } catch (err) {
      console.error('Error updating submission:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update submission' 
      };
    }
  };

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    updateSubmission
  };
};