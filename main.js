//Define endpoints
const CHAT_URL = 'https://api.myjson.com/bins/isv66'

//Define templates
const chatBox = document.getElementById('chat-messages-template');

/**
 * Initializes chat app
 */
function init() {
    fetchChatData(CHAT_URL);
}

/**
 * Fetches data from REST api
 * 
 * @param {string} url Url to fetch data
 */
async function fetchChatData(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        //Check for HTTP success code
        if (json.status / 100 == 2) {
            populateChatLog(json.data);
        } else {
            //Throw exception
            throw 'Fetch failed with status code ' + json.status 
        }
    }
    catch (err) {
        //Handle and log error.
        console.log(err);
    }
}

/**
 * Populates html after recieving data from server
 *
 * @param {string} data Data fetched
 */
function populateChatLog(data) {

    //Destructure data object.
    const { messages, conversationDate } = data;

    //Set date options for conversion
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    //Convert date from yyyy-dd-mm to a long date string 
    document.querySelector('.date').innerHTML = getDateFromString(conversationDate, dateOptions);

    // The first user to message and the only messages to appear on the right side.
    let chatInitiator = messages[0].username;

    //Loop through each message and build html
    messages.forEach((message, i) => {
        // Create template instance
        const inst = document.importNode(chatBox.content, true);

        // Add alternate class to every message that's not from the 'initiator'
        // Allows inclusion of more chatting parties down the line
        if (chatInitiator !== message.username) inst.querySelector('.chat-message').classList.add('alternate');

        //Check to see if message is 'focused'.
        if (message.focused) inst.querySelector('.chat-message').classList.add('focused');

        //Insert data into newly instantiated template
        inst.querySelector('.message').innerHTML = message.message;
        inst.querySelector('.author').innerHTML = message.username;
        
        //Set time options
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        inst.querySelector('.time').innerHTML = getTimeFromString(message.timestamp, timeOptions);
        inst.querySelector('.avatar').src = message.image;

        //Attach instantiated template to specified root
        document.getElementById('chat-messages').appendChild(inst);
    })
}

/**
 * Gets a formatted date from a string
 *
 * @param {string} dateStr String to be converted.
 * @param {Object} options List of conversions options.
 * @returns {string} Newly formatted date string.
 */
function getDateFromString(dateStr, options) {
    let dateObj = new Date(dateStr);
    return (dateObj.toLocaleDateString('en-US', options));
}

/**
 * Gets a formatted time from a string
 *
 * @param {string} dateStr String to be converted.
 * @param {Object} options List of conversions options.
 * @returns {string} Newly formatted time string.
 */
function getTimeFromString(dateStr, options) {
    var dateObj = new Date(dateStr);
    return dateObj.toLocaleTimeString('en-US', options);
}

//Entrypoint
init();