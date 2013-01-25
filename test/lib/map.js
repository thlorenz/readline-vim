'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , createMap = require('../../lib/map')

test('\nsequences in insert mode', function (t) {

  t.test('\n# given I mapped [jk] to [escape]', function (t) {
    var map = createMap()

    map.insert('jk', 'escape')
    t.equal(map.mappings.insert.sequences.j.k, 'escape', 'it is added to the mappings under insert.sequences.j.k')

    t.equal(map.matchInsert(['j', 'k']), 'escape', 'matching insert [jk] returns escape')
    t.equal(map.matchInsert(['l', 'k']), null, 'matching insert [lk] returns null')
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

test('\nkey combinations in insert mode', function (t) {
   t.test('\n# given I mapped [ctrl-i] to escape', function (t) {
    var map = createMap()

    map.insert('ctrl-i', 'escape')

    t.equal(map.mappings.insert.immediates['ctrl-i'], 'escape', 'it is added to the mappings under insert.immediates.ctrl-i')
    t.equal(map.matchInsert('ctrl-i'), 'escape', 'matching [ctrl-i] returns escape')
    t.equal(map.matchInsert('shift-ctrl-i'), undefined, 'matching [shift-ctrl-i] returns undefined')

    t.end()
   })

   t.test('\n# given I mapped [shift-ctrl-i] to ctrl-p (although that does not currently work due to readline limiations)', function (t) {
    var map = createMap()

    map.insert('shift-ctrl-i', 'ctrl-p')

    t.equal(map.mappings.insert.immediates['shift-ctrl-i'], 'ctrl-p', 'it is added to the mappings under insert.immediates.shift-ctrl-i')
    t.equal(map.matchInsert('shift-ctrl-i'), 'ctrl-p', 'matching [shift-ctrl-i] returns ctrl-p')
    t.equal(map.matchInsert('shift-ctrl-j'), undefined, 'matching [shift-ctrl-j] returns undefined')
    t.equal(map.matchInsert('ctrl-i'), undefined, 'matching [ctrl-i] returns undefined')

    t.end()
   })
})

test('\nspecial keys in insert mode', function (t) {
   t.test('\n# given I mapped [space] to escape', function (t) {
    var map = createMap()
    map.insert('space', 'escape')

    t.equal(map.mappings.insert.immediates['space'], 'escape', 'it is added to the mappings under insert.immediates.space')
    t.equal(map.matchInsert('space'), 'escape', 'matching [space] returns escape')

    t.end()
   })

   t.test('\n# given I mapped [shift-space] to escape', function (t) {
    var map = createMap()
    map.insert('shift-space', 'escape')

    t.equal(map.mappings.insert.immediates['shift-space'], 'escape', 'it is added to the mappings under insert.immediates.shift-space')
    t.equal(map.matchInsert('shift-space'), 'escape', 'matching [shift-space] returns escape')

    t.end()
   })
})

test('\nkey combinations in normal mode', function (t) {
   t.test('\n# given I mapped [ctrl-i] to escape', function (t) {
    var map = createMap()

    map.normal('ctrl-i', 'escape')

    t.equal(map.mappings.normal.immediates['ctrl-i'], 'escape', 'it is added to the mappings under normal.immediates.ctrl-i')
    t.equal(map.matchNormal('ctrl-i'), 'escape', 'matching [ctrl-i] returns escape')
    t.equal(map.matchNormal('shift-ctrl-i'), undefined, 'matching [shift-ctrl-i] returns undefined')

    t.end()
   })

   t.test('\n# given I mapped [shift-ctrl-i] to ctrl-p (although that does not currently work due to readline limiations)', function (t) {
    var map = createMap()

    map.normal('shift-ctrl-i', 'ctrl-p')

    t.equal(map.mappings.normal.immediates['shift-ctrl-i'], 'ctrl-p', 'it is added to the mappings under normal.immediates.shift-ctrl-i')
    t.equal(map.matchNormal('shift-ctrl-i'), 'ctrl-p', 'matching [shift-ctrl-i] returns ctrl-p')
    t.equal(map.matchNormal('shift-ctrl-j'), undefined, 'matching [shift-ctrl-j] returns undefined')
    t.equal(map.matchNormal('ctrl-i'), undefined, 'matching [ctrl-i] returns undefined')

    t.end()
   })
})

test('\nspecial keys in normal mode', function (t) {
   t.test('\n# given I mapped [space] to escape', function (t) {
    var map = createMap()
    map.normal('space', 'escape')

    t.equal(map.mappings.normal.immediates['space'], 'escape', 'it is added to the mappings under normal.immediates.space')
    t.equal(map.matchNormal('space'), 'escape', 'matching [space] returns escape')

    t.end()
   })

   t.test('\n# given I mapped [shift-space] to escape', function (t) {
    var map = createMap()
    map.normal('shift-space', 'escape')

    t.equal(map.mappings.normal.immediates['shift-space'], 'escape', 'it is added to the mappings under normal.immediates.shift-space')
    t.equal(map.matchNormal('shift-space'), 'escape', 'matching [shift-space] returns escape')

    t.end()
   })
})

