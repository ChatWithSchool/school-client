const target = (state: string) => [
  `[data-demo-state="${state}"]`,
  `[data-demo-state="${state}"] *`,
];

/** Story parameters that force the pseudo states of every <Demo state="…"> cell. */
export const pseudoStates = {
  pseudo: {
    hover: target('hover'),
    active: target('pressed'),
    focus: target('focus'),
    focusVisible: target('focus'),
    focusWithin: target('focus'),
  },
};
