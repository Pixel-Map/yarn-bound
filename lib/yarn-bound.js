"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const bondage_1 = __importDefault(require("./bondage"));
const line_parser_1 = __importDefault(require("./line-parser"));
class YarnBound {
    constructor({ dialogue, variableStorage, functions, handleCommand, combineTextAndOptionsResults, locale, startAt = 'Start', }) {
        this.handleCommand = handleCommand;
        this.combineTextAndOptionsResults = combineTextAndOptionsResults;
        this.bondage = bondage_1.default;
        this.bufferedNode = null;
        this.currentResult = null;
        this.history = [];
        this.locale = locale;
        this.runner = new bondage_1.default.Runner();
        this.runner.noEscape = true;
        this.runner.load(dialogue);
        if (variableStorage) {
            variableStorage.display = variableStorage.display || variableStorage.get;
            this.runner.setVariableStorage(variableStorage);
        }
        if (functions) {
            Object.entries(functions).forEach((entry) => {
                this.registerFunction(...entry);
            });
        }
        this.jump(startAt);
    }
    jump(startAt) {
        this.generator = this.runner.run(startAt);
        this.bufferedNode = null;
        this.advance();
    }
    advance(optionIndex) {
        if (typeof optionIndex !== 'undefined' &&
            this.currentResult &&
            this.currentResult.select) {
            this.currentResult.select(optionIndex);
        }
        let next = this.bufferedNode || this.generator.next().value;
        let buffered = null;
        // We either return the command as normal or, if a handler
        // is supplied, use that and don't bother the consuming app
        if (this.handleCommand) {
            while (next instanceof bondage_1.default.CommandResult) {
                this.handleCommand(next);
                next = this.generator.next().value;
            }
        }
        // Lookahead for combining text + options, and for end of dialogue.
        // Can't look ahead of option nodes (what would you look ahead at?)
        if (!(next instanceof bondage_1.default.OptionsResult)) {
            const upcoming = this.generator.next();
            buffered = upcoming.value;
            if (next instanceof bondage_1.default.TextResult &&
                this.combineTextAndOptionsResults &&
                buffered instanceof bondage_1.default.OptionsResult) {
                next = Object.assign(buffered, next);
                buffered = null;
            }
            else if (next && upcoming.done) {
                next = Object.assign(next, { isDialogueEnd: true });
            }
        }
        if (this.currentResult) {
            this.history.push(this.currentResult);
        }
        if (next instanceof bondage_1.default.TextResult) {
            (0, line_parser_1.default)(next, this.locale);
        }
        else if (next instanceof bondage_1.default.OptionsResult) {
            if (next.text) {
                (0, line_parser_1.default)(next, this.locale);
            }
            next.options.forEach((option) => {
                (0, line_parser_1.default)(option, this.locale);
            });
        }
        this.currentResult = next;
        this.bufferedNode = buffered;
    }
    registerFunction(name, func) {
        this.runner.registerFunction(name, func);
    }
}
exports.default = YarnBound;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFybi1ib3VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy95YXJuLWJvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsY0FBYztBQUNkLHdEQUFnQztBQUNoQyxnRUFBc0M7QUFFdEMsTUFBcUIsU0FBUztJQUM1QixZQUFhLEVBQ1gsUUFBUSxFQUNSLGVBQWUsRUFDZixTQUFTLEVBQ1QsYUFBYSxFQUNiLDRCQUE0QixFQUM1QixNQUFNLEVBQ04sT0FBTyxHQUFHLE9BQU8sR0FDbEI7UUFDQyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsNEJBQTRCLEdBQUcsNEJBQTRCLENBQUM7UUFDakUsSUFBSSxDQUFDLE9BQU8sR0FBRyxpQkFBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUU1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQixJQUFJLGVBQWUsRUFBRTtZQUNuQixlQUFlLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQztZQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtB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QUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUMvQixDQUFDO0lBRUQsZ0JBQWdCLENBQUUsSUFBSSxFQUFFLElBQUk7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGO0FBckdELDRCQXFHQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgYm9uZGFnZSBmcm9tICcuL2JvbmRhZ2UnO1xuaW1wb3J0IHBhcnNlTGluZSBmcm9tICcuL2xpbmUtcGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWWFybkJvdW5kIHtcbiAgY29uc3RydWN0b3IgKHtcbiAgICBkaWFsb2d1ZSxcbiAgICB2YXJpYWJsZVN0b3JhZ2UsXG4gICAgZnVuY3Rpb25zLFxuICAgIGhhbmRsZUNvbW1hbmQsXG4gICAgY29tYmluZVRleHRBbmRPcHRpb25zUmVzdWx0cyxcbiAgICBsb2NhbGUsXG4gICAgc3RhcnRBdCA9ICdTdGFydCcsXG4gIH0pIHtcbiAgICB0aGlzLmhhbmRsZUNvbW1hbmQgPSBoYW5kbGVDb21tYW5kO1xuICAgIHRoaXMuY29tYmluZVRleHRBbmRPcHRpb25zUmVzdWx0cyA9IGNvbWJpbmVUZXh0QW5kT3B0aW9uc1Jlc3VsdHM7XG4gICAgdGhpcy5ib25kYWdlID0gYm9uZGFnZTtcbiAgICB0aGlzLmJ1ZmZlcmVkTm9kZSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50UmVzdWx0ID0gbnVsbDtcbiAgICB0aGlzLmhpc3RvcnkgPSBbXTtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgICB0aGlzLnJ1bm5lciA9IG5ldyBib25kYWdlLlJ1bm5lcigpO1xuICAgIHRoaXMucnVubmVyLm5vRXNjYXBlID0gdHJ1ZTtcblxuICAgIHRoaXMucnVubmVyLmxvYWQoZGlhbG9ndWUpO1xuXG4gICAgaWYgKHZhcmlhYmxlU3RvcmFnZSkge1xuICAgICAgdmFyaWFibGVTdG9yYWdlLmRpc3BsYXkgPSB2YXJpYWJsZVN0b3JhZ2UuZGlzcGxheSB8fCB2YXJpYWJsZVN0b3JhZ2UuZ2V0O1xuICAgICAgdGhpcy5ydW5uZXIuc2V0VmFyaWFibGVTdG9yYWdlKHZhcmlhYmxlU3RvcmFnZSk7XG4gICAgfVxuICAgIGlmIChmdW5jdGlvbnMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGZ1bmN0aW9ucykuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckZ1bmN0aW9uKC4uLmVudHJ5KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuanVtcChzdGFydEF0KTtcbiAgfVxuXG4gIGp1bXAgKHN0YXJ0QXQpIHtcbiAgICB0aGlzLmdlbmVyYXRvciA9IHRoaXMucnVubmVyLnJ1bihzdGFydEF0KTtcbiAgICB0aGlzLmJ1ZmZlcmVkTm9kZSA9IG51bGw7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gIH1cblxuICBhZHZhbmNlIChvcHRpb25JbmRleCkge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBvcHRpb25JbmRleCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdGhpcy5jdXJyZW50UmVzdWx0ICYmXG4gICAgICAgIHRoaXMuY3VycmVudFJlc3VsdC5zZWxlY3RcbiAgICApIHtcbiAgICAgIHRoaXMuY3VycmVudFJlc3VsdC5zZWxlY3Qob3B0aW9uSW5kZXgpO1xuICAgIH1cblxuICAgIGxldCBuZXh0ID0gdGhpcy5idWZmZXJlZE5vZGUgfHwgdGhpcy5nZW5lcmF0b3IubmV4dCgpLnZhbHVlO1xuICAgIGxldCBidWZmZXJlZCA9IG51bGw7XG5cbiAgICAvLyBXZSBlaXRoZXIgcmV0dXJuIHRoZSBjb21tYW5kIGFzIG5vcm1hbCBvciwgaWYgYSBoYW5kbGVyXG4gICAgLy8gaXMgc3VwcGxpZWQsIHVzZSB0aGF0IGFuZCBkb24ndCBib3RoZXIgdGhlIGNvbnN1bWluZyBhcHBcbiAgICBpZiAodGhpcy5oYW5kbGVDb21tYW5kKSB7XG4gICAgICB3aGlsZSAobmV4dCBpbnN0YW5jZW9mIGJvbmRhZ2UuQ29tbWFuZFJlc3VsdCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNvbW1hbmQobmV4dCk7XG4gICAgICAgIG5leHQgPSB0aGlzLmdlbmVyYXRvci5uZXh0KCkudmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTG9va2FoZWFkIGZvciBjb21iaW5pbmcgdGV4dCArIG9wdGlvbnMsIGFuZCBmb3IgZW5kIG9mIGRpYWxvZ3VlLlxuICAgIC8vIENhbid0IGxvb2sgYWhlYWQgb2Ygb3B0aW9uIG5vZGVzICh3aGF0IHdvdWxkIHlvdSBsb29rIGFoZWFkIGF0PylcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgYm9uZGFnZS5PcHRpb25zUmVzdWx0KSkge1xuICAgICAgY29uc3QgdXBjb21pbmcgPSB0aGlzLmdlbmVyYXRvci5uZXh0KCk7XG4gICAgICBidWZmZXJlZCA9IHVwY29taW5nLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBuZXh0IGluc3RhbmNlb2YgYm9uZGFnZS5UZXh0UmVzdWx0ICYmXG4gICAgICAgIHRoaXMuY29tYmluZVRleHRBbmRPcHRpb25zUmVzdWx0cyAmJlxuICAgICAgICAgIGJ1ZmZlcmVkIGluc3RhbmNlb2YgYm9uZGFnZS5PcHRpb25zUmVzdWx0XG4gICAgICApIHtcbiAgICAgICAgbmV4dCA9IE9iamVjdC5hc3NpZ24oYnVmZmVyZWQsIG5leHQpO1xuICAgICAgICBidWZmZXJlZCA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKG5leHQgJiYgdXBjb21pbmcuZG9uZSkge1xuICAgICAgICBuZXh0ID0gT2JqZWN0LmFzc2lnbihuZXh0LCB7IGlzRGlhbG9ndWVFbmQ6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudFJlc3VsdCkge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5jdXJyZW50UmVzdWx0KTtcbiAgICB9XG5cbiAgICBpZiAobmV4dCBpbnN0YW5jZW9mIGJvbmRhZ2UuVGV4dFJlc3VsdCkge1xuICAgICAgcGFyc2VMaW5lKG5leHQsIHRoaXMubG9jYWxlKTtcbiAgICB9IGVsc2UgaWYgKG5leHQgaW5zdGFuY2VvZiBib25kYWdlLk9wdGlvbnNSZXN1bHQpIHtcbiAgICAgIGlmIChuZXh0LnRleHQpIHtcbiAgICAgICAgcGFyc2VMaW5lKG5leHQsIHRoaXMubG9jYWxlKTtcbiAgICAgIH1cbiAgICAgIG5leHQub3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgcGFyc2VMaW5lKG9wdGlvbiwgdGhpcy5sb2NhbGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UmVzdWx0ID0gbmV4dDtcbiAgICB0aGlzLmJ1ZmZlcmVkTm9kZSA9IGJ1ZmZlcmVkO1xuICB9XG5cbiAgcmVnaXN0ZXJGdW5jdGlvbiAobmFtZSwgZnVuYykge1xuICAgIHRoaXMucnVubmVyLnJlZ2lzdGVyRnVuY3Rpb24obmFtZSwgZnVuYyk7XG4gIH1cbn1cbiJdfQ==