"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
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
import AlertDialog from "./dialog";
import AddUpdatesDialog from "./addUpdatesDialog";
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
import UpdatesEditor from "./updatesEditor";


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
// function pad(num:number):string{

// }

export default function Combine() {
  const [newUpdate, setNewUpdate] = useState<string | null>("");

  const [updates, setUpdates] = useLocalStorage<Update[]>(
    "combine-updates",
    []
  );

  const [formatFor, setFormatFor] = useLocalStorage<formatForTypes>(
    "combine-formatFor",
    "email"
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
      finalStr += `Updates: \n==============================\n`;
    } else if (formatFor == "email") {
      finalStr += "Hi Nautilus Team,\n\n";
    } else if (formatFor == "slack") {
      finalStr += `Updates: ${getTodayDate()}\n\n`;
    }
    if (formatFor == "jira") {
      finalStr += `Updates: ${getTodayDate()}\n\n`;

      updates.map((update: Update, index: number) => {

        update.tasks.map((task: Task, index: number) => {
          finalStr += `${task.jiraLink} | ${task.title}\n`
          task.statuses.map((status: Status, index: number) => {
            finalStr += `${status.status}\n`
            status.details.map((detail: Detail, index: number) => {
              finalStr += `\t${indexToAlphabet(index)}. ${detail.description}\n`
              detail.subPoints?.map((subPoint: SubDetail, index: number) => {
                finalStr += `\t\t- ${subPoint.description}\n`
              })
            })
          })
          if (task.mergeRequests.length > 0) {
            finalStr += `MR:-`
          }
          task.mergeRequests.map((mergeRequest: link, index: number) => {
            finalStr += `\t${mergeRequest.url}\n`
          })
          if (task.appLinks.length > 0) {
            finalStr += `App:-`
          }
          task.appLinks.map((appLink: link, index: number) => {
            finalStr += `\t${appLink.url}\n`
          })
          finalStr += `\n\n`
        })
      })
    }
    else {
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
    }
    if (formatFor == "email") {
      finalStr += "Thanks,\nAppPerfect Team\n";
    }

    return finalStr;
  }

  function handleAddUpdates() {
    console.log("Add Updates called");
    try {
      const newUpdates: Update[] =
        newUpdate != null ? JSON.parse(atob(newUpdate)) : [];
      const currUpdates = [...updates];
      newUpdates.map((update: Update) => {
        // update.category

        const existingIndex = currUpdates.findIndex(
          (u: Update) => u.category === update.category
        );
        if (existingIndex === -1) {
          const addUpdate = { ...update, id: currUpdates.length + 1 };
          currUpdates.push(addUpdate);
        } else {
          // currUpdates[existingIndex].tasks = [
          //   ...currUpdates[existingIndex].tasks,
          //   ...update.tasks,
          // ];

          update.tasks.map((task: Task) => {

            const existingTaskIndex = currUpdates[existingIndex].tasks.findIndex(
              (t: Task) => t.title === task.title
            );

            if (existingTaskIndex === -1) {
              const newTask = {
                ...task,
                id: currUpdates[existingIndex].tasks.length + 1,
              };
              currUpdates[existingIndex].tasks.push(newTask);
            }
            else {
              // task.
              currUpdates[existingIndex].tasks[existingTaskIndex].mergeRequests = currUpdates[existingIndex].tasks[existingTaskIndex].mergeRequests.concat(task.mergeRequests);
              for (let i = 0; i < currUpdates[existingIndex].tasks[existingTaskIndex].mergeRequests.length; i++) {
                currUpdates[existingIndex].tasks[existingTaskIndex].mergeRequests[i].id = i + 1;
              }
              currUpdates[existingIndex].tasks[existingTaskIndex].appLinks = currUpdates[existingIndex].tasks[existingTaskIndex].appLinks.concat(task.appLinks);
              for (let i = 0; i < currUpdates[existingIndex].tasks[existingTaskIndex].appLinks.length; i++) {
                currUpdates[existingIndex].tasks[existingTaskIndex].appLinks[i].id = i + 1;
              }

              for (let i = 0; i < task.statuses.length; i++) {
                const existingStatusIndex = currUpdates[existingIndex].tasks[existingTaskIndex].statuses.findIndex(
                  (s: Status) => s.status === task.statuses[i].status
                );
                if (existingStatusIndex === -1) {
                  currUpdates[existingIndex].tasks[existingTaskIndex].statuses.push(task.statuses[i]);
                }
                else {
                  currUpdates[existingIndex].tasks[existingTaskIndex].statuses[existingStatusIndex].details = [...new Set([...currUpdates[existingIndex].tasks[existingTaskIndex].statuses[existingStatusIndex].details, ...task.statuses[i].details])];;
                }
              }

              for (let i = 0; i < currUpdates[existingIndex].tasks[existingTaskIndex].statuses.length; i++) {
                currUpdates[existingIndex].tasks[existingTaskIndex].statuses[i].id = i + 1;
                for (let j = 0; j < currUpdates[existingIndex].tasks[existingTaskIndex].statuses[i].details.length; j++) {
                  currUpdates[existingIndex].tasks[existingTaskIndex].statuses[i].details[j].id = j + 1;

                }
              }
            }


            // const newTask = {
            //   ...task,
            //   id: currUpdates[existingIndex].tasks.length + 1,
            // };
            // currUpdates[existingIndex].tasks.push(newTask);
          });
        }

        setUpdates(currUpdates);
        setNewUpdate("");
      });
    } catch (e) {
      console.error("Invalid JSON", e);
      alert("Invalid JSON");
    }
    // setAddUpdatesOpen(true);
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
          // backgroundColor: "#",
        }}
      >

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
              pr: 5,
              // gap: 2, // Adds space between elements
              // mt: 2, // Adds margin-top for spacing from other elements
            }}
          >
            <TextFieldShadcn
              id="name"
              value={newUpdate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUpdate(e.target.value)
              }
              placeholder="Enter base64encoded updates here to merge"
              // label="Name"
              variant="standard"
              fullWidth
              margin="normal"
            // sx={{
            //   flex: 1, // Ensures the TextFieldShadcn grows if space is available
            // }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUpdates} // Replace with desired functionality
              sx={{
                whiteSpace: "nowrap", // Prevents text overflow
                padding: "10px 20px",
                marginLeft: "10px",
              }}
            >
              Merge
            </Button>
          </Box>

          <Divider sx={{ marginTop: 1 }} orientation="horizontal"></Divider>
          <Divider orientation="horizontal"></Divider>

          <UpdatesEditor updates={updates} setUpdates={setUpdates} />
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
                {/* <ToggleButton value="skype">Skype</ToggleButton> */}
                <ToggleButton value="email">Email</ToggleButton>
                <ToggleButton value="slack">Slack</ToggleButton>
                <ToggleButton value="jira">Jira</ToggleButton>
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
