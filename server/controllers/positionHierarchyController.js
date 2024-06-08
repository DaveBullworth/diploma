const { PositionHierarchy } = require("../models/models");
const ApiError = require('../error/ApiError');

class PositionHierarchyController {
    async create(req, res, next) {
        try {
            const { parentId, childId } = req.body;
            const hierarchy = await PositionHierarchy.create({ parentId, childId });
            return res.json(hierarchy);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить иерархию позиций)'));
        }
        try {
            const hierarchy = await PositionHierarchy.findByPk(id);
            if (!hierarchy) {
                throw ApiError.notFound("Hierarchy not found!");
            }
            return res.json(hierarchy);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const { parentId } = req.query; // Получаем parentId из параметров запроса
            let hierarchies;
            if (parentId) {
                hierarchies = await PositionHierarchy.findAll({ where: { parentId } });
            } else {
                hierarchies = await PositionHierarchy.findAll();
            }
            return res.json(hierarchies);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить иерархию позиций)'));
        }
        try {
            const hierarchy = await PositionHierarchy.findByPk(id);
            if (!hierarchy) {
                throw ApiError.notFound("Hierarchy not found!");
            }
            await hierarchy.destroy();
            return res.json({ message: 'Hierarchy deleted successfully!' });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить иерархию позиций)'));
        }
        let { parentId, childId } = req.body;
        try {
            const hierarchy = await PositionHierarchy.findByPk(id);
            if (!hierarchy) {
                throw ApiError.notFound("Hierarchy not found!");
            }
            if (parentId) {
                hierarchy.parentId = parentId;
            }
            if (childId) {
                hierarchy.childId = childId;
            }
            await hierarchy.save();
            return res.json(hierarchy);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new PositionHierarchyController();