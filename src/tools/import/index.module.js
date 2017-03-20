import csv from './csv/csv.component';
import google from './google/google.component';
import service from './import.service';
import tnt from './tnt/tnt.component';

export default angular.module('mpdx.preferences.import', [
    csv,
    google,
    service,
    tnt
]).name;