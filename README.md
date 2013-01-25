# readline-vim [![build status](https://secure.travis-ci.org/thlorenz/readline-vim.png)](http://next.travis-ci.org/thlorenz/readline-vim)

Adds vim bindings to nodejs readline.

## Installation

    npm install readline-vim

## Usage

**Repl Example:**
```js
var rlv = require('readline-vim')
  , repl = require('repl');

var r = repl.start({
    prompt: "vim repl > ",
    input: process.stdin,
    output: process.stdout
  });

// pass the readline component of the repl in order to add vim bindings to it
var vim = rlv(r.rli)
  , map = vim.map;

// Add mappings

// [insert mode] allow switching to normal mode by typing 'jk' quickly 
map.insert('jk', 'esc');

// [insert mode] go backward in history via 'ctrl-k' 
map.insert('ctrl-k', 'ctrl-p');

// [insert mode] go backward in history via 'ctrl-k' 
map.insert('ctrl-space', 'ctrl-n');

// [normal mode] go backward in history via space bar
map.normal('space', 'k');

// [normal mode] go forward in history via space bar when ctrl is pressed 
map.normal('ctrl-space', 'j');
```

Run it via: `npm run demo`

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Vim Bindings](#vim-bindings)
  - [Insert Mode](#insert-mode)
  - [Normal Mode](#normal-mode)
    - [Movements](#movements)
    - [Movements combined with Actions](#movements-combined-with-actions)
    - [History](#history)

## Vim Bindings

A subset of vim keybindings is supported by `readline-vim`:

### Insert Mode

- `Esc`, `Ctrl-[`: normal mode

### Normal Mode

- `i`, `I`, `a`, `A`: insert mode with the expected side effects

#### Movements

- `h` cursor left
- `l` cursor right
- `w` word right
- `b` word left
- `0` beginning of line
- `$` end of line

#### Movements combined with Actions

- `cb`: change word left
- `cw`: change word right
- `ch`: change left
- `cl`: change right
- `cc`, `C` change line

- `db`: delete word left
- `dw`: delete word right
- `dh`: delete left
- `dl`: delete right
- `dd`, `D` delete line

- `x` delete right
- `X` delete left

#### History

- `k` go back in history
- `j` go forward in history

## Mappings

### Immediate Mappings

### Sequence Mappings
