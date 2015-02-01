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
  else {
    for (i = 0; i < 9; i++) {
      $scope.board.$save({choice: ''});
    }
  }
});

// on load, checks if counter exists. If it doesn't, creates turnNumber property and sets it to 0.
// also creates p1/p2WinTotal properties and sets them to 0. Will get incremented with every win.
// if counter does exists, overwrites ($save) turnNumber to 0.
$scope.counter.$loaded(function(){
   console.log('Counter Loaded');
   if ($scope.counter.length === 0){ 
     $scope.counter.$add({turnNumber: 0});
     $scope.counter.$add({p1WinTotal: 0});
     $scope.counter.$add({p2WinTotal: 0});
     $scope.counter.$add({player: 1});
   } 
   else {
     $scope.counter[0].turnNumber = 0;
     $scope.counter.$save(0);
   }

  });

// makeChoice function is attached to ng-click directive. Defines choice as X if turnNumber is even, O if odd. 
  // Populates $scope.board with X or O in row/column specified by div with unique ID generated by $index.
  // Increments turnNumber and runs checkWin function after every click.

  $scope.makeChoice = function(idx) {
    console.log('clicked ' + idx + ' from makeChoice');
    if($scope.counter[3].player == 1) {
    $scope.board[idx].choice = "X";
    $scope.board.$save($scope.board[idx]);
    $scope.counter[0].turnNumber++;
    $scope.counter.$save(0);
    $scope.counter[3].player++;
    $scope.counter.$save(3);
    // $scope.counter[3].player.$save();
    console.log("Next move to player " + $scope.counter[3].player);
    console.log("$scope.board[idx].choice is " + $scope.board[idx].choice);
    }
    else {
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
  }
// function to check if win conditions are met, will run after every turn. When winner is chosen p1/p2 win function is called.
// function checkWin() {
//   for(i = 0; i < 3; i++)
//   // checks if horizontal rows are equal to each other and not equal to an empty string.
//   if($scope.board[i][0] == $scope.board[i][1] && $scope.board[i][2] == $scope.board[i][0] && $scope.board[i][0] !== "" && $scope.board[i][0] == "X"){
//     console.log("X win horizontal");
//     p1Wins();
//   }
//   else if ($scope.board[i][0] == $scope.board[i][1] && $scope.board[i][2] == $scope.board[i][0] && $scope.board[i][0] !== "" && $scope.board[i][0] == "O"){
//     console.log("O win horizontal");
//     p2Wins();
//   }
//   // checks if vertical columns are equal to each other and not equal to an empty string.
//   else if ($scope.board[0][i] == $scope.board[1][i] && $scope.board[2][i] == $scope.board[0][i] && $scope.board[0][i] !== "" && $scope.board[0][i] == "X") {
//     console.log("X win vertical");
//     p1Wins();
//   }
//   else if ($scope.board[0][i] == $scope.board[1][i] && $scope.board[2][i] == $scope.board[0][i] && $scope.board[0][i] !== "" && $scope.board[0][i] == "O") {
//     console.log("O win vertical");
//     p2Wins();
//   // checks diagonal. only true when i = 0
//   }
//   else if ($scope.board[0][i] == $scope.board[1][i+1] && $scope.board[2][i +2] == $scope.board[0][i] && $scope.board[0][i] !== "" && $scope.board[0][i] == "X") {
//     console.log("X win diagonal right");
//     p1Wins();
//   }
//   else if ($scope.board[0][i] == $scope.board[1][i+1] && $scope.board[2][i +2] == $scope.board[0][i] && $scope.board[0][i] !== "" && $scope.board[0][i] == "O") {
//     console.log("O win diagonal right");
//     p2Wins();
//   }
//   //checks left diagonal. only true when i = 2
//   else if ($scope.board[0][i] == $scope.board[1][i-1] && $scope.board[2][i-2] == $scope.board[0][i] && $scope.board[0][i] !== "" && $scope.board[0][i] == "X") {
//     console.log("X win diagonal left");
//     p1Wins();
//   }
//   else if ($scope.board[0][i] == $scope.board[1][i-1] && $scope.board[2][i-2] == $scope.board[0][i] && $scope.board[0][i] !== "" && $scope.board[0][i] == "O") {
//     console.log("O win diagonal left");
//     p2Wins();
//   }
//   // if turnNumber reaches 9 there's been no winner, tie condition is enforced.
//   else if ($scope.turnNumber == 9) {
//     console.log("TIE");
//   }
// }
  // creates turnNumber property, will get incremented after every turn.
  // $scope.counter = 0;

  

  // $scope.makeChoice = function(row, column) {
  //   if(($scope.board[row][column] == "") && ($scope.turnNumber >=0)) {
  //     var choice = ($scope.turnNumber % 2) == 0 ? "X" : "O";
  //     $scope.board[row][column] = choice;
  //     $scope.turnNumber++;
  //     checkWin(choice);
  //   }
  //   console.log($scope.board);
  // };

  // Win totals increment after p1/p2Wins function is called. 
  // $scope.p1WinTotal = 0;
  // $scope.p2WinTotal = 0;

  function p1Wins() {
    console.log("X Wins!");
    $scope.counter[1].p1WinTotal++;
    $scope.counter.$save(1);
  }
  function p2Wins() {
    console.log("O Wins!")
    $scope.counter[2].p2WinTotal++;
    $scope.counter.$save(2);
  }

  // function clearBoxes() {
  //   for(i = 0;)
  // }


});//end of controller


