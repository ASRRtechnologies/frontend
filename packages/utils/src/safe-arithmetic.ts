/**
 * Evaluates a plain arithmetic expression (`+ - * / %`, parentheses, unary minus, decimal and
 * exponent-notation numbers) without `eval`/`Function`.
 *
 * Type-editor view formulas are tenant-authored data; running them through `eval` executed
 * arbitrary JavaScript in every colleague's browser that opened the concept viewer — with the
 * session tokens in localStorage. Anything that is not arithmetic yields NaN, exactly what the
 * caller treated a failed evaluation as.
 */
export function evaluateArithmetic(expression: string): number {
	const tokens = tokenize(expression);
	if (tokens === null) return Number.NaN;
	const parser = new Parser(tokens);
	const value = parser.parseExpression();
	if (parser.position !== tokens.length) return Number.NaN;
	return Number.isFinite(value) ? value : Number.NaN;
}

type Token = { kind: "num"; value: number } | { kind: "op"; value: string };

function tokenize(input: string): Token[] | null {
	const tokens: Token[] = [];
	const re =
		/\s*(?:(\d+(?:\.\d+)?(?:e[+-]?\d+)?|\.\d+(?:e[+-]?\d+)?)|([-+*/%()]))/iy;
	let index = 0;
	while (index < input.length) {
		re.lastIndex = index;
		const match = re.exec(input);
		if (!match) {
			// trailing whitespace is fine; anything else is not arithmetic
			return input.slice(index).trim() === "" ? tokens : null;
		}
		if (match[1] !== undefined) {
			tokens.push({ kind: "num", value: Number(match[1]) });
		} else if (match[2] !== undefined) {
			tokens.push({ kind: "op", value: match[2] });
		}
		index = re.lastIndex;
	}
	return tokens;
}

class Parser {
	position = 0;
	constructor(private readonly tokens: Token[]) {}

	private peek(): Token | undefined {
		return this.tokens[this.position];
	}

	private takeOp(...ops: string[]): string | null {
		const token = this.peek();
		if (token?.kind === "op" && ops.includes(token.value)) {
			this.position++;
			return token.value;
		}
		return null;
	}

	parseExpression(): number {
		let left = this.parseTerm();
		for (;;) {
			const op = this.takeOp("+", "-");
			if (!op) return left;
			const right = this.parseTerm();
			left = op === "+" ? left + right : left - right;
		}
	}

	private parseTerm(): number {
		let left = this.parseUnary();
		for (;;) {
			const op = this.takeOp("*", "/", "%");
			if (!op) return left;
			const right = this.parseUnary();
			left =
				op === "*" ? left * right : op === "/" ? left / right : left % right;
		}
	}

	private parseUnary(): number {
		const op = this.takeOp("-", "+");
		if (op === "-") return -this.parseUnary();
		if (op === "+") return this.parseUnary();
		return this.parsePrimary();
	}

	private parsePrimary(): number {
		const token = this.peek();
		if (!token) return Number.NaN;
		if (token.kind === "num") {
			this.position++;
			return token.value;
		}
		if (token.value === "(") {
			this.position++;
			const value = this.parseExpression();
			if (!this.takeOp(")")) return Number.NaN;
			return value;
		}
		return Number.NaN;
	}
}
