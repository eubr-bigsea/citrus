/**
 * (C) Gagan Ganapathy
 * 
 * Adapted from https://jsfiddle.net/h1pet9am/
 * More info: https://medium.com/weekly-webtips/js-implementing-auto-complete-f4c5a5d5c009
 */
export default {
const $input = document.getElementById('input');
const $time = document.getElementById('time');
const $fakeDiv = document.getElementById('fake-div');
const r = $input.getBoundingClientRect();
let INPUT_DEBOUNCE = null;

const $span = document.createElement('span');

const css = getComputedStyle($input);

$span.style.cssText = `
    width: ${r.width}px;
    height: ${r.height}px;
    left: ${r.left}px;
    top: ${r.top}px;
    z-index: -10;
    opacity: 0.4;
    position: absolute;
    white-space: pre-wrap;
    font-size: ${parseInt(css.fontSize)}px;
    padding-left: ${parseInt(css.paddingLeft)}px;
    padding-top: ${parseInt(css.paddingTop) + 1}px;
`;

document.body.appendChild($span);

class Trie {
  constructor() {
    this.trie = null;
    this.suggestions = [];
  }

  newNode() {
    return {
      isLeaf: false,
      children: {}
    }
  }

  add(word) {
    if (!this.trie) this.trie = this.newNode();

    let root = this.trie;
    for (const letter of word) {
      if (!(letter in root.children)) {
        root.children[letter] = this.newNode();
      }
      root = root.children[letter];
    }
    root.isLeaf = true;
  }

  find(word) {
    let root = this.trie;
    for (const letter of word) {
      if (letter in root.children) {
        root = root.children[letter];
      } else {
        return null;
      }
    }

    return root;
  }

  traverse(root, word) {
    if (root.isLeaf) {
      this.suggestions.push(word);
      return;
    }

    for (const letter in root.children) {
      this.traverse(root.children[letter], word + letter);
    }
  }

  complete(word, CHILDREN = null) {
    const root = this.find(word);

    if (!root) return this.suggestions; // cannot suggest anything

    const children = root.children;

    let spread = 0;

    for (const letter in children) {
      this.traverse(children[letter], word + letter);
      spread++;

      if (CHILDREN && spread === CHILDREN) break;
    }

    return this.suggestions;
  }

  clear() {
    this.suggestions = [];
  }

  print() {
    console.log(this.trie);
  }
}

const getData = async () => {
  const url = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_compact.json';
  const res = await fetch(url, {
    method: 'GET'
  });

  return await res.json();
}

const getPopular = async () => {
  const url = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';

  const res = await fetch(url, {
    method: 'GET'
  });

  let text = await res.text();

  const popular = {};

  text = text.split('\n');

  const TOTAL = text.length;

  text.forEach((word, freq) => {
    if (word !== '') {
      popular[word.toLowerCase()] = TOTAL - freq;
    }
  });

  return popular;
}

let data = null,
  words = null,
  trie = null,
  popular = null;
let rest = null,
  suggestion = null;

export const init = async () => {
  console.log("GETTING DATA");
  $input.style.cursor = 'not-allowed';

  data = await getData();
  popular = await getPopular();

  words = Object.keys(data).sort();

  trie = new Trie();

  words.forEach(word => trie.add(word.toLowerCase()));

  $input.style.cursor = 'auto';

  console.log("INITIALIZED");
}

const getBestMatch = (suggestions) => {
  let bestMatch = null,
    bestScore = -100;
  for (const suggestion of suggestions) {
    if (suggestion in popular && popular[suggestion] > bestScore) {
      bestMatch = suggestion;
      bestScore = popular[suggestion];
    }
  }

  if (!bestMatch) bestMatch = suggestions[0];

  return bestMatch;
}

const main = (e) => {
  const query = e.target.textContent.toLowerCase();

  if (query !== '') {
    const find_start = new Date().getTime();

    let parts = query.split(' ');

    const wordToComplete = parts.pop();

    rest = parts.join(' ') + ' ';

    if (wordToComplete !== '') {
      suggestion = getBestMatch(trie.complete(wordToComplete));

      if (suggestion) {
        $fakeDiv.innerText = query;

        $span.style.left = r.left + $fakeDiv.clientWidth + 'px';

        const ghost = suggestion.slice(wordToComplete.length);

        trie.clear();

        $span.textContent = ghost;

        const find_end = new Date().getTime();

        const execTime = find_end - find_start;

        $time.textContent = `fetched in ${execTime}ms`;
      }
    } else {
      $span.textContent = '';
    }
  } else {
    $time.textContent = '';
    $span.textContent = '';
  }
}

init();

const setEndOfContenteditable = (contentEditableElement) => {
  let range, selection;
  if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
  {
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
  } else if (document.selection) //IE 8 and lower
  {
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
}

$input.addEventListener('input', e => {
  clearTimeout(INPUT_DEBOUNCE);
  $span.textContent = '';

  INPUT_DEBOUNCE = setTimeout(() => main(e), 250);
});

$input.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    $span.textContent = '';
    $input.textContent = rest + suggestion;

    setEndOfContenteditable($input);
  } else if (e.key === 'Enter') {
    $span.textContent = '';
  }
});
}