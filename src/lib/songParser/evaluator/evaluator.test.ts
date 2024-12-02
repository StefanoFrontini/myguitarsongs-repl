import * as Evaluator from "@/lib/songParser/evaluator/evaluator";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Song from "@/lib/songParser/object/song";
import * as Parser from "@/lib/songParser/parser/parser";
import assert from "node:assert";
import { describe, it } from "node:test";

const testEvalNode = (input: string) => {
  const l = Lexer.init(input);
  const p = Parser.init(l);
  const program = Parser.parseProgram(p);
  return Evaluator.evalNode(program);
};

const testLyricObject = (obj: Song.t, expected: Song.t) => {
  assert.strictEqual(
    obj[0]["tag"],
    expected[0]["tag"],
    `obj is not a Lyric Object. got=${obj[0]["tag"]}`
  );
  assert.strictEqual(
    obj[0]["value"],
    expected[0]["value"],
    `obj.value is not '${expected[0]["value"]}'. got=${obj[0]["value"]}`
  );
};

const testChordObject = (obj: Song.t, expected: Song.t) => {
  assert.strictEqual(
    obj[0]["tag"],
    expected[0]["tag"],
    `obj is not a Chord Object. got=${obj[0]["tag"]}`
  );
  assert.strictEqual(
    obj[0]["value"],
    expected[0]["value"],
    `obj.value is not '${expected[0]["value"]}'. got=${obj[0]["value"]}`
  );
};

const testEndoflineObject = (obj: Song.t, expected: Song.t) => {
  assert.strictEqual(
    obj[0]["tag"],
    expected[0]["tag"],
    `obj is not a Endofline Object. got=${obj[0]["tag"]}`
  );
  assert.strictEqual(
    obj[0]["value"],
    expected[0]["value"],
    `obj.value is not '${expected[0]["value"]}'. got=${obj[0]["value"]}`
  );
};

const testInfixExpression = (obj: Song.t, expected: Song.t) => {
  assert.strictEqual(
    obj[0]["tag"],
    expected[0]["tag"],
    `obj[0] is not a lyric Object. got=${obj[0]["tag"]}`
  );
  assert.strictEqual(
    obj[0]["value"],
    expected[0]["value"],
    `obj[0].value is not a ${expected[0]["value"]}. got=${obj[0]["value"]}`
  );
  assert.strictEqual(
    obj[1]["tag"],
    expected[1]["tag"],
    `obj[1] is not a chord Object. got=${obj[1]["tag"]}`
  );
  assert.strictEqual(
    obj[1]["value"],
    expected[1]["value"],
    `obj[1] is not a ${expected[1]["value"]}. got=${obj[1]["value"]}`
  );
};

describe("evaluator", () => {
  it("TestEvalStringLiteral", () => {
    const tests = [
      {
        input: "ab c",
        expected: [
          {
            tag: "lyric",
            value: "ab c",
          },
        ] satisfies Song.t,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.ok(evaluated, "evaluated is null");
      testLyricObject(evaluated, tt.expected);
    }
  });
  it("TestEvalChordLiteral", () => {
    const tests = [
      {
        input: "[C]",
        expected: [
          {
            tag: "chord",
            value: "C",
          },
        ] satisfies Song.t,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.ok(evaluated, "evaluated is null");
      testChordObject(evaluated, tt.expected);
    }
  });
  it("TestEvalEndoflineLiteral", () => {
    const tests = [
      {
        input: "\n",
        expected: [
          {
            tag: "endofline",
            value: "\n",
          },
        ] satisfies Song.t,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.ok(evaluated, "evaluated is null");
      testEndoflineObject(evaluated, tt.expected);
    }
  });
  it("TestEvalInfixExpression", () => {
    const tests = [
      {
        input: "abc[C]",
        expected: [
          { tag: "lyric", value: "abc" },
          { tag: "chord", value: "C" },
        ] satisfies Song.t,
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.ok(evaluated, "evaluated is null");
      testInfixExpression(evaluated, tt.expected);
    }
  });
});
