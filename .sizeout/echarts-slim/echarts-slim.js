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
var sl = function(e, t) {
  return sl = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (r[i] = n[i]);
  }, sl(e, t);
};
function B(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  sl(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r());
}
var r0 = /* @__PURE__ */ function() {
  function e() {
    this.firefox = !1, this.ie = !1, this.edge = !1, this.newEdge = !1, this.weChat = !1;
  }
  return e;
}(), n0 = /* @__PURE__ */ function() {
  function e() {
    this.browser = new r0(), this.node = !1, this.wxa = !1, this.worker = !1, this.svgSupported = !1, this.touchEventsSupported = !1, this.pointerEventsSupported = !1, this.domSupported = !1, this.transformSupported = !1, this.transform3dSupported = !1, this.hasGlobalWindow = typeof window != "undefined";
  }
  return e;
}(), tt = new n0();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function" ? (tt.wxa = !0, tt.touchEventsSupported = !0) : typeof document == "undefined" && typeof self != "undefined" ? tt.worker = !0 : !tt.hasGlobalWindow || "Deno" in window || typeof navigator != "undefined" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Node.js") > -1 ? (tt.node = !0, tt.svgSupported = !0) : i0(navigator.userAgent, tt);
function i0(e, t) {
  var r = t.browser, n = e.match(/Firefox\/([\d.]+)/), i = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/.+?rv:(([\d.]+))/), a = e.match(/Edge?\/([\d.]+)/), o = /micromessenger/i.test(e);
  n && (r.firefox = !0, r.version = n[1]), i && (r.ie = !0, r.version = i[1]), a && (r.edge = !0, r.version = a[1], r.newEdge = +a[1].split(".")[0] > 18), o && (r.weChat = !0), t.svgSupported = typeof SVGRect != "undefined", t.touchEventsSupported = "ontouchstart" in window && !r.ie && !r.edge, t.pointerEventsSupported = "onpointerdown" in window && (r.edge || r.ie && +r.version >= 11);
  var s = t.domSupported = typeof document != "undefined";
  if (s) {
    var u = document.documentElement.style;
    t.transform3dSupported = (r.ie && "transition" in u || r.edge || "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix() || "MozPerspective" in u) && !("OTransition" in u), t.transformSupported = t.transform3dSupported || r.ie && +r.version >= 9;
  }
}
var vf = 12, a0 = "sans-serif", mr = vf + "px " + a0, o0 = 20, s0 = 100, u0 = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function l0(e) {
  var t = {};
  if (typeof JSON == "undefined")
    return t;
  for (var r = 0; r < e.length; r++) {
    var n = String.fromCharCode(r + 32), i = (e.charCodeAt(r) - o0) / s0;
    t[n] = i;
  }
  return t;
}
var f0 = l0(u0), Tt = {
  createCanvas: function() {
    return typeof document != "undefined" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ function() {
    var e, t;
    return function(r, n) {
      if (!e) {
        var i = Tt.createCanvas();
        e = i && i.getContext("2d");
      }
      if (e)
        return t !== n && (t = e.font = n || mr), e.measureText(r);
      r = r || "", n = n || mr;
      var a = /((?:\d+)?\.?\d*)px/.exec(n), o = a && +a[1] || vf, s = 0;
      if (n.indexOf("mono") >= 0)
        s = o * r.length;
      else
        for (var u = 0; u < r.length; u++) {
          var l = f0[r[u]];
          s += l == null ? o : l * o;
        }
      return { width: s };
    };
  }(),
  loadImage: function(e, t, r) {
    var n = new Image();
    return n.onload = t, n.onerror = r, n.src = e, n;
  },
  getTime: function() {
    return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
  }
};
function op(e) {
  for (var t in Tt)
    Tt.hasOwnProperty(t) && e[t] && (Tt[t] = e[t]);
}
var sp = Ve([
  "Function",
  "RegExp",
  "Date",
  "Error",
  "CanvasGradient",
  "CanvasPattern",
  "Image",
  "Canvas"
], function(e, t) {
  return e["[object " + t + "]"] = !0, e;
}, {}), up = Ve([
  "Int8",
  "Uint8",
  "Uint8Clamped",
  "Int16",
  "Uint16",
  "Int32",
  "Uint32",
  "Float32",
  "Float64"
], function(e, t) {
  return e["[object " + t + "Array]"] = !0, e;
}, {}), ei = Object.prototype.toString, is = Array.prototype, h0 = is.forEach, v0 = is.filter, cf = is.slice, c0 = is.map, zh = function() {
}.constructor, ma = zh ? zh.prototype : null, df = "__proto__", Fs = 2311, d0 = Math.pow(2, 53) - 1;
function pf() {
  return Fs >= d0 && (Fs = 0), Fs++;
}
function as() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  typeof console != "undefined" && console.error.apply(console, e);
}
function $(e) {
  if (e == null || typeof e != "object")
    return e;
  var t = e, r = ei.call(e);
  if (r === "[object Array]") {
    if (!Vn(e)) {
      t = [];
      for (var n = 0, i = e.length; n < i; n++)
        t[n] = $(e[n]);
    }
  } else if (up[r]) {
    if (!Vn(e)) {
      var a = e.constructor;
      if (a.from)
        t = a.from(e);
      else {
        t = new a(e.length);
        for (var n = 0, i = e.length; n < i; n++)
          t[n] = e[n];
      }
    }
  } else if (!sp[r] && !Vn(e) && !Io(e)) {
    t = {};
    for (var o in e)
      e.hasOwnProperty(o) && o !== df && (t[o] = $(e[o]));
  }
  return t;
}
function ct(e, t, r) {
  if (!F(t) || !F(e))
    return r ? $(t) : e;
  for (var n in t)
    if (t.hasOwnProperty(n) && n !== df) {
      var i = e[n], a = t[n];
      F(a) && F(i) && !N(a) && !N(i) && !Io(a) && !Io(i) && !ul(a) && !ul(i) && !Vn(a) && !Vn(i) ? ct(i, a, r) : (r || !(n in e)) && (e[n] = $(t[n]));
    }
  return e;
}
function p0(e, t) {
  for (var r = e[0], n = 1, i = e.length; n < i; n++)
    r = ct(r, e[n], t);
  return r;
}
function A(e, t) {
  if (Object.assign)
    Object.assign(e, t);
  else
    for (var r in t)
      t.hasOwnProperty(r) && r !== df && (e[r] = t[r]);
  return e;
}
function lp(e, t, r) {
  e = e || {};
  for (var n = 0; n < r.length; n++) {
    var i = r[n];
    e[i] = t[i];
  }
  return e;
}
function mt(e, t, r) {
  for (var n = ft(t), i = 0, a = n.length; i < a; i++) {
    var o = n[i];
    (r ? t[o] != null : e[o] == null) && (e[o] = t[o]);
  }
  return e;
}
var g0 = Tt.createCanvas;
function at(e, t) {
  if (e) {
    if (e.indexOf)
      return e.indexOf(t);
    for (var r = 0, n = e.length; r < n; r++)
      if (e[r] === t)
        return r;
  }
  return -1;
}
function gf(e, t) {
  var r = e.prototype;
  function n() {
  }
  n.prototype = t.prototype, e.prototype = new n();
  for (var i in r)
    r.hasOwnProperty(i) && (e.prototype[i] = r[i]);
  e.prototype.constructor = e, e.superClass = t;
}
function ee(e, t, r) {
  if (e = "prototype" in e ? e.prototype : e, t = "prototype" in t ? t.prototype : t, Object.getOwnPropertyNames)
    for (var n = Object.getOwnPropertyNames(t), i = 0; i < n.length; i++) {
      var a = n[i];
      a !== "constructor" && (r ? t[a] != null : e[a] == null) && (e[a] = t[a]);
    }
  else
    mt(e, t, r);
}
function $t(e) {
  return !e || typeof e == "string" ? !1 : typeof e.length == "number";
}
function D(e, t, r) {
  if (e && t)
    if (e.forEach && e.forEach === h0)
      e.forEach(t, r);
    else if (e.length === +e.length)
      for (var n = 0, i = e.length; n < i; n++)
        t.call(r, e[n], n, e);
    else
      for (var a in e)
        e.hasOwnProperty(a) && t.call(r, e[a], a, e);
}
function z(e, t, r) {
  if (!e)
    return [];
  if (!t)
    return os(e);
  if (e.map && e.map === c0)
    return e.map(t, r);
  for (var n = [], i = 0, a = e.length; i < a; i++)
    n.push(t.call(r, e[i], i, e));
  return n;
}
function Ve(e, t, r, n) {
  if (e && t) {
    for (var i = 0, a = e.length; i < a; i++)
      r = t.call(n, r, e[i], i, e);
    return r;
  }
}
function It(e, t, r) {
  if (!e)
    return [];
  if (!t)
    return os(e);
  if (e.filter && e.filter === v0)
    return e.filter(t, r);
  for (var n = [], i = 0, a = e.length; i < a; i++)
    t.call(r, e[i], i, e) && n.push(e[i]);
  return n;
}
function y0(e, t, r) {
  if (e && t) {
    for (var n = 0, i = e.length; n < i; n++)
      if (t.call(r, e[n], n, e))
        return e[n];
  }
}
function ft(e) {
  if (!e)
    return [];
  if (Object.keys)
    return Object.keys(e);
  var t = [];
  for (var r in e)
    e.hasOwnProperty(r) && t.push(r);
  return t;
}
function m0(e, t) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  return function() {
    return e.apply(t, r.concat(cf.call(arguments)));
  };
}
var lt = ma && Z(ma.bind) ? ma.call.bind(ma.bind) : m0;
function Je(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return function() {
    return e.apply(this, t.concat(cf.call(arguments)));
  };
}
function N(e) {
  return Array.isArray ? Array.isArray(e) : ei.call(e) === "[object Array]";
}
function Z(e) {
  return typeof e == "function";
}
function G(e) {
  return typeof e == "string";
}
function fp(e) {
  return ei.call(e) === "[object String]";
}
function pt(e) {
  return typeof e == "number";
}
function F(e) {
  var t = typeof e;
  return t === "function" || !!e && t === "object";
}
function ul(e) {
  return !!sp[ei.call(e)];
}
function Vt(e) {
  return !!up[ei.call(e)];
}
function Io(e) {
  return typeof e == "object" && typeof e.nodeType == "number" && typeof e.ownerDocument == "object";
}
function fa(e) {
  return e.colorStops != null;
}
function hp(e) {
  return e.image != null;
}
function _0(e) {
  return ei.call(e) === "[object RegExp]";
}
function Xi(e) {
  return e !== e;
}
function ll() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  for (var r = 0, n = e.length; r < n; r++)
    if (e[r] != null)
      return e[r];
}
function W(e, t) {
  return e != null ? e : t;
}
function je(e, t, r) {
  return e != null ? e : t != null ? t : r;
}
function os(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return cf.apply(e, t);
}
function ss(e) {
  if (typeof e == "number")
    return [e, e, e, e];
  var t = e.length;
  return t === 2 ? [e[0], e[1], e[0], e[1]] : t === 3 ? [e[0], e[1], e[2], e[1]] : e;
}
function He(e, t) {
  if (!e)
    throw new Error(t);
}
function Qe(e) {
  return e == null ? null : typeof e.trim == "function" ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
var vp = "__ec_primitive__";
function xo(e) {
  e[vp] = !0;
}
function Vn(e) {
  return e[vp];
}
var S0 = function() {
  function e() {
    this.data = {};
  }
  return e.prototype.delete = function(t) {
    var r = this.has(t);
    return r && delete this.data[t], r;
  }, e.prototype.has = function(t) {
    return this.data.hasOwnProperty(t);
  }, e.prototype.get = function(t) {
    return this.data[t];
  }, e.prototype.set = function(t, r) {
    return this.data[t] = r, this;
  }, e.prototype.keys = function() {
    return ft(this.data);
  }, e.prototype.forEach = function(t) {
    var r = this.data;
    for (var n in r)
      r.hasOwnProperty(n) && t(r[n], n);
  }, e;
}(), cp = typeof Map == "function";
function w0() {
  return cp ? /* @__PURE__ */ new Map() : new S0();
}
var dp = function() {
  function e(t) {
    var r = N(t);
    this.data = w0();
    var n = this;
    t instanceof e ? t.each(i) : t && D(t, i);
    function i(a, o) {
      r ? n.set(a, o) : n.set(o, a);
    }
  }
  return e.prototype.hasKey = function(t) {
    return this.data.has(t);
  }, e.prototype.get = function(t) {
    return this.data.get(t);
  }, e.prototype.set = function(t, r) {
    return this.data.set(t, r), r;
  }, e.prototype.each = function(t, r) {
    this.data.forEach(function(n, i) {
      t.call(r, n, i);
    });
  }, e.prototype.keys = function() {
    var t = this.data.keys();
    return cp ? Array.from(t) : t;
  }, e.prototype.removeKey = function(t) {
    this.data.delete(t);
  }, e;
}();
function V(e) {
  return new dp(e);
}
function pp(e, t) {
  for (var r = new e.constructor(e.length + t.length), n = 0; n < e.length; n++)
    r[n] = e[n];
  for (var i = e.length, n = 0; n < t.length; n++)
    r[n + i] = t[n];
  return r;
}
function ha(e, t) {
  var r;
  if (Object.create)
    r = Object.create(e);
  else {
    var n = function() {
    };
    n.prototype = e, r = new n();
  }
  return t && A(r, t), r;
}
function yf(e) {
  var t = e.style;
  t.webkitUserSelect = "none", t.userSelect = "none", t.webkitTapHighlightColor = "rgba(0,0,0,0)", t["-webkit-touch-callout"] = "none";
}
function Oe(e, t) {
  return e.hasOwnProperty(t);
}
function St() {
}
var gp = 180 / Math.PI, b0 = Number.EPSILON || Math.pow(2, -52);
const T0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EPSILON: b0,
  HashMap: dp,
  RADIAN_TO_DEGREE: gp,
  assert: He,
  assignProps: lp,
  bind: lt,
  clone: $,
  concatArray: pp,
  createCanvas: g0,
  createHashMap: V,
  createObject: ha,
  curry: Je,
  defaults: mt,
  disableUserSelect: yf,
  each: D,
  eqNaN: Xi,
  extend: A,
  filter: It,
  find: y0,
  guid: pf,
  hasOwn: Oe,
  indexOf: at,
  inherits: gf,
  isArray: N,
  isArrayLike: $t,
  isBuiltInObject: ul,
  isDom: Io,
  isFunction: Z,
  isGradientObject: fa,
  isImagePatternObject: hp,
  isNumber: pt,
  isObject: F,
  isPrimitive: Vn,
  isRegExp: _0,
  isString: G,
  isStringSafe: fp,
  isTypedArray: Vt,
  keys: ft,
  logError: as,
  map: z,
  merge: ct,
  mergeAll: p0,
  mixin: ee,
  noop: St,
  normalizeCssArray: ss,
  reduce: Ve,
  retrieve: ll,
  retrieve2: W,
  retrieve3: je,
  setAsPrimitive: xo,
  slice: os,
  trim: Qe
}, Symbol.toStringTag, { value: "Module" }));
function Tr(e, t) {
  return e == null && (e = 0), t == null && (t = 0), [e, t];
}
function bt(e, t) {
  return e[0] = t[0], e[1] = t[1], e;
}
function ke(e) {
  return [e[0], e[1]];
}
function en(e, t, r) {
  return e[0] = t, e[1] = r, e;
}
function fl(e, t, r) {
  return e[0] = t[0] + r[0], e[1] = t[1] + r[1], e;
}
function Lo(e, t, r, n) {
  return e[0] = t[0] + r[0] * n, e[1] = t[1] + r[1] * n, e;
}
function ur(e, t, r) {
  return e[0] = t[0] - r[0], e[1] = t[1] - r[1], e;
}
function $i(e) {
  return Math.sqrt(mf(e));
}
var C0 = $i;
function mf(e) {
  return e[0] * e[0] + e[1] * e[1];
}
var M0 = mf;
function D0(e, t, r) {
  return e[0] = t[0] * r[0], e[1] = t[1] * r[1], e;
}
function I0(e, t, r) {
  return e[0] = t[0] / r[0], e[1] = t[1] / r[1], e;
}
function x0(e, t) {
  return e[0] * t[0] + e[1] * t[1];
}
function Ni(e, t, r) {
  return e[0] = t[0] * r, e[1] = t[1] * r, e;
}
function cn(e, t) {
  var r = $i(t);
  return r === 0 ? (e[0] = 0, e[1] = 0) : (e[0] = t[0] / r, e[1] = t[1] / r), e;
}
function Eo(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
var yp = Eo;
function mp(e, t) {
  return (e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]);
}
var cr = mp;
function L0(e, t) {
  return e[0] = -t[0], e[1] = -t[1], e;
}
function E0(e, t, r, n) {
  return e[0] = t[0] + n * (r[0] - t[0]), e[1] = t[1] + n * (r[1] - t[1]), e;
}
function fe(e, t, r) {
  var n = t[0], i = t[1];
  return e[0] = r[0] * n + r[2] * i + r[4], e[1] = r[1] * n + r[3] * i + r[5], e;
}
function lr(e, t, r) {
  return e[0] = Math.min(t[0], r[0]), e[1] = Math.min(t[1], r[1]), e;
}
function fr(e, t, r) {
  return e[0] = Math.max(t[0], r[0]), e[1] = Math.max(t[1], r[1]), e;
}
const R0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: fl,
  applyTransform: fe,
  clone: ke,
  copy: bt,
  create: Tr,
  dist: yp,
  distSquare: cr,
  distance: Eo,
  distanceSquare: mp,
  div: I0,
  dot: x0,
  len: $i,
  lenSquare: mf,
  length: C0,
  lengthSquare: M0,
  lerp: E0,
  max: fr,
  min: lr,
  mul: D0,
  negate: L0,
  normalize: cn,
  scale: Ni,
  scaleAndAdd: Lo,
  set: en,
  sub: ur
}, Symbol.toStringTag, { value: "Module" }));
var yn = /* @__PURE__ */ function() {
  function e(t, r) {
    this.target = t, this.topTarget = r && r.topTarget;
  }
  return e;
}(), P0 = function() {
  function e(t) {
    this.handler = t, t.on("mousedown", this._dragStart, this), t.on("mousemove", this._drag, this), t.on("mouseup", this._dragEnd, this);
  }
  return e.prototype._dragStart = function(t) {
    for (var r = t.target; r && !r.draggable; )
      r = r.parent || r.__hostTarget;
    r && (this._draggingTarget = r, r.dragging = !0, this._x = t.offsetX, this._y = t.offsetY, this.handler.dispatchToElement(new yn(r, t), "dragstart", t.event));
  }, e.prototype._drag = function(t) {
    var r = this._draggingTarget;
    if (r) {
      var n = t.offsetX, i = t.offsetY, a = n - this._x, o = i - this._y;
      this._x = n, this._y = i, r.drift(a, o, t), this.handler.dispatchToElement(new yn(r, t), "drag", t.event);
      var s = this.handler.findHover(n, i, r).target, u = this._dropTarget;
      this._dropTarget = s, r !== s && (u && s !== u && this.handler.dispatchToElement(new yn(u, t), "dragleave", t.event), s && s !== u && this.handler.dispatchToElement(new yn(s, t), "dragenter", t.event));
    }
  }, e.prototype._dragEnd = function(t) {
    var r = this._draggingTarget;
    r && (r.dragging = !1), this.handler.dispatchToElement(new yn(r, t), "dragend", t.event), this._dropTarget && this.handler.dispatchToElement(new yn(this._dropTarget, t), "drop", t.event), this._draggingTarget = null, this._dropTarget = null;
  }, e;
}(), Te = function() {
  function e(t) {
    t && (this._$eventProcessor = t);
  }
  return e.prototype.on = function(t, r, n, i) {
    this._$handlers || (this._$handlers = {});
    var a = this._$handlers;
    if (typeof r == "function" && (i = n, n = r, r = null), !n || !t)
      return this;
    var o = this._$eventProcessor;
    r != null && o && o.normalizeQuery && (r = o.normalizeQuery(r)), a[t] || (a[t] = []);
    for (var s = 0; s < a[t].length; s++)
      if (a[t][s].h === n)
        return this;
    var u = {
      h: n,
      query: r,
      ctx: i || this,
      callAtLast: n.zrEventfulCallAtLast
    }, l = a[t].length - 1, h = a[t][l];
    return h && h.callAtLast ? a[t].splice(l, 0, u) : a[t].push(u), this;
  }, e.prototype.isSilent = function(t) {
    var r = this._$handlers;
    return !r || !r[t] || !r[t].length;
  }, e.prototype.off = function(t, r) {
    var n = this._$handlers;
    if (!n)
      return this;
    if (!t)
      return this._$handlers = {}, this;
    if (r) {
      if (n[t]) {
        for (var i = [], a = 0, o = n[t].length; a < o; a++)
          n[t][a].h !== r && i.push(n[t][a]);
        n[t] = i;
      }
      n[t] && n[t].length === 0 && delete n[t];
    } else
      delete n[t];
    return this;
  }, e.prototype.trigger = function(t) {
    for (var r = [], n = 1; n < arguments.length; n++)
      r[n - 1] = arguments[n];
    if (!this._$handlers)
      return this;
    var i = this._$handlers[t], a = this._$eventProcessor;
    if (i)
      for (var o = r.length, s = i.length, u = 0; u < s; u++) {
        var l = i[u];
        if (!(a && a.filter && l.query != null && !a.filter(t, l.query)))
          switch (o) {
            case 0:
              l.h.call(l.ctx);
              break;
            case 1:
              l.h.call(l.ctx, r[0]);
              break;
            case 2:
              l.h.call(l.ctx, r[0], r[1]);
              break;
            default:
              l.h.apply(l.ctx, r);
              break;
          }
      }
    return a && a.afterTrigger && a.afterTrigger(t), this;
  }, e.prototype.triggerWithContext = function(t) {
    for (var r = [], n = 1; n < arguments.length; n++)
      r[n - 1] = arguments[n];
    if (!this._$handlers)
      return this;
    var i = this._$handlers[t], a = this._$eventProcessor;
    if (i)
      for (var o = r.length, s = r[o - 1], u = i.length, l = 0; l < u; l++) {
        var h = i[l];
        if (!(a && a.filter && h.query != null && !a.filter(t, h.query)))
          switch (o) {
            case 0:
              h.h.call(s);
              break;
            case 1:
              h.h.call(s, r[0]);
              break;
            case 2:
              h.h.call(s, r[0], r[1]);
              break;
            default:
              h.h.apply(s, r.slice(1, o - 1));
              break;
          }
      }
    return a && a.afterTrigger && a.afterTrigger(t), this;
  }, e;
}(), A0 = Math.log(2);
function hl(e, t, r, n, i, a) {
  var o = n + "-" + i, s = e.length;
  if (a.hasOwnProperty(o))
    return a[o];
  if (t === 1) {
    var u = Math.round(Math.log((1 << s) - 1 & ~i) / A0);
    return e[r][u];
  }
  for (var l = n | 1 << r, h = r + 1; n & 1 << h; )
    h++;
  for (var f = 0, v = 0, c = 0; v < s; v++) {
    var d = 1 << v;
    d & i || (f += (c % 2 ? -1 : 1) * e[r][v] * hl(e, t - 1, h, l, i | d, a), c++);
  }
  return a[o] = f, f;
}
function O0(e, t) {
  var r = [
    [e[0], e[1], 1, 0, 0, 0, -t[0] * e[0], -t[0] * e[1]],
    [0, 0, 0, e[0], e[1], 1, -t[1] * e[0], -t[1] * e[1]],
    [e[2], e[3], 1, 0, 0, 0, -t[2] * e[2], -t[2] * e[3]],
    [0, 0, 0, e[2], e[3], 1, -t[3] * e[2], -t[3] * e[3]],
    [e[4], e[5], 1, 0, 0, 0, -t[4] * e[4], -t[4] * e[5]],
    [0, 0, 0, e[4], e[5], 1, -t[5] * e[4], -t[5] * e[5]],
    [e[6], e[7], 1, 0, 0, 0, -t[6] * e[6], -t[6] * e[7]],
    [0, 0, 0, e[6], e[7], 1, -t[7] * e[6], -t[7] * e[7]]
  ], n = {}, i = hl(r, 8, 0, 0, 0, n);
  if (i !== 0) {
    for (var a = [], o = 0; o < 8; o++)
      for (var s = 0; s < 8; s++)
        a[s] == null && (a[s] = 0), a[s] += ((o + s) % 2 ? -1 : 1) * hl(r, 7, o === 0 ? 1 : 0, 1 << o, 1 << s, n) / i * t[o];
    return function(u, l, h) {
      var f = l * a[6] + h * a[7] + 1;
      u[0] = (l * a[0] + h * a[1] + a[2]) / f, u[1] = (l * a[3] + h * a[4] + a[5]) / f;
    };
  }
}
var Vh = "___zrEVENTSAVED";
function k0(e, t, r, n, i) {
  if (t.getBoundingClientRect && tt.domSupported && !_p(t)) {
    var a = t[Vh] || (t[Vh] = {}), o = N0(t, a), s = B0(o, a);
    if (s)
      return s(e, r, n), !0;
  }
  return !1;
}
function N0(e, t) {
  var r = t.markers;
  if (r)
    return r;
  r = t.markers = [];
  for (var n = ["left", "right"], i = ["top", "bottom"], a = 0; a < 4; a++) {
    var o = document.createElement("div"), s = o.style, u = a % 2, l = (a >> 1) % 2;
    s.cssText = [
      "position: absolute",
      "visibility: hidden",
      "padding: 0",
      "margin: 0",
      "border-width: 0",
      "user-select: none",
      "width:0",
      "height:0",
      n[u] + ":0",
      i[l] + ":0",
      n[1 - u] + ":auto",
      i[1 - l] + ":auto",
      ""
    ].join("!important;"), e.appendChild(o), r.push(o);
  }
  return t.clearMarkers = function() {
    D(r, function(h) {
      h.parentNode && h.parentNode.removeChild(h);
    });
  }, r;
}
function B0(e, t, r) {
  for (var n = "trans", i = t[n], a = t.srcCoords, o = [], s = [], u = !0, l = 0; l < 4; l++) {
    var h = e[l].getBoundingClientRect(), f = 2 * l, v = h.left, c = h.top;
    o.push(v, c), u = u && a && v === a[f] && c === a[f + 1], s.push(e[l].offsetLeft, e[l].offsetTop);
  }
  return u && i ? i : (t.srcCoords = o, t[n] = O0(o, s));
}
function _p(e) {
  return e.nodeName.toUpperCase() === "CANVAS";
}
var F0 = /([&<>"'])/g, z0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Ro(e) {
  return e == null ? "" : (e + "").replace(F0, function(t, r) {
    return z0[r];
  });
}
var V0 = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, zs = [], H0 = tt.browser.firefox && +tt.browser.version.split(".")[0] < 39;
function vl(e, t, r, n) {
  return r = r || {}, n ? Hh(e, t, r) : H0 && t.layerX != null && t.layerX !== t.offsetX ? (r.zrX = t.layerX, r.zrY = t.layerY) : t.offsetX != null ? (r.zrX = t.offsetX, r.zrY = t.offsetY) : Hh(e, t, r), r;
}
function Hh(e, t, r) {
  if (tt.domSupported && e.getBoundingClientRect) {
    var n = t.clientX, i = t.clientY;
    if (_p(e)) {
      var a = e.getBoundingClientRect();
      r.zrX = n - a.left, r.zrY = i - a.top;
      return;
    } else if (k0(zs, e, n, i)) {
      r.zrX = zs[0], r.zrY = zs[1];
      return;
    }
  }
  r.zrX = r.zrY = 0;
}
function _f(e) {
  return e || window.event;
}
function pe(e, t, r) {
  if (t = _f(t), t.zrX != null)
    return t;
  var n = t.type, i = n && n.indexOf("touch") >= 0;
  if (i) {
    var o = n !== "touchend" ? t.targetTouches[0] : t.changedTouches[0];
    o && vl(e, o, t, r);
  } else {
    vl(e, t, t, r);
    var a = G0(t);
    t.zrDelta = a ? a / 120 : -(t.detail || 0) / 3;
  }
  var s = t.button;
  return t.which == null && s !== void 0 && V0.test(t.type) && (t.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), t;
}
function G0(e) {
  var t = e.wheelDelta;
  if (t)
    return t;
  var r = e.deltaX, n = e.deltaY;
  if (r == null || n == null)
    return t;
  var i = Math.abs(n !== 0 ? n : r), a = n > 0 ? -1 : n < 0 ? 1 : r > 0 ? -1 : 1;
  return 3 * i * a;
}
function U0(e, t, r, n) {
  e.addEventListener(t, r, n);
}
function Y0(e, t, r, n) {
  e.removeEventListener(t, r, n);
}
var cl = function(e) {
  e.preventDefault(), e.stopPropagation(), e.cancelBubble = !0;
};
function Gh(e) {
  return e.which === 2 || e.which === 3;
}
var W0 = function() {
  function e() {
    this._track = [];
  }
  return e.prototype.recognize = function(t, r, n) {
    return this._doTrack(t, r, n), this._recognize(t);
  }, e.prototype.clear = function() {
    return this._track.length = 0, this;
  }, e.prototype._doTrack = function(t, r, n) {
    var i = t.touches;
    if (i) {
      for (var a = {
        points: [],
        touches: [],
        target: r,
        event: t
      }, o = 0, s = i.length; o < s; o++) {
        var u = i[o], l = vl(n, u, {});
        a.points.push([l.zrX, l.zrY]), a.touches.push(u);
      }
      this._track.push(a);
    }
  }, e.prototype._recognize = function(t) {
    for (var r in Vs)
      if (Vs.hasOwnProperty(r)) {
        var n = Vs[r](this._track, t);
        if (n)
          return n;
      }
  }, e;
}();
function Uh(e) {
  var t = e[1][0] - e[0][0], r = e[1][1] - e[0][1];
  return Math.sqrt(t * t + r * r);
}
function X0(e) {
  return [
    (e[0][0] + e[1][0]) / 2,
    (e[0][1] + e[1][1]) / 2
  ];
}
var Vs = {
  pinch: function(e, t) {
    var r = e.length;
    if (r) {
      var n = (e[r - 1] || {}).points, i = (e[r - 2] || {}).points || n;
      if (i && i.length > 1 && n && n.length > 1) {
        var a = Uh(n) / Uh(i);
        !isFinite(a) && (a = 1), t.pinchScale = a;
        var o = X0(n);
        return t.pinchX = o[0], t.pinchY = o[1], {
          type: "pinch",
          target: e[0].target,
          event: t
        };
      }
    }
  }
};
function Lt() {
  return [1, 0, 0, 1, 0, 0];
}
function ri(e) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
}
function un(e, t) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e;
}
function dr(e, t, r) {
  var n = t[0] * r[0] + t[2] * r[1], i = t[1] * r[0] + t[3] * r[1], a = t[0] * r[2] + t[2] * r[3], o = t[1] * r[2] + t[3] * r[3], s = t[0] * r[4] + t[2] * r[5] + t[4], u = t[1] * r[4] + t[3] * r[5] + t[5];
  return e[0] = n, e[1] = i, e[2] = a, e[3] = o, e[4] = s, e[5] = u, e;
}
function dl(e, t, r) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4] + r[0], e[5] = t[5] + r[1], e;
}
function Sp(e, t, r, n) {
  n === void 0 && (n = [0, 0]);
  var i = t[0], a = t[2], o = t[4], s = t[1], u = t[3], l = t[5], h = Math.sin(r), f = Math.cos(r);
  return e[0] = i * f + s * h, e[1] = -i * h + s * f, e[2] = a * f + u * h, e[3] = -a * h + f * u, e[4] = f * (o - n[0]) + h * (l - n[1]) + n[0], e[5] = f * (l - n[1]) - h * (o - n[0]) + n[1], e;
}
function wp(e, t, r) {
  var n = r[0], i = r[1];
  return e[0] = t[0] * n, e[1] = t[1] * i, e[2] = t[2] * n, e[3] = t[3] * i, e[4] = t[4] * n, e[5] = t[5] * i, e;
}
function ni(e, t) {
  var r = t[0], n = t[2], i = t[4], a = t[1], o = t[3], s = t[5], u = r * o - a * n;
  return u ? (u = 1 / u, e[0] = o * u, e[1] = -a * u, e[2] = -n * u, e[3] = r * u, e[4] = (n * s - o * i) * u, e[5] = (a * i - r * s) * u, e) : null;
}
function $0(e) {
  var t = Lt();
  return un(t, e), t;
}
const Z0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clone: $0,
  copy: un,
  create: Lt,
  identity: ri,
  invert: ni,
  mul: dr,
  rotate: Sp,
  scale: wp,
  translate: dl
}, Symbol.toStringTag, { value: "Module" }));
var ye = function() {
  function e(t, r) {
    this.x = t || 0, this.y = r || 0;
  }
  return e.prototype.copy = function(t) {
    return this.x = t.x, this.y = t.y, this;
  }, e.prototype.clone = function() {
    return new e(this.x, this.y);
  }, e.prototype.set = function(t, r) {
    return this.x = t, this.y = r, this;
  }, e.prototype.equal = function(t) {
    return t.x === this.x && t.y === this.y;
  }, e.prototype.add = function(t) {
    return this.x += t.x, this.y += t.y, this;
  }, e.prototype.scale = function(t) {
    this.x *= t, this.y *= t;
  }, e.prototype.scaleAndAdd = function(t, r) {
    this.x += t.x * r, this.y += t.y * r;
  }, e.prototype.sub = function(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }, e.prototype.dot = function(t) {
    return this.x * t.x + this.y * t.y;
  }, e.prototype.len = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }, e.prototype.lenSquare = function() {
    return this.x * this.x + this.y * this.y;
  }, e.prototype.normalize = function() {
    var t = this.len();
    return this.x /= t, this.y /= t, this;
  }, e.prototype.distance = function(t) {
    var r = this.x - t.x, n = this.y - t.y;
    return Math.sqrt(r * r + n * n);
  }, e.prototype.distanceSquare = function(t) {
    var r = this.x - t.x, n = this.y - t.y;
    return r * r + n * n;
  }, e.prototype.negate = function() {
    return this.x = -this.x, this.y = -this.y, this;
  }, e.prototype.transform = function(t) {
    if (t) {
      var r = this.x, n = this.y;
      return this.x = t[0] * r + t[2] * n + t[4], this.y = t[1] * r + t[3] * n + t[5], this;
    }
  }, e.prototype.toArray = function(t) {
    return t[0] = this.x, t[1] = this.y, t;
  }, e.prototype.fromArray = function(t) {
    this.x = t[0], this.y = t[1];
  }, e.set = function(t, r, n) {
    t.x = r, t.y = n;
  }, e.copy = function(t, r) {
    t.x = r.x, t.y = r.y;
  }, e.len = function(t) {
    return Math.sqrt(t.x * t.x + t.y * t.y);
  }, e.lenSquare = function(t) {
    return t.x * t.x + t.y * t.y;
  }, e.dot = function(t, r) {
    return t.x * r.x + t.y * r.y;
  }, e.add = function(t, r, n) {
    t.x = r.x + n.x, t.y = r.y + n.y;
  }, e.sub = function(t, r, n) {
    t.x = r.x - n.x, t.y = r.y - n.y;
  }, e.scale = function(t, r, n) {
    t.x = r.x * n, t.y = r.y * n;
  }, e.scaleAndAdd = function(t, r, n, i) {
    t.x = r.x + n.x * i, t.y = r.y + n.y * i;
  }, e.lerp = function(t, r, n, i) {
    var a = 1 - i;
    t.x = a * r.x + i * n.x, t.y = a * r.y + i * n.y;
  }, e;
}(), Qr = Math.min, Nn = Math.max, pl = Math.abs, Yh = ["x", "y"], q0 = ["width", "height"], Lr = new ye(), Er = new ye(), Rr = new ye(), Pr = new ye(), Jt = t_(), xi = Jt.minTv, gl = Jt.maxTv, Bi = [0, 0], H = function() {
  function e(t, r, n, i) {
    Hs(this, t, r, n, i);
  }
  return e.set = function(t, r, n, i, a) {
    return i < 0 && (r = r + i, i = -i), a < 0 && (n = n + a, a = -a), t.x = r, t.y = n, t.width = i, t.height = a, t;
  }, e.prototype.union = function(t) {
    var r = Qr(t.x, this.x), n = Qr(t.y, this.y);
    isFinite(this.x) && isFinite(this.width) ? this.width = Nn(t.x + t.width, this.x + this.width) - r : this.width = t.width, isFinite(this.y) && isFinite(this.height) ? this.height = Nn(t.y + t.height, this.y + this.height) - n : this.height = t.height, this.x = r, this.y = n;
  }, e.prototype.applyTransform = function(t) {
    e.applyTransform(this, this, t);
  }, e.prototype.calculateTransform = function(t) {
    return bp(Lt(), this, t);
  }, e.prototype.intersect = function(t, r, n) {
    return e.intersect(this, t, r, n);
  }, e.intersect = function(t, r, n, i) {
    n && ye.set(n, 0, 0);
    var a = i && i.outIntersectRect || null, o = i && i.clamp;
    if (a && (a.x = a.y = a.width = a.height = NaN), !t || !r)
      return !1;
    t instanceof e || (t = Hs(J0, t.x, t.y, t.width, t.height)), r instanceof e || (r = Hs(j0, r.x, r.y, r.width, r.height));
    var s = !!n;
    Jt.reset(i, s);
    var u = Jt.touchThreshold, l = t.x + u, h = t.x + t.width - u, f = t.y + u, v = t.y + t.height - u, c = r.x + u, d = r.x + r.width - u, y = r.y + u, p = r.y + r.height - u;
    if (l > h || f > v || c > d || y > p)
      return !1;
    var g = !(h < c || d < l || v < y || p < f);
    return (s || a) && (Bi[0] = 1 / 0, Bi[1] = 0, Wh(l, h, c, d, 0, s, a, o), Wh(f, v, y, p, 1, s, a, o), s && ye.copy(n, g ? Jt.useDir ? Jt.dirMinTv : xi : gl)), g;
  }, e.contain = function(t, r, n) {
    return r >= t.x && r <= t.x + t.width && n >= t.y && n <= t.y + t.height;
  }, e.prototype.contain = function(t, r) {
    return e.contain(this, t, r);
  }, e.prototype.clone = function() {
    return new e(this.x, this.y, this.width, this.height);
  }, e.prototype.copy = function(t) {
    $n(this, t);
  }, e.prototype.plain = function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }, e.prototype.isFinite = function() {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
  }, e.prototype.isZero = function() {
    return this.width === 0 || this.height === 0;
  }, e.create = function(t) {
    return new e(t ? t.x : 0, t ? t.y : 0, t ? t.width : 0, t ? t.height : 0);
  }, e.copy = function(t, r) {
    return t.x = r.x, t.y = r.y, t.width = r.width, t.height = r.height, t;
  }, e.applyTransform = function(t, r, n) {
    if (!n) {
      t !== r && $n(t, r);
      return;
    }
    if (n[1] < 1e-5 && n[1] > -1e-5 && n[2] < 1e-5 && n[2] > -1e-5) {
      var i = n[0], a = n[3], o = n[4], s = n[5];
      t.x = r.x * i + o, t.y = r.y * a + s, t.width = r.width * i, t.height = r.height * a, t.width < 0 && (t.x += t.width, t.width = -t.width), t.height < 0 && (t.y += t.height, t.height = -t.height);
      return;
    }
    Lr.x = Rr.x = r.x, Lr.y = Pr.y = r.y, Er.x = Pr.x = r.x + r.width, Er.y = Rr.y = r.y + r.height, Lr.transform(n), Pr.transform(n), Er.transform(n), Rr.transform(n), t.x = Qr(Lr.x, Er.x, Rr.x, Pr.x), t.y = Qr(Lr.y, Er.y, Rr.y, Pr.y);
    var u = Nn(Lr.x, Er.x, Rr.x, Pr.x), l = Nn(Lr.y, Er.y, Rr.y, Pr.y);
    t.width = u - t.x, t.height = l - t.y;
  }, e.calculateTransform = function(t, r, n) {
    var i = n.width / r.width, a = n.height / r.height;
    return t = ri(t || []), dl(t, t, en(Gs, -r.x, -r.y)), wp(t, t, en(Gs, i, a)), dl(t, t, en(Gs, n.x, n.y)), t;
  }, e;
}(), us = H.create, Hs = H.set, $n = H.copy, bp = H.calculateTransform, K0 = H.applyTransform, Q0 = H.contain, J0 = new H(0, 0, 0, 0), j0 = new H(0, 0, 0, 0), Gs = [];
function Wh(e, t, r, n, i, a, o, s) {
  var u = pl(t - r), l = pl(n - e), h = Qr(u, l), f = Yh[i], v = Yh[1 - i], c = q0[i];
  t < r || n < e ? u < l ? (a && (gl[f] = -u), s && (o[f] = t, o[c] = 0)) : (a && (gl[f] = l), s && (o[f] = e, o[c] = 0)) : (o && (o[f] = Nn(e, r), o[c] = Qr(t, n) - o[f]), a && (h < Bi[0] || Jt.useDir) && (Bi[0] = Qr(h, Bi[0]), (u < l || !Jt.bidirectional) && (xi[f] = u, xi[v] = 0, Jt.useDir && Jt.calcDirMTV()), (u >= l || !Jt.bidirectional) && (xi[f] = -l, xi[v] = 0, Jt.useDir && Jt.calcDirMTV())));
}
function t_() {
  var e = 0, t = new ye(), r = new ye(), n = {
    minTv: new ye(),
    maxTv: new ye(),
    useDir: !1,
    dirMinTv: new ye(),
    touchThreshold: 0,
    bidirectional: !0,
    negativeSize: !1,
    reset: function(a, o) {
      n.touchThreshold = 0, a && a.touchThreshold != null && (n.touchThreshold = Nn(0, a.touchThreshold)), n.negativeSize = !1, o && (n.minTv.set(1 / 0, 1 / 0), n.maxTv.set(0, 0), n.useDir = !1, a && a.direction != null && (n.useDir = !0, n.dirMinTv.copy(n.minTv), r.copy(n.minTv), e = a.direction, n.bidirectional = a.bidirectional == null || !!a.bidirectional, n.bidirectional || t.set(Math.cos(e), Math.sin(e))));
    },
    calcDirMTV: function() {
      var a = n.minTv, o = n.dirMinTv, s = a.y * a.y + a.x * a.x, u = Math.sin(e), l = Math.cos(e), h = u * a.y + l * a.x;
      if (i(h)) {
        i(a.x) && i(a.y) && o.set(0, 0);
        return;
      }
      if (r.x = s * l / h, r.y = s * u / h, i(r.x) && i(r.y)) {
        o.set(0, 0);
        return;
      }
      (n.bidirectional || t.dot(r) > 0) && r.len() < o.len() && o.copy(r);
    }
  };
  function i(a) {
    return pl(a) < 1e-10;
  }
  return n;
}
var Tp = "silent";
function e_(e, t, r) {
  return {
    type: e,
    event: r,
    target: t.target,
    topTarget: t.topTarget,
    cancelBubble: !1,
    offsetX: r.zrX,
    offsetY: r.zrY,
    gestureEvent: r.gestureEvent,
    pinchX: r.pinchX,
    pinchY: r.pinchY,
    pinchScale: r.pinchScale,
    wheelDelta: r.zrDelta,
    zrByTouch: r.zrByTouch,
    which: r.which,
    stop: r_
  };
}
function r_() {
  cl(this.event);
}
var n_ = function(e) {
  B(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.handler = null, r;
  }
  return t.prototype.dispose = function() {
  }, t.prototype.setCursor = function() {
  }, t;
}(Te), ui = /* @__PURE__ */ function() {
  function e(t, r) {
    this.x = t, this.y = r;
  }
  return e;
}(), i_ = [
  "click",
  "dblclick",
  "mousewheel",
  "mouseout",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu"
], Us = new H(0, 0, 0, 0), Cp = function(e) {
  B(t, e);
  function t(r, n, i, a, o) {
    var s = e.call(this) || this;
    return s._hovered = new ui(0, 0), s.storage = r, s.painter = n, s.painterRoot = a, s._pointerSize = o, i = i || new n_(), s.proxy = null, s.setHandlerProxy(i), s._draggingMgr = new P0(s), s;
  }
  return t.prototype.setHandlerProxy = function(r) {
    this.proxy && this.proxy.dispose(), r && (D(i_, function(n) {
      r.on && r.on(n, this[n], this);
    }, this), r.handler = this), this.proxy = r;
  }, t.prototype.mousemove = function(r) {
    var n = r.zrX, i = r.zrY, a = Mp(this, n, i), o = this._hovered, s = o.target;
    s && !s.__zr && (o = this.findHover(o.x, o.y), s = o.target);
    var u = this._hovered = a ? new ui(n, i) : this.findHover(n, i), l = u.target, h = this.proxy;
    h.setCursor && h.setCursor(l ? l.cursor : "default"), s && l !== s && this.dispatchToElement(o, "mouseout", r), this.dispatchToElement(u, "mousemove", r), l && l !== s && this.dispatchToElement(u, "mouseover", r);
  }, t.prototype.mouseout = function(r) {
    var n = r.zrEventControl;
    n !== "only_globalout" && this.dispatchToElement(this._hovered, "mouseout", r), n !== "no_globalout" && this.trigger("globalout", { type: "globalout", event: r });
  }, t.prototype.resize = function() {
    this._hovered = new ui(0, 0);
  }, t.prototype.dispatch = function(r, n) {
    var i = this[r];
    i && i.call(this, n);
  }, t.prototype.dispose = function() {
    this.proxy.dispose(), this.storage = null, this.proxy = null, this.painter = null;
  }, t.prototype.setCursorStyle = function(r) {
    var n = this.proxy;
    n.setCursor && n.setCursor(r);
  }, t.prototype.dispatchToElement = function(r, n, i) {
    r = r || {};
    var a = r.target;
    if (!(a && a.silent)) {
      for (var o = "on" + n, s = e_(n, r, i); a && (a[o] && (s.cancelBubble = !!a[o].call(a, s)), a.trigger(n, s), a = a.__hostTarget ? a.__hostTarget : a.parent, !s.cancelBubble); )
        ;
      s.cancelBubble || (this.trigger(n, s), this.painter && this.painter.eachOtherLayer && this.painter.eachOtherLayer(function(u) {
        typeof u[o] == "function" && u[o].call(u, s), u.trigger && u.trigger(n, s);
      }));
    }
  }, t.prototype.findHover = function(r, n, i) {
    var a = this.storage.getDisplayList(), o = new ui(r, n);
    if (Xh(a, o, r, n, i), this._pointerSize && !o.target) {
      for (var s = [], u = this._pointerSize, l = u / 2, h = new H(r - l, n - l, u, u), f = a.length - 1; f >= 0; f--) {
        var v = a[f];
        v !== i && !v.ignore && !v.ignoreCoarsePointer && (!v.parent || !v.parent.ignoreCoarsePointer) && (Us.copy(v.getBoundingRect()), v.transform && Us.applyTransform(v.transform), Us.intersect(h) && s.push(v));
      }
      if (s.length)
        for (var c = 4, d = Math.PI / 12, y = Math.PI * 2, p = 0; p < l; p += c)
          for (var g = 0; g < y; g += d) {
            var m = r + p * Math.cos(g), _ = n + p * Math.sin(g);
            if (Xh(s, o, m, _, i), o.target)
              return o;
          }
    }
    return o;
  }, t.prototype.processGesture = function(r, n) {
    this._gestureMgr || (this._gestureMgr = new W0());
    var i = this._gestureMgr;
    n === "start" && i.clear();
    var a = i.recognize(r, this.findHover(r.zrX, r.zrY, null).target, this.proxy.dom);
    if (n === "end" && i.clear(), a) {
      var o = a.type;
      r.gestureEvent = o;
      var s = new ui();
      s.target = a.target, this.dispatchToElement(s, o, a.event);
    }
  }, t;
}(Te);
D(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function(e) {
  Cp.prototype[e] = function(t) {
    var r = t.zrX, n = t.zrY, i = Mp(this, r, n), a, o;
    if ((e !== "mouseup" || !i) && (a = this.findHover(r, n), o = a.target), e === "mousedown")
      this._downEl = o, this._downPoint = [t.zrX, t.zrY], this._upEl = o;
    else if (e === "mouseup")
      this._upEl = o;
    else if (e === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || yp(this._downPoint, [t.zrX, t.zrY]) > 4)
        return;
      this._downPoint = null;
    }
    this.dispatchToElement(a, e, t);
  };
});
function a_(e, t, r) {
  if (e[e.rectHover ? "rectContain" : "contain"](t, r)) {
    for (var n = e, i = void 0, a = !1; n; ) {
      if (n.ignoreClip && (a = !0), !a) {
        var o = n.getClipPath();
        if (o && !o.contain(t, r))
          return !1;
      }
      n.silent && (i = !0);
      var s = n.__hostTarget;
      n = s ? n.ignoreHostSilent ? null : s : n.parent;
    }
    return i ? Tp : !0;
  }
  return !1;
}
function Xh(e, t, r, n, i) {
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a], s = void 0;
    if (o !== i && !o.ignore && (s = a_(o, r, n)) && (!t.topTarget && (t.topTarget = o), s !== Tp)) {
      t.target = o;
      break;
    }
  }
}
function Mp(e, t, r) {
  var n = e.painter;
  return t < 0 || t > n.getWidth() || r < 0 || r > n.getHeight();
}
var Dp = 32, li = 7;
function o_(e) {
  for (var t = 0; e >= Dp; )
    t |= e & 1, e >>= 1;
  return e + t;
}
function $h(e, t, r, n) {
  var i = t + 1;
  if (i === r)
    return 1;
  if (n(e[i++], e[t]) < 0) {
    for (; i < r && n(e[i], e[i - 1]) < 0; )
      i++;
    s_(e, t, i);
  } else
    for (; i < r && n(e[i], e[i - 1]) >= 0; )
      i++;
  return i - t;
}
function s_(e, t, r) {
  for (r--; t < r; ) {
    var n = e[t];
    e[t++] = e[r], e[r--] = n;
  }
}
function Zh(e, t, r, n, i) {
  for (n === t && n++; n < r; n++) {
    for (var a = e[n], o = t, s = n, u; o < s; )
      u = o + s >>> 1, i(a, e[u]) < 0 ? s = u : o = u + 1;
    var l = n - o;
    switch (l) {
      case 3:
        e[o + 3] = e[o + 2];
      case 2:
        e[o + 2] = e[o + 1];
      case 1:
        e[o + 1] = e[o];
        break;
      default:
        for (; l > 0; )
          e[o + l] = e[o + l - 1], l--;
    }
    e[o] = a;
  }
}
function Ys(e, t, r, n, i, a) {
  var o = 0, s = 0, u = 1;
  if (a(e, t[r + i]) > 0) {
    for (s = n - i; u < s && a(e, t[r + i + u]) > 0; )
      o = u, u = (u << 1) + 1, u <= 0 && (u = s);
    u > s && (u = s), o += i, u += i;
  } else {
    for (s = i + 1; u < s && a(e, t[r + i - u]) <= 0; )
      o = u, u = (u << 1) + 1, u <= 0 && (u = s);
    u > s && (u = s);
    var l = o;
    o = i - u, u = i - l;
  }
  for (o++; o < u; ) {
    var h = o + (u - o >>> 1);
    a(e, t[r + h]) > 0 ? o = h + 1 : u = h;
  }
  return u;
}
function Ws(e, t, r, n, i, a) {
  var o = 0, s = 0, u = 1;
  if (a(e, t[r + i]) < 0) {
    for (s = i + 1; u < s && a(e, t[r + i - u]) < 0; )
      o = u, u = (u << 1) + 1, u <= 0 && (u = s);
    u > s && (u = s);
    var l = o;
    o = i - u, u = i - l;
  } else {
    for (s = n - i; u < s && a(e, t[r + i + u]) >= 0; )
      o = u, u = (u << 1) + 1, u <= 0 && (u = s);
    u > s && (u = s), o += i, u += i;
  }
  for (o++; o < u; ) {
    var h = o + (u - o >>> 1);
    a(e, t[r + h]) < 0 ? u = h : o = h + 1;
  }
  return u;
}
function u_(e, t) {
  var r = li, n, i, a = 0, o = [];
  n = [], i = [];
  function s(c, d) {
    n[a] = c, i[a] = d, a += 1;
  }
  function u() {
    for (; a > 1; ) {
      var c = a - 2;
      if (c >= 1 && i[c - 1] <= i[c] + i[c + 1] || c >= 2 && i[c - 2] <= i[c] + i[c - 1])
        i[c - 1] < i[c + 1] && c--;
      else if (i[c] > i[c + 1])
        break;
      h(c);
    }
  }
  function l() {
    for (; a > 1; ) {
      var c = a - 2;
      c > 0 && i[c - 1] < i[c + 1] && c--, h(c);
    }
  }
  function h(c) {
    var d = n[c], y = i[c], p = n[c + 1], g = i[c + 1];
    i[c] = y + g, c === a - 3 && (n[c + 1] = n[c + 2], i[c + 1] = i[c + 2]), a--;
    var m = Ws(e[p], e, d, y, 0, t);
    d += m, y -= m, y !== 0 && (g = Ys(e[d + y - 1], e, p, g, g - 1, t), g !== 0 && (y <= g ? f(d, y, p, g) : v(d, y, p, g)));
  }
  function f(c, d, y, p) {
    var g = 0;
    for (g = 0; g < d; g++)
      o[g] = e[c + g];
    var m = 0, _ = y, S = c;
    if (e[S++] = e[_++], --p === 0) {
      for (g = 0; g < d; g++)
        e[S + g] = o[m + g];
      return;
    }
    if (d === 1) {
      for (g = 0; g < p; g++)
        e[S + g] = e[_ + g];
      e[S + p] = o[m];
      return;
    }
    for (var w = r, b, M, C; ; ) {
      b = 0, M = 0, C = !1;
      do
        if (t(e[_], o[m]) < 0) {
          if (e[S++] = e[_++], M++, b = 0, --p === 0) {
            C = !0;
            break;
          }
        } else if (e[S++] = o[m++], b++, M = 0, --d === 1) {
          C = !0;
          break;
        }
      while ((b | M) < w);
      if (C)
        break;
      do {
        if (b = Ws(e[_], o, m, d, 0, t), b !== 0) {
          for (g = 0; g < b; g++)
            e[S + g] = o[m + g];
          if (S += b, m += b, d -= b, d <= 1) {
            C = !0;
            break;
          }
        }
        if (e[S++] = e[_++], --p === 0) {
          C = !0;
          break;
        }
        if (M = Ys(o[m], e, _, p, 0, t), M !== 0) {
          for (g = 0; g < M; g++)
            e[S + g] = e[_ + g];
          if (S += M, _ += M, p -= M, p === 0) {
            C = !0;
            break;
          }
        }
        if (e[S++] = o[m++], --d === 1) {
          C = !0;
          break;
        }
        w--;
      } while (b >= li || M >= li);
      if (C)
        break;
      w < 0 && (w = 0), w += 2;
    }
    if (r = w, r < 1 && (r = 1), d === 1) {
      for (g = 0; g < p; g++)
        e[S + g] = e[_ + g];
      e[S + p] = o[m];
    } else {
      if (d === 0)
        throw new Error();
      for (g = 0; g < d; g++)
        e[S + g] = o[m + g];
    }
  }
  function v(c, d, y, p) {
    var g = 0;
    for (g = 0; g < p; g++)
      o[g] = e[y + g];
    var m = c + d - 1, _ = p - 1, S = y + p - 1, w = 0, b = 0;
    if (e[S--] = e[m--], --d === 0) {
      for (w = S - (p - 1), g = 0; g < p; g++)
        e[w + g] = o[g];
      return;
    }
    if (p === 1) {
      for (S -= d, m -= d, b = S + 1, w = m + 1, g = d - 1; g >= 0; g--)
        e[b + g] = e[w + g];
      e[S] = o[_];
      return;
    }
    for (var M = r; ; ) {
      var C = 0, T = 0, I = !1;
      do
        if (t(o[_], e[m]) < 0) {
          if (e[S--] = e[m--], C++, T = 0, --d === 0) {
            I = !0;
            break;
          }
        } else if (e[S--] = o[_--], T++, C = 0, --p === 1) {
          I = !0;
          break;
        }
      while ((C | T) < M);
      if (I)
        break;
      do {
        if (C = d - Ws(o[_], e, c, d, d - 1, t), C !== 0) {
          for (S -= C, m -= C, d -= C, b = S + 1, w = m + 1, g = C - 1; g >= 0; g--)
            e[b + g] = e[w + g];
          if (d === 0) {
            I = !0;
            break;
          }
        }
        if (e[S--] = o[_--], --p === 1) {
          I = !0;
          break;
        }
        if (T = p - Ys(e[m], o, 0, p, p - 1, t), T !== 0) {
          for (S -= T, _ -= T, p -= T, b = S + 1, w = _ + 1, g = 0; g < T; g++)
            e[b + g] = o[w + g];
          if (p <= 1) {
            I = !0;
            break;
          }
        }
        if (e[S--] = e[m--], --d === 0) {
          I = !0;
          break;
        }
        M--;
      } while (C >= li || T >= li);
      if (I)
        break;
      M < 0 && (M = 0), M += 2;
    }
    if (r = M, r < 1 && (r = 1), p === 1) {
      for (S -= d, m -= d, b = S + 1, w = m + 1, g = d - 1; g >= 0; g--)
        e[b + g] = e[w + g];
      e[S] = o[_];
    } else {
      if (p === 0)
        throw new Error();
      for (w = S - (p - 1), g = 0; g < p; g++)
        e[w + g] = o[g];
    }
  }
  return {
    mergeRuns: u,
    forceMergeRuns: l,
    pushRun: s
  };
}
function oo(e, t, r, n) {
  r || (r = 0), n || (n = e.length);
  var i = n - r;
  if (!(i < 2)) {
    var a = 0;
    if (i < Dp) {
      a = $h(e, r, n, t), Zh(e, r, n, r + a, t);
      return;
    }
    var o = u_(e, t), s = o_(i);
    do {
      if (a = $h(e, r, n, t), a < s) {
        var u = i;
        u > s && (u = s), Zh(e, r, r + u, r + a, t), a = u;
      }
      o.pushRun(r, a), o.mergeRuns(), i -= a, r += a;
    } while (i !== 0);
    o.forceMergeRuns();
  }
}
var Wt = 1, Li = 2, kn = 4, qh = !1;
function Xs() {
  qh || (qh = !0, console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"));
}
function Kh(e, t) {
  return e.zlevel === t.zlevel ? e.z === t.z ? e.z2 - t.z2 : e.z - t.z : e.zlevel - t.zlevel;
}
var l_ = function() {
  function e() {
    this._roots = [], this._displayList = [], this._displayListLen = 0, this.displayableSortFunc = Kh;
  }
  return e.prototype.traverse = function(t, r) {
    for (var n = 0; n < this._roots.length; n++)
      this._roots[n].traverse(t, r);
  }, e.prototype.getDisplayList = function(t, r) {
    r = r || !1;
    var n = this._displayList;
    return (t || !n.length) && this.updateDisplayList(r), n;
  }, e.prototype.updateDisplayList = function(t) {
    this._displayListLen = 0;
    for (var r = this._roots, n = this._displayList, i = 0, a = r.length; i < a; i++)
      this._updateAndAddDisplayable(r[i], null, t);
    n.length = this._displayListLen, oo(n, Kh);
  }, e.prototype._updateAndAddDisplayable = function(t, r, n) {
    if (!(t.ignore && !n)) {
      t.beforeUpdate(), t.update(), t.afterUpdate();
      var i = t.getClipPath(), a = r && r.length, o = 0, s = t.__clipPaths;
      if (!t.ignoreClip && (a || i)) {
        if (s || (s = t.__clipPaths = []), a)
          for (var u = 0; u < r.length; u++)
            s[o++] = r[u];
        for (var l = i, h = t; l; )
          l.parent = h, l.updateTransform(), s[o++] = l, h = l, l = l.getClipPath();
      }
      if (s && (s.length = o), t.childrenRef) {
        for (var f = t.childrenRef(), v = 0; v < f.length; v++) {
          var c = f[v];
          t.__dirty && (c.__dirty |= Wt), this._updateAndAddDisplayable(c, s, n);
        }
        t.__dirty = 0;
      } else {
        var d = t;
        isNaN(d.z) && (Xs(), d.z = 0), isNaN(d.z2) && (Xs(), d.z2 = 0), isNaN(d.zlevel) && (Xs(), d.zlevel = 0), this._displayList[this._displayListLen++] = d;
      }
      var y = t.getDecalElement && t.getDecalElement();
      y && this._updateAndAddDisplayable(y, s, n);
      var p = t.getTextGuideLine();
      p && this._updateAndAddDisplayable(p, s, n);
      var g = t.getTextContent();
      g && this._updateAndAddDisplayable(g, s, n);
    }
  }, e.prototype.addRoot = function(t) {
    t.__zr && t.__zr.storage === this || this._roots.push(t);
  }, e.prototype.delRoot = function(t) {
    if (t instanceof Array) {
      for (var r = 0, n = t.length; r < n; r++)
        this.delRoot(t[r]);
      return;
    }
    var i = at(this._roots, t);
    i >= 0 && this._roots.splice(i, 1);
  }, e.prototype.delAllRoots = function() {
    this._roots = [], this._displayList = [], this._displayListLen = 0;
  }, e.prototype.getRoots = function() {
    return this._roots;
  }, e.prototype.dispose = function() {
    this._displayList = null, this._roots = null;
  }, e;
}(), Po;
Po = tt.hasGlobalWindow && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function(e) {
  return setTimeout(e, 16);
};
var Fi = {
  linear: function(e) {
    return e;
  },
  quadraticIn: function(e) {
    return e * e;
  },
  quadraticOut: function(e) {
    return e * (2 - e);
  },
  quadraticInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
  },
  cubicIn: function(e) {
    return e * e * e;
  },
  cubicOut: function(e) {
    return --e * e * e + 1;
  },
  cubicInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
  },
  quarticIn: function(e) {
    return e * e * e * e;
  },
  quarticOut: function(e) {
    return 1 - --e * e * e * e;
  },
  quarticInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2);
  },
  quinticIn: function(e) {
    return e * e * e * e * e;
  },
  quinticOut: function(e) {
    return --e * e * e * e * e + 1;
  },
  quinticInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2);
  },
  sinusoidalIn: function(e) {
    return 1 - Math.cos(e * Math.PI / 2);
  },
  sinusoidalOut: function(e) {
    return Math.sin(e * Math.PI / 2);
  },
  sinusoidalInOut: function(e) {
    return 0.5 * (1 - Math.cos(Math.PI * e));
  },
  exponentialIn: function(e) {
    return e === 0 ? 0 : Math.pow(1024, e - 1);
  },
  exponentialOut: function(e) {
    return e === 1 ? 1 : 1 - Math.pow(2, -10 * e);
  },
  exponentialInOut: function(e) {
    return e === 0 ? 0 : e === 1 ? 1 : (e *= 2) < 1 ? 0.5 * Math.pow(1024, e - 1) : 0.5 * (-Math.pow(2, -10 * (e - 1)) + 2);
  },
  circularIn: function(e) {
    return 1 - Math.sqrt(1 - e * e);
  },
  circularOut: function(e) {
    return Math.sqrt(1 - --e * e);
  },
  circularInOut: function(e) {
    return (e *= 2) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
  },
  elasticIn: function(e) {
    var t, r = 0.1, n = 0.4;
    return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI), -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * (2 * Math.PI) / n)));
  },
  elasticOut: function(e) {
    var t, r = 0.1, n = 0.4;
    return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI), r * Math.pow(2, -10 * e) * Math.sin((e - t) * (2 * Math.PI) / n) + 1);
  },
  elasticInOut: function(e) {
    var t, r = 0.1, n = 0.4;
    return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI), (e *= 2) < 1 ? -0.5 * (r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * (2 * Math.PI) / n)) : r * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * (2 * Math.PI) / n) * 0.5 + 1);
  },
  backIn: function(e) {
    var t = 1.70158;
    return e * e * ((t + 1) * e - t);
  },
  backOut: function(e) {
    var t = 1.70158;
    return --e * e * ((t + 1) * e + t) + 1;
  },
  backInOut: function(e) {
    var t = 2.5949095;
    return (e *= 2) < 1 ? 0.5 * (e * e * ((t + 1) * e - t)) : 0.5 * ((e -= 2) * e * ((t + 1) * e + t) + 2);
  },
  bounceIn: function(e) {
    return 1 - Fi.bounceOut(1 - e);
  },
  bounceOut: function(e) {
    return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
  },
  bounceInOut: function(e) {
    return e < 0.5 ? Fi.bounceIn(e * 2) * 0.5 : Fi.bounceOut(e * 2 - 1) * 0.5 + 0.5;
  }
}, _a = Math.pow, pr = Math.sqrt, Ao = 1e-8, Ip = 1e-4, Qh = pr(3), Sa = 1 / 3, Pe = Tr(), ue = Tr(), Hn = Tr();
function hr(e) {
  return e > -Ao && e < Ao;
}
function xp(e) {
  return e > Ao || e < -Ao;
}
function kt(e, t, r, n, i) {
  var a = 1 - i;
  return a * a * (a * e + 3 * i * t) + i * i * (i * n + 3 * a * r);
}
function Jh(e, t, r, n, i) {
  var a = 1 - i;
  return 3 * (((t - e) * a + 2 * (r - t) * i) * a + (n - r) * i * i);
}
function Lp(e, t, r, n, i, a) {
  var o = n + 3 * (t - r) - e, s = 3 * (r - t * 2 + e), u = 3 * (t - e), l = e - i, h = s * s - 3 * o * u, f = s * u - 9 * o * l, v = u * u - 3 * s * l, c = 0;
  if (hr(h) && hr(f))
    if (hr(s))
      a[0] = 0;
    else {
      var d = -u / s;
      d >= 0 && d <= 1 && (a[c++] = d);
    }
  else {
    var y = f * f - 4 * h * v;
    if (hr(y)) {
      var p = f / h, d = -s / o + p, g = -p / 2;
      d >= 0 && d <= 1 && (a[c++] = d), g >= 0 && g <= 1 && (a[c++] = g);
    } else if (y > 0) {
      var m = pr(y), _ = h * s + 1.5 * o * (-f + m), S = h * s + 1.5 * o * (-f - m);
      _ < 0 ? _ = -_a(-_, Sa) : _ = _a(_, Sa), S < 0 ? S = -_a(-S, Sa) : S = _a(S, Sa);
      var d = (-s - (_ + S)) / (3 * o);
      d >= 0 && d <= 1 && (a[c++] = d);
    } else {
      var w = (2 * h * s - 3 * o * f) / (2 * pr(h * h * h)), b = Math.acos(w) / 3, M = pr(h), C = Math.cos(b), d = (-s - 2 * M * C) / (3 * o), g = (-s + M * (C + Qh * Math.sin(b))) / (3 * o), T = (-s + M * (C - Qh * Math.sin(b))) / (3 * o);
      d >= 0 && d <= 1 && (a[c++] = d), g >= 0 && g <= 1 && (a[c++] = g), T >= 0 && T <= 1 && (a[c++] = T);
    }
  }
  return c;
}
function Ep(e, t, r, n, i) {
  var a = 6 * r - 12 * t + 6 * e, o = 9 * t + 3 * n - 3 * e - 9 * r, s = 3 * t - 3 * e, u = 0;
  if (hr(o)) {
    if (xp(a)) {
      var l = -s / a;
      l >= 0 && l <= 1 && (i[u++] = l);
    }
  } else {
    var h = a * a - 4 * o * s;
    if (hr(h))
      i[0] = -a / (2 * o);
    else if (h > 0) {
      var f = pr(h), l = (-a + f) / (2 * o), v = (-a - f) / (2 * o);
      l >= 0 && l <= 1 && (i[u++] = l), v >= 0 && v <= 1 && (i[u++] = v);
    }
  }
  return u;
}
function Oo(e, t, r, n, i, a) {
  var o = (t - e) * i + e, s = (r - t) * i + t, u = (n - r) * i + r, l = (s - o) * i + o, h = (u - s) * i + s, f = (h - l) * i + l;
  a[0] = e, a[1] = o, a[2] = l, a[3] = f, a[4] = f, a[5] = h, a[6] = u, a[7] = n;
}
function f_(e, t, r, n, i, a, o, s, u, l, h) {
  var f, v = 5e-3, c = 1 / 0, d, y, p, g;
  Pe[0] = u, Pe[1] = l;
  for (var m = 0; m < 1; m += 0.05)
    ue[0] = kt(e, r, i, o, m), ue[1] = kt(t, n, a, s, m), p = cr(Pe, ue), p < c && (f = m, c = p);
  c = 1 / 0;
  for (var _ = 0; _ < 32 && !(v < Ip); _++)
    d = f - v, y = f + v, ue[0] = kt(e, r, i, o, d), ue[1] = kt(t, n, a, s, d), p = cr(ue, Pe), d >= 0 && p < c ? (f = d, c = p) : (Hn[0] = kt(e, r, i, o, y), Hn[1] = kt(t, n, a, s, y), g = cr(Hn, Pe), y <= 1 && g < c ? (f = y, c = g) : v *= 0.5);
  return pr(c);
}
function h_(e, t, r, n, i, a, o, s, u) {
  for (var l = e, h = t, f = 0, v = 1 / u, c = 1; c <= u; c++) {
    var d = c * v, y = kt(e, r, i, o, d), p = kt(t, n, a, s, d), g = y - l, m = p - h;
    f += Math.sqrt(g * g + m * m), l = y, h = p;
  }
  return f;
}
function Nt(e, t, r, n) {
  var i = 1 - n;
  return i * (i * e + 2 * n * t) + n * n * r;
}
function jh(e, t, r, n) {
  return 2 * ((1 - n) * (t - e) + n * (r - t));
}
function v_(e, t, r, n, i) {
  var a = e - 2 * t + r, o = 2 * (t - e), s = e - n, u = 0;
  if (hr(a)) {
    if (xp(o)) {
      var l = -s / o;
      l >= 0 && l <= 1 && (i[u++] = l);
    }
  } else {
    var h = o * o - 4 * a * s;
    if (hr(h)) {
      var l = -o / (2 * a);
      l >= 0 && l <= 1 && (i[u++] = l);
    } else if (h > 0) {
      var f = pr(h), l = (-o + f) / (2 * a), v = (-o - f) / (2 * a);
      l >= 0 && l <= 1 && (i[u++] = l), v >= 0 && v <= 1 && (i[u++] = v);
    }
  }
  return u;
}
function Rp(e, t, r) {
  var n = e + r - 2 * t;
  return n === 0 ? 0.5 : (e - t) / n;
}
function Zi(e, t, r, n, i) {
  var a = (t - e) * n + e, o = (r - t) * n + t, s = (o - a) * n + a;
  i[0] = e, i[1] = a, i[2] = s, i[3] = s, i[4] = o, i[5] = r;
}
function c_(e, t, r, n, i, a, o, s, u) {
  var l, h = 5e-3, f = 1 / 0;
  Pe[0] = o, Pe[1] = s;
  for (var v = 0; v < 1; v += 0.05) {
    ue[0] = Nt(e, r, i, v), ue[1] = Nt(t, n, a, v);
    var c = cr(Pe, ue);
    c < f && (l = v, f = c);
  }
  f = 1 / 0;
  for (var d = 0; d < 32 && !(h < Ip); d++) {
    var y = l - h, p = l + h;
    ue[0] = Nt(e, r, i, y), ue[1] = Nt(t, n, a, y);
    var c = cr(ue, Pe);
    if (y >= 0 && c < f)
      l = y, f = c;
    else {
      Hn[0] = Nt(e, r, i, p), Hn[1] = Nt(t, n, a, p);
      var g = cr(Hn, Pe);
      p <= 1 && g < f ? (l = p, f = g) : h *= 0.5;
    }
  }
  return pr(f);
}
function d_(e, t, r, n, i, a, o) {
  for (var s = e, u = t, l = 0, h = 1 / o, f = 1; f <= o; f++) {
    var v = f * h, c = Nt(e, r, i, v), d = Nt(t, n, a, v), y = c - s, p = d - u;
    l += Math.sqrt(y * y + p * p), s = c, u = d;
  }
  return l;
}
var p_ = /cubic-bezier\(([0-9,\.e ]+)\)/;
function Pp(e) {
  var t = e && p_.exec(e);
  if (t) {
    var r = t[1].split(","), n = +Qe(r[0]), i = +Qe(r[1]), a = +Qe(r[2]), o = +Qe(r[3]);
    if (isNaN(n + i + a + o))
      return;
    var s = [];
    return function(u) {
      return u <= 0 ? 0 : u >= 1 ? 1 : Lp(0, n, a, 1, u, s) && kt(0, i, o, 1, s[0]);
    };
  }
}
var g_ = function() {
  function e(t) {
    this._inited = !1, this._startTime = 0, this._pausedTime = 0, this._paused = !1, this._life = t.life || 1e3, this._delay = t.delay || 0, this.loop = t.loop || !1, this.onframe = t.onframe || St, this.ondestroy = t.ondestroy || St, this.onrestart = t.onrestart || St, t.easing && this.setEasing(t.easing);
  }
  return e.prototype.step = function(t, r) {
    if (this._inited || (this._startTime = t + this._delay, this._inited = !0), this._paused) {
      this._pausedTime += r;
      return;
    }
    var n = this._life, i = t - this._startTime - this._pausedTime, a = i / n;
    a < 0 && (a = 0), a = Math.min(a, 1);
    var o = this.easingFunc, s = o ? o(a) : a;
    if (this.onframe(s), a === 1)
      if (this.loop) {
        var u = i % n;
        this._startTime = t - u, this._pausedTime = 0, this.onrestart();
      } else
        return !0;
    return !1;
  }, e.prototype.pause = function() {
    this._paused = !0;
  }, e.prototype.resume = function() {
    this._paused = !1;
  }, e.prototype.setEasing = function(t) {
    this.easing = t, this.easingFunc = Z(t) ? t : Fi[t] || Pp(t);
  }, e;
}(), Ap = /* @__PURE__ */ function() {
  function e(t) {
    this.value = t;
  }
  return e;
}(), y_ = function() {
  function e() {
    this._len = 0;
  }
  return e.prototype.insert = function(t) {
    var r = new Ap(t);
    return this.insertEntry(r), r;
  }, e.prototype.insertEntry = function(t) {
    this.head ? (this.tail.next = t, t.prev = this.tail, t.next = null, this.tail = t) : this.head = this.tail = t, this._len++;
  }, e.prototype.remove = function(t) {
    var r = t.prev, n = t.next;
    r ? r.next = n : this.head = n, n ? n.prev = r : this.tail = r, t.next = t.prev = null, this._len--;
  }, e.prototype.len = function() {
    return this._len;
  }, e.prototype.clear = function() {
    this.head = this.tail = null, this._len = 0;
  }, e;
}(), Zn = function() {
  function e(t) {
    this._list = new y_(), this._maxSize = 10, this._map = {}, this._maxSize = t;
  }
  return e.prototype.put = function(t, r) {
    var n = this._list, i = this._map, a = null;
    if (i[t] == null) {
      var o = n.len(), s = this._lastRemovedEntry;
      if (o >= this._maxSize && o > 0) {
        var u = n.head;
        n.remove(u), delete i[u.key], a = u.value, this._lastRemovedEntry = u;
      }
      s ? s.value = r : s = new Ap(r), s.key = t, n.insertEntry(s), i[t] = s;
    }
    return a;
  }, e.prototype.get = function(t) {
    var r = this._map[t], n = this._list;
    if (r != null)
      return r !== n.tail && (n.remove(r), n.insertEntry(r)), r.value;
  }, e.prototype.clear = function() {
    this._list.clear(), this._map = {};
  }, e.prototype.len = function() {
    return this._list.len();
  }, e;
}(), tv = {
  transparent: [0, 0, 0, 0],
  aliceblue: [240, 248, 255, 1],
  antiquewhite: [250, 235, 215, 1],
  aqua: [0, 255, 255, 1],
  aquamarine: [127, 255, 212, 1],
  azure: [240, 255, 255, 1],
  beige: [245, 245, 220, 1],
  bisque: [255, 228, 196, 1],
  black: [0, 0, 0, 1],
  blanchedalmond: [255, 235, 205, 1],
  blue: [0, 0, 255, 1],
  blueviolet: [138, 43, 226, 1],
  brown: [165, 42, 42, 1],
  burlywood: [222, 184, 135, 1],
  cadetblue: [95, 158, 160, 1],
  chartreuse: [127, 255, 0, 1],
  chocolate: [210, 105, 30, 1],
  coral: [255, 127, 80, 1],
  cornflowerblue: [100, 149, 237, 1],
  cornsilk: [255, 248, 220, 1],
  crimson: [220, 20, 60, 1],
  cyan: [0, 255, 255, 1],
  darkblue: [0, 0, 139, 1],
  darkcyan: [0, 139, 139, 1],
  darkgoldenrod: [184, 134, 11, 1],
  darkgray: [169, 169, 169, 1],
  darkgreen: [0, 100, 0, 1],
  darkgrey: [169, 169, 169, 1],
  darkkhaki: [189, 183, 107, 1],
  darkmagenta: [139, 0, 139, 1],
  darkolivegreen: [85, 107, 47, 1],
  darkorange: [255, 140, 0, 1],
  darkorchid: [153, 50, 204, 1],
  darkred: [139, 0, 0, 1],
  darksalmon: [233, 150, 122, 1],
  darkseagreen: [143, 188, 143, 1],
  darkslateblue: [72, 61, 139, 1],
  darkslategray: [47, 79, 79, 1],
  darkslategrey: [47, 79, 79, 1],
  darkturquoise: [0, 206, 209, 1],
  darkviolet: [148, 0, 211, 1],
  deeppink: [255, 20, 147, 1],
  deepskyblue: [0, 191, 255, 1],
  dimgray: [105, 105, 105, 1],
  dimgrey: [105, 105, 105, 1],
  dodgerblue: [30, 144, 255, 1],
  firebrick: [178, 34, 34, 1],
  floralwhite: [255, 250, 240, 1],
  forestgreen: [34, 139, 34, 1],
  fuchsia: [255, 0, 255, 1],
  gainsboro: [220, 220, 220, 1],
  ghostwhite: [248, 248, 255, 1],
  gold: [255, 215, 0, 1],
  goldenrod: [218, 165, 32, 1],
  gray: [128, 128, 128, 1],
  green: [0, 128, 0, 1],
  greenyellow: [173, 255, 47, 1],
  grey: [128, 128, 128, 1],
  honeydew: [240, 255, 240, 1],
  hotpink: [255, 105, 180, 1],
  indianred: [205, 92, 92, 1],
  indigo: [75, 0, 130, 1],
  ivory: [255, 255, 240, 1],
  khaki: [240, 230, 140, 1],
  lavender: [230, 230, 250, 1],
  lavenderblush: [255, 240, 245, 1],
  lawngreen: [124, 252, 0, 1],
  lemonchiffon: [255, 250, 205, 1],
  lightblue: [173, 216, 230, 1],
  lightcoral: [240, 128, 128, 1],
  lightcyan: [224, 255, 255, 1],
  lightgoldenrodyellow: [250, 250, 210, 1],
  lightgray: [211, 211, 211, 1],
  lightgreen: [144, 238, 144, 1],
  lightgrey: [211, 211, 211, 1],
  lightpink: [255, 182, 193, 1],
  lightsalmon: [255, 160, 122, 1],
  lightseagreen: [32, 178, 170, 1],
  lightskyblue: [135, 206, 250, 1],
  lightslategray: [119, 136, 153, 1],
  lightslategrey: [119, 136, 153, 1],
  lightsteelblue: [176, 196, 222, 1],
  lightyellow: [255, 255, 224, 1],
  lime: [0, 255, 0, 1],
  limegreen: [50, 205, 50, 1],
  linen: [250, 240, 230, 1],
  magenta: [255, 0, 255, 1],
  maroon: [128, 0, 0, 1],
  mediumaquamarine: [102, 205, 170, 1],
  mediumblue: [0, 0, 205, 1],
  mediumorchid: [186, 85, 211, 1],
  mediumpurple: [147, 112, 219, 1],
  mediumseagreen: [60, 179, 113, 1],
  mediumslateblue: [123, 104, 238, 1],
  mediumspringgreen: [0, 250, 154, 1],
  mediumturquoise: [72, 209, 204, 1],
  mediumvioletred: [199, 21, 133, 1],
  midnightblue: [25, 25, 112, 1],
  mintcream: [245, 255, 250, 1],
  mistyrose: [255, 228, 225, 1],
  moccasin: [255, 228, 181, 1],
  navajowhite: [255, 222, 173, 1],
  navy: [0, 0, 128, 1],
  oldlace: [253, 245, 230, 1],
  olive: [128, 128, 0, 1],
  olivedrab: [107, 142, 35, 1],
  orange: [255, 165, 0, 1],
  orangered: [255, 69, 0, 1],
  orchid: [218, 112, 214, 1],
  palegoldenrod: [238, 232, 170, 1],
  palegreen: [152, 251, 152, 1],
  paleturquoise: [175, 238, 238, 1],
  palevioletred: [219, 112, 147, 1],
  papayawhip: [255, 239, 213, 1],
  peachpuff: [255, 218, 185, 1],
  peru: [205, 133, 63, 1],
  pink: [255, 192, 203, 1],
  plum: [221, 160, 221, 1],
  powderblue: [176, 224, 230, 1],
  purple: [128, 0, 128, 1],
  red: [255, 0, 0, 1],
  rosybrown: [188, 143, 143, 1],
  royalblue: [65, 105, 225, 1],
  saddlebrown: [139, 69, 19, 1],
  salmon: [250, 128, 114, 1],
  sandybrown: [244, 164, 96, 1],
  seagreen: [46, 139, 87, 1],
  seashell: [255, 245, 238, 1],
  sienna: [160, 82, 45, 1],
  silver: [192, 192, 192, 1],
  skyblue: [135, 206, 235, 1],
  slateblue: [106, 90, 205, 1],
  slategray: [112, 128, 144, 1],
  slategrey: [112, 128, 144, 1],
  snow: [255, 250, 250, 1],
  springgreen: [0, 255, 127, 1],
  steelblue: [70, 130, 180, 1],
  tan: [210, 180, 140, 1],
  teal: [0, 128, 128, 1],
  thistle: [216, 191, 216, 1],
  tomato: [255, 99, 71, 1],
  turquoise: [64, 224, 208, 1],
  violet: [238, 130, 238, 1],
  wheat: [245, 222, 179, 1],
  white: [255, 255, 255, 1],
  whitesmoke: [245, 245, 245, 1],
  yellow: [255, 255, 0, 1],
  yellowgreen: [154, 205, 50, 1]
};
function _e(e) {
  return e = Math.round(e), e < 0 ? 0 : e > 255 ? 255 : e;
}
function m_(e) {
  return e = Math.round(e), e < 0 ? 0 : e > 360 ? 360 : e;
}
function qi(e) {
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function so(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? _e(parseFloat(t) / 100 * 255) : _e(parseInt(t, 10));
}
function gr(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? qi(parseFloat(t) / 100) : qi(parseFloat(t));
}
function $s(e, t, r) {
  return r < 0 ? r += 1 : r > 1 && (r -= 1), r * 6 < 1 ? e + (t - e) * r * 6 : r * 2 < 1 ? t : r * 3 < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function vr(e, t, r) {
  return e + (t - e) * r;
}
function ie(e, t, r, n, i) {
  return e[0] = t, e[1] = r, e[2] = n, e[3] = i, e;
}
function yl(e, t) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
}
var Op = new Zn(20), wa = null;
function mn(e, t) {
  wa && yl(wa, t), wa = Op.put(e, wa || t.slice());
}
function he(e, t) {
  if (e) {
    t = t || [];
    var r = Op.get(e);
    if (r)
      return yl(t, r);
    e = e + "";
    var n = e.replace(/ /g, "").toLowerCase();
    if (n in tv)
      return yl(t, tv[n]), mn(e, t), t;
    var i = n.length;
    if (n.charAt(0) === "#") {
      if (i === 4 || i === 5) {
        var a = parseInt(n.slice(1, 4), 16);
        if (!(a >= 0 && a <= 4095)) {
          ie(t, 0, 0, 0, 1);
          return;
        }
        return ie(t, (a & 3840) >> 4 | (a & 3840) >> 8, a & 240 | (a & 240) >> 4, a & 15 | (a & 15) << 4, i === 5 ? parseInt(n.slice(4), 16) / 15 : 1), mn(e, t), t;
      } else if (i === 7 || i === 9) {
        var a = parseInt(n.slice(1, 7), 16);
        if (!(a >= 0 && a <= 16777215)) {
          ie(t, 0, 0, 0, 1);
          return;
        }
        return ie(t, (a & 16711680) >> 16, (a & 65280) >> 8, a & 255, i === 9 ? parseInt(n.slice(7), 16) / 255 : 1), mn(e, t), t;
      }
      return;
    }
    var o = n.indexOf("("), s = n.indexOf(")");
    if (o !== -1 && s + 1 === i) {
      var u = n.substr(0, o), l = n.substr(o + 1, s - (o + 1)).split(","), h = 1;
      switch (u) {
        case "rgba":
          if (l.length !== 4)
            return l.length === 3 ? ie(t, +l[0], +l[1], +l[2], 1) : ie(t, 0, 0, 0, 1);
          h = gr(l.pop());
        case "rgb":
          if (l.length >= 3)
            return ie(t, so(l[0]), so(l[1]), so(l[2]), l.length === 3 ? h : gr(l[3])), mn(e, t), t;
          ie(t, 0, 0, 0, 1);
          return;
        case "hsla":
          if (l.length !== 4) {
            ie(t, 0, 0, 0, 1);
            return;
          }
          return l[3] = gr(l[3]), ml(l, t), mn(e, t), t;
        case "hsl":
          if (l.length !== 3) {
            ie(t, 0, 0, 0, 1);
            return;
          }
          return ml(l, t), mn(e, t), t;
        default:
          return;
      }
    }
    ie(t, 0, 0, 0, 1);
  }
}
function ml(e, t) {
  var r = (parseFloat(e[0]) % 360 + 360) % 360 / 360, n = gr(e[1]), i = gr(e[2]), a = i <= 0.5 ? i * (n + 1) : i + n - i * n, o = i * 2 - a;
  return t = t || [], ie(t, _e($s(o, a, r + 1 / 3) * 255), _e($s(o, a, r) * 255), _e($s(o, a, r - 1 / 3) * 255), 1), e.length === 4 && (t[3] = e[3]), t;
}
function __(e) {
  if (e) {
    var t = e[0] / 255, r = e[1] / 255, n = e[2] / 255, i = Math.min(t, r, n), a = Math.max(t, r, n), o = a - i, s = (a + i) / 2, u, l;
    if (o === 0)
      u = 0, l = 0;
    else {
      s < 0.5 ? l = o / (a + i) : l = o / (2 - a - i);
      var h = ((a - t) / 6 + o / 2) / o, f = ((a - r) / 6 + o / 2) / o, v = ((a - n) / 6 + o / 2) / o;
      t === a ? u = v - f : r === a ? u = 1 / 3 + h - v : n === a && (u = 2 / 3 + f - h), u < 0 && (u += 1), u > 1 && (u -= 1);
    }
    var c = [u * 360, l, s];
    return e[3] != null && c.push(e[3]), c;
  }
}
function _l(e, t) {
  var r = he(e);
  if (r) {
    for (var n = 0; n < 3; n++)
      t < 0 ? r[n] = r[n] * (1 - t) | 0 : r[n] = (255 - r[n]) * t + r[n] | 0, r[n] > 255 ? r[n] = 255 : r[n] < 0 && (r[n] = 0);
    return dn(r, r.length === 4 ? "rgba" : "rgb");
  }
}
function S_(e) {
  var t = he(e);
  if (t)
    return ((1 << 24) + (t[0] << 16) + (t[1] << 8) + +t[2]).toString(16).slice(1);
}
function kp(e, t, r) {
  if (!(!(t && t.length) || !(e >= 0 && e <= 1))) {
    r = r || [];
    var n = e * (t.length - 1), i = Math.floor(n), a = Math.ceil(n), o = t[i], s = t[a], u = n - i;
    return r[0] = _e(vr(o[0], s[0], u)), r[1] = _e(vr(o[1], s[1], u)), r[2] = _e(vr(o[2], s[2], u)), r[3] = qi(vr(o[3], s[3], u)), r;
  }
}
var w_ = kp;
function Np(e, t, r) {
  if (!(!(t && t.length) || !(e >= 0 && e <= 1))) {
    var n = e * (t.length - 1), i = Math.floor(n), a = Math.ceil(n), o = he(t[i]), s = he(t[a]), u = n - i, l = dn([
      _e(vr(o[0], s[0], u)),
      _e(vr(o[1], s[1], u)),
      _e(vr(o[2], s[2], u)),
      qi(vr(o[3], s[3], u))
    ], "rgba");
    return r ? {
      color: l,
      leftIndex: i,
      rightIndex: a,
      value: n
    } : l;
  }
}
var b_ = Np;
function ko(e, t, r, n) {
  var i = he(e);
  if (e)
    return i = __(i), t != null && (i[0] = m_(Z(t) ? t(i[0]) : t)), r != null && (i[1] = gr(Z(r) ? r(i[1]) : r)), n != null && (i[2] = gr(Z(n) ? n(i[2]) : n)), dn(ml(i), "rgba");
}
function T_(e, t) {
  var r = he(e);
  if (r && t != null)
    return r[3] = qi(t), dn(r, "rgba");
}
function dn(e, t) {
  if (!(!e || !e.length)) {
    var r = e[0] + "," + e[1] + "," + e[2];
    return (t === "rgba" || t === "hsva" || t === "hsla") && (r += "," + e[3]), t + "(" + r + ")";
  }
}
function Ki(e, t) {
  var r = he(e);
  return r ? (0.299 * r[0] + 0.587 * r[1] + 0.114 * r[2]) * r[3] / 255 + (1 - r[3]) * t : 0;
}
function C_() {
  return dn([
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255)
  ], "rgb");
}
var ev = new Zn(100);
function Sl(e) {
  if (G(e)) {
    var t = ev.get(e);
    return t || (t = _l(e, -0.1), ev.put(e, t)), t;
  } else if (fa(e)) {
    var r = A({}, e);
    return r.colorStops = z(e.colorStops, function(n) {
      return {
        offset: n.offset,
        color: _l(n.color, -0.1)
      };
    }), r;
  }
  return e;
}
const M_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fastLerp: kp,
  fastMapToColor: w_,
  lerp: Np,
  lift: _l,
  liftColor: Sl,
  lum: Ki,
  mapToColor: b_,
  modifyAlpha: T_,
  modifyHSL: ko,
  parse: he,
  parseCssFloat: gr,
  parseCssInt: so,
  random: C_,
  stringify: dn,
  toHex: S_
}, Symbol.toStringTag, { value: "Module" }));
function D_(e) {
  return e.type === "linear";
}
function I_(e) {
  return e.type === "radial";
}
(function() {
  return typeof Buffer != "undefined" && typeof Buffer.from == "function" ? function(e) {
    return Buffer.from(e).toString("base64");
  } : typeof btoa == "function" && typeof unescape == "function" && typeof encodeURIComponent == "function" ? function(e) {
    return btoa(unescape(encodeURIComponent(e)));
  } : function(e) {
    return null;
  };
})();
var wl = Array.prototype.slice;
function Ze(e, t, r) {
  return (t - e) * r + e;
}
function Zs(e, t, r, n) {
  for (var i = t.length, a = 0; a < i; a++)
    e[a] = Ze(t[a], r[a], n);
  return e;
}
function x_(e, t, r, n) {
  for (var i = t.length, a = i && t[0].length, o = 0; o < i; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++)
      e[o][s] = Ze(t[o][s], r[o][s], n);
  }
  return e;
}
function ba(e, t, r, n) {
  for (var i = t.length, a = 0; a < i; a++)
    e[a] = t[a] + r[a] * n;
  return e;
}
function rv(e, t, r, n) {
  for (var i = t.length, a = i && t[0].length, o = 0; o < i; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++)
      e[o][s] = t[o][s] + r[o][s] * n;
  }
  return e;
}
function L_(e, t) {
  for (var r = e.length, n = t.length, i = r > n ? t : e, a = Math.min(r, n), o = i[a - 1] || { color: [0, 0, 0, 0], offset: 0 }, s = a; s < Math.max(r, n); s++)
    i.push({
      offset: o.offset,
      color: o.color.slice()
    });
}
function E_(e, t, r) {
  var n = e, i = t;
  if (!(!n.push || !i.push)) {
    var a = n.length, o = i.length;
    if (a !== o) {
      var s = a > o;
      if (s)
        n.length = o;
      else
        for (var u = a; u < o; u++)
          n.push(r === 1 ? i[u] : wl.call(i[u]));
    }
    for (var l = n[0] && n[0].length, u = 0; u < n.length; u++)
      if (r === 1)
        isNaN(n[u]) && (n[u] = i[u]);
      else
        for (var h = 0; h < l; h++)
          isNaN(n[u][h]) && (n[u][h] = i[u][h]);
  }
}
function uo(e) {
  if ($t(e)) {
    var t = e.length;
    if ($t(e[0])) {
      for (var r = [], n = 0; n < t; n++)
        r.push(wl.call(e[n]));
      return r;
    }
    return wl.call(e);
  }
  return e;
}
function lo(e) {
  return e[0] = Math.floor(e[0]) || 0, e[1] = Math.floor(e[1]) || 0, e[2] = Math.floor(e[2]) || 0, e[3] = e[3] == null ? 1 : e[3], "rgba(" + e.join(",") + ")";
}
function R_(e) {
  return $t(e && e[0]) ? 2 : 1;
}
var Ta = 0, fo = 1, Bp = 2, Ei = 3, bl = 4, Tl = 5, nv = 6;
function iv(e) {
  return e === bl || e === Tl;
}
function Ca(e) {
  return e === fo || e === Bp;
}
var fi = [0, 0, 0, 0], P_ = function() {
  function e(t) {
    this.keyframes = [], this.discrete = !1, this._invalid = !1, this._needsSort = !1, this._lastFr = 0, this._lastFrP = 0, this.propName = t;
  }
  return e.prototype.isFinished = function() {
    return this._finished;
  }, e.prototype.setFinished = function() {
    this._finished = !0, this._additiveTrack && this._additiveTrack.setFinished();
  }, e.prototype.needsAnimate = function() {
    return this.keyframes.length >= 1;
  }, e.prototype.getAdditiveTrack = function() {
    return this._additiveTrack;
  }, e.prototype.addKeyframe = function(t, r, n) {
    this._needsSort = !0;
    var i = this.keyframes, a = i.length, o = !1, s = nv, u = r;
    if ($t(r)) {
      var l = R_(r);
      s = l, (l === 1 && !pt(r[0]) || l === 2 && !pt(r[0][0])) && (o = !0);
    } else if (pt(r) && !Xi(r))
      s = Ta;
    else if (G(r))
      if (!isNaN(+r))
        s = Ta;
      else {
        var h = he(r);
        h && (u = h, s = Ei);
      }
    else if (fa(r)) {
      var f = A({}, u);
      f.colorStops = z(r.colorStops, function(c) {
        return {
          offset: c.offset,
          color: he(c.color)
        };
      }), D_(r) ? s = bl : I_(r) && (s = Tl), u = f;
    }
    a === 0 ? this.valType = s : (s !== this.valType || s === nv) && (o = !0), this.discrete = this.discrete || o;
    var v = {
      time: t,
      value: u,
      rawValue: r,
      percent: 0
    };
    return n && (v.easing = n, v.easingFunc = Z(n) ? n : Fi[n] || Pp(n)), i.push(v), v;
  }, e.prototype.prepare = function(t, r) {
    var n = this.keyframes;
    this._needsSort && n.sort(function(y, p) {
      return y.time - p.time;
    });
    for (var i = this.valType, a = n.length, o = n[a - 1], s = this.discrete, u = Ca(i), l = iv(i), h = 0; h < a; h++) {
      var f = n[h], v = f.value, c = o.value;
      f.percent = f.time / t, s || (u && h !== a - 1 ? E_(v, c, i) : l && L_(v.colorStops, c.colorStops));
    }
    if (!s && i !== Tl && r && this.needsAnimate() && r.needsAnimate() && i === r.valType && !r._finished) {
      this._additiveTrack = r;
      for (var d = n[0].value, h = 0; h < a; h++)
        i === Ta ? n[h].additiveValue = n[h].value - d : i === Ei ? n[h].additiveValue = ba([], n[h].value, d, -1) : Ca(i) && (n[h].additiveValue = i === fo ? ba([], n[h].value, d, -1) : rv([], n[h].value, d, -1));
    }
  }, e.prototype.step = function(t, r) {
    if (!this._finished) {
      this._additiveTrack && this._additiveTrack._finished && (this._additiveTrack = null);
      var n = this._additiveTrack != null, i = n ? "additiveValue" : "value", a = this.valType, o = this.keyframes, s = o.length, u = this.propName, l = a === Ei, h, f = this._lastFr, v = Math.min, c, d;
      if (s === 1)
        c = d = o[0];
      else {
        if (r < 0)
          h = 0;
        else if (r < this._lastFrP) {
          var y = v(f + 1, s - 1);
          for (h = y; h >= 0 && !(o[h].percent <= r); h--)
            ;
          h = v(h, s - 2);
        } else {
          for (h = f; h < s && !(o[h].percent > r); h++)
            ;
          h = v(h - 1, s - 2);
        }
        d = o[h + 1], c = o[h];
      }
      if (c && d) {
        this._lastFr = h, this._lastFrP = r;
        var p = d.percent - c.percent, g = p === 0 ? 1 : v((r - c.percent) / p, 1);
        d.easingFunc && (g = d.easingFunc(g));
        var m = n ? this._additiveValue : l ? fi : t[u];
        if ((Ca(a) || l) && !m && (m = this._additiveValue = []), this.discrete)
          t[u] = g < 1 ? c.rawValue : d.rawValue;
        else if (Ca(a))
          a === fo ? Zs(m, c[i], d[i], g) : x_(m, c[i], d[i], g);
        else if (iv(a)) {
          var _ = c[i], S = d[i], w = a === bl;
          t[u] = {
            type: w ? "linear" : "radial",
            x: Ze(_.x, S.x, g),
            y: Ze(_.y, S.y, g),
            colorStops: z(_.colorStops, function(M, C) {
              var T = S.colorStops[C];
              return {
                offset: Ze(M.offset, T.offset, g),
                color: lo(Zs([], M.color, T.color, g))
              };
            }),
            global: S.global
          }, w ? (t[u].x2 = Ze(_.x2, S.x2, g), t[u].y2 = Ze(_.y2, S.y2, g)) : t[u].r = Ze(_.r, S.r, g);
        } else if (l)
          Zs(m, c[i], d[i], g), n || (t[u] = lo(m));
        else {
          var b = Ze(c[i], d[i], g);
          n ? this._additiveValue = b : t[u] = b;
        }
        n && this._addToTarget(t);
      }
    }
  }, e.prototype._addToTarget = function(t) {
    var r = this.valType, n = this.propName, i = this._additiveValue;
    r === Ta ? t[n] = t[n] + i : r === Ei ? (he(t[n], fi), ba(fi, fi, i, 1), t[n] = lo(fi)) : r === fo ? ba(t[n], t[n], i, 1) : r === Bp && rv(t[n], t[n], i, 1);
  }, e;
}(), Sf = function() {
  function e(t, r, n, i) {
    if (this._tracks = {}, this._trackKeys = [], this._maxTime = 0, this._started = 0, this._clip = null, this._target = t, this._loop = r, r && i) {
      as("Can' use additive animation on looped animation.");
      return;
    }
    this._additiveAnimators = i, this._allowDiscrete = n;
  }
  return e.prototype.getMaxTime = function() {
    return this._maxTime;
  }, e.prototype.getDelay = function() {
    return this._delay;
  }, e.prototype.getLoop = function() {
    return this._loop;
  }, e.prototype.getTarget = function() {
    return this._target;
  }, e.prototype.changeTarget = function(t) {
    this._target = t;
  }, e.prototype.when = function(t, r, n) {
    return this.whenWithKeys(t, r, ft(r), n);
  }, e.prototype.whenWithKeys = function(t, r, n, i) {
    for (var a = this._tracks, o = 0; o < n.length; o++) {
      var s = n[o], u = a[s];
      if (!u) {
        u = a[s] = new P_(s);
        var l = void 0, h = this._getAdditiveTrack(s);
        if (h) {
          var f = h.keyframes, v = f[f.length - 1];
          l = v && v.value, h.valType === Ei && l && (l = lo(l));
        } else
          l = this._target[s];
        if (l == null)
          continue;
        t > 0 && u.addKeyframe(0, uo(l), i), this._trackKeys.push(s);
      }
      u.addKeyframe(t, uo(r[s]), i);
    }
    return this._maxTime = Math.max(this._maxTime, t), this;
  }, e.prototype.pause = function() {
    this._clip.pause(), this._paused = !0;
  }, e.prototype.resume = function() {
    this._clip.resume(), this._paused = !1;
  }, e.prototype.isPaused = function() {
    return !!this._paused;
  }, e.prototype.duration = function(t) {
    return this._maxTime = t, this._force = !0, this;
  }, e.prototype._doneCallback = function() {
    this._setTracksFinished(), this._clip = null;
    var t = this._doneCbs;
    if (t)
      for (var r = t.length, n = 0; n < r; n++)
        t[n].call(this);
  }, e.prototype._abortedCallback = function() {
    this._setTracksFinished();
    var t = this.animation, r = this._abortedCbs;
    if (t && t.removeClip(this._clip), this._clip = null, r)
      for (var n = 0; n < r.length; n++)
        r[n].call(this);
  }, e.prototype._setTracksFinished = function() {
    for (var t = this._tracks, r = this._trackKeys, n = 0; n < r.length; n++)
      t[r[n]].setFinished();
  }, e.prototype._getAdditiveTrack = function(t) {
    var r, n = this._additiveAnimators;
    if (n)
      for (var i = 0; i < n.length; i++) {
        var a = n[i].getTrack(t);
        a && (r = a);
      }
    return r;
  }, e.prototype.start = function(t) {
    if (!(this._started > 0)) {
      this._started = 1;
      for (var r = this, n = [], i = this._maxTime || 0, a = 0; a < this._trackKeys.length; a++) {
        var o = this._trackKeys[a], s = this._tracks[o], u = this._getAdditiveTrack(o), l = s.keyframes, h = l.length;
        if (s.prepare(i, u), s.needsAnimate())
          if (!this._allowDiscrete && s.discrete) {
            var f = l[h - 1];
            f && (r._target[s.propName] = f.rawValue), s.setFinished();
          } else
            n.push(s);
      }
      if (n.length || this._force) {
        var v = new g_({
          life: i,
          loop: this._loop,
          delay: this._delay || 0,
          onframe: function(c) {
            r._started = 2;
            var d = r._additiveAnimators;
            if (d) {
              for (var y = !1, p = 0; p < d.length; p++)
                if (d[p]._clip) {
                  y = !0;
                  break;
                }
              y || (r._additiveAnimators = null);
            }
            for (var p = 0; p < n.length; p++)
              n[p].step(r._target, c);
            var g = r._onframeCbs;
            if (g)
              for (var p = 0; p < g.length; p++)
                g[p](r._target, c);
          },
          ondestroy: function() {
            r._doneCallback();
          }
        });
        this._clip = v, this.animation && this.animation.addClip(v), t && v.setEasing(t);
      } else
        this._doneCallback();
      return this;
    }
  }, e.prototype.stop = function(t) {
    if (this._clip) {
      var r = this._clip;
      t && r.onframe(1), this._abortedCallback();
    }
  }, e.prototype.delay = function(t) {
    return this._delay = t, this;
  }, e.prototype.during = function(t) {
    return t && (this._onframeCbs || (this._onframeCbs = []), this._onframeCbs.push(t)), this;
  }, e.prototype.done = function(t) {
    return t && (this._doneCbs || (this._doneCbs = []), this._doneCbs.push(t)), this;
  }, e.prototype.aborted = function(t) {
    return t && (this._abortedCbs || (this._abortedCbs = []), this._abortedCbs.push(t)), this;
  }, e.prototype.getClip = function() {
    return this._clip;
  }, e.prototype.getTrack = function(t) {
    return this._tracks[t];
  }, e.prototype.getTracks = function() {
    var t = this;
    return z(this._trackKeys, function(r) {
      return t._tracks[r];
    });
  }, e.prototype.stopTracks = function(t, r) {
    if (!t.length || !this._clip)
      return !0;
    for (var n = this._tracks, i = this._trackKeys, a = 0; a < t.length; a++) {
      var o = n[t[a]];
      o && !o.isFinished() && (r ? o.step(this._target, 1) : this._started === 1 && o.step(this._target, 0), o.setFinished());
    }
    for (var s = !0, a = 0; a < i.length; a++)
      if (!n[i[a]].isFinished()) {
        s = !1;
        break;
      }
    return s && this._abortedCallback(), s;
  }, e.prototype.saveTo = function(t, r, n) {
    if (t) {
      r = r || this._trackKeys;
      for (var i = 0; i < r.length; i++) {
        var a = r[i], o = this._tracks[a];
        if (!(!o || o.isFinished())) {
          var s = o.keyframes, u = s[n ? 0 : s.length - 1];
          u && (t[a] = uo(u.rawValue));
        }
      }
    }
  }, e.prototype.__changeFinalValue = function(t, r) {
    r = r || ft(t);
    for (var n = 0; n < r.length; n++) {
      var i = r[n], a = this._tracks[i];
      if (a) {
        var o = a.keyframes;
        if (o.length > 1) {
          var s = o.pop();
          a.addKeyframe(s.time, t[i]), a.prepare(this._maxTime, a.getAdditiveTrack());
        }
      }
    }
  }, e;
}();
function Bn() {
  return (/* @__PURE__ */ new Date()).getTime();
}
var A_ = function(e) {
  B(t, e);
  function t(r) {
    var n = e.call(this) || this;
    return n._running = !1, n._time = 0, n._pausedTime = 0, n._pauseStart = 0, n._paused = !1, r = r || {}, n.stage = r.stage || {}, n;
  }
  return t.prototype.addClip = function(r) {
    r.animation && this.removeClip(r), this._head ? (this._tail.next = r, r.prev = this._tail, r.next = null, this._tail = r) : this._head = this._tail = r, r.animation = this;
  }, t.prototype.addAnimator = function(r) {
    r.animation = this;
    var n = r.getClip();
    n && this.addClip(n);
  }, t.prototype.removeClip = function(r) {
    if (r.animation) {
      var n = r.prev, i = r.next;
      n ? n.next = i : this._head = i, i ? i.prev = n : this._tail = n, r.next = r.prev = r.animation = null;
    }
  }, t.prototype.removeAnimator = function(r) {
    var n = r.getClip();
    n && this.removeClip(n), r.animation = null;
  }, t.prototype.update = function(r) {
    for (var n = Bn() - this._pausedTime, i = n - this._time, a = this._head; a; ) {
      var o = a.next, s = a.step(n, i);
      s && (a.ondestroy(), this.removeClip(a)), a = o;
    }
    this._time = n, r || (this.trigger("frame", i), this.stage.update && this.stage.update());
  }, t.prototype._startLoop = function() {
    var r = this;
    this._running = !0;
    function n() {
      r._running && (Po(n), !r._paused && r.update());
    }
    Po(n);
  }, t.prototype.start = function() {
    this._running || (this._time = Bn(), this._pausedTime = 0, this._startLoop());
  }, t.prototype.stop = function() {
    this._running = !1;
  }, t.prototype.pause = function() {
    this._paused || (this._pauseStart = Bn(), this._paused = !0);
  }, t.prototype.resume = function() {
    this._paused && (this._pausedTime += Bn() - this._pauseStart, this._paused = !1);
  }, t.prototype.clear = function() {
    for (var r = this._head; r; ) {
      var n = r.next;
      r.prev = r.next = r.animation = null, r = n;
    }
    this._head = this._tail = null;
  }, t.prototype.isFinished = function() {
    return this._head == null;
  }, t.prototype.animate = function(r, n) {
    n = n || {}, this.start();
    var i = new Sf(r, n.loop);
    return this.addAnimator(i), i;
  }, t;
}(Te), O_ = 300, qs = tt.domSupported, Ks = function() {
  var e = [
    "click",
    "dblclick",
    "mousewheel",
    "wheel",
    "mouseout",
    "mouseup",
    "mousedown",
    "mousemove",
    "contextmenu"
  ], t = [
    "touchstart",
    "touchend",
    "touchmove"
  ], r = {
    pointerdown: 1,
    pointerup: 1,
    pointermove: 1,
    pointerout: 1
  }, n = z(e, function(i) {
    var a = i.replace("mouse", "pointer");
    return r.hasOwnProperty(a) ? a : i;
  });
  return {
    mouse: e,
    touch: t,
    pointer: n
  };
}(), av = {
  mouse: ["mousemove", "mouseup"],
  pointer: ["pointermove", "pointerup"]
}, ov = !1;
function Cl(e) {
  var t = e.pointerType;
  return t === "pen" || t === "touch";
}
function k_(e) {
  e.touching = !0, e.touchTimer != null && (clearTimeout(e.touchTimer), e.touchTimer = null), e.touchTimer = setTimeout(function() {
    e.touching = !1, e.touchTimer = null;
  }, 700);
}
function Qs(e) {
  e && (e.zrByTouch = !0);
}
function N_(e, t) {
  return pe(e.dom, new B_(e, t), !0);
}
function Fp(e, t) {
  for (var r = t, n = !1; r && r.nodeType !== 9 && !(n = r.domBelongToZr || r !== t && r === e.painterRoot); )
    r = r.parentNode;
  return n;
}
var B_ = /* @__PURE__ */ function() {
  function e(t, r) {
    this.stopPropagation = St, this.stopImmediatePropagation = St, this.preventDefault = St, this.type = r.type, this.target = this.currentTarget = t.dom, this.pointerType = r.pointerType, this.clientX = r.clientX, this.clientY = r.clientY;
  }
  return e;
}(), ge = {
  mousedown: function(e) {
    e = pe(this.dom, e), this.__mayPointerCapture = [e.zrX, e.zrY], this.trigger("mousedown", e);
  },
  mousemove: function(e) {
    e = pe(this.dom, e);
    var t = this.__mayPointerCapture;
    t && (e.zrX !== t[0] || e.zrY !== t[1]) && this.__togglePointerCapture(!0), this.trigger("mousemove", e);
  },
  mouseup: function(e) {
    e = pe(this.dom, e), this.__togglePointerCapture(!1), this.trigger("mouseup", e);
  },
  mouseout: function(e) {
    e = pe(this.dom, e);
    var t = e.toElement || e.relatedTarget;
    Fp(this, t) || (this.__pointerCapturing && (e.zrEventControl = "no_globalout"), this.trigger("mouseout", e));
  },
  wheel: function(e) {
    ov = !0, e = pe(this.dom, e), this.trigger("mousewheel", e);
  },
  mousewheel: function(e) {
    ov || (e = pe(this.dom, e), this.trigger("mousewheel", e));
  },
  touchstart: function(e) {
    e = pe(this.dom, e), Qs(e), this.__lastTouchMoment = /* @__PURE__ */ new Date(), this.handler.processGesture(e, "start"), ge.mousemove.call(this, e), ge.mousedown.call(this, e);
  },
  touchmove: function(e) {
    e = pe(this.dom, e), Qs(e), this.handler.processGesture(e, "change"), ge.mousemove.call(this, e);
  },
  touchend: function(e) {
    e = pe(this.dom, e), Qs(e), this.handler.processGesture(e, "end"), ge.mouseup.call(this, e), +/* @__PURE__ */ new Date() - +this.__lastTouchMoment < O_ && ge.click.call(this, e);
  },
  pointerdown: function(e) {
    ge.mousedown.call(this, e);
  },
  pointermove: function(e) {
    Cl(e) || ge.mousemove.call(this, e);
  },
  pointerup: function(e) {
    ge.mouseup.call(this, e);
  },
  pointerout: function(e) {
    Cl(e) || ge.mouseout.call(this, e);
  }
};
D(["click", "dblclick", "contextmenu"], function(e) {
  ge[e] = function(t) {
    t = pe(this.dom, t), this.trigger(e, t);
  };
});
var Ml = {
  pointermove: function(e) {
    Cl(e) || Ml.mousemove.call(this, e);
  },
  pointerup: function(e) {
    Ml.mouseup.call(this, e);
  },
  mousemove: function(e) {
    this.trigger("mousemove", e);
  },
  mouseup: function(e) {
    var t = this.__pointerCapturing;
    this.__togglePointerCapture(!1), this.trigger("mouseup", e), t && (e.zrEventControl = "only_globalout", this.trigger("mouseout", e));
  }
};
function F_(e, t) {
  var r = t.domHandlers;
  tt.pointerEventsSupported ? D(Ks.pointer, function(n) {
    ho(t, n, function(i) {
      r[n].call(e, i);
    });
  }) : (tt.touchEventsSupported && D(Ks.touch, function(n) {
    ho(t, n, function(i) {
      r[n].call(e, i), k_(t);
    });
  }), D(Ks.mouse, function(n) {
    ho(t, n, function(i) {
      i = _f(i), t.touching || r[n].call(e, i);
    });
  }));
}
function z_(e, t) {
  tt.pointerEventsSupported ? D(av.pointer, r) : tt.touchEventsSupported || D(av.mouse, r);
  function r(n) {
    function i(a) {
      a = _f(a), Fp(e, a.target) || (a = N_(e, a), t.domHandlers[n].call(e, a));
    }
    ho(t, n, i, { capture: !0 });
  }
}
function ho(e, t, r, n) {
  e.mounted[t] = r, e.listenerOpts[t] = n, U0(e.domTarget, t, r, n);
}
function Js(e) {
  var t = e.mounted;
  for (var r in t)
    t.hasOwnProperty(r) && Y0(e.domTarget, r, t[r], e.listenerOpts[r]);
  e.mounted = {};
}
var sv = /* @__PURE__ */ function() {
  function e(t, r) {
    this.mounted = {}, this.listenerOpts = {}, this.touching = !1, this.domTarget = t, this.domHandlers = r;
  }
  return e;
}(), V_ = function(e) {
  B(t, e);
  function t(r, n) {
    var i = e.call(this) || this;
    return i.__pointerCapturing = !1, i.dom = r, i.painterRoot = n, i._localHandlerScope = new sv(r, ge), qs && (i._globalHandlerScope = new sv(document, Ml)), F_(i, i._localHandlerScope), i;
  }
  return t.prototype.dispose = function() {
    Js(this._localHandlerScope), qs && Js(this._globalHandlerScope);
  }, t.prototype.setCursor = function(r) {
    this.dom.style && (this.dom.style.cursor = r || "default");
  }, t.prototype.__togglePointerCapture = function(r) {
    if (this.__mayPointerCapture = null, qs && +this.__pointerCapturing ^ +r) {
      this.__pointerCapturing = r;
      var n = this._globalHandlerScope;
      r ? z_(this, n) : Js(n);
    }
  }, t;
}(Te), zp = 1;
tt.hasGlobalWindow && (zp = Math.max(window.devicePixelRatio || window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI || 1, 1));
var No = zp, Dl = 0.4, Il = "#333", xl = "#ccc", H_ = "#eee", uv = ri, lv = 5e-5;
function Ar(e) {
  return e > lv || e < -lv;
}
var Or = [], _n = [], js = Lt(), tu = Math.abs, ii = function() {
  function e() {
  }
  return e.prototype.getLocalTransform = function(t) {
    return ln(this, t);
  }, e.prototype.setPosition = function(t) {
    this.x = t[0], this.y = t[1];
  }, e.prototype.setScale = function(t) {
    this.scaleX = t[0], this.scaleY = t[1];
  }, e.prototype.setSkew = function(t) {
    this.skewX = t[0], this.skewY = t[1];
  }, e.prototype.setOrigin = function(t) {
    this.originX = t[0], this.originY = t[1];
  }, e.prototype.needLocalTransform = function() {
    return Ar(this.rotation) || Ar(this.x) || Ar(this.y) || Ar(this.scaleX - 1) || Ar(this.scaleY - 1) || Ar(this.skewX) || Ar(this.skewY);
  }, e.prototype.updateTransform = function() {
    var t = this.parent && this.parent.transform, r = this.needLocalTransform(), n = this.transform;
    if (!(r || t)) {
      n && (uv(n), this.invTransform = null);
      return;
    }
    n = n || Lt(), r ? this.getLocalTransform(n) : uv(n), t && (r ? dr(n, t, n) : un(n, t)), this.transform = n, this._resolveGlobalScaleRatio(n), this.invTransform = this.invTransform || Lt(), ni(this.invTransform, n);
  }, e.prototype._resolveGlobalScaleRatio = function(t) {
    var r = this.globalScaleRatio;
    if (r != null && r !== 1) {
      this.getGlobalScale(Or);
      var n = Or[0] < 0 ? -1 : 1, i = Or[1] < 0 ? -1 : 1, a = ((Or[0] - n) * r + n) / Or[0] || 0, o = ((Or[1] - i) * r + i) / Or[1] || 0;
      t[0] *= a, t[1] *= a, t[2] *= o, t[3] *= o;
    }
  }, e.prototype.getComputedTransform = function() {
    for (var t = this, r = []; t; )
      r.push(t), t = t.parent;
    for (; t = r.pop(); )
      t.updateTransform();
    return this.transform;
  }, e.prototype.setLocalTransform = function(t) {
    if (t) {
      var r = t[0] * t[0] + t[1] * t[1], n = t[2] * t[2] + t[3] * t[3], i = Math.atan2(t[1], t[0]), a = Math.PI / 2 + i - Math.atan2(t[3], t[2]);
      n = Math.sqrt(n) * Math.cos(a), r = Math.sqrt(r), this.skewX = a, this.skewY = 0, this.rotation = -i, this.x = +t[4], this.y = +t[5], this.scaleX = r, this.scaleY = n, this.originX = 0, this.originY = 0;
    }
  }, e.prototype.decomposeTransform = function() {
    if (this.transform) {
      var t = this.parent, r = this.transform;
      t && t.transform && (t.invTransform = t.invTransform || Lt(), dr(_n, t.invTransform, r), r = _n);
      var n = this.originX, i = this.originY;
      (n || i) && (js[4] = n, js[5] = i, dr(_n, r, js), _n[4] -= n, _n[5] -= i, r = _n), this.setLocalTransform(r);
    }
  }, e.prototype.getGlobalScale = function(t) {
    var r = this.transform;
    return t = t || [], r ? (t[0] = Math.sqrt(r[0] * r[0] + r[1] * r[1]), t[1] = Math.sqrt(r[2] * r[2] + r[3] * r[3]), r[0] < 0 && (t[0] = -t[0]), r[3] < 0 && (t[1] = -t[1]), t) : (t[0] = 1, t[1] = 1, t);
  }, e.prototype.transformCoordToLocal = function(t, r) {
    var n = [t, r], i = this.invTransform;
    return i && fe(n, n, i), n;
  }, e.prototype.transformCoordToGlobal = function(t, r) {
    var n = [t, r], i = this.transform;
    return i && fe(n, n, i), n;
  }, e.prototype.getLineScale = function() {
    var t = this.transform;
    return t && tu(t[0] - 1) > 1e-10 && tu(t[3] - 1) > 1e-10 ? Math.sqrt(tu(t[0] * t[3] - t[2] * t[1])) : 1;
  }, e.prototype.copyTransform = function(t) {
    fn(this, t);
  }, e.getLocalTransform = function(t, r) {
    r = r || [];
    var n = t.originX || 0, i = t.originY || 0, a = t.scaleX, o = t.scaleY, s = t.anchorX, u = t.anchorY, l = t.rotation || 0, h = t.x, f = t.y, v = t.skewX ? Math.tan(t.skewX) : 0, c = t.skewY ? Math.tan(-t.skewY) : 0;
    if (n || i || s || u) {
      var d = n + s, y = i + u;
      r[4] = -d * a - v * y * o, r[5] = -y * o - c * d * a;
    } else
      r[4] = r[5] = 0;
    return r[0] = a, r[3] = o, r[1] = c * a, r[2] = v * o, l && Sp(r, r, l), r[4] += n + h, r[5] += i + f, r;
  }, e.initDefaultProps = function() {
    var t = e.prototype;
    t.scaleX = t.scaleY = t.globalScaleRatio = 1, t.x = t.y = t.originX = t.originY = t.skewX = t.skewY = t.rotation = t.anchorX = t.anchorY = 0;
  }(), e;
}(), ln = ii.getLocalTransform;
function Gn() {
  return new ii();
}
var ls = [
  "x",
  "y",
  "originX",
  "originY",
  "anchorX",
  "anchorY",
  "rotation",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY"
];
function fn(e, t) {
  return lp(e, t, ls);
}
function Ne(e) {
  Ma || (Ma = new Zn(100)), e = e || mr;
  var t = Ma.get(e);
  return t || (t = {
    font: e,
    strWidthCache: new Zn(500),
    asciiWidthMap: null,
    asciiWidthMapTried: !1,
    stWideCharWidth: Tt.measureText("国", e).width,
    asciiCharWidth: Tt.measureText("a", e).width
  }, Ma.put(e, t)), t;
}
var Ma;
function G_(e) {
  if (!(eu >= fv)) {
    e = e || mr;
    for (var t = [], r = +/* @__PURE__ */ new Date(), n = 0; n <= 127; n++)
      t[n] = Tt.measureText(String.fromCharCode(n), e).width;
    var i = +/* @__PURE__ */ new Date() - r;
    return i > 16 ? eu = fv : i > 2 && eu++, t;
  }
}
var eu = 0, fv = 5;
function Vp(e, t) {
  return e.asciiWidthMapTried || (e.asciiWidthMap = G_(e.font), e.asciiWidthMapTried = !0), 0 <= t && t <= 127 ? e.asciiWidthMap != null ? e.asciiWidthMap[t] : e.asciiCharWidth : e.stWideCharWidth;
}
function Be(e, t) {
  var r = e.strWidthCache, n = r.get(t);
  return n == null && (n = Tt.measureText(t, e.font).width, r.put(t, n)), n;
}
function hv(e, t, r, n) {
  var i = Be(Ne(t), e), a = fs(t), o = qn(0, i, r), s = rn(0, a, n), u = new H(o, s, i, a);
  return u;
}
function U_(e, t, r, n) {
  var i = ((e || "") + "").split(`
`), a = i.length;
  if (a === 1)
    return hv(i[0], t, r, n);
  for (var o = new H(0, 0, 0, 0), s = 0; s < i.length; s++) {
    var u = hv(i[s], t, r, n);
    s === 0 ? o.copy(u) : o.union(u);
  }
  return o;
}
function qn(e, t, r, n) {
  return r === "right" ? n ? e += t : e -= t : r === "center" && (n ? e += t / 2 : e -= t / 2), e;
}
function rn(e, t, r, n) {
  return r === "middle" ? n ? e += t / 2 : e -= t / 2 : r === "bottom" && (n ? e += t : e -= t), e;
}
function fs(e) {
  return Ne(e).stWideCharWidth;
}
function Kn(e, t) {
  return typeof e == "string" ? e.lastIndexOf("%") >= 0 ? parseFloat(e) / 100 * t : parseFloat(e) : e;
}
function Hp(e, t, r) {
  var n = t.position || "inside", i = t.distance != null ? t.distance : 5, a = r.height, o = r.width, s = a / 2, u = r.x, l = r.y, h = "left", f = "top";
  if (n instanceof Array)
    u += Kn(n[0], r.width), l += Kn(n[1], r.height), h = null, f = null;
  else
    switch (n) {
      case "left":
        u -= i, l += s, h = "right", f = "middle";
        break;
      case "right":
        u += i + o, l += s, f = "middle";
        break;
      case "top":
        u += o / 2, l -= i, h = "center", f = "bottom";
        break;
      case "bottom":
        u += o / 2, l += a + i, h = "center";
        break;
      case "inside":
        u += o / 2, l += s, h = "center", f = "middle";
        break;
      case "insideLeft":
        u += i, l += s, f = "middle";
        break;
      case "insideRight":
        u += o - i, l += s, h = "right", f = "middle";
        break;
      case "insideTop":
        u += o / 2, l += i, h = "center";
        break;
      case "insideBottom":
        u += o / 2, l += a - i, h = "center", f = "bottom";
        break;
      case "insideTopLeft":
        u += i, l += i;
        break;
      case "insideTopRight":
        u += o - i, l += i, h = "right";
        break;
      case "insideBottomLeft":
        u += i, l += a - i, f = "bottom";
        break;
      case "insideBottomRight":
        u += o - i, l += a - i, h = "right", f = "bottom";
        break;
    }
  return e = e || {}, e.x = u, e.y = l, e.align = h, e.verticalAlign = f, e;
}
var ru = "__zr_normal__", nu = ls.concat(["ignore"]), Y_ = Ve(ls, function(e, t) {
  return e[t] = !0, e;
}, { ignore: !1 }), Sn = {}, W_ = new H(0, 0, 0, 0), Da = [], vo = 0, hs = 1, vs = function() {
  function e(t) {
    this.id = pf(), this.animators = [], this.currentStates = [], this.states = {}, this._init(t);
  }
  return e.prototype._init = function(t) {
    this.attr(t);
  }, e.prototype.drift = function(t, r, n) {
    switch (this.draggable) {
      case "horizontal":
        r = 0;
        break;
      case "vertical":
        t = 0;
        break;
    }
    var i = this.transform;
    i || (i = this.transform = [1, 0, 0, 1, 0, 0]), i[4] += t, i[5] += r, this.decomposeTransform(), this.markRedraw();
  }, e.prototype.beforeUpdate = function() {
  }, e.prototype.afterUpdate = function() {
  }, e.prototype.update = function() {
    this.updateTransform(), this.__dirty && this.updateInnerText();
  }, e.prototype.updateInnerText = function(t) {
    var r = this._textContent;
    if (r && (!r.ignore || t)) {
      this.textConfig || (this.textConfig = {});
      var n = this.textConfig, i = n.local, a = r.innerTransformable, o = void 0, s = void 0, u = !1;
      a.parent = i ? this : null;
      var l = !1;
      a.copyTransform(r);
      var h = n.position != null, f = n.autoOverflowArea, v = void 0;
      if ((f || h) && (v = W_, n.layoutRect ? v.copy(n.layoutRect) : v.copy(this.getBoundingRect()), i || v.applyTransform(this.transform)), h) {
        this.calculateTextPosition ? this.calculateTextPosition(Sn, n, v) : Hp(Sn, n, v), a.x = Sn.x, a.y = Sn.y, o = Sn.align, s = Sn.verticalAlign;
        var c = n.origin;
        if (c && n.rotation != null) {
          var d = void 0, y = void 0;
          c === "center" ? (d = v.width * 0.5, y = v.height * 0.5) : (d = Kn(c[0], v.width), y = Kn(c[1], v.height)), l = !0, a.originX = -a.x + d + (i ? 0 : v.x), a.originY = -a.y + y + (i ? 0 : v.y);
        }
      }
      n.rotation != null && (a.rotation = n.rotation);
      var p = n.offset;
      p && (a.x += p[0], a.y += p[1], l || (a.originX = -p[0], a.originY = -p[1]));
      var g = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {});
      if (f) {
        var m = g.overflowRect = g.overflowRect || new H(0, 0, 0, 0);
        a.getLocalTransform(Da), ni(Da, Da), H.copy(m, v), m.applyTransform(Da);
      } else
        g.overflowRect = null;
      var _ = n.inside == null ? typeof n.position == "string" && n.position.indexOf("inside") >= 0 : n.inside, S = void 0, w = void 0, b = void 0;
      _ && this.canBeInsideText() ? (S = n.insideFill, w = n.insideStroke, (S == null || S === "auto") && (S = this.getInsideTextFill()), (w == null || w === "auto") && (w = this.getInsideTextStroke(S), b = !0)) : (S = n.outsideFill, w = n.outsideStroke, (S == null || S === "auto") && (S = this.getOutsideFill()), (w == null || w === "auto") && (w = this.getOutsideStroke(S), b = !0)), S = S || "#000", (S !== g.fill || w !== g.stroke || b !== g.autoStroke || o !== g.align || s !== g.verticalAlign) && (u = !0, g.fill = S, g.stroke = w, g.autoStroke = b, g.align = o, g.verticalAlign = s, r.setDefaultTextStyle(g)), r.__dirty |= Wt, u && r.dirtyStyle(!0);
    }
  }, e.prototype.canBeInsideText = function() {
    return !0;
  }, e.prototype.getInsideTextFill = function() {
    return "#fff";
  }, e.prototype.getInsideTextStroke = function(t) {
    return "#000";
  }, e.prototype.getOutsideFill = function() {
    return this.__zr && this.__zr.isDarkMode() ? xl : Il;
  }, e.prototype.getOutsideStroke = function(t) {
    var r = this.__zr && this.__zr.getBackgroundColor(), n = typeof r == "string" && he(r);
    n || (n = [255, 255, 255, 1]);
    for (var i = n[3], a = this.__zr.isDarkMode(), o = 0; o < 3; o++)
      n[o] = n[o] * i + (a ? 0 : 255) * (1 - i);
    return n[3] = 1, dn(n, "rgba");
  }, e.prototype.traverse = function(t, r) {
  }, e.prototype.attrKV = function(t, r) {
    t === "textConfig" ? this.setTextConfig(r) : t === "textContent" ? this.setTextContent(r) : t === "clipPath" ? this.setClipPath(r) : t === "extra" ? (this.extra = this.extra || {}, A(this.extra, r)) : this[t] = r;
  }, e.prototype.hide = function() {
    this.ignore = !0, this.markRedraw();
  }, e.prototype.show = function() {
    this.ignore = !1, this.markRedraw();
  }, e.prototype.attr = function(t, r) {
    if (typeof t == "string")
      this.attrKV(t, r);
    else if (F(t))
      for (var n = t, i = ft(n), a = 0; a < i.length; a++) {
        var o = i[a];
        this.attrKV(o, t[o]);
      }
    return this.markRedraw(), this;
  }, e.prototype.saveCurrentToNormalState = function(t) {
    this._innerSaveToNormal(t);
    for (var r = this._normalState, n = 0; n < this.animators.length; n++) {
      var i = this.animators[n], a = i.__fromStateTransition;
      if (!(i.getLoop() || a && a !== ru)) {
        var o = i.targetName, s = o ? r[o] : r;
        i.saveTo(s);
      }
    }
  }, e.prototype._innerSaveToNormal = function(t) {
    var r = this._normalState;
    r || (r = this._normalState = {}), t.textConfig && !r.textConfig && (r.textConfig = this.textConfig), this._savePrimaryToNormal(t, r, nu);
  }, e.prototype._savePrimaryToNormal = function(t, r, n) {
    for (var i = 0; i < n.length; i++) {
      var a = n[i];
      t[a] != null && !(a in r) && (r[a] = this[a]);
    }
  }, e.prototype.hasState = function() {
    return this.currentStates.length > 0;
  }, e.prototype.getState = function(t) {
    return this.states[t];
  }, e.prototype.ensureState = function(t) {
    var r = this.states;
    return r[t] || (r[t] = {}), r[t];
  }, e.prototype.clearStates = function(t) {
    this.useState(ru, !1, t);
  }, e.prototype.useState = function(t, r, n, i) {
    var a = t === ru, o = this.hasState();
    if (!(!o && a)) {
      var s = this.currentStates, u = this.stateTransition;
      if (!(at(s, t) >= 0 && (r || s.length === 1))) {
        var l;
        if (this.stateProxy && !a && (l = this.stateProxy(t)), l || (l = this.states && this.states[t]), !l && !a) {
          as("State " + t + " not exists.");
          return;
        }
        a || this.saveCurrentToNormalState(l);
        var h = this._textContent, f = vv(this, h, l, i);
        f && !this.__inHover && (this.__inHover = f), this._applyStateObj(t, l, this._normalState, r, dv(this, n, u), u);
        var v = this._textGuide;
        return h && h.useState(t, r, n, !!f), v && v.useState(t, r, n, !!f), a ? (this.currentStates = [], this._normalState = {}) : r ? this.currentStates.push(t) : this.currentStates = [t], this._updateAnimationTargets(), this.markRedraw(), !f && this.__inHover && (this.__inHover = vo, this.__dirty &= ~Wt), l;
      }
    }
  }, e.prototype.useStates = function(t, r, n) {
    if (!t.length)
      this.clearStates();
    else {
      var i = [], a = this.currentStates, o = t.length, s = o === a.length;
      if (s) {
        for (var u = 0; u < o; u++)
          if (t[u] !== a[u]) {
            s = !1;
            break;
          }
      }
      if (s)
        return;
      for (var u = 0; u < o; u++) {
        var l = t[u], h = void 0;
        this.stateProxy && (h = this.stateProxy(l, t)), h || (h = this.states[l]), h && i.push(h);
      }
      var f = i[o - 1], v = this._textContent, c = vv(this, v, f, n);
      c && !this.__inHover && (this.__inHover = c);
      var d = this._mergeStates(i), y = this.stateTransition;
      this.saveCurrentToNormalState(d), this._applyStateObj(t.join(","), d, this._normalState, !1, dv(this, r, y), y);
      var p = this._textGuide;
      v && v.useStates(t, r, !!c), p && p.useStates(t, r, !!c), this._updateAnimationTargets(), this.currentStates = t.slice(), this.markRedraw(), !c && this.__inHover && (this.__inHover = vo, this.__dirty &= ~Wt);
    }
  }, e.prototype.isSilent = function() {
    for (var t = this; t; ) {
      if (t.silent)
        return !0;
      var r = t.__hostTarget;
      t = r ? t.ignoreHostSilent ? null : r : t.parent;
    }
    return !1;
  }, e.prototype._updateAnimationTargets = function() {
    for (var t = 0; t < this.animators.length; t++) {
      var r = this.animators[t];
      r.targetName && r.changeTarget(this[r.targetName]);
    }
  }, e.prototype.removeState = function(t) {
    var r = at(this.currentStates, t);
    if (r >= 0) {
      var n = this.currentStates.slice();
      n.splice(r, 1), this.useStates(n);
    }
  }, e.prototype.replaceState = function(t, r, n) {
    var i = this.currentStates.slice(), a = at(i, t), o = at(i, r) >= 0;
    a >= 0 ? o ? i.splice(a, 1) : i[a] = r : n && !o && i.push(r), this.useStates(i);
  }, e.prototype.toggleState = function(t, r) {
    r ? this.useState(t, !0) : this.removeState(t);
  }, e.prototype._mergeStates = function(t) {
    for (var r = {}, n, i = 0; i < t.length; i++) {
      var a = t[i];
      A(r, a), a.textConfig && (n = n || {}, A(n, a.textConfig));
    }
    return n && (r.textConfig = n), r;
  }, e.prototype._applyStateObj = function(t, r, n, i, a, o) {
    if (this.__inHover !== hs) {
      var s = !(r && i);
      r && r.textConfig ? (this.textConfig = A({}, i ? this.textConfig : n.textConfig), A(this.textConfig, r.textConfig)) : s && n.textConfig && (this.textConfig = n.textConfig);
      for (var u = {}, l = !1, h = 0; h < nu.length; h++) {
        var f = nu[h], v = a && Y_[f];
        r && r[f] != null ? v ? (l = !0, u[f] = r[f]) : this[f] = r[f] : s && n[f] != null && (v ? (l = !0, u[f] = n[f]) : this[f] = n[f]);
      }
      if (!a)
        for (var h = 0; h < this.animators.length; h++) {
          var c = this.animators[h], d = c.targetName;
          c.getLoop() || c.__changeFinalValue(d ? (r || n)[d] : r || n);
        }
      l && this._transitionState(t, u, o);
    }
  }, e.prototype._attachComponent = function(t) {
    if (!(t.__zr && !t.__hostTarget) && t !== this) {
      var r = this.__zr;
      r && t.addSelfToZr(r), t.__zr = r, t.__hostTarget = this;
    }
  }, e.prototype._detachComponent = function(t) {
    t.__zr && t.removeSelfFromZr(t.__zr), t.__zr = null, t.__hostTarget = null;
  }, e.prototype.getClipPath = function() {
    return this._clipPath;
  }, e.prototype.setClipPath = function(t) {
    this._clipPath && this._clipPath !== t && this.removeClipPath(), this._attachComponent(t), this._clipPath = t, this.markRedraw();
  }, e.prototype.removeClipPath = function() {
    var t = this._clipPath;
    t && (this._detachComponent(t), this._clipPath = null, this.markRedraw());
  }, e.prototype.getTextContent = function() {
    return this._textContent;
  }, e.prototype.setTextContent = function(t) {
    var r = this._textContent;
    r !== t && (r && r !== t && this.removeTextContent(), t.innerTransformable = new ii(), this._attachComponent(t), this._textContent = t, this.markRedraw());
  }, e.prototype.setTextConfig = function(t) {
    this.textConfig || (this.textConfig = {}), A(this.textConfig, t), this.markRedraw();
  }, e.prototype.removeTextConfig = function() {
    this.textConfig = null, this.markRedraw();
  }, e.prototype.removeTextContent = function() {
    var t = this._textContent;
    t && (t.innerTransformable = null, this._detachComponent(t), this._textContent = null, this._innerTextDefaultStyle = null, this.markRedraw());
  }, e.prototype.getTextGuideLine = function() {
    return this._textGuide;
  }, e.prototype.setTextGuideLine = function(t) {
    this._textGuide && this._textGuide !== t && this.removeTextGuideLine(), this._attachComponent(t), this._textGuide = t, this.markRedraw();
  }, e.prototype.removeTextGuideLine = function() {
    var t = this._textGuide;
    t && (this._detachComponent(t), this._textGuide = null, this.markRedraw());
  }, e.prototype.markRedraw = function() {
    this.__dirty |= Wt;
    var t = this.__zr;
    t && (this.__inHover ? t.refreshHover() : t.refresh()), this.__hostTarget && this.__hostTarget.markRedraw();
  }, e.prototype.dirty = function() {
    this.markRedraw();
  }, e.prototype.addSelfToZr = function(t) {
    if (this.__zr !== t) {
      this.__zr = t;
      var r = this.animators;
      if (r)
        for (var n = 0; n < r.length; n++)
          t.animation.addAnimator(r[n]);
      this._clipPath && this._clipPath.addSelfToZr(t), this._textContent && this._textContent.addSelfToZr(t), this._textGuide && this._textGuide.addSelfToZr(t);
    }
  }, e.prototype.removeSelfFromZr = function(t) {
    if (this.__zr) {
      this.__zr = null;
      var r = this.animators;
      if (r)
        for (var n = 0; n < r.length; n++)
          t.animation.removeAnimator(r[n]);
      this._clipPath && this._clipPath.removeSelfFromZr(t), this._textContent && this._textContent.removeSelfFromZr(t), this._textGuide && this._textGuide.removeSelfFromZr(t);
    }
  }, e.prototype.animate = function(t, r, n) {
    var i = t ? this[t] : this, a = new Sf(i, r, n);
    return t && (a.targetName = t), this.addAnimator(a, t), a;
  }, e.prototype.addAnimator = function(t, r) {
    var n = this.__zr, i = this;
    t.during(function() {
      i.updateDuringAnimation(r);
    }).done(function() {
      var a = i.animators, o = at(a, t);
      o >= 0 && a.splice(o, 1);
    }), this.animators.push(t), n && n.animation.addAnimator(t), n && n.wakeUp();
  }, e.prototype.updateDuringAnimation = function(t) {
    this.markRedraw();
  }, e.prototype.stopAnimation = function(t, r) {
    for (var n = this.animators, i = n.length, a = [], o = 0; o < i; o++) {
      var s = n[o];
      !t || t === s.scope ? s.stop(r) : a.push(s);
    }
    return this.animators = a, this;
  }, e.prototype.animateTo = function(t, r, n) {
    iu(this, t, r, n);
  }, e.prototype.animateFrom = function(t, r, n) {
    iu(this, t, r, n, !0);
  }, e.prototype._transitionState = function(t, r, n, i) {
    for (var a = iu(this, r, n, i), o = 0; o < a.length; o++)
      a[o].__fromStateTransition = t;
  }, e.prototype.getBoundingRect = function() {
    return null;
  }, e.prototype.getPaintRect = function() {
    return null;
  }, e.initDefaultProps = function() {
    var t = e.prototype;
    t.type = "element", t.name = "", t.ignore = t.silent = t.ignoreHostSilent = t.isGroup = t.draggable = t.dragging = t.ignoreClip = !1, t.__inHover = vo, t.__dirty = Wt;
    function r(n, i, a, o) {
      Object.defineProperty(t, n, {
        get: function() {
          if (!this[i]) {
            var u = this[i] = [];
            s(this, u);
          }
          return this[i];
        },
        set: function(u) {
          this[a] = u[0], this[o] = u[1], this[i] = u, s(this, u);
        }
      });
      function s(u, l) {
        Object.defineProperty(l, 0, {
          get: function() {
            return u[a];
          },
          set: function(h) {
            u[a] = h;
          }
        }), Object.defineProperty(l, 1, {
          get: function() {
            return u[o];
          },
          set: function(h) {
            u[o] = h;
          }
        });
      }
    }
    Object.defineProperty && (r("position", "_legacyPos", "x", "y"), r("scale", "_legacyScale", "scaleX", "scaleY"), r("origin", "_legacyOrigin", "originX", "originY"));
  }(), e;
}();
ee(vs, Te);
ee(vs, ii);
function iu(e, t, r, n, i) {
  r = r || {};
  var a = [];
  Gp(e, "", e, t, r, n, a, i);
  var o = a.length, s = !1, u = r.done, l = r.aborted, h = function() {
    s = !0, o--, o <= 0 && (s ? u && u() : l && l());
  }, f = function() {
    o--, o <= 0 && (s ? u && u() : l && l());
  };
  o || u && u(), a.length > 0 && r.during && a[0].during(function(d, y) {
    r.during(y);
  });
  for (var v = 0; v < a.length; v++) {
    var c = a[v];
    h && c.done(h), f && c.aborted(f), r.force && c.duration(r.duration), c.start(r.easing);
  }
  return a;
}
function au(e, t, r) {
  for (var n = 0; n < r; n++)
    e[n] = t[n];
}
function X_(e) {
  return $t(e[0]);
}
function $_(e, t, r) {
  if ($t(t[r]))
    if ($t(e[r]) || (e[r] = []), Vt(t[r])) {
      var n = t[r].length;
      e[r].length !== n && (e[r] = new t[r].constructor(n), au(e[r], t[r], n));
    } else {
      var i = t[r], a = e[r], o = i.length;
      if (X_(i))
        for (var s = i[0].length, u = 0; u < o; u++)
          a[u] ? au(a[u], i[u], s) : a[u] = Array.prototype.slice.call(i[u]);
      else
        au(a, i, o);
      a.length = i.length;
    }
  else
    e[r] = t[r];
}
function Z_(e, t) {
  return e === t || $t(e) && $t(t) && q_(e, t);
}
function q_(e, t) {
  var r = e.length;
  if (r !== t.length)
    return !1;
  for (var n = 0; n < r; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function Gp(e, t, r, n, i, a, o, s) {
  for (var u = ft(n), l = i.duration, h = i.delay, f = i.additive, v = i.setToFinal, c = !F(a), d = e.animators, y = [], p = 0; p < u.length; p++) {
    var g = u[p], m = n[g];
    if (m != null && r[g] != null && (c || a[g]))
      if (F(m) && !$t(m) && !fa(m)) {
        if (t) {
          s || (r[g] = m, e.updateDuringAnimation(t));
          continue;
        }
        Gp(e, g, r[g], m, i, a && a[g], o, s);
      } else
        y.push(g);
    else s || (r[g] = m, e.updateDuringAnimation(t), y.push(g));
  }
  var _ = y.length;
  if (!f && _)
    for (var S = 0; S < d.length; S++) {
      var w = d[S];
      if (w.targetName === t) {
        var b = w.stopTracks(y);
        if (b) {
          var M = at(d, w);
          d.splice(M, 1);
        }
      }
    }
  if (i.force || (y = It(y, function(x) {
    return !Z_(n[x], r[x]);
  }), _ = y.length), _ > 0 || i.force && !o.length) {
    var C = void 0, T = void 0, I = void 0;
    if (s) {
      T = {}, v && (C = {});
      for (var S = 0; S < _; S++) {
        var g = y[S];
        T[g] = r[g], v ? C[g] = n[g] : r[g] = n[g];
      }
    } else if (v) {
      I = {};
      for (var S = 0; S < _; S++) {
        var g = y[S];
        I[g] = uo(r[g]), $_(r, n, g);
      }
    }
    var w = new Sf(r, !1, !1, f ? It(d, function(E) {
      return E.targetName === t;
    }) : null);
    w.targetName = t, i.scope && (w.scope = i.scope), v && C && w.whenWithKeys(0, C, y), I && w.whenWithKeys(0, I, y), w.whenWithKeys(l == null ? 500 : l, s ? T : n, y).delay(h || 0), e.addAnimator(w, t), o.push(w);
  }
}
function vv(e, t, r, n) {
  return !(r && r.hoverLayer || n) || cv(e) || t && cv(t) ? vo : hs;
}
function cv(e) {
  return e.type === "text" || e.type === "tspan";
}
function dv(e, t, r) {
  return !t && !e.__inHover && r && r.duration > 0;
}
var Xt = function(e) {
  B(t, e);
  function t(r) {
    var n = e.call(this) || this;
    return n.isGroup = !0, n._children = [], n.attr(r), n;
  }
  return t.prototype.childrenRef = function() {
    return this._children;
  }, t.prototype.children = function() {
    return this._children.slice();
  }, t.prototype.childAt = function(r) {
    return this._children[r];
  }, t.prototype.childOfName = function(r) {
    for (var n = this._children, i = 0; i < n.length; i++)
      if (n[i].name === r)
        return n[i];
  }, t.prototype.childCount = function() {
    return this._children.length;
  }, t.prototype.add = function(r) {
    return r && r !== this && r.parent !== this && (this._children.push(r), this._doAdd(r)), this;
  }, t.prototype.addBefore = function(r, n) {
    if (r && r !== this && r.parent !== this && n && n.parent === this) {
      var i = this._children, a = i.indexOf(n);
      a >= 0 && (i.splice(a, 0, r), this._doAdd(r));
    }
    return this;
  }, t.prototype.replace = function(r, n) {
    var i = at(this._children, r);
    return i >= 0 && this.replaceAt(n, i), this;
  }, t.prototype.replaceAt = function(r, n) {
    var i = this._children, a = i[n];
    if (r && r !== this && r.parent !== this && r !== a) {
      i[n] = r, a.parent = null;
      var o = this.__zr;
      o && a.removeSelfFromZr(o), this._doAdd(r);
    }
    return this;
  }, t.prototype._doAdd = function(r) {
    r.parent && r.parent.remove(r), r.parent = this;
    var n = this.__zr;
    n && n !== r.__zr && r.addSelfToZr(n), n && n.refresh();
  }, t.prototype.remove = function(r) {
    var n = this.__zr, i = this._children, a = at(i, r);
    return a < 0 ? this : (i.splice(a, 1), r.parent = null, n && r.removeSelfFromZr(n), n && n.refresh(), this);
  }, t.prototype.removeAll = function() {
    for (var r = this._children, n = this.__zr, i = 0; i < r.length; i++) {
      var a = r[i];
      n && a.removeSelfFromZr(n), a.parent = null;
    }
    return r.length = 0, this;
  }, t.prototype.eachChild = function(r, n) {
    for (var i = this._children, a = 0; a < i.length; a++) {
      var o = i[a];
      r.call(n, o, a);
    }
    return this;
  }, t.prototype.traverse = function(r, n) {
    for (var i = 0; i < this._children.length; i++) {
      var a = this._children[i], o = r.call(n, a);
      a.isGroup && !o && a.traverse(r, n);
    }
    return this;
  }, t.prototype.addSelfToZr = function(r) {
    e.prototype.addSelfToZr.call(this, r);
    for (var n = 0; n < this._children.length; n++) {
      var i = this._children[n];
      i.addSelfToZr(r);
    }
  }, t.prototype.removeSelfFromZr = function(r) {
    e.prototype.removeSelfFromZr.call(this, r);
    for (var n = 0; n < this._children.length; n++) {
      var i = this._children[n];
      i.removeSelfFromZr(r);
    }
  }, t.prototype.getBoundingRect = function(r) {
    for (var n = new H(0, 0, 0, 0), i = r || this._children, a = [], o = null, s = 0; s < i.length; s++) {
      var u = i[s];
      if (!(u.ignore || u.invisible)) {
        var l = u.getBoundingRect(), h = u.getLocalTransform(a);
        h ? (H.applyTransform(n, l, h), o = o || n.clone(), o.union(n)) : (o = o || l.clone(), o.union(l));
      }
    }
    return o || n;
  }, t;
}(vs);
Xt.prototype.type = "group";
/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE
*/
var co = {}, Jr = {};
function K_(e) {
  delete Jr[e];
}
function Q_(e) {
  if (!e)
    return !1;
  if (typeof e == "string")
    return Ki(e, 1) < Dl;
  if (e.colorStops) {
    for (var t = e.colorStops, r = 0, n = t.length, i = 0; i < n; i++)
      r += Ki(t[i].color, 1);
    return r /= n, r < Dl;
  }
  return !1;
}
var J_ = function() {
  function e(t, r, n) {
    var i = this;
    this._sleepAfterStill = 10, this._stillFrameAccum = 0, this._needsRefresh = !0, this._needsRefreshHover = !1, this._darkMode = !1, n = n || {}, this.dom = r, this.id = t;
    var a = new l_(), o = n.renderer || "canvas";
    co[o] || (o = ft(co)[0]), n.useDirtyRect = n.useDirtyRect == null ? !1 : n.useDirtyRect;
    var s = new co[o](r, a, n, t), u = n.ssr || s.ssrOnly;
    this.storage = a, this.painter = s;
    var l = !tt.node && !tt.worker && !u ? new V_(s.getViewportRoot(), s.root) : null, h = n.useCoarsePointer, f = h == null || h === "auto" ? tt.touchEventsSupported : !!h, v = 44, c;
    f && (c = W(n.pointerSize, v)), this.handler = new Cp(a, s, l, s.root, c), this.animation = new A_({
      stage: {
        update: u ? null : function() {
          return i._flush(!1);
        }
      }
    }), u || this.animation.start();
  }
  return e.prototype.add = function(t) {
    this._disposed || !t || (this.storage.addRoot(t), t.addSelfToZr(this), this.refresh());
  }, e.prototype.remove = function(t) {
    this._disposed || !t || (this.storage.delRoot(t), t.removeSelfFromZr(this), this.refresh());
  }, e.prototype.configLayer = function(t, r) {
    this._disposed || (this.painter.configLayer && this.painter.configLayer(t, r), this.refresh());
  }, e.prototype.setBackgroundColor = function(t) {
    this._disposed || (this.painter.setBackgroundColor && this.painter.setBackgroundColor(t), this.refresh(), this._backgroundColor = t, this._darkMode = Q_(t));
  }, e.prototype.getBackgroundColor = function() {
    return this._backgroundColor;
  }, e.prototype.setDarkMode = function(t) {
    this._darkMode = t;
  }, e.prototype.isDarkMode = function() {
    return this._darkMode;
  }, e.prototype.refreshImmediately = function(t) {
    this._disposed || this._refresh({
      animUpdate: !t,
      refresh: !0,
      refreshHover: !1
    });
  }, e.prototype._refresh = function(t) {
    t.animUpdate && this.animation.update(!0), this._needsRefresh = this._needsRefreshHover = !1, this.painter.refresh({
      refresh: t.refresh,
      refreshHover: t.refreshHover
    }), this._needsRefresh = this._needsRefreshHover = !1;
  }, e.prototype.refresh = function() {
    this._disposed || (this._needsRefresh = !0, this.animation.start());
  }, e.prototype.flush = function() {
    this._disposed || this._flush(!0);
  }, e.prototype._flush = function(t) {
    var r, n = Bn(), i = this._needsRefresh, a = this._needsRefreshHover;
    (i || a) && (r = !0, this._refresh({
      animUpdate: t,
      refresh: i,
      refreshHover: a
    }));
    var o = Bn();
    r ? (this._stillFrameAccum = 0, this.trigger("rendered", {
      elapsedTime: o - n
    })) : this._sleepAfterStill > 0 && (this._stillFrameAccum++, this._stillFrameAccum > this._sleepAfterStill && this.animation.stop());
  }, e.prototype.setSleepAfterStill = function(t) {
    this._sleepAfterStill = t;
  }, e.prototype.wakeUp = function() {
    this._disposed || (this.animation.start(), this._stillFrameAccum = 0);
  }, e.prototype.refreshHover = function() {
    this._needsRefreshHover = !0;
  }, e.prototype.refreshHoverImmediately = function() {
    this._disposed || this._refresh({
      animUpdate: !1,
      refresh: !1,
      refreshHover: !0
    });
  }, e.prototype.resize = function(t) {
    this._disposed || (t = t || {}, this.painter.resize(t.width, t.height), this.handler.resize());
  }, e.prototype.clearAnimation = function() {
    this._disposed || this.animation.clear();
  }, e.prototype.getWidth = function() {
    if (!this._disposed)
      return this.painter.getWidth();
  }, e.prototype.getHeight = function() {
    if (!this._disposed)
      return this.painter.getHeight();
  }, e.prototype.setCursorStyle = function(t) {
    this._disposed || this.handler.setCursorStyle(t);
  }, e.prototype.findHover = function(t, r) {
    if (!this._disposed)
      return this.handler.findHover(t, r);
  }, e.prototype.on = function(t, r, n) {
    return this._disposed || this.handler.on(t, r, n), this;
  }, e.prototype.off = function(t, r) {
    this._disposed || this.handler.off(t, r);
  }, e.prototype.trigger = function(t, r) {
    this._disposed || this.handler.trigger(t, r);
  }, e.prototype.clear = function() {
    if (!this._disposed) {
      for (var t = this.storage.getRoots(), r = 0; r < t.length; r++)
        t[r] instanceof Xt && t[r].removeSelfFromZr(this);
      this.storage.delAllRoots(), this.painter.clear();
    }
  }, e.prototype.dispose = function() {
    this._disposed || (this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.storage = this.painter = this.handler = null, this._disposed = !0, K_(this.id));
  }, e;
}();
function Ll(e, t) {
  var r = new J_(pf(), e, t);
  return Jr[r.id] = r, r;
}
function j_(e) {
  e.dispose();
}
function t1() {
  for (var e in Jr)
    Jr.hasOwnProperty(e) && Jr[e].dispose();
  Jr = {};
}
function e1(e) {
  return Jr[e];
}
function Up(e, t) {
  co[e] = t;
}
var El;
function r1(e) {
  if (typeof El == "function")
    return El(e);
}
function Yp(e) {
  El = e;
}
var n1 = "6.1.0";
const i1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dispose: j_,
  disposeAll: t1,
  getElementSSRData: r1,
  getInstance: e1,
  init: Ll,
  registerPainter: Up,
  registerSSRDataGetter: Yp,
  version: n1
}, Symbol.toStringTag, { value: "Module" }));
var pv = 1e-4, Bo = 20;
function a1(e) {
  return e.replace(/^\s+|\s+$/g, "");
}
var _r = Math.min, Zt = Math.max, cs = Math.abs, Sr = Math.round, pn = Math.floor, wf = Math.ceil, ai = Math.pow, Qi = Math.log, Rl = Math.LN10, o1 = Math.PI, s1 = Math.random;
function Ji(e, t, r, n) {
  var i = t[0], a = t[1], o = r[0], s = r[1], u = a - i, l = s - o;
  if (u === 0)
    return l === 0 ? o : (o + s) / 2;
  if (n)
    if (u > 0) {
      if (e <= i)
        return o;
      if (e >= a)
        return s;
    } else {
      if (e >= i)
        return o;
      if (e <= a)
        return s;
    }
  else {
    if (e === i)
      return o;
    if (e === a)
      return s;
  }
  return (e - i) / u * l + o;
}
var jt = u1;
function u1(e, t, r) {
  switch (e) {
    case "center":
    case "middle":
      e = "50%";
      break;
    case "left":
    case "top":
      e = "0%";
      break;
    case "right":
    case "bottom":
      e = "100%";
      break;
  }
  return l1(e, t, r);
}
function l1(e, t, r) {
  return G(e) ? Wp(e) ? parseFloat(e) / 100 * t + (r || 0) : parseFloat(e) : e == null ? NaN : +e;
}
function f1(e) {
  return G(e) && Wp(e);
}
function Wp(e) {
  return !!a1(e).match(/%$/);
}
function xt(e, t, r) {
  return isNaN(t) ? r ? "" + e : +e : (t = _r(Zt(0, t), Bo), e = (+e).toFixed(t), r ? e : +e);
}
function h1(e, t, r) {
  return t == null && (t = 10), xt(e, t, r);
}
function bf(e) {
  return e.sort(function(t, r) {
    return t - r;
  }), e;
}
function ji(e) {
  if (e = +e, isNaN(e))
    return 0;
  if (e > 1e-14) {
    for (var t = 1, r = 0; r < 15; r++, t *= 10)
      if (Sr(e * t) / t === e)
        return r;
  }
  return Xp(e);
}
function Xp(e) {
  var t = e.toString().toLowerCase(), r = t.indexOf("e"), n = r > 0 ? +t.slice(r + 1) : 0, i = r > 0 ? r : t.length, a = t.indexOf("."), o = a < 0 ? 0 : i - 1 - a;
  return Zt(0, o - n);
}
function v1(e, t) {
  var r = pn(Qi(e[1] - e[0]) / Rl), n = Sr(Qi(cs(t[1] - t[0])) / Rl), i = _r(Zt(-r + n, 0), Bo);
  return isFinite(i) ? i : Bo;
}
function c1(e, t, r) {
  if (!e[t])
    return 0;
  var n = d1(e, r);
  return n[t] || 0;
}
function d1(e, t) {
  var r = Ve(e, function(c, d) {
    return c + (isNaN(d) ? 0 : d);
  }, 0);
  if (r === 0)
    return [];
  for (var n = ai(10, t), i = z(e, function(c) {
    return (isNaN(c) ? 0 : c) / r * n * 100;
  }), a = n * 100, o = z(i, function(c) {
    return pn(c);
  }), s = Ve(o, function(c, d) {
    return c + d;
  }, 0), u = z(i, function(c, d) {
    return c - o[d];
  }); s < a; ) {
    for (var l = Number.NEGATIVE_INFINITY, h = null, f = 0, v = u.length; f < v; ++f)
      u[f] > l && (l = u[f], h = f);
    ++o[h], u[h] = 0, ++s;
  }
  return z(o, function(c) {
    return c / n;
  });
}
function p1(e, t) {
  var r = Zt(ji(e), ji(t)), n = e + t;
  return r > Bo ? n : xt(n, r);
}
var g1 = ai(2, 53) - 1;
function y1(e) {
  var t = o1 * 2;
  return (e % t + t) % t;
}
function m1(e) {
  return e > -pv && e < pv;
}
var _1 = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function Cr(e) {
  if (e instanceof Date)
    return e;
  if (G(e)) {
    var t = _1.exec(e);
    if (!t)
      return /* @__PURE__ */ new Date(NaN);
    if (t[8]) {
      var r = +t[4] || 0;
      return t[8].toUpperCase() !== "Z" && (r -= +t[8].slice(0, 3)), new Date(Date.UTC(+t[1], +(t[2] || 1) - 1, +t[3] || 1, r, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0));
    } else
      return new Date(+t[1], +(t[2] || 1) - 1, +t[3] || 1, +t[4] || 0, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0);
  } else if (e == null)
    return /* @__PURE__ */ new Date(NaN);
  return new Date(Sr(e));
}
function $p(e) {
  return ai(10, Tf(e));
}
function Tf(e) {
  if (e === 0)
    return 0;
  var t = pn(Qi(e) / Rl);
  return e / ai(10, t) >= 10 && t++, t;
}
var S1 = 2;
function Cf(e, t) {
  var r = Tf(e), n = ai(10, r), i = e / n, a;
  return t === S1 ? a = 1 : t ? i < 1.5 ? a = 1 : i < 2.5 ? a = 2 : i < 4 ? a = 3 : i < 7 ? a = 5 : a = 10 : i < 1 ? a = 1 : i < 2 ? a = 2 : i < 3 ? a = 3 : i < 5 ? a = 5 : a = 10, e = a * n, xt(e, -r);
}
function w1(e, t) {
  var r = (e.length - 1) * t + 1, n = pn(r), i = +e[n - 1], a = r - n;
  return a ? i + a * (e[n] - i) : i;
}
function b1(e) {
  e.sort(function(u, l) {
    return s(u, l, 0) ? -1 : 1;
  });
  for (var t = -1 / 0, r = 1, n = 0; n < e.length; ) {
    for (var i = e[n].interval, a = e[n].close, o = 0; o < 2; o++)
      i[o] <= t && (i[o] = t, a[o] = o ? 1 : 1 - r), t = i[o], r = a[o];
    i[0] === i[1] && a[0] * a[1] !== 1 ? e.splice(n, 1) : n++;
  }
  return e;
  function s(u, l, h) {
    return u.interval[h] < l.interval[h] || u.interval[h] === l.interval[h] && (u.close[h] - l.close[h] === (h ? -1 : 1) || !h && s(u, l, 1));
  }
}
function Zp(e) {
  var t = parseFloat(e);
  return t == e && (t !== 0 || !G(e) || e.indexOf("x") <= 0) ? t : NaN;
}
function qp(e) {
  return !isNaN(Zp(e));
}
function T1() {
  return Sr(s1() * 9);
}
function Kp(e, t) {
  return t === 0 ? e : Kp(t, e % t);
}
function gv(e, t) {
  return e == null ? t : t == null ? e : e * t / Kp(e, t);
}
function hn(e) {
  return e != null && isFinite(e);
}
var C1 = "[ECharts] ", M1 = typeof console != "undefined" && console.warn && console.log;
function D1(e, t, r) {
  M1 && console[e](C1 + t);
}
function Qp(e, t) {
  D1("error", e);
}
function te(e) {
  throw new Error(e);
}
var Jp = "series\0", I1 = "\0_ec_\0";
function zt(e) {
  return e instanceof Array ? e : e == null ? [] : [e];
}
function Pl(e, t, r) {
  if (e) {
    e[t] = e[t] || {}, e.emphasis = e.emphasis || {}, e.emphasis[t] = e.emphasis[t] || {};
    for (var n = 0, i = r.length; n < i; n++) {
      var a = r[n];
      !e.emphasis[t].hasOwnProperty(a) && e[t].hasOwnProperty(a) && (e.emphasis[t][a] = e[t][a]);
    }
  }
}
var yv = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"];
function va(e) {
  return F(e) && !N(e) && !(e instanceof Date) ? e.value : e;
}
function x1(e) {
  return F(e) && !(e instanceof Array);
}
function L1(e, t, r) {
  var n = r === "normalMerge", i = r === "replaceMerge", a = r === "replaceAll";
  e = e || [], t = (t || []).slice();
  var o = V();
  D(t, function(u, l) {
    if (!F(u)) {
      t[l] = null;
      return;
    }
  });
  var s = E1(e, o, r);
  return (n || i) && R1(s, e, o, t), n && P1(s, t), n || i ? A1(s, t, i) : a && O1(s, t), k1(s), s;
}
function E1(e, t, r) {
  var n = [];
  if (r === "replaceAll")
    return n;
  for (var i = 0; i < e.length; i++) {
    var a = e[i];
    a && a.id != null && t.set(a.id, i), n.push({
      existing: r === "replaceMerge" || ta(a) ? null : a,
      newOption: null,
      keyInfo: null,
      brandNew: null
    });
  }
  return n;
}
function R1(e, t, r, n) {
  D(n, function(i, a) {
    if (!(!i || i.id == null)) {
      var o = zi(i.id), s = r.get(o);
      if (s != null) {
        var u = e[s];
        He(!u.newOption, 'Duplicated option on id "' + o + '".'), u.newOption = i, u.existing = t[s], n[a] = null;
      }
    }
  });
}
function P1(e, t) {
  D(t, function(r, n) {
    if (!(!r || r.name == null))
      for (var i = 0; i < e.length; i++) {
        var a = e[i].existing;
        if (!e[i].newOption && a && (a.id == null || r.id == null) && !ta(r) && !ta(a) && jp("name", a, r)) {
          e[i].newOption = r, t[n] = null;
          return;
        }
      }
  });
}
function A1(e, t, r) {
  D(t, function(n) {
    if (n) {
      for (
        var i, a = 0;
        // Be `!resultItem` only when `nextIdx >= result.length`.
        (i = e[a]) && (i.newOption || ta(i.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
        i.existing && n.id != null && !jp("id", n, i.existing));
      )
        a++;
      i ? (i.newOption = n, i.brandNew = r) : e.push({
        newOption: n,
        brandNew: r,
        existing: null,
        keyInfo: null
      }), a++;
    }
  });
}
function O1(e, t) {
  D(t, function(r) {
    e.push({
      newOption: r,
      brandNew: !0,
      existing: null,
      keyInfo: null
    });
  });
}
function k1(e) {
  var t = V();
  D(e, function(r) {
    var n = r.existing;
    n && t.set(n.id, r);
  }), D(e, function(r) {
    var n = r.newOption;
    He(!n || n.id == null || !t.get(n.id) || t.get(n.id) === r, "id duplicates: " + (n && n.id)), n && n.id != null && t.set(n.id, r), !r.keyInfo && (r.keyInfo = {});
  }), D(e, function(r, n) {
    var i = r.existing, a = r.newOption, o = r.keyInfo;
    if (F(a)) {
      if (o.name = a.name != null ? zi(a.name) : i ? i.name : Jp + n, i)
        o.id = zi(i.id);
      else if (a.id != null)
        o.id = zi(a.id);
      else {
        var s = 0;
        do
          o.id = "\0" + o.name + "\0" + s++;
        while (t.get(o.id));
      }
      t.set(o.id, r);
    }
  });
}
function jp(e, t, r) {
  var n = Se(t[e], null), i = Se(r[e], null);
  return n != null && i != null && n === i;
}
function zi(e) {
  return Se(e, "");
}
function Se(e, t) {
  return e == null ? t : G(e) ? e : pt(e) || fp(e) ? e + "" : t;
}
function tg(e) {
  var t = e.name;
  return !!(t && t.indexOf(Jp));
}
function ta(e) {
  return e && e.id != null && zi(e.id).indexOf(I1) === 0;
}
function N1(e, t, r) {
  D(e, function(n) {
    var i = n.newOption;
    F(i) && (n.keyInfo.mainType = t, n.keyInfo.subType = B1(t, i, n.existing, r));
  });
}
function B1(e, t, r, n) {
  var i = t.type ? t.type : r ? r.subType : n.determineSubType(e, t);
  return i;
}
function ds(e, t) {
  if (t.dataIndexInside != null)
    return t.dataIndexInside;
  if (t.dataIndex != null)
    return N(t.dataIndex) ? z(t.dataIndex, function(r) {
      return e.indexOfRawIndex(r);
    }) : e.indexOfRawIndex(t.dataIndex);
  if (t.name != null)
    return N(t.name) ? z(t.name, function(r) {
      return e.indexOfName(r);
    }) : e.indexOfName(t.name);
}
function ut() {
  var e = "__ec_inner_" + F1++;
  return function(t) {
    return t[e] || (t[e] = {});
  };
}
var F1 = T1();
function ou(e, t, r) {
  var n = eg(t, r), i = n.mainTypeSpecified, a = n.queryOptionMap, o = n.others, s = o, u = r ? r.defaultMainType : null;
  return !i && u && a.set(u, {}), a.each(function(l, h) {
    var f = ps(e, h, l, {
      useDefault: u === h,
      enableAll: r && r.enableAll != null ? r.enableAll : !0,
      enableNone: r && r.enableNone != null ? r.enableNone : !0
    });
    s[h + "Models"] = f.models, s[h + "Model"] = f.models[0];
  }), s;
}
function eg(e, t) {
  var r;
  if (G(e)) {
    var n = {};
    n[e + "Index"] = 0, r = n;
  } else
    r = e;
  var i = V(), a = {}, o = !1;
  return D(r, function(s, u) {
    if (u === "dataIndex" || u === "dataIndexInside") {
      a[u] = s;
      return;
    }
    var l = u.match(/^(\w+)(Index|Id|Name)$/) || [], h = l[1], f = (l[2] || "").toLowerCase();
    if (!(!h || !f || t && t.includeMainTypes && at(t.includeMainTypes, h) < 0)) {
      o = o || !!h;
      var v = i.get(h) || i.set(h, {});
      v[f] = s;
    }
  }), {
    mainTypeSpecified: o,
    queryOptionMap: i,
    others: a
  };
}
var sr = {
  useDefault: !0,
  enableAll: !1,
  enableNone: !1
};
function ps(e, t, r, n) {
  n = n || sr;
  var i = r.index, a = r.id, o = r.name, s = {
    models: null,
    specified: i != null || a != null || o != null
  };
  if (!s.specified) {
    var u = void 0;
    return s.models = n.useDefault && (u = e.getComponent(t)) ? [u] : [], s;
  }
  if (i === "none" || i === !1) {
    if (n.enableNone)
      return s.models = [], s;
    i = -1;
  }
  return i === "all" && (n.enableAll ? i = a = o = null : i = -1), s.models = e.queryComponents({
    mainType: t,
    index: i,
    id: a,
    name: o
  }), s;
}
function rg(e, t, r) {
  var n = {};
  n[t + "Id"] = e[t + "Id"], n[t + "Index"] = e[t + "Index"], n[t + "Name"] = e[t + "Name"];
  var i = {
    mainType: t,
    query: n
  };
  return r && (i.subType = r), i;
}
function ng(e, t, r) {
  e.setAttribute ? e.setAttribute(t, r) : e[t] = r;
}
function z1(e, t) {
  return e.getAttribute ? e.getAttribute(t) : e[t];
}
function Ke() {
  return [1 / 0, -1 / 0];
}
function V1(e, t) {
  wr(t) && t < e[0] && (e[0] = t);
}
function H1(e, t) {
  wr(t) && t > e[1] && (e[1] = t);
}
function wr(e) {
  return e != null && isFinite(e);
}
function Fo(e, t) {
  return wr(e) && wr(t) && e <= t;
}
function G1(e) {
  var t = e[1] - e[0];
  return isFinite(t) && t >= 0;
}
function U1(e) {
  Fo(e[0], e[1]) && e[0] > e[1] && (e[0] = e[1]);
}
function Mf(e, t, r) {
  var n = V(), i = 0;
  D(e, function(a) {
    var o = t(a), s = n.get(o) || 0;
    r && r(a, s), !s && !r && (e[i++] = a), n.set(o, s + 1);
  }), r || (e.length = i);
}
function Y1(e) {
  return e.value + "";
}
function W1(e) {
  return e + "";
}
function X1(e, t, r) {
  var n = e.getData().count();
  return {
    progressiveRender: r.progressiveEnabled && t.incrementalPrepareRender && n >= r.threshold,
    large: e.get("large") && n >= e.get("largeThreshold"),
    // TODO: modDataCount should not updated if `appendData`, otherwise cause whole repaint.
    // see `test/candlestick-large3.html`
    modDataCount: e.get("progressiveChunkMode") === "mod" ? e.getData().count() : null
  };
}
function oi(e, t) {
  return {
    seriesType: e,
    overallReset: t
  };
}
function ig(e) {
  return {
    overallReset: e
  };
}
var $1 = ".", kr = "___EC__COMPONENT__CONTAINER___", ag = "___EC__EXTENDED_CLASS___";
function Ae(e) {
  var t = {
    main: "",
    sub: ""
  };
  if (e) {
    var r = e.split($1);
    t.main = r[0] || "", t.sub = r[1] || "";
  }
  return t;
}
function Z1(e) {
  He(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(e), 'componentType "' + e + '" illegal');
}
function q1(e) {
  return !!(e && e[ag]);
}
function Df(e, t) {
  e.$constructor = e, e.extend = function(r) {
    var n = this, i;
    return K1(n) ? i = /** @class */
    function(a) {
      B(o, a);
      function o() {
        return a.apply(this, arguments) || this;
      }
      return o;
    }(n) : (i = function() {
      (r.$constructor || n).apply(this, arguments);
    }, gf(i, this)), A(i.prototype, r), i[ag] = !0, i.extend = this.extend, i.superCall = j1, i.superApply = tS, i.superClass = n, i;
  };
}
function K1(e) {
  return Z(e) && /^class\s/.test(Function.prototype.toString.call(e));
}
function og(e, t) {
  e.extend = t.extend;
}
var Q1 = Math.round(Math.random() * 10);
function J1(e) {
  var t = ["__\0is_clz", Q1++].join("_");
  e.prototype[t] = !0, e.isInstance = function(r) {
    return !!(r && r[t]);
  };
}
function j1(e, t) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  return this.superClass.prototype[t].apply(e, r);
}
function tS(e, t, r) {
  return this.superClass.prototype[t].apply(e, r);
}
function gs(e) {
  var t = {};
  e.registerClass = function(n) {
    var i = n.type || n.prototype.type;
    if (i) {
      Z1(i), n.prototype.type = i;
      var a = Ae(i);
      if (!a.sub)
        t[a.main] = n;
      else if (a.sub !== kr) {
        var o = r(a);
        o[a.sub] = n;
      }
    }
    return n;
  }, e.getClass = function(n, i, a) {
    var o = t[n];
    if (o && o[kr] && (o = i ? o[i] : null), a && !o)
      throw new Error(i ? "Component " + n + "." + (i || "") + " is used but not imported." : n + ".type should be specified.");
    return o;
  }, e.getClassesByMainType = function(n) {
    var i = Ae(n), a = [], o = t[i.main];
    return o && o[kr] ? D(o, function(s, u) {
      u !== kr && a.push(s);
    }) : a.push(o), a;
  }, e.hasClass = function(n) {
    var i = Ae(n);
    return !!t[i.main];
  }, e.getAllClassMainTypes = function() {
    var n = [];
    return D(t, function(i, a) {
      n.push(a);
    }), n;
  }, e.hasSubTypes = function(n) {
    var i = Ae(n), a = t[i.main];
    return a && a[kr];
  };
  function r(n) {
    var i = t[n.main];
    return (!i || !i[kr]) && (i = t[n.main] = {}, i[kr] = !0), i;
  }
}
function ea(e, t) {
  for (var r = 0; r < e.length; r++)
    e[r][1] || (e[r][1] = e[r][0]);
  return t = t || !1, function(n, i, a) {
    for (var o = {}, s = 0; s < e.length; s++) {
      var u = e[s][1];
      if (!(i && at(i, u) >= 0 || a && at(a, u) < 0)) {
        var l = n.getShallow(u, t);
        l != null && (o[e[s][0]] = l);
      }
    }
    return o;
  };
}
var eS = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], rS = ea(eS), nS = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getAreaStyle = function(t, r) {
      return rS(this, t, r);
    }, e;
  }()
), Al = new Zn(50);
function iS(e) {
  if (typeof e == "string") {
    var t = Al.get(e);
    return t && t.image;
  } else
    return e;
}
function sg(e, t, r, n, i) {
  if (e)
    if (typeof e == "string") {
      if (t && t.__zrImageSrc === e || !r)
        return t;
      var a = Al.get(e), o = { hostEl: r, cb: n, cbPayload: i };
      return a ? (t = a.image, !ys(t) && a.pending.push(o)) : (t = Tt.loadImage(e, mv, mv), t.__zrImageSrc = e, Al.put(e, t.__cachedImgObj = {
        image: t,
        pending: [o]
      })), t;
    } else
      return e;
  else return t;
}
function mv() {
  var e = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;
  for (var t = 0; t < e.pending.length; t++) {
    var r = e.pending[t], n = r.cb;
    n && n(this, r.cbPayload), r.hostEl.dirty();
  }
  e.pending.length = 0;
}
function ys(e) {
  return e && e.width && e.height;
}
var su = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
function aS(e, t, r, n, i) {
  var a = {};
  return ug(a, e, t, r, n, i), a.text;
}
function ug(e, t, r, n, i, a) {
  if (!r) {
    e.text = "", e.isTruncated = !1;
    return;
  }
  var o = (t + "").split(`
`);
  a = lg(r, n, i, a);
  for (var s = !1, u = {}, l = 0, h = o.length; l < h; l++)
    fg(u, o[l], a), o[l] = u.textLine, s = s || u.isTruncated;
  e.text = o.join(`
`), e.isTruncated = s;
}
function lg(e, t, r, n) {
  n = n || {};
  var i = A({}, n);
  r = W(r, "..."), i.maxIterations = W(n.maxIterations, 2);
  var a = i.minChar = W(n.minChar, 0), o = i.fontMeasureInfo = Ne(t), s = o.asciiCharWidth;
  i.placeholder = W(n.placeholder, "");
  for (var u = e = Math.max(0, e - 1), l = 0; l < a && u >= s; l++)
    u -= s;
  var h = Be(o, r);
  return h > u && (r = "", h = 0), u = e - h, i.ellipsis = r, i.ellipsisWidth = h, i.contentWidth = u, i.containerWidth = e, i;
}
function fg(e, t, r) {
  var n = r.containerWidth, i = r.contentWidth, a = r.fontMeasureInfo;
  if (!n) {
    e.textLine = "", e.isTruncated = !1;
    return;
  }
  var o = Be(a, t);
  if (o <= n) {
    e.textLine = t, e.isTruncated = !1;
    return;
  }
  for (var s = 0; ; s++) {
    if (o <= i || s >= r.maxIterations) {
      t += r.ellipsis;
      break;
    }
    var u = s === 0 ? oS(t, i, a) : o > 0 ? Math.floor(t.length * i / o) : 0;
    t = t.substr(0, u), o = Be(a, t);
  }
  t === "" && (t = r.placeholder), e.textLine = t, e.isTruncated = !0;
}
function oS(e, t, r) {
  for (var n = 0, i = 0, a = e.length; i < a && n < t; i++)
    n += Vp(r, e.charCodeAt(i));
  return i;
}
function sS(e, t, r, n) {
  var i = If(e), a = t.overflow, o = t.padding, s = o ? o[1] + o[3] : 0, u = o ? o[0] + o[2] : 0, l = t.font, h = a === "truncate", f = fs(l), v = W(t.lineHeight, f), c = t.lineOverflow === "truncate", d = !1, y = t.width;
  y == null && r != null && (y = r - s);
  var p = t.height;
  p == null && n != null && (p = n - u);
  var g;
  y != null && (a === "break" || a === "breakAll") ? g = i ? hg(i, t.font, y, a === "breakAll", 0).lines : [] : g = i ? i.split(`
`) : [];
  var m = g.length * v;
  if (p == null && (p = m), m > p && c) {
    var _ = Math.floor(p / v);
    d = d || g.length > _, g = g.slice(0, _), m = g.length * v;
  }
  if (i && h && y != null)
    for (var S = lg(y, l, t.ellipsis, {
      minChar: t.truncateMinChar,
      placeholder: t.placeholder
    }), w = {}, b = 0; b < g.length; b++)
      fg(w, g[b], S), g[b] = w.textLine, d = d || w.isTruncated;
  for (var M = p, C = 0, T = Ne(l), b = 0; b < g.length; b++)
    C = Math.max(Be(T, g[b]), C);
  y == null && (y = C);
  var I = y;
  return M += u, I += s, {
    lines: g,
    height: p,
    outerWidth: I,
    outerHeight: M,
    lineHeight: v,
    calculatedLineHeight: f,
    contentWidth: C,
    contentHeight: m,
    width: y,
    isTruncated: d
  };
}
var uS = /* @__PURE__ */ function() {
  function e() {
  }
  return e;
}(), _v = /* @__PURE__ */ function() {
  function e(t) {
    this.tokens = [], t && (this.tokens = t);
  }
  return e;
}(), lS = /* @__PURE__ */ function() {
  function e() {
    this.width = 0, this.height = 0, this.contentWidth = 0, this.contentHeight = 0, this.outerWidth = 0, this.outerHeight = 0, this.lines = [], this.isTruncated = !1;
  }
  return e;
}();
function fS(e, t, r, n, i) {
  var a = new lS(), o = If(e);
  if (!o)
    return a;
  var s = t.padding, u = s ? s[1] + s[3] : 0, l = s ? s[0] + s[2] : 0, h = t.width;
  h == null && r != null && (h = r - u);
  var f = t.height;
  f == null && n != null && (f = n - l);
  for (var v = t.overflow, c = (v === "break" || v === "breakAll") && h != null ? { width: h, accumWidth: 0, breakAll: v === "breakAll" } : null, d = su.lastIndex = 0, y; (y = su.exec(o)) != null; ) {
    var p = y.index;
    p > d && uu(a, o.substring(d, p), t, c), uu(a, y[2], t, c, y[1]), d = su.lastIndex;
  }
  d < o.length && uu(a, o.substring(d, o.length), t, c);
  var g = [], m = 0, _ = 0, S = v === "truncate", w = t.lineOverflow === "truncate", b = {};
  function M(ht, qt, Ye) {
    ht.width = qt, ht.lineHeight = Ye, m += Ye, _ = Math.max(_, qt);
  }
  t: for (var C = 0; C < a.lines.length; C++) {
    for (var T = a.lines[C], I = 0, x = 0, E = 0; E < T.tokens.length; E++) {
      var L = T.tokens[E], R = L.styleName && t.rich[L.styleName] || {}, k = L.textPadding = R.padding, O = k ? k[1] + k[3] : 0, U = L.font = R.font || t.font;
      L.contentHeight = fs(U);
      var Q = W(R.height, L.contentHeight);
      if (L.innerHeight = Q, k && (Q += k[0] + k[2]), L.height = Q, L.lineHeight = je(R.lineHeight, t.lineHeight, Q), L.align = R && R.align || i, L.verticalAlign = R && R.verticalAlign || "middle", w && f != null && m + L.lineHeight > f) {
        var q = a.lines.length;
        E > 0 ? (T.tokens = T.tokens.slice(0, E), M(T, x, I), a.lines = a.lines.slice(0, C + 1)) : a.lines = a.lines.slice(0, C), a.isTruncated = a.isTruncated || a.lines.length < q;
        break t;
      }
      var J = R.width, rt = J == null || J === "auto";
      if (typeof J == "string" && J.charAt(J.length - 1) === "%")
        L.percentWidth = J, g.push(L), L.contentWidth = Be(Ne(U), L.text);
      else {
        if (rt) {
          var et = R.backgroundColor, ot = et && et.image;
          ot && (ot = iS(ot), ys(ot) && (L.width = Math.max(L.width, ot.width * Q / ot.height)));
        }
        var X = S && h != null ? h - x : null;
        X != null && X < L.width ? !rt || X < O ? (L.text = "", L.width = L.contentWidth = 0) : (ug(b, L.text, X - O, U, t.ellipsis, { minChar: t.truncateMinChar }), L.text = b.text, a.isTruncated = a.isTruncated || b.isTruncated, L.width = L.contentWidth = Be(Ne(U), L.text)) : L.contentWidth = Be(Ne(U), L.text);
      }
      L.width += O, x += L.width, R && (I = Math.max(I, L.lineHeight));
    }
    M(T, x, I);
  }
  a.outerWidth = a.width = W(h, _), a.outerHeight = a.height = W(f, m), a.contentHeight = m, a.contentWidth = _, a.outerWidth += u, a.outerHeight += l;
  for (var C = 0; C < g.length; C++) {
    var L = g[C], nt = L.percentWidth;
    L.width = parseInt(nt, 10) / 100 * a.width;
  }
  return a;
}
function uu(e, t, r, n, i) {
  var a = t === "", o = i && r.rich[i] || {}, s = e.lines, u = o.font || r.font, l = !1, h, f;
  if (n) {
    var v = o.padding, c = v ? v[1] + v[3] : 0;
    if (o.width != null && o.width !== "auto") {
      var d = Kn(o.width, n.width) + c;
      s.length > 0 && d + n.accumWidth > n.width && (h = t.split(`
`), l = !0), n.accumWidth = d;
    } else {
      var y = hg(t, u, n.width, n.breakAll, n.accumWidth);
      n.accumWidth = y.accumWidth + c, f = y.linesWidths, h = y.lines;
    }
  }
  h || (h = t.split(`
`));
  for (var p = Ne(u), g = 0; g < h.length; g++) {
    var m = h[g], _ = new uS();
    if (_.styleName = i, _.text = m, _.isLineHolder = !m && !a, typeof o.width == "number" ? _.width = o.width : _.width = f ? f[g] : Be(p, m), !g && !l) {
      var S = (s[s.length - 1] || (s[0] = new _v())).tokens, w = S.length;
      w === 1 && S[0].isLineHolder ? S[0] = _ : (m || !w || a) && S.push(_);
    } else
      s.push(new _v([_]));
  }
}
function hS(e) {
  var t = e.charCodeAt(0);
  return t >= 32 && t <= 591 || t >= 880 && t <= 4351 || t >= 4608 && t <= 5119 || t >= 7680 && t <= 8303;
}
var vS = Ve(",&?/;] ".split(""), function(e, t) {
  return e[t] = !0, e;
}, {});
function cS(e) {
  return hS(e) ? !!vS[e] : !0;
}
function hg(e, t, r, n, i) {
  for (var a = [], o = [], s = "", u = "", l = 0, h = 0, f = Ne(t), v = 0; v < e.length; v++) {
    var c = e.charAt(v);
    if (c === `
`) {
      u && (s += u, h += l), a.push(s), o.push(h), s = "", u = "", l = 0, h = 0;
      continue;
    }
    var d = Vp(f, c.charCodeAt(0)), y = n ? !1 : !cS(c);
    if (a.length ? h + d > r : i + h + d > r) {
      h ? (s || u) && (y ? (s || (s = u, u = "", l = 0, h = l), a.push(s), o.push(h - l), u += c, l += d, s = "", h = l) : (u && (s += u, u = "", l = 0), a.push(s), o.push(h), s = c, h = d)) : y ? (a.push(u), o.push(l), u = c, l = d) : (a.push(c), o.push(d));
      continue;
    }
    h += d, y ? (u += c, l += d) : (u && (s += u, u = "", l = 0), s += c);
  }
  return u && (s += u), s && (a.push(s), o.push(h)), a.length === 1 && (h += i), {
    accumWidth: h,
    lines: a,
    linesWidths: o
  };
}
function Sv(e, t, r, n, i, a) {
  if (e.baseX = r, e.baseY = n, e.outerWidth = e.outerHeight = null, !!t) {
    var o = t.width * 2, s = t.height * 2;
    H.set(wv, qn(r, o, i), rn(n, s, a), o, s), H.intersect(t, wv, null, bv);
    var u = bv.outIntersectRect;
    e.outerWidth = u.width, e.outerHeight = u.height, e.baseX = qn(u.x, u.width, i, !0), e.baseY = rn(u.y, u.height, a, !0);
  }
}
var wv = new H(0, 0, 0, 0), bv = { outIntersectRect: {}, clamp: !0 };
function If(e) {
  return e != null ? e += "" : e = "";
}
function dS(e) {
  var t = If(e.text), r = e.font, n = Be(Ne(r), t), i = fs(r);
  return Ol(e, n, i, null);
}
function Ol(e, t, r, n) {
  var i = new H(qn(e.x || 0, t, e.textAlign), rn(e.y || 0, r, e.textBaseline), t, r), a = n != null ? n : vg(e) ? e.lineWidth : 0;
  return a > 0 && (i.x -= a / 2, i.y -= a / 2, i.width += a, i.height += a), i;
}
function vg(e) {
  var t = e.stroke;
  return t != null && t !== "none" && e.lineWidth > 0;
}
var kl = "__zr_style_" + Math.round(Math.random() * 10), nn = {
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "#000",
  opacity: 1,
  blend: "source-over"
}, ms = {
  style: {
    shadowBlur: !0,
    shadowOffsetX: !0,
    shadowOffsetY: !0,
    shadowColor: !0,
    opacity: !0
  }
};
nn[kl] = !0;
var Tv = ["z", "z2", "invisible"], pS = ["invisible"], ca = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype._init = function(r) {
    for (var n = ft(r), i = 0; i < n.length; i++) {
      var a = n[i];
      a === "style" ? this.useStyle(r[a]) : e.prototype.attrKV.call(this, a, r[a]);
    }
    this.style || this.useStyle({});
  }, t.prototype.beforeBrush = function(r) {
  }, t.prototype.afterBrush = function() {
  }, t.prototype.innerBeforeBrush = function() {
  }, t.prototype.innerAfterBrush = function() {
  }, t.prototype.shouldBePainted = function(r, n, i, a) {
    var o = this.transform;
    if (this.ignore || this.invisible || this.style.opacity === 0 || this.culling && gS(this, r, n) || o && !o[0] && !o[3])
      return !1;
    if (i && this.__clipPaths && this.__clipPaths.length) {
      for (var s = 0; s < this.__clipPaths.length; ++s)
        if (this.__clipPaths[s].isZeroArea())
          return !1;
    }
    if (a && this.parent)
      for (var u = this.parent; u; ) {
        if (u.ignore)
          return !1;
        u = u.parent;
      }
    return !0;
  }, t.prototype.contain = function(r, n) {
    return this.rectContain(r, n);
  }, t.prototype.traverse = function(r, n) {
    r.call(n, this);
  }, t.prototype.rectContain = function(r, n) {
    var i = this.transformCoordToLocal(r, n), a = this.getBoundingRect();
    return a.contain(i[0], i[1]);
  }, t.prototype.getPaintRect = function() {
    var r = this._paintRect;
    if (!this._paintRect || this.__dirty) {
      var n = this.transform, i = this.getBoundingRect(), a = this.style, o = a.shadowBlur || 0, s = a.shadowOffsetX || 0, u = a.shadowOffsetY || 0;
      r = this._paintRect || (this._paintRect = new H(0, 0, 0, 0)), n ? H.applyTransform(r, i, n) : r.copy(i), (o || s || u) && (r.width += o * 2 + Math.abs(s), r.height += o * 2 + Math.abs(u), r.x = Math.min(r.x, r.x + s - o), r.y = Math.min(r.y, r.y + u - o));
      var l = this.dirtyRectTolerance;
      r.isZero() || (r.x = Math.floor(r.x - l), r.y = Math.floor(r.y - l), r.width = Math.ceil(r.width + 1 + l * 2), r.height = Math.ceil(r.height + 1 + l * 2));
    }
    return r;
  }, t.prototype.setPrevPaintRect = function(r) {
    r ? (this._prevPaintRect = this._prevPaintRect || new H(0, 0, 0, 0), this._prevPaintRect.copy(r)) : this._prevPaintRect = null;
  }, t.prototype.getPrevPaintRect = function() {
    return this._prevPaintRect;
  }, t.prototype.animateStyle = function(r) {
    return this.animate("style", r);
  }, t.prototype.updateDuringAnimation = function(r) {
    r === "style" ? this.dirtyStyle() : this.markRedraw();
  }, t.prototype.attrKV = function(r, n) {
    r !== "style" ? e.prototype.attrKV.call(this, r, n) : this.style ? this.setStyle(n) : this.useStyle(n);
  }, t.prototype.setStyle = function(r, n) {
    return typeof r == "string" ? this.style[r] = n : A(this.style, r), this.dirtyStyle(), this;
  }, t.prototype.dirtyStyle = function(r) {
    r || this.markRedraw(), this.__dirty |= Li, this._rect && (this._rect = null);
  }, t.prototype.dirty = function() {
    this.dirtyStyle();
  }, t.prototype.styleChanged = function() {
    return !!(this.__dirty & Li);
  }, t.prototype.styleUpdated = function() {
    this.__dirty &= ~Li;
  }, t.prototype.createStyle = function(r) {
    return ha(nn, r);
  }, t.prototype.useStyle = function(r) {
    r[kl] || (r = this.createStyle(r)), this.style = r, this.dirtyStyle();
  }, t.prototype._useHoverStyle = function(r) {
    this.__hoverStyle = r;
  }, t.prototype.isStyleObject = function(r) {
    return r[kl];
  }, t.prototype._innerSaveToNormal = function(r) {
    e.prototype._innerSaveToNormal.call(this, r);
    var n = this._normalState;
    r.style && !n.style && (n.style = this._mergeStyle(this.createStyle(), this.style)), this._savePrimaryToNormal(r, n, Tv);
  }, t.prototype._applyStateObj = function(r, n, i, a, o, s) {
    e.prototype._applyStateObj.call(this, r, n, i, a, o, s);
    var u = !(n && a), l = this.__inHover === hs, h;
    if (n && n.style ? o ? a ? h = n.style : (h = this._mergeStyle(this.createStyle(), i.style), this._mergeStyle(h, n.style)) : (h = this._mergeStyle(this.createStyle(), a ? this.style : i.style), this._mergeStyle(h, n.style)) : u && (h = i.style), h)
      if (o) {
        var f = this.style;
        if (this.style = this.createStyle(u ? {} : f), u)
          for (var v = ft(f), c = 0; c < v.length; c++) {
            var d = v[c];
            d in h && (h[d] = h[d], this.style[d] = f[d]);
          }
        for (var y = ft(h), c = 0; c < y.length; c++) {
          var d = y[c];
          this.style[d] = this.style[d];
        }
        this._transitionState(r, {
          style: h
        }, s, this.getAnimationStyleProps());
      } else
        l ? this._useHoverStyle(h) : this.useStyle(h);
    if (!l)
      for (var p = this.__inHover ? pS : Tv, c = 0; c < p.length; c++) {
        var d = p[c];
        n && n[d] != null ? this[d] = n[d] : u && i[d] != null && (this[d] = i[d]);
      }
  }, t.prototype._mergeStates = function(r) {
    for (var n = e.prototype._mergeStates.call(this, r), i, a = 0; a < r.length; a++) {
      var o = r[a];
      o.style && (i = i || {}, this._mergeStyle(i, o.style));
    }
    return i && (n.style = i), n;
  }, t.prototype._mergeStyle = function(r, n) {
    return A(r, n), r;
  }, t.prototype.getAnimationStyleProps = function() {
    return ms;
  }, t.initDefaultProps = function() {
    var r = t.prototype;
    r.type = "displayable", r.invisible = !1, r.z = 0, r.z2 = 0, r.zlevel = 0, r.culling = !1, r.cursor = "pointer", r.rectHover = !1, r.incremental = 0, r._rect = null, r.dirtyRectTolerance = 0, r.__dirty = Wt | Li;
  }(), t;
}(vs), lu = new H(0, 0, 0, 0), fu = new H(0, 0, 0, 0);
function gS(e, t, r) {
  return lu.copy(e.getBoundingRect()), e.transform && lu.applyTransform(e.transform), fu.width = t, fu.height = r, !lu.intersect(fu);
}
var Ut = Math.min, Yt = Math.max, hu = Math.sin, vu = Math.cos, Nr = Math.PI * 2, Ia = Tr(), xa = Tr(), La = Tr();
function yS(e, t, r) {
  if (e.length !== 0) {
    for (var n = e[0], i = n[0], a = n[0], o = n[1], s = n[1], u = 1; u < e.length; u++)
      n = e[u], i = Ut(i, n[0]), a = Yt(a, n[0]), o = Ut(o, n[1]), s = Yt(s, n[1]);
    t[0] = i, t[1] = o, r[0] = a, r[1] = s;
  }
}
function Cv(e, t, r, n, i, a) {
  i[0] = Ut(e, r), i[1] = Ut(t, n), a[0] = Yt(e, r), a[1] = Yt(t, n);
}
var Mv = [], Dv = [];
function mS(e, t, r, n, i, a, o, s, u, l) {
  var h = Ep, f = kt, v = h(e, r, i, o, Mv);
  u[0] = 1 / 0, u[1] = 1 / 0, l[0] = -1 / 0, l[1] = -1 / 0;
  for (var c = 0; c < v; c++) {
    var d = f(e, r, i, o, Mv[c]);
    u[0] = Ut(d, u[0]), l[0] = Yt(d, l[0]);
  }
  v = h(t, n, a, s, Dv);
  for (var c = 0; c < v; c++) {
    var y = f(t, n, a, s, Dv[c]);
    u[1] = Ut(y, u[1]), l[1] = Yt(y, l[1]);
  }
  u[0] = Ut(e, u[0]), l[0] = Yt(e, l[0]), u[0] = Ut(o, u[0]), l[0] = Yt(o, l[0]), u[1] = Ut(t, u[1]), l[1] = Yt(t, l[1]), u[1] = Ut(s, u[1]), l[1] = Yt(s, l[1]);
}
function _S(e, t, r, n, i, a, o, s) {
  var u = Rp, l = Nt, h = Yt(Ut(u(e, r, i), 1), 0), f = Yt(Ut(u(t, n, a), 1), 0), v = l(e, r, i, h), c = l(t, n, a, f);
  o[0] = Ut(e, i, v), o[1] = Ut(t, a, c), s[0] = Yt(e, i, v), s[1] = Yt(t, a, c);
}
function SS(e, t, r, n, i, a, o, s, u) {
  var l = lr, h = fr, f = Math.abs(i - a);
  if (f % Nr < 1e-4 && f > 1e-4) {
    s[0] = e - r, s[1] = t - n, u[0] = e + r, u[1] = t + n;
    return;
  }
  if (Ia[0] = vu(i) * r + e, Ia[1] = hu(i) * n + t, xa[0] = vu(a) * r + e, xa[1] = hu(a) * n + t, l(s, Ia, xa), h(u, Ia, xa), i = i % Nr, i < 0 && (i = i + Nr), a = a % Nr, a < 0 && (a = a + Nr), i > a && !o ? a += Nr : i < a && o && (i += Nr), o) {
    var v = a;
    a = i, i = v;
  }
  for (var c = 0; c < a; c += Math.PI / 2)
    c > i && (La[0] = vu(c) * r + e, La[1] = hu(c) * n + t, l(s, La, s), h(u, La, u));
}
var j = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  R: 7
}, Br = [], Fr = [], Ie = [], er = [], xe = [], Le = [], cu = Math.min, du = Math.max, zr = Math.cos, Vr = Math.sin, We = Math.abs, Nl = Math.PI, or = Nl * 2, pu = typeof Float32Array != "undefined", hi = [];
function gu(e) {
  var t = Math.round(e / Nl * 1e8) / 1e8;
  return t % 2 * Nl;
}
function wS(e, t) {
  var r = gu(e[0]);
  r < 0 && (r += or);
  var n = r - e[0], i = e[1];
  i += n, !t && i - r >= or ? i = r + or : t && r - i >= or ? i = r - or : !t && r > i ? i = r + (or - gu(r - i)) : t && r < i && (i = r - (or - gu(i - r))), e[0] = r, e[1] = i;
}
var Qn = function() {
  function e(t) {
    this.dpr = 1, this._xi = 0, this._yi = 0, this._x0 = 0, this._y0 = 0, this._len = 0, t && (this._saveData = !1), this._saveData && (this.data = []);
  }
  return e.prototype.increaseVersion = function() {
    this._version++;
  }, e.prototype.getVersion = function() {
    return this._version;
  }, e.prototype.setScale = function(t, r, n) {
    n = n || 0, n > 0 && (this._ux = We(n / No / t) || 0, this._uy = We(n / No / r) || 0);
  }, e.prototype.setDPR = function(t) {
    this.dpr = t;
  }, e.prototype.setContext = function(t) {
    this._ctx = t;
  }, e.prototype.getContext = function() {
    return this._ctx;
  }, e.prototype.beginPath = function() {
    return this._ctx && this._ctx.beginPath(), this.reset(), this;
  }, e.prototype.reset = function() {
    this._saveData && (this._len = 0), this._pathSegLen && (this._pathSegLen = null, this._pathLen = 0), this._version++;
  }, e.prototype.moveTo = function(t, r) {
    return this._drawPendingPt(), this.addData(j.M, t, r), this._ctx && this._ctx.moveTo(t, r), this._x0 = t, this._y0 = r, this._xi = t, this._yi = r, this;
  }, e.prototype.lineTo = function(t, r) {
    var n = We(t - this._xi), i = We(r - this._yi), a = n > this._ux || i > this._uy;
    if (this.addData(j.L, t, r), this._ctx && a && this._ctx.lineTo(t, r), a)
      this._xi = t, this._yi = r, this._pendingPtDist = 0;
    else {
      var o = n * n + i * i;
      o > this._pendingPtDist && (this._pendingPtX = t, this._pendingPtY = r, this._pendingPtDist = o);
    }
    return this;
  }, e.prototype.bezierCurveTo = function(t, r, n, i, a, o) {
    return this._drawPendingPt(), this.addData(j.C, t, r, n, i, a, o), this._ctx && this._ctx.bezierCurveTo(t, r, n, i, a, o), this._xi = a, this._yi = o, this;
  }, e.prototype.quadraticCurveTo = function(t, r, n, i) {
    return this._drawPendingPt(), this.addData(j.Q, t, r, n, i), this._ctx && this._ctx.quadraticCurveTo(t, r, n, i), this._xi = n, this._yi = i, this;
  }, e.prototype.arc = function(t, r, n, i, a, o) {
    this._drawPendingPt(), hi[0] = i, hi[1] = a, wS(hi, o), i = hi[0], a = hi[1];
    var s = a - i;
    return this.addData(j.A, t, r, n, n, i, s, 0, o ? 0 : 1), this._ctx && this._ctx.arc(t, r, n, i, a, o), this._xi = zr(a) * n + t, this._yi = Vr(a) * n + r, this;
  }, e.prototype.arcTo = function(t, r, n, i, a) {
    return this._drawPendingPt(), this._ctx && this._ctx.arcTo(t, r, n, i, a), this;
  }, e.prototype.rect = function(t, r, n, i) {
    return this._drawPendingPt(), this._ctx && this._ctx.rect(t, r, n, i), this.addData(j.R, t, r, n, i), this;
  }, e.prototype.closePath = function() {
    this._drawPendingPt(), this.addData(j.Z);
    var t = this._ctx, r = this._x0, n = this._y0;
    return t && t.closePath(), this._xi = r, this._yi = n, this;
  }, e.prototype.fill = function(t) {
    t && t.fill(), this.toStatic();
  }, e.prototype.stroke = function(t) {
    t && t.stroke(), this.toStatic();
  }, e.prototype.len = function() {
    return this._len;
  }, e.prototype.setData = function(t) {
    if (this._saveData) {
      var r = t.length;
      !(this.data && this.data.length === r) && pu && (this.data = new Float32Array(r));
      for (var n = 0; n < r; n++)
        this.data[n] = t[n];
      this._len = r;
    }
  }, e.prototype.appendPath = function(t) {
    if (this._saveData) {
      t instanceof Array || (t = [t]);
      for (var r = t.length, n = 0, i = this._len, a = 0; a < r; a++)
        n += t[a].len();
      var o = this.data;
      if (pu && (o instanceof Float32Array || !o) && (this.data = new Float32Array(i + n), i > 0 && o))
        for (var s = 0; s < i; s++)
          this.data[s] = o[s];
      for (var a = 0; a < r; a++)
        for (var u = t[a].data, s = 0; s < u.length; s++)
          this.data[i++] = u[s];
      this._len = i;
    }
  }, e.prototype.addData = function(t, r, n, i, a, o, s, u, l) {
    if (this._saveData) {
      var h = this.data;
      this._len + arguments.length > h.length && (this._expandData(), h = this.data);
      for (var f = 0; f < arguments.length; f++)
        h[this._len++] = arguments[f];
    }
  }, e.prototype._drawPendingPt = function() {
    this._pendingPtDist > 0 && (this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY), this._pendingPtDist = 0);
  }, e.prototype._expandData = function() {
    if (!(this.data instanceof Array)) {
      for (var t = [], r = 0; r < this._len; r++)
        t[r] = this.data[r];
      this.data = t;
    }
  }, e.prototype.toStatic = function() {
    if (this._saveData) {
      this._drawPendingPt();
      var t = this.data;
      t instanceof Array && (t.length = this._len, pu && this._len > 11 && (this.data = new Float32Array(t)));
    }
  }, e.prototype.getBoundingRect = function() {
    Ie[0] = Ie[1] = xe[0] = xe[1] = Number.MAX_VALUE, er[0] = er[1] = Le[0] = Le[1] = -Number.MAX_VALUE;
    var t = this.data, r = 0, n = 0, i = 0, a = 0, o;
    for (o = 0; o < this._len; ) {
      var s = t[o++], u = o === 1;
      switch (u && (r = t[o], n = t[o + 1], i = r, a = n), s) {
        case j.M:
          r = i = t[o++], n = a = t[o++], xe[0] = i, xe[1] = a, Le[0] = i, Le[1] = a;
          break;
        case j.L:
          Cv(r, n, t[o], t[o + 1], xe, Le), r = t[o++], n = t[o++];
          break;
        case j.C:
          mS(r, n, t[o++], t[o++], t[o++], t[o++], t[o], t[o + 1], xe, Le), r = t[o++], n = t[o++];
          break;
        case j.Q:
          _S(r, n, t[o++], t[o++], t[o], t[o + 1], xe, Le), r = t[o++], n = t[o++];
          break;
        case j.A:
          var l = t[o++], h = t[o++], f = t[o++], v = t[o++], c = t[o++], d = t[o++] + c;
          o += 1;
          var y = !t[o++];
          u && (i = zr(c) * f + l, a = Vr(c) * v + h), SS(l, h, f, v, c, d, y, xe, Le), r = zr(d) * f + l, n = Vr(d) * v + h;
          break;
        case j.R:
          i = r = t[o++], a = n = t[o++];
          var p = t[o++], g = t[o++];
          Cv(i, a, i + p, a + g, xe, Le);
          break;
        case j.Z:
          r = i, n = a;
          break;
      }
      lr(Ie, Ie, xe), fr(er, er, Le);
    }
    return o === 0 && (Ie[0] = Ie[1] = er[0] = er[1] = 0), new H(Ie[0], Ie[1], er[0] - Ie[0], er[1] - Ie[1]);
  }, e.prototype._calculateLength = function() {
    var t = this.data, r = this._len, n = this._ux, i = this._uy, a = 0, o = 0, s = 0, u = 0;
    this._pathSegLen || (this._pathSegLen = []);
    for (var l = this._pathSegLen, h = 0, f = 0, v = 0; v < r; ) {
      var c = t[v++], d = v === 1;
      d && (a = t[v], o = t[v + 1], s = a, u = o);
      var y = -1;
      switch (c) {
        case j.M:
          a = s = t[v++], o = u = t[v++];
          break;
        case j.L: {
          var p = t[v++], g = t[v++], m = p - a, _ = g - o;
          (We(m) > n || We(_) > i || v === r - 1) && (y = Math.sqrt(m * m + _ * _), a = p, o = g);
          break;
        }
        case j.C: {
          var S = t[v++], w = t[v++], p = t[v++], g = t[v++], b = t[v++], M = t[v++];
          y = h_(a, o, S, w, p, g, b, M, 10), a = b, o = M;
          break;
        }
        case j.Q: {
          var S = t[v++], w = t[v++], p = t[v++], g = t[v++];
          y = d_(a, o, S, w, p, g, 10), a = p, o = g;
          break;
        }
        case j.A:
          var C = t[v++], T = t[v++], I = t[v++], x = t[v++], E = t[v++], L = t[v++], R = L + E;
          v += 1, d && (s = zr(E) * I + C, u = Vr(E) * x + T), y = du(I, x) * cu(or, Math.abs(L)), a = zr(R) * I + C, o = Vr(R) * x + T;
          break;
        case j.R: {
          s = a = t[v++], u = o = t[v++];
          var k = t[v++], O = t[v++];
          y = k * 2 + O * 2;
          break;
        }
        case j.Z: {
          var m = s - a, _ = u - o;
          y = Math.sqrt(m * m + _ * _), a = s, o = u;
          break;
        }
      }
      y >= 0 && (l[f++] = y, h += y);
    }
    return this._pathLen = h, h;
  }, e.prototype.rebuildPath = function(t, r) {
    var n = this.data, i = this._ux, a = this._uy, o = this._len, s, u, l, h, f, v, c = r < 1, d, y, p = 0, g = 0, m, _ = 0, S, w;
    if (!(c && (this._pathSegLen || this._calculateLength(), d = this._pathSegLen, y = this._pathLen, m = r * y, !m)))
      t: for (var b = 0; b < o; ) {
        var M = n[b++], C = b === 1;
        switch (C && (l = n[b], h = n[b + 1], s = l, u = h), M !== j.L && _ > 0 && (t.lineTo(S, w), _ = 0), M) {
          case j.M:
            s = l = n[b++], u = h = n[b++], t.moveTo(l, h);
            break;
          case j.L: {
            f = n[b++], v = n[b++];
            var T = We(f - l), I = We(v - h);
            if (T > i || I > a) {
              if (c) {
                var x = d[g++];
                if (p + x > m) {
                  var E = (m - p) / x;
                  t.lineTo(l * (1 - E) + f * E, h * (1 - E) + v * E);
                  break t;
                }
                p += x;
              }
              t.lineTo(f, v), l = f, h = v, _ = 0;
            } else {
              var L = T * T + I * I;
              L > _ && (S = f, w = v, _ = L);
            }
            break;
          }
          case j.C: {
            var R = n[b++], k = n[b++], O = n[b++], U = n[b++], Q = n[b++], q = n[b++];
            if (c) {
              var x = d[g++];
              if (p + x > m) {
                var E = (m - p) / x;
                Oo(l, R, O, Q, E, Br), Oo(h, k, U, q, E, Fr), t.bezierCurveTo(Br[1], Fr[1], Br[2], Fr[2], Br[3], Fr[3]);
                break t;
              }
              p += x;
            }
            t.bezierCurveTo(R, k, O, U, Q, q), l = Q, h = q;
            break;
          }
          case j.Q: {
            var R = n[b++], k = n[b++], O = n[b++], U = n[b++];
            if (c) {
              var x = d[g++];
              if (p + x > m) {
                var E = (m - p) / x;
                Zi(l, R, O, E, Br), Zi(h, k, U, E, Fr), t.quadraticCurveTo(Br[1], Fr[1], Br[2], Fr[2]);
                break t;
              }
              p += x;
            }
            t.quadraticCurveTo(R, k, O, U), l = O, h = U;
            break;
          }
          case j.A:
            var J = n[b++], rt = n[b++], et = n[b++], ot = n[b++], X = n[b++], nt = n[b++], ht = n[b++], qt = !n[b++], Ye = et > ot ? et : ot, Kt = We(et - ot) > 1e-3, wt = X + nt, Y = !1;
            if (c) {
              var x = d[g++];
              p + x > m && (wt = X + nt * (m - p) / x, Y = !0), p += x;
            }
            if (Kt && t.ellipse ? t.ellipse(J, rt, et, ot, ht, X, wt, qt) : t.arc(J, rt, Ye, X, wt, qt), Y)
              break t;
            C && (s = zr(X) * et + J, u = Vr(X) * ot + rt), l = zr(wt) * et + J, h = Vr(wt) * ot + rt;
            break;
          case j.R:
            s = l = n[b], u = h = n[b + 1], f = n[b++], v = n[b++];
            var K = n[b++], xr = n[b++];
            if (c) {
              var x = d[g++];
              if (p + x > m) {
                var Pt = m - p;
                t.moveTo(f, v), t.lineTo(f + cu(Pt, K), v), Pt -= K, Pt > 0 && t.lineTo(f + K, v + cu(Pt, xr)), Pt -= xr, Pt > 0 && t.lineTo(f + du(K - Pt, 0), v + xr), Pt -= K, Pt > 0 && t.lineTo(f, v + du(xr - Pt, 0));
                break t;
              }
              p += x;
            }
            t.rect(f, v, K, xr);
            break;
          case j.Z:
            if (c) {
              var x = d[g++];
              if (p + x > m) {
                var E = (m - p) / x;
                t.lineTo(l * (1 - E) + s * E, h * (1 - E) + u * E);
                break t;
              }
              p += x;
            }
            t.closePath(), l = s, h = u;
        }
      }
  }, e.prototype.clone = function() {
    var t = new e(), r = this.data;
    return t.data = r.slice ? r.slice() : Array.prototype.slice.call(r), t._len = this._len, t;
  }, e.prototype.canSave = function() {
    return !!this._saveData;
  }, e.CMD = j, e.initDefaultProps = function() {
    var t = e.prototype;
    t._saveData = !0, t._ux = 0, t._uy = 0, t._pendingPtDist = 0, t._version = 0;
  }(), e;
}();
function wn(e, t, r, n, i, a, o) {
  if (i === 0)
    return !1;
  var s = i, u = 0, l = e;
  if (o > t + s && o > n + s || o < t - s && o < n - s || a > e + s && a > r + s || a < e - s && a < r - s)
    return !1;
  if (e !== r)
    u = (t - n) / (e - r), l = (e * n - r * t) / (e - r);
  else
    return Math.abs(a - e) <= s / 2;
  var h = u * a - o + l, f = h * h / (u * u + 1);
  return f <= s / 2 * s / 2;
}
function bS(e, t, r, n, i, a, o, s, u, l, h) {
  if (u === 0)
    return !1;
  var f = u;
  if (h > t + f && h > n + f && h > a + f && h > s + f || h < t - f && h < n - f && h < a - f && h < s - f || l > e + f && l > r + f && l > i + f && l > o + f || l < e - f && l < r - f && l < i - f && l < o - f)
    return !1;
  var v = f_(e, t, r, n, i, a, o, s, l, h);
  return v <= f / 2;
}
function TS(e, t, r, n, i, a, o, s, u) {
  if (o === 0)
    return !1;
  var l = o;
  if (u > t + l && u > n + l && u > a + l || u < t - l && u < n - l && u < a - l || s > e + l && s > r + l && s > i + l || s < e - l && s < r - l && s < i - l)
    return !1;
  var h = c_(e, t, r, n, i, a, s, u);
  return h <= l / 2;
}
var Iv = Math.PI * 2;
function Ea(e) {
  return e %= Iv, e < 0 && (e += Iv), e;
}
var vi = Math.PI * 2;
function CS(e, t, r, n, i, a, o, s, u) {
  if (o === 0)
    return !1;
  var l = o;
  s -= e, u -= t;
  var h = Math.sqrt(s * s + u * u);
  if (h - l > r || h + l < r)
    return !1;
  if (Math.abs(n - i) % vi < 1e-4)
    return !0;
  if (a) {
    var f = n;
    n = Ea(i), i = Ea(f);
  } else
    n = Ea(n), i = Ea(i);
  n > i && (i += vi);
  var v = Math.atan2(u, s);
  return v < 0 && (v += vi), v >= n && v <= i || v + vi >= n && v + vi <= i;
}
function qe(e, t, r, n, i, a) {
  if (a > t && a > n || a < t && a < n || n === t)
    return 0;
  var o = (a - t) / (n - t), s = n < t ? 1 : -1;
  (o === 1 || o === 0) && (s = n < t ? 0.5 : -0.5);
  var u = o * (r - e) + e;
  return u === i ? 1 / 0 : u > i ? s : 0;
}
var rr = Qn.CMD, Hr = Math.PI * 2, MS = 1e-4;
function DS(e, t) {
  return Math.abs(e - t) < MS;
}
var At = [-1, -1, -1], se = [-1, -1];
function IS() {
  var e = se[0];
  se[0] = se[1], se[1] = e;
}
function xS(e, t, r, n, i, a, o, s, u, l) {
  if (l > t && l > n && l > a && l > s || l < t && l < n && l < a && l < s)
    return 0;
  var h = Lp(t, n, a, s, l, At);
  if (h === 0)
    return 0;
  for (var f = 0, v = -1, c = void 0, d = void 0, y = 0; y < h; y++) {
    var p = At[y], g = p === 0 || p === 1 ? 0.5 : 1, m = kt(e, r, i, o, p);
    m < u || (v < 0 && (v = Ep(t, n, a, s, se), se[1] < se[0] && v > 1 && IS(), c = kt(t, n, a, s, se[0]), v > 1 && (d = kt(t, n, a, s, se[1]))), v === 2 ? p < se[0] ? f += c < t ? g : -g : p < se[1] ? f += d < c ? g : -g : f += s < d ? g : -g : p < se[0] ? f += c < t ? g : -g : f += s < c ? g : -g);
  }
  return f;
}
function LS(e, t, r, n, i, a, o, s) {
  if (s > t && s > n && s > a || s < t && s < n && s < a)
    return 0;
  var u = v_(t, n, a, s, At);
  if (u === 0)
    return 0;
  var l = Rp(t, n, a);
  if (l >= 0 && l <= 1) {
    for (var h = 0, f = Nt(t, n, a, l), v = 0; v < u; v++) {
      var c = At[v] === 0 || At[v] === 1 ? 0.5 : 1, d = Nt(e, r, i, At[v]);
      d < o || (At[v] < l ? h += f < t ? c : -c : h += a < f ? c : -c);
    }
    return h;
  } else {
    var c = At[0] === 0 || At[0] === 1 ? 0.5 : 1, d = Nt(e, r, i, At[0]);
    return d < o ? 0 : a < t ? c : -c;
  }
}
function ES(e, t, r, n, i, a, o, s) {
  if (s -= t, s > r || s < -r)
    return 0;
  var u = Math.sqrt(r * r - s * s);
  At[0] = -u, At[1] = u;
  var l = Math.abs(n - i);
  if (l < 1e-4)
    return 0;
  if (l >= Hr - 1e-4) {
    n = 0, i = Hr;
    var h = a ? 1 : -1;
    return o >= At[0] + e && o <= At[1] + e ? h : 0;
  }
  if (n > i) {
    var f = n;
    n = i, i = f;
  }
  n < 0 && (n += Hr, i += Hr);
  for (var v = 0, c = 0; c < 2; c++) {
    var d = At[c];
    if (d + e > o) {
      var y = Math.atan2(s, d), h = a ? 1 : -1;
      y < 0 && (y = Hr + y), (y >= n && y <= i || y + Hr >= n && y + Hr <= i) && (y > Math.PI / 2 && y < Math.PI * 1.5 && (h = -h), v += h);
    }
  }
  return v;
}
function cg(e, t, r, n, i) {
  for (var a = e.data, o = e.len(), s = 0, u = 0, l = 0, h = 0, f = 0, v, c, d = 0; d < o; ) {
    var y = a[d++], p = d === 1;
    switch (y === rr.M && d > 1 && (r || (s += qe(u, l, h, f, n, i))), p && (u = a[d], l = a[d + 1], h = u, f = l), y) {
      case rr.M:
        h = a[d++], f = a[d++], u = h, l = f;
        break;
      case rr.L:
        if (r) {
          if (wn(u, l, a[d], a[d + 1], t, n, i))
            return !0;
        } else
          s += qe(u, l, a[d], a[d + 1], n, i) || 0;
        u = a[d++], l = a[d++];
        break;
      case rr.C:
        if (r) {
          if (bS(u, l, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], t, n, i))
            return !0;
        } else
          s += xS(u, l, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], n, i) || 0;
        u = a[d++], l = a[d++];
        break;
      case rr.Q:
        if (r) {
          if (TS(u, l, a[d++], a[d++], a[d], a[d + 1], t, n, i))
            return !0;
        } else
          s += LS(u, l, a[d++], a[d++], a[d], a[d + 1], n, i) || 0;
        u = a[d++], l = a[d++];
        break;
      case rr.A:
        var g = a[d++], m = a[d++], _ = a[d++], S = a[d++], w = a[d++], b = a[d++];
        d += 1;
        var M = !!(1 - a[d++]);
        v = Math.cos(w) * _ + g, c = Math.sin(w) * S + m, p ? (h = v, f = c) : s += qe(u, l, v, c, n, i);
        var C = (n - g) * S / _ + g;
        if (r) {
          if (CS(g, m, S, w, w + b, M, t, C, i))
            return !0;
        } else
          s += ES(g, m, S, w, w + b, M, C, i);
        u = Math.cos(w + b) * _ + g, l = Math.sin(w + b) * S + m;
        break;
      case rr.R:
        h = u = a[d++], f = l = a[d++];
        var T = a[d++], I = a[d++];
        if (v = h + T, c = f + I, r) {
          if (wn(h, f, v, f, t, n, i) || wn(v, f, v, c, t, n, i) || wn(v, c, h, c, t, n, i) || wn(h, c, h, f, t, n, i))
            return !0;
        } else
          s += qe(v, f, v, c, n, i), s += qe(h, c, h, f, n, i);
        break;
      case rr.Z:
        if (r) {
          if (wn(u, l, h, f, t, n, i))
            return !0;
        } else
          s += qe(u, l, h, f, n, i);
        u = h, l = f;
        break;
    }
  }
  return !r && !DS(l, f) && (s += qe(u, l, h, f, n, i) || 0), s !== 0;
}
function RS(e, t, r) {
  return cg(e, 0, !1, t, r);
}
function PS(e, t, r, n) {
  return cg(e, t, !0, r, n);
}
var dg = mt({
  fill: "#000",
  stroke: null,
  strokePercent: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
  lineDashOffset: 0,
  lineWidth: 1,
  lineCap: "butt",
  miterLimit: 10,
  strokeNoScale: !1,
  strokeFirst: !1
}, nn), AS = {
  style: mt({
    fill: !0,
    stroke: !0,
    strokePercent: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineDashOffset: !0,
    lineWidth: !0,
    miterLimit: !0
  }, ms.style)
}, yu = ls.concat([
  "invisible",
  "culling",
  "z",
  "z2",
  "zlevel",
  "parent"
]), st = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.update = function() {
    var r = this;
    e.prototype.update.call(this);
    var n = this.style;
    if (n.decal) {
      var i = this._decalEl = this._decalEl || new t();
      i.buildPath === t.prototype.buildPath && (i.buildPath = function(u) {
        r.buildPath(u, r.shape);
      }), i.silent = !0;
      var a = i.style;
      for (var o in n)
        a[o] !== n[o] && (a[o] = n[o]);
      a.fill = n.fill ? n.decal : null, a.decal = null, a.shadowColor = null, n.strokeFirst && (a.stroke = null);
      for (var s = 0; s < yu.length; ++s)
        i[yu[s]] = this[yu[s]];
      i.__dirty |= Wt;
    } else this._decalEl && (this._decalEl = null);
  }, t.prototype.getDecalElement = function() {
    return this._decalEl;
  }, t.prototype._init = function(r) {
    var n = ft(r);
    this.shape = this.getDefaultShape();
    var i = this.getDefaultStyle();
    i && this.useStyle(i);
    for (var a = 0; a < n.length; a++) {
      var o = n[a], s = r[o];
      o === "style" ? this.style ? A(this.style, s) : this.useStyle(s) : o === "shape" ? A(this.shape, s) : e.prototype.attrKV.call(this, o, s);
    }
    this.style || this.useStyle({});
  }, t.prototype.getDefaultStyle = function() {
    return null;
  }, t.prototype.getDefaultShape = function() {
    return {};
  }, t.prototype.canBeInsideText = function() {
    return this.hasFill();
  }, t.prototype.getInsideTextFill = function() {
    var r = this.style.fill;
    if (r !== "none") {
      if (G(r)) {
        var n = Ki(r, 0);
        return n > 0.5 ? Il : n > 0.2 ? H_ : xl;
      } else if (r)
        return xl;
    }
    return Il;
  }, t.prototype.getInsideTextStroke = function(r) {
    var n = this.style.fill;
    if (G(n)) {
      var i = this.__zr, a = !!(i && i.isDarkMode()), o = Ki(r, 0) < Dl;
      if (a === o)
        return n;
    }
  }, t.prototype.buildPath = function(r, n, i) {
  }, t.prototype.pathUpdated = function() {
    this.__dirty &= ~kn;
  }, t.prototype.getUpdatedPathProxy = function(r) {
    return !this.path && this.createPathProxy(), this.path.beginPath(), this.buildPath(this.path, this.shape, r), this.path;
  }, t.prototype.createPathProxy = function() {
    this.path = new Qn(!1);
  }, t.prototype.hasStroke = function() {
    var r = this.style, n = r.stroke;
    return !(n == null || n === "none" || !(r.lineWidth > 0));
  }, t.prototype.hasFill = function() {
    var r = this.style, n = r.fill;
    return n != null && n !== "none";
  }, t.prototype.getBoundingRect = function() {
    var r = this._rect, n = this.style, i = !r;
    if (i) {
      var a = !1;
      this.path || (a = !0, this.createPathProxy());
      var o = this.path;
      (a || this.__dirty & kn) && (o.beginPath(), this.buildPath(o, this.shape, !1), this.pathUpdated()), r = o.getBoundingRect();
    }
    if (this._rect = r, this.hasStroke() && this.path && this.path.len() > 0) {
      var s = this._rectStroke || (this._rectStroke = r.clone());
      if (this.__dirty || i) {
        s.copy(r);
        var u = n.strokeNoScale ? this.getLineScale() : 1, l = n.lineWidth;
        if (!this.hasFill()) {
          var h = this.strokeContainThreshold;
          l = Math.max(l, h == null ? 4 : h);
        }
        u > 1e-10 && (s.width += l / u, s.height += l / u, s.x -= l / u / 2, s.y -= l / u / 2);
      }
      return s;
    }
    return r;
  }, t.prototype.contain = function(r, n) {
    var i = this.transformCoordToLocal(r, n), a = this.getBoundingRect(), o = this.style;
    if (r = i[0], n = i[1], a.contain(r, n)) {
      var s = this.path;
      if (this.hasStroke()) {
        var u = o.lineWidth, l = o.strokeNoScale ? this.getLineScale() : 1;
        if (l > 1e-10 && (this.hasFill() || (u = Math.max(u, this.strokeContainThreshold)), PS(s, u / l, r, n)))
          return !0;
      }
      if (this.hasFill())
        return RS(s, r, n);
    }
    return !1;
  }, t.prototype.dirtyShape = function() {
    this.__dirty |= kn, this._rect && (this._rect = null), this._decalEl && this._decalEl.dirtyShape(), this.markRedraw();
  }, t.prototype.dirty = function() {
    this.dirtyStyle(), this.dirtyShape();
  }, t.prototype.animateShape = function(r) {
    return this.animate("shape", r);
  }, t.prototype.updateDuringAnimation = function(r) {
    r === "style" ? this.dirtyStyle() : r === "shape" ? this.dirtyShape() : this.markRedraw();
  }, t.prototype.attrKV = function(r, n) {
    r === "shape" ? this.setShape(n) : e.prototype.attrKV.call(this, r, n);
  }, t.prototype.setShape = function(r, n) {
    var i = this.shape;
    return i || (i = this.shape = {}), typeof r == "string" ? i[r] = n : A(i, r), this.dirtyShape(), this;
  }, t.prototype.shapeChanged = function() {
    return !!(this.__dirty & kn);
  }, t.prototype.createStyle = function(r) {
    return ha(dg, r);
  }, t.prototype._innerSaveToNormal = function(r) {
    e.prototype._innerSaveToNormal.call(this, r);
    var n = this._normalState;
    r.shape && !n.shape && (n.shape = A({}, this.shape));
  }, t.prototype._applyStateObj = function(r, n, i, a, o, s) {
    if (e.prototype._applyStateObj.call(this, r, n, i, a, o, s), this.__inHover !== hs) {
      var u = !(n && a), l;
      if (n && n.shape ? o ? a ? l = n.shape : (l = A({}, i.shape), A(l, n.shape)) : (l = A({}, a ? this.shape : i.shape), A(l, n.shape)) : u && (l = i.shape), l)
        if (o) {
          this.shape = A({}, this.shape);
          for (var h = {}, f = ft(l), v = 0; v < f.length; v++) {
            var c = f[v];
            typeof l[c] == "object" ? this.shape[c] = l[c] : h[c] = l[c];
          }
          this._transitionState(r, {
            shape: h
          }, s);
        } else
          this.shape = l, this.dirtyShape();
    }
  }, t.prototype._mergeStates = function(r) {
    for (var n = e.prototype._mergeStates.call(this, r), i, a = 0; a < r.length; a++) {
      var o = r[a];
      o.shape && (i = i || {}, this._mergeStyle(i, o.shape));
    }
    return i && (n.shape = i), n;
  }, t.prototype.getAnimationStyleProps = function() {
    return AS;
  }, t.prototype.isZeroArea = function() {
    return !1;
  }, t.extend = function(r) {
    var n = function(a) {
      B(o, a);
      function o(s) {
        var u = a.call(this, s) || this;
        return r.init && r.init.call(u, s), u;
      }
      return o.prototype.getDefaultStyle = function() {
        return $(r.style);
      }, o.prototype.getDefaultShape = function() {
        return $(r.shape);
      }, o;
    }(t);
    for (var i in r)
      typeof r[i] == "function" && (n.prototype[i] = r[i]);
    return n;
  }, t.initDefaultProps = function() {
    var r = t.prototype;
    r.type = "path", r.strokeContainThreshold = 5, r.segmentIgnoreThreshold = 0, r.subPixelOptimize = !1, r.autoBatch = !1, r.__dirty = Wt | Li | kn;
  }(), t;
}(ca), OS = mt({
  strokeFirst: !0,
  font: mr,
  x: 0,
  y: 0,
  textAlign: "left",
  textBaseline: "top",
  miterLimit: 2
}, dg), zo = function(e) {
  B(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.hasStroke = function() {
    return vg(this.style);
  }, t.prototype.hasFill = function() {
    var r = this.style, n = r.fill;
    return n != null && n !== "none";
  }, t.prototype.createStyle = function(r) {
    return ha(OS, r);
  }, t.prototype.setBoundingRect = function(r) {
    this._rect = r;
  }, t.prototype.getBoundingRect = function() {
    return this._rect || (this._rect = dS(this.style)), this._rect;
  }, t.initDefaultProps = function() {
    var r = t.prototype;
    r.dirtyRectTolerance = 10;
  }(), t;
}(ca);
zo.prototype.type = "tspan";
var kS = mt({
  x: 0,
  y: 0
}, nn), NS = {
  style: mt({
    x: !0,
    y: !0,
    width: !0,
    height: !0,
    sx: !0,
    sy: !0,
    sWidth: !0,
    sHeight: !0
  }, ms.style)
};
function BS(e) {
  return !!(e && typeof e != "string" && e.width && e.height);
}
var Mr = function(e) {
  B(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.createStyle = function(r) {
    return ha(kS, r);
  }, t.prototype._getSize = function(r) {
    var n = this.style, i = n[r];
    if (i != null)
      return i;
    var a = BS(n.image) ? n.image : this.__image;
    if (!a)
      return 0;
    var o = r === "width" ? "height" : "width", s = n[o];
    return s == null ? a[r] : a[r] / a[o] * s;
  }, t.prototype.getWidth = function() {
    return this._getSize("width");
  }, t.prototype.getHeight = function() {
    return this._getSize("height");
  }, t.prototype.getAnimationStyleProps = function() {
    return NS;
  }, t.prototype.getBoundingRect = function() {
    var r = this.style;
    return this._rect || (this._rect = new H(r.x || 0, r.y || 0, this.getWidth(), this.getHeight())), this._rect;
  }, t;
}(ca);
Mr.prototype.type = "image";
function FS(e, t) {
  var r = t.x, n = t.y, i = t.width, a = t.height, o = t.r, s, u, l, h;
  i < 0 && (r = r + i, i = -i), a < 0 && (n = n + a, a = -a), typeof o == "number" ? s = u = l = h = o : o instanceof Array ? o.length === 1 ? s = u = l = h = o[0] : o.length === 2 ? (s = l = o[0], u = h = o[1]) : o.length === 3 ? (s = o[0], u = h = o[1], l = o[2]) : (s = o[0], u = o[1], l = o[2], h = o[3]) : s = u = l = h = 0;
  var f;
  s + u > i && (f = s + u, s *= i / f, u *= i / f), l + h > i && (f = l + h, l *= i / f, h *= i / f), u + l > a && (f = u + l, u *= a / f, l *= a / f), s + h > a && (f = s + h, s *= a / f, h *= a / f), e.moveTo(r + s, n), e.lineTo(r + i - u, n), u !== 0 && e.arc(r + i - u, n + u, u, -Math.PI / 2, 0), e.lineTo(r + i, n + a - l), l !== 0 && e.arc(r + i - l, n + a - l, l, 0, Math.PI / 2), e.lineTo(r + h, n + a), h !== 0 && e.arc(r + h, n + a - h, h, Math.PI / 2, Math.PI), e.lineTo(r, n + s), s !== 0 && e.arc(r + s, n + s, s, Math.PI, Math.PI * 1.5), e.closePath();
}
var Fn = Math.round;
function zS(e, t, r) {
  if (t) {
    var n = t.x1, i = t.x2, a = t.y1, o = t.y2;
    e.x1 = n, e.x2 = i, e.y1 = a, e.y2 = o;
    var s = r && r.lineWidth;
    return s && (Fn(n * 2) === Fn(i * 2) && (e.x1 = e.x2 = zn(n, s, !0)), Fn(a * 2) === Fn(o * 2) && (e.y1 = e.y2 = zn(a, s, !0))), e;
  }
}
function VS(e, t, r) {
  if (t) {
    var n = t.x, i = t.y, a = t.width, o = t.height;
    e.x = n, e.y = i, e.width = a, e.height = o;
    var s = r && r.lineWidth;
    return s && (e.x = zn(n, s, !0), e.y = zn(i, s, !0), e.width = Math.max(zn(n + a, s, !1) - e.x, a === 0 ? 0 : 1), e.height = Math.max(zn(i + o, s, !1) - e.y, o === 0 ? 0 : 1)), e;
  }
}
function zn(e, t, r) {
  if (!t)
    return e;
  var n = Fn(e * 2);
  return (n + Fn(t)) % 2 === 0 ? n / 2 : (n + (r ? 1 : -1)) / 2;
}
var HS = /* @__PURE__ */ function() {
  function e() {
    this.x = 0, this.y = 0, this.width = 0, this.height = 0;
  }
  return e;
}(), GS = {}, Fe = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new HS();
  }, t.prototype.buildPath = function(r, n) {
    var i, a, o, s;
    if (this.subPixelOptimize) {
      var u = VS(GS, n, this.style);
      i = u.x, a = u.y, o = u.width, s = u.height, u.r = n.r, n = u;
    } else
      i = n.x, a = n.y, o = n.width, s = n.height;
    n.r ? FS(r, n) : r.rect(i, a, o, s);
  }, t.prototype.isZeroArea = function() {
    return !this.shape.width || !this.shape.height;
  }, t;
}(st);
Fe.prototype.type = "rect";
var xv = {
  fill: "#000"
}, Lv = 2, Ee = {}, US = {
  style: mt({
    fill: !0,
    stroke: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineWidth: !0,
    fontSize: !0,
    lineHeight: !0,
    width: !0,
    height: !0,
    textShadowColor: !0,
    textShadowBlur: !0,
    textShadowOffsetX: !0,
    textShadowOffsetY: !0,
    backgroundColor: !0,
    padding: !0,
    borderColor: !0,
    borderWidth: !0,
    borderRadius: !0
  }, ms.style)
}, vn = function(e) {
  B(t, e);
  function t(r) {
    var n = e.call(this) || this;
    return n.type = "text", n._children = [], n._defaultStyle = xv, n.attr(r), n;
  }
  return t.prototype.childrenRef = function() {
    return this._children;
  }, t.prototype.update = function() {
    e.prototype.update.call(this), this.styleChanged() && this._updateSubTexts();
    for (var r = 0; r < this._children.length; r++) {
      var n = this._children[r];
      n.zlevel = this.zlevel, n.z = this.z, n.z2 = this.z2, n.culling = this.culling, n.cursor = this.cursor, n.invisible = this.invisible;
    }
  }, t.prototype.updateTransform = function() {
    var r = this.innerTransformable;
    r ? (r.updateTransform(), r.transform && (this.transform = r.transform)) : e.prototype.updateTransform.call(this);
  }, t.prototype.getLocalTransform = function(r) {
    var n = this.innerTransformable;
    return n ? n.getLocalTransform(r) : e.prototype.getLocalTransform.call(this, r);
  }, t.prototype.getComputedTransform = function() {
    return this.__hostTarget && (this.__hostTarget.getComputedTransform(), this.__hostTarget.updateInnerText(!0)), e.prototype.getComputedTransform.call(this);
  }, t.prototype._updateSubTexts = function() {
    this._childCursor = 0, ZS(this.style), this.style.rich ? this._updateRichTexts() : this._updatePlainTexts(), this._children.length = this._childCursor, this.styleUpdated();
  }, t.prototype.addSelfToZr = function(r) {
    e.prototype.addSelfToZr.call(this, r);
    for (var n = 0; n < this._children.length; n++)
      this._children[n].__zr = r;
  }, t.prototype.removeSelfFromZr = function(r) {
    e.prototype.removeSelfFromZr.call(this, r);
    for (var n = 0; n < this._children.length; n++)
      this._children[n].__zr = null;
  }, t.prototype.getBoundingRect = function() {
    if (this.styleChanged() && this._updateSubTexts(), !this._rect) {
      for (var r = new H(0, 0, 0, 0), n = this._children, i = [], a = null, o = 0; o < n.length; o++) {
        var s = n[o], u = s.getBoundingRect(), l = s.getLocalTransform(i);
        l ? (r.copy(u), r.applyTransform(l), a = a || r.clone(), a.union(r)) : (a = a || u.clone(), a.union(u));
      }
      this._rect = a || r;
    }
    return this._rect;
  }, t.prototype.setDefaultTextStyle = function(r) {
    this._defaultStyle = r || xv;
  }, t.prototype.setTextContent = function(r) {
  }, t.prototype._mergeStyle = function(r, n) {
    if (!n)
      return r;
    var i = n.rich, a = r.rich || i && {};
    return A(r, n), i && a ? (this._mergeRich(a, i), r.rich = a) : a && (r.rich = a), r;
  }, t.prototype._mergeRich = function(r, n) {
    for (var i = ft(n), a = 0; a < i.length; a++) {
      var o = i[a];
      r[o] = r[o] || {}, A(r[o], n[o]);
    }
  }, t.prototype.getAnimationStyleProps = function() {
    return US;
  }, t.prototype._getOrCreateChild = function(r) {
    var n = this._children[this._childCursor];
    return (!n || !(n instanceof r)) && (n = new r()), this._children[this._childCursor++] = n, n.__zr = this.__zr, n.parent = this, n;
  }, t.prototype._updatePlainTexts = function() {
    var r = this.style, n = r.font || mr, i = r.padding, a = this._defaultStyle, o = r.x || 0, s = r.y || 0, u = r.align || a.align || "left", l = r.verticalAlign || a.verticalAlign || "top";
    Sv(Ee, a.overflowRect, o, s, u, l), o = Ee.baseX, s = Ee.baseY;
    var h = Nv(r), f = sS(h, r, Ee.outerWidth, Ee.outerHeight), v = mu(r), c = !!r.backgroundColor, d = f.outerHeight, y = f.outerWidth, p = f.lines, g = f.lineHeight;
    this.isTruncated = !!f.isTruncated;
    var m = o, _ = rn(s, f.contentHeight, l);
    if (v || i) {
      var S = qn(o, y, u), w = rn(s, d, l);
      v && this._renderBackground(r, r, S, w, y, d);
    }
    _ += g / 2, i && (m = kv(o, u, i), l === "top" ? _ += i[0] : l === "bottom" && (_ -= i[2]));
    for (var b = 0, M = !1, C = !1, T = Ov("fill" in r ? r.fill : (C = !0, a.fill)), I = Av("stroke" in r ? r.stroke : !c && (!a.autoStroke || C) ? (b = Lv, M = !0, a.stroke) : null), x = r.textShadowBlur > 0, E = 0; E < p.length; E++) {
      var L = this._getOrCreateChild(zo), R = L.createStyle();
      L.useStyle(R), R.text = p[E], R.x = m, R.y = _, R.textAlign = u, R.textBaseline = "middle", R.opacity = r.opacity, R.strokeFirst = !0, x && (R.shadowBlur = r.textShadowBlur || 0, R.shadowColor = r.textShadowColor || "transparent", R.shadowOffsetX = r.textShadowOffsetX || 0, R.shadowOffsetY = r.textShadowOffsetY || 0), R.stroke = I, R.fill = T, I && (R.lineWidth = r.lineWidth || b, R.lineDash = r.lineDash, R.lineDashOffset = r.lineDashOffset || 0), R.font = n, Rv(R, r), _ += g, L.setBoundingRect(Ol(R, f.contentWidth, f.calculatedLineHeight, M ? 0 : null));
    }
  }, t.prototype._updateRichTexts = function() {
    var r = this.style, n = this._defaultStyle, i = r.align || n.align, a = r.verticalAlign || n.verticalAlign, o = r.x || 0, s = r.y || 0;
    Sv(Ee, n.overflowRect, o, s, i, a), o = Ee.baseX, s = Ee.baseY;
    var u = Nv(r), l = fS(u, r, Ee.outerWidth, Ee.outerHeight, i), h = l.width, f = l.outerWidth, v = l.outerHeight, c = r.padding;
    this.isTruncated = !!l.isTruncated;
    var d = qn(o, f, i), y = rn(s, v, a), p = d, g = y;
    c && (p += c[3], g += c[0]);
    var m = p + h;
    mu(r) && this._renderBackground(r, r, d, y, f, v);
    for (var _ = !!r.backgroundColor, S = 0; S < l.lines.length; S++) {
      for (var w = l.lines[S], b = w.tokens, M = b.length, C = w.lineHeight, T = w.width, I = 0, x = p, E = m, L = M - 1, R = void 0; I < M && (R = b[I], !R.align || R.align === "left"); )
        this._placeToken(R, r, C, g, x, "left", _), T -= R.width, x += R.width, I++;
      for (; L >= 0 && (R = b[L], R.align === "right"); )
        this._placeToken(R, r, C, g, E, "right", _), T -= R.width, E -= R.width, L--;
      for (x += (h - (x - p) - (m - E) - T) / 2; I <= L; )
        R = b[I], this._placeToken(R, r, C, g, x + R.width / 2, "center", _), x += R.width, I++;
      g += C;
    }
  }, t.prototype._placeToken = function(r, n, i, a, o, s, u) {
    var l = n.rich[r.styleName] || {};
    l.text = r.text;
    var h = r.verticalAlign, f = a + i / 2;
    h === "top" ? f = a + r.height / 2 : h === "bottom" && (f = a + i - r.height / 2);
    var v = !r.isLineHolder && mu(l);
    v && this._renderBackground(l, n, s === "right" ? o - r.width : s === "center" ? o - r.width / 2 : o, f - r.height / 2, r.width, r.height);
    var c = !!l.backgroundColor, d = r.textPadding;
    d && (o = kv(o, s, d), f -= r.height / 2 - d[0] - r.innerHeight / 2);
    var y = this._getOrCreateChild(zo), p = y.createStyle();
    y.useStyle(p);
    var g = this._defaultStyle, m = !1, _ = 0, S = !1, w = Ov("fill" in l ? l.fill : "fill" in n ? n.fill : (m = !0, g.fill)), b = Av("stroke" in l ? l.stroke : "stroke" in n ? n.stroke : !c && !u && (!g.autoStroke || m) ? (_ = Lv, S = !0, g.stroke) : null), M = l.textShadowBlur > 0 || n.textShadowBlur > 0;
    p.text = r.text, p.x = o, p.y = f, M && (p.shadowBlur = l.textShadowBlur || n.textShadowBlur || 0, p.shadowColor = l.textShadowColor || n.textShadowColor || "transparent", p.shadowOffsetX = l.textShadowOffsetX || n.textShadowOffsetX || 0, p.shadowOffsetY = l.textShadowOffsetY || n.textShadowOffsetY || 0), p.textAlign = s, p.textBaseline = "middle", p.font = r.font || mr, p.opacity = je(l.opacity, n.opacity, 1), Rv(p, l), b && (p.lineWidth = je(l.lineWidth, n.lineWidth, _), p.lineDash = W(l.lineDash, n.lineDash), p.lineDashOffset = n.lineDashOffset || 0, p.stroke = b), w && (p.fill = w), y.setBoundingRect(Ol(p, r.contentWidth, r.contentHeight, S ? 0 : null));
  }, t.prototype._renderBackground = function(r, n, i, a, o, s) {
    var u = r.backgroundColor, l = r.borderWidth, h = r.borderColor, f = u && u.image, v = u && !f, c = r.borderRadius, d = this, y, p;
    if (v || r.lineHeight || l && h) {
      y = this._getOrCreateChild(Fe), y.useStyle(y.createStyle()), y.style.fill = null;
      var g = y.shape;
      g.x = i, g.y = a, g.width = o, g.height = s, g.r = c, y.dirtyShape();
    }
    if (v) {
      var m = y.style;
      m.fill = u || null, m.fillOpacity = W(r.fillOpacity, 1);
    } else if (f) {
      p = this._getOrCreateChild(Mr), p.onload = function() {
        d.dirtyStyle();
      };
      var _ = p.style;
      _.image = u.image, _.x = i, _.y = a, _.width = o, _.height = s;
    }
    if (l && h) {
      var m = y.style;
      m.lineWidth = l, m.stroke = h, m.strokeOpacity = W(r.strokeOpacity, 1), m.lineDash = r.borderDash, m.lineDashOffset = r.borderDashOffset || 0, y.strokeContainThreshold = 0, y.hasFill() && y.hasStroke() && (m.strokeFirst = !0, m.lineWidth *= 2);
    }
    var S = (y || p).style;
    S.shadowBlur = r.shadowBlur || 0, S.shadowColor = r.shadowColor || "transparent", S.shadowOffsetX = r.shadowOffsetX || 0, S.shadowOffsetY = r.shadowOffsetY || 0, S.opacity = je(r.opacity, n.opacity, 1);
  }, t.makeFont = function(r) {
    var n = "";
    return $S(r) && (n = [
      r.fontStyle,
      r.fontWeight,
      XS(r.fontSize),
      r.fontFamily || "sans-serif"
    ].join(" ")), n && Qe(n) || r.textFont || r.font;
  }, t;
}(ca), YS = { left: !0, right: 1, center: 1 }, WS = { top: 1, bottom: 1, middle: 1 }, Ev = ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
function XS(e) {
  return typeof e == "string" && (e.indexOf("px") !== -1 || e.indexOf("rem") !== -1 || e.indexOf("em") !== -1) ? e : isNaN(+e) ? vf + "px" : e + "px";
}
function Rv(e, t) {
  for (var r = 0; r < Ev.length; r++) {
    var n = Ev[r], i = t[n];
    i != null && (e[n] = i);
  }
}
function $S(e) {
  return e.fontSize != null || e.fontFamily || e.fontWeight;
}
function ZS(e) {
  return Pv(e), D(e.rich, Pv), e;
}
function Pv(e) {
  if (e) {
    e.font = vn.makeFont(e);
    var t = e.align;
    t === "middle" && (t = "center"), e.align = t == null || YS[t] ? t : "left";
    var r = e.verticalAlign;
    r === "center" && (r = "middle"), e.verticalAlign = r == null || WS[r] ? r : "top";
    var n = e.padding;
    n && (e.padding = ss(e.padding));
  }
}
function Av(e, t) {
  return e == null || t <= 0 || e === "transparent" || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function Ov(e) {
  return e == null || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function kv(e, t, r) {
  return t === "right" ? e - r[1] : t === "center" ? e + r[3] / 2 - r[1] / 2 : e + r[3];
}
function Nv(e) {
  var t = e.text;
  return t != null && (t += ""), t;
}
function mu(e) {
  return !!(e.backgroundColor || e.lineHeight || e.borderWidth && e.borderColor);
}
var Ft = ut(), qS = function(e, t, r, n) {
  if (n) {
    var i = Ft(n);
    i.dataIndex = r, i.dataType = t, i.seriesIndex = e, i.ssrType = "chart", n.type === "group" && n.traverse(function(a) {
      var o = Ft(a);
      o.seriesIndex = e, o.dataIndex = r, o.dataType = t, o.ssrType = "chart";
    });
  }
}, _s = "undefined", Ss = "series", pg = V(["tooltip", "label", "itemName", "itemId", "itemGroupId", "itemChildGroupId", "seriesName"]), re = "original", Rt = "arrayRows", Ce = "objectRows", Ue = "keyedColumns", yr = "typedArray", gg = "unknown", ze = "column", gn = "row", yg = "Roam", KS = [
  "getDom",
  "getZr",
  "getWidth",
  "getHeight",
  "getDevicePixelRatio",
  "dispatchAction",
  "isSSR",
  "isDisposed",
  "on",
  "off",
  "getDataURL",
  "getConnectedDataURL",
  // 'getModel',
  "getOption",
  // 'getViewOfComponentModel',
  // 'getViewOfSeriesModel',
  "getId",
  "updateLabelLayout"
], mg = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      D(KS, function(r) {
        this[r] = lt(t[r], t);
      }, this);
    }
    return e;
  }()
);
function _g(e, t) {
  return t.mainType === Ss ? e.getViewOfSeriesModel(t) : e.getViewOfComponentModel(t);
}
var Bv = 1, Fv = {}, Sg = ut(), xf = ut(), wg = 0, Lf = 1, Ef = 2, Ge = ["emphasis", "blur", "select"], zv = ["normal", "emphasis", "blur", "select"], QS = 10, JS = 9, an = "highlight", po = "downplay", Vo = "select", Bl = "unselect", Ho = "toggleSelect", Rf = "selectchanged";
function bn(e) {
  return e != null && e !== "none";
}
function ws(e, t, r) {
  e.onHoverStateChange && (e.hoverState || 0) !== r && e.onHoverStateChange(t), e.hoverState = r;
}
function bg(e) {
  ws(e, "emphasis", Ef);
}
function Tg(e) {
  e.hoverState === Ef && ws(e, "normal", wg);
}
function Pf(e) {
  ws(e, "blur", Lf);
}
function Cg(e) {
  e.hoverState === Lf && ws(e, "normal", wg);
}
function jS(e) {
  e.selected = !0;
}
function tw(e) {
  e.selected = !1;
}
function Vv(e, t, r) {
  t(e, r);
}
function tr(e, t, r) {
  Vv(e, t, r), e.isGroup && e.traverse(function(n) {
    Vv(n, t, r);
  });
}
function ew(e, t, r, n) {
  for (var i = e.style, a = {}, o = 0; o < t.length; o++) {
    var s = t[o], u = i[s];
    a[s] = u == null ? n && n[s] : u;
  }
  for (var o = 0; o < e.animators.length; o++) {
    var l = e.animators[o];
    l.__fromStateTransition && l.__fromStateTransition.indexOf(r) < 0 && l.targetName === "style" && l.saveTo(a, t);
  }
  return a;
}
function rw(e, t, r, n) {
  var i = r && at(r, "select") >= 0, a = !1;
  if (e instanceof st) {
    var o = Sg(e), s = i && o.selectFill || o.normalFill, u = i && o.selectStroke || o.normalStroke;
    if (bn(s) || bn(u)) {
      n = n || {};
      var l = n.style || {};
      l.fill === "inherit" ? (a = !0, n = A({}, n), l = A({}, l), l.fill = s) : !bn(l.fill) && bn(s) ? (a = !0, n = A({}, n), l = A({}, l), l.fill = Sl(s)) : !bn(l.stroke) && bn(u) && (a || (n = A({}, n), l = A({}, l)), l.stroke = Sl(u)), n.style = l;
    }
  }
  if (n && n.z2 == null) {
    a || (n = A({}, n));
    var h = e.z2EmphasisLift;
    n.z2 = e.z2 + (h != null ? h : QS);
  }
  return n;
}
function nw(e, t, r) {
  if (r && r.z2 == null) {
    r = A({}, r);
    var n = e.z2SelectLift;
    r.z2 = e.z2 + (n != null ? n : JS);
  }
  return r;
}
function iw(e, t, r) {
  var n = at(e.currentStates, t) >= 0, i = e.style.opacity, a = n ? null : ew(e, ["opacity"], t, {
    opacity: 1
  });
  r = r || {};
  var o = r.style || {};
  return o.opacity == null && (r = A({}, r), o = A({
    // Already being applied 'emphasis'. DON'T mul opacity multiple times.
    opacity: n ? i : a.opacity * 0.1
  }, o), r.style = o), r;
}
function _u(e, t) {
  var r = this.states[e];
  if (this.style) {
    if (e === "emphasis")
      return rw(this, e, t, r);
    if (e === "blur")
      return iw(this, e, r);
    if (e === "select")
      return nw(this, e, r);
  }
  return r;
}
function aw(e) {
  e.stateProxy = _u;
  var t = e.getTextContent(), r = e.getTextGuideLine();
  t && (t.stateProxy = _u), r && (r.stateProxy = _u);
}
function Hv(e, t) {
  !xg(e, t) && !e.__highByOuter && tr(e, bg);
}
function Gv(e, t) {
  !xg(e, t) && !e.__highByOuter && tr(e, Tg);
}
function ra(e, t) {
  e.__highByOuter |= 1 << (t || 0), tr(e, bg);
}
function na(e, t) {
  !(e.__highByOuter &= ~(1 << (t || 0))) && tr(e, Tg);
}
function ow(e) {
  tr(e, Pf);
}
function Mg(e) {
  tr(e, Cg);
}
function Dg(e) {
  tr(e, jS);
}
function Ig(e) {
  tr(e, tw);
}
function xg(e, t) {
  return e.__highDownSilentOnTouch && t.zrByTouch;
}
function Lg(e) {
  var t = e.getModel(), r = [], n = [];
  t.eachComponent(function(i, a) {
    var o = xf(a), s = _g(e, a), u = i === "series";
    !u && n.push(s), o.isBlured && (s.group.traverse(function(l) {
      Cg(l);
    }), u && r.push(a)), o.isBlured = !1;
  }), D(n, function(i) {
    i && i.toggleBlurSeries && i.toggleBlurSeries(r, !1, t);
  });
}
function Fl(e, t, r, n) {
  var i = n.getModel();
  r = r || "coordinateSystem";
  function a(l, h) {
    for (var f = 0; f < h.length; f++) {
      var v = l.getItemGraphicEl(h[f]);
      v && Mg(v);
    }
  }
  if (e != null && !(!t || t === "none")) {
    var o = i.getSeriesByIndex(e), s = o.coordinateSystem;
    s && s.master && (s = s.master);
    var u = [];
    i.eachSeries(function(l) {
      var h = o === l, f = l.coordinateSystem;
      f && f.master && (f = f.master);
      var v = f && s ? f === s : h;
      if (!// Not blur other series if blurScope series
      (r === "series" && !h || r === "coordinateSystem" && !v || t === "series" && h)) {
        var c = n.getViewOfSeriesModel(l);
        if (c.group.traverse(function(p) {
          p.__highByOuter && h && t === "self" || Pf(p);
        }), $t(t))
          a(l.getData(), t);
        else if (F(t))
          for (var d = ft(t), y = 0; y < d.length; y++)
            a(l.getData(d[y]), t[d[y]]);
        u.push(l), xf(l).isBlured = !0;
      }
    }), i.eachComponent(function(l, h) {
      if (l !== "series") {
        var f = n.getViewOfComponentModel(h);
        f && f.toggleBlurSeries && f.toggleBlurSeries(u, !0, i);
      }
    });
  }
}
function zl(e, t, r) {
  if (!(e == null || t == null)) {
    var n = r.getModel().getComponent(e, t);
    if (n) {
      xf(n).isBlured = !0;
      var i = r.getViewOfComponentModel(n);
      !i || !i.focusBlurEnabled || i.group.traverse(function(a) {
        Pf(a);
      });
    }
  }
}
function sw(e, t, r) {
  var n = e.seriesIndex, i = e.getData(t.dataType);
  if (i) {
    var a = ds(i, t);
    a = (N(a) ? a[0] : a) || 0;
    var o = i.getItemGraphicEl(a);
    if (!o)
      for (var s = i.count(), u = 0; !o && u < s; )
        o = i.getItemGraphicEl(u++);
    if (o) {
      var l = Ft(o);
      Fl(n, l.focus, l.blurScope, r);
    } else {
      var h = e.get(["emphasis", "focus"]), f = e.get(["emphasis", "blurScope"]);
      h != null && Fl(n, h, f, r);
    }
  }
}
function Af(e, t, r, n) {
  var i = {
    focusSelf: !1,
    dispatchers: null
  };
  if (e == null || e === "series" || t == null || r == null)
    return i;
  var a = n.getModel().getComponent(e, t);
  if (!a)
    return i;
  var o = n.getViewOfComponentModel(a);
  if (!o || !o.findHighDownDispatchers)
    return i;
  for (var s = o.findHighDownDispatchers(r), u, l = 0; l < s.length; l++)
    if (Ft(s[l]).focus === "self") {
      u = !0;
      break;
    }
  return {
    focusSelf: u,
    dispatchers: s
  };
}
function uw(e, t, r) {
  var n = Ft(e), i = Af(n.componentMainType, n.componentIndex, n.componentHighDownName, r), a = i.dispatchers, o = i.focusSelf;
  a ? (o && zl(n.componentMainType, n.componentIndex, r), D(a, function(s) {
    return Hv(s, t);
  })) : (Fl(n.seriesIndex, n.focus, n.blurScope, r), n.focus === "self" && zl(n.componentMainType, n.componentIndex, r), Hv(e, t));
}
function lw(e, t, r) {
  Lg(r);
  var n = Ft(e), i = Af(n.componentMainType, n.componentIndex, n.componentHighDownName, r).dispatchers;
  i ? D(i, function(a) {
    return Gv(a, t);
  }) : Gv(e, t);
}
function fw(e, t, r) {
  if (Hl(t)) {
    var n = t.dataType, i = e.getData(n), a = ds(i, t);
    N(a) || (a = [a]), e[t.type === Ho ? "toggleSelect" : t.type === Vo ? "select" : "unselect"](a, n);
  }
}
function Uv(e) {
  var t = e.getAllData();
  D(t, function(r) {
    var n = r.data, i = r.type;
    n.eachItemGraphicEl(function(a, o) {
      e.isSelected(o, i) ? Dg(a) : Ig(a);
    });
  });
}
function hw(e) {
  var t = [];
  return e.eachSeries(function(r) {
    var n = r.getAllData();
    D(n, function(i) {
      i.data;
      var a = i.type, o = r.getSelectedDataIndices();
      if (o.length > 0) {
        var s = {
          dataIndex: o,
          seriesIndex: r.seriesIndex
        };
        a != null && (s.dataType = a), t.push(s);
      }
    });
  }), t;
}
function Eg(e, t, r) {
  Pg(e, !0), tr(e, aw), cw(e, t, r);
}
function vw(e) {
  Pg(e, !1);
}
function Rg(e, t, r, n) {
  n ? vw(e) : Eg(e, t, r);
}
function cw(e, t, r) {
  var n = Ft(e);
  t != null ? (n.focus = t, n.blurScope = r) : n.focus && (n.focus = null);
}
function Pg(e, t) {
  var r = t === !1, n = e;
  e.highDownSilentOnTouch && (n.__highDownSilentOnTouch = e.highDownSilentOnTouch), (!r || n.__highDownDispatcher) && (n.__highByOuter = n.__highByOuter || 0, n.__highDownDispatcher = !r);
}
function Vl(e) {
  return !!(e && e.__highDownDispatcher);
}
function dw(e) {
  var t = Fv[e];
  return t == null && Bv <= 32 && (t = Fv[e] = Bv++), t;
}
function Hl(e) {
  var t = e.type;
  return t === Vo || t === Bl || t === Ho;
}
function Yv(e) {
  var t = e.type;
  return t === an || t === po;
}
function pw(e) {
  var t = Sg(e);
  t.normalFill = e.style.fill, t.normalStroke = e.style.stroke;
  var r = e.states.select || {};
  t.selectFill = r.style && r.style.fill || null, t.selectStroke = r.style && r.style.stroke || null;
}
var Tn = Qn.CMD, gw = [[], [], []], Wv = Math.sqrt, yw = Math.atan2;
function mw(e, t) {
  if (t) {
    var r = e.data, n = e.len(), i, a, o, s, u, l, h = Tn.M, f = Tn.C, v = Tn.L, c = Tn.R, d = Tn.A, y = Tn.Q;
    for (o = 0, s = 0; o < n; ) {
      switch (i = r[o++], s = o, a = 0, i) {
        case h:
          a = 1;
          break;
        case v:
          a = 1;
          break;
        case f:
          a = 3;
          break;
        case y:
          a = 2;
          break;
        case d:
          var p = t[4], g = t[5], m = Wv(t[0] * t[0] + t[1] * t[1]), _ = Wv(t[2] * t[2] + t[3] * t[3]), S = yw(-t[1] / _, t[0] / m);
          r[o] *= m, r[o++] += p, r[o] *= _, r[o++] += g, r[o++] *= m, r[o++] *= _, r[o++] += S, r[o++] += S, o += 2, s = o;
          break;
        case c:
          l[0] = r[o++], l[1] = r[o++], fe(l, l, t), r[s++] = l[0], r[s++] = l[1], l[0] += r[o++], l[1] += r[o++], fe(l, l, t), r[s++] = l[0], r[s++] = l[1];
      }
      for (u = 0; u < a; u++) {
        var w = gw[u];
        w[0] = r[o++], w[1] = r[o++], fe(w, w, t), r[s++] = w[0], r[s++] = w[1];
      }
    }
    e.increaseVersion();
  }
}
var Su = Math.sqrt, Ra = Math.sin, Pa = Math.cos, ci = Math.PI;
function Xv(e) {
  return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
}
function Gl(e, t) {
  return (e[0] * t[0] + e[1] * t[1]) / (Xv(e) * Xv(t));
}
function $v(e, t) {
  return (e[0] * t[1] < e[1] * t[0] ? -1 : 1) * Math.acos(Gl(e, t));
}
function Zv(e, t, r, n, i, a, o, s, u, l, h) {
  var f = u * (ci / 180), v = Pa(f) * (e - r) / 2 + Ra(f) * (t - n) / 2, c = -1 * Ra(f) * (e - r) / 2 + Pa(f) * (t - n) / 2, d = v * v / (o * o) + c * c / (s * s);
  d > 1 && (o *= Su(d), s *= Su(d));
  var y = (i === a ? -1 : 1) * Su((o * o * (s * s) - o * o * (c * c) - s * s * (v * v)) / (o * o * (c * c) + s * s * (v * v))) || 0, p = y * o * c / s, g = y * -s * v / o, m = (e + r) / 2 + Pa(f) * p - Ra(f) * g, _ = (t + n) / 2 + Ra(f) * p + Pa(f) * g, S = $v([1, 0], [(v - p) / o, (c - g) / s]), w = [(v - p) / o, (c - g) / s], b = [(-1 * v - p) / o, (-1 * c - g) / s], M = $v(w, b);
  if (Gl(w, b) <= -1 && (M = ci), Gl(w, b) >= 1 && (M = 0), M < 0) {
    var C = Math.round(M / ci * 1e6) / 1e6;
    M = ci * 2 + C % 2 * ci;
  }
  h.addData(l, m, _, o, s, S, M, f, a);
}
var _w = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig, Sw = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function ww(e) {
  var t = new Qn();
  if (!e)
    return t;
  var r = 0, n = 0, i = r, a = n, o, s = Qn.CMD, u = e.match(_w);
  if (!u)
    return t;
  for (var l = 0; l < u.length; l++) {
    for (var h = u[l], f = h.charAt(0), v = void 0, c = h.match(Sw) || [], d = c.length, y = 0; y < d; y++)
      c[y] = parseFloat(c[y]);
    for (var p = 0; p < d; ) {
      var g = void 0, m = void 0, _ = void 0, S = void 0, w = void 0, b = void 0, M = void 0, C = r, T = n, I = void 0, x = void 0;
      switch (f) {
        case "l":
          r += c[p++], n += c[p++], v = s.L, t.addData(v, r, n);
          break;
        case "L":
          r = c[p++], n = c[p++], v = s.L, t.addData(v, r, n);
          break;
        case "m":
          r += c[p++], n += c[p++], v = s.M, t.addData(v, r, n), i = r, a = n, f = "l";
          break;
        case "M":
          r = c[p++], n = c[p++], v = s.M, t.addData(v, r, n), i = r, a = n, f = "L";
          break;
        case "h":
          r += c[p++], v = s.L, t.addData(v, r, n);
          break;
        case "H":
          r = c[p++], v = s.L, t.addData(v, r, n);
          break;
        case "v":
          n += c[p++], v = s.L, t.addData(v, r, n);
          break;
        case "V":
          n = c[p++], v = s.L, t.addData(v, r, n);
          break;
        case "C":
          v = s.C, t.addData(v, c[p++], c[p++], c[p++], c[p++], c[p++], c[p++]), r = c[p - 2], n = c[p - 1];
          break;
        case "c":
          v = s.C, t.addData(v, c[p++] + r, c[p++] + n, c[p++] + r, c[p++] + n, c[p++] + r, c[p++] + n), r += c[p - 2], n += c[p - 1];
          break;
        case "S":
          g = r, m = n, I = t.len(), x = t.data, o === s.C && (g += r - x[I - 4], m += n - x[I - 3]), v = s.C, C = c[p++], T = c[p++], r = c[p++], n = c[p++], t.addData(v, g, m, C, T, r, n);
          break;
        case "s":
          g = r, m = n, I = t.len(), x = t.data, o === s.C && (g += r - x[I - 4], m += n - x[I - 3]), v = s.C, C = r + c[p++], T = n + c[p++], r += c[p++], n += c[p++], t.addData(v, g, m, C, T, r, n);
          break;
        case "Q":
          C = c[p++], T = c[p++], r = c[p++], n = c[p++], v = s.Q, t.addData(v, C, T, r, n);
          break;
        case "q":
          C = c[p++] + r, T = c[p++] + n, r += c[p++], n += c[p++], v = s.Q, t.addData(v, C, T, r, n);
          break;
        case "T":
          g = r, m = n, I = t.len(), x = t.data, o === s.Q && (g += r - x[I - 4], m += n - x[I - 3]), r = c[p++], n = c[p++], v = s.Q, t.addData(v, g, m, r, n);
          break;
        case "t":
          g = r, m = n, I = t.len(), x = t.data, o === s.Q && (g += r - x[I - 4], m += n - x[I - 3]), r += c[p++], n += c[p++], v = s.Q, t.addData(v, g, m, r, n);
          break;
        case "A":
          _ = c[p++], S = c[p++], w = c[p++], b = c[p++], M = c[p++], C = r, T = n, r = c[p++], n = c[p++], v = s.A, Zv(C, T, r, n, b, M, _, S, w, v, t);
          break;
        case "a":
          _ = c[p++], S = c[p++], w = c[p++], b = c[p++], M = c[p++], C = r, T = n, r += c[p++], n += c[p++], v = s.A, Zv(C, T, r, n, b, M, _, S, w, v, t);
          break;
      }
    }
    (f === "z" || f === "Z") && (v = s.Z, t.addData(v), r = i, n = a), o = v;
  }
  return t.toStatic(), t;
}
var Ag = function(e) {
  B(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.applyTransform = function(r) {
  }, t;
}(st);
function Og(e) {
  return e.setData != null;
}
function kg(e, t) {
  var r = ww(e), n = A({}, t);
  return n.buildPath = function(i) {
    var a = Og(i);
    if (a && i.canSave()) {
      i.appendPath(r);
      var o = i.getContext();
      o && i.rebuildPath(o, 1);
    } else {
      var o = a ? i.getContext() : i;
      o && r.rebuildPath(o, 1);
    }
  }, n.applyTransform = function(i) {
    mw(r, i), this.dirtyShape();
  }, n;
}
function bw(e, t) {
  return new Ag(kg(e, t));
}
function Tw(e, t) {
  var r = kg(e, t), n = function(i) {
    B(a, i);
    function a(o) {
      var s = i.call(this, o) || this;
      return s.applyTransform = r.applyTransform, s.buildPath = r.buildPath, s;
    }
    return a;
  }(Ag);
  return n;
}
function Cw(e, t) {
  for (var r = [], n = e.length, i = 0; i < n; i++) {
    var a = e[i];
    r.push(a.getUpdatedPathProxy(!0));
  }
  var o = new st(t);
  return o.createPathProxy(), o.buildPath = function(s) {
    if (Og(s)) {
      s.appendPath(r);
      var u = s.getContext();
      u && s.rebuildPath(u, 1);
    }
  }, o;
}
var Mw = /* @__PURE__ */ function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0;
  }
  return e;
}(), bs = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new Mw();
  }, t.prototype.buildPath = function(r, n) {
    r.moveTo(n.cx + n.r, n.cy), r.arc(n.cx, n.cy, n.r, 0, Math.PI * 2);
  }, t;
}(st);
bs.prototype.type = "circle";
var Dw = /* @__PURE__ */ function() {
  function e() {
    this.cx = 0, this.cy = 0, this.rx = 0, this.ry = 0;
  }
  return e;
}(), Of = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new Dw();
  }, t.prototype.buildPath = function(r, n) {
    var i = 0.5522848, a = n.cx, o = n.cy, s = n.rx, u = n.ry, l = s * i, h = u * i;
    r.moveTo(a - s, o), r.bezierCurveTo(a - s, o - h, a - l, o - u, a, o - u), r.bezierCurveTo(a + l, o - u, a + s, o - h, a + s, o), r.bezierCurveTo(a + s, o + h, a + l, o + u, a, o + u), r.bezierCurveTo(a - l, o + u, a - s, o + h, a - s, o), r.closePath();
  }, t;
}(st);
Of.prototype.type = "ellipse";
var Ng = Math.PI, wu = Ng * 2, Gr = Math.sin, Cn = Math.cos, Iw = Math.acos, Ct = Math.atan2, qv = Math.abs, Vi = Math.sqrt, Ri = Math.max, Re = Math.min, de = 1e-4;
function xw(e, t, r, n, i, a, o, s) {
  var u = r - e, l = n - t, h = o - i, f = s - a, v = f * u - h * l;
  if (!(v * v < de))
    return v = (h * (t - a) - f * (e - i)) / v, [e + v * u, t + v * l];
}
function Aa(e, t, r, n, i, a, o) {
  var s = e - r, u = t - n, l = (o ? a : -a) / Vi(s * s + u * u), h = l * u, f = -l * s, v = e + h, c = t + f, d = r + h, y = n + f, p = (v + d) / 2, g = (c + y) / 2, m = d - v, _ = y - c, S = m * m + _ * _, w = i - a, b = v * y - d * c, M = (_ < 0 ? -1 : 1) * Vi(Ri(0, w * w * S - b * b)), C = (b * _ - m * M) / S, T = (-b * m - _ * M) / S, I = (b * _ + m * M) / S, x = (-b * m + _ * M) / S, E = C - p, L = T - g, R = I - p, k = x - g;
  return E * E + L * L > R * R + k * k && (C = I, T = x), {
    cx: C,
    cy: T,
    x0: -h,
    y0: -f,
    x1: C * (i / w - 1),
    y1: T * (i / w - 1)
  };
}
function Lw(e) {
  var t;
  if (N(e)) {
    var r = e.length;
    if (!r)
      return e;
    r === 1 ? t = [e[0], e[0], 0, 0] : r === 2 ? t = [e[0], e[0], e[1], e[1]] : r === 3 ? t = e.concat(e[2]) : t = e;
  } else
    t = [e, e, e, e];
  return t;
}
function Ew(e, t) {
  var r, n = Ri(t.r, 0), i = Ri(t.r0 || 0, 0), a = n > 0, o = i > 0;
  if (!(!a && !o)) {
    if (a || (n = i, i = 0), i > n) {
      var s = n;
      n = i, i = s;
    }
    var u = t.startAngle, l = t.endAngle;
    if (!(isNaN(u) || isNaN(l))) {
      var h = t.cx, f = t.cy, v = !!t.clockwise, c = qv(l - u), d = c > wu && c % wu;
      if (d > de && (c = d), !(n > de))
        e.moveTo(h, f);
      else if (c > wu - de)
        e.moveTo(h + n * Cn(u), f + n * Gr(u)), e.arc(h, f, n, u, l, !v), i > de && (e.moveTo(h + i * Cn(l), f + i * Gr(l)), e.arc(h, f, i, l, u, v));
      else {
        var y = void 0, p = void 0, g = void 0, m = void 0, _ = void 0, S = void 0, w = void 0, b = void 0, M = void 0, C = void 0, T = void 0, I = void 0, x = void 0, E = void 0, L = void 0, R = void 0, k = n * Cn(u), O = n * Gr(u), U = i * Cn(l), Q = i * Gr(l), q = c > de;
        if (q) {
          var J = t.cornerRadius;
          J && (r = Lw(J), y = r[0], p = r[1], g = r[2], m = r[3]);
          var rt = qv(n - i) / 2;
          if (_ = Re(rt, g), S = Re(rt, m), w = Re(rt, y), b = Re(rt, p), T = M = Ri(_, S), I = C = Ri(w, b), (M > de || C > de) && (x = n * Cn(l), E = n * Gr(l), L = i * Cn(u), R = i * Gr(u), c < Ng)) {
            var et = xw(k, O, L, R, x, E, U, Q);
            if (et) {
              var ot = k - et[0], X = O - et[1], nt = x - et[0], ht = E - et[1], qt = 1 / Gr(Iw((ot * nt + X * ht) / (Vi(ot * ot + X * X) * Vi(nt * nt + ht * ht))) / 2), Ye = Vi(et[0] * et[0] + et[1] * et[1]);
              T = Re(M, (n - Ye) / (qt + 1)), I = Re(C, (i - Ye) / (qt - 1));
            }
          }
        }
        if (!q)
          e.moveTo(h + k, f + O);
        else if (T > de) {
          var Kt = Re(g, T), wt = Re(m, T), Y = Aa(L, R, k, O, n, Kt, v), K = Aa(x, E, U, Q, n, wt, v);
          e.moveTo(h + Y.cx + Y.x0, f + Y.cy + Y.y0), T < M && Kt === wt ? e.arc(h + Y.cx, f + Y.cy, T, Ct(Y.y0, Y.x0), Ct(K.y0, K.x0), !v) : (Kt > 0 && e.arc(h + Y.cx, f + Y.cy, Kt, Ct(Y.y0, Y.x0), Ct(Y.y1, Y.x1), !v), e.arc(h, f, n, Ct(Y.cy + Y.y1, Y.cx + Y.x1), Ct(K.cy + K.y1, K.cx + K.x1), !v), wt > 0 && e.arc(h + K.cx, f + K.cy, wt, Ct(K.y1, K.x1), Ct(K.y0, K.x0), !v));
        } else
          e.moveTo(h + k, f + O), e.arc(h, f, n, u, l, !v);
        if (!(i > de) || !q)
          e.lineTo(h + U, f + Q);
        else if (I > de) {
          var Kt = Re(y, I), wt = Re(p, I), Y = Aa(U, Q, x, E, i, -wt, v), K = Aa(k, O, L, R, i, -Kt, v);
          e.lineTo(h + Y.cx + Y.x0, f + Y.cy + Y.y0), I < C && Kt === wt ? e.arc(h + Y.cx, f + Y.cy, I, Ct(Y.y0, Y.x0), Ct(K.y0, K.x0), !v) : (wt > 0 && e.arc(h + Y.cx, f + Y.cy, wt, Ct(Y.y0, Y.x0), Ct(Y.y1, Y.x1), !v), e.arc(h, f, i, Ct(Y.cy + Y.y1, Y.cx + Y.x1), Ct(K.cy + K.y1, K.cx + K.x1), v), Kt > 0 && e.arc(h + K.cx, f + K.cy, Kt, Ct(K.y1, K.x1), Ct(K.y0, K.x0), !v));
        } else
          e.lineTo(h + U, f + Q), e.arc(h, f, i, l, u, v);
      }
      e.closePath();
    }
  }
}
var Rw = /* @__PURE__ */ function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r0 = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0, this.cornerRadius = 0;
  }
  return e;
}(), kf = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new Rw();
  }, t.prototype.buildPath = function(r, n) {
    Ew(r, n);
  }, t.prototype.isZeroArea = function() {
    return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
  }, t;
}(st);
kf.prototype.type = "sector";
var Pw = /* @__PURE__ */ function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0, this.r0 = 0;
  }
  return e;
}(), Nf = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new Pw();
  }, t.prototype.buildPath = function(r, n) {
    var i = n.cx, a = n.cy, o = Math.PI * 2;
    r.moveTo(i + n.r, a), r.arc(i, a, n.r, 0, o, !1), r.moveTo(i + n.r0, a), r.arc(i, a, n.r0, 0, o, !0);
  }, t;
}(st);
Nf.prototype.type = "ring";
function Aw(e, t, r, n) {
  var i = [], a = [], o = [], s = [], u, l, h, f;
  if (n) {
    h = [1 / 0, 1 / 0], f = [-1 / 0, -1 / 0];
    for (var v = 0, c = e.length; v < c; v++)
      lr(h, h, e[v]), fr(f, f, e[v]);
    lr(h, h, n[0]), fr(f, f, n[1]);
  }
  for (var v = 0, c = e.length; v < c; v++) {
    var d = e[v];
    if (r)
      u = e[v ? v - 1 : c - 1], l = e[(v + 1) % c];
    else if (v === 0 || v === c - 1) {
      i.push(ke(e[v]));
      continue;
    } else
      u = e[v - 1], l = e[v + 1];
    ur(a, l, u), Ni(a, a, t);
    var y = Eo(d, u), p = Eo(d, l), g = y + p;
    g !== 0 && (y /= g, p /= g), Ni(o, a, -y), Ni(s, a, p);
    var m = fl([], d, o), _ = fl([], d, s);
    n && (fr(m, m, h), lr(m, m, f), fr(_, _, h), lr(_, _, f)), i.push(m), i.push(_);
  }
  return r && i.push(i.shift()), i;
}
function Bg(e, t, r) {
  var n = t.smooth, i = t.points;
  if (i && i.length >= 2) {
    if (n) {
      var a = Aw(i, n, r, t.smoothConstraint);
      e.moveTo(i[0][0], i[0][1]);
      for (var o = i.length, s = 0; s < (r ? o : o - 1); s++) {
        var u = a[s * 2], l = a[s * 2 + 1], h = i[(s + 1) % o];
        e.bezierCurveTo(u[0], u[1], l[0], l[1], h[0], h[1]);
      }
    } else {
      e.moveTo(i[0][0], i[0][1]);
      for (var s = 1, f = i.length; s < f; s++)
        e.lineTo(i[s][0], i[s][1]);
    }
    r && e.closePath();
  }
}
var Ow = /* @__PURE__ */ function() {
  function e() {
    this.points = null, this.smooth = 0, this.smoothConstraint = null;
  }
  return e;
}(), Bf = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new Ow();
  }, t.prototype.buildPath = function(r, n) {
    Bg(r, n, !0);
  }, t;
}(st);
Bf.prototype.type = "polygon";
var kw = /* @__PURE__ */ function() {
  function e() {
    this.points = null, this.percent = 1, this.smooth = 0, this.smoothConstraint = null;
  }
  return e;
}(), Ff = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new kw();
  }, t.prototype.buildPath = function(r, n) {
    Bg(r, n, !1);
  }, t;
}(st);
Ff.prototype.type = "polyline";
var Nw = {}, Bw = /* @__PURE__ */ function() {
  function e() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.percent = 1;
  }
  return e;
}(), da = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new Bw();
  }, t.prototype.buildPath = function(r, n) {
    var i, a, o, s;
    if (this.subPixelOptimize) {
      var u = zS(Nw, n, this.style);
      i = u.x1, a = u.y1, o = u.x2, s = u.y2;
    } else
      i = n.x1, a = n.y1, o = n.x2, s = n.y2;
    var l = n.percent;
    l !== 0 && (r.moveTo(i, a), l < 1 && (o = i * (1 - l) + o * l, s = a * (1 - l) + s * l), r.lineTo(o, s));
  }, t.prototype.pointAt = function(r) {
    var n = this.shape;
    return [
      n.x1 * (1 - r) + n.x2 * r,
      n.y1 * (1 - r) + n.y2 * r
    ];
  }, t;
}(st);
da.prototype.type = "line";
var Gt = [], Fw = /* @__PURE__ */ function() {
  function e() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.cpx1 = 0, this.cpy1 = 0, this.percent = 1;
  }
  return e;
}();
function Kv(e, t, r) {
  var n = e.cpx2, i = e.cpy2;
  return n != null || i != null ? [
    (r ? Jh : kt)(e.x1, e.cpx1, e.cpx2, e.x2, t),
    (r ? Jh : kt)(e.y1, e.cpy1, e.cpy2, e.y2, t)
  ] : [
    (r ? jh : Nt)(e.x1, e.cpx1, e.x2, t),
    (r ? jh : Nt)(e.y1, e.cpy1, e.y2, t)
  ];
}
var Ts = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new Fw();
  }, t.prototype.buildPath = function(r, n) {
    var i = n.x1, a = n.y1, o = n.x2, s = n.y2, u = n.cpx1, l = n.cpy1, h = n.cpx2, f = n.cpy2, v = n.percent;
    v !== 0 && (r.moveTo(i, a), h == null || f == null ? (v < 1 && (Zi(i, u, o, v, Gt), u = Gt[1], o = Gt[2], Zi(a, l, s, v, Gt), l = Gt[1], s = Gt[2]), r.quadraticCurveTo(u, l, o, s)) : (v < 1 && (Oo(i, u, h, o, v, Gt), u = Gt[1], h = Gt[2], o = Gt[3], Oo(a, l, f, s, v, Gt), l = Gt[1], f = Gt[2], s = Gt[3]), r.bezierCurveTo(u, l, h, f, o, s)));
  }, t.prototype.pointAt = function(r) {
    return Kv(this.shape, r, !1);
  }, t.prototype.tangentAt = function(r) {
    var n = Kv(this.shape, r, !0);
    return cn(n, n);
  }, t;
}(st);
Ts.prototype.type = "bezier-curve";
var zw = /* @__PURE__ */ function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0;
  }
  return e;
}(), Cs = function(e) {
  B(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new zw();
  }, t.prototype.buildPath = function(r, n) {
    var i = n.cx, a = n.cy, o = Math.max(n.r, 0), s = n.startAngle, u = n.endAngle, l = n.clockwise, h = Math.cos(s), f = Math.sin(s);
    r.moveTo(h * o + i, f * o + a), r.arc(i, a, o, s, u, !l);
  }, t;
}(st);
Cs.prototype.type = "arc";
var Vw = function(e) {
  B(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.type = "compound", r;
  }
  return t.prototype._updatePathDirty = function() {
    for (var r = this.shape.paths, n = this.shapeChanged(), i = 0; i < r.length; i++)
      n = n || r[i].shapeChanged();
    n && this.dirtyShape();
  }, t.prototype.beforeBrush = function() {
    this._updatePathDirty();
    for (var r = this.shape.paths || [], n = this.getGlobalScale(), i = 0; i < r.length; i++)
      r[i].path || r[i].createPathProxy(), r[i].path.setScale(n[0], n[1], r[i].segmentIgnoreThreshold);
  }, t.prototype.buildPath = function(r, n) {
    for (var i = n.paths || [], a = 0; a < i.length; a++)
      i[a].buildPath(r, i[a].shape, !0);
  }, t.prototype.afterBrush = function() {
    for (var r = this.shape.paths || [], n = 0; n < r.length; n++)
      r[n].pathUpdated();
  }, t.prototype.getBoundingRect = function() {
    return this._updatePathDirty.call(this), st.prototype.getBoundingRect.call(this);
  }, t;
}(st), Fg = function() {
  function e(t) {
    this.colorStops = t || [];
  }
  return e.prototype.addColorStop = function(t, r) {
    this.colorStops.push({
      offset: t,
      color: r
    });
  }, e;
}(), Hw = function(e) {
  B(t, e);
  function t(r, n, i, a, o, s) {
    var u = e.call(this, o) || this;
    return u.x = r == null ? 0 : r, u.y = n == null ? 0 : n, u.x2 = i == null ? 1 : i, u.y2 = a == null ? 0 : a, u.type = "linear", u.global = s || !1, u;
  }
  return t;
}(Fg), Gw = function(e) {
  B(t, e);
  function t(r, n, i, a, o) {
    var s = e.call(this, a) || this;
    return s.x = r == null ? 0.5 : r, s.y = n == null ? 0.5 : n, s.r = i == null ? 0.5 : i, s.type = "radial", s.global = o || !1, s;
  }
  return t;
}(Fg), zg = 0, Uw = 1, Yw = 2, Ww = 1, go = 0, Xw = [], $w = function(e) {
  B(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.notClear = !0, r.incremental = Uw, r._displayables = [], r._temporaryDisplayables = [], r._cursor = 0, r;
  }
  return t.prototype.traverse = function(r, n) {
    r.call(n, this);
  }, t.prototype.useStyle = function() {
    this.style = {};
  }, t.prototype._useHoverStyle = function() {
    this.__hoverStyle = null;
  }, t.prototype.getCursor = function() {
    return this._cursor;
  }, t.prototype.innerAfterBrush = function() {
    this._cursor = this._displayables.length;
  }, t.prototype.clearDisplaybles = function() {
    this._displayables = [], this._temporaryDisplayables = [], this._cursor = 0, this.markRedraw(), this.notClear = !1;
  }, t.prototype.clearTemporalDisplayables = function() {
    this._temporaryDisplayables = [];
  }, t.prototype.addDisplayable = function(r, n) {
    n ? this._temporaryDisplayables.push(r) : this._displayables.push(r), this.markRedraw();
  }, t.prototype.addDisplayables = function(r, n) {
    n = n || !1;
    for (var i = 0; i < r.length; i++)
      this.addDisplayable(r[i], n);
  }, t.prototype.getDisplayables = function() {
    return this._displayables;
  }, t.prototype.getTemporalDisplayables = function() {
    return this._temporaryDisplayables;
  }, t.prototype.eachPendingDisplayable = function(r) {
    for (var n = this._cursor; n < this._displayables.length; n++)
      r && r(this._displayables[n]);
    for (var n = 0; n < this._temporaryDisplayables.length; n++)
      r && r(this._temporaryDisplayables[n]);
  }, t.prototype.update = function() {
    this.updateTransform();
    for (var r = this._cursor; r < this._displayables.length; r++) {
      var n = this._displayables[r];
      n.parent = this, n.update(), n.parent = null;
    }
    for (var r = 0; r < this._temporaryDisplayables.length; r++) {
      var n = this._temporaryDisplayables[r];
      n.parent = this, n.update(), n.parent = null;
    }
  }, t.prototype.getBoundingRect = function() {
    if (!this._rect) {
      for (var r = new H(1 / 0, 1 / 0, -1 / 0, -1 / 0), n = 0; n < this._displayables.length; n++) {
        var i = this._displayables[n], a = i.getBoundingRect().clone();
        i.needLocalTransform() && a.applyTransform(i.getLocalTransform(Xw)), r.union(a);
      }
      this._rect = r;
    }
    return this._rect;
  }, t.prototype.contain = function(r, n) {
    var i = this.transformCoordToLocal(r, n), a = this.getBoundingRect();
    if (a.contain(i[0], i[1]))
      for (var o = 0; o < this._displayables.length; o++) {
        var s = this._displayables[o];
        if (s.contain(r, n))
          return !0;
      }
    return !1;
  }, t;
}(ca), Zw = ut();
function qw(e, t, r, n, i) {
  var a;
  if (t && t.ecModel) {
    var o = t.ecModel.getUpdatePayload();
    a = o && o.animation;
  }
  var s = t && t.isAnimationEnabled(), u = e === "update";
  if (s) {
    var l = void 0, h = void 0, f = void 0;
    n ? (l = W(n.duration, 200), h = W(n.easing, "cubicOut"), f = 0) : (l = t.getShallow(u ? "animationDurationUpdate" : "animationDuration"), h = t.getShallow(u ? "animationEasingUpdate" : "animationEasing"), f = t.getShallow(u ? "animationDelayUpdate" : "animationDelay")), a && (a.duration != null && (l = a.duration), a.easing != null && (h = a.easing), a.delay != null && (f = a.delay)), Z(f) && (f = f(r, i)), Z(l) && (l = l(r));
    var v = {
      duration: l || 0,
      delay: f,
      easing: h
    };
    return v;
  } else
    return null;
}
function zf(e, t, r, n, i, a, o) {
  var s = !1, u;
  Z(i) ? (o = a, a = i, i = null) : F(i) && (a = i.cb, o = i.during, s = i.isFrom, u = i.removeOpt, i = i.dataIndex);
  var l = e === "leave";
  l || t.stopAnimation("leave");
  var h = qw(e, n, i, l ? u || {} : null, n && n.getAnimationDelayParams ? n.getAnimationDelayParams(t, i) : null);
  if (h && h.duration > 0) {
    var f = h.duration, v = h.delay, c = h.easing, d = {
      duration: f,
      delay: v || 0,
      easing: c,
      done: a,
      force: !!a || !!o,
      // Set to final state in update/init animation.
      // So the post processing based on the path shape can be done correctly.
      setToFinal: !l,
      scope: e,
      during: o
    };
    s ? t.animateFrom(r, d) : t.animateTo(r, d);
  } else
    t.stopAnimation(), !s && t.attr(r), o && o(1), a && a();
}
function pa(e, t, r, n, i, a) {
  zf("update", e, t, r, n, i, a);
}
function Vf(e, t, r, n, i, a) {
  zf("enter", e, t, r, n, i, a);
}
function yo(e) {
  if (!e.__zr)
    return !0;
  for (var t = 0; t < e.animators.length; t++) {
    var r = e.animators[t];
    if (r.scope === "leave")
      return !0;
  }
  return !1;
}
function Qv(e, t, r, n, i, a) {
  yo(e) || zf("leave", e, t, r, n, i, a);
}
function Kw(e) {
  Zw(e).oldStyle = e.style;
}
var Ul = {}, Qw = ["x", "y"], Jv = ["width", "height"], Jw = 0, jw = 1, Hf = 2;
function tb(e) {
  return st.extend(e);
}
var eb = Tw;
function rb(e, t) {
  return eb(e, t);
}
function Me(e, t) {
  Ul[e] = t;
}
function nb(e) {
  if (Ul.hasOwnProperty(e))
    return Ul[e];
}
function Gf(e, t, r, n) {
  var i = bw(e, t);
  return r && (n === "center" && (r = Hg(r, i.getBoundingRect())), Gg(i, r)), i;
}
function Vg(e, t, r) {
  var n = new Mr({
    style: {
      image: e,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height
    },
    onload: function(i) {
      if (r === "center") {
        var a = {
          width: i.width,
          height: i.height
        };
        n.setStyle(Hg(t, a));
      }
    }
  });
  return n;
}
function Hg(e, t) {
  var r = t.width / t.height, n = e.height * r, i;
  n <= e.width ? i = e.height : (n = e.width, i = n / r);
  var a = e.x + e.width / 2, o = e.y + e.height / 2;
  return {
    x: a - n / 2,
    y: o - i / 2,
    width: n,
    height: i
  };
}
var ib = Cw;
function Gg(e, t) {
  if (e.applyTransform) {
    var r = e.getBoundingRect(), n = r.calculateTransform(t);
    e.applyTransform(n);
  }
}
function ab(e, t) {
  for (var r = ri([]); e && e !== t; )
    dr(r, e.getLocalTransform(), r), e = e.parent;
  return r;
}
function ob(e, t) {
  return z(e, function(r) {
    var n = r[0];
    n = Zt(n, t.x), n = _r(n, t.x + t.width);
    var i = r[1];
    return i = Zt(i, t.y), i = _r(i, t.y + t.height), [n, i];
  });
}
function sb(e, t) {
  var r = Zt(e.x, t.x), n = _r(e.x + e.width, t.x + t.width), i = Zt(e.y, t.y), a = _r(e.y + e.height, t.y + t.height);
  if (n >= r && a >= i)
    return {
      x: r,
      y: i,
      width: n - r,
      height: a - i
    };
}
function ub(e, t, r) {
  var n = A({
    rectHover: !0
  }, t), i = n.style = {
    strokeNoScale: !0
  };
  if (r = r || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }, e)
    return e.indexOf("image://") === 0 ? (i.image = e.slice(8), mt(i, r), new Mr(n)) : Gf(e.replace("path://", ""), n, r, "center");
}
function jv(e, t) {
  var r;
  e.isGroup && (r = t(e)), r || e.traverse(t);
}
function Uf(e, t) {
  if (e)
    if (N(e))
      for (var r = 0; r < e.length; r++)
        jv(e[r], t);
    else
      jv(e, t);
}
function Go(e) {
  return {
    z: e.get("z") || 0,
    zlevel: e.get("zlevel") || 0
  };
}
function lb(e, t, r) {
  Ug(e, t, r, -1 / 0);
}
function Ug(e, t, r, n) {
  if (e.ignoreModelZ)
    return n;
  var i = e.getTextContent(), a = e.getTextGuideLine(), o = e.isGroup;
  if (o)
    for (var s = e.childrenRef(), u = 0; u < s.length; u++)
      n = Zt(Ug(s[u], t, r, n), n);
  else
    e.z = t, e.zlevel = r, n = Zt(e.z2 || 0, n);
  if (i && (i.z = t, i.zlevel = r, isFinite(n) && (i.z2 = n + 2)), a) {
    var l = e.textGuideLineConfig;
    a.z = t, a.zlevel = r, isFinite(n) && (a.z2 = n + (l && l.showAbove ? 1 : -1));
  }
  return n;
}
function Yg(e) {
  return e.animation = {
    duration: 0
  }, e;
}
function Yf(e, t) {
  return t ? un(Pi.transform, t) : ri(Pi.transform), Pi.decomposeTransform(), fn(e, Pi), e;
}
var Pi = new ii();
Pi.transform = Lt();
Me("circle", bs);
Me("ellipse", Of);
Me("sector", kf);
Me("ring", Nf);
Me("polygon", Bf);
Me("polyline", Ff);
Me("rect", Fe);
Me("line", da);
Me("bezierCurve", Ts);
Me("arc", Cs);
var Ms = {};
function fb(e, t) {
  for (var r = 0; r < Ge.length; r++) {
    var n = Ge[r], i = t[n], a = e.ensureState(n);
    a.style = a.style || {}, a.style.text = i;
  }
  var o = e.currentStates.slice();
  e.clearStates(!0), e.setStyle({
    text: t.normal
  }), e.useStates(o, !0);
}
function tc(e, t, r) {
  var n = e.labelFetcher, i = e.labelDataIndex, a = e.labelDimIndex, o = t.normal, s;
  n && (s = n.getFormattedLabel(i, "normal", null, a, o && o.get("formatter"), r != null ? {
    interpolatedValue: r
  } : null)), s == null && (s = Z(e.defaultText) ? e.defaultText(i, e, r) : e.defaultText);
  for (var u = {
    normal: s
  }, l = 0; l < Ge.length; l++) {
    var h = Ge[l], f = t[h];
    u[h] = W(n ? n.getFormattedLabel(i, h, null, a, f && f.get("formatter")) : null, s);
  }
  return u;
}
function Wg(e, t, r, n) {
  r = r || Ms;
  for (var i = e instanceof vn, a = !1, o = 0; o < zv.length; o++) {
    var s = t[zv[o]];
    if (s && s.getShallow("show")) {
      a = !0;
      break;
    }
  }
  var u = i ? e : e.getTextContent();
  if (a) {
    i || (u || (u = new vn(), e.setTextContent(u)), e.stateProxy && (u.stateProxy = e.stateProxy));
    var l = tc(r, t), h = t.normal, f = !!h.getShallow("show"), v = Yl(h, n, r, !1, !i);
    v.text = l.normal, i || e.setTextConfig(ec(h, r, !1));
    for (var o = 0; o < Ge.length; o++) {
      var c = Ge[o], s = t[c];
      if (s) {
        var d = u.ensureState(c), y = !!W(s.getShallow("show"), f);
        if (y !== f && (d.ignore = !y), d.style = Yl(s, n, r, !0, !i), d.style.text = l[c], !i) {
          var p = e.ensureState(c);
          p.textConfig = ec(s, r, !0);
        }
      }
    }
    u.silent = !!h.getShallow("silent"), u.style.x != null && (v.x = u.style.x), u.style.y != null && (v.y = u.style.y), u.ignore = !f, u.useStyle(v), u.dirty(), r.enableTextSetter && (db(u).setLabelText = function(g) {
      var m = tc(r, t, g);
      fb(u, m);
    });
  } else u && (u.ignore = !0);
  e.dirty();
}
function Ds(e, t) {
  t = t || "label";
  for (var r = {
    normal: e.getModel(t)
  }, n = 0; n < Ge.length; n++) {
    var i = Ge[n];
    r[i] = e.getModel([i, t]);
  }
  return r;
}
function Yl(e, t, r, n, i) {
  var a = {};
  return hb(a, e, r, n, i), t && A(a, t), a;
}
function ec(e, t, r) {
  t = t || {};
  var n = {}, i, a = e.getShallow("rotate"), o = W(e.getShallow("distance"), r ? null : 5), s = e.getShallow("offset");
  return i = e.getShallow("position") || (r ? null : "inside"), i === "outside" && (i = t.defaultOutsidePosition || "top"), i != null && (n.position = i), s != null && (n.offset = s), a != null && (a *= Math.PI / 180, n.rotation = a), o != null && (n.distance = o), n.outsideFill = e.get("color") === "inherit" ? t.inheritColor || null : "auto", t.autoOverflowArea != null && (n.autoOverflowArea = t.autoOverflowArea), t.layoutRect != null && (n.layoutRect = t.layoutRect), n;
}
function hb(e, t, r, n, i) {
  r = r || Ms;
  var a = t.ecModel, o = a && a.option.textStyle, s = vb(t), u;
  if (s) {
    u = {};
    var l = "richInheritPlainLabel", h = W(t.get(l), a ? a.get(l) : void 0);
    for (var f in s)
      if (s.hasOwnProperty(f)) {
        var v = t.getModel(["rich", f]);
        ac(u[f] = {}, v, o, t, h, r, n, i, !1, !0);
      }
  }
  u && (e.rich = u);
  var c = t.get("overflow");
  c && (e.overflow = c);
  var d = t.get("lineOverflow");
  d && (e.lineOverflow = d);
  var y = e, p = t.get("minMargin");
  if (p != null)
    p = pt(p) ? p / 2 : 0, y.margin = [p, p, p, p], y.__marginType = oc.minMargin;
  else {
    var g = t.get("textMargin");
    g != null && (y.margin = ss(g), y.__marginType = oc.textMargin);
  }
  ac(e, t, o, null, null, r, n, i, !0, !1);
}
function vb(e) {
  for (var t; e && e !== e.ecModel; ) {
    var r = (e.option || Ms).rich;
    if (r) {
      t = t || {};
      for (var n = ft(r), i = 0; i < n.length; i++) {
        var a = n[i];
        t[a] = 1;
      }
    }
    e = e.parentModel;
  }
  return t;
}
var rc = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], nc = ["align", "lineHeight", "width", "height", "tag", "verticalAlign", "ellipsis"], ic = ["padding", "borderWidth", "borderRadius", "borderDashOffset", "backgroundColor", "borderColor", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"];
function ac(e, t, r, n, i, a, o, s, u, l) {
  r = !o && r || Ms;
  var h = a && a.inheritColor, f = t.getShallow("color"), v = t.getShallow("textBorderColor"), c = W(t.getShallow("opacity"), r.opacity);
  (f === "inherit" || f === "auto") && (h ? f = h : f = null), (v === "inherit" || v === "auto") && (h ? v = h : v = null), s || (f = f || r.color, v = v || r.textBorderColor), f != null && (e.fill = f), v != null && (e.stroke = v);
  var d = W(t.getShallow("textBorderWidth"), r.textBorderWidth);
  d != null && (e.lineWidth = d);
  var y = W(t.getShallow("textBorderType"), r.textBorderType);
  y != null && (e.lineDash = y);
  var p = W(t.getShallow("textBorderDashOffset"), r.textBorderDashOffset);
  p != null && (e.lineDashOffset = p), !o && c == null && !l && (c = a && a.defaultOpacity), c != null && (e.opacity = c), !o && !s && e.fill == null && a.inheritColor && (e.fill = a.inheritColor);
  for (var g = 0; g < rc.length; g++) {
    var m = rc[g], _ = i !== !1 && n ? je(t.getShallow(m), n.getShallow(m), r[m]) : W(t.getShallow(m), r[m]);
    _ != null && (e[m] = _);
  }
  for (var g = 0; g < nc.length; g++) {
    var m = nc[g], _ = t.getShallow(m);
    _ != null && (e[m] = _);
  }
  if (e.verticalAlign == null) {
    var S = t.getShallow("baseline");
    S != null && (e.verticalAlign = S);
  }
  if (!u || !a.disableBox) {
    for (var g = 0; g < ic.length; g++) {
      var m = ic[g], _ = t.getShallow(m);
      _ != null && (e[m] = _);
    }
    var w = t.getShallow("borderType");
    w != null && (e.borderDash = w), (e.backgroundColor === "auto" || e.backgroundColor === "inherit") && h && (e.backgroundColor = h), (e.borderColor === "auto" || e.borderColor === "inherit") && h && (e.borderColor = h);
  }
}
function cb(e, t) {
  var r = t && t.getModel("textStyle");
  return Qe([
    // FIXME in node-canvas fontWeight is before fontStyle
    e.fontStyle || r && r.getShallow("fontStyle") || "",
    e.fontWeight || r && r.getShallow("fontWeight") || "",
    (e.fontSize || r && r.getShallow("fontSize") || 12) + "px",
    e.fontFamily || r && r.getShallow("fontFamily") || "sans-serif"
  ].join(" "));
}
var db = ut(), oc = {
  minMargin: 1,
  textMargin: 2
}, pb = ["textStyle", "color"], bu = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "padding", "lineHeight", "rich", "width", "height", "overflow"], Tu = new vn(), gb = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getTextColor = function(t) {
      var r = this.ecModel;
      return this.getShallow("color") || (!t && r ? r.get(pb) : null);
    }, e.prototype.getFont = function() {
      return cb({
        fontStyle: this.getShallow("fontStyle"),
        fontWeight: this.getShallow("fontWeight"),
        fontSize: this.getShallow("fontSize"),
        fontFamily: this.getShallow("fontFamily")
      }, this.ecModel);
    }, e.prototype.getTextRect = function(t) {
      for (var r = {
        text: t,
        verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline")
      }, n = 0; n < bu.length; n++)
        r[bu[n]] = this.getShallow(bu[n]);
      return Tu.useStyle(r), Tu.update(), Tu.getBoundingRect();
    }, e;
  }()
), Xg = [
  ["lineWidth", "width"],
  ["stroke", "color"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "type"],
  ["lineDashOffset", "dashOffset"],
  ["lineCap", "cap"],
  ["lineJoin", "join"],
  ["miterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], yb = ea(Xg), mb = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getLineStyle = function(t) {
      return yb(this, t);
    }, e;
  }()
), $g = [
  ["fill", "color"],
  ["stroke", "borderColor"],
  ["lineWidth", "borderWidth"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "borderType"],
  ["lineDashOffset", "borderDashOffset"],
  ["lineCap", "borderCap"],
  ["lineJoin", "borderJoin"],
  ["miterLimit", "borderMiterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], _b = ea($g), Sb = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getItemStyle = function(t, r) {
      return _b(this, t, r);
    }, e;
  }()
), yt = (
  /** @class */
  function() {
    function e(t, r, n) {
      this.parentModel = r, this.ecModel = n, this.option = t;
    }
    return e.prototype.init = function(t, r, n) {
    }, e.prototype.mergeOption = function(t, r) {
      ct(this.option, t, !0);
    }, e.prototype.get = function(t, r) {
      return t == null ? this.option : this._doGet(this.parsePath(t), !r && this.parentModel);
    }, e.prototype.getShallow = function(t, r) {
      var n = this.option, i = n == null ? n : n[t];
      if (i == null && !r) {
        var a = this.parentModel;
        a && (i = a.getShallow(t));
      }
      return i;
    }, e.prototype.getModel = function(t, r) {
      var n = t != null, i = n ? this.parsePath(t) : null, a = n ? this._doGet(i) : this.option;
      return r = r || this.parentModel && this.parentModel.getModel(this.resolveParentPath(i)), new e(a, r, this.ecModel);
    }, e.prototype.isEmpty = function() {
      return this.option == null;
    }, e.prototype.restoreData = function() {
    }, e.prototype.clone = function() {
      var t = this.constructor;
      return new t($(this.option));
    }, e.prototype.parsePath = function(t) {
      return typeof t == "string" ? t.split(".") : t;
    }, e.prototype.resolveParentPath = function(t) {
      return t;
    }, e.prototype.isAnimationEnabled = function() {
      if (!tt.node && this.option) {
        if (this.option.animation != null)
          return !!this.option.animation;
        if (this.parentModel)
          return this.parentModel.isAnimationEnabled();
      }
    }, e.prototype._doGet = function(t, r) {
      var n = this.option;
      if (!t)
        return n;
      for (var i = 0; i < t.length && !(t[i] && (n = n && typeof n == "object" ? n[t[i]] : null, n == null)); i++)
        ;
      return n == null && r && (n = r._doGet(this.resolveParentPath(t), r.parentModel)), n;
    }, e;
  }()
);
Df(yt);
J1(yt);
ee(yt, mb);
ee(yt, Sb);
ee(yt, nS);
ee(yt, gb);
var wb = Math.round(Math.random() * 10);
function Is(e) {
  return [e || "", wb++].join("_");
}
function bb(e) {
  var t = {};
  e.registerSubTypeDefaulter = function(r, n) {
    var i = Ae(r);
    t[i.main] = n;
  }, e.determineSubType = function(r, n) {
    var i = n.type;
    if (!i) {
      var a = Ae(r).main;
      e.hasSubTypes(r) && t[a] && (i = t[a](n));
    }
    return i;
  };
}
function Tb(e, t) {
  e.topologicalTravel = function(a, o, s, u) {
    if (!a.length)
      return;
    var l = r(o), h = l.graph, f = l.noEntryList, v = {};
    for (D(a, function(m) {
      v[m] = !0;
    }); f.length; ) {
      var c = f.pop(), d = h[c], y = !!v[c];
      y && (s.call(u, c, d.originalDeps.slice()), delete v[c]), D(d.successor, y ? g : p);
    }
    D(v, function() {
      var m = "";
      throw new Error(m);
    });
    function p(m) {
      h[m].entryCount--, h[m].entryCount === 0 && f.push(m);
    }
    function g(m) {
      v[m] = !0, p(m);
    }
  };
  function r(a) {
    var o = {}, s = [];
    return D(a, function(u) {
      var l = n(o, u), h = l.originalDeps = t(u), f = i(h, a);
      l.entryCount = f.length, l.entryCount === 0 && s.push(u), D(f, function(v) {
        at(l.predecessor, v) < 0 && l.predecessor.push(v);
        var c = n(o, v);
        at(c.successor, v) < 0 && c.successor.push(u);
      });
    }), {
      graph: o,
      noEntryList: s
    };
  }
  function n(a, o) {
    return a[o] || (a[o] = {
      predecessor: [],
      successor: []
    }), a[o];
  }
  function i(a, o) {
    var s = [];
    return D(a, function(u) {
      at(o, u) >= 0 && s.push(u);
    }), s;
  }
}
const Cb = {
  time: {
    month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayOfWeekAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  legend: {
    selector: {
      all: "All",
      inverse: "Inv"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "Box Select",
        polygon: "Lasso Select",
        lineX: "Horizontally Select",
        lineY: "Vertically Select",
        keep: "Keep Selections",
        clear: "Clear Selections"
      }
    },
    dataView: {
      title: "Data View",
      lang: ["Data View", "Close", "Refresh"]
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Zoom Reset"
      }
    },
    magicType: {
      title: {
        line: "Switch to Line Chart",
        bar: "Switch to Bar Chart",
        stack: "Stack",
        tiled: "Tile"
      }
    },
    restore: {
      title: "Restore"
    },
    saveAsImage: {
      title: "Save as Image",
      lang: ["Right Click to Save Image"]
    }
  },
  series: {
    typeNames: {
      pie: "Pie chart",
      bar: "Bar chart",
      line: "Line chart",
      scatter: "Scatter plot",
      effectScatter: "Ripple scatter plot",
      radar: "Radar chart",
      tree: "Tree",
      treemap: "Treemap",
      boxplot: "Boxplot",
      candlestick: "Candlestick",
      k: "K line chart",
      heatmap: "Heat map",
      map: "Map",
      parallel: "Parallel coordinate map",
      lines: "Line graph",
      graph: "Relationship graph",
      sankey: "Sankey diagram",
      funnel: "Funnel chart",
      gauge: "Gauge",
      pictorialBar: "Pictorial bar",
      themeRiver: "Theme River Map",
      sunburst: "Sunburst",
      custom: "Custom chart",
      chart: "Chart"
    }
  },
  aria: {
    general: {
      withTitle: 'This is a chart about "{title}"',
      withoutTitle: "This is a chart"
    },
    series: {
      single: {
        prefix: "",
        withName: " with type {seriesType} named {seriesName}.",
        withoutName: " with type {seriesType}."
      },
      multiple: {
        prefix: ". It consists of {seriesCount} series count.",
        withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
        withoutName: " The {seriesId} series is a {seriesType}.",
        separator: {
          middle: "",
          end: ""
        }
      }
    },
    data: {
      allData: "The data is as follows: ",
      partialData: "The first {displayCnt} items are: ",
      withName: "the data for {name} is {value}",
      withoutName: "{value}",
      separator: {
        middle: ", ",
        end: ". "
      }
    }
  }
}, Mb = {
  time: {
    month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthAbbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayOfWeekAbbr: ["日", "一", "二", "三", "四", "五", "六"]
  },
  legend: {
    selector: {
      all: "全选",
      inverse: "反选"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "矩形选择",
        polygon: "圈选",
        lineX: "横向选择",
        lineY: "纵向选择",
        keep: "保持选择",
        clear: "清除选择"
      }
    },
    dataView: {
      title: "数据视图",
      lang: ["数据视图", "关闭", "刷新"]
    },
    dataZoom: {
      title: {
        zoom: "区域缩放",
        back: "区域缩放还原"
      }
    },
    magicType: {
      title: {
        line: "切换为折线图",
        bar: "切换为柱状图",
        stack: "切换为堆叠",
        tiled: "切换为平铺"
      }
    },
    restore: {
      title: "还原"
    },
    saveAsImage: {
      title: "保存为图片",
      lang: ["右键另存为图片"]
    }
  },
  series: {
    typeNames: {
      pie: "饼图",
      bar: "柱状图",
      line: "折线图",
      scatter: "散点图",
      effectScatter: "涟漪散点图",
      radar: "雷达图",
      tree: "树图",
      treemap: "矩形树图",
      boxplot: "箱型图",
      candlestick: "K线图",
      k: "K线图",
      heatmap: "热力图",
      map: "地图",
      parallel: "平行坐标图",
      lines: "线图",
      graph: "关系图",
      sankey: "桑基图",
      funnel: "漏斗图",
      gauge: "仪表盘图",
      pictorialBar: "象形柱图",
      themeRiver: "主题河流图",
      sunburst: "旭日图",
      custom: "自定义图表",
      chart: "图表"
    }
  },
  aria: {
    general: {
      withTitle: "这是一个关于“{title}”的图表。",
      withoutTitle: "这是一个图表，"
    },
    series: {
      single: {
        prefix: "",
        withName: "图表类型是{seriesType}，表示{seriesName}。",
        withoutName: "图表类型是{seriesType}。"
      },
      multiple: {
        prefix: "它由{seriesCount}个图表系列组成。",
        withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",
        withoutName: "第{seriesId}个系列是一个{seriesType}，",
        separator: {
          middle: "；",
          end: "。"
        }
      }
    },
    data: {
      allData: "其数据是——",
      partialData: "其中，前{displayCnt}项是——",
      withName: "{name}的数据是{value}",
      withoutName: "{value}",
      separator: {
        middle: "，",
        end: ""
      }
    }
  }
};
var Uo = "ZH", Wf = "EN", Un = Wf, mo = {}, Xf = {}, Zg = tt.domSupported ? function() {
  var e = (document.documentElement.lang || navigator.language || navigator.browserLanguage || Un).toUpperCase();
  return e.indexOf(Uo) > -1 ? Uo : Un;
}() : Un;
function $f(e, t) {
  e = e.toUpperCase(), Xf[e] = new yt(t), mo[e] = t;
}
function Db(e) {
  if (G(e)) {
    var t = mo[e.toUpperCase()] || {};
    return e === Uo || e === Wf ? $(t) : ct($(t), $(mo[Un]), !1);
  } else
    return ct($(e), $(mo[Un]), !1);
}
function Ib(e) {
  return Xf[e];
}
function xb() {
  return Xf[Un];
}
$f(Wf, Cb);
$f(Uo, Mb);
var Lb = null;
function xs() {
  return Lb;
}
function qg(e, t) {
  t.breakOption;
  var r = t.breakParsed;
  return r;
}
function Zf(e) {
  var t = e.brk;
  return t ? t.breaks : [];
}
var qf = 1e3, Kf = qf * 60, Hi = Kf * 60, le = Hi * 24, sc = le * 365, Eb = {
  year: /({yyyy}|{yy})/,
  month: /({MMMM}|{MMM}|{MM}|{M})/,
  day: /({dd}|{d})/,
  hour: /({HH}|{H}|{hh}|{h})/,
  minute: /({mm}|{m})/,
  second: /({ss}|{s})/,
  millisecond: /({SSS}|{S})/
}, _o = {
  year: "{yyyy}",
  month: "{MMM}",
  day: "{d}",
  hour: "{HH}:{mm}",
  minute: "{HH}:{mm}",
  second: "{HH}:{mm}:{ss}",
  millisecond: "{HH}:{mm}:{ss} {SSS}"
}, Rb = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}", Oa = "{yyyy}-{MM}-{dd}", uc = {
  year: "{yyyy}",
  month: "{yyyy}-{MM}",
  day: Oa,
  hour: Oa + " " + _o.hour,
  minute: Oa + " " + _o.minute,
  second: Oa + " " + _o.second,
  millisecond: Rb
}, on = ["year", "month", "day", "hour", "minute", "second", "millisecond"], Pb = ["year", "half-year", "quarter", "month", "week", "half-week", "day", "half-day", "quarter-day", "hour", "minute", "second", "millisecond"];
function Ab(e) {
  return !G(e) && !Z(e) ? Ob(e) : e;
}
function Ob(e) {
  e = e || {};
  var t = {}, r = !0;
  return D(on, function(n) {
    r && (r = e[n] == null);
  }), D(on, function(n, i) {
    var a = e[n];
    t[n] = {};
    for (var o = null, s = i; s >= 0; s--) {
      var u = on[s], l = F(a) && !N(a) ? a[u] : a, h = void 0;
      N(l) ? (h = l.slice(), o = h[0] || "") : G(l) ? (o = l, h = [o]) : (o == null ? o = _o[n] : Eb[u].test(o) || (o = t[u][u][0] + " " + o), h = [o], r && (h[1] = "{primary|" + o + "}")), t[n][u] = h;
    }
  }), t;
}
function Ot(e, t) {
  return e += "", "0000".substr(0, t - e.length) + e;
}
function Gi(e) {
  switch (e) {
    case "half-year":
    case "quarter":
      return "month";
    case "week":
    case "half-week":
      return "day";
    case "half-day":
    case "quarter-day":
      return "hour";
    default:
      return e;
  }
}
function kb(e) {
  return e === Gi(e);
}
function Nb(e) {
  switch (e) {
    case "year":
    case "month":
      return "day";
    case "millisecond":
      return "millisecond";
    default:
      return "second";
  }
}
function Qf(e, t, r, n) {
  var i = Cr(e), a = i[Kg(r)](), o = i[Jf(r)]() + 1, s = Math.floor((o - 1) / 3) + 1, u = i[jf(r)](), l = i["get" + (r ? "UTC" : "") + "Day"](), h = i[th(r)](), f = (h - 1) % 12 + 1, v = i[eh(r)](), c = i[rh(r)](), d = i[nh(r)](), y = h >= 12 ? "pm" : "am", p = y.toUpperCase(), g = n instanceof yt ? n : Ib(n || Zg) || xb(), m = g.getModel("time"), _ = m.get("month"), S = m.get("monthAbbr"), w = m.get("dayOfWeek"), b = m.get("dayOfWeekAbbr");
  return (t || "").replace(/{a}/g, y + "").replace(/{A}/g, p + "").replace(/{yyyy}/g, a + "").replace(/{yy}/g, Ot(a % 100 + "", 2)).replace(/{Q}/g, s + "").replace(/{MMMM}/g, _[o - 1]).replace(/{MMM}/g, S[o - 1]).replace(/{MM}/g, Ot(o, 2)).replace(/{M}/g, o + "").replace(/{dd}/g, Ot(u, 2)).replace(/{d}/g, u + "").replace(/{eeee}/g, w[l]).replace(/{ee}/g, b[l]).replace(/{e}/g, l + "").replace(/{HH}/g, Ot(h, 2)).replace(/{H}/g, h + "").replace(/{hh}/g, Ot(f + "", 2)).replace(/{h}/g, f + "").replace(/{mm}/g, Ot(v, 2)).replace(/{m}/g, v + "").replace(/{ss}/g, Ot(c, 2)).replace(/{s}/g, c + "").replace(/{SSS}/g, Ot(d, 3)).replace(/{S}/g, d + "");
}
function Bb(e, t, r, n, i) {
  var a = null;
  if (G(r))
    a = r;
  else if (Z(r)) {
    var o = {
      time: e.time,
      level: e.time ? e.time.level : 0
    }, s = xs();
    s && s.makeAxisLabelFormatterParamBreak(o, e.break), a = r(e.value, t, o);
  } else {
    var u = e.time;
    if (u) {
      var l = r[u.lowerTimeUnit][u.upperTimeUnit];
      a = l[Math.min(u.level, l.length - 1)] || "";
    } else {
      var h = So(e.value, i);
      a = r[h][h][0];
    }
  }
  return Qf(new Date(e.value), a, i, n);
}
function So(e, t) {
  var r = Cr(e), n = r[Jf(t)]() + 1, i = r[jf(t)](), a = r[th(t)](), o = r[eh(t)](), s = r[rh(t)](), u = r[nh(t)](), l = u === 0, h = l && s === 0, f = h && o === 0, v = f && a === 0, c = v && i === 1, d = c && n === 1;
  return d ? "year" : c ? "month" : v ? "day" : f ? "hour" : h ? "minute" : l ? "second" : "millisecond";
}
function Yo(e, t, r) {
  switch (t) {
    case "year":
      e[Qg(r)](0);
    case "month":
      e[Jg(r)](1);
    case "day":
      e[jg(r)](0);
    case "hour":
      e[ty(r)](0);
    case "minute":
      e[ey(r)](0);
    case "second":
      e[ry(r)](0);
  }
  return e;
}
function Kg(e) {
  return e ? "getUTCFullYear" : "getFullYear";
}
function Jf(e) {
  return e ? "getUTCMonth" : "getMonth";
}
function jf(e) {
  return e ? "getUTCDate" : "getDate";
}
function th(e) {
  return e ? "getUTCHours" : "getHours";
}
function eh(e) {
  return e ? "getUTCMinutes" : "getMinutes";
}
function rh(e) {
  return e ? "getUTCSeconds" : "getSeconds";
}
function nh(e) {
  return e ? "getUTCMilliseconds" : "getMilliseconds";
}
function Fb(e) {
  return e ? "setUTCFullYear" : "setFullYear";
}
function Qg(e) {
  return e ? "setUTCMonth" : "setMonth";
}
function Jg(e) {
  return e ? "setUTCDate" : "setDate";
}
function jg(e) {
  return e ? "setUTCHours" : "setHours";
}
function ty(e) {
  return e ? "setUTCMinutes" : "setMinutes";
}
function ey(e) {
  return e ? "setUTCSeconds" : "setSeconds";
}
function ry(e) {
  return e ? "setUTCMilliseconds" : "setMilliseconds";
}
function zb(e, t, r, n, i, a, o, s) {
  var u = new vn({
    style: {
      text: e,
      font: t,
      align: r,
      verticalAlign: n,
      padding: i,
      rich: a,
      overflow: o ? "truncate" : null,
      lineHeight: s
    }
  });
  return u.getBoundingRect();
}
function ny(e) {
  if (!qp(e))
    return G(e) ? e : "-";
  var t = (e + "").split(".");
  return t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : "");
}
function Vb(e, t) {
  return e = (e || "").toLowerCase().replace(/-(.)/g, function(r, n) {
    return n.toUpperCase();
  }), t && e && (e = e.charAt(0).toUpperCase() + e.slice(1)), e;
}
var iy = ss, lc = ["a", "b", "c", "d", "e", "f", "g"], Cu = function(e, t) {
  return "{" + e + (t == null ? "" : t) + "}";
};
function ay(e, t, r) {
  N(t) || (t = [t]);
  var n = t.length;
  if (!n)
    return "";
  for (var i = t[0].$vars || [], a = 0; a < i.length; a++) {
    var o = lc[a];
    e = e.replace(Cu(o), Cu(o, 0));
  }
  for (var s = 0; s < n; s++)
    for (var u = 0; u < i.length; u++) {
      var l = t[s][i[u]];
      e = e.replace(Cu(lc[u], s), r ? Ro(l) : l);
    }
  return e;
}
function Hb(e, t) {
  var r = G(e) ? {
    color: e,
    extraCssText: t
  } : e || {}, n = r.color, i = r.type;
  t = r.extraCssText;
  var a = r.renderMode || "html";
  if (!n)
    return "";
  if (a === "html")
    return i === "subItem" ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' + Ro(n) + ";" + (t || "") + '"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + Ro(n) + ";" + (t || "") + '"></span>';
  var o = r.markerId || "markerX";
  return {
    renderMode: a,
    content: "{" + o + "|}  ",
    style: i === "subItem" ? {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: n
    } : {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: n
    }
  };
}
function Gb(e, t, r) {
  (e === "week" || e === "month" || e === "quarter" || e === "half-year" || e === "year") && (e = `MM-dd
yyyy`);
  var n = Cr(t), i = r ? "getUTC" : "get", a = n[i + "FullYear"](), o = n[i + "Month"]() + 1, s = n[i + "Date"](), u = n[i + "Hours"](), l = n[i + "Minutes"](), h = n[i + "Seconds"](), f = n[i + "Milliseconds"]();
  return e = e.replace("MM", Ot(o, 2)).replace("M", o).replace("yyyy", a).replace("yy", Ot(a % 100 + "", 2)).replace("dd", Ot(s, 2)).replace("d", s).replace("hh", Ot(u, 2)).replace("h", u).replace("mm", Ot(l, 2)).replace("m", l).replace("ss", Ot(h, 2)).replace("s", h).replace("SSS", Ot(f, 3)), e;
}
function Ub(e) {
  return e && e.charAt(0).toUpperCase() + e.substr(1);
}
function Yb(e, t) {
  return t = t || "transparent", G(e) ? e : F(e) && e.colorStops && (e.colorStops[0] || {}).color || t;
}
var wo = {}, Mu = {}, ga = (
  /** @class */
  function() {
    function e() {
      this._normalMasterList = [], this._nonSeriesBoxMasterList = [];
    }
    return e.prototype.create = function(t, r) {
      this._nonSeriesBoxMasterList = n(wo), this._normalMasterList = n(Mu);
      function n(i, a) {
        var o = [];
        return D(i, function(s, u) {
          var l = s.create(t, r);
          o = o.concat(l || []);
        }), o;
      }
    }, e.prototype.update = function(t, r) {
      D(this._normalMasterList, function(n) {
        n.update && n.update(t, r);
      });
    }, e.prototype.getCoordinateSystems = function() {
      return this._normalMasterList.concat(this._nonSeriesBoxMasterList);
    }, e.register = function(t, r) {
      if (t === "matrix" || t === "calendar") {
        wo[t] = r;
        return;
      }
      Mu[t] = r;
    }, e.get = function(t) {
      return Mu[t] || wo[t];
    }, e;
  }()
);
function Wb(e) {
  return !!wo[e];
}
var Xb = 1, $b = 2, Zb = V();
function qb(e) {
  var t = e.getShallow("coord", !0), r = Xb;
  if (t == null) {
    var n = Zb.get(e.type);
    n && n.getCoord2 && (r = $b, t = n.getCoord2(e));
  }
  return {
    coord: t,
    from: r
  };
}
var Yn = 0, bo = 1, Kb = 2;
function Qb(e, t) {
  var r = e.getShallow("coordinateSystem"), n = e.getShallow("coordinateSystemUsage", !0), i = Yn;
  if (r) {
    var a = e.mainType === "series";
    n == null && (n = a ? "data" : "box"), n === "data" ? (i = bo, a || (i = Yn)) : n === "box" && (i = Kb, !a && !Wb(r) && (i = Yn));
  }
  return {
    coordSysType: r,
    kind: i
  };
}
function Jb(e) {
  var t = e.targetModel, r = e.coordSysType, n = e.coordSysProvider, i = Qb(t), a = i.kind, o = i.coordSysType;
  if (a !== bo && (a = bo, o = r), a === Yn || o !== r)
    return Yn;
  var s = n(r, t);
  return s ? (a === bo ? t.coordinateSystem = s : t.boxCoordinateSystem = s, a) : Yn;
}
var To = D, jb = ["left", "right", "top", "bottom", "width", "height"], ka = [["width", "left", "right"], ["height", "top", "bottom"]];
function oy(e, t, r, n, i) {
  var a = 0, o = 0;
  n == null && (n = 1 / 0), i == null && (i = 1 / 0);
  var s = 0;
  t.eachChild(function(u, l) {
    var h = u.getBoundingRect(), f = t.childAt(l + 1), v = f && f.getBoundingRect(), c, d;
    if (e === "horizontal") {
      var y = h.width + (v ? -v.x + h.x : 0);
      c = a + y, c > n || u.newline ? (a = 0, c = y, o += s + r, s = h.height) : s = Math.max(s, h.height);
    } else {
      var p = h.height + (v ? -v.y + h.y : 0);
      d = o + p, d > i || u.newline ? (a += s + r, o = 0, d = p, s = h.width) : s = Math.max(s, h.width);
    }
    u.newline || (u.x = a, u.y = o, u.markRedraw(), e === "horizontal" ? a = c + r : o = d + r);
  });
}
Je(oy, "vertical");
Je(oy, "horizontal");
function tT(e, t) {
  return {
    left: e.getShallow("left", t),
    top: e.getShallow("top", t),
    right: e.getShallow("right", t),
    bottom: e.getShallow("bottom", t),
    width: e.getShallow("width", t),
    height: e.getShallow("height", t)
  };
}
function ih(e, t, r) {
  r = iy(r || 0);
  var n = t.width, i = t.height, a = jt(e.left, n), o = jt(e.top, i), s = jt(e.right, n), u = jt(e.bottom, i), l = jt(e.width, n), h = jt(e.height, i), f = r[2] + r[0], v = r[1] + r[3], c = e.aspect;
  switch (isNaN(l) && (l = n - s - v - a), isNaN(h) && (h = i - u - f - o), c != null && (isNaN(l) && isNaN(h) && (c > n / i ? l = n * 0.8 : h = i * 0.8), isNaN(l) && (l = c * h), isNaN(h) && (h = l / c)), isNaN(a) && (a = n - s - l - v), isNaN(o) && (o = i - u - h - f), e.left || e.right) {
    case "center":
      a = n / 2 - l / 2 - r[3];
      break;
    case "right":
      a = n - l - v;
      break;
  }
  switch (e.top || e.bottom) {
    case "middle":
    case "center":
      o = i / 2 - h / 2 - r[0];
      break;
    case "bottom":
      o = i - h - f;
      break;
  }
  a = a || 0, o = o || 0, isNaN(l) && (l = n - v - a - (s || 0)), isNaN(h) && (h = i - f - o - (u || 0));
  var d = new H((t.x || 0) + a + r[3], (t.y || 0) + o + r[0], l, h);
  return d.margin = r, d;
}
function eT(e, t, r) {
  var n = e.getShallow("preserveAspect", !0);
  if (!n)
    return t;
  var i = t.width / t.height;
  if (Math.abs(Math.atan(r) - Math.atan(i)) < 1e-9)
    return t;
  var a = e.getShallow("preserveAspectAlign", !0), o = e.getShallow("preserveAspectVerticalAlign", !0), s = {
    width: t.width,
    height: t.height
  }, u = n === "cover";
  return i > r && !u || i < r && u ? (s.width = t.height * r, a === "left" ? s.left = 0 : a === "right" ? s.right = 0 : s.left = "center") : (s.height = t.width / r, o === "top" ? s.top = 0 : o === "bottom" ? s.bottom = 0 : s.top = "middle"), ih(s, t);
}
var Du = {
  rect: 1
};
function rT(e, t, r) {
  var n, i, a, o = e.boxCoordinateSystem, s;
  if (o) {
    var u = qb(e), l = u.coord, h = u.from;
    if (o.dataToLayout) {
      a = Du.rect, s = h;
      var f = o.dataToLayout(l);
      n = f.contentRect || f.rect;
    }
  }
  return a == null && (a = Du.rect), a === Du.rect && (n || (n = {
    x: 0,
    y: 0,
    width: t.getWidth(),
    height: t.getHeight()
  }), i = [n.x + n.width / 2, n.y + n.height / 2]), {
    type: a,
    refContainer: n,
    refPoint: i,
    boxCoordFrom: s
  };
}
function Wo(e) {
  var t = e.layoutMode || e.constructor.layoutMode;
  return F(t) ? t : t ? {
    type: t
  } : null;
}
function Xo(e, t, r) {
  var n = r && r.ignoreSize;
  !N(n) && (n = [n, n]);
  var i = o(ka[0], 0), a = o(ka[1], 1);
  u(ka[0], e, i), u(ka[1], e, a);
  function o(l, h) {
    var f = {}, v = 0, c = {}, d = 0, y = 2;
    if (To(l, function(m) {
      c[m] = e[m];
    }), To(l, function(m) {
      Oe(t, m) && (f[m] = c[m] = t[m]), s(f, m) && v++, s(c, m) && d++;
    }), n[h])
      return s(t, l[1]) ? c[l[2]] = null : s(t, l[2]) && (c[l[1]] = null), c;
    if (d === y || !v)
      return c;
    if (v >= y)
      return f;
    for (var p = 0; p < l.length; p++) {
      var g = l[p];
      if (!Oe(f, g) && Oe(e, g)) {
        f[g] = e[g];
        break;
      }
    }
    return f;
  }
  function s(l, h) {
    return l[h] != null && l[h] !== "auto";
  }
  function u(l, h, f) {
    To(l, function(v) {
      h[v] = f[v];
    });
  }
}
function sy(e) {
  return nT({}, e);
}
function nT(e, t) {
  return t && e && To(jb, function(r) {
    Oe(t, r) && (e[r] = t[r]);
  }), e;
}
var iT = ut(), it = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r, n, i) {
      var a = e.call(this, r, n, i) || this;
      return a.uid = Is("ec_cpt_model"), a;
    }
    return t.prototype.init = function(r, n, i) {
      this.mergeDefaultAndTheme(r, i);
    }, t.prototype.mergeDefaultAndTheme = function(r, n) {
      var i = Wo(this), a = i ? sy(r) : {}, o = n.getTheme();
      ct(r, o.get(this.mainType)), ct(r, this.getDefaultOption()), i && Xo(r, a, i);
    }, t.prototype.mergeOption = function(r, n) {
      ct(this.option, r, !0);
      var i = Wo(this);
      i && Xo(this.option, r, i);
    }, t.prototype.optionUpdated = function(r, n) {
    }, t.prototype.getDefaultOption = function() {
      var r = this.constructor;
      if (!q1(r))
        return r.defaultOption;
      var n = iT(this);
      if (!n.defaultOption) {
        for (var i = [], a = r; a; ) {
          var o = a.prototype.defaultOption;
          o && i.push(o), a = a.superClass;
        }
        for (var s = {}, u = i.length - 1; u >= 0; u--)
          s = ct(s, i[u], !0);
        n.defaultOption = s;
      }
      return n.defaultOption;
    }, t.prototype.getReferringComponents = function(r, n) {
      var i = r + "Index", a = r + "Id";
      return ps(this.ecModel, r, {
        index: this.get(i, !0),
        id: this.get(a, !0)
      }, n);
    }, t.prototype.getBoxLayoutParams = function() {
      return tT(this, !1);
    }, t.prototype.getZLevelKey = function() {
      return "";
    }, t.prototype.setZLevel = function(r) {
      this.option.zlevel = r;
    }, t.protoInitialize = function() {
      var r = t.prototype;
      r.type = "component", r.id = "", r.name = "", r.mainType = "", r.subType = "", r.componentIndex = 0;
    }(), t;
  }(yt)
);
og(it, yt);
gs(it);
bb(it);
Tb(it, aT);
function aT(e) {
  var t = [];
  return D(it.getClassesByMainType(e), function(r) {
    t = t.concat(r.dependencies || r.prototype.dependencies || []);
  }), t = z(t, function(r) {
    return Ae(r).main;
  }), e !== "dataset" && at(t, "dataset") <= 0 && t.unshift("dataset"), t;
}
var Et = {
  color: {},
  darkColor: {},
  size: {}
}, vt = Et.color = {
  theme: ["#5070dd", "#b6d634", "#505372", "#ff994d", "#0ca8df", "#ffd10a", "#fb628b", "#785db0", "#3fbe95"],
  neutral00: "#fff",
  neutral05: "#f4f7fd",
  neutral10: "#e8ebf0",
  neutral15: "#dbdee4",
  neutral20: "#cfd2d7",
  neutral25: "#c3c5cb",
  neutral30: "#b7b9be",
  neutral35: "#aaacb2",
  neutral40: "#9ea0a5",
  neutral45: "#929399",
  neutral50: "#86878c",
  neutral55: "#797b7f",
  neutral60: "#6d6e73",
  neutral65: "#616266",
  neutral70: "#54555a",
  neutral75: "#48494d",
  neutral80: "#3c3c41",
  neutral85: "#303034",
  neutral90: "#232328",
  neutral95: "#17171b",
  neutral99: "#000",
  accent05: "#eff1f9",
  accent10: "#e0e4f2",
  accent15: "#d0d6ec",
  accent20: "#c0c9e6",
  accent25: "#b1bbdf",
  accent30: "#a1aed9",
  accent35: "#91a0d3",
  accent40: "#8292cc",
  accent45: "#7285c6",
  accent50: "#6578ba",
  accent55: "#5c6da9",
  accent60: "#536298",
  accent65: "#4a5787",
  accent70: "#404c76",
  accent75: "#374165",
  accent80: "#2e3654",
  accent85: "#252b43",
  accent90: "#1b2032",
  accent95: "#121521",
  transparent: "rgba(0,0,0,0)",
  highlight: "rgba(255,231,130,0.8)"
};
A(vt, {
  primary: vt.neutral80,
  secondary: vt.neutral70,
  tertiary: vt.neutral60,
  quaternary: vt.neutral50,
  disabled: vt.neutral20,
  border: vt.neutral30,
  borderTint: vt.neutral20,
  borderShade: vt.neutral40,
  background: vt.neutral05,
  backgroundTint: "rgba(234,237,245,0.5)",
  backgroundTransparent: "rgba(255,255,255,0)",
  backgroundShade: vt.neutral10,
  shadow: "rgba(0,0,0,0.2)",
  shadowTint: "rgba(129,130,136,0.2)",
  axisLine: vt.neutral70,
  axisLineTint: vt.neutral40,
  axisTick: vt.neutral70,
  axisTickMinor: vt.neutral60,
  axisLabel: vt.neutral70,
  axisSplitLine: vt.neutral15,
  axisMinorSplitLine: vt.neutral05
});
for (var Ur in vt)
  if (vt.hasOwnProperty(Ur)) {
    var fc = vt[Ur];
    Ur === "theme" ? Et.darkColor.theme = vt.theme.slice() : Ur === "highlight" ? Et.darkColor.highlight = "rgba(255,231,130,0.4)" : Ur.indexOf("accent") === 0 ? Et.darkColor[Ur] = ko(fc, null, function(e) {
      return e * 0.5;
    }, function(e) {
      return Math.min(1, 1.3 - e);
    }) : Et.darkColor[Ur] = ko(fc, null, function(e) {
      return e * 0.9;
    }, function(e) {
      return 1 - Math.pow(e, 1.5);
    });
  }
Et.size = {
  xxs: 2,
  xs: 5,
  s: 10,
  m: 15,
  l: 20,
  xl: 30,
  xxl: 40,
  xxxl: 50
};
var uy = "";
typeof navigator != "undefined" && (uy = navigator.platform || "");
var Mn = "rgba(0, 0, 0, 0.2)", ly = Et.color.theme[0], oT = ko(ly, null, null, 0.9);
const fy = {
  darkMode: "auto",
  // backgroundColor: 'rgba(0,0,0,0)',
  colorBy: "series",
  color: Et.color.theme,
  gradientColor: [oT, ly],
  aria: {
    decal: {
      decals: [{
        color: Mn,
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        symbolSize: 1,
        rotation: Math.PI / 6
      }, {
        color: Mn,
        symbol: "circle",
        dashArrayX: [[8, 8], [0, 8, 8, 0]],
        dashArrayY: [6, 0],
        symbolSize: 0.8
      }, {
        color: Mn,
        dashArrayX: [1, 0],
        dashArrayY: [4, 3],
        rotation: -Math.PI / 4
      }, {
        color: Mn,
        dashArrayX: [[6, 6], [0, 6, 6, 0]],
        dashArrayY: [6, 0]
      }, {
        color: Mn,
        dashArrayX: [[1, 0], [1, 6]],
        dashArrayY: [1, 0, 6, 0],
        rotation: Math.PI / 4
      }, {
        color: Mn,
        symbol: "triangle",
        dashArrayX: [[9, 9], [0, 9, 9, 0]],
        dashArrayY: [7, 2],
        symbolSize: 0.75
      }]
    }
  },
  // If xAxis and yAxis declared, grid is created by default.
  // grid: {},
  textStyle: {
    // color: '#000',
    // decoration: 'none',
    // PENDING
    fontFamily: uy.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
    // fontFamily: 'Arial, Verdana, sans-serif',
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // Default is source-over
  blendMode: null,
  stateAnimation: {
    duration: 300,
    easing: "cubicOut"
  },
  animation: "auto",
  animationDuration: 1e3,
  animationDurationUpdate: 500,
  animationEasing: "cubicInOut",
  animationEasingUpdate: "cubicInOut",
  animationThreshold: 2e3,
  // Configuration for progressive/incremental rendering
  progressiveThreshold: 3e3,
  progressive: 400,
  // Threshold of if use single hover layer to optimize.
  // It is recommended that `hoverLayerThreshold` is equivalent to or less than
  // `progressiveThreshold`, otherwise hover will cause restart of progressive,
  // which is unexpected.
  // see example <echarts/test/heatmap-large.html>.
  hoverLayerThreshold: 3e3,
  // See: module:echarts/scale/Time
  useUTC: !1
};
var Qt = {
  Must: 1,
  Might: 2,
  Not: 3
  // Other cases
}, hy = ut();
function sT(e) {
  hy(e).datasetMap = V();
}
function uT(e, t, r) {
  var n = {}, i = vy(t);
  if (!i || !e)
    return n;
  var a = [], o = [], s = t.ecModel, u = hy(s).datasetMap, l = i.uid + "_" + r.seriesLayoutBy, h, f;
  e = e.slice(), D(e, function(y, p) {
    var g = F(y) ? y : e[p] = {
      name: y
    };
    g.type === "ordinal" && h == null && (h = p, f = d(g)), n[g.name] = [];
  });
  var v = u.get(l) || u.set(l, {
    categoryWayDim: f,
    valueWayDim: 0
  });
  D(e, function(y, p) {
    var g = y.name, m = d(y);
    if (h == null) {
      var _ = v.valueWayDim;
      c(n[g], _, m), c(o, _, m), v.valueWayDim += m;
    } else if (h === p)
      c(n[g], 0, m), c(a, 0, m);
    else {
      var _ = v.categoryWayDim;
      c(n[g], _, m), c(o, _, m), v.categoryWayDim += m;
    }
  });
  function c(y, p, g) {
    for (var m = 0; m < g; m++)
      y.push(p + m);
  }
  function d(y) {
    var p = y.dimsDef;
    return p ? p.length : 1;
  }
  return a.length && (n.itemName = a), o.length && (n.seriesName = o), n;
}
function vy(e) {
  var t = e.get("data", !0);
  if (!t)
    return ps(e.ecModel, "dataset", {
      index: e.get("datasetIndex", !0),
      id: e.get("datasetId", !0)
    }, sr).models[0];
}
function lT(e) {
  return !e.get("transform", !0) && !e.get("fromTransformResult", !0) ? [] : ps(e.ecModel, "dataset", {
    index: e.get("fromDatasetIndex", !0),
    id: e.get("fromDatasetId", !0)
  }, sr).models;
}
function cy(e, t) {
  return fT(e.data, e.sourceFormat, e.seriesLayoutBy, e.dimensionsDefine, e.startIndex, t);
}
function fT(e, t, r, n, i, a) {
  var o, s = 5;
  if (Vt(e))
    return Qt.Not;
  var u, l;
  if (n) {
    var h = n[a];
    F(h) ? (u = h.name, l = h.type) : G(h) && (u = h);
  }
  if (l != null)
    return l === "ordinal" ? Qt.Must : Qt.Not;
  if (t === Rt) {
    var f = e;
    if (r === gn) {
      for (var v = f[a], c = 0; c < (v || []).length && c < s; c++)
        if ((o = S(v[i + c])) != null)
          return o;
    } else
      for (var c = 0; c < f.length && c < s; c++) {
        var d = f[i + c];
        if (d && (o = S(d[a])) != null)
          return o;
      }
  } else if (t === Ce) {
    var y = e;
    if (!u)
      return Qt.Not;
    for (var c = 0; c < y.length && c < s; c++) {
      var p = y[c];
      if (p && (o = S(p[u])) != null)
        return o;
    }
  } else if (t === Ue) {
    var g = e;
    if (!u)
      return Qt.Not;
    var v = g[u];
    if (!v || Vt(v))
      return Qt.Not;
    for (var c = 0; c < v.length && c < s; c++)
      if ((o = S(v[c])) != null)
        return o;
  } else if (t === re)
    for (var m = e, c = 0; c < m.length && c < s; c++) {
      var p = m[c], _ = va(p);
      if (!N(_))
        return Qt.Not;
      if ((o = S(_[a])) != null)
        return o;
    }
  function S(w) {
    var b = G(w);
    if (w != null && isFinite(Number(w)) && w !== "")
      return b ? Qt.Might : Qt.Not;
    if (b && w !== "-")
      return Qt.Must;
  }
  return Qt.Not;
}
var hT = V();
function vT(e, t, r) {
  var n = hT.get(t);
  if (!n)
    return r;
  var i = n(e);
  return i ? r.concat(i) : r;
}
var hc = ut();
ut();
var ah = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getColorFromPalette = function(t, r, n) {
      var i = zt(this.get("color", !0)), a = this.get("colorLayer", !0);
      return dT(this, hc, i, a, t, r, n);
    }, e.prototype.clearColorPalette = function() {
      pT(this, hc);
    }, e;
  }()
);
function cT(e, t) {
  for (var r = e.length, n = 0; n < r; n++)
    if (e[n].length > t)
      return e[n];
  return e[r - 1];
}
function dT(e, t, r, n, i, a, o) {
  a = a || e;
  var s = t(a), u = s.paletteIdx || 0, l = s.paletteNameMap = s.paletteNameMap || {};
  if (l.hasOwnProperty(i))
    return l[i];
  var h = o == null || !n ? r : cT(n, o);
  if (h = h || r, !(!h || !h.length)) {
    var f = h[u];
    return i && (l[i] = f), s.paletteIdx = (u + 1) % h.length, f;
  }
}
function pT(e, t) {
  t(e).paletteIdx = 0, t(e).paletteNameMap = {};
}
var Na, di, vc, cc = "\0_ec_inner", gT = 1, oh = (
  /** @class */
  function(e) {
    B(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.init = function(r, n, i, a, o, s) {
      a = a || {}, this.option = null, this._theme = new yt(a), this._locale = new yt(o), this._optionManager = s;
    }, t.prototype.setOption = function(r, n, i) {
      var a = gc(n);
      this._optionManager.setOption(r, i, a), this._resetOption(null, a);
    }, t.prototype.resetOption = function(r, n) {
      return this._resetOption(r, gc(n));
    }, t.prototype._resetOption = function(r, n) {
      var i = !1, a = this._optionManager;
      if (!r || r === "recreate") {
        var o = a.mountOption(r === "recreate");
        !this.option || r === "recreate" ? vc(this, o) : (this.restoreData(), this._mergeOption(o, n)), i = !0;
      }
      if ((r === "timeline" || r === "media") && this.restoreData(), !r || r === "recreate" || r === "timeline") {
        var s = a.getTimelineOption(this);
        s && (i = !0, this._mergeOption(s, n));
      }
      if (!r || r === "recreate" || r === "media") {
        var u = a.getMediaOption(this);
        u.length && D(u, function(l) {
          i = !0, this._mergeOption(l, n);
        }, this);
      }
      return i;
    }, t.prototype.mergeOption = function(r) {
      this._mergeOption(r, null);
    }, t.prototype._mergeOption = function(r, n) {
      var i = this.option, a = this._componentsMap, o = this._componentsCount, s = [], u = V(), l = n && n.replaceMergeMainTypeMap;
      sT(this), D(r, function(f, v) {
        f != null && (it.hasClass(v) ? v && (s.push(v), u.set(v, !0)) : i[v] = i[v] == null ? $(f) : ct(i[v], f, !0));
      }), l && l.each(function(f, v) {
        it.hasClass(v) && !u.get(v) && (s.push(v), u.set(v, !0));
      }), it.topologicalTravel(s, it.getAllClassMainTypes(), h, this);
      function h(f) {
        var v = vT(this, f, zt(r[f])), c = a.get(f), d = (
          // `!oldCmptList` means init. See the comment in `mappingToExists`
          c ? l && l.get(f) ? "replaceMerge" : "normalMerge" : "replaceAll"
        ), y = L1(c, v, d);
        N1(y, f, it), i[f] = null, a.set(f, null), o.set(f, 0);
        var p = [], g = [], m = 0, _;
        D(y, function(S, w) {
          var b = S.existing, M = S.newOption;
          if (!M)
            b && (b.mergeOption({}, this), b.optionUpdated({}, !1));
          else {
            var C = f === "series", T = it.getClass(
              f,
              S.keyInfo.subType,
              !C
              // Give a more detailed warn later if series don't exists
            );
            if (!T)
              return;
            if (f === "tooltip") {
              if (_)
                return;
              _ = !0;
            }
            if (b && b.constructor === T)
              b.name = S.keyInfo.name, b.mergeOption(M, this), b.optionUpdated(M, !1);
            else {
              var I = A({
                componentIndex: w
              }, S.keyInfo);
              b = new T(M, this, this, I), A(b, I), S.brandNew && (b.__requireNewView = !0), b.init(M, this, this), b.optionUpdated(null, !0);
            }
          }
          b ? (p.push(b.option), g.push(b), m++) : (p.push(void 0), g.push(void 0));
        }, this), i[f] = p, a.set(f, g), o.set(f, m), f === "series" && Na(this);
      }
      this._seriesIndices || Na(this);
    }, t.prototype.getOption = function() {
      var r = $(this.option);
      return D(r, function(n, i) {
        if (it.hasClass(i)) {
          for (var a = zt(n), o = a.length, s = !1, u = o - 1; u >= 0; u--)
            a[u] && !ta(a[u]) ? s = !0 : (a[u] = null, !s && o--);
          a.length = o, r[i] = a;
        }
      }), delete r[cc], r;
    }, t.prototype.setTheme = function(r) {
      this._theme = new yt(r), this._resetOption("recreate", null);
    }, t.prototype.getTheme = function() {
      return this._theme;
    }, t.prototype.getLocaleModel = function() {
      return this._locale;
    }, t.prototype.setUpdatePayload = function(r) {
      this._payload = r;
    }, t.prototype.getUpdatePayload = function() {
      return this._payload;
    }, t.prototype.getComponent = function(r, n) {
      var i = this._componentsMap.get(r);
      if (i) {
        var a = i[n || 0];
        if (a)
          return a;
        if (n == null) {
          for (var o = 0; o < i.length; o++)
            if (i[o])
              return i[o];
        }
      }
    }, t.prototype.queryComponents = function(r) {
      var n = r.mainType;
      if (!n)
        return [];
      var i = r.index, a = r.id, o = r.name, s = this._componentsMap.get(n);
      if (!s || !s.length)
        return [];
      var u;
      return i != null ? (u = [], D(zt(i), function(l) {
        s[l] && u.push(s[l]);
      })) : a != null ? u = dc("id", a, s) : o != null ? u = dc("name", o, s) : u = It(s, function(l) {
        return !!l;
      }), pc(u, r);
    }, t.prototype.findComponents = function(r) {
      var n = r.query, i = r.mainType, a = s(n), o = a ? this.queryComponents(a) : It(this._componentsMap.get(i), function(l) {
        return !!l;
      });
      return u(pc(o, r));
      function s(l) {
        var h = i + "Index", f = i + "Id", v = i + "Name";
        return l && (l[h] != null || l[f] != null || l[v] != null) ? {
          mainType: i,
          // subType will be filtered finally.
          index: l[h],
          id: l[f],
          name: l[v]
        } : null;
      }
      function u(l) {
        return r.filter ? It(l, r.filter) : l;
      }
    }, t.prototype.eachComponent = function(r, n, i) {
      var a = this._componentsMap;
      if (Z(r)) {
        var o = n, s = r;
        a.each(function(f, v) {
          for (var c = 0; f && c < f.length; c++) {
            var d = f[c];
            d && s.call(o, v, d, d.componentIndex);
          }
        });
      } else
        for (var u = G(r) ? a.get(r) : F(r) ? this.findComponents(r) : null, l = 0; u && l < u.length; l++) {
          var h = u[l];
          h && n.call(i, h, h.componentIndex);
        }
    }, t.prototype.getSeriesByName = function(r) {
      var n = Se(r, null);
      return It(this._componentsMap.get("series"), function(i) {
        return !!i && n != null && i.name === n;
      });
    }, t.prototype.getSeriesByIndex = function(r) {
      return this._componentsMap.get("series")[r];
    }, t.prototype.getSeriesByType = function(r) {
      return It(this._componentsMap.get("series"), function(n) {
        return !!n && n.subType === r;
      });
    }, t.prototype.getSeries = function() {
      return It(this._componentsMap.get("series"), function(r) {
        return !!r;
      });
    }, t.prototype.getSeriesCount = function() {
      return this._componentsCount.get("series");
    }, t.prototype.eachSeries = function(r, n) {
      di(this), D(this._seriesIndices, function(i) {
        var a = this._componentsMap.get("series")[i];
        r.call(n, a, i);
      }, this);
    }, t.prototype.eachRawSeries = function(r, n) {
      D(this._componentsMap.get("series"), function(i) {
        i && r.call(n, i, i.componentIndex);
      });
    }, t.prototype.eachSeriesByType = function(r, n, i) {
      di(this), D(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        o.subType === r && n.call(i, o, a);
      }, this);
    }, t.prototype.eachRawSeriesByType = function(r, n, i) {
      return D(this.getSeriesByType(r), n, i);
    }, t.prototype.isSeriesFiltered = function(r) {
      return di(this), this._seriesIndicesMap.get(r.componentIndex) == null;
    }, t.prototype.getCurrentSeriesIndices = function() {
      return (this._seriesIndices || []).slice();
    }, t.prototype.filterSeries = function(r, n) {
      di(this);
      var i = [];
      D(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        r.call(n, o, a) && i.push(a);
      }, this), this._seriesIndices = i, this._seriesIndicesMap = V(i);
    }, t.prototype.restoreData = function(r) {
      Na(this);
      var n = this._componentsMap, i = [];
      n.each(function(a, o) {
        it.hasClass(o) && i.push(o);
      }), it.topologicalTravel(i, it.getAllClassMainTypes(), function(a) {
        D(n.get(a), function(o) {
          o && (a !== "series" || !yT(o, r)) && o.restoreData();
        });
      });
    }, t.internalField = function() {
      Na = function(r) {
        var n = r._seriesIndices = [];
        D(r._componentsMap.get("series"), function(i) {
          i && n.push(i.componentIndex);
        }), r._seriesIndicesMap = V(n);
      }, di = function(r) {
      }, vc = function(r, n) {
        r.option = {}, r.option[cc] = gT, r._componentsMap = V({
          series: []
        }), r._componentsCount = V();
        var i = n.aria;
        F(i) && i.enabled == null && (i.enabled = !0), mT(n, r._theme.option), ct(n, fy, !1), r._mergeOption(n, null);
      };
    }(), t;
  }(yt)
);
function yT(e, t) {
  if (t) {
    var r = t.seriesIndex, n = t.seriesId, i = t.seriesName;
    return r != null && e.componentIndex !== r || n != null && e.id !== n || i != null && e.name !== i;
  }
}
function mT(e, t) {
  var r = e.color && !e.colorLayer;
  D(t, function(n, i) {
    i === "colorLayer" && r || i === "color" && e.color || it.hasClass(i) || (typeof n == "object" ? e[i] = e[i] ? ct(e[i], n, !1) : $(n) : e[i] == null && (e[i] = n));
  });
}
function dc(e, t, r) {
  if (N(t)) {
    var n = V();
    return D(t, function(a) {
      if (a != null) {
        var o = Se(a, null);
        o != null && n.set(a, !0);
      }
    }), It(r, function(a) {
      return a && n.get(a[e]);
    });
  } else {
    var i = Se(t, null);
    return It(r, function(a) {
      return a && i != null && a[e] === i;
    });
  }
}
function pc(e, t) {
  return t.hasOwnProperty("subType") ? It(e, function(r) {
    return r && r.subType === t.subType;
  }) : e;
}
function gc(e) {
  var t = V();
  return e && D(zt(e.replaceMerge), function(r) {
    t.set(r, !0);
  }), {
    replaceMergeMainTypeMap: t
  };
}
ee(oh, ah);
var _T = /^(min|max)?(.+)$/, ST = (
  /** @class */
  function() {
    function e(t) {
      this._timelineOptions = [], this._mediaList = [], this._currentMediaIndices = [], this._api = t;
    }
    return e.prototype.setOption = function(t, r, n) {
      t && (D(zt(t.series), function(o) {
        o && o.data && Vt(o.data) && xo(o.data);
      }), D(zt(t.dataset), function(o) {
        o && o.source && Vt(o.source) && xo(o.source);
      })), t = $(t);
      var i = this._optionBackup, a = wT(t, r, !i);
      this._newBaseOption = a.baseOption, i ? (a.timelineOptions.length && (i.timelineOptions = a.timelineOptions), a.mediaList.length && (i.mediaList = a.mediaList), a.mediaDefault && (i.mediaDefault = a.mediaDefault)) : this._optionBackup = a;
    }, e.prototype.mountOption = function(t) {
      var r = this._optionBackup;
      return this._timelineOptions = r.timelineOptions, this._mediaList = r.mediaList, this._mediaDefault = r.mediaDefault, this._currentMediaIndices = [], $(t ? r.baseOption : this._newBaseOption);
    }, e.prototype.getTimelineOption = function(t) {
      var r, n = this._timelineOptions;
      if (n.length) {
        var i = t.getComponent("timeline");
        i && (r = $(
          // FIXME:TS as TimelineModel or quivlant interface
          n[i.getCurrentIndex()]
        ));
      }
      return r;
    }, e.prototype.getMediaOption = function(t) {
      var r = this._api.getWidth(), n = this._api.getHeight(), i = this._mediaList, a = this._mediaDefault, o = [], s = [];
      if (!i.length && !a)
        return s;
      for (var u = 0, l = i.length; u < l; u++)
        bT(i[u].query, r, n) && o.push(u);
      return !o.length && a && (o = [-1]), o.length && !CT(o, this._currentMediaIndices) && (s = z(o, function(h) {
        return $(h === -1 ? a.option : i[h].option);
      })), this._currentMediaIndices = o, s;
    }, e;
  }()
);
function wT(e, t, r) {
  var n = [], i, a, o = e.baseOption, s = e.timeline, u = e.options, l = e.media, h = !!e.media, f = !!(u || s || o && o.timeline);
  o ? (a = o, a.timeline || (a.timeline = s)) : ((f || h) && (e.options = e.media = null), a = e), h && N(l) && D(l, function(c) {
    c && c.option && (c.query ? n.push(c) : i || (i = c));
  }), v(a), D(u, function(c) {
    return v(c);
  }), D(n, function(c) {
    return v(c.option);
  });
  function v(c) {
    D(t, function(d) {
      d(c, r);
    });
  }
  return {
    baseOption: a,
    timelineOptions: u || [],
    mediaDefault: i,
    mediaList: n
  };
}
function bT(e, t, r) {
  var n = {
    width: t,
    height: r,
    aspectratio: t / r
    // lower case for convenience.
  }, i = !0;
  return D(e, function(a, o) {
    var s = o.match(_T);
    if (!(!s || !s[1] || !s[2])) {
      var u = s[1], l = s[2].toLowerCase();
      TT(n[l], a, u) || (i = !1);
    }
  }), i;
}
function TT(e, t, r) {
  return r === "min" ? e >= t : r === "max" ? e <= t : e === t;
}
function CT(e, t) {
  return e.join(",") === t.join(",");
}
var ce = D, ia = F, yc = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function Iu(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0, n = yc.length; r < n; r++) {
      var i = yc[r], a = t.normal, o = t.emphasis;
      a && a[i] && (e[i] = e[i] || {}, e[i].normal ? ct(e[i].normal, a[i]) : e[i].normal = a[i], a[i] = null), o && o[i] && (e[i] = e[i] || {}, e[i].emphasis ? ct(e[i].emphasis, o[i]) : e[i].emphasis = o[i], o[i] = null);
    }
}
function Dt(e, t, r) {
  if (e && e[t] && (e[t].normal || e[t].emphasis)) {
    var n = e[t].normal, i = e[t].emphasis;
    n && (r ? (e[t].normal = e[t].emphasis = null, mt(e[t], n)) : e[t] = n), i && (e.emphasis = e.emphasis || {}, e.emphasis[t] = i, i.focus && (e.emphasis.focus = i.focus), i.blurScope && (e.emphasis.blurScope = i.blurScope));
  }
}
function Ai(e) {
  Dt(e, "itemStyle"), Dt(e, "lineStyle"), Dt(e, "areaStyle"), Dt(e, "label"), Dt(e, "labelLine"), Dt(e, "upperLabel"), Dt(e, "edgeLabel");
}
function dt(e, t) {
  var r = ia(e) && e[t], n = ia(r) && r.textStyle;
  if (n)
    for (var i = 0, a = yv.length; i < a; i++) {
      var o = yv[i];
      n.hasOwnProperty(o) && (r[o] = n[o]);
    }
}
function oe(e) {
  e && (Ai(e), dt(e, "label"), e.emphasis && dt(e.emphasis, "label"));
}
function MT(e) {
  if (ia(e)) {
    Iu(e), Ai(e), dt(e, "label"), dt(e, "upperLabel"), dt(e, "edgeLabel"), e.emphasis && (dt(e.emphasis, "label"), dt(e.emphasis, "upperLabel"), dt(e.emphasis, "edgeLabel"));
    var t = e.markPoint;
    t && (Iu(t), oe(t));
    var r = e.markLine;
    r && (Iu(r), oe(r));
    var n = e.markArea;
    n && oe(n);
    var i = e.data;
    if (e.type === "graph") {
      i = i || e.nodes;
      var a = e.links || e.edges;
      if (a && !Vt(a))
        for (var o = 0; o < a.length; o++)
          oe(a[o]);
      D(e.categories, function(l) {
        Ai(l);
      });
    }
    if (i && !Vt(i))
      for (var o = 0; o < i.length; o++)
        oe(i[o]);
    if (t = e.markPoint, t && t.data)
      for (var s = t.data, o = 0; o < s.length; o++)
        oe(s[o]);
    if (r = e.markLine, r && r.data)
      for (var u = r.data, o = 0; o < u.length; o++)
        N(u[o]) ? (oe(u[o][0]), oe(u[o][1])) : oe(u[o]);
    e.type === "gauge" ? (dt(e, "axisLabel"), dt(e, "title"), dt(e, "detail")) : e.type === "treemap" ? (Dt(e.breadcrumb, "itemStyle"), D(e.levels, function(l) {
      Ai(l);
    })) : e.type === "tree" && Ai(e.leaves);
  }
}
function Xe(e) {
  return N(e) ? e : e ? [e] : [];
}
function mc(e) {
  return (N(e) ? e[0] : e) || {};
}
function DT(e, t) {
  ce(Xe(e.series), function(n) {
    ia(n) && MT(n);
  });
  var r = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  t && r.push("valueAxis", "categoryAxis", "logAxis", "timeAxis"), ce(r, function(n) {
    ce(Xe(e[n]), function(i) {
      i && (dt(i, "axisLabel"), dt(i.axisPointer, "label"));
    });
  }), ce(Xe(e.parallel), function(n) {
    var i = n && n.parallelAxisDefault;
    dt(i, "axisLabel"), dt(i && i.axisPointer, "label");
  }), ce(Xe(e.calendar), function(n) {
    Dt(n, "itemStyle"), dt(n, "dayLabel"), dt(n, "monthLabel"), dt(n, "yearLabel");
  }), ce(Xe(e.radar), function(n) {
    dt(n, "name"), n.name && n.axisName == null && (n.axisName = n.name, delete n.name), n.nameGap != null && n.axisNameGap == null && (n.axisNameGap = n.nameGap, delete n.nameGap);
  }), ce(Xe(e.geo), function(n) {
    ia(n) && (oe(n), ce(Xe(n.regions), function(i) {
      oe(i);
    }));
  }), ce(Xe(e.timeline), function(n) {
    oe(n), Dt(n, "label"), Dt(n, "itemStyle"), Dt(n, "controlStyle", !0);
    var i = n.data;
    N(i) && D(i, function(a) {
      F(a) && (Dt(a, "label"), Dt(a, "itemStyle"));
    });
  }), ce(Xe(e.toolbox), function(n) {
    Dt(n, "iconStyle"), ce(n.feature, function(i) {
      Dt(i, "iconStyle");
    });
  }), dt(mc(e.axisPointer), "label"), dt(mc(e.tooltip).axisPointer, "label");
}
function IT(e, t) {
  for (var r = t.split(","), n = e, i = 0; i < r.length && (n = n && n[r[i]], n != null); i++)
    ;
  return n;
}
function xT(e, t, r, n) {
  for (var i = t.split(","), a = e, o, s = 0; s < i.length - 1; s++)
    o = i[s], a[o] == null && (a[o] = {}), a = a[o];
  a[i[s]] == null && (a[i[s]] = r);
}
function _c(e) {
  e && D(LT, function(t) {
    t[0] in e && !(t[1] in e) && (e[t[1]] = e[t[0]]);
  });
}
var LT = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]], ET = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"], xu = [["borderRadius", "barBorderRadius"], ["borderColor", "barBorderColor"], ["borderWidth", "barBorderWidth"]];
function pi(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0; r < xu.length; r++) {
      var n = xu[r][1], i = xu[r][0];
      t[n] != null && (t[i] = t[n]);
    }
}
function Sc(e) {
  e && e.alignTo === "edge" && e.margin != null && e.edgeDistance == null && (e.edgeDistance = e.margin);
}
function wc(e) {
  e && e.downplay && !e.blur && (e.blur = e.downplay);
}
function RT(e) {
  e && e.focusNodeAdjacency != null && (e.emphasis = e.emphasis || {}, e.emphasis.focus == null && (e.emphasis.focus = "adjacency"));
}
function dy(e, t) {
  if (e)
    for (var r = 0; r < e.length; r++)
      t(e[r]), e[r] && dy(e[r].children, t);
}
function py(e, t) {
  DT(e, t), e.series = zt(e.series), D(e.series, function(r) {
    if (F(r)) {
      var n = r.type;
      if (n === "line")
        r.clipOverflow != null && (r.clip = r.clipOverflow);
      else if (n === "pie" || n === "gauge") {
        r.clockWise != null && (r.clockwise = r.clockWise), Sc(r.label);
        var i = r.data;
        if (i && !Vt(i))
          for (var a = 0; a < i.length; a++)
            Sc(i[a]);
        r.hoverOffset != null && (r.emphasis = r.emphasis || {}, (r.emphasis.scaleSize = null) && (r.emphasis.scaleSize = r.hoverOffset));
      } else if (n === "gauge") {
        var o = IT(r, "pointer.color");
        o != null && xT(r, "itemStyle.color", o);
      } else if (n === "bar") {
        pi(r), pi(r.backgroundStyle), pi(r.emphasis);
        var i = r.data;
        if (i && !Vt(i))
          for (var a = 0; a < i.length; a++)
            typeof i[a] == "object" && (pi(i[a]), pi(i[a] && i[a].emphasis));
      } else if (n === "sunburst") {
        var s = r.highlightPolicy;
        s && (r.emphasis = r.emphasis || {}, r.emphasis.focus || (r.emphasis.focus = s)), wc(r), dy(r.data, wc);
      } else n === "graph" || n === "sankey" ? RT(r) : n === "map" && (r.mapType && !r.map && (r.map = r.mapType), r.mapLocation && mt(r, r.mapLocation));
      r.hoverAnimation != null && (r.emphasis = r.emphasis || {}, r.emphasis && r.emphasis.scale == null && (r.emphasis.scale = r.hoverAnimation)), _c(r);
    }
  }), e.dataRange && (e.visualMap = e.dataRange), D(ET, function(r) {
    var n = e[r];
    n && (N(n) || (n = [n]), D(n, function(i) {
      _c(i);
    }));
  });
}
var PT = ig(AT);
function AT(e) {
  var t = V();
  e.eachSeries(function(r) {
    var n = r.get("stack");
    if (n) {
      var i = t.get(n) || t.set(n, []), a = r.getData(), o = {
        // Used for calculate axis extent automatically.
        // TODO: Type getCalculationInfo return more specific type?
        stackResultDimension: a.getCalculationInfo("stackResultDimension"),
        stackedOverDimension: a.getCalculationInfo("stackedOverDimension"),
        stackedDimension: a.getCalculationInfo("stackedDimension"),
        stackedByDimension: a.getCalculationInfo("stackedByDimension"),
        isStackedByIndex: a.getCalculationInfo("isStackedByIndex"),
        data: a,
        seriesModel: r
      };
      if (!o.stackedDimension || !(o.isStackedByIndex || o.stackedByDimension))
        return;
      i.push(o);
    }
  }), t.each(function(r) {
    if (r.length !== 0) {
      var n = r[0].seriesModel, i = n.get("stackOrder") || "seriesAsc";
      i === "seriesDesc" && r.reverse(), D(r, function(a, o) {
        a.data.setCalculationInfo("stackedOnSeries", o > 0 ? r[o - 1].seriesModel : null);
      }), OT(r);
    }
  });
}
function OT(e) {
  D(e, function(t, r) {
    var n = [], i = [NaN, NaN], a = [t.stackResultDimension, t.stackedOverDimension], o = t.data, s = t.isStackedByIndex, u = t.seriesModel.get("stackStrategy") || "samesign";
    o.modify(a, function(l, h, f) {
      var v = o.get(t.stackedDimension, f);
      if (isNaN(v))
        return i;
      var c, d;
      s ? d = o.getRawIndex(f) : c = o.get(t.stackedByDimension, f);
      for (var y = NaN, p = r - 1; p >= 0; p--) {
        var g = e[p];
        if (s || (d = g.data.rawIndexOf(g.stackedByDimension, c)), d >= 0) {
          var m = g.data.getByRawIndex(g.stackResultDimension, d);
          if (u === "all" || u === "positive" && m > 0 || u === "negative" && m < 0 || u === "samesign" && v >= 0 && m > 0 || u === "samesign" && v <= 0 && m < 0) {
            v = p1(v, m), y = m;
            break;
          }
        }
      }
      return n[0] = v, n[1] = y, n;
    });
  });
}
var Ls = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      this.data = t.data || (t.sourceFormat === Ue ? {} : []), this.sourceFormat = t.sourceFormat || gg, this.seriesLayoutBy = t.seriesLayoutBy || ze, this.startIndex = t.startIndex || 0, this.dimensionsDetectedCount = t.dimensionsDetectedCount, this.metaRawOption = t.metaRawOption;
      var r = this.dimensionsDefine = t.dimensionsDefine;
      if (r)
        for (var n = 0; n < r.length; n++) {
          var i = r[n];
          i.type == null && cy(this, n) === Qt.Must && (i.type = "ordinal");
        }
    }
    return e;
  }()
);
function sh(e) {
  return e instanceof Ls;
}
function Wl(e, t, r) {
  r = r || gy(e);
  var n = t.seriesLayoutBy, i = NT(e, r, n, t.sourceHeader, t.dimensions), a = new Ls({
    data: e,
    sourceFormat: r,
    seriesLayoutBy: n,
    dimensionsDefine: i.dimensionsDefine,
    startIndex: i.startIndex,
    dimensionsDetectedCount: i.dimensionsDetectedCount,
    metaRawOption: $(t)
  });
  return a;
}
function uh(e) {
  return new Ls({
    data: e,
    sourceFormat: Vt(e) ? yr : re
  });
}
function kT(e) {
  return new Ls({
    data: e.data,
    sourceFormat: e.sourceFormat,
    seriesLayoutBy: e.seriesLayoutBy,
    dimensionsDefine: $(e.dimensionsDefine),
    startIndex: e.startIndex,
    dimensionsDetectedCount: e.dimensionsDetectedCount
  });
}
function gy(e) {
  var t = gg;
  if (Vt(e))
    t = yr;
  else if (N(e)) {
    e.length === 0 && (t = Rt);
    for (var r = 0, n = e.length; r < n; r++) {
      var i = e[r];
      if (i != null) {
        if (N(i) || Vt(i)) {
          t = Rt;
          break;
        } else if (F(i)) {
          t = Ce;
          break;
        }
      }
    }
  } else if (F(e)) {
    for (var a in e)
      if (Oe(e, a) && $t(e[a])) {
        t = Ue;
        break;
      }
  }
  return t;
}
function NT(e, t, r, n, i) {
  var a, o;
  if (!e)
    return {
      dimensionsDefine: bc(i),
      startIndex: o,
      dimensionsDetectedCount: a
    };
  if (t === Rt) {
    var s = e;
    n === "auto" || n == null ? Tc(function(l) {
      l != null && l !== "-" && (G(l) ? o == null && (o = 1) : o = 0);
    }, r, s, 10) : o = pt(n) ? n : n ? 1 : 0, !i && o === 1 && (i = [], Tc(function(l, h) {
      i[h] = l != null ? l + "" : "";
    }, r, s, 1 / 0)), a = i ? i.length : r === gn ? s.length : s[0] ? s[0].length : null;
  } else if (t === Ce)
    i || (i = BT(e));
  else if (t === Ue)
    i || (i = [], D(e, function(l, h) {
      i.push(h);
    }));
  else if (t === re) {
    var u = va(e[0]);
    a = N(u) && u.length || 1;
  }
  return {
    startIndex: o,
    dimensionsDefine: bc(i),
    dimensionsDetectedCount: a
  };
}
function BT(e) {
  for (var t = 0, r; t < e.length && !(r = e[t++]); )
    ;
  if (r)
    return ft(r);
}
function bc(e) {
  if (e) {
    var t = V();
    return z(e, function(r, n) {
      r = F(r) ? r : {
        name: r
      };
      var i = {
        name: r.name,
        displayName: r.displayName,
        type: r.type
      };
      if (i.name == null)
        return i;
      i.name += "", i.displayName == null && (i.displayName = i.name);
      var a = t.get(i.name);
      return a ? i.name += "-" + a.count++ : t.set(i.name, {
        count: 1
      }), i;
    });
  }
}
function Tc(e, t, r, n) {
  if (t === gn)
    for (var i = 0; i < r.length && i < n; i++)
      e(r[i] ? r[i][0] : null, i);
  else
    for (var a = r[0] || [], i = 0; i < a.length && i < n; i++)
      e(a[i], i);
}
function yy(e) {
  var t = e.sourceFormat;
  return t === Ce || t === Ue;
}
var Yr, Wr, Xr, $r, Cc, Mc, my = (
  /** @class */
  function() {
    function e(t, r) {
      var n = sh(t) ? t : uh(t);
      this._source = n;
      var i = this._data = n.data, a = n.sourceFormat;
      n.seriesLayoutBy, a === yr && (this._offset = 0, this._dimSize = r, this._data = i), Mc(this, i, n);
    }
    return e.prototype.getSource = function() {
      return this._source;
    }, e.prototype.count = function() {
      return 0;
    }, e.prototype.getItem = function(t, r) {
    }, e.prototype.appendData = function(t) {
    }, e.prototype.clean = function() {
    }, e.protoInitialize = function() {
      var t = e.prototype;
      t.pure = !1, t.persistent = !0;
    }(), e.internalField = function() {
      var t;
      Mc = function(o, s, u) {
        var l = u.sourceFormat, h = u.seriesLayoutBy, f = u.startIndex, v = u.dimensionsDefine, c = Cc[lh(l, h)];
        if (A(o, c), l === yr)
          o.getItem = r, o.count = i, o.fillStorage = n;
        else {
          var d = _y(l, h);
          o.getItem = lt(d, null, s, f, v);
          var y = Sy(l, h);
          o.count = lt(y, null, s, f, v);
        }
      };
      var r = function(o, s) {
        o = o - this._offset, s = s || [];
        for (var u = this._data, l = this._dimSize, h = l * o, f = 0; f < l; f++)
          s[f] = u[h + f];
        return s;
      }, n = function(o, s, u, l) {
        for (var h = this._data, f = this._dimSize, v = 0; v < f; v++) {
          for (var c = l[v], d = c[0] == null ? 1 / 0 : c[0], y = c[1] == null ? -1 / 0 : c[1], p = s - o, g = u[v], m = 0; m < p; m++) {
            var _ = h[m * f + v];
            g[o + m] = _, _ < d && (d = _), _ > y && (y = _);
          }
          c[0] = d, c[1] = y;
        }
      }, i = function() {
        return this._data ? this._data.length / this._dimSize : 0;
      };
      Cc = (t = {}, t[Rt + "_" + ze] = {
        pure: !0,
        appendData: a
      }, t[Rt + "_" + gn] = {
        pure: !0,
        appendData: function() {
          throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
        }
      }, t[Ce] = {
        pure: !0,
        appendData: a
      }, t[Ue] = {
        pure: !0,
        appendData: function(o) {
          var s = this._data;
          D(o, function(u, l) {
            for (var h = s[l] || (s[l] = []), f = 0; f < (u || []).length; f++)
              h.push(u[f]);
          });
        }
      }, t[re] = {
        appendData: a
      }, t[yr] = {
        persistent: !1,
        pure: !0,
        appendData: function(o) {
          this._data = o;
        },
        // Clean self if data is already used.
        clean: function() {
          this._offset += this.count(), this._data = null;
        }
      }, t);
      function a(o) {
        for (var s = 0; s < o.length; s++)
          this._data.push(o[s]);
      }
    }(), e;
  }()
), Ba = function(e) {
  N(e) || Qp("series.data or dataset.source must be an array.");
};
Yr = {}, Yr[Rt + "_" + ze] = Ba, Yr[Rt + "_" + gn] = Ba, Yr[Ce] = Ba, Yr[Ue] = function(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r].name;
    n == null && Qp("dimension name must not be null/undefined.");
  }
}, Yr[re] = Ba;
var Dc = function(e, t, r, n) {
  return e[n];
}, FT = (Wr = {}, Wr[Rt + "_" + ze] = function(e, t, r, n) {
  return e[n + t];
}, Wr[Rt + "_" + gn] = function(e, t, r, n, i) {
  n += t;
  for (var a = i || [], o = e, s = 0; s < o.length; s++) {
    var u = o[s];
    a[s] = u ? u[n] : null;
  }
  return a;
}, Wr[Ce] = Dc, Wr[Ue] = function(e, t, r, n, i) {
  for (var a = i || [], o = 0; o < r.length; o++) {
    var s = r[o].name, u = s != null ? e[s] : null;
    a[o] = u ? u[n] : null;
  }
  return a;
}, Wr[re] = Dc, Wr);
function _y(e, t) {
  var r = FT[lh(e, t)];
  return r;
}
var Ic = function(e, t, r) {
  return e.length;
}, zT = (Xr = {}, Xr[Rt + "_" + ze] = function(e, t, r) {
  return Math.max(0, e.length - t);
}, Xr[Rt + "_" + gn] = function(e, t, r) {
  var n = e[0];
  return n ? Math.max(0, n.length - t) : 0;
}, Xr[Ce] = Ic, Xr[Ue] = function(e, t, r) {
  var n = r[0].name, i = n != null ? e[n] : null;
  return i ? i.length : 0;
}, Xr[re] = Ic, Xr);
function Sy(e, t) {
  var r = zT[lh(e, t)];
  return r;
}
var Lu = function(e, t, r) {
  return e[t];
}, VT = ($r = {}, $r[Rt] = Lu, $r[Ce] = function(e, t, r) {
  return e[r];
}, $r[Ue] = Lu, $r[re] = function(e, t, r) {
  var n = va(e);
  return n instanceof Array ? n[t] : n;
}, $r[yr] = Lu, $r);
function wy(e) {
  var t = VT[e];
  return t;
}
function lh(e, t) {
  return e === Rt ? e + "_" + t : e;
}
function Jn(e, t, r) {
  if (e) {
    var n = e.getRawDataItem(t);
    if (n != null) {
      var i = e.getStore(), a = i.getSource().sourceFormat;
      if (r != null) {
        var o = e.getDimensionIndex(r), s = i.getDimensionProperty(o);
        return wy(a)(n, o, s);
      } else {
        var u = n;
        return a === re && (u = va(n)), u;
      }
    }
  }
}
var HT = /\{@(.+?)\}/g, GT = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getDataParams = function(t, r) {
      var n = this.getData(r), i = this.getRawValue(t, r), a = n.getRawIndex(t), o = n.getName(t), s = n.getRawDataItem(t), u = n.getItemVisual(t, "style"), l = u && u[n.getItemVisual(t, "drawType") || "fill"], h = u && u.stroke, f = this.mainType, v = f === "series", c = n.userOutput && n.userOutput.get();
      return {
        componentType: f,
        componentSubType: this.subType,
        componentIndex: this.componentIndex,
        seriesType: v ? this.subType : null,
        seriesIndex: this.seriesIndex,
        seriesId: v ? this.id : null,
        seriesName: v ? this.name : null,
        name: o,
        dataIndex: a,
        data: s,
        dataType: r,
        value: i,
        color: l,
        borderColor: h,
        dimensionNames: c ? c.fullDimensions : null,
        encode: c ? c.encode : null,
        // Param name list for mapping `a`, `b`, `c`, `d`, `e`
        $vars: ["seriesName", "name", "value"]
      };
    }, e.prototype.getFormattedLabel = function(t, r, n, i, a, o) {
      r = r || "normal";
      var s = this.getData(n), u = this.getDataParams(t, n);
      if (o && (u.value = o.interpolatedValue), i != null && N(u.value) && (u.value = u.value[i]), !a) {
        var l = s.getItemModel(t);
        a = l.get(r === "normal" ? ["label", "formatter"] : [r, "label", "formatter"]);
      }
      if (Z(a))
        return u.status = r, u.dimensionIndex = i, a(u);
      if (G(a)) {
        var h = ay(a, u);
        return h.replace(HT, function(f, v) {
          var c = v.length, d = v;
          d.charAt(0) === "[" && d.charAt(c - 1) === "]" && (d = +d.slice(1, c - 1));
          var y = Jn(s, t, d);
          if (o && N(o.interpolatedValue)) {
            var p = s.getDimensionIndex(d);
            p >= 0 && (y = o.interpolatedValue[p]);
          }
          return y != null ? y + "" : "";
        });
      }
    }, e.prototype.getRawValue = function(t, r) {
      return Jn(this.getData(r), t);
    }, e.prototype.formatTooltip = function(t, r, n) {
    }, e;
  }()
);
function Ui(e) {
  return new UT(e);
}
var UT = (
  /** @class */
  function() {
    function e(t) {
      t = t || {}, this._reset = t.reset, this._plan = t.plan, this._count = t.count, this._onDirty = t.onDirty, this._dirty = !0;
    }
    return e.prototype.perform = function(t) {
      var r = this._upstream, n = t && t.skip;
      if (this._dirty && r) {
        var i = this.context;
        i.data = i.outputData = r.context.outputData;
      }
      this.__pipeline && (this.__pipeline.currentTask = this);
      var a;
      this._plan && !n && (a = this._plan(this.context));
      var o = h(this._modBy), s = this._modDataCount || 0, u = h(t && t.modBy), l = t && t.modDataCount || 0;
      (o !== u || s !== l) && (a = "reset");
      function h(m) {
        return !(m >= 1) && (m = 1), m;
      }
      var f;
      (this._dirty || a === "reset") && (this._dirty = !1, f = this._doReset(n)), this._modBy = u, this._modDataCount = l;
      var v = t && t.step;
      if (r ? this._dueEnd = r._outputDueEnd : this._dueEnd = this._count ? this._count(this.context) : 1 / 0, this._progress) {
        var c = this._dueIndex, d = Math.min(v != null ? this._dueIndex + v : 1 / 0, this._dueEnd);
        if (!n && (f || c < d)) {
          var y = this._progress;
          if (N(y))
            for (var p = 0; p < y.length; p++)
              this._doProgress(y[p], c, d, u, l);
          else
            this._doProgress(y, c, d, u, l);
        }
        this._dueIndex = d;
        var g = this._settedOutputEnd != null ? this._settedOutputEnd : d;
        this._outputDueEnd = g;
      } else
        this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
      return this.unfinished();
    }, e.prototype.dirty = function() {
      this._dirty = !0, this._onDirty && this._onDirty(this.context);
    }, e.prototype._doProgress = function(t, r, n, i, a) {
      xc.reset(r, n, i, a), this._callingProgress = t, this._callingProgress({
        start: r,
        end: n,
        count: n - r,
        next: xc.next
      }, this.context);
    }, e.prototype._doReset = function(t) {
      this._dueIndex = this._outputDueEnd = this._dueEnd = 0, this._settedOutputEnd = null;
      var r, n;
      !t && this._reset && (r = this._reset(this.context), r && r.progress && (n = r.forceFirstProgress, r = r.progress), N(r) && !r.length && (r = null)), this._progress = r, this._modBy = this._modDataCount = null;
      var i = this._downstream;
      return i && i.dirty(), n;
    }, e.prototype.unfinished = function() {
      return this._progress && this._dueIndex < this._dueEnd;
    }, e.prototype.pipe = function(t) {
      (this._downstream !== t || this._dirty) && (this._downstream = t, t._upstream = this, t.dirty());
    }, e.prototype.dispose = function() {
      this._disposed || (this._upstream && (this._upstream._downstream = null), this._downstream && (this._downstream._upstream = null), this._dirty = !1, this._disposed = !0);
    }, e.prototype.getUpstream = function() {
      return this._upstream;
    }, e.prototype.getDownstream = function() {
      return this._downstream;
    }, e.prototype.setOutputEnd = function(t) {
      this._outputDueEnd = this._settedOutputEnd = t;
    }, e;
  }()
), xc = /* @__PURE__ */ function() {
  var e, t, r, n, i, a = {
    reset: function(u, l, h, f) {
      t = u, e = l, r = h, n = f, i = Math.ceil(n / r), a.next = r > 1 && n > 0 ? s : o;
    }
  };
  return a;
  function o() {
    return t < e ? t++ : null;
  }
  function s() {
    var u = t % i * r + Math.ceil(t / i), l = t >= e ? null : u < n ? u : t;
    return t++, l;
  }
}();
function Co(e, t) {
  var r = t && t.type;
  return r === "ordinal" ? e : (r === "time" && !pt(e) && e != null && e !== "-" && (e = +Cr(e)), e == null || e === "" ? NaN : Number(e));
}
V({
  number: function(e) {
    return parseFloat(e);
  },
  time: function(e) {
    return +Cr(e);
  },
  trim: function(e) {
    return G(e) ? Qe(e) : e;
  }
});
function YT(e) {
  var t = "", r = -1 / 0, n = -1 / 0, i = 1 / 0, a = 1 / 0;
  return e && (e.g != null && (t += "G" + e.g, r = e.g), e.ge != null && (t += "GE" + e.ge, n = e.ge), e.l != null && (t += "L" + e.l, i = e.l), e.le != null && (t += "LE" + e.le, a = e.le)), {
    key: t,
    g: r,
    ge: n,
    l: i,
    le: a
  };
}
function WT(e, t) {
  return t > e.g && t >= e.ge && t < e.l && t <= e.le;
}
var XT = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.getRawData = function() {
      throw new Error("not supported");
    }, e.prototype.getRawDataItem = function(t) {
      throw new Error("not supported");
    }, e.prototype.cloneRawData = function() {
    }, e.prototype.getDimensionInfo = function(t) {
    }, e.prototype.cloneAllDimensionInfo = function() {
    }, e.prototype.count = function() {
    }, e.prototype.retrieveValue = function(t, r) {
    }, e.prototype.retrieveValueFromItem = function(t, r) {
    }, e.prototype.convertValue = function(t, r) {
      return Co(t, r);
    }, e;
  }()
);
function $T(e, t) {
  var r = new XT(), n = e.data, i = r.sourceFormat = e.sourceFormat, a = e.startIndex, o = "";
  e.seriesLayoutBy !== ze && te(o);
  var s = [], u = {}, l = e.dimensionsDefine;
  if (l)
    D(l, function(y, p) {
      var g = y.name, m = {
        index: p,
        name: g,
        displayName: y.displayName
      };
      if (s.push(m), g != null) {
        var _ = "";
        Oe(u, g) && te(_), u[g] = m;
      }
    });
  else
    for (var h = 0; h < e.dimensionsDetectedCount; h++)
      s.push({
        index: h
      });
  var f = _y(i, ze);
  t.__isBuiltIn && (r.getRawDataItem = function(y) {
    return f(n, a, s, y);
  }, r.getRawData = lt(ZT, null, e)), r.cloneRawData = lt(qT, null, e);
  var v = Sy(i, ze);
  r.count = lt(v, null, n, a, s);
  var c = wy(i);
  r.retrieveValue = function(y, p) {
    var g = f(n, a, s, y);
    return d(g, p);
  };
  var d = r.retrieveValueFromItem = function(y, p) {
    if (y != null) {
      var g = s[p];
      if (g)
        return c(y, p, g.name);
    }
  };
  return r.getDimensionInfo = lt(KT, null, s, u), r.cloneAllDimensionInfo = lt(QT, null, s), r;
}
function ZT(e) {
  var t = e.sourceFormat;
  if (!fh(t)) {
    var r = "";
    te(r);
  }
  return e.data;
}
function qT(e) {
  var t = e.sourceFormat, r = e.data;
  if (!fh(t)) {
    var n = "";
    te(n);
  }
  if (t === Rt) {
    for (var i = [], a = 0, o = r.length; a < o; a++)
      i.push(r[a].slice());
    return i;
  } else if (t === Ce) {
    for (var i = [], a = 0, o = r.length; a < o; a++)
      i.push(A({}, r[a]));
    return i;
  }
}
function KT(e, t, r) {
  if (r != null) {
    if (pt(r) || !isNaN(r) && !Oe(t, r))
      return e[r];
    if (Oe(t, r))
      return t[r];
  }
}
function QT(e) {
  return $(e);
}
var by = V();
function JT(e) {
  e = $(e);
  var t = e.type, r = "";
  t || te(r);
  var n = t.split(":");
  n.length !== 2 && te(r);
  var i = !1;
  n[0] === "echarts" && (t = n[1], i = !0), e.__isBuiltIn = i, by.set(t, e);
}
function jT(e, t, r) {
  var n = zt(e), i = n.length, a = "";
  i || te(a);
  for (var o = 0, s = i; o < s; o++) {
    var u = n[o];
    t = tC(u, t), o !== s - 1 && (t.length = Math.max(t.length, 1));
  }
  return t;
}
function tC(e, t, r, n) {
  var i = "";
  t.length || te(i), F(e) || te(i);
  var a = e.type, o = by.get(a);
  o || te(i);
  var s = z(t, function(l) {
    return $T(l, o);
  }), u = zt(o.transform({
    upstream: s[0],
    upstreamList: s,
    config: $(e.config)
  }));
  return z(u, function(l, h) {
    var f = "";
    F(l) || te(f), l.data || te(f);
    var v = gy(l.data);
    fh(v) || te(f);
    var c, d = t[0];
    if (d && h === 0 && !l.dimensions) {
      var y = d.startIndex;
      y && (l.data = d.data.slice(0, y).concat(l.data)), c = {
        seriesLayoutBy: ze,
        sourceHeader: y,
        dimensions: d.metaRawOption.dimensions
      };
    } else
      c = {
        seriesLayoutBy: ze,
        sourceHeader: 0,
        dimensions: l.dimensions
      };
    return Wl(l.data, c, null);
  });
}
function fh(e) {
  return e === Rt || e === Ce;
}
var eC = typeof Uint32Array === _s ? Array : Uint32Array, rC = typeof Uint16Array === _s ? Array : Uint16Array, Ty = typeof Int32Array === _s ? Array : Int32Array, Lc = typeof Float64Array === _s ? Array : Float64Array, Cy = {
  float: Lc,
  int: Ty,
  // Ordinal data type can be string or int
  ordinal: Array,
  number: Array,
  time: Lc
}, Eu;
function Dn(e) {
  return e > 65535 ? eC : rC;
}
function nC(e) {
  var t = e.constructor;
  return t === Array ? e.slice() : new t(e);
}
function Ec(e, t, r, n, i) {
  var a = Cy[r || "float"];
  if (i) {
    var o = e[t], s = o && o.length;
    if (s !== n) {
      for (var u = new a(n), l = 0; l < s; l++)
        u[l] = o[l];
      e[t] = u;
    }
  } else
    e[t] = new a(n);
}
var Xl = (
  /** @class */
  function() {
    function e() {
      this._chunks = [], this._rawExtent = [], this._extent = [], this._count = 0, this._rawCount = 0, this._calcDimNameToIdx = V();
    }
    return e.prototype.initData = function(t, r, n) {
      this._provider = t, this._chunks = [], this._indices = null, this.getRawIndex = this._getRawIdxIdentity;
      var i = t.getSource(), a = this.defaultDimValueGetter = Eu[i.sourceFormat];
      this._dimValueGetter = n || a, this._rawExtent = [], yy(i), this._dimensions = z(r, function(o) {
        return {
          // Only pick these two props. Not leak other properties like orderMeta.
          type: o.type,
          property: o.property
        };
      }), this._initDataFromProvider(0, t.count());
    }, e.prototype.getProvider = function() {
      return this._provider;
    }, e.prototype.getSource = function() {
      return this._provider.getSource();
    }, e.prototype.ensureCalculationDimension = function(t, r) {
      var n = this._calcDimNameToIdx, i = this._dimensions, a = n.get(t);
      if (a != null) {
        if (i[a].type === r)
          return a;
      } else
        a = i.length;
      return i[a] = {
        type: r
      }, n.set(t, a), this._chunks[a] = new Cy[r || "float"](this._rawCount), this._rawExtent[a] = Ke(), a;
    }, e.prototype.collectOrdinalMeta = function(t, r) {
      var n = this._chunks[t], i = this._dimensions[t], a = this._rawExtent, o = i.ordinalOffset || 0, s = n.length;
      o === 0 && (a[t] = Ke());
      for (var u = a[t], l = o; l < s; l++) {
        var h = n[l] = r.parseAndCollect(n[l]);
        isNaN(h) || (u[0] = Math.min(h, u[0]), u[1] = Math.max(h, u[1]));
      }
      i.ordinalMeta = r, i.ordinalOffset = s, i.type = "ordinal";
    }, e.prototype.getOrdinalMeta = function(t) {
      var r = this._dimensions[t], n = r.ordinalMeta;
      return n;
    }, e.prototype.getDimensionProperty = function(t) {
      var r = this._dimensions[t];
      return r && r.property;
    }, e.prototype.appendData = function(t) {
      var r = this._provider, n = this.count();
      r.appendData(t);
      var i = r.count();
      return r.persistent || (i += n), n < i && this._initDataFromProvider(n, i, !0), [n, i];
    }, e.prototype.appendValues = function(t, r) {
      for (var n = this._chunks, i = this._dimensions, a = i.length, o = this._rawExtent, s = this.count(), u = s + Math.max(t.length, r || 0), l = 0; l < a; l++) {
        var h = i[l];
        Ec(n, l, h.type, u, !0);
      }
      for (var f = [], v = s; v < u; v++)
        for (var c = v - s, d = 0; d < a; d++) {
          var h = i[d], y = Eu.arrayRows.call(this, t[c] || f, h.property, c, d);
          n[d][v] = y;
          var p = o[d];
          y < p[0] && (p[0] = y), y > p[1] && (p[1] = y);
        }
      return this._rawCount = this._count = u, {
        start: s,
        end: u
      };
    }, e.prototype._initDataFromProvider = function(t, r, n) {
      for (var i = this._provider, a = this._chunks, o = this._dimensions, s = o.length, u = this._rawExtent, l = z(o, function(m) {
        return m.property;
      }), h = 0; h < s; h++) {
        var f = o[h];
        u[h] || (u[h] = Ke()), Ec(a, h, f.type, r, n);
      }
      if (i.fillStorage)
        i.fillStorage(t, r, a, u);
      else
        for (var v = [], c = t; c < r; c++) {
          v = i.getItem(c, v);
          for (var d = 0; d < s; d++) {
            var y = a[d], p = this._dimValueGetter(v, l[d], c, d);
            y[c] = p;
            var g = u[d];
            p < g[0] && (g[0] = p), p > g[1] && (g[1] = p);
          }
        }
      !i.persistent && i.clean && i.clean(), this._rawCount = this._count = r, this._extent = [];
    }, e.prototype.count = function() {
      return this._count;
    }, e.prototype.get = function(t, r) {
      if (!(r >= 0 && r < this._count))
        return NaN;
      var n = this._chunks[t];
      return n ? n[this.getRawIndex(r)] : NaN;
    }, e.prototype.getValues = function(t, r) {
      var n = [], i = [];
      if (r == null) {
        r = t, t = [];
        for (var a = 0; a < this._dimensions.length; a++)
          i.push(a);
      } else
        i = t;
      for (var a = 0, o = i.length; a < o; a++)
        n.push(this.get(i[a], r));
      return n;
    }, e.prototype.getByRawIndex = function(t, r) {
      if (!(r >= 0 && r < this._rawCount))
        return NaN;
      var n = this._chunks[t];
      return n ? n[r] : NaN;
    }, e.prototype.getSum = function(t) {
      var r = this._chunks[t], n = 0;
      if (r)
        for (var i = 0, a = this.count(); i < a; i++) {
          var o = this.get(t, i);
          isNaN(o) || (n += o);
        }
      return n;
    }, e.prototype.getMedian = function(t) {
      var r = [];
      this.each([t], function(i) {
        isNaN(i) || r.push(i);
      }), bf(r);
      var n = this.count();
      return n === 0 ? 0 : n % 2 === 1 ? r[(n - 1) / 2] : (r[n / 2] + r[n / 2 - 1]) / 2;
    }, e.prototype.indexOfRawIndex = function(t) {
      if (t >= this._rawCount || t < 0)
        return -1;
      if (!this._indices)
        return t;
      var r = this._indices, n = r[t];
      if (n != null && n < this._count && n === t)
        return t;
      for (var i = 0, a = this._count - 1; i <= a; ) {
        var o = (i + a) / 2 | 0;
        if (r[o] < t)
          i = o + 1;
        else if (r[o] > t)
          a = o - 1;
        else
          return o;
      }
      return -1;
    }, e.prototype.getIndices = function() {
      var t, r = this._indices;
      if (r) {
        var n = r.constructor, i = this._count;
        if (n === Array) {
          t = new n(i);
          for (var a = 0; a < i; a++)
            t[a] = r[a];
        } else
          t = new n(r.buffer, 0, i);
      } else {
        var n = Dn(this._rawCount);
        t = new n(this.count());
        for (var a = 0; a < t.length; a++)
          t[a] = a;
      }
      return t;
    }, e.prototype.filter = function(t, r) {
      if (!this._count)
        return this;
      for (var n = this.clone(), i = n.count(), a = Dn(n._rawCount), o = new a(i), s = [], u = t.length, l = 0, h = t[0], f = n._chunks, v = 0; v < i; v++) {
        var c = void 0, d = n.getRawIndex(v);
        if (u === 0)
          c = r(v);
        else if (u === 1) {
          var y = f[h][d];
          c = r(y, v);
        } else {
          for (var p = 0; p < u; p++)
            s[p] = f[t[p]][d];
          s[p] = v, c = r.apply(null, s);
        }
        c && (o[l++] = d);
      }
      return l < i && (n._indices = o), n._count = l, n._extent = [], n._updateGetRawIdx(), n;
    }, e.prototype.selectRange = function(t) {
      var r = this.clone(), n = r._count;
      if (!n)
        return this;
      var i = ft(t), a = i.length;
      if (!a)
        return this;
      var o = r.count(), s = Dn(r._rawCount), u = new s(o), l = 0, h = i[0], f = t[h][0], v = t[h][1], c = r._chunks, d = !1;
      if (!r._indices) {
        var y = 0;
        if (a === 1) {
          for (var p = c[i[0]], g = 0; g < n; g++) {
            var m = p[g];
            (m >= f && m <= v || isNaN(m)) && (u[l++] = y), y++;
          }
          d = !0;
        } else if (a === 2) {
          for (var p = c[i[0]], _ = c[i[1]], S = t[i[1]][0], w = t[i[1]][1], g = 0; g < n; g++) {
            var m = p[g], b = _[g];
            (m >= f && m <= v || isNaN(m)) && (b >= S && b <= w || isNaN(b)) && (u[l++] = y), y++;
          }
          d = !0;
        }
      }
      if (!d)
        if (a === 1)
          for (var g = 0; g < o; g++) {
            var M = r.getRawIndex(g), m = c[i[0]][M];
            (m >= f && m <= v || isNaN(m)) && (u[l++] = M);
          }
        else
          for (var g = 0; g < o; g++) {
            for (var C = !0, M = r.getRawIndex(g), T = 0; T < a; T++) {
              var I = i[T], m = c[I][M];
              (m < t[I][0] || m > t[I][1]) && (C = !1);
            }
            C && (u[l++] = r.getRawIndex(g));
          }
      return l < o && (r._indices = u), r._count = l, r._extent = [], r._updateGetRawIdx(), r;
    }, e.prototype.map = function(t, r) {
      var n = this.clone(t);
      return this._updateDims(n, t, r), n;
    }, e.prototype.modify = function(t, r) {
      this._updateDims(this, t, r);
    }, e.prototype._updateDims = function(t, r, n) {
      for (var i = t._chunks, a = [], o = r.length, s = t.count(), u = [], l = t._rawExtent, h = 0; h < r.length; h++)
        l[r[h]] = Ke();
      for (var f = 0; f < s; f++) {
        for (var v = t.getRawIndex(f), c = 0; c < o; c++)
          u[c] = i[r[c]][v];
        u[o] = f;
        var d = n && n.apply(null, u);
        if (d != null) {
          typeof d != "object" && (a[0] = d, d = a);
          for (var h = 0; h < d.length; h++) {
            var y = r[h], p = d[h], g = l[y], m = i[y];
            m && (m[v] = p), p < g[0] && (g[0] = p), p > g[1] && (g[1] = p);
          }
        }
      }
    }, e.prototype.lttbDownSample = function(t, r) {
      var n = this.clone([t], !0), i = n._chunks, a = i[t], o = this.count(), s = 0, u = Math.floor(1 / r), l = this.getRawIndex(0), h, f, v, c = new (Dn(this._rawCount))(Math.min((Math.ceil(o / u) + 2) * 2, o));
      c[s++] = l;
      for (var d = 1; d < o - 1; d += u) {
        for (var y = Math.min(d + u, o - 1), p = Math.min(d + u * 2, o), g = (p + y) / 2, m = 0, _ = y; _ < p; _++) {
          var S = this.getRawIndex(_), w = a[S];
          isNaN(w) || (m += w);
        }
        m /= p - y;
        var b = d, M = Math.min(d + u, o), C = d - 1, T = a[l];
        h = -1, v = b;
        for (var I = -1, x = 0, _ = b; _ < M; _++) {
          var S = this.getRawIndex(_), w = a[S];
          if (isNaN(w)) {
            x++, I < 0 && (I = S);
            continue;
          }
          f = Math.abs((C - g) * (w - T) - (C - _) * (m - T)), f > h && (h = f, v = S);
        }
        x > 0 && x < M - b && (c[s++] = Math.min(I, v), v = Math.max(I, v)), c[s++] = v, l = v;
      }
      return c[s++] = this.getRawIndex(o - 1), n._count = s, n._indices = c, n.getRawIndex = this._getRawIdx, n;
    }, e.prototype.minmaxDownSample = function(t, r) {
      for (var n = this.clone([t], !0), i = n._chunks, a = Math.floor(1 / r), o = i[t], s = this.count(), u = new (Dn(this._rawCount))(Math.ceil(s / a) * 2), l = 0, h = 0; h < s; h += a) {
        var f = h, v = o[this.getRawIndex(f)], c = h, d = o[this.getRawIndex(c)], y = a;
        h + a > s && (y = s - h);
        for (var p = 0; p < y; p++) {
          var g = this.getRawIndex(h + p), m = o[g];
          m < v && (v = m, f = h + p), m > d && (d = m, c = h + p);
        }
        var _ = this.getRawIndex(f), S = this.getRawIndex(c);
        f < c ? (u[l++] = _, u[l++] = S) : (u[l++] = S, u[l++] = _);
      }
      return n._count = l, n._indices = u, n._updateGetRawIdx(), n;
    }, e.prototype.downSample = function(t, r, n, i) {
      for (var a = this.clone([t], !0), o = a._chunks, s = [], u = Math.floor(1 / r), l = o[t], h = this.count(), f = a._rawExtent[t] = Ke(), v = new (Dn(this._rawCount))(Math.ceil(h / u)), c = 0, d = 0; d < h; d += u) {
        u > h - d && (u = h - d, s.length = u);
        for (var y = 0; y < u; y++) {
          var p = this.getRawIndex(d + y);
          s[y] = l[p];
        }
        var g = n(s), m = this.getRawIndex(Math.min(d + i(s, g) || 0, h - 1));
        l[m] = g, g < f[0] && (f[0] = g), g > f[1] && (f[1] = g), v[c++] = m;
      }
      return a._count = c, a._indices = v, a._updateGetRawIdx(), a;
    }, e.prototype.each = function(t, r) {
      if (this._count)
        for (var n = t.length, i = this._chunks, a = 0, o = this.count(); a < o; a++) {
          var s = this.getRawIndex(a);
          switch (n) {
            case 0:
              r(a);
              break;
            case 1:
              r(i[t[0]][s], a);
              break;
            case 2:
              r(i[t[0]][s], i[t[1]][s], a);
              break;
            default:
              for (var u = 0, l = []; u < n; u++)
                l[u] = i[t[u]][s];
              l[u] = a, r.apply(null, l);
          }
        }
    }, e.prototype.getDataExtent = function(t, r) {
      var n = this._chunks[t], i = Ke();
      if (!n)
        return i;
      var a = this.count(), o = !this._indices && !r;
      if (o)
        return this._rawExtent[t].slice();
      var s = this._extent, u = s[t] || (s[t] = {}), l = YT(r), h = l.key, f = u[h];
      if (f)
        return f.slice();
      for (var v = i[0], c = i[1], d = 0; d < a; d++) {
        var y = this.getRawIndex(d), p = n[y];
        (!r || WT(l, p)) && (p < v && (v = p), p > c && (c = p));
      }
      return u[h] = [v, c];
    }, e.prototype.getRawDataItem = function(t) {
      var r = this.getRawIndex(t);
      if (this._provider.persistent)
        return this._provider.getItem(r);
      for (var n = [], i = this._chunks, a = 0; a < i.length; a++)
        n.push(i[a][r]);
      return n;
    }, e.prototype.clone = function(t, r) {
      var n = new e(), i = this._chunks, a = t && Ve(t, function(s, u) {
        return s[u] = !0, s;
      }, {});
      if (a)
        for (var o = 0; o < i.length; o++)
          n._chunks[o] = a[o] ? nC(i[o]) : i[o];
      else
        n._chunks = i;
      return this._copyCommonProps(n), r || (n._indices = this._cloneIndices()), n._updateGetRawIdx(), n;
    }, e.prototype._copyCommonProps = function(t) {
      t._count = this._count, t._rawCount = this._rawCount, t._provider = this._provider, t._dimensions = this._dimensions, t._extent = $(this._extent), t._rawExtent = $(this._rawExtent);
    }, e.prototype._cloneIndices = function() {
      if (this._indices) {
        var t = this._indices.constructor, r = void 0;
        if (t === Array) {
          var n = this._indices.length;
          r = new t(n);
          for (var i = 0; i < n; i++)
            r[i] = this._indices[i];
        } else
          r = new t(this._indices);
        return r;
      }
      return null;
    }, e.prototype._getRawIdxIdentity = function(t) {
      return t;
    }, e.prototype._getRawIdx = function(t) {
      return t < this._count && t >= 0 ? this._indices[t] : -1;
    }, e.prototype._updateGetRawIdx = function() {
      this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
    }, e.internalField = function() {
      function t(r, n, i, a) {
        return Co(r[a], this._dimensions[a]);
      }
      Eu = {
        arrayRows: t,
        objectRows: function(r, n, i, a) {
          return Co(r[n], this._dimensions[a]);
        },
        keyedColumns: t,
        original: function(r, n, i, a) {
          var o = r && (r.value == null ? r : r.value);
          return Co(o instanceof Array ? o[a] : o, this._dimensions[a]);
        },
        typedArray: function(r, n, i, a) {
          return r[a];
        }
      };
    }(), e;
  }()
), iC = (
  /** @class */
  function() {
    function e(t) {
      this._sourceList = [], this._storeList = [], this._upstreamSignList = [], this._versionSignBase = 0, this._dirty = !0, this._sourceHost = t;
    }
    return e.prototype.dirty = function() {
      this._setLocalSource([], []), this._storeList = [], this._dirty = !0;
    }, e.prototype._setLocalSource = function(t, r) {
      this._sourceList = t, this._upstreamSignList = r, this._versionSignBase++, this._versionSignBase > 9e10 && (this._versionSignBase = 0);
    }, e.prototype._getVersionSign = function() {
      return this._sourceHost.uid + "_" + this._versionSignBase;
    }, e.prototype.prepareSource = function() {
      this._isDirty() && (this._createSource(), this._dirty = !1);
    }, e.prototype._createSource = function() {
      this._setLocalSource([], []);
      var t = this._sourceHost, r = this._getUpstreamSourceManagers(), n = !!r.length, i, a;
      if (Fa(t)) {
        var o = t, s = void 0, u = void 0, l = void 0;
        if (n) {
          var h = r[0];
          h.prepareSource(), l = h.getSource(), s = l.data, u = l.sourceFormat, a = [h._getVersionSign()];
        } else
          s = o.get("data", !0), u = Vt(s) ? yr : re, a = [];
        var f = this._getSourceMetaRawOption() || {}, v = l && l.metaRawOption || {}, c = W(f.seriesLayoutBy, v.seriesLayoutBy) || null, d = W(f.sourceHeader, v.sourceHeader), y = W(f.dimensions, v.dimensions), p = c !== v.seriesLayoutBy || !!d != !!v.sourceHeader || y;
        i = p ? [Wl(s, {
          seriesLayoutBy: c,
          sourceHeader: d,
          dimensions: y
        }, u)] : [];
      } else {
        var g = t;
        if (n) {
          var m = this._applyTransform(r);
          i = m.sourceList, a = m.upstreamSignList;
        } else {
          var _ = g.get("source", !0);
          i = [Wl(_, this._getSourceMetaRawOption(), null)], a = [];
        }
      }
      this._setLocalSource(i, a);
    }, e.prototype._applyTransform = function(t) {
      var r = this._sourceHost, n = r.get("transform", !0), i = r.get("fromTransformResult", !0);
      if (i != null) {
        var a = "";
        t.length !== 1 && Rc(a);
      }
      var o, s = [], u = [];
      return D(t, function(l) {
        l.prepareSource();
        var h = l.getSource(i || 0), f = "";
        i != null && !h && Rc(f), s.push(h), u.push(l._getVersionSign());
      }), n ? o = jT(n, s, {
        datasetIndex: r.componentIndex
      }) : i != null && (o = [kT(s[0])]), {
        sourceList: o,
        upstreamSignList: u
      };
    }, e.prototype._isDirty = function() {
      if (this._dirty)
        return !0;
      for (var t = this._getUpstreamSourceManagers(), r = 0; r < t.length; r++) {
        var n = t[r];
        if (
          // Consider the case that there is ancestor diry, call it recursively.
          // The performance is probably not an issue because usually the chain is not long.
          n._isDirty() || this._upstreamSignList[r] !== n._getVersionSign()
        )
          return !0;
      }
    }, e.prototype.getSource = function(t) {
      t = t || 0;
      var r = this._sourceList[t];
      if (!r) {
        var n = this._getUpstreamSourceManagers();
        return n[0] && n[0].getSource(t);
      }
      return r;
    }, e.prototype.getSharedDataStore = function(t) {
      var r = t.makeStoreSchema();
      return this._innerGetDataStore(r.dimensions, t.source, r.hash);
    }, e.prototype._innerGetDataStore = function(t, r, n) {
      var i = 0, a = this._storeList, o = a[i];
      o || (o = a[i] = {});
      var s = o[n];
      if (!s) {
        var u = this._getUpstreamSourceManagers()[0];
        Fa(this._sourceHost) && u ? s = u._innerGetDataStore(t, r, n) : (s = new Xl(), s.initData(new my(r, t.length), t)), o[n] = s;
      }
      return s;
    }, e.prototype._getUpstreamSourceManagers = function() {
      var t = this._sourceHost;
      if (Fa(t)) {
        var r = vy(t);
        return r ? [r.getSourceManager()] : [];
      } else
        return z(lT(t), function(n) {
          return n.getSourceManager();
        });
    }, e.prototype._getSourceMetaRawOption = function() {
      var t = this._sourceHost, r, n, i;
      if (Fa(t))
        r = t.get("seriesLayoutBy", !0), n = t.get("sourceHeader", !0), i = t.get("dimensions", !0);
      else if (!this._getUpstreamSourceManagers().length) {
        var a = t;
        r = a.get("seriesLayoutBy", !0), n = a.get("sourceHeader", !0), i = a.get("dimensions", !0);
      }
      return {
        seriesLayoutBy: r,
        sourceHeader: n,
        dimensions: i
      };
    }, e;
  }()
);
function Fa(e) {
  return e.mainType === "series";
}
function Rc(e) {
  throw new Error(e);
}
function $o(e, t) {
  return t.type = e, t;
}
function aC(e, t) {
  var r = e.getData().getItemVisual(t, "style"), n = r[e.visualDrawType];
  return Yb(n);
}
function My(e) {
  var t = e.series, r = e.dataIndex, n = e.multipleSeries, i = t.getData(), a = i.mapDimensionsAll("defaultedTooltip"), o = a.length, s = t.getRawValue(r), u = N(s), l = aC(t, r), h, f, v, c;
  if (o > 1 || u && !o) {
    var d = oC(s, t, r, a, l);
    h = d.inlineValues, f = d.inlineValueTypes, v = d.blocks, c = d.inlineValues[0];
  } else if (o) {
    var y = i.getDimensionInfo(a[0]);
    c = h = Jn(i, r, a[0]), f = y.type;
  } else
    c = h = u ? s[0] : s;
  var p = tg(t), g = p && t.name || "", m = i.getName(r), _ = n ? g : m;
  return $o("section", {
    header: g,
    // When series name is not specified, do not show a header line with only '-'.
    // This case always happens in tooltip.trigger: 'item'.
    noHeader: n || !p,
    sortParam: c,
    blocks: [$o("nameValue", {
      markerType: "item",
      markerColor: l,
      // Do not mix display seriesName and itemName in one tooltip,
      // which might confuses users.
      name: _,
      // name dimension might be auto assigned, where the name might
      // be not readable. So we check trim here.
      noName: !Qe(_),
      value: h,
      valueType: f,
      rawDataIndex: i.getRawIndex(r)
    })].concat(v || [])
  });
}
function oC(e, t, r, n, i) {
  var a = t.getData(), o = Ve(e, function(f, v, c) {
    var d = a.getDimensionInfo(c);
    return f = f || d && d.tooltip !== !1 && d.displayName != null;
  }, !1), s = [], u = [], l = [];
  n.length ? D(n, function(f) {
    h(Jn(a, r, f), f);
  }) : D(e, h);
  function h(f, v) {
    var c = a.getDimensionInfo(v);
    !c || c.otherDims.tooltip === !1 || (o ? l.push($o("nameValue", {
      markerType: "subItem",
      markerColor: i,
      name: c.displayName,
      value: f,
      valueType: c.type
    })) : (s.push(f), u.push(c.type)));
  }
  return {
    inlineValues: s,
    inlineValueTypes: u,
    blocks: l
  };
}
var nr = ut();
function za(e, t) {
  return e.getName(t) || e.getId(t);
}
var sC = "__universalTransitionEnabled", be = (
  /** @class */
  function(e) {
    B(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r._selectedDataIndicesMap = {}, r;
    }
    return t.prototype.init = function(r, n, i) {
      this.seriesIndex = this.componentIndex, this.dataTask = Ui({
        count: lC,
        reset: fC
      }), this.dataTask.context = {
        model: this
      }, this.mergeDefaultAndTheme(r, i);
      var a = nr(this).sourceManager = new iC(this);
      a.prepareSource();
      var o = this.getInitialData(r, i);
      Ac(o, this), this.dataTask.context.data = o, nr(this).dataBeforeProcessed = o, Pc(this), this._initSelectedMapFromData(o);
    }, t.prototype.mergeDefaultAndTheme = function(r, n) {
      var i = Wo(this), a = i ? sy(r) : {}, o = this.subType;
      it.hasClass(o) && (o += "Series"), ct(r, n.getTheme().get(this.subType)), ct(r, this.getDefaultOption()), Pl(r, "label", ["show"]), this.fillDataTextStyle(r.data), i && Xo(r, a, i);
    }, t.prototype.mergeOption = function(r, n) {
      r = ct(this.option, r, !0), this.fillDataTextStyle(r.data);
      var i = Wo(this);
      i && Xo(this.option, r, i);
      var a = nr(this).sourceManager;
      a.dirty(), a.prepareSource();
      var o = this.getInitialData(r, n);
      Ac(o, this), this.dataTask.dirty(), this.dataTask.context.data = o, nr(this).dataBeforeProcessed = o, Pc(this), this._initSelectedMapFromData(o);
    }, t.prototype.fillDataTextStyle = function(r) {
      if (r && !Vt(r))
        for (var n = ["show"], i = 0; i < r.length; i++)
          r[i] && r[i].label && Pl(r[i], "label", n);
    }, t.prototype.getInitialData = function(r, n) {
    }, t.prototype.appendData = function(r) {
      var n = this.getRawData();
      n.appendData(r.data);
    }, t.prototype.getData = function(r) {
      var n = $l(this);
      if (n) {
        var i = n.context.data;
        return r == null || !i.getLinkedData ? i : i.getLinkedData(r);
      } else
        return nr(this).data;
    }, t.prototype.getAllData = function() {
      var r = this.getData();
      return r && r.getLinkedDataAll ? r.getLinkedDataAll() : [{
        data: r
      }];
    }, t.prototype.setData = function(r) {
      var n = $l(this);
      if (n) {
        var i = n.context;
        i.outputData = r, n !== this.dataTask && (i.data = r);
      }
      nr(this).data = r;
    }, t.prototype.getEncode = function() {
      var r = this.get("encode", !0);
      if (r)
        return V(r);
    }, t.prototype.getSourceManager = function() {
      return nr(this).sourceManager;
    }, t.prototype.getSource = function() {
      return this.getSourceManager().getSource();
    }, t.prototype.getRawData = function() {
      return nr(this).dataBeforeProcessed;
    }, t.prototype.getColorBy = function() {
      var r = this.get("colorBy");
      return r || "series";
    }, t.prototype.isColorBySeries = function() {
      return this.getColorBy() === "series";
    }, t.prototype.getBaseAxis = function() {
      var r = this.coordinateSystem;
      return r && r.getBaseAxis && r.getBaseAxis();
    }, t.prototype.indicesOfNearest = function(r, n, i, a) {
      var o = this.getData(), s = this.coordinateSystem, u = s && s.getAxis(r);
      if (!s || !u)
        return [];
      var l = u.dataToCoord(i);
      a == null && (a = 1 / 0);
      for (var h = [], f = 1 / 0, v = -1, c = 0, d = o.getDimensionIndex(n), y = o.getStore(), p = 0, g = y.count(); p < g; p++) {
        var m = y.get(d, p), _ = u.dataToCoord(m), S = l - _, w = Math.abs(S);
        w <= a && ((w < f || w === f && S >= 0 && v < 0) && (f = w, v = S, c = 0), S === v && (h[c++] = p));
      }
      return h.length = c, h;
    }, t.prototype.formatTooltip = function(r, n, i) {
      return My({
        series: this,
        dataIndex: r,
        multipleSeries: n
      });
    }, t.prototype.isAnimationEnabled = function() {
      var r = this.ecModel;
      if (tt.node && !(r && r.ssr))
        return !1;
      var n = this.getShallow("animation");
      return n && this.getData().count() > this.getShallow("animationThreshold") && (n = !1), !!n;
    }, t.prototype.restoreData = function() {
      this.dataTask.dirty();
    }, t.prototype.getColorFromPalette = function(r, n, i) {
      var a = this.ecModel, o = ah.prototype.getColorFromPalette.call(this, r, n, i);
      return o || (o = a.getColorFromPalette(r, n, i)), o;
    }, t.prototype.coordDimToDataDim = function(r) {
      return this.getRawData().mapDimensionsAll(r);
    }, t.prototype.getProgressive = function() {
      return this.get("progressive");
    }, t.prototype.getProgressiveThreshold = function() {
      return this.get("progressiveThreshold");
    }, t.prototype.select = function(r, n) {
      this._innerSelect(this.getData(n), r);
    }, t.prototype.unselect = function(r, n) {
      var i = this.option.selectedMap;
      if (i) {
        var a = this.option.selectedMode, o = this.getData(n);
        if (a === "series" || i === "all") {
          this.option.selectedMap = {}, this._selectedDataIndicesMap = {};
          return;
        }
        for (var s = 0; s < r.length; s++) {
          var u = r[s], l = za(o, u);
          i[l] = !1, this._selectedDataIndicesMap[l] = -1;
        }
      }
    }, t.prototype.toggleSelect = function(r, n) {
      for (var i = [], a = 0; a < r.length; a++)
        i[0] = r[a], this.isSelected(r[a], n) ? this.unselect(i, n) : this.select(i, n);
    }, t.prototype.getSelectedDataIndices = function() {
      if (this.option.selectedMap === "all")
        return [].slice.call(this.getData().getIndices());
      for (var r = this._selectedDataIndicesMap, n = ft(r), i = [], a = 0; a < n.length; a++) {
        var o = r[n[a]];
        o >= 0 && i.push(o);
      }
      return i;
    }, t.prototype.isSelected = function(r, n) {
      var i = this.option.selectedMap;
      if (!i)
        return !1;
      var a = this.getData(n);
      return (i === "all" || i[za(a, r)]) && !a.getItemModel(r).get(["select", "disabled"]);
    }, t.prototype.isUniversalTransitionEnabled = function() {
      if (this[sC])
        return !0;
      var r = this.option.universalTransition;
      return r ? r === !0 ? !0 : r && r.enabled : !1;
    }, t.prototype._innerSelect = function(r, n) {
      var i, a, o = this.option, s = o.selectedMode, u = n.length;
      if (!(!s || !u)) {
        if (s === "series")
          o.selectedMap = "all";
        else if (s === "multiple") {
          F(o.selectedMap) || (o.selectedMap = {});
          for (var l = o.selectedMap, h = 0; h < u; h++) {
            var f = n[h], v = za(r, f);
            l[v] = !0, this._selectedDataIndicesMap[v] = r.getRawIndex(f);
          }
        } else if (s === "single" || s === !0) {
          var c = n[u - 1], v = za(r, c);
          o.selectedMap = (i = {}, i[v] = !0, i), this._selectedDataIndicesMap = (a = {}, a[v] = r.getRawIndex(c), a);
        }
      }
    }, t.prototype._initSelectedMapFromData = function(r) {
      if (!this.option.selectedMap) {
        var n = [];
        r.hasItemOption && r.each(function(i) {
          var a = r.getRawDataItem(i);
          a && a.selected && n.push(i);
        }), n.length > 0 && this._innerSelect(r, n);
      }
    }, t.registerClass = function(r) {
      return it.registerClass(r);
    }, t.protoInitialize = function() {
      var r = t.prototype;
      r.type = "series.__base__", r.seriesIndex = 0, r.ignoreStyleOnData = !1, r.hasSymbolVisual = !1, r.defaultSymbol = "circle", r.visualStyleAccessPath = "itemStyle", r.visualDrawType = "fill";
    }(), t;
  }(it)
);
ee(be, GT);
ee(be, ah);
og(be, it);
function Pc(e) {
  var t = e.name;
  tg(e) || (e.name = uC(e) || t);
}
function uC(e) {
  var t = e.getRawData(), r = t.mapDimensionsAll("seriesName"), n = [];
  return D(r, function(i) {
    var a = t.getDimensionInfo(i);
    a.displayName && n.push(a.displayName);
  }), n.join(" ");
}
function lC(e) {
  return e.model.getRawData().count();
}
function fC(e) {
  var t = e.model;
  return t.setData(t.getRawData().cloneShallow()), hC;
}
function hC(e, t) {
  t.outputData && e.end > t.outputData.count() && t.model.getRawData().cloneShallow(t.outputData);
}
function Ac(e, t) {
  D(pp(e.CHANGABLE_METHODS, e.DOWNSAMPLE_METHODS), function(r) {
    e.wrapMethod(r, Je(vC, t));
  });
}
function vC(e, t) {
  var r = $l(e);
  return r && r.setOutputEnd((t || this).count()), t;
}
function $l(e) {
  var t = (e.ecModel || {}).scheduler, r = t && t.getPipeline(e.uid);
  if (r) {
    var n = r.currentTask;
    if (n) {
      var i = n.agentStubMap;
      i && (n = i.get(e.uid));
    }
    return n;
  }
}
var br = (
  /** @class */
  function() {
    function e() {
      this.group = new Xt(), this.uid = Is("viewComponent");
    }
    return e.prototype.init = function(t, r) {
    }, e.prototype.render = function(t, r, n, i) {
    }, e.prototype.dispose = function(t, r) {
    }, e.prototype.updateView = function(t, r, n, i) {
    }, e.prototype.updateLayout = function(t, r, n, i) {
    }, e.prototype.updateVisual = function(t, r, n, i) {
    }, e.prototype.toggleBlurSeries = function(t, r, n) {
    }, e.prototype.eachRendered = function(t) {
      var r = this.group;
      r && r.traverse(t);
    }, e;
  }()
);
Df(br);
gs(br);
function cC() {
  var e = ut();
  return function(t) {
    var r = e(t), n = t.pipelineContext, i = !!r.large, a = !!r.progressiveRender, o = r.large = !!(n && n.large), s = r.progressiveRender = !!(n && n.progressiveRender);
    return (i !== o || a !== s) && "reset";
  };
}
var Dy = ut(), dC = cC(), we = (
  /** @class */
  function() {
    function e() {
      this.group = new Xt(), this.uid = Is("viewChart"), this.renderTask = Ui({
        plan: pC,
        reset: gC
      }), this.renderTask.context = {
        view: this
      };
    }
    return e.prototype.init = function(t, r) {
    }, e.prototype.render = function(t, r, n, i) {
    }, e.prototype.highlight = function(t, r, n, i) {
      var a = t.getData(i && i.dataType);
      a && kc(a, i, "emphasis");
    }, e.prototype.downplay = function(t, r, n, i) {
      var a = t.getData(i && i.dataType);
      a && kc(a, i, "normal");
    }, e.prototype.remove = function(t, r) {
      this.group.removeAll();
    }, e.prototype.dispose = function(t, r) {
    }, e.prototype.updateView = function(t, r, n, i) {
      this.render(t, r, n, i);
    }, e.prototype.updateVisual = function(t, r, n, i) {
      this.render(t, r, n, i);
    }, e.prototype.eachRendered = function(t) {
      Uf(this.group, t);
    }, e.markUpdateMethod = function(t, r) {
      Dy(t).updateMethod = r;
    }, e.protoInitialize = function() {
      var t = e.prototype;
      t.type = "chart";
    }(), e;
  }()
);
function Oc(e, t, r) {
  e && Vl(e) && (t === "emphasis" ? ra : na)(e, r);
}
function kc(e, t, r) {
  var n = ds(e, t), i = t && t.highlightKey != null ? dw(t.highlightKey) : null;
  n != null ? D(zt(n), function(a) {
    Oc(e.getItemGraphicEl(a), r, i);
  }) : e.eachItemGraphicEl(function(a) {
    Oc(a, r, i);
  });
}
Df(we);
gs(we);
function pC(e) {
  return dC(e.model);
}
function gC(e) {
  var t = e.model, r = e.ecModel, n = e.api, i = e.payload, a = t.pipelineContext.progressiveRender, o = e.view, s = i && Dy(i).updateMethod, u = a ? "incrementalPrepareRender" : s && o[s] ? s : "render";
  return u !== "render" && o[u](t, r, n, i), yC[u];
}
var yC = {
  incrementalPrepareRender: {
    progress: function(e, t) {
      t.view.incrementalRender(e, t.model, t.ecModel, t.api, t.payload);
    }
  },
  render: {
    // Put view.render in `progress` to support appendData. But in this case
    // view.render should not be called in reset, otherwise it will be called
    // twise. Use `forceFirstProgress` to make sure that view.render is called
    // in any cases.
    forceFirstProgress: !0,
    progress: function(e, t) {
      t.view.render(t.model, t.ecModel, t.api, t.payload);
    }
  }
};
function Iy(e, t, r) {
  var n, i = 0, a = 0, o = null, s, u, l, h;
  t = t || 0;
  function f() {
    a = (/* @__PURE__ */ new Date()).getTime(), o = null, e.apply(u, l || []);
  }
  var v = function() {
    for (var c = [], d = 0; d < arguments.length; d++)
      c[d] = arguments[d];
    n = (/* @__PURE__ */ new Date()).getTime(), u = this, l = c;
    var y = h || t, p = h || r;
    h = null, s = n - (p ? i : a) - y, clearTimeout(o), p ? o = setTimeout(f, y) : s >= 0 ? f() : o = setTimeout(f, -s), i = n;
  };
  return v.clear = function() {
    o && (clearTimeout(o), o = null);
  }, v.debounceNextCall = function(c) {
    h = c;
  }, v;
}
var Nc = ut(), Bc = {
  itemStyle: ea($g, !0),
  lineStyle: ea(Xg, !0)
}, mC = {
  lineStyle: "stroke",
  itemStyle: "fill"
};
function xy(e, t) {
  var r = e.visualStyleMapper || Bc[t];
  return r || (console.warn("Unknown style type '" + t + "'."), Bc.itemStyle);
}
function Ly(e, t) {
  var r = e.visualDrawType || mC[t];
  return r || (console.warn("Unknown style type '" + t + "'."), "fill");
}
var _C = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(e, t) {
    var r = e.getData(), n = e.visualStyleAccessPath || "itemStyle", i = e.getModel(n), a = xy(e, n), o = a(i), s = i.getShallow("decal");
    s && (r.setVisual("decal", s), s.dirty = !0);
    var u = Ly(e, n), l = o[u], h = Z(l) ? l : null, f = o.fill === "auto" || o.stroke === "auto";
    if (!o[u] || h || f) {
      var v = e.getColorFromPalette(
        // TODO series count changed.
        e.name,
        null,
        t.getSeriesCount()
      );
      o[u] || (o[u] = v, r.setVisual("colorFromPalette", !0)), o.fill = o.fill === "auto" || Z(o.fill) ? v : o.fill, o.stroke = o.stroke === "auto" || Z(o.stroke) ? v : o.stroke;
    }
    if (r.setVisual("style", o), r.setVisual("drawType", u), !t.isSeriesFiltered(e) && h)
      return r.setVisual("colorFromPalette", !1), {
        dataEach: function(c, d) {
          var y = e.getDataParams(d), p = A({}, o);
          p[u] = h(y), c.setItemVisual(d, "style", p);
        }
      };
  }
}, gi = new yt(), SC = {
  createOnAllSeries: !0,
  reset: function(e, t) {
    if (!e.ignoreStyleOnData) {
      var r = e.getData(), n = e.visualStyleAccessPath || "itemStyle", i = xy(e, n), a = r.getVisual("drawType");
      return {
        dataEach: r.hasItemOption ? function(o, s) {
          var u = o.getRawDataItem(s);
          if (u && u[n]) {
            gi.option = u[n];
            var l = i(gi), h = o.ensureUniqueItemVisual(s, "style");
            A(h, l), gi.option.decal && (o.setItemVisual(s, "decal", gi.option.decal), gi.option.decal.dirty = !0), a in l && o.setItemVisual(s, "colorFromPalette", !1);
          }
        } : null
      };
    }
  }
}, wC = {
  performRawSeries: !0,
  overallReset: function(e) {
    var t = V();
    e.eachSeries(function(r) {
      if (!r.isColorBySeries()) {
        var n = r.type + "-" + r.getColorBy();
        Nc(r).scope = t.get(n) || t.set(n, {});
      }
    }), e.eachSeries(function(r) {
      if (!r.isColorBySeries()) {
        var n = r.getRawData(), i = {}, a = r.getData(), o = Nc(r).scope, s = r.visualStyleAccessPath || "itemStyle", u = Ly(r, s);
        a.each(function(l) {
          var h = a.getRawIndex(l);
          i[h] = l;
        }), n.each(function(l) {
          var h = i[l], f = a.getItemVisual(h, "colorFromPalette");
          if (f) {
            var v = a.ensureUniqueItemVisual(h, "style"), c = n.getName(l) || l + "", d = n.count();
            v[u] = r.getColorFromPalette(c, o, d);
          }
        });
      }
    });
  }
}, Va = Math.PI;
function bC(e, t) {
  t = t || {}, mt(t, {
    text: "loading",
    textColor: Et.color.primary,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "sans-serif",
    maskColor: "rgba(255,255,255,0.8)",
    showSpinner: !0,
    color: Et.color.theme[0],
    spinnerRadius: 10,
    lineWidth: 5,
    zlevel: 0
  });
  var r = new Xt(), n = new Fe({
    style: {
      fill: t.maskColor
    },
    zlevel: t.zlevel,
    z: 1e4
  });
  r.add(n);
  var i = new vn({
    style: {
      text: t.text,
      fill: t.textColor,
      fontSize: t.fontSize,
      fontWeight: t.fontWeight,
      fontStyle: t.fontStyle,
      fontFamily: t.fontFamily
    },
    zlevel: t.zlevel,
    z: 10001
  }), a = new Fe({
    style: {
      fill: "none"
    },
    textContent: i,
    textConfig: {
      position: "right",
      distance: 10
    },
    zlevel: t.zlevel,
    z: 10001
  });
  r.add(a);
  var o;
  return t.showSpinner && (o = new Cs({
    shape: {
      startAngle: -Va / 2,
      endAngle: -Va / 2 + 0.1,
      r: t.spinnerRadius
    },
    style: {
      stroke: t.color,
      lineCap: "round",
      lineWidth: t.lineWidth
    },
    zlevel: t.zlevel,
    z: 10001
  }), o.animateShape(!0).when(1e3, {
    endAngle: Va * 3 / 2
  }).start("circularInOut"), o.animateShape(!0).when(1e3, {
    startAngle: Va * 3 / 2
  }).delay(300).start("circularInOut"), r.add(o)), r.resize = function() {
    var s = i.getBoundingRect().width, u = t.showSpinner ? t.spinnerRadius : 0, l = (e.getWidth() - u * 2 - (t.showSpinner && s ? 10 : 0) - s) / 2 - (t.showSpinner && s ? 0 : 5 + s / 2) + (t.showSpinner ? 0 : s / 2) + (s ? 0 : u), h = e.getHeight() / 2;
    t.showSpinner && o.setShape({
      cx: l,
      cy: h
    }), a.setShape({
      x: l - u,
      y: h - u,
      width: u * 2,
      height: u * 2
    }), n.setShape({
      x: 0,
      y: 0,
      width: e.getWidth(),
      height: e.getHeight()
    });
  }, r.resize(), r;
}
var Ey = (
  /** @class */
  function() {
    function e(t, r, n, i) {
      this._stageTaskMap = V(), this.ecInstance = t, this.api = r, n = this._dataProcessorHandlers = n.slice(), i = this._visualHandlers = i.slice(), this._allHandlers = n.concat(i);
    }
    return e.prototype.restoreData = function(t, r) {
      t.restoreData(r), this._stageTaskMap.each(function(n) {
        var i = n.overallTask;
        i && i.dirty();
      });
    }, e.prototype.getPerformArgs = function(t, r) {
      if (t.__pipeline) {
        var n = this._pipelineMap.get(t.__pipeline.id), i = n.context, a = !r && n.progressiveEnabled && (!i || i.progressiveRender) && t.__idxInPipeline > n.blockIndex, o = a ? n.step : null, s = i && i.modDataCount, u = s != null ? Math.ceil(s / o) : null;
        return {
          step: o,
          modBy: u,
          modDataCount: s
        };
      }
    }, e.prototype.getPipeline = function(t) {
      return this._pipelineMap.get(t);
    }, e.prototype.updateStreamModes = function(t, r) {
      var n = this._pipelineMap.get(t.uid), i = t.__preparePipelineContext ? t.__preparePipelineContext(r, n) : X1(t, r, n);
      t.pipelineContext = n.context = i;
    }, e.prototype.restorePipelines = function(t, r) {
      var n = this, i = n._pipelineMap = V();
      r.eachSeries(function(a) {
        var o = t.painter.type === "canvas" && a.getProgressive(), s = a.uid;
        i.set(s, {
          id: s,
          head: null,
          tail: null,
          threshold: a.getProgressiveThreshold(),
          progressiveEnabled: o && !(a.preventIncremental && a.preventIncremental()),
          blockIndex: -1,
          step: Math.round(o || 700),
          count: 0
        }), n._pipe(a, a.dataTask);
      });
    }, e.prototype.prepareStageTasks = function() {
      var t = this._stageTaskMap, r = this.api.getModel(), n = this.api;
      D(this._allHandlers, function(i) {
        var a = t.get(i.uid) || t.set(i.uid, {}), o = "";
        He(!(i.reset && i.overallReset), o), i.reset && this._createSeriesStageTask(i, a, r, n), i.overallReset && this._createOverallStageTask(i, a, r, n);
      }, this);
    }, e.prototype.prepareView = function(t, r, n, i) {
      var a = t.renderTask, o = a.context;
      o.model = r, o.ecModel = n, o.api = i, a.__block = !t.incrementalPrepareRender, this._pipe(r, a);
    }, e.prototype.performDataProcessorTasks = function(t, r) {
      this._performStageTasks(this._dataProcessorHandlers, t, r, {
        block: !0
      });
    }, e.prototype.performVisualTasks = function(t, r, n) {
      this._performStageTasks(this._visualHandlers, t, r, n);
    }, e.prototype._performStageTasks = function(t, r, n, i) {
      i = i || {};
      var a = !1, o = this;
      D(t, function(u, l) {
        if (!(i.visualType && i.visualType !== u.visualType)) {
          var h = o._stageTaskMap.get(u.uid), f = h.seriesTaskMap, v = h.overallTask;
          if (v) {
            var c, d = v.agentStubMap;
            d.each(function(p) {
              s(i, p) && (p.dirty(), c = !0);
            }), c && v.dirty(), o.updatePayload(v, n);
            var y = o.getPerformArgs(v, i.block);
            d.each(function(p) {
              p.perform(y);
            }), v.perform(y) && (a = !0);
          } else f && f.each(function(p, g) {
            s(i, p) && p.dirty();
            var m = o.getPerformArgs(p, i.block);
            m.skip = !u.performRawSeries && r.isSeriesFiltered(p.context.model), o.updatePayload(p, n), p.perform(m) && (a = !0);
          });
        }
      });
      function s(u, l) {
        return u.setDirty && (!u.dirtyMap || u.dirtyMap.get(l.__pipeline.id));
      }
      this.unfinished = a || this.unfinished;
    }, e.prototype.performSeriesTasks = function(t) {
      var r;
      t.eachSeries(function(n) {
        r = n.dataTask.perform() || r;
      }), this.unfinished = r || this.unfinished;
    }, e.prototype.plan = function() {
      this._pipelineMap.each(function(t) {
        var r = t.tail;
        do {
          if (r.__block) {
            t.blockIndex = r.__idxInPipeline;
            break;
          }
          r = r.getUpstream();
        } while (r);
      });
    }, e.prototype.updatePayload = function(t, r) {
      r !== "remain" && (t.context.payload = r);
    }, e.prototype._createSeriesStageTask = function(t, r, n, i) {
      var a = this, o = r.seriesTaskMap, s = r.seriesTaskMap = V(), u = t.seriesType, l = t.getTargetSeries;
      t.createOnAllSeries ? n.eachRawSeries(h) : u ? n.eachRawSeriesByType(u, h) : l && l(n, i).each(h);
      function h(f) {
        var v = f.uid, c = s.set(v, o && o.get(v) || Ui({
          plan: IC,
          reset: xC,
          count: EC
        }));
        c.context = {
          model: f,
          ecModel: n,
          api: i,
          // PENDING: `useClearVisual` not used?
          useClearVisual: t.isVisual && !t.isLayout,
          plan: t.plan,
          reset: t.reset,
          scheduler: a
        }, a._pipe(f, c);
      }
    }, e.prototype._createOverallStageTask = function(t, r, n, i) {
      var a = this, o = r.overallTask = r.overallTask || Ui({
        reset: TC
      });
      o.context = {
        ecModel: n,
        api: i,
        overallReset: t.overallReset,
        scheduler: a
      };
      var s = o.agentStubMap, u = o.agentStubMap = V(), l = t.seriesType, h = t.getTargetSeries, f = t.dirtyOnOverallProgress, v = !1, c = "";
      He(!t.createOnAllSeries, c), l ? n.eachRawSeriesByType(l, d) : h ? h(n, i).each(d) : D(n.getSeries(), d);
      function d(y) {
        var p = y.uid, g = u.set(p, s && s.get(p) || // When the result of `getTargetSeries` changed, the overallTask
        // should be set as dirty and re-performed.
        (v = !0, Ui({
          reset: CC,
          onDirty: DC
        })));
        g.context = {
          model: y,
          dirtyOnOverallProgress: f
          // FIXME:TS never used, so comment it
          // modifyOutputEnd: modifyOutputEnd
        }, g.agent = o, g.__block = f, a._pipe(y, g);
      }
      v && o.dirty();
    }, e.prototype._pipe = function(t, r) {
      var n = t.uid, i = this._pipelineMap.get(n);
      !i.head && (i.head = r), i.tail && i.tail.pipe(r), i.tail = r, r.__idxInPipeline = i.count++, r.__pipeline = i;
    }, e.wrapStageHandler = function(t, r) {
      return Z(t) && (t = {
        overallReset: t,
        seriesType: RC(t)
      }), t.uid = Is("stageHandler"), r && (t.visualType = r), t;
    }, e;
  }()
);
function TC(e) {
  e.overallReset(e.ecModel, e.api, e.payload);
}
function CC(e) {
  return e.dirtyOnOverallProgress && MC;
}
function MC() {
  this.agent.dirty(), this.getDownstream().dirty();
}
function DC() {
  this.agent && this.agent.dirty();
}
function IC(e) {
  return e.plan ? e.plan(e.model, e.ecModel, e.api, e.payload) : null;
}
function xC(e) {
  e.useClearVisual && e.data.clearAllVisual();
  var t = e.resetDefines = zt(e.reset(e.model, e.ecModel, e.api, e.payload));
  return t.length > 1 ? z(t, function(r, n) {
    return Ry(n);
  }) : LC;
}
var LC = Ry(0);
function Ry(e) {
  return function(t, r) {
    var n = r.data, i = r.resetDefines[e];
    if (i && i.dataEach)
      for (var a = t.start; a < t.end; a++)
        i.dataEach(n, a);
    else i && i.progress && i.progress(t, n);
  };
}
function EC(e) {
  return e.data.count();
}
function RC(e) {
  Zo = null;
  try {
    e(aa, Py);
  } catch (t) {
  }
  return Zo;
}
var aa = {}, Py = {}, Zo;
Ay(aa, oh);
Ay(Py, mg);
aa.eachSeriesByType = aa.eachRawSeriesByType = function(e) {
  Zo = e;
};
aa.eachComponent = function(e) {
  e.mainType === "series" && e.subType && (Zo = e.subType);
};
function Ay(e, t) {
  for (var r in t.prototype)
    e[r] = St;
}
var P = Et.darkColor, Fc = P.background, yi = function() {
  return {
    axisLine: {
      lineStyle: {
        color: P.axisLine
      }
    },
    splitLine: {
      lineStyle: {
        color: P.axisSplitLine
      }
    },
    splitArea: {
      areaStyle: {
        color: [P.backgroundTint, P.backgroundTransparent]
      }
    },
    minorSplitLine: {
      lineStyle: {
        color: P.axisMinorSplitLine
      }
    },
    axisLabel: {
      color: P.axisLabel
    },
    axisName: {}
  };
}, zc = {
  label: {
    color: P.secondary
  },
  itemStyle: {
    borderColor: P.borderTint
  },
  dividerLineStyle: {
    color: P.border
  }
}, Oy = {
  darkMode: !0,
  color: P.theme,
  backgroundColor: Fc,
  axisPointer: {
    lineStyle: {
      color: P.border
    },
    crossStyle: {
      color: P.borderShade
    },
    label: {
      color: P.tertiary
    }
  },
  legend: {
    textStyle: {
      color: P.secondary
    },
    pageTextStyle: {
      color: P.tertiary
    }
  },
  textStyle: {
    color: P.secondary
  },
  title: {
    textStyle: {
      color: P.primary
    },
    subtextStyle: {
      color: P.quaternary
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: P.accent50
    },
    feature: {
      dataView: {
        backgroundColor: Fc,
        textColor: P.primary,
        textareaColor: P.background,
        textareaBorderColor: P.border,
        buttonColor: P.accent50,
        buttonTextColor: P.neutral00
      }
    }
  },
  tooltip: {
    backgroundColor: P.neutral20,
    defaultBorderColor: P.border,
    textStyle: {
      color: P.tertiary
    }
  },
  dataZoom: {
    borderColor: P.accent10,
    textStyle: {
      color: P.tertiary
    },
    brushStyle: {
      color: P.backgroundTint
    },
    handleStyle: {
      color: P.neutral00,
      borderColor: P.accent20
    },
    moveHandleStyle: {
      color: P.accent40
    },
    emphasis: {
      handleStyle: {
        borderColor: P.accent50
      }
    },
    dataBackground: {
      lineStyle: {
        color: P.accent30
      },
      areaStyle: {
        color: P.accent20
      }
    },
    selectedDataBackground: {
      lineStyle: {
        color: P.accent50
      },
      areaStyle: {
        color: P.accent30
      }
    }
  },
  visualMap: {
    textStyle: {
      color: P.secondary
    },
    handleStyle: {
      borderColor: P.neutral30
    }
  },
  timeline: {
    lineStyle: {
      color: P.accent10
    },
    label: {
      color: P.tertiary
    },
    controlStyle: {
      color: P.accent30,
      borderColor: P.accent30
    }
  },
  calendar: {
    itemStyle: {
      color: P.neutral00,
      borderColor: P.neutral20
    },
    dayLabel: {
      color: P.tertiary
    },
    monthLabel: {
      color: P.secondary
    },
    yearLabel: {
      color: P.secondary
    }
  },
  matrix: {
    x: zc,
    y: zc,
    backgroundColor: {
      borderColor: P.axisLine
    },
    body: {
      itemStyle: {
        borderColor: P.borderTint
      }
    }
  },
  timeAxis: yi(),
  logAxis: yi(),
  valueAxis: yi(),
  categoryAxis: yi(),
  line: {
    symbol: "circle"
  },
  graph: {
    color: P.theme
  },
  gauge: {
    title: {
      color: P.secondary
    },
    axisLine: {
      lineStyle: {
        color: [[1, P.neutral05]]
      }
    },
    axisLabel: {
      color: P.axisLabel
    },
    detail: {
      color: P.primary
    }
  },
  candlestick: {
    itemStyle: {
      color: "#f64e56",
      color0: "#54ea92",
      borderColor: "#f64e56",
      borderColor0: "#54ea92"
      // borderColor: '#ca2824',
      // borderColor0: '#09a443'
    }
  },
  funnel: {
    itemStyle: {
      borderColor: P.background
    }
  },
  radar: function() {
    var e = yi();
    return e.axisName = {
      color: P.axisLabel
    }, e.axisLine.lineStyle.color = P.neutral20, e;
  }(),
  treemap: {
    breadcrumb: {
      itemStyle: {
        color: P.neutral20,
        textStyle: {
          color: P.secondary
        }
      },
      emphasis: {
        itemStyle: {
          color: P.neutral30
        }
      }
    }
  },
  sunburst: {
    itemStyle: {
      borderColor: P.background
    }
  },
  map: {
    itemStyle: {
      borderColor: P.border,
      areaColor: P.neutral10
    },
    label: {
      color: P.tertiary
    },
    emphasis: {
      label: {
        color: P.primary
      },
      itemStyle: {
        areaColor: P.highlight
      }
    },
    select: {
      label: {
        color: P.primary
      },
      itemStyle: {
        areaColor: P.highlight
      }
    }
  },
  geo: {
    itemStyle: {
      borderColor: P.border,
      areaColor: P.neutral10
    },
    emphasis: {
      label: {
        color: P.primary
      },
      itemStyle: {
        areaColor: P.highlight
      }
    },
    select: {
      label: {
        color: P.primary
      },
      itemStyle: {
        color: P.highlight
      }
    }
  }
};
Oy.categoryAxis.splitLine.show = !1;
var PC = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.normalizeQuery = function(t) {
      var r = {}, n = {}, i = {};
      if (G(t)) {
        var a = Ae(t);
        r.mainType = a.main || null, r.subType = a.sub || null;
      } else {
        var o = ["Index", "Name", "Id"], s = {
          name: 1,
          dataIndex: 1,
          dataType: 1
        };
        D(t, function(u, l) {
          for (var h = !1, f = 0; f < o.length; f++) {
            var v = o[f], c = l.lastIndexOf(v);
            if (c > 0 && c === l.length - v.length) {
              var d = l.slice(0, c);
              d !== "data" && (r.mainType = d, r[v.toLowerCase()] = u, h = !0);
            }
          }
          s.hasOwnProperty(l) && (n[l] = u, h = !0), h || (i[l] = u);
        });
      }
      return {
        cptQuery: r,
        dataQuery: n,
        otherQuery: i
      };
    }, e.prototype.filter = function(t, r) {
      var n = this.eventInfo;
      if (!n)
        return !0;
      var i = n.targetEl, a = n.packedEvent, o = n.model, s = n.view;
      if (!o || !s)
        return !0;
      var u = r.cptQuery, l = r.dataQuery;
      return h(u, o, "mainType") && h(u, o, "subType") && h(u, o, "index", "componentIndex") && h(u, o, "name") && h(u, o, "id") && h(l, a, "name") && h(l, a, "dataIndex") && h(l, a, "dataType") && (!s.filterForExposedEvent || s.filterForExposedEvent(t, r.otherQuery, i, a));
      function h(f, v, c, d) {
        return f[c] == null || v[d || c] === f[c];
      }
    }, e.prototype.afterTrigger = function() {
      this.eventInfo = null;
    }, e;
  }()
), Zl = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"], Vc = Zl.concat(["symbolKeepAspect"]), AC = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(e, t) {
    var r = e.getData();
    if (e.legendIcon && r.setVisual("legendIcon", e.legendIcon), !e.hasSymbolVisual)
      return;
    for (var n = {}, i = {}, a = !1, o = 0; o < Zl.length; o++) {
      var s = Zl[o], u = e.get(s);
      Z(u) ? (a = !0, i[s] = u) : n[s] = u;
    }
    if (n.symbol = n.symbol || e.defaultSymbol, r.setVisual(A({
      legendIcon: e.legendIcon || n.symbol,
      symbolKeepAspect: e.get("symbolKeepAspect")
    }, n)), t.isSeriesFiltered(e))
      return;
    var l = ft(i);
    function h(f, v) {
      for (var c = e.getRawValue(v), d = e.getDataParams(v), y = 0; y < l.length; y++) {
        var p = l[y];
        f.setItemVisual(v, p, i[p](c, d));
      }
    }
    return {
      dataEach: a ? h : null
    };
  }
}, OC = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(e, t) {
    if (!e.hasSymbolVisual || t.isSeriesFiltered(e))
      return;
    var r = e.getData();
    function n(i, a) {
      for (var o = i.getItemModel(a), s = 0; s < Vc.length; s++) {
        var u = Vc[s], l = o.getShallow(u, !0);
        l != null && i.setItemVisual(a, u, l);
      }
    }
    return {
      dataEach: r.hasItemOption ? n : null
    };
  }
};
function kC(e, t, r) {
  switch (r) {
    case "color":
      var n = e.getItemVisual(t, "style");
      return n[e.getVisual("drawType")];
    case "opacity":
      return e.getItemVisual(t, "style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return e.getItemVisual(t, r);
  }
}
function NC(e, t) {
  switch (t) {
    case "color":
      var r = e.getVisual("style");
      return r[e.getVisual("drawType")];
    case "opacity":
      return e.getVisual("style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return e.getVisual(t);
  }
}
function In(e, t, r, n, i) {
  var a = e + t;
  r.isSilent(a) || n.eachComponent({
    mainType: "series",
    subType: "pie"
  }, function(o) {
    for (var s = o.seriesIndex, u = o.option.selectedMap, l = i.selected, h = 0; h < l.length; h++)
      if (l[h].seriesIndex === s) {
        var f = o.getData(), v = ds(f, i.fromActionPayload);
        r.trigger(a, {
          type: a,
          seriesId: o.id,
          name: N(v) ? f.getName(v[0]) : f.getName(v),
          selected: G(u) ? u : A({}, u)
        });
      }
  });
}
function BC(e, t, r) {
  e.on("selectchanged", function(n) {
    var i = r.getModel();
    n.isFromClick ? (In("map", "selectchanged", t, i, n), In("pie", "selectchanged", t, i, n)) : n.fromAction === "select" ? (In("map", "selected", t, i, n), In("pie", "selected", t, i, n)) : n.fromAction === "unselect" && (In("map", "unselected", t, i, n), In("pie", "unselected", t, i, n));
  });
}
function Ha(e, t, r) {
  for (var n; e && !(t(e) && (n = e, r)); )
    e = e.__hostTarget || e.parent;
  return n;
}
var ae = new Te(), ky = {};
function FC(e, t) {
  ky[e] = t;
}
function Ny(e) {
  return ky[e];
}
var hh = ut();
function zC(e) {
  hh(e).prepare = {};
}
function VC(e) {
  hh(e).fullUpdate = {};
}
function By(e) {
  return hh(e).fullUpdate;
}
var HC = Math.round(Math.random() * 9), GC = typeof Object.defineProperty == "function", UC = function() {
  function e() {
    this._id = "__ec_inner_" + HC++;
  }
  return e.prototype.get = function(t) {
    return this._guard(t)[this._id];
  }, e.prototype.set = function(t, r) {
    var n = this._guard(t);
    return GC ? Object.defineProperty(n, this._id, {
      value: r,
      enumerable: !1,
      configurable: !0
    }) : n[this._id] = r, this;
  }, e.prototype.delete = function(t) {
    return this.has(t) ? (delete this._guard(t)[this._id], !0) : !1;
  }, e.prototype.has = function(t) {
    return !!this._guard(t)[this._id];
  }, e.prototype._guard = function(t) {
    if (t !== Object(t))
      throw TypeError("Value of WeakMap is not a non-null object.");
    return t;
  }, e;
}(), YC = st.extend({
  type: "triangle",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.cx, n = t.cy, i = t.width / 2, a = t.height / 2;
    e.moveTo(r, n - a), e.lineTo(r + i, n + a), e.lineTo(r - i, n + a), e.closePath();
  }
}), WC = st.extend({
  type: "diamond",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.cx, n = t.cy, i = t.width / 2, a = t.height / 2;
    e.moveTo(r, n - a), e.lineTo(r + i, n), e.lineTo(r, n + a), e.lineTo(r - i, n), e.closePath();
  }
}), XC = st.extend({
  type: "pin",
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.x, n = t.y, i = t.width / 5 * 3, a = Math.max(i, t.height), o = i / 2, s = o * o / (a - o), u = n - a + o + s, l = Math.asin(s / o), h = Math.cos(l) * o, f = Math.sin(l), v = Math.cos(l), c = o * 0.6, d = o * 0.7;
    e.moveTo(r - h, u + s), e.arc(r, u, o, Math.PI - l, Math.PI * 2 + l), e.bezierCurveTo(r + h - f * c, u + s + v * c, r, n - d, r, n), e.bezierCurveTo(r, n - d, r - h + f * c, u + s + v * c, r - h, u + s), e.closePath();
  }
}), $C = st.extend({
  type: "arrow",
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.height, n = t.width, i = t.x, a = t.y, o = n / 3 * 2;
    e.moveTo(i, a), e.lineTo(i + o, a + r), e.lineTo(i, a + r / 4 * 3), e.lineTo(i - o, a + r), e.lineTo(i, a), e.closePath();
  }
}), ZC = {
  line: da,
  rect: Fe,
  roundRect: Fe,
  square: Fe,
  circle: bs,
  diamond: WC,
  pin: XC,
  arrow: $C,
  triangle: YC
}, qC = {
  line: function(e, t, r, n, i) {
    i.x1 = e, i.y1 = t + n / 2, i.x2 = e + r, i.y2 = t + n / 2;
  },
  rect: function(e, t, r, n, i) {
    i.x = e, i.y = t, i.width = r, i.height = n;
  },
  roundRect: function(e, t, r, n, i) {
    i.x = e, i.y = t, i.width = r, i.height = n, i.r = Math.min(r, n) / 4;
  },
  square: function(e, t, r, n, i) {
    var a = Math.min(r, n);
    i.x = e, i.y = t, i.width = a, i.height = a;
  },
  circle: function(e, t, r, n, i) {
    i.cx = e + r / 2, i.cy = t + n / 2, i.r = Math.min(r, n) / 2;
  },
  diamond: function(e, t, r, n, i) {
    i.cx = e + r / 2, i.cy = t + n / 2, i.width = r, i.height = n;
  },
  pin: function(e, t, r, n, i) {
    i.x = e + r / 2, i.y = t + n / 2, i.width = r, i.height = n;
  },
  arrow: function(e, t, r, n, i) {
    i.x = e + r / 2, i.y = t + n / 2, i.width = r, i.height = n;
  },
  triangle: function(e, t, r, n, i) {
    i.cx = e + r / 2, i.cy = t + n / 2, i.width = r, i.height = n;
  }
}, ql = {};
D(ZC, function(e, t) {
  ql[t] = new e();
});
var KC = st.extend({
  type: "symbol",
  shape: {
    symbolType: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  calculateTextPosition: function(e, t, r) {
    var n = Hp(e, t, r), i = this.shape;
    return i && i.symbolType === "pin" && t.position === "inside" && (n.y = r.y + r.height * 0.4), n;
  },
  buildPath: function(e, t, r) {
    var n = t.symbolType;
    if (n !== "none") {
      var i = ql[n];
      i || (n = "rect", i = ql[n]), qC[n](t.x, t.y, t.width, t.height, i.shape), i.buildPath(e, i.shape, r);
    }
  }
});
function QC(e, t) {
  if (this.type !== "image") {
    var r = this.style;
    this.__isEmptyBrush ? (r.stroke = e, r.fill = t || Et.color.neutral00, r.lineWidth = 2) : this.shape.symbolType === "line" ? r.stroke = e : r.fill = e, this.markRedraw();
  }
}
function Es(e, t, r, n, i, a, o) {
  var s = e.indexOf("empty") === 0;
  s && (e = e.substr(5, 1).toLowerCase() + e.substr(6));
  var u;
  return e.indexOf("image://") === 0 ? u = Vg(e.slice(8), new H(t, r, n, i), o ? "center" : "cover") : e.indexOf("path://") === 0 ? u = Gf(e.slice(7), {}, new H(t, r, n, i), o ? "center" : "cover") : u = new KC({
    shape: {
      symbolType: e,
      x: t,
      y: r,
      width: n,
      height: i
    }
  }), u.__isEmptyBrush = s, u.setColor = QC, a && u.setColor(a), u;
}
function vh(e) {
  return N(e) || (e = [+e, +e]), [e[0] || 0, e[1] || 0];
}
function ch(e, t) {
  if (e != null)
    return N(e) || (e = [e, e]), [jt(e[0], t[0]) || 0, jt(W(e[1], e[0]), t[1]) || 0];
}
function jr(e) {
  return isFinite(e);
}
function JC(e, t, r) {
  var n = t.x == null ? 0 : t.x, i = t.x2 == null ? 1 : t.x2, a = t.y == null ? 0 : t.y, o = t.y2 == null ? 0 : t.y2;
  t.global || (n = n * r.width + r.x, i = i * r.width + r.x, a = a * r.height + r.y, o = o * r.height + r.y), n = jr(n) ? n : 0, i = jr(i) ? i : 1, a = jr(a) ? a : 0, o = jr(o) ? o : 0;
  var s = e.createLinearGradient(n, a, i, o);
  return s;
}
function jC(e, t, r) {
  var n = r.width, i = r.height, a = Math.min(n, i), o = t.x == null ? 0.5 : t.x, s = t.y == null ? 0.5 : t.y, u = t.r == null ? 0.5 : t.r;
  t.global || (o = o * n + r.x, s = s * i + r.y, u = u * a), o = jr(o) ? o : 0.5, s = jr(s) ? s : 0.5, u = u >= 0 && jr(u) ? u : 0.5;
  var l = e.createRadialGradient(o, s, 0, o, s, u);
  return l;
}
function Kl(e, t, r) {
  for (var n = t.type === "radial" ? jC(e, t, r) : JC(e, t, r), i = t.colorStops, a = 0; a < i.length; a++)
    n.addColorStop(i[a].offset, i[a].color);
  return n;
}
function tM(e, t) {
  if (e === t || !e && !t)
    return !1;
  if (!e || !t || e.length !== t.length)
    return !0;
  for (var r = 0; r < e.length; r++)
    if (e[r] !== t[r])
      return !0;
  return !1;
}
function Ga(e) {
  return parseInt(e, 10);
}
function Ua(e, t, r) {
  var n = ["width", "height"][t], i = ["clientWidth", "clientHeight"][t], a = ["paddingLeft", "paddingTop"][t], o = ["paddingRight", "paddingBottom"][t];
  if (r[n] != null && r[n] !== "auto")
    return parseFloat(r[n]);
  var s = document.defaultView.getComputedStyle(e);
  return (e[i] || Ga(s[n]) || Ga(e.style[n])) - (Ga(s[a]) || 0) - (Ga(s[o]) || 0) || 0;
}
function eM(e, t) {
  return !e || e === "solid" || !(t > 0) ? null : e === "dashed" ? [4 * t, 2 * t] : e === "dotted" ? [t] : pt(e) ? [e] : N(e) ? e : null;
}
function Fy(e) {
  var t = e.style, r = t.lineDash && t.lineWidth > 0 && eM(t.lineDash, t.lineWidth), n = t.lineDashOffset;
  if (r) {
    var i = t.strokeNoScale && e.getLineScale ? e.getLineScale() : 1;
    i && i !== 1 && (r = z(r, function(a) {
      return a / i;
    }), n /= i);
  }
  return [r, n];
}
var rM = new Qn(!0);
function qo(e) {
  var t = e.stroke;
  return !(t == null || t === "none" || !(e.lineWidth > 0));
}
function Hc(e) {
  return typeof e == "string" && e !== "none";
}
function Ko(e) {
  var t = e.fill;
  return t != null && t !== "none";
}
function Gc(e, t) {
  if (t.fillOpacity != null && t.fillOpacity !== 1) {
    var r = e.globalAlpha;
    e.globalAlpha = t.fillOpacity * t.opacity, e.fill(), e.globalAlpha = r;
  } else
    e.fill();
}
function Uc(e, t) {
  if (t.strokeOpacity != null && t.strokeOpacity !== 1) {
    var r = e.globalAlpha;
    e.globalAlpha = t.strokeOpacity * t.opacity, e.stroke(), e.globalAlpha = r;
  } else
    e.stroke();
}
function Ql(e, t, r) {
  var n = sg(t.image, t.__image, r);
  if (ys(n)) {
    var i = e.createPattern(n, t.repeat || "repeat");
    if (typeof DOMMatrix == "function" && i && i.setTransform) {
      var a = new DOMMatrix();
      a.translateSelf(t.x || 0, t.y || 0), a.rotateSelf(0, 0, (t.rotation || 0) * gp), a.scaleSelf(t.scaleX || 1, t.scaleY || 1), i.setTransform(a);
    }
    return i;
  }
}
function nM(e, t, r, n, i) {
  var a, o = qo(r), s = Ko(r), u = r.strokePercent, l = u < 1, h = !t.path;
  (!t.silent || l) && h && t.createPathProxy();
  var f = t.path || rM, v = t.__dirty;
  if (!n) {
    var c = r.fill, d = r.stroke, y = s && !!c.colorStops, p = o && !!d.colorStops, g = s && !!c.image, m = o && !!d.image, _ = void 0, S = void 0, w = void 0, b = void 0, M = void 0;
    (y || p) && (M = t.getBoundingRect()), y && (_ = v ? Kl(e, c, M) : t.__canvasFillGradient, t.__canvasFillGradient = _), p && (S = v ? Kl(e, d, M) : t.__canvasStrokeGradient, t.__canvasStrokeGradient = S), g && (w = v || !t.__canvasFillPattern ? Ql(e, c, t) : t.__canvasFillPattern, t.__canvasFillPattern = w), m && (b = v || !t.__canvasStrokePattern ? Ql(e, d, t) : t.__canvasStrokePattern, t.__canvasStrokePattern = b), y ? e.fillStyle = _ : g && (w ? e.fillStyle = w : s = !1), p ? e.strokeStyle = S : m && (b ? e.strokeStyle = b : o = !1);
  }
  var C = t.getGlobalScale();
  f.setScale(C[0], C[1], t.segmentIgnoreThreshold);
  var T, I;
  e.setLineDash && r.lineDash && (a = Fy(t), T = a[0], I = a[1]);
  var x = !0;
  (h || v & kn) && (f.setDPR(e.dpr), l ? f.setContext(null) : (f.setContext(e), x = !1), f.reset(), t.buildPath(f, t.shape, n), f.toStatic(), t.pathUpdated()), x && f.rebuildPath(e, l ? u : 1), T && (e.setLineDash(T), e.lineDashOffset = I), n ? (i.batchFill = s, i.batchStroke = o) : r.strokeFirst ? (o && Uc(e, r), s && Gc(e, r)) : (s && Gc(e, r), o && Uc(e, r)), T && e.setLineDash([]);
}
function iM(e, t, r) {
  var n = t.__image = sg(r.image, t.__image, t, t.onload);
  if (!(!n || !ys(n))) {
    var i = r.x || 0, a = r.y || 0, o = t.getWidth(), s = t.getHeight(), u = n.width / n.height;
    if (o == null && s != null ? o = s * u : s == null && o != null ? s = o / u : o == null && s == null && (o = n.width, s = n.height), r.sWidth && r.sHeight) {
      var l = r.sx || 0, h = r.sy || 0;
      e.drawImage(n, l, h, r.sWidth, r.sHeight, i, a, o, s);
    } else if (r.sx && r.sy) {
      var l = r.sx, h = r.sy, f = o - l, v = s - h;
      e.drawImage(n, l, h, f, v, i, a, o, s);
    } else
      e.drawImage(n, i, a, o, s);
  }
}
function aM(e, t, r) {
  var n, i = r.text;
  if (i != null && (i += ""), i) {
    e.font = r.font || mr, e.textAlign = r.textAlign, e.textBaseline = r.textBaseline;
    var a = void 0, o = void 0;
    e.setLineDash && r.lineDash && (n = Fy(t), a = n[0], o = n[1]), a && (e.setLineDash(a), e.lineDashOffset = o), r.strokeFirst ? (qo(r) && e.strokeText(i, r.x, r.y), Ko(r) && e.fillText(i, r.x, r.y)) : (Ko(r) && e.fillText(i, r.x, r.y), qo(r) && e.strokeText(i, r.x, r.y)), a && e.setLineDash([]);
  }
}
var Yc = ["shadowBlur", "shadowOffsetX", "shadowOffsetY"], Wc = [
  ["lineCap", "butt"],
  ["lineJoin", "miter"],
  ["miterLimit", 10]
];
function zy(e, t, r, n, i) {
  var a = !1;
  if (!n && (r = r || {}, t === r))
    return !1;
  if (n || t.opacity !== r.opacity) {
    Bt(e, i), a = !0;
    var o = Math.max(Math.min(t.opacity, 1), 0);
    e.globalAlpha = isNaN(o) ? nn.opacity : o;
  }
  (n || t.blend !== r.blend) && (a || (Bt(e, i), a = !0), e.globalCompositeOperation = t.blend || nn.blend);
  for (var s = 0; s < Yc.length; s++) {
    var u = Yc[s];
    (n || t[u] !== r[u]) && (a || (Bt(e, i), a = !0), e[u] = e.dpr * (t[u] || 0));
  }
  return (n || t.shadowColor !== r.shadowColor) && (a || (Bt(e, i), a = !0), e.shadowColor = t.shadowColor || nn.shadowColor), a;
}
function Xc(e, t, r, n, i) {
  var a = t.style, o = n ? null : r && r.style || {};
  if (a === o)
    return !1;
  var s = zy(e, a, o, n, i);
  if ((n || a.fill !== o.fill) && (s || (Bt(e, i), s = !0), Hc(a.fill) && (e.fillStyle = a.fill)), (n || a.stroke !== o.stroke) && (s || (Bt(e, i), s = !0), Hc(a.stroke) && (e.strokeStyle = a.stroke)), (n || a.opacity !== o.opacity) && (s || (Bt(e, i), s = !0), e.globalAlpha = a.opacity == null ? 1 : a.opacity), t.hasStroke()) {
    var u = a.lineWidth, l = u / (a.strokeNoScale && t.getLineScale ? t.getLineScale() : 1);
    e.lineWidth !== l && (s || (Bt(e, i), s = !0), e.lineWidth = l);
  }
  for (var h = 0; h < Wc.length; h++) {
    var f = Wc[h], v = f[0];
    (n || a[v] !== o[v]) && (s || (Bt(e, i), s = !0), e[v] = a[v] || f[1]);
  }
  return s;
}
function oM(e, t, r, n, i) {
  return zy(e, t.style, r && r.style, n, i);
}
function Vy(e, t) {
  var r = t.transform, n = e.dpr || 1;
  r ? e.setTransform(n * r[0], n * r[1], n * r[2], n * r[3], n * r[4], n * r[5]) : e.setTransform(n, 0, 0, n, 0, 0);
}
function sM(e, t, r) {
  for (var n = !1, i = 0; i < e.length; i++) {
    var a = e[i];
    n = n || a.isZeroArea(), Vy(t, a), t.beginPath(), a.buildPath(t, a.shape), t.clip();
  }
  r.allClipped = n;
}
function uM(e, t) {
  return e && t ? e[0] !== t[0] || e[1] !== t[1] || e[2] !== t[2] || e[3] !== t[3] || e[4] !== t[4] || e[5] !== t[5] : !(!e && !t);
}
var $c = 1, Zc = 2, qc = 3, Kc = 4;
function lM(e) {
  var t = Ko(e), r = qo(e);
  return !(e.lineDash || !(+t ^ +r) || t && typeof e.fill != "string" || r && typeof e.stroke != "string" || e.strokePercent < 1 || e.strokeOpacity < 1 || e.fillOpacity < 1);
}
function Bt(e, t) {
  t.batchFill && (t.batchFill = !1, e.fill()), t.batchStroke && (t.batchStroke = !1, e.stroke());
}
function dh(e, t) {
  var r = { inHover: !1, viewWidth: 0, viewHeight: 0, beforeBrushParam: {} };
  tn(e, t, r), Wn(e, r);
}
function tn(e, t, r) {
  var n = t.transform;
  if (!t.shouldBePainted(r.viewWidth, r.viewHeight, !1, !1)) {
    t.__dirty &= ~Wt, t.__isRendered = !1;
    return;
  }
  var i = t.__clipPaths, a = r.prevElClipPaths, o = t.style, s = !1, u = !1;
  if ((!a || tM(i, a)) && (a && (Bt(e, r), e.restore(), u = s = !0, r.prevElClipPaths = null, r.allClipped = !1, r.prevEl = null), i && i.length && (Bt(e, r), e.save(), sM(i, e, r), s = !0, r.prevElClipPaths = i)), r.allClipped) {
    t.__dirty &= ~Wt, t.__isRendered = !1;
    return;
  }
  t.beforeBrush && t.beforeBrush(r.beforeBrushParam), t.innerBeforeBrush();
  var l = r.prevEl;
  l || (u = s = !0);
  var h = t instanceof st && t.autoBatch && lM(o);
  s || uM(n, l.transform) ? (Bt(e, r), Vy(e, t)) : h || Bt(e, r), t instanceof st ? (r.lastDrawType !== $c && (u = !0, r.lastDrawType = $c), Xc(e, t, l, u, r), (!h || !r.batchFill && !r.batchStroke) && e.beginPath(), nM(e, t, o, h, r)) : t instanceof zo ? (r.lastDrawType !== qc && (u = !0, r.lastDrawType = qc), Xc(e, t, l, u, r), aM(e, t, o)) : t instanceof Mr ? (r.lastDrawType !== Zc && (u = !0, r.lastDrawType = Zc), oM(e, t, l, u, r), iM(e, t, o)) : t.getTemporalDisplayables && (r.lastDrawType !== Kc && (u = !0, r.lastDrawType = Kc), fM(e, t, r)), t.innerAfterBrush(), t.afterBrush && (h && Bt(e, r), t.afterBrush()), r.prevEl = t, t.__dirty = 0, t.__isRendered = !0;
}
function Wn(e, t) {
  Bt(e, t), t.prevElClipPaths && e.restore();
}
function fM(e, t, r) {
  var n = t.getDisplayables(), i = t.getTemporalDisplayables();
  e.save();
  var a = {
    prevElClipPaths: null,
    prevEl: null,
    allClipped: !1,
    viewWidth: r.viewWidth,
    viewHeight: r.viewHeight,
    inHover: r.inHover,
    beforeBrushParam: {}
  }, o, s;
  for (o = t.getCursor(), s = n.length; o < s; o++) {
    var u = n[o];
    u.beforeBrush && u.beforeBrush(r.beforeBrushParam), u.innerBeforeBrush(), tn(e, u, a), u.innerAfterBrush(), u.afterBrush && u.afterBrush(), a.prevEl = u;
  }
  Wn(e, a);
  for (var l = 0, h = i.length; l < h; l++) {
    var u = i[l];
    u.beforeBrush && u.beforeBrush(r.beforeBrushParam), u.innerBeforeBrush(), tn(e, u, a), u.innerAfterBrush(), u.afterBrush && u.afterBrush(), a.prevEl = u;
  }
  Wn(e, a), t.clearTemporalDisplayables(), t.notClear = !0, e.restore();
}
var Ru = new UC(), Qc = new Zn(100), Jc = ["symbol", "symbolSize", "symbolKeepAspect", "color", "backgroundColor", "dashArrayX", "dashArrayY", "maxTileWidth", "maxTileHeight"];
function jc(e, t) {
  if (e === "none")
    return null;
  var r = t.getDevicePixelRatio(), n = t.getZr(), i = n.painter.type === "svg";
  e.dirty && Ru.delete(e);
  var a = Ru.get(e);
  if (a)
    return a;
  var o = mt(e, {
    symbol: "rect",
    symbolSize: 1,
    symbolKeepAspect: !0,
    color: "rgba(0, 0, 0, 0.2)",
    backgroundColor: null,
    dashArrayX: 5,
    dashArrayY: 5,
    rotation: 0,
    maxTileWidth: 512,
    maxTileHeight: 512
  });
  o.backgroundColor === "none" && (o.backgroundColor = null);
  var s = {
    repeat: "repeat"
  };
  return u(s), s.rotation = o.rotation, s.scaleX = s.scaleY = i ? 1 : 1 / r, Ru.set(e, s), e.dirty = !1, s;
  function u(l) {
    for (var h = [r], f = !0, v = 0; v < Jc.length; ++v) {
      var c = o[Jc[v]];
      if (c != null && !N(c) && !G(c) && !pt(c) && typeof c != "boolean") {
        f = !1;
        break;
      }
      h.push(c);
    }
    var d;
    if (f) {
      d = h.join(",") + (i ? "-svg" : "");
      var y = Qc.get(d);
      y && (i ? l.svgElement = y : l.image = y);
    }
    var p = Gy(o.dashArrayX), g = hM(o.dashArrayY), m = Hy(o.symbol), _ = vM(p), S = Uy(g), w = !i && Tt.createCanvas(), b = i && {
      tag: "g",
      attrs: {},
      key: "dcl",
      children: []
    }, M = T(), C;
    w && (w.width = M.width * r, w.height = M.height * r, C = w.getContext("2d")), I(), f && Qc.put(d, w || b), l.image = w, l.svgElement = b, l.svgWidth = M.width, l.svgHeight = M.height;
    function T() {
      for (var x = 1, E = 0, L = _.length; E < L; ++E)
        x = gv(x, _[E]);
      for (var R = 1, E = 0, L = m.length; E < L; ++E)
        R = gv(R, m[E].length);
      x *= R;
      var k = S * _.length * m.length;
      return {
        width: Math.max(1, Math.min(x, o.maxTileWidth)),
        height: Math.max(1, Math.min(k, o.maxTileHeight))
      };
    }
    function I() {
      C && (C.clearRect(0, 0, w.width, w.height), o.backgroundColor && (C.fillStyle = o.backgroundColor, C.fillRect(0, 0, w.width, w.height)));
      for (var x = 0, E = 0; E < g.length; ++E)
        x += g[E];
      if (x <= 0)
        return;
      for (var L = -S, R = 0, k = 0, O = 0; L < M.height; ) {
        if (R % 2 === 0) {
          for (var U = k / 2 % m.length, Q = 0, q = 0, J = 0; Q < M.width * 2; ) {
            for (var rt = 0, E = 0; E < p[O].length; ++E)
              rt += p[O][E];
            if (rt <= 0)
              break;
            if (q % 2 === 0) {
              var et = (1 - o.symbolSize) * 0.5, ot = Q + p[O][q] * et, X = L + g[R] * et, nt = p[O][q] * o.symbolSize, ht = g[R] * o.symbolSize, qt = J / 2 % m[U].length;
              Ye(ot, X, nt, ht, m[U][qt]);
            }
            Q += p[O][q], ++J, ++q, q === p[O].length && (q = 0);
          }
          ++O, O === p.length && (O = 0);
        }
        L += g[R], ++k, ++R, R === g.length && (R = 0);
      }
      function Ye(Kt, wt, Y, K, xr) {
        var Pt = i ? 1 : r, Bh = Es(xr, Kt * Pt, wt * Pt, Y * Pt, K * Pt, o.color, o.symbolKeepAspect);
        if (i) {
          var Fh = n.painter.renderOneToVNode(Bh);
          Fh && b.children.push(Fh);
        } else
          dh(C, Bh);
      }
    }
  }
}
function Hy(e) {
  if (!e || e.length === 0)
    return [["rect"]];
  if (G(e))
    return [[e]];
  for (var t = !0, r = 0; r < e.length; ++r)
    if (!G(e[r])) {
      t = !1;
      break;
    }
  if (t)
    return Hy([e]);
  for (var n = [], r = 0; r < e.length; ++r)
    G(e[r]) ? n.push([e[r]]) : n.push(e[r]);
  return n;
}
function Gy(e) {
  if (!e || e.length === 0)
    return [[0, 0]];
  if (pt(e)) {
    var t = Math.ceil(e);
    return [[t, t]];
  }
  for (var r = !0, n = 0; n < e.length; ++n)
    if (!pt(e[n])) {
      r = !1;
      break;
    }
  if (r)
    return Gy([e]);
  for (var i = [], n = 0; n < e.length; ++n)
    if (pt(e[n])) {
      var t = Math.ceil(e[n]);
      i.push([t, t]);
    } else {
      var t = z(e[n], function(s) {
        return Math.ceil(s);
      });
      t.length % 2 === 1 ? i.push(t.concat(t)) : i.push(t);
    }
  return i;
}
function hM(e) {
  if (!e || typeof e == "object" && e.length === 0)
    return [0, 0];
  if (pt(e)) {
    var t = Math.ceil(e);
    return [t, t];
  }
  var r = z(e, function(n) {
    return Math.ceil(n);
  });
  return e.length % 2 ? r.concat(r) : r;
}
function vM(e) {
  return z(e, function(t) {
    return Uy(t);
  });
}
function Uy(e) {
  for (var t = 0, r = 0; r < e.length; ++r)
    t += e[r];
  return e.length % 2 === 1 ? t * 2 : t;
}
var cM = ig(dM);
function dM(e, t) {
  e.eachRawSeries(function(r) {
    if (!e.isSeriesFiltered(r)) {
      var n = r.getData();
      n.hasItemVisual() && n.each(function(o) {
        var s = n.getItemVisual(o, "decal");
        if (s) {
          var u = n.ensureUniqueItemVisual(o, "style");
          u.decal = jc(s, t);
        }
      });
      var i = n.getVisual("decal");
      if (i) {
        var a = n.getVisual("style");
        a.decal = jc(i, t);
      }
    }
  });
}
var pM = "6.1.0", gM = {
  zrender: "6.1.0"
}, yM = 1, mM = 800, _M = 900, SM = 920, wM = 1e3, bM = 2e3, td = 5e3, Yy = 1e3, TM = 1100, ph = 2e3, Wy = 3e3, CM = 4e3, Rs = 4500, MM = 4600, DM = 5e3, IM = 6e3, Xy = 7e3, $y = {
  PROCESSOR: {
    SERIES_FILTER: mM,
    AXIS_STATISTICS: SM,
    FILTER: wM,
    STATISTIC: td,
    STATISTICS: td
  },
  VISUAL: {
    LAYOUT: Yy,
    PROGRESSIVE_LAYOUT: TM,
    GLOBAL: ph,
    CHART: Wy,
    POST_CHART_LAYOUT: MM,
    COMPONENT: CM,
    BRUSH: DM,
    CHART_ITEM: Rs,
    ARIA: IM,
    DECAL: Xy
  }
}, gt = "__flagInMainProcess", Ya = "__mainProcessVersion", _t = "__pendingUpdate", Pu = "__needsUpdateStatus", ed = /^[a-zA-Z0-9_]+$/, Au = "__connectUpdateStatus", rd = 0, xM = 1, LM = 2;
function Zy(e) {
  return function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    if (this.isDisposed()) {
      this.id;
      return;
    }
    return Ky(this, e, t);
  };
}
function qy(e) {
  return function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    return Ky(this, e, t);
  };
}
function Ky(e, t, r) {
  return r[0] = r[0] && r[0].toLowerCase(), Te.prototype[t].apply(e, r);
}
var Qy = (
  /** @class */
  function(e) {
    B(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t;
  }(Te)
), Jy = Qy.prototype;
Jy.on = qy("on");
Jy.off = qy("off");
var Zr, Ou, Wa, $e, Xa, ku, Nu, xn, Ln, nd, id, Bu, ad, $a, od, jy, ne, sd, En, Qo = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r, n, i) {
      var a = e.call(this, new PC()) || this;
      a._chartsViews = [], a._chartsMap = {}, a._componentsViews = [], a._componentsMap = {}, a._pendingActions = [], i = i || {}, a.__v_skip = !0, a._dom = r;
      var o = "canvas", s = "auto", u = !1;
      a[Ya] = 1, i.ssr && Yp(function(v) {
        var c = Ft(v), d = c.dataIndex;
        if (d != null) {
          var y = V();
          return y.set("series_index", c.seriesIndex), y.set("data_index", d), c.ssrType && y.set("ssr_type", c.ssrType), y;
        }
      });
      var l = a._zr = Ll(r, {
        renderer: i.renderer || o,
        devicePixelRatio: i.devicePixelRatio,
        width: i.width,
        height: i.height,
        ssr: i.ssr,
        useDirtyRect: W(i.useDirtyRect, u),
        useCoarsePointer: W(i.useCoarsePointer, s),
        pointerSize: i.pointerSize
      });
      a._ssr = i.ssr, a._throttledZrFlush = Iy(lt(l.flush, l), 17), a._updateTheme(n), a._locale = Db(i.locale || Zg), a._coordSysMgr = new ga();
      var h = a._api = od(a);
      function f(v, c) {
        return v.__prio - c.__prio;
      }
      return oo(jo, f), oo(tf, f), a._scheduler = new Ey(a, h, tf, jo), a._messageCenter = new Qy(), a._initEvents(), a.resize = lt(a.resize, a), l.animation.on("frame", a._onframe, a), nd(l, a), id(l, a), xo(a), a;
    }
    return t.prototype._onframe = function() {
      if (!this._disposed) {
        var r = this._scheduler, n = this._model, i = this._api;
        if (sd(this), this[_t]) {
          var a = this[_t].silent;
          this[gt] = !0, En(this);
          try {
            Zr(this), $e.update.call(this, null, this[_t].updateParams);
          } catch (u) {
            throw this[gt] = !1, this[_t] = null, u;
          }
          this._zr.flush(), this[gt] = !1, this[_t] = null, xn.call(this, a), Ln.call(this, a);
        } else if (r.unfinished) {
          var o = yM;
          do {
            r.unfinished = !1;
            var s = Tt.getTime();
            r.performSeriesTasks(n), r.performDataProcessorTasks(n), ku(this, n), r.performVisualTasks(n), $a(this, this._model, i, "remain", {}), o -= Tt.getTime() - s;
          } while (o > 0 && r.unfinished);
          r.unfinished || this._zr.flush();
        }
      }
    }, t.prototype.getDom = function() {
      return this._dom;
    }, t.prototype.getId = function() {
      return this.id;
    }, t.prototype.getZr = function() {
      return this._zr;
    }, t.prototype.isSSR = function() {
      return this._ssr;
    }, t.prototype.setOption = function(r, n, i) {
      if (!this[gt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        var a, o, s;
        if (F(n) && (i = n.lazyUpdate, a = n.silent, o = n.replaceMerge, s = n.transition, n = n.notMerge), this[gt] = !0, En(this), !this._model || n) {
          var u = new ST(this._api), l = this._theme, h = this._model = new oh();
          h.scheduler = this._scheduler, h.ssr = this._ssr, h.init(null, null, null, l, this._locale, u);
        }
        this._model.setOption(r, {
          replaceMerge: o
        }, ef);
        var f = {
          seriesTransition: s,
          optionChanged: !0
        };
        if (i)
          this[_t] = {
            silent: a,
            updateParams: f
          }, this[gt] = !1, this.getZr().wakeUp();
        else {
          try {
            Zr(this), $e.update.call(this, null, f);
          } catch (v) {
            throw this[_t] = null, this[gt] = !1, v;
          }
          this._ssr || this._zr.flush(), this[_t] = null, this[gt] = !1, xn.call(this, a), Ln.call(this, a);
        }
      }
    }, t.prototype.setTheme = function(r, n) {
      if (!this[gt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        var i = this._model;
        if (i) {
          var a = n && n.silent, o = null;
          this[_t] && (a == null && (a = this[_t].silent), o = this[_t].updateParams, this[_t] = null), this[gt] = !0, En(this);
          try {
            this._updateTheme(r), i.setTheme(this._theme), Zr(this), $e.update.call(this, {
              type: "setTheme"
            }, o);
          } catch (s) {
            throw this[gt] = !1, s;
          }
          this[gt] = !1, xn.call(this, a), Ln.call(this, a);
        }
      }
    }, t.prototype._updateTheme = function(r) {
      G(r) && (r = tm[r]), r && (r = $(r), r && py(r, !0), this._theme = r);
    }, t.prototype.getModel = function() {
      return this._model;
    }, t.prototype.getOption = function() {
      return this._model && this._model.getOption();
    }, t.prototype.getWidth = function() {
      return this._zr.getWidth();
    }, t.prototype.getHeight = function() {
      return this._zr.getHeight();
    }, t.prototype.getDevicePixelRatio = function() {
      return this._zr.painter.dpr || tt.hasGlobalWindow && window.devicePixelRatio || 1;
    }, t.prototype.getRenderedCanvas = function(r) {
      return this.renderToCanvas(r);
    }, t.prototype.renderToCanvas = function(r) {
      r = r || {};
      var n = this._zr.painter;
      return n.getRenderedCanvas({
        backgroundColor: r.backgroundColor || this._model.get("backgroundColor"),
        pixelRatio: r.pixelRatio || this.getDevicePixelRatio()
      });
    }, t.prototype.renderToSVGString = function(r) {
      r = r || {};
      var n = this._zr.painter;
      return n.renderToString({
        useViewBox: r.useViewBox
      });
    }, t.prototype.getSvgDataURL = function() {
      var r = this._zr, n = r.storage.getDisplayList();
      return D(n, function(i) {
        i.stopAnimation(null, !0);
      }), r.painter.toDataURL();
    }, t.prototype.getDataURL = function(r) {
      if (this._disposed) {
        this.id;
        return;
      }
      r = r || {};
      var n = r.excludeComponents, i = this._model, a = [], o = this;
      D(n, function(u) {
        i.eachComponent({
          mainType: u
        }, function(l) {
          var h = o._componentsMap[l.__viewId];
          h.group.ignore || (a.push(h), h.group.ignore = !0);
        });
      });
      var s = this._zr.painter.getType() === "svg" ? this.getSvgDataURL() : this.renderToCanvas(r).toDataURL("image/" + (r && r.type || "png"));
      return D(a, function(u) {
        u.group.ignore = !1;
      }), s;
    }, t.prototype.getConnectedDataURL = function(r) {
      if (this._disposed) {
        this.id;
        return;
      }
      var n = r.type === "svg", i = this.group, a = Math.min, o = Math.max, s = 1 / 0;
      if (ts[i]) {
        var u = s, l = s, h = -s, f = -s, v = [], c = r && r.pixelRatio || this.getDevicePixelRatio();
        D(sn, function(_, S) {
          if (_.group === i) {
            var w = n ? _.getZr().painter.getSvgDom().innerHTML : _.renderToCanvas($(r)), b = _.getDom().getBoundingClientRect();
            u = a(b.left, u), l = a(b.top, l), h = o(b.right, h), f = o(b.bottom, f), v.push({
              dom: w,
              left: b.left,
              top: b.top
            });
          }
        }), u *= c, l *= c, h *= c, f *= c;
        var d = h - u, y = f - l, p = Tt.createCanvas(), g = Ll(p, {
          renderer: n ? "svg" : "canvas"
        });
        if (g.resize({
          width: d,
          height: y
        }), n) {
          var m = "";
          return D(v, function(_) {
            var S = _.left - u, w = _.top - l;
            m += '<g transform="translate(' + S + "," + w + ')">' + _.dom + "</g>";
          }), g.painter.getSvgRoot().innerHTML = m, r.connectedBackgroundColor && g.painter.setBackgroundColor(r.connectedBackgroundColor), g.refreshImmediately(), g.painter.toDataURL();
        } else
          return r.connectedBackgroundColor && g.add(new Fe({
            shape: {
              x: 0,
              y: 0,
              width: d,
              height: y
            },
            style: {
              fill: r.connectedBackgroundColor
            }
          })), D(v, function(_) {
            var S = new Mr({
              style: {
                x: _.left * c - u,
                y: _.top * c - l,
                image: _.dom
              }
            });
            g.add(S);
          }), g.refreshImmediately(), p.toDataURL("image/" + (r && r.type || "png"));
      } else
        return this.getDataURL(r);
    }, t.prototype.convertToPixel = function(r, n, i) {
      return Xa(this, "convertToPixel", r, n, i);
    }, t.prototype.convertToLayout = function(r, n, i) {
      return Xa(this, "convertToLayout", r, n, i);
    }, t.prototype.convertFromPixel = function(r, n, i) {
      return Xa(this, "convertFromPixel", r, n, i);
    }, t.prototype.containPixel = function(r, n) {
      if (this._disposed) {
        this.id;
        return;
      }
      var i = this._model, a, o = ou(i, r);
      return D(o, function(s, u) {
        u.indexOf("Models") >= 0 && D(s, function(l) {
          var h = l.coordinateSystem;
          if (h && h.containPoint)
            a = a || !!h.containPoint(n);
          else if (u === "seriesModels") {
            var f = this._chartsMap[l.__viewId];
            f && f.containPoint && (a = a || f.containPoint(n, l));
          }
        }, this);
      }, this), !!a;
    }, t.prototype.getVisual = function(r, n) {
      var i = this._model, a = ou(i, r, {
        defaultMainType: "series"
      }), o = a.seriesModel, s = o.getData(), u = a.hasOwnProperty("dataIndexInside") ? a.dataIndexInside : a.hasOwnProperty("dataIndex") ? s.indexOfRawIndex(a.dataIndex) : null;
      return u != null ? kC(s, u, n) : NC(s, n);
    }, t.prototype.getViewOfComponentModel = function(r) {
      return this._componentsMap[r.__viewId];
    }, t.prototype.getViewOfSeriesModel = function(r) {
      return this._chartsMap[r.__viewId];
    }, t.prototype._initEvents = function() {
      var r = this;
      D(EM, function(i) {
        var a = function(o) {
          var s = r.getModel(), u = o.target, l, h = i === "globalout";
          if (h ? l = {} : u && Ha(u, function(y) {
            var p = Ft(y);
            if (p && p.dataIndex != null) {
              var g = p.dataModel || s.getSeriesByIndex(p.seriesIndex);
              return l = g && g.getDataParams(p.dataIndex, p.dataType, u) || {}, !0;
            } else if (p.eventData)
              return l = A({}, p.eventData), !0;
          }, !0), l) {
            var f = l.componentType, v = l.componentIndex;
            (f === "markLine" || f === "markPoint" || f === "markArea") && (f = "series", v = l.seriesIndex);
            var c = f && v != null && s.getComponent(f, v), d = c && r[c.mainType === "series" ? "_chartsMap" : "_componentsMap"][c.__viewId];
            l.event = o, l.type = i, r._$eventProcessor.eventInfo = {
              targetEl: u,
              packedEvent: l,
              model: c,
              view: d
            }, r.trigger(i, l);
          }
        };
        a.zrEventfulCallAtLast = !0, r._zr.on(i, a, r);
      });
      var n = this._messageCenter;
      D(jl, function(i, a) {
        n.on(a, function(o) {
          r.trigger(a, o);
        });
      }), BC(n, this, this._api);
    }, t.prototype.isDisposed = function() {
      return this._disposed;
    }, t.prototype.clear = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this.setOption({
        series: []
      }, !0);
    }, t.prototype.dispose = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this._disposed = !0;
      var r = this.getDom();
      r && ng(this.getDom(), yh, "");
      var n = this, i = n._api, a = n._model;
      D(n._componentsViews, function(o) {
        o.dispose(a, i);
      }), D(n._chartsViews, function(o) {
        o.dispose(a, i);
      }), n._zr.dispose(), n._dom = n._model = n._chartsMap = n._componentsMap = n._chartsViews = n._componentsViews = n._scheduler = n._api = n._zr = n._throttledZrFlush = n._theme = n._coordSysMgr = n._messageCenter = null, delete sn[n.id];
    }, t.prototype.resize = function(r) {
      if (!this[gt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        this._zr.resize(r);
        var n = this._model;
        if (this._loadingFX && this._loadingFX.resize(), !!n) {
          var i = n.resetOption("media"), a = r && r.silent;
          this[_t] && (a == null && (a = this[_t].silent), i = !0, this[_t] = null), this[gt] = !0, En(this);
          try {
            i && Zr(this), $e.update.call(this, {
              type: "resize",
              animation: A({
                // Disable animation
                duration: 0
              }, r && r.animation)
            });
          } catch (o) {
            throw this[gt] = !1, o;
          }
          this[gt] = !1, xn.call(this, a), Ln.call(this, a);
        }
      }
    }, t.prototype.showLoading = function(r, n) {
      if (this._disposed) {
        this.id;
        return;
      }
      if (F(r) && (n = r, r = ""), r = r || "default", this.hideLoading(), !!rf[r]) {
        var i = rf[r](this._api, n), a = this._zr;
        this._loadingFX = i, a.add(i);
      }
    }, t.prototype.hideLoading = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this._loadingFX && this._zr.remove(this._loadingFX), this._loadingFX = null;
    }, t.prototype.makeActionFromEvent = function(r) {
      var n = A({}, r);
      return n.type = Jl[r.type], n;
    }, t.prototype.dispatchAction = function(r, n) {
      if (this._disposed) {
        this.id;
        return;
      }
      if (F(n) || (n = {
        silent: !!n
      }), !!Jo[r.type] && this._model) {
        if (this[gt]) {
          this._pendingActions.push(r);
          return;
        }
        var i = n.silent;
        Nu.call(this, r, i);
        var a = n.flush;
        a ? this._zr.flush() : a !== !1 && tt.browser.weChat && this._throttledZrFlush(), xn.call(this, i), Ln.call(this, i);
      }
    }, t.prototype.updateLabelLayout = function() {
      ae.trigger("series:layoutlabels", this._model, this._api, {
        // Not adding series labels.
        // TODO
        updatedSeries: []
      });
    }, t.prototype.appendData = function(r) {
      if (this._disposed) {
        this.id;
        return;
      }
      var n = r.seriesIndex, i = this.getModel(), a = i.getSeriesByIndex(n);
      a.appendData(r), this._scheduler.unfinished = !0, this.getZr().wakeUp();
    }, t.internalField = function() {
      Zr = function(f) {
        zC(f._model);
        var v = f._scheduler;
        v.restorePipelines(f._zr, f._model), v.prepareStageTasks(), Ou(f, !0), Ou(f, !1), v.plan();
      }, Ou = function(f, v) {
        for (var c = f._model, d = f._scheduler, y = v ? f._componentsViews : f._chartsViews, p = v ? f._componentsMap : f._chartsMap, g = f._zr, m = f._api, _ = 0; _ < y.length; _++)
          y[_].__alive = !1;
        v ? c.eachComponent(function(b, M) {
          b !== "series" && S(M);
        }) : c.eachSeries(S);
        function S(b) {
          var M = b.__requireNewView;
          b.__requireNewView = !1;
          var C = "_ec_" + b.id + "_" + b.type, T = !M && p[C];
          if (!T) {
            var I = Ae(b.type), x = v ? br.getClass(I.main, I.sub) : (
              // FIXME:TS
              // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
              // For backward compat, still support a chart type declared as only subType
              // like "liquidfill", but recommend "series.liquidfill"
              // But need a base class to make a type series.
              we.getClass(I.sub)
            );
            T = new x(), T.init(c, m), p[C] = T, y.push(T), g.add(T.group);
          }
          b.__viewId = T.__id = C, T.__alive = !0, T.__model = b, T.group.__ecComponentInfo = {
            mainType: b.mainType,
            index: b.componentIndex
          }, !v && d.prepareView(T, b, c, m);
        }
        for (var _ = 0; _ < y.length; ) {
          var w = y[_];
          w.__alive ? _++ : (!v && w.renderTask.dispose(), g.remove(w.group), w.dispose(c, m), y.splice(_, 1), p[w.__id] === w && delete p[w.__id], w.__id = w.group.__ecComponentInfo = null);
        }
      }, Wa = function(f, v, c, d, y) {
        var p = f._model;
        if (p.setUpdatePayload(c), !d) {
          D([].concat(f._componentsViews).concat(f._chartsViews), S);
          return;
        }
        var g = rg(c, d, y), m = c.excludeSeriesId, _;
        m != null && (_ = V(), D(zt(m), function(w) {
          var b = Se(w, null);
          b != null && _.set(b, !0);
        })), p && p.eachComponent(g, function(w) {
          var b = _ && _.get(w.id) != null;
          if (!b)
            if (Yv(c))
              if (w instanceof be)
                c.type === an && !c.notBlur && !w.get(["emphasis", "disabled"]) && sw(w, c, f._api);
              else {
                var M = Af(w.mainType, w.componentIndex, c.name, f._api), C = M.focusSelf, T = M.dispatchers;
                c.type === an && C && !c.notBlur && zl(w.mainType, w.componentIndex, f._api), T && D(T, function(I) {
                  c.type === an ? ra(I) : na(I);
                });
              }
            else Hl(c) && w instanceof be && (fw(w, c, f._api), Uv(w), ne(f));
        }, f), p && p.eachComponent(g, function(w) {
          var b = _ && _.get(w.id) != null;
          b || S(f[d === "series" ? "_chartsMap" : "_componentsMap"][w.__viewId]);
        }, f);
        function S(w) {
          w && w.__alive && w[v] && w[v](w.__model, p, f._api, c);
        }
      }, $e = {
        prepareAndUpdate: function(f) {
          Zr(this), $e.update.call(this, f, f && {
            // Needs to mark option changed if newOption is given.
            // It's from MagicType.
            // TODO If use a separate flag optionChanged in payload?
            optionChanged: f.newOption != null
          });
        },
        update: function(f, v) {
          var c = this._model, d = this._api, y = this._zr, p = this._coordSysMgr, g = this._scheduler;
          if (c) {
            VC(c), c.setUpdatePayload(f), g.restoreData(c, f), g.performSeriesTasks(c), p.create(c, d), ae.trigger("coordsys:aftercreate", c, d), g.performDataProcessorTasks(c, f), ku(this, c), p.update(c, d), n(c), g.performVisualTasks(c, f);
            var m = c.get("backgroundColor") || "transparent";
            y.setBackgroundColor(m);
            var _ = c.get("darkMode");
            _ != null && _ !== "auto" && y.setDarkMode(_), Bu(this, c, d, f, v), ae.trigger("afterupdate", c, d);
          }
        },
        /**
         * PENDING: See INCONSISTENCY_OF_BRUSH_SELECTED_EVENT_IN_UPDATE_TRANSFORM
         */
        updateTransform: function(f) {
          var v = this, c = v._model, d = v._api;
          if (c) {
            c.setUpdatePayload(f);
            var y = [];
            c.eachComponent(function(g, m) {
              if (g !== Ss) {
                var _ = v.getViewOfComponentModel(m);
                if (_ && _.__alive)
                  if (_.updateTransform) {
                    var S = _.updateTransform(m, c, d, f);
                    S && S.update && y.push(_);
                  } else
                    y.push(_);
              }
            });
            var p = V();
            c.eachSeries(function(g) {
              var m = v._chartsMap[g.__viewId], _ = g.pipelineContext;
              if (m.updateTransform && !_.progressiveRender) {
                var S = m.updateTransform(g, c, d, f);
                S && S.update && p.set(g.uid, 1);
              } else
                p.set(g.uid, 1);
            }), v._scheduler.performVisualTasks(c, f, {
              setDirty: !0,
              dirtyMap: p
            }), $a(v, c, d, f, {}, p), ae.trigger("afterupdate", c, d);
          }
        },
        updateView: function(f) {
          var v = this._model;
          v && (v.setUpdatePayload(f), we.markUpdateMethod(f, "updateView"), n(v), this._scheduler.performVisualTasks(v, f, {
            setDirty: !0
          }), Bu(this, v, this._api, f, {}), ae.trigger("afterupdate", v, this._api));
        },
        updateVisual: function(f) {
          var v = this, c = this._model;
          c && (c.setUpdatePayload(f), c.eachSeries(function(d) {
            d.getData().clearAllVisual();
          }), we.markUpdateMethod(f, "updateVisual"), n(c), this._scheduler.performVisualTasks(c, f, {
            visualType: "visual",
            setDirty: !0
          }), c.eachComponent(function(d, y) {
            if (d !== "series") {
              var p = v.getViewOfComponentModel(y);
              p && p.__alive && p.updateVisual(y, c, v._api, f);
            }
          }), c.eachSeries(function(d) {
            var y = v._chartsMap[d.__viewId];
            y.updateVisual(d, c, v._api, f);
          }), ae.trigger("afterupdate", c, this._api));
        },
        /**
         * @deprecated
         */
        updateLayout: function(f) {
          $e.update.call(this, f);
        }
      };
      function r(f, v, c, d, y) {
        if (f._disposed) {
          f.id;
          return;
        }
        for (var p = f._model, g = f._coordSysMgr.getCoordinateSystems(), m, _ = ou(p, c), S = 0; S < g.length; S++) {
          var w = g[S];
          if (w[v] && (m = w[v](p, _, d, y)) != null)
            return m;
        }
      }
      Xa = r, ku = function(f, v) {
        var c = f._chartsMap, d = f._scheduler;
        v.eachSeries(function(y) {
          d.updateStreamModes(y, c[y.__viewId]);
        });
      }, Nu = function(f, v) {
        var c = this, d = this.getModel(), y = f.type, p = f.escapeConnect, g = Jo[y], m = (g.update || "update").split(":"), _ = m.pop(), S = m[0] != null && Ae(m[0]);
        this[gt] = !0, En(this);
        var w = [f], b = !1;
        f.batch && (b = !0, w = z(f.batch, function(O) {
          return O = mt(A({}, O), f), O.batch = null, O;
        }));
        var M = [], C, T = [], I = g.nonRefinedEventType, x = Hl(f), E = Yv(f);
        if (E && Lg(this._api), D(w, function(O) {
          var U = g.action(O, d, c._api);
          if (g.refineEvent ? T.push(U) : C = U, C = C || A({}, O), C.type = I, M.push(C), E) {
            var Q = eg(f), q = Q.queryOptionMap, J = Q.mainTypeSpecified, rt = J ? q.keys()[0] : "series";
            Wa(c, _, O, rt), ne(c);
          } else x ? (Wa(c, _, O, "series"), ne(c)) : S && Wa(c, _, O, S.main, S.sub);
        }), _ !== "none" && !E && !x && !S)
          try {
            this[_t] ? (Zr(this), $e.update.call(this, f), this[_t] = null) : $e[_].call(this, f);
          } catch (O) {
            throw this[gt] = !1, O;
          }
        if (b ? C = {
          type: I,
          escapeConnect: p,
          batch: M
        } : C = M[0], this[gt] = !1, !v) {
          var L = void 0;
          if (g.refineEvent) {
            var R = g.refineEvent(T, f, d, this._api).eventContent;
            He(F(R)), L = mt({
              type: g.refinedEventType
            }, R), L.fromAction = f.type, L.fromActionPayload = f, L.escapeConnect = !0;
          }
          var k = this._messageCenter;
          k.trigger(C.type, C), L && k.trigger(L.type, L);
        }
      }, xn = function(f) {
        for (var v = this._pendingActions; v.length; ) {
          var c = v.shift();
          Nu.call(this, c, f);
        }
      }, Ln = function(f) {
        !f && this.trigger("updated");
      }, nd = function(f, v) {
        f.on("rendered", function(c) {
          v.trigger("rendered", c), // Although zr is dirty if initial animation is not finished
          // and this checking is called on frame, we also check
          // animation finished for robustness.
          f.animation.isFinished() && !v[_t] && !v._scheduler.unfinished && !v._pendingActions.length ? v.trigger("finished") : f.refresh();
        });
      }, id = function(f, v) {
        f.on("mouseover", function(c) {
          var d = c.target, y = Ha(d, Vl);
          y && (uw(y, c, v._api), ne(v));
        }).on("mouseout", function(c) {
          var d = c.target, y = Ha(d, Vl);
          y && (lw(y, c, v._api), ne(v));
        }).on("click", function(c) {
          var d = c.target, y = Ha(d, function(m) {
            return Ft(m).dataIndex != null;
          }, !0);
          if (y) {
            var p = y.selected ? "unselect" : "select", g = Ft(y);
            v._api.dispatchAction({
              type: p,
              dataType: g.dataType,
              dataIndexInside: g.dataIndex,
              seriesIndex: g.seriesIndex,
              isFromClick: !0
            });
          }
        });
      };
      function n(f) {
        f.clearColorPalette(), f.eachSeries(function(v) {
          v.clearColorPalette();
        });
      }
      function i(f) {
        var v = [], c = [], d = !1;
        if (f.eachComponent(function(m, _) {
          var S = _.get("zlevel") || 0, w = _.get("z") || 0, b = _.getZLevelKey();
          d = d || !!b, (m === "series" ? c : v).push({
            zlevel: S,
            z: w,
            idx: _.componentIndex,
            type: m,
            key: b
          });
        }), d) {
          var y = v.concat(c), p, g;
          oo(y, function(m, _) {
            return m.zlevel === _.zlevel ? m.z - _.z : m.zlevel - _.zlevel;
          }), D(y, function(m) {
            var _ = f.getComponent(m.type, m.idx), S = m.zlevel, w = m.key;
            p != null && (S = Math.max(p, S)), w ? (S === p && w !== g && S++, g = w) : g && (S === p && S++, g = ""), p = S, _.setZLevel(S);
          });
        }
      }
      Bu = function(f, v, c, d, y) {
        i(v), ad(f, v, c, d, y), D(f._chartsViews, function(p) {
          p.__alive = !1;
        }), $a(f, v, c, d, y), D(f._chartsViews, function(p) {
          p.__alive || p.remove(v, c);
        });
      }, ad = function(f, v, c, d, y, p) {
        D(p || f._componentsViews, function(g) {
          var m = g.__model;
          l(m, g), g.render(m, v, c, d), u(m, g), h(m, g);
        });
      }, $a = function(f, v, c, d, y, p) {
        var g = f._scheduler;
        y = A(y || {}, {
          updatedSeries: v.getSeries()
        }), ae.trigger("series:beforeupdate", v, c, y);
        var m = !1;
        v.eachSeries(function(_) {
          var S = f._chartsMap[_.__viewId];
          S.__alive = !0;
          var w = S.renderTask;
          g.updatePayload(w, d), l(_, S), p && p.get(_.uid) && w.dirty(), w.perform(g.getPerformArgs(w)) && (m = !0), S.group.silent = !!_.get("silent"), s(_, S), Uv(_);
        }), g.unfinished = m || g.unfinished, ae.trigger("series:layoutlabels", v, c, y), ae.trigger("series:transition", v, c, y), v.eachSeries(function(_) {
          var S = f._chartsMap[_.__viewId];
          u(_, S), h(_, S);
        }), o(f, v), ae.trigger("series:afterupdate", v, c, y);
      }, ne = function(f) {
        f[Pu] = !0, f.getZr().wakeUp();
      }, En = function(f) {
        f[Ya] = (f[Ya] + 1) % 1e6;
      }, sd = function(f) {
        f[Pu] && (f.getZr().storage.traverse(function(v) {
          yo(v) || a(v);
        }), f[Pu] = !1);
      };
      function a(f) {
        for (var v = [], c = f.currentStates, d = 0; d < c.length; d++) {
          var y = c[d];
          y === "emphasis" || y === "blur" || y === "select" || v.push(y);
        }
        f.selected && f.states.select && v.push("select"), f.hoverState === Ef && f.states.emphasis ? v.push("emphasis") : f.hoverState === Lf && f.states.blur && v.push("blur"), f.useStates(v);
      }
      function o(f, v) {
        var c = f._zr;
        if (c.painter.type === "canvas") {
          var d = c.storage, y = 0;
          d.traverse(function(g) {
            g.isGroup || y++;
          });
          var p = y > W(v.get("hoverLayerThreshold"), fy.hoverLayerThreshold) && !tt.node && !tt.worker;
          (f._usingTHL || p) && (v.eachSeries(function(g) {
            if (!g.preventUsingHoverLayer) {
              var m = f._chartsMap[g.__viewId];
              m.__alive && m.eachRendered(function(_) {
                var S = _.states.emphasis;
                S && S.hoverLayer !== Hf && (S.hoverLayer = p ? jw : Jw);
              });
            }
          }), f._usingTHL = p);
        }
      }
      function s(f, v) {
        var c = f.get("blendMode") || null;
        v.eachRendered(function(d) {
          d.isGroup || (d.style.blend = c);
        });
      }
      function u(f, v) {
        if (!f.preventAutoZ) {
          var c = Go(f);
          v.eachRendered(function(d) {
            return lb(d, c.z, c.zlevel), !0;
          });
        }
      }
      function l(f, v) {
        v.eachRendered(function(c) {
          if (!yo(c)) {
            var d = c.getTextContent(), y = c.getTextGuideLine();
            c.stateTransition && (c.stateTransition = null), d && d.stateTransition && (d.stateTransition = null), y && y.stateTransition && (y.stateTransition = null), c.hasState() ? (c.prevStates = c.currentStates, c.clearStates()) : c.prevStates && (c.prevStates = null);
          }
        });
      }
      function h(f, v) {
        var c = f.getModel("stateAnimation"), d = f.isAnimationEnabled(), y = c.get("duration"), p = y > 0 ? {
          duration: y,
          delay: c.get("delay"),
          easing: c.get("easing")
          // additive: stateAnimationModel.get('additive')
        } : null;
        v.eachRendered(function(g) {
          if (g.states && g.states.emphasis) {
            if (yo(g))
              return;
            if (g instanceof st && pw(g), g.__dirty) {
              var m = g.prevStates;
              m && g.useStates(m);
            }
            if (d) {
              g.stateTransition = p;
              var _ = g.getTextContent(), S = g.getTextGuideLine();
              _ && (_.stateTransition = p), S && (S.stateTransition = p);
            }
            g.__dirty && a(g);
          }
        });
      }
      od = function(f) {
        return new /** @class */
        (function(v) {
          B(c, v);
          function c() {
            return v !== null && v.apply(this, arguments) || this;
          }
          return c.prototype.getCoordinateSystems = function() {
            return f._coordSysMgr.getCoordinateSystems();
          }, c.prototype.getComponentByElement = function(d) {
            for (; d; ) {
              var y = d.__ecComponentInfo;
              if (y != null)
                return f._model.getComponent(y.mainType, y.index);
              d = d.parent;
            }
          }, c.prototype.enterEmphasis = function(d, y) {
            ra(d, y), ne(f);
          }, c.prototype.leaveEmphasis = function(d, y) {
            na(d, y), ne(f);
          }, c.prototype.enterBlur = function(d) {
            ow(d), ne(f);
          }, c.prototype.leaveBlur = function(d) {
            Mg(d), ne(f);
          }, c.prototype.enterSelect = function(d) {
            Dg(d), ne(f);
          }, c.prototype.leaveSelect = function(d) {
            Ig(d), ne(f);
          }, c.prototype.getModel = function() {
            return f.getModel();
          }, c.prototype.getViewOfComponentModel = function(d) {
            return f.getViewOfComponentModel(d);
          }, c.prototype.getViewOfSeriesModel = function(d) {
            return f.getViewOfSeriesModel(d);
          }, c.prototype.getECUpdateCycleVersion = function() {
            return f[Ya];
          }, c.prototype.usingTHL = function() {
            return f._usingTHL;
          }, c;
        }(mg))(f);
      }, jy = function(f) {
        function v(c, d) {
          for (var y = 0; y < c.length; y++) {
            var p = c[y];
            p[Au] = d;
          }
        }
        D(Jl, function(c, d) {
          f._messageCenter.on(d, function(y) {
            if (ts[f.group] && f[Au] !== rd) {
              if (y && y.escapeConnect)
                return;
              var p = f.makeActionFromEvent(y), g = [];
              D(sn, function(m) {
                m !== f && m.group === f.group && g.push(m);
              }), v(g, rd), D(g, function(m) {
                m[Au] !== xM && m.dispatchAction(p);
              }), v(g, LM);
            }
          });
        });
      };
    }(), t;
  }(Te)
), gh = Qo.prototype;
gh.on = Zy("on");
gh.off = Zy("off");
gh.one = function(e, t, r) {
  var n = this;
  function i() {
    for (var a = [], o = 0; o < arguments.length; o++)
      a[o] = arguments[o];
    t && t.apply && t.apply(this, a), n.off(e, i);
  }
  this.on.call(this, e, i, r);
};
var EM = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];
var Jo = {}, Jl = {}, jl = {}, tf = [], ef = [], jo = [], tm = {}, rf = {}, sn = {}, ts = {}, RM = +/* @__PURE__ */ new Date() - 0, PM = +/* @__PURE__ */ new Date() - 0, yh = "_echarts_instance_";
function AM(e, t, r) {
  var n = !(r && r.ssr);
  if (n) {
    var i = mh(e);
    if (i)
      return i;
  }
  var a = new Qo(e, t, r);
  return a.id = "ec_" + RM++, sn[a.id] = a, n && ng(e, yh, a.id), jy(a), ae.trigger("afterinit", a), a;
}
function OM(e) {
  if (N(e)) {
    var t = e;
    e = null, D(t, function(r) {
      r.group != null && (e = r.group);
    }), e = e || "g_" + PM++, D(t, function(r) {
      r.group = e;
    });
  }
  return ts[e] = !0, e;
}
function em(e) {
  ts[e] = !1;
}
var kM = em;
function NM(e) {
  G(e) ? e = sn[e] : e instanceof Qo || (e = mh(e)), e instanceof Qo && !e.isDisposed() && e.dispose();
}
function mh(e) {
  return sn[z1(e, yh)];
}
function BM(e) {
  return sn[e];
}
function _h(e, t) {
  tm[e] = t;
}
function Sh(e) {
  at(ef, e) < 0 && ef.push(e);
}
function wh(e, t) {
  bh(tf, e, t, bM);
}
function rm(e) {
  Ps("afterinit", e);
}
function nm(e) {
  Ps("afterupdate", e);
}
function Ps(e, t) {
  ae.on(e, t);
}
function Dr(e, t, r) {
  var n, i, a, o, s;
  Z(t) && (r = t, t = ""), F(e) ? (n = e.type, i = e.event, o = e.update, s = e.publishNonRefinedEvent, r || (r = e.action), a = e.refineEvent) : (n = e, i = t);
  function u(h) {
    return h.toLowerCase();
  }
  i = u(i || n);
  var l = a ? u(n) : i;
  Jo[n] || (He(ed.test(n) && ed.test(i)), a && He(i !== n), Jo[n] = {
    actionType: n,
    refinedEventType: i,
    nonRefinedEventType: l,
    update: o,
    action: r,
    refineEvent: a
  }, jl[i] = 1, a && s && (jl[l] = 1), Jl[l] = n);
}
function im(e, t) {
  ga.register(e, t);
}
function FM(e) {
  var t = ga.get(e);
  if (t)
    return t.getDimensionsInfo ? t.getDimensionsInfo() : t.dimensions.slice();
}
function zM(e, t) {
}
function am(e, t) {
  bh(jo, e, t, Yy, "layout");
}
function Ir(e, t) {
  bh(jo, e, t, Wy, "visual");
}
var ud = [];
function bh(e, t, r, n, i, a) {
  if ((Z(t) || F(t)) && (r = t, t = n), !(at(ud, r) >= 0)) {
    ud.push(r);
    var o = Ey.wrapStageHandler(r, i);
    o.__prio = t, o.__raw = r, e.push(o);
  }
}
function Th(e, t) {
  rf[e] = t;
}
function VM(e) {
  op({
    createCanvas: e
  });
}
function om(e, t, r) {
  var n = Ny("registerMap");
  n && n(e, t, r);
}
function HM(e) {
  var t = Ny("getMap");
  return t && t(e);
}
var sm = JT;
Ir(ph, _C);
Ir(Rs, SC);
Ir(Rs, wC);
Ir(ph, AC);
Ir(Rs, OC);
Ir(Xy, cM);
Sh(py);
wh(_M, PT);
Th("default", bC);
Dr({
  type: an,
  event: an,
  update: an
}, St);
Dr({
  type: po,
  event: po,
  update: po
}, St);
Dr({
  type: Vo,
  event: Rf,
  update: Vo,
  action: St,
  refineEvent: Ch,
  publishNonRefinedEvent: !0
});
Dr({
  type: Bl,
  event: Rf,
  update: Bl,
  action: St,
  refineEvent: Ch,
  publishNonRefinedEvent: !0
});
Dr({
  type: Ho,
  event: Rf,
  update: Ho,
  action: St,
  refineEvent: Ch,
  publishNonRefinedEvent: !0
});
function Ch(e, t, r, n) {
  return {
    eventContent: {
      selected: hw(r),
      isFromClick: t.isFromClick || !1
    }
  };
}
_h("default", {});
_h("dark", Oy);
var GM = {};
function mi(e) {
  return e == null ? 0 : e.length || 1;
}
function ld(e) {
  return e;
}
var UM = (
  /** @class */
  function() {
    function e(t, r, n, i, a, o) {
      this._old = t, this._new = r, this._oldKeyGetter = n || ld, this._newKeyGetter = i || ld, this.context = a, this._diffModeMultiple = o === "multiple";
    }
    return e.prototype.add = function(t) {
      return this._add = t, this;
    }, e.prototype.update = function(t) {
      return this._update = t, this;
    }, e.prototype.updateManyToOne = function(t) {
      return this._updateManyToOne = t, this;
    }, e.prototype.updateOneToMany = function(t) {
      return this._updateOneToMany = t, this;
    }, e.prototype.updateManyToMany = function(t) {
      return this._updateManyToMany = t, this;
    }, e.prototype.remove = function(t) {
      return this._remove = t, this;
    }, e.prototype.execute = function() {
      this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
    }, e.prototype._executeOneToOne = function() {
      var t = this._old, r = this._new, n = {}, i = new Array(t.length), a = new Array(r.length);
      this._initIndexMap(t, null, i, "_oldKeyGetter"), this._initIndexMap(r, n, a, "_newKeyGetter");
      for (var o = 0; o < t.length; o++) {
        var s = i[o], u = n[s], l = mi(u);
        if (l > 1) {
          var h = u.shift();
          u.length === 1 && (n[s] = u[0]), this._update && this._update(h, o);
        } else l === 1 ? (n[s] = null, this._update && this._update(u, o)) : this._remove && this._remove(o);
      }
      this._performRestAdd(a, n);
    }, e.prototype._executeMultiple = function() {
      var t = this._old, r = this._new, n = {}, i = {}, a = [], o = [];
      this._initIndexMap(t, n, a, "_oldKeyGetter"), this._initIndexMap(r, i, o, "_newKeyGetter");
      for (var s = 0; s < a.length; s++) {
        var u = a[s], l = n[u], h = i[u], f = mi(l), v = mi(h);
        if (f > 1 && v === 1)
          this._updateManyToOne && this._updateManyToOne(h, l), i[u] = null;
        else if (f === 1 && v > 1)
          this._updateOneToMany && this._updateOneToMany(h, l), i[u] = null;
        else if (f === 1 && v === 1)
          this._update && this._update(h, l), i[u] = null;
        else if (f > 1 && v > 1)
          this._updateManyToMany && this._updateManyToMany(h, l), i[u] = null;
        else if (f > 1)
          for (var c = 0; c < f; c++)
            this._remove && this._remove(l[c]);
        else
          this._remove && this._remove(l);
      }
      this._performRestAdd(o, i);
    }, e.prototype._performRestAdd = function(t, r) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n], a = r[i], o = mi(a);
        if (o > 1)
          for (var s = 0; s < o; s++)
            this._add && this._add(a[s]);
        else o === 1 && this._add && this._add(a);
        r[i] = null;
      }
    }, e.prototype._initIndexMap = function(t, r, n, i) {
      for (var a = this._diffModeMultiple, o = 0; o < t.length; o++) {
        var s = "_ec_" + this[i](t[o], o);
        if (a || (n[o] = s), !!r) {
          var u = r[s], l = mi(u);
          l === 0 ? (r[s] = o, a && n.push(s)) : l === 1 ? r[s] = [u, o] : u.push(o);
        }
      }
    }, e;
  }()
), YM = (
  /** @class */
  function() {
    function e(t, r) {
      this._encode = t, this._schema = r;
    }
    return e.prototype.get = function() {
      return {
        // Do not generate full dimension name until fist used.
        fullDimensions: this._getFullDimensionNames(),
        encode: this._encode
      };
    }, e.prototype._getFullDimensionNames = function() {
      return this._cachedDimNames || (this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : []), this._cachedDimNames;
    }, e;
  }()
);
function WM(e, t) {
  var r = {}, n = r.encode = {}, i = V(), a = [], o = [], s = {};
  D(e.dimensions, function(v) {
    var c = e.getDimensionInfo(v), d = c.coordDim;
    if (d) {
      var y = c.coordDimIndex;
      Fu(n, d)[y] = v, c.isExtraCoord || (i.set(d, 1), $M(c.type) && (a[0] = v), Fu(s, d)[y] = e.getDimensionIndex(c.name)), c.defaultTooltip && o.push(v);
    }
    pg.each(function(p, g) {
      var m = Fu(n, g), _ = c.otherDims[g];
      _ != null && _ !== !1 && (m[_] = c.name);
    });
  });
  var u = [], l = {};
  i.each(function(v, c) {
    var d = n[c];
    l[c] = d[0], u = u.concat(d);
  }), r.dataDimsOnCoord = u, r.dataDimIndicesOnCoord = z(u, function(v) {
    return e.getDimensionInfo(v).storeDimIndex;
  }), r.encodeFirstDimNotExtra = l;
  var h = n.label;
  h && h.length && (a = h.slice());
  var f = n.tooltip;
  return f && f.length ? o = f.slice() : o.length || (o = a.slice()), n.defaultedLabel = a, n.defaultedTooltip = o, r.userOutput = new YM(s, t), r;
}
function Fu(e, t) {
  return e.hasOwnProperty(t) || (e[t] = []), e[t];
}
function XM(e) {
  return e === "category" ? "ordinal" : e === "time" ? "time" : "float";
}
function $M(e) {
  return !(e === "ordinal" || e === "time");
}
var Mo = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      this.otherDims = {}, t != null && A(this, t);
    }
    return e;
  }()
), ZM = ut(), qM = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
}, um = (
  /** @class */
  function() {
    function e(t) {
      this.dimensions = t.dimensions, this._dimOmitted = t.dimensionOmitted, this.source = t.source, this._fullDimCount = t.fullDimensionCount, this._updateDimOmitted(t.dimensionOmitted);
    }
    return e.prototype.isDimensionOmitted = function() {
      return this._dimOmitted;
    }, e.prototype._updateDimOmitted = function(t) {
      this._dimOmitted = t, t && (this._dimNameMap || (this._dimNameMap = hm(this.source)));
    }, e.prototype.getSourceDimensionIndex = function(t) {
      return W(this._dimNameMap.get(t), -1);
    }, e.prototype.getSourceDimension = function(t) {
      var r = this.source.dimensionsDefine;
      if (r)
        return r[t];
    }, e.prototype.makeStoreSchema = function() {
      for (var t = this._fullDimCount, r = yy(this.source), n = !vm(t), i = "", a = [], o = 0, s = 0; o < t; o++) {
        var u = void 0, l = void 0, h = void 0, f = this.dimensions[s];
        if (f && f.storeDimIndex === o)
          u = r ? f.name : null, l = f.type, h = f.ordinalMeta, s++;
        else {
          var v = this.getSourceDimension(o);
          v && (u = r ? v.name : null, l = v.type);
        }
        a.push({
          property: u,
          type: l,
          ordinalMeta: h
        }), r && u != null && (!f || !f.isCalculationCoord) && (i += n ? u.replace(/\`/g, "`1").replace(/\$/g, "`2") : u), i += "$", i += qM[l] || "f", h && (i += h.uid), i += "$";
      }
      var c = this.source, d = [c.seriesLayoutBy, c.startIndex, i].join("$$");
      return {
        dimensions: a,
        hash: d
      };
    }, e.prototype.makeOutputDimensionNames = function() {
      for (var t = [], r = 0, n = 0; r < this._fullDimCount; r++) {
        var i = void 0, a = this.dimensions[n];
        if (a && a.storeDimIndex === r)
          a.isCalculationCoord || (i = a.name), n++;
        else {
          var o = this.getSourceDimension(r);
          o && (i = o.name);
        }
        t.push(i);
      }
      return t;
    }, e.prototype.appendCalculationDimension = function(t) {
      this.dimensions.push(t), t.isCalculationCoord = !0, this._fullDimCount++, this._updateDimOmitted(!0);
    }, e;
  }()
);
function lm(e) {
  return e instanceof um;
}
function fm(e) {
  for (var t = V(), r = 0; r < (e || []).length; r++) {
    var n = e[r], i = F(n) ? n.name : n;
    i != null && t.get(i) == null && t.set(i, r);
  }
  return t;
}
function hm(e) {
  var t = ZM(e);
  return t.dimNameMap || (t.dimNameMap = fm(e.dimensionsDefine));
}
function vm(e) {
  return e > 30;
}
var _i = F, ir = z, KM = typeof Int32Array == "undefined" ? Array : Int32Array, QM = "e\0\0", fd = -1, JM = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"], jM = ["_approximateExtent"], hd, Za, Si, wi, zu, bi, Vu, oa = (
  /** @class */
  function() {
    function e(t, r) {
      this.type = "list", this._dimOmitted = !1, this._nameList = [], this._idList = [], this._visual = {}, this._layout = {}, this._itemVisuals = [], this._itemLayouts = [], this._graphicEls = [], this._approximateExtent = {}, this._calculationInfo = {}, this.hasItemOption = !1, this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"], this.CHANGABLE_METHODS = ["filterSelf", "selectRange"], this.DOWNSAMPLE_METHODS = ["downSample", "minmaxDownSample", "lttbDownSample"];
      var n, i = !1;
      lm(t) ? (n = t.dimensions, this._dimOmitted = t.isDimensionOmitted(), this._schema = t) : (i = !0, n = t), n = n || ["x", "y"];
      for (var a = {}, o = [], s = {}, u = !1, l = {}, h = 0; h < n.length; h++) {
        var f = n[h], v = G(f) ? new Mo({
          name: f
        }) : f instanceof Mo ? f : new Mo(f), c = v.name;
        v.type = v.type || "float", v.coordDim || (v.coordDim = c, v.coordDimIndex = 0);
        var d = v.otherDims = v.otherDims || {};
        o.push(c), a[c] = v, l[c] != null && (u = !0), v.createInvertedIndices && (s[c] = []), i && (v.storeDimIndex = h), d.itemName === 0 && (this._nameDimIdx = v.storeDimIndex), d.itemId === 0 && (this._idDimIdx = v.storeDimIndex);
      }
      if (this.dimensions = o, this._dimInfos = a, this._initGetDimensionInfo(u), this.hostModel = r, this._invertedIndicesMap = s, this._dimOmitted) {
        var y = this._dimIdxToName = V();
        D(o, function(p) {
          y.set(a[p].storeDimIndex, p);
        });
      }
    }
    return e.prototype.getDimension = function(t) {
      var r = this._recognizeDimIndex(t);
      if (r == null)
        return t;
      if (r = t, !this._dimOmitted)
        return this.dimensions[r];
      var n = this._dimIdxToName.get(r);
      if (n != null)
        return n;
      var i = this._schema.getSourceDimension(r);
      if (i)
        return i.name;
    }, e.prototype.getDimensionIndex = function(t) {
      var r = this._recognizeDimIndex(t);
      if (r != null)
        return r;
      if (t == null)
        return -1;
      var n = this._getDimInfo(t);
      return n ? n.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(t) : -1;
    }, e.prototype._recognizeDimIndex = function(t) {
      if (pt(t) || t != null && !isNaN(t) && !this._getDimInfo(t) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(t) < 0))
        return +t;
    }, e.prototype._getStoreDimIndex = function(t) {
      var r = this.getDimensionIndex(t);
      return r;
    }, e.prototype.getDimensionInfo = function(t) {
      return this._getDimInfo(this.getDimension(t));
    }, e.prototype._initGetDimensionInfo = function(t) {
      var r = this._dimInfos;
      this._getDimInfo = t ? function(n) {
        return r.hasOwnProperty(n) ? r[n] : void 0;
      } : function(n) {
        return r[n];
      };
    }, e.prototype.getDimensionsOnCoord = function() {
      return this._dimSummary.dataDimsOnCoord.slice();
    }, e.prototype.mapDimension = function(t, r) {
      var n = this._dimSummary;
      if (r == null)
        return n.encodeFirstDimNotExtra[t];
      var i = n.encode[t];
      return i ? i[r] : null;
    }, e.prototype.mapDimensionsAll = function(t) {
      var r = this._dimSummary, n = r.encode[t];
      return (n || []).slice();
    }, e.prototype.getStore = function() {
      return this._store;
    }, e.prototype.initData = function(t, r, n) {
      var i = this, a;
      if (t instanceof Xl && (a = t), !a) {
        var o = this.dimensions, s = sh(t) || $t(t) ? new my(t, o.length) : t;
        a = new Xl();
        var u = ir(o, function(l) {
          return {
            type: i._dimInfos[l].type,
            property: l
          };
        });
        a.initData(s, u, n);
      }
      this._store = a, this._nameList = (r || []).slice(), this._idList = [], this._nameRepeatCount = {}, this._doInit(0, a.count()), this._dimSummary = WM(this, this._schema), this.userOutput = this._dimSummary.userOutput;
    }, e.prototype.appendData = function(t) {
      var r = this._store.appendData(t);
      this._doInit(r[0], r[1]);
    }, e.prototype.appendValues = function(t, r) {
      var n = this._store.appendValues(t, r && r.length), i = n.start, a = n.end, o = this._shouldMakeIdFromName();
      if (this._updateOrdinalMeta(), r)
        for (var s = i; s < a; s++) {
          var u = s - i;
          this._nameList[s] = r[u], o && Vu(this, s);
        }
    }, e.prototype._updateOrdinalMeta = function() {
      for (var t = this._store, r = this.dimensions, n = 0; n < r.length; n++) {
        var i = this._dimInfos[r[n]];
        i.ordinalMeta && t.collectOrdinalMeta(i.storeDimIndex, i.ordinalMeta);
      }
    }, e.prototype._shouldMakeIdFromName = function() {
      var t = this._store.getProvider();
      return this._idDimIdx == null && t.getSource().sourceFormat !== yr && !t.fillStorage;
    }, e.prototype._doInit = function(t, r) {
      if (!(t >= r)) {
        var n = this._store, i = n.getProvider();
        this._updateOrdinalMeta();
        var a = this._nameList, o = this._idList, s = i.getSource().sourceFormat, u = s === re;
        if (u && !i.pure)
          for (var l = [], h = t; h < r; h++) {
            var f = i.getItem(h, l);
            if (!this.hasItemOption && x1(f) && (this.hasItemOption = !0), f) {
              var v = f.name;
              a[h] == null && v != null && (a[h] = Se(v, null));
              var c = f.id;
              o[h] == null && c != null && (o[h] = Se(c, null));
            }
          }
        if (this._shouldMakeIdFromName())
          for (var h = t; h < r; h++)
            Vu(this, h);
        hd(this);
      }
    }, e.prototype.getApproximateExtent = function(t, r) {
      return this._approximateExtent[t] || this._store.getDataExtent(this._getStoreDimIndex(t), r);
    }, e.prototype.setApproximateExtent = function(t, r) {
      r = this.getDimension(r), this._approximateExtent[r] = t.slice();
    }, e.prototype.getCalculationInfo = function(t) {
      return this._calculationInfo[t];
    }, e.prototype.setCalculationInfo = function(t, r) {
      _i(t) ? A(this._calculationInfo, t) : this._calculationInfo[t] = r;
    }, e.prototype.getName = function(t) {
      var r = this.getRawIndex(t), n = this._nameList[r];
      return n == null && this._nameDimIdx != null && (n = Si(this, this._nameDimIdx, r)), n == null && (n = ""), n;
    }, e.prototype._getCategory = function(t, r) {
      var n = this._store.get(t, r), i = this._store.getOrdinalMeta(t);
      return i ? i.categories[n] : n;
    }, e.prototype.getId = function(t) {
      return Za(this, this.getRawIndex(t));
    }, e.prototype.count = function() {
      return this._store.count();
    }, e.prototype.get = function(t, r) {
      var n = this._store, i = this._dimInfos[t];
      if (i)
        return n.get(i.storeDimIndex, r);
    }, e.prototype.getByRawIndex = function(t, r) {
      var n = this._store, i = this._dimInfos[t];
      if (i)
        return n.getByRawIndex(i.storeDimIndex, r);
    }, e.prototype.getIndices = function() {
      return this._store.getIndices();
    }, e.prototype.getDataExtent = function(t) {
      return this._store.getDataExtent(this._getStoreDimIndex(t), null);
    }, e.prototype.getSum = function(t) {
      return this._store.getSum(this._getStoreDimIndex(t));
    }, e.prototype.getMedian = function(t) {
      return this._store.getMedian(this._getStoreDimIndex(t));
    }, e.prototype.getValues = function(t, r) {
      var n = this, i = this._store;
      return N(t) ? i.getValues(ir(t, function(a) {
        return n._getStoreDimIndex(a);
      }), r) : i.getValues(t);
    }, e.prototype.hasValue = function(t) {
      for (var r = this._dimSummary.dataDimIndicesOnCoord, n = 0, i = r.length; n < i; n++)
        if (isNaN(this._store.get(r[n], t)))
          return !1;
      return !0;
    }, e.prototype.indexOfName = function(t) {
      for (var r = 0, n = this._store.count(); r < n; r++)
        if (this.getName(r) === t)
          return r;
      return -1;
    }, e.prototype.getRawIndex = function(t) {
      return this._store.getRawIndex(t);
    }, e.prototype.indexOfRawIndex = function(t) {
      return this._store.indexOfRawIndex(t);
    }, e.prototype.rawIndexOf = function(t, r) {
      var n = t && this._invertedIndicesMap[t], i = n && n[r];
      return i == null || isNaN(i) ? fd : i;
    }, e.prototype.each = function(t, r, n) {
      Z(t) && (n = r, r = t, t = []);
      var i = n || this, a = ir(wi(t), this._getStoreDimIndex, this);
      this._store.each(a, i ? lt(r, i) : r);
    }, e.prototype.filterSelf = function(t, r, n) {
      Z(t) && (n = r, r = t, t = []);
      var i = n || this, a = ir(wi(t), this._getStoreDimIndex, this);
      return this._store = this._store.filter(a, i ? lt(r, i) : r), this;
    }, e.prototype.selectRange = function(t) {
      var r = this, n = {}, i = ft(t);
      return D(i, function(a) {
        var o = r._getStoreDimIndex(a);
        n[o] = t[a];
      }), this._store = this._store.selectRange(n), this;
    }, e.prototype.mapArray = function(t, r, n) {
      Z(t) && (n = r, r = t, t = []), n = n || this;
      var i = [];
      return this.each(t, function() {
        i.push(r && r.apply(this, arguments));
      }, n), i;
    }, e.prototype.map = function(t, r, n, i) {
      var a = n || i || this, o = ir(wi(t), this._getStoreDimIndex, this), s = bi(this);
      return s._store = this._store.map(o, a ? lt(r, a) : r), s;
    }, e.prototype.modify = function(t, r, n, i) {
      var a = n || i || this, o = ir(wi(t), this._getStoreDimIndex, this);
      this._store.modify(o, a ? lt(r, a) : r);
    }, e.prototype.downSample = function(t, r, n, i) {
      var a = bi(this);
      return a._store = this._store.downSample(this._getStoreDimIndex(t), r, n, i), a;
    }, e.prototype.minmaxDownSample = function(t, r) {
      var n = bi(this);
      return n._store = this._store.minmaxDownSample(this._getStoreDimIndex(t), r), n;
    }, e.prototype.lttbDownSample = function(t, r) {
      var n = bi(this);
      return n._store = this._store.lttbDownSample(this._getStoreDimIndex(t), r), n;
    }, e.prototype.getRawDataItem = function(t) {
      return this._store.getRawDataItem(t);
    }, e.prototype.getItemModel = function(t) {
      var r = this.hostModel, n = this.getRawDataItem(t);
      return new yt(n, r, r && r.ecModel);
    }, e.prototype.diff = function(t) {
      var r = this;
      return new UM(t ? t.getStore().getIndices() : [], this.getStore().getIndices(), function(n) {
        return Za(t, n);
      }, function(n) {
        return Za(r, n);
      });
    }, e.prototype.getVisual = function(t) {
      var r = this._visual;
      return r && r[t];
    }, e.prototype.setVisual = function(t, r) {
      this._visual = this._visual || {}, _i(t) ? A(this._visual, t) : this._visual[t] = r;
    }, e.prototype.getItemVisual = function(t, r) {
      var n = this._itemVisuals[t], i = n && n[r];
      return i == null ? this.getVisual(r) : i;
    }, e.prototype.hasItemVisual = function() {
      return this._itemVisuals.length > 0;
    }, e.prototype.ensureUniqueItemVisual = function(t, r) {
      var n = this._itemVisuals, i = n[t];
      i || (i = n[t] = {});
      var a = i[r];
      return a == null && (a = this.getVisual(r), N(a) ? a = a.slice() : _i(a) && (a = A({}, a)), i[r] = a), a;
    }, e.prototype.setItemVisual = function(t, r, n) {
      var i = this._itemVisuals[t] || {};
      this._itemVisuals[t] = i, _i(r) ? A(i, r) : i[r] = n;
    }, e.prototype.clearAllVisual = function() {
      this._visual = {}, this._itemVisuals = [];
    }, e.prototype.setLayout = function(t, r) {
      _i(t) ? A(this._layout, t) : this._layout[t] = r;
    }, e.prototype.getLayout = function(t) {
      return this._layout[t];
    }, e.prototype.getItemLayout = function(t) {
      return this._itemLayouts[t];
    }, e.prototype.setItemLayout = function(t, r, n) {
      this._itemLayouts[t] = n ? A(this._itemLayouts[t] || {}, r) : r;
    }, e.prototype.clearItemLayouts = function() {
      this._itemLayouts.length = 0;
    }, e.prototype.setItemGraphicEl = function(t, r) {
      var n = this.hostModel && this.hostModel.seriesIndex;
      qS(n, this.dataType, t, r), this._graphicEls[t] = r;
    }, e.prototype.getItemGraphicEl = function(t) {
      return this._graphicEls[t];
    }, e.prototype.eachItemGraphicEl = function(t, r) {
      D(this._graphicEls, function(n, i) {
        n && t && t.call(r, n, i);
      });
    }, e.prototype.cloneShallow = function(t) {
      return t || (t = new e(this._schema ? this._schema : ir(this.dimensions, this._getDimInfo, this), this.hostModel)), zu(t, this), t._store = this._store, t;
    }, e.prototype.wrapMethod = function(t, r) {
      var n = this[t];
      Z(n) && (this.__wrappedMethods = this.__wrappedMethods || [], this.__wrappedMethods.push(t), this[t] = function() {
        var i = n.apply(this, arguments);
        return r.apply(this, [i].concat(os(arguments)));
      });
    }, e.internalField = function() {
      hd = function(t) {
        var r = t._invertedIndicesMap;
        D(r, function(n, i) {
          var a = t._dimInfos[i], o = a.ordinalMeta, s = t._store;
          if (o) {
            n = r[i] = new KM(o.categories.length);
            for (var u = 0; u < n.length; u++)
              n[u] = fd;
            for (var u = 0; u < s.count(); u++)
              n[s.get(a.storeDimIndex, u)] = u;
          }
        });
      }, Si = function(t, r, n) {
        return Se(t._getCategory(r, n), null);
      }, Za = function(t, r) {
        var n = t._idList[r];
        return n == null && t._idDimIdx != null && (n = Si(t, t._idDimIdx, r)), n == null && (n = QM + r), n;
      }, wi = function(t) {
        return N(t) || (t = t != null ? [t] : []), t;
      }, bi = function(t) {
        var r = new e(t._schema ? t._schema : ir(t.dimensions, t._getDimInfo, t), t.hostModel);
        return zu(r, t), r;
      }, zu = function(t, r) {
        D(JM.concat(r.__wrappedMethods || []), function(n) {
          r.hasOwnProperty(n) && (t[n] = r[n]);
        }), t.__wrappedMethods = r.__wrappedMethods, D(jM, function(n) {
          t[n] = $(r[n]);
        }), t._calculationInfo = A({}, r._calculationInfo);
      }, Vu = function(t, r) {
        var n = t._nameList, i = t._idList, a = t._nameDimIdx, o = t._idDimIdx, s = n[r], u = i[r];
        if (s == null && a != null && (n[r] = s = Si(t, a, r)), u == null && o != null && (i[r] = u = Si(t, o, r)), u == null && s != null) {
          var l = t._nameRepeatCount, h = l[s] = (l[s] || 0) + 1;
          u = s, h > 1 && (u += "__ec__" + h), i[r] = u;
        }
      };
    }(), e;
  }()
);
function tD(e, t) {
  return Mh(e, t).dimensions;
}
function Mh(e, t) {
  sh(e) || (e = uh(e)), t = t || {};
  var r = t.coordDimensions || [], n = t.dimensionsDefine || e.dimensionsDefine || [], i = V(), a = [], o = eD(e, r, n, t.dimensionsCount), s = t.canOmitUnusedDimensions && vm(o), u = n === e.dimensionsDefine, l = u ? hm(e) : fm(n), h = t.encodeDefine;
  !h && t.encodeDefaulter && (h = t.encodeDefaulter(e, o));
  for (var f = V(h), v = new Ty(o), c = 0; c < v.length; c++)
    v[c] = -1;
  function d(T) {
    var I = v[T];
    if (I < 0) {
      var x = n[T], E = F(x) ? x : {
        name: x
      }, L = new Mo(), R = E.name;
      R != null && l.get(R) != null && (L.name = L.displayName = R), E.type != null && (L.type = E.type), E.displayName != null && (L.displayName = E.displayName);
      var k = a.length;
      return v[T] = k, L.storeDimIndex = T, a.push(L), L;
    }
    return a[I];
  }
  if (!s)
    for (var c = 0; c < o; c++)
      d(c);
  f.each(function(T, I) {
    var x = zt(T).slice();
    if (x.length === 1 && !G(x[0]) && x[0] < 0) {
      f.set(I, !1);
      return;
    }
    var E = f.set(I, []);
    D(x, function(L, R) {
      var k = G(L) ? l.get(L) : L;
      k != null && k < o && (E[R] = k, p(d(k), I, R));
    });
  });
  var y = 0;
  D(r, function(T) {
    var I, x, E, L;
    if (G(T))
      I = T, L = {};
    else {
      L = T, I = L.name;
      var R = L.ordinalMeta;
      L.ordinalMeta = null, L = A({}, L), L.ordinalMeta = R, x = L.dimsDef, E = L.otherDims, L.name = L.coordDim = L.coordDimIndex = L.dimsDef = L.otherDims = null;
    }
    var k = f.get(I);
    if (k !== !1) {
      if (k = zt(k), !k.length)
        for (var O = 0; O < (x && x.length || 1); O++) {
          for (; y < o && d(y).coordDim != null; )
            y++;
          y < o && k.push(y++);
        }
      D(k, function(U, Q) {
        var q = d(U);
        if (u && L.type != null && (q.type = L.type), p(mt(q, L), I, Q), q.name == null && x) {
          var J = x[Q];
          !F(J) && (J = {
            name: J
          }), q.name = q.displayName = J.name, q.defaultTooltip = J.defaultTooltip;
        }
        E && mt(q.otherDims, E);
      });
    }
  });
  function p(T, I, x) {
    pg.get(I) != null ? T.otherDims[I] = x : (T.coordDim = I, T.coordDimIndex = x, i.set(I, !0));
  }
  var g = t.generateCoord, m = t.generateCoordCount, _ = m != null;
  m = g ? m || 1 : 0;
  var S = g || "value";
  function w(T) {
    T.name == null && (T.name = T.coordDim);
  }
  if (s)
    D(a, function(T) {
      w(T);
    }), a.sort(function(T, I) {
      return T.storeDimIndex - I.storeDimIndex;
    });
  else
    for (var b = 0; b < o; b++) {
      var M = d(b), C = M.coordDim;
      C == null && (M.coordDim = rD(S, i, _), M.coordDimIndex = 0, (!g || m <= 0) && (M.isExtraCoord = !0), m--), w(M), M.type == null && (cy(e, b) === Qt.Must || M.isExtraCoord && (M.otherDims.itemName != null || M.otherDims.seriesName != null)) && (M.type = "ordinal");
    }
  return Mf(a, function(T) {
    return T.name;
  }, function(T, I) {
    I > 0 && (T.name = T.name + (I - 1));
  }), new um({
    source: e,
    dimensions: a,
    fullDimensionCount: o,
    dimensionOmitted: s
  });
}
function eD(e, t, r, n) {
  var i = Math.max(e.dimensionsDetectedCount || 1, t.length, r.length, n || 0);
  return D(t, function(a) {
    var o;
    F(a) && (o = a.dimsDef) && (i = Math.max(i, o.length));
  }), i;
}
function rD(e, t, r) {
  if (r || t.hasKey(e)) {
    for (var n = 0; t.hasKey(e + n); )
      n++;
    e += n;
  }
  return t.set(e, !0), e;
}
var nD = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      this.coordSysDims = [], this.axisMap = V(), this.categoryAxisMap = V(), this.coordSysName = t;
    }
    return e;
  }()
);
function iD(e) {
  var t = e.get("coordinateSystem"), r = new nD(t), n = aD[t];
  if (n)
    return n(e, r, r.axisMap, r.categoryAxisMap), r;
}
var aD = {
  cartesian2d: function(e, t, r, n) {
    var i = e.getReferringComponents("xAxis", sr).models[0], a = e.getReferringComponents("yAxis", sr).models[0];
    t.coordSysDims = ["x", "y"], r.set("x", i), r.set("y", a), Rn(i) && (n.set("x", i), t.firstCategoryDimIndex = 0), Rn(a) && (n.set("y", a), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = 1));
  },
  singleAxis: function(e, t, r, n) {
    var i = e.getReferringComponents("singleAxis", sr).models[0];
    t.coordSysDims = ["single"], r.set("single", i), Rn(i) && (n.set("single", i), t.firstCategoryDimIndex = 0);
  },
  polar: function(e, t, r, n) {
    var i = e.getReferringComponents("polar", sr).models[0], a = i.findAxisModel("radiusAxis"), o = i.findAxisModel("angleAxis");
    t.coordSysDims = ["radius", "angle"], r.set("radius", a), r.set("angle", o), Rn(a) && (n.set("radius", a), t.firstCategoryDimIndex = 0), Rn(o) && (n.set("angle", o), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = 1));
  },
  geo: function(e, t, r, n) {
    t.coordSysDims = ["lng", "lat"];
  },
  parallel: function(e, t, r, n) {
    var i = e.ecModel, a = i.getComponent("parallel", e.get("parallelIndex")), o = t.coordSysDims = a.dimensions.slice();
    D(a.parallelAxisIndex, function(s, u) {
      var l = i.getComponent("parallelAxis", s), h = o[u];
      r.set(h, l), Rn(l) && (n.set(h, l), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = u));
    });
  },
  matrix: function(e, t, r, n) {
    var i = e.getReferringComponents("matrix", sr).models[0];
    t.coordSysDims = ["x", "y"];
    var a = i.getDimensionModel("x"), o = i.getDimensionModel("y");
    r.set("x", a), r.set("y", o), n.set("x", a), n.set("y", o);
  }
};
function Rn(e) {
  return e.get("type") === "category";
}
function cm(e, t, r) {
  r = r || {};
  var n = r.byIndex, i = r.stackedCoordDimension, a, o, s;
  oD(t) ? a = t : (o = t.schema, a = o.dimensions, s = t.store);
  var u = !!(e && e.get("stack")), l, h, f, v, c = !0;
  function d(S) {
    return S.type !== "ordinal" && S.type !== "time";
  }
  if (D(a, function(S, w) {
    G(S) && (a[w] = S = {
      name: S
    }), d(S) || (c = !1);
  }), D(a, function(S, w) {
    u && !S.isExtraCoord && (!n && !l && S.ordinalMeta && (l = S), !h && d(S) && (!c || S.coordDim !== "x" && S.coordDim !== "angle") && (!i || i === S.coordDim) && (h = S));
  }), h && !n && !l && (n = !0), h) {
    f = "__\0ecstackresult_" + e.id, v = "__\0ecstackedover_" + e.id, l && (l.createInvertedIndices = !0);
    var y = h.coordDim, p = h.type, g = 0;
    D(a, function(S) {
      S.coordDim === y && g++;
    });
    var m = {
      name: f,
      coordDim: y,
      coordDimIndex: g,
      type: p,
      isExtraCoord: !0,
      isCalculationCoord: !0,
      storeDimIndex: a.length
    }, _ = {
      name: v,
      // This dimension contains stack base (generally, 0), so do not set it as
      // `stackedDimCoordDim` to avoid extent calculation, consider log scale.
      coordDim: v,
      coordDimIndex: g + 1,
      type: p,
      isExtraCoord: !0,
      isCalculationCoord: !0,
      storeDimIndex: a.length + 1
    };
    o ? (s && (m.storeDimIndex = s.ensureCalculationDimension(v, p), _.storeDimIndex = s.ensureCalculationDimension(f, p)), o.appendCalculationDimension(m), o.appendCalculationDimension(_)) : (a.push(m), a.push(_));
  }
  return {
    stackedDimension: h && h.name,
    stackedByDimension: l && l.name,
    isStackedByIndex: n,
    stackedOverDimension: v,
    stackResultDimension: f
  };
}
function oD(e) {
  return !lm(e.schema);
}
function dm(e, t) {
  return !!t && t === e.getCalculationInfo("stackedDimension");
}
function sD(e, t) {
  return dm(e, t) ? e.getCalculationInfo("stackResultDimension") : t;
}
function uD(e, t) {
  var r = e.get("coordinateSystem"), n = ga.get(r), i;
  return t && t.coordSysDims && (i = z(t.coordSysDims, function(a) {
    var o = {
      name: a
    }, s = t.axisMap.get(a);
    if (s) {
      var u = s.get("type");
      o.type = XM(u);
    }
    return o;
  })), i || (i = n && (n.getDimensionsInfo ? n.getDimensionsInfo() : n.dimensions.slice()) || ["x", "y"]), i;
}
function lD(e, t, r) {
  var n, i;
  return r && D(e, function(a, o) {
    var s = a.coordDim, u = r.categoryAxisMap.get(s);
    u && (n == null && (n = o), a.ordinalMeta = u.getOrdinalMeta(), t && (a.createInvertedIndices = !0)), a.otherDims.itemName != null && (i = !0);
  }), !i && n != null && (e[n].otherDims.itemName = 0), n;
}
function pm(e, t, r) {
  r = r || {};
  var n = t.getSourceManager(), i, a = !1;
  e ? (a = !0, i = uh(e)) : (i = n.getSource(), a = i.sourceFormat === re);
  var o = iD(t), s = uD(t, o), u = r.useEncodeDefaulter, l = Z(u) ? u : u ? Je(uT, s, t) : null, h = {
    coordDimensions: s,
    generateCoord: r.generateCoord,
    encodeDefine: t.getEncode(),
    encodeDefaulter: l,
    canOmitUnusedDimensions: !a
  }, f = Mh(i, h), v = lD(f.dimensions, r.createInvertedIndices, o), c = a ? null : n.getSharedDataStore(f), d = cm(t, {
    schema: f,
    store: c
  }), y = new oa(f, t);
  y.setCalculationInfo(d);
  var p = v != null && fD(i) ? function(g, m, _, S) {
    return S === v ? _ : this.defaultDimValueGetter(g, m, _, S);
  } : null;
  return y.hasItemOption = !1, y.initData(
    // Try to reuse the data store in sourceManager if using dataset.
    a ? i : c,
    null,
    p
  ), y;
}
function fD(e) {
  if (e.sourceFormat === re) {
    var t = hD(e.data || []);
    return !N(va(t));
  }
}
function hD(e) {
  for (var t = 0; t < e.length && e[t] == null; )
    t++;
  return e[t];
}
var De = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.isBlank = function() {
      return this._isBlank;
    }, e.prototype.setBlank = function(t) {
      this._isBlank = t;
    }, e;
  }()
);
gs(De);
var vD = 0, vd = (
  /** @class */
  function() {
    function e(t) {
      this.categories = t.categories || [], this._needCollect = t.needCollect, this._deduplication = t.deduplication, this.uid = ++vD, this._onCollect = t.onCollect;
    }
    return e.createByAxisModel = function(t) {
      var r = t.option, n = r.data, i = n && z(n, cD);
      return new e({
        categories: i,
        needCollect: !i,
        // deduplication is default in axis.
        deduplication: r.dedplication !== !1
      });
    }, e.prototype.getOrdinal = function(t) {
      return this._getOrCreateMap().get(t);
    }, e.prototype.parseAndCollect = function(t) {
      var r, n = this._needCollect;
      if (!G(t) && !n)
        return t;
      if (n && !this._deduplication)
        return r = this.categories.length, this.categories[r] = t, this._onCollect && this._onCollect(t, r), r;
      var i = this._getOrCreateMap();
      return r = i.get(t), r == null && (n ? (r = this.categories.length, this.categories[r] = t, i.set(t, r), this._onCollect && this._onCollect(t, r)) : r = NaN), r;
    }, e.prototype._getOrCreateMap = function() {
      return this._map || (this._map = V(this.categories));
    }, e;
  }()
);
function cD(e) {
  return F(e) && e.value != null ? e.value : e + "";
}
var me = 0, nf = 1, dD = {
  needTransform: 1,
  normalize: 1,
  scale: 1,
  transformIn: 1,
  transformOut: 1,
  contain: 1,
  getExtent: 1,
  getExtentUnsafe: 1,
  setExtent: 1,
  setExtent2: 1,
  getFilter: 1,
  sanitize: 1,
  getDefaultStartValue: 1,
  freeze: 1
}, pD = ft(dD), es = 2, gm = 3;
function Dh(e, t, r) {
  var n;
  return e = e || {}, yD(e, r), {
    brk: n,
    mapper: e
  };
}
function ym(e, t) {
  D(pD, function(r) {
    e[r] = t[r];
  });
}
function mm(e, t) {
  e.freeze = St;
}
function sa(e) {
  return e.getExtentUnsafe(me, es);
}
function _m(e, t) {
  return e.getExtentUnsafe(nf, t) || e.getExtentUnsafe(me, t);
}
function gD(e) {
  var t = _m(e, gm);
  return t[1] - t[0];
}
function As(e) {
  var t = e.getExtentUnsafe(me, gm);
  return t[1] - t[0];
}
function yD(e, t) {
  var r = e || {}, n = [];
  return r._extents = n, n[me] = t ? t.slice() : Ke(), A(r, mD), r;
}
var mD = {
  needTransform: function() {
    return !1;
  },
  normalize: function(e) {
    var t = this._extents[nf] || this._extents[me];
    return t[1] === t[0] ? 0.5 : (e - t[0]) / (t[1] - t[0]);
  },
  scale: function(e) {
    var t = this._extents[nf] || this._extents[me];
    return e * (t[1] - t[0]) + t[0];
  },
  transformIn: function(e) {
    return e;
  },
  transformOut: function(e) {
    return e;
  },
  contain: function(e) {
    var t = _m(this, null);
    return e >= t[0] && e <= t[1];
  },
  getExtent: function() {
    return this._extents[me].slice();
  },
  getExtentUnsafe: function(e) {
    return this._extents[e];
  },
  setExtent: function(e, t) {
    cd(this._extents, me, e, t);
  },
  setExtent2: function(e, t, r) {
    var n = this._extents;
    n[e] || (n[e] = n[me].slice()), cd(n, e, t, r);
  },
  freeze: function() {
  }
};
function cd(e, t, r, n) {
  Fo(r, n) && (e[t][0] = r, e[t][1] = n);
}
function af(e) {
  return e.type === "interval";
}
function Sm(e) {
  return e.type === "time";
}
function Ih(e) {
  return e.type === "log";
}
function si(e) {
  return e.type === "ordinal";
}
function ya(e) {
  return ji(e) + 2;
}
function qa(e, t) {
  return Qi(e) / Qi(t);
}
function Hu(e, t, r) {
  var n = r && r.lookup;
  if (n) {
    for (var i = 0; i < n.from.length; i++)
      if (e === n.from[i])
        return n.to[i];
  }
  return ai(t, e);
}
function _D(e, t, r) {
  var n = e.slice();
  if (n[0] === n[1]) {
    var i = r && r.ctnShp;
    if (n[0] !== 0) {
      var a = cs(n[0]);
      t[1] || (n[1] += a / 2), n[0] -= a / 2;
    } else
      i && (n[0] = -1), n[1] = 1;
  }
  return (!wr(n[0]) || !wr(n[1])) && (n[0] = 0, n[1] = 1), n[1] < n[0] && n.reverse(), n;
}
function SD(e, t) {
  return [e[0] !== t[0], e[1] !== t[1]];
}
function xh(e, t) {
  return e = e || t, Sr(Zt(e, 1));
}
function wm(e, t, r) {
  var n = sa(e), i = n[0], a = e.count(), o = Math.max((t || 0) + 1, 1);
  i !== 0 && o > 1 && a / o > 2 && (i = Math.round(Math.ceil(i / o) * o)), i !== n[0] && u(n[0], !0, !0);
  for (var s = i; s <= n[1]; s += o)
    u(s, !1, s === n[0] || s === n[1]);
  s - o !== n[1] && u(n[1], !0, !0);
  function u(l, h, f) {
    r({
      value: l,
      offInterval: h
    }, f);
  }
}
var bm = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r) {
      var n = e.call(this) || this;
      n.type = "ordinal", n.parse = t.parse, ym(n, t.decoratedMethods);
      var i = r.ordinalMeta;
      i || (i = new vd({})), N(i) && (i = new vd({
        categories: z(i, function(o) {
          return F(o) ? o.value : o;
        })
      })), n._ordinalMeta = i;
      var a = Dh(
        null,
        null,
        // Do not support break in OrdinalScale yet.
        r.extent || [0, i.categories.length - 1]
      );
      return n._mapper = a.mapper, mm(n), n;
    }
    return t.parse = function(r) {
      return r == null ? r = NaN : G(r) ? (r = this._ordinalMeta.getOrdinal(r), r == null && (r = NaN)) : r = Sr(r), r;
    }, t.prototype.getTicks = function() {
      var r = [];
      return wm(this, 0, function(n) {
        r.push(n);
      }), r;
    }, t.prototype.getMinorTicks = function(r) {
    }, t.prototype.setSortInfo = function(r) {
      if (r == null) {
        this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
        return;
      }
      for (var n = r.ordinalNumbers, i = this._ordinalNumbersByTick = [], a = this._ticksByOrdinalNumber = [], o = 0, s = this._ordinalMeta.categories.length, u = _r(s, n.length); o < u; ++o) {
        var l = i[o] = n[o];
        a[l] = o;
      }
      for (var h = 0; o < s; ++o) {
        for (; a[h] != null; )
          h++;
        i[o] = h, a[h] = o;
      }
    }, t.prototype._getTickNumber = function(r) {
      var n = this._ticksByOrdinalNumber;
      return n && r >= 0 && r < n.length ? n[r] : r;
    }, t.prototype.getRawOrdinalNumber = function(r) {
      var n = this._ordinalNumbersByTick;
      return n && r >= 0 && r < n.length ? n[r] : r;
    }, t.prototype.getLabel = function(r) {
      if (!this.isBlank()) {
        var n = this.getRawOrdinalNumber(r.value), i = this._ordinalMeta.categories[n];
        return i == null ? "" : i + "";
      }
    }, t.prototype.count = function() {
      var r = sa(this._mapper);
      return r[1] - r[0] + 1;
    }, t.prototype.getOrdinalMeta = function() {
      return this._ordinalMeta;
    }, t.type = "ordinal", t.decoratedMethods = {
      needTransform: function() {
        return this._mapper.needTransform();
      },
      contain: function(r) {
        return this._mapper.contain(this._getTickNumber(r)) && r >= 0 && r < this._ordinalMeta.categories.length;
      },
      normalize: function(r) {
        return this._mapper.normalize(this._getTickNumber(r));
      },
      scale: function(r) {
        return this.getRawOrdinalNumber(Sr(this._mapper.scale(r)));
      },
      transformIn: function(r, n) {
        return this._mapper.transformIn(this._getTickNumber(r), n);
      },
      transformOut: function(r, n) {
        return this.getRawOrdinalNumber(this._mapper.transformOut(r, n));
      },
      getExtent: function() {
        return this._mapper.getExtent();
      },
      getExtentUnsafe: function(r, n) {
        return this._mapper.getExtentUnsafe(r, n);
      },
      /**
       * NOTICE: OrdinalScale extent should always originates from
       * `[0, ordinalMeta.categories.length - 1]`, regardless of min/max of `series.data`.
       * But settings like `xxxAxis.min/max` can still modify the extent.
       * It is handled by constructor of `ScaleRawExtentInfo`.
       */
      setExtent: function(r, n) {
        return this._mapper.setExtent(r, n);
      },
      setExtent2: function(r, n, i) {
        return this._mapper.setExtent2(r, n, i);
      }
    }, t;
  }(De)
);
De.registerClass(bm);
function Lh(e, t, r, n) {
  for (var i = e.getTicks({
    expandToNicedExtent: !0
  }), a = [], o = e.getExtent(), s = 1; s < i.length; s++) {
    var u = i[s], l = i[s - 1];
    if (!(l.break || u.break)) {
      for (var h = 0, f = [], v = u.value - l.value, c = v / t, d = ya(c); h < t - 1; ) {
        var y = xt(l.value + (h + 1) * c, d);
        y > o[0] && y < o[1] && f.push(y), h++;
      }
      var p = xs();
      p && p.pruneTicksByBreak("auto", f, r, function(g) {
        return g;
      }, n, o), a.push(f);
    }
  }
  return a;
}
var Xn = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r) {
      var n = e.call(this) || this;
      n.type = "interval", n.parse = t.parse, r = r || {};
      var i = qg(n, r), a = Dh(n, i, null);
      return n.brk = a.brk, n._cfg = {
        interval: 0,
        intervalPrecision: 2,
        intervalCount: void 0,
        niceExtent: void 0
      }, n;
    }
    return t.parse = function(r) {
      return r == null || r === "" ? NaN : Number(r);
    }, t.prototype.getConfig = function() {
      return $(this._cfg);
    }, t.prototype.setConfig = function(r) {
      var n = sa(this);
      this._cfg = r = $(r), r.niceExtent == null && (r.niceExtent = n.slice()), r.intervalPrecision == null && (r.intervalPrecision = ya(r.interval));
    }, t.prototype.getTicks = function(r) {
      r = r || {};
      var n = this._cfg, i = n.interval, a = sa(this), o = n.niceExtent, s = n.intervalPrecision, u = xs(), l = this.brk, h = u, f = [];
      if (!i)
        return f;
      r.breakTicks;
      var v = 3e3;
      a[0] < o[0] && f.push({
        value: r.expandToNicedExtent ? xt(o[0] - i, s) : a[0]
      });
      for (var c = function(_, S) {
        return Sr((S - _) / i);
      }, d = n.intervalCount, y = o[0], p = 0; ; p++) {
        if (d == null) {
          if (y > o[1] || !isFinite(y) || !isFinite(o[1]))
            break;
        } else {
          if (p > d)
            break;
          y = _r(y, o[1]), p === d && (y = o[1]);
        }
        if (f.push({
          value: y
        }), y = xt(y + i, s), l) {
          var g = l.calcNiceTickMultiple(y, c);
          g >= 0 && (y = xt(y + g * i, s));
        }
        if (f.length > 0 && y === f[f.length - 1].value)
          break;
        if (f.length > v)
          return [];
      }
      var m = f.length ? f[f.length - 1].value : o[1];
      return a[1] > m && f.push({
        value: r.expandToNicedExtent ? xt(m + i, s) : a[1]
      }), f;
    }, t.prototype.getMinorTicks = function(r) {
      return Lh(this, r, Zf(this), this._cfg.interval);
    }, t.prototype.getLabel = function(r, n) {
      if (r == null)
        return "";
      var i = n && n.precision;
      i == null ? i = ji(r.value) || 0 : i === "auto" && (i = this._cfg.intervalPrecision);
      var a = xt(r.value, i, !0);
      return ny(a);
    }, t.type = "interval", t;
  }(De)
);
De.registerClass(Xn);
var wD = function(e, t, r, n) {
  for (; r < n; ) {
    var i = r + n >>> 1;
    e[i][1] < t ? r = i + 1 : n = i;
  }
  return r;
}, Tm = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r) {
      var n = e.call(this) || this;
      n.type = "time", n.parse = t.parse, n._locale = r.locale, n._useUTC = r.useUTC, n._interval = 0;
      var i = qg(n, r), a = Dh(n, i, null);
      return n.brk = a.brk, n;
    }
    return t.prototype.getLabel = function(r) {
      return Qf(r.value, uc[Nb(Gi(this._minLevelUnit))] || uc.second, this._useUTC, this._locale);
    }, t.prototype.getFormattedLabel = function(r, n, i) {
      return Bb(r, n, i, this._locale, this._useUTC);
    }, t.prototype.getTicks = function(r) {
      var n = this._interval, i = sa(this), a = this.brk, o = [];
      if (!n)
        return o;
      var s = this._useUTC;
      o = LD(this._minLevelUnit, this._approxInterval, s, i, As(this), a);
      var u = on.length - 1, l = 0;
      return D(o, function(h) {
        h.time && (u = Math.min(u, at(on, h.time.upperTimeUnit)), l = Math.max(l, h.time.level));
      }), o;
    }, t.prototype.getMinorTicks = function(r) {
      return Lh(this, r, Zf(this), this._interval);
    }, t.prototype.setTimeInterval = function(r) {
      this._interval = r.interval, this._approxInterval = r.approxInterval, this._minLevelUnit = r.minLevelUnit;
    }, t.parse = function(r) {
      return pt(r) ? Math.round(r) : +Cr(r);
    }, t.type = "time", t;
  }(De)
), Ka = [
  // Format                           interval
  ["second", qf],
  ["minute", Kf],
  ["hour", Hi],
  ["quarter-day", Hi * 6],
  ["half-day", Hi * 12],
  ["day", le * 1.2],
  ["half-week", le * 3.5],
  ["week", le * 7],
  ["month", le * 31],
  ["quarter", le * 95],
  ["half-year", sc / 2],
  ["year", sc]
  // 1Y
];
function bD(e, t, r, n) {
  return Yo(new Date(t), e, n).getTime() === Yo(new Date(r), e, n).getTime();
}
function TD(e, t) {
  return e /= le, e > 16 ? 16 : e > 7.5 ? 7 : e > 3.5 ? 4 : e > 1.5 ? 2 : 1;
}
function CD(e) {
  var t = 30 * le;
  return e /= t, e > 6 ? 6 : e > 3 ? 3 : e > 2 ? 2 : 1;
}
function MD(e) {
  return e /= Hi, e > 12 ? 12 : e > 6 ? 6 : e > 3.5 ? 4 : e > 2 ? 2 : 1;
}
function dd(e, t) {
  return e /= t ? Kf : qf, e > 30 ? 30 : e > 20 ? 20 : e > 15 ? 15 : e > 10 ? 10 : e > 5 ? 5 : e > 2 ? 2 : 1;
}
function DD(e) {
  return Zt(Cf(e, !0), 1);
}
function ID(e, t, r) {
  var n = Math.max(0, at(on, t) - 1);
  return Yo(new Date(e), on[n], r).getTime();
}
function xD(e, t) {
  var r = /* @__PURE__ */ new Date(0);
  r[e](1);
  var n = r.getTime();
  r[e](1 + t);
  var i = r.getTime() - n;
  return function(a, o) {
    return Math.max(0, Math.round((o - a) / i));
  };
}
function LD(e, t, r, n, i, a) {
  var o = 3e3, s = Pb, u = 0;
  function l(O, U, Q, q, J, rt, et) {
    for (var ot = xD(J, O), X = U, nt = new Date(X); X < Q && X <= n[1] && (et.push({
      value: X
    }), !(u++ > o)); )
      if (nt[J](nt[q]() + O), X = nt.getTime(), a) {
        var ht = a.calcNiceTickMultiple(X, ot);
        ht > 0 && (nt[J](nt[q]() + ht * O), X = nt.getTime());
      }
    et.push({
      value: X,
      // extent[1] should be added; deduplication will be performed later.
      notAdd: X > n[1]
    });
  }
  function h(O, U, Q) {
    var q = [], J = !U.length;
    if (!bD(Gi(O), n[0], n[1], r)) {
      J && (U = [{
        value: ID(n[0], O, r)
      }, {
        value: n[1]
      }]);
      for (var rt = 0; rt < U.length - 1; rt++) {
        var et = U[rt].value, ot = U[rt + 1].value;
        if (et !== ot) {
          var X = void 0, nt = void 0, ht = void 0, qt = !1;
          switch (O) {
            case "year":
              X = Math.max(1, Math.round(t / le / 365)), nt = Kg(r), ht = Fb(r);
              break;
            case "half-year":
            case "quarter":
            case "month":
              X = CD(t), nt = Jf(r), ht = Qg(r);
              break;
            case "week":
            case "half-week":
            case "day":
              X = TD(t), nt = jf(r), ht = Jg(r), qt = !0;
              break;
            case "half-day":
            case "quarter-day":
            case "hour":
              X = MD(t), nt = th(r), ht = jg(r);
              break;
            case "minute":
              X = dd(t, !0), nt = eh(r), ht = ty(r);
              break;
            case "second":
              X = dd(t, !1), nt = rh(r), ht = ey(r);
              break;
            case "millisecond":
              X = DD(t), nt = nh(r), ht = ry(r);
              break;
          }
          ot >= n[0] && et <= n[1] && l(X, et, ot, nt, ht, qt, q), O === "year" && Q.length > 1 && rt === 0 && Q.unshift({
            value: Q[0].value - X
          });
        }
      }
      for (var rt = 0; rt < q.length; rt++)
        Q.push(q[rt]);
    }
  }
  for (var f = [], v = [], c = 0, d = 0, y = 0; y < s.length; ++y) {
    var p = Gi(s[y]);
    if (kb(s[y])) {
      h(s[y], f[f.length - 1] || [], v);
      var g = s[y + 1] ? Gi(s[y + 1]) : null;
      if (p !== g) {
        if (v.length) {
          d = c, v.sort(function(O, U) {
            return O.value - U.value;
          });
          for (var m = [], _ = 0; _ < v.length; ++_) {
            var S = v[_].value;
            (_ === 0 || v[_ - 1].value !== S) && (m.push(v[_]), S >= n[0] && S <= n[1] && c++);
          }
          var w = i / t;
          if (c > w * 1.5 && d > w / 1.5 || (f.push(m), c > w || e === s[y]))
            break;
        }
        v = [];
      }
    }
  }
  for (var b = It(z(f, function(O) {
    return It(O, function(U) {
      return U.value >= n[0] && U.value <= n[1] && !U.notAdd;
    });
  }), function(O) {
    return O.length > 0;
  }), M = b.length - 1, C = [], y = 0; y < b.length; ++y)
    for (var T = b[y], I = 0; I < T.length; ++I) {
      var x = So(T[I].value, r);
      C.push({
        value: T[I].value,
        time: {
          level: M - y,
          upperTimeUnit: x,
          lowerTimeUnit: x
        }
      });
    }
  Mf(C, Y1, null), C.sort(function(O, U) {
    return O.value - U.value;
  });
  var E = C[0], L = C[C.length - 1], R = So(n[0], r), k = So(n[1], r);
  return (!E || E.value > n[0]) && C.unshift({
    value: n[0],
    time: {
      level: 0,
      upperTimeUnit: R,
      lowerTimeUnit: R
    },
    notNice: !0
  }), (!L || L.value < n[1]) && C.push({
    value: n[1],
    time: {
      level: 0,
      upperTimeUnit: k,
      lowerTimeUnit: k
    },
    notNice: !0
  }), C;
}
var ED = function(e, t) {
  var r = e.getExtent();
  if (r[0] === r[1] && (r[0] -= le, r[1] += le), r[1] === -1 / 0 && r[0] === 1 / 0) {
    var n = /* @__PURE__ */ new Date();
    r[1] = +new Date(n.getFullYear(), n.getMonth(), n.getDate()), r[0] = r[1] - le;
  }
  e.setExtent(r[0], r[1]);
  var i = xh(t.splitNumber, 10), a = As(e) / i, o = t.minInterval, s = t.maxInterval;
  o != null && a < o && (a = o), s != null && a > s && (a = s);
  var u = Ka.length, l = Math.min(wD(Ka, a, 0, u), u - 1), h = Ka[l][1], f = Ka[Math.max(l - 1, 0)][0];
  e.setTimeInterval({
    approxInterval: a,
    interval: h,
    minLevelUnit: f
  });
};
De.registerClass(Tm);
var Qa = 0, Ja = 1, Cm = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r) {
      var n = e.call(this) || this;
      n.type = "log", n.parse = Xn.parse, n.base = r.logBase || 10;
      var i = [], a = [];
      n._lookup = {
        from: i,
        to: a
      }, i[Qa] = i[Ja] = a[Qa] = a[Ja] = NaN, ym(n, t.mapperMethods), r.breakOption;
      var o = {};
      return n.powStub = new Xn({
        breakParsed: o.original
      }), n.intervalStub = new Xn({
        breakParsed: o.transformed
      }), mm(n, n.intervalStub), n;
    }
    return t.prototype.getTicks = function(r) {
      var n = this.base, i = this.powStub, a = this.intervalStub, o = a.getExtent(), s = i.getExtent(), u = {
        lookup: {
          from: o,
          to: s
        }
      };
      return z(a.getTicks(r || {}), function(l) {
        var h = l.value, f = Hu(h, n, u), v;
        return {
          value: f,
          break: v
        };
      }, this);
    }, t.prototype.getMinorTicks = function(r) {
      return Lh(
        this,
        r,
        Zf(this.powStub),
        // NOTE: minor ticks are in the log scale value to visually hint users "logarithm".
        this.intervalStub.getConfig().interval
      );
    }, t.prototype.getLabel = function(r, n) {
      return this.intervalStub.getLabel(r, n);
    }, t.type = "log", t.mapperMethods = {
      needTransform: function() {
        return !0;
      },
      normalize: function(r) {
        return this.intervalStub.normalize(qa(r, this.base));
      },
      scale: function(r) {
        return Hu(this.intervalStub.scale(r), this.base, null);
      },
      transformIn: function(r, n) {
        return r = qa(r, this.base), n && n.depth === es ? r : this.intervalStub.transformIn(r, n);
      },
      transformOut: function(r, n) {
        var i = n ? n.depth : null;
        return pd.depth = i, gd.lookup = this._lookup, Hu(i === es ? r : this.intervalStub.transformOut(r, pd), this.base, gd);
      },
      contain: function(r) {
        return this.powStub.contain(r);
      },
      /**
       * NOTICE: The caller should ensure `start` and `end` are both non-negative.
       */
      setExtent: function(r, n) {
        this.setExtent2(me, r, n);
      },
      setExtent2: function(r, n, i) {
        if (!(!Fo(n, i) || n <= 0 || i <= 0)) {
          var a = yd, o = yd;
          if (r === me) {
            var s = this._lookup;
            a = s.to, o = s.from;
          }
          this.powStub.setExtent2(r, a[Qa] = n, a[Ja] = i);
          var u = this.base;
          this.intervalStub.setExtent2(r, o[Qa] = qa(n, u), o[Ja] = qa(i, u));
        }
      },
      getFilter: function() {
        return {
          g: 0
        };
      },
      sanitize: function(r, n) {
        return Fo(n[0], n[1]) && hn(r) && r <= 0 && (r = n[0]), r;
      },
      getDefaultStartValue: function() {
        return 1;
      },
      getExtent: function() {
        return this.powStub.getExtent();
      },
      getExtentUnsafe: function(r, n) {
        return n === null ? this.powStub.getExtentUnsafe(r, null) : this.intervalStub.getExtentUnsafe(r, n);
      }
    }, t;
  }(De)
);
De.registerClass(Cm);
var pd = {}, gd = {}, yd = [], RD = {
  value: 1,
  category: 1,
  time: 1,
  log: 1
};
ut();
function PD(e) {
  var t = e.get("type");
  return (
    // In ec option, `xxxAxis.type` may be undefined.
    (t == null || !Oe(RD, t) && !De.getClass(t)) && (t = "value"), t
  );
}
function AD(e, t, r) {
  var n;
  switch (t) {
    case "category":
      return new bm({
        ordinalMeta: e.getOrdinalMeta ? e.getOrdinalMeta() : e.getCategories(),
        extent: Ke()
      });
    case "time":
      return new Tm({
        locale: e.ecModel.getLocaleModel(),
        useUTC: e.ecModel.get("useUTC"),
        breakOption: n
      });
    case "log":
      return new Cm({
        logBase: e.get("logBase"),
        breakOption: n
      });
    case "value":
      return new Xn({
        breakOption: n
      });
    default:
      return new (De.getClass(t) || Xn)({});
  }
}
function Os(e) {
  var t = e.getLabelModel().get("formatter");
  if (e.type === "time") {
    var r = Ab(t);
    return function(i, a) {
      return e.scale.getFormattedLabel(i, a, r);
    };
  } else {
    if (G(t))
      return function(i) {
        var a = e.scale.getLabel(i), o = t.replace("{value}", a != null ? a : "");
        return o;
      };
    if (Z(t)) {
      if (e.type === "category")
        return function(i, a) {
          return t(
            md(e, i),
            i.value - e.scale.getExtent()[0],
            null
            // Using `null` just for backward compat.
          );
        };
      var n = xs();
      return function(i, a) {
        var o = null;
        return n && (o = n.makeAxisLabelFormatterParamBreak(o, i.break)), t(md(e, i), a, o);
      };
    } else
      return function(i) {
        return e.scale.getLabel(i);
      };
  }
}
function md(e, t) {
  var r = e.scale;
  return si(r) ? r.getLabel(t) : t.value;
}
function Mm(e) {
  var t = e.get("interval");
  return t == null ? "auto" : t;
}
function OD(e, t, r, n, i, a) {
  var o = Ih(e), s = o ? e.intervalStub : e;
  if (s.setExtent(n[0], n[1]), o) {
    var u = e.powStub, l = {
      depth: es
    }, h = e.transformOut(n[0], l), f = e.transformOut(n[1], l), v = SD(r, n);
    t[0] && !v[0] && (h = i[0]), t[1] && !v[1] && (f = i[1]), u.setExtent(h, f);
  }
  s.setConfig(a);
}
function kD(e, t) {
  return si(e) ? e.getRawOrdinalNumber(t.value) : t.value;
}
var ND = (
  /** @class */
  function() {
    function e() {
    }
    return e.prototype.needIncludeZero = function() {
      return !this.option.scale;
    }, e.prototype.getCoordSysModel = function() {
    }, e;
  }()
), Dm = ut(), BD = -2;
ut();
function FD(e, t) {
  var r = e.model, n = Dm(By(r.ecModel)).keyed, i = n && n.get(t);
  return i && i.get(r.uid);
}
function zD(e, t) {
  return Im(FD(e, t));
}
function VD(e, t) {
  var r = [];
  return HD(e.model.ecModel, function(n) {
    for (var i = 0; i < t.length; i++)
      t[i] && n.serByIdx[t[i].seriesIndex] && r.push(Im(n));
  }), r;
}
function HD(e, t) {
  var r = Dm(By(e)).keyed;
  r && r.each(function(n, i) {
    n.each(function(a, o) {
      t(a, i, o);
    });
  });
}
function Im(e) {
  return {
    liPosMinGap: e ? e.liPosMinGap : void 0
  };
}
V();
ut();
var GD = 3, UD = (
  /** @class */
  function() {
    function e(t, r, n, i, a) {
      var o = si(t), s = o ? r.getCategories().length : null, u;
      if (o) {
        var l = r.getCategories(!0);
        u = l && !l.length;
      }
      var h = n.slice();
      (af(t) || Ih(t) || Sm(t)) && (V1(h, Ti(t, r.get("dataMin", !0))), H1(h, Ti(t, r.get("dataMax", !0)))), G1(h) || (h[0] = h[1] = NaN);
      var f = [], v = [!1, !1], c = r.get("min", !0);
      c === "dataMin" ? (f[0] = h[0], v[0] = !0) : (f[0] = Ti(t, Z(c) ? c({
        min: h[0],
        max: h[1]
      }) : c), v[0] = f[0] != null);
      var d = r.get("max", !0);
      d === "dataMax" ? (f[1] = h[1], v[1] = !0) : (f[1] = Ti(t, Z(d) ? d({
        min: h[0],
        max: h[1]
      }) : d), v[1] = f[1] != null);
      var y = YD(t, r), p = o ? null : h[1] - h[0] || Math.abs(h[0]);
      f[0] == null && (f[0] = o ? u ? h[0] : s ? 0 : NaN : h[0] - y[0] * p), f[1] == null && (f[1] = o ? u ? h[1] : s ? s - 1 : NaN : h[1] + y[1] * p), !wr(f[0]) && (f[0] = NaN), !wr(f[1]) && (f[1] = NaN);
      var g = u || Xi(f[0]) || Xi(f[1]) || o && !s, m = af(t), _ = m && r.needIncludeZero && r.needIncludeZero();
      _ && (f[0] > 0 && f[1] > 0 && !v[0] && (f[0] = 0), f[0] < 0 && f[1] < 0 && !v[1] && (f[1] = 0));
      var S = !1;
      f[0] > f[1] && (f.reverse(), S = !0);
      var w = Ti(t, r.get("startValue", !0)), b = w != null;
      !hn(w) && i && (w = t.getDefaultStartValue ? t.getDefaultStartValue() : 0), hn(w) && (b || !m || _) && (w < f[0] && !v[0] ? (f[0] = w, v[0] = !0) : w > f[1] && !v[1] && (f[1] = w, v[1] = !0));
      var M = this._i = {
        scale: t,
        dataMM: h,
        noZoomEffMM: f,
        zoomMM: [],
        fixMM: v,
        zoomFixMM: [!1, !1],
        startValue: w,
        isBlank: g,
        incl0: _,
        tggAxInv: S,
        ctnShp: a
      };
      _d(M, f);
    }
    return e.prototype.makeNoZoom = function() {
      return this._i.noZoomEffMM.slice();
    }, e.prototype.makeFinal = function() {
      var t = this._i, r = t.zoomMM, n = t.noZoomEffMM, i = t.zoomFixMM, a = t.fixMM, o = {
        fixMM: a,
        zoomFixMM: i,
        isBlank: t.isBlank,
        incl0: t.incl0,
        tggAxInv: t.tggAxInv,
        ctnShp: t.ctnShp,
        effMM: n.slice()
      }, s = o.effMM;
      return r[0] != null && (s[0] = r[0], a[0] = i[0] = !0), r[1] != null && (s[1] = r[1], a[1] = i[1] = !0), _d(t, s), o;
    }, e.prototype.makeRenderInfo = function() {
      return {
        startValue: this._i.startValue
      };
    }, e.prototype.setZoomMM = function(t, r) {
      this._i.zoomMM[t] = r;
    }, e;
  }()
);
function _d(e, t) {
  var r = e.scale, n = e.dataMM;
  r.sanitize && (t[0] = r.sanitize(t[0], n), t[1] = r.sanitize(t[1], n), U1(t));
}
function Ti(e, t) {
  return t == null ? null : Xi(t) ? NaN : e.parse(t);
}
function YD(e, t) {
  var r;
  if (si(e))
    r = [0, 0];
  else {
    var n = t.get("boundaryGap");
    typeof n == "boolean" && (n = null), r = N(n) ? n : [n, n];
  }
  return [Sd(r[0]), Sd(r[1])];
}
function Sd(e) {
  return Kn(typeof e == "boolean" ? 0 : e, 1) || 0;
}
function WD(e, t) {
  var r = e.scale;
  XD(r, new UD(r, e.model, t, !1, !1), GD);
}
function XD(e, t, r) {
  e.rawExtentInfo = t, t.from = r;
}
V();
function $D(e, t, r, n, i) {
  e.rawExtentInfo || WD({
    scale: e,
    model: t
  }, i || Ke());
  var a = e.rawExtentInfo.makeFinal(), o = a.effMM;
  return e.setExtent(o[0], o[1]), e.setBlank(a.isBlank), a;
}
function wd(e, t) {
  var r = Ih(e), n = r ? e.intervalStub : e, i = t.fixMinMax || [], a = r ? e.getExtent() : null, o = n.getExtent(), s = _D(o, i, t.rawExtentResult);
  n.setExtent(s[0], s[1]), s = n.getExtent();
  var u = r ? qD(n, t) : ZD(n, t), l = u.intervalPrecision, h = u.interval, f = t.userInterval;
  f != null && (u.interval = f, u.intervalPrecision = ya(f)), i[0] || (s[0] = xt(pn(s[0] / h) * h, l)), i[1] || (s[1] = xt(wf(s[1] / h) * h, l)), f != null && (u.niceExtent = s.slice()), OD(e, i, o, s, a, u);
}
function ZD(e, t) {
  var r = xh(t.splitNumber, 5), n = As(e), i = t.minInterval, a = t.maxInterval, o = Cf(n / r, !0);
  i != null && o < i && (o = i), a != null && o > a && (o = a);
  var s = ya(o), u = e.getExtent(), l = [xt(wf(u[0] / o) * o, s), xt(pn(u[1] / o) * o, s)];
  return {
    interval: o,
    intervalPrecision: s,
    niceExtent: l
  };
}
function qD(e, t) {
  var r = xh(t.splitNumber, 10), n = e.getExtent(), i = As(e), a = Zt($p(i), 1), o = r / i * a;
  o <= 0.5 && (a *= 10);
  var s = ya(a), u = [xt(wf(n[0] / a) * a, s), xt(pn(n[1] / a) * a, s)];
  return {
    intervalPrecision: s,
    interval: a,
    niceExtent: u
  };
}
function KD(e, t, r, n, i) {
  var a = $D(e, t, n, r, i), o = af(e) || Sm(e);
  QD(e, {
    splitNumber: t.get("splitNumber"),
    fixMinMax: a.fixMM,
    userInterval: t.get("interval"),
    minInterval: o ? t.get("minInterval") : null,
    maxInterval: o ? t.get("maxInterval") : null,
    rawExtentResult: a
  });
}
function QD(e, t) {
  JD[e.type](e, t);
}
var JD = {
  interval: wd,
  log: wd,
  time: ED,
  ordinal: St
};
function jD(e) {
  return pm(null, e);
}
var tI = {
  isDimensionStacked: dm,
  enableDataStack: cm,
  getStackedDimension: sD
};
function eI(e, t) {
  var r = t;
  t instanceof yt || (r = new yt(t));
  var n = PD(r), i = AD(r, n);
  return e[1] < e[0] && (e = e.slice().reverse()), KD(i, r, null, null, e), i;
}
function rI(e) {
  ee(e, ND);
}
function nI(e, t) {
  return t = t || {}, Yl(e, null, null, t.state !== "normal");
}
const iI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDimensions: tD,
  createList: jD,
  createScale: eI,
  createSymbol: Es,
  createTextStyle: nI,
  dataStack: tI,
  enableHoverEmphasis: Eg,
  getECData: Ft,
  getLayoutRect: ih,
  mixinAxisModelCommonMethods: rI
}, Symbol.toStringTag, { value: "Module" }));
var bd = [], aI = {
  registerPreprocessor: Sh,
  registerProcessor: wh,
  registerPostInit: rm,
  registerPostUpdate: nm,
  registerUpdateLifecycle: Ps,
  registerAction: Dr,
  registerCoordinateSystem: im,
  registerLayout: am,
  registerVisual: Ir,
  registerTransform: sm,
  registerLoading: Th,
  registerMap: om,
  registerImpl: FC,
  PRIORITY: $y,
  ComponentModel: it,
  ComponentView: br,
  SeriesModel: be,
  ChartView: we,
  // TODO Use ComponentModel and SeriesModel instead of Constructor
  registerComponentModel: function(e) {
    it.registerClass(e);
  },
  registerComponentView: function(e) {
    br.registerClass(e);
  },
  registerSeriesModel: function(e) {
    be.registerClass(e);
  },
  registerChartView: function(e) {
    we.registerClass(e);
  },
  registerCustomSeries: function(e, t) {
  },
  registerSubTypeDefaulter: function(e, t) {
    it.registerSubTypeDefaulter(e, t);
  },
  registerPainter: function(e, t) {
    Up(e, t);
  }
};
function Eh(e) {
  if (N(e)) {
    D(e, function(t) {
      Eh(t);
    });
    return;
  }
  at(bd, e) >= 0 || (bd.push(e), Z(e) && (e = {
    install: e
  }), e.install(aI));
}
var oI = 1e-8;
function Td(e, t) {
  return Math.abs(e - t) < oI;
}
function Cd(e, t, r) {
  var n = 0, i = e[0];
  if (!i)
    return !1;
  for (var a = 1; a < e.length; a++) {
    var o = e[a];
    n += qe(i[0], i[1], o[0], o[1], t, r), i = o;
  }
  var s = e[0];
  return (!Td(i[0], s[0]) || !Td(i[1], s[1])) && (n += qe(i[0], i[1], s[0], s[1], t, r)), n !== 0;
}
var sI = [];
function Gu(e, t) {
  for (var r = 0; r < e.length; r++)
    fe(e[r], e[r], t);
}
function Md(e, t, r, n) {
  for (var i = 0; i < e.length; i++) {
    var a = e[i];
    n && (a = n.project(a)), a && isFinite(a[0]) && isFinite(a[1]) && (lr(t, t, a), fr(r, r, a));
  }
}
function uI(e) {
  for (var t = 0, r = 0, n = 0, i = e.length, a = e[i - 1][0], o = e[i - 1][1], s = 0; s < i; s++) {
    var u = e[s][0], l = e[s][1], h = a * l - u * o;
    t += h, r += (a + u) * h, n += (o + l) * h, a = u, o = l;
  }
  return t ? [r / t / 3, n / t / 3, t] : [e[0][0] || 0, e[0][1] || 0];
}
var xm = (
  /** @class */
  function() {
    function e(t) {
      this.name = t;
    }
    return e.prototype.setCenter = function(t) {
      this._center = t;
    }, e.prototype.getCenter = function() {
      var t = this._center;
      return t || (t = this._center = this.calcCenter()), t;
    }, e;
  }()
), Dd = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t, r) {
      this.type = "polygon", this.exterior = t, this.interiors = r;
    }
    return e;
  }()
), Id = (
  /** @class */
  /* @__PURE__ */ function() {
    function e(t) {
      this.type = "linestring", this.points = t;
    }
    return e;
  }()
), lI = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r, n, i) {
      var a = e.call(this, r) || this;
      return a.type = "geoJSON", a.geometries = n, a._center = i && [i[0], i[1]], a;
    }
    return t.prototype.calcCenter = function() {
      for (var r = this.geometries, n, i = 0, a = 0; a < r.length; a++) {
        var o = r[a], s = o.exterior, u = s && s.length;
        u > i && (n = o, i = u);
      }
      if (n)
        return uI(n.exterior);
      var l = this.getBoundingRect();
      return [l.x + l.width / 2, l.y + l.height / 2];
    }, t.prototype.getBoundingRect = function(r) {
      var n = this._rect;
      if (n && !r)
        return n;
      var i = [1 / 0, 1 / 0], a = [-1 / 0, -1 / 0], o = this.geometries;
      return D(o, function(s) {
        s.type === "polygon" ? Md(s.exterior, i, a, r) : D(s.points, function(u) {
          Md(u, i, a, r);
        });
      }), isFinite(i[0]) && isFinite(i[1]) && isFinite(a[0]) && isFinite(a[1]) || (i[0] = i[1] = a[0] = a[1] = 0), n = new H(i[0], i[1], a[0] - i[0], a[1] - i[1]), r || (this._rect = n), n;
    }, t.prototype.contain = function(r) {
      var n = this.getBoundingRect(), i = this.geometries;
      if (!n.contain(r[0], r[1]))
        return !1;
      t: for (var a = 0, o = i.length; a < o; a++) {
        var s = i[a];
        if (s.type === "polygon") {
          var u = s.exterior, l = s.interiors;
          if (Cd(u, r[0], r[1])) {
            for (var h = 0; h < (l ? l.length : 0); h++)
              if (Cd(l[h], r[0], r[1]))
                continue t;
            return !0;
          }
        }
      }
      return !1;
    }, t.prototype.transformTo = function(r, n, i, a) {
      var o = this.getBoundingRect(), s = o.width / o.height;
      i ? a || (a = i / s) : i = s * a;
      for (var u = new H(r, n, i, a), l = o.calculateTransform(u), h = this.geometries, f = 0; f < h.length; f++) {
        var v = h[f];
        v.type === "polygon" ? (Gu(v.exterior, l), D(v.interiors, function(c) {
          Gu(c, l);
        })) : D(v.points, function(c) {
          Gu(c, l);
        });
      }
      o = this._rect, o.copy(u), this._center = [o.x + o.width / 2, o.y + o.height / 2];
    }, t.prototype.cloneShallow = function(r) {
      r == null && (r = this.name);
      var n = new t(r, this.geometries, this._center);
      return n._rect = this._rect, n.transformTo = null, n;
    }, t;
  }(xm)
);
(function(e) {
  B(t, e);
  function t(r, n) {
    var i = e.call(this, r) || this;
    return i.type = "geoSVG", i._elOnlyForCalculate = n, i;
  }
  return t.prototype.calcCenter = function() {
    for (var r = this._elOnlyForCalculate, n = r.getBoundingRect(), i = [n.x + n.width / 2, n.y + n.height / 2], a = ri(sI), o = r; o && !o.isGeoSVGGraphicRoot; )
      dr(a, o.getLocalTransform(), a), o = o.parent;
    return ni(a, a), fe(i, i, a), i;
  }, t;
})(xm);
function fI(e) {
  if (!e.UTF8Encoding)
    return e;
  var t = e, r = t.UTF8Scale;
  r == null && (r = 1024);
  var n = t.features;
  return D(n, function(i) {
    var a = i.geometry, o = a.encodeOffsets, s = a.coordinates;
    if (o)
      switch (a.type) {
        case "LineString":
          a.coordinates = Lm(s, o, r);
          break;
        case "Polygon":
          Uu(s, o, r);
          break;
        case "MultiLineString":
          Uu(s, o, r);
          break;
        case "MultiPolygon":
          D(s, function(u, l) {
            return Uu(u, o[l], r);
          });
      }
  }), t.UTF8Encoding = !1, t;
}
function Uu(e, t, r) {
  for (var n = 0; n < e.length; n++)
    e[n] = Lm(e[n], t[n], r);
}
function Lm(e, t, r) {
  for (var n = [], i = t[0], a = t[1], o = 0; o < e.length; o += 2) {
    var s = e.charCodeAt(o) - 64, u = e.charCodeAt(o + 1) - 64;
    s = s >> 1 ^ -(s & 1), u = u >> 1 ^ -(u & 1), s += i, u += a, i = s, a = u, n.push([s / r, u / r]);
  }
  return n;
}
function xd(e, t) {
  return e = fI(e), z(It(e.features, function(r) {
    return r.geometry && r.properties && r.geometry.coordinates.length > 0;
  }), function(r) {
    var n = r.properties, i = r.geometry, a = [];
    switch (i.type) {
      case "Polygon":
        var o = i.coordinates;
        a.push(new Dd(o[0], o.slice(1)));
        break;
      case "MultiPolygon":
        D(i.coordinates, function(u) {
          u[0] && a.push(new Dd(u[0], u.slice(1)));
        });
        break;
      case "LineString":
        a.push(new Id([i.coordinates]));
        break;
      case "MultiLineString":
        a.push(new Id(i.coordinates));
    }
    var s = new lI(n[t || "name"], a, n.cp);
    return s.properties = n, s;
  });
}
const hI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MAX_SAFE_INTEGER: g1,
  asc: bf,
  getPercentWithPrecision: c1,
  getPixelPrecision: v1,
  getPrecision: ji,
  getPrecisionSafe: Xp,
  isNumeric: qp,
  isRadianAroundZero: m1,
  linearMap: Ji,
  nice: Cf,
  numericToNumber: Zp,
  parseDate: Cr,
  parsePercent: jt,
  quantile: w1,
  quantity: $p,
  quantityExponent: Tf,
  reformIntervals: b1,
  remRadian: y1,
  round: h1
}, Symbol.toStringTag, { value: "Module" })), vI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  format: Qf,
  parse: Cr,
  roundTime: Yo
}, Symbol.toStringTag, { value: "Module" })), cI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc: Cs,
  BezierCurve: Ts,
  BoundingRect: H,
  Circle: bs,
  CompoundPath: Vw,
  Ellipse: Of,
  Group: Xt,
  Image: Mr,
  IncrementalDisplayable: $w,
  Line: da,
  LinearGradient: Hw,
  Polygon: Bf,
  Polyline: Ff,
  RadialGradient: Gw,
  Rect: Fe,
  Ring: Nf,
  Sector: kf,
  Text: vn,
  clipPointsByRect: ob,
  clipRectByRect: sb,
  createIcon: ub,
  extendPath: rb,
  extendShape: tb,
  getShapeClass: nb,
  getTransform: ab,
  initProps: Vf,
  makeImage: Vg,
  makePath: Gf,
  mergePath: ib,
  registerShape: Me,
  resizePath: Gg,
  updateProps: pa
}, Symbol.toStringTag, { value: "Module" })), dI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addCommas: ny,
  capitalFirst: Ub,
  encodeHTML: Ro,
  formatTime: Gb,
  formatTpl: ay,
  getTextRect: zb,
  getTooltipMarker: Hb,
  normalizeCssArray: iy,
  toCamelCase: Vb,
  truncateText: aS
}, Symbol.toStringTag, { value: "Module" })), pI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bind: lt,
  clone: $,
  curry: Je,
  defaults: mt,
  each: D,
  extend: A,
  filter: It,
  indexOf: at,
  inherits: gf,
  isArray: N,
  isFunction: Z,
  isObject: F,
  isString: G,
  map: z,
  merge: ct,
  reduce: Ve
}, Symbol.toStringTag, { value: "Module" }));
var gI = ut(), Yi = ut(), jn = {
  estimate: 1,
  determine: 2
};
function of(e) {
  return {
    out: {
      noPxChangeTryDetermine: []
    },
    kind: e
  };
}
function yI(e, t) {
  var r = e.getLabelModel().get("customValues");
  if (r) {
    var n = e.scale;
    return {
      labels: z(Em(r, n), function(i, a) {
        return {
          formattedLabel: Os(e)(i, a),
          rawLabel: n.getLabel(i),
          tick: i
        };
      })
    };
  }
  return e.type === "category" ? _I(e, t) : wI(e);
}
function mI(e, t, r) {
  var n = e.scale, i = e.getTickModel().get("customValues");
  return i ? {
    ticks: Em(i, n)
  } : e.type === "category" ? SI(e, t) : {
    ticks: n.getTicks(r)
  };
}
function Em(e, t) {
  var r = t.getExtent(), n = [];
  return D(e, function(i) {
    i = t.parse(i), i >= r[0] && i <= r[1] && n.push(i);
  }), Mf(n, W1, null), bf(n), z(n, function(i) {
    return {
      value: i
    };
  });
}
function _I(e, t) {
  var r = e.getLabelModel(), n = Rm(e, r, t);
  return !r.get("show") || e.scale.isBlank() ? {
    labels: []
  } : n;
}
function Rm(e, t, r) {
  var n = TI(e), i = Mm(t), a = r.kind === jn.estimate;
  if (!a) {
    var o = Am(n, i);
    if (o)
      return o;
  }
  var s, u;
  Z(i) ? s = rs(e, i, !1) : (u = i === "auto" ? CI(e, r) : i, s = rs(e, u, !1));
  var l = {
    labels: s,
    labelCategoryInterval: u
  };
  return a ? r.out.noPxChangeTryDetermine.push(function() {
    return sf(n, i, l), !0;
  }) : sf(n, i, l), l;
}
function SI(e, t) {
  var r = bI(e), n = Mm(t), i = Am(r, n);
  if (i)
    return i;
  var a, o;
  if ((!t.get("show") || e.scale.isBlank()) && (a = []), Z(n))
    a = rs(e, n, !0);
  else if (n === "auto") {
    var s = Rm(e, e.getLabelModel(), of(jn.determine));
    o = s.labelCategoryInterval, a = z(s.labels, function(u) {
      return u.tick;
    });
  } else
    o = n, a = rs(e, o, !0);
  return sf(r, n, {
    ticks: a,
    tickCategoryInterval: o
  });
}
function wI(e) {
  var t = e.scale.getTicks(), r = Os(e);
  return {
    labels: z(t, function(n, i) {
      return {
        formattedLabel: r(n, i),
        rawLabel: e.scale.getLabel(n),
        tick: n
      };
    })
  };
}
var bI = Pm("axisTick"), TI = Pm("axisLabel");
function Pm(e) {
  return function(r) {
    return Yi(r)[e] || (Yi(r)[e] = {
      list: []
    });
  };
}
function Am(e, t) {
  for (var r = 0; r < e.list.length; r++)
    if (e.list[r].key === t)
      return e.list[r].value;
}
function sf(e, t, r) {
  return e.list.push({
    key: t,
    value: r
  }), r;
}
function CI(e, t) {
  if (t.kind === jn.estimate) {
    var r = e.calculateCategoryInterval(t);
    return t.out.noPxChangeTryDetermine.push(function() {
      return Yi(e).autoInterval = r, !0;
    }), r;
  }
  var n = Yi(e).autoInterval;
  return n != null ? n : Yi(e).autoInterval = e.calculateCategoryInterval(t);
}
function MI(e, t) {
  var r = t.kind, n = II(e), i = Os(e), a = (n.axisRotate - n.labelRotate) / 180 * Math.PI, o = e.scale, s = o.getExtent(), u = o.count();
  if (s[1] - s[0] < 1)
    return 0;
  var l = 1, h = 40;
  u > h && (l = Math.max(1, Math.floor(u / h)));
  for (var f = s[0], v = e.dataToCoord(f + 1) - e.dataToCoord(f), c = Math.abs(v * Math.cos(a)), d = Math.abs(v * Math.sin(a)), y = 0, p = 0; f <= s[1]; f += l) {
    var g = 0, m = 0, _ = U_(i({
      value: f
    }), n.font, "center", "top");
    g = _.width * 1.3, m = _.height * 1.3, y = Math.max(y, g, 7), p = Math.max(p, m, 7);
  }
  var S = y / c, w = p / d;
  isNaN(S) && (S = 1 / 0), isNaN(w) && (w = 1 / 0);
  var b = Math.max(0, Math.floor(Math.min(S, w)));
  if (r === jn.estimate)
    return t.out.noPxChangeTryDetermine.push(lt(DI, null, e, b, u)), b;
  var M = Om(e, b, u);
  return M != null ? M : b;
}
function DI(e, t, r) {
  return Om(e, t, r) == null;
}
function Om(e, t, r) {
  var n = gI(e.model), i = e.getExtent(), a = n.lastAutoInterval, o = n.lastTickCount;
  if (a != null && o != null && Math.abs(a - t) <= 1 && Math.abs(o - r) <= 1 && a > t && n.axisExtent0 === i[0] && n.axisExtent1 === i[1])
    return a;
  n.lastTickCount = r, n.lastAutoInterval = t, n.axisExtent0 = i[0], n.axisExtent1 = i[1];
}
function II(e) {
  var t = e.getLabelModel();
  return {
    axisRotate: e.getRotate ? e.getRotate() : e.isHorizontal && !e.isHorizontal() ? 90 : 0,
    labelRotate: t.get("rotate") || 0,
    font: t.getFont()
  };
}
function rs(e, t, r) {
  var n = Os(e), i = e.scale, a = [], o = Z(t);
  return wm(i, o ? 0 : t, function(s, u) {
    var l = i.getLabel(s);
    if (o) {
      var h = !!t(s.value, l);
      if (s.offInterval = !h, !h && !u)
        return;
    }
    a.push(r ? s : {
      formattedLabel: n(s),
      rawLabel: l,
      tick: s
    });
  }), a;
}
var xI = 0.8;
function km(e, t) {
  t = t || {};
  var r = {
    w: NaN,
    w2: NaN
  }, n = e.scale, i = t.fromStat, a = t.min, o = gD(n);
  hn(o) || (o = NaN);
  var s = e.getExtent(), u = cs(s[1] - s[0]);
  return si(n) ? LI(r, e, o, u) : i && EI(r, e, o, u, i), a != null && (r.w = hn(r.w) ? Zt(a, r.w) : a), r;
}
function LI(e, t, r, n) {
  var i = t.onBand, a = r + (i ? 1 : 0);
  a === 0 && (a = 1), e.w = n / a, !i && r && n && (e.w2 = e.w * r / n);
}
function EI(e, t, r, n, i) {
  var a = !1, o = -1 / 0;
  D(i.key ? [zD(t, i.key)] : VD(t, i.sers || []), function(s) {
    var u = s.liPosMinGap;
    u != null && (u > 0 ? (u > o && (o = u), a = !1) : u === BD && (a = !0));
  }), hn(r) && r > 0 && hn(o) ? (e.w = n / r * o, e.w2 = o) : a && (e.w = n * xI, e.w2 = e.w * r / n);
}
var Ld = [0, 1], RI = (
  /** @class */
  function() {
    function e(t, r, n) {
      this.onBand = !1, this.inverse = !1, this.dim = t, this.scale = r, this._extent = n || [0, 0];
    }
    return e.prototype.contain = function(t) {
      var r = this._extent, n = Math.min(r[0], r[1]), i = Math.max(r[0], r[1]);
      return t >= n && t <= i;
    }, e.prototype.containData = function(t) {
      return this.scale.contain(this.scale.parse(t));
    }, e.prototype.getExtent = function() {
      return this._extent.slice();
    }, e.prototype.setExtent = function(t, r) {
      var n = this._extent;
      n[0] = t, n[1] = r;
    }, e.prototype.dataToCoord = function(t, r) {
      var n = this.scale;
      return t = n.normalize(n.parse(t)), Ji(t, Ld, Ed(this), r);
    }, e.prototype.coordToData = function(t, r) {
      var n = Ji(t, Ed(this), Ld, r);
      return this.scale.scale(n);
    }, e.prototype.pointToData = function(t, r) {
    }, e.prototype.getTicksCoords = function(t) {
      t = t || {};
      var r = t.tickModel || this.getTickModel(), n = mI(this, r, {
        breakTicks: t.breakTicks,
        pruneByBreak: t.pruneByBreak
      }), i = z(n.ticks, function(s) {
        return {
          coord: this.dataToCoord(kD(this.scale, s)),
          tick: s
        };
      }, this), a = r.get("alignWithLabel"), o = PI(this, i, a);
      return z(i, function(s) {
        return {
          coord: s.coord,
          tickValue: s.tick.value,
          onBand: o
        };
      });
    }, e.prototype.getMinorTicksCoords = function() {
      if (si(this.scale))
        return [];
      var t = this.model.getModel("minorTick"), r = t.get("splitNumber");
      r > 0 && r < 100 || (r = 5);
      var n = this.scale.getMinorTicks(r), i = z(n, function(a) {
        return z(a, function(o) {
          return {
            coord: this.dataToCoord(o),
            tickValue: o
          };
        }, this);
      }, this);
      return i;
    }, e.prototype.getViewLabels = function(t) {
      return t = t || of(jn.determine), yI(this, t).labels;
    }, e.prototype.getLabelModel = function() {
      return this.model.getModel("axisLabel");
    }, e.prototype.getTickModel = function() {
      return this.model.getModel("axisTick");
    }, e.prototype.getBandWidth = function() {
      return km(this, {
        min: 1
      }).w;
    }, e.prototype.calculateCategoryInterval = function(t) {
      return t = t || of(jn.determine), MI(this, t);
    }, e;
  }()
);
function Ed(e) {
  var t = e.getExtent();
  if (e.onBand) {
    var r = t[1] - t[0], n = r / e.scale.count() / 2;
    t[0] += n, t[1] -= n;
  }
  return t;
}
function PI(e, t, r) {
  var n = t.length;
  if (!e.onBand || r || !n)
    return !1;
  var i = km(e).w;
  if (!i)
    return !1;
  D(t, function(s) {
    s.coord -= i / 2;
  });
  var a = e.scale.getExtent(), o = t[n - 1];
  return o.tick.offInterval && t.pop(), t.push({
    coord: o.coord + i,
    tick: {
      value: a[1] + 1
    }
  }), !0;
}
function AI(e) {
  var t = it.extend(e);
  return it.registerClass(t), t;
}
function OI(e) {
  var t = br.extend(e);
  return br.registerClass(t), t;
}
function kI(e) {
  var t = be.extend(e);
  return be.registerClass(t), t;
}
function NI(e) {
  var t = we.extend(e);
  return we.registerClass(t), t;
}
const BI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Axis: RI,
  ChartView: we,
  ComponentModel: it,
  ComponentView: br,
  List: oa,
  Model: yt,
  PRIORITY: $y,
  SeriesModel: be,
  color: M_,
  connect: OM,
  dataTool: GM,
  dependencies: gM,
  disConnect: kM,
  disconnect: em,
  dispose: NM,
  env: tt,
  extendChartView: NI,
  extendComponentModel: AI,
  extendComponentView: OI,
  extendSeriesModel: kI,
  format: dI,
  getCoordinateSystemDimensions: FM,
  getInstanceByDom: mh,
  getInstanceById: BM,
  getMap: HM,
  graphic: cI,
  helper: iI,
  init: AM,
  innerDrawElementOnCanvas: dh,
  matrix: Z0,
  number: hI,
  parseGeoJSON: xd,
  parseGeoJson: xd,
  registerAction: Dr,
  registerCoordinateSystem: im,
  registerCustomSeries: zM,
  registerLayout: am,
  registerLoading: Th,
  registerLocale: $f,
  registerMap: om,
  registerPostInit: rm,
  registerPostUpdate: nm,
  registerPreprocessor: Sh,
  registerProcessor: wh,
  registerTheme: _h,
  registerTransform: sm,
  registerUpdateLifecycle: Ps,
  registerVisual: Ir,
  setCanvasCreator: VM,
  setPlatformAPI: op,
  throttle: Iy,
  time: vI,
  use: Eh,
  util: pI,
  vector: R0,
  version: pM,
  zrUtil: T0,
  zrender: i1
}, Symbol.toStringTag, { value: "Module" }));
function FI(e, t) {
  var r = e.mapDimensionsAll("defaultedLabel"), n = r.length;
  if (n === 1) {
    var i = Jn(e, t, r[0]);
    return i != null ? i + "" : null;
  } else if (n) {
    for (var a = [], o = 0; o < r.length; o++)
      a.push(Jn(e, t, r[o]));
    return a.join(" ");
  }
}
var zI = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r, n, i, a) {
      var o = e.call(this) || this;
      return o.updateData(r, n, i, a), o;
    }
    return t.prototype._createSymbol = function(r, n, i, a, o, s) {
      this.removeAll();
      var u = Es(r, -1, -1, 2, 2, null, s);
      u.attr({
        z2: W(o, 100),
        culling: !0,
        scaleX: a[0] / 2,
        scaleY: a[1] / 2
      }), u.drift = VI, this._symbolType = r, this.add(u);
    }, t.prototype.stopSymbolAnimation = function(r) {
      this.childAt(0).stopAnimation(null, r);
    }, t.prototype.getSymbolType = function() {
      return this._symbolType;
    }, t.prototype.getSymbolPath = function() {
      return this.childAt(0);
    }, t.prototype.highlight = function() {
      ra(this.childAt(0));
    }, t.prototype.downplay = function() {
      na(this.childAt(0));
    }, t.prototype.setZ = function(r, n) {
      var i = this.childAt(0);
      i.zlevel = r, i.z = n;
    }, t.prototype.setDraggable = function(r, n) {
      var i = this.childAt(0);
      i.draggable = r, i.cursor = !n && r ? "move" : i.cursor;
    }, t.prototype.updateData = function(r, n, i, a) {
      this.silent = !1;
      var o = r.getItemVisual(n, "symbol") || "circle", s = r.hostModel, u = t.getSymbolSize(r, n), l = t.getSymbolZ2(r, n), h = o !== this._symbolType, f = a && a.disableAnimation;
      if (h) {
        var v = r.getItemVisual(n, "symbolKeepAspect");
        this._createSymbol(o, r, n, u, l, v);
      } else {
        var c = this.childAt(0);
        c.silent = !1;
        var d = {
          scaleX: u[0] / 2,
          scaleY: u[1] / 2
        };
        f ? c.attr(d) : pa(c, d, s, n), Kw(c);
      }
      if (this._updateCommon(r, n, u, i, a), h) {
        var c = this.childAt(0);
        if (!f) {
          var d = {
            scaleX: this._sizeX,
            scaleY: this._sizeY,
            style: {
              // Always fadeIn. Because it has fadeOut animation when symbol is removed..
              opacity: c.style.opacity
            }
          };
          c.scaleX = c.scaleY = 0, c.style.opacity = 0, Vf(c, d, s, n);
        }
      }
      f && this.childAt(0).stopAnimation("leave");
    }, t.prototype._updateCommon = function(r, n, i, a, o) {
      var s = this.childAt(0), u = r.hostModel, l, h, f, v, c, d, y, p, g;
      if (a && (l = a.emphasisItemStyle, h = a.blurItemStyle, f = a.selectItemStyle, v = a.focus, c = a.blurScope, y = a.labelStatesModels, p = a.hoverScale, g = a.cursorStyle, d = a.emphasisDisabled), !a || r.hasItemOption) {
        var m = a && a.itemModel ? a.itemModel : r.getItemModel(n), _ = m.getModel("emphasis");
        l = _.getModel("itemStyle").getItemStyle(), f = m.getModel(["select", "itemStyle"]).getItemStyle(), h = m.getModel(["blur", "itemStyle"]).getItemStyle(), v = _.get("focus"), c = _.get("blurScope"), d = _.get("disabled"), y = Ds(m), p = _.getShallow("scale"), g = m.getShallow("cursor");
      }
      var S = r.getItemVisual(n, "symbolRotate");
      s.attr("rotation", (S || 0) * Math.PI / 180 || 0);
      var w = ch(r.getItemVisual(n, "symbolOffset"), i);
      w && (s.x = w[0], s.y = w[1]), g && s.attr("cursor", g);
      var b = r.getItemVisual(n, "style"), M = b.fill;
      if (s instanceof Mr) {
        var C = s.style;
        s.useStyle(A({
          // TODO other properties like x, y ?
          image: C.image,
          x: C.x,
          y: C.y,
          width: C.width,
          height: C.height
        }, b));
      } else
        s.__isEmptyBrush ? s.useStyle(A({}, b)) : s.useStyle(b), s.style.decal = null, s.setColor(M, o && o.symbolInnerColor), s.style.strokeNoScale = !0;
      var T = r.getItemVisual(n, "liftZ"), I = this._z2;
      T != null ? I == null && (this._z2 = s.z2, s.z2 += T) : I != null && (s.z2 = I, this._z2 = null);
      var x = o && o.useNameLabel;
      Wg(s, y, {
        labelFetcher: u,
        labelDataIndex: n,
        defaultText: E,
        inheritColor: M,
        defaultOpacity: b.opacity
      });
      function E(k) {
        return x ? r.getName(k) : FI(r, k);
      }
      this._sizeX = i[0] / 2, this._sizeY = i[1] / 2;
      var L = s.ensureState("emphasis");
      L.style = l, s.ensureState("select").style = f, s.ensureState("blur").style = h;
      var R = p == null || p === !0 ? Math.max(1.1, 3 / this._sizeY) : isFinite(p) && p > 0 ? +p : 1;
      L.scaleX = this._sizeX * R, L.scaleY = this._sizeY * R, this.setSymbolScale(1), Rg(this, v, c, d);
    }, t.prototype.setSymbolScale = function(r) {
      this.scaleX = this.scaleY = r;
    }, t.prototype.fadeOut = function(r, n, i) {
      var a = this.childAt(0), o = Ft(this).dataIndex, s = i && i.animation;
      if (this.silent = a.silent = !0, i && i.fadeLabel) {
        var u = a.getTextContent();
        u && Qv(u, {
          style: {
            opacity: 0
          }
        }, n, {
          dataIndex: o,
          removeOpt: s,
          cb: function() {
            a.removeTextContent();
          }
        });
      } else
        a.removeTextContent();
      Qv(a, {
        style: {
          opacity: 0
        },
        scaleX: 0,
        scaleY: 0
      }, n, {
        dataIndex: o,
        cb: r,
        removeOpt: s
      });
    }, t.getSymbolSize = function(r, n) {
      return vh(r.getItemVisual(n, "symbolSize"));
    }, t.getSymbolZ2 = function(r, n) {
      return r.getItemVisual(n, "z2");
    }, t;
  }(Xt)
);
function VI(e, t) {
  this.parent.drift(e, t);
}
function ja(e, t, r, n) {
  return t && !isNaN(t[0]) && !isNaN(t[1]) && !(n && n.isIgnore && n.isIgnore(r)) && !(n && n.clipShape && !n.clipShape.contain(t[0], t[1])) && e.getItemVisual(r, "symbol") !== "none";
}
function Rd(e) {
  return e != null && !F(e) && (e = {
    isIgnore: e
  }), e || {};
}
function Pd(e) {
  var t = e.hostModel, r = t.getModel("emphasis");
  return {
    emphasisItemStyle: r.getModel("itemStyle").getItemStyle(),
    blurItemStyle: t.getModel(["blur", "itemStyle"]).getItemStyle(),
    selectItemStyle: t.getModel(["select", "itemStyle"]).getItemStyle(),
    focus: r.get("focus"),
    blurScope: r.get("blurScope"),
    emphasisDisabled: r.get("disabled"),
    hoverScale: r.get("scale"),
    labelStatesModels: Ds(t),
    cursorStyle: t.get("cursor")
  };
}
function Ad(e, t, r, n, i, a, o) {
  var s = new e(t, r, n, i);
  return s.setPosition(a), t.setItemGraphicEl(r, s), o.add(s), s;
}
var HI = (
  /** @class */
  function() {
    function e(t) {
      this.group = new Xt(), this._SymbolCtor = t || zI;
    }
    return e.prototype.updateData = function(t, r) {
      this._progressiveEls = null, r = Rd(r);
      var n = this.group, i = t.hostModel, a = this._data, o = this._SymbolCtor, s = r.disableAnimation, u = this._seriesScope = Pd(t), l = {
        disableAnimation: s
      }, h = r.getSymbolPoint || function(f) {
        return t.getItemLayout(f);
      };
      a || n.removeAll(), t.diff(a).add(function(f) {
        var v = h(f);
        ja(t, v, f, r) && Ad(o, t, f, u, l, v, n);
      }).update(function(f, v) {
        var c = a.getItemGraphicEl(v), d = h(f);
        if (!ja(t, d, f, r)) {
          n.remove(c);
          return;
        }
        var y = t.getItemVisual(f, "symbol") || "circle", p = c && c.getSymbolType && c.getSymbolType();
        if (!c || p && p !== y)
          n.remove(c), c = new o(t, f, u, l), c.setPosition(d);
        else {
          c.updateData(t, f, u, l);
          var g = {
            x: d[0],
            y: d[1]
          };
          s ? c.attr(g) : pa(c, g, i);
        }
        n.add(c), t.setItemGraphicEl(f, c);
      }).remove(function(f) {
        var v = a.getItemGraphicEl(f);
        v && v.fadeOut(function() {
          n.remove(v);
        }, i);
      }).execute(), this._getSymbolPoint = h, this._data = t;
    }, e.prototype.updateLayout = function(t) {
      var r = this._data;
      if (r)
        for (var n = this, i = r.getStore(), a = 0, o = i.count(); a < o; a++) {
          var s = r.getItemGraphicEl(a), u = n._getSymbolPoint(a);
          ja(r, u, a, t) ? (s = s || Ad(n._SymbolCtor, r, a, n._seriesScope, {
            disableAnimation: !0
          }, u, n.group), s.stopAnimation(), s.setPosition(u), s.markRedraw()) : s && (n.group.remove(s), r.setItemGraphicEl(a, null));
        }
    }, e.prototype.incrementalPrepareUpdate = function(t) {
      this._seriesScope = Pd(t), this._data = null, this.group.removeAll();
    }, e.prototype.incrementalUpdate = function(t, r, n, i) {
      this._progressiveEls = [], i = Rd(i);
      function a(l) {
        l.isGroup || (l.incremental = n, l.ensureState("emphasis").hoverLayer = Hf);
      }
      for (var o = t.start; o < t.end; o++) {
        var s = r.getItemLayout(o);
        if (ja(r, s, o, i)) {
          var u = new this._SymbolCtor(r, o, this._seriesScope);
          u.traverse(a), u.setPosition(s), this.group.add(u), r.setItemGraphicEl(o, u), this._progressiveEls.push(u);
        }
      }
    }, e.prototype.eachRendered = function(t) {
      Uf(this._progressiveEls || this.group, t);
    }, e.prototype.remove = function(t) {
      var r = this.group, n = this._data;
      n && t ? n.eachItemGraphicEl(function(i) {
        i.fadeOut(function() {
          r.remove(i);
        }, n.hostModel);
      }) : r.removeAll();
    }, e;
  }()
), GI = (
  /** @class */
  function() {
    function e(t, r) {
      this._getDataWithEncodedVisual = t, this._getRawData = r;
    }
    return e.prototype.getAllNames = function() {
      var t = this._getRawData();
      return t.mapArray(t.getName);
    }, e.prototype.containName = function(t) {
      var r = this._getRawData();
      return r.indexOfName(t) >= 0;
    }, e.prototype.indexOfName = function(t) {
      var r = this._getDataWithEncodedVisual();
      return r.indexOfName(t);
    }, e.prototype.getItemVisual = function(t, r) {
      var n = this._getDataWithEncodedVisual();
      return n.getItemVisual(t, r);
    }, e;
  }()
), UI = ut();
function Od(e, t) {
  return !!UI(e)[t];
}
Dr({
  type: "takeGlobalCursor",
  event: "globalCursorTaken",
  update: "update"
}, St);
var YI = {
  axisPointer: 1,
  tooltip: 1,
  brush: 1
};
function WI(e, t, r) {
  var n = t.getComponentByElement(e.topTarget);
  if (!n || n === r || YI.hasOwnProperty(n.mainType))
    return !1;
  var i = n.coordinateSystem;
  if (!i || i.model === r)
    return !1;
  var a = Go(n), o = Go(r);
  return !((a.zlevel - o.zlevel || a.z - o.z) <= 0);
}
var XI = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r) {
      var n = e.call(this) || this;
      n._zr = r;
      var i = lt(n._mousedownHandler, n), a = lt(n._mousemoveHandler, n), o = lt(n._mouseupHandler, n), s = lt(n._mousewheelHandler, n), u = lt(n._pinchHandler, n);
      return n.enable = function(l, h) {
        var f = h.zInfo, v = Go(f.component), c = v.z, d = v.zlevel, y = {
          component: f.component,
          z: c,
          zlevel: d,
          // By default roam controller is the lowest z2 comparing to other elememts in a component.
          z2: W(f.z2, -1 / 0)
        }, p = A({}, h.triggerInfo);
        this._opt = mt(A({}, h), {
          zoomOnMouseWheel: !0,
          moveOnMouseMove: !0,
          // By default, wheel do not trigger move.
          moveOnMouseWheel: !1,
          preventDefaultMouseMove: !0,
          zInfoParsed: y,
          triggerInfo: p,
          cursorGrab: "grab",
          cursorGrabbing: "grabbing"
        }), l == null && (l = !0), (!this._enabled || this._controlType !== l) && (this.disable(), this._enabled = !0, (l === !0 || l === "move" || l === "pan") && (Mi(r, "mousedown", i, y), Mi(r, "mousemove", a, y), Mi(r, "mouseup", o, y)), (l === !0 || l === "scale" || l === "zoom") && (Mi(r, "mousewheel", s, y), Mi(r, "pinch", u, y)));
      }, n.disable = function() {
        this._enabled && (this._enabled = !1, Di(r, "mousedown", i), Di(r, "mousemove", a), Di(r, "mouseup", o), Di(r, "mousewheel", s), Di(r, "pinch", u));
      }, n;
    }
    return t.prototype.isDragging = function() {
      return this._dragging;
    }, t.prototype.isPinching = function() {
      return this._pinching;
    }, t.prototype._checkPointer = function(r, n, i) {
      var a = this._opt, o = a.zInfoParsed;
      if (WI(r, a.api, o.component))
        return !1;
      var s = a.triggerInfo, u = s.roamTrigger, l = !1;
      return u === "global" && (l = !0), l || (l = s.isInSelf(r, n, i)), l && s.isInClip && !s.isInClip(r, n, i) && (l = !1), l;
    }, t.prototype._decideCursorStyle = function(r, n, i, a) {
      var o = r.target;
      if (!o && this._checkPointer(r, n, i))
        return this._opt.cursorGrab;
      if (a)
        return o && o.cursor || "default";
    }, t.prototype.dispose = function() {
      this.disable();
    }, t.prototype._mousedownHandler = function(r) {
      if (!(Gh(r) || Ci(r))) {
        for (var n = r.target; n; ) {
          if (n.draggable)
            return;
          n = n.__hostTarget || n.parent;
        }
        var i = r.offsetX, a = r.offsetY;
        this._checkPointer(r, i, a) && (this._x = i, this._y = a, this._dragging = !0);
      }
    }, t.prototype._mousemoveHandler = function(r) {
      var n = this._zr;
      if (!(r.gestureEvent === "pinch" || Od(n, "globalPan") || Ci(r))) {
        var i = r.offsetX, a = r.offsetY;
        if (!this._dragging || !Do("moveOnMouseMove", r, this._opt)) {
          var o = this._decideCursorStyle(r, i, a, !1);
          o && n.setCursorStyle(o);
          return;
        }
        n.setCursorStyle(this._opt.cursorGrabbing);
        var s = this._x, u = this._y, l = i - s, h = a - u;
        this._x = i, this._y = a, this._opt.preventDefaultMouseMove && cl(r.event), r.__ecRoamConsumed = !0, kd(this, "pan", "moveOnMouseMove", r, {
          dx: l,
          dy: h,
          oldX: s,
          oldY: u,
          newX: i,
          newY: a,
          isAvailableBehavior: null
        });
      }
    }, t.prototype._mouseupHandler = function(r) {
      if (!Ci(r)) {
        var n = this._zr;
        if (!Gh(r)) {
          this._dragging = !1;
          var i = this._decideCursorStyle(r, r.offsetX, r.offsetY, !0);
          i && n.setCursorStyle(i);
        }
      }
    }, t.prototype._mousewheelHandler = function(r) {
      if (!Ci(r)) {
        var n = Do("zoomOnMouseWheel", r, this._opt), i = Do("moveOnMouseWheel", r, this._opt), a = r.wheelDelta, o = Math.abs(a), s = r.offsetX, u = r.offsetY;
        if (!(a === 0 || !n && !i)) {
          if (n) {
            var l = o > 3 ? 1.4 : o > 1 ? 1.2 : 1.1, h = a > 0 ? l : 1 / l;
            this._checkTriggerMoveZoom(this, "zoom", "zoomOnMouseWheel", r, {
              scale: h,
              originX: s,
              originY: u,
              isAvailableBehavior: null
            });
          }
          if (i) {
            var f = Math.abs(a), v = (a > 0 ? 1 : -1) * (f > 3 ? 0.4 : f > 1 ? 0.15 : 0.05);
            this._checkTriggerMoveZoom(this, "scrollMove", "moveOnMouseWheel", r, {
              scrollDelta: v,
              originX: s,
              originY: u,
              isAvailableBehavior: null
            });
          }
        }
      }
    }, t.prototype._pinchHandler = function(r) {
      if (!(Od(this._zr, "globalPan") || Ci(r))) {
        var n = r.pinchScale > 1 ? 1.1 : 1 / 1.1;
        this._checkTriggerMoveZoom(this, "zoom", null, r, {
          scale: n,
          originX: r.pinchX,
          originY: r.pinchY,
          isAvailableBehavior: null
        });
      }
    }, t.prototype._checkTriggerMoveZoom = function(r, n, i, a, o) {
      r._checkPointer(a, o.originX, o.originY) && (cl(a.event), a.__ecRoamConsumed = !0, kd(r, n, i, a, o));
    }, t;
  }(Te)
);
function Ci(e) {
  return e.__ecRoamConsumed;
}
var $I = ut();
function ks(e) {
  var t = $I(e);
  return t.roam = t.roam || {}, t.uniform = t.uniform || {}, t;
}
function Mi(e, t, r, n) {
  for (var i = ks(e), a = i.roam, o = a[t] = a[t] || [], s = 0; s < o.length; s++) {
    var u = o[s].zInfoParsed;
    if ((u.zlevel - n.zlevel || u.z - n.z || u.z2 - n.z2) <= 0)
      break;
  }
  o.splice(s, 0, {
    listener: r,
    zInfoParsed: n
  }), ZI(e, t);
}
function Di(e, t, r) {
  for (var n = ks(e), i = n.roam[t] || [], a = 0; a < i.length; a++)
    if (i[a].listener === r) {
      i.splice(a, 1), i.length || qI(e, t);
      return;
    }
}
function ZI(e, t) {
  var r = ks(e);
  r.uniform[t] || e.on(t, r.uniform[t] = function(n) {
    var i = r.roam[t];
    if (i)
      for (var a = 0; a < i.length; a++)
        i[a].listener(n);
  });
}
function qI(e, t) {
  var r = ks(e), n = r.uniform;
  n[t] && (e.off(t, n[t]), n[t] = null);
}
function kd(e, t, r, n, i) {
  i.isAvailableBehavior = lt(Do, null, r, n), e.trigger(t, i);
}
function Do(e, t, r) {
  var n = r[e];
  return !e || n && (!G(n) || t.event[n + "Key"]);
}
var Ns = 0, ua = 1, ti = 2;
var KI = "view", Nm = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r, n, i) {
      var a = e.call(this) || this;
      a.type = KI, a.dimensions = ["x", "y"];
      var o = a;
      o.invertY = r, o.lgCt = n, o.lgGeo = i;
      var s = o.trans = [];
      return s[Ns] = Gn(), s[ua] = Gn(), s[ti] = Gn(), o.mtRaw = Lt(), o.mtRawInv = Lt(), o.mtOverall = Lt(), o.mtOverallInv = Lt(), o.zoom = 1, a;
    }
    return t.prototype.getBoundingRect = function() {
      return QI(null, this);
    }, t.prototype.getViewRect = function() {
      return JI(null, this);
    }, t.prototype.getRoamTransform = function() {
      return ln(this.trans[ua]);
    }, t.prototype.dataToPoint = function(r, n, i) {
      var a = n ? this.mtRaw : this.mtOverall;
      return i = i || [], a ? fe(i, r, a) : bt(i, r);
    }, t.prototype.pointToData = function(r, n, i) {
      i = i || [];
      var a = this.mtOverallInv;
      return a ? fe(i, r, a) : bt(i, r);
    }, t.prototype.convertToPixel = function(r, n, i) {
      var a = Ud(n);
      return a === this ? a.dataToPoint(i) : null;
    }, t.prototype.convertFromPixel = function(r, n, i) {
      var a = Ud(n);
      return a === this ? a.pointToData(i) : null;
    }, t.prototype.containPoint = function(r) {
      var n = this;
      return $n(to, n.dataRect), K0(to, to, n.mtOverall), Q0(to, r[0], r[1]);
    }, t.dimensions = ["x", "y"], t;
  }(ii)
), to = us();
function Nd(e, t) {
  return un([], t.mtOverall);
}
function QI(e, t) {
  return $n(us(), t.dataRect);
}
function JI(e, t) {
  return $n(us(), t.viewRect);
}
function Bd(e, t, r) {
  return fn(e || Gn(), t.trans[r]);
}
function Rh(e) {
  return !!(e.dataRect && e.viewRect);
}
function jI(e, t, r, n) {
  n === ua ? Fm(e, t.trans[Ns], r) : fn(e, r);
}
function Fd(e, t, r) {
  ln(r, eo), dr(eo, eo, t.mtRawInv), Yf(e, eo);
}
var eo = Lt();
function Bm(e, t) {
  var r = e;
  r.centerOption = t.getShallow("center");
  var n = r.zoomLimit = t.getShallow("scaleLimit"), i = t.getShallow("zoom");
  r.zoom = Gm(i || 1, n) || 1, Rh(r) && Ph(r);
}
function t2(e, t, r, n, i) {
  var a = e;
  a.dataRect = new H(t, r, n, i), Rh(a) && Ph(a);
}
function zd(e, t, r, n, i) {
  var a = e;
  a.viewRect = new H(t, r, n, i), Rh(a) && Ph(a);
}
function Ph(e) {
  e2(e), n2(e), i2(e);
}
function e2(e) {
  var t = e.dataRect, r = e.viewRect, n = e.trans[Ns], i = e.invertY;
  i && (t = $n(r2, t), t.y = -t.y - t.height), bp(Vd, t, r), Yf(n, Vd), i && (n.scaleY = -n.scaleY);
  var a = ln(n, e.mtRaw);
  ni(e.mtRawInv, a);
}
var Vd = Lt(), r2 = us();
function n2(e) {
  var t = zm(e), r = l2(Yu, e, e.centerOption) ? fe(Yu, Yu, e.mtRaw) : t, n = e.zoom, i = e.trans[ua];
  i.x = t[0] - n * r[0], i.y = t[1] - n * r[1], i.scaleX = i.scaleY = n;
}
var Yu = [];
function i2(e) {
  var t = e.trans, r = t[ua], n = t[Ns], i = t[ti];
  Fm(i, n, r);
  var a = ln(i, e.mtOverall), o = ni(e.mtOverallInv, a);
  Hd(e, i, a, o), Hd(e.lgGeo, i, a, o);
}
function Hd(e, t, r, n) {
  e && (fn(e, t), un(e.transform || (e.transform = []), r), un(e.invTransform || (e.invTransform = []), n));
}
function Fm(e, t, r) {
  ln(t, Gd), ln(r, ro), dr(ro, ro, Gd), Yf(e, ro);
}
var Gd = Lt(), ro = Lt();
function Ud(e) {
  var t = e.seriesModel;
  return t ? t.coordinateSystem : null;
}
function zm(e) {
  var t = e.viewRect;
  return Wu[0] = t.x + t.width / 2, Wu[1] = t.y + t.height / 2, Wu;
}
var Wu = [];
function Vm(e) {
  return e && e.type === "view";
}
function Yd(e, t, r, n) {
  var i = r;
  i.syncBackEl = e, i.syncBackType = t, n ? pa(e, Bd(null, r, t), n) : (Bd(e, r, t), e.dirty());
}
function a2(e, t, r, n) {
  var i = e, a = i.syncBackEl;
  a ? (a.stopAnimation(), jI(ar, i, a, i.syncBackType)) : fn(ar, i.trans[ti]), Fd(Xu, i, ar), n ? u2(ar, Xu, i, n) : fn(ar, Xu), Fd(ar, i, ar), v2(i, t, r, ar);
}
var ar = Gn(), Xu = Gn();
function o2(e, t, r) {
  var n = ns(t);
  n && (a2(n, t, r, e), Bm(n, t));
}
function ns(e) {
  return e.__ownRoamView ? e.__ownRoamView() : null;
}
function s2(e, t, r, n) {
  r.setUpdatePayload(Yg(e));
  var i = _g(n, t);
  i && i.__updateOnOwnRoam && i.__updateOnOwnRoam(e, t, n);
}
function u2(e, t, r, n) {
  n.dx != null && n.dy != null && (e.x += n.dx, e.y += n.dy);
  var i = n.zoom;
  if (i != null) {
    var a = Hm(t), o = Gm(a * i, r.zoomLimit), s = o / a;
    e.x -= (n.originX - e.x) * (s - 1), e.y -= (n.originY - e.y) * (s - 1), e.scaleX *= s, e.scaleY *= s;
  }
}
function Hm(e) {
  return e.scaleX;
}
function l2(e, t, r) {
  var n = t.dataRect;
  if (!r)
    return !1;
  var i = t.lgCt;
  return i ? en(e, jt(r[0], i.w), jt(r[1], i.h)) : n && en(e, jt(r[0], n.width, n.x), jt(r[1], n.height, n.y)), !0;
}
function f2(e, t) {
  var r = e.centerOption, n = e.dataRect;
  return !r || e.lgCt ? t.slice() : [Wd(0, t, r, n), Wd(1, t, r, n)];
}
function Wd(e, t, r, n) {
  return r && n && n[Jv[e]] && f1(r[e]) ? (t[e] - n[Qw[e]]) / n[Jv[e]] * 100 + "%" : t[e];
}
function h2(e, t) {
  return t && e && e.getShallow("legacyViewCoordSysCenterBase") ? {
    w: t.getWidth(),
    h: t.getHeight()
  } : null;
}
function v2(e, t, r, n) {
  var i = zm(e), a = Hm(n), o = cs(a) > 1e-6;
  Ii[0] = o ? (i[0] - n.x) / a : i[0], Ii[1] = o ? (i[1] - n.y) / a : i[1], fe(Ii, Ii, e.mtRawInv);
  var s = f2(e, Ii);
  Xd(t, s, a), D(r, function(u) {
    u !== t && Xd(u, s.slice(), a);
  });
}
var Ii = [];
function Xd(e, t, r) {
  var n = e.option;
  n.center = t, n.zoom = r;
}
function Gm(e, t) {
  if (t) {
    var r = t.min || 0, n = t.max || 1 / 0;
    e = Math.max(Math.min(n, e), r);
  }
  return e;
}
function c2(e, t) {
  var r = t.getShallow("nodeScaleRatio", !0) || 1, n = e;
  return ((n.zoom - 1) * r + 1) / (n.trans[ti].scaleX || 1);
}
function d2(e, t, r, n, i, a, o, s) {
  var u = ns(e);
  if (!u) {
    r.disable();
    return;
  }
  r.enable(
    // NOTE:
    //  If roamTypeDefault is null/undefined, roamType will be set as true.
    // PENDING:
    //  In MapSeries case, it has long been retrieving `roam` option from the first MapSeries
    //  that are not filtered out by a legend. But that requires `roam: true` to be set in all
    //  MapSeries option, otherwise if a legend hides the `roam: true` MapSeries, the map can
    //  not be roamed unexpectedly.
    W(e.get("roam"), o),
    {
      api: t,
      zInfo: {
        component: e
      },
      triggerInfo: {
        roamTrigger: e.get("roamTrigger"),
        isInSelf: n,
        isInClip: function(h, f, v) {
          return !0;
        }
      }
    }
  );
  function l(h) {
    var f = e.mainType, v = Yg(mt({
      type: Um(f, e.subType, yg)
    }, h));
    v[f + "Id"] = e.id, t.dispatchAction(v);
  }
  r.off("pan").off("zoom").on("pan", function(h) {
    l({
      dx: h.dx,
      dy: h.dy
    });
  }).on("zoom", function(h) {
    l({
      zoom: h.scale,
      originX: h.originX,
      originY: h.originY
    });
  });
}
new H(0, 0, 0, 0);
function p2(e, t, r) {
  var n = Um(t, r, yg);
  e.registerAction({
    type: n,
    event: n,
    // If `mainType` is a coord sys, 'update:' should be 'updateTransform' to
    // broadcast the update. But currently there is no such case required.
    // If 'updateTransform' is used, the owner of VIEW_COORD_SYS update firstly
    // in the action handler as follows, and then series and components laid
    // out on this VIEW_COORD_SYS update in `View['updateTransform']`.
    update: "none"
  }, function(i, a, o) {
    a.eachComponent(rg(i, t, r), function(s) {
      o2(i, s), s2(i, s, a, o);
    });
  });
}
function Um(e, t, r) {
  return (e !== Ss ? e : t === "map" ? "geo" : t) + r;
}
function g2(e) {
  return e.zoom != null;
}
function y2(e, t, r, n, i, a, o) {
  var s = new Nm(null, h2(e.ecModel, t));
  return t2(s, r, n, i, a), o ? zd(s, o.x, o.y, o.width, o.height) : zd(s, r, n, i, a), Bm(s, e), s;
}
var ve = ut();
function m2(e) {
  var t = e.mainData, r = e.datas;
  r || (r = {
    main: t
  }, e.datasAttr = {
    main: "data"
  }), e.datas = e.mainData = null, Ym(t, r, e), D(r, function(n) {
    D(t.TRANSFERABLE_METHODS, function(i) {
      n.wrapMethod(i, Je(_2, e));
    });
  }), t.wrapMethod("cloneShallow", Je(w2, e)), D(t.CHANGABLE_METHODS, function(n) {
    t.wrapMethod(n, Je(S2, e));
  }), He(r[t.dataType] === t);
}
function _2(e, t) {
  if (C2(this)) {
    var r = A({}, ve(this).datas);
    r[this.dataType] = t, Ym(t, r, e);
  } else
    Ah(t, this.dataType, ve(this).mainData, e);
  return t;
}
function S2(e, t) {
  return e.struct && e.struct.update(), t;
}
function w2(e, t) {
  return D(ve(t).datas, function(r, n) {
    r !== t && Ah(r.cloneShallow(), n, t, e);
  }), t;
}
function b2(e) {
  var t = ve(this).mainData;
  return e == null || t == null ? t : ve(t).datas[e];
}
function T2() {
  var e = ve(this).mainData;
  return e == null ? [{
    data: e
  }] : z(ft(ve(e).datas), function(t) {
    return {
      type: t,
      data: ve(e).datas[t]
    };
  });
}
function C2(e) {
  return ve(e).mainData === e;
}
function Ym(e, t, r) {
  ve(e).datas = {}, D(t, function(n, i) {
    Ah(n, i, e, r);
  });
}
function Ah(e, t, r, n) {
  ve(r).datas[t] = e, ve(e).mainData = r, e.dataType = t, n.struct && (e[n.structAttr] = n.struct, n.struct[n.datasAttr[t]] = e), e.getLinkedData = b2, e.getLinkedDataAll = T2;
}
function Pn(e) {
  return "_EC_" + e;
}
var M2 = (
  /** @class */
  function() {
    function e(t) {
      this.type = "graph", this.nodes = [], this.edges = [], this._nodesMap = {}, this._edgesMap = {}, this._directed = t || !1;
    }
    return e.prototype.isDirected = function() {
      return this._directed;
    }, e.prototype.addNode = function(t, r) {
      t = t == null ? "" + r : "" + t;
      var n = this._nodesMap;
      if (!n[Pn(t)]) {
        var i = new Kr(t, r);
        return i.hostGraph = this, this.nodes.push(i), n[Pn(t)] = i, i;
      }
    }, e.prototype.getNodeByIndex = function(t) {
      var r = this.data.getRawIndex(t);
      return this.nodes[r];
    }, e.prototype.getNodeById = function(t) {
      return this._nodesMap[Pn(t)];
    }, e.prototype.addEdge = function(t, r, n) {
      var i = this._nodesMap, a = this._edgesMap;
      if (pt(t) && (t = this.nodes[t]), pt(r) && (r = this.nodes[r]), t instanceof Kr || (t = i[Pn(t)]), r instanceof Kr || (r = i[Pn(r)]), !(!t || !r)) {
        var o = t.id + "-" + r.id, s = new Wm(t, r, n);
        return s.hostGraph = this, this._directed && (t.outEdges.push(s), r.inEdges.push(s)), t.edges.push(s), t !== r && r.edges.push(s), this.edges.push(s), a[o] = s, s;
      }
    }, e.prototype.getEdgeByIndex = function(t) {
      var r = this.edgeData.getRawIndex(t);
      return this.edges[r];
    }, e.prototype.getEdge = function(t, r) {
      t instanceof Kr && (t = t.id), r instanceof Kr && (r = r.id);
      var n = this._edgesMap;
      return this._directed ? n[t + "-" + r] : n[t + "-" + r] || n[r + "-" + t];
    }, e.prototype.eachNode = function(t, r) {
      for (var n = this.nodes, i = n.length, a = 0; a < i; a++)
        n[a].dataIndex >= 0 && t.call(r, n[a], a);
    }, e.prototype.eachEdge = function(t, r) {
      for (var n = this.edges, i = n.length, a = 0; a < i; a++)
        n[a].dataIndex >= 0 && n[a].node1.dataIndex >= 0 && n[a].node2.dataIndex >= 0 && t.call(r, n[a], a);
    }, e.prototype.breadthFirstTraverse = function(t, r, n, i) {
      if (r instanceof Kr || (r = this._nodesMap[Pn(r)]), !!r) {
        for (var a = n === "out" ? "outEdges" : n === "in" ? "inEdges" : "edges", o = 0; o < this.nodes.length; o++)
          this.nodes[o].__visited = !1;
        if (!t.call(i, r, null))
          for (var s = [r]; s.length; )
            for (var u = s.shift(), l = u[a], o = 0; o < l.length; o++) {
              var h = l[o], f = h.node1 === u ? h.node2 : h.node1;
              if (!f.__visited) {
                if (t.call(i, f, u))
                  return;
                s.push(f), f.__visited = !0;
              }
            }
      }
    }, e.prototype.update = function() {
      for (var t = this.data, r = this.edgeData, n = this.nodes, i = this.edges, a = 0, o = n.length; a < o; a++)
        n[a].dataIndex = -1;
      for (var a = 0, o = t.count(); a < o; a++)
        n[t.getRawIndex(a)].dataIndex = a;
      r.filterSelf(function(s) {
        var u = i[r.getRawIndex(s)];
        return u.node1.dataIndex >= 0 && u.node2.dataIndex >= 0;
      });
      for (var a = 0, o = i.length; a < o; a++)
        i[a].dataIndex = -1;
      for (var a = 0, o = r.count(); a < o; a++)
        i[r.getRawIndex(a)].dataIndex = a;
    }, e.prototype.clone = function() {
      for (var t = new e(this._directed), r = this.nodes, n = this.edges, i = 0; i < r.length; i++)
        t.addNode(r[i].id, r[i].dataIndex);
      for (var i = 0; i < n.length; i++) {
        var a = n[i];
        t.addEdge(a.node1.id, a.node2.id, a.dataIndex);
      }
      return t;
    }, e;
  }()
), Kr = (
  /** @class */
  function() {
    function e(t, r) {
      this.inEdges = [], this.outEdges = [], this.edges = [], this.dataIndex = -1, this.id = t == null ? "" : t, this.dataIndex = r == null ? -1 : r;
    }
    return e.prototype.degree = function() {
      return this.edges.length;
    }, e.prototype.inDegree = function() {
      return this.inEdges.length;
    }, e.prototype.outDegree = function() {
      return this.outEdges.length;
    }, e.prototype.getModel = function(t) {
      if (!(this.dataIndex < 0)) {
        var r = this.hostGraph, n = r.data.getItemModel(this.dataIndex);
        return n.getModel(t);
      }
    }, e.prototype.getAdjacentDataIndices = function() {
      for (var t = {
        edge: [],
        node: []
      }, r = 0; r < this.edges.length; r++) {
        var n = this.edges[r];
        n.dataIndex < 0 || (t.edge.push(n.dataIndex), t.node.push(n.node1.dataIndex, n.node2.dataIndex));
      }
      return t;
    }, e.prototype.getTrajectoryDataIndices = function() {
      for (var t = V(), r = V(), n = 0, i = this.edges.length; n < i; n++) {
        var a = this.edges[n];
        if (!(a.dataIndex < 0)) {
          t.set(a.dataIndex, !0);
          for (var o = [a.node1], s = [a.node2], u = 0; u < o.length; ) {
            var l = o[u];
            u++, r.set(l.dataIndex, !0);
            for (var h = l.inEdges, f = 0, v = h.length, c = void 0, d = void 0; f < v; f++)
              c = h[f], d = c.dataIndex, d >= 0 && !t.hasKey(d) && (t.set(d, !0), o.push(c.node1));
          }
          for (u = 0; u < s.length; ) {
            var y = s[u];
            u++, r.set(y.dataIndex, !0);
            for (var p = y.outEdges, f = 0, g = p.length, m = void 0, _ = void 0; f < g; f++)
              m = p[f], _ = m.dataIndex, _ >= 0 && !t.hasKey(_) && (t.set(_, !0), s.push(m.node2));
          }
        }
      }
      return {
        edge: t.keys(),
        node: r.keys()
      };
    }, e;
  }()
), Wm = (
  /** @class */
  function() {
    function e(t, r, n) {
      this.dataIndex = -1, this.node1 = t, this.node2 = r, this.dataIndex = n == null ? -1 : n;
    }
    return e.prototype.getModel = function(t) {
      if (!(this.dataIndex < 0)) {
        var r = this.hostGraph, n = r.edgeData.getItemModel(this.dataIndex);
        return n.getModel(t);
      }
    }, e.prototype.getAdjacentDataIndices = function() {
      return {
        edge: [this.dataIndex],
        node: [this.node1.dataIndex, this.node2.dataIndex]
      };
    }, e.prototype.getTrajectoryDataIndices = function() {
      var t = V(), r = V();
      t.set(this.dataIndex, !0);
      for (var n = [this.node1], i = [this.node2], a = 0; a < n.length; ) {
        var o = n[a];
        a++, r.set(o.dataIndex, !0);
        for (var s = o.inEdges, u = 0, l = s.length, h = void 0, f = void 0; u < l; u++)
          h = o.inEdges[u], f = h.dataIndex, f >= 0 && !t.hasKey(f) && (t.set(f, !0), n.push(h.node1));
      }
      for (a = 0; a < i.length; ) {
        var v = i[a];
        a++, r.set(v.dataIndex, !0);
        for (var c = v.outEdges, u = 0, l = c.length, d = void 0, y = void 0; u < l; u++)
          d = v.outEdges[u], y = d.dataIndex, y >= 0 && !t.hasKey(y) && (t.set(y, !0), i.push(d.node2));
      }
      return {
        edge: t.keys(),
        node: r.keys()
      };
    }, e;
  }()
);
function Xm(e, t) {
  return {
    /**
     * @param Default 'value'. can be 'a', 'b', 'c', 'd', 'e'.
     */
    getValue: function(r) {
      var n = this[e][t];
      return n.getStore().get(n.getDimensionIndex(r || "value"), this.dataIndex);
    },
    // TODO: TYPE stricter type.
    setVisual: function(r, n) {
      this.dataIndex >= 0 && this[e][t].setItemVisual(this.dataIndex, r, n);
    },
    getVisual: function(r) {
      return this[e][t].getItemVisual(this.dataIndex, r);
    },
    setLayout: function(r, n) {
      this.dataIndex >= 0 && this[e][t].setItemLayout(this.dataIndex, r, n);
    },
    getLayout: function() {
      return this[e][t].getItemLayout(this.dataIndex);
    },
    getGraphicEl: function() {
      return this[e][t].getItemGraphicEl(this.dataIndex);
    },
    getRawIndex: function() {
      return this[e][t].getRawIndex(this.dataIndex);
    }
  };
}
ee(Kr, Xm("hostGraph", "data"));
ee(Wm, Xm("hostGraph", "edgeData"));
function D2(e, t, r, n, i) {
  for (var a = new M2(n), o = 0; o < e.length; o++)
    a.addNode(ll(
      // Id, name, dataIndex
      e[o].id,
      e[o].name,
      o
    ), o);
  for (var s = [], u = [], l = 0, o = 0; o < t.length; o++) {
    var h = t[o], f = h.source, v = h.target;
    a.addEdge(f, v, l) && (u.push(h), s.push(ll(Se(h.id, null), f + " > " + v)), l++);
  }
  var c = r.get("coordinateSystem"), d;
  if (c === "cartesian2d" || c === "polar" || c === "matrix")
    d = pm(e, r);
  else {
    var y = ga.get(c), p = y ? y.dimensions || [] : [];
    at(p, "value") < 0 && p.concat(["value"]);
    var g = Mh(e, {
      coordDimensions: p,
      encodeDefine: r.getEncode()
    }).dimensions;
    d = new oa(g, r), d.initData(e);
  }
  var m = new oa(["value"], r);
  return m.initData(u, s), i && i(d, m), m2({
    mainData: d,
    struct: a,
    structAttr: "graph",
    datas: {
      node: d,
      edge: m
    },
    datasAttr: {
      node: "data",
      edge: "edgeData"
    }
  }), a.update(), a;
}
var uf = "-->", Bs = function(e) {
  return e.get("autoCurveness") || null;
}, $m = function(e, t) {
  var r = Bs(e), n = 20, i = [];
  if (pt(r))
    n = r;
  else if (N(r)) {
    e.__curvenessList = r;
    return;
  }
  t > n && (n = t);
  var a = n % 2 ? n + 2 : n + 3;
  i = [];
  for (var o = 0; o < a; o++)
    i.push((o % 2 ? o + 1 : o) / 10 * (o % 2 ? -1 : 1));
  e.__curvenessList = i;
}, la = function(e, t, r) {
  var n = [e.id, e.dataIndex].join("."), i = [t.id, t.dataIndex].join(".");
  return [r.uid, n, i].join(uf);
}, Zm = function(e) {
  var t = e.split(uf);
  return [t[0], t[2], t[1]].join(uf);
}, I2 = function(e, t) {
  var r = la(e.node1, e.node2, t);
  return t.__edgeMap[r];
}, x2 = function(e, t) {
  var r = lf(la(e.node1, e.node2, t), t), n = lf(la(e.node2, e.node1, t), t);
  return r + n;
}, lf = function(e, t) {
  var r = t.__edgeMap;
  return r[e] ? r[e].length : 0;
};
function L2(e) {
  Bs(e) && (e.__curvenessList = [], e.__edgeMap = {}, $m(e));
}
function E2(e, t, r, n) {
  if (Bs(r)) {
    var i = la(e, t, r), a = r.__edgeMap, o = a[Zm(i)];
    a[i] && !o ? a[i].isForward = !0 : o && a[i] && (o.isForward = !0, a[i].isForward = !1), a[i] = a[i] || [], a[i].push(n);
  }
}
function Oh(e, t, r, n) {
  var i = Bs(t), a = N(i);
  if (!i)
    return null;
  var o = I2(e, t);
  if (!o)
    return null;
  for (var s = -1, u = 0; u < o.length; u++)
    if (o[u] === r) {
      s = u;
      break;
    }
  var l = x2(e, t);
  $m(t, l), e.lineStyle = e.lineStyle || {};
  var h = la(e.node1, e.node2, t), f = t.__curvenessList, v = a || l % 2 ? 0 : 1;
  if (o.isForward)
    return f[v + s];
  var c = Zm(h), d = lf(c, t), y = f[s + d + v];
  return n ? a ? i && i[0] === 0 ? (d + v) % 2 ? y : -y : ((d % 2 ? 0 : 1) + v) % 2 ? y : -y : (d + v) % 2 ? y : -y : f[s + d + v];
}
var Ht = "graph", R2 = (
  /** @class */
  function(e) {
    B(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r.hasSymbolVisual = !0, r;
    }
    return t.prototype.init = function(r) {
      e.prototype.init.apply(this, arguments);
      var n = this;
      function i() {
        return n._categoriesData;
      }
      this.legendVisualProvider = new GI(i, i), this.fillDataTextStyle(r.edges || r.links), this._updateCategoriesData();
    }, t.prototype.mergeOption = function(r) {
      e.prototype.mergeOption.apply(this, arguments), this.fillDataTextStyle(r.edges || r.links), this._updateCategoriesData();
    }, t.prototype.mergeDefaultAndTheme = function(r) {
      e.prototype.mergeDefaultAndTheme.apply(this, arguments), Pl(r, "edgeLabel", ["show"]);
    }, t.prototype.getInitialData = function(r, n) {
      var i = r.edges || r.links || [], a = r.data || r.nodes || [], o = this;
      if (a && i) {
        L2(this);
        var s = D2(a, i, this, !0, u);
        return D(s.edges, function(l) {
          E2(l.node1, l.node2, this, l.dataIndex);
        }, this), s.data;
      }
      function u(l, h) {
        l.wrapMethod("getItemModel", function(d) {
          var y = o._categoriesModels, p = d.getShallow("category"), g = y[p];
          return g && (g.parentModel = d.parentModel, d.parentModel = g), d;
        });
        var f = yt.prototype.getModel;
        function v(d, y) {
          var p = f.call(this, d, y);
          return p.resolveParentPath = c, p;
        }
        h.wrapMethod("getItemModel", function(d) {
          return d.resolveParentPath = c, d.getModel = v, d;
        });
        function c(d) {
          if (d && (d[0] === "label" || d[1] === "label")) {
            var y = d.slice();
            return d[0] === "label" ? y[0] = "edgeLabel" : d[1] === "label" && (y[1] = "edgeLabel"), y;
          }
          return d;
        }
      }
    }, t.prototype.getGraph = function() {
      return this.getData().graph;
    }, t.prototype.getEdgeData = function() {
      return this.getGraph().edgeData;
    }, t.prototype.getCategoriesData = function() {
      return this._categoriesData;
    }, t.prototype.formatTooltip = function(r, n, i) {
      if (i === "edge") {
        var a = this.getData(), o = this.getDataParams(r, i), s = a.graph.getEdgeByIndex(r), u = a.getName(s.node1.dataIndex), l = a.getName(s.node2.dataIndex), h = [];
        return u != null && h.push(u), l != null && h.push(l), $o("nameValue", {
          name: h.join(" > "),
          value: o.value,
          noValue: o.value == null
        });
      }
      var f = My({
        series: this,
        dataIndex: r,
        multipleSeries: n
      });
      return f;
    }, t.prototype._updateCategoriesData = function() {
      var r = z(this.option.categories || [], function(i) {
        return i.value != null ? i : A({
          value: 0
        }, i);
      }), n = new oa(["value"], this);
      n.initData(r), this._categoriesData = n, this._categoriesModels = n.mapArray(function(i) {
        return n.getItemModel(i);
      });
    }, t.prototype.isAnimationEnabled = function() {
      return e.prototype.isAnimationEnabled.call(this) && !(this.get("layout") === "force" && this.get(["force", "layoutAnimation"]));
    }, t.prototype.__ownRoamView = function() {
      var r = this.coordinateSystem;
      return Vm(r) && r;
    }, t.type = "series." + Ht, t.dependencies = ["grid", "polar", "geo", "singleAxis", "calendar"], t.defaultOption = {
      // zlevel: 0,
      z: 2,
      coordinateSystem: "view",
      // Default option for all coordinate systems
      // xAxisIndex: 0,
      // yAxisIndex: 0,
      // polarIndex: 0,
      // geoIndex: 0,
      legendHoverLink: !0,
      layout: null,
      // Configuration of circular layout
      circular: {
        rotateLabel: !1
      },
      // Configuration of force directed layout
      force: {
        initLayout: null,
        // Node repulsion. Can be an array to represent range.
        repulsion: [0, 50],
        gravity: 0.1,
        // Initial friction
        friction: 0.6,
        // Edge length. Can be an array to represent range.
        edgeLength: 30,
        layoutAnimation: !0
      },
      left: "center",
      top: "center",
      // right: null,
      // bottom: null,
      // width: '80%',
      // height: '80%',
      symbol: "circle",
      symbolSize: 10,
      edgeSymbol: ["none", "none"],
      edgeSymbolSize: 10,
      edgeLabel: {
        position: "middle",
        distance: 5
      },
      draggable: !1,
      roam: !1,
      // Default on center of graph
      center: null,
      zoom: 1,
      // Symbol size scale ratio in roam
      nodeScaleRatio: 0.6,
      // cursor: null,
      // categories: [],
      // data: []
      // Or
      // nodes: []
      //
      // links: []
      // Or
      // edges: []
      label: {
        show: !1,
        formatter: "{b}"
      },
      itemStyle: {},
      lineStyle: {
        // Don't use tokens.color.border because of the opacity
        color: Et.color.neutral50,
        width: 1,
        opacity: 0.5
      },
      emphasis: {
        scale: !0,
        label: {
          show: !0
        }
      },
      select: {
        itemStyle: {
          borderColor: Et.color.primary
        }
      }
    }, t;
  }(be)
);
function no(e) {
  return e instanceof Array || (e = [e, e]), e;
}
var P2 = oi(Ht, A2);
function A2(e) {
  e.eachSeriesByType(Ht, function(t) {
    var r = t.getGraph(), n = t.getEdgeData(), i = no(t.get("edgeSymbol")), a = no(t.get("edgeSymbolSize"));
    n.setVisual("fromSymbol", i && i[0]), n.setVisual("toSymbol", i && i[1]), n.setVisual("fromSymbolSize", a && a[0]), n.setVisual("toSymbolSize", a && a[1]), n.setVisual("style", t.getModel("lineStyle").getLineStyle()), n.each(function(o) {
      var s = n.getItemModel(o), u = r.getEdgeByIndex(o), l = no(s.getShallow("symbol", !0)), h = no(s.getShallow("symbolSize", !0)), f = s.getModel("lineStyle").getLineStyle(), v = n.ensureUniqueItemVisual(o, "style");
      switch (A(v, f), v.stroke) {
        case "source": {
          var c = u.node1.getVisual("style");
          v.stroke = c && c.fill;
          break;
        }
        case "target": {
          var c = u.node2.getVisual("style");
          v.stroke = c && c.fill;
          break;
        }
      }
      l[0] && u.setVisual("fromSymbol", l[0]), l[1] && u.setVisual("toSymbol", l[1]), h[0] && u.setVisual("fromSymbolSize", h[0]), h[1] && u.setVisual("toSymbolSize", h[1]);
    });
  });
}
function qm(e) {
  var t = e.coordinateSystem;
  if (!(t && t.type !== "view")) {
    var r = e.getGraph();
    r.eachNode(function(n) {
      var i = n.getModel();
      n.setLayout([+i.get("x"), +i.get("y")]);
    }), kh(r, e);
  }
}
function kh(e, t) {
  e.eachEdge(function(r, n) {
    var i = je(r.getModel().get(["lineStyle", "curveness"]), -Oh(r, t, n, !0), 0), a = ke(r.node1.getLayout()), o = ke(r.node2.getLayout()), s = [a, o];
    +i && s.push([(a[0] + o[0]) / 2 - (a[1] - o[1]) * i, (a[1] + o[1]) / 2 - (o[0] - a[0]) * i]), r.setLayout(s);
  });
}
var O2 = oi(Ht, k2);
function k2(e, t) {
  e.eachSeriesByType(Ht, function(r) {
    var n = r.get("layout"), i = r.coordinateSystem;
    if (i && i.type !== "view") {
      var a = r.getData(), o = [];
      D(i.dimensions, function(v) {
        o = o.concat(a.mapDimensionsAll(v));
      });
      for (var s = 0; s < a.count(); s++) {
        for (var u = [], l = !1, h = 0; h < o.length; h++) {
          var f = a.get(o[h], s);
          isNaN(f) || (l = !0), u.push(f);
        }
        l ? a.setItemLayout(s, i.dataToPoint(u)) : a.setItemLayout(s, [NaN, NaN]);
      }
      kh(a.graph, r);
    } else (!n || n === "none") && qm(r);
  });
}
function Oi(e) {
  var t = e.coordinateSystem;
  return Vm(t) ? c2(t, e) : 1;
}
function ki(e) {
  var t = e.getVisual("symbolSize");
  return t instanceof Array && (t = (t[0] + t[1]) / 2), +t;
}
var $d = Math.PI, $u = [];
function Nh(e, t, r, n) {
  var i = e.coordinateSystem;
  if (!(i && i.type !== "view")) {
    var a = i.getBoundingRect(), o = e.getData(), s = o.graph, u = a.width / 2 + a.x, l = a.height / 2 + a.y, h = Math.min(a.width, a.height) / 2, f = o.count();
    if (o.setLayout({
      cx: u,
      cy: l
    }), !!f) {
      if (r) {
        var v = i.pointToData(n), c = v[0], d = v[1], y = [c - u, d - l];
        cn(y, y), Ni(y, y, h), r.setLayout([u + y[0], l + y[1]], !0);
        var p = e.get(["circular", "rotateLabel"]);
        Km(r, p, u, l);
      }
      N2[t](e, s, o, h, u, l, f), s.eachEdge(function(g, m) {
        var _ = je(g.getModel().get(["lineStyle", "curveness"]), Oh(g, e, m), 0), S = ke(g.node1.getLayout()), w = ke(g.node2.getLayout()), b, M = (S[0] + w[0]) / 2, C = (S[1] + w[1]) / 2;
        +_ && (_ *= 3, b = [u * _ + M * (1 - _), l * _ + C * (1 - _)]), g.setLayout([S, w, b]);
      });
    }
  }
}
var N2 = {
  value: function(e, t, r, n, i, a, o) {
    var s = 0, u = r.getSum("value"), l = Math.PI * 2 / (u || o);
    t.eachNode(function(h) {
      var f = h.getValue("value"), v = l * (u ? f : 1) / 2;
      s += v, h.setLayout([n * Math.cos(s) + i, n * Math.sin(s) + a]), s += v;
    });
  },
  symbolSize: function(e, t, r, n, i, a, o) {
    var s = 0;
    $u.length = o;
    var u = Oi(e);
    t.eachNode(function(f) {
      var v = ki(f);
      isNaN(v) && (v = 2), v < 0 && (v = 0), v *= u;
      var c = Math.asin(v / 2 / n);
      isNaN(c) && (c = $d / 2), $u[f.dataIndex] = c, s += c * 2;
    });
    var l = (2 * $d - s) / o / 2, h = 0;
    t.eachNode(function(f) {
      var v = l + $u[f.dataIndex];
      h += v, (!f.getLayout() || !f.getLayout().fixed) && f.setLayout([n * Math.cos(h) + i, n * Math.sin(h) + a]), h += v;
    });
  }
};
function Km(e, t, r, n) {
  var i = e.getGraphicEl();
  if (i) {
    var a = e.getModel(), o = a.get(["label", "rotate"]) || 0, s = i.getSymbolPath();
    if (t) {
      var u = e.getLayout(), l = Math.atan2(u[1] - n, u[0] - r);
      l < 0 && (l = Math.PI * 2 + l);
      var h = u[0] < r;
      h && (l = l - Math.PI);
      var f = h ? "left" : "right";
      s.setTextConfig({
        rotation: -l,
        position: f,
        origin: "center"
      });
      var v = s.ensureState("emphasis");
      A(v.textConfig || (v.textConfig = {}), {
        position: f
      });
    } else
      s.setTextConfig({
        rotation: o *= Math.PI / 180
      });
  }
}
var B2 = oi(Ht, F2);
function F2(e) {
  e.eachSeriesByType("graph", function(t) {
    t.get("layout") === "circular" && Nh(t, "symbolSize");
  });
}
var An = Lo;
function z2(e, t, r) {
  for (var n = e, i = t, a = r.rect, o = a.width, s = a.height, u = [a.x + o / 2, a.y + s / 2], l = r.gravity == null ? 0.1 : r.gravity, h = 0; h < n.length; h++) {
    var f = n[h];
    f.p || (f.p = Tr(o * (Math.random() - 0.5) + u[0], s * (Math.random() - 0.5) + u[1])), f.pp = ke(f.p), f.edges = null;
  }
  var v = r.friction == null ? 0.6 : r.friction, c = v, d, y;
  return {
    warmUp: function() {
      c = v * 0.8;
    },
    setFixed: function(p) {
      n[p].fixed = !0;
    },
    setUnfixed: function(p) {
      n[p].fixed = !1;
    },
    /**
     * Before step hook
     */
    beforeStep: function(p) {
      d = p;
    },
    /**
     * After step hook
     */
    afterStep: function(p) {
      y = p;
    },
    /**
     * Some formulas were originally copied from "d3.js"
     * https://github.com/d3/d3/blob/b516d77fb8566b576088e73410437494717ada26/src/layout/force.js
     * with some modifications made for this project.
     * See the license statement at the head of this file.
     */
    step: function(p) {
      d && d(n, i);
      for (var g = [], m = n.length, _ = 0; _ < i.length; _++) {
        var S = i[_];
        if (!S.ignoreForceLayout) {
          var w = S.n1, b = S.n2;
          ur(g, b.p, w.p);
          var M = $i(g) - S.d, C = b.w / (w.w + b.w);
          isNaN(C) && (C = 0), cn(g, g), !w.fixed && An(w.p, w.p, g, C * M * c), !b.fixed && An(b.p, b.p, g, -(1 - C) * M * c);
        }
      }
      for (var _ = 0; _ < m; _++) {
        var T = n[_];
        T.fixed || (ur(g, u, T.p), An(T.p, T.p, g, l * c));
      }
      for (var _ = 0; _ < m; _++)
        for (var w = n[_], I = _ + 1; I < m; I++) {
          var b = n[I];
          ur(g, b.p, w.p);
          var M = $i(g);
          M === 0 && (en(g, Math.random() - 0.5, Math.random() - 0.5), M = 1);
          var x = (w.rep + b.rep) / M / M;
          !w.fixed && An(w.pp, w.pp, g, x), !b.fixed && An(b.pp, b.pp, g, -x);
        }
      for (var E = [], _ = 0; _ < m; _++) {
        var T = n[_];
        T.fixed || (ur(E, T.p, T.pp), An(T.p, T.p, E, c), bt(T.pp, T.p));
      }
      c = c * 0.992;
      var L = c < 0.01;
      y && y(n, i, L), p && p(L);
    }
  };
}
var V2 = oi(Ht, H2);
function H2(e) {
  e.eachSeriesByType(Ht, function(t) {
    var r = t.coordinateSystem;
    if (!(r && r.type !== "view"))
      if (t.get("layout") === "force") {
        var n = t.preservedPoints || {}, i = t.getGraph(), a = i.data, o = i.edgeData, s = t.getModel("force"), u = s.get("initLayout");
        t.preservedPoints ? a.each(function(_) {
          var S = a.getId(_);
          a.setItemLayout(_, n[S] || [NaN, NaN]);
        }) : !u || u === "none" ? qm(t) : u === "circular" && Nh(t, "value");
        var l = a.getDataExtent("value"), h = o.getDataExtent("value"), f = s.get("repulsion"), v = s.get("edgeLength"), c = N(f) ? f : [f, f], d = N(v) ? v : [v, v];
        d = [d[1], d[0]];
        var y = a.mapArray("value", function(_, S) {
          var w = a.getItemLayout(S), b = Ji(_, l, c);
          return isNaN(b) && (b = (c[0] + c[1]) / 2), {
            w: b,
            rep: b,
            fixed: a.getItemModel(S).get("fixed"),
            p: !w || isNaN(w[0]) || isNaN(w[1]) ? null : w
          };
        }), p = o.mapArray("value", function(_, S) {
          var w = i.getEdgeByIndex(S), b = Ji(_, h, d);
          isNaN(b) && (b = (d[0] + d[1]) / 2);
          var M = w.getModel(), C = je(w.getModel().get(["lineStyle", "curveness"]), -Oh(w, t, S, !0), 0);
          return {
            n1: y[w.node1.dataIndex],
            n2: y[w.node2.dataIndex],
            d: b,
            curveness: C,
            ignoreForceLayout: M.get("ignoreForceLayout")
          };
        }), g = r.getBoundingRect(), m = z2(y, p, {
          rect: g,
          gravity: s.get("gravity"),
          friction: s.get("friction")
        });
        m.beforeStep(function(_, S) {
          for (var w = 0, b = _.length; w < b; w++)
            _[w].fixed && bt(_[w].p, i.getNodeByIndex(w).getLayout());
        }), m.afterStep(function(_, S, w) {
          for (var b = 0, M = _.length; b < M; b++)
            _[b].fixed || i.getNodeByIndex(b).setLayout(_[b].p), n[a.getId(b)] = _[b].p;
          for (var b = 0, M = S.length; b < M; b++) {
            var C = S[b], T = i.getEdgeByIndex(b), I = C.n1.p, x = C.n2.p, E = T.getLayout();
            E = E ? E.slice() : [], E[0] = E[0] || [], E[1] = E[1] || [], bt(E[0], I), bt(E[1], x), +C.curveness && (E[2] = [(I[0] + x[0]) / 2 - (I[1] - x[1]) * C.curveness, (I[1] + x[1]) / 2 - (x[0] - I[0]) * C.curveness]), T.setLayout(E);
          }
        }), t.forceLayout = m, t.preservedPoints = n, m.step();
      } else
        t.forceLayout = null;
  });
}
function G2(e, t, r) {
  var n = rT(e, t), i = A(e.getBoxLayoutParams(), {
    aspect: r
  }), a = ih(i, n.refContainer);
  return eT(e, a, r);
}
function U2(e, t) {
  var r = [];
  return e.eachSeriesByType("graph", function(n) {
    Jb({
      targetModel: n,
      coordSysType: "view",
      coordSysProvider: i
    });
    function i() {
      var a = n.getData(), o = a.mapArray(function(d) {
        var y = a.getItemModel(d);
        return [+y.get("x"), +y.get("y")];
      }), s = [], u = [];
      yS(o, s, u), u[0] - s[0] === 0 && (u[0] += 1, s[0] -= 1), u[1] - s[1] === 0 && (u[1] += 1, s[1] -= 1);
      var l = (u[0] - s[0]) / (u[1] - s[1]), h = G2(n, t, l);
      isNaN(l) && (s = [h.x, h.y], u = [h.x + h.width, h.y + h.height]);
      var f = u[0] - s[0], v = u[1] - s[1], c = y2(n, t, s[0], s[1], f, v, h);
      return r.push(c), c;
    }
  }), r;
}
var Zd = da.prototype, Zu = Ts.prototype, Qm = (
  /** @class */
  /* @__PURE__ */ function() {
    function e() {
      this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.percent = 1;
    }
    return e;
  }()
);
(function(e) {
  B(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t;
})(Qm);
function qu(e) {
  return isNaN(+e.cpx1) || isNaN(+e.cpy1);
}
var Jm = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r) {
      var n = e.call(this, r) || this;
      return n.type = "ec-line", n;
    }
    return t.prototype.getDefaultStyle = function() {
      return {
        stroke: Et.color.neutral99,
        fill: null
      };
    }, t.prototype.getDefaultShape = function() {
      return new Qm();
    }, t.prototype.buildPath = function(r, n) {
      qu(n) ? Zd.buildPath.call(this, r, n) : Zu.buildPath.call(this, r, n);
    }, t.prototype.pointAt = function(r) {
      return qu(this.shape) ? Zd.pointAt.call(this, r) : Zu.pointAt.call(this, r);
    }, t.prototype.tangentAt = function(r) {
      var n = this.shape, i = qu(n) ? [n.x2 - n.x1, n.y2 - n.y1] : Zu.tangentAt.call(this, r);
      return cn(i, i);
    }, t;
  }(st)
), Ku = ["fromSymbol", "toSymbol"];
function qd(e) {
  return "_" + e + "Type";
}
function Kd(e, t, r) {
  var n = t.getItemVisual(r, e);
  if (!n || n === "none")
    return n;
  var i = t.getItemVisual(r, e + "Size"), a = t.getItemVisual(r, e + "Rotate"), o = t.getItemVisual(r, e + "Offset"), s = t.getItemVisual(r, e + "KeepAspect"), u = vh(i), l = ch(o || 0, u);
  return n + u + l + (a || "") + (s || "");
}
function Qd(e, t, r) {
  var n = t.getItemVisual(r, e);
  if (!(!n || n === "none")) {
    var i = t.getItemVisual(r, e + "Size"), a = t.getItemVisual(r, e + "Rotate"), o = t.getItemVisual(r, e + "Offset"), s = t.getItemVisual(r, e + "KeepAspect"), u = vh(i), l = ch(o || 0, u), h = Es(n, -u[0] / 2 + l[0], -u[1] / 2 + l[1], u[0], u[1], null, s);
    return h.__specifiedRotation = a == null || isNaN(a) ? void 0 : +a * Math.PI / 180 || 0, h.name = e, h;
  }
}
function Y2(e) {
  var t = new Jm({
    name: "line",
    subPixelOptimize: !0
  });
  return ff(t.shape, e), t;
}
function ff(e, t) {
  e.x1 = t[0][0], e.y1 = t[0][1], e.x2 = t[1][0], e.y2 = t[1][1], e.percent = 1;
  var r = t[2];
  r ? (e.cpx1 = r[0], e.cpy1 = r[1]) : (e.cpx1 = NaN, e.cpy1 = NaN);
}
var W2 = (
  /** @class */
  function(e) {
    B(t, e);
    function t(r, n, i) {
      var a = e.call(this) || this;
      return a._createLine(r, n, i), a;
    }
    return t.prototype._createLine = function(r, n, i) {
      var a = r.hostModel, o = r.getItemLayout(n), s = r.getItemVisual(n, "z2"), u = Y2(o);
      u.shape.percent = 0, Vf(u, {
        z2: W(s, 0),
        shape: {
          percent: 1
        }
      }, a, n), this.add(u), D(Ku, function(l) {
        var h = Qd(l, r, n);
        this.add(h), this[qd(l)] = Kd(l, r, n);
      }, this), this._updateCommonStl(r, n, i);
    }, t.prototype.updateData = function(r, n, i) {
      var a = r.hostModel, o = this.childOfName("line"), s = r.getItemLayout(n), u = {
        shape: {}
      };
      ff(u.shape, s), pa(o, u, a, n), D(Ku, function(l) {
        var h = Kd(l, r, n), f = qd(l);
        if (this[f] !== h) {
          this.remove(this.childOfName(l));
          var v = Qd(l, r, n);
          this.add(v);
        }
        this[f] = h;
      }, this), this._updateCommonStl(r, n, i);
    }, t.prototype.getLinePath = function() {
      return this.childAt(0);
    }, t.prototype._updateCommonStl = function(r, n, i) {
      var a = r.hostModel, o = this.childOfName("line"), s = i && i.emphasisLineStyle, u = i && i.blurLineStyle, l = i && i.selectLineStyle, h = i && i.labelStatesModels, f = i && i.emphasisDisabled, v = i && i.focus, c = i && i.blurScope;
      if (!i || r.hasItemOption) {
        var d = r.getItemModel(n), y = d.getModel("emphasis");
        s = y.getModel("lineStyle").getLineStyle(), u = d.getModel(["blur", "lineStyle"]).getLineStyle(), l = d.getModel(["select", "lineStyle"]).getLineStyle(), f = y.get("disabled"), v = y.get("focus"), c = y.get("blurScope"), h = Ds(d);
      }
      var p = r.getItemVisual(n, "style"), g = p.stroke;
      o.useStyle(p), o.style.fill = null, o.style.strokeNoScale = !0, o.ensureState("emphasis").style = s, o.ensureState("blur").style = u, o.ensureState("select").style = l, D(Ku, function(b) {
        var M = this.childOfName(b);
        if (M) {
          M.setColor(g), M.style.opacity = p.opacity;
          for (var C = 0; C < Ge.length; C++) {
            var T = Ge[C], I = o.getState(T);
            if (I) {
              var x = I.style || {}, E = M.ensureState(T), L = E.style || (E.style = {});
              x.stroke != null && (L[M.__isEmptyBrush ? "stroke" : "fill"] = x.stroke), x.opacity != null && (L.opacity = x.opacity);
            }
          }
          M.markRedraw();
        }
      }, this);
      var m = a.getRawValue(n);
      Wg(this, h, {
        labelDataIndex: n,
        labelFetcher: {
          getFormattedLabel: function(b, M) {
            return a.getFormattedLabel(b, M, r.dataType);
          }
        },
        inheritColor: g || Et.color.neutral99,
        defaultOpacity: p.opacity,
        defaultText: (m == null ? r.getName(n) : isFinite(m) ? xt(m, 10) : m) + ""
      });
      var _ = this.getTextContent();
      if (_) {
        var S = h.normal;
        _.__align = _.style.align, _.__verticalAlign = _.style.verticalAlign, _.__position = S.get("position") || "middle";
        var w = S.get("distance");
        N(w) || (w = [w, w]), _.__labelDistance = w;
      }
      this.setTextConfig({
        position: null,
        local: !0,
        inside: !1
        // Can't be inside for stroke element.
      }), Rg(this, v, c, f);
    }, t.prototype.highlight = function() {
      ra(this);
    }, t.prototype.downplay = function() {
      na(this);
    }, t.prototype.updateLayout = function(r, n) {
      this.childOfName("line").stopAnimation(), this.setLinePoints(r.getItemLayout(n));
    }, t.prototype.setLinePoints = function(r) {
      var n = this.childOfName("line");
      ff(n.shape, r), n.dirty();
    }, t.prototype.beforeUpdate = function() {
      var r = this, n = r.childOfName("fromSymbol"), i = r.childOfName("toSymbol"), a = r.getTextContent();
      if (!n && !i && (!a || a.ignore))
        return;
      for (var o = 1, s = this.parent; s; )
        s.scaleX && (o /= s.scaleX), s = s.parent;
      var u = r.childOfName("line");
      if (!this.__dirty && !u.__dirty)
        return;
      var l = u.shape.percent, h = u.pointAt(0), f = u.pointAt(l), v = ur([], f, h);
      cn(v, v);
      function c(I, x) {
        var E = I.__specifiedRotation;
        if (E == null) {
          var L = u.tangentAt(x);
          I.attr("rotation", (x === 1 ? -1 : 1) * Math.PI / 2 - Math.atan2(L[1], L[0]));
        } else
          I.attr("rotation", E);
      }
      if (n && (n.setPosition(h), c(n, 0), n.scaleX = n.scaleY = o * l, n.markRedraw()), i && (i.setPosition(f), c(i, 1), i.scaleX = i.scaleY = o * l, i.markRedraw()), a && !a.ignore) {
        a.x = a.y = 0, a.originX = a.originY = 0;
        var d = void 0, y = void 0, p = a.__labelDistance, g = p[0] * o, m = p[1] * o, _ = l / 2, S = u.tangentAt(_), w = [S[1], -S[0]], b = u.pointAt(_);
        w[1] > 0 && (w[0] = -w[0], w[1] = -w[1]);
        var M = S[0] < 0 ? -1 : 1;
        if (a.__position !== "start" && a.__position !== "end") {
          var C = -Math.atan2(S[1], S[0]);
          f[0] < h[0] && (C = Math.PI + C), a.rotation = C;
        }
        var T = void 0;
        switch (a.__position) {
          case "insideStartTop":
          case "insideMiddleTop":
          case "insideEndTop":
          case "middle":
            T = -m, y = "bottom";
            break;
          case "insideStartBottom":
          case "insideMiddleBottom":
          case "insideEndBottom":
            T = m, y = "top";
            break;
          default:
            T = 0, y = "middle";
        }
        switch (a.__position) {
          case "end":
            a.x = v[0] * g + f[0], a.y = v[1] * m + f[1], d = v[0] > 0.8 ? "left" : v[0] < -0.8 ? "right" : "center", y = v[1] > 0.8 ? "top" : v[1] < -0.8 ? "bottom" : "middle";
            break;
          case "start":
            a.x = -v[0] * g + h[0], a.y = -v[1] * m + h[1], d = v[0] > 0.8 ? "right" : v[0] < -0.8 ? "left" : "center", y = v[1] > 0.8 ? "bottom" : v[1] < -0.8 ? "top" : "middle";
            break;
          case "insideStartTop":
          case "insideStart":
          case "insideStartBottom":
            a.x = g * M + h[0], a.y = h[1] + T, d = S[0] < 0 ? "right" : "left", a.originX = -g * M, a.originY = -T;
            break;
          case "insideMiddleTop":
          case "insideMiddle":
          case "insideMiddleBottom":
          case "middle":
            a.x = b[0], a.y = b[1] + T, d = "center", a.originY = -T;
            break;
          case "insideEndTop":
          case "insideEnd":
          case "insideEndBottom":
            a.x = -g * M + f[0], a.y = f[1] + T, d = S[0] >= 0 ? "right" : "left", a.originX = g * M, a.originY = -T;
            break;
        }
        a.scaleX = a.scaleY = o, a.setStyle({
          // Use the user specified text align and baseline first
          verticalAlign: a.__verticalAlign || y,
          align: a.__align || d
        });
      }
    }, t;
  }(Xt)
), X2 = (
  /** @class */
  function() {
    function e(t) {
      this.group = new Xt(), this._LineCtor = t || W2;
    }
    return e.prototype.updateData = function(t) {
      var r = this;
      this._progressiveEls = null;
      var n = this, i = n.group, a = n._lineData;
      n._lineData = t, a || i.removeAll();
      var o = Jd(t);
      t.diff(a).add(function(s) {
        r._doAdd(t, s, o);
      }).update(function(s, u) {
        r._doUpdate(a, t, u, s, o);
      }).remove(function(s) {
        i.remove(a.getItemGraphicEl(s));
      }).execute();
    }, e.prototype.updateLayout = function() {
      var t = this._lineData;
      t && t.eachItemGraphicEl(function(r, n) {
        r.updateLayout(t, n);
      }, this);
    }, e.prototype.incrementalPrepareUpdate = function(t) {
      this._seriesScope = Jd(t), this._lineData = null, this.group.removeAll();
    }, e.prototype.incrementalUpdate = function(t, r, n) {
      this._progressiveEls = [];
      function i(u) {
        !u.isGroup && !$2(u) && (u.incremental = n, u.ensureState("emphasis").hoverLayer = Hf);
      }
      for (var a = t.start; a < t.end; a++) {
        var o = r.getItemLayout(a);
        if (Qu(o)) {
          var s = new this._LineCtor(r, a, this._seriesScope);
          s.traverse(i), this.group.add(s), r.setItemGraphicEl(a, s), this._progressiveEls.push(s);
        }
      }
    }, e.prototype.remove = function() {
      this.group.removeAll();
    }, e.prototype.eachRendered = function(t) {
      Uf(this._progressiveEls || this.group, t);
    }, e.prototype._doAdd = function(t, r, n) {
      var i = t.getItemLayout(r);
      if (Qu(i)) {
        var a = new this._LineCtor(t, r, n);
        t.setItemGraphicEl(r, a), this.group.add(a);
      }
    }, e.prototype._doUpdate = function(t, r, n, i, a) {
      var o = t.getItemGraphicEl(n);
      if (!Qu(r.getItemLayout(i))) {
        this.group.remove(o);
        return;
      }
      o ? o.updateData(r, i, a) : o = new this._LineCtor(r, i, a), r.setItemGraphicEl(i, o), this.group.add(o);
    }, e;
  }()
);
function $2(e) {
  return e.animators && e.animators.length > 0;
}
function Jd(e) {
  var t = e.hostModel, r = t.getModel("emphasis");
  return {
    lineStyle: t.getModel("lineStyle").getLineStyle(),
    emphasisLineStyle: r.getModel(["lineStyle"]).getLineStyle(),
    blurLineStyle: t.getModel(["blur", "lineStyle"]).getLineStyle(),
    selectLineStyle: t.getModel(["select", "lineStyle"]).getLineStyle(),
    emphasisDisabled: r.get("disabled"),
    blurScope: r.get("blurScope"),
    focus: r.get("focus"),
    labelStatesModels: Ds(t)
  };
}
function jd(e) {
  return isNaN(e[0]) || isNaN(e[1]);
}
function Qu(e) {
  return e && !jd(e[0]) && !jd(e[1]);
}
var Ju = [], ju = [], tl = [], On = Nt, el = cr, tp = Math.abs;
function ep(e, t, r) {
  for (var n = e[0], i = e[1], a = e[2], o = 1 / 0, s, u = r * r, l = 0.1, h = 0.1; h <= 0.9; h += 0.1) {
    Ju[0] = On(n[0], i[0], a[0], h), Ju[1] = On(n[1], i[1], a[1], h);
    var f = tp(el(Ju, t) - u);
    f < o && (o = f, s = h);
  }
  for (var v = 0; v < 32; v++) {
    var c = s + l;
    ju[0] = On(n[0], i[0], a[0], s), ju[1] = On(n[1], i[1], a[1], s), tl[0] = On(n[0], i[0], a[0], c), tl[1] = On(n[1], i[1], a[1], c);
    var f = el(ju, t) - u;
    if (tp(f) < 0.01)
      break;
    var d = el(tl, t) - u;
    l /= 2, f < 0 ? d >= 0 ? s = s + l : s = s - l : d >= 0 ? s = s - l : s = s + l;
  }
  return s;
}
function rl(e, t) {
  var r = [], n = Zi, i = [[], [], []], a = [[], []], o = [];
  t /= 2, e.eachEdge(function(s, u) {
    var l = s.getLayout(), h = s.getVisual("fromSymbol"), f = s.getVisual("toSymbol");
    l.__original || (l.__original = [ke(l[0]), ke(l[1])], l[2] && l.__original.push(ke(l[2])));
    var v = l.__original;
    if (l[2] != null) {
      if (bt(i[0], v[0]), bt(i[1], v[2]), bt(i[2], v[1]), h && h !== "none") {
        var c = ki(s.node1), d = ep(i, v[0], c * t);
        n(i[0][0], i[1][0], i[2][0], d, r), i[0][0] = r[3], i[1][0] = r[4], n(i[0][1], i[1][1], i[2][1], d, r), i[0][1] = r[3], i[1][1] = r[4];
      }
      if (f && f !== "none") {
        var c = ki(s.node2), d = ep(i, v[1], c * t);
        n(i[0][0], i[1][0], i[2][0], d, r), i[1][0] = r[1], i[2][0] = r[2], n(i[0][1], i[1][1], i[2][1], d, r), i[1][1] = r[1], i[2][1] = r[2];
      }
      bt(l[0], i[0]), bt(l[1], i[2]), bt(l[2], i[1]);
    } else {
      if (bt(a[0], v[0]), bt(a[1], v[1]), ur(o, a[1], a[0]), cn(o, o), h && h !== "none") {
        var c = ki(s.node1);
        Lo(a[0], a[0], o, c * t);
      }
      if (f && f !== "none") {
        var c = ki(s.node2);
        Lo(a[1], a[1], o, -c * t);
      }
      bt(l[0], a[0]), bt(l[1], a[1]);
    }
  });
}
var Z2 = ut();
function q2(e) {
  if (e)
    return Z2(e).bridge;
}
var K2 = (
  /** @class */
  function(e) {
    B(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = Ht, r;
    }
    return t.prototype.init = function(r, n) {
      var i = new HI(), a = new X2(), o = this.group, s = new Xt();
      this._controller = new XI(n.getZr()), s.add(i.group), s.add(a.group), o.add(s), this._symbolDraw = i, this._lineDraw = a, this._mainGroup = s, this._firstRender = !0;
    }, t.prototype.render = function(r, n, i) {
      var a = this, o = ns(r), s = !1;
      this._model = r, this._api = i, this._active = !0;
      var u = this._mainGroup, l = this._getThumbnailInfo();
      l && l.bridge.reset(i);
      var h = this._symbolDraw, f = this._lineDraw;
      o && Yd(u, ti, o, this._firstRender ? null : r), rl(r.getGraph(), Oi(r));
      var v = r.getData();
      h.updateData(v);
      var c = r.getEdgeData();
      f.updateData(c), this._updateNodeAndLinkScale(), o && d2(r, i, this._controller, function(S, w, b) {
        return r.coordinateSystem.containPoint([w, b]);
      }), clearTimeout(this._layoutTimeout);
      var d = r.forceLayout, y = r.get(["force", "layoutAnimation"]);
      d && (s = !0, this._startForceLayoutIteration(d, i, y));
      var p = r.get("layout");
      v.graph.eachNode(function(S) {
        var w = S.dataIndex, b = S.getGraphicEl(), M = S.getModel();
        if (b) {
          b.off("drag").off("dragend");
          var C = M.get("draggable");
          C && b.on("drag", function(I) {
            switch (p) {
              case "force":
                d.warmUp(), !a._layouting && a._startForceLayoutIteration(d, i, y), d.setFixed(w), v.setItemLayout(w, [b.x, b.y]);
                break;
              case "circular":
                v.setItemLayout(w, [b.x, b.y]), S.setLayout({
                  fixed: !0
                }, !0), Nh(r, "symbolSize", S, [I.offsetX, I.offsetY]), a.updateLayout(r);
                break;
              case "none":
              default:
                v.setItemLayout(w, [b.x, b.y]), kh(r.getGraph(), r), a.updateLayout(r);
                break;
            }
          }).on("dragend", function() {
            d && d.setUnfixed(w);
          }), b.setDraggable(C, !!M.get("cursor"));
          var T = M.get(["emphasis", "focus"]);
          T === "adjacency" && (Ft(b).focus = S.getAdjacentDataIndices());
        }
      }), v.graph.eachEdge(function(S) {
        var w = S.getGraphicEl(), b = S.getModel().get(["emphasis", "focus"]);
        w && b === "adjacency" && (Ft(w).focus = {
          edge: [S.dataIndex],
          node: [S.node1.dataIndex, S.node2.dataIndex]
        });
      });
      var g = r.get("layout") === "circular" && r.get(["circular", "rotateLabel"]), m = v.getLayout("cx"), _ = v.getLayout("cy");
      v.graph.eachNode(function(S) {
        Km(S, g, m, _);
      }), this._firstRender = !1, s || this._renderThumbnail(r, i, this._symbolDraw, this._lineDraw);
    }, t.prototype.dispose = function() {
      this.remove(), this._controller && this._controller.dispose();
    }, t.prototype._startForceLayoutIteration = function(r, n, i) {
      var a = this, o = !1;
      (function s() {
        r.step(function(u) {
          a.updateLayout(a._model), (u || !o) && (o = !0, a._renderThumbnail(a._model, n, a._symbolDraw, a._lineDraw)), (a._layouting = !u) && (i ? a._layoutTimeout = setTimeout(s, 16) : s());
        });
      })();
    }, t.prototype.__updateOnOwnRoam = function(r, n, i) {
      var a = ns(n);
      !this._active || !a || (Yd(this._mainGroup, ti, a, null), g2(r) && (this._updateNodeAndLinkScale(), rl(n.getGraph(), Oi(n)), this._lineDraw.updateLayout(), i.updateLabelLayout()), this._updateThumbnailWindow());
    }, t.prototype._updateNodeAndLinkScale = function() {
      var r = this._model, n = r.getData(), i = Oi(r);
      n.eachItemGraphicEl(function(a, o) {
        a && a.setSymbolScale(i);
      });
    }, t.prototype.updateLayout = function(r) {
      this._active && (rl(r.getGraph(), Oi(r)), this._symbolDraw.updateLayout(), this._lineDraw.updateLayout());
    }, t.prototype.remove = function() {
      this._active = !1, clearTimeout(this._layoutTimeout), this._layouting = !1, this._layoutTimeout = null, this._symbolDraw && this._symbolDraw.remove(), this._lineDraw && this._lineDraw.remove(), this._controller && this._controller.disable();
    }, t.prototype._getThumbnailInfo = function() {
      var r = this._model, n = r.coordinateSystem;
      if (n.type === "view") {
        var i = q2(r);
        if (i)
          return {
            bridge: i,
            coordSys: n
          };
      }
    }, t.prototype._updateThumbnailWindow = function() {
      var r = this._getThumbnailInfo();
      r && r.bridge.updateWindow(Nd(null, r.coordSys), this._api);
    }, t.prototype._renderThumbnail = function(r, n, i, a) {
      var o = this._getThumbnailInfo();
      if (o) {
        var s = new Xt(), u = i.group.children(), l = a.group.children(), h = new Xt(), f = new Xt();
        s.add(f), s.add(h);
        for (var v = 0; v < u.length; v++) {
          var c = u[v], d = c.children()[0], y = c.x, p = c.y, g = $(d.shape), m = A(g, {
            width: d.scaleX,
            height: d.scaleY,
            x: y - d.scaleX / 2,
            y: p - d.scaleY / 2
          }), _ = $(d.style), S = new d.constructor({
            shape: m,
            style: _,
            z2: 151
          });
          f.add(S);
        }
        for (var v = 0; v < l.length; v++) {
          var c = l[v], w = c.children()[0], _ = $(w.style), m = $(w.shape), b = new Jm({
            style: _,
            shape: m,
            z2: 151
          });
          h.add(b);
        }
        o.bridge.renderContent({
          api: n,
          roamType: r.get("roam"),
          viewportRect: null,
          group: s,
          targetTrans: Nd(null, o.coordSys)
        });
      }
    }, t.type = Ht, t;
  }(we)
), Q2 = oi(Ht, J2);
function J2(e) {
  var t = e.findComponents({
    mainType: "legend"
  });
  !t || !t.length || e.eachSeriesByType(Ht, function(r) {
    var n = r.getCategoriesData(), i = r.getGraph(), a = i.data, o = n.mapArray(n.getName);
    a.filterSelf(function(s) {
      var u = a.getItemModel(s), l = u.getShallow("category");
      if (l != null) {
        pt(l) && (l = o[l]);
        for (var h = 0; h < t.length; h++)
          if (!t[h].isSelected(l))
            return !1;
      }
      return !0;
    });
  });
}
var j2 = oi(Ht, tx);
function tx(e) {
  var t = {};
  e.eachSeriesByType(Ht, function(r) {
    var n = r.getCategoriesData(), i = r.getData(), a = {};
    n.each(function(o) {
      var s = n.getName(o);
      a["ec-" + s] = o;
      var u = n.getItemModel(o), l = u.getModel("itemStyle").getItemStyle();
      l.fill || (l.fill = r.getColorFromPalette(s, t)), n.setItemVisual(o, "style", l);
      for (var h = ["symbol", "symbolSize", "symbolKeepAspect"], f = 0; f < h.length; f++) {
        var v = u.getShallow(h[f], !0);
        v != null && n.setItemVisual(o, h[f], v);
      }
    }), n.count() && i.each(function(o) {
      var s = i.getItemModel(o), u = s.getShallow("category");
      if (u != null) {
        G(u) && (u = a["ec-" + u]);
        var l = n.getItemVisual(u, "style"), h = i.ensureUniqueItemVisual(o, "style");
        A(h, l);
        for (var f = ["symbol", "symbolSize", "symbolKeepAspect"], v = 0; v < f.length; v++)
          i.setItemVisual(o, f[v], n.getItemVisual(u, f[v]));
      }
    });
  });
}
function ex(e) {
  e.registerChartView(K2), e.registerSeriesModel(R2), e.registerProcessor(Q2), e.registerVisual(j2), e.registerVisual(P2), e.registerLayout(O2), e.registerLayout(e.PRIORITY.VISUAL.POST_CHART_LAYOUT, B2), e.registerLayout(V2), e.registerCoordinateSystem("graphView", {
    dimensions: Nm.dimensions,
    create: U2
  }), e.registerAction({
    type: "focusNodeAdjacency",
    event: "focusNodeAdjacency",
    update: "series:focusNodeAdjacency"
  }, St), e.registerAction({
    type: "unfocusNodeAdjacency",
    event: "unfocusNodeAdjacency",
    update: "series:unfocusNodeAdjacency"
  }, St), p2(e, Ss, Ht);
}
function rp(e, t, r) {
  var n = Tt.createCanvas(), i = t.getWidth(), a = t.getHeight(), o = n.style;
  return o && (o.position = "absolute", o.left = "0", o.top = "0", o.width = i + "px", o.height = a + "px", n.setAttribute("data-zr-dom-id", e)), n.width = i * r, n.height = a * r, n;
}
function nl(e) {
  return !e.__cursors.get(zg);
}
function np(e) {
  var t = e.__cursors.get(zg);
  return {
    startIdx: t ? t.startIdx : 0,
    endIdx: t ? t.endIdx : 0
  };
}
var jm = function(e) {
  B(t, e);
  function t(r, n, i) {
    var a = e.call(this) || this;
    a.motionBlur = !1, a.lastFrameAlpha = 0.7, a.dpr = 1, a.virtual = !1, a.config = {}, a.zlevel = 0, a.zlevel2 = go, a.maxRepaintRectCount = 5, a.__dirty = !0, a.__firstTimePaint = !0, a.__prevIdx = { startIdx: 0, endIdx: 0 };
    var o;
    i = i || No, typeof r == "string" ? o = rp(r, n, i) : F(r) && (o = r, r = o.id), a.id = r, a.dom = o;
    var s = o.style;
    return s && (yf(o), o.onselectstart = function() {
      return !1;
    }, s.padding = "0", s.margin = "0", s.borderWidth = "0"), a.painter = n, a.dpr = i, a;
  }
  return t.prototype.afterBrush = function() {
    this.__prevIdx = np(this);
  }, t.prototype.initContext = function() {
    this.ctx = this.dom.getContext("2d"), this.ctx.dpr = this.dpr;
  }, t.prototype.setUnpainted = function() {
    this.__firstTimePaint = !0;
  }, t.prototype.createBackBuffer = function() {
    var r = this.dpr;
    this.domBack = rp("back-" + this.id, this.painter, r), this.ctxBack = this.domBack.getContext("2d"), r !== 1 && this.ctxBack.scale(r, r);
  }, t.prototype.createRepaintRects = function(r, n, i, a) {
    if (this.__firstTimePaint)
      return this.__firstTimePaint = !1, null;
    var o = [], s = this.maxRepaintRectCount, u = !1, l = new H(0, 0, 0, 0);
    function h(S) {
      if (!(!S.isFinite() || S.isZero()))
        if (o.length === 0) {
          var w = new H(0, 0, 0, 0);
          w.copy(S), o.push(w);
        } else {
          for (var b = !1, M = 1 / 0, C = 0, T = 0; T < o.length; ++T) {
            var I = o[T];
            if (I.intersect(S)) {
              var x = new H(0, 0, 0, 0);
              x.copy(I), x.union(S), o[T] = x, b = !0;
              break;
            } else if (u) {
              l.copy(S), l.union(I);
              var E = S.width * S.height, L = I.width * I.height, R = l.width * l.height, k = R - E - L;
              k < M && (M = k, C = T);
            }
          }
          if (u && (o[C].union(S), b = !0), !b) {
            var w = new H(0, 0, 0, 0);
            w.copy(S), o.push(w);
          }
          u || (u = o.length >= s);
        }
    }
    for (var f = np(this), v = f.startIdx; v < f.endIdx; ++v) {
      var c = r[v];
      if (c) {
        var d = c.shouldBePainted(i, a, !0, !0), y = c.__isRendered && (c.__dirty & Wt || !d) ? c.getPrevPaintRect() : null;
        y && h(y);
        var p = d && (c.__dirty & Wt || !c.__isRendered) ? c.getPaintRect() : null;
        p && h(p);
      }
    }
    for (var g = this.__prevIdx, v = g.startIdx; v < g.endIdx; ++v) {
      var c = n[v], d = c && c.shouldBePainted(i, a, !0, !0);
      if (c && (!d || !c.__zr) && c.__isRendered) {
        var y = c.getPrevPaintRect();
        y && h(y);
      }
    }
    var m;
    do {
      m = !1;
      for (var v = 0; v < o.length; ) {
        if (o[v].isZero()) {
          o.splice(v, 1);
          continue;
        }
        for (var _ = v + 1; _ < o.length; )
          o[v].intersect(o[_]) ? (m = !0, o[v].union(o[_]), o.splice(_, 1)) : _++;
        v++;
      }
    } while (m);
    return this._paintRects = o, o;
  }, t.prototype.debugGetPaintRects = function() {
    return (this._paintRects || []).slice();
  }, t.prototype.resize = function(r, n) {
    var i = this.dpr, a = this.dom, o = a.style, s = this.domBack;
    o && (o.width = r + "px", o.height = n + "px"), a.width = r * i, a.height = n * i, s && (s.width = r * i, s.height = n * i, i !== 1 && this.ctxBack.scale(i, i));
  }, t.prototype.clear = function(r, n, i) {
    var a = this.dom, o = this.ctx, s = a.width, u = a.height;
    n = n || this.clearColor;
    var l = this.motionBlur && !r, h = this.lastFrameAlpha, f = this.dpr, v = this;
    l && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(a, 0, 0, s / f, u / f));
    var c = this.domBack;
    function d(y, p, g, m) {
      if (o.clearRect(y, p, g, m), n && n !== "transparent") {
        var _ = void 0;
        if (fa(n)) {
          var S = n.global || n.__width === g && n.__height === m;
          _ = S && n.__canvasGradient || Kl(o, n, {
            x: 0,
            y: 0,
            width: g,
            height: m
          }), n.__canvasGradient = _, n.__width = g, n.__height = m;
        } else hp(n) && (n.scaleX = n.scaleX || f, n.scaleY = n.scaleY || f, _ = Ql(o, n, {
          dirty: function() {
            v.setUnpainted(), v.painter.refresh();
          }
        }));
        o.save(), o.fillStyle = _ || n, o.fillRect(y, p, g, m), o.restore();
      }
      l && (o.save(), o.globalAlpha = h, o.drawImage(c, y, p, g, m), o.restore());
    }
    !i || l ? d(0, 0, s, u) : i.length && D(i, function(y) {
      d(y.x * f, y.y * f, y.width * f, y.height * f);
    });
  }, t;
}(Te), ip = 1e5, qr = 314159, il = void 0, rx = 1, al = 2;
function nx(e) {
  return e ? e.__builtin__ ? !0 : !(typeof e.resize != "function" || typeof e.refresh != "function") : !1;
}
function ix(e, t) {
  var r = document.createElement("div");
  return r.style.cssText = [
    "position:relative",
    "width:" + e + "px",
    "height:" + t + "px",
    "padding:0",
    "margin:0",
    "border-width:0"
  ].join(";") + ";", r;
}
function ap(e, t, r, n) {
  var i = new jm(e, t, t.dpr);
  return i.zlevel = r, i.zlevel2 = n, i.__builtin__ = !0, t0(i), i;
}
function t0(e) {
  e.__cursorStack = [], e.__cursors = V();
}
function ax(e) {
  return e.startIdx = e.drawIdx = e.endIdx = e.endIdxNew = 0, e.used = !1, e.first = e.last = NaN, e.notClearIdx = -1, e;
}
function ox(e, t) {
  var r = e.__cursors, n = +t;
  return r.get(n) || (e.__cursorStack.push(n), r.set(n, ax({ key: n })));
}
function io(e, t) {
  for (var r = e.__cursorStack, n = 0; n < r.length; n++)
    t(e.__cursors.get(r[n]));
}
function ol(e, t) {
  var r = e.layers;
  return r[t] || (r[t] = new Array(3));
}
function Mt(e, t, r) {
  for (var n = e.layerStack, i = 0; i < n.length; i++) {
    var a = n[i].zl, o = n[i].zl2, s = e.layers[a][o];
    (!r || (!(r & Wi) || s.__builtin__) && (!(r & hf) || !s.__builtin__) && (!(r & e0) || s !== e.hoverlayer)) && t(s, a, o, i);
  }
}
var Wi = 1, hf = 2, e0 = 4, ao = Wi | e0, sx = function() {
  function e(t, r, n, i) {
    this.type = "canvas", this._prevDisplayList = [], this._layerConfig = {}, this._needsManuallyCompositing = !1, this.type = "canvas", this._i = {
      layerStack: [],
      layers: []
    };
    var a = !t.nodeName || t.nodeName.toUpperCase() === "CANVAS";
    this._opts = n = A({}, n || {}), this.dpr = n.devicePixelRatio || No, this._singleCanvas = a, this.root = t;
    var o = t.style;
    if (o && (yf(t), t.innerHTML = ""), this.storage = r, this._prevDisplayList = [], a) {
      var u = t, l = u.width, h = u.height;
      n.width != null && (l = n.width), n.height != null && (h = n.height), this.dpr = n.devicePixelRatio || 1, u.width = l * this.dpr, u.height = h * this.dpr, this._width = l, this._height = h;
      var f = ap(u, this, qr, go);
      f.initContext(), this._insertLayer(f, qr, go, !0), this._domRoot = t;
    } else {
      this._width = Ua(t, 0, n), this._height = Ua(t, 1, n);
      var s = this._domRoot = ix(this._width, this._height);
      t.appendChild(s);
    }
  }
  return e.prototype.getType = function() {
    return "canvas";
  }, e.prototype.isSingleCanvas = function() {
    return this._singleCanvas;
  }, e.prototype.getViewportRoot = function() {
    return this._domRoot;
  }, e.prototype.getViewportRootOffset = function() {
    var t = this.getViewportRoot();
    if (t)
      return {
        offsetLeft: t.offsetLeft || 0,
        offsetTop: t.offsetTop || 0
      };
  }, e.prototype.refresh = function(t) {
    var r;
    t && !F(t) ? r = { paintAll: !!t } : r = t || {};
    var n = W(r.refresh, !0), i = W(r.refreshHover, !1);
    if (i && (this._hoverLayerDirty = al), !n)
      return i && this._paintHoverList(this.storage.getDisplayList(!1)), this;
    var a = this.storage.getDisplayList(!0);
    this._updateLayerStatus(a, r.paintAll), this._redrawId = Math.random();
    var o = this._prevDisplayList;
    this._paintList(a, o, this._redrawId);
    var s = this._backgroundColor;
    return Mt(this._i, function(u, l, h, f) {
      u.refresh && u.refresh(f === 0 ? s : null);
    }, hf), this._opts.useDirtyRect && (this._prevDisplayList = a.slice()), this;
  }, e.prototype._paintHoverList = function(t) {
    var r = this._i.hoverlayer, n = this._hoverLayerDirty;
    if (this._hoverLayerDirty = il, n !== il && (!r && n === al && (r = this._i.hoverlayer = this._ensureLayer(ip)), !!r)) {
      r.clear();
      for (var i = {
        inHover: !0,
        viewWidth: this._width,
        viewHeight: this._height,
        beforeBrushParam: {}
      }, a, o = 0, s = t.length; o < s; o++) {
        var u = t[o];
        if (u.__inHover) {
          a || (a = r.ctx, a.save());
          var l = u.__hoverStyle, h = void 0;
          l && (h = u.style, u.style = l), tn(a, u, i), l && (u.style = h);
        }
      }
      a && (Wn(a, i), a.restore());
    }
  }, e.prototype.getHoverLayer = function() {
    return this._ensureLayer(ip);
  }, e.prototype.paintOne = function(t, r) {
    dh(t, r);
  }, e.prototype._paintList = function(t, r, n) {
    if (this._redrawId === n) {
      var i = this._doPaintList(t, r);
      if (this._needsManuallyCompositing && this._compositeManually(), i)
        Mt(this._i, function(o) {
          o.afterBrush && o.afterBrush();
        }, ao), this._paintHoverList(t);
      else {
        var a = this;
        Po(function() {
          a._paintList(t, r, n);
        });
      }
    }
  }, e.prototype._compositeManually = function() {
    var t = this._ensureLayer(qr).ctx, r = this._domRoot.width, n = this._domRoot.height;
    t.clearRect(0, 0, r, n), Mt(this._i, function(i) {
      i.virtual && t.drawImage(i.dom, 0, 0, r, n);
    }, Wi);
  }, e.prototype._doPaintList = function(t, r) {
    var n = this, i = !0;
    return Mt(this._i, function(a) {
      var o = !1;
      if (io(a, function(f) {
        (f.drawIdx < f.endIdx || f.notClearIdx >= 0) && (o = !0);
      }), !(!o && !a.__dirty)) {
        var s = n._opts.useDirtyRect && !nl(a) ? a.createRepaintRects(t, r, n._width, n._height) : null, u = n._i.layerStack[0], l = !0;
        if (a.__dirty) {
          l = !1, a.__dirty = !1;
          var h = a.zlevel === u.zl && a.zlevel2 === u.zl2 ? n._backgroundColor : null;
          a.clear(!1, h, s);
        }
        io(a, function(f) {
          var v = n._paintPerCursor(a, f, t, s, l);
          i = i && v;
        });
      }
    }, ao), tt.wxa && Mt(this._i, function(a) {
      a && a.ctx && a.ctx.draw && a.ctx.draw();
    }), i;
  }, e.prototype._paintPerCursor = function(t, r, n, i, a) {
    var o = t.ctx;
    if (i)
      if (!i.length)
        r.drawIdx = r.endIdx;
      else
        for (var s = this.dpr, u = 0; u < i.length; ++u) {
          var l = i[u];
          o.save(), o.beginPath(), o.rect(l.x * s, l.y * s, l.width * s, l.height * s), o.clip(), this._paintPerCursorInRect(t, r, n, l, a), o.restore();
        }
    else
      o.save(), this._paintPerCursorInRect(t, r, n, null, a), o.restore();
    return r.drawIdx >= r.endIdx;
  }, e.prototype._paintPerCursorInRect = function(t, r, n, i, a) {
    for (var o = {
      inHover: !1,
      allClipped: !1,
      prevEl: null,
      viewWidth: this._width,
      viewHeight: this._height,
      beforeBrushParam: { contentRetained: a }
    }, s = t.ctx, u = nl(t), l = u && Tt.getTime(), h = r.drawIdx, f = r.notClearIdx, v = f >= 0 ? Math.min(f, h) : h; v < r.endIdx; v++) {
      var c = n[v];
      if (!(v < h && !c.notClear)) {
        if (c.__inHover && (this._hoverLayerDirty = al), i != null) {
          var d = c.getPaintRect();
          d && d.intersect(i) && (tn(s, c, o), c.setPrevPaintRect(d));
        } else
          tn(s, c, o);
        if (u) {
          var y = Tt.getTime() - l;
          if (y > 15) {
            v++;
            break;
          }
        }
      }
    }
    Wn(s, o), r.drawIdx = Math.max(v, h);
  }, e.prototype.getLayer = function(t, r) {
    return this._ensureLayer(t, 0, r);
  }, e.prototype._ensureLayer = function(t, r, n) {
    r = r || 0;
    var i = this._singleCanvas;
    i && !this._needsManuallyCompositing && (t = qr, r = 0);
    var a = ol(this._i, t)[r];
    return a || (a = ap("zr_" + t + "." + r, this, t, r), this._layerConfig[t] && ct(a, this._layerConfig[t], !0), (n || i && t !== qr) && (a.virtual = !0), this._insertLayer(a, t, r, !1), a.initContext()), a;
  }, e.prototype.insertLayer = function(t, r) {
    this._insertLayer(r, t, 0, !1);
  }, e.prototype._insertLayer = function(t, r, n, i) {
    var a = this._i, o = a.layers, s = a.layerStack, u = this._domRoot, l = null;
    if (!(o[r] && o[r][n]) && nx(t)) {
      for (var h = s.length, f = 0; f < h && (s[f].zl < r || s[f].zl === r && s[f].zl2 < n); )
        f++;
      if (f > 0 && (l = ol(a, s[f - 1].zl)[s[f - 1].zl2]), s.splice(f, 0, { zl: r, zl2: n }), ol(a, r)[n] = t, !i && !t.virtual)
        if (l) {
          var v = l.dom;
          v.nextSibling ? u.insertBefore(t.dom, v.nextSibling) : u.appendChild(t.dom);
        } else
          u.firstChild ? u.insertBefore(t.dom, u.firstChild) : u.appendChild(t.dom);
      t.painter || (t.painter = this);
    }
  }, e.prototype.eachLayer = function(t, r) {
    return Mt(this._i, function(n, i) {
      t.call(r, n, i);
    });
  }, e.prototype.eachBuiltinLayer = function(t, r) {
    return Mt(this._i, function(n, i) {
      t.call(r, n, i);
    }, Wi);
  }, e.prototype.eachOtherLayer = function(t, r) {
    return Mt(this._i, function(n, i) {
      t.call(r, n, i);
    }, hf);
  }, e.prototype.getLayers = function() {
    var t = {};
    return Mt(this._i, function(r, n, i) {
      t[r.id] = r;
    }), t;
  }, e.prototype._updateLayerStatus = function(t, r) {
    var n = this;
    if (n._singleCanvas)
      for (var i = 1; i < t.length; i++) {
        var a = t[i];
        if (a.zlevel !== t[i - 1].zlevel || a.incremental) {
          n._needsManuallyCompositing = !0;
          break;
        }
      }
    Mt(n._i, function(p) {
      p.__dirty = !1, io(p, function(g) {
        g.used = !1, g.endIdxNew = 0, g.notClearIdx = -1;
      });
    }, ao);
    for (var o, s = null, u = null, l = !1, h = 0, f = t.length; h < f; h++) {
      var a = t[h], v = a.zlevel, c = a.incremental, d = void 0;
      if (o !== v && (o = v, l = !1), c ? (l = !0, d = Ww) : d = l ? Yw : go, (!s || v !== s.zlevel || d !== s.zlevel2) && (s = n._ensureLayer(v, d), u = null, !s.__builtin__)) {
        as("ZLevel " + v + " has been used by unknown layer " + s.id);
        continue;
      }
      if ((!u || c !== u.key) && (u = ox(s, c), !u.used))
        if (u.used = !0, !r && u.first === a.id) {
          var y = h - u.startIdx;
          u.startIdx = h, u.drawIdx += y, u.endIdx += y;
        } else
          s.__dirty = !0, u.first = a.id, u.startIdx = u.drawIdx = h, u.endIdx = h + 1;
      u.endIdxNew = h + 1, a.__dirty & Wt && !a.__inHover && ((!c || !a.notClear && h < u.drawIdx) && (s.__dirty = !0), c && a.notClear && u.notClearIdx < 0 && (u.notClearIdx = h));
    }
    Mt(n._i, function(p) {
      for (var g = p.__cursorStack, m = p.__cursors, _ = g.length - 1; _ >= 0; _--) {
        var S = m.get(g[_]);
        if (!S.used)
          p.__dirty = !0, m.removeKey(g[_]), g.splice(_, 1);
        else {
          var w = S.endIdxNew;
          (nl(p) ? w < S.drawIdx : w !== S.endIdx || !w || t[w - 1].id !== S.last) && (p.__dirty = !0), S.endIdx = S.endIdxNew, S.last = w ? t[w - 1].id : NaN;
        }
      }
      p.__dirty && (io(p, function(b) {
        b.drawIdx = b.startIdx;
      }), n._hoverLayerDirty === il && (n._hoverLayerDirty = rx));
    }, ao);
  }, e.prototype.clear = function() {
    return Mt(this._i, function(t) {
      t.clear(), t0(t);
    }, Wi), this;
  }, e.prototype.setBackgroundColor = function(t) {
    this._backgroundColor = t, Mt(this._i, function(r) {
      r.setUnpainted();
    });
  }, e.prototype.configLayer = function(t, r) {
    if (r) {
      var n = this._layerConfig;
      n[t] ? ct(n[t], r, !0) : n[t] = r, Mt(this._i, function(i, a) {
        ct(i, n[a], !0);
      });
    }
  }, e.prototype.delLayer = function(t) {
    for (var r = this._i.layerStack, n = this._i.layers, i = r.length - 1; i >= 0; i--) {
      var a = r[i];
      if (a.zl === t) {
        var o = n[t][a.zl2];
        if (o.__builtin__)
          continue;
        if (r.splice(i, 1), n[t][a.zl2] = void 0, !o.virtual) {
          var s = o.dom.parentNode;
          s && s.removeChild(o.dom);
        }
      }
    }
  }, e.prototype.resize = function(t, r) {
    if (this._domRoot.style) {
      var n = this._domRoot;
      n.style.display = "none";
      var i = this._opts, a = this.root;
      t != null && (i.width = t), r != null && (i.height = r), t = Ua(a, 0, i), r = Ua(a, 1, i), n.style.display = "", (this._width !== t || r !== this._height) && (n.style.width = t + "px", n.style.height = r + "px", Mt(this._i, function(o) {
        o.resize(t, r);
      }), this.refresh({ paintAll: !0 })), this._width = t, this._height = r;
    } else {
      if (t == null || r == null)
        return;
      this._width = t, this._height = r, this._ensureLayer(qr).resize(t, r);
    }
    return this;
  }, e.prototype.clearLayer = function(t) {
    D(this._i.layers[t], function(r) {
      r && !r.__builtin__ && r.clear();
    });
  }, e.prototype.dispose = function() {
    this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._i = null;
  }, e.prototype.getRenderedCanvas = function(t) {
    if (t = t || {}, this._singleCanvas && !this._compositeManually)
      return this._i.layers[qr][0].dom;
    var r = new jm("image", this, t.pixelRatio || this.dpr);
    r.initContext(), r.clear(!1, t.backgroundColor || this._backgroundColor);
    var n = r.ctx;
    if (t.pixelRatio <= this.dpr) {
      this.refresh();
      var i = r.dom.width, a = r.dom.height;
      Mt(this._i, function(f) {
        f.__builtin__ ? n.drawImage(f.dom, 0, 0, i, a) : f.renderToCanvas && (n.save(), f.renderToCanvas(n), n.restore());
      });
    } else {
      for (var o = {
        inHover: !1,
        viewWidth: this._width,
        viewHeight: this._height,
        beforeBrushParam: {}
      }, s = this.storage.getDisplayList(!0), u = 0, l = s.length; u < l; u++) {
        var h = s[u];
        tn(n, h, o);
      }
      Wn(n, o);
    }
    return r.dom;
  }, e.prototype.getWidth = function() {
    return this._width;
  }, e.prototype.getHeight = function() {
    return this._height;
  }, e;
}();
function ux(e) {
  e.registerPainter("canvas", sx);
}
Eh([ex, ux]);
console.log(BI);
