import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

function buildDefaultFieldValues(fields, data, id, getFieldDefaults) {
  const overrides = getFieldDefaults ? getFieldDefaults({ id, data }) : {};

  return fields.reduce((acc, field) => {
    acc[field.key] =
      overrides[field.key] ??
      data?.[field.key] ??
      field.default ??
      (field.type === 'toggle' ? false : '');
    return acc;
  }, {});
}

export function createNode(config) {
  const {
    title,
    accent,
    fields = [],
    handles = [],
    minWidth = 220,
    minHeight = 100,
    renderBody,
    getFieldDefaults,
  } = config;

  return function ConfiguredNode({ id, data }) {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const [fieldValues, setFieldValues] = useState(() =>
      buildDefaultFieldValues(fields, data, id, getFieldDefaults),
    );

    const handleFieldChange = (key, value) => {
      setFieldValues((prev) => ({ ...prev, [key]: value }));
      updateNodeField(id, key, value);
    };

    return (
      <BaseNode
        id={id}
        title={title}
        accent={accent}
        fields={fields}
        fieldValues={fieldValues}
        onFieldChange={handleFieldChange}
        handles={handles}
        minWidth={minWidth}
        minHeight={minHeight}
        renderBody={
          renderBody
            ? () => renderBody({ id, data, fieldValues, onFieldChange: handleFieldChange })
            : undefined
        }
      />
    );
  };
}
