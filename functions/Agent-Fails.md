# Tool Fails

- "calculator", // semi-works doesnt provide an answer just a response
- "memory-query" // breaks agents, when used they can respond,  need to be removed from agent tools or refactored

## testing

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