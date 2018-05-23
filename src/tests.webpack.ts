// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

const testsContext = require.context('.', true, /.test$/);
testsContext.keys().forEach(testsContext);
