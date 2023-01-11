// @ts-nocheck

import { YarnBound, TextResult, CommandResult, OptionsResult } from '../src/index';
import { Runner } from '../src/runner';


jest.spyOn(Runner.prototype, 'load').mockImplementation();
jest.spyOn(Runner.prototype, 'registerFunction').mockImplementation();
jest.spyOn(Runner.prototype, 'setVariableStorage').mockImplementation();
jest.spyOn(Runner.prototype, 'run').mockImplementation(function* () {
  while (true) yield new TextResult('hello');
});

describe('constructor', () => {
  const dialogue = [];
  test('should load a dialogue object into the runner', () => {
    new YarnBound({ dialogue });
    expect(Runner.prototype.load).toHaveBeenCalledWith(dialogue);
  });

  test('should load a dialogue into the runner', () => {
    const dialogueWithLeadingWhitespace = `
      title:Start
      ---
      text
      ===
    `;

    new YarnBound({ dialogue: dialogueWithLeadingWhitespace });
    expect(Runner.prototype.load).toHaveBeenCalledWith(dialogueWithLeadingWhitespace);
  });

  test('should set the variable storage if provided', () => {
    const variableStorage = new Map();
    new YarnBound({ variableStorage });
    expect(Runner.prototype.setVariableStorage).toHaveBeenCalledWith(variableStorage);
  });

  test('should register initially provided functions', () => {
    const functions = {
      functionOne: () => {},
      functionTwo: () => {},
    };
    new YarnBound({ functions });
    Object.entries(functions).forEach(([key, func]) => {
      expect(Runner.prototype.registerFunction).toHaveBeenCalledWith(key, func);
    });
  });

  test('can register functions after initialization', () => {
    const functions = {
      functionOne: () => {},
      functionTwo: () => {},
    };
    const runner = new YarnBound({});
    Object.entries(functions).forEach(([key, func]) => {
      runner.registerFunction(key, func);
      expect(Runner.prototype.registerFunction).toHaveBeenCalledWith(key, func);
    });
  });

  test('should start the generator at the node with the provided "startAt" title', () => {
    const startAt = 'someStartingNode';
    new YarnBound({ startAt });
    expect(Runner.prototype.run).toHaveBeenCalledWith(startAt);
  });

  test('should start the generator at the "Start" node if startAt is undefined', () => {
    new YarnBound({});
    expect(Runner.prototype.run).toHaveBeenCalledWith('Start');
  });

  test('should attach the generator to the instance', () => {
    const runner = new YarnBound({});
    expect(runner.generator).toBe(Runner.prototype.run.mock.results[0].value);
  });

  test('should advance the generator', () => {
    jest.spyOn(YarnBound.prototype, 'advance');
    new YarnBound({});
    expect(YarnBound.prototype.advance).toHaveBeenCalled();
  });
});

describe('jump', () => {
  test('should jump the generator to the node with the provided "jumpTo" title', () => {
    jest.spyOn(YarnBound.prototype, 'advance');
    const jumpTo = 'someJumpNode';
    const yarnbound = new YarnBound({});
    yarnbound.jump(jumpTo);
    expect(YarnBound.prototype.advance).toHaveBeenCalled();
    expect(Runner.prototype.run).toHaveBeenCalledWith(jumpTo);
  });
});

describe('advance', () => {
  const mockCommandName1 = 'blah';
  const mockCommandName2 = 'bleh';
  const mockCommandResult1 = new CommandResult(mockCommandName1);
  const mockCommandResult2 = new CommandResult(mockCommandName2);
  const mockTextResult1 = new TextResult('marge');
  const mockTextResult2 = new TextResult('maggie');
  const mockTextResult3 = new TextResult('homer');
  const mockOptionsResult = new OptionsResult([{ text: 'bart' }, { text: 'lisa' }]);
  describe('where next results are a TextResult followed by OptionsResult', () => {
    beforeAll(() => {
      Runner.prototype.run.mockImplementation(function* () {
        yield mockTextResult1;
        yield mockOptionsResult;
        yield mockTextResult2;
        yield mockTextResult3;
      });
    });

    test('should set currentResult to a the TextResult object', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult).toBe(mockTextResult1);
      runner.advance();
      expect(runner.currentResult).toBe(mockOptionsResult);
    });

    test('should attach a markup array to a the TextResult object', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult.markup).toEqual([]);
    });

    test('should set currentResult to an Options object with the text attached if combineTextAndOptionsResults is false', () => {
      const runner = new YarnBound({ combineTextAndOptionsResults: true });
      expect(runner.currentResult).toEqual({ ...mockOptionsResult, ...mockTextResult1 });
      expect(runner.currentResult).toBeInstanceOf(OptionsResult);
    });

    test('should select the option with the index passed in, if there is one', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult).toBe(mockTextResult1);
      runner.advance();
      const currentResult = runner.currentResult;
      expect(runner.currentResult).toBe(mockOptionsResult);
      jest.spyOn(currentResult, 'select');
      runner.advance(1);
      expect(currentResult.select).toHaveBeenCalledWith(1);
      expect(runner.currentResult).toBe(mockTextResult2);
    });

    test('should set currentResult to a the TextResult object', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult).toBe(mockTextResult1);
      runner.advance();
      expect(runner.currentResult).toBe(mockOptionsResult);
    });
  });

  describe('where next results are CommandResults followed by TextResults', () => {
    beforeAll(() => {
      Runner.prototype.run.mockImplementation(function* () {
        yield mockCommandResult1;
        yield mockCommandResult2;
        yield mockTextResult1;
        yield mockTextResult2;
      });
    });

    test('should set currentResult to the command result if handleCommand is not supplied', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult).toBe(mockCommandResult1);
      runner.advance();
      expect(runner.currentResult).toBe(mockCommandResult2);
    });

    test('should add previous results to history', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult).toBe(mockCommandResult1);
      runner.advance();
      expect(runner.history).toEqual([mockCommandResult1]);
      runner.advance();
      expect(runner.history).toEqual([mockCommandResult1, mockCommandResult2]);
      runner.advance();
      expect(runner.history).toEqual([mockCommandResult1, mockCommandResult2, mockTextResult1]);
    });

    test('should not add command results to history if handleCommand is supplied', () => {
      const runner = new YarnBound({ handleCommand: () => {} });
      expect(runner.currentResult).toBe(mockTextResult1);
      runner.advance();
      expect(runner.history).toEqual([mockTextResult1]);
    });

    test('should set currentResult to the next non-command result if handleCommand is supplied', () => {
      const runner = new YarnBound({ handleCommand: () => {} });
      expect(runner.currentResult).toBe(mockTextResult1);
    });

    test('should call the command handler for each command result', () => {
      const handleCommand = jest.fn();
      new YarnBound({ handleCommand });
      expect(handleCommand).toHaveBeenNthCalledWith(1, { command: mockCommandName1 });
      expect(handleCommand).toHaveBeenNthCalledWith(2, { command: mockCommandName2 });
    });
  });

  describe('when dialogue ends', () => {
    beforeAll(() => {
      Runner.prototype.run.mockImplementation(function* () {
        yield mockTextResult1;
      });
    });

    test('should include an "isDialogueEnd" property on the currentResult', () => {
      const runner = new YarnBound({});
      expect(runner.currentResult).toEqual({ ...mockTextResult1, isDialogueEnd: true });
    });
  });
});
