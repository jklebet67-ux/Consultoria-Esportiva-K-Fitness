
import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import { Role } from './types';

const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { currentUser } = authContext;

  const renderDashboard = () => {
    if (!currentUser) {
      return <LoginPage />;
    }

    if (currentUser.role === Role.Admin) {
      return <AdminDashboard />;
    }

    if (currentUser.role === Role.Student) {
      return <StudentDashboard />;
    }
    
    return <LoginPage />;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {renderDashboard()}
    </div>
  );
};

export default App;
