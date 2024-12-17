import * as Ast from "@/lib/songParser/ast/ast";
import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";
import * as Song from "@/lib/songParser/object/song";
const evalStatements = (
  statements: ExpressionStatement.ExpressionStatement[]
): Song.Song | null => {
  let result: Song.Song | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
  }
  return result;
};
// const evalWordInfixExpression = (
//   operator: string,
//   left: Song.Song | null,
//   right: Song.Song | null
// ) => {
//   if (left === null || right === null) return null;
//   return [
//     {
//       tag: "line",
//       value: left["value"].concat(right["value"]),
//     },
//   ];
// };

const evalInfixExpression = (
  operator: string,
  left: Song.Song | null,
  right: Song.Song | null
) => {
  if (left === null || right === null) return null;
  switch (operator) {
    case "\n":
      return left.concat(right);
    // return right
    //   ? left.concat(right)
    //   : left.concat([
    //       {
    //         tag: "line",
    //         value: [
    //           {
    //             tag: "word",
    //             value: [
    //               {
    //                 tag: "chord",
    //                 value: "",
    //               },
    //               {
    //                 tag: "lyric",
    //                 value: "",
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ]);

    case "CHORD":
      const lastElementLeft = left[left.length - 1];
      const firstElementRight = right[0];
      const concatElements: Song.Line = {
        tag: "line",
        value: lastElementLeft["value"].concat(firstElementRight["value"]),
      };
      return [
        ...left.slice(0, -1),
        concatElements,
        ...right.slice(1),
      ] satisfies Song.Song;
    default:
      throw new Error("unknown operator");
  }
};

export const evalNode = (node: Ast.Ast): Song.Song | null => {
  switch (node["tag"]) {
    case "program":
      return evalStatements(node["statements"]);
    case "expressionStatement":
      if (!node.expression) return null;
      return evalNode(node["expression"]);
    case "lyricExpression":
      return [
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
                  value: node["value"],
                },
              ],
            },
          ],
        },
      ] satisfies Song.Song;

    case "chordExpression":
      return [
        {
          tag: "line",
          value: [
            {
              tag: "word",
              value: [
                {
                  tag: "chord",
                  value: node["value"],
                },
                {
                  tag: "lyric",
                  value: "",
                },
              ],
            },
          ],
        },
      ] satisfies Song.Song;

    case "wordExpression":
      if (!node.value) return null;
      return [
        {
          tag: "line",
          value: [
            {
              tag: "word",
              value: node["value"],
            },
          ],
        },
      ] satisfies Song.Song;

    case "infixExpression":
      if (!node.left || !node.right) return null;
      const left = evalNode(node["left"]);
      const right = evalNode(node["right"]);
      return evalInfixExpression(node["operator"], left, right);
    default:
      return null;
  }
};
