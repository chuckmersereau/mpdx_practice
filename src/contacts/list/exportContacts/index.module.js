import controller from './exportContacts.controller';
import service from './export.service';

export default angular.module('mpdx.contacts.list.exportContacts', [
    controller,
    service
]).name;