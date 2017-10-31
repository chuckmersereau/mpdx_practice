import floor from 'lodash/fp/floor';
import max from 'lodash/fp/max';
import min from 'lodash/fp/min';

class ProgressbarController {
    constructor() {
        this.maxValue = 1;
    }
    $onChanges() {
        this.maxValue = this.appeal.amount > 0 ? this.appeal.amount : 1;
        let available = 100;
        this.givenWidth = this.getWidth(this.appeal.pledges_amount_processed);

        available -= this.givenWidth;
        available = max([available, 0]);

        const receivedWidth = this.getWidth(this.appeal.pledges_amount_received_not_processed);
        this.receivedWidth = min([receivedWidth, available]);

        available -= this.receivedWidth;
        available = max([available, 0]);

        const committedWidth = this.getWidth(this.appeal.pledges_amount_not_received_not_processed);
        this.committedWidth = min([committedWidth, available]);
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