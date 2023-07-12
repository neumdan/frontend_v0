import {useEffect, useState} from 'react';
import {JSONToCSVConvertor} from '../../_components'
import { 
  Cascader,
  DatePicker,
  Descriptions,
  Divider,
  Form, 
  InputNumber,
  Row, 
  Col,
  Button,
  Segmented,
  Select,
  Space,
  Typography,
  message,
  Tooltip,
  Empty} from 'antd';

import { AppstoreOutlined, BarsOutlined, DownloadOutlined, FileSyncOutlined } from '@ant-design/icons';
import { donortypesAtom, indicationsAtom, reportAtom, reportlistAtom, centersAtom, agegroupAtom } from '../../_state';
import { useRecoilValue } from 'recoil';
import { useDataActions } from '../../_actions';
import { BuildCascader, BuildSelector } from '../../_functions';

const { Text } = Typography;

const { Option } = Select;
// const centers_not_to_aggregate = new Set([101,102,103,104,105]) // listofcenters not to aggregate the country organization

const { RangePicker } = DatePicker;

const Analytics = () => {
  const indications = useRecoilValue(indicationsAtom)
  const agegroup = useRecoilValue(agegroupAtom)
  const donortypes = useRecoilValue(donortypesAtom)
  const listofcenters = useRecoilValue(centersAtom)
  const reportlist= useRecoilValue(reportlistAtom)
  const report = useRecoilValue(reportAtom);
  const [form] = Form.useForm()

  const dataActions = useDataActions();

  // render options
  const [sheetLoading, setSheetLoading] = useState(false); // trigger, if the sheet is loading

  // data to use
  const [numTeamsReported, setNumTeamsReported] = useState(null);
  const [listofselectedcenters, setListofselectedcenters] = useState([]);
  // trigger, if the sheet is editable
  const [viewsheet, setViewsheet] = useState(null);

  // const obj = fromList ? (location.state.obj):({}) // if coming from TC list then take center from object, otherwise keep {}

  const cascaderoptions = BuildCascader()
// form events
// function onQuestionnaireChange(e: any) {
//   // let questionnaire = (questionnaires.find((element) => {
//   //   return element.id === e[e.length - 1];
//   // }));
//   // setQuestionnaire(questionnaire);
//   setQuestionnaireSelected(true);
// }

function resetViewsheet(){
  setViewsheet(null)
}

function onCenterChange(value: string | any[], selectedOptions: any) {
  resetViewsheet()
  if (value && value.length > 0) {
    var coi_ids: any[] = []
    // extract only selected center id's from selected options
    for (let index = 0; index < value.length; index++) {
      coi_ids.push(value[index][value[index].length-1]);
    }
    var coi = []
    // get selected center from list of centers by id
    for (let index = 0; index < coi_ids.length; index++) {
      coi.push(listofcenters.filter(x => x.id === coi_ids[index]));
    }
    setListofselectedcenters(coi);
  }
  else {
    setListofselectedcenters([]);
  }
}

const exportSheet = () => {
  JSONToCSVConvertor(
    viewsheet, 
    donortypes, 
    indications,
    true, 
    form.getFieldValue('center'),
    form.getFieldValue('reportingyear'), 
    numTeamsReported,
    form.getFieldValue('patientAgeGroup'), 
    null)
}

// data actions
const emptySheet = () => {
  let datasheet = {}
  {indications.map(i => {
    datasheet[i.indication_id] = datasheet[i.indication_id] || {};
    {donortypes.map(d => {
      datasheet[i.indication_id][d.donor_type_id] = null;
      })}
    })}
  return datasheet
};


    /**
   * Function for returning the value of the object to show in form component
   * @param {*} sheet 
   * @param {*} ind 
   * @param {*} don 
   * @returns value
   */
     function showValue(sheet: { [x: string]: { [x: string]: any; }; }, ind: { indication_id: string | number; }, don: { donor_type_id: string | number; }) {
      try {
        return sheet[ind.indication_id][don.donor_type_id] === 0? null : sheet[ind.indication_id][don.donor_type_id]
      } catch (error) {
        //console.log("there is no value to show:", error)
        return null
        //setSheet(sheet => ({...sheet, [ind.indication_id] : {...sheet[ind.indication_id], [don.donor_type_id]: 0}}))
      }
    };

    function calculate_all_totals(currentSheet: { [x: string]: any; }){
      // Take sheet and take out index of given values
  
      // get all donortypes that are totals / aggregates and write them to total_don
      const li_donortype_totals = donortypes.filter(d => d.type === 'total')
      // for each total get the elements to aggregate and write them to obj_donortype_totals_elements
      const obj_donortype_totals_elements = []
      for (let i of li_donortype_totals) {
        const v = i.subset.split(", ").flatMap((c: any) => donortypes.filter((dt) => dt.donor_type_id === c))
        obj_donortype_totals_elements.push({"key": i, "values": v})
      }
      
      // get all donortypes that are totals / aggregates and write them to li_indication_totals
      const li_indication_totals = indications.filter(i => i.type === 'total'); //cat
      // for each total get the elements to aggregate and write them to obj_indication_totals_elements
      const obj_indication_totals_elements = []
      for (let i of li_indication_totals) {
        const v = i.subset.split(", ").flatMap((c: any) => indications.filter((ind) => ind.indication_id === c))
        obj_indication_totals_elements.push({"key": i, "values": v})
      }
  
      function checkValue(s: { [x: string]: { [x: string]: number; }; }, k1: string | number, k2: string | number) {
        try {
          if (s[k1][k2] > 0){
          return false // as if totals have been reported this is not aggregating correctly (TODO: Refine this maybe later.)
          }
        } catch (error) {
          return false
        }
      }
      function getValue(s: { [x: string]: { [x: string]: any; }; }, k1: string | number, k2: string | number) {
        try {
          return s[k1][k2] || 0
        } catch (error) {
          return 0
        }
      };
  
      for (let indication_el of indications){
          for (let d of obj_donortype_totals_elements){
            if (checkValue(currentSheet,indication_el.indication_id,d.key.donor_type_id)) {
            } else {
              const e = d.values
              .map((dt: { donor_type_id: any; }) => getValue(currentSheet, indication_el.indication_id, dt.donor_type_id))
              .reduce((result: any, number: any) => Number(result) + Number(number));
            currentSheet = {...currentSheet, [indication_el.indication_id] : {...currentSheet[indication_el.indication_id], [d.key.donor_type_id] : e}}
            }
          }
        }
      for (let donortype_el of donortypes){
        for (let i of obj_indication_totals_elements){
          // gather all values of the elements to calculate the totals
          if (checkValue(currentSheet,i.key.indication_id, donortype_el.donor_type_id)) {
          } else {
            const e = i.values
            .map((ind: { indication_id: any; }) => getValue(currentSheet, ind.indication_id, donortype_el.donor_type_id))
            .reduce((result: any,number: any) => Number(result)+Number(number));
            currentSheet = {...currentSheet, [i.key.indication_id] : {...currentSheet[i.key.indication_id], [donortype_el.donor_type_id] : e}}
            // console.log(e)
          }
        }
      }
      for (let i of obj_indication_totals_elements){
          for (let d of obj_donortype_totals_elements){
                    // gather all values of the elements to calculate the totals
          if (checkValue(currentSheet,i.key.indication_id, d.key.donor_type_id)) {
          } else {
            const e = d.values
              .map((dt: { donor_type_id: any; }) => getValue(currentSheet, i.key.indication_id, dt.donor_type_id))
              .reduce((result: any,number: any) => Number(result)+Number(number));
            currentSheet = {...currentSheet, [i.key.indication_id] : {...currentSheet[i.key.indication_id], [d.key.donor_type_id] : e}}
            // console.log(e)
          }
          }
        }
      return(currentSheet)
    }

  async function loadSheet() {
    console.info("Report used ", report, " for load sheet")
    try {
      const loadedSheet = JSON.parse(JSON.stringify({...report.report_content}))
      var cleanedSheet = calculate_all_totals(loadedSheet)
      setViewsheet({...cleanedSheet})
      setNumTeamsReported(report.num_teams_reported);
      form.setFieldsValue({
        numTeamsReported: report.num_teams_reported,
        reportStatus: report.report_status
      })
    } catch (error) {
      setViewsheet(emptySheet);
      setNumTeamsReported(0);
      resetViewsheet();
    }
    setSheetLoading(false);
  }

  useEffect(() => {
    loadSheet()
  }, [report])

  function loadReport(e: any) {
    message.info("Loading Report")
    setSheetLoading(true);
    // (1) Prepare the form data for the request
    // (1a) Get Year from Date
    const reporting_year = e.reportingyear.year()
    const patientAgeGroup = e.patientAgeGroup

    // (1b) Get list of centers
    if (e.center && e.center.length > 0) {
      // extract only selected center id's from selected options
      const coi_ids = e.center.map((x:any) => x.at(-1));
      var coi = []
      // get selected center from list of centers by id
      for (let index = 0; index < coi_ids.length; index++) {
        coi.push(listofcenters.filter(x => x.id === coi_ids[index]));
      }}

    coi = [].concat.apply([], coi)
    const params = {
      center: e.center.map((x:any) => x.at(-1)),
      reporting_year: reporting_year,
      patient_age_group: patientAgeGroup,
      // indication: e.indication,
      // donortype: e.donortype,
    }    
    // (2) for each item in children retrieve the activity reported information
    if (e.result_type === 'aggregate') {
        dataActions.aggregateReports(params)
     }
    else if (e.result_type === 'list') {
      dataActions.listReports(params);
      }
  loadSheet();
  }

  const onReset = () => {
    form.resetFields();
  };

  // const disabledDate = (current: number) => {
  //   return current < moment(2017, 'YYYY').endOf('year') //&& current > moment(Math.max(...years.map(year => year)), 'YYYY').endOf('year')
  // }

  return (
    <>
    {/* <div className="site-page-header-ghost-wrapper"> */}
    <Form
      form={form}
      onFinish={loadReport}
      // onFinishFailed={onFinishFailed}
      name = "viewsheet"
    >
      <Row wrap={false}>
        <Col flex="auto">
        </Col>
        <Col flex="none">
        <Space.Compact block>
          <Button type="primary" htmlType="submit" /* onClick={() => loadReport(form)} */ >
            <FileSyncOutlined />Load
          </Button>
          <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={exportSheet}><DownloadOutlined />Download</Button>
        </Space.Compact>
        </Col>
      </Row>
{/* Questionnaire */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={24}>
          <Form.Item
            name="questionnaire"
            label="Questionnaire"
            rules={[{ required: true, message: 'Please choose a questionnaire!' }]}
            >
                <Select
                  placeholder="Select a Questionnaire"
                  // optionFilterProp="children"
                  onChange={() => resetViewsheet}
                  // filterOption={(input, option) =>
                  //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  // }
                  // defaultValue={'wbmt_gta'}
                  options={[
                    {
                      value: 'wbmt_gta',
                      label: 'WBMT Global Transplant Activity',
                    }
                  ]}
                />
            </Form.Item>
          </Col>
      </Row>
    {/* Centers of Interest */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="center"
                label="Center"
                rules={[{ required: true, message: 'Please select the reporting center!' }]}
                >
                  <Cascader
                    allowClear
                    expandTrigger="hover"
                    options={cascaderoptions} 
                    multiple 
                    onChange={onCenterChange}
                    changeOnSelect
                    />
              </Form.Item>
            </Col>
      </Row>
    {/* Year & AgeGroup Selector */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col className="gutter-row" span={6}>
          <Form.Item
          name="reportingyear"
          label="Year of Report"
          rules={[{ required: true, message: 'Please input the year that is reported for!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              picker="year" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
            <Form.Item
            name="patientAgeGroup"
            label="Patient Age Group"
            rules={[{ required: true, message: 'Please select the patients age group that is reported for!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select an Age Group"
                optionFilterProp="children"
                onChange={resetViewsheet}
                // value={patientAgeGroup}
                // filterOption={(input, option) =>
                //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                // }
                options={BuildSelector(agegroup)}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}/>
          <Col className="gutter-row" span={4}>
          <Form.Item
            name="result_type"
            label=""
            initialValue={'aggregate'}
            >
            <Segmented
              onChange={() => resetViewsheet}
              options={[
                {
                  label: 'Aggregate',
                  value: 'aggregate',
                  icon: <AppstoreOutlined />,
                },
                {
                  label: 'List',
                  value: 'list',
                  icon: <BarsOutlined />,
                  // disabled: true,
                }
              ]}
            />
          </Form.Item>
        </Col>
        </Row>
      <Divider/>
          {/* Condition & Indication Selector */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="indication"
            label="Indication"
            rules={[{ required: false, message: 'Please choose a indications to show!' }]}
            >
                <Select
                  mode="multiple"
                  placeholder="Select a Indication"
                  optionFilterProp="children"
                  onChange={null}
                  // filterOption={(input, option) =>
                  //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  // }
                  options={BuildSelector(indications)}
                />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item
            name="donortype"
            label="Donortype"
            rules={[{ required: false, message: 'Please choose donortypes to show!' }]}
            >
                <Select
                  mode="multiple"
                  placeholder="Select a Donortypes"
                  optionFilterProp="donortypes"
                  onChange={null}
                  // filterOption={(input, option) =>
                  //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  // }
                  options={BuildSelector(donortypes)}
                />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
              <Tooltip title='(be aware: aggregate over the years)'>
                 <Text style={{width: "100%"}}>
                  Number of Centers: {numTeamsReported} 
                </Text>
              </Tooltip>
          </Col>
      </Row>
    </Form>
    {/* </div> */}
    {/* <Divider/> */}
    {(viewsheet && form.getFieldValue('report_type') === 'aggregate') ? (
        <>
        <Row wrap={false}>
          <Col span={3}>
          </Col>
          {(donortypes).map((data) => {
            return <Col span={1}>
                  <Space align="end">
                  <Tooltip title={<div>{data.donor_type_group}<br/>{data.donor_type_long}<br/></div>}><center>{data['donor_type_txt']}</center></Tooltip>
                  </Space>
                  </Col>
                  })}
        </Row>
          {(indications).map(ind => {
              return <Row wrap={false}>
                <Col span={3}>
                  <Tooltip title={<div>{ind.indication_long}<br/>{ind.indication_txt}<br/>{ind.category_long}<br/>{ind.subcategory_long}</div>}>{ind['indication_txt']}</Tooltip>
                </Col>
                    {(donortypes).map((don) => {
                        return <Col span={1}>
                          <InputNumber 
                            style={{
                            width: "100%", 
                            border: "1px solid #cccccc", 
                            background: (ind.type === "total" || don.type === "total") ? '#DFDFDF' : 'white'}}
                            value={showValue(viewsheet, ind, don)} 
                            controls={false}
                            readOnly={true}
                            data-indication={ind.indication_id}
                            data-donortype={don.donor_type_id}
                            step={1}
                            min={0}
                            bordered={false}
                            />
                          </Col>
                    })}
                  </Row>
              })}
          <Divider />
          </>
          ) : <Empty description={false} />}
          </>
   );
 };

 export { Analytics }
