import isEmpty from 'lodash/fp/isEmpty';
import isFunction from 'lodash/fp/isFunction';
import isNil from 'lodash/fp/isNil';

class ModalController {
    constructor(
        $scope,
        itemName, collectionSearch, searchText, select
    ) {
        this.$scope = $scope;

        this.itemName = itemName;
        this.collectionSearch = collectionSearch;
        this.searchText = searchText;
        this.select = select;

        this.collection = [];
        this.loading = false;
        this.selectedItem = null;

        this.$onInit();
    }

    $onInit() {
        this.search();
    }

    search() {
        this.selectedItem = null;
        this.collection = [];
        if (isEmpty(this.searchText) || isNil(this.searchText)) {
            return Promise.reject(Error('empty searchText'));
        }
        this.loading = true;
        return this.collectionSearch(this.searchText).then((data) => {
            this.collection = data;
        }).catch(() => {
        }).then(() => {
            this.loading = false;
        });
    }

    save() {
        this.$scope.$hide();
        this.select(this.selectedItem);
        return Promise.resolve();
    }
}

export default angular.module('mpdx.common.collectionSelector.modal.controller', [])
    .controller('collectionSelectionModalController', ModalController).name;
