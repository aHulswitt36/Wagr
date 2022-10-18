import { _ as _inherits, a as _getPrototypeOf, b as _possibleConstructorReturn, c as _classCallCheck, d as _defineProperty, e as _assertThisInitialized, A as ADAPTER_NAMESPACES, C as CHAIN_NAMESPACES, f as ADAPTER_CATEGORY, W as WALLET_ADAPTERS, g as ADAPTER_STATUS, j as _createClass, k as _asyncToGenerator, r as regenerator, m as ADAPTER_EVENTS, l as log, i as WalletInitializationError, n as WalletLoginError, h as getChainConfig } from './base.esm-8d0d3561.js';
import { _ as _get } from './get-f1dc166f.js';
import { B as BaseEvmAdapter } from './baseEvmAdapter.esm-ba61ad7f.js';

/**
 * Returns a Promise that resolves to the value of window.ethereum if it is
 * set within the given timeout, or null.
 * The Promise will not reject, but an error will be thrown if invalid options
 * are provided.
 *
 * @param options - Options bag.
 * @param options.mustBeMetaMask - Whether to only look for MetaMask providers.
 * Default: false
 * @param options.silent - Whether to silence console errors. Does not affect
 * thrown errors. Default: false
 * @param options.timeout - Milliseconds to wait for 'ethereum#initialized' to
 * be dispatched. Default: 3000
 * @returns A Promise that resolves with the Provider if it is detected within
 * given timeout, otherwise null.
 */
