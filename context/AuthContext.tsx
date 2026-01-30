
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, ProgressPhoto } from '../types';
import * as api from '../services/mockApi';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (userId: number) => Promise<void>;
  addProgressPhoto: (userId: number, photo: Omit<ProgressPhoto, 'id'>) => Promise<void>;
  deleteProgressPhoto: (userId: number, photoId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // On initial load, fetch all users for the admin panel
    const loadUsers = async () => {
      const allUsers = await api.getUsers();
      setUsers(allUsers);
    };
    loadUsers();
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    const user = await api.authenticate(username, password);
    if (user) {
      setCurrentUser(user);
    }
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const newUser = await api.addStudent(userData);
    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  };

  const updateUser = async (userData: User): Promise<User> => {
    const updatedUser = await api.updateStudent(userData);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    // If the currently logged in user is updated, update their state as well
    if(currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    return updatedUser;
  };

  const deleteUser = async (userId: number): Promise<void> => {
    await api.deleteStudent(userId);
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  };
  
  const addProgressPhoto = async (userId: number, photo: Omit<ProgressPhoto, 'id'>): Promise<void> => {
    const updatedUser = await api.addProgressPhoto(userId, photo);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteProgressPhoto = async (userId: number, photoId: string): Promise<void> => {
    const updatedUser = await api.deleteProgressPhoto(userId, photoId);
     setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, addUser, updateUser, deleteUser, addProgressPhoto, deleteProgressPhoto }}>
      {children}
    </AuthContext.Provider>
  );
};
