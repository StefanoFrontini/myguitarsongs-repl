import * as Token from "@/lib/songParser/token/token";
export type ChordExpression = {
  tag: "chordExpression";
  token: Token.Token;
  value: string;
};

export const tokenLiteral = (s: ChordExpression): string => s.token.literal;

export const string = (s: ChordExpression): string => s.value;
