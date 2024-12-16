import * as Ast from "@/lib/songParser/ast/ast";
import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";
import * as Song from "@/lib/songParser/object/object";
const evalStatements = (
  statements: ExpressionStatement.ExpressionStatement[]
): Song.Song | null => {
  let result: Song.Song | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
  }
  return result;
};

const evalInfixExpression = (
  left: Song.Song | null,
  right: Song.Song | null
) => {
  if (left === null || right === null) return null;
  return left.concat(right);
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
              value: [
                {
                  tag: "chord",
                  value: node["value"][0]["value"],
                },
                {
                  tag: "lyric",
                  value: node["value"][1]["value"],
                },
              ],
            },
          ],
        },
      ] satisfies Song.Song;

    case "infixExpression":
      if (!node.left || !node.right) return null;
      const left = evalNode(node["left"]);
      const right = evalNode(node["right"]);
      return evalInfixExpression(left, right);
    default:
      return null;
  }
};
