import * as git from "isomorphic-git"
import * as Y from "yjs"
import * as fs from "fs"
import * as path from "path"
import { promisify } from "util"

// isomorphic-git expects fs to have certain methods
const fsPromises = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkdir: promisify(fs.mkdir),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
  lstat: promisify(fs.lstat),
  rmdir: promisify(fs.rmdir),
  unlink: promisify(fs.unlink),
  chmod: promisify(fs.chmod),
  readlink: promisify(fs.readlink),
  symlink: promisify(fs.symlink),
}

// Create fs-compatible object for isomorphic-git
const gitFs = {
  ...fs,
  promises: fsPromises,
} as any

interface GitCommitOptions {
  workspaceId: string
  userId: string
  message: string
  branch?: string
}

interface GitFileChange {
  path: string
  content: string
}

export class GitService {
  private workspaceDir: string

  constructor(workspaceId: string) {
    // In production, use a proper workspace directory structure
    this.workspaceDir = path.join(process.cwd(), ".workspaces", workspaceId)
  }

  async initializeRepo(): Promise<void> {
    try {
      await fsPromises.mkdir(this.workspaceDir, { recursive: true })
      const isRepo = await git.isGit({ fs: gitFs, dir: this.workspaceDir })
      
      if (!isRepo) {
        await git.init({ fs: gitFs, dir: this.workspaceDir, defaultBranch: "main" })
      }
    } catch (error) {
      console.error("Error initializing git repo:", error)
      throw error
    }
  }

  async syncFromYjs(doc: Y.Doc): Promise<GitFileChange[]> {
    const filesMap = doc.getMap("files")
    const changes: GitFileChange[] = []

    // Get all files from Yjs
    filesMap.forEach((yText, filePath) => {
      if (yText instanceof Y.Text) {
        changes.push({
          path: filePath as string,
          content: yText.toString(),
        })
      }
    })

    return changes
  }

  async writeFilesToDisk(changes: GitFileChange[]): Promise<void> {
    for (const change of changes) {
      const filePath = path.join(this.workspaceDir, change.path)
      const dir = path.dirname(filePath)
      
      await fsPromises.mkdir(dir, { recursive: true })
      await fsPromises.writeFile(filePath, change.content, "utf-8")
    }
  }

  async createCommit(options: GitCommitOptions): Promise<string> {
    try {
      await this.initializeRepo()

      // Sync Yjs changes to disk
      // Note: In a real implementation, you'd pass the Yjs doc here
      // const changes = await this.syncFromYjs(doc)
      // await this.writeFilesToDisk(changes)

      // Stage all changes
      await git.add({ fs: gitFs, dir: this.workspaceDir, filepath: "." })

      // Create commit
      const sha = await git.commit({
        fs: gitFs,
        dir: this.workspaceDir,
        message: options.message,
        author: {
          name: "User", // TODO: Get from user data
          email: "user@example.com",
        },
      })

      return sha
    } catch (error) {
      console.error("Error creating commit:", error)
      throw error
    }
  }

  async createBranch(branchName: string): Promise<void> {
    try {
      await this.initializeRepo()
      await git.branch({ fs: gitFs, dir: this.workspaceDir, ref: branchName })
    } catch (error) {
      console.error("Error creating branch:", error)
      throw error
    }
  }

  async switchBranch(branchName: string): Promise<void> {
    try {
      await this.initializeRepo()
      await git.checkout({ fs: gitFs, dir: this.workspaceDir, ref: branchName })
    } catch (error) {
      console.error("Error switching branch:", error)
      throw error
    }
  }

  async getBranches(): Promise<string[]> {
    try {
      await this.initializeRepo()
      const branches = await git.listBranches({ fs: gitFs, dir: this.workspaceDir })
      return branches
    } catch (error) {
      console.error("Error listing branches:", error)
      return []
    }
  }

  async getCommits(limit: number = 10): Promise<any[]> {
    try {
      await this.initializeRepo()
      const commits = await git.log({
        fs: gitFs,
        dir: this.workspaceDir,
        depth: limit,
      })
      return commits
    } catch (error) {
      console.error("Error getting commits:", error)
      return []
    }
  }

  async getDiff(filePath?: string): Promise<string> {
    try {
      await this.initializeRepo()
      const diff = await git.statusMatrix({ fs: gitFs, dir: this.workspaceDir })
      // Convert status matrix to readable diff format
      // This is a simplified version
      return JSON.stringify(diff, null, 2)
    } catch (error) {
      console.error("Error getting diff:", error)
      return ""
    }
  }
}

// Generate commit message from file changes using AI
export async function generateCommitMessage(
  changes: GitFileChange[],
  aiService: any
): Promise<string> {
  const changeSummary = changes
    .map((c) => `${c.path}: ${c.content.substring(0, 100)}...`)
    .join("\n")

  const prompt = `Generate a concise git commit message for these changes:\n\n${changeSummary}\n\nCommit message:`

  try {
    const message = await aiService.generateText(prompt)
    return message
  } catch (error) {
    console.error("Error generating commit message:", error)
    return "Update files"
  }
}

