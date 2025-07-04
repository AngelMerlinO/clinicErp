// api/src/controllers/crud.controller.js
/**
 * Genera un conjunto de handlers CRUD a partir de un servicio.
 * @param {BaseService} service
 * @returns {{ create: Function, getAll: Function, getOne: Function, update: Function, remove: Function }}
 */
export default (service) => ({
  /* POST / */
  create: async (req, res, next) => {
    try {
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  /* GET / */
  getAll: async (req, res, next) => {
    try {
      const items = await service.findAll();
      res.json(items);
    } catch (err) {
      next(err);
    }
  },

  /* GET /:id */
  getOne: async (req, res, next) => {
    try {
      const item = await service.findById(req.params.id);
      if (!item) return res.sendStatus(404);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  /* PUT /:id */
  update: async (req, res, next) => {
    try {
      const item = await service.update(req.params.id, req.body);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  /* DELETE /:id */
  remove: async (req, res, next) => {
    try {
      await service.destroy(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
});
