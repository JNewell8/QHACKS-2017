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
      
    var type = firstEntityValue(context, "type")
    var query = firstEntityValue(context, "query")
    var flavor = firstEntityValue(context, "flavor")
    var includeIngredients = firstEntityValue(context, "ingredients")
    var cuisine = firstEntityValue(context, "cuisine")
    var intolerances = firstEntityValue(entities, "intolerances")
    
    var InstructionsRequired = true;
    var number = 1;
    
    var api_ID = 'e041f1a3';
    var app_key = '2598fe134189c3ff6692c77e1e80a4c3';
    var string = "Test: ";
    //Intolerances
        if (intolerances){
            intolerances = ''
            for (var u of entities.intolerances){
                intolerances.log(u.value);
                string += u.value + ',';
            }
        }
    //Cuisine
    if (cuisine){
        cuisine = ''
        for (var u of context.cuisine){
            console.log(u.value);
            string += u.value + ',';
        }
    }
    //includeIngredients
    if(includeIngredients){
        includeIngredients = ''
        for (var u of context.ingredients){
            console.log(u.value);
            string += u.value + ',';
        }
    }
    //query
    if(query){
        query = ''
        for (var u of context.query){
            console.log(u.value);
            string += u.value + ',';
        }
        if(flavor){
           for (var u of context.flavor){
                console.log(u.value);
                string += u.value + ',';
            } 
        }
    }
    //type
    if(type){
        type = ''
        for (var u of context.type){
            console.log(u.value);
            string += u.value + ',';
        }
    }
    
    context.recipe = string;
    delete context.type;
    delete context.query;
    delete context.flavor;
    delete context.includeIngredients;
    delete context.cuisine;
    return resolve(context);
  });
},
helper({context, entities}) {
  return new Promise(function(resolve, reject) {
      
    var type = firstEntityValue(entities, "type")
    var query = firstEntityValue(entities, "query")
    var flavor = firstEntityValue(entities, "flavor")
    var includeIngredients = firstEntityValue(entities, "ingredients")
    var cuisine = firstEntityValue(entities, "cuisine")
    
    if(type){
        context.type = entities.type;
    }
    if(query){
        context.query = entities.query;
    }
    if(flavor){
        context.flavor = entities.flavor;
    }
    if(includeIngredients){
        context.includeIngredients = entities.includeIngredients;
    }
    if(cuisine){
        context.cuisine = entities.cuisine;
    }
    return resolve(context);
  });
},
};

const client = new Wit({accessToken, actions});
interactive(client);
