use tauri::{RunEvent};

fn main() {
    let mut app = tauri::Builder::default()
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, e| {
        match e {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        }
    });
}
