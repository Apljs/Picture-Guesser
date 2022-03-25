// Indicates whether the model has been loaded.
let isModelLoaded = false;

// A global variable that stores the model.
let net;

// Hides the app before the model is loaded.
$("#app").hide();

async function app() {
  console.log('Loading mobilenet..');

  // Loads the model.
  mobilenet.load().then(function(model) {
    console.log('Successfully loaded model');
    isModelLoaded = true;
    
    // Selects the div with the ID "status", add the text "Model is 
    // ready" and add the class "ready" to it.
    $("#status").text("Model is ready").addClass("ready");
    // Shows the app by using ID "app". 
    $("#app").show();
    // Stores the newly loaded model into the global `net`.
    net = model;
  });
}

// Capitalizes first character of every word in an array's element.
// Works only for terms that include a dash.
function dashCap(array, arrayIdx, charIdx, restIdx){
  return (array[arrayIdx].charAt(charIdx).toUpperCase() 
  + array[arrayIdx].slice(restIdx, array[arrayIdx].indexOf('-')) + '-'
  + array[arrayIdx].charAt(array[arrayIdx].indexOf('-') + 1).toUpperCase() 
  + array[arrayIdx].slice(array[arrayIdx].indexOf('-') + 2));
}

// Capitalizes first character of every word in an array's element.
// Works only for terms that include a space.
function spaceCap(array, arrayIdx, charIdx, restIdx){
  return (array[arrayIdx].charAt(charIdx).toUpperCase() 
  + array[arrayIdx].slice(restIdx, array[arrayIdx].indexOf(' ')) + ' '
  + array[arrayIdx].charAt(array[arrayIdx].indexOf(' ') + 1).toUpperCase() 
  + array[arrayIdx].slice(array[arrayIdx].indexOf(' ') + 2));
}

// Capitalizes first character in an array's element.
// Works only for whole terms.
function cap(array, arrayIdx, charIdx, restIdx){
  return (array[arrayIdx].charAt(charIdx).toUpperCase() 
  + array[arrayIdx].slice(restIdx));
}

// Changes the current image to a custom one.
// The image will then be processed by tensorflow.
function imgChange(){
    $("#img").attr("src", $("#box").val());
}

// Clears out the list of current results.
function clearResults(){
    $("#result").html("");
}

/// Predicts the image using the global variable `net` that should be 
/// loaded above. If there are any predictions, they will be displayed in 
/// the cards with their names and their probability.
function predict() {
  if (!isModelLoaded || !net) {
    console.error("Modelnet is not loaded yet!");
    return;
  }
  // Selects the image.
  const IMG_EL = document.getElementById('img');
  net.classify(IMG_EL)
    .then(function(predictions) {
    console.log(predictions);
    // Selects the div element with the ID of "result" to append the results.
    const RESULT_ELEMENT = $('#result');

    // Prevents any div elements from being dumpted into the <html> body.
    clearResults();

    // Creates currentID variable to assign ascending ids to new elements.
    var currentID = 0;

    // Cycles through all tensorflow predictions, logs them,
    // then modifies/formats them to be then posted.
    for (var i = 0; i < predictions.length; i++) {
      console.log(predictions[i]);
      const PREDICTION = predictions[i];

      // Split the name into an array.
      var splitName = PREDICTION.className.split(', ');
      var finalName;

      // Capitalizes the first character of each word and
      // adds a slash to distinguish similar terms.
      for(var j = 0; j < splitName.length; j++) {
        if (splitName[j].includes(' ')) {
          // Store the formatted name back in array
          splitName[j] = spaceCap(splitName, j, 0, 1);
        }
        else if (splitName[j].includes('-')) {
          splitName[j] = dashCap(splitName, j, 0, 1);
        }
        else {
          splitName[j] = cap(splitName, j, 0, 1);
        }
      }
      // Appends the elements to the final output with proper formatting.
      finalName = splitName[0];
      for(var k = 1; k < splitName.length; k++)
        finalName += ('/' + splitName[k]);

      // Gets the class name of the prediction.
      const CLASS_NAME = finalName;
      
      // Gets the probability of the prediction.
      const PROBABILITY = 'Probability: ' 
      + (PREDICTION.probability * 100).toFixed(2) + '%';
      
      // Creates a new element h5, changes the text inside it, and adds 
      // a class called "card-title".
      currentID++;
      $("#app").append("<h5 id=" + currentID + "></h5>");
      var id = '#' + currentID;
      const NAME_EL = $(id).text(CLASS_NAME).addClass('card-title');
      
      // Creates a new element p, changes the text inside it, and adds 
      // a class called "card-title".
      currentID++;
      $("#app").append("<p id=" + (currentID) + "></p>");
      var id1 = '#' + (currentID);
      const PROBABILITY_EL = $(id1).text(PROBABILITY).addClass('card-title');
      
      // Creates a new element div and adds class 'card' to it.
      currentID++;
      $("#app").append("<div id=" + (currentID) + "></div>");
      var id2 = '#' + (currentID);
      const CARD = $(id2).addClass('card');

      // Creates a new element div and adds class 'card-body' to it.
      // Then appends the NAME_EL const and PROBABILITY_EL const above as its children.
      currentID++;
      $("#app").append("<div id=" + (currentID) + "></div>");
      var id3 = '#' + (currentID);
      const CARD_BODY = $(id3).addClass('card-body').append(NAME_EL).append(PROBABILITY_EL);
      
      // Appends the CARD_BODY element to the CARD element.
      CARD.append(CARD_BODY);
      
      // Appends the CARD element to RESULT_ELEMENT so it can be 
      // displayed.
      RESULT_ELEMENT.append(CARD);
    }
  });
}

app();