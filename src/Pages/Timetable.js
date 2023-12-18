// Timetable.js

import React, { useState, useEffect } from "react";
import { Table, Select, Space } from "antd";
import moment from "moment";
import { useUser } from "../Context/UserContext";
import { getStudentTimetable } from "../Api/CourseController";

const Timetable = () => {
  const { user } = useUser();
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(user.semester);
  const [selectedYear, setSelectedYear] = useState(user.schoolYear);

  const { Option } = Select;

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const timetable = await getStudentTimetable(
        user,
        selectedYear,
        selectedSemester
      );
      setTimetableData(timetable.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [user, selectedYear, selectedSemester]);

  const columns = [
    {
      title: "Course Name",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => subject?.name || "N/A",
    },
    {
      title: "Start Date",
      dataIndex: "course.startDate",
      key: "startDate",
      render: (startDate) => moment(startDate).format("MMMM Do YYYY, h:mm a"),
    },
    {
        title: "Time",
        dataIndex: "time",
        key: "time",
      },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
  ];

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div>
      <h1>Timetable</h1>
      <Space>
        <Select defaultValue={user.semester} onChange={handleSemesterChange}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
        </Select>
        <Select defaultValue={user.schoolYear} onChange={handleYearChange}>
          <Option value={2022}>2022</Option>
          <Option value={2023}>2023</Option>
        </Select>
      </Space>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <Table
          dataSource={timetableData}
          columns={columns}
          rowKey={(record) => record.id}
        />
      )}
    </div>
  );
};

export default Timetable;
