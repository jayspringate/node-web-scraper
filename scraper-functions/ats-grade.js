'use strict';

module.exports = function(arr, i) {
  if (arr[i].spreadClose === 99 || arr[i].spreadClose === -99) { //added for cfb, does not affect nba
    arr[i].atsGrade = 'N/A';
  } else {
    if ((arr[i].teamScore + arr[i].spreadClose) > arr[i].opponentScore) {
      arr[i].atsGrade = 'W';
    } else if ((arr[i].teamScore + arr[i].spreadClose) < arr[i].opponentScore) {
      arr[i].atsGrade = 'L';
    } else {
      arr[i].atsGrade = 'P';
    }
  }
};