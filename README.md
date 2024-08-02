# Dentel X - Front End

Dental Clinic Management Software

Welcome to the Dental Clinic App! This application is designed to streamline and digitize the processes within a dental clinic, addressing the challenges of manual and disjointed operations. Built with React, the app aims to enhance the efficiency and organization of clinic management.

## Features

1. **Patient Records System**  
   This module allows for secure and easily accessible recording of patient information. It digitizes the Ficha-033 form, capturing patient data and procedures using an interactive Odontogram.

2. **Calendar System**  
   A comprehensive tool for planning medical appointments. This module provides functionalities to organize, schedule, reschedule, and cancel appointments as needed.

3. **Consultation System**  
   Simplifies the maintenance of patient consultation histories and integrates essential components for orthodontic studies and monitoring patient treatments.

## Coding Standard Documentation and Preemptive Error Detection

ESLint is a powerful and widely used static code analysis tool for web development projects. It helps developers maintain code quality, enforce coding standards, and catch potential errors or issues early in the development process. It will scan through every “.jsx” (React files) finding errors. Then, we redirect the STDOUT to a .txt file.

## Use of a continuous integration tool with quality data

Continuous Integration (CI): When a commit is pushed to the master branch of a repository hosted on a platform like GitHub, Vercel's CI system detects the change. It then triggers an automated build process. During this process, the code is compiled, dependencies are installed, and any specified tests are executed.
Continuous Deployment (CD): If the build process is successful and all tests pass, Vercel will proceed with the deployment of the application. It packages the built code and deploys it to the specified environment (production, staging, etc.).
