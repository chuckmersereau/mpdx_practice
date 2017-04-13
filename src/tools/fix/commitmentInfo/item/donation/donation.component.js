import values from 'lodash/fp/values';
import find from 'lodash/fp/find';

class DonationController {
    serverConstants;

    constructor(
        serverConstants
    ) {
        this.serverConstants = serverConstants;

        this.currency_symbol = '$';
    }

    $postLink() {
        const currency = find({code: this.donation.currency}, values(this.serverConstants.data.pledge_currencies));
        if (currency) {
            this.currency_symbol = currency['symbol'];
        }
    }

    dateFormat() {
        const pledgeFrequencyToDateFormat = {
            '0.46153846153846': 'MMM D',
            '0.23076923076923': 'MMM D',
            '1': 'MMM D',
            '2': 'MMM D',
            '3': 'MMM',
            '4': 'MMM',
            '6': 'MMM',
            '12': 'YYYY',
            '24': 'YYYY'
        };

        if (pledgeFrequencyToDateFormat[this.contact.pledge_frequency]) {
            return pledgeFrequencyToDateFormat[this.contact.pledge_frequency];
        } else {
            return 'MMM';
        }
    }
}

const Donation = {
    controller: DonationController,
    template: require('./donation.html'),
    bindings: {
        contact: '=',
        donation: '='
    }
};

export default angular.module('mpdx.tools.fixCommitmentInfo.item.donation.component', [])
    .component('fixCommitmentInfoItemDonation', Donation).name;
