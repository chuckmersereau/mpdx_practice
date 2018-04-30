import component from './upload.component';

describe('tools.import.csv.upload.component', () => {
    let $ctrl, rootScope, scope, componentController, serverConstants;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _serverConstants_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            serverConstants = _serverConstants_;
            componentController = $componentController;
            serverConstants.data = {
                csv_import: {
                    max_file_size_in_bytes: 512000000
                }
            };
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('importCsvUpload', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.maxSize).toEqual(512000000);
            expect($ctrl.maxSizeInMB).toEqual(512);
        });
    });
});