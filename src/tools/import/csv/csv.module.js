import component from './csv.component';
import headers from './headers/headers.component';
import preview from './preview/preview.component';
import upload from './upload/upload.component';
import values from './values/values.component';

export default angular.module('mpdx.tools.import.csv', [
    component,
    headers,
    preview,
    upload,
    values
]).name;
