import React, { useState, useEffect } from "react";
import { Table, Checkbox, Button } from "antd";
import { useUser } from "../Context/UserContext";
import {
  getCourse,
  getStudentCourse,
  registerCourse,
} from "../Api/CourseController";

const Home = () => {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredCourseIds, setRegisteredCourseIds] = useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch the courses the student is already registered for
      const registeredCourses = (await getStudentCourse(user)).data;

      // Fetch all available courses for the current semester
      const courseData = await getCourse(user.schoolYear, user.semester);

      // Ensure that courseData and courseData.data are both defined
      if (courseData && courseData.data) {
        setData(courseData.data);

        // Check if registeredCourses is an array before mapping over it
        const registeredCourseIds = Array.isArray(registeredCourses)
          ? registeredCourses.map((course) => course.id)
          : [];
        setRegisteredCourseIds(registeredCourseIds);
        setSelectedCourses(registeredCourseIds);
      } else {
        // Handle the case where courseData or courseData.data is undefined
        setError(new Error("Invalid course data"));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user.schoolYear, user.semester, user]);

  // Columns configuration for the table
  const columns = [
    {
      title: "Course Name",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => subject?.name || "N/A",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Select",
      dataIndex: "id", // Assuming 'id' is the unique identifier for each course
      key: "select",
      render: (text, record) => (
        <Checkbox
          onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
          checked={selectedCourses.includes(record.id)} // Set checked based on selectedCourses
          disabled={registeredCourseIds.includes(record.id)} // Disable the checkbox if the course is already registered
        />
      ),
    },
  ];

  // State to track selected courses
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Function to handle checkbox change
  const handleCheckboxChange = (courseId, isChecked) => {
    console.log(courseId);
    // Update selected courses based on checkbox state
    if (isChecked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    }
  };

  // Function to handle submit button click
  const handleSubmit = () => {
    // Filter out selected courses that are already registered
    const coursesToRegister = selectedCourses.filter(
      (courseId) => !registeredCourseIds.includes(courseId)
    );

    // Perform actions with selected courses
    console.log("Selected Courses to Register:", coursesToRegister);

    // Assuming registerCourse is a function that registers a course for a student
    coursesToRegister.forEach(async (courseId) => {
      const course = data.find((c) => c.id === courseId);

      if (course) {
        const registrationData = {
          student: user,
          course: course,
        };

        try {
          // Assuming registerCourse is an asynchronous function
          const res = await registerCourse(registrationData);
          console.log(
            `Registered for course: ${course.subject.name}`,
            res.status
          );
          fetchData();
        } catch (error) {
          console.error(
            `Error registering for course: ${course.subject.name}`,
            error
          );
        }
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Selected Courses List
  const selectedCoursesList = selectedCourses.map((courseId) => {
    const course = data.find((course) => course.id === courseId);
    return course ? course.subject.name : "N/A";
  });

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page content.</p>

      {/* Ant Design Table with Checkboxes */}
      <Table dataSource={data} columns={columns} />

      {/* Selected Courses List */}
      <div>
        <h2>Selected Courses:</h2>
        <ul>
          {selectedCoursesList.map((courseName) => (
            <li key={courseName}>{courseName}</li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <Button type="primary" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
};

export default Home;
