import { pairwise } from 'itertools-ts/lib/single';
import type { XPathNode } from '../../adapter/interface/XPathNode.ts';
import { EvaluationContext } from '../../context/EvaluationContext.ts';
import { JRCompatibleGeoValueError } from '../../error/JRCompatibleGeoValueError.ts';
import type { EvaluableArgument } from '../../evaluator/functions/FunctionImplementation.ts';
import { NumberFunction } from '../../evaluator/functions/NumberFunction.ts';
import type { GeopointCoordinates } from '../../lib/geo/Geopoint.ts';
import { geopointCodec } from '../../lib/geo/geopointCodec.ts';

const evaluatePoints = <T extends XPathNode>(
	context: EvaluationContext<T>,
	expression: EvaluableArgument
): GeopointCoordinates[] => {
	const results = expression.evaluate(context);

	const stringResults = [...results].map((result) => result.toString());
	const geopointStrings = stringResults.flatMap((result) => {
		const string = result.toString().trim();

		return string.split(/\s*;\s*/);
	});

	return geopointStrings.map((string) => {
		return geopointCodec.decodeValue(string);
	});
};

interface Line {
	readonly start: GeopointCoordinates;
	readonly end: GeopointCoordinates;
}

const evaluateLines = <T extends XPathNode>(
	context: EvaluationContext<T>,
	expression: readonly EvaluableArgument[]
): Line[] => {
	const points = expression.flatMap((el) => evaluatePoints(context, el));
	if (points.length < 2) {
		throw new JRCompatibleGeoValueError();
	}

	return Array.from(pairwise(points)).map((line) => {
		const [start, end] = line;

		return {
			start,
			end,
		};
	});
};

const EARTH_EQUATORIAL_RADIUS_METERS = 6_378_100;
const PRECISION = 100;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const toPrecision = (value: number, precision: number) => {
	if (value === 0) {
		return 0;
	}

	return Math.round(value * precision) / precision;
};

const toAbsolutePrecision = (value: number, precision: number) => {
	if (value === 0) {
		return 0;
	}

	return Math.abs(toPrecision(value, precision));
};

const geodesicArea = (lines: readonly Line[]): number => {
	const [firstLine, ...rest] = lines;
	const lastLine = rest[rest.length - 1];

	if (firstLine == null || lastLine == null) {
		return 0;
	}

	const { start } = firstLine;
	const { end } = lastLine;

	let shape: readonly Line[];

	if (start.latitude === end.latitude && start.longitude === end.longitude) {
		shape = lines;
	} else {
		shape = [...lines, { start: end, end: start }];
	}

	let total = 0;

	// eslint-disable-next-line @typescript-eslint/no-shadow
	for (const { start, end } of shape) {
		total +=
			toRadians(end.longitude - start.longitude) *
			(2 + Math.sin(toRadians(end.latitude)) + Math.sin(toRadians(start.latitude)));
	}

	return (total * EARTH_EQUATORIAL_RADIUS_METERS * EARTH_EQUATORIAL_RADIUS_METERS) / 2;
};

export const area = new NumberFunction(
	'area',
	[{ arityType: 'required' }],
	(context, [expression]) => {
		const lines = evaluateLines(context, [expression!]);

		const areaResult = geodesicArea(lines);

		return toAbsolutePrecision(areaResult, PRECISION);
	}
);

const geodesicDistance = (line: Line): number => {
	const { start, end } = line;
	const deltaLambda = toRadians(start.longitude - end.longitude);
	const phi0 = toRadians(start.latitude);
	const phi1 = toRadians(end.latitude);

	return (
		Math.acos(
			Math.sin(phi0) * Math.sin(phi1) + Math.cos(phi0) * Math.cos(phi1) * Math.cos(deltaLambda)
		) * EARTH_EQUATORIAL_RADIUS_METERS
	);
};

const sum = (values: readonly number[]) => {
	let total = 0;

	for (const value of values) {
		total += value;
	}

	return total;
};

export const distance = new NumberFunction(
	'distance',
	[{ arityType: 'required' }, { arityType: 'variadic' }],
	(context, args) => {
		const lines = evaluateLines(context, args);
		const distances = lines.map(geodesicDistance);

		return toAbsolutePrecision(sum(distances), PRECISION);
	}
);
