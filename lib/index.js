var AppCachePlugin;

AppCachePlugin = (function() {
  var AppCache;

  AppCachePlugin.AppCache = AppCache = (function() {
    function AppCache(cache, network, fallback, hash, path) {
      this.cache = cache;
      this.network = network;
      this.fallback = fallback;
      this.hash = hash;
      this.path = path;
      this.assets = [];
    }

    AppCache.prototype.addAsset = function(asset) {
      return this.assets.push(asset);
    };

    AppCache.prototype.size = function() {
      return Buffer.byteLength(this.source(), 'utf8');
    };

    AppCache.prototype.getManifestBody = function() {
      var _ref, _ref1, _ref2, _ref3;
      return [((_ref = this.assets) != null ? _ref.length : void 0) ? "" + this.path + (this.assets.join("\n" + this.path)) + "\n" : void 0, ((_ref1 = this.cache) != null ? _ref1.length : void 0) ? "CACHE:\n" + (this.cache.join('\n')) + "\n" : void 0, ((_ref2 = this.network) != null ? _ref2.length : void 0) ? "NETWORK:\n" + (this.network.join('\n')) + "\n" : void 0, ((_ref3 = this.fallback) != null ? _ref3.length : void 0) ? "FALLBACK:\n" + (this.fallback.join('\n')) + "\n" : void 0].filter(function(v) {
        return v != null ? v.length : void 0;
      }).join('\n');
    };

    AppCache.prototype.source = function() {
      return "CACHE MANIFEST\n# " + this.hash + "\n\n" + (this.getManifestBody());
    };

    return AppCache;

  })();

  function AppCachePlugin(options) {
    this.cache = options != null ? options.cache : void 0;
    this.network = (options != null ? options.network : void 0) || ['*'];
    this.fallback = options != null ? options.fallback : void 0;
    this.filename = (options != null ? options.filename : void 0) || 'manifest.appcache';
    this.path = (options != null ? options.path : void 0) || '';
  }

  AppCachePlugin.prototype.apply = function(compiler) {
    return compiler.plugin('emit', (function(_this) {
      return function(compilation, callback) {
        var appCache, key, _i, _len, _ref;
        appCache = new AppCache(_this.cache, _this.network, _this.fallback, compilation.hash, _this.path);
        _ref = Object.keys(compilation.assets);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          appCache.addAsset(key);
        }
        compilation.assets[_this.filename] = appCache;
        return callback();
      };
    })(this));
  };

  return AppCachePlugin;

})();

module.exports = AppCachePlugin;
