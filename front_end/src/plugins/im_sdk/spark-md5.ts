let add32 = function(a:any, b:any) {
        return (a + b) & 0xffffffff
    },
    cmn = function(q:any, a:any, b:any, x:any, s:any, t:any) {
        a = add32(add32(a, q), add32(x, t))
        return add32((a << s) | (a >>> (32 - s)), b)
    },
    ff = function(a:any, b:any, c:any, d:any, x:any, s:any, t:any) {
        return cmn((b & c) | (~b & d), a, b, x, s, t)
    },
    gg = function(a:any, b:any, c:any, d:any, x:any, s:any, t:any) {
        return cmn((b & d) | (c & ~d), a, b, x, s, t)
    },
    hh = function(a:any, b:any, c:any, d:any, x:any, s:any, t:any) {
        return cmn(b ^ c ^ d, a, b, x, s, t)
    },
    ii = function(a:any, b:any, c:any, d:any, x:any, s:any, t:any) {
        return cmn(c ^ (b | ~d), a, b, x, s, t)
    },
    md5cycle = function(x:any, k:any) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3]

        a = ff(a, b, c, d, k[0], 7, -680876936)
        d = ff(d, a, b, c, k[1], 12, -389564586)
        c = ff(c, d, a, b, k[2], 17, 606105819)
        b = ff(b, c, d, a, k[3], 22, -1044525330)
        a = ff(a, b, c, d, k[4], 7, -176418897)
        d = ff(d, a, b, c, k[5], 12, 1200080426)
        c = ff(c, d, a, b, k[6], 17, -1473231341)
        b = ff(b, c, d, a, k[7], 22, -45705983)
        a = ff(a, b, c, d, k[8], 7, 1770035416)
        d = ff(d, a, b, c, k[9], 12, -1958414417)
        c = ff(c, d, a, b, k[10], 17, -42063)
        b = ff(b, c, d, a, k[11], 22, -1990404162)
        a = ff(a, b, c, d, k[12], 7, 1804603682)
        d = ff(d, a, b, c, k[13], 12, -40341101)
        c = ff(c, d, a, b, k[14], 17, -1502002290)
        b = ff(b, c, d, a, k[15], 22, 1236535329)

        a = gg(a, b, c, d, k[1], 5, -165796510)
        d = gg(d, a, b, c, k[6], 9, -1069501632)
        c = gg(c, d, a, b, k[11], 14, 643717713)
        b = gg(b, c, d, a, k[0], 20, -373897302)
        a = gg(a, b, c, d, k[5], 5, -701558691)
        d = gg(d, a, b, c, k[10], 9, 38016083)
        c = gg(c, d, a, b, k[15], 14, -660478335)
        b = gg(b, c, d, a, k[4], 20, -405537848)
        a = gg(a, b, c, d, k[9], 5, 568446438)
        d = gg(d, a, b, c, k[14], 9, -1019803690)
        c = gg(c, d, a, b, k[3], 14, -187363961)
        b = gg(b, c, d, a, k[8], 20, 1163531501)
        a = gg(a, b, c, d, k[13], 5, -1444681467)
        d = gg(d, a, b, c, k[2], 9, -51403784)
        c = gg(c, d, a, b, k[7], 14, 1735328473)
        b = gg(b, c, d, a, k[12], 20, -1926607734)

        a = hh(a, b, c, d, k[5], 4, -378558)
        d = hh(d, a, b, c, k[8], 11, -2022574463)
        c = hh(c, d, a, b, k[11], 16, 1839030562)
        b = hh(b, c, d, a, k[14], 23, -35309556)
        a = hh(a, b, c, d, k[1], 4, -1530992060)
        d = hh(d, a, b, c, k[4], 11, 1272893353)
        c = hh(c, d, a, b, k[7], 16, -155497632)
        b = hh(b, c, d, a, k[10], 23, -1094730640)
        a = hh(a, b, c, d, k[13], 4, 681279174)
        d = hh(d, a, b, c, k[0], 11, -358537222)
        c = hh(c, d, a, b, k[3], 16, -722521979)
        b = hh(b, c, d, a, k[6], 23, 76029189)
        a = hh(a, b, c, d, k[9], 4, -640364487)
        d = hh(d, a, b, c, k[12], 11, -421815835)
        c = hh(c, d, a, b, k[15], 16, 530742520)
        b = hh(b, c, d, a, k[2], 23, -995338651)

        a = ii(a, b, c, d, k[0], 6, -198630844)
        d = ii(d, a, b, c, k[7], 10, 1126891415)
        c = ii(c, d, a, b, k[14], 15, -1416354905)
        b = ii(b, c, d, a, k[5], 21, -57434055)
        a = ii(a, b, c, d, k[12], 6, 1700485571)
        d = ii(d, a, b, c, k[3], 10, -1894986606)
        c = ii(c, d, a, b, k[10], 15, -1051523)
        b = ii(b, c, d, a, k[1], 21, -2054922799)
        a = ii(a, b, c, d, k[8], 6, 1873313359)
        d = ii(d, a, b, c, k[15], 10, -30611744)
        c = ii(c, d, a, b, k[6], 15, -1560198380)
        b = ii(b, c, d, a, k[13], 21, 1309151649)
        a = ii(a, b, c, d, k[4], 6, -145523070)
        d = ii(d, a, b, c, k[11], 10, -1120210379)
        c = ii(c, d, a, b, k[2], 15, 718787259)
        b = ii(b, c, d, a, k[9], 21, -343485551)

        x[0] = add32(a, x[0])
        x[1] = add32(b, x[1])
        x[2] = add32(c, x[2])
        x[3] = add32(d, x[3])
    },
    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
    md5blk = function(s:any) {
        var md5blks = [],
            i /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] =
                s.charCodeAt(i) +
                (s.charCodeAt(i + 1) << 8) +
                (s.charCodeAt(i + 2) << 16) +
                (s.charCodeAt(i + 3) << 24)
        }
        return md5blks
    },
    md5blk_array = function(a:any) {
        var md5blks = [],
            i /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] =
                a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24)
        }
        return md5blks
    },
    md51 = function(s:any) {
        let n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp:any,
            lo,
            hi

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)))
        }
        s = s.substring(i - 64)
        length = s.length
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3)
        }
        tail[i >> 2] |= 0x80 << (i % 4 << 3)
        if (i > 55) {
            md5cycle(state, tail)
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/)
        lo = parseInt(tmp[2], 16)
        hi = parseInt(tmp[1], 16) || 0

        tail[14] = lo
        tail[15] = hi

        md5cycle(state, tail)
        return state
    },
    md51_array = function(a:any) {
        let n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp:any,
            lo,
            hi

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)))
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0)

        length = a.length
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << (i % 4 << 3)
        }

        tail[i >> 2] |= 0x80 << (i % 4 << 3)
        if (i > 55) {
            md5cycle(state, tail)
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/)
        lo = parseInt(tmp[2], 16)
        hi = parseInt(tmp[1], 16) || 0

        tail[14] = lo
        tail[15] = hi

        md5cycle(state, tail)

        return state
    },
    hex_chr = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f'
    ],
    rhex = function(n:any) {
        var s = '',
            j
        for (j = 0; j < 4; j += 1) {
            s +=
                hex_chr[(n >> (j * 8 + 4)) & 0x0f] +
                hex_chr[(n >> (j * 8)) & 0x0f]
        }
        return s
    },
    hex = function(x:any) {
        var i
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i])
        }
        return x.join('')
    },
    md5 = function(s:any) {
        return hex(md51(s))
    }

