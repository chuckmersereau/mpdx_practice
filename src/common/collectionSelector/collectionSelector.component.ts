import { defaultTo } from 'lodash/fp';

class CollectionSelectorController {
    displayText: string;
    itemName: string;
    search: any;
    searchText: string;
    select: any;
    constructor(
        private modal: ModalService
    ) {}
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
    remove() {
        this.select({ item: null });
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
        select: '&',
        required: '<',
        allowRemove: '<'
    }
};

import modal, { ModalService } from '../modal/modal.service';
import modalController from './modal/modal.controller';

export default angular.module('mpdx.common.collectionSelector.component', [
    modal, modalController
]).component('collectionSelector', CollectionSelector).name;
