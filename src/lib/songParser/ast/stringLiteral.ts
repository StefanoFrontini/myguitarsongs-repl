import * as Token from "@/lib/songParser/token/token";
export type t = {
  tag: "stringLiteral";
  token: Token.t;
  value: string;
};

export const tokenLiteral = (s: t): string => s.token.literal;

export const string = (s: t): string => s.value;
