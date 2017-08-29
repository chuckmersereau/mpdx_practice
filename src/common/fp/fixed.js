import curry from 'lodash/fp/curry';

export default curry((precision, num) => parseFloat(num).toFixed(precision));