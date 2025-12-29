#!/bin/bash
cd /home/kavia/workspace/code-generation/bug-detector-50993-51125/WebDashboardFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

