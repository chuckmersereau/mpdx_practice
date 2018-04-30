import { curry, map } from 'lodash/fp';

const mapO = (map as any).convert({ 'cap': false });

export default curry((a, b) => mapO(a, b));