// src/layouts/AdminLayout.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  HomeIcon,
  ShoppingCartIcon,
  PresentationChartBarIcon,
  UserIcon,
  UserGroupIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_NAV_ITEMS = [
  { name: 'Dashboard',        href: '/dashboard',      icon: HomeIcon,                   resource: 'dashboard' },
  { name: 'Órdenes de venta', href: '/ordenes',        icon: ShoppingCartIcon,           resource: 'sales_orders' },
  { name: 'Proyecciones',     href: '/proyecciones',   icon: PresentationChartBarIcon,   resource: 'projections' },
  { name: 'Usuarios',         href: '/usuarios',       icon: UserGroupIcon,              resource: 'users' },
  { name: 'Roles',            href: '/roles',          icon: UserIcon,                   resource: 'roles' },
  { name: 'Centros de costo', href: '/centros-costos', icon: CubeIcon,                   resource: 'cost_centers' },
  { name: 'Movimientos',      href: '/movimientos',    icon: Bars3Icon,                  resource: 'logs' },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed]     = useState(false);
  const [darkMode, setDarkMode]       = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setCollapsed(mq.matches);
    mq.addEventListener('change', e => setCollapsed(e.matches));

    const storedDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDark);
    document.documentElement.classList.toggle('dark', storedDark);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setPermissions(user.permissions || []);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next);
    document.documentElement.classList.toggle('dark', next);
  };

  const navItems = useMemo(() => {
    return ALL_NAV_ITEMS.filter(item => {
      if (item.resource === 'dashboard') return true;
      return permissions.some(p => p.startsWith(item.resource + ':'));
    });
  }, [permissions]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <motion.aside
        initial={{ width: collapsed ? 64 : 256 }}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col justify-between bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
      >
        <div>
          <motion.div
            className="flex items-center justify-between p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="text-2xl font-bold text-sky-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ClinicX
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              whileTap={{ scale: 0.9 }}
            >
              <Bars3Icon className="h-6 w-6" />
            </motion.button>
          </motion.div>
          <nav className="mt-6">
            {navItems.map(({ name, href, icon: Icon }, i) => (
              <motion.a
                key={name}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${collapsed ? 'justify-center' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.02 }}
              >
                <Icon className="h-6 w-6 text-sky-600" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </nav>
        </div>
        <div className="mb-4">
          <motion.button
            onClick={toggleDark}
            className={`flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${collapsed ? 'justify-center' : ''}`}
            whileHover={{ scale: 1.02 }}
          >
            {darkMode
              ? <SunIcon className="h-6 w-6 text-indigo-500" />
              : <MoonIcon className="h-6 w-6 text-indigo-500" />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {darkMode ? 'Light' : 'Dark'} Mode
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                className="mt-6 px-4 text-xs text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                © {new Date().getFullYear()} ClinicX
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
      <motion.div
        className="flex-1 flex flex-col overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <main className="flex-1 p-6">{children}</main>
      </motion.div>
    </div>
  );
}
