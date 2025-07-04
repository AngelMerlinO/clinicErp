// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Pacientes', href: '/pacientes', icon: UsersIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  { name: 'Ajustes', href: '/ajustes', icon: Cog6ToothIcon },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Mantener dark mode en localStorage
  useEffect(() => {
    const stored = localStorage.getItem('darkMode') === 'true';
    setDarkMode(stored);
    document.documentElement.classList.toggle('dark', stored);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200`}>
      {/* SIDEBAR */}
      <aside
        className={`flex flex-col justify-between bg-white dark:bg-gray-900 shadow-lg
          ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}
      >
        {/* Logo + Collapse */}
        <div>
          <div className="flex items-center justify-between p-4">
            {!collapsed && (
              <span className="text-2xl font-bold text-sky-600">
                Clínica <span className="text-indigo-600">RX</span>
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
          {/* Nav Links */}
          <nav className="mt-6">
            {navItems.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition
                  ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-6 w-6 text-sky-600" />
                {!collapsed && <span className="font-medium">{name}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* Toggles + Footer */}
        <div className="mb-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className={`flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition
              ${collapsed ? 'justify-center' : ''}`}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-indigo-500" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-500" />
            )}
            {!collapsed && <span className="font-medium">Modo {darkMode ? 'Claro' : 'Oscuro'}</span>}
          </button>

          {/* Brand / Copyright */}
          {!collapsed && (
            <p className="mt-6 px-4 text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Clínica RX
            </p>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="hidden lg:flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm px-6 py-4">
          <h1 className="text-xl font-semibold">Bienvenido, Admin</h1>
          {/* Podrías añadir aquí perfil, notificaciones, etc. */}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
