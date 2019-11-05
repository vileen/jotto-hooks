import React from 'react';
import { mount } from 'enzyme';
import { findByTestAttr } from '../test/testUtils';
import App from './App';

import hookActions from './actions/hookActions';

const mockGetSecretWord = jest.fn();

/**
 * Setup function for app component.
 * @param {string} secretWord - desired secretWord state value for test
 * @returns {ShallowWrapper}
 */
const setup = (secretWord = 'party') => {
  mockGetSecretWord.mockClear();
  hookActions.getSecretWord = mockGetSecretWord;

  const mockUseReducer = jest.fn()
    .mockReturnValue([
      { secretWord },
      function() {}
    ]);

  React.useReducer = mockUseReducer;

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

describe('secretWord is not null', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup('party');
  });

  it('renders app when secretWord is not null', () => {
    const appComponent = findByTestAttr(wrapper, 'component-app');

    // exists:
    // - no params - check if any node is returned
    // - selector - checks if any element matches the selector
    expect(appComponent.exists()).toBe(true);
  });

  it('does not render spinner when secretWord is not null', () => {
    const spinnerComponent = findByTestAttr(wrapper, 'spinner');

    expect(spinnerComponent.exists()).toBe(false);
  });
});

describe('secretWord is null', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup(null);
  });

  it('does not render app when secretWord is not null', () => {
    const appComponent = findByTestAttr(wrapper, 'component-app');

    // exists:
    // - no params - check if any node is returned
    // - selector - checks if any element matches the selector
    expect(appComponent.exists()).toBe(false);
  });

  it('renders spinner when secretWord is not null', () => {
    const spinnerComponent = findByTestAttr(wrapper, 'spinner');

    expect(spinnerComponent.exists()).toBe(true);
  });
});
