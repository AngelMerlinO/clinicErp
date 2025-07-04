import { Router } from 'express';
import generate from './generator.js';          // ← crea este archivo también

import UsersService        from '../services/users.service.js';
import RolesService        from '../services/roles.service.js';
import PermissionsService  from '../services/permissions.service.js';
import CostCentersService  from '../services/cost_centers.service.js';
import SalesOrdersService  from '../services/sales_orders.service.js';
import ProjectionsService  from '../services/projections.service.js';

const api = Router();

[
  generate('/users',        UsersService),
  generate('/roles',        RolesService),
  generate('/permissions',  PermissionsService),
  generate('/cost-centers', CostCentersService),
  generate('/sales-orders', SalesOrdersService),
  generate('/projections',  ProjectionsService)
].forEach(({ path, router }) => api.use(path, router));

export default api;
