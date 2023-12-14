<template>
  <div class="ui-phone-number">
    <!-- TODO: change to fiedset, legend, label -->
    <UiText class="ui-phone-number__text">
      Phone number
    </UiText>
    <UiPhoneNumberPrefix
      v-model:phone-code="phoneCode"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UiText from '../../atoms/UiText/UiText.vue';
import UiPhoneNumberPrefix from './_internal/UiPhoneNumberPrefix.vue';

const phoneCode = computed({
  get: () => ({
    code: '+1',
    countryCode: 'US',
  }),
  set: (value) => value,
});

</script>

<style lang="scss">
.ui-phone-number {
  width: 320px;

  &__text {
    margin-bottom: var(--space-8);
  }
}
</style>
