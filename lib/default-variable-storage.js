// @ts-nocheck
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultVariableStorage {
    constructor() {
        this.data = {};
    }
    set(name, value) {
        this.data[name] = value;
    }
    // Called when a variable is being evaluated.
    get(name) {
        return this.data[name];
    }
}
exports.default = DefaultVariableStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC12YXJpYWJsZS1zdG9yYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlZmF1bHQtdmFyaWFibGUtc3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxjQUFjO0FBQ2QsWUFBWSxDQUFDOztBQUViLE1BQU0sc0JBQXNCO0lBQzFCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSztRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCw2Q0FBNkM7SUFDN0MsR0FBRyxDQUFDLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztDQUNGO0FBRUQsa0JBQWUsc0JBQXNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtbm9jaGVja1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBEZWZhdWx0VmFyaWFibGVTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kYXRhID0ge307XG4gIH1cblxuICBzZXQobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLmRhdGFbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIENhbGxlZCB3aGVuIGEgdmFyaWFibGUgaXMgYmVpbmcgZXZhbHVhdGVkLlxuICBnZXQobmFtZSkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbbmFtZV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdFZhcmlhYmxlU3RvcmFnZTtcbiJdfQ==