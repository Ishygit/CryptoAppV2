function* RotEncoder(key) {
   const offset = parseInt(key, 10);
   if (isNaN(offset) || offset <= 0) throw `Bad offset ${key}`;

// Constants for ASCII values of uppercase and lowercase letters
   const UPPERCASE_A = 65;
   const UPPERCASE_Z = 90;
   const LOWERCASE_A = 97;
   const LOWERCASE_Z = 122;

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
             + 26) % 26 + UPPERCASE_A);
       } else if (charCode >= LOWERCASE_A && charCode <= LOWERCASE_Z) {
           return String.fromCharCode((charCode - LOWERCASE_A + shiftAmount
             + 26) % 26 + LOWERCASE_A);
       }
       return char; // Non-alphabet characters remain unchanged
   }
}

module.exports = RotEncoder;