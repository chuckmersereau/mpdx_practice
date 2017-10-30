import floor from 'lodash/fp/floor';

class ProgressbarController {
    constructor() {
        this.maxValue = 1;
    }
    $onChanges() {
        this.maxValue = this.appeal.amount > 0 ? this.appeal.amount : 1;
        let available = 100;
        this.givenWidth = this.getWidth(this.appeal.pledges_amount_processed);

        available -= this.givenWidth;
        available = available < 0 ? 0 : available;

        const receivedWidth = this.getWidth(this.appeal.pledges_amount_received_not_processed);
        this.receivedWidth = receivedWidth > available ? available : receivedWidth;

        available -= this.receivedWidth;
        available = available < 0 ? 0 : available;

        const committedWidth = this.getWidth(this.appeal.pledges_amount_not_received_not_processed);
        this.committedWidth = committedWidth > available ? available : committedWidth;
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