import { supabase } from '@/integrations/supabase/client';

export const updateUsersToLegalRole = async () => {
  try {
    const emailsToUpdate = [
      'legal@run.edu.ng',
      'vc@run.edu.ng', 
      'councilaffairs@run.edu.ng',
      'registrar@run.edu.ng'
    ];

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'legal' })
      .in('email', emailsToUpdate)
      .select('email, role');

    if (error) {
      console.error('Error updating users to legal role:', error);
      return { success: false, error };
    }

    console.log('Successfully updated users to legal role:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception updating users:', err);
    return { success: false, error: err };
  }
};

// Run the update immediately
updateUsersToLegalRole().then(result => {
  if (result.success) {
    console.log('✅ Legal users successfully promoted:', result.data);
  } else {
    console.error('❌ Failed to promote legal users:', result.error);
  }
});