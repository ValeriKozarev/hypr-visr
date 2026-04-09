use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::Emitter;

// Set to true immediately before we write the file ourselves, so the
// file watcher knows to ignore that event and not re-emit to the frontend.
static SELF_SAVE: AtomicBool = AtomicBool::new(false);

#[derive(Serialize, Deserialize)]
struct Task {
    id: String,
    title: String,
    #[serde(rename = "isDone")]
    is_done: bool,
    description: Option<String>,
    category: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct Category {
    id: String,
    icon: String,
    label: String,
    color: String,
    #[serde(rename = "bgColor")]
    bg_color: String,
    #[serde(rename = "borderColor")]
    border_color: String,
}

#[derive(Serialize, Deserialize)]
struct ToDoList {
    id: String,
    name: String,
    icon: Option<String>,
    tasks: Vec<Task>,
}

#[derive(Serialize, Deserialize)]
struct AppData {
    categories: Vec<Category>,
    lists: Vec<ToDoList>,
}

fn get_data_path() -> PathBuf {
    let home = std::env::var("HOME").expect("HOME not set");
    let dir = PathBuf::from(home).join(".hypr-visr");

    // Create directory if it doesn't exist
    fs::create_dir_all(&dir).ok();

    dir.join("tasks.json")
}

#[tauri::command]
fn load_app_data() -> AppData {
    let path = get_data_path();

    // If file doesn't exist, return empty data
    if !path.exists() {
        return AppData {
            categories: Vec::new(),
            lists: Vec::new(),
        };
    }

    // Read file and parse JSON
    let contents = fs::read_to_string(&path).unwrap_or_default();
    serde_json::from_str(&contents).unwrap_or_else(|_| AppData {
        categories: Vec::new(),
        lists: Vec::new(),
    })
}

#[tauri::command]
fn save_app_data(categories: Vec<Category>, lists: Vec<ToDoList>) {
    // Mark that the next file-change event is ours so the watcher skips it.
    SELF_SAVE.store(true, Ordering::SeqCst);

    let path = get_data_path();
    let data = AppData { categories, lists };
    let json = serde_json::to_string_pretty(&data).expect("Failed to serialize");
    fs::write(&path, json).expect("Failed to write file");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let watch_dir = get_data_path()
                .parent()
                .expect("data path has no parent")
                .to_path_buf();

            std::thread::spawn(move || {
                use notify::{EventKind, RecursiveMode, Watcher};
                use std::sync::mpsc::channel;

                let (tx, rx) = channel();

                let mut watcher =
                    notify::recommended_watcher(move |res: notify::Result<notify::Event>| {
                        if let Ok(event) = res {
                            let _ = tx.send(event);
                        }
                    })
                    .expect("Failed to create file watcher");

                watcher
                    .watch(&watch_dir, RecursiveMode::NonRecursive)
                    .expect("Failed to watch data directory");

                for event in rx {
                    // Only care about modifications/creations of tasks.json
                    let is_tasks_file = event.paths.iter().any(|p| {
                        p.file_name().and_then(|n| n.to_str()) == Some("tasks.json")
                    });

                    if !is_tasks_file {
                        continue;
                    }

                    match event.kind {
                        EventKind::Modify(_) | EventKind::Create(_) => {
                            // If we wrote the file ourselves, consume the flag and skip.
                            if SELF_SAVE.swap(false, Ordering::SeqCst) {
                                continue;
                            }
                            let _ = app_handle.emit("tasks-changed", ());
                        }
                        _ => {}
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![load_app_data, save_app_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
