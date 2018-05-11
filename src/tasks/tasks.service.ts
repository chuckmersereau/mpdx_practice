import 'angular-gettext';
import * as moment from 'moment';
import * as uuid from 'uuid/v1';
import { AlertsService } from '../common/alerts/alerts.service';
import { assign, concat, defaultTo, get, isEmpty, isString, map, reduce, reject, startsWith, union } from 'lodash/fp';
import { ModalService } from '../common/modal/modal.service';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../common/api/api.service';
import contacts, { ContactsService } from '../contacts/contacts.service';
import emptyToNull from '../common/fp/emptyToNull';
import isNilOrEmpty from '../common/fp/isNilOrEmpty';
import joinComma from '../common/fp/joinComma';
import serverConstants, { ServerConstantsService } from '../common/serverConstants/serverConstants.service';
import tasksTags, { TasksTagsService } from './filter/tags/tags.service';
import users, { UsersService } from '../common/users/users.service';

export class TasksService {
    analytics: any;
    completeList: any;
    loading: boolean;
    constructor(
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $log: ng.ILogService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService,
        private contacts: ContactsService,
        private modal: ModalService,
        private users: UsersService
    ) {
        this.analytics = null;
        this.completeList = [];
        this.loading = true; // TODO: maybe should become false until actually loading
    }
    getAnalytics(): ng.IPromise<void> {
        return this.api.get('tasks/analytics', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    save(task: any, comment?: string): ng.IPromise<any> {
        task = this.mutateTagList(task);
        task = this.mutateComment(task, comment);

        return this.api.put(`tasks/${task.id}`, task).then(() => {
            this.change();
        });
    }
    private mutateTagList(task: any): any {
        // fix for api mis-match
        return task.tag_list ? assign(task, {
            tag_list: joinComma(task.tag_list)
        }) : task;
    }
    private mutateComment(task: any, comment?: string): any {
        return !isNilOrEmpty(comment) ? assign(task, {
            comments: concat(defaultTo([], task.comments), {
                id: uuid(),
                body: comment,
                person: { id: this.users.current.id }
            })
        }) : task;
    }
    change(): void {
        this.$rootScope.$emit('taskChange');
    }
    create(task: any, contactIds: string[] = [], comment?: string): ng.IPromise<any> {
        task.account_list = { id: this.api.account_list_id };
        contactIds = reject('', contactIds);
        task = this.mutateTagList(task);
        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                let contactTask = angular.copy(task);
                contactTask = this.mutateComment(contactTask, comment);
                if (!isEmpty(contactId)) {
                    result = concat(result, assign(contactTask, { id: uuid(), contacts: [{ id: contactId }] }));
                }
                return result;
            }, [], contactIds);
            return this.api.post({
                url: 'tasks/bulk',
                data: tasks,
                type: 'tasks',
                fields: {
                    tasks: ''
                }
            }).then(() => {
                if (contactIds.length > 0) {
                    this.$rootScope.$emit('contactCreated');
                }
            });
        }
        task = this.mutateComment(task, comment);

