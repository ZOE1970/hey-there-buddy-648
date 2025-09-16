-- Create compliance_submissions table
CREATE TABLE public.compliance_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number SERIAL UNIQUE,
  certificate_number TEXT UNIQUE,
  vendor_name TEXT NOT NULL,
  vendor_email TEXT NOT NULL,
  service_name TEXT NOT NULL,
  form_data JSONB NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view approved submissions" 
ON public.compliance_submissions 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can insert submissions" 
ON public.compliance_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Superadmins can manage all submissions" 
ON public.compliance_submissions 
FOR ALL 
USING (is_superadmin());

-- Create function to generate certificate number
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL THEN
    NEW.certificate_number := 'RUN-CERT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEW.serial_number::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate risk level
CREATE OR REPLACE FUNCTION public.calculate_risk_level(form_data JSONB)
RETURNS TEXT AS $$
DECLARE
  risk_score INTEGER := 0;
  risk_level TEXT;
BEGIN
  -- Basic risk assessment logic
  IF (form_data->>'dataTypes')::TEXT ILIKE '%personal%' THEN
    risk_score := risk_score + 2;
  END IF;
  
  IF (form_data->>'dataVolume')::TEXT ILIKE '%large%' THEN
    risk_score := risk_score + 2;
  END IF;
  
  IF (form_data->>'securityMeasures')::TEXT ILIKE '%encryption%' THEN
    risk_score := risk_score - 1;
  END IF;
  
  -- Determine risk level
  IF risk_score <= 1 THEN
    risk_level := 'Low';
  ELSIF risk_score <= 3 THEN
    risk_level := 'Medium';
  ELSE
    risk_level := 'High';
  END IF;
  
  RETURN risk_level;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic certificate number generation
CREATE TRIGGER generate_cert_number_trigger
  BEFORE INSERT ON public.compliance_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_certificate_number();

-- Create trigger for risk level calculation
CREATE OR REPLACE FUNCTION public.set_risk_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.risk_level = 'Medium' AND NEW.form_data IS NOT NULL THEN
    NEW.risk_level := public.calculate_risk_level(NEW.form_data);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_risk_level_trigger
  BEFORE INSERT OR UPDATE ON public.compliance_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_risk_level();

-- Create trigger for updated_at
CREATE TRIGGER update_compliance_submissions_updated_at
BEFORE UPDATE ON public.compliance_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();