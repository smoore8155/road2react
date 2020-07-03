import React from 'react'
import { ReactComponent as Trash } from './trash.svg'
import styles from './App.module.css'
import { sortBy } from 'lodash'

// Sort Dictionary
const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENT: list => sortBy(list, 'num_comments').reverse(),
  POINT: list => sortBy(list, 'points').reverse(),
}

// Data structure of the list of stories w removal status
const List = ({list, onRemoveItem}) => {
  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false,
  })
  const handleSort = sortKey => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse
    setSort({ sortKey, isReverse })
  }
  const sortFunction = SORTS[sort.sortKey]
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list)

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <span style={{width: '40%' }}>
          <button type="button" onClick={() => handleSort("TITLE")}>
            Title
          </button>
        </span>
        <span style={{width: '30%' }}>          
          <button type="button" onClick={() => handleSort("AUTHOR")}>
            Author
          </button></span>
        <span style={{width: '10%' }} align="center">          
          <button type="button" onClick={() => handleSort("COMMENT")}>
            Comments
          </button></span>
        <span style={{width: '10%' }} align="center">          
          <button type="button" onClick={() => handleSort("POINT")}>
            Points
          </button></span>
        <span style={{width: '10%' }}>Actions</span>
      </div>
  
      {sortedList.map (item => (
        <Item 
          key={item.objectID} 
          item={item} 
          onRemoveItem={onRemoveItem}
        />
      ))}
  </div>
  )
}
// Handles the actual display of one story
const Item = ({ item, onRemoveItem }) => {
  function handleRemoveItem () {
    onRemoveItem(item)
  }
  return(
    <div className={styles.item}>
      <span style={{ width: '40%' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </span>
      <span style={{ width: '30%' }}> {item.author} </span>
      <span style={{ width: '10%' }} className={styles.itemDetail} align="center"> {item.num_comments} </span>
      <span style={{ width: '10%' }} className={styles.itemDetail} align="center"> {item.points} </span>   
      <span style={{ width: '10%' }}>
        <button 
          type="button" 
          onClick={handleRemoveItem}
          className={styles.button + " " + styles.buttonSmall}
        >
          <Trash height="16px" width="16px" />
        </button>
      </span> 
    </div>
  )
}

export default List
