'use strict';

var theme = require('jsonresume-theme-kendall');
//var theme = require('jsonresume-theme-eloquent');
//var theme = require('jsonresume-theme-paper');
//var theme = require('jsonresume-theme-class');

var resume = require('./resume.json');
process.stdout.write(theme.render(resume));
