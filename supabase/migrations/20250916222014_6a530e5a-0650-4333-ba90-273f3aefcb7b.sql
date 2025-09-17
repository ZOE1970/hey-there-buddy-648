-- Add reviewer decision fields to compliance_submissions table
ALTER TABLE public.compliance_submissions ADD COLUMN IF NOT EXISTS reviewer_id uuid REFERENCES auth.users(id);
ALTER TABLE public.compliance_submissions ADD COLUMN IF NOT EXISTS review_decision text;
ALTER TABLE public.compliance_submissions ADD COLUMN IF NOT EXISTS review_comments text;
ALTER TABLE public.compliance_submissions ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Update the trigger to automatically update reviewed_at when status changes
CREATE OR REPLACE FUNCTION public.update_reviewed_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed from pending to something else, set reviewed_at
  IF OLD.status = 'pending' AND NEW.status != 'pending' AND NEW.reviewed_at IS NULL THEN
    NEW.reviewed_at = NOW();
  END IF;
  
  -- Always update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS compliance_review_trigger ON public.compliance_submissions;
CREATE TRIGGER compliance_review_trigger
  BEFORE UPDATE ON public.compliance_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reviewed_at();

-- Add first_name, last_name, phone, company fields to profiles table if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;