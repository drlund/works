import React from 'react';

const DragHandleVertical = (props) => {
  let fillColor = props.fill ? props.fill : '#999';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill={fillColor} width="24" height="24" viewBox="0 0 24 24">
      <circle cy="6.5" cx="9.5" r="1.5"></circle>
      <circle cy="6.5" cx="14.5" r="1.5"></circle>
      <circle cy="12.5" cx="9.5" r="1.5"></circle>
      <circle cy="12.5" cx="14.5" r="1.5"></circle>
      <circle cy="18.5" cx="9.5" r="1.5"></circle>
      <circle cy="18.5" cx="14.5" r="1.5"></circle>
    </svg>
  )
}

const DragHandleHorizontal = (props) => {
  let fillColor = props.fill ? props.fill : '#999';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill={fillColor} width="64" height="20" viewBox="0 0 64 20">
      <circle cy="6.5" cx="9.5" r="1.5"></circle>
      <circle cy="12.5" cx="9.5" r="1.5"></circle>
      <circle cy="6.5" cx="14.5" r="1.5"></circle>
      <circle cy="12.5" cx="14.5" r="1.5"></circle>
      <circle cy="6.5" cx="19.5" r="1.5"></circle>
      <circle cy="12.5" cx="19.5" r="1.5"></circle>
      <circle cy="6.5" cx="24.5" r="1.5"></circle>
      <circle cy="12.5" cx="24.5" r="1.5"></circle>
      <circle cy="6.5" cx="29.5" r="1.5"></circle>
      <circle cy="12.5" cx="29.5" r="1.5"></circle>
      <circle cy="6.5" cx="34.5" r="1.5"></circle>
      <circle cy="12.5" cx="34.5" r="1.5"></circle>
      <circle cy="6.5" cx="39.5" r="1.5"></circle>
      <circle cy="12.5" cx="39.5" r="1.5"></circle>
      <circle cy="6.5" cx="44.5" r="1.5"></circle>
      <circle cy="12.5" cx="44.5" r="1.5"></circle>
      <circle cy="6.5" cx="49.5" r="1.5"></circle>
      <circle cy="12.5" cx="49.5" r="1.5"></circle>
      <circle cy="6.5" cx="54.5" r="1.5"></circle>
      <circle cy="12.5" cx="54.5" r="1.5"></circle>
    </svg>
  )
}

export {
  DragHandleVertical,
  DragHandleHorizontal
}