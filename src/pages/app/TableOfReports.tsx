// import React, {useState, useEffect } from 'react';
// import { Link, useParams, useLocation } from 'react-router-dom';
// import Highlighter from 'react-highlight-words';


// import { 
//   Badge,
//   Button, 
//   Dropdown,
//   Input,
//   Menu,
//   Space,
// } from 'antd';

// import { Table } from "ant-table-extensions"; // https://ant-table-extensions.vercel.app/?path=/docs/get-started--page

// import { FileAddOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
// import { useFetchWrapper } from '../../_service';

// import { donortypesAtom, indicationsAtom, reportAtom, reportlistAtom, sheetAtom, centersAtom, centersSelectedAtom } from '../../_state';
// import { selectorFamily, useRecoilValue, useRecoilState } from 'recoil';
// import { useDataActions } from '../../_actions';

// //require("es6-promise").polyfill
// //require("isomorphic-fetch")

// export default class TableOfReports extends React.Component {
//   state = {
//     searchText: '',
//     searchedColumn: '',
//     reports: [],
//     editable: false,
//     loading: true,
//     modalVisible: false,
//     selected:'',
//   };

//   componentDidMount() {
//     useFetchWrapper().get(`reports/`)
//     .then(res => {
//       const reports = res.data;
//       this.setState({ reports: reports });
//       console.log("List of Reports is loaded.", this.state.reports)
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

//   getColumnSearchProps = dataIndex => ({
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
//     filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//     onFilter: (value, record) =>
//       record[dataIndex]
//         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//         : '',
//     onFilterDropdownVisibleChange: visible => {
//       if (visible) {
//         setTimeout(() => this.searchInput.select(), 100);
//       }
//     },
//     render: text =>
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

//   handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     this.setState({
//       searchText: selectedKeys[0],
//       searchedColumn: dataIndex,
//     });
//   };

//   handleReset = clearFilters => {
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

//     const sorter = (a: number, b: number) => (isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b);
//     const columns = [
//       { title: 'Year', dataIndex: 'reporting_year', key: 'reporting_year', sorter: (a, b) => sorter(a.reporting_year, b.reporting_year)},
//       { title: 'Center', dataIndex: 'center', key: 'center', sorter: (a, b) => sorter(a.center, b.center),
//     },
//       { title: 'Date', dataIndex: 'date', key: 'date', sorter: (a: { date: number; }, b: { date: number; }) => sorter(a.date, b.date),
//     },
//       { title: 'Reporter', dataIndex: 'reporter', key: 'reporter' },
//       {
//         title: 'Report Status',
//         key: 'status',
//         render: () => (
//           <span>
//             <Badge status="success" />
//             Finished
//           </span>
//         ),
//       },
//       { title: 'Number of Teams', dataIndex: 'num_teams_reported', key: 'numOfTeams' },
//       { title: 'Status', dataIndex: 'report_status', key: 'report_status' },

//       {
//         title: 'Action',
//         dataIndex: 'operation',
//         key: 'operation',
//         render: () => (
//           <Space size="middle">
//             <a>View</a>
//             <a>Edit</a>
//             <Dropdown menu={menu}>
//               <a>
//                 More <DownOutlined />
//               </a>
//             </Dropdown>
//           </Space>
//         ),
//       },
//         //     {
//         //     title: 'Action',
//         //     key: 'action',
//         //     render: (text, record) => (<>
//         //         <Tooltip title={`Add / Edit Report for ${record.wbmt_id}`}>
//         //         < Link 
//         //             to="/dataentry"
//         //             state = {{ obj: record, fromList: true, reports: this.state.reports}}>
//         //             <Button shape="circle" icon={<FileAddOutlined />} /></Link>
//         //         </Tooltip>
//         //         {/* <Tooltip title={`View a Report from ${record.wbmt_id}`}>
//         //         < Link 
//         //             to = "/dataview"
//         //             state = {{ obj: record, fromList: true, reports: this.state.reports}}>
//         //             <Button shape="circle" icon={<FileSearchOutlined />} /></Link>
//         //         </Tooltip> */}
//         //         <Tooltip title={`Change details of ${record.wbmt_id}`}>
//         //         {/* < Link 
//         //             to = "/:centerId"
//         //             state = {{ obj: record}}> */}
//         //             <Button shape="circle" icon={<SearchOutlined />} onClick={() => this.setState({modalVisible: true, selected: record})} />
//         //             <Modal
//         //               title={`Details for Transplant Center ${this.state.selected.wbmt_id}`}
//         //               centered
//         //               transitionName=""
//         //               maskTransitionName=""
//         //               visible={this.state.modalVisible}
//         //               onOk={this.handleOk}
//         //               onCancel={this.handleCancel}
//         //               width={1000}
//         //               footer={[
//         //                 <Button key="back" onClick={this.handleCancel}>
//         //                   Return
//         //                 </Button>,
//         //                 <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
//         //                   Save
//         //                 </Button>
//         //               ]}
//         //             >
//         // <Descriptions
//         //   bordered
//         //   title=""
//         //   size="small"
//         //   extra={<Button key="edit" type="primary" loading={this.state.loading} onClick={() => this.setState({editable:true})}>Edit</Button>}
//         // >
//         //   {/* <Descriptions.Item label="WBMT ID">{this.state.editable} ? <Input placeholder="Basic usage" /> : {this.state.selected.wbmt_id}</Descriptions.Item> */}
//         //   <Descriptions.Item label="WBMT ID">{this.state.selected.wbmt_id}</Descriptions.Item>
//         //   <Descriptions.Item label="WBMT GCTN">{this.state.selected.wbmt_gctn}</Descriptions.Item>
//         //   <Descriptions.Item label="Name">{this.state.selected.name}</Descriptions.Item>
//         //   <Descriptions.Item label="Name Extended">{this.state.selected.name_2}</Descriptions.Item>
//         //   <Descriptions.Item label="Region">{this.state.selected.region}</Descriptions.Item>
//         //   <Descriptions.Item label="Type">{this.state.selected.get_type_display}</Descriptions.Item>
//         //   <Descriptions.Item label="Country">{this.state.selected.country_name}</Descriptions.Item>
//         //   <Descriptions.Item label="City">{this.state.selected.city}</Descriptions.Item>
//         //   <Descriptions.Item label="Active">{this.state.selected.active}</Descriptions.Item>
//         // </Descriptions>
//         //             </Modal>
//         //         </Tooltip>
//         //         </>
//         //     )
//         //     }
//         ]
    
//     return (
//     <Table 
//       loading={this.state.loading}
//       columns={columns}
//       rowKey={record => record.id}
//       pagination={{ defaultPageSize: 20, position: ['bottomRight']}}
//       dataSource={this.state.reports}
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

export {}