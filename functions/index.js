'use strict';
process.env.DEBUG = 'actions-on-google:*';

// --------- LIBRARY TO BE INCLUDED ---------
const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

//--------- LIST OF DATABASE REF -------
const dictionaryRef = admin.database().ref('/dictionary/Spanish');


//------ DIALOGFLOW ACTIONS -----
const TRANSLATE_INTENT = "translating"



exports.lingo = functions.https.onRequest((request, response) => {
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    const assistant = new Assistant({request: request, response: response});


    let actionMap = new Map();
    actionMap.set(TRANSLATE_INTENT, translate_func);


    //-------- TRANSLATING FUNCTION --------
    function translate_func(assistant){
        dictionaryRef.once("value", snap => {
            const speech = `Okay, the word you want to translate is ${snap.val().lamp}`;
            assistant.ask(speech);
        });
    };

});
