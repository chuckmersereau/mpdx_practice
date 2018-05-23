import { isEmpty, isNil } from 'lodash/fp';

class ModalController {
    collection: any;
    loading: boolean;
    selectedItem: any;
    constructor(
        private $q: ng.IQService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private itemName: string,
        private collectionSearch: any,
        private searchText: string,
        private select: any
    ) {
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
            return this.$q.reject(Error('empty searchText'));
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
        return this.$q.resolve();
    }
}

export default angular.module('mpdx.common.collectionSelector.modal.controller', [])
    .controller('collectionSelectionModalController', ModalController).name;
