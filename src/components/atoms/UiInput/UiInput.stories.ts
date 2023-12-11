import type {
  Meta,
  StoryObj,
} from '@storybook/vue3';
import { UiInput } from '@index';
import type { InputProps } from '@index';
import {
  withVariants,
  withVModel,
} from '@sb/decorators';
import {
  getArgTypes,
  getAttrs,
} from '@sb/helpers';
import {
  BasicStories,
  BasicStoriesSource,
  ButtonInSuffixStories,
  ButtonInSuffixStoriesSource,
} from './stories';

type InputArgsType = InputProps & {
  content?: string;
  modifiers?: string[];
  items?: Required<InputProps['value']>[];
}
type InputMetaType = Meta<InputArgsType>;
type InputStoryType = StoryObj<InputArgsType>;

const {
  argTypes,
  args,
} = getArgTypes(UiInput);

const meta = {
  title: 'Atoms/Input',
  component: UiInput,
  args: {
    ...args,
    modelValue: '',
    placeholder: 'Put your height',
  },
  argTypes: {
    ...argTypes,
    modelValue: { control: 'text' },
    type: {
      control: 'select',
      options: [
        'email',
        'number',
        'password',
        'search',
        'tel',
        'url',
        'text',
      ],
    },
  },
  parameters: { chromatic: { disableSnapshot: false } },
} satisfies Meta;
export default meta;

export const Basic: StoryObj = {
  render(args, {
    name, argTypes,
  }) {
    return {
      name,
      components: { BasicStories },
      setup() {
        const { attrs } = getAttrs(args, argTypes, name);
        return { attrs };
      },
      template: '<BasicStories v-bind="{...attrs}"/>',
    };
  },
};
Basic.decorators = [ withVModel ];
Basic.parameters = {
  docs: { source: { code: BasicStoriesSource } },
  chromatic: { disableSnapshot: true },
};

export const Empty = { ...Basic };
Empty.argTypes = {};
Empty.decorators = [ withVariants ];
Empty.parameters = {
  variants: [
    { label: 'default' },
    ...[
      'hover',
      'active',
    ].map((variant) => ({
      label: `${variant}`,
      class: `pseudo-${variant}`,
    })),
    {
      label: 'focus',
      outlineAttrs: { class: 'pseudo-focus-within' },
    },
    {
      label: 'disabled',
      disabled: true,
      class: 'ui-input--is-disabled',
    },
  ],
};
export const Filled = { ...Basic };
Filled.argTypes = {};
Filled.decorators = [ withVariants ];
Filled.parameters = {
  variants: [ ...Empty.parameters.variants.map((variant) => ({
    ...variant,
    modelValue: '158',
  })) ],
};

export const Error = { ...Basic };
Error.decorators = [ withVariants ];
Error.parameters = {
  variants: [ ...Empty.parameters.variants.map((variant) => ({
    ...variant,
    class: `${variant.class} ui-input--has-error`,
  })) ],
};

// export const Suffix = { ...Basic };
// Suffix.args = { suffix: 'cm' };
//
// export const ButtonInSuffix: StoryObj = {
//   render(args, { name }) {
//     return {
//       name,
//       components: { ButtonInSuffixStories },
//       setup() {
//         const { storyAttrs: attrs } = useAttrs();
//         return {
//           args,
//           attrs,
//         };
//       },
//       template: '<ButtonInSuffixStories v-bind="{...args, ...attrs}"/>',
//     };
//   },
// };
