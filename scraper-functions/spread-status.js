'use strict';

module.exports = function(arr, i) {
  if (arr[i].spreadClose > 0 && arr[i].spreadClose != (99 || -99)) {
    arr[i].spreadStatus = 'underdog';
  } else if (arr[i].spreadClose < 0 && arr[i].spreadClose != (99 || -99)) {
    arr[i].spreadStatus = 'favorite';
  } else {
    arr[i].spreadStatus = 'N/A';
  }
};