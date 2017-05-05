import component from './tasks.component';
import assign from 'lodash/fp/assign';

const currentContact = {id: 1};
describe('contacts.show.tasks.component', () => {
    let $ctrl, contacts, tasksFilter, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _tasksFilter_) => {
            scope = $rootScope.$new();
            contacts = _contacts_;
            tasksFilter = _tasksFilter_;
            contacts.current = currentContact;
            $ctrl = $componentController('contactTasks', {$scope: scope}, {});
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(tasksFilter, 'assignDefaultParamsAndGroup').and.callThrough();
            spyOn(tasksFilter, 'change').and.returnValue('');
            $ctrl.$onInit();
        });
        it('should reset task Filters', () => {
            expect(tasksFilter.params).toEqual(assign(tasksFilter.defaultParams, { contact_ids: currentContact.id }));
            expect(tasksFilter.assignDefaultParamsAndGroup).toHaveBeenCalledWith('all');
            expect(tasksFilter.change).toHaveBeenCalled();
        });
    });
});
