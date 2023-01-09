/**
 * A LexState object represents one of the states in which the lexer can be.
 */
declare class LexerState {
    constructor();
    /**
     * addTransition - Define a new transition for this state.
     *
     * @param  {type} token - the token to match
     * @param  {string} [state] - the state to which transition; if not provided, will
     *                            remain in the same state.
     * @param  {boolean} [delimitsText] - `true` if the token is a text delimiter. A text delimiters
     *                                    is a token which should be considered as a token, even if it
     *                                    doesn't start the line.
     * @return {Object} - returns the LexState itself for chaining.
     */
    addTransition(token: any, state: any, delimitsText: any): this;
    /**
     * addTextRule - Match all the way up to any of the other transitions in this state.
     *               The text rule can only be added once.
     *
     * @param  {type} type  description
     * @param  {type} state description
     * @return {Object} - returns the LexState itself for chaining.
     */
    addTextRule(type: any, state: any): this;
    /**
     * setTrackNextIndentation - tell this state whether to track indentation.
     *
     * @param  {boolean} track - `true` to track, `false` otherwise.
     * @return {Object} - returns the LexState itself for chaining.
     */
    setTrackNextIndentation(track: any): this;
}
export default LexerState;
