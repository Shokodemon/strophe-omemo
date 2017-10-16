"use strict";

var codec= require('./codec.js')
var gcm = {};


function pprint(s) {
  console.log("gcm.js: " + s)
}
function serializeKey(CryptoKeyObject) {
  let res = ''
  return window.crypto.subtle.exportKey("jwk", CryptoKeyObject)
    .then((e) => {
      return e.k
    })
}
function restoreKey(k) {
  let CryptoKeyString = {
    "alg":"A256GCM",
    "ext":true,
    "k":codec.b64encodeToString(k),
    "key_ops":["encrypt","decrypt"],
    "kty":"oct"
  }
  let parsed = JSON.parse(CryptoKeyString)
  return crypto.subtle.importKey('jwk', parsed, 'AES-GCM', true, ['encrypt','decrypt'])
    .then((e) => {
      return e
    })
}
function gettag(encrypted, tagLength) {
    if (tagLength === void 0) tagLength = 128;
    return encrypted.slice(encrypted.byteLength - ((tagLength + 7) >> 3))
}
function encrypt(key, text) {
  //the out of window.crypto is only the cipher text (i assume?)
  //the tag is not mentioned. unless it concatinated inside. look at code?
  //after ecnrypting, we dont need to keep the key
  const data = codec.StringToUint8(text)
  const temp_iv = window.crypto.getRandomValues(new Uint8Array(16))
  const aad =  codec.StringToUint8("fetch from libsignal rid store here")
  const alg = {
    name: "AES-GCM",
    iv: temp_iv, //uint8 buffer
    additionalData: aad, //uint8 buffer
    tagLength: 128
  }
  return window.crypto.subtle.encrypt(alg, key, data).then((cipherText) => {
    let gcm_out = {
      key: key,
      cipherText: cipherText,
      iv: temp_iv,
      aad: aad,
      tag: gettag(cipherText, 128)
    }
   return  Promise.resolve(gcm_out)
    //omemo._store.put("encrypted", gcm_out)
  })
}

function decrypt(key, cipherText, iv, aad) {
  let enc = new TextDecoder()
  return window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
      additionalData: aad,
      tagLength: 128,
    },
    key,
    cipherText
  )
    .then((gcm_out) =>  {
      omemo._store.put("decrypted", gcm_out)
      let res = enc.decode(store.get("decrypted"))
    })
  return res
}

gcm = {
  encrypt: function (text) {
   return  window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256, //current max value
      },
      true, //extractable yes
      ["encrypt", "decrypt"] //can "encrypt", "decrypt",
   ).then((key) => {
      return encrypt(key, text)
   })
  },
  decrypt: function (key, cipherText, iv, aad) {
    decrypt(key, cipherText,iv, aad)
    //on success destroy key ? or set timer for key destruction?
  },
  serializeKey: function(key) {
    return serializeKey(key)
  },
  restoreKey: function(key) {
    return restoreKey(key)
  }
}

module.exports = gcm

//gcm.key()
//gcm.encrypt("hello", gcm.iv(), key, gcm.aad())
