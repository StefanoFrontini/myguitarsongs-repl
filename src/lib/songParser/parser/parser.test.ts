import * as ChordLiteral from "@/lib/songParser/ast/chordLiteral";
import * as EndoflineLiteral from "@/lib/songParser/ast/endoflineLiteral";
import * as Expression from "@/lib/songParser/ast/expression";
import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";
import * as InfixExpression from "@/lib/songParser/ast/infixExpression";
import * as Program from "@/lib/songParser/ast/program";
import * as StringLiteral from "@/lib/songParser/ast/stringLiteral";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Parser from "@/lib/songParser/parser/parser";
import assert from "node:assert";
import { describe, it } from "node:test";
const testStringLiteral = (exp: Expression.t | null, value: string) => {
  assert.ok(exp, "exp is null");
  assert.strictEqual(
    exp["tag"],
    "stringLiteral",
    `exp is not an stringLiteral. got=${exp["tag"]}`
  );
  const sl = exp as StringLiteral.t;
  assert.strictEqual(
    sl.value,
    value,
    `sl.value is not '${value}'. got=${sl.value}`
  );
  assert.strictEqual(
    StringLiteral.tokenLiteral(sl),
    value,
    `sl.tokenLiteral() is not '${value}'. got=${StringLiteral.tokenLiteral(sl)}`
  );
};

const testChordLiteral = (exp: Expression.t | null, value: string) => {
  assert.ok(exp, "exp is null");
  assert.strictEqual(
    exp["tag"],
    "chordLiteral",
    `exp is not an chordLiteral. got=${exp["tag"]}`
  );
  const cl = exp as ChordLiteral.t;
  assert.strictEqual(
    cl.value,
    value,
    `cl.value is not '${value}'. got=${cl.value}`
  );
  assert.strictEqual(
    ChordLiteral.tokenLiteral(cl),
    value,
    `cl.tokenLiteral() is not '${value}'. got=${ChordLiteral.tokenLiteral(cl)}`
  );
};

const testEndoflineLiteral = (exp: Expression.t | null, value: string) => {
  assert.ok(exp, "exp is null");
  assert.strictEqual(
    exp["tag"],
    "endoflineLiteral",
    `exp is not an endoflineLiteral. got=${exp["tag"]}`
  );
  const el = exp as EndoflineLiteral.t;
  assert.strictEqual(
    el.value,
    value,
    `el.value is not '${value}'. got=${el.value}`
  );
  assert.strictEqual(
    EndoflineLiteral.tokenLiteral(el),
    value,
    `el.tokenLiteral() is not '${value}'. got=${EndoflineLiteral.tokenLiteral(
      el
    )}`
  );
};

const checkParserErrors = (p: Parser.t) => {
  assert.strictEqual(
    p.errors.length,
    0,
    `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
      "\n"
    )}`
  );
};

describe("Parser", () => {
  it("TestStringLiteral", () => {
    const input = "foobar";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    checkParserErrors(p);
    assert.notStrictEqual(program, null, "Parser.parseProgram() returned null");
    assert.strictEqual(
      program.statements.length,
      1,
      `
          program.statements has not enough statements. got=${program.statements.length}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );

    const exprStmt = program.statements[0] as ExpressionStatement.t;
    testStringLiteral(exprStmt.expression, "foobar");
  });
  it("TestChordLiteral", () => {
    const input = "[C]";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    checkParserErrors(p);
    assert.notStrictEqual(program, null, "Parser.parseProgram() returned null");
    assert.strictEqual(
      program.statements.length,
      1,
      `
          program.statements has not enough statements. got=${program.statements.length}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );

    const exprStmt = program.statements[0] as ExpressionStatement.t;
    testChordLiteral(exprStmt.expression, "C");
  });
  it("TestParsingInfixExpressions", () => {
    const tests = [
      {
        input: "abc[C]",
        leftValue: "abc",
        rightValue: "C",
      },
      {
        input: "cde\n",
        leftValue: "cde",
        rightValue: "\n",
      },
    ];
    for (const [index, tt] of tests.entries()) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      checkParserErrors(p);
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      console.dir(program.statements, { depth: null });
      assert.strictEqual(
        program.statements.length,
        1,
        `
          program.statements has not enough statements. got=${program.statements.length}`
      );
      assert.strictEqual(
        program.statements[0]["tag"],
        "expressionStatement",
        `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
      );

      const exprStmt = program.statements[0] as ExpressionStatement.t;
      assert.ok(exprStmt.expression, "exprStmt.expression is null");
      assert.strictEqual(
        exprStmt.expression["tag"],
        "infixExpression",
        `exprStmt.expression is not an InfixExpression. got=${exprStmt.expression["tag"]}`
      );
      const ie = exprStmt.expression as InfixExpression.t;
      assert.strictEqual(
        ie["tag"],
        "infixExpression",
        `ie is not an InfixExpression. got=${ie["tag"]}`
      );
      if (index === 0) {
        testStringLiteral(ie.left, tt.leftValue);
        testChordLiteral(ie.right, tt.rightValue);
      }
      if (index === 1) {
        testStringLiteral(ie.left, tt.leftValue);
        testEndoflineLiteral(ie.right, tt.rightValue);
      }
    }
  });
  it("TestOperatorPrecedenceParsing", async () => {
    const tests = [
      {
        input: "abc[C]cde[D]",
        expected: "(((abcC)cde)D)",
      },
    ];
    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      checkParserErrors(p);
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      assert.strictEqual(
        program.statements.length,
        1,
        `
          program.statements has not enough statements. got=${program.statements.length}`
      );
      assert.strictEqual(
        program.statements[0]["tag"],
        "expressionStatement",
        `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
      );
      const actual = await Program.string(program);
      assert.strictEqual(
        actual,
        tt.expected,
        `actual is not '${tt.expected}'. got=${actual}`
      );
    }
  });
});
