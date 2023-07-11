import { Result, Button } from 'antd';


const Success = () => {
        return <Result
        status="success"
        title="Successfully Reported your Activity!"
        subTitle="Report ID: 2017182818828182881."
        extra={[
          <Button type="primary" key="list">
            Go to List of Transplant Centers
          </Button>,
          <Button key="goback"> Go to Dashboard</Button>,
        ]}
        />
}

export { Success }