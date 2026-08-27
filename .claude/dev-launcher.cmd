@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
set "LOVABLE_PREVIEW_HOST=id-preview--2ef7f8fa-ae4c-47d9-a782-23770ec1b550.lovable.app"
cd /d "%~dp0.."
call npm run dev
