import service from './alerts.service';

describe('common.alerts.service', () => {
    let toaster, alerts, q;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_alerts_, _toaster_, $q) => {
            alerts = _alerts_;
            q = $q;
            toaster = _toaster_;
        });
        spyOn(toaster, 'pop').and.callFake(() => {});
    });

    describe('addAlert', () => {
        const message = 'Message';
        const type = 'danger';
        const displayTime = 10;
        describe('no message', () => {
            it('should not add a toast', () => {
                alerts.addAlert();
                expect(toaster.pop).not.toHaveBeenCalled();
            });
        });
        it('should add a success toast', () => {
            alerts.addAlert(message);
            expect(toaster.pop).toHaveBeenCalledWith({
                type: 'success',
                body: 'alert-template',
                bodyOutputType: 'directive',
                directiveData: {
                    error: message,
                    retryable: false,
                    type: 'success'
                },
                timeout: 1.5 * 1000,
                showCloseButton: true,
                clickHandler: jasmine.any(Function),
                onHideCallback: jasmine.any(Function)
            });
        });
        it('should add a "type" toast', () => {
            alerts.addAlert(message, type);
            expect(toaster.pop).toHaveBeenCalledWith({
                type: 'error',
                body: 'alert-template',
                bodyOutputType: 'directive',
                directiveData: {
                    error: message,
                    retryable: false,
                    type: 'error'
                },
                timeout: 1.5 * 1000,
                showCloseButton: true,
                clickHandler: jasmine.any(Function),
                onHideCallback: jasmine.any(Function)
            });
        });
        it('should change timeout', () => {
            alerts.addAlert(message, undefined, displayTime);
            expect(toaster.pop).toHaveBeenCalledWith({
                type: 'success',
                body: 'alert-template',
                bodyOutputType: 'directive',
                directiveData: {
                    error: message,
                    retryable: false,
                    type: 'success'
                },
                timeout: 10 * 1000,
                showCloseButton: true,
                clickHandler: jasmine.any(Function),
                onHideCallback: jasmine.any(Function)
            });
        });
        it('should return a promise', () => {
            expect(alerts.addAlert(message)).toEqual(jasmine.any(q));
        });
    });
});
