//this is the second version of the project
const rls = require('readline-sync');
const RotEncoder = require('./RotEncoder');
const SbsEncoder = require('./SbsEncoder');

function main() {
   try{
      const args = process.argv.slice(2)
      if (args.length !== 3){
         throw `Usage: crypto algorithm key`
      } 
   
    const [operation, encoderType, key] = args;
    
    let encoder;

    // instantiating the correct encoder based on command-line arguments
    switch (encoderType.toLowerCase()) {
        case 'rotencoder':
            encoder = new RotEncoder(key);
            break;
        case 'sbsencoder':
            encoder = new SbsEncoder(key);
            break;
        default:
            throw `Unknown encoder type: ${encoderType}`;
    }

    // Perform encoding or decoding based on the operation
    if (operation === 'E') {
        while (line = rls.question()) {
            console.log(encoder.encode(line));
        }
    } else if (operation === 'D') {
        while (line = rls.question()) {
            console.log(encoder.decode(line));
        }
    } else {
        throw'Invalid operation. Use E for Encode or D for Decode.';
    }
   } catch (error) {
      console.log(error) //catch and display any thrown error
   }
}

main();

