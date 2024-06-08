const { OrderRecord, Position, UM} = require("../models/models")
const ApiError = require('../error/ApiError')
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
            let whereClause = {}; // Create an empty object for search conditions
            let orderCriteria = []; // Create an empty array for sorting criteria
    
            if (orderId) {
                whereClause.orderId = orderId; // If orderId is passed, add it to the filter
            }
    
            let positionsIdPresent = false;
    
            if (filters) {
                filters = JSON.parse(filters); // Parse the JSON string
                for (let key in filters) {
                    if (key === 'positionsId') {
                        whereClause.positionId = { [Op.in]: filters.positionsId };
                        positionsIdPresent = true; // Mark that positionsId is present in filters
                    } else {
                        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
                    }
                }
            }
    
            if (!sort || Object.keys(sort).length === 0) {
                // If sort is not specified or empty, set default sorting by descending id
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
    
            let queryOptions = {
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
            };
    
            if (!positionsIdPresent) {
                queryOptions.limit = limit;
                queryOptions.offset = offset;
            }
    
            const orderRecord = await OrderRecord.findAndCountAll(queryOptions);
            return res.json(orderRecord);
        } catch (error) {
            next(ApiError.badRequest(error.message));
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