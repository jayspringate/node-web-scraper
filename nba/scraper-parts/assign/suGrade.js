'use strict';

module.exports = function(arr, i) {
  if (arr[i].teamScore > arr[i].opponentScore) {
    arr[i].suGrade = 'W';
  } else {
    arr[i].suGrade = 'L';
  }
};