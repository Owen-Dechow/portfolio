// @ts-check

import { BooleanValue, Expression, ListValue, NullValue, NumberValue, StringValue, Value } from "./expressions.js";
import { CSPError } from "./error.js";
import { Context } from "./execute.js";
import { ObjectFinder } from "./objects.js";

/**
 * @param {[number, number]} range
 * @param {any[]} lst
 * @param {number} idx
 * @param {boolean} allowNextEmpty
 */
function throwBadIdx(range, lst, idx, allowNextEmpty) {
    const throwErr = () => {
        throw CSPError.fromRange(range, `${idx} is not a valid index for list of length ${lst.length}.`);
    };

    if (idx < 1)
        throwErr();


    if (allowNextEmpty) {
        if (idx > lst.length + 1)
            throwErr();
    } else {
        if (idx > lst.length)
            throwErr();
    }
}


/**
 * @param {Array<(new (...args: any[]) => any) | (new (...args: any[]) => any)[]>} argTypes
 * @param {Context} ctx
 * @param {string} name
 * @param {function(Value[], [number, number]): Value} callback
 */
function makeBuiltinFunction(name, ctx, argTypes, callback) {
    let func = (/** @type {Expression[]} */ args, /** @type {[number, number]} */ callRange, /** @type {Context} */ ctx) => {
        if (argTypes.length != args.length) {
            throw CSPError.fromRange(
                callRange,
                `Incorrect number of arguments passed to function "${name}"; expected ${argTypes.length} found ${args.length}.`
            );
        }

        let vArgs = [];
        for (let i = 0; i < args.length; i++) {
            vArgs.push(args[i].evaluate(ctx));

            let t = argTypes[i];
            if (Array.isArray(t)) {
                let valid = false;
                t.forEach(t => {
                    if (vArgs[i] instanceof t)
                        valid = true;
                });

                if (!valid)
                    throw CSPError.fromRange(
                        callRange,
                        `Argument ${i + 1} of "${name}" is the wrong type; expected any of `
                        + `[${t.map(e => e.name).join(", ")}] found ${vArgs[i].constructor.name}.`
                    );
            } else {
                if (!(vArgs[i] instanceof t))
                    throw CSPError.fromRange(
                        callRange,
                        `Argument ${i + 1} of "${name}" is the wrong type; expected ${t.name} found ${vArgs[i].constructor.name}.`
                    );
            }
        }

        return callback(vArgs, callRange);
    };

    ctx.context[name] = func;
}

/**
 * @param {Context} ctx
 */
export function addDefaultBuiltins(ctx) {
    makeBuiltinFunction("LENGTH", ctx, [[NumberValue, StringValue, NumberValue]], (args, cr) => {
        let lst = args[0];

        if (lst instanceof ListValue)
            return new NumberValue(lst.value.length);
        else if (lst instanceof StringValue)
            return new NumberValue(lst.value.length);
        else if (lst instanceof NumberValue)
            return new NumberValue(lst.value.toString().length);

        throw CSPError.fromRange(cr, `The function "LENGTH" expected ${ListValue.name} or ${StringValue.name}; found ${lst.constructor.name}.`);
    });

    makeBuiltinFunction("DISPLAY", ctx, [[StringValue, NumberValue, BooleanValue]], (args, cr) => {
        let arg = args[0];

        if (arg instanceof StringValue || arg instanceof NumberValue || arg instanceof BooleanValue) {
            ObjectFinder.output().textContent += " " + arg.value;

            return new NullValue();
        } else if (arg instanceof ListValue) {
            throw CSPError.fromRange(cr, `The function "DISPLAY" can not directly take a list.`);
        } else if (arg instanceof NullValue) {
            throw CSPError.nullValueError(cr);
        }

        throw new Error("SHOULD NEVER HIT THIS POINT");
    });

    makeBuiltinFunction("RANDOM", ctx, [NumberValue, NumberValue], (args, cr) => {
        const [a, b] = args;

        if (!(a instanceof NumberValue && b instanceof NumberValue)) {
            throw CSPError.fromRange(cr, `The function "RANDOM" expected two ${NumberValue.name}; found ${a.constructor.name} and ${b.constructor.name}.`);
        }

        if (a.value != Math.round(a.value) || b.value != Math.round(b.value)) {
            throw CSPError.fromRange(cr, `The function "RANDOM" expected two integers; found ${a.value} and ${b.value}.`);
        }

        if (a.value > b.value) {
            throw CSPError.fromRange(
                cr,
                `The first number of the function "RANDOM" must be less than or equal to the second; found first ${a.value} and second ${b.value}.`
            );
        }

        const min = Math.min(a.value, b.value);
        const max = Math.max(a.value, b.value);
        return new NumberValue(Math.round((max - min) * Math.random() + min));
    });

    makeBuiltinFunction("INSERT", ctx, [ListValue, NumberValue, Value], (args, cr) => {
        const [lst, idx, val] = args;

        if (!(lst instanceof ListValue)) {
            throw CSPError.fromRange(cr, `The function "INSERT" expected ${ListValue.name} as argument 1; found ${lst.constructor.name}.`);
        }

        if (!(idx instanceof NumberValue)) {
            throw CSPError.fromRange(cr, `The function "INSERT" expected ${NumberValue.name} as argument 2; found ${lst.constructor.name}.`);
        }

        throwBadIdx(cr, lst.value, idx.value, true);

        lst.value.splice(idx.value + 1, 0, val);
        return new NullValue();
    });

    makeBuiltinFunction("APPEND", ctx, [ListValue, Value], (args, cr) => {
        const [lst, val] = args;

        if (!(lst instanceof ListValue)) {
            throw CSPError.fromRange(cr, `The function "APPEND" expected ${ListValue.name} as argument 1; found ${lst.constructor.name}.`);
        }

        lst.value.push(val);
        return new NullValue();
    });

    makeBuiltinFunction("REMOVE", ctx, [ListValue, NumberValue], (args, cr) => {
        const [lst, idx] = args;

        if (!(lst instanceof ListValue)) {
            throw CSPError.fromRange(cr, `The function "REMOVE" expected ${ListValue.name} as argument 1; found ${lst.constructor.name}.`);
        }

        if (!(idx instanceof NumberValue)) {
            throw CSPError.fromRange(cr, `The function "REMOVE" expected ${ListValue.name} as argument 1; found ${lst.constructor.name}.`);
        }

        throwBadIdx(cr, lst.value, idx.value, false);

        lst.value.splice(idx.value, 1);
        return new NullValue();
    });

    makeBuiltinFunction("INPUT", ctx, [], (_, __) => {
        const val = window.prompt(`Enter your input to "INPUT()" here.`) || "";
        return Value.fromInput(val);
    });
}
