const { Position, Record, Category } = require("../models/models")
const { Op } = require('sequelize');
const sequelize = require('../db');
const ApiError = require('../error/apiError')

class PositionController {
    async create(req, res, next) {
        try{
            const {name, desc, article, factory, quantity, um, quantity_min, categoryId} = req.body
            const position = await Position.create({name, desc, article, factory, quantity, um, quantity_min, categoryId})
            return res.json(position)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        if (!id) {
            return next(ApiError.badRequest('Не передан ID!(при попытке получить позицию)'));
        }
        try {
            const position = await Position.findOne({
                where: { id },
                include: [
                    { model: Record, as: 'records' },
                    {
                        model: Position,
                        as: 'ChildPositions',
                        through: { attributes: [] },
                        include: [ // Включаем модель Category для 'ChildPositions'
                            {
                                model: Category,
                                attributes: ['name'],
                                required: true
                            }
                        ]
                    },
                    {
                        model: Category,
                        attributes: ['name'],
                        required: true
                    }
                ]
            });
            if (!position) {
                return res.status(404).json({ error: "Position not found!" });
            }
            return res.json(position);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    

    async getAll(req, res, next) {
        let { limit, page, filters, sort, id } = req.query; // Добавляем sort в параметры запроса
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit;
        try {
            let whereClause = {}; // Создаем пустой объект для условий поиска
            let orderCriteria = []; // Создаем пустой массив для критериев сортировки
    
            // Обработка фильтров из запроса
            if (filters) {
                filters = JSON.parse(filters); // Парсим строку JSON
                for (let key in filters) {
                    if (key === 'article' || key === 'categoryId') {
                        whereClause[key] = { [Op.eq]: filters[key] };
                    } else {
                        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
                    }
                }
            }
    
            if (id) {
                whereClause.id = { [Op.ne]: id };
            }
    
            // Обработка сортировки
            if (!sort || Object.keys(sort).length === 0) {
                // Если sort не задан или пустой, устанавливаем сортировку по убыванию id по умолчанию
                orderCriteria.push(['id', 'DESC']);
            } else {
                sort = JSON.parse(sort);
                for (let key in sort) {
                    if (key === 'quantity') {
                        orderCriteria.push(['quantity', sort[key].toUpperCase()]);
                    } else if (key === 'quantity_min') {
                        if (sort[key] === 'asc') {
                            orderCriteria.unshift(
                                sequelize.literal('(CASE WHEN "quantity" > "quantity_min" THEN 0 ELSE 1 END)')
                            );
                        } else if (sort[key] === 'desc') {
                            orderCriteria.unshift(
                                sequelize.literal('(CASE WHEN "quantity" > "quantity_min" THEN 1 ELSE 0 END)')
                            );
                        }
                    }
                }
            }
    
            const position = await Position.findAndCountAll({
                include: [
                    {
                        model: Category,
                        attributes: ['name'],
                        required: true
                    }
                ],
                where: whereClause,
                order: orderCriteria, // Применяем критерии сортировки
                limit,
                offset
            });
            return res.json(position);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }      

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить категорию)'))
        }
        try {
            const position = await Position.findByPk(id);
            if (!position) {
                throw ApiError.badRequest("Position not found!");
            }
            await position.destroy();
            return res.json({ message: 'Position deleted successfully!' });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить категорию)'))
        }
        let {name, desc, article, factory, quantity, um, quantity_min, categoryId} = req.body;
        try {
            const position = await Position.findByPk(id);
            if (!position) {
                throw ApiError.badRequest("Position Not Found!");
            }
            if (name) {
                position.name = name;
            }
            if (desc) {
                position.desc = desc;
            }
            if (article) {
                position.article = article;
            }
            if (factory) {
                position.factory = factory;
            }
            if (quantity) {
                position.quantity = quantity;
            }
            if (um) {
                position.um = um;
            }
            if (quantity_min) {
                position.quantity_min = quantity_min;
            }
            if (categoryId) {
                position.categoryId = categoryId;
            }
            await position.save();
            return res.json(position);
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new PositionController()