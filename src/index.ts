import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import _ from 'lodash'

import { getBackgroundColors, getBorderColors, getTextColors, getFontSizes } from './token-utils'

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

// given sketch class, return true if this layer should be linted
const isValidLayer = (_class: string) =>
  _class !== 'group' &&
  _class !== 'symbolInstance' &&
  _class !== 'symbolMaster' &&
  _class !== 'page' &&
  _class !== 'artboard'

const tokenDescription =
  'We recommend using predefined values represented by our design tokens wherever possible. This ensures consistency in design and helps with change management as our system evolves.'

const textSldsFont: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      const fontName =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.name

      if (isValidLayer(layer._class) && !fontName?.toLowerCase().includes('salesforce'))
        utils.report(
          `Consider installing and using Salesforce Sans in place of ${fontName}.`,
          layer,
        )
    }
  },
  name: 'lightning-design-system-linter/text-slds-font',
  title: 'Text should use the Salesforce Sans font family.',
  description: tokenDescription,
}

const textSldsSize: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const fontSizeValues = getFontSizes()

    for (const layer of utils.objects.text) {
      const size =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.size

      if (isValidLayer(layer._class) && !fontSizeValues.find((v) => parseInt(v) === size))
        utils.report(`${size} does not match a valid font size token.`, layer)
    }
  },
  name: 'lightning-design-system-linter/text-slds-size',
  title: 'Text sizes should match SLDS font size token values.',
  description: tokenDescription,
}

const borderSldsColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const borderColorValues = parseColors(getBorderColors())

    for (const layer of utils.objects.anyLayer) {
      const borders = layer.style?.borders

      if (isValidLayer(layer._class) && borders && borders.length > 0) {
        borders.forEach((border) => {
          const borderRgba = getRgba(border.color)

          // Border must be enabled. Transparent borders are allowed.
          if (
            border.isEnabled &&
            borderRgba[3] !== 0 &&
            !borderColorValues.find((v) => _.isEqual(v, borderRgba))
          )
            utils.report(
              `rgba(${borderRgba[0]},${borderRgba[1]},${borderRgba[2]},${borderRgba[3]}) does not match a valid border color token.`,
              layer,
            )
        })
      }
    }
  },
  name: 'lightning-design-system-linter/border-slds-color',
  title: 'Border colors should match SLDS border color token values.',
  description: tokenDescription,
}

const fillSldsColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const backgroundColorValues = parseColors(getBackgroundColors())

    for (const layer of utils.objects.anyLayer) {
      const fills = layer.style?.fills

      if (isValidLayer(layer._class) && fills && fills.length > 0) {
        fills.forEach((fill) => {
          const fillRgba = getRgba(fill.color)

          // check for token match or transparency
          if (
            fill.isEnabled &&
            fillRgba[3] !== 0 &&
            !backgroundColorValues.find((v) => _.isEqual(v, fillRgba))
          )
            utils.report(
              `rgba(${fillRgba[0]},${fillRgba[1]},${fillRgba[2]},${fillRgba[3]}) does not match a valid background color token.`,
              layer,
            )
        })
      }
    }
  },
  name: 'lightning-design-system-linter/fill-slds-color',
  title: 'Fill colors should match SLDS background color token values.',
  description: tokenDescription,
}

const textSldsColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const textColorValues = parseColors(getTextColors())

    for (const layer of utils.objects.text) {
      let colorAttribute =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute

      if (isValidLayer(layer._class) && colorAttribute) {
        const textRgba = getRgba(colorAttribute)

        // check for token match or transparency
        if (textRgba[3] !== 0 && !textColorValues.find((v) => _.isEqual(v, textRgba)))
          utils.report(
            `rgba(${textRgba[0]},${textRgba[1]},${textRgba[2]},${textRgba[3]}) does not match a valid text color token.`,
            layer,
          )
      }
    }
  },
  name: 'lightning-design-system-linter/text-slds-color',
  title: `Text colors should match SLDS text color token values.`,
  description: tokenDescription,
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'lightning-design-system-linter',
    rules: [textSldsColor, fillSldsColor, borderSldsColor, textSldsSize, textSldsFont],
    config: {
      rules: {
        'lightning-design-system-linter/text-slds-color': { active: true },
        'lightning-design-system-linter/fill-slds-color': { active: true },
        'lightning-design-system-linter/border-slds-color': { active: true },
        'lightning-design-system-linter/text-slds-size': { active: true },
        'lightning-design-system-linter/text-slds-font': { active: true },
      },
    },
  }
}

export default assistant
