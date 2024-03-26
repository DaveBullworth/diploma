const { Extract, ExtractRecord, User } = require("../models/models")
const { Op } = require('sequelize');
const ApiError = require('../error/apiError')

class ExtractController {
    async create(req, res, next) {
        try{
            const userId = req.body.userId
            const date = req.body.date;
            const extract = await Extract.create({date, userId})
            return res.json(extract)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить выписку)'));
        }
        try {
            const extract = await Extract.findOne({
                where: { id },
                include: [{
                    model: ExtractRecord,
                    as: 'extractRecords'
                }, {
                    model: User, // Предположим, что вы импортировали модель User из вашего приложения
                    attributes: ['login'], // Указываем атрибуты, которые хотим получить из таблицы User
                    required: true // Добавляем этот параметр, чтобы гарантировать, что будет выполнено соединение INNER JOIN
                }]
            });
            if (!extract) {
                return next(ApiError.notFound("Extract not found!"));
            }
            return res.json(extract);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    

    async getAll(req, res, next) {
        let { limit, page, date, usersId, id } = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit;
        try{
            let whereClause = {};
            if (date) {
                // Если передан объект date, добавляем фильтр для полей dateA и dateB
                const { dateA, dateB } = JSON.parse(date);
                whereClause.date = { [Op.between]: [dateA, dateB] };
            }
            if (usersId) {
                usersId = JSON.parse(usersId);
                if( Array.isArray(usersId.usersId) && usersId.usersId.length > 0) {
                    whereClause.userId = { [Op.in]: usersId.usersId };
                }
            }
            if (id) {
                id = JSON.parse(id);
                whereClause.id = { [Op.in]: id.id };
            }
            const extract = await Extract.findAndCountAll({
                include: [{
                    model: ExtractRecord,
                    as: 'extractRecords'
                }, {
                    model: User, // Предположим, что вы импортировали модель User из вашего приложения
                    attributes: ['login'], // Указываем атрибуты, которые хотим получить из таблицы User
                    required: true // Добавляем этот параметр, чтобы гарантировать, что будет выполнено соединение INNER JOIN
                }],
                where: whereClause,
                limit, offset
            })
            return res.json(extract)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить выписку)'))
        }
        try {
            const extract = await Extract.findByPk(id);
            if (!extract) {
                throw ApiError.badRequest("Extract not found!");
            }
            await extract.destroy();
            return res.json({ message: 'Extract deleted successfully!' });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить выписку)'))
        }
        let {date, userId} = req.body;
        try {
            const extract = await Extract.findByPk(id);
            if (!extract) {
                throw ApiError.badRequest("Extract Not Found!");
            }
            if (date) {
                extract.date = date;
            }
            if (userId) {
                extract.userId = userId;
            }
            await extract.save();
            return res.json(extract);
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new ExtractController()