import { Octokit } from "@octokit/rest";
import { useRuntimeConfig, navigateTo } from "#app";
import { ref, onMounted, computed } from "vue";

// Define interfaces for all GitHub-related data structures
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  id: number;
}

export interface PullRequest {
  number: number;
  title: string;
  user: GitHubUser;
  html_url: string;
  mergeable: boolean;
  mergeable_state: string;
  files?: Array<{
    filename: string;
    patch?: string;
  }>;
  base: {
    ref: string;
  };
  head: {
    ref: string;
  };
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    avatar_url: string;
  };
}

// Main composable function for GitHub functionality
export const useGithub = () => {
  // Initialize runtime configuration and state
  const config = useRuntimeConfig();
  const user = ref<GitHubUser | null>(null);
  const loading = ref(false);

  // Initialize Octokit with stored token if available
  const octokit = new Octokit({
    auth: process.client ? localStorage.getItem("github_token") : undefined,
  });

  // Handle GitHub OAuth login
  const initiateLogin = () => {
    if (!process.client) return;

    const params = new URLSearchParams({
      client_id: config.public.githubClientId,
      redirect_uri: `${config.public.siteUrl}/auth/callback`,
      scope: "user repo",
      response_type: "code",
      allow_signup: "true",
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  // Handle user logout
  const handleLogout = () => {
    if (!process.client) return;
    localStorage.removeItem("github_token");
    user.value = null;
  };

  // Fetch authenticated user data
  const fetchUserData = async (): Promise<GitHubUser | null> => {
    if (!process.client) return null;

    const token = localStorage.getItem("github_token");
    if (!token) return null;

    loading.value = true;
    try {
      const { data } = await octokit.rest.users.getAuthenticated();
      user.value = data as GitHubUser;
      return data as GitHubUser;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Check if user is logged in
  const isLoggedIn = computed(() => {
    if (!process.client) return false;
    return !!localStorage.getItem("github_token");
  });

  // Create a fork of a repository
  const createRepositoryFork = async (owner: string, repo: string) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data } = await octokit.rest.repos.createFork({
        owner,
        repo,
        name: repo,
      });
      return data;
    } catch (error) {
      console.error("Error creating fork:", error);
      return null;
    }
  };

  // Create a new branch
  const createNewBranch = async (
    owner: string,
    repo: string,
    base: string,
    newBranch: string
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data: ref } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${base}`,
      });

      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha: ref.object.sha,
      });

      return true;
    } catch (error) {
      console.error("Error creating branch:", error);
      return null;
    }
  };

  // Create a pull request
  const createNewPullRequest = async (
    owner: string,
    repo: string,
    base: string,
    head: string,
    title: string,
    body: string
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data } = await octokit.rest.pulls.create({
        owner,
        repo,
        base,
        head,
        title,
        body,
      });
      return data;
    } catch (error) {
      console.error("Error creating pull request:", error);
      return null;
    }
  };

  // Save or update a file in the repository
  const saveFileContent = async (
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string,
    sha?: string
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data } = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
        sha,
      });
      return data;
    } catch (error) {
      console.error("Error saving file:", error);
      return null;
    }
  };

  // Get file content from repository
  const fetchFileContent = async (
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data } = (await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
      })) as { data: { content?: string } };

      if (data.content) {
        return Buffer.from(data.content, "base64").toString();
      }
      return null;
    } catch (error) {
      console.error("Error getting file content:", error);
      return null;
    }
  };

  // Get list of pull requests
  const fetchPullRequests = async () => {
    if (!isLoggedIn.value) return [];

    try {
      const { data } = await octokit.rest.pulls.list({
        owner: "tiresomefanatic",
        repo: "heroechotemp",
        state: "open",
      });

      const detailedPRs = await Promise.all(
        data.map(async (pr) => {
          const { data: prDetails } = await octokit.rest.pulls.get({
            owner: "tiresomefanatic",
            repo: "heroechotemp",
            pull_number: pr.number,
          });
          return prDetails;
        })
      );

      return detailedPRs as PullRequest[];
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      return [];
    }
  };

  // Get list of commits
  const fetchCommits = async () => {
    if (!isLoggedIn.value) return [];

    try {
      const { data } = await octokit.rest.repos.listCommits({
        owner: "tiresomefanatic",
        repo: "heroechotemp",
        per_page: 10,
      });

      return data as Commit[];
    } catch (error) {
      console.error("Error fetching commits:", error);
      return [];
    }
  };

  // Resolve merge conflicts
  const resolveConflictInFile = async (
    prNumber: number,
    filePath: string,
    resolution: "ours" | "theirs"
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data: pr } = await octokit.rest.pulls.get({
        owner: "tiresomefanatic",
        repo: "heroechotemp",
        pull_number: prNumber,
      });

      const resolutionBranch = `conflict-resolution-${prNumber}-${Date.now()}`;

      await createNewBranch(
        "tiresomefanatic",
        "heroechotemp",
        pr.base.ref,
        resolutionBranch
      );

      const content =
        resolution === "ours"
          ? await fetchFileContent(
              "tiresomefanatic",
              "heroechotemp",
              filePath,
              pr.base.ref
            )
          : await fetchFileContent(
              "tiresomefanatic",
              "heroechotemp",
              filePath,
              pr.head.ref
            );

      if (!content) {
        throw new Error("Could not get file content");
      }

      await saveFileContent(
        "tiresomefanatic",
        "heroechotemp",
        filePath,
        content,
        `Resolve conflict in ${filePath} using ${resolution} changes`,
        resolutionBranch
      );

      return true;
    } catch (error) {
      console.error("Error resolving conflict:", error);
      return null;
    }
  };

  // Return all functions with explicit names to avoid TypeScript errors
  return {
    login: initiateLogin,
    logout: handleLogout,
    getUser: fetchUserData,
    user,
    loading,
    isLoggedIn,
    createFork: createRepositoryFork,
    createBranch: createNewBranch,
    createPullRequest: createNewPullRequest,
    saveFile: saveFileContent,
    getFileContent: fetchFileContent,
    getPullRequests: fetchPullRequests,
    getCommits: fetchCommits,
    resolveConflict: resolveConflictInFile,
  };
};
