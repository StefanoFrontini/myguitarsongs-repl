import * as ChordExpression from "@/lib/songParser/ast/chordExpression";
// import * as EndoflineExpression from "@/lib/songParser/ast/endoflineExpression";
// import * as InfixLineExpression from "@/lib/songParser/ast/infixLineExpression";
// import * as InfixWordExpression from "@/lib/songParser/ast/infixWordExpression";
import * as InfixExpression from "@/lib/songParser/ast/infixExpression";
import * as LyricExpression from "@/lib/songParser/ast/lyricExpression";
import * as WordExpression from "@/lib/songParser/ast/wordExpression";

export type Expression =
  | InfixExpression.InfixExpression
  // | InfixWordExpression.InfixWordExpression
  // | InfixLineExpression.InfixLineExpression
  | WordExpression.WordExpression
  | ChordExpression.ChordExpression
  | LyricExpression.LyricExpression;
// | EndoflineExpression.EndoflineExpression;

export const string = (e: Expression): string => {
  switch (e["tag"]) {
    // case "infixWordExpression":
    //   return InfixWordExpression.string(e);
    case "infixExpression":
      return InfixExpression.string(e);
    case "wordExpression":
      return WordExpression.string(e);
    case "chordExpression":
      return ChordExpression.string(e);
    case "lyricExpression":
      return LyricExpression.string(e);
    // case "infixLineExpression":
    //   return InfixLineExpression.string(e);
    // case "endoflineExpression":
    //   return EndoflineExpression.string(e);
    default:
      const _exhaustiveCheck: never = e;
      throw new Error(JSON.stringify(_exhaustiveCheck));
  }
};
