// import * as Program from "@/lib/songParser/ast/program";
import * as Evaluator from "@/lib/songParser/evaluator/evaluator";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Parser from "@/lib/songParser/parser/parser";

export const parseSong = (input: string) => {
  const l = Lexer.init(input);
  const p = Parser.init(l);
  const program = Parser.parseProgram(p);
  //   const actual = await Program.string(program);
  //   console.log("actual", actual);
  return Evaluator.evalNode(program);
};
