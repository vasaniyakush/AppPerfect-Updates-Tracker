"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
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
import AddUpdatesFromEncodedDialog from "./addUpdatesFromEncodedDialog";
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
    if (formatFor == "jira") {
      finalStr += `Updates: ${getTodayDate()}\n\n`;

      updates.map((update: Update, index: number) => {

        update.tasks.map((task: Task, index: number) => {
          finalStr += `${task.jiraLink} | ${task.title}\n`
          task.statuses.map((status: Status, index: number) => {
            finalStr += `${status.status}\n`
            status.details.map((detail: Detail, index: number) => {
              finalStr += `    ${indexToAlphabet(index)}. ${detail.description}\n`
              detail.subPoints?.map((subPoint: SubDetail, index: number) => {
                finalStr += `        - ${subPoint.description}\n`
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
                <ToggleButton value="skype">Skype</ToggleButton>
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
