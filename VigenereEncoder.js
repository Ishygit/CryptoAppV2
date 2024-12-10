function* VigenereEncoder(key) {
  // Validate key
  if (!/^[a-zA-Z]+$/.test(key)) {
    throw new Error('Key must be a single word containing only alphabetic characters.');
  }

  const keyOffsets = key.toLowerCase().split('').map(char => char.charCodeAt(0) - 'a'.charCodeAt(0) + 1);

  // Generator function for cycling offsets
  function* offsetIterator(offsets) {
    let index = 0;
    while (true) {
      yield offsets[index % offsets.length];
      index++;
    }
  }

  const iterator = offsetIterator(keyOffsets);

  // Function to shift characters
  function shiftChar(char, shift) {
    const base = char >= 'a' && char <= 'z' ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
    const alphabetSize = 26;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift + alphabetSize) % alphabetSize) + base);
  }

  yield {
    encode: function (text) {
      const encodeIterator = offsetIterator(keyOffsets); // Reset iterator for encoding
      return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
          const shift = encodeIterator.next().value;
          return shiftChar(char, shift);
        }
        return char; // Leave non-alphabetic characters unchanged
      }).join('');
    },
    decode: function (text) {
      const decodeIterator = offsetIterator(keyOffsets); // Reset iterator for decoding
      return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
          const shift = decodeIterator.next().value;
          return shiftChar(char, -shift);
        }
        return char; // Leave non-alphabetic characters unchanged
      }).join('');
    }
  };
}

module.exports = VigenereEncoder;
