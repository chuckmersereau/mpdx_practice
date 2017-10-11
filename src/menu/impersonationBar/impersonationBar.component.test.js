// $window usage causes 'Script Error' in Unit tests

// import component from './impersonationBar.component';
//
// describe('menu.impersonationBar.component', () => {
//     let $ctrl, scope, users, window;
//     beforeEach(() => {
//         angular.mock.module(component);
//         inject(($componentController, $rootScope, _users_, $window) => {
//             scope = $rootScope.$new();
//             users = _users_;
//             window = $window;
//             users.current = {
//                 first_name: 'a',
//                 last_name: 'b'
//             };
//             $ctrl = $componentController('impersonationBar', {$scope: scope}, {});
//         });
//     });
//
//     describe('$onInit', () => {
//         it('should initially be null', () => {
//             window.localStorage.removeItem('impersonator');
//             $ctrl.$onInit();
//             expect($ctrl.impersonator).toEqual(null);
//         });
//         it('should get the impersonator', () => {
//             window.localStorage.setItem('impersonator', '1234');
//             spyOn(window.localStorage, 'getItem').and.callThrough();
//             $ctrl.$onInit();
//             expect(window.localStorage.getItem).toHaveBeenCalledWith('impersonator');
//             expect($ctrl.impersonator).toEqual('1234');
//         });
//         it('should get the impersonated users name', () => {
//             $ctrl.$onInit();
//             expect($ctrl.impersonated).toEqual('a b');
//         });
//     });
//
//     describe('logout', () => {
//         beforeEach(() => {
//             window.localStorage.setItem('impersonatorToken', '1234');
//             spyOn($ctrl, 'redirectHome').and.callFake(() => {});
//         });
//         it('should grab the original token', () => {
//             spyOn(window.localStorage, 'getItem').and.callThrough();
//             $ctrl.logout();
//             expect(window.localStorage.getItem).toHaveBeenCalledWith('impersonatorToken');
//             expect(window.localStorage.getItem('token')).toEqual('1234');
//         });
//         it('should remove the impersonator', () => {
//             $ctrl.logout();
//             expect(window.localStorage.getItem('impersonator')).toEqual(null);
//             expect(window.localStorage.getItem('impersonatorToken')).toEqual(null);
//         });
//         it('should redirect to home', () => {
//             $ctrl.logout();
//             expect($ctrl.redirectHome).toHaveBeenCalledWith();
//         });
//     });
// });
