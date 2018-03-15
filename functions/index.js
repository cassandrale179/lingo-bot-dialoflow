'use strict';
process.env.DEBUG = 'actions-on-google:*';

// --------- LIBRARY TO BE INCLUDED ---------
const Assistant = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

//--------- LIST OF DATABASE REF -------
const dictionaryRef = admin.database().ref('/dictionary/Spanish');
const practiceRef = admin.database().ref('/practice/Spanish');
// const dictionaryRef = admin.database().ref('/dictionary');



//------ DIALOGFLOW ACTIONS -----
const TRANSLATE_INTENT = "translating";
const LESSON_INTENT = "lessoning";

//--------- PARAMETERS -----------
const WORD_PARAMETER = "word";
const LANGUAGE_PARAMETER = "language";

exports.lingo = functions.https.onRequest((request, response) => {

    const assistant = new Assistant({request: request, response: response});

    //------------- TRANSLATING FUNCTION -------------
    function translate_func(assistant){
        let word = assistant.getArgument(WORD_PARAMETER);
        let language = assistant.getArgument(LANGUAGE_PARAMETER);

        dictionaryRef.once("value", snap => {
            // const speech = `Okay,` + word + ` in` + language + `is ${snap.val()[word]}`;
            const speech = `Okay,` + word + ` in Spanish is ${snap.val()[word]}`;
            assistant.ask(speech);
        });
    }


    //---------------- ADDING LESSONS --------------
    function lesson_func(assistant){
        practiceRef.once("value", snap => {
            const speech = `Here's a question for you. What is lamp in Spanish?`;
            assistant.ask(speech);
        });
    }



    //-------- HANDLE ACTION MAP --------
    let actionMap = new Map();
    actionMap.set(TRANSLATE_INTENT, translate_func);
    actionMap.set(LESSON_INTENT, lesson_func);
    assistant.handleRequest(actionMap);


});
