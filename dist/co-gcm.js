/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var codec= __webpack_require__(1)
var gcm = {};

gcm =  {
  encrypt: function (text, miv, mkey, aad) {
    window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: miv,
        additionalData: codec.StringToUint8(aad),
        tagLength: 128
      },
      mkey,
      codec.StringToUint8(text)
    )
      .then(function(encrypted){
        console.log(encrypted)
        window.encrypted8 = new Uint8Array(encrypted); // works
        window.encrypted = encrypted; //actually not empty
      })
      .catch(function(err){
        console.error(err.message);
      });
  },
  decrypt: function(ciphertext, miv, mkey, aad) {
    window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: miv, //uint8 buffer
        additionalData: aad, //uint8 buffer
        tagLength: 128
      },
      mkey, //CryptoKey
      ciphertext //Uint8 of the data
    )
      .then(function(decrypted){
        //if success, destroy receive key before returning
        //returns an ArrayBuffer containing the decrypted data
        //window.decrypted = decrypted
        return new Uint8Array(decrypted);
      })
      //.catch(function(err){ // err ironically hides the real error.
      //  console.error(err); // good for err handeling, not debugging.
      //});
  },
  iv:  function () {
    return window.crypto.getRandomValues(new Uint8Array(12))
  },
  key: function () {
    window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256, //max key length, min is 128
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //can "encrypt" and "decrypt"
    )
      .then(function(key){
        //key must be extracted here 
        window.crypto.subtle.exportKey(
          "jwk", //can be "jwk" or "raw"
          key //extractable must be true
        )
          .then(function(keydata){
            //returns the exported key data
            window.key = key
            window.keydata = keydata
            [key, keydata]

          })
          .catch(function(err){
            console.error(err.message);
          });
      })
      .catch(function(err){
        console.error(err.message);
      })
  } ,
    aad: function(jid1, jid2) {
    return codec.StringToUint8("two concatinated identity key encodes here")
  }
}

module.exports = gcm
window.gcm = gcm

//gcm.key()
//gcm.encrypt("hello", gcm.iv(), key, gcm.aad())


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var codec = {};

codec = {
  StringToUint8: function (string) {
    var enc = new TextEncoder("utf-8");
    return enc.encode(string);
  },
  Uint8ToString: function (buffer) {
    return String.fromCharCode.apply(null, buffer);
  },
  Uint8ToHexString: function (buffer) {
    var res = ''
    for (var i = 0; i <  buffer.length; i++) {
      res = res + buffer[i].toString(8)
    }
    return res
  },
  StringToBase64: "TODO",
  Base64ToString: "TODO"
}

module.exports = codec
window.codec = codec


/***/ })
/******/ ]);