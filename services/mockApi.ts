
import { Role, User, DietPlan, WorkoutPlan, ProgressPhoto } from '../types';

const LOCAL_STORAGE_KEY = 'k-fitness-users';

const initialUsers: User[] = [
    {
        id: 1,
        username: 'admin',
        password: '123',
        role: Role.Admin,
        fullName: 'Admin K-Fitness',
        expirationDate: '2099-12-31',
        workoutPlan: {} as WorkoutPlan,
        dietPlan: {} as DietPlan,
        progressPhotos: [],
    },
    {
        id: 2,
        username: 'joao',
        password: '123',
        role: Role.Student,
        fullName: 'João da Silva',
        expirationDate: '2025-12-31',
        workoutPlan: {
            monday: 'Peito e Tríceps\n- Supino Reto: 4x10\n- Crucifixo: 3x12\n- Tríceps Testa: 4x10',
            tuesday: 'Costas e Bíceps\n- Barra Fixa: 3x Máx\n- Remada Curvada: 4x10\n- Rosca Direta: 4x12',
            wednesday: 'Descanso',
            thursday: 'Pernas\n- Agachamento: 5x5\n- Leg Press: 4x12\n- Cadeira Extensora: 3x15',
            friday: 'Ombros e Trapézio\n- Desenvolvimento Militar: 4x10\n- Elevação Lateral: 3x15\n- Encolhimento: 4x12',
            saturday: 'Cardio\n- 45 minutos de corrida leve',
        },
        dietPlan: {
            monday: {
                breakfast: 'Ovos mexidos com aveia',
                lunch: 'Frango grelhado com batata doce e salada',
                snack: 'Iogurte com frutas',
                dinner: 'Salmão com brócolis',
            },
            tuesday: {
                breakfast: 'Vitamina de banana com whey',
                lunch: 'Carne vermelha com arroz integral e feijão',
                snack: 'Castanhas',
                dinner: 'Sopa de legumes',
            },
            wednesday: {
                breakfast: 'Pão integral com queijo branco',
                lunch: 'Omelete com salada',
                snack: 'Fruta',
                dinner: 'Frango desfiado com mandioca',
            },
            thursday: {
                breakfast: 'Ovos mexidos com aveia',
                lunch: 'Frango grelhado com batata doce e salada',
                snack: 'Iogurte com frutas',
                dinner: 'Salmão com brócolis',
            },
            friday: {
                breakfast: 'Vitamina de banana com whey',
                lunch: 'Carne vermelha com arroz integral e feijão',
                snack: 'Castanhas',
                dinner: 'Sopa de legumes',
            },
            saturday: {
                breakfast: 'Pão integral com queijo branco',
                lunch: 'Omelete com salada',
                snack: 'Fruta',
                dinner: 'Frango desfiado com mandioca',
            },
        },
        progressPhotos: [],
    },
    {
        id: 3,
        username: 'maria',
        password: '123',
        role: Role.Student,
        fullName: 'Maria Souza',
        expirationDate: '2023-01-01', // Expired user
        workoutPlan: {
            monday: 'Treino A',
            tuesday: 'Treino B',
            wednesday: 'Descanso',
            thursday: 'Treino C',
            friday: 'Treino D',
            saturday: 'Cardio',
        },
        dietPlan: {
            monday: { breakfast: 'Café', lunch: 'Almoço', snack: 'Lanche', dinner: 'Jantar' },
            tuesday: { breakfast: 'Café', lunch: 'Almoço', snack: 'Lanche', dinner: 'Jantar' },
            wednesday: { breakfast: 'Café', lunch: 'Almoço', snack: 'Lanche', dinner: 'Jantar' },
            thursday: { breakfast: 'Café', lunch: 'Almoço', snack: 'Lanche', dinner: 'Jantar' },
            friday: { breakfast: 'Café', lunch: 'Almoço', snack: 'Lanche', dinner: 'Jantar' },
            saturday: { breakfast: 'Café', lunch: 'Almoço', snack: 'Lanche', dinner: 'Jantar' },
        },
        progressPhotos: [],
    },
];

const loadUsersFromStorage = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers) as User[];
            // Retrofit IDs for backward compatibility
            return parsedUsers.map(user => ({
                ...user,
                progressPhotos: user.progressPhotos ? user.progressPhotos.map((p, index) => ({
                    ...p,
                    id: p.id || `${user.id}-${new Date(p.date).getTime()}-${index}`
                })) : [],
            }));
        }
    } catch (error) {
        console.error("Error loading users from local storage", error);
    }
    // If nothing in storage or error, save and return initial users
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

let users: User[] = loadUsersFromStorage();
let nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

const persistUsers = () => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Error saving users to local storage", error);
    }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getUsers = async (): Promise<User[]> => {
    await delay(100);
    return JSON.parse(JSON.stringify(users));
};

export const authenticate = async (username: string, password: string): Promise<User | null> => {
    await delay(500);
    const user = users.find(u => u.username === username && u.password === password);
    return user ? { ...user } : null;
};

export const getNewStudentTemplate = (): User => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    const expirationDate = today.toISOString().split('T')[0];

    return {
        id: 0,
        username: '',
        password: '',
        role: Role.Student,
        fullName: '',
        expirationDate: expirationDate,
        workoutPlan: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '' },
        dietPlan: {
            monday: { breakfast: '', lunch: '', snack: '', dinner: '' },
            tuesday: { breakfast: '', lunch: '', snack: '', dinner: '' },
            wednesday: { breakfast: '', lunch: '', snack: '', dinner: '' },
            thursday: { breakfast: '', lunch: '', snack: '', dinner: '' },
            friday: { breakfast: '', lunch: '', snack: '', dinner: '' },
            saturday: { breakfast: '', lunch: '', snack: '', dinner: '' },
        },
        progressPhotos: [],
    };
};

export const addStudent = async (userData: Omit<User, 'id'|'password'> & {password:string}): Promise<User> => {
    await delay(300);
    const newUser: User = { ...userData, id: nextId++, progressPhotos: [] };
    users.push(newUser);
    persistUsers();
    return { ...newUser };
};

export const updateStudent = async (userData: User): Promise<User> => {
    await delay(300);
    const index = users.findIndex(u => u.id === userData.id);
    if (index !== -1) {
        const existingUser = users[index];
        
        // Merge existing data with new data
        const updatedUser = { ...existingUser, ...userData };

        // preserve password if not provided in the update form
        if (!userData.password) {
            updatedUser.password = existingUser.password;
        }
        
        users[index] = updatedUser;
        persistUsers();
        return { ...updatedUser };
    }
    throw new Error('User not found');
};

export const deleteStudent = async (userId: number): Promise<void> => {
    await delay(300);
    users = users.filter(u => u.id !== userId);
    persistUsers();
};

export const addProgressPhoto = async (userId: number, photoData: Omit<ProgressPhoto, 'id'>): Promise<User> => {
    await delay(300);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        if (!users[index].progressPhotos) {
            users[index].progressPhotos = [];
        }
        const newPhoto: ProgressPhoto = {
            ...photoData,
            id: Date.now().toString()
        };
        users[index].progressPhotos.push(newPhoto);
        persistUsers();
        return { ...users[index] };
    }
    throw new Error('User not found');
};

export const deleteProgressPhoto = async (userId: number, photoId: string): Promise<User> => {
    await delay(300);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const user = users[userIndex];
        user.progressPhotos = user.progressPhotos.filter(p => p.id !== photoId);
        persistUsers();
        return { ...user };
    }
    throw new Error('User not found');
};
