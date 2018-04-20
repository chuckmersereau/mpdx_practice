import component from './import.component';
import csv from './csv/csv.module';
import google from './google/google.component';
import tnt from './tnt/tnt.module';

export default angular.module('mpdx.tools.import', [
    component,
    csv,
    google,
    tnt
]).name;
