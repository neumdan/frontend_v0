// import {useState} from 'react';
// import { 
//   Badge,
//   Button, 
//   Dropdown,
//   Form,
//   Modal,
//   Space,
//   Table, 
//   Tooltip 
// } from 'antd';
// import type { MenuProps } from 'antd';

// // import { Table } from "ant-table-extensions"; // https://ant-table-extensions.vercel.app/?path=/docs/get-started--page
// import { ZoomInOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { countriesAtom, reportlistAtom, centersAtom, centerSelectedAtom } from '../../_state';
// import { useDataActions } from '../../_actions';
// import { Link } from 'react-router-dom'
// import { Center } from '../../types';
// // import "../../styles/CenterList.css"
// // import FormBuilder from 'antd-form-builder'


// //require("es6-promise").polyfill
// //require("isomorphic-fetch")

// function CenterList() {
//   // handling states
//   const [searchText, setSearchText] = useState('')
//   const [searchedColumn, setSearchedColumn] = useState('')
//   const [editable, setEditable] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [modalVisible, setModalVisible] = useState(false)
//   const [centerForm, setCenterForm] = useState({})

//   const dataActions = useDataActions();
//   const setCenterSelected = useSetRecoilState(centerSelectedAtom)
//   const reportlist = useRecoilValue(reportlistAtom)
//   const centers = useRecoilValue( centersAtom )
//   const countries = useRecoilValue ( countriesAtom )

//   // Modal to edit centers and form builder
//   const [form] = Form.useForm()
//   const [viewMode, setViewMode] = useState(true)
//   const [pending, setPending] = useState(false)
//   const [selectedCenter, setSelectedCenter] = useState(null)

//   // const handleFinish = useCallback(values => {
//   //     const data = values
//   //     const params = {id: selectedCenter?.id}
//   //   console.log('Submit: ', values)
//   //   console.log("Check center data:", data)
//   //   console.log("Check center params:", params)

//   //   setPending(true)
//   //   setTimeout(() => {
//   //     setPending(false)
//   //       dataActions.updateCenter(data, params)//TODO: post values / update the values (values)
//   //     setViewMode(true)
//   //     setModalVisible(false);
//   //   }, 1500)
//   // })

//   const onSubmit = () => {
//     setViewMode(true);
//     form.resetFields()
//     setModalVisible(false);
//   }

//   const onClose = () => {
//     setViewMode(true);
//     form.resetFields()
//     setModalVisible(false);
//   };

//   const makeEditable = () => {
//     setEditable(!editable);
//   }

//   const getMetaCenter = () => {
//     const meta_center = {
//       columns: 2,
//       disabled: pending,
//       dynamic: true,
//       initialValues: selectedCenter,
//       fields: [
//         { key: 'name', label: 'Name', required: true },
//         { key: 'name_2', label: 'Additional Description', required: false},
//         { key: 'region', label: 'Region', required: false, readOnly: true },
//         { key: 'wbmt_id', label: 'WBMT ID', required: false , readOnly: true},
//         { key: 'wbmt_gctn', label: 'WBMT GCTN', required: false , readOnly: true},
//         { key: 'address', label: 'Address', colSpan: 2 },
//         { key: 'address_2', label: 'Address Extended', colSpan: 2 },
//         { key: 'postal_code', label: 'Zip Code' },
//         { key: 'city', label: 'City', required: true},
//         { key: 'country_name', label: 'Country', readOnly: true },
//         { key: 'type', label: 'Type of Organization', widget: 'select', options: [{'value': 'TC', 'label': 'Transplant Center'}, {'value':'CO', 'label':'Country Organization'}], readOnly: true},
//         { key: 'active', label: 'Active', widget: 'switch' },
//       ],
//     }
//     return meta_center
//   }

//   // const getMetaRepresentative = () => {
//   //   const meta_representatives = {
//   //     columns: 2,
//   //     disabled: pending,
//   //     dynamic: true,
//   //     initialValues: selectedCenter,
//   //     fields: [
//   //       { key: 'representatives.first_name', label: 'Representative First Name', required: false},
//   //       { key: 'representatives.last_name', label: 'Representative Last Name', required: false},
//   //       { key: 'representatives.email', label: "Representative Email", rules: [{ type: 'email', message: 'Invalid email'}], required: true},

