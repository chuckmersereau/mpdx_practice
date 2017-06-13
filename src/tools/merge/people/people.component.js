import filter from 'lodash/fp/filter';

class MergePeopleController {
    api;
    mergePeople;

    constructor(
        $log, $q, $rootScope, $state, blockUI,
        api, mergePeople
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$state = $state;
        this.blockUI = blockUI.instances.get('merge-people');
        this.api = api;
        this.mergePeople = mergePeople;

        $rootScope.$on('accountListUpdated', () => {
            this.mergePeople.load(true);
        });
    }

    useThisOne(duplicate, mergeChoice = -1) {
        if (duplicate.mergeChoice === mergeChoice) {
            duplicate.mergeChoice = -1;
        } else {
            duplicate.mergeChoice = mergeChoice;
        }
    }

    confirm(confirmAndLeave = true) {
        this.blockUI.start();
        this.mergePeople.confirm().then(() => {
            this.blockUI.reset();
            if (confirmAndLeave) {
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
    template: require('./people.html')
};

import blockUi from 'angular-block-ui';
import mergePeople from './people.service';

export default angular.module('mpdx.tools.merge.people.component', [
    blockUi,
    mergePeople
]).component('mergePeople', MergePeople).name;
