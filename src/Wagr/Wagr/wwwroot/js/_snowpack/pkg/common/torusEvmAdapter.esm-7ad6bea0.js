import { p as createCommonjsModule, N as getDefaultExportFromCjs, ag as require$$0, s as commonjsGlobal, Z as process, O as buffer, v as Buffer$3, q as require$$0$1, t as inherits_browser, ai as browser, u as getDefaultExportFromNamespaceIfNotNamed, w as loglevel, S as SafeEventEmitter, d as _defineProperty, y as get, aj as ObjectMultiplex, J as pump_1, I as createStreamMiddleware, K as JRPCEngine, L as createIdRemapMiddleware, V as dist$1, o as lodash_merge, ak as BasePostMessageStream, H as setupMultiplex, a1 as EventEmitter, al as setAPIKey, _ as _inherits, a as _getPrototypeOf, b as _possibleConstructorReturn, c as _classCallCheck, e as _assertThisInitialized, W as WALLET_ADAPTERS, A as ADAPTER_NAMESPACES, C as CHAIN_NAMESPACES, f as ADAPTER_CATEGORY, g as ADAPTER_STATUS, j as _createClass, k as _asyncToGenerator, r as regenerator, l as log$1, m as ADAPTER_EVENTS, h as getChainConfig, am as Web3AuthError, n as WalletLoginError, i as WalletInitializationError } from './base.esm-8d0d3561.js';
import { _ as _get } from './get-f1dc166f.js';
import { s as stream_1, _ as _polyfillNode_util, g as browser$1 } from './browser-861d5d75.js';
import { i as isStream_1, f as fastDeepEqual } from './index-db718a07.js';
import { B as BaseEvmAdapter } from './baseEvmAdapter.esm-ba61ad7f.js';

var objectWithoutPropertiesLoose = createCommonjsModule(function (module) {
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var objectWithoutProperties = createCommonjsModule(function (module) {
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _objectWithoutProperties = /*@__PURE__*/getDefaultExportFromCjs(objectWithoutProperties);

var asStream = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAsStream = void 0;

class ObservableStoreStream extends stream_1.Duplex {
    constructor(obsStore) {
        super({
            // pass values, not serializations
            objectMode: true,
        });
        // dont buffer outgoing updates
        this.resume();
        // save handler so we can unsubscribe later
        this.handler = (state) => this.push(state);
        // subscribe to obsStore changes
        this.obsStore = obsStore;
        this.obsStore.subscribe(this.handler);
    }
    // emit current state on new destination
    pipe(dest, options) {
        const result = super.pipe(dest, options);
        dest.write(this.obsStore.getState());
        return result;
    }
    // write from incoming stream to state
    _write(chunk, _encoding, callback) {
        this.obsStore.putState(chunk);
        callback();
    }
    // noop - outgoing stream is asking us if we have data we arent giving it
    _read(_size) {
        return undefined;
    }
    // unsubscribe from event emitter
    _destroy(err, callback) {
        this.obsStore.unsubscribe(this.handler);
        super._destroy(err, callback);
    }
}
function storeAsStream(obsStore) {
    return new ObservableStoreStream(obsStore);
}
exports.storeAsStream = storeAsStream;

});

var safeEventEmitter = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        // Throw error after timeout so as not to interrupt the stack
        setTimeout(() => {
            throw err;
        });
    }
}
function arrayClone(arr) {
    const n = arr.length;
    const copy = new Array(n);
    for (let i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
class SafeEventEmitter extends require$$0.EventEmitter {
    emit(type, ...args) {
        let doError = type === 'error';
        const events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        // If there is no 'error' event listener then throw.
        if (doError) {
            let er;
            if (args.length > 0) {
                [er] = args;
            }
            if (er instanceof Error) {
                // Note: The comments on the `throw` lines are intentional, they show
                // up in Node's output if this results in an unhandled exception.
                throw er; // Unhandled 'error' event
            }
            // At least give some kind of context to the user
            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);
            err.context = er;
            throw err; // Unhandled 'error' event
        }
        const handler = events[type];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            const len = handler.length;
            const listeners = arrayClone(handler);
            for (let i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    }
}
exports.default = SafeEventEmitter;

});

var ObservableStore_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableStore = void 0;
const safe_event_emitter_1 = __importDefault(safeEventEmitter);
class ObservableStore extends safe_event_emitter_1.default {
    constructor(initState) {
        super();
        if (initState) {
            this._state = initState;
        }
        else {
            // Typecast/default state: Preserve existing behavior
            this._state = {};
        }
    }
    // wrapper around internal getState
    getState() {
        return this._getState();
    }
    // wrapper around internal putState
    putState(newState) {
        this._putState(newState);
        this.emit('update', newState);
    }
    updateState(partialState) {
        // if non-null object, merge
        if (partialState && typeof partialState === 'object') {
            const state = this.getState();
            this.putState(Object.assign(Object.assign({}, state), partialState));
            // if not object, use new value
        }
        else {
            this.putState(partialState);
        }
    }
    // subscribe to changes
    subscribe(handler) {
        this.on('update', handler);
    }
    // unsubscribe to changes
    unsubscribe(handler) {
        this.removeListener('update', handler);
    }
    //
    // private
    //
    // read from persistence
    _getState() {
        return this._state;
    }
    // write to persistence
    _putState(newState) {
        this._state = newState;
    }
}
exports.ObservableStore = ObservableStore;

});

var ComposedStore_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedStore = void 0;

class ComposedStore extends ObservableStore_1.ObservableStore {
    constructor(children) {
        // Typecast: Preserve existing behavior
        super({});
        // subscribe to children
        this._children = children || {};
        Object.keys(this._children).forEach((childKey) => {
            const child = this._children[childKey];
            this._addChild(childKey, child);
        });
    }
    _addChild(childKey, child) {
        const updateFromChild = (childValue) => {
            const state = this.getState();
            state[childKey] = childValue;
            this.putState(state);
        };
        child.subscribe(updateFromChild);
        updateFromChild(child.getState());
    }
}
exports.ComposedStore = ComposedStore;

});

var MergedStore_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergedStore = void 0;

class MergedStore extends ObservableStore_1.ObservableStore {
    constructor(children = []) {
        // Typecast: Preserve existing behavior
        super({});
        this._children = children;
        // subscribe to children
        children.forEach((child) => this._addChild(child));
        this._updateWholeState();
    }
    _addChild(child) {
        child.subscribe(() => this._updateWholeState());
    }
    _updateWholeState() {
        const childStates = this._children.map((child) => child.getState());
        // apply shallow merge over states
        const state = Object.assign({}, ...childStates);
        this.putState(state);
    }
}
exports.MergedStore = MergedStore;

});

var processNextickArgs = createCommonjsModule(function (module) {

if (typeof process === 'undefined' ||
    !process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}
});

var toString = {}.toString;

var isarray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var streamBrowser = require$$0.EventEmitter;

var safeBuffer = createCommonjsModule(function (module, exports) {
/* eslint-disable node/no-deprecated-api */

var Buffer = buffer.Buffer;

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
};
});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
var isArray_1 = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
var isBoolean_1 = isBoolean;

function isNull(arg) {
  return arg === null;
}
var isNull_1 = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
var isNullOrUndefined_1 = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
var isNumber_1 = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
var isString_1 = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
var isSymbol_1 = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
var isUndefined_1 = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
var isRegExp_1 = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
var isObject_1 = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
var isDate_1 = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
var isError_1 = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
var isFunction_1 = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
var isPrimitive_1 = isPrimitive;

var isBuffer = Buffer$3.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

var util = {
	isArray: isArray_1,
	isBoolean: isBoolean_1,
	isNull: isNull_1,
	isNullOrUndefined: isNullOrUndefined_1,
	isNumber: isNumber_1,
	isString: isString_1,
	isSymbol: isSymbol_1,
	isUndefined: isUndefined_1,
	isRegExp: isRegExp_1,
	isObject: isObject_1,
	isDate: isDate_1,
	isError: isError_1,
	isFunction: isFunction_1,
	isPrimitive: isPrimitive_1,
	isBuffer: isBuffer
};

var BufferList = createCommonjsModule(function (module) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = safeBuffer.Buffer;


function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (require$$0$1 && require$$0$1.inspect && require$$0$1.inspect.custom) {
  module.exports.prototype[require$$0$1.inspect.custom] = function () {
    var obj = require$$0$1.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}
});

/*<replacement>*/


/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextickArgs.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextickArgs.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

var destroy_1 = {
  destroy: destroy,
  undestroy: undestroy
};

/*<replacement>*/


/*</replacement>*/

var _stream_writable = Writable;

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextickArgs.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util$1 = Object.create(util);
util$1.inherits = inherits_browser;
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: browser
};
/*</replacement>*/

/*<replacement>*/

/*</replacement>*/

/*<replacement>*/

var Buffer = safeBuffer.Buffer;
var OurUint8Array = commonjsGlobal.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/



util$1.inherits(Writable, streamBrowser);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || _stream_duplex;

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || _stream_duplex;

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  streamBrowser.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextickArgs.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextickArgs.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextickArgs.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextickArgs.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextickArgs.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextickArgs.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroy_1.destroy;
Writable.prototype._undestroy = destroy_1.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};

/*<replacement>*/


/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var _stream_duplex = Duplex$1;

/*<replacement>*/
var util$2 = Object.create(util);
util$2.inherits = inherits_browser;
/*</replacement>*/




util$2.inherits(Duplex$1, _stream_readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(_stream_writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex$1.prototype[method]) Duplex$1.prototype[method] = _stream_writable.prototype[method];
  }
}

function Duplex$1(options) {
  if (!(this instanceof Duplex$1)) return new Duplex$1(options);

  _stream_readable.call(this, options);
  _stream_writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex$1.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextickArgs.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex$1.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex$1.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextickArgs.nextTick(cb, err);
};

/*<replacement>*/

var Buffer$1 = safeBuffer.Buffer;
/*</replacement>*/

var isEncoding = Buffer$1.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer$1.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
var StringDecoder_1 = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer$1.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

var string_decoder = {
	StringDecoder: StringDecoder_1
};

/*<replacement>*/


/*</replacement>*/

var _stream_readable = Readable;

/*<replacement>*/

/*</replacement>*/

/*<replacement>*/
var Duplex$2;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require$$0.EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/

/*</replacement>*/

/*<replacement>*/

var Buffer$2 = safeBuffer.Buffer;
var OurUint8Array$1 = commonjsGlobal.Uint8Array || function () {};
function _uint8ArrayToBuffer$1(chunk) {
  return Buffer$2.from(chunk);
}
function _isUint8Array$1(obj) {
  return Buffer$2.isBuffer(obj) || obj instanceof OurUint8Array$1;
}

/*</replacement>*/

/*<replacement>*/
var util$3 = Object.create(util);
util$3.inherits = inherits_browser;
/*</replacement>*/

/*<replacement>*/

