class ReportsService {
    api;
    constructor(
        $q, $log,
        api
    ) {
        this.$q = $q;
        this.$log = $log;
        this.api = api;
        this.goals = null;
    }
    getGoals(reset = false) {
        if (!reset && this.goals) {
            return this.$q.resolve(this.goals);
        }
        return this.api.get('reports/goal_progress', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('reports/goal_progress', data);
            this.goals = data;
        });
    }
}

export default angular.module('mpdx.reports.service', [])
    .service('reports', ReportsService).name;