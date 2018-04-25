import { assign, concat, defaultTo, get, isEmpty, isString, map, reject, reduce, startsWith, union } from 'lodash/fp';
import isNilOrEmpty from 'common/fp/isNilOrEmpty';
import joinComma from 'common/fp/joinComma';
import uuid from 'uuid/v1';
import emptyToNull from 'common/fp/emptyToNull';
import moment from 'moment';

class TasksService {
    constructor(
        $rootScope, $log, gettextCatalog,
        alerts, api, contacts, modal, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.users = users;

        this.analytics = null;
        this.completeList = [];
        this.loading = true; // TODO: maybe should become false until actually loading
    }
    getAnalytics() {
        return this.api.get('tasks/analytics', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    save(task, comment) {
        task = this.mutateTagList(task);
        task = this.mutateComment(task, comment);

        return this.api.put(`tasks/${task.id}`, task).then(() => {
            this.change();
        });
    }
    mutateTagList(task) {
        // fix for api mis-match
        return task.tag_list ? assign(task, {
            tag_list: joinComma(task.tag_list)
        }) : task;
    }
    mutateComment(task, comment) {
        return !isNilOrEmpty(comment) ? assign(task, {
            comments: concat(defaultTo([], task.comments), {
                id: uuid(),
                body: comment,
                person: { id: this.users.current.id }
            })
        }) : task;
    }
    change() {
        this.$rootScope.$emit('taskChange');
    }
    create(task, contactIds = [], comment) {
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
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' }).then(() => {
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
    delete(task) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected task?');
        return this.modal.confirm(message).then(() => this.deleteAfterConfirm(task));
    }
    deleteAfterConfirm(task) {
        return this.api.delete(`tasks/${task.id}`).then(() => {
            this.$rootScope.$emit('taskDeleted', task.id);
            const message = this.gettextCatalog.getString('Task successfully deleted');
            this.alerts.addAlert(message);
        }).catch(() => {
            const message = this.gettextCatalog.getString('Unable to delete task');
            this.alerts.addAlert(message, 'danger');
        });
    }
    addModal({ contactsList = [], activityType = null, task = {}, comments = [] }) {
        return this.modal.open({
            template: require('./modals/add/add.html'),
            controller: 'addTaskController',
            resolve: {
                tags: /* @ngInject*/ (tasksTags) => tasksTags.load(),
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['activity_hashes']),
                resolveObject: /* @ngInject*/ (contacts, $state) =>
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
    getDataForAddTask({ contacts, $state, contactsList, activityType, task, comments }) {
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
            ? Promise.resolve({ contactsList: [], task: newTask })
            : this.getNames(contactIdList).then((data) => {
                return {
                    contactsList: data,
                    task: newTask
                };
            });
    }
    reuseTask(task, activityType) {
        return get('result', task) && activityType;
    }
    useContacts(task, reuseTask) {
        return isNilOrEmpty(task) || (task && reuseTask);
    }
    mutateComments(comments) {
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
        );
    }
    getNames(ids) {
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
    logModal(contactsList = []) {
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
    getContactsForLogModal($state, contacts, contactsList) {
        contactsList = get('[0]', contactsList) ? contactsList : []; // null contact check
        const contactParams = angular.copy(contactsList);
        const inContactView = startsWith('contacts.show', $state.current.name);
        const contactIdList = inContactView ? union(contactParams, [contacts.current.id]) : contactParams;
        this.$log.debug('contactsList', contactsList);
        return isNilOrEmpty(contactIdList)
            ? Promise.resolve([])
            : this.getNames(contactIdList);
    }
    load(taskId) {
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
        }).then((task) => {
            task.contacts = this.contacts.fixPledgeAmountAndFrequencies(task.contacts);
            /* istanbul ignore next */
            this.$log.debug(`tasks/${task.id}`, task);
            return task;
        });
    }
}

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import getText from 'angular-gettext';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasksTags from './filter/tags/tags.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.service', [
    getText,
    api, contacts, serverConstants, tasksTags, users
]).service('tasks', TasksService).name;
