import flow from 'lodash/fp/flow';
import join from 'lodash/fp/join';
import flatMap from 'lodash/fp/flatMap';
import compact from 'lodash/fp/compact';

const flattenCompactAndJoin = flow(flatMap, compact, join(','));
export default flattenCompactAndJoin;