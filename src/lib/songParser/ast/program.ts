import * as Statement from "@/lib/songParser/ast/statement";
import { Readable } from "stream";
export type t = {
  tag: "program";
  statements: Statement.t[];
};
export const tokenLiteral = (p: t): string => {
  if (p.statements.length > 0) {
    return Statement.tokenLiteral(p.statements[0]);
  } else {
    return "";
  }
};

export const string = async (p: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  for (const s of p.statements) {
    readableStream.push(await Statement.string(s));
  }
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
