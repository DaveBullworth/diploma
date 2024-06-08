const { Op } = require('sequelize');
const {Record, UM} = require('../models/models')
const ApiError = require('../error/ApiError')

class RecordController {
    async create(req, res, next) {
        let token = '';
        if(req.token) token = req.token;
        try{
            const {desc_fact, quantity, umId, quantity_um, provider, date, positionId} = req.body
            const record = await Record.create({desc_fact, quantity, umId, quantity_um, provider, date, positionId})
            return res.json({record, token})
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить запись)'))
        }
        try {
            const record = await Record.findOne({
                where:{id},
                include: [
                    {
                        model: UM,
                        attributes: ['name'],
                        required: true
                    }
                ]
            })
            if(!record){"Position not found!"}
            return res.json(record)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        let { limit, page, positionId, date, filters } = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit;
        try {
            let whereClause = {}; // Создаем объект для фильтрации
            if (positionId) {
                whereClause.positionId = positionId; // Если positionId передан, добавляем его в фильтр
            }
            if (date) {
                // Если передан объект date, добавляем фильтр для полей dateA и dateB
                const { dateA, dateB } = JSON.parse(date);
                whereClause.date = { [Op.between]: [dateA, dateB] };
            }
            // Обработка фильтров из запроса
            if (filters) {
                filters = JSON.parse(filters); // Парсим строку JSON
                for (let key in filters) {
                    if (key === 'umId') {
                        whereClause[key] = { [Op.eq]: filters[key] };
                    } else {
                        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
                    }
                }
            }
            const record = await Record.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: UM,
                        attributes: ['name'],
                        required: true
                    }
                ],
                limit,
                offset 
            }); // Добавляем фильтр к запросу
            return res.json(record);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }      

    async delete(req, res) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить запись)'))
        }
        let token = '';
        if(req.token) token = req.token;
        try {
            const album = await Record.findByPk(id);
            if (!album) {
                throw ApiError.badRequest("Record not found");
            }
            await album.destroy();
            return res.json({ message: 'Record deleted successfully', token });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить запись)'))
        }
        let token = '';
        if(req.token) token = req.token;
        let {desc_fact, quantity, umId, quantity_um, provider, date, positionId} = req.body;
        try {
            const record = await Record.findByPk(id);
            if (!record) {
                throw ApiError.badRequest("Record Not Found!");
            }
            if (desc_fact) {
                record.desc_fact = desc_fact;
            }
            if (quantity) {
                record.quantity = quantity;
            }
            if (umId) {
                record.umId = umId;
            }
            if (quantity_um) {
                record.quantity_um = quantity_um;
            }
            if (provider) {
                record.provider = provider;
            }
            if (date) {
                record.date = date;
            }
            if (positionId) {
                record.positionId = positionId;
            }
            await record.save();
            return res.json({record, token});
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new RecordController()