import isEmpty from 'lodash/fp/isEmpty';
import isNull from 'lodash/fp/isNull';
import assign from "lodash/fp/assign";
import map from "lodash/fp/map";
import omitBy from "lodash/fp/omitBy";
import joinComma from "../../common/fp/joinComma";

class TasksFilterService {
    api;
    filters;

    constructor(
        $location, $q, $rootScope, $log,
        api, filters, tasksTags
    ) {
        this.$location = $location;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.$log = $log;
        this.api = api;
        this.filters = filters;
        this.tasksTags = tasksTags;

        this.data = null;
        this.params = {};
        this.wildcard_search = '';
        this.group = 'all';
        this.defaultParamsForGroup = {
            all: {
                starred: null,
                completed: 'false',
                date_range: null
            },
            today: {
                starred: null,
                completed: 'false',
                date_range: 'today'
            },
            overdue: {
                starred: null,
                completed: 'false',
                date_range: 'overdue'
            },
            upcoming: {
                starred: null,
                completed: 'false',
                date_range: 'upcoming'
            },
            noDueDate: {
                starred: null,
                completed: 'false',
                date_range: 'no_date'
            },
            starred: {
                starred: 'true',
                completed: 'false',
                date_range: null
            },
            completed: {
                starred: null,
                completed: 'true',
                date_range: null
            }
        };
        this.defaultParams = {};

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }
    load(reset = false) {
        if (!reset && this.data) {
            this.loading = false;
            return this.$q.resolve(this.data);
        }

        return this.filters.load({
            data: this.data,
            defaultParams: this.defaultParams,
            params: this.params,
            url: 'tasks/filters'
        }).then(({data, defaultParams, params}) => {
            this.data = data;
            this.defaultParams = defaultParams;
            this.params = params;
            this.changeGroup(this.group);
        });
    }
    count() {
        return this.filters.count({ defaultParams: this.defaultParams, params: this.params });
    }
    change() {
        this.$log.debug('task filters change');
        this.$rootScope.$emit('tasksFilterChange');
    }
    reset() {
        this.params = angular.copy(this.defaultParams);
        this.wildcard_search = '';
        this.tasksTags.reset();
        this.change();
    }
    changeGroup(group) {
        this.group = group;
        const paramsForGroup = this.defaultParamsForGroup[this.group];
        this.defaultParams = assign(this.defaultParams, paramsForGroup);
        this.params = assign(this.params, paramsForGroup);
        this.change();
    }
    isResettable() {
        return !angular.equals(this.params, this.defaultParams) || !isEmpty(this.wildcard_search);
    }
    toParams() {
        let defaultParams = this.defaultParams || {};
        let filters = assign(defaultParams, this.params);
        if (this.wildcard_search) {
            filters.wildcard_search = this.wildcard_search;
        }
        if (this.tasksTags.selectedTags.length > 0) {
            filters.tags = joinComma(map('name', this.tasksTags.selectedTags));
        } else {
            delete filters.tags;
        }
        if (this.tasksTags.rejectedTags.length > 0) {
            filters.exclude_tags = joinComma(map('name', this.tasksTags.rejectedTags));
        } else {
            delete filters.exclude_tags;
        }
        filters.account_list_id = this.api.account_list_id;
        filters.any_tags = this.tasksTags.anyTags;
        filters = omitBy(isNull, filters);
        return filters;
    }
}
export default angular.module('mpdx.tasks.filter.service', [])
    .service('tasksFilter', TasksFilterService).name;
