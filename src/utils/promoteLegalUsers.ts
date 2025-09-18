import { supabase } from "@/integrations/supabase/client";

export const promoteLegalUsersToAdmin = async () => {
  try {
    console.log('Promoting legal users to admin role...');
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'limited_admin',
        updated_at: new Date().toISOString()
      })
      .in('email', [
        'legal@run.edu.ng',
        'vc@run.edu.ng', 
        'councilaffairs@run.edu.ng',
        'registrar@run.edu.ng'
      ]);

    if (error) {
      console.error('Error promoting users:', error);
      return false;
    }

    console.log('Successfully promoted legal users to admin role:', data);
    
    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('email, role, updated_at')
      .in('email', [
        'legal@run.edu.ng',
        'vc@run.edu.ng', 
        'councilaffairs@run.edu.ng',
        'registrar@run.edu.ng'
      ]);

    if (verifyError) {
      console.error('Error verifying updates:', verifyError);
    } else {
      console.log('Verified user roles:', verifyData);
    }

    return true;
  } catch (error) {
    console.error('Failed to promote users:', error);
    return false;
  }
};