//   //     ],
//   //   }
//   //   return meta_representatives
//   // }

//   // const getColumnSearchProps = (dataIndex) => ({
//   //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//   //     <div style={{ padding: 8 }}>
//   //       <Input
//   //         ref={node => {
//   //           setSearchText(node);
//   //         }}
//   //         placeholder={`Search ${dataIndex}`}
//   //         value={selectedKeys[0]}
//   //         onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//   //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//   //         style={{ marginBottom: 8, display: 'block' }}
//   //       />
//   //       <Space>
//   //         <Button
//   //           type="primary"
//   //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//   //           icon={<SearchOutlined />}
//   //           size="small"
//   //           style={{ width: 90 }}
//   //         >
//   //           Search
//   //         </Button>
//   //         <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//   //           Reset
//   //         </Button>
//   //         <Button
//   //           type="link"
//   //           size="small"
//   //           onClick={() => {
//   //             confirm({ closeDropdown: false });
//   //             setSearchText(selectedKeys[0]);
//   //             setSearchedColumn(dataIndex);
//   //           }}
//   //         >
//   //           Filter
//   //         </Button>
//   //       </Space>
//   //     </div>
//   //   ),
//   //   filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//   //   onFilter: (value, record) =>
//   //     record[dataIndex]
//   //       ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//   //       : '',
//   //   onFilterDropdownVisibleChange: visible => {
//   //     if (visible) {
//   //       setTimeout(() => searchInput.select(), 100);
//   //     }
//   //   },
//   //   render: text =>
//   //     searchedColumn === dataIndex ? (
//   //       <Highlighter
//   //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//   //         searchWords={[searchText]}
//   //         autoEscape
//   //         textToHighlight={text ? text.toString() : ''}
//   //       />
//   //     ) : (
//   //       text
//   //     ),
//   // });

//   // function handleSearch(selectedKeys, confirm, dataIndex){
//   //   confirm();
//   //   setSearchText(selectedKeys[0]);
//   //   setSearchedColumn (dataIndex);
//   // };

//   function handleReset(clearFilters) {
//     clearFilters();
//     setSearchText('');
//   }; 


//   const items: MenuProps['items'] = [
//     {
//       label: 'Change Status',
//       key: '1',
//     },
//     {
//       label: 'Delete',
//       key: '2',
//     },
//   ];

//   const expandedRowRender = (record) => {
//     console.log("Record:", record)
//     const params = {center: record.id};
//     console.log(reportlist)
//     const columns = [
//       { title: 'Year', dataIndex: 'reporting_year', key: 'reporting_year', sorter: (a, b) => sorter(a.reporting_year, b.reporting_year)},
//       { title: 'Reporter', dataIndex: 'reporter', key: 'reporter' },
//       { title: 'Report Status',
//         key: 'status',
//         render: () => (
//           <span>
//             <Badge status="success" />
//             Finished
//           </span>
//         ),
//       },
//       { title: 'Number of Teams', dataIndex: 'num_teams_reported', key: 'num_teams_reported' },
//       { title: 'Number of Patients', dataIndex: 'totalPatientsReported', key: 'totalPatientsReported' },
//       { title: 'Action',
//         dataIndex: 'operation',
//         key: 'operation',
//         render: () => (
//           <Space size="middle">
//             <a>View</a>
//             <a>Edit</a>
//             <Dropdown menu={{items}}>
//               <a>
//                 More <DownOutlined />
//               </a>
//             </Dropdown>
//           </Space>
//         ),
//       },
//     ];
//   return <Table columns={columns} dataSource={reportlist} pagination={false} />;
//   };
  

