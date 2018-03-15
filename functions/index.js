'use strict';
process.env.DEBUG = 'actions-on-google:*';

// --------- LIBRARY TO BE INCLUDED ---------
const Assistant = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

//--------- LIST OF DATABASE REF -------
const dictionaryRef = admin.database().ref('/dictionary/Spanish');

//------ DIALOGFLOW ACTIONS -----
const TRANSLATE_INTENT = "translating"

//--------- PARAMETERS -----------
const WORD_PARAMETER = "word";
const LANGUAGE_PARAMETER = "langauge";

exports.lingo = functions.https.onRequest((request, response) => {
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    const assistant = new Assistant({request: request, response: response});

    //------------- TRANSLATING FUNCTION -------------
    function translate_func(assistant){
        let word = assistant.getArgument(WORD_PARAMETER);

        dictionaryRef.once("value", snap => {

            const speech = `Okay,` + word + ` in Spanish is ${snap.val()[word]}`;
            assistant.ask(speech);
        });
    }

    //-------- HANDLE ACTION MAP --------
    let actionMap = new Map();
    actionMap.set(TRANSLATE_INTENT, translate_func);
    assistant.handleRequest(actionMap);


});
