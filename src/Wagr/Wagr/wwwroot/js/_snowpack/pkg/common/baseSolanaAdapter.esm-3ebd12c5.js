import { _ as _inherits, a as _getPrototypeOf, b as _possibleConstructorReturn, c as _classCallCheck, d as _defineProperty, e as _assertThisInitialized, j as _createClass, k as _asyncToGenerator, r as regenerator, n as WalletLoginError, an as saveToken, ao as verifySignedChallenge, ap as signChallenge, aq as getSavedToken, ar as checkIfTokenIsExpired, g as ADAPTER_STATUS, as as clearToken, B as BaseAdapter } from './base.esm-8d0d3561.js';

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
function base (ALPHABET) {
  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
  var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
  function encode (source) {
    if (source instanceof Uint8Array) ; else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) { throw new TypeError('Expected Uint8Array') }
    if (source.length === 0) { return '' }
        // Skip & count leading zeroes.
    var zeroes = 0;
    var length = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
        // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
    var b58 = new Uint8Array(size);
        // Process the bytes.
    while (pbegin !== pend) {
      var carry = source[pbegin];
            // Apply "b58 = b58 * 256 + ch".
      var i = 0;
      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
        carry += (256 * b58[it1]) >>> 0;
        b58[it1] = (carry % BASE) >>> 0;
        carry = (carry / BASE) >>> 0;
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i;
      pbegin++;
    }
        // Skip leading zeroes in base58 result.
    var it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
        // Translate the result into a string.
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]); }
    return str
  }
  function decodeUnsafe (source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return new Uint8Array() }
    var psz = 0;
        // Skip and count leading '1's.
    var zeroes = 0;
    var length = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
        // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size);
        // Process the characters.
    while (source[psz]) {
            // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)];
            // Invalid character
      if (carry === 255) { return }
      var i = 0;
      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
        carry += (BASE * b256[it3]) >>> 0;
        b256[it3] = (carry % 256) >>> 0;
        carry = (carry / 256) >>> 0;
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i;
      psz++;
    }
        // Skip leading zeroes in b256.
    var it4 = size - length;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j = zeroes;
    while (it4 !== size) {
      vch[j++] = b256[it4++];
    }
    return vch
  }
  function decode (string) {
    var buffer = decodeUnsafe(string);
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
  }
  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}
var src = base;

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

var bs58 = src(ALPHABET);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var BaseSolanaAdapter = /*#__PURE__*/function (_BaseAdapter) {
  _inherits(BaseSolanaAdapter, _BaseAdapter);

  var _super = _createSuper(BaseSolanaAdapter);

  function BaseSolanaAdapter() {
    var _this;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BaseSolanaAdapter);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "clientId", void 0);

    _this.clientId = params.clientId;
    return _this;
  }

  _createClass(BaseSolanaAdapter, [{
    key: "authenticateUser",
    value: function () {
      var _authenticateUser = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var _this$chainConfig;

        var _this$chainConfig2, chainNamespace, chainId, accounts, existingToken, isExpired, payload, challenge, encodedMessage, signedMessage, idToken;

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
                  method: "getAccounts"
                });

              case 7:
                accounts = _context.sent;

                if (!(accounts && accounts.length > 0)) {
                  _context.next = 27;
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
                encodedMessage = new TextEncoder().encode(challenge);
                _context.next = 21;
                return this.provider.request({
                  method: "signMessage",
                  params: {
                    message: encodedMessage,
                    display: "utf8"
                  }
                });

              case 21:
                signedMessage = _context.sent;
                _context.next = 24;
                return verifySignedChallenge(chainNamespace, bs58.encode(signedMessage), challenge, this.name, this.sessionTime, this.clientId);

              case 24:
                idToken = _context.sent;
                saveToken(accounts[0], this.name, idToken);
                return _context.abrupt("return", {
                  idToken: idToken
                });

              case 27:
                throw WalletLoginError.notConnectedError("Not connected with wallet, Please login/connect first");

              case 28:
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
                  method: "getAccounts"
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

  return BaseSolanaAdapter;
}(BaseAdapter);

export { BaseSolanaAdapter as B };
