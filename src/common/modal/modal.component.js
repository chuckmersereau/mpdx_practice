class ModalController {
    $element;
    $attrs;

    constructor($element, $attrs, blockUI) {
        this.$element = $element;
        this.$attrs = $attrs;
        this.blockUI = blockUI.instances.get('modalBlockUI');
        this.size = this.size || 'md';
        this.valid = this.valid || true;
    }

    $postLink() {
        this.$element.addClass('modal');
        this.$element.attr('tabindex', '-1');
        this.$element.attr('role', 'dialog');
    }

    saveAndBlock() {
        this.blockUI.start();
        this.save().finally(() => this.blockUI.stop());
    }

    deleteAndBlock() {
        this.blockUI.start();
        this.delete().finally(() => this.blockUI.stop());
    }
}

const Modal = {
    template: require('./modal.html'),
    controller: ModalController,
    transclude: true,
    bindings: {
        'title': '@',
        'size': '@',
        'cancel': '&',
        'delete': '&',
        'showDelete': '<',
        'save': '&',
        'valid': '<'
    }
};

export default angular.module('mpdx.common.modal.component', [])
    .component('modal', Modal).name;
