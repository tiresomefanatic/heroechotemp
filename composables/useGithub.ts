import { Octokit } from "@octokit/rest";
import { useRuntimeConfig, navigateTo } from "#app";
import { ref, onMounted, computed } from "vue";

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  id: number;
}

export const useGithub = () => {
  const config = useRuntimeConfig();
  const user = ref<GitHubUser | null>(null);
  const octokit = new Octokit({
    auth: localStorage.getItem('github_token') || undefined
  });
  const loading = ref(false);

  const login = () => {
    const params = new URLSearchParams({
      client_id: '4c1c42d1d9d1a5c0c887',
      redirect_uri: 'https://tiresomefanatic.github.io/heroechotemp',
      scope: 'user repo',
      response_type: 'token',
      allow_signup: 'true'
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  const getUser = async (): Promise<GitHubUser | null> => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;

    loading.value = true;
    try {
      const { data } = await octokit.rest.users.getAuthenticated();
      user.value = data as GitHubUser;
      return data as GitHubUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const isLoggedIn = computed(() => {
    return !!localStorage.getItem('github_token');
  });

  const logout = () => {
    localStorage.removeItem('github_token');
    user.value = null;
  };

  const createFork = async (owner: string, repo: string) => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;

    try {
      const { data } = await octokit.rest.repos.createFork({
        owner,
        repo,
        name: repo
      });
      return data;
    } catch (error) {
      console.error('Error creating fork:', error);
      return null;
    }
  };

  const createBranch = async (owner: string, repo: string, base: string, newBranch: string) => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;

    try {
      const { data: ref } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${base}`
      });

      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha: ref.object.sha
      });

      return true;
    } catch (error) {
      console.error('Error creating branch:', error);
      return null;
    }
  };

  const createPullRequest = async (owner: string, repo: string, base: string, head: string, title: string, body: string) => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;

    try {
      const { data } = await octokit.rest.pulls.create({
        owner,
        repo,
        base,
        head,
        title,
        body
      });
      return data;
    } catch (error) {
      console.error('Error creating pull request:', error);
      return null;
    }
  };

  const saveFile = async (
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string,
    sha?: string
  ) => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;

    try {
      const { data } = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch,
        sha
      });
      return data;
    } catch (error) {
      console.error('Error saving file:', error);
      return null;
    }
  };

  const getFileContent = async (owner: string, repo: string, path: string, ref?: string) => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;

    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref
      }) as { data: { content?: string } };
      
      if (data.content) {
        return Buffer.from(data.content, 'base64').toString();
      }
      return null;
    } catch (error) {
      console.error('Error getting file content:', error);
      return null;
    }
  };

  return {
    login,
    logout,
    getUser,
    user,
    loading,
    isLoggedIn,
    createFork,
    createBranch,
    createPullRequest,
    saveFile,
    getFileContent
  };
};
