// src/components/admin/AdminPanel.tsx
'use client';

import { useState } from 'react';
import UserManagement from './UserManagement';
import RegisterUserForm from './RegisterUserForm';
import DemoModeControl from './DemoModeControl';

type Tab = 'users' | 'register' | 'demo';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  return (
    <div className="w-full max-w-4xl rounded-xl shadow-lg p-6 sm:p-8 bg-gray-800 text-white mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center border-b border-gray-600 pb-4">Админ-панель</h2>
      
      <div className="flex justify-center border-b border-gray-600 mb-6">
        <button 
          onClick={() => setActiveTab('users')} 
          className={`py-2 px-4 font-semibold ${activeTab === 'users' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
          Управление пользователями
        </button>
        <button 
          onClick={() => setActiveTab('register')} 
          className={`py-2 px-4 font-semibold ${activeTab === 'register' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
          Регистрация
        </button>
        <button 
          onClick={() => setActiveTab('demo')} 
          className={`py-2 px-4 font-semibold ${activeTab === 'demo' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>
          Демо-режим
        </button>
      </div>

      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'register' && <RegisterUserForm />}
        {activeTab === 'demo' && <DemoModeControl />}
      </div>
    </div>
  );
}
