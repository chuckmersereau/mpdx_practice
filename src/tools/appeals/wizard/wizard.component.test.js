import component from './wizard.component';

describe('tools.appeals.wizard.component', () => {
    let $ctrl, scope, serverConstants, contactsTags, state;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contactsTags_, _serverConstants_, $state) => {
            scope = $rootScope.$new();
            contactsTags = _contactsTags_;
            serverConstants = _serverConstants_;
            state = $state;
            $ctrl = $componentController('appealsWizard', { $scope: scope }, {});
        });
        serverConstants.data = {
            status_hashes: [
                { id: 'a' },
                { id: 'b' }
            ]
        };
        contactsTags.data = [
            { name: 'b' },
            { name: 'c' }
        ];
    });

    describe('$onInit', () => {
        it('should call init', () => {
            spyOn($ctrl, 'init').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.init).toHaveBeenCalledWith();
        });
    });
    describe('init', () => {
        beforeEach(() => {
            spyOn($ctrl, 'calculateGoal').and.callFake(() => {});
        });
        it('should reset class objects', () => {
            $ctrl.init();
            expect($ctrl.appeal).toEqual({});
            expect($ctrl.statuses).toEqual([]);
            expect($ctrl.tags).toEqual([]);
            expect($ctrl.excludes).toEqual([]);
        });
        it('should build the goal object', () => {
            $ctrl.init();
            expect($ctrl.goal).toEqual({
                initial: 0,
                letterCost: 0,
                adminPercent: 12
            });
        });
        it('should call calculateGoal', () => {
            $ctrl.init();
            expect($ctrl.calculateGoal).toHaveBeenCalledWith();
        });
    });
    describe('calculateGoal', () => {
        it('should correctly calculate the goal $', () => {
            $ctrl.$onInit();
            $ctrl.goal.initial = 5;
            $ctrl.goal.letterCost = 5;
            $ctrl.goal.adminPercent = 12;
            $ctrl.calculateGoal();
            expect($ctrl.appeal.amount).toEqual(11.2);
        });
    });
    describe('selectAllStatuses', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should select all contact statuses if blank', () => {
            $ctrl.selectAllStatuses();
            expect($ctrl.statuses).toEqual(['a', 'b']);
        });
        it('should select all contact statuses if less than all', () => {
            $ctrl.appeal.statuses = ['a'];
            $ctrl.selectAllStatuses();
            expect($ctrl.statuses).toEqual(['a', 'b']);
        });
        it('should deselect all contact statuses all selected', () => {
            $ctrl.statuses = ['a', 'b'];
            $ctrl.selectAllStatuses();
            expect($ctrl.statuses).toEqual([]);
        });
    });
    describe('selectAllTags', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should select all contact statuses if blank', () => {
            $ctrl.selectAllTags();
            expect($ctrl.tags).toEqual(['b', 'c']);
        });
        it('should select all contact statuses if less than all', () => {
            $ctrl.tags = ['b'];
            $ctrl.selectAllTags();
            expect($ctrl.tags).toEqual(['b', 'c']);
        });
        it('should deselect all contact statuses all selected', () => {
            $ctrl.tags = ['b', 'c'];
            $ctrl.selectAllTags();
            expect($ctrl.tags).toEqual([]);
        });
    });
    describe('save', () => {
        const form = { // default for testing
            $setUntouched: () => {},
            $setPristine: () => {}
        };
        beforeEach(() => {
            spyOn(form, '$setUntouched').and.callThrough();
            spyOn(form, '$setPristine').and.callThrough();
            $ctrl.appeal = {};
            spyOn($ctrl, 'init').and.callFake(() => {});
        });
        it('should set saving to true', () => {
            spyOn($ctrl, 'create').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect($ctrl.saving).toEqual(true);
        });
        it('should call create', () => {
            spyOn($ctrl, 'create').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect($ctrl.create).toHaveBeenCalledWith($ctrl.appeal);
        });
        it('should change state', (done) => {
            spyOn($ctrl, 'create').and.callFake(() => Promise.resolve({ id: 1 }));
            spyOn(state, 'go').and.callFake(() => {});
            $ctrl.save(form).then(() => {
                expect(state.go).toHaveBeenCalledWith('tools.appeals.show', { appealId: 1 });
                done();
            });
        });
        it('should reset saving', (done) => {
            spyOn($ctrl, 'create').and.callFake(() => Promise.resolve({ id: 1 }));
            $ctrl.save(form).then(() => {
                expect($ctrl.saving).toEqual(false);
                done();
            });
        });
        it('should reset saving', (done) => {
            spyOn($ctrl, 'create').and.callFake(() => Promise.reject());
            $ctrl.save(form).catch(() => {
                expect($ctrl.saving).toEqual(false);
                done();
            });
        });
    });
});
