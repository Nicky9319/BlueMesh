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
    // 1️⃣ Normalize project root for Windows vs. WSL
    const currentProject = await getCurrentProjectPath();
    const rawPath        = currentProject.path.trim();
    const wslPrefix      = '\\\\wsl.localhost\\\\';
    let projectBase;
    if (rawPath.startsWith(wslPrefix)) {
      const parts      = rawPath.slice(wslPrefix.length).split('\\');
      const distro     = parts.shift();
      projectBase      = [wslPrefix + distro, ...parts].join('\\');
      console.log(`→ [WSL] using UNC share: ${projectBase}`);
    } else {
      projectBase = rawPath;
      console.log(`→ [Win] using native path: ${projectBase}`);
    }

    // 2️⃣ Load template from ServiceTemplate/<lang>/<framework>/HTTP_SERVICE.txt
    const electronRes = process.resourcesPath;  // undefined outside Electron
    const templateRoot = electronRes
      ? path.join(electronRes, 'ServiceTemplate')
      : path.resolve(__dirname, '..', 'ServiceTemplate');
    const templateDir  = path.join(
      templateRoot,
      serviceInformation.language
    );
    const templatePath = path.join(templateDir, 'HTTP_SERVICE.txt');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at ${templatePath}`);
    }
    let content = fs.readFileSync(templatePath, 'utf8');

    // 3️⃣ Create service directory
    const svcFolderName = `service_${serviceInformation.serviceName}Service`;
    const svcDir        = path.join(projectBase, svcFolderName);
    fs.mkdirSync(svcDir, { recursive: true });
    console.log(`Created folder: ${svcDir}`);

    // 4️⃣ Replace HOST block, preserving indent
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_HOST_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_HOST_END>/m,
      (match, indent) => {
        return [
          `${indent}#<HTTP_SERVER_HOST_START>`,
          `${indent}httpServerHost = "${serviceInformation.host}"`,
          `${indent}#<HTTP_SERVER_HOST_END>`
        ].join('\n');
      }
    );

    // 5️⃣ Replace PORT block
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_PORT_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_PORT_END>/m,
      (match, indent) => {
        return [
          `${indent}#<HTTP_SERVER_PORT_START>`,
          `${indent}httpServerPort = ${serviceInformation.port}`,
          `${indent}#<HTTP_SERVER_PORT_END>`
        ].join('\n');
      }
    );

    // 6️⃣ Replace PRIVILEGED IPS block
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_END>/m,
      (match, indent) => {
        const ips = serviceInformation.privilegeIps
          .map(ip => `"${ip}"`)
          .join(', ');
        return [
          `${indent}#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_START>`,
          `${indent}httpServerPrivilegedIpAddress = [${ips}]`,
          `${indent}#<HTTP_SERVER_PRIVILEGED_IP_ADDRESS_END>`
        ].join('\n');
      }
    );

    // 7️⃣ Replace CORS block
    content = content.replace(
      /^([ \t]*)#<HTTP_SERVER_CORS_ADDITION_START>[\s\S]*?^[ \t]*#<HTTP_SERVER_CORS_ADDITION_END>/m,
      (match, indent) => {
        const line = `self.app.add_middleware(CORSMiddleware, allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)`;
        const body = serviceInformation.cors
          ? `${indent}${line}`
          : `${indent}# ${line}`;
        return [
          `${indent}#<HTTP_SERVER_CORS_ADDITION_START>`,
          body,
          `${indent}#<HTTP_SERVER_CORS_ADDITION_END>`
        ].join('\n');
      }
    );

    // 8️⃣ Write service file
    const svcFileName = `${serviceInformation.serviceName.toLowerCase()}-service.py`;
    const svcFilePath = path.join(svcDir, svcFileName);
    fs.writeFileSync(svcFilePath, content, 'utf8');
    console.log(`Wrote service file: ${svcFilePath}`);

    // 9️⃣ Update services.json
    const servicesJsonPath = path.join(projectBase, 'services.json');
    let services = [];
    if (fs.existsSync(servicesJsonPath)) {
      services = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf8'));
    }
    services.push({
      ServiceLanguage:               serviceInformation.language,
      ServiceFramework:              serviceInformation.framework,
      ServiceName:                   serviceInformation.serviceName,
      ServiceFolderName:             svcFolderName,
      ServiceFileName:               svcFileName,
      ServiceHttpHost:               serviceInformation.host,
      ServiceHttpPrivilegedIpAddress:serviceInformation.privilegeIps,
      ServiceHttpPort:               serviceInformation.port,
      ServiceType:                   "HTTP_SERVICE"
    });
    fs.writeFileSync(
      servicesJsonPath,
      JSON.stringify(services, null, 2),
      'utf8'
    );
    console.log(`Updated services.json at ${servicesJsonPath}`);

    // 🔟 Update .env
    const envPath = path.join(projectBase, '.env');
    let envContent = fs.existsSync(envPath)
      ? fs.readFileSync(envPath, 'utf8')
      : '';
    const varName = `${serviceInformation.serviceName.toUpperCase()}_SERVICE`;
    const varLine = `${varName}="${serviceInformation.host}:${serviceInformation.port}"`;
    envContent = envContent
      .replace(
        /#<ADD_DEVELOPMENT_SERVICES_ENVRIONMENT_VARIABLES>/,
        match => `${match}\n${varLine}`
      )
      .replace(
        /#<ADD_PRODUCTION_SERVICES_ENVRIONMENT_VARIABLES>/,
        match => `${match}\n# ${varLine}`
      );
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`Updated .env at ${envPath}`);

    console.log('✅ Python service added successfully!');
  } catch (err) {
    console.error('Error in addNewPythonService:', err);
  }
}

// Example usage:
let serviceInformation = {
  cors:        true,
  framework:   "fastapi",
  host:        "192.256.23.123",
  language:    "python",
  port:        5076,
  privilegeIps:["127.0.0.1","192.168.57.145"],
  serviceName: "Main"
};

addNewPythonService(serviceInformation);