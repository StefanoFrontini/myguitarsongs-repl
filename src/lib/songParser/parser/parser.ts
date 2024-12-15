import * as ChordExpression from "@/lib/songParser/ast/chordExpression";
// import * as EndoflineExpression from "@/lib/songParser/ast/endoflineExpression";
import * as Expression from "@/lib/songParser/ast/expression";
import * as ExpressionStatement from "@/lib/songParser/ast/expressionStatement";
import * as LyricExpression from "@/lib/songParser/ast/lyricExpression";
import * as Program from "@/lib/songParser/ast/program";
import * as Statement from "@/lib/songParser/ast/statement";
import * as WordExpression from "@/lib/songParser/ast/wordExpression";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Token from "@/lib/songParser/token/token";

const LOWEST = 1,
  SUM = 2;

const precedences = new Map<Token.TokenType, number>([
  [Token.CHORD, SUM],
  [Token.ENDOFLINE, SUM],
  [Token.ILLEGAL, SUM],
]);

export type Parser = {
  l: Lexer.Lexer;
  curToken: Token.Token;
  peekToken: Token.Token;
  errors: string[];
  prefixParseFns: Map<
    Token.TokenType,
    (p: Parser) => Expression.Expression | null
  >;
  infixParseFns: Map<
    Token.TokenType,
    (p: Parser, left: Expression.Expression) => Expression.Expression
  >;
};

// const peekError = (p: Parser, tokenType: Token.TokenType): void => {
//   const msg = `expected next token to be ${tokenType}, got ${p.peekToken.type} instead`;
//   p.errors.push(msg);
// };
// const curTokenIs = (p: Parser, tokenType: Token.TokenType): boolean => {
//   return p.curToken.type === tokenType;
// };

const peekTokenIs = (p: Parser, tokenType: Token.TokenType): boolean => {
  return p.peekToken.type === tokenType;
};

const expectedPeek = (p: Parser, tokenType: Token.TokenType): boolean => {
  if (peekTokenIs(p, tokenType)) {
    // nextToken(p);
    return true;
  } else {
    // peekError(p, tokenType);
    return false;
  }
};

const peekPrecedence = (p: Parser): number => {
  if (!p.peekToken) return LOWEST;
  return precedences.get(p.peekToken.type) ?? LOWEST;
};

const curPrecedence = (p: Parser): number => {
  if (!p.curToken) return LOWEST;
  return precedences.get(p.curToken.type) ?? LOWEST;
};

const registerInfix = (
  p: Parser,
  tokenType: Token.TokenType,
  fn: (p: Parser, left: Expression.Expression) => Expression.Expression
): void => {
  p.infixParseFns.set(tokenType, fn);
};
const registerPrefix = (
  p: Parser,
  tokenType: Token.TokenType,
  fn: (p: Parser) => Expression.Expression
): void => {
  p.prefixParseFns.set(tokenType, fn);
};

const parseLyricExpression = (p: Parser): Expression.Expression => {
  return {
    tag: "lyricExpression",
    token: p.curToken,
    value: p.curToken.literal,
  } satisfies LyricExpression.LyricExpression;
};
const parseChordExpression = (p: Parser): Expression.Expression => {
  const token = p.curToken;
  const value = p.curToken.literal;
  if (!expectedPeek(p, Token.LYRIC)) {
    nextToken(p);
    return {
      tag: "chordExpression",
      token,
      value,
    } satisfies ChordExpression.ChordExpression;
  } else return parseWordExpression(p);
};

const parseInfixExpression = (
  p: Parser,
  left: Expression.Expression
): Expression.Expression => {
  const precedence = curPrecedence(p);
  let token;
  let operator;
  if (p.curToken.type === Token.ENDOFLINE) {
    token = p.curToken;
    operator = p.curToken.literal;
  } else {
    token = p.peekToken;
    operator = p.peekToken.type;
  }
  nextToken(p);
  const right = parseExpression(p, precedence);
  return {
    tag: "infixExpression",
    token,
    left,
    operator,
    right,
  } satisfies Expression.Expression;
};

export const init = (l: Lexer.Lexer): Parser => {
  const p: Parser = {
    l: l,
    curToken: Lexer.nextToken(l),
    peekToken: Lexer.nextToken(l),
    prefixParseFns: new Map<
      Token.TokenType,
      (p: Parser) => Expression.Expression
    >(),
    infixParseFns: new Map<
      Token.TokenType,
      (p: Parser, left: Expression.Expression) => Expression.Expression
    >(),
    errors: [],
  };
  registerPrefix(p, Token.CHORD, parseChordExpression);
  registerPrefix(p, Token.LYRIC, parseLyricExpression);
  registerInfix(p, Token.CHORD, parseInfixExpression);
  registerInfix(p, Token.ENDOFLINE, parseInfixExpression);
  return p;
};

export const nextToken = (p: Parser): void => {
  p.curToken = p.peekToken;
  p.peekToken = Lexer.nextToken(p.l);
};

const noPrefixParseFnError = (p: Parser, tokenType: Token.TokenType): void => {
  const msg = `no prefix parse function for ${tokenType} found`;
  p.errors.push(msg);
};

const parseWordExpression = (p: Parser): Expression.Expression => {
  const token = p.curToken;
  nextToken(p);
  return {
    tag: "wordExpression",
    token,
    right: {
      tag: "lyricExpression",
      token: p.curToken,
      value: p.curToken.literal,
    },
  } satisfies WordExpression.WordExpression;
};

const parseExpression = (
  p: Parser,
  precedence: number
): Expression.Expression | null => {
  const prefix = p.prefixParseFns.get(p.curToken.type);
  if (!prefix) {
    noPrefixParseFnError(p, p.curToken.type);
    return null;
  }
  let leftExp = prefix(p);
  if (leftExp === null) return null;

  while (!peekTokenIs(p, Token.EOF) && precedence < peekPrecedence(p)) {
    const infix = p.infixParseFns.get(p.peekToken.type);
    if (!infix) {
      return leftExp;
    }
    if (p.peekToken.type === Token.ENDOFLINE) {
      nextToken(p);
    }
    // nextToken(p);
    leftExp = infix(p, leftExp);
  }
  return leftExp;
};

const parseExpressionStatement = (
  p: Parser
): ExpressionStatement.ExpressionStatement => {
  return {
    tag: "expressionStatement",
    token: p.curToken,
    expression: parseExpression(p, LOWEST),
  } satisfies ExpressionStatement.ExpressionStatement;
};

const parseStatement = (p: Parser): Statement.Statement | null => {
  return parseExpressionStatement(p);
};

export const parseProgram = (p: Parser): Program.Program => {
  const program: Program.Program = {
    tag: "program",
    statements: [],
  };
  while (p.curToken.type !== Token.EOF) {
    const stmt = parseStatement(p);
    if (stmt) {
      program.statements.push(stmt);
    }
    nextToken(p);
  }
  return program;
};
