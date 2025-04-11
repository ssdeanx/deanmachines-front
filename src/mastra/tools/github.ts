import { aiFunction, AIFunctionsProvider, assert, getEnv } from "@agentic/core";
import { createMastraTools } from "@agentic/mastra";
import { Octokit } from "octokit";
import { z } from "zod";

export namespace github {
  export interface User {
    id: number;
    login: string;
    name: string;
    bio: string;
    node_id: string;
    gravatar_id: string;
    type: string;
    site_admin: boolean;
    company: string;
    blog?: string;
    location?: string;
    hireable?: boolean;
    twitter_username?: string;
    email?: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    avatar_url: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    created_at: string;
    updated_at: string;
  }
}

/**
 * Agentic GitHub client.
 */
export class GitHubClient extends AIFunctionsProvider {
  protected readonly apiKey: string;
  protected readonly octokit: Octokit;

  constructor({
    apiKey = getEnv("GITHUB_API_KEY"),
  }: {
    apiKey?: string;
  } = {}) {
    assert(
      apiKey,
      'GitHubClient missing required "apiKey" (defaults to "GITHUB_API_KEY")'
    );
    super();

    this.apiKey = apiKey;
    this.octokit = new Octokit({ auth: apiKey });
  }

  /**
   * Get a user by username.
   */
  @aiFunction({
    name: "github_get_user_by_username",
    description: "Get a user by username.",
    inputSchema: z.object({
      username: z.string().describe("The username of the user to get."),
    }),
  })
  async getUserByUsername(
    usernameOrOpts: string | { username: string }
  ): Promise<github.User> {
    const { username } =
      typeof usernameOrOpts === "string"
        ? { username: usernameOrOpts }
        : usernameOrOpts;

    const res = await this.octokit.request(`GET /users/${username}`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return res.data;
  }
}

/**
 * Creates a configured GitHub client
 *
 * Note: This function returns a standard AIFunctionsProvider that should be
 * wrapped with `createMastraTools` from @agentic/mastra when added to extraTools in index.ts.
 *
 * @param config - Configuration options for the GitHub client
 * @returns A GitHubClient instance
 */
export function createGitHubClient(
  config: {
    apiKey?: string;
  } = {}
) {
  return new GitHubClient(config);
}

/**
 * Helper function to create a Mastra-compatible GitHub client
 *
 * @param config - Configuration options for the GitHub client
 * @returns An array of Mastra-compatible tools
 */
export function createMastraGitHubTools(
  config: {
    apiKey?: string;
  } = {}
) {
  const gitHubClient = createGitHubClient(config);
  return createMastraTools(gitHubClient);
}

// Export adapter for convenience
export { createMastraTools };
