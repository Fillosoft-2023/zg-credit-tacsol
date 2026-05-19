import React from 'react';
import { IconButton } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
export default (props) => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  return (
    <section className="pdf-container">
      <section className="pdf-toolbar" style={{display: 'flex',justifyContent : 'flex-end'}}>
        <IconButton onClick={createPdf}>
            <PrintIcon />
        </IconButton>
    
      </section>
      <section className="pdf-body" ref={bodyRef}>
        {props.children}
      </section>
    </section>
  )
}