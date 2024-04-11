const { Order, OrderRecord } = require("../models/models")
const { Op } = require('sequelize');
const ApiError = require('../error/apiError')

class OrderController {
    async create(req, res, next) {
        let token = '';
        if(req.token) token = req.token;
        try{
            const date = req.body.date;
            const active = true;
            const order = await Order.create({date, active})
            return res.json({order, token})
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить заказ)'));
        }
        try {
            const order = await Order.findOne({
                where: { id },
                include: [{
                    model: OrderRecord,
                    as: 'orderRecords'
                }]
            });
            if (!order) {
                return next(ApiError.notFound("Order not found!"));
            }
            return res.json(order);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    

    async getAll(req, res, next) {
        let { limit, page, date, active, id } = req.query;
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
            if (active) {
                whereClause.active = JSON.parse(active); // Добавление фильтра по полю active
            }
            if (id) {
                id = JSON.parse(id);
                whereClause.id = { [Op.in]: id.id };
            }
            const order = await Order.findAndCountAll({
                include: [
                    {
                        model: OrderRecord,
                        as: 'orderRecords',
                        attributes: ['id']
                    }
                ],
                where: whereClause,
                limit, 
                offset,
            })
            return res.json({ count: order.rows.length, rows: order.rows })
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить заказ)'))
        }
        let token = '';
        if(req.token) token = req.token;
        try {
            const order = await Order.findByPk(id);
            if (!order) {
                throw ApiError.badRequest("Order not found!");
            }
            await order.destroy();
            return res.json({ message: 'Order deleted successfully!', token });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить заказ)'))
        }
        let token = '';
        if(req.token) token = req.token;
        let {date, active} = req.body;
        try {
            const order = await Order.findByPk(id);
            if (!order) {
                throw ApiError.badRequest("Order Not Found!");
            }
            if (date) {
                order.date = date;
            }
            if (active) {
                order.active = active;
            }
            await order.save();
            return res.json({order, token});
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new OrderController()