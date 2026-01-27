
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import { WeekDay, WEEK_DAYS } from '../types';

const StudentDashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<WeekDay>(WEEK_DAYS[0]);

    if (!authContext || !authContext.currentUser) return null;
    
    const { currentUser } = authContext;

    const isExpired = new Date(currentUser.expirationDate) < new Date();

    const dayTranslations: Record<WeekDay, string> = {
        monday: 'Segunda',
        tuesday: 'Terça',
        wednesday: 'Quarta',
        thursday: 'Quinta',
        friday: 'Sexta',
        saturday: 'Sábado',
    };
    
    if (isExpired) {
        return (
             <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header user={currentUser} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                   <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-red-500">Acesso Expirado</h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Sua assinatura expirou. Por favor, entre em contato com seu consultor para renovar seu acesso.</p>
                   </div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header user={currentUser} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Seu Plano Semanal</h1>
                    
                    <div className="mb-6">
                        <div className="sm:hidden">
                            <select
                                id="tabs"
                                name="tabs"
                                className="block w-full focus:ring-pink-500 focus:border-pink-500 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value as WeekDay)}
                            >
                                {WEEK_DAYS.map(day => <option key={day} value={day}>{dayTranslations[day]}</option>)}
                            </select>
                        </div>
                        <div className="hidden sm:block">
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {WEEK_DAYS.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => setActiveTab(day)}
                                            className={`${
                                                activeTab === day
                                                ? 'border-pink-500 text-pink-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        >
                                            {dayTranslations[day]}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Workout Plan */}
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Treino do Dia</h2>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentUser.workoutPlan[activeTab]}</p>
                        </div>
                        
                        {/* Diet Plan */}
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dieta do Dia</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-pink-600">Café da Manhã</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentUser.dietPlan[activeTab].breakfast}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-pink-600">Almoço</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentUser.dietPlan[activeTab].lunch}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-pink-600">Lanche da Tarde</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentUser.dietPlan[activeTab].snack}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-pink-600">Jantar</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentUser.dietPlan[activeTab].dinner}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
