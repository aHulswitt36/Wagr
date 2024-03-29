import { _ as _inherits, a as _getPrototypeOf, b as _possibleConstructorReturn, c as _classCallCheck, d as _defineProperty, e as _assertThisInitialized, W as WALLET_ADAPTERS, A as ADAPTER_NAMESPACES, C as CHAIN_NAMESPACES, f as ADAPTER_CATEGORY, g as ADAPTER_STATUS, m as ADAPTER_EVENTS, j as _createClass, k as _asyncToGenerator, r as regenerator, l as log, i as WalletInitializationError, h as getChainConfig, n as WalletLoginError, am as Web3AuthError } from './base.esm-8d0d3561.js';
import { _ as _get } from './get-f1dc166f.js';
import { B as BaseSolanaAdapter } from './baseSolanaAdapter.esm-3ebd12c5.js';
import { a as PhantomInjectedProvider } from './solanaProvider.esm-42006f2d.js';
import './baseProvider.esm-65309567.js';
import './browser-861d5d75.js';
import './nacl-fast-5296a4a6.js';

function poll(callback, interval, count) {
  return new Promise(function (resolve, reject) {
    if (count > 0) {
      setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var done;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return callback();

              case 2:
                done = _context.sent;
                if (done) resolve(done);
                if (!done) poll(callback, interval, count - 1).then(function (res) {
                  resolve(res);
                  return res;
                }).catch(function (err) {
                  return reject(err);
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })), interval);
    } else {
      resolve(false);
    }
  });
}
var detectProvider = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
    var _window$solana;

    var options,
        isPhantomAvailable,
        isAvailable,
        _args2 = arguments;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {
              interval: 1000,
              count: 3
            };
            isPhantomAvailable = typeof window !== "undefined" && !!((_window$solana = window.solana) !== null && _window$solana !== void 0 && _window$solana.isPhantom);

            if (!isPhantomAvailable) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", window.solana);

          case 4:
            _context2.next = 6;
            return poll(function () {
              var _window$solana2;

              return (_window$solana2 = window.solana) === null || _window$solana2 === void 0 ? void 0 : _window$solana2.isPhantom;
            }, options.interval, options.count);

          case 6:
            isAvailable = _context2.sent;

            if (!isAvailable) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", window.solana);

          case 9:
            return _context2.abrupt("return", null);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function detectProvider() {
    return _ref2.apply(this, arguments);
  };
}();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var PhantomAdapter = /*#__PURE__*/function (_BaseSolanaAdapter) {
  _inherits(PhantomAdapter, _BaseSolanaAdapter);

  var _super = _createSuper(PhantomAdapter);

  function PhantomAdapter(options) {
    var _this;

    _classCallCheck(this, PhantomAdapter);

    _this = _super.call(this, options);

    _defineProperty(_assertThisInitialized(_this), "name", WALLET_ADAPTERS.PHANTOM);

    _defineProperty(_assertThisInitialized(_this), "adapterNamespace", ADAPTER_NAMESPACES.SOLANA);

    _defineProperty(_assertThisInitialized(_this), "currentChainNamespace", CHAIN_NAMESPACES.SOLANA);

    _defineProperty(_assertThisInitialized(_this), "type", ADAPTER_CATEGORY.EXTERNAL);

    _defineProperty(_assertThisInitialized(_this), "status", ADAPTER_STATUS.NOT_READY);

    _defineProperty(_assertThisInitialized(_this), "_wallet", null);

    _defineProperty(_assertThisInitialized(_this), "phantomProvider", null);

    _defineProperty(_assertThisInitialized(_this), "rehydrated", false);

    _defineProperty(_assertThisInitialized(_this), "_onDisconnect", function () {
      if (_this._wallet) {
        _this._wallet.off("disconnect", _this._onDisconnect);

        _this.rehydrated = false; // ready to be connected again only if it was previously connected and not cleaned up

        _this.status = _this.status === ADAPTER_STATUS.CONNECTED ? ADAPTER_STATUS.READY : ADAPTER_STATUS.NOT_READY;

        _this.emit(ADAPTER_EVENTS.DISCONNECTED);
      }
    });

    _this.chainConfig = (options === null || options === void 0 ? void 0 : options.chainConfig) || null;
    _this.sessionTime = (options === null || options === void 0 ? void 0 : options.sessionTime) || 86400;
    return _this;
  }

  _createClass(PhantomAdapter, [{
    key: "isWalletConnected",
    get: function get() {
      var _this$_wallet;

      return !!((_this$_wallet = this._wallet) !== null && _this$_wallet !== void 0 && _this$_wallet.isConnected && this.status === ADAPTER_STATUS.CONNECTED);
    }
  }, {
    key: "provider",
    get: function get() {
      var _this$phantomProvider;

      return ((_this$phantomProvider = this.phantomProvider) === null || _this$phantomProvider === void 0 ? void 0 : _this$phantomProvider.provider) || null;
    },
    set: function set(_) {
      throw new Error("Not implemented");
    }
  }, {
    key: "setAdapterSettings",
    value: function setAdapterSettings(options) {
      if (this.status === ADAPTER_STATUS.READY) return;

      if (options !== null && options !== void 0 && options.sessionTime) {
        this.sessionTime = options.sessionTime;
      }

      if (options !== null && options !== void 0 && options.clientId) {
        this.clientId = options.clientId;
      }
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(options) {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _get(_getPrototypeOf(PhantomAdapter.prototype), "checkInitializationRequirements", this).call(this); // set chainConfig for mainnet by default if not set


                if (!this.chainConfig) {
                  this.chainConfig = getChainConfig(CHAIN_NAMESPACES.SOLANA, "0x1");
                }

                _context.next = 4;
                return detectProvider({
                  interval: 500,
                  count: 3
                });

              case 4:
                this._wallet = _context.sent;

                if (this._wallet) {
                  _context.next = 7;
                  break;
                }

                throw WalletInitializationError.notInstalled();

              case 7:
                this.phantomProvider = new PhantomInjectedProvider({
                  config: {
                    chainConfig: this.chainConfig
                  }
                });
                this.status = ADAPTER_STATUS.READY;
                this.emit(ADAPTER_EVENTS.READY, WALLET_ADAPTERS.PHANTOM);
                _context.prev = 10;
                log.debug("initializing phantom adapter");

                if (!options.autoConnect) {
                  _context.next = 16;
                  break;
                }

                this.rehydrated = true;
                _context.next = 16;
                return this.connect();

              case 16:
                _context.next = 22;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](10);
                log.error("Failed to connect with cached phantom provider", _context.t0);
                this.emit("ERRORED", _context.t0);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[10, 18]]);
      }));

      function init(_x) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var _this2 = this;

        var handleDisconnect;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                _get(_getPrototypeOf(PhantomAdapter.prototype), "checkConnectionRequirements", this).call(this);

                this.status = ADAPTER_STATUS.CONNECTING;
                this.emit(ADAPTER_EVENTS.CONNECTING, {
                  adapter: WALLET_ADAPTERS.PHANTOM
                });

                if (this._wallet) {
                  _context3.next = 6;
                  break;
                }

                throw WalletInitializationError.notInstalled();

              case 6:
                if (this._wallet.isConnected) {
                  _context3.next = 23;
                  break;
                }

                handleDisconnect = this._wallet._handleDisconnect;
                _context3.prev = 8;
                _context3.next = 11;
                return new Promise(function (resolve, reject) {
                  var connect = /*#__PURE__*/function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
                      return regenerator.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return _this2.connectWithProvider(_this2._wallet);

                            case 2:
                              resolve(_this2.provider);

                            case 3:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    return function connect() {
                      return _ref.apply(this, arguments);
                    };
                  }();

                  if (!_this2._wallet) return reject(WalletInitializationError.notInstalled());

                  _this2._wallet.once("connect", connect); // Raise an issue on phantom that if window is closed, disconnect event is not fired


                  _this2._wallet._handleDisconnect = function () {
                    reject(WalletInitializationError.windowClosed());

                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                      args[_key] = arguments[_key];
                    }

                    return handleDisconnect.apply(_this2._wallet, args);
                  };

                  _this2._wallet.connect().catch(function (reason) {
                    reject(reason);
                  });
                });

              case 11:
                _context3.next = 18;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](8);

                if (!(_context3.t0 instanceof Web3AuthError)) {
                  _context3.next = 17;
                  break;
                }

                throw _context3.t0;

              case 17:
                throw WalletLoginError.connectionError(_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message);

              case 18:
                _context3.prev = 18;
                this._wallet._handleDisconnect = handleDisconnect;
                return _context3.finish(18);

              case 21:
                _context3.next = 25;
                break;

              case 23:
                _context3.next = 25;
                return this.connectWithProvider(this._wallet);

              case 25:
                if (this._wallet.publicKey) {
                  _context3.next = 27;
                  break;
                }

                throw WalletLoginError.connectionError();

              case 27:
                this._wallet.on("disconnect", this._onDisconnect);

                return _context3.abrupt("return", this.provider);

              case 31:
                _context3.prev = 31;
                _context3.t1 = _context3["catch"](0);
                // ready again to be connected
                this.status = ADAPTER_STATUS.READY;
                this.rehydrated = false;
                this.emit(ADAPTER_EVENTS.ERRORED, _context3.t1);
                throw _context3.t1;

              case 37:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 31], [8, 13, 18, 21]]);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        var options,
            _this$_wallet2,
            _args4 = arguments;

        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {
                  cleanup: false
                };
                _context4.next = 3;
                return _get(_getPrototypeOf(PhantomAdapter.prototype), "disconnect", this).call(this);

              case 3:
                _context4.prev = 3;
                _context4.next = 6;
                return (_this$_wallet2 = this._wallet) === null || _this$_wallet2 === void 0 ? void 0 : _this$_wallet2.disconnect();

              case 6:
                if (options.cleanup) {
                  this.status = ADAPTER_STATUS.NOT_READY;
                  this.phantomProvider = null;
                  this._wallet = null;
                }

                this.emit(ADAPTER_EVENTS.DISCONNECTED);
                _context4.next = 13;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](3);
                this.emit(ADAPTER_EVENTS.ERRORED, WalletLoginError.disconnectionError(_context4.t0 === null || _context4.t0 === void 0 ? void 0 : _context4.t0.message));

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 10]]);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "getUserInfo",
    value: function () {
      var _getUserInfo = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.isWalletConnected) {
                  _context5.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet, Please login/connect first");

              case 2:
                return _context5.abrupt("return", {});

              case 3:
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
    }()
  }, {
    key: "connectWithProvider",
    value: function () {
      var _connectWithProvider = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(injectedProvider) {
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.phantomProvider) {
                  _context6.next = 2;
                  break;
                }

                throw WalletLoginError.connectionError("No phantom provider");

              case 2:
                _context6.next = 4;
                return this.phantomProvider.setupProvider(injectedProvider);

              case 4:
                this.status = ADAPTER_STATUS.CONNECTED;
                this.emit(ADAPTER_EVENTS.CONNECTED, {
                  adapter: WALLET_ADAPTERS.PHANTOM,
                  reconnected: this.rehydrated
                });
                return _context6.abrupt("return", this.provider);

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function connectWithProvider(_x2) {
        return _connectWithProvider.apply(this, arguments);
      }

      return connectWithProvider;
    }()
  }]);

  return PhantomAdapter;
}(BaseSolanaAdapter);

export { PhantomAdapter };
