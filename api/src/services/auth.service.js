import bcrypt    from 'bcryptjs';
import { Users, RefreshTokens } from '../models/index.js';
import { signToken } from '../middleware/auth.js';

const ACCESS_EXP  = process.env.JWT_EXPIRES || '15m'; // más corto
const REFRESH_EXP = '7d';
const SALT        = 10;

export default class AuthService {

  static async issueTokens(user) {
    const payload = { id: user.id, fullName: user.fullName, email: user.email, roleId: user.roleId };

    /* 1) access */
    const accessToken = signToken(payload, ACCESS_EXP);

    /* 2) refresh */
    const plainRefresh = crypto.randomUUID();                  // uuid v4
    const tokenHash    = await bcrypt.hash(plainRefresh, SALT);
    const expiresAt    = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshTokens.create({ userId: user.id, tokenHash, expiresAt });

    return { accessToken, refreshToken: plainRefresh };
  }

  static async login({ email, password }) {
    const user = await Users.findOne({ where: { email, isActive: true } });
    if (!user) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    return this.issueTokens(user);
  }

  static async refresh(userId, refreshToken) {
    const rows = await RefreshTokens.findAll({ where: { userId } });
    // Check any valid stored hash
    let matchedRow = null;
    for (const row of rows) {
      const ok = await bcrypt.compare(refreshToken, row.tokenHash);
      if (ok && row.expiresAt > new Date()) { matchedRow = row; break; }
    }
    if (!matchedRow) throw new Error('Invalid refresh token');

    // Rotation: delete old and issue new
    await matchedRow.destroy();
    const user = await Users.findByPk(userId);
    return this.issueTokens(user);
  }
}
