import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Search, Calendar, Eye, Link as LinkIcon, Download, Trash2, FileText } from 'lucide-react';
import { getAllReceipts, deleteReceipt } from '../utils/storage';
import { calculateReceiptTotals } from '../types/receipt';

export default function ReceiptHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [dateFilter, setDateFilter] = useState('');
  const [receipts, setReceipts] = useState(getAllReceipts());

  const filteredReceipts = useMemo(() => {
    let filtered = receipts;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.personName.toLowerCase().includes(term) ||
        r.programmeName.toLowerCase().includes(term) ||
        r.receiptNumber.toLowerCase().includes(term)
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(r => r.date === dateFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc': {
          const totalA = calculateReceiptTotals(a).total;
          const totalB = calculateReceiptTotals(b).total;
          return totalB - totalA;
        }
        case 'amount-asc': {
          const totalA = calculateReceiptTotals(a).total;
          const totalB = calculateReceiptTotals(b).total;
          return totalA - totalB;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [receipts, searchTerm, sortBy, dateFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      deleteReceipt(id);
      setReceipts(getAllReceipts());
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/receipt/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Receipt History
      </h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, programme, or receipt #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: Highest First</option>
            <option value="amount-asc">Amount: Lowest First</option>
          </select>
        </div>

        {(searchTerm || dateFilter) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredReceipts.length} of {receipts.length} receipts
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setDateFilter('');
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {filteredReceipts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Receipt #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Person</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Programme</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReceipts.map((receipt) => {
                  const total = calculateReceiptTotals(receipt).total;
                  return (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {receipt.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {receipt.personName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {receipt.programmeName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        S${total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {format(parseISO(receipt.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/receipt/${receipt.id}`}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleCopyLink(receipt.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy Link"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleDownload}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(receipt.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
          <p className="text-gray-600 mb-4">
            {receipts.length === 0 
              ? "You haven't created any receipts yet." 
              : "No receipts match your filters."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Your First Receipt
          </Link>
        </div>
      )}
    </div>
  );
}
