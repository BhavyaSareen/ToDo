import React, { useEffect, useState } from 'react'
import CreateTask from '../components/CreateTask'
import NewTask from '../components/NewTask'
import RecentlyAdded from '../components/RecentlyAdded'
import { toast } from 'react-toastify'
import { AuthToken, Base_URL } from '../assets/Utilis'
import axios from 'axios'

function Dashboard(props) {
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [date, setDate] = useState();
  const [duedate, setDuedate] = useState();
  const [task, setTask] = useState();
  const [tasks, setTasks] = useState();

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${Base_URL}/tasks`, { headers: { Authorization: `Bearer ${AuthToken()}` } })
      if (res.status === 200) {
        const resData = res.data.tasks;
        const formatTask = Object.keys(resData).map((id) => ({
          id,
          ...resData[id]
        }))
        setTasks(formatTask);
        setTask(formatTask[0]);
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

  useEffect(() => {
    fetchTask();
  }, [])


  return (
    <div className='container-fluid'>
      <div className='row vh-100'>
        <div className='col-md-6'>
          <CreateTask onTaskCreated={fetchTask} />
        </div>
        <div className='col-md-6 bg-secondary'>
          <NewTask task={task} />
          <RecentlyAdded tasks={tasks} />
          {console.log(task)}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
