const fs = require('fs');
const path = require('path');

async function addNewPythonService(serviceInformation) {
  try {
    // Set project base path
    const projectBase = getCurrentProjectPath().trim();

    // Create service folder
    const svcFolderName = `service_${serviceInformation.serviceName}Service`;
    const svcDir = path.join(projectBase, svcFolderName);
    fs.mkdirSync(svcDir, { recursive: true });
    console.log(`Created folder: ${svcDir}`);

    // Write a simple Python file
    const svcFileName = `${serviceInformation.serviceName.toLowerCase()}-service.py`;
    const svcFilePath = path.join(svcDir, svcFileName);
    const content = `# ${serviceInformation.serviceName} Python Service\nprint("Hello from ${serviceInformation.serviceName} service!")\n`;
    fs.writeFileSync(svcFilePath, content, 'utf8');
    console.log(`Wrote service file: ${svcFilePath}`);
  } catch (err) {
    console.error('Error in addNewPythonService:', err);
  }
}

// Example usage:
let serviceInformation = {
  serviceName: "Main"
};

addNewPythonService(serviceInformation);

function getCurrentProjectPath() {
  // Use double backslashes for UNC path
  return "\\\\wsl.localhost\\Ubuntu-24.04\\home\\paarth\\MicroserviceServer_Setup";
}