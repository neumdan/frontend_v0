// import React, {useState, useEffect } from 'react';
// import { Link, useParams, useLocation } from 'react-router-dom';
// import Highlighter from 'react-highlight-words';

// import { 
//   Badge,
//   Button, 
//   Descriptions,
//   Dropdown,
//   Form,
//   Input,
//   InputNumber,
//   Menu,
//   Modal,
//   Popconfirm,
//   Space,
//   // Table, 
//   Tooltip 
// } from 'antd';
// import { useFetchWrapper } from '../../_service';

// import { Table } from "ant-table-extensions"; // https://ant-table-extensions.vercel.app/?path=/docs/get-started--page

// import { FileAddOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';

// //require("es6-promise").polyfill
// //require("isomorphic-fetch")

// export default class TableOfUsers extends React.Component {
//   state = {
//     searchText: '',
//     searchedColumn: '',
//     users: [],
//     editable: false,
//     loading: true,
//     modalVisible: false,
//     selected:'',
//   };

//   componentDidMount() {
//     useFetchWrapper().get(`users/`)
//     .then((res: { data: any; }) => {
//       const users = res.data;
//       this.setState({ users: users });
//       console.log("List of User is loaded.", this.state.users)
//       this.setState({ loading: false})
//       console.log(`Set loading state to ${this.state.loading}.`)
//     })
//     // this.setState({ reports: this.props.getCenters, loading: false})
//   };

//   handleOk = () => {
//     this.setState({ editable:false, loading: true });
//     setTimeout(() => {
//       this.setState({ loading: false, modalVisible: false });
//     }, 3000);
//   };

//   handleCancel = () => {
//     this.setState({ modalVisible: false });
//   };

//   getColumnSearchProps = (dataIndex: string) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//       <div style={{ padding: 8 }}>
//         <Input
//           ref={node => {
//             this.searchInput = node;
//           }}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//           onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{ marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Search
//           </Button>
//           <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({ closeDropdown: false });
//               this.setState({
//                 searchText: selectedKeys[0],
//                 searchedColumn: dataIndex,
//               });
//             }}
//           >
//             Filter
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//     onFilter: (value: string, record: { [x: string]: { toString: () => string; }; }) =>
//       record[dataIndex]
//         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//         : '',
//     onFilterDropdownVisibleChange: (visible: any) => {
//       if (visible) {
//         setTimeout(() => this.searchInput.select(), 100);
//       }
//     },
//     render: (text: { toString: () => any; }) =>
//       this.state.searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//           searchWords={[this.state.searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ''}
//         />
//       ) : (
//         text
//       ),
//   });

//   handleSearch = (selectedKeys: any[], confirm: () => void, dataIndex: any) => {
//     confirm();
//     this.setState({
//       searchText: selectedKeys[0],
//       searchedColumn: dataIndex,
//     });
//   };

//   handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     this.setState({ searchText: '' });
//   };

//   // handleClick = (value) => {
//   //   console.log(value)
//   //   this.props.history.push("/dataentry");
//   //   };

  

//   render() {
//     const menu = (
//       <Menu>
//         <Menu.Item>Change Status</Menu.Item>
//         <Menu.Item>Delete</Menu.Item>
//       </Menu>
//     );

