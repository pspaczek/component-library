import type {
  Meta,
  StoryObj,
} from '@storybook/vue3';
import { UiTextarea } from '@index';
import { withVModel } from '@sb/decorators';
import { getArgTypes } from '@sb/helpers';
import {
  BasicStories,
  BasicStoriesSource,
} from './stories';

const {
  argTypes,
  args,
} = getArgTypes(UiTextarea);

const meta = {
  title: 'Atoms/Textarea',
  component: UiTextarea,
  args: {
    ...args,
    modelValue: '',
    resize: false,
    placeholder: 'Please provide a detailed description of the issue.',
    disabled: false,
    textareaAttrs: { 'data-testid': 'textarea-element' },
  },
  argTypes: {
    ...argTypes,
    resize: {
      control: 'select',
      options: [
        true,
        false,
        'horizontal',
        'vertical',
      ],
    },
    modelValue: {
      control: 'text',
    }
  },
  parameters: { chromatic: { disableSnapshot: false } },
} satisfies Meta;
export default meta;

export const Basic: StoryObj = { render: () => (BasicStories) };
Basic.decorators = [ withVModel ];
Basic.parameters = { docs: { source: { code: BasicStoriesSource } } };
