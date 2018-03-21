import save from './save.controller';

const name = 'my_filter';
const key = `saved_tasks_filter_${name}`;
const options = { [key]: { key: key, title: key } };
const data = 'a';

describe('common.filter.save.controller', () => {
    let $ctrl, controller, api, users, scope, rootScope, gettextCatalog, modal;
    beforeEach(() => {
        angular.mock.module(save);
        inject(($controller, $rootScope, _api_, _users_, _gettextCatalog_, _modal_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            controller = $controller;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            users = _users_;
            $ctrl = loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        api.account_list_id = 123;
    });

    function loadController() {
        return controller('saveFilterModal as $ctrl', {
            $scope: scope,
            anyTags: false,
            filterType: 'tasks',
            params: {},
            rejectedTags: [],
            selectedTags: [],
            wildcardSearch: null
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn($ctrl, 'checkUpdateOption').and.callFake(() => Promise.resolve({}));
            spyOn($ctrl, 'createOption').and.callFake(() => Promise.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callThrough();
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });
        it('should create an option', () => {
            users.currentOptions = {};
            $ctrl.name = name;
            $ctrl.save();
            expect($ctrl.createOption).toHaveBeenCalledWith(key, jasmine.any(String));
            const payload = $ctrl.createOption.calls.argsFor(0)[1];
            const obj = JSON.parse(payload);
            expect(obj).toEqual({
                account_list_id: api.account_list_id,
                any_tags: false,
                params: {},
                tags: null,
                exclude_tags: null,
                wildcard_search: null
            });
        });
        it('should update an option', () => {
            users.currentOptions = options;
            $ctrl.name = name;
            $ctrl.save();
            expect($ctrl.checkUpdateOption)
                .toHaveBeenCalledWith(options[key], jasmine.any(String));
            const payload = $ctrl.checkUpdateOption.calls.argsFor(0)[1];
            const obj = JSON.parse(payload);
            expect(obj).toEqual({
                account_list_id: api.account_list_id,
                any_tags: false,
                params: {},
                tags: null,
                exclude_tags: null,
                wildcard_search: null
            });
        });
        it('should emit event on change', (done) => {
            users.currentOptions = {};
            $ctrl.name = name;
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('savedFilterAdded', key);
                done();
            });
        });
        it('should hide on change', (done) => {
            users.currentOptions = {};
            $ctrl.name = name;
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('createOption', () => {
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'afterSave').and.callFake(() => Promise.resolve());
        });
        it('should call the api', () => {
            $ctrl.createOption(key, data);
            expect(api.post).toHaveBeenCalledWith({
                url: 'user/options',
                data: {
                    data: {
                        attributes: {
                            key: key,
                            value: data
                        },
                        type: 'user_options'
                    }
                },
                doSerialization: false,
                autoParams: false
            });
        });
        it('should call afterSave', (done) => {
            $ctrl.createOption(key, data).then(() => {
                expect($ctrl.afterSave).toHaveBeenCalledWith(key, data);
                done();
            });
        });
    });
    describe('updateOption', () => {
        beforeEach(() => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'afterSave').and.callFake(() => Promise.resolve());
        });
        it('should call the api', () => {
            $ctrl.updateOption(options[key], data);
            expect(api.put).toHaveBeenCalledWith({
                url: `user/options/${key}`,
                data: {
                    data: {
                        attributes: {
                            title: options[key].title,
                            value: data,
                            overwrite: true
                        },
                        type: 'user_options'
                    }
                },
                doSerialization: false,
                autoParams: false
            });
        });
        it('should call afterSave', (done) => {
            $ctrl.updateOption(options[key], data).then(() => {
                expect($ctrl.afterSave).toHaveBeenCalledWith(key, data);
                done();
            });
        });
    });
    describe('checkUpdateOption', () => {
        const msg = 'A filter with that name already exists. Do you wish to replace it.';
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'updateOption').and.callFake(() => {});
        });
        it('should translate the msg', () => {
            $ctrl.checkUpdateOption(options[key], data);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(msg);
        });
        it('should confirm', () => {
            $ctrl.checkUpdateOption(options[key], data);
            expect(modal.confirm).toHaveBeenCalledWith(msg);
        });
        it('should update the option', (done) => {
            $ctrl.checkUpdateOption(options[key], data).then(() => {
                expect($ctrl.updateOption).toHaveBeenCalledWith(options[key], data);
                done();
            });
        });
    });
    describe('afterSave', () => {
        it('should set the option in users service', () => {
            $ctrl.afterSave(key, data);
            expect(users.currentOptions[key].value).toEqual(data);
        });
    });
});