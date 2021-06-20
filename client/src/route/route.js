import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Viewer from "../components/Viewer/Viewer";
import {Buckets} from "../components/buckets/buckets";
import {Notes} from "../components/notes/notes";
import {Auth} from "../components/auth/auth";
import {Folders} from "../components/folder/folders";
import {Header} from "../components/header/header";
import {HeaderExpert} from "../components/header/header-expert";
import {HeaderAbout} from "../components/header/header-about";
import {Bucket} from "../components/buckets/bucket-folder/bucket";
import {Roles} from "../components/roles/role";
import {GetFile} from "../components/fileDocumentation/get-file";
import {FolderRole} from "../components/folder/folder-role";
import {Tables} from "../components/tables/tables";
import {Table} from "../components/tables/table";
import {EditDocumentation} from "../components/downloadDocumentation/edit-documentation";
import {HeaderCommon} from "../components/header/header-common";
import {UsersProject} from "../components/users-project/users-project";
import {AdminBucket} from "../components/buckets/bucket-folder/admin-bucket";
import {SettingsProject} from "../components/settings-project/settings-project";
import ViewerMain from "../components/Viewer/viewer-main";


export const useRoutes = (isAuth, userId, role) => {
    console.log("isAuth = ", isAuth, "id = ", userId, "role", role);

    if (isAuth && userId) {
        return (
            <Switch>
                <Route path="/auth">
                    <HeaderAbout/>
                    <Auth/>
                </Route>
                <Route path="/" exact>
                    <Header />
                    <Buckets/>
                </Route>
                <Route path="/model" >
                    <HeaderCommon />
                    <Viewer/>
                </Route>
                <Route path="/folders">
                    <HeaderCommon />
                    <Folders/>
                </Route>
                <Route path="/folder/:id">
                    <HeaderCommon />
                    <GetFile />
                </Route>
                <Route path="/notes">
                    <HeaderExpert />
                    <Notes/>
                </Route>
                <Route path={"/roles"}>
                    <HeaderCommon />
                   <Roles />
                </Route>
                <Route path="/buckets">
                    <Header />
                    <Buckets/>
                </Route>
                <Route path="/bucket/:id">
                    <Header />
                    <Bucket/>
                </Route>
                <Route path="/editDocumentation">
                    <HeaderCommon />
                    <EditDocumentation />
                </Route>
                <Route path="/usersProject">
                    <HeaderCommon />
                    <UsersProject />
                </Route>
                <Route path="/adminBucket/:id">
                    <Header />
                    <AdminBucket />
                </Route>
                <Route path="/folderRole">
                    <HeaderCommon />
                    <FolderRole />
                </Route>
                <Route path={"/tables"}>
                    <HeaderCommon />
                    <Tables />
                </Route>
                <Route path={"/table/:id"}>
                    <HeaderCommon />
                    <Table />
                </Route>
                <Route path={"/settings"}>
                    <HeaderCommon />
                    <SettingsProject />
                </Route>
                <Route path={"/viewerMain"}>
                    <HeaderCommon />
                    <ViewerMain />
                </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <HeaderAbout/>
                <Auth/>
            </Route>
            <Route path="/auth">
                <HeaderAbout/>
                <Auth/>
            </Route>
        </Switch>
    )

}