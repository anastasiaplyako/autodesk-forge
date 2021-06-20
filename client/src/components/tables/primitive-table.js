import React, {useContext, useState} from 'react';
import './table.scss';
import {AuthContext} from "../../context/auth.context";
import {useParams} from "react-router-dom";
import 'materialize-css';

export const PrimitiveTable = (props) => {
    const auth = useContext(AuthContext);
    const [isUpdate, setIsUpdate] = useState(false);
    const [value, setValue] = useState('');
    let workbook = props.workbook;
    const id = useParams().id;
    const [updateCell, setUpdateCell] = useState({
        row: '',
        column: '',
    })

    const setUpdate = () => {
        setIsUpdate(!isUpdate);
    }

    const changeHandler = (event) => {
        setValue(event.target.value);
    }

    const clickHandler = (rowIndex, columnIndex, value) => {
        setUpdate();
        setUpdateCell({
            row: rowIndex,
            column: columnIndex
        });
        setValue(value);
    }

    const fetchUpdate = () => {
        workbook.data[updateCell.row][updateCell.column] = value;
        fetch('/api/forge/table/updateTable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
                workbook: workbook,
                id: id
            })
        }).then(res => res.json())
    }

    return (
        <div className="table">
            <button onClick={fetchUpdate}>Сохранить</button>
            <table className="centered">
                {workbook && workbook.data.map((row, rowIndex) => {
                    return rowIndex === 0
                        ? <thead>{
                            <tr>
                                {row.map((column, columnIndex) => {
                                    return (
                                        (isUpdate && updateCell.column === columnIndex && updateCell.row === rowIndex)
                                            ? <th>
                                                <input value={value} onChange={changeHandler}/>
                                            </th>
                                            : <th>
                                                <p
                                                    onClick={() => {
                                                        clickHandler(rowIndex, columnIndex, column)
                                                    }}>
                                                    {column}
                                                </p>
                                            </th>
                                    )
                                })}
                            </tr>
                        }</thead>
                        : <tbody>{
                            <tr>
                                {row.map((column, columnIndex) => {
                                    return (
                                        (isUpdate && updateCell.column === columnIndex && updateCell.row === rowIndex)
                                            ? <td><input value={value} onChange={changeHandler}/></td>
                                            : <td><p onClick={() => {
                                                clickHandler(rowIndex, columnIndex, column)
                                            }}>{column}</p></td>
                                    )
                                })}
                            </tr>
                        }</tbody>
                })}
            </table>
        </div>
    )
}

