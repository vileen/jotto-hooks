import React from 'react';
import { mount } from 'enzyme';
import { findByTestAttr } from '../test/testUtils';
import App from './App';

import hookActions from './actions/hookActions';

const mockGetSecretWord = jest.fn();

/**
 * Setup function for app component.
 * @returns {ShallowWrapper}
 */
const setup = () => {
  mockGetSecretWord.mockClear();
  hookActions.getSecretWord = mockGetSecretWord;

  // use mount because useEffect is not called on shallow
  // https://github.com/airbnb/enzyme/issues/2086
  return mount(<App />);
};

it('App renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-app');

  expect(component.length).toBe(1);
});

describe('getSecretWord calls', () => {
  it('gets called on App mount', () => {
    setup();

    // check to see if secret word was updated
    expect(mockGetSecretWord).toHaveBeenCalled();
  });

  it('secretWord does not update on App update', () => {
    const wrapper = setup();

    // wrapper.update() doesn't trigger update
    // issue forked from https://github.com/airbnb/enzyme/issues/2091
    wrapper.setProps();

    expect(mockGetSecretWord).toHaveBeenCalledTimes(1); // only on setup
  });
});
