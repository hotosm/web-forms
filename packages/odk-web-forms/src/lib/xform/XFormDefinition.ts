import { XFormXPathEvaluator } from '../xpath/XFormXPathEvaluator.ts';
import { XFormDOM } from './XFormDOM.ts';
import { XFormModelDefinition } from './XFormModelDefinition.ts';
import { XFormViewDefinition } from './XFormViewDefinition.ts';

export class XFormDefinition {
	readonly xformDOM: XFormDOM;
	readonly xformDocument: XMLDocument;
	readonly rootEvaluator: XFormXPathEvaluator;

	readonly id: string;
	readonly title: string;

	readonly model: XFormModelDefinition;
	readonly view: XFormViewDefinition;

	constructor(readonly sourceXML: string) {
		const xformDOM = new XFormDOM(sourceXML);

		this.xformDOM = xformDOM;

		const { primaryInstanceRoot, title, xformDocument } = xformDOM;

		const rootEvaluator = (this.rootEvaluator = new XFormXPathEvaluator(xformDocument));

		const id = primaryInstanceRoot.getAttribute('id');

		if (id == null) {
			throw new Error('Primary instance root has no id');
		}

		this.xformDocument = xformDocument;
		this.id = id;
		this.title = title.textContent ?? '';

		this.model = new XFormModelDefinition(this);
		this.view = new XFormViewDefinition(this, rootEvaluator);
	}

	toJSON() {
		const { rootEvaluator, ...rest } = this;

		return rest;
	}
}
