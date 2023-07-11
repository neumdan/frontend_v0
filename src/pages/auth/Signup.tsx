// import React, { Component, useState } from 'react';
// import {
//   Form,
//   Input,
//   Select,
//   Modal,
//   Checkbox,
//   Button,
//   Space,
// } from 'antd';
// import { Link, Navigate, useNavigate } from 'react-router-dom'
// import { useUserActions, useDataActions } from '../../_actions'
// import { useRecoilValue } from 'recoil';
// import { authAtom } from '../../_state'
// import { BankOutlined, GlobalOutlined, MailOutlined, EnvironmentOutlined, UserOutlined, GroupOutlined, LockOutlined } from '@ant-design/icons';

// function signupUser() {
//   return new Promise(resolve => {
//     setTimeout(resolve, 1000);
//   });
// }

// const initialState: React.SetStateAction<{ first_name: string; last_name: string; email: string; password: string; passwordConfirmation: string; researcher_category: string; scientific_organization_name: string; scientific_organization_country: string; scientific_organization_city: string; scientific_organization_webpage: string; referee_name: string; referee_email: string; referee_organization: string; referee_type_of_relation: string; date_agreement_presented: string; date_agreement_signed: string; agreementSigned: string; }> = {
//   first_name: '',
//   last_name: '',
//   email: '',
//   password: '',
//   passwordConfirmation:'',
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

// export {Signup}

// const Signup = () => {
//   const auth = useRecoilValue( authAtom );

//   const [
//     { first_name, 
//       last_name, 
//       email, 
//       password, 
//       passwordConfirmation, 
//       scientific_organization_name, 
//       scientific_organization_country,
//       scientific_organization_city,
//       scientific_organization_webpage,
//       referee_name,
//       referee_email,
//       referee_organization,
//       referee_type_of_relation,
//       researcher_category,
//       date_agreement_presented,
//       date_agreement_signed,
//       agreementSigned
//     },
//     setState
//   ] = useState(initialState);

//   const clearState = () => {
//     setState({ ...initialState });
//   };

//   const onChange = e => {
//     const { name, value } = e.target;
//     setState(prevState => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     signupUser().then(clearState);
//   };

//   return (
//     <Modal 
//     open={!auth}
//     title="Signup"
//     transitionName="" 
//     maskTransitionName=""
//     centered
//     closable={false}
//     footer={null}> 
//     <Form
//     onChange={onChange}
//     onFinish={handleSubmit}
//     scrollToFirstError
//     >
//         <Form.Item
//           name="first_name"
//           initialValue={first_name}
//           rules={[
//             {
//               required: true,
//               message: 'Please input your first name!',
//             },
//           ]}
//         >
//         <Input 
//           prefix={<UserOutlined className="site-form-item-icon" />} 
//           placeholder="First Name" 
//         />
//         </Form.Item>

//         <Form.Item
//           name="last_name"
//           initialValue={last_name}
//           rules={[
//             {
//               required: true,
//               message: 'Please input your last name!',
//             },
//           ]}
//         >
//         <Input 
//           prefix={<UserOutlined className="site-form-item-icon" />} 
//           placeholder="Last Name" 
//         />
//         </Form.Item>
        
//         <Form.Item
//           name="email"
//           initialValue={email}
//           rules={[
//             {
//               type: 'email',
//               message: 'The input is not valid E-mail!',
//             },
//             {
//               required: true,
//               message: 'Please input your E-mail!',
//             },
//           ]}
//         >
//         <Input 
//           prefix={<UserOutlined className="site-form-item-icon" />} 
//           placeholder="Email" 
//         />
//         </Form.Item>

//         <Form.Item
//           name="password"
//         //   value={password}
//           rules={[
//             {
//               required: true,
//               message: 'Please input your password!',
//             },
//           ]}
//           hasFeedback
//         >
//           <Input.Password 
//             prefix={<LockOutlined className="site-form-item-icon" />}
//             type="password"
//             placeholder="Password"
//           />
//         </Form.Item>
    
