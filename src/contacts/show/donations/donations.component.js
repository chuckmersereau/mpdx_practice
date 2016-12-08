class ContactDonationsController {
    api;
    contact;
    donations;
    donationsMeta;
    donationsService;
    modal;

    constructor(
        $scope,
        api, modal, donationsService
    ) {
        this.$scope = $scope;
        this.api = api;
        this.donationsService = donationsService;
        this.modal = modal;

        this.donations = [];
        this.donationGraphData = {};
        this.donationMeta = {page: 0};
        this.loading = false;
    }
    // $onInit() {
    //     if (this.contact.id) {
    //         this.getDonations();
    //         this.getDonationsGraph();
    //     }
    // }
    $onChanges(changesObj) {
        if (_.has(changesObj, 'contact.id')) {
            this.getDonations();
            this.getDonationsGraph();
        }
    }
    getDonations(page) {
        this.loading = true;
        if (this.api.account_list_id) {
            return this.getDonationsPromise(page);
        } else {
            this.$scope.$on('accountListUpdated', () => {
                this.getDonationsPromise(page);
            });
        }
    }
    getDonationsPromise(page) {
        this.donationsService.getDonations(this.contact.id, page).then((data) => {
            this.loading = false;
            this.donations = data.donations;
            this.donationsMeta = data.meta;
        });
    }
    getDonationsGraph() {
        this.donationsService.getDonationsGraphForContact(this.contact.id).then((data) => {
            let subtitle = 'Average donations remain unchanged from last year';
            if (data.amount > 0) {
                subtitle = 'Average donations up <span style="color:green">' + data.amount + '</span> from last year';
            } else if (data.amount < 0) {
                subtitle = 'Average donations down <span style="color:red">' + Math.abs(data.amount) + '</span> from last year';
            }
            this.donationGraphData = {
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
            };
        });
    }
    openDonationModal(donation) {
        this.modal.open({
            templateUrl: '/templates/common/edit_donation.html',
            controller: 'editDonationController',
            locals: {
                contact: this.contact,
                donation: donation
            }
        });
    }
}

const Donations = {
    controller: ContactDonationsController,
    template: require('./donations.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.donations.component', [])
    .component('contactDonations', Donations).name;
