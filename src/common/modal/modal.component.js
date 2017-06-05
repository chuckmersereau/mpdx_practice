class ModalController {
    $element;
    $attrs;
    delete;

    constructor(
        $element, $attrs, $scope,
        blockUI, gettextCatalog
    ) {
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;
        this.blockUI = blockUI.instances.get('modalBlockUI_' + this.$scope.$id);
        this.gettextCatalog = gettextCatalog;
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
        return this.save().then(data => {
            this.saving = false;
            this.blockUI.reset();
            return data;
        }).catch(err => {
            this.saving = false;
            this.blockUI.reset();
            throw err;
        });
    }
    deleteAndBlock() {
        this.saving = true;
        this.blockUI.start();
        return this.delete().then(data => {
            this.saving = false;
            this.blockUI.reset();
            return data;
        }).catch(err => {
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

import blockUI from 'angular-block-ui';
import gettext from 'angular-gettext';

export default angular.module('mpdx.common.modal.component', [
    blockUI, gettext
])
    .component('modal', Modal).name;
