
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import { Role, User, WeekDay, MealTime, WEEK_DAYS, MEAL_TIMES } from '../types';
import * as api from '../services/mockApi';

const AdminDashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (!authContext || !authContext.currentUser) return null;
    
    const { currentUser, users, addUser, updateUser, deleteUser } = authContext;
    const students = users.filter(u => u.role === Role.Student);

    const openModal = (student: User | null = null) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handleSave = async (studentData: User) => {
        if (studentData.id === 0) { // New student
            const { id, ...newStudentData } = studentData;
            await addUser(newStudentData);
        } else {
            await updateUser(studentData);
        }
        closeModal();
    };
    
    const handleDelete = async (studentId: number) => {
        if(window.confirm('Tem certeza que deseja apagar este aluno?')) {
            await deleteUser(studentId);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header user={currentUser} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel do Administrador</h1>
                        <button onClick={() => openModal()} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Adicionar Aluno</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students.map(student => (
                                <li key={student.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-sky-600 truncate">{student.fullName}</div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <button onClick={() => openModal(student)} className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">Editar</button>
                                            <button onClick={() => handleDelete(student.id)} className="ml-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">Apagar</button>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                Usuário: {student.username}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                                                Expira em: {new Date(student.expirationDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
            {isModalOpen && <StudentFormModal student={selectedStudent} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

const StudentFormModal: React.FC<{ student: User | null, onSave: (student: User) => void, onClose: () => void }> = ({ student, onSave, onClose }) => {
    const [formData, setFormData] = useState<User>(student || api.getNewStudentTemplate());
    
    const dayTranslations: Record<WeekDay, string> = {
        monday: 'Segunda',
        tuesday: 'Terça',
        wednesday: 'Quarta',
        thursday: 'Quinta',
        friday: 'Sexta',
        saturday: 'Sábado',
    };

    const mealTranslations: Record<MealTime, string> = {
        breakfast: 'Café da Manhã',
        lunch: 'Almoço',
        snack: 'Lanche da Tarde',
        dinner: 'Jantar',
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleWorkoutChange = (day: WeekDay, value: string) => {
        setFormData(prev => ({ ...prev, workoutPlan: { ...prev.workoutPlan, [day]: value } }));
    };

    const handleDietChange = (day: WeekDay, meal: MealTime, value: string) => {
        setFormData(prev => ({
            ...prev,
            dietPlan: {
                ...prev.dietPlan,
                [day]: { ...prev.dietPlan[day], [meal]: value }
            }
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{student ? 'Editar Aluno' : 'Adicionar Aluno'}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nome Completo" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Usuário" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                            <input type="password" name="password" onChange={handleInputChange} placeholder="Nova Senha (deixe em branco para não alterar)" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleInputChange} placeholder="Data de Expiração" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        
                        <h3 className="text-xl font-semibold mt-6 mb-2">Plano de Treino</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {WEEK_DAYS.map(day => (
                                <div key={day}>
                                    <label className="font-medium">{dayTranslations[day]}</label>
                                    <textarea value={formData.workoutPlan[day]} onChange={e => handleWorkoutChange(day, e.target.value)} className="w-full p-2 border rounded h-24 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            ))}
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-2">Plano de Dieta</h3>
                        {WEEK_DAYS.map(day => (
                            <div key={day} className="mb-4 p-4 border rounded dark:border-gray-600">
                                <h4 className="font-medium mb-2">{dayTranslations[day]}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MEAL_TIMES.map(meal => (
                                    <div key={meal}>
                                        <label className="text-sm">{mealTranslations[meal]}</label>
                                        <textarea value={formData.dietPlan[day][meal]} onChange={e => handleDietChange(day, meal, e.target.value)} className="w-full p-2 border rounded h-20 dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default AdminDashboard;
