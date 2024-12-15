import * as Expression from "@/lib/songParser/ast/expression";
import * as LyricExpression from "@/lib/songParser/ast/lyricExpression";
import * as Token from "@/lib/songParser/token/token";

export type WordExpression = {
  tag: "wordExpression";
  token: Token.Token;
  right: LyricExpression.LyricExpression | null;
};

export const tokenLiteral = (p: WordExpression): string => p.token.literal;

export const string = (p: WordExpression): string => {
  let result = "(";
  result += tokenLiteral(p);
  if (p.right) {
    result += Expression.string(p.right);
  }
  result += ")";
  return result;
};
