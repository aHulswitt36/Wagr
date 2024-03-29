import { O as OPENLOGIN_NETWORK, U as UX_MODE, g as getHashQueryParams, a as OpenLogin, _ as _get, S as SUPPORTED_KEY_CURVES } from './get-f1dc166f.js';
import { _ as _inherits, a as _getPrototypeOf, b as _possibleConstructorReturn, c as _classCallCheck, d as _defineProperty, e as _assertThisInitialized, W as WALLET_ADAPTERS, A as ADAPTER_NAMESPACES, f as ADAPTER_CATEGORY, g as ADAPTER_STATUS, C as CHAIN_NAMESPACES, l as log, h as getChainConfig, i as WalletInitializationError, j as _createClass, k as _asyncToGenerator, r as regenerator, m as ADAPTER_EVENTS, n as WalletLoginError, o as lodash_merge, B as BaseAdapter } from './base.esm-8d0d3561.js';
import { C as CommonPrivateKeyProvider } from './baseProvider.esm-65309567.js';
import './browser-861d5d75.js';

var getOpenloginDefaultOptions = function getOpenloginDefaultOptions(chainNamespace, chainId) {
  return {
    adapterSettings: {
      network: OPENLOGIN_NETWORK.MAINNET,
      clientId: "",
      uxMode: UX_MODE.POPUP
    },
    chainConfig: chainNamespace ? getChainConfig(chainNamespace, chainId) : null,
    loginSettings: {}
  };
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var OpenloginAdapter = /*#__PURE__*/function (_BaseAdapter) {
  _inherits(OpenloginAdapter, _BaseAdapter);

  var _super = _createSuper(OpenloginAdapter);

  function OpenloginAdapter(params) {
    var _params$chainConfig, _params$chainConfig2, _params$adapterSettin, _params$chainConfig3;

    var _this;

    _classCallCheck(this, OpenloginAdapter);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "name", WALLET_ADAPTERS.OPENLOGIN);

    _defineProperty(_assertThisInitialized(_this), "adapterNamespace", ADAPTER_NAMESPACES.MULTICHAIN);

    _defineProperty(_assertThisInitialized(_this), "type", ADAPTER_CATEGORY.IN_APP);

    _defineProperty(_assertThisInitialized(_this), "openloginInstance", null);

    _defineProperty(_assertThisInitialized(_this), "clientId", void 0);

    _defineProperty(_assertThisInitialized(_this), "status", ADAPTER_STATUS.NOT_READY);

    _defineProperty(_assertThisInitialized(_this), "currentChainNamespace", CHAIN_NAMESPACES.EIP155);

    _defineProperty(_assertThisInitialized(_this), "openloginOptions", void 0);

    _defineProperty(_assertThisInitialized(_this), "loginSettings", {});

    _defineProperty(_assertThisInitialized(_this), "privKeyProvider", null);

    log.debug("const openlogin adapter", params);
    var defaultOptions = getOpenloginDefaultOptions((_params$chainConfig = params.chainConfig) === null || _params$chainConfig === void 0 ? void 0 : _params$chainConfig.chainNamespace, (_params$chainConfig2 = params.chainConfig) === null || _params$chainConfig2 === void 0 ? void 0 : _params$chainConfig2.chainId);
    _this.openloginOptions = _objectSpread(_objectSpread({
      clientId: "",
      network: OPENLOGIN_NETWORK.MAINNET
    }, defaultOptions.adapterSettings), params.adapterSettings || {});
    _this.clientId = (_params$adapterSettin = params.adapterSettings) === null || _params$adapterSettin === void 0 ? void 0 : _params$adapterSettin.clientId;
    _this.loginSettings = _objectSpread(_objectSpread({}, defaultOptions.loginSettings), params.loginSettings);
    _this.sessionTime = _this.loginSettings.sessionTime || 86400; // if no chainNamespace is passed then chain config should be set before calling init

    if ((_params$chainConfig3 = params.chainConfig) !== null && _params$chainConfig3 !== void 0 && _params$chainConfig3.chainNamespace) {
      var _params$chainConfig4;

      _this.currentChainNamespace = (_params$chainConfig4 = params.chainConfig) === null || _params$chainConfig4 === void 0 ? void 0 : _params$chainConfig4.chainNamespace;
      var defaultChainIdConfig = defaultOptions.chainConfig ? defaultOptions.chainConfig : {};
      _this.chainConfig = _objectSpread(_objectSpread({}, defaultChainIdConfig), params === null || params === void 0 ? void 0 : params.chainConfig);
      log.debug("const openlogin chainConfig", _this.chainConfig);

      if (!_this.chainConfig.rpcTarget && params.chainConfig.chainNamespace !== CHAIN_NAMESPACES.OTHER) {
        throw WalletInitializationError.invalidParams("rpcTarget is required in chainConfig");
      }
    }

    return _this;
  }

  _createClass(OpenloginAdapter, [{
    key: "chainConfigProxy",
    get: function get() {
      return this.chainConfig ? _objectSpread({}, this.chainConfig) : null;
    }
  }, {
    key: "provider",
    get: function get() {
      var _this$privKeyProvider;

      return ((_this$privKeyProvider = this.privKeyProvider) === null || _this$privKeyProvider === void 0 ? void 0 : _this$privKeyProvider.provider) || null;
    },
    set: function set(_) {
      throw new Error("Not implemented");
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(options) {
        var _this$openloginOption;

        var isRedirectResult, redirectResult;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _get(_getPrototypeOf(OpenloginAdapter.prototype), "checkInitializationRequirements", this).call(this);

                if ((_this$openloginOption = this.openloginOptions) !== null && _this$openloginOption !== void 0 && _this$openloginOption.clientId) {
                  _context.next = 3;
                  break;
                }

                throw WalletInitializationError.invalidParams("clientId is required before openlogin's initialization");

              case 3:
                if (this.chainConfig) {
                  _context.next = 5;
                  break;
                }

                throw WalletInitializationError.invalidParams("chainConfig is required before initialization");

              case 5:
                isRedirectResult = false;

                if (this.openloginOptions.uxMode === UX_MODE.REDIRECT) {
                  redirectResult = getHashQueryParams();

                  if (Object.keys(redirectResult).length > 0 && redirectResult._pid) {
                    isRedirectResult = true;
                  }
                }

                this.openloginOptions = _objectSpread(_objectSpread({}, this.openloginOptions), {}, {
                  replaceUrlOnRedirect: isRedirectResult
                });
                this.openloginInstance = new OpenLogin(this.openloginOptions);
                log.debug("initializing openlogin adapter init");
                _context.next = 12;
                return this.openloginInstance.init();

              case 12:
                this.status = ADAPTER_STATUS.READY;
                this.emit(ADAPTER_EVENTS.READY, WALLET_ADAPTERS.OPENLOGIN);
                _context.prev = 14;
                log.debug("initializing openlogin adapter"); // connect only if it is redirect result or if connect (adapter is cached/already connected in same session) is true

                if (!(this.openloginInstance.privKey && (options.autoConnect || isRedirectResult))) {
                  _context.next = 19;
                  break;
                }

                _context.next = 19;
                return this.connect();

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](14);
                log.error("Failed to connect with cached openlogin provider", _context.t0);
                this.emit("ERRORED", _context.t0);

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[14, 21]]);
      }));

      function init(_x) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(params) {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _get(_getPrototypeOf(OpenloginAdapter.prototype), "checkConnectionRequirements", this).call(this);

                this.status = ADAPTER_STATUS.CONNECTING;
                this.emit(ADAPTER_EVENTS.CONNECTING, _objectSpread(_objectSpread({}, params), {}, {
                  adapter: WALLET_ADAPTERS.OPENLOGIN
                }));
                _context2.prev = 3;
                _context2.next = 6;
                return this.connectWithProvider(params);

              case 6:
                return _context2.abrupt("return", this.provider);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](3);
                log.error("Failed to connect with openlogin provider", _context2.t0); // ready again to be connected

                this.status = ADAPTER_STATUS.READY;
                this.emit(ADAPTER_EVENTS.ERRORED, _context2.t0);

                if (!(_context2.t0 !== null && _context2.t0 !== void 0 && _context2.t0.message.includes("user closed popup"))) {
                  _context2.next = 16;
                  break;
                }

                throw WalletLoginError.popupClosed();

              case 16:
                throw WalletLoginError.connectionError("Failed to login with openlogin");

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 9]]);
      }));

      function connect(_x2) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var options,
            _args3 = arguments;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {
                  cleanup: false
                };

                if (!(this.status !== ADAPTER_STATUS.CONNECTED)) {
                  _context3.next = 3;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet");

              case 3:
                if (this.openloginInstance) {
                  _context3.next = 5;
                  break;
                }

                throw WalletInitializationError.notReady("openloginInstance is not ready");

              case 5:
                _context3.next = 7;
                return this.openloginInstance.logout();

              case 7:
                if (options.cleanup) {
                  this.status = ADAPTER_STATUS.NOT_READY;
                  this.openloginInstance = null;
                  this.privKeyProvider = null;
                } else {
                  // ready to be connected again
                  this.status = ADAPTER_STATUS.READY;
                }

                this.emit(ADAPTER_EVENTS.DISCONNECTED);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "authenticateUser",
    value: function () {
      var _authenticateUser = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        var userInfo;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.status !== ADAPTER_STATUS.CONNECTED)) {
                  _context4.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet, Please login/connect first");

              case 2:
                _context4.next = 4;
                return this.getUserInfo();

              case 4:
                userInfo = _context4.sent;
                return _context4.abrupt("return", {
                  idToken: userInfo.idToken
                });

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function authenticateUser() {
        return _authenticateUser.apply(this, arguments);
      }

      return authenticateUser;
    }()
  }, {
    key: "getUserInfo",
    value: function () {
      var _getUserInfo = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        var userInfo;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.status !== ADAPTER_STATUS.CONNECTED)) {
                  _context5.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet");

              case 2:
                if (this.openloginInstance) {
                  _context5.next = 4;
                  break;
                }

                throw WalletInitializationError.notReady("openloginInstance is not ready");

              case 4:
                _context5.next = 6;
                return this.openloginInstance.getUserInfo();

              case 6:
                userInfo = _context5.sent;
                return _context5.abrupt("return", userInfo);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getUserInfo() {
        return _getUserInfo.apply(this, arguments);
      }

      return getUserInfo;
    }() // should be called only before initialization.

  }, {
    key: "setAdapterSettings",
    value: function setAdapterSettings(adapterSettings) {
      if (this.status === ADAPTER_STATUS.READY) return;
      var defaultOptions = getOpenloginDefaultOptions();
      this.openloginOptions = _objectSpread(_objectSpread(_objectSpread({}, defaultOptions.adapterSettings), this.openloginOptions || {}), adapterSettings);

      if (adapterSettings.sessionTime) {
        this.loginSettings = _objectSpread(_objectSpread({}, this.loginSettings), {}, {
          sessionTime: adapterSettings.sessionTime
        });
      }

      if (adapterSettings.clientId) {
        this.clientId = adapterSettings.clientId;
      }
    } // should be called only before initialization.

  }, {
    key: "setChainConfig",
    value: function setChainConfig(customChainConfig) {
      _get(_getPrototypeOf(OpenloginAdapter.prototype), "setChainConfig", this).call(this, customChainConfig);

      this.currentChainNamespace = customChainConfig.chainNamespace;
    }
  }, {
    key: "connectWithProvider",
    value: function () {
      var _connectWithProvider = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(params) {
        var _yield$import, SolanaPrivateKeyProvider, _yield$import2, EthereumPrivateKeyProvider, _params$extraLoginOpt, finalPrivKey, _yield$import3, getED25519Key;

        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.chainConfig) {
                  _context6.next = 2;
                  break;
                }

                throw WalletInitializationError.invalidParams("chainConfig is required before initialization");

              case 2:
                if (this.openloginInstance) {
                  _context6.next = 4;
                  break;
                }

                throw WalletInitializationError.notReady("openloginInstance is not ready");

              case 4:
                if (!(this.currentChainNamespace === CHAIN_NAMESPACES.SOLANA)) {
                  _context6.next = 12;
                  break;
                }

                _context6.next = 7;
                return import('./solanaProvider.esm-42006f2d.js').then(function (n) { return n.s; });

              case 7:
                _yield$import = _context6.sent;
                SolanaPrivateKeyProvider = _yield$import.SolanaPrivateKeyProvider;
                this.privKeyProvider = new SolanaPrivateKeyProvider({
                  config: {
                    chainConfig: this.chainConfig
                  }
                });
                _context6.next = 25;
                break;

              case 12:
                if (!(this.currentChainNamespace === CHAIN_NAMESPACES.EIP155)) {
                  _context6.next = 20;
                  break;
                }

                _context6.next = 15;
                return import('./ethereumProvider.esm-4beed9be.js');

              case 15:
                _yield$import2 = _context6.sent;
                EthereumPrivateKeyProvider = _yield$import2.EthereumPrivateKeyProvider;
                this.privKeyProvider = new EthereumPrivateKeyProvider({
                  config: {
                    chainConfig: this.chainConfig
                  }
                });
                _context6.next = 25;
                break;

              case 20:
                if (!(this.currentChainNamespace === CHAIN_NAMESPACES.OTHER)) {
                  _context6.next = 24;
                  break;
                }

                this.privKeyProvider = new CommonPrivateKeyProvider();
                _context6.next = 25;
                break;

              case 24:
                throw new Error("Invalid chainNamespace: ".concat(this.currentChainNamespace, " found while connecting to wallet"));

              case 25:
                if (!(!this.openloginInstance.privKey && params)) {
                  _context6.next = 29;
                  break;
                }

                if (!this.loginSettings.curve) {
                  this.loginSettings.curve = this.currentChainNamespace === CHAIN_NAMESPACES.SOLANA ? SUPPORTED_KEY_CURVES.ED25519 : SUPPORTED_KEY_CURVES.SECP256K1;
                }

                _context6.next = 29;
                return this.openloginInstance.login(lodash_merge(this.loginSettings, {
                  loginProvider: params.loginProvider
                }, {
                  extraLoginOptions: _objectSpread(_objectSpread({}, params.extraLoginOptions || {}), {}, {
                    login_hint: params.login_hint || ((_params$extraLoginOpt = params.extraLoginOptions) === null || _params$extraLoginOpt === void 0 ? void 0 : _params$extraLoginOpt.login_hint)
                  })
                }));

              case 29:
                finalPrivKey = this.openloginInstance.privKey;

                if (!finalPrivKey) {
                  _context6.next = 41;
                  break;
                }

                if (!(this.currentChainNamespace === CHAIN_NAMESPACES.SOLANA)) {
                  _context6.next = 37;
                  break;
                }

                _context6.next = 34;
                return import('./openloginEd25519.esm-e38963fe.js');

              case 34:
                _yield$import3 = _context6.sent;
                getED25519Key = _yield$import3.getED25519Key;
                finalPrivKey = getED25519Key(finalPrivKey).sk.toString("hex");

              case 37:
                _context6.next = 39;
                return this.privKeyProvider.setupProvider(finalPrivKey);

              case 39:
                this.status = ADAPTER_STATUS.CONNECTED;
                this.emit(ADAPTER_EVENTS.CONNECTED, {
                  adapter: WALLET_ADAPTERS.OPENLOGIN,
                  reconnected: !params
                });

              case 41:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function connectWithProvider(_x3) {
        return _connectWithProvider.apply(this, arguments);
      }

      return connectWithProvider;
    }()
  }]);

  return OpenloginAdapter;
}(BaseAdapter);

export { OpenloginAdapter, getOpenloginDefaultOptions };
