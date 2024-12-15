import * as Expression from "@/lib/songParser/ast/expression";
import * as Token from "@/lib/songParser/token/token";
export type ExpressionStatement = {
  tag: "expressionStatement";
  token: Token.Token;
  expression: Expression.Expression | null;
};

export const tokenLiteral = (e: ExpressionStatement): string => e.token.literal;

export const string = (e: ExpressionStatement): string =>
  e.expression ? Expression.string(e.expression) : "";
