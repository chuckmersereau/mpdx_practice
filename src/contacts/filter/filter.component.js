class FilterController {
    contactsService;
    filterService;
    tagsService;

    constructor(filterService, tagsService, contactsService, modal, gettextCatalog) {
        this.modal = modal;
        this.contactsService = contactsService;
        this.filterService = filterService;
        this.gettextCatalog = gettextCatalog;
        this.tagsService = tagsService;
    }
    resetFiltersAndTags() {
        if (this.tagsService.isResettable()) {
            this.tagsService.reset();
        }
        if (this.filterService.resettable) {
            this.filterService.reset();
        }
    }
    showReset() {
        return this.tagsService.isResettable() || this.filterService.resettable;
    }
    openMapContactsModal() {
        this.modal.open({
            contentTemplate: '/common/map_contacts.html',
            controller: 'mapContactsController',
            controllerAs: 'vm',
            locals: {
                contacts: this.contactsService.getSelectedContacts()
            }
        });
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        var allOptions = _.map(filter.options, option => option.id);
        var selectedOptions = this.filterService.params[filter.name];

        var allOption = '';
        if (filter.name === 'status') {
            allOption = 'active';
        }

        // If all options are selected other than 'All', then the inverse is 'All'
        if (_.isEqual(_.difference(allOptions, selectedOptions), [allOption])) {
            this.filterService.params[filter.name] = [''];
            return;
        }

        selectedOptions.push(allOption); // Exclude the 'All' option when inverting
        this.filterService.params[filter.name] = _.difference(allOptions, selectedOptions);
    }
}

const Filter = {
    controller: FilterController,
    template: require('./filter.html')
};

export default angular.module('mpdx.contacts.filter.component', [])
    .component('contactsFilter', Filter).name;