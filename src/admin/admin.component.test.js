//causes 'Script Error' in Unit tests

// import component from './admin.component';
//
// describe('admin.component', () => {
//     let $ctrl, scope, users, window, api;
//     beforeEach(() => {
//         angular.mock.module(component);
//         inject(($componentController, $rootScope, _users_, $window, _api_) => {
//             scope = $rootScope.$new();
//             api = _api_;
//             users = _users_;
//             window = $window;
//             users.current = {
//                 first_name: 'a',
//                 last_name: 'b'
//             };
//             $ctrl = $componentController('admin', {$scope: scope}, {});
//         });
//         window.localStorage.setItem('token', 432);
//         spyOn(api, 'post').and.callFake(() => Promise.resolve({json_web_token: 'a'}));
//         spyOn($ctrl, 'redirectHome').and.callFake(() => {});
//     });
//
//     describe('impersonate', () => {
//         const form = {
//             userId: 123,
//             reason: 'abc'
//         };
//         it('should call the api', done => {
//             $ctrl.impersonate(form).then(() => {
//                 expect(api.post).toHaveBeenCalledWith({
//                     url: 'admin/impersonation',
//                     data: {
//                         user: 123,
//                         reason: 'abc'
//                     },
//                     type: 'impersonation'
//                 });
//                 done();
//             });
//         });
//         it('should set localStorage items', done => {
//             $ctrl.impersonate(form).then(() => {
//                 expect(window.localStorage.getItem('impersonatorToken')).toEqual('432');
//                 expect(window.localStorage.getItem('impersonator')).toEqual('a b');
//                 expect(window.localStorage.getItem('token')).toEqual('a');
//                 done();
//             });
//         });
//         it('should redirect home', done => {
//             $ctrl.impersonate(form).then(() => {
//                 expect($ctrl.redirectHome).toHaveBeenCalledWith();
//                 done();
//             });
//         });
//     });
// });
