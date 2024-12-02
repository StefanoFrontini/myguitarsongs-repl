import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Token from "@/lib/songParser/token/token";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("lexer", () => {
  it("TestNextToken", () => {
    const input = `abc[12cd]`;

    const tests = [
      {
        expectedType: Token.STRING,
        expectedLiteral: "abc",
      },
      {
        expectedType: Token.CHORD,
        expectedLiteral: "12cd",
      },
      // {
      //   expectedType: Token.LBRACKET,
      //   expectedLiteral: "[",
      // },
      // {
      //   expectedType: Token.STRING,
      //   expectedLiteral: "12",
      // },
      // {
      //   expectedType: Token.ENDOFLINE,
      //   expectedLiteral: "\n",
      // },
      // {
      //   expectedType: Token.STRING,
      //   expectedLiteral: "    cd",
      // },
      // {
      //   expectedType: Token.RBRACKET,
      //   expectedLiteral: "]",
      // },
      // {
      //   expectedType: Token.EOF,
      //   expectedLiteral: "\x00",
      // },
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
