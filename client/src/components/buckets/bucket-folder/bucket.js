import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Projects} from "../../projects/projects";
import {UserBuckets} from "./user-bucket";
import {AuthContext} from "../../../context/auth.context";

export const Bucket = (props) => {
    const auth = useContext(AuthContext);
    const [bucket, setBuckets] = useState([]);
    const idBucket = useParams().id;

    const fetchBucket = () => {
        fetch(`/api/forge/buckets/?id=${idBucket}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => res.json())
            .then(body => {
                console.log("body", body);
                setBuckets(body)
                console.log(body);
            })
    }

    useEffect(() => {
        fetchBucket();
    }, [])

    {/*<UserBuckets idBucket={idBucket}/>*/}
    return (
        <div className="bucket">
            {bucket && bucket.idOwner === auth.userId &&
            <Link to={`/adminBucket/${bucket.idBucket}`} key={bucket._id}>
                <span>Администрирование</span>
            </Link>}
            <ul>
                <Projects idBucket={idBucket}/>
            </ul>
        </div>
    )
}