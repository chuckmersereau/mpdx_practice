import development from './development';
import local from './local';
import next from './next';
import production from './production';
import staging from './staging';
import test from './test';

declare const NODE_ENV: any;

const configEnv = NODE_ENV || 'development';

const envs = {
    development: development,
    local: local,
    next: next,
    production: production,
    staging: staging,
    test: test
};

export default envs[configEnv];
