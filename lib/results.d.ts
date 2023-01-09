declare class Result {
}
declare class TextResult extends Result {
    /**
     * Create a text display result
     * @param text text to be displayed
     * @param hashtags the hashtags for the line
     * @param metadata the parent yarn data
     */
    text: string;
    hashtags: string[];
    metadata: Metadata;
    constructor(text: string, hashtags: string[], metadata: Metadata);
}
declare class CommandResult extends Result {
    /**
     * Return a command string
     * @param command the command text
     * @param hashtags the hashtags for the line
     * @param metadata the parent yarn data
     */
    command: string;
    hashtags: string[];
    metadata: Metadata;
    constructor(command: string, hashtags: string[], metadata: Metadata);
}
declare class OptionResult extends Result {
    /**
     * Strip down Conditional option for presentation
     * @param text option text to display
     * @param isAvailable whether option is available
     * @param hashtags the hashtags for the line
     * @param {object} [metadata] the parent yarn data
     */
    text: string;
    isAvailable: boolean;
    hashtags: string[];
    metadata: Metadata;
    constructor(text: string, isAvailable: boolean | undefined, hashtags: string[] | undefined, metadata: Metadata);
}
declare class OptionsResult extends Result {
    /**
     * Create a selectable list of options from the given list of text
     * @param {Node[]} [options] list of the text of options to be shown
     * @param {object} [metadata] the parent yarn data
     */
    options: OptionResult[];
    metadata: Metadata;
    selected: number | undefined;
    constructor(options: Option[], metadata: Metadata);
    select(index?: number): void;
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
declare const _default: {
    Result: typeof Result;
    TextResult: typeof TextResult;
    CommandResult: typeof CommandResult;
    OptionsResult: typeof OptionsResult;
};
export default _default;
