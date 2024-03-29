/*! OpenPGP.js v5.5.0 - 2022-08-31 - this is LGPL licensed code, see LICENSE/our website https://openpgpjs.org/ for more information. */
const e = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {}, t = Symbol("doneWritingPromise"), r = Symbol("doneWritingResolve"), i = Symbol("doneWritingReject"), n = Symbol("readingIndex");
class a extends Array {
  constructor() {
    super(), this[t] = new Promise((e2, t2) => {
      this[r] = e2, this[i] = t2;
    }), this[t].catch(() => {
    });
  }
}
function s(e2) {
  return e2 && e2.getReader && Array.isArray(e2);
}
function o(e2) {
  if (!s(e2)) {
    const t2 = e2.getWriter(), r2 = t2.releaseLock;
    return t2.releaseLock = () => {
      t2.closed.catch(function() {
      }), r2.call(t2);
    }, t2;
  }
  this.stream = e2;
}
a.prototype.getReader = function() {
  return this[n] === void 0 && (this[n] = 0), {read: async () => (await this[t], this[n] === this.length ? {value: void 0, done: true} : {value: this[this[n]++], done: false})};
}, a.prototype.readToEnd = async function(e2) {
  await this[t];
  const r2 = e2(this.slice(this[n]));
  return this.length = 0, r2;
}, a.prototype.clone = function() {
  const e2 = new a();
  return e2[t] = this[t].then(() => {
    e2.push(...this);
  }), e2;
}, o.prototype.write = async function(e2) {
  this.stream.push(e2);
}, o.prototype.close = async function() {
  this.stream[r]();
}, o.prototype.abort = async function(e2) {
  return this.stream[i](e2), e2;
}, o.prototype.releaseLock = function() {
};
const c = typeof e.process == "object" && typeof e.process.versions == "object", u = c && void 0;
function h(t2) {
  return s(t2) ? "array" : e.ReadableStream && e.ReadableStream.prototype.isPrototypeOf(t2) ? "web" : k && k.prototype.isPrototypeOf(t2) ? "ponyfill" : u && u.prototype.isPrototypeOf(t2) ? "node" : !(!t2 || !t2.getReader) && "web-like";
}
function f(e2) {
  return Uint8Array.prototype.isPrototypeOf(e2);
}
function d(e2) {
  if (e2.length === 1)
    return e2[0];
  let t2 = 0;
  for (let r3 = 0; r3 < e2.length; r3++) {
    if (!f(e2[r3]))
      throw Error("concatUint8Array: Data must be in the form of a Uint8Array");
    t2 += e2[r3].length;
  }
  const r2 = new Uint8Array(t2);
  let i2 = 0;
  return e2.forEach(function(e3) {
    r2.set(e3, i2), i2 += e3.length;
  }), r2;
}
const l = c && void 0, p = c && void 0;
let y, b;
if (p) {
  y = function(e3) {
    let t2 = false;
    return new k({start(r2) {
      e3.pause(), e3.on("data", (i2) => {
        t2 || (l.isBuffer(i2) && (i2 = new Uint8Array(i2.buffer, i2.byteOffset, i2.byteLength)), r2.enqueue(i2), e3.pause());
      }), e3.on("end", () => {
        t2 || r2.close();
      }), e3.on("error", (e4) => r2.error(e4));
    }, pull() {
      e3.resume();
    }, cancel(r2) {
      t2 = true, e3.destroy(r2);
    }});
  };
  class e2 extends p {
    constructor(e3, t2) {
      super(t2), this._reader = K(e3);
    }
    async _read(e3) {
      try {
        for (; ; ) {
          const {done: e4, value: t2} = await this._reader.read();
          if (e4) {
            this.push(null);
            break;
          }
          if (!this.push(t2) || this._cancelling) {
            this._reading = false;
            break;
          }
        }
      } catch (e4) {
        this.emit("error", e4);
      }
    }
    _destroy(e3) {
      this._reader.cancel(e3);
    }
  }
  b = function(t2, r2) {
    return new e2(t2, r2);
  };
}
const m = new WeakSet(), g = Symbol("externalBuffer");
function w(e2) {
  if (this.stream = e2, e2[g] && (this[g] = e2[g].slice()), s(e2)) {
    const t3 = e2.getReader();
    return this._read = t3.read.bind(t3), this._releaseLock = () => {
    }, void (this._cancel = () => {
    });
  }
  let t2 = h(e2);
  if (t2 === "node" && (e2 = y(e2)), t2) {
    const t3 = e2.getReader();
    return this._read = t3.read.bind(t3), this._releaseLock = () => {
      t3.closed.catch(function() {
      }), t3.releaseLock();
    }, void (this._cancel = t3.cancel.bind(t3));
  }
  let r2 = false;
  this._read = async () => r2 || m.has(e2) ? {value: void 0, done: true} : (r2 = true, {value: e2, done: false}), this._releaseLock = () => {
    if (r2)
      try {
        m.add(e2);
      } catch (e3) {
      }
  };
}
w.prototype.read = async function() {
  if (this[g] && this[g].length) {
    return {done: false, value: this[g].shift()};
  }
  return this._read();
}, w.prototype.releaseLock = function() {
  this[g] && (this.stream[g] = this[g]), this._releaseLock();
}, w.prototype.cancel = function(e2) {
  return this._cancel(e2);
}, w.prototype.readLine = async function() {
  let e2, t2 = [];
  for (; !e2; ) {
    let {done: r2, value: i2} = await this.read();
    if (i2 += "", r2)
      return t2.length ? C(t2) : void 0;
    const n2 = i2.indexOf("\n") + 1;
    n2 && (e2 = C(t2.concat(i2.substr(0, n2))), t2 = []), n2 !== i2.length && t2.push(i2.substr(n2));
  }
  return this.unshift(...t2), e2;
}, w.prototype.readByte = async function() {
  const {done: e2, value: t2} = await this.read();
  if (e2)
    return;
  const r2 = t2[0];
  return this.unshift(N(t2, 1)), r2;
}, w.prototype.readBytes = async function(e2) {
  const t2 = [];
  let r2 = 0;
  for (; ; ) {
    const {done: i2, value: n2} = await this.read();
    if (i2)
      return t2.length ? C(t2) : void 0;
    if (t2.push(n2), r2 += n2.length, r2 >= e2) {
      const r3 = C(t2);
      return this.unshift(N(r3, e2)), N(r3, 0, e2);
    }
  }
}, w.prototype.peekBytes = async function(e2) {
  const t2 = await this.readBytes(e2);
  return this.unshift(t2), t2;
}, w.prototype.unshift = function(...e2) {
  this[g] || (this[g] = []), e2.length === 1 && f(e2[0]) && this[g].length && e2[0].length && this[g][0].byteOffset >= e2[0].length ? this[g][0] = new Uint8Array(this[g][0].buffer, this[g][0].byteOffset - e2[0].length, this[g][0].byteLength + e2[0].length) : this[g].unshift(...e2.filter((e3) => e3 && e3.length));
}, w.prototype.readToEnd = async function(e2 = C) {
  const t2 = [];
  for (; ; ) {
    const {done: e3, value: r2} = await this.read();
    if (e3)
      break;
    t2.push(r2);
  }
  return e2(t2);
};
let v, _, {ReadableStream: k, WritableStream: A, TransformStream: S} = e;
async function E() {
  if (S)
    return;
  const [t2, r2] = await Promise.all([Promise.resolve().then(function() {
    return md;
  }), Promise.resolve().then(function() {
    return qd;
  })]);
  ({ReadableStream: k, WritableStream: A, TransformStream: S} = t2);
  const {createReadableStreamWrapper: i2} = r2;
  e.ReadableStream && k !== e.ReadableStream && (v = i2(k), _ = i2(e.ReadableStream));
}
const P = c && void 0;
function x(e2) {
  let t2 = h(e2);
  return t2 === "node" ? y(e2) : t2 === "web" && v ? v(e2) : t2 ? e2 : new k({start(t3) {
    t3.enqueue(e2), t3.close();
  }});
}
function M(e2) {
  if (h(e2))
    return e2;
  const t2 = new a();
  return (async () => {
    const r2 = D(t2);
    await r2.write(e2), await r2.close();
  })(), t2;
}
function C(e2) {
  return e2.some((e3) => h(e3) && !s(e3)) ? function(e3) {
    e3 = e3.map(x);
    const t2 = I(async function(e4) {
      await Promise.all(i2.map((t3) => L(t3, e4)));
    });
    let r2 = Promise.resolve();
    const i2 = e3.map((i3, n2) => T(i3, (i4, a2) => (r2 = r2.then(() => R(i4, t2.writable, {preventClose: n2 !== e3.length - 1})), r2)));
    return t2.readable;
  }(e2) : e2.some((e3) => s(e3)) ? function(e3) {
    const t2 = new a();
    let r2 = Promise.resolve();
    return e3.forEach((i2, n2) => (r2 = r2.then(() => R(i2, t2, {preventClose: n2 !== e3.length - 1})), r2)), t2;
  }(e2) : typeof e2[0] == "string" ? e2.join("") : P && P.isBuffer(e2[0]) ? P.concat(e2) : d(e2);
}
function K(e2) {
  return new w(e2);
}
function D(e2) {
  return new o(e2);
}
async function R(e2, t2, {preventClose: r2 = false, preventAbort: i2 = false, preventCancel: n2 = false} = {}) {
  if (h(e2) && !s(e2)) {
    e2 = x(e2);
    try {
      if (e2[g]) {
        const r3 = D(t2);
        for (let t3 = 0; t3 < e2[g].length; t3++)
          await r3.ready, await r3.write(e2[g][t3]);
        r3.releaseLock();
      }
      await e2.pipeTo(t2, {preventClose: r2, preventAbort: i2, preventCancel: n2});
    } catch (e3) {
    }
    return;
  }
  const a2 = K(e2 = M(e2)), o2 = D(t2);
  try {
    for (; ; ) {
      await o2.ready;
      const {done: e3, value: t3} = await a2.read();
      if (e3) {
        r2 || await o2.close();
        break;
      }
      await o2.write(t3);
    }
  } catch (e3) {
    i2 || await o2.abort(e3);
  } finally {
    a2.releaseLock(), o2.releaseLock();
  }
}
function U(e2, t2) {
  const r2 = new S(t2);
  return R(e2, r2.writable), r2.readable;
}
function I(e2) {
  let t2, r2, i2 = false;
  return {readable: new k({start(e3) {
    r2 = e3;
  }, pull() {
    t2 ? t2() : i2 = true;
  }, cancel: e2}, {highWaterMark: 0}), writable: new A({write: async function(e3) {
    r2.enqueue(e3), i2 ? i2 = false : (await new Promise((e4) => {
      t2 = e4;
    }), t2 = null);
  }, close: r2.close.bind(r2), abort: r2.error.bind(r2)})};
}
function B(e2, t2 = () => {
}, r2 = () => {
}) {
  if (s(e2)) {
    const i3 = new a();
    return (async () => {
      const n3 = D(i3);
      try {
        const i4 = await j(e2), a2 = t2(i4), s2 = r2();
        let o2;
        o2 = a2 !== void 0 && s2 !== void 0 ? C([a2, s2]) : a2 !== void 0 ? a2 : s2, await n3.write(o2), await n3.close();
      } catch (e3) {
        await n3.abort(e3);
      }
    })(), i3;
  }
  if (h(e2))
    return U(e2, {async transform(e3, r3) {
      try {
        const i3 = await t2(e3);
        i3 !== void 0 && r3.enqueue(i3);
      } catch (e4) {
        r3.error(e4);
      }
    }, async flush(e3) {
      try {
        const t3 = await r2();
        t3 !== void 0 && e3.enqueue(t3);
      } catch (t3) {
        e3.error(t3);
      }
    }});
  const i2 = t2(e2), n2 = r2();
  return i2 !== void 0 && n2 !== void 0 ? C([i2, n2]) : i2 !== void 0 ? i2 : n2;
}
function T(e2, t2) {
  if (h(e2) && !s(e2)) {
    let r3;
    const i2 = new S({start(e3) {
      r3 = e3;
    }}), n2 = R(e2, i2.writable), a2 = I(async function(e3) {
      r3.error(e3), await n2, await new Promise(setTimeout);
    });
    return t2(i2.readable, a2.writable), a2.readable;
  }
  e2 = M(e2);
  const r2 = new a();
  return t2(e2, r2), r2;
}
function z(e2, t2) {
  let r2;
  const i2 = T(e2, (e3, n2) => {
    const a2 = K(e3);
    a2.remainder = () => (a2.releaseLock(), R(e3, n2), i2), r2 = t2(a2);
  });
  return r2;
}
function q(e2) {
  if (s(e2))
    return e2.clone();
  if (h(e2)) {
    const t2 = function(e3) {
      if (s(e3))
        throw Error("ArrayStream cannot be tee()d, use clone() instead");
      if (h(e3)) {
        const t3 = x(e3).tee();
        return t3[0][g] = t3[1][g] = e3[g], t3;
      }
      return [N(e3), N(e3)];
    }(e2);
    return F(e2, t2[0]), t2[1];
  }
  return N(e2);
}
function O(e2) {
  return s(e2) ? q(e2) : h(e2) ? new k({start(t2) {
    const r2 = T(e2, async (e3, r3) => {
      const i2 = K(e3), n2 = D(r3);
      try {
        for (; ; ) {
          await n2.ready;
          const {done: e4, value: r4} = await i2.read();
          if (e4) {
            try {
              t2.close();
            } catch (e5) {
            }
            return void await n2.close();
          }
          try {
            t2.enqueue(r4);
          } catch (e5) {
          }
          await n2.write(r4);
        }
      } catch (e4) {
        t2.error(e4), await n2.abort(e4);
      }
    });
    F(e2, r2);
  }}) : N(e2);
}
function F(e2, t2) {
  Object.entries(Object.getOwnPropertyDescriptors(e2.constructor.prototype)).forEach(([r2, i2]) => {
    r2 !== "constructor" && (i2.value ? i2.value = i2.value.bind(t2) : i2.get = i2.get.bind(t2), Object.defineProperty(e2, r2, i2));
  });
}
function N(e2, t2 = 0, r2 = 1 / 0) {
  if (s(e2))
    throw Error("Not implemented");
  if (h(e2)) {
    if (t2 >= 0 && r2 >= 0) {
      let i2 = 0;
      return U(e2, {transform(e3, n2) {
        i2 < r2 ? (i2 + e3.length >= t2 && n2.enqueue(N(e3, Math.max(t2 - i2, 0), r2 - i2)), i2 += e3.length) : n2.terminate();
      }});
    }
    if (t2 < 0 && (r2 < 0 || r2 === 1 / 0)) {
      let i2 = [];
      return B(e2, (e3) => {
        e3.length >= -t2 ? i2 = [e3] : i2.push(e3);
      }, () => N(C(i2), t2, r2));
    }
    if (t2 === 0 && r2 < 0) {
      let i2;
      return B(e2, (e3) => {
        const n2 = i2 ? C([i2, e3]) : e3;
        if (n2.length >= -r2)
          return i2 = N(n2, r2), N(n2, t2, r2);
        i2 = n2;
      });
    }
    return console.warn(`stream.slice(input, ${t2}, ${r2}) not implemented efficiently.`), W(async () => N(await j(e2), t2, r2));
  }
  return e2[g] && (e2 = C(e2[g].concat([e2]))), !f(e2) || P && P.isBuffer(e2) ? e2.slice(t2, r2) : (r2 === 1 / 0 && (r2 = e2.length), e2.subarray(t2, r2));
}
async function j(e2, t2 = C) {
  return s(e2) ? e2.readToEnd(t2) : h(e2) ? K(e2).readToEnd(t2) : e2;
}
async function L(e2, t2) {
  if (h(e2)) {
    if (e2.cancel)
      return e2.cancel(t2);
    if (e2.destroy)
      return e2.destroy(t2), await new Promise(setTimeout), t2;
  }
}
function W(e2) {
  const t2 = new a();
  return (async () => {
    const r2 = D(t2);
    try {
      await r2.write(await e2()), await r2.close();
    } catch (e3) {
      await r2.abort(e3);
    }
  })(), t2;
}
class H {
  constructor(e2) {
    if (e2 === void 0)
      throw Error("Invalid BigInteger input");
    if (e2 instanceof Uint8Array) {
      const t2 = e2, r2 = Array(t2.length);
      for (let e3 = 0; e3 < t2.length; e3++) {
        const i2 = t2[e3].toString(16);
        r2[e3] = t2[e3] <= 15 ? "0" + i2 : i2;
      }
      this.value = BigInt("0x0" + r2.join(""));
    } else
      this.value = BigInt(e2);
  }
  clone() {
    return new H(this.value);
  }
  iinc() {
    return this.value++, this;
  }
  inc() {
    return this.clone().iinc();
  }
  idec() {
    return this.value--, this;
  }
  dec() {
    return this.clone().idec();
  }
  iadd(e2) {
    return this.value += e2.value, this;
  }
  add(e2) {
    return this.clone().iadd(e2);
  }
  isub(e2) {
    return this.value -= e2.value, this;
  }
  sub(e2) {
    return this.clone().isub(e2);
  }
  imul(e2) {
    return this.value *= e2.value, this;
  }
  mul(e2) {
    return this.clone().imul(e2);
  }
  imod(e2) {
    return this.value %= e2.value, this.isNegative() && this.iadd(e2), this;
  }
  mod(e2) {
    return this.clone().imod(e2);
  }
  modExp(e2, t2) {
    if (t2.isZero())
      throw Error("Modulo cannot be zero");
    if (t2.isOne())
      return new H(0);
    if (e2.isNegative())
      throw Error("Unsopported negative exponent");
    let r2 = e2.value, i2 = this.value;
    i2 %= t2.value;
    let n2 = BigInt(1);
    for (; r2 > BigInt(0); ) {
      const e3 = r2 & BigInt(1);
      r2 >>= BigInt(1);
      const a2 = n2 * i2 % t2.value;
      n2 = e3 ? a2 : n2, i2 = i2 * i2 % t2.value;
    }
    return new H(n2);
  }
  modInv(e2) {
    const {gcd: t2, x: r2} = this._egcd(e2);
    if (!t2.isOne())
      throw Error("Inverse does not exist");
    return r2.add(e2).mod(e2);
  }
  _egcd(e2) {
    let t2 = BigInt(0), r2 = BigInt(1), i2 = BigInt(1), n2 = BigInt(0), a2 = this.value;
    for (e2 = e2.value; e2 !== BigInt(0); ) {
      const s2 = a2 / e2;
      let o2 = t2;
      t2 = i2 - s2 * t2, i2 = o2, o2 = r2, r2 = n2 - s2 * r2, n2 = o2, o2 = e2, e2 = a2 % e2, a2 = o2;
    }
    return {x: new H(i2), y: new H(n2), gcd: new H(a2)};
  }
  gcd(e2) {
    let t2 = this.value;
    for (e2 = e2.value; e2 !== BigInt(0); ) {
      const r2 = e2;
      e2 = t2 % e2, t2 = r2;
    }
    return new H(t2);
  }
  ileftShift(e2) {
    return this.value <<= e2.value, this;
  }
  leftShift(e2) {
    return this.clone().ileftShift(e2);
  }
  irightShift(e2) {
    return this.value >>= e2.value, this;
  }
  rightShift(e2) {
    return this.clone().irightShift(e2);
  }
  equal(e2) {
    return this.value === e2.value;
  }
  lt(e2) {
    return this.value < e2.value;
  }
  lte(e2) {
    return this.value <= e2.value;
  }
  gt(e2) {
    return this.value > e2.value;
  }
  gte(e2) {
    return this.value >= e2.value;
  }
  isZero() {
    return this.value === BigInt(0);
  }
  isOne() {
    return this.value === BigInt(1);
  }
  isNegative() {
    return this.value < BigInt(0);
  }
  isEven() {
    return !(this.value & BigInt(1));
  }
  abs() {
    const e2 = this.clone();
    return this.isNegative() && (e2.value = -e2.value), e2;
  }
  toString() {
    return this.value.toString();
  }
  toNumber() {
    const e2 = Number(this.value);
    if (e2 > Number.MAX_SAFE_INTEGER)
      throw Error("Number can only safely store up to 53 bits");
    return e2;
  }
  getBit(e2) {
    return (this.value >> BigInt(e2) & BigInt(1)) === BigInt(0) ? 0 : 1;
  }
  bitLength() {
    const e2 = new H(0), t2 = new H(1), r2 = new H(-1), i2 = this.isNegative() ? r2 : e2;
    let n2 = 1;
    const a2 = this.clone();
    for (; !a2.irightShift(t2).equal(i2); )
      n2++;
    return n2;
  }
  byteLength() {
    const e2 = new H(0), t2 = new H(-1), r2 = this.isNegative() ? t2 : e2, i2 = new H(8);
    let n2 = 1;
    const a2 = this.clone();
    for (; !a2.irightShift(i2).equal(r2); )
      n2++;
    return n2;
  }
  toUint8Array(e2 = "be", t2) {
    let r2 = this.value.toString(16);
    r2.length % 2 == 1 && (r2 = "0" + r2);
    const i2 = r2.length / 2, n2 = new Uint8Array(t2 || i2), a2 = t2 ? t2 - i2 : 0;
    let s2 = 0;
    for (; s2 < i2; )
      n2[s2 + a2] = parseInt(r2.slice(2 * s2, 2 * s2 + 2), 16), s2++;
    return e2 !== "be" && n2.reverse(), n2;
  }
}
const G = (() => {
  try {
    return "production" === "development";
  } catch (e2) {
  }
  return false;
})(), V = {isString: function(e2) {
  return typeof e2 == "string" || String.prototype.isPrototypeOf(e2);
}, isArray: function(e2) {
  return Array.prototype.isPrototypeOf(e2);
}, isUint8Array: f, isStream: h, readNumber: function(e2) {
  let t2 = 0;
  for (let r2 = 0; r2 < e2.length; r2++)
    t2 += 256 ** r2 * e2[e2.length - 1 - r2];
  return t2;
}, writeNumber: function(e2, t2) {
  const r2 = new Uint8Array(t2);
  for (let i2 = 0; i2 < t2; i2++)
    r2[i2] = e2 >> 8 * (t2 - i2 - 1) & 255;
  return r2;
}, readDate: function(e2) {
  const t2 = V.readNumber(e2);
  return new Date(1e3 * t2);
}, writeDate: function(e2) {
  const t2 = Math.floor(e2.getTime() / 1e3);
  return V.writeNumber(t2, 4);
}, normalizeDate: function(e2 = Date.now()) {
  return e2 === null || e2 === 1 / 0 ? e2 : new Date(1e3 * Math.floor(+e2 / 1e3));
}, readMPI: function(e2) {
  const t2 = (e2[0] << 8 | e2[1]) + 7 >>> 3;
  return e2.subarray(2, 2 + t2);
}, leftPad(e2, t2) {
  const r2 = new Uint8Array(t2), i2 = t2 - e2.length;
  return r2.set(e2, i2), r2;
}, uint8ArrayToMPI: function(e2) {
  const t2 = V.uint8ArrayBitLength(e2);
  if (t2 === 0)
    throw Error("Zero MPI");
  const r2 = e2.subarray(e2.length - Math.ceil(t2 / 8)), i2 = new Uint8Array([(65280 & t2) >> 8, 255 & t2]);
  return V.concatUint8Array([i2, r2]);
}, uint8ArrayBitLength: function(e2) {
  let t2;
  for (t2 = 0; t2 < e2.length && e2[t2] === 0; t2++)
    ;
  if (t2 === e2.length)
    return 0;
  const r2 = e2.subarray(t2);
  return 8 * (r2.length - 1) + V.nbits(r2[0]);
}, hexToUint8Array: function(e2) {
  const t2 = new Uint8Array(e2.length >> 1);
  for (let r2 = 0; r2 < e2.length >> 1; r2++)
    t2[r2] = parseInt(e2.substr(r2 << 1, 2), 16);
  return t2;
}, uint8ArrayToHex: function(e2) {
  const t2 = [], r2 = e2.length;
  let i2, n2 = 0;
  for (; n2 < r2; ) {
    for (i2 = e2[n2++].toString(16); i2.length < 2; )
      i2 = "0" + i2;
    t2.push("" + i2);
  }
  return t2.join("");
}, stringToUint8Array: function(e2) {
  return B(e2, (e3) => {
    if (!V.isString(e3))
      throw Error("stringToUint8Array: Data must be in the form of a string");
    const t2 = new Uint8Array(e3.length);
    for (let r2 = 0; r2 < e3.length; r2++)
      t2[r2] = e3.charCodeAt(r2);
    return t2;
  });
}, uint8ArrayToString: function(e2) {
  const t2 = [], r2 = 16384, i2 = (e2 = new Uint8Array(e2)).length;
  for (let n2 = 0; n2 < i2; n2 += r2)
    t2.push(String.fromCharCode.apply(String, e2.subarray(n2, n2 + r2 < i2 ? n2 + r2 : i2)));
  return t2.join("");
}, encodeUTF8: function(e2) {
  const t2 = new TextEncoder("utf-8");
  function r2(e3, r3 = false) {
    return t2.encode(e3, {stream: !r3});
  }
  return B(e2, r2, () => r2("", true));
}, decodeUTF8: function(e2) {
  const t2 = new TextDecoder("utf-8");
  function r2(e3, r3 = false) {
    return t2.decode(e3, {stream: !r3});
  }
  return B(e2, r2, () => r2(new Uint8Array(), true));
}, concat: C, concatUint8Array: d, equalsUint8Array: function(e2, t2) {
  if (!V.isUint8Array(e2) || !V.isUint8Array(t2))
    throw Error("Data must be in the form of a Uint8Array");
  if (e2.length !== t2.length)
    return false;
  for (let r2 = 0; r2 < e2.length; r2++)
    if (e2[r2] !== t2[r2])
      return false;
  return true;
}, writeChecksum: function(e2) {
  let t2 = 0;
  for (let r2 = 0; r2 < e2.length; r2++)
    t2 = t2 + e2[r2] & 65535;
  return V.writeNumber(t2, 2);
}, printDebug: function(e2) {
  G && console.log("[OpenPGP.js debug]", e2);
}, printDebugError: function(e2) {
  G && console.error("[OpenPGP.js debug]", e2);
}, nbits: function(e2) {
  let t2 = 1, r2 = e2 >>> 16;
  return r2 !== 0 && (e2 = r2, t2 += 16), r2 = e2 >> 8, r2 !== 0 && (e2 = r2, t2 += 8), r2 = e2 >> 4, r2 !== 0 && (e2 = r2, t2 += 4), r2 = e2 >> 2, r2 !== 0 && (e2 = r2, t2 += 2), r2 = e2 >> 1, r2 !== 0 && (e2 = r2, t2 += 1), t2;
}, double: function(e2) {
  const t2 = new Uint8Array(e2.length), r2 = e2.length - 1;
  for (let i2 = 0; i2 < r2; i2++)
    t2[i2] = e2[i2] << 1 ^ e2[i2 + 1] >> 7;
  return t2[r2] = e2[r2] << 1 ^ 135 * (e2[0] >> 7), t2;
}, shiftRight: function(e2, t2) {
  if (t2)
    for (let r2 = e2.length - 1; r2 >= 0; r2--)
      e2[r2] >>= t2, r2 > 0 && (e2[r2] |= e2[r2 - 1] << 8 - t2);
  return e2;
}, getWebCrypto: function() {
  return e !== void 0 && e.crypto && e.crypto.subtle;
}, detectBigInt: () => typeof BigInt != "undefined", getBigInteger: async function() {
  if (V.detectBigInt())
    return H;
  {
    const {default: e2} = await Promise.resolve().then(function() {
      return Ld;
    });
    return e2;
  }
}, getNodeCrypto: function() {
}, getNodeZlib: function() {
}, getNodeBuffer: function() {
  return {}.Buffer;
}, getHardwareConcurrency: function() {
  if (typeof navigator != "undefined")
    return navigator.hardwareConcurrency || 1;
  return (void 0).cpus().length;
}, isEmailAddress: function(e2) {
  if (!V.isString(e2))
    return false;
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+([a-zA-Z]{2,}|xn--[a-zA-Z\-0-9]+)))$/.test(e2);
}, canonicalizeEOL: function(e2) {
  let t2 = false;
  return B(e2, (e3) => {
    let r2;
    t2 && (e3 = V.concatUint8Array([new Uint8Array([13]), e3])), e3[e3.length - 1] === 13 ? (t2 = true, e3 = e3.subarray(0, -1)) : t2 = false;
    const i2 = [];
    for (let t3 = 0; r2 = e3.indexOf(10, t3) + 1, r2; t3 = r2)
      e3[r2 - 2] !== 13 && i2.push(r2);
    if (!i2.length)
      return e3;
    const n2 = new Uint8Array(e3.length + i2.length);
    let a2 = 0;
    for (let t3 = 0; t3 < i2.length; t3++) {
      const r3 = e3.subarray(i2[t3 - 1] || 0, i2[t3]);
      n2.set(r3, a2), a2 += r3.length, n2[a2 - 1] = 13, n2[a2] = 10, a2++;
    }
    return n2.set(e3.subarray(i2[i2.length - 1] || 0), a2), n2;
  }, () => t2 ? new Uint8Array([13]) : void 0);
}, nativeEOL: function(e2) {
  let t2 = false;
  return B(e2, (e3) => {
    let r2;
    (e3 = t2 && e3[0] !== 10 ? V.concatUint8Array([new Uint8Array([13]), e3]) : new Uint8Array(e3))[e3.length - 1] === 13 ? (t2 = true, e3 = e3.subarray(0, -1)) : t2 = false;
    let i2 = 0;
    for (let t3 = 0; t3 !== e3.length; t3 = r2) {
      r2 = e3.indexOf(13, t3) + 1, r2 || (r2 = e3.length);
      const n2 = r2 - (e3[r2] === 10 ? 1 : 0);
      t3 && e3.copyWithin(i2, t3, n2), i2 += n2 - t3;
    }
    return e3.subarray(0, i2);
  }, () => t2 ? new Uint8Array([13]) : void 0);
}, removeTrailingSpaces: function(e2) {
  return e2.split("\n").map((e3) => {
    let t2 = e3.length - 1;
    for (; t2 >= 0 && (e3[t2] === " " || e3[t2] === "	" || e3[t2] === "\r"); t2--)
      ;
    return e3.substr(0, t2 + 1);
  }).join("\n");
}, wrapError: function(e2, t2) {
  if (!t2)
    return Error(e2);
  try {
    t2.message = e2 + ": " + t2.message;
  } catch (e3) {
  }
  return t2;
}, constructAllowedPackets: function(e2) {
  const t2 = {};
  return e2.forEach((e3) => {
    if (!e3.tag)
      throw Error("Invalid input: expected a packet class");
    t2[e3.tag] = e3;
  }), t2;
}, anyPromise: function(e2) {
  return new Promise(async (t2, r2) => {
    let i2;
    await Promise.all(e2.map(async (e3) => {
      try {
        t2(await e3);
      } catch (e4) {
        i2 = e4;
      }
    })), r2(i2);
  });
}, selectUint8Array: function(e2, t2, r2) {
  const i2 = Math.max(t2.length, r2.length), n2 = new Uint8Array(i2);
  let a2 = 0;
  for (let i3 = 0; i3 < n2.length; i3++)
    n2[i3] = t2[i3] & 256 - e2 | r2[i3] & 255 + e2, a2 += e2 & i3 < t2.length | 1 - e2 & i3 < r2.length;
  return n2.subarray(0, a2);
}, selectUint8: function(e2, t2, r2) {
  return t2 & 256 - e2 | r2 & 255 + e2;
}}, $ = V.getNodeBuffer();
let Z, Y;
function X(e2) {
  let t2 = new Uint8Array();
  return B(e2, (e3) => {
    t2 = V.concatUint8Array([t2, e3]);
    const r2 = [], i2 = Math.floor(t2.length / 45), n2 = 45 * i2, a2 = Z(t2.subarray(0, n2));
    for (let e4 = 0; e4 < i2; e4++)
      r2.push(a2.substr(60 * e4, 60)), r2.push("\n");
    return t2 = t2.subarray(n2), r2.join("");
  }, () => t2.length ? Z(t2) + "\n" : "");
}
function Q(e2) {
  let t2 = "";
  return B(e2, (e3) => {
    t2 += e3;
    let r2 = 0;
    const i2 = [" ", "	", "\r", "\n"];
    for (let e4 = 0; e4 < i2.length; e4++) {
      const n3 = i2[e4];
      for (let e5 = t2.indexOf(n3); e5 !== -1; e5 = t2.indexOf(n3, e5 + 1))
        r2++;
    }
    let n2 = t2.length;
    for (; n2 > 0 && (n2 - r2) % 4 != 0; n2--)
      i2.includes(t2[n2]) && r2--;
    const a2 = Y(t2.substr(0, n2));
    return t2 = t2.substr(n2), a2;
  }, () => Y(t2));
}
function J(e2) {
  return Q(e2.replace(/-/g, "+").replace(/_/g, "/"));
}
function ee(e2, t2) {
  let r2 = X(e2).replace(/[\r\n]/g, "");
  return t2 && (r2 = r2.replace(/[+]/g, "-").replace(/[/]/g, "_").replace(/[=]/g, "")), r2;
}
$ ? (Z = (e2) => $.from(e2).toString("base64"), Y = (e2) => {
  const t2 = $.from(e2, "base64");
  return new Uint8Array(t2.buffer, t2.byteOffset, t2.byteLength);
}) : (Z = (e2) => btoa(V.uint8ArrayToString(e2)), Y = (e2) => V.stringToUint8Array(atob(e2)));
const te = Symbol("byValue");
var re = {curve: {p256: "p256", "P-256": "p256", secp256r1: "p256", prime256v1: "p256", "1.2.840.10045.3.1.7": "p256", "2a8648ce3d030107": "p256", "2A8648CE3D030107": "p256", p384: "p384", "P-384": "p384", secp384r1: "p384", "1.3.132.0.34": "p384", "2b81040022": "p384", "2B81040022": "p384", p521: "p521", "P-521": "p521", secp521r1: "p521", "1.3.132.0.35": "p521", "2b81040023": "p521", "2B81040023": "p521", secp256k1: "secp256k1", "1.3.132.0.10": "secp256k1", "2b8104000a": "secp256k1", "2B8104000A": "secp256k1", ED25519: "ed25519", ed25519: "ed25519", Ed25519: "ed25519", "1.3.6.1.4.1.11591.15.1": "ed25519", "2b06010401da470f01": "ed25519", "2B06010401DA470F01": "ed25519", X25519: "curve25519", cv25519: "curve25519", curve25519: "curve25519", Curve25519: "curve25519", "1.3.6.1.4.1.3029.1.5.1": "curve25519", "2b060104019755010501": "curve25519", "2B060104019755010501": "curve25519", brainpoolP256r1: "brainpoolP256r1", "1.3.36.3.3.2.8.1.1.7": "brainpoolP256r1", "2b2403030208010107": "brainpoolP256r1", "2B2403030208010107": "brainpoolP256r1", brainpoolP384r1: "brainpoolP384r1", "1.3.36.3.3.2.8.1.1.11": "brainpoolP384r1", "2b240303020801010b": "brainpoolP384r1", "2B240303020801010B": "brainpoolP384r1", brainpoolP512r1: "brainpoolP512r1", "1.3.36.3.3.2.8.1.1.13": "brainpoolP512r1", "2b240303020801010d": "brainpoolP512r1", "2B240303020801010D": "brainpoolP512r1"}, s2k: {simple: 0, salted: 1, iterated: 3, gnu: 101}, publicKey: {rsaEncryptSign: 1, rsaEncrypt: 2, rsaSign: 3, elgamal: 16, dsa: 17, ecdh: 18, ecdsa: 19, eddsa: 22, aedh: 23, aedsa: 24}, symmetric: {plaintext: 0, idea: 1, tripledes: 2, cast5: 3, blowfish: 4, aes128: 7, aes192: 8, aes256: 9, twofish: 10}, compression: {uncompressed: 0, zip: 1, zlib: 2, bzip2: 3}, hash: {md5: 1, sha1: 2, ripemd: 3, sha256: 8, sha384: 9, sha512: 10, sha224: 11}, webHash: {"SHA-1": 2, "SHA-256": 8, "SHA-384": 9, "SHA-512": 10}, aead: {eax: 1, ocb: 2, experimentalGCM: 100}, packet: {publicKeyEncryptedSessionKey: 1, signature: 2, symEncryptedSessionKey: 3, onePassSignature: 4, secretKey: 5, publicKey: 6, secretSubkey: 7, compressedData: 8, symmetricallyEncryptedData: 9, marker: 10, literalData: 11, trust: 12, userID: 13, publicSubkey: 14, userAttribute: 17, symEncryptedIntegrityProtectedData: 18, modificationDetectionCode: 19, aeadEncryptedData: 20}, literal: {binary: 98, text: 116, utf8: 117, mime: 109}, signature: {binary: 0, text: 1, standalone: 2, certGeneric: 16, certPersona: 17, certCasual: 18, certPositive: 19, certRevocation: 48, subkeyBinding: 24, keyBinding: 25, key: 31, keyRevocation: 32, subkeyRevocation: 40, timestamp: 64, thirdParty: 80}, signatureSubpacket: {signatureCreationTime: 2, signatureExpirationTime: 3, exportableCertification: 4, trustSignature: 5, regularExpression: 6, revocable: 7, keyExpirationTime: 9, placeholderBackwardsCompatibility: 10, preferredSymmetricAlgorithms: 11, revocationKey: 12, issuer: 16, notationData: 20, preferredHashAlgorithms: 21, preferredCompressionAlgorithms: 22, keyServerPreferences: 23, preferredKeyServer: 24, primaryUserID: 25, policyURI: 26, keyFlags: 27, signersUserID: 28, reasonForRevocation: 29, features: 30, signatureTarget: 31, embeddedSignature: 32, issuerFingerprint: 33, preferredAEADAlgorithms: 34}, keyFlags: {certifyKeys: 1, signData: 2, encryptCommunication: 4, encryptStorage: 8, splitPrivateKey: 16, authentication: 32, sharedPrivateKey: 128}, armor: {multipartSection: 0, multipartLast: 1, signed: 2, message: 3, publicKey: 4, privateKey: 5, signature: 6}, reasonForRevocation: {noReason: 0, keySuperseded: 1, keyCompromised: 2, keyRetired: 3, userIDInvalid: 32}, features: {modificationDetection: 1, aead: 2, v5Keys: 4}, write: function(e2, t2) {
  if (typeof t2 == "number" && (t2 = this.read(e2, t2)), e2[t2] !== void 0)
    return e2[t2];
  throw Error("Invalid enum value.");
}, read: function(e2, t2) {
  if (e2[te] || (e2[te] = [], Object.entries(e2).forEach(([t3, r2]) => {
    e2[te][r2] = t3;
  })), e2[te][t2] !== void 0)
    return e2[te][t2];
  throw Error("Invalid enum value.");
}}, ie = {preferredHashAlgorithm: re.hash.sha256, preferredSymmetricAlgorithm: re.symmetric.aes256, preferredCompressionAlgorithm: re.compression.uncompressed, deflateLevel: 6, aeadProtect: false, preferredAEADAlgorithm: re.aead.eax, aeadChunkSizeByte: 12, v5Keys: false, s2kIterationCountByte: 224, allowUnauthenticatedMessages: false, allowUnauthenticatedStream: false, checksumRequired: false, minRSABits: 2047, passwordCollisionCheck: false, revocationsExpire: false, allowInsecureDecryptionWithSigningKeys: false, allowInsecureVerificationWithReformattedKeys: false, constantTimePKCS1Decryption: false, constantTimePKCS1DecryptionSupportedSymmetricAlgorithms: new Set([re.symmetric.aes128, re.symmetric.aes192, re.symmetric.aes256]), minBytesForWebCrypto: 1e3, ignoreUnsupportedPackets: true, ignoreMalformedPackets: false, showVersion: false, showComment: false, versionString: "OpenPGP.js 5.5.0", commentString: "https://openpgpjs.org", maxUserIDLength: 5120, knownNotations: ["preferred-email-encoding@pgp.com", "pka-address@gnupg.org"], useIndutnyElliptic: true, rejectHashAlgorithms: new Set([re.hash.md5, re.hash.ripemd]), rejectMessageHashAlgorithms: new Set([re.hash.md5, re.hash.ripemd, re.hash.sha1]), rejectPublicKeyAlgorithms: new Set([re.publicKey.elgamal, re.publicKey.dsa]), rejectCurves: new Set([re.curve.brainpoolP256r1, re.curve.brainpoolP384r1, re.curve.brainpoolP512r1, re.curve.secp256k1])};
function ne(e2) {
  const t2 = e2.match(/^-----BEGIN PGP (MESSAGE, PART \d+\/\d+|MESSAGE, PART \d+|SIGNED MESSAGE|MESSAGE|PUBLIC KEY BLOCK|PRIVATE KEY BLOCK|SIGNATURE)-----$/m);
  if (!t2)
    throw Error("Unknown ASCII armor type");
  return /MESSAGE, PART \d+\/\d+/.test(t2[1]) ? re.armor.multipartSection : /MESSAGE, PART \d+/.test(t2[1]) ? re.armor.multipartLast : /SIGNED MESSAGE/.test(t2[1]) ? re.armor.signed : /MESSAGE/.test(t2[1]) ? re.armor.message : /PUBLIC KEY BLOCK/.test(t2[1]) ? re.armor.publicKey : /PRIVATE KEY BLOCK/.test(t2[1]) ? re.armor.privateKey : /SIGNATURE/.test(t2[1]) ? re.armor.signature : void 0;
}
function ae(e2, t2) {
  let r2 = "";
  return t2.showVersion && (r2 += "Version: " + t2.versionString + "\n"), t2.showComment && (r2 += "Comment: " + t2.commentString + "\n"), e2 && (r2 += "Comment: " + e2 + "\n"), r2 += "\n", r2;
}
function se(e2) {
  return X(function(e3) {
    let t2 = 13501623;
    return B(e3, (e4) => {
      const r2 = ce ? Math.floor(e4.length / 4) : 0, i2 = new Uint32Array(e4.buffer, e4.byteOffset, r2);
      for (let e5 = 0; e5 < r2; e5++)
        t2 ^= i2[e5], t2 = oe[0][t2 >> 24 & 255] ^ oe[1][t2 >> 16 & 255] ^ oe[2][t2 >> 8 & 255] ^ oe[3][t2 >> 0 & 255];
      for (let i3 = 4 * r2; i3 < e4.length; i3++)
        t2 = t2 >> 8 ^ oe[0][255 & t2 ^ e4[i3]];
    }, () => new Uint8Array([t2, t2 >> 8, t2 >> 16]));
  }(e2));
}
const oe = [Array(255), Array(255), Array(255), Array(255)];
for (let e2 = 0; e2 <= 255; e2++) {
  let t2 = e2 << 16;
  for (let e3 = 0; e3 < 8; e3++)
    t2 = t2 << 1 ^ ((8388608 & t2) != 0 ? 8801531 : 0);
  oe[0][e2] = (16711680 & t2) >> 16 | 65280 & t2 | (255 & t2) << 16;
}
for (let e2 = 0; e2 <= 255; e2++)
  oe[1][e2] = oe[0][e2] >> 8 ^ oe[0][255 & oe[0][e2]];
for (let e2 = 0; e2 <= 255; e2++)
  oe[2][e2] = oe[1][e2] >> 8 ^ oe[0][255 & oe[1][e2]];
for (let e2 = 0; e2 <= 255; e2++)
  oe[3][e2] = oe[2][e2] >> 8 ^ oe[0][255 & oe[2][e2]];
const ce = function() {
  const e2 = new ArrayBuffer(2);
  return new DataView(e2).setInt16(0, 255, true), new Int16Array(e2)[0] === 255;
}();
function ue(e2) {
  for (let t2 = 0; t2 < e2.length; t2++)
    /^([^\s:]|[^\s:][^:]*[^\s:]): .+$/.test(e2[t2]) || V.printDebugError(Error("Improperly formatted armor header: " + e2[t2])), /^(Version|Comment|MessageID|Hash|Charset): .+$/.test(e2[t2]) || V.printDebugError(Error("Unknown header: " + e2[t2]));
}
function he(e2) {
  let t2 = e2, r2 = "";
  const i2 = e2.lastIndexOf("=");
  return i2 >= 0 && i2 !== e2.length - 1 && (t2 = e2.slice(0, i2), r2 = e2.slice(i2 + 1).substr(0, 4)), {body: t2, checksum: r2};
}
function fe(e2, t2 = ie) {
  return new Promise(async (r2, i2) => {
    try {
      const n2 = /^-----[^-]+-----$/m, a2 = /^[ \f\r\t\u00a0\u2000-\u200a\u202f\u205f\u3000]*$/;
      let s2;
      const o2 = [];
      let c2, u2, h2, f2 = o2, d2 = [], l2 = Q(T(e2, async (e3, t3) => {
        const p2 = K(e3);
        try {
          for (; ; ) {
            let e4 = await p2.readLine();
            if (e4 === void 0)
              throw Error("Misformed armored text");
            if (e4 = V.removeTrailingSpaces(e4.replace(/[\r\n]/g, "")), s2)
              if (c2)
                u2 || s2 !== 2 || (n2.test(e4) ? (d2 = d2.join("\r\n"), u2 = true, ue(f2), f2 = [], c2 = false) : d2.push(e4.replace(/^- /, "")));
              else if (n2.test(e4) && i2(Error("Mandatory blank line missing between armor headers and armor data")), a2.test(e4)) {
                if (ue(f2), c2 = true, u2 || s2 !== 2) {
                  r2({text: d2, data: l2, headers: o2, type: s2});
                  break;
                }
              } else
                f2.push(e4);
            else
              n2.test(e4) && (s2 = ne(e4));
          }
        } catch (e4) {
          return void i2(e4);
        }
        const y2 = D(t3);
        try {
          for (; ; ) {
            await y2.ready;
            const {done: e4, value: t4} = await p2.read();
            if (e4)
              throw Error("Misformed armored text");
            const r3 = t4 + "";
            if (r3.indexOf("=") !== -1 || r3.indexOf("-") !== -1) {
              let e5 = await p2.readToEnd();
              e5.length || (e5 = ""), e5 = r3 + e5, e5 = V.removeTrailingSpaces(e5.replace(/\r/g, ""));
              const t5 = e5.split(n2);
              if (t5.length === 1)
                throw Error("Misformed armored text");
              const i3 = he(t5[0].slice(0, -1));
              h2 = i3.checksum, await y2.write(i3.body);
              break;
            }
            await y2.write(r3);
          }
          await y2.ready, await y2.close();
        } catch (e4) {
          await y2.abort(e4);
        }
      }));
      l2 = T(l2, async (e3, r3) => {
        const i3 = j(se(O(e3)));
        i3.catch(() => {
        }), await R(e3, r3, {preventClose: true});
        const n3 = D(r3);
        try {
          const e4 = (await i3).replace("\n", "");
          if (h2 !== e4 && (h2 || t2.checksumRequired))
            throw Error("Ascii armor integrity check failed");
          await n3.ready, await n3.close();
        } catch (e4) {
          await n3.abort(e4);
        }
      });
    } catch (e3) {
      i2(e3);
    }
  }).then(async (e3) => (s(e3.data) && (e3.data = await j(e3.data)), e3));
}
function de(e2, t2, r2, i2, n2, a2 = ie) {
  let s2, o2;
  e2 === re.armor.signed && (s2 = t2.text, o2 = t2.hash, t2 = t2.data);
  const c2 = O(t2), u2 = [];
  switch (e2) {
    case re.armor.multipartSection:
      u2.push("-----BEGIN PGP MESSAGE, PART " + r2 + "/" + i2 + "-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP MESSAGE, PART " + r2 + "/" + i2 + "-----\n");
      break;
    case re.armor.multipartLast:
      u2.push("-----BEGIN PGP MESSAGE, PART " + r2 + "-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP MESSAGE, PART " + r2 + "-----\n");
      break;
    case re.armor.signed:
      u2.push("-----BEGIN PGP SIGNED MESSAGE-----\n"), u2.push("Hash: " + o2 + "\n\n"), u2.push(s2.replace(/^-/gm, "- -")), u2.push("\n-----BEGIN PGP SIGNATURE-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP SIGNATURE-----\n");
      break;
    case re.armor.message:
      u2.push("-----BEGIN PGP MESSAGE-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP MESSAGE-----\n");
      break;
    case re.armor.publicKey:
      u2.push("-----BEGIN PGP PUBLIC KEY BLOCK-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP PUBLIC KEY BLOCK-----\n");
      break;
    case re.armor.privateKey:
      u2.push("-----BEGIN PGP PRIVATE KEY BLOCK-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP PRIVATE KEY BLOCK-----\n");
      break;
    case re.armor.signature:
      u2.push("-----BEGIN PGP SIGNATURE-----\n"), u2.push(ae(n2, a2)), u2.push(X(t2)), u2.push("=", se(c2)), u2.push("-----END PGP SIGNATURE-----\n");
  }
  return V.concat(u2);
}
class le {
  constructor() {
    this.bytes = "";
  }
  read(e2) {
    this.bytes = V.uint8ArrayToString(e2.subarray(0, 8));
  }
  write() {
    return V.stringToUint8Array(this.bytes);
  }
  toHex() {
    return V.uint8ArrayToHex(V.stringToUint8Array(this.bytes));
  }
  equals(e2, t2 = false) {
    return t2 && (e2.isWildcard() || this.isWildcard()) || this.bytes === e2.bytes;
  }
  isNull() {
    return this.bytes === "";
  }
  isWildcard() {
    return /^0+$/.test(this.toHex());
  }
  static mapToHex(e2) {
    return e2.toHex();
  }
  static fromID(e2) {
    const t2 = new le();
    return t2.read(V.hexToUint8Array(e2)), t2;
  }
  static wildcard() {
    const e2 = new le();
    return e2.read(new Uint8Array(8)), e2;
  }
}
var pe = function() {
  var e2, t2, r2 = false;
  function i2(r3, i3) {
    var n3 = e2[(t2[r3] + t2[i3]) % 255];
    return r3 !== 0 && i3 !== 0 || (n3 = 0), n3;
  }
  var n2, a2, s2, o2, c2 = false;
  function u2() {
    function u3(r3) {
      var i3, n3, a3;
      for (n3 = a3 = function(r4) {
        var i4 = e2[255 - t2[r4]];
        return r4 === 0 && (i4 = 0), i4;
      }(r3), i3 = 0; i3 < 4; i3++)
        a3 ^= n3 = 255 & (n3 << 1 | n3 >>> 7);
      return a3 ^= 99;
    }
    r2 || function() {
      e2 = [], t2 = [];
      var i3, n3, a3 = 1;
      for (i3 = 0; i3 < 255; i3++)
        e2[i3] = a3, n3 = 128 & a3, a3 <<= 1, a3 &= 255, n3 === 128 && (a3 ^= 27), a3 ^= e2[i3], t2[e2[i3]] = i3;
      e2[255] = e2[0], t2[0] = 0, r2 = true;
    }(), n2 = [], a2 = [], s2 = [[], [], [], []], o2 = [[], [], [], []];
    for (var h3 = 0; h3 < 256; h3++) {
      var f2 = u3(h3);
      n2[h3] = f2, a2[f2] = h3, s2[0][h3] = i2(2, f2) << 24 | f2 << 16 | f2 << 8 | i2(3, f2), o2[0][f2] = i2(14, h3) << 24 | i2(9, h3) << 16 | i2(13, h3) << 8 | i2(11, h3);
      for (var d2 = 1; d2 < 4; d2++)
        s2[d2][h3] = s2[d2 - 1][h3] >>> 8 | s2[d2 - 1][h3] << 24, o2[d2][f2] = o2[d2 - 1][f2] >>> 8 | o2[d2 - 1][f2] << 24;
    }
    c2 = true;
  }
  var h2 = function(e3, t3) {
    c2 || u2();
    var r3 = new Uint32Array(t3);
    r3.set(n2, 512), r3.set(a2, 768);
    for (var i3 = 0; i3 < 4; i3++)
      r3.set(s2[i3], 4096 + 1024 * i3 >> 2), r3.set(o2[i3], 8192 + 1024 * i3 >> 2);
    var h3 = function(e4, t4, r4) {
      var i4 = 0, n3 = 0, a3 = 0, s3 = 0, o3 = 0, c3 = 0, u3 = 0, h4 = 0, f2 = 0, d2 = 0, l2 = 0, p2 = 0, y2 = 0, b2 = 0, m2 = 0, g2 = 0, w2 = 0, v2 = 0, _2 = 0, k2 = 0, A2 = 0;
      var S2 = new e4.Uint32Array(r4), E2 = new e4.Uint8Array(r4);
      function P2(e5, t5, r5, o4, c4, u4, h5, f3) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        o4 = o4 | 0;
        c4 = c4 | 0;
        u4 = u4 | 0;
        h5 = h5 | 0;
        f3 = f3 | 0;
        var d3 = 0, l3 = 0, p3 = 0, y3 = 0, b3 = 0, m3 = 0, g3 = 0, w3 = 0;
        d3 = r5 | 1024, l3 = r5 | 2048, p3 = r5 | 3072;
        c4 = c4 ^ S2[(e5 | 0) >> 2], u4 = u4 ^ S2[(e5 | 4) >> 2], h5 = h5 ^ S2[(e5 | 8) >> 2], f3 = f3 ^ S2[(e5 | 12) >> 2];
        for (w3 = 16; (w3 | 0) <= o4 << 4; w3 = w3 + 16 | 0) {
          y3 = S2[(r5 | c4 >> 22 & 1020) >> 2] ^ S2[(d3 | u4 >> 14 & 1020) >> 2] ^ S2[(l3 | h5 >> 6 & 1020) >> 2] ^ S2[(p3 | f3 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 0) >> 2], b3 = S2[(r5 | u4 >> 22 & 1020) >> 2] ^ S2[(d3 | h5 >> 14 & 1020) >> 2] ^ S2[(l3 | f3 >> 6 & 1020) >> 2] ^ S2[(p3 | c4 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 4) >> 2], m3 = S2[(r5 | h5 >> 22 & 1020) >> 2] ^ S2[(d3 | f3 >> 14 & 1020) >> 2] ^ S2[(l3 | c4 >> 6 & 1020) >> 2] ^ S2[(p3 | u4 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 8) >> 2], g3 = S2[(r5 | f3 >> 22 & 1020) >> 2] ^ S2[(d3 | c4 >> 14 & 1020) >> 2] ^ S2[(l3 | u4 >> 6 & 1020) >> 2] ^ S2[(p3 | h5 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 12) >> 2];
          c4 = y3, u4 = b3, h5 = m3, f3 = g3;
        }
        i4 = S2[(t5 | c4 >> 22 & 1020) >> 2] << 24 ^ S2[(t5 | u4 >> 14 & 1020) >> 2] << 16 ^ S2[(t5 | h5 >> 6 & 1020) >> 2] << 8 ^ S2[(t5 | f3 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 0) >> 2], n3 = S2[(t5 | u4 >> 22 & 1020) >> 2] << 24 ^ S2[(t5 | h5 >> 14 & 1020) >> 2] << 16 ^ S2[(t5 | f3 >> 6 & 1020) >> 2] << 8 ^ S2[(t5 | c4 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 4) >> 2], a3 = S2[(t5 | h5 >> 22 & 1020) >> 2] << 24 ^ S2[(t5 | f3 >> 14 & 1020) >> 2] << 16 ^ S2[(t5 | c4 >> 6 & 1020) >> 2] << 8 ^ S2[(t5 | u4 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 8) >> 2], s3 = S2[(t5 | f3 >> 22 & 1020) >> 2] << 24 ^ S2[(t5 | c4 >> 14 & 1020) >> 2] << 16 ^ S2[(t5 | u4 >> 6 & 1020) >> 2] << 8 ^ S2[(t5 | h5 << 2 & 1020) >> 2] ^ S2[(e5 | w3 | 12) >> 2];
      }
      function x2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        P2(0, 2048, 4096, A2, e5, t5, r5, i5);
      }
      function M2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        var a4 = 0;
        P2(1024, 3072, 8192, A2, e5, i5, r5, t5);
        a4 = n3, n3 = s3, s3 = a4;
      }
      function C2(e5, t5, r5, f3) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        f3 = f3 | 0;
        P2(0, 2048, 4096, A2, o3 ^ e5, c3 ^ t5, u3 ^ r5, h4 ^ f3);
        o3 = i4, c3 = n3, u3 = a3, h4 = s3;
      }
      function K2(e5, t5, r5, f3) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        f3 = f3 | 0;
        var d3 = 0;
        P2(1024, 3072, 8192, A2, e5, f3, r5, t5);
        d3 = n3, n3 = s3, s3 = d3;
        i4 = i4 ^ o3, n3 = n3 ^ c3, a3 = a3 ^ u3, s3 = s3 ^ h4;
        o3 = e5, c3 = t5, u3 = r5, h4 = f3;
      }
      function D2(e5, t5, r5, f3) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        f3 = f3 | 0;
        P2(0, 2048, 4096, A2, o3, c3, u3, h4);
        o3 = i4 = i4 ^ e5, c3 = n3 = n3 ^ t5, u3 = a3 = a3 ^ r5, h4 = s3 = s3 ^ f3;
      }
      function R2(e5, t5, r5, f3) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        f3 = f3 | 0;
        P2(0, 2048, 4096, A2, o3, c3, u3, h4);
        i4 = i4 ^ e5, n3 = n3 ^ t5, a3 = a3 ^ r5, s3 = s3 ^ f3;
        o3 = e5, c3 = t5, u3 = r5, h4 = f3;
      }
      function U2(e5, t5, r5, f3) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        f3 = f3 | 0;
        P2(0, 2048, 4096, A2, o3, c3, u3, h4);
        o3 = i4, c3 = n3, u3 = a3, h4 = s3;
        i4 = i4 ^ e5, n3 = n3 ^ t5, a3 = a3 ^ r5, s3 = s3 ^ f3;
      }
      function I2(e5, t5, r5, o4) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        o4 = o4 | 0;
        P2(0, 2048, 4096, A2, f2, d2, l2, p2);
        p2 = ~g2 & p2 | g2 & p2 + 1;
        l2 = ~m2 & l2 | m2 & l2 + ((p2 | 0) == 0);
        d2 = ~b2 & d2 | b2 & d2 + ((l2 | 0) == 0);
        f2 = ~y2 & f2 | y2 & f2 + ((d2 | 0) == 0);
        i4 = i4 ^ e5;
        n3 = n3 ^ t5;
        a3 = a3 ^ r5;
        s3 = s3 ^ o4;
      }
      function B2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        var n4 = 0, a4 = 0, s4 = 0, f3 = 0, d3 = 0, l3 = 0, p3 = 0, y3 = 0, b3 = 0, m3 = 0;
        e5 = e5 ^ o3, t5 = t5 ^ c3, r5 = r5 ^ u3, i5 = i5 ^ h4;
        n4 = w2 | 0, a4 = v2 | 0, s4 = _2 | 0, f3 = k2 | 0;
        for (; (b3 | 0) < 128; b3 = b3 + 1 | 0) {
          if (n4 >>> 31) {
            d3 = d3 ^ e5, l3 = l3 ^ t5, p3 = p3 ^ r5, y3 = y3 ^ i5;
          }
          n4 = n4 << 1 | a4 >>> 31, a4 = a4 << 1 | s4 >>> 31, s4 = s4 << 1 | f3 >>> 31, f3 = f3 << 1;
          m3 = i5 & 1;
          i5 = i5 >>> 1 | r5 << 31, r5 = r5 >>> 1 | t5 << 31, t5 = t5 >>> 1 | e5 << 31, e5 = e5 >>> 1;
          if (m3)
            e5 = e5 ^ 3774873600;
        }
        o3 = d3, c3 = l3, u3 = p3, h4 = y3;
      }
      function T2(e5) {
        e5 = e5 | 0;
        A2 = e5;
      }
      function z2(e5, t5, r5, o4) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        o4 = o4 | 0;
        i4 = e5, n3 = t5, a3 = r5, s3 = o4;
      }
      function q2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        o3 = e5, c3 = t5, u3 = r5, h4 = i5;
      }
      function O2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        f2 = e5, d2 = t5, l2 = r5, p2 = i5;
      }
      function F2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        y2 = e5, b2 = t5, m2 = r5, g2 = i5;
      }
      function N2(e5, t5, r5, i5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        i5 = i5 | 0;
        p2 = ~g2 & p2 | g2 & i5, l2 = ~m2 & l2 | m2 & r5, d2 = ~b2 & d2 | b2 & t5, f2 = ~y2 & f2 | y2 & e5;
      }
      function j2(e5) {
        e5 = e5 | 0;
        if (e5 & 15)
          return -1;
        E2[e5 | 0] = i4 >>> 24, E2[e5 | 1] = i4 >>> 16 & 255, E2[e5 | 2] = i4 >>> 8 & 255, E2[e5 | 3] = i4 & 255, E2[e5 | 4] = n3 >>> 24, E2[e5 | 5] = n3 >>> 16 & 255, E2[e5 | 6] = n3 >>> 8 & 255, E2[e5 | 7] = n3 & 255, E2[e5 | 8] = a3 >>> 24, E2[e5 | 9] = a3 >>> 16 & 255, E2[e5 | 10] = a3 >>> 8 & 255, E2[e5 | 11] = a3 & 255, E2[e5 | 12] = s3 >>> 24, E2[e5 | 13] = s3 >>> 16 & 255, E2[e5 | 14] = s3 >>> 8 & 255, E2[e5 | 15] = s3 & 255;
        return 16;
      }
      function L2(e5) {
        e5 = e5 | 0;
        if (e5 & 15)
          return -1;
        E2[e5 | 0] = o3 >>> 24, E2[e5 | 1] = o3 >>> 16 & 255, E2[e5 | 2] = o3 >>> 8 & 255, E2[e5 | 3] = o3 & 255, E2[e5 | 4] = c3 >>> 24, E2[e5 | 5] = c3 >>> 16 & 255, E2[e5 | 6] = c3 >>> 8 & 255, E2[e5 | 7] = c3 & 255, E2[e5 | 8] = u3 >>> 24, E2[e5 | 9] = u3 >>> 16 & 255, E2[e5 | 10] = u3 >>> 8 & 255, E2[e5 | 11] = u3 & 255, E2[e5 | 12] = h4 >>> 24, E2[e5 | 13] = h4 >>> 16 & 255, E2[e5 | 14] = h4 >>> 8 & 255, E2[e5 | 15] = h4 & 255;
        return 16;
      }
      function W2() {
        x2(0, 0, 0, 0);
        w2 = i4, v2 = n3, _2 = a3, k2 = s3;
      }
      function H2(e5, t5, r5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        var o4 = 0;
        if (t5 & 15)
          return -1;
        while ((r5 | 0) >= 16) {
          V2[e5 & 7](E2[t5 | 0] << 24 | E2[t5 | 1] << 16 | E2[t5 | 2] << 8 | E2[t5 | 3], E2[t5 | 4] << 24 | E2[t5 | 5] << 16 | E2[t5 | 6] << 8 | E2[t5 | 7], E2[t5 | 8] << 24 | E2[t5 | 9] << 16 | E2[t5 | 10] << 8 | E2[t5 | 11], E2[t5 | 12] << 24 | E2[t5 | 13] << 16 | E2[t5 | 14] << 8 | E2[t5 | 15]);
          E2[t5 | 0] = i4 >>> 24, E2[t5 | 1] = i4 >>> 16 & 255, E2[t5 | 2] = i4 >>> 8 & 255, E2[t5 | 3] = i4 & 255, E2[t5 | 4] = n3 >>> 24, E2[t5 | 5] = n3 >>> 16 & 255, E2[t5 | 6] = n3 >>> 8 & 255, E2[t5 | 7] = n3 & 255, E2[t5 | 8] = a3 >>> 24, E2[t5 | 9] = a3 >>> 16 & 255, E2[t5 | 10] = a3 >>> 8 & 255, E2[t5 | 11] = a3 & 255, E2[t5 | 12] = s3 >>> 24, E2[t5 | 13] = s3 >>> 16 & 255, E2[t5 | 14] = s3 >>> 8 & 255, E2[t5 | 15] = s3 & 255;
          o4 = o4 + 16 | 0, t5 = t5 + 16 | 0, r5 = r5 - 16 | 0;
        }
        return o4 | 0;
      }
      function G2(e5, t5, r5) {
        e5 = e5 | 0;
        t5 = t5 | 0;
        r5 = r5 | 0;
        var i5 = 0;
        if (t5 & 15)
          return -1;
        while ((r5 | 0) >= 16) {
          $2[e5 & 1](E2[t5 | 0] << 24 | E2[t5 | 1] << 16 | E2[t5 | 2] << 8 | E2[t5 | 3], E2[t5 | 4] << 24 | E2[t5 | 5] << 16 | E2[t5 | 6] << 8 | E2[t5 | 7], E2[t5 | 8] << 24 | E2[t5 | 9] << 16 | E2[t5 | 10] << 8 | E2[t5 | 11], E2[t5 | 12] << 24 | E2[t5 | 13] << 16 | E2[t5 | 14] << 8 | E2[t5 | 15]);
          i5 = i5 + 16 | 0, t5 = t5 + 16 | 0, r5 = r5 - 16 | 0;
        }
        return i5 | 0;
      }
      var V2 = [x2, M2, C2, K2, D2, R2, U2, I2];
      var $2 = [C2, B2];
      return {set_rounds: T2, set_state: z2, set_iv: q2, set_nonce: O2, set_mask: F2, set_counter: N2, get_state: j2, get_iv: L2, gcm_init: W2, cipher: H2, mac: G2};
    }({Uint8Array, Uint32Array}, e3, t3);
    return h3.set_key = function(e4, t4, i4, a3, s3, c3, u3, f2, d2) {
      var l2 = r3.subarray(0, 60), p2 = r3.subarray(256, 316);
      l2.set([t4, i4, a3, s3, c3, u3, f2, d2]);
      for (var y2 = e4, b2 = 1; y2 < 4 * e4 + 28; y2++) {
        var m2 = l2[y2 - 1];
        (y2 % e4 == 0 || e4 === 8 && y2 % e4 == 4) && (m2 = n2[m2 >>> 24] << 24 ^ n2[m2 >>> 16 & 255] << 16 ^ n2[m2 >>> 8 & 255] << 8 ^ n2[255 & m2]), y2 % e4 == 0 && (m2 = m2 << 8 ^ m2 >>> 24 ^ b2 << 24, b2 = b2 << 1 ^ (128 & b2 ? 27 : 0)), l2[y2] = l2[y2 - e4] ^ m2;
      }
      for (var g2 = 0; g2 < y2; g2 += 4)
        for (var w2 = 0; w2 < 4; w2++) {
          m2 = l2[y2 - (4 + g2) + (4 - w2) % 4];
          p2[g2 + w2] = g2 < 4 || g2 >= y2 - 4 ? m2 : o2[0][n2[m2 >>> 24]] ^ o2[1][n2[m2 >>> 16 & 255]] ^ o2[2][n2[m2 >>> 8 & 255]] ^ o2[3][n2[255 & m2]];
        }
      h3.set_rounds(e4 + 5);
    }, h3;
  };
  return h2.ENC = {ECB: 0, CBC: 2, CFB: 4, OFB: 6, CTR: 7}, h2.DEC = {ECB: 1, CBC: 3, CFB: 5, OFB: 6, CTR: 7}, h2.MAC = {CBC: 0, GCM: 1}, h2.HEAP_DATA = 16384, h2;
}();
function ye(e2) {
  return e2 instanceof Uint8Array;
}
function be(e2, t2) {
  const r2 = e2 ? e2.byteLength : t2 || 65536;
  if (4095 & r2 || r2 <= 0)
    throw Error("heap size must be a positive integer and a multiple of 4096");
  return e2 = e2 || new Uint8Array(new ArrayBuffer(r2));
}
function me(e2, t2, r2, i2, n2) {
  const a2 = e2.length - t2, s2 = a2 < n2 ? a2 : n2;
  return e2.set(r2.subarray(i2, i2 + s2), t2), s2;
}
function ge(...e2) {
  const t2 = e2.reduce((e3, t3) => e3 + t3.length, 0), r2 = new Uint8Array(t2);
  let i2 = 0;
  for (let t3 = 0; t3 < e2.length; t3++)
    r2.set(e2[t3], i2), i2 += e2[t3].length;
  return r2;
}
class we extends Error {
  constructor(...e2) {
    super(...e2);
  }
}
class ve extends Error {
  constructor(...e2) {
    super(...e2);
  }
}
class _e extends Error {
  constructor(...e2) {
    super(...e2);
  }
}
const ke = [], Ae = [];
class Se {
  constructor(e2, t2, r2 = true, i2, n2, a2) {
    this.pos = 0, this.len = 0, this.mode = i2, this.pos = 0, this.len = 0, this.key = e2, this.iv = t2, this.padding = r2, this.acquire_asm(n2, a2);
  }
  acquire_asm(e2, t2) {
    return this.heap !== void 0 && this.asm !== void 0 || (this.heap = e2 || ke.pop() || be().subarray(pe.HEAP_DATA), this.asm = t2 || Ae.pop() || new pe(null, this.heap.buffer), this.reset(this.key, this.iv)), {heap: this.heap, asm: this.asm};
  }
  release_asm() {
    this.heap !== void 0 && this.asm !== void 0 && (ke.push(this.heap), Ae.push(this.asm)), this.heap = void 0, this.asm = void 0;
  }
  reset(e2, t2) {
    const {asm: r2} = this.acquire_asm(), i2 = e2.length;
    if (i2 !== 16 && i2 !== 24 && i2 !== 32)
      throw new ve("illegal key size");
    const n2 = new DataView(e2.buffer, e2.byteOffset, e2.byteLength);
    if (r2.set_key(i2 >> 2, n2.getUint32(0), n2.getUint32(4), n2.getUint32(8), n2.getUint32(12), i2 > 16 ? n2.getUint32(16) : 0, i2 > 16 ? n2.getUint32(20) : 0, i2 > 24 ? n2.getUint32(24) : 0, i2 > 24 ? n2.getUint32(28) : 0), t2 !== void 0) {
      if (t2.length !== 16)
        throw new ve("illegal iv size");
      let e3 = new DataView(t2.buffer, t2.byteOffset, t2.byteLength);
      r2.set_iv(e3.getUint32(0), e3.getUint32(4), e3.getUint32(8), e3.getUint32(12));
    } else
      r2.set_iv(0, 0, 0, 0);
  }
  AES_Encrypt_process(e2) {
    if (!ye(e2))
      throw new TypeError("data isn't of expected type");
    let {heap: t2, asm: r2} = this.acquire_asm(), i2 = pe.ENC[this.mode], n2 = pe.HEAP_DATA, a2 = this.pos, s2 = this.len, o2 = 0, c2 = e2.length || 0, u2 = 0, h2 = 0, f2 = new Uint8Array(s2 + c2 & -16);
    for (; c2 > 0; )
      h2 = me(t2, a2 + s2, e2, o2, c2), s2 += h2, o2 += h2, c2 -= h2, h2 = r2.cipher(i2, n2 + a2, s2), h2 && f2.set(t2.subarray(a2, a2 + h2), u2), u2 += h2, h2 < s2 ? (a2 += h2, s2 -= h2) : (a2 = 0, s2 = 0);
    return this.pos = a2, this.len = s2, f2;
  }
  AES_Encrypt_finish() {
    let {heap: e2, asm: t2} = this.acquire_asm(), r2 = pe.ENC[this.mode], i2 = pe.HEAP_DATA, n2 = this.pos, a2 = this.len, s2 = 16 - a2 % 16, o2 = a2;
    if (this.hasOwnProperty("padding")) {
      if (this.padding) {
        for (let t3 = 0; t3 < s2; ++t3)
          e2[n2 + a2 + t3] = s2;
        a2 += s2, o2 = a2;
      } else if (a2 % 16)
        throw new ve("data length must be a multiple of the block size");
    } else
      a2 += s2;
    const c2 = new Uint8Array(o2);
    return a2 && t2.cipher(r2, i2 + n2, a2), o2 && c2.set(e2.subarray(n2, n2 + o2)), this.pos = 0, this.len = 0, this.release_asm(), c2;
  }
  AES_Decrypt_process(e2) {
    if (!ye(e2))
      throw new TypeError("data isn't of expected type");
    let {heap: t2, asm: r2} = this.acquire_asm(), i2 = pe.DEC[this.mode], n2 = pe.HEAP_DATA, a2 = this.pos, s2 = this.len, o2 = 0, c2 = e2.length || 0, u2 = 0, h2 = s2 + c2 & -16, f2 = 0, d2 = 0;
    this.padding && (f2 = s2 + c2 - h2 || 16, h2 -= f2);
    const l2 = new Uint8Array(h2);
    for (; c2 > 0; )
      d2 = me(t2, a2 + s2, e2, o2, c2), s2 += d2, o2 += d2, c2 -= d2, d2 = r2.cipher(i2, n2 + a2, s2 - (c2 ? 0 : f2)), d2 && l2.set(t2.subarray(a2, a2 + d2), u2), u2 += d2, d2 < s2 ? (a2 += d2, s2 -= d2) : (a2 = 0, s2 = 0);
    return this.pos = a2, this.len = s2, l2;
  }
  AES_Decrypt_finish() {
    let {heap: e2, asm: t2} = this.acquire_asm(), r2 = pe.DEC[this.mode], i2 = pe.HEAP_DATA, n2 = this.pos, a2 = this.len, s2 = a2;
    if (a2 > 0) {
      if (a2 % 16) {
        if (this.hasOwnProperty("padding"))
          throw new ve("data length must be a multiple of the block size");
        a2 += 16 - a2 % 16;
      }
      if (t2.cipher(r2, i2 + n2, a2), this.hasOwnProperty("padding") && this.padding) {
        let t3 = e2[n2 + s2 - 1];
        if (t3 < 1 || t3 > 16 || t3 > s2)
          throw new _e("bad padding");
        let r3 = 0;
        for (let i3 = t3; i3 > 1; i3--)
          r3 |= t3 ^ e2[n2 + s2 - i3];
        if (r3)
          throw new _e("bad padding");
        s2 -= t3;
      }
    }
    const o2 = new Uint8Array(s2);
    return s2 > 0 && o2.set(e2.subarray(n2, n2 + s2)), this.pos = 0, this.len = 0, this.release_asm(), o2;
  }
}
class Ee {
  static encrypt(e2, t2, r2 = false) {
    return new Ee(t2, r2).encrypt(e2);
  }
  static decrypt(e2, t2, r2 = false) {
    return new Ee(t2, r2).decrypt(e2);
  }
  constructor(e2, t2 = false, r2) {
    this.aes = r2 || new Se(e2, void 0, t2, "ECB");
  }
  encrypt(e2) {
    return ge(this.aes.AES_Encrypt_process(e2), this.aes.AES_Encrypt_finish());
  }
  decrypt(e2) {
    return ge(this.aes.AES_Decrypt_process(e2), this.aes.AES_Decrypt_finish());
  }
}
function Pe(e2) {
  const t2 = function(e3) {
    const t3 = new Ee(e3);
    this.encrypt = function(e4) {
      return t3.encrypt(e4);
    }, this.decrypt = function(e4) {
      return t3.decrypt(e4);
    };
  };
  return t2.blockSize = t2.prototype.blockSize = 16, t2.keySize = t2.prototype.keySize = e2 / 8, t2;
}
function xe(e2, t2, r2, i2, n2, a2) {
  const s2 = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756], o2 = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344], c2 = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584], u2 = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928], h2 = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080], f2 = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312], d2 = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154], l2 = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
  let p2, y2, b2, m2, g2, w2, v2, _2, k2, A2, S2, E2, P2, x2, M2 = 0, C2 = t2.length;
  const K2 = e2.length === 32 ? 3 : 9;
  _2 = K2 === 3 ? r2 ? [0, 32, 2] : [30, -2, -2] : r2 ? [0, 32, 2, 62, 30, -2, 64, 96, 2] : [94, 62, -2, 32, 64, 2, 30, -2, -2], r2 && (C2 = (t2 = function(e3, t3) {
    const r3 = 8 - e3.length % 8;
    let i3;
    if (t3 === 2 && r3 < 8)
      i3 = 32;
    else if (t3 === 1)
      i3 = r3;
    else {
      if (t3 || !(r3 < 8)) {
        if (r3 === 8)
          return e3;
        throw Error("des: invalid padding");
      }
      i3 = 0;
    }
    const n3 = new Uint8Array(e3.length + r3);
    for (let t4 = 0; t4 < e3.length; t4++)
      n3[t4] = e3[t4];
    for (let t4 = 0; t4 < r3; t4++)
      n3[e3.length + t4] = i3;
    return n3;
  }(t2, a2)).length);
  let D2 = new Uint8Array(C2), R2 = 0;
  for (i2 === 1 && (k2 = n2[M2++] << 24 | n2[M2++] << 16 | n2[M2++] << 8 | n2[M2++], S2 = n2[M2++] << 24 | n2[M2++] << 16 | n2[M2++] << 8 | n2[M2++], M2 = 0); M2 < C2; ) {
    for (w2 = t2[M2++] << 24 | t2[M2++] << 16 | t2[M2++] << 8 | t2[M2++], v2 = t2[M2++] << 24 | t2[M2++] << 16 | t2[M2++] << 8 | t2[M2++], i2 === 1 && (r2 ? (w2 ^= k2, v2 ^= S2) : (A2 = k2, E2 = S2, k2 = w2, S2 = v2)), b2 = 252645135 & (w2 >>> 4 ^ v2), v2 ^= b2, w2 ^= b2 << 4, b2 = 65535 & (w2 >>> 16 ^ v2), v2 ^= b2, w2 ^= b2 << 16, b2 = 858993459 & (v2 >>> 2 ^ w2), w2 ^= b2, v2 ^= b2 << 2, b2 = 16711935 & (v2 >>> 8 ^ w2), w2 ^= b2, v2 ^= b2 << 8, b2 = 1431655765 & (w2 >>> 1 ^ v2), v2 ^= b2, w2 ^= b2 << 1, w2 = w2 << 1 | w2 >>> 31, v2 = v2 << 1 | v2 >>> 31, y2 = 0; y2 < K2; y2 += 3) {
      for (P2 = _2[y2 + 1], x2 = _2[y2 + 2], p2 = _2[y2]; p2 !== P2; p2 += x2)
        m2 = v2 ^ e2[p2], g2 = (v2 >>> 4 | v2 << 28) ^ e2[p2 + 1], b2 = w2, w2 = v2, v2 = b2 ^ (o2[m2 >>> 24 & 63] | u2[m2 >>> 16 & 63] | f2[m2 >>> 8 & 63] | l2[63 & m2] | s2[g2 >>> 24 & 63] | c2[g2 >>> 16 & 63] | h2[g2 >>> 8 & 63] | d2[63 & g2]);
      b2 = w2, w2 = v2, v2 = b2;
    }
    w2 = w2 >>> 1 | w2 << 31, v2 = v2 >>> 1 | v2 << 31, b2 = 1431655765 & (w2 >>> 1 ^ v2), v2 ^= b2, w2 ^= b2 << 1, b2 = 16711935 & (v2 >>> 8 ^ w2), w2 ^= b2, v2 ^= b2 << 8, b2 = 858993459 & (v2 >>> 2 ^ w2), w2 ^= b2, v2 ^= b2 << 2, b2 = 65535 & (w2 >>> 16 ^ v2), v2 ^= b2, w2 ^= b2 << 16, b2 = 252645135 & (w2 >>> 4 ^ v2), v2 ^= b2, w2 ^= b2 << 4, i2 === 1 && (r2 ? (k2 = w2, S2 = v2) : (w2 ^= A2, v2 ^= E2)), D2[R2++] = w2 >>> 24, D2[R2++] = w2 >>> 16 & 255, D2[R2++] = w2 >>> 8 & 255, D2[R2++] = 255 & w2, D2[R2++] = v2 >>> 24, D2[R2++] = v2 >>> 16 & 255, D2[R2++] = v2 >>> 8 & 255, D2[R2++] = 255 & v2;
  }
  return r2 || (D2 = function(e3, t3) {
    let r3, i3 = null;
    if (t3 === 2)
      r3 = 32;
    else if (t3 === 1)
      i3 = e3[e3.length - 1];
    else {
      if (t3)
        throw Error("des: invalid padding");
      r3 = 0;
    }
    if (!i3) {
      for (i3 = 1; e3[e3.length - i3] === r3; )
        i3++;
      i3--;
    }
    return e3.subarray(0, e3.length - i3);
  }(D2, a2)), D2;
}
function Me(e2) {
  const t2 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], r2 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], i2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], n2 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], a2 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], s2 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], o2 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], c2 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], u2 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], h2 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], f2 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], d2 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], l2 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], p2 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261], y2 = e2.length > 8 ? 3 : 1, b2 = Array(32 * y2), m2 = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
  let g2, w2, v2, _2 = 0, k2 = 0;
  for (let A2 = 0; A2 < y2; A2++) {
    let y3 = e2[_2++] << 24 | e2[_2++] << 16 | e2[_2++] << 8 | e2[_2++], A3 = e2[_2++] << 24 | e2[_2++] << 16 | e2[_2++] << 8 | e2[_2++];
    v2 = 252645135 & (y3 >>> 4 ^ A3), A3 ^= v2, y3 ^= v2 << 4, v2 = 65535 & (A3 >>> -16 ^ y3), y3 ^= v2, A3 ^= v2 << -16, v2 = 858993459 & (y3 >>> 2 ^ A3), A3 ^= v2, y3 ^= v2 << 2, v2 = 65535 & (A3 >>> -16 ^ y3), y3 ^= v2, A3 ^= v2 << -16, v2 = 1431655765 & (y3 >>> 1 ^ A3), A3 ^= v2, y3 ^= v2 << 1, v2 = 16711935 & (A3 >>> 8 ^ y3), y3 ^= v2, A3 ^= v2 << 8, v2 = 1431655765 & (y3 >>> 1 ^ A3), A3 ^= v2, y3 ^= v2 << 1, v2 = y3 << 8 | A3 >>> 20 & 240, y3 = A3 << 24 | A3 << 8 & 16711680 | A3 >>> 8 & 65280 | A3 >>> 24 & 240, A3 = v2;
    for (let e3 = 0; e3 < 16; e3++)
      m2[e3] ? (y3 = y3 << 2 | y3 >>> 26, A3 = A3 << 2 | A3 >>> 26) : (y3 = y3 << 1 | y3 >>> 27, A3 = A3 << 1 | A3 >>> 27), y3 &= -15, A3 &= -15, g2 = t2[y3 >>> 28] | r2[y3 >>> 24 & 15] | i2[y3 >>> 20 & 15] | n2[y3 >>> 16 & 15] | a2[y3 >>> 12 & 15] | s2[y3 >>> 8 & 15] | o2[y3 >>> 4 & 15], w2 = c2[A3 >>> 28] | u2[A3 >>> 24 & 15] | h2[A3 >>> 20 & 15] | f2[A3 >>> 16 & 15] | d2[A3 >>> 12 & 15] | l2[A3 >>> 8 & 15] | p2[A3 >>> 4 & 15], v2 = 65535 & (w2 >>> 16 ^ g2), b2[k2++] = g2 ^ v2, b2[k2++] = w2 ^ v2 << 16;
  }
  return b2;
}
function Ce(e2) {
  this.key = [];
  for (let t2 = 0; t2 < 3; t2++)
    this.key.push(new Uint8Array(e2.subarray(8 * t2, 8 * t2 + 8)));
  this.encrypt = function(e3) {
    return xe(Me(this.key[2]), xe(Me(this.key[1]), xe(Me(this.key[0]), e3, true, 0, null, null), false, 0, null, null), true, 0, null, null);
  };
}
function Ke() {
  this.BlockSize = 8, this.KeySize = 16, this.setKey = function(e3) {
    if (this.masking = Array(16), this.rotate = Array(16), this.reset(), e3.length !== this.KeySize)
      throw Error("CAST-128: keys must be 16 bytes");
    return this.keySchedule(e3), true;
  }, this.reset = function() {
    for (let e3 = 0; e3 < 16; e3++)
      this.masking[e3] = 0, this.rotate[e3] = 0;
  }, this.getBlockSize = function() {
    return this.BlockSize;
  }, this.encrypt = function(e3) {
    const t3 = Array(e3.length);
    for (let a3 = 0; a3 < e3.length; a3 += 8) {
      let s2, o2 = e3[a3] << 24 | e3[a3 + 1] << 16 | e3[a3 + 2] << 8 | e3[a3 + 3], c2 = e3[a3 + 4] << 24 | e3[a3 + 5] << 16 | e3[a3 + 6] << 8 | e3[a3 + 7];
      s2 = c2, c2 = o2 ^ r2(c2, this.masking[0], this.rotate[0]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[1], this.rotate[1]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[2], this.rotate[2]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[3], this.rotate[3]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[4], this.rotate[4]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[5], this.rotate[5]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[6], this.rotate[6]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[7], this.rotate[7]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[8], this.rotate[8]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[9], this.rotate[9]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[10], this.rotate[10]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[11], this.rotate[11]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[12], this.rotate[12]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[13], this.rotate[13]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[14], this.rotate[14]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[15], this.rotate[15]), o2 = s2, t3[a3] = c2 >>> 24 & 255, t3[a3 + 1] = c2 >>> 16 & 255, t3[a3 + 2] = c2 >>> 8 & 255, t3[a3 + 3] = 255 & c2, t3[a3 + 4] = o2 >>> 24 & 255, t3[a3 + 5] = o2 >>> 16 & 255, t3[a3 + 6] = o2 >>> 8 & 255, t3[a3 + 7] = 255 & o2;
    }
    return t3;
  }, this.decrypt = function(e3) {
    const t3 = Array(e3.length);
    for (let a3 = 0; a3 < e3.length; a3 += 8) {
      let s2, o2 = e3[a3] << 24 | e3[a3 + 1] << 16 | e3[a3 + 2] << 8 | e3[a3 + 3], c2 = e3[a3 + 4] << 24 | e3[a3 + 5] << 16 | e3[a3 + 6] << 8 | e3[a3 + 7];
      s2 = c2, c2 = o2 ^ r2(c2, this.masking[15], this.rotate[15]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[14], this.rotate[14]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[13], this.rotate[13]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[12], this.rotate[12]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[11], this.rotate[11]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[10], this.rotate[10]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[9], this.rotate[9]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[8], this.rotate[8]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[7], this.rotate[7]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[6], this.rotate[6]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[5], this.rotate[5]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[4], this.rotate[4]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[3], this.rotate[3]), o2 = s2, s2 = c2, c2 = o2 ^ n2(c2, this.masking[2], this.rotate[2]), o2 = s2, s2 = c2, c2 = o2 ^ i2(c2, this.masking[1], this.rotate[1]), o2 = s2, s2 = c2, c2 = o2 ^ r2(c2, this.masking[0], this.rotate[0]), o2 = s2, t3[a3] = c2 >>> 24 & 255, t3[a3 + 1] = c2 >>> 16 & 255, t3[a3 + 2] = c2 >>> 8 & 255, t3[a3 + 3] = 255 & c2, t3[a3 + 4] = o2 >>> 24 & 255, t3[a3 + 5] = o2 >> 16 & 255, t3[a3 + 6] = o2 >> 8 & 255, t3[a3 + 7] = 255 & o2;
    }
    return t3;
  };
  const e2 = [, , , ,];
  e2[0] = [, , , ,], e2[0][0] = [4, 0, 13, 15, 12, 14, 8], e2[0][1] = [5, 2, 16, 18, 17, 19, 10], e2[0][2] = [6, 3, 23, 22, 21, 20, 9], e2[0][3] = [7, 1, 26, 25, 27, 24, 11], e2[1] = [, , , ,], e2[1][0] = [0, 6, 21, 23, 20, 22, 16], e2[1][1] = [1, 4, 0, 2, 1, 3, 18], e2[1][2] = [2, 5, 7, 6, 5, 4, 17], e2[1][3] = [3, 7, 10, 9, 11, 8, 19], e2[2] = [, , , ,], e2[2][0] = [4, 0, 13, 15, 12, 14, 8], e2[2][1] = [5, 2, 16, 18, 17, 19, 10], e2[2][2] = [6, 3, 23, 22, 21, 20, 9], e2[2][3] = [7, 1, 26, 25, 27, 24, 11], e2[3] = [, , , ,], e2[3][0] = [0, 6, 21, 23, 20, 22, 16], e2[3][1] = [1, 4, 0, 2, 1, 3, 18], e2[3][2] = [2, 5, 7, 6, 5, 4, 17], e2[3][3] = [3, 7, 10, 9, 11, 8, 19];
  const t2 = [, , , ,];
  function r2(e3, t3, r3) {
    const i3 = t3 + e3, n3 = i3 << r3 | i3 >>> 32 - r3;
    return (a2[0][n3 >>> 24] ^ a2[1][n3 >>> 16 & 255]) - a2[2][n3 >>> 8 & 255] + a2[3][255 & n3];
  }
  function i2(e3, t3, r3) {
    const i3 = t3 ^ e3, n3 = i3 << r3 | i3 >>> 32 - r3;
    return a2[0][n3 >>> 24] - a2[1][n3 >>> 16 & 255] + a2[2][n3 >>> 8 & 255] ^ a2[3][255 & n3];
  }
  function n2(e3, t3, r3) {
    const i3 = t3 - e3, n3 = i3 << r3 | i3 >>> 32 - r3;
    return (a2[0][n3 >>> 24] + a2[1][n3 >>> 16 & 255] ^ a2[2][n3 >>> 8 & 255]) - a2[3][255 & n3];
  }
  t2[0] = [, , , ,], t2[0][0] = [24, 25, 23, 22, 18], t2[0][1] = [26, 27, 21, 20, 22], t2[0][2] = [28, 29, 19, 18, 25], t2[0][3] = [30, 31, 17, 16, 28], t2[1] = [, , , ,], t2[1][0] = [3, 2, 12, 13, 8], t2[1][1] = [1, 0, 14, 15, 13], t2[1][2] = [7, 6, 8, 9, 3], t2[1][3] = [5, 4, 10, 11, 7], t2[2] = [, , , ,], t2[2][0] = [19, 18, 28, 29, 25], t2[2][1] = [17, 16, 30, 31, 28], t2[2][2] = [23, 22, 24, 25, 18], t2[2][3] = [21, 20, 26, 27, 22], t2[3] = [, , , ,], t2[3][0] = [8, 9, 7, 6, 3], t2[3][1] = [10, 11, 5, 4, 7], t2[3][2] = [12, 13, 3, 2, 8], t2[3][3] = [14, 15, 1, 0, 13], this.keySchedule = function(r3) {
    const i3 = [, , , , , , , ,], n3 = Array(32);
    let s2;
    for (let e3 = 0; e3 < 4; e3++)
      s2 = 4 * e3, i3[e3] = r3[s2] << 24 | r3[s2 + 1] << 16 | r3[s2 + 2] << 8 | r3[s2 + 3];
    const o2 = [6, 7, 4, 5];
    let c2, u2 = 0;
    for (let r4 = 0; r4 < 2; r4++)
      for (let r5 = 0; r5 < 4; r5++) {
        for (s2 = 0; s2 < 4; s2++) {
          const t3 = e2[r5][s2];
          c2 = i3[t3[1]], c2 ^= a2[4][i3[t3[2] >>> 2] >>> 24 - 8 * (3 & t3[2]) & 255], c2 ^= a2[5][i3[t3[3] >>> 2] >>> 24 - 8 * (3 & t3[3]) & 255], c2 ^= a2[6][i3[t3[4] >>> 2] >>> 24 - 8 * (3 & t3[4]) & 255], c2 ^= a2[7][i3[t3[5] >>> 2] >>> 24 - 8 * (3 & t3[5]) & 255], c2 ^= a2[o2[s2]][i3[t3[6] >>> 2] >>> 24 - 8 * (3 & t3[6]) & 255], i3[t3[0]] = c2;
        }
        for (s2 = 0; s2 < 4; s2++) {
          const e3 = t2[r5][s2];
          c2 = a2[4][i3[e3[0] >>> 2] >>> 24 - 8 * (3 & e3[0]) & 255], c2 ^= a2[5][i3[e3[1] >>> 2] >>> 24 - 8 * (3 & e3[1]) & 255], c2 ^= a2[6][i3[e3[2] >>> 2] >>> 24 - 8 * (3 & e3[2]) & 255], c2 ^= a2[7][i3[e3[3] >>> 2] >>> 24 - 8 * (3 & e3[3]) & 255], c2 ^= a2[4 + s2][i3[e3[4] >>> 2] >>> 24 - 8 * (3 & e3[4]) & 255], n3[u2] = c2, u2++;
        }
      }
    for (let e3 = 0; e3 < 16; e3++)
      this.masking[e3] = n3[e3], this.rotate[e3] = 31 & n3[16 + e3];
  };
  const a2 = [, , , , , , , ,];
  a2[0] = [821772500, 2678128395, 1810681135, 1059425402, 505495343, 2617265619, 1610868032, 3483355465, 3218386727, 2294005173, 3791863952, 2563806837, 1852023008, 365126098, 3269944861, 584384398, 677919599, 3229601881, 4280515016, 2002735330, 1136869587, 3744433750, 2289869850, 2731719981, 2714362070, 879511577, 1639411079, 575934255, 717107937, 2857637483, 576097850, 2731753936, 1725645e3, 2810460463, 5111599, 767152862, 2543075244, 1251459544, 1383482551, 3052681127, 3089939183, 3612463449, 1878520045, 1510570527, 2189125840, 2431448366, 582008916, 3163445557, 1265446783, 1354458274, 3529918736, 3202711853, 3073581712, 3912963487, 3029263377, 1275016285, 4249207360, 2905708351, 3304509486, 1442611557, 3585198765, 2712415662, 2731849581, 3248163920, 2283946226, 208555832, 2766454743, 1331405426, 1447828783, 3315356441, 3108627284, 2957404670, 2981538698, 3339933917, 1669711173, 286233437, 1465092821, 1782121619, 3862771680, 710211251, 980974943, 1651941557, 430374111, 2051154026, 704238805, 4128970897, 3144820574, 2857402727, 948965521, 3333752299, 2227686284, 718756367, 2269778983, 2731643755, 718440111, 2857816721, 3616097120, 1113355533, 2478022182, 410092745, 1811985197, 1944238868, 2696854588, 1415722873, 1682284203, 1060277122, 1998114690, 1503841958, 82706478, 2315155686, 1068173648, 845149890, 2167947013, 1768146376, 1993038550, 3566826697, 3390574031, 940016341, 3355073782, 2328040721, 904371731, 1205506512, 4094660742, 2816623006, 825647681, 85914773, 2857843460, 1249926541, 1417871568, 3287612, 3211054559, 3126306446, 1975924523, 1353700161, 2814456437, 2438597621, 1800716203, 722146342, 2873936343, 1151126914, 4160483941, 2877670899, 458611604, 2866078500, 3483680063, 770352098, 2652916994, 3367839148, 3940505011, 3585973912, 3809620402, 718646636, 2504206814, 2914927912, 3631288169, 2857486607, 2860018678, 575749918, 2857478043, 718488780, 2069512688, 3548183469, 453416197, 1106044049, 3032691430, 52586708, 3378514636, 3459808877, 3211506028, 1785789304, 218356169, 3571399134, 3759170522, 1194783844, 1523787992, 3007827094, 1975193539, 2555452411, 1341901877, 3045838698, 3776907964, 3217423946, 2802510864, 2889438986, 1057244207, 1636348243, 3761863214, 1462225785, 2632663439, 481089165, 718503062, 24497053, 3332243209, 3344655856, 3655024856, 3960371065, 1195698900, 2971415156, 3710176158, 2115785917, 4027663609, 3525578417, 2524296189, 2745972565, 3564906415, 1372086093, 1452307862, 2780501478, 1476592880, 3389271281, 18495466, 2378148571, 901398090, 891748256, 3279637769, 3157290713, 2560960102, 1447622437, 4284372637, 216884176, 2086908623, 1879786977, 3588903153, 2242455666, 2938092967, 3559082096, 2810645491, 758861177, 1121993112, 215018983, 642190776, 4169236812, 1196255959, 2081185372, 3508738393, 941322904, 4124243163, 2877523539, 1848581667, 2205260958, 3180453958, 2589345134, 3694731276, 550028657, 2519456284, 3789985535, 2973870856, 2093648313, 443148163, 46942275, 2734146937, 1117713533, 1115362972, 1523183689, 3717140224, 1551984063], a2[1] = [522195092, 4010518363, 1776537470, 960447360, 4267822970, 4005896314, 1435016340, 1929119313, 2913464185, 1310552629, 3579470798, 3724818106, 2579771631, 1594623892, 417127293, 2715217907, 2696228731, 1508390405, 3994398868, 3925858569, 3695444102, 4019471449, 3129199795, 3770928635, 3520741761, 990456497, 4187484609, 2783367035, 21106139, 3840405339, 631373633, 3783325702, 532942976, 396095098, 3548038825, 4267192484, 2564721535, 2011709262, 2039648873, 620404603, 3776170075, 2898526339, 3612357925, 4159332703, 1645490516, 223693667, 1567101217, 3362177881, 1029951347, 3470931136, 3570957959, 1550265121, 119497089, 972513919, 907948164, 3840628539, 1613718692, 3594177948, 465323573, 2659255085, 654439692, 2575596212, 2699288441, 3127702412, 277098644, 624404830, 4100943870, 2717858591, 546110314, 2403699828, 3655377447, 1321679412, 4236791657, 1045293279, 4010672264, 895050893, 2319792268, 494945126, 1914543101, 2777056443, 3894764339, 2219737618, 311263384, 4275257268, 3458730721, 669096869, 3584475730, 3835122877, 3319158237, 3949359204, 2005142349, 2713102337, 2228954793, 3769984788, 569394103, 3855636576, 1425027204, 108000370, 2736431443, 3671869269, 3043122623, 1750473702, 2211081108, 762237499, 3972989403, 2798899386, 3061857628, 2943854345, 867476300, 964413654, 1591880597, 1594774276, 2179821409, 552026980, 3026064248, 3726140315, 2283577634, 3110545105, 2152310760, 582474363, 1582640421, 1383256631, 2043843868, 3322775884, 1217180674, 463797851, 2763038571, 480777679, 2718707717, 2289164131, 3118346187, 214354409, 200212307, 3810608407, 3025414197, 2674075964, 3997296425, 1847405948, 1342460550, 510035443, 4080271814, 815934613, 833030224, 1620250387, 1945732119, 2703661145, 3966000196, 1388869545, 3456054182, 2687178561, 2092620194, 562037615, 1356438536, 3409922145, 3261847397, 1688467115, 2150901366, 631725691, 3840332284, 549916902, 3455104640, 394546491, 837744717, 2114462948, 751520235, 2221554606, 2415360136, 3999097078, 2063029875, 803036379, 2702586305, 821456707, 3019566164, 360699898, 4018502092, 3511869016, 3677355358, 2402471449, 812317050, 49299192, 2570164949, 3259169295, 2816732080, 3331213574, 3101303564, 2156015656, 3705598920, 3546263921, 143268808, 3200304480, 1638124008, 3165189453, 3341807610, 578956953, 2193977524, 3638120073, 2333881532, 807278310, 658237817, 2969561766, 1641658566, 11683945, 3086995007, 148645947, 1138423386, 4158756760, 1981396783, 2401016740, 3699783584, 380097457, 2680394679, 2803068651, 3334260286, 441530178, 4016580796, 1375954390, 761952171, 891809099, 2183123478, 157052462, 3683840763, 1592404427, 341349109, 2438483839, 1417898363, 644327628, 2233032776, 2353769706, 2201510100, 220455161, 1815641738, 182899273, 2995019788, 3627381533, 3702638151, 2890684138, 1052606899, 588164016, 1681439879, 4038439418, 2405343923, 4229449282, 167996282, 1336969661, 1688053129, 2739224926, 1543734051, 1046297529, 1138201970, 2121126012, 115334942, 1819067631, 1902159161, 1941945968, 2206692869, 1159982321], a2[2] = [2381300288, 637164959, 3952098751, 3893414151, 1197506559, 916448331, 2350892612, 2932787856, 3199334847, 4009478890, 3905886544, 1373570990, 2450425862, 4037870920, 3778841987, 2456817877, 286293407, 124026297, 3001279700, 1028597854, 3115296800, 4208886496, 2691114635, 2188540206, 1430237888, 1218109995, 3572471700, 308166588, 570424558, 2187009021, 2455094765, 307733056, 1310360322, 3135275007, 1384269543, 2388071438, 863238079, 2359263624, 2801553128, 3380786597, 2831162807, 1470087780, 1728663345, 4072488799, 1090516929, 532123132, 2389430977, 1132193179, 2578464191, 3051079243, 1670234342, 1434557849, 2711078940, 1241591150, 3314043432, 3435360113, 3091448339, 1812415473, 2198440252, 267246943, 796911696, 3619716990, 38830015, 1526438404, 2806502096, 374413614, 2943401790, 1489179520, 1603809326, 1920779204, 168801282, 260042626, 2358705581, 1563175598, 2397674057, 1356499128, 2217211040, 514611088, 2037363785, 2186468373, 4022173083, 2792511869, 2913485016, 1173701892, 4200428547, 3896427269, 1334932762, 2455136706, 602925377, 2835607854, 1613172210, 41346230, 2499634548, 2457437618, 2188827595, 41386358, 4172255629, 1313404830, 2405527007, 3801973774, 2217704835, 873260488, 2528884354, 2478092616, 4012915883, 2555359016, 2006953883, 2463913485, 575479328, 2218240648, 2099895446, 660001756, 2341502190, 3038761536, 3888151779, 3848713377, 3286851934, 1022894237, 1620365795, 3449594689, 1551255054, 15374395, 3570825345, 4249311020, 4151111129, 3181912732, 310226346, 1133119310, 530038928, 136043402, 2476768958, 3107506709, 2544909567, 1036173560, 2367337196, 1681395281, 1758231547, 3641649032, 306774401, 1575354324, 3716085866, 1990386196, 3114533736, 2455606671, 1262092282, 3124342505, 2768229131, 4210529083, 1833535011, 423410938, 660763973, 2187129978, 1639812e3, 3508421329, 3467445492, 310289298, 272797111, 2188552562, 2456863912, 310240523, 677093832, 1013118031, 901835429, 3892695601, 1116285435, 3036471170, 1337354835, 243122523, 520626091, 277223598, 4244441197, 4194248841, 1766575121, 594173102, 316590669, 742362309, 3536858622, 4176435350, 3838792410, 2501204839, 1229605004, 3115755532, 1552908988, 2312334149, 979407927, 3959474601, 1148277331, 176638793, 3614686272, 2083809052, 40992502, 1340822838, 2731552767, 3535757508, 3560899520, 1354035053, 122129617, 7215240, 2732932949, 3118912700, 2718203926, 2539075635, 3609230695, 3725561661, 1928887091, 2882293555, 1988674909, 2063640240, 2491088897, 1459647954, 4189817080, 2302804382, 1113892351, 2237858528, 1927010603, 4002880361, 1856122846, 1594404395, 2944033133, 3855189863, 3474975698, 1643104450, 4054590833, 3431086530, 1730235576, 2984608721, 3084664418, 2131803598, 4178205752, 267404349, 1617849798, 1616132681, 1462223176, 736725533, 2327058232, 551665188, 2945899023, 1749386277, 2575514597, 1611482493, 674206544, 2201269090, 3642560800, 728599968, 1680547377, 2620414464, 1388111496, 453204106, 4156223445, 1094905244, 2754698257, 2201108165, 3757000246, 2704524545, 3922940700, 3996465027], a2[3] = [2645754912, 532081118, 2814278639, 3530793624, 1246723035, 1689095255, 2236679235, 4194438865, 2116582143, 3859789411, 157234593, 2045505824, 4245003587, 1687664561, 4083425123, 605965023, 672431967, 1336064205, 3376611392, 214114848, 4258466608, 3232053071, 489488601, 605322005, 3998028058, 264917351, 1912574028, 756637694, 436560991, 202637054, 135989450, 85393697, 2152923392, 3896401662, 2895836408, 2145855233, 3535335007, 115294817, 3147733898, 1922296357, 3464822751, 4117858305, 1037454084, 2725193275, 2127856640, 1417604070, 1148013728, 1827919605, 642362335, 2929772533, 909348033, 1346338451, 3547799649, 297154785, 1917849091, 4161712827, 2883604526, 3968694238, 1469521537, 3780077382, 3375584256, 1763717519, 136166297, 4290970789, 1295325189, 2134727907, 2798151366, 1566297257, 3672928234, 2677174161, 2672173615, 965822077, 2780786062, 289653839, 1133871874, 3491843819, 35685304, 1068898316, 418943774, 672553190, 642281022, 2346158704, 1954014401, 3037126780, 4079815205, 2030668546, 3840588673, 672283427, 1776201016, 359975446, 3750173538, 555499703, 2769985273, 1324923, 69110472, 152125443, 3176785106, 3822147285, 1340634837, 798073664, 1434183902, 15393959, 216384236, 1303690150, 3881221631, 3711134124, 3960975413, 106373927, 2578434224, 1455997841, 1801814300, 1578393881, 1854262133, 3188178946, 3258078583, 2302670060, 1539295533, 3505142565, 3078625975, 2372746020, 549938159, 3278284284, 2620926080, 181285381, 2865321098, 3970029511, 68876850, 488006234, 1728155692, 2608167508, 836007927, 2435231793, 919367643, 3339422534, 3655756360, 1457871481, 40520939, 1380155135, 797931188, 234455205, 2255801827, 3990488299, 397000196, 739833055, 3077865373, 2871719860, 4022553888, 772369276, 390177364, 3853951029, 557662966, 740064294, 1640166671, 1699928825, 3535942136, 622006121, 3625353122, 68743880, 1742502, 219489963, 1664179233, 1577743084, 1236991741, 410585305, 2366487942, 823226535, 1050371084, 3426619607, 3586839478, 212779912, 4147118561, 1819446015, 1911218849, 530248558, 3486241071, 3252585495, 2886188651, 3410272728, 2342195030, 20547779, 2982490058, 3032363469, 3631753222, 312714466, 1870521650, 1493008054, 3491686656, 615382978, 4103671749, 2534517445, 1932181, 2196105170, 278426614, 6369430, 3274544417, 2913018367, 697336853, 2143000447, 2946413531, 701099306, 1558357093, 2805003052, 3500818408, 2321334417, 3567135975, 216290473, 3591032198, 23009561, 1996984579, 3735042806, 2024298078, 3739440863, 569400510, 2339758983, 3016033873, 3097871343, 3639523026, 3844324983, 3256173865, 795471839, 2951117563, 4101031090, 4091603803, 3603732598, 971261452, 534414648, 428311343, 3389027175, 2844869880, 694888862, 1227866773, 2456207019, 3043454569, 2614353370, 3749578031, 3676663836, 459166190, 4132644070, 1794958188, 51825668, 2252611902, 3084671440, 2036672799, 3436641603, 1099053433, 2469121526, 3059204941, 1323291266, 2061838604, 1018778475, 2233344254, 2553501054, 334295216, 3556750194, 1065731521, 183467730], a2[4] = [2127105028, 745436345, 2601412319, 2788391185, 3093987327, 500390133, 1155374404, 389092991, 150729210, 3891597772, 3523549952, 1935325696, 716645080, 946045387, 2901812282, 1774124410, 3869435775, 4039581901, 3293136918, 3438657920, 948246080, 363898952, 3867875531, 1286266623, 1598556673, 68334250, 630723836, 1104211938, 1312863373, 613332731, 2377784574, 1101634306, 441780740, 3129959883, 1917973735, 2510624549, 3238456535, 2544211978, 3308894634, 1299840618, 4076074851, 1756332096, 3977027158, 297047435, 3790297736, 2265573040, 3621810518, 1311375015, 1667687725, 47300608, 3299642885, 2474112369, 201668394, 1468347890, 576830978, 3594690761, 3742605952, 1958042578, 1747032512, 3558991340, 1408974056, 3366841779, 682131401, 1033214337, 1545599232, 4265137049, 206503691, 103024618, 2855227313, 1337551222, 2428998917, 2963842932, 4015366655, 3852247746, 2796956967, 3865723491, 3747938335, 247794022, 3755824572, 702416469, 2434691994, 397379957, 851939612, 2314769512, 218229120, 1380406772, 62274761, 214451378, 3170103466, 2276210409, 3845813286, 28563499, 446592073, 1693330814, 3453727194, 29968656, 3093872512, 220656637, 2470637031, 77972100, 1667708854, 1358280214, 4064765667, 2395616961, 325977563, 4277240721, 4220025399, 3605526484, 3355147721, 811859167, 3069544926, 3962126810, 652502677, 3075892249, 4132761541, 3498924215, 1217549313, 3250244479, 3858715919, 3053989961, 1538642152, 2279026266, 2875879137, 574252750, 3324769229, 2651358713, 1758150215, 141295887, 2719868960, 3515574750, 4093007735, 4194485238, 1082055363, 3417560400, 395511885, 2966884026, 179534037, 3646028556, 3738688086, 1092926436, 2496269142, 257381841, 3772900718, 1636087230, 1477059743, 2499234752, 3811018894, 2675660129, 3285975680, 90732309, 1684827095, 1150307763, 1723134115, 3237045386, 1769919919, 1240018934, 815675215, 750138730, 2239792499, 1234303040, 1995484674, 138143821, 675421338, 1145607174, 1936608440, 3238603024, 2345230278, 2105974004, 323969391, 779555213, 3004902369, 2861610098, 1017501463, 2098600890, 2628620304, 2940611490, 2682542546, 1171473753, 3656571411, 3687208071, 4091869518, 393037935, 159126506, 1662887367, 1147106178, 391545844, 3452332695, 1891500680, 3016609650, 1851642611, 546529401, 1167818917, 3194020571, 2848076033, 3953471836, 575554290, 475796850, 4134673196, 450035699, 2351251534, 844027695, 1080539133, 86184846, 1554234488, 3692025454, 1972511363, 2018339607, 1491841390, 1141460869, 1061690759, 4244549243, 2008416118, 2351104703, 2868147542, 1598468138, 722020353, 1027143159, 212344630, 1387219594, 1725294528, 3745187956, 2500153616, 458938280, 4129215917, 1828119673, 544571780, 3503225445, 2297937496, 1241802790, 267843827, 2694610800, 1397140384, 1558801448, 3782667683, 1806446719, 929573330, 2234912681, 400817706, 616011623, 4121520928, 3603768725, 1761550015, 1968522284, 4053731006, 4192232858, 4005120285, 872482584, 3140537016, 3894607381, 2287405443, 1963876937, 3663887957, 1584857e3, 2975024454, 1833426440, 4025083860], a2[5] = [4143615901, 749497569, 1285769319, 3795025788, 2514159847, 23610292, 3974978748, 844452780, 3214870880, 3751928557, 2213566365, 1676510905, 448177848, 3730751033, 4086298418, 2307502392, 871450977, 3222878141, 4110862042, 3831651966, 2735270553, 1310974780, 2043402188, 1218528103, 2736035353, 4274605013, 2702448458, 3936360550, 2693061421, 162023535, 2827510090, 687910808, 23484817, 3784910947, 3371371616, 779677500, 3503626546, 3473927188, 4157212626, 3500679282, 4248902014, 2466621104, 3899384794, 1958663117, 925738300, 1283408968, 3669349440, 1840910019, 137959847, 2679828185, 1239142320, 1315376211, 1547541505, 1690155329, 739140458, 3128809933, 3933172616, 3876308834, 905091803, 1548541325, 4040461708, 3095483362, 144808038, 451078856, 676114313, 2861728291, 2469707347, 993665471, 373509091, 2599041286, 4025009006, 4170239449, 2149739950, 3275793571, 3749616649, 2794760199, 1534877388, 572371878, 2590613551, 1753320020, 3467782511, 1405125690, 4270405205, 633333386, 3026356924, 3475123903, 632057672, 2846462855, 1404951397, 3882875879, 3915906424, 195638627, 2385783745, 3902872553, 1233155085, 3355999740, 2380578713, 2702246304, 2144565621, 3663341248, 3894384975, 2502479241, 4248018925, 3094885567, 1594115437, 572884632, 3385116731, 767645374, 1331858858, 1475698373, 3793881790, 3532746431, 1321687957, 619889600, 1121017241, 3440213920, 2070816767, 2833025776, 1933951238, 4095615791, 890643334, 3874130214, 859025556, 360630002, 925594799, 1764062180, 3920222280, 4078305929, 979562269, 2810700344, 4087740022, 1949714515, 546639971, 1165388173, 3069891591, 1495988560, 922170659, 1291546247, 2107952832, 1813327274, 3406010024, 3306028637, 4241950635, 153207855, 2313154747, 1608695416, 1150242611, 1967526857, 721801357, 1220138373, 3691287617, 3356069787, 2112743302, 3281662835, 1111556101, 1778980689, 250857638, 2298507990, 673216130, 2846488510, 3207751581, 3562756981, 3008625920, 3417367384, 2198807050, 529510932, 3547516680, 3426503187, 2364944742, 102533054, 2294910856, 1617093527, 1204784762, 3066581635, 1019391227, 1069574518, 1317995090, 1691889997, 3661132003, 510022745, 3238594800, 1362108837, 1817929911, 2184153760, 805817662, 1953603311, 3699844737, 120799444, 2118332377, 207536705, 2282301548, 4120041617, 145305846, 2508124933, 3086745533, 3261524335, 1877257368, 2977164480, 3160454186, 2503252186, 4221677074, 759945014, 254147243, 2767453419, 3801518371, 629083197, 2471014217, 907280572, 3900796746, 940896768, 2751021123, 2625262786, 3161476951, 3661752313, 3260732218, 1425318020, 2977912069, 1496677566, 3988592072, 2140652971, 3126511541, 3069632175, 977771578, 1392695845, 1698528874, 1411812681, 1369733098, 1343739227, 3620887944, 1142123638, 67414216, 3102056737, 3088749194, 1626167401, 2546293654, 3941374235, 697522451, 33404913, 143560186, 2595682037, 994885535, 1247667115, 3859094837, 2699155541, 3547024625, 4114935275, 2968073508, 3199963069, 2732024527, 1237921620, 951448369, 1898488916, 1211705605, 2790989240, 2233243581, 3598044975], a2[6] = [2246066201, 858518887, 1714274303, 3485882003, 713916271, 2879113490, 3730835617, 539548191, 36158695, 1298409750, 419087104, 1358007170, 749914897, 2989680476, 1261868530, 2995193822, 2690628854, 3443622377, 3780124940, 3796824509, 2976433025, 4259637129, 1551479e3, 512490819, 1296650241, 951993153, 2436689437, 2460458047, 144139966, 3136204276, 310820559, 3068840729, 643875328, 1969602020, 1680088954, 2185813161, 3283332454, 672358534, 198762408, 896343282, 276269502, 3014846926, 84060815, 197145886, 376173866, 3943890818, 3813173521, 3545068822, 1316698879, 1598252827, 2633424951, 1233235075, 859989710, 2358460855, 3503838400, 3409603720, 1203513385, 1193654839, 2792018475, 2060853022, 207403770, 1144516871, 3068631394, 1121114134, 177607304, 3785736302, 326409831, 1929119770, 2983279095, 4183308101, 3474579288, 3200513878, 3228482096, 119610148, 1170376745, 3378393471, 3163473169, 951863017, 3337026068, 3135789130, 2907618374, 1183797387, 2015970143, 4045674555, 2182986399, 2952138740, 3928772205, 384012900, 2454997643, 10178499, 2879818989, 2596892536, 111523738, 2995089006, 451689641, 3196290696, 235406569, 1441906262, 3890558523, 3013735005, 4158569349, 1644036924, 376726067, 1006849064, 3664579700, 2041234796, 1021632941, 1374734338, 2566452058, 371631263, 4007144233, 490221539, 206551450, 3140638584, 1053219195, 1853335209, 3412429660, 3562156231, 735133835, 1623211703, 3104214392, 2738312436, 4096837757, 3366392578, 3110964274, 3956598718, 3196820781, 2038037254, 3877786376, 2339753847, 300912036, 3766732888, 2372630639, 1516443558, 4200396704, 1574567987, 4069441456, 4122592016, 2699739776, 146372218, 2748961456, 2043888151, 35287437, 2596680554, 655490400, 1132482787, 110692520, 1031794116, 2188192751, 1324057718, 1217253157, 919197030, 686247489, 3261139658, 1028237775, 3135486431, 3059715558, 2460921700, 986174950, 2661811465, 4062904701, 2752986992, 3709736643, 367056889, 1353824391, 731860949, 1650113154, 1778481506, 784341916, 357075625, 3608602432, 1074092588, 2480052770, 3811426202, 92751289, 877911070, 3600361838, 1231880047, 480201094, 3756190983, 3094495953, 434011822, 87971354, 363687820, 1717726236, 1901380172, 3926403882, 2481662265, 400339184, 1490350766, 2661455099, 1389319756, 2558787174, 784598401, 1983468483, 30828846, 3550527752, 2716276238, 3841122214, 1765724805, 1955612312, 1277890269, 1333098070, 1564029816, 2704417615, 1026694237, 3287671188, 1260819201, 3349086767, 1016692350, 1582273796, 1073413053, 1995943182, 694588404, 1025494639, 3323872702, 3551898420, 4146854327, 453260480, 1316140391, 1435673405, 3038941953, 3486689407, 1622062951, 403978347, 817677117, 950059133, 4246079218, 3278066075, 1486738320, 1417279718, 481875527, 2549965225, 3933690356, 760697757, 1452955855, 3897451437, 1177426808, 1702951038, 4085348628, 2447005172, 1084371187, 3516436277, 3068336338, 1073369276, 1027665953, 3284188590, 1230553676, 1368340146, 2226246512, 267243139, 2274220762, 4070734279, 2497715176, 2423353163, 2504755875], a2[7] = [3793104909, 3151888380, 2817252029, 895778965, 2005530807, 3871412763, 237245952, 86829237, 296341424, 3851759377, 3974600970, 2475086196, 709006108, 1994621201, 2972577594, 937287164, 3734691505, 168608556, 3189338153, 2225080640, 3139713551, 3033610191, 3025041904, 77524477, 185966941, 1208824168, 2344345178, 1721625922, 3354191921, 1066374631, 1927223579, 1971335949, 2483503697, 1551748602, 2881383779, 2856329572, 3003241482, 48746954, 1398218158, 2050065058, 313056748, 4255789917, 393167848, 1912293076, 940740642, 3465845460, 3091687853, 2522601570, 2197016661, 1727764327, 364383054, 492521376, 1291706479, 3264136376, 1474851438, 1685747964, 2575719748, 1619776915, 1814040067, 970743798, 1561002147, 2925768690, 2123093554, 1880132620, 3151188041, 697884420, 2550985770, 2607674513, 2659114323, 110200136, 1489731079, 997519150, 1378877361, 3527870668, 478029773, 2766872923, 1022481122, 431258168, 1112503832, 897933369, 2635587303, 669726182, 3383752315, 918222264, 163866573, 3246985393, 3776823163, 114105080, 1903216136, 761148244, 3571337562, 1690750982, 3166750252, 1037045171, 1888456500, 2010454850, 642736655, 616092351, 365016990, 1185228132, 4174898510, 1043824992, 2023083429, 2241598885, 3863320456, 3279669087, 3674716684, 108438443, 2132974366, 830746235, 606445527, 4173263986, 2204105912, 1844756978, 2532684181, 4245352700, 2969441100, 3796921661, 1335562986, 4061524517, 2720232303, 2679424040, 634407289, 885462008, 3294724487, 3933892248, 2094100220, 339117932, 4048830727, 3202280980, 1458155303, 2689246273, 1022871705, 2464987878, 3714515309, 353796843, 2822958815, 4256850100, 4052777845, 551748367, 618185374, 3778635579, 4020649912, 1904685140, 3069366075, 2670879810, 3407193292, 2954511620, 4058283405, 2219449317, 3135758300, 1120655984, 3447565834, 1474845562, 3577699062, 550456716, 3466908712, 2043752612, 881257467, 869518812, 2005220179, 938474677, 3305539448, 3850417126, 1315485940, 3318264702, 226533026, 965733244, 321539988, 1136104718, 804158748, 573969341, 3708209826, 937399083, 3290727049, 2901666755, 1461057207, 4013193437, 4066861423, 3242773476, 2421326174, 1581322155, 3028952165, 786071460, 3900391652, 3918438532, 1485433313, 4023619836, 3708277595, 3678951060, 953673138, 1467089153, 1930354364, 1533292819, 2492563023, 1346121658, 1685000834, 1965281866, 3765933717, 4190206607, 2052792609, 3515332758, 690371149, 3125873887, 2180283551, 2903598061, 3933952357, 436236910, 289419410, 14314871, 1242357089, 2904507907, 1616633776, 2666382180, 585885352, 3471299210, 2699507360, 1432659641, 277164553, 3354103607, 770115018, 2303809295, 3741942315, 3177781868, 2853364978, 2269453327, 3774259834, 987383833, 1290892879, 225909803, 1741533526, 890078084, 1496906255, 1111072499, 916028167, 243534141, 1252605537, 2204162171, 531204876, 290011180, 3916834213, 102027703, 237315147, 209093447, 1486785922, 220223953, 2758195998, 4175039106, 82940208, 3127791296, 2569425252, 518464269, 1353887104, 3941492737, 2377294467, 3935040926];
}
function De(e2) {
  this.cast5 = new Ke(), this.cast5.setKey(e2), this.encrypt = function(e3) {
    return this.cast5.encrypt(e3);
  };
}
Ce.keySize = Ce.prototype.keySize = 24, Ce.blockSize = Ce.prototype.blockSize = 8, De.blockSize = De.prototype.blockSize = 8, De.keySize = De.prototype.keySize = 16;
const Re = 4294967295;
function Ue(e2, t2) {
  return (e2 << t2 | e2 >>> 32 - t2) & Re;
}
function Ie(e2, t2) {
  return e2[t2] | e2[t2 + 1] << 8 | e2[t2 + 2] << 16 | e2[t2 + 3] << 24;
}
function Be(e2, t2, r2) {
  e2.splice(t2, 4, 255 & r2, r2 >>> 8 & 255, r2 >>> 16 & 255, r2 >>> 24 & 255);
}
function Te(e2, t2) {
  return e2 >>> 8 * t2 & 255;
}
function ze(e2) {
  this.tf = function() {
    let e3 = null, t2 = null, r2 = -1, i2 = [], n2 = [[], [], [], []];
    function a2(e4) {
      return n2[0][Te(e4, 0)] ^ n2[1][Te(e4, 1)] ^ n2[2][Te(e4, 2)] ^ n2[3][Te(e4, 3)];
    }
    function s2(e4) {
      return n2[0][Te(e4, 3)] ^ n2[1][Te(e4, 0)] ^ n2[2][Te(e4, 1)] ^ n2[3][Te(e4, 2)];
    }
    function o2(e4, t3) {
      let r3 = a2(t3[0]), n3 = s2(t3[1]);
      t3[2] = Ue(t3[2] ^ r3 + n3 + i2[4 * e4 + 8] & Re, 31), t3[3] = Ue(t3[3], 1) ^ r3 + 2 * n3 + i2[4 * e4 + 9] & Re, r3 = a2(t3[2]), n3 = s2(t3[3]), t3[0] = Ue(t3[0] ^ r3 + n3 + i2[4 * e4 + 10] & Re, 31), t3[1] = Ue(t3[1], 1) ^ r3 + 2 * n3 + i2[4 * e4 + 11] & Re;
    }
    function c2(e4, t3) {
      let r3 = a2(t3[0]), n3 = s2(t3[1]);
      t3[2] = Ue(t3[2], 1) ^ r3 + n3 + i2[4 * e4 + 10] & Re, t3[3] = Ue(t3[3] ^ r3 + 2 * n3 + i2[4 * e4 + 11] & Re, 31), r3 = a2(t3[2]), n3 = s2(t3[3]), t3[0] = Ue(t3[0], 1) ^ r3 + n3 + i2[4 * e4 + 8] & Re, t3[1] = Ue(t3[1] ^ r3 + 2 * n3 + i2[4 * e4 + 9] & Re, 31);
    }
    return {name: "twofish", blocksize: 16, open: function(t3) {
      let r3, a3, s3, o3, c3;
      e3 = t3;
      const u2 = [], h2 = [], f2 = [];
      let d2;
      const l2 = [];
      let p2, y2, b2;
      const m2 = [[8, 1, 7, 13, 6, 15, 3, 2, 0, 11, 5, 9, 14, 12, 10, 4], [2, 8, 11, 13, 15, 7, 6, 14, 3, 1, 9, 4, 0, 10, 12, 5]], g2 = [[14, 12, 11, 8, 1, 2, 3, 5, 15, 4, 10, 6, 7, 0, 9, 13], [1, 14, 2, 11, 4, 12, 3, 7, 6, 13, 10, 5, 15, 9, 0, 8]], w2 = [[11, 10, 5, 14, 6, 13, 9, 0, 12, 8, 15, 3, 2, 4, 7, 1], [4, 12, 7, 5, 1, 6, 9, 10, 0, 14, 13, 8, 2, 11, 3, 15]], v2 = [[13, 7, 15, 4, 1, 2, 6, 14, 9, 11, 3, 0, 8, 5, 12, 10], [11, 9, 5, 1, 12, 3, 13, 14, 6, 4, 7, 15, 2, 0, 8, 10]], _2 = [0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15], k2 = [0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 5, 14, 7], A2 = [[], []], S2 = [[], [], [], []];
      function E2(e4) {
        return e4 ^ e4 >> 2 ^ [0, 90, 180, 238][3 & e4];
      }
      function P2(e4) {
        return e4 ^ e4 >> 1 ^ e4 >> 2 ^ [0, 238, 180, 90][3 & e4];
      }
      function x2(e4, t4) {
        let r4, i3, n3;
        for (r4 = 0; r4 < 8; r4++)
          i3 = t4 >>> 24, t4 = t4 << 8 & Re | e4 >>> 24, e4 = e4 << 8 & Re, n3 = i3 << 1, 128 & i3 && (n3 ^= 333), t4 ^= i3 ^ n3 << 16, n3 ^= i3 >>> 1, 1 & i3 && (n3 ^= 166), t4 ^= n3 << 24 | n3 << 8;
        return t4;
      }
      function M2(e4, t4) {
        const r4 = t4 >> 4, i3 = 15 & t4, n3 = m2[e4][r4 ^ i3], a4 = g2[e4][_2[i3] ^ k2[r4]];
        return v2[e4][_2[a4] ^ k2[n3]] << 4 | w2[e4][n3 ^ a4];
      }
      function C2(e4, t4) {
        let r4 = Te(e4, 0), i3 = Te(e4, 1), n3 = Te(e4, 2), a4 = Te(e4, 3);
        switch (d2) {
          case 4:
            r4 = A2[1][r4] ^ Te(t4[3], 0), i3 = A2[0][i3] ^ Te(t4[3], 1), n3 = A2[0][n3] ^ Te(t4[3], 2), a4 = A2[1][a4] ^ Te(t4[3], 3);
          case 3:
            r4 = A2[1][r4] ^ Te(t4[2], 0), i3 = A2[1][i3] ^ Te(t4[2], 1), n3 = A2[0][n3] ^ Te(t4[2], 2), a4 = A2[0][a4] ^ Te(t4[2], 3);
          case 2:
            r4 = A2[0][A2[0][r4] ^ Te(t4[1], 0)] ^ Te(t4[0], 0), i3 = A2[0][A2[1][i3] ^ Te(t4[1], 1)] ^ Te(t4[0], 1), n3 = A2[1][A2[0][n3] ^ Te(t4[1], 2)] ^ Te(t4[0], 2), a4 = A2[1][A2[1][a4] ^ Te(t4[1], 3)] ^ Te(t4[0], 3);
        }
        return S2[0][r4] ^ S2[1][i3] ^ S2[2][n3] ^ S2[3][a4];
      }
      for (e3 = e3.slice(0, 32), r3 = e3.length; r3 !== 16 && r3 !== 24 && r3 !== 32; )
        e3[r3++] = 0;
      for (r3 = 0; r3 < e3.length; r3 += 4)
        f2[r3 >> 2] = Ie(e3, r3);
      for (r3 = 0; r3 < 256; r3++)
        A2[0][r3] = M2(0, r3), A2[1][r3] = M2(1, r3);
      for (r3 = 0; r3 < 256; r3++)
        p2 = A2[1][r3], y2 = E2(p2), b2 = P2(p2), S2[0][r3] = p2 + (y2 << 8) + (b2 << 16) + (b2 << 24), S2[2][r3] = y2 + (b2 << 8) + (p2 << 16) + (b2 << 24), p2 = A2[0][r3], y2 = E2(p2), b2 = P2(p2), S2[1][r3] = b2 + (b2 << 8) + (y2 << 16) + (p2 << 24), S2[3][r3] = y2 + (p2 << 8) + (b2 << 16) + (y2 << 24);
      for (d2 = f2.length / 2, r3 = 0; r3 < d2; r3++)
        a3 = f2[r3 + r3], u2[r3] = a3, s3 = f2[r3 + r3 + 1], h2[r3] = s3, l2[d2 - r3 - 1] = x2(a3, s3);
      for (r3 = 0; r3 < 40; r3 += 2)
        a3 = 16843009 * r3, s3 = a3 + 16843009, a3 = C2(a3, u2), s3 = Ue(C2(s3, h2), 8), i2[r3] = a3 + s3 & Re, i2[r3 + 1] = Ue(a3 + 2 * s3, 9);
      for (r3 = 0; r3 < 256; r3++)
        switch (a3 = s3 = o3 = c3 = r3, d2) {
          case 4:
            a3 = A2[1][a3] ^ Te(l2[3], 0), s3 = A2[0][s3] ^ Te(l2[3], 1), o3 = A2[0][o3] ^ Te(l2[3], 2), c3 = A2[1][c3] ^ Te(l2[3], 3);
          case 3:
            a3 = A2[1][a3] ^ Te(l2[2], 0), s3 = A2[1][s3] ^ Te(l2[2], 1), o3 = A2[0][o3] ^ Te(l2[2], 2), c3 = A2[0][c3] ^ Te(l2[2], 3);
          case 2:
            n2[0][r3] = S2[0][A2[0][A2[0][a3] ^ Te(l2[1], 0)] ^ Te(l2[0], 0)], n2[1][r3] = S2[1][A2[0][A2[1][s3] ^ Te(l2[1], 1)] ^ Te(l2[0], 1)], n2[2][r3] = S2[2][A2[1][A2[0][o3] ^ Te(l2[1], 2)] ^ Te(l2[0], 2)], n2[3][r3] = S2[3][A2[1][A2[1][c3] ^ Te(l2[1], 3)] ^ Te(l2[0], 3)];
        }
    }, close: function() {
      i2 = [], n2 = [[], [], [], []];
    }, encrypt: function(e4, n3) {
      t2 = e4, r2 = n3;
      const a3 = [Ie(t2, r2) ^ i2[0], Ie(t2, r2 + 4) ^ i2[1], Ie(t2, r2 + 8) ^ i2[2], Ie(t2, r2 + 12) ^ i2[3]];
      for (let e5 = 0; e5 < 8; e5++)
        o2(e5, a3);
      return Be(t2, r2, a3[2] ^ i2[4]), Be(t2, r2 + 4, a3[3] ^ i2[5]), Be(t2, r2 + 8, a3[0] ^ i2[6]), Be(t2, r2 + 12, a3[1] ^ i2[7]), r2 += 16, t2;
    }, decrypt: function(e4, n3) {
      t2 = e4, r2 = n3;
      const a3 = [Ie(t2, r2) ^ i2[4], Ie(t2, r2 + 4) ^ i2[5], Ie(t2, r2 + 8) ^ i2[6], Ie(t2, r2 + 12) ^ i2[7]];
      for (let e5 = 7; e5 >= 0; e5--)
        c2(e5, a3);
      Be(t2, r2, a3[2] ^ i2[0]), Be(t2, r2 + 4, a3[3] ^ i2[1]), Be(t2, r2 + 8, a3[0] ^ i2[2]), Be(t2, r2 + 12, a3[1] ^ i2[3]), r2 += 16;
    }, finalize: function() {
      return t2;
    }};
  }(), this.tf.open(Array.from(e2), 0), this.encrypt = function(e3) {
    return this.tf.encrypt(Array.from(e3), 0);
  };
}
function qe() {
}
function Oe(e2) {
  this.bf = new qe(), this.bf.init(e2), this.encrypt = function(e3) {
    return this.bf.encryptBlock(e3);
  };
}
ze.keySize = ze.prototype.keySize = 32, ze.blockSize = ze.prototype.blockSize = 16, qe.prototype.BLOCKSIZE = 8, qe.prototype.SBOXES = [[3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946], [1266315497, 3048417604, 3681880366, 3289982499, 290971e4, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055], [3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504], [976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409e3, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462]], qe.prototype.PARRAY = [608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731], qe.prototype.NN = 16, qe.prototype._clean = function(e2) {
  if (e2 < 0) {
    e2 = (2147483647 & e2) + 2147483648;
  }
  return e2;
}, qe.prototype._F = function(e2) {
  let t2;
  const r2 = 255 & e2, i2 = 255 & (e2 >>>= 8), n2 = 255 & (e2 >>>= 8), a2 = 255 & (e2 >>>= 8);
  return t2 = this.sboxes[0][a2] + this.sboxes[1][n2], t2 ^= this.sboxes[2][i2], t2 += this.sboxes[3][r2], t2;
}, qe.prototype._encryptBlock = function(e2) {
  let t2, r2 = e2[0], i2 = e2[1];
  for (t2 = 0; t2 < this.NN; ++t2) {
    r2 ^= this.parray[t2], i2 = this._F(r2) ^ i2;
    const e3 = r2;
    r2 = i2, i2 = e3;
  }
  r2 ^= this.parray[this.NN + 0], i2 ^= this.parray[this.NN + 1], e2[0] = this._clean(i2), e2[1] = this._clean(r2);
}, qe.prototype.encryptBlock = function(e2) {
  let t2;
  const r2 = [0, 0], i2 = this.BLOCKSIZE / 2;
  for (t2 = 0; t2 < this.BLOCKSIZE / 2; ++t2)
    r2[0] = r2[0] << 8 | 255 & e2[t2 + 0], r2[1] = r2[1] << 8 | 255 & e2[t2 + i2];
  this._encryptBlock(r2);
  const n2 = [];
  for (t2 = 0; t2 < this.BLOCKSIZE / 2; ++t2)
    n2[t2 + 0] = r2[0] >>> 24 - 8 * t2 & 255, n2[t2 + i2] = r2[1] >>> 24 - 8 * t2 & 255;
  return n2;
}, qe.prototype._decryptBlock = function(e2) {
  let t2, r2 = e2[0], i2 = e2[1];
  for (t2 = this.NN + 1; t2 > 1; --t2) {
    r2 ^= this.parray[t2], i2 = this._F(r2) ^ i2;
    const e3 = r2;
    r2 = i2, i2 = e3;
  }
  r2 ^= this.parray[1], i2 ^= this.parray[0], e2[0] = this._clean(i2), e2[1] = this._clean(r2);
}, qe.prototype.init = function(e2) {
  let t2, r2 = 0;
  for (this.parray = [], t2 = 0; t2 < this.NN + 2; ++t2) {
    let i3 = 0;
    for (let t3 = 0; t3 < 4; ++t3)
      i3 = i3 << 8 | 255 & e2[r2], ++r2 >= e2.length && (r2 = 0);
    this.parray[t2] = this.PARRAY[t2] ^ i3;
  }
  for (this.sboxes = [], t2 = 0; t2 < 4; ++t2)
    for (this.sboxes[t2] = [], r2 = 0; r2 < 256; ++r2)
      this.sboxes[t2][r2] = this.SBOXES[t2][r2];
  const i2 = [0, 0];
  for (t2 = 0; t2 < this.NN + 2; t2 += 2)
    this._encryptBlock(i2), this.parray[t2 + 0] = i2[0], this.parray[t2 + 1] = i2[1];
  for (t2 = 0; t2 < 4; ++t2)
    for (r2 = 0; r2 < 256; r2 += 2)
      this._encryptBlock(i2), this.sboxes[t2][r2 + 0] = i2[0], this.sboxes[t2][r2 + 1] = i2[1];
}, Oe.keySize = Oe.prototype.keySize = 16, Oe.blockSize = Oe.prototype.blockSize = 8;
const Fe = Pe(128), Ne = Pe(192), je = Pe(256);
var Le = /* @__PURE__ */ Object.freeze({__proto__: null, aes128: Fe, aes192: Ne, aes256: je, des: function(e2) {
  this.key = e2, this.encrypt = function(e3, t2) {
    return xe(Me(this.key), e3, true, 0, null, t2);
  }, this.decrypt = function(e3, t2) {
    return xe(Me(this.key), e3, false, 0, null, t2);
  };
}, tripledes: Ce, cast5: De, twofish: ze, blowfish: Oe, idea: function() {
  throw Error("IDEA symmetric-key algorithm not implemented");
}}), We = function(e2, t2, r2) {
  var i2 = 0, n2 = 0, a2 = 0, s2 = 0, o2 = 0, c2 = 0, u2 = 0;
  var h2 = 0, f2 = 0, d2 = 0, l2 = 0, p2 = 0, y2 = 0, b2 = 0, m2 = 0, g2 = 0, w2 = 0;
  var v2 = new e2.Uint8Array(r2);
  function _2(e3, t3, r3, c3, u3, h3, f3, d3, l3, p3, y3, b3, m3, g3, w3, v3) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    r3 = r3 | 0;
    c3 = c3 | 0;
    u3 = u3 | 0;
    h3 = h3 | 0;
    f3 = f3 | 0;
    d3 = d3 | 0;
    l3 = l3 | 0;
    p3 = p3 | 0;
    y3 = y3 | 0;
    b3 = b3 | 0;
    m3 = m3 | 0;
    g3 = g3 | 0;
    w3 = w3 | 0;
    v3 = v3 | 0;
    var _3 = 0, k3 = 0, A3 = 0, S3 = 0, E3 = 0, P3 = 0, x3 = 0, M3 = 0, C3 = 0, K3 = 0, D3 = 0, R3 = 0, U2 = 0, I2 = 0, B2 = 0, T2 = 0, z2 = 0, q2 = 0, O2 = 0, F2 = 0, N2 = 0, j2 = 0, L2 = 0, W2 = 0, H2 = 0, G2 = 0, V2 = 0, $2 = 0, Z2 = 0, Y2 = 0, X2 = 0, Q2 = 0, J2 = 0, ee2 = 0, te2 = 0, re2 = 0, ie2 = 0, ne2 = 0, ae2 = 0, se2 = 0, oe2 = 0, ce2 = 0, ue2 = 0, he2 = 0, fe2 = 0, de2 = 0, le2 = 0, pe2 = 0, ye2 = 0, be2 = 0, me2 = 0, ge2 = 0, we2 = 0, ve2 = 0, _e2 = 0, ke2 = 0, Ae2 = 0, Se2 = 0, Ee2 = 0, Pe2 = 0, xe2 = 0, Me2 = 0, Ce2 = 0, Ke2 = 0, De2 = 0, Re2 = 0, Ue2 = 0, Ie2 = 0, Be2 = 0, Te2 = 0, ze2 = 0;
    _3 = i2;
    k3 = n2;
    A3 = a2;
    S3 = s2;
    E3 = o2;
    x3 = e3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = t3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = r3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = c3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = u3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = h3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = f3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = d3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = l3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = p3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = y3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = b3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = m3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = g3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = w3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    x3 = v3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = g3 ^ l3 ^ r3 ^ e3;
    M3 = P3 << 1 | P3 >>> 31;
    x3 = M3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = w3 ^ p3 ^ c3 ^ t3;
    C3 = P3 << 1 | P3 >>> 31;
    x3 = C3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = v3 ^ y3 ^ u3 ^ r3;
    K3 = P3 << 1 | P3 >>> 31;
    x3 = K3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = M3 ^ b3 ^ h3 ^ c3;
    D3 = P3 << 1 | P3 >>> 31;
    x3 = D3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | ~k3 & S3) + 1518500249 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = C3 ^ m3 ^ f3 ^ u3;
    R3 = P3 << 1 | P3 >>> 31;
    x3 = R3 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = K3 ^ g3 ^ d3 ^ h3;
    U2 = P3 << 1 | P3 >>> 31;
    x3 = U2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = D3 ^ w3 ^ l3 ^ f3;
    I2 = P3 << 1 | P3 >>> 31;
    x3 = I2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = R3 ^ v3 ^ p3 ^ d3;
    B2 = P3 << 1 | P3 >>> 31;
    x3 = B2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = U2 ^ M3 ^ y3 ^ l3;
    T2 = P3 << 1 | P3 >>> 31;
    x3 = T2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = I2 ^ C3 ^ b3 ^ p3;
    z2 = P3 << 1 | P3 >>> 31;
    x3 = z2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = B2 ^ K3 ^ m3 ^ y3;
    q2 = P3 << 1 | P3 >>> 31;
    x3 = q2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = T2 ^ D3 ^ g3 ^ b3;
    O2 = P3 << 1 | P3 >>> 31;
    x3 = O2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = z2 ^ R3 ^ w3 ^ m3;
    F2 = P3 << 1 | P3 >>> 31;
    x3 = F2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = q2 ^ U2 ^ v3 ^ g3;
    N2 = P3 << 1 | P3 >>> 31;
    x3 = N2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = O2 ^ I2 ^ M3 ^ w3;
    j2 = P3 << 1 | P3 >>> 31;
    x3 = j2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = F2 ^ B2 ^ C3 ^ v3;
    L2 = P3 << 1 | P3 >>> 31;
    x3 = L2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = N2 ^ T2 ^ K3 ^ M3;
    W2 = P3 << 1 | P3 >>> 31;
    x3 = W2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = j2 ^ z2 ^ D3 ^ C3;
    H2 = P3 << 1 | P3 >>> 31;
    x3 = H2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = L2 ^ q2 ^ R3 ^ K3;
    G2 = P3 << 1 | P3 >>> 31;
    x3 = G2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = W2 ^ O2 ^ U2 ^ D3;
    V2 = P3 << 1 | P3 >>> 31;
    x3 = V2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = H2 ^ F2 ^ I2 ^ R3;
    $2 = P3 << 1 | P3 >>> 31;
    x3 = $2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = G2 ^ N2 ^ B2 ^ U2;
    Z2 = P3 << 1 | P3 >>> 31;
    x3 = Z2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = V2 ^ j2 ^ T2 ^ I2;
    Y2 = P3 << 1 | P3 >>> 31;
    x3 = Y2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = $2 ^ L2 ^ z2 ^ B2;
    X2 = P3 << 1 | P3 >>> 31;
    x3 = X2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) + 1859775393 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Z2 ^ W2 ^ q2 ^ T2;
    Q2 = P3 << 1 | P3 >>> 31;
    x3 = Q2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Y2 ^ H2 ^ O2 ^ z2;
    J2 = P3 << 1 | P3 >>> 31;
    x3 = J2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = X2 ^ G2 ^ F2 ^ q2;
    ee2 = P3 << 1 | P3 >>> 31;
    x3 = ee2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Q2 ^ V2 ^ N2 ^ O2;
    te2 = P3 << 1 | P3 >>> 31;
    x3 = te2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = J2 ^ $2 ^ j2 ^ F2;
    re2 = P3 << 1 | P3 >>> 31;
    x3 = re2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ee2 ^ Z2 ^ L2 ^ N2;
    ie2 = P3 << 1 | P3 >>> 31;
    x3 = ie2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = te2 ^ Y2 ^ W2 ^ j2;
    ne2 = P3 << 1 | P3 >>> 31;
    x3 = ne2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = re2 ^ X2 ^ H2 ^ L2;
    ae2 = P3 << 1 | P3 >>> 31;
    x3 = ae2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ie2 ^ Q2 ^ G2 ^ W2;
    se2 = P3 << 1 | P3 >>> 31;
    x3 = se2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ne2 ^ J2 ^ V2 ^ H2;
    oe2 = P3 << 1 | P3 >>> 31;
    x3 = oe2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ae2 ^ ee2 ^ $2 ^ G2;
    ce2 = P3 << 1 | P3 >>> 31;
    x3 = ce2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = se2 ^ te2 ^ Z2 ^ V2;
    ue2 = P3 << 1 | P3 >>> 31;
    x3 = ue2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = oe2 ^ re2 ^ Y2 ^ $2;
    he2 = P3 << 1 | P3 >>> 31;
    x3 = he2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ce2 ^ ie2 ^ X2 ^ Z2;
    fe2 = P3 << 1 | P3 >>> 31;
    x3 = fe2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ue2 ^ ne2 ^ Q2 ^ Y2;
    de2 = P3 << 1 | P3 >>> 31;
    x3 = de2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = he2 ^ ae2 ^ J2 ^ X2;
    le2 = P3 << 1 | P3 >>> 31;
    x3 = le2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = fe2 ^ se2 ^ ee2 ^ Q2;
    pe2 = P3 << 1 | P3 >>> 31;
    x3 = pe2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = de2 ^ oe2 ^ te2 ^ J2;
    ye2 = P3 << 1 | P3 >>> 31;
    x3 = ye2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = le2 ^ ce2 ^ re2 ^ ee2;
    be2 = P3 << 1 | P3 >>> 31;
    x3 = be2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = pe2 ^ ue2 ^ ie2 ^ te2;
    me2 = P3 << 1 | P3 >>> 31;
    x3 = me2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 & A3 | k3 & S3 | A3 & S3) - 1894007588 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ye2 ^ he2 ^ ne2 ^ re2;
    ge2 = P3 << 1 | P3 >>> 31;
    x3 = ge2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = be2 ^ fe2 ^ ae2 ^ ie2;
    we2 = P3 << 1 | P3 >>> 31;
    x3 = we2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = me2 ^ de2 ^ se2 ^ ne2;
    ve2 = P3 << 1 | P3 >>> 31;
    x3 = ve2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ge2 ^ le2 ^ oe2 ^ ae2;
    _e2 = P3 << 1 | P3 >>> 31;
    x3 = _e2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = we2 ^ pe2 ^ ce2 ^ se2;
    ke2 = P3 << 1 | P3 >>> 31;
    x3 = ke2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ve2 ^ ye2 ^ ue2 ^ oe2;
    Ae2 = P3 << 1 | P3 >>> 31;
    x3 = Ae2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = _e2 ^ be2 ^ he2 ^ ce2;
    Se2 = P3 << 1 | P3 >>> 31;
    x3 = Se2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = ke2 ^ me2 ^ fe2 ^ ue2;
    Ee2 = P3 << 1 | P3 >>> 31;
    x3 = Ee2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Ae2 ^ ge2 ^ de2 ^ he2;
    Pe2 = P3 << 1 | P3 >>> 31;
    x3 = Pe2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Se2 ^ we2 ^ le2 ^ fe2;
    xe2 = P3 << 1 | P3 >>> 31;
    x3 = xe2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Ee2 ^ ve2 ^ pe2 ^ de2;
    Me2 = P3 << 1 | P3 >>> 31;
    x3 = Me2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Pe2 ^ _e2 ^ ye2 ^ le2;
    Ce2 = P3 << 1 | P3 >>> 31;
    x3 = Ce2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = xe2 ^ ke2 ^ be2 ^ pe2;
    Ke2 = P3 << 1 | P3 >>> 31;
    x3 = Ke2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Me2 ^ Ae2 ^ me2 ^ ye2;
    De2 = P3 << 1 | P3 >>> 31;
    x3 = De2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Ce2 ^ Se2 ^ ge2 ^ be2;
    Re2 = P3 << 1 | P3 >>> 31;
    x3 = Re2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Ke2 ^ Ee2 ^ we2 ^ me2;
    Ue2 = P3 << 1 | P3 >>> 31;
    x3 = Ue2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = De2 ^ Pe2 ^ ve2 ^ ge2;
    Ie2 = P3 << 1 | P3 >>> 31;
    x3 = Ie2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Re2 ^ xe2 ^ _e2 ^ we2;
    Be2 = P3 << 1 | P3 >>> 31;
    x3 = Be2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Ue2 ^ Me2 ^ ke2 ^ ve2;
    Te2 = P3 << 1 | P3 >>> 31;
    x3 = Te2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    P3 = Ie2 ^ Ce2 ^ Ae2 ^ _e2;
    ze2 = P3 << 1 | P3 >>> 31;
    x3 = ze2 + (_3 << 5 | _3 >>> 27) + E3 + (k3 ^ A3 ^ S3) - 899497514 | 0;
    E3 = S3;
    S3 = A3;
    A3 = k3 << 30 | k3 >>> 2;
    k3 = _3;
    _3 = x3;
    i2 = i2 + _3 | 0;
    n2 = n2 + k3 | 0;
    a2 = a2 + A3 | 0;
    s2 = s2 + S3 | 0;
    o2 = o2 + E3 | 0;
  }
  function k2(e3) {
    e3 = e3 | 0;
    _2(v2[e3 | 0] << 24 | v2[e3 | 1] << 16 | v2[e3 | 2] << 8 | v2[e3 | 3], v2[e3 | 4] << 24 | v2[e3 | 5] << 16 | v2[e3 | 6] << 8 | v2[e3 | 7], v2[e3 | 8] << 24 | v2[e3 | 9] << 16 | v2[e3 | 10] << 8 | v2[e3 | 11], v2[e3 | 12] << 24 | v2[e3 | 13] << 16 | v2[e3 | 14] << 8 | v2[e3 | 15], v2[e3 | 16] << 24 | v2[e3 | 17] << 16 | v2[e3 | 18] << 8 | v2[e3 | 19], v2[e3 | 20] << 24 | v2[e3 | 21] << 16 | v2[e3 | 22] << 8 | v2[e3 | 23], v2[e3 | 24] << 24 | v2[e3 | 25] << 16 | v2[e3 | 26] << 8 | v2[e3 | 27], v2[e3 | 28] << 24 | v2[e3 | 29] << 16 | v2[e3 | 30] << 8 | v2[e3 | 31], v2[e3 | 32] << 24 | v2[e3 | 33] << 16 | v2[e3 | 34] << 8 | v2[e3 | 35], v2[e3 | 36] << 24 | v2[e3 | 37] << 16 | v2[e3 | 38] << 8 | v2[e3 | 39], v2[e3 | 40] << 24 | v2[e3 | 41] << 16 | v2[e3 | 42] << 8 | v2[e3 | 43], v2[e3 | 44] << 24 | v2[e3 | 45] << 16 | v2[e3 | 46] << 8 | v2[e3 | 47], v2[e3 | 48] << 24 | v2[e3 | 49] << 16 | v2[e3 | 50] << 8 | v2[e3 | 51], v2[e3 | 52] << 24 | v2[e3 | 53] << 16 | v2[e3 | 54] << 8 | v2[e3 | 55], v2[e3 | 56] << 24 | v2[e3 | 57] << 16 | v2[e3 | 58] << 8 | v2[e3 | 59], v2[e3 | 60] << 24 | v2[e3 | 61] << 16 | v2[e3 | 62] << 8 | v2[e3 | 63]);
  }
  function A2(e3) {
    e3 = e3 | 0;
    v2[e3 | 0] = i2 >>> 24;
    v2[e3 | 1] = i2 >>> 16 & 255;
    v2[e3 | 2] = i2 >>> 8 & 255;
    v2[e3 | 3] = i2 & 255;
    v2[e3 | 4] = n2 >>> 24;
    v2[e3 | 5] = n2 >>> 16 & 255;
    v2[e3 | 6] = n2 >>> 8 & 255;
    v2[e3 | 7] = n2 & 255;
    v2[e3 | 8] = a2 >>> 24;
    v2[e3 | 9] = a2 >>> 16 & 255;
    v2[e3 | 10] = a2 >>> 8 & 255;
    v2[e3 | 11] = a2 & 255;
    v2[e3 | 12] = s2 >>> 24;
    v2[e3 | 13] = s2 >>> 16 & 255;
    v2[e3 | 14] = s2 >>> 8 & 255;
    v2[e3 | 15] = s2 & 255;
    v2[e3 | 16] = o2 >>> 24;
    v2[e3 | 17] = o2 >>> 16 & 255;
    v2[e3 | 18] = o2 >>> 8 & 255;
    v2[e3 | 19] = o2 & 255;
  }
  function S2() {
    i2 = 1732584193;
    n2 = 4023233417;
    a2 = 2562383102;
    s2 = 271733878;
    o2 = 3285377520;
    c2 = u2 = 0;
  }
  function E2(e3, t3, r3, h3, f3, d3, l3) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    r3 = r3 | 0;
    h3 = h3 | 0;
    f3 = f3 | 0;
    d3 = d3 | 0;
    l3 = l3 | 0;
    i2 = e3;
    n2 = t3;
    a2 = r3;
    s2 = h3;
    o2 = f3;
    c2 = d3;
    u2 = l3;
  }
  function P2(e3, t3) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    var r3 = 0;
    if (e3 & 63)
      return -1;
    while ((t3 | 0) >= 64) {
      k2(e3);
      e3 = e3 + 64 | 0;
      t3 = t3 - 64 | 0;
      r3 = r3 + 64 | 0;
    }
    c2 = c2 + r3 | 0;
    if (c2 >>> 0 < r3 >>> 0)
      u2 = u2 + 1 | 0;
    return r3 | 0;
  }
  function x2(e3, t3, r3) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    r3 = r3 | 0;
    var i3 = 0, n3 = 0;
    if (e3 & 63)
      return -1;
    if (~r3) {
      if (r3 & 31)
        return -1;
    }
    if ((t3 | 0) >= 64) {
      i3 = P2(e3, t3) | 0;
      if ((i3 | 0) == -1)
        return -1;
      e3 = e3 + i3 | 0;
      t3 = t3 - i3 | 0;
    }
    i3 = i3 + t3 | 0;
    c2 = c2 + t3 | 0;
    if (c2 >>> 0 < t3 >>> 0)
      u2 = u2 + 1 | 0;
    v2[e3 | t3] = 128;
    if ((t3 | 0) >= 56) {
      for (n3 = t3 + 1 | 0; (n3 | 0) < 64; n3 = n3 + 1 | 0)
        v2[e3 | n3] = 0;
      k2(e3);
      t3 = 0;
      v2[e3 | 0] = 0;
    }
    for (n3 = t3 + 1 | 0; (n3 | 0) < 59; n3 = n3 + 1 | 0)
      v2[e3 | n3] = 0;
    v2[e3 | 56] = u2 >>> 21 & 255;
    v2[e3 | 57] = u2 >>> 13 & 255;
    v2[e3 | 58] = u2 >>> 5 & 255;
    v2[e3 | 59] = u2 << 3 & 255 | c2 >>> 29;
    v2[e3 | 60] = c2 >>> 21 & 255;
    v2[e3 | 61] = c2 >>> 13 & 255;
    v2[e3 | 62] = c2 >>> 5 & 255;
    v2[e3 | 63] = c2 << 3 & 255;
    k2(e3);
    if (~r3)
      A2(r3);
    return i3 | 0;
  }
  function M2() {
    i2 = h2;
    n2 = f2;
    a2 = d2;
    s2 = l2;
    o2 = p2;
    c2 = 64;
    u2 = 0;
  }
  function C2() {
    i2 = y2;
    n2 = b2;
    a2 = m2;
    s2 = g2;
    o2 = w2;
    c2 = 64;
    u2 = 0;
  }
  function K2(e3, t3, r3, v3, k3, A3, E3, P3, x3, M3, C3, K3, D3, R3, U2, I2) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    r3 = r3 | 0;
    v3 = v3 | 0;
    k3 = k3 | 0;
    A3 = A3 | 0;
    E3 = E3 | 0;
    P3 = P3 | 0;
    x3 = x3 | 0;
    M3 = M3 | 0;
    C3 = C3 | 0;
    K3 = K3 | 0;
    D3 = D3 | 0;
    R3 = R3 | 0;
    U2 = U2 | 0;
    I2 = I2 | 0;
    S2();
    _2(e3 ^ 1549556828, t3 ^ 1549556828, r3 ^ 1549556828, v3 ^ 1549556828, k3 ^ 1549556828, A3 ^ 1549556828, E3 ^ 1549556828, P3 ^ 1549556828, x3 ^ 1549556828, M3 ^ 1549556828, C3 ^ 1549556828, K3 ^ 1549556828, D3 ^ 1549556828, R3 ^ 1549556828, U2 ^ 1549556828, I2 ^ 1549556828);
    y2 = i2;
    b2 = n2;
    m2 = a2;
    g2 = s2;
    w2 = o2;
    S2();
    _2(e3 ^ 909522486, t3 ^ 909522486, r3 ^ 909522486, v3 ^ 909522486, k3 ^ 909522486, A3 ^ 909522486, E3 ^ 909522486, P3 ^ 909522486, x3 ^ 909522486, M3 ^ 909522486, C3 ^ 909522486, K3 ^ 909522486, D3 ^ 909522486, R3 ^ 909522486, U2 ^ 909522486, I2 ^ 909522486);
    h2 = i2;
    f2 = n2;
    d2 = a2;
    l2 = s2;
    p2 = o2;
    c2 = 64;
    u2 = 0;
  }
  function D2(e3, t3, r3) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    r3 = r3 | 0;
    var c3 = 0, u3 = 0, h3 = 0, f3 = 0, d3 = 0, l3 = 0;
    if (e3 & 63)
      return -1;
    if (~r3) {
      if (r3 & 31)
        return -1;
    }
    l3 = x2(e3, t3, -1) | 0;
    c3 = i2, u3 = n2, h3 = a2, f3 = s2, d3 = o2;
    C2();
    _2(c3, u3, h3, f3, d3, 2147483648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 672);
    if (~r3)
      A2(r3);
    return l3 | 0;
  }
  function R2(e3, t3, r3, c3, u3) {
    e3 = e3 | 0;
    t3 = t3 | 0;
    r3 = r3 | 0;
    c3 = c3 | 0;
    u3 = u3 | 0;
    var h3 = 0, f3 = 0, d3 = 0, l3 = 0, p3 = 0, y3 = 0, b3 = 0, m3 = 0, g3 = 0, w3 = 0;
    if (e3 & 63)
      return -1;
    if (~u3) {
      if (u3 & 31)
        return -1;
    }
    v2[e3 + t3 | 0] = r3 >>> 24;
    v2[e3 + t3 + 1 | 0] = r3 >>> 16 & 255;
    v2[e3 + t3 + 2 | 0] = r3 >>> 8 & 255;
    v2[e3 + t3 + 3 | 0] = r3 & 255;
    D2(e3, t3 + 4 | 0, -1) | 0;
    h3 = y3 = i2, f3 = b3 = n2, d3 = m3 = a2, l3 = g3 = s2, p3 = w3 = o2;
    c3 = c3 - 1 | 0;
    while ((c3 | 0) > 0) {
      M2();
      _2(y3, b3, m3, g3, w3, 2147483648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 672);
      y3 = i2, b3 = n2, m3 = a2, g3 = s2, w3 = o2;
      C2();
      _2(y3, b3, m3, g3, w3, 2147483648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 672);
      y3 = i2, b3 = n2, m3 = a2, g3 = s2, w3 = o2;
      h3 = h3 ^ i2;
      f3 = f3 ^ n2;
      d3 = d3 ^ a2;
      l3 = l3 ^ s2;
      p3 = p3 ^ o2;
      c3 = c3 - 1 | 0;
    }
    i2 = h3;
    n2 = f3;
    a2 = d3;
    s2 = l3;
    o2 = p3;
    if (~u3)
      A2(u3);
    return 0;
  }
  return {reset: S2, init: E2, process: P2, finish: x2, hmac_reset: M2, hmac_init: K2, hmac_finish: D2, pbkdf2_generate_block: R2};
};
class He {
  constructor() {
    this.pos = 0, this.len = 0;
  }
  reset() {
    const {asm: e2} = this.acquire_asm();
    return this.result = null, this.pos = 0, this.len = 0, e2.reset(), this;
  }
  process(e2) {
    if (this.result !== null)
      throw new we("state must be reset before processing new data");
    const {asm: t2, heap: r2} = this.acquire_asm();
    let i2 = this.pos, n2 = this.len, a2 = 0, s2 = e2.length, o2 = 0;
    for (; s2 > 0; )
      o2 = me(r2, i2 + n2, e2, a2, s2), n2 += o2, a2 += o2, s2 -= o2, o2 = t2.process(i2, n2), i2 += o2, n2 -= o2, n2 || (i2 = 0);
    return this.pos = i2, this.len = n2, this;
  }
  finish() {
    if (this.result !== null)
      throw new we("state must be reset before processing new data");
    const {asm: e2, heap: t2} = this.acquire_asm();
    return e2.finish(this.pos, this.len, 0), this.result = new Uint8Array(this.HASH_SIZE), this.result.set(t2.subarray(0, this.HASH_SIZE)), this.pos = 0, this.len = 0, this.release_asm(), this;
  }
}
const Ge = [], Ve = [];
class $e extends He {
  constructor() {
    super(), this.NAME = "sha1", this.BLOCK_SIZE = 64, this.HASH_SIZE = 20, this.acquire_asm();
  }
  acquire_asm() {
    return this.heap !== void 0 && this.asm !== void 0 || (this.heap = Ge.pop() || be(), this.asm = Ve.pop() || We({Uint8Array}, null, this.heap.buffer), this.reset()), {heap: this.heap, asm: this.asm};
  }
  release_asm() {
    this.heap !== void 0 && this.asm !== void 0 && (Ge.push(this.heap), Ve.push(this.asm)), this.heap = void 0, this.asm = void 0;
  }
  static bytes(e2) {
    return new $e().process(e2).finish().result;
  }
}
$e.NAME = "sha1", $e.heap_pool = [], $e.asm_pool = [], $e.asm_function = We;
const Ze = [], Ye = [];
class Xe extends He {
  constructor() {
    super(), this.NAME = "sha256", this.BLOCK_SIZE = 64, this.HASH_SIZE = 32, this.acquire_asm();
  }
  acquire_asm() {
    return this.heap !== void 0 && this.asm !== void 0 || (this.heap = Ze.pop() || be(), this.asm = Ye.pop() || function(e2, t2, r2) {
      var i2 = 0, n2 = 0, a2 = 0, s2 = 0, o2 = 0, c2 = 0, u2 = 0, h2 = 0, f2 = 0, d2 = 0, l2 = 0, p2 = 0, y2 = 0, b2 = 0, m2 = 0, g2 = 0, w2 = 0, v2 = 0, _2 = 0, k2 = 0, A2 = 0, S2 = 0, E2 = 0, P2 = 0, x2 = 0, M2 = 0, C2 = new e2.Uint8Array(r2);
      function K2(e3, t3, r3, f3, d3, l3, p3, y3, b3, m3, g3, w3, v3, _3, k3, A3) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        r3 = r3 | 0;
        f3 = f3 | 0;
        d3 = d3 | 0;
        l3 = l3 | 0;
        p3 = p3 | 0;
        y3 = y3 | 0;
        b3 = b3 | 0;
        m3 = m3 | 0;
        g3 = g3 | 0;
        w3 = w3 | 0;
        v3 = v3 | 0;
        _3 = _3 | 0;
        k3 = k3 | 0;
        A3 = A3 | 0;
        var S3 = 0, E3 = 0, P3 = 0, x3 = 0, M3 = 0, C3 = 0, K3 = 0, D3 = 0;
        S3 = i2;
        E3 = n2;
        P3 = a2;
        x3 = s2;
        M3 = o2;
        C3 = c2;
        K3 = u2;
        D3 = h2;
        D3 = e3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 1116352408 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        K3 = t3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 1899447441 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        C3 = r3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 3049323471 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        M3 = f3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 3921009573 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        x3 = d3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 961987163 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        P3 = l3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 1508970993 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        E3 = p3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 2453635748 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        S3 = y3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 2870763221 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        D3 = b3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 3624381080 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        K3 = m3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 310598401 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        C3 = g3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 607225278 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        M3 = w3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 1426881987 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        x3 = v3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 1925078388 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        P3 = _3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 2162078206 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        E3 = k3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 2614888103 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        S3 = A3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 3248222580 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        e3 = (t3 >>> 7 ^ t3 >>> 18 ^ t3 >>> 3 ^ t3 << 25 ^ t3 << 14) + (k3 >>> 17 ^ k3 >>> 19 ^ k3 >>> 10 ^ k3 << 15 ^ k3 << 13) + e3 + m3 | 0;
        D3 = e3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 3835390401 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        t3 = (r3 >>> 7 ^ r3 >>> 18 ^ r3 >>> 3 ^ r3 << 25 ^ r3 << 14) + (A3 >>> 17 ^ A3 >>> 19 ^ A3 >>> 10 ^ A3 << 15 ^ A3 << 13) + t3 + g3 | 0;
        K3 = t3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 4022224774 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        r3 = (f3 >>> 7 ^ f3 >>> 18 ^ f3 >>> 3 ^ f3 << 25 ^ f3 << 14) + (e3 >>> 17 ^ e3 >>> 19 ^ e3 >>> 10 ^ e3 << 15 ^ e3 << 13) + r3 + w3 | 0;
        C3 = r3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 264347078 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        f3 = (d3 >>> 7 ^ d3 >>> 18 ^ d3 >>> 3 ^ d3 << 25 ^ d3 << 14) + (t3 >>> 17 ^ t3 >>> 19 ^ t3 >>> 10 ^ t3 << 15 ^ t3 << 13) + f3 + v3 | 0;
        M3 = f3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 604807628 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        d3 = (l3 >>> 7 ^ l3 >>> 18 ^ l3 >>> 3 ^ l3 << 25 ^ l3 << 14) + (r3 >>> 17 ^ r3 >>> 19 ^ r3 >>> 10 ^ r3 << 15 ^ r3 << 13) + d3 + _3 | 0;
        x3 = d3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 770255983 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        l3 = (p3 >>> 7 ^ p3 >>> 18 ^ p3 >>> 3 ^ p3 << 25 ^ p3 << 14) + (f3 >>> 17 ^ f3 >>> 19 ^ f3 >>> 10 ^ f3 << 15 ^ f3 << 13) + l3 + k3 | 0;
        P3 = l3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 1249150122 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        p3 = (y3 >>> 7 ^ y3 >>> 18 ^ y3 >>> 3 ^ y3 << 25 ^ y3 << 14) + (d3 >>> 17 ^ d3 >>> 19 ^ d3 >>> 10 ^ d3 << 15 ^ d3 << 13) + p3 + A3 | 0;
        E3 = p3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 1555081692 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        y3 = (b3 >>> 7 ^ b3 >>> 18 ^ b3 >>> 3 ^ b3 << 25 ^ b3 << 14) + (l3 >>> 17 ^ l3 >>> 19 ^ l3 >>> 10 ^ l3 << 15 ^ l3 << 13) + y3 + e3 | 0;
        S3 = y3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 1996064986 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        b3 = (m3 >>> 7 ^ m3 >>> 18 ^ m3 >>> 3 ^ m3 << 25 ^ m3 << 14) + (p3 >>> 17 ^ p3 >>> 19 ^ p3 >>> 10 ^ p3 << 15 ^ p3 << 13) + b3 + t3 | 0;
        D3 = b3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 2554220882 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        m3 = (g3 >>> 7 ^ g3 >>> 18 ^ g3 >>> 3 ^ g3 << 25 ^ g3 << 14) + (y3 >>> 17 ^ y3 >>> 19 ^ y3 >>> 10 ^ y3 << 15 ^ y3 << 13) + m3 + r3 | 0;
        K3 = m3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 2821834349 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        g3 = (w3 >>> 7 ^ w3 >>> 18 ^ w3 >>> 3 ^ w3 << 25 ^ w3 << 14) + (b3 >>> 17 ^ b3 >>> 19 ^ b3 >>> 10 ^ b3 << 15 ^ b3 << 13) + g3 + f3 | 0;
        C3 = g3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 2952996808 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        w3 = (v3 >>> 7 ^ v3 >>> 18 ^ v3 >>> 3 ^ v3 << 25 ^ v3 << 14) + (m3 >>> 17 ^ m3 >>> 19 ^ m3 >>> 10 ^ m3 << 15 ^ m3 << 13) + w3 + d3 | 0;
        M3 = w3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 3210313671 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        v3 = (_3 >>> 7 ^ _3 >>> 18 ^ _3 >>> 3 ^ _3 << 25 ^ _3 << 14) + (g3 >>> 17 ^ g3 >>> 19 ^ g3 >>> 10 ^ g3 << 15 ^ g3 << 13) + v3 + l3 | 0;
        x3 = v3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 3336571891 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        _3 = (k3 >>> 7 ^ k3 >>> 18 ^ k3 >>> 3 ^ k3 << 25 ^ k3 << 14) + (w3 >>> 17 ^ w3 >>> 19 ^ w3 >>> 10 ^ w3 << 15 ^ w3 << 13) + _3 + p3 | 0;
        P3 = _3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 3584528711 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        k3 = (A3 >>> 7 ^ A3 >>> 18 ^ A3 >>> 3 ^ A3 << 25 ^ A3 << 14) + (v3 >>> 17 ^ v3 >>> 19 ^ v3 >>> 10 ^ v3 << 15 ^ v3 << 13) + k3 + y3 | 0;
        E3 = k3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 113926993 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        A3 = (e3 >>> 7 ^ e3 >>> 18 ^ e3 >>> 3 ^ e3 << 25 ^ e3 << 14) + (_3 >>> 17 ^ _3 >>> 19 ^ _3 >>> 10 ^ _3 << 15 ^ _3 << 13) + A3 + b3 | 0;
        S3 = A3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 338241895 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        e3 = (t3 >>> 7 ^ t3 >>> 18 ^ t3 >>> 3 ^ t3 << 25 ^ t3 << 14) + (k3 >>> 17 ^ k3 >>> 19 ^ k3 >>> 10 ^ k3 << 15 ^ k3 << 13) + e3 + m3 | 0;
        D3 = e3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 666307205 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        t3 = (r3 >>> 7 ^ r3 >>> 18 ^ r3 >>> 3 ^ r3 << 25 ^ r3 << 14) + (A3 >>> 17 ^ A3 >>> 19 ^ A3 >>> 10 ^ A3 << 15 ^ A3 << 13) + t3 + g3 | 0;
        K3 = t3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 773529912 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        r3 = (f3 >>> 7 ^ f3 >>> 18 ^ f3 >>> 3 ^ f3 << 25 ^ f3 << 14) + (e3 >>> 17 ^ e3 >>> 19 ^ e3 >>> 10 ^ e3 << 15 ^ e3 << 13) + r3 + w3 | 0;
        C3 = r3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 1294757372 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        f3 = (d3 >>> 7 ^ d3 >>> 18 ^ d3 >>> 3 ^ d3 << 25 ^ d3 << 14) + (t3 >>> 17 ^ t3 >>> 19 ^ t3 >>> 10 ^ t3 << 15 ^ t3 << 13) + f3 + v3 | 0;
        M3 = f3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 1396182291 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        d3 = (l3 >>> 7 ^ l3 >>> 18 ^ l3 >>> 3 ^ l3 << 25 ^ l3 << 14) + (r3 >>> 17 ^ r3 >>> 19 ^ r3 >>> 10 ^ r3 << 15 ^ r3 << 13) + d3 + _3 | 0;
        x3 = d3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 1695183700 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        l3 = (p3 >>> 7 ^ p3 >>> 18 ^ p3 >>> 3 ^ p3 << 25 ^ p3 << 14) + (f3 >>> 17 ^ f3 >>> 19 ^ f3 >>> 10 ^ f3 << 15 ^ f3 << 13) + l3 + k3 | 0;
        P3 = l3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 1986661051 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        p3 = (y3 >>> 7 ^ y3 >>> 18 ^ y3 >>> 3 ^ y3 << 25 ^ y3 << 14) + (d3 >>> 17 ^ d3 >>> 19 ^ d3 >>> 10 ^ d3 << 15 ^ d3 << 13) + p3 + A3 | 0;
        E3 = p3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 2177026350 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        y3 = (b3 >>> 7 ^ b3 >>> 18 ^ b3 >>> 3 ^ b3 << 25 ^ b3 << 14) + (l3 >>> 17 ^ l3 >>> 19 ^ l3 >>> 10 ^ l3 << 15 ^ l3 << 13) + y3 + e3 | 0;
        S3 = y3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 2456956037 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        b3 = (m3 >>> 7 ^ m3 >>> 18 ^ m3 >>> 3 ^ m3 << 25 ^ m3 << 14) + (p3 >>> 17 ^ p3 >>> 19 ^ p3 >>> 10 ^ p3 << 15 ^ p3 << 13) + b3 + t3 | 0;
        D3 = b3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 2730485921 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        m3 = (g3 >>> 7 ^ g3 >>> 18 ^ g3 >>> 3 ^ g3 << 25 ^ g3 << 14) + (y3 >>> 17 ^ y3 >>> 19 ^ y3 >>> 10 ^ y3 << 15 ^ y3 << 13) + m3 + r3 | 0;
        K3 = m3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 2820302411 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        g3 = (w3 >>> 7 ^ w3 >>> 18 ^ w3 >>> 3 ^ w3 << 25 ^ w3 << 14) + (b3 >>> 17 ^ b3 >>> 19 ^ b3 >>> 10 ^ b3 << 15 ^ b3 << 13) + g3 + f3 | 0;
        C3 = g3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 3259730800 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        w3 = (v3 >>> 7 ^ v3 >>> 18 ^ v3 >>> 3 ^ v3 << 25 ^ v3 << 14) + (m3 >>> 17 ^ m3 >>> 19 ^ m3 >>> 10 ^ m3 << 15 ^ m3 << 13) + w3 + d3 | 0;
        M3 = w3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 3345764771 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        v3 = (_3 >>> 7 ^ _3 >>> 18 ^ _3 >>> 3 ^ _3 << 25 ^ _3 << 14) + (g3 >>> 17 ^ g3 >>> 19 ^ g3 >>> 10 ^ g3 << 15 ^ g3 << 13) + v3 + l3 | 0;
        x3 = v3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 3516065817 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        _3 = (k3 >>> 7 ^ k3 >>> 18 ^ k3 >>> 3 ^ k3 << 25 ^ k3 << 14) + (w3 >>> 17 ^ w3 >>> 19 ^ w3 >>> 10 ^ w3 << 15 ^ w3 << 13) + _3 + p3 | 0;
        P3 = _3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 3600352804 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        k3 = (A3 >>> 7 ^ A3 >>> 18 ^ A3 >>> 3 ^ A3 << 25 ^ A3 << 14) + (v3 >>> 17 ^ v3 >>> 19 ^ v3 >>> 10 ^ v3 << 15 ^ v3 << 13) + k3 + y3 | 0;
        E3 = k3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 4094571909 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        A3 = (e3 >>> 7 ^ e3 >>> 18 ^ e3 >>> 3 ^ e3 << 25 ^ e3 << 14) + (_3 >>> 17 ^ _3 >>> 19 ^ _3 >>> 10 ^ _3 << 15 ^ _3 << 13) + A3 + b3 | 0;
        S3 = A3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 275423344 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        e3 = (t3 >>> 7 ^ t3 >>> 18 ^ t3 >>> 3 ^ t3 << 25 ^ t3 << 14) + (k3 >>> 17 ^ k3 >>> 19 ^ k3 >>> 10 ^ k3 << 15 ^ k3 << 13) + e3 + m3 | 0;
        D3 = e3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 430227734 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        t3 = (r3 >>> 7 ^ r3 >>> 18 ^ r3 >>> 3 ^ r3 << 25 ^ r3 << 14) + (A3 >>> 17 ^ A3 >>> 19 ^ A3 >>> 10 ^ A3 << 15 ^ A3 << 13) + t3 + g3 | 0;
        K3 = t3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 506948616 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        r3 = (f3 >>> 7 ^ f3 >>> 18 ^ f3 >>> 3 ^ f3 << 25 ^ f3 << 14) + (e3 >>> 17 ^ e3 >>> 19 ^ e3 >>> 10 ^ e3 << 15 ^ e3 << 13) + r3 + w3 | 0;
        C3 = r3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 659060556 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        f3 = (d3 >>> 7 ^ d3 >>> 18 ^ d3 >>> 3 ^ d3 << 25 ^ d3 << 14) + (t3 >>> 17 ^ t3 >>> 19 ^ t3 >>> 10 ^ t3 << 15 ^ t3 << 13) + f3 + v3 | 0;
        M3 = f3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 883997877 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        d3 = (l3 >>> 7 ^ l3 >>> 18 ^ l3 >>> 3 ^ l3 << 25 ^ l3 << 14) + (r3 >>> 17 ^ r3 >>> 19 ^ r3 >>> 10 ^ r3 << 15 ^ r3 << 13) + d3 + _3 | 0;
        x3 = d3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 958139571 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        l3 = (p3 >>> 7 ^ p3 >>> 18 ^ p3 >>> 3 ^ p3 << 25 ^ p3 << 14) + (f3 >>> 17 ^ f3 >>> 19 ^ f3 >>> 10 ^ f3 << 15 ^ f3 << 13) + l3 + k3 | 0;
        P3 = l3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 1322822218 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        p3 = (y3 >>> 7 ^ y3 >>> 18 ^ y3 >>> 3 ^ y3 << 25 ^ y3 << 14) + (d3 >>> 17 ^ d3 >>> 19 ^ d3 >>> 10 ^ d3 << 15 ^ d3 << 13) + p3 + A3 | 0;
        E3 = p3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 1537002063 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        y3 = (b3 >>> 7 ^ b3 >>> 18 ^ b3 >>> 3 ^ b3 << 25 ^ b3 << 14) + (l3 >>> 17 ^ l3 >>> 19 ^ l3 >>> 10 ^ l3 << 15 ^ l3 << 13) + y3 + e3 | 0;
        S3 = y3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 1747873779 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        b3 = (m3 >>> 7 ^ m3 >>> 18 ^ m3 >>> 3 ^ m3 << 25 ^ m3 << 14) + (p3 >>> 17 ^ p3 >>> 19 ^ p3 >>> 10 ^ p3 << 15 ^ p3 << 13) + b3 + t3 | 0;
        D3 = b3 + D3 + (M3 >>> 6 ^ M3 >>> 11 ^ M3 >>> 25 ^ M3 << 26 ^ M3 << 21 ^ M3 << 7) + (K3 ^ M3 & (C3 ^ K3)) + 1955562222 | 0;
        x3 = x3 + D3 | 0;
        D3 = D3 + (S3 & E3 ^ P3 & (S3 ^ E3)) + (S3 >>> 2 ^ S3 >>> 13 ^ S3 >>> 22 ^ S3 << 30 ^ S3 << 19 ^ S3 << 10) | 0;
        m3 = (g3 >>> 7 ^ g3 >>> 18 ^ g3 >>> 3 ^ g3 << 25 ^ g3 << 14) + (y3 >>> 17 ^ y3 >>> 19 ^ y3 >>> 10 ^ y3 << 15 ^ y3 << 13) + m3 + r3 | 0;
        K3 = m3 + K3 + (x3 >>> 6 ^ x3 >>> 11 ^ x3 >>> 25 ^ x3 << 26 ^ x3 << 21 ^ x3 << 7) + (C3 ^ x3 & (M3 ^ C3)) + 2024104815 | 0;
        P3 = P3 + K3 | 0;
        K3 = K3 + (D3 & S3 ^ E3 & (D3 ^ S3)) + (D3 >>> 2 ^ D3 >>> 13 ^ D3 >>> 22 ^ D3 << 30 ^ D3 << 19 ^ D3 << 10) | 0;
        g3 = (w3 >>> 7 ^ w3 >>> 18 ^ w3 >>> 3 ^ w3 << 25 ^ w3 << 14) + (b3 >>> 17 ^ b3 >>> 19 ^ b3 >>> 10 ^ b3 << 15 ^ b3 << 13) + g3 + f3 | 0;
        C3 = g3 + C3 + (P3 >>> 6 ^ P3 >>> 11 ^ P3 >>> 25 ^ P3 << 26 ^ P3 << 21 ^ P3 << 7) + (M3 ^ P3 & (x3 ^ M3)) + 2227730452 | 0;
        E3 = E3 + C3 | 0;
        C3 = C3 + (K3 & D3 ^ S3 & (K3 ^ D3)) + (K3 >>> 2 ^ K3 >>> 13 ^ K3 >>> 22 ^ K3 << 30 ^ K3 << 19 ^ K3 << 10) | 0;
        w3 = (v3 >>> 7 ^ v3 >>> 18 ^ v3 >>> 3 ^ v3 << 25 ^ v3 << 14) + (m3 >>> 17 ^ m3 >>> 19 ^ m3 >>> 10 ^ m3 << 15 ^ m3 << 13) + w3 + d3 | 0;
        M3 = w3 + M3 + (E3 >>> 6 ^ E3 >>> 11 ^ E3 >>> 25 ^ E3 << 26 ^ E3 << 21 ^ E3 << 7) + (x3 ^ E3 & (P3 ^ x3)) + 2361852424 | 0;
        S3 = S3 + M3 | 0;
        M3 = M3 + (C3 & K3 ^ D3 & (C3 ^ K3)) + (C3 >>> 2 ^ C3 >>> 13 ^ C3 >>> 22 ^ C3 << 30 ^ C3 << 19 ^ C3 << 10) | 0;
        v3 = (_3 >>> 7 ^ _3 >>> 18 ^ _3 >>> 3 ^ _3 << 25 ^ _3 << 14) + (g3 >>> 17 ^ g3 >>> 19 ^ g3 >>> 10 ^ g3 << 15 ^ g3 << 13) + v3 + l3 | 0;
        x3 = v3 + x3 + (S3 >>> 6 ^ S3 >>> 11 ^ S3 >>> 25 ^ S3 << 26 ^ S3 << 21 ^ S3 << 7) + (P3 ^ S3 & (E3 ^ P3)) + 2428436474 | 0;
        D3 = D3 + x3 | 0;
        x3 = x3 + (M3 & C3 ^ K3 & (M3 ^ C3)) + (M3 >>> 2 ^ M3 >>> 13 ^ M3 >>> 22 ^ M3 << 30 ^ M3 << 19 ^ M3 << 10) | 0;
        _3 = (k3 >>> 7 ^ k3 >>> 18 ^ k3 >>> 3 ^ k3 << 25 ^ k3 << 14) + (w3 >>> 17 ^ w3 >>> 19 ^ w3 >>> 10 ^ w3 << 15 ^ w3 << 13) + _3 + p3 | 0;
        P3 = _3 + P3 + (D3 >>> 6 ^ D3 >>> 11 ^ D3 >>> 25 ^ D3 << 26 ^ D3 << 21 ^ D3 << 7) + (E3 ^ D3 & (S3 ^ E3)) + 2756734187 | 0;
        K3 = K3 + P3 | 0;
        P3 = P3 + (x3 & M3 ^ C3 & (x3 ^ M3)) + (x3 >>> 2 ^ x3 >>> 13 ^ x3 >>> 22 ^ x3 << 30 ^ x3 << 19 ^ x3 << 10) | 0;
        k3 = (A3 >>> 7 ^ A3 >>> 18 ^ A3 >>> 3 ^ A3 << 25 ^ A3 << 14) + (v3 >>> 17 ^ v3 >>> 19 ^ v3 >>> 10 ^ v3 << 15 ^ v3 << 13) + k3 + y3 | 0;
        E3 = k3 + E3 + (K3 >>> 6 ^ K3 >>> 11 ^ K3 >>> 25 ^ K3 << 26 ^ K3 << 21 ^ K3 << 7) + (S3 ^ K3 & (D3 ^ S3)) + 3204031479 | 0;
        C3 = C3 + E3 | 0;
        E3 = E3 + (P3 & x3 ^ M3 & (P3 ^ x3)) + (P3 >>> 2 ^ P3 >>> 13 ^ P3 >>> 22 ^ P3 << 30 ^ P3 << 19 ^ P3 << 10) | 0;
        A3 = (e3 >>> 7 ^ e3 >>> 18 ^ e3 >>> 3 ^ e3 << 25 ^ e3 << 14) + (_3 >>> 17 ^ _3 >>> 19 ^ _3 >>> 10 ^ _3 << 15 ^ _3 << 13) + A3 + b3 | 0;
        S3 = A3 + S3 + (C3 >>> 6 ^ C3 >>> 11 ^ C3 >>> 25 ^ C3 << 26 ^ C3 << 21 ^ C3 << 7) + (D3 ^ C3 & (K3 ^ D3)) + 3329325298 | 0;
        M3 = M3 + S3 | 0;
        S3 = S3 + (E3 & P3 ^ x3 & (E3 ^ P3)) + (E3 >>> 2 ^ E3 >>> 13 ^ E3 >>> 22 ^ E3 << 30 ^ E3 << 19 ^ E3 << 10) | 0;
        i2 = i2 + S3 | 0;
        n2 = n2 + E3 | 0;
        a2 = a2 + P3 | 0;
        s2 = s2 + x3 | 0;
        o2 = o2 + M3 | 0;
        c2 = c2 + C3 | 0;
        u2 = u2 + K3 | 0;
        h2 = h2 + D3 | 0;
      }
      function D2(e3) {
        e3 = e3 | 0;
        K2(C2[e3 | 0] << 24 | C2[e3 | 1] << 16 | C2[e3 | 2] << 8 | C2[e3 | 3], C2[e3 | 4] << 24 | C2[e3 | 5] << 16 | C2[e3 | 6] << 8 | C2[e3 | 7], C2[e3 | 8] << 24 | C2[e3 | 9] << 16 | C2[e3 | 10] << 8 | C2[e3 | 11], C2[e3 | 12] << 24 | C2[e3 | 13] << 16 | C2[e3 | 14] << 8 | C2[e3 | 15], C2[e3 | 16] << 24 | C2[e3 | 17] << 16 | C2[e3 | 18] << 8 | C2[e3 | 19], C2[e3 | 20] << 24 | C2[e3 | 21] << 16 | C2[e3 | 22] << 8 | C2[e3 | 23], C2[e3 | 24] << 24 | C2[e3 | 25] << 16 | C2[e3 | 26] << 8 | C2[e3 | 27], C2[e3 | 28] << 24 | C2[e3 | 29] << 16 | C2[e3 | 30] << 8 | C2[e3 | 31], C2[e3 | 32] << 24 | C2[e3 | 33] << 16 | C2[e3 | 34] << 8 | C2[e3 | 35], C2[e3 | 36] << 24 | C2[e3 | 37] << 16 | C2[e3 | 38] << 8 | C2[e3 | 39], C2[e3 | 40] << 24 | C2[e3 | 41] << 16 | C2[e3 | 42] << 8 | C2[e3 | 43], C2[e3 | 44] << 24 | C2[e3 | 45] << 16 | C2[e3 | 46] << 8 | C2[e3 | 47], C2[e3 | 48] << 24 | C2[e3 | 49] << 16 | C2[e3 | 50] << 8 | C2[e3 | 51], C2[e3 | 52] << 24 | C2[e3 | 53] << 16 | C2[e3 | 54] << 8 | C2[e3 | 55], C2[e3 | 56] << 24 | C2[e3 | 57] << 16 | C2[e3 | 58] << 8 | C2[e3 | 59], C2[e3 | 60] << 24 | C2[e3 | 61] << 16 | C2[e3 | 62] << 8 | C2[e3 | 63]);
      }
      function R2(e3) {
        e3 = e3 | 0;
        C2[e3 | 0] = i2 >>> 24;
        C2[e3 | 1] = i2 >>> 16 & 255;
        C2[e3 | 2] = i2 >>> 8 & 255;
        C2[e3 | 3] = i2 & 255;
        C2[e3 | 4] = n2 >>> 24;
        C2[e3 | 5] = n2 >>> 16 & 255;
        C2[e3 | 6] = n2 >>> 8 & 255;
        C2[e3 | 7] = n2 & 255;
        C2[e3 | 8] = a2 >>> 24;
        C2[e3 | 9] = a2 >>> 16 & 255;
        C2[e3 | 10] = a2 >>> 8 & 255;
        C2[e3 | 11] = a2 & 255;
        C2[e3 | 12] = s2 >>> 24;
        C2[e3 | 13] = s2 >>> 16 & 255;
        C2[e3 | 14] = s2 >>> 8 & 255;
        C2[e3 | 15] = s2 & 255;
        C2[e3 | 16] = o2 >>> 24;
        C2[e3 | 17] = o2 >>> 16 & 255;
        C2[e3 | 18] = o2 >>> 8 & 255;
        C2[e3 | 19] = o2 & 255;
        C2[e3 | 20] = c2 >>> 24;
        C2[e3 | 21] = c2 >>> 16 & 255;
        C2[e3 | 22] = c2 >>> 8 & 255;
        C2[e3 | 23] = c2 & 255;
        C2[e3 | 24] = u2 >>> 24;
        C2[e3 | 25] = u2 >>> 16 & 255;
        C2[e3 | 26] = u2 >>> 8 & 255;
        C2[e3 | 27] = u2 & 255;
        C2[e3 | 28] = h2 >>> 24;
        C2[e3 | 29] = h2 >>> 16 & 255;
        C2[e3 | 30] = h2 >>> 8 & 255;
        C2[e3 | 31] = h2 & 255;
      }
      function U2() {
        i2 = 1779033703;
        n2 = 3144134277;
        a2 = 1013904242;
        s2 = 2773480762;
        o2 = 1359893119;
        c2 = 2600822924;
        u2 = 528734635;
        h2 = 1541459225;
        f2 = d2 = 0;
      }
      function I2(e3, t3, r3, l3, p3, y3, b3, m3, g3, w3) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        r3 = r3 | 0;
        l3 = l3 | 0;
        p3 = p3 | 0;
        y3 = y3 | 0;
        b3 = b3 | 0;
        m3 = m3 | 0;
        g3 = g3 | 0;
        w3 = w3 | 0;
        i2 = e3;
        n2 = t3;
        a2 = r3;
        s2 = l3;
        o2 = p3;
        c2 = y3;
        u2 = b3;
        h2 = m3;
        f2 = g3;
        d2 = w3;
      }
      function B2(e3, t3) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        var r3 = 0;
        if (e3 & 63)
          return -1;
        while ((t3 | 0) >= 64) {
          D2(e3);
          e3 = e3 + 64 | 0;
          t3 = t3 - 64 | 0;
          r3 = r3 + 64 | 0;
        }
        f2 = f2 + r3 | 0;
        if (f2 >>> 0 < r3 >>> 0)
          d2 = d2 + 1 | 0;
        return r3 | 0;
      }
      function T2(e3, t3, r3) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        r3 = r3 | 0;
        var i3 = 0, n3 = 0;
        if (e3 & 63)
          return -1;
        if (~r3) {
          if (r3 & 31)
            return -1;
        }
        if ((t3 | 0) >= 64) {
          i3 = B2(e3, t3) | 0;
          if ((i3 | 0) == -1)
            return -1;
          e3 = e3 + i3 | 0;
          t3 = t3 - i3 | 0;
        }
        i3 = i3 + t3 | 0;
        f2 = f2 + t3 | 0;
        if (f2 >>> 0 < t3 >>> 0)
          d2 = d2 + 1 | 0;
        C2[e3 | t3] = 128;
        if ((t3 | 0) >= 56) {
          for (n3 = t3 + 1 | 0; (n3 | 0) < 64; n3 = n3 + 1 | 0)
            C2[e3 | n3] = 0;
          D2(e3);
          t3 = 0;
          C2[e3 | 0] = 0;
        }
        for (n3 = t3 + 1 | 0; (n3 | 0) < 59; n3 = n3 + 1 | 0)
          C2[e3 | n3] = 0;
        C2[e3 | 56] = d2 >>> 21 & 255;
        C2[e3 | 57] = d2 >>> 13 & 255;
        C2[e3 | 58] = d2 >>> 5 & 255;
        C2[e3 | 59] = d2 << 3 & 255 | f2 >>> 29;
        C2[e3 | 60] = f2 >>> 21 & 255;
        C2[e3 | 61] = f2 >>> 13 & 255;
        C2[e3 | 62] = f2 >>> 5 & 255;
        C2[e3 | 63] = f2 << 3 & 255;
        D2(e3);
        if (~r3)
          R2(r3);
        return i3 | 0;
      }
      function z2() {
        i2 = l2;
        n2 = p2;
        a2 = y2;
        s2 = b2;
        o2 = m2;
        c2 = g2;
        u2 = w2;
        h2 = v2;
        f2 = 64;
        d2 = 0;
      }
      function q2() {
        i2 = _2;
        n2 = k2;
        a2 = A2;
        s2 = S2;
        o2 = E2;
        c2 = P2;
        u2 = x2;
        h2 = M2;
        f2 = 64;
        d2 = 0;
      }
      function O2(e3, t3, r3, C3, D3, R3, I3, B3, T3, z3, q3, O3, F3, N3, j2, L2) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        r3 = r3 | 0;
        C3 = C3 | 0;
        D3 = D3 | 0;
        R3 = R3 | 0;
        I3 = I3 | 0;
        B3 = B3 | 0;
        T3 = T3 | 0;
        z3 = z3 | 0;
        q3 = q3 | 0;
        O3 = O3 | 0;
        F3 = F3 | 0;
        N3 = N3 | 0;
        j2 = j2 | 0;
        L2 = L2 | 0;
        U2();
        K2(e3 ^ 1549556828, t3 ^ 1549556828, r3 ^ 1549556828, C3 ^ 1549556828, D3 ^ 1549556828, R3 ^ 1549556828, I3 ^ 1549556828, B3 ^ 1549556828, T3 ^ 1549556828, z3 ^ 1549556828, q3 ^ 1549556828, O3 ^ 1549556828, F3 ^ 1549556828, N3 ^ 1549556828, j2 ^ 1549556828, L2 ^ 1549556828);
        _2 = i2;
        k2 = n2;
        A2 = a2;
        S2 = s2;
        E2 = o2;
        P2 = c2;
        x2 = u2;
        M2 = h2;
        U2();
        K2(e3 ^ 909522486, t3 ^ 909522486, r3 ^ 909522486, C3 ^ 909522486, D3 ^ 909522486, R3 ^ 909522486, I3 ^ 909522486, B3 ^ 909522486, T3 ^ 909522486, z3 ^ 909522486, q3 ^ 909522486, O3 ^ 909522486, F3 ^ 909522486, N3 ^ 909522486, j2 ^ 909522486, L2 ^ 909522486);
        l2 = i2;
        p2 = n2;
        y2 = a2;
        b2 = s2;
        m2 = o2;
        g2 = c2;
        w2 = u2;
        v2 = h2;
        f2 = 64;
        d2 = 0;
      }
      function F2(e3, t3, r3) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        r3 = r3 | 0;
        var f3 = 0, d3 = 0, l3 = 0, p3 = 0, y3 = 0, b3 = 0, m3 = 0, g3 = 0, w3 = 0;
        if (e3 & 63)
          return -1;
        if (~r3) {
          if (r3 & 31)
            return -1;
        }
        w3 = T2(e3, t3, -1) | 0;
        f3 = i2, d3 = n2, l3 = a2, p3 = s2, y3 = o2, b3 = c2, m3 = u2, g3 = h2;
        q2();
        K2(f3, d3, l3, p3, y3, b3, m3, g3, 2147483648, 0, 0, 0, 0, 0, 0, 768);
        if (~r3)
          R2(r3);
        return w3 | 0;
      }
      function N2(e3, t3, r3, f3, d3) {
        e3 = e3 | 0;
        t3 = t3 | 0;
        r3 = r3 | 0;
        f3 = f3 | 0;
        d3 = d3 | 0;
        var l3 = 0, p3 = 0, y3 = 0, b3 = 0, m3 = 0, g3 = 0, w3 = 0, v3 = 0, _3 = 0, k3 = 0, A3 = 0, S3 = 0, E3 = 0, P3 = 0, x3 = 0, M3 = 0;
        if (e3 & 63)
          return -1;
        if (~d3) {
          if (d3 & 31)
            return -1;
        }
        C2[e3 + t3 | 0] = r3 >>> 24;
        C2[e3 + t3 + 1 | 0] = r3 >>> 16 & 255;
        C2[e3 + t3 + 2 | 0] = r3 >>> 8 & 255;
        C2[e3 + t3 + 3 | 0] = r3 & 255;
        F2(e3, t3 + 4 | 0, -1) | 0;
        l3 = _3 = i2, p3 = k3 = n2, y3 = A3 = a2, b3 = S3 = s2, m3 = E3 = o2, g3 = P3 = c2, w3 = x3 = u2, v3 = M3 = h2;
        f3 = f3 - 1 | 0;
        while ((f3 | 0) > 0) {
          z2();
          K2(_3, k3, A3, S3, E3, P3, x3, M3, 2147483648, 0, 0, 0, 0, 0, 0, 768);
          _3 = i2, k3 = n2, A3 = a2, S3 = s2, E3 = o2, P3 = c2, x3 = u2, M3 = h2;
          q2();
          K2(_3, k3, A3, S3, E3, P3, x3, M3, 2147483648, 0, 0, 0, 0, 0, 0, 768);
          _3 = i2, k3 = n2, A3 = a2, S3 = s2, E3 = o2, P3 = c2, x3 = u2, M3 = h2;
          l3 = l3 ^ i2;
          p3 = p3 ^ n2;
          y3 = y3 ^ a2;
          b3 = b3 ^ s2;
          m3 = m3 ^ o2;
          g3 = g3 ^ c2;
          w3 = w3 ^ u2;
          v3 = v3 ^ h2;
          f3 = f3 - 1 | 0;
        }
        i2 = l3;
        n2 = p3;
        a2 = y3;
        s2 = b3;
        o2 = m3;
        c2 = g3;
        u2 = w3;
        h2 = v3;
        if (~d3)
          R2(d3);
        return 0;
      }
      return {reset: U2, init: I2, process: B2, finish: T2, hmac_reset: z2, hmac_init: O2, hmac_finish: F2, pbkdf2_generate_block: N2};
    }({Uint8Array}, null, this.heap.buffer), this.reset()), {heap: this.heap, asm: this.asm};
  }
  release_asm() {
    this.heap !== void 0 && this.asm !== void 0 && (Ze.push(this.heap), Ye.push(this.asm)), this.heap = void 0, this.asm = void 0;
  }
  static bytes(e2) {
    return new Xe().process(e2).finish().result;
  }
}
Xe.NAME = "sha256";
var Qe = Je;
function Je(e2, t2) {
  if (!e2)
    throw Error(t2 || "Assertion failed");
}
Je.equal = function(e2, t2, r2) {
  if (e2 != t2)
    throw Error(r2 || "Assertion failed: " + e2 + " != " + t2);
};
var et = e !== void 0 ? e : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function tt(e2, t2) {
  return e2(t2 = {exports: {}}, t2.exports), t2.exports;
}
var rt = tt(function(e2) {
  e2.exports = typeof Object.create == "function" ? function(e3, t2) {
    e3.super_ = t2, e3.prototype = Object.create(t2.prototype, {constructor: {value: e3, enumerable: false, writable: true, configurable: true}});
  } : function(e3, t2) {
    e3.super_ = t2;
    var r2 = function() {
    };
    r2.prototype = t2.prototype, e3.prototype = new r2(), e3.prototype.constructor = e3;
  };
});
function it(e2) {
  return (e2 >>> 24 | e2 >>> 8 & 65280 | e2 << 8 & 16711680 | (255 & e2) << 24) >>> 0;
}
function nt(e2) {
  return e2.length === 1 ? "0" + e2 : e2;
}
function at(e2) {
  return e2.length === 7 ? "0" + e2 : e2.length === 6 ? "00" + e2 : e2.length === 5 ? "000" + e2 : e2.length === 4 ? "0000" + e2 : e2.length === 3 ? "00000" + e2 : e2.length === 2 ? "000000" + e2 : e2.length === 1 ? "0000000" + e2 : e2;
}
var st = {inherits: rt, toArray: function(e2, t2) {
  if (Array.isArray(e2))
    return e2.slice();
  if (!e2)
    return [];
  var r2 = [];
  if (typeof e2 == "string")
    if (t2) {
      if (t2 === "hex")
        for ((e2 = e2.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e2 = "0" + e2), i2 = 0; i2 < e2.length; i2 += 2)
          r2.push(parseInt(e2[i2] + e2[i2 + 1], 16));
    } else
      for (var i2 = 0; i2 < e2.length; i2++) {
        var n2 = e2.charCodeAt(i2), a2 = n2 >> 8, s2 = 255 & n2;
        a2 ? r2.push(a2, s2) : r2.push(s2);
      }
  else
    for (i2 = 0; i2 < e2.length; i2++)
      r2[i2] = 0 | e2[i2];
  return r2;
}, toHex: function(e2) {
  for (var t2 = "", r2 = 0; r2 < e2.length; r2++)
    t2 += nt(e2[r2].toString(16));
  return t2;
}, htonl: it, toHex32: function(e2, t2) {
  for (var r2 = "", i2 = 0; i2 < e2.length; i2++) {
    var n2 = e2[i2];
    t2 === "little" && (n2 = it(n2)), r2 += at(n2.toString(16));
  }
  return r2;
}, zero2: nt, zero8: at, join32: function(e2, t2, r2, i2) {
  var n2 = r2 - t2;
  Qe(n2 % 4 == 0);
  for (var a2 = Array(n2 / 4), s2 = 0, o2 = t2; s2 < a2.length; s2++, o2 += 4) {
    var c2;
    c2 = i2 === "big" ? e2[o2] << 24 | e2[o2 + 1] << 16 | e2[o2 + 2] << 8 | e2[o2 + 3] : e2[o2 + 3] << 24 | e2[o2 + 2] << 16 | e2[o2 + 1] << 8 | e2[o2], a2[s2] = c2 >>> 0;
  }
  return a2;
}, split32: function(e2, t2) {
  for (var r2 = Array(4 * e2.length), i2 = 0, n2 = 0; i2 < e2.length; i2++, n2 += 4) {
    var a2 = e2[i2];
    t2 === "big" ? (r2[n2] = a2 >>> 24, r2[n2 + 1] = a2 >>> 16 & 255, r2[n2 + 2] = a2 >>> 8 & 255, r2[n2 + 3] = 255 & a2) : (r2[n2 + 3] = a2 >>> 24, r2[n2 + 2] = a2 >>> 16 & 255, r2[n2 + 1] = a2 >>> 8 & 255, r2[n2] = 255 & a2);
  }
  return r2;
}, rotr32: function(e2, t2) {
  return e2 >>> t2 | e2 << 32 - t2;
}, rotl32: function(e2, t2) {
  return e2 << t2 | e2 >>> 32 - t2;
}, sum32: function(e2, t2) {
  return e2 + t2 >>> 0;
}, sum32_3: function(e2, t2, r2) {
  return e2 + t2 + r2 >>> 0;
}, sum32_4: function(e2, t2, r2, i2) {
  return e2 + t2 + r2 + i2 >>> 0;
}, sum32_5: function(e2, t2, r2, i2, n2) {
  return e2 + t2 + r2 + i2 + n2 >>> 0;
}, sum64: function(e2, t2, r2, i2) {
  var n2 = e2[t2], a2 = i2 + e2[t2 + 1] >>> 0, s2 = (a2 < i2 ? 1 : 0) + r2 + n2;
  e2[t2] = s2 >>> 0, e2[t2 + 1] = a2;
}, sum64_hi: function(e2, t2, r2, i2) {
  return (t2 + i2 >>> 0 < t2 ? 1 : 0) + e2 + r2 >>> 0;
}, sum64_lo: function(e2, t2, r2, i2) {
  return t2 + i2 >>> 0;
}, sum64_4_hi: function(e2, t2, r2, i2, n2, a2, s2, o2) {
  var c2 = 0, u2 = t2;
  return c2 += (u2 = u2 + i2 >>> 0) < t2 ? 1 : 0, c2 += (u2 = u2 + a2 >>> 0) < a2 ? 1 : 0, e2 + r2 + n2 + s2 + (c2 += (u2 = u2 + o2 >>> 0) < o2 ? 1 : 0) >>> 0;
}, sum64_4_lo: function(e2, t2, r2, i2, n2, a2, s2, o2) {
  return t2 + i2 + a2 + o2 >>> 0;
}, sum64_5_hi: function(e2, t2, r2, i2, n2, a2, s2, o2, c2, u2) {
  var h2 = 0, f2 = t2;
  return h2 += (f2 = f2 + i2 >>> 0) < t2 ? 1 : 0, h2 += (f2 = f2 + a2 >>> 0) < a2 ? 1 : 0, h2 += (f2 = f2 + o2 >>> 0) < o2 ? 1 : 0, e2 + r2 + n2 + s2 + c2 + (h2 += (f2 = f2 + u2 >>> 0) < u2 ? 1 : 0) >>> 0;
}, sum64_5_lo: function(e2, t2, r2, i2, n2, a2, s2, o2, c2, u2) {
  return t2 + i2 + a2 + o2 + u2 >>> 0;
}, rotr64_hi: function(e2, t2, r2) {
  return (t2 << 32 - r2 | e2 >>> r2) >>> 0;
}, rotr64_lo: function(e2, t2, r2) {
  return (e2 << 32 - r2 | t2 >>> r2) >>> 0;
}, shr64_hi: function(e2, t2, r2) {
  return e2 >>> r2;
}, shr64_lo: function(e2, t2, r2) {
  return (e2 << 32 - r2 | t2 >>> r2) >>> 0;
}};
function ot() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
var ct = ot;
ot.prototype.update = function(e2, t2) {
  if (e2 = st.toArray(e2, t2), this.pending ? this.pending = this.pending.concat(e2) : this.pending = e2, this.pendingTotal += e2.length, this.pending.length >= this._delta8) {
    var r2 = (e2 = this.pending).length % this._delta8;
    this.pending = e2.slice(e2.length - r2, e2.length), this.pending.length === 0 && (this.pending = null), e2 = st.join32(e2, 0, e2.length - r2, this.endian);
    for (var i2 = 0; i2 < e2.length; i2 += this._delta32)
      this._update(e2, i2, i2 + this._delta32);
  }
  return this;
}, ot.prototype.digest = function(e2) {
  return this.update(this._pad()), Qe(this.pending === null), this._digest(e2);
}, ot.prototype._pad = function() {
  var e2 = this.pendingTotal, t2 = this._delta8, r2 = t2 - (e2 + this.padLength) % t2, i2 = Array(r2 + this.padLength);
  i2[0] = 128;
  for (var n2 = 1; n2 < r2; n2++)
    i2[n2] = 0;
  if (e2 <<= 3, this.endian === "big") {
    for (var a2 = 8; a2 < this.padLength; a2++)
      i2[n2++] = 0;
    i2[n2++] = 0, i2[n2++] = 0, i2[n2++] = 0, i2[n2++] = 0, i2[n2++] = e2 >>> 24 & 255, i2[n2++] = e2 >>> 16 & 255, i2[n2++] = e2 >>> 8 & 255, i2[n2++] = 255 & e2;
  } else
    for (i2[n2++] = 255 & e2, i2[n2++] = e2 >>> 8 & 255, i2[n2++] = e2 >>> 16 & 255, i2[n2++] = e2 >>> 24 & 255, i2[n2++] = 0, i2[n2++] = 0, i2[n2++] = 0, i2[n2++] = 0, a2 = 8; a2 < this.padLength; a2++)
      i2[n2++] = 0;
  return i2;
};
var ut = {BlockHash: ct}, ht = st.rotr32;
function ft(e2, t2, r2) {
  return e2 & t2 ^ ~e2 & r2;
}
function dt(e2, t2, r2) {
  return e2 & t2 ^ e2 & r2 ^ t2 & r2;
}
function lt(e2, t2, r2) {
  return e2 ^ t2 ^ r2;
}
var pt = {ft_1: function(e2, t2, r2, i2) {
  return e2 === 0 ? ft(t2, r2, i2) : e2 === 1 || e2 === 3 ? lt(t2, r2, i2) : e2 === 2 ? dt(t2, r2, i2) : void 0;
}, ch32: ft, maj32: dt, p32: lt, s0_256: function(e2) {
  return ht(e2, 2) ^ ht(e2, 13) ^ ht(e2, 22);
}, s1_256: function(e2) {
  return ht(e2, 6) ^ ht(e2, 11) ^ ht(e2, 25);
}, g0_256: function(e2) {
  return ht(e2, 7) ^ ht(e2, 18) ^ e2 >>> 3;
}, g1_256: function(e2) {
  return ht(e2, 17) ^ ht(e2, 19) ^ e2 >>> 10;
}}, yt = st.sum32, bt = st.sum32_4, mt = st.sum32_5, gt = pt.ch32, wt = pt.maj32, vt = pt.s0_256, _t = pt.s1_256, kt = pt.g0_256, At = pt.g1_256, St = ut.BlockHash, Et = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
function Pt() {
  if (!(this instanceof Pt))
    return new Pt();
  St.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = Et, this.W = Array(64);
}
st.inherits(Pt, St);
var xt = Pt;
function Mt() {
  if (!(this instanceof Mt))
    return new Mt();
  xt.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
}
Pt.blockSize = 512, Pt.outSize = 256, Pt.hmacStrength = 192, Pt.padLength = 64, Pt.prototype._update = function(e2, t2) {
  for (var r2 = this.W, i2 = 0; i2 < 16; i2++)
    r2[i2] = e2[t2 + i2];
  for (; i2 < r2.length; i2++)
    r2[i2] = bt(At(r2[i2 - 2]), r2[i2 - 7], kt(r2[i2 - 15]), r2[i2 - 16]);
  var n2 = this.h[0], a2 = this.h[1], s2 = this.h[2], o2 = this.h[3], c2 = this.h[4], u2 = this.h[5], h2 = this.h[6], f2 = this.h[7];
  for (Qe(this.k.length === r2.length), i2 = 0; i2 < r2.length; i2++) {
    var d2 = mt(f2, _t(c2), gt(c2, u2, h2), this.k[i2], r2[i2]), l2 = yt(vt(n2), wt(n2, a2, s2));
    f2 = h2, h2 = u2, u2 = c2, c2 = yt(o2, d2), o2 = s2, s2 = a2, a2 = n2, n2 = yt(d2, l2);
  }
  this.h[0] = yt(this.h[0], n2), this.h[1] = yt(this.h[1], a2), this.h[2] = yt(this.h[2], s2), this.h[3] = yt(this.h[3], o2), this.h[4] = yt(this.h[4], c2), this.h[5] = yt(this.h[5], u2), this.h[6] = yt(this.h[6], h2), this.h[7] = yt(this.h[7], f2);
}, Pt.prototype._digest = function(e2) {
  return e2 === "hex" ? st.toHex32(this.h, "big") : st.split32(this.h, "big");
}, st.inherits(Mt, xt);
var Ct = Mt;
Mt.blockSize = 512, Mt.outSize = 224, Mt.hmacStrength = 192, Mt.padLength = 64, Mt.prototype._digest = function(e2) {
  return e2 === "hex" ? st.toHex32(this.h.slice(0, 7), "big") : st.split32(this.h.slice(0, 7), "big");
};
var Kt = st.rotr64_hi, Dt = st.rotr64_lo, Rt = st.shr64_hi, Ut = st.shr64_lo, It = st.sum64, Bt = st.sum64_hi, Tt = st.sum64_lo, zt = st.sum64_4_hi, qt = st.sum64_4_lo, Ot = st.sum64_5_hi, Ft = st.sum64_5_lo, Nt = ut.BlockHash, jt = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
function Lt() {
  if (!(this instanceof Lt))
    return new Lt();
  Nt.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = jt, this.W = Array(160);
}
st.inherits(Lt, Nt);
var Wt = Lt;
function Ht(e2, t2, r2, i2, n2) {
  var a2 = e2 & r2 ^ ~e2 & n2;
  return a2 < 0 && (a2 += 4294967296), a2;
}
function Gt(e2, t2, r2, i2, n2, a2) {
  var s2 = t2 & i2 ^ ~t2 & a2;
  return s2 < 0 && (s2 += 4294967296), s2;
}
function Vt(e2, t2, r2, i2, n2) {
  var a2 = e2 & r2 ^ e2 & n2 ^ r2 & n2;
  return a2 < 0 && (a2 += 4294967296), a2;
}
function $t(e2, t2, r2, i2, n2, a2) {
  var s2 = t2 & i2 ^ t2 & a2 ^ i2 & a2;
  return s2 < 0 && (s2 += 4294967296), s2;
}
function Zt(e2, t2) {
  var r2 = Kt(e2, t2, 28) ^ Kt(t2, e2, 2) ^ Kt(t2, e2, 7);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function Yt(e2, t2) {
  var r2 = Dt(e2, t2, 28) ^ Dt(t2, e2, 2) ^ Dt(t2, e2, 7);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function Xt(e2, t2) {
  var r2 = Kt(e2, t2, 14) ^ Kt(e2, t2, 18) ^ Kt(t2, e2, 9);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function Qt(e2, t2) {
  var r2 = Dt(e2, t2, 14) ^ Dt(e2, t2, 18) ^ Dt(t2, e2, 9);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function Jt(e2, t2) {
  var r2 = Kt(e2, t2, 1) ^ Kt(e2, t2, 8) ^ Rt(e2, t2, 7);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function er(e2, t2) {
  var r2 = Dt(e2, t2, 1) ^ Dt(e2, t2, 8) ^ Ut(e2, t2, 7);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function tr(e2, t2) {
  var r2 = Kt(e2, t2, 19) ^ Kt(t2, e2, 29) ^ Rt(e2, t2, 6);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function rr(e2, t2) {
  var r2 = Dt(e2, t2, 19) ^ Dt(t2, e2, 29) ^ Ut(e2, t2, 6);
  return r2 < 0 && (r2 += 4294967296), r2;
}
function ir() {
  if (!(this instanceof ir))
    return new ir();
  Wt.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
}
Lt.blockSize = 1024, Lt.outSize = 512, Lt.hmacStrength = 192, Lt.padLength = 128, Lt.prototype._prepareBlock = function(e2, t2) {
  for (var r2 = this.W, i2 = 0; i2 < 32; i2++)
    r2[i2] = e2[t2 + i2];
  for (; i2 < r2.length; i2 += 2) {
    var n2 = tr(r2[i2 - 4], r2[i2 - 3]), a2 = rr(r2[i2 - 4], r2[i2 - 3]), s2 = r2[i2 - 14], o2 = r2[i2 - 13], c2 = Jt(r2[i2 - 30], r2[i2 - 29]), u2 = er(r2[i2 - 30], r2[i2 - 29]), h2 = r2[i2 - 32], f2 = r2[i2 - 31];
    r2[i2] = zt(n2, a2, s2, o2, c2, u2, h2, f2), r2[i2 + 1] = qt(n2, a2, s2, o2, c2, u2, h2, f2);
  }
}, Lt.prototype._update = function(e2, t2) {
  this._prepareBlock(e2, t2);
  var r2 = this.W, i2 = this.h[0], n2 = this.h[1], a2 = this.h[2], s2 = this.h[3], o2 = this.h[4], c2 = this.h[5], u2 = this.h[6], h2 = this.h[7], f2 = this.h[8], d2 = this.h[9], l2 = this.h[10], p2 = this.h[11], y2 = this.h[12], b2 = this.h[13], m2 = this.h[14], g2 = this.h[15];
  Qe(this.k.length === r2.length);
  for (var w2 = 0; w2 < r2.length; w2 += 2) {
    var v2 = m2, _2 = g2, k2 = Xt(f2, d2), A2 = Qt(f2, d2), S2 = Ht(f2, d2, l2, p2, y2), E2 = Gt(f2, d2, l2, p2, y2, b2), P2 = this.k[w2], x2 = this.k[w2 + 1], M2 = r2[w2], C2 = r2[w2 + 1], K2 = Ot(v2, _2, k2, A2, S2, E2, P2, x2, M2, C2), D2 = Ft(v2, _2, k2, A2, S2, E2, P2, x2, M2, C2);
    v2 = Zt(i2, n2), _2 = Yt(i2, n2), k2 = Vt(i2, n2, a2, s2, o2), A2 = $t(i2, n2, a2, s2, o2, c2);
    var R2 = Bt(v2, _2, k2, A2), U2 = Tt(v2, _2, k2, A2);
    m2 = y2, g2 = b2, y2 = l2, b2 = p2, l2 = f2, p2 = d2, f2 = Bt(u2, h2, K2, D2), d2 = Tt(h2, h2, K2, D2), u2 = o2, h2 = c2, o2 = a2, c2 = s2, a2 = i2, s2 = n2, i2 = Bt(K2, D2, R2, U2), n2 = Tt(K2, D2, R2, U2);
  }
  It(this.h, 0, i2, n2), It(this.h, 2, a2, s2), It(this.h, 4, o2, c2), It(this.h, 6, u2, h2), It(this.h, 8, f2, d2), It(this.h, 10, l2, p2), It(this.h, 12, y2, b2), It(this.h, 14, m2, g2);
}, Lt.prototype._digest = function(e2) {
  return e2 === "hex" ? st.toHex32(this.h, "big") : st.split32(this.h, "big");
}, st.inherits(ir, Wt);
var nr = ir;
ir.blockSize = 1024, ir.outSize = 384, ir.hmacStrength = 192, ir.padLength = 128, ir.prototype._digest = function(e2) {
  return e2 === "hex" ? st.toHex32(this.h.slice(0, 12), "big") : st.split32(this.h.slice(0, 12), "big");
};
var ar = st.rotl32, sr = st.sum32, or = st.sum32_3, cr = st.sum32_4, ur = ut.BlockHash;
function hr() {
  if (!(this instanceof hr))
    return new hr();
  ur.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
st.inherits(hr, ur);
var fr = hr;
function dr(e2, t2, r2, i2) {
  return e2 <= 15 ? t2 ^ r2 ^ i2 : e2 <= 31 ? t2 & r2 | ~t2 & i2 : e2 <= 47 ? (t2 | ~r2) ^ i2 : e2 <= 63 ? t2 & i2 | r2 & ~i2 : t2 ^ (r2 | ~i2);
}
function lr(e2) {
  return e2 <= 15 ? 0 : e2 <= 31 ? 1518500249 : e2 <= 47 ? 1859775393 : e2 <= 63 ? 2400959708 : 2840853838;
}
function pr(e2) {
  return e2 <= 15 ? 1352829926 : e2 <= 31 ? 1548603684 : e2 <= 47 ? 1836072691 : e2 <= 63 ? 2053994217 : 0;
}
hr.blockSize = 512, hr.outSize = 160, hr.hmacStrength = 192, hr.padLength = 64, hr.prototype._update = function(e2, t2) {
  for (var r2 = this.h[0], i2 = this.h[1], n2 = this.h[2], a2 = this.h[3], s2 = this.h[4], o2 = r2, c2 = i2, u2 = n2, h2 = a2, f2 = s2, d2 = 0; d2 < 80; d2++) {
    var l2 = sr(ar(cr(r2, dr(d2, i2, n2, a2), e2[yr[d2] + t2], lr(d2)), mr[d2]), s2);
    r2 = s2, s2 = a2, a2 = ar(n2, 10), n2 = i2, i2 = l2, l2 = sr(ar(cr(o2, dr(79 - d2, c2, u2, h2), e2[br[d2] + t2], pr(d2)), gr[d2]), f2), o2 = f2, f2 = h2, h2 = ar(u2, 10), u2 = c2, c2 = l2;
  }
  l2 = or(this.h[1], n2, h2), this.h[1] = or(this.h[2], a2, f2), this.h[2] = or(this.h[3], s2, o2), this.h[3] = or(this.h[4], r2, c2), this.h[4] = or(this.h[0], i2, u2), this.h[0] = l2;
}, hr.prototype._digest = function(e2) {
  return e2 === "hex" ? st.toHex32(this.h, "little") : st.split32(this.h, "little");
};
var yr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13], br = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11], mr = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6], gr = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11], wr = {ripemd160: fr};
function vr(e2, t2) {
  let r2 = e2[0], i2 = e2[1], n2 = e2[2], a2 = e2[3];
  r2 = kr(r2, i2, n2, a2, t2[0], 7, -680876936), a2 = kr(a2, r2, i2, n2, t2[1], 12, -389564586), n2 = kr(n2, a2, r2, i2, t2[2], 17, 606105819), i2 = kr(i2, n2, a2, r2, t2[3], 22, -1044525330), r2 = kr(r2, i2, n2, a2, t2[4], 7, -176418897), a2 = kr(a2, r2, i2, n2, t2[5], 12, 1200080426), n2 = kr(n2, a2, r2, i2, t2[6], 17, -1473231341), i2 = kr(i2, n2, a2, r2, t2[7], 22, -45705983), r2 = kr(r2, i2, n2, a2, t2[8], 7, 1770035416), a2 = kr(a2, r2, i2, n2, t2[9], 12, -1958414417), n2 = kr(n2, a2, r2, i2, t2[10], 17, -42063), i2 = kr(i2, n2, a2, r2, t2[11], 22, -1990404162), r2 = kr(r2, i2, n2, a2, t2[12], 7, 1804603682), a2 = kr(a2, r2, i2, n2, t2[13], 12, -40341101), n2 = kr(n2, a2, r2, i2, t2[14], 17, -1502002290), i2 = kr(i2, n2, a2, r2, t2[15], 22, 1236535329), r2 = Ar(r2, i2, n2, a2, t2[1], 5, -165796510), a2 = Ar(a2, r2, i2, n2, t2[6], 9, -1069501632), n2 = Ar(n2, a2, r2, i2, t2[11], 14, 643717713), i2 = Ar(i2, n2, a2, r2, t2[0], 20, -373897302), r2 = Ar(r2, i2, n2, a2, t2[5], 5, -701558691), a2 = Ar(a2, r2, i2, n2, t2[10], 9, 38016083), n2 = Ar(n2, a2, r2, i2, t2[15], 14, -660478335), i2 = Ar(i2, n2, a2, r2, t2[4], 20, -405537848), r2 = Ar(r2, i2, n2, a2, t2[9], 5, 568446438), a2 = Ar(a2, r2, i2, n2, t2[14], 9, -1019803690), n2 = Ar(n2, a2, r2, i2, t2[3], 14, -187363961), i2 = Ar(i2, n2, a2, r2, t2[8], 20, 1163531501), r2 = Ar(r2, i2, n2, a2, t2[13], 5, -1444681467), a2 = Ar(a2, r2, i2, n2, t2[2], 9, -51403784), n2 = Ar(n2, a2, r2, i2, t2[7], 14, 1735328473), i2 = Ar(i2, n2, a2, r2, t2[12], 20, -1926607734), r2 = Sr(r2, i2, n2, a2, t2[5], 4, -378558), a2 = Sr(a2, r2, i2, n2, t2[8], 11, -2022574463), n2 = Sr(n2, a2, r2, i2, t2[11], 16, 1839030562), i2 = Sr(i2, n2, a2, r2, t2[14], 23, -35309556), r2 = Sr(r2, i2, n2, a2, t2[1], 4, -1530992060), a2 = Sr(a2, r2, i2, n2, t2[4], 11, 1272893353), n2 = Sr(n2, a2, r2, i2, t2[7], 16, -155497632), i2 = Sr(i2, n2, a2, r2, t2[10], 23, -1094730640), r2 = Sr(r2, i2, n2, a2, t2[13], 4, 681279174), a2 = Sr(a2, r2, i2, n2, t2[0], 11, -358537222), n2 = Sr(n2, a2, r2, i2, t2[3], 16, -722521979), i2 = Sr(i2, n2, a2, r2, t2[6], 23, 76029189), r2 = Sr(r2, i2, n2, a2, t2[9], 4, -640364487), a2 = Sr(a2, r2, i2, n2, t2[12], 11, -421815835), n2 = Sr(n2, a2, r2, i2, t2[15], 16, 530742520), i2 = Sr(i2, n2, a2, r2, t2[2], 23, -995338651), r2 = Er(r2, i2, n2, a2, t2[0], 6, -198630844), a2 = Er(a2, r2, i2, n2, t2[7], 10, 1126891415), n2 = Er(n2, a2, r2, i2, t2[14], 15, -1416354905), i2 = Er(i2, n2, a2, r2, t2[5], 21, -57434055), r2 = Er(r2, i2, n2, a2, t2[12], 6, 1700485571), a2 = Er(a2, r2, i2, n2, t2[3], 10, -1894986606), n2 = Er(n2, a2, r2, i2, t2[10], 15, -1051523), i2 = Er(i2, n2, a2, r2, t2[1], 21, -2054922799), r2 = Er(r2, i2, n2, a2, t2[8], 6, 1873313359), a2 = Er(a2, r2, i2, n2, t2[15], 10, -30611744), n2 = Er(n2, a2, r2, i2, t2[6], 15, -1560198380), i2 = Er(i2, n2, a2, r2, t2[13], 21, 1309151649), r2 = Er(r2, i2, n2, a2, t2[4], 6, -145523070), a2 = Er(a2, r2, i2, n2, t2[11], 10, -1120210379), n2 = Er(n2, a2, r2, i2, t2[2], 15, 718787259), i2 = Er(i2, n2, a2, r2, t2[9], 21, -343485551), e2[0] = Cr(r2, e2[0]), e2[1] = Cr(i2, e2[1]), e2[2] = Cr(n2, e2[2]), e2[3] = Cr(a2, e2[3]);
}
function _r(e2, t2, r2, i2, n2, a2) {
  return t2 = Cr(Cr(t2, e2), Cr(i2, a2)), Cr(t2 << n2 | t2 >>> 32 - n2, r2);
}
function kr(e2, t2, r2, i2, n2, a2, s2) {
  return _r(t2 & r2 | ~t2 & i2, e2, t2, n2, a2, s2);
}
function Ar(e2, t2, r2, i2, n2, a2, s2) {
  return _r(t2 & i2 | r2 & ~i2, e2, t2, n2, a2, s2);
}
function Sr(e2, t2, r2, i2, n2, a2, s2) {
  return _r(t2 ^ r2 ^ i2, e2, t2, n2, a2, s2);
}
function Er(e2, t2, r2, i2, n2, a2, s2) {
  return _r(r2 ^ (t2 | ~i2), e2, t2, n2, a2, s2);
}
function Pr(e2) {
  const t2 = [];
  let r2;
  for (r2 = 0; r2 < 64; r2 += 4)
    t2[r2 >> 2] = e2.charCodeAt(r2) + (e2.charCodeAt(r2 + 1) << 8) + (e2.charCodeAt(r2 + 2) << 16) + (e2.charCodeAt(r2 + 3) << 24);
  return t2;
}
const xr = "0123456789abcdef".split("");
function Mr(e2) {
  let t2 = "", r2 = 0;
  for (; r2 < 4; r2++)
    t2 += xr[e2 >> 8 * r2 + 4 & 15] + xr[e2 >> 8 * r2 & 15];
  return t2;
}
function Cr(e2, t2) {
  return e2 + t2 & 4294967295;
}
const Kr = V.getWebCrypto(), Dr = V.getNodeCrypto(), Rr = Dr && Dr.getHashes();
function Ur(e2) {
  if (Dr && Rr.includes(e2))
    return async function(t2) {
      const r2 = Dr.createHash(e2);
      return B(t2, (e3) => {
        r2.update(e3);
      }, () => new Uint8Array(r2.digest()));
    };
}
function Ir(e2, t2) {
  return async function(r2, i2 = ie) {
    if (s(r2) && (r2 = await j(r2)), !V.isStream(r2) && Kr && t2 && r2.length >= i2.minBytesForWebCrypto)
      return new Uint8Array(await Kr.digest(t2, r2));
    const n2 = e2();
    return B(r2, (e3) => {
      n2.update(e3);
    }, () => new Uint8Array(n2.digest()));
  };
}
function Br(e2, t2) {
  return async function(r2, i2 = ie) {
    if (s(r2) && (r2 = await j(r2)), V.isStream(r2)) {
      const t3 = new e2();
      return B(r2, (e3) => {
        t3.process(e3);
      }, () => t3.finish().result);
    }
    return Kr && t2 && r2.length >= i2.minBytesForWebCrypto ? new Uint8Array(await Kr.digest(t2, r2)) : e2.bytes(r2);
  };
}
const Tr = {md5: Ur("md5") || async function(e2) {
  const t2 = function(e3) {
    const t3 = e3.length, r2 = [1732584193, -271733879, -1732584194, 271733878];
    let i2;
    for (i2 = 64; i2 <= e3.length; i2 += 64)
      vr(r2, Pr(e3.substring(i2 - 64, i2)));
    e3 = e3.substring(i2 - 64);
    const n2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i2 = 0; i2 < e3.length; i2++)
      n2[i2 >> 2] |= e3.charCodeAt(i2) << (i2 % 4 << 3);
    if (n2[i2 >> 2] |= 128 << (i2 % 4 << 3), i2 > 55)
      for (vr(r2, n2), i2 = 0; i2 < 16; i2++)
        n2[i2] = 0;
    return n2[14] = 8 * t3, vr(r2, n2), r2;
  }(V.uint8ArrayToString(e2));
  return V.hexToUint8Array(function(e3) {
    for (let t3 = 0; t3 < e3.length; t3++)
      e3[t3] = Mr(e3[t3]);
    return e3.join("");
  }(t2));
}, sha1: Ur("sha1") || Br($e, "SHA-1"), sha224: Ur("sha224") || Ir(Ct), sha256: Ur("sha256") || Br(Xe, "SHA-256"), sha384: Ur("sha384") || Ir(nr, "SHA-384"), sha512: Ur("sha512") || Ir(Wt, "SHA-512"), ripemd: Ur("ripemd160") || Ir(fr)};
var zr = {md5: Tr.md5, sha1: Tr.sha1, sha224: Tr.sha224, sha256: Tr.sha256, sha384: Tr.sha384, sha512: Tr.sha512, ripemd: Tr.ripemd, digest: function(e2, t2) {
  switch (e2) {
    case re.hash.md5:
      return this.md5(t2);
    case re.hash.sha1:
      return this.sha1(t2);
    case re.hash.ripemd:
      return this.ripemd(t2);
    case re.hash.sha256:
      return this.sha256(t2);
    case re.hash.sha384:
      return this.sha384(t2);
    case re.hash.sha512:
      return this.sha512(t2);
    case re.hash.sha224:
      return this.sha224(t2);
    default:
      throw Error("Invalid hash function.");
  }
}, getHashByteLength: function(e2) {
  switch (e2) {
    case re.hash.md5:
      return 16;
    case re.hash.sha1:
    case re.hash.ripemd:
      return 20;
    case re.hash.sha256:
      return 32;
    case re.hash.sha384:
      return 48;
    case re.hash.sha512:
      return 64;
    case re.hash.sha224:
      return 28;
    default:
      throw Error("Invalid hash algorithm.");
  }
}};
class qr {
  static encrypt(e2, t2, r2) {
    return new qr(t2, r2).encrypt(e2);
  }
  static decrypt(e2, t2, r2) {
    return new qr(t2, r2).decrypt(e2);
  }
  constructor(e2, t2, r2) {
    this.aes = r2 || new Se(e2, t2, true, "CFB"), delete this.aes.padding;
  }
  encrypt(e2) {
    return ge(this.aes.AES_Encrypt_process(e2), this.aes.AES_Encrypt_finish());
  }
  decrypt(e2) {
    return ge(this.aes.AES_Decrypt_process(e2), this.aes.AES_Decrypt_finish());
  }
}
var Or = tt(function(e2) {
  !function(e3) {
    var t2 = function(e4) {
      var t3, r3 = new Float64Array(16);
      if (e4)
        for (t3 = 0; t3 < e4.length; t3++)
          r3[t3] = e4[t3];
      return r3;
    }, r2 = function() {
      throw Error("no PRNG");
    }, i2 = new Uint8Array(32);
    i2[0] = 9;
    var n2 = t2(), a2 = t2([1]), s2 = t2([56129, 1]), o2 = t2([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), c2 = t2([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), u2 = t2([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), h2 = t2([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), f2 = t2([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function d2(e4, t3, r3, i3) {
      return function(e5, t4, r4, i4, n3) {
        var a3, s3 = 0;
        for (a3 = 0; a3 < n3; a3++)
          s3 |= e5[t4 + a3] ^ r4[i4 + a3];
        return (1 & s3 - 1 >>> 8) - 1;
      }(e4, t3, r3, i3, 32);
    }
    function l2(e4, t3) {
      var r3;
      for (r3 = 0; r3 < 16; r3++)
        e4[r3] = 0 | t3[r3];
    }
    function p2(e4) {
      var t3, r3, i3 = 1;
      for (t3 = 0; t3 < 16; t3++)
        r3 = e4[t3] + i3 + 65535, i3 = Math.floor(r3 / 65536), e4[t3] = r3 - 65536 * i3;
      e4[0] += i3 - 1 + 37 * (i3 - 1);
    }
    function y2(e4, t3, r3) {
      for (var i3, n3 = ~(r3 - 1), a3 = 0; a3 < 16; a3++)
        i3 = n3 & (e4[a3] ^ t3[a3]), e4[a3] ^= i3, t3[a3] ^= i3;
    }
    function b2(e4, r3) {
      var i3, n3, a3, s3 = t2(), o3 = t2();
      for (i3 = 0; i3 < 16; i3++)
        o3[i3] = r3[i3];
      for (p2(o3), p2(o3), p2(o3), n3 = 0; n3 < 2; n3++) {
        for (s3[0] = o3[0] - 65517, i3 = 1; i3 < 15; i3++)
          s3[i3] = o3[i3] - 65535 - (s3[i3 - 1] >> 16 & 1), s3[i3 - 1] &= 65535;
        s3[15] = o3[15] - 32767 - (s3[14] >> 16 & 1), a3 = s3[15] >> 16 & 1, s3[14] &= 65535, y2(o3, s3, 1 - a3);
      }
      for (i3 = 0; i3 < 16; i3++)
        e4[2 * i3] = 255 & o3[i3], e4[2 * i3 + 1] = o3[i3] >> 8;
    }
    function m2(e4, t3) {
      var r3 = new Uint8Array(32), i3 = new Uint8Array(32);
      return b2(r3, e4), b2(i3, t3), d2(r3, 0, i3, 0);
    }
    function g2(e4) {
      var t3 = new Uint8Array(32);
      return b2(t3, e4), 1 & t3[0];
    }
    function w2(e4, t3) {
      var r3;
      for (r3 = 0; r3 < 16; r3++)
        e4[r3] = t3[2 * r3] + (t3[2 * r3 + 1] << 8);
      e4[15] &= 32767;
    }
    function v2(e4, t3, r3) {
      for (var i3 = 0; i3 < 16; i3++)
        e4[i3] = t3[i3] + r3[i3];
    }
    function _2(e4, t3, r3) {
      for (var i3 = 0; i3 < 16; i3++)
        e4[i3] = t3[i3] - r3[i3];
    }
    function k2(e4, t3, r3) {
      var i3, n3, a3 = 0, s3 = 0, o3 = 0, c3 = 0, u3 = 0, h3 = 0, f3 = 0, d3 = 0, l3 = 0, p3 = 0, y3 = 0, b3 = 0, m3 = 0, g3 = 0, w3 = 0, v3 = 0, _3 = 0, k3 = 0, A3 = 0, S3 = 0, E3 = 0, P3 = 0, x3 = 0, M3 = 0, C3 = 0, K3 = 0, D3 = 0, R3 = 0, U3 = 0, I3 = 0, B3 = 0, T3 = r3[0], z3 = r3[1], q3 = r3[2], O3 = r3[3], F2 = r3[4], N2 = r3[5], j2 = r3[6], L2 = r3[7], W2 = r3[8], H2 = r3[9], G2 = r3[10], V2 = r3[11], $2 = r3[12], Z2 = r3[13], Y2 = r3[14], X2 = r3[15];
      a3 += (i3 = t3[0]) * T3, s3 += i3 * z3, o3 += i3 * q3, c3 += i3 * O3, u3 += i3 * F2, h3 += i3 * N2, f3 += i3 * j2, d3 += i3 * L2, l3 += i3 * W2, p3 += i3 * H2, y3 += i3 * G2, b3 += i3 * V2, m3 += i3 * $2, g3 += i3 * Z2, w3 += i3 * Y2, v3 += i3 * X2, s3 += (i3 = t3[1]) * T3, o3 += i3 * z3, c3 += i3 * q3, u3 += i3 * O3, h3 += i3 * F2, f3 += i3 * N2, d3 += i3 * j2, l3 += i3 * L2, p3 += i3 * W2, y3 += i3 * H2, b3 += i3 * G2, m3 += i3 * V2, g3 += i3 * $2, w3 += i3 * Z2, v3 += i3 * Y2, _3 += i3 * X2, o3 += (i3 = t3[2]) * T3, c3 += i3 * z3, u3 += i3 * q3, h3 += i3 * O3, f3 += i3 * F2, d3 += i3 * N2, l3 += i3 * j2, p3 += i3 * L2, y3 += i3 * W2, b3 += i3 * H2, m3 += i3 * G2, g3 += i3 * V2, w3 += i3 * $2, v3 += i3 * Z2, _3 += i3 * Y2, k3 += i3 * X2, c3 += (i3 = t3[3]) * T3, u3 += i3 * z3, h3 += i3 * q3, f3 += i3 * O3, d3 += i3 * F2, l3 += i3 * N2, p3 += i3 * j2, y3 += i3 * L2, b3 += i3 * W2, m3 += i3 * H2, g3 += i3 * G2, w3 += i3 * V2, v3 += i3 * $2, _3 += i3 * Z2, k3 += i3 * Y2, A3 += i3 * X2, u3 += (i3 = t3[4]) * T3, h3 += i3 * z3, f3 += i3 * q3, d3 += i3 * O3, l3 += i3 * F2, p3 += i3 * N2, y3 += i3 * j2, b3 += i3 * L2, m3 += i3 * W2, g3 += i3 * H2, w3 += i3 * G2, v3 += i3 * V2, _3 += i3 * $2, k3 += i3 * Z2, A3 += i3 * Y2, S3 += i3 * X2, h3 += (i3 = t3[5]) * T3, f3 += i3 * z3, d3 += i3 * q3, l3 += i3 * O3, p3 += i3 * F2, y3 += i3 * N2, b3 += i3 * j2, m3 += i3 * L2, g3 += i3 * W2, w3 += i3 * H2, v3 += i3 * G2, _3 += i3 * V2, k3 += i3 * $2, A3 += i3 * Z2, S3 += i3 * Y2, E3 += i3 * X2, f3 += (i3 = t3[6]) * T3, d3 += i3 * z3, l3 += i3 * q3, p3 += i3 * O3, y3 += i3 * F2, b3 += i3 * N2, m3 += i3 * j2, g3 += i3 * L2, w3 += i3 * W2, v3 += i3 * H2, _3 += i3 * G2, k3 += i3 * V2, A3 += i3 * $2, S3 += i3 * Z2, E3 += i3 * Y2, P3 += i3 * X2, d3 += (i3 = t3[7]) * T3, l3 += i3 * z3, p3 += i3 * q3, y3 += i3 * O3, b3 += i3 * F2, m3 += i3 * N2, g3 += i3 * j2, w3 += i3 * L2, v3 += i3 * W2, _3 += i3 * H2, k3 += i3 * G2, A3 += i3 * V2, S3 += i3 * $2, E3 += i3 * Z2, P3 += i3 * Y2, x3 += i3 * X2, l3 += (i3 = t3[8]) * T3, p3 += i3 * z3, y3 += i3 * q3, b3 += i3 * O3, m3 += i3 * F2, g3 += i3 * N2, w3 += i3 * j2, v3 += i3 * L2, _3 += i3 * W2, k3 += i3 * H2, A3 += i3 * G2, S3 += i3 * V2, E3 += i3 * $2, P3 += i3 * Z2, x3 += i3 * Y2, M3 += i3 * X2, p3 += (i3 = t3[9]) * T3, y3 += i3 * z3, b3 += i3 * q3, m3 += i3 * O3, g3 += i3 * F2, w3 += i3 * N2, v3 += i3 * j2, _3 += i3 * L2, k3 += i3 * W2, A3 += i3 * H2, S3 += i3 * G2, E3 += i3 * V2, P3 += i3 * $2, x3 += i3 * Z2, M3 += i3 * Y2, C3 += i3 * X2, y3 += (i3 = t3[10]) * T3, b3 += i3 * z3, m3 += i3 * q3, g3 += i3 * O3, w3 += i3 * F2, v3 += i3 * N2, _3 += i3 * j2, k3 += i3 * L2, A3 += i3 * W2, S3 += i3 * H2, E3 += i3 * G2, P3 += i3 * V2, x3 += i3 * $2, M3 += i3 * Z2, C3 += i3 * Y2, K3 += i3 * X2, b3 += (i3 = t3[11]) * T3, m3 += i3 * z3, g3 += i3 * q3, w3 += i3 * O3, v3 += i3 * F2, _3 += i3 * N2, k3 += i3 * j2, A3 += i3 * L2, S3 += i3 * W2, E3 += i3 * H2, P3 += i3 * G2, x3 += i3 * V2, M3 += i3 * $2, C3 += i3 * Z2, K3 += i3 * Y2, D3 += i3 * X2, m3 += (i3 = t3[12]) * T3, g3 += i3 * z3, w3 += i3 * q3, v3 += i3 * O3, _3 += i3 * F2, k3 += i3 * N2, A3 += i3 * j2, S3 += i3 * L2, E3 += i3 * W2, P3 += i3 * H2, x3 += i3 * G2, M3 += i3 * V2, C3 += i3 * $2, K3 += i3 * Z2, D3 += i3 * Y2, R3 += i3 * X2, g3 += (i3 = t3[13]) * T3, w3 += i3 * z3, v3 += i3 * q3, _3 += i3 * O3, k3 += i3 * F2, A3 += i3 * N2, S3 += i3 * j2, E3 += i3 * L2, P3 += i3 * W2, x3 += i3 * H2, M3 += i3 * G2, C3 += i3 * V2, K3 += i3 * $2, D3 += i3 * Z2, R3 += i3 * Y2, U3 += i3 * X2, w3 += (i3 = t3[14]) * T3, v3 += i3 * z3, _3 += i3 * q3, k3 += i3 * O3, A3 += i3 * F2, S3 += i3 * N2, E3 += i3 * j2, P3 += i3 * L2, x3 += i3 * W2, M3 += i3 * H2, C3 += i3 * G2, K3 += i3 * V2, D3 += i3 * $2, R3 += i3 * Z2, U3 += i3 * Y2, I3 += i3 * X2, v3 += (i3 = t3[15]) * T3, s3 += 38 * (k3 += i3 * q3), o3 += 38 * (A3 += i3 * O3), c3 += 38 * (S3 += i3 * F2), u3 += 38 * (E3 += i3 * N2), h3 += 38 * (P3 += i3 * j2), f3 += 38 * (x3 += i3 * L2), d3 += 38 * (M3 += i3 * W2), l3 += 38 * (C3 += i3 * H2), p3 += 38 * (K3 += i3 * G2), y3 += 38 * (D3 += i3 * V2), b3 += 38 * (R3 += i3 * $2), m3 += 38 * (U3 += i3 * Z2), g3 += 38 * (I3 += i3 * Y2), w3 += 38 * (B3 += i3 * X2), a3 = (i3 = (a3 += 38 * (_3 += i3 * z3)) + (n3 = 1) + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), s3 = (i3 = s3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), o3 = (i3 = o3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), c3 = (i3 = c3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), u3 = (i3 = u3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), h3 = (i3 = h3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), f3 = (i3 = f3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), d3 = (i3 = d3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), l3 = (i3 = l3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), p3 = (i3 = p3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), y3 = (i3 = y3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), b3 = (i3 = b3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), m3 = (i3 = m3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), g3 = (i3 = g3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), w3 = (i3 = w3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), v3 = (i3 = v3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), a3 = (i3 = (a3 += n3 - 1 + 37 * (n3 - 1)) + (n3 = 1) + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), s3 = (i3 = s3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), o3 = (i3 = o3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), c3 = (i3 = c3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), u3 = (i3 = u3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), h3 = (i3 = h3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), f3 = (i3 = f3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), d3 = (i3 = d3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), l3 = (i3 = l3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), p3 = (i3 = p3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), y3 = (i3 = y3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), b3 = (i3 = b3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), m3 = (i3 = m3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), g3 = (i3 = g3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), w3 = (i3 = w3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), v3 = (i3 = v3 + n3 + 65535) - 65536 * (n3 = Math.floor(i3 / 65536)), a3 += n3 - 1 + 37 * (n3 - 1), e4[0] = a3, e4[1] = s3, e4[2] = o3, e4[3] = c3, e4[4] = u3, e4[5] = h3, e4[6] = f3, e4[7] = d3, e4[8] = l3, e4[9] = p3, e4[10] = y3, e4[11] = b3, e4[12] = m3, e4[13] = g3, e4[14] = w3, e4[15] = v3;
    }
    function A2(e4, t3) {
      k2(e4, t3, t3);
    }
    function S2(e4, r3) {
      var i3, n3 = t2();
      for (i3 = 0; i3 < 16; i3++)
        n3[i3] = r3[i3];
      for (i3 = 253; i3 >= 0; i3--)
        A2(n3, n3), i3 !== 2 && i3 !== 4 && k2(n3, n3, r3);
      for (i3 = 0; i3 < 16; i3++)
        e4[i3] = n3[i3];
    }
    function E2(e4, r3, i3) {
      var n3, a3, o3 = new Uint8Array(32), c3 = new Float64Array(80), u3 = t2(), h3 = t2(), f3 = t2(), d3 = t2(), l3 = t2(), p3 = t2();
      for (a3 = 0; a3 < 31; a3++)
        o3[a3] = r3[a3];
      for (o3[31] = 127 & r3[31] | 64, o3[0] &= 248, w2(c3, i3), a3 = 0; a3 < 16; a3++)
        h3[a3] = c3[a3], d3[a3] = u3[a3] = f3[a3] = 0;
      for (u3[0] = d3[0] = 1, a3 = 254; a3 >= 0; --a3)
        y2(u3, h3, n3 = o3[a3 >>> 3] >>> (7 & a3) & 1), y2(f3, d3, n3), v2(l3, u3, f3), _2(u3, u3, f3), v2(f3, h3, d3), _2(h3, h3, d3), A2(d3, l3), A2(p3, u3), k2(u3, f3, u3), k2(f3, h3, l3), v2(l3, u3, f3), _2(u3, u3, f3), A2(h3, u3), _2(f3, d3, p3), k2(u3, f3, s2), v2(u3, u3, d3), k2(f3, f3, u3), k2(u3, d3, p3), k2(d3, h3, c3), A2(h3, l3), y2(u3, h3, n3), y2(f3, d3, n3);
      for (a3 = 0; a3 < 16; a3++)
        c3[a3 + 16] = u3[a3], c3[a3 + 32] = f3[a3], c3[a3 + 48] = h3[a3], c3[a3 + 64] = d3[a3];
      var m3 = c3.subarray(32), g3 = c3.subarray(16);
      return S2(m3, m3), k2(g3, g3, m3), b2(e4, g3), 0;
    }
    function P2(e4, t3) {
      return E2(e4, t3, i2);
    }
    function x2(e4, r3) {
      var i3 = t2(), n3 = t2(), a3 = t2(), s3 = t2(), o3 = t2(), u3 = t2(), h3 = t2(), f3 = t2(), d3 = t2();
      _2(i3, e4[1], e4[0]), _2(d3, r3[1], r3[0]), k2(i3, i3, d3), v2(n3, e4[0], e4[1]), v2(d3, r3[0], r3[1]), k2(n3, n3, d3), k2(a3, e4[3], r3[3]), k2(a3, a3, c2), k2(s3, e4[2], r3[2]), v2(s3, s3, s3), _2(o3, n3, i3), _2(u3, s3, a3), v2(h3, s3, a3), v2(f3, n3, i3), k2(e4[0], o3, u3), k2(e4[1], f3, h3), k2(e4[2], h3, u3), k2(e4[3], o3, f3);
    }
    function M2(e4, t3, r3) {
      var i3;
      for (i3 = 0; i3 < 4; i3++)
        y2(e4[i3], t3[i3], r3);
    }
    function C2(e4, r3) {
      var i3 = t2(), n3 = t2(), a3 = t2();
      S2(a3, r3[2]), k2(i3, r3[0], a3), k2(n3, r3[1], a3), b2(e4, n3), e4[31] ^= g2(i3) << 7;
    }
    function K2(e4, t3, r3) {
      var i3, s3;
      for (l2(e4[0], n2), l2(e4[1], a2), l2(e4[2], a2), l2(e4[3], n2), s3 = 255; s3 >= 0; --s3)
        M2(e4, t3, i3 = r3[s3 / 8 | 0] >> (7 & s3) & 1), x2(t3, e4), x2(e4, e4), M2(e4, t3, i3);
    }
    function D2(e4, r3) {
      var i3 = [t2(), t2(), t2(), t2()];
      l2(i3[0], u2), l2(i3[1], h2), l2(i3[2], a2), k2(i3[3], u2, h2), K2(e4, i3, r3);
    }
    function R2(i3, n3, a3) {
      var s3, o3, c3 = [t2(), t2(), t2(), t2()];
      for (a3 || r2(n3, 32), (s3 = e3.hash(n3.subarray(0, 32)))[0] &= 248, s3[31] &= 127, s3[31] |= 64, D2(c3, s3), C2(i3, c3), o3 = 0; o3 < 32; o3++)
        n3[o3 + 32] = i3[o3];
      return 0;
    }
    var U2 = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function I2(e4, t3) {
      var r3, i3, n3, a3;
      for (i3 = 63; i3 >= 32; --i3) {
        for (r3 = 0, n3 = i3 - 32, a3 = i3 - 12; n3 < a3; ++n3)
          t3[n3] += r3 - 16 * t3[i3] * U2[n3 - (i3 - 32)], r3 = Math.floor((t3[n3] + 128) / 256), t3[n3] -= 256 * r3;
        t3[n3] += r3, t3[i3] = 0;
      }
      for (r3 = 0, n3 = 0; n3 < 32; n3++)
        t3[n3] += r3 - (t3[31] >> 4) * U2[n3], r3 = t3[n3] >> 8, t3[n3] &= 255;
      for (n3 = 0; n3 < 32; n3++)
        t3[n3] -= r3 * U2[n3];
      for (i3 = 0; i3 < 32; i3++)
        t3[i3 + 1] += t3[i3] >> 8, e4[i3] = 255 & t3[i3];
    }
    function B2(e4) {
      var t3, r3 = new Float64Array(64);
      for (t3 = 0; t3 < 64; t3++)
        r3[t3] = e4[t3];
      for (t3 = 0; t3 < 64; t3++)
        e4[t3] = 0;
      I2(e4, r3);
    }
    function T2(e4, r3) {
      var i3 = t2(), s3 = t2(), c3 = t2(), u3 = t2(), h3 = t2(), d3 = t2(), p3 = t2();
      return l2(e4[2], a2), w2(e4[1], r3), A2(c3, e4[1]), k2(u3, c3, o2), _2(c3, c3, e4[2]), v2(u3, e4[2], u3), A2(h3, u3), A2(d3, h3), k2(p3, d3, h3), k2(i3, p3, c3), k2(i3, i3, u3), function(e5, r4) {
        var i4, n3 = t2();
        for (i4 = 0; i4 < 16; i4++)
          n3[i4] = r4[i4];
        for (i4 = 250; i4 >= 0; i4--)
          A2(n3, n3), i4 !== 1 && k2(n3, n3, r4);
        for (i4 = 0; i4 < 16; i4++)
          e5[i4] = n3[i4];
      }(i3, i3), k2(i3, i3, c3), k2(i3, i3, u3), k2(i3, i3, u3), k2(e4[0], i3, u3), A2(s3, e4[0]), k2(s3, s3, u3), m2(s3, c3) && k2(e4[0], e4[0], f2), A2(s3, e4[0]), k2(s3, s3, u3), m2(s3, c3) ? -1 : (g2(e4[0]) === r3[31] >> 7 && _2(e4[0], n2, e4[0]), k2(e4[3], e4[0], e4[1]), 0);
    }
    var z2 = 64;
    function q2() {
      for (var e4 = 0; e4 < arguments.length; e4++)
        if (!(arguments[e4] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function O2(e4) {
      for (var t3 = 0; t3 < e4.length; t3++)
        e4[t3] = 0;
    }
    e3.scalarMult = function(e4, t3) {
      if (q2(e4, t3), e4.length !== 32)
        throw Error("bad n size");
      if (t3.length !== 32)
        throw Error("bad p size");
      var r3 = new Uint8Array(32);
      return E2(r3, e4, t3), r3;
    }, e3.box = {}, e3.box.keyPair = function() {
      var e4, t3, i3 = new Uint8Array(32), n3 = new Uint8Array(32);
      return e4 = i3, r2(t3 = n3, 32), P2(e4, t3), {publicKey: i3, secretKey: n3};
    }, e3.box.keyPair.fromSecretKey = function(e4) {
      if (q2(e4), e4.length !== 32)
        throw Error("bad secret key size");
      var t3 = new Uint8Array(32);
      return P2(t3, e4), {publicKey: t3, secretKey: new Uint8Array(e4)};
    }, e3.sign = function(r3, i3) {
      if (q2(r3, i3), i3.length !== 64)
        throw Error("bad secret key size");
      var n3 = new Uint8Array(z2 + r3.length);
      return function(r4, i4, n4, a3) {
        var s3, o3, c3, u3, h3, f3 = new Float64Array(64), d3 = [t2(), t2(), t2(), t2()];
        (s3 = e3.hash(a3.subarray(0, 32)))[0] &= 248, s3[31] &= 127, s3[31] |= 64;
        var l3 = n4 + 64;
        for (u3 = 0; u3 < n4; u3++)
          r4[64 + u3] = i4[u3];
        for (u3 = 0; u3 < 32; u3++)
          r4[32 + u3] = s3[32 + u3];
        for (B2(c3 = e3.hash(r4.subarray(32, l3))), D2(d3, c3), C2(r4, d3), u3 = 32; u3 < 64; u3++)
          r4[u3] = a3[u3];
        for (B2(o3 = e3.hash(r4.subarray(0, l3))), u3 = 0; u3 < 64; u3++)
          f3[u3] = 0;
        for (u3 = 0; u3 < 32; u3++)
          f3[u3] = c3[u3];
        for (u3 = 0; u3 < 32; u3++)
          for (h3 = 0; h3 < 32; h3++)
            f3[u3 + h3] += o3[u3] * s3[h3];
        I2(r4.subarray(32), f3);
      }(n3, r3, r3.length, i3), n3;
    }, e3.sign.detached = function(t3, r3) {
      for (var i3 = e3.sign(t3, r3), n3 = new Uint8Array(z2), a3 = 0; a3 < n3.length; a3++)
        n3[a3] = i3[a3];
      return n3;
    }, e3.sign.detached.verify = function(r3, i3, n3) {
      if (q2(r3, i3, n3), i3.length !== z2)
        throw Error("bad signature size");
      if (n3.length !== 32)
        throw Error("bad public key size");
      var a3, s3 = new Uint8Array(z2 + r3.length), o3 = new Uint8Array(z2 + r3.length);
      for (a3 = 0; a3 < z2; a3++)
        s3[a3] = i3[a3];
      for (a3 = 0; a3 < r3.length; a3++)
        s3[a3 + z2] = r3[a3];
      return function(r4, i4, n4, a4) {
        var s4, o4, c3 = new Uint8Array(32), u3 = [t2(), t2(), t2(), t2()], h3 = [t2(), t2(), t2(), t2()];
        if (n4 < 64)
          return -1;
        if (T2(h3, a4))
          return -1;
        for (s4 = 0; s4 < n4; s4++)
          r4[s4] = i4[s4];
        for (s4 = 0; s4 < 32; s4++)
          r4[s4 + 32] = a4[s4];
        if (B2(o4 = e3.hash(r4.subarray(0, n4))), K2(u3, h3, o4), D2(h3, i4.subarray(32)), x2(u3, h3), C2(c3, u3), n4 -= 64, d2(i4, 0, c3, 0)) {
          for (s4 = 0; s4 < n4; s4++)
            r4[s4] = 0;
          return -1;
        }
        for (s4 = 0; s4 < n4; s4++)
          r4[s4] = i4[s4 + 64];
        return n4;
      }(o3, s3, s3.length, n3) >= 0;
    }, e3.sign.keyPair = function() {
      var e4 = new Uint8Array(32), t3 = new Uint8Array(64);
      return R2(e4, t3), {publicKey: e4, secretKey: t3};
    }, e3.sign.keyPair.fromSecretKey = function(e4) {
      if (q2(e4), e4.length !== 64)
        throw Error("bad secret key size");
      for (var t3 = new Uint8Array(32), r3 = 0; r3 < t3.length; r3++)
        t3[r3] = e4[32 + r3];
      return {publicKey: t3, secretKey: new Uint8Array(e4)};
    }, e3.sign.keyPair.fromSeed = function(e4) {
      if (q2(e4), e4.length !== 32)
        throw Error("bad seed size");
      for (var t3 = new Uint8Array(32), r3 = new Uint8Array(64), i3 = 0; i3 < 32; i3++)
        r3[i3] = e4[i3];
      return R2(t3, r3, true), {publicKey: t3, secretKey: r3};
    }, e3.setPRNG = function(e4) {
      r2 = e4;
    }, function() {
      var t3 = typeof self != "undefined" ? self.crypto || self.msCrypto : null;
      if (t3 && t3.getRandomValues) {
        e3.setPRNG(function(e4, r3) {
          var i3, n3 = new Uint8Array(r3);
          for (i3 = 0; i3 < r3; i3 += 65536)
            t3.getRandomValues(n3.subarray(i3, i3 + Math.min(r3 - i3, 65536)));
          for (i3 = 0; i3 < r3; i3++)
            e4[i3] = n3[i3];
          O2(n3);
        });
      } else
        (t3 = void 0) && t3.randomBytes && e3.setPRNG(function(e4, r3) {
          var i3, n3 = t3.randomBytes(r3);
          for (i3 = 0; i3 < r3; i3++)
            e4[i3] = n3[i3];
          O2(n3);
        });
    }();
  }(e2.exports ? e2.exports : self.nacl = self.nacl || {});
});
const Fr = V.getNodeCrypto();
async function Nr(e2) {
  const t2 = new Uint8Array(e2);
  if (typeof crypto != "undefined" && crypto.getRandomValues)
    crypto.getRandomValues(t2);
  else if (Fr) {
    const e3 = Fr.randomBytes(t2.length);
    t2.set(e3);
  } else {
    if (!Lr.buffer)
      throw Error("No secure random number generator available.");
    await Lr.get(t2);
  }
  return t2;
}
async function jr(e2, t2) {
  const r2 = await V.getBigInteger();
  if (t2.lt(e2))
    throw Error("Illegal parameter value: max <= min");
  const i2 = t2.sub(e2), n2 = i2.byteLength();
  return new r2(await Nr(n2 + 8)).mod(i2).add(e2);
}
const Lr = new class {
  constructor() {
    this.buffer = null, this.size = null, this.callback = null;
  }
  init(e2, t2) {
    this.buffer = new Uint8Array(e2), this.size = 0, this.callback = t2;
  }
  set(e2) {
    if (!this.buffer)
      throw Error("RandomBuffer is not initialized");
    if (!(e2 instanceof Uint8Array))
      throw Error("Invalid type: buf not an Uint8Array");
    const t2 = this.buffer.length - this.size;
    e2.length > t2 && (e2 = e2.subarray(0, t2)), this.buffer.set(e2, this.size), this.size += e2.length;
  }
  async get(e2) {
    if (!this.buffer)
      throw Error("RandomBuffer is not initialized");
    if (!(e2 instanceof Uint8Array))
      throw Error("Invalid type: buf not an Uint8Array");
    if (this.size < e2.length) {
      if (!this.callback)
        throw Error("Random number buffer depleted");
      return await this.callback(), this.get(e2);
    }
    for (let t2 = 0; t2 < e2.length; t2++)
      e2[t2] = this.buffer[--this.size], this.buffer[this.size] = 0;
  }
}();
var Wr = /* @__PURE__ */ Object.freeze({__proto__: null, getRandomBytes: Nr, getRandomBigInteger: jr, randomBuffer: Lr});
async function Hr(e2, t2, r2) {
  const i2 = await V.getBigInteger(), n2 = new i2(1), a2 = n2.leftShift(new i2(e2 - 1)), s2 = new i2(30), o2 = [1, 6, 5, 4, 3, 2, 1, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1, 6, 5, 4, 3, 2, 1, 2], c2 = await jr(a2, a2.leftShift(n2));
  let u2 = c2.mod(s2).toNumber();
  do {
    c2.iadd(new i2(o2[u2])), u2 = (u2 + o2[u2]) % o2.length, c2.bitLength() > e2 && (c2.imod(a2.leftShift(n2)).iadd(a2), u2 = c2.mod(s2).toNumber());
  } while (!await Gr(c2, t2, r2));
  return c2;
}
async function Gr(e2, t2, r2) {
  return !(t2 && !e2.dec().gcd(t2).isOne()) && (!!await async function(e3) {
    const t3 = await V.getBigInteger();
    return Vr.every((r3) => e3.mod(new t3(r3)) !== 0);
  }(e2) && (!!await async function(e3, t3) {
    const r3 = await V.getBigInteger();
    return (t3 = t3 || new r3(2)).modExp(e3.dec(), e3).isOne();
  }(e2) && !!await async function(e3, t3, r3) {
    const i2 = await V.getBigInteger(), n2 = e3.bitLength();
    t3 || (t3 = Math.max(1, n2 / 48 | 0));
    const a2 = e3.dec();
    let s2 = 0;
    for (; !a2.getBit(s2); )
      s2++;
    const o2 = e3.rightShift(new i2(s2));
    for (; t3 > 0; t3--) {
      let t4, n3 = (r3 ? r3() : await jr(new i2(2), a2)).modExp(o2, e3);
      if (!n3.isOne() && !n3.equal(a2)) {
        for (t4 = 1; t4 < s2; t4++) {
          if (n3 = n3.mul(n3).mod(e3), n3.isOne())
            return false;
          if (n3.equal(a2))
            break;
        }
        if (t4 === s2)
          return false;
      }
    }
    return true;
  }(e2, r2)));
}
const Vr = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571, 3581, 3583, 3593, 3607, 3613, 3617, 3623, 3631, 3637, 3643, 3659, 3671, 3673, 3677, 3691, 3697, 3701, 3709, 3719, 3727, 3733, 3739, 3761, 3767, 3769, 3779, 3793, 3797, 3803, 3821, 3823, 3833, 3847, 3851, 3853, 3863, 3877, 3881, 3889, 3907, 3911, 3917, 3919, 3923, 3929, 3931, 3943, 3947, 3967, 3989, 4001, 4003, 4007, 4013, 4019, 4021, 4027, 4049, 4051, 4057, 4073, 4079, 4091, 4093, 4099, 4111, 4127, 4129, 4133, 4139, 4153, 4157, 4159, 4177, 4201, 4211, 4217, 4219, 4229, 4231, 4241, 4243, 4253, 4259, 4261, 4271, 4273, 4283, 4289, 4297, 4327, 4337, 4339, 4349, 4357, 4363, 4373, 4391, 4397, 4409, 4421, 4423, 4441, 4447, 4451, 4457, 4463, 4481, 4483, 4493, 4507, 4513, 4517, 4519, 4523, 4547, 4549, 4561, 4567, 4583, 4591, 4597, 4603, 4621, 4637, 4639, 4643, 4649, 4651, 4657, 4663, 4673, 4679, 4691, 4703, 4721, 4723, 4729, 4733, 4751, 4759, 4783, 4787, 4789, 4793, 4799, 4801, 4813, 4817, 4831, 4861, 4871, 4877, 4889, 4903, 4909, 4919, 4931, 4933, 4937, 4943, 4951, 4957, 4967, 4969, 4973, 4987, 4993, 4999];
const $r = [];
async function Zr(e2, t2) {
  const r2 = e2.length;
  if (r2 > t2 - 11)
    throw Error("Message too long");
  const i2 = await async function(e3) {
    const t3 = new Uint8Array(e3);
    let r3 = 0;
    for (; r3 < e3; ) {
      const i3 = await Nr(e3 - r3);
      for (let e4 = 0; e4 < i3.length; e4++)
        i3[e4] !== 0 && (t3[r3++] = i3[e4]);
    }
    return t3;
  }(t2 - r2 - 3), n2 = new Uint8Array(t2);
  return n2[1] = 2, n2.set(i2, 2), n2.set(e2, t2 - r2), n2;
}
function Yr(e2, t2) {
  let r2 = 2, i2 = 1;
  for (let t3 = r2; t3 < e2.length; t3++)
    i2 &= e2[t3] !== 0, r2 += i2;
  const n2 = r2 - 2, a2 = e2.subarray(r2 + 1), s2 = e2[0] === 0 & e2[1] === 2 & n2 >= 8 & !i2;
  if (t2)
    return V.selectUint8Array(s2, a2, t2);
  if (s2)
    return a2;
  throw Error("Decryption error");
}
async function Xr(e2, t2, r2) {
  let i2;
  if (t2.length !== zr.getHashByteLength(e2))
    throw Error("Invalid hash length");
  const n2 = new Uint8Array($r[e2].length);
  for (i2 = 0; i2 < $r[e2].length; i2++)
    n2[i2] = $r[e2][i2];
  const a2 = n2.length + t2.length;
  if (r2 < a2 + 11)
    throw Error("Intended encoded message length too short");
  const s2 = new Uint8Array(r2 - a2 - 3).fill(255), o2 = new Uint8Array(r2);
  return o2[1] = 1, o2.set(s2, 2), o2.set(n2, r2 - a2), o2.set(t2, r2 - t2.length), o2;
}
$r[1] = [48, 32, 48, 12, 6, 8, 42, 134, 72, 134, 247, 13, 2, 5, 5, 0, 4, 16], $r[2] = [48, 33, 48, 9, 6, 5, 43, 14, 3, 2, 26, 5, 0, 4, 20], $r[3] = [48, 33, 48, 9, 6, 5, 43, 36, 3, 2, 1, 5, 0, 4, 20], $r[8] = [48, 49, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 1, 5, 0, 4, 32], $r[9] = [48, 65, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 2, 5, 0, 4, 48], $r[10] = [48, 81, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 3, 5, 0, 4, 64], $r[11] = [48, 45, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 4, 5, 0, 4, 28];
var Qr = /* @__PURE__ */ Object.freeze({__proto__: null, emeEncode: Zr, emeDecode: Yr, emsaEncode: Xr});
const Jr = V.getWebCrypto(), ei = V.getNodeCrypto(), ti = void 0, ri = ei ? ti.define("RSAPrivateKey", function() {
  this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
}) : void 0, ii = ei ? ti.define("RSAPubliceKey", function() {
  this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
}) : void 0;
var ni = /* @__PURE__ */ Object.freeze({__proto__: null, sign: async function(e2, t2, r2, i2, n2, a2, s2, o2, c2) {
  if (t2 && !V.isStream(t2)) {
    if (V.getWebCrypto())
      try {
        return await async function(e3, t3, r3, i3, n3, a3, s3, o3) {
          const c3 = await async function(e4, t4, r4, i4, n4, a4) {
            const s4 = await V.getBigInteger(), o4 = new s4(i4), c4 = new s4(n4), u3 = new s4(r4);
            let h3 = u3.mod(c4.dec()), f2 = u3.mod(o4.dec());
            return f2 = f2.toUint8Array(), h3 = h3.toUint8Array(), {kty: "RSA", n: ee(e4, true), e: ee(t4, true), d: ee(r4, true), p: ee(n4, true), q: ee(i4, true), dp: ee(h3, true), dq: ee(f2, true), qi: ee(a4, true), ext: true};
          }(r3, i3, n3, a3, s3, o3), u2 = {name: "RSASSA-PKCS1-v1_5", hash: {name: e3}}, h2 = await Jr.importKey("jwk", c3, u2, false, ["sign"]);
          return new Uint8Array(await Jr.sign("RSASSA-PKCS1-v1_5", h2, t3));
        }(re.read(re.webHash, e2), t2, r2, i2, n2, a2, s2, o2);
      } catch (e3) {
        V.printDebugError(e3);
      }
    else if (V.getNodeCrypto())
      return async function(e3, t3, r3, i3, n3, a3, s3, o3) {
        const {default: c3} = await Promise.resolve().then(function() {
          return Fd;
        }), u2 = new c3(a3), h2 = new c3(s3), f2 = new c3(n3), d2 = f2.mod(h2.subn(1)), l2 = f2.mod(u2.subn(1)), p2 = ei.createSign(re.read(re.hash, e3));
        p2.write(t3), p2.end();
        const y2 = {version: 0, modulus: new c3(r3), publicExponent: new c3(i3), privateExponent: new c3(n3), prime1: new c3(s3), prime2: new c3(a3), exponent1: d2, exponent2: l2, coefficient: new c3(o3)};
        if (ei.createPrivateKey !== void 0) {
          const e4 = ri.encode(y2, "der");
          return new Uint8Array(p2.sign({key: e4, format: "der", type: "pkcs1"}));
        }
        const b2 = ri.encode(y2, "pem", {label: "RSA PRIVATE KEY"});
        return new Uint8Array(p2.sign(b2));
      }(e2, t2, r2, i2, n2, a2, s2, o2);
  }
  return async function(e3, t3, r3, i3) {
    const n3 = await V.getBigInteger();
    t3 = new n3(t3);
    const a3 = new n3(await Xr(e3, i3, t3.byteLength()));
    if (r3 = new n3(r3), a3.gte(t3))
      throw Error("Message size cannot exceed modulus size");
    return a3.modExp(r3, t3).toUint8Array("be", t3.byteLength());
  }(e2, r2, n2, c2);
}, verify: async function(e2, t2, r2, i2, n2, a2) {
  if (t2 && !V.isStream(t2)) {
    if (V.getWebCrypto())
      try {
        return await async function(e3, t3, r3, i3, n3) {
          const a3 = function(e4, t4) {
            return {kty: "RSA", n: ee(e4, true), e: ee(t4, true), ext: true};
          }(i3, n3), s2 = await Jr.importKey("jwk", a3, {name: "RSASSA-PKCS1-v1_5", hash: {name: e3}}, false, ["verify"]);
          return Jr.verify("RSASSA-PKCS1-v1_5", s2, r3, t3);
        }(re.read(re.webHash, e2), t2, r2, i2, n2);
      } catch (e3) {
        V.printDebugError(e3);
      }
    else if (V.getNodeCrypto())
      return async function(e3, t3, r3, i3, n3) {
        const {default: a3} = await Promise.resolve().then(function() {
          return Fd;
        }), s2 = ei.createVerify(re.read(re.hash, e3));
        s2.write(t3), s2.end();
        const o2 = {modulus: new a3(i3), publicExponent: new a3(n3)};
        let c2;
        if (ei.createPrivateKey !== void 0) {
          c2 = {key: ii.encode(o2, "der"), format: "der", type: "pkcs1"};
        } else
          c2 = ii.encode(o2, "pem", {label: "RSA PUBLIC KEY"});
        try {
          return await s2.verify(c2, r3);
        } catch (e4) {
          return false;
        }
      }(e2, t2, r2, i2, n2);
  }
  return async function(e3, t3, r3, i3, n3) {
    const a3 = await V.getBigInteger();
    if (r3 = new a3(r3), t3 = new a3(t3), i3 = new a3(i3), t3.gte(r3))
      throw Error("Signature size cannot exceed modulus size");
    const s2 = t3.modExp(i3, r3).toUint8Array("be", r3.byteLength()), o2 = await Xr(e3, n3, r3.byteLength());
    return V.equalsUint8Array(s2, o2);
  }(e2, r2, i2, n2, a2);
}, encrypt: async function(e2, t2, r2) {
  return V.getNodeCrypto() ? async function(e3, t3, r3) {
    const {default: i2} = await Promise.resolve().then(function() {
      return Fd;
    }), n2 = {modulus: new i2(t3), publicExponent: new i2(r3)};
    let a2;
    if (ei.createPrivateKey !== void 0) {
      a2 = {key: ii.encode(n2, "der"), format: "der", type: "pkcs1", padding: ei.constants.RSA_PKCS1_PADDING};
    } else {
      a2 = {key: ii.encode(n2, "pem", {label: "RSA PUBLIC KEY"}), padding: ei.constants.RSA_PKCS1_PADDING};
    }
    return new Uint8Array(ei.publicEncrypt(a2, e3));
  }(e2, t2, r2) : async function(e3, t3, r3) {
    const i2 = await V.getBigInteger();
    if (t3 = new i2(t3), e3 = new i2(await Zr(e3, t3.byteLength())), r3 = new i2(r3), e3.gte(t3))
      throw Error("Message size cannot exceed modulus size");
    return e3.modExp(r3, t3).toUint8Array("be", t3.byteLength());
  }(e2, t2, r2);
}, decrypt: async function(e2, t2, r2, i2, n2, a2, s2, o2) {
  return V.getNodeCrypto() ? async function(e3, t3, r3, i3, n3, a3, s3, o3) {
    const {default: c2} = await Promise.resolve().then(function() {
      return Fd;
    }), u2 = new c2(n3), h2 = new c2(a3), f2 = new c2(i3), d2 = f2.mod(h2.subn(1)), l2 = f2.mod(u2.subn(1)), p2 = {version: 0, modulus: new c2(t3), publicExponent: new c2(r3), privateExponent: new c2(i3), prime1: new c2(a3), prime2: new c2(n3), exponent1: d2, exponent2: l2, coefficient: new c2(s3)};
    let y2;
    if (ei.createPrivateKey !== void 0) {
      y2 = {key: ri.encode(p2, "der"), format: "der", type: "pkcs1", padding: ei.constants.RSA_PKCS1_PADDING};
    } else {
      y2 = {key: ri.encode(p2, "pem", {label: "RSA PRIVATE KEY"}), padding: ei.constants.RSA_PKCS1_PADDING};
    }
    try {
      return new Uint8Array(ei.privateDecrypt(y2, e3));
    } catch (e4) {
      if (o3)
        return o3;
      throw Error("Decryption error");
    }
  }(e2, t2, r2, i2, n2, a2, s2, o2) : async function(e3, t3, r3, i3, n3, a3, s3, o3) {
    const c2 = await V.getBigInteger();
    if (e3 = new c2(e3), t3 = new c2(t3), r3 = new c2(r3), i3 = new c2(i3), n3 = new c2(n3), a3 = new c2(a3), s3 = new c2(s3), e3.gte(t3))
      throw Error("Data too large.");
    const u2 = i3.mod(a3.dec()), h2 = i3.mod(n3.dec()), f2 = (await jr(new c2(2), t3)).mod(t3), d2 = f2.modInv(t3).modExp(r3, t3), l2 = (e3 = e3.mul(d2).mod(t3)).modExp(h2, n3), p2 = e3.modExp(u2, a3);
    let y2 = s3.mul(p2.sub(l2)).mod(a3).mul(n3).add(l2);
    return y2 = y2.mul(f2).mod(t3), Yr(y2.toUint8Array("be", t3.byteLength()), o3);
  }(e2, t2, r2, i2, n2, a2, s2, o2);
}, generate: async function(e2, t2) {
  if (t2 = new (await V.getBigInteger())(t2), V.getWebCrypto()) {
    const r3 = {name: "RSASSA-PKCS1-v1_5", modulusLength: e2, publicExponent: t2.toUint8Array(), hash: {name: "SHA-1"}}, i3 = await Jr.generateKey(r3, true, ["sign", "verify"]), n3 = await Jr.exportKey("jwk", i3.privateKey);
    return {n: J(n3.n), e: t2.toUint8Array(), d: J(n3.d), p: J(n3.q), q: J(n3.p), u: J(n3.qi)};
  }
  if (V.getNodeCrypto() && ei.generateKeyPair && ri) {
    const r3 = {modulusLength: e2, publicExponent: t2.toNumber(), publicKeyEncoding: {type: "pkcs1", format: "der"}, privateKeyEncoding: {type: "pkcs1", format: "der"}}, i3 = await new Promise((e3, t3) => ei.generateKeyPair("rsa", r3, (r4, i4, n3) => {
      r4 ? t3(r4) : e3(ri.decode(n3, "der"));
    }));
    return {n: i3.modulus.toArrayLike(Uint8Array), e: i3.publicExponent.toArrayLike(Uint8Array), d: i3.privateExponent.toArrayLike(Uint8Array), p: i3.prime2.toArrayLike(Uint8Array), q: i3.prime1.toArrayLike(Uint8Array), u: i3.coefficient.toArrayLike(Uint8Array)};
  }
  let r2, i2, n2;
  do {
    i2 = await Hr(e2 - (e2 >> 1), t2, 40), r2 = await Hr(e2 >> 1, t2, 40), n2 = r2.mul(i2);
  } while (n2.bitLength() !== e2);
  const a2 = r2.dec().imul(i2.dec());
  return i2.lt(r2) && ([r2, i2] = [i2, r2]), {n: n2.toUint8Array(), e: t2.toUint8Array(), d: t2.modInv(a2).toUint8Array(), p: r2.toUint8Array(), q: i2.toUint8Array(), u: r2.modInv(i2).toUint8Array()};
}, validateParams: async function(e2, t2, r2, i2, n2, a2) {
  const s2 = await V.getBigInteger();
  if (e2 = new s2(e2), i2 = new s2(i2), n2 = new s2(n2), !i2.mul(n2).equal(e2))
    return false;
  const o2 = new s2(2);
  if (a2 = new s2(a2), !i2.mul(a2).mod(n2).isOne())
    return false;
  t2 = new s2(t2), r2 = new s2(r2);
  const c2 = new s2(Math.floor(e2.bitLength() / 3)), u2 = await jr(o2, o2.leftShift(c2)), h2 = u2.mul(r2).mul(t2);
  return !(!h2.mod(i2.dec()).equal(u2) || !h2.mod(n2.dec()).equal(u2));
}});
var ai = /* @__PURE__ */ Object.freeze({__proto__: null, encrypt: async function(e2, t2, r2, i2) {
  const n2 = await V.getBigInteger();
  t2 = new n2(t2), r2 = new n2(r2), i2 = new n2(i2);
  const a2 = new n2(await Zr(e2, t2.byteLength())), s2 = await jr(new n2(1), t2.dec());
  return {c1: r2.modExp(s2, t2).toUint8Array(), c2: i2.modExp(s2, t2).imul(a2).imod(t2).toUint8Array()};
}, decrypt: async function(e2, t2, r2, i2, n2) {
  const a2 = await V.getBigInteger();
  return e2 = new a2(e2), t2 = new a2(t2), r2 = new a2(r2), i2 = new a2(i2), Yr(e2.modExp(i2, r2).modInv(r2).imul(t2).imod(r2).toUint8Array("be", r2.byteLength()), n2);
}, validateParams: async function(e2, t2, r2, i2) {
  const n2 = await V.getBigInteger();
  e2 = new n2(e2), t2 = new n2(t2), r2 = new n2(r2);
  const a2 = new n2(1);
  if (t2.lte(a2) || t2.gte(e2))
    return false;
  const s2 = new n2(e2.bitLength()), o2 = new n2(1023);
  if (s2.lt(o2))
    return false;
  if (!t2.modExp(e2.dec(), e2).isOne())
    return false;
  let c2 = t2;
  const u2 = new n2(1), h2 = new n2(2).leftShift(new n2(17));
  for (; u2.lt(h2); ) {
    if (c2 = c2.mul(t2).imod(e2), c2.isOne())
      return false;
    u2.iinc();
  }
  i2 = new n2(i2);
  const f2 = new n2(2), d2 = await jr(f2.leftShift(s2.dec()), f2.leftShift(s2)), l2 = e2.dec().imul(d2).iadd(i2);
  return !!r2.equal(t2.modExp(l2, e2));
}});
class si {
  constructor(e2) {
    if (e2 instanceof si)
      this.oid = e2.oid;
    else if (V.isArray(e2) || V.isUint8Array(e2)) {
      if ((e2 = new Uint8Array(e2))[0] === 6) {
        if (e2[1] !== e2.length - 2)
          throw Error("Length mismatch in DER encoded oid");
        e2 = e2.subarray(2);
      }
      this.oid = e2;
    } else
      this.oid = "";
  }
  read(e2) {
    if (e2.length >= 1) {
      const t2 = e2[0];
      if (e2.length >= 1 + t2)
        return this.oid = e2.subarray(1, 1 + t2), 1 + this.oid.length;
    }
    throw Error("Invalid oid");
  }
  write() {
    return V.concatUint8Array([new Uint8Array([this.oid.length]), this.oid]);
  }
  toHex() {
    return V.uint8ArrayToHex(this.oid);
  }
  getName() {
    const e2 = this.toHex();
    if (re.curve[e2])
      return re.write(re.curve, e2);
    throw Error("Unknown curve object identifier.");
  }
}
function oi(e2, t2) {
  return e2.keyPair({priv: t2});
}
function ci(e2, t2) {
  const r2 = e2.keyPair({pub: t2});
  if (r2.validate().result !== true)
    throw Error("Invalid elliptic public key");
  return r2;
}
async function ui(e2) {
  if (!ie.useIndutnyElliptic)
    throw Error("This curve is only supported in the full build of OpenPGP.js");
  const {default: t2} = await Promise.resolve().then(function() {
    return np;
  });
  return new t2.ec(e2);
}
function hi(e2) {
  let t2, r2 = 0;
  const i2 = e2[0];
  return i2 < 192 ? ([r2] = e2, t2 = 1) : i2 < 255 ? (r2 = (e2[0] - 192 << 8) + e2[1] + 192, t2 = 2) : i2 === 255 && (r2 = V.readNumber(e2.subarray(1, 5)), t2 = 5), {len: r2, offset: t2};
}
function fi(e2) {
  return e2 < 192 ? new Uint8Array([e2]) : e2 > 191 && e2 < 8384 ? new Uint8Array([192 + (e2 - 192 >> 8), e2 - 192 & 255]) : V.concatUint8Array([new Uint8Array([255]), V.writeNumber(e2, 4)]);
}
function di(e2) {
  if (e2 < 0 || e2 > 30)
    throw Error("Partial Length power must be between 1 and 30");
  return new Uint8Array([224 + e2]);
}
function li(e2) {
  return new Uint8Array([192 | e2]);
}
function pi(e2, t2) {
  return V.concatUint8Array([li(e2), fi(t2)]);
}
function yi(e2) {
  return [re.packet.literalData, re.packet.compressedData, re.packet.symmetricallyEncryptedData, re.packet.symEncryptedIntegrityProtectedData, re.packet.aeadEncryptedData].includes(e2);
}
async function bi(e2, t2) {
  const r2 = K(e2);
  let i2, n2;
  try {
    const s2 = await r2.peekBytes(2);
    if (!s2 || s2.length < 2 || (128 & s2[0]) == 0)
      throw Error("Error during parsing. This message / key probably does not conform to a valid OpenPGP format.");
    const o2 = await r2.readByte();
    let c2, u2, h2 = -1, f2 = -1;
    f2 = 0, (64 & o2) != 0 && (f2 = 1), f2 ? h2 = 63 & o2 : (h2 = (63 & o2) >> 2, u2 = 3 & o2);
    const d2 = yi(h2);
    let l2, p2 = null;
    if (d2) {
      if (V.isStream(e2) === "array") {
        const e3 = new a();
        i2 = D(e3), p2 = e3;
      } else {
        const e3 = new S();
        i2 = D(e3.writable), p2 = e3.readable;
      }
      n2 = t2({tag: h2, packet: p2});
    } else
      p2 = [];
    do {
      if (f2) {
        const e3 = await r2.readByte();
        if (l2 = false, e3 < 192)
          c2 = e3;
        else if (e3 >= 192 && e3 < 224)
          c2 = (e3 - 192 << 8) + await r2.readByte() + 192;
        else if (e3 > 223 && e3 < 255) {
          if (c2 = 1 << (31 & e3), l2 = true, !d2)
            throw new TypeError("This packet type does not support partial lengths.");
        } else
          c2 = await r2.readByte() << 24 | await r2.readByte() << 16 | await r2.readByte() << 8 | await r2.readByte();
      } else
        switch (u2) {
          case 0:
            c2 = await r2.readByte();
            break;
          case 1:
            c2 = await r2.readByte() << 8 | await r2.readByte();
            break;
          case 2:
            c2 = await r2.readByte() << 24 | await r2.readByte() << 16 | await r2.readByte() << 8 | await r2.readByte();
            break;
          default:
            c2 = 1 / 0;
        }
      if (c2 > 0) {
        let e3 = 0;
        for (; ; ) {
          i2 && await i2.ready;
          const {done: t3, value: n3} = await r2.read();
          if (t3) {
            if (c2 === 1 / 0)
              break;
            throw Error("Unexpected end of packet");
          }
          const a2 = c2 === 1 / 0 ? n3 : n3.subarray(0, c2 - e3);
          if (i2 ? await i2.write(a2) : p2.push(a2), e3 += n3.length, e3 >= c2) {
            r2.unshift(n3.subarray(c2 - e3 + n3.length));
            break;
          }
        }
      }
    } while (l2);
    const y2 = await r2.peekBytes(d2 ? 1 / 0 : 2);
    return i2 ? (await i2.ready, await i2.close()) : (p2 = V.concatUint8Array(p2), await t2({tag: h2, packet: p2})), !y2 || !y2.length;
  } catch (e3) {
    if (i2)
      return await i2.abort(e3), true;
    throw e3;
  } finally {
    i2 && await n2, r2.releaseLock();
  }
}
class mi extends Error {
  constructor(...e2) {
    super(...e2), Error.captureStackTrace && Error.captureStackTrace(this, mi), this.name = "UnsupportedError";
  }
}
class gi {
  constructor(e2, t2) {
    this.tag = e2, this.rawContent = t2;
  }
  write() {
    return this.rawContent;
  }
}
const wi = V.getWebCrypto(), vi = V.getNodeCrypto(), _i = {p256: "P-256", p384: "P-384", p521: "P-521"}, ki = vi ? vi.getCurves() : [], Ai = vi ? {secp256k1: ki.includes("secp256k1") ? "secp256k1" : void 0, p256: ki.includes("prime256v1") ? "prime256v1" : void 0, p384: ki.includes("secp384r1") ? "secp384r1" : void 0, p521: ki.includes("secp521r1") ? "secp521r1" : void 0, ed25519: ki.includes("ED25519") ? "ED25519" : void 0, curve25519: ki.includes("X25519") ? "X25519" : void 0, brainpoolP256r1: ki.includes("brainpoolP256r1") ? "brainpoolP256r1" : void 0, brainpoolP384r1: ki.includes("brainpoolP384r1") ? "brainpoolP384r1" : void 0, brainpoolP512r1: ki.includes("brainpoolP512r1") ? "brainpoolP512r1" : void 0} : {}, Si = {p256: {oid: [6, 8, 42, 134, 72, 206, 61, 3, 1, 7], keyType: re.publicKey.ecdsa, hash: re.hash.sha256, cipher: re.symmetric.aes128, node: Ai.p256, web: _i.p256, payloadSize: 32, sharedSize: 256}, p384: {oid: [6, 5, 43, 129, 4, 0, 34], keyType: re.publicKey.ecdsa, hash: re.hash.sha384, cipher: re.symmetric.aes192, node: Ai.p384, web: _i.p384, payloadSize: 48, sharedSize: 384}, p521: {oid: [6, 5, 43, 129, 4, 0, 35], keyType: re.publicKey.ecdsa, hash: re.hash.sha512, cipher: re.symmetric.aes256, node: Ai.p521, web: _i.p521, payloadSize: 66, sharedSize: 528}, secp256k1: {oid: [6, 5, 43, 129, 4, 0, 10], keyType: re.publicKey.ecdsa, hash: re.hash.sha256, cipher: re.symmetric.aes128, node: Ai.secp256k1, payloadSize: 32}, ed25519: {oid: [6, 9, 43, 6, 1, 4, 1, 218, 71, 15, 1], keyType: re.publicKey.eddsa, hash: re.hash.sha512, node: false, payloadSize: 32}, curve25519: {oid: [6, 10, 43, 6, 1, 4, 1, 151, 85, 1, 5, 1], keyType: re.publicKey.ecdh, hash: re.hash.sha256, cipher: re.symmetric.aes128, node: false, payloadSize: 32}, brainpoolP256r1: {oid: [6, 9, 43, 36, 3, 3, 2, 8, 1, 1, 7], keyType: re.publicKey.ecdsa, hash: re.hash.sha256, cipher: re.symmetric.aes128, node: Ai.brainpoolP256r1, payloadSize: 32}, brainpoolP384r1: {oid: [6, 9, 43, 36, 3, 3, 2, 8, 1, 1, 11], keyType: re.publicKey.ecdsa, hash: re.hash.sha384, cipher: re.symmetric.aes192, node: Ai.brainpoolP384r1, payloadSize: 48}, brainpoolP512r1: {oid: [6, 9, 43, 36, 3, 3, 2, 8, 1, 1, 13], keyType: re.publicKey.ecdsa, hash: re.hash.sha512, cipher: re.symmetric.aes256, node: Ai.brainpoolP512r1, payloadSize: 64}};
class Ei {
  constructor(e2, t2) {
    try {
      (V.isArray(e2) || V.isUint8Array(e2)) && (e2 = new si(e2)), e2 instanceof si && (e2 = e2.getName()), this.name = re.write(re.curve, e2);
    } catch (e3) {
      throw new mi("Unknown curve");
    }
    t2 = t2 || Si[this.name], this.keyType = t2.keyType, this.oid = t2.oid, this.hash = t2.hash, this.cipher = t2.cipher, this.node = t2.node && Si[this.name], this.web = t2.web && Si[this.name], this.payloadSize = t2.payloadSize, this.web && V.getWebCrypto() ? this.type = "web" : this.node && V.getNodeCrypto() ? this.type = "node" : this.name === "curve25519" ? this.type = "curve25519" : this.name === "ed25519" && (this.type = "ed25519");
  }
  async genKeyPair() {
    let e2;
    switch (this.type) {
      case "web":
        try {
          return await async function(e3) {
            const t3 = await wi.generateKey({name: "ECDSA", namedCurve: _i[e3]}, true, ["sign", "verify"]), r2 = await wi.exportKey("jwk", t3.privateKey);
            return {publicKey: xi(await wi.exportKey("jwk", t3.publicKey)), privateKey: J(r2.d)};
          }(this.name);
        } catch (e3) {
          V.printDebugError("Browser did not support generating ec key " + e3.message);
          break;
        }
      case "node":
        return async function(e3) {
          const t3 = vi.createECDH(Ai[e3]);
          return await t3.generateKeys(), {publicKey: new Uint8Array(t3.getPublicKey()), privateKey: new Uint8Array(t3.getPrivateKey())};
        }(this.name);
      case "curve25519": {
        const t3 = await Nr(32);
        t3[0] = 127 & t3[0] | 64, t3[31] &= 248;
        const r2 = t3.slice().reverse();
        e2 = Or.box.keyPair.fromSecretKey(r2);
        return {publicKey: V.concatUint8Array([new Uint8Array([64]), e2.publicKey]), privateKey: t3};
      }
      case "ed25519": {
        const e3 = await Nr(32), t3 = Or.sign.keyPair.fromSeed(e3);
        return {publicKey: V.concatUint8Array([new Uint8Array([64]), t3.publicKey]), privateKey: e3};
      }
    }
    const t2 = await ui(this.name);
    return e2 = await t2.genKeyPair({entropy: V.uint8ArrayToString(await Nr(32))}), {publicKey: new Uint8Array(e2.getPublic("array", false)), privateKey: e2.getPrivate().toArrayLike(Uint8Array)};
  }
}
async function Pi(e2, t2, r2, i2) {
  const n2 = {p256: true, p384: true, p521: true, secp256k1: true, curve25519: e2 === re.publicKey.ecdh, brainpoolP256r1: true, brainpoolP384r1: true, brainpoolP512r1: true}, a2 = t2.getName();
  if (!n2[a2])
    return false;
  if (a2 === "curve25519") {
    i2 = i2.slice().reverse();
    const {publicKey: e3} = Or.box.keyPair.fromSecretKey(i2);
    r2 = new Uint8Array(r2);
    const t3 = new Uint8Array([64, ...e3]);
    return !!V.equalsUint8Array(t3, r2);
  }
  const s2 = await ui(a2);
  try {
    r2 = ci(s2, r2).getPublic();
  } catch (e3) {
    return false;
  }
  return !!oi(s2, i2).getPublic().eq(r2);
}
function xi(e2) {
  const t2 = J(e2.x), r2 = J(e2.y), i2 = new Uint8Array(t2.length + r2.length + 1);
  return i2[0] = 4, i2.set(t2, 1), i2.set(r2, t2.length + 1), i2;
}
function Mi(e2, t2, r2) {
  const i2 = e2, n2 = r2.slice(1, i2 + 1), a2 = r2.slice(i2 + 1, 2 * i2 + 1);
  return {kty: "EC", crv: t2, x: ee(n2, true), y: ee(a2, true), ext: true};
}
function Ci(e2, t2, r2, i2) {
  const n2 = Mi(e2, t2, r2);
  return n2.d = ee(i2, true), n2;
}
const Ki = V.getWebCrypto(), Di = V.getNodeCrypto();
async function Ri(e2, t2, r2, i2, n2, a2) {
  const s2 = new Ei(e2);
  if (r2 && !V.isStream(r2)) {
    const e3 = {publicKey: i2, privateKey: n2};
    switch (s2.type) {
      case "web":
        try {
          return await async function(e4, t3, r3, i3) {
            const n3 = e4.payloadSize, a3 = Ci(e4.payloadSize, _i[e4.name], i3.publicKey, i3.privateKey), s3 = await Ki.importKey("jwk", a3, {name: "ECDSA", namedCurve: _i[e4.name], hash: {name: re.read(re.webHash, e4.hash)}}, false, ["sign"]), o2 = new Uint8Array(await Ki.sign({name: "ECDSA", namedCurve: _i[e4.name], hash: {name: re.read(re.webHash, t3)}}, s3, r3));
            return {r: o2.slice(0, n3), s: o2.slice(n3, n3 << 1)};
          }(s2, t2, r2, e3);
        } catch (e4) {
          if (s2.name !== "p521" && (e4.name === "DataError" || e4.name === "OperationError"))
            throw e4;
          V.printDebugError("Browser did not support signing: " + e4.message);
        }
        break;
      case "node": {
        const i3 = await async function(e4, t3, r3, i4) {
          const n3 = Di.createSign(re.read(re.hash, t3));
          n3.write(r3), n3.end();
          const a3 = Ti.encode({version: 1, parameters: e4.oid, privateKey: Array.from(i4.privateKey), publicKey: {unused: 0, data: Array.from(i4.publicKey)}}, "pem", {label: "EC PRIVATE KEY"});
          return Bi.decode(n3.sign(a3), "der");
        }(s2, t2, r2, e3);
        return {r: i3.r.toArrayLike(Uint8Array), s: i3.s.toArrayLike(Uint8Array)};
      }
    }
  }
  return async function(e3, t3, r3) {
    const i3 = await ui(e3.name), n3 = oi(i3, r3).sign(t3);
    return {r: n3.r.toArrayLike(Uint8Array), s: n3.s.toArrayLike(Uint8Array)};
  }(s2, a2, n2);
}
async function Ui(e2, t2, r2, i2, n2, a2) {
  const s2 = new Ei(e2);
  if (i2 && !V.isStream(i2))
    switch (s2.type) {
      case "web":
        try {
          return await async function(e3, t3, {r: r3, s: i3}, n3, a3) {
            const s3 = Mi(e3.payloadSize, _i[e3.name], a3), o2 = await Ki.importKey("jwk", s3, {name: "ECDSA", namedCurve: _i[e3.name], hash: {name: re.read(re.webHash, e3.hash)}}, false, ["verify"]), c2 = V.concatUint8Array([r3, i3]).buffer;
            return Ki.verify({name: "ECDSA", namedCurve: _i[e3.name], hash: {name: re.read(re.webHash, t3)}}, o2, c2, n3);
          }(s2, t2, r2, i2, n2);
        } catch (e3) {
          if (s2.name !== "p521" && (e3.name === "DataError" || e3.name === "OperationError"))
            throw e3;
          V.printDebugError("Browser did not support verifying: " + e3.message);
        }
        break;
      case "node":
        return async function(e3, t3, {r: r3, s: i3}, n3, a3) {
          const {default: s3} = await Promise.resolve().then(function() {
            return Fd;
          }), o2 = Di.createVerify(re.read(re.hash, t3));
          o2.write(n3), o2.end();
          const c2 = qi.encode({algorithm: {algorithm: [1, 2, 840, 10045, 2, 1], parameters: e3.oid}, subjectPublicKey: {unused: 0, data: Array.from(a3)}}, "pem", {label: "PUBLIC KEY"}), u2 = Bi.encode({r: new s3(r3), s: new s3(i3)}, "der");
          try {
            return o2.verify(c2, u2);
          } catch (e4) {
            return false;
          }
        }(s2, t2, r2, i2, n2);
    }
  return async function(e3, t3, r3, i3) {
    const n3 = await ui(e3.name);
    return ci(n3, i3).verify(r3, t3);
  }(s2, r2, t2 === void 0 ? i2 : a2, n2);
}
const Ii = void 0, Bi = Di ? Ii.define("ECDSASignature", function() {
  this.seq().obj(this.key("r").int(), this.key("s").int());
}) : void 0, Ti = Di ? Ii.define("ECPrivateKey", function() {
  this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").explicit(0).optional().any(), this.key("publicKey").explicit(1).optional().bitstr());
}) : void 0, zi = Di ? Ii.define("AlgorithmIdentifier", function() {
  this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional().any());
}) : void 0, qi = Di ? Ii.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(this.key("algorithm").use(zi), this.key("subjectPublicKey").bitstr());
}) : void 0;
var Oi = /* @__PURE__ */ Object.freeze({__proto__: null, sign: Ri, verify: Ui, validateParams: async function(e2, t2, r2) {
  const i2 = new Ei(e2);
  if (i2.keyType !== re.publicKey.ecdsa)
    return false;
  switch (i2.type) {
    case "web":
    case "node": {
      const i3 = await Nr(8), n2 = re.hash.sha256, a2 = await zr.digest(n2, i3);
      try {
        const s2 = await Ri(e2, n2, i3, t2, r2, a2);
        return await Ui(e2, n2, s2, i3, t2, a2);
      } catch (e3) {
        return false;
      }
    }
    default:
      return Pi(re.publicKey.ecdsa, e2, t2, r2);
  }
}});
Or.hash = (e2) => new Uint8Array(Wt().update(e2).digest());
var Fi = /* @__PURE__ */ Object.freeze({__proto__: null, sign: async function(e2, t2, r2, i2, n2, a2) {
  if (zr.getHashByteLength(t2) < zr.getHashByteLength(re.hash.sha256))
    throw Error("Hash algorithm too weak: sha256 or stronger is required for EdDSA.");
  const s2 = V.concatUint8Array([n2, i2.subarray(1)]), o2 = Or.sign.detached(a2, s2);
  return {r: o2.subarray(0, 32), s: o2.subarray(32)};
}, verify: async function(e2, t2, {r: r2, s: i2}, n2, a2, s2) {
  const o2 = V.concatUint8Array([r2, i2]);
  return Or.sign.detached.verify(s2, o2, a2.subarray(1));
}, validateParams: async function(e2, t2, r2) {
  if (e2.getName() !== "ed25519")
    return false;
  const {publicKey: i2} = Or.sign.keyPair.fromSeed(r2), n2 = new Uint8Array([64, ...i2]);
  return V.equalsUint8Array(t2, n2);
}});
function Ni(e2, t2) {
  const r2 = new Le["aes" + 8 * e2.length](e2), i2 = new Uint32Array([2795939494, 2795939494]), n2 = Li(t2);
  let a2 = i2;
  const s2 = n2, o2 = n2.length / 2, c2 = new Uint32Array([0, 0]);
  let u2 = new Uint32Array(4);
  for (let e3 = 0; e3 <= 5; ++e3)
    for (let t3 = 0; t3 < o2; ++t3)
      c2[1] = o2 * e3 + (1 + t3), u2[0] = a2[0], u2[1] = a2[1], u2[2] = s2[2 * t3], u2[3] = s2[2 * t3 + 1], u2 = Li(r2.encrypt(Wi(u2))), a2 = u2.subarray(0, 2), a2[0] ^= c2[0], a2[1] ^= c2[1], s2[2 * t3] = u2[2], s2[2 * t3 + 1] = u2[3];
  return Wi(a2, s2);
}
function ji(e2, t2) {
  const r2 = new Le["aes" + 8 * e2.length](e2), i2 = new Uint32Array([2795939494, 2795939494]), n2 = Li(t2);
  let a2 = n2.subarray(0, 2);
  const s2 = n2.subarray(2), o2 = n2.length / 2 - 1, c2 = new Uint32Array([0, 0]);
  let u2 = new Uint32Array(4);
  for (let e3 = 5; e3 >= 0; --e3)
    for (let t3 = o2 - 1; t3 >= 0; --t3)
      c2[1] = o2 * e3 + (t3 + 1), u2[0] = a2[0] ^ c2[0], u2[1] = a2[1] ^ c2[1], u2[2] = s2[2 * t3], u2[3] = s2[2 * t3 + 1], u2 = Li(r2.decrypt(Wi(u2))), a2 = u2.subarray(0, 2), s2[2 * t3] = u2[2], s2[2 * t3 + 1] = u2[3];
  if (a2[0] === i2[0] && a2[1] === i2[1])
    return Wi(s2);
  throw Error("Key Data Integrity failed");
}
function Li(e2) {
  const {length: t2} = e2, r2 = function(e3) {
    if (V.isString(e3)) {
      const {length: t3} = e3, r3 = new ArrayBuffer(t3), i3 = new Uint8Array(r3);
      for (let r4 = 0; r4 < t3; ++r4)
        i3[r4] = e3.charCodeAt(r4);
      return r3;
    }
    return new Uint8Array(e3).buffer;
  }(e2), i2 = new DataView(r2), n2 = new Uint32Array(t2 / 4);
  for (let e3 = 0; e3 < t2 / 4; ++e3)
    n2[e3] = i2.getUint32(4 * e3);
  return n2;
}
function Wi() {
  let e2 = 0;
  for (let t3 = 0; t3 < arguments.length; ++t3)
    e2 += 4 * arguments[t3].length;
  const t2 = new ArrayBuffer(e2), r2 = new DataView(t2);
  let i2 = 0;
  for (let e3 = 0; e3 < arguments.length; ++e3) {
    for (let t3 = 0; t3 < arguments[e3].length; ++t3)
      r2.setUint32(i2 + 4 * t3, arguments[e3][t3]);
    i2 += 4 * arguments[e3].length;
  }
  return new Uint8Array(t2);
}
var Hi = /* @__PURE__ */ Object.freeze({__proto__: null, wrap: Ni, unwrap: ji});
function Gi(e2) {
  const t2 = 8 - e2.length % 8, r2 = new Uint8Array(e2.length + t2).fill(t2);
  return r2.set(e2), r2;
}
function Vi(e2) {
  const t2 = e2.length;
  if (t2 > 0) {
    const r2 = e2[t2 - 1];
    if (r2 >= 1) {
      const i2 = e2.subarray(t2 - r2), n2 = new Uint8Array(r2).fill(r2);
      if (V.equalsUint8Array(i2, n2))
        return e2.subarray(0, t2 - r2);
    }
  }
  throw Error("Invalid padding");
}
var $i = /* @__PURE__ */ Object.freeze({__proto__: null, encode: Gi, decode: Vi});
const Zi = V.getWebCrypto(), Yi = V.getNodeCrypto();
function Xi(e2, t2, r2, i2) {
  return V.concatUint8Array([t2.write(), new Uint8Array([e2]), r2.write(), V.stringToUint8Array("Anonymous Sender    "), i2.subarray(0, 20)]);
}
async function Qi(e2, t2, r2, i2, n2 = false, a2 = false) {
  let s2;
  if (n2) {
    for (s2 = 0; s2 < t2.length && t2[s2] === 0; s2++)
      ;
    t2 = t2.subarray(s2);
  }
  if (a2) {
    for (s2 = t2.length - 1; s2 >= 0 && t2[s2] === 0; s2--)
      ;
    t2 = t2.subarray(0, s2 + 1);
  }
  return (await zr.digest(e2, V.concatUint8Array([new Uint8Array([0, 0, 0, 1]), t2, i2]))).subarray(0, r2);
}
async function Ji(e2, t2) {
  switch (e2.type) {
    case "curve25519": {
      const r2 = await Nr(32), {secretKey: i2, sharedKey: n2} = await en(e2, t2, null, r2);
      let {publicKey: a2} = Or.box.keyPair.fromSecretKey(i2);
      return a2 = V.concatUint8Array([new Uint8Array([64]), a2]), {publicKey: a2, sharedKey: n2};
    }
    case "web":
      if (e2.web && V.getWebCrypto())
        try {
          return await async function(e3, t3) {
            const r2 = Mi(e3.payloadSize, e3.web.web, t3);
            let i2 = Zi.generateKey({name: "ECDH", namedCurve: e3.web.web}, true, ["deriveKey", "deriveBits"]), n2 = Zi.importKey("jwk", r2, {name: "ECDH", namedCurve: e3.web.web}, false, []);
            [i2, n2] = await Promise.all([i2, n2]);
            let a2 = Zi.deriveBits({name: "ECDH", namedCurve: e3.web.web, public: n2}, i2.privateKey, e3.web.sharedSize), s2 = Zi.exportKey("jwk", i2.publicKey);
            [a2, s2] = await Promise.all([a2, s2]);
            const o2 = new Uint8Array(a2);
            return {publicKey: new Uint8Array(xi(s2)), sharedKey: o2};
          }(e2, t2);
        } catch (e3) {
          V.printDebugError(e3);
        }
      break;
    case "node":
      return async function(e3, t3) {
        const r2 = Yi.createECDH(e3.node.node);
        r2.generateKeys();
        const i2 = new Uint8Array(r2.computeSecret(t3));
        return {publicKey: new Uint8Array(r2.getPublicKey()), sharedKey: i2};
      }(e2, t2);
  }
  return async function(e3, t3) {
    const r2 = await ui(e3.name), i2 = await e3.genKeyPair();
    t3 = ci(r2, t3);
    const n2 = oi(r2, i2.privateKey), a2 = i2.publicKey, s2 = n2.derive(t3.getPublic()), o2 = r2.curve.p.byteLength(), c2 = s2.toArrayLike(Uint8Array, "be", o2);
    return {publicKey: a2, sharedKey: c2};
  }(e2, t2);
}
async function en(e2, t2, r2, i2) {
  if (i2.length !== e2.payloadSize) {
    const t3 = new Uint8Array(e2.payloadSize);
    t3.set(i2, e2.payloadSize - i2.length), i2 = t3;
  }
  switch (e2.type) {
    case "curve25519": {
      const e3 = i2.slice().reverse();
      return {secretKey: e3, sharedKey: Or.scalarMult(e3, t2.subarray(1))};
    }
    case "web":
      if (e2.web && V.getWebCrypto())
        try {
          return await async function(e3, t3, r3, i3) {
            const n2 = Ci(e3.payloadSize, e3.web.web, r3, i3);
            let a2 = Zi.importKey("jwk", n2, {name: "ECDH", namedCurve: e3.web.web}, true, ["deriveKey", "deriveBits"]);
            const s2 = Mi(e3.payloadSize, e3.web.web, t3);
            let o2 = Zi.importKey("jwk", s2, {name: "ECDH", namedCurve: e3.web.web}, true, []);
            [a2, o2] = await Promise.all([a2, o2]);
            let c2 = Zi.deriveBits({name: "ECDH", namedCurve: e3.web.web, public: o2}, a2, e3.web.sharedSize), u2 = Zi.exportKey("jwk", a2);
            [c2, u2] = await Promise.all([c2, u2]);
            const h2 = new Uint8Array(c2);
            return {secretKey: J(u2.d), sharedKey: h2};
          }(e2, t2, r2, i2);
        } catch (e3) {
          V.printDebugError(e3);
        }
      break;
    case "node":
      return async function(e3, t3, r3) {
        const i3 = Yi.createECDH(e3.node.node);
        i3.setPrivateKey(r3);
        const n2 = new Uint8Array(i3.computeSecret(t3));
        return {secretKey: new Uint8Array(i3.getPrivateKey()), sharedKey: n2};
      }(e2, t2, i2);
  }
  return async function(e3, t3, r3) {
    const i3 = await ui(e3.name);
    t3 = ci(i3, t3), r3 = oi(i3, r3);
    const n2 = new Uint8Array(r3.getPrivate()), a2 = r3.derive(t3.getPublic()), s2 = i3.curve.p.byteLength(), o2 = a2.toArrayLike(Uint8Array, "be", s2);
    return {secretKey: n2, sharedKey: o2};
  }(e2, t2, i2);
}
var tn = /* @__PURE__ */ Object.freeze({__proto__: null, validateParams: async function(e2, t2, r2) {
  return Pi(re.publicKey.ecdh, e2, t2, r2);
}, encrypt: async function(e2, t2, r2, i2, n2) {
  const a2 = Gi(r2), s2 = new Ei(e2), {publicKey: o2, sharedKey: c2} = await Ji(s2, i2), u2 = Xi(re.publicKey.ecdh, e2, t2, n2), {keySize: h2} = sn(t2.cipher);
  return {publicKey: o2, wrappedKey: Ni(await Qi(t2.hash, c2, h2, u2), a2)};
}, decrypt: async function(e2, t2, r2, i2, n2, a2, s2) {
  const o2 = new Ei(e2), {sharedKey: c2} = await en(o2, r2, n2, a2), u2 = Xi(re.publicKey.ecdh, e2, t2, s2), {keySize: h2} = sn(t2.cipher);
  let f2;
  for (let e3 = 0; e3 < 3; e3++)
    try {
      return Vi(ji(await Qi(t2.hash, c2, h2, u2, e3 === 1, e3 === 2), i2));
    } catch (e4) {
      f2 = e4;
    }
  throw f2;
}});
var rn = {rsa: ni, elgamal: ai, elliptic: /* @__PURE__ */ Object.freeze({__proto__: null, Curve: Ei, ecdh: tn, ecdsa: Oi, eddsa: Fi, generate: async function(e2) {
  const t2 = await V.getBigInteger();
  e2 = new Ei(e2);
  const r2 = await e2.genKeyPair(), i2 = new t2(r2.publicKey).toUint8Array(), n2 = new t2(r2.privateKey).toUint8Array("be", e2.payloadSize);
  return {oid: e2.oid, Q: i2, secret: n2, hash: e2.hash, cipher: e2.cipher};
}, getPreferredHashAlgo: function(e2) {
  return Si[re.write(re.curve, e2.toHex())].hash;
}}), dsa: /* @__PURE__ */ Object.freeze({__proto__: null, sign: async function(e2, t2, r2, i2, n2, a2) {
  const s2 = await V.getBigInteger(), o2 = new s2(1);
  let c2, u2, h2, f2;
  i2 = new s2(i2), n2 = new s2(n2), r2 = new s2(r2), a2 = new s2(a2), r2 = r2.mod(i2), a2 = a2.mod(n2);
  const d2 = new s2(t2.subarray(0, n2.byteLength())).mod(n2);
  for (; ; ) {
    if (c2 = await jr(o2, n2), u2 = r2.modExp(c2, i2).imod(n2), u2.isZero())
      continue;
    const e3 = a2.mul(u2).imod(n2);
    if (f2 = d2.add(e3).imod(n2), h2 = c2.modInv(n2).imul(f2).imod(n2), !h2.isZero())
      break;
  }
  return {r: u2.toUint8Array("be", n2.byteLength()), s: h2.toUint8Array("be", n2.byteLength())};
}, verify: async function(e2, t2, r2, i2, n2, a2, s2, o2) {
  const c2 = await V.getBigInteger(), u2 = new c2(0);
  if (t2 = new c2(t2), r2 = new c2(r2), a2 = new c2(a2), s2 = new c2(s2), n2 = new c2(n2), o2 = new c2(o2), t2.lte(u2) || t2.gte(s2) || r2.lte(u2) || r2.gte(s2))
    return V.printDebug("invalid DSA Signature"), false;
  const h2 = new c2(i2.subarray(0, s2.byteLength())).imod(s2), f2 = r2.modInv(s2);
  if (f2.isZero())
    return V.printDebug("invalid DSA Signature"), false;
  n2 = n2.mod(a2), o2 = o2.mod(a2);
  const d2 = h2.mul(f2).imod(s2), l2 = t2.mul(f2).imod(s2), p2 = n2.modExp(d2, a2), y2 = o2.modExp(l2, a2);
  return p2.mul(y2).imod(a2).imod(s2).equal(t2);
}, validateParams: async function(e2, t2, r2, i2, n2) {
  const a2 = await V.getBigInteger();
  e2 = new a2(e2), t2 = new a2(t2), r2 = new a2(r2), i2 = new a2(i2);
  const s2 = new a2(1);
  if (r2.lte(s2) || r2.gte(e2))
    return false;
  if (!e2.dec().mod(t2).isZero())
    return false;
  if (!r2.modExp(t2, e2).isOne())
    return false;
  const o2 = new a2(t2.bitLength()), c2 = new a2(150);
  if (o2.lt(c2) || !await Gr(t2, null, 32))
    return false;
  n2 = new a2(n2);
  const u2 = new a2(2), h2 = await jr(u2.leftShift(o2.dec()), u2.leftShift(o2)), f2 = t2.mul(h2).add(n2);
  return !!i2.equal(r2.modExp(f2, e2));
}}), nacl: Or};
class nn {
  constructor(e2) {
    e2 = e2 === void 0 ? new Uint8Array([]) : V.isString(e2) ? V.stringToUint8Array(e2) : new Uint8Array(e2), this.data = e2;
  }
  read(e2) {
    if (e2.length >= 1) {
      const t2 = e2[0];
      if (e2.length >= 1 + t2)
        return this.data = e2.subarray(1, 1 + t2), 1 + this.data.length;
    }
    throw Error("Invalid symmetric key");
  }
  write() {
    return V.concatUint8Array([new Uint8Array([this.data.length]), this.data]);
  }
}
class an {
  constructor(e2) {
    if (e2) {
      const {hash: t2, cipher: r2} = e2;
      this.hash = t2, this.cipher = r2;
    } else
      this.hash = null, this.cipher = null;
  }
  read(e2) {
    if (e2.length < 4 || e2[0] !== 3 || e2[1] !== 1)
      throw Error("Cannot read KDFParams");
    return this.hash = e2[2], this.cipher = e2[3], 4;
  }
  write() {
    return new Uint8Array([3, 1, this.hash, this.cipher]);
  }
}
function sn(e2) {
  const t2 = re.read(re.symmetric, e2);
  return Le[t2];
}
function on(e2) {
  try {
    e2.getName();
  } catch (e3) {
    throw new mi("Unknown curve OID");
  }
}
var cn = /* @__PURE__ */ Object.freeze({__proto__: null, publicKeyEncrypt: async function(e2, t2, r2, i2) {
  switch (e2) {
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaEncryptSign: {
      const {n: e3, e: i3} = t2;
      return {c: await rn.rsa.encrypt(r2, e3, i3)};
    }
    case re.publicKey.elgamal: {
      const {p: e3, g: i3, y: n2} = t2;
      return rn.elgamal.encrypt(r2, e3, i3, n2);
    }
    case re.publicKey.ecdh: {
      const {oid: e3, Q: n2, kdfParams: a2} = t2, {publicKey: s2, wrappedKey: o2} = await rn.elliptic.ecdh.encrypt(e3, a2, r2, n2, i2);
      return {V: s2, C: new nn(o2)};
    }
    default:
      return [];
  }
}, publicKeyDecrypt: async function(e2, t2, r2, i2, n2, a2) {
  switch (e2) {
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaEncrypt: {
      const {c: e3} = i2, {n: n3, e: s2} = t2, {d: o2, p: c2, q: u2, u: h2} = r2;
      return rn.rsa.decrypt(e3, n3, s2, o2, c2, u2, h2, a2);
    }
    case re.publicKey.elgamal: {
      const {c1: e3, c2: n3} = i2, s2 = t2.p, o2 = r2.x;
      return rn.elgamal.decrypt(e3, n3, s2, o2, a2);
    }
    case re.publicKey.ecdh: {
      const {oid: e3, Q: a3, kdfParams: s2} = t2, {d: o2} = r2, {V: c2, C: u2} = i2;
      return rn.elliptic.ecdh.decrypt(e3, s2, c2, u2.data, a3, o2, n2);
    }
    default:
      throw Error("Unknown public key encryption algorithm.");
  }
}, parsePublicKeyParams: function(e2, t2) {
  let r2 = 0;
  switch (e2) {
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaSign: {
      const e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2;
      const i2 = V.readMPI(t2.subarray(r2));
      return r2 += i2.length + 2, {read: r2, publicParams: {n: e3, e: i2}};
    }
    case re.publicKey.dsa: {
      const e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2;
      const i2 = V.readMPI(t2.subarray(r2));
      r2 += i2.length + 2;
      const n2 = V.readMPI(t2.subarray(r2));
      r2 += n2.length + 2;
      const a2 = V.readMPI(t2.subarray(r2));
      return r2 += a2.length + 2, {read: r2, publicParams: {p: e3, q: i2, g: n2, y: a2}};
    }
    case re.publicKey.elgamal: {
      const e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2;
      const i2 = V.readMPI(t2.subarray(r2));
      r2 += i2.length + 2;
      const n2 = V.readMPI(t2.subarray(r2));
      return r2 += n2.length + 2, {read: r2, publicParams: {p: e3, g: i2, y: n2}};
    }
    case re.publicKey.ecdsa: {
      const e3 = new si();
      r2 += e3.read(t2), on(e3);
      const i2 = V.readMPI(t2.subarray(r2));
      return r2 += i2.length + 2, {read: r2, publicParams: {oid: e3, Q: i2}};
    }
    case re.publicKey.eddsa: {
      const e3 = new si();
      r2 += e3.read(t2), on(e3);
      let i2 = V.readMPI(t2.subarray(r2));
      return r2 += i2.length + 2, i2 = V.leftPad(i2, 33), {read: r2, publicParams: {oid: e3, Q: i2}};
    }
    case re.publicKey.ecdh: {
      const e3 = new si();
      r2 += e3.read(t2), on(e3);
      const i2 = V.readMPI(t2.subarray(r2));
      r2 += i2.length + 2;
      const n2 = new an();
      return r2 += n2.read(t2.subarray(r2)), {read: r2, publicParams: {oid: e3, Q: i2, kdfParams: n2}};
    }
    default:
      throw new mi("Unknown public key encryption algorithm.");
  }
}, parsePrivateKeyParams: function(e2, t2, r2) {
  let i2 = 0;
  switch (e2) {
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaSign: {
      const e3 = V.readMPI(t2.subarray(i2));
      i2 += e3.length + 2;
      const r3 = V.readMPI(t2.subarray(i2));
      i2 += r3.length + 2;
      const n2 = V.readMPI(t2.subarray(i2));
      i2 += n2.length + 2;
      const a2 = V.readMPI(t2.subarray(i2));
      return i2 += a2.length + 2, {read: i2, privateParams: {d: e3, p: r3, q: n2, u: a2}};
    }
    case re.publicKey.dsa:
    case re.publicKey.elgamal: {
      const e3 = V.readMPI(t2.subarray(i2));
      return i2 += e3.length + 2, {read: i2, privateParams: {x: e3}};
    }
    case re.publicKey.ecdsa:
    case re.publicKey.ecdh: {
      const e3 = new Ei(r2.oid);
      let n2 = V.readMPI(t2.subarray(i2));
      return i2 += n2.length + 2, n2 = V.leftPad(n2, e3.payloadSize), {read: i2, privateParams: {d: n2}};
    }
    case re.publicKey.eddsa: {
      const e3 = new Ei(r2.oid);
      let n2 = V.readMPI(t2.subarray(i2));
      return i2 += n2.length + 2, n2 = V.leftPad(n2, e3.payloadSize), {read: i2, privateParams: {seed: n2}};
    }
    default:
      throw new mi("Unknown public key encryption algorithm.");
  }
}, parseEncSessionKeyParams: function(e2, t2) {
  let r2 = 0;
  switch (e2) {
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaEncryptSign:
      return {c: V.readMPI(t2.subarray(r2))};
    case re.publicKey.elgamal: {
      const e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2;
      return {c1: e3, c2: V.readMPI(t2.subarray(r2))};
    }
    case re.publicKey.ecdh: {
      const e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2;
      const i2 = new nn();
      return i2.read(t2.subarray(r2)), {V: e3, C: i2};
    }
    default:
      throw new mi("Unknown public key encryption algorithm.");
  }
}, serializeParams: function(e2, t2) {
  const r2 = Object.keys(t2).map((e3) => {
    const r3 = t2[e3];
    return V.isUint8Array(r3) ? V.uint8ArrayToMPI(r3) : r3.write();
  });
  return V.concatUint8Array(r2);
}, generateParams: function(e2, t2, r2) {
  switch (e2) {
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaSign:
      return rn.rsa.generate(t2, 65537).then(({n: e3, e: t3, d: r3, p: i2, q: n2, u: a2}) => ({privateParams: {d: r3, p: i2, q: n2, u: a2}, publicParams: {n: e3, e: t3}}));
    case re.publicKey.ecdsa:
      return rn.elliptic.generate(r2).then(({oid: e3, Q: t3, secret: r3}) => ({privateParams: {d: r3}, publicParams: {oid: new si(e3), Q: t3}}));
    case re.publicKey.eddsa:
      return rn.elliptic.generate(r2).then(({oid: e3, Q: t3, secret: r3}) => ({privateParams: {seed: r3}, publicParams: {oid: new si(e3), Q: t3}}));
    case re.publicKey.ecdh:
      return rn.elliptic.generate(r2).then(({oid: e3, Q: t3, secret: r3, hash: i2, cipher: n2}) => ({privateParams: {d: r3}, publicParams: {oid: new si(e3), Q: t3, kdfParams: new an({hash: i2, cipher: n2})}}));
    case re.publicKey.dsa:
    case re.publicKey.elgamal:
      throw Error("Unsupported algorithm for key generation.");
    default:
      throw Error("Unknown public key algorithm.");
  }
}, validateParams: async function(e2, t2, r2) {
  if (!t2 || !r2)
    throw Error("Missing key parameters");
  switch (e2) {
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaSign: {
      const {n: e3, e: i2} = t2, {d: n2, p: a2, q: s2, u: o2} = r2;
      return rn.rsa.validateParams(e3, i2, n2, a2, s2, o2);
    }
    case re.publicKey.dsa: {
      const {p: e3, q: i2, g: n2, y: a2} = t2, {x: s2} = r2;
      return rn.dsa.validateParams(e3, i2, n2, a2, s2);
    }
    case re.publicKey.elgamal: {
      const {p: e3, g: i2, y: n2} = t2, {x: a2} = r2;
      return rn.elgamal.validateParams(e3, i2, n2, a2);
    }
    case re.publicKey.ecdsa:
    case re.publicKey.ecdh: {
      const i2 = rn.elliptic[re.read(re.publicKey, e2)], {oid: n2, Q: a2} = t2, {d: s2} = r2;
      return i2.validateParams(n2, a2, s2);
    }
    case re.publicKey.eddsa: {
      const {oid: e3, Q: i2} = t2, {seed: n2} = r2;
      return rn.elliptic.eddsa.validateParams(e3, i2, n2);
    }
    default:
      throw Error("Unknown public key algorithm.");
  }
}, getPrefixRandom: async function(e2) {
  const {blockSize: t2} = sn(e2), r2 = await Nr(t2), i2 = new Uint8Array([r2[r2.length - 2], r2[r2.length - 1]]);
  return V.concat([r2, i2]);
}, generateSessionKey: function(e2) {
  const {keySize: t2} = sn(e2);
  return Nr(t2);
}, getAEADMode: function(e2) {
  const t2 = re.read(re.aead, e2);
  return Nn[t2];
}, getCipher: sn});
const un = V.getWebCrypto(), hn = V.getNodeCrypto(), fn = hn ? hn.getCiphers() : [], dn = {idea: fn.includes("idea-cfb") ? "idea-cfb" : void 0, tripledes: fn.includes("des-ede3-cfb") ? "des-ede3-cfb" : void 0, cast5: fn.includes("cast5-cfb") ? "cast5-cfb" : void 0, blowfish: fn.includes("bf-cfb") ? "bf-cfb" : void 0, aes128: fn.includes("aes-128-cfb") ? "aes-128-cfb" : void 0, aes192: fn.includes("aes-192-cfb") ? "aes-192-cfb" : void 0, aes256: fn.includes("aes-256-cfb") ? "aes-256-cfb" : void 0};
var ln = /* @__PURE__ */ Object.freeze({__proto__: null, encrypt: async function(e2, t2, r2, i2, n2) {
  const a2 = re.read(re.symmetric, e2);
  if (V.getNodeCrypto() && dn[a2])
    return function(e3, t3, r3, i3) {
      const n3 = re.read(re.symmetric, e3), a3 = new hn.createCipheriv(dn[n3], t3, i3);
      return B(r3, (e4) => new Uint8Array(a3.update(e4)));
    }(e2, t2, r2, i2);
  if (a2.substr(0, 3) === "aes")
    return function(e3, t3, r3, i3, n3) {
      if (V.getWebCrypto() && t3.length !== 24 && !V.isStream(r3) && r3.length >= 3e3 * n3.minBytesForWebCrypto)
        return async function(e4, t4, r4, i4) {
          const n4 = "AES-CBC", a4 = await un.importKey("raw", t4, {name: n4}, false, ["encrypt"]), {blockSize: s3} = sn(e4), o3 = V.concatUint8Array([new Uint8Array(s3), r4]), c3 = new Uint8Array(await un.encrypt({name: n4, iv: i4}, a4, o3)).subarray(0, r4.length);
          return function(e5, t5) {
            for (let r5 = 0; r5 < e5.length; r5++)
              e5[r5] = e5[r5] ^ t5[r5];
          }(c3, r4), c3;
        }(e3, t3, r3, i3);
      const a3 = new qr(t3, i3);
      return B(r3, (e4) => a3.aes.AES_Encrypt_process(e4), () => a3.aes.AES_Encrypt_finish());
    }(e2, t2, r2, i2, n2);
  const s2 = new Le[a2](t2), o2 = s2.blockSize, c2 = i2.slice();
  let u2 = new Uint8Array();
  const h2 = (e3) => {
    e3 && (u2 = V.concatUint8Array([u2, e3]));
    const t3 = new Uint8Array(u2.length);
    let r3, i3 = 0;
    for (; e3 ? u2.length >= o2 : u2.length; ) {
      const e4 = s2.encrypt(c2);
      for (r3 = 0; r3 < o2; r3++)
        c2[r3] = u2[r3] ^ e4[r3], t3[i3++] = c2[r3];
      u2 = u2.subarray(o2);
    }
    return t3.subarray(0, i3);
  };
  return B(r2, h2, h2);
}, decrypt: async function(e2, t2, r2, i2) {
  const n2 = re.read(re.symmetric, e2);
  if (V.getNodeCrypto() && dn[n2])
    return function(e3, t3, r3, i3) {
      const n3 = re.read(re.symmetric, e3), a3 = new hn.createDecipheriv(dn[n3], t3, i3);
      return B(r3, (e4) => new Uint8Array(a3.update(e4)));
    }(e2, t2, r2, i2);
  if (n2.substr(0, 3) === "aes")
    return function(e3, t3, r3, i3) {
      if (V.isStream(r3)) {
        const e4 = new qr(t3, i3);
        return B(r3, (t4) => e4.aes.AES_Decrypt_process(t4), () => e4.aes.AES_Decrypt_finish());
      }
      return qr.decrypt(r3, t3, i3);
    }(0, t2, r2, i2);
  const a2 = new Le[n2](t2), s2 = a2.blockSize;
  let o2 = i2, c2 = new Uint8Array();
  const u2 = (e3) => {
    e3 && (c2 = V.concatUint8Array([c2, e3]));
    const t3 = new Uint8Array(c2.length);
    let r3, i3 = 0;
    for (; e3 ? c2.length >= s2 : c2.length; ) {
      const e4 = a2.encrypt(o2);
      for (o2 = c2, r3 = 0; r3 < s2; r3++)
        t3[i3++] = o2[r3] ^ e4[r3];
      c2 = c2.subarray(s2);
    }
    return t3.subarray(0, i3);
  };
  return B(r2, u2, u2);
}});
class pn {
  static encrypt(e2, t2, r2) {
    return new pn(t2, r2).encrypt(e2);
  }
  static decrypt(e2, t2, r2) {
    return new pn(t2, r2).encrypt(e2);
  }
  constructor(e2, t2, r2) {
    this.aes = r2 || new Se(e2, void 0, false, "CTR"), delete this.aes.padding, this.AES_CTR_set_options(t2);
  }
  encrypt(e2) {
    return ge(this.aes.AES_Encrypt_process(e2), this.aes.AES_Encrypt_finish());
  }
  decrypt(e2) {
    return ge(this.aes.AES_Encrypt_process(e2), this.aes.AES_Encrypt_finish());
  }
  AES_CTR_set_options(e2, t2, r2) {
    let {asm: i2} = this.aes.acquire_asm();
    if (r2 !== void 0) {
      if (r2 < 8 || r2 > 48)
        throw new ve("illegal counter size");
      let e3 = Math.pow(2, r2) - 1;
      i2.set_mask(0, 0, e3 / 4294967296 | 0, 0 | e3);
    } else
      r2 = 48, i2.set_mask(0, 0, 65535, 4294967295);
    if (e2 === void 0)
      throw Error("nonce is required");
    {
      let t3 = e2.length;
      if (!t3 || t3 > 16)
        throw new ve("illegal nonce size");
      let r3 = new DataView(new ArrayBuffer(16));
      new Uint8Array(r3.buffer).set(e2), i2.set_nonce(r3.getUint32(0), r3.getUint32(4), r3.getUint32(8), r3.getUint32(12));
    }
    if (t2 !== void 0) {
      if (t2 < 0 || t2 >= Math.pow(2, r2))
        throw new ve("illegal counter value");
      i2.set_counter(0, 0, t2 / 4294967296 | 0, 0 | t2);
    }
  }
}
class yn {
  static encrypt(e2, t2, r2 = true, i2) {
    return new yn(t2, i2, r2).encrypt(e2);
  }
  static decrypt(e2, t2, r2 = true, i2) {
    return new yn(t2, i2, r2).decrypt(e2);
  }
  constructor(e2, t2, r2 = true, i2) {
    this.aes = i2 || new Se(e2, t2, r2, "CBC");
  }
  encrypt(e2) {
    return ge(this.aes.AES_Encrypt_process(e2), this.aes.AES_Encrypt_finish());
  }
  decrypt(e2) {
    return ge(this.aes.AES_Decrypt_process(e2), this.aes.AES_Decrypt_finish());
  }
}
const bn = V.getWebCrypto(), mn = V.getNodeCrypto();
function gn(e2, t2) {
  const r2 = e2.length - 16;
  for (let i2 = 0; i2 < 16; i2++)
    e2[i2 + r2] ^= t2[i2];
  return e2;
}
const wn = new Uint8Array(16);
async function vn(e2) {
  const t2 = await async function(e3) {
    if (V.getWebCrypto() && e3.length !== 24)
      return e3 = await bn.importKey("raw", e3, {name: "AES-CBC", length: 8 * e3.length}, false, ["encrypt"]), async function(t3) {
        const r3 = await bn.encrypt({name: "AES-CBC", iv: wn, length: 128}, e3, t3);
        return new Uint8Array(r3).subarray(0, r3.byteLength - 16);
      };
    if (V.getNodeCrypto())
      return async function(t3) {
        const r3 = new mn.createCipheriv("aes-" + 8 * e3.length + "-cbc", e3, wn).update(t3);
        return new Uint8Array(r3);
      };
    return async function(t3) {
      return yn.encrypt(t3, e3, false, wn);
    };
  }(e2), r2 = V.double(await t2(wn)), i2 = V.double(r2);
  return async function(e3) {
    return (await t2(function(e4, t3, r3) {
      if (e4.length && e4.length % 16 == 0)
        return gn(e4, t3);
      const i3 = new Uint8Array(e4.length + (16 - e4.length % 16));
      return i3.set(e4), i3[e4.length] = 128, gn(i3, r3);
    }(e3, r2, i2))).subarray(-16);
  };
}
const _n = V.getWebCrypto(), kn = V.getNodeCrypto(), An = V.getNodeBuffer(), Sn = new Uint8Array(16), En = new Uint8Array(16);
En[15] = 1;
const Pn = new Uint8Array(16);
async function xn(e2) {
  const t2 = await vn(e2);
  return function(e3, r2) {
    return t2(V.concatUint8Array([e3, r2]));
  };
}
async function Mn(e2) {
  return V.getWebCrypto() && e2.length !== 24 ? (e2 = await _n.importKey("raw", e2, {name: "AES-CTR", length: 8 * e2.length}, false, ["encrypt"]), async function(t2, r2) {
    const i2 = await _n.encrypt({name: "AES-CTR", counter: r2, length: 128}, e2, t2);
    return new Uint8Array(i2);
  }) : V.getNodeCrypto() ? async function(t2, r2) {
    const i2 = new kn.createCipheriv("aes-" + 8 * e2.length + "-ctr", e2, r2), n2 = An.concat([i2.update(t2), i2.final()]);
    return new Uint8Array(n2);
  } : async function(t2, r2) {
    return pn.encrypt(t2, e2, r2);
  };
}
async function Cn(e2, t2) {
  if (e2 !== re.symmetric.aes128 && e2 !== re.symmetric.aes192 && e2 !== re.symmetric.aes256)
    throw Error("EAX mode supports only AES cipher");
  const [r2, i2] = await Promise.all([xn(t2), Mn(t2)]);
  return {encrypt: async function(e3, t3, n2) {
    const [a2, s2] = await Promise.all([r2(Sn, t3), r2(En, n2)]), o2 = await i2(e3, a2), c2 = await r2(Pn, o2);
    for (let e4 = 0; e4 < 16; e4++)
      c2[e4] ^= s2[e4] ^ a2[e4];
    return V.concatUint8Array([o2, c2]);
  }, decrypt: async function(e3, t3, n2) {
    if (e3.length < 16)
      throw Error("Invalid EAX ciphertext");
    const a2 = e3.subarray(0, -16), s2 = e3.subarray(-16), [o2, c2, u2] = await Promise.all([r2(Sn, t3), r2(En, n2), r2(Pn, a2)]), h2 = u2;
    for (let e4 = 0; e4 < 16; e4++)
      h2[e4] ^= c2[e4] ^ o2[e4];
    if (!V.equalsUint8Array(s2, h2))
      throw Error("Authentication tag mismatch");
    return await i2(a2, o2);
  }};
}
Pn[15] = 2, Cn.getNonce = function(e2, t2) {
  const r2 = e2.slice();
  for (let e3 = 0; e3 < t2.length; e3++)
    r2[8 + e3] ^= t2[e3];
  return r2;
}, Cn.blockLength = 16, Cn.ivLength = 16, Cn.tagLength = 16;
function Kn(e2) {
  let t2 = 0;
  for (let r2 = 1; (e2 & r2) == 0; r2 <<= 1)
    t2++;
  return t2;
}
function Dn(e2, t2) {
  for (let r2 = 0; r2 < e2.length; r2++)
    e2[r2] ^= t2[r2];
  return e2;
}
function Rn(e2, t2) {
  return Dn(e2.slice(), t2);
}
const Un = new Uint8Array(16), In = new Uint8Array([1]);
async function Bn(e2, t2) {
  let r2, i2, n2, a2 = 0;
  function s2(e3, t3, i3, s3) {
    const o2 = t3.length / 16 | 0;
    !function(e4, t4) {
      const r3 = V.nbits(Math.max(e4.length, t4.length) / 16 | 0) - 1;
      for (let e5 = a2 + 1; e5 <= r3; e5++)
        n2[e5] = V.double(n2[e5 - 1]);
      a2 = r3;
    }(t3, s3);
    const c2 = V.concatUint8Array([Un.subarray(0, 15 - i3.length), In, i3]), u2 = 63 & c2[15];
    c2[15] &= 192;
    const h2 = r2(c2), f2 = V.concatUint8Array([h2, Rn(h2.subarray(0, 8), h2.subarray(1, 9))]), d2 = V.shiftRight(f2.subarray(0 + (u2 >> 3), 17 + (u2 >> 3)), 8 - (7 & u2)).subarray(1), l2 = new Uint8Array(16), p2 = new Uint8Array(t3.length + 16);
    let y2, b2 = 0;
    for (y2 = 0; y2 < o2; y2++)
      Dn(d2, n2[Kn(y2 + 1)]), p2.set(Dn(e3(Rn(d2, t3)), d2), b2), Dn(l2, e3 === r2 ? t3 : p2.subarray(b2)), t3 = t3.subarray(16), b2 += 16;
    if (t3.length) {
      Dn(d2, n2.x);
      const i4 = r2(d2);
      p2.set(Rn(t3, i4), b2);
      const a3 = new Uint8Array(16);
      a3.set(e3 === r2 ? t3 : p2.subarray(b2, -16), 0), a3[t3.length] = 128, Dn(l2, a3), b2 += t3.length;
    }
    const m2 = Dn(r2(Dn(Dn(l2, d2), n2.$)), function(e4) {
      if (!e4.length)
        return Un;
      const t4 = e4.length / 16 | 0, i4 = new Uint8Array(16), a3 = new Uint8Array(16);
      for (let s4 = 0; s4 < t4; s4++)
        Dn(i4, n2[Kn(s4 + 1)]), Dn(a3, r2(Rn(i4, e4))), e4 = e4.subarray(16);
      if (e4.length) {
        Dn(i4, n2.x);
        const t5 = new Uint8Array(16);
        t5.set(e4, 0), t5[e4.length] = 128, Dn(t5, i4), Dn(a3, r2(t5));
      }
      return a3;
    }(s3));
    return p2.set(m2, b2), p2;
  }
  return function(e3, t3) {
    const a3 = re.read(re.symmetric, e3), s3 = new Le[a3](t3);
    r2 = s3.encrypt.bind(s3), i2 = s3.decrypt.bind(s3);
    const o2 = r2(Un), c2 = V.double(o2);
    n2 = [], n2[0] = V.double(c2), n2.x = o2, n2.$ = c2;
  }(e2, t2), {encrypt: async function(e3, t3, i3) {
    return s2(r2, e3, t3, i3);
  }, decrypt: async function(e3, t3, r3) {
    if (e3.length < 16)
      throw Error("Invalid OCB ciphertext");
    const n3 = e3.subarray(-16);
    e3 = e3.subarray(0, -16);
    const a3 = s2(i2, e3, t3, r3);
    if (V.equalsUint8Array(n3, a3.subarray(-16)))
      return a3.subarray(0, -16);
    throw Error("Authentication tag mismatch");
  }};
}
Bn.getNonce = function(e2, t2) {
  const r2 = e2.slice();
  for (let e3 = 0; e3 < t2.length; e3++)
    r2[7 + e3] ^= t2[e3];
  return r2;
}, Bn.blockLength = 16, Bn.ivLength = 15, Bn.tagLength = 16;
class Tn {
  constructor(e2, t2, r2, i2 = 16, n2) {
    this.tagSize = i2, this.gamma0 = 0, this.counter = 1, this.aes = n2 || new Se(e2, void 0, false, "CTR");
    let {asm: a2, heap: s2} = this.aes.acquire_asm();
    if (a2.gcm_init(), this.tagSize < 4 || this.tagSize > 16)
      throw new ve("illegal tagSize value");
    const o2 = t2.length || 0, c2 = new Uint8Array(16);
    o2 !== 12 ? (this._gcm_mac_process(t2), s2[0] = 0, s2[1] = 0, s2[2] = 0, s2[3] = 0, s2[4] = 0, s2[5] = 0, s2[6] = 0, s2[7] = 0, s2[8] = 0, s2[9] = 0, s2[10] = 0, s2[11] = o2 >>> 29, s2[12] = o2 >>> 21 & 255, s2[13] = o2 >>> 13 & 255, s2[14] = o2 >>> 5 & 255, s2[15] = o2 << 3 & 255, a2.mac(pe.MAC.GCM, pe.HEAP_DATA, 16), a2.get_iv(pe.HEAP_DATA), a2.set_iv(0, 0, 0, 0), c2.set(s2.subarray(0, 16))) : (c2.set(t2), c2[15] = 1);
    const u2 = new DataView(c2.buffer);
    if (this.gamma0 = u2.getUint32(12), a2.set_nonce(u2.getUint32(0), u2.getUint32(4), u2.getUint32(8), 0), a2.set_mask(0, 0, 0, 4294967295), r2 !== void 0) {
      if (r2.length > 68719476704)
        throw new ve("illegal adata length");
      r2.length ? (this.adata = r2, this._gcm_mac_process(r2)) : this.adata = void 0;
    } else
      this.adata = void 0;
    if (this.counter < 1 || this.counter > 4294967295)
      throw new RangeError("counter must be a positive 32-bit integer");
    a2.set_counter(0, 0, 0, this.gamma0 + this.counter | 0);
  }
  static encrypt(e2, t2, r2, i2, n2) {
    return new Tn(t2, r2, i2, n2).encrypt(e2);
  }
  static decrypt(e2, t2, r2, i2, n2) {
    return new Tn(t2, r2, i2, n2).decrypt(e2);
  }
  encrypt(e2) {
    return this.AES_GCM_encrypt(e2);
  }
  decrypt(e2) {
    return this.AES_GCM_decrypt(e2);
  }
  AES_GCM_Encrypt_process(e2) {
    let t2 = 0, r2 = e2.length || 0, {asm: i2, heap: n2} = this.aes.acquire_asm(), a2 = this.counter, s2 = this.aes.pos, o2 = this.aes.len, c2 = 0, u2 = o2 + r2 & -16, h2 = 0;
    if ((a2 - 1 << 4) + o2 + r2 > 68719476704)
      throw new RangeError("counter overflow");
    const f2 = new Uint8Array(u2);
    for (; r2 > 0; )
      h2 = me(n2, s2 + o2, e2, t2, r2), o2 += h2, t2 += h2, r2 -= h2, h2 = i2.cipher(pe.ENC.CTR, pe.HEAP_DATA + s2, o2), h2 = i2.mac(pe.MAC.GCM, pe.HEAP_DATA + s2, h2), h2 && f2.set(n2.subarray(s2, s2 + h2), c2), a2 += h2 >>> 4, c2 += h2, h2 < o2 ? (s2 += h2, o2 -= h2) : (s2 = 0, o2 = 0);
    return this.counter = a2, this.aes.pos = s2, this.aes.len = o2, f2;
  }
  AES_GCM_Encrypt_finish() {
    let {asm: e2, heap: t2} = this.aes.acquire_asm(), r2 = this.counter, i2 = this.tagSize, n2 = this.adata, a2 = this.aes.pos, s2 = this.aes.len;
    const o2 = new Uint8Array(s2 + i2);
    e2.cipher(pe.ENC.CTR, pe.HEAP_DATA + a2, s2 + 15 & -16), s2 && o2.set(t2.subarray(a2, a2 + s2));
    let c2 = s2;
    for (; 15 & c2; c2++)
      t2[a2 + c2] = 0;
    e2.mac(pe.MAC.GCM, pe.HEAP_DATA + a2, c2);
    const u2 = n2 !== void 0 ? n2.length : 0, h2 = (r2 - 1 << 4) + s2;
    return t2[0] = 0, t2[1] = 0, t2[2] = 0, t2[3] = u2 >>> 29, t2[4] = u2 >>> 21, t2[5] = u2 >>> 13 & 255, t2[6] = u2 >>> 5 & 255, t2[7] = u2 << 3 & 255, t2[8] = t2[9] = t2[10] = 0, t2[11] = h2 >>> 29, t2[12] = h2 >>> 21 & 255, t2[13] = h2 >>> 13 & 255, t2[14] = h2 >>> 5 & 255, t2[15] = h2 << 3 & 255, e2.mac(pe.MAC.GCM, pe.HEAP_DATA, 16), e2.get_iv(pe.HEAP_DATA), e2.set_counter(0, 0, 0, this.gamma0), e2.cipher(pe.ENC.CTR, pe.HEAP_DATA, 16), o2.set(t2.subarray(0, i2), s2), this.counter = 1, this.aes.pos = 0, this.aes.len = 0, o2;
  }
  AES_GCM_Decrypt_process(e2) {
    let t2 = 0, r2 = e2.length || 0, {asm: i2, heap: n2} = this.aes.acquire_asm(), a2 = this.counter, s2 = this.tagSize, o2 = this.aes.pos, c2 = this.aes.len, u2 = 0, h2 = c2 + r2 > s2 ? c2 + r2 - s2 & -16 : 0, f2 = c2 + r2 - h2, d2 = 0;
    if ((a2 - 1 << 4) + c2 + r2 > 68719476704)
      throw new RangeError("counter overflow");
    const l2 = new Uint8Array(h2);
    for (; r2 > f2; )
      d2 = me(n2, o2 + c2, e2, t2, r2 - f2), c2 += d2, t2 += d2, r2 -= d2, d2 = i2.mac(pe.MAC.GCM, pe.HEAP_DATA + o2, d2), d2 = i2.cipher(pe.DEC.CTR, pe.HEAP_DATA + o2, d2), d2 && l2.set(n2.subarray(o2, o2 + d2), u2), a2 += d2 >>> 4, u2 += d2, o2 = 0, c2 = 0;
    return r2 > 0 && (c2 += me(n2, 0, e2, t2, r2)), this.counter = a2, this.aes.pos = o2, this.aes.len = c2, l2;
  }
  AES_GCM_Decrypt_finish() {
    let {asm: e2, heap: t2} = this.aes.acquire_asm(), r2 = this.tagSize, i2 = this.adata, n2 = this.counter, a2 = this.aes.pos, s2 = this.aes.len, o2 = s2 - r2;
    if (s2 < r2)
      throw new we("authentication tag not found");
    const c2 = new Uint8Array(o2), u2 = new Uint8Array(t2.subarray(a2 + o2, a2 + s2));
    let h2 = o2;
    for (; 15 & h2; h2++)
      t2[a2 + h2] = 0;
    e2.mac(pe.MAC.GCM, pe.HEAP_DATA + a2, h2), e2.cipher(pe.DEC.CTR, pe.HEAP_DATA + a2, h2), o2 && c2.set(t2.subarray(a2, a2 + o2));
    const f2 = i2 !== void 0 ? i2.length : 0, d2 = (n2 - 1 << 4) + s2 - r2;
    t2[0] = 0, t2[1] = 0, t2[2] = 0, t2[3] = f2 >>> 29, t2[4] = f2 >>> 21, t2[5] = f2 >>> 13 & 255, t2[6] = f2 >>> 5 & 255, t2[7] = f2 << 3 & 255, t2[8] = t2[9] = t2[10] = 0, t2[11] = d2 >>> 29, t2[12] = d2 >>> 21 & 255, t2[13] = d2 >>> 13 & 255, t2[14] = d2 >>> 5 & 255, t2[15] = d2 << 3 & 255, e2.mac(pe.MAC.GCM, pe.HEAP_DATA, 16), e2.get_iv(pe.HEAP_DATA), e2.set_counter(0, 0, 0, this.gamma0), e2.cipher(pe.ENC.CTR, pe.HEAP_DATA, 16);
    let l2 = 0;
    for (let e3 = 0; e3 < r2; ++e3)
      l2 |= u2[e3] ^ t2[e3];
    if (l2)
      throw new _e("data integrity check failed");
    return this.counter = 1, this.aes.pos = 0, this.aes.len = 0, c2;
  }
  AES_GCM_decrypt(e2) {
    const t2 = this.AES_GCM_Decrypt_process(e2), r2 = this.AES_GCM_Decrypt_finish(), i2 = new Uint8Array(t2.length + r2.length);
    return t2.length && i2.set(t2), r2.length && i2.set(r2, t2.length), i2;
  }
  AES_GCM_encrypt(e2) {
    const t2 = this.AES_GCM_Encrypt_process(e2), r2 = this.AES_GCM_Encrypt_finish(), i2 = new Uint8Array(t2.length + r2.length);
    return t2.length && i2.set(t2), r2.length && i2.set(r2, t2.length), i2;
  }
  _gcm_mac_process(e2) {
    let {asm: t2, heap: r2} = this.aes.acquire_asm(), i2 = 0, n2 = e2.length || 0, a2 = 0;
    for (; n2 > 0; ) {
      for (a2 = me(r2, 0, e2, i2, n2), i2 += a2, n2 -= a2; 15 & a2; )
        r2[a2++] = 0;
      t2.mac(pe.MAC.GCM, pe.HEAP_DATA, a2);
    }
  }
}
const zn = V.getWebCrypto(), qn = V.getNodeCrypto(), On = V.getNodeBuffer();
async function Fn(e2, t2) {
  if (e2 !== re.symmetric.aes128 && e2 !== re.symmetric.aes192 && e2 !== re.symmetric.aes256)
    throw Error("GCM mode supports only AES cipher");
  if (V.getWebCrypto() && t2.length !== 24) {
    const e3 = await zn.importKey("raw", t2, {name: "AES-GCM"}, false, ["encrypt", "decrypt"]);
    return {encrypt: async function(r2, i2, n2 = new Uint8Array()) {
      if (!r2.length)
        return Tn.encrypt(r2, t2, i2, n2);
      const a2 = await zn.encrypt({name: "AES-GCM", iv: i2, additionalData: n2, tagLength: 128}, e3, r2);
      return new Uint8Array(a2);
    }, decrypt: async function(r2, i2, n2 = new Uint8Array()) {
      if (r2.length === 16)
        return Tn.decrypt(r2, t2, i2, n2);
      const a2 = await zn.decrypt({name: "AES-GCM", iv: i2, additionalData: n2, tagLength: 128}, e3, r2);
      return new Uint8Array(a2);
    }};
  }
  return V.getNodeCrypto() ? {encrypt: async function(e3, r2, i2 = new Uint8Array()) {
    const n2 = new qn.createCipheriv("aes-" + 8 * t2.length + "-gcm", t2, r2);
    n2.setAAD(i2);
    const a2 = On.concat([n2.update(e3), n2.final(), n2.getAuthTag()]);
    return new Uint8Array(a2);
  }, decrypt: async function(e3, r2, i2 = new Uint8Array()) {
    const n2 = new qn.createDecipheriv("aes-" + 8 * t2.length + "-gcm", t2, r2);
    n2.setAAD(i2), n2.setAuthTag(e3.slice(e3.length - 16, e3.length));
    const a2 = On.concat([n2.update(e3.slice(0, e3.length - 16)), n2.final()]);
    return new Uint8Array(a2);
  }} : {encrypt: async function(e3, r2, i2) {
    return Tn.encrypt(e3, t2, r2, i2);
  }, decrypt: async function(e3, r2, i2) {
    return Tn.decrypt(e3, t2, r2, i2);
  }};
}
Fn.getNonce = function(e2, t2) {
  const r2 = e2.slice();
  for (let e3 = 0; e3 < t2.length; e3++)
    r2[4 + e3] ^= t2[e3];
  return r2;
}, Fn.blockLength = 16, Fn.ivLength = 12, Fn.tagLength = 16;
var Nn = {cfb: ln, gcm: Fn, experimentalGCM: Fn, eax: Cn, ocb: Bn};
var jn = /* @__PURE__ */ Object.freeze({__proto__: null, parseSignatureParams: function(e2, t2) {
  let r2 = 0;
  switch (e2) {
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaSign:
      return {s: V.readMPI(t2.subarray(r2))};
    case re.publicKey.dsa:
    case re.publicKey.ecdsa: {
      const e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2;
      return {r: e3, s: V.readMPI(t2.subarray(r2))};
    }
    case re.publicKey.eddsa: {
      let e3 = V.readMPI(t2.subarray(r2));
      r2 += e3.length + 2, e3 = V.leftPad(e3, 32);
      let i2 = V.readMPI(t2.subarray(r2));
      return i2 = V.leftPad(i2, 32), {r: e3, s: i2};
    }
    default:
      throw new mi("Unknown signature algorithm.");
  }
}, verify: async function(e2, t2, r2, i2, n2, a2) {
  switch (e2) {
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaSign: {
      const {n: e3, e: s2} = i2, o2 = V.leftPad(r2.s, e3.length);
      return rn.rsa.verify(t2, n2, o2, e3, s2, a2);
    }
    case re.publicKey.dsa: {
      const {g: e3, p: n3, q: s2, y: o2} = i2, {r: c2, s: u2} = r2;
      return rn.dsa.verify(t2, c2, u2, a2, e3, n3, s2, o2);
    }
    case re.publicKey.ecdsa: {
      const {oid: e3, Q: s2} = i2, o2 = new rn.elliptic.Curve(e3).payloadSize, c2 = V.leftPad(r2.r, o2), u2 = V.leftPad(r2.s, o2);
      return rn.elliptic.ecdsa.verify(e3, t2, {r: c2, s: u2}, n2, s2, a2);
    }
    case re.publicKey.eddsa: {
      const {oid: e3, Q: s2} = i2;
      return rn.elliptic.eddsa.verify(e3, t2, r2, n2, s2, a2);
    }
    default:
      throw Error("Unknown signature algorithm.");
  }
}, sign: async function(e2, t2, r2, i2, n2, a2) {
  if (!r2 || !i2)
    throw Error("Missing key parameters");
  switch (e2) {
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaEncrypt:
    case re.publicKey.rsaSign: {
      const {n: e3, e: s2} = r2, {d: o2, p: c2, q: u2, u: h2} = i2;
      return {s: await rn.rsa.sign(t2, n2, e3, s2, o2, c2, u2, h2, a2)};
    }
    case re.publicKey.dsa: {
      const {g: e3, p: n3, q: s2} = r2, {x: o2} = i2;
      return rn.dsa.sign(t2, a2, e3, n3, s2, o2);
    }
    case re.publicKey.elgamal:
      throw Error("Signing with Elgamal is not defined in the OpenPGP standard.");
    case re.publicKey.ecdsa: {
      const {oid: e3, Q: s2} = r2, {d: o2} = i2;
      return rn.elliptic.ecdsa.sign(e3, t2, n2, s2, o2, a2);
    }
    case re.publicKey.eddsa: {
      const {oid: e3, Q: s2} = r2, {seed: o2} = i2;
      return rn.elliptic.eddsa.sign(e3, t2, n2, s2, o2, a2);
    }
    default:
      throw Error("Unknown signature algorithm.");
  }
}});
const Ln = {cipher: Le, hash: zr, mode: Nn, publicKey: rn, signature: jn, random: Wr, pkcs1: Qr, pkcs5: $i, aesKW: Hi};
Object.assign(Ln, cn);
var Wn = typeof Uint8Array != "undefined" && typeof Uint16Array != "undefined" && typeof Int32Array != "undefined";
function Hn(e2, t2) {
  return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
}
const Gn = {arraySet: function(e2, t2, r2, i2, n2) {
  if (t2.subarray && e2.subarray)
    e2.set(t2.subarray(r2, r2 + i2), n2);
  else
    for (let a2 = 0; a2 < i2; a2++)
      e2[n2 + a2] = t2[r2 + a2];
}, flattenChunks: function(e2) {
  let t2, r2, i2, n2, a2;
  for (i2 = 0, t2 = 0, r2 = e2.length; t2 < r2; t2++)
    i2 += e2[t2].length;
  const s2 = new Uint8Array(i2);
  for (n2 = 0, t2 = 0, r2 = e2.length; t2 < r2; t2++)
    a2 = e2[t2], s2.set(a2, n2), n2 += a2.length;
  return s2;
}}, Vn = {arraySet: function(e2, t2, r2, i2, n2) {
  for (let a2 = 0; a2 < i2; a2++)
    e2[n2 + a2] = t2[r2 + a2];
}, flattenChunks: function(e2) {
  return [].concat.apply([], e2);
}};
let $n = Wn ? Uint8Array : Array, Zn = Wn ? Uint16Array : Array, Yn = Wn ? Int32Array : Array, Xn = Wn ? Gn.flattenChunks : Vn.flattenChunks, Qn = Wn ? Gn.arraySet : Vn.arraySet;
function Jn(e2) {
  let t2 = e2.length;
  for (; --t2 >= 0; )
    e2[t2] = 0;
}
const ea = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], ta = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], ra = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], ia = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], na = Array(576);
Jn(na);
const aa = Array(60);
Jn(aa);
const sa = Array(512);
Jn(sa);
const oa = Array(256);
Jn(oa);
const ca = Array(29);
Jn(ca);
const ua = Array(30);
function ha(e2, t2, r2, i2, n2) {
  this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = i2, this.max_length = n2, this.has_stree = e2 && e2.length;
}
let fa, da, la;
function pa(e2, t2) {
  this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
}
function ya(e2) {
  return e2 < 256 ? sa[e2] : sa[256 + (e2 >>> 7)];
}
function ba(e2, t2) {
  e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
}
function ma(e2, t2, r2) {
  e2.bi_valid > 16 - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, ba(e2, e2.bi_buf), e2.bi_buf = t2 >> 16 - e2.bi_valid, e2.bi_valid += r2 - 16) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
}
function ga(e2, t2, r2) {
  ma(e2, r2[2 * t2], r2[2 * t2 + 1]);
}
function wa(e2, t2) {
  let r2 = 0;
  do {
    r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1;
  } while (--t2 > 0);
  return r2 >>> 1;
}
function va(e2, t2, r2) {
  const i2 = Array(16);
  let n2, a2, s2 = 0;
  for (n2 = 1; n2 <= 15; n2++)
    i2[n2] = s2 = s2 + r2[n2 - 1] << 1;
  for (a2 = 0; a2 <= t2; a2++) {
    const t3 = e2[2 * a2 + 1];
    t3 !== 0 && (e2[2 * a2] = wa(i2[t3]++, t3));
  }
}
function _a(e2) {
  let t2;
  for (t2 = 0; t2 < 286; t2++)
    e2.dyn_ltree[2 * t2] = 0;
  for (t2 = 0; t2 < 30; t2++)
    e2.dyn_dtree[2 * t2] = 0;
  for (t2 = 0; t2 < 19; t2++)
    e2.bl_tree[2 * t2] = 0;
  e2.dyn_ltree[512] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
}
function ka(e2) {
  e2.bi_valid > 8 ? ba(e2, e2.bi_buf) : e2.bi_valid > 0 && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
}
function Aa(e2, t2, r2, i2) {
  const n2 = 2 * t2, a2 = 2 * r2;
  return e2[n2] < e2[a2] || e2[n2] === e2[a2] && i2[t2] <= i2[r2];
}
function Sa(e2, t2, r2) {
  const i2 = e2.heap[r2];
  let n2 = r2 << 1;
  for (; n2 <= e2.heap_len && (n2 < e2.heap_len && Aa(t2, e2.heap[n2 + 1], e2.heap[n2], e2.depth) && n2++, !Aa(t2, i2, e2.heap[n2], e2.depth)); )
    e2.heap[r2] = e2.heap[n2], r2 = n2, n2 <<= 1;
  e2.heap[r2] = i2;
}
function Ea(e2, t2, r2) {
  let i2, n2, a2, s2, o2 = 0;
  if (e2.last_lit !== 0)
    do {
      i2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], n2 = e2.pending_buf[e2.l_buf + o2], o2++, i2 === 0 ? ga(e2, n2, t2) : (a2 = oa[n2], ga(e2, a2 + 256 + 1, t2), s2 = ea[a2], s2 !== 0 && (n2 -= ca[a2], ma(e2, n2, s2)), i2--, a2 = ya(i2), ga(e2, a2, r2), s2 = ta[a2], s2 !== 0 && (i2 -= ua[a2], ma(e2, i2, s2)));
    } while (o2 < e2.last_lit);
  ga(e2, 256, t2);
}
function Pa(e2, t2) {
  const r2 = t2.dyn_tree, i2 = t2.stat_desc.static_tree, n2 = t2.stat_desc.has_stree, a2 = t2.stat_desc.elems;
  let s2, o2, c2, u2 = -1;
  for (e2.heap_len = 0, e2.heap_max = 573, s2 = 0; s2 < a2; s2++)
    r2[2 * s2] !== 0 ? (e2.heap[++e2.heap_len] = u2 = s2, e2.depth[s2] = 0) : r2[2 * s2 + 1] = 0;
  for (; e2.heap_len < 2; )
    c2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0, r2[2 * c2] = 1, e2.depth[c2] = 0, e2.opt_len--, n2 && (e2.static_len -= i2[2 * c2 + 1]);
  for (t2.max_code = u2, s2 = e2.heap_len >> 1; s2 >= 1; s2--)
    Sa(e2, r2, s2);
  c2 = a2;
  do {
    s2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], Sa(e2, r2, 1), o2 = e2.heap[1], e2.heap[--e2.heap_max] = s2, e2.heap[--e2.heap_max] = o2, r2[2 * c2] = r2[2 * s2] + r2[2 * o2], e2.depth[c2] = (e2.depth[s2] >= e2.depth[o2] ? e2.depth[s2] : e2.depth[o2]) + 1, r2[2 * s2 + 1] = r2[2 * o2 + 1] = c2, e2.heap[1] = c2++, Sa(e2, r2, 1);
  } while (e2.heap_len >= 2);
  e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
    const r3 = t3.dyn_tree, i3 = t3.max_code, n3 = t3.stat_desc.static_tree, a3 = t3.stat_desc.has_stree, s3 = t3.stat_desc.extra_bits, o3 = t3.stat_desc.extra_base, c3 = t3.stat_desc.max_length;
    let u3, h2, f2, d2, l2, p2, y2 = 0;
    for (d2 = 0; d2 <= 15; d2++)
      e3.bl_count[d2] = 0;
    for (r3[2 * e3.heap[e3.heap_max] + 1] = 0, u3 = e3.heap_max + 1; u3 < 573; u3++)
      h2 = e3.heap[u3], d2 = r3[2 * r3[2 * h2 + 1] + 1] + 1, d2 > c3 && (d2 = c3, y2++), r3[2 * h2 + 1] = d2, h2 > i3 || (e3.bl_count[d2]++, l2 = 0, h2 >= o3 && (l2 = s3[h2 - o3]), p2 = r3[2 * h2], e3.opt_len += p2 * (d2 + l2), a3 && (e3.static_len += p2 * (n3[2 * h2 + 1] + l2)));
    if (y2 !== 0) {
      do {
        for (d2 = c3 - 1; e3.bl_count[d2] === 0; )
          d2--;
        e3.bl_count[d2]--, e3.bl_count[d2 + 1] += 2, e3.bl_count[c3]--, y2 -= 2;
      } while (y2 > 0);
      for (d2 = c3; d2 !== 0; d2--)
        for (h2 = e3.bl_count[d2]; h2 !== 0; )
          f2 = e3.heap[--u3], f2 > i3 || (r3[2 * f2 + 1] !== d2 && (e3.opt_len += (d2 - r3[2 * f2 + 1]) * r3[2 * f2], r3[2 * f2 + 1] = d2), h2--);
    }
  }(e2, t2), va(r2, u2, e2.bl_count);
}
function xa(e2, t2, r2) {
  let i2, n2, a2 = -1, s2 = t2[1], o2 = 0, c2 = 7, u2 = 4;
  for (s2 === 0 && (c2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, i2 = 0; i2 <= r2; i2++)
    n2 = s2, s2 = t2[2 * (i2 + 1) + 1], ++o2 < c2 && n2 === s2 || (o2 < u2 ? e2.bl_tree[2 * n2] += o2 : n2 !== 0 ? (n2 !== a2 && e2.bl_tree[2 * n2]++, e2.bl_tree[32]++) : o2 <= 10 ? e2.bl_tree[34]++ : e2.bl_tree[36]++, o2 = 0, a2 = n2, s2 === 0 ? (c2 = 138, u2 = 3) : n2 === s2 ? (c2 = 6, u2 = 3) : (c2 = 7, u2 = 4));
}
function Ma(e2, t2, r2) {
  let i2, n2, a2 = -1, s2 = t2[1], o2 = 0, c2 = 7, u2 = 4;
  for (s2 === 0 && (c2 = 138, u2 = 3), i2 = 0; i2 <= r2; i2++)
    if (n2 = s2, s2 = t2[2 * (i2 + 1) + 1], !(++o2 < c2 && n2 === s2)) {
      if (o2 < u2)
        do {
          ga(e2, n2, e2.bl_tree);
        } while (--o2 != 0);
      else
        n2 !== 0 ? (n2 !== a2 && (ga(e2, n2, e2.bl_tree), o2--), ga(e2, 16, e2.bl_tree), ma(e2, o2 - 3, 2)) : o2 <= 10 ? (ga(e2, 17, e2.bl_tree), ma(e2, o2 - 3, 3)) : (ga(e2, 18, e2.bl_tree), ma(e2, o2 - 11, 7));
      o2 = 0, a2 = n2, s2 === 0 ? (c2 = 138, u2 = 3) : n2 === s2 ? (c2 = 6, u2 = 3) : (c2 = 7, u2 = 4);
    }
}
Jn(ua);
let Ca = false;
function Ka(e2) {
  Ca || (!function() {
    let e3, t2, r2, i2, n2;
    const a2 = Array(16);
    for (r2 = 0, i2 = 0; i2 < 28; i2++)
      for (ca[i2] = r2, e3 = 0; e3 < 1 << ea[i2]; e3++)
        oa[r2++] = i2;
    for (oa[r2 - 1] = i2, n2 = 0, i2 = 0; i2 < 16; i2++)
      for (ua[i2] = n2, e3 = 0; e3 < 1 << ta[i2]; e3++)
        sa[n2++] = i2;
    for (n2 >>= 7; i2 < 30; i2++)
      for (ua[i2] = n2 << 7, e3 = 0; e3 < 1 << ta[i2] - 7; e3++)
        sa[256 + n2++] = i2;
    for (t2 = 0; t2 <= 15; t2++)
      a2[t2] = 0;
    for (e3 = 0; e3 <= 143; )
      na[2 * e3 + 1] = 8, e3++, a2[8]++;
    for (; e3 <= 255; )
      na[2 * e3 + 1] = 9, e3++, a2[9]++;
    for (; e3 <= 279; )
      na[2 * e3 + 1] = 7, e3++, a2[7]++;
    for (; e3 <= 287; )
      na[2 * e3 + 1] = 8, e3++, a2[8]++;
    for (va(na, 287, a2), e3 = 0; e3 < 30; e3++)
      aa[2 * e3 + 1] = 5, aa[2 * e3] = wa(e3, 5);
    fa = new ha(na, ea, 257, 286, 15), da = new ha(aa, ta, 0, 30, 15), la = new ha([], ra, 0, 19, 7);
  }(), Ca = true), e2.l_desc = new pa(e2.dyn_ltree, fa), e2.d_desc = new pa(e2.dyn_dtree, da), e2.bl_desc = new pa(e2.bl_tree, la), e2.bi_buf = 0, e2.bi_valid = 0, _a(e2);
}
function Da(e2, t2, r2, i2) {
  ma(e2, 0 + (i2 ? 1 : 0), 3), function(e3, t3, r3, i3) {
    ka(e3), i3 && (ba(e3, r3), ba(e3, ~r3)), Qn(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
  }(e2, t2, r2, true);
}
function Ra(e2) {
  ma(e2, 2, 3), ga(e2, 256, na), function(e3) {
    e3.bi_valid === 16 ? (ba(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : e3.bi_valid >= 8 && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
  }(e2);
}
function Ua(e2, t2, r2, i2) {
  let n2, a2, s2 = 0;
  e2.level > 0 ? (e2.strm.data_type === 2 && (e2.strm.data_type = function(e3) {
    let t3, r3 = 4093624447;
    for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1)
      if (1 & r3 && e3.dyn_ltree[2 * t3] !== 0)
        return 0;
    if (e3.dyn_ltree[18] !== 0 || e3.dyn_ltree[20] !== 0 || e3.dyn_ltree[26] !== 0)
      return 1;
    for (t3 = 32; t3 < 256; t3++)
      if (e3.dyn_ltree[2 * t3] !== 0)
        return 1;
    return 0;
  }(e2)), Pa(e2, e2.l_desc), Pa(e2, e2.d_desc), s2 = function(e3) {
    let t3;
    for (xa(e3, e3.dyn_ltree, e3.l_desc.max_code), xa(e3, e3.dyn_dtree, e3.d_desc.max_code), Pa(e3, e3.bl_desc), t3 = 18; t3 >= 3 && e3.bl_tree[2 * ia[t3] + 1] === 0; t3--)
      ;
    return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
  }(e2), n2 = e2.opt_len + 3 + 7 >>> 3, a2 = e2.static_len + 3 + 7 >>> 3, a2 <= n2 && (n2 = a2)) : n2 = a2 = r2 + 5, r2 + 4 <= n2 && t2 !== -1 ? Da(e2, t2, r2, i2) : e2.strategy === 4 || a2 === n2 ? (ma(e2, 2 + (i2 ? 1 : 0), 3), Ea(e2, na, aa)) : (ma(e2, 4 + (i2 ? 1 : 0), 3), function(e3, t3, r3, i3) {
    let n3;
    for (ma(e3, t3 - 257, 5), ma(e3, r3 - 1, 5), ma(e3, i3 - 4, 4), n3 = 0; n3 < i3; n3++)
      ma(e3, e3.bl_tree[2 * ia[n3] + 1], 3);
    Ma(e3, e3.dyn_ltree, t3 - 1), Ma(e3, e3.dyn_dtree, r3 - 1);
  }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, s2 + 1), Ea(e2, e2.dyn_ltree, e2.dyn_dtree)), _a(e2), i2 && ka(e2);
}
function Ia(e2, t2, r2) {
  return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, t2 === 0 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (oa[r2] + 256 + 1)]++, e2.dyn_dtree[2 * ya(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
}
function Ba(e2, t2, r2, i2) {
  let n2 = 65535 & e2 | 0, a2 = e2 >>> 16 & 65535 | 0, s2 = 0;
  for (; r2 !== 0; ) {
    s2 = r2 > 2e3 ? 2e3 : r2, r2 -= s2;
    do {
      n2 = n2 + t2[i2++] | 0, a2 = a2 + n2 | 0;
    } while (--s2);
    n2 %= 65521, a2 %= 65521;
  }
  return n2 | a2 << 16 | 0;
}
const Ta = function() {
  let e2;
  const t2 = [];
  for (let r2 = 0; r2 < 256; r2++) {
    e2 = r2;
    for (let t3 = 0; t3 < 8; t3++)
      e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
    t2[r2] = e2;
  }
  return t2;
}();
function za(e2, t2, r2, i2) {
  const n2 = Ta, a2 = i2 + r2;
  e2 ^= -1;
  for (let r3 = i2; r3 < a2; r3++)
    e2 = e2 >>> 8 ^ n2[255 & (e2 ^ t2[r3])];
  return -1 ^ e2;
}
var qa = {2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version"};
function Oa(e2, t2) {
  return e2.msg = qa[t2], t2;
}
function Fa(e2) {
  return (e2 << 1) - (e2 > 4 ? 9 : 0);
}
function Na(e2) {
  let t2 = e2.length;
  for (; --t2 >= 0; )
    e2[t2] = 0;
}
function ja(e2) {
  const t2 = e2.state;
  let r2 = t2.pending;
  r2 > e2.avail_out && (r2 = e2.avail_out), r2 !== 0 && (Qn(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, t2.pending === 0 && (t2.pending_out = 0));
}
function La(e2, t2) {
  Ua(e2, e2.block_start >= 0 ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, ja(e2.strm);
}
function Wa(e2, t2) {
  e2.pending_buf[e2.pending++] = t2;
}
function Ha(e2, t2) {
  e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
}
function Ga(e2, t2, r2, i2) {
  let n2 = e2.avail_in;
  return n2 > i2 && (n2 = i2), n2 === 0 ? 0 : (e2.avail_in -= n2, Qn(t2, e2.input, e2.next_in, n2, r2), e2.state.wrap === 1 ? e2.adler = Ba(e2.adler, t2, n2, r2) : e2.state.wrap === 2 && (e2.adler = za(e2.adler, t2, n2, r2)), e2.next_in += n2, e2.total_in += n2, n2);
}
function Va(e2, t2) {
  let r2, i2, n2 = e2.max_chain_length, a2 = e2.strstart, s2 = e2.prev_length, o2 = e2.nice_match;
  const c2 = e2.strstart > e2.w_size - 262 ? e2.strstart - (e2.w_size - 262) : 0, u2 = e2.window, h2 = e2.w_mask, f2 = e2.prev, d2 = e2.strstart + 258;
  let l2 = u2[a2 + s2 - 1], p2 = u2[a2 + s2];
  e2.prev_length >= e2.good_match && (n2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
  do {
    if (r2 = t2, u2[r2 + s2] === p2 && u2[r2 + s2 - 1] === l2 && u2[r2] === u2[a2] && u2[++r2] === u2[a2 + 1]) {
      a2 += 2, r2++;
      do {
      } while (u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && u2[++a2] === u2[++r2] && a2 < d2);
      if (i2 = 258 - (d2 - a2), a2 = d2 - 258, i2 > s2) {
        if (e2.match_start = t2, s2 = i2, i2 >= o2)
          break;
        l2 = u2[a2 + s2 - 1], p2 = u2[a2 + s2];
      }
    }
  } while ((t2 = f2[t2 & h2]) > c2 && --n2 != 0);
  return s2 <= e2.lookahead ? s2 : e2.lookahead;
}
function $a(e2) {
  const t2 = e2.w_size;
  let r2, i2, n2, a2, s2;
  do {
    if (a2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= t2 + (t2 - 262)) {
      Qn(e2.window, e2.window, t2, t2, 0), e2.match_start -= t2, e2.strstart -= t2, e2.block_start -= t2, i2 = e2.hash_size, r2 = i2;
      do {
        n2 = e2.head[--r2], e2.head[r2] = n2 >= t2 ? n2 - t2 : 0;
      } while (--i2);
      i2 = t2, r2 = i2;
      do {
        n2 = e2.prev[--r2], e2.prev[r2] = n2 >= t2 ? n2 - t2 : 0;
      } while (--i2);
      a2 += t2;
    }
    if (e2.strm.avail_in === 0)
      break;
    if (i2 = Ga(e2.strm, e2.window, e2.strstart + e2.lookahead, a2), e2.lookahead += i2, e2.lookahead + e2.insert >= 3)
      for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 3 - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < 3)); )
        ;
  } while (e2.lookahead < 262 && e2.strm.avail_in !== 0);
}
function Za(e2, t2) {
  let r2, i2;
  for (; ; ) {
    if (e2.lookahead < 262) {
      if ($a(e2), e2.lookahead < 262 && t2 === 0)
        return 1;
      if (e2.lookahead === 0)
        break;
    }
    if (r2 = 0, e2.lookahead >= 3 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 3 - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), r2 !== 0 && e2.strstart - r2 <= e2.w_size - 262 && (e2.match_length = Va(e2, r2)), e2.match_length >= 3)
      if (i2 = Ia(e2, e2.strstart - e2.match_start, e2.match_length - 3), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= 3) {
        e2.match_length--;
        do {
          e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 3 - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart;
        } while (--e2.match_length != 0);
        e2.strstart++;
      } else
        e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
    else
      i2 = Ia(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
    if (i2 && (La(e2, false), e2.strm.avail_out === 0))
      return 1;
  }
  return e2.insert = e2.strstart < 2 ? e2.strstart : 2, t2 === 4 ? (La(e2, true), e2.strm.avail_out === 0 ? 3 : 4) : e2.last_lit && (La(e2, false), e2.strm.avail_out === 0) ? 1 : 2;
}
function Ya(e2, t2) {
  let r2, i2, n2;
  for (; ; ) {
    if (e2.lookahead < 262) {
      if ($a(e2), e2.lookahead < 262 && t2 === 0)
        return 1;
      if (e2.lookahead === 0)
        break;
    }
    if (r2 = 0, e2.lookahead >= 3 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 3 - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = 2, r2 !== 0 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - 262 && (e2.match_length = Va(e2, r2), e2.match_length <= 5 && (e2.strategy === 1 || e2.match_length === 3 && e2.strstart - e2.match_start > 4096) && (e2.match_length = 2)), e2.prev_length >= 3 && e2.match_length <= e2.prev_length) {
      n2 = e2.strstart + e2.lookahead - 3, i2 = Ia(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - 3), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2;
      do {
        ++e2.strstart <= n2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 3 - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart);
      } while (--e2.prev_length != 0);
      if (e2.match_available = 0, e2.match_length = 2, e2.strstart++, i2 && (La(e2, false), e2.strm.avail_out === 0))
        return 1;
    } else if (e2.match_available) {
      if (i2 = Ia(e2, 0, e2.window[e2.strstart - 1]), i2 && La(e2, false), e2.strstart++, e2.lookahead--, e2.strm.avail_out === 0)
        return 1;
    } else
      e2.match_available = 1, e2.strstart++, e2.lookahead--;
  }
  return e2.match_available && (i2 = Ia(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < 2 ? e2.strstart : 2, t2 === 4 ? (La(e2, true), e2.strm.avail_out === 0 ? 3 : 4) : e2.last_lit && (La(e2, false), e2.strm.avail_out === 0) ? 1 : 2;
}
class Xa {
  constructor(e2, t2, r2, i2, n2) {
    this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = i2, this.func = n2;
  }
}
const Qa = [new Xa(0, 0, 0, 0, function(e2, t2) {
  let r2 = 65535;
  for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
    if (e2.lookahead <= 1) {
      if ($a(e2), e2.lookahead === 0 && t2 === 0)
        return 1;
      if (e2.lookahead === 0)
        break;
    }
    e2.strstart += e2.lookahead, e2.lookahead = 0;
    const i2 = e2.block_start + r2;
    if ((e2.strstart === 0 || e2.strstart >= i2) && (e2.lookahead = e2.strstart - i2, e2.strstart = i2, La(e2, false), e2.strm.avail_out === 0))
      return 1;
    if (e2.strstart - e2.block_start >= e2.w_size - 262 && (La(e2, false), e2.strm.avail_out === 0))
      return 1;
  }
  return e2.insert = 0, t2 === 4 ? (La(e2, true), e2.strm.avail_out === 0 ? 3 : 4) : (e2.strstart > e2.block_start && (La(e2, false), e2.strm.avail_out), 1);
}), new Xa(4, 4, 8, 4, Za), new Xa(4, 5, 16, 8, Za), new Xa(4, 6, 32, 32, Za), new Xa(4, 4, 16, 16, Ya), new Xa(8, 16, 32, 32, Ya), new Xa(8, 16, 128, 128, Ya), new Xa(8, 32, 128, 256, Ya), new Xa(32, 128, 258, 1024, Ya), new Xa(32, 258, 258, 4096, Ya)];
class Ja {
  constructor() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Zn(1146), this.dyn_dtree = new Zn(122), this.bl_tree = new Zn(78), Na(this.dyn_ltree), Na(this.dyn_dtree), Na(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Zn(16), this.heap = new Zn(573), Na(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Zn(573), Na(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
}
function es(e2) {
  const t2 = function(e3) {
    let t3;
    return e3 && e3.state ? (e3.total_in = e3.total_out = 0, e3.data_type = 2, t3 = e3.state, t3.pending = 0, t3.pending_out = 0, t3.wrap < 0 && (t3.wrap = -t3.wrap), t3.status = t3.wrap ? 42 : 113, e3.adler = t3.wrap === 2 ? 0 : 1, t3.last_flush = 0, Ka(t3), 0) : Oa(e3, -2);
  }(e2);
  return t2 === 0 && function(e3) {
    e3.window_size = 2 * e3.w_size, Na(e3.head), e3.max_lazy_match = Qa[e3.level].max_lazy, e3.good_match = Qa[e3.level].good_length, e3.nice_match = Qa[e3.level].nice_length, e3.max_chain_length = Qa[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = 2, e3.match_available = 0, e3.ins_h = 0;
  }(e2.state), t2;
}
function ts(e2, t2) {
  let r2, i2, n2, a2;
  if (!e2 || !e2.state || t2 > 5 || t2 < 0)
    return e2 ? Oa(e2, -2) : -2;
  if (i2 = e2.state, !e2.output || !e2.input && e2.avail_in !== 0 || i2.status === 666 && t2 !== 4)
    return Oa(e2, e2.avail_out === 0 ? -5 : -2);
  if (i2.strm = e2, r2 = i2.last_flush, i2.last_flush = t2, i2.status === 42)
    if (i2.wrap === 2)
      e2.adler = 0, Wa(i2, 31), Wa(i2, 139), Wa(i2, 8), i2.gzhead ? (Wa(i2, (i2.gzhead.text ? 1 : 0) + (i2.gzhead.hcrc ? 2 : 0) + (i2.gzhead.extra ? 4 : 0) + (i2.gzhead.name ? 8 : 0) + (i2.gzhead.comment ? 16 : 0)), Wa(i2, 255 & i2.gzhead.time), Wa(i2, i2.gzhead.time >> 8 & 255), Wa(i2, i2.gzhead.time >> 16 & 255), Wa(i2, i2.gzhead.time >> 24 & 255), Wa(i2, i2.level === 9 ? 2 : i2.strategy >= 2 || i2.level < 2 ? 4 : 0), Wa(i2, 255 & i2.gzhead.os), i2.gzhead.extra && i2.gzhead.extra.length && (Wa(i2, 255 & i2.gzhead.extra.length), Wa(i2, i2.gzhead.extra.length >> 8 & 255)), i2.gzhead.hcrc && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending, 0)), i2.gzindex = 0, i2.status = 69) : (Wa(i2, 0), Wa(i2, 0), Wa(i2, 0), Wa(i2, 0), Wa(i2, 0), Wa(i2, i2.level === 9 ? 2 : i2.strategy >= 2 || i2.level < 2 ? 4 : 0), Wa(i2, 3), i2.status = 113);
    else {
      let t3 = 8 + (i2.w_bits - 8 << 4) << 8, r3 = -1;
      r3 = i2.strategy >= 2 || i2.level < 2 ? 0 : i2.level < 6 ? 1 : i2.level === 6 ? 2 : 3, t3 |= r3 << 6, i2.strstart !== 0 && (t3 |= 32), t3 += 31 - t3 % 31, i2.status = 113, Ha(i2, t3), i2.strstart !== 0 && (Ha(i2, e2.adler >>> 16), Ha(i2, 65535 & e2.adler)), e2.adler = 1;
    }
  if (i2.status === 69)
    if (i2.gzhead.extra) {
      for (n2 = i2.pending; i2.gzindex < (65535 & i2.gzhead.extra.length) && (i2.pending !== i2.pending_buf_size || (i2.gzhead.hcrc && i2.pending > n2 && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending - n2, n2)), ja(e2), n2 = i2.pending, i2.pending !== i2.pending_buf_size)); )
        Wa(i2, 255 & i2.gzhead.extra[i2.gzindex]), i2.gzindex++;
      i2.gzhead.hcrc && i2.pending > n2 && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending - n2, n2)), i2.gzindex === i2.gzhead.extra.length && (i2.gzindex = 0, i2.status = 73);
    } else
      i2.status = 73;
  if (i2.status === 73)
    if (i2.gzhead.name) {
      n2 = i2.pending;
      do {
        if (i2.pending === i2.pending_buf_size && (i2.gzhead.hcrc && i2.pending > n2 && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending - n2, n2)), ja(e2), n2 = i2.pending, i2.pending === i2.pending_buf_size)) {
          a2 = 1;
          break;
        }
        a2 = i2.gzindex < i2.gzhead.name.length ? 255 & i2.gzhead.name.charCodeAt(i2.gzindex++) : 0, Wa(i2, a2);
      } while (a2 !== 0);
      i2.gzhead.hcrc && i2.pending > n2 && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending - n2, n2)), a2 === 0 && (i2.gzindex = 0, i2.status = 91);
    } else
      i2.status = 91;
  if (i2.status === 91)
    if (i2.gzhead.comment) {
      n2 = i2.pending;
      do {
        if (i2.pending === i2.pending_buf_size && (i2.gzhead.hcrc && i2.pending > n2 && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending - n2, n2)), ja(e2), n2 = i2.pending, i2.pending === i2.pending_buf_size)) {
          a2 = 1;
          break;
        }
        a2 = i2.gzindex < i2.gzhead.comment.length ? 255 & i2.gzhead.comment.charCodeAt(i2.gzindex++) : 0, Wa(i2, a2);
      } while (a2 !== 0);
      i2.gzhead.hcrc && i2.pending > n2 && (e2.adler = za(e2.adler, i2.pending_buf, i2.pending - n2, n2)), a2 === 0 && (i2.status = 103);
    } else
      i2.status = 103;
  if (i2.status === 103 && (i2.gzhead.hcrc ? (i2.pending + 2 > i2.pending_buf_size && ja(e2), i2.pending + 2 <= i2.pending_buf_size && (Wa(i2, 255 & e2.adler), Wa(i2, e2.adler >> 8 & 255), e2.adler = 0, i2.status = 113)) : i2.status = 113), i2.pending !== 0) {
    if (ja(e2), e2.avail_out === 0)
      return i2.last_flush = -1, 0;
  } else if (e2.avail_in === 0 && Fa(t2) <= Fa(r2) && t2 !== 4)
    return Oa(e2, -5);
  if (i2.status === 666 && e2.avail_in !== 0)
    return Oa(e2, -5);
  if (e2.avail_in !== 0 || i2.lookahead !== 0 || t2 !== 0 && i2.status !== 666) {
    var s2 = i2.strategy === 2 ? function(e3, t3) {
      let r3;
      for (; ; ) {
        if (e3.lookahead === 0 && ($a(e3), e3.lookahead === 0)) {
          if (t3 === 0)
            return 1;
          break;
        }
        if (e3.match_length = 0, r3 = Ia(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (La(e3, false), e3.strm.avail_out === 0))
          return 1;
      }
      return e3.insert = 0, t3 === 4 ? (La(e3, true), e3.strm.avail_out === 0 ? 3 : 4) : e3.last_lit && (La(e3, false), e3.strm.avail_out === 0) ? 1 : 2;
    }(i2, t2) : i2.strategy === 3 ? function(e3, t3) {
      let r3, i3, n3, a3;
      const s3 = e3.window;
      for (; ; ) {
        if (e3.lookahead <= 258) {
          if ($a(e3), e3.lookahead <= 258 && t3 === 0)
            return 1;
          if (e3.lookahead === 0)
            break;
        }
        if (e3.match_length = 0, e3.lookahead >= 3 && e3.strstart > 0 && (n3 = e3.strstart - 1, i3 = s3[n3], i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3])) {
          a3 = e3.strstart + 258;
          do {
          } while (i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3] && i3 === s3[++n3] && n3 < a3);
          e3.match_length = 258 - (a3 - n3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
        }
        if (e3.match_length >= 3 ? (r3 = Ia(e3, 1, e3.match_length - 3), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = Ia(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (La(e3, false), e3.strm.avail_out === 0))
          return 1;
      }
      return e3.insert = 0, t3 === 4 ? (La(e3, true), e3.strm.avail_out === 0 ? 3 : 4) : e3.last_lit && (La(e3, false), e3.strm.avail_out === 0) ? 1 : 2;
    }(i2, t2) : Qa[i2.level].func(i2, t2);
    if (s2 !== 3 && s2 !== 4 || (i2.status = 666), s2 === 1 || s2 === 3)
      return e2.avail_out === 0 && (i2.last_flush = -1), 0;
    if (s2 === 2 && (t2 === 1 ? Ra(i2) : t2 !== 5 && (Da(i2, 0, 0, false), t2 === 3 && (Na(i2.head), i2.lookahead === 0 && (i2.strstart = 0, i2.block_start = 0, i2.insert = 0))), ja(e2), e2.avail_out === 0))
      return i2.last_flush = -1, 0;
  }
  return t2 !== 4 ? 0 : i2.wrap <= 0 ? 1 : (i2.wrap === 2 ? (Wa(i2, 255 & e2.adler), Wa(i2, e2.adler >> 8 & 255), Wa(i2, e2.adler >> 16 & 255), Wa(i2, e2.adler >> 24 & 255), Wa(i2, 255 & e2.total_in), Wa(i2, e2.total_in >> 8 & 255), Wa(i2, e2.total_in >> 16 & 255), Wa(i2, e2.total_in >> 24 & 255)) : (Ha(i2, e2.adler >>> 16), Ha(i2, 65535 & e2.adler)), ja(e2), i2.wrap > 0 && (i2.wrap = -i2.wrap), i2.pending !== 0 ? 0 : 1);
}
try {
  String.fromCharCode.call(null, 0);
} catch (e2) {
}
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch (e2) {
}
const rs = new $n(256);
for (let e2 = 0; e2 < 256; e2++)
  rs[e2] = e2 >= 252 ? 6 : e2 >= 248 ? 5 : e2 >= 240 ? 4 : e2 >= 224 ? 3 : e2 >= 192 ? 2 : 1;
function is(e2) {
  let t2, r2, i2, n2, a2 = 0;
  const s2 = e2.length;
  for (i2 = 0; i2 < s2; i2++)
    t2 = e2.charCodeAt(i2), (64512 & t2) == 55296 && i2 + 1 < s2 && (r2 = e2.charCodeAt(i2 + 1), (64512 & r2) == 56320 && (t2 = 65536 + (t2 - 55296 << 10) + (r2 - 56320), i2++)), a2 += t2 < 128 ? 1 : t2 < 2048 ? 2 : t2 < 65536 ? 3 : 4;
  const o2 = new $n(a2);
  for (n2 = 0, i2 = 0; n2 < a2; i2++)
    t2 = e2.charCodeAt(i2), (64512 & t2) == 55296 && i2 + 1 < s2 && (r2 = e2.charCodeAt(i2 + 1), (64512 & r2) == 56320 && (t2 = 65536 + (t2 - 55296 << 10) + (r2 - 56320), i2++)), t2 < 128 ? o2[n2++] = t2 : t2 < 2048 ? (o2[n2++] = 192 | t2 >>> 6, o2[n2++] = 128 | 63 & t2) : t2 < 65536 ? (o2[n2++] = 224 | t2 >>> 12, o2[n2++] = 128 | t2 >>> 6 & 63, o2[n2++] = 128 | 63 & t2) : (o2[n2++] = 240 | t2 >>> 18, o2[n2++] = 128 | t2 >>> 12 & 63, o2[n2++] = 128 | t2 >>> 6 & 63, o2[n2++] = 128 | 63 & t2);
  return o2;
}
rs[254] = rs[254] = 1;
class ns {
  constructor() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
}
class as {
  constructor(e2) {
    this.options = {level: -1, method: 8, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: 0, ...e2 || {}};
    const t2 = this.options;
    t2.raw && t2.windowBits > 0 ? t2.windowBits = -t2.windowBits : t2.gzip && t2.windowBits > 0 && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new ns(), this.strm.avail_out = 0;
    var r2, i2, n2 = function(e3, t3, r3, i3, n3, a2) {
      if (!e3)
        return -2;
      let s2 = 1;
      if (t3 === -1 && (t3 = 6), i3 < 0 ? (s2 = 0, i3 = -i3) : i3 > 15 && (s2 = 2, i3 -= 16), n3 < 1 || n3 > 9 || r3 !== 8 || i3 < 8 || i3 > 15 || t3 < 0 || t3 > 9 || a2 < 0 || a2 > 4)
        return Oa(e3, -2);
      i3 === 8 && (i3 = 9);
      const o2 = new Ja();
      return e3.state = o2, o2.strm = e3, o2.wrap = s2, o2.gzhead = null, o2.w_bits = i3, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = n3 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + 3 - 1) / 3), o2.window = new $n(2 * o2.w_size), o2.head = new Zn(o2.hash_size), o2.prev = new Zn(o2.w_size), o2.lit_bufsize = 1 << n3 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new $n(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t3, o2.strategy = a2, o2.method = r3, es(e3);
    }(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
    if (n2 !== 0)
      throw Error(qa[n2]);
    if (t2.header && (r2 = this.strm, i2 = t2.header, r2 && r2.state && (r2.state.wrap !== 2 || (r2.state.gzhead = i2))), t2.dictionary) {
      let e3;
      if (e3 = typeof t2.dictionary == "string" ? is(t2.dictionary) : t2.dictionary instanceof ArrayBuffer ? new Uint8Array(t2.dictionary) : t2.dictionary, (n2 = function(e4, t3) {
        let r3, i3, n3, a2, s2, o2, c2, u2, h2 = t3.length;
        if (!e4 || !e4.state)
          return -2;
        if (r3 = e4.state, a2 = r3.wrap, a2 === 2 || a2 === 1 && r3.status !== 42 || r3.lookahead)
          return -2;
        for (a2 === 1 && (e4.adler = Ba(e4.adler, t3, h2, 0)), r3.wrap = 0, h2 >= r3.w_size && (a2 === 0 && (Na(r3.head), r3.strstart = 0, r3.block_start = 0, r3.insert = 0), u2 = new $n(r3.w_size), Qn(u2, t3, h2 - r3.w_size, r3.w_size, 0), t3 = u2, h2 = r3.w_size), s2 = e4.avail_in, o2 = e4.next_in, c2 = e4.input, e4.avail_in = h2, e4.next_in = 0, e4.input = t3, $a(r3); r3.lookahead >= 3; ) {
          i3 = r3.strstart, n3 = r3.lookahead - 2;
          do {
            r3.ins_h = (r3.ins_h << r3.hash_shift ^ r3.window[i3 + 3 - 1]) & r3.hash_mask, r3.prev[i3 & r3.w_mask] = r3.head[r3.ins_h], r3.head[r3.ins_h] = i3, i3++;
          } while (--n3);
          r3.strstart = i3, r3.lookahead = 2, $a(r3);
        }
        return r3.strstart += r3.lookahead, r3.block_start = r3.strstart, r3.insert = r3.lookahead, r3.lookahead = 0, r3.match_length = r3.prev_length = 2, r3.match_available = 0, e4.next_in = o2, e4.input = c2, e4.avail_in = s2, r3.wrap = a2, 0;
      }(this.strm, e3)) !== 0)
        throw Error(qa[n2]);
      this._dict_set = true;
    }
  }
  push(e2, t2) {
    const {strm: r2, options: {chunkSize: i2}} = this;
    var n2, a2;
    if (this.ended)
      return false;
    a2 = t2 === ~~t2 ? t2 : t2 === true ? 4 : 0, typeof e2 == "string" ? r2.input = is(e2) : e2 instanceof ArrayBuffer ? r2.input = new Uint8Array(e2) : r2.input = e2, r2.next_in = 0, r2.avail_in = r2.input.length;
    do {
      if (r2.avail_out === 0 && (r2.output = new $n(i2), r2.next_out = 0, r2.avail_out = i2), (n2 = ts(r2, a2)) !== 1 && n2 !== 0)
        return this.onEnd(n2), this.ended = true, false;
      r2.avail_out !== 0 && (r2.avail_in !== 0 || a2 !== 4 && a2 !== 2) || this.onData(Hn(r2.output, r2.next_out));
    } while ((r2.avail_in > 0 || r2.avail_out === 0) && n2 !== 1);
    return a2 === 4 ? (n2 = function(e3) {
      let t3;
      return e3 && e3.state ? (t3 = e3.state.status, t3 !== 42 && t3 !== 69 && t3 !== 73 && t3 !== 91 && t3 !== 103 && t3 !== 113 && t3 !== 666 ? Oa(e3, -2) : (e3.state = null, t3 === 113 ? Oa(e3, -3) : 0)) : -2;
    }(this.strm), this.onEnd(n2), this.ended = true, n2 === 0) : a2 !== 2 || (this.onEnd(0), r2.avail_out = 0, true);
  }
  onData(e2) {
    this.chunks.push(e2);
  }
  onEnd(e2) {
    e2 === 0 && (this.result = Xn(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
  }
}
function ss(e2, t2) {
  let r2, i2, n2, a2, s2, o2, c2, u2, h2, f2;
  const d2 = e2.state;
  r2 = e2.next_in;
  const l2 = e2.input, p2 = r2 + (e2.avail_in - 5);
  i2 = e2.next_out;
  const y2 = e2.output, b2 = i2 - (t2 - e2.avail_out), m2 = i2 + (e2.avail_out - 257), g2 = d2.dmax, w2 = d2.wsize, v2 = d2.whave, _2 = d2.wnext, k2 = d2.window;
  n2 = d2.hold, a2 = d2.bits;
  const A2 = d2.lencode, S2 = d2.distcode, E2 = (1 << d2.lenbits) - 1, P2 = (1 << d2.distbits) - 1;
  e:
    do {
      a2 < 15 && (n2 += l2[r2++] << a2, a2 += 8, n2 += l2[r2++] << a2, a2 += 8), s2 = A2[n2 & E2];
      t:
        for (; ; ) {
          if (o2 = s2 >>> 24, n2 >>>= o2, a2 -= o2, o2 = s2 >>> 16 & 255, o2 === 0)
            y2[i2++] = 65535 & s2;
          else {
            if (!(16 & o2)) {
              if ((64 & o2) == 0) {
                s2 = A2[(65535 & s2) + (n2 & (1 << o2) - 1)];
                continue t;
              }
              if (32 & o2) {
                d2.mode = 12;
                break e;
              }
              e2.msg = "invalid literal/length code", d2.mode = 30;
              break e;
            }
            c2 = 65535 & s2, o2 &= 15, o2 && (a2 < o2 && (n2 += l2[r2++] << a2, a2 += 8), c2 += n2 & (1 << o2) - 1, n2 >>>= o2, a2 -= o2), a2 < 15 && (n2 += l2[r2++] << a2, a2 += 8, n2 += l2[r2++] << a2, a2 += 8), s2 = S2[n2 & P2];
            r:
              for (; ; ) {
                if (o2 = s2 >>> 24, n2 >>>= o2, a2 -= o2, o2 = s2 >>> 16 & 255, !(16 & o2)) {
                  if ((64 & o2) == 0) {
                    s2 = S2[(65535 & s2) + (n2 & (1 << o2) - 1)];
                    continue r;
                  }
                  e2.msg = "invalid distance code", d2.mode = 30;
                  break e;
                }
                if (u2 = 65535 & s2, o2 &= 15, a2 < o2 && (n2 += l2[r2++] << a2, a2 += 8, a2 < o2 && (n2 += l2[r2++] << a2, a2 += 8)), u2 += n2 & (1 << o2) - 1, u2 > g2) {
                  e2.msg = "invalid distance too far back", d2.mode = 30;
                  break e;
                }
                if (n2 >>>= o2, a2 -= o2, o2 = i2 - b2, u2 > o2) {
                  if (o2 = u2 - o2, o2 > v2 && d2.sane) {
                    e2.msg = "invalid distance too far back", d2.mode = 30;
                    break e;
                  }
                  if (h2 = 0, f2 = k2, _2 === 0) {
                    if (h2 += w2 - o2, o2 < c2) {
                      c2 -= o2;
                      do {
                        y2[i2++] = k2[h2++];
                      } while (--o2);
                      h2 = i2 - u2, f2 = y2;
                    }
                  } else if (_2 < o2) {
                    if (h2 += w2 + _2 - o2, o2 -= _2, o2 < c2) {
                      c2 -= o2;
                      do {
                        y2[i2++] = k2[h2++];
                      } while (--o2);
                      if (h2 = 0, _2 < c2) {
                        o2 = _2, c2 -= o2;
                        do {
                          y2[i2++] = k2[h2++];
                        } while (--o2);
                        h2 = i2 - u2, f2 = y2;
                      }
                    }
                  } else if (h2 += _2 - o2, o2 < c2) {
                    c2 -= o2;
                    do {
                      y2[i2++] = k2[h2++];
                    } while (--o2);
                    h2 = i2 - u2, f2 = y2;
                  }
                  for (; c2 > 2; )
                    y2[i2++] = f2[h2++], y2[i2++] = f2[h2++], y2[i2++] = f2[h2++], c2 -= 3;
                  c2 && (y2[i2++] = f2[h2++], c2 > 1 && (y2[i2++] = f2[h2++]));
                } else {
                  h2 = i2 - u2;
                  do {
                    y2[i2++] = y2[h2++], y2[i2++] = y2[h2++], y2[i2++] = y2[h2++], c2 -= 3;
                  } while (c2 > 2);
                  c2 && (y2[i2++] = y2[h2++], c2 > 1 && (y2[i2++] = y2[h2++]));
                }
                break;
              }
          }
          break;
        }
    } while (r2 < p2 && i2 < m2);
  c2 = a2 >> 3, r2 -= c2, a2 -= c2 << 3, n2 &= (1 << a2) - 1, e2.next_in = r2, e2.next_out = i2, e2.avail_in = r2 < p2 ? p2 - r2 + 5 : 5 - (r2 - p2), e2.avail_out = i2 < m2 ? m2 - i2 + 257 : 257 - (i2 - m2), d2.hold = n2, d2.bits = a2;
}
const os = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], cs = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], us = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], hs = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
function fs(e2, t2, r2, i2, n2, a2, s2, o2) {
  const c2 = o2.bits;
  let u2, h2, f2, d2, l2, p2 = 0, y2 = 0, b2 = 0, m2 = 0, g2 = 0, w2 = 0, v2 = 0, _2 = 0, k2 = 0, A2 = 0, S2 = null, E2 = 0;
  const P2 = new Zn(16), x2 = new Zn(16);
  let M2, C2, K2, D2 = null, R2 = 0;
  for (p2 = 0; p2 <= 15; p2++)
    P2[p2] = 0;
  for (y2 = 0; y2 < i2; y2++)
    P2[t2[r2 + y2]]++;
  for (g2 = c2, m2 = 15; m2 >= 1 && P2[m2] === 0; m2--)
    ;
  if (g2 > m2 && (g2 = m2), m2 === 0)
    return n2[a2++] = 20971520, n2[a2++] = 20971520, o2.bits = 1, 0;
  for (b2 = 1; b2 < m2 && P2[b2] === 0; b2++)
    ;
  for (g2 < b2 && (g2 = b2), _2 = 1, p2 = 1; p2 <= 15; p2++)
    if (_2 <<= 1, _2 -= P2[p2], _2 < 0)
      return -1;
  if (_2 > 0 && (e2 === 0 || m2 !== 1))
    return -1;
  for (x2[1] = 0, p2 = 1; p2 < 15; p2++)
    x2[p2 + 1] = x2[p2] + P2[p2];
  for (y2 = 0; y2 < i2; y2++)
    t2[r2 + y2] !== 0 && (s2[x2[t2[r2 + y2]]++] = y2);
  e2 === 0 ? (S2 = D2 = s2, l2 = 19) : e2 === 1 ? (S2 = os, E2 -= 257, D2 = cs, R2 -= 257, l2 = 256) : (S2 = us, D2 = hs, l2 = -1), A2 = 0, y2 = 0, p2 = b2, d2 = a2, w2 = g2, v2 = 0, f2 = -1, k2 = 1 << g2;
  const U2 = k2 - 1;
  if (e2 === 1 && k2 > 852 || e2 === 2 && k2 > 592)
    return 1;
  for (; ; ) {
    M2 = p2 - v2, s2[y2] < l2 ? (C2 = 0, K2 = s2[y2]) : s2[y2] > l2 ? (C2 = D2[R2 + s2[y2]], K2 = S2[E2 + s2[y2]]) : (C2 = 96, K2 = 0), u2 = 1 << p2 - v2, h2 = 1 << w2, b2 = h2;
    do {
      h2 -= u2, n2[d2 + (A2 >> v2) + h2] = M2 << 24 | C2 << 16 | K2 | 0;
    } while (h2 !== 0);
    for (u2 = 1 << p2 - 1; A2 & u2; )
      u2 >>= 1;
    if (u2 !== 0 ? (A2 &= u2 - 1, A2 += u2) : A2 = 0, y2++, --P2[p2] == 0) {
      if (p2 === m2)
        break;
      p2 = t2[r2 + s2[y2]];
    }
    if (p2 > g2 && (A2 & U2) !== f2) {
      for (v2 === 0 && (v2 = g2), d2 += b2, w2 = p2 - v2, _2 = 1 << w2; w2 + v2 < m2 && (_2 -= P2[w2 + v2], !(_2 <= 0)); )
        w2++, _2 <<= 1;
      if (k2 += 1 << w2, e2 === 1 && k2 > 852 || e2 === 2 && k2 > 592)
        return 1;
      f2 = A2 & U2, n2[f2] = g2 << 24 | w2 << 16 | d2 - a2 | 0;
    }
  }
  return A2 !== 0 && (n2[d2 + A2] = p2 - v2 << 24 | 64 << 16 | 0), o2.bits = g2, 0;
}
function ds(e2) {
  return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
}
class ls {
  constructor() {
    this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Zn(320), this.work = new Zn(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
}
function ps(e2) {
  let t2;
  return e2 && e2.state ? (t2 = e2.state, t2.wsize = 0, t2.whave = 0, t2.wnext = 0, function(e3) {
    let t3;
    return e3 && e3.state ? (t3 = e3.state, e3.total_in = e3.total_out = t3.total = 0, e3.msg = "", t3.wrap && (e3.adler = 1 & t3.wrap), t3.mode = 1, t3.last = 0, t3.havedict = 0, t3.dmax = 32768, t3.head = null, t3.hold = 0, t3.bits = 0, t3.lencode = t3.lendyn = new Yn(852), t3.distcode = t3.distdyn = new Yn(592), t3.sane = 1, t3.back = -1, 0) : -2;
  }(e2)) : -2;
}
function ys(e2, t2) {
  let r2, i2;
  return e2 ? (i2 = new ls(), e2.state = i2, i2.window = null, r2 = function(e3, t3) {
    let r3, i3;
    return e3 && e3.state ? (i3 = e3.state, t3 < 0 ? (r3 = 0, t3 = -t3) : (r3 = 1 + (t3 >> 4), t3 < 48 && (t3 &= 15)), t3 && (t3 < 8 || t3 > 15) ? -2 : (i3.window !== null && i3.wbits !== t3 && (i3.window = null), i3.wrap = r3, i3.wbits = t3, ps(e3))) : -2;
  }(e2, t2), r2 !== 0 && (e2.state = null), r2) : -2;
}
let bs, ms, gs = true;
function ws(e2) {
  if (gs) {
    let t2;
    for (bs = new Yn(512), ms = new Yn(32), t2 = 0; t2 < 144; )
      e2.lens[t2++] = 8;
    for (; t2 < 256; )
      e2.lens[t2++] = 9;
    for (; t2 < 280; )
      e2.lens[t2++] = 7;
    for (; t2 < 288; )
      e2.lens[t2++] = 8;
    for (fs(1, e2.lens, 0, 288, bs, 0, e2.work, {bits: 9}), t2 = 0; t2 < 32; )
      e2.lens[t2++] = 5;
    fs(2, e2.lens, 0, 32, ms, 0, e2.work, {bits: 5}), gs = false;
  }
  e2.lencode = bs, e2.lenbits = 9, e2.distcode = ms, e2.distbits = 5;
}
function vs(e2, t2, r2, i2) {
  let n2;
  const a2 = e2.state;
  return a2.window === null && (a2.wsize = 1 << a2.wbits, a2.wnext = 0, a2.whave = 0, a2.window = new $n(a2.wsize)), i2 >= a2.wsize ? (Qn(a2.window, t2, r2 - a2.wsize, a2.wsize, 0), a2.wnext = 0, a2.whave = a2.wsize) : (n2 = a2.wsize - a2.wnext, n2 > i2 && (n2 = i2), Qn(a2.window, t2, r2 - i2, n2, a2.wnext), (i2 -= n2) ? (Qn(a2.window, t2, r2 - i2, i2, 0), a2.wnext = i2, a2.whave = a2.wsize) : (a2.wnext += n2, a2.wnext === a2.wsize && (a2.wnext = 0), a2.whave < a2.wsize && (a2.whave += n2))), 0;
}
function _s(e2, t2) {
  let r2, i2, n2, a2, s2, o2, c2, u2, h2, f2, d2, l2, p2, y2, b2, m2, g2, w2, v2, _2, k2, A2, S2, E2, P2 = 0, x2 = new $n(4);
  const M2 = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  if (!e2 || !e2.state || !e2.output || !e2.input && e2.avail_in !== 0)
    return -2;
  r2 = e2.state, r2.mode === 12 && (r2.mode = 13), s2 = e2.next_out, n2 = e2.output, c2 = e2.avail_out, a2 = e2.next_in, i2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, h2 = r2.bits, f2 = o2, d2 = c2, A2 = 0;
  e:
    for (; ; )
      switch (r2.mode) {
        case 1:
          if (r2.wrap === 0) {
            r2.mode = 13;
            break;
          }
          for (; h2 < 16; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          if (2 & r2.wrap && u2 === 35615) {
            r2.check = 0, x2[0] = 255 & u2, x2[1] = u2 >>> 8 & 255, r2.check = za(r2.check, x2, 2, 0), u2 = 0, h2 = 0, r2.mode = 2;
            break;
          }
          if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
            e2.msg = "incorrect header check", r2.mode = 30;
            break;
          }
          if ((15 & u2) != 8) {
            e2.msg = "unknown compression method", r2.mode = 30;
            break;
          }
          if (u2 >>>= 4, h2 -= 4, k2 = 8 + (15 & u2), r2.wbits === 0)
            r2.wbits = k2;
          else if (k2 > r2.wbits) {
            e2.msg = "invalid window size", r2.mode = 30;
            break;
          }
          r2.dmax = 1 << k2, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, u2 = 0, h2 = 0;
          break;
        case 2:
          for (; h2 < 16; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          if (r2.flags = u2, (255 & r2.flags) != 8) {
            e2.msg = "unknown compression method", r2.mode = 30;
            break;
          }
          if (57344 & r2.flags) {
            e2.msg = "unknown header flags set", r2.mode = 30;
            break;
          }
          r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (x2[0] = 255 & u2, x2[1] = u2 >>> 8 & 255, r2.check = za(r2.check, x2, 2, 0)), u2 = 0, h2 = 0, r2.mode = 3;
        case 3:
          for (; h2 < 32; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          r2.head && (r2.head.time = u2), 512 & r2.flags && (x2[0] = 255 & u2, x2[1] = u2 >>> 8 & 255, x2[2] = u2 >>> 16 & 255, x2[3] = u2 >>> 24 & 255, r2.check = za(r2.check, x2, 4, 0)), u2 = 0, h2 = 0, r2.mode = 4;
        case 4:
          for (; h2 < 16; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (x2[0] = 255 & u2, x2[1] = u2 >>> 8 & 255, r2.check = za(r2.check, x2, 2, 0)), u2 = 0, h2 = 0, r2.mode = 5;
        case 5:
          if (1024 & r2.flags) {
            for (; h2 < 16; ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (x2[0] = 255 & u2, x2[1] = u2 >>> 8 & 255, r2.check = za(r2.check, x2, 2, 0)), u2 = 0, h2 = 0;
          } else
            r2.head && (r2.head.extra = null);
          r2.mode = 6;
        case 6:
          if (1024 & r2.flags && (l2 = r2.length, l2 > o2 && (l2 = o2), l2 && (r2.head && (k2 = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = Array(r2.head.extra_len)), Qn(r2.head.extra, i2, a2, l2, k2)), 512 & r2.flags && (r2.check = za(r2.check, i2, l2, a2)), o2 -= l2, a2 += l2, r2.length -= l2), r2.length))
            break e;
          r2.length = 0, r2.mode = 7;
        case 7:
          if (2048 & r2.flags) {
            if (o2 === 0)
              break e;
            l2 = 0;
            do {
              k2 = i2[a2 + l2++], r2.head && k2 && r2.length < 65536 && (r2.head.name += String.fromCharCode(k2));
            } while (k2 && l2 < o2);
            if (512 & r2.flags && (r2.check = za(r2.check, i2, l2, a2)), o2 -= l2, a2 += l2, k2)
              break e;
          } else
            r2.head && (r2.head.name = null);
          r2.length = 0, r2.mode = 8;
        case 8:
          if (4096 & r2.flags) {
            if (o2 === 0)
              break e;
            l2 = 0;
            do {
              k2 = i2[a2 + l2++], r2.head && k2 && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k2));
            } while (k2 && l2 < o2);
            if (512 & r2.flags && (r2.check = za(r2.check, i2, l2, a2)), o2 -= l2, a2 += l2, k2)
              break e;
          } else
            r2.head && (r2.head.comment = null);
          r2.mode = 9;
        case 9:
          if (512 & r2.flags) {
            for (; h2 < 16; ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            if (u2 !== (65535 & r2.check)) {
              e2.msg = "header crc mismatch", r2.mode = 30;
              break;
            }
            u2 = 0, h2 = 0;
          }
          r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
          break;
        case 10:
          for (; h2 < 32; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          e2.adler = r2.check = ds(u2), u2 = 0, h2 = 0, r2.mode = 11;
        case 11:
          if (r2.havedict === 0)
            return e2.next_out = s2, e2.avail_out = c2, e2.next_in = a2, e2.avail_in = o2, r2.hold = u2, r2.bits = h2, 2;
          e2.adler = r2.check = 1, r2.mode = 12;
        case 12:
          if (t2 === 5 || t2 === 6)
            break e;
        case 13:
          if (r2.last) {
            u2 >>>= 7 & h2, h2 -= 7 & h2, r2.mode = 27;
            break;
          }
          for (; h2 < 3; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          switch (r2.last = 1 & u2, u2 >>>= 1, h2 -= 1, 3 & u2) {
            case 0:
              r2.mode = 14;
              break;
            case 1:
              if (ws(r2), r2.mode = 20, t2 === 6) {
                u2 >>>= 2, h2 -= 2;
                break e;
              }
              break;
            case 2:
              r2.mode = 17;
              break;
            case 3:
              e2.msg = "invalid block type", r2.mode = 30;
          }
          u2 >>>= 2, h2 -= 2;
          break;
        case 14:
          for (u2 >>>= 7 & h2, h2 -= 7 & h2; h2 < 32; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
            e2.msg = "invalid stored block lengths", r2.mode = 30;
            break;
          }
          if (r2.length = 65535 & u2, u2 = 0, h2 = 0, r2.mode = 15, t2 === 6)
            break e;
        case 15:
          r2.mode = 16;
        case 16:
          if (l2 = r2.length, l2) {
            if (l2 > o2 && (l2 = o2), l2 > c2 && (l2 = c2), l2 === 0)
              break e;
            Qn(n2, i2, a2, l2, s2), o2 -= l2, a2 += l2, c2 -= l2, s2 += l2, r2.length -= l2;
            break;
          }
          r2.mode = 12;
          break;
        case 17:
          for (; h2 < 14; ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, h2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, h2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, h2 -= 4, r2.nlen > 286 || r2.ndist > 30) {
            e2.msg = "too many length or distance symbols", r2.mode = 30;
            break;
          }
          r2.have = 0, r2.mode = 18;
        case 18:
          for (; r2.have < r2.ncode; ) {
            for (; h2 < 3; ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            r2.lens[M2[r2.have++]] = 7 & u2, u2 >>>= 3, h2 -= 3;
          }
          for (; r2.have < 19; )
            r2.lens[M2[r2.have++]] = 0;
          if (r2.lencode = r2.lendyn, r2.lenbits = 7, S2 = {bits: r2.lenbits}, A2 = fs(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S2), r2.lenbits = S2.bits, A2) {
            e2.msg = "invalid code lengths set", r2.mode = 30;
            break;
          }
          r2.have = 0, r2.mode = 19;
        case 19:
          for (; r2.have < r2.nlen + r2.ndist; ) {
            for (; P2 = r2.lencode[u2 & (1 << r2.lenbits) - 1], b2 = P2 >>> 24, m2 = P2 >>> 16 & 255, g2 = 65535 & P2, !(b2 <= h2); ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            if (g2 < 16)
              u2 >>>= b2, h2 -= b2, r2.lens[r2.have++] = g2;
            else {
              if (g2 === 16) {
                for (E2 = b2 + 2; h2 < E2; ) {
                  if (o2 === 0)
                    break e;
                  o2--, u2 += i2[a2++] << h2, h2 += 8;
                }
                if (u2 >>>= b2, h2 -= b2, r2.have === 0) {
                  e2.msg = "invalid bit length repeat", r2.mode = 30;
                  break;
                }
                k2 = r2.lens[r2.have - 1], l2 = 3 + (3 & u2), u2 >>>= 2, h2 -= 2;
              } else if (g2 === 17) {
                for (E2 = b2 + 3; h2 < E2; ) {
                  if (o2 === 0)
                    break e;
                  o2--, u2 += i2[a2++] << h2, h2 += 8;
                }
                u2 >>>= b2, h2 -= b2, k2 = 0, l2 = 3 + (7 & u2), u2 >>>= 3, h2 -= 3;
              } else {
                for (E2 = b2 + 7; h2 < E2; ) {
                  if (o2 === 0)
                    break e;
                  o2--, u2 += i2[a2++] << h2, h2 += 8;
                }
                u2 >>>= b2, h2 -= b2, k2 = 0, l2 = 11 + (127 & u2), u2 >>>= 7, h2 -= 7;
              }
              if (r2.have + l2 > r2.nlen + r2.ndist) {
                e2.msg = "invalid bit length repeat", r2.mode = 30;
                break;
              }
              for (; l2--; )
                r2.lens[r2.have++] = k2;
            }
          }
          if (r2.mode === 30)
            break;
          if (r2.lens[256] === 0) {
            e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
            break;
          }
          if (r2.lenbits = 9, S2 = {bits: r2.lenbits}, A2 = fs(1, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S2), r2.lenbits = S2.bits, A2) {
            e2.msg = "invalid literal/lengths set", r2.mode = 30;
            break;
          }
          if (r2.distbits = 6, r2.distcode = r2.distdyn, S2 = {bits: r2.distbits}, A2 = fs(2, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S2), r2.distbits = S2.bits, A2) {
            e2.msg = "invalid distances set", r2.mode = 30;
            break;
          }
          if (r2.mode = 20, t2 === 6)
            break e;
        case 20:
          r2.mode = 21;
        case 21:
          if (o2 >= 6 && c2 >= 258) {
            e2.next_out = s2, e2.avail_out = c2, e2.next_in = a2, e2.avail_in = o2, r2.hold = u2, r2.bits = h2, ss(e2, d2), s2 = e2.next_out, n2 = e2.output, c2 = e2.avail_out, a2 = e2.next_in, i2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, h2 = r2.bits, r2.mode === 12 && (r2.back = -1);
            break;
          }
          for (r2.back = 0; P2 = r2.lencode[u2 & (1 << r2.lenbits) - 1], b2 = P2 >>> 24, m2 = P2 >>> 16 & 255, g2 = 65535 & P2, !(b2 <= h2); ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          if (m2 && (240 & m2) == 0) {
            for (w2 = b2, v2 = m2, _2 = g2; P2 = r2.lencode[_2 + ((u2 & (1 << w2 + v2) - 1) >> w2)], b2 = P2 >>> 24, m2 = P2 >>> 16 & 255, g2 = 65535 & P2, !(w2 + b2 <= h2); ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            u2 >>>= w2, h2 -= w2, r2.back += w2;
          }
          if (u2 >>>= b2, h2 -= b2, r2.back += b2, r2.length = g2, m2 === 0) {
            r2.mode = 26;
            break;
          }
          if (32 & m2) {
            r2.back = -1, r2.mode = 12;
            break;
          }
          if (64 & m2) {
            e2.msg = "invalid literal/length code", r2.mode = 30;
            break;
          }
          r2.extra = 15 & m2, r2.mode = 22;
        case 22:
          if (r2.extra) {
            for (E2 = r2.extra; h2 < E2; ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, h2 -= r2.extra, r2.back += r2.extra;
          }
          r2.was = r2.length, r2.mode = 23;
        case 23:
          for (; P2 = r2.distcode[u2 & (1 << r2.distbits) - 1], b2 = P2 >>> 24, m2 = P2 >>> 16 & 255, g2 = 65535 & P2, !(b2 <= h2); ) {
            if (o2 === 0)
              break e;
            o2--, u2 += i2[a2++] << h2, h2 += 8;
          }
          if ((240 & m2) == 0) {
            for (w2 = b2, v2 = m2, _2 = g2; P2 = r2.distcode[_2 + ((u2 & (1 << w2 + v2) - 1) >> w2)], b2 = P2 >>> 24, m2 = P2 >>> 16 & 255, g2 = 65535 & P2, !(w2 + b2 <= h2); ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            u2 >>>= w2, h2 -= w2, r2.back += w2;
          }
          if (u2 >>>= b2, h2 -= b2, r2.back += b2, 64 & m2) {
            e2.msg = "invalid distance code", r2.mode = 30;
            break;
          }
          r2.offset = g2, r2.extra = 15 & m2, r2.mode = 24;
        case 24:
          if (r2.extra) {
            for (E2 = r2.extra; h2 < E2; ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, h2 -= r2.extra, r2.back += r2.extra;
          }
          if (r2.offset > r2.dmax) {
            e2.msg = "invalid distance too far back", r2.mode = 30;
            break;
          }
          r2.mode = 25;
        case 25:
          if (c2 === 0)
            break e;
          if (l2 = d2 - c2, r2.offset > l2) {
            if (l2 = r2.offset - l2, l2 > r2.whave && r2.sane) {
              e2.msg = "invalid distance too far back", r2.mode = 30;
              break;
            }
            l2 > r2.wnext ? (l2 -= r2.wnext, p2 = r2.wsize - l2) : p2 = r2.wnext - l2, l2 > r2.length && (l2 = r2.length), y2 = r2.window;
          } else
            y2 = n2, p2 = s2 - r2.offset, l2 = r2.length;
          l2 > c2 && (l2 = c2), c2 -= l2, r2.length -= l2;
          do {
            n2[s2++] = y2[p2++];
          } while (--l2);
          r2.length === 0 && (r2.mode = 21);
          break;
        case 26:
          if (c2 === 0)
            break e;
          n2[s2++] = r2.length, c2--, r2.mode = 21;
          break;
        case 27:
          if (r2.wrap) {
            for (; h2 < 32; ) {
              if (o2 === 0)
                break e;
              o2--, u2 |= i2[a2++] << h2, h2 += 8;
            }
            if (d2 -= c2, e2.total_out += d2, r2.total += d2, d2 && (e2.adler = r2.check = r2.flags ? za(r2.check, n2, d2, s2 - d2) : Ba(r2.check, n2, d2, s2 - d2)), d2 = c2, (r2.flags ? u2 : ds(u2)) !== r2.check) {
              e2.msg = "incorrect data check", r2.mode = 30;
              break;
            }
            u2 = 0, h2 = 0;
          }
          r2.mode = 28;
        case 28:
          if (r2.wrap && r2.flags) {
            for (; h2 < 32; ) {
              if (o2 === 0)
                break e;
              o2--, u2 += i2[a2++] << h2, h2 += 8;
            }
            if (u2 !== (4294967295 & r2.total)) {
              e2.msg = "incorrect length check", r2.mode = 30;
              break;
            }
            u2 = 0, h2 = 0;
          }
          r2.mode = 29;
        case 29:
          A2 = 1;
          break e;
        case 30:
          A2 = -3;
          break e;
        case 32:
        default:
          return -2;
      }
  return e2.next_out = s2, e2.avail_out = c2, e2.next_in = a2, e2.avail_in = o2, r2.hold = u2, r2.bits = h2, (r2.wsize || d2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || t2 !== 4)) && vs(e2, e2.output, e2.next_out, d2 - e2.avail_out), f2 -= e2.avail_in, d2 -= e2.avail_out, e2.total_in += f2, e2.total_out += d2, r2.total += d2, r2.wrap && d2 && (e2.adler = r2.check = r2.flags ? za(r2.check, n2, d2, e2.next_out - d2) : Ba(r2.check, n2, d2, e2.next_out - d2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (r2.mode === 12 ? 128 : 0) + (r2.mode === 20 || r2.mode === 15 ? 256 : 0), (f2 === 0 && d2 === 0 || t2 === 4) && A2 === 0 && (A2 = -5), A2;
}
function ks(e2, t2) {
  const r2 = t2.length;
  let i2, n2;
  return e2 && e2.state ? (i2 = e2.state, i2.wrap !== 0 && i2.mode !== 11 ? -2 : i2.mode === 11 && (n2 = 1, n2 = Ba(n2, t2, r2, 0), n2 !== i2.check) ? -3 : (vs(e2, t2, r2, r2), i2.havedict = 1, 0)) : -2;
}
class As {
  constructor() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
  }
}
class Ss {
  constructor(e2) {
    this.options = {chunkSize: 16384, windowBits: 0, ...e2 || {}};
    const t2 = this.options;
    t2.raw && t2.windowBits >= 0 && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, t2.windowBits === 0 && (t2.windowBits = -15)), !(t2.windowBits >= 0 && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), t2.windowBits > 15 && t2.windowBits < 48 && (15 & t2.windowBits) == 0 && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new ns(), this.strm.avail_out = 0;
    let r2 = ys(this.strm, t2.windowBits);
    if (r2 !== 0)
      throw Error(qa[r2]);
    if (this.header = new As(), function(e3, t3) {
      let r3;
      e3 && e3.state && (r3 = e3.state, (2 & r3.wrap) == 0 || (r3.head = t3, t3.done = false));
    }(this.strm, this.header), t2.dictionary && (typeof t2.dictionary == "string" ? t2.dictionary = is(t2.dictionary) : t2.dictionary instanceof ArrayBuffer && (t2.dictionary = new Uint8Array(t2.dictionary)), t2.raw && (r2 = ks(this.strm, t2.dictionary), r2 !== 0)))
      throw Error(qa[r2]);
  }
  push(e2, t2) {
    const {strm: r2, options: {chunkSize: i2, dictionary: n2}} = this;
    let a2, s2, o2 = false;
    if (this.ended)
      return false;
    s2 = t2 === ~~t2 ? t2 : t2 === true ? 4 : 0, typeof e2 == "string" ? r2.input = function(e3) {
      const t3 = new $n(e3.length);
      for (let r3 = 0, i3 = t3.length; r3 < i3; r3++)
        t3[r3] = e3.charCodeAt(r3);
      return t3;
    }(e2) : e2 instanceof ArrayBuffer ? r2.input = new Uint8Array(e2) : r2.input = e2, r2.next_in = 0, r2.avail_in = r2.input.length;
    do {
      if (r2.avail_out === 0 && (r2.output = new $n(i2), r2.next_out = 0, r2.avail_out = i2), a2 = _s(r2, 0), a2 === 2 && n2 && (a2 = ks(this.strm, n2)), a2 === -5 && o2 === true && (a2 = 0, o2 = false), a2 !== 1 && a2 !== 0)
        return this.onEnd(a2), this.ended = true, false;
      r2.next_out && (r2.avail_out !== 0 && a2 !== 1 && (r2.avail_in !== 0 || s2 !== 4 && s2 !== 2) || this.onData(Hn(r2.output, r2.next_out))), r2.avail_in === 0 && r2.avail_out === 0 && (o2 = true);
    } while ((r2.avail_in > 0 || r2.avail_out === 0) && a2 !== 1);
    return a2 === 1 && (s2 = 4), s2 === 4 ? (a2 = function(e3) {
      if (!e3 || !e3.state)
        return -2;
      const t3 = e3.state;
      return t3.window && (t3.window = null), e3.state = null, 0;
    }(this.strm), this.onEnd(a2), this.ended = true, a2 === 0) : s2 !== 2 || (this.onEnd(0), r2.avail_out = 0, true);
  }
  onData(e2) {
    this.chunks.push(e2);
  }
  onEnd(e2) {
    e2 === 0 && (this.result = Xn(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
  }
}
var Es = [0, 1, 3, 7, 15, 31, 63, 127, 255], Ps = function(e2) {
  this.stream = e2, this.bitOffset = 0, this.curByte = 0, this.hasByte = false;
};
Ps.prototype._ensureByte = function() {
  this.hasByte || (this.curByte = this.stream.readByte(), this.hasByte = true);
}, Ps.prototype.read = function(e2) {
  for (var t2 = 0; e2 > 0; ) {
    this._ensureByte();
    var r2 = 8 - this.bitOffset;
    if (e2 >= r2)
      t2 <<= r2, t2 |= Es[r2] & this.curByte, this.hasByte = false, this.bitOffset = 0, e2 -= r2;
    else {
      t2 <<= e2;
      var i2 = r2 - e2;
      t2 |= (this.curByte & Es[e2] << i2) >> i2, this.bitOffset += e2, e2 = 0;
    }
  }
  return t2;
}, Ps.prototype.seek = function(e2) {
  var t2 = e2 % 8, r2 = (e2 - t2) / 8;
  this.bitOffset = t2, this.stream.seek(r2), this.hasByte = false;
}, Ps.prototype.pi = function() {
  var e2, t2 = new Uint8Array(6);
  for (e2 = 0; e2 < t2.length; e2++)
    t2[e2] = this.read(8);
  return function(e3) {
    return Array.prototype.map.call(e3, (e4) => ("00" + e4.toString(16)).slice(-2)).join("");
  }(t2);
};
var xs = Ps, Ms = function() {
};
Ms.prototype.readByte = function() {
  throw Error("abstract method readByte() not implemented");
}, Ms.prototype.read = function(e2, t2, r2) {
  for (var i2 = 0; i2 < r2; ) {
    var n2 = this.readByte();
    if (n2 < 0)
      return i2 === 0 ? -1 : i2;
    e2[t2++] = n2, i2++;
  }
  return i2;
}, Ms.prototype.seek = function(e2) {
  throw Error("abstract method seek() not implemented");
}, Ms.prototype.writeByte = function(e2) {
  throw Error("abstract method readByte() not implemented");
}, Ms.prototype.write = function(e2, t2, r2) {
  var i2;
  for (i2 = 0; i2 < r2; i2++)
    this.writeByte(e2[t2++]);
  return r2;
}, Ms.prototype.flush = function() {
};
var Cs, Ks = Ms, Ds = (Cs = new Uint32Array([0, 79764919, 159529838, 222504665, 319059676, 398814059, 445009330, 507990021, 638119352, 583659535, 797628118, 726387553, 890018660, 835552979, 1015980042, 944750013, 1276238704, 1221641927, 1167319070, 1095957929, 1595256236, 1540665371, 1452775106, 1381403509, 1780037320, 1859660671, 1671105958, 1733955601, 2031960084, 2111593891, 1889500026, 1952343757, 2552477408, 2632100695, 2443283854, 2506133561, 2334638140, 2414271883, 2191915858, 2254759653, 3190512472, 3135915759, 3081330742, 3009969537, 2905550212, 2850959411, 2762807018, 2691435357, 3560074640, 3505614887, 3719321342, 3648080713, 3342211916, 3287746299, 3467911202, 3396681109, 4063920168, 4143685023, 4223187782, 4286162673, 3779000052, 3858754371, 3904687514, 3967668269, 881225847, 809987520, 1023691545, 969234094, 662832811, 591600412, 771767749, 717299826, 311336399, 374308984, 453813921, 533576470, 25881363, 88864420, 134795389, 214552010, 2023205639, 2086057648, 1897238633, 1976864222, 1804852699, 1867694188, 1645340341, 1724971778, 1587496639, 1516133128, 1461550545, 1406951526, 1302016099, 1230646740, 1142491917, 1087903418, 2896545431, 2825181984, 2770861561, 2716262478, 3215044683, 3143675388, 3055782693, 3001194130, 2326604591, 2389456536, 2200899649, 2280525302, 2578013683, 2640855108, 2418763421, 2498394922, 3769900519, 3832873040, 3912640137, 3992402750, 4088425275, 4151408268, 4197601365, 4277358050, 3334271071, 3263032808, 3476998961, 3422541446, 3585640067, 3514407732, 3694837229, 3640369242, 1762451694, 1842216281, 1619975040, 1682949687, 2047383090, 2127137669, 1938468188, 2001449195, 1325665622, 1271206113, 1183200824, 1111960463, 1543535498, 1489069629, 1434599652, 1363369299, 622672798, 568075817, 748617968, 677256519, 907627842, 853037301, 1067152940, 995781531, 51762726, 131386257, 177728840, 240578815, 269590778, 349224269, 429104020, 491947555, 4046411278, 4126034873, 4172115296, 4234965207, 3794477266, 3874110821, 3953728444, 4016571915, 3609705398, 3555108353, 3735388376, 3664026991, 3290680682, 3236090077, 3449943556, 3378572211, 3174993278, 3120533705, 3032266256, 2961025959, 2923101090, 2868635157, 2813903052, 2742672763, 2604032198, 2683796849, 2461293480, 2524268063, 2284983834, 2364738477, 2175806836, 2238787779, 1569362073, 1498123566, 1409854455, 1355396672, 1317987909, 1246755826, 1192025387, 1137557660, 2072149281, 2135122070, 1912620623, 1992383480, 1753615357, 1816598090, 1627664531, 1707420964, 295390185, 358241886, 404320391, 483945776, 43990325, 106832002, 186451547, 266083308, 932423249, 861060070, 1041341759, 986742920, 613929101, 542559546, 756411363, 701822548, 3316196985, 3244833742, 3425377559, 3370778784, 3601682597, 3530312978, 3744426955, 3689838204, 3819031489, 3881883254, 3928223919, 4007849240, 4037393693, 4100235434, 4180117107, 4259748804, 2310601993, 2373574846, 2151335527, 2231098320, 2596047829, 2659030626, 2470359227, 2550115596, 2947551409, 2876312838, 2788305887, 2733848168, 3165939309, 3094707162, 3040238851, 2985771188]), function() {
  var e2 = 4294967295;
  this.getCRC = function() {
    return ~e2 >>> 0;
  }, this.updateCRC = function(t2) {
    e2 = e2 << 8 ^ Cs[255 & (e2 >>> 24 ^ t2)];
  }, this.updateCRCRun = function(t2, r2) {
    for (; r2-- > 0; )
      e2 = e2 << 8 ^ Cs[255 & (e2 >>> 24 ^ t2)];
  };
}), Rs = function(e2, t2) {
  var r2, i2 = e2[t2];
  for (r2 = t2; r2 > 0; r2--)
    e2[r2] = e2[r2 - 1];
  return e2[0] = i2, i2;
}, Us = {OK: 0, LAST_BLOCK: -1, NOT_BZIP_DATA: -2, UNEXPECTED_INPUT_EOF: -3, UNEXPECTED_OUTPUT_EOF: -4, DATA_ERROR: -5, OUT_OF_MEMORY: -6, OBSOLETE_INPUT: -7, END_OF_BLOCK: -8}, Is = {};
Is[Us.LAST_BLOCK] = "Bad file checksum", Is[Us.NOT_BZIP_DATA] = "Not bzip data", Is[Us.UNEXPECTED_INPUT_EOF] = "Unexpected input EOF", Is[Us.UNEXPECTED_OUTPUT_EOF] = "Unexpected output EOF", Is[Us.DATA_ERROR] = "Data error", Is[Us.OUT_OF_MEMORY] = "Out of memory", Is[Us.OBSOLETE_INPUT] = "Obsolete (pre 0.9.5) bzip format not supported.";
var Bs = function(e2, t2) {
  var r2 = Is[e2] || "unknown error";
  t2 && (r2 += ": " + t2);
  var i2 = new TypeError(r2);
  throw i2.errorCode = e2, i2;
}, Ts = function(e2, t2) {
  this.writePos = this.writeCurrent = this.writeCount = 0, this._start_bunzip(e2, t2);
};
Ts.prototype._init_block = function() {
  return this._get_next_block() ? (this.blockCRC = new Ds(), true) : (this.writeCount = -1, false);
}, Ts.prototype._start_bunzip = function(e2, t2) {
  var r2 = new Uint8Array(4);
  e2.read(r2, 0, 4) === 4 && String.fromCharCode(r2[0], r2[1], r2[2]) === "BZh" || Bs(Us.NOT_BZIP_DATA, "bad magic");
  var i2 = r2[3] - 48;
  (i2 < 1 || i2 > 9) && Bs(Us.NOT_BZIP_DATA, "level out of range"), this.reader = new xs(e2), this.dbufSize = 1e5 * i2, this.nextoutput = 0, this.outputStream = t2, this.streamCRC = 0;
}, Ts.prototype._get_next_block = function() {
  var e2, t2, r2, i2 = this.reader, n2 = i2.pi();
  if (n2 === "177245385090")
    return false;
  n2 !== "314159265359" && Bs(Us.NOT_BZIP_DATA), this.targetBlockCRC = i2.read(32) >>> 0, this.streamCRC = (this.targetBlockCRC ^ (this.streamCRC << 1 | this.streamCRC >>> 31)) >>> 0, i2.read(1) && Bs(Us.OBSOLETE_INPUT);
  var a2 = i2.read(24);
  a2 > this.dbufSize && Bs(Us.DATA_ERROR, "initial position out of bounds");
  var s2 = i2.read(16), o2 = new Uint8Array(256), c2 = 0;
  for (e2 = 0; e2 < 16; e2++)
    if (s2 & 1 << 15 - e2) {
      var u2 = 16 * e2;
      for (r2 = i2.read(16), t2 = 0; t2 < 16; t2++)
        r2 & 1 << 15 - t2 && (o2[c2++] = u2 + t2);
    }
  var h2 = i2.read(3);
  (h2 < 2 || h2 > 6) && Bs(Us.DATA_ERROR);
  var f2 = i2.read(15);
  f2 === 0 && Bs(Us.DATA_ERROR);
  var d2 = new Uint8Array(256);
  for (e2 = 0; e2 < h2; e2++)
    d2[e2] = e2;
  var l2 = new Uint8Array(f2);
  for (e2 = 0; e2 < f2; e2++) {
    for (t2 = 0; i2.read(1); t2++)
      t2 >= h2 && Bs(Us.DATA_ERROR);
    l2[e2] = Rs(d2, t2);
  }
  var p2, y2 = c2 + 2, b2 = [];
  for (t2 = 0; t2 < h2; t2++) {
    var m2, g2, w2 = new Uint8Array(y2), v2 = new Uint16Array(21);
    for (s2 = i2.read(5), e2 = 0; e2 < y2; e2++) {
      for (; (s2 < 1 || s2 > 20) && Bs(Us.DATA_ERROR), i2.read(1); )
        i2.read(1) ? s2-- : s2++;
      w2[e2] = s2;
    }
    for (m2 = g2 = w2[0], e2 = 1; e2 < y2; e2++)
      w2[e2] > g2 ? g2 = w2[e2] : w2[e2] < m2 && (m2 = w2[e2]);
    p2 = {}, b2.push(p2), p2.permute = new Uint16Array(258), p2.limit = new Uint32Array(22), p2.base = new Uint32Array(21), p2.minLen = m2, p2.maxLen = g2;
    var _2 = 0;
    for (e2 = m2; e2 <= g2; e2++)
      for (v2[e2] = p2.limit[e2] = 0, s2 = 0; s2 < y2; s2++)
        w2[s2] === e2 && (p2.permute[_2++] = s2);
    for (e2 = 0; e2 < y2; e2++)
      v2[w2[e2]]++;
    for (_2 = s2 = 0, e2 = m2; e2 < g2; e2++)
      _2 += v2[e2], p2.limit[e2] = _2 - 1, _2 <<= 1, s2 += v2[e2], p2.base[e2 + 1] = _2 - s2;
    p2.limit[g2 + 1] = Number.MAX_VALUE, p2.limit[g2] = _2 + v2[g2] - 1, p2.base[m2] = 0;
  }
  var k2 = new Uint32Array(256);
  for (e2 = 0; e2 < 256; e2++)
    d2[e2] = e2;
  var A2, S2 = 0, E2 = 0, P2 = 0, x2 = this.dbuf = new Uint32Array(this.dbufSize);
  for (y2 = 0; ; ) {
    for (y2-- || (y2 = 49, P2 >= f2 && Bs(Us.DATA_ERROR), p2 = b2[l2[P2++]]), e2 = p2.minLen, t2 = i2.read(e2); e2 > p2.maxLen && Bs(Us.DATA_ERROR), !(t2 <= p2.limit[e2]); e2++)
      t2 = t2 << 1 | i2.read(1);
    ((t2 -= p2.base[e2]) < 0 || t2 >= 258) && Bs(Us.DATA_ERROR);
    var M2 = p2.permute[t2];
    if (M2 !== 0 && M2 !== 1) {
      if (S2)
        for (S2 = 0, E2 + s2 > this.dbufSize && Bs(Us.DATA_ERROR), k2[A2 = o2[d2[0]]] += s2; s2--; )
          x2[E2++] = A2;
      if (M2 > c2)
        break;
      E2 >= this.dbufSize && Bs(Us.DATA_ERROR), k2[A2 = o2[A2 = Rs(d2, e2 = M2 - 1)]]++, x2[E2++] = A2;
    } else
      S2 || (S2 = 1, s2 = 0), s2 += M2 === 0 ? S2 : 2 * S2, S2 <<= 1;
  }
  for ((a2 < 0 || a2 >= E2) && Bs(Us.DATA_ERROR), t2 = 0, e2 = 0; e2 < 256; e2++)
    r2 = t2 + k2[e2], k2[e2] = t2, t2 = r2;
  for (e2 = 0; e2 < E2; e2++)
    x2[k2[A2 = 255 & x2[e2]]] |= e2 << 8, k2[A2]++;
  var C2 = 0, K2 = 0, D2 = 0;
  return E2 && (K2 = 255 & (C2 = x2[a2]), C2 >>= 8, D2 = -1), this.writePos = C2, this.writeCurrent = K2, this.writeCount = E2, this.writeRun = D2, true;
}, Ts.prototype._read_bunzip = function(e2, t2) {
  var r2, i2, n2;
  if (this.writeCount < 0)
    return 0;
  var a2 = this.dbuf, s2 = this.writePos, o2 = this.writeCurrent, c2 = this.writeCount;
  this.outputsize;
  for (var u2 = this.writeRun; c2; ) {
    for (c2--, i2 = o2, o2 = 255 & (s2 = a2[s2]), s2 >>= 8, u2++ == 3 ? (r2 = o2, n2 = i2, o2 = -1) : (r2 = 1, n2 = o2), this.blockCRC.updateCRCRun(n2, r2); r2--; )
      this.outputStream.writeByte(n2), this.nextoutput++;
    o2 != i2 && (u2 = 0);
  }
  return this.writeCount = c2, this.blockCRC.getCRC() !== this.targetBlockCRC && Bs(Us.DATA_ERROR, "Bad block CRC (got " + this.blockCRC.getCRC().toString(16) + " expected " + this.targetBlockCRC.toString(16) + ")"), this.nextoutput;
};
var zs = function(e2) {
  if ("readByte" in e2)
    return e2;
  var t2 = new Ks();
  return t2.pos = 0, t2.readByte = function() {
    return e2[this.pos++];
  }, t2.seek = function(e3) {
    this.pos = e3;
  }, t2.eof = function() {
    return this.pos >= e2.length;
  }, t2;
}, qs = function(e2) {
  var t2 = new Ks(), r2 = true;
  if (e2)
    if (typeof e2 == "number")
      t2.buffer = new Uint8Array(e2), r2 = false;
    else {
      if ("writeByte" in e2)
        return e2;
      t2.buffer = e2, r2 = false;
    }
  else
    t2.buffer = new Uint8Array(16384);
  return t2.pos = 0, t2.writeByte = function(e3) {
    if (r2 && this.pos >= this.buffer.length) {
      var t3 = new Uint8Array(2 * this.buffer.length);
      t3.set(this.buffer), this.buffer = t3;
    }
    this.buffer[this.pos++] = e3;
  }, t2.getBuffer = function() {
    if (this.pos !== this.buffer.length) {
      if (!r2)
        throw new TypeError("outputsize does not match decoded input");
      var e3 = new Uint8Array(this.pos);
      e3.set(this.buffer.subarray(0, this.pos)), this.buffer = e3;
    }
    return this.buffer;
  }, t2._coerced = true, t2;
};
var Os = function(e2, t2, r2) {
  for (var i2 = zs(e2), n2 = qs(t2), a2 = new Ts(i2, n2); !("eof" in i2) || !i2.eof(); )
    if (a2._init_block())
      a2._read_bunzip();
    else {
      var s2 = a2.reader.read(32) >>> 0;
      if (s2 !== a2.streamCRC && Bs(Us.DATA_ERROR, "Bad stream CRC (got " + a2.streamCRC.toString(16) + " expected " + s2.toString(16) + ")"), !r2 || !("eof" in i2) || i2.eof())
        break;
      a2._start_bunzip(i2, n2);
    }
  if ("getBuffer" in n2)
    return n2.getBuffer();
};
class Fs {
  static get tag() {
    return re.packet.literalData;
  }
  constructor(e2 = new Date()) {
    this.format = re.literal.utf8, this.date = V.normalizeDate(e2), this.text = null, this.data = null, this.filename = "";
  }
  setText(e2, t2 = re.literal.utf8) {
    this.format = t2, this.text = e2, this.data = null;
  }
  getText(e2 = false) {
    return (this.text === null || V.isStream(this.text)) && (this.text = V.decodeUTF8(V.nativeEOL(this.getBytes(e2)))), this.text;
  }
  setBytes(e2, t2) {
    this.format = t2, this.data = e2, this.text = null;
  }
  getBytes(e2 = false) {
    return this.data === null && (this.data = V.canonicalizeEOL(V.encodeUTF8(this.text))), e2 ? O(this.data) : this.data;
  }
  setFilename(e2) {
    this.filename = e2;
  }
  getFilename() {
    return this.filename;
  }
  async read(e2) {
    await z(e2, async (e3) => {
      const t2 = await e3.readByte(), r2 = await e3.readByte();
      this.filename = V.decodeUTF8(await e3.readBytes(r2)), this.date = V.readDate(await e3.readBytes(4));
      let i2 = e3.remainder();
      s(i2) && (i2 = await j(i2)), this.setBytes(i2, t2);
    });
  }
  writeHeader() {
    const e2 = V.encodeUTF8(this.filename), t2 = new Uint8Array([e2.length]), r2 = new Uint8Array([this.format]), i2 = V.writeDate(this.date);
    return V.concatUint8Array([r2, t2, e2, i2]);
  }
  write() {
    const e2 = this.writeHeader(), t2 = this.getBytes();
    return V.concat([e2, t2]);
  }
}
const Ns = Symbol("verified"), js = new Set([re.signatureSubpacket.issuer, re.signatureSubpacket.issuerFingerprint, re.signatureSubpacket.embeddedSignature]);
class Ls {
  static get tag() {
    return re.packet.signature;
  }
  constructor() {
    this.version = null, this.signatureType = null, this.hashAlgorithm = null, this.publicKeyAlgorithm = null, this.signatureData = null, this.unhashedSubpackets = [], this.signedHashValue = null, this.created = null, this.signatureExpirationTime = null, this.signatureNeverExpires = true, this.exportable = null, this.trustLevel = null, this.trustAmount = null, this.regularExpression = null, this.revocable = null, this.keyExpirationTime = null, this.keyNeverExpires = null, this.preferredSymmetricAlgorithms = null, this.revocationKeyClass = null, this.revocationKeyAlgorithm = null, this.revocationKeyFingerprint = null, this.issuerKeyID = new le(), this.rawNotations = [], this.notations = {}, this.preferredHashAlgorithms = null, this.preferredCompressionAlgorithms = null, this.keyServerPreferences = null, this.preferredKeyServer = null, this.isPrimaryUserID = null, this.policyURI = null, this.keyFlags = null, this.signersUserID = null, this.reasonForRevocationFlag = null, this.reasonForRevocationString = null, this.features = null, this.signatureTargetPublicKeyAlgorithm = null, this.signatureTargetHashAlgorithm = null, this.signatureTargetHash = null, this.embeddedSignature = null, this.issuerKeyVersion = null, this.issuerFingerprint = null, this.preferredAEADAlgorithms = null, this.revoked = null, this[Ns] = null;
  }
  read(e2) {
    let t2 = 0;
    if (this.version = e2[t2++], this.version !== 4 && this.version !== 5)
      throw new mi(`Version ${this.version} of the signature packet is unsupported.`);
    if (this.signatureType = e2[t2++], this.publicKeyAlgorithm = e2[t2++], this.hashAlgorithm = e2[t2++], t2 += this.readSubPackets(e2.subarray(t2, e2.length), true), !this.created)
      throw Error("Missing signature creation time subpacket.");
    this.signatureData = e2.subarray(0, t2), t2 += this.readSubPackets(e2.subarray(t2, e2.length), false), this.signedHashValue = e2.subarray(t2, t2 + 2), t2 += 2, this.params = Ln.signature.parseSignatureParams(this.publicKeyAlgorithm, e2.subarray(t2, e2.length));
  }
  writeParams() {
    return this.params instanceof Promise ? W(async () => Ln.serializeParams(this.publicKeyAlgorithm, await this.params)) : Ln.serializeParams(this.publicKeyAlgorithm, this.params);
  }
  write() {
    const e2 = [];
    return e2.push(this.signatureData), e2.push(this.writeUnhashedSubPackets()), e2.push(this.signedHashValue), e2.push(this.writeParams()), V.concat(e2);
  }
  async sign(e2, t2, r2 = new Date(), i2 = false) {
    e2.version === 5 ? this.version = 5 : this.version = 4;
    const n2 = [new Uint8Array([this.version, this.signatureType, this.publicKeyAlgorithm, this.hashAlgorithm])];
    this.created = V.normalizeDate(r2), this.issuerKeyVersion = e2.version, this.issuerFingerprint = e2.getFingerprintBytes(), this.issuerKeyID = e2.getKeyID(), n2.push(this.writeHashedSubPackets()), this.unhashedSubpackets = [], this.signatureData = V.concat(n2);
    const a2 = this.toHash(this.signatureType, t2, i2), s2 = await this.hash(this.signatureType, t2, a2, i2);
    this.signedHashValue = N(q(s2), 0, 2);
    const o2 = async () => Ln.signature.sign(this.publicKeyAlgorithm, this.hashAlgorithm, e2.publicParams, e2.privateParams, a2, await j(s2));
    V.isStream(s2) ? this.params = o2() : (this.params = await o2(), this[Ns] = true);
  }
  writeHashedSubPackets() {
    const e2 = re.signatureSubpacket, t2 = [];
    let r2;
    if (this.created === null)
      throw Error("Missing signature creation time");
    t2.push(Ws(e2.signatureCreationTime, V.writeDate(this.created))), this.signatureExpirationTime !== null && t2.push(Ws(e2.signatureExpirationTime, V.writeNumber(this.signatureExpirationTime, 4))), this.exportable !== null && t2.push(Ws(e2.exportableCertification, new Uint8Array([this.exportable ? 1 : 0]))), this.trustLevel !== null && (r2 = new Uint8Array([this.trustLevel, this.trustAmount]), t2.push(Ws(e2.trustSignature, r2))), this.regularExpression !== null && t2.push(Ws(e2.regularExpression, this.regularExpression)), this.revocable !== null && t2.push(Ws(e2.revocable, new Uint8Array([this.revocable ? 1 : 0]))), this.keyExpirationTime !== null && t2.push(Ws(e2.keyExpirationTime, V.writeNumber(this.keyExpirationTime, 4))), this.preferredSymmetricAlgorithms !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.preferredSymmetricAlgorithms)), t2.push(Ws(e2.preferredSymmetricAlgorithms, r2))), this.revocationKeyClass !== null && (r2 = new Uint8Array([this.revocationKeyClass, this.revocationKeyAlgorithm]), r2 = V.concat([r2, this.revocationKeyFingerprint]), t2.push(Ws(e2.revocationKey, r2))), this.issuerKeyID.isNull() || this.issuerKeyVersion === 5 || t2.push(Ws(e2.issuer, this.issuerKeyID.write())), this.rawNotations.forEach(([{name: i3, value: n3, humanReadable: a2}]) => {
      r2 = [new Uint8Array([a2 ? 128 : 0, 0, 0, 0])], r2.push(V.writeNumber(i3.length, 2)), r2.push(V.writeNumber(n3.length, 2)), r2.push(V.stringToUint8Array(i3)), r2.push(n3), r2 = V.concat(r2), t2.push(Ws(e2.notationData, r2));
    }), this.preferredHashAlgorithms !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.preferredHashAlgorithms)), t2.push(Ws(e2.preferredHashAlgorithms, r2))), this.preferredCompressionAlgorithms !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.preferredCompressionAlgorithms)), t2.push(Ws(e2.preferredCompressionAlgorithms, r2))), this.keyServerPreferences !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.keyServerPreferences)), t2.push(Ws(e2.keyServerPreferences, r2))), this.preferredKeyServer !== null && t2.push(Ws(e2.preferredKeyServer, V.stringToUint8Array(this.preferredKeyServer))), this.isPrimaryUserID !== null && t2.push(Ws(e2.primaryUserID, new Uint8Array([this.isPrimaryUserID ? 1 : 0]))), this.policyURI !== null && t2.push(Ws(e2.policyURI, V.stringToUint8Array(this.policyURI))), this.keyFlags !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.keyFlags)), t2.push(Ws(e2.keyFlags, r2))), this.signersUserID !== null && t2.push(Ws(e2.signersUserID, V.stringToUint8Array(this.signersUserID))), this.reasonForRevocationFlag !== null && (r2 = V.stringToUint8Array(String.fromCharCode(this.reasonForRevocationFlag) + this.reasonForRevocationString), t2.push(Ws(e2.reasonForRevocation, r2))), this.features !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.features)), t2.push(Ws(e2.features, r2))), this.signatureTargetPublicKeyAlgorithm !== null && (r2 = [new Uint8Array([this.signatureTargetPublicKeyAlgorithm, this.signatureTargetHashAlgorithm])], r2.push(V.stringToUint8Array(this.signatureTargetHash)), r2 = V.concat(r2), t2.push(Ws(e2.signatureTarget, r2))), this.embeddedSignature !== null && t2.push(Ws(e2.embeddedSignature, this.embeddedSignature.write())), this.issuerFingerprint !== null && (r2 = [new Uint8Array([this.issuerKeyVersion]), this.issuerFingerprint], r2 = V.concat(r2), t2.push(Ws(e2.issuerFingerprint, r2))), this.preferredAEADAlgorithms !== null && (r2 = V.stringToUint8Array(V.uint8ArrayToString(this.preferredAEADAlgorithms)), t2.push(Ws(e2.preferredAEADAlgorithms, r2)));
    const i2 = V.concat(t2), n2 = V.writeNumber(i2.length, 2);
    return V.concat([n2, i2]);
  }
  writeUnhashedSubPackets() {
    const e2 = [];
    this.unhashedSubpackets.forEach((t3) => {
      e2.push(fi(t3.length)), e2.push(t3);
    });
    const t2 = V.concat(e2), r2 = V.writeNumber(t2.length, 2);
    return V.concat([r2, t2]);
  }
  readSubPacket(e2, t2 = true) {
    let r2 = 0;
    const i2 = 128 & e2[r2], n2 = 127 & e2[r2];
    if (t2 || (this.unhashedSubpackets.push(e2.subarray(r2, e2.length)), js.has(n2)))
      switch (r2++, n2) {
        case re.signatureSubpacket.signatureCreationTime:
          this.created = V.readDate(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.signatureExpirationTime: {
          const t3 = V.readNumber(e2.subarray(r2, e2.length));
          this.signatureNeverExpires = t3 === 0, this.signatureExpirationTime = t3;
          break;
        }
        case re.signatureSubpacket.exportableCertification:
          this.exportable = e2[r2++] === 1;
          break;
        case re.signatureSubpacket.trustSignature:
          this.trustLevel = e2[r2++], this.trustAmount = e2[r2++];
          break;
        case re.signatureSubpacket.regularExpression:
          this.regularExpression = e2[r2];
          break;
        case re.signatureSubpacket.revocable:
          this.revocable = e2[r2++] === 1;
          break;
        case re.signatureSubpacket.keyExpirationTime: {
          const t3 = V.readNumber(e2.subarray(r2, e2.length));
          this.keyExpirationTime = t3, this.keyNeverExpires = t3 === 0;
          break;
        }
        case re.signatureSubpacket.preferredSymmetricAlgorithms:
          this.preferredSymmetricAlgorithms = [...e2.subarray(r2, e2.length)];
          break;
        case re.signatureSubpacket.revocationKey:
          this.revocationKeyClass = e2[r2++], this.revocationKeyAlgorithm = e2[r2++], this.revocationKeyFingerprint = e2.subarray(r2, r2 + 20);
          break;
        case re.signatureSubpacket.issuer:
          this.issuerKeyID.read(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.notationData: {
          const t3 = !!(128 & e2[r2]);
          r2 += 4;
          const n3 = V.readNumber(e2.subarray(r2, r2 + 2));
          r2 += 2;
          const a2 = V.readNumber(e2.subarray(r2, r2 + 2));
          r2 += 2;
          const s2 = V.uint8ArrayToString(e2.subarray(r2, r2 + n3)), o2 = e2.subarray(r2 + n3, r2 + n3 + a2);
          this.rawNotations.push({name: s2, humanReadable: t3, value: o2, critical: i2}), t3 && (this.notations[s2] = V.uint8ArrayToString(o2));
          break;
        }
        case re.signatureSubpacket.preferredHashAlgorithms:
          this.preferredHashAlgorithms = [...e2.subarray(r2, e2.length)];
          break;
        case re.signatureSubpacket.preferredCompressionAlgorithms:
          this.preferredCompressionAlgorithms = [...e2.subarray(r2, e2.length)];
          break;
        case re.signatureSubpacket.keyServerPreferences:
          this.keyServerPreferences = [...e2.subarray(r2, e2.length)];
          break;
        case re.signatureSubpacket.preferredKeyServer:
          this.preferredKeyServer = V.uint8ArrayToString(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.primaryUserID:
          this.isPrimaryUserID = e2[r2++] !== 0;
          break;
        case re.signatureSubpacket.policyURI:
          this.policyURI = V.uint8ArrayToString(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.keyFlags:
          this.keyFlags = [...e2.subarray(r2, e2.length)];
          break;
        case re.signatureSubpacket.signersUserID:
          this.signersUserID = V.uint8ArrayToString(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.reasonForRevocation:
          this.reasonForRevocationFlag = e2[r2++], this.reasonForRevocationString = V.uint8ArrayToString(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.features:
          this.features = [...e2.subarray(r2, e2.length)];
          break;
        case re.signatureSubpacket.signatureTarget: {
          this.signatureTargetPublicKeyAlgorithm = e2[r2++], this.signatureTargetHashAlgorithm = e2[r2++];
          const t3 = Ln.getHashByteLength(this.signatureTargetHashAlgorithm);
          this.signatureTargetHash = V.uint8ArrayToString(e2.subarray(r2, r2 + t3));
          break;
        }
        case re.signatureSubpacket.embeddedSignature:
          this.embeddedSignature = new Ls(), this.embeddedSignature.read(e2.subarray(r2, e2.length));
          break;
        case re.signatureSubpacket.issuerFingerprint:
          this.issuerKeyVersion = e2[r2++], this.issuerFingerprint = e2.subarray(r2, e2.length), this.issuerKeyVersion === 5 ? this.issuerKeyID.read(this.issuerFingerprint) : this.issuerKeyID.read(this.issuerFingerprint.subarray(-8));
          break;
        case re.signatureSubpacket.preferredAEADAlgorithms:
          this.preferredAEADAlgorithms = [...e2.subarray(r2, e2.length)];
          break;
        default: {
          const e3 = Error("Unknown signature subpacket type " + n2);
          if (i2)
            throw e3;
          V.printDebug(e3);
        }
      }
  }
  readSubPackets(e2, t2 = true, r2) {
    const i2 = V.readNumber(e2.subarray(0, 2));
    let n2 = 2;
    for (; n2 < 2 + i2; ) {
      const i3 = hi(e2.subarray(n2, e2.length));
      n2 += i3.offset, this.readSubPacket(e2.subarray(n2, n2 + i3.len), t2, r2), n2 += i3.len;
    }
    return n2;
  }
  toSign(e2, t2) {
    const r2 = re.signature;
    switch (e2) {
      case r2.binary:
        return t2.text !== null ? V.encodeUTF8(t2.getText(true)) : t2.getBytes(true);
      case r2.text: {
        const e3 = t2.getBytes(true);
        return V.canonicalizeEOL(e3);
      }
      case r2.standalone:
        return new Uint8Array(0);
      case r2.certGeneric:
      case r2.certPersona:
      case r2.certCasual:
      case r2.certPositive:
      case r2.certRevocation: {
        let e3, i2;
        if (t2.userID)
          i2 = 180, e3 = t2.userID;
        else {
          if (!t2.userAttribute)
            throw Error("Either a userID or userAttribute packet needs to be supplied for certification.");
          i2 = 209, e3 = t2.userAttribute;
        }
        const n2 = e3.write();
        return V.concat([this.toSign(r2.key, t2), new Uint8Array([i2]), V.writeNumber(n2.length, 4), n2]);
      }
      case r2.subkeyBinding:
      case r2.subkeyRevocation:
      case r2.keyBinding:
        return V.concat([this.toSign(r2.key, t2), this.toSign(r2.key, {key: t2.bind})]);
      case r2.key:
        if (t2.key === void 0)
          throw Error("Key packet is required for this signature.");
        return t2.key.writeForHash(this.version);
      case r2.keyRevocation:
        return this.toSign(r2.key, t2);
      case r2.timestamp:
        return new Uint8Array(0);
      case r2.thirdParty:
        throw Error("Not implemented");
      default:
        throw Error("Unknown signature type.");
    }
  }
  calculateTrailer(e2, t2) {
    let r2 = 0;
    return B(q(this.signatureData), (e3) => {
      r2 += e3.length;
    }, () => {
      const i2 = [];
      return this.version !== 5 || this.signatureType !== re.signature.binary && this.signatureType !== re.signature.text || (t2 ? i2.push(new Uint8Array(6)) : i2.push(e2.writeHeader())), i2.push(new Uint8Array([this.version, 255])), this.version === 5 && i2.push(new Uint8Array(4)), i2.push(V.writeNumber(r2, 4)), V.concat(i2);
    });
  }
  toHash(e2, t2, r2 = false) {
    const i2 = this.toSign(e2, t2);
    return V.concat([i2, this.signatureData, this.calculateTrailer(t2, r2)]);
  }
  async hash(e2, t2, r2, i2 = false) {
    return r2 || (r2 = this.toHash(e2, t2, i2)), Ln.hash.digest(this.hashAlgorithm, r2);
  }
  async verify(e2, t2, r2, i2 = new Date(), n2 = false, a2 = ie) {
    if (!this.issuerKeyID.equals(e2.getKeyID()))
      throw Error("Signature was not issued by the given public key");
    if (this.publicKeyAlgorithm !== e2.algorithm)
      throw Error("Public key algorithm used to sign signature does not match issuer key algorithm.");
    const s2 = t2 === re.signature.binary || t2 === re.signature.text;
    if (!(this[Ns] && !s2)) {
      let i3, a3;
      if (this.hashed ? a3 = await this.hashed : (i3 = this.toHash(t2, r2, n2), a3 = await this.hash(t2, r2, i3)), a3 = await j(a3), this.signedHashValue[0] !== a3[0] || this.signedHashValue[1] !== a3[1])
        throw Error("Signed digest did not match");
      if (this.params = await this.params, this[Ns] = await Ln.signature.verify(this.publicKeyAlgorithm, this.hashAlgorithm, this.params, e2.publicParams, i3, a3), !this[Ns])
        throw Error("Signature verification failed");
    }
    const o2 = V.normalizeDate(i2);
    if (o2 && this.created > o2)
      throw Error("Signature creation time is in the future");
    if (o2 && o2 >= this.getExpirationTime())
      throw Error("Signature is expired");
    if (a2.rejectHashAlgorithms.has(this.hashAlgorithm))
      throw Error("Insecure hash algorithm: " + re.read(re.hash, this.hashAlgorithm).toUpperCase());
    if (a2.rejectMessageHashAlgorithms.has(this.hashAlgorithm) && [re.signature.binary, re.signature.text].includes(this.signatureType))
      throw Error("Insecure message hash algorithm: " + re.read(re.hash, this.hashAlgorithm).toUpperCase());
    if (this.rawNotations.forEach(({name: e3, critical: t3}) => {
      if (t3 && a2.knownNotations.indexOf(e3) < 0)
        throw Error("Unknown critical notation: " + e3);
    }), this.revocationKeyClass !== null)
      throw Error("This key is intended to be revoked with an authorized key, which OpenPGP.js does not support.");
  }
  isExpired(e2 = new Date()) {
    const t2 = V.normalizeDate(e2);
    return t2 !== null && !(this.created <= t2 && t2 < this.getExpirationTime());
  }
  getExpirationTime() {
    return this.signatureNeverExpires ? 1 / 0 : new Date(this.created.getTime() + 1e3 * this.signatureExpirationTime);
  }
}
function Ws(e2, t2) {
  const r2 = [];
  return r2.push(fi(t2.length + 1)), r2.push(new Uint8Array([e2])), r2.push(t2), V.concat(r2);
}
class Hs {
  static get tag() {
    return re.packet.onePassSignature;
  }
  constructor() {
    this.version = null, this.signatureType = null, this.hashAlgorithm = null, this.publicKeyAlgorithm = null, this.issuerKeyID = null, this.flags = null;
  }
  read(e2) {
    let t2 = 0;
    if (this.version = e2[t2++], this.version !== 3)
      throw new mi(`Version ${this.version} of the one-pass signature packet is unsupported.`);
    return this.signatureType = e2[t2++], this.hashAlgorithm = e2[t2++], this.publicKeyAlgorithm = e2[t2++], this.issuerKeyID = new le(), this.issuerKeyID.read(e2.subarray(t2, t2 + 8)), t2 += 8, this.flags = e2[t2++], this;
  }
  write() {
    const e2 = new Uint8Array([3, this.signatureType, this.hashAlgorithm, this.publicKeyAlgorithm]), t2 = new Uint8Array([this.flags]);
    return V.concatUint8Array([e2, this.issuerKeyID.write(), t2]);
  }
  calculateTrailer(...e2) {
    return W(async () => Ls.prototype.calculateTrailer.apply(await this.correspondingSig, e2));
  }
  async verify() {
    const e2 = await this.correspondingSig;
    if (!e2 || e2.constructor.tag !== re.packet.signature)
      throw Error("Corresponding signature packet missing");
    if (e2.signatureType !== this.signatureType || e2.hashAlgorithm !== this.hashAlgorithm || e2.publicKeyAlgorithm !== this.publicKeyAlgorithm || !e2.issuerKeyID.equals(this.issuerKeyID))
      throw Error("Corresponding signature packet does not match one-pass signature packet");
    return e2.hashed = this.hashed, e2.verify.apply(e2, arguments);
  }
}
function Gs(e2, t2) {
  if (!t2[e2]) {
    let t3;
    try {
      t3 = re.read(re.packet, e2);
    } catch (t4) {
      throw new mi("Unknown packet type with tag: " + e2);
    }
    throw Error("Packet not allowed in this context: " + t3);
  }
  return new t2[e2]();
}
Hs.prototype.hash = Ls.prototype.hash, Hs.prototype.toHash = Ls.prototype.toHash, Hs.prototype.toSign = Ls.prototype.toSign;
class Vs extends Array {
  static async fromBinary(e2, t2, r2 = ie) {
    const i2 = new Vs();
    return await i2.read(e2, t2, r2), i2;
  }
  async read(e2, t2, r2 = ie) {
    this.stream = T(e2, async (e3, i3) => {
      const n2 = D(i3);
      try {
        for (; ; ) {
          await n2.ready;
          if (await bi(e3, async (e4) => {
            try {
              if (e4.tag === re.packet.marker || e4.tag === re.packet.trust)
                return;
              const i4 = Gs(e4.tag, t2);
              i4.packets = new Vs(), i4.fromStream = V.isStream(e4.packet), await i4.read(e4.packet, r2), await n2.write(i4);
            } catch (t3) {
              const i4 = !r2.ignoreUnsupportedPackets && t3 instanceof mi, a2 = !(r2.ignoreMalformedPackets || t3 instanceof mi);
              if (i4 || a2 || yi(e4.tag))
                await n2.abort(t3);
              else {
                const t4 = new gi(e4.tag, e4.packet);
                await n2.write(t4);
              }
              V.printDebugError(t3);
            }
          }))
            return await n2.ready, void await n2.close();
        }
      } catch (e4) {
        await n2.abort(e4);
      }
    });
    const i2 = K(this.stream);
    for (; ; ) {
      const {done: e3, value: t3} = await i2.read();
      if (e3 ? this.stream = null : this.push(t3), e3 || yi(t3.constructor.tag))
        break;
    }
    i2.releaseLock();
  }
  write() {
    const e2 = [];
    for (let t2 = 0; t2 < this.length; t2++) {
      const r2 = this[t2] instanceof gi ? this[t2].tag : this[t2].constructor.tag, i2 = this[t2].write();
      if (V.isStream(i2) && yi(this[t2].constructor.tag)) {
        let t3 = [], n2 = 0;
        const a2 = 512;
        e2.push(li(r2)), e2.push(B(i2, (e3) => {
          if (t3.push(e3), n2 += e3.length, n2 >= a2) {
            const e4 = Math.min(Math.log(n2) / Math.LN2 | 0, 30), r3 = 2 ** e4, i3 = V.concat([di(e4)].concat(t3));
            return t3 = [i3.subarray(1 + r3)], n2 = t3[0].length, i3.subarray(0, 1 + r3);
          }
        }, () => V.concat([fi(n2)].concat(t3))));
      } else {
        if (V.isStream(i2)) {
          let t3 = 0;
          e2.push(B(q(i2), (e3) => {
            t3 += e3.length;
          }, () => pi(r2, t3)));
        } else
          e2.push(pi(r2, i2.length));
        e2.push(i2);
      }
    }
    return V.concat(e2);
  }
  filterByTag(...e2) {
    const t2 = new Vs(), r2 = (e3) => (t3) => e3 === t3;
    for (let i2 = 0; i2 < this.length; i2++)
      e2.some(r2(this[i2].constructor.tag)) && t2.push(this[i2]);
    return t2;
  }
  findPacket(e2) {
    return this.find((t2) => t2.constructor.tag === e2);
  }
  indexOfTag(...e2) {
    const t2 = [], r2 = this, i2 = (e3) => (t3) => e3 === t3;
    for (let n2 = 0; n2 < this.length; n2++)
      e2.some(i2(r2[n2].constructor.tag)) && t2.push(n2);
    return t2;
  }
}
const $s = /* @__PURE__ */ V.constructAllowedPackets([Fs, Hs, Ls]);
class Zs {
  static get tag() {
    return re.packet.compressedData;
  }
  constructor(e2 = ie) {
    this.packets = null, this.algorithm = e2.preferredCompressionAlgorithm, this.compressed = null, this.deflateLevel = e2.deflateLevel;
  }
  async read(e2, t2 = ie) {
    await z(e2, async (e3) => {
      this.algorithm = await e3.readByte(), this.compressed = e3.remainder(), await this.decompress(t2);
    });
  }
  write() {
    return this.compressed === null && this.compress(), V.concat([new Uint8Array([this.algorithm]), this.compressed]);
  }
  async decompress(e2 = ie) {
    const t2 = re.read(re.compression, this.algorithm), r2 = ro[t2];
    if (!r2)
      throw Error(t2 + " decompression not supported");
    this.packets = await Vs.fromBinary(r2(this.compressed), $s, e2);
  }
  compress() {
    const e2 = re.read(re.compression, this.algorithm), t2 = to[e2];
    if (!t2)
      throw Error(e2 + " compression not supported");
    this.compressed = t2(this.packets.write(), this.deflateLevel);
  }
}
const Ys = V.getNodeZlib();
function Xs(e2) {
  return e2;
}
function Qs(e2, t2, r2 = {}) {
  return function(i2) {
    return !V.isStream(i2) || s(i2) ? W(() => j(i2).then((t3) => new Promise((i3, n2) => {
      e2(t3, r2, (e3, t4) => {
        if (e3)
          return n2(e3);
        i3(t4);
      });
    }))) : y(b(i2).pipe(t2(r2)));
  };
}
function Js(e2, t2 = {}) {
  return function(r2) {
    const i2 = new e2(t2);
    return B(r2, (e3) => {
      if (e3.length)
        return i2.push(e3, 2), i2.result;
    }, () => {
      if (e2 === as)
        return i2.push([], 4), i2.result;
    });
  };
}
function eo(e2) {
  return function(t2) {
    return W(async () => e2(await j(t2)));
  };
}
const to = Ys ? {zip: (e2, t2) => Qs(Ys.deflateRaw, Ys.createDeflateRaw, {level: t2})(e2), zlib: (e2, t2) => Qs(Ys.deflate, Ys.createDeflate, {level: t2})(e2)} : {zip: (e2, t2) => Js(as, {raw: true, level: t2})(e2), zlib: (e2, t2) => Js(as, {level: t2})(e2)}, ro = Ys ? {uncompressed: Xs, zip: /* @__PURE__ */ Qs(Ys.inflateRaw, Ys.createInflateRaw), zlib: /* @__PURE__ */ Qs(Ys.inflate, Ys.createInflate), bzip2: /* @__PURE__ */ eo(Os)} : {uncompressed: Xs, zip: /* @__PURE__ */ Js(Ss, {raw: true}), zlib: /* @__PURE__ */ Js(Ss), bzip2: /* @__PURE__ */ eo(Os)}, io = /* @__PURE__ */ V.constructAllowedPackets([Fs, Zs, Hs, Ls]);
class no {
  static get tag() {
    return re.packet.symEncryptedIntegrityProtectedData;
  }
  constructor() {
    this.version = 1, this.encrypted = null, this.packets = null;
  }
  async read(e2) {
    await z(e2, async (e3) => {
      const t2 = await e3.readByte();
      if (t2 !== 1)
        throw new mi(`Version ${t2} of the SEIP packet is unsupported.`);
      this.encrypted = e3.remainder();
    });
  }
  write() {
    return V.concat([new Uint8Array([1]), this.encrypted]);
  }
  async encrypt(e2, t2, r2 = ie) {
    const {blockSize: i2} = Ln.getCipher(e2);
    let n2 = this.packets.write();
    s(n2) && (n2 = await j(n2));
    const a2 = await Ln.getPrefixRandom(e2), o2 = new Uint8Array([211, 20]), c2 = V.concat([a2, n2, o2]), u2 = await Ln.hash.sha1(O(c2)), h2 = V.concat([c2, u2]);
    return this.encrypted = await Ln.mode.cfb.encrypt(e2, t2, h2, new Uint8Array(i2), r2), true;
  }
  async decrypt(e2, t2, r2 = ie) {
    const {blockSize: i2} = Ln.getCipher(e2);
    let n2 = q(this.encrypted);
    s(n2) && (n2 = await j(n2));
    const a2 = await Ln.mode.cfb.decrypt(e2, t2, n2, new Uint8Array(i2)), o2 = N(O(a2), -20), c2 = N(a2, 0, -20), u2 = Promise.all([j(await Ln.hash.sha1(O(c2))), j(o2)]).then(([e3, t3]) => {
      if (!V.equalsUint8Array(e3, t3))
        throw Error("Modification detected.");
      return new Uint8Array();
    }), h2 = N(c2, i2 + 2);
    let f2 = N(h2, 0, -2);
    return f2 = C([f2, W(() => u2)]), V.isStream(n2) && r2.allowUnauthenticatedStream || (f2 = await j(f2)), this.packets = await Vs.fromBinary(f2, io, r2), true;
  }
}
const ao = /* @__PURE__ */ V.constructAllowedPackets([Fs, Zs, Hs, Ls]);
class so {
  static get tag() {
    return re.packet.aeadEncryptedData;
  }
  constructor() {
    this.version = 1, this.cipherAlgorithm = null, this.aeadAlgorithm = re.aead.eax, this.chunkSizeByte = null, this.iv = null, this.encrypted = null, this.packets = null;
  }
  async read(e2) {
    await z(e2, async (e3) => {
      const t2 = await e3.readByte();
      if (t2 !== 1)
        throw new mi(`Version ${t2} of the AEAD-encrypted data packet is not supported.`);
      this.cipherAlgorithm = await e3.readByte(), this.aeadAlgorithm = await e3.readByte(), this.chunkSizeByte = await e3.readByte();
      const r2 = Ln.getAEADMode(this.aeadAlgorithm);
      this.iv = await e3.readBytes(r2.ivLength), this.encrypted = e3.remainder();
    });
  }
  write() {
    return V.concat([new Uint8Array([this.version, this.cipherAlgorithm, this.aeadAlgorithm, this.chunkSizeByte]), this.iv, this.encrypted]);
  }
  async decrypt(e2, t2, r2 = ie) {
    this.packets = await Vs.fromBinary(await this.crypt("decrypt", t2, q(this.encrypted)), ao, r2);
  }
  async encrypt(e2, t2, r2 = ie) {
    this.cipherAlgorithm = e2;
    const {ivLength: i2} = Ln.getAEADMode(this.aeadAlgorithm);
    this.iv = await Ln.random.getRandomBytes(i2), this.chunkSizeByte = r2.aeadChunkSizeByte;
    const n2 = this.packets.write();
    this.encrypted = await this.crypt("encrypt", t2, n2);
  }
  async crypt(e2, t2, r2) {
    const i2 = Ln.getAEADMode(this.aeadAlgorithm), n2 = await i2(this.cipherAlgorithm, t2), a2 = e2 === "decrypt" ? i2.tagLength : 0, s2 = e2 === "encrypt" ? i2.tagLength : 0, o2 = 2 ** (this.chunkSizeByte + 6) + a2, c2 = new ArrayBuffer(21), u2 = new Uint8Array(c2, 0, 13), h2 = new Uint8Array(c2), f2 = new DataView(c2), d2 = new Uint8Array(c2, 5, 8);
    u2.set([192 | so.tag, this.version, this.cipherAlgorithm, this.aeadAlgorithm, this.chunkSizeByte], 0);
    let l2 = 0, p2 = Promise.resolve(), y2 = 0, b2 = 0;
    const m2 = this.iv;
    return T(r2, async (t3, r3) => {
      if (V.isStream(t3) !== "array") {
        const e3 = new S({}, {highWaterMark: V.getHardwareConcurrency() * 2 ** (this.chunkSizeByte + 6), size: (e4) => e4.length});
        R(e3.readable, r3), r3 = e3.writable;
      }
      const c3 = K(t3), g2 = D(r3);
      try {
        for (; ; ) {
          let t4 = await c3.readBytes(o2 + a2) || new Uint8Array();
          const r4 = t4.subarray(t4.length - a2);
          let w2, v2;
          if (t4 = t4.subarray(0, t4.length - a2), !l2 || t4.length ? (c3.unshift(r4), w2 = n2[e2](t4, i2.getNonce(m2, d2), u2), b2 += t4.length - a2 + s2) : (f2.setInt32(17, y2), w2 = n2[e2](r4, i2.getNonce(m2, d2), h2), b2 += s2, v2 = true), y2 += t4.length - a2, p2 = p2.then(() => w2).then(async (e3) => {
            await g2.ready, await g2.write(e3), b2 -= e3.length;
          }).catch((e3) => g2.abort(e3)), (v2 || b2 > g2.desiredSize) && await p2, v2) {
            await g2.close();
            break;
          }
          f2.setInt32(9, ++l2);
        }
      } catch (e3) {
        await g2.abort(e3);
      }
    });
  }
}
class oo {
  static get tag() {
    return re.packet.publicKeyEncryptedSessionKey;
  }
  constructor() {
    this.version = 3, this.publicKeyID = new le(), this.publicKeyAlgorithm = null, this.sessionKey = null, this.sessionKeyAlgorithm = null, this.encrypted = {};
  }
  read(e2) {
    if (this.version = e2[0], this.version !== 3)
      throw new mi(`Version ${this.version} of the PKESK packet is unsupported.`);
    this.publicKeyID.read(e2.subarray(1, e2.length)), this.publicKeyAlgorithm = e2[9], this.encrypted = Ln.parseEncSessionKeyParams(this.publicKeyAlgorithm, e2.subarray(10));
  }
  write() {
    const e2 = [new Uint8Array([this.version]), this.publicKeyID.write(), new Uint8Array([this.publicKeyAlgorithm]), Ln.serializeParams(this.publicKeyAlgorithm, this.encrypted)];
    return V.concatUint8Array(e2);
  }
  async encrypt(e2) {
    const t2 = V.concatUint8Array([new Uint8Array([re.write(re.symmetric, this.sessionKeyAlgorithm)]), this.sessionKey, V.writeChecksum(this.sessionKey)]), r2 = re.write(re.publicKey, this.publicKeyAlgorithm);
    this.encrypted = await Ln.publicKeyEncrypt(r2, e2.publicParams, t2, e2.getFingerprintBytes());
  }
  async decrypt(e2, t2) {
    if (this.publicKeyAlgorithm !== e2.algorithm)
      throw Error("Decryption error");
    const r2 = t2 ? V.concatUint8Array([new Uint8Array([t2.sessionKeyAlgorithm]), t2.sessionKey, V.writeChecksum(t2.sessionKey)]) : null, i2 = await Ln.publicKeyDecrypt(this.publicKeyAlgorithm, e2.publicParams, e2.privateParams, this.encrypted, e2.getFingerprintBytes(), r2), n2 = i2[0], a2 = i2.subarray(1, i2.length - 2), s2 = i2.subarray(i2.length - 2), o2 = V.writeChecksum(a2), c2 = o2[0] === s2[0] & o2[1] === s2[1];
    if (t2) {
      const e3 = c2 & n2 === t2.sessionKeyAlgorithm & a2.length === t2.sessionKey.length;
      this.sessionKeyAlgorithm = V.selectUint8(e3, n2, t2.sessionKeyAlgorithm), this.sessionKey = V.selectUint8Array(e3, a2, t2.sessionKey);
    } else {
      if (!(c2 && re.read(re.symmetric, n2)))
        throw Error("Decryption error");
      this.sessionKey = a2, this.sessionKeyAlgorithm = n2;
    }
  }
}
class co {
  constructor(e2 = ie) {
    this.algorithm = re.hash.sha256, this.type = "iterated", this.c = e2.s2kIterationCountByte, this.salt = null;
  }
  getCount() {
    return 16 + (15 & this.c) << 6 + (this.c >> 4);
  }
  read(e2) {
    let t2 = 0;
    switch (this.type = re.read(re.s2k, e2[t2++]), this.algorithm = e2[t2++], this.type) {
      case "simple":
        break;
      case "salted":
        this.salt = e2.subarray(t2, t2 + 8), t2 += 8;
        break;
      case "iterated":
        this.salt = e2.subarray(t2, t2 + 8), t2 += 8, this.c = e2[t2++];
        break;
      case "gnu":
        if (V.uint8ArrayToString(e2.subarray(t2, t2 + 3)) !== "GNU")
          throw Error("Unknown s2k type.");
        t2 += 3;
        if (1e3 + e2[t2++] !== 1001)
          throw Error("Unknown s2k gnu protection mode.");
        this.type = "gnu-dummy";
        break;
      default:
        throw Error("Unknown s2k type.");
    }
    return t2;
  }
  write() {
    if (this.type === "gnu-dummy")
      return new Uint8Array([101, 0, ...V.stringToUint8Array("GNU"), 1]);
    const e2 = [new Uint8Array([re.write(re.s2k, this.type), this.algorithm])];
    switch (this.type) {
      case "simple":
        break;
      case "salted":
        e2.push(this.salt);
        break;
      case "iterated":
        e2.push(this.salt), e2.push(new Uint8Array([this.c]));
        break;
      case "gnu":
        throw Error("GNU s2k type not supported.");
      default:
        throw Error("Unknown s2k type.");
    }
    return V.concatUint8Array(e2);
  }
  async produceKey(e2, t2) {
    e2 = V.encodeUTF8(e2);
    const r2 = [];
    let i2 = 0, n2 = 0;
    for (; i2 < t2; ) {
      let t3;
      switch (this.type) {
        case "simple":
          t3 = V.concatUint8Array([new Uint8Array(n2), e2]);
          break;
        case "salted":
          t3 = V.concatUint8Array([new Uint8Array(n2), this.salt, e2]);
          break;
        case "iterated": {
          const r3 = V.concatUint8Array([this.salt, e2]);
          let i3 = r3.length;
          const a3 = Math.max(this.getCount(), i3);
          t3 = new Uint8Array(n2 + a3), t3.set(r3, n2);
          for (let e3 = n2 + i3; e3 < a3; e3 += i3, i3 *= 2)
            t3.copyWithin(e3, n2, e3);
          break;
        }
        case "gnu":
          throw Error("GNU s2k type not supported.");
        default:
          throw Error("Unknown s2k type.");
      }
      const a2 = await Ln.hash.digest(this.algorithm, t3);
      r2.push(a2), i2 += a2.length, n2++;
    }
    return V.concatUint8Array(r2).subarray(0, t2);
  }
}
class uo {
  static get tag() {
    return re.packet.symEncryptedSessionKey;
  }
  constructor(e2 = ie) {
    this.version = e2.aeadProtect ? 5 : 4, this.sessionKey = null, this.sessionKeyEncryptionAlgorithm = null, this.sessionKeyAlgorithm = re.symmetric.aes256, this.aeadAlgorithm = re.write(re.aead, e2.preferredAEADAlgorithm), this.encrypted = null, this.s2k = null, this.iv = null;
  }
  read(e2) {
    let t2 = 0;
    if (this.version = e2[t2++], this.version !== 4 && this.version !== 5)
      throw new mi(`Version ${this.version} of the SKESK packet is unsupported.`);
    const r2 = e2[t2++];
    if (this.version === 5 && (this.aeadAlgorithm = e2[t2++]), this.s2k = new co(), t2 += this.s2k.read(e2.subarray(t2, e2.length)), this.version === 5) {
      const r3 = Ln.getAEADMode(this.aeadAlgorithm);
      this.iv = e2.subarray(t2, t2 += r3.ivLength);
    }
    this.version === 5 || t2 < e2.length ? (this.encrypted = e2.subarray(t2, e2.length), this.sessionKeyEncryptionAlgorithm = r2) : this.sessionKeyAlgorithm = r2;
  }
  write() {
    const e2 = this.encrypted === null ? this.sessionKeyAlgorithm : this.sessionKeyEncryptionAlgorithm;
    let t2;
    return this.version === 5 ? t2 = V.concatUint8Array([new Uint8Array([this.version, e2, this.aeadAlgorithm]), this.s2k.write(), this.iv, this.encrypted]) : (t2 = V.concatUint8Array([new Uint8Array([this.version, e2]), this.s2k.write()]), this.encrypted !== null && (t2 = V.concatUint8Array([t2, this.encrypted]))), t2;
  }
  async decrypt(e2) {
    const t2 = this.sessionKeyEncryptionAlgorithm !== null ? this.sessionKeyEncryptionAlgorithm : this.sessionKeyAlgorithm, {blockSize: r2, keySize: i2} = Ln.getCipher(t2), n2 = await this.s2k.produceKey(e2, i2);
    if (this.version === 5) {
      const e3 = Ln.getAEADMode(this.aeadAlgorithm), r3 = new Uint8Array([192 | uo.tag, this.version, this.sessionKeyEncryptionAlgorithm, this.aeadAlgorithm]), i3 = await e3(t2, n2);
      this.sessionKey = await i3.decrypt(this.encrypted, this.iv, r3);
    } else if (this.encrypted !== null) {
      const e3 = await Ln.mode.cfb.decrypt(t2, n2, this.encrypted, new Uint8Array(r2));
      this.sessionKeyAlgorithm = re.write(re.symmetric, e3[0]), this.sessionKey = e3.subarray(1, e3.length);
    } else
      this.sessionKey = n2;
  }
  async encrypt(e2, t2 = ie) {
    const r2 = this.sessionKeyEncryptionAlgorithm !== null ? this.sessionKeyEncryptionAlgorithm : this.sessionKeyAlgorithm;
    this.sessionKeyEncryptionAlgorithm = r2, this.s2k = new co(t2), this.s2k.salt = await Ln.random.getRandomBytes(8);
    const {blockSize: i2, keySize: n2} = Ln.getCipher(r2), a2 = await this.s2k.produceKey(e2, n2);
    if (this.sessionKey === null && (this.sessionKey = await Ln.generateSessionKey(this.sessionKeyAlgorithm)), this.version === 5) {
      const e3 = Ln.getAEADMode(this.aeadAlgorithm);
      this.iv = await Ln.random.getRandomBytes(e3.ivLength);
      const t3 = new Uint8Array([192 | uo.tag, this.version, this.sessionKeyEncryptionAlgorithm, this.aeadAlgorithm]), i3 = await e3(r2, a2);
      this.encrypted = await i3.encrypt(this.sessionKey, this.iv, t3);
    } else {
      const e3 = V.concatUint8Array([new Uint8Array([this.sessionKeyAlgorithm]), this.sessionKey]);
      this.encrypted = await Ln.mode.cfb.encrypt(r2, a2, e3, new Uint8Array(i2), t2);
    }
  }
}
class ho {
  static get tag() {
    return re.packet.publicKey;
  }
  constructor(e2 = new Date(), t2 = ie) {
    this.version = t2.v5Keys ? 5 : 4, this.created = V.normalizeDate(e2), this.algorithm = null, this.publicParams = null, this.expirationTimeV3 = 0, this.fingerprint = null, this.keyID = null;
  }
  static fromSecretKeyPacket(e2) {
    const t2 = new ho(), {version: r2, created: i2, algorithm: n2, publicParams: a2, keyID: s2, fingerprint: o2} = e2;
    return t2.version = r2, t2.created = i2, t2.algorithm = n2, t2.publicParams = a2, t2.keyID = s2, t2.fingerprint = o2, t2;
  }
  async read(e2) {
    let t2 = 0;
    if (this.version = e2[t2++], this.version === 4 || this.version === 5) {
      this.created = V.readDate(e2.subarray(t2, t2 + 4)), t2 += 4, this.algorithm = e2[t2++], this.version === 5 && (t2 += 4);
      const {read: r2, publicParams: i2} = Ln.parsePublicKeyParams(this.algorithm, e2.subarray(t2));
      return this.publicParams = i2, t2 += r2, await this.computeFingerprintAndKeyID(), t2;
    }
    throw new mi(`Version ${this.version} of the key packet is unsupported.`);
  }
  write() {
    const e2 = [];
    e2.push(new Uint8Array([this.version])), e2.push(V.writeDate(this.created)), e2.push(new Uint8Array([this.algorithm]));
    const t2 = Ln.serializeParams(this.algorithm, this.publicParams);
    return this.version === 5 && e2.push(V.writeNumber(t2.length, 4)), e2.push(t2), V.concatUint8Array(e2);
  }
  writeForHash(e2) {
    const t2 = this.writePublicKey();
    return e2 === 5 ? V.concatUint8Array([new Uint8Array([154]), V.writeNumber(t2.length, 4), t2]) : V.concatUint8Array([new Uint8Array([153]), V.writeNumber(t2.length, 2), t2]);
  }
  isDecrypted() {
    return null;
  }
  getCreationTime() {
    return this.created;
  }
  getKeyID() {
    return this.keyID;
  }
  async computeFingerprintAndKeyID() {
    if (await this.computeFingerprint(), this.keyID = new le(), this.version === 5)
      this.keyID.read(this.fingerprint.subarray(0, 8));
    else {
      if (this.version !== 4)
        throw Error("Unsupported key version");
      this.keyID.read(this.fingerprint.subarray(12, 20));
    }
  }
  async computeFingerprint() {
    const e2 = this.writeForHash(this.version);
    if (this.version === 5)
      this.fingerprint = await Ln.hash.sha256(e2);
    else {
      if (this.version !== 4)
        throw Error("Unsupported key version");
      this.fingerprint = await Ln.hash.sha1(e2);
    }
  }
  getFingerprintBytes() {
    return this.fingerprint;
  }
  getFingerprint() {
    return V.uint8ArrayToHex(this.getFingerprintBytes());
  }
  hasSameFingerprintAs(e2) {
    return this.version === e2.version && V.equalsUint8Array(this.writePublicKey(), e2.writePublicKey());
  }
  getAlgorithmInfo() {
    const e2 = {};
    e2.algorithm = re.read(re.publicKey, this.algorithm);
    const t2 = this.publicParams.n || this.publicParams.p;
    return t2 ? e2.bits = V.uint8ArrayBitLength(t2) : e2.curve = this.publicParams.oid.getName(), e2;
  }
}
ho.prototype.readPublicKey = ho.prototype.read, ho.prototype.writePublicKey = ho.prototype.write;
class yo extends ho {
  static get tag() {
    return re.packet.publicSubkey;
  }
  constructor(e2, t2) {
    super(e2, t2);
  }
  static fromSecretSubkeyPacket(e2) {
    const t2 = new yo(), {version: r2, created: i2, algorithm: n2, publicParams: a2, keyID: s2, fingerprint: o2} = e2;
    return t2.version = r2, t2.created = i2, t2.algorithm = n2, t2.publicParams = a2, t2.keyID = s2, t2.fingerprint = o2, t2;
  }
}
class bo {
  static get tag() {
    return re.packet.userAttribute;
  }
  constructor() {
    this.attributes = [];
  }
  read(e2) {
    let t2 = 0;
    for (; t2 < e2.length; ) {
      const r2 = hi(e2.subarray(t2, e2.length));
      t2 += r2.offset, this.attributes.push(V.uint8ArrayToString(e2.subarray(t2, t2 + r2.len))), t2 += r2.len;
    }
  }
  write() {
    const e2 = [];
    for (let t2 = 0; t2 < this.attributes.length; t2++)
      e2.push(fi(this.attributes[t2].length)), e2.push(V.stringToUint8Array(this.attributes[t2]));
    return V.concatUint8Array(e2);
  }
  equals(e2) {
    return !!(e2 && e2 instanceof bo) && this.attributes.every(function(t2, r2) {
      return t2 === e2.attributes[r2];
    });
  }
}
class mo extends ho {
  static get tag() {
    return re.packet.secretKey;
  }
  constructor(e2 = new Date(), t2 = ie) {
    super(e2, t2), this.keyMaterial = null, this.isEncrypted = null, this.s2kUsage = 0, this.s2k = null, this.symmetric = null, this.aead = null, this.privateParams = null;
  }
  async read(e2) {
    let t2 = await this.readPublicKey(e2);
    if (this.s2kUsage = e2[t2++], this.version === 5 && t2++, this.s2kUsage === 255 || this.s2kUsage === 254 || this.s2kUsage === 253) {
      if (this.symmetric = e2[t2++], this.s2kUsage === 253 && (this.aead = e2[t2++]), this.s2k = new co(), t2 += this.s2k.read(e2.subarray(t2, e2.length)), this.s2k.type === "gnu-dummy")
        return;
    } else
      this.s2kUsage && (this.symmetric = this.s2kUsage);
    if (this.s2kUsage && (this.iv = e2.subarray(t2, t2 + Ln.getCipher(this.symmetric).blockSize), t2 += this.iv.length), this.version === 5 && (t2 += 4), this.keyMaterial = e2.subarray(t2), this.isEncrypted = !!this.s2kUsage, !this.isEncrypted) {
      const e3 = this.keyMaterial.subarray(0, -2);
      if (!V.equalsUint8Array(V.writeChecksum(e3), this.keyMaterial.subarray(-2)))
        throw Error("Key checksum mismatch");
      try {
        const {privateParams: t3} = Ln.parsePrivateKeyParams(this.algorithm, e3, this.publicParams);
        this.privateParams = t3;
      } catch (e4) {
        if (e4 instanceof mi)
          throw e4;
        throw Error("Error reading MPIs");
      }
    }
  }
  write() {
    const e2 = [this.writePublicKey()];
    e2.push(new Uint8Array([this.s2kUsage]));
    const t2 = [];
    return this.s2kUsage !== 255 && this.s2kUsage !== 254 && this.s2kUsage !== 253 || (t2.push(this.symmetric), this.s2kUsage === 253 && t2.push(this.aead), t2.push(...this.s2k.write())), this.s2kUsage && this.s2k.type !== "gnu-dummy" && t2.push(...this.iv), this.version === 5 && e2.push(new Uint8Array([t2.length])), e2.push(new Uint8Array(t2)), this.isDummy() || (this.s2kUsage || (this.keyMaterial = Ln.serializeParams(this.algorithm, this.privateParams)), this.version === 5 && e2.push(V.writeNumber(this.keyMaterial.length, 4)), e2.push(this.keyMaterial), this.s2kUsage || e2.push(V.writeChecksum(this.keyMaterial))), V.concatUint8Array(e2);
  }
  isDecrypted() {
    return this.isEncrypted === false;
  }
  isDummy() {
    return !(!this.s2k || this.s2k.type !== "gnu-dummy");
  }
  makeDummy(e2 = ie) {
    this.isDummy() || (this.isDecrypted() && this.clearPrivateParams(), this.isEncrypted = null, this.keyMaterial = null, this.s2k = new co(e2), this.s2k.algorithm = 0, this.s2k.c = 0, this.s2k.type = "gnu-dummy", this.s2kUsage = 254, this.symmetric = re.symmetric.aes256);
  }
  async encrypt(e2, t2 = ie) {
    if (this.isDummy())
      return;
    if (!this.isDecrypted())
      throw Error("Key packet is already encrypted");
    if (!e2)
      throw Error("A non-empty passphrase is required for key encryption.");
    this.s2k = new co(t2), this.s2k.salt = await Ln.random.getRandomBytes(8);
    const r2 = Ln.serializeParams(this.algorithm, this.privateParams);
    this.symmetric = re.symmetric.aes256;
    const i2 = await go(this.s2k, e2, this.symmetric), {blockSize: n2} = Ln.getCipher(this.symmetric);
    if (this.iv = await Ln.random.getRandomBytes(n2), t2.aeadProtect) {
      this.s2kUsage = 253, this.aead = re.aead.eax;
      const e3 = Ln.getAEADMode(this.aead), t3 = await e3(this.symmetric, i2);
      this.keyMaterial = await t3.encrypt(r2, this.iv.subarray(0, e3.ivLength), new Uint8Array());
    } else
      this.s2kUsage = 254, this.keyMaterial = await Ln.mode.cfb.encrypt(this.symmetric, i2, V.concatUint8Array([r2, await Ln.hash.sha1(r2, t2)]), this.iv, t2);
  }
  async decrypt(e2) {
    if (this.isDummy())
      return false;
    if (this.isDecrypted())
      throw Error("Key packet is already decrypted.");
    let t2, r2;
    if (this.s2kUsage !== 254 && this.s2kUsage !== 253)
      throw this.s2kUsage === 255 ? Error("Encrypted private key is authenticated using an insecure two-byte hash") : Error("Private key is encrypted using an insecure S2K function: unsalted MD5");
    if (t2 = await go(this.s2k, e2, this.symmetric), this.s2kUsage === 253) {
      const e3 = Ln.getAEADMode(this.aead), i2 = await e3(this.symmetric, t2);
      try {
        r2 = await i2.decrypt(this.keyMaterial, this.iv.subarray(0, e3.ivLength), new Uint8Array());
      } catch (e4) {
        if (e4.message === "Authentication tag mismatch")
          throw Error("Incorrect key passphrase: " + e4.message);
        throw e4;
      }
    } else {
      const e3 = await Ln.mode.cfb.decrypt(this.symmetric, t2, this.keyMaterial, this.iv);
      r2 = e3.subarray(0, -20);
      const i2 = await Ln.hash.sha1(r2);
      if (!V.equalsUint8Array(i2, e3.subarray(-20)))
        throw Error("Incorrect key passphrase");
    }
    try {
      const {privateParams: e3} = Ln.parsePrivateKeyParams(this.algorithm, r2, this.publicParams);
      this.privateParams = e3;
    } catch (e3) {
      throw Error("Error reading MPIs");
    }
    this.isEncrypted = false, this.keyMaterial = null, this.s2kUsage = 0;
  }
  async validate() {
    if (this.isDummy())
      return;
    if (!this.isDecrypted())
      throw Error("Key is not decrypted");
    let e2;
    try {
      e2 = await Ln.validateParams(this.algorithm, this.publicParams, this.privateParams);
    } catch (t2) {
      e2 = false;
    }
    if (!e2)
      throw Error("Key is invalid");
  }
  async generate(e2, t2) {
    const {privateParams: r2, publicParams: i2} = await Ln.generateParams(this.algorithm, e2, t2);
    this.privateParams = r2, this.publicParams = i2, this.isEncrypted = false;
  }
  clearPrivateParams() {
    this.isDummy() || (Object.keys(this.privateParams).forEach((e2) => {
      this.privateParams[e2].fill(0), delete this.privateParams[e2];
    }), this.privateParams = null, this.isEncrypted = true);
  }
}
async function go(e2, t2, r2) {
  const {keySize: i2} = Ln.getCipher(r2);
  return e2.produceKey(t2, i2);
}
var wo = tt(function(e2) {
  !function(t2) {
    function r2(e3) {
      function t3() {
        return Ae2 < Se2;
      }
      function r3() {
        return Ae2;
      }
      function n2(e4) {
        Ae2 = e4;
      }
      function a2() {
        Ae2 = 0, Se2 = ke2.length;
      }
      function s2(e4, t4) {
        return {name: e4, tokens: t4 || "", semantic: t4 || "", children: []};
      }
      function o2(e4, t4) {
        var r4;
        return t4 === null ? null : ((r4 = s2(e4)).tokens = t4.tokens, r4.semantic = t4.semantic, r4.children.push(t4), r4);
      }
      function c2(e4, t4) {
        return t4 !== null && (e4.tokens += t4.tokens, e4.semantic += t4.semantic), e4.children.push(t4), e4;
      }
      function u2(e4) {
        var r4;
        return t3() && e4(r4 = ke2[Ae2]) ? (Ae2 += 1, s2("token", r4)) : null;
      }
      function h2(e4) {
        return function() {
          return o2("literal", u2(function(t4) {
            return t4 === e4;
          }));
        };
      }
      function f2() {
        var e4 = arguments;
        return function() {
          var t4, i3, a3, o3;
          for (o3 = r3(), i3 = s2("and"), t4 = 0; t4 < e4.length; t4 += 1) {
            if ((a3 = e4[t4]()) === null)
              return n2(o3), null;
            c2(i3, a3);
          }
          return i3;
        };
      }
      function d2() {
        var e4 = arguments;
        return function() {
          var t4, i3, a3;
          for (a3 = r3(), t4 = 0; t4 < e4.length; t4 += 1) {
            if ((i3 = e4[t4]()) !== null)
              return i3;
            n2(a3);
          }
          return null;
        };
      }
      function l2(e4) {
        return function() {
          var t4, i3;
          return i3 = r3(), (t4 = e4()) !== null ? t4 : (n2(i3), s2("opt"));
        };
      }
      function p2(e4) {
        return function() {
          var t4 = e4();
          return t4 !== null && (t4.semantic = ""), t4;
        };
      }
      function y2(e4) {
        return function() {
          var t4 = e4();
          return t4 !== null && t4.semantic.length > 0 && (t4.semantic = " "), t4;
        };
      }
      function b2(e4, t4) {
        return function() {
          var i3, a3, o3, u3, h3;
          for (u3 = r3(), i3 = s2("star"), o3 = 0, h3 = t4 === void 0 ? 0 : t4; (a3 = e4()) !== null; )
            o3 += 1, c2(i3, a3);
          return o3 >= h3 ? i3 : (n2(u3), null);
        };
      }
      function m2(e4) {
        return e4.charCodeAt(0) >= 128;
      }
      function g2() {
        return o2("cr", h2("\r")());
      }
      function w2() {
        return o2("crlf", f2(g2, k2)());
      }
      function v2() {
        return o2("dquote", h2('"')());
      }
      function _2() {
        return o2("htab", h2("	")());
      }
      function k2() {
        return o2("lf", h2("\n")());
      }
      function A2() {
        return o2("sp", h2(" ")());
      }
      function S2() {
        return o2("vchar", u2(function(t4) {
          var r4 = t4.charCodeAt(0), i3 = 33 <= r4 && r4 <= 126;
          return e3.rfc6532 && (i3 = i3 || m2(t4)), i3;
        }));
      }
      function E2() {
        return o2("wsp", d2(A2, _2)());
      }
      function P2() {
        var e4 = o2("quoted-pair", d2(f2(h2("\\"), d2(S2, E2)), ie2)());
        return e4 === null ? null : (e4.semantic = e4.semantic[1], e4);
      }
      function x2() {
        return o2("fws", d2(ae2, f2(l2(f2(b2(E2), p2(w2))), b2(E2, 1)))());
      }
      function M2() {
        return o2("ctext", d2(function() {
          return u2(function(t4) {
            var r4 = t4.charCodeAt(0), i3 = 33 <= r4 && r4 <= 39 || 42 <= r4 && r4 <= 91 || 93 <= r4 && r4 <= 126;
            return e3.rfc6532 && (i3 = i3 || m2(t4)), i3;
          });
        }, te2)());
      }
      function C2() {
        return o2("ccontent", d2(M2, P2, K2)());
      }
      function K2() {
        return o2("comment", f2(h2("("), b2(f2(l2(x2), C2)), l2(x2), h2(")"))());
      }
      function D2() {
        return o2("cfws", d2(f2(b2(f2(l2(x2), K2), 1), l2(x2)), x2)());
      }
      function R2() {
        return o2("atext", u2(function(t4) {
          var r4 = "a" <= t4 && t4 <= "z" || "A" <= t4 && t4 <= "Z" || "0" <= t4 && t4 <= "9" || ["!", "#", "$", "%", "&", "'", "*", "+", "-", "/", "=", "?", "^", "_", "`", "{", "|", "}", "~"].indexOf(t4) >= 0;
          return e3.rfc6532 && (r4 = r4 || m2(t4)), r4;
        }));
      }
      function U2() {
        return o2("atom", f2(y2(l2(D2)), b2(R2, 1), y2(l2(D2)))());
      }
      function I2() {
        var e4, t4;
        return (e4 = o2("dot-atom-text", b2(R2, 1)())) === null || (t4 = b2(f2(h2("."), b2(R2, 1)))()) !== null && c2(e4, t4), e4;
      }
      function B2() {
        return o2("dot-atom", f2(p2(l2(D2)), I2, p2(l2(D2)))());
      }
      function T2() {
        return o2("qtext", d2(function() {
          return u2(function(t4) {
            var r4 = t4.charCodeAt(0), i3 = r4 === 33 || 35 <= r4 && r4 <= 91 || 93 <= r4 && r4 <= 126;
            return e3.rfc6532 && (i3 = i3 || m2(t4)), i3;
          });
        }, re2)());
      }
      function z2() {
        return o2("qcontent", d2(T2, P2)());
      }
      function q2() {
        return o2("quoted-string", f2(p2(l2(D2)), p2(v2), b2(f2(l2(y2(x2)), z2)), l2(p2(x2)), p2(v2), p2(l2(D2)))());
      }
      function O2() {
        return o2("word", d2(U2, q2)());
      }
      function F2() {
        return o2("address", d2(N2, W2)());
      }
      function N2() {
        return o2("mailbox", d2(j2, J2)());
      }
      function j2() {
        return o2("name-addr", f2(l2(H2), L2)());
      }
      function L2() {
        return o2("angle-addr", d2(f2(p2(l2(D2)), h2("<"), J2, h2(">"), p2(l2(D2))), se2)());
      }
      function W2() {
        return o2("group", f2(H2, h2(":"), l2($2), h2(";"), p2(l2(D2)))());
      }
      function H2() {
        return o2("display-name", ((e4 = o2("phrase", d2(ne2, b2(O2, 1))())) !== null && (e4.semantic = function(e5) {
          return e5.replace(/([ \t]|\r\n)+/g, " ").replace(/^\s*/, "").replace(/\s*$/, "");
        }(e4.semantic)), e4));
        var e4;
      }
      function G2() {
        return o2("mailbox-list", d2(f2(N2, b2(f2(h2(","), N2))), ue2)());
      }
      function V2() {
        return o2("address-list", d2(f2(F2, b2(f2(h2(","), F2))), he2)());
      }
      function $2() {
        return o2("group-list", d2(G2, p2(D2), fe2)());
      }
      function Z2() {
        return o2("local-part", d2(de2, B2, q2)());
      }
      function Y2() {
        return o2("dtext", d2(function() {
          return u2(function(t4) {
            var r4 = t4.charCodeAt(0), i3 = 33 <= r4 && r4 <= 90 || 94 <= r4 && r4 <= 126;
            return e3.rfc6532 && (i3 = i3 || m2(t4)), i3;
          });
        }, pe2)());
      }
      function X2() {
        return o2("domain-literal", f2(p2(l2(D2)), h2("["), b2(f2(l2(x2), Y2)), l2(x2), h2("]"), p2(l2(D2)))());
      }
      function Q2() {
        return o2("domain", (t4 = d2(le2, B2, X2)(), e3.rejectTLD && t4 && t4.semantic && t4.semantic.indexOf(".") < 0 ? null : (t4 && (t4.semantic = t4.semantic.replace(/\s+/g, "")), t4)));
        var t4;
      }
      function J2() {
        return o2("addr-spec", f2(Z2, h2("@"), Q2)());
      }
      function ee2() {
        return e3.strict ? null : o2("obs-NO-WS-CTL", u2(function(e4) {
          var t4 = e4.charCodeAt(0);
          return 1 <= t4 && t4 <= 8 || t4 === 11 || t4 === 12 || 14 <= t4 && t4 <= 31 || t4 === 127;
        }));
      }
      function te2() {
        return e3.strict ? null : o2("obs-ctext", ee2());
      }
      function re2() {
        return e3.strict ? null : o2("obs-qtext", ee2());
      }
      function ie2() {
        return e3.strict ? null : o2("obs-qp", f2(h2("\\"), d2(h2("\0"), ee2, k2, g2))());
      }
      function ne2() {
        return e3.strict ? null : e3.atInDisplayName ? o2("obs-phrase", f2(O2, b2(d2(O2, h2("."), h2("@"), y2(D2))))()) : o2("obs-phrase", f2(O2, b2(d2(O2, h2("."), y2(D2))))());
      }
      function ae2() {
        return e3.strict ? null : o2("obs-FWS", b2(f2(p2(l2(w2)), E2), 1)());
      }
      function se2() {
        return e3.strict ? null : o2("obs-angle-addr", f2(p2(l2(D2)), h2("<"), oe2, J2, h2(">"), p2(l2(D2)))());
      }
      function oe2() {
        return e3.strict ? null : o2("obs-route", f2(ce2, h2(":"))());
      }
      function ce2() {
        return e3.strict ? null : o2("obs-domain-list", f2(b2(d2(p2(D2), h2(","))), h2("@"), Q2, b2(f2(h2(","), p2(l2(D2)), l2(f2(h2("@"), Q2)))))());
      }
      function ue2() {
        return e3.strict ? null : o2("obs-mbox-list", f2(b2(f2(p2(l2(D2)), h2(","))), N2, b2(f2(h2(","), l2(f2(N2, p2(D2))))))());
      }
      function he2() {
        return e3.strict ? null : o2("obs-addr-list", f2(b2(f2(p2(l2(D2)), h2(","))), F2, b2(f2(h2(","), l2(f2(F2, p2(D2))))))());
      }
      function fe2() {
        return e3.strict ? null : o2("obs-group-list", f2(b2(f2(p2(l2(D2)), h2(",")), 1), p2(l2(D2)))());
      }
      function de2() {
        return e3.strict ? null : o2("obs-local-part", f2(O2, b2(f2(h2("."), O2)))());
      }
      function le2() {
        return e3.strict ? null : o2("obs-domain", f2(U2, b2(f2(h2("."), U2)))());
      }
      function pe2() {
        return e3.strict ? null : o2("obs-dtext", d2(ee2, P2)());
      }
      function ye2(e4, t4) {
        var r4, i3, n3;
        if (t4 == null)
          return null;
        for (i3 = [t4]; i3.length > 0; ) {
          if ((n3 = i3.pop()).name === e4)
            return n3;
          for (r4 = n3.children.length - 1; r4 >= 0; r4 -= 1)
            i3.push(n3.children[r4]);
        }
        return null;
      }
      function be2(e4, t4) {
        var r4, i3, n3, a3, s3;
        if (t4 == null)
          return null;
        for (i3 = [t4], a3 = [], s3 = {}, r4 = 0; r4 < e4.length; r4 += 1)
          s3[e4[r4]] = true;
        for (; i3.length > 0; )
          if ((n3 = i3.pop()).name in s3)
            a3.push(n3);
          else
            for (r4 = n3.children.length - 1; r4 >= 0; r4 -= 1)
              i3.push(n3.children[r4]);
        return a3;
      }
      function me2(t4) {
        var r4, i3, n3, a3, s3;
        if (t4 === null)
          return null;
        for (r4 = [], i3 = be2(["group", "mailbox"], t4), n3 = 0; n3 < i3.length; n3 += 1)
          (a3 = i3[n3]).name === "group" ? r4.push(ge2(a3)) : a3.name === "mailbox" && r4.push(we2(a3));
        return s3 = {ast: t4, addresses: r4}, e3.simple && (s3 = function(e4) {
          var t5;
          if (e4 && e4.addresses)
            for (t5 = 0; t5 < e4.addresses.length; t5 += 1)
              delete e4.addresses[t5].node;
          return e4;
        }(s3)), e3.oneResult ? function(t5) {
          if (!t5)
            return null;
          if (!e3.partial && t5.addresses.length > 1)
            return null;
          return t5.addresses && t5.addresses[0];
        }(s3) : e3.simple ? s3 && s3.addresses : s3;
      }
      function ge2(e4) {
        var t4, r4 = ye2("display-name", e4), i3 = [], n3 = be2(["mailbox"], e4);
        for (t4 = 0; t4 < n3.length; t4 += 1)
          i3.push(we2(n3[t4]));
        return {node: e4, parts: {name: r4}, type: e4.name, name: ve2(r4), addresses: i3};
      }
      function we2(e4) {
        var t4 = ye2("display-name", e4), r4 = ye2("addr-spec", e4), i3 = function(e5, t5) {
          var r5, i4, n4, a4;
          if (t5 == null)
            return null;
          for (i4 = [t5], a4 = []; i4.length > 0; )
            for ((n4 = i4.pop()).name === e5 && a4.push(n4), r5 = n4.children.length - 1; r5 >= 0; r5 -= 1)
              i4.push(n4.children[r5]);
          return a4;
        }("cfws", e4), n3 = be2(["comment"], e4), a3 = ye2("local-part", r4), s3 = ye2("domain", r4);
        return {node: e4, parts: {name: t4, address: r4, local: a3, domain: s3, comments: i3}, type: e4.name, name: ve2(t4), address: ve2(r4), local: ve2(a3), domain: ve2(s3), comments: _e2(n3), groupName: ve2(e4.groupName)};
      }
      function ve2(e4) {
        return e4 != null ? e4.semantic : null;
      }
      function _e2(e4) {
        var t4 = "";
        if (e4)
          for (var r4 = 0; r4 < e4.length; r4 += 1)
            t4 += ve2(e4[r4]);
        return t4;
      }
      var ke2, Ae2, Se2, Ee2, Pe2;
      if ((e3 = i2(e3, {})) === null)
        return null;
      if (ke2 = e3.input, Pe2 = {address: F2, "address-list": V2, "angle-addr": L2, from: function() {
        return o2("from", d2(G2, V2)());
      }, group: W2, mailbox: N2, "mailbox-list": G2, "reply-to": function() {
        return o2("reply-to", V2());
      }, sender: function() {
        return o2("sender", d2(N2, F2)());
      }}[e3.startAt] || V2, !e3.strict) {
        if (a2(), e3.strict = true, Ee2 = Pe2(ke2), e3.partial || !t3())
          return me2(Ee2);
        e3.strict = false;
      }
      return a2(), Ee2 = Pe2(ke2), !e3.partial && t3() ? null : me2(Ee2);
    }
    function i2(e3, t3) {
      function r3(e4) {
        return Object.prototype.toString.call(e4) === "[object String]";
      }
      function i3(e4) {
        return e4 == null;
      }
      var n2, a2;
      if (r3(e3))
        e3 = {input: e3};
      else if (!function(e4) {
        return e4 === Object(e4);
      }(e3))
        return null;
      if (!r3(e3.input))
        return null;
      if (!t3)
        return null;
      for (a2 in n2 = {oneResult: false, partial: false, rejectTLD: false, rfc6532: false, simple: false, startAt: "address-list", strict: false, atInDisplayName: false})
        i3(e3[a2]) && (e3[a2] = i3(t3[a2]) ? n2[a2] : t3[a2]);
      return e3;
    }
    r2.parseOneAddress = function(e3) {
      return r2(i2(e3, {oneResult: true, rfc6532: true, simple: true, startAt: "address-list"}));
    }, r2.parseAddressList = function(e3) {
      return r2(i2(e3, {rfc6532: true, simple: true, startAt: "address-list"}));
    }, r2.parseFrom = function(e3) {
      return r2(i2(e3, {rfc6532: true, simple: true, startAt: "from"}));
    }, r2.parseSender = function(e3) {
      return r2(i2(e3, {oneResult: true, rfc6532: true, simple: true, startAt: "sender"}));
    }, r2.parseReplyTo = function(e3) {
      return r2(i2(e3, {rfc6532: true, simple: true, startAt: "reply-to"}));
    }, e2.exports = r2;
  }();
});
class vo {
  static get tag() {
    return re.packet.userID;
  }
  constructor() {
    this.userID = "", this.name = "", this.email = "", this.comment = "";
  }
  static fromObject(e2) {
    if (V.isString(e2) || e2.name && !V.isString(e2.name) || e2.email && !V.isEmailAddress(e2.email) || e2.comment && !V.isString(e2.comment))
      throw Error("Invalid user ID format");
    const t2 = new vo();
    Object.assign(t2, e2);
    const r2 = [];
    return t2.name && r2.push(t2.name), t2.comment && r2.push(`(${t2.comment})`), t2.email && r2.push(`<${t2.email}>`), t2.userID = r2.join(" "), t2;
  }
  read(e2, t2 = ie) {
    const r2 = V.decodeUTF8(e2);
    if (r2.length > t2.maxUserIDLength)
      throw Error("User ID string is too long");
    try {
      const {name: e3, address: t3, comments: i2} = wo.parseOneAddress({input: r2, atInDisplayName: true});
      this.comment = i2.replace(/^\(|\)$/g, ""), this.name = e3, this.email = t3;
    } catch (e3) {
    }
    this.userID = r2;
  }
  write() {
    return V.encodeUTF8(this.userID);
  }
  equals(e2) {
    return e2 && e2.userID === this.userID;
  }
}
class _o extends mo {
  static get tag() {
    return re.packet.secretSubkey;
  }
  constructor(e2 = new Date(), t2 = ie) {
    super(e2, t2);
  }
}
class So {
  constructor(e2) {
    this.packets = e2 || new Vs();
  }
  write() {
    return this.packets.write();
  }
  armor(e2 = ie) {
    return de(re.armor.signature, this.write(), void 0, void 0, void 0, e2);
  }
  getSigningKeyIDs() {
    return this.packets.map((e2) => e2.issuerKeyID);
  }
}
async function Po(e2, t2) {
  const r2 = new _o(e2.date, t2);
  return r2.packets = null, r2.algorithm = re.write(re.publicKey, e2.algorithm), await r2.generate(e2.rsaBits, e2.curve), await r2.computeFingerprintAndKeyID(), r2;
}
async function Mo(e2, t2, r2, i2, n2 = new Date(), a2) {
  let s2, o2;
  for (let c2 = e2.length - 1; c2 >= 0; c2--)
    try {
      (!s2 || e2[c2].created >= s2.created) && (await e2[c2].verify(t2, r2, i2, n2, void 0, a2), s2 = e2[c2]);
    } catch (e3) {
      o2 = e3;
    }
  if (!s2)
    throw V.wrapError(`Could not find valid ${re.read(re.signature, r2)} signature in key ${t2.getKeyID().toHex()}`.replace("certGeneric ", "self-").replace(/([a-z])([A-Z])/g, (e3, t3, r3) => t3 + " " + r3.toLowerCase()), o2);
  return s2;
}
function Co(e2, t2, r2 = new Date()) {
  const i2 = V.normalizeDate(r2);
  if (i2 !== null) {
    const r3 = To(e2, t2);
    return !(e2.created <= i2 && i2 < r3);
  }
  return false;
}
async function Ko(e2, t2, r2, i2) {
  const n2 = {};
  n2.key = t2, n2.bind = e2;
  const a2 = new Ls();
  return a2.signatureType = re.signature.subkeyBinding, a2.publicKeyAlgorithm = t2.algorithm, a2.hashAlgorithm = await Do(null, e2, void 0, void 0, i2), r2.sign ? (a2.keyFlags = [re.keyFlags.signData], a2.embeddedSignature = await Uo(n2, null, e2, {signatureType: re.signature.keyBinding}, r2.date, void 0, void 0, i2)) : a2.keyFlags = [re.keyFlags.encryptCommunication | re.keyFlags.encryptStorage], r2.keyExpirationTime > 0 && (a2.keyExpirationTime = r2.keyExpirationTime, a2.keyNeverExpires = false), await a2.sign(t2, n2, r2.date), a2;
}
async function Do(e2, t2, r2 = new Date(), i2 = {}, n2) {
  let a2 = n2.preferredHashAlgorithm, s2 = a2;
  if (e2) {
    const t3 = await e2.getPrimaryUser(r2, i2, n2);
    t3.selfCertification.preferredHashAlgorithms && ([s2] = t3.selfCertification.preferredHashAlgorithms, a2 = Ln.hash.getHashByteLength(a2) <= Ln.hash.getHashByteLength(s2) ? s2 : a2);
  }
  switch (Object.getPrototypeOf(t2)) {
    case mo.prototype:
    case ho.prototype:
    case _o.prototype:
    case yo.prototype:
      switch (t2.algorithm) {
        case re.publicKey.ecdh:
        case re.publicKey.ecdsa:
        case re.publicKey.eddsa:
          s2 = Ln.publicKey.elliptic.getPreferredHashAlgo(t2.publicParams.oid);
      }
  }
  return Ln.hash.getHashByteLength(a2) <= Ln.hash.getHashByteLength(s2) ? s2 : a2;
}
async function Ro(e2, t2 = [], r2 = new Date(), i2 = [], n2 = ie) {
  const a2 = {symmetric: re.symmetric.aes128, aead: re.aead.eax, compression: re.compression.uncompressed}[e2], s2 = {symmetric: n2.preferredSymmetricAlgorithm, aead: n2.preferredAEADAlgorithm, compression: n2.preferredCompressionAlgorithm}[e2], o2 = {symmetric: "preferredSymmetricAlgorithms", aead: "preferredAEADAlgorithms", compression: "preferredCompressionAlgorithms"}[e2];
  return (await Promise.all(t2.map(async function(e3, t3) {
    const a3 = (await e3.getPrimaryUser(r2, i2[t3], n2)).selfCertification[o2];
    return !!a3 && a3.indexOf(s2) >= 0;
  }))).every(Boolean) ? s2 : a2;
}
async function Uo(e2, t2, r2, i2, n2, a2, s2 = false, o2) {
  if (r2.isDummy())
    throw Error("Cannot sign with a gnu-dummy key.");
  if (!r2.isDecrypted())
    throw Error("Signing key is not decrypted.");
  const c2 = new Ls();
  return Object.assign(c2, i2), c2.publicKeyAlgorithm = r2.algorithm, c2.hashAlgorithm = await Do(t2, r2, n2, a2, o2), await c2.sign(r2, e2, n2, s2), c2;
}
async function Io(e2, t2, r2, i2 = new Date(), n2) {
  (e2 = e2[r2]) && (t2[r2].length ? await Promise.all(e2.map(async function(e3) {
    e3.isExpired(i2) || n2 && !await n2(e3) || t2[r2].some(function(t3) {
      return V.equalsUint8Array(t3.writeParams(), e3.writeParams());
    }) || t2[r2].push(e3);
  })) : t2[r2] = e2);
}
async function Bo(e2, t2, r2, i2, n2, a2, s2 = new Date(), o2) {
  a2 = a2 || e2;
  const c2 = [];
  return await Promise.all(i2.map(async function(e3) {
    try {
      n2 && !e3.issuerKeyID.equals(n2.issuerKeyID) || (await e3.verify(a2, t2, r2, o2.revocationsExpire ? s2 : null, false, o2), c2.push(e3.issuerKeyID));
    } catch (e4) {
    }
  })), n2 ? (n2.revoked = !!c2.some((e3) => e3.equals(n2.issuerKeyID)) || (n2.revoked || false), n2.revoked) : c2.length > 0;
}
function To(e2, t2) {
  let r2;
  return t2.keyNeverExpires === false && (r2 = e2.created.getTime() + 1e3 * t2.keyExpirationTime), r2 ? new Date(r2) : 1 / 0;
}
function zo(e2, t2 = {}) {
  switch (e2.type = e2.type || t2.type, e2.curve = e2.curve || t2.curve, e2.rsaBits = e2.rsaBits || t2.rsaBits, e2.keyExpirationTime = e2.keyExpirationTime !== void 0 ? e2.keyExpirationTime : t2.keyExpirationTime, e2.passphrase = V.isString(e2.passphrase) ? e2.passphrase : t2.passphrase, e2.date = e2.date || t2.date, e2.sign = e2.sign || false, e2.type) {
    case "ecc":
      try {
        e2.curve = re.write(re.curve, e2.curve);
      } catch (e3) {
        throw Error("Unknown curve");
      }
      e2.curve !== re.curve.ed25519 && e2.curve !== re.curve.curve25519 || (e2.curve = e2.sign ? re.curve.ed25519 : re.curve.curve25519), e2.sign ? e2.algorithm = e2.curve === re.curve.ed25519 ? re.publicKey.eddsa : re.publicKey.ecdsa : e2.algorithm = re.publicKey.ecdh;
      break;
    case "rsa":
      e2.algorithm = re.publicKey.rsaEncryptSign;
      break;
    default:
      throw Error("Unsupported key type " + e2.type);
  }
  return e2;
}
function qo(e2, t2) {
  const r2 = e2.algorithm;
  return r2 !== re.publicKey.rsaEncrypt && r2 !== re.publicKey.elgamal && r2 !== re.publicKey.ecdh && (!t2.keyFlags || (t2.keyFlags[0] & re.keyFlags.signData) != 0);
}
function Oo(e2, t2) {
  const r2 = e2.algorithm;
  return r2 !== re.publicKey.dsa && r2 !== re.publicKey.rsaSign && r2 !== re.publicKey.ecdsa && r2 !== re.publicKey.eddsa && (!t2.keyFlags || (t2.keyFlags[0] & re.keyFlags.encryptCommunication) != 0 || (t2.keyFlags[0] & re.keyFlags.encryptStorage) != 0);
}
function Fo(e2, t2) {
  return !!t2.allowInsecureDecryptionWithSigningKeys || (!e2.keyFlags || (e2.keyFlags[0] & re.keyFlags.encryptCommunication) != 0 || (e2.keyFlags[0] & re.keyFlags.encryptStorage) != 0);
}
function No(e2, t2) {
  const r2 = re.write(re.publicKey, e2.algorithm), i2 = e2.getAlgorithmInfo();
  if (t2.rejectPublicKeyAlgorithms.has(r2))
    throw Error(i2.algorithm + " keys are considered too weak.");
  switch (r2) {
    case re.publicKey.rsaEncryptSign:
    case re.publicKey.rsaSign:
    case re.publicKey.rsaEncrypt:
      if (i2.bits < t2.minRSABits)
        throw Error(`RSA keys shorter than ${t2.minRSABits} bits are considered too weak.`);
      break;
    case re.publicKey.ecdsa:
    case re.publicKey.eddsa:
    case re.publicKey.ecdh:
      if (t2.rejectCurves.has(i2.curve))
        throw Error(`Support for ${i2.algorithm} keys using curve ${i2.curve} is disabled.`);
  }
}
class jo {
  constructor(e2, t2) {
    this.userID = e2.constructor.tag === re.packet.userID ? e2 : null, this.userAttribute = e2.constructor.tag === re.packet.userAttribute ? e2 : null, this.selfCertifications = [], this.otherCertifications = [], this.revocationSignatures = [], this.mainKey = t2;
  }
  toPacketList() {
    const e2 = new Vs();
    return e2.push(this.userID || this.userAttribute), e2.push(...this.revocationSignatures), e2.push(...this.selfCertifications), e2.push(...this.otherCertifications), e2;
  }
  clone() {
    const e2 = new jo(this.userID || this.userAttribute, this.mainKey);
    return e2.selfCertifications = [...this.selfCertifications], e2.otherCertifications = [...this.otherCertifications], e2.revocationSignatures = [...this.revocationSignatures], e2;
  }
  async certify(e2, t2, r2) {
    const i2 = this.mainKey.keyPacket, n2 = {userID: this.userID, userAttribute: this.userAttribute, key: i2}, a2 = new jo(n2.userID || n2.userAttribute, this.mainKey);
    return a2.otherCertifications = await Promise.all(e2.map(async function(e3) {
      if (!e3.isPrivate())
        throw Error("Need private key for signing");
      if (e3.hasSameFingerprintAs(i2))
        throw Error("The user's own key can only be used for self-certifications");
      const a3 = await e3.getSigningKey(void 0, t2, void 0, r2);
      return Uo(n2, e3, a3.keyPacket, {signatureType: re.signature.certGeneric, keyFlags: [re.keyFlags.certifyKeys | re.keyFlags.signData]}, t2, void 0, void 0, r2);
    })), await a2.update(this, t2, r2), a2;
  }
  async isRevoked(e2, t2, r2 = new Date(), i2) {
    const n2 = this.mainKey.keyPacket;
    return Bo(n2, re.signature.certRevocation, {key: n2, userID: this.userID, userAttribute: this.userAttribute}, this.revocationSignatures, e2, t2, r2, i2);
  }
  async verifyCertificate(e2, t2, r2 = new Date(), i2) {
    const n2 = this, a2 = this.mainKey.keyPacket, s2 = {userID: this.userID, userAttribute: this.userAttribute, key: a2}, {issuerKeyID: o2} = e2, c2 = t2.filter((e3) => e3.getKeys(o2).length > 0);
    return c2.length === 0 ? null : (await Promise.all(c2.map(async (t3) => {
      const a3 = await t3.getSigningKey(o2, e2.created, void 0, i2);
      if (e2.revoked || await n2.isRevoked(e2, a3.keyPacket, r2, i2))
        throw Error("User certificate is revoked");
      try {
        await e2.verify(a3.keyPacket, re.signature.certGeneric, s2, r2, void 0, i2);
      } catch (e3) {
        throw V.wrapError("User certificate is invalid", e3);
      }
    })), true);
  }
  async verifyAllCertifications(e2, t2 = new Date(), r2) {
    const i2 = this, n2 = this.selfCertifications.concat(this.otherCertifications);
    return Promise.all(n2.map(async (n3) => ({keyID: n3.issuerKeyID, valid: await i2.verifyCertificate(n3, e2, t2, r2).catch(() => false)})));
  }
  async verify(e2 = new Date(), t2) {
    if (!this.selfCertifications.length)
      throw Error("No self-certifications found");
    const r2 = this, i2 = this.mainKey.keyPacket, n2 = {userID: this.userID, userAttribute: this.userAttribute, key: i2};
    let a2;
    for (let s2 = this.selfCertifications.length - 1; s2 >= 0; s2--)
      try {
        const a3 = this.selfCertifications[s2];
        if (a3.revoked || await r2.isRevoked(a3, void 0, e2, t2))
          throw Error("Self-certification is revoked");
        try {
          await a3.verify(i2, re.signature.certGeneric, n2, e2, void 0, t2);
        } catch (e3) {
          throw V.wrapError("Self-certification is invalid", e3);
        }
        return true;
      } catch (e3) {
        a2 = e3;
      }
    throw a2;
  }
  async update(e2, t2, r2) {
    const i2 = this.mainKey.keyPacket, n2 = {userID: this.userID, userAttribute: this.userAttribute, key: i2};
    await Io(e2, this, "selfCertifications", t2, async function(e3) {
      try {
        return await e3.verify(i2, re.signature.certGeneric, n2, t2, false, r2), true;
      } catch (e4) {
        return false;
      }
    }), await Io(e2, this, "otherCertifications", t2), await Io(e2, this, "revocationSignatures", t2, function(e3) {
      return Bo(i2, re.signature.certRevocation, n2, [e3], void 0, void 0, t2, r2);
    });
  }
}
class Lo {
  constructor(e2, t2) {
    this.keyPacket = e2, this.bindingSignatures = [], this.revocationSignatures = [], this.mainKey = t2;
  }
  toPacketList() {
    const e2 = new Vs();
    return e2.push(this.keyPacket), e2.push(...this.revocationSignatures), e2.push(...this.bindingSignatures), e2;
  }
  clone() {
    const e2 = new Lo(this.keyPacket, this.mainKey);
    return e2.bindingSignatures = [...this.bindingSignatures], e2.revocationSignatures = [...this.revocationSignatures], e2;
  }
  async isRevoked(e2, t2, r2 = new Date(), i2 = ie) {
    const n2 = this.mainKey.keyPacket;
    return Bo(n2, re.signature.subkeyRevocation, {key: n2, bind: this.keyPacket}, this.revocationSignatures, e2, t2, r2, i2);
  }
  async verify(e2 = new Date(), t2 = ie) {
    const r2 = this.mainKey.keyPacket, i2 = {key: r2, bind: this.keyPacket}, n2 = await Mo(this.bindingSignatures, r2, re.signature.subkeyBinding, i2, e2, t2);
    if (n2.revoked || await this.isRevoked(n2, null, e2, t2))
      throw Error("Subkey is revoked");
    if (Co(this.keyPacket, n2, e2))
      throw Error("Subkey is expired");
    return n2;
  }
  async getExpirationTime(e2 = new Date(), t2 = ie) {
    const r2 = this.mainKey.keyPacket, i2 = {key: r2, bind: this.keyPacket};
    let n2;
    try {
      n2 = await Mo(this.bindingSignatures, r2, re.signature.subkeyBinding, i2, e2, t2);
    } catch (e3) {
      return null;
    }
    const a2 = To(this.keyPacket, n2), s2 = n2.getExpirationTime();
    return a2 < s2 ? a2 : s2;
  }
  async update(e2, t2 = new Date(), r2 = ie) {
    const i2 = this.mainKey.keyPacket;
    if (!this.hasSameFingerprintAs(e2))
      throw Error("Subkey update method: fingerprints of subkeys not equal");
    this.keyPacket.constructor.tag === re.packet.publicSubkey && e2.keyPacket.constructor.tag === re.packet.secretSubkey && (this.keyPacket = e2.keyPacket);
    const n2 = this, a2 = {key: i2, bind: n2.keyPacket};
    await Io(e2, this, "bindingSignatures", t2, async function(e3) {
      for (let t3 = 0; t3 < n2.bindingSignatures.length; t3++)
        if (n2.bindingSignatures[t3].issuerKeyID.equals(e3.issuerKeyID))
          return e3.created > n2.bindingSignatures[t3].created && (n2.bindingSignatures[t3] = e3), false;
      try {
        return await e3.verify(i2, re.signature.subkeyBinding, a2, t2, void 0, r2), true;
      } catch (e4) {
        return false;
      }
    }), await Io(e2, this, "revocationSignatures", t2, function(e3) {
      return Bo(i2, re.signature.subkeyRevocation, a2, [e3], void 0, void 0, t2, r2);
    });
  }
  async revoke(e2, {flag: t2 = re.reasonForRevocation.noReason, string: r2 = ""} = {}, i2 = new Date(), n2 = ie) {
    const a2 = {key: e2, bind: this.keyPacket}, s2 = new Lo(this.keyPacket, this.mainKey);
    return s2.revocationSignatures.push(await Uo(a2, null, e2, {signatureType: re.signature.subkeyRevocation, reasonForRevocationFlag: re.write(re.reasonForRevocation, t2), reasonForRevocationString: r2}, i2, void 0, false, n2)), await s2.update(this), s2;
  }
  hasSameFingerprintAs(e2) {
    return this.keyPacket.hasSameFingerprintAs(e2.keyPacket || e2);
  }
}
["getKeyID", "getFingerprint", "getAlgorithmInfo", "getCreationTime", "isDecrypted"].forEach((e2) => {
  Lo.prototype[e2] = function() {
    return this.keyPacket[e2]();
  };
});
const Wo = /* @__PURE__ */ V.constructAllowedPackets([Ls]), Ho = new Set([re.packet.publicKey, re.packet.privateKey]), Go = new Set([re.packet.publicKey, re.packet.privateKey, re.packet.publicSubkey, re.packet.privateSubkey]);
class Vo {
  packetListToStructure(e2, t2 = new Set()) {
    let r2, i2, n2, a2;
    for (const s2 of e2) {
      if (s2 instanceof gi) {
        Go.has(s2.tag) && !a2 && (a2 = Ho.has(s2.tag) ? Ho : Go);
        continue;
      }
      const e3 = s2.constructor.tag;
      if (a2) {
        if (!a2.has(e3))
          continue;
        a2 = null;
      }
      if (t2.has(e3))
        throw Error("Unexpected packet type: " + e3);
      switch (e3) {
        case re.packet.publicKey:
        case re.packet.secretKey:
          if (this.keyPacket)
            throw Error("Key block contains multiple keys");
          if (this.keyPacket = s2, i2 = this.getKeyID(), !i2)
            throw Error("Missing Key ID");
          break;
        case re.packet.userID:
        case re.packet.userAttribute:
          r2 = new jo(s2, this), this.users.push(r2);
          break;
        case re.packet.publicSubkey:
        case re.packet.secretSubkey:
          r2 = null, n2 = new Lo(s2, this), this.subkeys.push(n2);
          break;
        case re.packet.signature:
          switch (s2.signatureType) {
            case re.signature.certGeneric:
            case re.signature.certPersona:
            case re.signature.certCasual:
            case re.signature.certPositive:
              if (!r2) {
                V.printDebug("Dropping certification signatures without preceding user packet");
                continue;
              }
              s2.issuerKeyID.equals(i2) ? r2.selfCertifications.push(s2) : r2.otherCertifications.push(s2);
              break;
            case re.signature.certRevocation:
              r2 ? r2.revocationSignatures.push(s2) : this.directSignatures.push(s2);
              break;
            case re.signature.key:
              this.directSignatures.push(s2);
              break;
            case re.signature.subkeyBinding:
              if (!n2) {
                V.printDebug("Dropping subkey binding signature without preceding subkey packet");
                continue;
              }
              n2.bindingSignatures.push(s2);
              break;
            case re.signature.keyRevocation:
              this.revocationSignatures.push(s2);
              break;
            case re.signature.subkeyRevocation:
              if (!n2) {
                V.printDebug("Dropping subkey revocation signature without preceding subkey packet");
                continue;
              }
              n2.revocationSignatures.push(s2);
          }
      }
    }
  }
  toPacketList() {
    const e2 = new Vs();
    return e2.push(this.keyPacket), e2.push(...this.revocationSignatures), e2.push(...this.directSignatures), this.users.map((t2) => e2.push(...t2.toPacketList())), this.subkeys.map((t2) => e2.push(...t2.toPacketList())), e2;
  }
  clone(e2 = false) {
    const t2 = new this.constructor(this.toPacketList());
    return e2 && t2.getKeys().forEach((e3) => {
      if (e3.keyPacket = Object.create(Object.getPrototypeOf(e3.keyPacket), Object.getOwnPropertyDescriptors(e3.keyPacket)), !e3.keyPacket.isDecrypted())
        return;
      const t3 = {};
      Object.keys(e3.keyPacket.privateParams).forEach((r2) => {
        t3[r2] = new Uint8Array(e3.keyPacket.privateParams[r2]);
      }), e3.keyPacket.privateParams = t3;
    }), t2;
  }
  getSubkeys(e2 = null) {
    return this.subkeys.filter((t2) => !e2 || t2.getKeyID().equals(e2, true));
  }
  getKeys(e2 = null) {
    const t2 = [];
    return e2 && !this.getKeyID().equals(e2, true) || t2.push(this), t2.concat(this.getSubkeys(e2));
  }
  getKeyIDs() {
    return this.getKeys().map((e2) => e2.getKeyID());
  }
  getUserIDs() {
    return this.users.map((e2) => e2.userID ? e2.userID.userID : null).filter((e2) => e2 !== null);
  }
  write() {
    return this.toPacketList().write();
  }
  async getSigningKey(e2 = null, t2 = new Date(), r2 = {}, i2 = ie) {
    await this.verifyPrimaryKey(t2, r2, i2);
    const n2 = this.keyPacket, a2 = this.subkeys.slice().sort((e3, t3) => t3.keyPacket.created - e3.keyPacket.created);
    let s2;
    for (const r3 of a2)
      if (!e2 || r3.getKeyID().equals(e2))
        try {
          await r3.verify(t2, i2);
          const e3 = {key: n2, bind: r3.keyPacket}, a3 = await Mo(r3.bindingSignatures, n2, re.signature.subkeyBinding, e3, t2, i2);
          if (!qo(r3.keyPacket, a3))
            continue;
          if (!a3.embeddedSignature)
            throw Error("Missing embedded signature");
          return await Mo([a3.embeddedSignature], r3.keyPacket, re.signature.keyBinding, e3, t2, i2), No(r3.keyPacket, i2), r3;
        } catch (e3) {
          s2 = e3;
        }
    try {
      const a3 = await this.getPrimaryUser(t2, r2, i2);
      if ((!e2 || n2.getKeyID().equals(e2)) && qo(n2, a3.selfCertification))
        return No(n2, i2), this;
    } catch (e3) {
      s2 = e3;
    }
    throw V.wrapError("Could not find valid signing key packet in key " + this.getKeyID().toHex(), s2);
  }
  async getEncryptionKey(e2, t2 = new Date(), r2 = {}, i2 = ie) {
    await this.verifyPrimaryKey(t2, r2, i2);
    const n2 = this.keyPacket, a2 = this.subkeys.slice().sort((e3, t3) => t3.keyPacket.created - e3.keyPacket.created);
    let s2;
    for (const r3 of a2)
      if (!e2 || r3.getKeyID().equals(e2))
        try {
          await r3.verify(t2, i2);
          const e3 = {key: n2, bind: r3.keyPacket}, a3 = await Mo(r3.bindingSignatures, n2, re.signature.subkeyBinding, e3, t2, i2);
          if (Oo(r3.keyPacket, a3))
            return No(r3.keyPacket, i2), r3;
        } catch (e3) {
          s2 = e3;
        }
    try {
      const a3 = await this.getPrimaryUser(t2, r2, i2);
      if ((!e2 || n2.getKeyID().equals(e2)) && Oo(n2, a3.selfCertification))
        return No(n2, i2), this;
    } catch (e3) {
      s2 = e3;
    }
    throw V.wrapError("Could not find valid encryption key packet in key " + this.getKeyID().toHex(), s2);
  }
  async isRevoked(e2, t2, r2 = new Date(), i2 = ie) {
    return Bo(this.keyPacket, re.signature.keyRevocation, {key: this.keyPacket}, this.revocationSignatures, e2, t2, r2, i2);
  }
  async verifyPrimaryKey(e2 = new Date(), t2 = {}, r2 = ie) {
    const i2 = this.keyPacket;
    if (await this.isRevoked(null, null, e2, r2))
      throw Error("Primary key is revoked");
    const {selfCertification: n2} = await this.getPrimaryUser(e2, t2, r2);
    if (Co(i2, n2, e2))
      throw Error("Primary key is expired");
    const a2 = await Mo(this.directSignatures, i2, re.signature.key, {key: i2}, e2, r2).catch(() => {
    });
    if (a2 && Co(i2, a2, e2))
      throw Error("Primary key is expired");
  }
  async getExpirationTime(e2, t2 = ie) {
    let r2;
    try {
      const {selfCertification: i2} = await this.getPrimaryUser(null, e2, t2), n2 = To(this.keyPacket, i2), a2 = i2.getExpirationTime(), s2 = await Mo(this.directSignatures, this.keyPacket, re.signature.key, {key: this.keyPacket}, null, t2).catch(() => {
      });
      if (s2) {
        const e3 = To(this.keyPacket, s2);
        r2 = Math.min(n2, a2, e3);
      } else
        r2 = n2 < a2 ? n2 : a2;
    } catch (e3) {
      r2 = null;
    }
    return V.normalizeDate(r2);
  }
  async getPrimaryUser(e2 = new Date(), t2 = {}, r2 = ie) {
    const i2 = this.keyPacket, n2 = [];
    let a2;
    for (let s3 = 0; s3 < this.users.length; s3++)
      try {
        const a3 = this.users[s3];
        if (!a3.userID)
          continue;
        if (t2.name !== void 0 && a3.userID.name !== t2.name || t2.email !== void 0 && a3.userID.email !== t2.email || t2.comment !== void 0 && a3.userID.comment !== t2.comment)
          throw Error("Could not find user that matches that user ID");
        const o3 = {userID: a3.userID, key: i2}, c3 = await Mo(a3.selfCertifications, i2, re.signature.certGeneric, o3, e2, r2);
        n2.push({index: s3, user: a3, selfCertification: c3});
      } catch (e3) {
        a2 = e3;
      }
    if (!n2.length)
      throw a2 || Error("Could not find primary user");
    await Promise.all(n2.map(async function(t3) {
      return t3.user.revoked || t3.user.isRevoked(t3.selfCertification, null, e2, r2);
    }));
    const s2 = n2.sort(function(e3, t3) {
      const r3 = e3.selfCertification, i3 = t3.selfCertification;
      return i3.revoked - r3.revoked || r3.isPrimaryUserID - i3.isPrimaryUserID || r3.created - i3.created;
    }).pop(), {user: o2, selfCertification: c2} = s2;
    if (c2.revoked || await o2.isRevoked(c2, null, e2, r2))
      throw Error("Primary user is revoked");
    return s2;
  }
  async update(e2, t2 = new Date(), r2 = ie) {
    if (!this.hasSameFingerprintAs(e2))
      throw Error("Primary key fingerprints must be equal to update the key");
    if (!this.isPrivate() && e2.isPrivate()) {
      if (!(this.subkeys.length === e2.subkeys.length && this.subkeys.every((t3) => e2.subkeys.some((e3) => t3.hasSameFingerprintAs(e3)))))
        throw Error("Cannot update public key with private key if subkeys mismatch");
      return e2.update(this, r2);
    }
    const i2 = this.clone();
    return await Io(e2, i2, "revocationSignatures", t2, (n2) => Bo(i2.keyPacket, re.signature.keyRevocation, i2, [n2], null, e2.keyPacket, t2, r2)), await Io(e2, i2, "directSignatures", t2), await Promise.all(e2.users.map(async (e3) => {
      const n2 = i2.users.filter((t3) => e3.userID && e3.userID.equals(t3.userID) || e3.userAttribute && e3.userAttribute.equals(t3.userAttribute));
      if (n2.length > 0)
        await Promise.all(n2.map((i3) => i3.update(e3, t2, r2)));
      else {
        const t3 = e3.clone();
        t3.mainKey = i2, i2.users.push(t3);
      }
    })), await Promise.all(e2.subkeys.map(async (e3) => {
      const n2 = i2.subkeys.filter((t3) => t3.hasSameFingerprintAs(e3));
      if (n2.length > 0)
        await Promise.all(n2.map((i3) => i3.update(e3, t2, r2)));
      else {
        const t3 = e3.clone();
        t3.mainKey = i2, i2.subkeys.push(t3);
      }
    })), i2;
  }
  async getRevocationCertificate(e2 = new Date(), t2 = ie) {
    const r2 = {key: this.keyPacket}, i2 = await Mo(this.revocationSignatures, this.keyPacket, re.signature.keyRevocation, r2, e2, t2), n2 = new Vs();
    return n2.push(i2), de(re.armor.publicKey, n2.write(), null, null, "This is a revocation certificate");
  }
  async applyRevocationCertificate(e2, t2 = new Date(), r2 = ie) {
    const i2 = await fe(e2, r2), n2 = (await Vs.fromBinary(i2.data, Wo, r2)).findPacket(re.packet.signature);
    if (!n2 || n2.signatureType !== re.signature.keyRevocation)
      throw Error("Could not find revocation signature packet");
    if (!n2.issuerKeyID.equals(this.getKeyID()))
      throw Error("Revocation signature does not match key");
    try {
      await n2.verify(this.keyPacket, re.signature.keyRevocation, {key: this.keyPacket}, t2, void 0, r2);
    } catch (e3) {
      throw V.wrapError("Could not verify revocation signature", e3);
    }
    const a2 = this.clone();
    return a2.revocationSignatures.push(n2), a2;
  }
  async signPrimaryUser(e2, t2, r2, i2 = ie) {
    const {index: n2, user: a2} = await this.getPrimaryUser(t2, r2, i2), s2 = await a2.certify(e2, t2, i2), o2 = this.clone();
    return o2.users[n2] = s2, o2;
  }
  async signAllUsers(e2, t2 = new Date(), r2 = ie) {
    const i2 = this.clone();
    return i2.users = await Promise.all(this.users.map(function(i3) {
      return i3.certify(e2, t2, r2);
    })), i2;
  }
  async verifyPrimaryUser(e2, t2 = new Date(), r2, i2 = ie) {
    const n2 = this.keyPacket, {user: a2} = await this.getPrimaryUser(t2, r2, i2);
    return e2 ? await a2.verifyAllCertifications(e2, t2, i2) : [{keyID: n2.getKeyID(), valid: await a2.verify(t2, i2).catch(() => false)}];
  }
  async verifyAllUsers(e2, t2 = new Date(), r2 = ie) {
    const i2 = this.keyPacket, n2 = [];
    return await Promise.all(this.users.map(async (a2) => {
      const s2 = e2 ? await a2.verifyAllCertifications(e2, t2, r2) : [{keyID: i2.getKeyID(), valid: await a2.verify(t2, r2).catch(() => false)}];
      n2.push(...s2.map((e3) => ({userID: a2.userID.userID, keyID: e3.keyID, valid: e3.valid})));
    })), n2;
  }
}
function $o(e2) {
  for (const t2 of e2)
    switch (t2.constructor.tag) {
      case re.packet.secretKey:
        return new Yo(e2);
      case re.packet.publicKey:
        return new Zo(e2);
    }
  throw Error("No key packet found");
}
["getKeyID", "getFingerprint", "getAlgorithmInfo", "getCreationTime", "hasSameFingerprintAs"].forEach((e2) => {
  Vo.prototype[e2] = Lo.prototype[e2];
});
class Zo extends Vo {
  constructor(e2) {
    if (super(), this.keyPacket = null, this.revocationSignatures = [], this.directSignatures = [], this.users = [], this.subkeys = [], e2 && (this.packetListToStructure(e2, new Set([re.packet.secretKey, re.packet.secretSubkey])), !this.keyPacket))
      throw Error("Invalid key: missing public-key packet");
  }
  isPrivate() {
    return false;
  }
  toPublic() {
    return this;
  }
  armor(e2 = ie) {
    return de(re.armor.publicKey, this.toPacketList().write(), void 0, void 0, void 0, e2);
  }
}
class Yo extends Zo {
  constructor(e2) {
    if (super(), this.packetListToStructure(e2, new Set([re.packet.publicKey, re.packet.publicSubkey])), !this.keyPacket)
      throw Error("Invalid key: missing private-key packet");
  }
  isPrivate() {
    return true;
  }
  toPublic() {
    const e2 = new Vs(), t2 = this.toPacketList();
    for (const r2 of t2)
      switch (r2.constructor.tag) {
        case re.packet.secretKey: {
          const t3 = ho.fromSecretKeyPacket(r2);
          e2.push(t3);
          break;
        }
        case re.packet.secretSubkey: {
          const t3 = yo.fromSecretSubkeyPacket(r2);
          e2.push(t3);
          break;
        }
        default:
          e2.push(r2);
      }
    return new Zo(e2);
  }
  armor(e2 = ie) {
    return de(re.armor.privateKey, this.toPacketList().write(), void 0, void 0, void 0, e2);
  }
  async getDecryptionKeys(e2, t2 = new Date(), r2 = {}, i2 = ie) {
    const n2 = this.keyPacket, a2 = [];
    for (let r3 = 0; r3 < this.subkeys.length; r3++)
      if (!e2 || this.subkeys[r3].getKeyID().equals(e2, true))
        try {
          const e3 = {key: n2, bind: this.subkeys[r3].keyPacket};
          Fo(await Mo(this.subkeys[r3].bindingSignatures, n2, re.signature.subkeyBinding, e3, t2, i2), i2) && a2.push(this.subkeys[r3]);
        } catch (e3) {
        }
    const s2 = await this.getPrimaryUser(t2, r2, i2);
    return e2 && !n2.getKeyID().equals(e2, true) || !Fo(s2.selfCertification, i2) || a2.push(this), a2;
  }
  isDecrypted() {
    return this.getKeys().some(({keyPacket: e2}) => e2.isDecrypted());
  }
  async validate(e2 = ie) {
    if (!this.isPrivate())
      throw Error("Cannot validate a public key");
    let t2;
    if (this.keyPacket.isDummy()) {
      const r2 = await this.getSigningKey(null, null, void 0, {...e2, rejectPublicKeyAlgorithms: new Set(), minRSABits: 0});
      r2 && !r2.keyPacket.isDummy() && (t2 = r2.keyPacket);
    } else
      t2 = this.keyPacket;
    if (t2)
      return t2.validate();
    {
      const e3 = this.getKeys();
      if (e3.map((e4) => e4.keyPacket.isDummy()).every(Boolean))
        throw Error("Cannot validate an all-gnu-dummy key");
      return Promise.all(e3.map(async (e4) => e4.keyPacket.validate()));
    }
  }
  clearPrivateParams() {
    this.getKeys().forEach(({keyPacket: e2}) => {
      e2.isDecrypted() && e2.clearPrivateParams();
    });
  }
  async revoke({flag: e2 = re.reasonForRevocation.noReason, string: t2 = ""} = {}, r2 = new Date(), i2 = ie) {
    if (!this.isPrivate())
      throw Error("Need private key for revoking");
    const n2 = {key: this.keyPacket}, a2 = this.clone();
    return a2.revocationSignatures.push(await Uo(n2, null, this.keyPacket, {signatureType: re.signature.keyRevocation, reasonForRevocationFlag: re.write(re.reasonForRevocation, e2), reasonForRevocationString: t2}, r2, void 0, void 0, i2)), a2;
  }
  async addSubkey(e2 = {}) {
    const t2 = {...ie, ...e2.config};
    if (e2.passphrase)
      throw Error("Subkey could not be encrypted here, please encrypt whole key");
    if (e2.rsaBits < t2.minRSABits)
      throw Error(`rsaBits should be at least ${t2.minRSABits}, got: ${e2.rsaBits}`);
    const r2 = this.keyPacket;
    if (r2.isDummy())
      throw Error("Cannot add subkey to gnu-dummy primary key");
    if (!r2.isDecrypted())
      throw Error("Key is not decrypted");
    const i2 = r2.getAlgorithmInfo();
    i2.type = i2.curve ? "ecc" : "rsa", i2.rsaBits = i2.bits || 4096, i2.curve = i2.curve || "curve25519", e2 = zo(e2, i2);
    const n2 = await Po(e2);
    No(n2, t2);
    const a2 = await Ko(n2, r2, e2, t2), s2 = this.toPacketList();
    return s2.push(n2, a2), new Yo(s2);
  }
}
const Xo = /* @__PURE__ */ V.constructAllowedPackets([ho, yo, mo, _o, vo, bo, Ls]);
async function Jo({armoredKey: e2, binaryKey: t2, config: r2, ...i2}) {
  if (r2 = {...ie, ...r2}, !e2 && !t2)
    throw Error("readKey: must pass options object containing `armoredKey` or `binaryKey`");
  if (e2 && !V.isString(e2))
    throw Error("readKey: options.armoredKey must be a string");
  if (t2 && !V.isUint8Array(t2))
    throw Error("readKey: options.binaryKey must be a Uint8Array");
  const n2 = Object.keys(i2);
  if (n2.length > 0)
    throw Error("Unknown option: " + n2.join(", "));
  let a2;
  if (e2) {
    const {type: t3, data: i3} = await fe(e2, r2);
    if (t3 !== re.armor.publicKey && t3 !== re.armor.privateKey)
      throw Error("Armored text not of type key");
    a2 = i3;
  } else
    a2 = t2;
  return $o(await Vs.fromBinary(a2, Xo, r2));
}
const nc = /* @__PURE__ */ V.constructAllowedPackets([uo]), ac = /* @__PURE__ */ V.constructAllowedPackets([Ls]);
class sc {
  constructor(e2) {
    this.packets = e2 || new Vs();
  }
  getEncryptionKeyIDs() {
    const e2 = [];
    return this.packets.filterByTag(re.packet.publicKeyEncryptedSessionKey).forEach(function(t2) {
      e2.push(t2.publicKeyID);
    }), e2;
  }
  getSigningKeyIDs() {
    const e2 = this.unwrapCompressed(), t2 = e2.packets.filterByTag(re.packet.onePassSignature);
    if (t2.length > 0)
      return t2.map((e3) => e3.issuerKeyID);
    return e2.packets.filterByTag(re.packet.signature).map((e3) => e3.issuerKeyID);
  }
  async decrypt(e2, t2, r2, i2 = new Date(), n2 = ie) {
    const a2 = r2 || await this.decryptSessionKeys(e2, t2, i2, n2), s2 = this.packets.filterByTag(re.packet.symmetricallyEncryptedData, re.packet.symEncryptedIntegrityProtectedData, re.packet.aeadEncryptedData);
    if (s2.length === 0)
      throw Error("No encrypted data found");
    const o2 = s2[0];
    let c2 = null;
    const u2 = Promise.all(a2.map(async ({algorithm: e3, data: t3}) => {
      if (!V.isUint8Array(t3) || !V.isString(e3))
        throw Error("Invalid session key for decryption.");
      try {
        const r3 = re.write(re.symmetric, e3);
        await o2.decrypt(r3, t3, n2);
      } catch (e4) {
        V.printDebugError(e4), c2 = e4;
      }
    }));
    if (L(o2.encrypted), o2.encrypted = null, await u2, !o2.packets || !o2.packets.length)
      throw c2 || Error("Decryption failed.");
    const h2 = new sc(o2.packets);
    return o2.packets = new Vs(), h2;
  }
  async decryptSessionKeys(e2, t2, r2 = new Date(), i2 = ie) {
    let n2, a2 = [];
    if (t2) {
      const e3 = this.packets.filterByTag(re.packet.symEncryptedSessionKey);
      if (e3.length === 0)
        throw Error("No symmetrically encrypted session key packet found.");
      await Promise.all(t2.map(async function(t3, r3) {
        let n3;
        n3 = r3 ? await Vs.fromBinary(e3.write(), nc, i2) : e3, await Promise.all(n3.map(async function(e4) {
          try {
            await e4.decrypt(t3), a2.push(e4);
          } catch (e5) {
            V.printDebugError(e5);
          }
        }));
      }));
    } else {
      if (!e2)
        throw Error("No key or password specified.");
      {
        const t3 = this.packets.filterByTag(re.packet.publicKeyEncryptedSessionKey);
        if (t3.length === 0)
          throw Error("No public key encrypted session key packet found.");
        await Promise.all(t3.map(async function(t4) {
          await Promise.all(e2.map(async function(e3) {
            let s2 = [re.symmetric.aes256, re.symmetric.aes128, re.symmetric.tripledes, re.symmetric.cast5];
            try {
              const t5 = await e3.getPrimaryUser(r2, void 0, i2);
              t5.selfCertification.preferredSymmetricAlgorithms && (s2 = s2.concat(t5.selfCertification.preferredSymmetricAlgorithms));
            } catch (e4) {
            }
            const o2 = (await e3.getDecryptionKeys(t4.publicKeyID, null, void 0, i2)).map((e4) => e4.keyPacket);
            await Promise.all(o2.map(async function(e4) {
              if (!e4 || e4.isDummy())
                return;
              if (!e4.isDecrypted())
                throw Error("Decryption key is not decrypted.");
              if (i2.constantTimePKCS1Decryption && (t4.publicKeyAlgorithm === re.publicKey.rsaEncrypt || t4.publicKeyAlgorithm === re.publicKey.rsaEncryptSign || t4.publicKeyAlgorithm === re.publicKey.rsaSign || t4.publicKeyAlgorithm === re.publicKey.elgamal)) {
                const r3 = t4.write();
                await Promise.all(Array.from(i2.constantTimePKCS1DecryptionSupportedSymmetricAlgorithms).map(async (t5) => {
                  const i3 = new oo();
                  i3.read(r3);
                  const s3 = {sessionKeyAlgorithm: t5, sessionKey: await Ln.generateSessionKey(t5)};
                  try {
                    await i3.decrypt(e4, s3), a2.push(i3);
                  } catch (e5) {
                    V.printDebugError(e5), n2 = e5;
                  }
                }));
              } else
                try {
                  if (await t4.decrypt(e4), !s2.includes(re.write(re.symmetric, t4.sessionKeyAlgorithm)))
                    throw Error("A non-preferred symmetric algorithm was used.");
                  a2.push(t4);
                } catch (e5) {
                  V.printDebugError(e5), n2 = e5;
                }
            }));
          })), L(t4.encrypted), t4.encrypted = null;
        }));
      }
    }
    if (a2.length > 0) {
      if (a2.length > 1) {
        const e3 = new Set();
        a2 = a2.filter((t3) => {
          const r3 = t3.sessionKeyAlgorithm + V.uint8ArrayToString(t3.sessionKey);
          return !e3.has(r3) && (e3.add(r3), true);
        });
      }
      return a2.map((e3) => ({data: e3.sessionKey, algorithm: re.read(re.symmetric, e3.sessionKeyAlgorithm)}));
    }
    throw n2 || Error("Session key decryption failed.");
  }
  getLiteralData() {
    const e2 = this.unwrapCompressed().packets.findPacket(re.packet.literalData);
    return e2 && e2.getBytes() || null;
  }
  getFilename() {
    const e2 = this.unwrapCompressed().packets.findPacket(re.packet.literalData);
    return e2 && e2.getFilename() || null;
  }
  getText() {
    const e2 = this.unwrapCompressed().packets.findPacket(re.packet.literalData);
    return e2 ? e2.getText() : null;
  }
  static async generateSessionKey(e2 = [], t2 = new Date(), r2 = [], i2 = ie) {
    const n2 = await Ro("symmetric", e2, t2, r2, i2), a2 = re.read(re.symmetric, n2), s2 = i2.aeadProtect && await async function(e3, t3 = new Date(), r3 = [], i3 = ie) {
      let n3 = true;
      return await Promise.all(e3.map(async function(e4, a3) {
        const s3 = await e4.getPrimaryUser(t3, r3[a3], i3);
        s3.selfCertification.features && s3.selfCertification.features[0] & re.features.aead || (n3 = false);
      })), n3;
    }(e2, t2, r2, i2) ? re.read(re.aead, await Ro("aead", e2, t2, r2, i2)) : void 0;
    return {data: await Ln.generateSessionKey(n2), algorithm: a2, aeadAlgorithm: s2};
  }
  async encrypt(e2, t2, r2, i2 = false, n2 = [], a2 = new Date(), s2 = [], o2 = ie) {
    if (r2) {
      if (!V.isUint8Array(r2.data) || !V.isString(r2.algorithm))
        throw Error("Invalid session key for encryption.");
    } else if (e2 && e2.length)
      r2 = await sc.generateSessionKey(e2, a2, s2, o2);
    else {
      if (!t2 || !t2.length)
        throw Error("No keys, passwords, or session key provided.");
      r2 = await sc.generateSessionKey(void 0, void 0, void 0, o2);
    }
    const {data: c2, algorithm: u2, aeadAlgorithm: h2} = r2, f2 = await sc.encryptSessionKey(c2, u2, h2, e2, t2, i2, n2, a2, s2, o2);
    let d2;
    h2 ? (d2 = new so(), d2.aeadAlgorithm = re.write(re.aead, h2)) : d2 = new no(), d2.packets = this.packets;
    const l2 = re.write(re.symmetric, u2);
    return await d2.encrypt(l2, c2, o2), f2.packets.push(d2), d2.packets = new Vs(), f2;
  }
  static async encryptSessionKey(e2, t2, r2, i2, n2, a2 = false, s2 = [], o2 = new Date(), c2 = [], u2 = ie) {
    const h2 = new Vs(), f2 = re.write(re.symmetric, t2), d2 = r2 && re.write(re.aead, r2);
    if (i2) {
      const t3 = await Promise.all(i2.map(async function(t4, r3) {
        const i3 = await t4.getEncryptionKey(s2[r3], o2, c2, u2), n3 = new oo();
        return n3.publicKeyID = a2 ? le.wildcard() : i3.getKeyID(), n3.publicKeyAlgorithm = i3.keyPacket.algorithm, n3.sessionKey = e2, n3.sessionKeyAlgorithm = f2, await n3.encrypt(i3.keyPacket), delete n3.sessionKey, n3;
      }));
      h2.push(...t3);
    }
    if (n2) {
      const t3 = async function(e3, t4) {
        try {
          return await e3.decrypt(t4), 1;
        } catch (e4) {
          return 0;
        }
      }, r3 = (e3, t4) => e3 + t4, i3 = async function(e3, a4, s3, o3) {
        const c3 = new uo(u2);
        if (c3.sessionKey = e3, c3.sessionKeyAlgorithm = a4, s3 && (c3.aeadAlgorithm = s3), await c3.encrypt(o3, u2), u2.passwordCollisionCheck) {
          if ((await Promise.all(n2.map((e4) => t3(c3, e4)))).reduce(r3) !== 1)
            return i3(e3, a4, o3);
        }
        return delete c3.sessionKey, c3;
      }, a3 = await Promise.all(n2.map((t4) => i3(e2, f2, d2, t4)));
      h2.push(...a3);
    }
    return new sc(h2);
  }
  async sign(e2 = [], t2 = null, r2 = [], i2 = new Date(), n2 = [], a2 = ie) {
    const s2 = new Vs(), o2 = this.packets.findPacket(re.packet.literalData);
    if (!o2)
      throw Error("No literal data packet to sign.");
    let c2, u2;
    const h2 = o2.text === null ? re.signature.binary : re.signature.text;
    if (t2)
      for (u2 = t2.packets.filterByTag(re.packet.signature), c2 = u2.length - 1; c2 >= 0; c2--) {
        const t3 = u2[c2], r3 = new Hs();
        r3.signatureType = t3.signatureType, r3.hashAlgorithm = t3.hashAlgorithm, r3.publicKeyAlgorithm = t3.publicKeyAlgorithm, r3.issuerKeyID = t3.issuerKeyID, e2.length || c2 !== 0 || (r3.flags = 1), s2.push(r3);
      }
    return await Promise.all(Array.from(e2).reverse().map(async function(t3, s3) {
      if (!t3.isPrivate())
        throw Error("Need private key for signing");
      const o3 = r2[e2.length - 1 - s3], c3 = await t3.getSigningKey(o3, i2, n2, a2), u3 = new Hs();
      return u3.signatureType = h2, u3.hashAlgorithm = await Do(t3, c3.keyPacket, i2, n2, a2), u3.publicKeyAlgorithm = c3.keyPacket.algorithm, u3.issuerKeyID = c3.getKeyID(), s3 === e2.length - 1 && (u3.flags = 1), u3;
    })).then((e3) => {
      e3.forEach((e4) => s2.push(e4));
    }), s2.push(o2), s2.push(...await oc(o2, e2, t2, r2, i2, n2, false, a2)), new sc(s2);
  }
  compress(e2, t2 = ie) {
    if (e2 === re.compression.uncompressed)
      return this;
    const r2 = new Zs(t2);
    r2.algorithm = e2, r2.packets = this.packets;
    const i2 = new Vs();
    return i2.push(r2), new sc(i2);
  }
  async signDetached(e2 = [], t2 = null, r2 = [], i2 = new Date(), n2 = [], a2 = ie) {
    const s2 = this.packets.findPacket(re.packet.literalData);
    if (!s2)
      throw Error("No literal data packet to sign.");
    return new So(await oc(s2, e2, t2, r2, i2, n2, true, a2));
  }
  async verify(e2, t2 = new Date(), r2 = ie) {
    const i2 = this.unwrapCompressed(), n2 = i2.packets.filterByTag(re.packet.literalData);
    if (n2.length !== 1)
      throw Error("Can only verify message with one literal data packet.");
    s(i2.packets.stream) && i2.packets.push(...await j(i2.packets.stream, (e3) => e3 || []));
    const a2 = i2.packets.filterByTag(re.packet.onePassSignature).reverse(), o2 = i2.packets.filterByTag(re.packet.signature);
    return a2.length && !o2.length && V.isStream(i2.packets.stream) && !s(i2.packets.stream) ? (await Promise.all(a2.map(async (e3) => {
      e3.correspondingSig = new Promise((t3, r3) => {
        e3.correspondingSigResolve = t3, e3.correspondingSigReject = r3;
      }), e3.signatureData = W(async () => (await e3.correspondingSig).signatureData), e3.hashed = j(await e3.hash(e3.signatureType, n2[0], void 0, false)), e3.hashed.catch(() => {
      });
    })), i2.packets.stream = T(i2.packets.stream, async (e3, t3) => {
      const r3 = K(e3), i3 = D(t3);
      try {
        for (let e4 = 0; e4 < a2.length; e4++) {
          const {value: t4} = await r3.read();
          a2[e4].correspondingSigResolve(t4);
        }
        await r3.readToEnd(), await i3.ready, await i3.close();
      } catch (e4) {
        a2.forEach((t4) => {
          t4.correspondingSigReject(e4);
        }), await i3.abort(e4);
      }
    }), cc(a2, n2, e2, t2, false, r2)) : cc(o2, n2, e2, t2, false, r2);
  }
  verifyDetached(e2, t2, r2 = new Date(), i2 = ie) {
    const n2 = this.unwrapCompressed().packets.filterByTag(re.packet.literalData);
    if (n2.length !== 1)
      throw Error("Can only verify message with one literal data packet.");
    return cc(e2.packets, n2, t2, r2, true, i2);
  }
  unwrapCompressed() {
    const e2 = this.packets.filterByTag(re.packet.compressedData);
    return e2.length ? new sc(e2[0].packets) : this;
  }
  async appendSignature(e2, t2 = ie) {
    await this.packets.read(V.isUint8Array(e2) ? e2 : (await fe(e2)).data, ac, t2);
  }
  write() {
    return this.packets.write();
  }
  armor(e2 = ie) {
    return de(re.armor.message, this.write(), null, null, null, e2);
  }
}
async function oc(e2, t2, r2 = null, i2 = [], n2 = new Date(), a2 = [], s2 = false, o2 = ie) {
  const c2 = new Vs(), u2 = e2.text === null ? re.signature.binary : re.signature.text;
  if (await Promise.all(t2.map(async (t3, r3) => {
    const c3 = a2[r3];
    if (!t3.isPrivate())
      throw Error("Need private key for signing");
    const h2 = await t3.getSigningKey(i2[r3], n2, c3, o2);
    return Uo(e2, t3, h2.keyPacket, {signatureType: u2}, n2, c3, s2, o2);
  })).then((e3) => {
    c2.push(...e3);
  }), r2) {
    const e3 = r2.packets.filterByTag(re.packet.signature);
    c2.push(...e3);
  }
  return c2;
}
async function cc(e2, t2, r2, i2 = new Date(), n2 = false, a2 = ie) {
  return Promise.all(e2.filter(function(e3) {
    return ["text", "binary"].includes(re.read(re.signature, e3.signatureType));
  }).map(async function(e3) {
    return async function(e4, t3, r3, i3 = new Date(), n3 = false, a3 = ie) {
      let s2, o2;
      for (const t4 of r3) {
        const r4 = t4.getKeys(e4.issuerKeyID);
        if (r4.length > 0) {
          s2 = t4, o2 = r4[0];
          break;
        }
      }
      const c2 = e4 instanceof Hs ? e4.correspondingSig : e4, u2 = {keyID: e4.issuerKeyID, verified: (async () => {
        if (!o2)
          throw Error("Could not find signing key with key ID " + e4.issuerKeyID.toHex());
        await e4.verify(o2.keyPacket, e4.signatureType, t3[0], i3, n3, a3);
        const r4 = await c2;
        if (o2.getCreationTime() > r4.created)
          throw Error("Key is newer than the signature");
        try {
          await s2.getSigningKey(o2.getKeyID(), r4.created, void 0, a3);
        } catch (e5) {
          if (!a3.allowInsecureVerificationWithReformattedKeys || !e5.message.match(/Signature creation time is in the future/))
            throw e5;
          await s2.getSigningKey(o2.getKeyID(), i3, void 0, a3);
        }
        return true;
      })(), signature: (async () => {
        const e5 = await c2, t4 = new Vs();
        return e5 && t4.push(e5), new So(t4);
      })()};
      return u2.signature.catch(() => {
      }), u2.verified.catch(() => {
      }), u2;
    }(e3, t2, r2, i2, n2, a2);
  }));
}
async function hc({text: e2, binary: t2, filename: r2, date: i2 = new Date(), format: n2 = e2 !== void 0 ? "utf8" : "binary", ...a2}) {
  let s2 = e2 !== void 0 ? e2 : t2;
  if (s2 === void 0)
    throw Error("createMessage: must pass options object containing `text` or `binary`");
  if (e2 && !V.isString(e2) && !V.isStream(e2))
    throw Error("createMessage: options.text must be a string or stream");
  if (t2 && !V.isUint8Array(t2) && !V.isStream(t2))
    throw Error("createMessage: options.binary must be a Uint8Array or stream");
  const o2 = Object.keys(a2);
  if (o2.length > 0)
    throw Error("Unknown option: " + o2.join(", "));
  const c2 = V.isStream(s2);
  c2 && (await E(), s2 = x(s2));
  const u2 = new Fs(i2);
  e2 !== void 0 ? u2.setText(s2, re.write(re.literal, n2)) : u2.setBytes(s2, re.write(re.literal, n2)), r2 !== void 0 && u2.setFilename(r2);
  const h2 = new Vs();
  h2.push(u2);
  const f2 = new sc(h2);
  return f2.fromStream = c2, f2;
}
async function vc({message: e2, encryptionKeys: t2, signingKeys: r2, passwords: i2, sessionKey: n2, format: a2 = "armored", signature: s2 = null, wildcard: o2 = false, signingKeyIDs: c2 = [], encryptionKeyIDs: u2 = [], date: h2 = new Date(), signingUserIDs: f2 = [], encryptionUserIDs: d2 = [], config: l2, ...p2}) {
  if (Dc(l2 = {...ie, ...l2}), xc(e2), Cc(a2), t2 = Rc(t2), r2 = Rc(r2), i2 = Rc(i2), c2 = Rc(c2), u2 = Rc(u2), f2 = Rc(f2), d2 = Rc(d2), p2.detached)
    throw Error("The `detached` option has been removed from openpgp.encrypt, separately call openpgp.sign instead. Don't forget to remove the `privateKeys` option as well.");
  if (p2.publicKeys)
    throw Error("The `publicKeys` option has been removed from openpgp.encrypt, pass `encryptionKeys` instead");
  if (p2.privateKeys)
    throw Error("The `privateKeys` option has been removed from openpgp.encrypt, pass `signingKeys` instead");
  if (p2.armor !== void 0)
    throw Error("The `armor` option has been removed from openpgp.encrypt, pass `format` instead.");
  const y2 = Object.keys(p2);
  if (y2.length > 0)
    throw Error("Unknown option: " + y2.join(", "));
  r2 || (r2 = []);
  const b2 = e2.fromStream;
  try {
    if ((r2.length || s2) && (e2 = await e2.sign(r2, s2, c2, h2, f2, l2)), e2 = e2.compress(await Ro("compression", t2, h2, d2, l2), l2), e2 = await e2.encrypt(t2, i2, n2, o2, u2, h2, d2, l2), a2 === "object")
      return e2;
    const p3 = a2 === "armored";
    return Uc(p3 ? e2.armor(l2) : e2.write(), b2, p3 ? "utf8" : "binary");
  } catch (e3) {
    throw V.wrapError("Error encrypting message", e3);
  }
}
function xc(e2) {
  if (!(e2 instanceof sc))
    throw Error("Parameter [message] needs to be of type Message");
}
function Cc(e2) {
  if (e2 !== "armored" && e2 !== "binary" && e2 !== "object")
    throw Error("Unsupported format " + e2);
}
const Kc = Object.keys(ie).length;
function Dc(e2) {
  const t2 = Object.keys(e2);
  if (t2.length !== Kc) {
    for (const e3 of t2)
      if (ie[e3] === void 0)
        throw Error("Unknown config property: " + e3);
  }
}
function Rc(e2) {
  return e2 && !V.isArray(e2) && (e2 = [e2]), e2;
}
async function Uc(e2, t2, r2 = "utf8") {
  const i2 = V.isStream(e2);
  return i2 === "array" ? j(e2) : t2 === "node" ? (e2 = b(e2), r2 !== "binary" && e2.setEncoding(r2), e2) : t2 === "web" && i2 === "ponyfill" ? _(e2) : e2;
}
const Tc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol : (e2) => `Symbol(${e2})`;
function zc() {
}
const qc = typeof self != "undefined" ? self : typeof window != "undefined" ? window : typeof global != "undefined" ? global : void 0;
function Oc(e2) {
  return typeof e2 == "object" && e2 !== null || typeof e2 == "function";
}
const Fc = zc, Nc = Promise, jc = Promise.prototype.then, Lc = Promise.resolve.bind(Nc), Wc = Promise.reject.bind(Nc);
function Hc(e2) {
  return new Nc(e2);
}
function Gc(e2) {
  return Lc(e2);
}
function Vc(e2) {
  return Wc(e2);
}
function $c(e2, t2, r2) {
  return jc.call(e2, t2, r2);
}
function Zc(e2, t2, r2) {
  $c($c(e2, t2, r2), void 0, Fc);
}
function Yc(e2, t2) {
  Zc(e2, t2);
}
function Xc(e2, t2) {
  Zc(e2, void 0, t2);
}
function Qc(e2, t2, r2) {
  return $c(e2, t2, r2);
}
function Jc(e2) {
  $c(e2, void 0, Fc);
}
const eu = (() => {
  const e2 = qc && qc.queueMicrotask;
  if (typeof e2 == "function")
    return e2;
  const t2 = Gc(void 0);
  return (e3) => $c(t2, e3);
})();
function tu(e2, t2, r2) {
  if (typeof e2 != "function")
    throw new TypeError("Argument is not a function");
  return Function.prototype.apply.call(e2, t2, r2);
}
function ru(e2, t2, r2) {
  try {
    return Gc(tu(e2, t2, r2));
  } catch (e3) {
    return Vc(e3);
  }
}
class iu {
  constructor() {
    this._cursor = 0, this._size = 0, this._front = {_elements: [], _next: void 0}, this._back = this._front, this._cursor = 0, this._size = 0;
  }
  get length() {
    return this._size;
  }
  push(e2) {
    const t2 = this._back;
    let r2 = t2;
    t2._elements.length === 16383 && (r2 = {_elements: [], _next: void 0}), t2._elements.push(e2), r2 !== t2 && (this._back = r2, t2._next = r2), ++this._size;
  }
  shift() {
    const e2 = this._front;
    let t2 = e2;
    const r2 = this._cursor;
    let i2 = r2 + 1;
    const n2 = e2._elements, a2 = n2[r2];
    return i2 === 16384 && (t2 = e2._next, i2 = 0), --this._size, this._cursor = i2, e2 !== t2 && (this._front = t2), n2[r2] = void 0, a2;
  }
  forEach(e2) {
    let t2 = this._cursor, r2 = this._front, i2 = r2._elements;
    for (; !(t2 === i2.length && r2._next === void 0 || t2 === i2.length && (r2 = r2._next, i2 = r2._elements, t2 = 0, i2.length === 0)); )
      e2(i2[t2]), ++t2;
  }
  peek() {
    const e2 = this._front, t2 = this._cursor;
    return e2._elements[t2];
  }
}
function nu(e2, t2) {
  e2._ownerReadableStream = t2, t2._reader = e2, t2._state === "readable" ? cu(e2) : t2._state === "closed" ? function(e3) {
    cu(e3), fu(e3);
  }(e2) : uu(e2, t2._storedError);
}
function au(e2, t2) {
  return Lf(e2._ownerReadableStream, t2);
}
function su(e2) {
  e2._ownerReadableStream._state === "readable" ? hu(e2, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : function(e3, t2) {
    uu(e3, t2);
  }(e2, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), e2._ownerReadableStream._reader = void 0, e2._ownerReadableStream = void 0;
}
function ou(e2) {
  return new TypeError("Cannot " + e2 + " a stream using a released reader");
}
function cu(e2) {
  e2._closedPromise = Hc((t2, r2) => {
    e2._closedPromise_resolve = t2, e2._closedPromise_reject = r2;
  });
}
function uu(e2, t2) {
  cu(e2), hu(e2, t2);
}
function hu(e2, t2) {
  e2._closedPromise_reject !== void 0 && (Jc(e2._closedPromise), e2._closedPromise_reject(t2), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0);
}
function fu(e2) {
  e2._closedPromise_resolve !== void 0 && (e2._closedPromise_resolve(void 0), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0);
}
const du = Tc("[[AbortSteps]]"), lu = Tc("[[ErrorSteps]]"), pu = Tc("[[CancelSteps]]"), yu = Tc("[[PullSteps]]"), bu = Number.isFinite || function(e2) {
  return typeof e2 == "number" && isFinite(e2);
}, mu = Math.trunc || function(e2) {
  return e2 < 0 ? Math.ceil(e2) : Math.floor(e2);
};
function gu(e2, t2) {
  if (e2 !== void 0 && (typeof (r2 = e2) != "object" && typeof r2 != "function"))
    throw new TypeError(t2 + " is not an object.");
  var r2;
}
function wu(e2, t2) {
  if (typeof e2 != "function")
    throw new TypeError(t2 + " is not a function.");
}
function vu(e2, t2) {
  if (!function(e3) {
    return typeof e3 == "object" && e3 !== null || typeof e3 == "function";
  }(e2))
    throw new TypeError(t2 + " is not an object.");
}
function _u(e2, t2, r2) {
  if (e2 === void 0)
    throw new TypeError(`Parameter ${t2} is required in '${r2}'.`);
}
function ku(e2, t2, r2) {
  if (e2 === void 0)
    throw new TypeError(`${t2} is required in '${r2}'.`);
}
function Au(e2) {
  return Number(e2);
}
function Su(e2) {
  return e2 === 0 ? 0 : e2;
}
function Eu(e2, t2) {
  const r2 = Number.MAX_SAFE_INTEGER;
  let i2 = Number(e2);
  if (i2 = Su(i2), !bu(i2))
    throw new TypeError(t2 + " is not a finite number");
  if (i2 = function(e3) {
    return Su(mu(e3));
  }(i2), i2 < 0 || i2 > r2)
    throw new TypeError(`${t2} is outside the accepted range of 0 to ${r2}, inclusive`);
  return bu(i2) && i2 !== 0 ? i2 : 0;
}
function Pu(e2, t2) {
  if (!Nf(e2))
    throw new TypeError(t2 + " is not a ReadableStream.");
}
function xu(e2) {
  return new Ru(e2);
}
function Mu(e2, t2) {
  e2._reader._readRequests.push(t2);
}
function Cu(e2, t2, r2) {
  const i2 = e2._reader._readRequests.shift();
  r2 ? i2._closeSteps() : i2._chunkSteps(t2);
}
function Ku(e2) {
  return e2._reader._readRequests.length;
}
function Du(e2) {
  const t2 = e2._reader;
  return t2 !== void 0 && !!Uu(t2);
}
class Ru {
  constructor(e2) {
    if (_u(e2, 1, "ReadableStreamDefaultReader"), Pu(e2, "First parameter"), jf(e2))
      throw new TypeError("This stream has already been locked for exclusive reading by another reader");
    nu(this, e2), this._readRequests = new iu();
  }
  get closed() {
    return Uu(this) ? this._closedPromise : Vc(Bu("closed"));
  }
  cancel(e2) {
    return Uu(this) ? this._ownerReadableStream === void 0 ? Vc(ou("cancel")) : au(this, e2) : Vc(Bu("cancel"));
  }
  read() {
    if (!Uu(this))
      return Vc(Bu("read"));
    if (this._ownerReadableStream === void 0)
      return Vc(ou("read from"));
    let e2, t2;
    const r2 = Hc((r3, i2) => {
      e2 = r3, t2 = i2;
    });
    return Iu(this, {_chunkSteps: (t3) => e2({value: t3, done: false}), _closeSteps: () => e2({value: void 0, done: true}), _errorSteps: (e3) => t2(e3)}), r2;
  }
  releaseLock() {
    if (!Uu(this))
      throw Bu("releaseLock");
    if (this._ownerReadableStream !== void 0) {
      if (this._readRequests.length > 0)
        throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
      su(this);
    }
  }
}
function Uu(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_readRequests");
}
function Iu(e2, t2) {
  const r2 = e2._ownerReadableStream;
  r2._disturbed = true, r2._state === "closed" ? t2._closeSteps() : r2._state === "errored" ? t2._errorSteps(r2._storedError) : r2._readableStreamController[yu](t2);
}
function Bu(e2) {
  return new TypeError(`ReadableStreamDefaultReader.prototype.${e2} can only be used on a ReadableStreamDefaultReader`);
}
let Tu;
Object.defineProperties(Ru.prototype, {cancel: {enumerable: true}, read: {enumerable: true}, releaseLock: {enumerable: true}, closed: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(Ru.prototype, Tc.toStringTag, {value: "ReadableStreamDefaultReader", configurable: true}), typeof Tc.asyncIterator == "symbol" && (Tu = {[Tc.asyncIterator]() {
  return this;
}}, Object.defineProperty(Tu, Tc.asyncIterator, {enumerable: false}));
class zu {
  constructor(e2, t2) {
    this._ongoingPromise = void 0, this._isFinished = false, this._reader = e2, this._preventCancel = t2;
  }
  next() {
    const e2 = () => this._nextSteps();
    return this._ongoingPromise = this._ongoingPromise ? Qc(this._ongoingPromise, e2, e2) : e2(), this._ongoingPromise;
  }
  return(e2) {
    const t2 = () => this._returnSteps(e2);
    return this._ongoingPromise ? Qc(this._ongoingPromise, t2, t2) : t2();
  }
  _nextSteps() {
    if (this._isFinished)
      return Promise.resolve({value: void 0, done: true});
    const e2 = this._reader;
    if (e2._ownerReadableStream === void 0)
      return Vc(ou("iterate"));
    let t2, r2;
    const i2 = Hc((e3, i3) => {
      t2 = e3, r2 = i3;
    });
    return Iu(e2, {_chunkSteps: (e3) => {
      this._ongoingPromise = void 0, eu(() => t2({value: e3, done: false}));
    }, _closeSteps: () => {
      this._ongoingPromise = void 0, this._isFinished = true, su(e2), t2({value: void 0, done: true});
    }, _errorSteps: (t3) => {
      this._ongoingPromise = void 0, this._isFinished = true, su(e2), r2(t3);
    }}), i2;
  }
  _returnSteps(e2) {
    if (this._isFinished)
      return Promise.resolve({value: e2, done: true});
    this._isFinished = true;
    const t2 = this._reader;
    if (t2._ownerReadableStream === void 0)
      return Vc(ou("finish iterating"));
    if (!this._preventCancel) {
      const r2 = au(t2, e2);
      return su(t2), Qc(r2, () => ({value: e2, done: true}));
    }
    return su(t2), Gc({value: e2, done: true});
  }
}
const qu = {next() {
  return Ou(this) ? this._asyncIteratorImpl.next() : Vc(Fu("next"));
}, return(e2) {
  return Ou(this) ? this._asyncIteratorImpl.return(e2) : Vc(Fu("return"));
}};
function Ou(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_asyncIteratorImpl");
}
function Fu(e2) {
  return new TypeError(`ReadableStreamAsyncIterator.${e2} can only be used on a ReadableSteamAsyncIterator`);
}
Tu !== void 0 && Object.setPrototypeOf(qu, Tu);
const Nu = Number.isNaN || function(e2) {
  return e2 != e2;
};
function ju(e2) {
  return !!function(e3) {
    if (typeof e3 != "number")
      return false;
    if (Nu(e3))
      return false;
    if (e3 < 0)
      return false;
    return true;
  }(e2) && e2 !== 1 / 0;
}
function Lu(e2) {
  const t2 = e2._queue.shift();
  return e2._queueTotalSize -= t2.size, e2._queueTotalSize < 0 && (e2._queueTotalSize = 0), t2.value;
}
function Wu(e2, t2, r2) {
  if (!ju(r2 = Number(r2)))
    throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
  e2._queue.push({value: t2, size: r2}), e2._queueTotalSize += r2;
}
function Hu(e2) {
  e2._queue = new iu(), e2._queueTotalSize = 0;
}
function Gu(e2) {
  return e2.slice();
}
class Vu {
  constructor() {
    throw new TypeError("Illegal constructor");
  }
  get view() {
    if (!Yu(this))
      throw dh("view");
    return this._view;
  }
  respond(e2) {
    if (!Yu(this))
      throw dh("respond");
    if (_u(e2, 1, "respond"), e2 = Eu(e2, "First parameter"), this._associatedReadableByteStreamController === void 0)
      throw new TypeError("This BYOB request has been invalidated");
    this._view.buffer, function(e3, t2) {
      if (!ju(t2 = Number(t2)))
        throw new RangeError("bytesWritten must be a finite");
      sh(e3, t2);
    }(this._associatedReadableByteStreamController, e2);
  }
  respondWithNewView(e2) {
    if (!Yu(this))
      throw dh("respondWithNewView");
    if (_u(e2, 1, "respondWithNewView"), !ArrayBuffer.isView(e2))
      throw new TypeError("You can only respond with array buffer views");
    if (e2.byteLength === 0)
      throw new TypeError("chunk must have non-zero byteLength");
    if (e2.buffer.byteLength === 0)
      throw new TypeError("chunk's buffer must have non-zero byteLength");
    if (this._associatedReadableByteStreamController === void 0)
      throw new TypeError("This BYOB request has been invalidated");
    !function(e3, t2) {
      const r2 = e3._pendingPullIntos.peek();
      if (r2.byteOffset + r2.bytesFilled !== t2.byteOffset)
        throw new RangeError("The region specified by view does not match byobRequest");
      if (r2.byteLength !== t2.byteLength)
        throw new RangeError("The buffer of view has different capacity than byobRequest");
      r2.buffer = t2.buffer, sh(e3, t2.byteLength);
    }(this._associatedReadableByteStreamController, e2);
  }
}
Object.defineProperties(Vu.prototype, {respond: {enumerable: true}, respondWithNewView: {enumerable: true}, view: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(Vu.prototype, Tc.toStringTag, {value: "ReadableStreamBYOBRequest", configurable: true});
class $u {
  constructor() {
    throw new TypeError("Illegal constructor");
  }
  get byobRequest() {
    if (!Zu(this))
      throw lh("byobRequest");
    if (this._byobRequest === null && this._pendingPullIntos.length > 0) {
      const e2 = this._pendingPullIntos.peek(), t2 = new Uint8Array(e2.buffer, e2.byteOffset + e2.bytesFilled, e2.byteLength - e2.bytesFilled), r2 = Object.create(Vu.prototype);
      !function(e3, t3, r3) {
        e3._associatedReadableByteStreamController = t3, e3._view = r3;
      }(r2, this, t2), this._byobRequest = r2;
    }
    return this._byobRequest;
  }
  get desiredSize() {
    if (!Zu(this))
      throw lh("desiredSize");
    return hh(this);
  }
  close() {
    if (!Zu(this))
      throw lh("close");
    if (this._closeRequested)
      throw new TypeError("The stream has already been closed; do not close it again!");
    const e2 = this._controlledReadableByteStream._state;
    if (e2 !== "readable")
      throw new TypeError(`The stream (in ${e2} state) is not in the readable state and cannot be closed`);
    !function(e3) {
      const t2 = e3._controlledReadableByteStream;
      if (e3._closeRequested || t2._state !== "readable")
        return;
      if (e3._queueTotalSize > 0)
        return void (e3._closeRequested = true);
      if (e3._pendingPullIntos.length > 0) {
        if (e3._pendingPullIntos.peek().bytesFilled > 0) {
          const t3 = new TypeError("Insufficient bytes to fill elements in the given buffer");
          throw uh(e3, t3), t3;
        }
      }
      ch(e3), Wf(t2);
    }(this);
  }
  enqueue(e2) {
    if (!Zu(this))
      throw lh("enqueue");
    if (_u(e2, 1, "enqueue"), !ArrayBuffer.isView(e2))
      throw new TypeError("chunk must be an array buffer view");
    if (e2.byteLength === 0)
      throw new TypeError("chunk must have non-zero byteLength");
    if (e2.buffer.byteLength === 0)
      throw new TypeError("chunk's buffer must have non-zero byteLength");
    if (this._closeRequested)
      throw new TypeError("stream is closed or draining");
    const t2 = this._controlledReadableByteStream._state;
    if (t2 !== "readable")
      throw new TypeError(`The stream (in ${t2} state) is not in the readable state and cannot be enqueued to`);
    !function(e3, t3) {
      const r2 = e3._controlledReadableByteStream;
      if (e3._closeRequested || r2._state !== "readable")
        return;
      const i2 = t3.buffer, n2 = t3.byteOffset, a2 = t3.byteLength, s2 = i2;
      if (Du(r2))
        if (Ku(r2) === 0)
          eh(e3, s2, n2, a2);
        else {
          Cu(r2, new Uint8Array(s2, n2, a2), false);
        }
      else
        bh(r2) ? (eh(e3, s2, n2, a2), ah(e3)) : eh(e3, s2, n2, a2);
      Xu(e3);
    }(this, e2);
  }
  error(e2) {
    if (!Zu(this))
      throw lh("error");
    uh(this, e2);
  }
  [pu](e2) {
    if (this._pendingPullIntos.length > 0) {
      this._pendingPullIntos.peek().bytesFilled = 0;
    }
    Hu(this);
    const t2 = this._cancelAlgorithm(e2);
    return ch(this), t2;
  }
  [yu](e2) {
    const t2 = this._controlledReadableByteStream;
    if (this._queueTotalSize > 0) {
      const t3 = this._queue.shift();
      this._queueTotalSize -= t3.byteLength, ih(this);
      const r3 = new Uint8Array(t3.buffer, t3.byteOffset, t3.byteLength);
      return void e2._chunkSteps(r3);
    }
    const r2 = this._autoAllocateChunkSize;
    if (r2 !== void 0) {
      let t3;
      try {
        t3 = new ArrayBuffer(r2);
      } catch (t4) {
        return void e2._errorSteps(t4);
      }
      const i2 = {buffer: t3, byteOffset: 0, byteLength: r2, bytesFilled: 0, elementSize: 1, viewConstructor: Uint8Array, readerType: "default"};
      this._pendingPullIntos.push(i2);
    }
    Mu(t2, e2), Xu(this);
  }
}
function Zu(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_controlledReadableByteStream");
}
function Yu(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_associatedReadableByteStreamController");
}
function Xu(e2) {
  if (!function(e3) {
    const t2 = e3._controlledReadableByteStream;
    if (t2._state !== "readable")
      return false;
    if (e3._closeRequested)
      return false;
    if (!e3._started)
      return false;
    if (Du(t2) && Ku(t2) > 0)
      return true;
    if (bh(t2) && yh(t2) > 0)
      return true;
    if (hh(e3) > 0)
      return true;
    return false;
  }(e2))
    return;
  if (e2._pulling)
    return void (e2._pullAgain = true);
  e2._pulling = true;
  Zc(e2._pullAlgorithm(), () => {
    e2._pulling = false, e2._pullAgain && (e2._pullAgain = false, Xu(e2));
  }, (t2) => {
    uh(e2, t2);
  });
}
function Qu(e2, t2) {
  let r2 = false;
  e2._state === "closed" && (r2 = true);
  const i2 = Ju(t2);
  t2.readerType === "default" ? Cu(e2, i2, r2) : function(e3, t3, r3) {
    const i3 = e3._reader._readIntoRequests.shift();
    r3 ? i3._closeSteps(t3) : i3._chunkSteps(t3);
  }(e2, i2, r2);
}
function Ju(e2) {
  const t2 = e2.bytesFilled, r2 = e2.elementSize;
  return new e2.viewConstructor(e2.buffer, e2.byteOffset, t2 / r2);
}
function eh(e2, t2, r2, i2) {
  e2._queue.push({buffer: t2, byteOffset: r2, byteLength: i2}), e2._queueTotalSize += i2;
}
function th(e2, t2) {
  const r2 = t2.elementSize, i2 = t2.bytesFilled - t2.bytesFilled % r2, n2 = Math.min(e2._queueTotalSize, t2.byteLength - t2.bytesFilled), a2 = t2.bytesFilled + n2, s2 = a2 - a2 % r2;
  let o2 = n2, c2 = false;
  s2 > i2 && (o2 = s2 - t2.bytesFilled, c2 = true);
  const u2 = e2._queue;
  for (; o2 > 0; ) {
    const r3 = u2.peek(), i3 = Math.min(o2, r3.byteLength), n3 = t2.byteOffset + t2.bytesFilled;
    h2 = t2.buffer, f2 = n3, d2 = r3.buffer, l2 = r3.byteOffset, p2 = i3, new Uint8Array(h2).set(new Uint8Array(d2, l2, p2), f2), r3.byteLength === i3 ? u2.shift() : (r3.byteOffset += i3, r3.byteLength -= i3), e2._queueTotalSize -= i3, rh(e2, i3, t2), o2 -= i3;
  }
  var h2, f2, d2, l2, p2;
  return c2;
}
function rh(e2, t2, r2) {
  nh(e2), r2.bytesFilled += t2;
}
function ih(e2) {
  e2._queueTotalSize === 0 && e2._closeRequested ? (ch(e2), Wf(e2._controlledReadableByteStream)) : Xu(e2);
}
function nh(e2) {
  e2._byobRequest !== null && (e2._byobRequest._associatedReadableByteStreamController = void 0, e2._byobRequest._view = null, e2._byobRequest = null);
}
function ah(e2) {
  for (; e2._pendingPullIntos.length > 0; ) {
    if (e2._queueTotalSize === 0)
      return;
    const t2 = e2._pendingPullIntos.peek();
    th(e2, t2) && (oh(e2), Qu(e2._controlledReadableByteStream, t2));
  }
}
function sh(e2, t2) {
  const r2 = e2._pendingPullIntos.peek();
  if (e2._controlledReadableByteStream._state === "closed") {
    if (t2 !== 0)
      throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
    !function(e3, t3) {
      t3.buffer = t3.buffer;
      const r3 = e3._controlledReadableByteStream;
      if (bh(r3))
        for (; yh(r3) > 0; )
          Qu(r3, oh(e3));
    }(e2, r2);
  } else
    !function(e3, t3, r3) {
      if (r3.bytesFilled + t3 > r3.byteLength)
        throw new RangeError("bytesWritten out of range");
      if (rh(e3, t3, r3), r3.bytesFilled < r3.elementSize)
        return;
      oh(e3);
      const i2 = r3.bytesFilled % r3.elementSize;
      if (i2 > 0) {
        const t4 = r3.byteOffset + r3.bytesFilled, n2 = r3.buffer.slice(t4 - i2, t4);
        eh(e3, n2, 0, n2.byteLength);
      }
      r3.buffer = r3.buffer, r3.bytesFilled -= i2, Qu(e3._controlledReadableByteStream, r3), ah(e3);
    }(e2, t2, r2);
  Xu(e2);
}
function oh(e2) {
  const t2 = e2._pendingPullIntos.shift();
  return nh(e2), t2;
}
function ch(e2) {
  e2._pullAlgorithm = void 0, e2._cancelAlgorithm = void 0;
}
function uh(e2, t2) {
  const r2 = e2._controlledReadableByteStream;
  r2._state === "readable" && (!function(e3) {
    nh(e3), e3._pendingPullIntos = new iu();
  }(e2), Hu(e2), ch(e2), Hf(r2, t2));
}
function hh(e2) {
  const t2 = e2._controlledReadableByteStream._state;
  return t2 === "errored" ? null : t2 === "closed" ? 0 : e2._strategyHWM - e2._queueTotalSize;
}
function fh(e2, t2, r2) {
  const i2 = Object.create($u.prototype);
  let n2 = () => {
  }, a2 = () => Gc(void 0), s2 = () => Gc(void 0);
  t2.start !== void 0 && (n2 = () => t2.start(i2)), t2.pull !== void 0 && (a2 = () => t2.pull(i2)), t2.cancel !== void 0 && (s2 = (e3) => t2.cancel(e3));
  const o2 = t2.autoAllocateChunkSize;
  if (o2 === 0)
    throw new TypeError("autoAllocateChunkSize must be greater than 0");
  !function(e3, t3, r3, i3, n3, a3, s3) {
    t3._controlledReadableByteStream = e3, t3._pullAgain = false, t3._pulling = false, t3._byobRequest = null, t3._queue = t3._queueTotalSize = void 0, Hu(t3), t3._closeRequested = false, t3._started = false, t3._strategyHWM = a3, t3._pullAlgorithm = i3, t3._cancelAlgorithm = n3, t3._autoAllocateChunkSize = s3, t3._pendingPullIntos = new iu(), e3._readableStreamController = t3, Zc(Gc(r3()), () => {
      t3._started = true, Xu(t3);
    }, (e4) => {
      uh(t3, e4);
    });
  }(e2, i2, n2, a2, s2, r2, o2);
}
function dh(e2) {
  return new TypeError(`ReadableStreamBYOBRequest.prototype.${e2} can only be used on a ReadableStreamBYOBRequest`);
}
function lh(e2) {
  return new TypeError(`ReadableByteStreamController.prototype.${e2} can only be used on a ReadableByteStreamController`);
}
function ph(e2, t2) {
  e2._reader._readIntoRequests.push(t2);
}
function yh(e2) {
  return e2._reader._readIntoRequests.length;
}
function bh(e2) {
  const t2 = e2._reader;
  return t2 !== void 0 && !!gh(t2);
}
Object.defineProperties($u.prototype, {close: {enumerable: true}, enqueue: {enumerable: true}, error: {enumerable: true}, byobRequest: {enumerable: true}, desiredSize: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty($u.prototype, Tc.toStringTag, {value: "ReadableByteStreamController", configurable: true});
class mh {
  constructor(e2) {
    if (_u(e2, 1, "ReadableStreamBYOBReader"), Pu(e2, "First parameter"), jf(e2))
      throw new TypeError("This stream has already been locked for exclusive reading by another reader");
    if (!Zu(e2._readableStreamController))
      throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
    nu(this, e2), this._readIntoRequests = new iu();
  }
  get closed() {
    return gh(this) ? this._closedPromise : Vc(wh("closed"));
  }
  cancel(e2) {
    return gh(this) ? this._ownerReadableStream === void 0 ? Vc(ou("cancel")) : au(this, e2) : Vc(wh("cancel"));
  }
  read(e2) {
    if (!gh(this))
      return Vc(wh("read"));
    if (!ArrayBuffer.isView(e2))
      return Vc(new TypeError("view must be an array buffer view"));
    if (e2.byteLength === 0)
      return Vc(new TypeError("view must have non-zero byteLength"));
    if (e2.buffer.byteLength === 0)
      return Vc(new TypeError("view's buffer must have non-zero byteLength"));
    if (this._ownerReadableStream === void 0)
      return Vc(ou("read from"));
    let t2, r2;
    const i2 = Hc((e3, i3) => {
      t2 = e3, r2 = i3;
    });
    return function(e3, t3, r3) {
      const i3 = e3._ownerReadableStream;
      i3._disturbed = true, i3._state === "errored" ? r3._errorSteps(i3._storedError) : function(e4, t4, r4) {
        const i4 = e4._controlledReadableByteStream;
        let n2 = 1;
        t4.constructor !== DataView && (n2 = t4.constructor.BYTES_PER_ELEMENT);
        const a2 = t4.constructor, s2 = {buffer: t4.buffer, byteOffset: t4.byteOffset, byteLength: t4.byteLength, bytesFilled: 0, elementSize: n2, viewConstructor: a2, readerType: "byob"};
        if (e4._pendingPullIntos.length > 0)
          return e4._pendingPullIntos.push(s2), void ph(i4, r4);
        if (i4._state !== "closed") {
          if (e4._queueTotalSize > 0) {
            if (th(e4, s2)) {
              const t5 = Ju(s2);
              return ih(e4), void r4._chunkSteps(t5);
            }
            if (e4._closeRequested) {
              const t5 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              return uh(e4, t5), void r4._errorSteps(t5);
            }
          }
          e4._pendingPullIntos.push(s2), ph(i4, r4), Xu(e4);
        } else {
          const e5 = new a2(s2.buffer, s2.byteOffset, 0);
          r4._closeSteps(e5);
        }
      }(i3._readableStreamController, t3, r3);
    }(this, e2, {_chunkSteps: (e3) => t2({value: e3, done: false}), _closeSteps: (e3) => t2({value: e3, done: true}), _errorSteps: (e3) => r2(e3)}), i2;
  }
  releaseLock() {
    if (!gh(this))
      throw wh("releaseLock");
    if (this._ownerReadableStream !== void 0) {
      if (this._readIntoRequests.length > 0)
        throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
      su(this);
    }
  }
}
function gh(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_readIntoRequests");
}
function wh(e2) {
  return new TypeError(`ReadableStreamBYOBReader.prototype.${e2} can only be used on a ReadableStreamBYOBReader`);
}
function vh(e2, t2) {
  const {highWaterMark: r2} = e2;
  if (r2 === void 0)
    return t2;
  if (Nu(r2) || r2 < 0)
    throw new RangeError("Invalid highWaterMark");
  return r2;
}
function _h(e2) {
  const {size: t2} = e2;
  return t2 || (() => 1);
}
function kh(e2, t2) {
  gu(e2, t2);
  const r2 = e2 == null ? void 0 : e2.highWaterMark, i2 = e2 == null ? void 0 : e2.size;
  return {highWaterMark: r2 === void 0 ? void 0 : Au(r2), size: i2 === void 0 ? void 0 : Ah(i2, t2 + " has member 'size' that")};
}
function Ah(e2, t2) {
  return wu(e2, t2), (t3) => Au(e2(t3));
}
function Sh(e2, t2, r2) {
  return wu(e2, r2), (r3) => ru(e2, t2, [r3]);
}
function Eh(e2, t2, r2) {
  return wu(e2, r2), () => ru(e2, t2, []);
}
function Ph(e2, t2, r2) {
  return wu(e2, r2), (r3) => tu(e2, t2, [r3]);
}
function xh(e2, t2, r2) {
  return wu(e2, r2), (r3, i2) => ru(e2, t2, [r3, i2]);
}
function Mh(e2, t2) {
  if (!Rh(e2))
    throw new TypeError(t2 + " is not a WritableStream.");
}
Object.defineProperties(mh.prototype, {cancel: {enumerable: true}, read: {enumerable: true}, releaseLock: {enumerable: true}, closed: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(mh.prototype, Tc.toStringTag, {value: "ReadableStreamBYOBReader", configurable: true});
class Ch {
  constructor(e2 = {}, t2 = {}) {
    e2 === void 0 ? e2 = null : vu(e2, "First parameter");
    const r2 = kh(t2, "Second parameter"), i2 = function(e3, t3) {
      gu(e3, t3);
      const r3 = e3 == null ? void 0 : e3.abort, i3 = e3 == null ? void 0 : e3.close, n3 = e3 == null ? void 0 : e3.start, a2 = e3 == null ? void 0 : e3.type, s2 = e3 == null ? void 0 : e3.write;
      return {abort: r3 === void 0 ? void 0 : Sh(r3, e3, t3 + " has member 'abort' that"), close: i3 === void 0 ? void 0 : Eh(i3, e3, t3 + " has member 'close' that"), start: n3 === void 0 ? void 0 : Ph(n3, e3, t3 + " has member 'start' that"), write: s2 === void 0 ? void 0 : xh(s2, e3, t3 + " has member 'write' that"), type: a2};
    }(e2, "First parameter");
    Dh(this);
    if (i2.type !== void 0)
      throw new RangeError("Invalid type is specified");
    const n2 = _h(r2);
    !function(e3, t3, r3, i3) {
      const n3 = Object.create(Yh.prototype);
      let a2 = () => {
      }, s2 = () => Gc(void 0), o2 = () => Gc(void 0), c2 = () => Gc(void 0);
      t3.start !== void 0 && (a2 = () => t3.start(n3));
      t3.write !== void 0 && (s2 = (e4) => t3.write(e4, n3));
      t3.close !== void 0 && (o2 = () => t3.close());
      t3.abort !== void 0 && (c2 = (e4) => t3.abort(e4));
      Xh(e3, n3, a2, s2, o2, c2, r3, i3);
    }(this, i2, vh(r2, 1), n2);
  }
  get locked() {
    if (!Rh(this))
      throw af("locked");
    return Uh(this);
  }
  abort(e2) {
    return Rh(this) ? Uh(this) ? Vc(new TypeError("Cannot abort a stream that already has a writer")) : Ih(this, e2) : Vc(af("abort"));
  }
  close() {
    return Rh(this) ? Uh(this) ? Vc(new TypeError("Cannot close a stream that already has a writer")) : Oh(this) ? Vc(new TypeError("Cannot close an already-closing stream")) : Bh(this) : Vc(af("close"));
  }
  getWriter() {
    if (!Rh(this))
      throw af("getWriter");
    return Kh(this);
  }
}
function Kh(e2) {
  return new jh(e2);
}
function Dh(e2) {
  e2._state = "writable", e2._storedError = void 0, e2._writer = void 0, e2._writableStreamController = void 0, e2._writeRequests = new iu(), e2._inFlightWriteRequest = void 0, e2._closeRequest = void 0, e2._inFlightCloseRequest = void 0, e2._pendingAbortRequest = void 0, e2._backpressure = false;
}
function Rh(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_writableStreamController");
}
function Uh(e2) {
  return e2._writer !== void 0;
}
function Ih(e2, t2) {
  const r2 = e2._state;
  if (r2 === "closed" || r2 === "errored")
    return Gc(void 0);
  if (e2._pendingAbortRequest !== void 0)
    return e2._pendingAbortRequest._promise;
  let i2 = false;
  r2 === "erroring" && (i2 = true, t2 = void 0);
  const n2 = Hc((r3, n3) => {
    e2._pendingAbortRequest = {_promise: void 0, _resolve: r3, _reject: n3, _reason: t2, _wasAlreadyErroring: i2};
  });
  return e2._pendingAbortRequest._promise = n2, i2 || zh(e2, t2), n2;
}
function Bh(e2) {
  const t2 = e2._state;
  if (t2 === "closed" || t2 === "errored")
    return Vc(new TypeError(`The stream (in ${t2} state) is not in the writable state and cannot be closed`));
  const r2 = Hc((t3, r3) => {
    const i3 = {_resolve: t3, _reject: r3};
    e2._closeRequest = i3;
  }), i2 = e2._writer;
  var n2;
  return i2 !== void 0 && e2._backpressure && t2 === "writable" && bf(i2), Wu(n2 = e2._writableStreamController, Zh, 0), ef(n2), r2;
}
function Th(e2, t2) {
  e2._state !== "writable" ? qh(e2) : zh(e2, t2);
}
function zh(e2, t2) {
  const r2 = e2._writableStreamController;
  e2._state = "erroring", e2._storedError = t2;
  const i2 = e2._writer;
  i2 !== void 0 && Gh(i2, t2), !function(e3) {
    if (e3._inFlightWriteRequest === void 0 && e3._inFlightCloseRequest === void 0)
      return false;
    return true;
  }(e2) && r2._started && qh(e2);
}
function qh(e2) {
  e2._state = "errored", e2._writableStreamController[lu]();
  const t2 = e2._storedError;
  if (e2._writeRequests.forEach((e3) => {
    e3._reject(t2);
  }), e2._writeRequests = new iu(), e2._pendingAbortRequest === void 0)
    return void Fh(e2);
  const r2 = e2._pendingAbortRequest;
  if (e2._pendingAbortRequest = void 0, r2._wasAlreadyErroring)
    return r2._reject(t2), void Fh(e2);
  Zc(e2._writableStreamController[du](r2._reason), () => {
    r2._resolve(), Fh(e2);
  }, (t3) => {
    r2._reject(t3), Fh(e2);
  });
}
function Oh(e2) {
  return e2._closeRequest !== void 0 || e2._inFlightCloseRequest !== void 0;
}
function Fh(e2) {
  e2._closeRequest !== void 0 && (e2._closeRequest._reject(e2._storedError), e2._closeRequest = void 0);
  const t2 = e2._writer;
  t2 !== void 0 && hf(t2, e2._storedError);
}
function Nh(e2, t2) {
  const r2 = e2._writer;
  r2 !== void 0 && t2 !== e2._backpressure && (t2 ? function(e3) {
    df(e3);
  }(r2) : bf(r2)), e2._backpressure = t2;
}
Object.defineProperties(Ch.prototype, {abort: {enumerable: true}, close: {enumerable: true}, getWriter: {enumerable: true}, locked: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(Ch.prototype, Tc.toStringTag, {value: "WritableStream", configurable: true});
class jh {
  constructor(e2) {
    if (_u(e2, 1, "WritableStreamDefaultWriter"), Mh(e2, "First parameter"), Uh(e2))
      throw new TypeError("This stream has already been locked for exclusive writing by another writer");
    this._ownerWritableStream = e2, e2._writer = this;
    const t2 = e2._state;
    if (t2 === "writable")
      !Oh(e2) && e2._backpressure ? df(this) : pf(this), cf(this);
    else if (t2 === "erroring")
      lf(this, e2._storedError), cf(this);
    else if (t2 === "closed")
      pf(this), cf(r2 = this), ff(r2);
    else {
      const t3 = e2._storedError;
      lf(this, t3), uf(this, t3);
    }
    var r2;
  }
  get closed() {
    return Lh(this) ? this._closedPromise : Vc(sf("closed"));
  }
  get desiredSize() {
    if (!Lh(this))
      throw sf("desiredSize");
    if (this._ownerWritableStream === void 0)
      throw of("desiredSize");
    return function(e2) {
      const t2 = e2._ownerWritableStream, r2 = t2._state;
      if (r2 === "errored" || r2 === "erroring")
        return null;
      if (r2 === "closed")
        return 0;
      return Jh(t2._writableStreamController);
    }(this);
  }
  get ready() {
    return Lh(this) ? this._readyPromise : Vc(sf("ready"));
  }
  abort(e2) {
    return Lh(this) ? this._ownerWritableStream === void 0 ? Vc(of("abort")) : function(e3, t2) {
      return Ih(e3._ownerWritableStream, t2);
    }(this, e2) : Vc(sf("abort"));
  }
  close() {
    if (!Lh(this))
      return Vc(sf("close"));
    const e2 = this._ownerWritableStream;
    return e2 === void 0 ? Vc(of("close")) : Oh(e2) ? Vc(new TypeError("Cannot close an already-closing stream")) : Wh(this);
  }
  releaseLock() {
    if (!Lh(this))
      throw sf("releaseLock");
    this._ownerWritableStream !== void 0 && Vh(this);
  }
  write(e2) {
    return Lh(this) ? this._ownerWritableStream === void 0 ? Vc(of("write to")) : $h(this, e2) : Vc(sf("write"));
  }
}
function Lh(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_ownerWritableStream");
}
function Wh(e2) {
  return Bh(e2._ownerWritableStream);
}
function Hh(e2, t2) {
  e2._closedPromiseState === "pending" ? hf(e2, t2) : function(e3, t3) {
    uf(e3, t3);
  }(e2, t2);
}
function Gh(e2, t2) {
  e2._readyPromiseState === "pending" ? yf(e2, t2) : function(e3, t3) {
    lf(e3, t3);
  }(e2, t2);
}
function Vh(e2) {
  const t2 = e2._ownerWritableStream, r2 = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
  Gh(e2, r2), Hh(e2, r2), t2._writer = void 0, e2._ownerWritableStream = void 0;
}
function $h(e2, t2) {
  const r2 = e2._ownerWritableStream, i2 = r2._writableStreamController, n2 = function(e3, t3) {
    try {
      return e3._strategySizeAlgorithm(t3);
    } catch (t4) {
      return tf(e3, t4), 1;
    }
  }(i2, t2);
  if (r2 !== e2._ownerWritableStream)
    return Vc(of("write to"));
  const a2 = r2._state;
  if (a2 === "errored")
    return Vc(r2._storedError);
  if (Oh(r2) || a2 === "closed")
    return Vc(new TypeError("The stream is closing or closed and cannot be written to"));
  if (a2 === "erroring")
    return Vc(r2._storedError);
  const s2 = function(e3) {
    return Hc((t3, r3) => {
      const i3 = {_resolve: t3, _reject: r3};
      e3._writeRequests.push(i3);
    });
  }(r2);
  return function(e3, t3, r3) {
    try {
      Wu(e3, t3, r3);
    } catch (t4) {
      return void tf(e3, t4);
    }
    const i3 = e3._controlledWritableStream;
    if (!Oh(i3) && i3._state === "writable") {
      Nh(i3, rf(e3));
    }
    ef(e3);
  }(i2, t2, n2), s2;
}
Object.defineProperties(jh.prototype, {abort: {enumerable: true}, close: {enumerable: true}, releaseLock: {enumerable: true}, write: {enumerable: true}, closed: {enumerable: true}, desiredSize: {enumerable: true}, ready: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(jh.prototype, Tc.toStringTag, {value: "WritableStreamDefaultWriter", configurable: true});
const Zh = {};
class Yh {
  constructor() {
    throw new TypeError("Illegal constructor");
  }
  error(e2) {
    if (!function(e3) {
      if (!Oc(e3))
        return false;
      if (!Object.prototype.hasOwnProperty.call(e3, "_controlledWritableStream"))
        return false;
      return true;
    }(this))
      throw new TypeError("WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController");
    this._controlledWritableStream._state === "writable" && nf(this, e2);
  }
  [du](e2) {
    const t2 = this._abortAlgorithm(e2);
    return Qh(this), t2;
  }
  [lu]() {
    Hu(this);
  }
}
function Xh(e2, t2, r2, i2, n2, a2, s2, o2) {
  t2._controlledWritableStream = e2, e2._writableStreamController = t2, t2._queue = void 0, t2._queueTotalSize = void 0, Hu(t2), t2._started = false, t2._strategySizeAlgorithm = o2, t2._strategyHWM = s2, t2._writeAlgorithm = i2, t2._closeAlgorithm = n2, t2._abortAlgorithm = a2;
  const c2 = rf(t2);
  Nh(e2, c2);
  Zc(Gc(r2()), () => {
    t2._started = true, ef(t2);
  }, (r3) => {
    t2._started = true, Th(e2, r3);
  });
}
function Qh(e2) {
  e2._writeAlgorithm = void 0, e2._closeAlgorithm = void 0, e2._abortAlgorithm = void 0, e2._strategySizeAlgorithm = void 0;
}
function Jh(e2) {
  return e2._strategyHWM - e2._queueTotalSize;
}
function ef(e2) {
  const t2 = e2._controlledWritableStream;
  if (!e2._started)
    return;
  if (t2._inFlightWriteRequest !== void 0)
    return;
  if (t2._state === "erroring")
    return void qh(t2);
  if (e2._queue.length === 0)
    return;
  const r2 = e2._queue.peek().value;
  r2 === Zh ? function(e3) {
    const t3 = e3._controlledWritableStream;
    (function(e4) {
      e4._inFlightCloseRequest = e4._closeRequest, e4._closeRequest = void 0;
    })(t3), Lu(e3);
    const r3 = e3._closeAlgorithm();
    Qh(e3), Zc(r3, () => {
      !function(e4) {
        e4._inFlightCloseRequest._resolve(void 0), e4._inFlightCloseRequest = void 0, e4._state === "erroring" && (e4._storedError = void 0, e4._pendingAbortRequest !== void 0 && (e4._pendingAbortRequest._resolve(), e4._pendingAbortRequest = void 0)), e4._state = "closed";
        const t4 = e4._writer;
        t4 !== void 0 && ff(t4);
      }(t3);
    }, (e4) => {
      !function(e5, t4) {
        e5._inFlightCloseRequest._reject(t4), e5._inFlightCloseRequest = void 0, e5._pendingAbortRequest !== void 0 && (e5._pendingAbortRequest._reject(t4), e5._pendingAbortRequest = void 0), Th(e5, t4);
      }(t3, e4);
    });
  }(e2) : function(e3, t3) {
    const r3 = e3._controlledWritableStream;
    !function(e4) {
      e4._inFlightWriteRequest = e4._writeRequests.shift();
    }(r3);
    Zc(e3._writeAlgorithm(t3), () => {
      !function(e4) {
        e4._inFlightWriteRequest._resolve(void 0), e4._inFlightWriteRequest = void 0;
      }(r3);
      const t4 = r3._state;
      if (Lu(e3), !Oh(r3) && t4 === "writable") {
        const t5 = rf(e3);
        Nh(r3, t5);
      }
      ef(e3);
    }, (t4) => {
      r3._state === "writable" && Qh(e3), function(e4, t5) {
        e4._inFlightWriteRequest._reject(t5), e4._inFlightWriteRequest = void 0, Th(e4, t5);
      }(r3, t4);
    });
  }(e2, r2);
}
function tf(e2, t2) {
  e2._controlledWritableStream._state === "writable" && nf(e2, t2);
}
function rf(e2) {
  return Jh(e2) <= 0;
}
function nf(e2, t2) {
  const r2 = e2._controlledWritableStream;
  Qh(e2), zh(r2, t2);
}
function af(e2) {
  return new TypeError(`WritableStream.prototype.${e2} can only be used on a WritableStream`);
}
function sf(e2) {
  return new TypeError(`WritableStreamDefaultWriter.prototype.${e2} can only be used on a WritableStreamDefaultWriter`);
}
function of(e2) {
  return new TypeError("Cannot " + e2 + " a stream using a released writer");
}
function cf(e2) {
  e2._closedPromise = Hc((t2, r2) => {
    e2._closedPromise_resolve = t2, e2._closedPromise_reject = r2, e2._closedPromiseState = "pending";
  });
}
function uf(e2, t2) {
  cf(e2), hf(e2, t2);
}
function hf(e2, t2) {
  e2._closedPromise_reject !== void 0 && (Jc(e2._closedPromise), e2._closedPromise_reject(t2), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0, e2._closedPromiseState = "rejected");
}
function ff(e2) {
  e2._closedPromise_resolve !== void 0 && (e2._closedPromise_resolve(void 0), e2._closedPromise_resolve = void 0, e2._closedPromise_reject = void 0, e2._closedPromiseState = "resolved");
}
function df(e2) {
  e2._readyPromise = Hc((t2, r2) => {
    e2._readyPromise_resolve = t2, e2._readyPromise_reject = r2;
  }), e2._readyPromiseState = "pending";
}
function lf(e2, t2) {
  df(e2), yf(e2, t2);
}
function pf(e2) {
  df(e2), bf(e2);
}
function yf(e2, t2) {
  e2._readyPromise_reject !== void 0 && (Jc(e2._readyPromise), e2._readyPromise_reject(t2), e2._readyPromise_resolve = void 0, e2._readyPromise_reject = void 0, e2._readyPromiseState = "rejected");
}
function bf(e2) {
  e2._readyPromise_resolve !== void 0 && (e2._readyPromise_resolve(void 0), e2._readyPromise_resolve = void 0, e2._readyPromise_reject = void 0, e2._readyPromiseState = "fulfilled");
}
Object.defineProperties(Yh.prototype, {error: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(Yh.prototype, Tc.toStringTag, {value: "WritableStreamDefaultController", configurable: true});
const mf = typeof DOMException != "undefined" ? DOMException : void 0;
const gf = function(e2) {
  if (typeof e2 != "function" && typeof e2 != "object")
    return false;
  try {
    return new e2(), true;
  } catch (e3) {
    return false;
  }
}(mf) ? mf : function() {
  const e2 = function(e3, t2) {
    this.message = e3 || "", this.name = t2 || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  };
  return Object.defineProperty(e2.prototype = Object.create(Error.prototype), "constructor", {value: e2, writable: true, configurable: true}), e2;
}();
function wf(e2, t2, r2, i2, n2, a2) {
  const s2 = xu(e2), o2 = Kh(t2);
  e2._disturbed = true;
  let c2 = false, u2 = Gc(void 0);
  return Hc((h2, f2) => {
    let d2;
    if (a2 !== void 0) {
      if (d2 = () => {
        const r3 = new gf("Aborted", "AbortError"), a3 = [];
        i2 || a3.push(() => t2._state === "writable" ? Ih(t2, r3) : Gc(void 0)), n2 || a3.push(() => e2._state === "readable" ? Lf(e2, r3) : Gc(void 0)), y2(() => Promise.all(a3.map((e3) => e3())), true, r3);
      }, a2.aborted)
        return void d2();
      a2.addEventListener("abort", d2);
    }
    if (p2(e2, s2._closedPromise, (e3) => {
      i2 ? b2(true, e3) : y2(() => Ih(t2, e3), true, e3);
    }), p2(t2, o2._closedPromise, (t3) => {
      n2 ? b2(true, t3) : y2(() => Lf(e2, t3), true, t3);
    }), function(e3, t3, r3) {
      e3._state === "closed" ? r3() : Yc(t3, r3);
    }(e2, s2._closedPromise, () => {
      r2 ? b2() : y2(() => function(e3) {
        const t3 = e3._ownerWritableStream, r3 = t3._state;
        return Oh(t3) || r3 === "closed" ? Gc(void 0) : r3 === "errored" ? Vc(t3._storedError) : Wh(e3);
      }(o2));
    }), Oh(t2) || t2._state === "closed") {
      const t3 = new TypeError("the destination writable stream closed before all data could be piped to it");
      n2 ? b2(true, t3) : y2(() => Lf(e2, t3), true, t3);
    }
    function l2() {
      const e3 = u2;
      return $c(u2, () => e3 !== u2 ? l2() : void 0);
    }
    function p2(e3, t3, r3) {
      e3._state === "errored" ? r3(e3._storedError) : Xc(t3, r3);
    }
    function y2(e3, r3, i3) {
      function n3() {
        Zc(e3(), () => m2(r3, i3), (e4) => m2(true, e4));
      }
      c2 || (c2 = true, t2._state !== "writable" || Oh(t2) ? n3() : Yc(l2(), n3));
    }
    function b2(e3, r3) {
      c2 || (c2 = true, t2._state !== "writable" || Oh(t2) ? m2(e3, r3) : Yc(l2(), () => m2(e3, r3)));
    }
    function m2(e3, t3) {
      Vh(o2), su(s2), a2 !== void 0 && a2.removeEventListener("abort", d2), e3 ? f2(t3) : h2(void 0);
    }
    Jc(Hc((e3, t3) => {
      !function r3(i3) {
        i3 ? e3() : $c(c2 ? Gc(true) : $c(o2._readyPromise, () => Hc((e4, t4) => {
          Iu(s2, {_chunkSteps: (t5) => {
            u2 = $c($h(o2, t5), void 0, zc), e4(false);
          }, _closeSteps: () => e4(true), _errorSteps: t4});
        })), r3, t3);
      }(false);
    }));
  });
}
class vf {
  constructor() {
    throw new TypeError("Illegal constructor");
  }
  get desiredSize() {
    if (!_f(this))
      throw Df("desiredSize");
    return Mf(this);
  }
  close() {
    if (!_f(this))
      throw Df("close");
    if (!Cf(this))
      throw new TypeError("The stream is not in a state that permits close");
    Ef(this);
  }
  enqueue(e2) {
    if (!_f(this))
      throw Df("enqueue");
    if (!Cf(this))
      throw new TypeError("The stream is not in a state that permits enqueue");
    return Pf(this, e2);
  }
  error(e2) {
    if (!_f(this))
      throw Df("error");
    xf(this, e2);
  }
  [pu](e2) {
    Hu(this);
    const t2 = this._cancelAlgorithm(e2);
    return Sf(this), t2;
  }
  [yu](e2) {
    const t2 = this._controlledReadableStream;
    if (this._queue.length > 0) {
      const r2 = Lu(this);
      this._closeRequested && this._queue.length === 0 ? (Sf(this), Wf(t2)) : kf(this), e2._chunkSteps(r2);
    } else
      Mu(t2, e2), kf(this);
  }
}
function _f(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_controlledReadableStream");
}
function kf(e2) {
  if (!Af(e2))
    return;
  if (e2._pulling)
    return void (e2._pullAgain = true);
  e2._pulling = true;
  Zc(e2._pullAlgorithm(), () => {
    e2._pulling = false, e2._pullAgain && (e2._pullAgain = false, kf(e2));
  }, (t2) => {
    xf(e2, t2);
  });
}
function Af(e2) {
  const t2 = e2._controlledReadableStream;
  if (!Cf(e2))
    return false;
  if (!e2._started)
    return false;
  if (jf(t2) && Ku(t2) > 0)
    return true;
  return Mf(e2) > 0;
}
function Sf(e2) {
  e2._pullAlgorithm = void 0, e2._cancelAlgorithm = void 0, e2._strategySizeAlgorithm = void 0;
}
function Ef(e2) {
  if (!Cf(e2))
    return;
  const t2 = e2._controlledReadableStream;
  e2._closeRequested = true, e2._queue.length === 0 && (Sf(e2), Wf(t2));
}
function Pf(e2, t2) {
  if (!Cf(e2))
    return;
  const r2 = e2._controlledReadableStream;
  if (jf(r2) && Ku(r2) > 0)
    Cu(r2, t2, false);
  else {
    let r3;
    try {
      r3 = e2._strategySizeAlgorithm(t2);
    } catch (t3) {
      throw xf(e2, t3), t3;
    }
    try {
      Wu(e2, t2, r3);
    } catch (t3) {
      throw xf(e2, t3), t3;
    }
  }
  kf(e2);
}
function xf(e2, t2) {
  const r2 = e2._controlledReadableStream;
  r2._state === "readable" && (Hu(e2), Sf(e2), Hf(r2, t2));
}
function Mf(e2) {
  const t2 = e2._controlledReadableStream._state;
  return t2 === "errored" ? null : t2 === "closed" ? 0 : e2._strategyHWM - e2._queueTotalSize;
}
function Cf(e2) {
  const t2 = e2._controlledReadableStream._state;
  return !e2._closeRequested && t2 === "readable";
}
function Kf(e2, t2, r2, i2, n2, a2, s2) {
  t2._controlledReadableStream = e2, t2._queue = void 0, t2._queueTotalSize = void 0, Hu(t2), t2._started = false, t2._closeRequested = false, t2._pullAgain = false, t2._pulling = false, t2._strategySizeAlgorithm = s2, t2._strategyHWM = a2, t2._pullAlgorithm = i2, t2._cancelAlgorithm = n2, e2._readableStreamController = t2;
  Zc(Gc(r2()), () => {
    t2._started = true, kf(t2);
  }, (e3) => {
    xf(t2, e3);
  });
}
function Df(e2) {
  return new TypeError(`ReadableStreamDefaultController.prototype.${e2} can only be used on a ReadableStreamDefaultController`);
}
function Rf(e2, t2, r2) {
  return wu(e2, r2), (r3) => ru(e2, t2, [r3]);
}
function Uf(e2, t2, r2) {
  return wu(e2, r2), (r3) => ru(e2, t2, [r3]);
}
function If(e2, t2, r2) {
  return wu(e2, r2), (r3) => tu(e2, t2, [r3]);
}
function Bf(e2, t2) {
  if ((e2 = "" + e2) !== "bytes")
    throw new TypeError(`${t2} '${e2}' is not a valid enumeration value for ReadableStreamType`);
  return e2;
}
function Tf(e2, t2) {
  if ((e2 = "" + e2) !== "byob")
    throw new TypeError(`${t2} '${e2}' is not a valid enumeration value for ReadableStreamReaderMode`);
  return e2;
}
function zf(e2, t2) {
  gu(e2, t2);
  const r2 = e2 == null ? void 0 : e2.preventAbort, i2 = e2 == null ? void 0 : e2.preventCancel, n2 = e2 == null ? void 0 : e2.preventClose, a2 = e2 == null ? void 0 : e2.signal;
  return a2 !== void 0 && function(e3, t3) {
    if (!function(e4) {
      if (typeof e4 != "object" || e4 === null)
        return false;
      try {
        return typeof e4.aborted == "boolean";
      } catch (e5) {
        return false;
      }
    }(e3))
      throw new TypeError(t3 + " is not an AbortSignal.");
  }(a2, t2 + " has member 'signal' that"), {preventAbort: !!r2, preventCancel: !!i2, preventClose: !!n2, signal: a2};
}
Object.defineProperties(vf.prototype, {close: {enumerable: true}, enqueue: {enumerable: true}, error: {enumerable: true}, desiredSize: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(vf.prototype, Tc.toStringTag, {value: "ReadableStreamDefaultController", configurable: true});
class qf {
  constructor(e2 = {}, t2 = {}) {
    e2 === void 0 ? e2 = null : vu(e2, "First parameter");
    const r2 = kh(t2, "Second parameter"), i2 = function(e3, t3) {
      gu(e3, t3);
      const r3 = e3, i3 = r3 == null ? void 0 : r3.autoAllocateChunkSize, n2 = r3 == null ? void 0 : r3.cancel, a2 = r3 == null ? void 0 : r3.pull, s2 = r3 == null ? void 0 : r3.start, o2 = r3 == null ? void 0 : r3.type;
      return {autoAllocateChunkSize: i3 === void 0 ? void 0 : Eu(i3, t3 + " has member 'autoAllocateChunkSize' that"), cancel: n2 === void 0 ? void 0 : Rf(n2, r3, t3 + " has member 'cancel' that"), pull: a2 === void 0 ? void 0 : Uf(a2, r3, t3 + " has member 'pull' that"), start: s2 === void 0 ? void 0 : If(s2, r3, t3 + " has member 'start' that"), type: o2 === void 0 ? void 0 : Bf(o2, t3 + " has member 'type' that")};
    }(e2, "First parameter");
    if (Ff(this), i2.type === "bytes") {
      if (r2.size !== void 0)
        throw new RangeError("The strategy for a byte stream cannot have a size function");
      fh(this, i2, vh(r2, 0));
    } else {
      const e3 = _h(r2);
      !function(e4, t3, r3, i3) {
        const n2 = Object.create(vf.prototype);
        let a2 = () => {
        }, s2 = () => Gc(void 0), o2 = () => Gc(void 0);
        t3.start !== void 0 && (a2 = () => t3.start(n2)), t3.pull !== void 0 && (s2 = () => t3.pull(n2)), t3.cancel !== void 0 && (o2 = (e5) => t3.cancel(e5)), Kf(e4, n2, a2, s2, o2, r3, i3);
      }(this, i2, vh(r2, 1), e3);
    }
  }
  get locked() {
    if (!Nf(this))
      throw Gf("locked");
    return jf(this);
  }
  cancel(e2) {
    return Nf(this) ? jf(this) ? Vc(new TypeError("Cannot cancel a stream that already has a reader")) : Lf(this, e2) : Vc(Gf("cancel"));
  }
  getReader(e2) {
    if (!Nf(this))
      throw Gf("getReader");
    return function(e3, t2) {
      gu(e3, t2);
      const r2 = e3 == null ? void 0 : e3.mode;
      return {mode: r2 === void 0 ? void 0 : Tf(r2, t2 + " has member 'mode' that")};
    }(e2, "First parameter").mode === void 0 ? xu(this) : function(e3) {
      return new mh(e3);
    }(this);
  }
  pipeThrough(e2, t2 = {}) {
    if (!Nf(this))
      throw Gf("pipeThrough");
    _u(e2, 1, "pipeThrough");
    const r2 = function(e3, t3) {
      gu(e3, t3);
      const r3 = e3 == null ? void 0 : e3.readable;
      ku(r3, "readable", "ReadableWritablePair"), Pu(r3, t3 + " has member 'readable' that");
      const i3 = e3 == null ? void 0 : e3.writable;
      return ku(i3, "writable", "ReadableWritablePair"), Mh(i3, t3 + " has member 'writable' that"), {readable: r3, writable: i3};
    }(e2, "First parameter"), i2 = zf(t2, "Second parameter");
    if (jf(this))
      throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
    if (Uh(r2.writable))
      throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
    return Jc(wf(this, r2.writable, i2.preventClose, i2.preventAbort, i2.preventCancel, i2.signal)), r2.readable;
  }
  pipeTo(e2, t2 = {}) {
    if (!Nf(this))
      return Vc(Gf("pipeTo"));
    if (e2 === void 0)
      return Vc("Parameter 1 is required in 'pipeTo'.");
    if (!Rh(e2))
      return Vc(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
    let r2;
    try {
      r2 = zf(t2, "Second parameter");
    } catch (e3) {
      return Vc(e3);
    }
    return jf(this) ? Vc(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Uh(e2) ? Vc(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : wf(this, e2, r2.preventClose, r2.preventAbort, r2.preventCancel, r2.signal);
  }
  tee() {
    if (!Nf(this))
      throw Gf("tee");
    const e2 = function(e3, t2) {
      const r2 = xu(e3);
      let i2, n2, a2, s2, o2, c2 = false, u2 = false, h2 = false;
      const f2 = Hc((e4) => {
        o2 = e4;
      });
      function d2() {
        return c2 || (c2 = true, Iu(r2, {_chunkSteps: (e4) => {
          eu(() => {
            c2 = false;
            const t3 = e4, r3 = e4;
            u2 || Pf(a2._readableStreamController, t3), h2 || Pf(s2._readableStreamController, r3);
          });
        }, _closeSteps: () => {
          c2 = false, u2 || Ef(a2._readableStreamController), h2 || Ef(s2._readableStreamController), u2 && h2 || o2(void 0);
        }, _errorSteps: () => {
          c2 = false;
        }})), Gc(void 0);
      }
      function l2() {
      }
      return a2 = Of(l2, d2, function(t3) {
        if (u2 = true, i2 = t3, h2) {
          const t4 = Gu([i2, n2]), r3 = Lf(e3, t4);
          o2(r3);
        }
        return f2;
      }), s2 = Of(l2, d2, function(t3) {
        if (h2 = true, n2 = t3, u2) {
          const t4 = Gu([i2, n2]), r3 = Lf(e3, t4);
          o2(r3);
        }
        return f2;
      }), Xc(r2._closedPromise, (e4) => {
        xf(a2._readableStreamController, e4), xf(s2._readableStreamController, e4), u2 && h2 || o2(void 0);
      }), [a2, s2];
    }(this);
    return Gu(e2);
  }
  values(e2) {
    if (!Nf(this))
      throw Gf("values");
    return function(e3, t2) {
      const r2 = xu(e3), i2 = new zu(r2, t2), n2 = Object.create(qu);
      return n2._asyncIteratorImpl = i2, n2;
    }(this, function(e3, t2) {
      return gu(e3, t2), {preventCancel: !!(e3 == null ? void 0 : e3.preventCancel)};
    }(e2, "First parameter").preventCancel);
  }
}
function Of(e2, t2, r2, i2 = 1, n2 = () => 1) {
  const a2 = Object.create(qf.prototype);
  Ff(a2);
  return Kf(a2, Object.create(vf.prototype), e2, t2, r2, i2, n2), a2;
}
function Ff(e2) {
  e2._state = "readable", e2._reader = void 0, e2._storedError = void 0, e2._disturbed = false;
}
function Nf(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_readableStreamController");
}
function jf(e2) {
  return e2._reader !== void 0;
}
function Lf(e2, t2) {
  if (e2._disturbed = true, e2._state === "closed")
    return Gc(void 0);
  if (e2._state === "errored")
    return Vc(e2._storedError);
  Wf(e2);
  return Qc(e2._readableStreamController[pu](t2), zc);
}
function Wf(e2) {
  e2._state = "closed";
  const t2 = e2._reader;
  t2 !== void 0 && (fu(t2), Uu(t2) && (t2._readRequests.forEach((e3) => {
    e3._closeSteps();
  }), t2._readRequests = new iu()));
}
function Hf(e2, t2) {
  e2._state = "errored", e2._storedError = t2;
  const r2 = e2._reader;
  r2 !== void 0 && (hu(r2, t2), Uu(r2) ? (r2._readRequests.forEach((e3) => {
    e3._errorSteps(t2);
  }), r2._readRequests = new iu()) : (r2._readIntoRequests.forEach((e3) => {
    e3._errorSteps(t2);
  }), r2._readIntoRequests = new iu()));
}
function Gf(e2) {
  return new TypeError(`ReadableStream.prototype.${e2} can only be used on a ReadableStream`);
}
function Vf(e2, t2) {
  gu(e2, t2);
  const r2 = e2 == null ? void 0 : e2.highWaterMark;
  return ku(r2, "highWaterMark", "QueuingStrategyInit"), {highWaterMark: Au(r2)};
}
Object.defineProperties(qf.prototype, {cancel: {enumerable: true}, getReader: {enumerable: true}, pipeThrough: {enumerable: true}, pipeTo: {enumerable: true}, tee: {enumerable: true}, values: {enumerable: true}, locked: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(qf.prototype, Tc.toStringTag, {value: "ReadableStream", configurable: true}), typeof Tc.asyncIterator == "symbol" && Object.defineProperty(qf.prototype, Tc.asyncIterator, {value: qf.prototype.values, writable: true, configurable: true});
const $f = function(e2) {
  return e2.byteLength;
};
class Zf {
  constructor(e2) {
    _u(e2, 1, "ByteLengthQueuingStrategy"), e2 = Vf(e2, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = e2.highWaterMark;
  }
  get highWaterMark() {
    if (!Xf(this))
      throw Yf("highWaterMark");
    return this._byteLengthQueuingStrategyHighWaterMark;
  }
  get size() {
    if (!Xf(this))
      throw Yf("size");
    return $f;
  }
}
function Yf(e2) {
  return new TypeError(`ByteLengthQueuingStrategy.prototype.${e2} can only be used on a ByteLengthQueuingStrategy`);
}
function Xf(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_byteLengthQueuingStrategyHighWaterMark");
}
Object.defineProperties(Zf.prototype, {highWaterMark: {enumerable: true}, size: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(Zf.prototype, Tc.toStringTag, {value: "ByteLengthQueuingStrategy", configurable: true});
const Qf = function() {
  return 1;
};
class Jf {
  constructor(e2) {
    _u(e2, 1, "CountQueuingStrategy"), e2 = Vf(e2, "First parameter"), this._countQueuingStrategyHighWaterMark = e2.highWaterMark;
  }
  get highWaterMark() {
    if (!td(this))
      throw ed("highWaterMark");
    return this._countQueuingStrategyHighWaterMark;
  }
  get size() {
    if (!td(this))
      throw ed("size");
    return Qf;
  }
}
function ed(e2) {
  return new TypeError(`CountQueuingStrategy.prototype.${e2} can only be used on a CountQueuingStrategy`);
}
function td(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_countQueuingStrategyHighWaterMark");
}
function rd(e2, t2, r2) {
  return wu(e2, r2), (r3) => ru(e2, t2, [r3]);
}
function id(e2, t2, r2) {
  return wu(e2, r2), (r3) => tu(e2, t2, [r3]);
}
function nd(e2, t2, r2) {
  return wu(e2, r2), (r3, i2) => ru(e2, t2, [r3, i2]);
}
Object.defineProperties(Jf.prototype, {highWaterMark: {enumerable: true}, size: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(Jf.prototype, Tc.toStringTag, {value: "CountQueuingStrategy", configurable: true});
class ad {
  constructor(e2 = {}, t2 = {}, r2 = {}) {
    e2 === void 0 && (e2 = null);
    const i2 = kh(t2, "Second parameter"), n2 = kh(r2, "Third parameter"), a2 = function(e3, t3) {
      gu(e3, t3);
      const r3 = e3 == null ? void 0 : e3.flush, i3 = e3 == null ? void 0 : e3.readableType, n3 = e3 == null ? void 0 : e3.start, a3 = e3 == null ? void 0 : e3.transform, s3 = e3 == null ? void 0 : e3.writableType;
      return {flush: r3 === void 0 ? void 0 : rd(r3, e3, t3 + " has member 'flush' that"), readableType: i3, start: n3 === void 0 ? void 0 : id(n3, e3, t3 + " has member 'start' that"), transform: a3 === void 0 ? void 0 : nd(a3, e3, t3 + " has member 'transform' that"), writableType: s3};
    }(e2, "First parameter");
    if (a2.readableType !== void 0)
      throw new RangeError("Invalid readableType specified");
    if (a2.writableType !== void 0)
      throw new RangeError("Invalid writableType specified");
    const s2 = vh(n2, 0), o2 = _h(n2), c2 = vh(i2, 1), u2 = _h(i2);
    let h2;
    !function(e3, t3, r3, i3, n3, a3) {
      function s3() {
        return t3;
      }
      function o3(t4) {
        return function(e4, t5) {
          const r4 = e4._transformStreamController;
          if (e4._backpressure) {
            return Qc(e4._backpressureChangePromise, () => {
              const i4 = e4._writable;
              if (i4._state === "erroring")
                throw i4._storedError;
              return pd(r4, t5);
            });
          }
          return pd(r4, t5);
        }(e3, t4);
      }
      function c3(t4) {
        return function(e4, t5) {
          return od(e4, t5), Gc(void 0);
        }(e3, t4);
      }
      function u3() {
        return function(e4) {
          const t4 = e4._readable, r4 = e4._transformStreamController, i4 = r4._flushAlgorithm();
          return dd(r4), Qc(i4, () => {
            if (t4._state === "errored")
              throw t4._storedError;
            Ef(t4._readableStreamController);
          }, (r5) => {
            throw od(e4, r5), t4._storedError;
          });
        }(e3);
      }
      function h3() {
        return function(e4) {
          return ud(e4, false), e4._backpressureChangePromise;
        }(e3);
      }
      function f2(t4) {
        return cd(e3, t4), Gc(void 0);
      }
      e3._writable = function(e4, t4, r4, i4, n4 = 1, a4 = () => 1) {
        const s4 = Object.create(Ch.prototype);
        return Dh(s4), Xh(s4, Object.create(Yh.prototype), e4, t4, r4, i4, n4, a4), s4;
      }(s3, o3, u3, c3, r3, i3), e3._readable = Of(s3, h3, f2, n3, a3), e3._backpressure = void 0, e3._backpressureChangePromise = void 0, e3._backpressureChangePromise_resolve = void 0, ud(e3, true), e3._transformStreamController = void 0;
    }(this, Hc((e3) => {
      h2 = e3;
    }), c2, u2, s2, o2), function(e3, t3) {
      const r3 = Object.create(hd.prototype);
      let i3 = (e4) => {
        try {
          return ld(r3, e4), Gc(void 0);
        } catch (e5) {
          return Vc(e5);
        }
      }, n3 = () => Gc(void 0);
      t3.transform !== void 0 && (i3 = (e4) => t3.transform(e4, r3));
      t3.flush !== void 0 && (n3 = () => t3.flush(r3));
      !function(e4, t4, r4, i4) {
        t4._controlledTransformStream = e4, e4._transformStreamController = t4, t4._transformAlgorithm = r4, t4._flushAlgorithm = i4;
      }(e3, r3, i3, n3);
    }(this, a2), a2.start !== void 0 ? h2(a2.start(this._transformStreamController)) : h2(void 0);
  }
  get readable() {
    if (!sd(this))
      throw bd("readable");
    return this._readable;
  }
  get writable() {
    if (!sd(this))
      throw bd("writable");
    return this._writable;
  }
}
function sd(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_transformStreamController");
}
function od(e2, t2) {
  xf(e2._readable._readableStreamController, t2), cd(e2, t2);
}
function cd(e2, t2) {
  dd(e2._transformStreamController), tf(e2._writable._writableStreamController, t2), e2._backpressure && ud(e2, false);
}
function ud(e2, t2) {
  e2._backpressureChangePromise !== void 0 && e2._backpressureChangePromise_resolve(), e2._backpressureChangePromise = Hc((t3) => {
    e2._backpressureChangePromise_resolve = t3;
  }), e2._backpressure = t2;
}
Object.defineProperties(ad.prototype, {readable: {enumerable: true}, writable: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(ad.prototype, Tc.toStringTag, {value: "TransformStream", configurable: true});
class hd {
  constructor() {
    throw new TypeError("Illegal constructor");
  }
  get desiredSize() {
    if (!fd(this))
      throw yd("desiredSize");
    return Mf(this._controlledTransformStream._readable._readableStreamController);
  }
  enqueue(e2) {
    if (!fd(this))
      throw yd("enqueue");
    ld(this, e2);
  }
  error(e2) {
    if (!fd(this))
      throw yd("error");
    var t2;
    t2 = e2, od(this._controlledTransformStream, t2);
  }
  terminate() {
    if (!fd(this))
      throw yd("terminate");
    !function(e2) {
      const t2 = e2._controlledTransformStream;
      Ef(t2._readable._readableStreamController);
      cd(t2, new TypeError("TransformStream terminated"));
    }(this);
  }
}
function fd(e2) {
  return !!Oc(e2) && !!Object.prototype.hasOwnProperty.call(e2, "_controlledTransformStream");
}
function dd(e2) {
  e2._transformAlgorithm = void 0, e2._flushAlgorithm = void 0;
}
function ld(e2, t2) {
  const r2 = e2._controlledTransformStream, i2 = r2._readable._readableStreamController;
  if (!Cf(i2))
    throw new TypeError("Readable side is not in a state that permits enqueue");
  try {
    Pf(i2, t2);
  } catch (e3) {
    throw cd(r2, e3), r2._readable._storedError;
  }
  (function(e3) {
    return !Af(e3);
  })(i2) !== r2._backpressure && ud(r2, true);
}
function pd(e2, t2) {
  return Qc(e2._transformAlgorithm(t2), void 0, (t3) => {
    throw od(e2._controlledTransformStream, t3), t3;
  });
}
function yd(e2) {
  return new TypeError(`TransformStreamDefaultController.prototype.${e2} can only be used on a TransformStreamDefaultController`);
}
function bd(e2) {
  return new TypeError(`TransformStream.prototype.${e2} can only be used on a TransformStream`);
}
Object.defineProperties(hd.prototype, {enqueue: {enumerable: true}, error: {enumerable: true}, terminate: {enumerable: true}, desiredSize: {enumerable: true}}), typeof Tc.toStringTag == "symbol" && Object.defineProperty(hd.prototype, Tc.toStringTag, {value: "TransformStreamDefaultController", configurable: true});
var md = /* @__PURE__ */ Object.freeze({__proto__: null, ByteLengthQueuingStrategy: Zf, CountQueuingStrategy: Jf, ReadableByteStreamController: $u, ReadableStream: qf, ReadableStreamBYOBReader: mh, ReadableStreamBYOBRequest: Vu, ReadableStreamDefaultController: vf, ReadableStreamDefaultReader: Ru, TransformStream: ad, TransformStreamDefaultController: hd, WritableStream: Ch, WritableStreamDefaultController: Yh, WritableStreamDefaultWriter: jh}), gd = function(e2, t2) {
  return (gd = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(e3, t3) {
    e3.__proto__ = t3;
  } || function(e3, t3) {
    for (var r2 in t3)
      Object.prototype.hasOwnProperty.call(t3, r2) && (e3[r2] = t3[r2]);
  })(e2, t2);
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function wd(e2, t2) {
  if (typeof t2 != "function" && t2 !== null)
    throw new TypeError("Class extends value " + t2 + " is not a constructor or null");
  function r2() {
    this.constructor = e2;
  }
  gd(e2, t2), e2.prototype = t2 === null ? Object.create(t2) : (r2.prototype = t2.prototype, new r2());
}
function vd(e2) {
  if (!e2)
    throw new TypeError("Assertion failed");
}
function _d() {
}
function kd(e2) {
  return typeof e2 == "object" && e2 !== null || typeof e2 == "function";
}
function Ad(e2) {
  if (typeof e2 != "function")
    return false;
  var t2 = false;
  try {
    new e2({start: function() {
      t2 = true;
    }});
  } catch (e3) {
  }
  return t2;
}
function Sd(e2) {
  return !!kd(e2) && typeof e2.getReader == "function";
}
function Ed(e2) {
  return !!kd(e2) && typeof e2.getWriter == "function";
}
function Pd(e2) {
  return !!kd(e2) && (!!Sd(e2.readable) && !!Ed(e2.writable));
}
function xd(e2) {
  try {
    return e2.getReader({mode: "byob"}).releaseLock(), true;
  } catch (e3) {
    return false;
  }
}
function Md(e2, t2) {
  var r2 = (t2 === void 0 ? {} : t2).type;
  return vd(Sd(e2)), vd(e2.locked === false), (r2 = Cd(r2)) === "bytes" ? new Ud(e2) : new Dd(e2);
}
function Cd(e2) {
  var t2 = e2 + "";
  if (t2 === "bytes")
    return t2;
  if (e2 === void 0)
    return e2;
  throw new RangeError("Invalid type is specified");
}
var Kd = function() {
  function e2(e3) {
    this._underlyingReader = void 0, this._readerMode = void 0, this._readableStreamController = void 0, this._pendingRead = void 0, this._underlyingStream = e3, this._attachDefaultReader();
  }
  return e2.prototype.start = function(e3) {
    this._readableStreamController = e3;
  }, e2.prototype.cancel = function(e3) {
    return vd(this._underlyingReader !== void 0), this._underlyingReader.cancel(e3);
  }, e2.prototype._attachDefaultReader = function() {
    if (this._readerMode !== "default") {
      this._detachReader();
      var e3 = this._underlyingStream.getReader();
      this._readerMode = "default", this._attachReader(e3);
    }
  }, e2.prototype._attachReader = function(e3) {
    var t2 = this;
    vd(this._underlyingReader === void 0), this._underlyingReader = e3;
    var r2 = this._underlyingReader.closed;
    r2 && r2.then(function() {
      return t2._finishPendingRead();
    }).then(function() {
      e3 === t2._underlyingReader && t2._readableStreamController.close();
    }, function(r3) {
      e3 === t2._underlyingReader && t2._readableStreamController.error(r3);
    }).catch(_d);
  }, e2.prototype._detachReader = function() {
    this._underlyingReader !== void 0 && (this._underlyingReader.releaseLock(), this._underlyingReader = void 0, this._readerMode = void 0);
  }, e2.prototype._pullWithDefaultReader = function() {
    var e3 = this;
    this._attachDefaultReader();
    var t2 = this._underlyingReader.read().then(function(t3) {
      var r2 = e3._readableStreamController;
      t3.done ? e3._tryClose() : r2.enqueue(t3.value);
    });
    return this._setPendingRead(t2), t2;
  }, e2.prototype._tryClose = function() {
    try {
      this._readableStreamController.close();
    } catch (e3) {
    }
  }, e2.prototype._setPendingRead = function(e3) {
    var t2, r2 = this, i2 = function() {
      r2._pendingRead === t2 && (r2._pendingRead = void 0);
    };
    this._pendingRead = t2 = e3.then(i2, i2);
  }, e2.prototype._finishPendingRead = function() {
    var e3 = this;
    if (this._pendingRead) {
      var t2 = function() {
        return e3._finishPendingRead();
      };
      return this._pendingRead.then(t2, t2);
    }
  }, e2;
}(), Dd = function(e2) {
  function t2() {
    return e2 !== null && e2.apply(this, arguments) || this;
  }
  return wd(t2, e2), t2.prototype.pull = function() {
    return this._pullWithDefaultReader();
  }, t2;
}(Kd);
function Rd(e2) {
  return new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength);
}
var Ud = function(e2) {
  function t2(t3) {
    var r2 = this, i2 = xd(t3);
    return (r2 = e2.call(this, t3) || this)._supportsByob = i2, r2;
  }
  return wd(t2, e2), Object.defineProperty(t2.prototype, "type", {get: function() {
    return "bytes";
  }, enumerable: false, configurable: true}), t2.prototype._attachByobReader = function() {
    if (this._readerMode !== "byob") {
      vd(this._supportsByob), this._detachReader();
      var e3 = this._underlyingStream.getReader({mode: "byob"});
      this._readerMode = "byob", this._attachReader(e3);
    }
  }, t2.prototype.pull = function() {
    if (this._supportsByob) {
      var e3 = this._readableStreamController.byobRequest;
      if (e3)
        return this._pullWithByobRequest(e3);
    }
    return this._pullWithDefaultReader();
  }, t2.prototype._pullWithByobRequest = function(e3) {
    var t3 = this;
    this._attachByobReader();
    var r2 = new Uint8Array(e3.view.byteLength), i2 = this._underlyingReader.read(r2).then(function(r3) {
      var i3, n2, a2;
      t3._readableStreamController, r3.done ? (t3._tryClose(), e3.respond(0)) : (i3 = r3.value, n2 = e3.view, a2 = Rd(i3), Rd(n2).set(a2, 0), e3.respond(r3.value.byteLength));
    });
    return this._setPendingRead(i2), i2;
  }, t2;
}(Kd);
function Id(e2) {
  vd(Ed(e2)), vd(e2.locked === false);
  var t2 = e2.getWriter();
  return new Bd(t2);
}
var Bd = function() {
  function e2(e3) {
    var t2 = this;
    this._writableStreamController = void 0, this._pendingWrite = void 0, this._state = "writable", this._storedError = void 0, this._underlyingWriter = e3, this._errorPromise = new Promise(function(e4, r2) {
      t2._errorPromiseReject = r2;
    }), this._errorPromise.catch(_d);
  }
  return e2.prototype.start = function(e3) {
    var t2 = this;
    this._writableStreamController = e3, this._underlyingWriter.closed.then(function() {
      t2._state = "closed";
    }).catch(function(e4) {
      return t2._finishErroring(e4);
    });
  }, e2.prototype.write = function(e3) {
    var t2 = this, r2 = this._underlyingWriter;
    if (r2.desiredSize === null)
      return r2.ready;
    var i2 = r2.write(e3);
    i2.catch(function(e4) {
      return t2._finishErroring(e4);
    }), r2.ready.catch(function(e4) {
      return t2._startErroring(e4);
    });
    var n2 = Promise.race([i2, this._errorPromise]);
    return this._setPendingWrite(n2), n2;
  }, e2.prototype.close = function() {
    var e3 = this;
    return this._pendingWrite === void 0 ? this._underlyingWriter.close() : this._finishPendingWrite().then(function() {
      return e3.close();
    });
  }, e2.prototype.abort = function(e3) {
    if (this._state !== "errored")
      return this._underlyingWriter.abort(e3);
  }, e2.prototype._setPendingWrite = function(e3) {
    var t2, r2 = this, i2 = function() {
      r2._pendingWrite === t2 && (r2._pendingWrite = void 0);
    };
    this._pendingWrite = t2 = e3.then(i2, i2);
  }, e2.prototype._finishPendingWrite = function() {
    var e3 = this;
    if (this._pendingWrite === void 0)
      return Promise.resolve();
    var t2 = function() {
      return e3._finishPendingWrite();
    };
    return this._pendingWrite.then(t2, t2);
  }, e2.prototype._startErroring = function(e3) {
    var t2 = this;
    if (this._state === "writable") {
      this._state = "erroring", this._storedError = e3;
      var r2 = function() {
        return t2._finishErroring(e3);
      };
      this._pendingWrite === void 0 ? r2() : this._finishPendingWrite().then(r2, r2), this._writableStreamController.error(e3);
    }
  }, e2.prototype._finishErroring = function(e3) {
    this._state === "writable" && this._startErroring(e3), this._state === "erroring" && (this._state = "errored", this._errorPromiseReject(this._storedError));
  }, e2;
}();
function Td(e2) {
  vd(Pd(e2));
  var t2 = e2.readable, r2 = e2.writable;
  vd(t2.locked === false), vd(r2.locked === false);
  var i2, n2 = t2.getReader();
  try {
    i2 = r2.getWriter();
  } catch (e3) {
    throw n2.releaseLock(), e3;
  }
  return new zd(n2, i2);
}
var zd = function() {
  function e2(e3, t2) {
    var r2 = this;
    this._transformStreamController = void 0, this._onRead = function(e4) {
      if (!e4.done)
        return r2._transformStreamController.enqueue(e4.value), r2._reader.read().then(r2._onRead);
    }, this._onError = function(e4) {
      r2._flushReject(e4), r2._transformStreamController.error(e4), r2._reader.cancel(e4).catch(_d), r2._writer.abort(e4).catch(_d);
    }, this._onTerminate = function() {
      r2._flushResolve(), r2._transformStreamController.terminate();
      var e4 = new TypeError("TransformStream terminated");
      r2._writer.abort(e4).catch(_d);
    }, this._reader = e3, this._writer = t2, this._flushPromise = new Promise(function(e4, t3) {
      r2._flushResolve = e4, r2._flushReject = t3;
    });
  }
  return e2.prototype.start = function(e3) {
    this._transformStreamController = e3, this._reader.read().then(this._onRead).then(this._onTerminate, this._onError);
    var t2 = this._reader.closed;
    t2 && t2.then(this._onTerminate, this._onError);
  }, e2.prototype.transform = function(e3) {
    return this._writer.write(e3);
  }, e2.prototype.flush = function() {
    var e3 = this;
    return this._writer.close().then(function() {
      return e3._flushPromise;
    });
  }, e2;
}(), qd = /* @__PURE__ */ Object.freeze({__proto__: null, createReadableStreamWrapper: function(e2) {
  vd(function(e3) {
    return !!Ad(e3) && !!Sd(new e3());
  }(e2));
  var t2 = function(e3) {
    try {
      return new e3({type: "bytes"}), true;
    } catch (e4) {
      return false;
    }
  }(e2);
  return function(r2, i2) {
    var n2 = (i2 === void 0 ? {} : i2).type;
    if ((n2 = Cd(n2)) !== "bytes" || t2 || (n2 = void 0), r2.constructor === e2 && (n2 !== "bytes" || xd(r2)))
      return r2;
    if (n2 === "bytes") {
      var a2 = Md(r2, {type: n2});
      return new e2(a2);
    }
    a2 = Md(r2);
    return new e2(a2);
  };
}, createTransformStreamWrapper: function(e2) {
  return vd(function(e3) {
    return !!Ad(e3) && !!Pd(new e3());
  }(e2)), function(t2) {
    if (t2.constructor === e2)
      return t2;
    var r2 = Td(t2);
    return new e2(r2);
  };
}, createWrappingReadableSource: Md, createWrappingTransformer: Td, createWrappingWritableSink: Id, createWritableStreamWrapper: function(e2) {
  return vd(function(e3) {
    return !!Ad(e3) && !!Ed(new e3());
  }(e2)), function(t2) {
    if (t2.constructor === e2)
      return t2;
    var r2 = Id(t2);
    return new e2(r2);
  };
}}), Od = tt(function(e2) {
  !function(e3, t2) {
    function r2(e4, t3) {
      if (!e4)
        throw Error(t3 || "Assertion failed");
    }
    function i2(e4, t3) {
      e4.super_ = t3;
      var r3 = function() {
      };
      r3.prototype = t3.prototype, e4.prototype = new r3(), e4.prototype.constructor = e4;
    }
    function n2(e4, t3, r3) {
      if (n2.isBN(e4))
        return e4;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, e4 !== null && (t3 !== "le" && t3 !== "be" || (r3 = t3, t3 = 10), this._init(e4 || 0, t3 || 10, r3 || "be"));
    }
    var a2;
    typeof e3 == "object" ? e3.exports = n2 : t2.BN = n2, n2.BN = n2, n2.wordSize = 26;
    try {
      a2 = void 0;
    } catch (e4) {
    }
    function s2(e4, t3, r3) {
      for (var i3 = 0, n3 = Math.min(e4.length, r3), a3 = t3; a3 < n3; a3++) {
        var s3 = e4.charCodeAt(a3) - 48;
        i3 <<= 4, i3 |= s3 >= 49 && s3 <= 54 ? s3 - 49 + 10 : s3 >= 17 && s3 <= 22 ? s3 - 17 + 10 : 15 & s3;
      }
      return i3;
    }
    function o2(e4, t3, r3, i3) {
      for (var n3 = 0, a3 = Math.min(e4.length, r3), s3 = t3; s3 < a3; s3++) {
        var o3 = e4.charCodeAt(s3) - 48;
        n3 *= i3, n3 += o3 >= 49 ? o3 - 49 + 10 : o3 >= 17 ? o3 - 17 + 10 : o3;
      }
      return n3;
    }
    n2.isBN = function(e4) {
      return e4 instanceof n2 || e4 !== null && typeof e4 == "object" && e4.constructor.wordSize === n2.wordSize && Array.isArray(e4.words);
    }, n2.max = function(e4, t3) {
      return e4.cmp(t3) > 0 ? e4 : t3;
    }, n2.min = function(e4, t3) {
      return e4.cmp(t3) < 0 ? e4 : t3;
    }, n2.prototype._init = function(e4, t3, i3) {
      if (typeof e4 == "number")
        return this._initNumber(e4, t3, i3);
      if (typeof e4 == "object")
        return this._initArray(e4, t3, i3);
      t3 === "hex" && (t3 = 16), r2(t3 === (0 | t3) && t3 >= 2 && t3 <= 36);
      var n3 = 0;
      (e4 = e4.toString().replace(/\s+/g, ""))[0] === "-" && n3++, t3 === 16 ? this._parseHex(e4, n3) : this._parseBase(e4, t3, n3), e4[0] === "-" && (this.negative = 1), this.strip(), i3 === "le" && this._initArray(this.toArray(), t3, i3);
    }, n2.prototype._initNumber = function(e4, t3, i3) {
      e4 < 0 && (this.negative = 1, e4 = -e4), e4 < 67108864 ? (this.words = [67108863 & e4], this.length = 1) : e4 < 4503599627370496 ? (this.words = [67108863 & e4, e4 / 67108864 & 67108863], this.length = 2) : (r2(e4 < 9007199254740992), this.words = [67108863 & e4, e4 / 67108864 & 67108863, 1], this.length = 3), i3 === "le" && this._initArray(this.toArray(), t3, i3);
    }, n2.prototype._initArray = function(e4, t3, i3) {
      if (r2(typeof e4.length == "number"), e4.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(e4.length / 3), this.words = Array(this.length);
      for (var n3 = 0; n3 < this.length; n3++)
        this.words[n3] = 0;
      var a3, s3, o3 = 0;
      if (i3 === "be")
        for (n3 = e4.length - 1, a3 = 0; n3 >= 0; n3 -= 3)
          s3 = e4[n3] | e4[n3 - 1] << 8 | e4[n3 - 2] << 16, this.words[a3] |= s3 << o3 & 67108863, this.words[a3 + 1] = s3 >>> 26 - o3 & 67108863, (o3 += 24) >= 26 && (o3 -= 26, a3++);
      else if (i3 === "le")
        for (n3 = 0, a3 = 0; n3 < e4.length; n3 += 3)
          s3 = e4[n3] | e4[n3 + 1] << 8 | e4[n3 + 2] << 16, this.words[a3] |= s3 << o3 & 67108863, this.words[a3 + 1] = s3 >>> 26 - o3 & 67108863, (o3 += 24) >= 26 && (o3 -= 26, a3++);
      return this.strip();
    }, n2.prototype._parseHex = function(e4, t3) {
      this.length = Math.ceil((e4.length - t3) / 6), this.words = Array(this.length);
      for (var r3 = 0; r3 < this.length; r3++)
        this.words[r3] = 0;
      var i3, n3, a3 = 0;
      for (r3 = e4.length - 6, i3 = 0; r3 >= t3; r3 -= 6)
        n3 = s2(e4, r3, r3 + 6), this.words[i3] |= n3 << a3 & 67108863, this.words[i3 + 1] |= n3 >>> 26 - a3 & 4194303, (a3 += 24) >= 26 && (a3 -= 26, i3++);
      r3 + 6 !== t3 && (n3 = s2(e4, t3, r3 + 6), this.words[i3] |= n3 << a3 & 67108863, this.words[i3 + 1] |= n3 >>> 26 - a3 & 4194303), this.strip();
    }, n2.prototype._parseBase = function(e4, t3, r3) {
      this.words = [0], this.length = 1;
      for (var i3 = 0, n3 = 1; n3 <= 67108863; n3 *= t3)
        i3++;
      i3--, n3 = n3 / t3 | 0;
      for (var a3 = e4.length - r3, s3 = a3 % i3, c3 = Math.min(a3, a3 - s3) + r3, u3 = 0, h3 = r3; h3 < c3; h3 += i3)
        u3 = o2(e4, h3, h3 + i3, t3), this.imuln(n3), this.words[0] + u3 < 67108864 ? this.words[0] += u3 : this._iaddn(u3);
      if (s3 !== 0) {
        var f3 = 1;
        for (u3 = o2(e4, h3, e4.length, t3), h3 = 0; h3 < s3; h3++)
          f3 *= t3;
        this.imuln(f3), this.words[0] + u3 < 67108864 ? this.words[0] += u3 : this._iaddn(u3);
      }
    }, n2.prototype.copy = function(e4) {
      e4.words = Array(this.length);
      for (var t3 = 0; t3 < this.length; t3++)
        e4.words[t3] = this.words[t3];
      e4.length = this.length, e4.negative = this.negative, e4.red = this.red;
    }, n2.prototype.clone = function() {
      var e4 = new n2(null);
      return this.copy(e4), e4;
    }, n2.prototype._expand = function(e4) {
      for (; this.length < e4; )
        this.words[this.length++] = 0;
      return this;
    }, n2.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, n2.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, n2.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var c2 = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"], u2 = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], h2 = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
    function f2(e4, t3, r3) {
      r3.negative = t3.negative ^ e4.negative;
      var i3 = e4.length + t3.length | 0;
      r3.length = i3, i3 = i3 - 1 | 0;
      var n3 = 0 | e4.words[0], a3 = 0 | t3.words[0], s3 = n3 * a3, o3 = 67108863 & s3, c3 = s3 / 67108864 | 0;
      r3.words[0] = o3;
      for (var u3 = 1; u3 < i3; u3++) {
        for (var h3 = c3 >>> 26, f3 = 67108863 & c3, d3 = Math.min(u3, t3.length - 1), l3 = Math.max(0, u3 - e4.length + 1); l3 <= d3; l3++) {
          var p3 = u3 - l3 | 0;
          h3 += (s3 = (n3 = 0 | e4.words[p3]) * (a3 = 0 | t3.words[l3]) + f3) / 67108864 | 0, f3 = 67108863 & s3;
        }
        r3.words[u3] = 0 | f3, c3 = 0 | h3;
      }
      return c3 !== 0 ? r3.words[u3] = 0 | c3 : r3.length--, r3.strip();
    }
    n2.prototype.toString = function(e4, t3) {
      var i3;
      if (t3 = 0 | t3 || 1, (e4 = e4 || 10) === 16 || e4 === "hex") {
        i3 = "";
        for (var n3 = 0, a3 = 0, s3 = 0; s3 < this.length; s3++) {
          var o3 = this.words[s3], f3 = (16777215 & (o3 << n3 | a3)).toString(16);
          i3 = (a3 = o3 >>> 24 - n3 & 16777215) !== 0 || s3 !== this.length - 1 ? c2[6 - f3.length] + f3 + i3 : f3 + i3, (n3 += 2) >= 26 && (n3 -= 26, s3--);
        }
        for (a3 !== 0 && (i3 = a3.toString(16) + i3); i3.length % t3 != 0; )
          i3 = "0" + i3;
        return this.negative !== 0 && (i3 = "-" + i3), i3;
      }
      if (e4 === (0 | e4) && e4 >= 2 && e4 <= 36) {
        var d3 = u2[e4], l3 = h2[e4];
        i3 = "";
        var p3 = this.clone();
        for (p3.negative = 0; !p3.isZero(); ) {
          var y3 = p3.modn(l3).toString(e4);
          i3 = (p3 = p3.idivn(l3)).isZero() ? y3 + i3 : c2[d3 - y3.length] + y3 + i3;
        }
        for (this.isZero() && (i3 = "0" + i3); i3.length % t3 != 0; )
          i3 = "0" + i3;
        return this.negative !== 0 && (i3 = "-" + i3), i3;
      }
      r2(false, "Base should be between 2 and 36");
    }, n2.prototype.toNumber = function() {
      var e4 = this.words[0];
      return this.length === 2 ? e4 += 67108864 * this.words[1] : this.length === 3 && this.words[2] === 1 ? e4 += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && r2(false, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -e4 : e4;
    }, n2.prototype.toJSON = function() {
      return this.toString(16);
    }, n2.prototype.toBuffer = function(e4, t3) {
      return r2(a2 !== void 0), this.toArrayLike(a2, e4, t3);
    }, n2.prototype.toArray = function(e4, t3) {
      return this.toArrayLike(Array, e4, t3);
    }, n2.prototype.toArrayLike = function(e4, t3, i3) {
      var n3 = this.byteLength(), a3 = i3 || Math.max(1, n3);
      r2(n3 <= a3, "byte array longer than desired length"), r2(a3 > 0, "Requested array length <= 0"), this.strip();
      var s3, o3, c3 = t3 === "le", u3 = new e4(a3), h3 = this.clone();
      if (c3) {
        for (o3 = 0; !h3.isZero(); o3++)
          s3 = h3.andln(255), h3.iushrn(8), u3[o3] = s3;
        for (; o3 < a3; o3++)
          u3[o3] = 0;
      } else {
        for (o3 = 0; o3 < a3 - n3; o3++)
          u3[o3] = 0;
        for (o3 = 0; !h3.isZero(); o3++)
          s3 = h3.andln(255), h3.iushrn(8), u3[a3 - o3 - 1] = s3;
      }
      return u3;
    }, n2.prototype._countBits = Math.clz32 ? function(e4) {
      return 32 - Math.clz32(e4);
    } : function(e4) {
      var t3 = e4, r3 = 0;
      return t3 >= 4096 && (r3 += 13, t3 >>>= 13), t3 >= 64 && (r3 += 7, t3 >>>= 7), t3 >= 8 && (r3 += 4, t3 >>>= 4), t3 >= 2 && (r3 += 2, t3 >>>= 2), r3 + t3;
    }, n2.prototype._zeroBits = function(e4) {
      if (e4 === 0)
        return 26;
      var t3 = e4, r3 = 0;
      return (8191 & t3) == 0 && (r3 += 13, t3 >>>= 13), (127 & t3) == 0 && (r3 += 7, t3 >>>= 7), (15 & t3) == 0 && (r3 += 4, t3 >>>= 4), (3 & t3) == 0 && (r3 += 2, t3 >>>= 2), (1 & t3) == 0 && r3++, r3;
    }, n2.prototype.bitLength = function() {
      var e4 = this.words[this.length - 1], t3 = this._countBits(e4);
      return 26 * (this.length - 1) + t3;
    }, n2.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var e4 = 0, t3 = 0; t3 < this.length; t3++) {
        var r3 = this._zeroBits(this.words[t3]);
        if (e4 += r3, r3 !== 26)
          break;
      }
      return e4;
    }, n2.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, n2.prototype.toTwos = function(e4) {
      return this.negative !== 0 ? this.abs().inotn(e4).iaddn(1) : this.clone();
    }, n2.prototype.fromTwos = function(e4) {
      return this.testn(e4 - 1) ? this.notn(e4).iaddn(1).ineg() : this.clone();
    }, n2.prototype.isNeg = function() {
      return this.negative !== 0;
    }, n2.prototype.neg = function() {
      return this.clone().ineg();
    }, n2.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, n2.prototype.iuor = function(e4) {
      for (; this.length < e4.length; )
        this.words[this.length++] = 0;
      for (var t3 = 0; t3 < e4.length; t3++)
        this.words[t3] = this.words[t3] | e4.words[t3];
      return this.strip();
    }, n2.prototype.ior = function(e4) {
      return r2((this.negative | e4.negative) == 0), this.iuor(e4);
    }, n2.prototype.or = function(e4) {
      return this.length > e4.length ? this.clone().ior(e4) : e4.clone().ior(this);
    }, n2.prototype.uor = function(e4) {
      return this.length > e4.length ? this.clone().iuor(e4) : e4.clone().iuor(this);
    }, n2.prototype.iuand = function(e4) {
      var t3;
      t3 = this.length > e4.length ? e4 : this;
      for (var r3 = 0; r3 < t3.length; r3++)
        this.words[r3] = this.words[r3] & e4.words[r3];
      return this.length = t3.length, this.strip();
    }, n2.prototype.iand = function(e4) {
      return r2((this.negative | e4.negative) == 0), this.iuand(e4);
    }, n2.prototype.and = function(e4) {
      return this.length > e4.length ? this.clone().iand(e4) : e4.clone().iand(this);
    }, n2.prototype.uand = function(e4) {
      return this.length > e4.length ? this.clone().iuand(e4) : e4.clone().iuand(this);
    }, n2.prototype.iuxor = function(e4) {
      var t3, r3;
      this.length > e4.length ? (t3 = this, r3 = e4) : (t3 = e4, r3 = this);
      for (var i3 = 0; i3 < r3.length; i3++)
        this.words[i3] = t3.words[i3] ^ r3.words[i3];
      if (this !== t3)
        for (; i3 < t3.length; i3++)
          this.words[i3] = t3.words[i3];
      return this.length = t3.length, this.strip();
    }, n2.prototype.ixor = function(e4) {
      return r2((this.negative | e4.negative) == 0), this.iuxor(e4);
    }, n2.prototype.xor = function(e4) {
      return this.length > e4.length ? this.clone().ixor(e4) : e4.clone().ixor(this);
    }, n2.prototype.uxor = function(e4) {
      return this.length > e4.length ? this.clone().iuxor(e4) : e4.clone().iuxor(this);
    }, n2.prototype.inotn = function(e4) {
      r2(typeof e4 == "number" && e4 >= 0);
      var t3 = 0 | Math.ceil(e4 / 26), i3 = e4 % 26;
      this._expand(t3), i3 > 0 && t3--;
      for (var n3 = 0; n3 < t3; n3++)
        this.words[n3] = 67108863 & ~this.words[n3];
      return i3 > 0 && (this.words[n3] = ~this.words[n3] & 67108863 >> 26 - i3), this.strip();
    }, n2.prototype.notn = function(e4) {
      return this.clone().inotn(e4);
    }, n2.prototype.setn = function(e4, t3) {
      r2(typeof e4 == "number" && e4 >= 0);
      var i3 = e4 / 26 | 0, n3 = e4 % 26;
      return this._expand(i3 + 1), this.words[i3] = t3 ? this.words[i3] | 1 << n3 : this.words[i3] & ~(1 << n3), this.strip();
    }, n2.prototype.iadd = function(e4) {
      var t3, r3, i3;
      if (this.negative !== 0 && e4.negative === 0)
        return this.negative = 0, t3 = this.isub(e4), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && e4.negative !== 0)
        return e4.negative = 0, t3 = this.isub(e4), e4.negative = 1, t3._normSign();
      this.length > e4.length ? (r3 = this, i3 = e4) : (r3 = e4, i3 = this);
      for (var n3 = 0, a3 = 0; a3 < i3.length; a3++)
        t3 = (0 | r3.words[a3]) + (0 | i3.words[a3]) + n3, this.words[a3] = 67108863 & t3, n3 = t3 >>> 26;
      for (; n3 !== 0 && a3 < r3.length; a3++)
        t3 = (0 | r3.words[a3]) + n3, this.words[a3] = 67108863 & t3, n3 = t3 >>> 26;
      if (this.length = r3.length, n3 !== 0)
        this.words[this.length] = n3, this.length++;
      else if (r3 !== this)
        for (; a3 < r3.length; a3++)
          this.words[a3] = r3.words[a3];
      return this;
    }, n2.prototype.add = function(e4) {
      var t3;
      return e4.negative !== 0 && this.negative === 0 ? (e4.negative = 0, t3 = this.sub(e4), e4.negative ^= 1, t3) : e4.negative === 0 && this.negative !== 0 ? (this.negative = 0, t3 = e4.sub(this), this.negative = 1, t3) : this.length > e4.length ? this.clone().iadd(e4) : e4.clone().iadd(this);
    }, n2.prototype.isub = function(e4) {
      if (e4.negative !== 0) {
        e4.negative = 0;
        var t3 = this.iadd(e4);
        return e4.negative = 1, t3._normSign();
      }
      if (this.negative !== 0)
        return this.negative = 0, this.iadd(e4), this.negative = 1, this._normSign();
      var r3, i3, n3 = this.cmp(e4);
      if (n3 === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      n3 > 0 ? (r3 = this, i3 = e4) : (r3 = e4, i3 = this);
      for (var a3 = 0, s3 = 0; s3 < i3.length; s3++)
        a3 = (t3 = (0 | r3.words[s3]) - (0 | i3.words[s3]) + a3) >> 26, this.words[s3] = 67108863 & t3;
      for (; a3 !== 0 && s3 < r3.length; s3++)
        a3 = (t3 = (0 | r3.words[s3]) + a3) >> 26, this.words[s3] = 67108863 & t3;
      if (a3 === 0 && s3 < r3.length && r3 !== this)
        for (; s3 < r3.length; s3++)
          this.words[s3] = r3.words[s3];
      return this.length = Math.max(this.length, s3), r3 !== this && (this.negative = 1), this.strip();
    }, n2.prototype.sub = function(e4) {
      return this.clone().isub(e4);
    };
    var d2 = function(e4, t3, r3) {
      var i3, n3, a3, s3 = e4.words, o3 = t3.words, c3 = r3.words, u3 = 0, h3 = 0 | s3[0], f3 = 8191 & h3, d3 = h3 >>> 13, l3 = 0 | s3[1], p3 = 8191 & l3, y3 = l3 >>> 13, b3 = 0 | s3[2], m3 = 8191 & b3, g3 = b3 >>> 13, w3 = 0 | s3[3], v3 = 8191 & w3, _3 = w3 >>> 13, k3 = 0 | s3[4], A2 = 8191 & k3, S2 = k3 >>> 13, E2 = 0 | s3[5], P2 = 8191 & E2, x2 = E2 >>> 13, M2 = 0 | s3[6], C2 = 8191 & M2, K2 = M2 >>> 13, D2 = 0 | s3[7], R2 = 8191 & D2, U2 = D2 >>> 13, I2 = 0 | s3[8], B2 = 8191 & I2, T2 = I2 >>> 13, z2 = 0 | s3[9], q2 = 8191 & z2, O2 = z2 >>> 13, F2 = 0 | o3[0], N2 = 8191 & F2, j2 = F2 >>> 13, L2 = 0 | o3[1], W2 = 8191 & L2, H2 = L2 >>> 13, G2 = 0 | o3[2], V2 = 8191 & G2, $2 = G2 >>> 13, Z2 = 0 | o3[3], Y2 = 8191 & Z2, X2 = Z2 >>> 13, Q2 = 0 | o3[4], J2 = 8191 & Q2, ee2 = Q2 >>> 13, te2 = 0 | o3[5], re2 = 8191 & te2, ie2 = te2 >>> 13, ne2 = 0 | o3[6], ae2 = 8191 & ne2, se2 = ne2 >>> 13, oe2 = 0 | o3[7], ce2 = 8191 & oe2, ue2 = oe2 >>> 13, he2 = 0 | o3[8], fe2 = 8191 & he2, de2 = he2 >>> 13, le2 = 0 | o3[9], pe2 = 8191 & le2, ye2 = le2 >>> 13;
      r3.negative = e4.negative ^ t3.negative, r3.length = 19;
      var be2 = (u3 + (i3 = Math.imul(f3, N2)) | 0) + ((8191 & (n3 = (n3 = Math.imul(f3, j2)) + Math.imul(d3, N2) | 0)) << 13) | 0;
      u3 = ((a3 = Math.imul(d3, j2)) + (n3 >>> 13) | 0) + (be2 >>> 26) | 0, be2 &= 67108863, i3 = Math.imul(p3, N2), n3 = (n3 = Math.imul(p3, j2)) + Math.imul(y3, N2) | 0, a3 = Math.imul(y3, j2);
      var me2 = (u3 + (i3 = i3 + Math.imul(f3, W2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, H2) | 0) + Math.imul(d3, W2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, H2) | 0) + (n3 >>> 13) | 0) + (me2 >>> 26) | 0, me2 &= 67108863, i3 = Math.imul(m3, N2), n3 = (n3 = Math.imul(m3, j2)) + Math.imul(g3, N2) | 0, a3 = Math.imul(g3, j2), i3 = i3 + Math.imul(p3, W2) | 0, n3 = (n3 = n3 + Math.imul(p3, H2) | 0) + Math.imul(y3, W2) | 0, a3 = a3 + Math.imul(y3, H2) | 0;
      var ge2 = (u3 + (i3 = i3 + Math.imul(f3, V2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, $2) | 0) + Math.imul(d3, V2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, $2) | 0) + (n3 >>> 13) | 0) + (ge2 >>> 26) | 0, ge2 &= 67108863, i3 = Math.imul(v3, N2), n3 = (n3 = Math.imul(v3, j2)) + Math.imul(_3, N2) | 0, a3 = Math.imul(_3, j2), i3 = i3 + Math.imul(m3, W2) | 0, n3 = (n3 = n3 + Math.imul(m3, H2) | 0) + Math.imul(g3, W2) | 0, a3 = a3 + Math.imul(g3, H2) | 0, i3 = i3 + Math.imul(p3, V2) | 0, n3 = (n3 = n3 + Math.imul(p3, $2) | 0) + Math.imul(y3, V2) | 0, a3 = a3 + Math.imul(y3, $2) | 0;
      var we2 = (u3 + (i3 = i3 + Math.imul(f3, Y2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, X2) | 0) + Math.imul(d3, Y2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, X2) | 0) + (n3 >>> 13) | 0) + (we2 >>> 26) | 0, we2 &= 67108863, i3 = Math.imul(A2, N2), n3 = (n3 = Math.imul(A2, j2)) + Math.imul(S2, N2) | 0, a3 = Math.imul(S2, j2), i3 = i3 + Math.imul(v3, W2) | 0, n3 = (n3 = n3 + Math.imul(v3, H2) | 0) + Math.imul(_3, W2) | 0, a3 = a3 + Math.imul(_3, H2) | 0, i3 = i3 + Math.imul(m3, V2) | 0, n3 = (n3 = n3 + Math.imul(m3, $2) | 0) + Math.imul(g3, V2) | 0, a3 = a3 + Math.imul(g3, $2) | 0, i3 = i3 + Math.imul(p3, Y2) | 0, n3 = (n3 = n3 + Math.imul(p3, X2) | 0) + Math.imul(y3, Y2) | 0, a3 = a3 + Math.imul(y3, X2) | 0;
      var ve2 = (u3 + (i3 = i3 + Math.imul(f3, J2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, ee2) | 0) + Math.imul(d3, J2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, ee2) | 0) + (n3 >>> 13) | 0) + (ve2 >>> 26) | 0, ve2 &= 67108863, i3 = Math.imul(P2, N2), n3 = (n3 = Math.imul(P2, j2)) + Math.imul(x2, N2) | 0, a3 = Math.imul(x2, j2), i3 = i3 + Math.imul(A2, W2) | 0, n3 = (n3 = n3 + Math.imul(A2, H2) | 0) + Math.imul(S2, W2) | 0, a3 = a3 + Math.imul(S2, H2) | 0, i3 = i3 + Math.imul(v3, V2) | 0, n3 = (n3 = n3 + Math.imul(v3, $2) | 0) + Math.imul(_3, V2) | 0, a3 = a3 + Math.imul(_3, $2) | 0, i3 = i3 + Math.imul(m3, Y2) | 0, n3 = (n3 = n3 + Math.imul(m3, X2) | 0) + Math.imul(g3, Y2) | 0, a3 = a3 + Math.imul(g3, X2) | 0, i3 = i3 + Math.imul(p3, J2) | 0, n3 = (n3 = n3 + Math.imul(p3, ee2) | 0) + Math.imul(y3, J2) | 0, a3 = a3 + Math.imul(y3, ee2) | 0;
      var _e2 = (u3 + (i3 = i3 + Math.imul(f3, re2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, ie2) | 0) + Math.imul(d3, re2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, ie2) | 0) + (n3 >>> 13) | 0) + (_e2 >>> 26) | 0, _e2 &= 67108863, i3 = Math.imul(C2, N2), n3 = (n3 = Math.imul(C2, j2)) + Math.imul(K2, N2) | 0, a3 = Math.imul(K2, j2), i3 = i3 + Math.imul(P2, W2) | 0, n3 = (n3 = n3 + Math.imul(P2, H2) | 0) + Math.imul(x2, W2) | 0, a3 = a3 + Math.imul(x2, H2) | 0, i3 = i3 + Math.imul(A2, V2) | 0, n3 = (n3 = n3 + Math.imul(A2, $2) | 0) + Math.imul(S2, V2) | 0, a3 = a3 + Math.imul(S2, $2) | 0, i3 = i3 + Math.imul(v3, Y2) | 0, n3 = (n3 = n3 + Math.imul(v3, X2) | 0) + Math.imul(_3, Y2) | 0, a3 = a3 + Math.imul(_3, X2) | 0, i3 = i3 + Math.imul(m3, J2) | 0, n3 = (n3 = n3 + Math.imul(m3, ee2) | 0) + Math.imul(g3, J2) | 0, a3 = a3 + Math.imul(g3, ee2) | 0, i3 = i3 + Math.imul(p3, re2) | 0, n3 = (n3 = n3 + Math.imul(p3, ie2) | 0) + Math.imul(y3, re2) | 0, a3 = a3 + Math.imul(y3, ie2) | 0;
      var ke2 = (u3 + (i3 = i3 + Math.imul(f3, ae2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, se2) | 0) + Math.imul(d3, ae2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, se2) | 0) + (n3 >>> 13) | 0) + (ke2 >>> 26) | 0, ke2 &= 67108863, i3 = Math.imul(R2, N2), n3 = (n3 = Math.imul(R2, j2)) + Math.imul(U2, N2) | 0, a3 = Math.imul(U2, j2), i3 = i3 + Math.imul(C2, W2) | 0, n3 = (n3 = n3 + Math.imul(C2, H2) | 0) + Math.imul(K2, W2) | 0, a3 = a3 + Math.imul(K2, H2) | 0, i3 = i3 + Math.imul(P2, V2) | 0, n3 = (n3 = n3 + Math.imul(P2, $2) | 0) + Math.imul(x2, V2) | 0, a3 = a3 + Math.imul(x2, $2) | 0, i3 = i3 + Math.imul(A2, Y2) | 0, n3 = (n3 = n3 + Math.imul(A2, X2) | 0) + Math.imul(S2, Y2) | 0, a3 = a3 + Math.imul(S2, X2) | 0, i3 = i3 + Math.imul(v3, J2) | 0, n3 = (n3 = n3 + Math.imul(v3, ee2) | 0) + Math.imul(_3, J2) | 0, a3 = a3 + Math.imul(_3, ee2) | 0, i3 = i3 + Math.imul(m3, re2) | 0, n3 = (n3 = n3 + Math.imul(m3, ie2) | 0) + Math.imul(g3, re2) | 0, a3 = a3 + Math.imul(g3, ie2) | 0, i3 = i3 + Math.imul(p3, ae2) | 0, n3 = (n3 = n3 + Math.imul(p3, se2) | 0) + Math.imul(y3, ae2) | 0, a3 = a3 + Math.imul(y3, se2) | 0;
      var Ae2 = (u3 + (i3 = i3 + Math.imul(f3, ce2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, ue2) | 0) + Math.imul(d3, ce2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, ue2) | 0) + (n3 >>> 13) | 0) + (Ae2 >>> 26) | 0, Ae2 &= 67108863, i3 = Math.imul(B2, N2), n3 = (n3 = Math.imul(B2, j2)) + Math.imul(T2, N2) | 0, a3 = Math.imul(T2, j2), i3 = i3 + Math.imul(R2, W2) | 0, n3 = (n3 = n3 + Math.imul(R2, H2) | 0) + Math.imul(U2, W2) | 0, a3 = a3 + Math.imul(U2, H2) | 0, i3 = i3 + Math.imul(C2, V2) | 0, n3 = (n3 = n3 + Math.imul(C2, $2) | 0) + Math.imul(K2, V2) | 0, a3 = a3 + Math.imul(K2, $2) | 0, i3 = i3 + Math.imul(P2, Y2) | 0, n3 = (n3 = n3 + Math.imul(P2, X2) | 0) + Math.imul(x2, Y2) | 0, a3 = a3 + Math.imul(x2, X2) | 0, i3 = i3 + Math.imul(A2, J2) | 0, n3 = (n3 = n3 + Math.imul(A2, ee2) | 0) + Math.imul(S2, J2) | 0, a3 = a3 + Math.imul(S2, ee2) | 0, i3 = i3 + Math.imul(v3, re2) | 0, n3 = (n3 = n3 + Math.imul(v3, ie2) | 0) + Math.imul(_3, re2) | 0, a3 = a3 + Math.imul(_3, ie2) | 0, i3 = i3 + Math.imul(m3, ae2) | 0, n3 = (n3 = n3 + Math.imul(m3, se2) | 0) + Math.imul(g3, ae2) | 0, a3 = a3 + Math.imul(g3, se2) | 0, i3 = i3 + Math.imul(p3, ce2) | 0, n3 = (n3 = n3 + Math.imul(p3, ue2) | 0) + Math.imul(y3, ce2) | 0, a3 = a3 + Math.imul(y3, ue2) | 0;
      var Se2 = (u3 + (i3 = i3 + Math.imul(f3, fe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, de2) | 0) + Math.imul(d3, fe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, de2) | 0) + (n3 >>> 13) | 0) + (Se2 >>> 26) | 0, Se2 &= 67108863, i3 = Math.imul(q2, N2), n3 = (n3 = Math.imul(q2, j2)) + Math.imul(O2, N2) | 0, a3 = Math.imul(O2, j2), i3 = i3 + Math.imul(B2, W2) | 0, n3 = (n3 = n3 + Math.imul(B2, H2) | 0) + Math.imul(T2, W2) | 0, a3 = a3 + Math.imul(T2, H2) | 0, i3 = i3 + Math.imul(R2, V2) | 0, n3 = (n3 = n3 + Math.imul(R2, $2) | 0) + Math.imul(U2, V2) | 0, a3 = a3 + Math.imul(U2, $2) | 0, i3 = i3 + Math.imul(C2, Y2) | 0, n3 = (n3 = n3 + Math.imul(C2, X2) | 0) + Math.imul(K2, Y2) | 0, a3 = a3 + Math.imul(K2, X2) | 0, i3 = i3 + Math.imul(P2, J2) | 0, n3 = (n3 = n3 + Math.imul(P2, ee2) | 0) + Math.imul(x2, J2) | 0, a3 = a3 + Math.imul(x2, ee2) | 0, i3 = i3 + Math.imul(A2, re2) | 0, n3 = (n3 = n3 + Math.imul(A2, ie2) | 0) + Math.imul(S2, re2) | 0, a3 = a3 + Math.imul(S2, ie2) | 0, i3 = i3 + Math.imul(v3, ae2) | 0, n3 = (n3 = n3 + Math.imul(v3, se2) | 0) + Math.imul(_3, ae2) | 0, a3 = a3 + Math.imul(_3, se2) | 0, i3 = i3 + Math.imul(m3, ce2) | 0, n3 = (n3 = n3 + Math.imul(m3, ue2) | 0) + Math.imul(g3, ce2) | 0, a3 = a3 + Math.imul(g3, ue2) | 0, i3 = i3 + Math.imul(p3, fe2) | 0, n3 = (n3 = n3 + Math.imul(p3, de2) | 0) + Math.imul(y3, fe2) | 0, a3 = a3 + Math.imul(y3, de2) | 0;
      var Ee2 = (u3 + (i3 = i3 + Math.imul(f3, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(f3, ye2) | 0) + Math.imul(d3, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(d3, ye2) | 0) + (n3 >>> 13) | 0) + (Ee2 >>> 26) | 0, Ee2 &= 67108863, i3 = Math.imul(q2, W2), n3 = (n3 = Math.imul(q2, H2)) + Math.imul(O2, W2) | 0, a3 = Math.imul(O2, H2), i3 = i3 + Math.imul(B2, V2) | 0, n3 = (n3 = n3 + Math.imul(B2, $2) | 0) + Math.imul(T2, V2) | 0, a3 = a3 + Math.imul(T2, $2) | 0, i3 = i3 + Math.imul(R2, Y2) | 0, n3 = (n3 = n3 + Math.imul(R2, X2) | 0) + Math.imul(U2, Y2) | 0, a3 = a3 + Math.imul(U2, X2) | 0, i3 = i3 + Math.imul(C2, J2) | 0, n3 = (n3 = n3 + Math.imul(C2, ee2) | 0) + Math.imul(K2, J2) | 0, a3 = a3 + Math.imul(K2, ee2) | 0, i3 = i3 + Math.imul(P2, re2) | 0, n3 = (n3 = n3 + Math.imul(P2, ie2) | 0) + Math.imul(x2, re2) | 0, a3 = a3 + Math.imul(x2, ie2) | 0, i3 = i3 + Math.imul(A2, ae2) | 0, n3 = (n3 = n3 + Math.imul(A2, se2) | 0) + Math.imul(S2, ae2) | 0, a3 = a3 + Math.imul(S2, se2) | 0, i3 = i3 + Math.imul(v3, ce2) | 0, n3 = (n3 = n3 + Math.imul(v3, ue2) | 0) + Math.imul(_3, ce2) | 0, a3 = a3 + Math.imul(_3, ue2) | 0, i3 = i3 + Math.imul(m3, fe2) | 0, n3 = (n3 = n3 + Math.imul(m3, de2) | 0) + Math.imul(g3, fe2) | 0, a3 = a3 + Math.imul(g3, de2) | 0;
      var Pe2 = (u3 + (i3 = i3 + Math.imul(p3, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(p3, ye2) | 0) + Math.imul(y3, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(y3, ye2) | 0) + (n3 >>> 13) | 0) + (Pe2 >>> 26) | 0, Pe2 &= 67108863, i3 = Math.imul(q2, V2), n3 = (n3 = Math.imul(q2, $2)) + Math.imul(O2, V2) | 0, a3 = Math.imul(O2, $2), i3 = i3 + Math.imul(B2, Y2) | 0, n3 = (n3 = n3 + Math.imul(B2, X2) | 0) + Math.imul(T2, Y2) | 0, a3 = a3 + Math.imul(T2, X2) | 0, i3 = i3 + Math.imul(R2, J2) | 0, n3 = (n3 = n3 + Math.imul(R2, ee2) | 0) + Math.imul(U2, J2) | 0, a3 = a3 + Math.imul(U2, ee2) | 0, i3 = i3 + Math.imul(C2, re2) | 0, n3 = (n3 = n3 + Math.imul(C2, ie2) | 0) + Math.imul(K2, re2) | 0, a3 = a3 + Math.imul(K2, ie2) | 0, i3 = i3 + Math.imul(P2, ae2) | 0, n3 = (n3 = n3 + Math.imul(P2, se2) | 0) + Math.imul(x2, ae2) | 0, a3 = a3 + Math.imul(x2, se2) | 0, i3 = i3 + Math.imul(A2, ce2) | 0, n3 = (n3 = n3 + Math.imul(A2, ue2) | 0) + Math.imul(S2, ce2) | 0, a3 = a3 + Math.imul(S2, ue2) | 0, i3 = i3 + Math.imul(v3, fe2) | 0, n3 = (n3 = n3 + Math.imul(v3, de2) | 0) + Math.imul(_3, fe2) | 0, a3 = a3 + Math.imul(_3, de2) | 0;
      var xe2 = (u3 + (i3 = i3 + Math.imul(m3, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(m3, ye2) | 0) + Math.imul(g3, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(g3, ye2) | 0) + (n3 >>> 13) | 0) + (xe2 >>> 26) | 0, xe2 &= 67108863, i3 = Math.imul(q2, Y2), n3 = (n3 = Math.imul(q2, X2)) + Math.imul(O2, Y2) | 0, a3 = Math.imul(O2, X2), i3 = i3 + Math.imul(B2, J2) | 0, n3 = (n3 = n3 + Math.imul(B2, ee2) | 0) + Math.imul(T2, J2) | 0, a3 = a3 + Math.imul(T2, ee2) | 0, i3 = i3 + Math.imul(R2, re2) | 0, n3 = (n3 = n3 + Math.imul(R2, ie2) | 0) + Math.imul(U2, re2) | 0, a3 = a3 + Math.imul(U2, ie2) | 0, i3 = i3 + Math.imul(C2, ae2) | 0, n3 = (n3 = n3 + Math.imul(C2, se2) | 0) + Math.imul(K2, ae2) | 0, a3 = a3 + Math.imul(K2, se2) | 0, i3 = i3 + Math.imul(P2, ce2) | 0, n3 = (n3 = n3 + Math.imul(P2, ue2) | 0) + Math.imul(x2, ce2) | 0, a3 = a3 + Math.imul(x2, ue2) | 0, i3 = i3 + Math.imul(A2, fe2) | 0, n3 = (n3 = n3 + Math.imul(A2, de2) | 0) + Math.imul(S2, fe2) | 0, a3 = a3 + Math.imul(S2, de2) | 0;
      var Me2 = (u3 + (i3 = i3 + Math.imul(v3, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(v3, ye2) | 0) + Math.imul(_3, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(_3, ye2) | 0) + (n3 >>> 13) | 0) + (Me2 >>> 26) | 0, Me2 &= 67108863, i3 = Math.imul(q2, J2), n3 = (n3 = Math.imul(q2, ee2)) + Math.imul(O2, J2) | 0, a3 = Math.imul(O2, ee2), i3 = i3 + Math.imul(B2, re2) | 0, n3 = (n3 = n3 + Math.imul(B2, ie2) | 0) + Math.imul(T2, re2) | 0, a3 = a3 + Math.imul(T2, ie2) | 0, i3 = i3 + Math.imul(R2, ae2) | 0, n3 = (n3 = n3 + Math.imul(R2, se2) | 0) + Math.imul(U2, ae2) | 0, a3 = a3 + Math.imul(U2, se2) | 0, i3 = i3 + Math.imul(C2, ce2) | 0, n3 = (n3 = n3 + Math.imul(C2, ue2) | 0) + Math.imul(K2, ce2) | 0, a3 = a3 + Math.imul(K2, ue2) | 0, i3 = i3 + Math.imul(P2, fe2) | 0, n3 = (n3 = n3 + Math.imul(P2, de2) | 0) + Math.imul(x2, fe2) | 0, a3 = a3 + Math.imul(x2, de2) | 0;
      var Ce2 = (u3 + (i3 = i3 + Math.imul(A2, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(A2, ye2) | 0) + Math.imul(S2, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(S2, ye2) | 0) + (n3 >>> 13) | 0) + (Ce2 >>> 26) | 0, Ce2 &= 67108863, i3 = Math.imul(q2, re2), n3 = (n3 = Math.imul(q2, ie2)) + Math.imul(O2, re2) | 0, a3 = Math.imul(O2, ie2), i3 = i3 + Math.imul(B2, ae2) | 0, n3 = (n3 = n3 + Math.imul(B2, se2) | 0) + Math.imul(T2, ae2) | 0, a3 = a3 + Math.imul(T2, se2) | 0, i3 = i3 + Math.imul(R2, ce2) | 0, n3 = (n3 = n3 + Math.imul(R2, ue2) | 0) + Math.imul(U2, ce2) | 0, a3 = a3 + Math.imul(U2, ue2) | 0, i3 = i3 + Math.imul(C2, fe2) | 0, n3 = (n3 = n3 + Math.imul(C2, de2) | 0) + Math.imul(K2, fe2) | 0, a3 = a3 + Math.imul(K2, de2) | 0;
      var Ke2 = (u3 + (i3 = i3 + Math.imul(P2, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(P2, ye2) | 0) + Math.imul(x2, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(x2, ye2) | 0) + (n3 >>> 13) | 0) + (Ke2 >>> 26) | 0, Ke2 &= 67108863, i3 = Math.imul(q2, ae2), n3 = (n3 = Math.imul(q2, se2)) + Math.imul(O2, ae2) | 0, a3 = Math.imul(O2, se2), i3 = i3 + Math.imul(B2, ce2) | 0, n3 = (n3 = n3 + Math.imul(B2, ue2) | 0) + Math.imul(T2, ce2) | 0, a3 = a3 + Math.imul(T2, ue2) | 0, i3 = i3 + Math.imul(R2, fe2) | 0, n3 = (n3 = n3 + Math.imul(R2, de2) | 0) + Math.imul(U2, fe2) | 0, a3 = a3 + Math.imul(U2, de2) | 0;
      var De2 = (u3 + (i3 = i3 + Math.imul(C2, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(C2, ye2) | 0) + Math.imul(K2, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(K2, ye2) | 0) + (n3 >>> 13) | 0) + (De2 >>> 26) | 0, De2 &= 67108863, i3 = Math.imul(q2, ce2), n3 = (n3 = Math.imul(q2, ue2)) + Math.imul(O2, ce2) | 0, a3 = Math.imul(O2, ue2), i3 = i3 + Math.imul(B2, fe2) | 0, n3 = (n3 = n3 + Math.imul(B2, de2) | 0) + Math.imul(T2, fe2) | 0, a3 = a3 + Math.imul(T2, de2) | 0;
      var Re2 = (u3 + (i3 = i3 + Math.imul(R2, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(R2, ye2) | 0) + Math.imul(U2, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(U2, ye2) | 0) + (n3 >>> 13) | 0) + (Re2 >>> 26) | 0, Re2 &= 67108863, i3 = Math.imul(q2, fe2), n3 = (n3 = Math.imul(q2, de2)) + Math.imul(O2, fe2) | 0, a3 = Math.imul(O2, de2);
      var Ue2 = (u3 + (i3 = i3 + Math.imul(B2, pe2) | 0) | 0) + ((8191 & (n3 = (n3 = n3 + Math.imul(B2, ye2) | 0) + Math.imul(T2, pe2) | 0)) << 13) | 0;
      u3 = ((a3 = a3 + Math.imul(T2, ye2) | 0) + (n3 >>> 13) | 0) + (Ue2 >>> 26) | 0, Ue2 &= 67108863;
      var Ie2 = (u3 + (i3 = Math.imul(q2, pe2)) | 0) + ((8191 & (n3 = (n3 = Math.imul(q2, ye2)) + Math.imul(O2, pe2) | 0)) << 13) | 0;
      return u3 = ((a3 = Math.imul(O2, ye2)) + (n3 >>> 13) | 0) + (Ie2 >>> 26) | 0, Ie2 &= 67108863, c3[0] = be2, c3[1] = me2, c3[2] = ge2, c3[3] = we2, c3[4] = ve2, c3[5] = _e2, c3[6] = ke2, c3[7] = Ae2, c3[8] = Se2, c3[9] = Ee2, c3[10] = Pe2, c3[11] = xe2, c3[12] = Me2, c3[13] = Ce2, c3[14] = Ke2, c3[15] = De2, c3[16] = Re2, c3[17] = Ue2, c3[18] = Ie2, u3 !== 0 && (c3[19] = u3, r3.length++), r3;
    };
    function l2(e4, t3, r3) {
      return new p2().mulp(e4, t3, r3);
    }
    function p2(e4, t3) {
      this.x = e4, this.y = t3;
    }
    Math.imul || (d2 = f2), n2.prototype.mulTo = function(e4, t3) {
      var r3 = this.length + e4.length;
      return this.length === 10 && e4.length === 10 ? d2(this, e4, t3) : r3 < 63 ? f2(this, e4, t3) : r3 < 1024 ? function(e5, t4, r4) {
        r4.negative = t4.negative ^ e5.negative, r4.length = e5.length + t4.length;
        for (var i3 = 0, n3 = 0, a3 = 0; a3 < r4.length - 1; a3++) {
          var s3 = n3;
          n3 = 0;
          for (var o3 = 67108863 & i3, c3 = Math.min(a3, t4.length - 1), u3 = Math.max(0, a3 - e5.length + 1); u3 <= c3; u3++) {
            var h3 = a3 - u3, f3 = (0 | e5.words[h3]) * (0 | t4.words[u3]), d3 = 67108863 & f3;
            o3 = 67108863 & (d3 = d3 + o3 | 0), n3 += (s3 = (s3 = s3 + (f3 / 67108864 | 0) | 0) + (d3 >>> 26) | 0) >>> 26, s3 &= 67108863;
          }
          r4.words[a3] = o3, i3 = s3, s3 = n3;
        }
        return i3 !== 0 ? r4.words[a3] = i3 : r4.length--, r4.strip();
      }(this, e4, t3) : l2(this, e4, t3);
    }, p2.prototype.makeRBT = function(e4) {
      for (var t3 = Array(e4), r3 = n2.prototype._countBits(e4) - 1, i3 = 0; i3 < e4; i3++)
        t3[i3] = this.revBin(i3, r3, e4);
      return t3;
    }, p2.prototype.revBin = function(e4, t3, r3) {
      if (e4 === 0 || e4 === r3 - 1)
        return e4;
      for (var i3 = 0, n3 = 0; n3 < t3; n3++)
        i3 |= (1 & e4) << t3 - n3 - 1, e4 >>= 1;
      return i3;
    }, p2.prototype.permute = function(e4, t3, r3, i3, n3, a3) {
      for (var s3 = 0; s3 < a3; s3++)
        i3[s3] = t3[e4[s3]], n3[s3] = r3[e4[s3]];
    }, p2.prototype.transform = function(e4, t3, r3, i3, n3, a3) {
      this.permute(a3, e4, t3, r3, i3, n3);
      for (var s3 = 1; s3 < n3; s3 <<= 1)
        for (var o3 = s3 << 1, c3 = Math.cos(2 * Math.PI / o3), u3 = Math.sin(2 * Math.PI / o3), h3 = 0; h3 < n3; h3 += o3)
          for (var f3 = c3, d3 = u3, l3 = 0; l3 < s3; l3++) {
            var p3 = r3[h3 + l3], y3 = i3[h3 + l3], b3 = r3[h3 + l3 + s3], m3 = i3[h3 + l3 + s3], g3 = f3 * b3 - d3 * m3;
            m3 = f3 * m3 + d3 * b3, b3 = g3, r3[h3 + l3] = p3 + b3, i3[h3 + l3] = y3 + m3, r3[h3 + l3 + s3] = p3 - b3, i3[h3 + l3 + s3] = y3 - m3, l3 !== o3 && (g3 = c3 * f3 - u3 * d3, d3 = c3 * d3 + u3 * f3, f3 = g3);
          }
    }, p2.prototype.guessLen13b = function(e4, t3) {
      var r3 = 1 | Math.max(t3, e4), i3 = 1 & r3, n3 = 0;
      for (r3 = r3 / 2 | 0; r3; r3 >>>= 1)
        n3++;
      return 1 << n3 + 1 + i3;
    }, p2.prototype.conjugate = function(e4, t3, r3) {
      if (!(r3 <= 1))
        for (var i3 = 0; i3 < r3 / 2; i3++) {
          var n3 = e4[i3];
          e4[i3] = e4[r3 - i3 - 1], e4[r3 - i3 - 1] = n3, n3 = t3[i3], t3[i3] = -t3[r3 - i3 - 1], t3[r3 - i3 - 1] = -n3;
        }
    }, p2.prototype.normalize13b = function(e4, t3) {
      for (var r3 = 0, i3 = 0; i3 < t3 / 2; i3++) {
        var n3 = 8192 * Math.round(e4[2 * i3 + 1] / t3) + Math.round(e4[2 * i3] / t3) + r3;
        e4[i3] = 67108863 & n3, r3 = n3 < 67108864 ? 0 : n3 / 67108864 | 0;
      }
      return e4;
    }, p2.prototype.convert13b = function(e4, t3, i3, n3) {
      for (var a3 = 0, s3 = 0; s3 < t3; s3++)
        a3 += 0 | e4[s3], i3[2 * s3] = 8191 & a3, a3 >>>= 13, i3[2 * s3 + 1] = 8191 & a3, a3 >>>= 13;
      for (s3 = 2 * t3; s3 < n3; ++s3)
        i3[s3] = 0;
      r2(a3 === 0), r2((-8192 & a3) == 0);
    }, p2.prototype.stub = function(e4) {
      for (var t3 = Array(e4), r3 = 0; r3 < e4; r3++)
        t3[r3] = 0;
      return t3;
    }, p2.prototype.mulp = function(e4, t3, r3) {
      var i3 = 2 * this.guessLen13b(e4.length, t3.length), n3 = this.makeRBT(i3), a3 = this.stub(i3), s3 = Array(i3), o3 = Array(i3), c3 = Array(i3), u3 = Array(i3), h3 = Array(i3), f3 = Array(i3), d3 = r3.words;
      d3.length = i3, this.convert13b(e4.words, e4.length, s3, i3), this.convert13b(t3.words, t3.length, u3, i3), this.transform(s3, a3, o3, c3, i3, n3), this.transform(u3, a3, h3, f3, i3, n3);
      for (var l3 = 0; l3 < i3; l3++) {
        var p3 = o3[l3] * h3[l3] - c3[l3] * f3[l3];
        c3[l3] = o3[l3] * f3[l3] + c3[l3] * h3[l3], o3[l3] = p3;
      }
      return this.conjugate(o3, c3, i3), this.transform(o3, c3, d3, a3, i3, n3), this.conjugate(d3, a3, i3), this.normalize13b(d3, i3), r3.negative = e4.negative ^ t3.negative, r3.length = e4.length + t3.length, r3.strip();
    }, n2.prototype.mul = function(e4) {
      var t3 = new n2(null);
      return t3.words = Array(this.length + e4.length), this.mulTo(e4, t3);
    }, n2.prototype.mulf = function(e4) {
      var t3 = new n2(null);
      return t3.words = Array(this.length + e4.length), l2(this, e4, t3);
    }, n2.prototype.imul = function(e4) {
      return this.clone().mulTo(e4, this);
    }, n2.prototype.imuln = function(e4) {
      r2(typeof e4 == "number"), r2(e4 < 67108864);
      for (var t3 = 0, i3 = 0; i3 < this.length; i3++) {
        var n3 = (0 | this.words[i3]) * e4, a3 = (67108863 & n3) + (67108863 & t3);
        t3 >>= 26, t3 += n3 / 67108864 | 0, t3 += a3 >>> 26, this.words[i3] = 67108863 & a3;
      }
      return t3 !== 0 && (this.words[i3] = t3, this.length++), this;
    }, n2.prototype.muln = function(e4) {
      return this.clone().imuln(e4);
    }, n2.prototype.sqr = function() {
      return this.mul(this);
    }, n2.prototype.isqr = function() {
      return this.imul(this.clone());
    }, n2.prototype.pow = function(e4) {
      var t3 = function(e5) {
        for (var t4 = Array(e5.bitLength()), r4 = 0; r4 < t4.length; r4++) {
          var i4 = r4 / 26 | 0, n3 = r4 % 26;
          t4[r4] = (e5.words[i4] & 1 << n3) >>> n3;
        }
        return t4;
      }(e4);
      if (t3.length === 0)
        return new n2(1);
      for (var r3 = this, i3 = 0; i3 < t3.length && t3[i3] === 0; i3++, r3 = r3.sqr())
        ;
      if (++i3 < t3.length)
        for (var a3 = r3.sqr(); i3 < t3.length; i3++, a3 = a3.sqr())
          t3[i3] !== 0 && (r3 = r3.mul(a3));
      return r3;
    }, n2.prototype.iushln = function(e4) {
      r2(typeof e4 == "number" && e4 >= 0);
      var t3, i3 = e4 % 26, n3 = (e4 - i3) / 26, a3 = 67108863 >>> 26 - i3 << 26 - i3;
      if (i3 !== 0) {
        var s3 = 0;
        for (t3 = 0; t3 < this.length; t3++) {
          var o3 = this.words[t3] & a3, c3 = (0 | this.words[t3]) - o3 << i3;
          this.words[t3] = c3 | s3, s3 = o3 >>> 26 - i3;
        }
        s3 && (this.words[t3] = s3, this.length++);
      }
      if (n3 !== 0) {
        for (t3 = this.length - 1; t3 >= 0; t3--)
          this.words[t3 + n3] = this.words[t3];
        for (t3 = 0; t3 < n3; t3++)
          this.words[t3] = 0;
        this.length += n3;
      }
      return this.strip();
    }, n2.prototype.ishln = function(e4) {
      return r2(this.negative === 0), this.iushln(e4);
    }, n2.prototype.iushrn = function(e4, t3, i3) {
      var n3;
      r2(typeof e4 == "number" && e4 >= 0), n3 = t3 ? (t3 - t3 % 26) / 26 : 0;
      var a3 = e4 % 26, s3 = Math.min((e4 - a3) / 26, this.length), o3 = 67108863 ^ 67108863 >>> a3 << a3, c3 = i3;
      if (n3 = Math.max(0, n3 -= s3), c3) {
        for (var u3 = 0; u3 < s3; u3++)
          c3.words[u3] = this.words[u3];
        c3.length = s3;
      }
      if (s3 === 0)
        ;
      else if (this.length > s3)
        for (this.length -= s3, u3 = 0; u3 < this.length; u3++)
          this.words[u3] = this.words[u3 + s3];
      else
        this.words[0] = 0, this.length = 1;
      var h3 = 0;
      for (u3 = this.length - 1; u3 >= 0 && (h3 !== 0 || u3 >= n3); u3--) {
        var f3 = 0 | this.words[u3];
        this.words[u3] = h3 << 26 - a3 | f3 >>> a3, h3 = f3 & o3;
      }
      return c3 && h3 !== 0 && (c3.words[c3.length++] = h3), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, n2.prototype.ishrn = function(e4, t3, i3) {
      return r2(this.negative === 0), this.iushrn(e4, t3, i3);
    }, n2.prototype.shln = function(e4) {
      return this.clone().ishln(e4);
    }, n2.prototype.ushln = function(e4) {
      return this.clone().iushln(e4);
    }, n2.prototype.shrn = function(e4) {
      return this.clone().ishrn(e4);
    }, n2.prototype.ushrn = function(e4) {
      return this.clone().iushrn(e4);
    }, n2.prototype.testn = function(e4) {
      r2(typeof e4 == "number" && e4 >= 0);
      var t3 = e4 % 26, i3 = (e4 - t3) / 26, n3 = 1 << t3;
      return !(this.length <= i3) && !!(this.words[i3] & n3);
    }, n2.prototype.imaskn = function(e4) {
      r2(typeof e4 == "number" && e4 >= 0);
      var t3 = e4 % 26, i3 = (e4 - t3) / 26;
      if (r2(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i3)
        return this;
      if (t3 !== 0 && i3++, this.length = Math.min(i3, this.length), t3 !== 0) {
        var n3 = 67108863 ^ 67108863 >>> t3 << t3;
        this.words[this.length - 1] &= n3;
      }
      return this.strip();
    }, n2.prototype.maskn = function(e4) {
      return this.clone().imaskn(e4);
    }, n2.prototype.iaddn = function(e4) {
      return r2(typeof e4 == "number"), r2(e4 < 67108864), e4 < 0 ? this.isubn(-e4) : this.negative !== 0 ? this.length === 1 && (0 | this.words[0]) < e4 ? (this.words[0] = e4 - (0 | this.words[0]), this.negative = 0, this) : (this.negative = 0, this.isubn(e4), this.negative = 1, this) : this._iaddn(e4);
    }, n2.prototype._iaddn = function(e4) {
      this.words[0] += e4;
      for (var t3 = 0; t3 < this.length && this.words[t3] >= 67108864; t3++)
        this.words[t3] -= 67108864, t3 === this.length - 1 ? this.words[t3 + 1] = 1 : this.words[t3 + 1]++;
      return this.length = Math.max(this.length, t3 + 1), this;
    }, n2.prototype.isubn = function(e4) {
      if (r2(typeof e4 == "number"), r2(e4 < 67108864), e4 < 0)
        return this.iaddn(-e4);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(e4), this.negative = 1, this;
      if (this.words[0] -= e4, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var t3 = 0; t3 < this.length && this.words[t3] < 0; t3++)
          this.words[t3] += 67108864, this.words[t3 + 1] -= 1;
      return this.strip();
    }, n2.prototype.addn = function(e4) {
      return this.clone().iaddn(e4);
    }, n2.prototype.subn = function(e4) {
      return this.clone().isubn(e4);
    }, n2.prototype.iabs = function() {
      return this.negative = 0, this;
    }, n2.prototype.abs = function() {
      return this.clone().iabs();
    }, n2.prototype._ishlnsubmul = function(e4, t3, i3) {
      var n3, a3, s3 = e4.length + i3;
      this._expand(s3);
      var o3 = 0;
      for (n3 = 0; n3 < e4.length; n3++) {
        a3 = (0 | this.words[n3 + i3]) + o3;
        var c3 = (0 | e4.words[n3]) * t3;
        o3 = ((a3 -= 67108863 & c3) >> 26) - (c3 / 67108864 | 0), this.words[n3 + i3] = 67108863 & a3;
      }
      for (; n3 < this.length - i3; n3++)
        o3 = (a3 = (0 | this.words[n3 + i3]) + o3) >> 26, this.words[n3 + i3] = 67108863 & a3;
      if (o3 === 0)
        return this.strip();
      for (r2(o3 === -1), o3 = 0, n3 = 0; n3 < this.length; n3++)
        o3 = (a3 = -(0 | this.words[n3]) + o3) >> 26, this.words[n3] = 67108863 & a3;
      return this.negative = 1, this.strip();
    }, n2.prototype._wordDiv = function(e4, t3) {
      var r3 = (this.length, e4.length), i3 = this.clone(), a3 = e4, s3 = 0 | a3.words[a3.length - 1];
      (r3 = 26 - this._countBits(s3)) !== 0 && (a3 = a3.ushln(r3), i3.iushln(r3), s3 = 0 | a3.words[a3.length - 1]);
      var o3, c3 = i3.length - a3.length;
      if (t3 !== "mod") {
        (o3 = new n2(null)).length = c3 + 1, o3.words = Array(o3.length);
        for (var u3 = 0; u3 < o3.length; u3++)
          o3.words[u3] = 0;
      }
      var h3 = i3.clone()._ishlnsubmul(a3, 1, c3);
      h3.negative === 0 && (i3 = h3, o3 && (o3.words[c3] = 1));
      for (var f3 = c3 - 1; f3 >= 0; f3--) {
        var d3 = 67108864 * (0 | i3.words[a3.length + f3]) + (0 | i3.words[a3.length + f3 - 1]);
        for (d3 = Math.min(d3 / s3 | 0, 67108863), i3._ishlnsubmul(a3, d3, f3); i3.negative !== 0; )
          d3--, i3.negative = 0, i3._ishlnsubmul(a3, 1, f3), i3.isZero() || (i3.negative ^= 1);
        o3 && (o3.words[f3] = d3);
      }
      return o3 && o3.strip(), i3.strip(), t3 !== "div" && r3 !== 0 && i3.iushrn(r3), {div: o3 || null, mod: i3};
    }, n2.prototype.divmod = function(e4, t3, i3) {
      return r2(!e4.isZero()), this.isZero() ? {div: new n2(0), mod: new n2(0)} : this.negative !== 0 && e4.negative === 0 ? (o3 = this.neg().divmod(e4, t3), t3 !== "mod" && (a3 = o3.div.neg()), t3 !== "div" && (s3 = o3.mod.neg(), i3 && s3.negative !== 0 && s3.iadd(e4)), {div: a3, mod: s3}) : this.negative === 0 && e4.negative !== 0 ? (o3 = this.divmod(e4.neg(), t3), t3 !== "mod" && (a3 = o3.div.neg()), {div: a3, mod: o3.mod}) : (this.negative & e4.negative) != 0 ? (o3 = this.neg().divmod(e4.neg(), t3), t3 !== "div" && (s3 = o3.mod.neg(), i3 && s3.negative !== 0 && s3.isub(e4)), {div: o3.div, mod: s3}) : e4.length > this.length || this.cmp(e4) < 0 ? {div: new n2(0), mod: this} : e4.length === 1 ? t3 === "div" ? {div: this.divn(e4.words[0]), mod: null} : t3 === "mod" ? {div: null, mod: new n2(this.modn(e4.words[0]))} : {div: this.divn(e4.words[0]), mod: new n2(this.modn(e4.words[0]))} : this._wordDiv(e4, t3);
      var a3, s3, o3;
    }, n2.prototype.div = function(e4) {
      return this.divmod(e4, "div", false).div;
    }, n2.prototype.mod = function(e4) {
      return this.divmod(e4, "mod", false).mod;
    }, n2.prototype.umod = function(e4) {
      return this.divmod(e4, "mod", true).mod;
    }, n2.prototype.divRound = function(e4) {
      var t3 = this.divmod(e4);
      if (t3.mod.isZero())
        return t3.div;
      var r3 = t3.div.negative !== 0 ? t3.mod.isub(e4) : t3.mod, i3 = e4.ushrn(1), n3 = e4.andln(1), a3 = r3.cmp(i3);
      return a3 < 0 || n3 === 1 && a3 === 0 ? t3.div : t3.div.negative !== 0 ? t3.div.isubn(1) : t3.div.iaddn(1);
    }, n2.prototype.modn = function(e4) {
      r2(e4 <= 67108863);
      for (var t3 = (1 << 26) % e4, i3 = 0, n3 = this.length - 1; n3 >= 0; n3--)
        i3 = (t3 * i3 + (0 | this.words[n3])) % e4;
      return i3;
    }, n2.prototype.idivn = function(e4) {
      r2(e4 <= 67108863);
      for (var t3 = 0, i3 = this.length - 1; i3 >= 0; i3--) {
        var n3 = (0 | this.words[i3]) + 67108864 * t3;
        this.words[i3] = n3 / e4 | 0, t3 = n3 % e4;
      }
      return this.strip();
    }, n2.prototype.divn = function(e4) {
      return this.clone().idivn(e4);
    }, n2.prototype.egcd = function(e4) {
      r2(e4.negative === 0), r2(!e4.isZero());
      var t3 = this, i3 = e4.clone();
      t3 = t3.negative !== 0 ? t3.umod(e4) : t3.clone();
      for (var a3 = new n2(1), s3 = new n2(0), o3 = new n2(0), c3 = new n2(1), u3 = 0; t3.isEven() && i3.isEven(); )
        t3.iushrn(1), i3.iushrn(1), ++u3;
      for (var h3 = i3.clone(), f3 = t3.clone(); !t3.isZero(); ) {
        for (var d3 = 0, l3 = 1; (t3.words[0] & l3) == 0 && d3 < 26; ++d3, l3 <<= 1)
          ;
        if (d3 > 0)
          for (t3.iushrn(d3); d3-- > 0; )
            (a3.isOdd() || s3.isOdd()) && (a3.iadd(h3), s3.isub(f3)), a3.iushrn(1), s3.iushrn(1);
        for (var p3 = 0, y3 = 1; (i3.words[0] & y3) == 0 && p3 < 26; ++p3, y3 <<= 1)
          ;
        if (p3 > 0)
          for (i3.iushrn(p3); p3-- > 0; )
            (o3.isOdd() || c3.isOdd()) && (o3.iadd(h3), c3.isub(f3)), o3.iushrn(1), c3.iushrn(1);
        t3.cmp(i3) >= 0 ? (t3.isub(i3), a3.isub(o3), s3.isub(c3)) : (i3.isub(t3), o3.isub(a3), c3.isub(s3));
      }
      return {a: o3, b: c3, gcd: i3.iushln(u3)};
    }, n2.prototype._invmp = function(e4) {
      r2(e4.negative === 0), r2(!e4.isZero());
      var t3 = this, i3 = e4.clone();
      t3 = t3.negative !== 0 ? t3.umod(e4) : t3.clone();
      for (var a3, s3 = new n2(1), o3 = new n2(0), c3 = i3.clone(); t3.cmpn(1) > 0 && i3.cmpn(1) > 0; ) {
        for (var u3 = 0, h3 = 1; (t3.words[0] & h3) == 0 && u3 < 26; ++u3, h3 <<= 1)
          ;
        if (u3 > 0)
          for (t3.iushrn(u3); u3-- > 0; )
            s3.isOdd() && s3.iadd(c3), s3.iushrn(1);
        for (var f3 = 0, d3 = 1; (i3.words[0] & d3) == 0 && f3 < 26; ++f3, d3 <<= 1)
          ;
        if (f3 > 0)
          for (i3.iushrn(f3); f3-- > 0; )
            o3.isOdd() && o3.iadd(c3), o3.iushrn(1);
        t3.cmp(i3) >= 0 ? (t3.isub(i3), s3.isub(o3)) : (i3.isub(t3), o3.isub(s3));
      }
      return (a3 = t3.cmpn(1) === 0 ? s3 : o3).cmpn(0) < 0 && a3.iadd(e4), a3;
    }, n2.prototype.gcd = function(e4) {
      if (this.isZero())
        return e4.abs();
      if (e4.isZero())
        return this.abs();
      var t3 = this.clone(), r3 = e4.clone();
      t3.negative = 0, r3.negative = 0;
      for (var i3 = 0; t3.isEven() && r3.isEven(); i3++)
        t3.iushrn(1), r3.iushrn(1);
      for (; ; ) {
        for (; t3.isEven(); )
          t3.iushrn(1);
        for (; r3.isEven(); )
          r3.iushrn(1);
        var n3 = t3.cmp(r3);
        if (n3 < 0) {
          var a3 = t3;
          t3 = r3, r3 = a3;
        } else if (n3 === 0 || r3.cmpn(1) === 0)
          break;
        t3.isub(r3);
      }
      return r3.iushln(i3);
    }, n2.prototype.invm = function(e4) {
      return this.egcd(e4).a.umod(e4);
    }, n2.prototype.isEven = function() {
      return (1 & this.words[0]) == 0;
    }, n2.prototype.isOdd = function() {
      return (1 & this.words[0]) == 1;
    }, n2.prototype.andln = function(e4) {
      return this.words[0] & e4;
    }, n2.prototype.bincn = function(e4) {
      r2(typeof e4 == "number");
      var t3 = e4 % 26, i3 = (e4 - t3) / 26, n3 = 1 << t3;
      if (this.length <= i3)
        return this._expand(i3 + 1), this.words[i3] |= n3, this;
      for (var a3 = n3, s3 = i3; a3 !== 0 && s3 < this.length; s3++) {
        var o3 = 0 | this.words[s3];
        a3 = (o3 += a3) >>> 26, o3 &= 67108863, this.words[s3] = o3;
      }
      return a3 !== 0 && (this.words[s3] = a3, this.length++), this;
    }, n2.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, n2.prototype.cmpn = function(e4) {
      var t3, i3 = e4 < 0;
      if (this.negative !== 0 && !i3)
        return -1;
      if (this.negative === 0 && i3)
        return 1;
      if (this.strip(), this.length > 1)
        t3 = 1;
      else {
        i3 && (e4 = -e4), r2(e4 <= 67108863, "Number is too big");
        var n3 = 0 | this.words[0];
        t3 = n3 === e4 ? 0 : n3 < e4 ? -1 : 1;
      }
      return this.negative !== 0 ? 0 | -t3 : t3;
    }, n2.prototype.cmp = function(e4) {
      if (this.negative !== 0 && e4.negative === 0)
        return -1;
      if (this.negative === 0 && e4.negative !== 0)
        return 1;
      var t3 = this.ucmp(e4);
      return this.negative !== 0 ? 0 | -t3 : t3;
    }, n2.prototype.ucmp = function(e4) {
      if (this.length > e4.length)
        return 1;
      if (this.length < e4.length)
        return -1;
      for (var t3 = 0, r3 = this.length - 1; r3 >= 0; r3--) {
        var i3 = 0 | this.words[r3], n3 = 0 | e4.words[r3];
        if (i3 !== n3) {
          i3 < n3 ? t3 = -1 : i3 > n3 && (t3 = 1);
          break;
        }
      }
      return t3;
    }, n2.prototype.gtn = function(e4) {
      return this.cmpn(e4) === 1;
    }, n2.prototype.gt = function(e4) {
      return this.cmp(e4) === 1;
    }, n2.prototype.gten = function(e4) {
      return this.cmpn(e4) >= 0;
    }, n2.prototype.gte = function(e4) {
      return this.cmp(e4) >= 0;
    }, n2.prototype.ltn = function(e4) {
      return this.cmpn(e4) === -1;
    }, n2.prototype.lt = function(e4) {
      return this.cmp(e4) === -1;
    }, n2.prototype.lten = function(e4) {
      return this.cmpn(e4) <= 0;
    }, n2.prototype.lte = function(e4) {
      return this.cmp(e4) <= 0;
    }, n2.prototype.eqn = function(e4) {
      return this.cmpn(e4) === 0;
    }, n2.prototype.eq = function(e4) {
      return this.cmp(e4) === 0;
    }, n2.red = function(e4) {
      return new _2(e4);
    }, n2.prototype.toRed = function(e4) {
      return r2(!this.red, "Already a number in reduction context"), r2(this.negative === 0, "red works only with positives"), e4.convertTo(this)._forceRed(e4);
    }, n2.prototype.fromRed = function() {
      return r2(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, n2.prototype._forceRed = function(e4) {
      return this.red = e4, this;
    }, n2.prototype.forceRed = function(e4) {
      return r2(!this.red, "Already a number in reduction context"), this._forceRed(e4);
    }, n2.prototype.redAdd = function(e4) {
      return r2(this.red, "redAdd works only with red numbers"), this.red.add(this, e4);
    }, n2.prototype.redIAdd = function(e4) {
      return r2(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e4);
    }, n2.prototype.redSub = function(e4) {
      return r2(this.red, "redSub works only with red numbers"), this.red.sub(this, e4);
    }, n2.prototype.redISub = function(e4) {
      return r2(this.red, "redISub works only with red numbers"), this.red.isub(this, e4);
    }, n2.prototype.redShl = function(e4) {
      return r2(this.red, "redShl works only with red numbers"), this.red.shl(this, e4);
    }, n2.prototype.redMul = function(e4) {
      return r2(this.red, "redMul works only with red numbers"), this.red._verify2(this, e4), this.red.mul(this, e4);
    }, n2.prototype.redIMul = function(e4) {
      return r2(this.red, "redMul works only with red numbers"), this.red._verify2(this, e4), this.red.imul(this, e4);
    }, n2.prototype.redSqr = function() {
      return r2(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, n2.prototype.redISqr = function() {
      return r2(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, n2.prototype.redSqrt = function() {
      return r2(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, n2.prototype.redInvm = function() {
      return r2(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, n2.prototype.redNeg = function() {
      return r2(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, n2.prototype.redPow = function(e4) {
      return r2(this.red && !e4.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e4);
    };
    var y2 = {k256: null, p224: null, p192: null, p25519: null};
    function b2(e4, t3) {
      this.name = e4, this.p = new n2(t3, 16), this.n = this.p.bitLength(), this.k = new n2(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    function m2() {
      b2.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
    }
    function g2() {
      b2.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
    }
    function w2() {
      b2.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
    }
    function v2() {
      b2.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
    }
    function _2(e4) {
      if (typeof e4 == "string") {
        var t3 = n2._prime(e4);
        this.m = t3.p, this.prime = t3;
      } else
        r2(e4.gtn(1), "modulus must be greater than 1"), this.m = e4, this.prime = null;
    }
    function k2(e4) {
      _2.call(this, e4), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new n2(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    b2.prototype._tmp = function() {
      var e4 = new n2(null);
      return e4.words = Array(Math.ceil(this.n / 13)), e4;
    }, b2.prototype.ireduce = function(e4) {
      var t3, r3 = e4;
      do {
        this.split(r3, this.tmp), t3 = (r3 = (r3 = this.imulK(r3)).iadd(this.tmp)).bitLength();
      } while (t3 > this.n);
      var i3 = t3 < this.n ? -1 : r3.ucmp(this.p);
      return i3 === 0 ? (r3.words[0] = 0, r3.length = 1) : i3 > 0 ? r3.isub(this.p) : r3.strip(), r3;
    }, b2.prototype.split = function(e4, t3) {
      e4.iushrn(this.n, 0, t3);
    }, b2.prototype.imulK = function(e4) {
      return e4.imul(this.k);
    }, i2(m2, b2), m2.prototype.split = function(e4, t3) {
      for (var r3 = 4194303, i3 = Math.min(e4.length, 9), n3 = 0; n3 < i3; n3++)
        t3.words[n3] = e4.words[n3];
      if (t3.length = i3, e4.length <= 9)
        return e4.words[0] = 0, void (e4.length = 1);
      var a3 = e4.words[9];
      for (t3.words[t3.length++] = a3 & r3, n3 = 10; n3 < e4.length; n3++) {
        var s3 = 0 | e4.words[n3];
        e4.words[n3 - 10] = (s3 & r3) << 4 | a3 >>> 22, a3 = s3;
      }
      a3 >>>= 22, e4.words[n3 - 10] = a3, a3 === 0 && e4.length > 10 ? e4.length -= 10 : e4.length -= 9;
    }, m2.prototype.imulK = function(e4) {
      e4.words[e4.length] = 0, e4.words[e4.length + 1] = 0, e4.length += 2;
      for (var t3 = 0, r3 = 0; r3 < e4.length; r3++) {
        var i3 = 0 | e4.words[r3];
        t3 += 977 * i3, e4.words[r3] = 67108863 & t3, t3 = 64 * i3 + (t3 / 67108864 | 0);
      }
      return e4.words[e4.length - 1] === 0 && (e4.length--, e4.words[e4.length - 1] === 0 && e4.length--), e4;
    }, i2(g2, b2), i2(w2, b2), i2(v2, b2), v2.prototype.imulK = function(e4) {
      for (var t3 = 0, r3 = 0; r3 < e4.length; r3++) {
        var i3 = 19 * (0 | e4.words[r3]) + t3, n3 = 67108863 & i3;
        i3 >>>= 26, e4.words[r3] = n3, t3 = i3;
      }
      return t3 !== 0 && (e4.words[e4.length++] = t3), e4;
    }, n2._prime = function(e4) {
      if (y2[e4])
        return y2[e4];
      var t3;
      if (e4 === "k256")
        t3 = new m2();
      else if (e4 === "p224")
        t3 = new g2();
      else if (e4 === "p192")
        t3 = new w2();
      else {
        if (e4 !== "p25519")
          throw Error("Unknown prime " + e4);
        t3 = new v2();
      }
      return y2[e4] = t3, t3;
    }, _2.prototype._verify1 = function(e4) {
      r2(e4.negative === 0, "red works only with positives"), r2(e4.red, "red works only with red numbers");
    }, _2.prototype._verify2 = function(e4, t3) {
      r2((e4.negative | t3.negative) == 0, "red works only with positives"), r2(e4.red && e4.red === t3.red, "red works only with red numbers");
    }, _2.prototype.imod = function(e4) {
      return this.prime ? this.prime.ireduce(e4)._forceRed(this) : e4.umod(this.m)._forceRed(this);
    }, _2.prototype.neg = function(e4) {
      return e4.isZero() ? e4.clone() : this.m.sub(e4)._forceRed(this);
    }, _2.prototype.add = function(e4, t3) {
      this._verify2(e4, t3);
      var r3 = e4.add(t3);
      return r3.cmp(this.m) >= 0 && r3.isub(this.m), r3._forceRed(this);
    }, _2.prototype.iadd = function(e4, t3) {
      this._verify2(e4, t3);
      var r3 = e4.iadd(t3);
      return r3.cmp(this.m) >= 0 && r3.isub(this.m), r3;
    }, _2.prototype.sub = function(e4, t3) {
      this._verify2(e4, t3);
      var r3 = e4.sub(t3);
      return r3.cmpn(0) < 0 && r3.iadd(this.m), r3._forceRed(this);
    }, _2.prototype.isub = function(e4, t3) {
      this._verify2(e4, t3);
      var r3 = e4.isub(t3);
      return r3.cmpn(0) < 0 && r3.iadd(this.m), r3;
    }, _2.prototype.shl = function(e4, t3) {
      return this._verify1(e4), this.imod(e4.ushln(t3));
    }, _2.prototype.imul = function(e4, t3) {
      return this._verify2(e4, t3), this.imod(e4.imul(t3));
    }, _2.prototype.mul = function(e4, t3) {
      return this._verify2(e4, t3), this.imod(e4.mul(t3));
    }, _2.prototype.isqr = function(e4) {
      return this.imul(e4, e4.clone());
    }, _2.prototype.sqr = function(e4) {
      return this.mul(e4, e4);
    }, _2.prototype.sqrt = function(e4) {
      if (e4.isZero())
        return e4.clone();
      var t3 = this.m.andln(3);
      if (r2(t3 % 2 == 1), t3 === 3) {
        var i3 = this.m.add(new n2(1)).iushrn(2);
        return this.pow(e4, i3);
      }
      for (var a3 = this.m.subn(1), s3 = 0; !a3.isZero() && a3.andln(1) === 0; )
        s3++, a3.iushrn(1);
      r2(!a3.isZero());
      var o3 = new n2(1).toRed(this), c3 = o3.redNeg(), u3 = this.m.subn(1).iushrn(1), h3 = this.m.bitLength();
      for (h3 = new n2(2 * h3 * h3).toRed(this); this.pow(h3, u3).cmp(c3) !== 0; )
        h3.redIAdd(c3);
      for (var f3 = this.pow(h3, a3), d3 = this.pow(e4, a3.addn(1).iushrn(1)), l3 = this.pow(e4, a3), p3 = s3; l3.cmp(o3) !== 0; ) {
        for (var y3 = l3, b3 = 0; y3.cmp(o3) !== 0; b3++)
          y3 = y3.redSqr();
        r2(b3 < p3);
        var m3 = this.pow(f3, new n2(1).iushln(p3 - b3 - 1));
        d3 = d3.redMul(m3), f3 = m3.redSqr(), l3 = l3.redMul(f3), p3 = b3;
      }
      return d3;
    }, _2.prototype.invm = function(e4) {
      var t3 = e4._invmp(this.m);
      return t3.negative !== 0 ? (t3.negative = 0, this.imod(t3).redNeg()) : this.imod(t3);
    }, _2.prototype.pow = function(e4, t3) {
      if (t3.isZero())
        return new n2(1).toRed(this);
      if (t3.cmpn(1) === 0)
        return e4.clone();
      var r3 = Array(16);
      r3[0] = new n2(1).toRed(this), r3[1] = e4;
      for (var i3 = 2; i3 < r3.length; i3++)
        r3[i3] = this.mul(r3[i3 - 1], e4);
      var a3 = r3[0], s3 = 0, o3 = 0, c3 = t3.bitLength() % 26;
      for (c3 === 0 && (c3 = 26), i3 = t3.length - 1; i3 >= 0; i3--) {
        for (var u3 = t3.words[i3], h3 = c3 - 1; h3 >= 0; h3--) {
          var f3 = u3 >> h3 & 1;
          a3 !== r3[0] && (a3 = this.sqr(a3)), f3 !== 0 || s3 !== 0 ? (s3 <<= 1, s3 |= f3, (++o3 === 4 || i3 === 0 && h3 === 0) && (a3 = this.mul(a3, r3[s3]), o3 = 0, s3 = 0)) : o3 = 0;
        }
        c3 = 26;
      }
      return a3;
    }, _2.prototype.convertTo = function(e4) {
      var t3 = e4.umod(this.m);
      return t3 === e4 ? t3.clone() : t3;
    }, _2.prototype.convertFrom = function(e4) {
      var t3 = e4.clone();
      return t3.red = null, t3;
    }, n2.mont = function(e4) {
      return new k2(e4);
    }, i2(k2, _2), k2.prototype.convertTo = function(e4) {
      return this.imod(e4.ushln(this.shift));
    }, k2.prototype.convertFrom = function(e4) {
      var t3 = this.imod(e4.mul(this.rinv));
      return t3.red = null, t3;
    }, k2.prototype.imul = function(e4, t3) {
      if (e4.isZero() || t3.isZero())
        return e4.words[0] = 0, e4.length = 1, e4;
      var r3 = e4.imul(t3), i3 = r3.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n3 = r3.isub(i3).iushrn(this.shift), a3 = n3;
      return n3.cmp(this.m) >= 0 ? a3 = n3.isub(this.m) : n3.cmpn(0) < 0 && (a3 = n3.iadd(this.m)), a3._forceRed(this);
    }, k2.prototype.mul = function(e4, t3) {
      if (e4.isZero() || t3.isZero())
        return new n2(0)._forceRed(this);
      var r3 = e4.mul(t3), i3 = r3.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), a3 = r3.isub(i3).iushrn(this.shift), s3 = a3;
      return a3.cmp(this.m) >= 0 ? s3 = a3.isub(this.m) : a3.cmpn(0) < 0 && (s3 = a3.iadd(this.m)), s3._forceRed(this);
    }, k2.prototype.invm = function(e4) {
      return this.imod(e4._invmp(this.m).mul(this.r2))._forceRed(this);
    };
  }(e2, et);
}), Fd = /* @__PURE__ */ Object.freeze({__proto__: null, default: Od, __moduleExports: Od});
class Nd {
  constructor(e2) {
    if (e2 === void 0)
      throw Error("Invalid BigInteger input");
    this.value = new Od(e2);
  }
  clone() {
    const e2 = new Nd(null);
    return this.value.copy(e2.value), e2;
  }
  iinc() {
    return this.value.iadd(new Od(1)), this;
  }
  inc() {
    return this.clone().iinc();
  }
  idec() {
    return this.value.isub(new Od(1)), this;
  }
  dec() {
    return this.clone().idec();
  }
  iadd(e2) {
    return this.value.iadd(e2.value), this;
  }
  add(e2) {
    return this.clone().iadd(e2);
  }
  isub(e2) {
    return this.value.isub(e2.value), this;
  }
  sub(e2) {
    return this.clone().isub(e2);
  }
  imul(e2) {
    return this.value.imul(e2.value), this;
  }
  mul(e2) {
    return this.clone().imul(e2);
  }
  imod(e2) {
    return this.value = this.value.umod(e2.value), this;
  }
  mod(e2) {
    return this.clone().imod(e2);
  }
  modExp(e2, t2) {
    const r2 = t2.isEven() ? Od.red(t2.value) : Od.mont(t2.value), i2 = this.clone();
    return i2.value = i2.value.toRed(r2).redPow(e2.value).fromRed(), i2;
  }
  modInv(e2) {
    if (!this.gcd(e2).isOne())
      throw Error("Inverse does not exist");
    return new Nd(this.value.invm(e2.value));
  }
  gcd(e2) {
    return new Nd(this.value.gcd(e2.value));
  }
  ileftShift(e2) {
    return this.value.ishln(e2.value.toNumber()), this;
  }
  leftShift(e2) {
    return this.clone().ileftShift(e2);
  }
  irightShift(e2) {
    return this.value.ishrn(e2.value.toNumber()), this;
  }
  rightShift(e2) {
    return this.clone().irightShift(e2);
  }
  equal(e2) {
    return this.value.eq(e2.value);
  }
  lt(e2) {
    return this.value.lt(e2.value);
  }
  lte(e2) {
    return this.value.lte(e2.value);
  }
  gt(e2) {
    return this.value.gt(e2.value);
  }
  gte(e2) {
    return this.value.gte(e2.value);
  }
  isZero() {
    return this.value.isZero();
  }
  isOne() {
    return this.value.eq(new Od(1));
  }
  isNegative() {
    return this.value.isNeg();
  }
  isEven() {
    return this.value.isEven();
  }
  abs() {
    const e2 = this.clone();
    return e2.value = e2.value.abs(), e2;
  }
  toString() {
    return this.value.toString();
  }
  toNumber() {
    return this.value.toNumber();
  }
  getBit(e2) {
    return this.value.testn(e2) ? 1 : 0;
  }
  bitLength() {
    return this.value.bitLength();
  }
  byteLength() {
    return this.value.byteLength();
  }
  toUint8Array(e2 = "be", t2) {
    return this.value.toArrayLike(Uint8Array, e2, t2);
  }
}
var jd, Ld = /* @__PURE__ */ Object.freeze({__proto__: null, default: Nd}), Wd = tt(function(e2, t2) {
  var r2 = t2;
  function i2(e3) {
    return e3.length === 1 ? "0" + e3 : e3;
  }
  function n2(e3) {
    for (var t3 = "", r3 = 0; r3 < e3.length; r3++)
      t3 += i2(e3[r3].toString(16));
    return t3;
  }
  r2.toArray = function(e3, t3) {
    if (Array.isArray(e3))
      return e3.slice();
    if (!e3)
      return [];
    var r3 = [];
    if (typeof e3 != "string") {
      for (var i3 = 0; i3 < e3.length; i3++)
        r3[i3] = 0 | e3[i3];
      return r3;
    }
    if (t3 === "hex") {
      (e3 = e3.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e3 = "0" + e3);
      for (i3 = 0; i3 < e3.length; i3 += 2)
        r3.push(parseInt(e3[i3] + e3[i3 + 1], 16));
    } else
      for (i3 = 0; i3 < e3.length; i3++) {
        var n3 = e3.charCodeAt(i3), a2 = n3 >> 8, s2 = 255 & n3;
        a2 ? r3.push(a2, s2) : r3.push(s2);
      }
    return r3;
  }, r2.zero2 = i2, r2.toHex = n2, r2.encode = function(e3, t3) {
    return t3 === "hex" ? n2(e3) : e3;
  };
}), Hd = tt(function(e2, t2) {
  var r2 = t2;
  r2.assert = Qe, r2.toArray = Wd.toArray, r2.zero2 = Wd.zero2, r2.toHex = Wd.toHex, r2.encode = Wd.encode, r2.getNAF = function(e3, t3) {
    for (var r3 = [], i2 = 1 << t3 + 1, n2 = e3.clone(); n2.cmpn(1) >= 0; ) {
      var a2;
      if (n2.isOdd()) {
        var s2 = n2.andln(i2 - 1);
        a2 = s2 > (i2 >> 1) - 1 ? (i2 >> 1) - s2 : s2, n2.isubn(a2);
      } else
        a2 = 0;
      r3.push(a2);
      for (var o2 = n2.cmpn(0) !== 0 && n2.andln(i2 - 1) === 0 ? t3 + 1 : 1, c2 = 1; c2 < o2; c2++)
        r3.push(0);
      n2.iushrn(o2);
    }
    return r3;
  }, r2.getJSF = function(e3, t3) {
    var r3 = [[], []];
    e3 = e3.clone(), t3 = t3.clone();
    for (var i2 = 0, n2 = 0; e3.cmpn(-i2) > 0 || t3.cmpn(-n2) > 0; ) {
      var a2, s2, o2, c2 = e3.andln(3) + i2 & 3, u2 = t3.andln(3) + n2 & 3;
      if (c2 === 3 && (c2 = -1), u2 === 3 && (u2 = -1), (1 & c2) == 0)
        a2 = 0;
      else
        a2 = (o2 = e3.andln(7) + i2 & 7) !== 3 && o2 !== 5 || u2 !== 2 ? c2 : -c2;
      if (r3[0].push(a2), (1 & u2) == 0)
        s2 = 0;
      else
        s2 = (o2 = t3.andln(7) + n2 & 7) !== 3 && o2 !== 5 || c2 !== 2 ? u2 : -u2;
      r3[1].push(s2), 2 * i2 === a2 + 1 && (i2 = 1 - i2), 2 * n2 === s2 + 1 && (n2 = 1 - n2), e3.iushrn(1), t3.iushrn(1);
    }
    return r3;
  }, r2.cachedProperty = function(e3, t3, r3) {
    var i2 = "_" + t3;
    e3.prototype[t3] = function() {
      return this[i2] !== void 0 ? this[i2] : this[i2] = r3.call(this);
    };
  }, r2.parseBytes = function(e3) {
    return typeof e3 == "string" ? r2.toArray(e3, "hex") : e3;
  }, r2.intFromLE = function(e3) {
    return new Od(e3, "hex", "le");
  };
}), Gd = function(e2) {
  return jd || (jd = new Vd(null)), jd.generate(e2);
};
function Vd(e2) {
  this.rand = e2;
}
var $d = Vd;
if (Vd.prototype.generate = function(e2) {
  return this._rand(e2);
}, Vd.prototype._rand = function(e2) {
  if (this.rand.getBytes)
    return this.rand.getBytes(e2);
  for (var t2 = new Uint8Array(e2), r2 = 0; r2 < t2.length; r2++)
    t2[r2] = this.rand.getByte();
  return t2;
}, typeof self == "object")
  self.crypto && self.crypto.getRandomValues ? Vd.prototype._rand = function(e2) {
    var t2 = new Uint8Array(e2);
    return self.crypto.getRandomValues(t2), t2;
  } : self.msCrypto && self.msCrypto.getRandomValues ? Vd.prototype._rand = function(e2) {
    var t2 = new Uint8Array(e2);
    return self.msCrypto.getRandomValues(t2), t2;
  } : typeof window == "object" && (Vd.prototype._rand = function() {
    throw Error("Not implemented yet");
  });
else
  try {
    if (typeof (void 0).randomBytes != "function")
      throw Error("Not supported");
    Vd.prototype._rand = function(e2) {
      return (void 0).randomBytes(e2);
    };
  } catch (e2) {
  }
Gd.Rand = $d;
var Zd = Hd.getNAF, Yd = Hd.getJSF, Xd = Hd.assert;
function Qd(e2, t2) {
  this.type = e2, this.p = new Od(t2.p, 16), this.red = t2.prime ? Od.red(t2.prime) : Od.mont(this.p), this.zero = new Od(0).toRed(this.red), this.one = new Od(1).toRed(this.red), this.two = new Od(2).toRed(this.red), this.n = t2.n && new Od(t2.n, 16), this.g = t2.g && this.pointFromJSON(t2.g, t2.gRed), this._wnafT1 = [, , , ,], this._wnafT2 = [, , , ,], this._wnafT3 = [, , , ,], this._wnafT4 = [, , , ,];
  var r2 = this.n && this.p.div(this.n);
  !r2 || r2.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = true, this.redN = this.n.toRed(this.red));
}
var Jd = Qd;
function el(e2, t2) {
  this.curve = e2, this.type = t2, this.precomputed = null;
}
Qd.prototype.point = function() {
  throw Error("Not implemented");
}, Qd.prototype.validate = function() {
  throw Error("Not implemented");
}, Qd.prototype._fixedNafMul = function(e2, t2) {
  Xd(e2.precomputed);
  var r2 = e2._getDoubles(), i2 = Zd(t2, 1), n2 = (1 << r2.step + 1) - (r2.step % 2 == 0 ? 2 : 1);
  n2 /= 3;
  for (var a2 = [], s2 = 0; s2 < i2.length; s2 += r2.step) {
    var o2 = 0;
    for (t2 = s2 + r2.step - 1; t2 >= s2; t2--)
      o2 = (o2 << 1) + i2[t2];
    a2.push(o2);
  }
  for (var c2 = this.jpoint(null, null, null), u2 = this.jpoint(null, null, null), h2 = n2; h2 > 0; h2--) {
    for (s2 = 0; s2 < a2.length; s2++) {
      (o2 = a2[s2]) === h2 ? u2 = u2.mixedAdd(r2.points[s2]) : o2 === -h2 && (u2 = u2.mixedAdd(r2.points[s2].neg()));
    }
    c2 = c2.add(u2);
  }
  return c2.toP();
}, Qd.prototype._wnafMul = function(e2, t2) {
  var r2 = 4, i2 = e2._getNAFPoints(r2);
  r2 = i2.wnd;
  for (var n2 = i2.points, a2 = Zd(t2, r2), s2 = this.jpoint(null, null, null), o2 = a2.length - 1; o2 >= 0; o2--) {
    for (t2 = 0; o2 >= 0 && a2[o2] === 0; o2--)
      t2++;
    if (o2 >= 0 && t2++, s2 = s2.dblp(t2), o2 < 0)
      break;
    var c2 = a2[o2];
    Xd(c2 !== 0), s2 = e2.type === "affine" ? c2 > 0 ? s2.mixedAdd(n2[c2 - 1 >> 1]) : s2.mixedAdd(n2[-c2 - 1 >> 1].neg()) : c2 > 0 ? s2.add(n2[c2 - 1 >> 1]) : s2.add(n2[-c2 - 1 >> 1].neg());
  }
  return e2.type === "affine" ? s2.toP() : s2;
}, Qd.prototype._wnafMulAdd = function(e2, t2, r2, i2, n2) {
  for (var a2 = this._wnafT1, s2 = this._wnafT2, o2 = this._wnafT3, c2 = 0, u2 = 0; u2 < i2; u2++) {
    var h2 = (A2 = t2[u2])._getNAFPoints(e2);
    a2[u2] = h2.wnd, s2[u2] = h2.points;
  }
  for (u2 = i2 - 1; u2 >= 1; u2 -= 2) {
    var f2 = u2 - 1, d2 = u2;
    if (a2[f2] === 1 && a2[d2] === 1) {
      var l2 = [t2[f2], null, null, t2[d2]];
      t2[f2].y.cmp(t2[d2].y) === 0 ? (l2[1] = t2[f2].add(t2[d2]), l2[2] = t2[f2].toJ().mixedAdd(t2[d2].neg())) : t2[f2].y.cmp(t2[d2].y.redNeg()) === 0 ? (l2[1] = t2[f2].toJ().mixedAdd(t2[d2]), l2[2] = t2[f2].add(t2[d2].neg())) : (l2[1] = t2[f2].toJ().mixedAdd(t2[d2]), l2[2] = t2[f2].toJ().mixedAdd(t2[d2].neg()));
      var p2 = [-3, -1, -5, -7, 0, 7, 5, 1, 3], y2 = Yd(r2[f2], r2[d2]);
      c2 = Math.max(y2[0].length, c2), o2[f2] = Array(c2), o2[d2] = Array(c2);
      for (var b2 = 0; b2 < c2; b2++) {
        var m2 = 0 | y2[0][b2], g2 = 0 | y2[1][b2];
        o2[f2][b2] = p2[3 * (m2 + 1) + (g2 + 1)], o2[d2][b2] = 0, s2[f2] = l2;
      }
    } else
      o2[f2] = Zd(r2[f2], a2[f2]), o2[d2] = Zd(r2[d2], a2[d2]), c2 = Math.max(o2[f2].length, c2), c2 = Math.max(o2[d2].length, c2);
  }
  var w2 = this.jpoint(null, null, null), v2 = this._wnafT4;
  for (u2 = c2; u2 >= 0; u2--) {
    for (var _2 = 0; u2 >= 0; ) {
      var k2 = true;
      for (b2 = 0; b2 < i2; b2++)
        v2[b2] = 0 | o2[b2][u2], v2[b2] !== 0 && (k2 = false);
      if (!k2)
        break;
      _2++, u2--;
    }
    if (u2 >= 0 && _2++, w2 = w2.dblp(_2), u2 < 0)
      break;
    for (b2 = 0; b2 < i2; b2++) {
      var A2, S2 = v2[b2];
      S2 !== 0 && (S2 > 0 ? A2 = s2[b2][S2 - 1 >> 1] : S2 < 0 && (A2 = s2[b2][-S2 - 1 >> 1].neg()), w2 = A2.type === "affine" ? w2.mixedAdd(A2) : w2.add(A2));
    }
  }
  for (u2 = 0; u2 < i2; u2++)
    s2[u2] = null;
  return n2 ? w2 : w2.toP();
}, Qd.BasePoint = el, el.prototype.eq = function() {
  throw Error("Not implemented");
}, el.prototype.validate = function() {
  return this.curve.validate(this);
}, Qd.prototype.decodePoint = function(e2, t2) {
  e2 = Hd.toArray(e2, t2);
  var r2 = this.p.byteLength();
  if ((e2[0] === 4 || e2[0] === 6 || e2[0] === 7) && e2.length - 1 == 2 * r2)
    return e2[0] === 6 ? Xd(e2[e2.length - 1] % 2 == 0) : e2[0] === 7 && Xd(e2[e2.length - 1] % 2 == 1), this.point(e2.slice(1, 1 + r2), e2.slice(1 + r2, 1 + 2 * r2));
  if ((e2[0] === 2 || e2[0] === 3) && e2.length - 1 === r2)
    return this.pointFromX(e2.slice(1, 1 + r2), e2[0] === 3);
  throw Error("Unknown point format");
}, el.prototype.encodeCompressed = function(e2) {
  return this.encode(e2, true);
}, el.prototype._encode = function(e2) {
  var t2 = this.curve.p.byteLength(), r2 = this.getX().toArray("be", t2);
  return e2 ? [this.getY().isEven() ? 2 : 3].concat(r2) : [4].concat(r2, this.getY().toArray("be", t2));
}, el.prototype.encode = function(e2, t2) {
  return Hd.encode(this._encode(t2), e2);
}, el.prototype.precompute = function(e2) {
  if (this.precomputed)
    return this;
  var t2 = {doubles: null, naf: null, beta: null};
  return t2.naf = this._getNAFPoints(8), t2.doubles = this._getDoubles(4, e2), t2.beta = this._getBeta(), this.precomputed = t2, this;
}, el.prototype._hasDoubles = function(e2) {
  if (!this.precomputed)
    return false;
  var t2 = this.precomputed.doubles;
  return !!t2 && t2.points.length >= Math.ceil((e2.bitLength() + 1) / t2.step);
}, el.prototype._getDoubles = function(e2, t2) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;
  for (var r2 = [this], i2 = this, n2 = 0; n2 < t2; n2 += e2) {
    for (var a2 = 0; a2 < e2; a2++)
      i2 = i2.dbl();
    r2.push(i2);
  }
  return {step: e2, points: r2};
}, el.prototype._getNAFPoints = function(e2) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;
  for (var t2 = [this], r2 = (1 << e2) - 1, i2 = r2 === 1 ? null : this.dbl(), n2 = 1; n2 < r2; n2++)
    t2[n2] = t2[n2 - 1].add(i2);
  return {wnd: e2, points: t2};
}, el.prototype._getBeta = function() {
  return null;
}, el.prototype.dblp = function(e2) {
  for (var t2 = this, r2 = 0; r2 < e2; r2++)
    t2 = t2.dbl();
  return t2;
};
var tl = Hd.assert;
function rl(e2) {
  Jd.call(this, "short", e2), this.a = new Od(e2.a, 16).toRed(this.red), this.b = new Od(e2.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(e2), this._endoWnafT1 = [, , , ,], this._endoWnafT2 = [, , , ,];
}
rt(rl, Jd);
var il = rl;
function nl(e2, t2, r2, i2) {
  Jd.BasePoint.call(this, e2, "affine"), t2 === null && r2 === null ? (this.x = null, this.y = null, this.inf = true) : (this.x = new Od(t2, 16), this.y = new Od(r2, 16), i2 && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = false);
}
function al(e2, t2, r2, i2) {
  Jd.BasePoint.call(this, e2, "jacobian"), t2 === null && r2 === null && i2 === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new Od(0)) : (this.x = new Od(t2, 16), this.y = new Od(r2, 16), this.z = new Od(i2, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
function sl(e2) {
  Jd.call(this, "mont", e2), this.a = new Od(e2.a, 16).toRed(this.red), this.b = new Od(e2.b, 16).toRed(this.red), this.i4 = new Od(4).toRed(this.red).redInvm(), this.two = new Od(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
rl.prototype._getEndomorphism = function(e2) {
  if (this.zeroA && this.g && this.n && this.p.modn(3) === 1) {
    var t2, r2;
    if (e2.beta)
      t2 = new Od(e2.beta, 16).toRed(this.red);
    else {
      var i2 = this._getEndoRoots(this.p);
      t2 = (t2 = i2[0].cmp(i2[1]) < 0 ? i2[0] : i2[1]).toRed(this.red);
    }
    if (e2.lambda)
      r2 = new Od(e2.lambda, 16);
    else {
      var n2 = this._getEndoRoots(this.n);
      this.g.mul(n2[0]).x.cmp(this.g.x.redMul(t2)) === 0 ? r2 = n2[0] : (r2 = n2[1], tl(this.g.mul(r2).x.cmp(this.g.x.redMul(t2)) === 0));
    }
    return {beta: t2, lambda: r2, basis: e2.basis ? e2.basis.map(function(e3) {
      return {a: new Od(e3.a, 16), b: new Od(e3.b, 16)};
    }) : this._getEndoBasis(r2)};
  }
}, rl.prototype._getEndoRoots = function(e2) {
  var t2 = e2 === this.p ? this.red : Od.mont(e2), r2 = new Od(2).toRed(t2).redInvm(), i2 = r2.redNeg(), n2 = new Od(3).toRed(t2).redNeg().redSqrt().redMul(r2);
  return [i2.redAdd(n2).fromRed(), i2.redSub(n2).fromRed()];
}, rl.prototype._getEndoBasis = function(e2) {
  for (var t2, r2, i2, n2, a2, s2, o2, c2, u2, h2 = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), f2 = e2, d2 = this.n.clone(), l2 = new Od(1), p2 = new Od(0), y2 = new Od(0), b2 = new Od(1), m2 = 0; f2.cmpn(0) !== 0; ) {
    var g2 = d2.div(f2);
    c2 = d2.sub(g2.mul(f2)), u2 = y2.sub(g2.mul(l2));
    var w2 = b2.sub(g2.mul(p2));
    if (!i2 && c2.cmp(h2) < 0)
      t2 = o2.neg(), r2 = l2, i2 = c2.neg(), n2 = u2;
    else if (i2 && ++m2 == 2)
      break;
    o2 = c2, d2 = f2, f2 = c2, y2 = l2, l2 = u2, b2 = p2, p2 = w2;
  }
  a2 = c2.neg(), s2 = u2;
  var v2 = i2.sqr().add(n2.sqr());
  return a2.sqr().add(s2.sqr()).cmp(v2) >= 0 && (a2 = t2, s2 = r2), i2.negative && (i2 = i2.neg(), n2 = n2.neg()), a2.negative && (a2 = a2.neg(), s2 = s2.neg()), [{a: i2, b: n2}, {a: a2, b: s2}];
}, rl.prototype._endoSplit = function(e2) {
  var t2 = this.endo.basis, r2 = t2[0], i2 = t2[1], n2 = i2.b.mul(e2).divRound(this.n), a2 = r2.b.neg().mul(e2).divRound(this.n), s2 = n2.mul(r2.a), o2 = a2.mul(i2.a), c2 = n2.mul(r2.b), u2 = a2.mul(i2.b);
  return {k1: e2.sub(s2).sub(o2), k2: c2.add(u2).neg()};
}, rl.prototype.pointFromX = function(e2, t2) {
  (e2 = new Od(e2, 16)).red || (e2 = e2.toRed(this.red));
  var r2 = e2.redSqr().redMul(e2).redIAdd(e2.redMul(this.a)).redIAdd(this.b), i2 = r2.redSqrt();
  if (i2.redSqr().redSub(r2).cmp(this.zero) !== 0)
    throw Error("invalid point");
  var n2 = i2.fromRed().isOdd();
  return (t2 && !n2 || !t2 && n2) && (i2 = i2.redNeg()), this.point(e2, i2);
}, rl.prototype.validate = function(e2) {
  if (e2.inf)
    return true;
  var t2 = e2.x, r2 = e2.y, i2 = this.a.redMul(t2), n2 = t2.redSqr().redMul(t2).redIAdd(i2).redIAdd(this.b);
  return r2.redSqr().redISub(n2).cmpn(0) === 0;
}, rl.prototype._endoWnafMulAdd = function(e2, t2, r2) {
  for (var i2 = this._endoWnafT1, n2 = this._endoWnafT2, a2 = 0; a2 < e2.length; a2++) {
    var s2 = this._endoSplit(t2[a2]), o2 = e2[a2], c2 = o2._getBeta();
    s2.k1.negative && (s2.k1.ineg(), o2 = o2.neg(true)), s2.k2.negative && (s2.k2.ineg(), c2 = c2.neg(true)), i2[2 * a2] = o2, i2[2 * a2 + 1] = c2, n2[2 * a2] = s2.k1, n2[2 * a2 + 1] = s2.k2;
  }
  for (var u2 = this._wnafMulAdd(1, i2, n2, 2 * a2, r2), h2 = 0; h2 < 2 * a2; h2++)
    i2[h2] = null, n2[h2] = null;
  return u2;
}, rt(nl, Jd.BasePoint), rl.prototype.point = function(e2, t2, r2) {
  return new nl(this, e2, t2, r2);
}, rl.prototype.pointFromJSON = function(e2, t2) {
  return nl.fromJSON(this, e2, t2);
}, nl.prototype._getBeta = function() {
  if (this.curve.endo) {
    var e2 = this.precomputed;
    if (e2 && e2.beta)
      return e2.beta;
    var t2 = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (e2) {
      var r2 = this.curve, i2 = function(e3) {
        return r2.point(e3.x.redMul(r2.endo.beta), e3.y);
      };
      e2.beta = t2, t2.precomputed = {beta: null, naf: e2.naf && {wnd: e2.naf.wnd, points: e2.naf.points.map(i2)}, doubles: e2.doubles && {step: e2.doubles.step, points: e2.doubles.points.map(i2)}};
    }
    return t2;
  }
}, nl.prototype.toJSON = function() {
  return this.precomputed ? [this.x, this.y, this.precomputed && {doubles: this.precomputed.doubles && {step: this.precomputed.doubles.step, points: this.precomputed.doubles.points.slice(1)}, naf: this.precomputed.naf && {wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1)}}] : [this.x, this.y];
}, nl.fromJSON = function(e2, t2, r2) {
  typeof t2 == "string" && (t2 = JSON.parse(t2));
  var i2 = e2.point(t2[0], t2[1], r2);
  if (!t2[2])
    return i2;
  function n2(t3) {
    return e2.point(t3[0], t3[1], r2);
  }
  var a2 = t2[2];
  return i2.precomputed = {beta: null, doubles: a2.doubles && {step: a2.doubles.step, points: [i2].concat(a2.doubles.points.map(n2))}, naf: a2.naf && {wnd: a2.naf.wnd, points: [i2].concat(a2.naf.points.map(n2))}}, i2;
}, nl.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
}, nl.prototype.isInfinity = function() {
  return this.inf;
}, nl.prototype.add = function(e2) {
  if (this.inf)
    return e2;
  if (e2.inf)
    return this;
  if (this.eq(e2))
    return this.dbl();
  if (this.neg().eq(e2))
    return this.curve.point(null, null);
  if (this.x.cmp(e2.x) === 0)
    return this.curve.point(null, null);
  var t2 = this.y.redSub(e2.y);
  t2.cmpn(0) !== 0 && (t2 = t2.redMul(this.x.redSub(e2.x).redInvm()));
  var r2 = t2.redSqr().redISub(this.x).redISub(e2.x), i2 = t2.redMul(this.x.redSub(r2)).redISub(this.y);
  return this.curve.point(r2, i2);
}, nl.prototype.dbl = function() {
  if (this.inf)
    return this;
  var e2 = this.y.redAdd(this.y);
  if (e2.cmpn(0) === 0)
    return this.curve.point(null, null);
  var t2 = this.curve.a, r2 = this.x.redSqr(), i2 = e2.redInvm(), n2 = r2.redAdd(r2).redIAdd(r2).redIAdd(t2).redMul(i2), a2 = n2.redSqr().redISub(this.x.redAdd(this.x)), s2 = n2.redMul(this.x.redSub(a2)).redISub(this.y);
  return this.curve.point(a2, s2);
}, nl.prototype.getX = function() {
  return this.x.fromRed();
}, nl.prototype.getY = function() {
  return this.y.fromRed();
}, nl.prototype.mul = function(e2) {
  return e2 = new Od(e2, 16), this.isInfinity() ? this : this._hasDoubles(e2) ? this.curve._fixedNafMul(this, e2) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e2]) : this.curve._wnafMul(this, e2);
}, nl.prototype.mulAdd = function(e2, t2, r2) {
  var i2 = [this, t2], n2 = [e2, r2];
  return this.curve.endo ? this.curve._endoWnafMulAdd(i2, n2) : this.curve._wnafMulAdd(1, i2, n2, 2);
}, nl.prototype.jmulAdd = function(e2, t2, r2) {
  var i2 = [this, t2], n2 = [e2, r2];
  return this.curve.endo ? this.curve._endoWnafMulAdd(i2, n2, true) : this.curve._wnafMulAdd(1, i2, n2, 2, true);
}, nl.prototype.eq = function(e2) {
  return this === e2 || this.inf === e2.inf && (this.inf || this.x.cmp(e2.x) === 0 && this.y.cmp(e2.y) === 0);
}, nl.prototype.neg = function(e2) {
  if (this.inf)
    return this;
  var t2 = this.curve.point(this.x, this.y.redNeg());
  if (e2 && this.precomputed) {
    var r2 = this.precomputed, i2 = function(e3) {
      return e3.neg();
    };
    t2.precomputed = {naf: r2.naf && {wnd: r2.naf.wnd, points: r2.naf.points.map(i2)}, doubles: r2.doubles && {step: r2.doubles.step, points: r2.doubles.points.map(i2)}};
  }
  return t2;
}, nl.prototype.toJ = function() {
  return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
}, rt(al, Jd.BasePoint), rl.prototype.jpoint = function(e2, t2, r2) {
  return new al(this, e2, t2, r2);
}, al.prototype.toP = function() {
  if (this.isInfinity())
    return this.curve.point(null, null);
  var e2 = this.z.redInvm(), t2 = e2.redSqr(), r2 = this.x.redMul(t2), i2 = this.y.redMul(t2).redMul(e2);
  return this.curve.point(r2, i2);
}, al.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
}, al.prototype.add = function(e2) {
  if (this.isInfinity())
    return e2;
  if (e2.isInfinity())
    return this;
  var t2 = e2.z.redSqr(), r2 = this.z.redSqr(), i2 = this.x.redMul(t2), n2 = e2.x.redMul(r2), a2 = this.y.redMul(t2.redMul(e2.z)), s2 = e2.y.redMul(r2.redMul(this.z)), o2 = i2.redSub(n2), c2 = a2.redSub(s2);
  if (o2.cmpn(0) === 0)
    return c2.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var u2 = o2.redSqr(), h2 = u2.redMul(o2), f2 = i2.redMul(u2), d2 = c2.redSqr().redIAdd(h2).redISub(f2).redISub(f2), l2 = c2.redMul(f2.redISub(d2)).redISub(a2.redMul(h2)), p2 = this.z.redMul(e2.z).redMul(o2);
  return this.curve.jpoint(d2, l2, p2);
}, al.prototype.mixedAdd = function(e2) {
  if (this.isInfinity())
    return e2.toJ();
  if (e2.isInfinity())
    return this;
  var t2 = this.z.redSqr(), r2 = this.x, i2 = e2.x.redMul(t2), n2 = this.y, a2 = e2.y.redMul(t2).redMul(this.z), s2 = r2.redSub(i2), o2 = n2.redSub(a2);
  if (s2.cmpn(0) === 0)
    return o2.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var c2 = s2.redSqr(), u2 = c2.redMul(s2), h2 = r2.redMul(c2), f2 = o2.redSqr().redIAdd(u2).redISub(h2).redISub(h2), d2 = o2.redMul(h2.redISub(f2)).redISub(n2.redMul(u2)), l2 = this.z.redMul(s2);
  return this.curve.jpoint(f2, d2, l2);
}, al.prototype.dblp = function(e2) {
  if (e2 === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!e2)
    return this.dbl();
  if (this.curve.zeroA || this.curve.threeA) {
    for (var t2 = this, r2 = 0; r2 < e2; r2++)
      t2 = t2.dbl();
    return t2;
  }
  var i2 = this.curve.a, n2 = this.curve.tinv, a2 = this.x, s2 = this.y, o2 = this.z, c2 = o2.redSqr().redSqr(), u2 = s2.redAdd(s2);
  for (r2 = 0; r2 < e2; r2++) {
    var h2 = a2.redSqr(), f2 = u2.redSqr(), d2 = f2.redSqr(), l2 = h2.redAdd(h2).redIAdd(h2).redIAdd(i2.redMul(c2)), p2 = a2.redMul(f2), y2 = l2.redSqr().redISub(p2.redAdd(p2)), b2 = p2.redISub(y2), m2 = l2.redMul(b2);
    m2 = m2.redIAdd(m2).redISub(d2);
    var g2 = u2.redMul(o2);
    r2 + 1 < e2 && (c2 = c2.redMul(d2)), a2 = y2, o2 = g2, u2 = m2;
  }
  return this.curve.jpoint(a2, u2.redMul(n2), o2);
}, al.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
}, al.prototype._zeroDbl = function() {
  var e2, t2, r2;
  if (this.zOne) {
    var i2 = this.x.redSqr(), n2 = this.y.redSqr(), a2 = n2.redSqr(), s2 = this.x.redAdd(n2).redSqr().redISub(i2).redISub(a2);
    s2 = s2.redIAdd(s2);
    var o2 = i2.redAdd(i2).redIAdd(i2), c2 = o2.redSqr().redISub(s2).redISub(s2), u2 = a2.redIAdd(a2);
    u2 = (u2 = u2.redIAdd(u2)).redIAdd(u2), e2 = c2, t2 = o2.redMul(s2.redISub(c2)).redISub(u2), r2 = this.y.redAdd(this.y);
  } else {
    var h2 = this.x.redSqr(), f2 = this.y.redSqr(), d2 = f2.redSqr(), l2 = this.x.redAdd(f2).redSqr().redISub(h2).redISub(d2);
    l2 = l2.redIAdd(l2);
    var p2 = h2.redAdd(h2).redIAdd(h2), y2 = p2.redSqr(), b2 = d2.redIAdd(d2);
    b2 = (b2 = b2.redIAdd(b2)).redIAdd(b2), e2 = y2.redISub(l2).redISub(l2), t2 = p2.redMul(l2.redISub(e2)).redISub(b2), r2 = (r2 = this.y.redMul(this.z)).redIAdd(r2);
  }
  return this.curve.jpoint(e2, t2, r2);
}, al.prototype._threeDbl = function() {
  var e2, t2, r2;
  if (this.zOne) {
    var i2 = this.x.redSqr(), n2 = this.y.redSqr(), a2 = n2.redSqr(), s2 = this.x.redAdd(n2).redSqr().redISub(i2).redISub(a2);
    s2 = s2.redIAdd(s2);
    var o2 = i2.redAdd(i2).redIAdd(i2).redIAdd(this.curve.a), c2 = o2.redSqr().redISub(s2).redISub(s2);
    e2 = c2;
    var u2 = a2.redIAdd(a2);
    u2 = (u2 = u2.redIAdd(u2)).redIAdd(u2), t2 = o2.redMul(s2.redISub(c2)).redISub(u2), r2 = this.y.redAdd(this.y);
  } else {
    var h2 = this.z.redSqr(), f2 = this.y.redSqr(), d2 = this.x.redMul(f2), l2 = this.x.redSub(h2).redMul(this.x.redAdd(h2));
    l2 = l2.redAdd(l2).redIAdd(l2);
    var p2 = d2.redIAdd(d2), y2 = (p2 = p2.redIAdd(p2)).redAdd(p2);
    e2 = l2.redSqr().redISub(y2), r2 = this.y.redAdd(this.z).redSqr().redISub(f2).redISub(h2);
    var b2 = f2.redSqr();
    b2 = (b2 = (b2 = b2.redIAdd(b2)).redIAdd(b2)).redIAdd(b2), t2 = l2.redMul(p2.redISub(e2)).redISub(b2);
  }
  return this.curve.jpoint(e2, t2, r2);
}, al.prototype._dbl = function() {
  var e2 = this.curve.a, t2 = this.x, r2 = this.y, i2 = this.z, n2 = i2.redSqr().redSqr(), a2 = t2.redSqr(), s2 = r2.redSqr(), o2 = a2.redAdd(a2).redIAdd(a2).redIAdd(e2.redMul(n2)), c2 = t2.redAdd(t2), u2 = (c2 = c2.redIAdd(c2)).redMul(s2), h2 = o2.redSqr().redISub(u2.redAdd(u2)), f2 = u2.redISub(h2), d2 = s2.redSqr();
  d2 = (d2 = (d2 = d2.redIAdd(d2)).redIAdd(d2)).redIAdd(d2);
  var l2 = o2.redMul(f2).redISub(d2), p2 = r2.redAdd(r2).redMul(i2);
  return this.curve.jpoint(h2, l2, p2);
}, al.prototype.trpl = function() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);
  var e2 = this.x.redSqr(), t2 = this.y.redSqr(), r2 = this.z.redSqr(), i2 = t2.redSqr(), n2 = e2.redAdd(e2).redIAdd(e2), a2 = n2.redSqr(), s2 = this.x.redAdd(t2).redSqr().redISub(e2).redISub(i2), o2 = (s2 = (s2 = (s2 = s2.redIAdd(s2)).redAdd(s2).redIAdd(s2)).redISub(a2)).redSqr(), c2 = i2.redIAdd(i2);
  c2 = (c2 = (c2 = c2.redIAdd(c2)).redIAdd(c2)).redIAdd(c2);
  var u2 = n2.redIAdd(s2).redSqr().redISub(a2).redISub(o2).redISub(c2), h2 = t2.redMul(u2);
  h2 = (h2 = h2.redIAdd(h2)).redIAdd(h2);
  var f2 = this.x.redMul(o2).redISub(h2);
  f2 = (f2 = f2.redIAdd(f2)).redIAdd(f2);
  var d2 = this.y.redMul(u2.redMul(c2.redISub(u2)).redISub(s2.redMul(o2)));
  d2 = (d2 = (d2 = d2.redIAdd(d2)).redIAdd(d2)).redIAdd(d2);
  var l2 = this.z.redAdd(s2).redSqr().redISub(r2).redISub(o2);
  return this.curve.jpoint(f2, d2, l2);
}, al.prototype.mul = function(e2, t2) {
  return e2 = new Od(e2, t2), this.curve._wnafMul(this, e2);
}, al.prototype.eq = function(e2) {
  if (e2.type === "affine")
    return this.eq(e2.toJ());
  if (this === e2)
    return true;
  var t2 = this.z.redSqr(), r2 = e2.z.redSqr();
  if (this.x.redMul(r2).redISub(e2.x.redMul(t2)).cmpn(0) !== 0)
    return false;
  var i2 = t2.redMul(this.z), n2 = r2.redMul(e2.z);
  return this.y.redMul(n2).redISub(e2.y.redMul(i2)).cmpn(0) === 0;
}, al.prototype.eqXToP = function(e2) {
  var t2 = this.z.redSqr(), r2 = e2.toRed(this.curve.red).redMul(t2);
  if (this.x.cmp(r2) === 0)
    return true;
  for (var i2 = e2.clone(), n2 = this.curve.redN.redMul(t2); ; ) {
    if (i2.iadd(this.curve.n), i2.cmp(this.curve.p) >= 0)
      return false;
    if (r2.redIAdd(n2), this.x.cmp(r2) === 0)
      return true;
  }
}, al.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
}, al.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
}, rt(sl, Jd);
var ol = sl;
function cl(e2, t2, r2) {
  Jd.BasePoint.call(this, e2, "projective"), t2 === null && r2 === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new Od(t2, 16), this.z = new Od(r2, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
}
sl.prototype.validate = function(e2) {
  var t2 = e2.normalize().x, r2 = t2.redSqr(), i2 = r2.redMul(t2).redAdd(r2.redMul(this.a)).redAdd(t2);
  return i2.redSqrt().redSqr().cmp(i2) === 0;
}, rt(cl, Jd.BasePoint), sl.prototype.decodePoint = function(e2, t2) {
  if ((e2 = Hd.toArray(e2, t2)).length === 33 && e2[0] === 64 && (e2 = e2.slice(1, 33).reverse()), e2.length !== 32)
    throw Error("Unknown point compression format");
  return this.point(e2, 1);
}, sl.prototype.point = function(e2, t2) {
  return new cl(this, e2, t2);
}, sl.prototype.pointFromJSON = function(e2) {
  return cl.fromJSON(this, e2);
}, cl.prototype.precompute = function() {
}, cl.prototype._encode = function(e2) {
  var t2 = this.curve.p.byteLength();
  return e2 ? [64].concat(this.getX().toArray("le", t2)) : this.getX().toArray("be", t2);
}, cl.fromJSON = function(e2, t2) {
  return new cl(e2, t2[0], t2[1] || e2.one);
}, cl.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
}, cl.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
}, cl.prototype.dbl = function() {
  var e2 = this.x.redAdd(this.z).redSqr(), t2 = this.x.redSub(this.z).redSqr(), r2 = e2.redSub(t2), i2 = e2.redMul(t2), n2 = r2.redMul(t2.redAdd(this.curve.a24.redMul(r2)));
  return this.curve.point(i2, n2);
}, cl.prototype.add = function() {
  throw Error("Not supported on Montgomery curve");
}, cl.prototype.diffAdd = function(e2, t2) {
  var r2 = this.x.redAdd(this.z), i2 = this.x.redSub(this.z), n2 = e2.x.redAdd(e2.z), a2 = e2.x.redSub(e2.z).redMul(r2), s2 = n2.redMul(i2), o2 = t2.z.redMul(a2.redAdd(s2).redSqr()), c2 = t2.x.redMul(a2.redISub(s2).redSqr());
  return this.curve.point(o2, c2);
}, cl.prototype.mul = function(e2) {
  for (var t2 = (e2 = new Od(e2, 16)).clone(), r2 = this, i2 = this.curve.point(null, null), n2 = []; t2.cmpn(0) !== 0; t2.iushrn(1))
    n2.push(t2.andln(1));
  for (var a2 = n2.length - 1; a2 >= 0; a2--)
    n2[a2] === 0 ? (r2 = r2.diffAdd(i2, this), i2 = i2.dbl()) : (i2 = r2.diffAdd(i2, this), r2 = r2.dbl());
  return i2;
}, cl.prototype.mulAdd = function() {
  throw Error("Not supported on Montgomery curve");
}, cl.prototype.jumlAdd = function() {
  throw Error("Not supported on Montgomery curve");
}, cl.prototype.eq = function(e2) {
  return this.getX().cmp(e2.getX()) === 0;
}, cl.prototype.normalize = function() {
  return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
}, cl.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
var ul = Hd.assert;
function hl(e2) {
  this.twisted = (0 | e2.a) != 1, this.mOneA = this.twisted && (0 | e2.a) == -1, this.extended = this.mOneA, Jd.call(this, "edwards", e2), this.a = new Od(e2.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new Od(e2.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new Od(e2.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), ul(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (0 | e2.c) == 1;
}
rt(hl, Jd);
var fl = hl;
function dl(e2, t2, r2, i2, n2) {
  Jd.BasePoint.call(this, e2, "projective"), t2 === null && r2 === null && i2 === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = true) : (this.x = new Od(t2, 16), this.y = new Od(r2, 16), this.z = i2 ? new Od(i2, 16) : this.curve.one, this.t = n2 && new Od(n2, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
}
hl.prototype._mulA = function(e2) {
  return this.mOneA ? e2.redNeg() : this.a.redMul(e2);
}, hl.prototype._mulC = function(e2) {
  return this.oneC ? e2 : this.c.redMul(e2);
}, hl.prototype.jpoint = function(e2, t2, r2, i2) {
  return this.point(e2, t2, r2, i2);
}, hl.prototype.pointFromX = function(e2, t2) {
  (e2 = new Od(e2, 16)).red || (e2 = e2.toRed(this.red));
  var r2 = e2.redSqr(), i2 = this.c2.redSub(this.a.redMul(r2)), n2 = this.one.redSub(this.c2.redMul(this.d).redMul(r2)), a2 = i2.redMul(n2.redInvm()), s2 = a2.redSqrt();
  if (s2.redSqr().redSub(a2).cmp(this.zero) !== 0)
    throw Error("invalid point");
  var o2 = s2.fromRed().isOdd();
  return (t2 && !o2 || !t2 && o2) && (s2 = s2.redNeg()), this.point(e2, s2);
}, hl.prototype.pointFromY = function(e2, t2) {
  (e2 = new Od(e2, 16)).red || (e2 = e2.toRed(this.red));
  var r2 = e2.redSqr(), i2 = r2.redSub(this.c2), n2 = r2.redMul(this.d).redMul(this.c2).redSub(this.a), a2 = i2.redMul(n2.redInvm());
  if (a2.cmp(this.zero) === 0) {
    if (t2)
      throw Error("invalid point");
    return this.point(this.zero, e2);
  }
  var s2 = a2.redSqrt();
  if (s2.redSqr().redSub(a2).cmp(this.zero) !== 0)
    throw Error("invalid point");
  return s2.fromRed().isOdd() !== t2 && (s2 = s2.redNeg()), this.point(s2, e2);
}, hl.prototype.validate = function(e2) {
  if (e2.isInfinity())
    return true;
  e2.normalize();
  var t2 = e2.x.redSqr(), r2 = e2.y.redSqr(), i2 = t2.redMul(this.a).redAdd(r2), n2 = this.c2.redMul(this.one.redAdd(this.d.redMul(t2).redMul(r2)));
  return i2.cmp(n2) === 0;
}, rt(dl, Jd.BasePoint), hl.prototype.pointFromJSON = function(e2) {
  return dl.fromJSON(this, e2);
}, hl.prototype.point = function(e2, t2, r2, i2) {
  return new dl(this, e2, t2, r2, i2);
}, dl.fromJSON = function(e2, t2) {
  return new dl(e2, t2[0], t2[1], t2[2]);
}, dl.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
}, dl.prototype.isInfinity = function() {
  return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
}, dl.prototype._extDbl = function() {
  var e2 = this.x.redSqr(), t2 = this.y.redSqr(), r2 = this.z.redSqr();
  r2 = r2.redIAdd(r2);
  var i2 = this.curve._mulA(e2), n2 = this.x.redAdd(this.y).redSqr().redISub(e2).redISub(t2), a2 = i2.redAdd(t2), s2 = a2.redSub(r2), o2 = i2.redSub(t2), c2 = n2.redMul(s2), u2 = a2.redMul(o2), h2 = n2.redMul(o2), f2 = s2.redMul(a2);
  return this.curve.point(c2, u2, f2, h2);
}, dl.prototype._projDbl = function() {
  var e2, t2, r2, i2 = this.x.redAdd(this.y).redSqr(), n2 = this.x.redSqr(), a2 = this.y.redSqr();
  if (this.curve.twisted) {
    var s2 = (u2 = this.curve._mulA(n2)).redAdd(a2);
    if (this.zOne)
      e2 = i2.redSub(n2).redSub(a2).redMul(s2.redSub(this.curve.two)), t2 = s2.redMul(u2.redSub(a2)), r2 = s2.redSqr().redSub(s2).redSub(s2);
    else {
      var o2 = this.z.redSqr(), c2 = s2.redSub(o2).redISub(o2);
      e2 = i2.redSub(n2).redISub(a2).redMul(c2), t2 = s2.redMul(u2.redSub(a2)), r2 = s2.redMul(c2);
    }
  } else {
    var u2 = n2.redAdd(a2);
    o2 = this.curve._mulC(this.z).redSqr(), c2 = u2.redSub(o2).redSub(o2);
    e2 = this.curve._mulC(i2.redISub(u2)).redMul(c2), t2 = this.curve._mulC(u2).redMul(n2.redISub(a2)), r2 = u2.redMul(c2);
  }
  return this.curve.point(e2, t2, r2);
}, dl.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
}, dl.prototype._extAdd = function(e2) {
  var t2 = this.y.redSub(this.x).redMul(e2.y.redSub(e2.x)), r2 = this.y.redAdd(this.x).redMul(e2.y.redAdd(e2.x)), i2 = this.t.redMul(this.curve.dd).redMul(e2.t), n2 = this.z.redMul(e2.z.redAdd(e2.z)), a2 = r2.redSub(t2), s2 = n2.redSub(i2), o2 = n2.redAdd(i2), c2 = r2.redAdd(t2), u2 = a2.redMul(s2), h2 = o2.redMul(c2), f2 = a2.redMul(c2), d2 = s2.redMul(o2);
  return this.curve.point(u2, h2, d2, f2);
}, dl.prototype._projAdd = function(e2) {
  var t2, r2, i2 = this.z.redMul(e2.z), n2 = i2.redSqr(), a2 = this.x.redMul(e2.x), s2 = this.y.redMul(e2.y), o2 = this.curve.d.redMul(a2).redMul(s2), c2 = n2.redSub(o2), u2 = n2.redAdd(o2), h2 = this.x.redAdd(this.y).redMul(e2.x.redAdd(e2.y)).redISub(a2).redISub(s2), f2 = i2.redMul(c2).redMul(h2);
  return this.curve.twisted ? (t2 = i2.redMul(u2).redMul(s2.redSub(this.curve._mulA(a2))), r2 = c2.redMul(u2)) : (t2 = i2.redMul(u2).redMul(s2.redSub(a2)), r2 = this.curve._mulC(c2).redMul(u2)), this.curve.point(f2, t2, r2);
}, dl.prototype.add = function(e2) {
  return this.isInfinity() ? e2 : e2.isInfinity() ? this : this.curve.extended ? this._extAdd(e2) : this._projAdd(e2);
}, dl.prototype.mul = function(e2) {
  return this._hasDoubles(e2) ? this.curve._fixedNafMul(this, e2) : this.curve._wnafMul(this, e2);
}, dl.prototype.mulAdd = function(e2, t2, r2) {
  return this.curve._wnafMulAdd(1, [this, t2], [e2, r2], 2, false);
}, dl.prototype.jmulAdd = function(e2, t2, r2) {
  return this.curve._wnafMulAdd(1, [this, t2], [e2, r2], 2, true);
}, dl.prototype.normalize = function() {
  if (this.zOne)
    return this;
  var e2 = this.z.redInvm();
  return this.x = this.x.redMul(e2), this.y = this.y.redMul(e2), this.t && (this.t = this.t.redMul(e2)), this.z = this.curve.one, this.zOne = true, this;
}, dl.prototype.neg = function() {
  return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
}, dl.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
}, dl.prototype.getY = function() {
  return this.normalize(), this.y.fromRed();
}, dl.prototype.eq = function(e2) {
  return this === e2 || this.getX().cmp(e2.getX()) === 0 && this.getY().cmp(e2.getY()) === 0;
}, dl.prototype.eqXToP = function(e2) {
  var t2 = e2.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(t2) === 0)
    return true;
  for (var r2 = e2.clone(), i2 = this.curve.redN.redMul(this.z); ; ) {
    if (r2.iadd(this.curve.n), r2.cmp(this.curve.p) >= 0)
      return false;
    if (t2.redIAdd(i2), this.x.cmp(t2) === 0)
      return true;
  }
}, dl.prototype.toP = dl.prototype.normalize, dl.prototype.mixedAdd = dl.prototype.add;
var ll = tt(function(e2, t2) {
  var r2 = t2;
  r2.base = Jd, r2.short = il, r2.mont = ol, r2.edwards = fl;
}), pl = st.rotl32, yl = st.sum32, bl = st.sum32_5, ml = pt.ft_1, gl = ut.BlockHash, wl = [1518500249, 1859775393, 2400959708, 3395469782];
function vl() {
  if (!(this instanceof vl))
    return new vl();
  gl.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = Array(80);
}
st.inherits(vl, gl);
var _l = vl;
vl.blockSize = 512, vl.outSize = 160, vl.hmacStrength = 80, vl.padLength = 64, vl.prototype._update = function(e2, t2) {
  for (var r2 = this.W, i2 = 0; i2 < 16; i2++)
    r2[i2] = e2[t2 + i2];
  for (; i2 < r2.length; i2++)
    r2[i2] = pl(r2[i2 - 3] ^ r2[i2 - 8] ^ r2[i2 - 14] ^ r2[i2 - 16], 1);
  var n2 = this.h[0], a2 = this.h[1], s2 = this.h[2], o2 = this.h[3], c2 = this.h[4];
  for (i2 = 0; i2 < r2.length; i2++) {
    var u2 = ~~(i2 / 20), h2 = bl(pl(n2, 5), ml(u2, a2, s2, o2), c2, r2[i2], wl[u2]);
    c2 = o2, o2 = s2, s2 = pl(a2, 30), a2 = n2, n2 = h2;
  }
  this.h[0] = yl(this.h[0], n2), this.h[1] = yl(this.h[1], a2), this.h[2] = yl(this.h[2], s2), this.h[3] = yl(this.h[3], o2), this.h[4] = yl(this.h[4], c2);
}, vl.prototype._digest = function(e2) {
  return e2 === "hex" ? st.toHex32(this.h, "big") : st.split32(this.h, "big");
};
var kl = {sha1: _l, sha224: Ct, sha256: xt, sha384: nr, sha512: Wt};
function Al(e2, t2, r2) {
  if (!(this instanceof Al))
    return new Al(e2, t2, r2);
  this.Hash = e2, this.blockSize = e2.blockSize / 8, this.outSize = e2.outSize / 8, this.inner = null, this.outer = null, this._init(st.toArray(t2, r2));
}
var Sl = Al;
Al.prototype._init = function(e2) {
  e2.length > this.blockSize && (e2 = new this.Hash().update(e2).digest()), Qe(e2.length <= this.blockSize);
  for (var t2 = e2.length; t2 < this.blockSize; t2++)
    e2.push(0);
  for (t2 = 0; t2 < e2.length; t2++)
    e2[t2] ^= 54;
  for (this.inner = new this.Hash().update(e2), t2 = 0; t2 < e2.length; t2++)
    e2[t2] ^= 106;
  this.outer = new this.Hash().update(e2);
}, Al.prototype.update = function(e2, t2) {
  return this.inner.update(e2, t2), this;
}, Al.prototype.digest = function(e2) {
  return this.outer.update(this.inner.digest()), this.outer.digest(e2);
};
var El = tt(function(e2, t2) {
  var r2 = t2;
  r2.utils = st, r2.common = ut, r2.sha = kl, r2.ripemd = wr, r2.hmac = Sl, r2.sha1 = r2.sha.sha1, r2.sha256 = r2.sha.sha256, r2.sha224 = r2.sha.sha224, r2.sha384 = r2.sha.sha384, r2.sha512 = r2.sha.sha512, r2.ripemd160 = r2.ripemd.ripemd160;
}), Pl = {doubles: {step: 4, points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]}, naf: {wnd: 7, points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]}}, xl = tt(function(e2, t2) {
  var r2, i2 = t2, n2 = Hd.assert;
  function a2(e3) {
    if (e3.type === "short")
      this.curve = new ll.short(e3);
    else if (e3.type === "edwards")
      this.curve = new ll.edwards(e3);
    else {
      if (e3.type !== "mont")
        throw Error("Unknown curve type.");
      this.curve = new ll.mont(e3);
    }
    this.g = this.curve.g, this.n = this.curve.n, this.hash = e3.hash, n2(this.g.validate(), "Invalid curve"), n2(this.g.mul(this.n).isInfinity(), "Invalid curve, n*G != O");
  }
  function s2(e3, t3) {
    Object.defineProperty(i2, e3, {configurable: true, enumerable: true, get: function() {
      var r3 = new a2(t3);
      return Object.defineProperty(i2, e3, {configurable: true, enumerable: true, value: r3}), r3;
    }});
  }
  i2.PresetCurve = a2, s2("p192", {type: "short", prime: "p192", p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff", a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc", b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1", n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831", hash: El.sha256, gRed: false, g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]}), s2("p224", {type: "short", prime: "p224", p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001", a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe", b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4", n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d", hash: El.sha256, gRed: false, g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]}), s2("p256", {type: "short", prime: null, p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff", a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc", b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b", n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551", hash: El.sha256, gRed: false, g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]}), s2("p384", {type: "short", prime: null, p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff", a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc", b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef", n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973", hash: El.sha384, gRed: false, g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]}), s2("p521", {type: "short", prime: null, p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff", a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc", b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00", n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409", hash: El.sha512, gRed: false, g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]}), s2("curve25519", {type: "mont", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "76d06", b: "1", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", cofactor: "8", hash: El.sha256, gRed: false, g: ["9"]}), s2("ed25519", {type: "edwards", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "-1", c: "1", d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", cofactor: "8", hash: El.sha256, gRed: false, g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]}), s2("brainpoolP256r1", {type: "short", prime: null, p: "A9FB57DB A1EEA9BC 3E660A90 9D838D72 6E3BF623 D5262028 2013481D 1F6E5377", a: "7D5A0975 FC2C3057 EEF67530 417AFFE7 FB8055C1 26DC5C6C E94A4B44 F330B5D9", b: "26DC5C6C E94A4B44 F330B5D9 BBD77CBF 95841629 5CF7E1CE 6BCCDC18 FF8C07B6", n: "A9FB57DB A1EEA9BC 3E660A90 9D838D71 8C397AA3 B561A6F7 901E0E82 974856A7", hash: El.sha256, gRed: false, g: ["8BD2AEB9CB7E57CB2C4B482FFC81B7AFB9DE27E1E3BD23C23A4453BD9ACE3262", "547EF835C3DAC4FD97F8461A14611DC9C27745132DED8E545C1D54C72F046997"]}), s2("brainpoolP384r1", {type: "short", prime: null, p: "8CB91E82 A3386D28 0F5D6F7E 50E641DF 152F7109 ED5456B4 12B1DA19 7FB71123ACD3A729 901D1A71 87470013 3107EC53", a: "7BC382C6 3D8C150C 3C72080A CE05AFA0 C2BEA28E 4FB22787 139165EF BA91F90F8AA5814A 503AD4EB 04A8C7DD 22CE2826", b: "04A8C7DD 22CE2826 8B39B554 16F0447C 2FB77DE1 07DCD2A6 2E880EA5 3EEB62D57CB43902 95DBC994 3AB78696 FA504C11", n: "8CB91E82 A3386D28 0F5D6F7E 50E641DF 152F7109 ED5456B3 1F166E6C AC0425A7CF3AB6AF 6B7FC310 3B883202 E9046565", hash: El.sha384, gRed: false, g: ["1D1C64F068CF45FFA2A63A81B7C13F6B8847A3E77EF14FE3DB7FCAFE0CBD10E8E826E03436D646AAEF87B2E247D4AF1E", "8ABE1D7520F9C2A45CB1EB8E95CFD55262B70B29FEEC5864E19C054FF99129280E4646217791811142820341263C5315"]}), s2("brainpoolP512r1", {type: "short", prime: null, p: "AADD9DB8 DBE9C48B 3FD4E6AE 33C9FC07 CB308DB3 B3C9D20E D6639CCA 703308717D4D9B00 9BC66842 AECDA12A E6A380E6 2881FF2F 2D82C685 28AA6056 583A48F3", a: "7830A331 8B603B89 E2327145 AC234CC5 94CBDD8D 3DF91610 A83441CA EA9863BC2DED5D5A A8253AA1 0A2EF1C9 8B9AC8B5 7F1117A7 2BF2C7B9 E7C1AC4D 77FC94CA", b: "3DF91610 A83441CA EA9863BC 2DED5D5A A8253AA1 0A2EF1C9 8B9AC8B5 7F1117A72BF2C7B9 E7C1AC4D 77FC94CA DC083E67 984050B7 5EBAE5DD 2809BD63 8016F723", n: "AADD9DB8 DBE9C48B 3FD4E6AE 33C9FC07 CB308DB3 B3C9D20E D6639CCA 70330870553E5C41 4CA92619 41866119 7FAC1047 1DB1D381 085DDADD B5879682 9CA90069", hash: El.sha512, gRed: false, g: ["81AEE4BDD82ED9645A21322E9C4C6A9385ED9F70B5D916C1B43B62EEF4D0098EFF3B1F78E2D0D48D50D1687B93B97D5F7C6D5047406A5E688B352209BCB9F822", "7DDE385D566332ECC0EABFA9CF7822FDF209F70024A57B1AA000C55B881F8111B2DCDE494A5F485E5BCA4BD88A2763AED1CA2B2FA8F0540678CD1E0F3AD80892"]});
  try {
    r2 = Pl;
  } catch (e3) {
    r2 = void 0;
  }
  s2("secp256k1", {type: "short", prime: "k256", p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f", a: "0", b: "7", n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141", h: "1", hash: El.sha256, beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee", lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72", basis: [{a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3"}, {a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15"}], gRed: false, g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", r2]});
});
function Ml(e2) {
  if (!(this instanceof Ml))
    return new Ml(e2);
  this.hash = e2.hash, this.predResist = !!e2.predResist, this.outLen = this.hash.outSize, this.minEntropy = e2.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var t2 = Wd.toArray(e2.entropy, e2.entropyEnc || "hex"), r2 = Wd.toArray(e2.nonce, e2.nonceEnc || "hex"), i2 = Wd.toArray(e2.pers, e2.persEnc || "hex");
  Qe(t2.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t2, r2, i2);
}
var Cl = Ml;
Ml.prototype._init = function(e2, t2, r2) {
  var i2 = e2.concat(t2).concat(r2);
  this.K = Array(this.outLen / 8), this.V = Array(this.outLen / 8);
  for (var n2 = 0; n2 < this.V.length; n2++)
    this.K[n2] = 0, this.V[n2] = 1;
  this._update(i2), this._reseed = 1, this.reseedInterval = 281474976710656;
}, Ml.prototype._hmac = function() {
  return new El.hmac(this.hash, this.K);
}, Ml.prototype._update = function(e2) {
  var t2 = this._hmac().update(this.V).update([0]);
  e2 && (t2 = t2.update(e2)), this.K = t2.digest(), this.V = this._hmac().update(this.V).digest(), e2 && (this.K = this._hmac().update(this.V).update([1]).update(e2).digest(), this.V = this._hmac().update(this.V).digest());
}, Ml.prototype.reseed = function(e2, t2, r2, i2) {
  typeof t2 != "string" && (i2 = r2, r2 = t2, t2 = null), e2 = Wd.toArray(e2, t2), r2 = Wd.toArray(r2, i2), Qe(e2.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e2.concat(r2 || [])), this._reseed = 1;
}, Ml.prototype.generate = function(e2, t2, r2, i2) {
  if (this._reseed > this.reseedInterval)
    throw Error("Reseed is required");
  typeof t2 != "string" && (i2 = r2, r2 = t2, t2 = null), r2 && (r2 = Wd.toArray(r2, i2 || "hex"), this._update(r2));
  for (var n2 = []; n2.length < e2; )
    this.V = this._hmac().update(this.V).digest(), n2 = n2.concat(this.V);
  var a2 = n2.slice(0, e2);
  return this._update(r2), this._reseed++, Wd.encode(a2, t2);
};
var Kl = Hd.assert;
function Dl(e2, t2) {
  this.ec = e2, this.priv = null, this.pub = null, t2.priv && this._importPrivate(t2.priv, t2.privEnc), t2.pub && this._importPublic(t2.pub, t2.pubEnc);
}
var Rl = Dl;
Dl.fromPublic = function(e2, t2, r2) {
  return t2 instanceof Dl ? t2 : new Dl(e2, {pub: t2, pubEnc: r2});
}, Dl.fromPrivate = function(e2, t2, r2) {
  return t2 instanceof Dl ? t2 : new Dl(e2, {priv: t2, privEnc: r2});
}, Dl.prototype.validate = function() {
  var e2 = this.getPublic();
  return e2.isInfinity() ? {result: false, reason: "Invalid public key"} : e2.validate() ? e2.mul(this.ec.curve.n).isInfinity() ? {result: true, reason: null} : {result: false, reason: "Public key * N != O"} : {result: false, reason: "Public key is not a point"};
}, Dl.prototype.getPublic = function(e2, t2) {
  return this.pub || (this.pub = this.ec.g.mul(this.priv)), e2 ? this.pub.encode(e2, t2) : this.pub;
}, Dl.prototype.getPrivate = function(e2) {
  return e2 === "hex" ? this.priv.toString(16, 2) : this.priv;
}, Dl.prototype._importPrivate = function(e2, t2) {
  if (this.priv = new Od(e2, t2 || 16), this.ec.curve.type === "mont") {
    var r2 = this.ec.curve.one, i2 = r2.ushln(252).sub(r2).ushln(3);
    this.priv = this.priv.or(r2.ushln(254)), this.priv = this.priv.and(i2);
  } else
    this.priv = this.priv.umod(this.ec.curve.n);
}, Dl.prototype._importPublic = function(e2, t2) {
  if (e2.x || e2.y)
    return this.ec.curve.type === "mont" ? Kl(e2.x, "Need x coordinate") : this.ec.curve.type !== "short" && this.ec.curve.type !== "edwards" || Kl(e2.x && e2.y, "Need both x and y coordinate"), void (this.pub = this.ec.curve.point(e2.x, e2.y));
  this.pub = this.ec.curve.decodePoint(e2, t2);
}, Dl.prototype.derive = function(e2) {
  return e2.mul(this.priv).getX();
}, Dl.prototype.sign = function(e2, t2, r2) {
  return this.ec.sign(e2, this, t2, r2);
}, Dl.prototype.verify = function(e2, t2) {
  return this.ec.verify(e2, t2, this);
}, Dl.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var Ul = Hd.assert;
function Il(e2, t2) {
  if (e2 instanceof Il)
    return e2;
  this._importDER(e2, t2) || (Ul(e2.r && e2.s, "Signature without r or s"), this.r = new Od(e2.r, 16), this.s = new Od(e2.s, 16), e2.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = e2.recoveryParam);
}
var Bl = Il;
function Tl() {
  this.place = 0;
}
function zl(e2, t2) {
  var r2 = e2[t2.place++];
  if (!(128 & r2))
    return r2;
  for (var i2 = 15 & r2, n2 = 0, a2 = 0, s2 = t2.place; a2 < i2; a2++, s2++)
    n2 <<= 8, n2 |= e2[s2];
  return t2.place = s2, n2;
}
function ql(e2) {
  for (var t2 = 0, r2 = e2.length - 1; !e2[t2] && !(128 & e2[t2 + 1]) && t2 < r2; )
    t2++;
  return t2 === 0 ? e2 : e2.slice(t2);
}
function Ol(e2, t2) {
  if (t2 < 128)
    e2.push(t2);
  else {
    var r2 = 1 + (Math.log(t2) / Math.LN2 >>> 3);
    for (e2.push(128 | r2); --r2; )
      e2.push(t2 >>> (r2 << 3) & 255);
    e2.push(t2);
  }
}
Il.prototype._importDER = function(e2, t2) {
  e2 = Hd.toArray(e2, t2);
  var r2 = new Tl();
  if (e2[r2.place++] !== 48)
    return false;
  if (zl(e2, r2) + r2.place !== e2.length)
    return false;
  if (e2[r2.place++] !== 2)
    return false;
  var i2 = zl(e2, r2), n2 = e2.slice(r2.place, i2 + r2.place);
  if (r2.place += i2, e2[r2.place++] !== 2)
    return false;
  var a2 = zl(e2, r2);
  if (e2.length !== a2 + r2.place)
    return false;
  var s2 = e2.slice(r2.place, a2 + r2.place);
  return n2[0] === 0 && 128 & n2[1] && (n2 = n2.slice(1)), s2[0] === 0 && 128 & s2[1] && (s2 = s2.slice(1)), this.r = new Od(n2), this.s = new Od(s2), this.recoveryParam = null, true;
}, Il.prototype.toDER = function(e2) {
  var t2 = this.r.toArray(), r2 = this.s.toArray();
  for (128 & t2[0] && (t2 = [0].concat(t2)), 128 & r2[0] && (r2 = [0].concat(r2)), t2 = ql(t2), r2 = ql(r2); !(r2[0] || 128 & r2[1]); )
    r2 = r2.slice(1);
  var i2 = [2];
  Ol(i2, t2.length), (i2 = i2.concat(t2)).push(2), Ol(i2, r2.length);
  var n2 = i2.concat(r2), a2 = [48];
  return Ol(a2, n2.length), a2 = a2.concat(n2), Hd.encode(a2, e2);
};
var Fl = Hd.assert;
function Nl(e2) {
  if (!(this instanceof Nl))
    return new Nl(e2);
  typeof e2 == "string" && (Fl(xl.hasOwnProperty(e2), "Unknown curve " + e2), e2 = xl[e2]), e2 instanceof xl.PresetCurve && (e2 = {curve: e2}), this.curve = e2.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e2.curve.g, this.g.precompute(e2.curve.n.bitLength() + 1), this.hash = e2.hash || e2.curve.hash;
}
var jl = Nl;
Nl.prototype.keyPair = function(e2) {
  return new Rl(this, e2);
}, Nl.prototype.keyFromPrivate = function(e2, t2) {
  return Rl.fromPrivate(this, e2, t2);
}, Nl.prototype.keyFromPublic = function(e2, t2) {
  return Rl.fromPublic(this, e2, t2);
}, Nl.prototype.genKeyPair = function(e2) {
  e2 || (e2 = {});
  var t2 = new Cl({hash: this.hash, pers: e2.pers, persEnc: e2.persEnc || "utf8", entropy: e2.entropy || Gd(this.hash.hmacStrength), entropyEnc: e2.entropy && e2.entropyEnc || "utf8", nonce: this.n.toArray()});
  if (this.curve.type === "mont") {
    var r2 = new Od(t2.generate(32));
    return this.keyFromPrivate(r2);
  }
  for (var i2 = this.n.byteLength(), n2 = this.n.sub(new Od(2)); ; ) {
    if (!((r2 = new Od(t2.generate(i2))).cmp(n2) > 0))
      return r2.iaddn(1), this.keyFromPrivate(r2);
  }
}, Nl.prototype._truncateToN = function(e2, t2, r2) {
  var i2 = (r2 = r2 || 8 * e2.byteLength()) - this.n.bitLength();
  return i2 > 0 && (e2 = e2.ushrn(i2)), !t2 && e2.cmp(this.n) >= 0 ? e2.sub(this.n) : e2;
}, Nl.prototype.truncateMsg = function(e2) {
  var t2;
  return e2 instanceof Uint8Array ? (t2 = 8 * e2.byteLength, e2 = this._truncateToN(new Od(e2, 16), false, t2)) : typeof e2 == "string" ? (t2 = 4 * e2.length, e2 = this._truncateToN(new Od(e2, 16), false, t2)) : e2 = this._truncateToN(new Od(e2, 16)), e2;
}, Nl.prototype.sign = function(e2, t2, r2, i2) {
  typeof r2 == "object" && (i2 = r2, r2 = null), i2 || (i2 = {}), t2 = this.keyFromPrivate(t2, r2), e2 = this.truncateMsg(e2);
  for (var n2 = this.n.byteLength(), a2 = t2.getPrivate().toArray("be", n2), s2 = e2.toArray("be", n2), o2 = new Cl({hash: this.hash, entropy: a2, nonce: s2, pers: i2.pers, persEnc: i2.persEnc || "utf8"}), c2 = this.n.sub(new Od(1)), u2 = 0; ; u2++) {
    var h2 = i2.k ? i2.k(u2) : new Od(o2.generate(this.n.byteLength()));
    if (!((h2 = this._truncateToN(h2, true)).cmpn(1) <= 0 || h2.cmp(c2) >= 0)) {
      var f2 = this.g.mul(h2);
      if (!f2.isInfinity()) {
        var d2 = f2.getX(), l2 = d2.umod(this.n);
        if (l2.cmpn(0) !== 0) {
          var p2 = h2.invm(this.n).mul(l2.mul(t2.getPrivate()).iadd(e2));
          if ((p2 = p2.umod(this.n)).cmpn(0) !== 0) {
            var y2 = (f2.getY().isOdd() ? 1 : 0) | (d2.cmp(l2) !== 0 ? 2 : 0);
            return i2.canonical && p2.cmp(this.nh) > 0 && (p2 = this.n.sub(p2), y2 ^= 1), new Bl({r: l2, s: p2, recoveryParam: y2});
          }
        }
      }
    }
  }
}, Nl.prototype.verify = function(e2, t2, r2, i2) {
  return r2 = this.keyFromPublic(r2, i2), t2 = new Bl(t2, "hex"), this._verify(this.truncateMsg(e2), t2, r2) || this._verify(this._truncateToN(new Od(e2, 16)), t2, r2);
}, Nl.prototype._verify = function(e2, t2, r2) {
  var i2 = t2.r, n2 = t2.s;
  if (i2.cmpn(1) < 0 || i2.cmp(this.n) >= 0)
    return false;
  if (n2.cmpn(1) < 0 || n2.cmp(this.n) >= 0)
    return false;
  var a2, s2 = n2.invm(this.n), o2 = s2.mul(e2).umod(this.n), c2 = s2.mul(i2).umod(this.n);
  return this.curve._maxwellTrick ? !(a2 = this.g.jmulAdd(o2, r2.getPublic(), c2)).isInfinity() && a2.eqXToP(i2) : !(a2 = this.g.mulAdd(o2, r2.getPublic(), c2)).isInfinity() && a2.getX().umod(this.n).cmp(i2) === 0;
}, Nl.prototype.recoverPubKey = function(e2, t2, r2, i2) {
  Fl((3 & r2) === r2, "The recovery param is more than two bits"), t2 = new Bl(t2, i2);
  var n2 = this.n, a2 = new Od(e2), s2 = t2.r, o2 = t2.s, c2 = 1 & r2, u2 = r2 >> 1;
  if (s2.cmp(this.curve.p.umod(this.curve.n)) >= 0 && u2)
    throw Error("Unable to find sencond key candinate");
  s2 = u2 ? this.curve.pointFromX(s2.add(this.curve.n), c2) : this.curve.pointFromX(s2, c2);
  var h2 = t2.r.invm(n2), f2 = n2.sub(a2).mul(h2).umod(n2), d2 = o2.mul(h2).umod(n2);
  return this.g.mulAdd(f2, s2, d2);
}, Nl.prototype.getKeyRecoveryParam = function(e2, t2, r2, i2) {
  if ((t2 = new Bl(t2, i2)).recoveryParam !== null)
    return t2.recoveryParam;
  for (var n2 = 0; n2 < 4; n2++) {
    var a2;
    try {
      a2 = this.recoverPubKey(e2, t2, n2);
    } catch (e3) {
      continue;
    }
    if (a2.eq(r2))
      return n2;
  }
  throw Error("Unable to find valid recovery factor");
};
var Ll = Hd.assert, Wl = Hd.parseBytes, Hl = Hd.cachedProperty;
function Gl(e2, t2) {
  if (this.eddsa = e2, t2.hasOwnProperty("secret") && (this._secret = Wl(t2.secret)), e2.isPoint(t2.pub))
    this._pub = t2.pub;
  else if (this._pubBytes = Wl(t2.pub), this._pubBytes && this._pubBytes.length === 33 && this._pubBytes[0] === 64 && (this._pubBytes = this._pubBytes.slice(1, 33)), this._pubBytes && this._pubBytes.length !== 32)
    throw Error("Unknown point compression format");
}
Gl.fromPublic = function(e2, t2) {
  return t2 instanceof Gl ? t2 : new Gl(e2, {pub: t2});
}, Gl.fromSecret = function(e2, t2) {
  return t2 instanceof Gl ? t2 : new Gl(e2, {secret: t2});
}, Gl.prototype.secret = function() {
  return this._secret;
}, Hl(Gl, "pubBytes", function() {
  return this.eddsa.encodePoint(this.pub());
}), Hl(Gl, "pub", function() {
  return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
}), Hl(Gl, "privBytes", function() {
  var e2 = this.eddsa, t2 = this.hash(), r2 = e2.encodingLength - 1, i2 = t2.slice(0, e2.encodingLength);
  return i2[0] &= 248, i2[r2] &= 127, i2[r2] |= 64, i2;
}), Hl(Gl, "priv", function() {
  return this.eddsa.decodeInt(this.privBytes());
}), Hl(Gl, "hash", function() {
  return this.eddsa.hash().update(this.secret()).digest();
}), Hl(Gl, "messagePrefix", function() {
  return this.hash().slice(this.eddsa.encodingLength);
}), Gl.prototype.sign = function(e2) {
  return Ll(this._secret, "KeyPair can only verify"), this.eddsa.sign(e2, this);
}, Gl.prototype.verify = function(e2, t2) {
  return this.eddsa.verify(e2, t2, this);
}, Gl.prototype.getSecret = function(e2) {
  return Ll(this._secret, "KeyPair is public only"), Hd.encode(this.secret(), e2);
}, Gl.prototype.getPublic = function(e2, t2) {
  return Hd.encode((t2 ? [64] : []).concat(this.pubBytes()), e2);
};
var Vl = Gl, $l = Hd.assert, Zl = Hd.cachedProperty, Yl = Hd.parseBytes;
function Xl(e2, t2) {
  this.eddsa = e2, typeof t2 != "object" && (t2 = Yl(t2)), Array.isArray(t2) && (t2 = {R: t2.slice(0, e2.encodingLength), S: t2.slice(e2.encodingLength)}), $l(t2.R && t2.S, "Signature without R or S"), e2.isPoint(t2.R) && (this._R = t2.R), t2.S instanceof Od && (this._S = t2.S), this._Rencoded = Array.isArray(t2.R) ? t2.R : t2.Rencoded, this._Sencoded = Array.isArray(t2.S) ? t2.S : t2.Sencoded;
}
Zl(Xl, "S", function() {
  return this.eddsa.decodeInt(this.Sencoded());
}), Zl(Xl, "R", function() {
  return this.eddsa.decodePoint(this.Rencoded());
}), Zl(Xl, "Rencoded", function() {
  return this.eddsa.encodePoint(this.R());
}), Zl(Xl, "Sencoded", function() {
  return this.eddsa.encodeInt(this.S());
}), Xl.prototype.toBytes = function() {
  return this.Rencoded().concat(this.Sencoded());
}, Xl.prototype.toHex = function() {
  return Hd.encode(this.toBytes(), "hex").toUpperCase();
};
var Ql = Xl, Jl = Hd.assert, ep = Hd.parseBytes;
function tp(e2) {
  if (Jl(e2 === "ed25519", "only tested with ed25519 so far"), !(this instanceof tp))
    return new tp(e2);
  e2 = xl[e2].curve;
  this.curve = e2, this.g = e2.g, this.g.precompute(e2.n.bitLength() + 1), this.pointClass = e2.point().constructor, this.encodingLength = Math.ceil(e2.n.bitLength() / 8), this.hash = El.sha512;
}
var rp = tp;
tp.prototype.sign = function(e2, t2) {
  e2 = ep(e2);
  var r2 = this.keyFromSecret(t2), i2 = this.hashInt(r2.messagePrefix(), e2), n2 = this.g.mul(i2), a2 = this.encodePoint(n2), s2 = this.hashInt(a2, r2.pubBytes(), e2).mul(r2.priv()), o2 = i2.add(s2).umod(this.curve.n);
  return this.makeSignature({R: n2, S: o2, Rencoded: a2});
}, tp.prototype.verify = function(e2, t2, r2) {
  e2 = ep(e2), t2 = this.makeSignature(t2);
  var i2 = this.keyFromPublic(r2), n2 = this.hashInt(t2.Rencoded(), i2.pubBytes(), e2), a2 = this.g.mul(t2.S());
  return t2.R().add(i2.pub().mul(n2)).eq(a2);
}, tp.prototype.hashInt = function() {
  for (var e2 = this.hash(), t2 = 0; t2 < arguments.length; t2++)
    e2.update(arguments[t2]);
  return Hd.intFromLE(e2.digest()).umod(this.curve.n);
}, tp.prototype.keyPair = function(e2) {
  return new Vl(this, e2);
}, tp.prototype.keyFromPublic = function(e2) {
  return Vl.fromPublic(this, e2);
}, tp.prototype.keyFromSecret = function(e2) {
  return Vl.fromSecret(this, e2);
}, tp.prototype.genKeyPair = function(e2) {
  e2 || (e2 = {});
  var t2 = new Cl({hash: this.hash, pers: e2.pers, persEnc: e2.persEnc || "utf8", entropy: e2.entropy || Gd(this.hash.hmacStrength), entropyEnc: e2.entropy && e2.entropyEnc || "utf8", nonce: this.curve.n.toArray()});
  return this.keyFromSecret(t2.generate(32));
}, tp.prototype.makeSignature = function(e2) {
  return e2 instanceof Ql ? e2 : new Ql(this, e2);
}, tp.prototype.encodePoint = function(e2) {
  var t2 = e2.getY().toArray("le", this.encodingLength);
  return t2[this.encodingLength - 1] |= e2.getX().isOdd() ? 128 : 0, t2;
}, tp.prototype.decodePoint = function(e2) {
  var t2 = (e2 = Hd.parseBytes(e2)).length - 1, r2 = e2.slice(0, t2).concat(-129 & e2[t2]), i2 = (128 & e2[t2]) != 0, n2 = Hd.intFromLE(r2);
  return this.curve.pointFromY(n2, i2);
}, tp.prototype.encodeInt = function(e2) {
  return e2.toArray("le", this.encodingLength);
}, tp.prototype.decodeInt = function(e2) {
  return Hd.intFromLE(e2);
}, tp.prototype.isPoint = function(e2) {
  return e2 instanceof this.pointClass;
};
var ip = tt(function(e2, t2) {
  var r2 = t2;
  r2.utils = Hd, r2.rand = Gd, r2.curve = ll, r2.curves = xl, r2.ec = jl, r2.eddsa = rp;
}), np = /* @__PURE__ */ Object.freeze({__proto__: null, default: ip, __moduleExports: ip});

export { hc as createMessage, vc as encrypt, Jo as readKey };
