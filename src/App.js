// SL Moore Road-to-React project. Completed 7/3/20.
// Single-page App which accesses the Hacker News database API to display a sortable list of news stories.
// User may search for stories containing manually entered searh string
// Last 5 searches are saved and listed for easy search-again.
// List of stories is displayed in a paginated fashion, displaying more stories as requested.
//
import React from 'react'
import axios from 'axios'
import styles from './App.module.css';
import SearchForm from './SearchForm'
import List from './List'

const API_BASE = 'https://hn.algolia.com/api/v1'
const API_SEARCH = '/search/'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='

// Search string submitted to the API.
const getUrl = (searchTerm,page) =>
  API_BASE + API_SEARCH + '?' + PARAM_SEARCH + searchTerm + '&' + PARAM_PAGE + page

// Search term saved and displayed with last 5 search terms.
const extractSearchTerm = url => 
  url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
    .replace(PARAM_SEARCH, '')

// Last five search terms for displaying at the top of screen.
const getLastSearches = urls => 
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url)

      if (index === 0) {
        return result.concat(searchTerm)
      }
      const previousSearchTerm = result[result.length - 1]

      if (searchTerm === previousSearchTerm) {
        return result
      }
      else {
        return result.concat(searchTerm)
      }
    }, [])
    .slice(-6)
    .slice(0, -1)

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
    // Also handles pagination
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload.page === 0 
          ? action.payload.list 
          : state.data.concat(action.payload.list),
        page: action.payload.page,
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

const App = () => {
 
  // Initializes the search terms to last used or blank
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)])

   // Set up how we will handle stories.
   const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], 
      page: 0,
      isLoading: false, 
      isError: false 
    }
  )

  // Get the stories using fetch.
  const handleFetchStories = React.useCallback(async () => {

      dispatchStories({ type: 'STORIES_FETCH_INIT' })
   
      try {
        const lastUrl = urls[urls.length-1]
        const result = await axios.get(lastUrl)
  
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: {
            list: result.data.hits,
            page: result.data.page,
          },
        })
      }  
      catch {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE'})
      }
    }, [urls])

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
  // User types search string in
  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  }
  // User presses search Submit button
  const handleSearchSubmit = event => {
    handleSearch(searchTerm, 0)
    event.preventDefault()
  }
  // Prior searches available to be called again
  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm)
    handleSearch(searchTerm, 0)
  }
  // User presses button to show more stories.
  const handleMore = () => {
    const lastUrl = urls[urls.length - 1]
    const searchTerm = extractSearchTerm(lastUrl)
    handleSearch(searchTerm, stories.page + 1)
  }
  // Search for these stories.
  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page)
    setUrls(urls.concat(url))
  }
  // Remember the previous 5 searches
  const lastSearches = getLastSearches(urls)

  // Render the page.
  return (
    <div className={styles.container}>
        <h1 className={styles.headlinePrimary}>Hacker News Topics </h1>
        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />
        
        <LastSearches
          lastSearches={lastSearches}
          onLastSearch={handleLastSearch}
        />

        <hr />
        {/* Check for possible error in getting data*/}
        {stories.isError && <p>Something went wrong...</p>}

        {/* Conditional rendering based on data availability*/}
        <List list={stories.data} onRemoveItem={handleRemoveStory} />

        <br />
        {stories.isLoading 
          ? ( <p>Loading</p>) 
          : (
              <button type="button" onClick={handleMore}>
                More
              </button>
          )
        }
      <br />
      <br />
      <br />
      <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    </div>
  )
}

// Create the buttons showing the last 5 searches.
const LastSearches = ({ lastSearches, onLastSearch }) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <button
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </button>
    ))}
  </>
)

export default App;
export { storiesReducer }
