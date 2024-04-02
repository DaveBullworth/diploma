const jwt = require('jsonwebtoken');
const { refreshTokens } = require('../controllers/userController');

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS"){
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(401).json({message:"Пользователь не авторизован!"})
        }
        
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Если токен истек, попробуйте обновить токены
                try {
                    const refreshToken = req.headers['x-refresh-token'];
                    const refreshedResponse = await refreshTokens(refreshToken); // Обновляем токены
                    req.headers.authorization = `Bearer ${refreshedResponse.token}`;
                    // Повторно попробуйте верифицировать новый access-токен
                    const newDecoded = jwt.verify(refreshedResponse.token, process.env.ACCESS_TOKEN_SECRET);
                    req.user = newDecoded;
                    req.token = refreshedResponse.token;
                    next();
                } catch (refreshError) {
                    // Если не удалось обновить токены, верните ошибку аутентификации
                    return res.status(401).json({message:"Пользователь не авторизован!", refreshError: refreshError.message});
                }
            } else {
                // Если другая ошибка при верификации токена, верните ошибку аутентификации
                return res.status(401).json({message:"Пользователь не авторизован!"});
            }
        }
    } catch (error) {
        res.status(401).json({message:"Пользователь не авторизован!"})
    }
}