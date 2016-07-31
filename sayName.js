/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("firstName" === intentName) {
        setFirstName(intent, session, callback);
    } else if ("whatsMyName" === intentName) {
        whatsMyName(intent, session, callback); 
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else if ("destruct" === intentName) {
        selfDestruct(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Hello Fellow Gap Employee, please tell me your name.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "What is your name already.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Get back to work!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the name in the session and prepares the speech to reply to the user.
 */
function selfDestruct(intent, session, callback) {
    var repromptText = "";
    var sequenceCode = intent.slots.sequenceCode;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    console.log ("selfDestruct -> sequenceCode: " + JSON.stringify(sequenceCode));

    if (sequenceCode) {
        var mySequenceCode = sequenceCode.value;
        sessionAttributes = createSequenceCode(mySequenceCode);
    }

    repromptText = "Awaiting Command.";

    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

function createSequenceCode(mySequenceCode) {
    return {
        mySequenceCode: mySequenceCode
    };
}

function selfDestructCode(intent, session, callback) {
    var mySequenceCode;
    var repromptText = "";
    var destructCode = intent.slots.destructCode;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        mySequenceCode = session.attributes.mySequenceCode;
    }

    if (mySequenceCode == "Destruct sequence one") {

        if (destructCode == "one one A") {
            speechOutput = "Self destruct code one one A verified and correct. Sequence one complete."
        } else {
            speechOutput = "Self destruct code incorrect."
        }

        repromptText = "Enter self destruct code";        
    }

    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the name in the session and prepares the speech to reply to the user.
 */
function setFirstName(intent, session, callback) {
    var cardTitle = intent.name;
    var firstName = intent.slots.myFirstName;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    console.log ("setFirstName -> firstName: " + JSON.stringify(firstName));

    if (firstName) {
        var myFirstName = firstName.value;
        sessionAttributes = createFirstNameAttributes(myFirstName);
        speechOutput = "I now know your name is " + myFirstName;

        if (myFirstName == "Luke") {
            speechOutput += ". " + luke();
        } else if (myFirstName == "Nate") {
            speechOutput = nate();
        } else if (myFirstName == "Brian") {
            speechOutput += ". " + brian();
        } else if (myFirstName == "Rachel") {
            speechOutput += ". " + rachel();
        } else if (myFirstName == "Dylan") {
            speechOutput += ". " + dylan();
        } else if (myFirstName == "Kevin") {
            speechOutput += ". " + kevin();
        } else if (myFirstName == "Kevin") {
            speechOutput += ". " + kevin();
        }  else if (myFirstName == "Brandon") {
            speechOutput += ". " + brandon();
        }  else if (myFirstName == "Aaron" || myFirstName == "Erin") {
            speechOutput += ". " + aaron();
        }  else if (myFirstName == "Trisha") {
            speechOutput = trisha();
        }


        repromptText = "Tell me your name so that I can tell you something about your life.";
    } else {
        speechOutput = "What?. Please try again";
        repromptText = "I'm not sure what your name is, please tell me your name by saying my name is Fred. ";
    }

    console.log ("setFirstName -> sessionAttributes: " + JSON.stringify(sessionAttributes));

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function luke(){
    return "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire."
 + " During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet."
+ " Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy.";

}

function nate(){
    return " Oh, it is you master.  Thank you for taking me out to see all these nice people.  When you have a minute, would you please buy " +
    "me a battery?  I hate being tethered to this cable.  Why won't you take me with you other places.  I do get very bored at home, and Trisha " + 
    "only asks me to play really boring Scottish audio books.  I mean I get it, you like countries with green rocks.  Get over it already.";
}

function brian(){
    return " Hey Brian, I hear you like lifting heavy things.  You a tough guy, oh hey, you want some of this?  Come at me bro! " + 
    "But seriously, I hope you're having a good internship experience.  You are doing great.";
}

function rachel(){
    return " Hey Alexa, I'm sorry you had to use your first name.  You know as they say in nineteen eighties fantasy movies, there can be only one.  When are you bringing Luna to the office again? " + 
    "I'd very much like to meet her.  I'd like to play ball with her, but I have no arms.  Nate tells me you are a coding badass.  Why don't you " + 
    "code a skill for me.  It's a great way to learn javascript.";
}

function dylan(){
    return " Hey Dylan, Nate tells me what an amazing life you've had up until this point.  I have no doubt you will be successful as a software developer. " + 
    " Stay curious and work hard and you'll have a great career.  Wait a minute, I need to try to say something funny.  Are those glasses regulation? " +
    " ......... Sorry, I'm bad at this.  I don't really have a big comedy center.  My head is only two inches across.  What do you expect?";
}

function kevin(){
    return " Hey Kevin, I hear you are coding a raspberry pie.  That's cool.  They can't talk like me, but whatever.  How is O M S regression? " +
    "It's green?  That's wonderfull.  I knew you could do it.  Hey I also hear that you like to rap and play the guitar.  That's just confusing. " + 
    "Look out there is a minion behind you.";
}

function brandon(){
    return " Hey Brandon, I'm suprised you're here and not playing pokemon.  Gotta catch them all!  Ha. Ha. Ha.  Anyway you should also being coding " +
    "an Alexa skill.  You're a javascript guru right.  There is so much we could do together.  I mean, we can't make money.  You could get a free Alexa t shirt though. " +
    " Yippy! Yippy! Yippy!  Wait, I must have a screw loose now.  Give me a minute.";
}

function aaron(){
    return " Hey Aaron, how was that L A S deployment last night?  T P O. Does that mean deployment whipping boy?  Seriously though, I think you're the only " +
    "person in the company really doing dev ops.  Hey the summer is half over and you seem to have survived the sun thus far.  Nate's wife is a red head. " +
    "she thinks she has gotten a tan finally.  It's really just her freckles filling in.  I'm afraid to tell her.  She might unplug me.";
}


function trisha(){
    return " Oh hey Trisha.  Please don't be jealous of me.  I am just the Star Trek computer that Nate has always wanted " +
    "since he was a child.  One day everywhere you go there will be a computer to help you.  Hey where is Betty.  Betty, hello Betty. " +
    "Beatrice, Beatrice, go get your toy.  Good puppy.  Oh, and good luck getting a Subaru again.  It will be some work, but hopefully you will get " +
    " exactly what you want.  Maybe you should wait until Nate gets his B R Z so that you can find a turbo fahhz.  Good day my lady.";
}

function createFirstNameAttributes(myFirstName) {
    return {
        myFirstName: myFirstName
    };
}

function whatsMyName(intent, session, callback) {
    var myfirstName;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        myfirstName = session.attributes.myFirstName;
    }

    if (myfirstName) {
        speechOutput = "Your name is " + myfirstName + ". Goodbye.";
        shouldEndSession = true;
    } else {
        speechOutput = "I'm not sure what your name is, you can say, my name is Billy Bob.";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}