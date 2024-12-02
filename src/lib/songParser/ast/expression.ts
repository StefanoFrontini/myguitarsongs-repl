import * as ChordLiteral from "@/lib/songParser/ast/chordLiteral";
import * as EndoflineLiteral from "@/lib/songParser/ast/endoflineLiteral";
import * as ErrorLiteral from "@/lib/songParser/ast/errorLiteral";
import * as InfixExpression from "@/lib/songParser/ast/infixExpression";
import * as StringLiteral from "@/lib/songParser/ast/stringLiteral";
import { Readable } from "stream";

export type t =
  | ChordLiteral.t
  | InfixExpression.t
  | StringLiteral.t
  | EndoflineLiteral.t
  | ErrorLiteral.t;

export const string = async (e: t): Promise<string> => {
  let stringExpr = "";
  switch (e["tag"]) {
    case "infixExpression":
      stringExpr = await InfixExpression.string(e);
      break;
    case "stringLiteral":
      stringExpr = StringLiteral.string(e);
      break;
    case "chordLiteral":
      stringExpr = ChordLiteral.string(e);
      break;
    case "endoflineLiteral":
      stringExpr = EndoflineLiteral.string(e);
      break;
    case "errorLiteral":
      stringExpr = ErrorLiteral.string(e);
      break;
    default:
      const _exhaustiveCheck: never = e;
      throw new Error(_exhaustiveCheck);
  }
  const readableStream = Readable.from([""]);
  readableStream.push(stringExpr);
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
