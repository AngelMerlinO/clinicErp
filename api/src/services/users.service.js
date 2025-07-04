// api/src/services/users.service.js
import bcrypt   from 'bcryptjs';
import BaseService from './base.service.js';
import { Users }   from '../models/index.js';

const SALT_ROUNDS = 10;

class UsersService extends BaseService {
  constructor() { super(Users); }

  /* ------------- override create ------------- */
  async create(data, opts) {
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
      delete data.password;                      // no persists plain text
    }
    return super.create(data, opts);
  }

  /* ------------- override update (opcional) -- */
  async update(id, data, opts) {
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
      delete data.password;
    }
    return super.update(id, data, opts);
  }

  async findAll(opts)      { return super.findAll(opts); }
  async findById(id, opts) { return super.findById(id, opts); }
  async destroy(id, opts)  { return super.destroy(id, opts); }

  async findByEmail(email, opts = {}) {
    return this.model.findOne({ where: { email }, ...opts });
  }
}

export default new UsersService();
