import React, { useEffect, useState } from 'react';
import FullscreenLoader from '../../../components/ui/FullscreenLoader';
import { login } from '../../../services/auth';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setUsuario(remembered);
      setRecordar(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const { user, accessToken, refreshToken } = await login({ email: usuario, password });
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      if (recordar) localStorage.setItem('rememberedEmail', usuario);
      else localStorage.removeItem('rememberedEmail');
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <span className="text-6xl font-extrabold text-sky-600">
                Clínica <span className="text-indigo-600">RX</span>
              </span>
            </motion.div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 text-base text-center">
              Accede al sistema de control de rayos X
            </p>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="mb-4 text-sm text-red-600 dark:text-red-400 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-base font-medium mb-1">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-5 py-3 text-base focus:border-sky-600 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-5 py-3 text-base focus:border-sky-600 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={recordar}
                    onChange={(e) => setRecordar(e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-2">Recordarme</span>
                </label>
                <a href="#" className="text-sky-600 hover:text-sky-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md py-3 text-base transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-right-to-bracket fa-beat-fade"></i>
                Entrar
              </button>
            </form>

            <p className="mt-10 text-sm text-gray-400 dark:text-gray-500 text-center">
              © {new Date().getFullYear()} Clínica RX
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="hidden lg:block lg:w-1/2"
        >
          <img
            src="https://www.simeonmedical.com/fileadmin/user_upload/210303_Luxemburg_Zitha_Klinik.jpg"
            alt="Imagen clínica"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <FullscreenLoader show={loading} />
    </>
  );
};

export default LoginPage;
