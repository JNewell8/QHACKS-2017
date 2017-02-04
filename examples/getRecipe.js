'use strict';

let Wit = null;
let interactive = null;

var http = require("http");
var https = require("https");
var request = require("request");

try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getRecipe({context, entities}) {
  return new Promise(function(resolve, reject) {
    var mealTime = firstEntityValue(entities, "mealTime")
    if (mealTime) {
        var api_ID = 'e041f1a3';
        var app_key = '2598fe134189c3ff6692c77e1e80a4c3';
        var content;
        request('https://api.edamam.com/search?q=chicken&app_id=' + api_ID + '&app_key=' + app_key, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            content = body;
          }
        })
        body = JSON.parse(content);
        context.recipe = body.hits[1].recipe.uri;
        delete context.missingLocation;
    } else {
      context.missingLocation = true;
      delete context.recipe;
    }
    return resolve(context);
  });
}
,
useIngredients({context, entities}) {
  return new Promise(function(resolve, reject) {
    var meal = firstEntityValue(entities, "meal")
    if (meal) {
      
      delete context.missingLocation;
    } else {
      context.missingLocation = true;
      delete context.recipe;
    }
    return resolve(context);
  });
},
};

const client = new Wit({accessToken, actions});
interactive(client);
