import service from './status.service';

let components = [
    {
        name: 'API',
        id: 'yfxbt71g60d2',
        group_id: null
    },
    {
        name: 'Third Party Services',
        id: '7k8vx68q4t8q',
        group_id: null
    },
    {
        name: 'Google Apps Gmail',
        id: 'wpc53jwl06zp',
        group_id: '7k8vx68q4t8q'
    }
];

let processedComponents = {
    'yfxbt71g60d2': {
        name: 'API',
        id: 'yfxbt71g60d2',
        group_id: null,
        children: []
    },
    '7k8vx68q4t8q': {
        name: 'Third Party Services',
        id: '7k8vx68q4t8q',
        group_id: null,
        children: [
            {
                name: 'Google Apps Gmail',
                id: 'wpc53jwl06zp',
                group_id: '7k8vx68q4t8q',
                children: []
            }
        ]
    }
};

const path = 'https://7j1jhswhjws0.statuspage.io/api/v2/summary.json';

describe('bottom.status.service', () => {
    let http, statusPage, q, rootScope;

    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $httpBackend, $http, _statusPage_, $q, $rootScope
        ) => {
            $httpBackend.whenGET(path).respond({ data: { components: components } });
            http = $http;
            statusPage = _statusPage_;
            q = $q;
            rootScope = $rootScope;
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(http, 'get').and.callFake(() => q.resolve({ data: { components: components } }));
        });

        it('should setup timeout', () => {
            spyOn(statusPage, '$timeout').and.returnValue('');
            statusPage.load();
            expect(statusPage.$timeout).toHaveBeenCalledWith(jasmine.any(Function), 600000);
        });

        it('should call load after 600000ms', () => {
            statusPage.load();
            spyOn(statusPage, 'load').and.callFake(() => q.resolve());
            statusPage.$timeout.flush();
            expect(statusPage.load).toHaveBeenCalled();
        });

        it('should call the statuspage api', () => {
            statusPage.load();
            expect(http.get).toHaveBeenCalledWith(path);
        });

        it('should return promise', () => {
            expect(statusPage.load()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should return processed data', (done) => {
                statusPage.load().then(() => {
                    expect(statusPage.data).toEqual({ components: processedComponents });
                    done();
                });
                rootScope.$digest();
            });

            it('should call group components', (done) => {
                spyOn(statusPage, 'groupComponents').and.returnValue('');
                statusPage.load().then(() => {
                    expect(statusPage.groupComponents).toHaveBeenCalledWith(components);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('groupComponents', () => {
        it('should process components', () => {
            expect(statusPage.groupComponents(components)).toEqual(processedComponents);
        });
    });
});
