import * as primitiveTokens from './design-tokens/primitive.json'
import * as actionIconTokens from './design-tokens/bg-actions.json'
import * as standardIconTokens from './design-tokens/bg-standard.json'
import * as customIconTokens from './design-tokens/bg-custom.json'
import * as newPaletteValues from './design-tokens/new-palette.json'

import parseColor from 'parse-color'

interface Palette {
  [key: string]: string
}

const parseColors = (value: string) => parseColor(value).rgba

const getGenericColors = () => getPrimitvesForCategory('color')

const getNewPalette = () =>
  Object.keys(newPaletteValues)
    .filter((k) => k !== 'default')
    .map((k) => (newPaletteValues as Palette)[k])

const getPrimitvesForCategory = (category: string) =>
  primitiveTokens.properties.filter((p) => p.category === category).map((p) => p.value)

const getIconBackgroundColors = () =>
  actionIconTokens.properties
    .map((p) => p.value)
    .concat(standardIconTokens.properties.map((p) => p.value))
    .concat(customIconTokens.properties.map((p) => p.value))

export const getBackgroundColors = () =>
  getPrimitvesForCategory('background-color')
    .concat(getIconBackgroundColors())
    .concat(getGenericColors())
    .concat(getNewPalette())
    .map(parseColors)

export const getBorderColors = () =>
  getPrimitvesForCategory('border-color')
    .concat(getGenericColors())
    .concat(getNewPalette())
    .map(parseColors)

export const getTextColors = () =>
  getPrimitvesForCategory('text-color')
    .concat(getGenericColors())
    .concat(getNewPalette())
    .map(parseColors)

export const getFontSizes = () => getPrimitvesForCategory('font-size')
