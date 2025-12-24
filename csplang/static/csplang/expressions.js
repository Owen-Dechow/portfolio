// @ts-check

/**
 * @import {TokenTypeEnum} from "./tokens.js"
 * @import {Context} from "./execute.js" 
 */

import { TokenType, TokenStream, Token } from "./tokens.js";
import { CSPError } from "./error.js";

const numberDigits = 10;

export class Value {
    /**
     * @param {string} v
     */
    static fromInput(v) {
        const num = parseFloat(v);
        if (!isNaN(num) && isFinite(num)) {
            return new NumberValue(num);
        }

        return new StringValue(v);
    }
}

export class NumberValue extends Value {
    /**
     * @param {number} v
     */
    constructor(v) {
        super();

        const pow = Math.pow(10, numberDigits);

        /** @type {number} */
        this.value = Math.round(v * pow) / pow;
    }
}

export class StringValue extends Value {
    /**
     * @param {string} v
     */
    constructor(v) {
        super();
        /** @type {string} */
        this.value = v;
    }
}

export class BooleanValue extends Value {
    /**
     * @param {boolean} v
     */
    constructor(v) {
        super();
        /** @type {boolean} */
        this.value = v;
    }
}

export class ListValue extends Value {
    /**
     * @param {Value[]} v
     */
    constructor(v) {
        super();
        /** @type {Value[]} */
        this.value = v;
    }
}

export class NullValue extends Value { }

export class Expression {
    /**
     * @param {Context} _context
     * @returns {Value}
     */
    evaluate(_context) {
        throw new Error("SHOULD NEVER HIT THIS POINT");
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        throw new Error("SHOULD NEVER HIT THIS POINT");
    }
}

export class IndexExpression extends Expression {
    /**
     * @param {Expression} idx
     * @param {Expression} list
     */
    constructor(idx, list) {
        super();

        /** @type {Expression} */
        this.idx = idx;

        /** @type {Expression} */
        this.list = list;
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        const lr = this.idx.getLocRange();
        const rr = this.list.getLocRange();
        return combineRange(lr, rr);
    }

    /**
     * @param {Context} context
     * @returns {Value}
     */
    evaluate(context) {
        const list = this.list.evaluate(context);
        const idx = this.idx.evaluate(context);

        if (!(list instanceof ListValue) && !(list instanceof StringValue))
            throw CSPError.fromExpression("Attempt to index non list/string object.", this.list);

        if (!(idx instanceof NumberValue))
            throw CSPError.fromExpression(`Indexes must be of type ${NumberValue.constructor.name}.`, this.idx);

        if (list.value.length == 0)
            throw CSPError.fromExpression("Attempt to index empty list/string object.", this.list);

        if (!Number.isInteger(idx.value))
            throw CSPError.fromExpression(`Indexes must be integers, ${idx.value} is a float.`, this.idx);

        if (idx.value < 1 || idx.value > list.value.length)
            throw CSPError.fromExpression(`${idx.value} is not in the range of the list/string: [1, ${list.value.length}].`, this.idx);

        const val = list.value[idx.value - 1];
        return val instanceof Value ? val : new StringValue(val);
    }
}

/**
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @returns {[number, number]}
 */
function combineRange(a, b) {
    return [Math.min(a[0], a[1], b[0], b[1]), Math.max(a[0], a[1], b[0], b[1])];
}

export class BinaryExpression extends Expression {
    /**
     * @param {Expression} left
     * @param {Token} token
     * @param {Expression} right
     */
    constructor(left, token, right) {
        super();

        /** @type {Expression}  */
        this.left = left;

        /** @type {Expression}  */
        this.right = right;

        /** @type {Token}  */
        this.token = token;
    }

