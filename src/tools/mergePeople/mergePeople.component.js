import filter from 'lodash/fp/filter';

class MergePeopleController {
    api;
    mergePeople;

    constructor(
        $log, $q, $state, blockUI,
        api, mergePeople
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$state = $state;
        this.blockUI = blockUI.instances.get('merge-people');
        this.api = api;
        this.mergePeople = mergePeople;
    }

    useThisOne(duplicate, mergeChoice = -1) {
        if (duplicate.mergeChoice === mergeChoice) {
            duplicate.mergeChoice = -1;
        } else {
            duplicate.mergeChoice = mergeChoice;
        }
    }

    confirm(confirmAndRetire = true) {
        this.blockUI.start();
        this.mergePeople.confirm().then(() => {
            this.blockUI.reset();
            if (confirmAndRetire) {
                this.$state.go('contacts');
            }
        });
    }

    confirmButtonDisabled() {
        return filter(duplicate => (duplicate.mergeChoice !== -1), this.mergePeople.duplicates).length === 0;
    }
}
const MergePeople = {
    controller: MergePeopleController,
    template: require('./mergePeople.html')
};

export default angular.module('mpdx.tools.mergePeople.component', [])
    .component('mergePeople', MergePeople).name;
