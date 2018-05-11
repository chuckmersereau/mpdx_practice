import component from './contacts.component';
import list from './list/list.module';
import multiple from './multiple/multiple.controller';
import newContact from './new/new.controller';
import show from './show/show.module';
import sidebar from './sidebar/sidebar.module';

export default angular.module('mpdx.contacts', [
    component,
    list,
    multiple,
    newContact,
    sidebar,
    show
]).name;