        task.contacts = map((contactId) => { return { id: contactId }; }, contactIds);
        return this.api.post('tasks', task).then((data) => {
            this.$rootScope.$emit('taskCreated', task);
            const message = this.gettextCatalog.getString('Task created successfully');
            this.alerts.addAlert(message);
            return data;
        }).catch(() => {
            const message = this.gettextCatalog.getString('Unable to create task');
            this.alerts.addAlert(message, 'danger');
        });
    }
    delete(task: any): ng.IPromise<any> {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected task?');
        return this.modal.confirm(message).then(() => this.deleteAfterConfirm(task));
    }
    private deleteAfterConfirm(task): ng.IPromise<void> {
        return this.api.delete(`tasks/${task.id}`).then(() => {
            this.$rootScope.$emit('taskDeleted', task.id);
            const message = this.gettextCatalog.getString('Task successfully deleted');
            this.alerts.addAlert(message);
        }).catch(() => {
            const message = this.gettextCatalog.getString('Unable to delete task');
            this.alerts.addAlert(message, 'danger');
        });
    }
    addModal({ contactsList = [], activityType = null, task = {}, comments = [] }: {
    contactsList?: string[],
    activityType?: string,
    task?: any,
    comments?: string[]
    }): ng.IPromise<any> {
        return this.modal.open({
            template: require('./modals/add/add.html'),
            controller: 'addTaskController',
            resolve: {
                tags: /* @ngInject*/ (tasksTags: TasksTagsService) => tasksTags.load(),
                0: /* @ngInject*/ (serverConstants: ServerConstantsService) =>
                    serverConstants.load(['activity_hashes']),
                resolveObject: /* @ngInject*/ (contacts: ContactsService, $state: StateService) =>
                    this.getDataForAddTask({
                        contacts: contacts,
                        $state: $state,
                        contactsList: contactsList,
                        activityType: activityType,
                        task: task,
                        comments: comments
                    })
            }
        });
    }
    private getDataForAddTask({ contacts, $state, contactsList, activityType, task, comments }: {
    contacts: ContactsService,
    $state: StateService,
    contactsList: string[],
    activityType: string,
    task: any,
    comments: string[]
    }): ng.IPromise<any> {
        const reuseTask = this.reuseTask(task, activityType);
        const useContacts = this.useContacts(task, reuseTask);
        const contactParams = useContacts ? angular.copy(contactsList) : [];
        const inContactView = startsWith('contacts.show', $state.current.name);
        const contactIdList = inContactView ? union(contactParams, [contacts.current.id]) : contactParams;
        const newTask = reuseTask
            ? {
                activity_type: activityType,
                comments: this.mutateComments(comments),
                start_at: moment().add(2, 'd').toISOString(),
                subject: get('subject', task),
                tag_list: get('tag_list', task)
            }
            : { activity_type: activityType };
        /* istanbul ignore next */
        this.$log.debug('Add task mutated task', newTask);

        return isNilOrEmpty(contactIdList)
            ? this.$q.resolve({ contactsList: [], task: newTask })
            : this.getNames(contactIdList).then((data) => {
                return {
                    contactsList: data,
                    task: newTask
                };
            });
    }
    private reuseTask(task: any, activityType: string): boolean {
        return get('result', task) && !!activityType;
    }
    private useContacts(task: any, reuseTask: boolean): boolean {
        return isNilOrEmpty(task) || (task && reuseTask);
    }
    private mutateComments(comments: string[]): any[] {
        return emptyToNull(
            reduce((result, comment) => {
                const id = uuid();
                return isNilOrEmpty(comment)
                    ? result
                    : concat(result,
                        isString(comment)
                            ? {
                                id: id,
                                body: comment,
                                person: { id: this.users.current.id }
                            }
                            : assign(comment, { id: id })
                    );
            }, [], comments)
        ) as any[];
    }
    getNames(ids: string[]): ng.IPromise<any> {
        return this.api.get({
            url: 'contacts',
            data: {
                per_page: 10000,
                fields: { contacts: 'name' },
                filter: {
                    ids: joinComma(ids),
                    status: 'active,hidden,null'
                }
            },
            overrideGetAsPost: true,
            autoParams: false
        });
    }
    logModal(contactsList: string[] = []): ng.IPromise<any> {
        return this.modal.open({
            template: require('./modals/log/log.html'),
            controller: 'logTaskController',
            resolve: {
                tags: /* @ngInject*/ (tasksTags) => tasksTags.load(),
                0: /* @ngInject*/ (serverConstants) =>
                    serverConstants.load(['activity_hashes', 'next_actions', 'results', 'status_hashes']),
                contactsList: /* @ngInject*/ ($state, contacts) =>
                    this.getContactsForLogModal($state, contacts, contactsList)
            }
        });
    }
    getContactsForLogModal($state: StateService, contacts: ContactsService, contactsList: string[]):
        ng.IPromise<string[]> {
        contactsList = get('[0]', contactsList) ? contactsList : []; // null contact check
        const contactParams = angular.copy(contactsList);
        const inContactView = startsWith('contacts.show', $state.current.name);
        const contactIdList = inContactView ? union(contactParams, [contacts.current.id]) : contactParams;
        this.$log.debug('contactsList', contactsList);
        return isNilOrEmpty(contactIdList)
            ? this.$q.resolve([])
            : this.getNames(contactIdList);
    }
    load(taskId: string): ng.IPromise<any> {
        return this.api.get(`tasks/${taskId}`, {
            include: 'activity_contacts,comments,comments.person,contacts,contacts.addresses,contacts.last_donation,'
                + 'contacts.primary_person,contacts.primary_person.facebook_accounts,contacts.primary_person.phone_numbers,'
                + 'contacts.primary_person.email_addresses',
            fields: {
                activity_contacts: 'contact',
                contacts: 'addresses,name,last_donation,primary_person,pledge_amount,pledge_currency,pledge_currency_symbol,'
                    + 'pledge_frequency,pledge_received,send_newsletter,square_avatar,status,tag_list,'
                    + 'uncompleted_tasks_count',
                addresses: 'city,historic,primary_mailing_address,postal_code,state,source,street',
                email_addresses: 'email,historic,primary',
                phone_numbers: 'historic,location,number,primary',
                facebook_accounts: 'username',
                person: 'first_name,last_name,deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers'
            }
        }).then((task: any) => {
            task.contacts = this.contacts.fixPledgeAmountAndFrequencies(task.contacts);
            /* istanbul ignore next */
            this.$log.debug(`tasks/${task.id}`, task);
            return task;
        });
    }
}

export default angular.module('mpdx.tasks.service', [
    'gettext',
    api, contacts, serverConstants, tasksTags, users
]).service('tasks', TasksService).name;
