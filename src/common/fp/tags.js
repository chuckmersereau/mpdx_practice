import { flow, map } from 'lodash/fp';
import joinComma from './joinComma';
import emptyToNull from './emptyToNull';
import { split } from './strings';

export const convertTags = flow(map('name'), joinComma, emptyToNull);

export const mapToName = map((tag) => ({ name: tag }));

export const stringToNameObjectArray = flow(split(','), mapToName);