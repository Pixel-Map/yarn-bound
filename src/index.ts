// @ts-nocheck
import bondage from './bondage';
import YarnBound from './yarn-bound';
const { OptionsResult, TextResult, CommandResult } = bondage;

YarnBound.OptionsResult = OptionsResult;
YarnBound.TextResult = TextResult;
YarnBound.CommandResult = CommandResult;
export default YarnBound;
