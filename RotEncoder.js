function* RotEncoder(key) {
   const offset = parseInt(key, 10);
   if (isNaN(offset) || offset <= 0) {
    throw new Error (`Bad offset: ${key}. Offset must be a positive number.`)
   };

// Constants for ASCII values of uppercase and lowercase letters
   const UPPERCASE_A = 65;
   const UPPERCASE_Z = 90;
   const LOWERCASE_A = 97;
   const LOWERCASE_Z = 122;
   const MAXCHAR = 26;

   yield {
       encode: (str) => str.split('').map(char => shiftChar(char, offset))
       .join(''),
       decode: (str) => str.split('').map(char => shiftChar(char, -offset))
       .join('')
   };

   function shiftChar(char, shiftAmount) {
       const charCode = char.charCodeAt(0);
       if (charCode >= UPPERCASE_A && charCode <= UPPERCASE_Z) {
           return String.fromCharCode((charCode - UPPERCASE_A + shiftAmount
             + MAXCHAR) % MAXCHAR + UPPERCASE_A);
       } else if (charCode >= LOWERCASE_A && charCode <= LOWERCASE_Z) {
           return String.fromCharCode((charCode - LOWERCASE_A + shiftAmount
             + MAXCHAR) % MAXCHAR + LOWERCASE_A);
       }
       return char; // Non-alphabet characters remain unchanged
   }
}

module.exports = RotEncoder;