use std::process::Command;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Start the Python backend here
            Command::new("python")
                .arg("./_up_/svApp/app/main.py")
                .spawn()
                .expect("failed to start Python backend");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
