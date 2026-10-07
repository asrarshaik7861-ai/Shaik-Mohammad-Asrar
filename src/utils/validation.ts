export interface ValidationResult {
  isValid: boolean;
  errors: {
    type?: string;
    purpose?: string;
  };
}

export function validateEmailForm(data: { type: string; purpose: string }): ValidationResult {
  const errors: { type?: string; purpose?: string } = {};

  if (!data.type || !data.type.trim()) {
    errors.type = 'Please select an email type.';
  }

  if (!data.purpose || !data.purpose.trim()) {
    errors.purpose = 'Please provide the purpose of your email.';
  } else if (data.purpose.trim().length < 5) {
    errors.purpose = 'Purpose must be at least 5 characters long to provide sufficient context.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
