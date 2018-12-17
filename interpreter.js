var noun = require('./noun.js'),
    Cell = noun.Cell,
    Atom = noun.Atom;

function interpret_old(subject, formula) {
    if(formula instanceof Cell) {
        var opp = formula.head;
        var arg = formula.tail;

        if(opp instanceof Cell) {
            //auto cons? wtf is that?
            return new Cell(interpret(subject, opp),
                            interpret(subject, arg));
        } else {
            switch(opp.valueOf()) {
            case 0:  //fragment/slot/index/axis
                if(arg instanceof Atom.Atom) {
                   return subject.at(arg);
                } else {
                    throw new Error("Bail");                 
                }
            case 1:  //const
                return arg;
            case 2:  //nock
                if(arg instanceof Cell) {
                    //arg.head is new subject
                    //arg.tail is new formula
                    return interpret(interpret(subject, arg.head),
                                     interpret(subject, arg.tail));
                } else {
                    throw new Error("Bail");
                }
            case 3:  //is cell
                if(interpret(subject, arg) instanceof Cell) {
                    return Atom.yes;
                } else {
                    return Atom.no;
                }
            case 4:  //inc
                return interpret(subject, arg).bump();
            case 5:  //equ
                if(arg instanceof Cell) {
                  var thing1 = interpret(subject, arg.head),
                      thing2 = interpret(subject, arg.tail);
                    
                  if(thing1.equals(thing2)) {
                      return Atom.yes;
                  } else {
                      return Atom.no;
                  }
                } else {
                    throw new Error("Bail");
                }
            case 6:  //if-then-else
                if((arg instanceof Cell) && (arg.tail instanceof Cell)) {
                    var pred = interpret(subject, arg.head);
                    
                    if(pred.equals(Atom.yes)) {
                        return interpret(subject, arg.tail.head);
                    } else if(pred.equals(Atom.no)) {
                        return interpret(subject, arg.tail.tail);
                    }
                }
                throw new Error("Bail");
            case 7:  //compose
                if(arg instanceof Cell) {
                    return interpret(interpret(subject, arg.head), arg.tail);
                }
                throw new Error("Bail");
            case 8:  //tislus
                if(arg instanceof Cell) {
                    return interpret(new Cell(interpret(subject, arg.head),
                                              subject),
                                     arg.tail);
                }
                throw new Error("Bail");
            case 9:  //kick
                if((arg instanceof Cell) && (arg.head instanceof Atom.Atom)) {
                    var core = interpret(subject, arg.tail);                    
                    return interpret(core, core.at(arg.head));
                }
                throw new Error("Bail"); 
            case 10: //edit
                if((arg instanceof Cell) && (arg.head instanceof Cell)) {
                    return interpret(subject, arg.tail).
                        edit(arg.head.head, interpret(subject, arg.head.tail));
                }
                throw new Error("Bail"); 
            case 11: //hint
                if(arg instanceof Cell) {
                    if(arg.head instanceof Cell) {
                        if(arg.head.head instanceof Atom.Atom) {
                            var hint = interpret(subject, arg.head.tail);
                        } else {
                            throw new Error("Bail");
                        }
                    }
                    return interpret(subject, arg.tail);
                }
                throw new Error("Bail"); 
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

function interpret(subject, formula) {

//    console.log({subject: subject.toString(), 
//                 formula: formula.toString()});
    var ret = interpret_old(subject, formula);
//    console.log({formula: formula.toString(), product: ret.toString()});            
    return ret;
    
}

module.exports = {
    interpret: interpret
};
