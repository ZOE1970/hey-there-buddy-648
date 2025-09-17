-- Fix search_path security warnings for all functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.certificate_number IS NULL THEN
    NEW.certificate_number := 'RUN-CERT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEW.serial_number::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_risk_level(form_data jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.set_risk_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.risk_level = 'Medium' AND NEW.form_data IS NOT NULL THEN
    NEW.risk_level := public.calculate_risk_level(NEW.form_data);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_reviewed_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If status is being changed from pending to something else, set reviewed_at
  IF OLD.status = 'pending' AND NEW.status != 'pending' AND NEW.reviewed_at IS NULL THEN
    NEW.reviewed_at = NOW();
  END IF;
  
  -- Always update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$;