function detectEthereumProvider({ mustBeMetaMask = false, silent = false, timeout = 3000, } = {}) {
    _validateInputs();
    let handled = false;
    return new Promise((resolve) => {
        if (window.ethereum) {
            handleEthereum();
        }
        else {
            window.addEventListener('ethereum#initialized', handleEthereum, { once: true });
            setTimeout(() => {
                handleEthereum();
            }, timeout);
        }
        function handleEthereum() {
            if (handled) {
                return;
            }
            handled = true;
            window.removeEventListener('ethereum#initialized', handleEthereum);
            const { ethereum } = window;
            if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask)) {
                resolve(ethereum);
            }
            else {
                const message = mustBeMetaMask && ethereum
                    ? 'Non-MetaMask window.ethereum detected.'
                    : 'Unable to detect window.ethereum.';
                !silent && console.error('@metamask/detect-provider:', message);
                resolve(null);
            }
        }
    });
    function _validateInputs() {
        if (typeof mustBeMetaMask !== 'boolean') {
            throw new Error(`@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.`);
        }
        if (typeof silent !== 'boolean') {
            throw new Error(`@metamask/detect-provider: Expected option 'silent' to be a boolean.`);
        }
        if (typeof timeout !== 'number') {
            throw new Error(`@metamask/detect-provider: Expected option 'timeout' to be a number.`);
        }
    }
}
var dist = detectEthereumProvider;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var MetamaskAdapter = /*#__PURE__*/function (_BaseEvmAdapter) {
  _inherits(MetamaskAdapter, _BaseEvmAdapter);

  var _super = _createSuper(MetamaskAdapter);

  function MetamaskAdapter(adapterOptions) {
    var _this;

    _classCallCheck(this, MetamaskAdapter);

    _this = _super.call(this, adapterOptions);

    _defineProperty(_assertThisInitialized(_this), "adapterNamespace", ADAPTER_NAMESPACES.EIP155);

    _defineProperty(_assertThisInitialized(_this), "currentChainNamespace", CHAIN_NAMESPACES.EIP155);

    _defineProperty(_assertThisInitialized(_this), "type", ADAPTER_CATEGORY.EXTERNAL);

    _defineProperty(_assertThisInitialized(_this), "name", WALLET_ADAPTERS.METAMASK);

    _defineProperty(_assertThisInitialized(_this), "status", ADAPTER_STATUS.NOT_READY);

    _defineProperty(_assertThisInitialized(_this), "rehydrated", false);

    _defineProperty(_assertThisInitialized(_this), "metamaskProvider", null);

    _this.chainConfig = (adapterOptions === null || adapterOptions === void 0 ? void 0 : adapterOptions.chainConfig) || null;
    _this.sessionTime = (adapterOptions === null || adapterOptions === void 0 ? void 0 : adapterOptions.sessionTime) || 86400;
    return _this;
  }

  _createClass(MetamaskAdapter, [{
    key: "provider",
    get: function get() {
      if (this.status === ADAPTER_STATUS.CONNECTED && this.metamaskProvider) {
        return this.metamaskProvider;
      }

      return null;
    },
    set: function set(_) {
      throw new Error("Not implemented");
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(options) {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _get(_getPrototypeOf(MetamaskAdapter.prototype), "checkInitializationRequirements", this).call(this);

                _context.next = 3;
                return dist({
                  mustBeMetaMask: true
                });

              case 3:
                this.metamaskProvider = _context.sent;

                if (this.metamaskProvider) {
                  _context.next = 6;
                  break;
                }

                throw WalletInitializationError.notInstalled("Metamask extension is not installed");

              case 6:
                this.status = ADAPTER_STATUS.READY;
                this.emit(ADAPTER_EVENTS.READY, WALLET_ADAPTERS.METAMASK);
                _context.prev = 8;
                log.debug("initializing metamask adapter");

                if (!options.autoConnect) {
                  _context.next = 14;
                  break;
                }

                this.rehydrated = true;
                _context.next = 14;
                return this.connect();

              case 14:
                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](8);
                this.emit(ADAPTER_EVENTS.ERRORED, _context.t0);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 16]]);
      }));

      function init(_x) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
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
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var _this2 = this;

        var chainId;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _get(_getPrototypeOf(MetamaskAdapter.prototype), "checkConnectionRequirements", this).call(this); // set default to mainnet


                if (!this.chainConfig) this.chainConfig = getChainConfig(CHAIN_NAMESPACES.EIP155, 1);
                this.status = ADAPTER_STATUS.CONNECTING;
                this.emit(ADAPTER_EVENTS.CONNECTING, {
                  adapter: WALLET_ADAPTERS.METAMASK
                });

                if (this.metamaskProvider) {
                  _context2.next = 6;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not able to connect with metamask");

              case 6:
                _context2.prev = 6;
                _context2.next = 9;
                return this.metamaskProvider.request({
                  method: "eth_requestAccounts"
                });

              case 9:
                chainId = this.metamaskProvider.chainId;

                if (!(chainId !== this.chainConfig.chainId)) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 13;
                return this.switchChain(this.chainConfig);

              case 13:
                this.status = ADAPTER_STATUS.CONNECTED;

                if (this.provider) {
                  _context2.next = 16;
                  break;
                }

                throw WalletLoginError.notConnectedError("Failed to connect with provider");

              case 16:
                this.provider.once("disconnect", function () {
                  // ready to be connected again
                  _this2.disconnect();
                });
                this.emit(ADAPTER_EVENTS.CONNECTED, {
                  adapter: WALLET_ADAPTERS.METAMASK,
                  reconnected: this.rehydrated
                });
                return _context2.abrupt("return", this.provider);

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](6);
                // ready again to be connected
                this.status = ADAPTER_STATUS.READY;
                this.rehydrated = false;
                this.emit(ADAPTER_EVENTS.ERRORED, _context2.t0);
                throw WalletLoginError.connectionError("Failed to login with metamask wallet");

              case 27:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 21]]);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var _this$provider;

        var options,
            _args3 = arguments;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {
                  cleanup: false
                };
                _context3.next = 3;
                return _get(_getPrototypeOf(MetamaskAdapter.prototype), "disconnect", this).call(this);

              case 3:
                (_this$provider = this.provider) === null || _this$provider === void 0 ? void 0 : _this$provider.removeAllListeners();

                if (options.cleanup) {
                  this.status = ADAPTER_STATUS.NOT_READY;
                  this.metamaskProvider = null;
                } else {
                  // ready to be connected again
                  this.status = ADAPTER_STATUS.READY;
                }

                this.rehydrated = false;
                this.emit(ADAPTER_EVENTS.DISCONNECTED);

              case 7:
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
    key: "getUserInfo",
    value: function () {
      var _getUserInfo = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
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
                return _context4.abrupt("return", {});

              case 3:
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
    key: "switchChain",
    value: function () {
      var _switchChain = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(chainConfig) {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.metamaskProvider) {
                  _context5.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet");

              case 2:
                _context5.prev = 2;
                _context5.next = 5;
                return this.metamaskProvider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{
                    chainId: chainConfig.chainId
                  }]
                });

              case 5:
                _context5.next = 15;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](2);

                if (!(_context5.t0.code === 4902)) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 12;
                return this.metamaskProvider.request({
                  method: "wallet_addEthereumChain",
                  params: [{
                    chainId: chainConfig.chainId,
                    chainName: chainConfig.displayName,
                    rpcUrls: [chainConfig.rpcTarget]
                  }]
                });

              case 12:
                _context5.next = 15;
                break;

              case 14:
                throw _context5.t0;

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 7]]);
      }));

      function switchChain(_x2) {
        return _switchChain.apply(this, arguments);
      }

      return switchChain;
    }()
  }]);

  return MetamaskAdapter;
}(BaseEvmAdapter);

export { MetamaskAdapter };
