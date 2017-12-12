import apply from 'describe-type/source/@/apply.js';

/**
 *
 * @param {Object} value
 * @param {String} key
 * @param {Function} cmd
 * @param {Object} ctx
 * @param {any} args
 * @returns {any}
 */
export default function resolveProperty(value, key, cmd, ctx, args) {
	if (value != null || (key !== 'prototype' && key !== 'length' && key !== 'name')) {
		const item = value[key];
		return apply(cmd, ctx || item, [item, key, value, args]);
	}
	return undefined;
}
