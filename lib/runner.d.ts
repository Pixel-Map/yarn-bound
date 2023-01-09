declare class Runner {
    private noEscape;
    private yarnNodes;
    private variables;
    private functions;
    constructor();
    /**
     * Loads the yarn node data into this.nodes
     * @param dialogue {any[]} yarn dialogue as string or array
     */
    load(dialogue: string): void;
    /**
     * Set a new variable storage object
     * This must simply contain a 'get(name)' and 'set(name, value)' function
     *
     * Calling this function will clear any existing variable's values
     */
    setVariableStorage(storage: any): void;
    /**
     * Scans for <<declare>> commands and sets initial variable values
     * @param {any[]} yarn dialogue as string or array
     */
    handleDeclarations(nodes: any): void;
    registerFunction(name: any, func: any): void;
    /**
     * Generator to return each sequential dialog result starting from the given node
     * @param {string} [startNode] - The name of the yarn node to begin at
     */
    run(startNode: any): Generator<any, void, any>;
    /**
     * Evaluate a list of parser nodes, yielding the ones that need to be seen by
     * the user. Calls itself recursively if that is required by nested nodes
     * @param {Node[]} nodes
     * @param {YarnNode[]} metadata
     */
    evalNodes(nodes: any, metadata: any): any;
    /**
     * yield a shortcut result then handle the subsequent selection
     * @param {any[]} selections
     */
    handleShortcuts(selections: any, metadata: any): any;
    /**
     * Evaluates the given assignment node
     */
    evaluateAssignment(node: any): void;
    /**
     * Evaluates the given conditional node
     * Returns the statements to be run as a result of it (if any)
     */
    evaluateConditional(node: any): any;
    evaluateFunctionCall(node: any): any;
    /**
     * Evaluates an expression or literal down to its final value
     */
    evaluateExpressionOrLiteral(node: any): any;
}
declare const _default: {
    Runner: typeof Runner;
    TextResult: {
        new (text: string, hashtags: string[], metadata: import("./results").Metadata): {
            text: string;
            hashtags: string[];
            metadata: import("./results").Metadata;
        };
    };
    CommandResult: {
        new (command: string, hashtags: string[], metadata: import("./results").Metadata): {
            command: string;
            hashtags: string[];
            metadata: import("./results").Metadata;
        };
    };
    OptionsResult: {
        new (options: import("./results").Option[], metadata: import("./results").Metadata): {
            options: {
                text: string;
                isAvailable: boolean;
                hashtags: string[];
                metadata: import("./results").Metadata;
            }[];
            metadata: import("./results").Metadata;
            selected: number | undefined;
            select(index?: number): void;
        };
    };
};
export default _default;
