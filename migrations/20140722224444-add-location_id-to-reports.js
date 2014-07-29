module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn(
      'reports',
      'locationId',
      DataTypes.INTEGER
    ).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('reports', 'locationId').complete(done);
  }
}
