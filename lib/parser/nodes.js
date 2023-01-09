// @ts-nocheck
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Text {
}
class Shortcut {
}
class Conditional {
}
class Assignment {
}
class Literal {
}
class Expression {
}
class FunctionCall {
}
class Command {
}
exports.default = {
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
        constructor(expression) {
            super();
            this.type = 'UnaryMinusExpressionNode';
            this.expression = expression;
        }
    },
    ArithmeticExpressionAddNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'ArithmeticExpressionAddNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    ArithmeticExpressionMinusNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'ArithmeticExpressionMinusNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    ArithmeticExpressionMultiplyNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'ArithmeticExpressionMultiplyNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    ArithmeticExpressionExponentNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'ArithmeticExpressionExponentNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    ArithmeticExpressionDivideNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'ArithmeticExpressionDivideNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    ArithmeticExpressionModuloNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'ArithmeticExpressionModuloNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    // /////////////// Boolean Expression Nodes
    NegatedBooleanExpressionNode: class extends Expression {
        constructor(expression) {
            super();
            this.type = 'NegatedBooleanExpressionNode';
            this.expression = expression;
        }
    },
    BooleanOrExpressionNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'BooleanOrExpressionNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    BooleanAndExpressionNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'BooleanAndExpressionNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
        }
    },
    BooleanXorExpressionNode: class extends Expression {
        constructor(expression1, expression2) {
            super();
            this.type = 'BooleanXorExpressionNode';
            this.expression1 = expression1;
            this.expression2 = expression2;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VyL25vZGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWM7QUFDZCxZQUFZLENBQUM7O0FBRWIsTUFBTSxJQUFJO0NBQUc7QUFDYixNQUFNLFFBQVE7Q0FBRztBQUNqQixNQUFNLFdBQVc7Q0FBRztBQUNwQixNQUFNLFVBQVU7Q0FBRztBQUNuQixNQUFNLE9BQU87Q0FBRztBQUNoQixNQUFNLFVBQVU7Q0FBRztBQUNuQixNQUFNLFlBQVk7Q0FBRztBQUNyQixNQUFNLE9BQU87Q0FBRztBQUVoQixrQkFBZTtJQUNiLEtBQUssRUFBRTtRQUNMLElBQUk7UUFDSixRQUFRO1FBQ1IsV0FBVztRQUNYLFVBQVU7UUFDVixPQUFPO1FBQ1AsVUFBVTtRQUNWLFlBQVk7UUFDWixPQUFPO0tBQ1I7SUFFRCwrQkFBK0I7SUFFL0Isa0JBQWtCLEVBQUUsS0FBTSxTQUFRLFFBQVE7UUFDeEMsWUFBWSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLHFCQUFxQjtZQUNyRSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsb0JBQW9CLENBQUM7WUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztRQUNyRCxDQUFDO0tBQ0Y7SUFFRCxvQ0FBb0M7SUFDcEMsTUFBTSxFQUFFLEtBQU0sU0FBUSxXQUFXO1FBQy9CLFlBQVksVUFBVSxFQUFFLFNBQVM7WUFDL0IsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMs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LENBQUM7WUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzNCLENBQUM7S0FDRjtJQUVELG9DQUFvQztJQUNwQyxvQkFBb0IsRUFBRSxLQUFNLFNBQVEsVUFBVTtRQUM1QyxZQUFZLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxHQUFHLEVBQUU7WUFDM0MsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLHNCQUFzQixDQUFDO1lBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUMzQixDQUFDO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLW5vY2hlY2tcbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgVGV4dCB7fVxuY2xhc3MgU2hvcnRjdXQge31cbmNsYXNzIENvbmRpdGlvbmFsIHt9XG5jbGFzcyBBc3NpZ25tZW50IHt9XG5jbGFzcyBMaXRlcmFsIHt9XG5jbGFzcyBFeHByZXNzaW9uIHt9XG5jbGFzcyBGdW5jdGlvbkNhbGwge31cbmNsYXNzIENvbW1hbmQge31cblxuZXhwb3J0IGRlZmF1bHQge1xuICB0eXBlczoge1xuICAgIFRleHQsXG4gICAgU2hvcnRjdXQsXG4gICAgQ29uZGl0aW9uYWwsXG4gICAgQXNzaWdubWVudCxcbiAgICBMaXRlcmFsLFxuICAgIEV4cHJlc3Npb24sXG4gICAgRnVuY3Rpb25DYWxsLFxuICAgIENvbW1hbmQsXG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIERpYWxvZyBOb2Rlc1xuXG4gIERpYWxvZ1Nob3J0Y3V0Tm9kZTogY2xhc3MgZXh0ZW5kcyBTaG9ydGN1dCB7XG4gICAgY29uc3RydWN0b3IodGV4dCwgY29udGVudCwgbGluZU5vLCBoYXNodGFncyA9IFtdLCBjb25kaXRpb25hbEV4cHJlc3Npb24pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnRGlhbG9nU2hvcnRjdXROb2RlJztcbiAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgICAgdGhpcy5saW5lTnVtID0gbGluZU5vLmZpcnN0X2xpbmU7XG4gICAgICB0aGlzLmhhc2h0YWdzID0gaGFzaHRhZ3M7XG4gICAgICB0aGlzLmNvbmRpdGlvbmFsRXhwcmVzc2lvbiA9IGNvbmRpdGlvbmFsRXhwcmVzc2lvbjtcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIENvbmRpdGlvbmFsIE5vZGVzXG4gIElmTm9kZTogY2xhc3MgZXh0ZW5kcyBDb25kaXRpb25hbCB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbiwgc3RhdGVtZW50KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0lmTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgdGhpcy5zdGF0ZW1lbnQgPSBzdGF0ZW1lbnQ7XG4gICAgfVxuICB9LFxuXG4gIElmRWxzZU5vZGU6IGNsYXNzIGV4dGVuZHMgQ29uZGl0aW9uYWwge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24sIHN0YXRlbWVudCwgZWxzZVN0YXRlbWVudCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdJZkVsc2VOb2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICB0aGlzLnN0YXRlbWVudCA9IHN0YXRlbWVudDtcbiAgICAgIHRoaXMuZWxzZVN0YXRlbWVudCA9IGVsc2VTdGF0ZW1lbnQ7XG4gICAgfVxuICB9LFxuXG4gIEVsc2VOb2RlOiBjbGFzcyBleHRlbmRzIENvbmRpdGlvbmFsIHtcbiAgICBjb25zdHJ1Y3RvcihzdGF0ZW1lbnQpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnRWxzZU5vZGUnO1xuICAgICAgdGhpcy5zdGF0ZW1lbnQgPSBzdGF0ZW1lbnQ7XG4gICAgfVxuICB9LFxuXG4gIEVsc2VJZk5vZGU6IGNsYXNzIGV4dGVuZHMgQ29uZGl0aW9uYWwge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24sIHN0YXRlbWVudCwgZWxzZVN0YXRlbWVudCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdFbHNlSWZOb2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICB0aGlzLnN0YXRlbWVudCA9IHN0YXRlbWVudDtcbiAgICAgIHRoaXMuZWxzZVN0YXRlbWVudCA9IGVsc2VTdGF0ZW1lbnQ7XG4gICAgfVxuICB9LFxuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLyBDb21tYW5kIE5vZGVzXG4gIEdlbmVyaWNDb21tYW5kTm9kZTogY2xhc3MgZXh0ZW5kcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kLCBsaW5lTm8sIGhhc2h0YWdzID0gW10pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnR2VuZXJpY0NvbW1hbmROb2RlJztcbiAgICAgIHRoaXMuY29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgICB0aGlzLmhhc2h0YWdzID0gaGFzaHRhZ3M7XG4gICAgICB0aGlzLmxpbmVOdW0gPSBsaW5lTm8uZmlyc3RfbGluZTtcbiAgICB9XG4gIH0sXG5cbiAgSnVtcENvbW1hbmROb2RlOiBjbGFzcyBleHRlbmRzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0p1bXBDb21tYW5kTm9kZSc7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgfVxuICB9LFxuXG4gIFN0b3BDb21tYW5kTm9kZTogY2xhc3MgZXh0ZW5kcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnU3RvcENvbW1hbmROb2RlJztcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIENvbnRlbnRzIE5vZGVzXG4gIFRleHROb2RlOiBjbGFzcyBleHRlbmRzIFRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRleHQsIGxpbmVObywgaGFzaHRhZ3MgPSBbXSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdUZXh0Tm9kZSc7XG4gICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgdGhpcy5saW5lTnVtID0gbGluZU5vLmZpcnN0X2xpbmU7XG4gICAgICB0aGlzLmhhc2h0YWdzID0gaGFzaHRhZ3M7XG4gICAgfVxuICB9LFxuXG4gIEVzY2FwZWRDaGFyYWN0ZXJOb2RlOiBjbGFzcyBleHRlbmRzIFRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRleHQsIGxpbmVObywgaGFzaHRhZ3MgPSBbXSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdFc2NhcGVkQ2hhcmFjdGVyTm9kZSc7XG4gICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgdGhpcy5saW5lTnVtID0gbGluZU5vLmZpcnN0X2xpbmU7XG4gICAgICB0aGlzLmhhc2h0YWdzID0gaGFzaHRhZ3M7XG4gICAgfVxuICB9LFxuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLyBMaXRlcmFsIE5vZGVzXG4gIE51bWVyaWNMaXRlcmFsTm9kZTogY2xhc3MgZXh0ZW5kcyBMaXRlcmFsIHtcbiAgICBjb25zdHJ1Y3RvcihudW1lcmljTGl0ZXJhbCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdOdW1lcmljTGl0ZXJhbE5vZGUnO1xuICAgICAgdGhpcy5udW1lcmljTGl0ZXJhbCA9IG51bWVyaWNMaXRlcmFsO1xuICAgIH1cbiAgfSxcblxuICBTdHJpbmdMaXRlcmFsTm9kZTogY2xhc3MgZXh0ZW5kcyBMaXRlcmFsIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmdMaXRlcmFsKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ1N0cmluZ0xpdGVyYWxOb2RlJztcbiAgICAgIHRoaXMuc3RyaW5nTGl0ZXJhbCA9IHN0cmluZ0xpdGVyYWw7XG4gICAgfVxuICB9LFxuXG4gIEJvb2xlYW5MaXRlcmFsTm9kZTogY2xhc3MgZXh0ZW5kcyBMaXRlcmFsIHtcbiAgICBjb25zdHJ1Y3Rvcihib29sZWFuTGl0ZXJhbCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdCb29sZWFuTGl0ZXJhbE5vZGUnO1xuICAgICAgdGhpcy5ib29sZWFuTGl0ZXJhbCA9IGJvb2xlYW5MaXRlcmFsO1xuICAgIH1cbiAgfSxcblxuICBWYXJpYWJsZU5vZGU6IGNsYXNzIGV4dGVuZHMgTGl0ZXJhbCB7XG4gICAgY29uc3RydWN0b3IodmFyaWFibGVOYW1lKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ1ZhcmlhYmxlTm9kZSc7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlTmFtZTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIEFyaXRobWV0aWMgRXhwcmVzc2lvbiBOb2Rlc1xuICBVbmFyeU1pbnVzRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdVbmFyeU1pbnVzRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICB9XG4gIH0sXG5cbiAgQXJpdGhtZXRpY0V4cHJlc3Npb25BZGROb2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24xLCBleHByZXNzaW9uMikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdBcml0aG1ldGljRXhwcmVzc2lvbkFkZE5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBBcml0aG1ldGljRXhwcmVzc2lvbk1pbnVzTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQXJpdGhtZXRpY0V4cHJlc3Npb25NaW51c05vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBBcml0aG1ldGljRXhwcmVzc2lvbk11bHRpcGx5Tm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQXJpdGhtZXRpY0V4cHJlc3Npb25NdWx0aXBseU5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBBcml0aG1ldGljRXhwcmVzc2lvbkV4cG9uZW50Tm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQXJpdGhtZXRpY0V4cHJlc3Npb25FeHBvbmVudE5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBBcml0aG1ldGljRXhwcmVzc2lvbkRpdmlkZU5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjEsIGV4cHJlc3Npb24yKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0FyaXRobWV0aWNFeHByZXNzaW9uRGl2aWRlTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24xID0gZXhwcmVzc2lvbjE7XG4gICAgICB0aGlzLmV4cHJlc3Npb24yID0gZXhwcmVzc2lvbjI7XG4gICAgfVxuICB9LFxuXG4gIEFyaXRobWV0aWNFeHByZXNzaW9uTW9kdWxvTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQXJpdGhtZXRpY0V4cHJlc3Npb25Nb2R1bG9Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjEgPSBleHByZXNzaW9uMTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjIgPSBleHByZXNzaW9uMjtcbiAgICB9XG4gIH0sXG4gIC8vIC8vLy8vLy8vLy8vLy8vLyBCb29sZWFuIEV4cHJlc3Npb24gTm9kZXNcblxuICBOZWdhdGVkQm9vbGVhbkV4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnTmVnYXRlZEJvb2xlYW5FeHByZXNzaW9uTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbiAgfSxcblxuICBCb29sZWFuT3JFeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQm9vbGVhbk9yRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBCb29sZWFuQW5kRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjEsIGV4cHJlc3Npb24yKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0Jvb2xlYW5BbmRFeHByZXNzaW9uTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24xID0gZXhwcmVzc2lvbjE7XG4gICAgICB0aGlzLmV4cHJlc3Npb24yID0gZXhwcmVzc2lvbjI7XG4gICAgfVxuICB9LFxuXG4gIEJvb2xlYW5Yb3JFeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQm9vbGVhblhvckV4cHJlc3Npb25Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjEgPSBleHByZXNzaW9uMTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjIgPSBleHByZXNzaW9uMjtcbiAgICB9XG4gIH0sXG5cbiAgRXF1YWxUb0V4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24xLCBleHByZXNzaW9uMikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdFcXVhbFRvRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBOb3RFcXVhbFRvRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjEsIGV4cHJlc3Npb24yKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ05vdEVxdWFsVG9FeHByZXNzaW9uTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24xID0gZXhwcmVzc2lvbjE7XG4gICAgICB0aGlzLmV4cHJlc3Npb24yID0gZXhwcmVzc2lvbjI7XG4gICAgfVxuICB9LFxuXG4gIEdyZWF0ZXJUaGFuRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjEsIGV4cHJlc3Npb24yKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0dyZWF0ZXJUaGFuRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBHcmVhdGVyVGhhbk9yRXF1YWxUb0V4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24xLCBleHByZXNzaW9uMikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdHcmVhdGVyVGhhbk9yRXF1YWxUb0V4cHJlc3Npb25Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjEgPSBleHByZXNzaW9uMTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjIgPSBleHByZXNzaW9uMjtcbiAgICB9XG4gIH0sXG5cbiAgTGVzc1RoYW5FeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnTGVzc1RoYW5FeHByZXNzaW9uTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24xID0gZXhwcmVzc2lvbjE7XG4gICAgICB0aGlzLmV4cHJlc3Npb24yID0gZXhwcmVzc2lvbjI7XG4gICAgfVxuICB9LFxuXG4gIExlc3NUaGFuT3JFcXVhbFRvRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjEsIGV4cHJlc3Npb24yKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0xlc3NUaGFuT3JFcXVhbFRvRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gQXNzaWdubWVudCBFeHByZXNzaW9uIE5vZGVzXG5cbiAgU2V0VmFyaWFibGVFcXVhbFRvTm9kZTogY2xhc3MgZXh0ZW5kcyBBc3NpZ25tZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih2YXJpYWJsZU5hbWUsIGV4cHJlc3Npb24pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnU2V0VmFyaWFibGVFcXVhbFRvTm9kZSc7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlTmFtZTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgfVxuICB9LFxuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLyBGdW5jdGlvbiBOb2Rlc1xuXG4gIEZ1bmN0aW9uQ2FsbE5vZGU6IGNsYXNzIGV4dGVuZHMgRnVuY3Rpb25DYWxsIHtcbiAgICBjb25zdHJ1Y3RvcihmdW5jdGlvbk5hbWUsIGFyZ3MsIGxpbmVObywgaGFzaHRhZ3MgPSBbXSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdGdW5jdGlvbkNhbGxOb2RlJztcbiAgICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lO1xuICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgIHRoaXMubGluZU51bSA9IGxpbmVOby5maXJzdF9saW5lO1xuICAgICAgdGhpcy5oYXNodGFncyA9IGhhc2h0YWdzO1xuICAgIH1cbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gSW5saW5lIEV4cHJlc3Npb25cbiAgSW5saW5lRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbiwgbGluZU5vLCBoYXNodGFncyA9IFtdKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0lubGluZUV4cHJlc3Npb25Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICB0aGlzLmxpbmVOdW0gPSBsaW5lTm8uZmlyc3RfbGluZTtcbiAgICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB9XG4gIH0sXG59O1xuIl19