module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('locations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      address: {
        type: DataTypes.STRING
      },
      latitude: {
        type: DataTypes.STRING
      },
      longitude: {
        type: DataTypes.STRING
      }
    }).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('locations').complete(done);
  }
}
