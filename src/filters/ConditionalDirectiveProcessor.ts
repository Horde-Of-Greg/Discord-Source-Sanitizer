import { FilterErrorAction } from "../types/filters/FilterErrorAction.js";
import type { IConditionalFrame } from "../types/filters/IConditionalFrame.js";
import { ConditionalExpression } from "./ConditionalExpression.js";
import { FilterProcessingError } from "./FilterProcessingError.js";
import type { SourceLine } from "./SourceLine.js";

export class ConditionalDirectiveProcessor {
    private readonly frames: IConditionalFrame[] = [];
    private _active = true;

    public get active(): boolean {
        return this._active;
    }

    public process(source: SourceLine): boolean {
        const line = source.text.trim();
        if (line.startsWith("!#if ")) {
            this.startCondition(line.slice(5), source);
            return true;
        }
        if (line === "!#else") {
            this.startElse(source);
            return true;
        }
        if (line === "!#endif") {
            this.endCondition(source);
            return true;
        }
        return false;
    }

    public assertComplete(source: SourceLine): void {
        if (this.frames.length === 0) return;
        throw new FilterProcessingError({
            message: "Unterminated !#if block",
            action: FilterErrorAction.Exit,
            source,
        });
    }

    private startCondition(expression: string, source: SourceLine): void {
        const condition = new ConditionalExpression(expression, source).evaluate();
        this.frames.push({ parentActive: this._active, condition, inElse: false });
        this._active = this._active && condition;
    }

    private startElse(source: SourceLine): void {
        const frame = this.frames.at(-1);
        if (frame === undefined || frame.inElse) {
            throw new FilterProcessingError({
                message: "Invalid !#else",
                action: FilterErrorAction.Exit,
                source,
            });
        }
        frame.inElse = true;
        this._active = frame.parentActive && !frame.condition;
    }

    private endCondition(source: SourceLine): void {
        const frame = this.frames.pop();
        if (frame === undefined) {
            throw new FilterProcessingError({
                message: "Unexpected !#endif",
                action: FilterErrorAction.Exit,
                source,
            });
        }
        this._active = frame.parentActive;
    }
}
