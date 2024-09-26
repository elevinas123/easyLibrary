// ToolBar.config.ts

export const toolbarConfig = {
  rect: [
    {
      groupName: 'Stroke',
      controls: [
        {
          property: 'strokeColor',
          label: 'Stroke Color',
          type: 'color',
        },
        {
          property: 'strokeWidth',
          label: 'Stroke Width',
          type: 'number',
          min: 0.1,
          max: 10,
          step: 0.1,
        },
      ],
    },
    {
      groupName: 'Fill',
      controls: [
        {property: 'fill', label: 'Fill Color', type: 'color'},
      ],
    },
    {
      groupName: 'Effects',
      controls: [
        {
          property: 'roughness',
          label: 'Roughness',
          type: 'number',
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          property: 'fillStyle',
          label: 'Fill Style',
          type: 'select',
          options: ['hachure', 'solid', 'zigzag', 'cross-hatch'],
        },
        {
          property: 'hachureGap',
          label: 'Hachure Gap',
          type: 'number',
          min: 0,
          max: 20,
          step: 0.5,
        },
        {
          property: 'hachureAngle',
          label: 'Hachure Angle',
          type: 'number',
          min: 0,
          max: 360,
          step: 2,
        },
      ],
    },
  ],
  text: [
    // Similar grouping for text elements
  ],
  arrow: [
    {
      groupName: 'Stroke',
      controls: [
        {
          property: 'stroke',
          label: 'Stroke Color',
          type: 'color',
        },
        {
          property: 'strokeWidth',
          label: 'Stroke Width',
          type: 'number',
          min: 0.1,
          max: 10,
          step: 0.1,
        },
        {
          property: 'strokeStyle',
          label: 'Stroke Style',
          type: 'select',
          options: ['solid', 'dashed', 'dotted'],
        },
      ],
    },
    {
      groupName: 'Fill',
      controls: [
        {
          property: 'fill',
          label: 'Fill Color',
          type: 'color',
        },
        {
          property: 'fillStyle',
          label: 'Fill Style',
          type: 'select',
          options: [
            'solid', 'hachure', 'cross-hatch', 'zigzag', 'dots', 'dashed',
            'zigzag-line'
          ],
        },
        {
          property: 'fillWeight',
          label: 'Fill Weight',
          type: 'number',
          min: 0,
          max: 20,
          step: 0.5,
        },
      ],
    },
    {
      groupName: 'Effects',
      controls: [
        {
          property: 'roughness',
          label: 'Roughness',
          type: 'number',
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          property: 'hachureGap',
          label: 'Hachure Gap',
          type: 'number',
          min: 0,
          max: 20,
          step: 0.5,
        },
        {
          property: 'hachureAngle',
          label: 'Hachure Angle',
          type: 'number',
          min: 0,
          max: 360,
          step: 2,
        },
      ],
    },
    {
      groupName: 'Arrow Properties',
      controls: [
        {
          property: 'startType',
          label: 'Start Type',
          type: 'select',
          options: ['arrow', 'circle', 'square', 'none'],
        },
        {
          property: 'endType',
          label: 'End Type',
          type: 'select',
          options: ['arrow', 'circle', 'square', 'none'],
        },
      ],
    },
  ],
};