//   const sorter = (a, b) => (isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b);
//     const columns = [
//             {
//               title: 'CIC',
//               key: 'region',
//               dataIndex: 'region',
//               width: '8%',
//               fixed: 'left',
//               filters: [
//                 {
//                   text: "101: SOUTH-EAST ASIA / WESTERN PACIFIC",
//                   value: 101,
//                 },
//                 {
//                   text: "102: CANADA",
//                   value: 102,
//                 },
//                 {
//                   text: "103: NORTH AMERICA",
//                   value: 103,
//                 },
//                 {
//                   text: "104: EUROPE",
//                   value: 104,
//                 },
//                 {
//                   text: "105: EASTERN MEDITERRANEAN / AFRICA",
//                   value: 105,
//                 },
//                 {
//                   text: "106: SOUTH & MIDDLE AMERICA",
//                   value: 106,
//                 }
//               ],
//               // onFilter: (value, record) => record.region
//               // ? record.region
//               //     .toString()
//               //     .toLowerCase()
//               //     .includes(value.toLowerCase())
//               // : true,
//               onFilter: (value, record) => record.region === value,
//               //filterSearch:(input, record) => record.value.indexOf(input) > -1,
//               sorter: {
//                 compare: (a, b) => sorter(a.region, b.region),
//                 multiple: 3,
//               },
//               defaultSortOrder: ['ascend'],
//               responsive: ['sm'],

//             },
//             {
//               title: 'ID',
//               key: 'wbmt_id',
//               width: '8%',
//               fixed: 'left',
//               dataIndex: 'wbmt_id',
//               // ...getColumnSearchProps('wbmt_id'),
//               sorter: (a, b) => sorter(a.wbmt_id, b.wbmt_id),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['sm'],
//             },
//             {
//               title: 'Type',
//               key: 'type',
//               dataIndex: 'type',
//               width: '8%',
//               fixed: 'left',
//               filters: [
//                 {
//                   text: "Country Organization (CO)",
//                   value: "CO",
//                 },
//                 {
//                   text: "Transplant Center (TC)",
//                   value: "TC",
//                 },
//                 {
//                   text: "Region Organization (RO)",
//                   value: "RO",
//                 },
//                 {
//                   text: "Head Organization (HO)",
//                   value: "HO",
//                 },
//                 {
//                   text: "Donor Registry (DR)",
//                   value: "DR",
//                 }
//               ],
//               onFilter: (value, record) => record.type === value,
//               sorter: (a, b) => sorter(a.type, b.type),
//               //...getColumnSearchProps('get_type_display'),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['md'],
//             },
//             {
//               title: 'Country',
//               key: 'country_name',
//               dataIndex: 'country_name',
//               width: '16%',

//               // ...getColumnSearchProps('country_name'),
//               //filterMode: 'tree',
//               filters: countries,
//               onFilter: (value, record) => record.country_iso === value,
//               filterSearch: true,
//               sorter: (a, b) => sorter(a.country_name, b.country_name),
//               sortDirections: ['descend', 'ascend'],
//               responsive: ['md'],
//             },
//             // {
//             //   title: 'ISO',
//             //   key: 'country_iso',
//             //   dataIndex: 'country_iso',
//             //   ...getColumnSearchProps('country_iso'),
//             //   sorter: {
//             //     compare: (a, b) => a.country_iso.localeCompare(b.country_iso),
//             //     multiple: 2
//             //   },
//             //   defaultSortOrder: ['descend'],
//             // },
//             {
//               title: 'City',
//               key: 'city',
//               dataIndex: 'city',
//               width: '16%',
//               // ...getColumnSearchProps('city'),
//               sorter: (a, b) => a.city.localeCompare(b.city),
//               responsive: ['lg'],

//             },
//             {
//               title: 'Name',
//               key: 'name',
//               dataIndex: 'name',
//               width: '16%',

