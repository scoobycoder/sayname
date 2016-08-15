var selfDestructCode = function selfDestructCode(intent, session, callback) {
    var mySequenceCode;
    var repromptText = "";
    var promptTest = "Enter self destruct code";  
    var destructCode = intent.slots.destructCode;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    console.log ("selfDestructCode -> Inside selfDestructCode: " + JSON.stringify(destructCode));        

    if (session.attributes) {
        mySequenceCode = session.attributes.mySequenceCode;
        console.log ("selfDestructCode -> Session Attributes mySequenceCode: " + mySequenceCode);        
    }

    if (mySequenceCode == "1") {

        console.log ("selfDestructCode -> Inside mySequenceCode Check: " + mySequenceCode); 

        finalCode = destructCode.value

        if (finalCode == "11 a" || finalCode == "code 11 a" || finalCode == "118") {
            speechOutput = "Voice and code one one A verified and correct. Sequence one complete. ";
            speechOutput += "Self destruct enabled. 10 minute silent countdown.  There will be no further warnings.";
            shouldEndSession = true;
        } else {
            console.log ("selfDestructCode -> Destruct Code Incorrect, destructCode: " + destructCode); 
            speechOutput = "Self destruct code incorrect."
        }

        repromptText = "Enter self destruct code";        
    }

    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

module.exports = selfDestructCode;