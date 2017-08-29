import component from './language.component';

describe('preferences.personal.language.component', () => {
    let $ctrl, language, rootScope, scope, componentController, transitions, serverConstants, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _language_, _users_, _serverConstants_, $transitions) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            language = _language_;
            users = _users_;
            serverConstants = _serverConstants_;
            transitions = $transitions;
            componentController = $componentController;
            serverConstants.data = { languages: { 'en-us': 'US English', 'fr-fr': 'French' } };
            users.current = { preferences: { locale: 'en' } };
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController(
            'preferencesPersonalLanguage',
            { $scope: scope },
            { onSave: () => Promise.resolve() });
    }
    describe('$onInit', () => {
        it('should set the handler for moving away', () => {
            spyOn(transitions, 'onBefore').and.callThrough();
            $ctrl.$onInit();
            expect($ctrl.deregisterTransitionHook).toBeDefined();
            expect(transitions.onBefore).toHaveBeenCalledWith({
                from: 'preferences.personal',
                to: jasmine.any(Function)
            }, jasmine.any(Function));
        });
    });
    describe('$onChanges', () => {
        it('should default', () => {
            users.current.preferences.locale = null;
            $ctrl.$onChanges();
            expect(users.current.preferences.locale).toEqual('en-us');
        });
        it('should handle a valid language', () => {
            users.current.preferences.locale = 'fr-fr';
            $ctrl.$onChanges();
            expect(users.current.preferences.locale).toEqual('fr-fr');
        });
        it('should remap languages', () => {
            users.current.preferences.locale = 'fr-fr';
            $ctrl.$onChanges();
            expect($ctrl.languages).toEqual([{ alias: 'en-us', value: 'US English' }, { alias: 'fr-fr', value: 'French' }]);
        });
        it('should set lastLanguage', () => {
            $ctrl.$onChanges();
            expect($ctrl.lastLanguage).toEqual('en-us');
        });
    });
    describe('save', () => {
        it('should set saving flag', () => {
            spyOn($ctrl, 'onSave').and.callThrough();
            $ctrl.save();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should save', () => {
            spyOn($ctrl, 'onSave').and.callThrough();
            $ctrl.save();
            expect($ctrl.onSave).toHaveBeenCalledWith();
        });
        it('should unset saving flag', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should unset saving flag on reject', (done) => {
            spyOn($ctrl, 'onSave').and.callFake(() => Promise.reject());
            $ctrl.save().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should set lastLanguage', (done) => {
            users.current.preferences.locale = 'fr';
            $ctrl.save().then(() => {
                expect($ctrl.lastLanguage).toEqual('fr');
                done();
            });
        });
    });
    describe('setLanguage', () => {
        beforeEach(() => {
            spyOn(language, 'change').and.callFake(() => {});
        });
        it('should change language', () => {
            users.current.preferences.locale = 'en';
            $ctrl.setLanguage();
            expect(language.change).toHaveBeenCalledWith('en');
        });
        describe('listOnly', () => {
            beforeEach(() => {
                $ctrl = componentController(
                    'preferencesPersonalLanguage',
                    { $scope: scope },
                    {
                        onSave: () => Promise.resolve(),
                        listOnly: true
                    });
                spyOn(users, 'saveCurrent').and.callThrough();
            });

            it('should call users.saveCurrent', () => {
                $ctrl.setLanguage();
                expect(users.saveCurrent).toHaveBeenCalled();
            });
        });
    });
    describe('revertLanguage', () => {
        beforeEach(() => {
            $ctrl.lastLanguage = 'en';
            spyOn($ctrl, 'setLanguage').and.callFake(() => {});
        });
        it('should change language', () => {
            users.current.preferences.locale = 'fr';
            $ctrl.revertLanguage();
            expect($ctrl.setLanguage).toHaveBeenCalledWith();
            expect(users.current.preferences.locale).toEqual('en');
        });
    });
    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should destroy the deregisterTransitionHook', () => {
            spyOn($ctrl, 'deregisterTransitionHook').and.callFake(() => {});
            $ctrl.$onDestroy();
            scope.$digest();
            expect($ctrl.deregisterTransitionHook).toHaveBeenCalledWith();
        });
    });
});
