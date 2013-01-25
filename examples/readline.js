'use strict';

var readline = require('readline')
  , readlineVim = require('..')
  , rli = readline.createInterface(process.stdin, process.stdout)
  , vim = readlineVim(rli)
  , map = vim.map
  ;

/*
 * Mappings:
 * 
 * It is important to note the following actions are present by default:
 *  - [esc] by default switches to normal mode
 *  - [ctrl-p] and [ctrl-n] navigate the history in insert mode
 *  - [j] and [k] navigate the history in normal mode
 *
 * The below mappings add other ways to invoke the same actions
 */

// [insert mode] allow switching to normal mode by typing 'jk' quickly 
map.insert('jk', 'esc');

// [insert mode] go backward in history via 'ctrl-k' 
map.insert('ctrl-k', 'ctrl-p');
//
// [insert mode] go backward in history via 'ctrl-k' 
// (forward via 'ctrl-j' doesn't work since it is interpreted as 'enter')
map.insert('ctrl-space', 'ctrl-n');

// [normal mode] go backward in history via space bar
map.normal('space', 'k');

// [normal mode] go forward in history via space bar when ctrl is pressed 
// (shift wouldn't work with space since nodejs readline checks for uppercase)
map.normal('ctrl-space', 'j');
