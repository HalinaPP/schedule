import { DatePicker, Form, Input, InputNumber, Select, Tag } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { types } from '../utilities/switcher';
import './Tables.scss';
import { EditableCellProps } from './TableSchedule.model';

const { Option } = Select;
const EditableCell: React.FC<EditableCellProps> = ({
  organizers,
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;

  switch (dataIndex) {
    case 'score':
      inputNode = <InputNumber />;
      break;
    case 'dateTime':
      inputNode = <DatePicker showTime format="YYYY-MM-DD hh:mm" allowClear={false} style={{ minWidth: 150 }} />;
      break;
    case 'organizer':
      inputNode = (
        <Select mode="multiple" showArrow={true}>
          {organizers.map((n: any, index: number) => (
            <Option key={index} value={n.id}>
              {n.name}
            </Option>
          ))}
        </Select>
      );
      break;
    case 'type':
      const options = types.map((item: any, index: number) => {
        return (
          <Option key={index} value={item.type}>
            <Tag key={index} color={item.color}>
              {item.type}
            </Tag>
          </Option>
        );
      });
      inputNode = (
        <Select defaultValue="lime" style={{ width: 200 }}>
          {options}
        </Select>
      );
      break;
    default:
      inputNode = <Input />;
      break;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={inputType === 'dateTime' ? 'date-picker' : dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: false,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
export default EditableCell;
