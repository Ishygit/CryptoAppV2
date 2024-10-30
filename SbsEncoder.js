function SbsEncoder(key) {
   this.map = {};
   this.reverseMap = {};

   // Set up encoding and decoding maps based on the key
   key.split(',').forEach(pair => {
       const [from, to] = pair;
       if (from && to && /[a-zA-Z]/.test(from) && /[a-zA-Z]/.test(to)) {
           this.map[from] = to;
           this.reverseMap[to] = from;
       } else {
           throw `Bad code pair: ${pair}`;
       }
   });
}

// Encode and decode as one-liners
SbsEncoder.prototype.encode = function(str) {
   return str.split('').map(char => this.map[char] || char).join('');
};

SbsEncoder.prototype.decode = function(str) {
   return str.split('').map(char => this.reverseMap[char] || char).join('');
};

module.exports = SbsEncoder;
