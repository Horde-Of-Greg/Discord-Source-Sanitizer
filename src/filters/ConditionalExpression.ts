import { FilterErrorAction } from "../types/filters/FilterErrorAction.js";
import { FilterProcessingError } from "./FilterProcessingError.js";
import type { SourceLine } from "./SourceLine.js";

export class ConditionalExpression {
    private readonly tokens: string[];
    private index = 0;

    public constructor(
        expression: string,
        private readonly source: SourceLine,
    ) {
        this.tokens = expression.match(/&&|\|\||!|\(|\)|[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
        if (this.tokens.join("").length !== expression.replaceAll(/\s/g, "").length) {
            this.fail(`Unsupported conditional expression: ${expression}`);
        }
    }

    public evaluate(): boolean {
        const value = this.parseOr();
        if (this.index !== this.tokens.length) this.fail("Unexpected conditional token");
        return value;
    }

    private parseOr(): boolean {
        let value = this.parseAnd();
        while (this.peek() === "||") {
            this.index++;
            const next = this.parseAnd();
            value = value || next;
        }
        return value;
    }

    private parseAnd(): boolean {
        let value = this.parseUnary();
        while (this.peek() === "&&") {
            this.index++;
            const next = this.parseUnary();
            value = value && next;
        }
        return value;
    }

    private parseUnary(): boolean {
        if (this.peek() === "!") {
            this.index++;
            return !this.parseUnary();
        }
        if (this.peek() === "(") return this.parseGroup();
        if (this.index >= this.tokens.length) this.fail("Expected conditional identifier");
        this.index++;
        return false;
    }

    private parseGroup(): boolean {
        this.index++;
        const value = this.parseOr();
        if (this.peek() !== ")") this.fail("Missing closing parenthesis");
        this.index++;
        return value;
    }

    private peek(): string | undefined {
        return this.tokens[this.index];
    }

    private fail(message: string): never {
        throw new FilterProcessingError({
            message,
            action: FilterErrorAction.Exit,
            source: this.source,
        });
    }
}
