import React, { useState } from "react";
import { Divider, Radio, Table, Button, message } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) =>
      record.baned ? (
        <Button type="primary" onClick={() => handleUnban(record)}>
          Unban
        </Button>
      ) : null,
  },
];

const initialData = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    baned: true,
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    baned: false,
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    baned: true,
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
    baned: true,
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    name: record.name,
  }),
};

const AccountBaned = () => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [data, setData] = useState(initialData);

  // Handle unban action
  const handleUnban = (record) => {
    const updatedData = data.map((item) =>
      item.key === record.key ? { ...item, baned: false } : item
    );
    setData(updatedData);
    message.success(`${record.name} has been unbanned!`);
  };

  const banedAccounts = data.filter((account) => account.baned);

  return (
    <div>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={banedAccounts}
        rowKey="key"
      />
    </div>
  );
};

export default AccountBaned;
