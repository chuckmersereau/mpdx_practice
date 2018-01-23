class AvatarController {
    constructor(
        gettextCatalog,
        alerts
    ) {
        this.gettextCatalog = gettextCatalog;
        this.alerts = alerts;
        this.size = this.size || 'md';
        this.loading = false;
    }
    upload(form) {
        if (this.valid(form)) {
            this.loading = true;
            return this.onUpload({ avatar: this.avatar }).then((data) => {
                this.loading = false;
                this.src = data.data.data.attributes.avatar;
                this.alerts.addAlert(this.gettextCatalog.getString(
                    'Avatar uploaded successfully'
                ));
            }).catch((err) => {
                this.loading = false;
                throw err;
            });
        }
    }
    valid(form) {
        if (this.avatar && form.$valid) {
            return true;
        } else if (form.avatar.$error.minWidth && form.avatar.$error.minHeight) {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Avatar dimesions must be at least 320px x 320px'
            ), 'danger');
        } else if (form.avatar.$error.minWidth) {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Avatar width must be at least 320px'
            ), 'danger');
        } else if (form.avatar.$error.minHeight) {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Avatar height must be at least 320px'
            ), 'danger');
        } else if (form.avatar.$error.pattern) {
            this.alerts.addAlert(this.gettextCatalog.getString(
                'Avatar must be a jpeg image file'
            ), 'danger');
        }
        this.avatar = null;
        return false;
    }
}

const Avatar = {
    controller: AvatarController,
    template: require('./avatar.html'),
    bindings: {
        editable: '<',
        onUpload: '&',
        size: '@',
        src: '<',
        title: '@'
    }
};

import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';

export default angular.module('mpdx.common.avatar.component', [
    gettextCatalog,
    alerts
]).component('avatar', Avatar).name;
