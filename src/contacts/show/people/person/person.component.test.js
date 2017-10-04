import component from './person.component';

describe('contacts.show.person.component', () => {
    let $ctrl, rootScope, sce, scope, componentController, people;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $sce, _people_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            sce = $sce;
            people = _people_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactPerson', { $scope: scope }, { userProfile: 'true' });
    }

    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.translatedLocations).toEqual({
                fax: 'Fax',
                home: 'Home',
                mobile: 'Mobile',
                other: 'Other',
                personal: 'Personal',
                work: 'Work'
            });
        });
    });

    describe('events', () => {
        beforeEach(() => $ctrl.$onInit());

        it('should handle personCreated', () => {
            spyOn(people, 'get').and.callFake(() => Promise.resolve({ id: 123 }));
            $ctrl.person = { id: 123 };
            rootScope.$emit('personUpdated', 123);
            expect(people.get).toHaveBeenCalledWith(123);
        });

        it('should handle peopleMerged', () => {
            spyOn(people, 'get').and.callFake(() => Promise.resolve({ id: 123 }));
            $ctrl.person = { id: 123 };
            rootScope.$emit('peopleMerged', 123, [234]);
            expect(people.get).toHaveBeenCalledWith(123);
        });

        describe('person is not being updated or merged', () => {
            it('should handle personCreated', () => {
                spyOn(people, 'get');
                $ctrl.person = { id: 456 };
                rootScope.$emit('personUpdated', 123);
                expect(people.get).not.toHaveBeenCalledWith(123);
            });

            it('should handle peopleMerged', () => {
                spyOn(people, 'get');
                $ctrl.person = { id: 456 };
                rootScope.$emit('peopleMerged', 123, [234]);
                expect(people.get).not.toHaveBeenCalledWith(123);
            });
        });
    });

    describe('$onDestroy', () => {
        it('should destroy watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher1');
            spyOn($ctrl, 'watcher2');
            $ctrl.$onDestroy();
            expect($ctrl.watcher1).toHaveBeenCalled();
            expect($ctrl.watcher2).toHaveBeenCalled();
        });
    });

    describe('openModal', () => {
        beforeEach(() => {
            spyOn(people, 'openPeopleModal').and.callFake(() => Promise.resolve());
            $ctrl.contact = { id: 'contact_id' };
            $ctrl.person = { id: 'person_id' };
        });

        it('should call people.openPeopleModal', () => {
            $ctrl.openModal();
            expect(people.openPeopleModal).toHaveBeenCalledWith(
                { id: 'contact_id' },
                'person_id',
                'true'
            );
        });

        it('should return promise', () => {
            expect($ctrl.openModal()).toEqual(jasmine.any(Promise));
        });
    });

    describe('selectCard', () => {
        beforeEach(() => {
            $ctrl.onSelectPerson = () => {};
            spyOn($ctrl, 'onSelectPerson').and.callFake(() => Promise.resolve());
            $ctrl.person = { id: 'person_id' };
        });

        it('should not call onSelectPerson', () => {
            $ctrl.selectCard();
            expect($ctrl.onSelectPerson).not.toHaveBeenCalledWith({
                person: { id: 'person_id' }
            });
        });

        describe('merging', () => {
            beforeEach(() => {
                $ctrl.isMerging = true;
            });

            it('should call onSelectPerson', () => {
                $ctrl.selectCard();
                expect($ctrl.onSelectPerson).toHaveBeenCalledWith({
                    person: { id: 'person_id' }
                });
            });
        });
    });

    describe('trustSrc', () => {
        beforeEach(() => {
            spyOn(sce, 'trustAsResourceUrl').and.callFake(() => Promise.resolve());
        });

        it('should call sce.trustAsResourceUrl', () => {
            $ctrl.trustSrc('http://www.cru.org/');
            expect(sce.trustAsResourceUrl).toHaveBeenCalledWith(
                'http://www.cru.org/'
            );
        });

        it('should return promise', () => {
            expect($ctrl.trustSrc('http://www.cru.org/')).toEqual(jasmine.any(Promise));
        });
    });

    describe('updateAvatar', () => {
        beforeEach(() => {
            spyOn(people, 'updateAvatar').and.callFake(() => Promise.resolve());
        });

        it('should call people.updateAvatar', () => {
            $ctrl.person = { id: 'person_id' };
            $ctrl.updateAvatar({ id: 'avatar_id' });
            expect(people.updateAvatar).toHaveBeenCalledWith(
                { id: 'person_id' },
                { id: 'avatar_id' }
            );
        });

        it('should return promise', () => {
            expect($ctrl.updateAvatar({ id: 'avatar_id' })).toEqual(jasmine.any(Promise));
        });
    });
});
