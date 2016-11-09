class ModalController {
    constructor($element) {
        this.$element = $element;
    }
    $postLink() {
        this.$element.addClass('modal');
        this.$element.attr('tabindex', '-1');
        this.$element.attr('role', 'dialog');
    }
}

export default angular.module('mpdx.common.modal.controller', [])
    .controller('modalController', ModalController).name;