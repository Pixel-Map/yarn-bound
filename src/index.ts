import bondage from './bondage';
import * as results from './results';
import YarnBound from './yarn-bound';
const { OptionsResult, TextResult, CommandResult } = bondage;

YarnBound.OptionsResult = OptionsResult as unknown as results.OptionsResult;
YarnBound.TextResult = TextResult as unknown as results.TextResult;
YarnBound.CommandResult = CommandResult as unknown as results.CommandResult;
export default YarnBound;
