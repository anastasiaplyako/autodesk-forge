import React, {useEffect} from 'react'

export const Checkbox = ({ type = "checkbox", name, checked = false, onChange, viewer } ) => {
   return (
        <input type={type} name={name} checked={checked} onChange={onChange} />
    );
};