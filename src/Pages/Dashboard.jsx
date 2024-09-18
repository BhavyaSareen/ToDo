import React from 'react'
import CreateTask from '../components/CreateTask'
import NewTask from '../components/NewTask'
import RecentlyAdded from '../components/RecentlyAdded'

function Dashboard(props) {
  return (
    <div className='container-fluid'>
      <div className='row vh-100'>
      <div className='col-md-6'>
        <CreateTask/>
      </div>
      <div className='col-md-6 bg-secondary'>
        <NewTask/>
        <RecentlyAdded/>
      </div>
      </div>
      
    </div>
  )
}

export default Dashboard
