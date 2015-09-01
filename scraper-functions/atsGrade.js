'use strict';

module.exports = function (arr, i) {
  if ((arr[i].teamScore + arr[i].spreadClose) > arr[i].opponentScore) {
    arr[i].atsGrade = 'W';
  } else if ((arr[i].teamScore + arr[i].spreadClose) < arr[i].opponentScore) {
    arr[i].atsGrade = 'L';
  } else {
    arr[i].atsGrade = 'P';
  }
};