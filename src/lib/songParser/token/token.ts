export type TokenType = "\x00" | "LYRIC" | "CHORD" | "\n" | "ILLEGAL";

export type Token = {
  type: TokenType;
  literal: string;
};

export const ILLEGAL = "ILLEGAL",
  EOF = "\x00",
  LYRIC = "LYRIC",
  CHORD = "CHORD",
  LBRACKET = "[",
  RBRACKET = "]",
  ENDOFLINE = "\n";
