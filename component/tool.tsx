"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from '@mui/icons-material/Add'; 
import AlertDialog from "./dialog";
import {
  Detail,
  Status,
  SubDetail,
  Task,
  Update,
  formatForTypes,
  link,
} from "@/interfaces/all";
import useLocalStorage from "@/customhook/useLocalStorage";
import { TextFieldShadcn } from "./TextFieldShadcn";
import { category_list } from "./constants"
import AddUpdatesFromEncodedDialog from "./addUpdatesFromEncodedDialog";
function indexToAlphabet(index: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet[index % 26]; // Handles up to 26 letters
}

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0"); // Day of the month
  return `${year}-${month}-${day}`;
}


export default function Tool() {
  const [name, setName] = useLocalStorage<string | null>("create-name", "Kush");
  const [open, setOpen] = useState<boolean>(false);
  const [addUpdatesOpen, setAddUpdatesOpen] = useState<boolean>(false);

  const [updates, setUpdates] = useLocalStorage<Update[]>("create-updates", [
    {
      id: 1,
      category: "Plotly",
      tasks: [
        {
          id: 1,
          title: "Ticket Title",
          jiraLink: "https://jirasw.nvidia.com/browse/RGENG-",
          statuses: [
            {
              id: 1,
              status: "Completed",
              details: [
                {
                  id: 1,
                  description: "Deployed and verified changes on dev",
                },
                {
                  id: 2,
                  description:
                    "Resolved the issue where latest entries were getting duplicated",
                },
              ],
            },
            {
              id: 2,
              status: "In Progress",
              details: [
                {
                  id: 1,
                  description: "Some task in progress",
                  subPoints: [
                    { id: 1, description: "Sub point 1" },
                    { id: 2, description: "Sub point 2" },
                  ],
                },
              ],
            },
          ],
          mergeRequests: [
            {
              id: 1,
              url: "https://gitlab-master.nvidia.com/urg/plotly-apps/-/merge_requests/517",
            },
          ],
          appLinks: [
            {
              id: 1,
              url: "https://dev-apps.rg-reporting.nvidia.com/allocations-occupancies-kvasaniya/occupancy-report",
            },
          ],
        },
      ],
    },
  ]);

  const [formatFor, setFormatFor] = useLocalStorage<formatForTypes>(
    "create-formatFor",
    "skype"
  );

  const handleFormatFor = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: formatForTypes
  ) => {
    console.log("newAlignment=> ", newAlignment);

    setFormatFor(newAlignment);
  };

  function formatUpdates(updates: Update[], formatFor: formatForTypes): string {
    let finalStr = "";

    if (formatFor == "skype") {
      finalStr += `Updates: ${name}\n==============================\n`;
    } else if (formatFor == "email") {
      finalStr += "Hi Nautilus Team,\n\n";
    } else if (formatFor == "slack") {
      finalStr += `Updates: ${getTodayDate()}\n\n`;
    }

    updates.map((update: Update, index: number) => {
      finalStr += `${indexToAlphabet(index)}. ${update.category}\n`;
      {
        update.tasks.map((task: Task, index: number) => {
          finalStr += `    ${index + 1}. ${task.title}\n`;
          finalStr += `    ( ${task.jiraLink} )\n`;

          {
            task.statuses.map((status: Status, index: number) => {
              finalStr += `        ${index + 1}. ${status.status} \n`;

              {
                status.details.map((detail: Detail, index: number) => {
                  finalStr += `            ${indexToAlphabet(index)}. ${detail.description
                    }\n`;

                  {
                    detail.subPoints?.map(
                      (subPoint: SubDetail, index: number) => {
                        finalStr += `                - ${subPoint.description}\n`;
                      }
                    );
                  }
                });
              }

              // finalStr += "\n";
            });
          }
          if (task.mergeRequests.length > 0) {
            finalStr += "        MR:-";
          }
          {
            task.mergeRequests.map((mergeRequest: link, index: number) => {
              if (index == 0) {
                finalStr += ` ( ${mergeRequest.url} )\n`;
              } else {
                finalStr += `             ( ${mergeRequest.url} )\n`;
              }
            });
          }
          if (task.appLinks.length > 0) {
            finalStr += "        App:-";
          }
          {
            task.appLinks.map((appLink: link, index: number) => {
              if (index == 0) {
                finalStr += ` ( ${appLink.url} )\n`;
              } else {
                finalStr += `              ( ${appLink.url} )\n`;
              }
            });
          }
          finalStr += "\n";
        });
      }
      finalStr += "\n";
    });

    if (formatFor == "email") {
      finalStr += "Thanks,\nAppPerfect Team\n";
    }

    return finalStr;
  }
  function handleShareUpdates(updates: Update[]) {
    // Convert updates to a JSON string
    const shareString = JSON.stringify(updates);
    const encoded = btoa(shareString);

    // Copy the string to the clipboard
    navigator.clipboard
      .writeText(encoded)
      .then(() => {
        // Show an alert if the copy is successful
        // alert("Updates copied to clipboard!");
        setOpen(true);
      })
      .catch((error) => {
        // Show an alert if an error occurs
        alert("Failed to copy updates to clipboard. Please try again.");
        console.error("Clipboard error: ", error);
      });
  }

  function handleAddCategory(e: React.MouseEvent) {
    console.log("Add category callled");

    const emptyUpdate: Update = {
      id: updates.length + 1,
      category: "Plotly",
      tasks: [],
    };
    // updates.push(emptyUpdate);
    setUpdates([...updates, emptyUpdate]);
  }
  function handleDeleteCategory(e: React.MouseEvent, updateId: number) {
    console.log("Delete Category (Update) called with UpdateId: ", updateId);

    // Filter out the update with the given updateId
    const updatedUpdates = updates.filter(
      (update: Update) => update.id !== updateId
    );

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleCategoryChange(
    e: SelectChangeEvent<string>,
    updateId: number
  ) {
    console.log("Category Change called with UpdateId: ", updateId);
    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) {
      return;
    }
    updatedUpdates[updateIndex].category = e.target.value;
    setUpdates(updatedUpdates);
  }

  function handleAddTicket(e: React.MouseEvent, updateId: number) {
    console.log("Add Ticket called with UpdateId: ", updateId);

    // Find the index of the selected update
    const selectUpdateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    // If the update was not found, return early
    if (selectUpdateIndex === -1) {
      return;
    }

    // Create a new task to add
    const emptyTask: Task = {
      id: (updates[selectUpdateIndex]?.tasks?.length || 0) + 1,
      title: "Ticket Title",
      jiraLink: "https://jirasw.nvidia.com/browse/RGENG-",
      statuses: [],
      mergeRequests: [],
      appLinks: [],
    };

    // Update the selected update with the new task
    const updatedUpdates = [...updates]; // Create a copy of the updates array
    const selectedUpdate = updatedUpdates[selectUpdateIndex];

    // If tasks do not exist, initialize them
    if (!selectedUpdate.tasks) {
      selectedUpdate.tasks = [];
    }

    // Add the new task to the tasks array
    selectedUpdate.tasks = [...selectedUpdate.tasks, emptyTask];

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleDeleteTicket(
    e: React.MouseEvent,
    updateId: number,
    taskId: number
  ) {
    console.log(
      "Delete Ticket (Task) called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    if (updateIndex === -1) {
      return;
    }

    // Filter out the task with the given taskId
    const updatedTasks = updates[updateIndex].tasks.filter(
      (task: Task) => task.id !== taskId
    );

    // Create a copy of the updates array and update the tasks for the specific update
    const updatedUpdates = [...updates];
    updatedUpdates[updateIndex] = {
      ...updatedUpdates[updateIndex],
      tasks: updatedTasks,
    };

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleTicketTitleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number
  ) {
    console.log(
      "Ticket Change called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId
    );
    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) {
      return;
    }
    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) {
      return;
    }
    updatedUpdates[updateIndex].tasks[taskIndex].title = e.target.value;
    setUpdates(updatedUpdates);
  }
  function handleJiraLinkChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number
  ) {
    console.log(
      "Jira Link Change called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId
    );
    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) {
      return;
    }
    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) {
      return;
    }
    updatedUpdates[updateIndex].tasks[taskIndex].jiraLink = e.target.value;
    setUpdates(updatedUpdates);
  }

  function handleAddStatus(
    e: React.MouseEvent,
    updateId: number,
    taskId: number
  ) {
    console.log(
      "Add Status called with UpdateId: ",
      updateId,
      " and TaskId: ",
      taskId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    // If the update is not found, return early
    if (updateIndex === -1) {
      return;
    }

    // Find the index of the selected task within the update
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    // If the task is not found, return early
    if (taskIndex === -1) {
      return;
    }

    // Create a new Status to add
    const newStatus: Status = {
      id: (updates[updateIndex].tasks[taskIndex]?.statuses?.length || 0) + 1, // Incremental ID for the new status
      status: "In Progress", // Default status or you can make this dynamic
      details: [], // You can add details as needed
    };

    // Update the selected task with the new status
    const updatedUpdates = [...updates]; // Create a copy of the updates array
    updatedUpdates[updateIndex].tasks[taskIndex].statuses = [
      ...(updatedUpdates[updateIndex].tasks[taskIndex]?.statuses || []),
      newStatus,
    ];

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleDeleteStatus(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    statusId: number
  ) {
    console.log(
      "Delete Status called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    if (updateIndex === -1) {
      return;
    }

    // Find the index of the selected task within the update
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    if (taskIndex === -1) {
      return;
    }

    // Filter out the status with the given statusId
    const updatedStatuses = updates[updateIndex].tasks[
      taskIndex
    ].statuses.filter((status: Status) => status.id !== statusId);

    // Create a copy of the updates array and update the statuses for the specific task
    const updatedUpdates = [...updates];
    updatedUpdates[updateIndex].tasks[taskIndex] = {
      ...updatedUpdates[updateIndex].tasks[taskIndex],
      statuses: updatedStatuses,
    };

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleStatusChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number,
    statusId: number
  ) {
    console.log(
      "Status Change called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId
    );
    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) {
      return;
    }
    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) {
      return;
    }
    const statusIndex = updatedUpdates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);
    if (statusIndex === -1) {
      return;
    }

    const newStatusValue = e.target.value as "In Progress" | "Completed";
    updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex].status =
      newStatusValue;
    setUpdates(updatedUpdates);
  }

  function handleAddPoint(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    statusId: number
  ) {
    console.log(
      "Add Point (Detail) called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    // If the update is not found, return early
    if (updateIndex === -1) {
      return;
    }

    // Find the index of the selected task within the update
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    // If the task is not found, return early
    if (taskIndex === -1) {
      return;
    }

    // Find the index of the selected status within the task
    const statusIndex = updates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);

    // If the status is not found, return early
    if (statusIndex === -1) {
      return;
    }

    // Create a new Point (Detail) to add
    const newPoint: Detail = {
      id:
        (updates[updateIndex].tasks[taskIndex].statuses[statusIndex]?.details
          ?.length || 0) + 1,
      description: "", // You can make this dynamic
      subPoints: [], // Optionally, initialize subpoints as an empty array
    };

    // Update the selected status with the new point (detail)
    const updatedUpdates = [...updates]; // Create a copy of the updates array
    updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex].details =
      [
        ...(updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex]
          .details || []),
        newPoint,
      ];

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleDeletePoint(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    statusId: number,
    pointId: number
  ) {
    console.log(
      "Delete Point (Detail) called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId,
      " PointId: ",
      pointId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    // If the update is not found, return early
    if (updateIndex === -1) {
      return;
    }

    // Find the index of the selected task within the update
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    // If the task is not found, return early
    if (taskIndex === -1) {
      return;
    }

    // Find the index of the selected status within the task
    const statusIndex = updates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);

    // If the status is not found, return early
    if (statusIndex === -1) {
      return;
    }

    // Find the index of the selected point (detail) within the status
    const pointIndex = updates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details.findIndex((point: Detail) => point.id === pointId);

    // If the point is not found, return early
    if (pointIndex === -1) {
      return;
    }

    // Create a copy of the updates array
    const updatedUpdates = [...updates];

    // Remove the selected point (detail) from the status
    updatedUpdates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details.splice(pointIndex, 1);

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handlePointChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number,
    statusId: number,
    pointId: number
  ) {
    console.log(
      "Point Change called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId,
      " PointId: ",
      pointId
    );
    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) {
      return;
    }
    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) {
      return;
    }
    const statusIndex = updatedUpdates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);
    if (statusIndex === -1) {
      return;
    }
    const pointIndex = updatedUpdates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details.findIndex((point: Detail) => point.id === pointId);
    if (pointIndex === -1) {
      return;
    }
    updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex].details[
      pointIndex
    ].description = e.target.value;
    setUpdates(updatedUpdates);
  }

  function handleAddSubPoint(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    statusId: number,
    pointId: number
  ) {
    console.log(
      "Add SubPoint (SubDetail) called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId,
      " PointId: ",
      pointId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    // If the update is not found, return early
    if (updateIndex === -1) {
      return;
    }

    // Find the index of the selected task within the update
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    // If the task is not found, return early
    if (taskIndex === -1) {
      return;
    }

    // Find the index of the selected status within the task
    const statusIndex = updates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);

    // If the status is not found, return early
    if (statusIndex === -1) {
      return;
    }

    // Find the index of the selected point (detail) within the status
    const pointIndex = updates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details.findIndex((point: Detail) => point.id === pointId);

    // If the point is not found, return early
    if (pointIndex === -1) {
      return;
    }

    // Create a new SubPoint (SubDetail) to add
    const newSubPoint: SubDetail = {
      id:
        (updates[updateIndex].tasks[taskIndex].statuses[statusIndex].details[
          pointIndex
        ]?.subPoints?.length || 0) + 1,
      description: "", // You can make this dynamic
    };

    // Update the selected point with the new subpoint
    const updatedUpdates = [...updates]; // Create a copy of the updates array
    updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex].details[
      pointIndex
    ].subPoints = [
        ...(updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex]
          .details[pointIndex]?.subPoints || []),
        newSubPoint,
      ];

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleDeleteSubPoint(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    statusId: number,
    pointId: number,
    subPointId: number
  ) {
    console.log(
      "Delete SubPoint (SubDetail) called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId,
      " PointId: ",
      pointId,
      " SubPointId: ",
      subPointId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );

    // If the update is not found, return early
    if (updateIndex === -1) {
      return;
    }

    // Find the index of the selected task within the update
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );

    // If the task is not found, return early
    if (taskIndex === -1) {
      return;
    }

    // Find the index of the selected status within the task
    const statusIndex = updates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);

    // If the status is not found, return early
    if (statusIndex === -1) {
      return;
    }

    // Find the index of the selected point (detail) within the status
    const pointIndex = updates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details.findIndex((point: Detail) => point.id === pointId);

    // If the point is not found, return early
    if (pointIndex === -1) {
      return;
    }

    // Find the index of the selected subpoint (subdetail) within the point
    const subPointIndex = updates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details[pointIndex].subPoints?.findIndex(
      (subPoint: SubDetail) => subPoint.id === subPointId
    );

    // If the subpoint is not found, return early
    if (subPointIndex === -1) {
      return;
    }

    // Create a copy of the updates array
    const updatedUpdates = [...updates];

    // Remove the selected subpoint from the point
    updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex].details[
      pointIndex
    ].subPoints?.splice(subPointIndex || 0, 1);

    // Set the updated state
    setUpdates(updatedUpdates);
  }
  function handleSubPointChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number,
    statusId: number,
    pointId: number,
    subPointId: number
  ) {
    console.log(
      "SubPoint Change called with UpdateId: ",
      updateId,
      " TaskId: ",
      taskId,
      " StatusId: ",
      statusId,
      " PointId: ",
      pointId,
      " SubPointId: ",
      subPointId
    );
    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) {
      return;
    }
    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) {
      return;
    }
    const statusIndex = updatedUpdates[updateIndex].tasks[
      taskIndex
    ].statuses.findIndex((status: Status) => status.id === statusId);
    if (statusIndex === -1) {
      return;
    }
    const pointIndex = updatedUpdates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details.findIndex((point: Detail) => point.id === pointId);
    if (pointIndex === -1) {
      return;
    }
    const subPointIndex = updatedUpdates[updateIndex].tasks[taskIndex].statuses[
      statusIndex
    ].details[pointIndex].subPoints?.findIndex(
      (subPoint: SubDetail) => subPoint.id === subPointId
    );
    if (subPointIndex === -1) {
      return;
    }
    if (
      updatedUpdates[updateIndex].tasks[taskIndex].statuses[statusIndex]
        .details[pointIndex].subPoints
    ) {
      if (subPointIndex !== undefined) {
        updatedUpdates[updateIndex].tasks[taskIndex].statuses[
          statusIndex
        ].details[pointIndex].subPoints[subPointIndex].description =
          e.target.value;
      }
    }

    setUpdates(updatedUpdates);
  }

  function handleAddMRLink(
    e: React.MouseEvent,
    updateId: number,
    taskId: number
  ) {
    console.log(
      "Add MR Link called with UpdateId:",
      updateId,
      "TaskId:",
      taskId
    );

    // Find the index of the selected update
    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) return;

    // Find the index of the selected task
    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) return;

    // Create a new MR link
    const newMRLink: link = {
      id: updates[updateIndex].tasks[taskIndex].mergeRequests.length + 1, // Generate a new ID
      url: "", // Placeholder URL
    };

    // Update the MR links array
    const updatedUpdates = [...updates];
    updatedUpdates[updateIndex].tasks[taskIndex] = {
      ...updatedUpdates[updateIndex].tasks[taskIndex],
      mergeRequests: [
        ...updatedUpdates[updateIndex].tasks[taskIndex].mergeRequests,
        newMRLink,
      ],
    };

    setUpdates(updatedUpdates);
  }
  function handleDeleteMRLink(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    mrLinkId: number
  ) {
    console.log(
      "Delete MR Link called with UpdateId:",
      updateId,
      "TaskId:",
      taskId,
      "MR LinkId:",
      mrLinkId
    );

    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) return;

    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) return;

    const updatedMRLinks = updates[updateIndex].tasks[
      taskIndex
    ].mergeRequests.filter((mr: link) => mr.id !== mrLinkId);

    const updatedUpdates = [...updates];
    updatedUpdates[updateIndex].tasks[taskIndex] = {
      ...updatedUpdates[updateIndex].tasks[taskIndex],
      mergeRequests: updatedMRLinks,
    };

    setUpdates(updatedUpdates);
  }
  function handleMRLinkChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number,
    mrLinkId: number
  ) {
    console.log(
      "MR Link Change called with UpdateId:",
      updateId,
      "TaskId:",
      taskId,
      "MR LinkId:",
      mrLinkId
    );

    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) return;

    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) return;

    const mrIndex = updatedUpdates[updateIndex].tasks[
      taskIndex
    ].mergeRequests.findIndex((mr: link) => mr.id === mrLinkId);
    if (mrIndex === -1) return;

    updatedUpdates[updateIndex].tasks[taskIndex].mergeRequests[mrIndex].url =
      e.target.value;

    setUpdates(updatedUpdates);
  }

  function handleAddAppLink(
    e: React.MouseEvent,
    updateId: number,
    taskId: number
  ) {
    console.log(
      "Add App Link called with UpdateId:",
      updateId,
      "TaskId:",
      taskId
    );

    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) return;

    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) return;

    const newAppLink: link = {
      id: updates[updateIndex].tasks[taskIndex].appLinks.length + 1, // Generate a new ID
      url: "", // Placeholder URL
    };

    const updatedUpdates = [...updates];
    updatedUpdates[updateIndex].tasks[taskIndex] = {
      ...updatedUpdates[updateIndex].tasks[taskIndex],
      appLinks: [
        ...updatedUpdates[updateIndex].tasks[taskIndex].appLinks,
        newAppLink,
      ],
    };

    setUpdates(updatedUpdates);
  }
  function handleDeleteAppLink(
    e: React.MouseEvent,
    updateId: number,
    taskId: number,
    appLinkId: number
  ) {
    console.log(
      "Delete App Link called with UpdateId:",
      updateId,
      "TaskId:",
      taskId,
      "App LinkId:",
      appLinkId
    );

    const updateIndex = updates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) return;

    const taskIndex = updates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) return;

    const updatedAppLinks = updates[updateIndex].tasks[
      taskIndex
    ].appLinks.filter((appLink: link) => appLink.id !== appLinkId);

    const updatedUpdates = [...updates];
    updatedUpdates[updateIndex].tasks[taskIndex] = {
      ...updatedUpdates[updateIndex].tasks[taskIndex],
      appLinks: updatedAppLinks,
    };

    setUpdates(updatedUpdates);
  }
  function handleAppLinkChange(
    e: React.ChangeEvent<HTMLInputElement>,
    updateId: number,
    taskId: number,
    appLinkId: number
  ) {
    console.log(
      "App Link Change called with UpdateId:",
      updateId,
      "TaskId:",
      taskId,
      "App LinkId:",
      appLinkId
    );

    const updatedUpdates = [...updates];
    const updateIndex = updatedUpdates.findIndex(
      (update: Update) => update.id === updateId
    );
    if (updateIndex === -1) return;

    const taskIndex = updatedUpdates[updateIndex].tasks.findIndex(
      (task: Task) => task.id === taskId
    );
    if (taskIndex === -1) return;

    const appLinkIndex = updatedUpdates[updateIndex].tasks[
      taskIndex
    ].appLinks.findIndex((appLink: link) => appLink.id === appLinkId);
    if (appLinkIndex === -1) return;

    updatedUpdates[updateIndex].tasks[taskIndex].appLinks[appLinkIndex].url =
      e.target.value;

    setUpdates(updatedUpdates);
  }

  useEffect(() => {
    console.log("Updates=> ", updates);
  }, [updates]);
  return (
    <>
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <AlertDialog
          open={open}
          setOpen={setOpen}
          updates={updates}
        ></AlertDialog>

        <AddUpdatesFromEncodedDialog
          open={addUpdatesOpen}
          setOpen={setAddUpdatesOpen}
          updates={updates}
          setUpdates={setUpdates}
        ></AddUpdatesFromEncodedDialog>

        <Box
          overflow={"scroll"}
          sx={{
            width: "60%",
            // padding: "1rem",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              pl: 4,
              pr: 2,
            }}
          >
            <TextFieldShadcn
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              label="Name"
              variant="filled"
            />
            <Box>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => setAddUpdatesOpen(!addUpdatesOpen)}
              endIcon={<AddIcon />}
              sx={{
                alignSelf: "center",
                fontSize: "1rem",
                padding: "10px 20px",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: 3,
                mr: 2,
              }}
              size="medium" 
              >
              Add from Base64
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleShareUpdates(updates)}
              endIcon={<ShareIcon />}
              sx={{
                alignSelf: "center",
                fontSize: "1rem",
                padding: "10px 20px",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: 3,
              }}
              size="medium"
              >
              Share Updates
            </Button>
              </Box>
          </Box>

          <Divider sx={{ marginTop: 1 }} orientation="horizontal"></Divider>
          <Divider orientation="horizontal"></Divider>

          <Box ml={4} mt={1} display="flex" alignItems="end" gap={1}>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                color="success"
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </Box>
          </Box>
          {updates.map((update: Update, index: number) => {
            return (
              <Box key={update.id}>
                <Box ml={4} mt={1} display="flex" alignItems="flex-end" gap={1}>
                  <Select
                    id="tool-category-select-standard"
                    variant="filled"
                    value={update.category}
                    onChange={(e: SelectChangeEvent<string>) =>
                      handleCategoryChange(e, update.id)
                    }
                    label="Age"
                  >

                    {category_list.map((category: string) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>

                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteRoundedIcon />}
                      color="error"
                      onClick={(e) => {
                        handleDeleteCategory(e, update.id);
                      }}
                    >
                      Delete Category
                    </Button>
                  </Box>
                </Box>

                {update.tasks.map((task: Task, index: number) => {
                  return (
                    <Box key={task.id} mt={2} ml={4}>
                      <Box display="flex" alignItems="flex-end" gap={1}>
                        <TextFieldShadcn
                          id={"task-title-" + task.id.toString()}
                          value={task.title}
                          placeholder="Ticket's Title"
                          label={`Ticket: ${index + 1}`}
                          variant="filled"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTicketTitleChange(e, update.id, task.id)
                          }
                          sx={{ flex: "0 0 70%", alignSelf: "flex-start" }} // Fixed width proportion
                        ></TextFieldShadcn>
                        <Box
                          sx={{ flex: "0 0 30%" }} // Fixed width proportion
                        >
                          <Button
                            variant="outlined"
                            startIcon={<DeleteRoundedIcon />}
                            color="error"
                            onClick={(e) => {
                              handleDeleteTicket(e, update.id, task.id);
                            }}
                          >
                            Delete Ticket
                          </Button>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="flex-end"
                        justifyContent={"space-between"}
                        mt={2}
                        gap={1}
                      >
                        <TextFieldShadcn
                          id={"task-jiralink-" + task.id.toString()}
                          value={task.jiraLink}
                          placeholder="https://jirasw.nvidia.com/browse/RGENG-"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleJiraLinkChange(e, update.id, task.id)
                          }
                          variant="filled"
                          sx={{ flex: "0 0 70%", alignSelf: "flex-start" }} // Fixed width proportion
                        ></TextFieldShadcn>
                      </Box>
                      {task.statuses.map((status: Status, index: number) => {
                        return (
                          <Box key={status.id} mt={1} ml={4}>
                            <Box
                              display="flex"
                              alignItems="flex-end"
                              justifyContent={"space-between"}
                              mt={2}
                              gap={1}
                            >
                              <TextFieldShadcn
                                id={"mrlink-" + status.id.toString()}
                                label={index + 1}
                                value={status.status}
                                placeholder="In Progress/Completed"
                                fullWidth
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleStatusChange(
                                    e,
                                    update.id,
                                    task.id,
                                    status.id
                                  )
                                }
                                variant="filled"
                              ></TextFieldShadcn>
                              <Box
                                sx={{ flex: "0 0 25%" }} // Fixed width proportion
                              >
                                <Button
                                  variant="outlined"
                                  startIcon={<DeleteRoundedIcon />}
                                  color="error"
                                  onClick={(e) => {
                                    handleDeleteStatus(
                                      e,
                                      update.id,
                                      task.id,
                                      status.id
                                    );
                                  }}
                                >
                                  Delete Status
                                </Button>
                              </Box>
                            </Box>
                            {status.details.map(
                              (detail: Detail, index: number) => {
                                return (
                                  <Box key={detail.id} ml={4}>
                                    <Box
                                      display="flex"
                                      alignItems="flex-end"
                                      justifyContent={"space-between"}
                                      gap={1}
                                    >
                                      {/* TextFieldShadcn with 60% width */}
                                      <TextFieldShadcn
                                        id={`taskDetail-${detail.id}-${status.id}`}
                                        label={indexToAlphabet(index)}
                                        value={detail.description}
                                        placeholder="90% of the job is to do this"
                                        fullWidth
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                          handlePointChange(
                                            e,
                                            update.id,
                                            task.id,
                                            status.id,
                                            detail.id
                                          )
                                        }
                                        variant="filled"
                                      // sx={{ flex: "0 0 80%" }} // Fixed width proportion
                                      />
                                      <Box
                                        sx={{ flex: "0 0 20%" }} // Fixed width proportion
                                      >
                                        <Button
                                          variant="outlined"
                                          startIcon={<DeleteRoundedIcon />}
                                          color="error"
                                          onClick={(e) => {
                                            handleDeletePoint(
                                              e,
                                              update.id,
                                              task.id,
                                              status.id,
                                              detail.id
                                            );
                                          }}
                                        >
                                          Delete Point
                                        </Button>
                                      </Box>
                                      {/* Button 1 with 20% width */}
                                    </Box>

                                    {detail.subPoints?.map(
                                      (subPoint: SubDetail, index: number) => {
                                        return (
                                          <Box key={subPoint.id} ml={4}>
                                            <Box
                                              display="flex"
                                              alignItems="flex-end"
                                              justifyContent={"space-between"}
                                              gap={1}
                                            >
                                              {/* TextFieldShadcn with 60% width */}
                                              <TextFieldShadcn
                                                id={`taskDetail-${subPoint.id}-${detail.id}-${status.id}`}
                                                label={"-"}
                                                value={subPoint.description}
                                                placeholder={`Lie ${index + 1}`}
                                                fullWidth
                                                onChange={(
                                                  e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                  handleSubPointChange(
                                                    e,
                                                    update.id,
                                                    task.id,
                                                    status.id,
                                                    detail.id,
                                                    subPoint.id
                                                  )
                                                }
                                                variant="filled"
                                              // sx={{ flex: "0 0 80%" }} // Fixed width proportion
                                              />
                                              <Box
                                                sx={{ flex: "0 0 30%" }} // Fixed width proportion
                                              >
                                                <Button
                                                  variant="outlined"
                                                  startIcon={
                                                    <DeleteRoundedIcon />
                                                  }
                                                  color="error"
                                                  onClick={(e) => {
                                                    handleDeleteSubPoint(
                                                      e,
                                                      update.id,
                                                      task.id,
                                                      status.id,
                                                      detail.id,
                                                      subPoint.id
                                                    );
                                                  }}
                                                >
                                                  Delete SubPoint
                                                </Button>
                                              </Box>
                                              {/* Button 1 with 20% width */}
                                            </Box>
                                          </Box>
                                        );
                                      }
                                    )}
                                    <Box
                                      ml={4}
                                      mt={1}
                                      display="flex"
                                      alignItems="flex-end"
                                      gap={1}
                                    >
                                      <Box>
                                        {/* <button>Button 1</button> */}
                                        <Button
                                          variant="outlined"
                                          startIcon={<AddRoundedIcon />}
                                          color="success"
                                          onClick={(e) => {
                                            handleAddSubPoint(
                                              e,
                                              update.id,
                                              task.id,
                                              status.id,
                                              detail.id
                                            );
                                          }}
                                        >
                                          Add SubPoint
                                        </Button>
                                      </Box>
                                    </Box>
                                  </Box>
                                );
                              }
                            )}
                            <Box
                              ml={4}
                              mt={1}
                              display="flex"
                              alignItems="flex-end"
                              gap={1}
                            >
                              <Box>
                                {/* <button>Button 1</button> */}
                                <Button
                                  variant="contained"
                                  startIcon={<AddRoundedIcon />}
                                  color="success"
                                  onClick={(e) =>
                                    handleAddPoint(
                                      e,
                                      update.id,
                                      task.id,
                                      status.id
                                    )
                                  }
                                >
                                  Add Point
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      <Box
                        ml={4}
                        mt={1}
                        display="flex"
                        alignItems="flex-end"
                        gap={1}
                      >
                        <Box>
                          {/* <button>Button 1</button> */}
                          <Button
                            variant="contained"
                            startIcon={<AddRoundedIcon />}
                            color="success"
                            onClick={(e) => {
                              handleAddStatus(e, update.id, task.id);
                            }}
                          >
                            Add Status
                          </Button>
                        </Box>
                      </Box>
                      {task.mergeRequests.length > 0 && (
                        <Typography
                          variant="body1"
                          component="div"
                          mt={1}
                          sx={{ flexGrow: 1 }}
                        >
                          MR:-
                        </Typography>
                      )}
                      {task.mergeRequests.map((mergeRequest: link) => {
                        return (
                          <Box key={mergeRequest.id} ml={2}>
                            <Box
                              display="flex"
                              alignItems="flex-end"
                              justifyContent={"space-between"}
                              gap={1}
                            >
                              <TextFieldShadcn
                                id={"mrlink-" + mergeRequest.id.toString()}
                                value={mergeRequest.url}
                                placeholder="No API KEYS on GIT Please"
                                fullWidth
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleMRLinkChange(
                                    e,
                                    update.id,
                                    task.id,
                                    mergeRequest.id
                                  );
                                }}
                                variant="filled"
                              ></TextFieldShadcn>
                              <Box
                                sx={{ flex: "0 0 20%" }} // Fixed width proportion
                              >
                                <Button
                                  variant="outlined"
                                  startIcon={<DeleteRoundedIcon />}
                                  color="error"
                                  onClick={(e) => {
                                    handleDeleteMRLink(
                                      e,
                                      update.id,
                                      task.id,
                                      mergeRequest.id
                                    );
                                  }}
                                >
                                  Delete MR Link
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      <Box
                        ml={4}
                        mt={1}
                        display="flex"
                        alignItems="flex-end"
                        gap={1}
                      >
                        <Box>
                          {/* <button>Button 1</button> */}
                          <Button
                            variant="outlined"
                            startIcon={<AddRoundedIcon />}
                            color="success"
                            onClick={(e) => {
                              handleAddMRLink(e, update.id, task.id);
                            }}
                          >
                            Add MR Link
                          </Button>
                        </Box>
                      </Box>

                      {task.appLinks.length > 0 && (
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ flexGrow: 1 }}
                        >
                          App:-
                        </Typography>
                      )}
                      {task.appLinks.map((appLink: link) => {
                        return (
                          <Box key={appLink.id} ml={2}>
                            <Box
                              display="flex"
                              alignItems="flex-end"
                              justifyContent={"space-between"}
                              gap={1}
                            >
                              <TextFieldShadcn
                                id={"applink-" + appLink.id.toString()}
                                value={appLink.url}
                                placeholder="Don't Deploy on Friday"
                                fullWidth
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleAppLinkChange(
                                    e,
                                    update.id,
                                    task.id,
                                    appLink.id
                                  );
                                }}
                                variant="filled"
                              ></TextFieldShadcn>
                              <Box
                                sx={{ flex: "0 0 25%" }} // Fixed width proportion
                              >
                                <Button
                                  variant="outlined"
                                  startIcon={<DeleteRoundedIcon />}
                                  color="error"
                                  onClick={(e) => {
                                    handleDeleteAppLink(
                                      e,
                                      update.id,
                                      task.id,
                                      appLink.id
                                    );
                                  }}
                                >
                                  Delete APP Link
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      <Box
                        ml={4}
                        mt={1}
                        display="flex"
                        alignItems="flex-end"
                        gap={1}
                      >
                        <Box>
                          {/* <button>Button 1</button> */}
                          <Button
                            variant="outlined"
                            startIcon={<AddRoundedIcon />}
                            color="success"
                            onClick={(e) => {
                              handleAddAppLink(e, update.id, task.id);
                            }}
                          >
                            Add APP Link
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
                <Box ml={4} mt={1} display="flex" alignItems="flex-end" gap={1}>
                  <Box>
                    {/* <button>Button 1</button> */}
                    <Button
                      variant="contained"
                      startIcon={<AddRoundedIcon />}
                      color="success"
                      onClick={(e) => {
                        handleAddTicket(e, update.id);
                      }}
                    >
                      Add Ticket
                    </Button>
                  </Box>
                </Box>
                <Divider
                  sx={{ marginTop: 2, marginBottom: 2 }}
                  orientation="horizontal"
                />
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            width: "40%",
            height: "100%",
            // backgroundColor: "", // Optional for visualization
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              height: "100%",

              width: "100%",
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,
                pl: 2,
                pr: 2,
                // pb: 2,
                // pt: 2,
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: "1.5rem",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  boxShadow: 2,
                }}
              >
                Preview:
              </Typography>

              <ToggleButtonGroup
                value={formatFor}
                exclusive
                onChange={handleFormatFor}
                aria-label="text alignment"
                size="medium"
              >
                <ToggleButton value="skype">Skype</ToggleButton>
                <ToggleButton value="email">Email</ToggleButton>
                <ToggleButton value="slack">Slack</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Preview Section */}
            <AceEditor
              value={formatUpdates(updates, formatFor)}
              fontSize={14}
              mode="text"
              theme="github"
              name="xyz"
              width="100%"
              height="100%"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />

            {/* Share Button Section */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
