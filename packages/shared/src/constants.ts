export const RWANDA_DISTRICTS = {
  KIGALI: ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  NORTHERN: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  SOUTHERN: ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  EASTERN: ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  WESTERN: ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
} as const;

export const CAR_MAKES = [
  'Toyota', 'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Subaru', 'Isuzu',
  'Mercedes-Benz', 'BMW', 'Volkswagen', 'Audi', 'Land Rover', 'Range Rover',
  'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Suzuki', 'Daihatsu', 'Lexus',
  'Jeep', 'Peugeot', 'Renault', 'Volvo', 'Porsche', 'Infiniti', 'Acura',
  'Other',
] as const;

export const PHONE_REGEX = /^\+250[0-9]{9}$/;

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    return `+250${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('250') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  return cleaned;
};

export const formatRwf = (amount: number | bigint): string => {
  return `RWF ${Number(amount).toLocaleString('en-US')}`;
};

export const formatRwfUsd = (amountRwf: number | bigint, rate: number = 0.00078): string => {
  const usd = Number(amountRwf) * rate;
  return `≈ $${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
