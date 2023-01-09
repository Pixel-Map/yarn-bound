declare class Lexer {
    constructor();
    /**
     * reset - Reset the lexer location, text and line number. Nothing fancy.
     */
    reset(): void;
    /**
     * lex - Lex the input and emit the next matched token.
     *
     * @return {string}  Emit the next token found.
     */
    lex(): any;
    advanceLine(): void;
    lexNextTokenOnCurrentLine(): any;
    /**
     * setState - set the current state of the lexer.
     *
     * @param  {string} state name of the state
     */
    setState(state: any): void;
    /**
     * setInput - Set the text on which perform lexical analysis.
     *
     * @param  {string} text the text to lex.
     */
    setInput(text: any): void;
    /**
     * getState - Returns the full current state object (LexerState),
     * rather than its identifier.
     *
     * @return {Object}  the state object.
     */
    getState(): any;
    getCurrentLine(): any;
    getCurrentLineIndentation(): any;
    getLastRecordedIndentation(): any;
    /**
     * @return {boolean}  `true` when yylloc indicates that the end was reached.
     */
    isAtTheEndOfText(): boolean;
    /**
     * @return {boolean}  `true` when yylloc indicates that the end of the line was reached.
     */
    isAtTheEndOfLine(): boolean;
}
export default Lexer;