var debug = void 0;
if (require$$0$1 && require$$0$1.debuglog) {
  debug = require$$0$1.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/



var StringDecoder$1;

util$3.inherits(Readable, streamBrowser);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isarray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex$2 = Duplex$2 || _stream_duplex;

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex$2;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder$1) StringDecoder$1 = string_decoder.StringDecoder;
    this.decoder = new StringDecoder$1(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex$2 = Duplex$2 || _stream_duplex;

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  streamBrowser.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroy_1.destroy;
Readable.prototype._undestroy = destroy_1.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer$2.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer$2.prototype) {
        chunk = _uint8ArrayToBuffer$1(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array$1(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder$1) StringDecoder$1 = string_decoder.StringDecoder;
  this._readableState.decoder = new StringDecoder$1(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextickArgs.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextickArgs.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextickArgs.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = streamBrowser.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextickArgs.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextickArgs.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer$2.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextickArgs.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

var _stream_transform = Transform;



/*<replacement>*/
var util$4 = Object.create(util);
util$4.inherits = inherits_browser;
/*</replacement>*/

util$4.inherits(Transform, _stream_duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  _stream_duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish$1);
}

function prefinish$1() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return _stream_duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  _stream_duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

var _stream_passthrough = PassThrough;



/*<replacement>*/
var util$5 = Object.create(util);
util$5.inherits = inherits_browser;
/*</replacement>*/

util$5.inherits(PassThrough, _stream_transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  _stream_transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

var readableBrowser = createCommonjsModule(function (module, exports) {
exports = module.exports = _stream_readable;
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = _stream_writable;
exports.Duplex = _stream_duplex;
exports.Transform = _stream_transform;
exports.PassThrough = _stream_passthrough;
});

var immutable = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

var require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(_polyfillNode_util);

var Transform$1 = readableBrowser.Transform
  , inherits  = require$$1.inherits;

function DestroyableTransform(opts) {
  Transform$1.call(this, opts);
  this._destroyed = false;
}

inherits(DestroyableTransform, Transform$1);

DestroyableTransform.prototype.destroy = function(err) {
  if (this._destroyed) return
  this._destroyed = true;
  
  var self = this;
  process.nextTick(function() {
    if (err)
      self.emit('error', err);
    self.emit('close');
  });
};

// a noop _transform function
function noop (chunk, enc, callback) {
  callback(null, chunk);
}


// create a new export function, used by both the main export and
// the .ctor export, contains common logic for dealing with arguments
function through2 (construct) {
  return function (options, transform, flush) {
    if (typeof options == 'function') {
      flush     = transform;
      transform = options;
      options   = {};
    }

    if (typeof transform != 'function')
      transform = noop;

    if (typeof flush != 'function')
      flush = null;

    return construct(options, transform, flush)
  }
}


// main export, just make me a transform stream!
var through2_1 = through2(function (options, transform, flush) {
  var t2 = new DestroyableTransform(options);

  t2._transform = transform;

  if (flush)
    t2._flush = flush;

  return t2
});


// make me a reusable prototype that I can `new`, or implicitly `new`
// with a constructor call
var ctor = through2(function (options, transform, flush) {
  function Through2 (override) {
    if (!(this instanceof Through2))
      return new Through2(override)

    this.options = immutable(options, override);

    DestroyableTransform.call(this, this.options);
  }

  inherits(Through2, DestroyableTransform);

  Through2.prototype._transform = transform;

  if (flush)
    Through2.prototype._flush = flush;

  return Through2
});


var obj = through2(function (options, transform, flush) {
  var t2 = new DestroyableTransform(immutable({ objectMode: true, highWaterMark: 16 }, options));

  t2._transform = transform;

  if (flush)
    t2._flush = flush;

  return t2
});
through2_1.ctor = ctor;
through2_1.obj = obj;

var transform = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTransformStream = void 0;

function storeTransformStream(syncTransformFn) {
    return through2_1.obj((state, _encoding, cb) => {
        try {
            const newState = syncTransformFn(state);
            cb(null, newState);
            return undefined;
        }
        catch (err) {
            cb(err);
            return undefined;
        }
    });
}
exports.storeTransformStream = storeTransformStream;

});

var dist = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(asStream, exports);
__exportStar(ComposedStore_1, exports);
__exportStar(MergedStore_1, exports);
__exportStar(ObservableStore_1, exports);
__exportStar(transform, exports);

});

const LOGIN_PROVIDER = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  TWITCH: "twitch",
  REDDIT: "reddit",
  DISCORD: "discord"
};
const WALLET_VERIFIERS = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  TWITCH: "twitch",
  REDDIT: "reddit",
  DISCORD: "discord",
  EMAIL_PASSWORDLESS: "torus-auth0-email-passwordless"
};
const WALLET_OPENLOGIN_VERIFIER_MAP = {
  [WALLET_VERIFIERS.GOOGLE]: "tkey-google",
  [WALLET_VERIFIERS.FACEBOOK]: "tkey-facebook",
  [WALLET_VERIFIERS.TWITCH]: "tkey-twitch",
  [WALLET_VERIFIERS.REDDIT]: "tkey-reddit",
  [WALLET_VERIFIERS.DISCORD]: "tkey-discord",
  [WALLET_VERIFIERS.EMAIL_PASSWORDLESS]: "tkey-auth0-email-passwordless"
};
const PAYMENT_PROVIDER = {
  MOONPAY: "moonpay",
  WYRE: "wyre",
  RAMPNETWORK: "rampnetwork",
  XANPOOL: "xanpool",
  MERCURYO: "mercuryo",
  TRANSAK: "transak"
};
const SUPPORTED_PAYMENT_NETWORK = {
  MAINNET: "mainnet",
  MATIC: "matic",
  BSC_MAINNET: "bsc_mainnet",
  AVALANCHE_MAINNET: "avalanche_mainnet",
  XDAI: "xdai"
};
const TORUS_BUILD_ENV = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  BINANCE: "binance",
  TESTING: "testing",
  LRC: "lrc",
  BETA: "beta",
  BNB: "bnb",
  POLYGON: "polygon"
};
const BUTTON_POSITION = {
  BOTTOM_LEFT: "bottom-left",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  TOP_RIGHT: "top-right"
};

/**
 * From https://min-api.cryptocompare.com/data/v2/pair/mapping/fsym?fsym=BTC&extraParams=YourSite
 * GET https://min-api.cryptocompare.com/data/v2/pair/mapping/fsym?fsym=BTC
 * Then map over returned entries, picking tsym
 *
 * Last updated: Date of commit
 */

const CRYPTO_COMPARE_CURRENCIES = ["ETH", "USDT", "USDC", "TUSD", "EOSDT", "USD", "DAI", "GUSD", "DKKT", "PAX", "ILS", "RUB", "BYN", "EUR", "GBP", "JPY", "KRW", "PLN", "MXN", "AUD", "BRL", "CAD", "CHF", "KPW", "LAK", "LBP", "LKR", "XOF", "CNHT", "DOGE", "UAH", "TRY", "HKD", "XJP", "SGD", "USC", "NZD", "NGN", "RUR", "COP", "GHS", "EGP", "IDR", "BHD", "CRC", "PEN", "AED", "DOP", "PKR", "HUF", "VND", "XAR", "LTC", "RON", "OMR", "MYR", "DKK", "UGX", "ZMW", "SAR", "SEK", "GEL", "RWF", "IRR", "TZS", "CNY", "VEF", "BDT", "HRK", "CLP", "THB", "XAF", "ARS", "UYU", "SZL", "KZT", "NOK", "KES", "PAB", "INR", "CZK", "MAD", "TWD", "PHP", "ZAR", "BOB", "CDF", "DASH", "VES", "ISK", "MWK", "BAM", "TTD", "XRP", "JOD", "RSD", "HNL", "BGN", "GTQ", "BWP", "XMR", "MMK", "QAR", "AOA", "KWD", "MUR", "WUSD", "WEUR", "WAVES", "WTRY", "LRD", "LSL", "LYD", "AWG", "MDL", "BTO", "EURS", "CHFT", "MKD", "MNT", "MOP", "MRO", "MVR", "VOLLAR", "CKUSD", "KHR", "VUV", "BITCNY", "QC", "BBD", "NAD", "NPR", "PGK", "PYG", "BIF", "BMD", "BND", "XLM", "BNB", "SCR", "BAT", "CRO", "HT", "KCS", "LEO", "LINK", "MKR", "NPXS", "OMG", "REP", "ZB", "ZIL", "ZRX", "BCH", "BZD", "CUP", "CVE", "DJF", "DZD", "ERN", "ETB", "FJD", "FKP", "BUSD", "ANCT", "ALL", "AMD", "ANG", "CNYX", "IQD", "UZS", "TND", "GGP", "XAU", "KGS", "GIP", "JMD", "ZEC", "USDP", "BSV", "EMC2", "SNT", "GTO", "POWR", "EUSD", "EURT", "BCY", "BTS", "ATM", "BLOCKPAY", "ARDR", "AMP", "B2X", "BITGOLD", "BITEUR", "ATB", "BITUSD", "AGRS", "DFXT", "HIKEN", "BIX", "KNC", "EOS", "COB", "COSS", "BMH", "NANO", "BDG", "BNT", "XVG", "LKK1Y", "LKK", "USDK", "EURN", "NZDT", "JSE", "GMD", "GNF", "GYD", "YER", "XPF", "HTG", "SLL", "SOS", "WST", "SVC", "SYP", "NEO", "KMF", "JUMP", "AYA", "BLAST", "WGR", "BCN", "BTG", "URALS", "INN", "USDQ", "CNH", "HUSD", "BKRW", "NZDX", "EURX", "CADX", "USDEX", "JPYX", "AUDX", "VNDC", "EON", "GBPX", "CHFX", "USDJ", "IDRT", "USDS", "USDN", "BIDR", "IDK", "BSD", "BTN", "KYD", "NIO", "SBD", "SDG", "SHP", "TOP", "XCD", "XCHF", "CNYT", "GYEN", "ZUSD", "GOLD", "TRX", "TRYB", "PLATC", "STRAX", "UST", "GLM", "VAI", "BRZ", "DDRST", "XAUT", "MIM"];
/**
 * currencies supported by the payment provider
 * Last updated: Date of commit
 */

