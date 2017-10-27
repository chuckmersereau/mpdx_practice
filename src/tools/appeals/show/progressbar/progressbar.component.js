import floor from 'lodash/fp/floor';

class ProgressbarController {
    constructor() {
        this.maxValue = 1;
    }
    $onChanges() {
        this.maxValue = this.appeal.amount > 0 ? this.appeal.amount : 1;
    }
    getWidth(value) {
        return floor((value / this.maxValue) * 100);
    }
}

const Progressbar = {
    template: require('./progressbar.html'),
    controller: ProgressbarController,
    bindings: {
        appeal: '<'
    }
};

export default angular.module('mpdx.tools.appeals.show.progressbar.component', [])
    .component('appealsProgressbar', Progressbar).name;