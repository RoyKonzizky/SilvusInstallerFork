# Run the App

## Create an installer
   To create an installer, use the package manager [npm](https://www.npmjs.com/).

```
npm run tauri-build
```

## Run in browser
### Run the client
   To run in the browser, use the package manager [npm](https://www.npmjs.com/).

```
npm run dev
``` 
### Run the server
   Run the python server main file using the python command [python](https://docs.python.org/3/).
```
python .\app\main.py
```

# Development Notes
## Uninstallation Issue
   The uninstallation executable (.exe) might not fully delete all files, specifically the _up_ folder, if any scripts utilize the command prompt (cmd). This issue occurs under the following conditions:

Commands in main.rs that run batch scripts.
Batch scripts containing the /wait command.
The /wait command is a primary cause of this issue, as it keeps cmd running until all processes complete, preventing full deletion. To mitigate this, avoid using /wait where possible, as it keeps cmd active after closing the main application.

## main.rs Development Considerations
   When working within main.rs, pay special attention to:

match sections and argument (args) handling, as they may impact script execution and error handling.
creation_flags, which might also influence the behavior of the running scripts.
## Build Directory Naming
   For this project, the build directory is named dist. If you initialize another Tauri application using tauri init, specify the build directory as dist instead of the default build to maintain consistency.

## Secondary app.exe Window Issue
   On initial setup with Tauri, the main.rs file may lack a line required to prevent a secondary app.exe window from opening, which displays logs from batch files and prints from main.rs. After a second initialization, this line was automatically added at the top of main.rs, resolving the issue with the additional window.