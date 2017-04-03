import component from './contacts.component';
import filter from './filter/index.module';
import reconcileIndividuals from './reconcileIndividuals/index.module';
import reconcilePartners from './reconcilePartners/index.module';
import list from './list/index.module';
import multiple from './multiple/multiple.controller';
import newContact from './new/new.controller';
import search from './search/search.component';
import service from './contacts.service';
import show from './show/index.module';

export default angular.module('mpdx.contacts', [
    component,
    filter,
    reconcileIndividuals,
    reconcilePartners,
    list,
    multiple,
    newContact,
    search,
    service,
    show
]).name;
