import {
    assign,
    compact,
    defaultTo,
    isArray,
    isEmpty,
    isEqual,
    isNil,
    map,
    omitBy
} from 'lodash/fp';
import { convertTags } from 'common/fp/tags';

class TasksFilterService {
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
        }).then(({ data, defaultParams, params }) => {
            this.data = data;
            this.defaultParams = defaultParams;
            this.params = params;
            this.changeGroup(this.group);
        });
    }
    count() {
        return this.filters.count({ defaultParams: this.defaultParams, params: this.params });
    }
    change(filter) {
        this.selectedSave = null;
        this.handleFilterChange(filter);
        this.$log.debug('task filters change:', this.params);
        this.$rootScope.$emit('tasksFilterChange');
    }
    handleFilterChange(filter) {
        if (filter) {
            const currentFilter = this.params[filter.name];
            if (isArray(currentFilter) && currentFilter.length > 1) {
                this.params[filter.name] = compact(currentFilter);
            }
            if (isArray(currentFilter) && currentFilter.length === 0) {
                this.params[filter.name] = this.defaultParams[filter.name];
            }
        }
    }
    reset(stateParams = {}) {
        this.assignDefaultParamsAndGroup('all');
        this.params = assign(this.defaultParams, stateParams);
        this.wildcard_search = '';
        this.tasksTags.reset();
        this.data = map((filter) => {
            filter.reverse = false;
            return filter;
        }, this.data);
        this.change();
        this.selectedSave = undefined;
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
        filters = assign(filters, {
            any_tags: this.tasksTags.anyTags,
            account_list_id: this.api.account_list_id,
            tags: convertTags(this.tasksTags.selectedTags),
            exclude_tags: convertTags(this.tasksTags.rejectedTags),
            wildcard_search: this.wildcard_search
        });
        return omitBy(isNil, filters);
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter) {
        if (filter.type !== 'multiselect') {
            return;
        }
        const reverseName = `reverse_${filter.name}`;
        if (this.params[reverseName]) {
            delete this.params[reverseName];
        } else {
            this.params[reverseName] = true;
        }
        filter.reverse = !!this.params[reverseName];
        this.change();
    }
    removeFilter(filter) {
        const reverseName = `reverse_${filter.name}`;
        this.params[filter.name] = this.defaultParams[filter.name];
        delete this.params[reverseName];
        filter.reverse = false;
    }
    showReset() {
        return this.tasksTags.isResettable() || this.isResettable();
    }
}

import filters from 'common/filters/filters.service';
import gettext from 'angular-gettext';
import tasksTags from './tags/tags.service';


export default angular.module('mpdx.tasks.filter.service', [
    gettext,
    filters, tasksTags
]).service('tasksFilter', TasksFilterService).name;
