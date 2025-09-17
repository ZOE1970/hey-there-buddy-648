-- Insert sample compliance submission data for testing
INSERT INTO public.compliance_submissions (
    vendor_name,
    vendor_email,
    service_name,
    status,
    risk_level,
    form_data
) VALUES (
    'Test Vendor Inc.',
    'test@vendor.com',
    'Cloud Storage Service',
    'pending',
    'medium',
    '{
        "general_info": {
            "contact_person": "John Doe",
            "contact_phone": "+1234567890",
            "service_description": "Secure cloud storage solution",
            "processes_personal_data": "yes",
            "university_access": "yes"
        },
        "data_processing": {
            "data_types": ["Personal identifiers", "Contact information"],
            "data_purpose": "Storage and management of user files",
            "data_location": "eu",
            "data_retention": "3 years",
            "has_dpo": "yes"
        },
        "security_measures": {
            "security_measures": ["Encryption at rest", "Access controls", "Regular audits"],
            "certifications": ["ISO 27001", "SOC 2"],
            "additional_security": "Multi-factor authentication and regular security assessments"
        }
    }'::jsonb
),
(
    'Academic Solutions Ltd.',
    'contact@academicsolutions.com',
    'Student Information System',
    'approved',
    'low',
    '{
        "general_info": {
            "contact_person": "Jane Smith",
            "contact_phone": "+1987654321",
            "service_description": "Comprehensive student management platform",
            "processes_personal_data": "yes",
            "university_access": "yes"
        },
        "data_processing": {
            "data_types": ["Educational records", "Personal identifiers"],
            "data_purpose": "Student record management and academic tracking",
            "data_location": "local",
            "data_retention": "5 years",
            "has_dpo": "yes"
        },
        "security_measures": {
            "security_measures": ["End-to-end encryption", "Role-based access", "Audit logging"],
            "certifications": ["FERPA compliant", "ISO 27001"],
            "additional_security": "Regular penetration testing and compliance audits"
        }
    }'::jsonb
);