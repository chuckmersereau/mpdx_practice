import { curry, isEmpty } from 'lodash/fp';

export default curry((val) => isEmpty(val) ? null : val);