    /**
     * @param {Context} context
     * @returns {Value}
     */
    evaluate(context) {
        const left = this.left.evaluate(context);
        const right = this.right.evaluate(context);

        let type = this.token.type;
        let binOps = {};


        if (left instanceof NumberValue && right instanceof NumberValue) {
            binOps[TokenType.ADD] = (/** @type {number} */ a, /** @type {number} */ b) => new NumberValue(a + b);
            binOps[TokenType.SUBTRACT] = (/** @type {number} */ a, /** @type {number} */ b) => new NumberValue(a - b);
            binOps[TokenType.DIVIDE] = (/** @type {number} */ a, /** @type {number} */ b) => new NumberValue(a / b);
            binOps[TokenType.MULTIPLY] = (/** @type {number} */ a, /** @type {number} */ b) => new NumberValue(a * b);
            binOps[TokenType.GREATER_THAN] = (/** @type {number} */ a, /** @type {number} */ b) => new BooleanValue(a > b);
            binOps[TokenType.LESS_THAN] = (/** @type {number} */ a, /** @type {number} */ b) => new BooleanValue(a < b);
            binOps[TokenType.EQUAL] = (/** @type {any} */ a, /** @type {any} */ b) => new BooleanValue(a === b);
            binOps[TokenType.NOT_EQUAL] = (/** @type {any} */ a, /** @type {any} */ b) => new BooleanValue(a !== b);
            binOps[TokenType.LESS_THAN_OR_EQUAL] = (/** @type {number} */ a, /** @type {number} */ b) => new BooleanValue(a <= b);
            binOps[TokenType.GREATER_THAN_OR_EQUAL] = (/** @type {number} */ a, /** @type {number} */ b) => new BooleanValue(a >= b);
            binOps[TokenType.MOD] = (/** @type {number} */ a, /** @type {number} */ b) => new NumberValue(a % b);
        } else if (left instanceof StringValue && right instanceof StringValue) {
            binOps[TokenType.EQUAL] = (/** @type {string} */ a, /** @type {string} */ b) => new BooleanValue(a === b);
            binOps[TokenType.NOT_EQUAL] = (/** @type {string} */ a, /** @type {string} */ b) => new BooleanValue(a !== b);
        } else if (left instanceof BooleanValue && right instanceof BooleanValue) {
            binOps[TokenType.AND] = (/** @type {boolean} */ a, /** @type {boolean} */ b) => new BooleanValue(a && b);
            binOps[TokenType.OR] = (/** @type {boolean} */ a, /** @type {boolean} */ b) => new BooleanValue(a || b);
            binOps[TokenType.EQUAL] = (/** @type {boolean} */ a, /** @type {boolean} */ b) => new BooleanValue(a === b);
            binOps[TokenType.NOT_EQUAL] = (/** @type {boolean} */ a, /** @type {boolean} */ b) => new BooleanValue(a !== b);
        } else if (left instanceof NullValue || right instanceof NullValue) {
            throw CSPError.nullValueError(this.getLocRange());
        } else if (left instanceof StringValue && right instanceof NumberValue) {
            binOps[TokenType.EQUAL] = (/** @type {any} */ a, /** @type {any} */ b) => new BooleanValue(a == b);
            binOps[TokenType.NOT_EQUAL] = (/** @type {any} */ a, /** @type {any} */ b) => new BooleanValue(a != b);
        } else if (left instanceof NumberValue && right instanceof StringValue) {
            binOps[TokenType.NOT_EQUAL] = (/** @type {any} */ a, /** @type {any} */ b) => new BooleanValue(a != b);
            binOps[TokenType.EQUAL] = (/** @type {any} */ a, /** @type {any} */ b) => new BooleanValue(a == b);
        }
        else if (left instanceof ListValue && right instanceof ListValue) { } else {
            throw CSPError.fromExpression(
                `Left and right hand sides of "${this.token.type}" are incompatible; left is of type ${left.constructor.name}, and right is of type ${right.constructor.name}.`, this
            );
        }

        const op = binOps[type];

        if (op != undefined) {
            const rightVal = right.value;

            return op(left.value, rightVal);
        }

        throw CSPError.fromExpression(`${type} is not a valid operator for ${left.constructor.name} and ${right.constructor.name}.`, this);
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        const lr = this.left.getLocRange();
        const rr = this.right.getLocRange();
        return combineRange(lr, rr);
    }
}

