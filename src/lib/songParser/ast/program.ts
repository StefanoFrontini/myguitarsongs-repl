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
  return result;
};
