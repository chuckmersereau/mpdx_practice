import component from './item.component';

describe('tasks.list.item.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController, modal, tasks, gettextCatalog, users, api,
        serverConstants;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _contacts_, _modal_, _tasks_, _gettextCatalog_, _users_, _api_,
            _serverConstants_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            users = _users_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('tasksListItem', { $scope: scope }, { task: null, selected: null });
    }
    describe('constructor', () => {
        beforeEach(() => {
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
        });
        it('should expose dependencies', () => {
            expect($ctrl.gettextCatalog).toEqual(gettextCatalog);
            expect($ctrl.modal).toEqual(modal);
            expect($ctrl.tasks).toEqual(tasks);
            expect($ctrl.users).toEqual(users);
        });
    });
    describe('$onInit', () => {
        it('should set default values', () => {
            $ctrl.$onInit();
            expect($ctrl.showContacts).toBeFalsy();
            expect($ctrl.showComments).toBeFalsy();
            expect($ctrl.loaded).toBeFalsy();
            $ctrl.$onDestroy();
        });
        it('should handle tag deletion', () => {
            $ctrl.task = { id: 1, tag_list: ['a', 'b'] };
            $ctrl.$onInit();
            rootScope.$emit('taskTagDeleted', { taskIds: [1], tag: 'a' });
            rootScope.$digest();
            expect($ctrl.task.tag_list).toEqual(['b']);
            $ctrl.$onDestroy();
        });
        it('should ignore other task ids', () => {
            $ctrl.task = { id: 1, tag_list: ['a', 'b'] };
            $ctrl.$onInit();
            rootScope.$emit('taskTagDeleted', { taskIds: [2], tag: 'a' });
            rootScope.$digest();
            expect($ctrl.task.tag_list).toEqual(['a', 'b']);
            $ctrl.$onDestroy();
        });
    });
    describe('addComment', () => {
        beforeEach(() => {
            $ctrl.task = { id: 1 };
            users.current = { id: 2, first_name: 'a', last_name: 'b' };
            $ctrl.task.comments = [];
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 1, body: 'asdf' }));
        });
        it('should do nothing without a comment', () => {
            expect($ctrl.addComment()).toBeUndefined();
        });
        it('should post to the api', () => {
            $ctrl.comment = 'asdf';
            $ctrl.addComment();
            expect(api.post).toHaveBeenCalledWith('tasks/1/comments', { body: 'asdf', person: { id: 2 } });
        });
        it('should adjust the current results', (done) => {
            $ctrl.comment = 'asdf';
            $ctrl.addComment().then(() => {
                expect($ctrl.task.comments).toEqual([{ id: 1, body: 'asdf', person: { id: 2, first_name: 'a', last_name: 'b' } }]);
                done();
            });
        });
        it('should reset the comment box', (done) => {
            $ctrl.comment = 'asdf';
            $ctrl.addComment().then(() => {
                expect($ctrl.comment).toEqual('');
                done();
            });
        });
    });
    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ contacts: ['a'] }));
            spyOn(contacts, 'fixPledgeAmountAndFrequencies').and.callFake((data) => data);
            $ctrl.task = { id: 1 };
        });
        it('should query the api for a tasks comments & contacts info', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('tasks/1', {
                include: 'comments,comments.person,contacts,contacts.addresses,contacts.people,contacts.people.facebook_accounts,contacts.people.phone_numbers,contacts.people.email_addresses',
                fields: {
                    contacts: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                    addresses: 'city,historic,primary_mailing_address,postal_code,state,source,street',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username',
                    person: 'first_name,last_name,deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers'
                }
            });
        });
        it('should mutate the contact data', (done) => {
            $ctrl.load().then(() => {
                expect(contacts.fixPledgeAmountAndFrequencies).toHaveBeenCalledWith(['a']);
                expect($ctrl.task.contacts).toEqual(['a']);
                done();
            });
        });
    });
    describe('complete', () => {
        it('should open the complete modal', () => {
            spyOn(modal, 'open').and.callThrough();
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.complete();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../../modals/complete/complete.html'),
                controller: 'completeTaskController',
                resolve: jasmine.any(Object)
            });
            expect($ctrl.load).toHaveBeenCalledWith();
            expect(serverConstants.load).toHaveBeenCalledWith(['next_actions', 'results', 'status_hashes']);
        });
    });
    describe('edit', () => {
        it('should open the edit modal', () => {
            spyOn(modal, 'open').and.callThrough();
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.edit();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../../modals/edit/edit.html'),
                controller: 'editTaskController',
                locals: jasmine.any(Object),
                resolve: jasmine.any(Object)
            });
            expect(serverConstants.load).toHaveBeenCalledWith(['activity_hashes', 'results']);
        });
    });
    describe('star', () => {
        it('should call the api', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve({ starred: true }));
            $ctrl.task = { id: 1, starred: false };
            $ctrl.star().then(() => {
                expect(api.put).toHaveBeenCalledWith('tasks/1', {
                    id: 1,
                    starred: true
                });
                expect($ctrl.task.starred).toBeTruthy();
                done();
            });
        });
    });
    describe('commentRemoved', () => {
        it('should remove the comment from the task', () => {
            $ctrl.task = { id: 1, comments: [{ id: 1 }, { id: 2 }] };
            $ctrl.commentRemoved(1);
            expect($ctrl.task.comments.length).toEqual(1);
            expect($ctrl.task.comments[0].id).toEqual(2);
        });
    });
});
