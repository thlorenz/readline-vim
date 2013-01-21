'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , createMap = require('../../lib/map')

test('\nsequences in insert mode', function (t) {

  t.test('\n# given I mapped [jk] to [escape]', function (t) {
    var map = createMap()

    map.insert('jk', 'escape')
    t.equal(map.mappings.insert.sequences.j.k, 'escape', 'it is added to the mappings under insert.sequences.j.k')

    t.equal(map.matchInsert(['j', 'k']), 'escape', 'matching insert [kj] returns escape')
    t.equal(map.matchInsert(['l', 'k']), null, 'matching insert [kl] returns null')
    t.equal(map.matchInsert(['k', 'j']), null, 'matching insert [kj] returns null')
    t.equal(map.matchInsert(['j']), true, 'matching insert [j] returns true to indicate possible future match')

    t.end()
  })

  t.test('\n# given I mapped [mug] to [escape]', function (t) {
    var map = createMap()

    map.insert('mug', 'escape')
    t.equal(map.mappings.insert.sequences.m.u.g, 'escape', 'it is added to the mappings under insert.sequences.m.u.g')

    t.equal(map.matchInsert(['m', 'u', 'g']), 'escape', 'matching insert [mug] returns escape')
    t.equal(map.matchInsert(['m', 'u']), true, 'matching insert [mu] returns true to indicate possible future match')

    t.end()
  })
})


/*map.insert('ctrl-i', 'escape')
map.normal('shift-n', 'ctrl-p')*/



