import type { ReceiptData } from '../types/receipt';

const STORAGE_KEY = 'receipt_generator_data';

export const getAllReceipts = (): ReceiptData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const receipts = JSON.parse(data);
    return Array.isArray(receipts) ? receipts : [];
  } catch {
    return [];
  }
};

export const saveReceipt = (receipt: ReceiptData): void => {
  const receipts = getAllReceipts();
  receipts.push(receipt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
};

export const getReceiptById = (id: string): ReceiptData | null => {
  const receipts = getAllReceipts();
  return receipts.find(r => r.id === id) || null;
};

export const getLastReceiptNumber = (): string | null => {
  const receipts = getAllReceipts();
  if (receipts.length === 0) return null;
  
  // Sort by createdAt descending and get the most recent
  const sorted = [...receipts].sort((a, b) => b.createdAt - a.createdAt);
  return sorted[0].receiptNumber;
};

export const deleteReceipt = (id: string): void => {
  const receipts = getAllReceipts();
  const filtered = receipts.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const exportToJSON = (): string => {
  const receipts = getAllReceipts();
  return JSON.stringify(receipts, null, 2);
};

export const importFromJSON = (json: string): void => {
  const receipts = JSON.parse(json);
  if (Array.isArray(receipts)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }
};
