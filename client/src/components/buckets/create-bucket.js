import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import {PlusOutlined} from '@ant-design/icons';
import {Input} from "antd";

export const CreateBucket = () => {
    const auth = useContext(AuthContext);
    const [isVisible, setIsVisible] = useState(false);
    const [bucketKey, setBucketKey] = useState('');
    const [textButton, setTextButton] = useState('Создать новый bucket');

    const fetchCreateBucket = () => {
        setIsVisible(!isVisible);
        if (isVisible) {
            setTextButton('Создать новый bucket');
        } else {
            setTextButton('Cкрыть');
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/forge/oss/buckets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                bucketKey: bucketKey
            })
        }).then(res => {
            alert("Ok!");
        });
    }

    const handleChange = (event) => {
        event.preventDefault();
        setBucketKey(event.target.value);
    }

    return (
        <div className="createBucket">
            <button onClick={fetchCreateBucket}>
                {textButton}
                <PlusOutlined/>
            </button>
            {isVisible &&
            <form onSubmit={handleSubmit}>
                <label>
                    <Input type="text" placeholder="Имя bucket" value={bucketKey} onChange={handleChange}/>
                </label>
                <input type="submit" value="Отправить"/>
            </form>
            }
        </div>
    )
}
