// CAppException.js

class CAppException extends Error {
   constructor(message) {
       super(message);
       this.name = 'CAppException';
   }
}

module.exports = CAppException;
