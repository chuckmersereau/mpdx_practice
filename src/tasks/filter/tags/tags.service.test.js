import service from './tags.service';

const tag = { name: 'a' };

describe('tasks.tags.service', () => {
    let tasksTags, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tasksTags_) => {
            rootScope = $rootScope;
            tasksTags = _tasksTags_;
        });
    });
    describe('addTag', () => {
        it('should add a tag to data', () => {
            tasksTags.data = [{ name: 'a' }];
            tasksTags.addTag({ tags: ['b'] });
            expect(tasksTags.data[1].name).toEqual('b');
        });
    });
    describe('tagClick', () => {
        beforeEach(() => {
            tasksTags.selectedTags = [];
            tasksTags.rejectedTags = [];
            spyOn(tasksTags, 'change').and.callFake(() => {});
        });
        it('should handle a selected tag', () => {
            tasksTags.selectedTags = [tag];
            tasksTags.tagClick(tag);
            expect(tasksTags.selectedTags).toEqual([]);
            expect(tasksTags.rejectedTags).toEqual([tag]);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
        it('should handle a rejected tag', () => {
            tasksTags.rejectedTags = [tag];
            tasksTags.tagClick(tag);
            expect(tasksTags.selectedTags).toEqual([]);
            expect(tasksTags.rejectedTags).toEqual([]);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
        it('should handle an unselected tag', () => {
            tasksTags.tagClick(tag);
            expect(tasksTags.selectedTags).toEqual([tag]);
            expect(tasksTags.rejectedTags).toEqual([]);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
    });
    describe('selectTag', () => {
        const initialSelectedTag = { name: 'b' };
        const initialSelectedTag2 = { name: 'c' };
        beforeEach(() => {
            tasksTags.selectedTags = [initialSelectedTag, initialSelectedTag2];
            tasksTags.rejectedTags = [tag];
            spyOn(tasksTags, 'change').and.callFake(() => {});
        });
        it('should select tag', () => {
            tasksTags.selectTag(tag);
            expect(tasksTags.selectedTags).toEqual([initialSelectedTag, initialSelectedTag2, tag]);
        });
        it('should deselect tag from reject list', () => {
            tasksTags.selectTag(tag);
            expect(tasksTags.rejectedTags).toEqual([]);
        });
        it('should call change', () => {
            tasksTags.selectTag(tag);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
    });
    describe('rejectTag', () => {
        beforeEach(() => {
            tasksTags.rejectedTags = [];
            tasksTags.selectedTags = [tag];
            spyOn(tasksTags, 'change').and.callFake(() => {});
        });
        it('should reject tag', () => {
            tasksTags.rejectTag(tag);
            expect(tasksTags.rejectedTags).toEqual([tag]);
        });
        it('should deselect tag from selected list', () => {
            tasksTags.rejectTag(tag);
            expect(tasksTags.selectedTags).toEqual([]);
        });
        it('should call change', () => {
            tasksTags.rejectTag(tag);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
    });
    describe('removeFromRejected', () => {
        beforeEach(() => {
            spyOn(tasksTags, 'change').and.callFake(() => {});
            tasksTags.rejectedTags = [tag];
        });
        it('should remove tag from rejected list', () => {
            tasksTags.removeFromRejected(tag);
            expect(tasksTags.rejectedTags).toEqual([]);
        });
        it('should call change', () => {
            tasksTags.removeFromRejected(tag);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
    });
    describe('removeFromSelected', () => {
        beforeEach(() => {
            spyOn(tasksTags, 'change').and.callFake(() => {});
            tasksTags.selectedTags = [tag];
        });
        it('should remove tag from rejected list', () => {
            tasksTags.removeFromSelected(tag);
            expect(tasksTags.selectedTags).toEqual([]);
        });
        it('should call change', () => {
            tasksTags.removeFromSelected(tag);
            expect(tasksTags.change).toHaveBeenCalledWith();
        });
    });
    describe('change', () => {
        it('should emit tasksTagsChange', () => {
            spyOn(rootScope, '$emit').and.callFake(() => {});
            tasksTags.change();
            expect(rootScope.$emit).toHaveBeenCalledWith('tasksTagsChanged');
        });
    });
});
