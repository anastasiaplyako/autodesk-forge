import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../../context/auth.context";
import {UserBuckets} from "./user-bucket";
import {CloseCircleOutlined} from "@ant-design/icons";

export const AdminBucket = (props) => {
    const auth = useContext(AuthContext);
    const idBucket = useParams().id;
    const [users, setUsers] = useState([]);

    const getUser = () => {
        fetch(`/api/forge/buckets/user?id=${idBucket}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => res.json())
            .then(body => {
                console.log("body", body);
                console.log(body);
                setUsers(body);
            })
    }

    useEffect(() => {
        getUser();
    }, [])

    const deleteUserFromBucket = (user) => {
        console.log("user", user);
        fetch(`/api/forge/buckets/delete?id=${user._id}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        }).then(res => {
            if (res.ok) {
                setUsers(users.filter(item => user._id !== item._id))
            } else {
                alert("Error!");
            }
        })
    }

    return (
        <div className="bucket">
            <div className="bucket__container">
                <UserBuckets idBucket={idBucket}/>
                {users && users.map(user =>
                    <div className="bucket__user">
                        <span>{user.idUser.login}</span>
                        <CloseCircleOutlined onClick={() => deleteUserFromBucket(user)}/>
                    </div>
                )}
            </div>
        </div>
    )
}