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
  }
};
