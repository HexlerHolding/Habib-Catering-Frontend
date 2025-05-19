export const TITLE = 'Habib Catering';

export const CONTACT_INFO = {
  email: 'privacy@habibcatering.com',
  phone: '111-111-111',
  address: `${TITLE} Headquarters, Main Street, City`,
};

// Phone input configuration for different countries
// To change for another country, update these values:
// For US: max 10 digits, placeholder 'Enter 10-digit phone number'
// For Pakistan: max 11 digits, placeholder '03XX-XXXXXXX'
export const PHONE_INPUT_CONFIG = {
  maxLength: 10, // Change to 11 for Pakistan, 10 for US, etc.
  placeholder: 'Enter 10-digit phone number', // Change as needed for country format
};

export const CURRENCY_SYMBOL = '$';