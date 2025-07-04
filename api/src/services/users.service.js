// api/src/services/users.service.js
import BaseService from './base.service.js';
import { Users }   from '../models/index.js';   // ←  Asegúrate de que sea Users

class UsersService extends BaseService {
  constructor() {
    super(Users);                                // ←  Usa Users, no Roles
  }

  async create(data, opts)  { return super.create(data, opts); }
  async findAll(opts)       { return super.findAll(opts);      }
  async findById(id, opts)  { return super.findById(id, opts); }
  async update(id,d,opts)   { return super.update(id,d,opts);  }
  async destroy(id, opts)   { return super.destroy(id, opts);  }

  // util extra
  async findByEmail(email, opts={}) {
    return this.model.findOne({ where: { email }, ...opts });
  }
}

export default new UsersService();
