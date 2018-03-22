import header from './header/header.component';
import save from './save/save.controller';
import saved from './saved/saved.component';
import service from './filters.service';

export default angular.module('mpdx.common.filters', [
    header, save, saved, service
]).name;