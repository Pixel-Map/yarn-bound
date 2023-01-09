// @ts-nocheck
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Token identifier -> regular expression to match the lexeme. That's a list of all the token
 * which can be emitted by the lexer. For now, we're slightly bending the style guide,
 * to make sure the debug output of the javascript lexer will (kinda) match the original C# one.
 */
/* eslint-disable key-spacing */
const Tokens = {
    // Special tokens
    Whitespace: null,
    Indent: null,
    Dedent: null,
    EndOfLine: /\n/,
    EndOfInput: null,
    // Literals in ("<<commands>>")
    Number: /-?[0-9]+(\.[0-9+])?/,
    String: /"([^"\\]*(?:\\.[^"\\]*)*)"/,
    // Command syntax ("<<foo>>")
    BeginCommand: /<</,
    EndCommand: />>/,
    // Variables ("$foo")
    Variable: /\$([A-Za-z0-9_.])+/,
    // Shortcut syntax ("->")
    ShortcutOption: /->/,
    // Hashtag ("#something")
    Hashtag: /#([^(\s|#|//)]+)/,
    // Comment ("// some stuff")
    Comment: /\/\/.*/,
    // Option syntax ("[[Let's go here|Destination]]")
    OptionStart: /\[\[/,
    OptionDelimit: /\|/,
    OptionEnd: /\]\]/,
    // Command types (specially recognized command word)
    If: /if(?!\w)/,
    ElseIf: /elseif(?!\w)/,
    Else: /else(?!\w)/,
    EndIf: /endif(?!\w)/,
    Jump: /jump(?!\w)/,
    Stop: /stop(?!\w)/,
    Set: /set(?!\w)/,
    Declare: /declare(?!\w)/,
    As: /as(?!\w)/,
    ExplicitType: /(String|Number|Bool)(?=>>)/,
    // Boolean values
    True: /true(?!\w)/,
    False: /false(?!\w)/,
    // The null value
    Null: /null(?!\w)/,
    // Parentheses
    LeftParen: /\(/,
    RightParen: /\)/,
    // Parameter delimiters
    Comma: /,/,
    // Operators
    UnaryMinus: /-(?!\s)/,
    EqualTo: /(==|is(?!\w)|eq(?!\w))/,
    GreaterThan: /(>|gt(?!\w))/,
    GreaterThanOrEqualTo: /(>=|gte(?!\w))/,
    LessThan: /(<|lt(?!\w))/,
    LessThanOrEqualTo: /(<=|lte(?!\w))/,
    NotEqualTo: /(!=|neq(?!\w))/,
    // Logical operators
    Or: /(\|\||or(?!\w))/,
    And: /(&&|and(?!\w))/,
    Xor: /(\^|xor(?!\w))/,
    Not: /(!|not(?!\w))/,
    // this guy's special because '=' can mean either 'equal to'
    // or 'becomes' depending on context
    EqualToOrAssign: /(=|to(?!\w))/,
    Add: /\+/,
    Minus: /-/,
    Exponent: /\*\*/,
    Multiply: /\*/,
    Divide: /\//,
    Modulo: /%/,
    AddAssign: /\+=/,
    MinusAssign: /-=/,
    MultiplyAssign: /\*=/,
    DivideAssign: /\/=/,
    Identifier: /[a-zA-Z0-9_:.]+/,
    EscapedCharacter: /\\./,
    Text: /[^\\]/,
    // Braces are used for inline expressions. Ignore escaped braces
    // TODO: doesn't work ios
    BeginInlineExp: /{/,
    EndInlineExp: /}/, // }
};
/* eslint-enable key-spacing */
exports.default = Tokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xleGVyL3Rva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxjQUFjO0FBQ2QsWUFBWSxDQUFDOztBQUViOzs7O0dBSUc7QUFDSCxnQ0FBZ0M7QUFDaEMsTUFBTSxNQUFNLEdBQUc7SUFDYixpQkFBaUI7SUFDakIsVUFBVSxFQUFFLElBQUk7SUFDaEIsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUNaLFNBQVMsRUFBRSxJQUFJO0lBQ2YsVUFBVSxFQUFFLElBQUk7SUFFaEIsK0JBQStCO0lBQy9CLE1BQU0sRUFBRSxxQkFBcUI7SUFDN0IsTUFBTSxFQUFFLDRCQUE0QjtJQUVwQyw2QkFBNkI7SUFDN0IsWUFBWSxFQUFFLElBQUk7SUFDbEIsVUFBVSxFQUFFLElBQUk7SUFFaEIscUJBQXFCO0lBQ3JCLFFBQVEsRUFBRSxvQkFBb0I7SUFFOUIseUJBQXlCO0lBQ3pCLGNBQWMsRUFBRSxJQUFJO0lBRXBCLHlCQUF5QjtJQUN6QixPQUFPLEVBQUUsa0JBQWtCO0lBRTNCLDRCQUE0QjtJQUM1QixPQUFPLEVBQUUsUUFBUTtJQUVqQixrREFBa0Q7SUFDbEQsV0FBVyxFQUFFLE1BQU07SUFDbkIsYUFBYSxFQUFFLElBQUk7SUFDbkIsU0FBUyxFQUFFLE1BQU07SUFFakIsb0RBQW9EO0lBQ3BELEVBQUUsRUFBRSxVQUFVO0lBQ2QsTUFBTSxFQUFFLGNBQWM7SUFDdEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsS0FBSyxFQUFFLGFBQWE7SUFDcEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsR0FBRyxFQUFFLFdBQVc7SUFDaEIsT0FBTyxFQUFFLGVBQWU7SUFDeEIsRUFBRSxFQUFFLFVBQVU7SUFDZCxZQUFZLEVBQUUsNEJBQTRCO0lBRTFDLGlCQUFpQjtJQUNqQixJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUVwQixpQkFBaUI7SUFDakIsSUFBSSxFQUFFLFlBQVk7SUFFbEIsY0FBYztJQUNkLFNBQVMsRUFBRSxJQUFJO0lBQ2YsVUFBVSxFQUFFLElBQUk7SUFFaEIsdUJBQXVCO0lBQ3ZCLEtBQUssRUFBRSxHQUFHO0lBRVYsWUFBWTtJQUNaLFVBQVUsRUFBRSxTQUFTO0lBRXJCLE9BQU8sRUFBRSx3QkFBd0I7SUFDakMsV0FBVyxFQUFFLGNBQWM7SUFDM0Isb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLFFBQVEsRUFBRSxjQUFjO0lBQ3hCLGlCQUFpQixFQUFFLGdCQUFnQjtJQUNuQyxVQUFVLEVBQUUsZ0JBQWdCO0lBRTVCLG9CQUFvQjtJQUNwQixFQUFFLEVBQUUsaUJBQWlCO0lBQ3JCLEdBQUcsRUFBRSxnQkFBZ0I7SUFDckIsR0FBRyxFQUFFLGdCQUFnQjtJQUNyQixHQUFHLEVBQUUsZUFBZTtJQUVwQiw0REFBNEQ7SUFDNUQsb0NBQW9DO0lBQ3BDLGVBQWUsRUFBRSxjQUFjO0lBRS9CLEdBQUcsRUFBRSxJQUFJO0lBQ1QsS0FBSyxFQUFFLEdBQUc7SUFDVixRQUFRLEVBQUUsTUFBTTtJQUNoQixRQUFRLEVBQUUsSUFBSTtJQUNkLE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLEdBQUc7SUFFWCxTQUFTLEVBQUUsS0FBSztJQUNoQixXQUFXLEVBQUUsSUFBSTtJQUNqQixjQUFjLEVBQUUsS0FBSztJQUNyQixZQUFZLEVBQUUsS0FBSztJQUVuQixVQUFVLEVBQUUsaUJBQWlCO0lBRTdCLGdCQUFnQixFQUFFLEtBQUs7SUFDdkIsSUFBSSxFQUFFLE9BQU87SUFFYixnRUFBZ0U7SUFDaEUseUJBQXlCO0lBQ3pCLGNBQWMsRUFBRSxHQUFHO0lBQ25CLFlBQVksRUFBRSxHQUFHLEVBQUUsSUFBSTtDQUN4QixDQUFDO0FBQ0YsK0JBQStCO0FBRS9CLGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1ub2NoZWNrXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVG9rZW4gaWRlbnRpZmllciAtPiByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWF0Y2ggdGhlIGxleGVtZS4gVGhhdCdzIGEgbGlzdCBvZiBhbGwgdGhlIHRva2VuXG4gKiB3aGljaCBjYW4gYmUgZW1pdHRlZCBieSB0aGUgbGV4ZXIuIEZvciBub3csIHdlJ3JlIHNsaWdodGx5IGJlbmRpbmcgdGhlIHN0eWxlIGd1aWRlLFxuICogdG8gbWFrZSBzdXJlIHRoZSBkZWJ1ZyBvdXRwdXQgb2YgdGhlIGphdmFzY3JpcHQgbGV4ZXIgd2lsbCAoa2luZGEpIG1hdGNoIHRoZSBvcmlnaW5hbCBDIyBvbmUuXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGtleS1zcGFjaW5nICovXG5jb25zdCBUb2tlbnMgPSB7XG4gIC8vIFNwZWNpYWwgdG9rZW5zXG4gIFdoaXRlc3BhY2U6IG51bGwsIC8vIChub3QgdXNlZCBjdXJyZW50bHkpXG4gIEluZGVudDogbnVsbCxcbiAgRGVkZW50OiBudWxsLFxuICBFbmRPZkxpbmU6IC9cXG4vLFxuICBFbmRPZklucHV0OiBudWxsLFxuXG4gIC8vIExpdGVyYWxzIGluIChcIjw8Y29tbWFuZHM+PlwiKVxuICBOdW1iZXI6IC8tP1swLTldKyhcXC5bMC05K10pPy8sXG4gIFN0cmluZzogL1wiKFteXCJcXFxcXSooPzpcXFxcLlteXCJcXFxcXSopKilcIi8sXG5cbiAgLy8gQ29tbWFuZCBzeW50YXggKFwiPDxmb28+PlwiKVxuICBCZWdpbkNvbW1hbmQ6IC88PC8sXG4gIEVuZENvbW1hbmQ6IC8+Pi8sXG5cbiAgLy8gVmFyaWFibGVzIChcIiRmb29cIilcbiAgVmFyaWFibGU6IC9cXCQoW0EtWmEtejAtOV8uXSkrLyxcblxuICAvLyBTaG9ydGN1dCBzeW50YXggKFwiLT5cIilcbiAgU2hvcnRjdXRPcHRpb246IC8tPi8sXG5cbiAgLy8gSGFzaHRhZyAoXCIjc29tZXRoaW5nXCIpXG4gIEhhc2h0YWc6IC8jKFteKFxcc3wjfC8vKV0rKS8sIC8vIHNlZW1zIGEgbGl0dGxlIGhhY2t5IHRvIGV4cGxpY2l0bHkgY29uc2lkZXIgY29tbWVudHMgaGVyZVxuXG4gIC8vIENvbW1lbnQgKFwiLy8gc29tZSBzdHVmZlwiKVxuICBDb21tZW50OiAvXFwvXFwvLiovLFxuXG4gIC8vIE9wdGlvbiBzeW50YXggKFwiW1tMZXQncyBnbyBoZXJlfERlc3RpbmF0aW9uXV1cIilcbiAgT3B0aW9uU3RhcnQ6IC9cXFtcXFsvLCAvLyBbW1xuICBPcHRpb25EZWxpbWl0OiAvXFx8LywgLy8gfFxuICBPcHRpb25FbmQ6IC9cXF1cXF0vLCAvLyBdXVxuXG4gIC8vIENvbW1hbmQgdHlwZXMgKHNwZWNpYWxseSByZWNvZ25pemVkIGNvbW1hbmQgd29yZClcbiAgSWY6IC9pZig/IVxcdykvLFxuICBFbHNlSWY6IC9lbHNlaWYoPyFcXHcpLyxcbiAgRWxzZTogL2Vsc2UoPyFcXHcpLyxcbiAgRW5kSWY6IC9lbmRpZig/IVxcdykvLFxuICBKdW1wOiAvanVtcCg/IVxcdykvLFxuICBTdG9wOiAvc3RvcCg/IVxcdykvLFxuICBTZXQ6IC9zZXQoPyFcXHcpLyxcbiAgRGVjbGFyZTogL2RlY2xhcmUoPyFcXHcpLyxcbiAgQXM6IC9hcyg/IVxcdykvLFxuICBFeHBsaWNpdFR5cGU6IC8oU3RyaW5nfE51bWJlcnxCb29sKSg/PT4+KS8sXG5cbiAgLy8gQm9vbGVhbiB2YWx1ZXNcbiAgVHJ1ZTogL3RydWUoPyFcXHcpLyxcbiAgRmFsc2U6IC9mYWxzZSg/IVxcdykvLFxuXG4gIC8vIFRoZSBudWxsIHZhbHVlXG4gIE51bGw6IC9udWxsKD8hXFx3KS8sXG5cbiAgLy8gUGFyZW50aGVzZXNcbiAgTGVmdFBhcmVuOiAvXFwoLyxcbiAgUmlnaHRQYXJlbjogL1xcKS8sXG5cbiAgLy8gUGFyYW1ldGVyIGRlbGltaXRlcnNcbiAgQ29tbWE6IC8sLyxcblxuICAvLyBPcGVyYXRvcnNcbiAgVW5hcnlNaW51czogLy0oPyFcXHMpLyxcblxuICBFcXVhbFRvOiAvKD09fGlzKD8hXFx3KXxlcSg/IVxcdykpLywgLy8gPT0sIGVxLCBpc1xuICBHcmVhdGVyVGhhbjogLyg+fGd0KD8hXFx3KSkvLCAvLyA+LCBndFxuICBHcmVhdGVyVGhhbk9yRXF1YWxUbzogLyg+PXxndGUoPyFcXHcpKS8sIC8vID49LCBndGVcbiAgTGVzc1RoYW46IC8oPHxsdCg/IVxcdykpLywgLy8gPCwgbHRcbiAgTGVzc1RoYW5PckVxdWFsVG86IC8oPD18bHRlKD8hXFx3KSkvLCAvLyA8PSwgbHRlXG4gIE5vdEVxdWFsVG86IC8oIT18bmVxKD8hXFx3KSkvLCAvLyAhPSwgbmVxXG5cbiAgLy8gTG9naWNhbCBvcGVyYXRvcnNcbiAgT3I6IC8oXFx8XFx8fG9yKD8hXFx3KSkvLCAvLyB8fCwgb3JcbiAgQW5kOiAvKCYmfGFuZCg/IVxcdykpLywgLy8gJiYsIGFuZFxuICBYb3I6IC8oXFxefHhvcig/IVxcdykpLywgLy8gXiwgeG9yXG4gIE5vdDogLyghfG5vdCg/IVxcdykpLywgLy8gISwgbm90XG5cbiAgLy8gdGhpcyBndXkncyBzcGVjaWFsIGJlY2F1c2UgJz0nIGNhbiBtZWFuIGVpdGhlciAnZXF1YWwgdG8nXG4gIC8vIG9yICdiZWNvbWVzJyBkZXBlbmRpbmcgb24gY29udGV4dFxuICBFcXVhbFRvT3JBc3NpZ246IC8oPXx0byg/IVxcdykpLywgLy8gPSwgdG9cblxuICBBZGQ6IC9cXCsvLCAvLyArXG4gIE1pbnVzOiAvLS8sIC8vIC1cbiAgRXhwb25lbnQ6IC9cXCpcXCovLCAvLyAqKlxuICBNdWx0aXBseTogL1xcKi8sIC8vICpcbiAgRGl2aWRlOiAvXFwvLywgLy8gL1xuICBNb2R1bG86IC8lLywgLy8gL1xuXG4gIEFkZEFzc2lnbjogL1xcKz0vLCAvLyArPVxuICBNaW51c0Fzc2lnbjogLy09LywgLy8gLT1cbiAgTXVsdGlwbHlBc3NpZ246IC9cXCo9LywgLy8gKj1cbiAgRGl2aWRlQXNzaWduOiAvXFwvPS8sIC8vIC89XG5cbiAgSWRlbnRpZmllcjogL1thLXpBLVowLTlfOi5dKy8sIC8vIGEgc2luZ2xlIHdvcmQgKHVzZWQgZm9yIGZ1bmN0aW9ucylcblxuICBFc2NhcGVkQ2hhcmFjdGVyOiAvXFxcXC4vLCAvLyBmb3IgZXNjYXBpbmcgXFwjIHNwZWNpYWwgY2hhcmFjdGVyc1xuICBUZXh0OiAvW15cXFxcXS8sIC8vIGdlbmVyaWMgdW50aWwgd2UgaGl0IG90aGVyIHN5bnRheFxuXG4gIC8vIEJyYWNlcyBhcmUgdXNlZCBmb3IgaW5saW5lIGV4cHJlc3Npb25zLiBJZ25vcmUgZXNjYXBlZCBicmFjZXNcbiAgLy8gVE9ETzogZG9lc24ndCB3b3JrIGlvc1xuICBCZWdpbklubGluZUV4cDogL3svLCAvLyB7XG4gIEVuZElubGluZUV4cDogL30vLCAvLyB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBrZXktc3BhY2luZyAqL1xuXG5leHBvcnQgZGVmYXVsdCBUb2tlbnM7XG4iXX0=