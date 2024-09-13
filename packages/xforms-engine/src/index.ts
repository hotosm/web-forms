import type { InitializeForm } from './index.ts';
import { initializeForm as engine__initializeForm } from './instance/index.ts';

export const initializeForm: InitializeForm = engine__initializeForm;

export * as constants from './client/constants.ts';
export type * from './client/EngineConfig.ts';
export type * from './client/FormLanguage.ts';
export type * from './client/GroupNode.ts';
export type {
	AnyChildNode,
	AnyControlNode,
	AnyLeafNode,
	AnyNode,
	AnyParentNode,
	AnyUnsupportedControlNode,
	GeneralChildNode,
	GeneralParentNode,
	RepeatRangeNode,
} from './client/hierarchy.ts';
export type * from './client/index.ts';
export type * from './client/ModelValueNode.ts';
export type * from './client/NoteNode.ts';
export type * from './client/OpaqueReactiveObjectFactory.ts';
export type * from './client/repeat/RepeatInstanceNode.ts';
export type * from './client/repeat/RepeatRangeControlledNode.ts';
export type * from './client/repeat/RepeatRangeUncontrolledNode.ts';
export type * from './client/RootNode.ts';
export type * from './client/SelectNode.ts';
export type * from './client/StringNode.ts';
export type * from './client/SubtreeNode.ts';
export type * from './client/TextRange.ts';
export type * from './client/TriggerNode.ts';
export type * from './client/unsupported/RangeNode.ts';
export type * from './client/unsupported/RankNode.ts';
export type * from './client/unsupported/UploadNode.ts';
export type * from './client/validation.ts';

// TODO: notwithstanding potential conflicts with parallel work on `web-forms`
// (former `ui-vue`), these are the last remaining references **outside of
// `xforms-engine`** to anything besides /client/* and the `initializeForm`
// entrypoint implementation. We'll refine the various `definition` types in due
// time.
export type {
	AnySelectDefinition,
	SelectDefinition,
} from './parse/body/control/select/SelectDefinition.ts';
