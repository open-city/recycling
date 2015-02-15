/** 
 * ========================
 * READ THIS!!
 * ========================
 *
 * This is not meant as any kind of true authentication mechanism.
 * The username and password are hard-coded below and will be visible
 * to anyone browsing the repository on github.
 *
 * This middleware is simply meant to keep search engines out of the
 * staging site. If you're not sure what any part of this means, don't
 * touch it.
 */


var auth = require('basic-auth');

module.exports = function(req, res, next) {
  var creds = auth(req);
  if (!creds || creds.name !== 'recycling' || creds.pass !== 'recycling') {
    res.writeHead(401, {"WWW-Authenticate": 'Basic realm="Recycling Staging Site"'});
    res.end();
  } else {
    next();
  }

}