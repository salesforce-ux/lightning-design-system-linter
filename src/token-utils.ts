import * as primitiveTokens from './design-tokens/primitive.json'
import * as actionIconTokens from './design-tokens/bg-actions.json'
import * as standardIconTokens from './design-tokens/bg-standard.json'
import * as customIconTokens from './design-tokens/bg-custom.json'

const getGenericColors = () =>
  primitiveTokens.properties.filter((p) => p.category === 'color').map((p) => p.value)

export const getBackgroundColors = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'background-color')
    .map((p) => p.value)
    .concat(actionIconTokens.properties.map((p) => p.value))
    .concat(standardIconTokens.properties.map((p) => p.value))
    .concat(customIconTokens.properties.map((p) => p.value))
    .concat(getGenericColors())

export const getBorderColors = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'border-color')
    .map((p) => p.value)
    .concat(getGenericColors())

export const getTextColors = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'text-color')
    .map((p) => p.value)
    .concat(getGenericColors())

export const getFontSizes = () =>
  primitiveTokens.properties.filter((p) => p.category === 'font-size').map((p) => p.value)
