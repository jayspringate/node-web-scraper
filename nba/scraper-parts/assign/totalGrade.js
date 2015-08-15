'use strict';

module.exports = function (arr, i) {
  if ((arr[i].teamScore + arr[i].opponentScore) > arr[i].totalClose) {
    arr[i].totalGrade = 'O';
  } else if ((arr[i].teamScore + arr[i].opponentScore) < arr[i].totalClose) {
    arr[i].totalGrade = 'U';
  } else {
    arr[i].totalGrade = 'P';
  }
};