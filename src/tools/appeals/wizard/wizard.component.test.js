import component from './wizard.component';
import moment from 'moment';

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
    describe('buildExclusionFilter', () => {
        let today, oneMonthAgo, twoMonthsAgo, threeMonthsAgo;
        beforeEach(() => {
            today = moment().format('YYYY-MM-DD');
            oneMonthAgo = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD');
            twoMonthsAgo = moment().startOf('month').subtract(2, 'months').format('YYYY-MM-DD');
            threeMonthsAgo = moment().startOf('month').subtract(3, 'months').format('YYYY-MM-DD');
        });
        it('should return empty object', () => {
            expect($ctrl.buildExclusionFilter()).toEqual({});
        });
        it('should return all filters', () => {
            $ctrl.excludes
                = ['joinedTeam3months',
                    'specialGift3months',
                    'increasedGiving3months',
                    'stoppedGiving2months',
                    'doNotAskAppeals'];

            expect($ctrl.buildExclusionFilter()).toEqual({
                started_giving_range: `${threeMonthsAgo}..${today}`,
                gave_more_than_pledged_range: `${threeMonthsAgo}..${today}`,
                pledge_amount_increased_range: `${threeMonthsAgo}..${today}`,
                stopped_giving_range: `${twoMonthsAgo}..${oneMonthAgo}`,
                no_appeals: true
            });
        });
        describe('joinedTeam3months', () => {
            beforeEach(() => {
                $ctrl.excludes = ['joinedTeam3months'];
            });
            it('should return with started_giving_range value', () => {
                expect($ctrl.buildExclusionFilter()).toEqual({
                    started_giving_range: `${threeMonthsAgo}..${today}`
                });
            });
        });
        describe('specialGift3months', () => {
            beforeEach(() => {
                $ctrl.excludes = ['specialGift3months'];
            });
            it('should return with gave_more_than_pledged_range value', () => {
                expect($ctrl.buildExclusionFilter()).toEqual({
                    gave_more_than_pledged_range: `${threeMonthsAgo}..${today}`
                });
            });
        });
        describe('increasedGiving3months', () => {
            beforeEach(() => {
                $ctrl.excludes = ['increasedGiving3months'];
            });
            it('should return with pledge_amount_increased_range value', () => {
                expect($ctrl.buildExclusionFilter()).toEqual({
                    pledge_amount_increased_range: `${threeMonthsAgo}..${today}`
                });
            });
        });
        describe('stoppedGiving2months', () => {
            beforeEach(() => {
                $ctrl.excludes = ['stoppedGiving2months'];
            });
            it('should return with stopped_giving_range value', () => {
                expect($ctrl.buildExclusionFilter()).toEqual({
                    stopped_giving_range: `${twoMonthsAgo}..${oneMonthAgo}`
                });
            });
        });
        describe('doNotAskAppeals', () => {
            beforeEach(() => {
                $ctrl.excludes = ['doNotAskAppeals'];
            });
            it('should return with no_appeals value', () => {
                expect($ctrl.buildExclusionFilter()).toEqual({
                    no_appeals: true
                });
            });
        });
    });
});
