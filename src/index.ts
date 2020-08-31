import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import _ from 'lodash'

import textColorTokens from './design-tokens/color/text'
import borderColorTokens from './design-tokens/color/border'
import fontSizeTokens from './design-tokens/font/size'
import backgroundColorTokens from './design-tokens/color/background'

const parseFontSizes = (rawTokens: Object) =>
  Object.keys(rawTokens).map((key: string) => {
    const asREM = (rawTokens as { [key: string]: any })[key].replace('rem', '')
    return asREM * 16
  })

const parseColors = (rawTokens: Object) =>
  Object.keys(rawTokens).map((key: string) => {
    let split = (rawTokens as { [key: string]: any })[key].split(',').map((attr: string) =>
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

const fontFamily: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      const fontName =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.name
      if (!fontName?.toLowerCase().includes('salesforce')) utils.report(`Invalid`, layer)
    }
  },
  name: 'slds-assistant/fontSizes',
  title: 'Invalid Font',
  description: 'Reports text using an invalid font',
}

const fontSizes: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const fontSizeValues = parseFontSizes(fontSizeTokens)
    for (const layer of utils.objects.text) {
      const size =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.size

      if (!fontSizeValues.find((v) => v === size)) utils.report('Invalid', layer)
    }
  },
  name: 'slds-assistant/fontSizes',
  title: 'Invalid Font Size',
  description: 'Reports text using invalid font size',
}

const borderColors: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const borderColorValues = parseColors(borderColorTokens)

    for (const layer of utils.objects.anyLayer) {
      const borders = layer.style?.borders

      if (borders && borders.length > 0) {
        borders.forEach((b) => {
          const borderRGBA = [
            Math.round(b.color.red * 255),
            Math.round(b.color.green * 255),
            Math.round(b.color.blue * 255),
            b.color.alpha,
          ]
          if (!borderColorValues.find((v) => _.isEqual(v, borderRGBA)))
            utils.report(`Invalid`, layer)
        })
      }
    }
  },
  name: 'slds-assistant/borderColors',
  title: 'Invalid Border Color',
  description: 'Reports layer using invalid border color',
}

const backgroundColors: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const backgroundColorValues = parseColors(backgroundColorTokens)

    for (const layer of utils.objects.anyLayer) {
      const fills = layer.style?.fills

      if (fills && fills.length > 0) {
        fills.forEach((b) => {
          const fillRGBA = [
            Math.round(b.color.red * 255),
            Math.round(b.color.green * 255),
            Math.round(b.color.blue * 255),
            b.color.alpha,
          ]
          if (!backgroundColorValues.find((v) => _.isEqual(v, fillRGBA)))
            utils.report(`Invalid`, layer)
        })
      }
    }
  },
  name: 'slds-assistant/backgroundColors',
  title: 'Invalid Background Color',
  description: 'Reports layer using invalid fill',
}

const textColors: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const textColorValues = parseColors(textColorTokens)

    for (const layer of utils.objects.text) {
      let colorAttribute =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute

      if (colorAttribute) {
        const textRGBA = [
          Math.round(255 * colorAttribute?.red),
          Math.round(255 * colorAttribute?.green),
          Math.round(255 * colorAttribute?.blue),
          colorAttribute?.alpha,
        ]
        if (!textColorValues.find((v) => _.isEqual(v, textRGBA))) utils.report(`Invalid`, layer)
      }
    }
  },
  name: 'slds-assistant/textColors',
  title: 'Invalid Text Color',
  description: 'Reports text using invalid text color',
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'slds-assistant',
    rules: [textColors, backgroundColors, borderColors, fontSizes, fontFamily],
    config: {
      rules: {
        'slds-assistant/textColors': { active: true },
        'slds-assistant/backgroundColors': { active: true },
        'slds-assistant/borderColors': { active: true },
        'slds-assistant/fontSizes': { active: true },
        'slds-assistant/fontFamily': { active: true },
      },
    },
  }
}

export default assistant
