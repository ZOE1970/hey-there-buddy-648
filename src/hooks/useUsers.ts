import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  created_at: string;
}

export interface UserStats {
  total_users: number;
  vendor_count: number;
  admin_count: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        console.warn('Could not fetch user stats:', statsError);
      } else if (statsData) {
        setUserStats(statsData);
      }

    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('delete_user_and_data', {
        user_id: userId
      });

      if (error) throw error;

      if (data) {
        // Refresh the users list
        await fetchUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    userStats,
    loading,
    error,
    deleteUser,
    refetch: fetchUsers
  };
};