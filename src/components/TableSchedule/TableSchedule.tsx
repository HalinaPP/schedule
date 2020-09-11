import React, { useState } from "react";
import { Table, Popconfirm, Form, Button, Tag } from "antd";
import "antd/dist/antd.css";
import "./Tables.scss";
import { IAgeMap } from "./TableSchedule.model";
import { events } from "../../mocks/events";
import { columnsName } from "../../mocks/tableColumnNames";
import EditableCell from "./EditableCell";
import { EditTwoTone } from "@ant-design/icons";

export const TableSchedule = () => {
  const [form] = Form.useForm(); // хранится общий объект для формы ant
  const [data, setData] = useState(events[0].events); // хранятся все данные таблиц которые приходят
  const [editingKey, setEditingKey] = useState(""); // храним какое поле(строку таблыцы) сейчас редактируем
  const isEditing = (record: any) => record.key === editingKey; // указываем (true/false) какое поле сейчас находится в формате редактирования

  const edit = (record: any) => {
    //при нажатии на кнопку edit
    form.setFieldsValue({ ...record }); //(при редактировании) заполняет поля input в форме значениями, что хранились ранее
    setEditingKey(record.key); // указывает какая из строк сейчас редактируется
  };
  const cancel = () => {
    //при нажатии на кнопку edit
    setEditingKey(""); // отменяет редактирование
  };

  const save = async (key: React.Key) => {
    // при нажатии кнопки сохранить
    try {
      const row = (await form.validateFields()) as any; // хранятся все данные формы (input'ов) из одной строки таблицы (дата, урок, адрес, задание)
      const newData = [...data]; // хранятся все данные всех строк таблиц (дата, урок, адрес, задание)
      const index = newData.findIndex((item) => key === item.key); // Указывает индекс массива пришедших данных, какой из них сейчас находится под редактированием
      if (index > -1) {
        const item = newData[index]; // хранится строка с данными (вся: дата, время, название) которая сейчас будет редактироваться
        if (row["date-picker"]._d) {
          // ant <DatePicker /> для него зарезервированно имя date-picker, мы читаем с формы только date, по этому перевожу если такая найдется
          item.date = row["date-picker"]._d.toISOString().slice(0, 10);
        }
        newData.splice(index, 1, {
          //заменяем в массиве элемент под номером index (точнее его сначала удаляем потом добавляем ...item, ...row) который пришел с данными (всеми данными таблицы всех строк проиндексированные)
          ...item, // что было изначально
          ...row, // если что то поменялось то тут мы перезатрем что было в ...item,
        });
        setData(newData); // все сохранения изменения что мы сделали при помощи splice "сэтаем" в originData (наши данные) которые хронятся уже в data
        setEditingKey(""); // указываем (устанавливаем) что в режиме редактирования ни какое поле сейчас не учавствует
      } else {
        // (своеобразная обработка ошибки) если каким то образом редактируем элемент массива index <= -1, то ошибка не падает но ни один из элементов не будет перезатерт всё сохраняю
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      // обработка ошибки если нажали на кнопку Save, что то пошло не так, то смотреть, что именно в консоль
      console.log("Validate Failed:", errInfo); // вывод ошибки в консоль при сохранении
    }
  };

  const columns: IAgeMap[] = [
    // Хронятся данные названия столбцов (title, dataIndex) и то можно ли их редактировать,
    ...columnsName, // Данные с названием столбцов импортируется из columnsName.tsx
    {
      title: "Tags",
      dataIndex: "tags",
      editable: true,
      render: (_: any, record: any) => {
        let colorTag: string = "cyan";
        switch (record.tags) {
          case "deadline":
            colorTag = "red";
            break;
          case "task":
            colorTag = "green";
            break;
        }
        return (
          <Tag key={record.tags} color={colorTag}>
            {record.tags}
          </Tag>
        );
      },
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        // _ заглушка что бы брать record вторым параметром для render (первый парамент зарезервирован React)
        const editable = isEditing(record); // (render вызывается всякий раз как изменяется что то на странице, или создается новая строка с данными) каждый раз проверяем record (строка целиком, они приходят по порядку) пришла если с возможностью редактирования тогда показываем кнопки "Save" и "Cancel" иначе кнопку с "Edit"
        return editable ? (
          <span>
            <Button onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button disabled={editingKey !== ""} onClick={() => edit(record)} icon={<EditTwoTone />}></Button>
        );
        //save отправим колбэк с ключем текущей строки что бы сохранить
        //cancel отправим колбэк с ключем текущей строки что бы отменить
        //Popconfirm от ant что бы спросить уверены или нет
        //disabled={editingKey !== ""} отключаем все кнопки Edit на других строках на других строках во время редактирования
        //edit отправим колбэк с данными изменяемой в данный момент строкой
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    let lineFormat: string;
    switch (col.dataIndex) {
      case "score":
        lineFormat = "number";
        break;
      case "date":
        lineFormat = "date";
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: lineFormat,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
