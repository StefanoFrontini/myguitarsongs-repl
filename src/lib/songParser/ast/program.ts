import * as Statement from "@/lib/songParser/ast/statement";
export type Program = {
  tag: "program";
  statements: Statement.Statement[];
};
export const tokenLiteral = (p: Program): string => {
  if (p.statements.length > 0) {
    return Statement.tokenLiteral(p.statements[0]);
  } else {
    return "";
  }
};

export const string = (p: Program): string => {
  let result = "";
  for (const s of p.statements) {
    result += Statement.string(s);
  }
  // const readableStream = Readable.from([""]);
  // for (const s of p.statements) {
  //   readableStream.push(await Statement.string(s));
  // }
  // let result = "";
  // for await (const chunk of readableStream) {
  //   result += chunk;
  // }
  return result;
};
