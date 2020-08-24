import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import _ from 'lodash'

const textColorTokens = {
  colorGray11: 'rgb(62, 62, 60)',
  colorGray12: 'rgb(43, 40, 38)',
  colorGray13: 'rgb(8, 7, 7)',
  colorGray1: 'rgb(255, 255, 255)',
  colorGray2: 'rgb(250, 250, 249)',
  colorGray3: 'rgb(243, 242, 242)',
  colorGray4: 'rgb(236, 235, 234)',
  colorGray5: 'rgb(221, 219, 218)',
  colorGray6: 'rgb(201, 199, 197)',
  colorGray7: 'rgb(176, 173, 171)',
  colorGray8: 'rgb(150, 148, 146)',
  colorGray9: 'rgb(112, 110, 107)',
  colorGray10: 'rgb(81, 79, 77)',
  colorTextActionLabel: 'rgb(62, 62, 60)',
  colorTextLinkInverse: 'rgb(255, 255, 255)',
  colorTextLinkInverseActive: 'rgba(255, 255, 255, 0.5)',
  colorTextActionLabelActive: 'rgb(8, 7, 7)',
  colorTextWarning: 'rgb(255, 183, 93)',
  colorTextLinkFocus: 'rgb(0, 95, 178)',
  colorTextDestructiveHover: 'rgb(161, 43, 43)',
  colorTextLinkDisabled: 'rgb(22, 50, 92)',
  colorTextDefault: 'rgb(8, 7, 7)',
  colorTextDestructive: 'rgb(194, 57, 52)',
  colorTextLinkHover: 'rgb(0, 95, 178)',
  colorTextSuccess: 'rgb(2, 126, 70)',
  colorTextWeak: 'rgb(62, 62, 60)',
  colorTextPlaceholderInverse: 'rgb(236, 235, 234)',
  colorTextLink: 'rgb(0, 109, 204)',
  colorTextWarningAlt: 'rgb(132, 72, 0)',
  colorTextIconDefault: 'rgb(112, 110, 107)',
  colorTextBrand: 'rgb(21, 137, 238)',
  colorTextError: 'rgb(194, 57, 52)',
  colorTextCustomer: 'rgb(255, 154, 60)',
  colorTextBrandPrimary: 'rgb(255, 255, 255)',
  colorTextLinkActive: 'rgb(0, 57, 107)',
  colorTextRequired: 'rgb(194, 57, 52)',
  colorTextLinkInverseDisabled: 'rgba(255, 255, 255, 0.15)',
  colorTextInverse: 'rgb(255, 255, 255)',
  colorTextPlaceholder: 'rgb(112, 110, 107)',
  colorTextInverseWeak: 'rgb(176, 173, 171)',
  colorTextLinkInverseHover: 'rgba(255, 255, 255, 0.75)',
  colorTextSuccessInverse: 'rgb(75, 202, 129)',
  colorTextLabel: 'rgb(62, 62, 60)',
}

const textColorValues = Object.keys(textColorTokens).map((key: string) => {
  let split = (textColorTokens as { [key: string]: any })[key].split(',').map((attr: string) =>
    parseInt(
      attr
        .replace(/rgba|rgb/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, ''),
    ),
  )
  return split
})

const extractTextColor = (layer: any) => {
  let colorAttribute = layer.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute
  return [
    Math.round(256 * colorAttribute.red),
    Math.round(256 * colorAttribute.green),
    Math.round(256 * colorAttribute.blue),
  ]
}

const colors: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    for (const layer of utils.objects.text) {
      let c2 = extractTextColor(layer)

      let shouldReport = true
      textColorValues.forEach((c) => {
        if (_.isEqual(c, c2)) shouldReport = false
      })

      if (shouldReport) {
        utils.report(`${layer.name} does not use a valid text color token.`, layer)
        utils.report(`${c2}`)
      }
    }
  },
  name: 'sketch-assistant-template/colors',
  title: 'Invalid text color',
  description: 'Reports a hello world message',
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'sketch-assistant-template',
    rules: [colors],
    config: {
      rules: {
        'sketch-assistant-template/colors': { active: true },
      },
    },
  }
}

export default assistant