//         <Form.Item
//         name="passwordConfirmation"
//         // value={passwordConfirmation}
//         dependencies={['password']}
//         hasFeedback
//         rules={[
//           {
//             required: true,
//             message: 'Please confirm your password!',
//           },
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               if (!value || getFieldValue('password') === value) {
//                 return Promise.resolve();
//               }

//               return Promise.reject(new Error('The two passwords that you entered do not match!'));
//             },
//           }),
//         ]}
//       >
//         <Input.Password 
//           prefix={<LockOutlined className="site-form-item-icon" />}
//           type="password"
//           placeholder="Confirm Password"
//         />
//         </Form.Item>

//         <Form.Item
//           name="scientific_organization_name"
//           value={scientific_organization_name}
//           tooltip="What scientific institution do you represent?"
//           rules={[
//             {
//               required: true,
//               message: 'Please input the name of your scientific institution!',
//               whitespace: true,
//             },
//           ]}
//         >
//           <Input 
//             prefix={<BankOutlined className="site-form-item-icon" />}
//             placeholder="Name of Scientific Institution"
//           />
//         </Form.Item>
  
//         <Form.Item
//           name="scientific_organization_country"
//           value={scientific_organization_country}
//           tooltip="What country your scientific institution is located?"
//           rules={[
//             {
//               required: false,
//               message: 'Please input your institutions country!',
//               whitespace: true,
//             },
//           ]}
//         >
//           <Input 
//             prefix={<GlobalOutlined className="site-form-item-icon" />}
//             placeholder="Country of Scientific Institution"
//           />
//         </Form.Item>

//         <Form.Item
//           name="scientific_organization_city"
//           value={scientific_organization_city}
//           tooltip="What city your scientific institution is located?"
//           rules={[
//             {
//               required: false,
//               message: 'Please input the city your institution is located!',
//               whitespace: true,
//             },
//           ]}
//         >
//           <Input 
//             prefix={<EnvironmentOutlined className="site-form-item-icon" />}
//             placeholder="City of Scientific Institution"
//           />
//         </Form.Item>
  
//         <Form.Item
//           name="scientific_organization_webpage"
//           value={scientific_organization_webpage}
//           rules={[
//             {
//               required: false,
//               message: 'Please input your institutional website!',
//             },
//           ]}
//         >
//           <Input 
//             prefix={<GlobalOutlined className="site-form-item-icon" />}
//             placeholder="Webpage of Scientific Institution"
//           />
//         </Form.Item>

//         <Form.Item
//           name="referee_name"
//           value={referee_name}
//           rules={[
//             {
//               required: false,
//               message: 'Please input the name of your referral!',
//             },
//           ]}
//         >
//           <Input 
//             prefix={<GroupOutlined className="site-form-item-icon" />}
//             placeholder="Name of your referee"
//           />
//         </Form.Item>

//         <Form.Item
//           name="referee_email"
//           value={referee_email}
//           rules={[
//             {
//               type: 'email',
//               message: 'The input is not valid E-mail!',
//             },
//             {
//               required: false,
//               message: 'Please input your referees E-mail!',
//             },
//           ]}
//         >
//           <Input 
//             prefix={<MailOutlined className="site-form-item-icon" />}
//             placeholder="Email of your referee"
//           />
//         </Form.Item>

//         <Form.Item
//           name="referee_organization"
//           value={referee_organization}
//           rules={[
//             {
//               required: false,
//               message: 'Please input your institutional website!',
//             },
//           ]}
//         >
//           <Input 
//             prefix={<BankOutlined className="site-form-item-icon" />}
//             placeholder="Institution of your referee"
//           />
//         </Form.Item>

//         <Form.Item
//           name="referee_type_of_relation"
//           value={referee_type_of_relation}
//           rules={[
//             {
//               required: false,
//               message: 'Please input the type of relation you have to your referee.',
//             },
//           ]}
//         >
//           <Input 
//             prefix={<BankOutlined className="site-form-item-icon" />}
//             placeholder="Type of relation to your referee"
//           />
//         </Form.Item>
  
//         <Form.Item
//           name="researcher_category"
//           value={researcher_category}
//           rules={[
//             {
//               required: false,
//               message: 'Please select type of research!',
//             },
//           ]}
//         >
//           <Select 
//           placeholder="select your type of researcher" 
//           options={[{label: "Clinicians", value: "Clinicians"}, {label: "Data", value: "Data"}, {label: "Other", value: "Other"}]}
//           />
//         </Form.Item>

//         <Form.Item
//           name="agreementSigned"
//           value={agreementSigned}
//           valuePropName="checked"
//           rules={[
//             {
//               validator: (_, value) =>
//                 value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
//             },
//           ]}
//         >    
//     <Checkbox>
//     I have read the <a href="">agreement</a>
//     </Checkbox>
//         </Form.Item>

//         <Form.Item>
//           <Space>
//           <Button type="primary" htmlType="submit" disabled={true}>
//             Signup
//           </Button>
//           or 
//           <Link to="/login">Login</Link>
//           </Space>
//         </Form.Item>
//   </Form>
//   </Modal>
//   )
// };


export { }