export class LiteralExpression extends Expression {
    /**
     * @param {Token} token
     */
    constructor(token) {
        super();

        /** @type {Token}  */
        this.token = token;
    }

    /**
     * @param {Context} _context
     */
    evaluate(_context) {
        let type = this.token.type;

        if (type == TokenType.NUMBER) {
            return new NumberValue(parseFloat(this.token.value));
        } else if (type == TokenType.BOOL) {
            return new BooleanValue(this.token.value == "true");
        } else {
            const string = this.token.value.slice(1, this.token.value.length - 1);
            return new StringValue(string);
        }
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        return [this.token.loc - this.token.value.length, this.token.loc];
    }
}

export class IdentityExpression extends Expression {
    /**
     * @param {Token} token
     */
    constructor(token) {
        super();
        this.token = token;
    }

    /**
     * @param {Context} context
     */
    evaluate(context) {
        let object = context.getValue(this.token);
        if (object instanceof Value)
            return object;

        let end = this.token.loc;
        let start = this.token.loc - this.token.value.length;
        throw new CSPError(start, end, `"${this.token.value}" is a procedure; you may not reference it outside of a call.`);
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        return [this.token.loc - this.token.value.length, this.token.loc];
    }
}

export class ContainerExpression extends Expression {
    /**
     * @param {Expression} innerExpression
     */
    constructor(innerExpression) {
        super();

        /** @type {Expression}  */
        this.innerExpression = innerExpression;
    }

    /**
     * @param {Context} context
     */
    evaluate(context) {
        return this.innerExpression.evaluate(context);
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        return this.innerExpression.getLocRange();
    }
}

export class ListExpression extends Expression {
    /**
     * @param {Expression[]} items
     * @param {Token} open
     * @param {Token} close
     */
    constructor(items, open, close) {
        super();

        /** @type {Expression[]}  */
        this.items = items;

        /** @type {Token}  */
        this.open = open;

        /** @type {Token}  */
        this.close = close;
    }

    /**
     * @param {Context} context
     */
    evaluate(context) {
        let list = [];
        this.items.forEach(e => { list.push(e.evaluate(context)); });
        return new ListValue(list);
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        return [this.open.loc - this.open.value.length, this.close.loc];
    }
}

export class FunctionCall extends Expression {
    /**
     * @param {Token} func
     * @param {Expression[]} args
     * @param {Token} close
     */
    constructor(func, args, close) {
        super();

        /** @type {Token}  */
        this.func = func;

        /** @type {Expression[]}  */
        this.args = args;

        /** @type {Token}  */
        this.close = close;
    }

    /**
     * @param {Context} context
     */
    evaluate(context) {
        let func = context.getValue(this.func);

        if (func instanceof Value) {
            throw CSPError.fromExpression(`Expected ${this.func.value} to be a procedure; found ${func.constructor.name}.`, this);
        }

        const start = this.func.loc;
        const end = this.func.loc - this.func.value.length;
        let returnVal = func(this.args, [start, end], context);
        return returnVal == null ? new NullValue() : returnVal;
    }

    /**
     * @returns {[number, number]}
     */
    getLocRange() {
        return [this.func.loc - this.func.value.length, this.close.loc];
    }
}

export class UnaryExpression extends Expression {
    /**
     * @param {Token} token
     * @param {Expression} innerExpression
     */
    constructor(token, innerExpression) {
        super();

        /** @type {Expression} */
        this.innerExpression = innerExpression;

        /** @type {Token} */
        this.token = token;
    }

