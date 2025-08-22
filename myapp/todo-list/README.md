# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




The error message you're seeing indicates that there was a failure to fetch data in your LazyLoader component, likely due to a network request issue. This could be caused by several factors such as a bad API endpoint, network issues, or CORS (Cross-Origin Resource Sharing) restrictions. Below are some common causes and steps to troubleshoot the issue:

Common Causes of TypeError: Failed to fetch
Incorrect API Endpoint: The URL you are using in your fetch or axios request may be incorrect or misspelled.
CORS Restrictions: If you're making requests to a different domain than your React app's domain, CORS might be blocking the request.
Network Issues: The server might be down, or there could be issues with your internet connection.
Server Issues: The server might not be configured to handle the request method or might require specific headers (like Content-Type or authentication tokens).
Browser Extensions or Security Settings: Sometimes, browser extensions or strict security settings can block requests.
Steps to Troubleshoot and Resolve the Issue
Check API Endpoint: Ensure that the API endpoint is correct and accessible. You can test it in the browser or using a tool like Postman to see if it returns a valid response.

CORS Issues: If you're making requests to a different domain, ensure that the server allows cross-origin requests. You can often see CORS-related errors in the browser console.

Network Check: Make sure your internet connection is stable and the server is up and running.

Error Handling: Add more robust error handling to catch and display specific error details.

HTTPS/HTTP Mismatch: Ensure that both your React app and the API are served over the same protocol (either both HTTP or both HTTPS).



Life cycle methods comprise of a lot of stateful logic. Generally, this stateful logic is distributed amongst the different life cycle methods. 

For instance, consider you have a code that adds an event listener in componentDidMount. The componentDidUpdate method has some logic to set the event listeners. Cleanup code is written in the componentWillUnmount.

https://youtu.be/vNOjD4C351I

trouble shooting:=
<!-- set NODE_OPTIONS=--openssl-legacy-provider
npm start -->



C:\bindu\apnaweb\myapp\todo-list>dir
 Volume in drive C is Windows
 Volume Serial Number is A4AC-9906

 Directory of C:\bindu\apnaweb\myapp\todo-list

30-08-2024  23:38    <DIR>          .
18-07-2024  19:58    <DIR>          ..
25-06-2024  16:16               310 .gitignore
30-08-2024  23:38    <DIR>          node_modules
30-08-2024  23:36                 0 npm
30-08-2024  23:39                 0 npx
30-08-2024  23:38           834,323 package-lock.json
30-08-2024  23:38               872 package.json
30-08-2024  23:39    <DIR>          public
30-08-2024  23:28             5,495 README.md
30-08-2024  23:39    <DIR>          src
               6 File(s)        841,000 bytes
               5 Dir(s)  120,141,340,672 bytes free

cd C:\bindu\apnaweb\myapp\todo-list > dir

echo { "employee": [ { "empId": 1234, "name": "John", "designation": "SE" }, { "empId": 4567, "name": "Jack", "designation": "SSE" }, { "empId": 8910, "name": "Harry", "designation": "TA" } ] } > employee.json

npx json-server --watch employee.json --port 4500
--watch/-w can be omitted, JSON Server 1+ watches for file changes by default
JSON Server started on PORT :4500
Press CTRL-C to stop
Watching employee.json...

(˶ᵔ ᵕ ᵔ˶)

Index:
http://localhost:4500/
npm init -y
npm install express cors


Run the backend services of fastapi at 8000
uvicorn main:app --reload

cd todo-list
npm start