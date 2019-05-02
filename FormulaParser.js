/*
  TODO nock hints, at least fast Dave tries to do this bit by himself. Good luck, future Dave.
  TODO Jets
  TODO run ackerman test
  TODO hashboard maybe
  TODO cache location objects on cells as core, battery objects on cells as battery
  TODO write a $*#& ton of jets
  TODO boot hoon!
  TODO be sad because it's slow
*/

var Hamt = require('./hamt.js').Hamt,
    noun = require('./noun.js'),
    bits = require('./bits.js'),
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

FormulaParser.prototype.compile = function(formula, is_tail) {
  var opp, arg, one, two, three;
    
  if(formula instanceof Cell) {
      opp = formula.head;
      arg = formula.tail;

        if(opp instanceof Cell) {
            //auto cons? wtf is that?
            one = this.compile(opp, false);
            two = this.compile(arg, false);
            return function(c) {
                return new AutoCons(one(c), two(c));
            };
                                
        } else {
            switch(opp.valueOf()) {
            case 0:  //fragment/slot/index/axis
                one = a(arg);
                return function(c) {
                    return new Nock0(one);
                };
            case 1:  //const
                return function(c) {
                    return new Nock1(arg);
                };
            case 2:  //nock
                c(arg);
                one = this.compile(arg.head, false);
                two = this.compile(arg.tail, false);
                if(is_tail) {
                    return function (c) {
                        return new Nock2Tail(one(c), two(c), c);
                    };

                } else {
                    return function(c) {
                        return new Nock2Head(one(c), two(c), c);
                    }
                }
            case 3:  //is cell
                one = this.compile(arg, false);
                return function (c) {
                    new Nock3(one(c));
                };
            case 4:  //inc
                one = this.compile(arg, false);
                return function (c) {
                    return new Nock4(one(c));
                };
            case 5:  //equ
                c(arg);
                one = this.compile(arg.head, false);
                two = this.compile(arg.tail, false);
                return function (c) {
                    return new Nock5(one(c), two(c));
                };
                                 
            case 6:  //if-then-else
                c(arg);
                c(arg.tail);
                one = this.compile(arg.head, false);
                two = this.compile(arg.tail.head, is_tail);
                three = this.compile(arg.tail.tail, is_tail);
                return function (c) {
                    return new Nock6(one(c), two(c), three(c));
                };
            case 7:  //compose
                c(arg);
                one = this.compile(arg.head, false);
                two = this.compile(arg.tail, is_tail);
                return function (c) {
                    return new Nock7(one(c), two(c));
                };
            case 8:  //tislus
                c(arg);
                one = this.compile(arg.head, false);
                two = this.compile(arg.tail, is_tail);
                return function (c) {
                    return new Nock8(one(c), two(c));
                };
            case 9:  //kick
                c(arg);
                one = this.compile(arg.tail, false);
                
                if(is_tail) {
                    return function (c) {
                        return new Nock9Tail(arg.head, one(c), c);
                    };
                } else {
                    return function (c) {
                        return new Nock9Head(arg.head, one(c), c);
                    };
                }
            case 10: //edit
                c(arg);
                c(arg.head);
                a(arg.head.head);
                one = this.compile(arg.head.tail, false);
                two = this.compile(arg.tail, false);
                return function (c) {
                    return new Nock10(arg.head.head, one(c), two(c));
                };
            case 11: //hint
                c(arg);
                if(arg.head instanceof Atom.Atom) {
                    return this.compile(arg.tail, is_tail);
                } else if (arg.head instanceof Cell) {
                    one = this.compile(arg.head.tail, false);
                    two = this.compile(arg.tail, is_tail);
                    return function (c) {
                        return new Nock11Toss(one(c), two(c));
                    };
                } else {
                    throw new Error("Bail");
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

module.exports = {
    FormulaParser: FormulaParser
};