const PROVIDER_SUPPORTED_FIAT_CURRENCIES = {
  // https://integrations.simplex.com/supported_currencies
  // https://support.moonpay.com/hc/en-gb/articles/360011931457-Which-fiat-currencies-are-supported-
  [PAYMENT_PROVIDER.MOONPAY]: ["AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "COP", "CZK", "DKK", "DOP", "EGP", "EUR", "GBP", "HKD", "HRK", "IDR", "ILS", "JPY", "JOD", "KES", "KRW", "KWD", "LKR", "MAD", "MXN", "MYR", "NGN", "NOK", "NZD", "OMR", "PEN", "PKR", "PLN", "RON", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "USD", "VND", "ZAR"],

  /**
   * https://docs.sendwyre.com/docs/supported-currencies#fiat
   * The ones where credit card is supported
   */
  [PAYMENT_PROVIDER.WYRE]: ["USD", "EUR", "GBP", "AUD", "CAD", "NZD", "ARS", "BRL", "CHF", "CLP", "COP", "CZK", "DKK", "HKD", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR", "NOK", "PHP", "PLN", "SEK", "THB", "VND", "ZAR"],
  // https://support.ramp.network/en/articles/471-why-am-i-paying-in-usd-eur-gbp
  [PAYMENT_PROVIDER.RAMPNETWORK]: ["USD", "EUR", "GBP"],
  // From https://xanpool.com/ fiat select dropdown
  [PAYMENT_PROVIDER.XANPOOL]: ["SGD", "HKD", "THB", "PHP", "INR", "IDR", "MYR", "AUD", "NZD", "KRW"],
  // https://support.aax.com/en/articles/5295762-mercuryo
  // RUB / UAH currently not supported
  [PAYMENT_PROVIDER.MERCURYO]: ["EUR", "USD", "GBP", "TRY", "JPY", "BRL", "NGN", "VND", "MXN", "KRW"],

  /**
   * https://support.transak.com/hc/en-us/articles/360020615578-Credit-and-Debit-Card-Payments-through-Transak
   * or
   * https://transak.stoplight.io/docs/transak-docs/b3A6OTk1ODQ0-2-get-fiat-currencies
   */
  [PAYMENT_PROVIDER.TRANSAK]: ["ARS", "AUD", "BBD", "BGN", "BMD", "BRL", "CAD", "CHF", "CLP", "CRC", "CZK", "DKK", "DOP", "EUR", "FJD", "FKP", "GBP", "GIP", "HRK", "HUF", "IDR", "ILS", "ISK", "JMD", "JPY", "KES", "KRW", "MDL", "MXN", "MYR", "NOK", "NZD", "PEN", "PHP", "PLN", "PYG", "RON", "SEK", "SGD", "THB", "TRY", "TZS", "USD", "ZAR"]
};
const cryptoCompareCurrenciesSet = new Set(CRYPTO_COMPARE_CURRENCIES);
/**
 * Fiat currencies that we support
 */

function supportedFiatCurrencies(provider) {
  const providerSupportedFiatCurrencies = PROVIDER_SUPPORTED_FIAT_CURRENCIES[provider];
  return providerSupportedFiatCurrencies.filter(currency => cryptoCompareCurrenciesSet.has(currency));
}

const paymentProviders$1 = {
  [PAYMENT_PROVIDER.MOONPAY]: {
    line1: "Credit/ Debit Card/ Apple Pay",
    line2: "4.5% or 5 USD",
    line3: "2,000€/day, 10,000€/mo",
    supportPage: "https://help.moonpay.io/en/",
    minOrderValue: 24.99,
    maxOrderValue: 50_000,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.MOONPAY),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "aave",
        display: "AAVE"
      }, {
        value: "bat",
        display: "BAT"
      }, {
        value: "dai",
        display: "DAI"
      }, {
        value: "eth",
        display: "ETH"
      }, {
        value: "mkr",
        display: "MKR"
      }, {
        value: "matic",
        display: "MATIC"
      }, {
        value: "usdt",
        display: "USDT"
      }, {
        value: "usdc",
        display: "USDC"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "eth_polygon",
        display: "ETH"
      }, {
        value: "matic_polygon",
        display: "MATIC"
      }, {
        value: "usdc_polygon",
        display: "USDC"
      }],
      [SUPPORTED_PAYMENT_NETWORK.BSC_MAINNET]: [{
        value: "bnb_bsc",
        display: "BNB"
      }, {
        value: "busd_bsc",
        display: "BUSD"
      }],
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "avax_cchain",
        display: "AVAX"
      }]
    },
    includeFees: true,
    api: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.WYRE]: {
    line1: "Apple Pay/ Debit/ Credit Card",
    line2: "4.9% + 30¢ or 5 USD",
    line3: "$250/day",
    supportPage: "https://support.sendwyre.com/en/",
    minOrderValue: 5,
    maxOrderValue: 500,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.WYRE),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "AAVE",
        display: "AAVE"
      }, {
        value: "BAT",
        display: "BAT"
      }, {
        value: "BUSD",
        display: "BUSD"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "ETH",
        display: "ETH"
      }, {
        value: "MKR",
        display: "MKR"
      }, {
        value: "UNI",
        display: "UNI"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "MUSDC",
        display: "USDC"
      }],
      // AVAXC? or AVAX?
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "AVAXC",
        display: "AVAXC"
      }]
    },
    includeFees: false,
    api: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.RAMPNETWORK]: {
    line1: "Debit Card/ <br>Apple Pay/ Bank transfer",
    line2: "0.49% - 2.9%",
    line3: "5,000€/purchase, 20,000€/mo",
    supportPage: "https://instant.ramp.network/",
    minOrderValue: 50,
    maxOrderValue: 20_000,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.RAMPNETWORK),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "ETH",
        display: "ETH"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "MATIC_DAI",
        display: "DAI"
      }, {
        value: "MATIC_MATIC",
        display: "MATIC"
      }, {
        value: "MATIC_USDC",
        display: "USDC"
      }],
      // what about AVAXC?
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "AVAX",
        display: "AVAX"
      }] // Temporary unavailable
      // [SUPPORTED_PAYMENT_NETWORK.XDAI]: [{ value: 'XDAI_XDAI', display: 'XDAI' }],

    },
    includeFees: true,
    api: true,
    receiveHint: "walletTopUp.receiveHintRamp",
    enforceMax: false
  },
  [PAYMENT_PROVIDER.XANPOOL]: {
    line1: "PayNow/ InstaPay/ FPS/ GoJekPay/ UPI/ PromptPay/ <br>ViettelPay/ DuitNow",
    line2: "2.5% buying, 3% selling",
    line3: "$2,500 / day",
    supportPage: "mailto:support@xanpool.com",
    minOrderValue: 100,
    maxOrderValue: 2500,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.XANPOOL),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "ETH",
        display: "ETH"
      }, {
        value: "USDT",
        display: "USDT"
      }]
    },
    includeFees: true,
    api: true,
    sell: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.MERCURYO]: {
    line1: "Credit/ Debit Card/ Apple Pay",
    line2: "3.95% or 4 USD",
    line3: "10,000€/day, 25,000€/mo",
    supportPage: "mailto:support@mercuryo.io",
    minOrderValue: 30,
    maxOrderValue: 5000,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.MERCURYO),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "ETH",
        display: "ETH"
      }, {
        value: "BAT",
        display: "BAT"
      }, {
        value: "USDT",
        display: "USDT"
      }, {
        value: "DAI",
        display: "DAI"
      }],
      [SUPPORTED_PAYMENT_NETWORK.BSC_MAINNET]: [{
        value: "BNB",
        display: "BNB"
      }, {
        value: "BUSD",
        display: "BUSD"
      }, {
        value: "1INCH",
        display: "1INCH"
      }]
    },
    includeFees: true,
    api: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.TRANSAK]: {
    line1: "Apple & Google Pay / Credit/Debit Card<br/>Bangkok Bank Mobile & iPay<br/>Bank Transfer (sepa/gbp) / SCB Mobile & Easy",
    line2: "0.99% - 5.5% or 5 USD",
    line3: "$5,000/day, $28,000/mo",
    supportPage: "https://support.transak.com/hc/en-US",
    minOrderValue: 30,
    maxOrderValue: 500,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.TRANSAK),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "AAVE",
        display: "AAVE"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "ETH",
        display: "ETH"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "AAVE",
        display: "AAVE"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "MATIC",
        display: "MATIC"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }, {
        value: "WETH",
        display: "WETH"
      }],
      [SUPPORTED_PAYMENT_NETWORK.BSC_MAINNET]: [{
        value: "BNB",
        display: "BNB"
      }, {
        value: "BUSD",
        display: "BUSD"
      }],
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "AVAX",
        display: "AVAX"
      }]
    },
    includeFees: true,
    enforceMax: true
  }
};
const translations = {
  en: {
    embed: {
      continue: "Continue",
      actionRequired: "Authorization required",
      pendingAction: "Click continue to proceed with your request in a popup",
      cookiesRequired: "Cookies Required",
      enableCookies: "Please enable cookies in your browser preferences to access Torus",
      clickHere: "More Info"
    }
  },
  de: {
    embed: {
      continue: "Fortsetzen",
      actionRequired: "Autorisierung erforderlich",
      pendingAction: "Klicken Sie in einem Popup auf Weiter, um mit Ihrer Anfrage fortzufahren",
      cookiesRequired: "Cookies benötigt",
      enableCookies: "Bitte aktivieren Sie Cookies in Ihren Browsereinstellungen, um auf Torus zuzugreifen",
      clickHere: "Mehr Info"
    }
  },
  ja: {
    embed: {
      continue: "継続する",
      actionRequired: "認証が必要です",
      pendingAction: "続行をクリックして、ポップアップでリクエストを続行します",
      cookiesRequired: "必要なクッキー",
      enableCookies: "Torusにアクセスするには、ブラウザの設定でCookieを有効にしてください。",
      clickHere: "詳しくは"
    }
  },
  ko: {
    embed: {
      continue: "계속하다",
      actionRequired: "승인 필요",
      pendingAction: "팝업에서 요청을 진행하려면 계속을 클릭하십시오.",
      cookiesRequired: "쿠키 필요",
      enableCookies: "브라우저 환경 설정에서 쿠키를 활성화하여 Torus에 액세스하십시오.",
      clickHere: "더 많은 정보"
    }
  },
  zh: {
    embed: {
      continue: "继续",
      actionRequired: "需要授权",
      pendingAction: "单击继续以在弹出窗口中继续您的请求",
      cookiesRequired: "必填Cookie",
      enableCookies: "请在您的浏览器首选项中启用cookie以访问Torus。",
      clickHere: "更多信息"
    }
  }
};
var configuration = {
  supportedVerifierList: Object.values(WALLET_VERIFIERS),
  paymentProviders: paymentProviders$1,
  api: "https://api.tor.us",
  translations,
  prodTorusUrl: "",
  localStorageKeyPrefix: `torus-`
};

const runOnLoad = fn => new Promise((resolve, reject) => {
  if (window.document.body != null) {
    Promise.resolve(fn()).then(resolve).catch(reject);
  } else {
    window.document.addEventListener("DOMContentLoaded", () => {
      Promise.resolve(fn()).then(resolve).catch(reject);
    });
  }
});
const htmlToElement = html => {
  const template = window.document.createElement("template");
  const trimmedHtml = html.trim(); // Never return a text node of whitespace as the result

  template.innerHTML = trimmedHtml;
  return template.content.firstChild;
};
const handleEvent = function (handle, eventName, handler) {
  for (var _len = arguments.length, handlerArgs = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    handlerArgs[_key - 3] = arguments[_key];
  }

  const handlerWrapper = () => {
    handler(...handlerArgs);
    handle.removeEventListener(eventName, handlerWrapper);
  };

  handle.addEventListener(eventName, handlerWrapper);
};
const handleStream = (handle, eventName, handler) => {
  const handlerWrapper = chunk => {
    handler(chunk);
    handle.removeListener(eventName, handlerWrapper);
  };

  handle.on(eventName, handlerWrapper);
};
async function documentReady() {
  return new Promise(resolve => {
    if (document.readyState !== "loading") {
      resolve();
    } else {
      handleEvent(document, "DOMContentLoaded", resolve);
    }
  });
}

var log = loglevel.getLogger("torus-embed");

var messages = {
  errors: {
    disconnected: () => "Torus: Lost connection to Torus.",
    permanentlyDisconnected: () => "Torus: Disconnected from iframe. Page reload required.",
    sendSiteMetadata: () => "Torus: Failed to send site metadata. This is an internal error, please report this bug.",
    unsupportedSync: method => `Torus: The Torus Ethereum provider does not support synchronous methods like ${method} without a callback parameter.`,
    invalidDuplexStream: () => "Must provide a Node.js-style duplex stream.",
    invalidOptions: (maxEventListeners, shouldSendMetadata) => `Invalid options. Received: { maxEventListeners: ${maxEventListeners}, shouldSendMetadata: ${shouldSendMetadata} }`,
    invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
    invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
    invalidRequestParams: () => `'args.params' must be an object or array if provided.`,
    invalidLoggerObject: () => `'args.logger' must be an object if provided.`,
    invalidLoggerMethod: method => `'args.logger' must include required method '${method}'.`
  },
  info: {
    connected: chainId => `Torus: Connected to chain with ID "${chainId}".`
  },
  warnings: {
    // deprecated methods
    enableDeprecation: 'Torus: ""ethereum.enable()" is deprecated and may be removed in the future. ' + 'Please use "ethereum.send("eth_requestAccounts")" instead. For more information, see: https://eips.ethereum.org/EIPS/eip-1102',
    sendDeprecation: 'Torus: "ethereum.send(...)" is deprecated and may be removed in the future.' + ' Please use "ethereum.sendAsync(...)" or "ethereum.request(...)" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193',
    events: {
      close: 'Torus: The event "close" is deprecated and may be removed in the future. Please use "disconnect" instead.' + "\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193",
      data: 'Torus: The event "data" is deprecated and will be removed in the future.' + 'Use "message" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#message',
      networkChanged: 'Torus: The event "networkChanged" is deprecated and may be removed in the future.' + ' Please use "chainChanged" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193',
      notification: 'Torus: The event "notification" is deprecated and may be removed in the future. ' + 'Please use "message" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193'
    },
    publicConfigStore: 'Torus: The property "publicConfigStore" is deprecated and WILL be removed in the future.'
  }
};

