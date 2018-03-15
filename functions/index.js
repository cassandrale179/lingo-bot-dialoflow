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
const ADD_INTENT = "adding";
const LESSON_INTENT = "lessoning";
const ANSWER_INTENT = "answering";

//--------- PARAMETERS -----------
const WORD_PARAMETER = "word";
const LANGUAGE_PARAMETER = "language";
const IMPROV_PARAMETER = "improv";
const ANSWER_PARAMETER = "useranswer";

exports.lingo = functions.https.onRequest((request, response) => {

    const assistant = new Assistant({request: request, response: response});

    //------------- TRANSLATING FUNCTION -------------
    function translate_func(assistant){
        let word = assistant.getArgument(WORD_PARAMETER);
        let language = assistant.getArgument(LANGUAGE_PARAMETER);
        dictionaryRef.once("value", snap => {
            const speech = `Okay,` + word + ` in Spanish is ${snap.val()[word]}`;
            assistant.ask(speech);
        });
    }


    //-------- ADDING WORD TO FIREBASE -------
    function add_func(assistant){
        let improve = assistant.getArgument(IMPROV_PARAMETER);
        const speech = `Okay,` + improve + ` has been added to your dictionary`;
        assistant.ask(speech);
        // practiceRef.update({[improve]: 'cryptocurrency'});
    }


    //---------------- ADDING LESSONS --------------
    function lesson_func(assistant){
        practiceRef.once("value", snap => {
            const speech = `Here's a question for you. What is cryptocurrency in Spanish?`;
            assistant.ask(speech);
        });
    }

    //--------- CHECK ANSWER FROM USER -------
    function check_answer(assistant){
        let speech = "";
        let answer = assistant.getArgument(ANSWER_PARAMETER);
        practiceRef.once("value", snap => {
            let value = snap.val()[answer];
            if (answer === value)
                speech = `That's correct! You receive ten points!`;
            else
                speech = `Oops, that is not correct! Please try again`;
        });
    }



    //-------- HANDLE ACTION MAP --------
    let actionMap = new Map();
    actionMap.set(TRANSLATE_INTENT, translate_func);
    actionMap.set(ADD_INTENT, add_func);
    actionMap.set(LESSON_INTENT, lesson_func);
    // actionMap.set(ANSWER_INTENT, check_answer);
    assistant.handleRequest(actionMap);


});
