import 'angular-block-ui';
import 'angular-gettext';

class ModalController {
    blockUI: IBlockUIService;
    cancelText: string;
    delete: any;
    hideFooter: boolean;
    save: any;
    saving: boolean;
    saveText: string;
    size: string;
    valid: boolean;
    constructor(
        private $element: ng.IRootElementService,
        private $attrs: ng.IAttributes,
        private $q: ng.IQService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $timeout: ng.ITimeoutService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog
    ) {
        this.blockUI = blockUI.instances.get('modalBlockUI_' + this.$scope.$id);
    }
    $onInit() {
        this.hideFooter = this.hideFooter || false;
        this.size = this.size || 'md';
        this.valid = this.valid || true;
        this.saving = false;

        this.cancelText = this.cancelText || this.gettextCatalog.getString('Cancel');
        this.saveText = this.saveText || this.gettextCatalog.getString('Save');
    }
    $postLink() {
        this.$element.addClass('modal');
        this.$element.attr('tabindex', '-1');
        this.$element.attr('role', 'dialog');
    }
    saveAndBlock() {
        this.saving = true;
        this.blockUI.start();
        let deferred = this.$q.defer();
        // $timeout to allow for digest cycle and js input events
        this.$timeout(() => {
            this.save().then((data) => {
                this.saving = false;
                this.blockUI.reset();
                deferred.resolve(data);
            }).catch((err) => {
                this.saving = false;
                this.blockUI.reset();
                deferred.reject(err);
            });
        }, 200);
        return deferred.promise;
    }
    deleteAndBlock() {
        this.saving = true;
        this.blockUI.start();
        return this.delete().then((data) => {
            this.saving = false;
            this.blockUI.reset();
            return data;
        }).catch((err) => {
            this.saving = false;
            this.blockUI.reset();
            throw err;
        });
    }
}

const Modal = {
    template: require('./modal.html'),
    controller: ModalController,
    transclude: true,
    bindings: {
        title: '@',
        size: '@',
        cancel: '&',
        cancelText: '@',
        delete: '&',
        hideFooter: '<',
        showDelete: '<',
        save: '&',
        saveText: '@',
        valid: '<'
    }
};

export default angular.module('mpdx.common.modal.component', [
    'blockUI', 'gettext'
]).component('modal', Modal).name;
