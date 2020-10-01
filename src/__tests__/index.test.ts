import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'
import { getBackgroundColors, getBorderColors, getTextColors, getFontSizes } from '../token-utils'

import * as primitiveTokens from '../design-tokens/primitive.json'
import * as actionIconTokens from '../design-tokens/bg-actions.json'
import * as standardIconTokens from '../design-tokens/bg-standard.json'
import * as customIconTokens from '../design-tokens/bg-custom.json'

import Assistant from '..'

test('border-color', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const borderColorViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/border-color',
  )?.objects

  expect(borderColorViolations?.length).toBe(1)
  expect(borderColorViolations ? borderColorViolations[0].name : null).toBe('Bad Rectangle')
  expect(ruleErrors).toHaveLength(0)
})

test('fill-color', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const fillColorViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/fill-color',
  )?.objects

  expect(fillColorViolations?.length).toBe(1)
  expect(fillColorViolations ? fillColorViolations[0].name : null).toBe('Bad Rectangle')
  expect(ruleErrors).toHaveLength(0)
})

test('text-color', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const textColorViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/text-color',
  )?.objects

  expect(textColorViolations?.length).toBe(1)
  expect(textColorViolations ? textColorViolations[0].name : null).toBe('Bad Text')
  expect(ruleErrors).toHaveLength(0)
})

test('text-font', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const fontFamilyViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/font',
  )?.objects

  expect(fontFamilyViolations?.length).toBe(1)
  expect(fontFamilyViolations ? fontFamilyViolations[0].name : null).toBe('Bad Text')
  expect(ruleErrors).toHaveLength(0)
})

test('text-size', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const fontSizeViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/text-size',
  )?.objects

  expect(fontSizeViolations?.length).toBe(1)
  expect(fontSizeViolations ? fontSizeViolations[0].name : null).toBe('Bad Text')
  expect(ruleErrors).toHaveLength(0)
})

test('getBackgroundColors', async () => {
  const tokens = primitiveTokens.properties
    .filter((p) => p.category === 'background-color' || p.category === 'color')
    .concat(actionIconTokens.properties)
    .concat(standardIconTokens.properties)
    .concat(customIconTokens.properties)

  expect(getBackgroundColors()).toHaveLength(tokens.length)
})

test('getBorderColors', async () => {
  const tokens = primitiveTokens.properties.filter(
    (p) => p.category === 'border-color' || p.category === 'color',
  )
  expect(getBorderColors()).toHaveLength(tokens.length)
})

test('getTextColors', async () => {
  const tokens = primitiveTokens.properties.filter(
    (p) => p.category === 'text-color' || p.category === 'color',
  )
  expect(getTextColors()).toHaveLength(tokens.length)
})

test('getFontSizes', async () => {
  const tokens = primitiveTokens.properties.filter((p) => p.category === 'font-size')
  expect(getFontSizes()).toHaveLength(tokens.length)
})