const {
  paymentProviders
} = configuration;
const validatePaymentProvider = (provider, params) => {
  const errors = {};

  if (!provider) {
    return {
      errors,
      isValid: true
    };
  }

  if (provider && !paymentProviders[provider]) {
    errors.provider = "Invalid Provider";
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }

  const selectedProvider = paymentProviders[provider];
  const selectedParams = params || {}; // set default values
  // if (!selectedParams.selectedCurrency) [selectedParams.selectedCurrency] = selectedProvider.validCurrencies
  // if (!selectedParams.fiatValue) selectedParams.fiatValue = selectedProvider.minOrderValue
  // if (!selectedParams.selectedCryptoCurrency) [selectedParams.selectedCryptoCurrency] = selectedProvider.validCryptoCurrencies
  // validations

  if (selectedParams.fiatValue) {
    const requestedOrderAmount = +parseFloat(selectedParams.fiatValue.toString()) || 0;
    if (requestedOrderAmount < selectedProvider.minOrderValue) errors.fiatValue = "Requested amount is lower than supported";
    if (requestedOrderAmount > selectedProvider.maxOrderValue && selectedProvider.enforceMax) errors.fiatValue = "Requested amount is higher than supported";
  }

  if (selectedParams.selectedCurrency && !selectedProvider.validCurrencies.includes(selectedParams.selectedCurrency)) {
    errors.selectedCurrency = "Unsupported currency";
  }

  if (selectedParams.selectedCryptoCurrency) {
    const validCryptoCurrenciesByChain = Object.values(selectedProvider.validCryptoCurrenciesByChain).flat().map(currency => currency.value);
    const finalCryptoCurrency = provider === PAYMENT_PROVIDER.MOONPAY ? selectedParams.selectedCryptoCurrency.toLowerCase() : selectedParams.selectedCryptoCurrency;
    if (validCryptoCurrenciesByChain && !validCryptoCurrenciesByChain.includes(finalCryptoCurrency)) errors.selectedCryptoCurrency = "Unsupported cryptoCurrency";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}; // utility functions

/**
 * json-rpc-engine middleware that logs RPC errors and and validates req.method.
 *
 * @param log - The logging API to use.
 * @returns  json-rpc-engine middleware function
 */

function createErrorMiddleware() {
  return (req, res, next) => {
    // json-rpc-engine will terminate the request when it notices this error
    if (typeof req.method !== "string" || !req.method) {
      res.error = dist$1.ethErrors.rpc.invalidRequest({
        message: `The request 'method' must be a non-empty string.`,
        data: req
      });
    }

    next(done => {
      const {
        error
      } = res;

      if (!error) {
        return done();
      }

      log.error(`MetaMask - RPC Error: ${error.message}`, error);
      return done();
    });
  };
} // resolve response.result or response, reject errors
/**
 * Logs a stream disconnection error. Emits an 'error' if given an
 * EventEmitter that has listeners for the 'error' event.
 *
 * @param log - The logging API to use.
 * @param remoteLabel - The label of the disconnected stream.
 * @param error - The associated error to log.
 * @param emitter - The logging API to use.
 */

function logStreamDisconnectWarning(remoteLabel, error, emitter) {
  let warningMsg = `MetaMask: Lost connection to "${remoteLabel}".`;

  if (error !== null && error !== void 0 && error.stack) {
    warningMsg += `\n${error.stack}`;
  }

  log.warn(warningMsg);

  if (emitter && emitter.listenerCount("error") > 0) {
    emitter.emit("error", warningMsg);
  }
}
const getPreopenInstanceId = () => Math.random().toString(36).slice(2);
const getTorusUrl = async (buildEnv, integrity) => {
  let torusUrl;
  let logLevel; // Do not change this line

  const version = "1.36.4";
  let versionUsed = integrity.version || version;

  try {
    if ((buildEnv === "binance" || buildEnv === "production") && !integrity.version) {
      let response;
      if (!configuration.prodTorusUrl) response = await get(`${configuration.api}/latestversion?name=@toruslabs/torus-embed&version=${version}`, {}, {
        useAPIKey: true
      });else response = {
        data: configuration.prodTorusUrl
      };
      versionUsed = response.data; // eslint-disable-next-line require-atomic-updates

      configuration.prodTorusUrl = response.data;
    }
  } catch (error) {
    log.error(error, "unable to fetch latest version");
  }

  log.info("version used: ", versionUsed);

  switch (buildEnv) {
    case "binance":
      torusUrl = `https://binance.tor.us/v${versionUsed}`;
      logLevel = "info";
      break;

    case "testing":
      torusUrl = "https://testing.tor.us";
      logLevel = "debug";
      break;

    case "bnb":
      torusUrl = "https://bnb.tor.us";
      logLevel = "error";
      break;

    case "polygon":
      torusUrl = "https://polygon.tor.us";
      logLevel = "error";
      break;

    case "lrc":
      torusUrl = "https://lrc.tor.us";
      logLevel = "debug";
      break;

    case "beta":
      torusUrl = "https://beta.tor.us";
      logLevel = "debug";
      break;

    case "development":
      torusUrl = "http://localhost:4050";
      logLevel = "debug";
      break;

    default:
      torusUrl = `https://app.tor.us/v${versionUsed}`;
      logLevel = "error";
      break;
  }

  return {
    torusUrl,
    logLevel
  };
};
const getUserLanguage = () => {
  let userLanguage = window.navigator.language || "en-US";
  const userLanguages = userLanguage.split("-");
  userLanguage = Object.prototype.hasOwnProperty.call(configuration.translations, userLanguages[0]) ? userLanguages[0] : "en";
  return userLanguage;
};
const EMITTED_NOTIFICATIONS = ["eth_subscription" // per eth-json-rpc-filters/subscriptionManager
];
const NOOP = () => {// empty function
};
const FEATURES_PROVIDER_CHANGE_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=375";
const FEATURES_DEFAULT_WALLET_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=740,width=1315";
const FEATURES_CONFIRM_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=450";
function getPopupFeatures() {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
  const w = 1200;
  const h = 700;
  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;
  const systemZoom = 1; // No reliable estimate

  const left = Math.abs((width - w) / 2 / systemZoom + dualScreenLeft);
  const top = Math.abs((height - h) / 2 / systemZoom + dualScreenTop);
  const features = `titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=${h / systemZoom},width=${w / systemZoom},top=${top},left=${left}`;
  return features;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
SafeEventEmitter.defaultMaxListeners = 100; // resolve response.result, reject errors

const getRpcPromiseCallback = function (resolve, reject) {
  let unwrapResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return (error, response) => {
    if (error || response.error) {
      return reject(error || response.error);
    }

    return !unwrapResult || Array.isArray(response) ? resolve(response) : resolve(response.result);
  };
};

class TorusInpageProvider extends SafeEventEmitter {
  /**
   * The chain ID of the currently connected Ethereum chain.
   * See [chainId.network]{@link https://chainid.network} for more information.
   */

  /**
   * The user's currently selected Ethereum address.
   * If null, MetaMask is either locked or the user has not permitted any
   * addresses to be viewed.
   */

  /**
   * Indicating that this provider is a MetaMask provider.
   */
  constructor(connectionStream) {
    let {
      maxEventListeners = 100,
      shouldSendMetadata = true,
      jsonRpcStreamName = "provider"
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();

    _defineProperty(this, "chainId", void 0);

    _defineProperty(this, "selectedAddress", void 0);

    _defineProperty(this, "_rpcEngine", void 0);

    _defineProperty(this, "networkVersion", void 0);

    _defineProperty(this, "shouldSendMetadata", void 0);

    _defineProperty(this, "isTorus", void 0);

    _defineProperty(this, "_publicConfigStore", void 0);

    _defineProperty(this, "tryPreopenHandle", void 0);

    _defineProperty(this, "enable", void 0);

    _defineProperty(this, "_state", void 0);

    _defineProperty(this, "_jsonRpcConnection", void 0);

    _defineProperty(this, "_sentWarnings", {
      // methods
      enable: false,
      experimentalMethods: false,
      send: false,
      publicConfigStore: false,
      // events
      events: {
        close: false,
        data: false,
        networkChanged: false,
        notification: false
      }
    });

    if (!isStream_1.duplex(connectionStream)) {
      throw new Error(messages.errors.invalidDuplexStream());
    }

    this.isTorus = true;
    this.setMaxListeners(maxEventListeners); // private state

    this._state = _objectSpread$1({}, TorusInpageProvider._defaultState); // public state

    this.selectedAddress = null;
    this.networkVersion = null;
    this.chainId = null;
    this.shouldSendMetadata = shouldSendMetadata; // bind functions (to prevent e.g. web3@1.x from making unbound calls)

    this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
    this._handleChainChanged = this._handleChainChanged.bind(this);
    this._handleUnlockStateChanged = this._handleUnlockStateChanged.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleStreamDisconnect = this._handleStreamDisconnect.bind(this);
    this._sendSync = this._sendSync.bind(this);
    this._rpcRequest = this._rpcRequest.bind(this);
    this._warnOfDeprecation = this._warnOfDeprecation.bind(this);
    this._initializeState = this._initializeState.bind(this);
    this.request = this.request.bind(this);
    this.send = this.send.bind(this);
    this.sendAsync = this.sendAsync.bind(this); // this.enable = this.enable.bind(this);
    // setup connectionStream multiplexing

    const mux = new ObjectMultiplex();
    pump_1(connectionStream, mux, connectionStream, this._handleStreamDisconnect.bind(this, "MetaMask")); // subscribe to metamask public config (one-way)

    this._publicConfigStore = new dist.ObservableStore({
      storageKey: "Metamask-Config"
    }); // handle isUnlocked changes, and chainChanged and networkChanged events
    // this._publicConfigStore.subscribe((stringifiedState) => {
    //   // This is because we are using store as string
    //   const state = JSON.parse(stringifiedState as unknown as string);
    //   if ("isUnlocked" in state && state.isUnlocked !== this._state.isUnlocked) {
    //     this._state.isUnlocked = state.isUnlocked;
    //     if (!this._state.isUnlocked) {
    //       // accounts are never exposed when the extension is locked
    //       this._handleAccountsChanged([]);
    //     } else {
    //       // this will get the exposed accounts, if any
    //       try {
    //         this._rpcRequest(
    //           { method: "eth_accounts", params: [] },
    //           NOOP,
    //           true // indicating that eth_accounts _should_ update accounts
    //         );
    //       } catch (_) {
    //         // Swallow error
    //       }
    //     }
    //   }
    //   if ("selectedAddress" in state && this.selectedAddress !== state.selectedAddress) {
    //     try {
    //       this._rpcRequest(
    //         { method: "eth_accounts", params: [] },
    //         NOOP,
    //         true // indicating that eth_accounts _should_ update accounts
    //       );
    //     } catch (_) {
    //       // Swallow error
    //     }
    //   }
    //   // Emit chainChanged event on chain change
    //   if ("chainId" in state && state.chainId !== this.chainId) {
    //     this.chainId = state.chainId || null;
    //     this.emit("chainChanged", this.chainId);
    //     // indicate that we've connected, for EIP-1193 compliance
    //     // we do this here so that iframe can initialize
    //     if (!this._state.hasEmittedConnection) {
    //       this._handleConnect(this.chainId);
    //       this._state.hasEmittedConnection = true;
    //     }
    //   }
    //   // Emit networkChanged event on network change
    //   if ("networkVersion" in state && state.networkVersion !== this.networkVersion) {
    //     this.networkVersion = state.networkVersion || null;
    //     this.emit("networkChanged", this.networkVersion);
    //   }
    // });

    pump_1(mux.createStream("publicConfig"), dist.storeAsStream(this._publicConfigStore), // RPC requests should still work if only this stream fails
    logStreamDisconnectWarning.bind(this, "MetaMask PublicConfigStore")); // ignore phishing warning message (handled elsewhere)

    mux.ignoreStream("phishing"); // setup own event listeners
    // EIP-1193 connect

    this.on("connect", () => {
      this._state.isConnected = true;
    }); // connect to async provider

    const jsonRpcConnection = createStreamMiddleware();
    pump_1(jsonRpcConnection.stream, mux.createStream(jsonRpcStreamName), jsonRpcConnection.stream, this._handleStreamDisconnect.bind(this, "MetaMask RpcProvider")); // handle RPC requests via dapp-side rpc engine

    const rpcEngine = new JRPCEngine();
    rpcEngine.push(createIdRemapMiddleware());
    rpcEngine.push(createErrorMiddleware());
    rpcEngine.push(jsonRpcConnection.middleware);
    this._rpcEngine = rpcEngine; // json rpc notification listener

    jsonRpcConnection.events.on("notification", payload => {
      const {
        method,
        params
      } = payload;

      if (method === "wallet_accountsChanged") {
        this._handleAccountsChanged(params);
      } else if (method === "wallet_unlockStateChanged") {
        this._handleUnlockStateChanged(params);
      } else if (method === "wallet_chainChanged") {
        this._handleChainChanged(params);
      } else if (EMITTED_NOTIFICATIONS.includes(payload.method)) {
        // EIP 1193 subscriptions, per eth-json-rpc-filters/subscriptionManager
        this.emit("data", payload); // deprecated

        this.emit("notification", params.result);
        this.emit("message", {
          type: method,
          data: params
        });
      } // Backward compatibility for older non EIP 1193 subscriptions
      // this.emit('data', null, payload)

    });
  }

  get publicConfigStore() {
    if (!this._sentWarnings.publicConfigStore) {
      log.warn(messages.warnings.publicConfigStore);
      this._sentWarnings.publicConfigStore = true;
    }

    return this._publicConfigStore;
  }
  /**
   * Returns whether the inpage provider is connected to Torus.
   */


  isConnected() {
    return this._state.isConnected;
  }
  /**
   * Submits an RPC request for the given method, with the given params.
   * Resolves with the result of the method call, or rejects on error.
   *
   * @param args - The RPC request arguments.
   * @returns A Promise that resolves with the result of the RPC method,
   * or rejects if an error is encountered.
   */


  async request(args) {
    if (!args || typeof args !== "object" || Array.isArray(args)) {
      throw dist$1.ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestArgs(),
        data: args
      });
    }

    const {
      method,
      params
    } = args;

    if (typeof method !== "string" || method.length === 0) {
      throw dist$1.ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestMethod(),
        data: args
      });
    }

    if (params !== undefined && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
      throw dist$1.ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestParams(),
        data: args
      });
    }

    return new Promise((resolve, reject) => {
      this._rpcRequest({
        method,
        params
      }, getRpcPromiseCallback(resolve, reject));
    });
  }
  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @param payload - The RPC request object.
   * @param cb - The callback function.
   */


  sendAsync(payload, callback) {
    this._rpcRequest(payload, callback);
  }
  /**
   * We override the following event methods so that we can warn consumers
   * about deprecated events:
   *   addListener, on, once, prependListener, prependOnceListener
   */


  addListener(eventName, listener) {
    this._warnOfDeprecation(eventName);

    return super.addListener(eventName, listener);
  }

  on(eventName, listener) {
    this._warnOfDeprecation(eventName);

    return super.on(eventName, listener);
  }

  once(eventName, listener) {
    this._warnOfDeprecation(eventName);

    return super.once(eventName, listener);
  }

  prependListener(eventName, listener) {
    this._warnOfDeprecation(eventName);

    return super.prependListener(eventName, listener);
  }

  prependOnceListener(eventName, listener) {
    this._warnOfDeprecation(eventName);

    return super.prependOnceListener(eventName, listener);
  } // Private Methods
  //= ===================

  /**
   * Constructor helper.
   * Populates initial state by calling 'wallet_getProviderState' and emits
   * necessary events.
   */


  async _initializeState() {
    try {
      const {
        accounts,
        chainId,
        isUnlocked,
        networkVersion
      } = await this.request({
        method: "wallet_getProviderState"
      }); // indicate that we've connected, for EIP-1193 compliance

      this.emit("connect", {
        chainId
      });

      this._handleChainChanged({
        chainId,
        networkVersion
      });

      this._handleUnlockStateChanged({
        accounts,
        isUnlocked
      });

      this._handleAccountsChanged(accounts);
    } catch (error) {
      log.error("MetaMask: Failed to get initial state. Please report this bug.", error);
    } finally {
      log.info("initialized state");
      this._state.initialized = true;
      this.emit("_initialized");
    }
  }
  /**
   * Internal RPC method. Forwards requests to background via the RPC engine.
   * Also remap ids inbound and outbound.
   *
   * @param payload - The RPC request object.
   * @param callback - The consumer's callback.
   * @param isInternal - false - Whether the request is internal.
   */


  _rpcRequest(payload, callback) {
    let isInternal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let cb = callback;
    const _payload = payload;

    if (!Array.isArray(_payload)) {
      if (!_payload.jsonrpc) {
        _payload.jsonrpc = "2.0";
      }

      if (_payload.method === "eth_accounts" || _payload.method === "eth_requestAccounts") {
        // handle accounts changing
        cb = (err, res) => {
          this._handleAccountsChanged(res.result || [], _payload.method === "eth_accounts", isInternal);

          callback(err, res);
        };
      } else if (_payload.method === "wallet_getProviderState") {
        this._rpcEngine.handle(payload, cb);

        return;
      }
    }

    this.tryPreopenHandle(_payload, cb);
  }

  send(methodOrPayload, callbackOrArgs) {
    if (!this._sentWarnings.send) {
      log.warn(messages.warnings.sendDeprecation);
      this._sentWarnings.send = true;
    }

    if (typeof methodOrPayload === "string" && (!callbackOrArgs || Array.isArray(callbackOrArgs))) {
      return new Promise((resolve, reject) => {
        try {
          this._rpcRequest({
            method: methodOrPayload,
            params: callbackOrArgs
          }, getRpcPromiseCallback(resolve, reject, false));
        } catch (error) {
          reject(error);
        }
      });
    }

    if (methodOrPayload && typeof methodOrPayload === "object" && typeof callbackOrArgs === "function") {
      return this._rpcRequest(methodOrPayload, callbackOrArgs);
    }

    return this._sendSync(methodOrPayload);
  }
  /**
   * DEPRECATED.
   * Internal backwards compatibility method, used in send.
   */


  _sendSync(payload) {
    let result;

    switch (payload.method) {
      case "eth_accounts":
        result = this.selectedAddress ? [this.selectedAddress] : [];
        break;

      case "eth_coinbase":
        result = this.selectedAddress || null;
        break;

      case "eth_uninstallFilter":
        this._rpcRequest(payload, NOOP);

        result = true;
        break;

      case "net_version":
        result = this.networkVersion || null;
        break;

      default:
        throw new Error(messages.errors.unsupportedSync(payload.method));
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result
    };
  }
  /**
   * When the provider becomes connected, updates internal state and emits
   * required events. Idempotent.
   *
   * @param chainId - The ID of the newly connected chain.
   * emits MetaMaskInpageProvider#connect
   */


  _handleConnect(chainId) {
    if (!this._state.isConnected) {
      this._state.isConnected = true;
      this.emit("connect", {
        chainId
      });
      log.debug(messages.info.connected(chainId));
    }
  }
  /**
   * When the provider becomes disconnected, updates internal state and emits
   * required events. Idempotent with respect to the isRecoverable parameter.
   *
   * Error codes per the CloseEvent status codes as required by EIP-1193:
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
   *
   * @param isRecoverable - Whether the disconnection is recoverable.
   * @param errorMessage - A custom error message.
   * emits MetaMaskInpageProvider#disconnect
   */


  _handleDisconnect(isRecoverable, errorMessage) {
    if (this._state.isConnected || !this._state.isPermanentlyDisconnected && !isRecoverable) {
      this._state.isConnected = false;
      let error;

      if (isRecoverable) {
        error = new dist$1.EthereumRpcError(1013, // Try again later
        errorMessage || messages.errors.disconnected());
        log.debug(error);
      } else {
        error = new dist$1.EthereumRpcError(1011, // Internal error
        errorMessage || messages.errors.permanentlyDisconnected());
        log.error(error);
        this.chainId = null;
        this._state.accounts = null;
        this.selectedAddress = null;
        this._state.isUnlocked = false;
        this._state.isPermanentlyDisconnected = true;
      }

      this.emit("disconnect", error);
    }
  }
  /**
   * Called when connection is lost to critical streams.
   *
   * emits MetamaskInpageProvider#disconnect
   */


  _handleStreamDisconnect(streamName, error) {
    logStreamDisconnectWarning(streamName, error, this);

    this._handleDisconnect(false, error ? error.message : undefined);
  }
  /**
   * Called when accounts may have changed.
   */


  _handleAccountsChanged(accounts) {
    let isEthAccounts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let isInternal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // defensive programming
    let finalAccounts = accounts;

    if (!Array.isArray(finalAccounts)) {
      log.error("MetaMask: Received non-array accounts parameter. Please report this bug.", finalAccounts);
      finalAccounts = [];
    }

    for (const account of accounts) {
      if (typeof account !== "string") {
        log.error("MetaMask: Received non-string account. Please report this bug.", accounts);
        finalAccounts = [];
        break;
      }
    } // emit accountsChanged if anything about the accounts array has changed


    if (!fastDeepEqual(this._state.accounts, finalAccounts)) {
      // we should always have the correct accounts even before eth_accounts
      // returns, except in cases where isInternal is true
      if (isEthAccounts && Array.isArray(this._state.accounts) && this._state.accounts.length > 0 && !isInternal) {
        log.error('MetaMask: "eth_accounts" unexpectedly updated accounts. Please report this bug.', finalAccounts);
      }

      this._state.accounts = finalAccounts;
      this.emit("accountsChanged", finalAccounts);
    } // handle selectedAddress


    if (this.selectedAddress !== finalAccounts[0]) {
      this.selectedAddress = finalAccounts[0] || null;
    }
  }
  /**
   * Upon receipt of a new chainId and networkVersion, emits corresponding
   * events and sets relevant public state.
   * Does nothing if neither the chainId nor the networkVersion are different
   * from existing values.
   *
   * emits MetamaskInpageProvider#chainChanged
   * @param networkInfo - An object with network info.
   */


  _handleChainChanged() {
    let {
      chainId,
      networkVersion
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!chainId || !networkVersion) {
      log.error("MetaMask: Received invalid network parameters. Please report this bug.", {
        chainId,
        networkVersion
      });
      return;
    }

    if (networkVersion === "loading") {
      this._handleDisconnect(true);
    } else {
      this._handleConnect(chainId);

      if (chainId !== this.chainId) {
        this.chainId = chainId;

        if (this._state.initialized) {
          this.emit("chainChanged", this.chainId);
        }
      }
    }
  }
  /**
   * Upon receipt of a new isUnlocked state, sets relevant public state.
   * Calls the accounts changed handler with the received accounts, or an empty
   * array.
   *
   * Does nothing if the received value is equal to the existing value.
   * There are no lock/unlock events.
   *
   * @param opts - Options bag.
   */


  _handleUnlockStateChanged() {
    let {
      accounts,
      isUnlocked
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof isUnlocked !== "boolean") {
      log.error("MetaMask: Received invalid isUnlocked parameter. Please report this bug.", {
        isUnlocked
      });
      return;
    }

    if (isUnlocked !== this._state.isUnlocked) {
      this._state.isUnlocked = isUnlocked;

      this._handleAccountsChanged(accounts || []);
    }
  }
  /**
   * Warns of deprecation for the given event, if applicable.
   */


  _warnOfDeprecation(eventName) {
    if (this._sentWarnings.events[eventName] === false) {
      log.warn(messages.warnings.events[eventName]);
      this._sentWarnings.events[eventName] = true;
    }
  }

}

