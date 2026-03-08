// @ts-check

import { BooleanValue, Expression, ListValue, NullValue, NumberValue, Value } from "./expressions.js";
import { Action, Assign, AssignList, Conditional, ExpressionAction, For, MakeProc, RepeatN, RepeatUntil, Return } from "./action.js";
import { CSPError } from "./error.js";
import { Token } from "./tokens.js";
import { parseProgram } from "./parser.js";
import { addDefaultBuiltins } from "./builtin.js";

/**
 * @param {string} text 
 */
export function execute(text) {
    const ast = parseProgram(text);
    const gc = new Context();

    addDefaultBuiltins(gc);

    executeBlock(ast, gc, gc);
}

export class Context {
    constructor() {
        /**
         * @type {Object.<string, Value | (function(Expression[], [number, number], Context): Value|null)> }
         */
        this.context = {};
        /**
         * @type {Context | null}
         */
        this.parentContext = null;
    }

    makeChild() {
        const ctx = new Context();
        ctx.parentContext = this;

        return ctx;
    }

    /**
     * @param {string} key
     * @param {any} val
     */
    insert(key, val) {
        if (!this.updateInsert(key, val)) {
            this.context[key] = val;
        }
    }

    /**
     * @param {string} key
     * @param {any} val
     * @returns boolean
     */
    updateInsert(key, val) {
        if (this.context[key]) {
            this.context[key] = val;
            return true;
        } else if (this.parentContext) {
            return this.parentContext.updateInsert(key, val);
        } else {
            return false;
        }
    }

    /**
     * @param {Token} token 
     * @returns {Value | (function(Expression[], [number, number], Context): Value|null)}
     */
    getValue(token) {
        const obj = this.context[token.value];

        if (obj != undefined)
            return obj;

        if (this.parentContext)
            return this.parentContext.getValue(token);

        let end = token.loc;
        let start = token.loc - token.value.length;
        throw new CSPError(start, end, `"${token.value}" is not a identity in the current scope.`);
    }
}

/**
 * @param {Action[]} block
 * @param {Context} context
 * @param {Context} gc 
 * @returns {Value|null}
 */
function executeBlock(block, context, gc) {
    for (const i in block) {
        const e = block[i];
        if (e instanceof MakeProc) {
            const fn = (/** @type {Expression[]} */ args, /** @type {[number, number]} */ callRange, /** @type {Context} */ ctx) => {
                const fnCtx = gc.makeChild();

                if (args.length != e.args.length) {
                    throw new CSPError(
                        callRange[0],
                        callRange[1],
                        `Incorrect number of arguments passed to function "${e.name.value}"; expected ${e.args.length} found ${args.length}.`
                    );
                }

                for (let i = 0; i < args.length; i++) {
                    fnCtx.insert(e.args[i].value, args[i].evaluate(ctx));
                }

                return executeBlock(e.block, fnCtx, gc);
            };
            context.insert(e.name.value, fn);
        } else if (e instanceof Assign) {
            context.insert(e.variable.value, e.expression.evaluate(context));
        } else if (e instanceof AssignList) {
            const lst = e.indexVar.list.evaluate(context);
            if (!(lst instanceof ListValue))
                throw CSPError.fromExpression(`Expected ${ListValue.name} found ${lst.constructor.name}.`, e.indexVar.list);

            const idx = e.indexVar.idx.evaluate(context);
            if (!(idx instanceof NumberValue))
                throw CSPError.fromExpression(`Expected ${NumberValue.name} found ${idx.constructor.name}.`, e.indexVar.idx);

            if (!Number.isInteger(idx.value))
                throw CSPError.fromExpression(`Indexes must be integers, ${idx.value} is a float.`, e.indexVar.idx);

            if (idx.value < 1 || idx.value > lst.value.length + 1)
                throw CSPError.fromExpression(`${idx.value} is not in the range of the list assignment: [1, ${lst.value.length + 1}].`, e.indexVar.idx);

            lst.value[idx.value - 1] = e.expression.evaluate(context);


        } else if (e instanceof Conditional) {
            const condition = e.conditional.evaluate(context);

            if (!(condition instanceof BooleanValue)) {
                throw CSPError.fromExpression(`Expected ${BooleanValue.name} found ${e.conditional.constructor.name}.`, e.conditional);
            }

            const blockReturn = executeBlock(condition.value ? e.block : e.elseBlock, context.makeChild(), gc);
            if (blockReturn) {
                return blockReturn;
            }
        } else if (e instanceof For) {
            const lst = e.list.evaluate(context);

            if (!(lst instanceof ListValue)) {
                throw CSPError.fromExpression(`Expected ${ListValue.name} found ${lst.constructor.name}.`, e.list);
            }

            for (const i in lst.value) {
                const val = lst.value[i];

                const ctx = context.makeChild();
                ctx.insert(e.item.value, val);
                const blockReturn = executeBlock(e.block, ctx, gc);

                if (blockReturn) {
                    return blockReturn;
                }
            }
        } else if (e instanceof Return) {
            return e.value ? e.value.evaluate(context) : new NullValue();
        } else if (e instanceof ExpressionAction) {
            e.expression.evaluate(context);
        } else if (e instanceof RepeatUntil) {
            let condition = e.conditional.evaluate(context);

            if (!(condition instanceof BooleanValue)) {
                throw CSPError.fromExpression(`Expected ${BooleanValue.name} found ${condition.constructor.name}.`, e.conditional);
            }

            while (!condition.value) {
                const blockReturn = executeBlock(e.block, context.makeChild(), gc);
                if (blockReturn) {
                    return blockReturn;
                }

                condition = e.conditional.evaluate(context);
                if (!(condition instanceof BooleanValue)) {
                    throw CSPError.fromExpression(`Expected ${BooleanValue.name} found ${condition.constructor.name}.`, e.conditional);
                }
            }

        } else if (e instanceof RepeatN) {
            let n = e.n.evaluate(context);
            if (!(n instanceof NumberValue)) {
                throw CSPError.fromExpression(`Expected ${NumberValue.name} found ${n.constructor.name}.`, e.n);
            }

            for (let i = 0; i < n.value; i++) {
                const blockReturn = executeBlock(e.block, context.makeChild(), gc);
                if (blockReturn) {
                    return blockReturn;
                }
            }

        } else {
            throw Error("SHOULD NEVER HIT THIS POINT");
        }
    }

    return null;
}
