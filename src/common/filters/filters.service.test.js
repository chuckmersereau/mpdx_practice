import service from './filters.service';

describe('contacts.service', () => {
    let filters;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_filters_) => {
            filters = _filters_;
        });
    });
    describe('invertMultiselect', () => {
        describe('status filters', () => {
            const statusFilter = { name: 'status', options: [{ id: 'a' }, { id: 'b' }] };
            const contactStatusFilter = { name: 'contact_status', options: [{ id: 'a' }, { id: 'b' }] };
            it('should return hidden if active or none', () => {
                expect(filters.invertMultiselect(statusFilter, { status: 'active' })).toEqual(['hidden']);
                expect(filters.invertMultiselect(statusFilter, { status: 'null' })).toEqual(['hidden']);
                expect(filters.invertMultiselect(contactStatusFilter, { contact_status: 'active' })).toEqual(['hidden']);
                expect(filters.invertMultiselect(contactStatusFilter, { contact_status: 'null' })).toEqual(['hidden']);
            });
            it('should return any/all if hidden', () => {
                expect(filters.invertMultiselect(statusFilter, { status: 'hidden' })).toEqual(['']);
                expect(filters.invertMultiselect(contactStatusFilter, { contact_status: 'hidden' })).toEqual(['']);
            });
            it('should handle normally w/o groupings', () => {
                expect(filters.invertMultiselect(statusFilter, { status: 'a' })).toEqual(['b']);
                expect(filters.invertMultiselect(contactStatusFilter, { contact_status: 'a' })).toEqual(['b']);
            });
        });
        it('should return empty if params match filter', () => {
            const filter = { name: 'notStatus', options: [{ id: 'a' }, { id: 'b' }] };
            const params = { notStatus: 'a, b' };
            expect(filters.invertMultiselect(filter, params)).toEqual(['']);
        });
        it('should exclude groupings when inverting', () => {
            const filter = { name: 'notStatus', options: [{ id: 'a' }, { id: 'b' }] };
            const params = { notStatus: 'a,' };
            expect(filters.invertMultiselect(filter, params)).toEqual(['b']);
        });
    });
});