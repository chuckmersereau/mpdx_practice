class SidebarController {
    constructor(
        contactFilter, session
    ) {
        this.session = session;
        this.contactFilter = contactFilter;
    }
}

const Sidebar = {
    template: require('./sidebar.html'),
    controller: SidebarController
};

import contactFilter from './filter/filter.service';
import session from 'common/session/session.service';

export default angular.module('mpdx.contacts.sidebar.component', [
    contactFilter, session
]).component('contactsSidebar', Sidebar).name;