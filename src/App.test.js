import React from 'react'
import { screen } from '@testing-library/react'

import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App'
import { render } from '@testing-library/react';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};
const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo]

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne }
    const state = { data: stories, isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    }
    expect(newState).toStrictEqual(expectedState)
  })
  test('Fetch the stories', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories }
    const state = { data: stories, isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    }
    expect(newState).toStrictEqual(expectedState)
  })
  test('Initialize stories fetch', () => {
    const action = { type: 'STORIES_FETCH_INIT', payload: stories }
    const state = { data: stories, isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      data: stories,
      isLoading: true,
      isError: false,
    }
    expect(newState).toStrictEqual(expectedState)
  })
  test('Story fetch failure', () => {
    const action = { type: 'STORIES_FETCH_FAILURE', payload: stories }
    const state = { data: stories, isLoading: false, isError: false }

    const newState = storiesReducer(state, action)

    const expectedState = {
      data: stories,
      isLoading: false,
      isError: true,
    }
    expect(newState).toStrictEqual(expectedState)
  })
})

describe('Item', () => {
  test('renders all properties', () => {
    render(<Item item={storyOne} />)
    screen.debug()
  })
})
describe('List', () => {
  test('renders all List properties', () => {
    render(<List list={stories} />)
    screen.debug()
  })
})
describe('SearchForm', () => {
  test('renders SearchForm', () => {
    render(<SearchForm />)
    screen.debug()
  })
})
describe('InputWithLabel', () => {
  test('renders all InputWithLabel properties', () => {
    render(<InputWithLabel defaultValue="React" />)
    screen.debug()
  })
})


