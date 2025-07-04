import bcrypt from 'bcryptjs';
import { Users } from '../models/index.js';

export default class AuthService {
  /** returns { user, token } or throws Error */
  static async login({ email, password }) {
    const user = await Users.findOne({ where: { email, isActive: true } });
    if (!user) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    // strip sensitive fields
    const plainUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId
    };

    // create JWT
    const { signToken } = await import('../middleware/auth.js');
    const token = signToken(plainUser);

    return { user: plainUser, token };
  }
}
