import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'

test('border-slds-color', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const borderColorViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/border-slds-color',
  )?.objects

  expect(borderColorViolations?.length).toBe(1)
  expect(borderColorViolations ? borderColorViolations[0].name : null).toBe('Bad Rectangle')
  expect(ruleErrors).toHaveLength(0)
})

test('fill-slds-color', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const fillColorViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/fill-slds-color',
  )?.objects

  expect(fillColorViolations?.length).toBe(1)
  expect(fillColorViolations ? fillColorViolations[0].name : null).toBe('Bad Rectangle')
  expect(ruleErrors).toHaveLength(0)
})

test('text-slds-color', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const textColorViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/text-slds-color',
  )?.objects

  expect(textColorViolations?.length).toBe(1)
  expect(textColorViolations ? textColorViolations[0].name : null).toBe('Bad Text')
  expect(ruleErrors).toHaveLength(0)
})

test('text-slds-font', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const fontFamilyViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/text-slds-font',
  )?.objects

  expect(fontFamilyViolations?.length).toBe(1)
  expect(fontFamilyViolations ? fontFamilyViolations[0].name : null).toBe('Bad Text')
  expect(ruleErrors).toHaveLength(0)
})

test('text-slds-size', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, './test.sketch'),
    Assistant,
  )
  const fontSizeViolations = violations.find(
    (v) => v.ruleName === 'lightning-design-system-linter/text-slds-size',
  )?.objects

  expect(fontSizeViolations?.length).toBe(1)
  expect(fontSizeViolations ? fontSizeViolations[0].name : null).toBe('Bad Text')
  expect(ruleErrors).toHaveLength(0)
})
