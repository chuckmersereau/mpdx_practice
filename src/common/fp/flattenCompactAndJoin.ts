import { flow, join, flatMap, compact } from 'lodash/fp';

const flattenCompactAndJoin = flow(flatMap, compact, join(','));
export default flattenCompactAndJoin;