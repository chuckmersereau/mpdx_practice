import { reduce } from 'lodash/fp';

export class StatusPageService {
    data: any;
    constructor(
        private $http: ng.IHttpService,
        private $timeout: ng.ITimeoutService,
    ) {
        this.load();
    }
    load() {
        this.$timeout(() => this.load(), 600000); // 60000 ms is 1 minute

        return this.$http.get(
            'https://7j1jhswhjws0.statuspage.io/api/v2/summary.json?api_key=e9eecb49-b24e-42e9-8425-860d19889313'
        ).then((data) => {
            this.data = data.data;
            this.data.components = this.groupComponents(this.data.components);
        });
    }
    groupComponents(components) {
        let parentComponents = reduce((result, component) => {
            component.children = [];
            if (!component.group_id) {
                result[component.id] = component;
            }
            return result;
        }, {}, components);

        return reduce((result, component) => {
            component.children = [];
            if (component.group_id) {
                result[component.group_id].children.push(component);
            }
            return result;
        }, parentComponents, components);
    }
}

export default angular.module('mpdx.bottom.status.service', [
]).service('statusPage', StatusPageService).name;
