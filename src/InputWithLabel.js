import React from 'react'
import styles from './App.module.css'

// Component: Labeled text box
const InputWithLabel = ({
    id, 
    value, 
    type='text', 
    onInputChange, 
    children,
  }) => (
      <>
        <label htmlFor={id} className={styles.label}>{children}</label>
        &nbsp;
        <input 
          id={id}
          type={type}
          onChange={onInputChange} 
          value={value}
        />
      </>
  )
  export default InputWithLabel
