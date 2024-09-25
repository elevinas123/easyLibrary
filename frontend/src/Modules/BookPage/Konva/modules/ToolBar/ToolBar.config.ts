// ToolBar.config.ts

export const toolbarConfig = {
  rect: [
    {
      groupName: 'Stroke',
      controls: [
        {property: 'strokeColor', label: 'Stroke Color', type: 'color'},
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
      controls: [{property: 'fill', label: 'Fill Color', type: 'color'}],
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
};
