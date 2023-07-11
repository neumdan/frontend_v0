// This page contains a form with email and password
// 1) Verify the required fields (automatically done by ANT-Form-Component)
// 2) If Verification is ok, dispatch login action and direct user to "homepage"
// For application state, use Redux connect() function with mapStateToProps:
// 3) Redirect user to homeage by checking isLoggedIn
// 4) Show response message with message

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { 
    Button, 
    Checkbox, 
    Form, 
    Input,
    Modal,
    message,
    Typography
 } from 'antd';
 import { Link } from 'react-router-dom';
 import { useRecoilValue } from 'recoil';
 import { authAtom } from '../../_state';
 import { useUserActions } from '../../_actions';


const { Text } = Typography;


const Login = () => {
const auth = useRecoilValue( authAtom );
const userActions = useUserActions();
const [form] = Form.useForm();

  const onFinish = (values: any) => {
    return userActions.login(form.getFieldValue("email"), form.getFieldValue("password"))
        .catch(error => {
          message.error("Your credentials are not correct. Please try again.")
        });
  }

  return (
    <Modal 
    open={!auth}
    title="Login"
    transitionName="" 
    maskTransitionName=""
    centered
    closable={false}
    footer={null}> 
    <Form
      form={form}
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Link to="/forgot-password">
            Forgot password
        </Link>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        <Text> or </Text> 
        <Link to="/register">
            register now!
        </Link>
      </Form.Item>
    </Form>
    </Modal>
  );
};

export { Login };