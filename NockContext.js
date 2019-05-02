var noun = require('./noun.js'),
    hamt = require('./hamt.js'),
    FormulaParser = require('./FormulaParser.js');

function NockContext(dashboard) {
    this.formulaCache = new hamt.Hamt();
    this.dashboard = dashboard;
}

NockContext.prototype.nock = function(subject, formula) {
    return formula.getCallTarget(this).bounce(subject);
};

NockContext.prototype.getFunctionCache = function(cell) {
    var fc = this.formulaCache.get(cell);

    if(!fc) {
        var f = FormulaParser.parse(cell);
        fc = new noun.FunctionCache(this, f, f(this));
        this.formulaCache.insert(cell, fc);
    }

    return fc;
};

module.exports = {
    NockContext: NockContext
}