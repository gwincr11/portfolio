function gup(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    a = "[\\?&]" + a + "=([^&#]*)";
    a = new RegExp(a);
    a = a.exec(window.location.href);
    return a === null ? "" : a[1]
};

function EventTarget() {
    this._listeners = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addListener: function (type, listener) {
        if (typeof this._listeners[type] == "undefined") {
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    },
    fire: function (event) {
        if (typeof event == "string") {
            event = {
                type: event
            };
        }
        if (!event.target) {
            event.target = this;
        }
        if (!event.type) {
            throw new Error("Event object missing 'type' property.");
        }
        if (this._listeners[event.type] instanceof Array) {
            var listeners = this._listeners[event.type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (typeof listeners[i] != "undefined") {
                    try {
                        listeners[i].call(this, event);
                    } catch (err) {}
                }
            }
        }
    },
    removeListener: function (type, listener) {
        if (this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};

/*http://www.json.org/json2.js http://www.json.org/js.html*/
if (!this.JSON) {
    this.JSON = {};
}
(function () {
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\'
        }, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            });
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());

function loadscript(url, json) {
    json.auth = genus.getauthobj();
    url = genus.configurl(url, json);
    b = document.createElement("script");
    b.src = url;
    document.getElementsByTagName("head")[0].appendChild(b);
}


var genus = {
    version: "3.0",
    session: false,
    url: "https://genus.younewstv.com",
    urlpop: "http://genus.younewstv.com",
    xdmHash: "genusSSOLinkPop",
    setcookie: function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        var rootdomain = document.domain.substring(document.domain.search(/([\w\-]+\.\w+)$/));
        document.cookie = name + "=" + value + expires + "; domain=" + rootdomain + ";path=/";
    },
    readcookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    getauthobj: function () {
        return {
            "token": genus.token,
            "nonce": genus.readcookie("BIMREG_session_nonce"),
            "session": genus.readcookie("BIMREG_session_session"),
            "ts": genus.readcookie("BIMREG_session_ts"),
            "sign": genus.readcookie("BIMREG_session_sign"),
            "tp_sign": genus.readcookie("BIMREG_session_tp_sign"),
            "email": genus.readcookie("BIMREG_session_email"),
            "user": genus.readcookie("BIMREG_session_userKey")
        };
    },
    configurl: function (url, json) {
        if (url.indexOf("genus") > 0) {
            url += url.indexOf("?") > 0 ? "&" : "?";
            var j = document.domain.substring(document.domain.search(/(\w+\.\w+)$/));
            var jsons = JSON.stringify(json);
            url += "body=" + encodeURIComponent(jsons);
        }
        return url;
    },
    configssourl: function (url, json, task) {
        if (url.indexOf("genus") > 0) {
            url += url.indexOf("?") > 0 ? "&" : "?";
            var j = document.domain.substring(document.domain.search(/(\w+\.\w+)$/));
            var jsons = JSON.stringify(json);
            url += "task=" + task + "&body=" + encodeURIComponent(jsons);
        }
        return url;
    },
    ssourl: function (service, callback, loc) {
        if (typeof loc === 'undefined') {
            var redloc = window.location.href;
        } else {
            var redloc = loc;
        }
        var json = {
            "verb": "GET",
            "payload": {
                "hash": genus.xdmHash,
                "loc": redloc
            }
        };
        if (typeof callback !== "undefined") {
            json.callback = callback;
        }
        if (service) {
            var service = service.toLowerCase();
        } else {
            return "No service specified";
        }
        var ssoObj = {};
        whattodo = service.split("_");
        if (whattodo[1] === "link") {
            if (genus.checkSSOService(whattodo[0])) {
                var task = "unlink";
            } else {
                var task = "link";
            }
        } else if (whattodo[1] === "reg") {
            var task = "create";
        } else if (whattodo[1] === "login") {
            var task = "login";
        }
        switch (whattodo[0]) {
            case "facebook":
                var loc = genus.url + "/v1/js/facebook/init";
                break;
            case "twitter":
                var loc = genus.url + "/v1/js/twitter/init";
                break;
            default:
                var loc = false;
                break;
        }
        if (loc) {
            json.auth = genus.getauthobj();
            ssoObj.url = genus.configssourl(loc, json, task);
            return ssoObj;
        } else {
            return "service not available";
        }
    },
    checkSSOService: function (s) {
        if (bimreg.loggedin && typeof genus.currentuser.profile.user === "object") {
            var ssoState = genus.currentuser.profile.user.genus.sso;
            if (ssoState.indexOf(s) === -1) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    executeFunctionByName: function (functionName, context) {
        var args = Array.prototype.slice.call(arguments, 2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(this, args);
    },
    savesessionchanges: function () {
        if (genus.session) {
            if (genus.session.auth.nonce !== "undefined") {
                genus.setcookie("BIMREG_session_nonce", genus.session.auth.nonce, 365);
            }
            if (genus.session.auth.session !== "undefined") {
                genus.setcookie("BIMREG_session_session", genus.session.auth.session, 365);
            }
            if (genus.session.auth.ts !== "undefined") {
                genus.setcookie("BIMREG_session_ts", genus.session.auth.ts, 365);
            }
            if (genus.session.auth.sign !== "undefined") {
                genus.setcookie("BIMREG_session_sign", genus.session.auth.sign, 365);
            }
            if (genus.session.auth.tp_sign !== "undefined") {
                genus.setcookie("BIMREG_session_tp_sign", genus.session.auth.tp_sign, 365);
            }
            if (genus.currentuser.profile) {
                genus.setcookie("BIMREG_session_email", genus.currentuser.profile.user.private_data.email, 365);
                genus.setcookie("BIMREG_session_userKey", genus.currentuser.profile.user.key, 365);
            } else {
                genus.setcookie("BIMREG_session_email", "", -1);
                genus.setcookie("BIMREG_session_userKey", "", -1);
            }
        }
    },
    clearsession: function () {
        genus.setcookie("BIMREG_session_token", "", -1);
        genus.setcookie("BIMREG_session_nonce", "", -1);
        genus.setcookie("BIMREG_session_session", "", -1);
        genus.setcookie("BIMREG_session_ts", "", -1);
        genus.setcookie("BIMREG_session_sign", "", -1);
        genus.setcookie("BIMREG_session_tp_sign", "", -1);
        genus.setcookie("BIMREG_session_email", "", -1);
        genus.setcookie("BIMREG_session_userKey", "", -1);
    },
    init: function (token, callback) {
        var c = document.createElement("script");
        c.src = genus.url + "/js/easyXDM.min.js";
        document.getElementsByTagName("head")[0].appendChild(c);
        window.onbeforeunload = function () {
            genus.savesessionchanges();
        };
        var loc = genus.url + "/v1/js/init";
        var json = {
            "verb": "GET",
            "payload": {},
            "callback": callback
        };
        genus.token = token;
        loadscript(loc, json);
    },
    externaluser: {
        profiles: {
            username: {},
            keyed: {}
        }
    },
    usermodel: {
        getauthority: function (callback) {
            var loc = genus.url + "/v1/js/authority/user";
            var json = {
                "verb": "GET",
                "callback": callback
            };
            loadscript(loc, json);
        },
        getusers: function (userquery, callback) {
            var loc = genus.url + "/v1/users";
            var json = {
                "verb": "GET",
                "payload": {
                    "search": {}
                },
                "callback": callback
            };
            if (userquery.key.length > 0) {
                json.payload.search.key = userquery.key;
            }
            if (userquery.username.length > 0) {
                json.payload.search.username = userquery.username;
            }
            loadscript(loc, json);
        },
        rememberpassword: function (email, callback) {
            var loc = genus.url + "/v1/js/sendpassword";
            var json = {
                "verb": "GET",
                "payload": {
                    "email": email
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        usernamecheck: function (username, callback) {
            var loc = genus.url + "/v1/js/check";
            var json = {
                "verb": "GET",
                "payload": {
                    "lookup": {
                        "username": username
                    }
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        emailcheck: function (email, callback) {
            var loc = genus.url + "/v1/js/check";
            var json = {
                "verb": "GET",
                "payload": {
                    "lookup": {
                        "email": email
                    }
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        createuser: function (userPre, callback) {
            var loc = genus.url + "/v1/users";
            user = genus.usermodel.usershapeup(userPre, genus.authUserObj.user);
            var json = {
                "verb": "PUT",
                "payload": {
                    "user": user
                },
                "callback": callback
            };
            if (typeof Recaptcha !== "undefined") {
                json.payload.user.recaptcha = {
                    challenge_field: Recaptcha.get_challenge(),
                    response_field: Recaptcha.get_response(),
                    domain: window.location.host
                }
            }
            loadscript(loc, json);
        },
        usershapeup: function (user, authObj, userProper, parentobject) {
            var userProper = typeof (where) === 'object' ? userProper : {};
            for (key in authObj) {
                if (typeof (authObj[key]) === "object") {
                    newparentObject = userProper[key] = {};
                    userProper[key] = genus.usermodel.usershapeup(user, authObj[key], userProper, newparentObject);
                } else if (typeof (authObj[key]) === "string") {
                    if (key in user) {
                        if (parentobject && userProper[parentobject]) {
                            if (user[key] == null) {
                                var userKey = "";
                            } else {
                                var userKey = user[key];
                            }
                            userProper[parentobject][key] = userKey;
                        } else {
                            userProper[key] = user[key];
                        }
                    }
                }
            }
            return userProper;
        }
    },
    contentmodel: {
        getvoting: function (contentid, contestid, callback) {
            var loc = genus.url + "/v1/js/getvoting";
            var json = {
                "verb": "GET",
                "payload": {
                    "contentid": contentid,
                    "contestid": contestid
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        getcontest: function (contestid, callback) {
            var loc = genus.url + "/v1/js/getcontest";
            var json = {
                "verb": "GET",
                "payload": {
                    "contestid": contestid
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        vote: function (contentid, callback) {
            var loc = genus.url + "/v1/js/vote";
            var json = {
                "verb": "GET",
                "payload": {
                    "contentid": contentid
                },
                "callback": callback
            };
            loadscript(loc, json);
        }
    },
    currentuser: {
        login: function (username, password, callback) {
            var loc = genus.url + "/v1/js/login";
            var json = {
                "verb": "GET",
                "payload": {
                    "login": {
                        "username": username,
                        "password": password
                    }
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        updateavatar: function (avatar, callback) {
            var loc = genus.url + "/v1/js/setavatar";
            var json = {
                "verb": "GET",
                "payload": {
                    "id": avatar
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        logout: function (initCall) {
            genus.session = false;
            genus.currentuser.profile = false;
            genus.clearsession();
            genus.init(genus.token, initCall);
        },
        updateprofile: function (userPre, callback) {
            var loc = genus.url + "/v1/users/" + genus.currentuser.profile.user.key;
            user = genus.usermodel.usershapeup(userPre, genus.authUserObj.user);
            var json = {
                "verb": "PUT",
                "payload": {
                    "user": user
                },
                "callback": callback
            };
            loadscript(loc, json);
        },
        profile: false,
        favorites: false,
        feed: false
    }
};




handleEvent = function (event) {};
bimreg = {
    listener: new EventTarget(),
    loggedin: false,
    getuserkeyrunning: false,
    easyXDMwin: false,
    proxy: false,
    validationlib: true,
    emailchangeurl: false,
    ssoservice: false,
    logoutRefresh: true,
    logoutRedirect: false,
    init: function (token, options) {
        if (typeof options !== "undefined") {
            if (typeof options.emailchangeurl !== "undefined") {
                bimreg.emailchangeurl = options.emailchangeurl;
            }
            if (typeof options.validationlib !== "undefined") {
                bimreg.validationlib = options.validationlib;
            }
            if (typeof options.logoutRefresh !== "undefined") {
                bimreg.logoutRefresh = options.logoutRefresh;
            }
            if (typeof options.logoutRedirect !== "undefined") {
                bimreg.logoutRedirect = options.logoutRedirect;
            }
        }
        var callback = {
            "success": "bimreg.initsuccess",
            "fail": "bimreg.initfail"
        };
        genus.init(token, callback);
    },
    initsuccess: function (auth, userAuth, user) {
        if (auth) {
            genus.session = JSON.parse(auth);
            bimreg.listener.addListener("regAuth", handleEvent);
            bimreg.listener.fire({
                type: "regAuth"
            });
        }
        if (userAuth) {
            genus.authUserObj = JSON.parse(userAuth);
        }
        if (user) {
            genus.currentuser.profile = JSON.parse(user);
            bimreg.loggedin = true;
            bimreg.listener.addListener("userLogin", handleEvent);
            bimreg.listener.fire({
                type: "userLogin"
            });
        } else {
            bimreg.listener.addListener("regAuthNoUser", handleEvent);
            bimreg.listener.fire({
                type: "regAuthNoUser"
            });
        }
        genus.savesessionchanges();
        bimreg.listener.addListener("validatitonLibLoaded", addcustomvalidation);
        if (typeof jQuery !== 'undefined' && bimreg.validationlib) {
            if (jQuery().validate) {
                bimreg.listener.fire({
                    type: "validatitonLibLoaded"
                });
            } else {
                var c = document.createElement("script");
                c.src = "http://ajax.microsoft.com/ajax/jquery.validate/1.7/jquery.validate.min.js";
                document.getElementsByTagName("head")[0].appendChild(c);
                setTimeout("bimreg.listener.fire({ type: 'validatitonLibLoaded'})", 1250);
            }
        }
    },
    initfail: function (err) {
        bimreg.listener.addListener("initfail", handleEvent);
        bimreg.listener.fire({
            type: "initfail"
        });
    },
    getauthority: function () {
        var callback = {
            "success": "bimreg.authobjsuccess"
        };
        genus.usermodel.getauthority(callback);
    },
    authobjsuccess: function (userAuth) {
        genus.authUserObj = JSON.parse(userAuth);
    },
    login: function (username, password) {
        var callback = {
            "success": "bimreg.onloadlogin",
            "fail": "bimreg.onfailLogin"
        };
        genus.currentuser.login(username, password, callback);
    },
    onfailLogin: function (errMessage) {
        var loginFail = JSON.parse(errMessage);
        bimreg.listener.addListener("failedLogin", handleEvent);
        bimreg.listener.fire({
            type: "failedLogin",
            error: loginFail.error.description
        });
    },
    onloadlogin: function (auth, user) {
        if (auth) {
            genus.session = JSON.parse(auth);
        }
        if (user) {
            genus.currentuser.profile = JSON.parse(user);
            bimreg.loggedin = true;
            bimreg.listener.addListener("userLogin", handleEvent);
            bimreg.listener.fire({
                type: "userLogin"
            });
        }
        if (genus.currentuser.profile.user.deleted === "1") {
            bimreg.logout();
        }
        genus.savesessionchanges();
    },
    islinked: function (service) {
        return genus.checkSSOService(service);
    },
    getssoregurl: function (service) {
        var callback = {
            "success": "bimreg.onloadregsso",
            "fail": "bimreg.onfailregsso"
        };
        return genus.ssourl(service, callback);
    },
    onloadregsso: function (arg) {
        args = arg.split(',{"users":');
        if (typeof args[0] !== "undefined") {
            genus.session.auth = JSON.parse(args[0]);
        }
        if (typeof args[1] !== "undefined") {
            args[1] = args[1].substring(0, args[1].length - 1);
            genus.currentuser.profile = JSON.parse(args[1]);
            bimreg.loggedin = true;
            bimreg.listener.fire({
                type: "userLogin"
            });
        }
        genus.savesessionchanges();
        bimreg.ssoWindowClose();
        bimreg.listener.addListener("userregsso", handleEvent);
        bimreg.listener.fire({
            type: "userregsso"
        });
        bimreg.listener.addListener(bimreg.ssoservice + "userregsso", handleEvent);
        bimreg.listener.fire({
            type: bimreg.ssoservice + "userregsso"
        });
    },
    onfailregsso: function (errMessage) {
        bimreg.ssoWindowClose();
        errmessage = errMessage.split(',{"error":');
        var loginFail = false;
        if (typeof errmessage[1] !== "undefined") {
            errmessage[1] = errmessage[1].substring(0, errmessage[1].length - 1);
            loginFail = JSON.parse(errmessage[1]);
        }
        bimreg.listener.addListener("failedRegsso", handleEvent);
        bimreg.listener.fire({
            type: "failedRegsso",
            error: loginFail.description
        });
        bimreg.ssoservice = false;
    },
    onloadloginsso: function (arg) {
        args = arg.split(',{"users":');
        if (typeof args[0] !== "undefined") {
            genus.session.auth = JSON.parse(args[0]);
        }
        if (typeof args[1] !== "undefined") {
            args[1] = args[1].substring(0, args[1].length - 1);
            genus.currentuser.profile = JSON.parse(args[1]);
            bimreg.loggedin = true;
            bimreg.listener.fire({
                type: "userLogin"
            });
        }
        genus.savesessionchanges();
        bimreg.ssoWindowClose();
        bimreg.listener.addListener("userloginsso", handleEvent);
        bimreg.listener.fire({
            type: "userloginsso"
        });
        bimreg.listener.addListener(bimreg.ssoservice + "userloginsso", handleEvent);
        bimreg.listener.fire({
            type: bimreg.ssoservice + "userloginsso"
        });
    },
    onfailloginsso: function (errMessage) {
        bimreg.ssoWindowClose();
        var loginFail = JSON.parse(errMessage);
        bimreg.listener.addListener("failedloginsso", handleEvent);
        bimreg.listener.fire({
            type: "failedloginsso",
            error: loginFail.error.description
        });
        bimreg.ssoservice = false;
    },
    getssolinkurl: function (service) {
        var callback = {
            "success": "bimreg.onloadlinksso",
            "fail": "bimreg.onfaillinksso"
        };
        return genus.ssourl(service, callback);
    },
    ssoWindowClose: function () {
        clearInterval(bimreg.windowWatcher);
        bimreg.proxy.destroy();
    },
    onloadlinksso: function (args) {
        if (typeof args !== "undefined") {
            bimreg.onloadloginsso(args);
        }
        bimreg.ssoWindowClose();
        bimreg.listener.addListener("userLinksso", handleEvent);
        bimreg.listener.fire({
            type: "userLinksso"
        });
        bimreg.ssoservice = false;
    },
    onfailLinksso: function (errMessage) {
        bimreg.ssoWindowClose();
        var loginFail = JSON.parse(errMessage);
        bimreg.listener.addListener("failedLinksso", handleEvent);
        bimreg.listener.fire({
            type: "failedLinksso",
            error: loginFail.error.description
        });
        bimreg.ssoservice = false;
    },
    watchssowindow: function () {
        if (bimreg.easyXDMwin.closed) {
            bimreg.ssoWindowClose();
            bimreg.listener.fire({
                type: "ssoWindowClose"
            });
        }
    },
    ssoPop: function (service, height, width) {
        bimreg.ssoservice = service.split("_")[0].toLowerCase();
        if (service.indexOf("_link") > -1) {
            url = bimreg.getssolinkurl(service);
        } else if (service.indexOf("_reg") > -1) {
            url = bimreg.getssoregurl(service);
        } else {
            alert(service + " is not a supported service");
        }
        if (typeof height === 'undefined') {
            height = 400;
        }
        if (typeof width === 'undefined') {
            if (bimreg.ssoservice === "twitter") {
                width = 820;
            } else {
                width = 400;
            }
        }
        if (bimreg.easyXDMwin && !bimreg.easyXDMwin.closed) {
            bimreg.easyXDMwin.focus();
            return;
        }
        if (url === "No service specified") {
            alert("No sso service was specified");
        } else if (url === "service not available") {
            alert(service + " is not a supported service");
        } else if (url.linked || !url.linked) {
            bimreg.easyXDMwin = window.open(genus.urlpop + "/js/blank.html", 'mainapp', 'height=' + height + ',width=' + width, 'toolbar = 0', 'location=1', 'status=0', 'scrollbars=0');
            bimreg.proxy = new easyXDM.Rpc({
                swf: genus.urlpop + "/js/easyxdm.swf",
                channel: genus.xdmHash,
                remote: genus.urlpop + "/v1/sso/facebook/iframe"
            }, {
                local: {
                    postMessage: function (data) {
                        var functionName = data.callback;
                        if (functionName === "bimreg.onloadregsso") {
                            switch (data.task) {
                                case "login":
                                    functionName = "bimreg.onloadloginsso";
                                    break;
                                case "create":
                                    functionName = "bimreg.onloadregsso";
                                    break;
                                case "link":
                                    functionName = "bimreg.onloadlinksso";
                                    break;
                                case "unlink":
                                    functionName = "bimreg.onloadlinksso";
                                    break;
                                default:
                                    functionName = "bimreg.onloadregsso";
                                    break;
                            }
                        }
                        var localarguments = data.arguments;
                        genus.executeFunctionByName(functionName, window, localarguments);
                    }
                },
                remote: {
                    open: {}
                }
            });
            bimreg.proxy.open(url.url, 'mainapp')
            bimreg.easyXDMwin.focus();
            (function setupWatcher() {
                bimreg.listener.addListener("ssoWindowClose", handleEvent);
                bimreg.windowWatcher = setInterval("bimreg.watchssowindow()", 2000);
            })();
            return false;
        }
    },
    logout: function (redirect) {
        var initcallback = {
            "success": "bimreg.onloadlogout",
            "fail": "bimreg.initfail"
        };
        if (typeof redirect !== "undefined") {
            bimreg.logoutRedirect = redirect
        }
        genus.currentuser.logout(initcallback);
    },
    onloadlogout: function (auth) {
        bimreg.initsuccess(auth);
        bimreg.loggedin = false;
        bimreg.listener.fire({
            type: "userLogout"
        });
        if (bimreg.logoutRefresh && !bimreg.logoutRedirect) {
            window.location.reload();
        } else if (bimreg.logoutRefresh && bimreg.logoutRedirect) {
            window.location = bimreg.logoutRedirect;
        }
    },
    completessoreg: function (user) {
        genus.currentuser.profile.user.private_data.email = bimreg.getuserkey("email", user);
        genus.currentuser.profile.user.public_data.username = bimreg.getuserkey("username", user);
        genus.currentuser.profile.user.private_data.ssoTempPass = bimreg.getuserkey("password", user);
        var callback = {
            "success": "bimreg.ssointermediate",
            "fail": "bimreg.ssoregfail"
        };
        genus.currentuser.updateprofile(user, callback);
    },
    ssointermediate: function () {
        var password = genus.currentuser.profile.user.private_data.ssoTempPass;
        var callback = {
            "success": "bimreg.ssoregcomplete",
            "fail": "bimreg.ssoregfail"
        };
        genus.currentuser.login(bimreg.getuserkey("email"), password, callback);
    },
    ssoregcomplete: function (auth, user) {
        bimreg.onloadlogin(auth, user);
        bimreg.listener.addListener("completeSSOReg", handleEvent);
        bimreg.listener.fire({
            type: "completeSSOReg"
        });
        bimreg.listener.addListener(bimreg.ssoservice + "completeSSOReg", handleEvent);
        bimreg.listener.fire({
            type: bimreg.ssoservice + "completeSSOReg"
        });
        bimreg.ssoservice = false;
    },
    ssoregfail: function (err) {
        var regFail = JSON.parse(err);
        bimreg.listener.addListener("SSORegFail", handleEvent);
        bimreg.listener.fire({
            type: "SSORegFail",
            error: regFail.error.description
        });
        bimreg.listener.addListener(bimreg.ssoservice + "SSORegFail", handleEvent);
        bimreg.listener.fire({
            type: bimreg.ssoservice + "SSORegFail",
            error: regFail.error.description
        });
    },
    updateavatar: function (avatar) {
        var callback = {
            "success": "bimreg.avatarupdated",
            "fail": "bimreg.avatarupdatefail"
        };
        genus.currentuser.updateavatar(avatar, callback);
    },
    avatarupdated: function (status) {
        bimreg.listener.addListener("avatarupdated", handleEvent);
        bimreg.listener.fire({
            type: "avatarupdated"
        });
    },
    avatarupdatefail: function (err) {
        var updateFail = JSON.parse(err);
        bimreg.listener.addListener("avatarupdatefail", handleEvent);
        bimreg.listener.fire({
            type: "avatarupdatefail",
            error: updateFail.error.description
        });
    },
    updateprofile: function (user) {
        curremail = bimreg.getuserkey("email");
        newemail = bimreg.getuserkey("email", user);
        var finalupdateuser = {};
        for (thing in user) {
            var currKey = thing;
            if (user[currKey] != bimreg.getuserkey(currKey)) {
                finalupdateuser[currKey] = user[currKey];
            }
        }
        var callback = {};
        if (typeof newemail !== "undefined" && curremail !== newemail) {
            callback.success = "bimreg.onloadupdateprofileemailchange";
            callback.fail = "bimreg.onfailupdateprofile";
        } else {
            callback.success = "bimreg.onloadupdateprofile";
            callback.fail = "bimreg.onfailupdateprofile";
        }
        genus.currentuser.updateprofile(finalupdateuser, callback);
    },
    onloadupdateprofile: function (status) {
        bimreg.listener.addListener("updateProfile", handleEvent);
        bimreg.listener.fire({
            type: "updateProfile"
        });
    },
    onfailupdateprofile: function (err) {
        var updateFail = JSON.parse(err);
        bimreg.listener.addListener("profileUpdateFail", handleEvent);
        bimreg.listener.fire({
            type: "profileUpdateFail",
            error: updateFail.error.description
        });
    },
    onloadupdateprofileemailchange: function (status) {
        genus.currentuser.logout();
        if (bimreg.emailchangeurl) {
            window.location = bimreg.emailchangeurl;
        } else {
            bimreg.listener.addListener("updateProfileemailchange", handleEvent);
            bimreg.listener.fire({
                type: "updateProfileemailchange"
            });
        }
    },
    createuser: function (user) {
        var callback = {
            "success": "bimreg.usercreated",
            "fail": "bimreg.usercreationfail"
        };
        genus.usermodel.createuser(user, callback);
    },
    usercreated: function (status) {
        bimreg.listener.addListener("userCreated", handleEvent);
        bimreg.listener.fire({
            type: "userCreated"
        });
    },
    usercreationfail: function (err) {
        var createFail = JSON.parse(err);
        bimreg.listener.addListener("userNotCreated", handleEvent);
        bimreg.listener.fire({
            type: "userNotCreated",
            error: createFail.error.description
        });
    },
    deleteuser: function () {
        genus.authUserObj.user.deleted = "";
        user = {
            deleted: 1
        }
        var callback = {
            "success": "bimreg.userdeleted",
            "fail": "bimreg.userdeleationfail"
        };
        genus.currentuser.updateprofile(user, callback);
    },
    userdeleted: function (status) {
        bimreg.logout();
        bimreg.listener.addListener("userDeleted", handleEvent);
        bimreg.listener.fire({
            type: "userDeleted"
        });
    },
    userdeleationfail: function (err) {
        var deleteFail = JSON.parse(err);
        bimreg.listener.addListener("userNotDeleted", handleEvent);
        bimreg.listener.fire({
            type: "userNotDeleted",
            error: deleteFail.error.description
        });
    },
    usernamecheck: function (username) {
        var callback = {
            "success": "bimreg.userexists",
            "fail": "bimreg.usernameavailable"
        };
        genus.usermodel.usernamecheck(username, callback);
    },
    userexists: function (userfound) {
        bimreg.listener.addListener("checkedUserExists", handleEvent);
        bimreg.listener.fire({
            type: "checkedUserExists"
        });
    },
    usernameavailable: function (err) {
        bimreg.listener.addListener("checkedUserNameAvailable", handleEvent);
        bimreg.listener.fire({
            type: "checkedUserNameAvailable"
        });
    },
    emailcheck: function (email) {
        var callback = {
            "success": "bimreg.emailexists",
            "fail": "bimreg.emailavailable"
        };
        genus.usermodel.emailcheck(email, callback);
    },
    emailexists: function (stations) {
        bimreg.listener.addListener("checkedEmailExists", handleEvent);
        bimreg.listener.fire({
            type: "checkedEmailExists",
            stationList: stations
        });
    },
    emailavailable: function (err) {
        bimreg.listener.addListener("checkedUserEmailAvailable", handleEvent);
        bimreg.listener.fire({
            type: "checkedUserEmailAvailable"
        });
    },
    rememberpassword: function (email) {
        var callback = {
            "success": "bimreg.passwordsent",
            "fail": "bimreg.passwordunavailable"
        };
        genus.usermodel.rememberpassword(email, callback);
    },
    passwordsent: function (msg) {
        bimreg.listener.addListener("passwordSent", handleEvent);
        bimreg.listener.fire({
            type: "passwordSent",
            msg: msg
        });
    },
    passwordunavailable: function (err) {
        var passFail = JSON.parse(err);
        bimreg.listener.addListener("passwordUnavailable", handleEvent);
        bimreg.listener.fire({
            type: "passwordUnavailable",
            error: passFail.error.description
        });
    },
    getusers: function (useridentifier) {
        var userQuery = {
            key: [],
            username: []
        };
        if (typeof useridentifier === "object") {
            for (user in useridentifier) {
                if (useridentifier[user].length === 40) {
                    userQuery.key.push(useridentifier[user]);
                } else if (useridentifier[user].length <= 16) {
                    userQuery.username.push(useridentifier[user]);
                }
            }
        } else if (typeof useridentifier === "string") {
            if (useridentifier.length === 40) {
                userQuery.key.push(useridentifier);
            } else if (useridentifier.length <= 16) {
                userQuery.username.push(useridentifier);
            }
        }
        for (i in userQuery.key) {
            genus.externaluser.profiles.keyed[userQuery.key[i]] = {};
        }
        for (i in userQuery.username) {
            genus.externaluser.profiles.username[userQuery.username[i]] = {};
        }
        var callback = {
            "success": "bimreg.externaluserloaded",
            "fail": "bimreg.externaluserfailed"
        };
        genus.usermodel.getusers(userQuery, callback);
    },
    externaluserfailed: function (errMessage) {
        var loginFail = JSON.parse(errMessage);
        bimreg.listener.addListener("externaluserfailed", handleEvent);
        bimreg.listener.fire({
            type: "externaluserfailed",
            error: loginFail.error.description
        });
    },
    externaluserloaded: function (user) {
        if (user) {
            var tempuser = JSON.parse(user);
            for (userobj in tempuser.users.user) {
                usertouse = tempuser.users.user[userobj];
                var ukey = bimreg.getuserkey("key", usertouse);
                if (genus.externaluser.profiles.keyed.hasOwnProperty(ukey) && typeof genus.externaluser.profiles.keyed[ukey].key === "undefined") {
                    genus.externaluser.profiles.keyed[ukey] = usertouse;
                } else {
                    var uname = bimreg.getuserkey("username", usertouse);
                    if (genus.externaluser.profiles.username.hasOwnProperty(uname) && typeof genus.externaluser.profiles.username[uname].key === "undefined") {
                        genus.externaluser.profiles.username[uname] = usertouse;
                    }
                }
            }
            bimreg.listener.addListener("externaluserloaded", handleEvent);
            bimreg.listener.fire({
                type: "externaluserloaded"
            });
        }
    },
    getexternaluseravatar: function (who) {
        return bimreg.getexternaluserkey("url", who);
    },
    getexternaluserkey: function (what, who) {
        if (who.length === 40) {
            if (genus.externaluser.profiles.keyed.hasOwnProperty(who)) {
                return bimreg.getuserkey(what, genus.externaluser.profiles.keyed[who]);
            }
        } else if (who.length <= 16) {
            if (genus.externaluser.profiles.username.hasOwnProperty(who)) {
                return bimreg.getuserkey(what, genus.externaluser.profiles.username[who]);
            }
        }
    },
    getuseravatar: function () {
        return bimreg.getuserkey("url");
    },
    getuserkey: function (what, where) {
        if (typeof where === 'undefined') {
            where = genus.currentuser.profile.user;
            return _getKey();
        } else if (typeof where === 'object') {
            where = where;
            return _getKey();
        } else {
            return "";
        }

        function _getKey() {
            for (key in where) {
                if (key == what) {
                    result = where[key];
                    if (result == null && result == undefined || result == "null") {
                        result = "";
                    }
                    return result;
                } else if (typeof (where[key]) == "object") {
                    var result = bimreg.getuserkey(what, where[key]);
                    if (result != null) {
                        return result;
                    }
                }
            }
        }
    }
};
bimcontenttools = {
    listener: new EventTarget(),
    contestresults: false,
    getvotes: function (contentid, contestid) {
        var callback = {
            "success": "bimcontenttools.votingloaded",
            "fail": "bimcontenttools.votingunavailable"
        };
        genus.contentmodel.getvoting(contentid, contestid, callback);
    },
    votingloaded: function (data) {
        bimcontenttools.listener.addListener("contentVotingLoaded", handleEvent);
        bimcontenttools.listener.fire({
            type: "contentVotingLoaded",
            data: data
        });
    },
    votingunavailable: function (err) {
        bimcontenttools.listener.addListener("contentVotingUnavailable", handleEvent);
        bimcontenttools.listener.fire({
            type: "contentVotingUnavailable",
            err: err
        });
    },
    getcontest: function (contestid) {
        var callback = {
            "success": "bimcontenttools.contestloaded",
            "fail": "bimcontenttools.contestunavailable"
        };
        genus.contentmodel.getcontest(contestid, callback);
    },
    contestloaded: function (data) {
        bimcontenttools.contestresults = JSON.parse(data);
        bimcontenttools.listener.addListener("contestLoaded", handleEvent);
        bimcontenttools.listener.fire({
            type: "contestLoaded",
            data: data
        });
    },
    contestunavailable: function (err) {
        bimcontenttools.listener.addListener("contestUnavailable", handleEvent);
        bimcontenttools.listener.fire({
            type: "contestUnavailable",
            err: err
        });
    },
    vote: function (contentid) {
        var callback = {
            "success": "bimcontenttools.voterecorded",
            "fail": "bimcontenttools.voterror"
        };
        genus.contentmodel.vote(contentid, callback);
    },
    voterecorded: function (data) {
        bimcontenttools.listener.addListener("contentVoteRecorded", handleEvent);
        bimcontenttools.listener.fire({
            type: "contentVoteRecorded",
            data: data
        });
    },
    voterror: function (err) {
        bimcontenttools.listener.addListener("contentVoteError", handleEvent);
        bimcontenttools.listener.fire({
            type: "contentVoteError",
            err: err
        });
    }
};

function addcustomvalidation() {
    jQuery.validator.addMethod('oldenough', function (value, element) {
        age = 13;
        var mydate = new Date(value);
        var currdate = new Date();
        currdate.setFullYear(currdate.getFullYear() - age);
        return this.optional(element) || (mydate - currdate) < 0;
    }, 'Age has to be greater than 13');
    jQuery.validator.addMethod("phoneUS", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || (phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/));
    }, "Please specify a valid phone number");
    jQuery.validator.addMethod("postalcode", function (postalcode, element) {
        return this.optional(element) || postalcode.match(/(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnpstvxy]{1}\d{1}[A-Za-z]{1} ?\d{1}[A-Za-z]{1}\d{1})$/);
    }, "Please specify a valid postal/zip code");
    jQuery.validator.addMethod("nospaces", function (value, element) {
        return this.optional(element) || value.indexOf(' ') == -1;
    }, "This field cannot contain spaces.");
}