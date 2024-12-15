import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Token from "@/lib/songParser/token/token";
import { assert, describe, it } from "vitest";

describe("lexer", () => {
  it("TestNextToken", () => {
    const input = `abc[12cd]`;

    const tests = [
      {
        expectedType: Token.LYRIC,
        expectedLiteral: "abc",
      },
      {
        expectedType: Token.CHORD,
        expectedLiteral: "12cd",
      },
    ];
    const l = Lexer.init(input);
    for (const tt of tests) {
      const tok = Lexer.nextToken(l);
      assert.strictEqual(
        tok.type,
        tt.expectedType,
        `Expected ${tt.expectedType}, got ${tok.type}`
      );
      assert.strictEqual(
        tok.literal,
        tt.expectedLiteral,
        `Expected ${tt.expectedLiteral}, got ${tok.literal}`
      );
    }
  });
});
