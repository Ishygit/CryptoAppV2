function* SbsEncoder(key) {
    const map = createMap(key);
    const reverseMap = createReverseMap(map);

    yield {
        encode: (str) => str.split('').map(char => map[char] || char).join(''),
        decode: (str) => str.split('').map(char => reverseMap[char] 
            || char).join('')
    };

    function createMap(key) {
        const map = {};
        key.split(',').forEach(pair => {
            const [from, to] = pair.split('');
            if (from && to) {
                map[from] = to;
            }
        });
        return map;
    }

    function createReverseMap(map) {
        const reverseMap = {};
        Object.keys(map).forEach(from => {
            const to = map[from];
            reverseMap[to] = from;
        });
        return reverseMap;
    }
}

module.exports = SbsEncoder;
