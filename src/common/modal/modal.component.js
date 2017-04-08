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

        this.cancelText = this.cancelText || this.gettextCatalog.getString('Cancel');
        this.saveText = this.saveText || this.gettextCatalog.getString('Save');
    }
    $postLink() {
        this.$element.addClass('modal');
        this.$element.attr('tabindex', '-1');
        this.$element.attr('role', 'dialog');
    }
    saveAndBlock() {
        this.blockUI.start();
        this.save().finally(() => this.blockUI.reset());
    }
    deleteAndBlock() {
        this.blockUI.start();
        this.delete().finally(() => this.blockUI.reset());
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

export default angular.module('mpdx.common.modal.component', [])
    .component('modal', Modal).name;
