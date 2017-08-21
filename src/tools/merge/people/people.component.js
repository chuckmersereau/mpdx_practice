import filter from 'lodash/fp/filter';

class MergePeopleController {
    constructor(
        $log, $rootScope, $state, blockUI,
        api, mergePeople
    ) {
        this.$log = $log;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.blockUI = blockUI.instances.get('merge-people');
        this.api = api;
        this.mergePeople = mergePeople;
    }

    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.mergePeople.load(true);
        });

        this.mergePeople.load();
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
        return filter((duplicate) => (duplicate.mergeChoice !== -1), this.mergePeople.duplicates).length === 0;
    }
}

const MergePeople = {
    controller: MergePeopleController,
    template: require('./people.html')
};

import blockUi from 'angular-block-ui';
import mergePeople from './people.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.tools.merge.people.component', [
    blockUi, uiRouter,
    mergePeople
]).component('mergePeople', MergePeople).name;
