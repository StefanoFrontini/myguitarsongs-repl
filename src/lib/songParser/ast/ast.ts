import * as Expression from "@/lib/songParser/ast/expression";
import * as Program from "@/lib/songParser/ast/program";
import * as Statement from "@/lib/songParser/ast/statement";

export type Ast = Expression.Expression | Statement.Statement | Program.Program;
