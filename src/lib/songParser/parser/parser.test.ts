// import * as ChordExpression from "@/lib/songParser/ast/chordExpression";
import * as Expression from "@/lib/songParser/ast/expression";
import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";
// import * as LyricExpression from "@/lib/songParser/ast/lyricExpression";
import * as Program from "@/lib/songParser/ast/program";
import * as WordExpression from "@/lib/songParser/ast/wordExpression";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Object from "@/lib/songParser/object/object";
import * as Parser from "@/lib/songParser/parser/parser";
import { assert, describe, it } from "vitest";

const checkParserErrors = (p: Parser.Parser) => {
  assert.strictEqual(
    p.errors.length,
    0,
    `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
      "\n"
    )}`
  );
};

const testWordExpression = (
  exp: Expression.Expression | null,
  value: [Object.Chord, Object.Lyric]
) => {
  assert.ok(exp, "exp is null");
  if (exp === null) throw new Error("exp is null");
  assert.strictEqual(
    exp["tag"],
    "wordExpression",
    `exp is not an wordExpression. got=${exp["tag"]}`
  );
  const cl = exp as WordExpression.WordExpression;
  assert.deepStrictEqual(
    cl.value,
    value,
    `cl.value is not '${JSON.stringify(value)}'. got=${JSON.stringify(
      cl.value
    )}`
  );
  // assert.strictEqual(
  //   ChordExpression.tokenLiteral(cl),
  //   value,
  //   `cl.tokenLiteral() is not '${value}'. got=${ChordExpression.tokenLiteral(
  //     cl
  //   )}`
  // );
};
// const testPrefixChordExpression = (
//   exp: Expression.Expression | null,
//   chordLiteral: string,
//   lyricLiteral: string
// ) => {
//   assert.ok(exp, "exp is null");
//   if (exp === null) throw new Error("exp is null");
//   assert.strictEqual(
//     exp["tag"],
//     "wordExpression",
//     `exp is not an wordExpression. got=${exp["tag"]}`
//   );
//   const prefix = exp as WordExpression.WordExpression;
//   assert.strictEqual(
//     WordExpression.tokenLiteral(prefix),
//     chordLiteral,
//     `cl.tokenLiteral() is not 'a'. got=${WordExpression.tokenLiteral(prefix)}`
//   );
//   const le = prefix.value as LyricExpression.LyricExpression;
//   assert.strictEqual(
//     LyricExpression.tokenLiteral(le),
//     lyricLiteral,
//     `cl.tokenLiteral() is not 'a'. got=${LyricExpression.tokenLiteral(le)}`
//   );
// };

describe("Parser", () => {
  it("TestChordExpression", () => {
    const input = "[A]";
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

    const exprStmt = program
      .statements[0] satisfies ExpressionStatement.ExpressionStatement;
    testWordExpression(exprStmt.expression as WordExpression.WordExpression, [
      { tag: "chord", value: "A" },
      {
        tag: "lyric",
        value: "",
      },
    ]);
  });
  it("TestChordExpression2", () => {
    const input = "[A]abc";
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

    const exprStmt = program
      .statements[0] satisfies ExpressionStatement.ExpressionStatement;
    testWordExpression(exprStmt.expression, [
      { tag: "chord", value: "A" },
      {
        tag: "lyric",
        value: "abc",
      },
    ]);
  });
  it("TestOperatorPrecedingParsing", () => {
    const tests = [
      {
        input: "[C]abc[D]efg",
        expected: "((Cabc)(Defg))",
      },
      {
        input: "[A]abc\n[D]efg",
        expected: "((Aabc)(Defg))",
      },
      {
        input: "[A]abc[B]def\n[C]qwe[D]ghj",
        expected: "(((Aabc)(Bdef))((Cqwe)(Dghj)))",
      },
      {
        input: "abc[A]vfg",
        expected: "((abc)(Avfg))",
      },
      {
        input: "[A][B][C]",
        expected: "(((A)(B))(C))",
      },
    ];
    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      checkParserErrors(p);
      console.log("parser:");
      console.log(JSON.stringify(program, null, 2));
      console.log("program: ", Program.string(program));
      assert.strictEqual(Program.string(program), tt.expected);
    }
  });
});
