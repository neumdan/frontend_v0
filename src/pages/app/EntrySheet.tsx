import {useState, useEffect} from 'react';
import { JSONToCSVConvertor } from '../../_components'
import moment from 'moment';
import {
  Button,
  DatePicker,
  Divider,
  Dropdown,
  Form, 
  InputNumber,
  Empty,
  Space,
  Row, 
  Col,
  message,
  Popconfirm,
  Select,
  Cascader,
  Tooltip,
  MenuProps,
} from 'antd';
import { DownloadOutlined, SaveOutlined, FileOutlined, FileDoneOutlined, FileSearchOutlined, FileProtectOutlined } from '@ant-design/icons';
import { donortypesAtom, indicationsAtom, reportAtom, centersAtom } from '../../_state';
import { useRecoilValue } from 'recoil';
import { useDataActions } from '../../_actions';
import { BuildCascader } from '../../_functions';

const EntrySheet = () => {
  //TODO Take TC-ID from the user or leave empty
  const indications = useRecoilValue(indicationsAtom)
  const donortypes = useRecoilValue(donortypesAtom)
  const centers = useRecoilValue(centersAtom);
  const report = useRecoilValue(reportAtom);
  const [form] = Form.useForm()

  // const [selectedCenter, setSelectedCenter] = useRecoilState( centerSelectedAtom )
  // const [reportingyearSelected, setReportingyearSelected] = useRecoilState( yearSelectedAtom )
  const dataActions = useDataActions();

  // render options
  const [editable, setEditable] = useState( false ); // trigger, if the sheet is editable
  const [sheetLoading, setSheetLoading] = useState( false ); // trigger, if the sheet is loading
  // conditions
  const [centerSelected, setCenterSelected] = useState( false )
  const [reportingyearSelected, setReportingyearSelected] = useState( false )
  const [patientAgeGroupSelected, setPatientAgeGroupSelected] = useState( false )
  const [questionnaireSelected, setQuestionnaireSelected] = useState( false )
  const [questionnaire, setQuestionnaire] = useState( [] )


  // data to use
  const [numTeamsReported, setNumTeamsReported] = useState( 1 );
  const [reportingyear, setReportingyear] = useState( null );
  const [center, setCenter] = useState( null );
  const [reportStatus, setReportStatus] = useState( 'o' ); // trigger, if the sheet is editable
  const [patientAgeGroup, setPatientAgeGroup] = useState( 'n' );
  const [allowToChangeReportStatus, setAllowToChangeReportStatus] = useState( true )
  const [sheet, setSheet] = useState( {} );

  const cascaderoptions = BuildCascader()

  // The Status Menu
  function handleStatusMenuClick(e) {
    message.info('Set report status to '+ e.info+ '.');
    console.log('click', e);
    setReportStatus(e.key);
    if (e.key === 'o') {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'o',
      label: "open to edit",
      icon: <FileOutlined />,
      disabled: !allowToChangeReportStatus

    },
    {
      key: 'c',
      label: "completed",
      icon: <FileDoneOutlined />,
      disabled: !allowToChangeReportStatus
    },
    {
      key: 'r',
      label: "in review",
      icon: <FileSearchOutlined />
    },
    {
      key: 'o',
      label: "published",
      icon: <FileProtectOutlined />
    },
  ];

  const emptySheet = () => {
    let datasheet = {}
    {indications.map(i => {
      datasheet[i.indication_id] = datasheet[i.indication_id] || {};
      {donortypes.map(d => {
        datasheet[i.indication_id][d.donor_type_id] = null;
        })}
      })}
    setAllowToChangeReportStatus(true)
    setReportStatus('o')
    return datasheet
  };

  function loadSheet(){
    setSheetLoading(true);
    if(report && centerSelected && reportingyearSelected && patientAgeGroupSelected)
    {
      const loadedSheet = JSON.parse(JSON.stringify({...report.report_content}))
      console.log("loaded following sheet:", loadedSheet)
      var cleanedSheet = calculate_all_totals(loadedSheet)
      console.log("loaded cleaned sheet:", cleanedSheet)
      setSheet(cleanedSheet);
      // add condition either of year or reporting status
      setNumTeamsReported(report.num_teams_reported);
      setReportStatus(report.report_status);
      // setPatientAgeGroup(report.patients_age_group);
      form.setFieldsValue({
        numTeamsReported: report.num_teams_reported,
        reportStatus: report.report_status
      })
      // setEditable(false)
      if(report.report_status == 'o'){
        console.log("Report Status is OPEN")
        setAllowToChangeReportStatus(true)
        setEditable(true)
      } else {
        console.log("Report Status is NOT OPEN")
        setAllowToChangeReportStatus(false)
        setEditable(false)
      };
    } else {
      console.log("No Report has been found - loading empty sheet")
      setSheet(emptySheet);
      setNumTeamsReported(0)
      setReportStatus('o');
      form.setFieldsValue({
        // patientAgeGroup: "n",
        numTeamsReported: 0,
        reportStatus: "o"
      })
      setAllowToChangeReportStatus(true)
      setEditable(true);
    }
    setSheetLoading(false)
  }


  function calculate_all_totals(currentSheet: { [x: string]: any; }){
    // Take sheet and take out index of given values

    // Get all totals to calculate with its values
    //TODO: Filter totals that have no value in the sheet -> as it is assumend, that the rest of this is reported

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
        return true
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
          console.log(e)
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
          console.log(e)
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
          console.log(e)
        }
        }
      }
    return(currentSheet)
  }

  function loadReport(e: { id?: any; },t: number,a: string) {
    message.info("Loading Report")
    setSheetLoading(true);
    const params = {
      center: e.id,
      reporting_year: t,
      patients_age_group: a
    };
    // load data from server
    dataActions.getReport(params)
    loadSheet();
  }

    useEffect(() => {
      loadSheet()
    }, [report])

    // useEffect(() => {
    //   form.setFieldsValue(numTeamsReported)
    //  }, [form, numTeamsReported])
    
    // if center or reportingyear are changed a new report is loaded
    useEffect(() => {
      if (centerSelected && reportingyearSelected && patientAgeGroupSelected) {
        loadReport(center, reportingyear, patientAgeGroup)
      }
    }, [centerSelected, reportingyearSelected, patientAgeGroupSelected])

  function exportSheet(e: any) {
    JSONToCSVConvertor(sheet, donortypes, indications, true, center, reportingyear, numTeamsReported, patientAgeGroup, null)
  }

  function handleChange(indication: { indication_id: any; }, donortype: { donor_type_id: any; }, e: any) {
    const cat = indication.indication_id
    const key = donortype.donor_type_id
    const val = Number(e)

    // var currentSheet = {...sheet};
    var currentSheet = {...sheet, [cat] : {...sheet[cat], [key]: val}};
    setSheet({...sheet, [cat] : {...sheet[cat], [key]: val}});
    console.log("Current Sheet:", currentSheet)
    // // filter for saving functionality
    // console.log(Object.entries(sheet))

    // get all donortypes that are totals / aggregates and write them to total_don
    const li_donortype_totals = donortypes.filter(d => d.type === 'total' && d !== donortype)
    // for each total get the elements to aggregate and write them to obj_donortype_totals_elements
    const obj_donortype_totals_elements = []
    for (let i of li_donortype_totals) {
      const v = i.subset.split(", ").flatMap((c: any) => donortypes.filter((dt) => dt.donor_type_id === c))
      obj_donortype_totals_elements.push({"key": i, "values": v})
    }

    // get all donortypes that are totals / aggregates and write them to li_indication_totals
    const li_indication_totals = indications.filter(i => i.type === 'total' && i !== indication); //cat
    // for each total get the elements to aggregate and write them to obj_indication_totals_elements
    const obj_indication_totals_elements = []
    for (let i of li_indication_totals) {
      const v = i.subset.split(", ").flatMap((c: any) => indications.filter((ind) => ind.indication_id === c))
      obj_indication_totals_elements.push({"key": i, "values": v})
    }

    // setSheet({...sheet, [cat] : {...sheet[cat], [key]: val}})
    for (let d of obj_donortype_totals_elements){
      const e = d.values
        .map((dt: { donor_type_id: string | number; }) => currentSheet[cat][dt.donor_type_id])
        .reduce((result: any, number: any) => Number(result) + Number(number));
      currentSheet[cat][d.key.donor_type_id] = e
    }

    for (let i of obj_indication_totals_elements){
      // console.log(i, i.values.map(ind => currentSheet[ind.indication_id][key]))
      // gather all values of the elements to calculate the totals#
      const e = i.values
        .map((ind: { indication_id: string | number; }) => currentSheet[ind.indication_id][key])
        .reduce((result: any,number: any) => Number(result)+Number(number));
      // add the total
      currentSheet[i.key.indication_id][key] = e

      for (let d of obj_donortype_totals_elements){
        const e = d.values
          .map((dt: { donor_type_id: string | number; }) => currentSheet[i.key.indication_id][dt.donor_type_id])
          .reduce((result: any,number: any) => Number(result)+Number(number));
        currentSheet[i.key.indication_id][d.key.donor_type_id] = e
      }
    }
    setSheet(currentSheet);
    console.log("Current Sheet after calculation:", currentSheet);
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

  function onDateChange(date, dateString) {
    setReportingyear(dateString);
    setReportingyearSelected(true);
    if (centerSelected && patientAgeGroupSelected) {
      loadReport(center, dateString, patientAgeGroup)
    }
  };

  function onQuestionnaireChange(e: any) {
    // let questionnaire = (questionnaires.find((element) => {
    //   return element.id === e[e.length - 1];
    // }));
    setQuestionnaire(e);
    setQuestionnaireSelected(true);
  }

  function onCenterChange(e: string | any[]) {
    // console.log('Cascader Response' + e + ' of type: ' + xtype(e) + " and ID:" + e[e.length - 1]);
    let center = (centers.find((element) => {
      return element.id === e[e.length - 1];
    }));
    setCenter(center);
    setCenterSelected(true);
    if (reportingyearSelected && patientAgeGroupSelected) {
      loadReport(center, reportingyear, patientAgeGroup)
    }
  }

  function onAgeGroupChange(value) {
    console.log("Selected Patient Age Group:", value);
    setPatientAgeGroup(value);
    setPatientAgeGroupSelected(true);
    if (reportingyearSelected && centerSelected) {
    loadReport(center, reportingyear, value)
    };
  }


  function resetSheet(e: any) {
    setSheet(emptySheet)
    message.success('Sheet reset.');
  }
  
  function cancel(e: any) {
    console.log(e);
    message.error('Reset aborted.');
  }

  // Cascader Functions

  const saveSheet = (e: { numTeamsReported: any; }) => {
    const data = {
      reporting_year: reportingyear,
      center: center.id,
      num_teams_reported : e.numTeamsReported,
      patients_age_group: patientAgeGroup,
      report_content: sheet,
      reporter: null,
      //TODO: here the real reporter has to be inserted
      report_status: reportStatus,
    };
    const params = {id: report?.id}
    dataActions.saveReport(data, params)
    console.log("Save sheet event data:", e)
    console.log("Check report:", data)
  };

  return (
    <>
    <Form
      form={form}
      name = "sheet"
      onFinish={saveSheet}
      initialValues={{
        center: center? center.id : null,
        reporting_year: moment(reportingyear, 'YYYY'),
        numTeamsReported: numTeamsReported,
      }}>
      <Row wrap={false}>
      <Col flex="auto">
      </Col>
      <Col flex="none">
        <Space.Compact block>
          <Form.Item>
            <Button type="primary" htmlType="submit"><SaveOutlined />Save</Button>
          </Form.Item>
          {/* <Upload><Button disabled={true} onClick={importSheet}><UploadOutlined />Upload</Button></Upload> */}
          <Button onClick={exportSheet}><DownloadOutlined />Download</Button>
          <Popconfirm 
            title="Are you sure you want to reset the sheet?" 
            onConfirm={resetSheet}
            onCancel={cancel}
            okText="Yes" 
            cancelText="No"><Button>Reset Values</Button>
          </Popconfirm>
        </Space.Compact>
        </Col>
        </Row>
        {/* Select Questionnaire */}
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={24}>
            <Form.Item
              name="questionnaire"
              label="Questionnaire"
              rules={[{ required: true, message: 'Please choose a Questionnaire!' }]}
              >
                  <Select
                    placeholder="Select a Questionnaire"
                    optionFilterProp="children"
                    onChange={onQuestionnaireChange}
                    // filterOption={(input, option) =>
                    //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    // }
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
          {/* {questionnaireSelected ? (<> */}
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="center"
                label="Center"
                rules={[{ required: true, message: 'Please enter the reporting center!' }]}
                >
                  <Cascader
                    // allowClear
                    //initialValues={selectedCenter}
                    expandTrigger="hover"
                    // loadData={loaddata}
                    options={cascaderoptions} 
                    // showSearch={{filter}}
                    onChange={onCenterChange}
                    changeOnSelect
                    />
                </Form.Item>
              </Col>
              <Col className="gutter-row" offset={1} span={4}>
            <Form.Item
            name="numTeamsReported"
            label="Number of centers"
            rules={[{ required: true, message: 'Please input the number of reporting transplant center!' }]}
            >
              <InputNumber 
                required min="0" 
                placeholder="" 
                // onChange={(e) => setNumTeamsReported(e)} 
                style={{ width: '100%' }}
                // value={numTeamsReported}
                />
            </Form.Item>
          </Col>
          </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <Form.Item
            name="reportingyear"
            label="Year of Report"
            rules={[{ required: true, message: 'Please input the year that is reported for!' }]}
            >
              <DatePicker 
                onChange={onDateChange}
                value={reportingyear}
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
                onChange={onAgeGroupChange}
                value={patientAgeGroup}
                options={[
                  { value: 'c', label: 'Children (< 18 years)' },
                  { value: 'a', label: 'Adults (≥ 18 years)' },
                  { value: 'n', label: 'Not specified', disabled: false },
                ]}
                />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
            name="reportStatus"
            label="Report status"
            // rules={[{ required: true, message: '' }]}
            >
            <Dropdown.Button onClick={handleStatusMenuClick} menu={{items}} >
              {reportStatus}
            </Dropdown.Button>
            </Form.Item>
          </Col>
        </Row>
      {/* </>):null} */}
      </Form>
      {/* Questionnaire */}
      {(centerSelected && reportingyearSelected && patientAgeGroupSelected)? (<>
      <Divider/>
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
                            value={showValue(sheet, ind, don)} 
                            controls={false}
                            readOnly={!editable || ind.type === "total" || don.type === "total"}
                            data-indication={ind.indication_id}
                            data-donortype={don.donor_type_id}
                            step={1}
                            min={0}
                            onChange={(e) => handleChange(ind, don, e)} 
                            bordered={false}
                            />
                          </Col>
                    })}
                  </Row>
              }
              )}
          <Divider />
          </>
          ) : <Empty description={false} />}
    </>
   );
 };
 export { EntrySheet }
