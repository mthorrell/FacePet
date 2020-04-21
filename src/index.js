import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

function addKey(e, i) {
  e.key = i;
  //e.src = e.src; // + "?" + new Date().getTime();
  e.emb = null;
  e.dist = NaN;
  return e;
}

function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - size,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

var rawzip = require("./data/petfinder_out_zip.json");
rawzip = rawzip.map((e, i) => addKey(e, i));
//var idx = tf.randomUniform([50]).mul(rawzip.length).floor().arraySync();
var rawdata = getRandomSubarray(rawzip, 20);

//var rawdata = require("./data/petfinder_out.json");
//rawdata = rawdata.map((e, i) => addKey(e, i));

ReactDOM.render(
  <React.StrictMode>
    <App pdata={rawdata} zipdata={rawzip} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
