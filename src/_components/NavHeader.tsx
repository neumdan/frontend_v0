import { 
    Row,
    Image,
    Col,
    MenuProps,
    Dropdown,
 } from "antd";

 import { 
    SettingOutlined, 
    LoginOutlined, 
    LogoutOutlined, 
    UserOutlined,
    UserAddOutlined
} from '@ant-design/icons';

import { useNavigate } from "react-router-dom";


import { useRecoilState } from 'recoil';
import { authAtom } from '../_state'

const NavHeader = () => {
    const [auth] = useRecoilState(authAtom);

    const navigate = useNavigate();

    // User Account
    const account_items: MenuProps['items'] = !auth?
      [{
        label: 'Login',
        key: 'login',
        // disabled: auth,
        icon: <LoginOutlined />,
      },{
        label: 'Signup',
        key: 'signup',
        // disabled: auth,
        icon: <UserAddOutlined />
      }
      ]:[
        {
        label: 'Account',
        key: 'account', //`user/${user.user_id}`,
        icon: <SettingOutlined />,
      },
      {
        label: 'Logout',
        key: 'logout',
        // disabled: !auth,
        icon: <LogoutOutlined />,
        danger: true,
      }
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
      return navigate(e.key)
    };

    const menuProps = {
      items: account_items,
      onClick: handleMenuClick,
    };

    return(
        <Row 
            gutter={[16, 16]}
            align="middle"
            justify="end"
            >
              <Col flex="none">
                <Image
                  width={48}
                  preview={false}
                  src="https://www.wbmt.org/wp-content/themes/ysd-wbmt/assets/images/logo.png"/>
             </Col>
             <Col flex="auto" style={{ color: "#ffffff" }}>
                  Global Transplant Registry
              </Col>
              <Col flex="none">
                  <Dropdown.Button menu={menuProps}><UserOutlined /></Dropdown.Button>
              </Col>
        </Row>
    )
}

export { NavHeader }