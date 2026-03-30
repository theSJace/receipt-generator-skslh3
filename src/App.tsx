import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Receipt, History, PlusCircle } from 'lucide-react';
import CreateReceipt from './pages/CreateReceipt';
import ReceiptHistory from './pages/ReceiptHistory';
import ShareableReceipt from './pages/ShareableReceipt';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-primary text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                <h1 className="text-xl font-bold">Receipt Generator</h1>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </Link>
                <Link
                  to="/history"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<CreateReceipt />} />
            <Route path="/history" element={<ReceiptHistory />} />
            <Route path="/receipt/:id" element={<ShareableReceipt />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
