import { Octokit } from "@octokit/rest";
import { useRuntimeConfig, navigateTo } from "#app";
import { ref, onMounted } from "vue";

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null | undefined;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface PullRequest {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  user: GitHubUser;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  requested_reviewers: GitHubUser[];
  labels: any[];
  milestone: any | null;
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: {
    label: string;
    ref: string;
    sha: string;
    user: GitHubUser;
    repo: any;
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    user: GitHubUser;
    repo: any;
  };
  _links: any;
  author_association: string;
  auto_merge: any;
  active_lock_reason: string | null;
  merged: boolean;
  mergeable: boolean | null;
  rebaseable: boolean | null;
  mergeable_state: string;
  merged_by: GitHubUser | null;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

interface CommitInfo {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: {
    url: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      url: string;
      sha: string;
    };
    comment_count: number;
    verification: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
  };
  author: GitHubUser;
  committer: GitHubUser;
  parents: Array<{
    url: string;
    sha: string;
  }>;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: string;
    raw_url: string;
    blob_url: string;
    patch?: string;
  }>;
}

export const useGithub = () => {
  const config = useRuntimeConfig();
  const token = ref<string | null>(null);
  const user = ref<GitHubUser | null>(null);
  const loading = ref(false);

  const createOctokitInstance = () => {
    return new Octokit({
      auth: token.value,
    });
  };

  const getUser = async (): Promise<GitHubUser | null> => {
    if (!token.value) {
      const storedToken = localStorage.getItem("github_token");
      if (storedToken) {
        token.value = storedToken;
      } else {
        return null;
      }
    }

    loading.value = true;
    try {
      const octokit = createOctokitInstance();
      const { data } = await octokit.users.getAuthenticated();
      user.value = data;
      return data;
    } catch (error) {
      console.error("Error getting user:", error);
      token.value = null;
      localStorage.removeItem("github_token");
      user.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const login = () => {
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${config.public.githubClientId}&` +
      `scope=repo user&` +
      `redirect_uri=${encodeURIComponent(`${config.public.siteUrl}/auth/callback`)}&` +
      `allow_signup=true`;
    
    window.location.href = authUrl;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("github_token");
    navigateTo("/");
  };

  const getFileContent = async (
    path: string,
    ref = "main"
  ): Promise<string> => {
    const octokit = createOctokitInstance();
    try {
      const response = await octokit.repos.getContent({
        owner: "tiresomefanatic",
        repo: "heroechotemp",
        path,
        ref,
      });

      if ("content" in response.data) {
        return Buffer.from(response.data.content, "base64").toString();
      }
      throw new Error("Not a file");
    } catch (error) {
      console.error("Error getting file:", error);
      throw error;
    }
  };

  const saveFile = async (
    path: string,
    content: string | ArrayBuffer,
    message: string,
    branch = "main"
  ): Promise<string> => {
    const octokit = createOctokitInstance();
    try {
      let sha: string | undefined;
      try {
        const current = await octokit.repos.getContent({
          owner: "tiresomefanatic",
          repo: "heroechotemp",
          path,
          ref: branch,
        });
        if ("sha" in current.data) {
          sha = current.data.sha;
        }
      } catch (error) {
        // File doesn't exist yet, that's ok
      }

      let base64Content: string;
      if (content instanceof ArrayBuffer) {
        base64Content = Buffer.from(content).toString("base64");
      } else {
        base64Content = Buffer.from(content).toString("base64");
      }

      const response = await octokit.repos.createOrUpdateFileContents({
        owner: "tiresomefanatic",
        repo: "heroechotemp",
        path,
        message,
        content: base64Content,
        sha,
        branch,
      });

      return response.data.content.download_url;
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  };

  // Initialize on mount
  onMounted(async () => {
    const storedToken = localStorage.getItem("github_token");
    if (storedToken) {
      token.value = storedToken;
      await getUser();
    }
  });

  return {
    user,
    token,
    loading,
    login,
    logout,
    getUser,
    getFileContent,
    saveFile,
  };
};
