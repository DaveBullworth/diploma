const { OrderRecord, Position, UM} = require("../models/models")
const ApiError = require('../error/apiError')
const { Op } = require('sequelize');

class OrderRecordController {
    async create(req, res, next) {
        try{
            const {quantity, orderId, positionId, active} = req.body
            const orderRecord = await OrderRecord.create({quantity, orderId, positionId, active})
            return res.json(orderRecord)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить запись из заказа)'))
        }
        try {
            const orderRecord = await OrderRecord.findOne({
                where: { id },
                include: [
                    {
                        model: Position,
                        attributes: ['desc'],
                        include: [
                            {
                                model: UM,
                                attributes: ['name'],
                                required: true
                            }
                        ]
                    }
                ]
            });
            if(!orderRecord){"OrderRecord not found!"}
            return res.json(orderRecord)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        let { limit, page, orderId, filters, sort } = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit;
        try {
            let whereClause = {}; // Создаем пустой объект для условий поиска
            let orderCriteria = []; // Создаем пустой массив для критериев сортировки

            if (orderId) {
                whereClause.orderId = orderId; // Если positionId передан, добавляем его в фильтр
            }
            
            if (filters) {
                filters = JSON.parse(filters); // Парсим строку JSON
                for (let key in filters) {
                    if (key === 'positionsId' ) {
                        whereClause.positionId = { [Op.in]: filters.positionsId };
                    } else {
                        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
                    }
                }
            }
            if (!sort || Object.keys(sort).length === 0) {
                // Если sort не задан или пустой, устанавливаем сортировку по убыванию id по умолчанию
                orderCriteria.push(['id', 'ASC']);
            } else {
                sort = JSON.parse(sort);
                for (let key in sort) {
                    if (key === 'quantity') {
                        orderCriteria.push(['quantity', sort[key].toUpperCase()]);
                    }
                    if (key === 'active') {
                        orderCriteria.push(['active', sort[key].toUpperCase()]);
                    }
                }
            }
            const orderRecord = await OrderRecord.findAndCountAll({
                include: [
                    {
                        model: Position,
                        attributes: ['desc'],
                        include: [
                            {
                                model: UM,
                                attributes: ['name'],
                                required: true
                            }
                        ]
                    }
                ],
                where: whereClause,
                order: orderCriteria,
                limit,
                offset
            });
            return res.json(orderRecord)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить запись из заказа)'))
        }
        try {
            const orderRecord = await OrderRecord.findByPk(id);
            if (!orderRecord) {
                throw ApiError.badRequest("OrderRecord not found!");
            }
            await orderRecord.destroy();
            return res.json({ message: 'OrderRecord deleted successfully!' });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить запись выписки)'))
        }
        let {quantity, orderId, positionId, active} = req.body;
        try {
            const orderRecord = await OrderRecord.findByPk(id);
            if (!orderRecord) {
                throw ApiError.badRequest("OrderRecord Not Found!");
            }
            if (quantity) {
                orderRecord.quantity = quantity;
            }
            if (orderId) {
                orderRecord.orderId = orderId;
            }
            if (positionId) {
                orderRecord.positionId = positionId;
            }
            if (active || active===false) {
                orderRecord.active = active;
            }
            await orderRecord.save();
            return res.json(orderRecord);
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new OrderRecordController()