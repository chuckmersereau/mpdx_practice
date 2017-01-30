import Highcharts from 'highcharts';

class ContactDonationsController {
    accounts;
    api;
    contact;
    donations;
    contactDonations;
    modal;

    constructor(
        $scope,
        api, modal, contactDonations, accounts
    ) {
        this.$scope = $scope;
        this.accounts = accounts;
        this.api = api;
        this.contactDonations = contactDonations;
        this.modal = modal;

        this.donations = [];
        this.donationGraphData = {};
        this.loading = false;
        console.error('missing donation graph endpoint');
        console.error('missing account donation filter by id');
    }
    // commented out until api available
    $onChanges(changesObj) {
        if (_.get(changesObj, 'contactId.currentValue', false)) {
            this.getDonations(0);
            // this.getDonationsGraph();
        }
    }
    getDonations(page) {
        return this.accounts.getDonations({ filter: { contact_id: this.contactId }, page: page }).then((data) => {
            this.loading = false;
            this.donations = data;
        });
    }
    getDonationsGraph() {
        this.contactDonations.getDonationsGraphForContact(this.contactId).then((data) => {
            let subtitle = 'Average donations remain unchanged from last year';
            if (data.amount > 0) {
                subtitle = `Average donations up <span style="color:green">${data.amount}</span> from last year`;
            } else if (data.amount < 0) {
                subtitle = `Average donations down <span style="color:red">${Math.abs(data.amount)}</span> from last year`;
            }
            Highcharts.chart('contact_donations_summary_chart', {
                options: {
                    chart: {
                        height: 250
                    }
                },
                title: {
                    text: 'Donation History'
                },
                subtitle: {
                    text: subtitle
                },
                xAxis: {
                    categories: data.categories
                },
                yAxis: {
                    min: 0,
                    minRange: 50,
                    title: {
                        text: 'Amount'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return this.y;
                    }
                },
                series: [{
                    name: 'Average',
                    data: data.average_series,
                    type: 'line',
                    color: '#3EB1C8',
                    marker: {
                        enabled: false
                    }
                }, {
                    name: 'Donations',
                    data: data.current_year.series,
                    type: 'column',
                    color: '#DB843D'
                }, {
                    name: 'Last Year',
                    data: data.prior_year.series,
                    type: 'column',
                    color: '#FDB800'
                }]
            });
        });
    }
    openDonationModal(donation) {
        this.modal.open({
            templateUrl: '/templates/common/edit_donation.html',
            controller: 'editDonationController',
            locals: {
                contactId: this.contactId,
                donation: donation
            }
        });
    }
}

const Donations = {
    controller: ContactDonationsController,
    template: require('./donations.html'),
    bindings: {
        contactId: '<'
    }
};

export default angular.module('mpdx.contacts.show.donations.component', [])
    .component('contactDonations', Donations).name;
