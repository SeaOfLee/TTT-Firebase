var app = angular.module('ticTacApp', ['firebase']);


app.controller('ticTacCtrl', function($scope, $firebase){

// creates a reference to firebase data. 
var ref = new Firebase("https://leettt.firebaseio.com/board");
var sync = $firebase(ref);
// want to sync board array with firebase
$scope.board = sync.$asArray();

var counterRef = new Firebase("https://leettt.firebaseio.com/counter");
var counterSync = $firebase(counterRef);
$scope.counter = counterSync.$asArray();

// To keep track of score in Firebase
$scope.board.$loaded(function () {
  // if board object doesn't exist, creates "board" object in Firebase with "choice" property, populated with an empty string.
  if($scope.board.length === 0) {
    for (i = 0; i < 9; i++) {
      $scope.board.$add({choice: ''});
    }
  }
  // if board object does exist on load, loops through each index [i] and replaces choice property with empty string.
  else {
    for (i = 0; i < 9; i++) {
      $scope.board[i].choice = "";
      $scope.board.$save(i);
    }
  }
});

// on load, checks if counter exists. If it doesn't, creates turnNumber property and sets it to 0.
// also creates p1/p2WinTotal properties and sets them to 0. Will get incremented with every win.
// Creates p1/p2Won properties and sets them to false. These are used to trigger ng-show/hide win condition messages.
// if counter does exist, overwrites ($save) turnNumber to 0 and sets player to 1.
$scope.counter.$loaded(function(){
   console.log('Counter Loaded');
   if ($scope.counter.length === 0){ 
     $scope.counter.$add({turnNumber: 0});
     $scope.counter.$add({p1WinTotal: 0});
     $scope.counter.$add({p2WinTotal: 0});
     $scope.counter.$add({player: 1});
     $scope.counter.$add({p1Won: false});
     $scope.counter.$add({p2Won: false});
     $scope.counter.$add({tie: false});
     $scope.counter.$add({p1: false});
     $scope.counter.$add({p2: false});

   } 
   else {
     $scope.counter[0].turnNumber = 0;
     $scope.counter.$save(0);
     $scope.counter[1].p1WinTotal = 0;
     $scope.counter.$save(1);
     $scope.counter[2].p2WinTotal = 0;
     $scope.counter.$save(2);
     $scope.counter[3].player = 1;
     $scope.counter.$save(3);
     $scope.counter[4].p1Won = false;
     $scope.counter.$save(4);
     $scope.counter[5].p2Won = false;
     $scope.counter.$save(5);
     $scope.counter[6].tie = false;
     $scope.counter.$save(6);
     $scope.counter[7].p1 = false;
     $scope.counter.$save(7);
     $scope.counter[8].p2 = false;
     $scope.counter.$save(8);
   }

  });

// makeChoice function is attached to ng-click directive. Defines choice as X if turnNumber is even, O if odd. 
  // Populates $scope.board with X or O in row/column specified by div with unique ID generated by $index.
  // Increments turnNumber and runs checkWin function after every click.

  // first to click is set in local memory as p1. turnNumber gets incremented.
  $scope.makeChoice = function(idx) {
    if(($scope.counter[0].turnNumber == 0) && ($scope.counter[7].p1 == false)) {
      $scope.counter[7].p1 = true;
      console.log("P1 is set");
    }
  // turnNumber is incremented, p1 is still false in 2nd browser's memory. When they click p2 is set.
    else if (($scope.counter[0].turnNumber == 1) && ($scope.counter[7].p1 == false)) {
      $scope.counter[8].p2 = true;
      console.log("P2 is set");
    }
    // Marks X if it's player 1's turn, box is not already filled, & p1 value is true.
    console.log('clicked ' + idx + ' from makeChoice');
    if(($scope.counter[3].player == 1) && ($scope.board[idx].choice !== "X") && ($scope.board[idx].choice !== "O") && ($scope.counter[7].p1 === true) && ($scope.counter[0].turnNumber >= 0)) {
    $scope.board[idx].choice = "X";
    $scope.board.$save($scope.board[idx]);
    $scope.counter[0].turnNumber++;
    $scope.counter.$save(0);
    $scope.counter[3].player++;
    $scope.counter.$save(3);
    console.log("Next move to player " + $scope.counter[3].player);
    console.log("$scope.board[idx].choice is " + $scope.board[idx].choice);
    }
    // marks O if it's player 2's turn, box is not already filled & p2 value is true.
    else if (($scope.counter[3].player == 2) && ($scope.board[idx].choice !== "X") && ($scope.board[idx].choice !== "O") && ($scope.counter[8].p2 === true) && ($scope.counter[0].turnNumber > 0)){
    $scope.board[idx].choice = "O";
    $scope.board.$save($scope.board[idx]);
    $scope.counter[0].turnNumber++;
    $scope.counter.$save(0);
    $scope.counter[3].player--;
    $scope.counter.$save(3);
    console.log("Next move to player " + $scope.counter[3].player);
    console.log("$scope.board[idx].choice is " + $scope.board[idx].choice);
    }
    checkWin();
  };

  function checkWin() {
    // checks for horizontal wins
    if (($scope.board[0].choice === "X") && ($scope.board[1].choice === "X") && ($scope.board[2].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[0].choice === "O") && ($scope.board[1].choice === "O") && ($scope.board[2].choice === "O")) {
      p2Wins();
    }
    if (($scope.board[3].choice === "X") && ($scope.board[4].choice === "X") && ($scope.board[5].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[3].choice === "O") && ($scope.board[4].choice === "O") && ($scope.board[5].choice === "O")) {
      p2Wins();
    }
    if (($scope.board[6].choice === "X") && ($scope.board[7].choice === "X") && ($scope.board[8].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[6].choice === "O") && ($scope.board[7].choice === "O") && ($scope.board[8].choice === "O")) {
      p2Wins();
    }
    // checks for vertical wins
    if (($scope.board[0].choice === "X") && ($scope.board[3].choice === "X") && ($scope.board[6].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[0].choice === "O") && ($scope.board[3].choice === "O") && ($scope.board[6].choice === "O")) {
      p2Wins();
    }
    if (($scope.board[1].choice === "X") && ($scope.board[4].choice === "X") && ($scope.board[7].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[1].choice === "O") && ($scope.board[4].choice === "O") && ($scope.board[7].choice === "O")) {
      p2Wins();
    }
    if (($scope.board[2].choice === "X") && ($scope.board[5].choice === "X") && ($scope.board[8].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[2].choice === "O") && ($scope.board[5].choice === "O") && ($scope.board[8].choice === "O")) {
      p2Wins();
    }
    // checks for diagonal wins
    if (($scope.board[0].choice === "X") && ($scope.board[4].choice === "X") && ($scope.board[8].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[0].choice === "O") && ($scope.board[4].choice === "O") && ($scope.board[8].choice === "O")) {
      p2Wins();
    }
    if (($scope.board[2].choice === "X") && ($scope.board[4].choice === "X") && ($scope.board[6].choice === "X")) {
      p1Wins();
    }
    if (($scope.board[2].choice === "O") && ($scope.board[4].choice === "O") && ($scope.board[6].choice === "O")) {
      p2Wins();
    }
    if (($scope.counter[0].turnNumber == 9) && (($scope.counter[4].p1Won === false) && ($scope.counter[5].p2Won === false))) {
      tie();
    }
  }

  // functions run when winner is chosen. Increments p1/p2WinTotal and saves value to firebase. 
  // Changes p1/p2Won property values to true, which trigger ng-show/hide events.
  function p1Wins() {
    console.log("X Wins!");
    $scope.counter[1].p1WinTotal++;
    $scope.counter.$save(1);
    $scope.counter[4].p1Won = true;
    $scope.counter.$save(4);
  }
  function p2Wins() {
    console.log("O Wins!");
    $scope.counter[2].p2WinTotal++;
    $scope.counter.$save(2);
    $scope.counter[5].p2Won = true;
    $scope.counter.$save(5);
  }

  function tie() {
    console.log("There was a tie");
    $scope.counter[6].tie = true;
    $scope.counter.$save(6);
  }

  // loops through board object in firebase and replaces choice properties with empty string.
  $scope.playAgain = function() {
    console.log("clicked playAgain");
    for (i = 0; i < 9; i++) {
      $scope.board[i].choice = "";
      $scope.board.$save(i);
    }
    // resets turnNumber, starting player & p1/p2Won, tie values in Firebase. 
    $scope.counter[0].turnNumber = 0;
     $scope.counter.$save(0);
     $scope.counter[3].player = 1;
     $scope.counter.$save(3);
     $scope.counter[4].p1Won = false;
     $scope.counter.$save(4);
     $scope.counter[5].p2Won = false;
     $scope.counter.$save(5);
     $scope.counter[6].tie = false;
     $scope.counter.$save(6);
     $scope.counter[7].p1 = false;
     $scope.counter.$save(7);
     $scope.counter[8].p2 = false;
     $scope.counter.$save(8);
  };

  $scope.reset = function(){
        location.reload();
    };

});//end of controller


