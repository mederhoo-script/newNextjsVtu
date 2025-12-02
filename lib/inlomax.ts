/**
 * Inlomax API Wrapper
 * Server-side only - reads INLOMAX_API_KEY from environment
 */

const INLOMAX_BASE_URL = 'https://inlomax.com/api';

function getApiKey(): string {
  const apiKey = process.env.INLOMAX_API_KEY;
  if (!apiKey) {
    throw new Error('INLOMAX_API_KEY environment variable is not set');
  }
  return apiKey;
}

async function makeRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const apiKey = getApiKey();

  const headers: HeadersInit = {
    'Authorization': `Token ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${INLOMAX_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Inlomax API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Service Types
export interface InlomaxService {
  id: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

export interface InlomaxServicesResponse {
  success: boolean;
  data: InlomaxService[];
  [key: string]: unknown;
}

export interface InlomaxBalanceResponse {
  success: boolean;
  balance: number;
  [key: string]: unknown;
}

export interface InlomaxTransactionResponse {
  success: boolean;
  reference?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export interface InlomaxValidationResponse {
  success: boolean;
  name?: string;
  address?: string;
  [key: string]: unknown;
}

// API Functions

/**
 * Get all available services
 */
export async function getServices(): Promise<InlomaxServicesResponse> {
  return makeRequest<InlomaxServicesResponse>('/services', 'GET');
}

/**
 * Get account balance (admin only)
 */
export async function getBalance(): Promise<InlomaxBalanceResponse> {
  return makeRequest<InlomaxBalanceResponse>('/balance', 'GET');
}

/**
 * Purchase airtime
 */
export async function airtime(params: {
  network: string;
  phone: string;
  amount: number;
  reference?: string;
}): Promise<InlomaxTransactionResponse> {
  return makeRequest<InlomaxTransactionResponse>('/airtime', 'POST', params);
}

/**
 * Purchase data bundle
 */
export async function data(params: {
  network: string;
  phone: string;
  plan_id: string;
  reference?: string;
}): Promise<InlomaxTransactionResponse> {
  return makeRequest<InlomaxTransactionResponse>('/data', 'POST', params);
}

/**
 * Validate cable TV smartcard
 */
export async function validateCable(params: {
  service: string;
  smartcard_number: string;
}): Promise<InlomaxValidationResponse> {
  return makeRequest<InlomaxValidationResponse>('/validate-cable', 'POST', params);
}

/**
 * Subscribe to cable TV
 */
export async function subCable(params: {
  service: string;
  smartcard_number: string;
  plan_id: string;
  reference?: string;
}): Promise<InlomaxTransactionResponse> {
  return makeRequest<InlomaxTransactionResponse>('/sub-cable', 'POST', params);
}

/**
 * Validate electricity meter
 */
export async function validateMeter(params: {
  disco: string;
  meter_number: string;
  meter_type: string;
}): Promise<InlomaxValidationResponse> {
  return makeRequest<InlomaxValidationResponse>('/validate-meter', 'POST', params);
}

/**
 * Pay electricity bill
 */
export async function payElectric(params: {
  disco: string;
  meter_number: string;
  meter_type: string;
  amount: number;
  reference?: string;
}): Promise<InlomaxTransactionResponse> {
  return makeRequest<InlomaxTransactionResponse>('/pay-electric', 'POST', params);
}

/**
 * Purchase education PIN/voucher
 */
export async function education(params: {
  service: string;
  quantity: number;
  reference?: string;
}): Promise<InlomaxTransactionResponse> {
  return makeRequest<InlomaxTransactionResponse>('/education', 'POST', params);
}

/**
 * Get transaction details by reference
 */
export async function transactionDetails(params: {
  reference: string;
}): Promise<InlomaxTransactionResponse> {
  return makeRequest<InlomaxTransactionResponse>('/transaction', 'POST', params);
}

const inlomaxApi = {
  getServices,
  getBalance,
  airtime,
  data,
  validateCable,
  subCable,
  validateMeter,
  payElectric,
  education,
  transactionDetails,
};

export default inlomaxApi;
