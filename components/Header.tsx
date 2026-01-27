
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types';

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const authContext = useContext(AuthContext);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M15.3 5.3a10 10 0 0 0-9.2 12.3"/><path d="M8.7 18.7a10 10 0 0 0 9.2-12.3"/></svg>
            <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">K-Fitness</span>
          </div>
          <div className="flex items-center">
             <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">Bem-vindo, {user.fullName}</span>
            <button
              onClick={authContext?.logout}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-800"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
