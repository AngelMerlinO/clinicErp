import React from 'react';

const LoginPage = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('token', 'fake-token');
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-50 overflow-y-auto">
      {/* Columna izquierda: formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logotipo */}
          <div className="flex justify-center mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png"
              alt="Logo Clínica RX"
              className="h-14 w-auto"
            />
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Iniciar sesión
          </h2>
          <p className="text-gray-600 mb-8 text-base text-center">
            Accede al sistema de control de rayos X
          </p>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-gray-300 px-5 py-3 text-base focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full rounded-md border border-gray-300 px-5 py-3 text-base focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2">Recordarme</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 text-base transition"
            >
              Entrar
            </button>
          </form>

          <p className="mt-10 text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Clínica Rayos X. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Columna derecha: imagen */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://www.simeonmedical.com/fileadmin/user_upload/210303_Luxemburg_Zitha_Klinik.jpg"
          alt="Imagen clínica"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
