import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FileShare from './components/FileShare';
import CodeCollabRoom from './components/CodeCollabRoom';
import NetworkStatus from './components/NetworkStatus';

export default function App() {
  return (
    <BrowserRouter>
      <NetworkStatus />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:id" element={<FileShare />} />
        <Route path="/code/:id" element={<CodeCollabRoom />} />
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-primary-400 mb-4">404</h1>
                <p className="text-slate-400 mb-6">Page not found</p>
                <a href="/" className="btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
