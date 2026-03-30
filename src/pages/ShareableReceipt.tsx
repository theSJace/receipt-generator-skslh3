import { useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FileText, Printer } from 'lucide-react';
import { getReceiptById } from '../utils/storage';
import { ISSUER_DETAILS, calculateReceiptTotals } from '../types/receipt';

export default function ShareableReceipt() {
  const { id } = useParams<{ id: string }>();
  const receipt = id ? getReceiptById(id) : null;

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Not Found</h1>
          <p className="text-gray-600">The receipt you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const totals = calculateReceiptTotals(receipt);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Print Button - Hidden when printing */}
      <div className="max-w-3xl mx-auto mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium mx-auto"
        >
          <Printer className="w-5 h-5" />
          Print / Save as PDF
        </button>
      </div>

      {/* Receipt */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Blue Header */}
        <div className="bg-primary h-4"></div>
        
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-xl text-gray-900">{ISSUER_DETAILS.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Phone: {ISSUER_DETAILS.phone}</p>
              <p className="text-sm text-gray-600">Email: {ISSUER_DETAILS.email}</p>
              <p className="text-sm text-gray-600">{ISSUER_DETAILS.bank}: {ISSUER_DETAILS.accountNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date: {format(parseISO(receipt.date), 'dd MMM yyyy')}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">Receipt No: {receipt.receiptNumber}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Bill To</h4>
            <p className="text-xl font-medium text-gray-900">{receipt.personName}</p>
          </div>

          {/* Table */}
          <table className="w-full mb-8">
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
                <td className="py-4 text-gray-800 font-medium">{receipt.programmeName}</td>
                <td className="text-right py-4 text-gray-800">{receipt.hours}</td>
                <td className="text-right py-4 text-gray-800">S${receipt.unitPrice.toFixed(2)}</td>
                <td className="text-right py-4 text-gray-800 font-medium">S${totals.subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800 font-medium">S${totals.subtotal.toFixed(2)}</span>
            </div>
            
            {receipt.discount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Discount ({receipt.discount}%)</span>
                <span className="text-green-600 font-medium">-S${totals.discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal Less Discount</span>
              <span className="text-gray-800 font-medium">S${totals.subtotalLessDiscount.toFixed(2)}</span>
            </div>
            
            {receipt.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax ({receipt.taxRate}%)</span>
                <span className="text-gray-800 font-medium">S${totals.taxAmount.toFixed(2)}</span>
              </div>
            )}
            
            {receipt.shippingHandling > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping/Handling</span>
                <span className="text-gray-800 font-medium">S${receipt.shippingHandling.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-4">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary">S${totals.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Balance Paid */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <p className="text-center text-2xl font-bold text-gray-900">
              Balance Paid: S${totals.total.toFixed(2)}
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">This receipt was generated electronically and is valid without signature.</p>
          </div>
        </div>
        
        {/* Blue Footer */}
        <div className="bg-primary h-4"></div>
      </div>

      {/* Footer - Hidden when printing */}
      <div className="max-w-3xl mx-auto mt-8 text-center text-sm text-gray-500 print:hidden">
        <p>Generated by Receipt Generator</p>
      </div>
    </div>
  );
}
