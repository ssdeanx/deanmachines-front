# Tool Fails

- "calculator", // semi-works doesnt provide an answer just a response
- "memory-query" // breaks agents, when used they can respond,  need to be removed from agent tools or refactored

## Testing

- "calculate-reward", // RL tool, not sure if it works but alot unread items in rlReward
- "define-reward-function", // RL tool, not sure if it works but alot unread items in rlReward
- "optimize-policy", // RL tool, not sure if it works but alot unread items in rlReward
- 'midjourney_create_images', // needs output schema patched
- "ai-sdk-prompt" // not tested yet, but seems to be a wrapper for the other tools
- "llm-chain", // not tested yet
- "create-graph-rag",
- "graph-rag-query",
- "wikipedia_search",
- "wikipedia_get_page_summary",
- "vector-query", // tiktoken vectorizer hasnt been tested yet
- "google-vector-query", // google vectorizer hasnt been tested yet
- "filtered-vector-query", // tiktoken vectorizer with metadata filter hasnt been tested yet
- "google-search", // google search tool hasnt been tested yet but probably needs checked its @agentic
- 'google_drive_list_files', // needs checked if output schema patched
- 'google_drive_get_file', // needs checked if output schema patched
- 'google_drive_export_file', // needs checked if output schema patched
- 'google_drive_create_folder', // needs checked if output schema patched
- 'google_docs_get_document', // needs checked if output schema patched
- "execute_python", // might work, pretty sure it does but not tested yet, could use typescript tool as well

## --- New Tools for Testing ---

- "e2b-execute-code"
- "e2b-read-file"
- "e2b-write-file"
- "e2b-install-package"
- "e2b-list-files"
- "github_get_user_by_username"
- "github_search_repositories"
- "github_list_user_repos"
- "github_get_repo"
- "github_list_repo_issues"
- "github_list_repo_pulls"
- "github_list_repo_branches"
- "github_list_repo_commits"
- "github_list_repo_releases"
- "github_search_code"
- "completeness-eval"
- "answer-relevancy-eval"
- "content-similarity-eval"
- "context-precision-eval"
- "context-position-eval"
- "tone-consistency-eval"
- "keyword-coverage-eval"
- "textual-difference-eval"
- "faithfulness-eval"
- "token-count-eval"

## Working Tools

- "format-content", // works
- "search-documents", // works
- "read-file", // works
- "write-file", // works
- "collect-feedback", // works
- "brave-search", // works
- "init-opentelemetry",
- "record-llm-metrics",
- "token-count-eval", // Specific memory tool
- "completeness-eval",
- "answer-relevancy-eval",
- "content-similarity-eval",
- "context-precision-eval",
- "context-position-eval",
- "tone-consistency-eval",
- "keyword-coverage-eval",
- "textual-difference-eval",
- "faithfulness-eval",
- "list-files",
- "edit-file",
- "create-file",
- "write-knowledge-file",
- "read-knowledge-file",
- "arxiv_search", // works
- "github_get_user_by_username", //  works only returns user info so needs ability to search repos
- "exa_search", // works great for searching
