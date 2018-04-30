import { defaultTo, floor, get, max, min } from 'lodash/fp';

class ProgressbarController {
    appeal: any;
    committedWidth: number;
    givenWidth: number;
    maxValue: number;
    receivedWidth: number;
    constructor() {
        this.maxValue = 1;
    }
    $onChanges() {
        const amount = defaultTo(1, get('amount', this.appeal));
        this.maxValue = max([amount, 1]);
        let available = 100;
        const processed = defaultTo(0, get('pledges_amount_processed', this.appeal));
        this.givenWidth = this.getWidth(processed);

        available -= this.givenWidth;
        available = max([available, 0]);

        const received = defaultTo(0, get('pledges_amount_received_not_processed', this.appeal));
        const receivedWidth = this.getWidth(received);
        this.receivedWidth = min([receivedWidth, available]);

        available -= this.receivedWidth;
        available = max([available, 0]);

        const committed = defaultTo(0, get('pledges_amount_not_received_not_processed', this.appeal));
        const committedWidth = this.getWidth(committed);
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