// In some cases the fast add32 function cannot be used..
if (md5('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    add32 = function(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xffff)
    }
}

export default class SparkMD5 {
    public _buff: any
    public _length: any
    public _state: any
    public ArrayBuffer: any

    constructor() {
        this._buff = "";
        this._length = 0;
        this._state = [1732584193, -271733879, -1732584194, 271733878];
        this.ArrayBuffer = ArrayBuffer
    }

     /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    public append (str:any) {
        // converts the string to utf8 bytes if necessary
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        // then append as binary
        this.appendBinary(str);

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    public appendBinary (contents:any) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._state, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substr(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     * Use the raw parameter to obtain the raw result instead of the hex one.
     *
     * @param {Boolean} raw True to get the raw result, false to get the hex result
     *
     * @return {String|Array} The result
     */
    public end (raw:any) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = !!raw ? this._state : hex(this._state);

        this.reset();

        return ret;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    private _finish (tail:any, length:any) {
        let i = length,
            tmp:any,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._state, tail);
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    public reset () {
        this._buff = "";
        this._length = 0;
        this._state = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other aditional
     * resources. If you plan to use the instance again, use reset instead.
     */
    public destroy () {
        delete this._state;
        delete this._buff;
        delete this._length;
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw result, false to get the hex result
     *
     * @return {String|Array} The result
     */
    public hash (str:any, raw:any) {
        // converts the string to utf8 bytes if necessary
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        var hash = md51(str);

        return !!raw ? hash : hex(hash);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} raw     True to get the raw result, false to get the hex result
     *
     * @return {String|Array} The result
     */
    public hashBinary (content:any, raw:any) {
        var hash = md51(content);

        return !!raw ? hash : hex(hash);
    };
}

class ArrayBuffer {
    public _buff: any
    public _length: any
    public _state: any

    constructor() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._state = [1732584193, -271733879, -1732584194, 271733878];
    }

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    public append (arr:any) {
        // TODO: we could avoid the concatenation here but the algorithm would be more complex
        //       if you find yourself needing extra performance, please make a PR.
        var buff = this._concatArrayBuffer(this._buff, arr),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._state, md5blk_array(buff.subarray(i - 64, i)));
        }

        // Avoids IE10 weirdness (documented above)
        this._buff = (i - 64) < length ? buff.subarray(i - 64) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     * Use the raw parameter to obtain the raw result instead of the hex one.
     *
     * @param {Boolean} raw True to get the raw result, false to get the hex result
     *
     * @return {String|Array} The result
     */
    public end (raw:any) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = !!raw ? this._state : hex(this._state);

        this.reset();

        return ret;
    };

    public _finish (tail:any, length:any) {
        let i = length,
            tmp:any,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._state, tail);
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    public reset () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._state = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other aditional
     * resources. If you plan to use the instance again, use reset instead.
     */
    public destroy () {
        delete this._state;
        delete this._buff;
        delete this._length;
    };

    /**
     * Concats two array buffers, returning a new one.
     *
     * @param  {ArrayBuffer} first  The first array buffer
     * @param  {ArrayBuffer} second The second array buffer
     *
     * @return {ArrayBuffer} The new array buffer
     */
    public _concatArrayBuffer (first:any, second:any) {
        var firstLength = first.length,
            result = new Uint8Array(firstLength + second.byteLength);

        result.set(first);
        result.set(new Uint8Array(second), firstLength);

        return result;
    };

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw result, false to get the hex result
     *
     * @return {String|Array} The result
     */
    public hash (arr:any, raw:any) {
        var hash = md51_array(new Uint8Array(arr));

        return !!raw ? hash : hex(hash);
    };
}
