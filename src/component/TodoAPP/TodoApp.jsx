import React, { useEffect, useState } from 'react'
import { getDatabase, onValue, push, ref, set } from "firebase/database";

const TodoApp = () => {
    const db = getDatabase();

    const [taskData, setTaskData] = useState("");
    const [taskList, setTaskList] = useState([]);

    // send data to databse
    function handelPublish(){

        set(push(ref(db, "taskList/")),{
            task:taskData,
        })
    }

useEffect(()=>{
    const dataRef = ref(db, "taskList/");
    onValue(dataRef, (snapshot)=>{
        let array = [];
        snapshot.forEach((item)=>{
            array.unshift({...item.val(), key:item.key})
        })
        setTaskList(array)
    })

},[taskData])



  return (
    <div className=' max-w-container mx-auto h-screen shadow-2xl p-5'>
        <header className='bg-red-500 text-center text-white text-3xl font-bold py-4 rounded-lg font-roboto'>
            <h1>To Do App</h1>
        </header>
        <main>
           <fieldset className='my-5'>
           <textarea
           onChange={(e)=>setTaskData(e.target.value)} 
           value={taskData}
            className='w-full  border-2 border-b-black resize-none px-4 py-2'
             name="taskInputer" id="taskInputer"></textarea>
             <div className='text-right'>

             <input onClick={handelPublish}
             className='bg-orange-500 hover:bg-orange-600 text-white font-roboto text-xl p-5 py-2 cursor-pointer rounded-md mr-5    '
              type="button" value="Publish" />
            
             </div>
           </fieldset>

           <div className='px-5 h-[300px] overflow-y-scroll rounded-lg'>
           <ul className='space-y-4'>
            {
                taskList.map((item)=>(
                    <div className='flex'>
                   
                    <input  className='peer hidden'
                    type="checkbox" name="listCheek" id="listCheek" />

                    <li className=' peer-hover:visible  w-full list-disc font-opensans text-lg px-5 py-2 bg-neutral-200 rounded pree '>{item.task}</li>
                    </div>
                    
                ))
            }
           </ul>
           </div>
           <div className='text-right my-4 mx-5'>
            <button type="button" className='bg-orange-500 hover:bg-orange-600 text-white font-roboto text-lg p-4 py-2 cursor-pointer rounded-md    '>remove</button>
            </div>
        </main>
    </div>
  )
}

export default TodoApp