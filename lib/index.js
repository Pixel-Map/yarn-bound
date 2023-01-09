"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const bondage_1 = __importDefault(require("./bondage"));
const yarn_bound_1 = __importDefault(require("./yarn-bound"));
const { OptionsResult, TextResult, CommandResult } = bondage_1.default;
yarn_bound_1.default.OptionsResult = OptionsResult;
yarn_bound_1.default.TextResult = TextResult;
yarn_bound_1.default.CommandResult = CommandResult;
exports.default = yarn_bound_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxjQUFjO0FBQ2Qsd0RBQWdDO0FBQ2hDLDhEQUFxQztBQUNyQyxNQUFNLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsR0FBRyxpQkFBTyxDQUFDO0FBRTdELG9CQUFTLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUN4QyxvQkFBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDbEMsb0JBQVMsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBQ3hDLGtCQUFlLG9CQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtbm9jaGVja1xuaW1wb3J0IGJvbmRhZ2UgZnJvbSAnLi9ib25kYWdlJztcbmltcG9ydCBZYXJuQm91bmQgZnJvbSAnLi95YXJuLWJvdW5kJztcbmNvbnN0IHsgT3B0aW9uc1Jlc3VsdCwgVGV4dFJlc3VsdCwgQ29tbWFuZFJlc3VsdCB9ID0gYm9uZGFnZTtcblxuWWFybkJvdW5kLk9wdGlvbnNSZXN1bHQgPSBPcHRpb25zUmVzdWx0O1xuWWFybkJvdW5kLlRleHRSZXN1bHQgPSBUZXh0UmVzdWx0O1xuWWFybkJvdW5kLkNvbW1hbmRSZXN1bHQgPSBDb21tYW5kUmVzdWx0O1xuZXhwb3J0IGRlZmF1bHQgWWFybkJvdW5kO1xuIl19