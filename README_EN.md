# Temha CLI
Temha CLI is a Node.js-based command-line tool that helps you manage Templatehouse (Temha) no-code web projects locally. It allows you to edit your Temha projects directly in VSCode, preview the changes in real time, and push updates to the server — all in one streamlined workflow.

https://github.com/user-attachments/assets/b9e27b8b-d8cb-4008-b1c0-f85b817e7938


## 📦 Prerequisites
Temha CLI runs on Node.js.   
Make sure the following environment is properly set up before using the tool.

### Node.js (Recommended: version 18 or higher)
1. Open your terminal and check if Node.js is installed:
```bash
$ node -v
```

2. If a version like v18.18.2 is displayed as shown below, Node.js is installed correctly: 
```bash
v18.18.2
```
### How to Install Node.js
If Node.js is not installed, follow the steps below:   

#### 📦 Windows
1. Go to the [Node.js download page](https://nodejs.org/ko/download/)
2. Select the LTS version and download the `.msi` installer.
3. ollow the installation wizard (default options are recommended)
4. After installation, verify the installation by running the command `$ node -v` in your terminal
   
#### 🍎 macOS  
1. Download the LTS version `.pkg` file from the [Node.js download page](https://nodejs.org/en/download/).  
2. Complete the installation by following the installer wizard.  
3. After installation, verify the installation by running the command `$ node -v` in your terminal


## 🚀 Getting Started  
1. Clone the Temha CLI repository using GIT.  
```bash
https://github.com/openfieldth/temha-cli.git
```

2. Open your terminal and install Temha CLI.
```bash
$ npm install
```

3. Install Gulp CLI globally for preview functionality.
```bash
$ npm install -g gulp-cli
```

4. Log in with your Templatehouse account to access your projects.
```bash
# For SNS login users, please reset your password to get a new one before logging in.
$ npm run login
```

5. Check your project ID and pull the project.
```bash
# Pull all projects
$ npm run pull

# Pull a specific project (e.g., if the project ID is p1a2b3c4d5)
$ npm run pull -- p1a2b3c4d5
```

6. Upload Project After Modifications (Export)
```bash
# Upload the entire locally modified project
$ npm run push

# Upload only a specific project (e.g., if the project ID is p1a2b3c4d5)
npm run push -- p1a2b3c4d5
```

## 🌐 Generating and Running Preview Files (Live Server)
### Automatically generate HTML previews for each project
```bash
$ gulp
```
### Launch the preview server in your browser
```bash
# This command automatically opens the preview in your browser
$ gulp temha
```

## 🗑️ Trash Function Commands
Temha provides a trash feature that **temporarily stores deleted resources or projects**,   
allowing you to **restore or permanently delete** them when needed.  

> 💡 **Even if you delete page or project folders locally or remove them with the `Delete` key and then push,**  
> you can still view and restore these items in the Temha editor’s 'Trash' menu.

### Resource Trash Commands
| Command                | Description                    |
|------------------------|--------------------------------|
| `npm run trash:list`   | View list of deleted resources |
| `npm run trash:restore`| Restore resources from trash   |
| `npm run trash:empty`  | Permanently empty resource trash|

### Project Trash Commands
| Command                       | Description                     |
|-------------------------------|---------------------------------|
| `npm run project-trash:list`  | View list of deleted projects   |
| `npm run project-trash:restore`| Restore projects from trash    |
| `npm run project-trash:empty` | Permanently empty project trash |

> ⚠️ If you accidentally delete files or projects, you can safely restore them using the `:restore` commands.  
> ⚠️ However, once you run the `:empty` commands, those items are **permanently deleted** and cannot be recovered.

## ⛔ Resource File Caution (Excluding CSS/JS Files)
The `resources/` folder in your local project contains commonly used CSS, JS, and image resources.  
Please note that files with the following **specific names will not be pushed to the server.**

### Files Excluded from Push

#### [CSS Files]
- `setting.css`
- `plugin.css`
- `style.css`

#### [JS Files]
- `setting.js`
- `plugin.js`
- `style.js`

> ⚠️ These files are considered Temha **system resources** and will not be pushed as part of your project.  
> ⚠️ If customization is needed, please use different filenames or separate them as distinct resources.  
> ⚠️ If these system files are missing on the server, the versions from the **resources-common** folder will be automatically pushed.  
> ⚠️ Do not modify or delete the system files in the **resources-common** folder.

      


## 🖼️ Resource File Path Guide (Images/Videos)
In Temha projects, there are **two ways** to reference image and video resources.

### 1. Relative Path Method
```html
<!-- Image example -->
<img src="../../resources/images/img_01.jpg">

<!-- Icon example -->
<img src="../../resources/icon/img_01.svg">

<!-- Video example -->
<video src="../../resources/video/video.mp4" controls></video>
```


### 2. Absolute Path Method
```html
<img src="/api/dn/[PROJECT_ID]/img_01.jpg">
```


## 📁 Project File Structure
### Local Working Directory
```plaintext
[Temha]-workspace/
├── [ProjectName (Project ID)]/
│   ├── [PageName (Page ID)]/
│   │   ├── header/
│   │   ├── content/
│   │   │   └── [blockName]/
│   │   │       ├── blockName.html
│   │   │       ├── blockName.css
│   │   │       ├── blockName.js
│   │   │       └── block.json
│   │   ├── footer/
│   │   ├── block_order.json      # Defines block display order
│   │   └── page.json             # Defines page name and HTML filename
│   └── resources/
│       ├── css/
│       ├── js/
│       ├── images/               # Image folder
│       ├── icons/                # Icon folder
│       └── video/                # Video folder
│   ├── pageOrder.json            # Defines page order
│   └── project.json              # Defines project name
```
> 💡 The `icons` and `video` folders inside `resources` are automatically included on pull  
> **only if the used blocks contain those resources.**


## 🧰 Temha CLI Main Commands Summary
| Command                    | Description                       |
|----------------------------|---------------------------------|
| `npm install`              | Initial CLI installation         |
| `npm run login`            | Login to Temha account           |
| `npm run pull`             | Pull all projects                |
| `npm run pull -- [ID]`     | Pull a specific project          |
| `npm run push`             | Upload all projects to editor    |
| `npm run push -- [ID]`     | Upload a specific project        |
| `gulp`                    | Generate preview HTML files       |
| `gulp temha`               | Launch preview in browser        |
| `npm run trash:list`       | View resource trash list         |
| `npm run trash:restore`    | Restore resources from trash     |
| `npm run trash:empty`      | Empty resource trash             |
| `npm run project-trash:list`      | View project trash list           |
| `npm run project-trash:restore`   | Restore projects from trash       |
| `npm run project-trash:empty`     | Permanently empty project trash   |



## ✍️ Project Modification Example
1. Navigate to `[username]-workspace/[projectName]/[pageName]/content/` in VSCode  
2. Edit the desired block’s `.html`, `.css`, and `.js` files  
3. Generate the preview by running `gulp`  
4. Check the preview in your browser with `gulp temha`  
5. If everything looks good, upload to the server with `npm run push -- [projectID]`

## 📄 License
Temha CLI is a dedicated tool integrated with the Templatehouse web service.  
This tool is licensed exclusively for Templatehouse members and license holders.  
Unauthorized copying, distribution, commercial use, or API integration without prior consent is prohibited.
Contact: [Inquiry/Suggestion Page](https://temha.io/help/qna)

## 🤝 Contributing
If you are interested in the project, feel free to submit a PR or open an Issue.  
For faster responses, please leave comments via the [🔗 Inquiry/Suggestion Page](https://temha.io/help/qna).  
We sincerely welcome your feedback and contributions!
