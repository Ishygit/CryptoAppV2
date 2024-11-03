function VigenereEncoder(key) {
    // Process the keyword to create offsets array
    this.offsets = key.toLowerCase().split('').map(char => {
        if (/[a-z]/.test(char)) {
            return char.charCodeAt(0) - 96; // 'a' -> 1, 'z' -> 26
        } else {
            throw `Invalid character in keyword: ${char}`;
        }
    });
}

// Encodes the input string using the Vigenère cipher
VigenereEncoder.prototype.encode = function(str) {
    return this._process(str, 'encode');
};

// Decodes the input string using the Vigenère cipher
VigenereEncoder.prototype.decode = function(str) {
    return this._process(str, 'decode');
};

// Helper function to handle encoding and decoding using the offsets array
VigenereEncoder.prototype._process = function(str, mode) {
    const shiftDirection = mode === 'encode' ? 1 : -1;

    return str.split('').map((char, i) => {
        const offset = this.offsets[i % this.offsets.length] * shiftDirection;

        // Check if character is uppercase or lowercase
        if (/[A-Z]/.test(char)) {
            return String.fromCharCode((char.charCodeAt(0) - 65 + offset + 26) % 26 + 65);
        } else if (/[a-z]/.test(char)) {
            return String.fromCharCode((char.charCodeAt(0) - 97 + offset + 26) % 26 + 97);
        }

        // Non-alphabetic characters remain unchanged
        return char;
    }).join('');
};

module.exports = VigenereEncoder;
