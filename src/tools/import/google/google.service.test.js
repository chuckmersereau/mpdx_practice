import service from './google.service';

describe('tools.import.csv.service', () => {
    let api, importGoogle;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _importGoogle_) => {
            api = _api_;
            importGoogle = _importGoogle_;
            api.account_list_id = 'account_list_id';
        });
    });

    describe('save', () => {
        const data = {
            tag_list: ['tag_1', 'tag_2'],
            group_tags: { test_1: ['tag_1', 'tag_2'], test_2: ['tag_3', 'tag_4'] }
        };

        const transformedData = {
            tag_list: 'tag_1,tag_2',
            group_tags: { test_1: 'tag_1,tag_2', test_2: 'tag_3,tag_4' }

        };

        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(importGoogle.save(data)).toEqual(jasmine.any(Promise));
        });

        it('should call the api', () => {
            importGoogle.save(data);
            expect(api.post).toHaveBeenCalledWith({
                url: `account_lists/${api.account_list_id}/imports/google`,
                data: transformedData,
                type: 'imports'
            });
        });
    });
});