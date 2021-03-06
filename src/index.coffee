class AppCachePlugin

  @AppCache = class AppCache
    constructor: (@cache, @network, @fallback, @hash, @path) -> @assets = []

    addAsset: (asset) -> @assets.push asset

    size: -> Buffer.byteLength @source(), 'utf8'

    getManifestBody: ->
      [
        if @assets?.length then "#{@path}#{@assets.join "\n#{@path}"}\n"
        if @cache?.length then "CACHE:\n#{@cache.join '\n'}\n"
        if @network?.length then "NETWORK:\n#{@network.join '\n'}\n"
        if @fallback?.length then "FALLBACK:\n#{@fallback.join '\n'}\n"
      ].filter((v) -> v?.length).join '\n'

    source: ->
      """
      CACHE MANIFEST
      # #{@hash}

      #{@getManifestBody()}
      """

  constructor: (options) ->
    @cache = options?.cache
    @network = options?.network or ['*']
    @fallback = options?.fallback
    @filename = options?.filename or 'manifest.appcache'
    @path = options?.path or ''

  apply: (compiler) ->
    compiler.plugin 'emit', (compilation, callback) =>
      appCache = new AppCache @cache, @network, @fallback, compilation.hash, @path
      appCache.addAsset key for key in Object.keys compilation.assets
      compilation.assets[@filename] = appCache
      callback()


module.exports = AppCachePlugin
