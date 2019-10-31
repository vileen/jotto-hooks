import React from 'react';
import { shallow } from 'enzyme';
import { checkProps, findByTestAttr } from '../test/testUtils';
import Input from './Input';

/**
 * Setup function for app component.
 * @returns {ShallowWrapper}
 */
const setup = (secretWord = 'party') => {
  return shallow(<Input secretWord={secretWord} />);
};

it('Input renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-input');
  expect(component.length).toBe(1);
});

it('does not throw warning with expecte props', () => {
  checkProps(Input, { secretWord: 'party' });
});

describe('state controlled input field', () => {
  let mockSetCurrentGuess = jest.fn();
  let wrapper;

  beforeEach(() => {
    mockSetCurrentGuess.mockClear();
    React.useState = jest.fn(() => ['', mockSetCurrentGuess]);

    wrapper = setup();
  });

  it('state updates with value of input box upon change', () => {
    const inputBox = findByTestAttr(wrapper, 'input-box');

    const mockEvent = { target: { value: 'train' }};
    inputBox.simulate('change', mockEvent);

    expect(mockSetCurrentGuess).toHaveBeenCalledWith('train');
  });

  it('field is cleared upon submit button click', () => {
    const submitButton = findByTestAttr(wrapper, 'submit-button');

    submitButton.simulate('click', { preventDefault() {}});
    expect(mockSetCurrentGuess).toHaveBeenCalledWith('');
  });
});
