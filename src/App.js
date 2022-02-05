import * as React from "react";
import { Admin, Resource } from 'react-admin';

// Files
import { PostList, PostEdit, PostCreate  } from './components/posts';
import { UserList } from './components/users';
import Dashboard from './components/Dashboard';

// Icons
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';

import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const App = () => (
  <Admin dashboard={Dashboard} dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
    <Resource name="users" list={UserList} icon={UserIcon} />
  </Admin>
);

export default App;