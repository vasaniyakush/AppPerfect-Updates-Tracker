import Tool from "@/component/tool";
import { AppBar, Box, Link, Toolbar, Typography } from "@mui/material";
export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mady by{" "}
            <Link
              color="textPrimary"
              href="https://www.vasaniyakush.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kush Vasaniya
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>

      <Tool />
    </Box>
  );
}
