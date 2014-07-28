module.exports = {
  up: function(migration, DataTypes, done) {
    migration.changeColumn(
      'reports',
      'recyclingAvailable',
      {type: "integer USING 0"}
    ).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.changeColumn('reports', 'recyclingAvailable', {type: "boolean using false"}).complete(done);
  }
}
