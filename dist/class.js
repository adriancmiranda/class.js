/**
 * Class
 * @description Class is a small JavaScript library for simple but powerful class based inheritance.
 * @version v0.0.2
 * @author Adrian C. Miranda
 * @link https://github.com/adriancmiranda/class.js
 * @license MIT Licensed
 */
(function (window, document, undefined) {
    //| .-------------------------------------------------------------------.
    //| | NAMING CONVENTIONS:                                               |
    //| |-------------------------------------------------------------------|
    //| | Singleton-literals and prototype objects      | PascalCase        |
    //| |-------------------------------------------------------------------|
    //| | Functions and public variables                | camelCase         |
    //| |-------------------------------------------------------------------|
    //| | Global variables and constants                | UPPERCASE         |
    //| |-------------------------------------------------------------------|
    //| | Private variables                             | _underscorePrefix |
    //| '-------------------------------------------------------------------'
    //|
    //| Comment syntax for the entire project follows JSDoc:
    //| @see http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
    //'
    'use strict';
    // Class - Utilities methods
    var DONT_ENUMS, IS_DONTENUM_BUGGY;
    DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
    IS_DONTENUM_BUGGY = function () {
        for (var property in { toString: 1 }) {
            if (property === 'toString') {
                return false;
            }
        }
        return true;
    }();
    function iterate(iterable) {
        var length, results;
        if (!typeOf(iterable)) {
            return [];
        }
        if ('toArray' in Object(iterable)) {
            return iterable.toArray();
        }
        length = iterable.length || 0;
        results = new Array(length);
        while (length--) {
            results[length] = iterable[length];
        }
        return results;
    }
    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }
    // Class - Static methods
    function getDefinitionName(value, strict) {
        if (value === false) {
            return 'Boolean';
        }
        if (value === '') {
            return 'String';
        }
        if (value === 0) {
            return 'Number';
        }
        if (value && value.constructor) {
            var name = (value.constructor.toString() || Object.prototype.toString.apply(value)).replace(/^.*function([^\s]*|[^\(]*)\([^\x00]+$/, '$1').replace(/^(\[object\s)|]$/g, '').replace(/\s+/, '') || 'Object';
            if (strict !== true) {
                if (!/^(Boolean|RegExp|Number|String|Array|Date)$/.test(name)) {
                    return 'Object';
                }
            }
            return name;
        }
        return value;
    }
    function typeOf(value, strict) {
        var type = typeof value;
        if (value === false) {
            return 'boolean';
        }
        if (value === '') {
            return 'string';
        }
        if (value && type === 'object') {
            type = getDefinitionName(value, strict);
            type = String(type).toLowerCase();
        }
        if (type === 'number' && !window.isNaN(value) && window.isFinite(value)) {
            if (strict === true && window.parseFloat(value) === window.parseInt(value, 10)) {
                return value < 0 ? 'int' : 'uint';
            }
            return 'number';
        }
        return value ? type : value;
    }
    // Class - Other static methods
    function isUndefined(value) {
        return !typeOf(value);
    }
    function isDefined(value) {
        return !isUndefined(value);
    }
    function isObject(value) {
        return typeOf(value) === 'object';
    }
    function isString(value) {
        return typeOf(value) === 'string';
    }
    function isNumber(value) {
        return typeOf(value) === 'number';
    }
    function isUint(value) {
        return typeOf(value, true) === 'uint';
    }
    function isInt(value) {
        return typeOf(value, true) === 'int';
    }
    function isDate(value) {
        return typeOf(value) === 'date';
    }
    function isArray(value) {
        return typeOf(value) === 'array';
    }
    function isArrayLike(value) {
        if (value == null || isWindow(value)) {
            return false;
        }
        var length = value.length;
        if (value.nodeType === 1 && length) {
            return true;
        }
        return isString(value) || isArray(value) || length === 0 || isUint(length) && length > 0 && length - 1 in value;
    }
    function isFunction(value) {
        return typeOf(value) === 'function';
    }
    function isRegExp(value) {
        return typeOf(value) === 'regexp';
    }
    function isBoolean(value) {
        return typeOf(value) === 'boolean';
    }
    function isElement(value) {
        return !!(value && (value.nodeName || isFunction(value.on) && isFunction(value.find) && isFunction(value.eq) && isFunction(value.css)));
    }
    function isFile(value) {
        return typeOf(value, true) === 'file';
    }
    function isWindow(value) {
        return value && value.document && value.location && value.alert && value.setInterval && value.setTimeout;
    }
    extend(Object, function () {
        function keys(object) {
            var property, id, results = [];
            if (typeOf(object) !== 'object') {
                return results;
            }
            for (property in object) {
                if (Object.prototype.hasOwnProperty.call(object, property)) {
                    results.push(property);
                }
            }
            if (IS_DONTENUM_BUGGY) {
                for (id = 0; property = DONT_ENUMS[id]; id++) {
                    if (Object.prototype.hasOwnProperty.call(object, property)) {
                        results.push(property);
                    }
                }
            }
            return results;
        }
        var statics = {
                extend: extend,
                keys: Object.keys || keys
            };
        return statics;
    }());
    extend(Function.prototype, function () {
        var slice = Array.prototype.slice;
        function bind(context) {
            var method, args, bound, noop;
            if (arguments.length < 2 && !typeOf(arguments[0])) {
                return this;
            }
            if (!typeOf(this) === 'function') {
                throw new TypeError('The object is not callable.');
            }
            method = this;
            args = slice.call(arguments, 1);
            noop = function () {
            };
            bound = function () {
                var params, instance;
                params = merge(args, arguments);
                instance = this instanceof bound ? this : context;
                return method.apply(instance, params);
            };
            noop.prototype = this.prototype;
            bound.prototype = new noop();
            return bound;
        }
        function argumentNames() {
            var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(/\s+/g, '').split(',');
            return names.length == 1 && !names[0] ? [] : names;
        }
        function update(array, args) {
            var arrayLength, length;
            arrayLength = array.length;
            length = args.length;
            while (length--) {
                array[arrayLength + length] = args[length];
            }
            return array;
        }
        function merge(array, args) {
            array = slice.call(array, 0);
            return update(array, args);
        }
        function wrap(wrapper) {
            var methodCaller = this;
            return function () {
                var args = update([methodCaller.bind(this)], arguments);
                return wrapper.apply(this, args);
            };
        }
        var extensions = {
                argumentNames: argumentNames,
                wrap: wrap
            };
        if (!Function.prototype.bind) {
            extensions.bind = bind;
        }
        return extensions;
    }());
    // Based on Alex Arnell's inheritance implementation.
    var Class = function () {
            function Subclass() {
            }
            function create() {
                var parent, properties, id;
                id = -1;
                parent = null;
                properties = iterate(arguments);
                if (typeOf(properties[0]) === 'function') {
                    parent = properties.shift();
                }
                function Caste() {
                    if (typeOf(this.initialize) === 'function') {
                        this.initialize.apply(this, arguments);
                    }
                }
                Object.extend(Caste, Class.Methods);
                Caste.superclass = parent;
                Caste.subclasses = [];
                if (parent) {
                    Subclass.prototype = parent.prototype;
                    Caste.prototype = new Subclass();
                    parent.subclasses.push(Caste);
                }
                while (++id < properties.length) {
                    Caste.implement(properties[id]);
                }
                if (!typeOf(Caste.prototype.initialize)) {
                    Caste.prototype.initialize = function () {
                    };
                }
                Caste.prototype.constructor = Caste;
                return Caste;
            }
            function mutate(items) {
            }
            function implement(source) {
                var ancestor, properties, id, property, value, method;
                ancestor = this.superclass && this.superclass.prototype;
                properties = Object.keys(source);
                id = -1;
                if (IS_DONTENUM_BUGGY) {
                    if (source.toString != Object.prototype.toString) {
                        properties.push('toString');
                    }
                    if (source.valueOf != Object.prototype.valueOf) {
                        properties.push('valueOf');
                    }
                }
                while (++id < properties.length) {
                    property = properties[id];
                    value = source[property];
                    if (property === 'implements') {
                        if (typeOf(value) === 'function') {
                        } else {
                        }
                    }
                    if (ancestor && typeOf(value) === 'function' && /\$super/g.test(value.argumentNames()[0])) {
                        method = value;
                        value = function (fn) {
                            return function () {
                                return ancestor[fn].apply(this, arguments);
                            };
                        }(property).wrap(method);
                        value.valueOf = function (method) {
                            return function () {
                                return method.valueOf.call(method);
                            };
                        }(method);
                        value.toString = function (method) {
                            return function () {
                                return method.toString.call(method);
                            };
                        }(method);
                    }
                    this.prototype[property] = value;
                }
                return this;
            }
            return {
                create: create,
                Methods: {
                    extend: Object.extend,
                    implement: implement
                }
            };
        }();
    // Externalize
    Class.getDefinitionName = getDefinitionName;
    Class.typeOf = typeOf;
    Class.isUndefined = isUndefined;
    Class.isDefined = isDefined;
    Class.isObject = isObject;
    Class.isString = isString;
    Class.isNumber = isNumber;
    Class.isUint = isUint;
    Class.isInt = isInt;
    Class.isDate = isDate;
    Class.isArray = isArray;
    Class.isArrayLike = isArrayLike;
    Class.isFunction = isFunction;
    Class.isRegExp = isRegExp;
    Class.isBoolean = isBoolean;
    Class.isElement = isElement;
    Class.isFile = isFile;
    Class.isWindow = isWindow;
}(this, this.document));