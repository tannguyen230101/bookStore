"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _environment = require("./config/environment.js");
var app = (0, _express["default"])();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(_environment.env.APP_PORT, _environment.env.APP_HOST, function () {
  console.log("Hello ".concat(_environment.env.AUTHOR, " server http://").concat(_environment.env.APP_HOST, ":").concat(_environment.env.APP_PORT, "/"));
});