import * as Ast from "@/lib/songParser/ast/ast";
import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";
import * as Song from "@/lib/songParser/object/song";
const evalStatements = (statements: ExpressionStatement.t[]): Song.t | null => {
  let result: Song.t | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
  }
  return result;
};

const evalInfixExpression = (
  left: Song.t | null,
  right: Song.t | null
): Song.t | null => {
  if (left === null || right === null) return null;
  return left.concat(right);
};
export const evalNode = (node: Ast.t): Song.t | null => {
  switch (node["tag"]) {
    case "program":
      return evalStatements(node["statements"]);
    case "expressionStatement":
      if (node["expression"] === null) {
        return null;
      }
      return evalNode(node["expression"]);

    case "stringLiteral":
      return [
        {
          tag: "lyric",
          value: node["value"],
        },
      ] satisfies Song.t;

    case "chordLiteral":
      return [
        {
          tag: "chord",
          value: node["value"],
        },
      ] satisfies Song.t;

    case "endoflineLiteral":
      return [
        {
          tag: "endofline",
          value: node["value"],
        },
      ] satisfies Song.t;

    case "errorLiteral":
      return [
        {
          tag: "error",
          value: node["value"],
        },
      ] satisfies Song.t;

    case "infixExpression":
      if (node.left === null || node.right === null) return null;
      const left = evalNode(node.left);
      const right = evalNode(node.right);
      return evalInfixExpression(left, right);

    default:
      return null;
    //     const _exhaustiveCheck: never = node;
    //     throw new Error(_exhaustiveCheck);
  }
};
