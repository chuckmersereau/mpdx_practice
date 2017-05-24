import contributionsController from './contributions.component';
import moment from 'moment';

describe('reports.contributions.component', () => {
    let $ctrl, rootScope, scope, contributions, componentController;
    beforeEach(() => {
        angular.mock.module(contributionsController);
        inject(($componentController, $rootScope, _contributions_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contributions = _contributions_;
            componentController = $componentController;
            $ctrl = componentController('contributions', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.data).toEqual({});
            expect($ctrl.expanded).toBeFalsy();
            expect($ctrl.loading).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake((data) => Promise.resolve(data));
        });

        it('should call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('events', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake((data) => Promise.resolve(data));
        });

        it('will reload on accountListUpdated', () => {
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(contributions, 'load').and.callFake(() => Promise.resolve({ mock: 'data' }));
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toBeTruthy();
        });

        it('should return a promise', () => {
            $ctrl.loading = false;
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toBeFalsy();
                    done();
                });
            });

            it('should set data', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.data).toEqual({ mock: 'data' });
                    done();
                });
            });
        });

        describe('type is salary', () => {
            beforeEach(() => {
                $ctrl = componentController('contributions', { $scope: scope }, { type: 'salary' });
            });

            it('should call load', () => {
                $ctrl.load();
                expect(contributions.load).toHaveBeenCalledWith('salary');
            });
        });

        describe('type is donor', () => {
            beforeEach(() => {
                $ctrl = componentController('contributions', { $scope: scope }, { type: 'partner' });
            });

            it('should call load', () => {
                $ctrl.load();
                expect(contributions.load).toHaveBeenCalledWith('partner');
            });

            it('should return promise', () => {
                expect($ctrl.load()).toEqual(jasmine.any(Promise));
            });
        });
    });

    describe('percentage', () => {
        describe('total set > 0', () => {
            beforeEach(() => {
                $ctrl.data = { total: 150 };
            });

            describe('amount 0', () => {
                it('should return 0', () => {
                    expect($ctrl.percentage(0)).toEqual(0);
                });
            });

            describe('amount is divisible total', () => {
                it('should return amount / total * 100', () => {
                    expect($ctrl.percentage(125)).toEqual(125 / 150 * 100);
                });
            });
        });

        describe('total set === 0', () => {
            beforeEach(() => {
                $ctrl.data = { total: 0 };
            });

            describe('amount 0', () => {
                it('should return NaN', () => {
                    expect($ctrl.percentage(0)).toEqual(NaN);
                });
            });

            describe('amount is infinitely divisble by total', () => {
                it('should return amount / total * 100', () => {
                    expect($ctrl.percentage(125)).toEqual(NaN);
                });
            });
        });

        describe('total not set', () => {
            beforeEach(() => {
                $ctrl.data = { total: null };
            });

            describe('amount 0', () => {
                it('should return NaN', () => {
                    expect($ctrl.percentage(0)).toEqual(NaN);
                });
            });

            describe('amount is infinitely divisble by total', () => {
                it('should return amount / total * 100', () => {
                    expect($ctrl.percentage(125)).toEqual(NaN);
                });
            });
        });

        describe('contributions not set', () => {
            describe('amount 0', () => {
                it('should return NaN', () => {
                    expect($ctrl.percentage(0)).toEqual(NaN);
                });
            });
        });
    });

    describe('toCSV', () => {
        beforeEach(() => {
            spyOn(contributions, 'toCSV').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.toCSV()).toEqual(jasmine.any(Promise));
        });

        it('should call contributions.toCSV with data', () => {
            $ctrl.data = { mock: 'data' };
            $ctrl.toCSV();
            expect(contributions.toCSV).toHaveBeenCalledWith({ mock: 'data' });
        });
    });

    describe('moment', () => {
        it('should return a moment object', () => {
            expect(moment.isMoment($ctrl.moment('05-12-2017'))).toBeTruthy();
        });
    });
});
