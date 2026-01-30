
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import { WeekDay, WEEK_DAYS } from '../types';

const StudentDashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<WeekDay>(WEEK_DAYS[0]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    if (!authContext || !authContext.currentUser) return null;
    
    const { currentUser, addProgressPhoto, deleteProgressPhoto } = authContext;

    const isExpired = new Date(currentUser.expirationDate) < new Date();

    const dayTranslations: Record<WeekDay, string> = {
        monday: 'Segunda',
        tuesday: 'Terça',
        wednesday: 'Quarta',
        thursday: 'Quinta',
        friday: 'Sexta',
        saturday: 'Sábado',
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handlePhotoUpload = async () => {
        if (!selectedFile || !addProgressPhoto) return;
        setUploading(true);
        try {
            const imageDataUrl = await fileToBase64(selectedFile);
            const newPhoto = {
                date: new Date().toISOString(),
                imageDataUrl,
            };
            await addProgressPhoto(currentUser.id, newPhoto);
            setSelectedFile(null);
            const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
            if(fileInput) fileInput.value = '';

        } catch (error) {
            console.error("Erro ao enviar foto:", error);
            // You might want to show an error message to the user
        } finally {
            setUploading(false);
        }
    };
    
    const handleDeletePhoto = async (photoId: string) => {
        if (deleteProgressPhoto && window.confirm('Tem certeza que deseja apagar esta foto?')) {
            await deleteProgressPhoto(currentUser.id, photoId);
        }
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

                     {/* Progress Photos Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Minha Evolução</h2>
                        <div className="mb-4">
                            <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enviar nova foto:</label>
                            <input 
                                id="photo-upload"
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 dark:text-gray-400 dark:file:bg-pink-900/20 dark:file:text-pink-300 dark:hover:file:bg-pink-900/30"
                            />
                        </div>
                        {selectedFile && (
                            <div className="flex items-center space-x-4 mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-300">Arquivo: {selectedFile.name}</p>
                                <button
                                    onClick={handlePhotoUpload}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-400"
                                >
                                    {uploading ? 'Enviando...' : 'Enviar Foto'}
                                </button>
                            </div>
                        )}
                        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">Fotos Enviadas</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {currentUser.progressPhotos && currentUser.progressPhotos.length > 0 ? (
                                currentUser.progressPhotos.slice().reverse().map((photo) => (
                                    <div key={photo.id} className="relative group">
                                        <img src={photo.imageDataUrl} alt={`Evolução em ${new Date(photo.date).toLocaleDateString()}`} className="w-full h-auto rounded-lg object-cover aspect-square"/>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center p-1 rounded-b-lg">
                                            {new Date(photo.date).toLocaleDateString('pt-BR')}
                                        </div>
                                        <button
                                            onClick={() => handleDeletePhoto(photo.id)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                            aria-label="Apagar foto"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 col-span-full">Nenhuma foto enviada ainda.</p>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
