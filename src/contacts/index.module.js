import component from './contacts.component';
import list from './list/index.module';
import multiple from './multiple/multiple.controller';
import newContact from './new/new.controller';
import service from './contacts.service';
import sidebar from './sidebar/index.module';
import show from './show/index.module';

export default angular.module('mpdx.contacts', [
    component,
    list,
    multiple,
    newContact,
    service,
    sidebar,
    show
]).name;
