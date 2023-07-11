import {useState} from 'react';
import {
  useParams,
} from "react-router-dom";
import { 
  Button, 
  Form,
  Input,
  Space} from 'antd';
import { centerAtom } from '../../_state';
import { useRecoilValue } from 'recoil';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import FormBuilder from 'antd-form-builder'

import { useDataActions } from '../../_actions';

const Center = () => {
  const dataActions = useDataActions();
  const { id } = useParams();
  const center = useRecoilValue(centerAtom);
  const test = () => dataActions.getCenterDetails(id);
  console.log(test)
  console.log(id, center)

  // Modal to edit centers and form builder
  const [viewMode, setViewMode] = useState(true)
  const [pending, setPending] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState({})

  const [form] = Form.useForm()


  // dynamic forms to add representative
  // state
  const [inputFields, setInputFields] = useState([
    {name: '', email: ''}
  ])
  // add fields button handler
  const addFields = () => {
    let newfield = { name: '', email: '' }
    setInputFields([...inputFields, newfield])
  }
  // remove fields button handler
  const removeFields = (index) => {
    let data = [...inputFields];
    data.splice(index, 1)
    setInputFields(data)
}
  // form change handler
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  }

  //  const handleFinish = useCallback(values => {
  //     const data = values
  //     const params = {id: selectedCenter?.id}
  //   // console.log('Submit: ', values)
  //   // console.log("Check center data:", data)
  //   // console.log("Check center params:", params)

  //   setPending(true)
  //   setTimeout(() => {
  //     setPending(false)
  //       dataActions.updateCenter(data, params)//TODO: post values / update the values (values)
  //     setViewMode(true)
  //   }, 1500)
  // })

  const getMetaCenter = () => {
    const meta_center = {
      columns: 2,
      disabled: pending,
      dynamic: true,
      initialValues: selectedCenter,
      fields: [
        { key: 'name', label: 'Name', required: true },
        { key: 'name_2', label: 'Additional Description', required: false},
        { key: 'region', label: 'Region', required: false, readOnly: true },
        { key: 'wbmt_id', label: 'WBMT ID', required: false , readOnly: true},
        { key: 'wbmt_gctn', label: 'WBMT GCTN', required: false , readOnly: true},
        { key: 'address', label: 'Address', colSpan: 2 },
        { key: 'address_2', label: 'Address Extended', colSpan: 2 },
        { key: 'postal_code', label: 'Zip Code' },
        { key: 'city', label: 'City', required: true},
        { key: 'country_name', label: 'Country', readOnly: true },
        { key: 'type', label: 'Type of Organization', widget: 'select', options: [{'value': 'TC', 'label': 'Transplant Center'}, {'value':'CO', 'label':'Country Organization'}], readOnly: true},
        { key: 'active', label: 'Active', widget: 'switch' },
      ],
    }
    return meta_center
  }

  return (
    <Form name="center" form={form} onFinish={null} autoComplete="off">
                {/* <Form  onFinish={handleFinish}> */}
                  <h1 style={{ height: '40px', fontSize: '16px', marginTop: '10px', color: '#888' }}>
                  Center Information
                  {viewMode && (
                    <Button type="link" onClick={() => setViewMode(false)} style={{ float: 'right' }}>
                      Edit
                    </Button>
                  )}
                  </h1>
                  {/* <FormBuilder form={form} getMeta={getMetaCenter} viewMode={viewMode} /> */}
                  {/* <FormBuilder form={form} getMeta={getMetaRepresentative} viewMode={viewMode} /> */}
                  {!viewMode && (
                    <>
                    <Form.Item className="form-footer" wrapperCol={{ span: 16, offset: 4 }}>
                      <Button htmlType="submit" type="primary" disabled={false} //{pending}
                      >
                        {pending ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        onClick={() => {
                          form.resetFields()
                          setViewMode(true)
                        }}
                        style={{ marginLeft: '15px' }}
                      >
                        Cancel
                      </Button>
                    </Form.Item>
                    </>
                  )}
                {/* </Form> */}
                <h1 style={{ height: '40px', fontSize: '16px', marginTop: '10px', color: '#888' }}>
                  Representatives
                  {viewMode && (
                    <Button type="link" onClick={() => setViewMode(false)} style={{ float: 'right' }}>
                      Edit
                    </Button>
                  )}
                  </h1>

    <Form.List name="represenatives">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{
                display: 'flex',
                marginBottom: 8,
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, 'name']}
                rules={[
                  {
                    required: true,
                    message: 'Missing name',
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'email']}
                rules={[
                  {
                    required: true,
                    message: 'Missing Email',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add field
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  )
}

export { Center }
