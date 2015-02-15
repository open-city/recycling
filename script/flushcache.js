var cache = require('memjs').Client.create();
cache.flush(function(err, rslt){

  if (err) {
    console.error('Error flushing cache:')
    console.error(err);
    return;
  }

  console.log("Cache flushed")
  console.log(rslt);

  process.exit();
});