module.exports = function(sequelize, DataTypes) {
  var Report = sequelize.define('Report', {
    recyclingAvailable: DataTypes.BOOLEAN
  })

  return Report
}
