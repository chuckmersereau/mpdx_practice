// make jasmine exit on 1st failure
var failFast = require('jasmine-fail-fast');
jasmine.getEnv().addReporter(failFast.init());