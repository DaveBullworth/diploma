const { Category, Position } = require("../models/models")
const ApiError = require('../error/apiError')

class CategoryController {
    async create(req, res, next) {
        let token = '';
        if(req.token) token = req.token;
        try{
            const {name} = req.body
            const category = await Category.create({name})
            return res.json({category, token})
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить категорию)'))
        }
        try {
            const category = await Category.findOne({
                where:{id},
                include:[{model: Position, as: 'positions'}]
            })
            if(!category){"Category not found!"}
            return res.json(category)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        try{
            const category = await Category.findAll()
            return res.json(category)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить категорию)'))
        }
        let token = '';
        if(req.token) token = req.token;
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw ApiError.badRequest("Category not found!");
            }
            await category.destroy();
            return res.json({ message: 'Category deleted successfully!', token });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить категорию)'))
        }
        let token = '';
        if(req.token) token = req.token;
        let {name} = req.body;
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw ApiError.badRequest("Category Not Found!");
            }
            if (name) {
                category.name = name;
            }
            await category.save();
            return res.json({category, token})
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new CategoryController()