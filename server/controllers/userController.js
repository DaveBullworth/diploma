const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Extract} = require('../models/models')

class UserController {
    async registration(req, res, next) {
        const {login, password, name} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest('Неккоректный логин/пароль!'))
        }
        const candidate = await User.findOne({where:{login}})
        if (candidate){
            return next(ApiError.badRequest('Пользователь уже существует!'))
        }
        const hashPassword = await bcrypt.hash(password,3)
        const user = await User.create({login, password:hashPassword, name})
        const token = generateJWT(user.id, user.login, user.name)
        return res.json({token})
    }

    async login(req, res, next) {
        const {login, password} = req.body
        const candidate = await User.findOne({where:{login}})
        if (!candidate){
            return next(ApiError.badRequest('Пользователь не существует!'))
        }
        let comparePassword = bcrypt.compareSync(password, candidate.password)
        if(!comparePassword){
            return next(ApiError.iternal('Неверный пароль!'))
        }
        const token = generateJWT(candidate.id, candidate.login, candidate.name)
        return res.json({token})
    }

    async check(req, res, next) {
        const {id, login, name} = req.user
        const token = generateJWT(id, login, name)
        return res.json({token})
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить пользователя)'))
        }
        try {
            const user = await User.findOne({
                where: { id },
                attributes: { exclude: ['password'] }, // исключаем поле 'password'
                include: [{ model: Extract, as: 'extracts' }] // включаем связь с Extract
            });
            if(!user){"User not found!"}
            return res.json(user)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить пользователя)'))
        }
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw ApiError.badRequest("User not found!");
            }
            await user.destroy();
            return res.json({ message: 'User deleted successfully!' });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить пользователя)'))
        }
        let {name, login, password} = req.body;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw ApiError.badRequest("User Not Found!");
            }
            if (name) {
                user.name = name;
            }
            if (login) {
                user.login = login;
            }
            if (password) {
                // Хешируем новый пароль перед сохранением
                const hashPassword = await bcrypt.hash(password, 3);
                user.password = hashPassword;
            }
            await user.save();
            return res.json(user);
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['id', 'ASC']]
            });
            return res.json(users);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    
}

const generateJWT = (id, login, name) => {
    return jwt.sign(
        {id, login, name}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

module.exports = new UserController()