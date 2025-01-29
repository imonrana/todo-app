import React, { useEffect, useState } from "react";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";

const TodoApp = () => {
  const db = getDatabase();

  const [taskData, setTaskData] = useState("");
  const [error, setErro] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  // send data to databse
  function handelPublish() {
    if (taskData) {
      set(push(ref(db, "taskList/")), {
        task: taskData,
      }).then(() => {
        setTaskData("");
        setErro("");
      });
    } else {
      setErro("Plese Add Task");
    }
  }

  function handelPressToSendData(e) {
    if (e.key == "Enter") {
      handelPublish();
    }
  }

  // red data for show todo task
  useEffect(() => {
    const dataRef = ref(db, "taskList/");
    onValue(dataRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.unshift({ ...item.val(), key: item.key });
      });
      setTaskList(array);
    });
  }, []);

  //   handel multiple data list
  function handelMultipleData(e, item) {
    if (e.target.checked) {
      setSelectedTask((prev) => [...prev, item.key]);
    } else {
      const prev = selectedTask.filter((prev) => prev !== item.key);
      setSelectedTask(prev);
    }
  }

  // remove data from task list handel remove

  function handelRemove() {
    selectedTask.forEach((item) => {
      remove(ref(db, "taskList/" + item));
    });
    setSelectedTask([]);
  }

  return (
    <div className=" max-w-container mx-auto h-screen shadow-2xl p-5">
      <header className="bg-orange-600 text-center text-white text-3xl font-bold py-4 rounded-lg font-roboto">
        <h1>To Do App</h1>
      </header>
      <main>
        {/* input Area */}
        <fieldset className="my-5">
          <textarea
            onKeyDown={(e) => handelPressToSendData(e)}
            onChange={(e) => setTaskData(e.target.value)}
            value={taskData}
            className="w-full  border-2 border-b-black resize-none px-4 py-2 rounded-md  focus:outline-green-500   "
            name="taskInputer"
            id="taskInputer"
            placeholder="Add Some Task"
          ></textarea>
          <div className="text-right relative">
            {error && (
              <p className="px-5 text-xl text-red-500 font-medium absolute">
                {error}
              </p>
            )}
            <input
              onClick={handelPublish}
              className="bg-orange-500 hover:bg-orange-600 text-white font-roboto text-xl p-5 py-2 cursor-pointer rounded-md mr-5  "
              type="button"
              value="Publish"
            />
          </div>
        </fieldset>

        {/*  task list Area*/}
        <div className="px-5 h-[300px] overflow-y-scroll rounded-lg">
          <ul className="space-y-4">
            {taskList.map((item) => (
              <div key={item.key} className="flex gap-x-2">
                <input
                  onChange={(e) => handelMultipleData(e, item)}
                  title="cheeked for oparetion"
                  className="peer self-start mt-2 cursor-pointer"
                  type="checkbox"
                  name="listCheek"
                  id={item.key}
                />
                <li className=" w-full  font-opensans text-lg px-5 py-2 bg-neutral-200 rounded  ">
                  {item.task}
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className="text-right mt-6 mx-5  space-x-5">
          <button
            title="mark as done"
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-roboto text-lg p-4 py-2 cursor-pointer rounded-md"
          >
            Mark As Done
          </button>
          <button
            title="edit"
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-roboto text-lg p-4 py-2 cursor-pointer rounded-md"
          >
            Edit
          </button>
          <button
            title="remove"
            type="button"
            onClick={handelRemove}
            className="bg-orange-500 hover:bg-orange-600 text-white font-roboto text-lg p-4 py-2 cursor-pointer rounded-md"
          >
            remove
          </button>
        </div>
      </main>
    </div>
  );
};

export default TodoApp;
