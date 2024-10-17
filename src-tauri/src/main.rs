use std::process::Command;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Start the Bat script
            let bat_result = Command::new("cmd")
                .args(&["/C", "_up_\\install-npcap.bat"]) // This runs the modified batch file
                .spawn();


            match bat_result {
                Ok(_) => println!("Started install-npcap.bat"),
                Err(e) => eprintln!("Failed to run install-npcap.bat: {}", e),
            }

            // Start the Python backend here
            let python_result = Command::new("python")
                .arg("_up_\\svApp\\app\\main.py") // Use backslashes for the Python script path
                .spawn();

            match python_result {
                Ok(_) => println!("Started Python backend"),
                Err(e) => eprintln!("Failed to start Python backend: {}", e),
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
