'use strict';

var readline = require('readline')
  , readlineVim = require('..')
  , rli = readline.createInterface(process.stdin, process.stdout)
  , vim = readlineVim(rli)
  , map = vim.map
  ;

// Mappings

// [insert mode] allow switching to normal mode by typing 'jk' quickly 
map.insert('jk', 'esc');

// [insert mode] go backward in history via 'ctrl-k' 
// (forward via 'ctrl-j' doesn't work since it is interpreted as 'enter')
map.insert('ctrl-k', 'ctrl-p');

// [normal mode] go backward in history via space bar
map.normal('space', 'k');

// [normal mode] go forward in history via space bar when ctrl is pressed 
// (shift wouldn't work with space since nodejs readline checks for uppercase)
map.normal('ctrl-space', 'j');
