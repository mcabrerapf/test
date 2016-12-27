/*!
 * angular-translate - v2.11.0 - 2016-03-20
 * 
 * Copyright (c) 2016 The angular-translate team, Pascal Precht; Licensed MIT
 */

!function(t,e){"function"==typeof define&&define.amd?define([],function(){return e()}):"object"==typeof exports?module.exports=e():e()}(this,function(){function t(t){"use strict";var e=t.storageKey(),n=t.storage(),a=function(){var a=t.preferredLanguage();angular.isString(a)?t.use(a):n.put(e,t.use())};a.displayName="fallbackFromIncorrectStorageValue",n?n.get(e)?t.use(n.get(e)).catch(a):a():angular.isString(t.preferredLanguage())&&t.use(t.preferredLanguage())}function e(){"use strict";var t,e,n=null,a=!1,r=!1;e={sanitize:function(t,e){return"text"===e&&(t=s(t)),t},escape:function(t,e){return"text"===e&&(t=i(t)),t},sanitizeParameters:function(t,e){return"params"===e&&(t=o(t,s)),t},escapeParameters:function(t,e){return"params"===e&&(t=o(t,i)),t}},e.escaped=e.escapeParameters,this.addStrategy=function(t,n){return e[t]=n,this},this.removeStrategy=function(t){return delete e[t],this},this.useStrategy=function(t){return a=!0,n=t,this},this.$get=["$injector","$log",function(i,s){var o={},u=function(t,n,a){return angular.forEach(a,function(a){if(angular.isFunction(a))t=a(t,n);else if(angular.isFunction(e[a]))t=e[a](t,n);else{if(!angular.isString(e[a]))throw new Error("pascalprecht.translate.$translateSanitization: Unknown sanitization strategy: '"+a+"'");if(!o[e[a]])try{o[e[a]]=i.get(e[a])}catch(t){throw o[e[a]]=function(){},new Error("pascalprecht.translate.$translateSanitization: Unknown sanitization strategy: '"+a+"'")}t=o[e[a]](t,n)}}),t},l=function(){a||r||(s.warn("pascalprecht.translate.$translateSanitization: No sanitization strategy has been configured. This can have serious security implications. See http://angular-translate.github.io/docs/#/guide/19_security for details."),r=!0)};return i.has("$sanitize")&&(t=i.get("$sanitize")),{useStrategy:function(t){return function(e){t.useStrategy(e)}}(this),sanitize:function(t,e,a){if(n||l(),arguments.length<3&&(a=n),!a)return t;var r=angular.isArray(a)?a:[a];return u(t,e,r)}}}];var i=function(t){var e=angular.element("<div></div>");return e.text(t),e.html()},s=function(e){if(!t)throw new Error("pascalprecht.translate.$translateSanitization: Error cannot find $sanitize service. Either include the ngSanitize module (https://docs.angularjs.org/api/ngSanitize) or use a sanitization strategy which does not depend on $sanitize, such as 'escape'.");return t(e)},o=function(t,e,n){if(angular.isObject(t)){var a=angular.isArray(t)?[]:{};if(n){if(n.indexOf(t)>-1)throw new Error("pascalprecht.translate.$translateSanitization: Error cannot interpolate parameter due recursive object")}else n=[];return n.push(t),angular.forEach(t,function(t,r){a[r]=o(t,e,n)}),n.splice(-1,1),a}return angular.isNumber(t)?t:e(t)}}function n(t,e,n,a){"use strict";var r,i,s,o,u,l,c,f,g,p,h,d,v,m,y,$,b={},L=[],S=t,j=[],w="translate-cloak",N=!1,C=!1,O=".",P=!1,E=0,k=!0,x="default",T={default:function(t){return(t||"").split("-").join("_")},java:function(t){var e=(t||"").split("-").join("_"),n=e.split("_");return n.length>1?n[0].toLowerCase()+"_"+n[1].toUpperCase():e},bcp47:function(t){var e=(t||"").split("_").join("-"),n=e.split("-");return n.length>1?n[0].toLowerCase()+"-"+n[1].toUpperCase():e},"iso639-1":function(t){var e=(t||"").split("_").join("-"),n=e.split("-");return n[0].toLowerCase()}},F="2.11.0",z=function(){if(angular.isFunction(a.getLocale))return a.getLocale();var t,n,r=e.$get().navigator,i=["language","browserLanguage","systemLanguage","userLanguage"];if(angular.isArray(r.languages))for(t=0;t<r.languages.length;t++)if(n=r.languages[t],n&&n.length)return n;for(t=0;t<i.length;t++)if(n=r[i[t]],n&&n.length)return n;return null};z.displayName="angular-translate/service: getFirstBrowserLanguage";var A=function(){var t=z()||"";return T[x]&&(t=T[x](t)),t};A.displayName="angular-translate/service: getLocale";var I=function(t,e){for(var n=0,a=t.length;n<a;n++)if(t[n]===e)return n;return-1},R=function(){return this.toString().replace(/^\s+|\s+$/g,"")},_=function(t){if(t){for(var e=[],n=angular.lowercase(t),a=0,r=L.length;a<r;a++)e.push(angular.lowercase(L[a]));if(I(e,n)>-1)return t;if(i){var s;for(var o in i)if(i.hasOwnProperty(o)){var u=!1,l=Object.prototype.hasOwnProperty.call(i,o)&&angular.lowercase(o)===angular.lowercase(t);if("*"===o.slice(-1)&&(u=o.slice(0,-1)===t.slice(0,o.length-1)),(l||u)&&(s=i[o],I(e,angular.lowercase(s))>-1))return s}}var c=t.split("_");return c.length>1&&I(e,angular.lowercase(c[0]))>-1?c[0]:void 0}},D=function(t,e){if(!t&&!e)return b;if(t&&!e){if(angular.isString(t))return b[t]}else angular.isObject(b[t])||(b[t]={}),angular.extend(b[t],V(e));return this};this.translations=D,this.cloakClassName=function(t){return t?(w=t,this):w},this.nestedObjectDelimeter=function(t){return t?(O=t,this):O};var V=function(t,e,n,a){var r,i,s,o;e||(e=[]),n||(n={});for(r in t)Object.prototype.hasOwnProperty.call(t,r)&&(o=t[r],angular.isObject(o)?V(o,e.concat(r),n,r):(i=e.length?""+e.join(O)+O+r:r,e.length&&r===a&&(s=""+e.join(O),n[s]="@:"+i),n[i]=o));return n};V.displayName="flatObject",this.addInterpolation=function(t){return j.push(t),this},this.useMessageFormatInterpolation=function(){return this.useInterpolation("$translateMessageFormatInterpolation")},this.useInterpolation=function(t){return p=t,this},this.useSanitizeValueStrategy=function(t){return n.useStrategy(t),this},this.preferredLanguage=function(t){return t?(K(t),this):r};var K=function(t){return t&&(r=t),r};this.translationNotFoundIndicator=function(t){return this.translationNotFoundIndicatorLeft(t),this.translationNotFoundIndicatorRight(t),this},this.translationNotFoundIndicatorLeft=function(t){return t?(v=t,this):v},this.translationNotFoundIndicatorRight=function(t){return t?(m=t,this):m},this.fallbackLanguage=function(t){return M(t),this};var M=function(t){return t?(angular.isString(t)?(o=!0,s=[t]):angular.isArray(t)&&(o=!1,s=t),angular.isString(r)&&I(s,r)<0&&s.push(r),this):o?s[0]:s};this.use=function(t){if(t){if(!b[t]&&!h)throw new Error("$translateProvider couldn't find translationTable for langKey: '"+t+"'");return u=t,this}return u},this.resolveClientLocale=function(){return A()};var U=function(t){return t?(S=t,this):f?f+S:S};this.storageKey=U,this.useUrlLoader=function(t,e){return this.useLoader("$translateUrlLoader",angular.extend({url:t},e))},this.useStaticFilesLoader=function(t){return this.useLoader("$translateStaticFilesLoader",t)},this.useLoader=function(t,e){return h=t,d=e||{},this},this.useLocalStorage=function(){return this.useStorage("$translateLocalStorage")},this.useCookieStorage=function(){return this.useStorage("$translateCookieStorage")},this.useStorage=function(t){return c=t,this},this.storagePrefix=function(t){return t?(f=t,this):t},this.useMissingTranslationHandlerLog=function(){return this.useMissingTranslationHandler("$translateMissingTranslationHandlerLog")},this.useMissingTranslationHandler=function(t){return g=t,this},this.usePostCompiling=function(t){return N=!!t,this},this.forceAsyncReload=function(t){return C=!!t,this},this.uniformLanguageTag=function(t){return t?angular.isString(t)&&(t={standard:t}):t={},x=t.standard,this},this.determinePreferredLanguage=function(t){var e=t&&angular.isFunction(t)?t():A();return r=L.length?_(e)||e:e,this},this.registerAvailableLanguageKeys=function(t,e){return t?(L=t,e&&(i=e),this):L},this.useLoaderCache=function(t){return t===!1?y=void 0:t===!0?y=!0:"undefined"==typeof t?y="$translationCache":t&&(y=t),this},this.directivePriority=function(t){return void 0===t?E:(E=t,this)},this.statefulFilter=function(t){return void 0===t?k:(k=t,this)},this.postProcess=function(t){return $=t?t:void 0,this},this.$get=["$log","$injector","$rootScope","$q",function(t,e,n,a){var i,f,x,T=e.get(p||"$translateDefaultInterpolation"),z=!1,H={},q={},G=function(t,e,n,o,l){!u&&r&&(u=r);var g=l&&l!==u?_(l)||l:u;if(l&&lt(l),angular.isArray(t)){var p=function(t){for(var r={},i=[],s=function(t){var i=a.defer(),s=function(e){r[t]=e,i.resolve([t,e])};return G(t,e,n,o,l).then(s,s),i.promise},u=0,c=t.length;u<c;u++)i.push(s(t[u]));return a.all(i).then(function(){return r})};return p(t)}var h=a.defer();t&&(t=R.apply(t));var d=function(){var t=r?q[r]:q[g];if(f=0,c&&!t){var e=i.get(S);if(t=q[e],s&&s.length){var n=I(s,e);f=0===n?1:0,I(s,r)<0&&s.push(r)}}return t}();if(d){var v=function(){l||(g=u),it(t,e,n,o,g).then(h.resolve,h.reject)};v.displayName="promiseResolved",d.finally(v)}else it(t,e,n,o,g).then(h.resolve,h.reject);return h.promise},Y=function(t){return v&&(t=[v,t].join(" ")),m&&(t=[t,m].join(" ")),t},B=function(t){u=t,c&&i.put(G.storageKey(),u),n.$emit("$translateChangeSuccess",{language:t}),T.setLocale(u);var e=function(t,e){H[e].setLocale(u)};e.displayName="eachInterpolatorLocaleSetter",angular.forEach(H,e),n.$emit("$translateChangeEnd",{language:t})},J=function(t){if(!t)throw"No language key specified for loading.";var r=a.defer();n.$emit("$translateLoadingStart",{language:t}),z=!0;var i=y;"string"==typeof i&&(i=e.get(i));var s=angular.extend({},d,{key:t,$http:angular.extend({},{cache:i},d.$http)}),o=function(e){var a={};n.$emit("$translateLoadingSuccess",{language:t}),angular.isArray(e)?angular.forEach(e,function(t){angular.extend(a,V(t))}):angular.extend(a,V(e)),z=!1,r.resolve({key:t,table:a}),n.$emit("$translateLoadingEnd",{language:t})};o.displayName="onLoaderSuccess";var u=function(t){n.$emit("$translateLoadingError",{language:t}),r.reject(t),n.$emit("$translateLoadingEnd",{language:t})};return u.displayName="onLoaderError",e.get(h)(s).then(o,u),r.promise};if(c&&(i=e.get(c),!i.get||!i.put))throw new Error("Couldn't use storage '"+c+"', missing get() or put() method!");if(j.length){var Q=function(t){var n=e.get(t);n.setLocale(r||u),H[n.getInterpolationIdentifier()]=n};Q.displayName="interpolationFactoryAdder",angular.forEach(j,Q)}var W=function(t){var e=a.defer();if(Object.prototype.hasOwnProperty.call(b,t))e.resolve(b[t]);else if(q[t]){var n=function(t){D(t.key,t.table),e.resolve(t.table)};n.displayName="translationTableResolver",q[t].then(n,e.reject)}else e.reject();return e.promise},X=function(t,e,n,r){var i=a.defer(),s=function(a){if(Object.prototype.hasOwnProperty.call(a,e)){r.setLocale(t);var s=a[e];if("@:"===s.substr(0,2))X(t,s.substr(2),n,r).then(i.resolve,i.reject);else{var o=r.interpolate(a[e],n);o=ut(e,a[e],o,n,t),i.resolve(o)}r.setLocale(u)}else i.reject()};return s.displayName="fallbackTranslationResolver",W(t).then(s,i.reject),i.promise},Z=function(t,e,n,a){var r,i=b[t];if(i&&Object.prototype.hasOwnProperty.call(i,e)){if(a.setLocale(t),r=a.interpolate(i[e],n),"@:"===r.substr(0,2))return Z(t,r.substr(2),n,a);a.setLocale(u)}return r},tt=function(t,n,a){if(g){var r=e.get(g)(t,u,n,a);return void 0!==r?r:t}return t},et=function(t,e,n,r,i){var o=a.defer();if(t<s.length){var u=s[t];X(u,e,n,r).then(function(t){o.resolve(t)},function(){return et(t+1,e,n,r,i).then(o.resolve,o.reject)})}else i?o.resolve(i):g?o.resolve(tt(e,n)):o.reject(tt(e,n));return o.promise},nt=function(t,e,n,a){var r;if(t<s.length){var i=s[t];r=Z(i,e,n,a),r||(r=nt(t+1,e,n,a))}return r},at=function(t,e,n,a){return et(x>0?x:f,t,e,n,a)},rt=function(t,e,n){return nt(x>0?x:f,t,e,n)},it=function(t,e,n,r,i){var o=a.defer(),u=i?b[i]:b,l=n?H[n]:T;if(u&&Object.prototype.hasOwnProperty.call(u,t)){var c=u[t];if("@:"===c.substr(0,2))G(c.substr(2),e,n,r,i).then(o.resolve,o.reject);else{var f=l.interpolate(c,e);f=ut(t,c,f,e,i),o.resolve(f)}}else{var p;g&&!z&&(p=tt(t,e,r)),i&&s&&s.length?at(t,e,l,r).then(function(t){o.resolve(t)},function(t){o.reject(Y(t))}):g&&!z&&p?r?o.resolve(r):o.resolve(p):r?o.resolve(r):o.reject(Y(t))}return o.promise},st=function(t,e,n,a){var r,i=a?b[a]:b,o=T;if(H&&Object.prototype.hasOwnProperty.call(H,n)&&(o=H[n]),i&&Object.prototype.hasOwnProperty.call(i,t)){var u=i[t];r="@:"===u.substr(0,2)?st(u.substr(2),e,n,a):o.interpolate(u,e)}else{var l;g&&!z&&(l=tt(t,e)),a&&s&&s.length?(f=0,r=rt(t,e,o)):r=g&&!z&&l?l:Y(t)}return r},ot=function(t){l===t&&(l=void 0),q[t]=void 0},ut=function(t,n,a,r,i){var s=$;return s&&("string"==typeof s&&(s=e.get(s)),s)?s(t,n,a,r,i):a},lt=function(t){b[t]||!h||q[t]||(q[t]=J(t).then(function(t){D(t.key,t.table)}))};G.preferredLanguage=function(t){return t&&K(t),r},G.cloakClassName=function(){return w},G.nestedObjectDelimeter=function(){return O},G.fallbackLanguage=function(t){if(void 0!==t&&null!==t){if(M(t),h&&s&&s.length)for(var e=0,n=s.length;e<n;e++)q[s[e]]||(q[s[e]]=J(s[e]));G.use(G.use())}return o?s[0]:s},G.useFallbackLanguage=function(t){if(void 0!==t&&null!==t)if(t){var e=I(s,t);e>-1&&(x=e)}else x=0},G.proposedLanguage=function(){return l},G.storage=function(){return i},G.negotiateLocale=_,G.use=function(t){if(!t)return u;var e=a.defer();n.$emit("$translateChangeStart",{language:t});var r=_(t);return L.length>0&&!r?a.reject(t):(r&&(t=r),l=t,!C&&b[t]||!h||q[t]?q[t]?q[t].then(function(t){return l===t.key&&B(t.key),e.resolve(t.key),t},function(t){return!u&&s&&s.length>0?G.use(s[0]).then(e.resolve,e.reject):e.reject(t)}):(e.resolve(t),B(t)):(q[t]=J(t).then(function(n){return D(n.key,n.table),e.resolve(n.key),l===t&&B(n.key),n},function(t){return n.$emit("$translateChangeError",{language:t}),e.reject(t),n.$emit("$translateChangeEnd",{language:t}),a.reject(t)}),q[t].finally(function(){ot(t)})),e.promise)},G.resolveClientLocale=function(){return A()},G.storageKey=function(){return U()},G.isPostCompilingEnabled=function(){return N},G.isForceAsyncReloadEnabled=function(){return C},G.refresh=function(t){function e(){i.resolve(),n.$emit("$translateRefreshEnd",{language:t})}function r(){i.reject(),n.$emit("$translateRefreshEnd",{language:t})}if(!h)throw new Error("Couldn't refresh translation table, no loader registered!");var i=a.defer();if(n.$emit("$translateRefreshStart",{language:t}),t)if(b[t]){var o=function(n){D(n.key,n.table),t===u&&B(u),e()};o.displayName="refreshPostProcessor",J(t).then(o,r)}else r();else{var l=[],c={};if(s&&s.length)for(var f=0,g=s.length;f<g;f++)l.push(J(s[f])),c[s[f]]=!0;u&&!c[u]&&l.push(J(u));var p=function(t){b={},angular.forEach(t,function(t){D(t.key,t.table)}),u&&B(u),e()};p.displayName="refreshPostProcessor",a.all(l).then(p,r)}return i.promise},G.instant=function(t,e,n,a){var i=a&&a!==u?_(a)||a:u;if(null===t||angular.isUndefined(t))return t;if(a&&lt(a),angular.isArray(t)){for(var o={},l=0,c=t.length;l<c;l++)o[t[l]]=G.instant(t[l],e,n,a);return o}if(angular.isString(t)&&t.length<1)return t;t&&(t=R.apply(t));var f,p=[];r&&p.push(r),i&&p.push(i),s&&s.length&&(p=p.concat(s));for(var h=0,d=p.length;h<d;h++){var y=p[h];if(b[y]&&"undefined"!=typeof b[y][t]&&(f=st(t,e,n,i)),"undefined"!=typeof f)break}return f||""===f||(v||m?f=Y(t):(f=T.interpolate(t,e),g&&!z&&(f=tt(t,e)))),f},G.versionInfo=function(){return F},G.loaderCache=function(){return y},G.directivePriority=function(){return E},G.statefulFilter=function(){return k},G.isReady=function(){return P};var ct=a.defer();ct.promise.then(function(){P=!0}),G.onReady=function(t){var e=a.defer();return angular.isFunction(t)&&e.promise.then(t),P?e.resolve():ct.promise.then(e.resolve),e.promise},G.getAvailableLanguageKeys=function(){return L.length>0?L:null};var ft=n.$on("$translateReady",function(){ct.resolve(),ft(),ft=null}),gt=n.$on("$translateChangeEnd",function(){ct.resolve(),gt(),gt=null});if(h){if(angular.equals(b,{})&&G.use()&&G.use(G.use()),s&&s.length)for(var pt=function(t){return D(t.key,t.table),n.$emit("$translateChangeEnd",{language:t.key}),t},ht=0,dt=s.length;ht<dt;ht++){var vt=s[ht];!C&&b[vt]||(q[vt]=J(vt).then(pt))}}else n.$emit("$translateReady",{language:G.use()});return G}]}function a(t,e){"use strict";var n,a={},r="default";return a.setLocale=function(t){n=t},a.getInterpolationIdentifier=function(){return r},a.useSanitizeValueStrategy=function(t){return e.useStrategy(t),this},a.interpolate=function(n,a){a=a||{},a=e.sanitize(a,"params");var r=t(n)(a);return r=e.sanitize(r,"text")},a}function r(t,e,n,a,r,s){"use strict";var o=function(){return this.toString().replace(/^\s+|\s+$/g,"")};return{restrict:"AE",scope:!0,priority:t.directivePriority(),compile:function(e,u){var l=u.translateValues?u.translateValues:void 0,c=u.translateInterpolation?u.translateInterpolation:void 0,f=e[0].outerHTML.match(/translate-value-+/i),g="^(.*)("+n.startSymbol()+".*"+n.endSymbol()+")(.*)",p="^(.*)"+n.startSymbol()+"(.*)"+n.endSymbol()+"(.*)";return function(e,h,d){e.interpolateParams={},e.preText="",e.postText="",e.translateNamespace=i(e);var v={},m=function(t,n,a){if(n.translateValues&&angular.extend(t,r(n.translateValues)(e.$parent)),f)for(var i in a)if(Object.prototype.hasOwnProperty.call(n,i)&&"translateValue"===i.substr(0,14)&&"translateValues"!==i){var s=angular.lowercase(i.substr(14,1))+i.substr(15);t[s]=a[i]}},y=function(t){if(angular.isFunction(y._unwatchOld)&&(y._unwatchOld(),y._unwatchOld=void 0),angular.equals(t,"")||!angular.isDefined(t)){var a=o.apply(h.text()),r=a.match(g);if(angular.isArray(r)){e.preText=r[1],e.postText=r[3],v.translate=n(r[2])(e.$parent);var i=a.match(p);angular.isArray(i)&&i[2]&&i[2].length&&(y._unwatchOld=e.$watch(i[2],function(t){v.translate=t,w()}))}else v.translate=a?a:void 0}else v.translate=t;w()},$=function(t){d.$observe(t,function(e){v[t]=e,w()})};m(e.interpolateParams,d,u);var b=!0;d.$observe("translate",function(t){"undefined"==typeof t?y(""):""===t&&b||(v.translate=t,w()),b=!1});for(var L in d)d.hasOwnProperty(L)&&"translateAttr"===L.substr(0,13)&&$(L);if(d.$observe("translateDefault",function(t){e.defaultText=t,w()}),l&&d.$observe("translateValues",function(t){t&&e.$parent.$watch(function(){angular.extend(e.interpolateParams,r(t)(e.$parent))})}),f){var S=function(t){d.$observe(t,function(n){var a=angular.lowercase(t.substr(14,1))+t.substr(15);e.interpolateParams[a]=n})};for(var j in d)Object.prototype.hasOwnProperty.call(d,j)&&"translateValue"===j.substr(0,14)&&"translateValues"!==j&&S(j)}var w=function(){for(var t in v)v.hasOwnProperty(t)&&void 0!==v[t]&&N(t,v[t],e,e.interpolateParams,e.defaultText,e.translateNamespace)},N=function(e,n,a,r,i,s){n?(s&&"."===n.charAt(0)&&(n=s+n),t(n,r,c,i,a.translateLanguage).then(function(t){C(t,a,!0,e)},function(t){C(t,a,!1,e)})):C(n,a,!1,e)},C=function(e,n,r,i){if(r||"undefined"!=typeof n.defaultText&&(e=n.defaultText),"translate"===i){(r||!r&&"undefined"==typeof d.translateKeepContent)&&h.empty().append(n.preText+e+n.postText);var s=t.isPostCompilingEnabled(),o="undefined"!=typeof u.translateCompile,l=o&&"false"!==u.translateCompile;(s&&!o||l)&&a(h.contents())(n)}else{var c=d.$attr[i];"data-"===c.substr(0,5)&&(c=c.substr(5)),c=c.substr(15),h.attr(c,e)}};(l||f||d.translateDefault)&&e.$watch("interpolateParams",w,!0);var O=e.$on("translateLanguageChanged",w),P=s.$on("$translateChangeSuccess",w);h.text().length?y(d.translate?d.translate:""):d.translate&&y(d.translate),w(),e.$on("$destroy",function(){O(),P()})}}}}function i(t){"use strict";return t.translateNamespace?t.translateNamespace:t.$parent?i(t.$parent):void 0}function s(t,e){"use strict";return{compile:function(n){var a=function(){n.addClass(t.cloakClassName())},r=function(){n.removeClass(t.cloakClassName())};return t.onReady(function(){r()}),a(),function(n,i,s){s.translateCloak&&s.translateCloak.length&&(s.$observe("translateCloak",function(e){t(e).then(r,a)}),e.$on("$translateChangeSuccess",function(){t(s.translateCloak).then(r,a)}))}}}}function o(){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t,e,n){t.translateNamespace=i(t),t.translateNamespace&&"."===n.translateNamespace.charAt(0)?t.translateNamespace+=n.translateNamespace:t.translateNamespace=n.translateNamespace}}}}}function i(t){"use strict";return t.translateNamespace?t.translateNamespace:t.$parent?i(t.$parent):void 0}function u(){"use strict";return{restrict:"A",scope:!0,compile:function(){return function(t,e,n){n.$observe("translateLanguage",function(e){t.translateLanguage=e}),t.$watch("translateLanguage",function(){t.$broadcast("translateLanguageChanged")})}}}}function l(t,e){"use strict";var n=function(n,a,r,i){return angular.isObject(a)||(a=t(a)(this)),e.instant(n,a,r,i)};return e.statefulFilter()&&(n.$stateful=!0),n}function c(t){"use strict";return t("translations")}return t.$inject=["$translate"],n.$inject=["$STORAGE_KEY","$windowProvider","$translateSanitizationProvider","pascalprechtTranslateOverrider"],a.$inject=["$interpolate","$translateSanitization"],r.$inject=["$translate","$q","$interpolate","$compile","$parse","$rootScope"],s.$inject=["$translate","$rootScope"],l.$inject=["$parse","$translate"],c.$inject=["$cacheFactory"],angular.module("pascalprecht.translate",["ng"]).run(t),t.displayName="runTranslate",angular.module("pascalprecht.translate").provider("$translateSanitization",e),angular.module("pascalprecht.translate").constant("pascalprechtTranslateOverrider",{}).provider("$translate",n),n.displayName="displayName",angular.module("pascalprecht.translate").factory("$translateDefaultInterpolation",a),a.displayName="$translateDefaultInterpolation",angular.module("pascalprecht.translate").constant("$STORAGE_KEY","NG_TRANSLATE_LANG_KEY"),angular.module("pascalprecht.translate").directive("translate",r),r.displayName="translateDirective",angular.module("pascalprecht.translate").directive("translateCloak",s),s.displayName="translateCloakDirective",angular.module("pascalprecht.translate").directive("translateNamespace",o),o.displayName="translateNamespaceDirective",angular.module("pascalprecht.translate").directive("translateLanguage",u),u.displayName="translateLanguageDirective",angular.module("pascalprecht.translate").filter("translate",l),l.displayName="translateFilterFactory",angular.module("pascalprecht.translate").factory("$translationCache",c),c.displayName="$translationCache","pascalprecht.translate"});