/**
 * windows 中的Unicode采用16位(2字节)的编码方案，这样只能表示6万多个字符。
 * 为编码更多的字符，采用了一种叫代理项对的方案。即采用两个编码来表示一个字符。这些编码不得做它用。
 * 其中第一个字的范围是:d800-dbff,第二个字的范围是：dc00-dfff。（均能取到等号）
 */

/*! https://mths.be/at v0.2.0 by @mathias */
if (!String.prototype.at) {
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		//找到定义修改对象变量的函数
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements.
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch (exception) {}
			return result;
		}());
		//定义at()函数
		var at = function(position) {
			if (this == null) {
				throw TypeError();
			}
			//把引用该方法的字符串转换为字符串（因为String构造的对象可能被修改而不是纯正的字符串？）
			var string = String(this);
			var size = string.length;
			// `ToInteger`
			//把取字位置position转换为数字，参数position可以输入数字或字符串
			var index = position ? Number(position) : 0;
			//若输入的不是数字或字符串则取字位置默认为0
			if (index != index) { // better `isNaN`
				index = 0;
			}
			// Account for out-of-bounds indices
			// The odd lower bound is because the ToInteger operation is
			// going to round `n` to `0` for `-1 < n <= 0`.
			//若输入负数或输入数字过大（超过字符串长度），则只能返回空字符串
			if (index <= -1 || index >= size) {
				return '';
			}
			// Second half of `ToInteger`
			//把获取到的数字（可能是小数）按照向零                                                                                                                                                                                                                          取舍的方法转换为整数
			index = index | 0;
			// Get the first code unit and code unit value
			var cuFirst = string.charCodeAt(index);
			var cuSecond;
			var nextIndex = index + 1;
			var len = 1;
			//判断选定字符的unicode字符编码字节长度
			if ( // Check if it’s the start of a surrogate pair.
				cuFirst >= 0xD800 && cuFirst <= 0xDBFF && // high surrogate
				size > nextIndex // there is a next code unit
			) {
				cuSecond = string.charCodeAt(nextIndex);
				if (cuSecond >= 0xDC00 && cuSecond <= 0xDFFF) { // low surrogate
					len = 2;
				}
			}
			return string.slice(index, index + len);
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'at', {
				'value': at,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.at = at;
		}
	}());
}
