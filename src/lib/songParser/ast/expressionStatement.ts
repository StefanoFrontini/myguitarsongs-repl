import * as Expression from "@/lib/songParser/ast/expression";
import * as Token from "@/lib/songParser/token/token";
export type t = {
  tag: "expressionStatement";
  token: Token.t;
  expression: Expression.t | null;
};

export const tokenLiteral = (e: t): string => e.token.literal;

export const string = (e: t): Promise<string> => {
  if (e.expression !== null) {
    return Expression.string(e.expression);
  }
  return Promise.resolve("");
};
