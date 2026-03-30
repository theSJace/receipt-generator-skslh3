export interface ReceiptData {
  id: string;
  personName: string;
  programmeName: string;
  hours: number;
  unitPrice: number;
  date: string;
  receiptNumber: string;
  discount: number;
  taxRate: number;
  shippingHandling: number;
  createdAt: number;
}

export interface IssuerDetails {
  name: string;
  phone: string;
  email: string;
  bank: string;
  accountNumber: string;
}

export const ISSUER_DETAILS: IssuerDetails = {
  name: 'Sayyid Iskandar Khan',
  phone: '90722362',
  email: 'sayyidkhan92@hotmail.com',
  bank: 'POSB Savings',
  accountNumber: '195-57878-8',
};

export const calculateReceiptTotals = (data: ReceiptData) => {
  const subtotal = data.hours * data.unitPrice;
  const discountAmount = subtotal * (data.discount / 100);
  const subtotalLessDiscount = subtotal - discountAmount;
  const taxAmount = subtotalLessDiscount * (data.taxRate / 100);
  const total = subtotalLessDiscount + taxAmount + data.shippingHandling;
  
  return {
    subtotal,
    discountAmount,
    subtotalLessDiscount,
    taxAmount,
    total,
  };
};

export const generateReceiptNumber = (lastNumber?: string): string => {
  if (!lastNumber) return 'T00001-A';
  
  const match = lastNumber.match(/T(\d+)-A/);
  if (!match) return 'T00001-A';
  
  const num = parseInt(match[1], 10) + 1;
  return `T${num.toString().padStart(5, '0')}-A`;
};
