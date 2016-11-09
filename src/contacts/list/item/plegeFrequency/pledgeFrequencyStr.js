class pledgeFrequencyStr {

    constructor(val) {
        this.val = val;
    }

    showReset(val) {
        val = parseFloat(val);
        switch (val) {
            case 0.23076923076923:
                return ('Weekly');
            case 0.46153846153846:
                return ('Every 2 Weeks');
            case 1:
                return ('Monthly');
            case 2:
                return ('Every 2 Months');
            case 3:
                return ('Quarterly');
            case 4:
                return ('Every 4 Months');
            case 6:
                return ('Every 6 Months');
            case 12:
                return ('Annual');
            case 24:
                return ('Every 2 Years');
        }
    }
}

const Filter = {
    controller: pledgeFrequencyStr
};

export default angular.module('mpdx.contacts.list.item.pledgeFrequencyStr', [])
  .component('pledgeFrequencyStr', Filter).name;

