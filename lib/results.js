"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
}
class TextResult extends Result {
    /**
     * Create a text display result
     * @param text text to be displayed
     * @param hashtags the hashtags for the line
     * @param metadata the parent yarn data
     */
    text;
    hashtags;
    metadata;
    constructor(text, hashtags, metadata) {
        super();
        this.text = text;
        this.hashtags = hashtags;
        this.metadata = metadata;
    }
}
class CommandResult extends Result {
    /**
     * Return a command string
     * @param command the command text
     * @param hashtags the hashtags for the line
     * @param metadata the parent yarn data
     */
    command;
    hashtags;
    metadata;
    constructor(command, hashtags, metadata) {
        super();
        this.command = command;
        this.hashtags = hashtags;
        this.metadata = metadata;
    }
}
class OptionResult extends Result {
    /**
     * Strip down Conditional option for presentation
     * @param text option text to display
     * @param isAvailable whether option is available
     * @param hashtags the hashtags for the line
     * @param {object} [metadata] the parent yarn data
     */
    text;
    isAvailable;
    hashtags;
    metadata;
    constructor(text, isAvailable = true, hashtags = [], metadata) {
        super();
        this.text = text;
        this.isAvailable = isAvailable;
        this.hashtags = hashtags;
        this.metadata = metadata;
    }
}
class OptionsResult extends Result {
    /**
     * Create a selectable list of options from the given list of text
     * @param {Node[]} [options] list of the text of options to be shown
     * @param {object} [metadata] the parent yarn data
     */
    options;
    metadata;
    selected;
    constructor(options, metadata) {
        super();
        this.options = options.map((s) => {
            // @ts-ignore
            return new OptionResult(s.text, s.isAvailable, s.hashtags);
        });
        this.metadata = metadata;
    }
    select(index = -1) {
        if (index < 0 || index >= this.options.length) {
            throw new Error(`Cannot select option #${index}, there are ${this.options.length} options`);
        }
        this.selected = index;
    }
}
exports.default = { Result, TextResult, CommandResult, OptionsResult };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXN1bHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxNQUFNO0NBQUc7QUFFZixNQUFNLFVBQVcsU0FBUSxNQUFNO0lBQzdCOzs7OztPQUtHO0lBQ0ksSUFBSSxDQUFTO0lBQ2IsUUFBUSxDQUFXO0lBQ25CLFFBQVEsQ0FBVztJQUUxQixZQUFZLElBQVksRUFBRSxRQUFrQixFQUFFLFFBQWtCO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBRUQsTUFBTSxhQUFjLFNBQVEsTUFBTTtJQUNoQzs7Ozs7T0FLRztJQUNJLE9BQU8sQ0FBUztJQUNoQixRQUFRLENBQVc7SUFDbkIsUUFBUSxDQUFXO0lBRTFCLFlBQVksT0FBZSxFQUFFLFFBQWtCLEVBQUUsUUFBa0I7UUFDakUsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLFlBQWEsU0FBUSxNQUFNO0lBQy9COzs7Ozs7T0FNRztJQUNJLElBQUksQ0FBUztJQUNiLFdBQVcsQ0FBVTtJQUNyQixRQUFRLENBQVc7SUFDbkIsUUFBUSxDQUFXO0lBRTFCLFlBQVksSUFBWSxFQUFFLFdBQVcsR0FBRyxJQUFJLEVBQUUsV0FBcUIsRUFBRSxFQUFFLFFBQWtCO1FBQ3ZGLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBRUQsTUFBTSxhQUFjLFNBQVEsTUFBTTtJQUNoQzs7OztPQUlHO0lBQ0ksT0FBTyxDQUFpQjtJQUN4QixRQUFRLENBQVc7SUFDbkIsUUFBUSxDQUFxQjtJQUVwQyxZQUFZLE9BQWlCLEVBQUUsUUFBa0I7UUFDL0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUMvQixhQUFhO1lBQ2IsT0FBTyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixLQUFLLGVBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFDO1NBQzdGO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBaUJELGtCQUFlLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZXN1bHQge31cblxuY2xhc3MgVGV4dFJlc3VsdCBleHRlbmRzIFJlc3VsdCB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSB0ZXh0IGRpc3BsYXkgcmVzdWx0XG4gICAqIEBwYXJhbSB0ZXh0IHRleHQgdG8gYmUgZGlzcGxheWVkXG4gICAqIEBwYXJhbSBoYXNodGFncyB0aGUgaGFzaHRhZ3MgZm9yIHRoZSBsaW5lXG4gICAqIEBwYXJhbSBtZXRhZGF0YSB0aGUgcGFyZW50IHlhcm4gZGF0YVxuICAgKi9cbiAgcHVibGljIHRleHQ6IHN0cmluZztcbiAgcHVibGljIGhhc2h0YWdzOiBzdHJpbmdbXTtcbiAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcblxuICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIGhhc2h0YWdzOiBzdHJpbmdbXSwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cbn1cblxuY2xhc3MgQ29tbWFuZFJlc3VsdCBleHRlbmRzIFJlc3VsdCB7XG4gIC8qKlxuICAgKiBSZXR1cm4gYSBjb21tYW5kIHN0cmluZ1xuICAgKiBAcGFyYW0gY29tbWFuZCB0aGUgY29tbWFuZCB0ZXh0XG4gICAqIEBwYXJhbSBoYXNodGFncyB0aGUgaGFzaHRhZ3MgZm9yIHRoZSBsaW5lXG4gICAqIEBwYXJhbSBtZXRhZGF0YSB0aGUgcGFyZW50IHlhcm4gZGF0YVxuICAgKi9cbiAgcHVibGljIGNvbW1hbmQ6IHN0cmluZztcbiAgcHVibGljIGhhc2h0YWdzOiBzdHJpbmdbXTtcbiAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcblxuICBjb25zdHJ1Y3Rvcihjb21tYW5kOiBzdHJpbmcsIGhhc2h0YWdzOiBzdHJpbmdbXSwgbWV0YWRhdGE6IE1ldGFkYXRhKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvbW1hbmQgPSBjb21tYW5kO1xuICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cbn1cblxuY2xhc3MgT3B0aW9uUmVzdWx0IGV4dGVuZHMgUmVzdWx0IHtcbiAgLyoqXG4gICAqIFN0cmlwIGRvd24gQ29uZGl0aW9uYWwgb3B0aW9uIGZvciBwcmVzZW50YXRpb25cbiAgICogQHBhcmFtIHRleHQgb3B0aW9uIHRleHQgdG8gZGlzcGxheVxuICAgKiBAcGFyYW0gaXNBdmFpbGFibGUgd2hldGhlciBvcHRpb24gaXMgYXZhaWxhYmxlXG4gICAqIEBwYXJhbSBoYXNodGFncyB0aGUgaGFzaHRhZ3MgZm9yIHRoZSBsaW5lXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGFdIHRoZSBwYXJlbnQgeWFybiBkYXRhXG4gICAqL1xuICBwdWJsaWMgdGV4dDogc3RyaW5nO1xuICBwdWJsaWMgaXNBdmFpbGFibGU6IGJvb2xlYW47XG4gIHB1YmxpYyBoYXNodGFnczogc3RyaW5nW107XG4gIHB1YmxpYyBtZXRhZGF0YTogTWV0YWRhdGE7XG5cbiAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nLCBpc0F2YWlsYWJsZSA9IHRydWUsIGhhc2h0YWdzOiBzdHJpbmdbXSA9IFtdLCBtZXRhZGF0YTogTWV0YWRhdGEpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xuICAgIHRoaXMuaGFzaHRhZ3MgPSBoYXNodGFncztcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cbn1cblxuY2xhc3MgT3B0aW9uc1Jlc3VsdCBleHRlbmRzIFJlc3VsdCB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzZWxlY3RhYmxlIGxpc3Qgb2Ygb3B0aW9ucyBmcm9tIHRoZSBnaXZlbiBsaXN0IG9mIHRleHRcbiAgICogQHBhcmFtIHtOb2RlW119IFtvcHRpb25zXSBsaXN0IG9mIHRoZSB0ZXh0IG9mIG9wdGlvbnMgdG8gYmUgc2hvd25cbiAgICogQHBhcmFtIHtvYmplY3R9IFttZXRhZGF0YV0gdGhlIHBhcmVudCB5YXJuIGRhdGFcbiAgICovXG4gIHB1YmxpYyBvcHRpb25zOiBPcHRpb25SZXN1bHRbXTtcbiAgcHVibGljIG1ldGFkYXRhOiBNZXRhZGF0YTtcbiAgcHVibGljIHNlbGVjdGVkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogT3B0aW9uW10sIG1ldGFkYXRhOiBNZXRhZGF0YSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucy5tYXAoKHMpID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uUmVzdWx0KHMudGV4dCwgcy5pc0F2YWlsYWJsZSwgcy5oYXNodGFncyk7XG4gICAgfSk7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICB9XG5cbiAgc2VsZWN0KGluZGV4ID0gLTEpIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMub3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNlbGVjdCBvcHRpb24gIyR7aW5kZXh9LCB0aGVyZSBhcmUgJHt0aGlzLm9wdGlvbnMubGVuZ3RofSBvcHRpb25zYCk7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQgPSBpbmRleDtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFkYXRhIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgZmlsZXRhZ3M6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbiB7XG4gIHRleHQ6IHN0cmluZztcbiAgaXNBdmFpbGFibGU6IGJvb2xlYW47XG4gIGhhc2h0YWdzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrdXBzIHtcbiAgbmFtZTogc3RyaW5nO1xuICBwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xufVxuZXhwb3J0IGRlZmF1bHQgeyBSZXN1bHQsIFRleHRSZXN1bHQsIENvbW1hbmRSZXN1bHQsIE9wdGlvbnNSZXN1bHQgfTtcbiJdfQ==