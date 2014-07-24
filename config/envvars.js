module.exports = {
  
  /**
   * For whatever reason, MapQuest URI-Encodes your App Key
   * before delivering it to you, which causes POST requests
   * to fail. Unencoding it here so you can paste it in as
   * given.
   */
  MAPQUEST_APP_KEY: decodeURIComponent("Fmjtd%7Cluur200al9%2C2x%3Do5-9ayw5z")
}
