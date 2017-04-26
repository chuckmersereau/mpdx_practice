class PledgeFrequencyToStrFilter {
    constructor(gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
        return (val) => {
            const frequency = parseFloat(val);
            switch (frequency) {
                case 0.23076923076923:
                    return this.gettextCatalog.getString('Every Week');
                case 0.46153846153846:
                    return this.gettextCatalog.getString('Every 2 Weeks');
                case 1:
                    return this.gettextCatalog.getString('Every Month');
                case 2:
                    return this.gettextCatalog.getString('Every 2 Months');
                case 3:
                    return this.gettextCatalog.getString('Every Quarter');
                case 4:
                    return this.gettextCatalog.getString('Every 4 Months');
                case 6:
                    return this.gettextCatalog.getString('Every 6 Months');
                case 12:
                    return this.gettextCatalog.getString('Every Year');
                case 24:
                    return this.gettextCatalog.getString('Every 2 Years');
            }
        };
    }

    static pledgeFrequencyToStrFactory(gettextCatalog) {
        return new PledgeFrequencyToStrFilter(gettextCatalog);
    }
}

PledgeFrequencyToStrFilter.pledgeFrequencyToStrFactory.$inject = ['gettextCatalog'];

export default angular.module('mpdx.contacts.list.item.pledgeFrequencyToStr', [])
  .filter('pledgeFrequencyToStr', PledgeFrequencyToStrFilter.pledgeFrequencyToStrFactory).name;
