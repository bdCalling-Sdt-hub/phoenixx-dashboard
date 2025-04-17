import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { Input, Table, Popover, Button, message, Spin } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { MdMoreVert } from "react-icons/md";

import ButtonEDU from "../../../components/common/ButtonEDU";
import DeleteAdminModal from "./DeleteAdminModal";
import AddAdminModal from "./AddAdminModal";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAllAdminQuery,
} from "../../../redux/apiSlices/superAdmin";

const AdminList = () => {
  const { data: allAdminInfo, isLoading } = useGetAllAdminQuery();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [createAdmin] = useCreateAdminMutation();
  const [admins, setAdmins] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const addFormRef = useRef(null);

  useEffect(() => {
    if (allAdminInfo?.data?.data) {
      const formatted = allAdminInfo?.data?.data?.map((admin, index) => ({
        key: index + 1,
        userName: admin.userName,
        role: admin.role,
        _id: admin._id, // 👈 Add this line
        email: admin.email,
        creationdate: new Date(admin.createdAt).toLocaleDateString(),
      }));
      setAdmins(formatted);
      setFilteredData(formatted);
    }
  }, [allAdminInfo]);
  // console.log(allAdminInfo?.data?.data);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = admins.filter(
      (item) =>
        item.userName.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  const showAddModal = () => setIsAddModalOpen(true);

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    addFormRef.current?.resetFields();
    message.info("Admin addition cancelled.");
  };

  const handleAddAdmin = async (values) => {
    console.log("Form values: ", values);
    try {
      if (!values.userName || !values.email || !values.password) {
        message.error(
          "Please fill all required fields (UserName, Email, Password)."
        );
        return;
      }

      const res = await createAdmin(values).unwrap();
      console.log("Admin created successfully:", res);
      message.success("Admin created successfully!");

      const cleanEmail = values.email.replace(/\.com.*/i, ".com");

      const newAdmin = {
        key: admins.length + 1,
        ...values,
        email: cleanEmail,
        creationdate: new Date().toLocaleDateString(),
      };

      const updated = [...admins, newAdmin];
      setAdmins(updated);
      setFilteredData(updated);
      setIsAddModalOpen(false);
      addFormRef.current?.resetFields();
    } catch (err) {
      if (err.status === 400) {
        message.error(
          `Validation Error: ${err.data?.message || "Please check the inputs"}`
        );
      } else {
        message.error("Something went wrong, please try again.");
      }
      console.error("Error creating admin:", err);
    }
  };

  const showDeleteModal = (record) => {
    setSelectedAdmin(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteAdmin(selectedAdmin._id).unwrap();

      if (res.success) {
        message.success("Admin deleted successfully!");
      } else {
        message.error("Something went wrong");
      }
    } catch (err) {
      console.error("Error deleting admin:", err);
      message.error("Failed to delete admin.");
    }

    const updated = admins.filter(
      (admin) => admin.email !== selectedAdmin.email
    );
    setAdmins(updated);
    setFilteredData(updated);
    setIsDeleteModalOpen(false);
  };

  if (isLoading) return <Spin tip="Loading admins..." />;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-5">
      <TableHead
        searchText={searchText}
        handleSearch={handleSearch}
        onAdd={showAddModal}
      />
      <TableBody filteredData={filteredData} onDelete={showDeleteModal} />
      <AddAdminModal
        open={isAddModalOpen}
        onCancel={handleCancelAdd}
        onAdd={handleAddAdmin}
        formRef={addFormRef}
      />
      <DeleteAdminModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        name={selectedAdmin?.userName}
      />
    </div>
  );
};

const TableHead = ({ searchText, handleSearch, onAdd }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        placeholder="Search admins..."
        value={searchText}
        onChange={handleSearch}
        className="w-1/3 h-10"
        allowClear
      />
      <ButtonEDU actionType="add" onClick={onAdd}>
        <div className="flex items-center justify-center gap-2">
          <FaPlus size={15} /> Add new
        </div>
      </ButtonEDU>
    </div>
  );
};

const TableBody = ({ filteredData, onDelete }) => (
  <Table
    rowKey={(record) => record.key}
    columns={columns(onDelete)}
    dataSource={filteredData}
    pagination={false}
    className="mt-5"
  />
);

const columns = (onDelete) => [
  { title: "Name", dataIndex: "userName", key: "userName" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  {
    key: "action",
    render: (_, record) => (
      <Popover
        content={
          <div className="flex gap-3">
            <Button onClick={() => onDelete(record)} danger>
              <DeleteFilled />
            </Button>
          </div>
        }
        trigger="hover"
      >
        <MdMoreVert size={25} />
      </Popover>
    ),
  },
];

export default AdminList;
