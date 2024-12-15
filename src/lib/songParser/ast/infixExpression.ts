import * as Expression from "@/lib/songParser/ast/expression";
import * as Token from "@/lib/songParser/token/token";
export type InfixExpression = {
  tag: "infixExpression";
  token: Token.Token;
  left: Expression.Expression | null;
  operator: string;
  right: Expression.Expression | null;
};

export const tokenLiteral = (i: InfixExpression): string => i.token.literal;

export const string = (i: InfixExpression): string => {
  let result = "(";
  if (i.left) {
    result += Expression.string(i.left);
  }
  if (i.right) {
    result += Expression.string(i.right);
  }
  result += ")";
  return result;
};
