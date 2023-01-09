// @ts-nocheck
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = __importDefault(require("../lexer/lexer"));
const compiled_parser_1 = require("./compiled-parser");
const nodes_1 = __importDefault(require("./nodes"));
compiled_parser_1.parser.lexer = new lexer_1.default();
compiled_parser_1.parser.yy = nodes_1.default;
compiled_parser_1.parser.yy.declarations = {};
compiled_parser_1.parser.yy.parseError = function parseError(e) {
    throw e;
};
compiled_parser_1.parser.yy.registerDeclaration = function registerDeclaration(variableName, expression, explicitType) {
    if (!this.areDeclarationsHandled) {
        if (this.declarations[variableName]) {
            throw new Error(`Duplicate declaration found for variable: ${variableName}`);
        }
        this.declarations[variableName] = {
            variableName,
            expression,
            explicitType,
        };
    }
};
exports.default = compiled_parser_1.parser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BhcnNlci9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYztBQUNkLFlBQVksQ0FBQzs7Ozs7QUFFYiwyREFBbUM7QUFDbkMsdURBQTJDO0FBQzNDLG9EQUE0QjtBQUU1Qix3QkFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBQzNCLHdCQUFNLENBQUMsRUFBRSxHQUFHLGVBQUssQ0FBQztBQUNsQix3QkFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQzVCLHdCQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxDQUFDO0FBQ1YsQ0FBQyxDQUFDO0FBQ0Ysd0JBQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFlBQVk7SUFDakcsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtRQUNoQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsWUFBWSxFQUFFLENBQUMsQ0FBQztTQUM5RTtRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUc7WUFDaEMsWUFBWTtZQUNaLFVBQVU7WUFDVixZQUFZO1NBQ2IsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsd0JBQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1ub2NoZWNrXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBMZXhlciBmcm9tICcuLi9sZXhlci9sZXhlcic7XG5pbXBvcnQgeyBwYXJzZXIgfSBmcm9tICcuL2NvbXBpbGVkLXBhcnNlcic7XG5pbXBvcnQgTm9kZXMgZnJvbSAnLi9ub2Rlcyc7XG5cbnBhcnNlci5sZXhlciA9IG5ldyBMZXhlcigpO1xucGFyc2VyLnl5ID0gTm9kZXM7XG5wYXJzZXIueXkuZGVjbGFyYXRpb25zID0ge307XG5wYXJzZXIueXkucGFyc2VFcnJvciA9IGZ1bmN0aW9uIHBhcnNlRXJyb3IoZSkge1xuICB0aHJvdyBlO1xufTtcbnBhcnNlci55eS5yZWdpc3RlckRlY2xhcmF0aW9uID0gZnVuY3Rpb24gcmVnaXN0ZXJEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWUsIGV4cHJlc3Npb24sIGV4cGxpY2l0VHlwZSkge1xuICBpZiAoIXRoaXMuYXJlRGVjbGFyYXRpb25zSGFuZGxlZCkge1xuICAgIGlmICh0aGlzLmRlY2xhcmF0aW9uc1t2YXJpYWJsZU5hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBkZWNsYXJhdGlvbiBmb3VuZCBmb3IgdmFyaWFibGU6ICR7dmFyaWFibGVOYW1lfWApO1xuICAgIH1cbiAgICB0aGlzLmRlY2xhcmF0aW9uc1t2YXJpYWJsZU5hbWVdID0ge1xuICAgICAgdmFyaWFibGVOYW1lLFxuICAgICAgZXhwcmVzc2lvbixcbiAgICAgIGV4cGxpY2l0VHlwZSxcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwYXJzZXI7XG4iXX0=