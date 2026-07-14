let e;
let __tla = (async ()=>{
    let t;
    e = (e, t, n)=>()=>{
            if (n) throw n[0];
            try {
                return e && (t = e(e = 0)), t;
            } catch (e) {
                throw n = [
                    e
                ], e;
            }
        };
    t = (e, t)=>()=>(t || (e((t = {
                exports: {}
            }).exports, t), e = null), t.exports);
    (function() {
        let e = document.createElement(`link`).relList;
        if (e && e.supports && e.supports(`modulepreload`)) return;
        for (let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);
        new MutationObserver((e)=>{
            for (let t of e)if (t.type === `childList`) for (let e of t.addedNodes)e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function t(e) {
            let t = {};
            return e.integrity && (t.integrity = e.integrity), e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy), e.crossOrigin === `use-credentials` ? t.credentials = `include` : e.crossOrigin === `anonymous` ? t.credentials = `omit` : t.credentials = `same-origin`, t;
        }
        function n(e) {
            if (e.ep) return;
            e.ep = !0;
            let n = t(e);
            fetch(e.href, n);
        }
    })();
    function n(e) {
        let t = O.compressWitnessStack(e);
        if (t[3]) throw b(t[2]);
        var n = d(t[0], t[1]).slice();
        return O.__wbindgen_free(t[0], t[1] * 1, 1), n;
    }
    function r(e, t, n) {
        let r = v(e, O.__wbindgen_malloc), i = ae;
        return O.executeProgram(r, i, t, n);
    }
    function i() {
        return {
            __proto__: null,
            "./acvm_js_bg.js": {
                __proto__: null,
                __wbg___wbindgen_debug_string_ddde1867f49c2442: function(e, t) {
                    let n = y(u(t), O.__wbindgen_malloc, O.__wbindgen_realloc), r = ae;
                    f().setInt32(e + 4, r, !0), f().setInt32(e + 0, n, !0);
                },
                __wbg___wbindgen_is_function_d633e708baf0d146: function(e) {
                    return typeof e == `function`;
                },
                __wbg___wbindgen_is_string_7debe47dc1e045c2: function(e) {
                    return typeof e == `string`;
                },
                __wbg___wbindgen_is_undefined_c18285b9fc34cb7d: function(e) {
                    return e === void 0;
                },
                __wbg___wbindgen_number_get_5854912275df1894: function(e, t) {
                    let n = t, r = typeof n == `number` ? n : void 0;
                    f().setFloat64(e + 8, g(r) ? 0 : r, !0), f().setInt32(e + 0, !g(r), !0);
                },
                __wbg___wbindgen_string_get_3e5751597f39a112: function(e, t) {
                    let n = t, r = typeof n == `string` ? n : void 0;
                    var i = g(r) ? 0 : y(r, O.__wbindgen_malloc, O.__wbindgen_realloc), a = ae;
                    f().setInt32(e + 4, a, !0), f().setInt32(e + 0, i, !0);
                },
                __wbg___wbindgen_throw_39bc967c0e5a9b58: function(e, t) {
                    throw Error(p(e, t));
                },
                __wbg__wbg_cb_unref_b6d832240a919168: function(e) {
                    e._wbg_cb_unref();
                },
                __wbg_call_08ad0d89caa7cb79: function() {
                    return h(function(e, t, n) {
                        return e.call(t, n);
                    }, arguments);
                },
                __wbg_call_c974f0bf2231552e: function() {
                    return h(function(e, t, n, r) {
                        return e.call(t, n, r);
                    }, arguments);
                },
                __wbg_constructor_9c2bd46a7dce7d92: function(e) {
                    return Error(e);
                },
                __wbg_constructor_dab9c5e2cb00fd27: function(e) {
                    return Error(e);
                },
                __wbg_debug_8804c16f548276da: function(e, t, n, r) {
                    console.debug(e, t, n, r);
                },
                __wbg_debug_e69ad32e6af73f94: function(e) {
                    console.debug(e);
                },
                __wbg_error_91d10625a3b36a08: function(e, t, n, r) {
                    console.error(e, t, n, r);
                },
                __wbg_error_a6fa202b58aa1cd3: function(e, t) {
                    let n, r;
                    try {
                        n = e, r = t, console.error(p(e, t));
                    } finally{
                        O.__wbindgen_free(n, r, 1);
                    }
                },
                __wbg_error_ad28debb48b5c6bb: function(e) {
                    console.error(e);
                },
                __wbg_forEach_9694464cb60ea370: function(e, t, n) {
                    try {
                        var r = {
                            a: t,
                            b: n
                        };
                        e.forEach((e, t)=>{
                            let n = r.a;
                            r.a = 0;
                            try {
                                return o(n, r.b, e, t);
                            } finally{
                                r.a = n;
                            }
                        });
                    } finally{
                        r.a = r.b = 0;
                    }
                },
                __wbg_forEach_f33e388a24ae7d4f: function(e, t, n) {
                    try {
                        var r = {
                            a: t,
                            b: n
                        };
                        e.forEach((e, t, n)=>{
                            let i = r.a;
                            r.a = 0;
                            try {
                                return c(i, r.b, e, t, n);
                            } finally{
                                r.a = i;
                            }
                        });
                    } finally{
                        r.a = r.b = 0;
                    }
                },
                __wbg_fromEntries_2f51c4024e2a7aa3: function() {
                    return h(function(e) {
                        return Object.fromEntries(e);
                    }, arguments);
                },
                __wbg_from_d7e888a2e9063b32: function(e) {
                    return Array.from(e);
                },
                __wbg_get_f09c3a16f8848381: function(e, t) {
                    return e[t >>> 0];
                },
                __wbg_get_unchecked_3d0f4b91c8eca4f0: function(e, t) {
                    return e[t >>> 0];
                },
                __wbg_info_28d530adaabdab8c: function(e, t, n, r) {
                    console.info(e, t, n, r);
                },
                __wbg_info_72e7e65fa3fc8b25: function(e) {
                    console.info(e);
                },
                __wbg_isArray_581b02d0060c9728: function(e) {
                    return Array.isArray(e);
                },
                __wbg_length_a31e05262e09b7f8: function(e) {
                    return e.length;
                },
                __wbg_new_1213b57bccbdbb66: function(e, t) {
                    return Error(p(e, t));
                },
                __wbg_new_227d7c05414eb861: function() {
                    return Error();
                },
                __wbg_new_602e1a672b1320f2: function() {
                    return new Map;
                },
                __wbg_new_92df58a8ec3bfb6b: function() {
                    return new Map;
                },
                __wbg_new_9d1883f62bc40b5c: function() {
                    return [];
                },
                __wbg_new_cbee8c0d5c479eac: function() {
                    return [];
                },
                __wbg_new_typed_8258a0d8488ef2a2: function(e, t) {
                    try {
                        var n = {
                            a: e,
                            b: t
                        };
                        return new Promise((e, t)=>{
                            let r = n.a;
                            n.a = 0;
                            try {
                                return s(r, n.b, e, t);
                            } finally{
                                n.a = r;
                            }
                        });
                    } finally{
                        n.a = n.b = 0;
                    }
                },
                __wbg_parse_6dfe891b5bafb5cd: function() {
                    return h(function(e, t) {
                        return JSON.parse(p(e, t));
                    }, arguments);
                },
                __wbg_push_a6f9488ffd3fae3b: function(e, t) {
                    return e.push(t);
                },
                __wbg_queueMicrotask_2c8dfd1056f24fdc: function(e) {
                    return e.queueMicrotask;
                },
                __wbg_queueMicrotask_8985ad63815852e7: function(e) {
                    queueMicrotask(e);
                },
                __wbg_resolve_5d61e0d10c14730a: function(e) {
                    return Promise.resolve(e);
                },
                __wbg_reverse_fcf59127ee940f96: function(e) {
                    return e.reverse();
                },
                __wbg_set_bad5c505cc70b5f8: function() {
                    return h(function(e, t, n) {
                        return Reflect.set(e, t, n);
                    }, arguments);
                },
                __wbg_set_cause_7f44b7881bde2bb6: function(e, t) {
                    e.cause = t;
                },
                __wbg_set_cfc6de03f990decf: function(e, t, n) {
                    return e.set(t, n);
                },
                __wbg_stack_3b0d974bbf31e44f: function(e, t) {
                    let n = t.stack, r = y(n, O.__wbindgen_malloc, O.__wbindgen_realloc), i = ae;
                    f().setInt32(e + 4, i, !0), f().setInt32(e + 0, r, !0);
                },
                __wbg_static_accessor_GLOBAL_THIS_14325d8cca34bb77: function() {
                    let e = typeof globalThis > `u` ? null : globalThis;
                    return g(e) ? 0 : l(e);
                },
                __wbg_static_accessor_GLOBAL_f3a1e69f9c5a7e8e: function() {
                    let e = typeof global > `u` ? null : global;
                    return g(e) ? 0 : l(e);
                },
                __wbg_static_accessor_SELF_50cdb5b517789aca: function() {
                    let e = typeof self > `u` ? null : self;
                    return g(e) ? 0 : l(e);
                },
                __wbg_static_accessor_WINDOW_d6c4126e4c244380: function() {
                    let e = typeof window > `u` ? null : window;
                    return g(e) ? 0 : l(e);
                },
                __wbg_then_d4163530723f56f4: function(e, t, n) {
                    return e.then(t, n);
                },
                __wbg_then_f1c954fe00733701: function(e, t) {
                    return e.then(t);
                },
                __wbg_values_623449cff68c6e40: function(e) {
                    return Object.values(e);
                },
                __wbg_warn_2540fe736f19ad5c: function(e, t, n, r) {
                    console.warn(e, t, n, r);
                },
                __wbg_warn_3310c7343993c074: function(e) {
                    console.warn(e);
                },
                __wbindgen_cast_0000000000000001: function(e, t) {
                    return _(e, t, O.wasm_bindgen__closure__destroy__h622bad63540236e2, a);
                },
                __wbindgen_cast_0000000000000002: function(e) {
                    return e;
                },
                __wbindgen_cast_0000000000000003: function(e, t) {
                    return p(e, t);
                },
                __wbindgen_init_externref_table: function() {
                    let e = O.__wbindgen_externrefs, t = e.grow(4);
                    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
                }
            }
        };
    }
    function a(e, t, n) {
        let r = O.wasm_bindgen__convert__closures_____invoke__h9b9b5ed547e2ba3f(e, t, n);
        if (r[1]) throw b(r[0]);
    }
    function o(e, t, n, r) {
        O.wasm_bindgen__convert__closures_____invoke__h1e56d78f2a0bfba8(e, t, n, r);
    }
    function s(e, t, n, r) {
        O.wasm_bindgen__convert__closures_____invoke__h1e56d78f2a0bfba8_21(e, t, n, r);
    }
    function c(e, t, n, r, i) {
        O.wasm_bindgen__convert__closures_____invoke__h2a81a24b10fc6cea(e, t, n, r, i);
    }
    function l(e) {
        let t = O.__externref_table_alloc();
        return O.__wbindgen_externrefs.set(t, e), t;
    }
    function u(e) {
        let t = typeof e;
        if (t == `number` || t == `boolean` || e == null) return `${e}`;
        if (t == `string`) return `"${e}"`;
        if (t == `symbol`) {
            let t = e.description;
            return t == null ? `Symbol` : `Symbol(${t})`;
        }
        if (t == `function`) {
            let t = e.name;
            return typeof t == `string` && t.length > 0 ? `Function(${t})` : `Function`;
        }
        if (Array.isArray(e)) {
            let t = e.length, n = `[`;
            t > 0 && (n += u(e[0]));
            for(let r = 1; r < t; r++)n += `, ` + u(e[r]);
            return n += `]`, n;
        }
        let n = /\[object ([^\]]+)\]/.exec(toString.call(e)), r;
        if (n && n.length > 1) r = n[1];
        else return toString.call(e);
        if (r == `Object`) try {
            return `Object(` + JSON.stringify(e) + `)`;
        } catch  {
            return `Object`;
        }
        return e instanceof Error ? `${e.name}: ${e.message}\n${e.stack}` : r;
    }
    function d(e, t) {
        return e >>>= 0, m().subarray(e / 1, e / 1 + t);
    }
    function f() {
        return (E === null || E.buffer.detached === !0 || E.buffer.detached === void 0 && E.buffer !== O.memory.buffer) && (E = new DataView(O.memory.buffer)), E;
    }
    function p(e, t) {
        return e >>>= 0, x(e, t);
    }
    function m() {
        return (ee === null || ee.byteLength === 0) && (ee = new Uint8Array(O.memory.buffer)), ee;
    }
    function h(e, t) {
        try {
            return e.apply(this, t);
        } catch (e) {
            let t = l(e);
            O.__wbindgen_exn_store(t);
        }
    }
    function g(e) {
        return e == null;
    }
    function _(e, t, n, r) {
        let i = {
            a: e,
            b: t,
            cnt: 1,
            dtor: n
        }, a = (...e)=>{
            i.cnt++;
            let t = i.a;
            i.a = 0;
            try {
                return r(t, i.b, ...e);
            } finally{
                i.a = t, a._wbg_cb_unref();
            }
        };
        return a._wbg_cb_unref = ()=>{
            --i.cnt === 0 && (i.dtor(i.a, i.b), i.a = 0, T.unregister(i));
        }, T.register(a, i, i), a;
    }
    function v(e, t) {
        let n = t(e.length * 1, 1) >>> 0;
        return m().set(e, n / 1), ae = e.length, n;
    }
    function y(e, t, n) {
        if (n === void 0) {
            let n = ie.encode(e), r = t(n.length, 1) >>> 0;
            return m().subarray(r, r + n.length).set(n), ae = n.length, r;
        }
        let r = e.length, i = t(r, 1) >>> 0, a = m(), o = 0;
        for(; o < r; o++){
            let t = e.charCodeAt(o);
            if (t > 127) break;
            a[i + o] = t;
        }
        if (o !== r) {
            o !== 0 && (e = e.slice(o)), i = n(i, r, r = o + e.length * 3, 1) >>> 0;
            let t = m().subarray(i + o, i + r), a = ie.encodeInto(e, t);
            o += a.written, i = n(i, r, o, 1) >>> 0;
        }
        return ae = o, i;
    }
    function b(e) {
        let t = O.__wbindgen_externrefs.get(e);
        return O.__externref_table_dealloc(e), t;
    }
    function x(e, t) {
        return re += t, re >= ne && (te = new TextDecoder(`utf-8`, {
            ignoreBOM: !0,
            fatal: !0
        }), te.decode(), re = t), te.decode(m().subarray(e, e + t));
    }
    function S(e, t) {
        return O = e.exports, E = null, D = null, ee = null, O.__wbindgen_start(), O;
    }
    async function C(e, t) {
        if (typeof Response == `function` && e instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming == `function`) try {
                return await WebAssembly.instantiateStreaming(e, t);
            } catch (t) {
                if (e.ok && n(e.type) && e.headers.get(`Content-Type`) !== `application/wasm`) console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t);
                else throw t;
            }
            let r = await e.arrayBuffer();
            return await WebAssembly.instantiate(r, t);
        } else {
            let n = await WebAssembly.instantiate(e, t);
            return n instanceof WebAssembly.Instance ? {
                instance: n,
                module: e
            } : n;
        }
        function n(e) {
            switch(e){
                case `basic`:
                case `cors`:
                case `default`:
                    return !0;
            }
            return !1;
        }
    }
    async function w(e) {
        if (O !== void 0) return O;
        e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? { module_or_path: e } = e : console.warn(`using deprecated parameters for the initialization function; pass a single object instead`)), e === void 0 && (e = new URL(`` + new URL(`acvm_js_bg-Cw3_o1NH.wasm`, import.meta.url).href, `` + import.meta.url));
        let t = i();
        (typeof e == `string` || typeof Request == `function` && e instanceof Request || typeof URL == `function` && e instanceof URL) && (e = fetch(e));
        let { instance: n, module: r } = await C(await e, t);
        return S(n, r);
    }
    var T, E, D, ee, te, ne, re, ie, ae, O, oe = e((()=>{
        T = typeof FinalizationRegistry > `u` ? {
            register: ()=>{},
            unregister: ()=>{}
        } : new FinalizationRegistry((e)=>e.dtor(e.a, e.b)), E = null, ee = null, te = new TextDecoder(`utf-8`, {
            ignoreBOM: !0,
            fatal: !0
        }), te.decode(), ne = 2146435072, re = 0, ie = new TextEncoder, `encodeInto` in ie || (ie.encodeInto = function(e, t) {
            let n = ie.encode(e);
            return t.set(n), {
                read: e.length,
                written: n.length
            };
        }), ae = 0;
    }));
    function se(e, t) {
        let n = k.abiDecode(e, t);
        if (n[2]) throw ye(n[1]);
        return ye(n[0]);
    }
    function ce(e, t) {
        let n = k.abiDecodeError(e, t);
        if (n[2]) throw ye(n[1]);
        return ye(n[0]);
    }
    function le(e, t, n) {
        let r = k.abiEncode(e, t, _e(n) ? 0 : fe(n));
        if (r[2]) throw ye(r[1]);
        return ye(r[0]);
    }
    function ue() {
        return {
            __proto__: null,
            "./noirc_abi_wasm_bg.js": {
                __proto__: null,
                __wbg___wbindgen_is_undefined_c18285b9fc34cb7d: function(e) {
                    return e === void 0;
                },
                __wbg___wbindgen_number_get_5854912275df1894: function(e, t) {
                    let n = t, r = typeof n == `number` ? n : void 0;
                    pe().setFloat64(e + 8, _e(r) ? 0 : r, !0), pe().setInt32(e + 0, !_e(r), !0);
                },
                __wbg___wbindgen_string_get_3e5751597f39a112: function(e, t) {
                    let n = t, r = typeof n == `string` ? n : void 0;
                    var i = _e(r) ? 0 : ve(r, k.__wbindgen_malloc, k.__wbindgen_realloc), a = Ae;
                    pe().setInt32(e + 4, a, !0), pe().setInt32(e + 0, i, !0);
                },
                __wbg___wbindgen_throw_39bc967c0e5a9b58: function(e, t) {
                    throw Error(me(e, t));
                },
                __wbg_constructor_b938775810abe936: function(e) {
                    return Error(e);
                },
                __wbg_error_a6fa202b58aa1cd3: function(e, t) {
                    let n, r;
                    try {
                        n = e, r = t, console.error(me(e, t));
                    } finally{
                        k.__wbindgen_free(n, r, 1);
                    }
                },
                __wbg_forEach_9694464cb60ea370: function(e, t, n) {
                    try {
                        var r = {
                            a: t,
                            b: n
                        };
                        e.forEach((e, t)=>{
                            let n = r.a;
                            r.a = 0;
                            try {
                                return de(n, r.b, e, t);
                            } finally{
                                r.a = n;
                            }
                        });
                    } finally{
                        r.a = r.b = 0;
                    }
                },
                __wbg_new_227d7c05414eb861: function() {
                    return Error();
                },
                __wbg_new_96dbaebe19ad979d: function() {
                    return new Map;
                },
                __wbg_parse_6dfe891b5bafb5cd: function() {
                    return ge(function(e, t) {
                        return JSON.parse(me(e, t));
                    }, arguments);
                },
                __wbg_set_cfc6de03f990decf: function(e, t, n) {
                    return e.set(t, n);
                },
                __wbg_stack_3b0d974bbf31e44f: function(e, t) {
                    let n = t.stack, r = ve(n, k.__wbindgen_malloc, k.__wbindgen_realloc), i = Ae;
                    pe().setInt32(e + 4, i, !0), pe().setInt32(e + 0, r, !0);
                },
                __wbg_stringify_86f4ab954f88f382: function() {
                    return ge(function(e) {
                        return JSON.stringify(e);
                    }, arguments);
                },
                __wbindgen_cast_0000000000000001: function(e) {
                    return e;
                },
                __wbindgen_cast_0000000000000002: function(e, t) {
                    return me(e, t);
                },
                __wbindgen_init_externref_table: function() {
                    let e = k.__wbindgen_externrefs, t = e.grow(4);
                    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
                }
            }
        };
    }
    function de(e, t, n, r) {
        k.wasm_bindgen__convert__closures_____invoke__h1e56d78f2a0bfba8(e, t, n, r);
    }
    function fe(e) {
        let t = k.__externref_table_alloc();
        return k.__wbindgen_externrefs.set(t, e), t;
    }
    function pe() {
        return (we === null || we.buffer.detached === !0 || we.buffer.detached === void 0 && we.buffer !== k.memory.buffer) && (we = new DataView(k.memory.buffer)), we;
    }
    function me(e, t) {
        return e >>>= 0, be(e, t);
    }
    function he() {
        return (Te === null || Te.byteLength === 0) && (Te = new Uint8Array(k.memory.buffer)), Te;
    }
    function ge(e, t) {
        try {
            return e.apply(this, t);
        } catch (e) {
            let t = fe(e);
            k.__wbindgen_exn_store(t);
        }
    }
    function _e(e) {
        return e == null;
    }
    function ve(e, t, n) {
        if (n === void 0) {
            let n = ke.encode(e), r = t(n.length, 1) >>> 0;
            return he().subarray(r, r + n.length).set(n), Ae = n.length, r;
        }
        let r = e.length, i = t(r, 1) >>> 0, a = he(), o = 0;
        for(; o < r; o++){
            let t = e.charCodeAt(o);
            if (t > 127) break;
            a[i + o] = t;
        }
        if (o !== r) {
            o !== 0 && (e = e.slice(o)), i = n(i, r, r = o + e.length * 3, 1) >>> 0;
            let t = he().subarray(i + o, i + r), a = ke.encodeInto(e, t);
            o += a.written, i = n(i, r, o, 1) >>> 0;
        }
        return Ae = o, i;
    }
    function ye(e) {
        let t = k.__wbindgen_externrefs.get(e);
        return k.__externref_table_dealloc(e), t;
    }
    function be(e, t) {
        return Oe += t, Oe >= De && (Ee = new TextDecoder(`utf-8`, {
            ignoreBOM: !0,
            fatal: !0
        }), Ee.decode(), Oe = t), Ee.decode(he().subarray(e, e + t));
    }
    function xe(e, t) {
        return k = e.exports, we = null, Te = null, k.__wbindgen_start(), k;
    }
    async function Se(e, t) {
        if (typeof Response == `function` && e instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming == `function`) try {
                return await WebAssembly.instantiateStreaming(e, t);
            } catch (t) {
                if (e.ok && n(e.type) && e.headers.get(`Content-Type`) !== `application/wasm`) console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t);
                else throw t;
            }
            let r = await e.arrayBuffer();
            return await WebAssembly.instantiate(r, t);
        } else {
            let n = await WebAssembly.instantiate(e, t);
            return n instanceof WebAssembly.Instance ? {
                instance: n,
                module: e
            } : n;
        }
        function n(e) {
            switch(e){
                case `basic`:
                case `cors`:
                case `default`:
                    return !0;
            }
            return !1;
        }
    }
    async function Ce(e) {
        if (k !== void 0) return k;
        e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? { module_or_path: e } = e : console.warn(`using deprecated parameters for the initialization function; pass a single object instead`)), e === void 0 && (e = new URL(`` + new URL(`noirc_abi_wasm_bg-DeaSQ9zk.wasm`, import.meta.url).href, `` + import.meta.url));
        let t = ue();
        (typeof e == `string` || typeof Request == `function` && e instanceof Request || typeof URL == `function` && e instanceof URL) && (e = fetch(e));
        let { instance: n, module: r } = await Se(await e, t);
        return xe(n, r);
    }
    var we, Te, Ee, De, Oe, ke, Ae, k, je = e((()=>{
        we = null, Te = null, Ee = new TextDecoder(`utf-8`, {
            ignoreBOM: !0,
            fatal: !0
        }), Ee.decode(), De = 2146435072, Oe = 0, ke = new TextEncoder, `encodeInto` in ke || (ke.encodeInto = function(e, t) {
            let n = ke.encode(e);
            return t.set(n), {
                read: e.length,
                written: n.length
            };
        }), Ae = 0;
    }));
    function Me(e) {
        if (typeof Buffer < `u`) return Buffer.from(e, `base64`);
        if (typeof atob == `function`) return Uint8Array.from(atob(e), (e)=>e.charCodeAt(0));
        throw Error(`No implementation found for base64 decoding.`);
    }
    var Ne = e((()=>{}));
    function Pe(e) {
        let t = e.length;
        for(; --t >= 0;)e[t] = 0;
    }
    function Fe(e, t, n, r, i) {
        this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = e && e.length;
    }
    function Ie(e, t) {
        this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
    }
    function Le(e, t, n, r, i) {
        this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
    }
    function Re() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = An, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.legacy_hash = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Pn * 2), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), Qn(this.dyn_ltree), Qn(this.dyn_dtree), Qn(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), Qn(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), Qn(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
    }
    function ze() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = ``, this.state = null, this.data_type = 2, this.adler = 0;
    }
    function Be(e) {
        this.options = Dr.assign({}, Kr, e || {});
        let t = this.options;
        t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = ``, this.ended = !1, this.chunks = [], this.strm = new Fr, this.strm.avail_out = 0;
        let n = Cr.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy, t.legacyHash);
        if (n !== Vr) throw Error(sn[n]);
        if (t.header && Cr.deflateSetHeader(this.strm, t.header), t.dictionary) {
            let e;
            if (e = typeof t.dictionary == `string` ? Pr.string2buf(t.dictionary) : Ir.call(t.dictionary) === `[object ArrayBuffer]` ? new Uint8Array(t.dictionary) : t.dictionary, n = Cr.deflateSetDictionary(this.strm, e), n !== Vr) throw Error(sn[n]);
            this._dict_set = !0;
        }
    }
    function Ve(e, t) {
        let n = new Be(t);
        if (n.push(e, !0), n.err) throw n.msg || sn[n.err];
        return n.result;
    }
    function He(e, t) {
        return t ||= {}, t.raw = !0, Ve(e, t);
    }
    function Ue(e, t) {
        return t ||= {}, t.gzip = !0, Ve(e, t);
    }
    function We() {
        this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
    }
    function Ge() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = ``, this.comment = ``, this.hcrc = 0, this.done = !1;
    }
    function Ke(e) {
        this.options = Dr.assign({}, ja, e || {});
        let t = this.options;
        t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !(e && e.windowBits) && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15 || (t.windowBits |= 15)), this.err = 0, this.msg = ``, this.ended = !1, this.chunks = [], this.strm = new Fr, this.strm.avail_out = 0;
        let n = ya.inflateInit2(this.strm, t.windowBits);
        if (n !== wa || (this.header = new ba, ya.inflateGetHeader(this.strm, this.header), t.dictionary && (typeof t.dictionary == `string` ? t.dictionary = Pr.string2buf(t.dictionary) : xa.call(t.dictionary) === `[object ArrayBuffer]` && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = ya.inflateSetDictionary(this.strm, t.dictionary), n !== wa)))) throw Error(sn[n]);
    }
    function qe(e, t) {
        let n = new Ke(t);
        if (n.push(e, !0), n.err) throw n.msg || sn[n.err];
        return n.result;
    }
    function Je(e, t) {
        return t ||= {}, t.raw = !0, qe(e, t);
    }
    var Ye, Xe, Ze, Qe, $e, et, tt, nt, rt, it, at, ot, st, ct, lt, ut, dt, ft, pt, mt, ht, gt, _t, vt, yt, bt, xt, St, Ct, wt, Tt, Et, Dt, Ot, kt, At, A, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, on, j, sn, cn, ln, un, dn, fn, pn, mn, hn, gn, _n, vn, M, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, kn, An, jn, Mn, Nn, Pn, N, Fn, In, Ln, Rn, zn, Bn, Vn, Hn, Un, Wn, Gn, P, Kn, qn, Jn, Yn, Xn, Zn, Qn, $n, er, tr, F, nr, I, rr, ir, ar, or, sr, cr, lr, ur, dr, fr, pr, mr, hr, gr, _r, vr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Or, kr, Ar, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr, Hr, Ur, Wr, Gr, Kr, qr, Jr, Yr, Xr, Zr, Qr, $r, ei, ti, ni, ri, ii, ai, oi, si, ci, li, ui, di, fi, pi, mi, hi, gi, _i, vi, yi, bi, xi, Si, Ci, wi, Ti, Ei, Di, Oi, ki, Ai, ji, Mi, Ni, Pi, Fi, Ii, Li, Ri, zi, Bi, Vi, Hi, Ui, Wi, Gi, Ki, qi, Ji, Yi, Xi, Zi, L, Qi, $i, ea, ta, na, ra, ia, aa, oa, sa, ca, la, ua, da, fa, pa, ma, ha, ga, _a, va, ya, ba, xa, Sa, Ca, wa, Ta, Ea, Da, Oa, ka, Aa, ja, Ma, Na, Pa, Fa, Ia, La, Ra, za, Ba, Va, Ha, Ua, Wa, Ga, Ka, qa, Ja, Ya, Xa, Za = e((()=>{
        Ye = 4, Xe = 0, Ze = 1, Qe = 2, $e = 0, et = 1, tt = 2, nt = 29, rt = 256, it = 286, at = 30, ot = 19, st = 573, ct = 15, lt = 16, ut = 7, dt = 256, ft = 16, pt = 17, mt = 18, ht = new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            4,
            4,
            4,
            4,
            5,
            5,
            5,
            5,
            0
        ]), gt = new Uint8Array([
            0,
            0,
            0,
            0,
            1,
            1,
            2,
            2,
            3,
            3,
            4,
            4,
            5,
            5,
            6,
            6,
            7,
            7,
            8,
            8,
            9,
            9,
            10,
            10,
            11,
            11,
            12,
            12,
            13,
            13
        ]), _t = new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            2,
            3,
            7
        ]), vt = new Uint8Array([
            16,
            17,
            18,
            0,
            8,
            7,
            9,
            6,
            10,
            5,
            11,
            4,
            12,
            3,
            13,
            2,
            14,
            1,
            15
        ]), yt = 512, bt = Array(288 * 2), Pe(bt), xt = Array(at * 2), Pe(xt), St = Array(yt), Pe(St), Ct = Array(256), Pe(Ct), wt = Array(nt), Pe(wt), Tt = Array(at), Pe(Tt), kt = (e)=>e < 256 ? St[e] : St[256 + (e >>> 7)], At = (e, t)=>{
            e.pending_buf[e.pending++] = t & 255, e.pending_buf[e.pending++] = t >>> 8 & 255;
        }, A = (e, t, n)=>{
            e.bi_valid > lt - n ? (e.bi_buf |= t << e.bi_valid & 65535, At(e, e.bi_buf), e.bi_buf = t >> lt - e.bi_valid, e.bi_valid += n - lt) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
        }, jt = (e, t, n)=>{
            A(e, n[t * 2], n[t * 2 + 1]);
        }, Mt = (e, t)=>{
            let n = 0;
            do n |= e & 1, e >>>= 1, n <<= 1;
            while (--t > 0);
            return n >>> 1;
        }, Nt = (e)=>{
            e.bi_valid === 16 ? (At(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
        }, Pt = (e, t)=>{
            let n = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, a = t.stat_desc.has_stree, o = t.stat_desc.extra_bits, s = t.stat_desc.extra_base, c = t.stat_desc.max_length, l, u, d, f, p, m, h = 0;
            for(f = 0; f <= ct; f++)e.bl_count[f] = 0;
            for(n[e.heap[e.heap_max] * 2 + 1] = 0, l = e.heap_max + 1; l < st; l++)u = e.heap[l], f = n[n[u * 2 + 1] * 2 + 1] + 1, f > c && (f = c, h++), n[u * 2 + 1] = f, !(u > r) && (e.bl_count[f]++, p = 0, u >= s && (p = o[u - s]), m = n[u * 2], e.opt_len += m * (f + p), a && (e.static_len += m * (i[u * 2 + 1] + p)));
            if (h !== 0) {
                do {
                    for(f = c - 1; e.bl_count[f] === 0;)f--;
                    e.bl_count[f]--, e.bl_count[f + 1] += 2, e.bl_count[c]--, h -= 2;
                }while (h > 0);
                for(f = c; f !== 0; f--)for(u = e.bl_count[f]; u !== 0;)d = e.heap[--l], !(d > r) && (n[d * 2 + 1] !== f && (e.opt_len += (f - n[d * 2 + 1]) * n[d * 2], n[d * 2 + 1] = f), u--);
            }
        }, Ft = (e, t, n)=>{
            let r = Array(16), i = 0, a, o;
            for(a = 1; a <= ct; a++)i = i + n[a - 1] << 1, r[a] = i;
            for(o = 0; o <= t; o++){
                let t = e[o * 2 + 1];
                t !== 0 && (e[o * 2] = Mt(r[t]++, t));
            }
        }, It = ()=>{
            let e, t, n, r, i, a = Array(16);
            for(n = 0, r = 0; r < nt - 1; r++)for(wt[r] = n, e = 0; e < 1 << ht[r]; e++)Ct[n++] = r;
            for(Ct[n - 1] = r, i = 0, r = 0; r < 16; r++)for(Tt[r] = i, e = 0; e < 1 << gt[r]; e++)St[i++] = r;
            for(i >>= 7; r < at; r++)for(Tt[r] = i << 7, e = 0; e < 1 << gt[r] - 7; e++)St[256 + i++] = r;
            for(t = 0; t <= ct; t++)a[t] = 0;
            for(e = 0; e <= 143;)bt[e * 2 + 1] = 8, e++, a[8]++;
            for(; e <= 255;)bt[e * 2 + 1] = 9, e++, a[9]++;
            for(; e <= 279;)bt[e * 2 + 1] = 7, e++, a[7]++;
            for(; e <= 287;)bt[e * 2 + 1] = 8, e++, a[8]++;
            for(Ft(bt, 287, a), e = 0; e < at; e++)xt[e * 2 + 1] = 5, xt[e * 2] = Mt(e, 5);
            Et = new Fe(bt, ht, 257, it, ct), Dt = new Fe(xt, gt, 0, at, ct), Ot = new Fe([], _t, 0, ot, ut);
        }, Lt = (e)=>{
            let t;
            for(t = 0; t < it; t++)e.dyn_ltree[t * 2] = 0;
            for(t = 0; t < at; t++)e.dyn_dtree[t * 2] = 0;
            for(t = 0; t < ot; t++)e.bl_tree[t * 2] = 0;
            e.dyn_ltree[dt * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
        }, Rt = (e)=>{
            e.bi_valid > 8 ? At(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
        }, zt = (e, t, n, r)=>{
            let i = t * 2, a = n * 2;
            return e[i] < e[a] || e[i] === e[a] && r[t] <= r[n];
        }, Bt = (e, t, n)=>{
            let r = e.heap[n], i = n << 1;
            for(; i <= e.heap_len && (i < e.heap_len && zt(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !zt(t, r, e.heap[i], e.depth));)e.heap[n] = e.heap[i], n = i, i <<= 1;
            e.heap[n] = r;
        }, Vt = (e, t, n)=>{
            let r, i, a = 0, o, s;
            if (e.sym_next !== 0) do r = e.pending_buf[e.sym_buf + a++] & 255, r += (e.pending_buf[e.sym_buf + a++] & 255) << 8, i = e.pending_buf[e.sym_buf + a++], r === 0 ? jt(e, i, t) : (o = Ct[i], jt(e, o + rt + 1, t), s = ht[o], s !== 0 && (i -= wt[o], A(e, i, s)), r--, o = kt(r), jt(e, o, n), s = gt[o], s !== 0 && (r -= Tt[o], A(e, r, s)));
            while (a < e.sym_next);
            jt(e, dt, t);
        }, Ht = (e, t)=>{
            let n = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, a = t.stat_desc.elems, o, s, c = -1, l;
            for(e.heap_len = 0, e.heap_max = st, o = 0; o < a; o++)n[o * 2] === 0 ? n[o * 2 + 1] = 0 : (e.heap[++e.heap_len] = c = o, e.depth[o] = 0);
            for(; e.heap_len < 2;)l = e.heap[++e.heap_len] = c < 2 ? ++c : 0, n[l * 2] = 1, e.depth[l] = 0, e.opt_len--, i && (e.static_len -= r[l * 2 + 1]);
            for(t.max_code = c, o = e.heap_len >> 1; o >= 1; o--)Bt(e, n, o);
            l = a;
            do o = e.heap[1], e.heap[1] = e.heap[e.heap_len--], Bt(e, n, 1), s = e.heap[1], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = s, n[l * 2] = n[o * 2] + n[s * 2], e.depth[l] = (e.depth[o] >= e.depth[s] ? e.depth[o] : e.depth[s]) + 1, n[o * 2 + 1] = n[s * 2 + 1] = l, e.heap[1] = l++, Bt(e, n, 1);
            while (e.heap_len >= 2);
            e.heap[--e.heap_max] = e.heap[1], Pt(e, t), Ft(n, c, e.bl_count);
        }, Ut = (e, t, n)=>{
            let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
            for(o === 0 && (c = 138, l = 3), t[(n + 1) * 2 + 1] = 65535, r = 0; r <= n; r++)a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o) && (s < l ? e.bl_tree[a * 2] += s : a === 0 ? s <= 10 ? e.bl_tree[pt * 2]++ : e.bl_tree[mt * 2]++ : (a !== i && e.bl_tree[a * 2]++, e.bl_tree[ft * 2]++), s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4));
        }, Wt = (e, t, n)=>{
            let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
            for(o === 0 && (c = 138, l = 3), r = 0; r <= n; r++)if (a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o)) {
                if (s < l) do jt(e, a, e.bl_tree);
                while (--s !== 0);
                else a === 0 ? s <= 10 ? (jt(e, pt, e.bl_tree), A(e, s - 3, 3)) : (jt(e, mt, e.bl_tree), A(e, s - 11, 7)) : (a !== i && (jt(e, a, e.bl_tree), s--), jt(e, ft, e.bl_tree), A(e, s - 3, 2));
                s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4);
            }
        }, Gt = (e)=>{
            let t;
            for(Ut(e, e.dyn_ltree, e.l_desc.max_code), Ut(e, e.dyn_dtree, e.d_desc.max_code), Ht(e, e.bl_desc), t = ot - 1; t >= 3 && e.bl_tree[vt[t] * 2 + 1] === 0; t--);
            return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
        }, Kt = (e, t, n, r)=>{
            let i;
            for(A(e, t - 257, 5), A(e, n - 1, 5), A(e, r - 4, 4), i = 0; i < r; i++)A(e, e.bl_tree[vt[i] * 2 + 1], 3);
            Wt(e, e.dyn_ltree, t - 1), Wt(e, e.dyn_dtree, n - 1);
        }, qt = (e)=>{
            let t = 4093624447, n;
            for(n = 0; n <= 31; n++, t >>>= 1)if (t & 1 && e.dyn_ltree[n * 2] !== 0) return Xe;
            if (e.dyn_ltree[18] !== 0 || e.dyn_ltree[20] !== 0 || e.dyn_ltree[26] !== 0) return Ze;
            for(n = 32; n < rt; n++)if (e.dyn_ltree[n * 2] !== 0) return Ze;
            return Xe;
        }, Jt = !1, Yt = (e)=>{
            Jt ||= (It(), !0), e.l_desc = new Ie(e.dyn_ltree, Et), e.d_desc = new Ie(e.dyn_dtree, Dt), e.bl_desc = new Ie(e.bl_tree, Ot), e.bi_buf = 0, e.bi_valid = 0, Lt(e);
        }, Xt = (e, t, n, r)=>{
            A(e, ($e << 1) + +!!r, 3), Rt(e), At(e, n), At(e, ~n), n && e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n;
        }, Zt = (e)=>{
            A(e, et << 1, 3), jt(e, dt, bt), Nt(e);
        }, Qt = (e, t, n, r)=>{
            let i, a, o = 0;
            e.level > 0 ? (e.strm.data_type === Qe && (e.strm.data_type = qt(e)), Ht(e, e.l_desc), Ht(e, e.d_desc), o = Gt(e), i = e.opt_len + 3 + 7 >>> 3, a = e.static_len + 3 + 7 >>> 3, a <= i && (i = a)) : i = a = n + 5, n + 4 <= i && t !== -1 ? Xt(e, t, n, r) : e.strategy === Ye || a === i ? (A(e, (et << 1) + +!!r, 3), Vt(e, bt, xt)) : (A(e, (tt << 1) + +!!r, 3), Kt(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), Vt(e, e.dyn_ltree, e.dyn_dtree)), Lt(e), r && Rt(e);
        }, $t = (e, t, n)=>(e.pending_buf[e.sym_buf + e.sym_next++] = t, e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = n, t === 0 ? e.dyn_ltree[n * 2]++ : (e.matches++, t--, e.dyn_ltree[(Ct[n] + rt + 1) * 2]++, e.dyn_dtree[kt(t) * 2]++), e.sym_next === e.sym_end), en = {
            _tr_init: Yt,
            _tr_stored_block: Xt,
            _tr_flush_block: Qt,
            _tr_tally: $t,
            _tr_align: Zt
        }, tn = (e, t, n, r)=>{
            let i = e & 65535 | 0, a = e >>> 16 & 65535 | 0, o = 0;
            for(; n !== 0;){
                o = n > 2e3 ? 2e3 : n, n -= o;
                do i = i + t[r++] | 0, a = a + i | 0;
                while (--o);
                i %= 65521, a %= 65521;
            }
            return i | a << 16 | 0;
        }, nn = tn, rn = ()=>{
            let e, t = [];
            for(var n = 0; n < 256; n++){
                e = n;
                for(var r = 0; r < 8; r++)e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
                t[n] = e;
            }
            return t;
        }, an = new Uint32Array(rn()), on = (e, t, n, r)=>{
            let i = an, a = r + n;
            e ^= -1;
            for(let n = r; n < a; n++)e = e >>> 8 ^ i[(e ^ t[n]) & 255];
            return e ^ -1;
        }, j = on, sn = {
            2: `need dictionary`,
            1: `stream end`,
            0: ``,
            "-1": `file error`,
            "-2": `stream error`,
            "-3": `data error`,
            "-4": `insufficient memory`,
            "-5": `buffer error`,
            "-6": `incompatible version`
        }, cn = {
            Z_NO_FLUSH: 0,
            Z_PARTIAL_FLUSH: 1,
            Z_SYNC_FLUSH: 2,
            Z_FULL_FLUSH: 3,
            Z_FINISH: 4,
            Z_BLOCK: 5,
            Z_TREES: 6,
            Z_OK: 0,
            Z_STREAM_END: 1,
            Z_NEED_DICT: 2,
            Z_ERRNO: -1,
            Z_STREAM_ERROR: -2,
            Z_DATA_ERROR: -3,
            Z_MEM_ERROR: -4,
            Z_BUF_ERROR: -5,
            Z_NO_COMPRESSION: 0,
            Z_BEST_SPEED: 1,
            Z_BEST_COMPRESSION: 9,
            Z_DEFAULT_COMPRESSION: -1,
            Z_FILTERED: 1,
            Z_HUFFMAN_ONLY: 2,
            Z_RLE: 3,
            Z_FIXED: 4,
            Z_DEFAULT_STRATEGY: 0,
            Z_BINARY: 0,
            Z_TEXT: 1,
            Z_UNKNOWN: 2,
            Z_DEFLATED: 8
        }, { _tr_init: ln, _tr_stored_block: un, _tr_flush_block: dn, _tr_tally: fn, _tr_align: pn } = en, { Z_NO_FLUSH: mn, Z_PARTIAL_FLUSH: hn, Z_FULL_FLUSH: gn, Z_FINISH: _n, Z_BLOCK: vn, Z_OK: M, Z_STREAM_END: yn, Z_STREAM_ERROR: bn, Z_DATA_ERROR: xn, Z_BUF_ERROR: Sn, Z_DEFAULT_COMPRESSION: Cn, Z_FILTERED: wn, Z_HUFFMAN_ONLY: Tn, Z_RLE: En, Z_FIXED: Dn, Z_DEFAULT_STRATEGY: On, Z_UNKNOWN: kn, Z_DEFLATED: An } = cn, jn = 9, Mn = 15, Nn = 8, Pn = 573, N = 3, Fn = 258, In = 262, Ln = 32, Rn = 42, zn = 57, Bn = 69, Vn = 73, Hn = 91, Un = 103, Wn = 113, Gn = 666, P = 1, Kn = 2, qn = 3, Jn = 4, Yn = 3, Xn = (e, t)=>(e.msg = sn[t], t), Zn = (e)=>e * 2 - (e > 4 ? 9 : 0), Qn = (e)=>{
            let t = e.length;
            for(; --t >= 0;)e[t] = 0;
        }, $n = (e)=>{
            let t, n, r, i = e.w_size;
            t = e.hash_size, r = t;
            do n = e.head[--r], e.head[r] = n >= i ? n - i : 0;
            while (--t);
            t = i, r = t;
            do n = e.prev[--r], e.prev[r] = n >= i ? n - i : 0;
            while (--t);
        }, er = (e, t, n)=>(t << e.hash_shift ^ n) & e.hash_mask, tr = (e, t)=>{
            let n;
            if (e.legacy_hash) n = e.ins_h = er(e, e.ins_h, e.window[t + N - 1]);
            else {
                let r = e.window, i = r[t] | r[t + 1] << 8 | r[t + 2] << 16 | r[t + 3] << 24;
                n = e.ins_h = Math.imul(i, 66521) + 66521 >>> 16 & e.hash_mask;
            }
            let r = e.prev[t & e.w_mask] = e.head[n];
            return e.head[n] = t, r;
        }, F = (e)=>{
            let t = e.state, n = t.pending;
            n > e.avail_out && (n = e.avail_out), n !== 0 && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
        }, nr = (e, t)=>{
            dn(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, F(e.strm);
        }, I = (e, t)=>{
            e.pending_buf[e.pending++] = t;
        }, rr = (e, t)=>{
            e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = t & 255;
        }, ir = (e, t, n, r)=>{
            let i = e.avail_in;
            return i > r && (i = r), i === 0 ? 0 : (e.avail_in -= i, t.set(e.input.subarray(e.next_in, e.next_in + i), n), e.state.wrap === 1 ? e.adler = nn(e.adler, t, i, n) : e.state.wrap === 2 && (e.adler = j(e.adler, t, i, n)), e.next_in += i, e.total_in += i, i);
        }, ar = (e, t)=>{
            let n = e.max_chain_length, r = e.strstart, i, a, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - In ? e.strstart - (e.w_size - In) : 0, l = e.window, u = e.w_mask, d = e.prev, f = e.strstart + Fn, p = l[r + o - 1], m = l[r + o];
            e.prev_length >= e.good_match && (n >>= 2), s > e.lookahead && (s = e.lookahead);
            do {
                if (i = t, l[i + o] !== m || l[i + o - 1] !== p || l[i] !== l[r] || l[++i] !== l[r + 1]) continue;
                r += 2, i++;
                do ;
                while (l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && r < f);
                if (a = Fn - (f - r), r = f - Fn, a > o) {
                    if (e.match_start = t, o = a, a >= s) break;
                    p = l[r + o - 1], m = l[r + o];
                }
            }while ((t = d[t & u]) > c && --n !== 0);
            return o <= e.lookahead ? o : e.lookahead;
        }, or = (e)=>{
            let t = e.w_size, n, r, i;
            do {
                if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - In) && (e.window.set(e.window.subarray(t, t + t - r), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, e.insert > e.strstart && (e.insert = e.strstart), $n(e), r += t), e.strm.avail_in === 0) break;
                if (n = ir(e.strm, e.window, e.strstart + e.lookahead, r), e.lookahead += n, !e.legacy_hash) {
                    if (e.lookahead + e.insert > N) for(i = e.strstart - e.insert; e.insert && (tr(e, i), i++, e.insert--, !(e.lookahead + e.insert <= N)););
                } else if (e.lookahead + e.insert >= N) for(i = e.strstart - e.insert, e.ins_h = e.window[i], e.ins_h = er(e, e.ins_h, e.window[i + 1]); e.insert && (tr(e, i), i++, e.insert--, !(e.lookahead + e.insert < N)););
            }while (e.lookahead < In && e.strm.avail_in !== 0);
        }, sr = (e, t)=>{
            let n = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, r, i, a, o = 0, s = e.strm.avail_in;
            do {
                if (r = 65535, a = e.bi_valid + 42 >> 3, e.strm.avail_out < a || (a = e.strm.avail_out - a, i = e.strstart - e.block_start, r > i + e.strm.avail_in && (r = i + e.strm.avail_in), r > a && (r = a), r < n && (r === 0 && t !== _n || t === mn || r !== i + e.strm.avail_in))) break;
                o = +(t === _n && r === i + e.strm.avail_in), un(e, 0, 0, o), e.pending_buf[e.pending - 4] = r, e.pending_buf[e.pending - 3] = r >> 8, e.pending_buf[e.pending - 2] = ~r, e.pending_buf[e.pending - 1] = ~r >> 8, F(e.strm), i && (i > r && (i = r), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + i), e.strm.next_out), e.strm.next_out += i, e.strm.avail_out -= i, e.strm.total_out += i, e.block_start += i, r -= i), r && (ir(e.strm, e.strm.output, e.strm.next_out, r), e.strm.next_out += r, e.strm.avail_out -= r, e.strm.total_out += r);
            }while (o === 0);
            return s -= e.strm.avail_in, s && (s >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= s && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - s, e.strm.next_in), e.strstart), e.strstart += s, e.insert += s > e.w_size - e.insert ? e.w_size - e.insert : s), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), o ? Jn : t !== mn && t !== _n && e.strm.avail_in === 0 && e.strstart === e.block_start ? Kn : (a = e.window_size - e.strstart, e.strm.avail_in > a && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, a += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), a > e.strm.avail_in && (a = e.strm.avail_in), a && (ir(e.strm, e.window, e.strstart, a), e.strstart += a, e.insert += a > e.w_size - e.insert ? e.w_size - e.insert : a), e.high_water < e.strstart && (e.high_water = e.strstart), a = e.bi_valid + 42 >> 3, a = e.pending_buf_size - a > 65535 ? 65535 : e.pending_buf_size - a, n = a > e.w_size ? e.w_size : a, i = e.strstart - e.block_start, (i >= n || (i || t === _n) && t !== mn && e.strm.avail_in === 0 && i <= a) && (r = i > a ? a : i, o = +(t === _n && e.strm.avail_in === 0 && r === i), un(e, e.block_start, r, o), e.block_start += r, F(e.strm)), o ? qn : P);
        }, cr = (e, t)=>{
            let n, r;
            for(;;){
                if (e.lookahead < In) {
                    if (or(e), e.lookahead < In && t === mn) return P;
                    if (e.lookahead === 0) break;
                }
                if (n = 0, e.lookahead >= N && (n = tr(e, e.strstart)), n !== 0 && e.strstart - n <= e.w_size - In && (e.match_length = ar(e, n)), e.match_length >= N) if (r = fn(e, e.strstart - e.match_start, e.match_length - N), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= N) {
                    e.match_length--;
                    do e.strstart++, n = tr(e, e.strstart);
                    while (--e.match_length !== 0);
                    e.strstart++;
                } else e.strstart += e.match_length, e.match_length = 0, e.legacy_hash && (e.ins_h = e.window[e.strstart], e.ins_h = er(e, e.ins_h, e.window[e.strstart + 1]));
                else r = fn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
                if (r && (nr(e, !1), e.strm.avail_out === 0)) return P;
            }
            return e.insert = e.strstart < N - 1 ? e.strstart : N - 1, t === _n ? (nr(e, !0), e.strm.avail_out === 0 ? qn : Jn) : e.sym_next && (nr(e, !1), e.strm.avail_out === 0) ? P : Kn;
        }, lr = (e, t)=>{
            let n, r, i;
            for(;;){
                if (e.lookahead < In) {
                    if (or(e), e.lookahead < In && t === mn) return P;
                    if (e.lookahead === 0) break;
                }
                if (n = 0, e.lookahead >= N && (n = tr(e, e.strstart)), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = N - 1, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - In && (e.match_length = ar(e, n), e.match_length <= 5 && (e.strategy === wn || e.match_length === N && e.strstart - e.match_start > 4096) && (e.match_length = N - 1)), e.prev_length >= N && e.match_length <= e.prev_length) {
                    i = e.strstart + e.lookahead - N, r = fn(e, e.strstart - 1 - e.prev_match, e.prev_length - N), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
                    do ++e.strstart <= i && (n = tr(e, e.strstart));
                    while (--e.prev_length !== 0);
                    if (e.match_available = 0, e.match_length = N - 1, e.strstart++, r && (nr(e, !1), e.strm.avail_out === 0)) return P;
                } else if (e.match_available) {
                    if (r = fn(e, 0, e.window[e.strstart - 1]), r && nr(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return P;
                } else e.match_available = 1, e.strstart++, e.lookahead--;
            }
            return e.match_available &&= (r = fn(e, 0, e.window[e.strstart - 1]), 0), e.insert = e.strstart < N - 1 ? e.strstart : N - 1, t === _n ? (nr(e, !0), e.strm.avail_out === 0 ? qn : Jn) : e.sym_next && (nr(e, !1), e.strm.avail_out === 0) ? P : Kn;
        }, ur = (e, t)=>{
            let n, r, i, a, o = e.window;
            for(;;){
                if (e.lookahead <= Fn) {
                    if (or(e), e.lookahead <= Fn && t === mn) return P;
                    if (e.lookahead === 0) break;
                }
                if (e.match_length = 0, e.lookahead >= N && e.strstart > 0 && (i = e.strstart - 1, r = o[i], r === o[++i] && r === o[++i] && r === o[++i])) {
                    a = e.strstart + Fn;
                    do ;
                    while (r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && i < a);
                    e.match_length = Fn - (a - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
                }
                if (e.match_length >= N ? (n = fn(e, 1, e.match_length - N), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = fn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (nr(e, !1), e.strm.avail_out === 0)) return P;
            }
            return e.insert = 0, t === _n ? (nr(e, !0), e.strm.avail_out === 0 ? qn : Jn) : e.sym_next && (nr(e, !1), e.strm.avail_out === 0) ? P : Kn;
        }, dr = (e, t)=>{
            let n;
            for(;;){
                if (e.lookahead === 0 && (or(e), e.lookahead === 0)) {
                    if (t === mn) return P;
                    break;
                }
                if (e.match_length = 0, n = fn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (nr(e, !1), e.strm.avail_out === 0)) return P;
            }
            return e.insert = 0, t === _n ? (nr(e, !0), e.strm.avail_out === 0 ? qn : Jn) : e.sym_next && (nr(e, !1), e.strm.avail_out === 0) ? P : Kn;
        }, fr = [
            new Le(0, 0, 0, 0, sr),
            new Le(4, 4, 8, 4, cr),
            new Le(4, 5, 16, 8, cr),
            new Le(4, 6, 32, 32, cr),
            new Le(4, 4, 16, 16, lr),
            new Le(8, 16, 32, 32, lr),
            new Le(8, 16, 128, 128, lr),
            new Le(8, 32, 128, 256, lr),
            new Le(32, 128, 258, 1024, lr),
            new Le(32, 258, 258, 4096, lr)
        ], pr = (e)=>{
            e.window_size = 2 * e.w_size, Qn(e.head), e.max_lazy_match = fr[e.level].max_lazy, e.good_match = fr[e.level].good_length, e.nice_match = fr[e.level].nice_length, e.max_chain_length = fr[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = N - 1, e.match_available = 0, e.ins_h = 0;
        }, mr = (e)=>{
            if (!e) return 1;
            let t = e.state;
            return +(!t || t.strm !== e || t.status !== Rn && t.status !== zn && t.status !== Bn && t.status !== Vn && t.status !== Hn && t.status !== Un && t.status !== Wn && t.status !== Gn);
        }, hr = (e)=>{
            if (mr(e)) return Xn(e, bn);
            e.total_in = e.total_out = 0, e.data_type = kn;
            let t = e.state;
            return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap === 2 ? zn : t.wrap ? Rn : Wn, e.adler = t.wrap === 2 ? 0 : 1, t.last_flush = -2, ln(t), M;
        }, gr = (e)=>{
            let t = hr(e);
            return t === M && pr(e.state), t;
        }, _r = (e, t)=>mr(e) || e.state.wrap !== 2 ? bn : (e.state.gzhead = t, M), vr = (e, t, n, r, i, a, o)=>{
            if (!e) return bn;
            let s = 1;
            if (t === Cn && (t = 6), r < 0 ? (s = 0, r = -r) : r > 15 && (s = 2, r -= 16), i < 1 || i > jn || n !== An || r < 8 || r > 15 || t < 0 || t > 9 || a < 0 || a > Dn || r === 8 && s !== 1) return Xn(e, bn);
            r === 8 && (r = 9);
            let c = new Re;
            return e.state = c, c.strm = e, c.status = Rn, c.wrap = s, c.gzhead = null, c.w_bits = r, c.w_size = 1 << c.w_bits, c.w_mask = c.w_size - 1, c.legacy_hash = +!!o, c.hash_bits = i + 7, !c.legacy_hash && c.hash_bits < 15 && (c.hash_bits = 15), c.hash_size = 1 << c.hash_bits, c.hash_mask = c.hash_size - 1, c.hash_shift = ~~((c.hash_bits + N - 1) / N), c.window = new Uint8Array(c.w_size * 2), c.head = new Uint16Array(c.hash_size), c.prev = new Uint16Array(c.w_size), c.lit_bufsize = 1 << i + 6, c.pending_buf_size = c.lit_bufsize * 4, c.pending_buf = new Uint8Array(c.pending_buf_size), c.sym_buf = c.lit_bufsize, c.sym_end = (c.lit_bufsize - 1) * 3, c.level = t, c.strategy = a, c.method = n, gr(e);
        }, yr = (e, t)=>vr(e, t, An, Mn, Nn, On), br = (e, t)=>{
            if (mr(e) || t > vn || t < 0) return e ? Xn(e, bn) : bn;
            let n = e.state;
            if (!e.output || e.avail_in !== 0 && !e.input || n.status === Gn && t !== _n) return Xn(e, e.avail_out === 0 ? Sn : bn);
            let r = n.last_flush;
            if (n.last_flush = t, n.pending !== 0) {
                if (F(e), e.avail_out === 0) return n.last_flush = -1, M;
            } else if (e.avail_in === 0 && Zn(t) <= Zn(r) && t !== _n) return Xn(e, Sn);
            if (n.status === Gn && e.avail_in !== 0) return Xn(e, Sn);
            if (n.status === Rn && n.wrap === 0 && (n.status = Wn), n.status === Rn) {
                let t = An + (n.w_bits - 8 << 4) << 8, r = -1;
                if (r = n.strategy >= Tn || n.level < 2 ? 0 : n.level < 6 ? 1 : n.level === 6 ? 2 : 3, t |= r << 6, n.strstart !== 0 && (t |= Ln), t += 31 - t % 31, rr(n, t), n.strstart !== 0 && (rr(n, e.adler >>> 16), rr(n, e.adler & 65535)), e.adler = 1, n.status = Wn, F(e), n.pending !== 0) return n.last_flush = -1, M;
            }
            if (n.status === zn) {
                if (e.adler = 0, I(n, 31), I(n, 139), I(n, 8), n.gzhead) I(n, +!!n.gzhead.text + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), I(n, n.gzhead.time & 255), I(n, n.gzhead.time >> 8 & 255), I(n, n.gzhead.time >> 16 & 255), I(n, n.gzhead.time >> 24 & 255), I(n, n.level === 9 ? 2 : n.strategy >= Tn || n.level < 2 ? 4 : 0), I(n, n.gzhead.os & 255), n.gzhead.extra && n.gzhead.extra.length && (I(n, n.gzhead.extra.length & 255), I(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = j(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = Bn;
                else if (I(n, 0), I(n, 0), I(n, 0), I(n, 0), I(n, 0), I(n, n.level === 9 ? 2 : n.strategy >= Tn || n.level < 2 ? 4 : 0), I(n, Yn), n.status = Wn, F(e), n.pending !== 0) return n.last_flush = -1, M;
            }
            if (n.status === Bn) {
                if (n.gzhead.extra) {
                    let t = n.pending, r = (n.gzhead.extra.length & 65535) - n.gzindex;
                    for(; n.pending + r > n.pending_buf_size;){
                        let i = n.pending_buf_size - n.pending;
                        if (n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex, n.gzindex + i), n.pending), n.pending = n.pending_buf_size, n.gzhead.hcrc && n.pending > t && (e.adler = j(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex += i, F(e), n.pending !== 0) return n.last_flush = -1, M;
                        t = 0, r -= i;
                    }
                    let i = new Uint8Array(n.gzhead.extra);
                    n.pending_buf.set(i.subarray(n.gzindex, n.gzindex + r), n.pending), n.pending += r, n.gzhead.hcrc && n.pending > t && (e.adler = j(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0;
                }
                n.status = Vn;
            }
            if (n.status === Vn) {
                if (n.gzhead.name) {
                    let t = n.pending, r;
                    do {
                        if (n.pending === n.pending_buf_size) {
                            if (n.gzhead.hcrc && n.pending > t && (e.adler = j(e.adler, n.pending_buf, n.pending - t, t)), F(e), n.pending !== 0) return n.last_flush = -1, M;
                            t = 0;
                        }
                        r = n.gzindex < n.gzhead.name.length ? n.gzhead.name.charCodeAt(n.gzindex++) & 255 : 0, I(n, r);
                    }while (r !== 0);
                    n.gzhead.hcrc && n.pending > t && (e.adler = j(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0;
                }
                n.status = Hn;
            }
            if (n.status === Hn) {
                if (n.gzhead.comment) {
                    let t = n.pending, r;
                    do {
                        if (n.pending === n.pending_buf_size) {
                            if (n.gzhead.hcrc && n.pending > t && (e.adler = j(e.adler, n.pending_buf, n.pending - t, t)), F(e), n.pending !== 0) return n.last_flush = -1, M;
                            t = 0;
                        }
                        r = n.gzindex < n.gzhead.comment.length ? n.gzhead.comment.charCodeAt(n.gzindex++) & 255 : 0, I(n, r);
                    }while (r !== 0);
                    n.gzhead.hcrc && n.pending > t && (e.adler = j(e.adler, n.pending_buf, n.pending - t, t));
                }
                n.status = Un;
            }
            if (n.status === Un) {
                if (n.gzhead.hcrc) {
                    if (n.pending + 2 > n.pending_buf_size && (F(e), n.pending !== 0)) return n.last_flush = -1, M;
                    I(n, e.adler & 255), I(n, e.adler >> 8 & 255), e.adler = 0;
                }
                if (n.status = Wn, F(e), n.pending !== 0) return n.last_flush = -1, M;
            }
            if (e.avail_in !== 0 || n.lookahead !== 0 || t !== mn && n.status !== Gn) {
                let r = n.level === 0 ? sr(n, t) : n.strategy === Tn ? dr(n, t) : n.strategy === En ? ur(n, t) : fr[n.level].func(n, t);
                if ((r === qn || r === Jn) && (n.status = Gn), r === P || r === qn) return e.avail_out === 0 && (n.last_flush = -1), M;
                if (r === Kn && (t === hn ? pn(n) : t !== vn && (un(n, 0, 0, !1), t === gn && (Qn(n.head), n.lookahead === 0 && (n.strstart = 0, n.block_start = 0, n.insert = 0))), F(e), e.avail_out === 0)) return n.last_flush = -1, M;
            }
            return t === _n ? n.wrap <= 0 ? yn : (n.wrap === 2 ? (I(n, e.adler & 255), I(n, e.adler >> 8 & 255), I(n, e.adler >> 16 & 255), I(n, e.adler >> 24 & 255), I(n, e.total_in & 255), I(n, e.total_in >> 8 & 255), I(n, e.total_in >> 16 & 255), I(n, e.total_in >> 24 & 255)) : (rr(n, e.adler >>> 16), rr(n, e.adler & 65535)), F(e), n.wrap > 0 && (n.wrap = -n.wrap), n.pending === 0 ? yn : M) : M;
        }, xr = (e)=>{
            if (mr(e)) return bn;
            let t = e.state.status;
            return e.state = null, t === Wn ? Xn(e, xn) : M;
        }, Sr = (e, t)=>{
            let n = t.length;
            if (mr(e)) return bn;
            let r = e.state, i = r.wrap;
            if (i === 2 || i === 1 && r.status !== Rn || r.lookahead) return bn;
            if (i === 1 && (e.adler = nn(e.adler, t, n, 0)), r.wrap = 0, n >= r.w_size) {
                i === 0 && (Qn(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0);
                let e = new Uint8Array(r.w_size);
                e.set(t.subarray(n - r.w_size, n), 0), t = e, n = r.w_size;
            }
            let a = e.avail_in, o = e.next_in, s = e.input;
            for(e.avail_in = n, e.next_in = 0, e.input = t, or(r); r.lookahead >= N;){
                let e = r.strstart, t = r.lookahead - (N - 1);
                do tr(r, e), e++;
                while (--t);
                r.strstart = e, r.lookahead = N - 1, or(r);
            }
            return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = N - 1, r.match_available = 0, e.next_in = o, e.input = s, e.avail_in = a, r.wrap = i, M;
        }, Cr = {
            deflateInit: yr,
            deflateInit2: vr,
            deflateReset: gr,
            deflateResetKeep: hr,
            deflateSetHeader: _r,
            deflate: br,
            deflateEnd: xr,
            deflateSetDictionary: Sr,
            deflateInfo: `pako deflate (from Nodeca project)`
        }, wr = (e, t)=>Object.prototype.hasOwnProperty.call(e, t), Tr = function(e) {
            let t = Array.prototype.slice.call(arguments, 1);
            for(; t.length;){
                let n = t.shift();
                if (n) {
                    if (typeof n != `object`) throw TypeError(n + `must be non-object`);
                    for(let t in n)wr(n, t) && (e[t] = n[t]);
                }
            }
            return e;
        }, Er = (e)=>{
            let t = 0;
            for(let n = 0, r = e.length; n < r; n++)t += e[n].length;
            let n = new Uint8Array(t);
            for(let t = 0, r = 0, i = e.length; t < i; t++){
                let i = e[t];
                n.set(i, r), r += i.length;
            }
            return n;
        }, Dr = {
            assign: Tr,
            flattenChunks: Er
        }, Or = !0;
        try {
            String.fromCharCode.apply(null, new Uint8Array(1));
        } catch  {
            Or = !1;
        }
        kr = new Uint8Array(256);
        for(let e = 0; e < 256; e++)kr[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
        kr[254] = kr[255] = 1, Ar = (e)=>{
            if (typeof TextEncoder == `function` && TextEncoder.prototype.encode) return new TextEncoder().encode(e);
            let t, n, r, i, a, o = e.length, s = 0;
            for(i = 0; i < o; i++)n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), s += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
            for(t = new Uint8Array(s), a = 0, i = 0; a < s; i++)n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), n < 128 ? t[a++] = n : n < 2048 ? (t[a++] = 192 | n >>> 6, t[a++] = 128 | n & 63) : n < 65536 ? (t[a++] = 224 | n >>> 12, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63) : (t[a++] = 240 | n >>> 18, t[a++] = 128 | n >>> 12 & 63, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63);
            return t;
        }, jr = (e, t)=>{
            if (t < 65534 && e.subarray && Or) return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
            let n = ``;
            for(let r = 0; r < t; r++)n += String.fromCharCode(e[r]);
            return n;
        }, Mr = (e, t)=>{
            let n = t || e.length;
            if (typeof TextDecoder == `function` && TextDecoder.prototype.decode) return new TextDecoder().decode(e.subarray(0, t));
            let r, i, a = Array(n * 2);
            for(i = 0, r = 0; r < n;){
                let t = e[r++];
                if (t < 128) {
                    a[i++] = t;
                    continue;
                }
                let o = kr[t];
                if (o > 4) {
                    a[i++] = 65533, r += o - 1;
                    continue;
                }
                for(t &= o === 2 ? 31 : o === 3 ? 15 : 7; o > 1 && r < n;)t = t << 6 | e[r++] & 63, o--;
                if (o > 1) {
                    a[i++] = 65533;
                    continue;
                }
                t < 65536 ? a[i++] = t : (t -= 65536, a[i++] = 55296 | t >> 10 & 1023, a[i++] = 56320 | t & 1023);
            }
            return jr(a, i);
        }, Nr = (e, t)=>{
            t ||= e.length, t > e.length && (t = e.length);
            let n = t - 1;
            for(; n >= 0 && (e[n] & 192) == 128;)n--;
            return n < 0 || n === 0 ? t : n + kr[e[n]] > t ? n : t;
        }, Pr = {
            string2buf: Ar,
            buf2string: Mr,
            utf8border: Nr
        }, Fr = ze, Ir = Object.prototype.toString, { Z_NO_FLUSH: Lr, Z_SYNC_FLUSH: Rr, Z_FULL_FLUSH: zr, Z_FINISH: Br, Z_OK: Vr, Z_STREAM_END: Hr, Z_DEFAULT_COMPRESSION: Ur, Z_DEFAULT_STRATEGY: Wr, Z_DEFLATED: Gr } = cn, Kr = {
            level: Ur,
            method: Gr,
            chunkSize: 16384,
            windowBits: 15,
            memLevel: 8,
            strategy: Wr,
            legacyHash: !0
        }, Be.prototype.push = function(e, t) {
            let n = this.strm, r = this.options.chunkSize, i, a;
            if (this.ended) return !1;
            for(a = t === ~~t ? t : t === !0 ? Br : Lr, typeof e == `string` ? n.input = Pr.string2buf(e) : Ir.call(e) === `[object ArrayBuffer]` ? n.input = new Uint8Array(e) : n.input = e, n.next_in = 0, n.avail_in = n.input.length;;){
                if (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), (a === Rr || a === zr) && n.avail_out <= 6) {
                    this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
                    continue;
                }
                if (i = Cr.deflate(n, a), i === Hr) return n.next_out > 0 && this.onData(n.output.subarray(0, n.next_out)), i = Cr.deflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === Vr;
                if (n.avail_out === 0) {
                    this.onData(n.output);
                    continue;
                }
                if (a > 0 && n.next_out > 0) {
                    this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
                    continue;
                }
                if (n.avail_in === 0) break;
            }
            return !0;
        }, Be.prototype.onData = function(e) {
            this.chunks.push(e);
        }, Be.prototype.onEnd = function(e) {
            e === Vr && (this.result = Dr.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
        }, qr = {
            Deflate: Be,
            deflate: Ve,
            deflateRaw: He,
            gzip: Ue,
            constants: cn
        }, Jr = 16209, Yr = 16191, Xr = function(e, t) {
            let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, E = e.state;
            n = e.next_in, w = e.input, r = n + (e.avail_in - 5), i = e.next_out, T = e.output, a = i - (t - e.avail_out), o = i + (e.avail_out - 257), s = E.dmax, c = E.wsize, l = E.whave, u = E.wnext, d = E.window, f = E.hold, p = E.bits, m = E.lencode, h = E.distcode, g = (1 << E.lenbits) - 1, _ = (1 << E.distbits) - 1;
            top: do {
                p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = m[f & g];
                dolen: for(;;){
                    if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y === 0) T[i++] = v & 65535;
                    else if (y & 16) {
                        b = v & 65535, y &= 15, y && (p < y && (f += w[n++] << p, p += 8), b += f & (1 << y) - 1, f >>>= y, p -= y), p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = h[f & _];
                        dodist: for(;;){
                            if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y & 16) {
                                if (x = v & 65535, y &= 15, p < y && (f += w[n++] << p, p += 8, p < y && (f += w[n++] << p, p += 8)), x += f & (1 << y) - 1, x > s) {
                                    e.msg = `invalid distance too far back`, E.mode = Jr;
                                    break top;
                                }
                                if (f >>>= y, p -= y, y = i - a, x > y) {
                                    if (y = x - y, y > l && E.sane) {
                                        e.msg = `invalid distance too far back`, E.mode = Jr;
                                        break top;
                                    }
                                    if (S = 0, C = d, u === 0) {
                                        if (S += c - y, y < b) {
                                            b -= y;
                                            do T[i++] = d[S++];
                                            while (--y);
                                            S = i - x, C = T;
                                        }
                                    } else if (u < y) {
                                        if (S += c + u - y, y -= u, y < b) {
                                            b -= y;
                                            do T[i++] = d[S++];
                                            while (--y);
                                            if (S = 0, u < b) {
                                                y = u, b -= y;
                                                do T[i++] = d[S++];
                                                while (--y);
                                                S = i - x, C = T;
                                            }
                                        }
                                    } else if (S += u - y, y < b) {
                                        b -= y;
                                        do T[i++] = d[S++];
                                        while (--y);
                                        S = i - x, C = T;
                                    }
                                    for(; b > 2;)T[i++] = C[S++], T[i++] = C[S++], T[i++] = C[S++], b -= 3;
                                    b && (T[i++] = C[S++], b > 1 && (T[i++] = C[S++]));
                                } else {
                                    S = i - x;
                                    do T[i++] = T[S++], T[i++] = T[S++], T[i++] = T[S++], b -= 3;
                                    while (b > 2);
                                    b && (T[i++] = T[S++], b > 1 && (T[i++] = T[S++]));
                                }
                            } else if (y & 64) {
                                e.msg = `invalid distance code`, E.mode = Jr;
                                break top;
                            } else {
                                v = h[(v & 65535) + (f & (1 << y) - 1)];
                                continue dodist;
                            }
                            break;
                        }
                    } else if (!(y & 64)) {
                        v = m[(v & 65535) + (f & (1 << y) - 1)];
                        continue dolen;
                    } else if (y & 32) {
                        E.mode = Yr;
                        break top;
                    } else {
                        e.msg = `invalid literal/length code`, E.mode = Jr;
                        break top;
                    }
                    break;
                }
            }while (n < r && i < o);
            b = p >> 3, n -= b, p -= b << 3, f &= (1 << p) - 1, e.next_in = n, e.next_out = i, e.avail_in = n < r ? 5 + (r - n) : 5 - (n - r), e.avail_out = i < o ? 257 + (o - i) : 257 - (i - o), E.hold = f, E.bits = p;
        }, Zr = 15, Qr = 852, $r = 592, ei = 0, ti = 1, ni = 2, ri = new Uint16Array([
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            13,
            15,
            17,
            19,
            23,
            27,
            31,
            35,
            43,
            51,
            59,
            67,
            83,
            99,
            115,
            131,
            163,
            195,
            227,
            258,
            0,
            0
        ]), ii = new Uint8Array([
            16,
            16,
            16,
            16,
            16,
            16,
            16,
            16,
            17,
            17,
            17,
            17,
            18,
            18,
            18,
            18,
            19,
            19,
            19,
            19,
            20,
            20,
            20,
            20,
            21,
            21,
            21,
            21,
            16,
            199,
            75
        ]), ai = new Uint16Array([
            1,
            2,
            3,
            4,
            5,
            7,
            9,
            13,
            17,
            25,
            33,
            49,
            65,
            97,
            129,
            193,
            257,
            385,
            513,
            769,
            1025,
            1537,
            2049,
            3073,
            4097,
            6145,
            8193,
            12289,
            16385,
            24577,
            0,
            0
        ]), oi = new Uint8Array([
            16,
            16,
            16,
            16,
            17,
            17,
            18,
            18,
            19,
            19,
            20,
            20,
            21,
            21,
            22,
            22,
            23,
            23,
            24,
            24,
            25,
            25,
            26,
            26,
            27,
            27,
            28,
            28,
            29,
            29,
            64,
            64
        ]), si = (e, t, n, r, i, a, o, s)=>{
            let c = s.bits, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y, b, x, S, C, w = null, T, E = new Uint16Array(16), D = new Uint16Array(16), ee = null, te, ne, re;
            for(l = 0; l <= Zr; l++)E[l] = 0;
            for(u = 0; u < r; u++)E[t[n + u]]++;
            for(p = c, f = Zr; f >= 1 && E[f] === 0; f--);
            if (p > f && (p = f), f === 0) return i[a++] = 20971520, i[a++] = 20971520, s.bits = 1, 0;
            for(d = 1; d < f && E[d] === 0; d++);
            for(p < d && (p = d), g = 1, l = 1; l <= Zr; l++)if (g <<= 1, g -= E[l], g < 0) return -1;
            if (g > 0 && (e === ei || f !== 1)) return -1;
            for(D[1] = 0, l = 1; l < Zr; l++)D[l + 1] = D[l] + E[l];
            for(u = 0; u < r; u++)t[n + u] !== 0 && (o[D[t[n + u]]++] = u);
            if (e === ei ? (w = ee = o, T = 20) : e === ti ? (w = ri, ee = ii, T = 257) : (w = ai, ee = oi, T = 0), v = 0, u = 0, l = d, C = a, m = p, h = 0, x = -1, _ = 1 << p, S = _ - 1, e === ti && _ > Qr || e === ni && _ > $r) return 1;
            for(;;){
                te = l - h, o[u] + 1 < T ? (ne = 0, re = o[u]) : o[u] >= T ? (ne = ee[o[u] - T], re = w[o[u] - T]) : (ne = 96, re = 0), y = 1 << l - h, b = 1 << m, d = b;
                do b -= y, i[C + (v >> h) + b] = te << 24 | ne << 16 | re | 0;
                while (b !== 0);
                for(y = 1 << l - 1; v & y;)y >>= 1;
                if (y === 0 ? v = 0 : (v &= y - 1, v += y), u++, --E[l] === 0) {
                    if (l === f) break;
                    l = t[n + o[u]];
                }
                if (l > p && (v & S) !== x) {
                    for(h === 0 && (h = p), C += d, m = l - h, g = 1 << m; m + h < f && (g -= E[m + h], !(g <= 0));)m++, g <<= 1;
                    if (_ += 1 << m, e === ti && _ > Qr || e === ni && _ > $r) return 1;
                    x = v & S, i[x] = p << 24 | m << 16 | C - a | 0;
                }
            }
            return v !== 0 && (i[C + v] = l - h << 24 | 4194304), s.bits = p, 0;
        }, ci = si, li = 0, ui = 1, di = 2, { Z_FINISH: fi, Z_BLOCK: pi, Z_TREES: mi, Z_OK: hi, Z_STREAM_END: gi, Z_NEED_DICT: _i, Z_STREAM_ERROR: vi, Z_DATA_ERROR: yi, Z_MEM_ERROR: bi, Z_BUF_ERROR: xi, Z_DEFLATED: Si } = cn, Ci = 16180, wi = 16181, Ti = 16182, Ei = 16183, Di = 16184, Oi = 16185, ki = 16186, Ai = 16187, ji = 16188, Mi = 16189, Ni = 16190, Pi = 16191, Fi = 16192, Ii = 16193, Li = 16194, Ri = 16195, zi = 16196, Bi = 16197, Vi = 16198, Hi = 16199, Ui = 16200, Wi = 16201, Gi = 16202, Ki = 16203, qi = 16204, Ji = 16205, Yi = 16206, Xi = 16207, Zi = 16208, L = 16209, Qi = 16210, $i = 16211, ea = 852, ta = 592, na = 15, ra = (e)=>(e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24), ia = (e)=>{
            if (!e) return 1;
            let t = e.state;
            return +(!t || t.strm !== e || t.mode < Ci || t.mode > $i);
        }, aa = (e)=>{
            if (ia(e)) return vi;
            let t = e.state;
            return e.total_in = e.total_out = t.total = 0, e.msg = ``, t.wrap && (e.adler = t.wrap & 1), t.mode = Ci, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(ea), t.distcode = t.distdyn = new Int32Array(ta), t.sane = 1, t.back = -1, hi;
        }, oa = (e)=>{
            if (ia(e)) return vi;
            let t = e.state;
            return t.wsize = 0, t.whave = 0, t.wnext = 0, aa(e);
        }, sa = (e, t)=>{
            let n;
            if (ia(e)) return vi;
            let r = e.state;
            return t < 0 ? (n = 0, t = -t) : (n = (t >> 4) + 5, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? vi : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, oa(e));
        }, ca = (e, t)=>{
            if (!e) return vi;
            let n = new We;
            e.state = n, n.strm = e, n.window = null, n.mode = Ci;
            let r = sa(e, t);
            return r !== hi && (e.state = null), r;
        }, la = (e)=>ca(e, na), ua = !0, pa = (e)=>{
            if (ua) {
                da = new Int32Array(512), fa = new Int32Array(32);
                let t = 0;
                for(; t < 144;)e.lens[t++] = 8;
                for(; t < 256;)e.lens[t++] = 9;
                for(; t < 280;)e.lens[t++] = 7;
                for(; t < 288;)e.lens[t++] = 8;
                for(ci(ui, e.lens, 0, 288, da, 0, e.work, {
                    bits: 9
                }), t = 0; t < 32;)e.lens[t++] = 5;
                ci(di, e.lens, 0, 32, fa, 0, e.work, {
                    bits: 5
                }), ua = !1;
            }
            e.lencode = da, e.lenbits = 9, e.distcode = fa, e.distbits = 5;
        }, ma = (e, t, n, r)=>{
            let i, a = e.state;
            return a.window === null && (a.window = new Uint8Array(1 << a.wbits)), a.wsize === 0 && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0), r >= a.wsize ? (a.window.set(t.subarray(n - a.wsize, n), 0), a.wnext = 0, a.whave = a.wsize) : (i = a.wsize - a.wnext, i > r && (i = r), a.window.set(t.subarray(n - r, n - r + i), a.wnext), r -= i, r ? (a.window.set(t.subarray(n - r, n), 0), a.wnext = r, a.whave = a.wsize) : (a.wnext += i, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += i))), 0;
        }, ha = (e, t)=>{
            let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g = 0, _, v, y, b, x, S, C, w, T = new Uint8Array(4), E, D, ee = new Uint8Array([
                16,
                17,
                18,
                0,
                8,
                7,
                9,
                6,
                10,
                5,
                11,
                4,
                12,
                3,
                13,
                2,
                14,
                1,
                15
            ]);
            if (ia(e) || !e.output || !e.input && e.avail_in !== 0) return vi;
            n = e.state, n.mode === Pi && (n.mode = Fi), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, d = s, f = c, w = hi;
            inf_leave: for(;;)switch(n.mode){
                case Ci:
                    if (n.wrap === 0) {
                        n.mode = Fi;
                        break;
                    }
                    for(; u < 16;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    if (n.wrap & 2 && l === 35615) {
                        n.wbits === 0 && (n.wbits = 15), n.check = 0, T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = j(n.check, T, 2, 0), l = 0, u = 0, n.mode = wi;
                        break;
                    }
                    if (n.head && (n.head.done = !1), !(n.wrap & 1) || (((l & 255) << 8) + (l >> 8)) % 31) {
                        e.msg = `incorrect header check`, n.mode = L;
                        break;
                    }
                    if ((l & 15) !== Si) {
                        e.msg = `unknown compression method`, n.mode = L;
                        break;
                    }
                    if (l >>>= 4, u -= 4, C = (l & 15) + 8, n.wbits === 0 && (n.wbits = C), C > 15 || C > n.wbits) {
                        e.msg = `invalid window size`, n.mode = L;
                        break;
                    }
                    n.dmax = 1 << n.wbits, n.flags = 0, e.adler = n.check = 1, n.mode = l & 512 ? Mi : Pi, l = 0, u = 0;
                    break;
                case wi:
                    for(; u < 16;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    if (n.flags = l, (n.flags & 255) !== Si) {
                        e.msg = `unknown compression method`, n.mode = L;
                        break;
                    }
                    if (n.flags & 57344) {
                        e.msg = `unknown header flags set`, n.mode = L;
                        break;
                    }
                    n.head && (n.head.text = l >> 8 & 1), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = j(n.check, T, 2, 0)), l = 0, u = 0, n.mode = Ti;
                case Ti:
                    for(; u < 32;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    n.head && (n.head.time = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, T[2] = l >>> 16 & 255, T[3] = l >>> 24 & 255, n.check = j(n.check, T, 4, 0)), l = 0, u = 0, n.mode = Ei;
                case Ei:
                    for(; u < 16;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    n.head && (n.head.xflags = l & 255, n.head.os = l >> 8), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = j(n.check, T, 2, 0)), l = 0, u = 0, n.mode = Di;
                case Di:
                    if (n.flags & 1024) {
                        for(; u < 16;){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        n.length = l, n.head && (n.head.extra_len = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = j(n.check, T, 2, 0)), l = 0, u = 0;
                    } else n.head && (n.head.extra = null);
                    n.mode = Oi;
                case Oi:
                    if (n.flags & 1024 && (p = n.length, p > s && (p = s), p && (n.head && (C = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(r.subarray(a, a + p), C)), n.flags & 512 && n.wrap & 4 && (n.check = j(n.check, r, p, a)), s -= p, a += p, n.length -= p), n.length)) break inf_leave;
                    n.length = 0, n.mode = ki;
                case ki:
                    if (n.flags & 2048) {
                        if (s === 0) break inf_leave;
                        p = 0;
                        do C = r[a + p++], n.head && C && n.length < 65536 && (n.head.name += String.fromCharCode(C));
                        while (C && p < s);
                        if (n.flags & 512 && n.wrap & 4 && (n.check = j(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
                    } else n.head && (n.head.name = null);
                    n.length = 0, n.mode = Ai;
                case Ai:
                    if (n.flags & 4096) {
                        if (s === 0) break inf_leave;
                        p = 0;
                        do C = r[a + p++], n.head && C && n.length < 65536 && (n.head.comment += String.fromCharCode(C));
                        while (C && p < s);
                        if (n.flags & 512 && n.wrap & 4 && (n.check = j(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
                    } else n.head && (n.head.comment = null);
                    n.mode = ji;
                case ji:
                    if (n.flags & 512) {
                        for(; u < 16;){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        if (n.wrap & 4 && l !== (n.check & 65535)) {
                            e.msg = `header crc mismatch`, n.mode = L;
                            break;
                        }
                        l = 0, u = 0;
                    }
                    n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = Pi;
                    break;
                case Mi:
                    for(; u < 32;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    e.adler = n.check = ra(l), l = 0, u = 0, n.mode = Ni;
                case Ni:
                    if (n.havedict === 0) return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, _i;
                    e.adler = n.check = 1, n.mode = Pi;
                case Pi:
                    if (t === pi || t === mi) break inf_leave;
                case Fi:
                    if (n.last) {
                        l >>>= u & 7, u -= u & 7, n.mode = Yi;
                        break;
                    }
                    for(; u < 3;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    switch(n.last = l & 1, l >>>= 1, --u, l & 3){
                        case 0:
                            n.mode = Ii;
                            break;
                        case 1:
                            if (pa(n), n.mode = Hi, t === mi) {
                                l >>>= 2, u -= 2;
                                break inf_leave;
                            }
                            break;
                        case 2:
                            n.mode = zi;
                            break;
                        case 3:
                            e.msg = `invalid block type`, n.mode = L;
                    }
                    l >>>= 2, u -= 2;
                    break;
                case Ii:
                    for(l >>>= u & 7, u -= u & 7; u < 32;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    if ((l & 65535) != (l >>> 16 ^ 65535)) {
                        e.msg = `invalid stored block lengths`, n.mode = L;
                        break;
                    }
                    if (n.length = l & 65535, l = 0, u = 0, n.mode = Li, t === mi) break inf_leave;
                case Li:
                    n.mode = Ri;
                case Ri:
                    if (p = n.length, p) {
                        if (p > s && (p = s), p > c && (p = c), p === 0) break inf_leave;
                        i.set(r.subarray(a, a + p), o), s -= p, a += p, c -= p, o += p, n.length -= p;
                        break;
                    }
                    n.mode = Pi;
                    break;
                case zi:
                    for(; u < 14;){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    if (n.nlen = (l & 31) + 257, l >>>= 5, u -= 5, n.ndist = (l & 31) + 1, l >>>= 5, u -= 5, n.ncode = (l & 15) + 4, l >>>= 4, u -= 4, n.nlen > 286 || n.ndist > 30) {
                        e.msg = `too many length or distance symbols`, n.mode = L;
                        break;
                    }
                    n.have = 0, n.mode = Bi;
                case Bi:
                    for(; n.have < n.ncode;){
                        for(; u < 3;){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        n.lens[ee[n.have++]] = l & 7, l >>>= 3, u -= 3;
                    }
                    for(; n.have < 19;)n.lens[ee[n.have++]] = 0;
                    if (n.lencode = n.lendyn, n.lenbits = 7, E = {
                        bits: n.lenbits
                    }, w = ci(li, n.lens, 0, 19, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
                        e.msg = `invalid code lengths set`, n.mode = L;
                        break;
                    }
                    n.have = 0, n.mode = Vi;
                case Vi:
                    for(; n.have < n.nlen + n.ndist;){
                        for(; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        if (y < 16) l >>>= _, u -= _, n.lens[n.have++] = y;
                        else {
                            if (y === 16) {
                                for(D = _ + 2; u < D;){
                                    if (s === 0) break inf_leave;
                                    s--, l += r[a++] << u, u += 8;
                                }
                                if (l >>>= _, u -= _, n.have === 0) {
                                    e.msg = `invalid bit length repeat`, n.mode = L;
                                    break;
                                }
                                C = n.lens[n.have - 1], p = 3 + (l & 3), l >>>= 2, u -= 2;
                            } else if (y === 17) {
                                for(D = _ + 3; u < D;){
                                    if (s === 0) break inf_leave;
                                    s--, l += r[a++] << u, u += 8;
                                }
                                l >>>= _, u -= _, C = 0, p = 3 + (l & 7), l >>>= 3, u -= 3;
                            } else {
                                for(D = _ + 7; u < D;){
                                    if (s === 0) break inf_leave;
                                    s--, l += r[a++] << u, u += 8;
                                }
                                l >>>= _, u -= _, C = 0, p = 11 + (l & 127), l >>>= 7, u -= 7;
                            }
                            if (n.have + p > n.nlen + n.ndist) {
                                e.msg = `invalid bit length repeat`, n.mode = L;
                                break;
                            }
                            for(; p--;)n.lens[n.have++] = C;
                        }
                    }
                    if (n.mode === L) break;
                    if (n.lens[256] === 0) {
                        e.msg = `invalid code -- missing end-of-block`, n.mode = L;
                        break;
                    }
                    if (n.lenbits = 9, E = {
                        bits: n.lenbits
                    }, w = ci(ui, n.lens, 0, n.nlen, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
                        e.msg = `invalid literal/lengths set`, n.mode = L;
                        break;
                    }
                    if (n.distbits = 6, n.distcode = n.distdyn, E = {
                        bits: n.distbits
                    }, w = ci(di, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, E), n.distbits = E.bits, w) {
                        e.msg = `invalid distances set`, n.mode = L;
                        break;
                    }
                    if (n.mode = Hi, t === mi) break inf_leave;
                case Hi:
                    n.mode = Ui;
                case Ui:
                    if (s >= 6 && c >= 258) {
                        e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, Xr(e, f), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, n.mode === Pi && (n.back = -1);
                        break;
                    }
                    for(n.back = 0; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    if (v && !(v & 240)) {
                        for(b = _, x = v, S = y; g = n.lencode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        l >>>= b, u -= b, n.back += b;
                    }
                    if (l >>>= _, u -= _, n.back += _, n.length = y, v === 0) {
                        n.mode = Ji;
                        break;
                    }
                    if (v & 32) {
                        n.back = -1, n.mode = Pi;
                        break;
                    }
                    if (v & 64) {
                        e.msg = `invalid literal/length code`, n.mode = L;
                        break;
                    }
                    n.extra = v & 15, n.mode = Wi;
                case Wi:
                    if (n.extra) {
                        for(D = n.extra; u < D;){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        n.length += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
                    }
                    n.was = n.length, n.mode = Gi;
                case Gi:
                    for(; g = n.distcode[l & (1 << n.distbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);){
                        if (s === 0) break inf_leave;
                        s--, l += r[a++] << u, u += 8;
                    }
                    if (!(v & 240)) {
                        for(b = _, x = v, S = y; g = n.distcode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        l >>>= b, u -= b, n.back += b;
                    }
                    if (l >>>= _, u -= _, n.back += _, v & 64) {
                        e.msg = `invalid distance code`, n.mode = L;
                        break;
                    }
                    n.offset = y, n.extra = v & 15, n.mode = Ki;
                case Ki:
                    if (n.extra) {
                        for(D = n.extra; u < D;){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        n.offset += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
                    }
                    if (n.offset > n.dmax) {
                        e.msg = `invalid distance too far back`, n.mode = L;
                        break;
                    }
                    n.mode = qi;
                case qi:
                    if (c === 0) break inf_leave;
                    if (p = f - c, n.offset > p) {
                        if (p = n.offset - p, p > n.whave && n.sane) {
                            e.msg = `invalid distance too far back`, n.mode = L;
                            break;
                        }
                        p > n.wnext ? (p -= n.wnext, m = n.wsize - p) : m = n.wnext - p, p > n.length && (p = n.length), h = n.window;
                    } else h = i, m = o - n.offset, p = n.length;
                    p > c && (p = c), c -= p, n.length -= p;
                    do i[o++] = h[m++];
                    while (--p);
                    n.length === 0 && (n.mode = Ui);
                    break;
                case Ji:
                    if (c === 0) break inf_leave;
                    i[o++] = n.length, c--, n.mode = Ui;
                    break;
                case Yi:
                    if (n.wrap) {
                        for(; u < 32;){
                            if (s === 0) break inf_leave;
                            s--, l |= r[a++] << u, u += 8;
                        }
                        if (f -= c, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? j(n.check, i, f, o - f) : nn(n.check, i, f, o - f)), f = c, n.wrap & 4 && (n.flags ? l : ra(l)) !== n.check) {
                            e.msg = `incorrect data check`, n.mode = L;
                            break;
                        }
                        l = 0, u = 0;
                    }
                    n.mode = Xi;
                case Xi:
                    if (n.wrap && n.flags) {
                        for(; u < 32;){
                            if (s === 0) break inf_leave;
                            s--, l += r[a++] << u, u += 8;
                        }
                        if (n.wrap & 4 && l !== (n.total & 4294967295)) {
                            e.msg = `incorrect length check`, n.mode = L;
                            break;
                        }
                        l = 0, u = 0;
                    }
                    n.mode = Zi;
                case Zi:
                    w = gi;
                    break inf_leave;
                case L:
                    w = yi;
                    break inf_leave;
                case Qi:
                    return bi;
                case $i:
                default:
                    return vi;
            }
            return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, (n.wsize || f !== e.avail_out && n.mode < L && (n.mode < Yi || t !== fi)) && ma(e, e.output, e.next_out, f - e.avail_out), d -= e.avail_in, f -= e.avail_out, e.total_in += d, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? j(n.check, i, f, e.next_out - f) : nn(n.check, i, f, e.next_out - f)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === Pi ? 128 : 0) + (n.mode === Hi || n.mode === Li ? 256 : 0), (d === 0 && f === 0 || t === fi) && w === hi && (w = xi), w;
        }, ga = (e)=>{
            if (ia(e)) return vi;
            let t = e.state;
            return t.window &&= null, e.state = null, hi;
        }, _a = (e, t)=>{
            if (ia(e)) return vi;
            let n = e.state;
            return n.wrap & 2 ? (n.head = t, t.done = !1, hi) : vi;
        }, va = (e, t)=>{
            let n = t.length, r, i, a;
            return ia(e) || (r = e.state, r.wrap !== 0 && r.mode !== Ni) ? vi : r.mode === Ni && (i = 1, i = nn(i, t, n, 0), i !== r.check) ? yi : (a = ma(e, t, n, n), a ? (r.mode = Qi, bi) : (r.havedict = 1, hi));
        }, ya = {
            inflateReset: oa,
            inflateReset2: sa,
            inflateResetKeep: aa,
            inflateInit: la,
            inflateInit2: ca,
            inflate: ha,
            inflateEnd: ga,
            inflateGetHeader: _a,
            inflateSetDictionary: va,
            inflateInfo: `pako inflate (from Nodeca project)`
        }, ba = Ge, xa = Object.prototype.toString, { Z_NO_FLUSH: Sa, Z_FINISH: Ca, Z_OK: wa, Z_STREAM_END: Ta, Z_NEED_DICT: Ea, Z_STREAM_ERROR: Da, Z_DATA_ERROR: Oa, Z_MEM_ERROR: ka, Z_BUF_ERROR: Aa } = cn, ja = {
            chunkSize: 1024 * 64,
            windowBits: 15,
            to: ``
        }, Ke.prototype.push = function(e, t) {
            let n = this.strm, r = this.options.chunkSize, i = this.options.dictionary, a, o, s;
            if (this.ended) return !1;
            for(o = t === ~~t ? t : t === !0 ? Ca : Sa, xa.call(e) === `[object ArrayBuffer]` ? n.input = new Uint8Array(e) : n.input = e, n.next_in = 0, n.avail_in = n.input.length;;){
                for(n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), a = ya.inflate(n, o), a === Ea && i && (a = ya.inflateSetDictionary(n, i), a === wa ? a = ya.inflate(n, o) : a === Oa && (a = Ea)); n.avail_in > 0 && a === Ta && n.state.wrap & 2 && n.state.flags !== 0 && n.input[n.next_in] !== 0;)ya.inflateReset(n), a = ya.inflate(n, o);
                switch(a){
                    case Da:
                    case Oa:
                    case Ea:
                    case ka:
                        return this.onEnd(a), this.ended = !0, !1;
                }
                if (s = n.avail_out, n.next_out && (n.avail_out === 0 || a === Ta || o > 0)) if (this.options.to === `string`) {
                    let e = Pr.utf8border(n.output, n.next_out), t = n.next_out - e, i = Pr.buf2string(n.output, e);
                    n.next_out = t, n.avail_out = r - t, t && n.output.set(n.output.subarray(e, e + t), 0), this.onData(i);
                } else this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out)), n.avail_out = 0, n.next_out = 0;
                if (!((a === wa || a === Aa) && s === 0)) {
                    if (a === Ta) return a = ya.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
                    if (n.avail_in === 0) {
                        if (o === Ca) return a = ya.inflateEnd(this.strm), this.onEnd(a === wa ? Aa : a), this.ended = !0, !1;
                        break;
                    }
                }
            }
            return !0;
        }, Ke.prototype.onData = function(e) {
            this.chunks.push(e);
        }, Ke.prototype.onEnd = function(e) {
            e === wa && (this.options.to === `string` ? this.result = this.chunks.join(``) : this.result = Dr.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
        }, Ma = {
            Inflate: Ke,
            inflate: qe,
            inflateRaw: Je,
            ungzip: qe,
            constants: cn
        }, { Deflate: Na, deflate: Pa, deflateRaw: Fa, gzip: Ia } = qr, { Inflate: La, inflate: Ra, inflateRaw: za, ungzip: Ba } = Ma, Va = Na, Ha = Pa, Ua = Fa, Wa = Ia, Ga = La, Ka = Ra, qa = za, Ja = Ba, Ya = cn, Xa = {
            Deflate: Va,
            deflate: Ha,
            deflateRaw: Ua,
            gzip: Wa,
            Inflate: Ga,
            inflate: Ka,
            inflateRaw: qa,
            ungzip: Ja,
            constants: Ya
        };
    }));
    function Qa(e) {
        return JSON.parse(Ka(Me(e), {
            to: `string`,
            raw: !0
        })).debug_infos;
    }
    function $a(e, t, n) {
        if (!(`callStack` in e) || !e.callStack) return;
        let { callStack: r, brilligFunctionId: i } = e;
        if (!t) return r;
        try {
            return eo(r, t, n, i);
        } catch  {
            return r;
        }
    }
    function eo(e, t, n, r) {
        let i = e.flatMap((e)=>no(e, t, n, r));
        if (i.length > 0) {
            let r = e[e.length - 1].split(`.`);
            if (r.length === 2) {
                let e = t.acir_locations[r[0]];
                if (e !== void 0) {
                    let r = t.location_tree.locations[e];
                    i = to(r, t.location_tree.locations, n).concat(i);
                }
            }
        }
        return i;
    }
    function to(e, t, n) {
        let r = [];
        for(; e.parent !== null;){
            let { file: i, span: a } = e.value, { path: o, source: s } = n[i], c = s.substring(a.start, a.end), l = s.substring(0, a.start).split(`
`), u = l.length, d = l[l.length - 1].length + 1;
            r.push({
                filePath: o,
                line: u,
                column: d,
                locationText: c
            }), e = t[e.parent];
        }
        return r.reverse();
    }
    function no(e, t, n, r) {
        let i = t.acir_locations[e], a = ro(e);
        if (r !== void 0 && a !== void 0 && (i = t.brillig_locations[r][a], i === void 0) || i === void 0) return [];
        let o = t.location_tree.locations[i];
        return to(o, t.location_tree.locations, n);
    }
    function ro(e) {
        let t = e.split(`.`);
        if (t.length === 2) return t[1];
    }
    var io = e((()=>{
        Za(), Ne();
    }));
    function ao(e, t) {
        let n = t;
        if (t.rawAssertionPayload) try {
            let r = ce(e.abi, t.rawAssertionPayload);
            typeof r == `string` ? n.message = `Circuit execution failed: ${r}` : n.decodedAssertionPayload = r;
        } catch  {}
        try {
            n.noirCallStack = $a(t, Qa(e.debug_symbols)[t.acirFunctionId], e.file_map)?.map((e)=>typeof e == `string` ? `at opcode ${e}` : `at ${e.locationText} (${e.filePath}:${e.line}:${e.column})`);
        } catch  {}
        return n;
    }
    async function oo(e, t, n = so) {
        let i = le(e.abi, t);
        try {
            return await r(Me(e.bytecode), i, n);
        } catch (t) {
            throw typeof t == `object` && t && `rawAssertionPayload` in t ? ao(e, t) : Error(`Circuit execution failed: ${t}`, {
                cause: t
            });
        }
    }
    var so, co = e((()=>{
        je(), Ne(), oe(), io(), so = async (e, t)=>{
            if (e == `print`) return [];
            throw Error(`Unexpected oracle during execution: ${e}(${t.join(`, `)})`);
        };
    })), lo, uo = e((()=>{
        co(), je(), oe(), lo = class {
            circuit;
            constructor(e){
                this.circuit = e;
            }
            async init() {
                typeof Ce == `function` && await Promise.all([
                    Ce(),
                    w()
                ]);
            }
            async execute(e, t) {
                await this.init();
                let r = await oo(this.circuit, e, t), i = r[0].witness, { return_value: a } = se(this.circuit.abi, i);
                return {
                    witness: n(r),
                    returnValue: a
                };
            }
        };
    })), fo = e((()=>{
        oe(), uo();
    }));
    function* po() {
        let e = [
            1,
            1,
            1,
            2,
            4,
            8,
            16,
            32,
            64
        ], t = 0;
        for(;;)yield e[Math.min(t++, e.length - 1)];
    }
    function* mo(e) {
        for (let t of e)yield t;
    }
    async function ho(e, t = po()) {
        for(;;)try {
            return await e();
        } catch (e) {
            let n = t.next().value;
            if (n === void 0) throw e;
            await new Promise((e)=>setTimeout(e, n * 1e3));
            continue;
        }
    }
    var go = e((()=>{}));
    async function _o(e, t, n) {
        try {
            let t = await fetch(e, n);
            if (t.ok || t.status === 206) return t;
            throw Error(`HTTP ${t.status}`);
        } catch  {
            return await fetch(t, n);
        }
    }
    var vo, yo, bo, xo, So = e((()=>{
        go(), vo = `https://crs.aztec-cdn.foundation`, yo = `https://crs.aztec-labs.com`, bo = class {
            numPoints;
            data;
            g2Data;
            constructor(e){
                this.numPoints = e;
            }
            async init() {
                await this.downloadG1Data(), await this.downloadG2Data();
            }
            async streamG1Data() {
                return (await this.fetchG1Data()).body;
            }
            async streamG2Data() {
                return (await this.fetchG2Data()).body;
            }
            async downloadG1Data() {
                let e = await this.fetchG1Data();
                return this.data = new Uint8Array(await e.arrayBuffer());
            }
            async downloadG2Data() {
                let e = await this.fetchG2Data();
                return this.g2Data = new Uint8Array(await e.arrayBuffer());
            }
            getG1Data() {
                return this.data;
            }
            getG2Data() {
                return this.g2Data;
            }
            async fetchG1Data() {
                if (this.numPoints === 0) return new Response(new Uint8Array([]));
                let e = {
                    headers: {
                        Range: `bytes=0-${this.numPoints * 64 - 1}`
                    },
                    cache: `force-cache`
                };
                return await ho(()=>_o(`${vo}/g1.dat`, `${yo}/g1.dat`, e), mo([
                    5,
                    5,
                    5
                ]));
            }
            async fetchG2Data() {
                let e = {
                    cache: `force-cache`
                };
                return await ho(()=>_o(`${vo}/g2.dat`, `${yo}/g2.dat`, e), mo([
                    5,
                    5,
                    5
                ]));
            }
        }, xo = class {
            numPoints;
            data;
            constructor(e){
                this.numPoints = e;
            }
            async init() {
                await this.downloadG1Data();
            }
            async downloadG1Data() {
                let e = await this.fetchG1Data();
                return this.data = new Uint8Array(await e.arrayBuffer());
            }
            async streamG1Data() {
                return (await this.fetchG1Data()).body;
            }
            getG1Data() {
                return this.data;
            }
            async fetchG1Data() {
                if (this.numPoints === 0) return new Response(new Uint8Array([]));
                let e = {
                    headers: {
                        Range: `bytes=0-${this.numPoints * 64 - 1}`
                    },
                    cache: `force-cache`
                };
                return await _o(`${vo}/grumpkin_g1.dat`, `${yo}/grumpkin_g1.dat`, e);
            }
        };
    }));
    function Co(e) {
        return new Promise((t, n)=>{
            e.oncomplete = e.onsuccess = ()=>t(e.result), e.onabort = e.onerror = ()=>n(e.error);
        });
    }
    function wo(e, t) {
        let n, r = ()=>{
            if (n) return n;
            let r = indexedDB.open(e);
            return r.onupgradeneeded = ()=>r.result.createObjectStore(t), n = Co(r), n.then((e)=>{
                e.onclose = ()=>n = void 0;
            }, ()=>{
                n = void 0;
            }), n;
        };
        return (e, n)=>r().then((r)=>n(r.transaction(t, e).objectStore(t)));
    }
    function To() {
        return Oo ||= wo(`keyval-store`, `keyval`), Oo;
    }
    function Eo(e, t = To()) {
        return t(`readonly`, (t)=>Co(t.get(e)));
    }
    function Do(e, t, n = To()) {
        return n(`readwrite`, (n)=>(n.put(t, e), Co(n.transaction)));
    }
    var Oo, ko = e((()=>{})), Ao, jo, Mo = e((()=>{
        So(), ko(), Ao = class e {
            numPoints;
            g1Data;
            g2Data;
            constructor(e){
                this.numPoints = e;
            }
            static async new(t) {
                let n = new e(t);
                return await n.init(), n;
            }
            async init() {
                let e = await Eo(`g1Data`), t = await Eo(`g2Data`), n = new bo(this.numPoints), r = this.numPoints * 64;
                !e || e.length < r ? (this.g1Data = await n.downloadG1Data(), await Do(`g1Data`, this.g1Data)) : this.g1Data = e, t ? this.g2Data = t : (this.g2Data = await n.downloadG2Data(), await Do(`g2Data`, this.g2Data));
            }
            getG1Data() {
                return this.g1Data;
            }
            getG2Data() {
                return this.g2Data;
            }
        }, jo = class e {
            numPoints;
            g1Data;
            constructor(e){
                this.numPoints = e;
            }
            static async new(t) {
                let n = new e(t);
                return await n.init(), n;
            }
            async init() {
                let e = await Eo(`grumpkinG1Data`), t = new xo(this.numPoints), n = this.numPoints * 64;
                !e || e.length < n ? (this.g1Data = await t.downloadG1Data(), await Do(`grumpkinG1Data`, this.g1Data)) : this.g1Data = e;
            }
            getG1Data() {
                return this.g1Data;
            }
        };
    })), No = e((()=>{
        Mo();
    })), Po = e((()=>{
        No();
    }));
    function Fo(e) {
        try {
            if (!V.trusted && !ls) {
                let e = H.sharedLength || 0;
                e < H.length && (H.length = e);
            }
            let t;
            if (V.randomAccessStructure && z[B] < 64 && z[B] >= 32 && ds ? (t = ds(z, B, Qo, V), z = null, !(e && e.lazy) && t && (t = t.toJSON()), B = Qo) : t = R(), U &&= (B = U.postBundlePosition, null), ls && (H.restoreStructures = null), B == Qo) H && H.restoreStructures && Io(), H = null, z = null, as &&= null;
            else if (B > Qo) throw Error(`Unexpected end of MessagePack data`);
            else if (!ls) {
                let e;
                try {
                    e = JSON.stringify(t, (e, t)=>typeof t == `bigint` ? `${t}n` : t).slice(0, 100);
                } catch (t) {
                    e = `(JSON view not available ` + t + `)`;
                }
                throw Error(`Data read, but end of buffer not reached ` + e);
            }
            return t;
        } catch (e) {
            throw H && H.restoreStructures && Io(), Xo(), (e instanceof RangeError || e.message.startsWith(`Unexpected end of buffer`) || B > Qo) && (e.incomplete = !0), e;
        }
    }
    function Io() {
        for(let e in H.restoreStructures)H[e] = H.restoreStructures[e];
        H.restoreStructures = null;
    }
    function R() {
        let e = z[B++];
        if (e < 160) if (e < 128) {
            if (e < 64) return e;
            {
                let t = H[e & 63] || V.getStructures && Ro()[e & 63];
                return t ? (t.read ||= Lo(t, e & 63), t.read()) : e;
            }
        } else if (e < 144) if (e -= 128, V.mapsAsObjects) {
            let t = {};
            for(let n = 0; n < e; n++){
                let e = qo();
                e === `__proto__` && (e = `__proto_`), t[e] = R();
            }
            return t;
        } else {
            let t = new Map;
            for(let n = 0; n < e; n++)t.set(R(), R());
            return t;
        }
        else {
            e -= 144;
            let t = Array(e);
            for(let n = 0; n < e; n++)t[n] = R();
            return V.freezeData ? Object.freeze(t) : t;
        }
        else if (e < 192) {
            let t = e - 160;
            if (is >= B) return ns.slice(B - rs, (B += t) - rs);
            if (is == 0 && Qo < 140) {
                let e = t < 16 ? Uo(t) : Ho(t);
                if (e != null) return e;
            }
            return _s(t);
        } else {
            let t;
            switch(e){
                case 192:
                    return null;
                case 193:
                    return U ? (t = R(), t > 0 ? U[1].slice(U.position1, U.position1 += t) : U[0].slice(U.position0, U.position0 -= t)) : cs;
                case 194:
                    return !1;
                case 195:
                    return !0;
                case 196:
                    if (t = z[B++], t === void 0) throw Error(`Unexpected end of buffer`);
                    return Go(t);
                case 197:
                    return t = G.getUint16(B), B += 2, Go(t);
                case 198:
                    return t = G.getUint32(B), B += 4, Go(t);
                case 199:
                    return Ko(z[B++]);
                case 200:
                    return t = G.getUint16(B), B += 2, Ko(t);
                case 201:
                    return t = G.getUint32(B), B += 4, Ko(t);
                case 202:
                    if (t = G.getFloat32(B), V.useFloat32 > 2) {
                        let e = Ds[(z[B] & 127) << 1 | z[B + 1] >> 7];
                        return B += 4, (e * t + (t > 0 ? .5 : -.5) >> 0) / e;
                    }
                    return B += 4, t;
                case 203:
                    return t = G.getFloat64(B), B += 8, t;
                case 204:
                    return z[B++];
                case 205:
                    return t = G.getUint16(B), B += 2, t;
                case 206:
                    return t = G.getUint32(B), B += 4, t;
                case 207:
                    return V.int64AsType === `number` ? (t = G.getUint32(B) * 4294967296, t += G.getUint32(B + 4)) : V.int64AsType === `string` ? t = G.getBigUint64(B).toString() : V.int64AsType === `auto` ? (t = G.getBigUint64(B), t <= BigInt(2) << BigInt(52) && (t = Number(t))) : t = G.getBigUint64(B), B += 8, t;
                case 208:
                    return G.getInt8(B++);
                case 209:
                    return t = G.getInt16(B), B += 2, t;
                case 210:
                    return t = G.getInt32(B), B += 4, t;
                case 211:
                    return V.int64AsType === `number` ? (t = G.getInt32(B) * 4294967296, t += G.getUint32(B + 4)) : V.int64AsType === `string` ? t = G.getBigInt64(B).toString() : V.int64AsType === `auto` ? (t = G.getBigInt64(B), t >= BigInt(-2) << BigInt(52) && t <= BigInt(2) << BigInt(52) && (t = Number(t))) : t = G.getBigInt64(B), B += 8, t;
                case 212:
                    if (t = z[B++], t == 114) return Ss(z[B++] & 63);
                    {
                        let e = W[t];
                        if (e) return e.read ? (B++, e.read(R())) : e.noBuffer ? (B++, e()) : e(z.subarray(B, ++B));
                        throw Error(`Unknown extension ` + t);
                    }
                case 213:
                    return t = z[B], t == 114 ? (B++, Ss(z[B++] & 63, z[B++])) : Ko(2);
                case 214:
                    return Ko(4);
                case 215:
                    return Ko(8);
                case 216:
                    return Ko(16);
                case 217:
                    return t = z[B++], is >= B ? ns.slice(B - rs, (B += t) - rs) : vs(t);
                case 218:
                    return t = G.getUint16(B), B += 2, is >= B ? ns.slice(B - rs, (B += t) - rs) : ys(t);
                case 219:
                    return t = G.getUint32(B), B += 4, is >= B ? ns.slice(B - rs, (B += t) - rs) : bs(t);
                case 220:
                    return t = G.getUint16(B), B += 2, Bo(t);
                case 221:
                    return t = G.getUint32(B), B += 4, Bo(t);
                case 222:
                    return t = G.getUint16(B), B += 2, Vo(t);
                case 223:
                    return t = G.getUint32(B), B += 4, Vo(t);
                default:
                    if (e >= 224) return e - 256;
                    if (e === void 0) {
                        let e = Error(`Unexpected end of MessagePack data`);
                        throw e.incomplete = !0, e;
                    }
                    throw Error(`Unknown MessagePack token ` + e);
            }
        }
    }
    function Lo(e, t) {
        function n() {
            if (n.count++ > us) {
                let r;
                try {
                    r = e.read = Function(`r`, `return function(){return ` + (V.freezeData ? `Object.freeze` : ``) + `({` + e.map((e)=>e === `__proto__` ? `__proto_:r()` : hs.test(e) ? e + `:r()` : `[` + JSON.stringify(e) + `]:r()`).join(`,`) + `})}`)(R);
                } catch  {
                    return us = 1 / 0, n();
                }
                return e.read0 = r, e.highByte === 0 && (e.read = gs(t, e.read)), r();
            }
            let r = {};
            for(let t = 0, n = e.length; t < n; t++){
                let n = e[t];
                n === `__proto__` && (n = `__proto_`), r[n] = R();
            }
            return V.freezeData ? Object.freeze(r) : r;
        }
        return n.count = 0, e.read0 = n, e.highByte === 0 ? gs(t, n) : n;
    }
    function Ro() {
        let e = Yo(()=>(z = null, V.getStructures()));
        return H = V._mergeStructures(e, H);
    }
    function zo(e) {
        let t;
        if (e < 16 && (t = Uo(e))) return t;
        if (e > 64 && Zo) return Zo.decode(z.subarray(B, B += e));
        let n = B + e, r = [];
        for(t = ``; B < n;){
            let e = z[B++];
            if (!(e & 128)) r.push(e);
            else if ((e & 224) == 192) {
                let t = z[B++] & 63, n = (e & 31) << 6 | t;
                n < 128 ? r.push(65533) : r.push(n);
            } else if ((e & 240) == 224) {
                let t = z[B++] & 63, n = z[B++] & 63, i = (e & 31) << 12 | t << 6 | n;
                i < 2048 || i >= 55296 && i <= 57343 ? r.push(65533) : r.push(i);
            } else if ((e & 248) == 240) {
                let t = z[B++] & 63, n = z[B++] & 63, i = z[B++] & 63, a = (e & 7) << 18 | t << 12 | n << 6 | i;
                a < 65536 || a > 1114111 ? r.push(65533) : a > 65535 ? (a -= 65536, r.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023, r.push(a)) : r.push(a);
            } else r.push(65533);
            r.length >= 4096 && (t += K.apply(String, r), r.length = 0);
        }
        return r.length > 0 && (t += K.apply(String, r)), t;
    }
    function Bo(e) {
        let t = Array(e);
        for(let n = 0; n < e; n++)t[n] = R();
        return V.freezeData ? Object.freeze(t) : t;
    }
    function Vo(e) {
        if (V.mapsAsObjects) {
            let t = {};
            for(let n = 0; n < e; n++){
                let e = qo();
                e === `__proto__` && (e = `__proto_`), t[e] = R();
            }
            return t;
        } else {
            let t = new Map;
            for(let n = 0; n < e; n++)t.set(R(), R());
            return t;
        }
    }
    function Ho(e) {
        let t = B, n = Array(e);
        for(let r = 0; r < e; r++){
            let e = z[B++];
            if ((e & 128) > 0) {
                B = t;
                return;
            }
            n[r] = e;
        }
        return K.apply(String, n);
    }
    function Uo(e) {
        if (e < 4) if (e < 2) {
            if (e === 0) return ``;
            {
                let e = z[B++];
                if ((e & 128) > 1) {
                    --B;
                    return;
                }
                return K(e);
            }
        } else {
            let t = z[B++], n = z[B++];
            if ((t & 128) > 0 || (n & 128) > 0) {
                B -= 2;
                return;
            }
            if (e < 3) return K(t, n);
            let r = z[B++];
            if ((r & 128) > 0) {
                B -= 3;
                return;
            }
            return K(t, n, r);
        }
        else {
            let t = z[B++], n = z[B++], r = z[B++], i = z[B++];
            if ((t & 128) > 0 || (n & 128) > 0 || (r & 128) > 0 || (i & 128) > 0) {
                B -= 4;
                return;
            }
            if (e < 6) {
                if (e === 4) return K(t, n, r, i);
                {
                    let e = z[B++];
                    if ((e & 128) > 0) {
                        B -= 5;
                        return;
                    }
                    return K(t, n, r, i, e);
                }
            } else if (e < 8) {
                let a = z[B++], o = z[B++];
                if ((a & 128) > 0 || (o & 128) > 0) {
                    B -= 6;
                    return;
                }
                if (e < 7) return K(t, n, r, i, a, o);
                let s = z[B++];
                if ((s & 128) > 0) {
                    B -= 7;
                    return;
                }
                return K(t, n, r, i, a, o, s);
            } else {
                let a = z[B++], o = z[B++], s = z[B++], c = z[B++];
                if ((a & 128) > 0 || (o & 128) > 0 || (s & 128) > 0 || (c & 128) > 0) {
                    B -= 8;
                    return;
                }
                if (e < 10) {
                    if (e === 8) return K(t, n, r, i, a, o, s, c);
                    {
                        let e = z[B++];
                        if ((e & 128) > 0) {
                            B -= 9;
                            return;
                        }
                        return K(t, n, r, i, a, o, s, c, e);
                    }
                } else if (e < 12) {
                    let l = z[B++], u = z[B++];
                    if ((l & 128) > 0 || (u & 128) > 0) {
                        B -= 10;
                        return;
                    }
                    if (e < 11) return K(t, n, r, i, a, o, s, c, l, u);
                    let d = z[B++];
                    if ((d & 128) > 0) {
                        B -= 11;
                        return;
                    }
                    return K(t, n, r, i, a, o, s, c, l, u, d);
                } else {
                    let l = z[B++], u = z[B++], d = z[B++], f = z[B++];
                    if ((l & 128) > 0 || (u & 128) > 0 || (d & 128) > 0 || (f & 128) > 0) {
                        B -= 12;
                        return;
                    }
                    if (e < 14) {
                        if (e === 12) return K(t, n, r, i, a, o, s, c, l, u, d, f);
                        {
                            let e = z[B++];
                            if ((e & 128) > 0) {
                                B -= 13;
                                return;
                            }
                            return K(t, n, r, i, a, o, s, c, l, u, d, f, e);
                        }
                    } else {
                        let p = z[B++], m = z[B++];
                        if ((p & 128) > 0 || (m & 128) > 0) {
                            B -= 14;
                            return;
                        }
                        if (e < 15) return K(t, n, r, i, a, o, s, c, l, u, d, f, p, m);
                        let h = z[B++];
                        if ((h & 128) > 0) {
                            B -= 15;
                            return;
                        }
                        return K(t, n, r, i, a, o, s, c, l, u, d, f, p, m, h);
                    }
                }
            }
        }
    }
    function Wo() {
        let e = z[B++], t;
        if (e < 192) t = e - 160;
        else switch(e){
            case 217:
                t = z[B++];
                break;
            case 218:
                t = G.getUint16(B), B += 2;
                break;
            case 219:
                t = G.getUint32(B), B += 4;
                break;
            default:
                throw Error(`Expected string`);
        }
        return zo(t);
    }
    function Go(e) {
        return V.copyBuffers ? Uint8Array.prototype.slice.call(z, B, B += e) : z.subarray(B, B += e);
    }
    function Ko(e) {
        let t = z[B++];
        if (W[t]) {
            let n;
            return W[t](z.subarray(B, n = B += e), (e)=>{
                B = e;
                try {
                    return R();
                } finally{
                    B = n;
                }
            });
        } else throw Error(`Unknown extension type ` + t);
    }
    function qo() {
        let e = z[B++];
        if (e >= 160 && e < 192) {
            if (e -= 160, is >= B) return ns.slice(B - rs, (B += e) - rs);
            if (!(is == 0 && Qo < 180)) return _s(e);
        } else return B--, Jo(R());
        let t = (e << 5 ^ (e > 1 ? G.getUint16(B) : e > 0 ? z[B] : 0)) & 4095, n = xs[t], r = B, i = B + e - 3, a, o = 0;
        if (n && n.bytes == e) {
            for(; r < i;){
                if (a = G.getUint32(r), a != n[o++]) {
                    r = 1879048192;
                    break;
                }
                r += 4;
            }
            for(i += 3; r < i;)if (a = z[r++], a != n[o++]) {
                r = 1879048192;
                break;
            }
            if (r === i) return B = r, n.string;
            i -= 3, r = B;
        }
        for(n = [], xs[t] = n, n.bytes = e; r < i;)a = G.getUint32(r), n.push(a), r += 4;
        for(i += 3; r < i;)a = z[r++], n.push(a);
        let s = e < 16 ? Uo(e) : Ho(e);
        return s == null ? n.string = _s(e) : n.string = s;
    }
    function Jo(e) {
        if (typeof e == `string`) return e;
        if (typeof e == `number` || typeof e == `boolean` || typeof e == `bigint`) return e.toString();
        if (e == null) return e + ``;
        if (V.allowArraysInMapKeys && Array.isArray(e) && e.flat().every((e)=>[
                `string`,
                `number`,
                `boolean`,
                `bigint`
            ].includes(typeof e))) return e.flat().toString();
        throw Error(`Invalid property type for record: ${typeof e}`);
    }
    function Yo(e) {
        ps && ps();
        let t = Qo, n = B, r = ts, i = rs, a = is, o = ns, s = es, c = as, l = U, u = new Uint8Array(z.slice(0, Qo)), d = H, f = H.slice(0, H.length), p = V, m = ls, h = e();
        return Qo = t, B = n, ts = r, rs = i, is = a, ns = o, es = s, as = c, U = l, z = u, ls = m, H = d, H.splice(0, H.length, ...f), V = p, G = new DataView(z.buffer, z.byteOffset, z.byteLength), h;
    }
    function Xo() {
        z = null, as = null, H = null;
    }
    var Zo, z, Qo, B, $o, es, ts, V, H, ns, rs, is, U, as, W, G, os, ss, cs, ls, us, ds, fs, ps, ms, hs, gs, _s, vs, ys, bs, K, xs, Ss, Cs, ws, Ts, Es, Ds, Os, ks, As, js, Ms = e((()=>{
        try {
            Zo = new TextDecoder;
        } catch  {}
        B = 0, $o = [], es = $o, ts = 0, V = {}, rs = 0, is = 0, W = [], os = {
            useRecords: !1,
            mapsAsObjects: !0
        }, ss = class {
        }, cs = new ss, cs.name = `MessagePack 0xC1`, ls = !1, us = 2, ms = class e {
            constructor(e){
                e && (e.useRecords === !1 && e.mapsAsObjects === void 0 && (e.mapsAsObjects = !0), e.sequential && e.trusted !== !1 && (e.trusted = !0, !e.structures && e.useRecords != 0 && (e.structures = [], e.maxSharedStructures ||= 0)), e.structures ? e.structures.sharedLength = e.structures.length : e.getStructures && ((e.structures = []).uninitialized = !0, e.structures.sharedLength = 0), e.int64AsNumber && (e.int64AsType = `number`)), Object.assign(this, e);
            }
            unpack(t, n) {
                if (z) return Yo(()=>(Xo(), this ? this.unpack(t, n) : e.prototype.unpack.call(os, t, n)));
                !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < `u` ? Buffer.from(t) : new Uint8Array(t)), typeof n == `object` ? (Qo = n.end || t.length, B = n.start || 0) : (B = 0, Qo = n > -1 ? n : t.length), ts = 0, is = 0, ns = null, es = $o, U = null, z = t;
                try {
                    G = t.dataView ||= new DataView(t.buffer, t.byteOffset, t.byteLength);
                } catch (e) {
                    throw z = null, t instanceof Uint8Array ? e : Error(`Source must be a Uint8Array or Buffer but was a ` + (t && typeof t == `object` ? t.constructor.name : typeof t));
                }
                if (this instanceof e) {
                    if (V = this, this.structures) return H = this.structures, Fo(n);
                    (!H || H.length > 0) && (H = []);
                } else V = os, (!H || H.length > 0) && (H = []);
                return Fo(n);
            }
            unpackMultiple(e, t) {
                let n, r = 0;
                try {
                    ls = !0;
                    let i = e.length, a = this ? this.unpack(e, i) : ks.unpack(e, i);
                    if (t) {
                        if (t(a, r, B) === !1) return;
                        for(; B < i;)if (r = B, t(Fo(), r, B) === !1) return;
                    } else {
                        for(n = [
                            a
                        ]; B < i;)r = B, n.push(Fo());
                        return n;
                    }
                } catch (e) {
                    throw e.lastPosition = r, e.values = n, e;
                } finally{
                    ls = !1, Xo();
                }
            }
            _mergeStructures(e, t) {
                fs && (e = fs.call(this, e)), e ||= [], Object.isFrozen(e) && (e = e.map((e)=>e.slice(0)));
                for(let t = 0, n = e.length; t < n; t++){
                    let n = e[t];
                    n && (n.isShared = !0, t >= 32 && (n.highByte = t - 32 >> 5));
                }
                e.sharedLength = e.length;
                for(let n in t || [])if (n >= 0) {
                    let r = e[n], i = t[n];
                    i && (r && ((e.restoreStructures ||= [])[n] = r), e[n] = i);
                }
                return this.structures = e;
            }
            decode(e, t) {
                return this.unpack(e, t);
            }
        }, hs = /^[a-zA-Z_$][a-zA-Z\d_$]*$/, gs = (e, t)=>function() {
                let n = z[B++];
                if (n === 0) return t();
                let r = e < 32 ? -(e + (n << 5)) : e + (n << 5), i = H[r] || Ro()[r];
                if (!i) throw Error(`Record id is not defined for ` + r);
                return i.read ||= Lo(i, e), i.read();
            }, _s = zo, vs = zo, ys = zo, bs = zo, K = String.fromCharCode, xs = Array(4096), Ss = (e, t)=>{
            let n = R().map(Jo), r = e;
            t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, n.highByte = t);
            let i = H[e];
            return i && (i.isShared || ls) && ((H.restoreStructures ||= [])[e] = i), H[e] = n, n.read = Lo(n, r), (n.read0 || n.read)();
        }, W[0] = ()=>{}, W[0].noBuffer = !0, W[66] = (e)=>{
            let t = e.byteLength % 8 || 8, n = BigInt(e[0] & 128 ? e[0] - 256 : e[0]);
            for(let r = 1; r < t; r++)n <<= BigInt(8), n += BigInt(e[r]);
            if (e.byteLength !== t) {
                let r = new DataView(e.buffer, e.byteOffset, e.byteLength), i = (e, t)=>{
                    let n = t - e;
                    if (n <= 40) {
                        let n = r.getBigUint64(e);
                        for(let i = e + 8; i < t; i += 8)n <<= BigInt(64), n |= r.getBigUint64(i);
                        return n;
                    }
                    let a = e + (n >> 4 << 3), o = i(e, a), s = i(a, t);
                    return o << BigInt((t - a) * 8) | s;
                };
                n = n << BigInt((r.byteLength - t) * 8) | i(t, r.byteLength);
            }
            return n;
        }, Cs = {
            Error,
            EvalError,
            RangeError,
            ReferenceError,
            SyntaxError,
            TypeError,
            URIError,
            AggregateError: typeof AggregateError == `function` ? AggregateError : null
        }, W[101] = ()=>{
            let e = R();
            if (!Cs[e[0]]) {
                let t = Error(e[1], {
                    cause: e[2]
                });
                return t.name = e[0], t;
            }
            return Cs[e[0]](e[1], {
                cause: e[2]
            });
        }, W[105] = (e)=>{
            if (V.structuredClone === !1) throw Error(`Structured clone extension is disabled`);
            let t = G.getUint32(B - 4);
            as ||= new Map;
            let n = z[B], r;
            r = n >= 144 && n < 160 || n == 220 || n == 221 ? [] : n >= 128 && n < 144 || n == 222 || n == 223 ? new Map : (n >= 199 && n <= 201 || n >= 212 && n <= 216) && z[B + 1] === 115 ? new Set : {};
            let i = {
                target: r
            };
            as.set(t, i);
            let a = R();
            if (i.used) Object.assign(r, a);
            else return i.target = a;
            if (r instanceof Map) for (let [e, t] of a.entries())r.set(e, t);
            if (r instanceof Set) for (let e of Array.from(a))r.add(e);
            return r;
        }, W[112] = (e)=>{
            if (V.structuredClone === !1) throw Error(`Structured clone extension is disabled`);
            let t = G.getUint32(B - 4), n = as.get(t);
            return n.used = !0, n.target;
        }, W[115] = ()=>new Set(R()), ws = [
            `Int8`,
            `Uint8`,
            `Uint8Clamped`,
            `Int16`,
            `Uint16`,
            `Int32`,
            `Uint32`,
            `Float32`,
            `Float64`,
            `BigInt64`,
            `BigUint64`
        ].map((e)=>e + `Array`), Ts = typeof globalThis == `object` ? globalThis : window, W[116] = (e)=>{
            let t = e[0], n = Uint8Array.prototype.slice.call(e, 1).buffer, r = ws[t];
            if (!r) {
                if (t === 16) return n;
                if (t === 17) return new DataView(n);
                throw Error(`Could not find typed array for code ` + t);
            }
            return new Ts[r](n);
        }, W[120] = ()=>{
            let e = R();
            return new RegExp(e[0], e[1]);
        }, Es = [], W[98] = (e)=>{
            let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], n = B;
            return B += t - e.length, U = Es, U = [
                Wo(),
                Wo()
            ], U.position0 = 0, U.position1 = 0, U.postBundlePosition = B, B = n, R();
        }, W[255] = (e)=>e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3) : e.length == 12 ? new Date(((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3) : new Date(`invalid`), Ds = Array(147);
        for(let e = 0; e < 256; e++)Ds[e] = +(`1e` + Math.floor(45.15 - e * .30103));
        Os = ms, ks = new ms({
            useRecords: !1
        }), ks.unpack, ks.unpackMultiple, ks.unpack, As = {
            NEVER: 0,
            ALWAYS: 1,
            DECIMAL_ROUND: 3,
            DECIMAL_FIT: 4
        }, js = new Float32Array(1), new Uint8Array(js.buffer, 0, 4);
    }));
    function Ns(e, t, n, r) {
        let i = e.byteLength;
        if (i + 1 < 256) {
            var { target: a, position: o } = n(4 + i);
            a[o++] = 199, a[o++] = i + 1;
        } else if (i + 1 < 65536) {
            var { target: a, position: o } = n(5 + i);
            a[o++] = 200, a[o++] = i + 1 >> 8, a[o++] = i + 1 & 255;
        } else {
            var { target: a, position: o, targetView: s } = n(7 + i);
            a[o++] = 201, s.setUint32(o, i + 1), o += 4;
        }
        a[o++] = 116, a[o++] = t, e.buffer || (e = new Uint8Array(e)), a.set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o);
    }
    function Ps(e, t) {
        let n = e.byteLength;
        var r, i;
        if (n < 256) {
            var { target: r, position: i } = t(n + 2);
            r[i++] = 196, r[i++] = n;
        } else if (n < 65536) {
            var { target: r, position: i } = t(n + 3);
            r[i++] = 197, r[i++] = n >> 8, r[i++] = n & 255;
        } else {
            var { target: r, position: i, targetView: a } = t(n + 5);
            r[i++] = 198, a.setUint32(i, n), i += 4;
        }
        r.set(e, i);
    }
    function Fs(e, t, n, r) {
        let i = e.length;
        switch(i){
            case 1:
                t[n++] = 212;
                break;
            case 2:
                t[n++] = 213;
                break;
            case 4:
                t[n++] = 214;
                break;
            case 8:
                t[n++] = 215;
                break;
            case 16:
                t[n++] = 216;
                break;
            default:
                i < 256 ? (t[n++] = 199, t[n++] = i) : i < 65536 ? (t[n++] = 200, t[n++] = i >> 8, t[n++] = i & 255) : (t[n++] = 201, t[n++] = i >> 24, t[n++] = i >> 16 & 255, t[n++] = i >> 8 & 255, t[n++] = i & 255);
        }
        return t[n++] = r, t.set(e, n), n += i, n;
    }
    function Is(e, t) {
        let n, r = t.length * 6, i = e.length - r;
        for(; n = t.pop();){
            let t = n.offset, a = n.id;
            e.copyWithin(t + r, t, i), r -= 6;
            let o = t + r;
            e[o++] = 214, e[o++] = 105, e[o++] = a >> 24, e[o++] = a >> 16 & 255, e[o++] = a >> 8 & 255, e[o++] = a & 255, i = t;
        }
        return e;
    }
    function Ls(e, t, n) {
        if (Z.length > 0) {
            J.setUint32(Z.position + e, Y + n - Z.position - e), Z.stringsPosition = Y - e;
            let r = Z;
            Z = null, t(r[0]), t(r[1]);
        }
    }
    function Rs(e, t) {
        return e.isCompatible = (e)=>{
            let n = !e || (t.lastNamedStructuresLength || 0) === e.length;
            return n || t._mergeStructures(e), n;
        }, e;
    }
    var zs, Bs, Vs, Hs, Us, Ws, Gs, q, Ks, J, Y, X, Z, qs, Js, Ys, Xs, Zs, Qs, $s, ec, tc, nc, rc, ic = e((()=>{
        Ms();
        try {
            zs = new TextEncoder;
        } catch  {}
        Hs = typeof Buffer < `u`, Us = Hs ? function(e) {
            return Buffer.allocUnsafeSlow(e);
        } : Uint8Array, Ws = Hs ? Buffer : Uint8Array, Gs = Hs ? 4294967296 : 2144337920, Y = 0, Z = null, Js = 21760, Ys = /[\u0080-\uFFFF]/, Xs = Symbol(`record-id`), Zs = class extends ms {
            constructor(e){
                super(e), this.offset = 0;
                let t, n, r, i, a = Ws.prototype.utf8Write ? function(e, t) {
                    return q.utf8Write(e, t, q.byteLength - t);
                } : zs && zs.encodeInto ? function(e, t) {
                    return zs.encodeInto(e, q.subarray(t)).written;
                } : !1, o = this;
                e ||= {};
                let s = e && e.sequential, c = e.structures || e.saveStructures, l = e.maxSharedStructures;
                if (l ??= c ? 32 : 0, l > 8160) throw Error(`Maximum maxSharedStructure is 8160`);
                e.structuredClone && e.moreTypes == null && (this.moreTypes = !0);
                let u = e.maxOwnStructures;
                u ??= c ? 32 : 64, !this.structures && e.useRecords != 0 && (this.structures = []);
                let d = l > 32 || u + l > 64, f = l + 64, p = l + u + 64;
                if (p > 8256) throw Error(`Maximum maxSharedStructure + maxOwnStructure is 8192`);
                let m = [], h = 0, g = 0;
                this.pack = this.encode = function(e, a) {
                    if (q || (q = new Us(8192), J = q.dataView ||= new DataView(q.buffer, 0, 8192), Y = 0), X = q.length - 10, X - Y < 2048 ? (q = new Us(q.length), J = q.dataView ||= new DataView(q.buffer, 0, q.length), X = q.length - 10, Y = 0) : Y = Y + 7 & 2147483640, t = Y, a & 2048 && (Y += a & 255), i = o.structuredClone ? new Map : null, o.bundleStrings && typeof e != `string` ? (Z = [], Z.size = 1 / 0) : Z = null, r = o.structures, r) {
                        r.uninitialized && (r = o._mergeStructures(o.getStructures()));
                        let e = r.sharedLength || 0;
                        if (e > l) throw Error(`Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to ` + r.sharedLength);
                        if (!r.transitions) {
                            r.transitions = Object.create(null);
                            for(let t = 0; t < e; t++){
                                let e = r[t];
                                if (!e) continue;
                                let n, i = r.transitions;
                                for(let t = 0, r = e.length; t < r; t++){
                                    let r = e[t];
                                    n = i[r], n ||= i[r] = Object.create(null), i = n;
                                }
                                i[Xs] = t + 64;
                            }
                            this.lastNamedStructuresLength = e;
                        }
                        s || (r.nextId = e + 64);
                    }
                    n &&= !1;
                    let c;
                    try {
                        o.randomAccessStructure && !o.readOnlyStructures && e && typeof e == `object` ? e.constructor === Object ? D(e) : e.constructor !== Map && !Array.isArray(e) && !Vs.some((t)=>e instanceof t) ? D(e.toJSON ? e.toJSON() : e) : y(e) : y(e);
                        let n = Z;
                        if (Z && Ls(t, y, 0), i && i.idsToInsert) {
                            let e = i.idsToInsert.sort((e, t)=>e.offset > t.offset ? 1 : -1), r = e.length, a = -1;
                            for(; n && r > 0;){
                                let i = e[--r].offset + t;
                                i < n.stringsPosition + t && a === -1 && (a = 0), i > n.position + t ? a >= 0 && (a += 6) : (a >= 0 && (J.setUint32(n.position + t, J.getUint32(n.position + t) + a), a = -1), n = n.previous, r++);
                            }
                            a >= 0 && n && J.setUint32(n.position + t, J.getUint32(n.position + t) + a), Y += e.length * 6, Y > X && w(Y), o.offset = Y;
                            let s = Is(q.subarray(t, Y), e);
                            return i = null, s;
                        }
                        return o.offset = Y, a & 512 ? (q.start = t, q.end = Y, q) : q.subarray(t, Y);
                    } catch (e) {
                        throw c = e, e;
                    } finally{
                        if (r && (_(), n && o.saveStructures)) {
                            let n = r.sharedLength || 0, i = q.subarray(t, Y), s = Rs(r, o);
                            if (!c) return o.saveStructures(s, s.isCompatible) === !1 ? (r.uninitialized = !0, o.pack(e, a)) : (o.lastNamedStructuresLength = n, q.length > 1073741824 && (q = null), i);
                        }
                        q.length > 1073741824 && (q = null), a & 1024 && (Y = t);
                    }
                };
                let _ = ()=>{
                    g < 10 && g++;
                    let e = r.sharedLength || 0;
                    if (r.length > e && !s && (r.length = e), h > 1e4) r.transitions = null, g = 0, h = 0, m.length > 0 && (m = []);
                    else if (m.length > 0 && !s) {
                        for(let e = 0, t = m.length; e < t; e++)m[e][Xs] = 0;
                        m = [];
                    }
                }, v = (e)=>{
                    var t = e.length;
                    t < 16 ? q[Y++] = 144 | t : t < 65536 ? (q[Y++] = 220, q[Y++] = t >> 8, q[Y++] = t & 255) : (q[Y++] = 221, J.setUint32(Y, t), Y += 4);
                    for(let n = 0; n < t; n++)y(e[n]);
                }, y = (e)=>{
                    Y > X && (q = w(Y));
                    var n = typeof e, r;
                    if (n === `string`) {
                        let n = e.length;
                        if (Z && n >= 4 && n < 4096) {
                            if ((Z.size += n) > Js) {
                                let e, n = (Z[0] ? Z[0].length * 3 + Z[1].length : 0) + 10;
                                Y + n > X && (q = w(Y + n));
                                let r;
                                Z.position ? (r = Z, q[Y] = 200, Y += 3, q[Y++] = 98, e = Y - t, Y += 4, Ls(t, y, 0), J.setUint16(e + t - 3, Y - t - e)) : (q[Y++] = 214, q[Y++] = 98, e = Y - t, Y += 4), Z = [
                                    ``,
                                    ``
                                ], Z.previous = r, Z.size = 0, Z.position = e;
                            }
                            let r = Ys.test(e);
                            Z[+!r] += e, q[Y++] = 193, y(r ? -n : n);
                            return;
                        }
                        let i;
                        i = n < 32 ? 1 : n < 256 ? 2 : n < 65536 ? 3 : 5;
                        let o = n * 3;
                        if (Y + o > X && (q = w(Y + o)), n < 64 || !a) {
                            let t, a, o, s = Y + i;
                            for(t = 0; t < n; t++)a = e.charCodeAt(t), a < 128 ? q[s++] = a : a < 2048 ? (q[s++] = a >> 6 | 192, q[s++] = a & 63 | 128) : (a & 64512) == 55296 && ((o = e.charCodeAt(t + 1)) & 64512) == 56320 ? (a = 65536 + ((a & 1023) << 10) + (o & 1023), t++, q[s++] = a >> 18 | 240, q[s++] = a >> 12 & 63 | 128, q[s++] = a >> 6 & 63 | 128, q[s++] = a & 63 | 128) : (q[s++] = a >> 12 | 224, q[s++] = a >> 6 & 63 | 128, q[s++] = a & 63 | 128);
                            r = s - Y - i;
                        } else r = a(e, Y + i);
                        r < 32 ? q[Y++] = 160 | r : r < 256 ? (i < 2 && q.copyWithin(Y + 2, Y + 1, Y + 1 + r), q[Y++] = 217, q[Y++] = r) : r < 65536 ? (i < 3 && q.copyWithin(Y + 3, Y + 2, Y + 2 + r), q[Y++] = 218, q[Y++] = r >> 8, q[Y++] = r & 255) : (i < 5 && q.copyWithin(Y + 5, Y + 3, Y + 3 + r), q[Y++] = 219, J.setUint32(Y, r), Y += 4), Y += r;
                    } else if (n === `number`) if (e >>> 0 === e) e < 32 || e < 128 && this.useRecords === !1 || e < 64 && !this.randomAccessStructure ? q[Y++] = e : e < 256 ? (q[Y++] = 204, q[Y++] = e) : e < 65536 ? (q[Y++] = 205, q[Y++] = e >> 8, q[Y++] = e & 255) : (q[Y++] = 206, J.setUint32(Y, e), Y += 4);
                    else if (e >> 0 === e) e >= -32 ? q[Y++] = 256 + e : e >= -128 ? (q[Y++] = 208, q[Y++] = e + 256) : e >= -32768 ? (q[Y++] = 209, J.setInt16(Y, e), Y += 2) : (q[Y++] = 210, J.setInt32(Y, e), Y += 4);
                    else {
                        let t;
                        if ((t = this.useFloat32) > 0 && e < 4294967296 && e >= -2147483648) {
                            q[Y++] = 202, J.setFloat32(Y, e);
                            let n;
                            if (t < 4 || (n = e * Ds[(q[Y] & 127) << 1 | q[Y + 1] >> 7]) >> 0 === n) {
                                Y += 4;
                                return;
                            } else Y--;
                        }
                        q[Y++] = 203, J.setFloat64(Y, e), Y += 8;
                    }
                    else if (n === `object` || n === `function`) if (!e) q[Y++] = 192;
                    else {
                        if (i) {
                            let n = i.get(e);
                            if (n) {
                                n.id ||= (i.idsToInsert ||= []).push(n), q[Y++] = 214, q[Y++] = 112, J.setUint32(Y, n.id), Y += 4;
                                return;
                            } else i.set(e, {
                                offset: Y - t
                            });
                        }
                        let a = e.constructor;
                        if (a === Object) C(e);
                        else if (a === Array) v(e);
                        else if (a === Map) if (this.mapAsEmptyObject) q[Y++] = 128;
                        else {
                            r = e.size, r < 16 ? q[Y++] = 128 | r : r < 65536 ? (q[Y++] = 222, q[Y++] = r >> 8, q[Y++] = r & 255) : (q[Y++] = 223, J.setUint32(Y, r), Y += 4);
                            for (let [t, n] of e)y(t), y(n);
                        }
                        else {
                            for(let t = 0, n = Bs.length; t < n; t++){
                                let n = Vs[t];
                                if (e instanceof n) {
                                    let n = Bs[t];
                                    if (n.write) {
                                        n.type && (q[Y++] = 212, q[Y++] = n.type, q[Y++] = 0);
                                        let t = n.write.call(this, e);
                                        t === e ? Array.isArray(e) ? v(e) : C(e) : y(t);
                                        return;
                                    }
                                    let r = q, i = J, a = Y;
                                    q = null;
                                    let o;
                                    try {
                                        o = n.pack.call(this, e, (e)=>(q = r, r = null, Y += e, Y > X && w(Y), {
                                                target: q,
                                                targetView: J,
                                                position: Y - e
                                            }), y);
                                    } finally{
                                        r && (q = r, J = i, Y = a, X = q.length - 10);
                                    }
                                    o && (o.length + Y > X && w(o.length + Y), Y = Fs(o, q, Y, n.type));
                                    return;
                                }
                            }
                            if (Array.isArray(e)) v(e);
                            else {
                                if (e.toJSON) {
                                    let t = e.toJSON();
                                    if (t !== e) return y(t);
                                }
                                if (n === `function`) return y(this.writeFunction && this.writeFunction(e));
                                C(e);
                            }
                        }
                    }
                    else if (n === `boolean`) q[Y++] = e ? 195 : 194;
                    else if (n === `bigint`) {
                        if (e < 0x8000000000000000 && e >= -0x8000000000000000) q[Y++] = 211, J.setBigInt64(Y, e);
                        else if (e < 0x10000000000000000 && e > 0) q[Y++] = 207, J.setBigUint64(Y, e);
                        else if (this.largeBigIntToFloat) q[Y++] = 203, J.setFloat64(Y, Number(e));
                        else if (this.largeBigIntToString) return y(e.toString());
                        else if (this.useBigIntExtension || this.moreTypes) {
                            let t = BigInt(e < 0 ? -1 : 0), n;
                            if (e >> BigInt(65536) === t) {
                                let r = BigInt(0x10000000000000000) - BigInt(1), i = [];
                                for(; i.push(e & r), e >> BigInt(63) !== t;)e >>= BigInt(64);
                                n = new Uint8Array(new BigUint64Array(i).buffer), n.reverse();
                            } else {
                                let t = e < 0, r = (t ? ~e : e).toString(16);
                                if (r.length % 2 ? r = `0` + r : parseInt(r.charAt(0), 16) >= 8 && (r = `00` + r), Hs) n = Buffer.from(r, `hex`);
                                else {
                                    n = new Uint8Array(r.length / 2);
                                    for(let e = 0; e < n.length; e++)n[e] = parseInt(r.slice(e * 2, e * 2 + 2), 16);
                                }
                                if (t) for(let e = 0; e < n.length; e++)n[e] = ~n[e];
                            }
                            n.length + Y > X && w(n.length + Y), Y = Fs(n, q, Y, 66);
                            return;
                        } else throw RangeError(e + ` was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string`);
                        Y += 8;
                    } else if (n === `undefined`) this.encodeUndefinedAsNil ? q[Y++] = 192 : (q[Y++] = 212, q[Y++] = 0, q[Y++] = 0);
                    else throw Error(`Unknown type: ` + n);
                }, b = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (e)=>{
                    let t;
                    if (this.skipValues) {
                        t = [];
                        for(let n in e)(typeof e.hasOwnProperty != `function` || e.hasOwnProperty(n)) && !this.skipValues.includes(e[n]) && t.push(n);
                    } else t = Object.keys(e);
                    let n = t.length;
                    n < 16 ? q[Y++] = 128 | n : n < 65536 ? (q[Y++] = 222, q[Y++] = n >> 8, q[Y++] = n & 255) : (q[Y++] = 223, J.setUint32(Y, n), Y += 4);
                    let r;
                    if (this.coercibleKeyAsNumber) for(let i = 0; i < n; i++){
                        r = t[i];
                        let n = Number(r);
                        y(isNaN(n) ? r : n), y(e[r]);
                    }
                    else for(let i = 0; i < n; i++)y(r = t[i]), y(e[r]);
                } : (e)=>{
                    q[Y++] = 222;
                    let n = Y - t;
                    Y += 2;
                    let r = 0;
                    for(let t in e)(typeof e.hasOwnProperty != `function` || e.hasOwnProperty(t)) && (y(t), y(e[t]), r++);
                    if (r > 65535) throw Error(`Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object`);
                    q[n++ + t] = r >> 8, q[n + t] = r & 255;
                }, x = this.useRecords === !1 ? b : e.progressiveRecords && !d ? (e)=>{
                    let n, i = r.transitions ||= Object.create(null), a = Y++ - t, o;
                    for(let s in e)if (typeof e.hasOwnProperty != `function` || e.hasOwnProperty(s)) {
                        if (n = i[s], n) i = n;
                        else {
                            let c = Object.keys(e), l = i;
                            i = r.transitions;
                            let u = 0;
                            for(let e = 0, t = c.length; e < t; e++){
                                let t = c[e];
                                n = i[t], n || (n = i[t] = Object.create(null), u++), i = n;
                            }
                            a + t + 1 == Y ? (Y--, T(i, c, u)) : E(i, c, a, u), o = !0, i = l[s];
                        }
                        y(e[s]);
                    }
                    if (!o) {
                        let n = i[Xs];
                        n ? q[a + t] = n : E(i, Object.keys(e), a, 0);
                    }
                } : (e)=>{
                    let t, n = r.transitions ||= Object.create(null), i = 0;
                    for(let r in e)(typeof e.hasOwnProperty != `function` || e.hasOwnProperty(r)) && (t = n[r], t || (t = n[r] = Object.create(null), i++), n = t);
                    let a = n[Xs];
                    a ? a >= 96 && d ? (q[Y++] = ((a -= 96) & 31) + 96, q[Y++] = a >> 5) : q[Y++] = a : T(n, n.__keys__ || Object.keys(e), i);
                    for(let t in e)(typeof e.hasOwnProperty != `function` || e.hasOwnProperty(t)) && y(e[t]);
                }, S = typeof this.useRecords == `function` && this.useRecords, C = S ? (e)=>{
                    S(e) ? x(e) : b(e);
                } : x, w = (e)=>{
                    let n;
                    if (e > 16777216) {
                        if (e - t > Gs) throw Error(`Packed buffer would be larger than maximum buffer size`);
                        n = Math.min(Gs, Math.round(Math.max((e - t) * (e > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096);
                    } else n = (Math.max(e - t << 2, q.length - 1) >> 12) + 1 << 12;
                    let r = new Us(n);
                    return J = r.dataView ||= new DataView(r.buffer, 0, n), e = Math.min(e, q.length), q.copy ? q.copy(r, 0, t, e) : r.set(q.slice(t, e)), Y -= t, t = 0, X = r.length - 10, q = r;
                }, T = (e, t, i)=>{
                    let a = r.nextId;
                    a ||= 64, a < f && this.shouldShareStructure && !this.shouldShareStructure(t) ? (a = r.nextOwnId, a < p || (a = f), r.nextOwnId = a + 1) : (a >= p && (a = f), r.nextId = a + 1);
                    let o = t.highByte = a >= 96 && d ? a - 96 >> 5 : -1;
                    e[Xs] = a, e.__keys__ = t, r[a - 64] = t, a < f ? (t.isShared = !0, r.sharedLength = a - 63, n = !0, o >= 0 ? (q[Y++] = (a & 31) + 96, q[Y++] = o) : q[Y++] = a) : (o >= 0 ? (q[Y++] = 213, q[Y++] = 114, q[Y++] = (a & 31) + 96, q[Y++] = o) : (q[Y++] = 212, q[Y++] = 114, q[Y++] = a), i && (h += g * i), m.length >= u && (m.shift()[Xs] = 0), m.push(e), y(t));
                }, E = (e, n, r, i)=>{
                    let a = q, o = Y, s = X, c = t;
                    q = Ks, Y = 0, t = 0, q || (Ks = q = new Us(8192)), X = q.length - 10, T(e, n, i), Ks = q;
                    let l = Y;
                    if (q = a, Y = o, X = s, t = c, l > 1) {
                        let e = Y + l - 1;
                        e > X && w(e);
                        let n = r + t;
                        q.copyWithin(n + l, n + 1, Y), q.set(Ks.slice(0, l), n), Y = e;
                    } else q[r + t] = Ks[0];
                }, D = (e)=>{
                    let i = qs(e, q, t, Y, r, w, (e, t, r)=>{
                        if (r) return n = !0;
                        Y = t;
                        let i = q;
                        return y(e), _(), i === q ? Y : {
                            position: Y,
                            targetView: J,
                            target: q
                        };
                    }, this);
                    if (i === 0) return C(e);
                    Y = i;
                };
            }
            useBuffer(e) {
                q = e, q.dataView ||= new DataView(q.buffer, q.byteOffset, q.byteLength), J = q.dataView, Y = 0;
            }
            set position(e) {
                Y = e;
            }
            get position() {
                return Y;
            }
            clearSharedData() {
                this.structures &&= [], this.typedStructs &&= [];
            }
        }, Vs = [
            Date,
            Set,
            Error,
            RegExp,
            ArrayBuffer,
            Object.getPrototypeOf(Uint8Array.prototype).constructor,
            DataView,
            ss
        ], Bs = [
            {
                pack (e, t, n) {
                    let r = e.getTime() / 1e3;
                    if ((this.useTimestamp32 || e.getMilliseconds() === 0) && r >= 0 && r < 4294967296) {
                        let { target: e, targetView: n, position: i } = t(6);
                        e[i++] = 214, e[i++] = 255, n.setUint32(i, r);
                    } else if (r > 0 && r < 4294967296) {
                        let { target: n, targetView: i, position: a } = t(10);
                        n[a++] = 215, n[a++] = 255, i.setUint32(a, e.getMilliseconds() * 4e6 + (r / 1e3 / 4294967296 >> 0)), i.setUint32(a + 4, r);
                    } else if (isNaN(r)) {
                        if (this.onInvalidDate) return t(0), n(this.onInvalidDate());
                        let { target: e, targetView: r, position: i } = t(3);
                        e[i++] = 212, e[i++] = 255, e[i++] = 255;
                    } else {
                        let { target: n, targetView: i, position: a } = t(15);
                        n[a++] = 199, n[a++] = 12, n[a++] = 255, i.setUint32(a, e.getMilliseconds() * 1e6), i.setBigInt64(a + 4, BigInt(Math.floor(r)));
                    }
                }
            },
            {
                pack (e, t, n) {
                    if (this.setAsEmptyObject) return t(0), n({});
                    let r = Array.from(e), { target: i, position: a } = t(this.moreTypes ? 3 : 0);
                    this.moreTypes && (i[a++] = 212, i[a++] = 115, i[a++] = 0), n(r);
                }
            },
            {
                pack (e, t, n) {
                    let { target: r, position: i } = t(this.moreTypes ? 3 : 0);
                    this.moreTypes && (r[i++] = 212, r[i++] = 101, r[i++] = 0), n([
                        e.name,
                        e.message,
                        e.cause
                    ]);
                }
            },
            {
                pack (e, t, n) {
                    let { target: r, position: i } = t(this.moreTypes ? 3 : 0);
                    this.moreTypes && (r[i++] = 212, r[i++] = 120, r[i++] = 0), n([
                        e.source,
                        e.flags
                    ]);
                }
            },
            {
                pack (e, t) {
                    this.moreTypes ? Ns(e, 16, t) : Ps(Hs ? Buffer.from(e) : new Uint8Array(e), t);
                }
            },
            {
                pack (e, t) {
                    let n = e.constructor;
                    n !== Ws && this.moreTypes ? Ns(e, ws.indexOf(n.name), t) : Ps(e, t);
                }
            },
            {
                pack (e, t) {
                    this.moreTypes ? Ns(e, 17, t) : Ps(Hs ? Buffer.from(e) : new Uint8Array(e), t);
                }
            },
            {
                pack (e, t) {
                    let { target: n, position: r } = t(1);
                    n[r] = 193;
                }
            }
        ], Qs = new Zs({
            useRecords: !1
        }), Qs.pack, Qs.pack, $s = Zs, { NEVER: ec, ALWAYS: tc, DECIMAL_ROUND: nc, DECIMAL_FIT: rc } = As;
    })), ac = e((()=>{
        ic(), Ms();
    })), oc = e((()=>{
        ic(), Ms(), ac();
    })), Q, sc = e((()=>{
        Q = class e extends Error {
            constructor(t){
                super(t), this.name = `BBApiException`, Error.captureStackTrace && Error.captureStackTrace(this, e);
            }
        };
    }));
    function cc(e) {
        if (e.bytes === void 0) throw Error(`Expected bytes in CircuitComputeVkResponse deserialization`);
        if (e.fields === void 0) throw Error(`Expected fields in CircuitComputeVkResponse deserialization`);
        if (e.hash === void 0) throw Error(`Expected hash in CircuitComputeVkResponse deserialization`);
        return {
            bytes: e.bytes,
            fields: e.fields,
            hash: e.hash
        };
    }
    function lc(e) {
        if (e.merge_proof === void 0) throw Error(`Expected merge_proof in GoblinProof deserialization`);
        if (e.eccvm_proof === void 0) throw Error(`Expected eccvm_proof in GoblinProof deserialization`);
        if (e.ipa_proof === void 0) throw Error(`Expected ipa_proof in GoblinProof deserialization`);
        if (e.translator_proof === void 0) throw Error(`Expected translator_proof in GoblinProof deserialization`);
        return {
            mergeProof: e.merge_proof,
            eccvmProof: e.eccvm_proof,
            ipaProof: e.ipa_proof,
            translatorProof: e.translator_proof
        };
    }
    function uc(e) {
        if (e.mega_proof === void 0) throw Error(`Expected mega_proof in ChonkProof deserialization`);
        if (e.goblin_proof === void 0) throw Error(`Expected goblin_proof in ChonkProof deserialization`);
        return {
            megaProof: e.mega_proof,
            goblinProof: lc(e.goblin_proof)
        };
    }
    function dc(e) {
        if (e.x === void 0) throw Error(`Expected x in GrumpkinPoint deserialization`);
        if (e.y === void 0) throw Error(`Expected y in GrumpkinPoint deserialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function fc(e) {
        if (e.x === void 0) throw Error(`Expected x in Secp256k1Point deserialization`);
        if (e.y === void 0) throw Error(`Expected y in Secp256k1Point deserialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function pc(e) {
        if (e.x === void 0) throw Error(`Expected x in Bn254G1Point deserialization`);
        if (e.y === void 0) throw Error(`Expected y in Bn254G1Point deserialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function mc(e) {
        if (e.x === void 0) throw Error(`Expected x in Bn254G2Point deserialization`);
        if (e.y === void 0) throw Error(`Expected y in Bn254G2Point deserialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function hc(e) {
        if (e.x === void 0) throw Error(`Expected x in Secp256r1Point deserialization`);
        if (e.y === void 0) throw Error(`Expected y in Secp256r1Point deserialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function gc(e) {
        if (e.public_inputs === void 0) throw Error(`Expected public_inputs in CircuitProveResponse deserialization`);
        if (e.proof === void 0) throw Error(`Expected proof in CircuitProveResponse deserialization`);
        if (e.vk === void 0) throw Error(`Expected vk in CircuitProveResponse deserialization`);
        return {
            publicInputs: e.public_inputs,
            proof: e.proof,
            vk: cc(e.vk)
        };
    }
    function _c(e) {
        if (e.num_gates === void 0) throw Error(`Expected num_gates in CircuitInfoResponse deserialization`);
        if (e.num_gates_dyadic === void 0) throw Error(`Expected num_gates_dyadic in CircuitInfoResponse deserialization`);
        if (e.num_acir_opcodes === void 0) throw Error(`Expected num_acir_opcodes in CircuitInfoResponse deserialization`);
        if (e.gates_per_opcode === void 0) throw Error(`Expected gates_per_opcode in CircuitInfoResponse deserialization`);
        return {
            numGates: e.num_gates,
            numGatesDyadic: e.num_gates_dyadic,
            numAcirOpcodes: e.num_acir_opcodes,
            gatesPerOpcode: e.gates_per_opcode
        };
    }
    function vc(e) {
        if (e.verified === void 0) throw Error(`Expected verified in CircuitVerifyResponse deserialization`);
        return {
            verified: e.verified
        };
    }
    function yc(e) {
        if (e.bytes === void 0) throw Error(`Expected bytes in ChonkComputeVkResponse deserialization`);
        if (e.fields === void 0) throw Error(`Expected fields in ChonkComputeVkResponse deserialization`);
        return {
            bytes: e.bytes,
            fields: e.fields
        };
    }
    function bc(e) {
        return {};
    }
    function xc(e) {
        return {};
    }
    function Sc(e) {
        return {};
    }
    function Cc(e) {
        if (e.proof === void 0) throw Error(`Expected proof in ChonkProveResponse deserialization`);
        return {
            proof: uc(e.proof)
        };
    }
    function wc(e) {
        if (e.valid === void 0) throw Error(`Expected valid in ChonkVerifyResponse deserialization`);
        return {
            valid: e.valid
        };
    }
    function Tc(e) {
        if (e.fields === void 0) throw Error(`Expected fields in VkAsFieldsResponse deserialization`);
        return {
            fields: e.fields
        };
    }
    function Ec(e) {
        if (e.fields === void 0) throw Error(`Expected fields in MegaVkAsFieldsResponse deserialization`);
        return {
            fields: e.fields
        };
    }
    function Dc(e) {
        if (e.solidity_code === void 0) throw Error(`Expected solidity_code in CircuitWriteSolidityVerifierResponse deserialization`);
        return {
            solidityCode: e.solidity_code
        };
    }
    function Oc(e) {
        if (e.valid === void 0) throw Error(`Expected valid in ChonkCheckPrecomputedVkResponse deserialization`);
        if (e.actual_vk === void 0) throw Error(`Expected actual_vk in ChonkCheckPrecomputedVkResponse deserialization`);
        return {
            valid: e.valid,
            actualVk: e.actual_vk
        };
    }
    function kc(e) {
        if (e.acir_opcodes === void 0) throw Error(`Expected acir_opcodes in ChonkStatsResponse deserialization`);
        if (e.circuit_size === void 0) throw Error(`Expected circuit_size in ChonkStatsResponse deserialization`);
        if (e.gates_per_opcode === void 0) throw Error(`Expected gates_per_opcode in ChonkStatsResponse deserialization`);
        return {
            acirOpcodes: e.acir_opcodes,
            circuitSize: e.circuit_size,
            gatesPerOpcode: e.gates_per_opcode
        };
    }
    function Ac(e) {
        if (e.compressed_proof === void 0) throw Error(`Expected compressed_proof in ChonkCompressProofResponse deserialization`);
        return {
            compressedProof: e.compressed_proof
        };
    }
    function jc(e) {
        if (e.proof === void 0) throw Error(`Expected proof in ChonkDecompressProofResponse deserialization`);
        return {
            proof: uc(e.proof)
        };
    }
    function Mc(e) {
        if (e.hash === void 0) throw Error(`Expected hash in Poseidon2HashResponse deserialization`);
        return {
            hash: e.hash
        };
    }
    function Nc(e) {
        if (e.outputs === void 0) throw Error(`Expected outputs in Poseidon2PermutationResponse deserialization`);
        return {
            outputs: e.outputs
        };
    }
    function Pc(e) {
        if (e.point === void 0) throw Error(`Expected point in PedersenCommitResponse deserialization`);
        return {
            point: dc(e.point)
        };
    }
    function Fc(e) {
        if (e.hash === void 0) throw Error(`Expected hash in PedersenHashResponse deserialization`);
        return {
            hash: e.hash
        };
    }
    function Ic(e) {
        if (e.hash === void 0) throw Error(`Expected hash in PedersenHashBufferResponse deserialization`);
        return {
            hash: e.hash
        };
    }
    function Lc(e) {
        if (e.hash === void 0) throw Error(`Expected hash in Blake2sResponse deserialization`);
        return {
            hash: e.hash
        };
    }
    function Rc(e) {
        if (e.field === void 0) throw Error(`Expected field in Blake2sToFieldResponse deserialization`);
        return {
            field: e.field
        };
    }
    function zc(e) {
        if (e.ciphertext === void 0) throw Error(`Expected ciphertext in AesEncryptResponse deserialization`);
        return {
            ciphertext: e.ciphertext
        };
    }
    function Bc(e) {
        if (e.plaintext === void 0) throw Error(`Expected plaintext in AesDecryptResponse deserialization`);
        return {
            plaintext: e.plaintext
        };
    }
    function Vc(e) {
        if (e.point === void 0) throw Error(`Expected point in GrumpkinMulResponse deserialization`);
        return {
            point: dc(e.point)
        };
    }
    function Hc(e) {
        if (e.point === void 0) throw Error(`Expected point in GrumpkinAddResponse deserialization`);
        return {
            point: dc(e.point)
        };
    }
    function Uc(e) {
        if (e.points === void 0) throw Error(`Expected points in GrumpkinBatchMulResponse deserialization`);
        return {
            points: e.points.map((e)=>dc(e))
        };
    }
    function Wc(e) {
        if (e.value === void 0) throw Error(`Expected value in GrumpkinGetRandomFrResponse deserialization`);
        return {
            value: e.value
        };
    }
    function Gc(e) {
        if (e.value === void 0) throw Error(`Expected value in GrumpkinReduce512Response deserialization`);
        return {
            value: e.value
        };
    }
    function Kc(e) {
        if (e.point === void 0) throw Error(`Expected point in Secp256k1MulResponse deserialization`);
        return {
            point: fc(e.point)
        };
    }
    function qc(e) {
        if (e.value === void 0) throw Error(`Expected value in Secp256k1GetRandomFrResponse deserialization`);
        return {
            value: e.value
        };
    }
    function Jc(e) {
        if (e.value === void 0) throw Error(`Expected value in Secp256k1Reduce512Response deserialization`);
        return {
            value: e.value
        };
    }
    function Yc(e) {
        if (e.is_square_root === void 0) throw Error(`Expected is_square_root in Bn254FrSqrtResponse deserialization`);
        if (e.value === void 0) throw Error(`Expected value in Bn254FrSqrtResponse deserialization`);
        return {
            isSquareRoot: e.is_square_root,
            value: e.value
        };
    }
    function Xc(e) {
        if (e.is_square_root === void 0) throw Error(`Expected is_square_root in Bn254FqSqrtResponse deserialization`);
        if (e.value === void 0) throw Error(`Expected value in Bn254FqSqrtResponse deserialization`);
        return {
            isSquareRoot: e.is_square_root,
            value: e.value
        };
    }
    function Zc(e) {
        if (e.point === void 0) throw Error(`Expected point in Bn254G1MulResponse deserialization`);
        return {
            point: pc(e.point)
        };
    }
    function Qc(e) {
        if (e.point === void 0) throw Error(`Expected point in Bn254G2MulResponse deserialization`);
        return {
            point: mc(e.point)
        };
    }
    function $c(e) {
        if (e.is_on_curve === void 0) throw Error(`Expected is_on_curve in Bn254G1IsOnCurveResponse deserialization`);
        return {
            isOnCurve: e.is_on_curve
        };
    }
    function el(e) {
        if (e.point === void 0) throw Error(`Expected point in Bn254G1FromCompressedResponse deserialization`);
        return {
            point: pc(e.point)
        };
    }
    function tl(e) {
        if (e.public_key === void 0) throw Error(`Expected public_key in SchnorrComputePublicKeyResponse deserialization`);
        return {
            publicKey: dc(e.public_key)
        };
    }
    function nl(e) {
        if (e.s === void 0) throw Error(`Expected s in SchnorrConstructSignatureResponse deserialization`);
        if (e.e === void 0) throw Error(`Expected e in SchnorrConstructSignatureResponse deserialization`);
        return {
            s: e.s,
            e: e.e
        };
    }
    function rl(e) {
        if (e.verified === void 0) throw Error(`Expected verified in SchnorrVerifySignatureResponse deserialization`);
        return {
            verified: e.verified
        };
    }
    function il(e) {
        if (e.public_key === void 0) throw Error(`Expected public_key in EcdsaSecp256k1ComputePublicKeyResponse deserialization`);
        return {
            publicKey: fc(e.public_key)
        };
    }
    function al(e) {
        if (e.public_key === void 0) throw Error(`Expected public_key in EcdsaSecp256r1ComputePublicKeyResponse deserialization`);
        return {
            publicKey: hc(e.public_key)
        };
    }
    function ol(e) {
        if (e.r === void 0) throw Error(`Expected r in EcdsaSecp256k1ConstructSignatureResponse deserialization`);
        if (e.s === void 0) throw Error(`Expected s in EcdsaSecp256k1ConstructSignatureResponse deserialization`);
        if (e.v === void 0) throw Error(`Expected v in EcdsaSecp256k1ConstructSignatureResponse deserialization`);
        return {
            r: e.r,
            s: e.s,
            v: e.v
        };
    }
    function sl(e) {
        if (e.r === void 0) throw Error(`Expected r in EcdsaSecp256r1ConstructSignatureResponse deserialization`);
        if (e.s === void 0) throw Error(`Expected s in EcdsaSecp256r1ConstructSignatureResponse deserialization`);
        if (e.v === void 0) throw Error(`Expected v in EcdsaSecp256r1ConstructSignatureResponse deserialization`);
        return {
            r: e.r,
            s: e.s,
            v: e.v
        };
    }
    function cl(e) {
        if (e.public_key === void 0) throw Error(`Expected public_key in EcdsaSecp256k1RecoverPublicKeyResponse deserialization`);
        return {
            publicKey: fc(e.public_key)
        };
    }
    function ll(e) {
        if (e.public_key === void 0) throw Error(`Expected public_key in EcdsaSecp256r1RecoverPublicKeyResponse deserialization`);
        return {
            publicKey: hc(e.public_key)
        };
    }
    function ul(e) {
        if (e.verified === void 0) throw Error(`Expected verified in EcdsaSecp256k1VerifySignatureResponse deserialization`);
        return {
            verified: e.verified
        };
    }
    function dl(e) {
        if (e.verified === void 0) throw Error(`Expected verified in EcdsaSecp256r1VerifySignatureResponse deserialization`);
        return {
            verified: e.verified
        };
    }
    function fl(e) {
        if (e.dummy === void 0) throw Error(`Expected dummy in SrsInitSrsResponse deserialization`);
        return {
            dummy: e.dummy
        };
    }
    function pl(e) {
        if (e.dummy === void 0) throw Error(`Expected dummy in SrsInitGrumpkinSrsResponse deserialization`);
        return {
            dummy: e.dummy
        };
    }
    function ml(e) {
        return {};
    }
    function hl(e) {
        if (e.name === void 0) throw Error(`Expected name in CircuitInput serialization`);
        if (e.bytecode === void 0) throw Error(`Expected bytecode in CircuitInput serialization`);
        if (e.verificationKey === void 0) throw Error(`Expected verificationKey in CircuitInput serialization`);
        return {
            name: e.name,
            bytecode: e.bytecode,
            verification_key: e.verificationKey
        };
    }
    function gl(e) {
        if (e.ipaAccumulation === void 0) throw Error(`Expected ipaAccumulation in ProofSystemSettings serialization`);
        if (e.oracleHashType === void 0) throw Error(`Expected oracleHashType in ProofSystemSettings serialization`);
        if (e.disableZk === void 0) throw Error(`Expected disableZk in ProofSystemSettings serialization`);
        if (e.optimizedSolidityVerifier === void 0) throw Error(`Expected optimizedSolidityVerifier in ProofSystemSettings serialization`);
        return {
            ipa_accumulation: e.ipaAccumulation,
            oracle_hash_type: e.oracleHashType,
            disable_zk: e.disableZk,
            optimized_solidity_verifier: e.optimizedSolidityVerifier
        };
    }
    function _l(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in CircuitProve serialization`);
        if (e.witness === void 0) throw Error(`Expected witness in CircuitProve serialization`);
        if (e.settings === void 0) throw Error(`Expected settings in CircuitProve serialization`);
        return {
            circuit: hl(e.circuit),
            witness: e.witness,
            settings: gl(e.settings)
        };
    }
    function vl(e) {
        if (e.name === void 0) throw Error(`Expected name in CircuitInputNoVK serialization`);
        if (e.bytecode === void 0) throw Error(`Expected bytecode in CircuitInputNoVK serialization`);
        return {
            name: e.name,
            bytecode: e.bytecode
        };
    }
    function yl(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in CircuitComputeVk serialization`);
        if (e.settings === void 0) throw Error(`Expected settings in CircuitComputeVk serialization`);
        return {
            circuit: vl(e.circuit),
            settings: gl(e.settings)
        };
    }
    function bl(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in CircuitStats serialization`);
        if (e.includeGatesPerOpcode === void 0) throw Error(`Expected includeGatesPerOpcode in CircuitStats serialization`);
        if (e.settings === void 0) throw Error(`Expected settings in CircuitStats serialization`);
        return {
            circuit: hl(e.circuit),
            include_gates_per_opcode: e.includeGatesPerOpcode,
            settings: gl(e.settings)
        };
    }
    function xl(e) {
        if (e.verificationKey === void 0) throw Error(`Expected verificationKey in CircuitVerify serialization`);
        if (e.publicInputs === void 0) throw Error(`Expected publicInputs in CircuitVerify serialization`);
        if (e.proof === void 0) throw Error(`Expected proof in CircuitVerify serialization`);
        if (e.settings === void 0) throw Error(`Expected settings in CircuitVerify serialization`);
        return {
            verification_key: e.verificationKey,
            public_inputs: e.publicInputs,
            proof: e.proof,
            settings: gl(e.settings)
        };
    }
    function Sl(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in ChonkComputeVk serialization`);
        return {
            circuit: vl(e.circuit)
        };
    }
    function Cl(e) {
        if (e.numCircuits === void 0) throw Error(`Expected numCircuits in ChonkStart serialization`);
        return {
            num_circuits: e.numCircuits
        };
    }
    function wl(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in ChonkLoad serialization`);
        return {
            circuit: hl(e.circuit)
        };
    }
    function Tl(e) {
        if (e.witness === void 0) throw Error(`Expected witness in ChonkAccumulate serialization`);
        return {
            witness: e.witness
        };
    }
    function El(e) {
        return {};
    }
    function Dl(e) {
        if (e.mergeProof === void 0) throw Error(`Expected mergeProof in GoblinProof serialization`);
        if (e.eccvmProof === void 0) throw Error(`Expected eccvmProof in GoblinProof serialization`);
        if (e.ipaProof === void 0) throw Error(`Expected ipaProof in GoblinProof serialization`);
        if (e.translatorProof === void 0) throw Error(`Expected translatorProof in GoblinProof serialization`);
        return {
            merge_proof: e.mergeProof,
            eccvm_proof: e.eccvmProof,
            ipa_proof: e.ipaProof,
            translator_proof: e.translatorProof
        };
    }
    function Ol(e) {
        if (e.megaProof === void 0) throw Error(`Expected megaProof in ChonkProof serialization`);
        if (e.goblinProof === void 0) throw Error(`Expected goblinProof in ChonkProof serialization`);
        return {
            mega_proof: e.megaProof,
            goblin_proof: Dl(e.goblinProof)
        };
    }
    function kl(e) {
        if (e.proof === void 0) throw Error(`Expected proof in ChonkVerify serialization`);
        if (e.vk === void 0) throw Error(`Expected vk in ChonkVerify serialization`);
        return {
            proof: Ol(e.proof),
            vk: e.vk
        };
    }
    function Al(e) {
        if (e.verificationKey === void 0) throw Error(`Expected verificationKey in VkAsFields serialization`);
        return {
            verification_key: e.verificationKey
        };
    }
    function jl(e) {
        if (e.verificationKey === void 0) throw Error(`Expected verificationKey in MegaVkAsFields serialization`);
        return {
            verification_key: e.verificationKey
        };
    }
    function Ml(e) {
        if (e.verificationKey === void 0) throw Error(`Expected verificationKey in CircuitWriteSolidityVerifier serialization`);
        if (e.settings === void 0) throw Error(`Expected settings in CircuitWriteSolidityVerifier serialization`);
        return {
            verification_key: e.verificationKey,
            settings: gl(e.settings)
        };
    }
    function Nl(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in ChonkCheckPrecomputedVk serialization`);
        return {
            circuit: hl(e.circuit)
        };
    }
    function Pl(e) {
        if (e.circuit === void 0) throw Error(`Expected circuit in ChonkStats serialization`);
        if (e.includeGatesPerOpcode === void 0) throw Error(`Expected includeGatesPerOpcode in ChonkStats serialization`);
        return {
            circuit: vl(e.circuit),
            include_gates_per_opcode: e.includeGatesPerOpcode
        };
    }
    function Fl(e) {
        if (e.proof === void 0) throw Error(`Expected proof in ChonkCompressProof serialization`);
        return {
            proof: Ol(e.proof)
        };
    }
    function Il(e) {
        if (e.compressedProof === void 0) throw Error(`Expected compressedProof in ChonkDecompressProof serialization`);
        return {
            compressed_proof: e.compressedProof
        };
    }
    function Ll(e) {
        if (e.inputs === void 0) throw Error(`Expected inputs in Poseidon2Hash serialization`);
        return {
            inputs: e.inputs
        };
    }
    function Rl(e) {
        if (e.inputs === void 0) throw Error(`Expected inputs in Poseidon2Permutation serialization`);
        return {
            inputs: e.inputs
        };
    }
    function zl(e) {
        if (e.inputs === void 0) throw Error(`Expected inputs in PedersenCommit serialization`);
        if (e.hashIndex === void 0) throw Error(`Expected hashIndex in PedersenCommit serialization`);
        return {
            inputs: e.inputs,
            hash_index: e.hashIndex
        };
    }
    function Bl(e) {
        if (e.inputs === void 0) throw Error(`Expected inputs in PedersenHash serialization`);
        if (e.hashIndex === void 0) throw Error(`Expected hashIndex in PedersenHash serialization`);
        return {
            inputs: e.inputs,
            hash_index: e.hashIndex
        };
    }
    function Vl(e) {
        if (e.input === void 0) throw Error(`Expected input in PedersenHashBuffer serialization`);
        if (e.hashIndex === void 0) throw Error(`Expected hashIndex in PedersenHashBuffer serialization`);
        return {
            input: e.input,
            hash_index: e.hashIndex
        };
    }
    function Hl(e) {
        if (e.data === void 0) throw Error(`Expected data in Blake2s serialization`);
        return {
            data: e.data
        };
    }
    function Ul(e) {
        if (e.data === void 0) throw Error(`Expected data in Blake2sToField serialization`);
        return {
            data: e.data
        };
    }
    function Wl(e) {
        if (e.plaintext === void 0) throw Error(`Expected plaintext in AesEncrypt serialization`);
        if (e.iv === void 0) throw Error(`Expected iv in AesEncrypt serialization`);
        if (e.key === void 0) throw Error(`Expected key in AesEncrypt serialization`);
        if (e.length === void 0) throw Error(`Expected length in AesEncrypt serialization`);
        return {
            plaintext: e.plaintext,
            iv: e.iv,
            key: e.key,
            length: e.length
        };
    }
    function Gl(e) {
        if (e.ciphertext === void 0) throw Error(`Expected ciphertext in AesDecrypt serialization`);
        if (e.iv === void 0) throw Error(`Expected iv in AesDecrypt serialization`);
        if (e.key === void 0) throw Error(`Expected key in AesDecrypt serialization`);
        if (e.length === void 0) throw Error(`Expected length in AesDecrypt serialization`);
        return {
            ciphertext: e.ciphertext,
            iv: e.iv,
            key: e.key,
            length: e.length
        };
    }
    function Kl(e) {
        if (e.x === void 0) throw Error(`Expected x in GrumpkinPoint serialization`);
        if (e.y === void 0) throw Error(`Expected y in GrumpkinPoint serialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function ql(e) {
        if (e.point === void 0) throw Error(`Expected point in GrumpkinMul serialization`);
        if (e.scalar === void 0) throw Error(`Expected scalar in GrumpkinMul serialization`);
        return {
            point: Kl(e.point),
            scalar: e.scalar
        };
    }
    function Jl(e) {
        if (e.pointA === void 0) throw Error(`Expected pointA in GrumpkinAdd serialization`);
        if (e.pointB === void 0) throw Error(`Expected pointB in GrumpkinAdd serialization`);
        return {
            point_a: Kl(e.pointA),
            point_b: Kl(e.pointB)
        };
    }
    function Yl(e) {
        if (e.points === void 0) throw Error(`Expected points in GrumpkinBatchMul serialization`);
        if (e.scalar === void 0) throw Error(`Expected scalar in GrumpkinBatchMul serialization`);
        return {
            points: e.points.map((e)=>Kl(e)),
            scalar: e.scalar
        };
    }
    function Xl(e) {
        if (e.dummy === void 0) throw Error(`Expected dummy in GrumpkinGetRandomFr serialization`);
        return {
            dummy: e.dummy
        };
    }
    function Zl(e) {
        if (e.input === void 0) throw Error(`Expected input in GrumpkinReduce512 serialization`);
        return {
            input: e.input
        };
    }
    function Ql(e) {
        if (e.x === void 0) throw Error(`Expected x in Secp256k1Point serialization`);
        if (e.y === void 0) throw Error(`Expected y in Secp256k1Point serialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function $l(e) {
        if (e.point === void 0) throw Error(`Expected point in Secp256k1Mul serialization`);
        if (e.scalar === void 0) throw Error(`Expected scalar in Secp256k1Mul serialization`);
        return {
            point: Ql(e.point),
            scalar: e.scalar
        };
    }
    function eu(e) {
        if (e.dummy === void 0) throw Error(`Expected dummy in Secp256k1GetRandomFr serialization`);
        return {
            dummy: e.dummy
        };
    }
    function tu(e) {
        if (e.input === void 0) throw Error(`Expected input in Secp256k1Reduce512 serialization`);
        return {
            input: e.input
        };
    }
    function nu(e) {
        if (e.input === void 0) throw Error(`Expected input in Bn254FrSqrt serialization`);
        return {
            input: e.input
        };
    }
    function ru(e) {
        if (e.input === void 0) throw Error(`Expected input in Bn254FqSqrt serialization`);
        return {
            input: e.input
        };
    }
    function iu(e) {
        if (e.x === void 0) throw Error(`Expected x in Bn254G1Point serialization`);
        if (e.y === void 0) throw Error(`Expected y in Bn254G1Point serialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function au(e) {
        if (e.point === void 0) throw Error(`Expected point in Bn254G1Mul serialization`);
        if (e.scalar === void 0) throw Error(`Expected scalar in Bn254G1Mul serialization`);
        return {
            point: iu(e.point),
            scalar: e.scalar
        };
    }
    function ou(e) {
        if (e.x === void 0) throw Error(`Expected x in Bn254G2Point serialization`);
        if (e.y === void 0) throw Error(`Expected y in Bn254G2Point serialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function su(e) {
        if (e.point === void 0) throw Error(`Expected point in Bn254G2Mul serialization`);
        if (e.scalar === void 0) throw Error(`Expected scalar in Bn254G2Mul serialization`);
        return {
            point: ou(e.point),
            scalar: e.scalar
        };
    }
    function cu(e) {
        if (e.point === void 0) throw Error(`Expected point in Bn254G1IsOnCurve serialization`);
        return {
            point: iu(e.point)
        };
    }
    function lu(e) {
        if (e.compressed === void 0) throw Error(`Expected compressed in Bn254G1FromCompressed serialization`);
        return {
            compressed: e.compressed
        };
    }
    function uu(e) {
        if (e.privateKey === void 0) throw Error(`Expected privateKey in SchnorrComputePublicKey serialization`);
        return {
            private_key: e.privateKey
        };
    }
    function du(e) {
        if (e.message === void 0) throw Error(`Expected message in SchnorrConstructSignature serialization`);
        if (e.privateKey === void 0) throw Error(`Expected privateKey in SchnorrConstructSignature serialization`);
        return {
            message: e.message,
            private_key: e.privateKey
        };
    }
    function fu(e) {
        if (e.message === void 0) throw Error(`Expected message in SchnorrVerifySignature serialization`);
        if (e.publicKey === void 0) throw Error(`Expected publicKey in SchnorrVerifySignature serialization`);
        if (e.s === void 0) throw Error(`Expected s in SchnorrVerifySignature serialization`);
        if (e.e === void 0) throw Error(`Expected e in SchnorrVerifySignature serialization`);
        return {
            message: e.message,
            public_key: Kl(e.publicKey),
            s: e.s,
            e: e.e
        };
    }
    function pu(e) {
        if (e.privateKey === void 0) throw Error(`Expected privateKey in EcdsaSecp256k1ComputePublicKey serialization`);
        return {
            private_key: e.privateKey
        };
    }
    function mu(e) {
        if (e.privateKey === void 0) throw Error(`Expected privateKey in EcdsaSecp256r1ComputePublicKey serialization`);
        return {
            private_key: e.privateKey
        };
    }
    function hu(e) {
        if (e.message === void 0) throw Error(`Expected message in EcdsaSecp256k1ConstructSignature serialization`);
        if (e.privateKey === void 0) throw Error(`Expected privateKey in EcdsaSecp256k1ConstructSignature serialization`);
        return {
            message: e.message,
            private_key: e.privateKey
        };
    }
    function gu(e) {
        if (e.message === void 0) throw Error(`Expected message in EcdsaSecp256r1ConstructSignature serialization`);
        if (e.privateKey === void 0) throw Error(`Expected privateKey in EcdsaSecp256r1ConstructSignature serialization`);
        return {
            message: e.message,
            private_key: e.privateKey
        };
    }
    function _u(e) {
        if (e.message === void 0) throw Error(`Expected message in EcdsaSecp256k1RecoverPublicKey serialization`);
        if (e.r === void 0) throw Error(`Expected r in EcdsaSecp256k1RecoverPublicKey serialization`);
        if (e.s === void 0) throw Error(`Expected s in EcdsaSecp256k1RecoverPublicKey serialization`);
        if (e.v === void 0) throw Error(`Expected v in EcdsaSecp256k1RecoverPublicKey serialization`);
        return {
            message: e.message,
            r: e.r,
            s: e.s,
            v: e.v
        };
    }
    function vu(e) {
        if (e.message === void 0) throw Error(`Expected message in EcdsaSecp256r1RecoverPublicKey serialization`);
        if (e.r === void 0) throw Error(`Expected r in EcdsaSecp256r1RecoverPublicKey serialization`);
        if (e.s === void 0) throw Error(`Expected s in EcdsaSecp256r1RecoverPublicKey serialization`);
        if (e.v === void 0) throw Error(`Expected v in EcdsaSecp256r1RecoverPublicKey serialization`);
        return {
            message: e.message,
            r: e.r,
            s: e.s,
            v: e.v
        };
    }
    function yu(e) {
        if (e.message === void 0) throw Error(`Expected message in EcdsaSecp256k1VerifySignature serialization`);
        if (e.publicKey === void 0) throw Error(`Expected publicKey in EcdsaSecp256k1VerifySignature serialization`);
        if (e.r === void 0) throw Error(`Expected r in EcdsaSecp256k1VerifySignature serialization`);
        if (e.s === void 0) throw Error(`Expected s in EcdsaSecp256k1VerifySignature serialization`);
        if (e.v === void 0) throw Error(`Expected v in EcdsaSecp256k1VerifySignature serialization`);
        return {
            message: e.message,
            public_key: Ql(e.publicKey),
            r: e.r,
            s: e.s,
            v: e.v
        };
    }
    function bu(e) {
        if (e.x === void 0) throw Error(`Expected x in Secp256r1Point serialization`);
        if (e.y === void 0) throw Error(`Expected y in Secp256r1Point serialization`);
        return {
            x: e.x,
            y: e.y
        };
    }
    function xu(e) {
        if (e.message === void 0) throw Error(`Expected message in EcdsaSecp256r1VerifySignature serialization`);
        if (e.publicKey === void 0) throw Error(`Expected publicKey in EcdsaSecp256r1VerifySignature serialization`);
        if (e.r === void 0) throw Error(`Expected r in EcdsaSecp256r1VerifySignature serialization`);
        if (e.s === void 0) throw Error(`Expected s in EcdsaSecp256r1VerifySignature serialization`);
        if (e.v === void 0) throw Error(`Expected v in EcdsaSecp256r1VerifySignature serialization`);
        return {
            message: e.message,
            public_key: bu(e.publicKey),
            r: e.r,
            s: e.s,
            v: e.v
        };
    }
    function Su(e) {
        if (e.pointsBuf === void 0) throw Error(`Expected pointsBuf in SrsInitSrs serialization`);
        if (e.numPoints === void 0) throw Error(`Expected numPoints in SrsInitSrs serialization`);
        if (e.g2Point === void 0) throw Error(`Expected g2Point in SrsInitSrs serialization`);
        return {
            points_buf: e.pointsBuf,
            num_points: e.numPoints,
            g2_point: e.g2Point
        };
    }
    function Cu(e) {
        if (e.pointsBuf === void 0) throw Error(`Expected pointsBuf in SrsInitGrumpkinSrs serialization`);
        if (e.numPoints === void 0) throw Error(`Expected numPoints in SrsInitGrumpkinSrs serialization`);
        return {
            points_buf: e.pointsBuf,
            num_points: e.numPoints
        };
    }
    function wu(e) {
        return {};
    }
    var Tu = e((()=>{}));
    async function $(e, t) {
        let n = new $s({
            useRecords: !1
        }).pack(t), r = await e.call(n);
        return new Os({
            useRecords: !1
        }).unpack(r);
    }
    var Eu, Du = e((()=>{
        oc(), sc(), Tu(), Eu = class {
            backend;
            constructor(e){
                this.backend = e;
            }
            circuitProve(e) {
                let t = _l(e);
                return $(this.backend, [
                    [
                        `CircuitProve`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `CircuitProveResponse`) throw new Q(`Expected variant name 'CircuitProveResponse' but got '${e}'`);
                    return gc(t);
                });
            }
            circuitComputeVk(e) {
                let t = yl(e);
                return $(this.backend, [
                    [
                        `CircuitComputeVk`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `CircuitComputeVkResponse`) throw new Q(`Expected variant name 'CircuitComputeVkResponse' but got '${e}'`);
                    return cc(t);
                });
            }
            circuitStats(e) {
                let t = bl(e);
                return $(this.backend, [
                    [
                        `CircuitStats`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `CircuitInfoResponse`) throw new Q(`Expected variant name 'CircuitInfoResponse' but got '${e}'`);
                    return _c(t);
                });
            }
            circuitVerify(e) {
                let t = xl(e);
                return $(this.backend, [
                    [
                        `CircuitVerify`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `CircuitVerifyResponse`) throw new Q(`Expected variant name 'CircuitVerifyResponse' but got '${e}'`);
                    return vc(t);
                });
            }
            chonkComputeVk(e) {
                let t = Sl(e);
                return $(this.backend, [
                    [
                        `ChonkComputeVk`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkComputeVkResponse`) throw new Q(`Expected variant name 'ChonkComputeVkResponse' but got '${e}'`);
                    return yc(t);
                });
            }
            chonkStart(e) {
                let t = Cl(e);
                return $(this.backend, [
                    [
                        `ChonkStart`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkStartResponse`) throw new Q(`Expected variant name 'ChonkStartResponse' but got '${e}'`);
                    return bc(t);
                });
            }
            chonkLoad(e) {
                let t = wl(e);
                return $(this.backend, [
                    [
                        `ChonkLoad`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkLoadResponse`) throw new Q(`Expected variant name 'ChonkLoadResponse' but got '${e}'`);
                    return xc(t);
                });
            }
            chonkAccumulate(e) {
                let t = Tl(e);
                return $(this.backend, [
                    [
                        `ChonkAccumulate`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkAccumulateResponse`) throw new Q(`Expected variant name 'ChonkAccumulateResponse' but got '${e}'`);
                    return Sc(t);
                });
            }
            chonkProve(e) {
                let t = El(e);
                return $(this.backend, [
                    [
                        `ChonkProve`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkProveResponse`) throw new Q(`Expected variant name 'ChonkProveResponse' but got '${e}'`);
                    return Cc(t);
                });
            }
            chonkVerify(e) {
                let t = kl(e);
                return $(this.backend, [
                    [
                        `ChonkVerify`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkVerifyResponse`) throw new Q(`Expected variant name 'ChonkVerifyResponse' but got '${e}'`);
                    return wc(t);
                });
            }
            vkAsFields(e) {
                let t = Al(e);
                return $(this.backend, [
                    [
                        `VkAsFields`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `VkAsFieldsResponse`) throw new Q(`Expected variant name 'VkAsFieldsResponse' but got '${e}'`);
                    return Tc(t);
                });
            }
            megaVkAsFields(e) {
                let t = jl(e);
                return $(this.backend, [
                    [
                        `MegaVkAsFields`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `MegaVkAsFieldsResponse`) throw new Q(`Expected variant name 'MegaVkAsFieldsResponse' but got '${e}'`);
                    return Ec(t);
                });
            }
            circuitWriteSolidityVerifier(e) {
                let t = Ml(e);
                return $(this.backend, [
                    [
                        `CircuitWriteSolidityVerifier`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `CircuitWriteSolidityVerifierResponse`) throw new Q(`Expected variant name 'CircuitWriteSolidityVerifierResponse' but got '${e}'`);
                    return Dc(t);
                });
            }
            chonkCheckPrecomputedVk(e) {
                let t = Nl(e);
                return $(this.backend, [
                    [
                        `ChonkCheckPrecomputedVk`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkCheckPrecomputedVkResponse`) throw new Q(`Expected variant name 'ChonkCheckPrecomputedVkResponse' but got '${e}'`);
                    return Oc(t);
                });
            }
            chonkStats(e) {
                let t = Pl(e);
                return $(this.backend, [
                    [
                        `ChonkStats`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkStatsResponse`) throw new Q(`Expected variant name 'ChonkStatsResponse' but got '${e}'`);
                    return kc(t);
                });
            }
            chonkCompressProof(e) {
                let t = Fl(e);
                return $(this.backend, [
                    [
                        `ChonkCompressProof`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkCompressProofResponse`) throw new Q(`Expected variant name 'ChonkCompressProofResponse' but got '${e}'`);
                    return Ac(t);
                });
            }
            chonkDecompressProof(e) {
                let t = Il(e);
                return $(this.backend, [
                    [
                        `ChonkDecompressProof`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ChonkDecompressProofResponse`) throw new Q(`Expected variant name 'ChonkDecompressProofResponse' but got '${e}'`);
                    return jc(t);
                });
            }
            poseidon2Hash(e) {
                let t = Ll(e);
                return $(this.backend, [
                    [
                        `Poseidon2Hash`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Poseidon2HashResponse`) throw new Q(`Expected variant name 'Poseidon2HashResponse' but got '${e}'`);
                    return Mc(t);
                });
            }
            poseidon2Permutation(e) {
                let t = Rl(e);
                return $(this.backend, [
                    [
                        `Poseidon2Permutation`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Poseidon2PermutationResponse`) throw new Q(`Expected variant name 'Poseidon2PermutationResponse' but got '${e}'`);
                    return Nc(t);
                });
            }
            pedersenCommit(e) {
                let t = zl(e);
                return $(this.backend, [
                    [
                        `PedersenCommit`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `PedersenCommitResponse`) throw new Q(`Expected variant name 'PedersenCommitResponse' but got '${e}'`);
                    return Pc(t);
                });
            }
            pedersenHash(e) {
                let t = Bl(e);
                return $(this.backend, [
                    [
                        `PedersenHash`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `PedersenHashResponse`) throw new Q(`Expected variant name 'PedersenHashResponse' but got '${e}'`);
                    return Fc(t);
                });
            }
            pedersenHashBuffer(e) {
                let t = Vl(e);
                return $(this.backend, [
                    [
                        `PedersenHashBuffer`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `PedersenHashBufferResponse`) throw new Q(`Expected variant name 'PedersenHashBufferResponse' but got '${e}'`);
                    return Ic(t);
                });
            }
            blake2s(e) {
                let t = Hl(e);
                return $(this.backend, [
                    [
                        `Blake2s`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Blake2sResponse`) throw new Q(`Expected variant name 'Blake2sResponse' but got '${e}'`);
                    return Lc(t);
                });
            }
            blake2sToField(e) {
                let t = Ul(e);
                return $(this.backend, [
                    [
                        `Blake2sToField`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Blake2sToFieldResponse`) throw new Q(`Expected variant name 'Blake2sToFieldResponse' but got '${e}'`);
                    return Rc(t);
                });
            }
            aesEncrypt(e) {
                let t = Wl(e);
                return $(this.backend, [
                    [
                        `AesEncrypt`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `AesEncryptResponse`) throw new Q(`Expected variant name 'AesEncryptResponse' but got '${e}'`);
                    return zc(t);
                });
            }
            aesDecrypt(e) {
                let t = Gl(e);
                return $(this.backend, [
                    [
                        `AesDecrypt`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `AesDecryptResponse`) throw new Q(`Expected variant name 'AesDecryptResponse' but got '${e}'`);
                    return Bc(t);
                });
            }
            grumpkinMul(e) {
                let t = ql(e);
                return $(this.backend, [
                    [
                        `GrumpkinMul`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `GrumpkinMulResponse`) throw new Q(`Expected variant name 'GrumpkinMulResponse' but got '${e}'`);
                    return Vc(t);
                });
            }
            grumpkinAdd(e) {
                let t = Jl(e);
                return $(this.backend, [
                    [
                        `GrumpkinAdd`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `GrumpkinAddResponse`) throw new Q(`Expected variant name 'GrumpkinAddResponse' but got '${e}'`);
                    return Hc(t);
                });
            }
            grumpkinBatchMul(e) {
                let t = Yl(e);
                return $(this.backend, [
                    [
                        `GrumpkinBatchMul`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `GrumpkinBatchMulResponse`) throw new Q(`Expected variant name 'GrumpkinBatchMulResponse' but got '${e}'`);
                    return Uc(t);
                });
            }
            grumpkinGetRandomFr(e) {
                let t = Xl(e);
                return $(this.backend, [
                    [
                        `GrumpkinGetRandomFr`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `GrumpkinGetRandomFrResponse`) throw new Q(`Expected variant name 'GrumpkinGetRandomFrResponse' but got '${e}'`);
                    return Wc(t);
                });
            }
            grumpkinReduce512(e) {
                let t = Zl(e);
                return $(this.backend, [
                    [
                        `GrumpkinReduce512`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `GrumpkinReduce512Response`) throw new Q(`Expected variant name 'GrumpkinReduce512Response' but got '${e}'`);
                    return Gc(t);
                });
            }
            secp256k1Mul(e) {
                let t = $l(e);
                return $(this.backend, [
                    [
                        `Secp256k1Mul`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Secp256k1MulResponse`) throw new Q(`Expected variant name 'Secp256k1MulResponse' but got '${e}'`);
                    return Kc(t);
                });
            }
            secp256k1GetRandomFr(e) {
                let t = eu(e);
                return $(this.backend, [
                    [
                        `Secp256k1GetRandomFr`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Secp256k1GetRandomFrResponse`) throw new Q(`Expected variant name 'Secp256k1GetRandomFrResponse' but got '${e}'`);
                    return qc(t);
                });
            }
            secp256k1Reduce512(e) {
                let t = tu(e);
                return $(this.backend, [
                    [
                        `Secp256k1Reduce512`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Secp256k1Reduce512Response`) throw new Q(`Expected variant name 'Secp256k1Reduce512Response' but got '${e}'`);
                    return Jc(t);
                });
            }
            bn254FrSqrt(e) {
                let t = nu(e);
                return $(this.backend, [
                    [
                        `Bn254FrSqrt`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Bn254FrSqrtResponse`) throw new Q(`Expected variant name 'Bn254FrSqrtResponse' but got '${e}'`);
                    return Yc(t);
                });
            }
            bn254FqSqrt(e) {
                let t = ru(e);
                return $(this.backend, [
                    [
                        `Bn254FqSqrt`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Bn254FqSqrtResponse`) throw new Q(`Expected variant name 'Bn254FqSqrtResponse' but got '${e}'`);
                    return Xc(t);
                });
            }
            bn254G1Mul(e) {
                let t = au(e);
                return $(this.backend, [
                    [
                        `Bn254G1Mul`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Bn254G1MulResponse`) throw new Q(`Expected variant name 'Bn254G1MulResponse' but got '${e}'`);
                    return Zc(t);
                });
            }
            bn254G2Mul(e) {
                let t = su(e);
                return $(this.backend, [
                    [
                        `Bn254G2Mul`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Bn254G2MulResponse`) throw new Q(`Expected variant name 'Bn254G2MulResponse' but got '${e}'`);
                    return Qc(t);
                });
            }
            bn254G1IsOnCurve(e) {
                let t = cu(e);
                return $(this.backend, [
                    [
                        `Bn254G1IsOnCurve`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Bn254G1IsOnCurveResponse`) throw new Q(`Expected variant name 'Bn254G1IsOnCurveResponse' but got '${e}'`);
                    return $c(t);
                });
            }
            bn254G1FromCompressed(e) {
                let t = lu(e);
                return $(this.backend, [
                    [
                        `Bn254G1FromCompressed`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `Bn254G1FromCompressedResponse`) throw new Q(`Expected variant name 'Bn254G1FromCompressedResponse' but got '${e}'`);
                    return el(t);
                });
            }
            schnorrComputePublicKey(e) {
                let t = uu(e);
                return $(this.backend, [
                    [
                        `SchnorrComputePublicKey`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `SchnorrComputePublicKeyResponse`) throw new Q(`Expected variant name 'SchnorrComputePublicKeyResponse' but got '${e}'`);
                    return tl(t);
                });
            }
            schnorrConstructSignature(e) {
                let t = du(e);
                return $(this.backend, [
                    [
                        `SchnorrConstructSignature`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `SchnorrConstructSignatureResponse`) throw new Q(`Expected variant name 'SchnorrConstructSignatureResponse' but got '${e}'`);
                    return nl(t);
                });
            }
            schnorrVerifySignature(e) {
                let t = fu(e);
                return $(this.backend, [
                    [
                        `SchnorrVerifySignature`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `SchnorrVerifySignatureResponse`) throw new Q(`Expected variant name 'SchnorrVerifySignatureResponse' but got '${e}'`);
                    return rl(t);
                });
            }
            ecdsaSecp256k1ComputePublicKey(e) {
                let t = pu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256k1ComputePublicKey`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256k1ComputePublicKeyResponse`) throw new Q(`Expected variant name 'EcdsaSecp256k1ComputePublicKeyResponse' but got '${e}'`);
                    return il(t);
                });
            }
            ecdsaSecp256r1ComputePublicKey(e) {
                let t = mu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256r1ComputePublicKey`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256r1ComputePublicKeyResponse`) throw new Q(`Expected variant name 'EcdsaSecp256r1ComputePublicKeyResponse' but got '${e}'`);
                    return al(t);
                });
            }
            ecdsaSecp256k1ConstructSignature(e) {
                let t = hu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256k1ConstructSignature`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256k1ConstructSignatureResponse`) throw new Q(`Expected variant name 'EcdsaSecp256k1ConstructSignatureResponse' but got '${e}'`);
                    return ol(t);
                });
            }
            ecdsaSecp256r1ConstructSignature(e) {
                let t = gu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256r1ConstructSignature`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256r1ConstructSignatureResponse`) throw new Q(`Expected variant name 'EcdsaSecp256r1ConstructSignatureResponse' but got '${e}'`);
                    return sl(t);
                });
            }
            ecdsaSecp256k1RecoverPublicKey(e) {
                let t = _u(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256k1RecoverPublicKey`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256k1RecoverPublicKeyResponse`) throw new Q(`Expected variant name 'EcdsaSecp256k1RecoverPublicKeyResponse' but got '${e}'`);
                    return cl(t);
                });
            }
            ecdsaSecp256r1RecoverPublicKey(e) {
                let t = vu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256r1RecoverPublicKey`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256r1RecoverPublicKeyResponse`) throw new Q(`Expected variant name 'EcdsaSecp256r1RecoverPublicKeyResponse' but got '${e}'`);
                    return ll(t);
                });
            }
            ecdsaSecp256k1VerifySignature(e) {
                let t = yu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256k1VerifySignature`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256k1VerifySignatureResponse`) throw new Q(`Expected variant name 'EcdsaSecp256k1VerifySignatureResponse' but got '${e}'`);
                    return ul(t);
                });
            }
            ecdsaSecp256r1VerifySignature(e) {
                let t = xu(e);
                return $(this.backend, [
                    [
                        `EcdsaSecp256r1VerifySignature`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `EcdsaSecp256r1VerifySignatureResponse`) throw new Q(`Expected variant name 'EcdsaSecp256r1VerifySignatureResponse' but got '${e}'`);
                    return dl(t);
                });
            }
            srsInitSrs(e) {
                let t = Su(e);
                return $(this.backend, [
                    [
                        `SrsInitSrs`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `SrsInitSrsResponse`) throw new Q(`Expected variant name 'SrsInitSrsResponse' but got '${e}'`);
                    return fl(t);
                });
            }
            srsInitGrumpkinSrs(e) {
                let t = Cu(e);
                return $(this.backend, [
                    [
                        `SrsInitGrumpkinSrs`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `SrsInitGrumpkinSrsResponse`) throw new Q(`Expected variant name 'SrsInitGrumpkinSrsResponse' but got '${e}'`);
                    return pl(t);
                });
            }
            shutdown(e) {
                let t = wu(e);
                return $(this.backend, [
                    [
                        `Shutdown`,
                        t
                    ]
                ]).then(([e, t])=>{
                    if (e === `ErrorResponse`) throw new Q(t.message || `Unknown error from barretenberg`);
                    if (e !== `ShutdownResponse`) throw new Q(`Expected variant name 'ShutdownResponse' but got '${e}'`);
                    return ml(t);
                });
            }
            destroy() {
                return this.backend.destroy ? this.backend.destroy() : Promise.resolve();
            }
        };
    })), Ou = e((()=>{
        oc();
    })), ku, Au = e((()=>{
        (function(e) {
            e.Wasm = `Wasm`, e.WasmWorker = `WasmWorker`, e.NativeUnixSocket = `NativeUnixSocket`, e.NativeSharedMemory = `NativeSharedMemory`;
        })(ku ||= {});
    }));
    function ju(e, t) {
        for (let n of e)if (t === n || n === `*` || n instanceof RegExp && n.test(t)) return !0;
        return !1;
    }
    function Mu(e, t = globalThis, n = [
        `*`
    ]) {
        t.addEventListener(`message`, function r(i) {
            if (!i || !i.data) return;
            if (!ju(n, i.origin)) {
                console.warn(`Invalid origin '${i.origin}' for comlink proxy`);
                return;
            }
            let { id: a, type: o, path: s } = Object.assign({
                path: []
            }, i.data), c = (i.data.argumentList || []).map(Ku), l;
            try {
                let t = s.slice(0, -1).reduce((e, t)=>e[t], e), n = s.reduce((e, t)=>e[t], e);
                switch(o){
                    case `GET`:
                        l = n;
                        break;
                    case `SET`:
                        t[s.slice(-1)[0]] = Ku(i.data.value), l = !0;
                        break;
                    case `APPLY`:
                        l = n.apply(t, c);
                        break;
                    case `CONSTRUCT`:
                        l = Wu(new n(...c));
                        break;
                    case `ENDPOINT`:
                        {
                            let { port1: t, port2: n } = new MessageChannel;
                            Mu(e, n), l = Uu(t, [
                                t
                            ]);
                        }
                        break;
                    case `RELEASE`:
                        l = void 0;
                        break;
                    default:
                        return;
                }
            } catch (e) {
                l = {
                    value: e,
                    [$u]: 0
                };
            }
            Promise.resolve(l).catch((e)=>({
                    value: e,
                    [$u]: 0
                })).then((n)=>{
                let [i, s] = Gu(n);
                t.postMessage(Object.assign(Object.assign({}, i), {
                    id: a
                }), s), o === `RELEASE` && (t.removeEventListener(`message`, r), Pu(t), Qu in e && typeof e[Qu] == `function` && e[Qu]());
            }).catch((e)=>{
                let [n, r] = Gu({
                    value: TypeError(`Unserializable return value`),
                    [$u]: 0
                });
                t.postMessage(Object.assign(Object.assign({}, n), {
                    id: a
                }), r);
            });
        }), t.start && t.start();
    }
    function Nu(e) {
        return e.constructor.name === `MessagePort`;
    }
    function Pu(e) {
        Nu(e) && e.close();
    }
    function Fu(e, t) {
        let n = new Map;
        return e.addEventListener(`message`, function(e) {
            let { data: t } = e;
            if (!t || !t.id) return;
            let r = n.get(t.id);
            if (r) try {
                r(t);
            } finally{
                n.delete(t.id);
            }
        }), Bu(e, n, [], t);
    }
    function Iu(e) {
        if (e) throw Error(`Proxy has been released and is not useable`);
    }
    function Lu(e) {
        return qu(e, new Map, {
            type: `RELEASE`
        }).then(()=>{
            Pu(e);
        });
    }
    function Ru(e, t) {
        let n = (nd.get(t) || 0) + 1;
        nd.set(t, n), rd && rd.register(e, t, e);
    }
    function zu(e) {
        rd && rd.unregister(e);
    }
    function Bu(e, t, n = [], r = function() {}) {
        let i = !1, a = new Proxy(r, {
            get (r, o) {
                if (Iu(i), o === Zu) return ()=>{
                    zu(a), Lu(e), t.clear(), i = !0;
                };
                if (o === `then`) {
                    if (n.length === 0) return {
                        then: ()=>a
                    };
                    let r = qu(e, t, {
                        type: `GET`,
                        path: n.map((e)=>e.toString())
                    }).then(Ku);
                    return r.then.bind(r);
                }
                return Bu(e, t, [
                    ...n,
                    o
                ]);
            },
            set (r, a, o) {
                Iu(i);
                let [s, c] = Gu(o);
                return qu(e, t, {
                    type: `SET`,
                    path: [
                        ...n,
                        a
                    ].map((e)=>e.toString()),
                    value: s
                }, c).then(Ku);
            },
            apply (r, a, o) {
                Iu(i);
                let s = n[n.length - 1];
                if (s === Xu) return qu(e, t, {
                    type: `ENDPOINT`
                }).then(Ku);
                if (s === `bind`) return Bu(e, t, n.slice(0, -1));
                let [c, l] = Hu(o);
                return qu(e, t, {
                    type: `APPLY`,
                    path: n.map((e)=>e.toString()),
                    argumentList: c
                }, l).then(Ku);
            },
            construct (r, a) {
                Iu(i);
                let [o, s] = Hu(a);
                return qu(e, t, {
                    type: `CONSTRUCT`,
                    path: n.map((e)=>e.toString()),
                    argumentList: o
                }, s).then(Ku);
            }
        });
        return Ru(a, e), a;
    }
    function Vu(e) {
        return Array.prototype.concat.apply([], e);
    }
    function Hu(e) {
        let t = e.map(Gu);
        return [
            t.map((e)=>e[0]),
            Vu(t.map((e)=>e[1]))
        ];
    }
    function Uu(e, t) {
        return id.set(e, t), e;
    }
    function Wu(e) {
        return Object.assign(e, {
            [Yu]: !0
        });
    }
    function Gu(e) {
        for (let [t, n] of td)if (n.canHandle(e)) {
            let [r, i] = n.serialize(e);
            return [
                {
                    type: `HANDLER`,
                    name: t,
                    value: r
                },
                i
            ];
        }
        return [
            {
                type: `RAW`,
                value: e
            },
            id.get(e) || []
        ];
    }
    function Ku(e) {
        switch(e.type){
            case `HANDLER`:
                return td.get(e.name).deserialize(e.value);
            case `RAW`:
                return e.value;
        }
    }
    function qu(e, t, n, r) {
        return new Promise((i)=>{
            let a = Ju();
            t.set(a, i), e.start && e.start(), e.postMessage(Object.assign({
                id: a
            }, n), r);
        });
    }
    function Ju() {
        return [
            ,
            ,
            ,
            , 
        ].fill(0).map(()=>Math.floor(Math.random() * (2 ** 53 - 1)).toString(16)).join(`-`);
    }
    var Yu, Xu, Zu, Qu, $u, ed, td, nd, rd, id, ad = e((()=>{
        Yu = Symbol(`Comlink.proxy`), Xu = Symbol(`Comlink.endpoint`), Zu = Symbol(`Comlink.releaseProxy`), Qu = Symbol(`Comlink.finalizer`), $u = Symbol(`Comlink.thrown`), ed = (e)=>typeof e == `object` && !!e || typeof e == `function`, td = new Map([
            [
                `proxy`,
                {
                    canHandle: (e)=>ed(e) && e[Yu],
                    serialize (e) {
                        let { port1: t, port2: n } = new MessageChannel;
                        return Mu(e, t), [
                            n,
                            [
                                n
                            ]
                        ];
                    },
                    deserialize (e) {
                        return e.start(), Fu(e);
                    }
                }
            ],
            [
                `throw`,
                {
                    canHandle: (e)=>ed(e) && $u in e,
                    serialize ({ value: e }) {
                        let t;
                        return t = e instanceof Error ? {
                            isError: !0,
                            value: {
                                message: e.message,
                                name: e.name,
                                stack: e.stack
                            }
                        } : {
                            isError: !1,
                            value: e
                        }, [
                            t,
                            []
                        ];
                    },
                    deserialize (e) {
                        throw e.isError ? Object.assign(Error(e.value.message), e.value) : e.value;
                    }
                }
            ]
        ]), nd = new WeakMap, rd = `FinalizationRegistry` in globalThis && new FinalizationRegistry((e)=>{
            let t = (nd.get(e) || 0) - 1;
            nd.set(e, t), t === 0 && Lu(e);
        }), id = new WeakMap;
    }));
    function od() {
        let e = typeof window < `u` ? window : globalThis;
        return typeof SharedArrayBuffer < `u` && e.crossOriginIsolated;
    }
    function sd(e) {
        return Fu(e);
    }
    function cd() {
        return navigator.hardwareConcurrency;
    }
    function ld(e) {
        return typeof navigator < `u` && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : (e(`Could not detect environment to query number of threads. Falling back to one thread.`), 1);
    }
    function ud(e, t) {
        e.addEventListener(`message`, function n(r) {
            r.data && r.data.ready === !0 && (e.removeEventListener(`message`, n), t());
        });
    }
    var dd = e((()=>{
        ad();
    })), fd = e((()=>{
        dd();
    }));
    async function pd() {
        let e = new Worker(new URL(`` + new URL(`thread.worker-BE7W_srf.js`, import.meta.url).href, `` + import.meta.url), {
            type: `module`
        });
        return await new Promise((t)=>ud(e, t)), e;
    }
    var md = e((()=>{
        dd();
    })), hd, gd = e((()=>{
        hd = (e)=>{
            let t = (()=>{
                if (typeof window < `u` && window.crypto) return window.crypto;
                if (typeof globalThis < `u` && globalThis.crypto) return globalThis.crypto;
            })();
            if (!t) throw Error(`randomBytes UnsupportedEnvironment`);
            let n = new Uint8Array(e), r = 65536;
            if (e > r) for(let i = 0; i < e; i += r)t.getRandomValues(n.subarray(i, i + r));
            else t.getRandomValues(n);
            return n;
        };
    })), _d = e((()=>{
        gd();
    })), vd, yd = e((()=>{
        _d(), vd = class {
            memStore = {};
            memory;
            instance;
            logger = ()=>{};
            getImportObj(e) {
                return {
                    wasi_snapshot_preview1: {
                        random_get: (e, t)=>{
                            e >>>= 0;
                            let n = hd(t);
                            this.getMemory().set(n, e);
                        },
                        clock_time_get: (e, t, n)=>{
                            n >>>= 0;
                            let r = BigInt(new Date().getTime()) * 1000000n;
                            new DataView(this.getMemory().buffer).setBigUint64(n, r, !0);
                        },
                        proc_exit: ()=>{
                            throw this.logger(`PANIC: proc_exit was called.`), Error();
                        }
                    },
                    env: {
                        logstr: (e)=>{
                            let t = `${this.stringFromAddress(e)} (mem: ${(this.getMemory().length / (1024 * 1024)).toFixed(2)}MiB)`;
                            this.logger(t);
                        },
                        throw_or_abort_impl: (e)=>{
                            let t = this.stringFromAddress(e);
                            throw Error(t);
                        },
                        get_data: (e, t)=>{
                            let n = this.stringFromAddress(e);
                            t >>>= 0;
                            let r = this.memStore[n];
                            if (!r) {
                                this.logger(`get_data miss ${n}`);
                                return;
                            }
                            this.writeMemory(t, r);
                        },
                        set_data: (e, t, n)=>{
                            let r = this.stringFromAddress(e);
                            t >>>= 0, this.memStore[r] = this.getMemorySlice(t, t + n);
                        },
                        memory: e
                    }
                };
            }
            exports() {
                return this.instance.exports;
            }
            call(e, ...t) {
                if (!this.exports()[e]) throw Error(`WASM function ${e} not found.`);
                try {
                    return this.exports()[e](...t) >>> 0;
                } catch (t) {
                    let n = `WASM function ${e} aborted, error: ${t}`;
                    throw this.logger(n), this.logger(t.stack), t;
                }
            }
            memSize() {
                return this.getMemory().length;
            }
            getMemorySlice(e, t) {
                return this.getMemory().subarray(e, t).slice();
            }
            writeMemory(e, t) {
                this.getMemory().set(t, e);
            }
            getMemory() {
                return new Uint8Array(this.memory.buffer);
            }
            stringFromAddress(e) {
                e >>>= 0;
                let t = this.getMemory(), n = e;
                for(; t[n] !== 0; ++n);
                return new TextDecoder(`ascii`).decode(t.slice(e, n));
            }
        };
    })), bd, xd = e((()=>{
        bd = class {
            wasm;
            allocs = [];
            inScratchPtr = 0;
            outScratchPtr = 1024;
            constructor(e){
                this.wasm = e;
            }
            getInputs(e) {
                return e.map((e)=>{
                    if (typeof e == `object`) {
                        let t = e.length;
                        if (this.inScratchPtr + t <= this.outScratchPtr) {
                            let n = this.inScratchPtr;
                            return this.inScratchPtr += t, this.wasm.writeMemory(n, e), n;
                        } else {
                            let n = this.wasm.call(`bbmalloc`, t);
                            return this.wasm.writeMemory(n, e), this.allocs.push(n), n;
                        }
                    } else return e;
                });
            }
            getOutputPtrs(e) {
                return e.map((e)=>{
                    let t = e || 4;
                    if (this.inScratchPtr + t <= this.outScratchPtr) return this.outScratchPtr -= t, this.outScratchPtr;
                    {
                        let e = this.wasm.call(`bbmalloc`, t);
                        return this.allocs.push(e), e;
                    }
                });
            }
            addOutputPtr(e) {
                e >= 1024 && this.allocs.push(e);
            }
            freeAll() {
                for (let e of this.allocs)this.wasm.call(`bbfree`, e);
            }
        };
    })), Sd, Cd = e((()=>{
        fd(), md(), yd(), xd(), Sd = class e extends vd {
            static MAX_THREADS = 32;
            workers = [];
            remoteWasms = [];
            nextWorker = 0;
            nextThreadId = 1;
            useCustomLogger = !1;
            msgpackInputScratch = 0;
            msgpackOutputScratch = 0;
            MSGPACK_SCRATCH_SIZE = 1024 * 1024 * 8;
            getNumThreads() {
                return this.workers.length + 1;
            }
            async init(t, n = Math.min(cd(), e.MAX_THREADS), r, i = 35, a = this.getDefaultMaximumMemoryPages()) {
                this.useCustomLogger = r !== void 0, this.logger = r ?? (()=>{});
                let o = i * 2 ** 16 / (1024 * 1024), s = a * 2 ** 16 / (1024 * 1024), c = od();
                this.logger(`Initializing bb wasm: initial memory ${i} pages ${o}MiB; max memory: ${a} pages, ${s}MiB; threads: ${n}; shared memory: ${c}`), this.memory = new WebAssembly.Memory({
                    initial: i,
                    maximum: a,
                    shared: c
                });
                let l = await WebAssembly.instantiate(t, this.getImportObj(this.memory));
                this.instance = l, this.call(`_initialize`), this.msgpackInputScratch = this.call(`bbmalloc`, this.MSGPACK_SCRATCH_SIZE), this.msgpackOutputScratch = this.call(`bbmalloc`, this.MSGPACK_SCRATCH_SIZE), this.logger(`Allocated msgpack scratch buffers: input @ ${this.msgpackInputScratch}, output @ ${this.msgpackOutputScratch} (${this.MSGPACK_SCRATCH_SIZE} bytes each)`), n > 1 && (this.logger(`Creating ${n} worker threads`), this.workers = await Promise.all(Array.from({
                    length: n - 1
                }).map(pd)), this.useCustomLogger && this.workers.forEach((e)=>this.setupWorkerLogForwarding(e)), this.remoteWasms = await Promise.all(this.workers.map(sd)), await Promise.all(this.remoteWasms.map((e)=>e.initThread(t, this.memory, this.useCustomLogger))));
            }
            getDefaultMaximumMemoryPages() {
                return typeof self < `u` && self.navigator !== void 0 && /iPad|iPhone/.test(self.navigator.userAgent) ? 2 ** 14 : 2 ** 16;
            }
            setupWorkerLogForwarding(e) {
                let t = (e)=>{
                    e && typeof e == `object` && `type` in e && e.type === `log` && `msg` in e && this.logger(e.msg);
                };
                `on` in e && typeof e.on == `function` ? e.on(`message`, t) : `addEventListener` in e && e.addEventListener(`message`, (e)=>{
                    t(e.data);
                });
            }
            async destroy() {
                await Promise.all(this.workers.map((e)=>e.terminate()));
            }
            getImportObj(e) {
                let t = super.getImportObj(e);
                return {
                    ...t,
                    wasi: {
                        "thread-spawn": (e)=>{
                            e >>>= 0;
                            let t = this.nextThreadId++, n = this.nextWorker++ % this.remoteWasms.length;
                            return this.remoteWasms[n].call(`wasi_thread_start`, t, e).catch(this.logger), t;
                        }
                    },
                    env: {
                        ...t.env,
                        env_hardware_concurrency: ()=>this.remoteWasms.length + 1
                    }
                };
            }
            callWasmExport(e, t, n) {
                let r = new bd(this), i = r.getInputs(t), a = r.getOutputPtrs(n);
                this.call(e, ...i, ...a);
                let o = this.getOutputArgs(n, a, r);
                return r.freeAll(), o;
            }
            getOutputArgs(e, t, n) {
                return e.map((e, r)=>{
                    if (e) return this.getMemorySlice(t[r], t[r] + e);
                    let i = this.getMemorySlice(t[r], t[r] + 4), a = new DataView(i.buffer, i.byteOffset, i.byteLength).getUint32(0, !0);
                    n.addOutputPtr(a);
                    let o = this.getMemorySlice(a, a + 4), s = new DataView(o.buffer, o.byteOffset, o.byteLength).getUint32(0, !1);
                    return this.getMemorySlice(a + 4, a + 4 + s);
                });
            }
            cbindCall(e, t) {
                let n = t.length > this.MSGPACK_SCRATCH_SIZE, r;
                r = n ? this.call(`bbmalloc`, t.length) : this.msgpackInputScratch, this.writeMemory(r, t);
                let i = this.msgpackOutputScratch, a = this.msgpackOutputScratch + 4, o = this.msgpackOutputScratch + 8, s = this.MSGPACK_SCRATCH_SIZE - 8, c = this.getMemory(), l = new DataView(c.buffer);
                l.setUint32(i, o, !0), l.setUint32(a, s, !0), this.call(e, r, t.length, i, a), n && this.call(`bbfree`, r), c = this.getMemory(), l = new DataView(c.buffer);
                let u = l.getUint32(i, !0), d = l.getUint32(a, !0), f = u === o, p = this.getMemorySlice(u, u + d);
                return f || this.call(`bbfree`, u), p;
            }
        };
    })), wd, Td, Ed, Dd, Od = e((()=>{
        wd = `modulepreload`, Td = function(e, t) {
            return new URL(e, t).href;
        }, Ed = {}, Dd = function(e, t, n) {
            let r = Promise.resolve();
            if (t && t.length > 0) {
                let e = document.getElementsByTagName(`link`), i = document.querySelector(`meta[property=csp-nonce]`), a = i?.nonce || i?.getAttribute(`nonce`);
                function o(e) {
                    return Promise.all(e.map((e)=>Promise.resolve(e).then((e)=>({
                                status: `fulfilled`,
                                value: e
                            }), (e)=>({
                                status: `rejected`,
                                reason: e
                            }))));
                }
                function s(e) {
                    return import.meta.resolve ? import.meta.resolve(e) : new URL(e, import.meta.url).href;
                }
                r = o(t.map((t)=>{
                    if (t = Td(t, n), t = s(t), t in Ed) return;
                    Ed[t] = !0;
                    let r = t.endsWith(`.css`);
                    for(let n = e.length - 1; n >= 0; n--){
                        let i = e[n];
                        if (i.href === t && (!r || i.rel === `stylesheet`)) return;
                    }
                    let i = document.createElement(`link`);
                    if (i.rel = r ? `stylesheet` : wd, r || (i.as = `script`), i.crossOrigin = ``, i.href = t, a && i.setAttribute(`nonce`, a), document.head.appendChild(i), r) return new Promise((e, n)=>{
                        i.addEventListener(`load`, e), i.addEventListener(`error`, ()=>n(Error(`Unable to preload CSS for ${t}`)));
                    });
                }));
            }
            function i(e) {
                let t = new Event(`vite:preloadError`, {
                    cancelable: !0
                });
                if (t.payload = e, window.dispatchEvent(t), !t.defaultPrevented) throw e;
            }
            return r.then((t)=>{
                for (let e of t || [])e.status === `rejected` && i(e.reason);
                return e().catch(i);
            });
        };
    }));
    async function kd(e, t) {
        let n;
        if (t) {
            let r = e ? `-threads` : ``, i = t.split(`/`).slice(0, -1).join(`/`), [a, ...o] = t.split(`/`).pop().split(`.`);
            n = `${i}/${a}${r}.${o.join(`.`)}`;
        } else n = e ? (await Dd(async ()=>{
            let { default: e } = await import(`./barretenberg-threads-BmG-lzEI.js`).then(async (m)=>{
                await m.__tla;
                return m;
            });
            return {
                default: e
            };
        }, [], import.meta.url)).default : (await Dd(async ()=>{
            let { default: e } = await import(`./barretenberg-_6OEtkrR.js`).then(async (m)=>{
                await m.__tla;
                return m;
            });
            return {
                default: e
            };
        }, [], import.meta.url)).default;
        let r = await (await fetch(n)).arrayBuffer(), i = new Uint8Array(r);
        return i[0] === 31 && i[1] === 139 && i[2] === 8 ? Xa.ungzip(i).buffer : i;
    }
    var Ad = e((()=>{
        Za(), Od();
    })), jd = e((()=>{
        Ad();
    }));
    async function Md(e = 32, t, n = ()=>{}) {
        let r = od(), i = r ? await ld(n) : 1, a = Math.min(e, i, 32);
        n(`Fetching bb wasm from ${t ?? `default location`}`);
        let o = await kd(r, t);
        n(`Compiling bb wasm of ${o.byteLength} bytes`);
        let s = await WebAssembly.compile(o);
        return n(`Compilation of bb wasm complete`), {
            module: s,
            threads: a
        };
    }
    var Nd = e((()=>{
        dd(), jd();
    }));
    async function Pd() {
        let e = new Worker(new URL(`` + new URL(`main.worker-AQUU96xv.js`, import.meta.url).href, `` + import.meta.url), {
            type: `module`
        });
        return await new Promise((t)=>ud(e, t)), e;
    }
    var Fd = e((()=>{
        dd();
    })), Id, Ld = e((()=>{
        Cd(), Nd(), Fd(), fd(), ad(), Id = class e {
            wasm;
            worker;
            constructor(e, t){
                this.wasm = e, this.worker = t;
            }
            static async new(t = {}) {
                if (t.useWorker ?? !0) {
                    let n = await Pd(), r = sd(n), { module: i, threads: a } = await Md(t.threads, t.wasmPath, t.logger);
                    return await r.init(i, a, Wu(t.logger ?? (()=>{})), t.memory?.initial, t.memory?.maximum), new e(r, n);
                } else {
                    let n = new Sd, { module: r, threads: i } = await Md(t.threads, t.wasmPath, t.logger);
                    return await n.init(r, i, t.logger, t.memory?.initial, t.memory?.maximum), new e(n);
                }
            }
            async call(e) {
                return this.wasm.cbindCall(`bbapi`, e);
            }
            async destroy() {
                await this.wasm.destroy(), this.worker && await this.worker.terminate();
            }
        };
    }));
    async function Rd(e, t, n) {
        switch(e){
            case ku.Wasm:
            case ku.WasmWorker:
                {
                    let r = e === ku.WasmWorker;
                    return n(`Using WASM backend (worker: ${r})`), new Jd(await Id.new({
                        threads: t.threads,
                        wasmPath: t.wasmPath,
                        logger: n,
                        memory: t.memory,
                        useWorker: r
                    }), t);
                }
            default:
                throw Error(`Unknown backend type: ${e}`);
        }
    }
    var zd = e((()=>{
        Ld(), Zd(), Au();
    }));
    function Bd(e) {
        let t = [];
        return e.forEach(function(e) {
            let n = e.toString(16);
            n.length % 2 && (n = `0` + n), t.push(n);
        }), `0x` + t.join(``);
    }
    function Vd(e) {
        let t = BigInt(e).toString(16).padStart(64, `0`), n = t.length / 2, r = new Uint8Array(n), i = 0, a = 0;
        for(; i < n;)r[i] = parseInt(t.slice(a, a + 2), 16), i += 1, a += 2;
        return r;
    }
    var Hd = e((()=>{}));
    function Ud(e) {
        if (e?.verifierTarget) {
            if ([
                e.keccak,
                e.keccakZK,
                e.starknet,
                e.starknetZK
            ].filter(Boolean).length > 0) throw Error(`Cannot use verifierTarget with legacy options (keccak, keccakZK, starknet, starknetZK). Use verifierTarget alone.`);
            switch(e.verifierTarget){
                case `evm`:
                    return {
                        ipaAccumulation: !1,
                        oracleHashType: `keccak`,
                        disableZk: !1,
                        optimizedSolidityVerifier: !1
                    };
                case `evm-no-zk`:
                    return {
                        ipaAccumulation: !1,
                        oracleHashType: `keccak`,
                        disableZk: !0,
                        optimizedSolidityVerifier: !1
                    };
                case `noir-recursive`:
                    return {
                        ipaAccumulation: !1,
                        oracleHashType: `poseidon2`,
                        disableZk: !1,
                        optimizedSolidityVerifier: !1
                    };
                case `noir-recursive-no-zk`:
                    return {
                        ipaAccumulation: !1,
                        oracleHashType: `poseidon2`,
                        disableZk: !0,
                        optimizedSolidityVerifier: !1
                    };
                case `noir-rollup`:
                    return {
                        ipaAccumulation: !0,
                        oracleHashType: `poseidon2`,
                        disableZk: !1,
                        optimizedSolidityVerifier: !1
                    };
                case `noir-rollup-no-zk`:
                    return {
                        ipaAccumulation: !0,
                        oracleHashType: `poseidon2`,
                        disableZk: !0,
                        optimizedSolidityVerifier: !1
                    };
                case `starknet`:
                    return {
                        ipaAccumulation: !1,
                        oracleHashType: `starknet`,
                        disableZk: !1,
                        optimizedSolidityVerifier: !1
                    };
                case `starknet-no-zk`:
                    return {
                        ipaAccumulation: !1,
                        oracleHashType: `starknet`,
                        disableZk: !0,
                        optimizedSolidityVerifier: !1
                    };
            }
        }
        return {
            ipaAccumulation: !1,
            oracleHashType: e?.keccak || e?.keccakZK ? `keccak` : e?.starknet || e?.starknetZK ? `starknet` : `poseidon2`,
            disableZk: !!(e?.keccak || e?.starknet),
            optimizedSolidityVerifier: !1
        };
    }
    function Wd(e) {
        return Ja(Gd(e));
    }
    function Gd(e) {
        if (typeof atob == `function`) return Uint8Array.from(atob(e), (e)=>e.charCodeAt(0));
        throw Error(`atob is not available. Node.js 18+ or browser required.`);
    }
    var Kd, qd = e((()=>{
        Hd(), Za(), oc(), Kd = class {
            api;
            acirUncompressedBytecode;
            constructor(e, t){
                this.api = t, this.acirUncompressedBytecode = Wd(e);
            }
            async generateProof(e, t) {
                let n = Ja(e), { proof: r, publicInputs: i } = await this.api.circuitProve({
                    witness: n,
                    circuit: {
                        name: `circuit`,
                        bytecode: this.acirUncompressedBytecode,
                        verificationKey: new Uint8Array
                    },
                    settings: Ud(t)
                });
                console.log(`Generated proof for circuit with ${i.length} public inputs and ${r.length} fields.`);
                let a = new Uint8Array(r.length * 32);
                return r.forEach((e, t)=>{
                    a.set(e, t * 32);
                }), {
                    proof: a,
                    publicInputs: i.map(Bd)
                };
            }
            async verifyProof(e, t) {
                let n = [];
                for(let t = 0; t < e.proof.length; t += 32)n.push(e.proof.slice(t, t + 32));
                let r = await this.api.circuitComputeVk({
                    circuit: {
                        name: `circuit`,
                        bytecode: this.acirUncompressedBytecode
                    },
                    settings: Ud(t)
                }), { verified: i } = await this.api.circuitVerify({
                    verificationKey: r.bytes,
                    publicInputs: e.publicInputs.map(Vd),
                    proof: n,
                    settings: Ud(t)
                });
                return i;
            }
            async getVerificationKey(e) {
                return (await this.api.circuitComputeVk({
                    circuit: {
                        name: `circuit`,
                        bytecode: this.acirUncompressedBytecode
                    },
                    settings: Ud(e)
                })).bytes;
            }
            async getSolidityVerifier(e, t) {
                return (await this.api.circuitWriteSolidityVerifier({
                    verificationKey: e,
                    settings: Ud(t)
                })).solidityCode;
            }
            async generateRecursiveProofArtifacts(e, t, n) {
                let r = await this.api.circuitComputeVk({
                    circuit: {
                        name: `circuit`,
                        bytecode: this.acirUncompressedBytecode
                    },
                    settings: Ud(n)
                }), i = [];
                for(let e = 0; e < r.bytes.length; e += 32){
                    let t = r.bytes.slice(e, e + 32);
                    i.push(Bd(t));
                }
                return {
                    proofAsFields: [],
                    vkAsFields: i,
                    vkHash: Bd(r.hash)
                };
            }
        };
    })), Jd, Yd, Xd, Zd = e((()=>{
        Po(), Du(), Ou(), Au(), zd(), qd(), Au(), Jd = class e extends Eu {
            options;
            constructor(e, t){
                super(e), this.options = t;
            }
            static async new(e = {}) {
                let t = e.logger ?? (()=>{});
                if (e.backend) {
                    let n = await Rd(e.backend, e, t);
                    return (e.backend === ku.Wasm || e.backend === ku.WasmWorker) && await n.initSRSChonk(), n;
                }
                if (typeof window > `u`) try {
                    return await Rd(ku.NativeUnixSocket, e, t);
                } catch (n) {
                    t(`Unix socket unavailable (${n.message}), falling back to WASM`);
                    let r = await Rd(ku.Wasm, e, t);
                    return await r.initSRSChonk(), r;
                }
                else {
                    t(`In browser, using WASM over worker backend.`);
                    let n = await Rd(ku.WasmWorker, e, t);
                    return await n.initSRSChonk(), n;
                }
            }
            async initSRSChonk(e = this.getDefaultSrsSize()) {
                let t = await Ao.new(e + 1, this.options.crsPath, this.options.logger), n = await jo.new(2 ** 16 + 1, this.options.crsPath, this.options.logger);
                await this.srsInitSrs({
                    pointsBuf: t.getG1Data(),
                    numPoints: t.numPoints,
                    g2Point: t.getG2Data()
                }), await this.srsInitGrumpkinSrs({
                    pointsBuf: n.getG1Data(),
                    numPoints: n.numPoints
                });
            }
            getDefaultSrsSize() {
                return typeof self < `u` && self.navigator !== void 0 && /iPad|iPhone/.test(self.navigator.userAgent) ? 2 ** 18 : 2 ** 20;
            }
            async acirGetCircuitSizes(e, t, n) {
                let r = await this.circuitStats({
                    circuit: {
                        name: ``,
                        bytecode: e,
                        verificationKey: new Uint8Array
                    },
                    includeGatesPerOpcode: !1,
                    settings: {
                        ipaAccumulation: !1,
                        oracleHashType: n ? `poseidon2` : `keccak`,
                        disableZk: !t,
                        optimizedSolidityVerifier: !1
                    }
                });
                return [
                    r.numGates,
                    r.numGatesDyadic
                ];
            }
            async destroy() {
                return super.destroy();
            }
            static async initSingleton(t = {}) {
                Yd ||= e.new(t);
                try {
                    return Xd = await Yd, Xd;
                } catch (e) {
                    throw Xd = void 0, Yd = void 0, e;
                }
            }
            static async destroySingleton() {
                Xd && (await Xd.destroy(), Xd = void 0, Yd = void 0);
            }
            static getSingleton() {
                if (!Xd) throw Error(`First call Barretenberg.initSingleton() on @aztec/bb.js module.`);
                return Xd;
            }
        };
    })), Qd = e((()=>{
        new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
        ]), new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            2
        ]), new Uint8Array([
            24,
            0,
            222,
            239,
            18,
            31,
            30,
            118,
            66,
            106,
            0,
            102,
            94,
            92,
            68,
            121,
            103,
            67,
            34,
            212,
            247,
            94,
            218,
            221,
            70,
            222,
            189,
            92,
            217,
            146,
            246,
            237
        ]), new Uint8Array([
            25,
            142,
            147,
            147,
            146,
            13,
            72,
            58,
            114,
            96,
            191,
            183,
            49,
            251,
            93,
            37,
            241,
            170,
            73,
            51,
            53,
            169,
            231,
            18,
            151,
            228,
            133,
            183,
            174,
            243,
            18,
            194
        ]), new Uint8Array([
            18,
            200,
            94,
            165,
            219,
            140,
            109,
            235,
            74,
            171,
            113,
            128,
            141,
            203,
            64,
            143,
            227,
            209,
            231,
            105,
            12,
            67,
            211,
            123,
            76,
            230,
            204,
            1,
            102,
            250,
            125,
            170
        ]), new Uint8Array([
            9,
            6,
            137,
            208,
            88,
            95,
            240,
            117,
            236,
            158,
            153,
            173,
            105,
            12,
            51,
            149,
            188,
            75,
            49,
            51,
            112,
            179,
            142,
            243,
            85,
            172,
            218,
            220,
            209,
            34,
            151,
            91
        ]), new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
        ]), new Uint8Array([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            2,
            207,
            19,
            94,
            117,
            6,
            164,
            93,
            99,
            45,
            39,
            13,
            69,
            241,
            24,
            18,
            148,
            131,
            63,
            196,
            141,
            130,
            63,
            39,
            44
        ]), new Uint8Array([
            121,
            190,
            102,
            126,
            249,
            220,
            187,
            172,
            85,
            160,
            98,
            149,
            206,
            135,
            11,
            7,
            2,
            155,
            252,
            219,
            45,
            206,
            40,
            217,
            89,
            242,
            129,
            91,
            22,
            248,
            23,
            152
        ]), new Uint8Array([
            72,
            58,
            218,
            119,
            38,
            163,
            196,
            101,
            93,
            164,
            251,
            252,
            14,
            17,
            8,
            168,
            253,
            23,
            180,
            72,
            166,
            133,
            84,
            25,
            156,
            71,
            208,
            143,
            251,
            16,
            212,
            184
        ]), new Uint8Array([
            107,
            23,
            209,
            242,
            225,
            44,
            66,
            71,
            248,
            188,
            230,
            229,
            99,
            164,
            64,
            242,
            119,
            3,
            125,
            129,
            45,
            235,
            51,
            160,
            244,
            161,
            57,
            69,
            216,
            152,
            194,
            150
        ]), new Uint8Array([
            79,
            227,
            66,
            226,
            254,
            26,
            127,
            155,
            142,
            231,
            235,
            74,
            124,
            15,
            158,
            22,
            43,
            206,
            51,
            87,
            107,
            49,
            94,
            206,
            203,
            182,
            64,
            104,
            55,
            191,
            81,
            245
        ]);
    })), $d = e((()=>{
        Po(), Zd(), _d(), Hd(), sc(), Qd();
    }));
    t((()=>{
        fo(), $d();
        var e, t, n;
        async function r() {
            try {
                let r = window.circuitJson;
                if (!r) throw Error(`window.circuitJson is missing or unreadable.`);
                console.log(`Initializing Barretenberg core API context...`), n = await Jd.new({
                    threads: 1
                }), e = new Kd(r.bytecode, n), t = new lo(r), window.generateZkProof = i, console.log(`ZK Proving Systems Context bound successfully.`), window.AndroidBridge && AndroidBridge.onEngineReady();
            } catch (e) {
                console.error(`ZK Engine Boot Failure Details:`, e), window.AndroidBridge && AndroidBridge.onError(`Static Boot Engine Failure: ` + e.toString());
            }
        }
        async function i(n) {
            let r = performance.now();
            try {
                let i = JSON.parse(n), a = {
                    current_balance: i.current_balance.toString(),
                    transfer_amount: i.transfer_amount.toString(),
                    secret_key: i.secret_key.toString(),
                    aml_limit: i.aml_limit.toString(),
                    recipient_public_key: i.recipient_public_key.toString(),
                    balance_commitment: i.balance_commitment.toString()
                }, { witness: o } = await t.execute(a), s = await e.generateProof(o), c = performance.now() - r;
                window.AndroidBridge && AndroidBridge.onProofGenerated(JSON.stringify(s), c.toFixed(2));
            } catch (e) {
                window.AndroidBridge && AndroidBridge.onError(`Proof Generation Failed: ` + e.toString());
            }
        }
        window.onload = r;
    }))();
})();
export { e as t, __tla };
