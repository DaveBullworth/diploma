const { UM, Position, Record, ExtractRecord } = require("../models/models")
const ApiError = require('../error/apiError')

class UMController {
    async create(req, res, next) {
        let token = '';
        if(req.token) token = req.token;
        try{
            const {name} = req.body
            const um = await UM.create({name})
            return res.json({um, token})
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить ед.изм.)'))
        }
        try {
            const um = await UM.findOne({
                where:{id},
                include: [
                    {
                        model: Position,
                        as: 'positions',
                        attributes: ['id'] 
                    },
                    {
                        model: Record,
                        as: 'records',
                        attributes: ['id'] 
                    },
                    {
                        model: ExtractRecord,
                        as: 'extractRecords',
                        attributes: ['id'] 
                    }
                ]
            })
            if(!category){"Unit not found!"}
            return res.json(category)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        try{
            const um = await UM.findAll()
            return res.json(um)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить ед.изм.)'))
        }
        let token = '';
        if(req.token) token = req.token;
        try {
            const um = await UM.findByPk(id);
            if (!um) {
                throw ApiError.badRequest("Unit not found!");
            }
            await um.destroy();
            return res.json({ message: 'Unit deleted successfully!', token });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить ед.изм.)'))
        }
        let token = '';
        if(req.token) token = req.token;
        let {name} = req.body;
        try {
            const um = await UM.findByPk(id);
            if (!um) {
                throw ApiError.badRequest("Unit Not Found!");
            }
            if (name) {
                um.name = name;
            }
            await um.save();
            return res.json({um, token})
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new UMController()