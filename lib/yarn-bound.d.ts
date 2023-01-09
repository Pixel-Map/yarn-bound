export default class YarnBound {
    constructor({ dialogue, variableStorage, functions, handleCommand, combineTextAndOptionsResults, locale, startAt, }: {
        dialogue: any;
        variableStorage: any;
        functions: any;
        handleCommand: any;
        combineTextAndOptionsResults: any;
        locale: any;
        startAt?: string | undefined;
    });
    jump(startAt: any): void;
    advance(optionIndex: any): void;
    registerFunction(name: any, func: any): void;
}
