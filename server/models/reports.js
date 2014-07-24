module.exports = function(sequelize, DataTypes) {
  var Report = sequelize.define('Report', {
    recyclingAvailable: DataTypes.BOOLEAN,
    locationId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models){
        Report.belongsTo(models.Location, {foreignKey: 'locationId'})
      }
    }
  })

  return Report
}
