import LexerState from './lexer-state';
/**
 * @return {Object}  all states in which the lexer can be with their associated transitions.
 */
declare function makeStates(): {
    base: LexerState;
    shortcutOption: LexerState;
    command: LexerState;
    commandArg: LexerState;
    commandParenArgOrExpression: LexerState;
    assignment: LexerState;
    declare: LexerState;
    jump: LexerState;
    stop: LexerState;
    expression: LexerState;
    inlineExpression: LexerState;
    inlineExpressionInCommand: LexerState;
    inlineExpressionInShortcut: LexerState;
};
declare const _default: {
    makeStates: typeof makeStates;
};
export default _default;
