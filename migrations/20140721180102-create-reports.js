module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('reports', {
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
      recyclingAvailable: {
        type: DataTypes.BOOLEAN
      }
    }).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('reports').complete(done);
  }
}
