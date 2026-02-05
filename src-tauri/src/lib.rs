use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
struct Task {
    id: u64,
    title: String,
    #[serde(rename = "isDone")]
    is_done: bool,
    description: Option<String>,
    category: Option<String>,
}

fn get_tasks_path() -> PathBuf {
    let home = std::env::var("HOME").expect("HOME not set");
    let dir = PathBuf::from(home).join(".hypr-visr");

    // Create directory if it doesn't exist
    fs::create_dir_all(&dir).ok();

    dir.join("tasks.json")
}

#[tauri::command]
fn load_tasks() -> Vec<Task> {
    let path = get_tasks_path();

    // If file doesn't exist, return empty vec
    if !path.exists() {
        return Vec::new();
    }

    // Read file and parse JSON
    let contents = fs::read_to_string(&path).unwrap_or_default();
    serde_json::from_str(&contents).unwrap_or_else(|_| Vec::new())
}

#[tauri::command]
fn save_tasks(tasks: Vec<Task>) {
    let path = get_tasks_path();
    let json = serde_json::to_string_pretty(&tasks).expect("Failed to serialize");
    fs::write(&path, json).expect("Failed to write file");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_tasks, save_tasks])        
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
