estructura del proyecto :
CLINIC_ERP/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Imágenes, íconos, fuentes, etc.
│   ├── components/          # Componentes reutilizables (botones, inputs, etc.)
│   ├── features/            # Módulos o funcionalidades independientes
│   │   ├── patients/        # Ej: gestión de pacientes
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── index.jsx
│   │   └── dashboard/       # Otro feature
│   ├── hooks/               # Custom hooks reutilizables globales
│   ├── layouts/             # Layouts generales (AuthLayout, AdminLayout, etc.)
│   ├── pages/               # Páginas principales (solo para ruteo)
│   ├── routes/              # Definición de rutas y navegación
│   ├── services/            # Conexiones a APIs o lógica de negocio general
│   ├── store/               # Global state manager (Redux, Zustand, Context)
│   ├── utils/               # Funciones utilitarias compartidas
│   ├── constants/           # Constantes, enums, configuraciones fijas
│   ├── styles/              # Archivos CSS o Tailwind config
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── eslint.config.js
# clinicErp


npm install          # instala dependencias
npm run dev          # vite + nodemon (frontend y backend)
npm run dev:fe       # solo vite (frontend)
npm run dev:be       # solo nodemon (backend)
npm run build        # build de producción (frontend)
npm run preview      # sirve el build generado
npm run migrate      # ejecuta las migraciones de Sequelize
npm run seed         # ejecuta los seeders de Sequelize
npm run lint         # eslint en todo el proyecto
