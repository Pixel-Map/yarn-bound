/**
 * Token identifier -> regular expression to match the lexeme. That's a list of all the token
 * which can be emitted by the lexer. For now, we're slightly bending the style guide,
 * to make sure the debug output of the javascript lexer will (kinda) match the original C# one.
 */
declare const Tokens: {
    Whitespace: null;
    Indent: null;
    Dedent: null;
    EndOfLine: RegExp;
    EndOfInput: null;
    Number: RegExp;
    String: RegExp;
    BeginCommand: RegExp;
    EndCommand: RegExp;
    Variable: RegExp;
    ShortcutOption: RegExp;
    Hashtag: RegExp;
    Comment: RegExp;
    OptionStart: RegExp;
    OptionDelimit: RegExp;
    OptionEnd: RegExp;
    If: RegExp;
    ElseIf: RegExp;
    Else: RegExp;
    EndIf: RegExp;
    Jump: RegExp;
    Stop: RegExp;
    Set: RegExp;
    Declare: RegExp;
    As: RegExp;
    ExplicitType: RegExp;
    True: RegExp;
    False: RegExp;
    Null: RegExp;
    LeftParen: RegExp;
    RightParen: RegExp;
    Comma: RegExp;
    UnaryMinus: RegExp;
    EqualTo: RegExp;
    GreaterThan: RegExp;
    GreaterThanOrEqualTo: RegExp;
    LessThan: RegExp;
    LessThanOrEqualTo: RegExp;
    NotEqualTo: RegExp;
    Or: RegExp;
    And: RegExp;
    Xor: RegExp;
    Not: RegExp;
    EqualToOrAssign: RegExp;
    Add: RegExp;
    Minus: RegExp;
    Exponent: RegExp;
    Multiply: RegExp;
    Divide: RegExp;
    Modulo: RegExp;
    AddAssign: RegExp;
    MinusAssign: RegExp;
    MultiplyAssign: RegExp;
    DivideAssign: RegExp;
    Identifier: RegExp;
    EscapedCharacter: RegExp;
    Text: RegExp;
    BeginInlineExp: RegExp;
    EndInlineExp: RegExp;
};
export default Tokens;
