import component from './item.component';

describe('tasks.list.item.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController, modal, tasks, gettextCatalog, users, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _modal_, _tasks_, _gettextCatalog_, _users_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            users = _users_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
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
    describe('editComment', () => {
        beforeEach(() => {
            $ctrl.task = { id: 1 };
            users.current = { id: 2, first_name: 'a', last_name: 'b' };
            spyOn(api, 'put').and.callFake(() => Promise.resolve({ id: 1, body: 'asdf' }));
        });
        it('should put to the api', () => {
            let comment = { id: 3, body: 'asdf', person: { id: 2, first_name: 'a', last_name: 'b' } };
            $ctrl.editComment(comment);
            expect(api.put).toHaveBeenCalledWith('tasks/1/comments/3', { body: 'asdf' });
        });
        it('should reset the comment edit flag', (done) => {
            let comment = { id: 3, body: 'asdf', person: { id: 2, first_name: 'a', last_name: 'b' } };
            $ctrl.editComment(comment).then(() => {
                expect(comment.edit).toBeFalsy();
                done();
            });
        });
    });
    describe('commentBelongsToUser', () => {
        it('should be true if comment belongs to current user', () => {
            users.current = { id: 1 };
            const comment = { person: { id: 1 } };
            expect($ctrl.commentBelongsToUser(comment)).toBeTruthy();
        });
        it('should be false if comment belongs to different user', () => {
            users.current = { id: 1 };
            const comment = { person: { id: 2 } };
            expect($ctrl.commentBelongsToUser(comment)).toBeFalsy();
        });
        it('should be false if null condition', () => {
            users.current = { id: 1 };
            const comment = {};
            expect($ctrl.commentBelongsToUser(comment)).toBeFalsy();
        });
    });
    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
        });
        it('should query the api for a tasks comments & contacts info', () => {
            $ctrl.task = { id: 1 };
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
    });
});
