import { Client, TaxFiling, CredentialVaultItem, ClientPaymentRecord, FirmProfile } from '../types';
import { INITIAL_CLIENTS, INITIAL_FILINGS, INITIAL_CREDENTIALS, INITIAL_PAYMENTS, DEFAULT_FIRM_PROFILE } from '../data/mockData';

const STORAGE_KEYS = {
  CLIENTS: 'taxsahayak_clients_v1',
  FILINGS: 'taxsahayak_filings_v1',
  CREDENTIALS: 'taxsahayak_credentials_vault_v1',
  PAYMENTS: 'taxsahayak_payments_v1',
  FIRM_PROFILE: 'taxsahayak_firm_profile_v1',
  VAULT_PIN: 'taxsahayak_vault_pin_v1',
  NOTIFICATION_SETTINGS: 'taxsahayak_notifications_cfg_v1',
};

// Simple yet effective client-side obfuscation for local credentials storage
const OBFUSCATION_SALT = 'TaxSahayak_Offline_Vault_Sec_2026';

export function obfuscate(text: string): string {
  if (!text) return '';
  try {
    const chars = text.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ OBFUSCATION_SALT.charCodeAt(i % OBFUSCATION_SALT.length))
    );
    return btoa(chars.join(''));
  } catch (e) {
    return text;
  }
}

export function deobfuscate(encoded: string): string {
  if (!encoded) return '';
  try {
    const text = atob(encoded);
    const chars = text.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ OBFUSCATION_SALT.charCodeAt(i % OBFUSCATION_SALT.length))
    );
    return chars.join('');
  } catch (e) {
    return encoded;
  }
}

// Client Storage
export function getStoredClients(): Client[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!data) {
      saveStoredClients(INITIAL_CLIENTS);
      return INITIAL_CLIENTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed reading clients from localStorage:', err);
    return INITIAL_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (err) {
    console.error('Failed writing clients to localStorage:', err);
  }
}

// Filings Storage (GST, Income Tax, TDS, Audit)
export function getStoredFilings(): TaxFiling[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILINGS);
    if (!data) {
      saveStoredFilings(INITIAL_FILINGS);
      return INITIAL_FILINGS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed reading filings from localStorage:', err);
    return INITIAL_FILINGS;
  }
}

export function saveStoredFilings(filings: TaxFiling[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FILINGS, JSON.stringify(filings));
  } catch (err) {
    console.error('Failed writing filings to localStorage:', err);
  }
}

// Credentials Vault Storage (Offline encrypted/obfuscated)
export function getStoredCredentials(): CredentialVaultItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!data) {
      // Seed with obfuscated passwords
      const seeded = INITIAL_CREDENTIALS.map(c => ({
        ...c,
        gstPassword: obfuscate(c.gstPassword || ''),
        incomeTaxPassword: obfuscate(c.incomeTaxPassword || ''),
        ewayBillPassword: obfuscate(c.ewayBillPassword || ''),
        tracesPassword: obfuscate(c.tracesPassword || ''),
      }));
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(seeded));
      return INITIAL_CREDENTIALS;
    }

    const parsed: CredentialVaultItem[] = JSON.parse(data);
    return parsed.map(c => ({
      ...c,
      gstPassword: deobfuscate(c.gstPassword || ''),
      incomeTaxPassword: deobfuscate(c.incomeTaxPassword || ''),
      ewayBillPassword: deobfuscate(c.ewayBillPassword || ''),
      tracesPassword: deobfuscate(c.tracesPassword || ''),
    }));
  } catch (err) {
    console.error('Failed reading credentials vault from localStorage:', err);
    return INITIAL_CREDENTIALS;
  }
}

export function saveStoredCredentials(items: CredentialVaultItem[]): void {
  try {
    const obfuscated = items.map(c => ({
      ...c,
      gstPassword: obfuscate(c.gstPassword || ''),
      incomeTaxPassword: obfuscate(c.incomeTaxPassword || ''),
      ewayBillPassword: obfuscate(c.ewayBillPassword || ''),
      tracesPassword: obfuscate(c.tracesPassword || ''),
    }));
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(obfuscated));
  } catch (err) {
    console.error('Failed writing credentials to localStorage:', err);
  }
}

// Payments & Ledger Storage
export function getStoredPayments(): ClientPaymentRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!data) {
      saveStoredPayments(INITIAL_PAYMENTS);
      return INITIAL_PAYMENTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed reading payments from localStorage:', err);
    return INITIAL_PAYMENTS;
  }
}

export function saveStoredPayments(payments: ClientPaymentRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  } catch (err) {
    console.error('Failed writing payments to localStorage:', err);
  }
}

// Firm Profile
export function getStoredFirmProfile(): FirmProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FIRM_PROFILE);
    if (!data) {
      saveStoredFirmProfile(DEFAULT_FIRM_PROFILE);
      return DEFAULT_FIRM_PROFILE;
    }
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_FIRM_PROFILE;
  }
}

export function saveStoredFirmProfile(profile: FirmProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FIRM_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed saving firm profile:', err);
  }
}

// Vault Master PIN Security
export function getVaultPin(): string | null {
  return localStorage.getItem(STORAGE_KEYS.VAULT_PIN);
}

export function setVaultPin(pin: string): void {
  localStorage.setItem(STORAGE_KEYS.VAULT_PIN, pin);
}

export function removeVaultPin(): void {
  localStorage.removeItem(STORAGE_KEYS.VAULT_PIN);
}

// Export / Import Full Database for Accountant Off-site Backups
export function exportEntireDatabaseJSON(): string {
  const exportData = {
    app: 'TaxSahayak',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    firmProfile: getStoredFirmProfile(),
    clients: getStoredClients(),
    filings: getStoredFilings(),
    credentials: getStoredCredentials(),
    payments: getStoredPayments()
  };
  return JSON.stringify(exportData, null, 2);
}

export function importEntireDatabaseJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.firmProfile) saveStoredFirmProfile(data.firmProfile);
    if (data.clients && Array.isArray(data.clients)) saveStoredClients(data.clients);
    if (data.filings && Array.isArray(data.filings)) saveStoredFilings(data.filings);
    if (data.credentials && Array.isArray(data.credentials)) saveStoredCredentials(data.credentials);
    if (data.payments && Array.isArray(data.payments)) saveStoredPayments(data.payments);
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
