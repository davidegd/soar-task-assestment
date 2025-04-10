import { execSync } from "child_process"
import fs from "fs"
import path from "path"

function runCommand(command: string): void {
  try {
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    process.exit(1)
  }
}

function createExecutableFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content)
  fs.chmodSync(filePath, "755")
}

console.log("📦 Installing dependencies...")
runCommand(
  "npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional"
)

console.log("🐶 Initializing Husky...")
runCommand("npx husky install")

const huskyDir = path.join(process.cwd(), ".husky")
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir)
}

console.log("Setting up pre-commit hook...")
createExecutableFile(
  path.join(huskyDir, "pre-commit"),
  `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Validating code before commit..."
npm run pre-commit
`
)

console.log("Setting up pre-push hook...")
createExecutableFile(
  path.join(huskyDir, "pre-push"),
  `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."
npm run test
npm run build
`
)

console.log("Setting up commit-msg hook...")
createExecutableFile(
  path.join(huskyDir, "commit-msg"),
  `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
`
)

console.log("Updating package.json...")
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

if (!packageJson.scripts) {
  packageJson.scripts = {}
}

packageJson.scripts.prepare = "husky install"
packageJson.scripts["pre-commit"] = "lint-staged && npm run type-check"

if (!packageJson["lint-staged"]) {
  packageJson["lint-staged"] = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"],
  }
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log("✅ Husky setup completed successfully!")
console.log("🚀 Your commits will now be automatically validated.")
