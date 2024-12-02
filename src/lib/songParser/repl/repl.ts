import * as Evaluator from "@/lib/songParser/evaluator/evaluator";
import * as Lexer from "@/lib/songParser/lexer/lexer";
import * as Parser from "@/lib/songParser/parser/parser";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({ input, output });
const PROMPT = ">> ";

const printParserErrors = (errors: string[]): void => {
  for (const msg of errors) {
    console.error("parser errors: ", msg);
  }
};

export const start = async (): Promise<void> => {
  while (true) {
    const line = await rl.question(PROMPT);
    const l = Lexer.init(line);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    if (p.errors.length !== 0) {
      printParserErrors(p.errors);
      continue;
    }
    const evaluated = Evaluator.evalNode(program);
    if (evaluated) {
      console.log(evaluated);
    }
  }
};
