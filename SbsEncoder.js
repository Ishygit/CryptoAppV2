function SbsEncoder(key) {
   // Process the key into a map for lookups in the constructor
   this.map = this._createMap(key);
   this.reverseMap = this._createReverseMap(this.map);  // For decoding
}

// Encodes the input string using substitution
SbsEncoder.prototype.encode = function(str) {
   return str.split('').map(char => this.map[char] || char).join('');
};

// Decodes the input string using the reverse substitution map
SbsEncoder.prototype.decode = function(str) {
   return str.split('').map(char => this.reverseMap[char] || char).join('');
};

//Creates map from the key for substitution using split and regex
SbsEncoder.prototype._createMap = function(key) {
   const map = {};
   key.split(',').forEach(pair => {
      if(pair.length !== 2 || !/^[a-zA-Z]{2}$/.test(pair)){
         throw `Bad code pair: ${pair}`;
      }
       const [from, to] = pair.split('');  // Split the pair into two characters
       map[from] = to;
       if (/[A-Z]/.test(from)) {
           map[from.toUpperCase()] = to.toUpperCase();
      }
   });
   return map;
};

// Creates a reverse map for decoding purposes
SbsEncoder.prototype._createReverseMap = function(map) {
   const reverseMap = {};
   Object.keys(map).forEach(from => {
       const to = map[from];
       reverseMap[to] = from;  // Reverse the mapping
   });
   return reverseMap;
};

// Exporting using Node.js common module system
module.exports = SbsEncoder;
