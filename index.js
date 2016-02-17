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
      var randCaretaker = Math.floor(Math.random() * 10) + 1; 
      var new_animal = {caretaker_id: randCaretaker, name: result.name, type: result.type, age: result.age};
      var query = connection.query("INSERT INTO animals SET ?", new_animal, function (err, result){
        if(err) {throw err}
      });
      console.log(query.sql);
      currentScope.menu();
      currentScope.promptUser();
    })
  },
visit: function(){
    console.log(" Enter (I): ------> do you know the animal by it's id? We will visit that animal!");
    console.log(" Enter (N): ------> do you know the animal by it's name? We will visit that animal!");
    console.log(" Enter (A): ------> here's the count for all animals in all locations!");
    console.log(" Enter (C): ------> here's the count for all animals in this one city!");   
    console.log(" Enter (O): ------> here's the count for all the animals in all locations by the type you specified!");
    console.log(" Enter (Q): ------> Quits to the main menu!");
    // currentScope.visit();
    // currentScope.view(currentScope);
    view: function(input_scope) {
    var currentScope = input_scope;
    console.log("What would you like to visit?");
    prompt.get(['->', 'visit'], function(err, result) {
      if(result.visit == "Q") {
        currentScope.menu();
      }
      else if(result.visit == "O") {
        currentScope.type(input_scope);
      }
      else if(result.type == "I") {
        currentScope.type(input_scope);
      }
      else if(result.animId == "N") {
        currentScope.name(input_scope);
      }
      else if(result.name == "A") {
        currentScope.all(input_scope);
      }
      else if(result.all == "C") {
        currentScope.care(input_scope);
      }
      else {
        console.log("Sorry, not sure what you meant. What would you like to do?");
        currentScope.visit();
        currentScope.view(currentScope);
      }
    }) 
},
type: function(input_scope){
    var currentScope = input_scope;
    console.log("Enter animal type to find how many animals we have of that type.");
    prompt.get(['->', 'animal_type'], function(err, result) {
      connection.query('SELECT COUNT(*) AS total FROM `animals` WHERE `type` = ?', [result.animal_type], function(err, results, fields) {
        if (err) throw err;
       
        console.log('Total animals of that type: ' + results[0].total);
      });
      currentScope.menu();
      currentScope.promptUser();
    }) // end prompt.get
 },
  care : function(input_scope){
    var currentScope = input_scope;
    console.log("Enter city name NY/SF");
      prompt.get(["city_name"], function(err, result) {
        connection.query("SELECT COUNT(*) AS total FROM animals, caretakers WHERE animals.caretaker_id = caretakers.id AND caretakers.city = ?", [result.city_name], function(err, results, fields) {
        if (err) throw err;
        console.log("Total animals in " +result.city_name+":" + results[0].total);
      });
      currentScope.visit();
      currentScope.view(currentScope);  
    });
  },

  animId : function(input_scope){
    var currentScope = input_scope;
    console.log("Enter ID of the animal you want to visit");
    prompt.get("animal_id", function(err, result){
      connection.query("SELECT * FROM animals WHERE id = ?", [result.animal_id], function(err, results, fields) {
        if (err) throw err;
        else {
          console.log("\r\n" +"Animal ID: " + results[0].id  + "\r\n" +
                      "Caretaker ID: " + results[0].caretaker_id  + "\r\n" +
                      "Name: " + results[0].name  + "\r\n" +
                      "Animal Type: " + results[0].type  + "\r\n" +
                      "Age: " + results[0].age + "\r\n" + "\r\n");
        }
      });
      currentScope.visit();
      currentScope.view(currentScope);  
    });
  },

  name : function(input_scope){
    var currentScope = input_scope;
    console.log("Enter name of the animal you want to visit");
    prompt.get("animal_name", function(err, result){
      connection.query("SELECT * FROM animals WHERE name = ?", result.animal_name, function(err, results, fields){if (err) throw err;
        else {
          console.log("\r\n" +"Animal Type: " + results[0].type + "\r\n" +
          "Animal ID: " + results[0].id + "\r\n" +
          "Caretaker ID: " + results[0].caretaker_id + "\r\n" +
          "Name: " + results[0].name + "\r\n" +
          "Age: " + results[0].age + "\r\n" + "\r\n");
        }
      });
      currentScope.visit();
      currentScope.view(currentScope);  
    });
  },

  all : function(input_scope){
    var currentScope = input_scope;
    connection.query("SELECT COUNT(DISTINCT id) FROM animals", function(err, results, fields){
      if (err) throw err;
      console.log("There are "+results[0]["COUNT(DISTINCT id)"]+" animals at the zoo!");
    }); 
    currentScope.menu();
    currentScope.promptUser();
  },

  update : function(input_scope){
    var currentScope = input_scope;
    prompt.get(["animal_id","new_name","new_age", "new_type","new_caretaker_id"], function(err, result){
      var update_animal = {name: result.new_name, age: result.new_age, type: result.new_type, caretaker_id: result.new_caretaker_id};
      var query = connection.query("UPDATE animals SET ? WHERE id=?", [update_animal, result.animal_id], function(err, results, fields){
        if(err) throw err;
        console.log("\r\n"+ "You've updated Animal: "+result.animal_id+" with the following information: "+ "\r\n" +
                    "Animal Name: " + result.new_name + "\r\n"+
                    "Animal Age: " + result.new_age + "\r\n"+
                    "Animal Type: " + result.new_type + "\r\n"+
                    "Caretaker Id " + result.new_caretaker_id);
      });
      currentScope.menu();
      currentScope.promptUser();
    });
  },

  adopt : function(input_scope){
    var currentScope = input_scope;
    prompt.get(["animal_id"], function(err, result){
      connection.query("DELETE FROM animals WHERE id=?", result.animal_id ,function(err,results,fields){
        if (err) throw err; 
        console.log("Congratulations! Your adoption has been approved. Please take good care of our friend!");
      });
      currentScope.visit();
      currentScope.view(currentScope); 
    });
  },

  promptUser : function(){
    var self = this;
    prompt.get("input", function(err, result){
      if (result.input === "Q"){
        self.exit();
      }else if (result.input ==="A"){
        self.add(self);
      }else if(result.input === "V"){
        self.visit();
        self.view(self);
      }else if(result.input === "D"){
        self.adopt(self);
      }else if(result.input === "U"){
        self.update(self);
      }else{
        console.log("Sorry I didn\'t get that, come again?");
      }
    })
  },

  exit : function(){
    console.log("Thank you for visiting us, goodbye~!");
    process.exit();
  },

  open : function(){
    this.welcome();
    this.menu();
    this.promptUser();
  }

} 

zoo.open();

