function* VigenereEncoder(key) {
   // Constants for ASCII values of uppercase and lowercase letters
   const UPPERCASE_A = 65;
   const UPPERCASE_Z = 90;
   const LOWERCASE_A = 97;
   const LOWERCASE_Z = 122;
   const MAXCHAR = 26;

   const offsets = Array.from(key.toLowerCase()).map(char => char.charCodeAt(0)
    - LOWERCASE_A + 1);

    let offsetIndex = 0;

   yield {
       encode: (str) => applyVigenereCipher(str, offsets, 1),
       decode: (str) => applyVigenereCipher(str, offsets, -1)
   };

   function applyVigenereCipher(str, offsets, direction) {
       return str.split('').map(char => {
           const shiftAmount = offsets[offsetIndex] * direction;
           offsetIndex = (offsetIndex + 1) % offsets.length;
           return shiftChar(char, shiftAmount);
       }).join('');
   }

   function shiftChar(char, shiftAmount) {
       const charCode = char.charCodeAt(0);
       if (charCode >= UPPERCASE_A && charCode <= UPPERCASE_Z) {
           return String.fromCharCode((charCode - UPPERCASE_A + shiftAmount
             + MAXCHAR) % MAXCHAR + UPPERCASE_A);
       } else if (charCode >= LOWERCASE_A && charCode <= LOWERCASE_Z) {
           return String.fromCharCode((charCode - LOWERCASE_A + shiftAmount
             + MAXCHAR) % MAXCHAR + LOWERCASE_A);
       }
       return char;
   }
}

module.exports = VigenereEncoder;
