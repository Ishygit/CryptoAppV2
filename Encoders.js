const RotEncoder = require('./RotEncoder');
const VigenereEncoder = require('./VigenereEncoder');
const SbsEncoder = require('./SbsEncoder');

const encoders = {
    RotEncoder: (key) => RotEncoder(key).next().value,
    VigenereEncoder: (key) => VigenereEncoder(key).next().value,
    SbsEncoder: (key) => SbsEncoder(key).next().value
};

module.exports = encoders;
