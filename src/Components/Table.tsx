import React, { useState, useRef } from "react";
import { Tag } from "antd";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { ProFormRadio } from "@ant-design/pro-components";
import { title } from "process";

type ToDoEntry = {
  id: React.Key;
  created_at?: string;
  title?: string;
  readonly?: string;
  description?: string;
  status: "complete" | "incomplete";
  due_date?: string;
  tags?: string[];
};
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const defaultData: ToDoEntry[] = [
  {
    id: 624691229,
    title: "Task 2",
    readonly: "task 2",
    description: "My Task 2",
    due_date: "08-04-23",
    status: "complete",
    created_at: "1590481162000",
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ToDoEntry[]>(defaultData);
  const [position, setPosition] = useState<"top" | "bottom" | "hidden">(
    "bottom"
  );
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ToDoEntry>[] = [
    {
      title: "Timestamped",
      dataIndex: "created_at",
      valueType: "date",
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 200,
      formItemProps: {
        rules: [
          { required: true, message: "Title is required" },
          { max: 100, message: "Title cannot be longer than 100 characters" },
        ],
      },
    },
    {
      title: "read Only",
      dataIndex: "readonly",
      readonly: true,
      width: "15%",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
      formItemProps: {
        rules: [
          { required: true, message: "Description is required" },
          {
            max: 1000,
            message: "Description cannot be longer than 1000 characters",
          },
        ],
      },
    },
    {
      title: "Due_date",
      dataIndex: "due_date",
      valueType: "date",
    },
    {
      title: "Tag",
      dataIndex: "tags",
      width: 150,
      hideInSearch: true,
      render: (text, record) => (
        <>
          {record.tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "status",
      key: "status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        all: { text: "all", status: "Default" },
        open: {
          text: "incomplete",
          status: "Error",
        },
        closed: {
          text: "completed",
          status: "Success",
        },
      },
      formItemProps: {
        rules: [{ required: true, message: "Status is required" }],
      },
    },
    {
      title: "Edit/Delete",
      valueType: "option",
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          delete
        </a>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable
        rowKey="id"
        headerTitle="MY TASKS"
        maxLength={5}
        scroll={{ x: 960 }}
        recordCreatorProps={
          position !== "hidden"
            ? {
                position: position as "top",
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
              }
            : false
        }
        loading={false}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onClick={setDataSource}
        editable={{
          type: "multiple",
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};
