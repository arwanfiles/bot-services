# Bot Services :robot:

Multi services node application for chatbot app. It's separate process in 3 service, Agent to handle receive and send message, Processor to process input from agent by text pattern, and Manager is the UI to monitor each service

## :alien: Agent
Service to handle receive and send message.

## :hourglass_flowing_sand: Processor
Service to process input from agent by text pattern
## :computer: Manager
UI to monitor each service

# Plan

:white_check_mark: [Agent] Create Restful API to create whatsapp session
:white_check_mark: [Agent] Create Restful API to show session list
:white_check_mark: [Agent] Create Restful API to delete session
:white_check_mark: [Agent] Create Restful API to send message
:white_large_square: [Processor] Create json config for question and answer
:white_large_square: [Processor] Create message processor to read input from agent and show output base on config
:white_large_square: [Processor] Create queue message
:white_large_square: [Manager] Create express skeleton app
:white_large_square: [Manager] Create dashboard menu to show all agent session
:white_large_square: [Manager] Create dashboard for bot builder