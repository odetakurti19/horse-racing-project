import { config } from "@vue/test-utils"

config.global.stubs = {
  Card: {
    inheritAttrs: true,
    template: '<div><slot name="title" /><slot name="content" /></div>',
  },
  Button: {
    props: ["disabled", "label", "severity", "icon"],
    template: '<button :disabled="disabled" v-bind="$attrs">{{ label }}</button>',
  },
  Tag: {
    props: ["value", "severity"],
    template: '<span v-bind="$attrs">{{ value }}</span>',
  },
  ProgressBar: {
    props: ["value"],
    template: '<div v-bind="$attrs" />',
  },
  Message: {
    template: '<div v-bind="$attrs"><slot /></div>',
  },
  Divider: {
    template: "<hr />",
  },
  TransitionGroup: {
    template: "<div><slot /></div>",
  },
}
