import defaultTo from 'lodash/fp/defaultTo';
import flow from 'lodash/fp/flow';
import isEmpty from 'lodash/fp/isEmpty';
import isEqual from 'lodash/fp/isEqual';
import isNil from 'lodash/fp/isNil';
import assign from "lodash/fp/assign";
import map from "lodash/fp/map";
import omitBy from "lodash/fp/omitBy";
import joinComma from "../../common/fp/joinComma";
import emptyToNull from '../../common/fp/emptyToNull';

class TasksFilterService {
    api;
    filters;

    constructor(
        $q, $rootScope, $log,
        api, filters, tasksTags
    ) {
        this.$q = $q;
        this.$rootScope = $rootScope;
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
            },
            contact: {
                starred: null,
                completed: null,
                date_range: null
            }
        };
        this.defaultParams = {};
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
    reset(stateParams = {}) {
        this.assignDefaultParamsAndGroup('all');
        this.params = assign(this.defaultParams, stateParams);
        this.wildcard_search = '';
        this.tasksTags.reset();
        this.change();
    }
    changeGroup(group) {
        this.assignDefaultParamsAndGroup(group);
        this.change();
    }
    assignDefaultParamsAndGroup(group) {
        this.group = group;
        const paramsForGroup = this.defaultParamsForGroup[this.group];
        this.defaultParams = assign(this.defaultParams, paramsForGroup);
        this.params = assign(this.params, paramsForGroup);
    }
    isResettable() {
        return !isEqual(this.params, this.defaultParams) || !isEmpty(this.wildcard_search);
    }
    toParams() {
        let defaultParams = defaultTo({}, this.defaultParams);
        let filters = assign(defaultParams, this.params);
        const convertTags = flow(map('name'), joinComma, emptyToNull);
        filters = assign(filters, {
            any_tags: this.tasksTags.anyTags,
            account_list_id: this.api.account_list_id,
            tags: convertTags(this.tasksTags.selectedTags),
            exclude_tags: convertTags(this.tasksTags.rejectedTags),
            wildcard_search: this.wildcard_search
        });
        return omitBy(isNil, filters);
    }
}

import tasksTags from './tags/tags.service';
import filters from '../../common/filters/filters.service';

export default angular.module('mpdx.tasks.filter.service', [
    filters, tasksTags
]).service('tasksFilter', TasksFilterService).name;
