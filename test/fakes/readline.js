'use strict';
/*jshint asi: true*/

module.exports = function () {
  var ttyWrite
    , moveCursor
    , wordLeft
    , wordRight
    , deleteLeft
    , deleteRight
    , deleteWordLeft
    , deleteWordRight
    , deleteLineLeft
    , deleteLineRight
    , historyPrev
    , historyNext
    , line
    ;

  function reset() {
    ttyWrite        =  [];
    moveCursor      =  []

    wordLeft        =  0;
    wordRight       =  0;

    deleteLeft      =  0;
    deleteRight     =  0;
    deleteWordLeft  =  0;
    deleteWordRight =  0;
    deleteLineLeft  =  0;
    deleteLineRight =  0;

    historyPrev     =  0;
    historyNext     =  0;

    line            =  0;
  }

  reset()

  return {

      _ttyWrite        :  function (code, key) { ttyWrite.push({ code :  code, key :  key }) }
    , _moveCursor      :  function (arg) { moveCursor.push(arg) }

    , _wordLeft        :  function () { wordLeft++ }
    , _wordRight       :  function () { wordRight++ }

    , _deleteLeft      :  function () { deleteLeft++ }
    , _deleteRight     :  function () { deleteRight++ }
    , _deleteWordLeft  :  function () { deleteWordLeft++ }
    , _deleteWordRight :  function () { deleteWordRight++ }
    , _deleteLineLeft  :  function () { deleteLineLeft++ }
    , _deleteLineRight :  function () { deleteLineRight++ }

    , _historyPrev     :  function () { historyPrev++ }
    , _historyNext     :  function () { historyNext++ }

    , _line            :  function () { line++ }

    , reset            :  reset
  };
};
