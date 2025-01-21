"use client";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { Box } from "@mui/material";

export default function Instructions() {
  return (
    <Box mt={"7rem"} sx={{ flexGrow: 1 }}>
      <AceEditor
        value={`I hope you don't like combining updates. 
        
Here is a link to CREATE and COMBINE daily updates.
https://updates-tracker.vasaniyakush.me/instructions

I request and insist everyone, with all due respect, to use this from tomorrow.

Here's quick guide.
"Creating and Sharing your updates"
- Create your updates from the "Create" tab. 
- It's pretty simple, just make changes on the left, preview will be on the right.
- To share on skype just select all on left and copy.
- To share with the PERSON who is combining updates. Click on "Share Updates" green color button on bottom right.
- Text will be copied to your clipboard, share this "base64encodedtext" as it is to that person on skype.

"Merging"
- Navigate to the "Combine" tab
- Copy the base64encoded text, and paste in the textfield on top left.
- Click on merge. BOOM MAGIC.

- After merging all updates in such way, on left top click "email" or "slack" for formatted updates.
- Copy and send. 

Your life is easy now. 

Thanks to all.
                    `}
        fontSize={18}
        mode="markdown"
        theme="github"
        name="xyz"
        width="100%"
        height="80vh"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
        readOnly
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </Box>
  );
}
