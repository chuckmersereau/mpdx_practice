import service from './alerts.service';

describe('common.alerts.service', () => {
    let timeout, alerts;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, $timeout, _alerts_) => {
            timeout = $timeout;
            alerts = _alerts_;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(alerts.data).toEqual([]);
        });
    });

    describe('addAlert', () => {
        describe('no message', () => {
            it('should not change data', () => {
                alerts.addAlert();
                expect(alerts.data).toEqual([]);
            });
        });

        describe('has message', () => {
            const message = 'Message';

            it('should change data', () => {
                alerts.addAlert(message);
                expect(alerts.data).toEqual([{
                    id: jasmine.any(String),
                    displayTime: 5,
                    message: message,
                    status: null,
                    type: 'success'
                }]);
            });

            it('should remove alert from data after displayTime', () => {
                alerts.addAlert(message);
                expect(alerts.data).not.toEqual([]);
                timeout.flush(5001);
                timeout.verifyNoPendingTasks();
                expect(alerts.data).toEqual([]);
            });

            describe('has type', () => {
                const type = 'danger';

                it('should change data', () => {
                    alerts.addAlert(message, type);
                    expect(alerts.data).toEqual([{
                        id: jasmine.any(String),
                        displayTime: 5,
                        message: message,
                        status: null,
                        type: type
                    }]);
                });

                describe('has status', () => {
                    const status = '500';

                    it('should change data', () => {
                        alerts.addAlert(message, type, status);
                        expect(alerts.data).toEqual([{
                            id: jasmine.any(String),
                            displayTime: 5,
                            message: message,
                            status: status,
                            type: type
                        }]);
                    });

                    describe('has displayTime', () => {
                        const displayTime = 10;

                        it('should change data', () => {
                            alerts.addAlert(message, type, status, displayTime);
                            expect(alerts.data).toEqual([{
                                id: jasmine.any(String),
                                displayTime: displayTime,
                                message: message,
                                status: status,
                                type: type
                            }]);
                        });
                    });
                });
            });
        });
    });
});
