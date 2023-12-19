<template>
  <UiDropdown
    class="ui-phone-number__dropdown"
    :model-value="modelValue"
    :popover-attrs="{ class: 'ui-phone-number__dropdown-popover' }"
    @update:model-value="handleOnChangeCode"
  >
    <template
      #toggle="{
        toggleHandler, isOpen,
      }"
    >
      <UiButton
        id="ui-phone-number__dropdown"
        class="ui-button--outlined ui-button--has-icon ui-phone-number__dropdown-button"
        :class="{ 'ui-button--has-error': error }"
        type="button"
        @click="event => updateOffset(event, toggleHandler)"
      >
        <span class="ui-phone-number__dropdown-text">
          {{ formattedPrefix }}
        </span>
        <UiIcon
          :icon="isOpen ? `chevron-up` : `chevron-down`"
          class="ui-button__icon"
        />
      </UiButton>
    </template>
    <template
      v-for="(option, key) in phoneCodes"
      :key="key"
    >
      <UiDropdownItem
        :value="option.code"
        class="ui-dropdown-item--compact ui-phone-number__dropdown-item"
      >
        {{ option.country }} ({{ option.code }})
      </UiDropdownItem>
    </template>
  </UiDropdown>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue';
import UiButton from '../../../atoms/UiButton/UiButton.vue';
import UiDropdown from '../../../molecules/UiDropdown/UiDropdown.vue';
import UiDropdownItem from '../../../molecules/UiDropdown/_internal/UiDropdownItem.vue';
import UiIcon from '../../../atoms/UiIcon/UiIcon.vue';
import { getPhoneCodes } from '../../../../utilities/helpers';
import type { PhoneCodeType } from '../../../../utilities/helpers';
import { type DropdownModelValue } from '../../../molecules/UiDropdown/UiDropdown.vue';

export interface UiPhoneNumberProps {
  phoneCode?: PhoneCodeType,
  language?: string,
  error?: string | boolean,
}

const props: UiPhoneNumberProps = withDefaults(defineProps<UiPhoneNumberProps>(), {
  phoneCode: () => ({
    code: '+1',
    countryCode: 'US',
    country: 'United States o America',
  }),
  language: 'en',
  error: false,
});

const isLoading = ref(true);

const phoneCodes = ref<PhoneCodeType[]>([]);
const prefixCode = computed(() => props.phoneCode?.code);
const modelValue = ref(prefixCode.value);

const formattedPrefix = computed(() => modelValue.value?.replace('+', '+ '));

const popoverOffsetTop = ref<number>();

const handleOnChangeCode = (value: DropdownModelValue) => {
  modelValue.value = (value as PhoneCodeType).code;
};

const updateOffset = (event: MouseEvent, callback: () => void) => {
  const buttonHeight = 48;
  popoverOffsetTop.value = event.y + buttonHeight;
  callback();
};

onMounted(async () => {
  phoneCodes.value = await getPhoneCodes(props.language);
  isLoading.value = false;
});
</script>

<style lang="scss">
@use "../../../../styles/mixins";
@use "../../../../styles/functions";

.ui-phone-number {
$this: &;
$element: phone-number;

#{$this}__dropdown {
  --button-padding: var(--space-12);

  font: functions.var($element + "-dropdown", font, var(--font-body-1));
  width: functions.var($element + "-dropdown", width, 100%);

  &-button {
    --button-color: var(--color-text-body);
    --button-hover-color: var(--color-text-body);
    --button-active-color: var(--color-text-body);
    --button-border-color: var(--color-border-strong);
    --button-hover-border-color: var(--color-border-strong-hover);
    --button-background: var(--color-background-white);
    --button-hover-background: var(--color-background-white);
    --button-active-background: var(--color-background-white);
    --icon-color: var(--color-icon-secondary);
    --button-icon-color-active: var(--color-icon-secondary-active);
    --button-icon-color-hover: var(--color-icon-secondary-hover);
    --button-icon-margin: 0;
    --button-padding-inline: var(--space-16) var(--space-12);
    --button-padding-block: var(--space-12);

      justify-content: functions.var($element + "-dropdown-button", justify-content, space-between);
      font: functions.var($element + "-dropdown-button", font, var(--font-body-1));
      width: 100px;
    }

    &-popover {
      --popover-border: none;
      --dropdown-popover-width: 100%;
      --dropdown-popover-max-width: none;
      --dropdown-popover-min-height: 200px;

      overflow-y: functions.var($element + "-dropdown-popover", overflow-y, scroll);
      border: functions.var($element + "-dropdown-popover", border, 1px solid var(--color-border-subtle));
      max-height: functions.var($element + "-dropdown-popover-mobile", max-height, calc(100vh - (v-bind(popoverOffsetTop) * 1px))); /* stylelint-disable-line value-keyword-case */
      max-height: 328px;
      z-index: functions.var($element + "-dropdown-popover", z-index, 1);

      @include mixins.from-tablet {
        --dropdown-popover-max-width: 320px;
        --dropdown-popover-width: 320px;

        max-height: functions.var($element + "-dropdown-popover-desktop", max-height, calc(100vh - (v-bind(popoverOffsetTop) * 1px))); /* stylelint-disable-line value-keyword-case */
      }
    }
  }
}
</style>
