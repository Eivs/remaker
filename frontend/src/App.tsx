import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ErrorNotification from './components/ErrorNotification';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Login from './pages/Login';
import PublicArticles from './pages/PublicArticles';
import Register from './pages/Register';

const AppContent = () => {
  const { error, clearError } = useAuth();

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route path="/public" element={<PublicArticles />} />
        </Routes>
      </Layout>
      <ErrorNotification message={error} onClose={clearError} />
    </>
  );
};

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
