// @ts-nocheck
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Syncs with YarnSpinner@e0f6807,
// see https://github.com/thesecretlab/YarnSpinner/blob/master/YarnSpinner/Lexer.cs
const states_1 = __importDefault(require("./states"));
// As opposed to the original C# implemntation which, tokenize the entire input, before emiting
// a list of tokens, this parser will emit a token each time `lex()` is called. This change
// accomodates the Jison parser. Given the lexer is not entirely context-free
// (Off-side rule, lookaheads), context needs to be remembered between each `lex()` calls.
class Lexer {
    constructor() {
        /** All the possible states for the lexer. */
        this.states = states_1.default.makeStates();
        /** Current state identifier. */
        this.state = 'base';
        /** Original text to lex. */
        this.originalText = '';
        /** Text to lex, splitted into an array of lines. */
        this.lines = [];
        // Properties used to keep track of the context we're in, while tokenizing each line.
        /**
         * Indentation tracker. Each time we encounter an identation, we push a
         * new array which looks like: [indentationLevel, isBaseIndentation]. Basically,
         * isBaseIndentation will be true only for the first level.
         */
        this.indentation = [[0, false]];
        /**
         * Set to true when a state required indentation tracking. Will be set to false, after a
         * an indentation is found.
         */
        this.shouldTrackNextIndentation = false;
        /**
         * The previous level of identation, basically: this.indentation.last()[0].
         */
        this.previousLevelOfIndentation = 0;
        // Reset the locations.
        this.reset();
    }
    /**
     * reset - Reset the lexer location, text and line number. Nothing fancy.
     */
    reset() {
        // Locations, used by both the lexer and the Jison parser.
        this.yytext = '';
        this.yylloc = {
            first_column: 1,
            first_line: 1,
            last_column: 1,
            last_line: 1,
        };
        this.yylineno = 1;
    }
    /**
     * lex - Lex the input and emit the next matched token.
     *
     * @return {string}  Emit the next token found.
     */
    lex() {
        if (this.isAtTheEndOfText()) {
            this.yytext = '';
            // Now that we're at the end of the text, we'll emit as many
            // `Dedent` as necessary, to get back to 0-indentation.
            const indent = this.indentation.pop();
            if (indent && indent[1]) {
                return 'Dedent';
            }
            return 'EndOfInput';
        }
        if (this.isAtTheEndOfLine()) {
            // Get the next token on the current line
            this.advanceLine();
            return 'EndOfLine';
        }
        return this.lexNextTokenOnCurrentLine();
    }
    advanceLine() {
        this.yylineno += 1;
        const currentLine = this.getCurrentLine().replace(/\t/, '    ');
        this.lines[this.yylineno - 1] = currentLine;
        this.previousLevelOfIndentation = this.getLastRecordedIndentation()[0];
        this.yytext = '';
        this.yylloc = {
            first_column: 1,
            first_line: this.yylineno,
            last_column: 1,
            last_line: this.yylineno,
        };
    }
    lexNextTokenOnCurrentLine() {
        const thisIndentation = this.getCurrentLineIndentation();
        if (this.shouldTrackNextIndentation && thisIndentation > this.previousLevelOfIndentation) {
            this.indentation.push([thisIndentation, true]);
            this.shouldTrackNextIndentation = false;
            this.yylloc.first_column = this.yylloc.last_column;
            this.yylloc.last_column += thisIndentation;
            this.yytext = '';
            return 'Indent';
        }
        else if (thisIndentation < this.getLastRecordedIndentation()[0]) {
            const indent = this.indentation.pop();
            if (indent[1]) {
                this.yytext = '';
                this.previousLevelOfIndentation = this.getLastRecordedIndentation()[0];
                return 'Dedent';
            }
            this.lexNextTokenOnCurrentLine();
        }
        if (thisIndentation === this.previousLevelOfIndentation && this.yylloc.last_column === 1) {
            this.yylloc.last_column += thisIndentation;
        }
        const rules = this.getState().transitions;
        for (let i = 0, len = rules.length; i < len; i += 1) {
            const rule = rules[i];
            const match = this.getCurrentLine()
                .substring(this.yylloc.last_column - 1)
                .match(rule.regex);
            // Only accept valid matches that are at the beginning of the text
            if (match !== null && match.index === 0) {
                // Take the matched text off the front of this.text
                const matchedText = match[0];
                // Tell the parser what the text for this token is
                this.yytext = this.getCurrentLine().substr(this.yylloc.last_column - 1, matchedText.length);
                if (rule.token === 'String') {
                    // If that's a String, remove the quotes
                    this.yytext = this.yytext.substring(1, this.yytext.length - 1);
                }
                // Update our line and column info
                this.yylloc.first_column = this.yylloc.last_column;
                this.yylloc.last_column += matchedText.length;
                // If the rule points to a new state, change it now
                if (rule.state) {
                    this.setState(rule.state);
                    if (this.shouldTrackNextIndentation) {
                        if (this.getLastRecordedIndentation()[0] < thisIndentation) {
                            this.indentation.push([thisIndentation, false]);
                        }
                    }
                }
                const nextState = this.states[rule.state];
                const nextStateHasText = !rule.state ||
                    nextState.transitions.find((transition) => {
                        return transition.token === 'Text';
                    });
                // inline expressions and escaped characters interrupt text
                // but should still preserve surrounding whitespace.
                if ((rule.token !== 'EndInlineExp' && rule.token !== 'EscapedCharacter') ||
                    !nextStateHasText // we never want leading whitespace if not in text-supporting state
                ) {
                    // Remove leading whitespace characters
                    const spaceMatch = this.getCurrentLine()
                        .substring(this.yylloc.last_column - 1)
                        .match(/^\s*/);
                    if (spaceMatch[0]) {
                        this.yylloc.last_column += spaceMatch[0].length;
                    }
                }
                return rule.token;
            }
        }
        throw new Error(`Invalid syntax in: ${this.getCurrentLine()}`);
    }
    // /////////////// Getters & Setters
    /**
     * setState - set the current state of the lexer.
     *
     * @param  {string} state name of the state
     */
    setState(state) {
        if (this.states[state] === undefined) {
            throw new Error(`Cannot set the unknown state [${state}]`);
        }
        this.state = state;
        if (this.getState().isTrackingNextIndentation) {
            this.shouldTrackNextIndentation = true;
        }
    }
    /**
     * setInput - Set the text on which perform lexical analysis.
     *
     * @param  {string} text the text to lex.
     */
    setInput(text) {
        // Delete carriage return while keeping a similar semantic.
        this.originalText = text
            .replace(/(\r\n)/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/[\n\r]+$/, '');
        // Transform the input into an array of lines.
        this.lines = this.originalText.split('\n');
        this.reset();
    }
    /**
     * getState - Returns the full current state object (LexerState),
     * rather than its identifier.
     *
     * @return {Object}  the state object.
     */
    getState() {
        return this.states[this.state];
    }
    getCurrentLine() {
        return this.lines[this.yylineno - 1];
    }
    getCurrentLineIndentation() {
        const match = this.getCurrentLine().match(/^(\s*)/g);
        return match[0].length;
    }
    getLastRecordedIndentation() {
        if (this.indentation.length === 0) {
            return [0, false];
        }
        return this.indentation[this.indentation.length - 1];
    }
    // /////////////// Booleans tests
    /**
     * @return {boolean}  `true` when yylloc indicates that the end was reached.
     */
    isAtTheEndOfText() {
        return this.isAtTheEndOfLine() && this.yylloc.first_line >= this.lines.length;
    }
    /**
     * @return {boolean}  `true` when yylloc indicates that the end of the line was reached.
     */
    isAtTheEndOfLine() {
        return this.yylloc.last_column > this.getCurrentLine().length;
    }
}
exports.default = Lexer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGV4ZXIvbGV4ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYztBQUNkLFlBQVksQ0FBQzs7Ozs7QUFFYixrQ0FBa0M7QUFDbEMsbUZBQW1GO0FBRW5GLHNEQUFrQztBQUVsQywrRkFBK0Y7QUFDL0YsMkZBQTJGO0FBQzNGLDZFQUE2RTtBQUM3RSwwRkFBMEY7QUFDMUYsTUFBTSxLQUFLO0lBQ1Q7UUFDRSw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxnQkFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXRDLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUVwQiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFdkIsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWhCLHFGQUFxRjtRQUNyRjs7OztXQUlHO1FBQ0gsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFaEM7OztXQUdHO1FBQ0gsSUFBSSxDQUFDLDBCQUEwQixHQUFHLEtBQUssQ0FBQztRQUV4Qzs7V0FFRztRQUNILElBQUksQ0FBQywwQkFBMEIsR0FBRyxDQUFDLENBQUM7UUFFcEMsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUs7UUFDSCwwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNaLFlBQVksRUFBRSxDQUFDO1lBQ2YsVUFBVSxFQUFFLENBQUM7WUFDYixXQUFXLEVBQUUsQ0FBQztZQUNkLFNBQVMsRUFBRSxDQUFDO1NBQ2IsQ0FBQztRQUNGLElBQUks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QUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCx5QkFBeUI7UUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELDBCQUEwQjtRQUN4QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNqQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25CO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxpQ0FBaUM7SUFDakM7O09BRUc7SUFDSCxnQkFBZ0I7UUFDZCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2hGLENBQUM7SUFFRDs7T0FFRztJQUNILGdCQUFnQjtRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNoRSxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxLQUFLLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtbm9jaGVja1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBTeW5jcyB3aXRoIFlhcm5TcGlubmVyQGUwZjY4MDcsXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3RoZXNlY3JldGxhYi9ZYXJuU3Bpbm5lci9ibG9iL21hc3Rlci9ZYXJuU3Bpbm5lci9MZXhlci5jc1xuXG5pbXBvcnQgU3RhdGVNYWtlciBmcm9tICcuL3N0YXRlcyc7XG5cbi8vIEFzIG9wcG9zZWQgdG8gdGhlIG9yaWdpbmFsIEMjIGltcGxlbW50YXRpb24gd2hpY2gsIHRva2VuaXplIHRoZSBlbnRpcmUgaW5wdXQsIGJlZm9yZSBlbWl0aW5nXG4vLyBhIGxpc3Qgb2YgdG9rZW5zLCB0aGlzIHBhcnNlciB3aWxsIGVtaXQgYSB0b2tlbiBlYWNoIHRpbWUgYGxleCgpYCBpcyBjYWxsZWQuIFRoaXMgY2hhbmdlXG4vLyBhY2NvbW9kYXRlcyB0aGUgSmlzb24gcGFyc2VyLiBHaXZlbiB0aGUgbGV4ZXIgaXMgbm90IGVudGlyZWx5IGNvbnRleHQtZnJlZVxuLy8gKE9mZi1zaWRlIHJ1bGUsIGxvb2thaGVhZHMpLCBjb250ZXh0IG5lZWRzIHRvIGJlIHJlbWVtYmVyZWQgYmV0d2VlbiBlYWNoIGBsZXgoKWAgY2FsbHMuXG5jbGFzcyBMZXhlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKiBBbGwgdGhlIHBvc3NpYmxlIHN0YXRlcyBmb3IgdGhlIGxleGVyLiAqL1xuICAgIHRoaXMuc3RhdGVzID0gU3RhdGVNYWtlci5tYWtlU3RhdGVzKCk7XG5cbiAgICAvKiogQ3VycmVudCBzdGF0ZSBpZGVudGlmaWVyLiAqL1xuICAgIHRoaXMuc3RhdGUgPSAnYmFzZSc7XG5cbiAgICAvKiogT3JpZ2luYWwgdGV4dCB0byBsZXguICovXG4gICAgdGhpcy5vcmlnaW5hbFRleHQgPSAnJztcblxuICAgIC8qKiBUZXh0IHRvIGxleCwgc3BsaXR0ZWQgaW50byBhbiBhcnJheSBvZiBsaW5lcy4gKi9cbiAgICB0aGlzLmxpbmVzID0gW107XG5cbiAgICAvLyBQcm9wZXJ0aWVzIHVzZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgY29udGV4dCB3ZSdyZSBpbiwgd2hpbGUgdG9rZW5pemluZyBlYWNoIGxpbmUuXG4gICAgLyoqXG4gICAgICogSW5kZW50YXRpb24gdHJhY2tlci4gRWFjaCB0aW1lIHdlIGVuY291bnRlciBhbiBpZGVudGF0aW9uLCB3ZSBwdXNoIGFcbiAgICAgKiBuZXcgYXJyYXkgd2hpY2ggbG9va3MgbGlrZTogW2luZGVudGF0aW9uTGV2ZWwsIGlzQmFzZUluZGVudGF0aW9uXS4gQmFzaWNhbGx5LFxuICAgICAqIGlzQmFzZUluZGVudGF0aW9uIHdpbGwgYmUgdHJ1ZSBvbmx5IGZvciB0aGUgZmlyc3QgbGV2ZWwuXG4gICAgICovXG4gICAgdGhpcy5pbmRlbnRhdGlvbiA9IFtbMCwgZmFsc2VdXTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0byB0cnVlIHdoZW4gYSBzdGF0ZSByZXF1aXJlZCBpbmRlbnRhdGlvbiB0cmFja2luZy4gV2lsbCBiZSBzZXQgdG8gZmFsc2UsIGFmdGVyIGFcbiAgICAgKiBhbiBpbmRlbnRhdGlvbiBpcyBmb3VuZC5cbiAgICAgKi9cbiAgICB0aGlzLnNob3VsZFRyYWNrTmV4dEluZGVudGF0aW9uID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcHJldmlvdXMgbGV2ZWwgb2YgaWRlbnRhdGlvbiwgYmFzaWNhbGx5OiB0aGlzLmluZGVudGF0aW9uLmxhc3QoKVswXS5cbiAgICAgKi9cbiAgICB0aGlzLnByZXZpb3VzTGV2ZWxPZkluZGVudGF0aW9uID0gMDtcblxuICAgIC8vIFJlc2V0IHRoZSBsb2NhdGlvbnMuXG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlc2V0IC0gUmVzZXQgdGhlIGxleGVyIGxvY2F0aW9uLCB0ZXh0IGFuZCBsaW5lIG51bWJlci4gTm90aGluZyBmYW5jeS5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIC8vIExvY2F0aW9ucywgdXNlZCBieSBib3RoIHRoZSBsZXhlciBhbmQgdGhlIEppc29uIHBhcnNlci5cbiAgICB0aGlzLnl5dGV4dCA9ICcnO1xuICAgIHRoaXMueXlsbG9jID0ge1xuICAgICAgZmlyc3RfY29sdW1uOiAxLFxuICAgICAgZmlyc3RfbGluZTogMSxcbiAgICAgIGxhc3RfY29sdW1uOiAxLFxuICAgICAgbGFzdF9saW5lOiAxLFxuICAgIH07XG4gICAgdGhpcy55eWxpbmVubyA9IDE7XG4gIH1cblxuICAvKipcbiAgICogbGV4IC0gTGV4IHRoZSBpbnB1dCBhbmQgZW1pdCB0aGUgbmV4dCBtYXRjaGVkIHRva2VuLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICBFbWl0IHRoZSBuZXh0IHRva2VuIGZvdW5kLlxuICAgKi9cbiAgbGV4KCkge1xuICAgIGlmICh0aGlzLmlzQXRUaGVFbmRPZlRleHQoKSkge1xuICAgICAgdGhpcy55eXRleHQgPSAnJztcblxuICAgICAgLy8gTm93IHRoYXQgd2UncmUgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dCwgd2UnbGwgZW1pdCBhcyBtYW55XG4gICAgICAvLyBgRGVkZW50YCBhcyBuZWNlc3NhcnksIHRvIGdldCBiYWNrIHRvIDAtaW5kZW50YXRpb24uXG4gICAgICBjb25zdCBpbmRlbnQgPSB0aGlzLmluZGVudGF0aW9uLnBvcCgpO1xuICAgICAgaWYgKGluZGVudCAmJiBpbmRlbnRbMV0pIHtcbiAgICAgICAgcmV0dXJuICdEZWRlbnQnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJ0VuZE9mSW5wdXQnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQXRUaGVFbmRPZkxpbmUoKSkge1xuICAgICAgLy8gR2V0IHRoZSBuZXh0IHRva2VuIG9uIHRoZSBjdXJyZW50IGxpbmVcbiAgICAgIHRoaXMuYWR2YW5jZUxpbmUoKTtcbiAgICAgIHJldHVybiAnRW5kT2ZMaW5lJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5sZXhOZXh0VG9rZW5PbkN1cnJlbnRMaW5lKCk7XG4gIH1cblxuICBhZHZhbmNlTGluZSgpIHtcbiAgICB0aGlzLnl5bGluZW5vICs9IDE7XG4gICAgY29uc3QgY3VycmVudExpbmUgPSB0aGlzLmdldEN1cnJlbnRMaW5lKCkucmVwbGFjZSgvXFx0LywgJyAgICAnKTtcbiAgICB0aGlzLmxpbmVzW3RoaXMueXlsaW5lbm8gLSAxXSA9IGN1cnJlbnRMaW5lO1xuICAgIHRoaXMucHJldmlvdXNMZXZlbE9mSW5kZW50YXRpb24gPSB0aGlzLmdldExhc3RSZWNvcmRlZEluZGVudGF0aW9uKClbMF07XG4gICAgdGhpcy55eXRleHQgPSAnJztcbiAgICB0aGlzLnl5bGxvYyA9IHtcbiAgICAgIGZpcnN0X2NvbHVtbjogMSxcbiAgICAgIGZpcnN0X2xpbmU6IHRoaXMueXlsaW5lbm8sXG4gICAgICBsYXN0X2NvbHVtbjogMSxcbiAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubyxcbiAgICB9O1xuICB9XG5cbiAgbGV4TmV4dFRva2VuT25DdXJyZW50TGluZSgpIHtcbiAgICBjb25zdCB0aGlzSW5kZW50YXRpb24gPSB0aGlzLmdldEN1cnJlbnRMaW5lSW5kZW50YXRpb24oKTtcblxuICAgIGlmICh0aGlzLnNob3VsZFRyYWNrTmV4dEluZGVudGF0aW9uICYmIHRoaXNJbmRlbnRhdGlvbiA+IHRoaXMucHJldmlvdXNMZXZlbE9mSW5kZW50YXRpb24pIHtcbiAgICAgIHRoaXMuaW5kZW50YXRpb24ucHVzaChbdGhpc0luZGVudGF0aW9uLCB0cnVlXSk7XG4gICAgICB0aGlzLnNob3VsZFRyYWNrTmV4dEluZGVudGF0aW9uID0gZmFsc2U7XG5cbiAgICAgIHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiA9IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uO1xuICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKz0gdGhpc0luZGVudGF0aW9uO1xuICAgICAgdGhpcy55eXRleHQgPSAnJztcblxuICAgICAgcmV0dXJuICdJbmRlbnQnO1xuICAgIH0gZWxzZSBpZiAodGhpc0luZGVudGF0aW9uIDwgdGhpcy5nZXRMYXN0UmVjb3JkZWRJbmRlbnRhdGlvbigpWzBdKSB7XG4gICAgICBjb25zdCBpbmRlbnQgPSB0aGlzLmluZGVudGF0aW9uLnBvcCgpO1xuICAgICAgaWYgKGluZGVudFsxXSkge1xuICAgICAgICB0aGlzLnl5dGV4dCA9ICcnO1xuICAgICAgICB0aGlzLnByZXZpb3VzTGV2ZWxPZkluZGVudGF0aW9uID0gdGhpcy5nZXRMYXN0UmVjb3JkZWRJbmRlbnRhdGlvbigpWzBdO1xuXG4gICAgICAgIHJldHVybiAnRGVkZW50JztcbiAgICAgIH1cblxuICAgICAgdGhpcy5sZXhOZXh0VG9rZW5PbkN1cnJlbnRMaW5lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXNJbmRlbnRhdGlvbiA9PT0gdGhpcy5wcmV2aW91c0xldmVsT2ZJbmRlbnRhdGlvbiAmJiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiA9PT0gMSkge1xuICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKz0gdGhpc0luZGVudGF0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IHJ1bGVzID0gdGhpcy5nZXRTdGF0ZSgpLnRyYW5zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBydWxlcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgcnVsZSA9IHJ1bGVzW2ldO1xuICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLmdldEN1cnJlbnRMaW5lKClcbiAgICAgICAgLnN1YnN0cmluZyh0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiAtIDEpXG4gICAgICAgIC5tYXRjaChydWxlLnJlZ2V4KTtcblxuICAgICAgLy8gT25seSBhY2NlcHQgdmFsaWQgbWF0Y2hlcyB0aGF0IGFyZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0ZXh0XG4gICAgICBpZiAobWF0Y2ggIT09IG51bGwgJiYgbWF0Y2guaW5kZXggPT09IDApIHtcbiAgICAgICAgLy8gVGFrZSB0aGUgbWF0Y2hlZCB0ZXh0IG9mZiB0aGUgZnJvbnQgb2YgdGhpcy50ZXh0XG4gICAgICAgIGNvbnN0IG1hdGNoZWRUZXh0ID0gbWF0Y2hbMF07XG5cbiAgICAgICAgLy8gVGVsbCB0aGUgcGFyc2VyIHdoYXQgdGhlIHRleHQgZm9yIHRoaXMgdG9rZW4gaXNcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLmdldEN1cnJlbnRMaW5lKCkuc3Vic3RyKHRoaXMueXlsbG9jLmxhc3RfY29sdW1uIC0gMSwgbWF0Y2hlZFRleHQubGVuZ3RoKTtcblxuICAgICAgICBpZiAocnVsZS50b2tlbiA9PT0gJ1N0cmluZycpIHtcbiAgICAgICAgICAvLyBJZiB0aGF0J3MgYSBTdHJpbmcsIHJlbW92ZSB0aGUgcXVvdGVzXG4gICAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLnl5dGV4dC5zdWJzdHJpbmcoMSwgdGhpcy55eXRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgb3VyIGxpbmUgYW5kIGNvbHVtbiBpbmZvXG4gICAgICAgIHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiA9IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uO1xuICAgICAgICB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiArPSBtYXRjaGVkVGV4dC5sZW5ndGg7XG5cbiAgICAgICAgLy8gSWYgdGhlIHJ1bGUgcG9pbnRzIHRvIGEgbmV3IHN0YXRlLCBjaGFuZ2UgaXQgbm93XG4gICAgICAgIGlmIChydWxlLnN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZShydWxlLnN0YXRlKTtcblxuICAgICAgICAgIGlmICh0aGlzLnNob3VsZFRyYWNrTmV4dEluZGVudGF0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRMYXN0UmVjb3JkZWRJbmRlbnRhdGlvbigpWzBdIDwgdGhpc0luZGVudGF0aW9uKSB7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZW50YXRpb24ucHVzaChbdGhpc0luZGVudGF0aW9uLCBmYWxzZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHRoaXMuc3RhdGVzW3J1bGUuc3RhdGVdO1xuICAgICAgICBjb25zdCBuZXh0U3RhdGVIYXNUZXh0ID1cbiAgICAgICAgICAhcnVsZS5zdGF0ZSB8fFxuICAgICAgICAgIG5leHRTdGF0ZS50cmFuc2l0aW9ucy5maW5kKCh0cmFuc2l0aW9uKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbi50b2tlbiA9PT0gJ1RleHQnO1xuICAgICAgICAgIH0pO1xuICAgICAgICAvLyBpbmxpbmUgZXhwcmVzc2lvbnMgYW5kIGVzY2FwZWQgY2hhcmFjdGVycyBpbnRlcnJ1cHQgdGV4dFxuICAgICAgICAvLyBidXQgc2hvdWxkIHN0aWxsIHByZXNlcnZlIHN1cnJvdW5kaW5nIHdoaXRlc3BhY2UuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAocnVsZS50b2tlbiAhPT0gJ0VuZElubGluZUV4cCcgJiYgcnVsZS50b2tlbiAhPT0gJ0VzY2FwZWRDaGFyYWN0ZXInKSB8fFxuICAgICAgICAgICFuZXh0U3RhdGVIYXNUZXh0IC8vIHdlIG5ldmVyIHdhbnQgbGVhZGluZyB3aGl0ZXNwYWNlIGlmIG5vdCBpbiB0ZXh0LXN1cHBvcnRpbmcgc3RhdGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgd2hpdGVzcGFjZSBjaGFyYWN0ZXJzXG4gICAgICAgICAgY29uc3Qgc3BhY2VNYXRjaCA9IHRoaXMuZ2V0Q3VycmVudExpbmUoKVxuICAgICAgICAgICAgLnN1YnN0cmluZyh0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiAtIDEpXG4gICAgICAgICAgICAubWF0Y2goL15cXHMqLyk7XG4gICAgICAgICAgaWYgKHNwYWNlTWF0Y2hbMF0pIHtcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLmxhc3RfY29sdW1uICs9IHNwYWNlTWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBydWxlLnRva2VuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzeW50YXggaW46ICR7dGhpcy5nZXRDdXJyZW50TGluZSgpfWApO1xuICB9XG5cbiAgLy8gLy8vLy8vLy8vLy8vLy8vIEdldHRlcnMgJiBTZXR0ZXJzXG5cbiAgLyoqXG4gICAqIHNldFN0YXRlIC0gc2V0IHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBsZXhlci5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdGF0ZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICAgKi9cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZXNbc3RhdGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCB0aGUgdW5rbm93biBzdGF0ZSBbJHtzdGF0ZX1dYCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIGlmICh0aGlzLmdldFN0YXRlKCkuaXNUcmFja2luZ05leHRJbmRlbnRhdGlvbikge1xuICAgICAgdGhpcy5zaG91bGRUcmFja05leHRJbmRlbnRhdGlvbiA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldElucHV0IC0gU2V0IHRoZSB0ZXh0IG9uIHdoaWNoIHBlcmZvcm0gbGV4aWNhbCBhbmFseXNpcy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0ZXh0IHRoZSB0ZXh0IHRvIGxleC5cbiAgICovXG4gIHNldElucHV0KHRleHQpIHtcbiAgICAvLyBEZWxldGUgY2FycmlhZ2UgcmV0dXJuIHdoaWxlIGtlZXBpbmcgYSBzaW1pbGFyIHNlbWFudGljLlxuICAgIHRoaXMub3JpZ2luYWxUZXh0ID0gdGV4dFxuICAgICAgLnJlcGxhY2UoLyhcXHJcXG4pL2csICdcXG4nKVxuICAgICAgLnJlcGxhY2UoL1xcci9nLCAnXFxuJylcbiAgICAgIC5yZXBsYWNlKC9bXFxuXFxyXSskLywgJycpO1xuICAgIC8vIFRyYW5zZm9ybSB0aGUgaW5wdXQgaW50byBhbiBhcnJheSBvZiBsaW5lcy5cbiAgICB0aGlzLmxpbmVzID0gdGhpcy5vcmlnaW5hbFRleHQuc3BsaXQoJ1xcbicpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXRTdGF0ZSAtIFJldHVybnMgdGhlIGZ1bGwgY3VycmVudCBzdGF0ZSBvYmplY3QgKExleGVyU3RhdGUpLFxuICAgKiByYXRoZXIgdGhhbiBpdHMgaWRlbnRpZmllci5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgdGhlIHN0YXRlIG9iamVjdC5cbiAgICovXG4gIGdldFN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlc1t0aGlzLnN0YXRlXTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMaW5lKCkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzW3RoaXMueXlsaW5lbm8gLSAxXTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMaW5lSW5kZW50YXRpb24oKSB7XG4gICAgY29uc3QgbWF0Y2ggPSB0aGlzLmdldEN1cnJlbnRMaW5lKCkubWF0Y2goL14oXFxzKikvZyk7XG4gICAgcmV0dXJuIG1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuXG4gIGdldExhc3RSZWNvcmRlZEluZGVudGF0aW9uKCkge1xuICAgIGlmICh0aGlzLmluZGVudGF0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFswLCBmYWxzZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5kZW50YXRpb25bdGhpcy5pbmRlbnRhdGlvbi5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLyBCb29sZWFucyB0ZXN0c1xuICAvKipcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gIGB0cnVlYCB3aGVuIHl5bGxvYyBpbmRpY2F0ZXMgdGhhdCB0aGUgZW5kIHdhcyByZWFjaGVkLlxuICAgKi9cbiAgaXNBdFRoZUVuZE9mVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0F0VGhlRW5kT2ZMaW5lKCkgJiYgdGhpcy55eWxsb2MuZmlyc3RfbGluZSA+PSB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAgYHRydWVgIHdoZW4geXlsbG9jIGluZGljYXRlcyB0aGF0IHRoZSBlbmQgb2YgdGhlIGxpbmUgd2FzIHJlYWNoZWQuXG4gICAqL1xuICBpc0F0VGhlRW5kT2ZMaW5lKCkge1xuICAgIHJldHVybiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiA+IHRoaXMuZ2V0Q3VycmVudExpbmUoKS5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV4ZXI7XG4iXX0=