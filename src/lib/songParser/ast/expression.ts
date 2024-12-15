import * as ChordExpression from "@/lib/songParser/ast/chordExpression";
import * as InfixExpression from "@/lib/songParser/ast/infixExpression";
import * as LyricExpression from "@/lib/songParser/ast/lyricExpression";
import * as WordExpression from "@/lib/songParser/ast/wordExpression";

export type Expression =
  | InfixExpression.InfixExpression
  | WordExpression.WordExpression
  | ChordExpression.ChordExpression
  | LyricExpression.LyricExpression;

export const string = (e: Expression): string => {
  switch (e["tag"]) {
    case "infixExpression":
      return InfixExpression.string(e);
    case "wordExpression":
      return WordExpression.string(e);
    case "chordExpression":
      return ChordExpression.string(e);
    case "lyricExpression":
      return LyricExpression.string(e);
    default:
      const _exhaustiveCheck: never = e;
      throw new Error(JSON.stringify(_exhaustiveCheck));
  }
};
