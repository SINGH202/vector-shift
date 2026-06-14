import {
  Brain,
  Filter,
  GitBranch,
  GitMerge,
  Globe,
  LogIn,
  LogOut,
  Shuffle,
  Type,
} from 'lucide-react';
import { InputNode } from './definitions/inputNode';
import { OutputNode } from './definitions/outputNode';
import { LLMNode } from './definitions/llmNode';
import { TextNode } from './TextNode';
import { FilterNode } from './definitions/filterNode';
import { TransformNode } from './definitions/transformNode';
import { ApiCallNode } from './definitions/apiCallNode';
import { ConditionNode } from './definitions/conditionNode';
import { MergeNode } from './definitions/mergeNode';

export const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  transform: TransformNode,
  apiCall: ApiCallNode,
  condition: ConditionNode,
  merge: MergeNode,
};

export const nodeCategories = [
  {
    name: 'Core',
    nodes: [
      { type: 'customInput', label: 'Input', icon: LogIn, accent: 'emerald' },
      { type: 'text', label: 'Text', icon: Type, accent: 'amber' },
      { type: 'llm', label: 'LLM', icon: Brain, accent: 'violet' },
      { type: 'customOutput', label: 'Output', icon: LogOut, accent: 'rose' },
    ],
  },
  {
    name: 'Logic',
    nodes: [
      { type: 'filter', label: 'Filter', icon: Filter, accent: 'sky' },
      { type: 'transform', label: 'Transform', icon: Shuffle, accent: 'cyan' },
      { type: 'condition', label: 'Condition', icon: GitBranch, accent: 'orange' },
      { type: 'merge', label: 'Merge', icon: GitMerge, accent: 'indigo' },
    ],
  },
  {
    name: 'Integrations',
    nodes: [{ type: 'apiCall', label: 'API Call', icon: Globe, accent: 'blue' }],
  },
];

export const toolbarNodes = nodeCategories.flatMap((category) => category.nodes);