    /**
     * @param {Context} context
     */
    evaluate(context) {
        const right = this.innerExpression.evaluate(context);

        let type = this.token.type;

        let unaryOps = {};

        if (right instanceof NumberValue) {
            unaryOps[TokenType.SUBTRACT] = (/** @type {number} */ a) => new NumberValue(-a);
        } else if (right instanceof BooleanValue) {
            unaryOps[TokenType.NOT] = (/** @type {boolean} */ a) => new BooleanValue(!a);
        } else if (right instanceof NullValue) {
            throw CSPError.nullValueError(this.getLocRange());
        } else if (right instanceof StringValue || right instanceof ListValue) { } else {
            throw Error("SHOULD NEVER HIT THIS POINT");
        }

        const op = unaryOps[type];

        if (op != undefined) {
            return op(right.value);
        }

        throw CSPError.fromExpression(`${type} is not a valid operator for ${right.constructor.name}.`, this);
    }

    getLocRange() {
        return combineRange([this.token.loc, this.token.loc], this.innerExpression.getLocRange());
    }
}

/**
 * @param {TokenStream} ts
 * @param {boolean} argList
 * @returns {[Expression[], Token]}
 */
function parseExpressionList(ts, argList) {
    const closer = argList ? TokenType.CLOSE_PAREN : TokenType.CLOSE_BRACKET;

    let items = [];

    while (true) {
        let t = ts.nextSig();

        if (t.type == closer)
            break;
        else
            ts.back();

        items.push(parseExpression(ts));

        let commaOrClose = ts.nextSig();

        if (commaOrClose.type == TokenType.COMMA)
            continue;

        if (commaOrClose.type == closer)
            break;

        throw CSPError.invalidToken(closer, commaOrClose);
    }

    ts.back();
    return [items, ts.next()];
}

/** 
 * @param {TokenStream} ts 
 * @returns {Expression}
 */
export function parseExpression(ts) {
    /** @type {null|Expression} */
    let exp = null;

    while (true) {
        let t = ts.nextSig();
        if (exp == null) {
            if (t.type == TokenType.NUMBER) {
                exp = new LiteralExpression(t);
            } else if (t.type == TokenType.STRING) {
                exp = new LiteralExpression(t);
            } else if (t.type == TokenType.BOOL) {
                exp = new LiteralExpression(t);
            } else if (t.type == TokenType.ID) {
                exp = new IdentityExpression(t);
            } else if (t.type == TokenType.OPEN_PAREN) {
                const innerExp = parseExpression(ts);
                exp = new ContainerExpression(innerExp);
                ts.takeSigOfType(TokenType.CLOSE_PAREN);
            } else if (t.type == TokenType.OPEN_BRACKET) {
                const lst = parseExpressionList(ts, false);
                exp = new ListExpression(lst[0], t, lst[1]);
            } else if (t.type == TokenType.SUBTRACT) {
                const innerExp = parseExpression(ts);
                return new UnaryExpression(t, innerExp);
            } else if (t.type == TokenType.NOT) {
                const innerExp = parseExpression(ts);
                return new UnaryExpression(t, innerExp);
            } else {
                break;
            }
        } else {
            /** @type {TokenTypeEnum[]} */
            const binaryOperations = [
                TokenType.ADD, TokenType.SUBTRACT,
                TokenType.DIVIDE, TokenType.MULTIPLY, TokenType.AND, TokenType.OR,
                TokenType.GREATER_THAN, TokenType.LESS_THAN, TokenType.EQUAL,
                TokenType.NOT_EQUAL, TokenType.LESS_THAN_OR_EQUAL, TokenType.GREATER_THAN_OR_EQUAL,
                TokenType.MOD
            ];

            if (binaryOperations.includes(t.type)) {
                exp = new BinaryExpression(exp, t, parseExpression(ts));
            } else if (t.type == TokenType.OPEN_PAREN && exp instanceof IdentityExpression) {
                const args = parseExpressionList(ts, true);
                exp = new FunctionCall(exp.token, args[0], args[1]);
                exp = sortExpression(exp);
            } else if (
                t.type == TokenType.OPEN_BRACKET
                && (
                    exp instanceof ListExpression
                    || exp instanceof IdentityExpression
                    || (exp instanceof LiteralExpression && exp.token.type == TokenType.STRING)
                )
            ) {
                const index = parseExpression(ts);
                exp = new IndexExpression(index, exp);
                ts.takeSigOfType(TokenType.CLOSE_BRACKET);
            }
            else {
                ts.back();
                break;
            }
        }
    }

    if (exp == null) {
        ts.back();
        throw CSPError.expectedExpression(ts.next());
    }

    return exp;
}

