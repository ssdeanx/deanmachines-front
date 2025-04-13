# Software-planning Tool Ref

- start_planning

## Start a new planning session with a goal

Parameters
goal*
The software development goal to plan

- save_plan

## Save the current implementation plan

Parameters
plan*
The implementation plan text to save

- add_todo

## Add a new todo item to the current plan

Parameters
title*
Title of the todo item
description*
Detailed description of the todo item
complexity*
Complexity score (0-10)
codeExample
Optional code example

- remove_todo

## Remove a todo item from the current plan**

Parameters
todoId*
ID of the todo item to remove

- get_todos

## Get all todos in the current plan

- update_todo_status

## Update the completion status of a todo item

Parameters
todoId*
ID of the todo item
isComplete*
New completion status
