import 'angular-gettext';
import { ApiService } from '../../common/api/api.service';
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
import { convertTags } from '../../common/fp/tags';
import filters, { FiltersService } from '../../common/filters/filters.service';
import tasksTags, { TasksTagsService } from './tags/tags.service';

export class TasksFilterService {
    data: any;
    defaultParams: any;
    defaultParamsForGroup: any;
    group: string;
    loading: boolean;
    params: any;
    selectedSave: any;
    wildcardSearch: string;
    constructor(
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $log: ng.ILogService,
        private api: ApiService,
        private filters: FiltersService,
        private tasksTags: TasksTagsService
    ) {
        this.data = null;
        this.params = {};
        this.wildcardSearch = '';
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
    load(reset: boolean = false): ng.IPromise<any> {
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
    count(): number {
        return this.filters.count({ defaultParams: this.defaultParams, params: this.params });
    }
    change(filter?: any): void {
        this.selectedSave = null;
        this.handleFilterChange(filter);
        this.$log.debug('task filters change:', this.params);
        this.$rootScope.$emit('tasksFilterChange');
    }
    private handleFilterChange(filter: any): void {
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
    reset(stateParams: any = {}): void {
        this.assignDefaultParamsAndGroup('all');
        const params = this.filters.fromStrings(stateParams, this.data);
        this.params = assign(this.defaultParams, params);
        this.wildcardSearch = '';
        this.tasksTags.reset();
        this.data = map((filter) => {
            filter.reverse = false;
            return filter;
        }, this.data);
        this.change();
        this.selectedSave = undefined;
    }
    changeGroup(group: string): void {
        this.assignDefaultParamsAndGroup(group);
        this.change();
    }
    assignDefaultParamsAndGroup(group: string): void {
        this.group = group;
        const paramsForGroup = this.defaultParamsForGroup[this.group];
        this.defaultParams = assign(this.defaultParams, paramsForGroup);
        this.params = assign(this.params, paramsForGroup);
    }
    isResettable(): boolean {
        return !isEqual(this.params, this.defaultParams) || !isEmpty(this.wildcardSearch);
    }
    toParams(): any {
        let defaultParams = defaultTo({}, this.defaultParams);
        let filters = assign(defaultParams, this.params);
        filters = assign(filters, {
            any_tags: this.tasksTags.anyTags,
            account_list_id: this.api.account_list_id,
            tags: convertTags(this.tasksTags.selectedTags),
            exclude_tags: convertTags(this.tasksTags.rejectedTags),
            wildcard_search: this.wildcardSearch
        });
        return omitBy(isNil, filters);
    }
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter: any): void {
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
    removeFilter(filter: any): void {
        const reverseName = `reverse_${filter.name}`;
        this.params[filter.name] = this.defaultParams[filter.name];
        delete this.params[reverseName];
        filter.reverse = false;
    }
    showReset(): boolean {
        return this.tasksTags.isResettable() || this.isResettable();
    }
}

export default angular.module('mpdx.tasks.filter.service', [
    'gettext',
    filters, tasksTags
]).service('tasksFilter', TasksFilterService).name;
