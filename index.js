'use strict';

var theme = require('./theme');
//var theme = require('jsonresume-theme-eloquent');
//var theme = require('jsonresume-theme-paper');
//var theme = require('jsonresume-theme-class');

var resume = require('./resume.fresh.json');
process.stdout.write(theme.render(resume));
