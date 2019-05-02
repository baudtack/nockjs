function NockContext(callTargetStore, dashboard) {
    this.asts = new Hamt();
    this.astContext = callTargetStore.getAstContext(dashboard);
}

NockContext.prototype.getCallTarget = function(formula) {
    var f = this.asts.get(formula);
    if(f) {
        f = this.compile(formula, true);
        this.asts.insert(formula, ast);
    }
    return f;
};

NockContext.prototype.nock = function(subject, formula) {
    return formula.getCallTarget(this).bounce(subject);
};

NockContext.prototype.getFunctionCache = function(cell) {
    var callTargetFactory = FormulaParser.parse(cell);
    //FormulaParser needs implemented
    //make a FunctionCache
};