//     const sorter = (a:string, b:string) => (isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b);
//     const columns = [
//             {
//               title: 'Family Name',
//               key: 'family_name',
//               dataIndex: 'family_name',
//               ...this.getColumnSearchProps('family_name'),
//               sorter: (a: { family_name: any; }, b: { family_name: any; }) => sorter(a.family_name, b.family_name),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['md'],
//             },
//             {
//               title: 'Given Name',
//               key: 'given_name',
//               dataIndex: 'given_name',
//               ...this.getColumnSearchProps('given_name'),
//               sorter: (a: { given_name: any; }, b: { given_name: any; }) => sorter(a.given_name, b.given_name),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['md'],
//             },
//             {
//               title: 'Email',
//               key: 'email',
//               dataIndex: 'email',
//               ...this.getColumnSearchProps('email'),
//               sorter: (a: { email: any; }, b: { email: any; }) => sorter(a.email, b.email),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['sm'],
//             },
//             {
//               title: 'SO Country',
//               key: 'scientific_organization_country',
//               dataIndex: 'scientific_organization_country',
//               //...this.getColumnSearchProps('country_name'),
//               onFilter: (value: any, record: { scientific_organization_country: string | any[]; }) => record.scientific_organization_country.indexOf(value) === 0,
//               sorter: (a: { scientific_organization_country: any; }, b: { scientific_organization_country: any; }) => sorter(a.scientific_organization_country, b.scientific_organization_country),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['md'],
//             },
//             {
//               title: 'SO Name',
//               key: 'scientific_organization_name',
//               dataIndex: 'scientific_organization_name',
//               ...this.getColumnSearchProps('scientific_organization_name'),
//               sorter: {
//                 compare: (a: { scientific_organization_name: any; }, b: { scientific_organization_name: any; }) => sorter(a.scientific_organization_name, b.scientific_organization_name),
//                 multiple: 2
//               },
//               defaultSortOrder: ['descend'],
//             },
//             {
//               title: 'SO City',
//               key: 'scientific_organization_city',
//               dataIndex: 'scientific_organization_city',
//               ...this.getColumnSearchProps('scientific_organization_city'),
//               sorter: (a: { scientific_organization_city: string; }, b: { scientific_organization_city: any; }) => a.scientific_organization_city.localeCompare(b.scientific_organization_city),
//               responsive: ['lg'],

//             },
//             {
//               title: 'Access Granted',
//               key: 'user_access_granted',
//               render: () => (
//                 <span>
//                   <Badge status="success" /> / <Badge status="error" />
//                 </span>
//               ),
//             },
//             {
//               title: 'Agreement Signed',
//               key: 'date_agreement_signed',
//               render: () => (
//                 <span>
//                   <Badge status="success" /> / <Badge status="error" />
//                 </span>
//               ),
//             },
//             { title: 'Teams', dataIndex: 'numOfTeams', key: 'numOfTeams' },
//             {
//               title: 'Action',
//               dataIndex: 'operation',
//               key: 'operation',
//               render: (text: any, record: { email: any; }) => (
//                 <Space size="middle">
//                   <Tooltip title={`View ${record.email}`}>
//                     <Link 
//                       to="/user"
//                       state = {{ obj: record, fromList: true, users: this.state.users}}>
//                       {/* <Button shape="circle" icon={<FileAddOutlined />} /> */}
//                       View
//                     </Link>
//                   </Tooltip>
//                   <Tooltip title={`Approve ${record.email}`}>
//                     <Link 
//                       to="/approve"
//                       state = {{ obj: record, fromList: true, users: this.state.users}}>
//                       {/* <Button shape="circle" icon={<FileAddOutlined />} /> */}
//                       Approve
//                     </Link>
//                   </Tooltip>
//                   <Dropdown overlay={menu}>
//                     <a>
//                       More <DownOutlined />
//                     </a>
//                   </Dropdown>
//                 </Space>
//               ),
//             },
//         ]
    
//     return (
//     <Table 
//       loading={this.state.loading}
//       columns={columns}
//       rowKey={record => record.id}
//       pagination={{ defaultPageSize: 20, position: ['bottomRight']}}
//       dataSource={this.state.users}
//       searchable
//       searchableProps={{
//         // dataSource,
//         // setDataSource: setSearchDataSource,
//         inputProps: {
//           placeholder: "Search this table...",
//         },
//         fuzzySearch: true,
//       }}
//       size="small"
//       tableLayout="auto"
//       scroll={{y: '100%', x: 'max-content'}}
//       />
//     );
//   }
// }

export { }