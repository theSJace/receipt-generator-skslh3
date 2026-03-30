import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Eye, Download, Link as LinkIcon, CheckCircle } from 'lucide-react';
import type { ReceiptData } from '../types/receipt';
import { generateReceiptNumber } from '../types/receipt';
import { saveReceipt, getLastReceiptNumber } from '../utils/storage';
import ReceiptPreview from '../components/ReceiptPreview';

export default function CreateReceipt() {
  const [showPreview, setShowPreview] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    personName: '',
    programmeName: '',
    hours: '',
    unitPrice: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    receiptNumber: '',
    discount: '0',
    taxRate: '0',
    shippingHandling: '0',
  });

  useEffect(() => {
    const lastNumber = getLastReceiptNumber();
    setFormData(prev => ({
      ...prev,
      receiptNumber: generateReceiptNumber(lastNumber || undefined),
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReceipt: ReceiptData = {
      id: uuidv4(),
      personName: formData.personName,
      programmeName: formData.programmeName,
      hours: parseFloat(formData.hours) || 0,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      date: formData.date,
      receiptNumber: formData.receiptNumber,
      discount: parseFloat(formData.discount) || 0,
      taxRate: parseFloat(formData.taxRate) || 0,
      shippingHandling: parseFloat(formData.shippingHandling) || 0,
      createdAt: Date.now(),
    };
    
    saveReceipt(newReceipt);
    setReceiptId(newReceipt.id);
    setShowPreview(true);
  };

  const handleCopyLink = () => {
    if (receiptId) {
      const url = `${window.location.origin}/receipt/${receiptId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const receiptData: ReceiptData | null = showPreview && receiptId ? {
    id: receiptId,
    personName: formData.personName,
    programmeName: formData.programmeName,
    hours: parseFloat(formData.hours) || 0,
    unitPrice: parseFloat(formData.unitPrice) || 0,
    date: formData.date,
    receiptNumber: formData.receiptNumber,
    discount: parseFloat(formData.discount) || 0,
    taxRate: parseFloat(formData.taxRate) || 0,
    shippingHandling: parseFloat(formData.shippingHandling) || 0,
    createdAt: Date.now(),
  } : null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Create New Receipt
      </h2>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Person Name *
              </label>
              <input
                type="text"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme Name *
              </label>
              <input
                type="text"
                name="programmeName"
                value={formData.programmeName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Intro To AI Workshop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours *
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                required
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (S$) *
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 150.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number *
              </label>
              <input
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., T00001-A"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated, but you can override</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping/Handling (S$)
              </label>
              <input
                type="number"
                name="shippingHandling"
                value={formData.shippingHandling}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              <Eye className="w-5 h-5" />
              Generate Receipt
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Receipt Generated Successfully!</p>
              <p className="text-sm text-green-600">Receipt #{formData.receiptNumber}</p>
            </div>
          </div>

          {receiptData && <ReceiptPreview receipt={receiptData} />}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            
            <button
              onClick={() => {
                setShowPreview(false);
                setReceiptId(null);
                setFormData({
                  personName: '',
                  programmeName: '',
                  hours: '',
                  unitPrice: '',
                  date: format(new Date(), 'yyyy-MM-dd'),
                  receiptNumber: generateReceiptNumber(formData.receiptNumber),
                  discount: '0',
                  taxRate: '0',
                  shippingHandling: '0',
                });
              }}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
