import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotAuthorized : React.FC = () => {
    const navigate = useNavigate();
    return <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => navigate("/login")}>Please Login</Button>}
    />;
}
  
export {NotAuthorized};
