'use strict';

module.exports = function(arr, i) {
  if (arr[i].totalClose === 99 || arr[i].totalOpen === 99) { //added for cfb, does not affect nba
    arr[i].totalMove = 'N/A';
  } else {
    if (arr[i].totalClose < arr[i].totalOpen) {
      arr[i].totalMove = 'DOWN';
    } else if (arr[i].totalClose > arr[i].totalOpen) {
      arr[i].totalMove = 'UP';
    } else {
      arr[i].totalMove = 'NONE';
    }
  }
};