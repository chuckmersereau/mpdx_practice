import component from './dropdown.component';

const param = { size: '10' };
const option = { value: param.size };

describe('common.pagination.dropdown.component', () => {
    let $ctrl, rootScope, scope, componentController, users;

    function loadController() {
        $ctrl = componentController('paginationDropdown', { $scope: scope }, {
            onChange: () => {}
        });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            users = _users_;
            componentController = $componentController;
            loadController();
        });
    });

    describe('constructor', () => {
        it('should set the model to moment of the ngModel param', () => {
            expect($ctrl.values).toEqual(['10', '25', '50', '100', '250', '500']);
        });
    });

    describe('change', () => {
        beforeEach(() => {
            spyOn($ctrl, 'saveIfExists').and.callFake(() => {});
            spyOn($ctrl, 'onChange').and.callFake(() => {});
        });

        it('should save the Option', () => {
            $ctrl.change(param);
            expect($ctrl.saveIfExists).toHaveBeenCalledWith(param.size);
        });

        it('should call onChange', () => {
            $ctrl.change(param);
            expect($ctrl.onChange).toHaveBeenCalledWith(param);
        });
    });

    describe('saveIfExists', () => {
        beforeEach(() => {
            spyOn($ctrl, 'saveOption').and.callFake(() => {});
            $ctrl.userOption = 'contacts';
        });

        it('should return if no option defined', () => {
            $ctrl.userOption = undefined;
            expect($ctrl.saveIfExists('10')).toBeUndefined();
            expect($ctrl.saveOption).not.toHaveBeenCalled();
        });

        it('should call saveOption', () => {
            $ctrl.change(param);
            expect($ctrl.saveOption).toHaveBeenCalledWith(param.size);
        });
    });

    describe('saveOption', () => {
        beforeEach(() => {
            spyOn(users, 'saveOption').and.callFake(() => {});
            $ctrl.userOption = 'contacts';
        });

        it('should call saveOption', () => {
            users.currentOptions = {};
            $ctrl.change(param);
            expect(users.saveOption).toHaveBeenCalledWith('page_size_contacts', param.size);
        });
    });
});
