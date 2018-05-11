import { compact, flatMap, flow, join } from 'lodash/fp';

const flattenCompactAndJoin = flow(flatMap, compact, join(','));
export default flattenCompactAndJoin;