//               // ...getColumnSearchProps('name'),
//               sorter: (a, b) => a.name.localeCompare(b.name),
//               responsive: ['md'],
//             },
//             {
//               title: 'GCTN',
//               width: '16%',
//               key: 'wbmt_gctn',
//               dataIndex: 'wbmt_gctn',
//               // ...getColumnSearchProps('wbmt_gctn'),
//               sorter: (a, b) => a.wbmt_gctn.localeCompare(b.wbmt_gctn),
//               responsive: ['md'],
//             },
//             {
//             title: 'Action',
//             key: 'action',
//             fixed: 'right',
//             width: '8%',
//             render: (record:Center) => (<>
//                 {/* <Tooltip title={`Add / Edit Report for ${record.wbmt_id}`}>
//                   <Button shape="circle" icon={<FileAddOutlined />} onClick={() => {setCenterSelected(record)}} />
//                 </Tooltip> */}
//                 <Tooltip title={`Open the Center Site for ${record.wbmt_id}`}>
//                   <Link to={`/center/${record.id}`}>
//                     <Button disabled={false} shape="circle" icon={<ZoomInOutlined />} />
//                   </Link>
//                 </Tooltip>
//                 <Tooltip title={`Change details of ${record.wbmt_id}`}>
//                 <Button shape="circle" icon={<SearchOutlined />} onClick={() => {
//                     setModalVisible(true);
//                     setSelectedCenter(record);
//                     console.log(record, selectedCenter)
//                     }} />
//                 </Tooltip>
//                 <Modal
//                   title={`Details for Center ${selectedCenter.wbmt_id}: ${selectedCenter.name}`}
//                   transitionName="" 
//                   maskTransitionName="" 
//                   mask = {false}
//                   centered
//                   visible={modalVisible}
//                   destroyOnClose
//                   onOk = {onSubmit}
//                   onCancel={onClose}
//                   width={1200}
//                   footer={null}
//                 >
//                 <Form form={form} onFinish={null}>
//                   <h1 style={{ height: '40px', fontSize: '16px', marginTop: '10px', color: '#888' }}>
//                   Center Information
//                   {viewMode && (
//                     <Button type="link" onClick={() => setViewMode(false)} style={{ float: 'right' }}>
//                       Edit
//                     </Button>
//                   )}
//                   </h1>
//                   {/* <FormBuilder form={form} getMeta={getMetaCenter} viewMode={viewMode} /> */}
//                   {/* <FormBuilder form={form} getMeta={getMetaRepresentative} viewMode={viewMode} /> */}
//                   {!viewMode && (
//                     <>
//                     <Form.Item className="form-footer" wrapperCol={{ span: 16, offset: 4 }}>
//                       <Button htmlType="submit" type="primary" disabled={false} //{pending}
//                       >
//                         {pending ? 'Updating...' : 'Update'}
//                       </Button>
//                       <Button
//                         onClick={() => {
//                           form.resetFields()
//                           setViewMode(true)
//                         }}
//                         style={{ marginLeft: '15px' }}
//                       >
//                         Cancel
//                       </Button>
//                     </Form.Item>
//                     </>
//                   )}
//                 </Form>
//                 </Modal>
//                 </>
//             )
//             }
//         ]
    
//     return (
//       <>
//       <div className="site-page-header-ghost-wrapper">
//       {/* <Button
//         onClick={null}
//         type="primary"
//         style={{
//           marginBottom: 16,
//         }}
//       >
//         Add a center
//       </Button> */}
//       <Table 
//         loading={loading}
//         columns={columns}
//         rowKey={(record) => record.id}
//         pagination={{ defaultPageSize: 20, position: ['bottomRight']}}
//         // expandable={{
//         //   expandedRowRender: record => (
//         //     <p style={{ margin: 0 }}>{record.id}</p>
//         //   ),
//         //   expandIcon: ({ expanded, onExpand, record, expandable }) =>
//         //     expanded ? (
//         //       <MinusSquareOutlined onClick={e => onExpand(
//         //         console.log("Closed")
//         //         )} />
//         //     ) : (
//         //       <PlusSquareOutlined onClick={e => onExpand(record,e,
//         //         dataActions.listReports({center: record.id})
//         //         )} />
//         //     )
//         // }}
//         dataSource={centers}
//         searchable
//         searchableProps={{
//           // dataSource,
//           // setDataSource: setSearchDataSource,
//           inputProps: {
//             placeholder: "Search this table...",
//           },
//           fuzzySearch: true,
//         }}
//         size="small"
//         tableLayout="auto"
//         // scroll={{y: '100%', x: 'max-content'}}
//         />
//         </div>
//         </>
//         );
//       }

export {  }
