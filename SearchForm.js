import React from 'react'
import InputWithLabel from './InputWithLabel'
import styles from './App.module.css'
import { ReactComponent as Search } from './searchSolid.svg'

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
  }) => (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel 
        id="search" 
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      
      <button
        data-testid="999"
        type="submit"
        disabled={!searchTerm}
        className={styles.button + " " + styles.buttonSmall}
      >
      <Search height="18px" width="18px" />
      </button>          
    </form>
  )

  export default SearchForm
