# Lala Tech – Client Request Management

A lightweight web-based request management system designed to help teams track client requests, follow-ups, and completed work.

## 📌 Overview

Lala Tech helps teams manage incoming client requests without automatically turning every request into an employee task.

Some requests require clarification or additional information from the client before work can begin. The system therefore separates requests into different stages so that employees can clearly understand what needs action and what is currently waiting.

## ✨ Features

- 📥 Track incoming client requests
- 🔎 Search requests quickly
- 🔄 Filter requests by status
- 📋 View follow-up requests
- ⏳ Keep requests waiting for client information separate from active work
- ✅ Mark completed work
- 👤 Assign work only when a request is ready
- 📊 Sort requests for easier management
- 💾 Store request data in the application
- 🖥️ Simple and responsive interface

## 🔁 Request Workflow

A typical request can move through the following stages:

```text
Client Request
      │
      ▼
Need Clarification?
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
Waiting   Ready for Work
   │      │
   │      ▼
   │    Assigned
   │      │
   │      ▼
   │    In Progress
   │      │
   │      ▼
   └──► Completed
