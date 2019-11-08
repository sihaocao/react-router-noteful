import React from 'react';

export default function ValidationError(props) {
  if(props.hasError) {
    return (
      <div className="error" style={{ color: "red", fontSize:20 }}>{props.message}</div>
    );
  }

  return <></>
}