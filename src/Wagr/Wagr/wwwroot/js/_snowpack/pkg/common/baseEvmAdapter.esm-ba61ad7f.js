import { _ as _inherits, a as _getPrototypeOf, b as _possibleConstructorReturn, c as _classCallCheck, d as _defineProperty, e as _assertThisInitialized, j as _createClass, k as _asyncToGenerator, r as regenerator, n as WalletLoginError, an as saveToken, ao as verifySignedChallenge, ap as signChallenge, aq as getSavedToken, ar as checkIfTokenIsExpired, g as ADAPTER_STATUS, as as clearToken, B as BaseAdapter } from './base.esm-8d0d3561.js';

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var BaseEvmAdapter = /*#__PURE__*/function (_BaseAdapter) {
  _inherits(BaseEvmAdapter, _BaseAdapter);

  var _super = _createSuper(BaseEvmAdapter);

  function BaseEvmAdapter() {
    var _this;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BaseEvmAdapter);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "clientId", void 0);

    _this.clientId = params.clientId;
    return _this;
  }

  _createClass(BaseEvmAdapter, [{
    key: "authenticateUser",
    value: function () {
      var _authenticateUser = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var _this$chainConfig;

        var _this$chainConfig2, chainNamespace, chainId, accounts, existingToken, isExpired, payload, challenge, signedMessage, idToken;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!this.provider || !((_this$chainConfig = this.chainConfig) !== null && _this$chainConfig !== void 0 && _this$chainConfig.chainId))) {
                  _context.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError();

              case 2:
                _this$chainConfig2 = this.chainConfig, chainNamespace = _this$chainConfig2.chainNamespace, chainId = _this$chainConfig2.chainId;

                if (!(this.status !== ADAPTER_STATUS.CONNECTED)) {
                  _context.next = 5;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet, Please login/connect first");

              case 5:
                _context.next = 7;
                return this.provider.request({
                  method: "eth_accounts"
                });

              case 7:
                accounts = _context.sent;

                if (!(accounts && accounts.length > 0)) {
                  _context.next = 26;
                  break;
                }

                existingToken = getSavedToken(accounts[0], this.name);

                if (!existingToken) {
                  _context.next = 14;
                  break;
                }

                isExpired = checkIfTokenIsExpired(existingToken);

                if (isExpired) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("return", {
                  idToken: existingToken
                });

              case 14:
                payload = {
                  domain: window.location.origin,
                  uri: window.location.href,
                  address: accounts[0],
                  chainId: parseInt(chainId, 16),
                  version: "1",
                  nonce: Math.random().toString(36).slice(2),
                  issuedAt: new Date().toISOString()
                };
                _context.next = 17;
                return signChallenge(payload, chainNamespace);

              case 17:
                challenge = _context.sent;
                _context.next = 20;
                return this.provider.request({
                  method: "personal_sign",
                  params: [challenge, accounts[0]]
                });

              case 20:
                signedMessage = _context.sent;
                _context.next = 23;
                return verifySignedChallenge(chainNamespace, signedMessage, challenge, this.name, this.sessionTime, this.clientId);

              case 23:
                idToken = _context.sent;
                saveToken(accounts[0], this.name, idToken);
                return _context.abrupt("return", {
                  idToken: idToken
                });

              case 26:
                throw WalletLoginError.notConnectedError("Not connected with wallet, Please login/connect first");

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function authenticateUser() {
        return _authenticateUser.apply(this, arguments);
      }

      return authenticateUser;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var accounts;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.status !== ADAPTER_STATUS.CONNECTED)) {
                  _context2.next = 2;
                  break;
                }

                throw WalletLoginError.disconnectionError("Not connected with wallet");

              case 2:
                _context2.next = 4;
                return this.provider.request({
                  method: "eth_accounts"
                });

              case 4:
                accounts = _context2.sent;

                if (accounts && accounts.length > 0) {
                  clearToken(accounts[0], this.name);
                }

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }]);

  return BaseEvmAdapter;
}(BaseAdapter);

export { BaseEvmAdapter as B };
