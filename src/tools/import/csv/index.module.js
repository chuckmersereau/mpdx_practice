import component from './csv.component';
import service from './csv.service';
import headers from './headers/headers.component';
import preview from './preview/preview.component';
import upload from './upload/upload.component';
import values from './values/values.component';

export default angular.module('mpdx.tools.import.csv', [
    component,
    service,
    headers,
    preview,
    upload,
    values
]).name;
