// import React, { useEffect, useState } from 'react';
// import { Route, Routes, useParams } from 'react-router-dom';
// import { useRecoilValue } from 'recoil';
// import { useUserActions, useDataActions } from '../../_actions'
// import {
//   Button,
//   DatePicker,
//   Descriptions,
//   Divider,
//   Dropdown,
//   Form, 
//   Input, 
//   InputNumber,
//   Menu,
//   Modal,
//   Spin,
//   Steps,
//   Space,
//   Row, 
//   Col,
//   message,
//   PageHeader,
//   Radio,
//   // Table,
//   Popconfirm,
//   Select,
//   Upload,
//   Cascader,
//   Tooltip,
// } from 'antd';

// import { userAtom } from '../../_state';
// import { Login, Signup } from '.';

export {  }

// const initialState = {
//   first_name: '',
//   last_name: '',
//   email: '',
//   password: '',
//   passwordConfirmation:'',
//   researcher_category: [],
//   scientific_organization_name: '',
//   scientific_organization_country: '',
//   scientific_organization_city: '',
//   scientific_organization_webpage: '',
//   referee_name: '',
//   referee_email: '',
//   referee_organization: '',
//   referee_type_of_relation: '',
//   researcher_category: '',
//   date_agreement_presented: '',
//   date_agreement_signed: '',
//   agreementSigned: '',
// };

// const formItemLayout = {
//   labelCol: {
//     xs: {
//       span: 24,
//     },
//     sm: {
//       span: 8,
//     },
//   },
//   wrapperCol: {
//     xs: {
//       span: 24,
//     },
//     sm: {
//       span: 16,
//     },
//   },
// };
// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 24,
//       offset: 0,
//     },
//     sm: {
//       span: 16,
//       offset: 8,
//     },
//   },
// };

// const Account = () => {

// const dataActions = useDataActions();
// const userActions = useUserActions();
// const { id } = useParams();
// const user = useRecoilValue<Object>(userAtom);
// const test = () => userActions.getUserDetails(id);
// const [form] = Form.useForm()
// const [isModalOpen, setIsModalOpen] = useState(false);
// console.log(user, test);
// const [
//   { first_name, 
//     last_name, 
//     email, 
//     password, 
//     passwordConfirmation, 
//     scientific_organization_name, 
//     scientific_organization_country,
//     scientific_organization_city,
//     scientific_organization_webpage,
//     referee_name,
//     referee_email,
//     referee_organization,
//     referee_type_of_relation,
//     researcher_category,
//     date_agreement_presented,
//     date_agreement_signed,
//     agreementSigned
//   },
//   setState
// ] = useState(initialState);

// const clearState = () => {
//   setState({ ...initialState });
// };

// // form change handler
// const handleFormChange = (index, event) => {
//   let data = [...user];
//   data[index][event.target.name] = event.target.value;
//   setInputFields(data);
// }


// const showModal = () => {
//   setIsModalOpen(true);
// };

// const onFinish = () => {
//   null;
// };

// const handleOk = () => {
//   setIsModalOpen(false);
// };

// const handleCancel = () => {
//   setIsModalOpen(false);
// };

// const onLoad = () => {
//   form.setFieldsValue({
//     note: 'Hello world!',
//     gender: 'male',
//   });
// };

// return (
//   <div>
//     <Form
//           {...formItemLayout}
//           form={form}
//           name="user"
//           onFinish={onFinish}
//           initialValues={{
//           }}
//           scrollToFirstError
//           >
//       <Form.Item
//         name="user.first_name"
//         label="First Name"
//         initialValues={user.first_name}
//         rules={[
//           {
//             required: true,
//           },
//         ]}
//       >
//         <Input onChange={e => handleFormChange(index, e)}/>
//       </Form.Item  >

//       <Form.Item
//         name='user.last_name' 
//         value={user.last_name}
//       >
//         <Input  onChange={e => handleFormChange(index, e)}/> 
//       </Form.Item>
//       <Form.Item>                 
//         <Input name='user.email' value={user.email} onChange={e => handleFormChange(index, e)}/>
//       </Form.Item>
//       <Form.Item> 
//         <Input name='user.scientific_organization_name' value={user.scientific_organization_name} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Form.Item> 
//         <Input name='user.scientific_organization_city' value={user.scientific_organization_city} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Form.Item> 
//         <Input name='user.scientific_organization_name' value={user.scientific_organization_name} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Form.Item> 
//         <Input name='user.scientific_organization_webpage' value={user.scientific_organization_webpage} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Form.Item> 
//         <Input name='user.referee_name' value={user.referee_name} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Form.Item> 
//         <Input name='user.referee_email' value={user.referee_email} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Form.Item> 
//         <Input name='user.referee_type_of_relation' value={user.referee_type_of_relation} onChange={e => handleFormChange(index, e)}/>
//         </Form.Item>
//       <Button type="primary" onClick={showModal}>
//         Change Password
//       </Button>
//       <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//         <Form.Item
//           name="password"
//           label="Password"
//           rules={[
//             {
//               required: true,
//               message: 'Please input your password!',
//             },
//           ]}
//           hasFeedback
//         >
//           <Input.Password />
//         </Form.Item>

//         <Form.Item
//           name="confirm"
//           label="Confirm Password"
//           dependencies={['password']}
//           hasFeedback
//           rules={[
//             {
//               required: true,
//               message: 'Please confirm your password!',
//             },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue('password') === value) {
//                   return Promise.resolve();
//                 }

//                 return Promise.reject(new Error('The two passwords that you entered do not match!'));
//               },
//             }),
//           ]}
//         >
//           <Input.Password />
//         </Form.Item>
//       </Modal>
//       </Form>

//   </div>
// )
// }