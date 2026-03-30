import { format, parseISO } from 'date-fns';
import type { ReceiptData } from '../types/receipt';
import { ISSUER_DETAILS, calculateReceiptTotals } from '../types/receipt';

interface ReceiptPreviewProps {
  receipt: ReceiptData;
}

export default function ReceiptPreview({ receipt }: ReceiptPreviewProps) {
  const totals = calculateReceiptTotals(receipt);
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
      {/* Blue Header */}
      <div className="bg-primary h-4"></div>
      
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{ISSUER_DETAILS.name}</h3>
            <p className="text-sm text-gray-600">Phone: {ISSUER_DETAILS.phone}</p>
            <p className="text-sm text-gray-600">Email: {ISSUER_DETAILS.email}</p>
            <p className="text-sm text-gray-600">{ISSUER_DETAILS.bank}: {ISSUER_DETAILS.accountNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {format(parseISO(receipt.date), 'dd MMM yyyy')}</p>
            <p className="text-sm text-gray-600 font-medium">Receipt No: {receipt.receiptNumber}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Bill To</h4>
          <p className="text-lg font-medium text-gray-900">{receipt.personName}</p>
        </div>

        {/* Table */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 font-semibold text-gray-700">Description</th>
              <th className="text-right py-3 font-semibold text-gray-700">Hours</th>
              <th className="text-right py-3 font-semibold text-gray-700">Unit Price</th>
              <th className="text-right py-3 font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 text-gray-800">{receipt.programmeName}</td>
              <td className="text-right py-3 text-gray-800">{receipt.hours}</td>
              <td className="text-right py-3 text-gray-800">S${receipt.unitPrice.toFixed(2)}</td>
              <td className="text-right py-3 text-gray-800">S${totals.subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">S${totals.subtotal.toFixed(2)}</span>
          </div>
          
          {receipt.discount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Discount ({receipt.discount}%)</span>
              <span className="text-green-600">-S${totals.discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal Less Discount</span>
            <span className="text-gray-800">S${totals.subtotalLessDiscount.toFixed(2)}</span>
          </div>
          
          {receipt.taxRate > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax ({receipt.taxRate}%)</span>
              <span className="text-gray-800">S${totals.taxAmount.toFixed(2)}</span>
            </div>
          )}
          
          {receipt.shippingHandling > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Shipping/Handling</span>
              <span className="text-gray-800">S${receipt.shippingHandling.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-t border-gray-300 mt-2">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-primary">S${totals.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Balance Paid */}
        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="text-center text-lg font-bold text-gray-900">
            Balance Paid: S${totals.total.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Blue Footer */}
      <div className="bg-primary h-4"></div>
    </div>
  );
}
