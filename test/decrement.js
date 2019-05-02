/*
 * =<  (dec 43)
 * |%
 * ++  dec
 *   |=  a/@
 *   =|  i/@
 *   |-
 *   =/  n/@  +(i)
 *   ?:  =(a n)
 *     i
 *   $(i n)
 * --
 * [8 [1 8 [1 0] [1 8 [1 0] 8 [1 8 [4 0 6] 
                                 6 [5 [0 62] 0 2] 
                                   [0 14] 
                                 9 2 [0 6] [0 2] 0 15]
                                 9 2 0 1] 0 1]
    8 [9 2 0 1] 9 2 [0 4] [7 [0 3] 1 43] 0 11]
[ 8
  [ 1
    8
    [1 0]
    [1 8 [1 0] 8 [1 8 [4 0 6] 6 [5 [0 62] 0 2] [0 14] 9 2 10 [6 0 2] 0 3] 9 2 0 1]
    0
    1
  ]
  8
  [9 2 0 1]
  9
  2
  10
  [6 7 [0 3] 1 43]
  0
  2
]




 */
var noun = require('../noun.js'),
    nounT = require('./noun.js'),
//    interpreter = require('../interpreter.js'),
    n = noun.dwim,
    NockContext = require('../NockContext.js').NockContext,
    formula = n(8, [ 1, 8, [1, 0], [1, 8, [1, 0], 8, [1, 8, [4, 0, 6], 6, [5, [0, 62], 0, 2], [0, 14], 9, 2, 10, [6, 0, 2], 0, 3], 9, 2, 0, 1], 0, 1], 8, [9, 2, 0, 1], 9, 2, 10, [6, 7, [0, 3], 1, 43], 0, 2),
    context = new NockContext({}),
    product = context.nock(n(0), formula);
    test = require('tape');

test('decrement', function (t) {
  t.plan(1);
  nounT.equals(t, product, n(42), 'dec(43) == 42');
});
