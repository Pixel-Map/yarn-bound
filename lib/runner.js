"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const convert_yarn_to_js_1 = __importDefault(require("./convert-yarn-to-js"));
const default_variable_storage_1 = __importDefault(require("./default-variable-storage"));
const nodes_1 = __importDefault(require("./parser/nodes"));
const parser_1 = __importDefault(require("./parser/parser"));
const results_1 = __importDefault(require("./results"));
const nodeTypes = nodes_1.default.types;
class Runner {
    noEscape;
    yarnNodes;
    variables;
    functions;
    constructor() {
        this.noEscape = false;
        this.yarnNodes = {};
        this.variables = new default_variable_storage_1.default();
        this.functions = {};
    }
    /**
     * Loads the yarn node data into this.nodes
     * @param dialogue {any[]} yarn dialogue as string or array
     */
    load(dialogue) {
        if (!dialogue) {
            throw new Error('No dialogue supplied');
        }
        let nodes;
        if (typeof dialogue === 'string') {
            nodes = (0, convert_yarn_to_js_1.default)(dialogue);
        }
        else {
            nodes = dialogue;
        }
        nodes.forEach((node) => {
            if (!node.title) {
                throw new Error(`Node needs a title: ${JSON.stringify(node)}`);
            }
            else if (node.title.split('.').length > 1) {
                throw new Error(`Node title cannot contain a dot: ${node.title}`);
            }
            if (!node.body) {
                throw new Error(`Node needs a body: ${JSON.stringify(node)}`);
            }
            if (this.yarnNodes[node.title]) {
                throw new Error(`Duplicate node title: ${node.title}`);
            }
            this.yarnNodes[node.title] = node;
        });
        parser_1.default.yy.areDeclarationsHandled = false;
        parser_1.default.yy.declarations = {};
        this.handleDeclarations(nodes);
        parser_1.default.yy.areDeclarationsHandled = true;
    }
    /**
     * Set a new variable storage object
     * This must simply contain a 'get(name)' and 'set(name, value)' function
     *
     * Calling this function will clear any existing variable's values
     */
    setVariableStorage(storage) {
        if (typeof storage.set !== 'function' || typeof storage.get !== 'function') {
            throw new Error('Variable Storage object must contain both a "set" and "get" function');
        }
        this.variables = storage;
    }
    /**
     * Scans for <<declare>> commands and sets initial variable values
     * @param {any[]} yarn dialogue as string or array
     */
    handleDeclarations(nodes) {
        const exampleValues = {
            Number: 0,
            String: '',
            Boolean: false,
        };
        const allLines = nodes.reduce((acc, node) => {
            const nodeLines = node.body.split(/\r?\n+/);
            return [...acc, ...nodeLines];
        }, []);
        const declareLines = allLines.reduce((acc, line) => {
            const match = line.match(/^<<declare .+>>/);
            return match ? [...acc, line] : acc;
        }, []);
        if (declareLines.length) {
            parser_1.default.parse(declareLines.join('\n'));
        }
        Object.entries(parser_1.default.yy.declarations).forEach(([variableName, { expression, explicitType }]) => {
            const value = this.evaluateExpressionOrLiteral(expression);
            if (explicitType && typeof value !== typeof exampleValues[explicitType]) {
                throw new Error(`Cannot declare value ${value} as type ${explicitType} for variable ${variableName}`);
            }
            if (!this.variables.get(variableName)) {
                this.variables.set(variableName, value);
            }
        });
    }
    registerFunction(name, func) {
        if (typeof func !== 'function') {
            throw new Error('Registered function must be...well...a function');
        }
        this.functions[name] = func;
    }
    /**
     * Generator to return each sequential dialog result starting from the given node
     * @param {string} [startNode] - The name of the yarn node to begin at
     */
    *run(startNode) {
        let jumpTo = startNode;
        while (jumpTo) {
            const yarnNode = this.yarnNodes[jumpTo];
            if (yarnNode === undefined) {
                throw new Error(`Node "${startNode}" does not exist`);
            }
            // Parse the entire node
            const parserNodes = Array.from(parser_1.default.parse(yarnNode.body));
            const metadata = { ...yarnNode };
            delete metadata.body;
            const result = yield* this.evalNodes(parserNodes, metadata);
            jumpTo = result && result.jump;
        }
    }
    /**
     * Evaluate a list of parser nodes, yielding the ones that need to be seen by
     * the user. Calls itself recursively if that is required by nested nodes
     * @param {Node[]} nodes
     * @param {YarnNode[]} metadata
     */
    *evalNodes(nodes, metadata) {
        let shortcutNodes = [];
        let textRun = '';
        const filteredNodes = nodes.filter(Boolean);
        // Yield the individual user-visible results
        // Need to accumulate all adjacent selectables
        // into one list (hence some of the weirdness here)
        for (let nodeIdx = 0; nodeIdx < filteredNodes.length; nodeIdx += 1) {
            const node = filteredNodes[nodeIdx];
            const nextNode = filteredNodes[nodeIdx + 1];
            // Text and the output of Inline Expressions
            // are combined to deliver a TextNode.
            if (node instanceof nodeTypes.Text || node instanceof nodeTypes.Expression) {
                textRun += this.evaluateExpressionOrLiteral(node).toString();
                if (nextNode &&
                    node.lineNum === nextNode.lineNum &&
                    (nextNode instanceof nodeTypes.Text || nextNode instanceof nodeTypes.Expression)) {
                    // Same line, with another text equivalent to add to the
                    // text run further on in the loop, so don't yield.
                }
                else {
                    yield new results_1.default.TextResult(textRun, node.hashtags, metadata);
                    textRun = '';
                }
            }
            else if (node instanceof nodeTypes.Shortcut) {
                shortcutNodes.push(node);
                if (!(nextNode instanceof nodeTypes.Shortcut)) {
                    // Last shortcut in the series, so yield the shortcuts.
                    const result = yield* this.handleShortcuts(shortcutNodes, metadata);
                    if (result && (result.stop || result.jump)) {
                        return result;
                    }
                    shortcutNodes = [];
                }
            }
            else if (node instanceof nodeTypes.Assignment) {
                this.evaluateAssignment(node);
            }
            else if (node instanceof nodeTypes.Conditional) {
                // Get the results of the conditional
                const evalResult = this.evaluateConditional(node);
                if (evalResult) {
                    // Run the remaining results
                    const result = yield* this.evalNodes(evalResult, metadata);
                    if (result && (result.stop || result.jump)) {
                        return result;
                    }
                }
            }
            else if (node instanceof nodes_1.default.JumpCommandNode) {
                // ignore the rest of this outer loop and
                // tell parent loops to ignore following nodes.
                // Recursive call here would cause stack overflow
                return { jump: node.destination };
            }
            else if (node instanceof nodes_1.default.StopCommandNode) {
                // ignore the rest of this outer loop and
                // tell parent loops to ignore following nodes
                return { stop: true };
            }
            else {
                const command = this.evaluateExpressionOrLiteral(node.command);
                yield new results_1.default.CommandResult(command, node.hashtags, metadata);
            }
        }
        return undefined;
    }
    /**
     * yield a shortcut result then handle the subsequent selection
     * @param {any[]} selections
     */
    *handleShortcuts(selections, metadata) {
        // Multiple options to choose from (or just a single shortcut)
        // Tag any conditional dialog options that result to false,
        // the consuming app does the actual filtering or whatever
        const transformedSelections = selections.map((s) => {
            let isAvailable = true;
            if (s.conditionalExpression && !this.evaluateExpressionOrLiteral(s.conditionalExpression)) {
                isAvailable = false;
            }
            const text = this.evaluateExpressionOrLiteral(s.text);
            return Object.assign(s, { isAvailable, text });
        });
        const optionsResult = new results_1.default.OptionsResult(transformedSelections, metadata);
        yield optionsResult;
        if (typeof optionsResult.selected === 'number') {
            const selectedOption = transformedSelections[optionsResult.selected];
            if (selectedOption.content) {
                // Recursively go through the nodes nested within
                return yield* this.evalNodes(selectedOption.content, metadata);
            }
        }
        else {
            throw new Error('No option selected before resuming dialogue');
        }
        return undefined;
    }
    /**
     * Evaluates the given assignment node
     */
    evaluateAssignment(node) {
        const result = this.evaluateExpressionOrLiteral(node.expression);
        const oldValue = this.variables.get(node.variableName);
        if (oldValue && typeof oldValue !== typeof result) {
            throw new Error(`Variable ${node.variableName} is already type ${typeof oldValue}; cannot set equal to ${result} of type ${typeof result}`);
        }
        this.variables.set(node.variableName, result);
    }
    /**
     * Evaluates the given conditional node
     * Returns the statements to be run as a result of it (if any)
     */
    evaluateConditional(node) {
        if (node.type === 'IfNode') {
            if (this.evaluateExpressionOrLiteral(node.expression)) {
                return node.statement;
            }
        }
        else if (node.type === 'IfElseNode' || node.type === 'ElseIfNode') {
            if (this.evaluateExpressionOrLiteral(node.expression)) {
                return node.statement;
            }
            if (node.elseStatement) {
                return this.evaluateConditional(node.elseStatement);
            }
        }
        else {
            // ElseNode
            return node.statement;
        }
        return null;
    }
    evaluateFunctionCall(node) {
        if (this.functions[node.functionName]) {
            return this.functions[node.functionName](...node.args.map(this.evaluateExpressionOrLiteral, this));
        }
        throw new Error(`Function "${node.functionName}" not found`);
    }
    /**
     * Evaluates an expression or literal down to its final value
     */
    evaluateExpressionOrLiteral(node) {
        // A combined array of text and inline expressions to be treated as one.
        // Could probably be cleaned up by introducing a new node type.
        if (Array.isArray(node)) {
            return node.reduce((acc, n) => {
                return acc + this.evaluateExpressionOrLiteral(n).toString();
            }, '');
        }
        const nodeHandlers = {
            UnaryMinusExpressionNode: (a) => {
                return -a;
            },
            ArithmeticExpressionAddNode: (a, b) => {
                return a + b;
            },
            ArithmeticExpressionMinusNode: (a, b) => {
                return a - b;
            },
            ArithmeticExpressionExponentNode: (a, b) => {
                return a ** b;
            },
            ArithmeticExpressionMultiplyNode: (a, b) => {
                return a * b;
            },
            ArithmeticExpressionDivideNode: (a, b) => {
                return a / b;
            },
            ArithmeticExpressionModuloNode: (a, b) => {
                return a % b;
            },
            NegatedBooleanExpressionNode: (a) => {
                return !a;
            },
            BooleanOrExpressionNode: (a, b) => {
                return a || b;
            },
            BooleanAndExpressionNode: (a, b) => {
                return a && b;
            },
            BooleanXorExpressionNode: (a, b) => {
                // eslint-disable-next-line no-bitwise
                return !!(a ^ b);
            },
            EqualToExpressionNode: (a, b) => {
                return a === b;
            },
            NotEqualToExpressionNode: (a, b) => {
                return a !== b;
            },
            GreaterThanExpressionNode: (a, b) => {
                return a > b;
            },
            GreaterThanOrEqualToExpressionNode: (a, b) => {
                return a >= b;
            },
            LessThanExpressionNode: (a, b) => {
                return a < b;
            },
            LessThanOrEqualToExpressionNode: (a, b) => {
                return a <= b;
            },
            TextNode: (a) => {
                return a.text;
            },
            EscapedCharacterNode: (a) => {
                return this.noEscape ? a.text : a.text.slice(1);
            },
            NumericLiteralNode: (a) => {
                return parseFloat(a.numericLiteral);
            },
            StringLiteralNode: (a) => {
                return `${a.stringLiteral}`;
            },
            BooleanLiteralNode: (a) => {
                return a.booleanLiteral === 'true';
            },
            VariableNode: (a) => {
                return this.variables.get(a.variableName);
            },
            FunctionCallNode: (a) => {
                return this.evaluateFunctionCall(a);
            },
            InlineExpressionNode: (a) => {
                return a;
            },
        };
        const handler = nodeHandlers[node.type];
        if (!handler) {
            throw new Error(`node type not recognized: ${node.type}`);
        }
        return handler(node instanceof nodeTypes.Expression
            ? this.evaluateExpressionOrLiteral(node.expression || node.expression1)
            : node, node.expression2 ? this.evaluateExpressionOrLiteral(node.expression2) : node);
    }
}
exports.default = {
    Runner,
    TextResult: results_1.default.TextResult,
    CommandResult: results_1.default.CommandResult,
    OptionsResult: results_1.default.OptionsResult,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3J1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGNBQWM7QUFDZCw4RUFBK0M7QUFDL0MsMEZBQWdFO0FBQ2hFLDJEQUFtQztBQUNuQyw2REFBcUM7QUFDckMsd0RBQWdDO0FBRWhDLE1BQU0sU0FBUyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUM7QUFFOUIsTUFBTSxNQUFNO0lBQ0YsUUFBUSxDQUFVO0lBQ2xCLFNBQVMsQ0FBSztJQUNkLFNBQVMsQ0FBeUI7SUFDbEMsU0FBUyxDQUFLO0lBQ3RCO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGtDQUFzQixFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksQ0FBQyxRQUFnQjtRQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxLQUFLLENBQUM7UUFDVixJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNoQyxLQUFLLEdBQUcsSUFBQSw0QkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO2FBQU07WUFDTCxLQUFLLEdBQUcsUUFBUSxDQUFDO1NBQ2xCO1FBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2hFO2lCQUFNLElBQUks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QVUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3ZFLENBQUMsQ0FBQyxJQUFJLEVBQ1IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM3RSxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsa0JBQWU7SUFDYixNQUFNO0lBQ04sVUFBVSxFQUFFLGlCQUFPLENBQUMsVUFBVTtJQUM5QixhQUFhLEVBQUUsaUJBQU8sQ0FBQyxhQUFhO0lBQ3BDLGFBQWEsRUFBRSxpQkFBTyxDQUFDLGFBQWE7Q0FDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgY29udmVydFlhcm4gZnJvbSAnLi9jb252ZXJ0LXlhcm4tdG8tanMnO1xuaW1wb3J0IERlZmF1bHRWYXJpYWJsZVN0b3JhZ2UgZnJvbSAnLi9kZWZhdWx0LXZhcmlhYmxlLXN0b3JhZ2UnO1xuaW1wb3J0IHR5cGVzIGZyb20gJy4vcGFyc2VyL25vZGVzJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9wYXJzZXIvcGFyc2VyJztcbmltcG9ydCByZXN1bHRzIGZyb20gJy4vcmVzdWx0cyc7XG5cbmNvbnN0IG5vZGVUeXBlcyA9IHR5cGVzLnR5cGVzO1xuXG5jbGFzcyBSdW5uZXIge1xuICBwcml2YXRlIG5vRXNjYXBlOiBib29sZWFuO1xuICBwcml2YXRlIHlhcm5Ob2Rlczoge307XG4gIHByaXZhdGUgdmFyaWFibGVzOiBEZWZhdWx0VmFyaWFibGVTdG9yYWdlO1xuICBwcml2YXRlIGZ1bmN0aW9uczoge307XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubm9Fc2NhcGUgPSBmYWxzZTtcbiAgICB0aGlzLnlhcm5Ob2RlcyA9IHt9O1xuICAgIHRoaXMudmFyaWFibGVzID0gbmV3IERlZmF1bHRWYXJpYWJsZVN0b3JhZ2UoKTtcbiAgICB0aGlzLmZ1bmN0aW9ucyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSB5YXJuIG5vZGUgZGF0YSBpbnRvIHRoaXMubm9kZXNcbiAgICogQHBhcmFtIGRpYWxvZ3VlIHthbnlbXX0geWFybiBkaWFsb2d1ZSBhcyBzdHJpbmcgb3IgYXJyYXlcbiAgICovXG4gIGxvYWQoZGlhbG9ndWU6IHN0cmluZykge1xuICAgIGlmICghZGlhbG9ndWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZGlhbG9ndWUgc3VwcGxpZWQnKTtcbiAgICB9XG4gICAgbGV0IG5vZGVzO1xuICAgIGlmICh0eXBlb2YgZGlhbG9ndWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBub2RlcyA9IGNvbnZlcnRZYXJuKGRpYWxvZ3VlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZXMgPSBkaWFsb2d1ZTtcbiAgICB9XG5cbiAgICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICBpZiAoIW5vZGUudGl0bGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb2RlIG5lZWRzIGEgdGl0bGU6ICR7SlNPTi5zdHJpbmdpZnkobm9kZSl9YCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUudGl0bGUuc3BsaXQoJy4nKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm9kZSB0aXRsZSBjYW5ub3QgY29udGFpbiBhIGRvdDogJHtub2RlLnRpdGxlfWApO1xuICAgICAgfVxuICAgICAgaWYgKCFub2RlLmJvZHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb2RlIG5lZWRzIGEgYm9keTogJHtKU09OLnN0cmluZ2lmeShub2RlKX1gKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnlhcm5Ob2Rlc1tub2RlLnRpdGxlXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBub2RlIHRpdGxlOiAke25vZGUudGl0bGV9YCk7XG4gICAgICB9XG4gICAgICB0aGlzLnlhcm5Ob2Rlc1tub2RlLnRpdGxlXSA9IG5vZGU7XG4gICAgfSk7XG5cbiAgICBwYXJzZXIueXkuYXJlRGVjbGFyYXRpb25zSGFuZGxlZCA9IGZhbHNlO1xuICAgIHBhcnNlci55eS5kZWNsYXJhdGlvbnMgPSB7fTtcbiAgICB0aGlzLmhhbmRsZURlY2xhcmF0aW9ucyhub2Rlcyk7XG4gICAgcGFyc2VyLnl5LmFyZURlY2xhcmF0aW9uc0hhbmRsZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhIG5ldyB2YXJpYWJsZSBzdG9yYWdlIG9iamVjdFxuICAgKiBUaGlzIG11c3Qgc2ltcGx5IGNvbnRhaW4gYSAnZ2V0KG5hbWUpJyBhbmQgJ3NldChuYW1lLCB2YWx1ZSknIGZ1bmN0aW9uXG4gICAqXG4gICAqIENhbGxpbmcgdGhpcyBmdW5jdGlvbiB3aWxsIGNsZWFyIGFueSBleGlzdGluZyB2YXJpYWJsZSdzIHZhbHVlc1xuICAgKi9cbiAgc2V0VmFyaWFibGVTdG9yYWdlKHN0b3JhZ2UpIHtcbiAgICBpZiAodHlwZW9mIHN0b3JhZ2Uuc2V0ICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBzdG9yYWdlLmdldCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYXJpYWJsZSBTdG9yYWdlIG9iamVjdCBtdXN0IGNvbnRhaW4gYm90aCBhIFwic2V0XCIgYW5kIFwiZ2V0XCIgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICB0aGlzLnZhcmlhYmxlcyA9IHN0b3JhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2NhbnMgZm9yIDw8ZGVjbGFyZT4+IGNvbW1hbmRzIGFuZCBzZXRzIGluaXRpYWwgdmFyaWFibGUgdmFsdWVzXG4gICAqIEBwYXJhbSB7YW55W119IHlhcm4gZGlhbG9ndWUgYXMgc3RyaW5nIG9yIGFycmF5XG4gICAqL1xuICBoYW5kbGVEZWNsYXJhdGlvbnMobm9kZXMpIHtcbiAgICBjb25zdCBleGFtcGxlVmFsdWVzID0ge1xuICAgICAgTnVtYmVyOiAwLFxuICAgICAgU3RyaW5nOiAnJyxcbiAgICAgIEJvb2xlYW46IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCBhbGxMaW5lcyA9IG5vZGVzLnJlZHVjZSgoYWNjLCBub2RlKSA9PiB7XG4gICAgICBjb25zdCBub2RlTGluZXMgPSBub2RlLmJvZHkuc3BsaXQoL1xccj9cXG4rLyk7XG4gICAgICByZXR1cm4gWy4uLmFjYywgLi4ubm9kZUxpbmVzXTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBkZWNsYXJlTGluZXMgPSBhbGxMaW5lcy5yZWR1Y2UoKGFjYywgbGluZSkgPT4ge1xuICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9ePDxkZWNsYXJlIC4rPj4vKTtcbiAgICAgIHJldHVybiBtYXRjaCA/IFsuLi5hY2MsIGxpbmVdIDogYWNjO1xuICAgIH0sIFtdKTtcbiAgICBpZiAoZGVjbGFyZUxpbmVzLmxlbmd0aCkge1xuICAgICAgcGFyc2VyLnBhcnNlKGRlY2xhcmVMaW5lcy5qb2luKCdcXG4nKSk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmVudHJpZXMocGFyc2VyLnl5LmRlY2xhcmF0aW9ucykuZm9yRWFjaCgoW3ZhcmlhYmxlTmFtZSwgeyBleHByZXNzaW9uLCBleHBsaWNpdFR5cGUgfV0pID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb25PckxpdGVyYWwoZXhwcmVzc2lvbik7XG5cbiAgICAgIGlmIChleHBsaWNpdFR5cGUgJiYgdHlwZW9mIHZhbHVlICE9PSB0eXBlb2YgZXhhbXBsZVZhbHVlc1tleHBsaWNpdFR5cGVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGRlY2xhcmUgdmFsdWUgJHt2YWx1ZX0gYXMgdHlwZSAke2V4cGxpY2l0VHlwZX0gZm9yIHZhcmlhYmxlICR7dmFyaWFibGVOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMudmFyaWFibGVzLmdldCh2YXJpYWJsZU5hbWUpKSB7XG4gICAgICAgIHRoaXMudmFyaWFibGVzLnNldCh2YXJpYWJsZU5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyRnVuY3Rpb24obmFtZSwgZnVuYykge1xuICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWdpc3RlcmVkIGZ1bmN0aW9uIG11c3QgYmUuLi53ZWxsLi4uYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMuZnVuY3Rpb25zW25hbWVdID0gZnVuYztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0b3IgdG8gcmV0dXJuIGVhY2ggc2VxdWVudGlhbCBkaWFsb2cgcmVzdWx0IHN0YXJ0aW5nIGZyb20gdGhlIGdpdmVuIG5vZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzdGFydE5vZGVdIC0gVGhlIG5hbWUgb2YgdGhlIHlhcm4gbm9kZSB0byBiZWdpbiBhdFxuICAgKi9cbiAgKnJ1bihzdGFydE5vZGUpIHtcbiAgICBsZXQganVtcFRvID0gc3RhcnROb2RlO1xuICAgIHdoaWxlIChqdW1wVG8pIHtcbiAgICAgIGNvbnN0IHlhcm5Ob2RlID0gdGhpcy55YXJuTm9kZXNbanVtcFRvXTtcbiAgICAgIGlmICh5YXJuTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm9kZSBcIiR7c3RhcnROb2RlfVwiIGRvZXMgbm90IGV4aXN0YCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBhcnNlIHRoZSBlbnRpcmUgbm9kZVxuICAgICAgY29uc3QgcGFyc2VyTm9kZXMgPSBBcnJheS5mcm9tKHBhcnNlci5wYXJzZSh5YXJuTm9kZS5ib2R5KSk7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IHsgLi4ueWFybk5vZGUgfTtcbiAgICAgIGRlbGV0ZSBtZXRhZGF0YS5ib2R5O1xuICAgICAgY29uc3QgcmVzdWx0ID0geWllbGQqIHRoaXMuZXZhbE5vZGVzKHBhcnNlck5vZGVzLCBtZXRhZGF0YSk7XG4gICAgICBqdW1wVG8gPSByZXN1bHQgJiYgcmVzdWx0Lmp1bXA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIGEgbGlzdCBvZiBwYXJzZXIgbm9kZXMsIHlpZWxkaW5nIHRoZSBvbmVzIHRoYXQgbmVlZCB0byBiZSBzZWVuIGJ5XG4gICAqIHRoZSB1c2VyLiBDYWxscyBpdHNlbGYgcmVjdXJzaXZlbHkgaWYgdGhhdCBpcyByZXF1aXJlZCBieSBuZXN0ZWQgbm9kZXNcbiAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzXG4gICAqIEBwYXJhbSB7WWFybk5vZGVbXX0gbWV0YWRhdGFcbiAgICovXG4gICpldmFsTm9kZXMobm9kZXMsIG1ldGFkYXRhKSB7XG4gICAgbGV0IHNob3J0Y3V0Tm9kZXMgPSBbXTtcbiAgICBsZXQgdGV4dFJ1biA9ICcnO1xuXG4gICAgY29uc3QgZmlsdGVyZWROb2RlcyA9IG5vZGVzLmZpbHRlcihCb29sZWFuKTtcblxuICAgIC8vIFlpZWxkIHRoZSBpbmRpdmlkdWFsIHVzZXItdmlzaWJsZSByZXN1bHRzXG4gICAgLy8gTmVlZCB0byBhY2N1bXVsYXRlIGFsbCBhZGphY2VudCBzZWxlY3RhYmxlc1xuICAgIC8vIGludG8gb25lIGxpc3QgKGhlbmNlIHNvbWUgb2YgdGhlIHdlaXJkbmVzcyBoZXJlKVxuICAgIGZvciAobGV0IG5vZGVJZHggPSAwOyBub2RlSWR4IDwgZmlsdGVyZWROb2Rlcy5sZW5ndGg7IG5vZGVJZHggKz0gMSkge1xuICAgICAgY29uc3Qgbm9kZSA9IGZpbHRlcmVkTm9kZXNbbm9kZUlkeF07XG4gICAgICBjb25zdCBuZXh0Tm9kZSA9IGZpbHRlcmVkTm9kZXNbbm9kZUlkeCArIDFdO1xuXG4gICAgICAvLyBUZXh0IGFuZCB0aGUgb3V0cHV0IG9mIElubGluZSBFeHByZXNzaW9uc1xuICAgICAgLy8gYXJlIGNvbWJpbmVkIHRvIGRlbGl2ZXIgYSBUZXh0Tm9kZS5cbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2Ygbm9kZVR5cGVzLlRleHQgfHwgbm9kZSBpbnN0YW5jZW9mIG5vZGVUeXBlcy5FeHByZXNzaW9uKSB7XG4gICAgICAgIHRleHRSdW4gKz0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb25PckxpdGVyYWwobm9kZSkudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5leHROb2RlICYmXG4gICAgICAgICAgbm9kZS5saW5lTnVtID09PSBuZXh0Tm9kZS5saW5lTnVtICYmXG4gICAgICAgICAgKG5leHROb2RlIGluc3RhbmNlb2Ygbm9kZVR5cGVzLlRleHQgfHwgbmV4dE5vZGUgaW5zdGFuY2VvZiBub2RlVHlwZXMuRXhwcmVzc2lvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gU2FtZSBsaW5lLCB3aXRoIGFub3RoZXIgdGV4dCBlcXVpdmFsZW50IHRvIGFkZCB0byB0aGVcbiAgICAgICAgICAvLyB0ZXh0IHJ1biBmdXJ0aGVyIG9uIGluIHRoZSBsb29wLCBzbyBkb24ndCB5aWVsZC5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB5aWVsZCBuZXcgcmVzdWx0cy5UZXh0UmVzdWx0KHRleHRSdW4sIG5vZGUuaGFzaHRhZ3MsIG1ldGFkYXRhKTtcbiAgICAgICAgICB0ZXh0UnVuID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIG5vZGVUeXBlcy5TaG9ydGN1dCkge1xuICAgICAgICBzaG9ydGN1dE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIGlmICghKG5leHROb2RlIGluc3RhbmNlb2Ygbm9kZVR5cGVzLlNob3J0Y3V0KSkge1xuICAgICAgICAgIC8vIExhc3Qgc2hvcnRjdXQgaW4gdGhlIHNlcmllcywgc28geWllbGQgdGhlIHNob3J0Y3V0cy5cbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB5aWVsZCogdGhpcy5oYW5kbGVTaG9ydGN1dHMoc2hvcnRjdXROb2RlcywgbWV0YWRhdGEpO1xuICAgICAgICAgIGlmIChyZXN1bHQgJiYgKHJlc3VsdC5zdG9wIHx8IHJlc3VsdC5qdW1wKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2hvcnRjdXROb2RlcyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBub2RlVHlwZXMuQXNzaWdubWVudCkge1xuICAgICAgICB0aGlzLmV2YWx1YXRlQXNzaWdubWVudChub2RlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIG5vZGVUeXBlcy5Db25kaXRpb25hbCkge1xuICAgICAgICAvLyBHZXQgdGhlIHJlc3VsdHMgb2YgdGhlIGNvbmRpdGlvbmFsXG4gICAgICAgIGNvbnN0IGV2YWxSZXN1bHQgPSB0aGlzLmV2YWx1YXRlQ29uZGl0aW9uYWwobm9kZSk7XG4gICAgICAgIGlmIChldmFsUmVzdWx0KSB7XG4gICAgICAgICAgLy8gUnVuIHRoZSByZW1haW5pbmcgcmVzdWx0c1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHlpZWxkKiB0aGlzLmV2YWxOb2RlcyhldmFsUmVzdWx0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiAocmVzdWx0LnN0b3AgfHwgcmVzdWx0Lmp1bXApKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgdHlwZXMuSnVtcENvbW1hbmROb2RlKSB7XG4gICAgICAgIC8vIGlnbm9yZSB0aGUgcmVzdCBvZiB0aGlzIG91dGVyIGxvb3AgYW5kXG4gICAgICAgIC8vIHRlbGwgcGFyZW50IGxvb3BzIHRvIGlnbm9yZSBmb2xsb3dpbmcgbm9kZXMuXG4gICAgICAgIC8vIFJlY3Vyc2l2ZSBjYWxsIGhlcmUgd291bGQgY2F1c2Ugc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgcmV0dXJuIHsganVtcDogbm9kZS5kZXN0aW5hdGlvbiB9O1xuICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgdHlwZXMuU3RvcENvbW1hbmROb2RlKSB7XG4gICAgICAgIC8vIGlnbm9yZSB0aGUgcmVzdCBvZiB0aGlzIG91dGVyIGxvb3AgYW5kXG4gICAgICAgIC8vIHRlbGwgcGFyZW50IGxvb3BzIHRvIGlnbm9yZSBmb2xsb3dpbmcgbm9kZXNcbiAgICAgICAgcmV0dXJuIHsgc3RvcDogdHJ1ZSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uT3JMaXRlcmFsKG5vZGUuY29tbWFuZCk7XG4gICAgICAgIHlpZWxkIG5ldyByZXN1bHRzLkNvbW1hbmRSZXN1bHQoY29tbWFuZCwgbm9kZS5oYXNodGFncywgbWV0YWRhdGEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogeWllbGQgYSBzaG9ydGN1dCByZXN1bHQgdGhlbiBoYW5kbGUgdGhlIHN1YnNlcXVlbnQgc2VsZWN0aW9uXG4gICAqIEBwYXJhbSB7YW55W119IHNlbGVjdGlvbnNcbiAgICovXG4gICpoYW5kbGVTaG9ydGN1dHMoc2VsZWN0aW9ucywgbWV0YWRhdGEpIHtcbiAgICAvLyBNdWx0aXBsZSBvcHRpb25zIHRvIGNob29zZSBmcm9tIChvciBqdXN0IGEgc2luZ2xlIHNob3J0Y3V0KVxuICAgIC8vIFRhZyBhbnkgY29uZGl0aW9uYWwgZGlhbG9nIG9wdGlvbnMgdGhhdCByZXN1bHQgdG8gZmFsc2UsXG4gICAgLy8gdGhlIGNvbnN1bWluZyBhcHAgZG9lcyB0aGUgYWN0dWFsIGZpbHRlcmluZyBvciB3aGF0ZXZlclxuICAgIGNvbnN0IHRyYW5zZm9ybWVkU2VsZWN0aW9ucyA9IHNlbGVjdGlvbnMubWFwKChzKSA9PiB7XG4gICAgICBsZXQgaXNBdmFpbGFibGUgPSB0cnVlO1xuXG4gICAgICBpZiAocy5jb25kaXRpb25hbEV4cHJlc3Npb24gJiYgIXRoaXMuZXZhbHVhdGVFeHByZXNzaW9uT3JMaXRlcmFsKHMuY29uZGl0aW9uYWxFeHByZXNzaW9uKSkge1xuICAgICAgICBpc0F2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb25PckxpdGVyYWwocy50ZXh0KTtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHMsIHsgaXNBdmFpbGFibGUsIHRleHQgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0gbmV3IHJlc3VsdHMuT3B0aW9uc1Jlc3VsdCh0cmFuc2Zvcm1lZFNlbGVjdGlvbnMsIG1ldGFkYXRhKTtcbiAgICB5aWVsZCBvcHRpb25zUmVzdWx0O1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1Jlc3VsdC5zZWxlY3RlZCA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9uID0gdHJhbnNmb3JtZWRTZWxlY3Rpb25zW29wdGlvbnNSZXN1bHQuc2VsZWN0ZWRdO1xuICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uLmNvbnRlbnQpIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgZ28gdGhyb3VnaCB0aGUgbm9kZXMgbmVzdGVkIHdpdGhpblxuICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuZXZhbE5vZGVzKHNlbGVjdGVkT3B0aW9uLmNvbnRlbnQsIG1ldGFkYXRhKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBvcHRpb24gc2VsZWN0ZWQgYmVmb3JlIHJlc3VtaW5nIGRpYWxvZ3VlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZXMgdGhlIGdpdmVuIGFzc2lnbm1lbnQgbm9kZVxuICAgKi9cbiAgZXZhbHVhdGVBc3NpZ25tZW50KG5vZGUpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbk9yTGl0ZXJhbChub2RlLmV4cHJlc3Npb24pO1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YXJpYWJsZXMuZ2V0KG5vZGUudmFyaWFibGVOYW1lKTtcbiAgICBpZiAob2xkVmFsdWUgJiYgdHlwZW9mIG9sZFZhbHVlICE9PSB0eXBlb2YgcmVzdWx0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBWYXJpYWJsZSAke1xuICAgICAgICAgIG5vZGUudmFyaWFibGVOYW1lXG4gICAgICAgIH0gaXMgYWxyZWFkeSB0eXBlICR7dHlwZW9mIG9sZFZhbHVlfTsgY2Fubm90IHNldCBlcXVhbCB0byAke3Jlc3VsdH0gb2YgdHlwZSAke3R5cGVvZiByZXN1bHR9YCxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMudmFyaWFibGVzLnNldChub2RlLnZhcmlhYmxlTmFtZSwgcmVzdWx0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZXMgdGhlIGdpdmVuIGNvbmRpdGlvbmFsIG5vZGVcbiAgICogUmV0dXJucyB0aGUgc3RhdGVtZW50cyB0byBiZSBydW4gYXMgYSByZXN1bHQgb2YgaXQgKGlmIGFueSlcbiAgICovXG4gIGV2YWx1YXRlQ29uZGl0aW9uYWwobm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT09ICdJZk5vZGUnKSB7XG4gICAgICBpZiAodGhpcy5ldmFsdWF0ZUV4cHJlc3Npb25PckxpdGVyYWwobm9kZS5leHByZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gbm9kZS5zdGF0ZW1lbnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdJZkVsc2VOb2RlJyB8fCBub2RlLnR5cGUgPT09ICdFbHNlSWZOb2RlJykge1xuICAgICAgaWYgKHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uT3JMaXRlcmFsKG5vZGUuZXhwcmVzc2lvbikpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuc3RhdGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5lbHNlU3RhdGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlQ29uZGl0aW9uYWwobm9kZS5lbHNlU3RhdGVtZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRWxzZU5vZGVcbiAgICAgIHJldHVybiBub2RlLnN0YXRlbWVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGV2YWx1YXRlRnVuY3Rpb25DYWxsKG5vZGUpIHtcbiAgICBpZiAodGhpcy5mdW5jdGlvbnNbbm9kZS5mdW5jdGlvbk5hbWVdKSB7XG4gICAgICByZXR1cm4gdGhpcy5mdW5jdGlvbnNbbm9kZS5mdW5jdGlvbk5hbWVdKC4uLm5vZGUuYXJncy5tYXAodGhpcy5ldmFsdWF0ZUV4cHJlc3Npb25PckxpdGVyYWwsIHRoaXMpKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGdW5jdGlvbiBcIiR7bm9kZS5mdW5jdGlvbk5hbWV9XCIgbm90IGZvdW5kYCk7XG4gIH1cblxuICAvKipcbiAgICogRXZhbHVhdGVzIGFuIGV4cHJlc3Npb24gb3IgbGl0ZXJhbCBkb3duIHRvIGl0cyBmaW5hbCB2YWx1ZVxuICAgKi9cbiAgZXZhbHVhdGVFeHByZXNzaW9uT3JMaXRlcmFsKG5vZGUpIHtcbiAgICAvLyBBIGNvbWJpbmVkIGFycmF5IG9mIHRleHQgYW5kIGlubGluZSBleHByZXNzaW9ucyB0byBiZSB0cmVhdGVkIGFzIG9uZS5cbiAgICAvLyBDb3VsZCBwcm9iYWJseSBiZSBjbGVhbmVkIHVwIGJ5IGludHJvZHVjaW5nIGEgbmV3IG5vZGUgdHlwZS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGUucmVkdWNlKChhY2MsIG4pID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyArIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uT3JMaXRlcmFsKG4pLnRvU3RyaW5nKCk7XG4gICAgICB9LCAnJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZUhhbmRsZXJzID0ge1xuICAgICAgVW5hcnlNaW51c0V4cHJlc3Npb25Ob2RlOiAoYSkgPT4ge1xuICAgICAgICByZXR1cm4gLWE7XG4gICAgICB9LFxuICAgICAgQXJpdGhtZXRpY0V4cHJlc3Npb25BZGROb2RlOiAoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICB9LFxuICAgICAgQXJpdGhtZXRpY0V4cHJlc3Npb25NaW51c05vZGU6IChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0sXG4gICAgICBBcml0aG1ldGljRXhwcmVzc2lvbkV4cG9uZW50Tm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgKiogYjtcbiAgICAgIH0sXG4gICAgICBBcml0aG1ldGljRXhwcmVzc2lvbk11bHRpcGx5Tm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgKiBiO1xuICAgICAgfSxcbiAgICAgIEFyaXRobWV0aWNFeHByZXNzaW9uRGl2aWRlTm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgLyBiO1xuICAgICAgfSxcbiAgICAgIEFyaXRobWV0aWNFeHByZXNzaW9uTW9kdWxvTm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgJSBiO1xuICAgICAgfSxcbiAgICAgIE5lZ2F0ZWRCb29sZWFuRXhwcmVzc2lvbk5vZGU6IChhKSA9PiB7XG4gICAgICAgIHJldHVybiAhYTtcbiAgICAgIH0sXG4gICAgICBCb29sZWFuT3JFeHByZXNzaW9uTm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgfHwgYjtcbiAgICAgIH0sXG4gICAgICBCb29sZWFuQW5kRXhwcmVzc2lvbk5vZGU6IChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhICYmIGI7XG4gICAgICB9LFxuICAgICAgQm9vbGVhblhvckV4cHJlc3Npb25Ob2RlOiAoYSwgYikgPT4ge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgICAgICByZXR1cm4gISEoYSBeIGIpO1xuICAgICAgfSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG4gICAgICBFcXVhbFRvRXhwcmVzc2lvbk5vZGU6IChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgfSxcbiAgICAgIE5vdEVxdWFsVG9FeHByZXNzaW9uTm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgIT09IGI7XG4gICAgICB9LFxuICAgICAgR3JlYXRlclRoYW5FeHByZXNzaW9uTm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgPiBiO1xuICAgICAgfSxcbiAgICAgIEdyZWF0ZXJUaGFuT3JFcXVhbFRvRXhwcmVzc2lvbk5vZGU6IChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhID49IGI7XG4gICAgICB9LFxuICAgICAgTGVzc1RoYW5FeHByZXNzaW9uTm9kZTogKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgPCBiO1xuICAgICAgfSxcbiAgICAgIExlc3NUaGFuT3JFcXVhbFRvRXhwcmVzc2lvbk5vZGU6IChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBhIDw9IGI7XG4gICAgICB9LFxuICAgICAgVGV4dE5vZGU6IChhKSA9PiB7XG4gICAgICAgIHJldHVybiBhLnRleHQ7XG4gICAgICB9LFxuICAgICAgRXNjYXBlZENoYXJhY3Rlck5vZGU6IChhKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vRXNjYXBlID8gYS50ZXh0IDogYS50ZXh0LnNsaWNlKDEpO1xuICAgICAgfSxcbiAgICAgIE51bWVyaWNMaXRlcmFsTm9kZTogKGEpID0+IHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYS5udW1lcmljTGl0ZXJhbCk7XG4gICAgICB9LFxuICAgICAgU3RyaW5nTGl0ZXJhbE5vZGU6IChhKSA9PiB7XG4gICAgICAgIHJldHVybiBgJHthLnN0cmluZ0xpdGVyYWx9YDtcbiAgICAgIH0sXG4gICAgICBCb29sZWFuTGl0ZXJhbE5vZGU6IChhKSA9PiB7XG4gICAgICAgIHJldHVybiBhLmJvb2xlYW5MaXRlcmFsID09PSAndHJ1ZSc7XG4gICAgICB9LFxuICAgICAgVmFyaWFibGVOb2RlOiAoYSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMuZ2V0KGEudmFyaWFibGVOYW1lKTtcbiAgICAgIH0sXG4gICAgICBGdW5jdGlvbkNhbGxOb2RlOiAoYSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uQ2FsbChhKTtcbiAgICAgIH0sXG4gICAgICBJbmxpbmVFeHByZXNzaW9uTm9kZTogKGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbm9kZUhhbmRsZXJzW25vZGUudHlwZV07XG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG5vZGUgdHlwZSBub3QgcmVjb2duaXplZDogJHtub2RlLnR5cGV9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXIoXG4gICAgICBub2RlIGluc3RhbmNlb2Ygbm9kZVR5cGVzLkV4cHJlc3Npb25cbiAgICAgICAgPyB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbk9yTGl0ZXJhbChub2RlLmV4cHJlc3Npb24gfHwgbm9kZS5leHByZXNzaW9uMSlcbiAgICAgICAgOiBub2RlLFxuICAgICAgbm9kZS5leHByZXNzaW9uMiA/IHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uT3JMaXRlcmFsKG5vZGUuZXhwcmVzc2lvbjIpIDogbm9kZSxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgUnVubmVyLFxuICBUZXh0UmVzdWx0OiByZXN1bHRzLlRleHRSZXN1bHQsXG4gIENvbW1hbmRSZXN1bHQ6IHJlc3VsdHMuQ29tbWFuZFJlc3VsdCxcbiAgT3B0aW9uc1Jlc3VsdDogcmVzdWx0cy5PcHRpb25zUmVzdWx0LFxufTtcbiJdfQ==