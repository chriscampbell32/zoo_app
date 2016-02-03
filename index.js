var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo_db'
});

 connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        };
        //console.log('connected as id ' + connection.threadId);
    });

var prompt = require("prompt");
prompt.start();
prompt.message= "";

var zoo = {
  welcome : function(){
    console.log("Welcome to the Zoo and Friends App~!")
  },
  menu : function(){
    console.log("Enter (A):-----> to Add a new animal to the Zoo!" + "\r\n" +
                    "Enter (U):-----> to Update info on an new animal in the Zoo!" + "\r\n" +
                    "Enter (V):-----> to Visit the animals in the Zoo!" + "\r\n" +
                    "Enter (D):-----> to Adopt an animals from the Zoo!" + "\r\n" + "\r\n" +
                    "Enter (Q):-----> to Quit and exit the Zoo!" + "\r\n")
  },
  
  add : function(input_scope){
    var currentScope = input_scope;
    console.log("To add an animal to the zoo please fill out the following form for us!");
    prompt.get(["name", "type", "age"], function(err, result){
      var randCaretaker = Math.floor(Math.random() * 10) + 1; // Creates a random caretake_id for new animal
      var new_animal = {caretaker_id: randCaretaker, name: result.name, type: result.type, age: result.age};
      var query = connection.query("INSERT INTO animals SET ?", new_animal, function (err, result){
        if(err) {throw err}
      });
      console.log(result.name + " the " + result.type + " was successfully added to our Zoo!" + "\r\n" + "\r\n");
      currentScope.menu();
      currentScope.promptUser();
    });
  },
visit: function(){
    console.log(" Enter (I): ------> do you know the animal by it's id? We will visit that animal!");
    console.log(" Enter (N): ------> do you know the animal by it's name? We will visit that animal!");
    console.log(" Enter (A): ------> here's the count for all animals in all locations!");
    console.log(" Enter (C): ------> here's the count for all animals in this one city!");   
    console.log(" Enter (O): ------> here's the count for all the animals in all locations by the type you specified!");
    console.log(" Enter (Q): ------> Quits to the main menu!");
    currentScope.visit();
    currentScope.view(currentScope);
 