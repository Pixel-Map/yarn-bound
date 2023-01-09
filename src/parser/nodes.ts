// @ts-nocheck
'use strict';

class Text {}
class Shortcut {}
class Conditional {}
class Assignment {}
class Literal {}
class Expression {}
class FunctionCall {}
class Command {}

export default {
  types: {
    Text,
    Shortcut,
    Conditional,
    Assignment,
    Literal,
    Expression,
    FunctionCall,
    Command,
  },

  // /////////////// Dialog Nodes

  DialogShortcutNode: class extends Shortcut {
    constructor(text, content, lineNo, hashtags = [], conditionalExpression) {
      super();
      this.type = 'DialogShortcutNode';
      this.text = text;
      this.content = content;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
      this.conditionalExpression = conditionalExpression;
    }
  },

  // /////////////// Conditional Nodes
  IfNode: class extends Conditional {
    constructor(expression, statement) {
      super();
      this.type = 'IfNode';
      this.expression = expression;
      this.statement = statement;
    }
  },

  IfElseNode: class extends Conditional {
    constructor(expression, statement, elseStatement) {
      super();
      this.type = 'IfElseNode';
      this.expression = expression;
      this.statement = statement;
      this.elseStatement = elseStatement;
    }
  },

  ElseNode: class extends Conditional {
    constructor(statement) {
      super();
      this.type = 'ElseNode';
      this.statement = statement;
    }
  },

  ElseIfNode: class extends Conditional {
    constructor(expression, statement, elseStatement) {
      super();
      this.type = 'ElseIfNode';
      this.expression = expression;
      this.statement = statement;
      this.elseStatement = elseStatement;
    }
  },

  // /////////////// Command Nodes
  GenericCommandNode: class extends Command {
    constructor(command, lineNo, hashtags = []) {
      super();
      this.type = 'GenericCommandNode';
      this.command = command;
      this.hashtags = hashtags;
      this.lineNum = lineNo.first_line;
    }
  },

  JumpCommandNode: class extends Command {
    constructor(destination) {
      super();
      this.type = 'JumpCommandNode';
      this.destination = destination;
    }
  },

  StopCommandNode: class extends Command {
    constructor() {
      super();
      this.type = 'StopCommandNode';
    }
  },

  // /////////////// Contents Nodes
  TextNode: class extends Text {
    constructor(text, lineNo, hashtags = []) {
      super();
      this.type = 'TextNode';
      this.text = text;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },

  EscapedCharacterNode: class extends Text {
    constructor(text, lineNo, hashtags = []) {
      super();
      this.type = 'EscapedCharacterNode';
      this.text = text;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },

  // /////////////// Literal Nodes
  NumericLiteralNode: class extends Literal {
    constructor(numericLiteral) {
      super();
      this.type = 'NumericLiteralNode';
      this.numericLiteral = numericLiteral;
    }
  },

  StringLiteralNode: class extends Literal {
    constructor(stringLiteral) {
      super();
      this.type = 'StringLiteralNode';
      this.stringLiteral = stringLiteral;
    }
  },

  BooleanLiteralNode: class extends Literal {
    constructor(booleanLiteral) {
      super();
      this.type = 'BooleanLiteralNode';
      this.booleanLiteral = booleanLiteral;
    }
  },

  VariableNode: class extends Literal {
    constructor(variableName) {
      super();
      this.type = 'VariableNode';
      this.variableName = variableName;
    }
  },

  // /////////////// Arithmetic Expression Nodes
  UnaryMinusExpressionNode: class extends Expression {
    constructor(readonly expression: Expression) {
      super();
      this.type = 'UnaryMinusExpressionNode';
    }
  },

  ArithmeticExpressionAddNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'ArithmeticExpressionAddNode';
    }
  },

  ArithmeticExpressionMinusNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'ArithmeticExpressionMinusNode';
    }
  },

  ArithmeticExpressionMultiplyNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'ArithmeticExpressionMultiplyNode';
    }
  },

  ArithmeticExpressionExponentNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'ArithmeticExpressionExponentNode';
    }
  },

  ArithmeticExpressionDivideNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'ArithmeticExpressionDivideNode';
    }
  },

  ArithmeticExpressionModuloNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'ArithmeticExpressionModuloNode';
    }
  },
  // /////////////// Boolean Expression Nodes

  NegatedBooleanExpressionNode: class extends Expression {
    constructor(readonly expression: Expression) {
      super();
      this.type = 'NegatedBooleanExpressionNode';
    }
  },

  BooleanOrExpressionNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'BooleanOrExpressionNode';
    }
  },

  BooleanAndExpressionNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'BooleanAndExpressionNode';
    }
  },
  BooleanXorExpressionNode: class extends Expression {
    constructor(readonly expression1: Expression, readonly expression2: Expression) {
      super();
      this.type = 'BooleanXorExpressionNode';
    }
  },

  EqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'EqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },

  NotEqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'NotEqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },

  GreaterThanExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'GreaterThanExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },

  GreaterThanOrEqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'GreaterThanOrEqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },

  LessThanExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'LessThanExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },

  LessThanOrEqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'LessThanOrEqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },

  // /////////////// Assignment Expression Nodes

  SetVariableEqualToNode: class extends Assignment {
    constructor(variableName, expression) {
      super();
      this.type = 'SetVariableEqualToNode';
      this.variableName = variableName;
      this.expression = expression;
    }
  },

  // /////////////// Function Nodes

  FunctionCallNode: class extends FunctionCall {
    constructor(functionName, args, lineNo, hashtags = []) {
      super();
      this.type = 'FunctionCallNode';
      this.functionName = functionName;
      this.args = args;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },

  // /////////////// Inline Expression
  InlineExpressionNode: class extends Expression {
    constructor(expression, lineNo, hashtags = []) {
      super();
      this.type = 'InlineExpressionNode';
      this.expression = expression;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },
};
