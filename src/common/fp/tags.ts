import { flow, map } from 'lodash/fp';
import { split } from './strings';
import emptyToNull from './emptyToNull';
import joinComma from './joinComma';

export const convertTags = flow(map('name'), joinComma, emptyToNull);

export const mapToName = map((tag) => ({ name: tag }));

export const stringToNameObjectArray = (tags) => mapToName(split(',', tags));