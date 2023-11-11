import React from 'react'
import StyledCard from './StyledCard'

const StyledCardPrimary = (props) => {
  return (
    <StyledCard 
      noShadow 
      titleBGColor={"#7999b2"} 
      titleFontColor={"#fff"} 
      titleFontWeight={"bolder"}
      {...props}
    >
      {props.children}
    </StyledCard>
  )
}

export default StyledCardPrimary;