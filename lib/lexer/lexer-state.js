// @ts-nocheck
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = __importDefault(require("./tokens"));
/**
 * A LexState object represents one of the states in which the lexer can be.
 */
class LexerState {
    constructor() {
        /** A list of transition for the given state. */
        this.transitions = [];
        /** A special, unique transition for matching spans of text in any state. */
        this.textRule = null;
        /**
         * Whether or not this state is context-bound by indentation
         * (will make the lexer emit Indent and Dedent tokens).
         */
        this.isTrackingNextIndentation = false;
    }
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
    addTransition(token, state, delimitsText) {
        this.transitions.push({
            token: token,
            regex: tokens_1.default[token],
            state: state || null,
            delimitsText: delimitsText || false,
        });
        return this; // Return this for chaining
    }
    /**
     * addTextRule - Match all the way up to any of the other transitions in this state.
     *               The text rule can only be added once.
     *
     * @param  {type} type  description
     * @param  {type} state description
     * @return {Object} - returns the LexState itself for chaining.
     */
    addTextRule(type, state) {
        if (this.textRule) {
            throw new Error('Cannot add more than one text rule to a state.');
        }
        // Go through the regex of the other transitions in this state, and create a regex that will
        // match all text, up to any of those transitions.
        const rules = [];
        this.transitions.forEach((transition) => {
            if (transition.delimitsText) {
                // Surround the rule in parens
                rules.push(`(${transition.regex.source})`);
            }
        });
        // Join the rules that we got above on a |, then put them all into a negative lookahead.
        const textPattern = `((?!${rules.join('|')}).)+`;
        this.addTransition(type, state);
        // Update the regex in the transition we just added to our new one.
        this.textRule = this.transitions[this.transitions.length - 1];
        this.textRule.regex = new RegExp(textPattern);
        return this;
    }
    /**
     * setTrackNextIndentation - tell this state whether to track indentation.
     *
     * @param  {boolean} track - `true` to track, `false` otherwise.
     * @return {Object} - returns the LexState itself for chaining.
     */
    setTrackNextIndentation(track) {
        this.isTrackingNextIndentation = track;
        return this;
    }
}
exports.default = LexerState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXItc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGV4ZXIvbGV4ZXItc3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYztBQUNkLFlBQVksQ0FBQzs7Ozs7QUFFYixzREFBOEI7QUFFOUI7O0dBRUc7QUFDSCxNQUFNLFVBQVU7SUFDZDtRQUNFLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0Qiw0RUFBNEU7UUFDNUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckI7OztXQUdHO1FBQ0gsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVk7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsS0FBSyxFQUFFLEtBQUs7WUFDWixLQUFLLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLLENBQUM7WUFDcEIsS0FBSyxFQUFFLEtBQUssSUFBSSxJQUFJO1lBQ3BCLFlBQVksRUFBRSxZQUFZLElBQUksS0FBSztTQUNwQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxDQUFDLDJCQUEyQjtJQUMxQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSztRQUNyQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsNEZBQTRGO1FBQzVGLGtEQUFrRDtRQUNsRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUN0QyxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUU7Z0JBQzNCLDhCQUE4QjtnQkFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUM1QztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsd0ZBQXdGO1FBQ3hGLE1BQU0sV0FBVyxHQUFHLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2pELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWhDLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx1QkFBdUIsQ0FBQyxLQUFLO1FBQzNCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7UUFDdkMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtbm9jaGVja1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVG9rZW5zIGZyb20gJy4vdG9rZW5zJztcblxuLyoqXG4gKiBBIExleFN0YXRlIG9iamVjdCByZXByZXNlbnRzIG9uZSBvZiB0aGUgc3RhdGVzIGluIHdoaWNoIHRoZSBsZXhlciBjYW4gYmUuXG4gKi9cbmNsYXNzIExleGVyU3RhdGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKiogQSBsaXN0IG9mIHRyYW5zaXRpb24gZm9yIHRoZSBnaXZlbiBzdGF0ZS4gKi9cbiAgICB0aGlzLnRyYW5zaXRpb25zID0gW107XG4gICAgLyoqIEEgc3BlY2lhbCwgdW5pcXVlIHRyYW5zaXRpb24gZm9yIG1hdGNoaW5nIHNwYW5zIG9mIHRleHQgaW4gYW55IHN0YXRlLiAqL1xuICAgIHRoaXMudGV4dFJ1bGUgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgc3RhdGUgaXMgY29udGV4dC1ib3VuZCBieSBpbmRlbnRhdGlvblxuICAgICAqICh3aWxsIG1ha2UgdGhlIGxleGVyIGVtaXQgSW5kZW50IGFuZCBEZWRlbnQgdG9rZW5zKS5cbiAgICAgKi9cbiAgICB0aGlzLmlzVHJhY2tpbmdOZXh0SW5kZW50YXRpb24gPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGRUcmFuc2l0aW9uIC0gRGVmaW5lIGEgbmV3IHRyYW5zaXRpb24gZm9yIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSAge3R5cGV9IHRva2VuIC0gdGhlIHRva2VuIHRvIG1hdGNoXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW3N0YXRlXSAtIHRoZSBzdGF0ZSB0byB3aGljaCB0cmFuc2l0aW9uOyBpZiBub3QgcHJvdmlkZWQsIHdpbGxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluIGluIHRoZSBzYW1lIHN0YXRlLlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBbZGVsaW1pdHNUZXh0XSAtIGB0cnVlYCBpZiB0aGUgdG9rZW4gaXMgYSB0ZXh0IGRlbGltaXRlci4gQSB0ZXh0IGRlbGltaXRlcnNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyBhIHRva2VuIHdoaWNoIHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIGEgdG9rZW4sIGV2ZW4gaWYgaXRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2Vzbid0IHN0YXJ0IHRoZSBsaW5lLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0gcmV0dXJucyB0aGUgTGV4U3RhdGUgaXRzZWxmIGZvciBjaGFpbmluZy5cbiAgICovXG4gIGFkZFRyYW5zaXRpb24odG9rZW4sIHN0YXRlLCBkZWxpbWl0c1RleHQpIHtcbiAgICB0aGlzLnRyYW5zaXRpb25zLnB1c2goe1xuICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgcmVnZXg6IFRva2Vuc1t0b2tlbl0sXG4gICAgICBzdGF0ZTogc3RhdGUgfHwgbnVsbCxcbiAgICAgIGRlbGltaXRzVGV4dDogZGVsaW1pdHNUZXh0IHx8IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7IC8vIFJldHVybiB0aGlzIGZvciBjaGFpbmluZ1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZFRleHRSdWxlIC0gTWF0Y2ggYWxsIHRoZSB3YXkgdXAgdG8gYW55IG9mIHRoZSBvdGhlciB0cmFuc2l0aW9ucyBpbiB0aGlzIHN0YXRlLlxuICAgKiAgICAgICAgICAgICAgIFRoZSB0ZXh0IHJ1bGUgY2FuIG9ubHkgYmUgYWRkZWQgb25jZS5cbiAgICpcbiAgICogQHBhcmFtICB7dHlwZX0gdHlwZSAgZGVzY3JpcHRpb25cbiAgICogQHBhcmFtICB7dHlwZX0gc3RhdGUgZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHJldHVybnMgdGhlIExleFN0YXRlIGl0c2VsZiBmb3IgY2hhaW5pbmcuXG4gICAqL1xuICBhZGRUZXh0UnVsZSh0eXBlLCBzdGF0ZSkge1xuICAgIGlmICh0aGlzLnRleHRSdWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgbW9yZSB0aGFuIG9uZSB0ZXh0IHJ1bGUgdG8gYSBzdGF0ZS4nKTtcbiAgICB9XG5cbiAgICAvLyBHbyB0aHJvdWdoIHRoZSByZWdleCBvZiB0aGUgb3RoZXIgdHJhbnNpdGlvbnMgaW4gdGhpcyBzdGF0ZSwgYW5kIGNyZWF0ZSBhIHJlZ2V4IHRoYXQgd2lsbFxuICAgIC8vIG1hdGNoIGFsbCB0ZXh0LCB1cCB0byBhbnkgb2YgdGhvc2UgdHJhbnNpdGlvbnMuXG4gICAgY29uc3QgcnVsZXMgPSBbXTtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2goKHRyYW5zaXRpb24pID0+IHtcbiAgICAgIGlmICh0cmFuc2l0aW9uLmRlbGltaXRzVGV4dCkge1xuICAgICAgICAvLyBTdXJyb3VuZCB0aGUgcnVsZSBpbiBwYXJlbnNcbiAgICAgICAgcnVsZXMucHVzaChgKCR7dHJhbnNpdGlvbi5yZWdleC5zb3VyY2V9KWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gSm9pbiB0aGUgcnVsZXMgdGhhdCB3ZSBnb3QgYWJvdmUgb24gYSB8LCB0aGVuIHB1dCB0aGVtIGFsbCBpbnRvIGEgbmVnYXRpdmUgbG9va2FoZWFkLlxuICAgIGNvbnN0IHRleHRQYXR0ZXJuID0gYCgoPyEke3J1bGVzLmpvaW4oJ3wnKX0pLikrYDtcbiAgICB0aGlzLmFkZFRyYW5zaXRpb24odHlwZSwgc3RhdGUpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSByZWdleCBpbiB0aGUgdHJhbnNpdGlvbiB3ZSBqdXN0IGFkZGVkIHRvIG91ciBuZXcgb25lLlxuICAgIHRoaXMudGV4dFJ1bGUgPSB0aGlzLnRyYW5zaXRpb25zW3RoaXMudHJhbnNpdGlvbnMubGVuZ3RoIC0gMV07XG4gICAgdGhpcy50ZXh0UnVsZS5yZWdleCA9IG5ldyBSZWdFeHAodGV4dFBhdHRlcm4pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogc2V0VHJhY2tOZXh0SW5kZW50YXRpb24gLSB0ZWxsIHRoaXMgc3RhdGUgd2hldGhlciB0byB0cmFjayBpbmRlbnRhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gdHJhY2sgLSBgdHJ1ZWAgdG8gdHJhY2ssIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0gcmV0dXJucyB0aGUgTGV4U3RhdGUgaXRzZWxmIGZvciBjaGFpbmluZy5cbiAgICovXG4gIHNldFRyYWNrTmV4dEluZGVudGF0aW9uKHRyYWNrKSB7XG4gICAgdGhpcy5pc1RyYWNraW5nTmV4dEluZGVudGF0aW9uID0gdHJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGV4ZXJTdGF0ZTtcbiJdfQ==