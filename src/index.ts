import { AssistantPackage, RuleDefinition, RuleUtils } from '@sketch-hq/sketch-assistant-types'
import _ from 'lodash'

import { getBackgroundColors, getBorderColors, getTextColors, getFontSizes } from './token-utils'

const SLDS_RELEASE = "Spring '21"

// parse rgba syntax and populate array
const parseColors = (rawTokens: Array<string>) =>
  rawTokens.map((key: string) => {
    let split = key.split(',').map((attr: string) =>
      parseFloat(
        attr
          .replace(/rgba|rgb/g, '')
          .replace(/\(/g, '')
          .replace(/\)/g, ''),
      ),
    )

    // add alpha of 1
    if (split.length < 4) split.push(1)
    return split
  })

// turn rgba percentages into values
const getRgba = (colorObj: any) => {
  return [
    Math.round(255 * colorObj?.red),
    Math.round(255 * colorObj?.green),
    Math.round(255 * colorObj?.blue),
    colorObj?.alpha,
  ]
}

// given sketch layer, return true if this layer should be linted
const isValidLayer = (layer: any, _utils: RuleUtils) => {
  const page: any = _utils.getObjectParents(layer).find((p: any) => p._class === 'page')

  let isSpecPage = false
  if (page && page.name.includes('[Specs]')) isSpecPage = true

  return (
    !isSpecPage &&
    layer._class !== 'group' &&
    layer._class !== 'symbolInstance' &&
    layer._class !== 'symbolMaster' &&
    layer._class !== 'page' &&
    layer._class !== 'artboard'
  )
}

const tokenDescription = `We recommend using predefined values represented by our design tokens wherever possible. This linter version is using the ${SLDS_RELEASE} set of design tokens.`

const textSldsFont: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      const fontName =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.name

      if (isValidLayer(layer, utils) && !fontName?.toLowerCase().includes('salesforce'))
        utils.report(
          `Consider installing and using Salesforce Sans in place of ${fontName}.`,
          layer,
        )
    }
  },
  name: 'lightning-design-system-linter/font',
  title: `Text should use the Salesforce Sans font family.`,
  description: tokenDescription,
}

const textSldsSize: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const fontSizeValues = getFontSizes()

    for (const layer of utils.objects.text) {
      const size =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.size

      if (isValidLayer(layer, utils) && !fontSizeValues.find((v) => parseInt(v) === size))
        utils.report(`${size} does not match a valid font size token.`, layer)
    }
  },
  name: 'lightning-design-system-linter/text-size',
  title: `Text sizes should match SLDS font size token values.`,
  description: tokenDescription,
}

const borderSldsColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const borderColorValues = parseColors(getBorderColors())

    for (const layer of utils.objects.anyLayer) {
      const borders = layer.style?.borders

      if (isValidLayer(layer, utils) && borders && borders.length > 0) {
        borders.forEach((border) => {
          const borderRgba = getRgba(border.color)

          // Border must be enabled. Transparent borders are allowed.
          if (
            border.isEnabled &&
            borderRgba[3] !== 0 &&
            !borderColorValues.find((v) => _.isEqual(v, borderRgba))
          )
            utils.report(
              `rgba(${borderRgba[0]},${borderRgba[1]},${borderRgba[2]},${borderRgba[3]}) does not match a valid border or generic color token.`,
              layer,
            )
        })
      }
    }
  },
  name: 'lightning-design-system-linter/border-color',
  title: `Border colors should match SLDS border or generic color token values.`,
  description: tokenDescription,
}

const fillSldsColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const backgroundColorValues = parseColors(getBackgroundColors())

    for (const layer of utils.objects.anyLayer) {
      const fills = layer.style?.fills

      if (isValidLayer(layer, utils) && fills && fills.length > 0) {
        fills.forEach((fill) => {
          const fillRgba = getRgba(fill.color)

          // check for token match or transparency
          if (
            fill.isEnabled &&
            fillRgba[3] !== 0 &&
            !backgroundColorValues.find((v) => _.isEqual(v, fillRgba))
          )
            utils.report(
              `rgba(${fillRgba[0]},${fillRgba[1]},${fillRgba[2]},${fillRgba[3]}) does not match a valid background or generic color token.`,
              layer,
            )
        })
      }
    }
  },
  name: 'lightning-design-system-linter/fill-color',
  title: `Fill colors should match SLDS background or generic color token values.`,
  description: tokenDescription,
}

const textSldsColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const textColorValues = parseColors(getTextColors())

    for (const layer of utils.objects.text) {
      let colorAttribute =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute

      if (isValidLayer(layer, utils) && colorAttribute) {
        const textRgba = getRgba(colorAttribute)

        // check for token match or transparency
        if (textRgba[3] !== 0 && !textColorValues.find((v) => _.isEqual(v, textRgba)))
          utils.report(
            `rgba(${textRgba[0]},${textRgba[1]},${textRgba[2]},${textRgba[3]}) does not match a valid text or generic color token.`,
            layer,
          )
      }
    }
  },
  name: 'lightning-design-system-linter/text-color',
  title: `Text colors should match SLDS text or generic color token values.`,
  description: tokenDescription,
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'lightning-design-system-linter',
    rules: [fillSldsColor, borderSldsColor, textSldsColor, textSldsSize, textSldsFont],
    config: {
      rules: {
        'lightning-design-system-linter/fill-color': { active: true },
        'lightning-design-system-linter/border-color': { active: true },
        'lightning-design-system-linter/text-color': { active: true },
        'lightning-design-system-linter/text-size': { active: true },
        'lightning-design-system-linter/font': { active: true },
      },
    },
  }
}

export default assistant
