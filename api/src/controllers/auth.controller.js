import AuthService from '../services/auth.service.js';

export default {
  /** POST /api/auth/login */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'email & password required' });
      }

      const { user, token } = await AuthService.login({ email, password });
      res.json({ user, token });
    } catch (err) {
      // generic msg to avoid user enumeration
      res.status(401).json({ message: 'Invalid credentials' });
      next(err);
    }
  },
  
  async refresh(req, res, next) {
  try {
    const { userId, refreshToken } = req.body;
    if (!userId || !refreshToken) return res.status(400).json({ message: 'userId & refreshToken required' });

    const tokens = await AuthService.refresh(userId, refreshToken);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
    next(err);
  }
}

};
