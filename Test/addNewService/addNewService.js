const fs = require('fs');
const path = require('path');


function getCurrentProjectPath() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectPath = "\\\\wsl.localhost\\Ubuntu-24.04\\home\\paarth\\MicroserviceServer_Setup"; // Example path
      resolve({ path: projectPath });
    }, 1000); // Simulate async operation
  });
}


async function addNewPythonService(serviceInformation) {
  try {
    // ─── 1️⃣ Normalize project root for Windows vs. WSL ───────────────────────
    const currentProject = await getCurrentProjectPath();  // { path: "…UNC or C:\\…" }
    const rawPath = currentProject.path.trim();
    const wslPrefix = '\\\\wsl.localhost\\\\';
    let projectBase, distroName = '';

    if (rawPath.startsWith(wslPrefix)) {
      const parts = rawPath.slice(wslPrefix.length).split('\\');
      distroName = parts.shift();
      projectBase = [wslPrefix + distroName, ...parts].join('\\');
      console.log(`→ [WSL] using UNC share: ${projectBase}`);
    } else {
      projectBase = rawPath;
      console.log(`→ [Win] using native path: ${projectBase}`);
    }

    // ─── 2️⃣ Resolve HTTP_SERVICE.txt via language & framework ────────────────
    const electronRes = process.resourcesPath;
    const templateRoot = electronRes
      ? path.join(electronRes, 'ServiceTemplate')
      : path.resolve(__dirname, '..', 'ServiceTemplate');
    const templateDir = path.join(templateRoot, serviceInformation.language);
    const templatePath = path.join(templateDir, 'HTTP_SERVICE.txt');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, 'utf8');

    // ─── 3️⃣ Create service directory ────────────────────────────────────────
    const svcFolderName = `service_${serviceInformation.serviceName}Service`;
    const svcDir = path.join(projectBase, svcFolderName);
    fs.mkdirSync(svcDir, { recursive: true });
    console.log(`Created folder: ${svcDir}`);

    // ─── 4️⃣ Templating replacements ─────────────────────────────────────────
    let content = template
      .replace(/SERVICE_NAME/g, serviceInformation.serviceName)
      .replace(/SERVICE_PORT/g, serviceInformation.servicePort)
      .replace(/SERVICE_HOST/g, serviceInformation.serviceHost);

    // ─── 5️⃣ Write out the service .py file ──────────────────────────────────
    const svcFileName = `${serviceInformation.serviceName.toLowerCase()}-service.py`;
    const svcFilePath = path.join(svcDir, svcFileName);
    fs.writeFileSync(svcFilePath, content, 'utf8');
    console.log(`Wrote service file: ${svcFilePath}`);

    // ─── 6️⃣ Update services.json ───────────────────────────────────────────
    // ...existing code...

    // ─── 7️⃣ Update .env ───────────────────────────────────────────────────
    // ...existing code...

    console.log('✅ Python service added successfully!');
  } catch (err) {
    console.error('Error in addNewPythonService:', err);
  }
}


// Example usage:
let serviceInformation = {
  cors:        true,
  framework:   "fastapi",
  host:        "127.0.0.1",
  language:    "python",
  port:        5076,
  privilegeIps:["127.0.0.1"],
  serviceName: "Main"
};

addNewPythonService(serviceInformation);