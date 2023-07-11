import { 
    Menu
} from "antd";

import {
    GlobalOutlined,
    HomeOutlined,
    FileAddOutlined,
    PieChartOutlined,
    TeamOutlined,
    FileDoneOutlined,
    SettingOutlined,
  } from '@ant-design/icons';

import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../_state";
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}


const menu_items : MenuItem[] = [
  getItem('Home', '/', <HomeOutlined />),
  getItem('Data Entry', 'dataentry', <FileAddOutlined />),
  getItem('Analytics', 'analytics', <PieChartOutlined />),
];

const admin_menu_items : MenuItem[] = [
  getItem('Administration', 'administer', <SettingOutlined />, [
    // getItem('Campaign', 'admin/campaign', <NotificationOutlined />),
    // getItem('Questionnaire', 'admin/questionnaire', <FileOutlined />),
    getItem('Responses', 'admin/reports', <FileDoneOutlined />),
    getItem('Centers', 'admin/centers', <GlobalOutlined />),
    getItem('Users', 'admin/users', <TeamOutlined />),
  ])
];

const NavSider = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userAtom);
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        return navigate(e.key)
      };
    let menu = user?.roles?.gtr?.includes('admin') ? (menu_items.concat(admin_menu_items)) : (menu_items)

    return(
        <>
            <Menu theme="dark" 
                defaultSelectedKeys={['/home']}
                mode="inline" 
                items={menu}
                onClick={handleMenuClick}
            />
        </>
    )
}

export { NavSider }