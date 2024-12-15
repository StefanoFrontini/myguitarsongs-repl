import * as Token from "@/lib/songParser/token/token";

type ValidChord = {
  tag: "valid";
  literal: string;
};

type IllegalChord = {
  tag: "illegal";
  literal: string;
};

type Chord = ValidChord | IllegalChord;

export type Lexer = {
  input: string;
  position: number;
  readPosition: number;
  ch: string;
};

export const init = (input: string): Lexer => {
  const l = { input, position: 0, readPosition: 0, ch: "" };
  readChar(l);
  return l;
};

const readChar = (l: Lexer): void => {
  if (l.readPosition >= l.input.length) {
    l.ch = Token.EOF;
  } else {
    l.ch = l.input[l.readPosition];
  }
  l.position = l.readPosition;
  l.readPosition += 1;
};

const isValidStringChar = (ch: string): boolean =>
  ch !== Token.LBRACKET &&
  ch !== Token.RBRACKET &&
  ch !== Token.ENDOFLINE &&
  ch !== Token.EOF &&
  ch.length === 1;

const readLyric = (l: Lexer): string => {
  const position = l.position;
  while (isValidStringChar(l.ch)) {
    readChar(l);
  }
  return l.input.slice(position, l.position);
};

const readChord = (l: Lexer): Chord => {
  const position = l.position + 1;

  do {
    readChar(l);
    if (l.ch === Token.EOF || l.ch === Token.LBRACKET) {
      return {
        tag: "illegal",
        literal: l.input.slice(position, l.position),
      };
    }
  } while (l.ch !== Token.RBRACKET);

  return {
    tag: "valid",
    literal: l.input.slice(position, l.position),
  };
};

const newToken = (t: Token.TokenType, l: string): Token.Token => ({
  type: t,
  literal: l,
});

export const nextToken = (l: Lexer): Token.Token => {
  let tok = newToken(Token.EOF, Token.EOF);
  switch (l.ch) {
    case Token.EOF:
      tok = newToken(Token.EOF, l.ch);
      break;
    case Token.LBRACKET:
      const chordObj = readChord(l);
      switch (chordObj.tag) {
        case "valid":
          tok = newToken(Token.CHORD, chordObj.literal);
          readChar(l);
          return tok;
        case "illegal":
          tok = newToken(Token.ILLEGAL, chordObj.literal);
          return tok;
        default:
          const _exhaustiveCheck: never = chordObj;
          throw new Error(_exhaustiveCheck);
      }
    case Token.ENDOFLINE:
      tok = newToken(Token.ENDOFLINE, l.ch);
      break;
    default:
      if (isValidStringChar(l.ch)) {
        const s = readLyric(l);
        tok = newToken(Token.LYRIC, s);
        return tok;
      } else {
        tok = newToken(Token.ILLEGAL, l.ch);
        console.log("tok - ILLEGAL", tok);
      }
  }
  readChar(l);
  return tok;
};
