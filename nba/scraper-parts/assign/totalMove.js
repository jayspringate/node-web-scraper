'use strict';

module.exports = function(arr, i) {
  if (arr[i].totalClose < arr[i].totalOpen) {
    arr[i].totalMove = 'DOWN';
  } else if (arr[i].totalClose > arr[i].totalOpen) {
    arr[i].totalMove = 'UP';
  } else {
    arr[i].totalMove = 'NONE';
  }
};