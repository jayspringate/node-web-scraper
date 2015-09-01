'use strict';

module.exports = function (arr, i) {
  if (arr[i].spreadClose < arr[i].spreadOpen) {
    arr[i].spreadMove = 'FOR';
  } else if (arr[i].spreadClose > arr[i].spreadOpen) {
    arr[i].spreadMove = 'AGAINST';
  } else {
    arr[i].spreadMove = 'NONE';
  }
};