import { C as CHAIN_NAMESPACES, _ as _defineProperty, a as _inherits, b as _getPrototypeOf, c as _possibleConstructorReturn, d as _classCallCheck, e as _assertThisInitialized, f as ADAPTER_STATUS, g as WalletInitializationError, l as log, s as storageAvailable, h as getChainConfig, i as _createClass, j as _asyncToGenerator, r as regenerator, k as ADAPTER_NAMESPACES, m as WalletLoginError, A as ADAPTER_EVENTS, S as SafeEventEmitter } from '../common/base.esm-29bcd2f1.js';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PLUGIN_NAMESPACES = _objectSpread(_objectSpread({}, CHAIN_NAMESPACES), {}, {
  MULTICHAIN: "multichain"
});

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ADAPTER_CACHE_KEY = "Web3Auth-cachedAdapter";
var Web3AuthCore = /*#__PURE__*/function (_SafeEventEmitter) {
  _inherits(Web3AuthCore, _SafeEventEmitter);

  var _super = _createSuper(Web3AuthCore);

  function Web3AuthCore(options) {
    var _options$chainConfig, _options$chainConfig2, _options$chainConfig3, _options$chainConfig4;

    var _this;

    _classCallCheck(this, Web3AuthCore);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "coreOptions", void 0);

    _defineProperty(_assertThisInitialized(_this), "connectedAdapterName", null);

    _defineProperty(_assertThisInitialized(_this), "status", ADAPTER_STATUS.NOT_READY);

    _defineProperty(_assertThisInitialized(_this), "cachedAdapter", null);

    _defineProperty(_assertThisInitialized(_this), "walletAdapters", {});

    _defineProperty(_assertThisInitialized(_this), "plugins", {});

    _defineProperty(_assertThisInitialized(_this), "storage", "localStorage");

    if (!options.clientId) throw WalletInitializationError.invalidParams("Please provide a valid clientId in constructor");
    if (options.enableLogging) log.enableAll();else log.disableAll();
    if (!((_options$chainConfig = options.chainConfig) !== null && _options$chainConfig !== void 0 && _options$chainConfig.chainNamespace) || !Object.values(CHAIN_NAMESPACES).includes((_options$chainConfig2 = options.chainConfig) === null || _options$chainConfig2 === void 0 ? void 0 : _options$chainConfig2.chainNamespace)) throw WalletInitializationError.invalidParams("Please provide a valid chainNamespace in chainConfig");
    if (options.storageKey === "session") _this.storage = "sessionStorage";
    _this.cachedAdapter = storageAvailable(_this.storage) ? window[_this.storage].getItem(ADAPTER_CACHE_KEY) : null;
    _this.coreOptions = _objectSpread$1(_objectSpread$1({}, options), {}, {
      chainConfig: _objectSpread$1(_objectSpread$1({}, getChainConfig((_options$chainConfig3 = options.chainConfig) === null || _options$chainConfig3 === void 0 ? void 0 : _options$chainConfig3.chainNamespace, (_options$chainConfig4 = options.chainConfig) === null || _options$chainConfig4 === void 0 ? void 0 : _options$chainConfig4.chainId) || {}), options.chainConfig)
    });
    _this.subscribeToAdapterEvents = _this.subscribeToAdapterEvents.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Web3AuthCore, [{
    key: "provider",
    get: function get() {
      if (this.status === ADAPTER_STATUS.CONNECTED && this.connectedAdapterName) {
        var adapter = this.walletAdapters[this.connectedAdapterName];
        return adapter.provider;
      }

      return null;
    },
    set: function set(_) {
      throw new Error("Not implemented");
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var _this2 = this;

        var initPromises;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                initPromises = Object.keys(this.walletAdapters).map(function (adapterName) {
                  _this2.subscribeToAdapterEvents(_this2.walletAdapters[adapterName]); // if adapter doesn't have any chain config yet thn set it based on provided namespace and chainId.
                  // if no chainNamespace or chainId is being provided, it will connect with mainnet.


                  if (!_this2.walletAdapters[adapterName].chainConfigProxy) {
                    var providedChainConfig = _this2.coreOptions.chainConfig;
                    if (!providedChainConfig.chainNamespace) throw WalletInitializationError.invalidParams("Please provide chainNamespace in chainConfig");

                    var chainConfig = _objectSpread$1(_objectSpread$1({}, getChainConfig(providedChainConfig.chainNamespace, providedChainConfig.chainId)), providedChainConfig);

                    _this2.walletAdapters[adapterName].setChainConfig(chainConfig);
                  }

                  _this2.walletAdapters[adapterName].setAdapterSettings({
                    sessionTime: _this2.coreOptions.sessionTime,
                    clientId: _this2.coreOptions.clientId
                  });

                  return _this2.walletAdapters[adapterName].init({
                    autoConnect: _this2.cachedAdapter === adapterName
                  }).catch(function (e) {
                    return log.error(e);
                  });
                });
                this.status = ADAPTER_STATUS.READY;
                _context.next = 4;
                return Promise.all(initPromises);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "configureAdapter",
    value: function configureAdapter(adapter) {
      this.checkInitRequirements();
      var providedChainConfig = this.coreOptions.chainConfig;
      if (!providedChainConfig.chainNamespace) throw WalletInitializationError.invalidParams("Please provide chainNamespace in chainConfig");
      var adapterAlreadyExists = this.walletAdapters[adapter.name];
      if (adapterAlreadyExists) throw WalletInitializationError.duplicateAdapterError("Wallet adapter for ".concat(adapter.name, " already exists"));
      if (adapter.adapterNamespace !== ADAPTER_NAMESPACES.MULTICHAIN && adapter.adapterNamespace !== providedChainConfig.chainNamespace) throw WalletInitializationError.incompatibleChainNameSpace("This wallet adapter belongs to ".concat(adapter.adapterNamespace, " which is incompatible with currently used namespace: ").concat(providedChainConfig.chainNamespace));

      if (adapter.adapterNamespace === ADAPTER_NAMESPACES.MULTICHAIN && adapter.currentChainNamespace && providedChainConfig.chainNamespace !== adapter.currentChainNamespace) {
        // chainConfig checks are already validated in constructor so using typecast is safe here.
        adapter.setChainConfig(providedChainConfig);
      }

      this.walletAdapters[adapter.name] = adapter;
      return this;
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      if (!storageAvailable(this.storage)) return;
      window[this.storage].removeItem(ADAPTER_CACHE_KEY);
      this.cachedAdapter = null;
    }
    /**
     * Connect to a specific wallet adapter
     * @param walletName - Key of the walletAdapter to use.
     */

  }, {
    key: "connectTo",
    value: function () {
      var _connectTo = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(walletName, loginParams) {
        var provider;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.walletAdapters[walletName]) {
                  _context2.next = 2;
                  break;
                }

                throw WalletInitializationError.notFound("Please add wallet adapter for ".concat(walletName, " wallet, before connecting"));

              case 2:
                _context2.next = 4;
                return this.walletAdapters[walletName].connect(loginParams);

              case 4:
                provider = _context2.sent;
                return _context2.abrupt("return", provider);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function connectTo(_x, _x2) {
        return _connectTo.apply(this, arguments);
      }

      return connectTo;
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var options,
            _args3 = arguments;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {
                  cleanup: false
                };

                if (!(this.status !== ADAPTER_STATUS.CONNECTED || !this.connectedAdapterName)) {
                  _context3.next = 3;
                  break;
                }

                throw WalletLoginError.notConnectedError("No wallet is connected");

              case 3:
                _context3.next = 5;
                return this.walletAdapters[this.connectedAdapterName].disconnect(options);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function logout() {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: "getUserInfo",
    value: function () {
      var _getUserInfo = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                log.debug("Getting user info", this.status, this.connectedAdapterName);

                if (!(this.status !== ADAPTER_STATUS.CONNECTED || !this.connectedAdapterName)) {
                  _context4.next = 3;
                  break;
                }

                throw WalletLoginError.notConnectedError("No wallet is connected");

              case 3:
                return _context4.abrupt("return", this.walletAdapters[this.connectedAdapterName].getUserInfo());

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getUserInfo() {
        return _getUserInfo.apply(this, arguments);
      }

      return getUserInfo;
    }()
  }, {
    key: "authenticateUser",
    value: function () {
      var _authenticateUser = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.status !== ADAPTER_STATUS.CONNECTED || !this.connectedAdapterName)) {
                  _context5.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError("No wallet is connected");

              case 2:
                return _context5.abrupt("return", this.walletAdapters[this.connectedAdapterName].authenticateUser());

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function authenticateUser() {
        return _authenticateUser.apply(this, arguments);
      }

      return authenticateUser;
    }()
  }, {
    key: "addPlugin",
    value: function () {
      var _addPlugin = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(plugin) {
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this.plugins[plugin.name]) {
                  _context6.next = 2;
                  break;
                }

                throw new Error("Plugin ".concat(plugin.name, " already exist"));

              case 2:
                if (!(plugin.pluginNamespace !== PLUGIN_NAMESPACES.MULTICHAIN && plugin.pluginNamespace !== this.coreOptions.chainConfig.chainNamespace)) {
                  _context6.next = 4;
                  break;
                }

                throw new Error("This plugin belongs to ".concat(plugin.pluginNamespace, " namespace which is incompatible with currently used namespace: ").concat(this.coreOptions.chainConfig.chainNamespace));

              case 4:
                this.plugins[plugin.name] = plugin;
                _context6.next = 7;
                return plugin.initWithWeb3Auth(this);

              case 7:
                return _context6.abrupt("return", this);

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function addPlugin(_x3) {
        return _addPlugin.apply(this, arguments);
      }

      return addPlugin;
    }()
  }, {
    key: "subscribeToAdapterEvents",
    value: function subscribeToAdapterEvents(walletAdapter) {
      var _this3 = this;

      walletAdapter.on(ADAPTER_EVENTS.CONNECTED, /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(data) {
          return regenerator.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _this3.status = ADAPTER_STATUS.CONNECTED;
                  _this3.connectedAdapterName = data.adapter;

                  _this3.cacheWallet(data.adapter);

                  log.debug("connected", _this3.status, _this3.connectedAdapterName);
                  _context7.next = 6;
                  return Promise.all(Object.values(_this3.plugins).map(function (plugin) {
                    return plugin.connect().catch(function (error) {
                      // swallow error if connector adapter doesn't supports this plugin.
                      if (error.code === 5211) {
                        return;
                      } // throw error;


                      log.error(error);
                    });
                  }));

                case 6:
                  _this3.emit(ADAPTER_EVENTS.CONNECTED, _objectSpread$1({}, data));

                case 7:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        return function (_x4) {
          return _ref.apply(this, arguments);
        };
      }());
      walletAdapter.on(ADAPTER_EVENTS.DISCONNECTED, /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(data) {
          var cachedAdapter;
          return regenerator.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  // get back to ready state for rehydrating.
                  _this3.status = ADAPTER_STATUS.READY;

                  if (storageAvailable(_this3.storage)) {
                    cachedAdapter = window[_this3.storage].getItem(ADAPTER_CACHE_KEY);

                    if (_this3.connectedAdapterName === cachedAdapter) {
                      _this3.clearCache();
                    }
                  }

                  log.debug("disconnected", _this3.status, _this3.connectedAdapterName);
                  _context8.next = 5;
                  return Promise.all(Object.values(_this3.plugins).map(function (plugin) {
                    return plugin.disconnect().catch(function (error) {
                      // swallow error if adapter doesn't supports this plugin.
                      if (error.code === 5211) {
                        return;
                      } // throw error;


                      log.error(error);
                    });
                  }));

                case 5:
                  _this3.connectedAdapterName = null;

                  _this3.emit(ADAPTER_EVENTS.DISCONNECTED, data);

                case 7:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8);
        }));

        return function (_x5) {
          return _ref2.apply(this, arguments);
        };
      }());
      walletAdapter.on(ADAPTER_EVENTS.CONNECTING, function (data) {
        _this3.status = ADAPTER_STATUS.CONNECTING;

        _this3.emit(ADAPTER_EVENTS.CONNECTING, data);

        log.debug("connecting", _this3.status, _this3.connectedAdapterName);
      });
      walletAdapter.on(ADAPTER_EVENTS.ERRORED, function (data) {
        _this3.status = ADAPTER_STATUS.ERRORED;

        _this3.clearCache();

        _this3.emit(ADAPTER_EVENTS.ERRORED, data);

        log.debug("errored", _this3.status, _this3.connectedAdapterName);
      });
      walletAdapter.on(ADAPTER_EVENTS.ADAPTER_DATA_UPDATED, function (data) {
        log.debug("adapter data updated", data);

        _this3.emit(ADAPTER_EVENTS.ADAPTER_DATA_UPDATED, data);
      });
    }
  }, {
    key: "checkInitRequirements",
    value: function checkInitRequirements() {
      if (this.status === ADAPTER_STATUS.CONNECTING) throw WalletInitializationError.notReady("Already pending connection");
      if (this.status === ADAPTER_STATUS.CONNECTED) throw WalletInitializationError.notReady("Already connected");
      if (this.status === ADAPTER_STATUS.READY) throw WalletInitializationError.notReady("Adapter is already initialized");
    }
  }, {
    key: "cacheWallet",
    value: function cacheWallet(walletName) {
      if (!storageAvailable(this.storage)) return;
      window[this.storage].setItem(ADAPTER_CACHE_KEY, walletName);
      this.cachedAdapter = walletName;
    }
  }]);

  return Web3AuthCore;
}(SafeEventEmitter);

export { Web3AuthCore };
