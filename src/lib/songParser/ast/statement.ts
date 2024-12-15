import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";

export type Statement = ExpressionStatement.ExpressionStatement;

export const tokenLiteral = (s: Statement): string => s.token.literal;

export const string = (s: Statement): string => {
  switch (s["tag"]) {
    case "expressionStatement":
      return ExpressionStatement.string(s);
    default:
      throw new Error("unknown statement");
    // const _exhaustiveCheck: never = s;
    //   return _exhaustiveCheck;
  }
};
