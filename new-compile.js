/*
  TODO save ast for nock formula on cells
  TODO nock hints, at least fast
  TODO Jets
  TODO run ackerman test
  TODO hashboard maybe
  TODO cache location objects on cells as core, battery objects on cells as battery
  TODO write a $*#& ton of jets
  TODO boot hoon!
  TODO be sad because it's slow
*/

var NounMap = require('./hamt.js').NounMap,
    noun = require('./noun.js'),
    Noun = noun.Noun,
    Cell = noun.Cell,
    Atom = noun.Atom;

function c(noun) {
    if(noun instanceof Cell) {
        return noun;
    }
    throw new Error("Bail");
}

function a(noun) {
    if(noun instanceof Atom.Atom) {
        return noun;
    }
    throw new Error("Bail");
}

function Trampoline(ast, subject) {
    //used for tco in 9 and 2
    this.ast = ast;
    this.subject = subject;
}

Trampoline.prototype.jump = function() {
    return this.ast.execute(this.subject);
};

function Expression() {
}

Expression.prototype.execute = function(subject) {
    throw new Error("Fail");
};

Expression.prototype.bounce = function(subject) {
    var result = this.execute(subject);
    
    while(result instanceof Trampoline) {
        result = result.jump();
    }
    
    return result;
}

function AutoCons(head, tail) {
    Expression.call(this);
    this.head = head;
    this.tail = tail;
}

AutoCons.prototype = Object.create(Expression.prototype);
AutoCons.prototype.constructor = AutoCons;

AutoCons.prototype.execute = function(subject) {
    var h = this.head.bounce(subject);
    var t = this.tail.bounce(subject);
    return new Cell(h, t);
};

function Nock0(axis) {
    Expression.call(this);
    this.fragmenter = Noun.fragmenter(axis);
}

Nock0.prototype = Object.create(Expression.prototype);
Nock0.prototype.constructor = Nock0;

Nock0.prototype.execute = function(subject) {
    return this.fragmenter(subject);
};

function Nock1(noun) {
    Expression.call(this);
    this.noun = noun;
}

Nock1.prototype = Object.create(Expression.prototype);
Nock1.prototype.constructor = Nock1;

Nock1.prototype.execute = function(subject) {
    return this.noun;
};

function Nock2Head(subject, formula, context) {
    Expression.call(this);
    this.subject = subject;
    this.formula = formula;
    this.context = context;
}

Nock2Head.prototype = Object.create(Expression.prototype);
Nock2Head.prototype.constructor = Nock2Head;

Nock2Head.prototype.execute = function(subject) {
    var sub = this.subject.bounce(subject);
    var form = this.formula.bounce(subject);
    var ast = form.getAst(this.context);
    return ast.bounce(sub);
};


function Nock2Tail(subject, formula, context) {
    Expression.call(this);
    this.subject = subject;
    this.formula = formula;
    this.context = context;
}

Nock2Tail.prototype = Object.create(Expression.prototype);
Nock2Tail.prototype.constructor = Nock2Tail;

Nock2Tail.prototype.execute = function(subject) {
    var sub = this.subject.bounce(subject);
    var form = this.formula.bounce(subject);
    var ast = form.getAst(this.context);
    return new Trampoline(ast, sub);
};

function Nock3(arg) {
    Expression.call(this);
    this.arg = arg;
}

Nock3.prototype = Object.create(Expression.prototype);
Nock3.prototype.constructor = Nock3;

Nock3.prototype.execute = function(subject) {
    var a = this.arg.execute(subject);
    if(a instanceof Cell) {
        return Atom.yes;
    } else {
        return Atom.no;
    }
};


function Nock4(arg) {
    Expression.call(this);
    this.arg = arg;
}

Nock4.prototype = Object.create(Expression.prototype);
Nock4.prototype.constructor = Nock4;

Nock4.prototype.execute = function(subject) {
    var a = this.arg.execute(subject);
    return a.bump();
};


function Nock5(a, b) {
    Expression.call(this);
    this.a = a;
    this.b = b;
}

Nock5.prototype = Object.create(Expression.prototype);
Nock5.prototype.constructor = Nock5;

Nock5.prototype.execute = function(subject) {
    var a = this.a.execute(subject);
    var b = this.b.execute(subject);
    if(a.equals(b)) {
        return Atom.yes;
    } else {
        return Atom.no;
    }
};


function Nock6(pred, yes, no) {
    Expression.call(this);
    this.pred = pred;
    this.yes = yes;
    this.no = no;
}

Nock6.prototype = Object.create(Expression.prototype);
Nock6.prototype.constructor = Nock6;

Nock6.prototype.execute = function(subject) {
    var pred = this.pred.execute(subject);
    if(pred.equals(Atom.yes)) {
        return this.yes.execute(subject);
    } else if(pred.equals(Atom.no)) {
        return this.no.execute(subject);
    } 
    throw new Error("Bail");
};


function Nock7(f, g) {
    Expression.call(this);
    this.f = f;
    this.g = g;
}

Nock7.prototype = Object.create(Expression.prototype);
Nock7.prototype.constructor = Nock7;

Nock7.prototype.execute = function(subject) {
    return this.g.execute(this.f.execute(subject));
};


