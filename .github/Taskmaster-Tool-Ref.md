# TaskMaster tool (QuickRef File)

- request_planning

Register a new user request and plan its associated tasks. You must provide 'originalRequest' and 'tasks', and optionally 'splitDetails'. This tool initiates a new workflow for handling a user's request.
The workflow is as follows:

1. Use 'request_planning' to register a request and its tasks.
2. After adding tasks, you MUST use 'get_next_task' to retrieve the first task. A progress table will be displayed.
3. Use 'get_next_task' to retrieve the next uncompleted task.
4. **IMPORTANT:** After marking a task as done, the assistant MUST NOT proceed to another task without the user's approval. The user must explicitly approve the completed task using 'approve_task_completion'. A progress table will be displayed before each approval request.
5. Once a task is approved, you can proceed to 'get_next_task' again to fetch the next pending task.
6. Repeat this cycle until all tasks are done.
7. After all tasks are completed (and approved), 'get_next_task' will indicate that all tasks are done and that the request awaits approval for full completion.
8. The user must then approve the entire request's completion using 'approve_request_completion'. If the user does not approve and wants more tasks, you can again use 'request_planning' to add new tasks and continue the cycle. The critical point is to always wait for user approval after completing each task and after all tasks are done, wait for request completion approval. Do not proceed automatically.

Parameters
originalRequest*
No description
splitDetails
No description
tasks*
No description

- get_next_task

Given a 'requestId', return the next pending task (not done yet).
If all tasks are completed, it will indicate that no more tasks are left and that you must wait for the request completion approval.
A progress table showing the current status of all tasks will be displayed with each response.
If the same task is returned again or if no new task is provided after a task was marked as done but not yet approved, you MUST NOT proceed.
In such a scenario, you must prompt the user for approval via 'approve_task_completion' before calling 'get_next_task' again.
Do not skip the user's approval step.
In other words:

- After calling 'mark_task_done', do not call 'get_next_task' again until 'approve_task_completion' is called by the user.
- If 'get_next_task' returns 'all_tasks_done', it means all tasks have been completed. At this point, you must not start a new request or do anything else until the user decides to 'approve_request_completion' or possibly add more tasks via 'request_planning'.

Parameters
requestId*
No description

- mark_task_done

Mark a given task as done after you've completed it. Provide 'requestId' and 'taskId', and optionally 'completedDetails'.
After marking a task as done, a progress table will be displayed showing the updated status of all tasks. After this, DO NOT proceed to 'get_next_task' again until the user has explicitly approved this completed task using 'approve_task_completion'.

Parameters
requestId*
No description
taskId*
No description
completedDetails
No description

- approve_task_completion

Once the assistant has marked a task as done using 'mark_task_done', the user must call this tool to approve that the task is genuinely completed.
Only after this approval can you proceed to 'get_next_task' to move on.
A progress table will be displayed before requesting approval, showing the current status of all tasks. If the user does not approve, do not call 'get_next_task'.
Instead, the user may request changes, or even re-plan tasks by using 'request_planning' again.

Parameters
requestId*
No description
taskId*
No description

- approve_request_completion

After all tasks are done and approved, this tool finalizes the entire request.
The user must call this to confirm that the request is fully completed.
A progress table showing the final status of all tasks will be displayed before requesting final approval.
If not approved, the user can add new tasks using 'request_planning' and continue the process.

Parameters
requestId*
No description

- open_task_details

Get details of a specific task by 'taskId'.
This is for inspecting task information at any point.

Parameters
taskId*
No description

- list_requests

List all requests with their basic information and summary of tasks.
This provides a quick overview of all requests in the system.

- add_tasks_to_request

Add new tasks to an existing request.
This allows extending a request with additional tasks.
A progress table will be displayed showing all tasks including the newly added ones.

Parameters
requestId*
No description
tasks*
No description

- update_task

Update an existing task's title and/or description. Only uncompleted tasks can be updated.
A progress table will be displayed showing the updated task information.

Parameters
requestId*
No description
taskId*
No description
title
No description
description
No description

- delete_task

Delete a specific task from a request.
Only uncompleted tasks can be deleted.
A progress table will be displayed showing the remaining tasks after deletion.

Parameters
requestId*
No description
taskId*
No description
