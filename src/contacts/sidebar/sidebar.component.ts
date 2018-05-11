import contactFilter, { ContactFilterService } from './filter/filter.service';
import contactsTags, { ContactsTagsService } from './filter/tags/tags.service';
import session, { SessionService } from '../../common/session/session.service';

class SidebarController {
    constructor(
        private contactFilter: ContactFilterService,
        private contactsTags: ContactsTagsService,
        private session: SessionService
    ) {}
}

const Sidebar = {
    template: require('./sidebar.html'),
    controller: SidebarController
};

export default angular.module('mpdx.contacts.sidebar.component', [
    contactFilter, contactsTags, session
]).component('contactsSidebar', Sidebar).name;
