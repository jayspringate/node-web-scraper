'use strict';

module.exports = function(arr, i) {
  if (arr[i].spreadClose === (99 || -99) || arr[i].spreadOpen === (99 || -99)) { //added for cfb, does not affect nba
    arr[i].spreadMove = 'N/A';
  } else {
    if (arr[i].spreadClose < arr[i].spreadOpen) {
      arr[i].spreadMove = 'FOR';
    } else if (arr[i].spreadClose > arr[i].spreadOpen) {
      arr[i].spreadMove = 'AGAINST';
    } else {
      arr[i].spreadMove = 'NONE';
    }
  }
};