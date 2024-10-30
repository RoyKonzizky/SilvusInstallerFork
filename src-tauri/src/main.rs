// Prevents additional console window on Windows in release, DO NOT REMOVE!! unless you want to see the prints of the status of the batch scripts
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::os::windows::process::CommandExt; // Import CommandExt for creation_flags

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Start the Bat script for installing Npcap
            let bat_result = Command::new("cmd")
                .args(&["/C", "_up_\\install-npcap.bat"]) // Use backslashes
                .creation_flags(0x08000000) // CREATE_NO_WINDOW
                .spawn();

            //match bat_result {
            //    Ok(_) => println!("Started install-npcap.bat"),
            //    Err(e) => eprintln!("Failed to run install-npcap.bat: {}", e),
            //}

            // Start the Python backend
            let python_result = Command::new("cmd")
                .args(&["/C", "_up_\\run-svApp.bat"]) // "/C", it closes the terminal after the process finishes. use if you want to see the shell. "/B" is for background
                .creation_flags(0x08000000) // CREATE_NO_WINDOW
                .spawn();

            //match python_result {
            //    Ok(_) => println!("Started Python backend"),
            //    Err(e) => eprintln!("Failed to start Python backend: {}", e),
            //}

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
