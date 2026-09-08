import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';


const Dashboard = () => {
    const [message , setMessage] = useState("");
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                let token = localStorage.getItem("token");
                let res = await axios.get("http://localhost:3000/dashboard" , {headers: {authorization:token}})
                setMessage(res.data);

            } catch(err) {
                setMessage("access Denied")
            }
        }

        fetchDashboard()
    },[])

  return (
    <div>
           <h1>{message}</h1>

    </div>
  )
}

export default Dashboard