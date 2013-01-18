'use strict';
/*jshint asi: true*/

var test = require('tap').test
var createRli = require('./fakes/readline')
var readlineVim = require('..')

var rli, rlv, normal, insert


function key(k) {
  var name, ctrl, alt, shift;
  var keys = k.split('-');
  if (keys.length === 1) name = keys[0];
  else name = keys[1], ctrl = keys[0] === 'ctrl', alt = keys[0] === 'alt', shift = keys[0] = 'shift'

  rli._ttyWrite(null, { name: name, ctrl: ctrl, alt: alt, shift: shift })
}

function setup() {
  rli = createRli()
  rlv = readlineVim(rli)
  rlv.events.on('normal', function () { normal++ })
  rlv.events.on('insert', function () { insert++ })

  normal = 0
  insert = 0
}

test('switching to normal mode', function (t) {
  setup()
  
  var k = 'escape'
  key(k)
  t.equal(normal, 1, 'when in insert mode, [' + k + '] switches to normal mode')
  key(k)
  t.equal(normal, 1, 'when in normal mode, [' + k + '] not switches to normal mode')

  rli.reset()

  k = 'Ctrl-['
  key(k)
  t.equal(normal, 1, 'when in insert mode, [' + k + '] switches to normal mode')
  key(k)
  t.equal(normal, 1, 'when in normal mode, [' + k + '] not switches to normal mode')

  t.end()
})

test('switching to insert mode', function (t) {
  setup()

  function normalToInsert(k) {
    rli.reset()
    rlv.forceNormal()
    key(k)
    t.equal(insert, 1, 'when in normal mode, [' + k + '] switches to insert mode')
  }

  var k = 'i'
  key(k)
  t.equal(insert, 0, 'when in insert mode, [' + k + '] not switches to insert mode')

  normalToInsert('i')
  normalToInsert('a')

  t.end()
})
