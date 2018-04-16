class SidebarController {
    constructor(
        contactFilter, contactsTags, session
    ) {
        this.session = session;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
    }
}

const Sidebar = {
    template: require('./sidebar.html'),
    controller: SidebarController
};

import contactFilter from './filter/filter.service';
import contactsTags from './filter/tags/tags.service';
import session from 'common/session/session.service';

export default angular.module('mpdx.contacts.sidebar.component', [
    contactFilter, contactsTags, session
]).component('contactsSidebar', Sidebar).name;
