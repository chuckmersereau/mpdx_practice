import defaultTo from 'lodash/fp/defaultTo';

class CollectionSelectorController {
    returnFn;
    constructor(
        modal
    ) {
        this.modal = modal;
    }
    openModal() {
        this.modal.open({
            template: require('./modal/modal.html'),
            controller: 'collectionSelectionModalController',
            locals: {
                collectionSearch: (text) => this.collectionSearch(text),
                itemName: this.itemName,
                searchText: this.collectionSearchText(),
                select: (item) => this.collectionSelect(item)
            }
        });
    }
    collectionSearch(text) {
        return this.search({ text: text });
    }
    collectionSelect(item) {
        return this.select({ item: item });
    }
    collectionSearchText() {
        return defaultTo(this.displayText, this.searchText) || '';
    }
}

const CollectionSelector = {
    template: require('./collectionSelector.html'),
    controller: CollectionSelectorController,
    bindings: {
        displayText: '<',
        itemName: '@',
        search: '&',
        searchText: '<',
        select: '&'
    }
};

import modal from 'common/modal/modal.service';

export default angular.module('mpdx.common.collectionSelector.component', [modal])
    .component('collectionSelector', CollectionSelector).name;
