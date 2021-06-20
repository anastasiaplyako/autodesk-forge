import React, {useContext, useEffect, useState} from 'react';
import {CreateBucket} from "./create-bucket";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import './buckets.scss';

export const Buckets = () => {
    const auth = useContext(AuthContext);
    const [buckets, setBuckets] = useState([]);

    const fetchBuckets = () => {
        fetch('/api/forge/oss/buckets', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setBuckets(data);
            })
    }

    useEffect(() => {
        fetchBuckets();
    }, [])

    return (
        <div>
            <div className="header-buckets">
                <CreateBucket/>
            </div>
            <div className="buckets">
                {buckets.map(bucket =>
                    <Link to={`/bucket/${bucket.idBucket.idBucket}`} key={bucket._id}>
                        <img src="https://img.icons8.com/color/96/000000/folder-invoices--v1.png"/>
                        <p>{bucket.idBucket.nameBucket}</p>
                    </Link>
                )}
            </div>
        </div>
    )
}
