import { curry } from 'lodash/fp';

export default curry((precision, num) => parseFloat(num).toFixed(precision));