/**
 * @param {Token} token
 */
function getPrecedence(token) {
    const precedence = {
        [TokenType.OR]: 1,
        [TokenType.AND]: 2,
        [TokenType.EQUAL]: 3,
        [TokenType.NOT_EQUAL]: 3,
        [TokenType.LESS_THAN]: 4,
        [TokenType.LESS_THAN_OR_EQUAL]: 4,
        [TokenType.GREATER_THAN]: 4,
        [TokenType.GREATER_THAN_OR_EQUAL]: 4,
        [TokenType.ADD]: 5,
        [TokenType.SUBTRACT]: 5,
        [TokenType.MULTIPLY]: 6,
        [TokenType.DIVIDE]: 6,
        [TokenType.MOD]: 6
    };
    return precedence[token.type] ?? 0;
}

/**
 * @param {Expression} exp
 * @returns {Expression}
 */
function sortExpression(exp) {
    if (exp instanceof ContainerExpression) {
        return new ContainerExpression(sortExpression(exp.innerExpression));
    }

    if (exp instanceof ListExpression) {
        return new ListExpression(exp.items.map(sortExpression), exp.open, exp.close);
    }

    if (exp instanceof FunctionCall) {
        return new FunctionCall(exp.func, exp.args.map(sortExpression), exp.close);
    }

    if (exp instanceof LiteralExpression) {
        return new LiteralExpression(exp.token);
    }

    if (exp instanceof IdentityExpression) {
        return new IdentityExpression(exp.token);
    }

    if (exp instanceof IndexExpression) {
        return new IndexExpression(sortExpression(exp.idx), sortExpression(exp.list));
    }

    if (exp instanceof UnaryExpression) {
        if (exp.innerExpression instanceof BinaryExpression) {
            const binLeft = exp.innerExpression.left;
            const newLeft = new UnaryExpression(exp.token, binLeft);

            return new BinaryExpression(newLeft, exp.innerExpression.token, sortExpression(exp.innerExpression.right));
        }

        return new UnaryExpression(exp.token, exp.innerExpression);
    }


    if (exp instanceof BinaryExpression) {
        const sortedLeft = sortExpression(exp.left);
        const sortedRight = sortExpression(exp.right);
        const currPrec = getPrecedence(exp.token);

        // Rotate left if needed
        if (sortedLeft instanceof BinaryExpression) {
            const leftPrec = getPrecedence(sortedLeft.token);
            if (leftPrec < currPrec) {
                const A = sortedLeft.left;
                const B = sortedLeft.right;
                const op1 = sortedLeft.token;
                const op2 = exp.token;
                const C = sortedRight;

                // Rotate: (A op1 B) op2 C → A op1 (B op2 C)
                const newRight = new BinaryExpression(B, op2, C);
                return new BinaryExpression(A, op1, sortExpression(newRight));
            }
        }

        // Rotate right if needed
        if (sortedRight instanceof BinaryExpression) {
            const rightPrec = getPrecedence(sortedRight.token);
            if (rightPrec <= currPrec) {
                const A = sortedLeft;
                const B = sortedRight.left;
                const C = sortedRight.right;
                const op1 = exp.token;
                const op2 = sortedRight.token;

                // Rotate: A op1 (B op2 C) → (A op1 B) op2 C
                const newLeft = new BinaryExpression(A, op1, B);
                return new BinaryExpression(sortExpression(newLeft), op2, C);
            }
        }

        return new BinaryExpression(sortedLeft, exp.token, sortedRight);
    }

    throw new Error("SHOULD NEVER HIT THIS POINT" + exp.constructor.name);
}
