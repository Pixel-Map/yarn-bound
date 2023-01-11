import bondage from './bondage';
import parseLine from './line-parser';
import { CommandResult, OptionsResult, TextResult } from './results';

interface props {
  dialogue: string;
  variableStorage?: any;
  functions?: any;
  handleCommand?: any;
  combineTextAndOptionsResults?: any;
  locale?: any;
  startAt?: string;
}

export default class YarnBound {
  static OptionsResult: OptionsResult;
  static TextResult: TextResult;
  static CommandResult: CommandResult;
  public handleCommand: any;
  public combineTextAndOptionsResults: any;
  public bondage: any;
  public bufferedNode: any;
  public currentResult: any;
  public history: any;
  public locale: any;
  public runner: any;
  private generator: any;

  constructor({
    dialogue,
    variableStorage,
    functions,
    handleCommand,
    combineTextAndOptionsResults,
    locale = undefined,
    startAt = 'Start',
  }: props) {
    this.handleCommand = handleCommand;
    this.combineTextAndOptionsResults = combineTextAndOptionsResults;
    this.bondage = bondage;
    this.bufferedNode = null;
    this.currentResult = null;
    this.history = [];
    this.locale = locale;
    this.runner = new bondage.Runner();
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

  jump(startAt: string) {
    this.generator = this.runner.run(startAt);
    this.bufferedNode = null;
    this.advance();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  advance(optionIndex: undefined | number = undefined) {
    if (typeof optionIndex !== 'undefined' && this.currentResult && this.currentResult.select) {
      this.currentResult.select(optionIndex);
    }

    let next = this.bufferedNode || this.generator.next().value;
    let buffered = null;

    // We either return the command as normal or, if a handler
    // is supplied, use that and don't bother the consuming app
    if (this.handleCommand) {
      while (next instanceof bondage.CommandResult) {
        this.handleCommand(next);
        next = this.generator.next().value;
      }
    }

    // Lookahead for combining text + options, and for end of dialogue.
    // Can't look ahead of option nodes (what would you look ahead at?)
    if (!(next instanceof bondage.OptionsResult)) {
      const upcoming = this.generator.next();
      buffered = upcoming.value;
      if (
        next instanceof bondage.TextResult &&
        this.combineTextAndOptionsResults &&
        buffered instanceof bondage.OptionsResult
      ) {
        next = Object.assign(buffered, next);
        buffered = null;
      } else if (next && upcoming.done) {
        next = Object.assign(next, { isDialogueEnd: true });
      }
    }

    if (this.currentResult) {
      this.history.push(this.currentResult);
    }

    if (next instanceof bondage.TextResult) {
      parseLine(next, this.locale);
    } else if (next instanceof bondage.OptionsResult) {
      // @ts-ignore
      if (next.text) {
        parseLine(next, this.locale);
      }
      // @ts-ignore
      next.options.forEach((option) => {
        parseLine(option, this.locale);
      });
    }

    this.currentResult = next;
    this.bufferedNode = buffered;
  }

  registerFunction(name: string, func: any) {
    this.runner.registerFunction(name, func);
  }
}
