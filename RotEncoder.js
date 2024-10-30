function RotEncoder(key) {
   // Parse the key for rotation in the constructor
   const offset = parseInt(key, 10);
   if(isNaN(offset) || offset <= 0){
      throw `Bad offset ${key}`;
   }

   this.key = offset;
}

// Constants for character ranges
const UPPER_A = 'A'.charCodeAt(0);
const LOWER_A = 'a'.charCodeAt(0);
const MAXCHAR = 26;

// Encodes the input string by shifting each character
RotEncoder.prototype.encode = function(str) {
   return str.split('').map(char => this._shift(char, this.key)).join('');
};

// Decodes the input string by reversing the shift
RotEncoder.prototype.decode = function(str) {
   return str.split('').map(char => this._shift(char, -this.key)).join('');
};

// Helper function to shift characters based on the key
RotEncoder.prototype._shift = function(char, shiftAmount) {
   const charCode = char.charCodeAt(0);

   // Check if character is uppercase or lowercase using regex
   const isUpperCase = /[A-Z]/.test(char);
   const isLowerCase = /[a-z]/.test(char);

   if (isUpperCase) {
      return String.fromCharCode(((charCode - UPPER_A + shiftAmount + MAXCHAR) 
       % MAXCHAR) + UPPER_A);
   } else if (isLowerCase) {
      return String.fromCharCode(((charCode - LOWER_A + shiftAmount + MAXCHAR) 
       % MAXCHAR) + LOWER_A);
   }
   // Non-alphabetic characters remain unchanged
   return char;
};

// Export using Node.js common module system
module.exports = RotEncoder;
