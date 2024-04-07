const sequelize = require('../db')
const {DataTypes} = require('sequelize')

//пользователь
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique:true, allowNull:false},
    password: {type: DataTypes.STRING, allowNull:false},
    name: {type: DataTypes.STRING, allowNull:false},
    active: {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: true}, // добавлено поле active
    admin: {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false} // добавлено поле admin
})

//выписка
const Extract = sequelize.define('extract', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW} 
})

//запись выписки
const ExtractRecord = sequelize.define('extractRecord', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type:DataTypes.INTEGER, allowNull:false},
    project: {type: DataTypes.STRING, allowNull:true},
    quantity_um: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 } // добавлено поле quantity_um
});

//категория
const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique:true, allowNull:false}, 
})

//позиция
const Position = sequelize.define('position', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique:true, allowNull:false}, 
    desc:  {type: DataTypes.STRING, allowNull:true},
    article: {type: DataTypes.STRING, unique:true}, 
    factory: {type: DataTypes.STRING, allowNull:true},
    quantity: {type:DataTypes.INTEGER, defaultValue: 0},
    quantity_min: {type:DataTypes.INTEGER, defaultValue: 0},
})

//запись
const Record = sequelize.define('record', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    desc_fact:  {type: DataTypes.STRING, allowNull:true},
    quantity: {type:DataTypes.INTEGER, allowNull:false},
    quantity_um: {type:DataTypes.INTEGER, allowNull:false, defaultValue: 1},
    provider: {type: DataTypes.STRING, allowNull:true},
    date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW} 
})

// Определение модели PositionHierarchy для хранения связей между позициями
const PositionHierarchy = sequelize.define('positionHierarchy', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    parentId: { type: DataTypes.INTEGER, allowNull: false },
    childId: { type: DataTypes.INTEGER, allowNull: false }
});

// Определение модели системы единиц измерений (UM)
const UM = sequelize.define('um', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
});

// Определение ассоциации между позициями через PositionHierarchy
Position.belongsToMany(Position, { through: PositionHierarchy, as: 'ParentPositions', foreignKey: 'childId' });
Position.belongsToMany(Position, { through: PositionHierarchy, as: 'ChildPositions', foreignKey: 'parentId' });

Category.hasMany(Position, { as: 'positions'});
Position.belongsTo(Category)

Position.hasMany(Record, { as: 'records'});
Record.belongsTo(Position)

User.hasMany(Extract, { as: 'extracts'});
Extract.belongsTo(User)

Extract.hasMany(ExtractRecord, { as: 'extractRecords'});
ExtractRecord.belongsTo(Extract)

Record.hasMany(ExtractRecord, { as: 'extractRecords'});
ExtractRecord.belongsTo(Record)

UM.hasMany(Position, { as: 'positions' });
Position.belongsTo(UM)
UM.hasMany(Record, { as: 'records' });
Record.belongsTo(UM)
UM.hasMany(ExtractRecord, { as: 'extractRecords' });
ExtractRecord.belongsTo(UM)

module.exports = {
    User, Extract, ExtractRecord, Category, Position, PositionHierarchy, Record, UM
}