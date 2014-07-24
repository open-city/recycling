module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    address: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  })

  return Location
}