function Nock8(f, g) {
    Expression.call(this);
    this.f = f;
    this.g = g;
}

Nock8.prototype = Object.create(Expression.prototype);
Nock8.prototype.constructor = Nock8;

Nock8.prototype.execute = function(subject) {
    return this.g.execute(new Cell(this.f.execute(subject), subject));
};

function Nock9Head(axis, core, context) {
    Expression.call(this);
    this.axis = axis;
    this.fragmenter = Noun.fragmenter(axis);
    this.core = core;
    this.context = context;
}

Nock9Head.prototype = Object.create(Expression.prototype);
Nock9Head.prototype.constructor = Nock9Head;

Nock9Head.prototype.execute = function(subject) {
    var core = this.core.execute(subject);
    var f = this.fragmenter(core);
    var ast = f.getAst(this.context);
    return ast.bounce(core);
};

function Nock9Tail(axis, core, context) {
    Expression.call(this);
    this.axis = axis;
    this.fragmenter = Noun.fragmenter(axis);
    this.core = core;
    this.context = context;
}

Nock9Tail.prototype = Object.create(Expression.prototype);
Nock9Tail.prototype.constructor = Nock9Tail;

Nock9Tail.prototype.execute = function(subject) {
    var core = this.core.execute(subject);
    var f = this.fragmenter(core);
    var ast = f.getAst(this.context);
    return new Trampoline(ast, core);
};


function Nock10(axis, little, big) {
    //big is formula for producing subject to axis into
    //little is the new value for thing at axis in big
    Expression.call(this);
    this.axis = axis;
    this.little = little;
    this.big = big;
}

Nock10.prototype = Object.create(Expression.prototype);
Nock10.prototype.constructor = Nock10;

Nock10.prototype.execute = function(subject) {
    var big = this.big.execute(subject);
    return big.edit(this.axis, this.little.execute(subject));
};


function Nock11Toss(f, g) {
    Expression.call(this);
    this.f = f;
    this.g = g;
}

Nock11Toss.prototype = Object.create(Expression.prototype);
Nock11Toss.prototype.constructor = Nock11Toss;

Nock11Toss.prototype.execute = function(subject) {
    this.f.execute(subject);
    return this.g.execute(subject);
};


function Context() {
    this.asts = new NounMap();
}

Context.prototype.getAst = function(formula) {
    var f = this.asts.get(formula);
    if(f) {
        return f;
    } else {
        var ast = this.compile(formula, true);
        this.asts.insert(formula, ast);
        return ast;
    }
};

Context.prototype.compile = function(formula, is_tail) {
  if(formula instanceof Cell) {
        var opp = formula.head;
        var arg = formula.tail;

        if(opp instanceof Cell) {
            //auto cons? wtf is that?
            return new AutoCons(this.compile(opp, false),
                                this.compile(arg, false));
        } else {
            switch(opp.valueOf()) {
            case 0:  //fragment/slot/index/axis
                return new Nock0(a(arg));
            case 1:  //const
                return new Nock1(arg);
            case 2:  //nock
                c(arg);
                if(is_tail) {
                    return new Nock2Tail(this.compile(arg.head, false),
                                         this.compile(arg.tail, false), this);
                } else {
                    return new Nock2Head(this.compile(arg.head, false),
                                         this.compile(arg.tail, false), this);
                }
            case 3:  //is cell
                return new Nock3(this.compile(arg, false));
            case 4:  //inc
                return new Nock4(this.compile(arg, false));
            case 5:  //equ
                c(arg);
                return new Nock5(this.compile(arg.head, false),
                                 this.compile(arg.tail, false));
            case 6:  //if-then-else
                c(arg);
                c(arg.tail);
                return new Nock6(this.compile(arg.head, false),
                                 this.compile(arg.tail.head, is_tail),
                                 this.compile(arg.tail.tail, is_tail));
            case 7:  //compose
                c(arg);
                return new Nock7(this.compile(arg.head, false),
                                 this.compile(arg.tail, is_tail));
            case 8:  //tislus
                c(arg);
                return new Nock8(this.compile(arg.head, false),
                                 this.compile(arg.tail, is_tail));
            case 9:  //kick
                c(arg);
                var f = this.compile(arg.tail, false);
                if(is_tail) {
                    return new Nock9Tail(arg.head, f, this);
                } else {
                    return new Nock9Head(arg.head, f, this);
                }
            case 10: //edit
                c(arg);
                c(arg.head);
                a(arg.head.head);
                return new Nock10(arg.head.head,
                                  this.compile(arg.head.tail, false),
                                  this.compile(arg.tail, false));
            case 11: //hint
                c(arg);
                if(arg.head instanceof Atom.Atom) {
                    return this.compile(arg.tail, is_tail);
                } else if (arg.head instanceof Cell) {
                    return new Nock11Toss(this.compile(arg.head.tail, false),
                                          this.compile(arg.tail, is_tail));
                }
            case 12: //wish-upon-a-star
                throw new Error("Bail");
            default:
                throw new Error("Bail");
            }
        }
    } else {
        throw new Error("Bail");
    }
}

Context.prototype.nock = function(subject, formula) {
    return formula.getAst(this).bounce(subject);
};

module.exports = {
    Context: Context
};
