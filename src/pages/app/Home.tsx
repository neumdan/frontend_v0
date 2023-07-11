import  {useEffect } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { authAtom, initAppAtom, apploadingAtom, countriesAtom, centersAtom} from '../../_state';
import { useDataActions } from '../../_actions';
import { Organization } from 'fhir/r5';
import { FileDoneOutlined, GlobalOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

function Home() {
  const auth = useRecoilValue(authAtom);
  const dataActions = useDataActions();
  const [init, setInit] = useRecoilState(initAppAtom)
  const setLoading = useSetRecoilState(apploadingAtom)
  const allCountries = useRecoilValue(countriesAtom)
  const allCenters = useRecoilValue(centersAtom)

  // load static data for the first time after login
  useEffect(() => {
    if (auth && init) {
      dataActions.getDonortypes();
      dataActions.getIndications();
      dataActions.getAllRegions();
      dataActions.getAllCountries();
      dataActions.getCenters();
      setInit(false);
      setLoading(false);
    }
  }, []);

  return (
    <div className="App">
    {!auth? (
      <div>
        Please Login or Signup.
      </div>
      ):(
        <>
          <h1> Welcome to the Global Transplant Registry of the WBMT. </h1>
          <div>
            Select Actions in the menu bar at the left hand side.
          </div>
          <Row gutter={16}>
          <Col span={2}/>
          <Col span={6}>
              <Card bordered={true}>
                <Statistic
                  title="Countries registered"
                  value={allCenters.filter(x => x.type === "CO").length}
                  precision={0}
                  // valueStyle={{ color: '#3f8600' }}
                  prefix={<GlobalOutlined />}
                  suffix=""
                />
              </Card>
            </Col>
            <Col span={1}/>
            <Col span={6}>
              <Card bordered={true}>
                <Statistic
                  title="Centers registered"
                  value={allCenters.filter(x => x.type === "TC").length}
                  precision={0}
                  // valueStyle={{ color: '#3f8600' }}
                  prefix={<GlobalOutlined />}
                  suffix=""
                />
              </Card>
            </Col>
            {/* </Row>
            <Row gutter={16}> */}
            {/* <Col span={6}>
              <Card bordered={true}>
                <Statistic
                  title="Questionnaire responses"
                  value={2000}
                  precision={0}
                  // valueStyle={{ color: '#cf1322' }}
                  prefix={<FileDoneOutlined />}
                  suffix="per year"
                />
              </Card>
            </Col> */}
            <Col span={1}/>
            <Col span={6}>
              <Card bordered={true}>
                <Statistic
                  title="Transplant activities reported"
                  value={1500000/1000000}
                  precision={1}
                  // valueStyle={{ color: '#cf1322' }}
                  prefix={null}
                  suffix="Mio."
                />
              </Card>
            </Col>
            <Col span={2}/>
          </Row>
          </>
      )
    }
    </div>)
}

export { Home };
