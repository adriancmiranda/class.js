//     Proto.js 0.0.6

//     (c) 2015-2016 Adrian C. Miranda
//     Proto may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://ambox.github.io

(function(global, name, version, factory){
	'use strict';

	if(typeof module === 'object' && typeof module.exports === 'object'){

		// Set up for Node.js or CommonJS.
		module.exports = factory(global, exports, name, version);

	}else if(typeof define === 'function' && define.amd){// jshint ignore:line

		// Next for module appropriately for the environment. Start with AMD.
		define(['exports'], function(exports){// jshint ignore:line
			return factory(global, exports, name, version);
		});

	}else{

		// Finally, as a browser global.
		global[name] = factory(global, {}, name, version);

	}

})(this, 'Proto', '0.0.6', function(global, exports, name, version){
	'use strict';

	// Helpers
	// -------

	var uid = 0;

	var ctor = function noop(){};

	function ape(fn){
		return function(){
			return Function.call.apply(fn, arguments);
		};
	}

	var slice = ape(Array.prototype.slice);

	var isArray = Array.isArray;

	var toString = ape(Object.prototype.toString);

	var reSuper = /\bsuper\b/;

	var reObjectAssessor = /\[(["']?)([^\1]+?)\1?\]/g;

	var reFnDeclaration = /^.*function\s([^\s]*|[^\(]*)\([^\x00]+$/;

	var reObjectWrapper = /^(\[object(\s|\uFEFF|\xA0))|(\])$/g;

	function isUndefined(value){
		return typeof value === 'undefined';
	}

	function isString(value){
		return typeof value === 'string';
	}

	function isFunction(value){
		return typeof value === 'function';
	}

	function isLikeObject(value){
		return value === Object(value);
	}

	function isObject(value){
		return toString(value) === '[object Object]';
	}

	function copy(proto){
		var Proto = function(){};
		Proto.prototype = proto.prototype || proto;
		return new Proto();
	}

	function create(proto, properties){
		proto = copy(proto);
		if(isLikeObject(properties)){
			for(var property in properties){
				if(properties.hasOwnProperty((property))){
					proto[property] = properties[property].value;
				}
			}
		}
		return proto;
	}

	function merge(target){
		var params = slice(arguments);
		for(var id = 1, source; id < params.length; id++){
			source = params[id];
			for(var property in source){
				if(source.hasOwnProperty(property)){
					if(isObject(source[property]) && isObject(target[property])){
						target[property] = merge(target[property], source[property]);
					}else{
						target[property] = source[property];
					}
				}
			}
		}
		return target;
	}

	function keys(object, getEnum){
		var properties = [];
		for(var key in object){
			if(getEnum || object.hasOwnProperty(key)){
				properties.push(key);
			}
		}
		return properties;
	}

	function overload(target, name, fn){
		var cache = target[name];
		target[name] = function(){
			if(fn.length === arguments.length){
				return fn.apply(this, arguments);
			}else if(isFunction(cache)){
				return cache.apply(this, arguments);
			}
		};
	}

	function implement(list){
		var proto = {}, collection = {};
		list = isArray(list)? list : [list];
		for(var id = 0, item; id < list.length; id++){
			item = list[id];
			if(isFunction(item)){
				item = item.prototype;
			}
			for(var key in item){
				if(key !== 'constructor'){
					proto[key] = item[key];
				}
			}
			if(proto.implements){
				collection = implement(proto.implements);
			}else{
				collection = merge(collection, proto);
			}
		}
		return collection;
	}

	function flush(object){
		for(var key in object){
			if(object.hasOwnProperty(key)){
				delete object[key];
			}
		}
	}

	function bind(fn, context){
		var args = slice(arguments, 2);
		var proxy = function(){
			return fn.apply(context, args.concat(slice(arguments)));
		};
		proxy.__bind__ = proxy.__bind__ || fn;
		return proxy;
	}

	function unbind(fn){
		var cache = fn.__bind__;
		delete fn.__bind__;
		return cache;
	}

	function bindAll(context, methods){
		methods = isArray(methods)? methods : slice(arguments, 1);
		methods = methods.length? methods : keys(context, true);
		for(var id = 0; id < methods.length; id++){
			if(isFunction(context[methods[id]])){
				context[methods[id]] = bind(context[methods[id]], context);
			}
		}
		return context;
	}

	function unbindAll(context, methods){
		methods = isArray(methods)? methods : slice(arguments, 1);
		methods = methods.length? methods : keys(context, true);
		for(var id = 0; id < methods.length; id++){
			if(isFunction(context[methods[id]])){
				context[methods[id]] = unbind(context[methods[id]], context);
			}
		}
		return context;
	}

	function createSuperMethod(name, action, pointer){
		pointer = isFunction(pointer)? pointer : ctor;
		return function(){
			this.super = pointer;
			return action.apply(this, arguments);
		};
	}

	function enableSuperMethods(parent, proto){
		for(var key in proto){
			if(isFunction(proto[key]) && reSuper.test(proto[key].toString())){
				proto[key] = createSuperMethod(key, proto[key], parent.prototype[key]);
			}
		}
		return proto;
	}


	// Overrides
	// ---------

	Function.prototype.bind = function(context){
		return bind(this, context);
	};

	Function.prototype.unbind = function(){
		return unbind(this);
	};


  // Proto
  // -----

  function Proto(){
    if(isFunction(this.initialize)){
      return this.initialize.apply(this, arguments);
    }
    return this;
  }

  Proto.create = Object.create || create;
  Proto.implements = implement;
  Proto.unbindAll = unbindAll;
  Proto.bindAll = bindAll;
  Proto.unbind = unbind;
  Proto.bind = bind;
  Proto.overload = overload;
  Proto.merge = merge;
  Proto.flush = flush;
  Proto.keys = keys;
  Proto.copy = copy;
  Proto.ape = ape;

  Proto.of = function(value, qualified){
    var type = toString(value);
    if(qualified && type === '[object Object]'){
      return value.constructor.toString().replace(reFnDeclaration, '$1') || 'Object';
    }
    return type.replace(reObjectWrapper, '');
  };

  Proto.extends = function(proto, staticProperties){
    var Caste, Constructor, Implementations, Super = this;

    enableSuperMethods(Super, proto);

    Constructor = function(){
      return Super.apply(this, arguments);
    };

    if(proto && proto.hasOwnProperty('constructor')){
      Constructor = proto.constructor;
    }

    merge(Constructor, Super, staticProperties);

    Caste = function(){ this.constructor = Constructor; };
    Caste.prototype = Super.prototype;
    Constructor.prototype = Proto.create(Caste.prototype);

    if(proto && proto.hasOwnProperty('implements')){
      Implementations = implement(proto.implements);
      merge(Constructor.prototype, Implementations);
      delete proto.implements;
    }

    proto && merge(Constructor.prototype, proto, {
      $protoID:++uid
    });

    Constructor.super = Super.prototype;
    Super.extends = Proto.extends;
    return Constructor;
  };

  Proto.prototype.toImplement = function(list){
    return merge(this.prototype, implement(list));
  };

  Proto.prototype.overload = function(name, fn){
    return overload(this.prototype, name, fn);
  };

  Proto.prototype.setOptions = function(options){
  	this.options = merge({}, this.defaults, options);
    return this.options;
  };

  Proto.prototype.getOptions = function(){
    return isLikeObject(this.options)? this.options : {};
  };

  Proto.prototype.unbindAll = function(){
    return unbindAll(this, slice(arguments));
  };

  Proto.prototype.bindAll = function(){
    return bindAll(this, slice(arguments));
  };

  Proto.prototype.flush = function(){
    flush(this);
  };


	// Externalize
	// -----------

	exports[name] = Proto;
	exports[name].VERSION = version;

	return Proto;
});
