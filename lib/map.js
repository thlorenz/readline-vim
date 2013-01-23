'use strict';

var create = module.exports = function () {
  var mappings = {
    insert: { sequences:  { }, immediates: { } },
    normal: { immediates: { } }
  };

  function mapSequence(mode, from, to) {
    var chars = from.split('')
      , current = mappings[mode].sequences;

    chars.forEach(function (char, index, arr) {
      current[char] = index < (arr.length - 1) ? {} : to;
      current = current[char];
    });
  }

  function mapModifier(mode, from, to) {
    mappings[mode].immediates[from] = to;
  }

  function matchSequence(maps, seq) {
    var current = maps;

    for (var i = 0; i < seq.length; i++) {
      var k = seq[i];
      current = current[k];

      if (!current) return null;
      if (typeof current === 'string') return current;
    }

    // didn't find a match, but with more keys one is possible
    return true;
  }

  function matchImmediate(maps, keystring) {
    return maps[keystring];
  }

  /**
   * Maps a key or sequence to another key
   * 
   * @name map
   * @function
   * @param mode {String} insert or normal
   * @param from {String} key or sequence to map from
   * @param to {String} key to map to
   */
  function map(mode, from, to) {
    from = from.toLowerCase();
    if (~from.indexOf('-')) return mapModifier(mode, from, to);
    if (from.length > 1) return mapSequence(mode, from, to);
    throw new Error('You can only map key sequences in insert mode and keys combined with modifiers like ctrl in insert or normal mode');
  }

  /**
   * Tries to find a match for the given key or char sequence.
   * 
   * @name match
   * @function
   * @param mode {String} insert or normal
   * @param keyorseq {String|Array[String]} the key to match i.e. 'ctrl-e' or sequence i.e. ['j','k']
   * @return {String|Boolean} 
   * a matched mapping if found 
   * or true if a match is possible via a sequence 
   * or null if no match is found nor possible
   */
  function match(mode, keyorseq) {
    if (!Array.isArray(keyorseq)) 
      return matchImmediate(mappings[mode].immediates, keyorseq);
    if (mode === 'insert') 
      return matchSequence(mappings.insert.sequences, keyorseq);

    // key sequence mappings are currently only allowed for insert mode
  }

  return {
      insert      :  map.bind(this, 'insert')
    , normal      :  map.bind(this, 'normal')
    , matchNormal :  match.bind(this, 'normal')
    , matchInsert :  match.bind(this, 'insert')
    , mappings    :  mappings
  };
};
