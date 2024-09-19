import React, { useEffect, useState } from 'react'
import CreateTask from '../components/CreateTask'
import NewTask from '../components/NewTask'
import RecentlyAdded from '../components/RecentlyAdded'
import { toast } from 'react-toastify'
import { Base_URL } from '../assets/Utilis'
import axios from 'axios'

function Dashboard(props) {
const[title, setTitle] = useState();
const[desc, setDesc] = useState();
const[date, setDate] = useState();
const[duedate, setDuedate] = useState();
const[task, setTask] = useState();
console.log("gs",task)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${Base_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) {
          console.log(res);
          toast.success("Success");
          const taskData = res.data.tasks;
          setTask(taskData);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Request failed");
        }
        else {
          toast.error("error");
        }
      }
    }
    fetchTask();
  }, [])


  return (
    <div className='container-fluid'>
      <div className='row vh-100'>
        <div className='col-md-6'>
          <CreateTask />
        </div>
        <div className='col-md-6 bg-secondary'>
          <NewTask />
          <RecentlyAdded tasks = {task}/>
          {console.log(task)}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
