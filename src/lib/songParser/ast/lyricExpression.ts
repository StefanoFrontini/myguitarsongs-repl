import * as Token from "@/lib/songParser/token/token";
export type LyricExpression = {
  tag: "lyricExpression";
  token: Token.Token;
  value: string;
};

export const tokenLiteral = (s: LyricExpression): string => s.token.literal;

export const string = (s: LyricExpression): string => s.value;
