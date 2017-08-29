import service from './people.service';

describe('tools.merge.people.service', () => {
    let mergePeople, api, rootScope, q;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($q, $rootScope, _mergePeople_, _api_) => {
            q = $q;
            rootScope = $rootScope;
            mergePeople = _mergePeople_;
            api = _api_;
            api.account_list_id = 123;
        });
    });
    describe('load', () => {
        it('should cache', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            mergePeople.duplicates = [{ id: 1 }, { id: 2 }];
            mergePeople.load().then(() => {
                expect(mergePeople.duplicates).toEqual([{ id: 1 }, { id: 2 }]);
                expect(api.get).not.toHaveBeenCalled();
                done();
            });
            rootScope.$apply();
        });
    });
    describe('ignore', () => {
        it('should build and execute an array of api deletes', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            mergePeople.ignore([{ id: 1 }, { id: 2 }]).then(() => {
                expect(api.delete).toHaveBeenCalledWith({ url: 'contacts/people/duplicates/1', type: 'people' });
                expect(api.delete).toHaveBeenCalledWith({ url: 'contacts/people/duplicates/2', type: 'people' });
                done();
            });
            rootScope.$apply();
        });
    });
    describe('confirm', () => {
        it('should build and execute an array of Promises', (done) => {
            spyOn(mergePeople, 'getPeopleToMergePromise').and.callFake(() => [q.resolve('a')]);
            spyOn(mergePeople, 'getPeopleToIgnorePromise').and.callFake(() => [q.resolve('b')]);
            spyOn(mergePeople, 'load').and.callFake(() => [q.resolve('c')]);
            mergePeople.confirm().then(() => {
                expect(mergePeople.load).toHaveBeenCalledWith(true);
                done();
            });
            rootScope.$apply();
            expect(mergePeople.getPeopleToMergePromise).toHaveBeenCalledWith();
            expect(mergePeople.getPeopleToIgnorePromise).toHaveBeenCalledWith();
        });
    });
    describe('getPeopleToIgnorePromise', () => {
        it('should get a list of people to ignore', () => {
            spyOn(mergePeople, 'ignore').and.callFake((data) => data);
            mergePeople.duplicates = [{ id: 1, mergeChoice: 1 }, { id: 2, mergeChoice: 2 }];
            expect(mergePeople.getPeopleToIgnorePromise()).toEqual([[{ id: 2, mergeChoice: 2 }]]);
            expect(mergePeople.ignore).toHaveBeenCalledWith([{ id: 2, mergeChoice: 2 }]);
        });
        it('should return empty array if none to ignore', () => {
            spyOn(mergePeople, 'ignore').and.callFake((data) => data);
            mergePeople.duplicates = [{ id: 1, mergeChoice: 1 }, { id: 2, mergeChoice: 1 }];
            expect(mergePeople.getPeopleToIgnorePromise()).toEqual([]);
            expect(mergePeople.ignore).not.toHaveBeenCalled();
        });
    });
    describe('getPeopleToMergePromise', () => {
        it('should get a list of people to merge', () => {
            spyOn(mergePeople, 'merge').and.callFake((data) => data);
            mergePeople.duplicates = [{ id: 1, mergeChoice: 1 }, { id: 2, mergeChoice: 0 }];
            expect(mergePeople.getPeopleToMergePromise()).toEqual([[
                { id: 1, mergeChoice: 1 },
                { id: 2, mergeChoice: 0 }
            ]]);
            expect(mergePeople.merge).toHaveBeenCalledWith([{ id: 1, mergeChoice: 1 }, { id: 2, mergeChoice: 0 }]);
        });
        it('should return empty array if none to ignore', () => {
            spyOn(mergePeople, 'merge').and.callFake((data) => data);
            mergePeople.duplicates = [{ id: 1, mergeChoice: 2 }, { id: 2, mergeChoice: 2 }];
            expect(mergePeople.getPeopleToMergePromise()).toEqual([]);
            expect(mergePeople.merge).not.toHaveBeenCalled();
        });
    });
});
