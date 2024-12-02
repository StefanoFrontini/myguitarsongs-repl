export type TokenType = "\x00" | "STRING" | "CHORD" | "\n" | "ILLEGAL";

export type t = {
  type: TokenType;
  literal: string;
};

export const ILLEGAL = "ILLEGAL",
  EOF = "\x00",
  STRING = "STRING",
  CHORD = "CHORD",
  LBRACKET = "[",
  RBRACKET = "]",
  ENDOFLINE = "\n";
