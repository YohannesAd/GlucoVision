/**
 * Form Options Constants
 * Centralized form options to reduce code duplication
 */

export const FORM_OPTIONS = {
  // Onboarding options
  gender: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ],

  diabetesType: [
    { value: 'Type 1', label: 'Type 1' },
    { value: 'Type 2', label: 'Type 2' },
    { value: 'Pre-diabetic', label: 'Pre-diabetic' },
    { value: 'Gestational', label: 'Gestational' },
  ],

  meals: [
    { value: '1', label: '1 meal' },
    { value: '2', label: '2 meals' },
    { value: '3', label: '3 meals' },
    { value: '4', label: '4 meals' },
    { value: '5', label: '5 meals' },
    { value: '5+', label: '5+ meals' },
  ],

  activity: [
    { value: 'Sedentary', label: 'Sedentary' },
    { value: 'Light', label: 'Light' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Active', label: 'Active' },
  ],

  insulin: [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ],

  insulinType: [
    { value: 'Rapid-acting', label: 'Rapid-acting' },
    { value: 'Long-acting', label: 'Long-acting' },
    { value: 'Both', label: 'Both types' },
    { value: 'Other', label: 'Other' },
  ],

  sleep: [
    { value: '4', label: '4 hours' },
    { value: '5', label: '5 hours' },
    { value: '6', label: '6 hours' },
    { value: '7', label: '7 hours' },
    { value: '8', label: '8 hours' },
    { value: '9', label: '9 hours' },
    { value: '10', label: '10 hours' },
    { value: '11', label: '11 hours' },
    { value: '12', label: '12+ hours' },
  ],

  // Glucose log options
  mealContext: [
    { value: 'fasting', label: 'Fasting' },
    { value: 'before_meal', label: 'Before Meal' },
    { value: 'after_meal', label: 'After Meal' },
    { value: 'bedtime', label: 'Bedtime' },
    { value: 'random', label: 'Random' }
  ]
};

// Helper functions
export const generateYearOptions = (startYear = 1950) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

export const generateGlucoseOptions = (min = 50, max = 500, step = 5) => {
  const options = [];
  for (let value = min; value <= max; value += step) {
    options.push({ value: value.toString(), label: `${value} mg/dL` });
  }
  return options;
};
