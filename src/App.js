import React from 'react';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

// Handle retrieving and saving of the typed search string.
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
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  
  const [url, setUrl] = React.useState(
    API_ENDPOINT + searchTerm
  )

  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = () => {
    setUrl(API_ENDPOINT + searchTerm)
  }

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
  // Get the stories using fetch.
  const handleFetchStories = React.useCallback(() => {

    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    //fetch(API_ENDPOINT.concat(searchTerm))
    fetch(url)
      .then(response => response.json())
      .then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      })
    })
    .catch(() => 
      dispatchStories({ type: 'STORIES_FETCH_FAILURE'})
    )
  }, [url])

  // This features allows us to download story data
  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  // The user wishes to Dismiss a story from the list
  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }
  // Set up a search using the entered search term
  // const handleSearch = event => {
  // setSearchTerm(event.target.value)
  //}

  return (
    <div className="App">
        <h1>
          My Hacker Stories 
        </h1>

        <InputWithLabel 
          id="search" 
          value={searchTerm}
          onInputChange={handleSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>
        <button
          type="button"
          disabled={!searchTerm}
          onClick={handleSearchSubmit}
        >
          Submit 
        </button>
        <hr />
        {/* Check for possible error in getting data*/}
        {stories.isError && <p>Something went wrong...</p>}

        {/* Conditional rendering based on data availability*/}
        {stories.isLoading ? (
          <p>Loading</p>) :
          (<List list={stories.data} 
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
