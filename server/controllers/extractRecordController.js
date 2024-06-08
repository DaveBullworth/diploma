const { ExtractRecord, Record, Position, User, Extract, UM } = require("../models/models")
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');

class ExtractRecordController {
    async create(req, res, next) {
        try{
            const {quantity, project, quantity_um, extractId, umId, recordId} = req.body
            const extractRecord = await ExtractRecord.create({quantity, project, quantity_um, extractId, umId, recordId})
            return res.json(extractRecord)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке получить запись из выписки)'))
        }
        try {
            const extractRecord = await ExtractRecord.findOne({
                where: { id },
                include: [
                    {
                        model: UM,
                        attributes: ['name'],
                        required: true
                    },
                    {
                        model: Record,
                        attributes: ['desc_fact'],
                        include: [
                            {
                                model: Position,
                                attributes: ['desc']
                            }
                        ]
                    },
                    {
                        model: Extract,
                        include: [
                            {
                                model: User,
                                attributes: ['login']
                            }
                        ]
                    }
                ]
            });
            if(!extractRecord){"ExtractRecord not found!"}
            return res.json(extractRecord)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res, next) {
        let { limit, page, extractId, filters, sort } = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit;
    
        try {
            let whereClause = {}; // Create an empty object for search conditions
            let orderCriteria = []; // Create an empty array for sorting criteria
            let recordsIdPresent = false;
    
            if (extractId) {
                whereClause.extractId = extractId; // If extractId is passed, add it to the filter
            }
    
            if (filters) {
                filters = JSON.parse(filters); // Parse the JSON string
                for (let key in filters) {
                    if (key === 'recordsId') {
                        whereClause.recordId = { [Op.in]: filters.recordsId };
                        recordsIdPresent = true; // Mark that recordsId is present in filters
                    } else if (key === 'umId') {
                        whereClause[key] = { [Op.eq]: filters[key] };
                    } else {
                        whereClause[key] = { [Op.like]: `%${filters[key]}%` };
                    }
                }
            }
    
            if (!sort || Object.keys(sort).length === 0) {
                // If sort is not specified or empty, set default sorting by ascending id
                orderCriteria.push(['id', 'ASC']);
            } else {
                sort = JSON.parse(sort);
                for (let key in sort) {
                    if (key === 'quantity') {
                        orderCriteria.push(['quantity', sort[key].toUpperCase()]);
                    }
                }
            }
    
            let queryOptions = {
                include: [
                    {
                        model: UM,
                        attributes: ['name'],
                        required: true
                    },
                    {
                        model: Record,
                        attributes: ['desc_fact'],
                        include: [
                            {
                                model: Position,
                                attributes: ['desc']
                            },
                            {
                                model: UM,
                                attributes: ['name']
                            }
                        ]
                    },
                    {
                        model: Extract,
                        include: [
                            {
                                model: User,
                                attributes: ['login']
                            }
                        ]
                    }
                ],
                where: whereClause,
                order: orderCriteria,
            };
    
            if (!recordsIdPresent) {
                queryOptions.limit = limit;
                queryOptions.offset = offset;
            }
    
            const extractRecord = await ExtractRecord.findAndCountAll(queryOptions);
            return res.json(extractRecord);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }    

    async delete(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке удалить запись из выписки)'))
        }
        try {
            const extractRecord = await ExtractRecord.findByPk(id);
            if (!extractRecord) {
                throw ApiError.badRequest("ExtractRecord not found!");
            }
            await extractRecord.destroy();
            return res.json({ message: 'ExtractRecord deleted successfully!' });
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        if (!id){
            return next(ApiError.badRequest('Не передан ID!(при попытке изменить запись выписки)'))
        }
        let {quantity, project, quantity_um, umId, extractId, recordId} = req.body;
        try {
            const extractRecord = await ExtractRecord.findByPk(id);
            if (!extractRecord) {
                throw ApiError.badRequest("ExtractRecord Not Found!");
            }
            if (quantity) {
                extractRecord.quantity = quantity;
            }
            if (project) {
                extractRecord.project = project;
            }
            if (quantity_um) {
                extractRecord.quantity_um = quantity_um;
            }
            if (umId) {
                extractRecord.umId = umId;
            }
            if (extractId) {
                extractRecord.extractId = extractId;
            }
            if (recordId) {
                extractRecord.recordId = recordId;
            }
            await extractRecord.save();
            return res.json(extractRecord);
        } catch(error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new ExtractRecordController()