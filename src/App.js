import React from 'react';
import './App.css';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]
// Allows for loading data while other things happen
const getAsyncStories = () => Promise.resolve({data: { stories: initialStories }})

// Performs the actual retrieval of saved search string, if avail
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  )
  // Also saves the current search string
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])
  return [value, setValue]
}

const App = () => {
 
  // Initializes the search terms to last used or blank
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '')
  
  // Handle various state transitions
  const storiesReducer = (state, action) => {
    switch (action.type) {
      // Signal that stories are being fetch. Allow loading message to display.
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        }
      // Stories fetched, so get ready to proceed.
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        }
      // Something went wrong, so clean up the mess.
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        }
      // A story is to be removed.  Make it happen here.
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(
            story => action.payload.objectID !== story.objectID
          )
        }
      // Something unexpected happened, so handle it gracefully.
      default: 
        throw new Error()
    }
  }
  // Set up how we will handle stories.
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], 
      isLoading: false, 
      isError: false 
    }
  )

  // This features allows us to download story data
  React.useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    getAsyncStories().then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories,
      })
    })
    .catch(() => 
      dispatchStories({ type: 'STORIES_FETCH_FAILURE'})
    )
  }, [])

  // The user wishes to Dismiss a story from the list
  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }
  // Set up a search using the entered search term
  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }

  // Performs the actual search, case-insensitive
  const searchedStories = stories.data.filter(story => (
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  return (
    <div className="App">
        <h1>
          My Hacker Stories 
        </h1>
        <strong>Search: </strong>
        <InputWithLabel 
          id="search" 
          value={searchTerm}
          onInputChange={handleSearch}
        />
        <hr />
        {/* Check for possible error in getting data*/}
        {stories.isError && <p>Something went wrong...</p>}

        {/* Conditional rendering based on data availability*/}
        {stories.isLoading ? (
          <p>Loading</p>) :
          (<List list={searchedStories} 
            onRemoveItem={handleRemoveStory} 
          />)      
        }
    </div>
  )
}

// Data structure of the list of stories w removal status
const List = ({list, onRemoveItem}) => 
      list.map (item => 
        <Item 
          key={item.objectID} 
          item={item} 
          onRemoveItem={onRemoveItem}
        />)

// Handles the actual display of one story
const Item = ({ item, onRemoveItem }) => {
  function handleRemoveItem () {
    onRemoveItem(item)
  }
  return(
    <div>
      <span>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </span>
      <span> {item.author} </span>
      <span> {item.num_comments} </span>
      <span> {item.points} </span>   
      <span>
          <button type="button" onClick={handleRemoveItem}>
            Dismiss
          </button>
          </span> 
    </div>
  )
}
// Component: Labeled text box
const InputWithLabel = ({
  id, 
  value, 
  type='text', 
  onInputChange, 
  children,
}) => (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input 
        id={id}
        type={type}
        onChange={onInputChange} 
        value={value}
      />
    </>
)

export default App;
