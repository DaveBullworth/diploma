const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Extract} = require('../models/models')

class UserController {
    async registration(req, res, next) {
        const {login, password, name, active, admin} = req.body
        let token = '';
        if(req.token) token = req.token;
        if (!login || !password) {
            return next(ApiError.badRequest('Неккоректный логин/пароль!'))
        }
        if (!req.user.admin) {
            return next(ApiError.forbidden('У вас нет прав на выполнение этой операции!'));
        }
        const candidate = await User.findOne({where:{login}})
        if (candidate){
            return next(ApiError.badRequest('Пользователь уже существует!'))
        }
        const hashPassword = await bcrypt.hash(password,3)
        const user = await User.create({login, password:hashPassword, name, active, admin})
        return res.json({ user, token });
    }

    async login(req, res, next) {
        const {login, password} = req.body
        try {
            const candidate = await User.findOne({where:{login}})
            if (!candidate){
                return next(ApiError.badRequest('Пользователь не существует!'))
            }
            // Проверяем активность пользователя
            if (!candidate.active) {
                return next(ApiError.forbidden('Данный пользователь деактивирован!'));
            }
            let comparePassword = bcrypt.compareSync(password, candidate.password)
            if(!comparePassword){
                return next(ApiError.internal('Неверный пароль!'))
            }
            // Генерируем новые токены при успешном входе
            const token = generateJWT(candidate.id, candidate.login, candidate.name, candidate.active, candidate.admin);
            const refreshToken = generateRefreshToken(candidate.id, candidate.login, candidate.name, candidate.active, candidate.admin);
            return res.json({token, refreshToken});
        } catch (error) {
            return next(ApiError.internal('Ошибка при входе!'));
        }
    }    

    async check(req, res, next) {
        const {id, login, name, active, admin} = req.user
        const token = generateJWT(id, login, name, active, admin)
        return res.json({token})
    }

    async refreshTokens(refreshToken) {
        if (!refreshToken) {
            throw { message: 'Отсутствует refresh-токен!' };
        }
        try {
            // Расшифровываем refresh-токен, чтобы получить информацию о пользователе
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // Проверяем наличие пользователя в базе данных
            const user = await User.findByPk(decoded.id);
            if (!user) {
                throw { message: 'Пользователь не найден!' };
            }
            // Создаем новый access-токен
            const accessToken = generateJWT(user.id, user.login, user.name, user.active, user.admin);
            // Создаем новый refresh-токен (опционально)
            //const newRefreshToken = generateRefreshToken(user.id, user.login, user.name);
            return ({ token: accessToken });
        } catch (error) {
            // В случае ошибки валидации токена или других ошибок возвращаем ошибку сервера
            throw { message: 'Ошибка обновления токенов!', error };
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить пользователя)'))
        }
        let token = '';
        if(req.token) token = req.token;
        try {
            const user = await User.findOne({
                where: { id },
                attributes: { exclude: ['password'] }, // исключаем поле 'password'
                include: [{ model: Extract, as: 'extracts' }] // включаем связь с Extract
            });
            if(!user){"User not found!"}
            return res.json({ user, token });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить пользователя)'))
        }
        let token = '';
        if(req.token) token = req.token;
        try {
            if (!req.user.admin) {
                return next(ApiError.forbidden('У вас нет прав на выполнение этой операции!'));
            }
            const user = await User.findByPk(id);
            if (!user) {
                throw ApiError.badRequest("User not found!");
            }
            await user.destroy();
            return res.json({ message: 'User deleted successfully!', token });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить пользователя)'))
        }
        let token = '';
        if(req.token) token = req.token;
        let {name, login, password, active, admin} = req.body;
        try {
            if (!req.user.admin) {
                return next(ApiError.forbidden('У вас нет прав на выполнение этой операции!'));
            }
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
            if (active !== undefined) {
                user.active = active
            }
            if (admin !== undefined) {
                user.admin = admin
            }
            await user.save();
            return res.json({ user, token });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let token = '';
            if(req.token) token = req.token;
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['id', 'ASC']]
            });
            return res.json({ users, token });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    
}

const generateJWT = (id, login, name, active, admin) => {
    return jwt.sign(
        {id, login, name, active, admin}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '15m'}
    )
}

const generateRefreshToken = (id, login, name, active, admin) => {
    return jwt.sign(
        { id, login, name, active, admin },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '2d' } 
    );
};

module.exports = new UserController()