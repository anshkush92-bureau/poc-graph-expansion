function Ju(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qu = { exports: {} }, M = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Ki = Object.getOwnPropertySymbols, da = Object.prototype.hasOwnProperty, pa = Object.prototype.propertyIsEnumerable;
function ma(e) {
  if (e == null)
    throw new TypeError("Object.assign cannot be called with null or undefined");
  return Object(e);
}
function ha() {
  try {
    if (!Object.assign)
      return !1;
    var e = new String("abc");
    if (e[5] = "de", Object.getOwnPropertyNames(e)[0] === "5")
      return !1;
    for (var t = {}, n = 0; n < 10; n++)
      t["_" + String.fromCharCode(n)] = n;
    var r = Object.getOwnPropertyNames(t).map(function(i) {
      return t[i];
    });
    if (r.join("") !== "0123456789")
      return !1;
    var l = {};
    return "abcdefghijklmnopqrst".split("").forEach(function(i) {
      l[i] = i;
    }), Object.keys(Object.assign({}, l)).join("") === "abcdefghijklmnopqrst";
  } catch (i) {
    return !1;
  }
}
var bu = ha() ? Object.assign : function(e, t) {
  for (var n, r = ma(e), l, i = 1; i < arguments.length; i++) {
    n = Object(arguments[i]);
    for (var u in n)
      da.call(n, u) && (r[u] = n[u]);
    if (Ki) {
      l = Ki(n);
      for (var o = 0; o < l.length; o++)
        pa.call(n, l[o]) && (r[l[o]] = n[l[o]]);
    }
  }
  return r;
};
/** @license React v16.14.0
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xl = bu, ve = typeof Symbol == "function" && Symbol.for, yn = ve ? Symbol.for("react.element") : 60103, va = ve ? Symbol.for("react.portal") : 60106, ya = ve ? Symbol.for("react.fragment") : 60107, ga = ve ? Symbol.for("react.strict_mode") : 60108, wa = ve ? Symbol.for("react.profiler") : 60114, Ea = ve ? Symbol.for("react.provider") : 60109, Ta = ve ? Symbol.for("react.context") : 60110, ka = ve ? Symbol.for("react.forward_ref") : 60112, xa = ve ? Symbol.for("react.suspense") : 60113, Sa = ve ? Symbol.for("react.memo") : 60115, Ca = ve ? Symbol.for("react.lazy") : 60116, Bi = typeof Symbol == "function" && Symbol.iterator;
function gn(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var eo = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, to = {};
function Dt(e, t, n) {
  this.props = e, this.context = t, this.refs = to, this.updater = n || eo;
}
Dt.prototype.isReactComponent = {};
Dt.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error(gn(85));
  this.updater.enqueueSetState(this, e, t, "setState");
};
Dt.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function no() {
}
no.prototype = Dt.prototype;
function Gl(e, t, n) {
  this.props = e, this.context = t, this.refs = to, this.updater = n || eo;
}
var Zl = Gl.prototype = new no();
Zl.constructor = Gl;
Xl(Zl, Dt.prototype);
Zl.isPureReactComponent = !0;
var Jl = { current: null }, ro = Object.prototype.hasOwnProperty, lo = { key: !0, ref: !0, __self: !0, __source: !0 };
function io(e, t, n) {
  var r, l = {}, i = null, u = null;
  if (t != null) for (r in t.ref !== void 0 && (u = t.ref), t.key !== void 0 && (i = "" + t.key), t) ro.call(t, r) && !lo.hasOwnProperty(r) && (l[r] = t[r]);
  var o = arguments.length - 2;
  if (o === 1) l.children = n;
  else if (1 < o) {
    for (var f = Array(o), c = 0; c < o; c++) f[c] = arguments[c + 2];
    l.children = f;
  }
  if (e && e.defaultProps) for (r in o = e.defaultProps, o) l[r] === void 0 && (l[r] = o[r]);
  return { $$typeof: yn, type: e, key: i, ref: u, props: l, _owner: Jl.current };
}
function _a(e, t) {
  return { $$typeof: yn, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function ql(e) {
  return typeof e == "object" && e !== null && e.$$typeof === yn;
}
function Pa(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + ("" + e).replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var uo = /\/+/g, qn = [];
function oo(e, t, n, r) {
  if (qn.length) {
    var l = qn.pop();
    return l.result = e, l.keyPrefix = t, l.func = n, l.context = r, l.count = 0, l;
  }
  return { result: e, keyPrefix: t, func: n, context: r, count: 0 };
}
function so(e) {
  e.result = null, e.keyPrefix = null, e.func = null, e.context = null, e.count = 0, 10 > qn.length && qn.push(e);
}
function nl(e, t, n, r) {
  var l = typeof e;
  (l === "undefined" || l === "boolean") && (e = null);
  var i = !1;
  if (e === null) i = !0;
  else switch (l) {
    case "string":
    case "number":
      i = !0;
      break;
    case "object":
      switch (e.$$typeof) {
        case yn:
        case va:
          i = !0;
      }
  }
  if (i) return n(r, e, t === "" ? "." + Ar(e, 0) : t), 1;
  if (i = 0, t = t === "" ? "." : t + ":", Array.isArray(e)) for (var u = 0; u < e.length; u++) {
    l = e[u];
    var o = t + Ar(l, u);
    i += nl(l, o, n, r);
  }
  else if (e === null || typeof e != "object" ? o = null : (o = Bi && e[Bi] || e["@@iterator"], o = typeof o == "function" ? o : null), typeof o == "function") for (e = o.call(e), u = 0; !(l = e.next()).done; ) l = l.value, o = t + Ar(l, u++), i += nl(l, o, n, r);
  else if (l === "object") throw n = "" + e, Error(gn(31, n === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : n, ""));
  return i;
}
function rl(e, t, n) {
  return e == null ? 0 : nl(e, "", t, n);
}
function Ar(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Pa(e.key) : t.toString(36);
}
function Na(e, t) {
  e.func.call(e.context, t, e.count++);
}
function Oa(e, t, n) {
  var r = e.result, l = e.keyPrefix;
  e = e.func.call(e.context, t, e.count++), Array.isArray(e) ? ll(e, r, n, function(i) {
    return i;
  }) : e != null && (ql(e) && (e = _a(e, l + (!e.key || t && t.key === e.key ? "" : ("" + e.key).replace(uo, "$&/") + "/") + n)), r.push(e));
}
function ll(e, t, n, r, l) {
  var i = "";
  n != null && (i = ("" + n).replace(uo, "$&/") + "/"), t = oo(t, i, r, l), rl(e, Oa, t), so(t);
}
var ao = { current: null };
function Re() {
  var e = ao.current;
  if (e === null) throw Error(gn(321));
  return e;
}
var za = { ReactCurrentDispatcher: ao, ReactCurrentBatchConfig: { suspense: null }, ReactCurrentOwner: Jl, IsSomeRendererActing: { current: !1 }, assign: Xl };
M.Children = { map: function(e, t, n) {
  if (e == null) return e;
  var r = [];
  return ll(e, r, null, t, n), r;
}, forEach: function(e, t, n) {
  if (e == null) return e;
  t = oo(null, null, t, n), rl(e, Na, t), so(t);
}, count: function(e) {
  return rl(e, function() {
    return null;
  }, null);
}, toArray: function(e) {
  var t = [];
  return ll(e, t, null, function(n) {
    return n;
  }), t;
}, only: function(e) {
  if (!ql(e)) throw Error(gn(143));
  return e;
} };
M.Component = Dt;
M.Fragment = ya;
M.Profiler = wa;
M.PureComponent = Gl;
M.StrictMode = ga;
M.Suspense = xa;
M.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = za;
M.cloneElement = function(e, t, n) {
  if (e == null) throw Error(gn(267, e));
  var r = Xl({}, e.props), l = e.key, i = e.ref, u = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (i = t.ref, u = Jl.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var o = e.type.defaultProps;
    for (f in t) ro.call(t, f) && !lo.hasOwnProperty(f) && (r[f] = t[f] === void 0 && o !== void 0 ? o[f] : t[f]);
  }
  var f = arguments.length - 2;
  if (f === 1) r.children = n;
  else if (1 < f) {
    o = Array(f);
    for (var c = 0; c < f; c++) o[c] = arguments[c + 2];
    r.children = o;
  }
  return {
    $$typeof: yn,
    type: e.type,
    key: l,
    ref: i,
    props: r,
    _owner: u
  };
};
M.createContext = function(e, t) {
  return t === void 0 && (t = null), e = { $$typeof: Ta, _calculateChangedBits: t, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null }, e.Provider = { $$typeof: Ea, _context: e }, e.Consumer = e;
};
M.createElement = io;
M.createFactory = function(e) {
  var t = io.bind(null, e);
  return t.type = e, t;
};
M.createRef = function() {
  return { current: null };
};
M.forwardRef = function(e) {
  return { $$typeof: ka, render: e };
};
M.isValidElement = ql;
M.lazy = function(e) {
  return { $$typeof: Ca, _ctor: e, _status: -1, _result: null };
};
M.memo = function(e, t) {
  return { $$typeof: Sa, type: e, compare: t === void 0 ? null : t };
};
M.useCallback = function(e, t) {
  return Re().useCallback(e, t);
};
M.useContext = function(e, t) {
  return Re().useContext(e, t);
};
M.useDebugValue = function() {
};
M.useEffect = function(e, t) {
  return Re().useEffect(e, t);
};
M.useImperativeHandle = function(e, t, n) {
  return Re().useImperativeHandle(e, t, n);
};
M.useLayoutEffect = function(e, t) {
  return Re().useLayoutEffect(e, t);
};
M.useMemo = function(e, t) {
  return Re().useMemo(e, t);
};
M.useReducer = function(e, t, n) {
  return Re().useReducer(e, t, n);
};
M.useRef = function(e) {
  return Re().useRef(e);
};
M.useState = function(e) {
  return Re().useState(e);
};
M.version = "16.14.0";
qu.exports = M;
var fo = qu.exports;
const Ma = /* @__PURE__ */ Ju(fo);
var co = { exports: {} }, de = {}, po = { exports: {} }, mo = {};
/** @license React v0.19.1
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(e) {
  var t, n, r, l, i;
  if (typeof window == "undefined" || typeof MessageChannel != "function") {
    var u = null, o = null, f = function() {
      if (u !== null) try {
        var v = e.unstable_now();
        u(!0, v), u = null;
      } catch (k) {
        throw setTimeout(f, 0), k;
      }
    }, c = Date.now();
    e.unstable_now = function() {
      return Date.now() - c;
    }, t = function(v) {
      u !== null ? setTimeout(t, 0, v) : (u = v, setTimeout(f, 0));
    }, n = function(v, k) {
      o = setTimeout(v, k);
    }, r = function() {
      clearTimeout(o);
    }, l = function() {
      return !1;
    }, i = e.unstable_forceFrameRate = function() {
    };
  } else {
    var y = window.performance, g = window.Date, _ = window.setTimeout, z = window.clearTimeout;
    if (typeof console != "undefined") {
      var J = window.cancelAnimationFrame;
      typeof window.requestAnimationFrame != "function" && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"), typeof J != "function" && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills");
    }
    if (typeof y == "object" && typeof y.now == "function") e.unstable_now = function() {
      return y.now();
    };
    else {
      var D = g.now();
      e.unstable_now = function() {
        return g.now() - D;
      };
    }
    var a = !1, s = null, d = -1, p = 5, h = 0;
    l = function() {
      return e.unstable_now() >= h;
    }, i = function() {
    }, e.unstable_forceFrameRate = function(v) {
      0 > v || 125 < v ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported") : p = 0 < v ? Math.floor(1e3 / v) : 5;
    };
    var w = new MessageChannel(), T = w.port2;
    w.port1.onmessage = function() {
      if (s !== null) {
        var v = e.unstable_now();
        h = v + p;
        try {
          s(!0, v) ? T.postMessage(null) : (a = !1, s = null);
        } catch (k) {
          throw T.postMessage(null), k;
        }
      } else a = !1;
    }, t = function(v) {
      s = v, a || (a = !0, T.postMessage(null));
    }, n = function(v, k) {
      d = _(function() {
        v(e.unstable_now());
      }, k);
    }, r = function() {
      z(d), d = -1;
    };
  }
  function P(v, k) {
    var O = v.length;
    v.push(k);
    e: for (; ; ) {
      var j = O - 1 >>> 1, U = v[j];
      if (U !== void 0 && 0 < ne(U, k)) v[j] = k, v[O] = U, O = j;
      else break e;
    }
  }
  function N(v) {
    return v = v[0], v === void 0 ? null : v;
  }
  function S(v) {
    var k = v[0];
    if (k !== void 0) {
      var O = v.pop();
      if (O !== k) {
        v[0] = O;
        e: for (var j = 0, U = v.length; j < U; ) {
          var qe = 2 * (j + 1) - 1, be = v[qe], Vt = qe + 1, yt = v[Vt];
          if (be !== void 0 && 0 > ne(be, O)) yt !== void 0 && 0 > ne(yt, be) ? (v[j] = yt, v[Vt] = O, j = Vt) : (v[j] = be, v[qe] = O, j = qe);
          else if (yt !== void 0 && 0 > ne(yt, O)) v[j] = yt, v[Vt] = O, j = Vt;
          else break e;
        }
      }
      return k;
    }
    return null;
  }
  function ne(v, k) {
    var O = v.sortIndex - k.sortIndex;
    return O !== 0 ? O : v.id - k.id;
  }
  var re = [], Ie = [], fa = 1, X = null, H = 3, _n = !1, Je = !1, At = !1;
  function Pn(v) {
    for (var k = N(Ie); k !== null; ) {
      if (k.callback === null) S(Ie);
      else if (k.startTime <= v) S(Ie), k.sortIndex = k.expirationTime, P(re, k);
      else break;
      k = N(Ie);
    }
  }
  function Ur(v) {
    if (At = !1, Pn(v), !Je) if (N(re) !== null) Je = !0, t($r);
    else {
      var k = N(Ie);
      k !== null && n(Ur, k.startTime - v);
    }
  }
  function $r(v, k) {
    Je = !1, At && (At = !1, r()), _n = !0;
    var O = H;
    try {
      for (Pn(k), X = N(re); X !== null && (!(X.expirationTime > k) || v && !l()); ) {
        var j = X.callback;
        if (j !== null) {
          X.callback = null, H = X.priorityLevel;
          var U = j(X.expirationTime <= k);
          k = e.unstable_now(), typeof U == "function" ? X.callback = U : X === N(re) && S(re), Pn(k);
        } else S(re);
        X = N(re);
      }
      if (X !== null) var qe = !0;
      else {
        var be = N(Ie);
        be !== null && n(Ur, be.startTime - k), qe = !1;
      }
      return qe;
    } finally {
      X = null, H = O, _n = !1;
    }
  }
  function Hi(v) {
    switch (v) {
      case 1:
        return -1;
      case 2:
        return 250;
      case 5:
        return 1073741823;
      case 4:
        return 1e4;
      default:
        return 5e3;
    }
  }
  var ca = i;
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(v) {
    v.callback = null;
  }, e.unstable_continueExecution = function() {
    Je || _n || (Je = !0, t($r));
  }, e.unstable_getCurrentPriorityLevel = function() {
    return H;
  }, e.unstable_getFirstCallbackNode = function() {
    return N(re);
  }, e.unstable_next = function(v) {
    switch (H) {
      case 1:
      case 2:
      case 3:
        var k = 3;
        break;
      default:
        k = H;
    }
    var O = H;
    H = k;
    try {
      return v();
    } finally {
      H = O;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = ca, e.unstable_runWithPriority = function(v, k) {
    switch (v) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        v = 3;
    }
    var O = H;
    H = v;
    try {
      return k();
    } finally {
      H = O;
    }
  }, e.unstable_scheduleCallback = function(v, k, O) {
    var j = e.unstable_now();
    if (typeof O == "object" && O !== null) {
      var U = O.delay;
      U = typeof U == "number" && 0 < U ? j + U : j, O = typeof O.timeout == "number" ? O.timeout : Hi(v);
    } else O = Hi(v), U = j;
    return O = U + O, v = { id: fa++, callback: k, priorityLevel: v, startTime: U, expirationTime: O, sortIndex: -1 }, U > j ? (v.sortIndex = U, P(Ie, v), N(re) === null && v === N(Ie) && (At ? r() : At = !0, n(Ur, U - j))) : (v.sortIndex = O, P(re, v), Je || _n || (Je = !0, t($r))), v;
  }, e.unstable_shouldYield = function() {
    var v = e.unstable_now();
    Pn(v);
    var k = N(re);
    return k !== X && X !== null && k !== null && k.callback !== null && k.startTime <= v && k.expirationTime < X.expirationTime || l();
  }, e.unstable_wrapCallback = function(v) {
    var k = H;
    return function() {
      var O = H;
      H = k;
      try {
        return v.apply(this, arguments);
      } finally {
        H = O;
      }
    };
  };
})(mo);
po.exports = mo;
var Ra = po.exports;
/** @license React v16.14.0
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cr = fo, G = bu, W = Ra;
function m(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
if (!Cr) throw Error(m(227));
function Ia(e, t, n, r, l, i, u, o, f) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (y) {
    this.onError(y);
  }
}
var qt = !1, bn = null, er = !1, il = null, Fa = { onError: function(e) {
  qt = !0, bn = e;
} };
function ja(e, t, n, r, l, i, u, o, f) {
  qt = !1, bn = null, Ia.apply(Fa, arguments);
}
function La(e, t, n, r, l, i, u, o, f) {
  if (ja.apply(this, arguments), qt) {
    if (qt) {
      var c = bn;
      qt = !1, bn = null;
    } else throw Error(m(198));
    er || (er = !0, il = c);
  }
}
var bl = null, ho = null, vo = null;
function Yi(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = vo(n), La(r, t, void 0, e), e.currentTarget = null;
}
var tr = null, gt = {};
function yo() {
  if (tr) for (var e in gt) {
    var t = gt[e], n = tr.indexOf(e);
    if (!(-1 < n)) throw Error(m(96, e));
    if (!nr[n]) {
      if (!t.extractEvents) throw Error(m(97, e));
      nr[n] = t, n = t.eventTypes;
      for (var r in n) {
        var l = void 0, i = n[r], u = t, o = r;
        if (ul.hasOwnProperty(o)) throw Error(m(99, o));
        ul[o] = i;
        var f = i.phasedRegistrationNames;
        if (f) {
          for (l in f) f.hasOwnProperty(l) && Xi(f[l], u, o);
          l = !0;
        } else i.registrationName ? (Xi(i.registrationName, u, o), l = !0) : l = !1;
        if (!l) throw Error(m(98, r, e));
      }
    }
  }
}
function Xi(e, t, n) {
  if (Mt[e]) throw Error(m(100, e));
  Mt[e] = t, ei[e] = t.eventTypes[n].dependencies;
}
var nr = [], ul = {}, Mt = {}, ei = {};
function go(e) {
  var t = !1, n;
  for (n in e) if (e.hasOwnProperty(n)) {
    var r = e[n];
    if (!gt.hasOwnProperty(n) || gt[n] !== r) {
      if (gt[n]) throw Error(m(102, n));
      gt[n] = r, t = !0;
    }
  }
  t && yo();
}
var Ze = !(typeof window == "undefined" || typeof window.document == "undefined" || typeof window.document.createElement == "undefined"), ol = null, Ct = null, _t = null;
function Gi(e) {
  if (e = ho(e)) {
    if (typeof ol != "function") throw Error(m(280));
    var t = e.stateNode;
    t && (t = bl(t), ol(e.stateNode, e.type, t));
  }
}
function wo(e) {
  Ct ? _t ? _t.push(e) : _t = [e] : Ct = e;
}
function Eo() {
  if (Ct) {
    var e = Ct, t = _t;
    if (_t = Ct = null, Gi(e), t) for (e = 0; e < t.length; e++) Gi(t[e]);
  }
}
function ti(e, t) {
  return e(t);
}
function To(e, t, n, r, l) {
  return e(t, n, r, l);
}
function ni() {
}
var ko = ti, nt = !1, Vr = !1;
function ri() {
  (Ct !== null || _t !== null) && (ni(), Eo());
}
function xo(e, t, n) {
  if (Vr) return e(t, n);
  Vr = !0;
  try {
    return ko(e, t, n);
  } finally {
    Vr = !1, ri();
  }
}
var Da = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Zi = Object.prototype.hasOwnProperty, Ji = {}, qi = {};
function Ua(e) {
  return Zi.call(qi, e) ? !0 : Zi.call(Ji, e) ? !1 : Da.test(e) ? qi[e] = !0 : (Ji[e] = !0, !1);
}
function $a(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Aa(e, t, n, r) {
  if (t === null || typeof t == "undefined" || $a(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !t;
    case 4:
      return t === !1;
    case 5:
      return isNaN(t);
    case 6:
      return isNaN(t) || 1 > t;
  }
  return !1;
}
function Z(e, t, n, r, l, i) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i;
}
var Q = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  Q[e] = new Z(e, 0, !1, e, null, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  Q[t] = new Z(t, 1, !1, e[1], null, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  Q[e] = new Z(e, 2, !1, e.toLowerCase(), null, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  Q[e] = new Z(e, 2, !1, e, null, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  Q[e] = new Z(e, 3, !1, e.toLowerCase(), null, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  Q[e] = new Z(e, 3, !0, e, null, !1);
});
["capture", "download"].forEach(function(e) {
  Q[e] = new Z(e, 4, !1, e, null, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  Q[e] = new Z(e, 6, !1, e, null, !1);
});
["rowSpan", "start"].forEach(function(e) {
  Q[e] = new Z(e, 5, !1, e.toLowerCase(), null, !1);
});
var li = /[\-:]([a-z])/g;
function ii(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    li,
    ii
  );
  Q[t] = new Z(t, 1, !1, e, null, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(li, ii);
  Q[t] = new Z(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(li, ii);
  Q[t] = new Z(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  Q[e] = new Z(e, 1, !1, e.toLowerCase(), null, !1);
});
Q.xlinkHref = new Z("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0);
["src", "href", "action", "formAction"].forEach(function(e) {
  Q[e] = new Z(e, 1, !1, e.toLowerCase(), null, !0);
});
var me = Cr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
me.hasOwnProperty("ReactCurrentDispatcher") || (me.ReactCurrentDispatcher = { current: null });
me.hasOwnProperty("ReactCurrentBatchConfig") || (me.ReactCurrentBatchConfig = { suspense: null });
function ui(e, t, n, r) {
  var l = Q.hasOwnProperty(t) ? Q[t] : null, i = l !== null ? l.type === 0 : r ? !1 : !(!(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N");
  i || (Aa(t, n, l, r) && (n = null), r || l === null ? Ua(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Va = /^(.*)[\\\/]/, te = typeof Symbol == "function" && Symbol.for, Nn = te ? Symbol.for("react.element") : 60103, wt = te ? Symbol.for("react.portal") : 60106, tt = te ? Symbol.for("react.fragment") : 60107, So = te ? Symbol.for("react.strict_mode") : 60108, Un = te ? Symbol.for("react.profiler") : 60114, Co = te ? Symbol.for("react.provider") : 60109, _o = te ? Symbol.for("react.context") : 60110, Wa = te ? Symbol.for("react.concurrent_mode") : 60111, oi = te ? Symbol.for("react.forward_ref") : 60112, $n = te ? Symbol.for("react.suspense") : 60113, sl = te ? Symbol.for("react.suspense_list") : 60120, si = te ? Symbol.for("react.memo") : 60115, Po = te ? Symbol.for("react.lazy") : 60116, No = te ? Symbol.for("react.block") : 60121, bi = typeof Symbol == "function" && Symbol.iterator;
function Wt(e) {
  return e === null || typeof e != "object" ? null : (e = bi && e[bi] || e["@@iterator"], typeof e == "function" ? e : null);
}
function Qa(e) {
  if (e._status === -1) {
    e._status = 0;
    var t = e._ctor;
    t = t(), e._result = t, t.then(function(n) {
      e._status === 0 && (n = n.default, e._status = 1, e._result = n);
    }, function(n) {
      e._status === 0 && (e._status = 2, e._result = n);
    });
  }
}
function Me(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case tt:
      return "Fragment";
    case wt:
      return "Portal";
    case Un:
      return "Profiler";
    case So:
      return "StrictMode";
    case $n:
      return "Suspense";
    case sl:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case _o:
      return "Context.Consumer";
    case Co:
      return "Context.Provider";
    case oi:
      var t = e.render;
      return t = t.displayName || t.name || "", e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
    case si:
      return Me(e.type);
    case No:
      return Me(e.render);
    case Po:
      if (e = e._status === 1 ? e._result : null) return Me(e);
  }
  return null;
}
function ai(e) {
  var t = "";
  do {
    e: switch (e.tag) {
      case 3:
      case 4:
      case 6:
      case 7:
      case 10:
      case 9:
        var n = "";
        break e;
      default:
        var r = e._debugOwner, l = e._debugSource, i = Me(e.type);
        n = null, r && (n = Me(r.type)), r = i, i = "", l ? i = " (at " + l.fileName.replace(Va, "") + ":" + l.lineNumber + ")" : n && (i = " (created by " + n + ")"), n = `
    in ` + (r || "Unknown") + i;
    }
    t += n, e = e.return;
  } while (e);
  return t;
}
function Ye(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "undefined":
      return e;
    default:
      return "";
  }
}
function Oo(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Ha(e) {
  var t = Oo(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n != "undefined" && typeof n.get == "function" && typeof n.set == "function") {
    var l = n.get, i = n.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return l.call(this);
    }, set: function(u) {
      r = "" + u, i.call(this, u);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(u) {
      r = "" + u;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function On(e) {
  e._valueTracker || (e._valueTracker = Ha(e));
}
function zo(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = Oo(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function al(e, t) {
  var n = t.checked;
  return G({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n != null ? n : e._wrapperState.initialChecked });
}
function eu(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = Ye(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function Mo(e, t) {
  t = t.checked, t != null && ui(e, "checked", t, !1);
}
function fl(e, t) {
  Mo(e, t);
  var n = Ye(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? cl(e, t.type, n) : t.hasOwnProperty("defaultValue") && cl(e, t.type, Ye(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function tu(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function cl(e, t, n) {
  (t !== "number" || e.ownerDocument.activeElement !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
function Ka(e) {
  var t = "";
  return Cr.Children.forEach(e, function(n) {
    n != null && (t += n);
  }), t;
}
function dl(e, t) {
  return e = G({ children: void 0 }, t), (t = Ka(t.children)) && (e.children = t), e;
}
function Pt(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Ye(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        e[l].selected = !0, r && (e[l].defaultSelected = !0);
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function pl(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(m(91));
  return G({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function nu(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(m(92));
      if (Array.isArray(n)) {
        if (!(1 >= n.length)) throw Error(m(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: Ye(n) };
}
function Ro(e, t) {
  var n = Ye(t.value), r = Ye(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function ru(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
var Io = { html: "http://www.w3.org/1999/xhtml", svg: "http://www.w3.org/2000/svg" };
function Fo(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function ml(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? Fo(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var zn, jo = function(e) {
  return typeof MSApp != "undefined" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, l);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== Io.svg || "innerHTML" in e) e.innerHTML = t;
  else {
    for (zn = zn || document.createElement("div"), zn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = zn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function on(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
function Mn(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Et = { animationend: Mn("Animation", "AnimationEnd"), animationiteration: Mn("Animation", "AnimationIteration"), animationstart: Mn("Animation", "AnimationStart"), transitionend: Mn("Transition", "TransitionEnd") }, Wr = {}, Lo = {};
Ze && (Lo = document.createElement("div").style, "AnimationEvent" in window || (delete Et.animationend.animation, delete Et.animationiteration.animation, delete Et.animationstart.animation), "TransitionEvent" in window || delete Et.transitionend.transition);
function _r(e) {
  if (Wr[e]) return Wr[e];
  if (!Et[e]) return e;
  var t = Et[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in Lo) return Wr[e] = t[n];
  return e;
}
var Do = _r("animationend"), Uo = _r("animationiteration"), $o = _r("animationstart"), Ao = _r("transitionend"), Gt = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), lu = new (typeof WeakMap == "function" ? WeakMap : Map)();
function fi(e) {
  var t = lu.get(e);
  return t === void 0 && (t = /* @__PURE__ */ new Map(), lu.set(e, t)), t;
}
function vt(e) {
  var t = e, n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.effectTag & 1026 && (n = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Vo(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function iu(e) {
  if (vt(e) !== e) throw Error(m(188));
}
function Ba(e) {
  var t = e.alternate;
  if (!t) {
    if (t = vt(e), t === null) throw Error(m(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (r = l.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return iu(l), e;
        if (i === r) return iu(l), t;
        i = i.sibling;
      }
      throw Error(m(188));
    }
    if (n.return !== r.return) n = l, r = i;
    else {
      for (var u = !1, o = l.child; o; ) {
        if (o === n) {
          u = !0, n = l, r = i;
          break;
        }
        if (o === r) {
          u = !0, r = l, n = i;
          break;
        }
        o = o.sibling;
      }
      if (!u) {
        for (o = i.child; o; ) {
          if (o === n) {
            u = !0, n = i, r = l;
            break;
          }
          if (o === r) {
            u = !0, r = i, n = l;
            break;
          }
          o = o.sibling;
        }
        if (!u) throw Error(m(189));
      }
    }
    if (n.alternate !== r) throw Error(m(190));
  }
  if (n.tag !== 3) throw Error(m(188));
  return n.stateNode.current === n ? e : t;
}
function Wo(e) {
  if (e = Ba(e), !e) return null;
  for (var t = e; ; ) {
    if (t.tag === 5 || t.tag === 6) return t;
    if (t.child) t.child.return = t, t = t.child;
    else {
      if (t === e) break;
      for (; !t.sibling; ) {
        if (!t.return || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }
  return null;
}
function Rt(e, t) {
  if (t == null) throw Error(m(30));
  return e == null ? t : Array.isArray(e) ? Array.isArray(t) ? (e.push.apply(e, t), e) : (e.push(t), e) : Array.isArray(t) ? [e].concat(t) : [e, t];
}
function ci(e, t, n) {
  Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e);
}
var Qt = null;
function Ya(e) {
  if (e) {
    var t = e._dispatchListeners, n = e._dispatchInstances;
    if (Array.isArray(t)) for (var r = 0; r < t.length && !e.isPropagationStopped(); r++) Yi(e, t[r], n[r]);
    else t && Yi(e, t, n);
    e._dispatchListeners = null, e._dispatchInstances = null, e.isPersistent() || e.constructor.release(e);
  }
}
function Pr(e) {
  if (e !== null && (Qt = Rt(Qt, e)), e = Qt, Qt = null, e) {
    if (ci(e, Ya), Qt) throw Error(m(95));
    if (er) throw e = il, er = !1, il = null, e;
  }
}
function di(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
function Qo(e) {
  if (!Ze) return !1;
  e = "on" + e;
  var t = e in document;
  return t || (t = document.createElement("div"), t.setAttribute(e, "return;"), t = typeof t[e] == "function"), t;
}
var rr = [];
function Ho(e) {
  e.topLevelType = null, e.nativeEvent = null, e.targetInst = null, e.ancestors.length = 0, 10 > rr.length && rr.push(e);
}
function Ko(e, t, n, r) {
  if (rr.length) {
    var l = rr.pop();
    return l.topLevelType = e, l.eventSystemFlags = r, l.nativeEvent = t, l.targetInst = n, l;
  }
  return { topLevelType: e, eventSystemFlags: r, nativeEvent: t, targetInst: n, ancestors: [] };
}
function Bo(e) {
  var t = e.targetInst, n = t;
  do {
    if (!n) {
      e.ancestors.push(n);
      break;
    }
    var r = n;
    if (r.tag === 3) r = r.stateNode.containerInfo;
    else {
      for (; r.return; ) r = r.return;
      r = r.tag !== 3 ? null : r.stateNode.containerInfo;
    }
    if (!r) break;
    t = n.tag, t !== 5 && t !== 6 || e.ancestors.push(n), n = En(r);
  } while (n);
  for (n = 0; n < e.ancestors.length; n++) {
    t = e.ancestors[n];
    var l = di(e.nativeEvent);
    r = e.topLevelType;
    var i = e.nativeEvent, u = e.eventSystemFlags;
    n === 0 && (u |= 64);
    for (var o = null, f = 0; f < nr.length; f++) {
      var c = nr[f];
      c && (c = c.extractEvents(r, t, i, l, u)) && (o = Rt(o, c));
    }
    Pr(o);
  }
}
function hl(e, t, n) {
  if (!n.has(e)) {
    switch (e) {
      case "scroll":
        Zt(t, "scroll", !0);
        break;
      case "focus":
      case "blur":
        Zt(t, "focus", !0), Zt(t, "blur", !0), n.set("blur", null), n.set("focus", null);
        break;
      case "cancel":
      case "close":
        Qo(e) && Zt(t, e, !0);
        break;
      case "invalid":
      case "submit":
      case "reset":
        break;
      default:
        Gt.indexOf(e) === -1 && I(e, t);
    }
    n.set(e, null);
  }
}
var Yo, pi, Xo, vl = !1, ye = [], Ae = null, Ve = null, We = null, sn = /* @__PURE__ */ new Map(), an = /* @__PURE__ */ new Map(), Ht = [], yl = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput close cancel copy cut paste click change contextmenu reset submit".split(" "), Xa = "focus blur dragenter dragleave mouseover mouseout pointerover pointerout gotpointercapture lostpointercapture".split(" ");
function Ga(e, t) {
  var n = fi(t);
  yl.forEach(function(r) {
    hl(r, t, n);
  }), Xa.forEach(function(r) {
    hl(r, t, n);
  });
}
function gl(e, t, n, r, l) {
  return { blockedOn: e, topLevelType: t, eventSystemFlags: n | 32, nativeEvent: l, container: r };
}
function uu(e, t) {
  switch (e) {
    case "focus":
    case "blur":
      Ae = null;
      break;
    case "dragenter":
    case "dragleave":
      Ve = null;
      break;
    case "mouseover":
    case "mouseout":
      We = null;
      break;
    case "pointerover":
    case "pointerout":
      sn.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      an.delete(t.pointerId);
  }
}
function Kt(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i ? (e = gl(t, n, r, l, i), t !== null && (t = Tn(t), t !== null && pi(t)), e) : (e.eventSystemFlags |= r, e);
}
function Za(e, t, n, r, l) {
  switch (t) {
    case "focus":
      return Ae = Kt(Ae, e, t, n, r, l), !0;
    case "dragenter":
      return Ve = Kt(Ve, e, t, n, r, l), !0;
    case "mouseover":
      return We = Kt(We, e, t, n, r, l), !0;
    case "pointerover":
      var i = l.pointerId;
      return sn.set(i, Kt(sn.get(i) || null, e, t, n, r, l)), !0;
    case "gotpointercapture":
      return i = l.pointerId, an.set(i, Kt(an.get(i) || null, e, t, n, r, l)), !0;
  }
  return !1;
}
function Ja(e) {
  var t = En(e.target);
  if (t !== null) {
    var n = vt(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Vo(n), t !== null) {
          e.blockedOn = t, W.unstable_runWithPriority(e.priority, function() {
            Xo(n);
          });
          return;
        }
      } else if (t === 3 && n.stateNode.hydrate) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function An(e) {
  if (e.blockedOn !== null) return !1;
  var t = vi(e.topLevelType, e.eventSystemFlags, e.container, e.nativeEvent);
  if (t !== null) {
    var n = Tn(t);
    return n !== null && pi(n), e.blockedOn = t, !1;
  }
  return !0;
}
function ou(e, t, n) {
  An(e) && n.delete(t);
}
function qa() {
  for (vl = !1; 0 < ye.length; ) {
    var e = ye[0];
    if (e.blockedOn !== null) {
      e = Tn(e.blockedOn), e !== null && Yo(e);
      break;
    }
    var t = vi(e.topLevelType, e.eventSystemFlags, e.container, e.nativeEvent);
    t !== null ? e.blockedOn = t : ye.shift();
  }
  Ae !== null && An(Ae) && (Ae = null), Ve !== null && An(Ve) && (Ve = null), We !== null && An(We) && (We = null), sn.forEach(ou), an.forEach(ou);
}
function Bt(e, t) {
  e.blockedOn === t && (e.blockedOn = null, vl || (vl = !0, W.unstable_scheduleCallback(W.unstable_NormalPriority, qa)));
}
function Go(e) {
  function t(l) {
    return Bt(l, e);
  }
  if (0 < ye.length) {
    Bt(ye[0], e);
    for (var n = 1; n < ye.length; n++) {
      var r = ye[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (Ae !== null && Bt(Ae, e), Ve !== null && Bt(Ve, e), We !== null && Bt(We, e), sn.forEach(t), an.forEach(t), n = 0; n < Ht.length; n++) r = Ht[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Ht.length && (n = Ht[0], n.blockedOn === null); ) Ja(n), n.blockedOn === null && Ht.shift();
}
var Zo = {}, Jo = /* @__PURE__ */ new Map(), mi = /* @__PURE__ */ new Map(), ba = [
  "abort",
  "abort",
  Do,
  "animationEnd",
  Uo,
  "animationIteration",
  $o,
  "animationStart",
  "canplay",
  "canPlay",
  "canplaythrough",
  "canPlayThrough",
  "durationchange",
  "durationChange",
  "emptied",
  "emptied",
  "encrypted",
  "encrypted",
  "ended",
  "ended",
  "error",
  "error",
  "gotpointercapture",
  "gotPointerCapture",
  "load",
  "load",
  "loadeddata",
  "loadedData",
  "loadedmetadata",
  "loadedMetadata",
  "loadstart",
  "loadStart",
  "lostpointercapture",
  "lostPointerCapture",
  "playing",
  "playing",
  "progress",
  "progress",
  "seeking",
  "seeking",
  "stalled",
  "stalled",
  "suspend",
  "suspend",
  "timeupdate",
  "timeUpdate",
  Ao,
  "transitionEnd",
  "waiting",
  "waiting"
];
function hi(e, t) {
  for (var n = 0; n < e.length; n += 2) {
    var r = e[n], l = e[n + 1], i = "on" + (l[0].toUpperCase() + l.slice(1));
    i = { phasedRegistrationNames: { bubbled: i, captured: i + "Capture" }, dependencies: [r], eventPriority: t }, mi.set(r, t), Jo.set(r, i), Zo[l] = i;
  }
}
hi("blur blur cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focus focus input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "), 0);
hi("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "), 1);
hi(ba, 2);
for (var su = "change selectionchange textInput compositionstart compositionend compositionupdate".split(" "), Qr = 0; Qr < su.length; Qr++) mi.set(su[Qr], 0);
var ef = W.unstable_UserBlockingPriority, tf = W.unstable_runWithPriority, Vn = !0;
function I(e, t) {
  Zt(t, e, !1);
}
function Zt(e, t, n) {
  var r = mi.get(t);
  switch (r === void 0 ? 2 : r) {
    case 0:
      r = nf.bind(null, t, 1, e);
      break;
    case 1:
      r = rf.bind(null, t, 1, e);
      break;
    default:
      r = Nr.bind(null, t, 1, e);
  }
  n ? e.addEventListener(t, r, !0) : e.addEventListener(t, r, !1);
}
function nf(e, t, n, r) {
  nt || ni();
  var l = Nr, i = nt;
  nt = !0;
  try {
    To(l, e, t, n, r);
  } finally {
    (nt = i) || ri();
  }
}
function rf(e, t, n, r) {
  tf(ef, Nr.bind(null, e, t, n, r));
}
function Nr(e, t, n, r) {
  if (Vn) if (0 < ye.length && -1 < yl.indexOf(e)) e = gl(null, e, t, n, r), ye.push(e);
  else {
    var l = vi(e, t, n, r);
    if (l === null) uu(e, r);
    else if (-1 < yl.indexOf(e)) e = gl(l, e, t, n, r), ye.push(e);
    else if (!Za(l, e, t, n, r)) {
      uu(e, r), e = Ko(e, r, null, t);
      try {
        xo(Bo, e);
      } finally {
        Ho(e);
      }
    }
  }
}
function vi(e, t, n, r) {
  if (n = di(r), n = En(n), n !== null) {
    var l = vt(n);
    if (l === null) n = null;
    else {
      var i = l.tag;
      if (i === 13) {
        if (n = Vo(l), n !== null) return n;
        n = null;
      } else if (i === 3) {
        if (l.stateNode.hydrate) return l.tag === 3 ? l.stateNode.containerInfo : null;
        n = null;
      } else l !== n && (n = null);
    }
  }
  e = Ko(e, r, n, t);
  try {
    xo(Bo, e);
  } finally {
    Ho(e);
  }
  return null;
}
var bt = {
  animationIterationCount: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, lf = ["Webkit", "ms", "Moz", "O"];
Object.keys(bt).forEach(function(e) {
  lf.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), bt[t] = bt[e];
  });
});
function qo(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || bt.hasOwnProperty(e) && bt[e] ? ("" + t).trim() : t + "px";
}
function bo(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = qo(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var uf = G({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function wl(e, t) {
  if (t) {
    if (uf[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(m(137, e, ""));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(m(60));
      if (!(typeof t.dangerouslySetInnerHTML == "object" && "__html" in t.dangerouslySetInnerHTML)) throw Error(m(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(m(62, ""));
  }
}
function El(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var au = Io.html;
function Ce(e, t) {
  e = e.nodeType === 9 || e.nodeType === 11 ? e : e.ownerDocument;
  var n = fi(e);
  t = ei[t];
  for (var r = 0; r < t.length; r++) hl(t[r], e, n);
}
function lr() {
}
function Tl(e) {
  if (e = e || (typeof document != "undefined" ? document : void 0), typeof e == "undefined") return null;
  try {
    return e.activeElement || e.body;
  } catch (t) {
    return e.body;
  }
}
function fu(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function cu(e, t) {
  var n = fu(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = fu(n);
  }
}
function es(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? es(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function du() {
  for (var e = window, t = Tl(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch (r) {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Tl(e.document);
  }
  return t;
}
function kl(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
var ts = "$", ns = "/$", yi = "$?", gi = "$!", Hr = null, Kr = null;
function rs(e, t) {
  switch (e) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!t.autoFocus;
  }
  return !1;
}
function xl(e, t) {
  return e === "textarea" || e === "option" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var Br = typeof setTimeout == "function" ? setTimeout : void 0, of = typeof clearTimeout == "function" ? clearTimeout : void 0;
function Nt(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
  }
  return e;
}
function pu(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === ts || n === gi || n === yi) {
        if (t === 0) return e;
        t--;
      } else n === ns && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var wi = Math.random().toString(36).slice(2), je = "__reactInternalInstance$" + wi, ir = "__reactEventHandlers$" + wi, wn = "__reactContainere$" + wi;
function En(e) {
  var t = e[je];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[wn] || n[je]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = pu(e); e !== null; ) {
        if (n = e[je]) return n;
        e = pu(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function Tn(e) {
  return e = e[je] || e[wn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function dt(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(m(33));
}
function Ei(e) {
  return e[ir] || null;
}
function _e(e) {
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function ls(e, t) {
  var n = e.stateNode;
  if (!n) return null;
  var r = bl(n);
  if (!r) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(m(
    231,
    t,
    typeof n
  ));
  return n;
}
function mu(e, t, n) {
  (t = ls(e, n.dispatchConfig.phasedRegistrationNames[t])) && (n._dispatchListeners = Rt(n._dispatchListeners, t), n._dispatchInstances = Rt(n._dispatchInstances, e));
}
function sf(e) {
  if (e && e.dispatchConfig.phasedRegistrationNames) {
    for (var t = e._targetInst, n = []; t; ) n.push(t), t = _e(t);
    for (t = n.length; 0 < t--; ) mu(n[t], "captured", e);
    for (t = 0; t < n.length; t++) mu(n[t], "bubbled", e);
  }
}
function Sl(e, t, n) {
  e && n && n.dispatchConfig.registrationName && (t = ls(e, n.dispatchConfig.registrationName)) && (n._dispatchListeners = Rt(n._dispatchListeners, t), n._dispatchInstances = Rt(n._dispatchInstances, e));
}
function af(e) {
  e && e.dispatchConfig.registrationName && Sl(e._targetInst, null, e);
}
function It(e) {
  ci(e, sf);
}
var Le = null, Ti = null, Wn = null;
function is() {
  if (Wn) return Wn;
  var e, t = Ti, n = t.length, r, l = "value" in Le ? Le.value : Le.textContent, i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var u = n - e;
  for (r = 1; r <= u && t[n - r] === l[i - r]; r++) ;
  return Wn = l.slice(e, 1 < r ? 1 - r : void 0);
}
function Qn() {
  return !0;
}
function ur() {
  return !1;
}
function se(e, t, n, r) {
  this.dispatchConfig = e, this._targetInst = t, this.nativeEvent = n, e = this.constructor.Interface;
  for (var l in e) e.hasOwnProperty(l) && ((t = e[l]) ? this[l] = t(n) : l === "target" ? this.target = r : this[l] = n[l]);
  return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Qn : ur, this.isPropagationStopped = ur, this;
}
G(se.prototype, { preventDefault: function() {
  this.defaultPrevented = !0;
  var e = this.nativeEvent;
  e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Qn);
}, stopPropagation: function() {
  var e = this.nativeEvent;
  e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Qn);
}, persist: function() {
  this.isPersistent = Qn;
}, isPersistent: ur, destructor: function() {
  var e = this.constructor.Interface, t;
  for (t in e) this[t] = null;
  this.nativeEvent = this._targetInst = this.dispatchConfig = null, this.isPropagationStopped = this.isDefaultPrevented = ur, this._dispatchInstances = this._dispatchListeners = null;
} });
se.Interface = { type: null, target: null, currentTarget: function() {
  return null;
}, eventPhase: null, bubbles: null, cancelable: null, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: null, isTrusted: null };
se.extend = function(e) {
  function t() {
  }
  function n() {
    return r.apply(this, arguments);
  }
  var r = this;
  t.prototype = r.prototype;
  var l = new t();
  return G(l, n.prototype), n.prototype = l, n.prototype.constructor = n, n.Interface = G({}, r.Interface, e), n.extend = r.extend, us(n), n;
};
us(se);
function ff(e, t, n, r) {
  if (this.eventPool.length) {
    var l = this.eventPool.pop();
    return this.call(l, e, t, n, r), l;
  }
  return new this(e, t, n, r);
}
function cf(e) {
  if (!(e instanceof this)) throw Error(m(279));
  e.destructor(), 10 > this.eventPool.length && this.eventPool.push(e);
}
function us(e) {
  e.eventPool = [], e.getPooled = ff, e.release = cf;
}
var df = se.extend({ data: null }), pf = se.extend({ data: null }), mf = [9, 13, 27, 32], ki = Ze && "CompositionEvent" in window, en = null;
Ze && "documentMode" in document && (en = document.documentMode);
var hf = Ze && "TextEvent" in window && !en, os = Ze && (!ki || en && 8 < en && 11 >= en), hu = " ", Se = { beforeInput: { phasedRegistrationNames: { bubbled: "onBeforeInput", captured: "onBeforeInputCapture" }, dependencies: ["compositionend", "keypress", "textInput", "paste"] }, compositionEnd: { phasedRegistrationNames: { bubbled: "onCompositionEnd", captured: "onCompositionEndCapture" }, dependencies: "blur compositionend keydown keypress keyup mousedown".split(" ") }, compositionStart: { phasedRegistrationNames: {
  bubbled: "onCompositionStart",
  captured: "onCompositionStartCapture"
}, dependencies: "blur compositionstart keydown keypress keyup mousedown".split(" ") }, compositionUpdate: { phasedRegistrationNames: { bubbled: "onCompositionUpdate", captured: "onCompositionUpdateCapture" }, dependencies: "blur compositionupdate keydown keypress keyup mousedown".split(" ") } }, vu = !1;
function ss(e, t) {
  switch (e) {
    case "keyup":
      return mf.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "blur":
      return !0;
    default:
      return !1;
  }
}
function as(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Tt = !1;
function vf(e, t) {
  switch (e) {
    case "compositionend":
      return as(t);
    case "keypress":
      return t.which !== 32 ? null : (vu = !0, hu);
    case "textInput":
      return e = t.data, e === hu && vu ? null : e;
    default:
      return null;
  }
}
function yf(e, t) {
  if (Tt) return e === "compositionend" || !ki && ss(e, t) ? (e = is(), Wn = Ti = Le = null, Tt = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return os && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var gf = { eventTypes: Se, extractEvents: function(e, t, n, r) {
  var l;
  if (ki) e: {
    switch (e) {
      case "compositionstart":
        var i = Se.compositionStart;
        break e;
      case "compositionend":
        i = Se.compositionEnd;
        break e;
      case "compositionupdate":
        i = Se.compositionUpdate;
        break e;
    }
    i = void 0;
  }
  else Tt ? ss(e, n) && (i = Se.compositionEnd) : e === "keydown" && n.keyCode === 229 && (i = Se.compositionStart);
  return i ? (os && n.locale !== "ko" && (Tt || i !== Se.compositionStart ? i === Se.compositionEnd && Tt && (l = is()) : (Le = r, Ti = "value" in Le ? Le.value : Le.textContent, Tt = !0)), i = df.getPooled(
    i,
    t,
    n,
    r
  ), l ? i.data = l : (l = as(n), l !== null && (i.data = l)), It(i), l = i) : l = null, (e = hf ? vf(e, n) : yf(e, n)) ? (t = pf.getPooled(Se.beforeInput, t, n, r), t.data = e, It(t)) : t = null, l === null ? t : t === null ? l : [l, t];
} }, wf = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function fs(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!wf[e.type] : t === "textarea";
}
var cs = { change: { phasedRegistrationNames: { bubbled: "onChange", captured: "onChangeCapture" }, dependencies: "blur change click focus input keydown keyup selectionchange".split(" ") } };
function ds(e, t, n) {
  return e = se.getPooled(cs.change, e, t, n), e.type = "change", wo(n), It(e), e;
}
var tn = null, fn = null;
function Ef(e) {
  Pr(e);
}
function Or(e) {
  var t = dt(e);
  if (zo(t)) return e;
}
function Tf(e, t) {
  if (e === "change") return t;
}
var Cl = !1;
Ze && (Cl = Qo("input") && (!document.documentMode || 9 < document.documentMode));
function yu() {
  tn && (tn.detachEvent("onpropertychange", ps), fn = tn = null);
}
function ps(e) {
  if (e.propertyName === "value" && Or(fn)) if (e = ds(fn, e, di(e)), nt) Pr(e);
  else {
    nt = !0;
    try {
      ti(Ef, e);
    } finally {
      nt = !1, ri();
    }
  }
}
function kf(e, t, n) {
  e === "focus" ? (yu(), tn = t, fn = n, tn.attachEvent("onpropertychange", ps)) : e === "blur" && yu();
}
function xf(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return Or(fn);
}
function Sf(e, t) {
  if (e === "click") return Or(t);
}
function Cf(e, t) {
  if (e === "input" || e === "change") return Or(t);
}
var _f = { eventTypes: cs, _isInputEventSupported: Cl, extractEvents: function(e, t, n, r) {
  var l = t ? dt(t) : window, i = l.nodeName && l.nodeName.toLowerCase();
  if (i === "select" || i === "input" && l.type === "file") var u = Tf;
  else if (fs(l)) if (Cl) u = Cf;
  else {
    u = xf;
    var o = kf;
  }
  else (i = l.nodeName) && i.toLowerCase() === "input" && (l.type === "checkbox" || l.type === "radio") && (u = Sf);
  if (u && (u = u(e, t))) return ds(u, n, r);
  o && o(e, l, t), e === "blur" && (e = l._wrapperState) && e.controlled && l.type === "number" && cl(l, "number", l.value);
} }, kn = se.extend({ view: null, detail: null }), Pf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Nf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Pf[e]) ? !!t[e] : !1;
}
function xi() {
  return Nf;
}
var gu = 0, wu = 0, Eu = !1, Tu = !1, xn = kn.extend({ screenX: null, screenY: null, clientX: null, clientY: null, pageX: null, pageY: null, ctrlKey: null, shiftKey: null, altKey: null, metaKey: null, getModifierState: xi, button: null, buttons: null, relatedTarget: function(e) {
  return e.relatedTarget || (e.fromElement === e.srcElement ? e.toElement : e.fromElement);
}, movementX: function(e) {
  if ("movementX" in e) return e.movementX;
  var t = gu;
  return gu = e.screenX, Eu ? e.type === "mousemove" ? e.screenX - t : 0 : (Eu = !0, 0);
}, movementY: function(e) {
  if ("movementY" in e) return e.movementY;
  var t = wu;
  return wu = e.screenY, Tu ? e.type === "mousemove" ? e.screenY - t : 0 : (Tu = !0, 0);
} }), ms = xn.extend({ pointerId: null, width: null, height: null, pressure: null, tangentialPressure: null, tiltX: null, tiltY: null, twist: null, pointerType: null, isPrimary: null }), Yt = { mouseEnter: { registrationName: "onMouseEnter", dependencies: ["mouseout", "mouseover"] }, mouseLeave: { registrationName: "onMouseLeave", dependencies: ["mouseout", "mouseover"] }, pointerEnter: { registrationName: "onPointerEnter", dependencies: ["pointerout", "pointerover"] }, pointerLeave: {
  registrationName: "onPointerLeave",
  dependencies: ["pointerout", "pointerover"]
} }, Of = { eventTypes: Yt, extractEvents: function(e, t, n, r, l) {
  var i = e === "mouseover" || e === "pointerover", u = e === "mouseout" || e === "pointerout";
  if (i && !(l & 32) && (n.relatedTarget || n.fromElement) || !u && !i) return null;
  if (i = r.window === r ? r : (i = r.ownerDocument) ? i.defaultView || i.parentWindow : window, u) {
    if (u = t, t = (t = n.relatedTarget || n.toElement) ? En(t) : null, t !== null) {
      var o = vt(t);
      (t !== o || t.tag !== 5 && t.tag !== 6) && (t = null);
    }
  } else u = null;
  if (u === t) return null;
  if (e === "mouseout" || e === "mouseover")
    var f = xn, c = Yt.mouseLeave, y = Yt.mouseEnter, g = "mouse";
  else (e === "pointerout" || e === "pointerover") && (f = ms, c = Yt.pointerLeave, y = Yt.pointerEnter, g = "pointer");
  if (e = u == null ? i : dt(u), i = t == null ? i : dt(t), c = f.getPooled(c, u, n, r), c.type = g + "leave", c.target = e, c.relatedTarget = i, n = f.getPooled(y, t, n, r), n.type = g + "enter", n.target = i, n.relatedTarget = e, r = u, g = t, r && g) e: {
    for (f = r, y = g, u = 0, e = f; e; e = _e(e)) u++;
    for (e = 0, t = y; t; t = _e(t)) e++;
    for (; 0 < u - e; ) f = _e(f), u--;
    for (; 0 < e - u; ) y = _e(y), e--;
    for (; u--; ) {
      if (f === y || f === y.alternate) break e;
      f = _e(f), y = _e(y);
    }
    f = null;
  }
  else f = null;
  for (y = f, f = []; r && r !== y && (u = r.alternate, !(u !== null && u === y)); )
    f.push(r), r = _e(r);
  for (r = []; g && g !== y && (u = g.alternate, !(u !== null && u === y)); )
    r.push(g), g = _e(g);
  for (g = 0; g < f.length; g++) Sl(f[g], "bubbled", c);
  for (g = r.length; 0 < g--; ) Sl(r[g], "captured", n);
  return l & 64 ? [c, n] : [c];
} };
function zf(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var pt = typeof Object.is == "function" ? Object.is : zf, Mf = Object.prototype.hasOwnProperty;
function cn(e, t) {
  if (pt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) if (!Mf.call(t, n[r]) || !pt(e[n[r]], t[n[r]])) return !1;
  return !0;
}
var Rf = Ze && "documentMode" in document && 11 >= document.documentMode, hs = { select: { phasedRegistrationNames: { bubbled: "onSelect", captured: "onSelectCapture" }, dependencies: "blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ") } }, kt = null, _l = null, nn = null, Pl = !1;
function ku(e, t) {
  var n = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
  return Pl || kt == null || kt !== Tl(n) ? null : (n = kt, "selectionStart" in n && kl(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = { anchorNode: n.anchorNode, anchorOffset: n.anchorOffset, focusNode: n.focusNode, focusOffset: n.focusOffset }), nn && cn(nn, n) ? null : (nn = n, e = se.getPooled(hs.select, _l, e, t), e.type = "select", e.target = kt, It(e), e));
}
var If = { eventTypes: hs, extractEvents: function(e, t, n, r, l, i) {
  if (l = i || (r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument), !(i = !l)) {
    e: {
      l = fi(l), i = ei.onSelect;
      for (var u = 0; u < i.length; u++) if (!l.has(i[u])) {
        l = !1;
        break e;
      }
      l = !0;
    }
    i = !l;
  }
  if (i) return null;
  switch (l = t ? dt(t) : window, e) {
    case "focus":
      (fs(l) || l.contentEditable === "true") && (kt = l, _l = t, nn = null);
      break;
    case "blur":
      nn = _l = kt = null;
      break;
    case "mousedown":
      Pl = !0;
      break;
    case "contextmenu":
    case "mouseup":
    case "dragend":
      return Pl = !1, ku(n, r);
    case "selectionchange":
      if (Rf) break;
    case "keydown":
    case "keyup":
      return ku(n, r);
  }
  return null;
} }, Ff = se.extend({ animationName: null, elapsedTime: null, pseudoElement: null }), jf = se.extend({ clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), Lf = kn.extend({ relatedTarget: null });
function Hn(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
var Df = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" }, Uf = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, $f = kn.extend({ key: function(e) {
  if (e.key) {
    var t = Df[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = Hn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Uf[e.keyCode] || "Unidentified" : "";
}, location: null, ctrlKey: null, shiftKey: null, altKey: null, metaKey: null, repeat: null, locale: null, getModifierState: xi, charCode: function(e) {
  return e.type === "keypress" ? Hn(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? Hn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), Af = xn.extend({ dataTransfer: null }), Vf = kn.extend({ touches: null, targetTouches: null, changedTouches: null, altKey: null, metaKey: null, ctrlKey: null, shiftKey: null, getModifierState: xi }), Wf = se.extend({ propertyName: null, elapsedTime: null, pseudoElement: null }), Qf = xn.extend({ deltaX: function(e) {
  return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
}, deltaY: function(e) {
  return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
}, deltaZ: null, deltaMode: null }), Hf = { eventTypes: Zo, extractEvents: function(e, t, n, r) {
  var l = Jo.get(e);
  if (!l) return null;
  switch (e) {
    case "keypress":
      if (Hn(n) === 0) return null;
    case "keydown":
    case "keyup":
      e = $f;
      break;
    case "blur":
    case "focus":
      e = Lf;
      break;
    case "click":
      if (n.button === 2) return null;
    case "auxclick":
    case "dblclick":
    case "mousedown":
    case "mousemove":
    case "mouseup":
    case "mouseout":
    case "mouseover":
    case "contextmenu":
      e = xn;
      break;
    case "drag":
    case "dragend":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "dragstart":
    case "drop":
      e = Af;
      break;
    case "touchcancel":
    case "touchend":
    case "touchmove":
    case "touchstart":
      e = Vf;
      break;
    case Do:
    case Uo:
    case $o:
      e = Ff;
      break;
    case Ao:
      e = Wf;
      break;
    case "scroll":
      e = kn;
      break;
    case "wheel":
      e = Qf;
      break;
    case "copy":
    case "cut":
    case "paste":
      e = jf;
      break;
    case "gotpointercapture":
    case "lostpointercapture":
    case "pointercancel":
    case "pointerdown":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "pointerup":
      e = ms;
      break;
    default:
      e = se;
  }
  return t = e.getPooled(l, t, n, r), It(t), t;
} };
if (tr) throw Error(m(101));
tr = Array.prototype.slice.call("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));
yo();
var Kf = Tn;
bl = Ei;
ho = Kf;
vo = dt;
go({ SimpleEventPlugin: Hf, EnterLeaveEventPlugin: Of, ChangeEventPlugin: _f, SelectEventPlugin: If, BeforeInputEventPlugin: gf });
var Nl = [], xt = -1;
function R(e) {
  0 > xt || (e.current = Nl[xt], Nl[xt] = null, xt--);
}
function L(e, t) {
  xt++, Nl[xt] = e.current, e.current = t;
}
var Xe = {}, Y = { current: Xe }, q = { current: !1 }, mt = Xe;
function Ft(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Xe;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {}, i;
  for (i in n) l[i] = t[i];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function b(e) {
  return e = e.childContextTypes, e != null;
}
function or() {
  R(q), R(Y);
}
function xu(e, t, n) {
  if (Y.current !== Xe) throw Error(m(168));
  L(Y, t), L(q, n);
}
function vs(e, t, n) {
  var r = e.stateNode;
  if (e = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in e)) throw Error(m(108, Me(t) || "Unknown", l));
  return G({}, n, {}, r);
}
function Kn(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Xe, mt = Y.current, L(Y, e), L(q, q.current), !0;
}
function Su(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(m(169));
  n ? (e = vs(e, t, mt), r.__reactInternalMemoizedMergedChildContext = e, R(q), R(Y), L(Y, e)) : R(q), L(q, n);
}
var Bf = W.unstable_runWithPriority, Si = W.unstable_scheduleCallback, ys = W.unstable_cancelCallback, Cu = W.unstable_requestPaint, Ol = W.unstable_now, Yf = W.unstable_getCurrentPriorityLevel, zr = W.unstable_ImmediatePriority, gs = W.unstable_UserBlockingPriority, ws = W.unstable_NormalPriority, Es = W.unstable_LowPriority, Ts = W.unstable_IdlePriority, ks = {}, Xf = W.unstable_shouldYield, Gf = Cu !== void 0 ? Cu : function() {
}, Pe = null, Bn = null, Yr = !1, _u = Ol(), ae = 1e4 > _u ? Ol : function() {
  return Ol() - _u;
};
function Mr() {
  switch (Yf()) {
    case zr:
      return 99;
    case gs:
      return 98;
    case ws:
      return 97;
    case Es:
      return 96;
    case Ts:
      return 95;
    default:
      throw Error(m(332));
  }
}
function xs(e) {
  switch (e) {
    case 99:
      return zr;
    case 98:
      return gs;
    case 97:
      return ws;
    case 96:
      return Es;
    case 95:
      return Ts;
    default:
      throw Error(m(332));
  }
}
function Ge(e, t) {
  return e = xs(e), Bf(e, t);
}
function Ss(e, t, n) {
  return e = xs(e), Si(e, t, n);
}
function Pu(e) {
  return Pe === null ? (Pe = [e], Bn = Si(zr, Cs)) : Pe.push(e), ks;
}
function xe() {
  if (Bn !== null) {
    var e = Bn;
    Bn = null, ys(e);
  }
  Cs();
}
function Cs() {
  if (!Yr && Pe !== null) {
    Yr = !0;
    var e = 0;
    try {
      var t = Pe;
      Ge(99, function() {
        for (; e < t.length; e++) {
          var n = t[e];
          do
            n = n(!0);
          while (n !== null);
        }
      }), Pe = null;
    } catch (n) {
      throw Pe !== null && (Pe = Pe.slice(e + 1)), Si(zr, xe), n;
    } finally {
      Yr = !1;
    }
  }
}
function Yn(e, t, n) {
  return n /= 10, 1073741821 - (((1073741821 - e + t / 10) / n | 0) + 1) * n;
}
function pe(e, t) {
  if (e && e.defaultProps) {
    t = G({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
  }
  return t;
}
var sr = { current: null }, ar = null, St = null, fr = null;
function Ci() {
  fr = St = ar = null;
}
function _i(e) {
  var t = sr.current;
  R(sr), e.type._context._currentValue = t;
}
function _s(e, t) {
  for (; e !== null; ) {
    var n = e.alternate;
    if (e.childExpirationTime < t) e.childExpirationTime = t, n !== null && n.childExpirationTime < t && (n.childExpirationTime = t);
    else if (n !== null && n.childExpirationTime < t) n.childExpirationTime = t;
    else break;
    e = e.return;
  }
}
function Ot(e, t) {
  ar = e, fr = St = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.expirationTime >= t && (ge = !0), e.firstContext = null);
}
function ce(e, t) {
  if (fr !== e && t !== !1 && t !== 0)
    if ((typeof t != "number" || t === 1073741823) && (fr = e, t = 1073741823), t = { context: e, observedBits: t, next: null }, St === null) {
      if (ar === null) throw Error(m(308));
      St = t, ar.dependencies = { expirationTime: 0, firstContext: t, responders: null };
    } else St = St.next = t;
  return e._currentValue;
}
var Fe = !1;
function Pi(e) {
  e.updateQueue = { baseState: e.memoizedState, baseQueue: null, shared: { pending: null }, effects: null };
}
function Ni(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, baseQueue: e.baseQueue, shared: e.shared, effects: e.effects });
}
function Qe(e, t) {
  return e = { expirationTime: e, suspenseConfig: t, tag: 0, payload: null, callback: null, next: null }, e.next = e;
}
function He(e, t) {
  if (e = e.updateQueue, e !== null) {
    e = e.shared;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
}
function Nu(e, t) {
  var n = e.alternate;
  n !== null && Ni(n, e), e = e.updateQueue, n = e.baseQueue, n === null ? (e.baseQueue = t.next = t, t.next = t) : (t.next = n.next, n.next = t);
}
function dn(e, t, n, r) {
  var l = e.updateQueue;
  Fe = !1;
  var i = l.baseQueue, u = l.shared.pending;
  if (u !== null) {
    if (i !== null) {
      var o = i.next;
      i.next = u.next, u.next = o;
    }
    i = u, l.shared.pending = null, o = e.alternate, o !== null && (o = o.updateQueue, o !== null && (o.baseQueue = u));
  }
  if (i !== null) {
    o = i.next;
    var f = l.baseState, c = 0, y = null, g = null, _ = null;
    if (o !== null) {
      var z = o;
      do {
        if (u = z.expirationTime, u < r) {
          var J = { expirationTime: z.expirationTime, suspenseConfig: z.suspenseConfig, tag: z.tag, payload: z.payload, callback: z.callback, next: null };
          _ === null ? (g = _ = J, y = f) : _ = _.next = J, u > c && (c = u);
        } else {
          _ !== null && (_ = _.next = { expirationTime: 1073741823, suspenseConfig: z.suspenseConfig, tag: z.tag, payload: z.payload, callback: z.callback, next: null }), na(u, z.suspenseConfig);
          e: {
            var D = e, a = z;
            switch (u = t, J = n, a.tag) {
              case 1:
                if (D = a.payload, typeof D == "function") {
                  f = D.call(J, f, u);
                  break e;
                }
                f = D;
                break e;
              case 3:
                D.effectTag = D.effectTag & -4097 | 64;
              case 0:
                if (D = a.payload, u = typeof D == "function" ? D.call(J, f, u) : D, u == null) break e;
                f = G({}, f, u);
                break e;
              case 2:
                Fe = !0;
            }
          }
          z.callback !== null && (e.effectTag |= 32, u = l.effects, u === null ? l.effects = [z] : u.push(z));
        }
        if (z = z.next, z === null || z === o) {
          if (u = l.shared.pending, u === null) break;
          z = i.next = u.next, u.next = o, l.baseQueue = i = u, l.shared.pending = null;
        }
      } while (!0);
    }
    _ === null ? y = f : _.next = g, l.baseState = y, l.baseQueue = _, Lr(c), e.expirationTime = c, e.memoizedState = f;
  }
}
function Ou(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = l, l = n, typeof r != "function") throw Error(m(191, r));
      r.call(l);
    }
  }
}
var rn = me.ReactCurrentBatchConfig, Ps = new Cr.Component().refs;
function cr(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : G({}, t, n), e.memoizedState = n, e.expirationTime === 0 && (e.updateQueue.baseState = n);
}
var Rr = { isMounted: function(e) {
  return (e = e._reactInternalFiber) ? vt(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternalFiber;
  var r = Te(), l = rn.suspense;
  r = ft(r, e, l), l = Qe(r, l), l.payload = t, n != null && (l.callback = n), He(e, l), Be(e, r);
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternalFiber;
  var r = Te(), l = rn.suspense;
  r = ft(r, e, l), l = Qe(r, l), l.tag = 1, l.payload = t, n != null && (l.callback = n), He(e, l), Be(e, r);
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternalFiber;
  var n = Te(), r = rn.suspense;
  n = ft(n, e, r), r = Qe(n, r), r.tag = 2, t != null && (r.callback = t), He(e, r), Be(e, n);
} };
function zu(e, t, n, r, l, i, u) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, u) : t.prototype && t.prototype.isPureReactComponent ? !cn(n, r) || !cn(l, i) : !0;
}
function Ns(e, t, n) {
  var r = !1, l = Xe, i = t.contextType;
  return typeof i == "object" && i !== null ? i = ce(i) : (l = b(t) ? mt : Y.current, r = t.contextTypes, i = (r = r != null) ? Ft(e, l) : Xe), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Rr, e.stateNode = t, t._reactInternalFiber = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
}
function Mu(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Rr.enqueueReplaceState(t, t.state, null);
}
function zl(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = Ps, Pi(e);
  var i = t.contextType;
  typeof i == "object" && i !== null ? l.context = ce(i) : (i = b(t) ? mt : Y.current, l.context = Ft(e, i)), dn(e, n, l, r), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (cr(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Rr.enqueueReplaceState(l, l.state, null), dn(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.effectTag |= 4);
}
var Rn = Array.isArray;
function Xt(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(m(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(m(147, e));
      var l = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === l ? t.ref : (t = function(i) {
        var u = r.refs;
        u === Ps && (u = r.refs = {}), i === null ? delete u[l] : u[l] = i;
      }, t._stringRef = l, t);
    }
    if (typeof e != "string") throw Error(m(284));
    if (!n._owner) throw Error(m(290, e));
  }
  return e;
}
function In(e, t) {
  if (e.type !== "textarea") throw Error(m(31, Object.prototype.toString.call(t) === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : t, ""));
}
function Os(e) {
  function t(a, s) {
    if (e) {
      var d = a.lastEffect;
      d !== null ? (d.nextEffect = s, a.lastEffect = s) : a.firstEffect = a.lastEffect = s, s.nextEffect = null, s.effectTag = 8;
    }
  }
  function n(a, s) {
    if (!e) return null;
    for (; s !== null; ) t(a, s), s = s.sibling;
    return null;
  }
  function r(a, s) {
    for (a = /* @__PURE__ */ new Map(); s !== null; ) s.key !== null ? a.set(s.key, s) : a.set(s.index, s), s = s.sibling;
    return a;
  }
  function l(a, s) {
    return a = ht(a, s), a.index = 0, a.sibling = null, a;
  }
  function i(a, s, d) {
    return a.index = d, e ? (d = a.alternate, d !== null ? (d = d.index, d < s ? (a.effectTag = 2, s) : d) : (a.effectTag = 2, s)) : s;
  }
  function u(a) {
    return e && a.alternate === null && (a.effectTag = 2), a;
  }
  function o(a, s, d, p) {
    return s === null || s.tag !== 6 ? (s = br(d, a.mode, p), s.return = a, s) : (s = l(s, d), s.return = a, s);
  }
  function f(a, s, d, p) {
    return s !== null && s.elementType === d.type ? (p = l(s, d.props), p.ref = Xt(a, s, d), p.return = a, p) : (p = Jn(d.type, d.key, d.props, null, a.mode, p), p.ref = Xt(a, s, d), p.return = a, p);
  }
  function c(a, s, d, p) {
    return s === null || s.tag !== 4 || s.stateNode.containerInfo !== d.containerInfo || s.stateNode.implementation !== d.implementation ? (s = el(d, a.mode, p), s.return = a, s) : (s = l(s, d.children || []), s.return = a, s);
  }
  function y(a, s, d, p, h) {
    return s === null || s.tag !== 7 ? (s = $e(d, a.mode, p, h), s.return = a, s) : (s = l(s, d), s.return = a, s);
  }
  function g(a, s, d) {
    if (typeof s == "string" || typeof s == "number") return s = br("" + s, a.mode, d), s.return = a, s;
    if (typeof s == "object" && s !== null) {
      switch (s.$$typeof) {
        case Nn:
          return d = Jn(s.type, s.key, s.props, null, a.mode, d), d.ref = Xt(a, null, s), d.return = a, d;
        case wt:
          return s = el(s, a.mode, d), s.return = a, s;
      }
      if (Rn(s) || Wt(s)) return s = $e(s, a.mode, d, null), s.return = a, s;
      In(a, s);
    }
    return null;
  }
  function _(a, s, d, p) {
    var h = s !== null ? s.key : null;
    if (typeof d == "string" || typeof d == "number") return h !== null ? null : o(a, s, "" + d, p);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Nn:
          return d.key === h ? d.type === tt ? y(a, s, d.props.children, p, h) : f(a, s, d, p) : null;
        case wt:
          return d.key === h ? c(a, s, d, p) : null;
      }
      if (Rn(d) || Wt(d)) return h !== null ? null : y(a, s, d, p, null);
      In(a, d);
    }
    return null;
  }
  function z(a, s, d, p, h) {
    if (typeof p == "string" || typeof p == "number") return a = a.get(d) || null, o(s, a, "" + p, h);
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case Nn:
          return a = a.get(p.key === null ? d : p.key) || null, p.type === tt ? y(s, a, p.props.children, h, p.key) : f(s, a, p, h);
        case wt:
          return a = a.get(p.key === null ? d : p.key) || null, c(s, a, p, h);
      }
      if (Rn(p) || Wt(p)) return a = a.get(d) || null, y(s, a, p, h, null);
      In(s, p);
    }
    return null;
  }
  function J(a, s, d, p) {
    for (var h = null, w = null, T = s, P = s = 0, N = null; T !== null && P < d.length; P++) {
      T.index > P ? (N = T, T = null) : N = T.sibling;
      var S = _(a, T, d[P], p);
      if (S === null) {
        T === null && (T = N);
        break;
      }
      e && T && S.alternate === null && t(a, T), s = i(S, s, P), w === null ? h = S : w.sibling = S, w = S, T = N;
    }
    if (P === d.length) return n(a, T), h;
    if (T === null) {
      for (; P < d.length; P++) T = g(a, d[P], p), T !== null && (s = i(T, s, P), w === null ? h = T : w.sibling = T, w = T);
      return h;
    }
    for (T = r(a, T); P < d.length; P++) N = z(T, a, P, d[P], p), N !== null && (e && N.alternate !== null && T.delete(N.key === null ? P : N.key), s = i(N, s, P), w === null ? h = N : w.sibling = N, w = N);
    return e && T.forEach(function(ne) {
      return t(a, ne);
    }), h;
  }
  function D(a, s, d, p) {
    var h = Wt(d);
    if (typeof h != "function") throw Error(m(150));
    if (d = h.call(d), d == null) throw Error(m(151));
    for (var w = h = null, T = s, P = s = 0, N = null, S = d.next(); T !== null && !S.done; P++, S = d.next()) {
      T.index > P ? (N = T, T = null) : N = T.sibling;
      var ne = _(a, T, S.value, p);
      if (ne === null) {
        T === null && (T = N);
        break;
      }
      e && T && ne.alternate === null && t(a, T), s = i(ne, s, P), w === null ? h = ne : w.sibling = ne, w = ne, T = N;
    }
    if (S.done) return n(a, T), h;
    if (T === null) {
      for (; !S.done; P++, S = d.next()) S = g(a, S.value, p), S !== null && (s = i(S, s, P), w === null ? h = S : w.sibling = S, w = S);
      return h;
    }
    for (T = r(a, T); !S.done; P++, S = d.next()) S = z(T, a, P, S.value, p), S !== null && (e && S.alternate !== null && T.delete(S.key === null ? P : S.key), s = i(S, s, P), w === null ? h = S : w.sibling = S, w = S);
    return e && T.forEach(function(re) {
      return t(a, re);
    }), h;
  }
  return function(a, s, d, p) {
    var h = typeof d == "object" && d !== null && d.type === tt && d.key === null;
    h && (d = d.props.children);
    var w = typeof d == "object" && d !== null;
    if (w) switch (d.$$typeof) {
      case Nn:
        e: {
          for (w = d.key, h = s; h !== null; ) {
            if (h.key === w) {
              switch (h.tag) {
                case 7:
                  if (d.type === tt) {
                    n(a, h.sibling), s = l(h, d.props.children), s.return = a, a = s;
                    break e;
                  }
                  break;
                default:
                  if (h.elementType === d.type) {
                    n(
                      a,
                      h.sibling
                    ), s = l(h, d.props), s.ref = Xt(a, h, d), s.return = a, a = s;
                    break e;
                  }
              }
              n(a, h);
              break;
            } else t(a, h);
            h = h.sibling;
          }
          d.type === tt ? (s = $e(d.props.children, a.mode, p, d.key), s.return = a, a = s) : (p = Jn(d.type, d.key, d.props, null, a.mode, p), p.ref = Xt(a, s, d), p.return = a, a = p);
        }
        return u(a);
      case wt:
        e: {
          for (h = d.key; s !== null; ) {
            if (s.key === h) if (s.tag === 4 && s.stateNode.containerInfo === d.containerInfo && s.stateNode.implementation === d.implementation) {
              n(a, s.sibling), s = l(s, d.children || []), s.return = a, a = s;
              break e;
            } else {
              n(a, s);
              break;
            }
            else t(a, s);
            s = s.sibling;
          }
          s = el(d, a.mode, p), s.return = a, a = s;
        }
        return u(a);
    }
    if (typeof d == "string" || typeof d == "number") return d = "" + d, s !== null && s.tag === 6 ? (n(a, s.sibling), s = l(s, d), s.return = a, a = s) : (n(a, s), s = br(d, a.mode, p), s.return = a, a = s), u(a);
    if (Rn(d)) return J(a, s, d, p);
    if (Wt(d)) return D(a, s, d, p);
    if (w && In(a, d), typeof d == "undefined" && !h) switch (a.tag) {
      case 1:
      case 0:
        throw a = a.type, Error(m(152, a.displayName || a.name || "Component"));
    }
    return n(a, s);
  };
}
var jt = Os(!0), Oi = Os(!1), Sn = {}, Ee = { current: Sn }, pn = { current: Sn }, mn = { current: Sn };
function rt(e) {
  if (e === Sn) throw Error(m(174));
  return e;
}
function Ml(e, t) {
  switch (L(mn, t), L(pn, e), L(Ee, Sn), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ml(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = ml(t, e);
  }
  R(Ee), L(Ee, t);
}
function Lt() {
  R(Ee), R(pn), R(mn);
}
function Ru(e) {
  rt(mn.current);
  var t = rt(Ee.current), n = ml(t, e.type);
  t !== n && (L(pn, e), L(Ee, n));
}
function zi(e) {
  pn.current === e && (R(Ee), R(pn));
}
var F = { current: 0 };
function dr(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === yi || n.data === gi)) return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.effectTag & 64) return t;
    } else if (t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
  return null;
}
function Mi(e, t) {
  return { responder: e, props: t };
}
var Xn = me.ReactCurrentDispatcher, fe = me.ReactCurrentBatchConfig, De = 0, $ = null, K = null, B = null, pr = !1;
function le() {
  throw Error(m(321));
}
function Ri(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!pt(e[n], t[n])) return !1;
  return !0;
}
function Ii(e, t, n, r, l, i) {
  if (De = i, $ = t, t.memoizedState = null, t.updateQueue = null, t.expirationTime = 0, Xn.current = e === null || e.memoizedState === null ? Zf : Jf, e = n(r, l), t.expirationTime === De) {
    i = 0;
    do {
      if (t.expirationTime = 0, !(25 > i)) throw Error(m(301));
      i += 1, B = K = null, t.updateQueue = null, Xn.current = qf, e = n(r, l);
    } while (t.expirationTime === De);
  }
  if (Xn.current = vr, t = K !== null && K.next !== null, De = 0, B = K = $ = null, pr = !1, t) throw Error(m(300));
  return e;
}
function zt() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return B === null ? $.memoizedState = B = e : B = B.next = e, B;
}
function Ut() {
  if (K === null) {
    var e = $.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = K.next;
  var t = B === null ? $.memoizedState : B.next;
  if (t !== null) B = t, K = e;
  else {
    if (e === null) throw Error(m(310));
    K = e, e = { memoizedState: K.memoizedState, baseState: K.baseState, baseQueue: K.baseQueue, queue: K.queue, next: null }, B === null ? $.memoizedState = B = e : B = B.next = e;
  }
  return B;
}
function ot(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Fn(e) {
  var t = Ut(), n = t.queue;
  if (n === null) throw Error(m(311));
  n.lastRenderedReducer = e;
  var r = K, l = r.baseQueue, i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var u = l.next;
      l.next = i.next, i.next = u;
    }
    r.baseQueue = l = i, n.pending = null;
  }
  if (l !== null) {
    l = l.next, r = r.baseState;
    var o = u = i = null, f = l;
    do {
      var c = f.expirationTime;
      if (c < De) {
        var y = { expirationTime: f.expirationTime, suspenseConfig: f.suspenseConfig, action: f.action, eagerReducer: f.eagerReducer, eagerState: f.eagerState, next: null };
        o === null ? (u = o = y, i = r) : o = o.next = y, c > $.expirationTime && ($.expirationTime = c, Lr(c));
      } else o !== null && (o = o.next = { expirationTime: 1073741823, suspenseConfig: f.suspenseConfig, action: f.action, eagerReducer: f.eagerReducer, eagerState: f.eagerState, next: null }), na(c, f.suspenseConfig), r = f.eagerReducer === e ? f.eagerState : e(r, f.action);
      f = f.next;
    } while (f !== null && f !== l);
    o === null ? i = r : o.next = u, pt(r, t.memoizedState) || (ge = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = o, n.lastRenderedState = r;
  }
  return [t.memoizedState, n.dispatch];
}
function jn(e) {
  var t = Ut(), n = t.queue;
  if (n === null) throw Error(m(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, l = n.pending, i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var u = l = l.next;
    do
      i = e(i, u.action), u = u.next;
    while (u !== l);
    pt(i, t.memoizedState) || (ge = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function Xr(e) {
  var t = zt();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = t.queue = { pending: null, dispatch: null, lastRenderedReducer: ot, lastRenderedState: e }, e = e.dispatch = js.bind(null, $, e), [t.memoizedState, e];
}
function Rl(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = $.updateQueue, t === null ? (t = { lastEffect: null }, $.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function zs() {
  return Ut().memoizedState;
}
function Il(e, t, n, r) {
  var l = zt();
  $.effectTag |= e, l.memoizedState = Rl(1 | t, n, void 0, r === void 0 ? null : r);
}
function Fi(e, t, n, r) {
  var l = Ut();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (K !== null) {
    var u = K.memoizedState;
    if (i = u.destroy, r !== null && Ri(r, u.deps)) {
      Rl(t, n, i, r);
      return;
    }
  }
  $.effectTag |= e, l.memoizedState = Rl(1 | t, n, i, r);
}
function Iu(e, t) {
  return Il(516, 4, e, t);
}
function mr(e, t) {
  return Fi(516, 4, e, t);
}
function Ms(e, t) {
  return Fi(4, 2, e, t);
}
function Rs(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function Is(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Fi(4, 2, Rs.bind(null, t, e), n);
}
function ji() {
}
function Fu(e, t) {
  return zt().memoizedState = [e, t === void 0 ? null : t], e;
}
function hr(e, t) {
  var n = Ut();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ri(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Fs(e, t) {
  var n = Ut();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ri(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function Li(e, t, n) {
  var r = Mr();
  Ge(98 > r ? 98 : r, function() {
    e(!0);
  }), Ge(97 < r ? 97 : r, function() {
    var l = fe.suspense;
    fe.suspense = t === void 0 ? null : t;
    try {
      e(!1), n();
    } finally {
      fe.suspense = l;
    }
  });
}
function js(e, t, n) {
  var r = Te(), l = rn.suspense;
  r = ft(r, e, l), l = { expirationTime: r, suspenseConfig: l, action: n, eagerReducer: null, eagerState: null, next: null };
  var i = t.pending;
  if (i === null ? l.next = l : (l.next = i.next, i.next = l), t.pending = l, i = e.alternate, e === $ || i !== null && i === $) pr = !0, l.expirationTime = De, $.expirationTime = De;
  else {
    if (e.expirationTime === 0 && (i === null || i.expirationTime === 0) && (i = t.lastRenderedReducer, i !== null)) try {
      var u = t.lastRenderedState, o = i(u, n);
      if (l.eagerReducer = i, l.eagerState = o, pt(o, u)) return;
    } catch (f) {
    } finally {
    }
    Be(
      e,
      r
    );
  }
}
var vr = { readContext: ce, useCallback: le, useContext: le, useEffect: le, useImperativeHandle: le, useLayoutEffect: le, useMemo: le, useReducer: le, useRef: le, useState: le, useDebugValue: le, useResponder: le, useDeferredValue: le, useTransition: le }, Zf = { readContext: ce, useCallback: Fu, useContext: ce, useEffect: Iu, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Il(4, 2, Rs.bind(null, t, e), n);
}, useLayoutEffect: function(e, t) {
  return Il(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = zt();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [
    e,
    t
  ], e;
}, useReducer: function(e, t, n) {
  var r = zt();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = r.queue = { pending: null, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, e = e.dispatch = js.bind(null, $, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = zt();
  return e = { current: e }, t.memoizedState = e;
}, useState: Xr, useDebugValue: ji, useResponder: Mi, useDeferredValue: function(e, t) {
  var n = Xr(e), r = n[0], l = n[1];
  return Iu(function() {
    var i = fe.suspense;
    fe.suspense = t === void 0 ? null : t;
    try {
      l(e);
    } finally {
      fe.suspense = i;
    }
  }, [e, t]), r;
}, useTransition: function(e) {
  var t = Xr(!1), n = t[0];
  return t = t[1], [Fu(Li.bind(null, t, e), [t, e]), n];
} }, Jf = { readContext: ce, useCallback: hr, useContext: ce, useEffect: mr, useImperativeHandle: Is, useLayoutEffect: Ms, useMemo: Fs, useReducer: Fn, useRef: zs, useState: function() {
  return Fn(ot);
}, useDebugValue: ji, useResponder: Mi, useDeferredValue: function(e, t) {
  var n = Fn(ot), r = n[0], l = n[1];
  return mr(function() {
    var i = fe.suspense;
    fe.suspense = t === void 0 ? null : t;
    try {
      l(e);
    } finally {
      fe.suspense = i;
    }
  }, [e, t]), r;
}, useTransition: function(e) {
  var t = Fn(ot), n = t[0];
  return t = t[1], [hr(Li.bind(null, t, e), [t, e]), n];
} }, qf = { readContext: ce, useCallback: hr, useContext: ce, useEffect: mr, useImperativeHandle: Is, useLayoutEffect: Ms, useMemo: Fs, useReducer: jn, useRef: zs, useState: function() {
  return jn(ot);
}, useDebugValue: ji, useResponder: Mi, useDeferredValue: function(e, t) {
  var n = jn(ot), r = n[0], l = n[1];
  return mr(function() {
    var i = fe.suspense;
    fe.suspense = t === void 0 ? null : t;
    try {
      l(e);
    } finally {
      fe.suspense = i;
    }
  }, [e, t]), r;
}, useTransition: function(e) {
  var t = jn(ot), n = t[0];
  return t = t[1], [hr(Li.bind(
    null,
    t,
    e
  ), [t, e]), n];
} }, Oe = null, Ue = null, st = !1;
function Ls(e, t) {
  var n = we(5, null, null, 0);
  n.elementType = "DELETED", n.type = "DELETED", n.stateNode = t, n.return = e, n.effectTag = 8, e.lastEffect !== null ? (e.lastEffect.nextEffect = n, e.lastEffect = n) : e.firstEffect = e.lastEffect = n;
}
function ju(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, !0) : !1;
    case 13:
      return !1;
    default:
      return !1;
  }
}
function Fl(e) {
  if (st) {
    var t = Ue;
    if (t) {
      var n = t;
      if (!ju(e, t)) {
        if (t = Nt(n.nextSibling), !t || !ju(e, t)) {
          e.effectTag = e.effectTag & -1025 | 2, st = !1, Oe = e;
          return;
        }
        Ls(Oe, n);
      }
      Oe = e, Ue = Nt(t.firstChild);
    } else e.effectTag = e.effectTag & -1025 | 2, st = !1, Oe = e;
  }
}
function Lu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Oe = e;
}
function Ln(e) {
  if (e !== Oe) return !1;
  if (!st) return Lu(e), st = !0, !1;
  var t = e.type;
  if (e.tag !== 5 || t !== "head" && t !== "body" && !xl(t, e.memoizedProps)) for (t = Ue; t; ) Ls(e, t), t = Nt(t.nextSibling);
  if (Lu(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(m(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === ns) {
            if (t === 0) {
              Ue = Nt(e.nextSibling);
              break e;
            }
            t--;
          } else n !== ts && n !== gi && n !== yi || t++;
        }
        e = e.nextSibling;
      }
      Ue = null;
    }
  } else Ue = Oe ? Nt(e.stateNode.nextSibling) : null;
  return !0;
}
function Gr() {
  Ue = Oe = null, st = !1;
}
var bf = me.ReactCurrentOwner, ge = !1;
function ie(e, t, n, r) {
  t.child = e === null ? Oi(t, null, n, r) : jt(t, e.child, n, r);
}
function Du(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return Ot(t, l), r = Ii(e, t, n, r, i, l), e !== null && !ge ? (t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= l && (e.expirationTime = 0), ze(e, t, l)) : (t.effectTag |= 1, ie(e, t, r, l), t.child);
}
function Uu(e, t, n, r, l, i) {
  if (e === null) {
    var u = n.type;
    return typeof u == "function" && !Vi(u) && u.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = u, Ds(e, t, u, r, l, i)) : (e = Jn(n.type, null, r, null, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
  }
  return u = e.child, l < i && (l = u.memoizedProps, n = n.compare, n = n !== null ? n : cn, n(l, r) && e.ref === t.ref) ? ze(e, t, i) : (t.effectTag |= 1, e = ht(u, r), e.ref = t.ref, e.return = t, t.child = e);
}
function Ds(e, t, n, r, l, i) {
  return e !== null && cn(e.memoizedProps, r) && e.ref === t.ref && (ge = !1, l < i) ? (t.expirationTime = e.expirationTime, ze(e, t, i)) : jl(e, t, n, r, i);
}
function Us(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.effectTag |= 128);
}
function jl(e, t, n, r, l) {
  var i = b(n) ? mt : Y.current;
  return i = Ft(t, i), Ot(t, l), n = Ii(e, t, n, r, i, l), e !== null && !ge ? (t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= l && (e.expirationTime = 0), ze(e, t, l)) : (t.effectTag |= 1, ie(e, t, n, l), t.child);
}
function $u(e, t, n, r, l) {
  if (b(n)) {
    var i = !0;
    Kn(t);
  } else i = !1;
  if (Ot(t, l), t.stateNode === null) e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= 2), Ns(t, n, r), zl(t, n, r, l), r = !0;
  else if (e === null) {
    var u = t.stateNode, o = t.memoizedProps;
    u.props = o;
    var f = u.context, c = n.contextType;
    typeof c == "object" && c !== null ? c = ce(c) : (c = b(n) ? mt : Y.current, c = Ft(t, c));
    var y = n.getDerivedStateFromProps, g = typeof y == "function" || typeof u.getSnapshotBeforeUpdate == "function";
    g || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (o !== r || f !== c) && Mu(t, u, r, c), Fe = !1;
    var _ = t.memoizedState;
    u.state = _, dn(t, r, u, l), f = t.memoizedState, o !== r || _ !== f || q.current || Fe ? (typeof y == "function" && (cr(t, n, y, r), f = t.memoizedState), (o = Fe || zu(t, n, o, r, _, f, c)) ? (g || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.effectTag |= 4)) : (typeof u.componentDidMount == "function" && (t.effectTag |= 4), t.memoizedProps = r, t.memoizedState = f), u.props = r, u.state = f, u.context = c, r = o) : (typeof u.componentDidMount == "function" && (t.effectTag |= 4), r = !1);
  } else u = t.stateNode, Ni(e, t), o = t.memoizedProps, u.props = t.type === t.elementType ? o : pe(t.type, o), f = u.context, c = n.contextType, typeof c == "object" && c !== null ? c = ce(c) : (c = b(n) ? mt : Y.current, c = Ft(t, c)), y = n.getDerivedStateFromProps, (g = typeof y == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (o !== r || f !== c) && Mu(t, u, r, c), Fe = !1, f = t.memoizedState, u.state = f, dn(t, r, u, l), _ = t.memoizedState, o !== r || f !== _ || q.current || Fe ? (typeof y == "function" && (cr(t, n, y, r), _ = t.memoizedState), (y = Fe || zu(t, n, o, r, f, _, c)) ? (g || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(
    r,
    _,
    c
  ), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(r, _, c)), typeof u.componentDidUpdate == "function" && (t.effectTag |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.effectTag |= 256)) : (typeof u.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.effectTag |= 4), typeof u.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.effectTag |= 256), t.memoizedProps = r, t.memoizedState = _), u.props = r, u.state = _, u.context = c, r = y) : (typeof u.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.effectTag |= 4), typeof u.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.effectTag |= 256), r = !1);
  return Ll(e, t, n, r, i, l);
}
function Ll(e, t, n, r, l, i) {
  Us(e, t);
  var u = (t.effectTag & 64) !== 0;
  if (!r && !u) return l && Su(t, n, !1), ze(e, t, i);
  r = t.stateNode, bf.current = t;
  var o = u && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.effectTag |= 1, e !== null && u ? (t.child = jt(t, e.child, null, i), t.child = jt(t, null, o, i)) : ie(e, t, o, i), t.memoizedState = r.state, l && Su(t, n, !0), t.child;
}
function Au(e) {
  var t = e.stateNode;
  t.pendingContext ? xu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && xu(e, t.context, !1), Ml(e, t.containerInfo);
}
var Zr = { dehydrated: null, retryTime: 0 };
function Vu(e, t, n) {
  var r = t.mode, l = t.pendingProps, i = F.current, u = !1, o;
  if ((o = (t.effectTag & 64) !== 0) || (o = (i & 2) !== 0 && (e === null || e.memoizedState !== null)), o ? (u = !0, t.effectTag &= -65) : e !== null && e.memoizedState === null || l.fallback === void 0 || l.unstable_avoidThisFallback === !0 || (i |= 1), L(F, i & 1), e === null) {
    if (l.fallback !== void 0 && Fl(t), u) {
      if (u = l.fallback, l = $e(null, r, 0, null), l.return = t, !(t.mode & 2)) for (e = t.memoizedState !== null ? t.child.child : t.child, l.child = e; e !== null; ) e.return = l, e = e.sibling;
      return n = $e(u, r, n, null), n.return = t, l.sibling = n, t.memoizedState = Zr, t.child = l, n;
    }
    return r = l.children, t.memoizedState = null, t.child = Oi(t, null, r, n);
  }
  if (e.memoizedState !== null) {
    if (e = e.child, r = e.sibling, u) {
      if (l = l.fallback, n = ht(e, e.pendingProps), n.return = t, !(t.mode & 2) && (u = t.memoizedState !== null ? t.child.child : t.child, u !== e.child)) for (n.child = u; u !== null; ) u.return = n, u = u.sibling;
      return r = ht(r, l), r.return = t, n.sibling = r, n.childExpirationTime = 0, t.memoizedState = Zr, t.child = n, r;
    }
    return n = jt(t, e.child, l.children, n), t.memoizedState = null, t.child = n;
  }
  if (e = e.child, u) {
    if (u = l.fallback, l = $e(null, r, 0, null), l.return = t, l.child = e, e !== null && (e.return = l), !(t.mode & 2)) for (e = t.memoizedState !== null ? t.child.child : t.child, l.child = e; e !== null; ) e.return = l, e = e.sibling;
    return n = $e(u, r, n, null), n.return = t, l.sibling = n, n.effectTag |= 2, l.childExpirationTime = 0, t.memoizedState = Zr, t.child = l, n;
  }
  return t.memoizedState = null, t.child = jt(t, e, l.children, n);
}
function Wu(e, t) {
  e.expirationTime < t && (e.expirationTime = t);
  var n = e.alternate;
  n !== null && n.expirationTime < t && (n.expirationTime = t), _s(e.return, t);
}
function Jr(e, t, n, r, l, i) {
  var u = e.memoizedState;
  u === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailExpiration: 0, tailMode: l, lastEffect: i } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = r, u.tail = n, u.tailExpiration = 0, u.tailMode = l, u.lastEffect = i);
}
function Qu(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, i = r.tail;
  if (ie(e, t, r.children, n), r = F.current, r & 2) r = r & 1 | 2, t.effectTag |= 64;
  else {
    if (e !== null && e.effectTag & 64) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && Wu(e, n);
      else if (e.tag === 19) Wu(e, n);
      else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (L(F, r), !(t.mode & 2)) t.memoizedState = null;
  else switch (l) {
    case "forwards":
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && dr(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Jr(t, !1, l, n, i, t.lastEffect);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && dr(e) === null) {
          t.child = l;
          break;
        }
        e = l.sibling, l.sibling = n, n = l, l = e;
      }
      Jr(t, !0, n, null, i, t.lastEffect);
      break;
    case "together":
      Jr(t, !1, null, null, void 0, t.lastEffect);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function ze(e, t, n) {
  e !== null && (t.dependencies = e.dependencies);
  var r = t.expirationTime;
  if (r !== 0 && Lr(r), t.childExpirationTime < n) return null;
  if (e !== null && t.child !== e.child) throw Error(m(153));
  if (t.child !== null) {
    for (e = t.child, n = ht(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = ht(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
var $s, Dl, As, Vs;
$s = function(e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
Dl = function() {
};
As = function(e, t, n, r, l) {
  var i = e.memoizedProps;
  if (i !== r) {
    var u = t.stateNode;
    switch (rt(Ee.current), e = null, n) {
      case "input":
        i = al(u, i), r = al(u, r), e = [];
        break;
      case "option":
        i = dl(u, i), r = dl(u, r), e = [];
        break;
      case "select":
        i = G({}, i, { value: void 0 }), r = G({}, r, { value: void 0 }), e = [];
        break;
      case "textarea":
        i = pl(u, i), r = pl(u, r), e = [];
        break;
      default:
        typeof i.onClick != "function" && typeof r.onClick == "function" && (u.onclick = lr);
    }
    wl(n, r);
    var o, f;
    n = null;
    for (o in i) if (!r.hasOwnProperty(o) && i.hasOwnProperty(o) && i[o] != null) if (o === "style") for (f in u = i[o], u) u.hasOwnProperty(f) && (n || (n = {}), n[f] = "");
    else o !== "dangerouslySetInnerHTML" && o !== "children" && o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (Mt.hasOwnProperty(o) ? e || (e = []) : (e = e || []).push(o, null));
    for (o in r) {
      var c = r[o];
      if (u = i != null ? i[o] : void 0, r.hasOwnProperty(o) && c !== u && (c != null || u != null)) if (o === "style") if (u) {
        for (f in u) !u.hasOwnProperty(f) || c && c.hasOwnProperty(f) || (n || (n = {}), n[f] = "");
        for (f in c) c.hasOwnProperty(f) && u[f] !== c[f] && (n || (n = {}), n[f] = c[f]);
      } else n || (e || (e = []), e.push(o, n)), n = c;
      else o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, u = u ? u.__html : void 0, c != null && u !== c && (e = e || []).push(o, c)) : o === "children" ? u === c || typeof c != "string" && typeof c != "number" || (e = e || []).push(o, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && (Mt.hasOwnProperty(o) ? (c != null && Ce(l, o), e || u === c || (e = [])) : (e = e || []).push(o, c));
    }
    n && (e = e || []).push("style", n), l = e, (t.updateQueue = l) && (t.effectTag |= 4);
  }
};
Vs = function(e, t, n, r) {
  n !== r && (t.effectTag |= 4);
};
function Dn(e, t) {
  switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
      n === null ? e.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = e.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function ec(e, t, n) {
  var r = t.pendingProps;
  switch (t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return null;
    case 1:
      return b(t.type) && or(), null;
    case 3:
      return Lt(), R(q), R(Y), n = t.stateNode, n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), e !== null && e.child !== null || !Ln(t) || (t.effectTag |= 4), Dl(t), null;
    case 5:
      zi(t), n = rt(mn.current);
      var l = t.type;
      if (e !== null && t.stateNode != null) As(e, t, l, r, n), e.ref !== t.ref && (t.effectTag |= 128);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(m(166));
          return null;
        }
        if (e = rt(Ee.current), Ln(t)) {
          r = t.stateNode, l = t.type;
          var i = t.memoizedProps;
          switch (r[je] = t, r[ir] = i, l) {
            case "iframe":
            case "object":
            case "embed":
              I("load", r);
              break;
            case "video":
            case "audio":
              for (e = 0; e < Gt.length; e++) I(Gt[e], r);
              break;
            case "source":
              I("error", r);
              break;
            case "img":
            case "image":
            case "link":
              I("error", r), I("load", r);
              break;
            case "form":
              I("reset", r), I("submit", r);
              break;
            case "details":
              I("toggle", r);
              break;
            case "input":
              eu(r, i), I("invalid", r), Ce(n, "onChange");
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, I("invalid", r), Ce(n, "onChange");
              break;
            case "textarea":
              nu(r, i), I("invalid", r), Ce(n, "onChange");
          }
          wl(l, i), e = null;
          for (var u in i) if (i.hasOwnProperty(u)) {
            var o = i[u];
            u === "children" ? typeof o == "string" ? r.textContent !== o && (e = ["children", o]) : typeof o == "number" && r.textContent !== "" + o && (e = ["children", "" + o]) : Mt.hasOwnProperty(u) && o != null && Ce(n, u);
          }
          switch (l) {
            case "input":
              On(r), tu(r, i, !0);
              break;
            case "textarea":
              On(r), ru(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = lr);
          }
          n = e, t.updateQueue = n, n !== null && (t.effectTag |= 4);
        } else {
          switch (u = n.nodeType === 9 ? n : n.ownerDocument, e === au && (e = Fo(l)), e === au ? l === "script" ? (e = u.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = u.createElement(l, { is: r.is }) : (e = u.createElement(l), l === "select" && (u = e, r.multiple ? u.multiple = !0 : r.size && (u.size = r.size))) : e = u.createElementNS(e, l), e[je] = t, e[ir] = r, $s(e, t, !1, !1), t.stateNode = e, u = El(l, r), l) {
            case "iframe":
            case "object":
            case "embed":
              I(
                "load",
                e
              ), o = r;
              break;
            case "video":
            case "audio":
              for (o = 0; o < Gt.length; o++) I(Gt[o], e);
              o = r;
              break;
            case "source":
              I("error", e), o = r;
              break;
            case "img":
            case "image":
            case "link":
              I("error", e), I("load", e), o = r;
              break;
            case "form":
              I("reset", e), I("submit", e), o = r;
              break;
            case "details":
              I("toggle", e), o = r;
              break;
            case "input":
              eu(e, r), o = al(e, r), I("invalid", e), Ce(n, "onChange");
              break;
            case "option":
              o = dl(e, r);
              break;
            case "select":
              e._wrapperState = { wasMultiple: !!r.multiple }, o = G({}, r, { value: void 0 }), I("invalid", e), Ce(n, "onChange");
              break;
            case "textarea":
              nu(
                e,
                r
              ), o = pl(e, r), I("invalid", e), Ce(n, "onChange");
              break;
            default:
              o = r;
          }
          wl(l, o);
          var f = o;
          for (i in f) if (f.hasOwnProperty(i)) {
            var c = f[i];
            i === "style" ? bo(e, c) : i === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && jo(e, c)) : i === "children" ? typeof c == "string" ? (l !== "textarea" || c !== "") && on(e, c) : typeof c == "number" && on(e, "" + c) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (Mt.hasOwnProperty(i) ? c != null && Ce(n, i) : c != null && ui(e, i, c, u));
          }
          switch (l) {
            case "input":
              On(e), tu(e, r, !1);
              break;
            case "textarea":
              On(e), ru(e);
              break;
            case "option":
              r.value != null && e.setAttribute("value", "" + Ye(r.value));
              break;
            case "select":
              e.multiple = !!r.multiple, n = r.value, n != null ? Pt(e, !!r.multiple, n, !1) : r.defaultValue != null && Pt(e, !!r.multiple, r.defaultValue, !0);
              break;
            default:
              typeof o.onClick == "function" && (e.onclick = lr);
          }
          rs(l, r) && (t.effectTag |= 4);
        }
        t.ref !== null && (t.effectTag |= 128);
      }
      return null;
    case 6:
      if (e && t.stateNode != null) Vs(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(m(166));
        n = rt(mn.current), rt(Ee.current), Ln(t) ? (n = t.stateNode, r = t.memoizedProps, n[je] = t, n.nodeValue !== r && (t.effectTag |= 4)) : (n = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), n[je] = t, t.stateNode = n);
      }
      return null;
    case 13:
      return R(F), r = t.memoizedState, t.effectTag & 64 ? (t.expirationTime = n, t) : (n = r !== null, r = !1, e === null ? t.memoizedProps.fallback !== void 0 && Ln(t) : (l = e.memoizedState, r = l !== null, n || l === null || (l = e.child.sibling, l !== null && (i = t.firstEffect, i !== null ? (t.firstEffect = l, l.nextEffect = i) : (t.firstEffect = t.lastEffect = l, l.nextEffect = null), l.effectTag = 8))), n && !r && t.mode & 2 && (e === null && t.memoizedProps.unstable_avoidThisFallback !== !0 || F.current & 1 ? A === at && (A = wr) : ((A === at || A === wr) && (A = Ir), vn !== 0 && ue !== null && (ut(ue, ee), oa(ue, vn)))), (n || r) && (t.effectTag |= 4), null);
    case 4:
      return Lt(), Dl(t), null;
    case 10:
      return _i(t), null;
    case 17:
      return b(t.type) && or(), null;
    case 19:
      if (R(F), r = t.memoizedState, r === null) return null;
      if (l = (t.effectTag & 64) !== 0, i = r.rendering, i === null) {
        if (l) Dn(r, !1);
        else if (A !== at || e !== null && e.effectTag & 64) for (i = t.child; i !== null; ) {
          if (e = dr(i), e !== null) {
            for (t.effectTag |= 64, Dn(r, !1), l = e.updateQueue, l !== null && (t.updateQueue = l, t.effectTag |= 4), r.lastEffect === null && (t.firstEffect = null), t.lastEffect = r.lastEffect, r = t.child; r !== null; ) l = r, i = n, l.effectTag &= 2, l.nextEffect = null, l.firstEffect = null, l.lastEffect = null, e = l.alternate, e === null ? (l.childExpirationTime = 0, l.expirationTime = i, l.child = null, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null) : (l.childExpirationTime = e.childExpirationTime, l.expirationTime = e.expirationTime, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, i = e.dependencies, l.dependencies = i === null ? null : { expirationTime: i.expirationTime, firstContext: i.firstContext, responders: i.responders }), r = r.sibling;
            return L(F, F.current & 1 | 2), t.child;
          }
          i = i.sibling;
        }
      } else {
        if (!l) if (e = dr(i), e !== null) {
          if (t.effectTag |= 64, l = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.effectTag |= 4), Dn(r, !0), r.tail === null && r.tailMode === "hidden" && !i.alternate) return t = t.lastEffect = r.lastEffect, t !== null && (t.nextEffect = null), null;
        } else 2 * ae() - r.renderingStartTime > r.tailExpiration && 1 < n && (t.effectTag |= 64, l = !0, Dn(r, !1), t.expirationTime = t.childExpirationTime = n - 1);
        r.isBackwards ? (i.sibling = t.child, t.child = i) : (n = r.last, n !== null ? n.sibling = i : t.child = i, r.last = i);
      }
      return r.tail !== null ? (r.tailExpiration === 0 && (r.tailExpiration = ae() + 500), n = r.tail, r.rendering = n, r.tail = n.sibling, r.lastEffect = t.lastEffect, r.renderingStartTime = ae(), n.sibling = null, t = F.current, L(F, l ? t & 1 | 2 : t & 1), n) : null;
  }
  throw Error(m(
    156,
    t.tag
  ));
}
function tc(e) {
  switch (e.tag) {
    case 1:
      b(e.type) && or();
      var t = e.effectTag;
      return t & 4096 ? (e.effectTag = t & -4097 | 64, e) : null;
    case 3:
      if (Lt(), R(q), R(Y), t = e.effectTag, t & 64) throw Error(m(285));
      return e.effectTag = t & -4097 | 64, e;
    case 5:
      return zi(e), null;
    case 13:
      return R(F), t = e.effectTag, t & 4096 ? (e.effectTag = t & -4097 | 64, e) : null;
    case 19:
      return R(F), null;
    case 4:
      return Lt(), null;
    case 10:
      return _i(e), null;
    default:
      return null;
  }
}
function Di(e, t) {
  return { value: e, source: t, stack: ai(t) };
}
var nc = typeof WeakSet == "function" ? WeakSet : Set;
function Ul(e, t) {
  var n = t.source, r = t.stack;
  r === null && n !== null && (r = ai(n)), n !== null && Me(n.type), t = t.value, e !== null && e.tag === 1 && Me(e.type);
  try {
    console.error(t);
  } catch (l) {
    setTimeout(function() {
      throw l;
    });
  }
}
function rc(e, t) {
  try {
    t.props = e.memoizedProps, t.state = e.memoizedState, t.componentWillUnmount();
  } catch (n) {
    ct(e, n);
  }
}
function Hu(e) {
  var t = e.ref;
  if (t !== null) if (typeof t == "function") try {
    t(null);
  } catch (n) {
    ct(e, n);
  }
  else t.current = null;
}
function lc(e, t) {
  switch (t.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      return;
    case 1:
      if (t.effectTag & 256 && e !== null) {
        var n = e.memoizedProps, r = e.memoizedState;
        e = t.stateNode, t = e.getSnapshotBeforeUpdate(t.elementType === t.type ? n : pe(t.type, n), r), e.__reactInternalSnapshotBeforeUpdate = t;
      }
      return;
    case 3:
    case 5:
    case 6:
    case 4:
    case 17:
      return;
  }
  throw Error(m(163));
}
function Ws(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.destroy;
        n.destroy = void 0, r !== void 0 && r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Qs(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function ic(e, t, n) {
  switch (n.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      Qs(3, n);
      return;
    case 1:
      if (e = n.stateNode, n.effectTag & 4) if (t === null) e.componentDidMount();
      else {
        var r = n.elementType === n.type ? t.memoizedProps : pe(n.type, t.memoizedProps);
        e.componentDidUpdate(r, t.memoizedState, e.__reactInternalSnapshotBeforeUpdate);
      }
      t = n.updateQueue, t !== null && Ou(n, t, e);
      return;
    case 3:
      if (t = n.updateQueue, t !== null) {
        if (e = null, n.child !== null) switch (n.child.tag) {
          case 5:
            e = n.child.stateNode;
            break;
          case 1:
            e = n.child.stateNode;
        }
        Ou(n, t, e);
      }
      return;
    case 5:
      e = n.stateNode, t === null && n.effectTag & 4 && rs(n.type, n.memoizedProps) && e.focus();
      return;
    case 6:
      return;
    case 4:
      return;
    case 12:
      return;
    case 13:
      n.memoizedState === null && (n = n.alternate, n !== null && (n = n.memoizedState, n !== null && (n = n.dehydrated, n !== null && Go(n))));
      return;
    case 19:
    case 17:
    case 20:
    case 21:
      return;
  }
  throw Error(m(163));
}
function Ku(e, t, n) {
  switch (typeof Bl == "function" && Bl(t), t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      if (e = t.updateQueue, e !== null && (e = e.lastEffect, e !== null)) {
        var r = e.next;
        Ge(97 < n ? 97 : n, function() {
          var l = r;
          do {
            var i = l.destroy;
            if (i !== void 0) {
              var u = t;
              try {
                i();
              } catch (o) {
                ct(u, o);
              }
            }
            l = l.next;
          } while (l !== r);
        });
      }
      break;
    case 1:
      Hu(t), n = t.stateNode, typeof n.componentWillUnmount == "function" && rc(t, n);
      break;
    case 5:
      Hu(t);
      break;
    case 4:
      Ks(e, t, n);
  }
}
function Hs(e) {
  var t = e.alternate;
  e.return = null, e.child = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.alternate = null, e.firstEffect = null, e.lastEffect = null, e.pendingProps = null, e.memoizedProps = null, e.stateNode = null, t !== null && Hs(t);
}
function Bu(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Yu(e) {
  e: {
    for (var t = e.return; t !== null; ) {
      if (Bu(t)) {
        var n = t;
        break e;
      }
      t = t.return;
    }
    throw Error(m(160));
  }
  switch (t = n.stateNode, n.tag) {
    case 5:
      var r = !1;
      break;
    case 3:
      t = t.containerInfo, r = !0;
      break;
    case 4:
      t = t.containerInfo, r = !0;
      break;
    default:
      throw Error(m(161));
  }
  n.effectTag & 16 && (on(t, ""), n.effectTag &= -17);
  e: t: for (n = e; ; ) {
    for (; n.sibling === null; ) {
      if (n.return === null || Bu(n.return)) {
        n = null;
        break e;
      }
      n = n.return;
    }
    for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
      if (n.effectTag & 2 || n.child === null || n.tag === 4) continue t;
      n.child.return = n, n = n.child;
    }
    if (!(n.effectTag & 2)) {
      n = n.stateNode;
      break e;
    }
  }
  r ? $l(e, n, t) : Al(e, n, t);
}
function $l(e, t, n) {
  var r = e.tag, l = r === 5 || r === 6;
  if (l) e = l ? e.stateNode : e.stateNode.instance, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = lr));
  else if (r !== 4 && (e = e.child, e !== null)) for ($l(e, t, n), e = e.sibling; e !== null; ) $l(e, t, n), e = e.sibling;
}
function Al(e, t, n) {
  var r = e.tag, l = r === 5 || r === 6;
  if (l) e = l ? e.stateNode : e.stateNode.instance, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (Al(e, t, n), e = e.sibling; e !== null; ) Al(e, t, n), e = e.sibling;
}
function Ks(e, t, n) {
  for (var r = t, l = !1, i, u; ; ) {
    if (!l) {
      l = r.return;
      e: for (; ; ) {
        if (l === null) throw Error(m(160));
        switch (i = l.stateNode, l.tag) {
          case 5:
            u = !1;
            break e;
          case 3:
            i = i.containerInfo, u = !0;
            break e;
          case 4:
            i = i.containerInfo, u = !0;
            break e;
        }
        l = l.return;
      }
      l = !0;
    }
    if (r.tag === 5 || r.tag === 6) {
      e: for (var o = e, f = r, c = n, y = f; ; ) if (Ku(o, y, c), y.child !== null && y.tag !== 4) y.child.return = y, y = y.child;
      else {
        if (y === f) break e;
        for (; y.sibling === null; ) {
          if (y.return === null || y.return === f) break e;
          y = y.return;
        }
        y.sibling.return = y.return, y = y.sibling;
      }
      u ? (o = i, f = r.stateNode, o.nodeType === 8 ? o.parentNode.removeChild(f) : o.removeChild(f)) : i.removeChild(r.stateNode);
    } else if (r.tag === 4) {
      if (r.child !== null) {
        i = r.stateNode.containerInfo, u = !0, r.child.return = r, r = r.child;
        continue;
      }
    } else if (Ku(e, r, n), r.child !== null) {
      r.child.return = r, r = r.child;
      continue;
    }
    if (r === t) break;
    for (; r.sibling === null; ) {
      if (r.return === null || r.return === t) return;
      r = r.return, r.tag === 4 && (l = !1);
    }
    r.sibling.return = r.return, r = r.sibling;
  }
}
function qr(e, t) {
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      Ws(3, t);
      return;
    case 1:
      return;
    case 5:
      var n = t.stateNode;
      if (n != null) {
        var r = t.memoizedProps, l = e !== null ? e.memoizedProps : r;
        e = t.type;
        var i = t.updateQueue;
        if (t.updateQueue = null, i !== null) {
          for (n[ir] = r, e === "input" && r.type === "radio" && r.name != null && Mo(n, r), El(e, l), t = El(e, r), l = 0; l < i.length; l += 2) {
            var u = i[l], o = i[l + 1];
            u === "style" ? bo(n, o) : u === "dangerouslySetInnerHTML" ? jo(n, o) : u === "children" ? on(n, o) : ui(n, u, o, t);
          }
          switch (e) {
            case "input":
              fl(n, r);
              break;
            case "textarea":
              Ro(n, r);
              break;
            case "select":
              t = n._wrapperState.wasMultiple, n._wrapperState.wasMultiple = !!r.multiple, e = r.value, e != null ? Pt(n, !!r.multiple, e, !1) : t !== !!r.multiple && (r.defaultValue != null ? Pt(n, !!r.multiple, r.defaultValue, !0) : Pt(n, !!r.multiple, r.multiple ? [] : "", !1));
          }
        }
      }
      return;
    case 6:
      if (t.stateNode === null) throw Error(m(162));
      t.stateNode.nodeValue = t.memoizedProps;
      return;
    case 3:
      t = t.stateNode, t.hydrate && (t.hydrate = !1, Go(t.containerInfo));
      return;
    case 12:
      return;
    case 13:
      if (n = t, t.memoizedState === null ? r = !1 : (r = !0, n = t.child, Ai = ae()), n !== null) e: for (e = n; ; ) {
        if (e.tag === 5) i = e.stateNode, r ? (i = i.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (i = e.stateNode, l = e.memoizedProps.style, l = l != null && l.hasOwnProperty("display") ? l.display : null, i.style.display = qo("display", l));
        else if (e.tag === 6) e.stateNode.nodeValue = r ? "" : e.memoizedProps;
        else if (e.tag === 13 && e.memoizedState !== null && e.memoizedState.dehydrated === null) {
          i = e.child.sibling, i.return = e, e = i;
          continue;
        } else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === n) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === n) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      Xu(t);
      return;
    case 19:
      Xu(t);
      return;
    case 17:
      return;
  }
  throw Error(m(163));
}
function Xu(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new nc()), t.forEach(function(r) {
      var l = hc.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(l, l));
    });
  }
}
var uc = typeof WeakMap == "function" ? WeakMap : Map;
function Bs(e, t, n) {
  n = Qe(n, null), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    kr || (kr = !0, Vl = r), Ul(e, t);
  }, n;
}
function Ys(e, t, n) {
  n = Qe(n, null), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    n.payload = function() {
      return Ul(e, t), r(l);
    };
  }
  var i = e.stateNode;
  return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
    typeof r != "function" && (Ke === null ? Ke = /* @__PURE__ */ new Set([this]) : Ke.add(this), Ul(e, t));
    var u = t.stack;
    this.componentDidCatch(t.value, { componentStack: u !== null ? u : "" });
  }), n;
}
var oc = Math.ceil, yr = me.ReactCurrentDispatcher, Xs = me.ReactCurrentOwner, V = 0, Ui = 8, he = 16, ke = 32, at = 0, gr = 1, Gs = 2, wr = 3, Ir = 4, $i = 5, x = V, ue = null, C = null, ee = 0, A = at, Fr = null, Ne = 1073741823, hn = 1073741823, Er = null, vn = 0, Tr = !1, Ai = 0, Zs = 500, E = null, kr = !1, Vl = null, Ke = null, xr = !1, ln = null, Jt = 90, lt = null, un = 0, Wl = null, Gn = 0;
function Te() {
  return (x & (he | ke)) !== V ? 1073741821 - (ae() / 10 | 0) : Gn !== 0 ? Gn : Gn = 1073741821 - (ae() / 10 | 0);
}
function ft(e, t, n) {
  if (t = t.mode, !(t & 2)) return 1073741823;
  var r = Mr();
  if (!(t & 4)) return r === 99 ? 1073741823 : 1073741822;
  if ((x & he) !== V) return ee;
  if (n !== null) e = Yn(e, n.timeoutMs | 0 || 5e3, 250);
  else switch (r) {
    case 99:
      e = 1073741823;
      break;
    case 98:
      e = Yn(e, 150, 100);
      break;
    case 97:
    case 96:
      e = Yn(e, 5e3, 250);
      break;
    case 95:
      e = 2;
      break;
    default:
      throw Error(m(326));
  }
  return ue !== null && e === ee && --e, e;
}
function Be(e, t) {
  if (50 < un) throw un = 0, Wl = null, Error(m(185));
  if (e = jr(e, t), e !== null) {
    var n = Mr();
    t === 1073741823 ? (x & Ui) !== V && (x & (he | ke)) === V ? Ql(e) : (oe(e), x === V && xe()) : oe(e), (x & 4) === V || n !== 98 && n !== 99 || (lt === null ? lt = /* @__PURE__ */ new Map([[e, t]]) : (n = lt.get(e), (n === void 0 || n > t) && lt.set(e, t)));
  }
}
function jr(e, t) {
  e.expirationTime < t && (e.expirationTime = t);
  var n = e.alternate;
  n !== null && n.expirationTime < t && (n.expirationTime = t);
  var r = e.return, l = null;
  if (r === null && e.tag === 3) l = e.stateNode;
  else for (; r !== null; ) {
    if (n = r.alternate, r.childExpirationTime < t && (r.childExpirationTime = t), n !== null && n.childExpirationTime < t && (n.childExpirationTime = t), r.return === null && r.tag === 3) {
      l = r.stateNode;
      break;
    }
    r = r.return;
  }
  return l !== null && (ue === l && (Lr(t), A === Ir && ut(l, ee)), oa(l, t)), l;
}
function Zn(e) {
  var t = e.lastExpiredTime;
  if (t !== 0 || (t = e.firstPendingTime, !ua(e, t))) return t;
  var n = e.lastPingedTime;
  return e = e.nextKnownPendingLevel, e = n > e ? n : e, 2 >= e && t !== e ? 0 : e;
}
function oe(e) {
  if (e.lastExpiredTime !== 0) e.callbackExpirationTime = 1073741823, e.callbackPriority = 99, e.callbackNode = Pu(Ql.bind(null, e));
  else {
    var t = Zn(e), n = e.callbackNode;
    if (t === 0) n !== null && (e.callbackNode = null, e.callbackExpirationTime = 0, e.callbackPriority = 90);
    else {
      var r = Te();
      if (t === 1073741823 ? r = 99 : t === 1 || t === 2 ? r = 95 : (r = 10 * (1073741821 - t) - 10 * (1073741821 - r), r = 0 >= r ? 99 : 250 >= r ? 98 : 5250 >= r ? 97 : 95), n !== null) {
        var l = e.callbackPriority;
        if (e.callbackExpirationTime === t && l >= r) return;
        n !== ks && ys(n);
      }
      e.callbackExpirationTime = t, e.callbackPriority = r, t = t === 1073741823 ? Pu(Ql.bind(null, e)) : Ss(r, Js.bind(null, e), { timeout: 10 * (1073741821 - t) - ae() }), e.callbackNode = t;
    }
  }
}
function Js(e, t) {
  if (Gn = 0, t) return t = Te(), Yl(e, t), oe(e), null;
  var n = Zn(e);
  if (n !== 0) {
    if (t = e.callbackNode, (x & (he | ke)) !== V) throw Error(m(327));
    if ($t(), e === ue && n === ee || it(e, n), C !== null) {
      var r = x;
      x |= he;
      var l = ta();
      do
        try {
          fc();
          break;
        } catch (o) {
          ea(e, o);
        }
      while (!0);
      if (Ci(), x = r, yr.current = l, A === gr) throw t = Fr, it(e, n), ut(e, n), oe(e), t;
      if (C === null) switch (l = e.finishedWork = e.current.alternate, e.finishedExpirationTime = n, r = A, ue = null, r) {
        case at:
        case gr:
          throw Error(m(345));
        case Gs:
          Yl(e, 2 < n ? 2 : n);
          break;
        case wr:
          if (ut(e, n), r = e.lastSuspendedTime, n === r && (e.nextKnownPendingLevel = Hl(l)), Ne === 1073741823 && (l = Ai + Zs - ae(), 10 < l)) {
            if (Tr) {
              var i = e.lastPingedTime;
              if (i === 0 || i >= n) {
                e.lastPingedTime = n, it(e, n);
                break;
              }
            }
            if (i = Zn(e), i !== 0 && i !== n) break;
            if (r !== 0 && r !== n) {
              e.lastPingedTime = r;
              break;
            }
            e.timeoutHandle = Br(et.bind(null, e), l);
            break;
          }
          et(e);
          break;
        case Ir:
          if (ut(e, n), r = e.lastSuspendedTime, n === r && (e.nextKnownPendingLevel = Hl(l)), Tr && (l = e.lastPingedTime, l === 0 || l >= n)) {
            e.lastPingedTime = n, it(e, n);
            break;
          }
          if (l = Zn(e), l !== 0 && l !== n) break;
          if (r !== 0 && r !== n) {
            e.lastPingedTime = r;
            break;
          }
          if (hn !== 1073741823 ? r = 10 * (1073741821 - hn) - ae() : Ne === 1073741823 ? r = 0 : (r = 10 * (1073741821 - Ne) - 5e3, l = ae(), n = 10 * (1073741821 - n) - l, r = l - r, 0 > r && (r = 0), r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * oc(r / 1960)) - r, n < r && (r = n)), 10 < r) {
            e.timeoutHandle = Br(et.bind(null, e), r);
            break;
          }
          et(e);
          break;
        case $i:
          if (Ne !== 1073741823 && Er !== null) {
            i = Ne;
            var u = Er;
            if (r = u.busyMinDurationMs | 0, 0 >= r ? r = 0 : (l = u.busyDelayMs | 0, i = ae() - (10 * (1073741821 - i) - (u.timeoutMs | 0 || 5e3)), r = i <= l ? 0 : l + r - i), 10 < r) {
              ut(e, n), e.timeoutHandle = Br(et.bind(null, e), r);
              break;
            }
          }
          et(e);
          break;
        default:
          throw Error(m(329));
      }
      if (oe(e), e.callbackNode === t) return Js.bind(null, e);
    }
  }
  return null;
}
function Ql(e) {
  var t = e.lastExpiredTime;
  if (t = t !== 0 ? t : 1073741823, (x & (he | ke)) !== V) throw Error(m(327));
  if ($t(), e === ue && t === ee || it(e, t), C !== null) {
    var n = x;
    x |= he;
    var r = ta();
    do
      try {
        ac();
        break;
      } catch (l) {
        ea(e, l);
      }
    while (!0);
    if (Ci(), x = n, yr.current = r, A === gr) throw n = Fr, it(e, t), ut(e, t), oe(e), n;
    if (C !== null) throw Error(m(261));
    e.finishedWork = e.current.alternate, e.finishedExpirationTime = t, ue = null, et(e), oe(e);
  }
  return null;
}
function sc() {
  if (lt !== null) {
    var e = lt;
    lt = null, e.forEach(function(t, n) {
      Yl(n, t), oe(n);
    }), xe();
  }
}
function qs(e, t) {
  var n = x;
  x |= 1;
  try {
    return e(t);
  } finally {
    x = n, x === V && xe();
  }
}
function bs(e, t) {
  var n = x;
  x &= -2, x |= Ui;
  try {
    return e(t);
  } finally {
    x = n, x === V && xe();
  }
}
function it(e, t) {
  e.finishedWork = null, e.finishedExpirationTime = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, of(n)), C !== null) for (n = C.return; n !== null; ) {
    var r = n;
    switch (r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && or();
        break;
      case 3:
        Lt(), R(q), R(Y);
        break;
      case 5:
        zi(r);
        break;
      case 4:
        Lt();
        break;
      case 13:
        R(F);
        break;
      case 19:
        R(F);
        break;
      case 10:
        _i(r);
    }
    n = n.return;
  }
  ue = e, C = ht(e.current, null), ee = t, A = at, Fr = null, hn = Ne = 1073741823, Er = null, vn = 0, Tr = !1;
}
function ea(e, t) {
  do {
    try {
      if (Ci(), Xn.current = vr, pr) for (var n = $.memoizedState; n !== null; ) {
        var r = n.queue;
        r !== null && (r.pending = null), n = n.next;
      }
      if (De = 0, B = K = $ = null, pr = !1, C === null || C.return === null) return A = gr, Fr = t, C = null;
      e: {
        var l = e, i = C.return, u = C, o = t;
        if (t = ee, u.effectTag |= 2048, u.firstEffect = u.lastEffect = null, o !== null && typeof o == "object" && typeof o.then == "function") {
          var f = o;
          if (!(u.mode & 2)) {
            var c = u.alternate;
            c ? (u.updateQueue = c.updateQueue, u.memoizedState = c.memoizedState, u.expirationTime = c.expirationTime) : (u.updateQueue = null, u.memoizedState = null);
          }
          var y = (F.current & 1) !== 0, g = i;
          do {
            var _;
            if (_ = g.tag === 13) {
              var z = g.memoizedState;
              if (z !== null) _ = z.dehydrated !== null;
              else {
                var J = g.memoizedProps;
                _ = J.fallback === void 0 ? !1 : J.unstable_avoidThisFallback !== !0 ? !0 : !y;
              }
            }
            if (_) {
              var D = g.updateQueue;
              if (D === null) {
                var a = /* @__PURE__ */ new Set();
                a.add(f), g.updateQueue = a;
              } else D.add(f);
              if (!(g.mode & 2)) {
                if (g.effectTag |= 64, u.effectTag &= -2981, u.tag === 1) if (u.alternate === null) u.tag = 17;
                else {
                  var s = Qe(1073741823, null);
                  s.tag = 2, He(u, s);
                }
                u.expirationTime = 1073741823;
                break e;
              }
              o = void 0, u = t;
              var d = l.pingCache;
              if (d === null ? (d = l.pingCache = new uc(), o = /* @__PURE__ */ new Set(), d.set(f, o)) : (o = d.get(f), o === void 0 && (o = /* @__PURE__ */ new Set(), d.set(f, o))), !o.has(u)) {
                o.add(u);
                var p = mc.bind(null, l, f, u);
                f.then(p, p);
              }
              g.effectTag |= 4096, g.expirationTime = t;
              break e;
            }
            g = g.return;
          } while (g !== null);
          o = Error((Me(u.type) || "A React component") + ` suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.` + ai(u));
        }
        A !== $i && (A = Gs), o = Di(o, u), g = i;
        do {
          switch (g.tag) {
            case 3:
              f = o, g.effectTag |= 4096, g.expirationTime = t;
              var h = Bs(g, f, t);
              Nu(g, h);
              break e;
            case 1:
              f = o;
              var w = g.type, T = g.stateNode;
              if (!(g.effectTag & 64) && (typeof w.getDerivedStateFromError == "function" || T !== null && typeof T.componentDidCatch == "function" && (Ke === null || !Ke.has(T)))) {
                g.effectTag |= 4096, g.expirationTime = t;
                var P = Ys(g, f, t);
                Nu(g, P);
                break e;
              }
          }
          g = g.return;
        } while (g !== null);
      }
      C = la(C);
    } catch (N) {
      t = N;
      continue;
    }
    break;
  } while (!0);
}
function ta() {
  var e = yr.current;
  return yr.current = vr, e === null ? vr : e;
}
function na(e, t) {
  e < Ne && 2 < e && (Ne = e), t !== null && e < hn && 2 < e && (hn = e, Er = t);
}
function Lr(e) {
  e > vn && (vn = e);
}
function ac() {
  for (; C !== null; ) C = ra(C);
}
function fc() {
  for (; C !== null && !Xf(); ) C = ra(C);
}
function ra(e) {
  var t = ia(e.alternate, e, ee);
  return e.memoizedProps = e.pendingProps, t === null && (t = la(e)), Xs.current = null, t;
}
function la(e) {
  C = e;
  do {
    var t = C.alternate;
    if (e = C.return, C.effectTag & 2048) {
      if (t = tc(C), t !== null) return t.effectTag &= 2047, t;
      e !== null && (e.firstEffect = e.lastEffect = null, e.effectTag |= 2048);
    } else {
      if (t = ec(t, C, ee), ee === 1 || C.childExpirationTime !== 1) {
        for (var n = 0, r = C.child; r !== null; ) {
          var l = r.expirationTime, i = r.childExpirationTime;
          l > n && (n = l), i > n && (n = i), r = r.sibling;
        }
        C.childExpirationTime = n;
      }
      if (t !== null) return t;
      e !== null && !(e.effectTag & 2048) && (e.firstEffect === null && (e.firstEffect = C.firstEffect), C.lastEffect !== null && (e.lastEffect !== null && (e.lastEffect.nextEffect = C.firstEffect), e.lastEffect = C.lastEffect), 1 < C.effectTag && (e.lastEffect !== null ? e.lastEffect.nextEffect = C : e.firstEffect = C, e.lastEffect = C));
    }
    if (t = C.sibling, t !== null) return t;
    C = e;
  } while (C !== null);
  return A === at && (A = $i), null;
}
function Hl(e) {
  var t = e.expirationTime;
  return e = e.childExpirationTime, t > e ? t : e;
}
function et(e) {
  var t = Mr();
  return Ge(99, cc.bind(null, e, t)), null;
}
function cc(e, t) {
  do
    $t();
  while (ln !== null);
  if ((x & (he | ke)) !== V) throw Error(m(327));
  var n = e.finishedWork, r = e.finishedExpirationTime;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedExpirationTime = 0, n === e.current) throw Error(m(177));
  e.callbackNode = null, e.callbackExpirationTime = 0, e.callbackPriority = 90, e.nextKnownPendingLevel = 0;
  var l = Hl(n);
  if (e.firstPendingTime = l, r <= e.lastSuspendedTime ? e.firstSuspendedTime = e.lastSuspendedTime = e.nextKnownPendingLevel = 0 : r <= e.firstSuspendedTime && (e.firstSuspendedTime = r - 1), r <= e.lastPingedTime && (e.lastPingedTime = 0), r <= e.lastExpiredTime && (e.lastExpiredTime = 0), e === ue && (C = ue = null, ee = 0), 1 < n.effectTag ? n.lastEffect !== null ? (n.lastEffect.nextEffect = n, l = n.firstEffect) : l = n : l = n.firstEffect, l !== null) {
    var i = x;
    x |= ke, Xs.current = null, Hr = Vn;
    var u = du();
    if (kl(u)) {
      if ("selectionStart" in u) var o = { start: u.selectionStart, end: u.selectionEnd };
      else e: {
        o = (o = u.ownerDocument) && o.defaultView || window;
        var f = o.getSelection && o.getSelection();
        if (f && f.rangeCount !== 0) {
          o = f.anchorNode;
          var c = f.anchorOffset, y = f.focusNode;
          f = f.focusOffset;
          try {
            o.nodeType, y.nodeType;
          } catch (S) {
            o = null;
            break e;
          }
          var g = 0, _ = -1, z = -1, J = 0, D = 0, a = u, s = null;
          t: for (; ; ) {
            for (var d; a !== o || c !== 0 && a.nodeType !== 3 || (_ = g + c), a !== y || f !== 0 && a.nodeType !== 3 || (z = g + f), a.nodeType === 3 && (g += a.nodeValue.length), (d = a.firstChild) !== null; )
              s = a, a = d;
            for (; ; ) {
              if (a === u) break t;
              if (s === o && ++J === c && (_ = g), s === y && ++D === f && (z = g), (d = a.nextSibling) !== null) break;
              a = s, s = a.parentNode;
            }
            a = d;
          }
          o = _ === -1 || z === -1 ? null : { start: _, end: z };
        } else o = null;
      }
      o = o || { start: 0, end: 0 };
    } else o = null;
    Kr = { activeElementDetached: null, focusedElem: u, selectionRange: o }, Vn = !1, E = l;
    do
      try {
        dc();
      } catch (S) {
        if (E === null) throw Error(m(330));
        ct(E, S), E = E.nextEffect;
      }
    while (E !== null);
    E = l;
    do
      try {
        for (u = e, o = t; E !== null; ) {
          var p = E.effectTag;
          if (p & 16 && on(E.stateNode, ""), p & 128) {
            var h = E.alternate;
            if (h !== null) {
              var w = h.ref;
              w !== null && (typeof w == "function" ? w(null) : w.current = null);
            }
          }
          switch (p & 1038) {
            case 2:
              Yu(E), E.effectTag &= -3;
              break;
            case 6:
              Yu(E), E.effectTag &= -3, qr(E.alternate, E);
              break;
            case 1024:
              E.effectTag &= -1025;
              break;
            case 1028:
              E.effectTag &= -1025, qr(E.alternate, E);
              break;
            case 4:
              qr(E.alternate, E);
              break;
            case 8:
              c = E, Ks(u, c, o), Hs(c);
          }
          E = E.nextEffect;
        }
      } catch (S) {
        if (E === null) throw Error(m(330));
        ct(E, S), E = E.nextEffect;
      }
    while (E !== null);
    if (w = Kr, h = du(), p = w.focusedElem, o = w.selectionRange, h !== p && p && p.ownerDocument && es(p.ownerDocument.documentElement, p)) {
      for (o !== null && kl(p) && (h = o.start, w = o.end, w === void 0 && (w = h), "selectionStart" in p ? (p.selectionStart = h, p.selectionEnd = Math.min(w, p.value.length)) : (w = (h = p.ownerDocument || document) && h.defaultView || window, w.getSelection && (w = w.getSelection(), c = p.textContent.length, u = Math.min(o.start, c), o = o.end === void 0 ? u : Math.min(o.end, c), !w.extend && u > o && (c = o, o = u, u = c), c = cu(p, u), y = cu(p, o), c && y && (w.rangeCount !== 1 || w.anchorNode !== c.node || w.anchorOffset !== c.offset || w.focusNode !== y.node || w.focusOffset !== y.offset) && (h = h.createRange(), h.setStart(c.node, c.offset), w.removeAllRanges(), u > o ? (w.addRange(h), w.extend(y.node, y.offset)) : (h.setEnd(y.node, y.offset), w.addRange(h)))))), h = [], w = p; w = w.parentNode; ) w.nodeType === 1 && h.push({
        element: w,
        left: w.scrollLeft,
        top: w.scrollTop
      });
      for (typeof p.focus == "function" && p.focus(), p = 0; p < h.length; p++) w = h[p], w.element.scrollLeft = w.left, w.element.scrollTop = w.top;
    }
    Vn = !!Hr, Kr = Hr = null, e.current = n, E = l;
    do
      try {
        for (p = e; E !== null; ) {
          var T = E.effectTag;
          if (T & 36 && ic(p, E.alternate, E), T & 128) {
            h = void 0;
            var P = E.ref;
            if (P !== null) {
              var N = E.stateNode;
              switch (E.tag) {
                case 5:
                  h = N;
                  break;
                default:
                  h = N;
              }
              typeof P == "function" ? P(h) : P.current = h;
            }
          }
          E = E.nextEffect;
        }
      } catch (S) {
        if (E === null) throw Error(m(330));
        ct(E, S), E = E.nextEffect;
      }
    while (E !== null);
    E = null, Gf(), x = i;
  } else e.current = n;
  if (xr) xr = !1, ln = e, Jt = t;
  else for (E = l; E !== null; ) t = E.nextEffect, E.nextEffect = null, E = t;
  if (t = e.firstPendingTime, t === 0 && (Ke = null), t === 1073741823 ? e === Wl ? un++ : (un = 0, Wl = e) : un = 0, typeof Kl == "function" && Kl(n.stateNode, r), oe(e), kr) throw kr = !1, e = Vl, Vl = null, e;
  return (x & Ui) !== V || xe(), null;
}
function dc() {
  for (; E !== null; ) {
    var e = E.effectTag;
    e & 256 && lc(E.alternate, E), !(e & 512) || xr || (xr = !0, Ss(97, function() {
      return $t(), null;
    })), E = E.nextEffect;
  }
}
function $t() {
  if (Jt !== 90) {
    var e = 97 < Jt ? 97 : Jt;
    return Jt = 90, Ge(e, pc);
  }
}
function pc() {
  if (ln === null) return !1;
  var e = ln;
  if (ln = null, (x & (he | ke)) !== V) throw Error(m(331));
  var t = x;
  for (x |= ke, e = e.current.firstEffect; e !== null; ) {
    try {
      var n = e;
      if (n.effectTag & 512) switch (n.tag) {
        case 0:
        case 11:
        case 15:
        case 22:
          Ws(5, n), Qs(5, n);
      }
    } catch (r) {
      if (e === null) throw Error(m(330));
      ct(e, r);
    }
    n = e.nextEffect, e.nextEffect = null, e = n;
  }
  return x = t, xe(), !0;
}
function Gu(e, t, n) {
  t = Di(n, t), t = Bs(e, t, 1073741823), He(e, t), e = jr(e, 1073741823), e !== null && oe(e);
}
function ct(e, t) {
  if (e.tag === 3) Gu(e, e, t);
  else for (var n = e.return; n !== null; ) {
    if (n.tag === 3) {
      Gu(n, e, t);
      break;
    } else if (n.tag === 1) {
      var r = n.stateNode;
      if (typeof n.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Ke === null || !Ke.has(r))) {
        e = Di(t, e), e = Ys(n, e, 1073741823), He(n, e), n = jr(n, 1073741823), n !== null && oe(n);
        break;
      }
    }
    n = n.return;
  }
}
function mc(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), ue === e && ee === n ? A === Ir || A === wr && Ne === 1073741823 && ae() - Ai < Zs ? it(e, ee) : Tr = !0 : ua(e, n) && (t = e.lastPingedTime, t !== 0 && t < n || (e.lastPingedTime = n, oe(e)));
}
function hc(e, t) {
  var n = e.stateNode;
  n !== null && n.delete(t), t = 0, t === 0 && (t = Te(), t = ft(t, e, null)), e = jr(e, t), e !== null && oe(e);
}
var ia;
ia = function(e, t, n) {
  var r = t.expirationTime;
  if (e !== null) {
    var l = t.pendingProps;
    if (e.memoizedProps !== l || q.current) ge = !0;
    else {
      if (r < n) {
        switch (ge = !1, t.tag) {
          case 3:
            Au(t), Gr();
            break;
          case 5:
            if (Ru(t), t.mode & 4 && n !== 1 && l.hidden) return t.expirationTime = t.childExpirationTime = 1, null;
            break;
          case 1:
            b(t.type) && Kn(t);
            break;
          case 4:
            Ml(t, t.stateNode.containerInfo);
            break;
          case 10:
            r = t.memoizedProps.value, l = t.type._context, L(sr, l._currentValue), l._currentValue = r;
            break;
          case 13:
            if (t.memoizedState !== null)
              return r = t.child.childExpirationTime, r !== 0 && r >= n ? Vu(e, t, n) : (L(F, F.current & 1), t = ze(e, t, n), t !== null ? t.sibling : null);
            L(F, F.current & 1);
            break;
          case 19:
            if (r = t.childExpirationTime >= n, e.effectTag & 64) {
              if (r) return Qu(e, t, n);
              t.effectTag |= 64;
            }
            if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null), L(F, F.current), !r) return null;
        }
        return ze(e, t, n);
      }
      ge = !1;
    }
  } else ge = !1;
  switch (t.expirationTime = 0, t.tag) {
    case 2:
      if (r = t.type, e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= 2), e = t.pendingProps, l = Ft(t, Y.current), Ot(t, n), l = Ii(
        null,
        t,
        r,
        e,
        l,
        n
      ), t.effectTag |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0) {
        if (t.tag = 1, t.memoizedState = null, t.updateQueue = null, b(r)) {
          var i = !0;
          Kn(t);
        } else i = !1;
        t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Pi(t);
        var u = r.getDerivedStateFromProps;
        typeof u == "function" && cr(t, r, u, e), l.updater = Rr, t.stateNode = l, l._reactInternalFiber = t, zl(t, r, e, n), t = Ll(null, t, r, !0, i, n);
      } else t.tag = 0, ie(null, t, l, n), t = t.child;
      return t;
    case 16:
      e: {
        if (l = t.elementType, e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= 2), e = t.pendingProps, Qa(l), l._status !== 1) throw l._result;
        switch (l = l._result, t.type = l, i = t.tag = gc(l), e = pe(l, e), i) {
          case 0:
            t = jl(null, t, l, e, n);
            break e;
          case 1:
            t = $u(null, t, l, e, n);
            break e;
          case 11:
            t = Du(null, t, l, e, n);
            break e;
          case 14:
            t = Uu(null, t, l, pe(l.type, e), r, n);
            break e;
        }
        throw Error(m(306, l, ""));
      }
      return t;
    case 0:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pe(r, l), jl(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pe(r, l), $u(e, t, r, l, n);
    case 3:
      if (Au(t), r = t.updateQueue, e === null || r === null) throw Error(m(282));
      if (r = t.pendingProps, l = t.memoizedState, l = l !== null ? l.element : null, Ni(e, t), dn(t, r, null, n), r = t.memoizedState.element, r === l) Gr(), t = ze(e, t, n);
      else {
        if ((l = t.stateNode.hydrate) && (Ue = Nt(t.stateNode.containerInfo.firstChild), Oe = t, l = st = !0), l) for (n = Oi(t, null, r, n), t.child = n; n; ) n.effectTag = n.effectTag & -3 | 1024, n = n.sibling;
        else ie(e, t, r, n), Gr();
        t = t.child;
      }
      return t;
    case 5:
      return Ru(t), e === null && Fl(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, u = l.children, xl(r, l) ? u = null : i !== null && xl(r, i) && (t.effectTag |= 16), Us(e, t), t.mode & 4 && n !== 1 && l.hidden ? (t.expirationTime = t.childExpirationTime = 1, t = null) : (ie(e, t, u, n), t = t.child), t;
    case 6:
      return e === null && Fl(t), null;
    case 13:
      return Vu(e, t, n);
    case 4:
      return Ml(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = jt(t, null, r, n) : ie(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pe(r, l), Du(e, t, r, l, n);
    case 7:
      return ie(e, t, t.pendingProps, n), t.child;
    case 8:
      return ie(
        e,
        t,
        t.pendingProps.children,
        n
      ), t.child;
    case 12:
      return ie(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        r = t.type._context, l = t.pendingProps, u = t.memoizedProps, i = l.value;
        var o = t.type._context;
        if (L(sr, o._currentValue), o._currentValue = i, u !== null) if (o = u.value, i = pt(o, i) ? 0 : (typeof r._calculateChangedBits == "function" ? r._calculateChangedBits(o, i) : 1073741823) | 0, i === 0) {
          if (u.children === l.children && !q.current) {
            t = ze(e, t, n);
            break e;
          }
        } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
          var f = o.dependencies;
          if (f !== null) {
            u = o.child;
            for (var c = f.firstContext; c !== null; ) {
              if (c.context === r && c.observedBits & i) {
                o.tag === 1 && (c = Qe(n, null), c.tag = 2, He(o, c)), o.expirationTime < n && (o.expirationTime = n), c = o.alternate, c !== null && c.expirationTime < n && (c.expirationTime = n), _s(o.return, n), f.expirationTime < n && (f.expirationTime = n);
                break;
              }
              c = c.next;
            }
          } else u = o.tag === 10 && o.type === t.type ? null : o.child;
          if (u !== null) u.return = o;
          else for (u = o; u !== null; ) {
            if (u === t) {
              u = null;
              break;
            }
            if (o = u.sibling, o !== null) {
              o.return = u.return, u = o;
              break;
            }
            u = u.return;
          }
          o = u;
        }
        ie(e, t, l.children, n), t = t.child;
      }
      return t;
    case 9:
      return l = t.type, i = t.pendingProps, r = i.children, Ot(t, n), l = ce(l, i.unstable_observedBits), r = r(l), t.effectTag |= 1, ie(e, t, r, n), t.child;
    case 14:
      return l = t.type, i = pe(l, t.pendingProps), i = pe(l.type, i), Uu(e, t, l, i, r, n);
    case 15:
      return Ds(e, t, t.type, t.pendingProps, r, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pe(r, l), e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= 2), t.tag = 1, b(r) ? (e = !0, Kn(t)) : e = !1, Ot(t, n), Ns(t, r, l), zl(t, r, l, n), Ll(
        null,
        t,
        r,
        !0,
        e,
        n
      );
    case 19:
      return Qu(e, t, n);
  }
  throw Error(m(156, t.tag));
};
var Kl = null, Bl = null;
function vc(e) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined") return !1;
  var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (t.isDisabled || !t.supportsFiber) return !0;
  try {
    var n = t.inject(e);
    Kl = function(r) {
      try {
        t.onCommitFiberRoot(n, r, void 0, (r.current.effectTag & 64) === 64);
      } catch (l) {
      }
    }, Bl = function(r) {
      try {
        t.onCommitFiberUnmount(n, r);
      } catch (l) {
      }
    };
  } catch (r) {
  }
  return !0;
}
function yc(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.effectTag = 0, this.lastEffect = this.firstEffect = this.nextEffect = null, this.childExpirationTime = this.expirationTime = 0, this.alternate = null;
}
function we(e, t, n, r) {
  return new yc(e, t, n, r);
}
function Vi(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function gc(e) {
  if (typeof e == "function") return Vi(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === oi) return 11;
    if (e === si) return 14;
  }
  return 2;
}
function ht(e, t) {
  var n = e.alternate;
  return n === null ? (n = we(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.effectTag = 0, n.nextEffect = null, n.firstEffect = null, n.lastEffect = null), n.childExpirationTime = e.childExpirationTime, n.expirationTime = e.expirationTime, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
    expirationTime: t.expirationTime,
    firstContext: t.firstContext,
    responders: t.responders
  }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Jn(e, t, n, r, l, i) {
  var u = 2;
  if (r = e, typeof e == "function") Vi(e) && (u = 1);
  else if (typeof e == "string") u = 5;
  else e: switch (e) {
    case tt:
      return $e(n.children, l, i, t);
    case Wa:
      u = 8, l |= 7;
      break;
    case So:
      u = 8, l |= 1;
      break;
    case Un:
      return e = we(12, n, t, l | 8), e.elementType = Un, e.type = Un, e.expirationTime = i, e;
    case $n:
      return e = we(13, n, t, l), e.type = $n, e.elementType = $n, e.expirationTime = i, e;
    case sl:
      return e = we(19, n, t, l), e.elementType = sl, e.expirationTime = i, e;
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case Co:
          u = 10;
          break e;
        case _o:
          u = 9;
          break e;
        case oi:
          u = 11;
          break e;
        case si:
          u = 14;
          break e;
        case Po:
          u = 16, r = null;
          break e;
        case No:
          u = 22;
          break e;
      }
      throw Error(m(130, e == null ? e : typeof e, ""));
  }
  return t = we(u, n, t, l), t.elementType = e, t.type = r, t.expirationTime = i, t;
}
function $e(e, t, n, r) {
  return e = we(7, e, r, t), e.expirationTime = n, e;
}
function br(e, t, n) {
  return e = we(6, e, null, t), e.expirationTime = n, e;
}
function el(e, t, n) {
  return t = we(4, e.children !== null ? e.children : [], e.key, t), t.expirationTime = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function wc(e, t, n) {
  this.tag = t, this.current = null, this.containerInfo = e, this.pingCache = this.pendingChildren = null, this.finishedExpirationTime = 0, this.finishedWork = null, this.timeoutHandle = -1, this.pendingContext = this.context = null, this.hydrate = n, this.callbackNode = null, this.callbackPriority = 90, this.lastExpiredTime = this.lastPingedTime = this.nextKnownPendingLevel = this.lastSuspendedTime = this.firstSuspendedTime = this.firstPendingTime = 0;
}
function ua(e, t) {
  var n = e.firstSuspendedTime;
  return e = e.lastSuspendedTime, n !== 0 && n >= t && e <= t;
}
function ut(e, t) {
  var n = e.firstSuspendedTime, r = e.lastSuspendedTime;
  n < t && (e.firstSuspendedTime = t), (r > t || n === 0) && (e.lastSuspendedTime = t), t <= e.lastPingedTime && (e.lastPingedTime = 0), t <= e.lastExpiredTime && (e.lastExpiredTime = 0);
}
function oa(e, t) {
  t > e.firstPendingTime && (e.firstPendingTime = t);
  var n = e.firstSuspendedTime;
  n !== 0 && (t >= n ? e.firstSuspendedTime = e.lastSuspendedTime = e.nextKnownPendingLevel = 0 : t >= e.lastSuspendedTime && (e.lastSuspendedTime = t + 1), t > e.nextKnownPendingLevel && (e.nextKnownPendingLevel = t));
}
function Yl(e, t) {
  var n = e.lastExpiredTime;
  (n === 0 || n > t) && (e.lastExpiredTime = t);
}
function Sr(e, t, n, r) {
  var l = t.current, i = Te(), u = rn.suspense;
  i = ft(i, l, u);
  e: if (n) {
    n = n._reactInternalFiber;
    t: {
      if (vt(n) !== n || n.tag !== 1) throw Error(m(170));
      var o = n;
      do {
        switch (o.tag) {
          case 3:
            o = o.stateNode.context;
            break t;
          case 1:
            if (b(o.type)) {
              o = o.stateNode.__reactInternalMemoizedMergedChildContext;
              break t;
            }
        }
        o = o.return;
      } while (o !== null);
      throw Error(m(171));
    }
    if (n.tag === 1) {
      var f = n.type;
      if (b(f)) {
        n = vs(n, f, o);
        break e;
      }
    }
    n = o;
  } else n = Xe;
  return t.context === null ? t.context = n : t.pendingContext = n, t = Qe(i, u), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), He(l, t), Be(l, i), i;
}
function tl(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Zu(e, t) {
  e = e.memoizedState, e !== null && e.dehydrated !== null && e.retryTime < t && (e.retryTime = t);
}
function Wi(e, t) {
  Zu(e, t), (e = e.alternate) && Zu(e, t);
}
function Qi(e, t, n) {
  n = n != null && n.hydrate === !0;
  var r = new wc(e, t, n), l = we(3, null, null, t === 2 ? 7 : t === 1 ? 3 : 0);
  r.current = l, l.stateNode = r, Pi(l), e[wn] = r.current, n && t !== 0 && Ga(e, e.nodeType === 9 ? e : e.ownerDocument), this._internalRoot = r;
}
Qi.prototype.render = function(e) {
  Sr(e, this._internalRoot, null, null);
};
Qi.prototype.unmount = function() {
  var e = this._internalRoot, t = e.containerInfo;
  Sr(null, e, null, function() {
    t[wn] = null;
  });
};
function Cn(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Ec(e, t) {
  if (t || (t = e ? e.nodeType === 9 ? e.documentElement : e.firstChild : null, t = !(!t || t.nodeType !== 1 || !t.hasAttribute("data-reactroot"))), !t) for (var n; n = e.lastChild; ) e.removeChild(n);
  return new Qi(e, 0, t ? { hydrate: !0 } : void 0);
}
function Dr(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var u = i._internalRoot;
    if (typeof l == "function") {
      var o = l;
      l = function() {
        var c = tl(u);
        o.call(c);
      };
    }
    Sr(t, u, e, l);
  } else {
    if (i = n._reactRootContainer = Ec(n, r), u = i._internalRoot, typeof l == "function") {
      var f = l;
      l = function() {
        var c = tl(u);
        f.call(c);
      };
    }
    bs(function() {
      Sr(t, u, e, l);
    });
  }
  return tl(u);
}
function Tc(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: wt, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
Yo = function(e) {
  if (e.tag === 13) {
    var t = Yn(Te(), 150, 100);
    Be(e, t), Wi(e, t);
  }
};
pi = function(e) {
  e.tag === 13 && (Be(e, 3), Wi(e, 3));
};
Xo = function(e) {
  if (e.tag === 13) {
    var t = Te();
    t = ft(t, e, null), Be(e, t), Wi(e, t);
  }
};
ol = function(e, t, n) {
  switch (t) {
    case "input":
      if (fl(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = Ei(r);
            if (!l) throw Error(m(90));
            zo(r), fl(r, l);
          }
        }
      }
      break;
    case "textarea":
      Ro(e, n);
      break;
    case "select":
      t = n.value, t != null && Pt(e, !!n.multiple, t, !1);
  }
};
ti = qs;
To = function(e, t, n, r, l) {
  var i = x;
  x |= 4;
  try {
    return Ge(98, e.bind(null, t, n, r, l));
  } finally {
    x = i, x === V && xe();
  }
};
ni = function() {
  (x & (1 | he | ke)) === V && (sc(), $t());
};
ko = function(e, t) {
  var n = x;
  x |= 2;
  try {
    return e(t);
  } finally {
    x = n, x === V && xe();
  }
};
function sa(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Cn(t)) throw Error(m(200));
  return Tc(e, t, null, n);
}
var kc = { Events: [Tn, dt, Ei, go, ul, It, function(e) {
  ci(e, af);
}, wo, Eo, Nr, Pr, $t, { current: !1 }] };
(function(e) {
  var t = e.findFiberByHostInstance;
  return vc(G({}, e, { overrideHookState: null, overrideProps: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: me.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Wo(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: function(n) {
    return t ? t(n) : null;
  }, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null }));
})({
  findFiberByHostInstance: En,
  bundleType: 0,
  version: "16.14.0",
  rendererPackageName: "react-dom"
});
de.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = kc;
de.createPortal = sa;
de.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternalFiber;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(m(188)) : Error(m(268, Object.keys(e)));
  return e = Wo(t), e = e === null ? null : e.stateNode, e;
};
de.flushSync = function(e, t) {
  if ((x & (he | ke)) !== V) throw Error(m(187));
  var n = x;
  x |= 1;
  try {
    return Ge(99, e.bind(null, t));
  } finally {
    x = n, xe();
  }
};
de.hydrate = function(e, t, n) {
  if (!Cn(t)) throw Error(m(200));
  return Dr(null, e, t, !0, n);
};
de.render = function(e, t, n) {
  if (!Cn(t)) throw Error(m(200));
  return Dr(null, e, t, !1, n);
};
de.unmountComponentAtNode = function(e) {
  if (!Cn(e)) throw Error(m(40));
  return e._reactRootContainer ? (bs(function() {
    Dr(null, null, e, !1, function() {
      e._reactRootContainer = null, e[wn] = null;
    });
  }), !0) : !1;
};
de.unstable_batchedUpdates = qs;
de.unstable_createPortal = function(e, t) {
  return sa(e, t, 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null);
};
de.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!Cn(n)) throw Error(m(200));
  if (e == null || e._reactInternalFiber === void 0) throw Error(m(38));
  return Dr(e, t, n, !1, r);
};
de.version = "16.14.0";
function aa() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(aa);
    } catch (e) {
      console.error(e);
    }
}
aa(), co.exports = de;
var xc = co.exports;
const Sc = /* @__PURE__ */ Ju(xc);
console.log(Ma, Sc);
