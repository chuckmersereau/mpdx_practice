import component from './import.component';
import csv from './csv/index.module';
import google from './google/google.component';
import tnt from './tnt/index.module';

export default angular.module('mpdx.tools.import', [
    component,
    csv,
    google,
    tnt
]).name;
