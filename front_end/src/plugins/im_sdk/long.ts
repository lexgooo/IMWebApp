export default class Long {
    public low: any
    public high: any
    public unsigned: any

    public isLong:any
    public fromInt:any
    public fromNumber:any
    public fromBits:any
    public fromString:any
    public fromValue:any

    public INT_CACHE: any = {}
    public UINT_CACHE: any = {}

    private __isLong__: any
    
    public pow_dbl = Math.pow

    constructor(
        low:any,
        high:any,
        unsigned: any
    ) {
        this.low = low | 0
        this.high = high | 0
        this.unsigned = !!unsigned
        this.isLong = (other:any = undefined) => {
            if (other) return;
            return (this && this.__isLong__) === true
        }
        this.fromInt = (value: number, unsigned:any = undefined) => {
            let obj, cachedObj, cache
            if (unsigned) {
                value >>>= 0
                if ((cache = 0 <= value && value < 256)) {
                    cachedObj = this.UINT_CACHE[value]
                    if (cachedObj) return cachedObj
                }
                obj = this.fromBits(value, (value | 0) < 0 ? -1 : 0, true)
                if (cache) this.UINT_CACHE[value] = obj
                return obj
            } else {
                value |= 0
                if ((cache = -128 <= value && value < 128)) {
                    cachedObj = this.INT_CACHE[value]
                    if (cachedObj) return cachedObj
                }
                obj = this.fromBits(value, value < 0 ? -1 : 0, false)
                if (cache) this.INT_CACHE[value] = obj
                return obj
            }
        };

        this.fromNumber = (value: number, unsigned:any = undefined) => {
            if (isNaN(value) || !isFinite(value))
                return unsigned ? this.UZERO : this.ZERO
            if (unsigned) {
                if (value < 0) return this.UZERO
                if (value >= this.TWO_PWR_64_DBL) return this.MAX_UNSIGNED_VALUE
            } else {
                if (value <= -this.TWO_PWR_63_DBL) return this.MIN_VALUE
                if (value + 1 >= this.TWO_PWR_63_DBL) return this.MAX_VALUE
            }
            if (value < 0) return this.fromNumber(-value, unsigned).neg()
            return this.fromBits(
                value % this.TWO_PWR_32_DBL | 0,
                (value / this.TWO_PWR_32_DBL) | 0,
                unsigned
            )
        };

        this.fromBits = (lowBits:any, highBits:any, unsigned:any) => {
            return new Long(lowBits, highBits, unsigned)
        }

        this.fromString = (str:any, unsigned:any = undefined, radix:any = undefined) => {
            if (str.length === 0) throw Error('empty string')
            if (
                str === 'NaN' ||
                str === 'Infinity' ||
                str === '+Infinity' ||
                str === '-Infinity'
            )
                return this.ZERO
            if (typeof unsigned === 'number') {
                // For goog.math.long compatibility
                // ;(radix = unsigned), (unsigned = false)
                radix = unsigned;
                unsigned = false
            } else {
                unsigned = !!unsigned
            }
            radix = radix || 10
            if (radix < 2 || 36 < radix) throw RangeError('radix')
    
            var p
            if ((p = str.indexOf('-')) > 0) throw Error('interior hyphen')
            else if (p === 0) {
                return this.fromString(str.substring(1), unsigned, radix).neg()
            }
            var radixToPower = this.fromNumber(this.pow_dbl(radix, 8))
    
            var result = this.ZERO
            for (var i = 0; i < str.length; i += 8) {
                var size = Math.min(8, str.length - i),
                    value = parseInt(str.substring(i, i + size), radix)
                if (size < 8) {
                    var power = this.fromNumber(this.pow_dbl(radix, size))
                    result = result.mul(power).add(this.fromNumber(value))
                } else {
                    result = result.mul(radixToPower)
                    result = result.add(this.fromNumber(value))
                }
            }
            result.unsigned = unsigned
            return result
        }

        this.fromValue = (val:any) => {
            if (val /* is compatible */ instanceof Long) return val
            if (typeof val === 'number') return this.fromNumber(val)
            if (typeof val === 'string') return this.fromString(val)
            // Throws for non-objects, converts non-instanceof Long:
            return this.fromBits(val.low, val.high, val.unsigned)
        }
    }

    public TWO_PWR_16_DBL = 1 << 16
    public TWO_PWR_24_DBL = 1 << 24
    public TWO_PWR_32_DBL = this.TWO_PWR_16_DBL * this.TWO_PWR_16_DBL
    public TWO_PWR_64_DBL = this.TWO_PWR_32_DBL * this.TWO_PWR_32_DBL
    public TWO_PWR_63_DBL = this.TWO_PWR_64_DBL / 2
    public TWO_PWR_24 = this.fromInt(this.TWO_PWR_24_DBL)
    public ZERO = this.fromInt(0)
    public UZERO = this.fromInt(0, true)
    public ONE = this.fromInt(1)
    public UONE = this.fromInt(1, true)
    public NEG_ONE = this.fromInt(-1)
    public MAX_VALUE = this.fromBits(0xffffffff | 0, 0x7fffffff | 0, false)
    public MAX_UNSIGNED_VALUE = this.fromBits(
        0xffffffff | 0,
        0xffffffff | 0,
        true
    )
    public MIN_VALUE = this.fromBits(0, 0x80000000 | 0, false)
    public toInt() {
        return this.unsigned ? this.low >>> 0 : this.low
    }

    public toNumber() {
        if (this.unsigned)
            return (this.high >>> 0) * this.TWO_PWR_32_DBL + (this.low >>> 0)
        return this.high * this.TWO_PWR_32_DBL + (this.low >>> 0)
    }

    public toString(radix = 10) {
        if (radix < 2 || 36 < radix) throw RangeError('radix')
        if (this.isZero()) return '0'
        if (this.isNegative()) {
            // Unsigned Longs are never negative
            if (this.eq(this.MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = this.fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this)
                return div.toString(radix) + rem1.toInt().toString(radix)
            } else return '-' + this.neg().toString(radix)
        }
        var radixToPower = this.fromNumber(
                this.pow_dbl(radix, 6),
                this.unsigned
            ),
            rem = this
        var result = ''
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix)
            rem = remDiv
            if (rem.isZero()) return digits + result
            else {
                while (digits.length < 6) digits = '0' + digits
                result = '' + digits + result
            }
        }
    }

    public getHighBits() {
        return this.high
    }

    public getHighBitsUnsigned() {
        return this.high >>> 0
    }

    public getLowBits() {
        return this.low
    }

    public getLowBitsUnsigned() {
        return this.low >>> 0
    }

    public getNumBitsAbs() {
        if (this.isNegative())
            // Unsigned Longs are never negative
            return this.eq(this.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs()
        var val = this.high !== 0 ? this.high : this.low
        for (var bit = 31; bit > 0; bit--) if ((val & (1 << bit)) !== 0) break
        return this.high !== 0 ? bit + 33 : bit + 1
    }

    public isZero() {
        return this.high === 0 && this.low === 0
    }

    public isNegative() {
        return !this.unsigned && this.high < 0
    }

    public isPositive() {
        return this.unsigned || this.high >= 0
    }

    public isOdd() {
        return (this.low & 1) === 1
    }

    public isEven() {
        return (this.low & 1) === 0
    }

    public equals(other:any) {
        if (!this.isLong(other)) other = this.fromValue(other)
        if (
            this.unsigned !== other.unsigned &&
            this.high >>> 31 === 1 &&
            other.high >>> 31 === 1
        )
            return false
        return this.high === other.high && this.low === other.low
    }
    public eq = this.equals

    public notEquals(other:any) {
        return !this.eq(/* validates */ other)
    }
    public neq = this.notEquals

    public lessThan(other:any) {
        return this.comp(/* validates */ other) < 0
    }
    public lt = this.lessThan

    lessThanOrEqual(other:any) {
        return this.comp(/* validates */ other) <= 0
    }
    public lte = this.lessThanOrEqual

    public greaterThan(other:any) {
        return this.comp(/* validates */ other) > 0
    }
    public gt = this.greaterThan

    public greaterThanOrEqual(other:any) {
        return this.comp(/* validates */ other) >= 0
    }
    public gte = this.greaterThanOrEqual

    public compare(other:any) {
        if (!this.isLong(other)) other = this.fromValue(other)
        if (this.eq(other)) return 0
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative()
        if (thisNeg && !otherNeg) return -1
        if (!thisNeg && otherNeg) return 1
        // At this point the sign bits are the same
        if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1
        // Both are positive if at least one is unsigned
        return other.high >>> 0 > this.high >>> 0 ||
            (other.high === this.high && other.low >>> 0 > this.low >>> 0)
            ? -1
            : 1
    }
    public comp = this.compare

    public negate() {
        if (!this.unsigned && this.eq(this.MIN_VALUE)) return this.MIN_VALUE
        return this.not().add(this.ONE)
    }
    public neg = this.negate

    public add(addend:any) {
        if (!this.isLong(addend)) addend = this.fromValue(addend)

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16
        var a32 = this.high & 0xffff
        var a16 = this.low >>> 16
        var a00 = this.low & 0xffff

        var b48 = addend.high >>> 16
        var b32 = addend.high & 0xffff
        var b16 = addend.low >>> 16
        var b00 = addend.low & 0xffff

        var c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0
        c00 += a00 + b00
        c16 += c00 >>> 16
        c00 &= 0xffff
        c16 += a16 + b16
        c32 += c16 >>> 16
        c16 &= 0xffff
        c32 += a32 + b32
        c48 += c32 >>> 16
        c32 &= 0xffff
        c48 += a48 + b48
        c48 &= 0xffff
        return this.fromBits(
            (c16 << 16) | c00,
            (c48 << 16) | c32,
            this.unsigned
        )
    }

    public subtract(subtrahend:any) {
        if (!this.isLong(subtrahend)) subtrahend = this.fromValue(subtrahend)
        return this.add(subtrahend.neg())
    }
    public sub = this.subtract

    public multiply(multiplier:any):any {
        if (this.isZero()) return this.ZERO
        if (!this.isLong(multiplier)) multiplier = this.fromValue(multiplier)
        if (multiplier.isZero()) return this.ZERO
        if (this.eq(this.MIN_VALUE))
            return multiplier.isOdd() ? this.MIN_VALUE : this.ZERO
        if (multiplier.eq(this.MIN_VALUE))
            return this.isOdd() ? this.MIN_VALUE : this.ZERO

        if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg())
            else
                return this.neg()
                    .mul(multiplier)
                    .neg()
        } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg()

        // If both longs are small, use float multiplication
        if (this.lt(this.TWO_PWR_24) && multiplier.lt(this.TWO_PWR_24))
            return this.fromNumber(
                this.toNumber() * multiplier.toNumber(),
                this.unsigned
            )

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16
        var a32 = this.high & 0xffff
        var a16 = this.low >>> 16
        var a00 = this.low & 0xffff

        var b48 = multiplier.high >>> 16
        var b32 = multiplier.high & 0xffff
        var b16 = multiplier.low >>> 16
        var b00 = multiplier.low & 0xffff

        var c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0
        c00 += a00 * b00
        c16 += c00 >>> 16
        c00 &= 0xffff
        c16 += a16 * b00
        c32 += c16 >>> 16
        c16 &= 0xffff
        c16 += a00 * b16
        c32 += c16 >>> 16
        c16 &= 0xffff
        c32 += a32 * b00
        c48 += c32 >>> 16
        c32 &= 0xffff
        c32 += a16 * b16
        c48 += c32 >>> 16
        c32 &= 0xffff
        c32 += a00 * b32
        c48 += c32 >>> 16
        c32 &= 0xffff
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48
        c48 &= 0xffff
        return this.fromBits(
            (c16 << 16) | c00,
            (c48 << 16) | c32,
            this.unsigned
        )
    }
    public mul = this.multiply

    public divide(divisor:any):any {
        if (!this.isLong(divisor)) divisor = this.fromValue(divisor)
        if (divisor.isZero()) throw Error('division by zero')
        if (this.isZero()) return this.unsigned ? this.UZERO : this.ZERO
        var approx, rem, res
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(this.MIN_VALUE)) {
                if (divisor.eq(this.ONE) || divisor.eq(this.NEG_ONE))
                    return this.MIN_VALUE
                // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(this.MIN_VALUE)) return this.ONE
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1)
                    approx = halfThis.div(divisor).shl(1)
                    if (approx.eq(this.ZERO)) {
                        return divisor.isNegative() ? this.ONE : this.NEG_ONE
                    } else {
                        rem = this.sub(divisor.mul(approx))
                        res = approx.add(rem.div(divisor))
                        return res
                    }
                }
            } else if (divisor.eq(this.MIN_VALUE))
                return this.unsigned ? this.UZERO : this.ZERO
            if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg())
                return this.neg()
                    .div(divisor)
                    .neg()
            } else if (divisor.isNegative())
                return this.div(divisor.neg()).neg()
            res = this.ZERO
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned) divisor = divisor.toUnsigned()
            if (divisor.gt(this)) return this.UZERO
            if (divisor.gt(this.shru(1)))
                // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return this.UONE
            res = this.UZERO
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(
                1,
                Math.floor(rem.toNumber() / divisor.toNumber())
            )

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = log2 <= 48 ? 1 : this.pow_dbl(2, log2 - 48),
                // Decrease the approximation until it is smaller than the remainder.  Note
                // that if it is too large, the product overflows and is negative.
                approxRes = this.fromNumber(approx),
                approxRem = approxRes.mul(divisor)
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta
                approxRes = this.fromNumber(approx, this.unsigned)
                approxRem = approxRes.mul(divisor)
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) approxRes = this.ONE

            res = res.add(approxRes)
            rem = rem.sub(approxRem)
        }
        return res
    }
    public div = this.divide

    public modulo(divisor:any) {
        if (!this.isLong(divisor)) divisor = this.fromValue(divisor)
        return this.sub(this.div(divisor).mul(divisor))
    }
    public mod = this.modulo

    public not() {
        return this.fromBits(~this.low, ~this.high, this.unsigned)
    }

    public and(other:any) {
        if (!this.isLong(other)) other = this.fromValue(other)
        return this.fromBits(
            this.low & other.low,
            this.high & other.high,
            this.unsigned
        )
    }

    public or(other:any) {
        if (!this.isLong(other)) other = this.fromValue(other)
        return this.fromBits(
            this.low | other.low,
            this.high | other.high,
            this.unsigned
        )
    }

    public xor(other:any) {
        if (!this.isLong(other)) other = this.fromValue(other)
        return this.fromBits(
            this.low ^ other.low,
            this.high ^ other.high,
            this.unsigned
        )
    }

    public shiftLeft(numBits:any) {
        if (this.isLong(numBits)) numBits = numBits.toInt()
        if ((numBits &= 63) === 0) return this
        else if (numBits < 32)
            return this.fromBits(
                this.low << numBits,
                (this.high << numBits) | (this.low >>> (32 - numBits)),
                this.unsigned
            )
        else return this.fromBits(0, this.low << (numBits - 32), this.unsigned)
    }
    public shl = this.shiftLeft

    public shiftRight(numBits:any) {
        if (this.isLong(numBits)) numBits = numBits.toInt()
        if ((numBits &= 63) === 0) return this
        else if (numBits < 32)
            return this.fromBits(
                (this.low >>> numBits) | (this.high << (32 - numBits)),
                this.high >> numBits,
                this.unsigned
            )
        else
            return this.fromBits(
                this.high >> (numBits - 32),
                this.high >= 0 ? 0 : -1,
                this.unsigned
            )
    }
    public shr = this.shiftRight

    public shiftRightUnsigned(numBits:any) {
        if (this.isLong(numBits)) numBits = numBits.toInt()
        numBits &= 63
        if (numBits === 0) return this
        else {
            var high = this.high
            if (numBits < 32) {
                var low = this.low
                return this.fromBits(
                    (low >>> numBits) | (high << (32 - numBits)),
                    high >>> numBits,
                    this.unsigned
                )
            } else if (numBits === 32)
                return this.fromBits(high, 0, this.unsigned)
            else return this.fromBits(high >>> (numBits - 32), 0, this.unsigned)
        }
    }
    public shru = this.shiftRightUnsigned

    public toSigned() {
        if (!this.unsigned) return this
        return this.fromBits(this.low, this.high, false)
    }

    public toUnsigned() {
        if (this.unsigned) return this
        return this.fromBits(this.low, this.high, true)
    }

    public toBytes(le:any) {
        return le ? this.toBytesLE() : this.toBytesBE()
    }

    public toBytesLE() {
        var hi = this.high,
            lo = this.low
        return [
            lo & 0xff,
            (lo >>> 8) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 24) & 0xff,
            hi & 0xff,
            (hi >>> 8) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 24) & 0xff
        ]
    }

    public toBytesBE() {
        var hi = this.high,
            lo = this.low
        return [
            (hi >>> 24) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 8) & 0xff,
            hi & 0xff,
            (lo >>> 24) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 8) & 0xff,
            lo & 0xff
        ]
    }
}
