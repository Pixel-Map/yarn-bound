/* eslint-env jest */

import YarnBound from './src/index'
import bondage from './src/bondage'
const { OptionsResult } = bondage

describe('functional test', () => {
  const dialogue = `
    title:Start
    ---
    Char: \\\\I am a l\\ine
    1 + 1 is {1 + 1}
    -> I should be disabled<<if false is true>>
      X
    -> I am a choice
      I am the line after a choice
    -> I am another choice
      Cool
    I am the line after the choices
    <<stop>>
    I should be ignored
    ===
  `

  test('should load a dialogue object into the runner', () => {
    const runner = new YarnBound({ dialogue })
    expect(runner.currentResult.text).toBe('\\I am a line')
    runner.advance()
    expect(runner.currentResult.text).toBe('1 + 1 is 2')
    runner.advance()
    expect(runner.currentResult.options).toEqual(
      new OptionsResult([
        { text: 'I should be disabled', isAvailable: false },
        { text: 'I am a choice' },
        { text: 'I am another choice' }
      ]).options.map((option) => ({ ...option, markup: [] }))
    )
    runner.advance(1)
    expect(runner.currentResult.text).toBe('I am the line after a choice')
    runner.advance()
    expect(runner.currentResult.text).toBe('I am the line after the choices')
    expect(runner.currentResult.isDialogueEnd).toBe(true)
  })
})

describe('supports indented blocks', () => {
  const dialogue = `
    title: Start
    ---
    <<declare $favoriteFood = "unknown">>
    <<if $favoriteFood is "unknown">>
    Charles: Hi, What is your favorite food?
    -> Tacos
      <<set $favoriteFood to "tacos">>
      Charles: Sweet, I'll remember that!
    -> Spam
      <<set $favoriteFood to "spam">>
      Charles: Interesting... Noting it down.
    Charles learned that you love [special]{$favoriteFood}[/special]!
    <<else>>
      I remember you... You love [special]{$favoriteFood}[/special] right?
    <<endif>>
    ===
  `

  test('should load a dialogue object into the runner', () => {
    const runner = new YarnBound({ dialogue })
    expect(runner.currentResult.text).toBe('Hi, What is your favorite food?')
    runner.advance()

    expect(runner.currentResult.options).toEqual(
      new OptionsResult([
        { text: 'Tacos' },
        { text: 'Spam' },
      ]).options.map((option) => ({ ...option, markup: [] }))
    )
    runner.advance(1)
    expect(runner.currentResult.text).toBe('Interesting... Noting it down.')
    runner.advance()
    expect(runner.currentResult.text).toBe('Charles learned that you love spam!')
    expect(runner.currentResult.isDialogueEnd).toBe(true)
  })
})
