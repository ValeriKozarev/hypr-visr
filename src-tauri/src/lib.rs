use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

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
    let path = get_data_path();
    let data = AppData { categories, lists };
    let json = serde_json::to_string_pretty(&data).expect("Failed to serialize");
    fs::write(&path, json).expect("Failed to write file");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_app_data, save_app_data])        
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
