import { $iq, Strophe } from 'strophejs/strophe.js';

Strophe.addNamespace('OMEMO', 'eu.siacs.conversations.axolotl');

var omemo = {
   _connection: null,
   _storage = window.localStorage
};

omemo.init = function(conn) {
   this._connection = conn;

   //@TODO maybe setup

   conn.addHandler(this._onMessage.bind(this), null, 'message');
}

omemo.createEncryptedStanza = function(to, plaintext) {
   var encryptedStanza = new Strophe.Builder('encrypted', {
      xmlns: Strophe.NS.OMEMO
   });

   //@TODO

   return encryptedStanza;
}

omemo._onMessage = function(stanza) {
   //@TODO

   $(document).trigger('msgreceived.omemo', [decryptedMessage, stanza]);
}

Strophe.addConnectionPlugin('omemo', omemo);
