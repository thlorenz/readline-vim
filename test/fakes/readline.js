'use strict';
/*jshint asi: true*/

module.exports = function () {
  var self =  {

      _ttyWrite        :  function (code, key) { this.ttyWrite.push({ code : code, key :  key }) }
    , _moveCursor      :  function (arg) { this.moveCursor.push(arg) }

    , _wordLeft        :  function () { this.wordLeft++ }
    , _wordRight       :  function () { this.wordRight++ }

    , _deleteLeft      :  function () { this.deleteLeft++ }
    , _deleteRight     :  function () { this.deleteRight++ }
    , _deleteWordLeft  :  function () { this.deleteWordLeft++ }
    , _deleteWordRight :  function () { this.deleteWordRight++ }
    , _deleteLineLeft  :  function () { this.deleteLineLeft++ }
    , _deleteLineRight :  function () { this.deleteLineRight++ }

    , _historyPrev     :  function () { this.historyPrev++ }
    , _historyNext     :  function () { this.historyNext++ }

    , _line            :  function () { this.line++ }

    , reset: function () {
      this.ttyWrite        =  [];
      this.moveCursor      =  []

      this.wordLeft        =  0;
      this.wordRight       =  0;

      this.deleteLeft      =  0;
      this.deleteRight     =  0;
      this.deleteWordLeft  =  0;
      this.deleteWordRight =  0;
      this.deleteLineLeft  =  0;
      this.deleteLineRight =  0;

      this.historyPrev     =  0;
      this.historyNext     =  0;

      this.line            =  0;
    }
  };

  self.reset();
  return self;
};