_defineProperty(TorusInpageProvider, "_defaultState", {
  accounts: null,
  isConnected: false,
  isUnlocked: false,
  initialized: false,
  isPermanentlyDisconnected: false,
  hasEmittedConnection: false
});

const defaults = options => ({
  algorithms: options.algorithms || ["sha256"],
  delimiter: options.delimiter || " ",
  full: options.full || false
}); // Generate list of hashes


const hashes = (options, data) => {
  const internalHashes = {};
  options.algorithms.forEach(algorithm => {
    internalHashes[algorithm] = browser$1(algorithm).update(data, "utf8").digest("base64");
  });
  return internalHashes;
}; // Build an integrity string


const integrity = (options, sri) => {
  let output = ""; // Hash list

  output += Object.keys(sri.hashes).map(algorithm => `${algorithm}-${sri.hashes[algorithm]}`).join(options.delimiter);
  return output;
};

const main = (options, data) => {
  // Defaults
  const finalOptions = defaults(options);
  const sri = {
    hashes: hashes(finalOptions, data),
    integrity: undefined
  };
  sri.integrity = integrity(finalOptions, sri);
  return finalOptions.full ? sri : sri.integrity;
};

class PopupHandler extends EventEmitter {
  constructor(_ref) {
    let {
      url,
      target,
      features
    } = _ref;
    super();

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "target", void 0);

    _defineProperty(this, "features", void 0);

    _defineProperty(this, "window", void 0);

    _defineProperty(this, "windowTimer", void 0);

    _defineProperty(this, "iClosedWindow", void 0);

    this.url = url;
    this.target = target || "_blank";
    this.features = features || getPopupFeatures();
    this.window = undefined;
    this.windowTimer = undefined;
    this.iClosedWindow = false;

    this._setupTimer();
  }

  _setupTimer() {
    this.windowTimer = Number(setInterval(() => {
      if (this.window && this.window.closed) {
        clearInterval(this.windowTimer);

        if (!this.iClosedWindow) {
          this.emit("close");
        }

        this.iClosedWindow = false;
        this.window = undefined;
      }

      if (this.window === undefined) clearInterval(this.windowTimer);
    }, 500));
  }

  open() {
    var _this$window;

    this.window = window.open(this.url.href, this.target, this.features);
    if ((_this$window = this.window) !== null && _this$window !== void 0 && _this$window.focus) this.window.focus();
    return Promise.resolve();
  }

  close() {
    this.iClosedWindow = true;
    if (this.window) this.window.close();
  }

  redirect(locationReplaceOnRedirect) {
    if (locationReplaceOnRedirect) {
      window.location.replace(this.url.href);
    } else {
      window.location.href = this.url.href;
    }
  }

}

/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns - whether the image exists
 */

