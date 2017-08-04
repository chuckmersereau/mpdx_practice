import filter from './locale.filter';
import service from './locale.service';

export default angular.module('mpdx.common.locale', [
    filter, service
]).name;