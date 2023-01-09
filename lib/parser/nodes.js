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
        expression;
        constructor(expression) {
            super();
            this.expression = expression;
            this.type = 'UnaryMinusExpressionNode';
        }
    },
    ArithmeticExpressionAddNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'ArithmeticExpressionAddNode';
        }
    },
    ArithmeticExpressionMinusNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'ArithmeticExpressionMinusNode';
        }
    },
    ArithmeticExpressionMultiplyNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'ArithmeticExpressionMultiplyNode';
        }
    },
    ArithmeticExpressionExponentNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'ArithmeticExpressionExponentNode';
        }
    },
    ArithmeticExpressionDivideNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'ArithmeticExpressionDivideNode';
        }
    },
    ArithmeticExpressionModuloNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'ArithmeticExpressionModuloNode';
        }
    },
    // /////////////// Boolean Expression Nodes
    NegatedBooleanExpressionNode: class extends Expression {
        expression;
        constructor(expression) {
            super();
            this.expression = expression;
            this.type = 'NegatedBooleanExpressionNode';
        }
    },
    BooleanOrExpressionNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'BooleanOrExpressionNode';
        }
    },
    BooleanAndExpressionNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
            this.type = 'BooleanAndExpressionNode';
        }
    },
    BooleanXorExpressionNode: class extends Expression {
        expression1;
        expression2;
        constructor(expression1, expression2) {
            super();
            this.expression1 = expression1;
            this.expression2 = expression2;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VyL25vZGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWM7QUFDZCxZQUFZLENBQUM7O0FBRWIsTUFBTSxJQUFJO0NBQUc7QUFDYixNQUFNLFFBQVE7Q0FBRztBQUNqQixNQUFNLFdBQVc7Q0FBRztBQUNwQixNQUFNLFVBQVU7Q0FBRztBQUNuQixNQUFNLE9BQU87Q0FBRztBQUNoQixNQUFNLFVBQVU7Q0FBRztBQUNuQixNQUFNLFlBQVk7Q0FBRztBQUNyQixNQUFNLE9BQU87Q0FBRztBQUVoQixrQkFBZTtJQUNiLEtBQUssRUFBRTtRQUNMLElBQUk7UUFDSixRQUFRO1FBQ1IsV0FBVztRQUNYLFVBQVU7UUFDVixPQUFPO1FBQ1AsVUFBVTtRQUNWLFlBQVk7UUFDWixPQUFPO0tBQ1I7SUFFRCwrQkFBK0I7SUFFL0Isa0JBQWtCLEVBQUUsS0FBTSxTQUFRLFFBQVE7UUFDeEMsWUFBWSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLHFCQUFxQjtZQUNyRSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsb0JBQW9CLENBQUM7WUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztRQUNyRCxDQUFDO0tBQ0Y7SUFFRCxvQ0FBb0M7SUFDcEMsTUFBTSxFQUFFLEtBQU0sU0FBUSxXQUFXO1FBQy9CLFlBQVksVUFBVSxFQUFFLFNBQVM7WUFDL0IsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMs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QztZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDM0IsQ0FBQztLQUNGO0lBRUQsb0NBQW9DO0lBQ3BDLG9CQUFvQixFQUFFLEtBQU0sU0FBUSxVQUFVO1FBQzVDLFlBQVksVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEdBQUcsRUFBRTtZQUMzQyxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsc0JBQXNCLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzNCLENBQUM7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtbm9jaGVja1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBUZXh0IHt9XG5jbGFzcyBTaG9ydGN1dCB7fVxuY2xhc3MgQ29uZGl0aW9uYWwge31cbmNsYXNzIEFzc2lnbm1lbnQge31cbmNsYXNzIExpdGVyYWwge31cbmNsYXNzIEV4cHJlc3Npb24ge31cbmNsYXNzIEZ1bmN0aW9uQ2FsbCB7fVxuY2xhc3MgQ29tbWFuZCB7fVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHR5cGVzOiB7XG4gICAgVGV4dCxcbiAgICBTaG9ydGN1dCxcbiAgICBDb25kaXRpb25hbCxcbiAgICBBc3NpZ25tZW50LFxuICAgIExpdGVyYWwsXG4gICAgRXhwcmVzc2lvbixcbiAgICBGdW5jdGlvbkNhbGwsXG4gICAgQ29tbWFuZCxcbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gRGlhbG9nIE5vZGVzXG5cbiAgRGlhbG9nU2hvcnRjdXROb2RlOiBjbGFzcyBleHRlbmRzIFNob3J0Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0LCBjb250ZW50LCBsaW5lTm8sIGhhc2h0YWdzID0gW10sIGNvbmRpdGlvbmFsRXhwcmVzc2lvbikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdEaWFsb2dTaG9ydGN1dE5vZGUnO1xuICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG4gICAgICB0aGlzLmxpbmVOdW0gPSBsaW5lTm8uZmlyc3RfbGluZTtcbiAgICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICAgIHRoaXMuY29uZGl0aW9uYWxFeHByZXNzaW9uID0gY29uZGl0aW9uYWxFeHByZXNzaW9uO1xuICAgIH1cbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gQ29uZGl0aW9uYWwgTm9kZXNcbiAgSWZOb2RlOiBjbGFzcyBleHRlbmRzIENvbmRpdGlvbmFsIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uLCBzdGF0ZW1lbnQpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnSWZOb2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICB0aGlzLnN0YXRlbWVudCA9IHN0YXRlbWVudDtcbiAgICB9XG4gIH0sXG5cbiAgSWZFbHNlTm9kZTogY2xhc3MgZXh0ZW5kcyBDb25kaXRpb25hbCB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbiwgc3RhdGVtZW50LCBlbHNlU3RhdGVtZW50KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0lmRWxzZU5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgIHRoaXMuc3RhdGVtZW50ID0gc3RhdGVtZW50O1xuICAgICAgdGhpcy5lbHNlU3RhdGVtZW50ID0gZWxzZVN0YXRlbWVudDtcbiAgICB9XG4gIH0sXG5cbiAgRWxzZU5vZGU6IGNsYXNzIGV4dGVuZHMgQ29uZGl0aW9uYWwge1xuICAgIGNvbnN0cnVjdG9yKHN0YXRlbWVudCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdFbHNlTm9kZSc7XG4gICAgICB0aGlzLnN0YXRlbWVudCA9IHN0YXRlbWVudDtcbiAgICB9XG4gIH0sXG5cbiAgRWxzZUlmTm9kZTogY2xhc3MgZXh0ZW5kcyBDb25kaXRpb25hbCB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbiwgc3RhdGVtZW50LCBlbHNlU3RhdGVtZW50KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0Vsc2VJZk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgIHRoaXMuc3RhdGVtZW50ID0gc3RhdGVtZW50O1xuICAgICAgdGhpcy5lbHNlU3RhdGVtZW50ID0gZWxzZVN0YXRlbWVudDtcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIENvbW1hbmQgTm9kZXNcbiAgR2VuZXJpY0NvbW1hbmROb2RlOiBjbGFzcyBleHRlbmRzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKGNvbW1hbmQsIGxpbmVObywgaGFzaHRhZ3MgPSBbXSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdHZW5lcmljQ29tbWFuZE5vZGUnO1xuICAgICAgdGhpcy5jb21tYW5kID0gY29tbWFuZDtcbiAgICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICAgIHRoaXMubGluZU51bSA9IGxpbmVOby5maXJzdF9saW5lO1xuICAgIH1cbiAgfSxcblxuICBKdW1wQ29tbWFuZE5vZGU6IGNsYXNzIGV4dGVuZHMgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IoZGVzdGluYXRpb24pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnSnVtcENvbW1hbmROb2RlJztcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICB9XG4gIH0sXG5cbiAgU3RvcENvbW1hbmROb2RlOiBjbGFzcyBleHRlbmRzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdTdG9wQ29tbWFuZE5vZGUnO1xuICAgIH1cbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gQ29udGVudHMgTm9kZXNcbiAgVGV4dE5vZGU6IGNsYXNzIGV4dGVuZHMgVGV4dCB7XG4gICAgY29uc3RydWN0b3IodGV4dCwgbGluZU5vLCBoYXNodGFncyA9IFtdKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ1RleHROb2RlJztcbiAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICB0aGlzLmxpbmVOdW0gPSBsaW5lTm8uZmlyc3RfbGluZTtcbiAgICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB9XG4gIH0sXG5cbiAgRXNjYXBlZENoYXJhY3Rlck5vZGU6IGNsYXNzIGV4dGVuZHMgVGV4dCB7XG4gICAgY29uc3RydWN0b3IodGV4dCwgbGluZU5vLCBoYXNodGFncyA9IFtdKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0VzY2FwZWRDaGFyYWN0ZXJOb2RlJztcbiAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICB0aGlzLmxpbmVOdW0gPSBsaW5lTm8uZmlyc3RfbGluZTtcbiAgICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIExpdGVyYWwgTm9kZXNcbiAgTnVtZXJpY0xpdGVyYWxOb2RlOiBjbGFzcyBleHRlbmRzIExpdGVyYWwge1xuICAgIGNvbnN0cnVjdG9yKG51bWVyaWNMaXRlcmFsKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ051bWVyaWNMaXRlcmFsTm9kZSc7XG4gICAgICB0aGlzLm51bWVyaWNMaXRlcmFsID0gbnVtZXJpY0xpdGVyYWw7XG4gICAgfVxuICB9LFxuXG4gIFN0cmluZ0xpdGVyYWxOb2RlOiBjbGFzcyBleHRlbmRzIExpdGVyYWwge1xuICAgIGNvbnN0cnVjdG9yKHN0cmluZ0xpdGVyYWwpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnU3RyaW5nTGl0ZXJhbE5vZGUnO1xuICAgICAgdGhpcy5zdHJpbmdMaXRlcmFsID0gc3RyaW5nTGl0ZXJhbDtcbiAgICB9XG4gIH0sXG5cbiAgQm9vbGVhbkxpdGVyYWxOb2RlOiBjbGFzcyBleHRlbmRzIExpdGVyYWwge1xuICAgIGNvbnN0cnVjdG9yKGJvb2xlYW5MaXRlcmFsKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0Jvb2xlYW5MaXRlcmFsTm9kZSc7XG4gICAgICB0aGlzLmJvb2xlYW5MaXRlcmFsID0gYm9vbGVhbkxpdGVyYWw7XG4gICAgfVxuICB9LFxuXG4gIFZhcmlhYmxlTm9kZTogY2xhc3MgZXh0ZW5kcyBMaXRlcmFsIHtcbiAgICBjb25zdHJ1Y3Rvcih2YXJpYWJsZU5hbWUpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnVmFyaWFibGVOb2RlJztcbiAgICAgIHRoaXMudmFyaWFibGVOYW1lID0gdmFyaWFibGVOYW1lO1xuICAgIH1cbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gQXJpdGhtZXRpYyBFeHByZXNzaW9uIE5vZGVzXG4gIFVuYXJ5TWludXNFeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ1VuYXJ5TWludXNFeHByZXNzaW9uTm9kZSc7XG4gICAgfVxuICB9LFxuXG4gIEFyaXRobWV0aWNFeHByZXNzaW9uQWRkTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uMTogRXhwcmVzc2lvbiwgcmVhZG9ubHkgZXhwcmVzc2lvbjI6IEV4cHJlc3Npb24pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQXJpdGhtZXRpY0V4cHJlc3Npb25BZGROb2RlJztcbiAgICB9XG4gIH0sXG5cbiAgQXJpdGhtZXRpY0V4cHJlc3Npb25NaW51c05vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbjE6IEV4cHJlc3Npb24sIHJlYWRvbmx5IGV4cHJlc3Npb24yOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0FyaXRobWV0aWNFeHByZXNzaW9uTWludXNOb2RlJztcbiAgICB9XG4gIH0sXG5cbiAgQXJpdGhtZXRpY0V4cHJlc3Npb25NdWx0aXBseU5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbjE6IEV4cHJlc3Npb24sIHJlYWRvbmx5IGV4cHJlc3Npb24yOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0FyaXRobWV0aWNFeHByZXNzaW9uTXVsdGlwbHlOb2RlJztcbiAgICB9XG4gIH0sXG5cbiAgQXJpdGhtZXRpY0V4cHJlc3Npb25FeHBvbmVudE5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbjE6IEV4cHJlc3Npb24sIHJlYWRvbmx5IGV4cHJlc3Npb24yOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0FyaXRobWV0aWNFeHByZXNzaW9uRXhwb25lbnROb2RlJztcbiAgICB9XG4gIH0sXG5cbiAgQXJpdGhtZXRpY0V4cHJlc3Npb25EaXZpZGVOb2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGV4cHJlc3Npb24xOiBFeHByZXNzaW9uLCByZWFkb25seSBleHByZXNzaW9uMjogRXhwcmVzc2lvbikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdBcml0aG1ldGljRXhwcmVzc2lvbkRpdmlkZU5vZGUnO1xuICAgIH1cbiAgfSxcblxuICBBcml0aG1ldGljRXhwcmVzc2lvbk1vZHVsb05vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbjE6IEV4cHJlc3Npb24sIHJlYWRvbmx5IGV4cHJlc3Npb24yOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0FyaXRobWV0aWNFeHByZXNzaW9uTW9kdWxvTm9kZSc7XG4gICAgfVxuICB9LFxuICAvLyAvLy8vLy8vLy8vLy8vLy8gQm9vbGVhbiBFeHByZXNzaW9uIE5vZGVzXG5cbiAgTmVnYXRlZEJvb2xlYW5FeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ05lZ2F0ZWRCb29sZWFuRXhwcmVzc2lvbk5vZGUnO1xuICAgIH1cbiAgfSxcblxuICBCb29sZWFuT3JFeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uMTogRXhwcmVzc2lvbiwgcmVhZG9ubHkgZXhwcmVzc2lvbjI6IEV4cHJlc3Npb24pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnQm9vbGVhbk9yRXhwcmVzc2lvbk5vZGUnO1xuICAgIH1cbiAgfSxcblxuICBCb29sZWFuQW5kRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbjE6IEV4cHJlc3Npb24sIHJlYWRvbmx5IGV4cHJlc3Npb24yOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0Jvb2xlYW5BbmRFeHByZXNzaW9uTm9kZSc7XG4gICAgfVxuICB9LFxuICBCb29sZWFuWG9yRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbjE6IEV4cHJlc3Npb24sIHJlYWRvbmx5IGV4cHJlc3Npb24yOiBFeHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0Jvb2xlYW5Yb3JFeHByZXNzaW9uTm9kZSc7XG4gICAgfVxuICB9LFxuXG4gIEVxdWFsVG9FeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnRXF1YWxUb0V4cHJlc3Npb25Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjEgPSBleHByZXNzaW9uMTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjIgPSBleHByZXNzaW9uMjtcbiAgICB9XG4gIH0sXG5cbiAgTm90RXF1YWxUb0V4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24xLCBleHByZXNzaW9uMikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdOb3RFcXVhbFRvRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBHcmVhdGVyVGhhbkV4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24xLCBleHByZXNzaW9uMikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdHcmVhdGVyVGhhbkV4cHJlc3Npb25Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjEgPSBleHByZXNzaW9uMTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjIgPSBleHByZXNzaW9uMjtcbiAgICB9XG4gIH0sXG5cbiAgR3JlYXRlclRoYW5PckVxdWFsVG9FeHByZXNzaW9uTm9kZTogY2xhc3MgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uMSwgZXhwcmVzc2lvbjIpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnR3JlYXRlclRoYW5PckVxdWFsVG9FeHByZXNzaW9uTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24xID0gZXhwcmVzc2lvbjE7XG4gICAgICB0aGlzLmV4cHJlc3Npb24yID0gZXhwcmVzc2lvbjI7XG4gICAgfVxuICB9LFxuXG4gIExlc3NUaGFuRXhwcmVzc2lvbk5vZGU6IGNsYXNzIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjEsIGV4cHJlc3Npb24yKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ0xlc3NUaGFuRXhwcmVzc2lvbk5vZGUnO1xuICAgICAgdGhpcy5leHByZXNzaW9uMSA9IGV4cHJlc3Npb24xO1xuICAgICAgdGhpcy5leHByZXNzaW9uMiA9IGV4cHJlc3Npb24yO1xuICAgIH1cbiAgfSxcblxuICBMZXNzVGhhbk9yRXF1YWxUb0V4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24xLCBleHByZXNzaW9uMikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdMZXNzVGhhbk9yRXF1YWxUb0V4cHJlc3Npb25Ob2RlJztcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjEgPSBleHByZXNzaW9uMTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbjIgPSBleHByZXNzaW9uMjtcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIEFzc2lnbm1lbnQgRXhwcmVzc2lvbiBOb2Rlc1xuXG4gIFNldFZhcmlhYmxlRXF1YWxUb05vZGU6IGNsYXNzIGV4dGVuZHMgQXNzaWdubWVudCB7XG4gICAgY29uc3RydWN0b3IodmFyaWFibGVOYW1lLCBleHByZXNzaW9uKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50eXBlID0gJ1NldFZhcmlhYmxlRXF1YWxUb05vZGUnO1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWUgPSB2YXJpYWJsZU5hbWU7XG4gICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbiAgfSxcblxuICAvLyAvLy8vLy8vLy8vLy8vLy8gRnVuY3Rpb24gTm9kZXNcblxuICBGdW5jdGlvbkNhbGxOb2RlOiBjbGFzcyBleHRlbmRzIEZ1bmN0aW9uQ2FsbCB7XG4gICAgY29uc3RydWN0b3IoZnVuY3Rpb25OYW1lLCBhcmdzLCBsaW5lTm8sIGhhc2h0YWdzID0gW10pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnR5cGUgPSAnRnVuY3Rpb25DYWxsTm9kZSc7XG4gICAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uTmFtZTtcbiAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICB0aGlzLmxpbmVOdW0gPSBsaW5lTm8uZmlyc3RfbGluZTtcbiAgICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB9XG4gIH0sXG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIElubGluZSBFeHByZXNzaW9uXG4gIElubGluZUV4cHJlc3Npb25Ob2RlOiBjbGFzcyBleHRlbmRzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24sIGxpbmVObywgaGFzaHRhZ3MgPSBbXSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudHlwZSA9ICdJbmxpbmVFeHByZXNzaW9uTm9kZSc7XG4gICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgdGhpcy5saW5lTnVtID0gbGluZU5vLmZpcnN0X2xpbmU7XG4gICAgICB0aGlzLmhhc2h0YWdzID0gaGFzaHRhZ3M7XG4gICAgfVxuICB9LFxufTtcbiJdfQ==