function imgExists(url) {
  return new Promise((resolve, reject) => {
    try {
      const img = document.createElement("img");

      img.onload = () => resolve(true);

      img.onerror = () => resolve(false);

      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}
/**
 * Extracts a name for the site from the DOM
 */


const getSiteName = window => {
  const {
    document
  } = window;
  const siteName = document.querySelector('head > meta[property="og:site_name"]');

  if (siteName) {
    return siteName.content;
  }

  const metaTitle = document.querySelector('head > meta[name="title"]');

  if (metaTitle) {
    return metaTitle.content;
  }

  if (document.title && document.title.length > 0) {
    return document.title;
  }

  return window.location.hostname;
};
/**
 * Extracts an icon for the site from the DOM
 */


async function getSiteIcon(window) {
  const {
    document
  } = window; // Use the site's favicon if it exists

  let icon = document.querySelector('head > link[rel="shortcut icon"]');

  if (icon && (await imgExists(icon.href))) {
    return icon.href;
  } // Search through available icons in no particular order


  icon = Array.from(document.querySelectorAll('head > link[rel="icon"]')).find(_icon => Boolean(_icon.href));

  if (icon && (await imgExists(icon.href))) {
    return icon.href;
  }

  return null;
}
/**
 * Gets site metadata and returns it
 *
 */


const getSiteMetadata = async () => ({
  name: getSiteName(window),
  icon: await getSiteIcon(window)
});
/**
 * Sends site metadata over an RPC request.
 */


async function sendSiteMetadata(engine) {
  try {
    const domainMetadata = await getSiteMetadata(); // call engine.handle directly to avoid normal RPC request handling

    engine.handle({
      jsonrpc: "2.0",
      id: getPreopenInstanceId(),
      method: "wallet_sendDomainMetadata",
      params: domainMetadata
    }, NOOP);
  } catch (error) {
    log.error({
      message: messages.errors.sendSiteMetadata(),
      originalError: error
    });
  }
}

const _excluded = ["host", "chainId", "networkName"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
const defaultVerifiers = {
  [LOGIN_PROVIDER.GOOGLE]: true,
  [LOGIN_PROVIDER.FACEBOOK]: true,
  [LOGIN_PROVIDER.REDDIT]: true,
  [LOGIN_PROVIDER.TWITCH]: true,
  [LOGIN_PROVIDER.DISCORD]: true
};
const iframeIntegrity = "sha384-r+lbNWx+duYcTlVByhbJDIek3bIbCRjSplukxMJvN9XYtbRRXK8RIUdpVwBp7Nq0";
const expectedCacheControlHeader = "max-age=3600";
const UNSAFE_METHODS = ["eth_sendTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "personal_sign", "eth_getEncryptionPublicKey", "eth_decrypt"]; // preload for iframe doesn't work https://bugs.chromium.org/p/chromium/issues/detail?id=593267

(async function preLoadIframe() {
  try {
    if (typeof document === "undefined") return;
    const torusIframeHtml = document.createElement("link");
    const {
      torusUrl
    } = await getTorusUrl("production", {
      check: false,
      hash: iframeIntegrity,
      version: ""
    });
    torusIframeHtml.href = `${torusUrl}/popup`;
    torusIframeHtml.crossOrigin = "anonymous";
    torusIframeHtml.type = "text/html";
    torusIframeHtml.rel = "prefetch";

    if (torusIframeHtml.relList && torusIframeHtml.relList.supports) {
      if (torusIframeHtml.relList.supports("prefetch")) {
        document.head.appendChild(torusIframeHtml);
      }
    }
  } catch (error) {
    log.warn(error);
  }
})();

class Torus {
  constructor() {
    let {
      buttonPosition = BUTTON_POSITION.BOTTOM_LEFT,
      buttonSize = 56,
      modalZIndex = 99999,
      apiKey = "torus-default"
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _defineProperty(this, "buttonPosition", BUTTON_POSITION.BOTTOM_LEFT);

    _defineProperty(this, "buttonSize", void 0);

    _defineProperty(this, "torusUrl", void 0);

    _defineProperty(this, "torusIframe", void 0);

    _defineProperty(this, "styleLink", void 0);

    _defineProperty(this, "isLoggedIn", void 0);

    _defineProperty(this, "isInitialized", void 0);

    _defineProperty(this, "torusWidgetVisibility", void 0);

    _defineProperty(this, "torusAlert", void 0);

    _defineProperty(this, "apiKey", void 0);

    _defineProperty(this, "modalZIndex", void 0);

    _defineProperty(this, "alertZIndex", void 0);

    _defineProperty(this, "torusAlertContainer", void 0);

    _defineProperty(this, "isIframeFullScreen", void 0);

    _defineProperty(this, "whiteLabel", void 0);

    _defineProperty(this, "requestedVerifier", void 0);

    _defineProperty(this, "currentVerifier", void 0);

    _defineProperty(this, "embedTranslations", void 0);

    _defineProperty(this, "ethereum", void 0);

    _defineProperty(this, "provider", void 0);

    _defineProperty(this, "communicationMux", void 0);

    _defineProperty(this, "isLoginCallback", void 0);

    _defineProperty(this, "paymentProviders", configuration.paymentProviders);

    _defineProperty(this, "loginHint", "");

    _defineProperty(this, "useWalletConnect", void 0);

    _defineProperty(this, "isCustomLogin", false);

    this.buttonPosition = buttonPosition;
    this.buttonSize = buttonSize;
    this.torusUrl = "";
    this.isLoggedIn = false; // ethereum.enable working

    this.isInitialized = false; // init done

    this.torusWidgetVisibility = true;
    this.requestedVerifier = "";
    this.currentVerifier = ""; // this.nodeDetailManager = new NodeDetailManager();
    // this.torusJs = new TorusJs({
    //   metadataHost: "https://metadata.tor.us",
    //   allowHost: "https://signer.tor.us/api/allow",
    //   network: "mainnet",
    // });

    this.apiKey = apiKey;
    setAPIKey(apiKey);
    this.modalZIndex = modalZIndex;
    this.alertZIndex = modalZIndex + 1000;
    this.isIframeFullScreen = false;
  }

  async init() {
    let {
      buildEnv = TORUS_BUILD_ENV.PRODUCTION,
      enableLogging = false,
      // deprecated: use loginConfig instead
      enabledVerifiers = defaultVerifiers,
      network = {
        host: "mainnet",
        chainId: null,
        networkName: "",
        blockExplorer: "",
        ticker: "",
        tickerName: ""
      },
      loginConfig = {},
      showTorusButton = true,
      integrity = {
        check: false,
        hash: iframeIntegrity,
        version: ""
      },
      whiteLabel,
      skipTKey = false,
      useWalletConnect = false,
      mfaLevel = "default"
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (this.isInitialized) throw new Error("Already initialized");
    const {
      torusUrl,
      logLevel
    } = await getTorusUrl(buildEnv, integrity);
    log.info(torusUrl, "url loaded");
    this.torusUrl = torusUrl;
    this.whiteLabel = whiteLabel;
    this.useWalletConnect = useWalletConnect;
    this.isCustomLogin = !!(loginConfig && Object.keys(loginConfig).length > 0) || !!(whiteLabel && Object.keys(whiteLabel).length > 0);
    log.setDefaultLevel(logLevel);
    if (enableLogging) log.enableAll();else log.disableAll();
    this.torusWidgetVisibility = showTorusButton;
    const torusIframeUrl = new URL(torusUrl);
    if (torusIframeUrl.pathname.endsWith("/")) torusIframeUrl.pathname += "popup";else torusIframeUrl.pathname += "/popup";
    torusIframeUrl.hash = `#isCustomLogin=${this.isCustomLogin}`; // Iframe code

    this.torusIframe = htmlToElement(`<iframe
        id="torusIframe"
        allow=${useWalletConnect ? "camera" : ""}
        class="torusIframe"
        src="${torusIframeUrl.href}"
        style="display: none; position: fixed; top: 0; right: 0; width: 100%;
        height: 100%; border: none; border-radius: 0; z-index: ${this.modalZIndex}"
      ></iframe>`);
    this.torusAlertContainer = htmlToElement('<div id="torusAlertContainer"></div>');
    this.torusAlertContainer.style.display = "none";
    this.torusAlertContainer.style.setProperty("z-index", this.alertZIndex.toString());
    const link = window.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", `${torusUrl}/css/widget.css`);
    this.styleLink = link;
    const {
      defaultLanguage = getUserLanguage(),
      customTranslations = {}
    } = this.whiteLabel || {};
    const mergedTranslations = lodash_merge(configuration.translations, customTranslations);
    const languageTranslations = mergedTranslations[defaultLanguage] || configuration.translations[getUserLanguage()];
    this.embedTranslations = languageTranslations.embed;

    const handleSetup = async () => {
      await documentReady();
      return new Promise((resolve, reject) => {
        this.torusIframe.onload = async () => {
          // only do this if iframe is not full screen
          this._setupWeb3();

          const initStream = this.communicationMux.getStream("init_stream");
          initStream.on("data", chunk => {
            const {
              name,
              data,
              error
            } = chunk;

            if (name === "init_complete" && data.success) {
              // resolve promise
              this.isInitialized = true;

              this._displayIframe(this.isIframeFullScreen);

              resolve(undefined);
            } else if (error) {
              reject(new Error(error));
            }
          });
          initStream.write({
            name: "init_stream",
            data: {
              enabledVerifiers,
              loginConfig,
              whiteLabel: this.whiteLabel,
              buttonPosition: this.buttonPosition,
              buttonSize: this.buttonSize,
              torusWidgetVisibility: this.torusWidgetVisibility,
              apiKey: this.apiKey,
              skipTKey,
              network,
              mfaLevel
            }
          });
        };

        window.document.head.appendChild(this.styleLink);
        window.document.body.appendChild(this.torusIframe);
        window.document.body.appendChild(this.torusAlertContainer);
      });
    };

    if (buildEnv === "production" && integrity.check) {
      // hacky solution to check for iframe integrity
      const fetchUrl = `${torusUrl}/popup`;
      const resp = await fetch(fetchUrl, {
        cache: "reload"
      });

      if (resp.headers.get("Cache-Control") !== expectedCacheControlHeader) {
        throw new Error(`Unexpected Cache-Control headers, got ${resp.headers.get("Cache-Control")}`);
      }

      const response = await resp.text();
      const calculatedIntegrity = main({
        algorithms: ["sha384"]
      }, response);
      log.info(calculatedIntegrity, "integrity");

      if (calculatedIntegrity === integrity.hash) {
        await handleSetup();
      } else {
        this.clearInit();
        throw new Error("Integrity check failed");
      }
    } else {
      await handleSetup();
    }

    return undefined;
  }

  login() {
    let {
      verifier = "",
      login_hint: loginHint = ""
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!this.isInitialized) throw new Error("Call init() first");
    this.requestedVerifier = verifier;
    this.loginHint = loginHint;
    return this.ethereum.enable();
  }

  logout() {
    return new Promise((resolve, reject) => {
      if (!this.isLoggedIn) {
        reject(new Error("User has not logged in yet"));
        return;
      }

      const logOutStream = this.communicationMux.getStream("logout");
      logOutStream.write({
        name: "logOut"
      });
      const statusStream = this.communicationMux.getStream("status");

      const statusStreamHandler = status => {
        if (!status.loggedIn) {
          this.isLoggedIn = false;
          this.currentVerifier = "";
          this.requestedVerifier = "";
          resolve();
        } else reject(new Error("Some Error Occured"));
      };

      handleStream(statusStream, "data", statusStreamHandler);
    });
  }

  async cleanUp() {
    if (this.isLoggedIn) {
      await this.logout();
    }

    this.clearInit();
  }

  clearInit() {
    function isElement(element) {
      return element instanceof Element || element instanceof HTMLDocument;
    }

    if (isElement(this.styleLink) && window.document.body.contains(this.styleLink)) {
      this.styleLink.remove();
      this.styleLink = undefined;
    }

    if (isElement(this.torusIframe) && window.document.body.contains(this.torusIframe)) {
      this.torusIframe.remove();
      this.torusIframe = undefined;
    }

    if (isElement(this.torusAlertContainer) && window.document.body.contains(this.torusAlertContainer)) {
      this.torusAlert = undefined;
      this.torusAlertContainer.remove();
      this.torusAlertContainer = undefined;
    }

    this.isInitialized = false;
  }

  hideTorusButton() {
    this.torusWidgetVisibility = false;

    this._sendWidgetVisibilityStatus(false);

    this._displayIframe();
  }

  showTorusButton() {
    this.torusWidgetVisibility = true;

    this._sendWidgetVisibilityStatus(true);

    this._displayIframe();
  }

  setProvider(_ref) {
    let {
      host = "mainnet",
      chainId = null,
      networkName = ""
    } = _ref,
        rest = _objectWithoutProperties(_ref, _excluded);

    return new Promise((resolve, reject) => {
      const providerChangeStream = this.communicationMux.getStream("provider_change");

      const handler = chunk => {
        const {
          err,
          success
        } = chunk.data;
        log.info(chunk);

        if (err) {
          reject(err);
        } else if (success) {
          resolve();
        } else reject(new Error("some error occured"));
      };

      handleStream(providerChangeStream, "data", handler);
      const preopenInstanceId = getPreopenInstanceId();

      this._handleWindow(preopenInstanceId, {
        target: "_blank",
        features: FEATURES_PROVIDER_CHANGE_WINDOW
      });

      providerChangeStream.write({
        name: "show_provider_change",
        data: {
          network: _objectSpread({
            host,
            chainId,
            networkName
          }, rest),
          preopenInstanceId,
          override: false
        }
      });
    });
  }

  showWallet(path) {
    let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const showWalletStream = this.communicationMux.getStream("show_wallet");
    const finalPath = path ? `/${path}` : "";
    showWalletStream.write({
      name: "show_wallet",
      data: {
        path: finalPath
      }
    });

    const showWalletHandler = chunk => {
      if (chunk.name === "show_wallet_instance") {
        // Let the error propogate up (hence, no try catch)
        const {
          instanceId
        } = chunk.data;
        const finalUrl = new URL(`${this.torusUrl}/wallet${finalPath}`); // Using URL constructor to prevent js injection and allow parameter validation.!

        finalUrl.searchParams.append("integrity", "true");
        finalUrl.searchParams.append("instanceId", instanceId);
        Object.keys(params).forEach(x => {
          finalUrl.searchParams.append(x, params[x]);
        });
        finalUrl.hash = `#isCustomLogin=${this.isCustomLogin}`;
        const walletWindow = new PopupHandler({
          url: finalUrl,
          features: FEATURES_DEFAULT_WALLET_WINDOW
        });
        walletWindow.open();
      }
    };

    handleStream(showWalletStream, "data", showWalletHandler);
  }

  async getPublicAddress(_ref2) {
    let {
      verifier,
      verifierId,
      isExtended = false
    } = _ref2;
    if (!configuration.supportedVerifierList.includes(verifier) || !WALLET_OPENLOGIN_VERIFIER_MAP[verifier]) throw new Error("Unsupported verifier");
    const walletVerifier = verifier;
    const openloginVerifier = WALLET_OPENLOGIN_VERIFIER_MAP[verifier];
    const url = new URL(`https://api.tor.us/lookup/torus`);
    url.searchParams.append("verifier", openloginVerifier);
    url.searchParams.append("verifierId", verifierId);
    url.searchParams.append("walletVerifier", walletVerifier);
    url.searchParams.append("network", "mainnet");
    url.searchParams.append("isExtended", isExtended.toString());
    return get(url.href, {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }, {
      useAPIKey: true
    });
  }

  getUserInfo(message) {
    return new Promise((resolve, reject) => {
      if (this.isLoggedIn) {
        const userInfoAccessStream = this.communicationMux.getStream("user_info_access");
        userInfoAccessStream.write({
          name: "user_info_access_request"
        });

        const userInfoAccessHandler = chunk => {
          const {
            name,
            data: {
              approved,
              payload,
              rejected,
              newRequest
            }
          } = chunk;

          if (name === "user_info_access_response") {
            if (approved) {
              resolve(payload);
            } else if (rejected) {
              reject(new Error("User rejected the request"));
            } else if (newRequest) {
              const userInfoStream = this.communicationMux.getStream("user_info");

              const userInfoHandler = handlerChunk => {
                if (handlerChunk.name === "user_info_response") {
                  if (handlerChunk.data.approved) {
                    resolve(handlerChunk.data.payload);
                  } else {
                    reject(new Error("User rejected the request"));
                  }
                }
              };

              handleStream(userInfoStream, "data", userInfoHandler);
              const preopenInstanceId = getPreopenInstanceId();

              this._handleWindow(preopenInstanceId, {
                target: "_blank",
                features: FEATURES_PROVIDER_CHANGE_WINDOW
              });

              userInfoStream.write({
                name: "user_info_request",
                data: {
                  message,
                  preopenInstanceId
                }
              });
            }
          }
        };

        handleStream(userInfoAccessStream, "data", userInfoAccessHandler);
      } else reject(new Error("User has not logged in yet"));
    });
  }

  initiateTopup(provider, params) {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        const {
          errors,
          isValid
        } = validatePaymentProvider(provider, params);

        if (!isValid) {
          reject(new Error(JSON.stringify(errors)));
          return;
        }

        const topupStream = this.communicationMux.getStream("topup");

        const topupHandler = chunk => {
          if (chunk.name === "topup_response") {
            if (chunk.data.success) {
              resolve(chunk.data.success);
            } else {
              reject(new Error(chunk.data.error));
            }
          }
        };

        handleStream(topupStream, "data", topupHandler);
        const preopenInstanceId = getPreopenInstanceId();

        this._handleWindow(preopenInstanceId);

        topupStream.write({
          name: "topup_request",
          data: {
            provider,
            params,
            preopenInstanceId
          }
        });
      } else reject(new Error("Torus is not initialized yet"));
    });
  }

  async loginWithPrivateKey(loginParams) {
    const {
      privateKey,
      userInfo
    } = loginParams;
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        if (Buffer$3.from(privateKey, "hex").length !== 32) {
          reject(new Error("Invalid private key, Please provide a 32 byte valid secp25k1 private key"));
          return;
        }

        const loginPrivKeyStream = this.communicationMux.getStream("login_with_private_key");

        const loginHandler = chunk => {
          if (chunk.name === "login_with_private_key_response") {
            if (chunk.data.success) {
              resolve(chunk.data.success);
            } else {
              reject(new Error(chunk.data.error));
            }
          }
        };

        handleStream(loginPrivKeyStream, "data", loginHandler);
        loginPrivKeyStream.write({
          name: "login_with_private_key_request",
          data: {
            privateKey,
            userInfo
          }
        });
      } else reject(new Error("Torus is not initialized yet"));
    });
  }

  async showWalletConnectScanner() {
    if (!this.useWalletConnect) throw new Error("Set `useWalletConnect` as true in init function options to use wallet connect scanner");
    return new Promise((resolve, reject) => {
      if (this.isLoggedIn) {
        const walletConnectStream = this.communicationMux.getStream("wallet_connect_stream");

        const walletConnectHandler = chunk => {
          if (chunk.name === "wallet_connect_stream_res") {
            if (chunk.data.success) {
              resolve(chunk.data.success);
            } else {
              reject(new Error(chunk.data.error));
            }

            this._displayIframe();
          }
        };

        handleStream(walletConnectStream, "data", walletConnectHandler);
        walletConnectStream.write({
          name: "wallet_connect_stream_req"
        });

        this._displayIframe(true);
      } else reject(new Error("User has not logged in yet"));
    });
  }

  _handleWindow(preopenInstanceId) {
    let {
      url,
      target,
      features
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (preopenInstanceId) {
      const windowStream = this.communicationMux.getStream("window");
      const finalUrl = new URL(url || `${this.torusUrl}/redirect?preopenInstanceId=${preopenInstanceId}`);
      if (finalUrl.hash) finalUrl.hash += `&isCustomLogin=${this.isCustomLogin}`;else finalUrl.hash = `#isCustomLogin=${this.isCustomLogin}`;
      const handledWindow = new PopupHandler({
        url: finalUrl,
        target,
        features
      });
      handledWindow.open();

      if (!handledWindow.window) {
        this._createPopupBlockAlert(preopenInstanceId, finalUrl.href);

        return;
      }

      windowStream.write({
        name: "opened_window",
        data: {
          preopenInstanceId
        }
      });

      const closeHandler = _ref3 => {
        let {
          preopenInstanceId: receivedId,
          close
        } = _ref3;

        if (receivedId === preopenInstanceId && close) {
          handledWindow.close();
          windowStream.removeListener("data", closeHandler);
        }
      };

      windowStream.on("data", closeHandler);
      handledWindow.once("close", () => {
        windowStream.write({
          data: {
            preopenInstanceId,
            closed: true
          }
        });
        windowStream.removeListener("data", closeHandler);
      });
    }
  }

  _setEmbedWhiteLabel(element) {
    // Set whitelabel
    const {
      theme
    } = this.whiteLabel || {};

    if (theme) {
      const {
        isDark = false,
        colors = {}
      } = theme;
      if (isDark) element.classList.add("torus-dark");
      if (colors.torusBrand1) element.style.setProperty("--torus-brand-1", colors.torusBrand1);
      if (colors.torusGray2) element.style.setProperty("--torus-gray-2", colors.torusGray2);
    }
  }

  _getLogoUrl() {
    var _this$whiteLabel, _this$whiteLabel$them;

    let logoUrl = `${this.torusUrl}/images/torus_icon-blue.svg`;

    if ((_this$whiteLabel = this.whiteLabel) !== null && _this$whiteLabel !== void 0 && (_this$whiteLabel$them = _this$whiteLabel.theme) !== null && _this$whiteLabel$them !== void 0 && _this$whiteLabel$them.isDark) {
      var _this$whiteLabel2;

      logoUrl = ((_this$whiteLabel2 = this.whiteLabel) === null || _this$whiteLabel2 === void 0 ? void 0 : _this$whiteLabel2.logoLight) || logoUrl;
    } else {
      var _this$whiteLabel3;

      logoUrl = ((_this$whiteLabel3 = this.whiteLabel) === null || _this$whiteLabel3 === void 0 ? void 0 : _this$whiteLabel3.logoDark) || logoUrl;
    }

    return logoUrl;
  }

  _sendWidgetVisibilityStatus(status) {
    const torusWidgetVisibilityStream = this.communicationMux.getStream("torus-widget-visibility");
    torusWidgetVisibilityStream.write({
      data: status
    });
  }

  _displayIframe() {
    let isFull = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const style = {};
    const size = this.buttonSize + 14; // 15px padding
    // set phase

    if (!isFull) {
      style.display = this.torusWidgetVisibility ? "block" : "none";
      style.height = `${size}px`;
      style.width = `${size}px`;

      switch (this.buttonPosition) {
        case BUTTON_POSITION.TOP_LEFT:
          style.top = "0px";
          style.left = "0px";
          style.right = "auto";
          style.bottom = "auto";
          break;

        case BUTTON_POSITION.TOP_RIGHT:
          style.top = "0px";
          style.right = "0px";
          style.left = "auto";
          style.bottom = "auto";
          break;

        case BUTTON_POSITION.BOTTOM_RIGHT:
          style.bottom = "0px";
          style.right = "0px";
          style.top = "auto";
          style.left = "auto";
          break;

        case BUTTON_POSITION.BOTTOM_LEFT:
        default:
          style.bottom = "0px";
          style.left = "0px";
          style.top = "auto";
          style.right = "auto";
          break;
      }
    } else {
      style.display = "block";
      style.width = "100%";
      style.height = "100%";
      style.top = "0px";
      style.right = "0px";
      style.left = "0px";
      style.bottom = "0px";
    }

    Object.assign(this.torusIframe.style, style);
    this.isIframeFullScreen = isFull;
  }

  _setupWeb3() {
    log.info("setupWeb3 running"); // setup background connection

    const metamaskStream = new BasePostMessageStream({
      name: "embed_metamask",
      target: "iframe_metamask",
      targetWindow: this.torusIframe.contentWindow,
      targetOrigin: new URL(this.torusUrl).origin
    }); // Due to compatibility reasons, we should not set up multiplexing on window.metamaskstream
    // because the MetamaskInpageProvider also attempts to do so.
    // We create another LocalMessageDuplexStream for communication between dapp <> iframe

    const communicationStream = new BasePostMessageStream({
      name: "embed_comm",
      target: "iframe_comm",
      targetWindow: this.torusIframe.contentWindow,
      targetOrigin: new URL(this.torusUrl).origin
    }); // Backward compatibility with Gotchi :)
    // window.metamaskStream = this.communicationStream
    // compose the inpage provider

    const inpageProvider = new TorusInpageProvider(metamaskStream); // detect eth_requestAccounts and pipe to enable for now

    const detectAccountRequestPrototypeModifier = m => {
      const originalMethod = inpageProvider[m];

      inpageProvider[m] = function providerFunc(method) {
        if (method && method === "eth_requestAccounts") {
          return inpageProvider.enable();
        }

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return originalMethod.apply(this, [method, ...args]);
      };
    };

    detectAccountRequestPrototypeModifier("send");
    detectAccountRequestPrototypeModifier("sendAsync");

    inpageProvider.enable = () => {
      return new Promise((resolve, reject) => {
        // If user is already logged in, we assume they have given access to the website
        inpageProvider.sendAsync({
          jsonrpc: "2.0",
          id: getPreopenInstanceId(),
          method: "eth_requestAccounts",
          params: []
        }, (err, response) => {
          const {
            result: res
          } = response || {};

          if (err) {
            setTimeout(() => {
              reject(err);
            }, 50);
          } else if (Array.isArray(res) && res.length > 0) {
            // If user is already rehydrated, resolve this
            // else wait for something to be written to status stream
            const handleLoginCb = () => {
              if (this.requestedVerifier !== "" && this.currentVerifier !== this.requestedVerifier) {
                const {
                  requestedVerifier
                } = this; // eslint-disable-next-line promise/no-promise-in-callback

                this.logout() // eslint-disable-next-line promise/always-return
                .then(_ => {
                  this.requestedVerifier = requestedVerifier;

                  this._showLoginPopup(true, resolve, reject);
                }).catch(error => reject(error));
              } else {
                resolve(res);
              }
            };

            if (this.isLoggedIn) {
              handleLoginCb();
            } else {
              this.isLoginCallback = handleLoginCb;
            }
          } else {
            // set up listener for login
            this._showLoginPopup(true, resolve, reject);
          }
        });
      });
    };

    inpageProvider.tryPreopenHandle = (payload, cb) => {
      const _payload = payload;

      if (!Array.isArray(_payload) && UNSAFE_METHODS.includes(_payload.method)) {
        const preopenInstanceId = getPreopenInstanceId();

        this._handleWindow(preopenInstanceId, {
          target: "_blank",
          features: FEATURES_CONFIRM_WINDOW
        });

        _payload.preopenInstanceId = preopenInstanceId;
      }

      inpageProvider._rpcEngine.handle(_payload, cb);
    }; // Work around for web3@1.0 deleting the bound `sendAsync` but not the unbound
    // `sendAsync` method on the prototype, causing `this` reference issues with drizzle


    const proxiedInpageProvider = new Proxy(inpageProvider, {
      // straight up lie that we deleted the property so that it doesnt
      // throw an error in strict mode
      deleteProperty: () => true
    });
    this.ethereum = proxiedInpageProvider;
    const communicationMux = setupMultiplex(communicationStream);
    this.communicationMux = communicationMux;
    const windowStream = communicationMux.getStream("window");
    windowStream.on("data", chunk => {
      if (chunk.name === "create_window") {
        // url is the url we need to open
        // we can pass the final url upfront so that it removes the step of redirecting to /redirect and waiting for finalUrl
        this._createPopupBlockAlert(chunk.data.preopenInstanceId, chunk.data.url);
      }
    }); // show torus widget if button clicked

    const widgetStream = communicationMux.getStream("widget");
    widgetStream.on("data", chunk => {
      const {
        data
      } = chunk;

      this._displayIframe(data);
    }); // Show torus button if wallet has been hydrated/detected

    const statusStream = communicationMux.getStream("status");
    statusStream.on("data", status => {
      // login
      if (status.loggedIn) {
        this.isLoggedIn = status.loggedIn;
        this.currentVerifier = status.verifier;
      } // logout
      else this._displayIframe();

      if (this.isLoginCallback) {
        this.isLoginCallback();
        delete this.isLoginCallback;
      }
    });
    this.provider = proxiedInpageProvider;
    if (this.provider.shouldSendMetadata) sendSiteMetadata(this.provider._rpcEngine);

    inpageProvider._initializeState();

    log.debug("Torus - injected provider");
  }

  _showLoginPopup(calledFromEmbed, resolve, reject) {
    const loginHandler = data => {
      const {
        err,
        selectedAddress
      } = data;

      if (err) {
        log.error(err);
        if (reject) reject(err);
      } // returns an array (cause accounts expects it)
      else if (resolve) resolve([selectedAddress]);

      if (this.isIframeFullScreen) this._displayIframe();
    };

    const oauthStream = this.communicationMux.getStream("oauth");

    if (!this.requestedVerifier) {
      this._displayIframe(true);

      handleStream(oauthStream, "data", loginHandler);
      oauthStream.write({
        name: "oauth_modal",
        data: {
          calledFromEmbed
        }
      });
    } else {
      handleStream(oauthStream, "data", loginHandler);
      const preopenInstanceId = getPreopenInstanceId();

      this._handleWindow(preopenInstanceId);

      oauthStream.write({
        name: "oauth",
        data: {
          calledFromEmbed,
          verifier: this.requestedVerifier,
          preopenInstanceId,
          login_hint: this.loginHint
        }
      });
    }
  }

  _createPopupBlockAlert(preopenInstanceId, url) {
    const logoUrl = this._getLogoUrl();

    const torusAlert = htmlToElement('<div id="torusAlert" class="torus-alert--v2">' + `<div id="torusAlert__logo"><img src="${logoUrl}" /></div>` + "<div>" + `<h1 id="torusAlert__title">${this.embedTranslations.actionRequired}</h1>` + `<p id="torusAlert__desc">${this.embedTranslations.pendingAction}</p>` + "</div>" + "</div>");
    const successAlert = htmlToElement(`<div><a id="torusAlert__btn">${this.embedTranslations.continue}</a></div>`);
    const btnContainer = htmlToElement('<div id="torusAlert__btn-container"></div>');
    btnContainer.appendChild(successAlert);
    torusAlert.appendChild(btnContainer);

    const bindOnLoad = () => {
      successAlert.addEventListener("click", () => {
        this._handleWindow(preopenInstanceId, {
          url,
          target: "_blank",
          features: FEATURES_CONFIRM_WINDOW
        });

        torusAlert.remove();
        if (this.torusAlertContainer.children.length === 0) this.torusAlertContainer.style.display = "none";
      });
    };

    this._setEmbedWhiteLabel(torusAlert);

    const attachOnLoad = () => {
      this.torusAlertContainer.style.display = "block";
      this.torusAlertContainer.appendChild(torusAlert);
    };

    runOnLoad(attachOnLoad);
    runOnLoad(bindOnLoad);
  }

}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var TorusWalletAdapter = /*#__PURE__*/function (_BaseEvmAdapter) {
  _inherits(TorusWalletAdapter, _BaseEvmAdapter);

  var _super = _createSuper(TorusWalletAdapter);

  function TorusWalletAdapter(params) {
    var _this;

    _classCallCheck(this, TorusWalletAdapter);

    _this = _super.call(this, params);

    _defineProperty(_assertThisInitialized(_this), "name", WALLET_ADAPTERS.TORUS_EVM);

    _defineProperty(_assertThisInitialized(_this), "adapterNamespace", ADAPTER_NAMESPACES.EIP155);

    _defineProperty(_assertThisInitialized(_this), "currentChainNamespace", CHAIN_NAMESPACES.EIP155);

    _defineProperty(_assertThisInitialized(_this), "type", ADAPTER_CATEGORY.EXTERNAL);

    _defineProperty(_assertThisInitialized(_this), "status", ADAPTER_STATUS.NOT_READY);

    _defineProperty(_assertThisInitialized(_this), "torusInstance", null);

    _defineProperty(_assertThisInitialized(_this), "torusWalletOptions", void 0);

    _defineProperty(_assertThisInitialized(_this), "initParams", void 0);

    _defineProperty(_assertThisInitialized(_this), "loginSettings", {});

    _defineProperty(_assertThisInitialized(_this), "rehydrated", false);

    _this.torusWalletOptions = params.adapterSettings || {};
    _this.initParams = params.initParams || {};
    _this.loginSettings = params.loginSettings || {};
    _this.chainConfig = params.chainConfig || null;
    _this.sessionTime = params.sessionTime || 86400;
    return _this;
  }

  _createClass(TorusWalletAdapter, [{
    key: "provider",
    get: function get() {
      if (this.status === ADAPTER_STATUS.CONNECTED && this.torusInstance) {
        return this.torusInstance.provider;
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
        var network, _this$chainConfig, blockExplorer, displayName, chainId, ticker, tickerName, _this$chainConfig2, _chainId2, _blockExplorer, _displayName, rpcTarget, _ticker, _tickerName;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _get(_getPrototypeOf(TorusWalletAdapter.prototype), "checkInitializationRequirements", this).call(this); // set chainConfig for mainnet by default if not set


                if (!this.chainConfig) {
                  this.chainConfig = getChainConfig(CHAIN_NAMESPACES.EIP155, 1);
                  _this$chainConfig = this.chainConfig, blockExplorer = _this$chainConfig.blockExplorer, displayName = _this$chainConfig.displayName, chainId = _this$chainConfig.chainId, ticker = _this$chainConfig.ticker, tickerName = _this$chainConfig.tickerName;
                  network = {
                    chainId: Number.parseInt(chainId, 16),
                    host: "mainnet",
                    blockExplorer: blockExplorer,
                    networkName: displayName,
                    ticker: ticker,
                    tickerName: tickerName
                  };
                } else {
                  _this$chainConfig2 = this.chainConfig, _chainId2 = _this$chainConfig2.chainId, _blockExplorer = _this$chainConfig2.blockExplorer, _displayName = _this$chainConfig2.displayName, rpcTarget = _this$chainConfig2.rpcTarget, _ticker = _this$chainConfig2.ticker, _tickerName = _this$chainConfig2.tickerName;
                  network = {
                    chainId: Number.parseInt(_chainId2, 16),
                    host: rpcTarget,
                    blockExplorer: _blockExplorer,
                    networkName: _displayName,
                    ticker: _ticker,
                    tickerName: _tickerName
                  };
                }

                this.torusInstance = new Torus(this.torusWalletOptions);
                log$1.debug("initializing torus evm adapter init");
                _context.next = 6;
                return this.torusInstance.init(_objectSpread$2(_objectSpread$2({
                  showTorusButton: false
                }, this.initParams), {}, {
                  network: network
                }));

              case 6:
                this.status = ADAPTER_STATUS.READY;
                this.emit(ADAPTER_EVENTS.READY, WALLET_ADAPTERS.TORUS_EVM);
                _context.prev = 8;
                log$1.debug("initializing torus evm adapter");

                if (!options.autoConnect) {
                  _context.next = 14;
                  break;
                }

                this.rehydrated = true;
                _context.next = 14;
                return this.connect();

              case 14:
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](8);
                log$1.error("Failed to connect with torus evm provider", _context.t0);
                this.emit(ADAPTER_EVENTS.ERRORED, _context.t0);

              case 20:
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
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var chainId, _this$chainConfig3, _chainId, blockExplorer, displayName, rpcTarget, ticker, tickerName, network, updatedChainID;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _get(_getPrototypeOf(TorusWalletAdapter.prototype), "checkConnectionRequirements", this).call(this);

                if (this.torusInstance) {
                  _context2.next = 3;
                  break;
                }

                throw WalletInitializationError.notReady("Torus wallet is not initialized");

              case 3:
                this.status = ADAPTER_STATUS.CONNECTING;
                this.emit(ADAPTER_EVENTS.CONNECTING, {
                  adapter: WALLET_ADAPTERS.TORUS_EVM
                });
                _context2.prev = 5;
                _context2.next = 8;
                return this.torusInstance.login(this.loginSettings);

              case 8:
                chainId = this.torusInstance.provider.chainId;

                if (!(chainId && parseInt(chainId) !== parseInt(this.chainConfig.chainId, 16))) {
                  _context2.next = 19;
                  break;
                }

                _this$chainConfig3 = this.chainConfig, _chainId = _this$chainConfig3.chainId, blockExplorer = _this$chainConfig3.blockExplorer, displayName = _this$chainConfig3.displayName, rpcTarget = _this$chainConfig3.rpcTarget, ticker = _this$chainConfig3.ticker, tickerName = _this$chainConfig3.tickerName;
                network = {
                  chainId: Number.parseInt(_chainId, 16),
                  host: rpcTarget,
                  blockExplorer: blockExplorer,
                  networkName: displayName,
                  tickerName: tickerName,
                  ticker: ticker
                }; // in some cases when user manually switches chain and relogin then adapter will not connect to initially passed
                // chainConfig but will connect to the one that user switched to.
                // So here trying to switch network to the one that was initially passed in chainConfig.

                _context2.next = 14;
                return this.torusInstance.setProvider(_objectSpread$2({}, network));

              case 14:
                _context2.next = 16;
                return this.torusInstance.ethereum.request({
                  method: "eth_chainId"
                });

              case 16:
                updatedChainID = _context2.sent;

                if (!(updatedChainID && parseInt(updatedChainID) !== parseInt(this.chainConfig.chainId, 16))) {
                  _context2.next = 19;
                  break;
                }

                throw WalletInitializationError.fromCode(5000, "Not connected to correct chainId. Expected: ".concat(this.chainConfig.chainId, ", Current: ").concat(updatedChainID));

              case 19:
                this.status = ADAPTER_STATUS.CONNECTED;
                this.torusInstance.showTorusButton();
                this.emit(ADAPTER_STATUS.CONNECTED, {
                  adapter: WALLET_ADAPTERS.TORUS_EVM,
                  reconnected: this.rehydrated
                });
                return _context2.abrupt("return", this.provider);

              case 25:
                _context2.prev = 25;
                _context2.t0 = _context2["catch"](5);
                // ready again to be connected
                this.status = ADAPTER_STATUS.READY;
                this.rehydrated = false;
                this.emit(ADAPTER_STATUS.ERRORED, _context2.t0);
                throw _context2.t0 instanceof Web3AuthError ? _context2.t0 : WalletLoginError.connectionError("Failed to login with torus wallet");

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 25]]);
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
        var options,
            _args3 = arguments;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {
                  cleanup: false
                };

                if (this.torusInstance) {
                  _context3.next = 3;
                  break;
                }

                throw WalletInitializationError.notReady("Torus wallet is not initialized");

              case 3:
                _context3.next = 5;
                return _get(_getPrototypeOf(TorusWalletAdapter.prototype), "disconnect", this).call(this);

              case 5:
                _context3.next = 7;
                return this.torusInstance.logout();

              case 7:
                this.torusInstance.hideTorusButton();

                if (options.cleanup) {
                  this.status = ADAPTER_STATUS.NOT_READY;
                  this.torusInstance = null;
                } else {
                  // ready to be connected again
                  this.status = ADAPTER_STATUS.READY;
                }

                this.rehydrated = false;
                this.emit(ADAPTER_EVENTS.DISCONNECTED);

              case 11:
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
        var userInfo;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.status !== ADAPTER_STATUS.CONNECTED)) {
                  _context4.next = 2;
                  break;
                }

                throw WalletLoginError.notConnectedError("Not connected with wallet");

              case 2:
                if (this.torusInstance) {
                  _context4.next = 4;
                  break;
                }

                throw WalletInitializationError.notReady("Torus wallet is not initialized");

              case 4:
                _context4.next = 6;
                return this.torusInstance.getUserInfo("");

              case 6:
                userInfo = _context4.sent;
                return _context4.abrupt("return", userInfo);

              case 8:
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
  }]);

  return TorusWalletAdapter;
}(BaseEvmAdapter);

export { TorusWalletAdapter };
