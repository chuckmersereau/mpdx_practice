class AppealsController {
    constructor(
        gettextCatalog,
        api, modal, state
    ) {
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.state = state;

        this.refreshAppeals();
    }
    refreshAppeals(callback) {
        this.api.get('appeals').then((data) => {
            this.appeals = data.appeals;
            if (_.isFunction(callback)) {
                callback(data);
            }
        });
    }
    donationAggregates(donations) {
        const amounts = _.chain(donations)
            .map('converted_amount')
            .reject((n) => !n)
            .value();
        const sum = _.sumBy(amounts, _.toNumber);

        return { sum: sum, average: sum / amounts.length };
    }
    percentComplete(appeal) {
        const goal = Number(appeal.amount);
        if (goal === 0) {
            return 0;
        }

        return Math.round(this.donationAggregates(appeal.donations).sum / goal * 100);
    }
    progressClass(appeal) {
        const percent = this.percentComplete(appeal);
        if (percent < 33) {
            return 'progress-red';
        }
        if (percent < 66) {
            return 'progress-yellow';
        }

        return 'progress-green';
    }
    editAppeal(id) {
        this.$state.go('appeals', { appealId: id, firstShow: true });
    }
    newAppeal() {
        this.modal.open({
            template: require('../../../common/appeals/wizard/wizard.modal.html'),
            controller: 'appealsWizardController',
            onHide: this.onHideModal.bind(this)
        });
    }
    onHideModal(newAppeal) {
        if (!newAppeal) {
            return;
        }
        // remove false values
        angular.forEach(newAppeal.validStatus, (value, key) => {
            if (!value) { delete newAppeal.validStatus[key]; }
        });
        angular.forEach(newAppeal.validTags, (value, key) => {
            if (!value) { delete newAppeal.validTags[key]; }
        });

        this.api.post('appeals', {
            name: newAppeal.name,
            amount: newAppeal.amount,
            contact_statuses: _.keys(newAppeal.validStatus),
            contact_tags: _.keys(newAppeal.validTags),
            contact_exclude: newAppeal.exclude
        }).then((data) => {
            this.refreshAppeals(() => {
                this.editAppeal(data.appeal.id);
            });
        }).catch(() => {
            alert(this.gettextCatalog.getString('An error occurred while creating the appeal.'));
        });
    }
}

const progressAppeals = {
    template: require('./appeals.html'),
    controller: AppealsController
};

export default angular.module('mpdx.home.progress.appeals', [])
    .component('progressAppeals', progressAppeals).name;
