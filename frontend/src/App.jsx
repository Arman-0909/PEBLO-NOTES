import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotesList from './pages/NotesList';
import NoteEditor from './pages/NoteEditor';
import PublicNote from './pages/PublicNote';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-['Nunito'] selection:bg-amber-200 selection:text-amber-900">
        <Navbar />
        <main className="flex-1 container mx-auto p-4 md:p-8 max-w-5xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/share/:shareId" element={<PublicNote />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/notes" 
              element={
                <ProtectedRoute>
                  <NotesList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/notes/new" 
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/notes/:id" 
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
