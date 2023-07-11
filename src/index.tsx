import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { 
  createBrowserRouter,
  RouterProvider,
 } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import { PageNotFound } from './pages/PageNotFound';
import { NotAuthorized } from './pages/NotAuthorized';
import { Login, Logout } from './pages/auth';
import { EntrySheet, Analytics, Success, Home } from './pages/app';
import { GuardedLayout } from './_components';
import { ConfigProvider } from 'antd';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "logout",
        element: <Logout />
      },
      {
        path: "success",
        element: <Success />
      },
      {
        path: "/dataentry",
        element: <GuardedLayout requiresPermission='dataentry' />,
        children: [
        {
          path: "",
          index: true,
          element: <EntrySheet/>,
          errorElement: <NotAuthorized />,
        },
      ]},
      {
        path: "/analytics",
        element: <GuardedLayout requiresPermission='analytics' />,
        children: [
        {
          index: true,
          element: <Analytics/>,
          errorElement: <NotAuthorized />,
        },
      ]},
      {
        path: "/admin",
        element: <GuardedLayout requiresRole='admin' />,
        children: [
          // {
          //   path: "centers",
          //   element: <CenterList/>,
          // },
          // {
          //   path: "center/:id",
          //   element: <Center />,
          // },
          // {
          //   path: "reports",
          //   element: <Reports />,
          // },
          // {
          //   path: "users",
          //   element: <Users />,
          // },
          // {
          //   path: "user/:id",
          //   element: <User />,
          // },
        ],
      },
    ]}
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <RecoilRoot>
        <ConfigProvider
              theme={{ token: { borderRadius: 0 } }}
              >
          <RouterProvider router={router}/>
        </ConfigProvider>
      </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
