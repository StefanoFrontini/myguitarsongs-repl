// import * as LyricExpression from "@/lib/songParser/ast/lyricExpression";
import * as Song from "@/lib/songParser/object/song";
import * as Token from "@/lib/songParser/token/token";

export type WordExpression = {
  tag: "wordExpression";
  token: Token.Token;
  value: [Song.Chord, Song.Lyric];
};

export const tokenLiteral = (p: WordExpression): string => p.token.literal;

export const string = (p: WordExpression): string => {
  let result = "(";
  result += tokenLiteral(p);
  if (p.value) {
    result += `${p.value[0]["value"] ? p.value[1]["value"] : ""}`;
  }
  result += ")";
  return result;
};
