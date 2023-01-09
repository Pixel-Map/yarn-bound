declare class Text {
}
declare class Shortcut {
}
declare class Conditional {
}
declare class Assignment {
}
declare class Literal {
}
declare class Expression {
}
declare class FunctionCall {
}
declare class Command {
}
declare const _default: {
    types: {
        Text: typeof Text;
        Shortcut: typeof Shortcut;
        Conditional: typeof Conditional;
        Assignment: typeof Assignment;
        Literal: typeof Literal;
        Expression: typeof Expression;
        FunctionCall: typeof FunctionCall;
        Command: typeof Command;
    };
    DialogShortcutNode: {
        new (text: any, content: any, lineNo: any, hashtags: never[] | undefined, conditionalExpression: any): {};
    };
    IfNode: {
        new (expression: any, statement: any): {};
    };
    IfElseNode: {
        new (expression: any, statement: any, elseStatement: any): {};
    };
    ElseNode: {
        new (statement: any): {};
    };
    ElseIfNode: {
        new (expression: any, statement: any, elseStatement: any): {};
    };
    GenericCommandNode: {
        new (command: any, lineNo: any, hashtags?: never[]): {};
    };
    JumpCommandNode: {
        new (destination: any): {};
    };
    StopCommandNode: {
        new (): {};
    };
    TextNode: {
        new (text: any, lineNo: any, hashtags?: never[]): {};
    };
    EscapedCharacterNode: {
        new (text: any, lineNo: any, hashtags?: never[]): {};
    };
    NumericLiteralNode: {
        new (numericLiteral: any): {};
    };
    StringLiteralNode: {
        new (stringLiteral: any): {};
    };
    BooleanLiteralNode: {
        new (booleanLiteral: any): {};
    };
    VariableNode: {
        new (variableName: any): {};
    };
    UnaryMinusExpressionNode: {
        new (expression: any): {};
    };
    ArithmeticExpressionAddNode: {
        new (expression1: any, expression2: any): {};
    };
    ArithmeticExpressionMinusNode: {
        new (expression1: any, expression2: any): {};
    };
    ArithmeticExpressionMultiplyNode: {
        new (expression1: any, expression2: any): {};
    };
    ArithmeticExpressionExponentNode: {
        new (expression1: any, expression2: any): {};
    };
    ArithmeticExpressionDivideNode: {
        new (expression1: any, expression2: any): {};
    };
    ArithmeticExpressionModuloNode: {
        new (expression1: any, expression2: any): {};
    };
    NegatedBooleanExpressionNode: {
        new (expression: any): {};
    };
    BooleanOrExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    BooleanAndExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    BooleanXorExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    EqualToExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    NotEqualToExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    GreaterThanExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    GreaterThanOrEqualToExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    LessThanExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    LessThanOrEqualToExpressionNode: {
        new (expression1: any, expression2: any): {};
    };
    SetVariableEqualToNode: {
        new (variableName: any, expression: any): {};
    };
    FunctionCallNode: {
        new (functionName: any, args: any, lineNo: any, hashtags?: never[]): {};
    };
    InlineExpressionNode: {
        new (expression: any, lineNo: any, hashtags?: never[]): {};
    };
};
export default _default;
