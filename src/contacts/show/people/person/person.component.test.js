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
        $ctrl = componentController('contactPerson', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.translatedLocations).toEqual({
                home: 'Home',
                mobile: 'Mobile',
                work: 'Work',
                fax: 'Fax',
                other: 'Other'
            });
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
                'person_id'
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
