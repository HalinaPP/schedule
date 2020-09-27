/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Tag } from 'antd';
import 'antd/dist/antd.css';
import React, { useCallback, useEffect, useState } from 'react';
import { columnSetWidth, dateAndTimeFormat } from '../utilities';
import './Tables.scss';
import { TableSchedule } from './TableSchedule';

export const TableScheduleContainer = (props: any) => {
  const {
    columnsName,
    notEditableColumns,
    data,
    isMentorStatus,
    putDataEvent,
    organizers,
    getDataEvent,
    addDataEvent,
    deleteDataEvent,
    initialEventData,
    types,
    widthScreen,
    setWidthScreen,
    timeZone,
  } = props;

  const userColumnsName = isMentorStatus ? columnsName.filter((item: string) => item !== 'combineScore') : columnsName;
  const columnsNameMap = userColumnsName.map((n: string) => ({ value: n }));

  const [form] = Form.useForm();
  const [mapsColumnsName, setMapColumnsName] = useState([]);
  const [editingId, setEditingId] = useState('');
  const isEditing = (record: any) => record.id === editingId;
  const [isLoading, setIsLoading] = useState(false);
  const [isVoted, setIsVoted] = useState<any>([]);

  const edit = useCallback((record: any) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
  }, []);

  const cancel = useCallback(() => {
    setEditingId('');
  }, []);

  const add = async () => {
    setIsLoading(true);
    const newId = await addDataEvent(initialEventData);
    await getDataEvent();
    setIsLoading(false);
    edit(newId.data);
  };
  const remove = async (id: React.Key) => {
    setIsLoading(true);
    await deleteDataEvent(id);
    await getDataEvent();
    setIsLoading(false);
  };
  const save = async (id: React.Key) => {
    setIsLoading(true);
    const row = (await form.validateFields()) as any;
    let organizer: string | undefined;
    if (row.organizer instanceof Array) {
      organizer = row.organizer.join(',');
    }
    const newData = [...data];
    const item = newData.find((item) => id === item.id);
    !!row['date-picker'] && (item.dateTime = row['date-picker'].format(dateAndTimeFormat));
    delete row['date-picker'];
    const indexElement = newData.findIndex((n) => item.id === n.id);
    newData.splice(indexElement, 1, {
      ...item,
      ...row,
      organizer,
    });
    await putDataEvent(item.id, newData[indexElement]);
    setEditingId('');
    setIsLoading(false);
  };

  const changeRating = async (value: number, record:any) => {
    const currEventRating = record?.rating;
    const numVoted = currEventRating && currEventRating.voted && currEventRating.voted > 0 ? currEventRating.voted+1 : 1;
    const sumRating = currEventRating && currEventRating.sum && currEventRating.sum > 0  ? (value + currEventRating.sum) : value;
    record.rating = { voted: numVoted, sum: sumRating }
    await putDataEvent( record.id,  record);
    setIsVoted((state:Array<any>)  => {
      return  [...state, {"id":record.id, "value": true }];
     });
    
  };

  const defaultColumns = userColumnsName;

  const tagRender = useCallback((props: any) => {
    const { label, closable, onClose } = props;
    return (
      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3, fontSize: 10 }}>
        {label}
      </Tag>
    );
  }, []);

  const changeColumnsSelect = useCallback((value: any) => {
    const mapColumns = value.map((n: string) => ({
      title: n,
      dataIndex: n,
      editable: notEditableColumns.findIndex((item: string) => item === n) === -1 ? true : false,
    }));
    setMapColumnsName(mapColumns);
  }, []);

  useEffect(() => {
    const userColumns = isMentorStatus
      ? mapsColumnsName.filter((item: any) => item.title !== 'combineScore')
      : mapsColumnsName;
    setMapColumnsName(userColumns);
  }, [isMentorStatus]);

  const updateDimensions = useCallback(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
    if (widthScreen !== window.innerWidth) {
      window.addEventListener('resize', updateDimensions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.addEventListener]);

  useEffect(() => {
    const mapColumns: any = defaultColumns.map((n: string) => ({
      title: n,
      dataIndex: n,
      width: columnSetWidth(n, widthScreen),
      editable: notEditableColumns.findIndex((item: string) => item === n) === -1 ? true : false,
    }));
    setMapColumnsName(mapColumns);
  }, []);

  return (
    <TableSchedule
      columnsName={mapsColumnsName}
      tagRender={tagRender}
      defaultColumns={defaultColumns}
      optionsKeyOfEvents={columnsNameMap}
      changeColumnsSelect={changeColumnsSelect}
      data={data}
      isMentorStatus={isMentorStatus}
      organizers={organizers}
      form={form}
      editingId={editingId}
      isEditing={isEditing}
      isLoading={isLoading}
      edit={edit}
      cancel={cancel}
      add={add}
      remove={remove}
      save={save}
      types={types}
      widthScreen={widthScreen}
      changeRating={changeRating}
      isVoted={isVoted}
      timeZone={timeZone}
    />
  );
};
