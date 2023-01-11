class Result {}

export class TextResult extends Result {
  /**
   * Create a text display result
   * @param text text to be displayed
   * @param hashtags the hashtags for the line
   * @param metadata the parent yarn data
   */
  public text: string;
  public hashtags: string[];
  public metadata: Metadata;

  constructor(text: string, hashtags: string[], metadata: Metadata) {
    super();
    this.text = text;
    this.hashtags = hashtags;
    this.metadata = metadata;
  }
}

export class CommandResult extends Result {
  /**
   * Return a command string
   * @param command the command text
   * @param hashtags the hashtags for the line
   * @param metadata the parent yarn data
   */
  public command: string;
  public hashtags: string[];
  public metadata: Metadata;

  constructor(command: string, hashtags: string[], metadata: Metadata) {
    super();
    this.command = command;
    this.hashtags = hashtags;
    this.metadata = metadata;
  }
}

export class OptionResult extends Result {
  /**
   * Strip down Conditional option for presentation
   * @param text option text to display
   * @param isAvailable whether option is available
   * @param hashtags the hashtags for the line
   * @param {object} [metadata] the parent yarn data
   */
  public text: string;
  public isAvailable: boolean;
  public hashtags: string[];
  public metadata: Metadata;

  constructor(text: string, isAvailable = true, hashtags: string[] = [], metadata: Metadata) {
    super();
    this.text = text;
    this.isAvailable = isAvailable;
    this.hashtags = hashtags;
    this.metadata = metadata;
  }
}

export class OptionsResult extends Result {
  /**
   * Create a selectable list of options from the given list of text
   * @param {Node[]} [options] list of the text of options to be shown
   * @param {object} [metadata] the parent yarn data
   */
  public options: OptionResult[];
  public metadata: Metadata;
  public selected: number | undefined;

  constructor(options: Option[], metadata: Metadata) {
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

export interface Metadata {
  title: string;
  filetags: string[];
}

export interface Option {
  text: string;
  isAvailable: boolean;
  hashtags: string[];
}

export interface Markups {
  name: string;
  properties: Record<string, any>;
}

