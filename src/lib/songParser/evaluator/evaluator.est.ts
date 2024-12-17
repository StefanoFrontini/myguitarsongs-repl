import * as Evaluator from "@/lib/songParser/evaluator/evaluator";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Song from "@/lib/songParser/object/song";
import * as Parser from "@/lib/songParser/parser/parser";
import { assert, describe, it } from "vitest";

const testEvalNode = (input: string) => {
  const l = Lexer.init(input);
  const p = Parser.init(l);
  const program = Parser.parseProgram(p);
  console.log(JSON.stringify(program, null, 2));
  return Evaluator.evalNode(program);
};

const testWordObject = (obj: Song.Song, expected: Song.Song) => {
  assert.strictEqual(
    obj[0]["tag"],
    expected[0]["tag"],
    `obj[0]["tag"] is not ${expected[0]["tag"]}. got=${obj[0]["tag"]}`
  );
  assert.deepEqual(
    obj[0]["value"],
    expected[0]["value"],
    `obj[0]["value"] is not ${JSON.stringify(
      expected[0]["value"]
    )}. got=${JSON.stringify(obj[0]["value"])}`
  );
};

const textInfixWordObject = (obj: Song.Song, expected: Song.Song) => {
  assert.strictEqual(
    obj[0]["tag"],
    expected[0]["tag"],
    `obj[0]["tag"] is not ${expected[0]["tag"]}. got=${obj[0]["tag"]}`
  );
  assert.strictEqual(
    obj[0]["value"][0]["tag"],
    expected[0]["value"][0]["tag"],
    `obj[0]["value"][0]["tag"] is not ${expected[0]["value"][0]["tag"]}. got=${obj[0]["value"][0]["tag"]}`
  );
  assert.deepEqual(
    obj[0]["value"][0]["value"],
    expected[0]["value"][0]["value"],
    `obj[0]["value"] is not ${JSON.stringify(
      expected[0]["value"]
    )}. got=${JSON.stringify(obj[0]["value"])}`
  );
  // assert.strictEqual(
  //   obj[1]["tag"],
  //   expected[1]["tag"],
  //   `obj[1]["tag"] is not ${expected[1]["tag"]}. got=${obj[1]["tag"]}`
  // );
  // assert.strictEqual(
  //   obj[1]["value"][0]["tag"],
  //   expected[1]["value"][0]["tag"],
  //   `obj[1]["value"][0]["tag"] is not ${expected[1]["value"][0]["tag"]}. got=${obj[1]["value"][0]["tag"]}`
  // );
  // assert.deepEqual(
  //   obj[1]["value"][0]["value"],
  //   expected[1]["value"][0]["value"],
  //   `obj[1]["value"] is not ${JSON.stringify(
  //     expected[1]["value"]
  //   )}. got=${JSON.stringify(obj[1]["value"])}`
  // );
};

describe("Evaluator", () => {
  it("TestEvalLyricExpression", () => {
    const tests = [
      {
        input: `abc`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
    ];

    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.isNotNull(evaluated, "evaluated is null");
      if (evaluated === null) throw new Error("evaluated is null");
      testWordObject(evaluated, tt.expected);
    }
  });
  it("TestEvalChordExpression", () => {
    const tests = [
      {
        input: `[A]`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
    ];

    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.isNotNull(evaluated, "evaluated is null");
      if (evaluated === null) throw new Error("evaluated is null");
      testWordObject(evaluated, tt.expected);
    }
  });
  it("TestEvalWordPrefixExpression", () => {
    const tests = [
      {
        input: `[A]abc`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
    ];

    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.isNotNull(evaluated, "evaluated is null");
      if (evaluated === null) throw new Error("evaluated is null");
      testWordObject(evaluated, tt.expected);
    }
  });
  it("TestEvalWordInfixExpression", () => {
    const tests = [
      {
        input: `[A]abc[C]xyz`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "C",
                  },
                  {
                    tag: "lyric",
                    value: "xyz",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
      {
        input: `[A]abc[C]`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "C",
                  },
                  {
                    tag: "lyric",
                    value: "",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
      {
        input: `abc[A]`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
      {
        input: `abc[A]xyz`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "xyz",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
    ];

    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.isNotNull(evaluated, "evaluated is null");
      if (evaluated === null) throw new Error("evaluated is null");
      textInfixWordObject(evaluated, tt.expected);
    }
  });
  it("TestEvalLineInfixExpression", () => {
    const tests = [
      {
        input: `[A]abc\n[C]xyz`,
        expected: [
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "A",
                  },
                  {
                    tag: "lyric",
                    value: "abc",
                  },
                ],
              },
            ],
          },
          {
            tag: "line",
            value: [
              {
                tag: "word",
                value: [
                  {
                    tag: "chord",
                    value: "C",
                  },
                  {
                    tag: "lyric",
                    value: "xyz",
                  },
                ],
              },
            ],
          },
        ] satisfies Song.Song,
      },
      // {
      //   input: `[A]abc[B]def\n[C]qwe[D]ghj`,
      //   expected: [
      //     {
      //       tag: "line",
      //       value: [
      //         {
      //           tag: "word",
      //           value: [
      //             {
      //               tag: "chord",
      //               value: "A",
      //             },
      //             {
      //               tag: "lyric",
      //               value: "abc",
      //             },
      //           ],
      //         },
      //         {
      //           tag: "word",
      //           value: [
      //             {
      //               tag: "chord",
      //               value: "B",
      //             },
      //             {
      //               tag: "lyric",
      //               value: "def",
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       tag: "line",
      //       value: [
      //         {
      //           tag: "word",
      //           value: [
      //             {
      //               tag: "chord",
      //               value: "C",
      //             },
      //             {
      //               tag: "lyric",
      //               value: "qwe",
      //             },
      //           ],
      //         },
      //         {
      //           tag: "word",
      //           value: [
      //             {
      //               tag: "chord",
      //               value: "D",
      //             },
      //             {
      //               tag: "lyric",
      //               value: "ghj",
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ] satisfies Song.Song,
      // },
    ];

    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      // console.log("evaluated", JSON.stringify(evaluated, null, 2));
      assert.isNotNull(evaluated, "evaluated is null");
      if (evaluated === null) throw new Error("evaluated is null");
      testWordObject(evaluated, tt.expected);
    }
  });
});
