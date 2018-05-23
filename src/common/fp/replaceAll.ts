import { curry, join, split } from 'lodash/fp';

export default curry((param1, param2, val) => join(param2, split(param1, val)));